"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { TextReveal } from "@/components/ui/cascade-text";

const LINKS = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#work" },
  { label: "Blog", href: "#writing" },
  { label: "Contact", href: "#contact" },
];

const ENTRANCE_COLORS = [
  "color-mix(in srgb, var(--ink) 88%, var(--bg))",
  "color-mix(in srgb, var(--ink) 76%, var(--bg))",
  "color-mix(in srgb, var(--ink) 62%, var(--bg))",
  "color-mix(in srgb, var(--ink) 46%, var(--bg))",
];

let easeReady = false;
/** Sterling-gate signature ease, created once. Falls back safely. */
function mainEase(): string {
  if (easeReady) return "main";
  try {
    gsap.registerPlugin(CustomEase);
    CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
    easeReady = true;
    return "main";
  } catch {
    return "power2.out";
  }
}

/**
 * Kinetic menu panel — preserves the nav's compact floating treatment while
 * entering from the right edge of the panel bounds.
 */
export default function MenuDrawer({ onClose }: { onClose: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const closedRef = useRef(false);
  const [active, setActive] = useState("#top");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const el: HTMLDivElement = root;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ease = mainEase();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") void playClose();
    };
    const onCloseRequest = () => void playClose();
    const onPointerDown = (e: MouseEvent) => {
      const t = e.target as Element | null;
      // Clicking the hamburger itself is a toggle — don't also close here.
      if (t?.closest("[data-menu-toggle]")) return;
      if (!el.contains(t as Node)) void playClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("menu-close-request", onCloseRequest);
    window.addEventListener("mousedown", onPointerDown);

    const ctx = gsap.context(() => {
      const panel = el.querySelector(".drawer-panel");
      const colorLayers = el.querySelectorAll(".drawer-color-layer");
      const content = el.querySelector(".drawer-content");
      const chars = el.querySelectorAll(".nav-link-inner [data-char]");
      const linkInners = el.querySelectorAll(".nav-link-inner");
      // Links animate themselves via each component's own entrance keyframe
      // (nav-link-rise / cascade) — skip the old timeline targets here.
      const fades = el.querySelectorAll("[data-drawer-fade]");

      if (reduced) {
        gsap.set(
          [panel, colorLayers, content, linkInners, fades, chars],
          { clearProps: "all" },
        );
      } else {
        gsap.set(panel, { clipPath: "inset(0 0 0 100%)" });
        gsap.set(colorLayers, { xPercent: 101 });
        gsap.set(content, { autoAlpha: 0 });
        gsap.set(linkInners, { autoAlpha: 0, y: 28 });
        gsap.set(chars, { yPercent: 140, rotation: 8 });
        gsap.to(panel, {
          clipPath: "inset(0 0 0 0%)",
          duration: 0.82,
          ease: "power3.out",
        });
        gsap.to(colorLayers, {
          xPercent: -101,
          duration: 0.94,
          stagger: 0.1,
          delay: 0.05,
          ease: "power2.inOut",
        });
        gsap.fromTo(
          fades,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.07,
            duration: 0.55,
            delay: 0.34,
            ease: "power3.out",
          },
        );
        gsap.to(content, {
          autoAlpha: 1,
          duration: 0.35,
          delay: 1.05,
          ease: "power2.out",
        });
        gsap.to(chars, {
          yPercent: 0,
          rotation: 0,
          duration: 0.58,
          stagger: 0.035,
          delay: 1.08,
          ease: "power3.out",
        });
        gsap.to(linkInners, {
          autoAlpha: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.08,
          delay: 1.1,
          ease: "power3.out",
        });
      }
    }, el);

    function playClose() {
      if (closedRef.current) return;
      closedRef.current = true;
      const panel = el.querySelector(".drawer-panel");
      if (reduced || !panel) {
        onClose();
        return;
      }
      const node = panel as HTMLElement;
      const colorLayers = el.querySelectorAll(".drawer-color-layer");
      const chars = el.querySelectorAll(".nav-link-inner [data-char]");
      const linkInners = el.querySelectorAll(".nav-link-inner");
      const fades = el.querySelectorAll("[data-drawer-fade]");
      const closeTimeline = gsap.timeline({ onComplete: onClose });

      closeTimeline
        .to(
          chars,
          {
            yPercent: 140,
            rotation: 8,
            duration: 0.48,
            stagger: 0.025,
            ease: "power3.in",
          },
          0,
        )
        .to(
          linkInners,
          {
            autoAlpha: 0,
            y: 28,
            duration: 0.52,
            stagger: 0.08,
            ease: "power3.in",
          },
          0.04,
        )
        .to(
          fades,
          {
            autoAlpha: 0,
            y: 16,
            duration: 0.38,
            stagger: 0.05,
            ease: "power2.in",
          },
          0,
        )
        .to(
          colorLayers,
          {
            xPercent: 101,
            duration: 0.86,
            stagger: 0.1,
            ease: "power2.inOut",
          },
          0.25,
        )
        .to(
          node,
          {
            clipPath: "inset(0 0 0 100%)",
            duration: 0.9,
            ease: "power3.inOut",
          },
          0.18,
        );
    }

    (el as unknown as { _playClose: () => void })._playClose = playClose;

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("menu-close-request", onCloseRequest);
      window.removeEventListener("mousedown", onPointerDown);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestClose = () => {
    const root = rootRef.current as unknown as {
      _playClose?: () => void;
    } | null;
    root?._playClose?.();
  };

  return (
    <div
      className="fixed z-80 pointer-events-none"
      style={{
        top: 112,
        right: "clamp(20px, 6vw, 100px)",
        width: "min(520px, calc(100vw - 24px))",
      }}
    >
      <div
        ref={rootRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="relative"
      >
        <div
          className="drawer-panel pointer-events-auto relative flex min-h-160 flex-col overflow-hidden"
          style={{
            border:
              "1px solid color-mix(in srgb, var(--bg) 25%, transparent)",
            borderRadius: 32,
            background: "var(--ink)",
          }}
        >
          {ENTRANCE_COLORS.map((color) => (
            <span
              key={color}
              aria-hidden="true"
              className="drawer-color-layer pointer-events-none absolute inset-0 z-20"
              style={{ background: color }}
            />
          ))}

          <div
            className="drawer-content relative z-10 flex flex-1 flex-col"
            style={{ padding: 28 }}
          >
            <p
              data-drawer-fade
              className="max-w-xs"
              style={{
                fontSize: "var(--text-body)",
                color: "var(--bg)",
              }}
            >
              explore my work, thoughtfully designed
            </p>

            <nav className="mt-6 flex flex-col gap-1" aria-label="Menu">
              {LINKS.map((l) => {
                const isActive = active === l.href;
                return (
                  <span key={l.href} className="block overflow-hidden">
                    <TextReveal
                      text={l.label}
                      href={l.href}
                      onClick={() => {
                        setActive(l.href);
                        requestClose();
                      }}
                      className="nav-link-inner font-display font-semibold tracking-tight"
                      fontSize="2.5rem"
                      style={{ paddingInline: 0 }}
                      color={
                        isActive
                          ? "var(--bg)"
                          : "color-mix(in srgb, var(--bg) 50%, transparent)"
                      }
                      hoverColor="var(--bg)"
                    />
                  </span>
                );
              })}
            </nav>

            <p
              data-drawer-fade
              className="mt-auto font-mono"
              style={{
                fontSize: "var(--text-mono-tag)",
                letterSpacing: "var(--tracking-mono-tag)",
                color: "color-mix(in srgb, var(--bg) 70%, transparent)",
                paddingTop: 24,
              }}
            >
              Imagination is more important than knowledge
              <br />
              — Albert Einstein
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
