import { VIDEOS, type Video } from "@/lib/videos";

// /tutorials: which of the press page's videos (YouTube and Bilibili) walk you through it, and in which language.
// Hand-kept, so correct it here. A video added to lib/videos.ts without a row is guessed from its title (see guess) until it gets one.

export type Kind = "tutorial" | "other";

export const LANGS: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ml: "Malayalam",
  ta: "Tamil",
  mr: "Marathi",
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
  tr: "Turkish",
  ur: "Urdu",
  uk: "Ukrainian",
  fa: "Persian",
  pl: "Polish",
  it: "Italian",
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
  "fBvo05Li4To": ["tutorial", "ml"], // നിങ്ങളുടെ TV ഇനി പുതിയത് പോലെ Clean Your TV: Remove Ads & Bl
  "kaTm78_VW18": ["tutorial", "fr"], // Ma télé était devenue un panneau publicitaire… j'ai réglé ça
  "eGhoRMAqvtc": ["tutorial", "en"], // clean your android TV in 3 mins! ✨ (new easy method)
  "ZefYOxl-cYs": ["tutorial", "en"], // Clean Up Your Google TV From Your Phone! | CleanYourTV
  "V8cpKXNZLLs": ["other", "ru"], // Этот репозиторий отключит слежку, рекламу на вашем телевизор
  "_OyZUhFfB-c": ["tutorial", "en"], // ChatGPT Struggled, Claude Nailed It: My Android TV Now Looks
  "mEYFZdfLJds": ["tutorial", "en"], // Android TV — How to Use CleanYourTV to Remove Ads & Bloatwar
  "XC97Cv2-Xs4": ["tutorial", "es"], // Le pedí a una IA que limpiara mi televisor 😱📺 | CleanYourTV 
  "tzTWkMyK2gM": ["tutorial", "en"], // I Let Claude Code Take Control Of My Android TV And It Built
  "tHZX5Ww2Rx8": ["tutorial", "en"], // JVC Android TV — How to Install a Custom Launcher
  "vIO631-wpYw": ["other", "en"], // Clean Your Android TV Right From Your Phone 📺
  "-6NxCu1fHX0": ["tutorial", "en"], // Claude Made My Android TV Super Fast & Ad-Free
  "GDL6uUpplb4": ["tutorial", "en"], // Remove Ads From Your Smart TV With AI (Free, No Root)
  "iNCBXDgpG9U": ["other", "en"], // Smart TV Ads: What AI Can Change (and What It Can't)
  "0txQbaHjdDA": ["tutorial", "en"], // I Let Claude Code Optimize My Android TV — Before vs After
  "Ne5cC0BkLAk": ["other", "en"], // CleanYourTV vs Aerial: which one dumbs your TV down?
  "7MVgWacyV7s": ["tutorial", "en"], // Android TV — How to Remove Ads from the Home Screen
  "7m98EuprJ68": ["other", "en"], // Your Smart TV, Without Ads? Meet CleanYourTV
  "9aTdeeurUd4": ["other", "fr"], // Claude transforme des TV : nouvel OS ou nouvel accueil ?
  "W2j0LHwfjkY": ["other", "ta"], // Did Anthropic Just DESTROY OpenAI? 🤯 Claude Duet, Grok iPhon
  "mli1QxgwD54": ["other", "en"], // People are using Claude Code to strip the ads off their TVs
  "w6G7ASxt0ng": ["other", "en"], // Claude Code removed 25 apps from a smart TV
  "-DtSozDzL0g": ["tutorial", "es"], // Smart TV SIN ANUNCIOS usando IA
  "_tnk1B-aDSE": ["tutorial", "es"], // Cómo Eliminar la PUBLICIDAD de tu Smart TV y Dejarla RÁPIDA 
  "X1-Nlp07DFw": ["other", "en"], // AI News This Week: Claude Duet, Notion Agents and Claude Cod
  "-q_TJuaGnbo": ["other", "es"], // ¿Y si lo mejor para tu tele es hacerla más TONTA?
  "1XYpNW5jScs": ["other", "es"], // Hackea tu tele, tu Kindle y tu aspiradora con Claude Code
  "s2c5wKWUtw8": ["other", "zh"], // 本週新建開源專案星數 TOP 5：AI 幫你把電視清乾淨、DeepSeek 推論引擎開源｜GitHub 新星週報 #3
  "Gy8BThr06KA": ["tutorial", "tr"], // kavunOS Kurulumu: Xiaomi Mi TV Stick’i 2–3 Kat Hızlandırın (
  "s3UwXXlpiMU": ["tutorial", "en"], // Remove Android TV Home-Screen Ads with CleanYourTV
  "dWwuzGoOnTA": ["tutorial", "zh"], // cleanyour.tv 佈景主題的優化,隱藏標題,dock半透明,縮小圖示
  "OLJgyVycq5I": ["tutorial", "pt"], // Transformei minha TV numa Apple TV (sem anúncios) com IA
  "MVFWtqzVSfI": ["other", "en"], // Clean the Ads Off Your Smart TV With One Open-Source Repo (C
  "CUHVS5XquMI": ["other", "en"], // AI Can Now Hack Your Smart TV. 7 Real Examples
  "KY-__0FU64A": ["other", "en"], // Forslag: what's on your streaming services, on one Android T
  "xx-VxMhXJCo": ["other", "en"], // I Reverse-Engineered My Fridge - Claude Opus 5.5 Music Video
  "27mu7l8Eesc": ["other", "en"], // CleanYourTV is an open-source TV cleaning tool designed to r
  "9z1vqNl96Cs": ["other", "mr"], // AI Is Removing Ads From Smart TVs
  "Y3d5havVXgE": ["tutorial", "en"], // This Made My Android TV Faster & Ads Free ⚡️
  "y5oXyxKyF4k": ["tutorial", "en"], // Turn Any Google TV into Real Apple TV! (No PC, No CLAUDE)
  "8VHxxtm_-4k": ["other", "en"], // People Let Claude Hack Their Smart TVs. Here's What Actually
  "BV1SYnz61Enp": ["other", "zh"], // 有了AI，终于不用忍受满是广告的电视界面了
  "BV1tbnq66Exn": ["tutorial", "zh"], // cleanyourtv安装教程
  "BV1HFnA6YECT": ["tutorial", "zh"], // 电视改造：CleanYourTV 部署，干净无广告 TV
  "BV1punR67E9a": ["other", "zh"], // 夯爆了！Github 又出狠活神器！CleanYourTV 是 GitHub 上一个开源的电视清理项目，专门收拾电视上那
  "BV1tenT6REEr": ["other", "zh"], // AI帮你电视去广告？秒变Apple TV风格
  "BV1ajHT6cE3V": ["other", "zh"], // 你家电视终于有救了！GitHub大佬把“cleanyourtv”做成了手机APP，一键清理Android TV预装、广告
  "BV1pTHP66EVs": ["tutorial", "zh"], // 安装CleanYourTV+Aerial一键优化电视，替换桌面home，精简无用程序，打造纯净桌面，清爽大屏！
  "BV1yAHV6PEyA": ["other", "zh"], // 最近爆火的这两款 GitHub 开源神器CleanYourTV+Aerial，彻底净化安卓电视广告，秒变 Apple T
  "BV1b3n46GEzC": ["other", "zh"], // clean your tv，一键清理你的电视系统自带应用，打造极简数字人生
  "BV1Uwn16cE6n": ["tutorial", "zh"], // 测评打假 cleanyourtv净化桌面到底是不是真的， 实测 电视桌面净化效果 cleanyourtv实测#真干活用搭
  "BV1AsnB6PED6": ["other", "zh"], // cleanyourtv电视去广告软件，专门收拾电视上那些关不掉的预装应用和开机广告
  "BV1wLHM6DExS": ["other", "zh"], // 来自民间大佬制作APP，Github上爆火的电视优化开源工具，CleanYour TV终于有了APP版，不用AI、不用电
  "BV1Sdn66UEww": ["tutorial", "zh"], // 电视优化开源神器cleanyourtv完整使用教程告别电视弹窗广告清除预装广告与臃肿软件直接替换极简桌面，对标Apple
  "BV1uJn96QEEb": ["other", "zh"], // 夯到爆！CleanYourTV，一款能自动删除电视中的广告组件的开源项目，无需root和数据线，只需连同一个WiFi即可
  "BV1mTnm6vEL2": ["tutorial", "zh"], // [001期】电视优化开源神器cleanyourtv使用教程，清除预装广告与臃肿软件、替换极简桌面，对标AppleTV!随
  "BV1iFnb6tEiL": ["tutorial", "zh"], // CleanYourTV电视去广告教程
  "BV1qZn86qECd": ["tutorial", "zh"], // 拯救老电视，clean your tv安装使用教程，去掉电视广告和预装的应用app,实测使用设置跟风避雷
  "BV1winH6DE7K": ["tutorial", "zh"], // 第006期：【tv电视去广告教程】 CleanYourTV 是 GitHub 上一个开源的电视清理项目，专门收拾电视上那
  "BV1KFn86EE8M": ["tutorial", "zh"], // 电视优化开源工具！教你用Ai帮你部署cleanyourtv
  "BV1sMnp6ZEQT": ["tutorial", "zh"], // cleanyourtv电视去广告教程，专门收拾电视上那些关不掉的预装应用和开机广告。#百度搭子 #办公就用dumate 
  "BV1zyHu6SEkc": ["tutorial", "zh"], // 老旧电视满血复活！开源神器 CleanYourTV，支持手机直接操作，免 Root 免刷机，清掉开机广告和预装应用，一键
  "BV1QnnZ6iEf6": ["other", "zh"], // 真没想到国产电视也能对面Apple TV了，没有广告，界面干净整洁，他就是GitHub 上一位大神开源的cleanyou
  "BV1qqnb6AEh8": ["tutorial", "zh"], // 电视改造｜部署 CleanYourTV，告别弹窗广告，清爽看电视 改造干净观影端
  "BV1HQnn6DEpL": ["tutorial", "zh"], // 【小米四+安卓6.0】豆包自动安装Clean your Tv
  "BV1XcnS67Evt": ["other", "zh"], // 我让 AI 给小米电视收拾了一下，终于想开机了
  "BV1fenQ6YEgt": ["other", "zh"], // 电视优化开源神器cleanyourtv，告别电视弹窗广告、清除预装广告与臃肿软件、替换极简桌面，对标AppleTV！随时
  "BV1eonx6QEnN": ["tutorial", "zh"], // CleanYourTV 电视去广告完整教程｜一键清理电视弹窗广告
  "BV1bRnb6DEcL": ["other", "zh"], // 百度搭子爆改安卓老电视剧对标apple TV #科技#ai tv- vibehack#github #百度搭子#电视
  "BV1Psxj6HEs6": ["other", "zh"], // 全球电视解放运动：一句话让 AI 干掉电视开机广告！
  "BV15pnt69EH4": ["other", "zh"], // CleanYourTV，能自动删除电视中的广告组件
  "BV15Bn469Epx": ["other", "zh"], // 开源工具 CleanYourTV，一键清除电视开机广告
  "BV15pnt69EMC": ["tutorial", "zh"], // [001期】电视优化开源神器cleanyourtv使用教程，告别电视弹窗广告、清除预装广告与臃肿软件，对标AppleTV
  "BV12Bnt6kE48": ["other", "zh"], // 智能电视太卡太卡？GitHub热榜教你一键去广告瘦身
  "BV1xcx76dEdM": ["other", "zh"], // 74期 安卓电视首页太乱 常用应用收纳与预装内容整理一次看清
  "BV1mYsX6ZEjd": ["other", "zh"], // 有了Ai，确实门槛低了很多，电视简洁到爆炸，好看又快捷
  "BV1VjnZ6gE4N": ["other", "zh"], // 电视开机后的广告，真的能自己关掉吗？
  "BV1a7nc6GEoS": ["other", "zh"], // 把电视丢给Claude问"能黑了它吗"，当天广告和预装全没了
  "BV1PDnp6FEd4": ["other", "zh"], // AI 全程编写！透明 Dock + 扫码传文件 + 自动装应用，这台电视被我改造成这样
  "BV11En46qEgA": ["other", "zh"], // 800万人看过的AI用法：电视广告全清了
  "MK5ZPTC9gRg": ["other", "es"], // Le pidió a una IA que HACKEARA su TV. Lo que quitó explica t
  "mQgqK6f53J0": ["other", "ru"], // Нейросеть взломала телевизор: что произошло?
  "WATs7gxnJkg": ["tutorial", "ru"], // Как подключить ТВ к ChatGPT / Claude: Ускоряем Android TV и 
  "fzc3rJZLuBY": ["other", "ru"], // Лучшая настройка для тв в 2026г!
  "XjDqxu5A52M": ["other", "ru"], // ChatGPT Codex переделал мой телевизор. Тормоза исчезли за 1 
  "2gd5-yrBW68": ["tutorial", "ru"], // КАК УСКОРИТЬ ANDROID TV С ПОМОЩЬЮ ИИ? CleanYour TV — ЭТО НУЖ
  "6ZD2X-pN35g": ["other", "fa"], // تبلیغای تلویزیون رو با Claude پاک کرد! ۴۱ هزار ستاره در ۱۰ ر
  "CIWa9aJSjhE": ["other", "en"], // Claude can wipe the ads off your TV, but close this port
  "mzG1l_rnFlM": ["tutorial", "en"], // I Used Claude Code to Remove Ads From My Smart TV
  "kGC4fCaA7WI": ["tutorial", "en"], // Claude Code Removes the Ads From Your TV (Free Repo)
  "ZFXVzJ63hX8": ["tutorial", "en"], // CleanYourTV Explained – How Does It Work
  "rGG3xbmkbCI": ["other", "hi"], // Speed Up Android TV Using Claude AI – No Ads, No Lag, Apple 
  "fK-AUABKAWY": ["tutorial", "en"], // Clean Up Your Smart TV using Your Phone!
  "7i_9vufDjco": ["tutorial", "hi"], // Removed Ads & Bloatware From My Android TV Using ONLY My Pho
  "wmNaesYNQ6U": ["tutorial", "hi"], // Finally! An Easy Way to Debloat Your Smart TV From Your Phon
  "DFvQjxqxUBA": ["tutorial", "te"], // Google TV 10X Faster! 🔥 Remove Ads & Bloatware | Speed Up Yo
  "DdgI0IAHNYk": ["tutorial", "en"], // I Removed Google TV Ads & Bloatware Using AI!
  "ndjvB_KAWJc": ["tutorial", "hi"], // I Cleaned My TV With AI and It Feels Brand New | Remove Ads 
  "6wAXz_pWWDI": ["tutorial", "hi"], // Finally! An Easy Way to Debloat Your Smart TV From Your Phon
  "n0IO9g7dAiU": ["tutorial", "hi"], // Claude Code Se TV Ke Ads Kaise Hataye? Full Step by Step (20
  "GuCcvLNa-6s": ["other", "hi"], // I Used AI to Make My TV 10X Better!
  "-HJ8Ad8Rpvo": ["tutorial", "es"], // ChatGPT dejó mi Google TV como NUEVO y SIN ANUNCIOS!
  "HFs_QPIBz78": ["other", "te"], // Same TV, ₹0 — Ads అన్నీ పోయాయి! 🤯 Apple TV Look #shorts
  "nFxwqU3gCB8": ["other", "it"], // Ho collegato Claude Code alla mia vecchia Android TV: ecco c
  "3r4WjMC1KO0": ["tutorial", "en"], // CleanYourTV 3.0
  "XClfk2Ha1oA": ["tutorial", "en"], // Forget Claude - the EASY way to CLEAN UP a SmartTV
  "wi27YkNB1H0": ["tutorial", "fr"], // J'ai supprimé les bloatwares d'Android TV avec Clean Your TV
  "1nn0Mw4HKK4": ["other", "te"], // I Transformed My Android TV into Apple TV Style Using ChatGP
  "CIgifJGiCcI": ["other", "en"], // Claude Can Hack Your TV With This Prompt
  "YG4GF64-6lk": ["other", "en"], // People Are Redesigning Their TVs With Claude Code
  "biK-LCv9mNA": ["other", "hi"], // Claude replaces TV and Internet Technicians #claude #chatgpt
  "y03W6_1r3Yw": ["tutorial", "en"], // Remove Your TV’s Ads With ChatGPT
  "L-YeJqL73-I": ["other", "en"], // People are using Claude to strip the ads off their TVs #shor
  "fw_1KLOIDms": ["tutorial", "hi"], // Android TV Lag Fix 🤯 Claude AI ne Ads + Bloatware Hata Diye 
  "wIQENbWFy6w": ["tutorial", "es"], // ¡LIBERA tu Smart TV LG webOS! 🔥 ROOT + Homebrew + CleanYourT
  "tkV1FDTTqyE": ["tutorial", "hi"], // Claude Se TV Ke Ads Delete Karo FREE Me | No Root 😱
  "jG0KItNP68E": ["tutorial", "en"], // Claude Code Removed Every Ad From This Mi TV
  "Pho1RgNRFa0": ["other", "en"], // Samsung, LG, Google TV and Fire TV. Here's the free, open so
  "H7mNVMpvPKo": ["other", "en"], // Your AI Agent Can Rip the Ads Out of Your Smart TV
  "wJTx6k13V68": ["tutorial", "en"], // CleanYourTV: Declutter Your Android TV Over Wi-Fi
  "0iTOlQjNdhs": ["tutorial", "en"], // I Fixed My Android TV With Claude Code + CleanYourTV
  "TJV4o6Cbw_A": ["tutorial", "en"], // Remove Ads From Samsung, LG & Fire TV (Not Just Google TV)
  "m7ZQc2z-W60": ["tutorial", "en"], // Claude Code Can Remove Ads From Your Smart TV 🤯📺
  "pC53fJQOauc": ["other", "en"], // Make Your Android TV Look Like Apple TV for FREE! 🍎 (No Root
  "gIl3dX6Jy10": ["other", "ru"], // ОЧИСТИ свой Android TV от РЕКЛАМЫ и МУСОРА! Без компьютера!
  "YLT2jggm79g": ["tutorial", "en"], // Clean Your Android Tv | Remove background Unwanted Apps #And
  "5bqa7CMoVTM": ["tutorial", "en"], // How Claude Code Stripped Every Ad Off a Smart TV #SmartTV #C
  "jmW0MBS2ihQ": ["tutorial", "hi"], // I Made My Old Android TV 10X Faster By This Simple Trick
  "cJo4c5CLBhA": ["tutorial", "en"], // cleanyour.tv is so cool 🤩 #shorts
  "zsah85KcyTQ": ["tutorial", "en"], // Vibe coding reached your TV now. #tv #vibecoding #aiagents #
  "ekJu3HbzLMQ": ["tutorial", "en"], // This TV Showed Ads Before Netflix… So Claude Code Hacked It 
  "pZX6E-bU9QE": ["other", "en"], // This GitHub Tool Hacks Your TV
  "IVkuMfIJwsY": ["tutorial", "en"], // Clean Your TV
  "cC6b1eKZjuk": ["tutorial", "hi"], // Clean Your TV in Minutes | Remove ads in TV and Bloatware | 
  "HWaceIUDVfI": ["other", "en"], // Replace Android & Google TV Ads with an Apple TV-Style Home 
  "48kspaAlMZc": ["tutorial", "en"], // Clean Android TVs over Wi-Fi in one line.
  "QrDh7LtzD1A": ["tutorial", "en"], // How To Remove TV Ads & Bloatware With Claude Code
  "f6MLL6gSzHU": ["tutorial", "en"], // Xiaomi TV — How to Remove Ads & Make TV Faster Using Claude 
  "xn_5M3RMBP8": ["tutorial", "en"], // cleanyourtv: Debloat your Android TV into an Apple TV look
  "Y1wx4IcMVbY": ["tutorial", "hi"], // 🔥 CLEAN YOUR ANDROID TV — NO PC NEEDED! NO SUBSCRIPTION NEED
  "KMTQED1YSX4": ["tutorial", "en"], // Make Your TV 10x Faster (Free, 5 Minutes) ⚡
  "QXWwYfDu1ZM": ["tutorial", "en"], // How to Stop Your Smart TV From Tracking What You Watch (Fire
  "XYv9oTTKMFQ": ["tutorial", "en"], // This GitHub Repo Removes all Ads and Bloatware Apps from you
  "yq3X9dSA3T8": ["tutorial", "hi"], // Clean Your Android TV with AI! 🤯
  "42c-Fl-ojpI": ["other", "en"], // A guy gave Claude Code his parent's TV model number and it w
  "FnPEdyL_NUU": ["other", "en"], // This GitHub prompt kills the ads on your Android TV.
  "KZiNfi82_wc": ["tutorial", "en"], // Claude Code Can Remove Ads From Your Smart TV! 😱
  "5aRHNVIktLw": ["other", "hi"], // Claude Code se TV ke ads hataye, par risk bhi hai
  "oif1j8fwtF4": ["other", "en"], // People are using AI coding agents to make their Smart TVs du
  "PMiugRgkRYg": ["tutorial", "en"], // Debloat an Android TV without root: CleanYourTV
  "ejZaGGynj24": ["tutorial", "hi"], // Android TV से Ads हटਾओ, सिर्फ फोन से 📺 | Clean Your TV (Free
  "JFlJSfkGNxk": ["tutorial", "hi"], // AI Can Remove All Ads from your TV | Clean Your TV Step by S
  "lPASdR8V5eU": ["tutorial", "en"], // AI Just Removed the Ads From a Smart TV 💀
  "6052j4zquic": ["other", "en"], // TV Vibehack: Your TV, Minus the Ads
  "aMkW8grVgJE": ["tutorial", "en"], // Fix Your Slow TV Free | CleanYourTV Android TV Debloat With 
  "zHYFFkFNCjg": ["other", "en"], // Strip annoying ads from your Android TV instantly ⚡
  "ydwqRiVN0Nw": ["tutorial", "en"], // Debloat any Android TV straight from your phone ⚡
  "dJlavaVE0t0": ["other", "hi"], // AI Ne Purane Mi TV Ko Apple TV Jaisa Bana Diya! 🤯 #shorts #a
  "SjrMye6j17o": ["tutorial", "en"], // Claude Code deleted the ads on this TV
  "wtsMqsLl1KY": ["tutorial", "hi"], // OneplusTV home screen cleaned Github Free Repo.#oneplustv #a
  "3YgUJvrpHzo": ["tutorial", "en"], // Claude Codex Fixed My Android TV
  "3maMZYHeypE": ["tutorial", "hi"], // Android TV Slow & Ads से परेशान? 📺 CleanYourTV से बनाएं Clea
  "2-aALA2X5OE": ["tutorial", "en"], // Claude Code takes the ads off your TV (CleanYourTV) #shorts
  "vxoUGSRPQzE": ["tutorial", "en"], // Claude Code on Your TV: What It Removes and What It Doesn't
  "wX_bqyg7kbI": ["tutorial", "en"], // Turn your Smart TV into 'Dumb' TV with Claude Code and Clean
  "jAyqKeLNvQs": ["other", "en"], // People Are Hacking Their TVs With Claude
  "KrhKACE8FdY": ["tutorial", "en"], // Strip bloatware and sponsored ads from smart TVs using clean
  "tKcZTBr-7t0": ["tutorial", "en"], // Claude Code Removed the Ads From His Parents' TV
  "_mwsqKraulQ": ["other", "en"], // People are using Claude to strip ads off their smart TVs
  "Vv4AMis_oNo": ["other", "en"], // People Are Hacking Their TVs With Claude Code
  "3rBilhaTGfY": ["tutorial", "en"], // The Viral Claude Code TV Cleaner Keeps Your YouTube Ads
  "5RndkswQd1w": ["other", "en"], // This Free App Wipes Every Ad Off Your Google TV (20k Stars)
  "P4K-D48Iqho": ["tutorial", "en"], // He told AI to delete the ads on his TV #Shorts
  "gGEjk2XttXQ": ["tutorial", "en"], // Same TV. Ads gone. How Claude switched off the TV ads #short
  "tFXPgyXKja0": ["tutorial", "hi"], // AI Made My Tv Faster and Ad-Free! 🤯 #shorts #viral #androidt
  "nKwhbMaxH5g": ["tutorial", "en"], // Why does your TV have so many ads? Here is the fix #SmartTV 
  "hpSp7AKak6A": ["other", "en"], // This free app clears the sponsored ads off your TV's home sc
  "f5a5VVybK2s": ["tutorial", "en"], // Claude removed the ads from his parents TV
  "lN-j4DU_19U": ["tutorial", "uk"], // Developers Are Using Vibe Coding to Remove Unwanted Apps and
  "hUGVtR3c8wg": ["other", "en"], // Claude Code Gave This Android TV an Apple TV Makeover 🤯
  "qX3A5g2Jwks": ["tutorial", "en"], // Remove ads / Bloatwares from Your Android TV
  "F37197aS-hA": ["tutorial", "en"], // CleanYourTV: 22K Stars Insane Apple TV Hack [2026] #Shorts
  "5J-BBgtDMFE": ["tutorial", "en"], // People Are Using AI to Remove Ads From Their Smart TVs 📺 #Sh
  "XH9VlRWKPUs": ["tutorial", "en"], // Clean Your TV: Debloat Any Android TV With Your AI Agent
  "uRJxs6xqYHg": ["other", "en"], // Free Repo Turns Off Ads on 359 Android TV Models #shorts
  "3CgPlPdwbIE": ["tutorial", "es"], // Revive tu AndroidTV y GoogleTV con CleanMyTV
  "BupUXmyVnGs": ["tutorial", "en"], // Remove Ads From Android TV: CleanYourTV
  "rGL7ZI5S1CE": ["tutorial", "en"], // Remove 25 Bloatware Packages From Your Android TV
  "zFSdL1WyvBk": ["tutorial", "hi"], // My Android TV Was SO SLOW… I Fixed It With AI.
  "rBhVvKvGDk0": ["tutorial", "en"], // Claude Code just fixed the worst thing about your TV
  "hO7aLnLwPw4": ["tutorial", "en"], // The Secret Way to Clean Up Your TV Interface #CleanYourTV #T
  "QKb8ghtZCqk": ["other", "en"], // Claude Code killed the ads on his parents' TV #shorts
  "9S-ZeJsm-QI": ["tutorial", "hi"], // Clean Your Smart TV Using Just Your Phone! 🤯 No PC, No Claud
  "p7tmCHSJqQ8": ["other", "en"], // People Are Using AI to Make Their Smart TVs Dumb Again
  "bAFq5i642D8": ["other", "en"], // Claude Code switches off ads on Sony, TCL, Xiaomi TVs
  "pi4gBkLQ80s": ["tutorial", "en"], // No Claude, No Root: Clean Up Your 2016 Fire TV Stick
  "AiXGusz91NQ": ["tutorial", "en"], // CleanYourTV Strips Ads From 54 Smart TVs Free #Shorts
  "spYzueTL3-Q": ["other", "en"], // One AI Prompt Just Killed Smart TV Home Screen Ads
  "MMG26X-C7Kg": ["tutorial", "en"], // Claude Code Removed Every Ad From This TV 🤯
  "bx44DfkrbfU": ["tutorial", "en"], // Free open-source Android TV cleaner (CleanYourTV)
  "UyMnvDZRtsw": ["tutorial", "hi"], // How to Clean & Speed Up ANY Android TV! Using ChatGPT + Anti
  "Zh1ALN3Tkc4": ["tutorial", "en"], // AI Deleted the Ads on This TV (40,000 GitHub Stars)
  "d9RB1f5F4lQ": ["other", "hi"], // Claude Turned My Old Mi TV Into an Apple TV 🤯 #shorts
  "ff4Oj_FW0QM": ["tutorial", "en"], // Google TV Home Screen Ads: Remove Them for Free
  "lcIRLi0phDk": ["other", "en"], // Hack your TV with Claude Code #claudeai
  "v-jj1xVM1NY": ["tutorial", "en"], // Clean up a bloated Android TV, no root needed
  "nuCLehiGU4s": ["tutorial", "en"], // Remove the ads from your Android TV with Claude Code (free r
  "g9imxlgOIGk": ["tutorial", "en"], // A simpler TV home screen — CleanYourTV #Shorts
  "4283d2YqLJ8": ["tutorial", "en"], // Clean Your TV with Phone: Remove Android TV Ads (No PC, No C
  "P_pTYwTc-ME": ["tutorial", "en"], // This free GitHub repo removes the ads from your Android TV 📺
  "AOogkaJko7E": ["other", "en"], // Wipe the Ads Off Your Android TV From Your Phone #shorts
  "ZTALg8ufdzs": ["tutorial", "en"], // Slow TV Full of Ads? He Fixed It With Claude Code 📺 #shorts
  "g70qwT2kcBk": ["tutorial", "en"], // Android TV — How to Install Custom Launcher Using Claude Cod
  "YIYQMJn4D4g": ["tutorial", "en"], // How to Remove the Ads From Your TV With Claude for Free
  "HPZILs6sqhY": ["other", "en"], // People are using Claude to strip the ads off their TVs #shor
  "kY7SFx2XBuM": ["tutorial", "en"], // Make Your Android TV Feel Brand New! 📺 | CleanYourTV
  "kd97DUl33GU": ["tutorial", "en"], // Fire TV Stick Debloat: Remove Bloatware Safely
  "FXyvYdLXvhk": ["tutorial", "en"], // 📺🔥 Remove Ads from Android TV & Get an Apple TV-Style Experi
  "gxvdpcf0ZfI": ["tutorial", "en"], // Claude Code TV: This Free AI Turns Off Your Smart TV Ads (Cl
  "Cww_R-rmwjA": ["tutorial", "en"], // Someone used Claude Code to fix their ad-filled smart TV...
  "FiaUvQEnF-Q": ["tutorial", "en"], // Google TV Home Screen Ads: How to Switch Them Off With ADB
  "bOcgEee6O04": ["other", "en"], // He Gave Claude Control of His Parents’ TV
  "EmR4f3t84Og": ["tutorial", "en"], // Turn Your Ad-Filled Android TV Into an Apple TV — CleanYourT
  "sNZ22LgbaRU": ["tutorial", "en"], // EASIEST WAY TO DEBLOAT YOUR ANDROID TV #cleanyourtv #tvlaunc
  "kz0M13iCOx8": ["tutorial", "hi"], // Claude Code Removed 25 Ad Apps From This Smart TV
  "ZUOD-Z_vO9U": ["tutorial", "en"], // Claude Code Smart TV Hack: Remove Ads From Android TV With O
  "p6oBIzy_KEI": ["tutorial", "ta"], // How to Remove Ads from Android TV Using Claude Code | CleanY
  "j4-Ngv8FZC8": ["tutorial", "en"], // cleanyourtv is trending on GitHub #Shorts
  "aDVZnm5HzoM": ["tutorial", "en"], // He let Claude Code clean his parents' TV 📺 #shorts
  "xfUpbPwMByM": ["tutorial", "hi"], // Remove Smart TV Ads for FREE?! 🤯 No Root Needed! #Shorts
  "b6uTeXyfjSA": ["tutorial", "en"], // Over 24,000 developers just starred CleanYourTV, an open-sou
  "plrXa3C5hRo": ["other", "hi"], // Claude Code ne Mera Purana Android TV Naya Bana Diya (Hindi)
  "-AVRLqBZfCk": ["tutorial", "hi"], // How Claude Code Cleans Android TV Bloatware (Without Root) #
  "5sGI3h00Yt8": ["tutorial", "en"], // Repo of the Week: CleanYourTV
  "gy3Bk_xr8h8": ["other", "en"], // Why Claude loses your TV halfway through
  "pVZcfnCon8k": ["tutorial", "hi"], // Kya Crazy Ban Gaya Hai! 🤯🔥 Android TV- Personal Apple TV #cl
  "v7KTaSGZ52g": ["tutorial", "en"], // Remove Ads from Your Android TV Without Root! #github #opens
  "RnReGQfBRAU": ["tutorial", "en"], // GitHub Top 5 #1: CleanYourTV debloats your Android TV over W
  "-KPUaVcAJqQ": ["tutorial", "en"], // Remove the ads from your smart TV (free repo) #shorts
  "nCb_y0YS_GM": ["tutorial", "en"], // cleanyourtv vs free-my-tv: Which One Fits You? (Ad-Free Smar
  "mIviMpf5DVg": ["tutorial", "en"], // Claude Code fixed my used Sony TV
  "--MSEo-xffA": ["tutorial", "en"], // How to Remove Ads From Your Smart TV (Android & Google TV)
  "f_HHibzKgVc": ["tutorial", "en"], // Clean Your TV - Debloat any Android TV over Wi-Fi (29k stars
  "78oSTAliqX0": ["tutorial", "en"], // Google TV Ads? Claude Code Can Remove Them 📺
  "k5Ka3D7AzcY": ["tutorial", "en"], // CleanYourTV: 6,000 Stars in 3 Days to Kill Smart TV Ads #Sho
  "IuBZKzZfkkc": ["other", "en"], // AI Made Smart TVs Dumb Again
  "OHHHn6EsnRw": ["tutorial", "en"], // Google TV full of ads? CleanYourTV removes them
  "m7_5ug0iByw": ["tutorial", "hi"], // This FREE App Cleans Your Android TV Using Your Phone! | Dev
  "VpwblagirU4": ["other", "en"], // Someone Used Claude Code to Make a Smart TV Dumb Again (Andr
  "1TbSXilBRvU": ["tutorial", "en"], // Can CleanYourTV Replace Your TV's Home Screen? What You Give
  "0Q87uzfEWNY": ["tutorial", "en"], // I Removed Every Ad From My Xiaomi TV Home Screen #Shorts
  "TjEkCB0BBX4": ["other", "en"], // Wipe the Ads Off Your Smart TV With Claude Code
  "CMj-kGLj3bM": ["tutorial", "en"], // This Free Tool Removes Ads From Your Smart TV #AndroidTV  #S
  "RpKB5tkc_dk": ["tutorial", "en"], // People Are Using AI to Delete the Ads From Their TVs #shorts
  "9-PP2XaaPx0": ["other", "en"], // Claude Code Can Kill TV Ads. Will Yours Work?
  "E1jseEE7gnI": ["tutorial", "en"], // People Are Using Claude Code to Kill the Ads on Their Smart 
  "r8ONgRyhfHM": ["tutorial", "en"], // Claude Code Removes Android TV Ads
  "SHWD5fZTVDc": ["tutorial", "hi"], // Smart TV ke Ads Kaise Hataye? Free GitHub Tool CleanYourTV #
  "F2b0QYLZGeQ": ["tutorial", "en"], // Claude Code Removed This TV's Ads (Here's the Catch)
  "8-cF14KySb8": ["tutorial", "en"], // cleanyourtv: Gaining 1,574 stars a day
  "ye9hzOdpTqY": ["tutorial", "en"], // Remove Smart TV Ads and Bloatware with AI
  "2O9RbfVRdR8": ["other", "hi"], // Apple TV Glass UI on Android TV 😍 No Laptop, No AI Needed!
  "ebtIcdkF6v8": ["other", "en"], // People Use Claude Code to Make Their Smart TVs Dumb Again
  "OIwW6IUkOgI": ["tutorial", "en"], // How to delete your TV's bloatware with Claude AI 📺🤖 #ClaudeC
  "pdEIWRf_Ys8": ["tutorial", "ml"], // Android TV-യിലെ ads ഒക്കെ Claude കളഞ്ഞു! 4 steps, no root 📺 
  "qUsqk63H0Qs": ["tutorial", "en"], // CleanYourTV GitHub Overview: How Add-ons Stay Separate from 
  "1WEznb6nq34": ["tutorial", "en"], // This Free Tool Deletes the Ads on Your Smart TV #Shorts
  "_u7aEPxeuRw": ["tutorial", "te"], // #cleanyourtv #tech #androidtv #viral #trending clean your An
  "O___ARHk1pA": ["other", "en"], // Claude Code Can Make Your Old TV Fast Again
  "heZz_leXqOs": ["other", "ur"], // Purana TV Rocket Jaisa Tez — AI Se #shorts
  "-qc5PNU86XI": ["other", "en"], // Claude Code Can Strip Smart TV Ads. Here's the Catch.
  "cYWtsyuY74Q": ["other", "en"], // Make Your Smart TV Dumb Again With AI
  "itH43AksYDg": ["other", "en"], // AI kicks the ADS off your TV's home screen #smarttv #android
  "tFT4HFWmWWE": ["tutorial", "en"], // Make Your Android TV Faster & Remove Home Screen Ads — Clean
  "EwZR-MlOjh0": ["tutorial", "en"], // Remove the ads from your Android TV with Claude Code (Clean 
  "BOawxXqt1sc": ["tutorial", "en"], // How People Are Taking the Ads Off Their TVs With Claude Code
  "JehrbMp0nsw": ["tutorial", "en"], // Remove the ads from your Android TV over Wi-Fi (open source)
  "aLBwh_31cYM": ["other", "en"], // Strip the ads and tracking out of your Android TV
  "_amEFQDO1bM": ["tutorial", "hi"], // 🔥Android TV Slow & Ads से परेशान? 📺 CleanYourTV से बनाएं Cle
  "IqzsET_5Fbo": ["tutorial", "en"], // Day 5/100: You paid for this TV. Why does it show ads? (Clea
  "xtdTXleFLZA": ["other", "en"], // He let Claude Code hack his parents' TV #shorts
  "LeLBDYck5F4": ["tutorial", "en"], // Clean up your smart TV: cleanyourtv vs free-my-tv: What are 
  "bepZawmAacg": ["tutorial", "en"], // I Removed All Ads From My TV With 1 Claude Code Prompt (It W
  "aXQiA0silLA": ["tutorial", "en"], // Android TV debloat: remove ads over Wi-Fi, no root
  "C7ByxDlm10U": ["tutorial", "en"], // Clean the Ads Off Your Smart TV 📺 (free, open source) #short
  "I2YLT-16g7I": ["other", "hi"], // Android TV ke saare ads hatao, Claude Code se 📺 #Shorts
  "ZXYau3F5vM0": ["other", "en"], // People Are Using AI to Make Smart TVs Dumb Again
  "luRi-TrfvOs": ["other", "en"], // Claude Code TV: it switched off 25 apps. Will it work on you
  "GfSCBJdtnW4": ["tutorial", "en"], // A free repo strips the ads off an Android TV over Wi-Fi, and
  "5Fu1-aHNWBM": ["tutorial", "en"], // Claude Code removed the ads from this smart TV (free repo, A
  "kcKY1EqQjAk": ["other", "en"], // Claude Code took the ads off his parents' TV
  "UDoAPHhJzTU": ["tutorial", "en"], // Your TV is slow and full of ads — the fix is FREE 📺
  "vZuZx1rwq7U": ["tutorial", "en"], // I Debloated Every Screen I Own With Claude | Fire TV, Androi
  "iM1cZvcB3iw": ["tutorial", "hi"], // Android TV Ads & Bloatware Remove Karo - 5 Minute Mein Mobil
  "DyMzKAs0XwU": ["tutorial", "en"], // Why Your Android TV Lags & The 300 KB tvOS Fix! #Shorts
  "n0IKUnx6WIU": ["other", "en"], // Why Your $1,000 Smart TV Still Lags
  "O8S1RlHi7Uc": ["tutorial", "en"], // Your Android TV without ads: Claude Code cleans it up
  "bzeej0kvXjU": ["tutorial", "en"], // Your TV is full of ads. This free tool deletes them #shorts
  "gHZakf1Fyqs": ["tutorial", "en"], // How AI Vibe Coding Is Stripping Intrusive Ads Off Smart TVs!
  "mQmNNE-pFNg": ["other", "en"], // People are using AI to make smart TVs dumb again. One robot 
  "CENG-J3LLv8": ["tutorial", "ml"], // Clean Your TV Malayalam
  "vsWxw7Fs_Pw": ["tutorial", "en"], // Clean Your Android TV From Your Phone — No Laptop Needed (Fr
  "Ao7i736lsPY": ["tutorial", "en"], // He Disabled TV Ads With One Number. 34,800 Stars in 5 Days
  "0FqUwJdIOnA": ["tutorial", "en"], // One Prompt Removed Every Ad From My TV (Claude Code)
  "sO8u6imtyKQ": ["other", "en"], // A coding AI killed the ads on an Android TV #Shorts
  "A4TwjvmEe3g": ["tutorial", "en"], // CleanYourTV: Hermes Wiped 11 Trackers Off a Cheap TV #shorts
  "ek_YBavHwmY": ["tutorial", "en"], // 48,204 Stars in 14 Days: How to Clean Your Android TV Withou
  "9mxTbLT4D84": ["tutorial", "en"], // Remove All Ads From Your Android TV
  "ZdjQidDff18": ["tutorial", "en"], // Claude Code Removed the Ads From My Smart TV
  "_XmSottAP08": ["tutorial", "en"], // Clean up your smart TV: cleanyourtv vs free-my-tv: Clean You
  "_5KqNwL7Z6o": ["tutorial", "en"], // Claude Code cleaned up a slow Android TV #shorts
  "8DS_EBbSfho": ["tutorial", "en"], // AI Revives Slow Smart TVs: 25 Junk Apps Disabled! #Shorts
  "u75rcyGPfpg": ["tutorial", "hi"], // Transform Your Android TV! Make It Faster, Cleaner & Ad-Free
  "8_EQsIsZxrM": ["other", "en"], // People Are Using AI to Make Their Smart TVs Dumb Again
  "v5uhv6rCCqg": ["tutorial", "en"], // Your smart TV isn't slow, it's crowded: clean it up with Cla
  "iaCqqvHx5rQ": ["other", "en"], // Your smart TV is slow, full of ads, and tracking you. #short
  "XU8uv9uedAw": ["tutorial", "en"], // Clean up your smart TV: cleanyourtv vs free-my-tv: What they
  "G63u8IvlTbY": ["tutorial", "en"], // Clean up your smart TV: cleanyourtv vs free-my-tv: Where eac
  "lJFfKwcsabw": ["tutorial", "en"], // Strip bloatware and sponsored ads from smart TVs using clean
  "bespZeMG2WA": ["tutorial", "en"], // Clean Your Android TV & REMOVE ADS! No PC Needed! (2026)
  "DhuQ21tEivI": ["tutorial", "en"], // This Free AI Prompt Removes the Ads From Your Smart TV 📺 #sh
  "cpR7-Oh8X7g": ["tutorial", "en"], // People Are Using AI to Kill the Ads on Their TVs (cleanyourt
  "A1o1Qw7W1QM": ["tutorial", "en"], // Clean up your smart TV: cleanyourtv vs free-my-tv: Getting s
  "OTPcg0IJp94": ["tutorial", "en"], // Remove Your TV's Ads With Claude Code 📺
  "0UuUi3p0bmU": ["tutorial", "en"], // Clean up your smart TV: cleanyourtv vs free-my-tv: Which one
  "iDC_wPRk4eQ": ["tutorial", "en"], // Tidy Up Your Google TV Using Your Phone! | CleanYourTV
  "UONgCGkPLIk": ["other", "en"], // People Are Using AI to Make Smart TVs Dumb Again 📺 #shorts
  "Z2e3E2IzHNw": ["tutorial", "en"], // AN AI CLEANED HIS PARENTS' TV — 40,000 PEOPLE COPIED HIM
  "4I7h_jx6QcA": ["tutorial", "en"], // Remove the Ads From Your Smart TV #shorts
  "bdVdHVYb3Zs": ["other", "en"], // 666 Developers Star This Ad-Wipe TV Hack! #ai #viral #claude
  "wk9QuMnErMw": ["tutorial", "en"], // Clean up your smart TV: cleanyourtv vs free-my-tv: Who shoul
  "zdhRFqeSlFc": ["tutorial", "en"], // Claude vs Your Smart TV: Why Does It Show Ads? #Shorts
  "9ow4xWpb9Mw": ["tutorial", "en"], // Remove your TV's ads with Claude Code - #claude #usecase 2 #
  "hGfbGLpRLZk": ["tutorial", "en"], // Claude Code removed the ads from a smart TV (Clean Your TV, 
  "upIeUFEWkZM": ["tutorial", "en"], // CleanYourTV for Android & Google TV | Declutter Your Home Sc
  "Fm6zlNh7dqA": ["other", "es"], // Quitar anuncios de tu Smart TV SIN pagar Claude: respondo to
  "48AKXRb3W8Y": ["tutorial", "zh"], // Clean Up Sony BRAVIA TV Remotely: Raspberry Pi 4 + ADB (clea
  "kx8ByaWLd-U": ["tutorial", "es"], // CleanYourTV: un proyecto para limpiar tu Android TV
  "4k0ZNtb5eGo": ["other", "es"], // Claude elimina los anuncios de tu Televisión 🙌🏻😮
  "LsK-peC3Fvw": ["tutorial", "es"], // Quita los anuncios de tu tele con una IA en 15 minutos (Clea
  "A5aqaebxOm4": ["other", "es"], // La IA puede limpiar tu Android TV, pero tiene un límite
  "tSTmto1PbEE": ["tutorial", "es"], // CleanYourTV: adiós a los anuncios de tu Google TV o Android 
  "ri3r17YcE6o": ["tutorial", "es"], // CleanYourTV 3.0: TV sin anuncios y apps innecesarias
  "uTQG168qYB8": ["tutorial", "es"], // CleanYourTV: Hermes quita 11 rastreadores a una tele barata 
  "NUXU_YyHvvM": ["tutorial", "es"], // Ya hay un repo gratis que deja tu tele como un Apple TV (Cle
  "6t8x3bzH_YA": ["other", "es"], // Así le quitas los anuncios a tu tele Android con Claude Code
  "ETui_yNUA3s": ["tutorial", "es"], // Clean Your TV: repo para limpiar tu TV (Parte 1)
  "yZGHqz2kqng": ["other", "es"], // La IA le quitó TODOS los anuncios a la tele 📺 #claudecode #s
  "VkASd-ifocI": ["tutorial", "es"], // Quita los anuncios de tu tele con IA (y déjala como un Apple
  "UY9iuTA-xcA": ["other", "es"], // Podés eliminar los anuncios de tu Smart TV con IA
  "383FuZNeEPg": ["other", "es"], // ¡Elimina anuncios de tu TV con IA en 5 min! 📺🤖
  "6uwQTzfo_Ao": ["other", "es"], // Limpia tu tele de anuncios con Claude Code #shorts
  "AYK71x6drpY": ["tutorial", "es"], // Claude Code le quita la publicidad a tu Smart TV 📺 #shortscl
  "IEmdmRJVM5k": ["other", "es"], // Claude Code · limpia tu Smart TV
  "tXEc02iavDY": ["other", "es"], // 🤯 Un loco usó Claude Code con la TV de sus PADRES para esto
  "N53l-tWYTmY": ["other", "es"], // Claude Code le quitó los anuncios a la tele de sus papás #sh
  "SaOmUlAC-C0": ["other", "es"], // Quita los anuncios de tu tele con Claude Code 📺 #shorts
  "EvyD2T8lzBU": ["other", "es"], // Smart TV: la IA le QUITA los anuncios en 15 min 📺 #Shorts #S
  "kfWvqyw3Bpg": ["other", "es"], // Le quitan los anuncios a la tele con una IA que programa
  "y_lrx9X0zbI": ["tutorial", "es"], // ¿Cómo puedes hacer tu Smart TV más rápida y sin anuncios usa
  "AM2J3SfdO5Q": ["other", "es"], // Quita los anuncios de tu tele con Claude Code
  "O5Ls8FGfnoo": ["other", "es"], // Hackeé mi TV con IA: así usé Claude Code y Codex
  "5JHWnnK2_yk": ["other", "es"], // Hackeé mi TV box con Claude Code y quedó volando
  "km9ptk7xOPs": ["other", "es"], // 1.300 estrellas: Claude Code quita anuncios de Android TV
  "qYuoAyeTW70": ["other", "es"], // Hackea tu Smart TV con IA🔥
  "0JZYnZQFtok": ["other", "es"], // #claude #ia #androidtv Claude le quitó la publicidad a la te
  "3wKlmrx_CpI": ["tutorial", "pt"], // CleanYourTV: o Claude Code limpando a sua Android TV pelo Wi
  "Hnt8mc5nFPM": ["tutorial", "pt"], // CleanYourTV: organize a tela inicial da Android TV
  "SG3c13JTqL4": ["tutorial", "pt"], // IA faxina sua TV: sem anúncio, com cara de Apple TV (CleanYo
  "b1UkxGjl3l0": ["tutorial", "pt"], // Sua TV com uma tela inicial mais limpa usando IA 📺 | CleanYo
  "GT_TgJfx8Ag": ["tutorial", "pt"], // CleanYourTV: Hermes tirou 11 rastreadores de uma TV barata #
  "ja1IW48YQ-c": ["tutorial", "pt"], // Smart TV sem anúncios? 📺 CleanYourTV promete acabar com prop
  "CDwFME3OtO8": ["tutorial", "pt"], // O fim dos anúncios na TV: o Claude Code limpa sua Android TV
  "tGUddaOY5g8": ["tutorial", "pt"], // Claude Code tirando os anúncios da Smart TV 📺 (CleanYourTV)
  "jvDZeNHq-0g": ["other", "pt"], // Tire os anúncios da sua TV com o Claude Code #shorts
  "ELojQFgnC30": ["other", "pt"], // Claude Code tira os anúncios da smart TV: o repositório grát
  "OnXNaRIalFM": ["other", "pt"], // Tirei os anúncios da minha TV com 1 prompt (Claude Code) #sh
  "MTn_WrXzEeA": ["tutorial", "pt"], // MALWARE A INFETAR A TUA TV BOX? Como Detetar e Resolver com 
  "-7igoQgE1hE": ["tutorial", "pt"], // Como deixar a TV limpa e bonita com IA (Google TV/Android TV
  "YvtzArki_Yk": ["tutorial", "fr"], // CleanYourTV : enlever les pubs de l'écran d'accueil de ta té
  "k9N2ndZ33CI": ["tutorial", "fr"], // CleanYourTV : ta télé Android sans pubs, nettoyée par l'IA
  "Z-btVdKB88U": ["tutorial", "fr"], // CleanYourTV : Claude Code vire les pubs de ta télé Android T
  "VASawJq_85s": ["other", "fr"], // MARRE des PUBS sur sa TV : il utilise CLAUDE AI pour TOUT SU
  "eI59V4cUvxw": ["other", "fr"], // tv-vibehack : nettoyer sa télé des pubs avec Claude Code
  "2vElYKfCEJI": ["tutorial", "de"], // Mit Clean Your TV entfernt Claude Code Werbung und vorinstal
  "8Qtb5EVD0HA": ["other", "de"], // Claude Code räumt meinen Android TV auf (Werbung weg)
  "Pce9cwi7-5s": ["other", "de"], // Fernseher ohne Werbung: Claude Code räumt deinen Smart-TV au
  "74ANEMK4s5w": ["other", "de"], // Claude Code löscht die Werbung von deinem TV
  "h4E5ZvDIMW8": ["other", "de"], // Die KI räumt deinen FERNSEHER auf #fernseher #androidtv #ki
  "gF9xARdznVM": ["other", "de"], // Smart-TV mit Claude KI aufräumen?! Der virale ADB-Trick & di
  "42nTegfC3nM": ["other", "de"], // TV hacken mit Claude
  "WPWyxIUb44E": ["other", "de"], // KI räumt den Smart-TV auf: Werbung raus, eigene Startseite r
  "nqsUZwvPBxA": ["other", "it"], // Addio TV LENTE: basta Claude Code per VELOCIZZARLE (quasi tu
  "d-60JQifaA8": ["tutorial", "it"], // Claude Code toglie la pubblicità dalla home della TV: CleanY
  "GPvIyNfJE8Q": ["tutorial", "it"], // Clean your TV: Claude Code toglie la pubblicità dalla TV #Sh
  "BwIsfDvPEI8": ["other", "it"], // Smart TV senza pubblicità grazie a Claude Code
  "of8RlFtoo14": ["other", "it"], // Come togliere la pubblicità dalla smart tv Android con Claud
  "ks-3Kiqv22M": ["other", "it"], // Ho tolto la pubblicità dalla mia TV con l'AI (funziona?)
  "bXxNWWOZGCM": ["other", "it"], // Togli la pubblicità dalla TV con Claude Code
  "V_jDfEuJKnw": ["other", "pl"], // Ludzie każą AI ZHAKOWAĆ telewizor. Reklamy znikają
  "vz2hwAWWU3o": ["tutorial", "ru"], // Как убрать рекламу с телевизора через Claude Code
  "ICnj1y0huac": ["other", "ru"], // Claude Code вычистил рекламу с телевизора за 15 минут
  "IA1qdvtQCyc": ["other", "ru"], // Claude Code вычистил рекламу из телевизора #shorts
  "Ma8Wsotaj2Q": ["other", "ru"], // Телевизор показал рекламу. Claude её выключил
  "vpOuoB43J3Q": ["tutorial", "ru"], // Claude убрал рекламу с телевизора за 15 минут
  "051fTYA9Oto": ["tutorial", "ru"], // Телевизор без рекламы через Claude Code: CleanYourTV с GitHu
  "B_z8XEtxNKE": ["tutorial", "ru"], // Claude Code убрал рекламу с телевизора #shorts
  "0oIInH8G3xw": ["other", "ru"], // Люди делают умные ТВ тупыми обратно через Claude Code #ИИ #C
  "h9IXPaIPZTc": ["tutorial", "ru"], // Нейросеть убрала рекламу с телевизора за 15 минут
  "w_K4OXYG3nU": ["other", "ru"], // ИИ вычистил рекламу из телевизора. Что дальше?
  "v7eJwvH77mk": ["tutorial", "ru"], // Убери рекламу с телевизора за 15 минут — CleanYourTV #shorts
  "Ln3fZ-xKstk": ["other", "ru"], // DeepSeek и Claude убирают рекламу с умных телевизоров
  "JwLH8dQ4-FQ": ["tutorial", "ru"], // Clean Your TV: телевизор без рекламы через Claude Code
  "P7NIB7m6gmo": ["other", "ru"], // Лучший способ ХАКНУТЬ свой телевизор через Claude и ChatGPT.
  "PPagpnwVy7k": ["other", "ru"], // Claude Code очистил телевизор от рекламы и мусора #shorts
  "9WPpJeLi7Z0": ["other", "tr"], // Claude Code ile TV'ndeki Reklamları ve Gereksiz Uygulamaları
  "dJMvJ6QZNKs": ["tutorial", "tr"], // Televizyonundaki Reklamları Claude Code ile Temizle (CleanYo
  "HNU02BF9HUg": ["other", "tr"], // Televizyonundaki reklamları Claude Code ile kapatabiliyorsun
  "yxrV9L04sCs": ["other", "tr"], // Reklamlı Akıllı TV'nizi Yapay Zekâyla "Aptal" TV'ye Çevirmek
  "fyg1hHQcQzw": ["tutorial", "tr"], // CleanYourTV: Android TV Reklamlarını Devre Dışı Bırakan Açık
  "6afC3xQpssU": ["tutorial", "ar"], // شاشتك بدون إعلانات مع Claude Code و CleanYourTV #shorts
  "JfGdT6a_S0Y": ["tutorial", "ar"], // نظّفت شاشتي TCL بمشروع من GitHub… عن طريق هرمز | Clean Your 
  "JzyBG_pnJcQ": ["tutorial", "ar"], // هل الذكاء الاصطناعي ينظف تلفازك فعلاً؟ 🤯 الحقيقة وراء CleanY
  "Jr9A89N-wg0": ["tutorial", "id"], // Cara Hapus Iklan Android TV Pakai Claude Code #Shorts
  "-yPL8r6I-zA": ["other", "vi"], // Claude Code "đột nhập" TV qua Wi-Fi, xoá sạch quảng cáo: 20K
  "GZnlKryNQ5U": ["tutorial", "vi"], // CleanYourTV: xóa quảng cáo Smart TV Android bằng Claude Code
  "DVzkyVBo-wc": ["other", "vi"], // 098 — Dọn rác TV TCL bằng AI: tắt app & quảng cáo qua ADB, k
  "PJ3dD6OQO1k": ["tutorial", "vi"], // Dọn sạch quảng cáo, app rác trên tivi Android với CleanYourT
  "lX0q25kDSb4": ["tutorial", "vi"], // cleanyourtv: Dọn Android TV qua Wi-Fi, đổi giao diện kiểu Ap
  "rKcVCWgAoTw": ["other", "vi"], // Nhờ AI dẹp quảng cáo TV Sony, TCL, Xiaomi
  "jE-txiAdCbI": ["other", "vi"], // AI hồi sinh TV cũ vừa chậm vừa lag: Xóa 25 app rác! #Shorts
  "tXTWP1jCFOQ": ["other", "th"], // EP2 สอนล้างโฆษณาทีวีด้วย AI ทีละขั้น ทำตามได้เลย! #Shorts
  "99XnlZCKbC8": ["other", "th"], // Smart TV โฆษณาเต็มจอ? Dev ใช้ Claude Code สั่งคลีนเรียบ! | #
  "gAClQ1tnPE4": ["tutorial", "th"], // CleanYourTV ให้ Claude Code ล้างโฆษณาบน Android TV ให้เหมือน
  "bz-K4mYW5rQ": ["other", "th"], // ทีวีมีโฆษณา? ให้ AI ล้างทิ้ง แถมหน้าโฮมใหม่สวยเหมือน Apple T
  "pLjEKlLqHlY": ["tutorial", "th"], // เปิดทีวีทีไร เจอแต่โฆษณา  วันนี้เลยล้างทิ้งให้หมด! CleanYour
  "fzCqg7OpwGE": ["tutorial", "ja"], // Claude Codeでテレビの広告を止める？cleanyourtvの仕組みと試せる範囲
  "0gF5tYNhZeA": ["tutorial", "ja"], // Claude Codeでテレビの広告を消す人が急増、cleanyourtvは3日半でスター1.19万、文鎮化の報告も
  "VmrcczWdO04": ["tutorial", "ko"], // 스마트 TV가 느린 건 앱 때문? Claude Code로 정리하는 방법
  "h8Ma32Bu3QA": ["other", "ko"], // TV만 켜면 광고부터 뜨죠? AI 코딩 도우미로 홈 화면 정리
  "qVCDr6Gd0wg": ["other", "ko"], // TV 광고 치우는 AI 나왔다? TV 바이브핵 드디어 공개!
  "r8G4_kGqbQs": ["tutorial", "zh"], // 叫 Claude Code 清掉電視廣告｜CleanYourTV
  "5gm7NNQ0peE": ["tutorial", "zh"], // Debloat a Sony BRAVIA TV Remotely: Raspberry Pi 4 + ADB | 遠端
  "N07AYJfn1JA": ["tutorial", "zh"], // 电视首页太乱？CleanYourTV 实测：用 AI 换上极简桌面
  "TDOmv45A0f8": ["tutorial", "zh"], // CleanYourTV？ 靠边站！TV Studio才是电视优化的天花板！AI自动精简、桌面更换、应用管理、投屏录屏、遥
  "-NTGdv4M2nc": ["tutorial", "zh"], // 電視越用越卡？使用 AI 大掃除！Android TV / Google TV 去廣告變順暢讓舊電視重生，免 Root 
  "rlIxpaP1sr8": ["tutorial", "zh"], // 电视盒子桌面自由！交给 AI Agent 学习 CleanYourTV 就能搞定 Google TV
  "Ej7LJgjCTTo": ["tutorial", "zh"], // 小米Redmi电视去广告：让AI自动装CleanYourTV+Aerial屏保
  "1Gkqvr7SuZs": ["other", "zh"], // 電視開機先看廣告？爆紅的 AI 去廣告法，先看這 3 件事
  "8FVYLpw_h6s": ["tutorial", "ko"], // 부모님 TV인데, 애플TV가 됩니다 | cleanyourtv
  "8phS4FzRtwk": ["tutorial", "ru"], // CleanYourTV — бесплатный открытый проект на GitHub.
  "HIgid2DQfQ0": ["other", "ru"], // Claude Code сделал умный телевизор тупым
  "Heplml3FnZI": ["tutorial", "zh"], // 全球电视解放运动：一句话让 AI 干掉电视开机广告！ #CleanYourTV #千问工作助理 #电视去广告 #开源项目
  "Hx2dPt17BPU": ["tutorial", "zh"], // CleanYourTV：Wi-Fi 遠端清理 Android TV #Shorts
  "LDeojoaQcBU": ["tutorial", "zh"], // 電視開機全是廣告？交給 AI 兩分鐘清乾淨｜CleanYourTV #Shorts
  "PnYEKeGybEE": ["tutorial", "th"], // ไล่เบาทีวีให้ลื่นขึ้น ลบโฆษณา แล้วสวยเหมือน Apple TV ! #clea
  "QbWXUeXteFs": ["tutorial", "zh"], // 電視開機全是廣告？GitHub 3 個開源神器，交給 AI 一鍵清乾淨 #ai工具 #github#去广告
  "T0yNP5xVZnU": ["tutorial", "ru"], // Телевизор Сбер как Apple TV: нейросеть выключает лишнее по W
  "UCgQkZqdVG8": ["tutorial", "ru"], // Clean Your TV: телевизор без рекламы
  "YL_1pFTbYws": ["tutorial", "ru"], // Clean your TV уже на IPhone!?
  "YLcNMvKT6mE": ["other", "zh"], // 你家電視開機先看廣告？這個月 GitHub 爆紅的 5 個工具
  "YwMeQmT768A": ["other", "tr"], // Herkes TV’sini Claude’a Hackletti. Ben Daha Fazlasını Yaptım
  "a26j1IL6p_A": ["tutorial", "ru"], // Топ-10 GitHub за 3 дня: cleanyourtv и free-my-tv
  "cUgYtKt1pxk": ["tutorial", "ru"], // Clean Your TV: телевизор без рекламы в меню
  "evvAUoqSmvI": ["tutorial", "ko"], // cleanyourtv 1분 분석 | 광고 홈을 깔끔한 홈으로 (깃허브 주간 1위)
  "gCDwJmTS2vo": ["other", "tr"], // Claude ile televizyon hackle
  "hxhf-orGQTQ": ["other", "pl"], // Ludzie hakują telewizory przez Claude Code
  "hxtRstrueCE": ["tutorial", "zh"], // Google TV 去廣告：CleanYourTV 3 步驟，一行還原
  "i61LYMIoU7A": ["tutorial", "th"], // วิธีแก้ Android TV และกล่อง Android ช้าหน่วงด้วย AI และลงแอป
  "kOIrGGfGItw": ["other", "ar"], // الجزء 2: شاشة سامسونج وإل جي بدون إعلانات مع Claude Code وCo
  "kRMAYzSlgPM": ["other", "it"], // Claude Code ha ripulito la mia smart TV
  "kasGmaCKmF0": ["tutorial", "th"], // 📺🍎 เปลี่ยน Android TV ให้หน้าตาคล้าย Apple TV ทำได้จริง!  #a
  "sf6d903J5OY": ["tutorial", "id"], // Membersihkan Home Screen Android/Google TV dari Iklan dan Bl
  "siFONnVIpNE": ["tutorial", "ko"], // Wi-Fi로 Android TV를 Apple TV처럼 정리하는 cleanyourtv
  "t0TxcogZ68s": ["tutorial", "vi"], // Tắt quảng cáo trên ti vi Android, miễn phí: CleanYourTV 47.0
  "w70FSk0OuSs": ["tutorial", "ru"], // Clean Your TV: превратите Smart TV в Apple TV без рекламы и 
  "yCuwh8i_mOs": ["tutorial", "ru"], // Clean Your TV: меньше рекламы на телевизоре
  "1QrZP10jimE": ["other", "fr"], // Claude Code transforme ta vieille télé en Apple TV
  "DnrIDUtv8YU": ["tutorial", "ru"], // Claude убрал рекламу с телевизора родителей
  "PyhY6Ur474g": ["other", "es"], // ¿Y si una IA pudiera hacer más rápido ese televisor que ya t
  "ZWAxKD_e8-A": ["other", "vi"], // Dùng Claude Code gỡ quảng cáo khỏi TV của bố mẹ #Shorts
  "fI0OPkdxyoA": ["other", "de"], // Alle hacken ihre Fernseher – Es ist so einfach! (Android TV)
  "-Xe5admIFG0": ["tutorial", "pt"], // TV 10x MAIS RÁPIDA com IA! Como Fazer na Android e Google TV
  "P0cdXNgxj_s": ["tutorial", "tr"], // Claude Code Android Tv'yi duzene soktu. Kumanda tuşlarını de
  "Vs4JmkIXrt0": ["tutorial", "ru"], // Как Claude Code вычистил рекламу с телевизора
  "-jM_fb4e-IY": ["tutorial", "pt"], // DEIXEI MINHA ANDROID TV MAIS RÁPIDA COM IA! Sem root
  "-G8OUZrayIM": ["tutorial", "en"], // I Fixed My Google TV Home Screen With AI
  "ba2IImG21YY": ["other", "ru"], // Телевизор без рекламы за один промпт в Claude Code
  "GS99mQm5Vlk": ["tutorial", "ru"], // Claude Code вычистил рекламу из телевизора родителей
  "sZOuO_EGvZs": ["tutorial", "ru"], // Claude Code вычистил всю рекламу с телевизора
  "Ewb3sCHAFlA": ["tutorial", "ru"], // Как убрать рекламу с телевизора через Claude Code
  "ObfQuceFtiU": ["other", "de"], // KI befreit Smart-TV von Werbung: 4 Millionen Downloads! Dann
  "zjyk8DiqrVA": ["other", "en"], // AI to Make My TV 10x Better!
  "G9Gpwg8wvaM": ["other", "ru"], // ИИ убирает рекламу со Smart TV одним промптом
  "ZetTMsMW2Ck": ["tutorial", "en"], // Before You Let Claude Clean Up Your Android TV (Read This)
  "MKRuzmPyLfw": ["tutorial", "ru"], // Как убрать рекламу с телевизора через Claude Code
  "xi8BvW_V0LU": ["other", "ru"], // Телевизор до и после Claude Code
  "QXHfw2l_5AQ": ["tutorial", "ru"], // Как убрать рекламу с телевизора через Claude Code
  "fm_6ys-gnsY": ["tutorial", "ru"], // Как убрать рекламу с телевизора через Claude Code
  "wL9Ku3dyWIg": ["other", "ru"], // Телевизор до и после Claude Code: минус вся реклама
  "aRhX8XkSFg0": ["other", "en"], // Your Android TV Has Too Many Ads? AI Can Help! 🤯📺
  "NdcrG9NOo9c": ["tutorial", "en"], // Faster Android TV in 60 Seconds #androidtv #techtips #lifeha
  "4WubxOi_7aE": ["tutorial", "ru"], // Как убрать рекламу с телевизора через Claude Code
  "hZv0FYwpBk0": ["other", "en"], // People are using AI to make their smart TVs dumb again
  "SvbgFX9hx2U": ["tutorial", "ru"], // Claude Code убрал рекламу с телевизора за вечер
  "JZJxxo_OLQ0": ["other", "en"], // Developer used claude code to hack his tv into an ad-free ap
  "risNojDx6hA": ["tutorial", "vi"], // Tôi Dùng CleanTV và Claude AI "Lột Xác" Chiếc Android TV Củ 
  "Ap8xBHPgv-g": ["tutorial", "ru"], // Как взломать свой телевизор с помощью Claude Code
  "mlwmCVMGTfQ": ["tutorial", "ru"], // Как вычистить рекламу из телевизора через Claude Code
  "x1EcnYPAHb8": ["other", "en"], // Vibe Code Ads Right Off of Your TV - DTNS 5377
  "rGW_mOtv6Wo": ["tutorial", "ru"], // Как убрать рекламу с телевизора через Claude Code
  "kz70irXptYI": ["tutorial", "en"], // I Transformed My Android TV into Apple TV Style Using Phone 
  "aSugs6jWF8A": ["other", "en"], // AI Is Making Smart TVs Dumb Again 📺 #AI #SmartTV #Shorts
  "dAlZLnx5PHM": ["tutorial", "id"], // Claude bisa Bersihkan TV kamu dari Sampah dan Iklan dengan m
  "5CXcfiMW3wY": ["tutorial", "en"], // Use Claude Code To Make Your TV Ad Free | Complete guide!
  "wZLpUpr3jq0": ["tutorial", "pt"], // O Claude Code tira as propagandas da sua TV
  "VizVLPkE5zs": ["tutorial", "es"], // CleanYourTV: Elimina Aplicaciones de Fábrica y Optimiza tu A
  "EQz7yhYnEwM": ["other", "es"], // Claude Code puede quitarle los anuncios a tu Smart TV
  "AwaI_VvKhsg": ["other", "en"], // People are using Claude to strip ads off their smart TVs
  "FBYRNeG6rtY": ["tutorial", "zh"], // Android TV 去廣告工具 CleanYourTV：不用 root、不刪 app，首頁換成乾淨主畫面
  "NrcWCBJGyh8": ["other", "es"], // CUIDADO ¿Limpiar tu Smart TV con la IA? Te cuento TODO lo qu
  "ouMz_gnMWPQ": ["tutorial", "ru"], // Как убрать рекламу с Android TV: нейросеть сделает сама  #ch
  "e9tO6o5HV1I": ["other", "ru"], // Проект, который сегодня на первом месте в трендах. Он чистит
  "Z09W1hztBcw": ["tutorial", "en"], // Claude Code Smart TV Hack: Ole Lehmann's 3 Steps
  "1NPepUWDewA": ["tutorial", "de"], // Mein Fernseher, eure Verkaufsfläche? CleanYourTV räumt auf
  "kyL5fqX6fOI": ["other", "en"], // Why are people hacking their own TVs with Claude?
  "BnYCCrD8wF4": ["tutorial", "ta"], // END of TV Brands (Tamil Tech, phone app and agent methods)
  "aN-65z6bvKk": ["other", "en"], // Everyone’s Letting AI Hack Their TVs… So I Tried It
  "BV1a5nc65Eo5": ["other", "zh"], // 【第12期】电视优化开源工具！禁用系统广告、清理预装软件、替换超轻量桌面，支持多款电视机型！老电视机也能重获流畅体验
  "_w9sGmXpmPY": ["other", "it"], // STAVO PER CAMBIARE TV. L’HO RIFATTA GRATIS IN 30 MINUTI!
  "smXsVgJmrTs": ["other", "de"], // Darum hacken alle ihren TV! (Selbstexperiment)
  "RLa0d6x8d5g": ["other", "fr"], // Voici ce que l'IA vient de trouver dans nos télés
  "eADL9qFrLPs": ["other", "en"], // 20 Insane Things People Built With Claude in 2026
  "4Ws_QFBDyrI": ["other", "en"], // Pomalá Android televize? Vyřešíte to jednoduše pomocí Claude
  "uQ58SgszCN0": ["other", "pt"], // TRANSFORME SUA TV PELO CELULAR! 🔥 REMOVA ANÚNCIOS E DEIXE SU
  "LEl8j3YP0GU": ["tutorial", "es"], // Tutorial Completo: Optimiza y Personaliza Cualquier Pantalla
  "B5jQoJ0Bff0": ["other", "it"], // Spegni subito questa impostazione o la tua Smart TV registre
  "5sV2MJ5jRNo": ["other", "hi"], // no bloat, no ads, much less RAM usage, and extra storage fre
  "gxsAbxe_6Bk": ["other", "zh"], // 告別電視ㄉ醜系統！免費裝APPLE TV！？現省9900元！？
  "A6eT7871kVI": ["other", "pt"], // 10 Repositórios Grátis do GitHub que Estão Bombando
  "uYP1XwHunUI": ["other", "it"], // HO FATTO ENTRARE UN’IA NELLA MIA SMART TV... GUARDATE COSA H
  "zDjJspEoxwM": ["other", "es"], // Le pedí a la IA que convirtiera mi TV Box en una Wii
  "7wvU2IdZn9c": ["tutorial", "te"], // I Let Claude Fix My Slow Smart TV! 🤯
  "MPACcgXbm0w": ["other", "es"], // Le di el control de mi Google TV a ChatGPT (y lo dejó sin ba
  "BV1gKnB6LEyj": ["tutorial", "zh"], // 教你用Codex爆改电视，删 App 去广告，改后清新无比
  "tVgf7X0GrmI": ["other", "ar"], // تلفازي صار مدريدياً! 43 تطبيقاً أقل، ولا إعلانات، وبطاقة الم
  "BV1xKxJ6cEb3": ["tutorial", "zh"], // 夯到爆！Github 又出狠活神器！电视桌面改造最高的山来了，CleanYourTV爆火后又冒出6款开源电视软件
  "HaW13jqMNao": ["other", "pt"], // Deixei minha Android TV mais rápida com IA pelo celular!
  "-t8x8uac9xQ": ["tutorial", "zh"], // 只需一部手机！0代码彻底榨干安卓电视性能：去广告、杀后台、精简桌面保姆级教程（以英伟达 Shield TV 为例）
  "BV1q5xS6TEnX": ["other", "zh"], // 运行内存只有512MB的创维老电视，我用AI把它救活了，告别开机广告
  "fZYpjae3zJo": ["tutorial", "zh"], // 夺回 Fire TV 的控制权！汉化系统、更换桌面、屏蔽广告与遥测 ｜CleanYourTV | AI Agent
  "JpcrM1_GzDg": ["other", "en"], // I Tried the Viral AI Smart TV Hack — With Just an App!
  "lFledhrU10o": ["other", "te"], // 15 Crazy Things People Built With Claude
  "BV1aCni6GE7L": ["other", "zh"], // AI爆改电视系统？我来泼盆冷水
  "BV1jcH56sEbc": ["tutorial", "zh"], // 用了7年的小米电视4A，  AI去广告之后的效果一镜到底。
  "BV1VgHN6tEf5": ["other", "zh"], // 小米电视   deepseek harness教你焕然一新！
  "tqpOfHS5-VY": ["other", "en"], // Make your AI agent pay for itself (and this week's biggest A
  "BV1QHWW6UEk6": ["other", "zh"], // GitHub届又传来喜讯！老电视系统优化+电视桌面改造最高的山来了。6款把「无广告桌面+ADB系统精简+防沉迷+Appl
  "BV1Tdn46GEkX": ["tutorial", "zh"], // 还在部署cleanyourtv吗？我选择用aerial tv！
  "3nODuM4ihnk": ["other", "tr"], // Claude ile Eski TV'ni Hızlandır (Android ve Google TV)
  "PTl-CU-uQ0E": ["tutorial", "es"], // COMO OPTIMIZAR TV BOX Y SMARTTV CON IA Proyecto
  "eBF4ljhpDRU": ["other", "ru"], // Ускоряем Android TV в 1 клик! Удаляем мусор, рекламу и лаги 
  "BV1ycnN6zEEp": ["other", "zh"], // 电视被破解！老电视变Apple TV！！ #AI工具 #老电视改造 #智能电视 #开源项目 #数码干货
  "BV1h9nb6HEPS": ["tutorial", "zh"], // Aerial TV的部署教程，听一遍就会，有手就行！
  "NcuHMpSWzH8": ["tutorial", "tr"], // EN KOLAY YÖNTEM! Yapay Zeka Destekli Clean Your TV ile Andro
  "rSNEmUrgb3Q": ["tutorial", "en"], // Clean the ads and junk apps off your own TV's home screen wi
  "BV1AfxW63EMp": ["tutorial", "zh"], // 电视盒子还能换桌面？用千问办公 AI 跑通 CleanYourTV 项目 还你干净桌面
  "ZCkCrwB2cHs": ["other", "hi"], // I Turned My Old LAGGY Android TV Into Apple TV Look!
  "BV1sznN6CEAd": ["other", "zh"], // 【第12期】仅需电脑和电视在同一WiFi，就能净化所有安卓电视桌面，关闭广告和预装软件，替换极简桌面，媲美 Apple 
  "AUdCyT43wjI": ["tutorial", "id"], // Android TV LEMOT? Ini Cara Bikin Ngebut Pakai HP Saja!
  "WyTTj5IU3pk": ["tutorial", "id"], // 🔥 DEBLOAT ANDROID TV & GOOGLE TV! Pakai CleanTV, Goodbye LEM
  "BV1hcno6hEJw": ["other", "zh"], // Aerial TV完全解决按home 键闪现原厂桌面的问题，小米电视spro 2026测试功能一切正常。
  "BV1b64j6PECB": ["tutorial", "zh"], // 【第6期】电视广告全关掉！换上黑色桌面！电视去广告、电视开机广告一次清干净！小米、TCL、海信、创维近500款智能电视有
  "BV1FFWM6UExg": ["tutorial", "zh"], // 小米/红米电视如何使用三方桌面？/禁用系统桌面/如何让小米电视/红米电视使用Clean your TV/Aerial T
  "obPzX9rhP4E": ["other", "zh"], // 小米電視一開機就是廣告？我家 2 台這樣清，還踩了 3 個坑｜Google TV／Android TV
  "BV1i1y4zaEwy": ["tutorial", "zh"], // 夯到爆！Github 又出狠活神器！！电视桌面改造这块最高的山来了，6款开源软件，能去广告、换电视桌面、手机遥控、播放4
  "BV1eA4w6AEbZ": ["other", "zh"], // 一个视频讲明白！最近爆火的 4 个电视优化开源项目，全平台适用应用
  "DU1F6s23ux4": ["other", "en"], // FreeMyTV: A FREE Home Screen for Samsung, LG & Google TV
  "BV1CMnr66EwJ": ["other", "zh"], // 小米电视改造：桌面换成苹果风，米家还能用
  "KmhkP7y9XXo": ["tutorial", "hi"], // Slow Fire TV Stick? Make It 10X FASTER! 🔥 100% FREE Method
  "BV1jTx16xESy": ["other", "zh"], // 【AerialTV】成功让乐视X40老电视起死回生
  "8DRlBFF8L9M": ["other", "pt"], // Tirei os anúncios da minha Google TV em 30 minutos! Faça iss
  "EglQwsOOFhE": ["tutorial", "en"], // People Are Vibe Coding Their TVs to Remove the Ads
  "hzh0wgn0uGQ": ["tutorial", "hi"], // 🚀पुराने Android TV को बनाएं 10X FASTER!🔥 100% FREE Method
  "m5K7xQoMrOQ": ["tutorial", "zh"], // 小米/红米电视如何使用三方桌面？/禁用系统桌面/如何让小米电视/红米电视使用Clean your TV/Aerial T
  "BV1sgx96xEjV": ["tutorial", "zh"], // 电视首页太乱？CleanYourTV 实测：用 AI 换上极简桌面
  "BV1LCsd6mERT": ["tutorial", "zh"], // Aerial TV替换桌面白名单版本最终解决方案及教程
  "BV1Rmn96aEEo": ["other", "zh"], // 两个AI接力改掉小米电视开机广告：DeepSeek卡住那步，Claude翻了系统代码
  "eh4LmB74mIk": ["other", "es"], // Creé mi propio menú para mi Samsung con IA
  "hUg7dGaSnT0": ["other", "en"], // Lobotomize Your Google TV - Android Faithful #173
  "mPGh-JW9C10": ["other", "en"], // Google Voice Finally "Getting the Message?" - Android Faithf
  "BV1ZGWq6cEJa": ["other", "zh"], // 教你打开adb并用WorkBuddy爆改Tv极简桌面【适用投影，盒子】
  "BV1Z6xr6jE73": ["other", "zh"], // 据说这是现在智能电视界最后的一块净土。电视优化开源工具！禁用系统广告、清理预装软件、替换超轻量桌面，支持多款电视机型！老
  "RBMHGMSi3PE": ["other", "en"], // Claude Duet, Google's new Shopping Agent + more  | This Week
  "I_JTKj46BsA": ["other", "es"], // Limpié mi TV box con IA: el resultado es LA CABRA
  "U0ndh5vmulA": ["tutorial", "en"], // Remove Unwanted TV Apps Over Wi-Fi With CleanYourTV
  "FasMkfoBd-Y": ["tutorial", "hi"], // Make Your TV 10X Faster & Better! 🤯 | No Claude, No AI Neede
  "QIqACxdTOFs": ["tutorial", "zh"], // 电视开机全是广告？让AI动手清干净｜CleanYourTV实测
  "BV18Zn96RE91": ["tutorial", "zh"], // 【cleanyourtv使用教程】帮你电视去广告超牛开源神器保姆式安装教程
  "K3upOFAFKdQ": ["tutorial", "en"], // Clean Up Your Smart TV By Debloating with Your Phone!
  "9DLAF34umVg": ["other", "es"], // Tu Google TV está lleno de anuncios: apaga esto HOY
  "RGW9Z6LUepo": ["other", "en"], // Claude Code Hacked a TV... Then Claude Did This..
  "BV1BWxd6sE68": ["other", "zh"], // 用豆包一键去除电视系统广告＆换上AppleTV UI界面
  "_bYEfXv2ZDc": ["other", "ru"], // ИИ вместо нового телевизора? Что реально можно улучшить | Шр
  "ujFtiedeOrc": ["other", "zh"], // 电视首页全是广告？不用刷机的开源解法
  "i8eKbvbUBXk": ["other", "en"], // Claude Code Can Strip Ads Off Your Android TV, 46k Stars
  "kzi5k04hN2I": ["tutorial", "en"], // How To Clean Your Smart TV With AI (12X FASTER)
  "zPORab60SXo": ["other", "en"], // Claude Refused 2 Things on My 2016 Fire TV Stick
  "Ur5yY7pFbbE": ["tutorial", "es"], // Fire TV Stick sin anuncios: cómo poner un inicio limpio (202
  "l5rDZa8bpjU": ["other", "es"], // Google TV sin anuncios: lo que hizo ChatGPT con Codex
  "BV1RzHG6SErN": ["other", "zh"], // AI爆改电视？老玩家早就这么干了
  "hCMDbAebKf8": ["other", "en"], // 17 Crazy Ways People Actually Use Claude
  "BiRZeuJzYXE": ["other", "en"], // Making my TV Usable Again
  "eJqvakSDqO0": ["tutorial", "hi"], // Android TV Slow Hai? Speed Up Your Tv | How to Speed Up Smar
  "d5xuw6EsELE": ["tutorial", "hi"], // I Made My Slow Android TV 10X Faster With Just My Phone!
  "HPouM4BkKoY": ["tutorial", "en"], // I Cleaned My Smart TV Using This Viral GitHub Tool (Zero Ads
  "BV1ij4g6xEzU": ["tutorial", "zh"], // 索尼电视cleanyour tv 教程，纯净无广 #索尼电视
  "BV1bxxe6CE2c": ["tutorial", "zh"], // 搞定了极米投影仪的clean your tv部署，就是极米的系统开adb太麻烦
  "FS5mskIdkPE": ["tutorial", "en"], // Make Your Android TV 10–20x Faster! (Try This Method)
  "V--nmvzCk6k": ["other", "hi"], // I Turned My Old Fire TV Into This With AI
  "4mToe6xppYU": ["tutorial", "en"], // I Installed an Apple TV OS on an Android TV!
  "_ThmtYNEUns": ["other", "en"], // 50 Surprising Things People Created With Claude & ChatGPT
  "BV14ExT6eEvX": ["tutorial", "zh"], // 米家激光投影一代 ADB 去广告｜安装 Aerial‑TV 纯净桌面｜Android9 无需 ROOT
  "JPxEHukECEQ": ["tutorial", "en"], // How I Safely Debloated My Google TV & Got an Apple TV-Style 
  "BV12g4E6aEDk": ["tutorial", "zh"], // 【开源】干掉电视开机广告！净屏 CleanYourTV 中文版讲解
  "fn861-g5yhs": ["other", "pt"], // Tiraram os anúncios da TV com IA (e ela ficou mais rápida)
  "O-kL8KXyJg4": ["other", "th"], // กล่องทีวีเก่าอืด อย่าเพิ่งทิ้ง! ลบแอปขยะ 5 นาที ลื่นเหมือนให
  "JZEHBIiqZ-g": ["tutorial", "es"], // 📺 ¡LIBERA toda la Potencia de tu Smart TV LG webOS! | Homebr
  "J1M94kyiOsc": ["other", "it"], // 19 modi di usare Claude che ti cambiano la vita
  "cZLZNJGWIQ0": ["tutorial", "zh"], // 透過 cleanyour.tv 打造自己的 Android TV 桌面與背景
  "BV1NWxT6cEnk": ["other", "zh"], // 把小米、TCL电视改造为AppleTV风格
  "87shJGWUh9s": ["tutorial", "en"], // Speed Up ANY Android TV or Firestick - Fully Debloated in 2 
  "BV1rUW26bEJr": ["tutorial", "zh"], // 旧电视盒子别扔：3个开源项目实测（Aerial/CleanYourTV/FongMi）
  "zLQOhqgdKh4": ["other", "ru"], // Твой телевизор ОХ*ЕЛ. Владельцы пошли против Samsung
  "FsCFwrXm-6s": ["other", "en"], // 小米電視一開機就賣廣告？AI 免費清走，TCL、Sony 都用得
  "alWIpWjSefc": ["other", "en"], // Ep. 18 - Smart TV, Dumb Idea
  "mqG2NRjAcEU": ["tutorial", "hi"], // Clean Your TV Hindi: Android TV Se Ads Kaise Hataye (Free Cl
  "shQRQjBMaj0": ["tutorial", "en"], // GOOGLE TV — How to Remove Ads & Speed Up TV Using Claude Cod
  "BV1deHM6BExe": ["tutorial", "zh"], // 最近AI改安卓电视桌面火啦！你改了吗！？去广告更简洁！
  "BV1kqnW6oEPD": ["other", "zh"], // 电视优化开源神器！禁用系统广告，清理预装垃圾软件，换上轻量桌面，支持多款电视，老电视也能重回流畅！#真干活用搭子 #办公
  "xS191q7wzY4": ["tutorial", "en"], // Every Harry Potter Fan Needs This on Their Smart TV! 🪄 (Cust
  "vD-PuMpxFs4": ["other", "en"], // Your Smart TV Is Full of Ads. People Are Using AI to Turn Th
  "BV1X5sZ6LEPh": ["other", "zh"], // 电视广告太多？试试这套开源方案
  "BV1LoyGzZEYD": ["other", "zh"], // 电脑和电视连同一个 WiFi，就能净化安卓电视？关广告、换极简桌面
  "W70arFVwyiM": ["tutorial", "hi"], // Make ANY Android TV Faster! Remove Ads & Bloatware Using Cha
  "O5biUfwg8kM": ["tutorial", "en"], // 'Black October' in cybersecurity, remove 'Spyware' from Your
  "BV1Cr4g6uEKx": ["tutorial", "zh"], // 电视去广告神器 CleanYourTV！局域网 ADB 操作，免 root，清爽桌面教程
  "BV1Vz486GETY": ["other", "zh"], // 用clearyourtv爆改小米电视桌面
  "YwsJ3Yaoc1c": ["other", "es"], // Hackea tu Smart TV con IA (sin anuncios)
  "Fy1hOiiAahI": ["tutorial", "hi"], // MAKE YOUR TV FASTER - THE TRUTH ! CLEAR YOUR TV NOW
  "992f57TVn9w": ["tutorial", "en"], // Android TV — How to Speed Up a Slow TV Without Factory Reset
  "BV1X1nB6mETa": ["other", "zh"], // Github上的这个开源电视优化工具太夯了！无线ADB净化安卓电视，清除预装冗余软件，纯净桌面，告别开机广告！ #百度搭
  "97vmB2Eb30A": ["other", "en"], // Pomalá Android televize a Claude Code: video Filipa Oborníka
  "wfUMMXm9UhY": ["tutorial", "zh"], // GitHub 本週最紅！CleanYourTV 29 天 5.8 萬星｜Android TV 去廣告、換成 Apple 
  "BV1TA4z6ZEiB": ["tutorial", "zh"], // 电视机魔改成答题系统，电视已经被玩成这样了嘛，必须去给我儿子装一个，或许这就是魔改电视的意义吧😁  #电视魔改答题系统 
  "o5v-56L379E": ["tutorial", "en"], // CleanYourTV: Debloat Android TV
  "BV1rVs368Ecd": ["other", "zh"], // 电视开机先看30秒广告？一通电话＋一个免费桌面，10分钟清净
  "0har-48BSg0": ["tutorial", "hi"], // Clean Your Smart TV Without Claude Pro?! 😱🔥 | Remove Bloatwa
  "CnWSz_rbnSI": ["tutorial", "hi"], // Android TV ko Apple TV Banao or Ads Hatao Free Mein! CleanYo
  "FkWC9eE0tQ4": ["tutorial", "en"], // How CleanYourTV Took Back the Smart TV Home Screen
  "8o3MkKCaYcM": ["other", "ru"], // ИИ-агенты чистят телевизоры от рекламы и слежки | Лука ИИщев
  "BV1wHnB6NEia": ["other", "zh"], // 一句话指挥AI 一键清除电视广告 改造方案还开源了
  "3FASfWTmOJM": ["tutorial", "en"], // How to Install Ad-Free debloat Android TV with AI | Glass TV
  "BV1zA4K6UEFR": ["other", "zh"], // 支持安卓4.4!寰宇电视-Lite2.0拯救你的旧电视
  "28utZWHIezI": ["other", "hi"], // AI Se Apne Smart TV Ko FAST & ADS FREE Bana Do! 😱 | Android 
  "u9d_HVHJ1DY": ["tutorial", "en"], // CleanYourTV GitHub Explained: Android TV Privacy Audits, App
  "BV1n24J6oEgU": ["other", "zh"], // 夯爆了！Github 又出狠活神器！安卓电视一秒变身Apple TV，开机广告秒清除！
  "uuL3OmhS72o": ["other", "en"], // 🔥 𝐑𝐞𝐦𝐨𝐯𝐞 𝐇𝐨𝐦𝐞 𝐒𝐜𝐫𝐞𝐞𝐧 𝐀𝐝𝐬 𝐨𝐧 𝐀𝐧𝐝𝐫𝐨𝐢𝐝 𝐓𝐕! 𝐂𝐥𝐞𝐚𝐧 & 𝐒𝐩𝐞𝐞𝐝 𝐔𝐩 𝐘𝐨𝐮
  "qv0eBpyr7Bo": ["other", "hi"], // Apne smart TV ko banaye fast? #androidtv #googletv #ai #chat
  "7l4EUKa7VsA": ["other", "en"], // I Hacked My TV With Claude...
  "Il7USTsDPcQ": ["tutorial", "th"], // จับโปรเจคเตอร์ Android เก่ามา Clean ด้วย Claude AI + CleanYo
  "9T3V-08ZjH0": ["other", "es"], // 🔥 Usé CHATGPT para LIMPIAR y ACELERAR mi GOOGLE TV 🤖 | Agent
  "mI4i5s2zwuo": ["other", "zh"], // 【AerialTV】成功让乐视X40老电视起死回生
  "BV1XtxK6BE6v": ["other", "zh"], // 用豆包给安卓旧电视换个清爽桌面，做出Apple TV的感觉
  "agn87Ft304w": ["other", "en"], // AI is hacking things by itself now…
  "BV1bjyLzXEXy": ["tutorial", "zh"], // 【cleanyourtv使用教程】帮你电视去广告超牛开源神器保姆式安装教程
  "BGNECsBTfPs": ["tutorial", "te"], // Clean Your TV GitHub Tool 😱 వాడే ముందు ఈ 3 Issues తెలుసుకోండ
  "BV1HgHL6ME27": ["other", "zh"], // 【第四期】电视优化开源工具！禁用系统广告、清理各种预装软件、替换超轻量桌面，支持超多款电视机型！老电视机也能重获流畅体验
  "BV1GZxF69Eyb": ["tutorial", "zh"], // 【CleanYourTV】别再找了，最细电视瘦身教程，电脑一条指令清预装关广告，电视盒子都能用
  "TejOmgwNsk0": ["tutorial", "hi"], // I Made My Android TV 10X BETTER with AI! 😍 Apple TV Look + R
  "gdR45XpOBtQ": ["tutorial", "en"], // Tired of Fire TV Ads? What People Did With AI + Safe Setting
  "XNwNJh59GWE": ["other", "en"], // Engineers Are Letting Claude Code Reverse-Engineer Their Har
  "BV1utn26AEAZ": ["other", "zh"], // 无线ADB净化安卓电视，清除预装冗余软件，告别开机广告！#安卓电视 #电视优化 #广告拦截  #Github#真干活用搭
  "BV1Yi4865EqP": ["tutorial", "zh"], // cleanyourtv 电视开机广告是你电视自己放的｜不刷机、不插线，同一 WiFi 就能关，还能一键还原
  "VmHX5rdOyMQ": ["other", "en"], // My Android TV Home Screen Is Now Naruto (No Ads, No Bloat) P
  "BV1P6su6PEQC": ["tutorial", "zh"], // 【开源神器第99期】电视广告多还卡顿？同一WiFi停掉广告、换572KB清爽桌面、31套主题、随时还原，5.8万星Cle
  "BV1rPnq6oEBp": ["other", "zh"], // 仅需电脑和电视在同一WiFi，就能净化所有安卓电视桌面的开源项目#真干活用搭子 #办公就用dumate #百度搭子  #
  "giZSVBmU0oE": ["other", "ar"], // 7 أشياء في بيتك يصلّحها Claude ببلاش
  "BV1hLxr6eEvH": ["tutorial", "zh"], // 电视开机先看广告?开源CleanYourTV:两周4.7万星,不用root也能换干净主页
  "X_lMH7Alyq8": ["other", "en"], // People Used Claude to Hack TVs. Why Does It Stop Halfway?
  "BV1vsnr6fEJC": ["other", "zh"], // 1分钟学会帮父母家里老电视去除广告和没用的软件、清除预装广告与臃肿软件、让老电视重获流畅!  #电视优化  #真干活用搭
  "LTvTx30wn5A": ["tutorial", "hi"], // Smart TV Ke Ads Kaise Hataye? | ADB TV + Projectivy Hindi | 
  "NUnuE6NXxJw": ["tutorial", "en"], // Claude Code can FIX your Slow TV?
  "BV1B1WH6sEQx": ["other", "zh"], // 【AI实战】让 AI 亲手删掉 Google TV 的广告和预装软件，主页瞬间清爽
  "BV1b8sr6cEeU": ["other", "zh"], // Claude Code 改造电视：广告全关，自建主界面
  "2vbA6KjspoE": ["tutorial", "es"], // CleanYourTV con IA GRATIS: tu Google TV sin anuncios (sin pa
  "BV1eDn968E7D": ["tutorial", "zh"], // 1分钟学会帮父母家里老电视去除广告和没用的软件。#电视优化 #电视  #办公就用dumate #电视去广告
  "BV1iGnx6XErs": ["other", "zh"], // GitHub 飙升榜 TOP6 · 2026-10-23｜AI熊
  "BV1LoyGzZEff": ["other", "zh"], // 【安卓电视净化】同 WiFi 一键关广告卸预装，换极简桌面媲美 Apple TV
  "40UueqxEp7M": ["tutorial", "en"], // Tidy Up Your Google TV With a Phone! | CleanYourTV
  "BV1X84q6hExi": ["tutorial", "zh"], // 测评打假 cleanyourtv净化桌面 电视桌面净化效果   cleanyourtv实测#真干活用搭子 #办公就用du
  "vK7vlVfI8oY": ["tutorial", "hi"], // Android TV Slow Hai? AI Wala Jugaad Karne Se Pehle Ye Dekh L
  "BV1toxD64EYQ": ["other", "zh"], // AI替天行道，电视广告被干掉了！
  "BV1qQnW67EF9": ["other", "zh"], // 这个开源电视优化工具太夯了！告别开机广告！#安卓电视 #电视优化 #广告拦截  #Github #真干活用搭子 #办公就
  "efyyLijlEB0": ["tutorial", "te"], // Smart TV Undo Button! 🔁 CleanYourTV Remove Cheyadam Ela? | P
  "BV1FtWs6eEmU": ["tutorial", "zh"], // CleanYourTV 之后又有新玩法！6 款开源电视工具，老电视和盒子怎么选？
  "BV1Tuxc6jEy3": ["tutorial", "zh"], // CleanYourTV 到底强在哪？两百多 KB 极简桌面、界面媲美 Apple TV，装完随时能恢复出厂丨老电视也能跑
  "BV1rMnr66E42": ["tutorial", "zh"], // 仅需电脑和电视在同一WiFi下，就能净化所有安卓电视桌面的教程来了！ #办公就用dumate  #百度搭子 #电视桌面 
  "24lkUAB5lQc": ["other", "pt"], // Claude Code tirou os ANÚNCIOS da TV
  "BV1fuyYznEDM": ["other", "zh"], // sony劈了腿并且小米出了轨，我让sony电视用上小米蓝牙遥控器
  "Bj3XHsdoL2g": ["tutorial", "ml"], // RDR2 on Android TV Home? How to Do It! 😨🔥| Malayalam
  "BV111WE6oEAW": ["other", "zh"], // 花钱买电视，开机先替别人放 15 秒广告
  "Q1jfQb9VRHc": ["tutorial", "ru"], // Как убрать рекламу с Android TV через Claude: бесплатный про
  "5VGT0pf0JXc": ["other", "en"], // People Gave Claude Their Homes 😳
  "kgZzlRrVNYo": ["tutorial", "es"], // CleanYourTV: el cambio que despeja tu pantalla de inicio
  "iLFBinuJO94": ["tutorial", "en"], // Your Smart TV isn't old, it's full: what Claude does (and ho
  "BV1x5ns6aETy": ["tutorial", "zh"], // 治理国产智能电视的开机广告和推荐位的解决方法，官方实测覆盖42品牌123款机型，小米/TCL/索尼六款机型已验证
  "lzftxCd5dg4": ["other", "en"], // People are using AI to make their smart TVs dumb again
  "DmmCwe9suAg": ["other", "hi"], // I Tried the Internet's Viral TV Hack... Turn Your Laggy Goog
  "BV1BGnN6wEDW": ["other", "zh"], // [开源]3天6100星！用Claude Code自动整治电视广告
  "BV1cnsS6gEuL": ["tutorial", "zh"], // 夯爆了！Github 又出狠活神器！电视改造：CleanYourTV 部署，干净无广告 TV
  "BV1TGnm6AEg2": ["other", "zh"], // 开源电视优化神器，老电视的救星，告别弹窗广告。#真干活用搭子 #办公就用dumate #百度搭子 #Github
  "FWvsBv6hzyw": ["other", "pt"], // Limpar a Smart TV com IA: na LG e Samsung muda só o visual?
  "z_F7V0gt6d0": ["other", "tr"], // XIAOMI TV X Mini – Claude Code ile Hızlandırma ve Reklam Kal
  "MjOqubDSIgU": ["tutorial", "te"], // Android TV ని మీ మొబైల్‌తోనే Clean చేయండి! No PC Needed | Te
  "LPhfJddRbL8": ["tutorial", "en"], // Why Is My Google TV Full of Ads? Here's How to Stop It
  "DPsIfUQSgwA": ["other", "en"], // GitHub's Most Starred Projects of 2026, Explained in 3 Minut
  "su5d9ql6Gnw": ["tutorial", "en"], // I used AI to make my TV 10x Better in simple two steps
  "VfKi23L4P1E": ["tutorial", "en"], // Use Claude to Fix Your Android TV (No More Ads)
  "iK16b3WIsro": ["other", "zh"], // 开机先看广告？有人一句话让 AI 把智能电视「变笨」了
  "gPwLxh6reuo": ["other", "en"], // Claude Helped Hack This Smart TV
  "Zb5xMq8pf3o": ["tutorial", "en"], // Clean your tv with app no ads and bloatware just clean launc
  "912tGEhgdJA": ["tutorial", "en"], // Ads on a TV you paid for? Try a clean home screen
  "0QolJxrAY14": ["other", "es"], // Revive tu Smart TV Lento con IA y Elimina Anuncios (Seguro)
  "3HX77-eTSuM": ["tutorial", "hi"], // I Transformed My 7-Year-Old TV for FREE! 🤯 No Claude, No Pai
  "H089japVSUw": ["tutorial", "en"], // I Removed the Ads From My Living Room TV (2026)
  "ApM5e_ghTRM": ["tutorial", "en"], // Remove Ads From Smart TV With AI: 3 Agents Tested
  "BV18Axc6nESv": ["tutorial", "zh"], // 【CleanYourTV】老电视又卡又有广告？最详细的电视瘦身教程！两百多 KB 极简桌面！！附带 AI 装技能步骤！
  "BV1LhsS6aEZH": ["other", "zh"], // 【第12期】电视优化开源工具！禁用系统广告、清理预装软件、替换超轻量桌面，支持多款电视机型！老电视机也能重获流畅体验
  "fd7tms7EByQ": ["other", "en"], // People Are Building INSANE Things With Claude (20 Real Examp
  "FQ4FMZRn7Hw": ["other", "en"], // 18 Real Ways People Used Claude This Month
  "JTmisy001Zg": ["other", "tr"], // Claude Code ile JVC Android TV Optimizasyonu
  "BV1bTxc6mEKC": ["tutorial", "zh"], // 电视瘦身合集来了！CleanYourTV 开源工具，清预装关广告换桌面，报个型号 AI 给你出完整步骤
  "BV1GFxc6pEcG": ["tutorial", "zh"], // 不废话，CleanYourTV 直接上！电脑连同一 WiFi 清预装关广告，家里电视老的新的都合适
  "M6qgXoZfG70": ["other", "en"], // GitHub Trending Oct 25: +80% BF16 on RTX 3090 Ti, ad-free An
  "BV1gAxc6nEqQ": ["tutorial", "zh"], // 【网友推荐】CleanYourTV 电视优化工具上线！电脑连同一 WiFi 清预装去广告 附带 AI 一步装好教程！【电
  "OvGDH1vSJOM": ["tutorial", "en"], // Remove Ads From Your Smart TV With Claude Code? We Read 300+
  "YJJh9xrnwdQ": ["tutorial", "pt"], // Sua TV não é velha, está cheia: o que o Claude faz (e como f
  "BV13Hn26TECa": ["other", "zh"], // Claude 爆改安卓老电视机成apple TV #科技 #真干活用搭子 #办公就用dumate #百度搭子
  "4MhDAkKncSE": ["other", "pt"], // 5 apps grátis para tirar anúncio e lixo de fábrica da TV And
  "4EQHCYHO_I8": ["other", "zh"], // 电视开机广告终于能关了！免root、免刷机，小白也能搞定 | 小白神器商店
  "BV1j8sS6AEXH": ["other", "zh"], // 【第1期】电视优化开源工具！禁用系统广告、清理预装软件、替换超轻量桌面，支持多款电视机型！老电视机也能重获流畅体验
  "U30ATEK9nPU": ["tutorial", "id"], // Bersihkan Iklan & Bloatware Android TV Tanpa Root (CleanYour
  "qgpXDC9IbTs": ["other", "en"], // GitHub Top 10 This Week — Week of October 23, 2026 (Ep. 007)
  "HT8GhKgI8FI": ["other", "pt"], // Especial: apps grátis para PC, celular e TV | Top 10 Vol. 11
  "BV1vDnH6gEh4": ["tutorial", "zh"], // 【8期】CleanYourTV:一键清掉安卓电视广告
  "IxMoBZg7lRM": ["other", "tr"], // XIAOMI TV X Mini – Reklamları Kaldırma ve Hızlandırma
  "waqlYFiGT7M": ["tutorial", "en"], // Why Does a TV You Paid For Show Ads? Claude Turned Them Off
  "WCzL9Wi12GU": ["other", "en"], // Bloatware removal in TV using Claude
  "nGHj3dKaJSA": ["tutorial", "te"], // Mobile తో Android TV Home Screen మార్చండిలా! | Clean UI & No
  "qTgFVUtgEcI": ["other", "en"], // 電視機廣告太多？一個開源工具幫你清乾淨 #Shorts
  "l2SoJhX7DK8": ["tutorial", "zh"], // CleanYourTV：Hermes 清掉便宜电视 11 个追踪器 #shorts
  "1lhDjBJuQTA": ["other", "es"], // IA para limpiar tu Smart TV: choca con los filtros de cibers
  "74pXRmXEiiM": ["tutorial", "it"], // JVC Android TV – Installare un launcher personalizzato con C
  "JTCCrarcLG0": ["other", "ko"], // 구글TV 광고·버벅임 없애기 | 클로드가 15분 만에 정리해 주는 무료 오픈소스 (안드로이드TV)
  "BV1HTyxzzEDp": ["other", "zh"], // AI把电视广告全删了，开源免费不用刷机
  "U7O-QM3Cd6I": ["other", "hi"], // Claude Code Switched Off the Ads on My Android TV
  "3jrQg52evcA": ["tutorial", "en"], // People Are Vibe-Coding Their TVs to Remove Ads — 41,000 Star
  "OpyHMKfuUeA": ["tutorial", "tr"], // JVC Android TV – Özel Başlatıcı Nasıl Kurulur
  "SyVqQhVcwmY": ["tutorial", "hi"], // How to Make ANY Slow Android TV Fast & Ad-Free (Apple TV Sty
  "BV1MPxc6SE1Z": ["tutorial", "zh"], // 【保姆级最新教程】电视卡顿广告多？CleanYourTV 开源工具，电脑连同一 WiFi 就能清理预装软件，老电视也能重
  "udMEnJYmOx8": ["other", "uk"], // Мій Sony TV стежив за мною. Claude вимкнув 18 трекерів за 1 
  "RtCgbnhcQGs": ["other", "de"], // XIAOMI TV X Mini – Werbung entfernen & mit Claude Code besch
  "DueT82m2eNI": ["other", "en"], // AI Revolution: Smart TV Hacks, Marketing Gaps, and Ukraine's
  "BR161MGrFqQ": ["other", "it"], // La smart TV dei genitori, e Claude Code per censurare le pub
  "LtoXxfpl2iU": ["tutorial", "de"], // JVC Android TV – Custom Launcher mit Claude Code installiere
  "przuQswGNOc": ["other", "de"], // XIAOMI TV X Mini – Langsamkeit beheben & Werbung entfernen m
  "vLJa1iGY4Qg": ["tutorial", "en"], // Organize Your Android TV From Your Mobile! | CleanYourTV
  "CMPW7IMXJnM": ["tutorial", "ja"], // JVC Android TV – カスタムランチャーの導入方法
  "G7WebR0igLQ": ["tutorial", "de"], // Cleanyourtv: Android TV werbefrei in 10 Minuten – gratis
  "94VjEiaSbeU": ["other", "it"], // JVC Android TV – Come rimuovere la pubblicità dalla schermat
  "BV12dxN68Eoz": ["other", "zh"], // 电视首页全是广告？一句话让 AI 帮你关掉（不卸载、随时还原）
  "Wrdwy-QzkD8": ["other", "ja"], // 📺 テレビの広告掃除をAIに任せる時代が来た
  "bSKa0DGLD6s": ["other", "it"], // Claude Code – Ottimizza la tua JVC Android TV
  "75OVt7HxcCE": ["other", "ko"], // 내 돈 주고 산 스마트TV인데, 광고 봐야해? AI로 싹 지웠다
  "7wTVKAEdNjE": ["other", "it"], // XIAOMI TV X Mini – Come velocizzare e rimuovere gli annunci 
  "J0Ap1iPUTIc": ["other", "ja"], // JVC Android TV – 初期化せずに遅いテレビを高速化する手順
  "NZnyyk_HJ5g": ["other", "fr"], // Orba 3.7 : bilingue, Infos sur l'appli et plus de télés comp
  "4L5c0KY7OO8": ["other", "it"], // XIAOMI TV X Mini – Come rimuovere gli annunci e velocizzare 
  "pigmHZkOV2U": ["tutorial", "ja"], // XIAOMI TV X Mini – Claude Codeを使用して速度向上と広告削除を行う方法
  "wy10dcxsnO8": ["tutorial", "en"], // How Vibe Coding With Claude Code Is Revolutionizing Everyday
  "GbDBRggGYFo": ["tutorial", "ja"], // JVC Android TV – クロードコードでカスタムランチャーをインストールする方法
  "J4PbjFXJTTc": ["other", "ja"], // XIAOMI TV X Mini – Claude Codeを使用して広告を削除しTVを高速化する
  "3TDuh92-KyY": ["tutorial", "ja"], // JVC Android TV – Claude Codeで最適化する方法
  "T5sWG5EgJYg": ["tutorial", "en"], // AI Cleaned My Android TV: No More Sponsored Ads + Apple TV L
  "B3-sLTsw9yE": ["other", "en"], // GitHub's 470K-Star AI Tool Lets Agents Hack Your Smart TV
  "38qjeF56wks": ["other", "en"], // Zrychlení Android televize s Claude Code: na co nezapomenout
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
