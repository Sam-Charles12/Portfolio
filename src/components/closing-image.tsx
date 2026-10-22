"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { gsapSetup, prefersReducedMotion, blurFadeIn } from "@/lib/gsap";

/**
 * Full-bleed artwork between the tools list and the writing section.
 * Drop the image at /public/contact-bg.png (or point this at any other
 * file in /public).
 *
 * The `#contact` anchor now lives on the closing CTA panel
 * (src/components/contact.tsx), so the nav's "Say Hello" lands on the
 * actual call to action.
 */
const BACKGROUND_IMAGE = "/contact-bg.png";

export default function ClosingImage() {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || prefersReducedMotion()) return;
    gsapSetup();

    const ctx = gsap.context(() => {
      blurFadeIn(frame, { duration: 1.3, y: 24 });
    }, frame);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="closing-image"
      aria-label="Closing image"
      className="w-full"
      style={{
        paddingTop: "clamp(72px, 9vw, 128px)",
        paddingBottom: "var(--stack-lg)",
      }}
    >
      <div className="container-shell">
        <div
          ref={frameRef}
          className="relative overflow-hidden"
          style={{
            borderRadius: "clamp(24px, 3vw, 40px)",
            height: "clamp(560px, 88vh, 920px)",
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
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
