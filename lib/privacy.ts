// /not-android's content as data: each brand's steps (menu paths by model year), the network check's hosts, the DNS
// block-or-keep tables, the undo list and the sources. The guide, the no-JS list and the printout all read from here.
// Every path and fact is from cleanyourtv-launch/tv-privacy-research.md; nothing it marks unverified is here.

export type BrandId = "samsung" | "lg" | "roku" | "vizio" | "firetv" | "hisense" | "google";

/** One switch at the end of a path: "off" draws ☐, "on" draws ☑, "press" draws a button. */
export type Item = { name: string; to: "off" | "on" | "press" };

/** One way through the menus. With `years`, it only shows for TVs from those years once the year is known; with `for`,
 *  only for those answers to the brand's question (VIDAA version, Vizio menu…). */
export type Variant = { label: string; years?: [number, number]; for?: string[]; crumbs: string[]; items?: Item[]; note?: string };

/** Someone confirmed this step on their own TV, through a "Worked on my TV" issue. None yet. */
export type Check = { year: number; model: string; by: string; issue: number };

export type Step = {
  id: string;
  title: string;
  /** What the step does, in one plain line from what the step itself says (the card, remote mode and print show it). */
  does: string;
  /** Who the step is for, when not everyone: "Sony only", "If your TV has one". */
  tag?: string;
  /** Only for these answers to the brand's question (a Roku TV, not a stick). */
  only?: string[];
  variants?: Variant[];
  /** Same screen as another step: show that step's path with this step's items. */
  sameAs?: string;
  items?: Item[];
  /** For steps done away from the TV's menus (a switch on the set, a phone app). */
  text?: string;
  note?: string;
  undo: string;
  sources: [string, string][];
  checks: Check[];
};

/** One answer to the brand's question: a model-year group, or which menu, version or kind of device it is. */
export type Choice = { id: string; label: string; years?: [number, number] };

export type Brand = {
  id: BrandId;
  name: string;
  os: string;
  intro: string;
  /** Step 2 of the guide: the question that narrows the menu paths down, and its answers. */
  ask: { q: string; help: string; choices: Choice[] };
  /** HaGeZi's native list for the DNS level, or why there isn't one. */
  list?: string;
  listNote?: string;
  /** Model-year buttons for the year step; the last one means "this year or older". */
  years?: number[];
  decoder?: "samsung" | "lg";
  /** Where the model number is, for the year step. */
  findModel?: string;
  /** For brands whose menus moved between OS versions: where to look the version up. */
  findVersion?: string;
  steps: Step[];
  outro?: string;
};

const CR = ["Consumer Reports, Oct 2025", "https://www.consumerreports.org/electronics/privacy/how-to-turn-off-smart-tv-snooping-features-a4840102036/"] as [string, string];
const CR21 = ["Consumer Reports, 2021", "https://www.yahoo.com/news/turn-off-smart-tv-snooping-110157618.html"] as [string, string];
const CR22 = ["Consumer Reports, Oct 2022", "https://www.yahoo.com/news/turn-off-smart-tv-snooping-060657238.html"] as [string, string];
const EM21 = ["Samsung 2021 e-Manual (AU8000)", "https://m.media-amazon.com/images/I/C170VD7wAYL.pdf"] as [string, string];
const MARKUP = ["The Markup", "https://themarkup.org/privacy/2023/12/12/your-smart-tv-knows-what-youre-watching"] as [string, string];
const IMC = ["IMC 2024 study", "https://arxiv.org/abs/2409.06203"] as [string, string];
const NAI = ["NAI", "https://thenai.org/opt-out/connected-tv-choices/"] as [string, string];

