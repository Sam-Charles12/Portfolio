"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { gsapSetup, prefersReducedMotion, blurFadeIn } from "@/lib/gsap";

type Stat = {
  value: number;
  suffix?: string;
  label: string;
  description: string;
};

const STATS: Stat[] = [
  {
    value: 15,
    suffix: "+",
    label: "Projects shipped",
    description: "Production apps across web and mobile.",
  },
  {
    value: 10,
    suffix: "+",
    label: "Happy clients",
    description: "Long-term partnerships and referrals.",
  },
  {
    value: 2,
    suffix: "+",
    label: "Years building",
    description: "From MVPs to scalable platforms.",
  },
  {
    value: 99,
    suffix: "%",
    label: "Uptime focus",
    description: "Reliability-first engineering mindset.",
  },
];

export default function Stats() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();

    const ctx = gsap.context(() => {
      // One tween, all four cells — DOM order makes the sweep read
      // left→right, and the x travel makes the direction unmistakable.
      // A single trigger means the order survives refreshes/resizes.
      blurFadeIn(Array.from(root.querySelectorAll(".stat-cell")), {
        duration: 0.9,
        stagger: 0.15,
        x: -48,
      });

      // Count-up — numbers tick from zero as each cell enters, hidden
      // inside the blur fade above. SSR renders the final value, so
      // no-JS and reduced-motion visitors see "15+" immediately.
      // The delay staggers the digits left→right in step with the cells.
      root
        .querySelectorAll<HTMLElement>(".stat-value")
        .forEach((el, i) => {
          const target = Number(el.dataset.value);
          const suffix = el.dataset.suffix ?? "";
          const counter = { v: 0 };
          gsap.to(counter, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            snap: { v: 1 },
            delay: i * 0.15,
            scrollTrigger: {
              trigger: el,
              start: "top bottom-=60px",
              once: true,
            },
            onUpdate: () => {
              el.textContent = `${Math.round(counter.v)}${suffix}`;
            },
          });
        });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Portfolio numbers"
      className="w-full"
    >
      <div className="container-shell grid grid-cols-1 py-16 md:py-24 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="stat-cell pt-8 pb-8 first:pt-0 last:pb-0 border-t first:border-t-0 lg:border-t-0 lg:border-l lg:first:border-l-0 lg:pt-0 lg:pb-0 lg:px-8 lg:first:pl-0 lg:last:pr-0"
            style={{ borderColor: "var(--border-15)" }}
          >
            <p
              className="stat-value font-display font-extrabold"
              data-value={stat.value}
              data-suffix={stat.suffix ?? ""}
              style={{
                fontSize: "var(--text-stat)",
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-stat)",
                color: "var(--text-100)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {stat.value}
              {stat.suffix}
            </p>
            <p
              className="mt-4 font-semibold"
              style={{
                color: "var(--text-100)",
                fontSize: "var(--text-card-title)",
                letterSpacing: "var(--tracking-card)",
              }}
            >
              {stat.label}
            </p>
            <p
              className="mt-2"
              style={{
                color: "var(--text-70)",
                fontSize: "var(--text-small)",
                lineHeight: "var(--leading-small)",
              }}
            >
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
