"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { gsapSetup, prefersReducedMotion, blurFadeIn } from "@/lib/gsap";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Calendar01Icon,
  CodeIcon,
  Database01Icon,
  Layers01Icon,
  Mail01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { siGithub } from "simple-icons";

function Section({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    gsapSetup();
    const ctx = gsap.context(() => {
      blurFadeIn(el);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="border-t py-12"
      style={{ borderColor: "var(--border-15)" }}
    >
      <p className="mono-label">
        {index} — {label}
      </p>
      <h2
        className="mt-3 font-semibold"
        style={{
          fontSize: "var(--text-section)",
          lineHeight: "var(--leading-section)",
          letterSpacing: "var(--tracking-section)",
        }}
      >
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Swatch({
  name,
  value,
  fg,
  bg,
  border,
}: {
  name: string;
  value: string;
  fg: string;
  bg: string;
  border?: string;
}) {
  return (
    <div
      className="p-4"
      style={{
        background: bg,
        color: fg,
        border: `var(--border-width) solid ${border ?? "var(--border-20)"}`,
        borderRadius: "var(--radius-card-sm)",
      }}
    >
      <p className="font-mono text-xs">{name}</p>
      <p className="mt-1 font-mono text-xs opacity-70">{value}</p>
    </div>
  );
}

export default function DesignSystemDemo() {
  const gsapBar = useRef<HTMLDivElement>(null);
  const gsapReveal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsapSetup();
    const ctx = gsap.context(() => {
      if (gsapBar.current) {
        gsap.fromTo(
          gsapBar.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.out",
            transformOrigin: "left center",
          },
        );
      }
      if (gsapReveal.current) blurFadeIn(gsapReveal.current);
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-bg text-ink font-body min-h-screen">
      {/* Nav demo */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          height: "var(--nav-h)",
          background: "var(--surface-overlay)",
          borderColor: "var(--border-20)",
          backdropFilter: "var(--nav-blur)",
        }}
      >
        <div className="container-shell flex h-full items-center justify-between">
          <span className="font-bold tracking-tight">carles.dev</span>
          <nav className="hidden gap-6 font-mono text-xs md:flex" style={{ color: "var(--text-50)" }}>
            <span>Work</span>
            <span>About</span>
            <span>Writing</span>
            <span>Contact</span>
          </nav>
          <button
            className="font-mono text-xs uppercase"
            style={{
              height: "var(--btn-h-sm)",
              paddingInline: "var(--btn-pad-x-sm)",
              border: "var(--border-width) solid var(--border-25)",
              borderRadius: "var(--radius-btn)",
              letterSpacing: "var(--tracking-mono-label)",
            }}
          >
            Say hello
          </button>
        </div>
      </header>

      <main className="container-shell pb-24">
        {/* Hero demo */}
        <div className="bg-blueprint-grid -mx-6 px-6 pt-16 pb-14">
          <p className="mono-label">Software Engineer</p>
          <h1
            className="mt-4 font-bold"
            style={{
              fontSize: "var(--text-hero)",
              lineHeight: "var(--leading-hero)",
              letterSpacing: "var(--tracking-hero)",
            }}
          >
            Building clean,
            <br />
            usable software<span className="animate-blink">_</span>
          </h1>
          <p
            className="mt-5 max-w-xl"
            style={{ color: "var(--text-70)", fontSize: "var(--text-body)", lineHeight: "var(--leading-body)" }}
          >
            I build web apps and care about how they feel to use. Every
            component below reads from the same two tokens —{" "}
            <span className="font-mono text-sm">--bg</span> and{" "}
            <span className="font-mono text-sm">--ink</span> — hierarchy from
            opacity only.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              className="font-medium"
              style={{
                height: "var(--btn-h)",
                paddingInline: "var(--btn-pad-x)",
                background: "var(--fill)",
                color: "var(--on-fill)",
                borderRadius: "var(--radius-btn)",
                fontSize: "var(--btn-text)",
              }}
            >
              Filled action — See my work
            </button>
            <button
              style={{
                height: "var(--btn-h)",
                paddingInline: "var(--btn-pad-x)",
                border: "var(--border-width) solid var(--border-25)",
                borderRadius: "var(--radius-btn)",
                fontSize: "var(--btn-text)",
              }}
            >
              Outlined action — Download CV
            </button>
            <span
              className="inline-flex items-center gap-2 font-mono uppercase"
              style={{
                padding: "var(--pill-pad-y) var(--pill-pad-x)",
                border: "var(--border-width) solid var(--border-20)",
                borderRadius: "var(--radius-pill)",
                fontSize: "var(--text-mono-tag)",
                letterSpacing: "var(--tracking-mono-tag)",
              }}
            >
              <span
                className="animate-pulse-dot inline-block rounded-full"
                style={{ width: "var(--dot-size)", height: "var(--dot-size)", background: "var(--ink)" }}
              />
              Open to internships
            </span>
          </div>
        </div>

        <Section index="01" label="Color" title="Two tokens, opacity does the work">
          <div className="grid gap-3 sm:grid-cols-2">
            <Swatch name="--bg" value="#0a0a0a" fg="var(--ink)" bg="var(--bg)" />
            <Swatch name="--ink" value="#ededed" fg="var(--bg)" bg="var(--ink)" border="var(--ink)" />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-5">
            <Swatch name="text 100%" value="headings" fg="var(--text-100)" bg="transparent" />
            <Swatch name="text 82%" value="long-form body" fg="var(--text-82)" bg="transparent" />
            <Swatch name="text 70%" value="body" fg="var(--text-70)" bg="transparent" />
            <Swatch name="text 50%" value="labels / dates" fg="var(--text-50)" bg="transparent" />
            <Swatch name="text 35%" value="captions" fg="var(--text-35)" bg="transparent" />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            <Swatch name="border 25%" value="hover" fg="var(--text-70)" bg="transparent" border="var(--border-25)" />
            <Swatch name="border 20%" value="default" fg="var(--text-70)" bg="transparent" border="var(--border-20)" />
            <Swatch name="border 15%" value="subtle" fg="var(--text-70)" bg="transparent" border="var(--border-15)" />
            <Swatch name="grid 5%" value="graph paper" fg="var(--text-70)" bg="transparent" border="var(--grid-line)" />
          </div>
          <div
            className="mt-3 flex items-center justify-between p-4"
            style={{ background: "var(--fill)", color: "var(--on-fill)", borderRadius: "var(--radius-card-sm)" }}
          >
            <span className="font-mono text-xs uppercase">Flip pair — filled element</span>
            <span className="font-mono text-xs">ink bg / bg text</span>
          </div>
        </Section>

        <Section index="02" label="Typography" title="Syne + Manrope + Fira Code">
          <div className="space-y-6">
            <div>
              <p className="mono-label">Hero — 24→48px / 1.1 / tight</p>
              <p className="font-bold" style={{ fontSize: "var(--text-hero)", lineHeight: 1, letterSpacing: "var(--tracking-hero)" }}>
                Shipping clean software.
              </p>
            </div>
            <div>
              <p className="mono-label">Section — 60→72px / semibold</p>
              <p className="font-semibold" style={{ fontSize: "var(--text-section)", letterSpacing: "var(--tracking-section)" }}>
                Featured projects
              </p>
            </div>
            <div>
              <p className="mono-label">Body — 17px / 1.625</p>
              <p style={{ color: "var(--text-70)", fontSize: "var(--text-body)", lineHeight: "var(--leading-body)", maxWidth: "var(--prose-measure)" }}>
                Casual and direct. Short sentences, no buzzwords. I build web
                apps and care about how they feel to use — shipped products,
                the stack behind them, and the decisions I made.
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <span className="mono-label">Mono label — 12px / .20em</span>
              <span className="font-mono" style={{ fontSize: "var(--text-mono-tag)", letterSpacing: "var(--tracking-mono-tag)", color: "var(--text-50)" }}>
                SEP 2025 — APR 2026 · TAG
              </span>
            </div>
          </div>
        </Section>

        <Section index="03" label="Buttons & icons" title="Filled, outlined, icon">
          <div className="flex flex-wrap items-center gap-3">
            <button style={{ height: "var(--btn-h)", paddingInline: "var(--btn-pad-x)", background: "var(--fill)", color: "var(--on-fill)", borderRadius: "var(--radius-btn)" }}>
              Download CV
            </button>
            <button style={{ height: "var(--btn-h)", paddingInline: "var(--btn-pad-x)", border: "var(--border-width) solid var(--border-25)", borderRadius: "var(--radius-btn)" }}>
              Get in touch
            </button>
            <button className="font-mono uppercase" style={{ height: "var(--btn-h-sm)", paddingInline: "var(--btn-pad-x-sm)", border: "var(--border-width) solid var(--border-25)", borderRadius: "var(--radius-btn)", fontSize: "var(--btn-mono-text)", letterSpacing: "var(--tracking-mono-label)" }}>
              Say hello
            </button>
            <span
              title="GitHub"
              className="inline-flex items-center justify-center"
              style={{ width: "var(--icon-btn-size)", height: "var(--icon-btn-size)", border: "var(--border-width) solid var(--border-20)", borderRadius: "var(--radius-btn)" }}
            >
              <svg
                viewBox="0 0 24 24"
                width={18}
                height={18}
                fill="currentColor"
                aria-hidden="true"
              >
                <path d={siGithub.path} />
              </svg>
            </span>
            {[
              { icon: Mail01Icon, label: "Email" },
              { icon: Search01Icon, label: "Search" },
              { icon: ArrowUpRight01Icon, label: "External" },
            ].map(({ icon, label }) => (
              <span
                key={label}
                title={label}
                className="inline-flex items-center justify-center"
                style={{ width: "var(--icon-btn-size)", height: "var(--icon-btn-size)", border: "var(--border-width) solid var(--border-20)", borderRadius: "var(--radius-btn)" }}
              >
                <HugeiconsIcon icon={icon} size={18} strokeWidth={2} />
              </span>
            ))}
          </div>
          <p className="mt-4 font-mono text-xs" style={{ color: "var(--text-50)" }}>
            Focus any button with Tab — 2px ink ring, 3px offset. Selection is
            inverted (ink bg / bg text).
          </p>
        </Section>

        <Section index="04" label="Tags & status" title="Grouped by area, no logos">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { group: "Frontend", tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Konva.js"] },
              { group: "Backend", tags: ["Express", "Supabase", "PostgreSQL", "Node.js"] },
              { group: "Design", tags: ["Figma", "GSAP", "Git"] },
            ].map(({ group, tags }) => (
              <div key={group}>
                <p className="mono-label">{group}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span key={t} className="font-mono uppercase" style={{ padding: "var(--tag-pad-y) var(--tag-pad-x)", border: "var(--border-width) solid var(--border-20)", borderRadius: "var(--radius-pill)", fontSize: "var(--text-mono-tag)", letterSpacing: "var(--tracking-mono-tag)", color: "var(--text-70)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <span className="font-mono uppercase" style={{ padding: "var(--tag-pad-y) var(--tag-pad-x)", background: "var(--fill)", color: "var(--on-fill)", borderRadius: "var(--radius-pill)", fontSize: "var(--text-mono-tag)", letterSpacing: "var(--tracking-mono-tag)" }}>
              Selected
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs" style={{ color: "var(--text-50)" }}>
            <span className="inline-flex items-center gap-2">
              <span className="animate-pulse-dot inline-block rounded-full" style={{ width: "var(--dot-size)", height: "var(--dot-size)", background: "var(--ink)" }} />
              All systems operational
            </span>
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon icon={Calendar01Icon} size={14} /> SEP 2025 — APR 2026
            </span>
            <span>+4 more</span>
          </div>
        </Section>

        <Section index="05" label="Cards" title="Projects, writing, stats, experience">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Project card */}
            <article
              className="overflow-hidden transition-transform duration-200 hover:-translate-y-[3px]"
              style={{ background: "var(--surface-raised)", border: "var(--border-width) solid var(--border-20)", borderRadius: "var(--radius-card)" }}
            >
              <div className="bg-blueprint-grid flex items-center justify-center font-mono text-xs" style={{ aspectRatio: "16 / 10", color: "var(--text-50)", filter: "var(--img-filter)" }}>
                screenshot — grayscale, color on hover
              </div>
              <div style={{ padding: "var(--card-pad)" }}>
                <h3 className="font-semibold" style={{ fontSize: "var(--text-card-title)", letterSpacing: "var(--tracking-card)" }}>Logicraft</h3>
                <p className="mt-2 text-sm" style={{ color: "var(--text-70)", lineHeight: "var(--leading-small)" }}>
                  Flagship — a complex canvas app. What it is, the problem it
                  solves, and the key stack decisions in one line.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["React", "TypeScript", "Konva.js", "Zustand"].map((t) => (
                    <span key={t} className="font-mono uppercase" style={{ padding: "var(--tag-pad-y) var(--tag-pad-x)", border: "var(--border-width) solid var(--border-20)", borderRadius: "var(--radius-pill)", fontSize: "var(--text-mono-tag)", color: "var(--text-50)" }}>
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-3 font-mono text-xs" style={{ color: "var(--text-50)" }}>● All systems operational · View details →</p>
              </div>
            </article>

            {/* Blog card */}
            <article
              className="transition-transform duration-200 hover:-translate-y-[3px]"
              style={{ background: "var(--surface-raised)", border: "var(--border-width) solid var(--border-20)", borderRadius: "var(--radius-card)", padding: "var(--card-pad)" }}
            >
              <div className="flex gap-2 font-mono text-xs uppercase" style={{ color: "var(--text-50)" }}>
                <span>engineering-decision</span>
                <span>·</span>
                <span>architecture</span>
              </div>
              <h3 className="mt-2 font-semibold" style={{ fontSize: "var(--text-card-title)" }}>
                Why I picked Zustand over Redux for canvas state
              </h3>
              <p className="mt-2 text-sm" style={{ color: "var(--text-70)" }}>
                What broke, what I measured, and what I&apos;d change next time.
                Build-in-public notes on real trade-offs.
              </p>
              <p className="mt-3 font-mono text-xs" style={{ color: "var(--text-50)" }}>6 min read · OCT 2026</p>
            </article>

            {/* Stat */}
            <div style={{ border: "var(--border-width) solid var(--border-20)", borderRadius: "var(--radius-card)", padding: "var(--card-pad)" }}>
              <p className="mono-label">Stats — real numbers only</p>
              <p className="mt-2 font-bold" style={{ fontSize: "var(--text-stat)", letterSpacing: "var(--tracking-stat)" }}>4</p>
              <p className="text-sm" style={{ color: "var(--text-70)" }}>Projects shipped & demoable</p>
            </div>

            {/* Experience row */}
            <div style={{ border: "var(--border-width) solid var(--border-20)", borderRadius: "var(--radius-card)", padding: "var(--card-pad)" }}>
              <p className="mono-label">Frontend Developer Intern — Zedu</p>
              <p className="mt-2 font-mono text-xs" style={{ color: "var(--text-50)" }}>SEP 2025 — APR 2026</p>
              <p className="mt-2 text-sm" style={{ color: "var(--text-70)" }}>
                Real-time video and screen-share flows, latency down ~30%.
              </p>
            </div>
          </div>
        </Section>

        <Section index="06" label="Marquee" title="Slow divider band">
          <div className="overflow-hidden border-y py-3" style={{ borderColor: "var(--border-15)" }}>
            <div className="animate-marquee flex w-max gap-8 font-mono uppercase" style={{ fontSize: "var(--text-mono-label)", letterSpacing: "var(--tracking-marquee)", color: "var(--text-50)" }}>
              {Array.from({ length: 2 }).map((_, i) => (
                <span key={i} className="flex gap-8">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <span key={j}>building — shipping — learning —</span>
                  ))}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-3 font-mono text-xs" style={{ color: "var(--text-50)" }}>
            32s linear infinite. Second variant: 48s slow. Paused under reduced-motion.
          </p>
        </Section>

        <Section index="07" label="Timeline" title="Experience rail">
          <div className="relative pl-8" style={{ borderLeft: "var(--border-width) solid var(--border-15)" }}>
            {[
              { role: "Frontend Developer Intern", org: "Zedu", date: "SEP 2025 — APR 2026", icon: CodeIcon },
              { role: "SIWES / IT Placement", org: "TBD", date: "WHEN READY", icon: Database01Icon },
            ].map(({ role, org, date, icon }) => (
              <div key={role} className="relative pb-8 last:pb-0">
                <span className="absolute rounded-full" style={{ left: "calc(-1 * var(--stack-md) - 5px)", top: 4, width: "var(--timeline-dot)", height: "var(--timeline-dot)", background: "var(--fill)" }} />
                <p className="flex items-center gap-2 font-semibold">
                  <HugeiconsIcon icon={icon} size={16} /> {role}
                </p>
                <p className="mt-1 font-mono text-xs" style={{ color: "var(--text-50)" }}>{date} · {org}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section index="08" label="Code details" title="Code flavor — ink-colored SVG">
          <div className="grid gap-6 md:grid-cols-3">
            <div style={{ border: "var(--border-width) solid var(--border-20)", borderRadius: "var(--radius-card)", padding: "var(--card-pad)" }}>
              <p className="mono-label">Code snippet</p>
              <pre className="mt-4 overflow-x-auto font-mono text-xs leading-relaxed" style={{ color: "var(--text-70)" }}>
{`// why Zustand over Redux
const useCanvas = create((set) => ({
  nodes: [],
  move: (id, x, y) => set(pick(id, x, y)),
}));`}
              </pre>
              <p className="mt-2 font-mono text-xs" style={{ color: "var(--text-50)" }}>mono · 70% ink · no colors</p>
            </div>
            <div style={{ border: "var(--border-width) solid var(--border-20)", borderRadius: "var(--radius-card)", padding: "var(--card-pad)" }}>
              <p className="mono-label">Architecture</p>
              <svg viewBox="0 0 200 80" className="mt-4 w-full" fill="none" stroke="var(--diagram-stroke-color)" strokeWidth={1.5}>
                <rect x="8" y="24" width="52" height="32" rx="6" />
                <rect x="74" y="24" width="52" height="32" rx="6" />
                <rect x="140" y="24" width="52" height="32" rx="6" />
                <line x1="60" y1="40" x2="74" y2="40" />
                <line x1="126" y1="40" x2="140" y2="40" />
              </svg>
              <p className="mt-2 font-mono text-xs" style={{ color: "var(--text-50)" }}>client → api → db · 1.5px ink</p>
            </div>
            <div style={{ border: "var(--border-width) solid var(--border-20)", borderRadius: "var(--radius-card)", padding: "var(--card-pad)" }}>
              <p className="mono-label">Request flow</p>
              <div className="mt-4 flex items-center gap-2 font-mono text-xs">
                <span style={{ border: "var(--border-width) solid var(--border-25)", borderRadius: "var(--radius-thumb)", padding: "8px 10px" }}>UI</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                <span style={{ border: "var(--border-width) solid var(--border-25)", borderRadius: "var(--radius-thumb)", padding: "8px 10px" }}>API</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                <span style={{ border: "var(--border-width) solid var(--border-25)", borderRadius: "var(--radius-thumb)", padding: "8px 10px" }}>DB</span>
              </div>
              <p className="mt-2 font-mono text-xs" style={{ color: "var(--text-50)" }}>Interact. stack path</p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-2 font-mono text-xs" style={{ color: "var(--text-50)" }}>
            <HugeiconsIcon icon={Layers01Icon} size={14} /> Snippets and architecture diagrams in ink lines only — color appears on screenshots hover, nowhere else.
          </p>
        </Section>

        <Section index="09" label="Motion" title="GSAP blur fade-in, lift">
          <div className="grid gap-6 md:grid-cols-2">
            <div style={{ border: "var(--border-width) solid var(--border-20)", borderRadius: "var(--radius-card)", padding: "var(--card-pad)" }}>
              <p className="mono-label">GSAP — blur fade-in</p>
              <div
                ref={gsapReveal}
                className="mt-3 text-sm"
                style={{ color: "var(--text-70)" }}
              >
                Scrolls into view: fades up 20px through blur, 1.4s,
                power3.out. Every entrance on the site uses this one helper.
              </div>
            </div>
            <div style={{ border: "var(--border-width) solid var(--border-20)", borderRadius: "var(--radius-card)", padding: "var(--card-pad)" }}>
              <p className="mono-label">GSAP — mount tween</p>
              <div className="mt-3 h-2 overflow-hidden" style={{ background: "var(--border-15)", borderRadius: "var(--radius-pill)" }}>
                <div ref={gsapBar} className="h-full w-full" style={{ background: "var(--ink)" }} />
              </div>
              <p className="mt-3 font-mono text-xs" style={{ color: "var(--text-50)" }}>
                power3.out · 1.2s · transform-origin left
              </p>
            </div>
          </div>
        </Section>

        <Section index="10" label="Closing CTA + footer" title="You made it this far.">
          <div className="text-center" style={{ paddingBlock: "var(--stack-lg)" }}>
            <p className="mono-label">You made it this far.</p>
            <p className="mx-auto mt-3 max-w-2xl font-bold" style={{ fontSize: "var(--text-cta)", lineHeight: "var(--leading-cta)", letterSpacing: "var(--tracking-section)" }}>
              Let&apos;s build something exceptional together.
            </p>
            <button className="mt-6" style={{ height: "var(--btn-h)", paddingInline: "var(--btn-pad-x)", background: "var(--fill)", color: "var(--on-fill)", borderRadius: "var(--radius-btn)" }}>
              Get in touch <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="inline" />
            </button>
          </div>
          <footer className="mt-8 grid gap-6 border-t pt-8 md:grid-cols-3" style={{ borderColor: "var(--border-15)" }}>
            <div>
              <p className="font-bold">carles</p>
              <p className="mt-2 font-mono text-xs" style={{ color: "var(--text-50)" }}>Work · About · Writing · Contact</p>
            </div>
            <div className="font-mono text-xs" style={{ color: "var(--text-50)" }}>
              <p>GitHub · X · email</p>
              <p className="mt-1">Download CV — in hero and here</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: "var(--text-70)" }}>
                Frontend-leaning, full-stack capable. This site&apos;s code is public —
                recruiters will read it.
              </p>
              <p className="mt-2 font-mono text-xs" style={{ color: "var(--text-50)" }}>© 2026 carles · shipped, not templated</p>
            </div>
          </footer>
        </Section>
      </main>
    </div>
  );
}