export const BRANDS: Brand[] = [
  {
    id: "samsung",
    name: "Samsung",
    os: "Tizen",
    intro: "Samsung calls its tracking Viewing Information Services. It only runs if you agreed to it, and most people did, on the “Agree to all” screen during setup.",
    years: [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018],
    decoder: "samsung",
    ask: {
      q: "How old is your TV?",
      help: "Samsung moved these menus over the years. Pick a year to see only your path.",
      choices: [
        { id: "2025", label: "2025", years: [2025, 2025] },
        { id: "2022-2024", label: "2022–2024", years: [2022, 2024] },
        { id: "2019-2021", label: "2019–2021", years: [2019, 2021] },
        { id: "older", label: "2018 or older", years: [1990, 2018] },
      ],
    },
    list: "native.samsung",
    findModel: "Hold Play/Pause on the remote for about 10 seconds, or go to Settings › All Settings › Support › About This TV. It’s also on the sticker on the back.",
    steps: [
      {
        id: "acr",
        title: "Turn off Viewing Information Services",
        does: "Stops your TV recognising what’s on screen and reporting it.",
        items: [{ name: "Viewing Information Services", to: "off" }],
        variants: [
          { label: "2025 TVs", years: [2025, 2025], crumbs: ["Settings", "All Settings", "General & Privacy", "Terms & Privacy"], note: "Some models say “Terms and Policy”." },
          { label: "2022–2024 TVs", years: [2022, 2024], crumbs: ["Settings", "All Settings", "General & Privacy", "Terms & Privacy", "Privacy Choices", "Terms & Conditions, Privacy Policy"] },
          {
            label: "2019–2021 TVs",
            years: [2019, 2021],
            crumbs: ["Settings", "Support", "Terms & Privacy", "Privacy Choices"],
            note: "Some sets say “Terms & Policy”. On a 2021 TV, if the menu looks different, try the 2022–2024 path, or Home › Privacy Choices.",
          },
          { label: "2018 and older", years: [1990, 2018], crumbs: ["Smart Hub", "Settings", "Support", "Terms & Policy"], items: [{ name: "SyncPlus and Marketing", to: "off" }] },
          { label: "Any year", crumbs: ["Home", "Privacy Choices"], note: "An app in the home screen’s side bar that opens the same agreements." },
        ],
        undo: "Tick it again in the same place.",
        sources: [CR, ["SamMobile, Feb 2025", "https://www.sammobile.com/news/samsung-tvs-displaying-repeated-privacy-pop-ups/"], CR22, CR21, EM21, ["Samsung: ACR", "https://www.samsung.com/us/support/answer/ANS10010616/"]],
        checks: [],
      },
      {
        id: "ads",
        title: "Untick the rest on that screen",
        does: "Ads stay, but stop being targeted at you.",
        sameAs: "acr",
        items: [
          { name: "Interest-Based Advertisements", to: "off" },
          { name: "Customization Service", to: "off" },
          { name: "Improve personalized ads", to: "off" },
          { name: "Get news and special offers", to: "off" },
          { name: "Do not track", to: "on" },
        ],
        note: "This is the full set the IMC 2024 study switched off before the TVs stopped contacting tracking servers. Your TV may not show every one.",
        undo: "Tick them again. Ads stay either way; they just stop being targeted.",
        sources: [IMC],
        checks: [],
      },
      {
        id: "psid",
        title: "Reset the ad ID",
        does: "Gives the TV a new ad ID. On its own it doesn’t stop personalised ads.",
        variants: [{ label: "Newer menus", crumbs: ["Settings", "All Settings", "General & Privacy", "Terms & Privacy"], items: [{ name: "Reset PSID", to: "press" }] }],
        note: "This gives the TV a new ad ID. On its own it doesn’t turn off personalised ads; step 2 does.",
        undo: "Nothing to undo.",
        sources: [NAI],
        checks: [],
      },
      {
        id: "voice",
        title: "Turn off Bixby’s wake word",
        does: "The TV stops listening for its wake word.",
        items: [{ name: "Voice Wake-Up", to: "off" }],
        variants: [
          { label: "2025 TVs", years: [2025, 2025], crumbs: ["Settings", "All Settings", "Advanced Features", "Voice", "Bixby Settings"] },
          { label: "2022–2024 TVs", years: [2022, 2024], crumbs: ["Settings", "All Settings", "General & Privacy", "Voice", "Bixby Settings"] },
          { label: "2021 and older", years: [1990, 2021], crumbs: ["Settings", "General", "Voice", "Bixby Voice Settings"], note: "From Samsung’s 2021 manual; older sets may differ." },
        ],
        note: "Bixby itself can’t be turned off, only its wake-up.",
        undo: "Turn Voice Wake-Up back on.",
        sources: [
          ["Samsung: Bixby", "https://www.samsung.com/hk_en/support/tv-audio-video/how-to-set-up-and-use-bixby-on-your-samsung-smart-tv/"],
          ["Samsung AU: Bixby can’t be turned off", "https://www.samsung.com/au/support/tv-audio-video/how-to-use-bixby-on-a-samsung-smart-tv/"],
          EM21,
        ],
        checks: [],
      },
      {
        id: "mic",
        title: "Flip the mic switch",
        does: "Cuts the microphone off in hardware.",
        tag: "If your TV has one",
        text: "Feel along the lower edge of the TV, in the middle or towards the right, for a small switch. Slide it to off. Not every model has one.",
        note: "With it off, voice commands stop. The remote’s mic only listens while you hold its button.",
        undo: "Slide the switch back.",
        sources: [["Samsung: mic switch", "https://www.samsung.com/ca/support/tv-audio-video/how-to-enable-or-disable-the-microphone-switch-on-samsung-smart-tvs"]],
        checks: [],
      },
      {
        id: "petcare",
        title: "Leave Pet Care off",
        does: "Keeps the TV from listening for barking while it’s off.",
        tag: "Q8F and higher",
        text: "On Q8F and higher models, Pet Care uses the TV’s mic to listen for barking while the TV is off. It’s switched on from the SmartThings app on your phone, so if you never turned it on there, you’re done.",
        undo: "Turn it on again in SmartThings.",
        sources: [["Samsung: Pet Care", "https://www.samsung.com/us/tvs/smart-tv/smart-home/"]],
        checks: [],
      },
    ],
    outro: "Some owners report ad settings switching back after a firmware update, so look again after one.",
  },
  {
    id: "lg",
    name: "LG",
    os: "webOS",
    intro: "LG calls its tracking Live Plus, and the Viewing Information agreement covers it too. LG says it’s off by default; Pocket-lint reports it on by default, so check.",
    years: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019],
    decoder: "lg",
    ask: {
      q: "How old is your TV?",
      help: "LG moved Live Plus in 2025 and again in 2026.",
      choices: [
        { id: "2026", label: "2026", years: [2026, 2026] },
        { id: "2025", label: "2025", years: [2025, 2025] },
        { id: "2021-2024", label: "2021–2024", years: [2021, 2024] },
        { id: "2020", label: "2020", years: [2020, 2020] },
      ],
    },
    list: "native.lgwebos",
    findModel: "Press Mute three times on the remote and the model number pops up. It’s also on the sticker on the back.",
    steps: [
      {
        id: "acr",
        title: "Turn off Live Plus",
        does: "Stops your TV recognising what’s on screen and reporting it.",
        items: [{ name: "Live Plus", to: "off" }],
        variants: [
          { label: "2026 TVs", years: [2026, 2026], crumbs: ["Hold the Settings button", "System", "Additional settings"] },
          { label: "2025 TVs", years: [2025, 2025], crumbs: ["All Settings", "Support", "Privacy & Terms", "User Agreements"], items: [{ name: "Viewing Information", to: "off" }] },
          { label: "2021–2024 TVs", years: [2021, 2024], crumbs: ["All Settings", "General", "System", "Additional Settings"] },
          { label: "2020 TVs", years: [2020, 2020], crumbs: ["Settings", "General", "Additional Settings"] },
        ],
        undo: "Turn it back on in the same place.",
        sources: [CR, ["XDA, Aug 2026", "https://www.xda-developers.com/hidden-lg-tv-settings-i-changed-immediately-to-make-my-new-tv-look-even-better/"], MARKUP, ["Pocket-lint", "https://www.pocket-lint.com/lg-tv-turn-off-live-plus/"], CR21],
        checks: [],
      },
      {
        id: "agreements",
        title: "Decline the optional agreements",
        does: "Says no to the optional data sharing. Apps keep working without it.",
        items: [
          { name: "Viewing information", to: "off" },
          { name: "Voice information", to: "off" },
          { name: "Interest-based & Cross-device advertising", to: "off" },
          { name: "Who.Where.What?", to: "off" },
          { name: "Do Not Sell My Personal Information", to: "on" },
        ],
        variants: [
          { label: "Most TVs", crumbs: ["Settings", "Privacy & Terms", "User Agreements"] },
          { label: "Older menus", crumbs: ["All Settings", "Support", "Privacy & Terms", "User Agreements"] },
        ],
        note: "Only the Terms of Use and the Privacy Policy are required. Apps keep working without the rest.",
        undo: "Accept them again in User Agreements. Voice control needs Voice information.",
        sources: [["LG: User Agreements", "https://www.lg.com/us/support/help-library/how-to-accept-the-updated-user-agreements-on-your-lg-tv--20155426555618"], CR],
        checks: [],
      },
      {
        id: "adid",
        title: "Limit ad tracking",
        does: "Ads stay, but stop being targeted at you.",
        variants: [{ label: "", crumbs: ["All Settings", "General", "System", "Additional Settings", "Advertisement"] }],
        items: [{ name: "Limit AD Tracking", to: "on" }],
        undo: "Turn it off again.",
        sources: [MARKUP],
        checks: [],
      },
      {
        id: "home",
        title: "Stop the home screen promotions",
        does: "Takes the promotions and recommended content off the home screen.",
        variants: [{ label: "", crumbs: ["All Settings", "General", "System", "Additional Settings", "Home Settings"] }],
        items: [
          { name: "Home Promotion", to: "off" },
          { name: "Content Recommendation", to: "off" },
        ],
        note: "On 2026 TVs, also turn off Screen Saver Promotion, and AI Recommendations under General › AI Service › LG AI Settings.",
        undo: "Tick them again.",
        sources: [MARKUP, ["LG: Content Recommendation", "https://www.lg.com/in/support/product-support/troubleshoot/help-library/cs-CT52006584-20153905578425OLT/"], ["XDA, Aug 2026", "https://www.xda-developers.com/hidden-lg-tv-settings-i-changed-immediately-to-make-my-new-tv-look-even-better/"]],
        checks: [],
      },
      {
        id: "voice",
        title: "Leave hands-free voice off",
        does: "The TV stops listening for “Hi LG” in standby.",
        tag: "If you turned on “Hi LG”",
        text: "If you turned on Hands-free Voice (“Hi LG”), turn it off: with it on, the TV listens for the wake word in standby. Some models also have a hardware mic switch.",
        note: "Voice recognition is off by default. The Magic Remote’s mic only listens while you hold its button.",
        undo: "Turn Hands-free Voice back on.",
        sources: [["LG statement, Sep 2026", "https://www.lg.com/global/newsroom/news/statements/statement-understanding-privacy-on-lg-smart-tvs/"]],
        checks: [],
      },
    ],
    outro: "Menu paths can move with a software update. If yours didn’t match, tell us what you saw.",
  },
  {
    id: "roku",
    name: "Roku",
    os: "Roku TV",
    intro: "Roku TVs, including TCL and Hisense Roku TVs, have ACR. Roku sticks don’t.",
    ask: {
      q: "Which Roku do you have?",
      help: "ACR is on Roku TVs, not on Roku sticks, so a stick has one step fewer.",
      choices: [
        { id: "tv", label: "Roku TV (TCL, Hisense…)" },
        { id: "stick", label: "Roku streaming stick" },
      ],
    },
    list: "native.roku",
    steps: [
      {
        id: "acr",
        title: "Turn off ACR",
        does: "Stops your TV recognising what’s on screen and reporting it.",
        only: ["tv"],
        variants: [
          { label: "On the TV", crumbs: ["Home", "Settings", "Privacy", "Smart TV Experience"] },
          { label: "Or on the web", crumbs: ["my.roku.com", "Privacy Settings", "Smart TV Experience"] },
        ],
        items: [{ name: "Automatic Content Recognition (ACR)", to: "off" }],
        note: "Older software calls it “Use info from TV inputs”.",
        undo: "Tick it again. You lose the “More Ways to Watch” suggestions from live TV while it’s off.",
        sources: [["Roku support", "https://support.roku.com/article/115005739288"], MARKUP],
        checks: [],
      },
      {
        id: "ads",
        title: "Turn off personalised ads",
        does: "Ads stay, but stop being targeted at you.",
        variants: [{ label: "", crumbs: ["Settings", "Privacy", "Advertising"] }],
        items: [{ name: "Personalize ads", to: "off" }],
        note: "Older software calls it Limit ad tracking (tick that one on). Resetting the advertising ID on its own doesn’t opt you out.",
        undo: "Tick it again.",
        sources: [NAI],
        checks: [],
      },
      {
        id: "mic",
        title: "Check the microphone settings",
        does: "Channels lose access to the microphone.",
        variants: [{ label: "", crumbs: ["Settings", "Privacy", "Microphone"] }],
        note: "Take mic access away from each channel, or block it for all. On the Voice Remote Pro, the hands-free switch turns off “Hey Roku”; push-to-talk still works.",
        undo: "Allow it again in the same menu.",
        sources: [["Roku: microphone", "https://developer.roku.com/dev/docs/romicrophone"], ["Roku: Voice Remote Pro", "https://support.roku.com/en-ca/article/learn-about-voice-remote-pro"]],
        checks: [],
      },
    ],
    outro: "Menu paths can move with a software update. If yours didn’t match, tell us what you saw.",
  },
  {
    id: "vizio",
    name: "Vizio",
    os: "SmartCast",
    intro: "Vizio calls its tracking Viewing Data. The menu moved over the years, so use the path that matches what your TV shows.",
    ask: {
      q: "What does your Settings menu show?",
      help: "Vizio renamed the menu twice. Press Settings and look for one of these.",
      choices: [
        { id: "pl", label: "Privacy & Legal" },
        { id: "ap", label: "Admin & Privacy" },
        { id: "old", label: "System › Reset & Admin (before 2020)" },
      ],
    },
    listNote: "HaGeZi has no Vizio list, so add the domains below to your blocker by hand.",
    steps: [
      {
        id: "acr",
        title: "Turn off Viewing Data",
        does: "Stops your TV recognising what’s on screen and reporting it.",
        variants: [
          { label: "If you see Privacy & Legal", for: ["pl"], crumbs: ["All Settings", "Privacy & Legal"] },
          { label: "If you see Admin & Privacy", for: ["ap"], crumbs: ["All Settings", "Admin & Privacy"] },
          { label: "Before 2020", for: ["old"], crumbs: ["System", "Reset & Admin"] },
        ],
        items: [{ name: "Viewing Data", to: "off" }],
        note: "Before 2017 it was called Smart Interactivity.",
        undo: "Turn Viewing Data back on.",
        sources: [["Vizio: Viewing Data", "https://vizio.com/en/terms/privacy-policy/viewing-data-privacy-policy"], ["FTC, 2017", "https://www.ftc.gov/business-guidance/blog/2017/02/what-vizio-was-doing-behind-tv-screen"]],
        checks: [],
      },
      {
        id: "walmart",
        title: "Don’t link your viewing to Walmart",
        does: "What you watch isn’t linked to your Walmart account.",
        sameAs: "acr",
        items: [{ name: "Let Walmart link Viewing Data to your Walmart account", to: "off" }],
        note: "Walmart owns Vizio now. The Viewing Data screen lets you say no.",
        undo: "Allow it again on the same screen.",
        sources: [["Vizio: Viewing Data", "https://vizio.com/en/terms/privacy-policy/viewing-data-privacy-policy"]],
        checks: [],
      },
      {
        id: "ads",
        title: "Limit ad tracking",
        does: "Ads stay, but stop being targeted at you.",
        variants: [
          { label: "If you see Privacy & Legal", for: ["pl"], crumbs: ["Menu", "Privacy & Legal", "Advertising"] },
          { label: "Before 2024", for: ["ap"], crumbs: ["Menu", "Admin & Privacy", "Advertising"] },
          { label: "Before 2020", for: ["old"], crumbs: ["System", "Reset & Admin", "Advertising"] },
        ],
        items: [
          { name: "Limited Ad Tracking", to: "on" },
          { name: "Reset TV Advertiser ID", to: "press" },
        ],
        note: "Ads still show; they just stop being targeted.",
        undo: "Turn Limited Ad Tracking off again.",
        sources: [["Vizio: ads FAQ", "https://vizio.com/en/terms/privacy-policy/ads-and-privacy-faq"]],
        checks: [],
      },
    ],
    outro: "Menu paths can move with a software update. If yours didn’t match, tell us what you saw.",
  },
  {
    id: "hisense",
    name: "Hisense VIDAA",
    os: "Also some Toshiba",
    intro: "On VIDAA, Hisense’s own system (also on some Toshiba TVs), the tracking is called Enhanced Viewing Service. It’s opt-in at setup and recognises what’s on screen from its audio. Hisense TVs that run Google TV or Roku: use those tabs.",
    findVersion: "The menus moved between VIDAA versions. Yours is in Settings › Support › About, or Settings › Support › System Info › Version on older sets.",
    ask: {
      q: "Which VIDAA version?",
      help: "Find it in Settings › Support › About, or Settings › Support › System Info › Version on older sets. Hisense on Google TV or Roku? Pick those instead.",
      choices: [
        { id: "u9", label: "VIDAA U9" },
        { id: "u6", label: "VIDAA U6" },
        { id: "u5", label: "VIDAA U5" },
      ],
    },
    listNote: "HaGeZi has no native VIDAA list, but its Light, Multi and Pro lists include these hosts. Block host by host, not all of vidaahub.com or hismarttv.com: updates and the Ads Privacy app live there too.",
    steps: [
      {
        id: "acr",
        title: "Turn off Enhanced Viewing",
        does: "Stops your TV recognising what’s on screen from its sound and reporting it.",
        variants: [
          {
            label: "If Settings has Advanced Settings",
            crumbs: ["Settings", "Advanced Settings", "Enhanced Viewing Settings"],
            items: [{ name: "Enable Automatic Content Recognition", to: "off" }],
            note: "Then choose “No, thank you” and “Yes, Decline” on the two pop-ups.",
          },
          {
            label: "If it’s under System (VIDAA U5)",
            for: ["u5"],
            crumbs: ["Settings", "System", "Advanced Settings", "Enhanced Viewing"],
            items: [{ name: "Automatic Content Recognition", to: "off" }],
          },
        ],
        note: "Enhanced Viewing isn’t offered in every country or on every model; if you can’t find it, skip this step. Menus vary between VIDAA versions: if yours looks different, tell us.",
        undo: "Turn it back on in the same place.",
        sources: [
          ["Pocket-lint, Sep 2026", "https://www.pocket-lint.com/how-to-disable-acr-on-a-hisense-tv/"],
          ["Hisense VIDAA U5 manual", "https://commercial.appliancesonline.com.au/manuals/ak/6/3/0/a/630a17fa9e80408c8ad491b0e6ef5608a103fa20_85A7G_User_Manual.pdf"],
          ["VIDAA privacy policy", "https://www.vidaa.com/os-privacy-policy/"],
        ],
        checks: [],
      },
      {
        id: "ev-rest",
        title: "Turn off the rest of Enhanced Viewing",
        does: "Turns off the personalised ads, recommendations and automatic picture and sound that come with it.",
        variants: [{ label: "If Settings has Advanced Settings", crumbs: ["Settings", "Advanced Settings", "Enhanced Viewing Settings"] }],
        items: [
          { name: "Enable Personalized Ads", to: "off" },
          { name: "Enable Content Recommendation", to: "off" },
          { name: "Enable Automatic Picture and Audio Quality", to: "off" },
        ],
        note: "On VIDAA U5 menus there’s nothing more here: these switch off together with Automatic Content Recognition.",
        undo: "Turn them back on in the same place.",
        sources: [
          ["Pocket-lint, Sep 2026", "https://www.pocket-lint.com/how-to-disable-acr-on-a-hisense-tv/"],
          ["V: Enhanced Viewing notice", "https://v-home.com/enhanced-viewing-service-privacy-notice-us/"],
        ],
        checks: [],
      },
      {
        id: "ads",
        title: "Turn off personalised ads",
        does: "Ads stay, but stop being targeted at you.",
        variants: [{ label: "", crumbs: ["Settings", "System", "Advanced Settings", "Personalised Ads"] }],
        items: [
          { name: "Personalised Ads", to: "off" },
          { name: "Reset Ads ID", to: "press" },
        ],
        note: "This doesn’t reduce the number of ads, it just stops them being picked for you. Older menus may not have it.",
        undo: "Turn Personalised Ads back on.",
        sources: [["Hisense VIDAA U9 manual", "https://www.hisense.com.my/wp-content/uploads/2025/08/93041_9603VIDAA_U9_EUEMCO_E-Manual_eng_202502%E5%AE%8C%E6%95%B4%E6%9F%A5%E7%9C%8B%E7%89%88.pdf"]],
        checks: [],
      },
      {
        id: "consent",
        title: "Check what you agreed to",
        does: "Withdraws the data-sharing consents you don’t want.",
        variants: [
          { label: "VIDAA U9", for: ["u9"], crumbs: ["Settings", "Support", "Disclaimer and Privacy", "Data Sharing, Privacy and EULA"] },
          { label: "VIDAA U6", for: ["u6"], crumbs: ["Settings", "Support", "Disclaimer and Privacy", "EULA and Other Policy and Services"] },
          { label: "VIDAA U5", for: ["u5"], crumbs: ["Settings", "Support", "Disclaimer and Privacy"] },
        ],
        note: "Deny the data-sharing consents you don’t want. Some features need theirs: unticking the VIDAA Account one signs you out. Remove User Data, in the same Disclaimer and Privacy menu, deletes your usage data from the TV and the cloud. In the US, the Do Not Sell or Share My Personal Information link is in Settings too.",
        undo: "Agree to them again in the same menu.",
        sources: [
          ["Hisense VIDAA U9 manual", "https://www.hisense.com.my/wp-content/uploads/2025/08/93041_9603VIDAA_U9_EUEMCO_E-Manual_eng_202502%E5%AE%8C%E6%95%B4%E6%9F%A5%E7%9C%8B%E7%89%88.pdf"],
          ["VIDAA U6 manual", "https://partners.gorenje.com/fts/GetDigitDoc.aspx?sifra=20009530&jezik=en&tipVsebine=1&docName=55a56fevs+e-manual_en.pdf"],
          ["Hisense VIDAA U5 manual", "https://commercial.appliancesonline.com.au/manuals/ak/6/3/0/a/630a17fa9e80408c8ad491b0e6ef5608a103fa20_85A7G_User_Manual.pdf"],
          ["V: Enhanced Viewing notice", "https://v-home.com/enhanced-viewing-service-privacy-notice-us/"],
        ],
        checks: [],
      },
      {
        id: "voice",
        title: "Turn off hands-free voice",
        does: "The TV stops listening for “Hey VIDAA” or “Alexa”.",
        variants: [
          { label: "VIDAA U9", for: ["u9"], crumbs: ["Settings", "System", "Voice Service", "VIDAA Voice or Amazon Alexa"], items: [{ name: "Hands-Free", to: "off" }] },
          { label: "VIDAA U5", for: ["u5"], crumbs: ["Settings", "System", "Voice Service", "Amazon Alexa"], items: [{ name: "Build-in Microphone", to: "off" }] },
        ],
        text: "TVs with far-field voice have a built-in microphone and a switch for it on the TV itself; the printed manual shows where. Slide it off too.",
        note: "With hands-free off, the TV stops listening for “Hey VIDAA” or “Alexa”. The remote’s mic button still works.",
        undo: "Turn Hands-Free back on, and the mic switch.",
        sources: [
          ["Hisense VIDAA U9 manual", "https://www.hisense.com.my/wp-content/uploads/2025/08/93041_9603VIDAA_U9_EUEMCO_E-Manual_eng_202502%E5%AE%8C%E6%95%B4%E6%9F%A5%E7%9C%8B%E7%89%88.pdf"],
          ["Hisense VIDAA U5 manual", "https://commercial.appliancesonline.com.au/manuals/ak/6/3/0/a/630a17fa9e80408c8ad491b0e6ef5608a103fa20_85A7G_User_Manual.pdf"],
        ],
        checks: [],
      },
    ],
    outro: "VIDAA menus differ between versions and countries. If yours didn’t match, tell us your VIDAA version and what you saw, so we can add it.",
  },
  {
    id: "firetv",
    name: "Fire TV",
    os: "Fire OS",
    intro: "Fire TV collects device and app usage data, and Fire TV smart TVs also collect aerial viewing data. CleanYourTV’s cleanup works on Fire TV too.",
    ask: {
      q: "Stick or TV?",
      help: "TVs with Fire TV built in have one extra setting.",
      choices: [
        { id: "stick", label: "Stick or box" },
        { id: "tv", label: "TV with Fire TV built in" },
      ],
    },
    list: "native.amazon",
    steps: [
      {
        id: "usage",
        title: "Turn off usage data and ads",
        does: "Stops sharing how you use the device and its apps, and ads stop being targeted at you.",
        variants: [{ label: "", crumbs: ["Settings", "Preferences", "Privacy Settings"] }],
        items: [
          { name: "Device Usage Data", to: "off" },
          { name: "Collect App Usage Data", to: "off" },
          { name: "Interest-based Ads", to: "off" },
        ],
        undo: "Turn each one back on in the same menu.",
        sources: [["Amazon help", "https://digprjsurvey.amazon.com/csad/help/node/GQFYXZHZB2H629WN"], NAI],
        checks: [],
      },
      {
        id: "ota",
        title: "Turn off aerial viewing data",
        does: "Stops sharing what you watch through the aerial.",
        tag: "Fire TV smart TVs",
        only: ["tv"],
        sameAs: "usage",
        items: [{ name: "Over-the-air Viewing Data", to: "off" }],
        note: "Only on TVs with Fire TV built in. On a stick, skip this.",
        undo: "Turn it back on.",
        sources: [["Amazon help", "https://digprjsurvey.amazon.com/csad/help/node/GQFYXZHZB2H629WN"]],
        checks: [],
      },
    ],
  },
  {
    id: "google",
    name: "Google TV",
    os: "Sony, TCL, Android TV",
    intro: "On Google TV the switches are about ads; Sony and TCL add their own. These TVs run Android TV or Google TV, so CleanYourTV works on them and goes further.",
    ask: {
      q: "Google TV or older Android TV?",
      help: "Google TV has a colourful “For you” home screen.",
      choices: [
        { id: "gtv", label: "Google TV" },
        { id: "atv", label: "Older Android TV" },
      ],
    },
    listNote: "There’s no list for these: CleanYourTV switches off the tracking apps themselves instead.",
    steps: [
      {
        id: "ads",
        title: "Delete the advertising ID",
        does: "Deletes the TV’s advertising ID.",
        variants: [
          { label: "Google TV", for: ["gtv"], crumbs: ["Settings", "Privacy", "Ads"] },
          { label: "Older Android TV", for: ["atv"], crumbs: ["Settings", "About", "Legal Information", "Ads"] },
        ],
        items: [{ name: "Delete advertising ID", to: "press" }],
        note: "Deleting is stronger than resetting. Or choose Opt out of Ads Personalization.",
        undo: "Turn personalised ads back on in the same menu.",
        sources: [NAI, ["Google: ads", "https://policies.google.com/technologies/ads?hl=en"]],
        checks: [],
      },
      {
        id: "sony",
        title: "Turn off Samba Interactive TV",
        does: "Stops Sony’s ACR recognising what’s on screen and reporting it.",
        tag: "Sony only",
        variants: [{ label: "Sony Bravia", crumbs: ["Settings", "All Settings", "Privacy"] }],
        items: [{ name: "Samba Interactive TV", to: "off" }],
        note: "That’s Sony’s ACR. Older sets keep it under System or Device Preferences. Not a Sony? Skip this.",
        undo: "Turn it back on.",
        sources: [CR],
        checks: [],
      },
      {
        id: "tcl",
        title: "Withdraw the optional agreements",
        does: "Says no to TCL’s optional data sharing.",
        tag: "TCL only",
        variants: [{ label: "TCL Google TV", crumbs: ["Settings", "Privacy", "User Agreements"] }],
        items: [{ name: "User Experience Improvement Program", to: "off" }],
        note: "Withdraw the optional agreements there too. Not a TCL? Skip this.",
        undo: "Accept them again.",
        sources: [CR],
        checks: [],
      },
    ],
    outro: "You can’t decline Google’s own terms and keep the smart features, so leave those.",
  },
];

