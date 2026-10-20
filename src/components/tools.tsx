"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import StackIcon from "tech-stack-icons";
import type { IconName } from "tech-stack-icons";
import { gsapSetup, prefersReducedMotion, blurFadeIn } from "@/lib/gsap";

type SiteTheme = "dark" | "light";

function useSiteTheme(): SiteTheme {
  const [theme, setTheme] = useState<SiteTheme>("dark");
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      setTheme(root.dataset.theme === "light" ? "light" : "dark");
    };
    update();
    const obs = new MutationObserver(update);
    obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return theme;
}

type Tool = {
  label: string;
  icon: IconName;
};

const TOOLS: Tool[] = [
  { label: "Next.js", icon: "nextjs2" },
  { label: "React", icon: "react" },
  { label: "Express.js", icon: "expressjs" },
  { label: "JavaScript", icon: "js" },
  { label: "TypeScript", icon: "typescript" },
  { label: "Node.js", icon: "nodejs" },
  { label: "Tailwind CSS", icon: "tailwindcss" },
  { label: "GSAP", icon: "gsap2" },
  { label: "Git", icon: "git" },
];

export default function Tools() {
  const theme = useSiteTheme();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();
    const ctx = gsap.context(() => {
      blurFadeIn(Array.from(root.querySelectorAll(".tool-cell")), {
        duration: 0.9,
        stagger: 0.08,
        y: 20,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="tools" aria-label="Tools I build with" className="w-full">
      <div className="container-shell grid grid-cols-1 gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2
            className="font-bold lowercase"
            style={{
              fontSize: "var(--text-section)",
              lineHeight: "var(--leading-section)",
              letterSpacing: "var(--tracking-section)",
              color: "var(--text-100)",
            }}
          >
            tools i<br />
            build with
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-4">
          {TOOLS.map((tool) => (
            <div
              key={tool.label}
              className="tool-cell flex flex-col items-center justify-center text-center transition-transform duration-200 hover:-translate-y-[3px]"
              style={{
                border: "var(--border-width) solid var(--border-20)",
                borderRadius: 48,
                background: "var(--surface-raised)",
                padding: "32px 20px 28px",
                minHeight: 180,
              }}
            >
              <span
                className="inline-flex items-center justify-center"
                style={{ width: 48, height: 48 }}
                aria-hidden="true"
              >
                <StackIcon
                  name={tool.icon}
                  variant={theme === "light" ? "light" : "dark"}
                />
              </span>
              <p
                className="mt-4 font-semibold"
                style={{
                  fontSize: 16,
                  letterSpacing: "-0.01em",
                  color: "var(--text-100)",
                }}
              >
                {tool.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
