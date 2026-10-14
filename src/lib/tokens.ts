/*
 * JS mirror of tokens.css for Framer Motion / GSAP / IntersectionObserver.
 * Keep numeric values in sync with src/app/tokens.css.
 * Colors stay as CSS vars (two-color rule) — JS only carries motion/layout.
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

export const motion = {
  riseDistance: 24,
  durRise: 0.5, // 500ms
  durHover: 0.2,
  durFade: 0.3,
  easeOut: [0.22, 1, 0.36, 1] as const, // --ease-out
  easeInOut: [0.65, 0, 0.35, 1] as const,
  lift: 3,
  marqueeSecs: 32,
  marqueeSlowSecs: 48,
} as const;

/** Framer Motion preset: fade-and-rise on scroll (24px, 500ms, ease-out). */
export const fadeRise = {
  initial: { opacity: 0, y: motion.riseDistance },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: motion.durRise, ease: motion.easeOut },
} as const;

/** Card hover: lift 3px, border to 100% ink. */
export const cardHover = {
  whileHover: { y: -motion.lift },
  transition: { duration: motion.durHover, ease: motion.easeOut },
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
