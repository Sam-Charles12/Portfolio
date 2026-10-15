"use client";

import { siPolestar } from "simple-icons";

const ITEMS = Array.from({ length: 6 });

function MarqueeHalf({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-8 pr-8 md:gap-12 md:pr-12"
      aria-hidden={hidden || undefined}
    >
      {ITEMS.map((_, i) => (
        <span key={i} className="flex shrink-0 items-center gap-8 md:gap-12">
          <span
            className="font-display font-normal whitespace-nowrap"
            style={{
              fontSize: "clamp(4rem, 2.5rem + 7vw, 7rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "var(--text-50)",
              textTransform: "lowercase",
            }}
          >
            about me
          </span>
          <svg
            viewBox="0 0 24 24"
            width={84}
            height={84}
            fill="currentColor"
            aria-hidden="true"
            style={{ color: "var(--text-50)", flexShrink: 0 }}
          >
            <path d={siPolestar.path} />
          </svg>
        </span>
      ))}
    </div>
  );
}

export default function AboutMarquee() {
  return (
    <section
      aria-label="About me divider"
      className="w-full overflow-hidden"
      style={{ paddingTop: 16, paddingBottom: 24 }}
    >
      <div className="animate-marquee-slow flex w-max items-center">
        <MarqueeHalf />
        <MarqueeHalf hidden />
      </div>
    </section>
  );
}
