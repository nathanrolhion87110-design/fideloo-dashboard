"use client";

interface Props {
  variant?: "default" | "onDark" | "green";
  size?: number;
  markOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function FideloLogoStamp({
  variant = "default",
  size = 40,
  markOnly = false,
  className,
  style,
}: Props) {
  let bg: string, fg: string, txt: string;
  if (variant === "onDark") { bg = "#1F8A5B"; fg = "#F4F1EA"; txt = "#F4F1EA"; }
  else if (variant === "green") { bg = "#1F8A5B"; fg = "#F4F1EA"; txt = "#0F1411"; }
  else { bg = "#0F1411"; fg = "#1F8A5B"; txt = "#0F1411"; }

  if (markOnly) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
        height={size} width={size} className={className} style={style}
        aria-label="Fideloo" role="img">
        <circle cx="50" cy="50" r="48" fill={bg} />
        <circle cx="50" cy="50" r="42" fill="none" stroke={fg} strokeWidth="1.5" opacity="0.4" />
        <rect x="32" y="28" width="10" height="44" rx="1.5" fill={fg} />
        <rect x="32" y="28" width="36" height="10" rx="1.5" fill={fg} />
        <rect x="32" y="46" width="26" height="9"  rx="1.5" fill={fg} />
        <circle cx="62" cy="65" r="3" fill={fg} />
        <circle cx="71" cy="65" r="3" fill={fg} />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 120"
      height={size} width={size * (500 / 120)} className={className} style={style}
      aria-label="Fideloo" role="img">
      <g transform="translate(0, 10)">
        <circle cx="50" cy="50" r="48" fill={bg} />
        <circle cx="50" cy="50" r="42" fill="none" stroke={fg} strokeWidth="1.5" opacity="0.4" />
        <rect x="32" y="28" width="10" height="44" rx="1.5" fill={fg} />
        <rect x="32" y="28" width="36" height="10" rx="1.5" fill={fg} />
        <rect x="32" y="46" width="26" height="9"  rx="1.5" fill={fg} />
        <circle cx="62" cy="65" r="3" fill={fg} />
        <circle cx="71" cy="65" r="3" fill={fg} />
      </g>
      <text x="120" y="84"
        fontFamily="Sora, system-ui, sans-serif"
        fontWeight="600" fontSize="84" letterSpacing="-2"
        fill={txt}>Fideloo</text>
    </svg>
  );
}
