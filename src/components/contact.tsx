"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CONTACT_HREF } from "@/lib/site";
import {
  gsapSetup,
  prefersReducedMotion,
  blurFadeIn,
  parallaxY,
} from "@/lib/gsap";
import { ArrowLink } from "@/components/ui/arrow-link";
import CodeWindowArt from "@/components/code-window-art";

/**
 * Closing call to action. The panel is inverted against the page —
 * `background: var(--ink)` + `color: var(--bg)` — so it reads light on
 * the dark theme and dark on the light theme without extra tokens.
 */
export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const art = artRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();

    const ctx = gsap.context(() => {
      blurFadeIn(".contact-fade", { duration: 1.3, stagger: 0.12 });
      if (art) parallaxY(art, root, 5, -5);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="contact" aria-label="Contact" className="w-full">
      <div
        className="container-shell"
        style={{
          paddingTop: "clamp(8px, 2vw, 32px)",
          paddingBottom: "clamp(48px, 6vw, 96px)",
        }}
      >
        <div
          className="relative flex items-center overflow-hidden"
          style={{
            borderRadius: "var(--radius-card)",
            background: "var(--ink)",
            color: "var(--bg)",
            minHeight: "clamp(560px, 85dvh, 980px)",
          }}
        >
          {/* Soft sheen from the top of the panel. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 20%, color-mix(in srgb, var(--bg) 7%, transparent), transparent 60%)",
            }}
          />

          {/* Decorative browser window, clipped by the panel edge. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-4%] top-1/2 hidden w-[56%] -translate-y-1/2 md:block"
          >
            <div
              ref={artRef}
              style={{
                color: "var(--bg)",
                opacity: 0.12,
                transform: "rotate(-3deg)",
              }}
            >
              <CodeWindowArt className="h-auto w-full" />
            </div>
          </div>

          <div className="relative z-10 flex w-full max-w-6xl flex-col justify-center gap-6 px-6 py-14 sm:px-12 md:gap-8 md:px-16 md:py-20">
            <p
              className="contact-fade mono-label"
              style={{ color: "color-mix(in srgb, var(--bg) 70%, transparent)" }}
            >
              You made it this far
            </p>

            <h2
              className="contact-fade text-balance font-bold"
              style={{
                fontSize: "var(--text-panel-cta)",
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-section)",
                maxWidth: "15em",
              }}
            >
              Let&apos;s build something exceptional together.
            </h2>

            <p
              className="contact-fade max-w-2xl"
              style={{
                color: "color-mix(in srgb, var(--bg) 78%, transparent)",
                fontSize: "var(--text-body)",
                lineHeight: "var(--leading-body)",
              }}
            >
              Tell me about your project and I&apos;ll help you shape it into a
              polished, high-performing experience.
            </p>

            <div className="contact-fade pt-2">
              <ArrowLink
                href={CONTACT_HREF}
                label="Get in Touch"
                target="_blank"
                className="font-semibold"
                style={{
                  height: 52,
                  paddingInline: 28,
                  gap: 8,
                  background: "transparent",
                  color: "var(--bg)",
                  border: "2px solid var(--bg)",
                  borderRadius: "var(--radius-pill)",
                  fontSize: 16,
                }}
                travel={26}
                arrowSize={20}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
