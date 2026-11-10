"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { gsapSetup, prefersReducedMotion, blurFadeIn } from "@/lib/gsap";

/**
 * About hero — back link, one-word statement, philosophy paragraph.
 * All copy is original, written for this portfolio.
 */
export default function AboutHero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();
    const ctx = gsap.context(() => {
      blurFadeIn(Array.from(root.querySelectorAll(".about-hero-fade")), {
        duration: 1.1,
        stagger: 0.12,
        y: 24,
        reversible: false,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="about-page-title"
      className="container-shell pb-16 pt-8 md:pb-24 md:pt-14"
    >
      <Link
        href="/"
        className="about-hero-fade mono-label inline-flex items-center gap-2 rounded-md outline-hidden transition-colors duration-200 hover:text-[var(--text-100)] focus-visible:ring-2"
      >
        <span aria-hidden="true">←</span> home
      </Link>

      <h1
        id="about-page-title"
        className="about-hero-fade mt-10 font-bold lowercase"
        style={{
          fontSize: "clamp(3.5rem, 2.5rem + 8vw, 8rem)",
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          color: "var(--text-100)",
        }}
      >
        engineer
      </h1>

      <p
        className="about-hero-fade mt-8 max-w-3xl"
        style={{
          color: "var(--text-70)",
          fontSize: "clamp(1.05rem, 0.95rem + 0.6vw, 1.35rem)",
          lineHeight: 1.7,
        }}
      >
        good software gets out of the way. it handles the edge cases,
        survives real users, and stays easy to change. i care about the
        parts nobody sees — the schema, the error paths, the quiet
        trade-offs — because that&apos;s what makes the surface feel
        effortless.
      </p>
    </section>
  );
}
