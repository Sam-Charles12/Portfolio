"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { gsapSetup, prefersReducedMotion, blurFadeIn } from "@/lib/gsap";

const PRINCIPLES = ["clarity", "ownership", "follow-through"] as const;

/**
 * Principles strip — heading plus a mono keyword list.
 * Original copy; the structure nods to classic about pages.
 */
export default function AboutPrinciples() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();
    const ctx = gsap.context(() => {
      blurFadeIn(Array.from(root.querySelectorAll(".principles-fade")), {
        duration: 1,
        stagger: 0.1,
        y: 24,
        reversible: false,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="How I work"
      className="container-shell py-16 md:py-24"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <h2
          className="principles-fade font-bold lowercase"
          style={{
            fontSize: "var(--text-section)",
            lineHeight: "var(--leading-section)",
            letterSpacing: "var(--tracking-section)",
            color: "var(--text-100)",
          }}
        >
          how i<br />
          work
        </h2>

        <div className="lg:pt-2">
          <p
            className="principles-fade"
            style={{
              color: "var(--text-70)",
              fontSize: "var(--text-body)",
              lineHeight: "var(--leading-body)",
            }}
          >
            three things i optimize for on every project, no matter the
            stack.
          </p>
          <ul className="principles-fade mt-6 flex flex-col gap-3">
            {PRINCIPLES.map((principle) => (
              <li
                key={principle}
                className="mono-label"
                style={{ fontSize: 14 }}
              >
                {principle}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
