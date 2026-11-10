"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import StackIcon from "tech-stack-icons";
import { gsapSetup, prefersReducedMotion, blurFadeIn } from "@/lib/gsap";
import { TOOLS } from "@/components/tools";

/**
 * Edge-bleed tools marquee — the same tool cells as the homepage grid,
 * reformatted as compact cards on an infinite loop. Pauses on hover.
 */
function MarqueeHalf({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-6 pr-6"
      aria-hidden={hidden || undefined}
    >
      {TOOLS.map((tool) => (
        <span
          key={tool.label}
          className="flex shrink-0 items-center gap-4"
          style={{
            border: "var(--border-width) solid var(--border-20)",
            borderRadius: "var(--radius-card-sm)",
            background: "var(--surface-raised)",
            padding: "20px 28px",
          }}
        >
          <span
            className="inline-flex items-center justify-center"
            style={{ width: 40, height: 40 }}
            aria-hidden="true"
          >
            <StackIcon name={tool.icon} variant="dark" />
          </span>
          <span
            className="font-semibold whitespace-nowrap"
            style={{
              fontSize: 16,
              letterSpacing: "-0.01em",
              color: "var(--text-100)",
            }}
          >
            {tool.label}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function ToolsMarquee() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();
    const ctx = gsap.context(() => {
      blurFadeIn(root, { reversible: false });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Tools I build with"
      className="w-full overflow-hidden py-16 md:py-24"
    >
      <div className="container-shell pb-10">
        <h2
          className="font-bold lowercase"
          style={{
            fontSize: "var(--text-section)",
            lineHeight: "var(--leading-section)",
            letterSpacing: "var(--tracking-section)",
            color: "var(--text-100)",
          }}
        >
          stack
        </h2>
      </div>
      <div
        className="animate-marquee-slow flex w-max items-center hover:[animation-play-state:paused]"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <MarqueeHalf />
        <MarqueeHalf hidden />
      </div>
    </section>
  );
}
