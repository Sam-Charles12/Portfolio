"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { gsapSetup, prefersReducedMotion, blurFadeIn } from "@/lib/gsap";
import { CONTACT_HREF } from "@/lib/site";

/**
 * Closing panel artwork — drop the final image at /public/contact-bg.png
 * (or point this at any other file in /public).
 */
const BACKGROUND_IMAGE = "/contact-bg.png";

export default function Contact() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();
    const ctx = gsap.context(() => {
      blurFadeIn(Array.from(root.querySelectorAll(".contact-fade")), {
        duration: 1.2,
        stagger: 0.15,
        reversible: false,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="contact"
      aria-label="Contact"
      className="w-full"
      style={{ paddingBottom: "var(--stack-lg)" }}
    >
      <div className="container-shell">
        {/* Full-bleed rounded panel — artwork with a bottom-anchored close. */}
        <div
          className="relative flex overflow-hidden"
          style={{
            borderRadius: "clamp(24px, 3vw, 40px)",
            minHeight: "clamp(480px, 72vh, 760px)",
            backgroundColor: "var(--surface-raised)",
            border: "var(--border-width) solid var(--border-20)",
          }}
        >
          <img
            src={BACKGROUND_IMAGE}
            alt=""
            aria-hidden="true"
            decoding="async"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Bottom scrim — keeps the copy legible over any artwork. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.42) 26%, rgba(0, 0, 0, 0.12) 48%, transparent 68%)",
            }}
          />

          <div
            className="relative mt-auto flex w-full flex-col items-start"
            style={{
              padding: "clamp(24px, 4vw, 56px)",
              color: "#ededed",
            }}
          >
            <p
              className="contact-fade mono-label"
              style={{ color: "rgba(237, 237, 237, 0.72)" }}
            >
              You made it this far.
            </p>

            <h2
              className="contact-fade mt-4 font-bold"
              style={{
                fontSize: "var(--text-cta)",
                lineHeight: "var(--leading-cta)",
                letterSpacing: "var(--tracking-section)",
                maxWidth: "16ch",
              }}
            >
              Let&apos;s build something exceptional together.
            </h2>

            <a
              href={CONTACT_HREF}
              target="_blank"
              rel="noreferrer"
              className="contact-fade mt-8 inline-flex items-center font-semibold transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
              style={{
                height: 52,
                paddingInline: 28,
                gap: 10,
                background: "#ededed",
                color: "#0a0a0a",
                borderRadius: "var(--radius-pill)",
                fontSize: 16,
              }}
            >
              Get in touch
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
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
