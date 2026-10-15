"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons";
import { CV_URL } from "@/lib/site";
import { gsapSetup, prefersReducedMotion, blurFadeIn } from "@/lib/gsap";
import { TextReveal } from "@/components/ui/cascade-text";

export default function About() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();

    const ctx = gsap.context(() => {
      // Standard entrance for the copy + buttons.
      blurFadeIn(".about-fade", { duration: 1.2, stagger: 0.15 });

      // Scroll-scrubbed headline fill — words resolve from dim to
      // full ink as the section travels through the viewport.
      gsap.fromTo(
        ".about-word",
        { opacity: 0.18 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.25,
          scrollTrigger: {
            trigger: ".about-headline",
            start: "top 80%",
            end: "bottom 45%",
            scrub: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="about"
      aria-label="About me"
      className="w-full"
    >
      <div className="container-shell grid grid-cols-1 gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
        <h2
          className="about-headline font-display font-bold lowercase"
          style={{
            fontSize: "clamp(2.75rem, 2rem + 4vw, 5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "var(--text-100)",
          }}
        >
          <span className="about-word">building</span>{" "}
          <span className="about-word">with</span>
          <br />
          <span className="about-word">purpose</span>
        </h2>

        <div className="lg:pt-2">
          <p
            className="about-fade max-w-xl"
            style={{
              color: "var(--text-70)",
              fontSize: "var(--text-body)",
              lineHeight: "var(--leading-body)",
            }}
          >
            I architect full-stack systems from the database layer to
            interactive interfaces, prioritizing scalability, thoughtful
            design, and maintainable code across every component.
          </p>

          <div className="about-fade mt-8 flex flex-wrap gap-3">
            <a
              href={CV_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center font-medium transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
              style={{
                height: 52,
                paddingInline: 28,
                gap: 10,
                background: "var(--fill)",
                color: "var(--on-fill)",
                borderRadius: "var(--radius-pill)",
                fontSize: 16,
              }}
            >
              Download CV
              <HugeiconsIcon
                icon={Download01Icon}
                size={18}
                strokeWidth={2}
              />
            </a>
            <a
              href="#"
              aria-label="More about me (link coming soon)"
              className="inline-flex items-center font-medium transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
              style={{
                height: 52,
                paddingInline: 28,
                gap: 10,
                background: "transparent",
                color: "var(--ink)",
                border: "2px solid var(--ink)",
                borderRadius: "var(--radius-pill)",
                fontSize: 16,
              }}
            >
              <TextReveal
                as="span"
                text="More about me"
                fontSize="16px"
                color="var(--ink)"
                hoverColor="var(--ink)"
                style={{ padding: 0 }}
              />
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={18}
                strokeWidth={2}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
