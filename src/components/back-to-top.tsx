"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon } from "@hugeicons/core-free-icons";

/** Fixed back-to-top button — appears after scrolling past the hero. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#top"
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className="fixed z-40 inline-flex items-center justify-center transition-all duration-300 hover:scale-105"
      style={{
        right: "clamp(20px, 6vw, 100px)",
        bottom: 24,
        width: 48,
        height: 48,
        // Glassmorphism — translucent bg + blur, matching the nav overlay.
        background: "color-mix(in srgb, var(--bg) 55%, transparent)",
        backdropFilter: "var(--nav-blur)",
        WebkitBackdropFilter: "var(--nav-blur)",
        color: "var(--text-100)",
        border: "1px solid color-mix(in srgb, var(--ink) 18%, transparent)",
        borderRadius: "50%",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <HugeiconsIcon icon={ArrowUp01Icon} size={20} strokeWidth={2} />
    </a>
  );
}
