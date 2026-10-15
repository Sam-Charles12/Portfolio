"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { gsapSetup, prefersReducedMotion, blurFadeIn, parallaxY } from "@/lib/gsap";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/animate-ui/components/radix/tooltip";
import { siGithub } from "simple-icons";
import StackIcon from "tech-stack-icons";
import type { IconName } from "tech-stack-icons";
import { TextReveal } from "@/components/ui/cascade-text";

const STACK_ICON_NAMES: Record<string, IconName> = {
  React: "react",
  "React Native": "reactnative",
  TypeScript: "typescript",
  Express: "expressjs",
  Supabase: "supabase",
  Vite: "vitejs",
  Tailwind: "tailwindcss",
  "Tailwind CSS": "tailwindcss",
  "Next.js": "nextjs2",
  Nextjs: "nextjs2",
  GSAP: "gsap2",
  "Framer Motion": "framer",
  Framer: "framer",
  GitHub: "github",
  Groq: "groq",
};

function PaystackBadge({ name }: { name: string }) {
  return (
    <span aria-label={name} className="inline-flex">
      <svg viewBox="0 0 24 24" width={30} height={30} aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#011B33" />
        <text
          x="12"
          y="17.5"
          textAnchor="middle"
          fontSize="14"
          fontWeight={800}
          fill="#00C3F7"
          fontFamily="Arial, sans-serif"
        >
          P
        </text>
      </svg>
    </span>
  );
}

