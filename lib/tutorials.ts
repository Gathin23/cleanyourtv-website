import { VIDEOS, type Video } from "@/lib/videos";

// /tutorials: which of the press page's YouTube videos walk you through it, and in which language.
// Hand-kept, so correct it here. A video added to lib/videos.ts without a row is guessed from its title (see guess) until it gets one.

export type Kind = "tutorial" | "other";

export const LANGS: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ml: "Malayalam",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  th: "Thai",
  vi: "Vietnamese",
  id: "Indonesian",
  ms: "Malay",
  ar: "Arabic",
  pt: "Portuguese",
  es: "Spanish",
  fr: "French",
  de: "German",
  ru: "Russian",
};

/** id -> [tutorial or not, language]. "other" is news, roundups, overviews and warnings: still on the page under All. */
export const VIDEO_INFO: Record<string, [Kind, string]> = {
  "i0ytu6k8uac": ["other", "en"], // I Built My Own TV Operating System With Claude Code
  "dpOjBS1FAxg": ["tutorial", "en"], // I Removed Every Ad From My Google TV using Claude and No Roo
  "ckw_amuisog": ["tutorial", "en"], // This Makes Any Android TV 10x Faster!
  "YAaxqBvd1sY": ["tutorial", "en"], // How to debloat your Android TV with Claude Code
  "-s8wFpNUd9Y": ["tutorial", "en"], // Remove all Ads and Bloatware Apps from your TV With Claude C
  "vDYqh1FGrgQ": ["other", "en"], // AI News: Claude Duet Crushes; Amazing Grok Bot Updates; and 
  "tpif2AP59Qg": ["tutorial", "te"], // Android TV Slow & Ads? ఈ ఒక్క Trick తో కొత్త TV లా! | Debloa
  "qKyFi6j1XpA": ["other", "en"], // Everyone is hacking their TV ⟡ VoidZero Framework Open Sourc
  "MM3Y2NKoUxY": ["tutorial", "de"], // Claude hat meinen Fernseher wie neu gemacht
  "v13KTYfH-3k": ["tutorial", "pt"], // O que ninguém te conta sobre otimizar sua TV com IA
  "NoSi2layd2w": ["tutorial", "id"], // Cara Debloat Android TV / Box / Stick / STB pakai Ai Gratis,
  "dCS4er4Xcjo": ["tutorial", "hi"], // CLAUDE AI Changed My Android TV’s Vibe! (Full Tutorial - HIN
  "BrBQRNIDRS8": ["other", "en"], // Copy viral videos, change your TV’s OS, free MailChimp and a
  "_QDhmmKB530": ["tutorial", "pt"], // O Claude deixou minha TV velha parecendo nova
  "s-J6N-k_zjc": ["tutorial", "ar"], // ودّع واجهة تلفازك القديمة! 🔥 لانشر مجاني وخفيف يدعم العربية 
  "6I6wzCDz2Cc": ["tutorial", "en"], // Remove Ads and Bloatware from Your Android TV/Firestick for 
  "MFY88kCiUNI": ["tutorial", "en"], // I Removed Every Ad From My TV With One AI Prompt
  "Sh29R9v2G-4": ["tutorial", "th"], // ทีวีช้า กระตุก? แก้ได้ด้วย AI | Clean Your TV ปิดแอปขยะ Andr
  "HVfzeM6rFg8": ["tutorial", "en"], // I Cleaned Up My Android TV Using AI! 😱 Removed Bloatware, Ad
  "eYFiyX0ew7A": ["other", "en"], // Did Claude Really Ban REA? (Fact-Check)
  "LIV9FPkJO3U": ["tutorial", "en"], // AI Is Removing Ads From Smart TVs! 📺 Make Android TV Faster 
  "-u2FuQZ9HsU": ["other", "en"], // CleanYourTV: 6,000 Stars in 3 Days to Kill Smart TV Ads
  "mdMfkor-mvA": ["tutorial", "hi"], // I Found a FREE App to Debloat Your Smart TV!🤯  (Hindi)
  "v2YMR4ettHs": ["tutorial", "zh"], // 别再忍受Google TV广告了！用 AI 几行代码，把我的 ONN 4K Pro 变成“Apple TV”！（保姆级教
  "XuVY5cV7o1w": ["other", "en"], // People are using this Claude Code Repo to REVERSE ENGINEER T
  "PYgTElh4CSk": ["other", "en"], // GitHub Trending Weekly #54: git-ai, sill, Filee, Tracely-ai,
  "hO3rH-GC-t4": ["other", "en"], // Debloat Your Smart TV Over Wi-Fi With AI, Get an Apple TV-St
  "yC0uzCdTU94": ["tutorial", "id"], // Tutorial Debloat Android TV via phone | lewat HP
  "lHonkeutGvg": ["other", "en"], // CleanYourTV Strips Ads From 54 Smart TVs Free
  "WfNAexMzn68": ["other", "en"], // Claude can now "Hack"  your TV!
  "UjJwamPBEAg": ["other", "en"], // CleanYourTV: Debloat Any Android TV With One Prompt (16.5k S
  "fjzb5xZlENE": ["tutorial", "ar"], // من تلفزيون مليء بالإعلانات إلى شاشة عربية إسلامية… بمحادثة م
  "ca8Jepqhahs": ["tutorial", "zh"], // 2. 受够了电视开机广告！免刷机无线净化换装Apple TV极简桌面软件 | CleanYourTV TV VibeHa
  "HKYb49vftqk": ["tutorial", "en"], // I Removed the Clutter From Google TV | CleanYourTV
  "daW8bKZOS34": ["tutorial", "en"], // Hack Your Smart TV with AI (No Ads)
  "uI3Ah3U-YpU": ["tutorial", "en"], // How to Remove Ads from Android TV (No Root) with Claude Code
  "H--r-EG_Q3g": ["tutorial", "ar"], // Claude Code | ها كيفاش بدّلت واجهة التلفاز ديالي بالذكاء الا
  "VZZNbh8gTYI": ["other", "en"], // ❌ WARNING: Watch This Video Before Letting AI De-bloat Your 
  "6VzJZg8WR-E": ["tutorial", "zh"], // CleanYourTV：電視廣告一次清光，型號丟給 Claude Code 就好 #shorts
  "Z04OH8aEZYc": ["other", "zh"], // Github 1.3万星！AI 干掉电视广告，秒变干净苹果风
  "_zB3OufofGE": ["other", "en"], // An AI cleared the ads from his parents' Android TV
  "b4rR5VJvY8Y": ["other", "fr"], // Actus IA : ChatGPT permet enfin de VERROUILLER vos conversat
  "MTZEQ_0sa5Y": ["other", "en"], // CleanYourTV: LG WebOS debloat your LG TV!
  "46qfaPg4C-M": ["tutorial", "pt"], // Fiz um SISTEMA NOVO na minha TV com IA e ficou muito mais RÁ
  "FLTld9RAL5Q": ["tutorial", "es"], // Adiós anuncios en Android TV: limpié mi TCL con Claude Code 
  "LhY7uQqIbUE": ["other", "en"], // CleanYourTV GitHub Overview: Reversible Android TV Debloatin
  "GUJ6UgrO5aQ": ["other", "en"], // CleanYourTV - Streamline Your Android TV
  "Fb6ktrim7v8": ["tutorial", "zh"], // 安卓电视，过上苹果生活？我让 AI 帮它改了个造。去掉那些烦人的ad，干净清爽。
  "A8DAwbp3DnQ": ["other", "en"], // Get a clean, ad-free Apple TV-style home on your Android or 
  "HyOmD6Xe8Cw": ["other", "ru"], // Что нового в мире ИИ на этой неделе?
  "G_TPL2ff3xc": ["other", "en"], // cleanyourtv: Debloat your Android TV
  "cvsUNGdzPKc": ["tutorial", "en"], // Clean Up Sony Android TV! Remove Ads & Bloatware Using Your 
  "utbAfMd_ORI": ["other", "en"], // CleanYourTV: Debloat Android TV over Wi-Fi #Shorts
  "oLasOtMhiBE": ["tutorial", "en"], // CleanYourTV — Remove TV Ads & Bloatware, Get an Apple TV-Sty
  "1xLpesxv-5Q": ["other", "en"], // Slow Android TV? Don't bin it - debloat it with Claude Code
  "ymcdZRfBgDQ": ["other", "en"], // cleanyourtv: Free on GitHub. Netflix, minus the ads
  "KrOtiA9CvuI": ["other", "en"], // He Removed Ads From His TV Using AI 📺 #shorts
  "jquqVD-NtUA": ["other", "en"], // CleanYourTV: Turn Your Smart TV Into an Ad-Free Apple TV
  "6lxr1yESHhE": ["other", "zh"], // 800 萬人看過的 AI 用法：不會寫程式，也能叫 AI 把電視廣告清掉
  "ltLmuMkT5go": ["tutorial", "en"], // cleanyourtv Tutorial — What It Is & How To Use It
  "NIp4iX7kipw": ["tutorial", "en"], // Claude Code Wrote This Android TV a New Home Screen With No 
  "0ZSXTdf4Q1g": ["tutorial", "zh"], // 2分鐘教學｜Clean Your TV｜電視開機畫面重設｜電視刷機｜國外爆紅
  "jNh4TowXJk8": ["other", "te"], // AI తో Smart TV Ads తీసేశారు! కానీ ఇది Hacking కాదు | Claude 
  "Bvivx5aBStg": ["tutorial", "en"], // Debloat Your TV: Get an Apple TV UI on Android 📺
  "fe7rQXMLyJk": ["tutorial", "zh"], // 怎么给电视去广告？#AI #vibecoding  #AI编程 #电视 #cleanyourtv #ai
  "apE40gXzz2A": ["other", "en"], // Turn Any Android TV Into an Apple TV Style Home Over Wi-Fi: 
  "BhguEwXKOyE": ["other", "en"], // 22K Stars: Turn Any Android TV Into Apple TV [2026]
  "kMRHnluPZds": ["other", "en"], // His Parents' TV Showed an Ad Before Netflix. So He Let Claud
  "d4yk-xI6prs": ["other", "en"], // This Free Project Removes the Ads From Your Android TV
  "eU4RAEpHSbk": ["tutorial", "zh"], // 【8期】Clean your TV：一键清掉安卓电视广告 #CleanYourTV教程 #优化电视 #电视去广告
  "F-m88oJxL3k": ["tutorial", "en"], // CleanYourTV! Use Claude Code to Transform Your Android TV!
  "v8rQO404DW4": ["tutorial", "vi"], // [Đã có tool ở mô tả] Cách cài cleanyourtv lên android tv
  "CoCGgImxJjs": ["other", "en"], // People Are Using AI to Strip Ads From Google TV
  "uPDVZ8Aejb0": ["tutorial", "en"], // Claude Code Can Fix Your Slow Smart TV (Step by Step)
  "1VUtaY_Jaok": ["other", "en"], // This Trending Repo Removes Ads and Junk from Your Smart TV
  "umLvMUqlAts": ["other", "en"], // Stop Watching Ads on Your Own TV! This FREE Tool Cleans Any 
  "YsPXGLlbA-o": ["other", "en"], // cleanyourtv: Rip the Ads Off Your Android TV Home Screen (Fr
  "-Vrtz5u7lZ8": ["tutorial", "pt"], // SMART TV LENTA FICOU MELHOR QUE NOVA EM 5 MINUTOS COM CLAUDE
  "xiQNOMhg8hY": ["other", "en"], // How People Are Removing Smart TV Ads With AI
  "P-U9QpHmCNg": ["other", "en"], // Free tvOS makeover for Android TV with tv‑vibehack
  "_hQsiqyk824": ["other", "en"], // Meta's 816B Open Model vs DeepSeek: Same Score, 3.5× Cheaper
  "At1lLwg_CsI": ["tutorial", "zh"], // 电视广告太烦？用AI给电视减负！换干净桌面可还原，不用Root也能搞定！#电视直播 #电视点播 #电视应用 #电视软件
  "dGAoxdpJ6ik": ["other", "en"], // People Are Using AI to Make Their Smart TVs Dumb Again
  "9YpOOYS4yvw": ["tutorial", "en"], // Sony X90CH Customization: Remove Bloat & Try a New Home Scre
  "2mbucw9O1o4": ["tutorial", "en"], // I Removed Google TV Bloat & Built My Own Home Screen!
  "NyLS0_wmsOs": ["tutorial", "en"], // Mi TV Makeover: No Ads, Custom Home Screen & Live Screensave
  "UOEXWFcc0VU": ["tutorial", "fr"], // Transforme ta Google TV avec cette IA (CleanYourTV)
  "a7_451PqEQ0": ["tutorial", "en"], // I Turned My Bloated Google TV Into an Apple TV (For Free, Wi
  "7YJC7yb4GVY": ["other", "en"], // People Are Using AI Agents to Make Their Smart TVs Dumb Agai
  "tJTLOcN450w": ["other", "en"], // CleanYourTV: The Funniest Way to Get Ads Off Your TV
  "mVazf38N7Y8": ["tutorial", "en"], // How To Claude Code Your TV (Setup + 4 Use Cases)
  "Fb18z0Y1km8": ["other", "en"], // AI can switch off the junk on old Android TVs
  "q2igeTRx-CY": ["other", "ja"], // 【AIでテレビの広告を消す】Claude Codeの草の根ブームとDumbTVをやさしく解説・あなたの家電も作り替え
  "WPPJ3H4OtYg": ["tutorial", "en"], // How to Remove Ads From Your Smart TV With AI
  "GVRMF4pULVk": ["tutorial", "en"], // I Removed Every Ad From My Smart TV With AI (No Root)
  "vUfdRl6ASYY": ["other", "en"], // AI Agents Are Stripping Advertising From Smart TVs
  "5jLTsunWLiw": ["tutorial", "en"], // CleanYourTV Add-ons Guide: Themes, Settings & More
  "yvg55BfTT9Y": ["other", "en"], // Your TV Is Cheap Because of Ads. Claude Code Turns Them Off.
  "NZiuLXyLwWQ": ["other", "en"], // GPT-6 COBOL Migration, DeepSeek DeepInfer & CleanYourTV | AX
  "mUokZxM9XVs": ["tutorial", "en"], // How to Debloat Android Smart TV Free, No Root (Disable Bloat
  "Sb4WNWU0NOA": ["tutorial", "es"], // CleanYourTV: cómo quitar los anuncios de tu Google TV / Andr
  "ky-x7RSKXEA": ["tutorial", "zh"], // 电视首页全是广告？一句话让 AI 帮你关掉（不卸载、随时还原）
  "9FM-bUAQnhc": ["other", "en"], // Why Your TV Is So Slow — And How to Fix It
  "wg0N8AkK_Zg": ["tutorial", "es"], // Smart TV: la IA le QUITA los anuncios en 15 min
  "fkfDp24X5Mo": ["tutorial", "vi"], // Nhờ Claude AI "giải phóng" chiếc TV Xiaomi – màn hình mới, k
  "55a4eXQFuE0": ["tutorial", "en"], // I Made My Android TV FASTER With One Prompt! (Completely FRE
  "JjBlTjuD7zM": ["other", "en"], // Before You Debloat Your TV: CleanYourTV & DumbTV Risks
  "ZcwY92tHZYc": ["other", "pt"], // SUA SMART TV TE VIGIA? A IA ESTÁ MUDANDO TUDO!
  "Fq4WBSDFOy4": ["other", "en"], // Claude Code's Triple Play: Fork Subagents, TV Hacks, and a P
  "pFOFXJsdi1o": ["tutorial", "de"], // Smart-TV Detox: Werbefrei & 3x schneller per ADB & KI-Agent 
  "JCBI-WfWBpU": ["other", "ja"], // 【現場10/21】テレビの広告をClaude Codeで消すの、3日半でスター1.19万｜AIの現場 2026年10月2
  "iYQSFlsqayA": ["other", "en"], // He Let Claude Code Clean His Parents' Smart TV. 25 Apps Swit
  "mYdDj3tXqFA": ["other", "en"], // [EN 10/21] Killing TV ads with Claude Code: 11.9K stars | AI
  "1AMPYrQrlCI": ["other", "en"], // 4 free AI tools that actually passed my test — and the catch
  "5g_EroLGKqQ": ["other", "en"], // Claude Code Wipes Android TV Ads — AX Trend Short #3345
  "s8MWwfKJ_lc": ["tutorial", "en"], // Your TV Can Run a Whole New OS. Here's How!
  "J5lrh4mig_I": ["other", "en"], // How People Are Using AI to Fix Smart TVs (Claude Code Overha
  "dinwm7aYehQ": ["other", "ms"], // Orang Ramai Suruh Claude Code Buang Iklan dari Smart TV, Rib
  "DQPSM5gK2TU": ["other", "en"], // Your TV Is Watching You. So People Got AI to Fight Back.
  "nvSq8ssxXD0": ["other", "en"], // AI Killed TV Ads, Built a Free Photoshop & Found a 10-Year B
  "_aWZ5uI130M": ["other", "en"], // People Are Using AI to Kill Their TV Ads
  "J4sr1D4dc54": ["tutorial", "en"], // Make Your Slow Android TV 10x Faster with ONE AI Prompt (No 
  "KYk-cKF1g6Y": ["other", "en"], // 10 New GitHub Repos You Should Know (An AI Uses a Real iPhon
  "W3nVNvO1AGM": ["other", "en"], // 6 Free AI Tools Worth Using Right Now (October 2026)
  "PgvWUs6BRM0": ["other", "ml"], // Gaming News Malayalam Episode 3
  "1xQ8E96bWco": ["tutorial", "hi"], // Smart TV Ke Ads Kaise Hataye? Sirf Phone Se, No Laptop (2026
  "50KDUb_o3n8": ["tutorial", "en"], // CleanYourTV: How ADB Over Wi-Fi Cured My Smart TV's 1.2GB RA
  "y4IvB_qKWdM": ["other", "en"], // Claude Code Is Evicting the Ads From Your TV -- AI Brief Oct
  "w6z_NKvI8T0": ["other", "en"], // Android ADB Wireless Pairing Explained
  "n1mRAw6n3Qo": ["other", "en"], // Before Claude Code Debloats Your TV, Read These 8 Rules
  "ABcprZV_b_s": ["other", "pt"], // Pediram para uma IA limpar a smart TV. Ela tirou os anúncios
  "R48P0Jlwjvw": ["other", "en"], // Remove Smart TV Ads With AI? Here's What Can Go Wrong
  "lxEKbrB88PQ": ["tutorial", "th"], // เปิดทีวีทีไร เจอแต่โฆษณา วันนี้เลยล้างทิ้งให้หมด! CleanYourT
  "BGrDGGghryU": ["other", "en"], // Refine , Rebuilt with CleanyourTV
  "9poLR415DTQ": ["other", "th"], // Vibe Coding ทีวี เทรนด์ผู้ใช้ AI ลบโฆษณาและปรับแต่งหน้าจอสมา
  "r__WxDOVjmM": ["other", "ru"], // Нейро-Радио, 21 октября: Claude придумал белки против яда ск
  "AAXpvWYMMf0": ["tutorial", "ko"], // 아직 TV 광고 보세요? 클로드가 꺼 줍니다
  "iEKDwPjKP54": ["other", "en"], // Don’t Debloat Your Smart TV Until You See This
  "JigLJ70ckgk": ["other", "en"], // Claude Makes Your Smart TV Faster Samsung, LG, Google & Fire
  "-2jEQ1gw_vU": ["other", "en"], // People Are Using AI to “Fix” Their Smart TVs. Start Here Fir
  "TGwzhZKViqg": ["other", "en"], // Remove Ads From Your TV and Make It Fast (Samsung, LG, Xiaom
  "Dfi24qBs0qE": ["other", "en"], // Claude Code took over his TV
  "4LmNLzwKTwM": ["tutorial", "en"], // How to Hack Your TV With Claude Code (Goodbye, Home Screen A
  "9imyUTQpzVM": ["tutorial", "en"], // Personalize Your TV with Claude and Ditch the Ads
  "n2bxxufIC_c": ["tutorial", "zh"], // 电视开机后的广告，真的能自己关掉吗？ #cleanYourTV #tvvibehack #电视去广告 #豆包 #解锁电视
  "tm2qLCnfiHA": ["other", "en"], // Why People Are Using AI to Take Back Their TVs
  "1bG0x9M7znA": ["tutorial", "zh"], // HIMEDIA H8 Pro 上古神器 AI 助力復活
};

