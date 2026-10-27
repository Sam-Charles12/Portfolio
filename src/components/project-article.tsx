"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import {
  blurFadeIn,
  gsapSetup,
  prefersReducedMotion,
} from "@/lib/gsap";
import { TechBadge } from "@/components/featured-works";
import type { ProjectDetail, ProjectSection } from "@/lib/projects";

/** Reading column — same measure as the blog reader. */
const MEASURE = 896;

/**
 * Body copy supports **bold** and `code` inline. Code renders in the
 * mono face on a raised fill — no second colour, per the palette rules.
 */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong
              key={index}
              className="font-semibold"
              style={{ color: "var(--text-100)" }}
            >
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code
              key={index}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85em",
                background: "var(--surface-raised-hover)",
                color: "var(--text-100)",
                borderRadius: 6,
                padding: "2px 7px",
                whiteSpace: "nowrap",
              }}
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const operational = status === "All systems operational";
  return (
    <span
      className="inline-flex items-center gap-2 font-mono italic"
      style={
        operational
          ? {
              fontSize: "calc(var(--text-mono-tag) + 2px)",
              letterSpacing: "var(--tracking-mono-tag)",
              color: "#bbf7d0",
              background: "#0f3d22",
              padding: "8px 16px",
              borderRadius: "var(--radius-pill)",
            }
          : {
              fontSize: "calc(var(--text-mono-tag) + 2px)",
              letterSpacing: "var(--tracking-mono-tag)",
              color: "var(--text-70)",
              background: "var(--surface-raised-hover)",
              padding: "8px 16px",
              borderRadius: "var(--radius-pill)",
            }
      }
    >
      <span
        className="animate-pulse-dot inline-block rounded-full"
        style={{
          width: "var(--dot-size)",
          height: "var(--dot-size)",
          background: operational ? "#4ade80" : "var(--ink)",
        }}
      />
      {status}
    </span>
  );
}

function ProjectLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  // "#" means the project hasn't shipped publicly yet — show a muted
  // "soon" pill instead of a link that goes nowhere.
  if (href === "#") {
    return (
      <span
        aria-disabled="true"
        className="inline-flex cursor-not-allowed items-center font-medium"
        style={{
          height: 52,
          paddingInline: 26,
          gap: 8,
          color: "var(--text-35)",
          border: "2px solid var(--border-20)",
          borderRadius: "var(--radius-pill)",
          fontSize: 16,
        }}
      >
        {label} — soon
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center font-semibold transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
      style={{
        height: 52,
        paddingInline: 26,
        gap: 8,
        background: "transparent",
        color: "var(--ink)",
        border: "2px solid var(--ink)",
        borderRadius: "var(--radius-pill)",
        fontSize: 16,
      }}
    >
      {label}
      {icon}
    </a>
  );
}

/** Outlined icon pills like the reference — collapses past five stack. */
const VISIBLE_STACK = 5;

