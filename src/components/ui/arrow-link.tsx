"use client";

import React, { useEffect, useMemo, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { gsapSetup, prefersReducedMotion } from "@/lib/gsap";

const splitGraphemes = (text: string): string[] => {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (s) => s.segment);
  }
  return [...text];
};

export type ArrowLinkProps = {
  href: string;
  label: string;
  target?: string;
  className?: string;
  style?: CSSProperties;
  /** Diagonal travel of the arrow swap, in px. */
  travel?: number;
  arrowSize?: number;
};

/**
 * Pill link with the reference site's hover motion: the label rolls up
 * per character from a second stacked copy, and the arrow swaps with a
 * diagonal fly-out/fly-in. Both timelines are paused and played/reversed
 * on hover or keyboard focus.
 */
export function ArrowLink({
  href,
  label,
  target,
  className = "",
  style,
  travel = 24,
  arrowSize = 18,
}: ArrowLinkProps) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const topRef = useRef<HTMLSpanElement>(null);
  const bottomRef = useRef<HTMLSpanElement>(null);
  const arrowTopRef = useRef<HTMLSpanElement>(null);
  const arrowBottomRef = useRef<HTMLSpanElement>(null);

  const textTl = useRef<gsap.core.Timeline | null>(null);
  const arrowTl = useRef<gsap.core.Timeline | null>(null);

  const chars = useMemo(() => splitGraphemes(label), [label]);

  useEffect(() => {
    const top = topRef.current;
    const bottom = bottomRef.current;
    const arrowTop = arrowTopRef.current;
    const arrowBottom = arrowBottomRef.current;
    if (!top || !bottom || !arrowTop || !arrowBottom) return;

    if (prefersReducedMotion()) {
      gsap.set(bottom, { autoAlpha: 0 });
      gsap.set(arrowBottom, { autoAlpha: 0 });
      return;
    }

    gsapSetup();

    const ctx = gsap.context(() => {
      const topChars = top.querySelectorAll<HTMLElement>("[data-char]");
      const bottomChars = bottom.querySelectorAll<HTMLElement>("[data-char]");

      // Second copy waits one line below; both copies are clipped by the
      // label wrapper, so the roll reads as one continuous line.
      // `y: 0` cancels the px offset from the pre-hydration transform,
      // otherwise GSAP adds yPercent on top of the parsed 100% and the
      // copy starts two lines down.
      gsap.set(bottomChars, { y: 0, yPercent: 100 });

      const text = gsap.timeline({ paused: true });
      text
        .to(topChars, {
          yPercent: -100,
          stagger: 0.035,
          delay: 0.15,
          duration: 0.3,
          ease: "expo.inOut",
        })
        .to(
          bottomChars,
          {
            yPercent: 0,
            stagger: 0.035,
            duration: 0.3,
            ease: "expo.inOut",
          },
          "<0.1",
        );

      // Incoming arrow starts down-left, scaled down; outgoing arrow
      // leaves up-right and shrinks away. scaleX/scaleY instead of the
      // `scale` shorthand so GSAP context reverts don't warn.
      gsap.set(arrowBottom, {
        x: -travel,
        y: travel,
        opacity: 0,
        scaleX: 0.7,
        scaleY: 0.7,
      });

      const arrow = gsap.timeline({ paused: true });
      arrow
        .to(
          arrowTop,
          {
            x: travel,
            y: -travel,
            opacity: 0,
            scaleX: 0.7,
            scaleY: 0.7,
            duration: 0.6,
            ease: "power2.out",
          },
          0,
        )
        .to(
          arrowBottom,
          {
            x: 0,
            y: 0,
            opacity: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 0.6,
            ease: "power2.in",
          },
          "<0.1",
        );

      textTl.current = text;
      arrowTl.current = arrow;
    }, rootRef);

    return () => {
      ctx.revert();
      textTl.current = null;
      arrowTl.current = null;
    };
  }, [travel]);

  const play = () => {
    textTl.current?.play();
    arrowTl.current?.play();
  };
  const reverse = () => {
    textTl.current?.reverse();
    arrowTl.current?.reverse();
  };

  const renderChars = (copy: "top" | "bottom") =>
    chars.map((char, i) => (
      <span
        key={i}
        data-char
        className="inline-block will-change-transform"
        style={
          copy === "bottom" ? { transform: "translateY(100%)" } : undefined
        }
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <a
      ref={rootRef}
      href={href}
      target={target}
      rel={target === "_blank" ? "noreferrer" : undefined}
      aria-label={label}
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`.trim()}
      style={style}
      onMouseEnter={play}
      onMouseLeave={reverse}
      onFocus={play}
      onBlur={reverse}
    >
      <span
        className="relative block overflow-hidden"
        style={{ lineHeight: 1.5 }}
        aria-hidden="true"
      >
        <span ref={topRef} className="block">
          {renderChars("top")}
        </span>
        <span ref={bottomRef} className="absolute inset-0 block">
          {renderChars("bottom")}
        </span>
      </span>

      <span
        className="relative inline-block overflow-hidden"
        style={{ width: arrowSize + 2, height: arrowSize + 2 }}
        aria-hidden="true"
      >
        <span ref={arrowTopRef} className="absolute left-0 top-0 block">
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            size={arrowSize}
            strokeWidth={2}
          />
        </span>
        <span
          ref={arrowBottomRef}
          className="absolute left-0 top-0 block"
          style={{ opacity: 0 }}
        >
          <HugeiconsIcon
            icon={ArrowUpRight01Icon}
            size={arrowSize}
            strokeWidth={2}
          />
        </span>
      </span>
    </a>
  );
}