function TechBadge({ name }: { name: string }) {
  if (name === "Paystack") return <PaystackBadge name={name} />;
  const iconName = STACK_ICON_NAMES[name];
  if (!iconName) {
    const initials = name
      .split(/[\s.]+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return (
      <span
        aria-label={name}
        className="inline-flex items-center justify-center"
        style={{
          width: 24,
          height: 24,
          color: "#ededed",
          fontSize: 12,
          fontFamily: "var(--font-mono)",
        }}
      >
        {initials}
      </span>
    );
  }
  // Backdrop-aware, not site-theme-aware: badges sit on the fixed black
  // legibility scrim in both site themes, so always use variant="dark"
  // (white marks for dark backgrounds). variant="light" = black marks
  // for light backgrounds and would vanish here (Next.js, Express).
  return (
    <span
      aria-label={name}
      title={name}
      className="inline-flex"
      style={{ width: 30, height: 30 }}
    >
      <StackIcon name={iconName} variant="dark" />
    </span>
  );
}

type Project = {
  title: string;
  description: string;
  stack: string[];
  liveHref: string;
  repoHref: string;
  status: string;
  image?: string;
  imagePosition?: string;
};

const PROJECTS: Project[] = [
  {
    title: "Interact.",
    description:
      "First solo full-stack product — real-time interaction with an AI-assisted backend. Shipped end to end, from schema to deploy.",
    stack: ["React", "TypeScript", "Vite", "Express", "Supabase", "Groq", "Tailwind CSS"],
    liveHref: "#",
    repoHref: "#",
    status: "All systems operational",
    image: "/interact-hero.png",
  },
  {
    title: "Resolve",
    description:
      "Dispute inbox for Paystack teams — paste a “you took my money” message or receipt, verify live against Paystack + ledger, approve the reply in under 60s.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Groq",
      "Paystack",
      "GSAP",
      "Framer Motion",
    ],
    liveHref: "https://resolve-two-psi.vercel.app/",
    repoHref: "https://github.com/Sam-Charles12/Resolve",
    status: "All systems operational",
    image: "/resolve-image.png",
    imagePosition: "50% 32%",
  },
  {
    title: "RFForge",
    description:
      "Equation-grounded RF and microwave design tool for power-amplifier matching, with interactive visualisations and auditable worked examples.",
    stack: ["TypeScript", "Next.js", "Tailwind CSS", "Groq"],
    liveHref: "https://rfforge.vercel.app/",
    repoHref: "https://github.com/Sam-Charles12/rfforge",
    status: "All systems operational",
    image: "/rfforge-hero.png",
  },
];

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Scroll reveal (blur fade-and-rise, reverses out) + image parallax (GSAP).
  useEffect(() => {
    const card = ref.current;
    if (!card || prefersReducedMotion()) return;
    gsapSetup();
    const ctx = gsap.context(() => {
      blurFadeIn(card);
      if (imgRef.current) parallaxY(imgRef.current, card);
    }, card);
    return () => ctx.revert();
  }, []);

  return (
    <article
      ref={ref}
      className="group relative overflow-hidden transition-transform duration-200 hover:-translate-y-[3px]"
      style={{
        border: "var(--border-width) solid var(--border-20)",
        borderRadius: "4rem",
        minHeight: 560,
        background: "var(--surface-raised)",
      }}
    >
      {/* Screenshot — scroll parallax + subtle zoom on hover. */}
      {project.image ? (
        <div
          className="absolute inset-0 overflow-hidden transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          aria-hidden="true"
        >
          <img
            ref={imgRef}
            src={project.image}
            alt={`${project.title} screenshot`}
            style={{ objectPosition: project.imagePosition ?? "50% 0%" }}
            className="h-[112%] w-full object-cover"
          />
        </div>
      ) : (
        <div
          className="bg-blueprint-grid absolute inset-0 flex items-start justify-center pt-10"
          aria-hidden="true"
        >
          <span className="mono-label">{project.title} — screenshot</span>
        </div>
      )}

      {/* Legibility scrim — gradual fade for text legibility. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.75) 25%, rgba(0, 0, 0, 0.55) 45%, rgba(0, 0, 0, 0.32) 65%, rgba(0, 0, 0, 0.12) 82%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div
        className="relative flex h-full min-h-[560px] flex-col justify-end"
        style={{ padding: "var(--card-pad)", color: "#ededed" }}
      >
        <div className="flex items-start justify-between gap-4">
          <h3
            className="font-semibold"
            style={{
              fontSize: 28,
              letterSpacing: "var(--tracking-card)",
            }}
          >
            {project.title}
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={project.repoHref}
              aria-label={`${project.title} repository`}
              title={`${project.title} repository`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#ededed] transition-colors duration-200 hover:bg-[rgba(237,237,237,0.12)]"
            >
              <svg
                viewBox="0 0 24 24"
                width={24}
                height={24}
                fill="currentColor"
                aria-hidden="true"
              >
                <path d={siGithub.path} />
              </svg>
            </a>
            <a
              href={project.liveHref}
              aria-label={`${project.title} live demo`}
              title={`${project.title} live demo`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#ededed] transition-colors duration-200 hover:bg-[rgba(237,237,237,0.12)]"
            >
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={24}
                strokeWidth={2}
              />
            </a>
          </div>
        </div>

        <p
          className="mt-3"
          style={{
            color: "rgba(237, 237, 237, 0.78)",
            fontSize: "var(--text-body)",
            lineHeight: "var(--leading-body)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.description}
        </p>

        <p
          className="font-display mt-5 font-semibold"
          style={{ fontSize: 20, letterSpacing: "-0.01em", color: "#ededed" }}
        >
          Technologies
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          {project.stack.map((t) => (
            <Tooltip key={t}>
              <TooltipTrigger asChild>
                <span className="inline-flex cursor-default transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 data-[state=open]:-translate-y-0.5 data-[state=open]:scale-110">
                  <TechBadge name={t} />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={8} align="center">
                <p>{t}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span
            className="inline-flex items-center gap-2 font-mono italic"
            style={{
              fontSize: "calc(var(--text-mono-tag) + 2px)",
              letterSpacing: "var(--tracking-mono-tag)",
              color: "#bbf7d0",
              background: "#0f3d22",
              padding: "8px 16px",
              borderRadius: "var(--radius-pill)",
            }}
          >
            <span
              className="animate-pulse-dot inline-block rounded-full"
              style={{
                width: "var(--dot-size)",
                height: "var(--dot-size)",
                background: "#4ade80",
              }}
            />
            {project.status}
          </span>
          <a
            href={project.liveHref}
            className="inline-flex items-center gap-1 font-medium"
            style={{ fontSize: "var(--text-small)" }}
          >
            View details
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedWorks() {
  const introRef = useRef<HTMLDivElement>(null);

  // Intro reveal (GSAP, plays once — it stays stuck for the section).
  useEffect(() => {
    const intro = introRef.current;
    if (!intro || prefersReducedMotion()) return;
    gsapSetup();
    const ctx = gsap.context(() => {
      blurFadeIn(intro, { reversible: false });
    }, intro);
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" aria-label="Featured projects" className="w-full">
      <div
        className="container-shell grid grid-cols-1 gap-10 pt-0 pb-0 lg:grid-cols-[1fr_1.1fr]"
      >
        {/* Sticky intro — mirrors the reference split. */}
        <div className="lg:sticky lg:top-10 lg:self-start">
          <div ref={introRef}>
            <h2
              className="font-bold"
              style={{
                fontSize: "var(--text-section)",
                lineHeight: "var(--leading-section)",
                letterSpacing: "var(--tracking-section)",
              }}
            >
              Featured
              <br />
              projects
            </h2>
            <p
              className="mt-5 max-w-md"
              style={{
                color: "var(--text-70)",
                fontSize: "var(--text-body)",
                lineHeight: "var(--leading-body)",
              }}
            >
              some stuff i&apos;ve been working on, bits of code and ideas
              that found their way into something real.
            </p>
            <a
              href="#work"
              className="mt-7 inline-flex items-center font-semibold"
              style={{
                height: 48,
                paddingInline: 28,
                gap: 8,
                background: "transparent",
                color: "var(--ink)",
                border: "2px solid var(--ink)",
                borderRadius: "var(--radius-pill)",
                fontSize: 16,
              }}
            >
              <TextReveal
                as="span"
                text="All Works"
                fontSize="16px"
                color="var(--ink)"
                hoverColor="var(--ink)"
                style={{ padding: 0 }}
              />
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={18}
                strokeWidth={2}
              />
            </a>
          </div>
        </div>

        {/* Cards. */}
        <div
          className="flex w-full max-w-[680px] flex-col gap-8 justify-self-end"
        >
          {PROJECTS.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
