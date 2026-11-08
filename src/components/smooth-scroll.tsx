"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { getScrollTrigger } from "@/lib/gsap";

/**
 * Lenis smooth scrolling — site-wide, wired into GSAP's ticker so
 * ScrollTrigger stays in sync. Skipped under prefers-reduced-motion.
 * Same-page anchors (#work, /#work on "/") route through lenis.scrollTo.
 * Cross-page "/#…" links are left to the browser so /blog can escape home.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ScrollTrigger = getScrollTrigger();

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Landing directly on "/#about" (e.g. from /blog) — wait a tick for
    // layout, then glide to the section instead of a hard jump.
    if (
      window.location.pathname === "/" &&
      window.location.hash.length > 1
    ) {
      const initialHash = window.location.hash;
      window.setTimeout(() => {
        const initialTarget = document.querySelector(initialHash);
        if (initialTarget) {
          lenis.scrollTo(initialTarget as HTMLElement, {
            offset: initialHash === "#top" ? 0 : -24,
            immediate: true,
          });
        }
      }, 50);
    }

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.(
        'a[href^="#"], a[href^="/#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#" || href === "/#") return;
      // "/#about" only smooth-scrolls on "/"; elsewhere let the browser
      // navigate home first, otherwise /blog would be trapped.
      if (href.startsWith("/#")) {
        if (window.location.pathname !== "/") return;
        const id = href.slice(1);
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, {
          offset: id === "#top" ? 0 : -24,
        });
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      // "#top" is the page root — no offset, otherwise we'd stop short.
      lenis.scrollTo(target as HTMLElement, {
        offset: href === "#top" ? 0 : -24,
      });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