export const brandById = (id: string) => BRANDS.find((b) => b.id === id);

/**
 * What the reader told step 2: an exact model year from the decoder ("2024"), one of the brand's answers ("2022-2024",
 * "tv", "u9"), "all" for "Not sure", or null before they answer. Both the hash (#samsung-2024) and the guide use it.
 */
export type Pick = string | null;

/** The year range a pick stands for, on brands that ask the year. */
function yearsOf(brand: Brand, pick: Pick): [number, number] | null {
  if (!pick || pick === "all") return null;
  if (/^\d{4}$/.test(pick)) return [Number(pick), Number(pick)];
  return brand.ask.choices.find((c) => c.id === pick)?.years || null;
}

/** The answer button a pick lights: its own, or the year group an exact year falls in. */
export function choiceOf(brand: Brand, pick: Pick): string | null {
  if (!pick) return null;
  if (pick === "all") return "all";
  const y = /^\d{4}$/.test(pick) ? Number(pick) : null;
  return brand.ask.choices.find((c) => c.id === pick || (y != null && c.years && y >= c.years[0] && y <= c.years[1]))?.id || null;
}

/** "2024 TV", "2022–2024", "Roku stick or box"; "" while unanswered or not sure. */
export function pickLabel(brand: Brand, pick: Pick): string {
  if (!pick || pick === "all") return "";
  if (/^\d{4}$/.test(pick)) return brand.years && Number(pick) === brand.years[brand.years.length - 1] ? `${pick} or older` : `${pick} TV`;
  return brand.ask.choices.find((c) => c.id === pick)?.label || "";
}

