/*
 * JS mirror of tokens.css for GSAP / IntersectionObserver.
 * Keep numeric values in sync with src/app/tokens.css.
 * Colors stay as CSS vars (two-color rule) — JS only carries motion/layout.
 * Motion itself lives in src/lib/gsap.ts (GSAP is the only animation lib).
 */

export const colors = {
  bg: "var(--bg)",
  ink: "var(--ink)",
  text100: "var(--text-100)",
  text70: "var(--text-70)",
  text50: "var(--text-50)",
  border20: "var(--border-20)",
  border25: "var(--border-25)",
} as const;

export const motionTokens = {
  riseDistance: 24,
  durRise: 0.5, // 500ms
  durHover: 0.2,
  durFade: 0.3,
  lift: 3,
  marqueeSecs: 32,
  marqueeSlowSecs: 48,
} as const;

export const layout = {
  container: 1280,
  containerNarrow: 672,
  navH: 80,
  gridSize: 48,
  radiusCard: 40,
  radiusPill: 999,
} as const;

export const type = {
  hero: "clamp(1.5rem, 1rem + 2.5vw, 3rem)",
  section: "clamp(3.75rem, 3.4rem + 1.75vw, 4.5rem)",
  cta: "clamp(2.25rem, 1.75rem + 2.5vw, 3.75rem)",
  marquee: "clamp(5rem, 4rem + 8vw, 13rem)",
  stat: "clamp(2.25rem, 1.9rem + 1.75vw, 3.75rem)",
} as const;
