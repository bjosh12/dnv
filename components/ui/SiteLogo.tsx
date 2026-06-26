// SVG recreation of the digitalnomad**inspain** wordmark with sunset icon
// textColor: the "digitalnomad" portion — white on dark bg, navy on light
export default function SiteLogo({
  textColor = "#1B3A6B",
  className = "",
}: {
  textColor?: string;
  className?: string;
}) {
  const coral = "#FF6B35";

  return (
    <svg
      viewBox="0 0 370 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Digital Nomad In Spain"
      role="img"
    >
      {/* ── Sunset icon ───────────────────────────────────────── */}
      {/* Horizon line */}
      <line x1="1" y1="36" x2="37" y2="36" stroke={coral} strokeWidth="2.5" strokeLinecap="round" />
      {/* Sun half-circle */}
      <path d="M7 36 A13 13 0 0 1 33 36" fill={coral} />
      {/* Rays emanating from sun center (x=20, y=36) */}
      {/* Top center */}
      <line x1="20" y1="36" x2="20" y2="10" stroke={coral} strokeWidth="2.2" strokeLinecap="round" />
      {/* Upper left */}
      <line x1="20" y1="36" x2="5" y2="18" stroke={coral} strokeWidth="2.2" strokeLinecap="round" />
      {/* Upper right */}
      <line x1="20" y1="36" x2="35" y2="18" stroke={coral} strokeWidth="2.2" strokeLinecap="round" />
      {/* Mid left */}
      <line x1="20" y1="36" x2="1" y2="27" stroke={coral} strokeWidth="2.2" strokeLinecap="round" />
      {/* Mid right */}
      <line x1="20" y1="36" x2="39" y2="27" stroke={coral} strokeWidth="2.2" strokeLinecap="round" />

      {/* ── Wordmark ───────────────────────────────────────────── */}
      <text
        x="46"
        y="34"
        fontFamily="'Arial Black', Impact, 'Helvetica Neue', sans-serif"
        fontWeight="900"
        fontSize="26"
        letterSpacing="-0.5"
      >
        <tspan fill={textColor}>digitalnomad</tspan>
        <tspan fill={coral}>inspain</tspan>
      </text>
    </svg>
  );
}
