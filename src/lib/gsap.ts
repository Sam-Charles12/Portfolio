"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Register GSAP plugins once (client-only). */
export function gsapSetup() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function getScrollTrigger() {
  gsapSetup();
  return ScrollTrigger;
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * The site's single entrance language: fade up through blur. Smoothed
 * with a soft power3 ease and a gentle rise. Scroll-triggered by
 * default; pass `trigger: null` to play immediately (page-load
 * entrances). `reversible` controls whether it plays back out on leave
 * (one-shot sections pass false).
 */
export function blurFadeIn(
  targets: gsap.TweenTarget,
  opts?: {
    trigger?: Element | null;
    blur?: number;
    y?: number;
    duration?: number;
    delay?: number;
    stagger?: number;
    start?: string;
    reversible?: boolean;
  },
) {
  const {
    trigger,
    blur = 10,
    y = 20,
    duration = 1.4,
    delay = 0,
    stagger = 0,
    start = "top bottom-=80px",
    reversible = true,
  } = opts ?? {};

  const first = Array.isArray(targets) ? targets[0] : targets;
  const triggerEl =
    trigger === undefined && first instanceof Element ? first : trigger;

  return gsap.fromTo(
    targets,
    { opacity: 0, y, filter: `blur(${blur}px)` },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration,
      delay,
      stagger,
      ease: "power3.out",
      // Drop the transform/filter layers after one-shot plays; reversible
      // tweens need their start values kept for the reverse leg.
      clearProps: reversible ? undefined : "filter,opacity,transform",
      scrollTrigger: triggerEl
        ? {
            trigger: triggerEl,
            start,
            toggleActions: reversible
              ? "play reverse play reverse"
              : "play none none none",
          }
        : undefined,
    },
  );
}

/** Gentle scroll-linked parallax (scrubbed) for images inside cards. */
export function parallaxY(
  el: Element,
  trigger: Element,
  fromPercent = -5,
  toPercent = 5,
) {
  return gsap.fromTo(
    el,
    { yPercent: fromPercent },
    {
      yPercent: toPercent,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    },
  );
}
