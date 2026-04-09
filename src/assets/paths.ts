/**
 * Public assets under `public/assets/`. Filenames with spaces are URL-encoded per segment.
 * Replace files on disk; update paths here only when names change.
 */
function assetUrl(relativePath: string): string {
  const root = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const segments = relativePath
    .split("/")
    .filter(Boolean)
    .map((s) => encodeURIComponent(s));
  return `${root}assets/${segments.join("/")}`;
}

function icon(filename: string): string {
  return assetUrl(`icons/${filename}`);
}

export const assets = {
  navLogoLockup: assetUrl("logos/Squarespace-logo-black.svg"),
  navBug: assetUrl("logos/Squarespace-bug-black.svg"),
  chevron: icon("Chevron Small Down.svg"),
  chevronAlt: icon("Chevron Small Down.svg"),
  promoInfo: icon("Info Circle.svg"),
  includeMessage: icon("Message.svg"),
  includeAi: icon("AI.svg"),
  includeGlobal: icon("Global.svg"),
  includeInfo: icon("Info Circle.svg"),
  includePerf: icon("Performance.svg"),
  includeStore: icon("Store.svg"),
  checkBasic: icon("Checkmark.svg"),
  iconWebsite: icon("Website.svg"),
  iconSearch: icon("Search.svg"),
  iconBank: icon("Dollar Sign.svg"),
  iconClipboard: icon("Clipboard.svg"),
  iconBag: icon("Shopping Bag.svg"),
  checkCore: icon("Checkmark.svg"),
  iconImage: icon("Image.svg"),
  iconPerson: icon("Person.svg"),
  iconChart: icon("Line Chart.svg"),
  iconMail: icon("Mail.svg"),
  checkPlus: icon("Checkmark.svg"),
  iconBankPlus: icon("Invoice.svg"),
  iconImagePlus: icon("Image Block Stack.svg"),
  iconVideo: icon("Video.svg"),
  checkAdvanced: icon("Checkmark.svg"),
  coreDot: icon("misc/core-dot.svg"),
  salesCheck: icon("Checkmark.svg"),
  footerLogo: assetUrl("logos/Squarespace-logo-white.svg"),
  footerGlobe: icon("Global.svg"),
  footerChevronDown: icon("Chevron Small Down.svg"),
  footerChevronUp: icon("Chevron Small Up.svg"),
} as const;
