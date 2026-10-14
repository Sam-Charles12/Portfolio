"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
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
  // Badges sit on the black legibility scrim in both site themes,
  // so always use the dark-variant (white) marks — the light/black
  // Next.js + Express marks vanish on this backdrop.
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
];

function ProjectCard({ project }: { project: Project }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Parallax: image drifts as the card moves through the viewport.
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  return (
    <motion.article
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className="group relative overflow-hidden"
      style={{
        border: "var(--border-width) solid var(--border-20)",
        borderRadius: "var(--radius-card)",
        minHeight: 560,
        background: "var(--surface-raised)",
      }}
    >
      {/* Screenshot — scroll parallax + subtle zoom on hover. */}
      {project.image ? (
        <div
          className={`absolute inset-0 overflow-hidden ${
            reduceMotion
              ? ""
              : "transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          }`}
          aria-hidden="true"
        >
          <motion.img
            src={project.image}
            alt={`${project.title} screenshot`}
            style={
              reduceMotion
                ? { objectPosition: project.imagePosition ?? "50% 0%" }
                : {
                    y: imageY,
                    objectPosition: project.imagePosition ?? "50% 0%",
                  }
            }
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
    </motion.article>
  );
}

export default function FeaturedWorks() {
  const reduceMotion = useReducedMotion();
  return (
    <section id="work" aria-label="Featured projects" className="w-full">
      <div
        className="container-shell grid grid-cols-1 gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.1fr]"
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        {/* Sticky intro — mirrors the reference split. */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
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
              All Works
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={18}
                strokeWidth={2}
              />
            </a>
          </motion.div>
        </div>

        {/* Cards. */}
        <div
          className="flex w-full max-w-[620px] flex-col gap-6 justify-self-end"
        >
          {PROJECTS.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
