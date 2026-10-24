"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  blurFadeIn,
  gsapSetup,
  prefersReducedMotion,
} from "@/lib/gsap";
import { PROJECTS, ProjectCard } from "@/components/featured-works";

export default function AllWorks() {
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intro = introRef.current;
    if (!intro || prefersReducedMotion()) return;

    gsapSetup();
    const context = gsap.context(() => {
      blurFadeIn(intro, { reversible: false });
    }, intro);

    return () => context.revert();
  }, []);

  return (
    <main className="flex-1">
      <section
        aria-labelledby="works-title"
        className="container-shell pb-24 pt-8 md:pb-36 md:pt-14"
      >
        <div
          ref={introRef}
          className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-x-8"
        >
          {/* Left column: heading + description + card 2 */}
          <div className="flex flex-col lg:w-1/2">
            <div>
              <h1
                id="works-title"
                className="font-bold"
                style={{
                  fontSize: "clamp(3rem, 5vw, 5.5rem)",
                  lineHeight: 0.92,
                  letterSpacing: "var(--tracking-section)",
                }}
              >
                <span
                  className="bg-blueprint-grid mr-3 inline-flex h-[0.72em] w-[1.7em] translate-y-[-0.04em] overflow-hidden align-middle"
                  aria-label="Image placeholder"
                  title="Image placeholder"
                  style={{
                    border: "var(--border-width) solid var(--border-20)",
                    borderRadius: "var(--radius-pill)",
                    backgroundColor: "var(--surface-raised)",
                  }}
                />
                things
                <br />
                I&apos;ve built
              </h1>
            </div>

            <div className="mt-3 lg:mt-4">
              <p
                className="max-w-md"
                style={{
                  color: "var(--text-70)",
                  fontSize: "var(--text-body)",
                  lineHeight: "var(--leading-body)",
                }}
              >
                A collection of projects I&apos;ve shipped — tools, apps, and
                experiments that started as ideas and turned into something
                real.
              </p>
            </div>

            {/* Card 2 — flows directly below text */}
            <div className="aspect-square w-full max-w-sm mx-auto lg:max-w-none mt-8">
              <ProjectCard
                project={PROJECTS[1]}
                minHeight={0}
                className="h-full w-full"
              />
            </div>
          </div>

          {/* Right column: card 1 + card 3, offset down for stagger */}
          <div className="flex flex-col gap-8 lg:w-1/2 lg:mt-[28%]">
            <div className="aspect-square w-full max-w-sm mx-auto lg:max-w-none">
              <ProjectCard
                project={PROJECTS[0]}
                minHeight={0}
                className="h-full w-full"
              />
            </div>
            <div className="aspect-square w-full max-w-sm mx-auto lg:max-w-none">
              <ProjectCard
                project={PROJECTS[2]}
                minHeight={0}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