/** The steps for a pick: all of them, less the ones only for another kind of device (a Roku TV's ACR on a stick). */
export const stepsFor = (brand: Brand, pick: Pick) =>
  brand.steps.filter((s) => !s.only || !pick || pick === "all" || s.only.includes(pick));

/** The paths to show once step 2 is answered: the matching ones (plus those for everyone), or all of them when nothing matches. */
export function variantsFor(brand: Brand, step: Step, pick: Pick): { list: Variant[]; noMatch: boolean } {
  const own = step.sameAs ? brand.steps.find((s) => s.id === step.sameAs) : undefined;
  const all = (step.variants || own?.variants || []).map((v) => ({ ...v, items: step.sameAs ? step.items : v.items || step.items }));
  const yr = yearsOf(brand, pick);
  if (yr && all.some((v) => v.years)) {
    const hit = all.filter((v) => !v.years || (v.years[0] <= yr[1] && v.years[1] >= yr[0]));
    return hit.some((v) => v.years) ? { list: hit, noMatch: false } : { list: all, noMatch: true };
  }
  if (pick && pick !== "all" && !yr && all.some((v) => v.for)) {
    const hit = all.filter((v) => !v.for || v.for.includes(pick));
    return hit.length ? { list: hit, noMatch: false } : { list: all, noMatch: true };
  }
  return { list: all, noMatch: false };
}

