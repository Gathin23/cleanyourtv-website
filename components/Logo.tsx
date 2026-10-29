import { HALLOWEEN } from "@/lib/halloween";

/** The mark: app/icon.svg, the TV with rabbit ears and a glowing mint screen (the favicon too). `id` names its gradient, unique per copy on a page. */
export function Mark({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0b0b0c" />
      <path d="M26 20 L19 9 M38 20 L45 9" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="19" cy="9" r="2.6" fill="#ffffff" />
      <circle cx="45" cy="9" r="2.6" fill="#ffffff" />
      <rect x="10" y="20" width="44" height="32" rx="8" fill="#ffffff" />
      <rect x="15" y="25" width="34" height="22" rx="4" fill={HALLOWEEN ? "#ff9a3c" : "#cfffcf"} />
      {HALLOWEEN ? (
        // Halloween: the screen is a jack-o'-lantern's face.
        <>
          <polygon points="20,36 28,36 24,30" fill="#2b1100" />
          <polygon points="36,36 44,36 40,30" fill="#2b1100" />
          <path d="M21 40 L25 43 L29 40 L32 43 L35 40 L39 43 L43 40" stroke="#2b1100" strokeWidth="2" strokeLinejoin="round" fill="none" />
        </>
      ) : (
        <rect x="15" y="25" width="34" height="22" rx="4" fill={`url(#${id})`} />
      )}
      <rect x="20" y="53" width="7" height="4" rx="2" fill="#ffffff" />
      <rect x="37" y="53" width="7" height="4" rx="2" fill="#ffffff" />
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity=".35" />
          <stop offset=".45" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** "CleanYourTV" in Fredoka, the TV in mint. */
export function Wordmark() {
  return (
    <span className="logo-word">
      CleanYour<span>TV</span>
    </span>
  );
}
