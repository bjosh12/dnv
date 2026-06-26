// SVG recreation of the Lakbyte gradient wordmark — always uses original brand colors
function LakbyteLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Lakbyte"
    >
      <defs>
        <linearGradient id="lakbyte-brand" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E3C1E" />
          <stop offset="40%" stopColor="#4A5A20" />
          <stop offset="100%" stopColor="#B8900A" />
        </linearGradient>
      </defs>
      <text
        x="0"
        y="38"
        fontFamily="Impact, Arial Black, sans-serif"
        fontWeight="900"
        fontSize="42"
        letterSpacing="-1"
        fill="url(#lakbyte-brand)"
      >
        LAKBYTE
      </text>
    </svg>
  );
}

// Compact inline badge — "Official Lakbyte Ambassador"
// variant="dark" → white frosted pill so original dark-green logo stays readable
// variant="light" → white pill on light backgrounds
export function LakbyteAmbassadorBadge({
  variant = "light",
  href,
}: {
  variant?: "light" | "dark";
  href?: string;
}) {
  const wrapper =
    variant === "dark"
      ? "inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm"
      : "inline-flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm";

  const content = (
    <span className={wrapper}>
      <LakbyteLogo className="h-5 w-auto" />
      <span className="text-xs font-semibold text-gray-600 leading-none">
        Official Ambassador
      </span>
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block hover:opacity-80 transition-opacity"
      >
        {content}
      </a>
    );
  }

  return <span className="inline-block">{content}</span>;
}

// Standalone feature card — used on About and Book pages
export function LakbyteFeatureCard() {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="shrink-0">
        <LakbyteLogo className="h-7 w-auto" />
      </div>
      <div>
        <p className="text-xs font-bold text-[#0F1F3D] uppercase tracking-wide mb-1">
          Official Lakbyte Ambassador
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">
          We are an accredited Lakbyte Ambassador — a trusted designation within
          the Lakbyte network for verified digital nomad visa specialists.
          Consultations are booked and managed through the Lakbyte platform.
        </p>
      </div>
    </div>
  );
}

export default LakbyteLogo;
