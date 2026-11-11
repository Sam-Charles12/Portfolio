import type { CSSProperties } from "react";
import { LOGO_MARK_D, LOGO_MARK_VIEWBOX } from "./logo-art";

type LogoProps = {
  /** Rendered square size in px. */
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Accessible name — omit for decorative use (then hidden from AT). */
  label?: string;
};

/**
 * Project logo — bare mark, no tile. Token-driven, so it follows the
 * manual theme toggle as well as the OS scheme.
 */
export default function Logo({ size = 32, className, style, label }: LogoProps) {
  return (
    <svg
      viewBox={LOGO_MARK_VIEWBOX}
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
    >
      {label ? <title>{label}</title> : null}
      <path
        d={LOGO_MARK_D}
        fill="var(--ink)"
        fillRule="evenodd"
        stroke="var(--ink)"
        strokeWidth={0.25}
        strokeLinejoin="round"
      />
    </svg>
  );
}