// The network check: hosts from HaGeZi's native lists (its Light list and up for Hisense, Perflyst's for Vizio) that
// answered over HTTPS from an unfiltered network on 26 Oct 2026. Hosts that time out, fail TLS or don't resolve even
// unblocked are left out, since they'd read as "blocked" everywhere: acr0.samsungcloudsolution.com,
// scribe.logs.roku.com and monetization-ad-tracking.prod-eu-c.az.vidaahub.com (TLS), lgsmartad.com, logs.roku.com and
// tvinteractive.tv (time out), acr.roku.com and ad.lgappstv.com (no DNS record).
export const NET_CONTROL = ["https://www.cloudflare.com/cdn-cgi/trace", "https://www.wikipedia.org/"];
export const NET_HOSTS: { brand: string; list: string; hosts: string[] }[] = [
  { brand: "Samsung", list: "native.samsung", hosts: ["log-ingestion.samsungacr.com", "acr-us-prd.samsungcloud.tv", "samsungads.com"] },
  { brand: "LG", list: "native.lgwebos", hosts: ["us.info.lgsmartad.com", "lgads.tv", "alphonso.tv"] },
  { brand: "Roku", list: "native.roku", hosts: ["ads.roku.com", "ravm.tv", "cloudservices.roku.com"] },
  { brand: "Vizio", list: "Perflyst SmartTV", hosts: ["control.tvinteractive.tv", "control2.tvinteractive.tv"] },
  { brand: "Hisense VIDAA", list: "HaGeZi Light", hosts: ["ter-jrnl-na.vidaahub.com", "tracking-vss.vidaahub.com", "rsc-ads.vidaahub.com"] },
];

