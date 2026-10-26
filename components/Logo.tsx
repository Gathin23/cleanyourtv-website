/** The mark: a TV with its antenna, in mint. */
export function Mark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M11 3.5l5 6 5-6" stroke="#CFFFCF" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="10" width="26" height="18" rx="5" fill="#CFFFCF" />
      <rect x="7" y="14" width="18" height="10" rx="2.5" fill="#050505" />
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
