"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";

type Theme = "dark" | "light";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light"
    ? "light"
    : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("carles-theme", next);
      } catch {
        /* storage unavailable — theme just won't persist */
      }
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", next === "dark" ? "#0a0a0a" : "#f5f5f5");
      setTheme(next);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }

    // One overlay layer, transform + opacity only (GPU, no page repaint).
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const r = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const overlay = document.createElement("div");
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;background:${next === "dark" ? "#0a0a0a" : "#f5f5f5"};z-index:200;pointer-events:none;will-change:transform,opacity;`;
    document.body.appendChild(overlay);

    const grow = overlay.animate(
      [{ transform: "scale(1)" }, { transform: `scale(${(r * 2 + 48) / 24})` }],
      { duration: 550, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
    );
    overlay.animate(
      [{ transform: "scale(1)" }, { transform: `scale(${(r * 2 + 24) / 24})` }],
      { duration: 500, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
    );
    // Overlap the phases: swap once the disc covers ~90% (ease-out front-loads
    // growth), and start fading before cover completes — so no fully-flat
    // frame ever holds on screen.
    window.setTimeout(apply, 300);
    const fade = overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 350,
      delay: 250,
      easing: "ease-out",
      fill: "forwards",
    });
    fade.onfinish = () => overlay.remove();
  };

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex items-center justify-center"
      style={{ width: 48, height: 48 }}
    >
      <span key={theme} className="theme-icon">
        <HugeiconsIcon
          icon={theme === "dark" ? Sun01Icon : Moon01Icon}
          size={22}
          strokeWidth={1.5}
        />
      </span>
    </button>
  );
}
