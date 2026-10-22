/**
 * Decorative browser-window artwork for the closing CTA panel.
 * Drawn in currentColor so it inverts with the panel; the wrapper sets
 * the overall opacity. Purely visual — hidden from assistive tech.
 */
export default function CodeWindowArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 640"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Window frame + title bar */}
      <rect
        x="32"
        y="24"
        width="836"
        height="592"
        rx="28"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.5"
      />
      <line
        x1="32"
        y1="104"
        x2="868"
        y2="104"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.4"
      />
      <circle cx="80" cy="64" r="9" fill="currentColor" opacity="0.65" />
      <circle cx="114" cy="64" r="9" fill="currentColor" opacity="0.65" />
      <circle cx="148" cy="64" r="9" fill="currentColor" opacity="0.65" />

      {/* Faint code lines */}
      <rect
        x="86"
        y="162"
        width="252"
        height="10"
        rx="5"
        fill="currentColor"
        opacity="0.3"
      />
      <rect
        x="86"
        y="198"
        width="168"
        height="10"
        rx="5"
        fill="currentColor"
        opacity="0.24"
      />
      <rect
        x="86"
        y="234"
        width="304"
        height="10"
        rx="5"
        fill="currentColor"
        opacity="0.18"
      />

      {/* </> glyph */}
      <polyline
        points="360,270 270,380 360,490"
        stroke="currentColor"
        strokeWidth="26"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <line
        x1="468"
        y1="500"
        x2="562"
        y2="260"
        stroke="currentColor"
        strokeWidth="26"
        strokeLinecap="round"
        opacity="0.55"
      />
      <polyline
        points="680,270 770,380 680,490"
        stroke="currentColor"
        strokeWidth="26"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />

      {/* Scattered details */}
      <circle cx="700" cy="190" r="6" fill="currentColor" opacity="0.45" />
      <circle cx="300" cy="548" r="8" fill="currentColor" opacity="0.35" />
      <rect
        x="744"
        y="548"
        width="80"
        height="10"
        rx="5"
        fill="currentColor"
        opacity="0.2"
      />
    </svg>
  );
}