export type Verdict = "Block" | "Keep" | "Optional" | "Don’t block";

// Block-or-keep per brand: HaGeZi's native lists, Perflyst's SmartTV.txt comments and the IMC 2024 paper.
export const DOMAINS: { brand: string; rows: [domains: string, what: string, verdict: Verdict, note: string][]; after?: string }[] = [
  {
    brand: "Samsung",
    rows: [
      ["acr-us-prd.samsungcloud.tv, acr-eu-prd.samsungcloud.tv", "ACR fingerprints", "Block", "The most traffic during live TV and HDMI."],
      ["samsungacr.com", "ACR logging and config", "Block", "Covers log-ingestion and log-config."],
      ["acr0.samsungcloudsolution.com", "ACR keep-alive", "Block", "HaGeZi blocks it; Perflyst leaves it open."],
      ["samsungads.com, samsungtvads.com", "Samsung Ads", "Block", ""],
      ["lcprd1.samsungcloudsolution.net", "Logging", "Optional", "One user had to allow it again when app downloads failed; another saw no problem."],
      ["samsungcloudsolution.com", "The whole domain: many services", "Don’t block", "Blocking it all breaks the TV’s internet connection."],
      ["time.samsungcloudsolution.com", "Clock", "Keep", "Without it Plex, YouTube and Prime Video stop working."],
      ["otnprd8–11.samsungcloudsolution.net, samsungotn.net", "Firmware updates", "Keep", "Security updates come through here."],
      ["osb-ussvc.samsungqbe.com", "Samsung TV Plus", "Keep", "If you watch TV Plus."],
      ["auth.samsungosp.com", "Samsung account", "Keep", "Sign-in fails without it."],
    ],
  },
  {
    brand: "LG",
    rows: [
      ["lgsmartad.com, lgads.tv, ad.lgappstv.com", "LG ads", "Block", ""],
      ["alphonso.tv", "ACR (LG Ad Solutions)", "Block", "The IMC 2024 study saw LG’s ACR traffic go here."],
      ["us.lgtvsdp.com", "Clock and services", "Keep", "If it is blocked, the clock resets to 2019 after a reboot and Plex, HBO Max and YouTube fail."],
      ["lgtvsdp.com, lgappstv.com", "Content Store", "Keep", "Only ad.lgappstv.com goes."],
      ["ngfts.lge.com", "Store pictures, AI features", "Keep", ""],
      ["snu.lge.com, su.lge.com, nsu.lge.com", "Software updates", "Keep", ""],
    ],
  },
  {
    brand: "Roku",
    rows: [
      ["logs.roku.com and its subdomains", "Logging", "Block", "One Pi-hole user’s live TV guide went blank; allow it again if yours does."],
      ["ads.roku.com, ravm.tv", "Roku ads", "Block", ""],
      ["acr.roku.com, cloudservices.roku.com", "ACR and cloud services", "Block", "Both are in HaGeZi’s Roku list."],
    ],
    after: "Don’t block everything with “roku” in it: a broad rule like that broke one user’s Roku completely.",
  },
  {
    brand: "Vizio",
    rows: [
      ["tvinteractive.tv", "Inscape ACR", "Block", "control, control2, mcp and tvmeta-dynamic."],
      ["alphonso.tv", "ACR", "Block", ""],
      ["api.vizio.com, images.vizio.com", "Smart features", "Keep", "Perflyst: required for the smart TV features."],
    ],
    after: "HaGeZi has no Vizio list, so add these by hand.",
  },
  {
    brand: "Hisense VIDAA",
    rows: [
      ["ter-jrnl-*.vidaahub.com, exc-jrnl-*.vidaahub.com, policy-jrnl-*.vidaahub.com", "Telemetry journals, one per region", "Block", "The person who asked HaGeZi to add them saw nothing break after days of blocking."],
      ["tracking-vss.vidaahub.com, abtest-tv.vidaahub.com", "Tracking and A/B tests", "Block", ""],
      ["recommend-ui-*.vidaahub.com", "Home-screen recommendations", "Block", ""],
      ["rsc-ads.vidaahub.com, rpt-mntz-azure.vidaahub.com", "Ads", "Block", ""],
      ["ads-privacy.vidaahub.com, rsc-mntz.vidaahub.com", "The TV’s Ads Privacy app", "Keep", "Blocked, the Ads Privacy app that sets your ad choices won’t open."],
      ["api.us.hismarttv.com, api.euro.hismarttv.com, api.eu.hismarttv.com", "Possibly software updates", "Keep", "Perflyst’s list blocks them but notes they may be needed for updates, and HaGeZi blocks api.eu. If you block them, check updates still work."],
      ["auth-*, api-gps-*, api-launcher-*, msg-*.hismarttv.com", "Sign-in, location, launcher, messages", "Optional", "Both lists block these, and we found no report of what breaks. If sign-in or the home screen misbehaves, allow them first."],
    ],
    after: "HaGeZi has no native VIDAA list, but its Light, Multi and Pro lists include these. Block host by host, not all of vidaahub.com or hismarttv.com: updates and the Ads Privacy app live there too.",
  },
];

export const UNDO: [string, string, string][] = [
  ["ACR off", "Less personal “recommended for you” rows; Roku drops More Ways to Watch", "Tick the same setting again"],
  ["Ad tracking off, ad ID reset or deleted", "Nothing; ads stay, just untargeted", "Turn it back on"],
  ["Voice wake word or mic switch off", "No voice search or assistant", "Switch it back on"],
  ["Optional agreements declined", "Small extras, like LG’s AI recommendations", "Accept them again in User Agreements or Privacy Choices"],
  ["Guest network", "Casting from a phone on your main Wi-Fi", "Move the TV back to your main Wi-Fi"],
  ["DNS blocklist", "Usually nothing; too broad a list can break the app store, guide data or the clock", "Allow the blocked name from the query log, or turn the list off"],
];
