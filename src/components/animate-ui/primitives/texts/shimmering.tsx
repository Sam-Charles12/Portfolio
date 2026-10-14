"use client";

import * as React from "react";

interface ShimmeringTextProps {
  text: string;
  wave?: boolean;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ShimmeringText({
  text,
  wave = false,
  duration = 2.2,
  className,
  style,
}: ShimmeringTextProps) {
  if (wave) {
    return (
      <span
        className={className}
        style={{ display: "inline-block", ...style }}
        aria-label={text}
      >
        <style>{`@keyframes shimmer-wave {
  0%, 100% { opacity: 0.45; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-0.08em); }
}
@media (prefers-reduced-motion: reduce) {
  .shimmer-wave-char { animation: none !important; opacity: 1 !important; transform: none !important; }
}`}</style>
        {text.split("").map((char, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="shimmer-wave-char"
            style={{
              display: char === " " ? "inline" : "inline-block",
              color: "var(--text-50)",
              animation: `shimmer-wave ${duration}s ease-in-out infinite`,
              animationDelay: `${(i * duration) / Math.max(text.length, 1)}s`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{ display: "inline-block", ...style }}
      aria-label={text}
    >
      <style>{`@keyframes shimmer-sweep {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}
@media (prefers-reduced-motion: reduce) {
  .shimmer-sweep-text { animation: none !important; color: var(--text-50) !important; background: none !important; }
}`}</style>
      <span
        aria-hidden="true"
        className="shimmer-sweep-text"
        style={{
          display: "inline-block",
          color: "transparent",
          backgroundImage:
            "linear-gradient(110deg, var(--text-50) 35%, var(--text-100) 50%, var(--text-50) 65%)",
          backgroundSize: "200% 100%",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          animation: `shimmer-sweep ${duration}s linear infinite`,
        }}
      >
        {text}
      </span>
    </span>
  );
}
