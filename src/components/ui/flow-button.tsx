'use client';

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

type FlowButtonProps = {
  text: string;
  /** Renders a client-side link when set, a button otherwise. */
  href?: string;
  onClick?: () => void;
  className?: string;
};

/**
 * CTA with a circle-sweep hover: an ink disc blooms from the center while
 * the arrow trades sides. Adapted to the two-token palette (stays a full
 * pill — buttons never morph here) and Hugeicons instead of lucide.
 */
export function FlowButton({ text, href, onClick, className = "" }: FlowButtonProps) {
  const inner = (
    <>
      {/* Left arrow — slides in on hover. */}
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={16}
        strokeWidth={2}
        className="absolute left-[-25%] z-[9] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4"
      />

      {/* Text */}
      <span
        className="relative z-[1] -translate-x-3 transition-all duration-[800ms] ease-out group-hover:translate-x-3"
        style={{ fontSize: 15 }}
      >
        {text}
      </span>

      {/* Circle sweep */}
      <span className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-[220px] group-hover:w-[220px] group-hover:opacity-100" />

      {/* Right arrow — slides out on hover. */}
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={16}
        strokeWidth={2}
        className="absolute right-4 z-[9] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%]"
      />
    </>
  );

  const cls = `group relative flex h-12 cursor-pointer items-center gap-1 overflow-hidden rounded-full border-[1.5px] border-ink/40 bg-transparent px-8 font-semibold text-ink transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:text-bg active:scale-[0.95] ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