/** The four the page opens with: clear walk-throughs with the most views, one of them not in English. */
export const FEATURED = ["YAaxqBvd1sY", "dpOjBS1FAxg", "ckw_amuisog", "dCS4er4Xcjo"];
/** The three small ones under the set-up steps on the home page: English first, then the most watched non-English walk-through. */
export const HOME_PICKS = ["YAaxqBvd1sY", "dpOjBS1FAxg", "tpif2AP59Qg"];

const HOW = /\b(how to|tutorial|step by step|guide|setup|set up|debloat|remove|removed|clean(ed)? up|cara|como|cómo|comment|anleitung|cách)\b|教程|教學|保姆/i;

/** A new video's best guess until it has a row: the script in its title for the language, keywords for the kind. */
function guess(v: Video): [Kind, string] {
  const t = `${v.title} ${v.channel}`;
  const lang =
    /[\u0C00-\u0C7F]/.test(t) ? "te"
    : /[\u0E00-\u0E7F]/.test(t) ? "th"
    : /[\u0600-\u06FF]/.test(t) ? "ar"
    : /[\uAC00-\uD7AF]/.test(t) ? "ko"
    : /[\u3040-\u30FF]/.test(t) ? "ja"
    : /[\u4E00-\u9FFF]/.test(t) ? "zh"
    : /[\u0400-\u04FF]/.test(t) ? "ru"
    : "en";
  return [HOW.test(v.title) ? "tutorial" : "other", lang];
}

export type TutorialVideo = Video & { kind: Kind; lang: string };

export const TUTORIAL_VIDEOS: TutorialVideo[] = VIDEOS.map((v) => {
  const [kind, lang] = VIDEO_INFO[v.id] || guess(v);
  return { ...v, kind, lang };
});