function StackPills({ stack }: { stack: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = stack.length > VISIBLE_STACK;
  const visible =
    expanded || !collapsible ? stack : stack.slice(0, VISIBLE_STACK);

  return (
    <ul className="project-hero-fade mt-7 flex flex-wrap items-center gap-3">
      {visible.map((item) => (
        <li
          key={item}
          className="inline-flex items-center font-medium"
          style={{
            gap: 10,
            border: "1px solid var(--border-20)",
            color: "var(--text-70)",
            borderRadius: "var(--radius-pill)",
            padding: "10px 18px",
            fontSize: 15,
          }}
        >
          <TechBadge name={item} size={20} />
          {item}
        </li>
      ))}
      {collapsible && (
        <li>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="inline-flex cursor-pointer items-center font-medium transition-colors duration-200 hover:text-ink"
            style={{
              border: "1px solid var(--border-20)",
              color: "var(--text-70)",
              borderRadius: "var(--radius-pill)",
              padding: "10px 18px",
              fontSize: 15,
            }}
          >
            {expanded ? "Show less" : `+${stack.length - VISIBLE_STACK} more`}
          </button>
        </li>
      )}
    </ul>
  );
}

function Section({ section, first }: { section: ProjectSection; first: boolean }) {
  const top = first ? 0 : "clamp(48px, 6vw, 72px)";
  return (
    <section style={{ marginTop: top }}>
      <h2
        className="font-semibold"
        style={{
          color: "var(--text-100)",
          fontSize: "clamp(1.875rem, 1.4rem + 1.6vw, 2.25rem)",
          lineHeight: 1.25,
          letterSpacing: "var(--tracking-section)",
          textDecoration: "underline",
          textDecorationColor:
            "color-mix(in srgb, var(--ink) 45%, transparent)",
          textDecorationThickness: "1px",
          textUnderlineOffset: "5px",
        }}
      >
        {section.heading}
      </h2>

      {section.paragraphs.map((text, index) => (
        <p
          key={index}
          style={{
            marginTop: 20,
            color: "var(--text-82)",
            fontSize: "calc(var(--text-body) + 1px)",
            lineHeight: 2,
            letterSpacing: "var(--tracking-body)",
            textWrap: "pretty",
          }}
        >
          <RichText text={text} />
        </p>
      ))}

      {section.bullets && (
        <ul className="flex flex-col" style={{ marginTop: 24, gap: 16 }}>
          {section.bullets.map((item, index) => (
            <li key={index} className="flex gap-4">
              <span
                aria-hidden="true"
                className="mt-[13px] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--ink)" }}
              />
              <span
                style={{
                  color: "var(--text-82)",
                  fontSize: "calc(var(--text-body) + 1px)",
                  lineHeight: 1.8,
                  textWrap: "pretty",
                }}
              >
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      )}

      {section.steps && (
        <ol className="flex flex-col" style={{ marginTop: 24, gap: 20 }}>
          {section.steps.map((item, index) => (
            <li key={index} className="flex gap-5">
              <span
                aria-hidden="true"
                className="shrink-0 font-mono"
                style={{
                  color: "var(--text-35)",
                  fontSize: "var(--text-small)",
                  lineHeight: 2,
                  minWidth: 28,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  color: "var(--text-82)",
                  fontSize: "calc(var(--text-body) + 1px)",
                  lineHeight: 1.8,
                  textWrap: "pretty",
                }}
              >
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function NeighbourLink({
  project,
  direction,
}: {
  project: ProjectDetail | null;
  direction: "previous" | "next";
}) {
  const isNext = direction === "next";

  if (!project) {
    return (
      <span
        className={`inline-flex items-center gap-2 ${
          isNext ? "justify-self-end" : "justify-self-start"
        }`}
        style={{ color: "var(--text-35)", fontSize: 16 }}
      >
        {!isNext && (
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} />
        )}
        {isNext ? "no newer project" : "no older project"}
        {isNext && (
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
        )}
      </span>
    );
  }

  return (
    <Link
      href={`/works/${project.slug}`}
      className={`group inline-flex min-w-0 items-center gap-2 transition-colors duration-200 ${
        isNext ? "justify-self-end" : "justify-self-start"
      }`}
      style={{ color: "var(--text-70)", fontSize: 16 }}
    >
      {!isNext && (
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          size={16}
          strokeWidth={2}
          className="shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
        />
      )}
      <span className="max-w-[26ch] truncate transition-colors duration-200 group-hover:text-ink">
        {project.title}
      </span>
      {isNext && (
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={16}
          strokeWidth={2}
          className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
        />
      )}
    </Link>
  );
}

export default function ProjectArticle({
  project,
  previous,
  next,
}: {
  project: ProjectDetail;
  previous: ProjectDetail | null;
  next: ProjectDetail | null;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();

    const context = gsap.context(() => {
      blurFadeIn(Array.from(root.querySelectorAll(".project-hero-fade")), {
        trigger: null,
        duration: 1.1,
        stagger: 0.09,
        y: 18,
        reversible: false,
      });

      root
        .querySelectorAll(".project-body > *")
        .forEach((el) =>
          blurFadeIn(el, { duration: 1, y: 24, start: "top bottom-=50px" }),
        );
    }, root);

    return () => context.revert();
  }, []);

  return (
    <main ref={rootRef} className="flex-1">
      <article>
        <div className="container-shell pt-6 md:pt-10">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2"
            style={{ fontSize: "var(--text-small)" }}
          >
            <Link
              href="/works"
              className="group inline-flex items-center gap-2"
              style={{ color: "var(--text-50)" }}
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={15}
                strokeWidth={2}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              <span className="transition-colors duration-200 group-hover:text-ink">
                Works
              </span>
            </Link>
            <span aria-hidden="true" style={{ color: "var(--text-35)" }}>
              /
            </span>
            <span aria-current="page" style={{ color: "var(--text-100)" }}>
              {project.title}
            </span>
          </nav>
        </div>

        <header className="container-shell pt-10 md:pt-16">
          <div className="project-hero-fade">
            <StatusPill status={project.status} />
          </div>

          <h1
            className="project-hero-fade mt-5 font-semibold"
            style={{
              color: "var(--text-100)",
              fontSize: "clamp(2.75rem, 1.5rem + 4.5vw, 4rem)",
              lineHeight: 1,
              letterSpacing: "var(--tracking-section)",
              textWrap: "balance",
            }}
          >
            {project.title}
          </h1>

          <p
            className="project-hero-fade mt-6"
            style={{
              color: "var(--text-70)",
              fontSize: "calc(var(--text-body) + 1px)",
              lineHeight: 1.625,
              maxWidth: 1100,
              textWrap: "pretty",
            }}
          >
            {project.dek}
          </p>

          <StackPills stack={project.stack} />

          <div className="project-hero-fade mt-9 flex flex-wrap gap-4">
            <ProjectLink
              href={project.liveHref}
              label="Live demo"
              icon={
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={18}
                  strokeWidth={2}
                />
              }
            />
            <ProjectLink
              href={project.repoHref}
              label="Source code"
              icon={
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={18}
                  strokeWidth={2}
                />
              }
            />
          </div>
        </header>

        <div className="container-shell pt-10 md:pt-16">
          <div
            className="project-hero-fade relative aspect-[16/10] overflow-hidden lg:aspect-[21/9]"
            style={{
              borderRadius: "clamp(24px, 2vw, 32px)",
              background: "var(--surface-raised)",
            }}
          >
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="container-shell pb-20 pt-14 md:pb-28 md:pt-20">
          <div
            className="project-body mx-auto px-4 md:px-6"
            style={{ maxWidth: MEASURE }}
          >
            {project.sections.map((section, index) => (
              <Section key={section.heading} section={section} first={index === 0} />
            ))}

            <nav aria-label="More projects" className="mt-14 pt-10">
              <div
                className="mb-6"
                style={{ height: 1, background: "var(--border-15)" }}
              />
              <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-3">
                <NeighbourLink project={previous} direction="previous" />
                <Link
                  href="/works"
                  className="justify-self-start rounded-full transition-colors duration-200 hover:text-ink sm:justify-self-center"
                  style={{ color: "var(--text-50)", fontSize: 16 }}
                >
                  back to all projects
                </Link>
                <NeighbourLink project={next} direction="next" />
              </div>
            </nav>
          </div>
        </div>
      </article>
    </main>
  );
}
