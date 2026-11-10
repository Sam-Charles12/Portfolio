"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { gsapSetup, prefersReducedMotion, blurFadeIn } from "@/lib/gsap";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon } from "@hugeicons/core-free-icons";
import { ShimmeringText } from "@/components/animate-ui/primitives/texts/shimmering";
import { CV_URL } from "@/lib/site";

const Lanyard = dynamic(() => import("@/components/lanyard"), {
  ssr: false,
});

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  // Entrance (GSAP): one blur-fade language — label, headline lines,
  // paragraph and buttons fade in through blur, staggered.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();

    const ctx = gsap.context(() => {
      blurFadeIn(".hero-fade", {
        trigger: null,
        duration: 1.4,
        stagger: 0.22,
        delay: 0.15,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Intro"
      className="w-full"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div
        className="container-shell grid grid-cols-1 items-center gap-12 py-14 md:py-20 lg:grid-cols-[1.05fr_0.95fr]"
        style={{
          minHeight: "calc(100dvh - var(--nav-h))",
        }}
      >
        {/* Left — copy */}
        <div className="flex w-full max-w-none flex-col items-start">
          <p className="hero-fade mono-label">Software Engineer</p>

          <h1
            className="mt-4 font-extrabold"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 800,
              fontSize: "clamp(2.05rem, 1.6rem + 2.2vw, 3rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "var(--text-100)",
            }}
          >
            <span className="hero-fade block md:whitespace-nowrap">
              Building scalable systems.
            </span>
            <span className="hero-fade block">
              <ShimmeringText
                text="Writing clean code."
                wave={false}
                duration={4}
              />
            </span>
          </h1>

          <p
            className="hero-fade mt-5 max-w-xl"
            style={{
              color: "var(--text-70)",
              fontSize: 19,
              lineHeight: 1.9,
            }}
          >
            Full-stack engineer obsessed with performance, maintainability,
            and elegant solutions. From APIs to frontends, I ship
            production-ready software.
          </p>

          <div className="hero-fade mt-8 flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex items-center font-medium outline-hidden transition-all duration-200 hover:-translate-y-0.5 hover:opacity-85 active:scale-[0.97] active:opacity-85 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate"
              style={{
                height: 52,
                paddingInline: 28,
                background: "var(--fill)",
                color: "var(--on-fill)",
                borderRadius: "var(--radius-btn)",
                fontSize: 16,
                gap: 10,
              }}
            >
              See my work
            </a>
            <a
              href={CV_URL}
              target={CV_URL.startsWith("http") ? "_blank" : undefined}
              rel={CV_URL.startsWith("http") ? "noreferrer" : undefined}
              className="inline-flex items-center font-medium outline-hidden transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--surface-raised-hover)] hover:text-[var(--text-100)] active:scale-[0.97] active:bg-[var(--surface-raised-hover)] active:text-[var(--text-100)] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&>span:last-child]:truncate"
              style={{
                height: 52,
                paddingInline: 28,
                background: "transparent",
                color: "var(--ink)",
                border: "2px solid var(--ink)",
                borderRadius: "var(--radius-btn)",
                fontSize: 16,
                gap: 10,
              }}
            >
              Download CV
              <HugeiconsIcon
                icon={Download01Icon}
                size={18}
                strokeWidth={2}
              />
            </a>
          </div>
        </div>

        {/* Right — interactive 3D badge. Name is printed on the card
            texture itself, so no photo is needed.
            Pulled to the viewport top on lg (cancels grid py-20 + header
            height) so the strap hangs from the very top of the page,
            sliding behind the nav. Clipped flush at y=0. */}
        <div
          className="relative h-[clamp(420px,52vw,600px)] w-full overflow-hidden lg:-mt-[232px] lg:h-[calc(clamp(420px,52vw,600px)+232px)]"
        >
          <Lanyard
            cardColor="#111111"
            strapColor="#1a1a1a"
            orientation="portrait"
            finish="matte"
            metal="silver"
            size={0.38}
            anchor="center"
            strapLength={0.7}
            interactive
            intro
          />
        </div>

      </div>
    </section>
  );
}
