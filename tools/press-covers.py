"""Card covers for /press. Run by hand after adding articles to lib/press.ts (it needs a browser, so it stays out of the hourly build).

  python3 tools/press-covers.py            # covers for every article that has none yet
  python3 tools/press-covers.py --redo ID  # fetch one again (ID is the item's thumb id, e.g. techpp-428b6c)
  python3 tools/press-covers.py --shot --redo ID  # screenshot it even if it has an og:image (a bare site logo, say)

Most articles already have public/press/thumbs/<id>.jpg, their og:image at 640x360. When that file is the
generated stand-in (the outlet's icon on a flat gradient), the card deserves a real picture, so this tries
the article's og:image / twitter:image again and, failing that, screenshots the top of the article in
headless Chrome. Covers go to public/press/covers/<id>-<hash>.jpg: a new name each time, because jsDelivr
keeps serving a replaced file for hours. content/press-covers.json maps id -> file for the page.

Needs: pip install playwright pillow (it drives the installed Google Chrome, no browser download).
"""

import hashlib
import io
import json
import re
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageFilter, ImageStat

ROOT = Path(__file__).resolve().parent.parent
PRESS = ROOT / "lib" / "press.ts"
THUMBS = ROOT / "public" / "press" / "thumbs"
COVERS = ROOT / "public" / "press" / "covers"
MAP = ROOT / "content" / "press-covers.json"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
W, H = 640, 360
# Buttons that close a cookie or consent banner, in the languages the list covers.
# Text of the pages a bot check, captcha or country block shows instead of the article: no cover beats a picture of those.
BLOCKED = re.compile(r"Performing security verification|Just a moment|Verify you are human|Checking your browser|не робот|not allowed to access|Access denied|Attention Required", re.I)
CONSENT = ["Accept all", "Accept All", "Accept", "I agree", "Agree", "Got it", "OK", "Allow all", "Alle akzeptieren", "Akzeptieren",
           "Tout accepter", "Accepter", "Aceptar", "Aceitar", "Accetta", "Accetto", "Zgadzam się", "Akceptuję", "Принять", "同意", "接受", "동의"]

ROW = re.compile(r'\[\s*"((?:[^"\\]|\\.)*)",\s*"((?:[^"\\]|\\.)*)",\s*"((?:[^"\\]|\\.)*)",\s*"((?:[^"\\]|\\.)*)",\s*"((?:[^"\\]|\\.)*)",\s*"((?:[^"\\]|\\.)*)"\s*\]')


def items():
    """(outlet, headline, date, url, thumb, icon) for every article in lib/press.ts."""
    return [tuple(json.loads(f'"{v}"') for v in m) for m in ROW.findall(PRESS.read_text(encoding="utf-8"))]


def stand_in(path: Path) -> bool:
    """True for the generated thumb: mirrored flat corners and almost no detail outside the centred icon."""
    im = Image.open(path).convert("RGB")
    w, h = im.size
    near = lambda a, b: all(abs(x - y) <= 3 for x, y in zip(a, b))
    mirrored = near(im.getpixel((2, 2)), im.getpixel((w - 3, 2))) and near(im.getpixel((2, h - 3)), im.getpixel((w - 3, h - 3)))
    detail = ImageStat.Stat(im.convert("L").resize((160, 90)).filter(ImageFilter.FIND_EDGES)).mean[0]
    return mirrored and detail < 10


def fit(data: bytes) -> bytes | None:
    """The image cropped to 16:9 and saved as a ~640px JPEG, or None when it is too small or logo-shaped to be a cover."""
    try:
        im = Image.open(io.BytesIO(data)).convert("RGB")
    except Exception:
        return None
    w, h = im.size
    if w < 480 or w / h < 1.3:
        return None
    th = round(w * 9 / 16)
    if th <= h:
        top = (h - th) // 2 if w / h < 16 / 9 else 0
        im = im.crop((0, top, w, top + th))
    else:
        tw = round(h * 16 / 9)
        im = im.crop(((w - tw) // 2, 0, (w - tw) // 2 + tw, h))
    im = im.resize((W, H), Image.LANCZOS)
    out = io.BytesIO()
    im.save(out, "JPEG", quality=78, optimize=True, progressive=True)
    return out.getvalue()


def get(url: str, limit: int = 4_000_000) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read(limit)


def og_image(url: str) -> bytes | None:
    try:
        html = get(url, 1_500_000).decode("utf-8", "replace")
    except Exception:
        return None
    for prop in ("og:image:secure_url", "og:image", "twitter:image", "twitter:image:src"):
        m = re.search(rf'<meta[^>]+(?:property|name)=["\']{prop}["\'][^>]*content=["\']([^"\']+)', html, re.I) or re.search(
            rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]*(?:property|name)=["\']{prop}["\']', html, re.I)
        if m:
            src = urllib.request.urljoin(url, m.group(1).replace("&amp;", "&"))
            try:
                if (cover := fit(get(src))):
                    return cover
            except Exception:
                pass
    return None


def screenshot(page, url: str) -> bytes | None:
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
    except Exception:
        return None
    for _ in range(4):  # a bot check often clears itself within a few seconds
        page.wait_for_timeout(2500)
        if not BLOCKED.search(page.title() + " " + page.inner_text("body")[:2000]):
            break
    else:
        return None
    for label in CONSENT:
        try:
            btn = page.get_by_role("button", name=label, exact=True)
            if btn.count():
                btn.first.click(timeout=1500)
                page.wait_for_timeout(800)
                break
        except Exception:
            pass
    page.evaluate("window.scrollTo(0, 0)")
    return fit(page.screenshot(type="png"))


def main(argv: list[str]) -> int:
    redo = set(argv[argv.index("--redo") + 1:]) if "--redo" in argv else set()
    shot_only = "--shot" in argv
    covers = json.loads(MAP.read_text()) if MAP.exists() else {}
    todo = []
    for it in items():
        tid, thumb = it[4], THUMBS / f"{it[4]}.jpg"
        if tid in redo or (tid not in covers and (not thumb.exists() or stand_in(thumb))):
            todo.append(it)
    if not todo:
        print("every article has a cover")
        return 0
    COVERS.mkdir(parents=True, exist_ok=True)
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME)
        page = browser.new_page(viewport={"width": 1280, "height": 720}, user_agent=UA, locale="en-US")
        for outlet, _, _, url, tid, _ in todo:
            how, cover = "og:image", None if shot_only else og_image(url)
            if not cover:
                how, cover = "screenshot", screenshot(page, url)
            if not cover:
                print(f"{tid}: no cover, the card shows the outlet's icon")
                continue
            if tid in covers:
                (COVERS / covers.pop(tid)).unlink(missing_ok=True)
            name = f"{tid}-{hashlib.sha1(cover).hexdigest()[:6]}.jpg"
            (COVERS / name).write_bytes(cover)
            covers[tid] = name
            print(f"{tid}: {how} -> covers/{name} ({len(cover) // 1024} KB)  {outlet}")
        browser.close()
    MAP.write_text(json.dumps(dict(sorted(covers.items())), indent=1, ensure_ascii=False) + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
