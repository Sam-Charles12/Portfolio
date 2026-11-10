"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { gsapSetup, prefersReducedMotion, blurFadeIn } from "@/lib/gsap";

/**
 * Story chapters. Headlines scrub-fill as they travel through the
 * viewport (same language as the homepage About); copy fades in once.
 *
 * NOTE: chapter copy is DRAFT — written from public portfolio facts
 * (stack, production work, NIGERCON paper). Correct the details.
 */
const CHAPTERS = [
  {
    title: "beginnings",
    body: [
      "i started the way a lot of developers start — by wondering how the things on my screen actually worked. the first scripts were small and mostly broken, but each one answered a question, and the questions kept getting better.",
      "somewhere along the way, curiosity turned into a craft. i stopped just making things run and started caring about how they were built.",
    ],
  },
  {
    title: "now",
    body: [
      "these days i build full-stack applications end to end — react and next.js up front, supabase and node behind it, shipped to production instead of living in a demo folder.",
      "i co-authored a network-optimization paper presented at ieee nigercon 2026, and i've learned that the unglamorous work — validation, error states, audit trails — is usually the work that matters.",
    ],
  },
  {
    title: "next",
    body: [
      "the goal is simple: keep taking on harder problems until the easy ones look different. internships first, then junior roles, and systems work that holds up at scale.",
      "if it's worth building, it's worth building properly.",
    ],
  },
] as const;

export default function AboutStory() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();

    const ctx = gsap.context(() => {
      blurFadeIn(Array.from(root.querySelectorAll(".story-fade")), {
        duration: 1,
        stagger: 0.1,
        y: 24,
        reversible: false,
      });

      // Chapter headlines resolve from dim to full ink as each row
      // travels through the viewport — scrubbed, so it tracks scroll.
      root.querySelectorAll(".story-headline").forEach((headline) => {
        gsap.fromTo(
          headline.querySelectorAll(".story-word"),
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.25,
            scrollTrigger: {
              trigger: headline,
              start: "top 80%",
              end: "bottom 45%",
              scrub: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="My story"
      className="container-shell py-8 md:py-12"
    >
      {CHAPTERS.map((chapter) => (
        <div
          key={chapter.title}
          className="grid grid-cols-1 gap-6 border-t py-12 md:py-16 lg:grid-cols-2 lg:gap-16"
          style={{ borderColor: "var(--border-15)" }}
        >
          <h2
            className="story-headline font-bold lowercase"
            style={{
              fontSize: "clamp(2.25rem, 1.8rem + 3vw, 3.75rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "var(--text-100)",
            }}
          >
            {chapter.title.split(" ").map((word, i) => (
              <span key={i} className="story-word">
                {word}
                {i < chapter.title.split(" ").length - 1 ? " " : ""}
              </span>
            ))}
          </h2>

          <div className="lg:pt-2">
            {chapter.body.map((paragraph, i) => (
              <p
                key={i}
                className="story-fade max-w-xl"
                style={{
                  color: "var(--text-70)",
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                  marginTop: i === 0 ? 0 : 20,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
