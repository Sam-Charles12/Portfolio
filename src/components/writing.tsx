"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  gsapSetup,
  prefersReducedMotion,
  blurFadeIn,
  parallaxY,
} from "@/lib/gsap";
import { ArrowLink } from "@/components/ui/arrow-link";

type Post = {
  title: string;
  tags: string[];
  href: string;
  /** Optional cover in /public — falls back to the blueprint placeholder. */
  cover?: string;
};

// Placeholder copy — swap titles/tags/hrefs for real posts.
const POSTS: Post[] = [
  {
    title: "placeholder post title that wraps across a few lines",
    tags: ["engineering", "build-in-public", "notes"],
    href: "#",
  },
  {
    title: "another placeholder title — this is where the real headline goes",
    tags: ["architecture", "decisions", "product"],
    href: "#",
  },
  {
    title: "third placeholder title goes right here",
    tags: ["backend", "typescript", "performance"],
    href: "#",
  },
];

function BlogCard({ post }: { post: Post }) {
  const cardRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  // Cover parallax only when a real image is supplied.
  useEffect(() => {
    const card = cardRef.current;
    const media = mediaRef.current;
    if (!card || !media || prefersReducedMotion()) return;
    gsapSetup();
    const ctx = gsap.context(() => {
      parallaxY(media, card);
    }, card);
    return () => ctx.revert();
  }, []);

  return (
    <article ref={cardRef} className="blog-card">
      {/* Hover lift lives on the link: GSAP owns the article's transform. */}
      <a
        href={post.href}
        className="group block transition-transform duration-200 hover:-translate-y-[3px]"
        aria-label={`${post.title} — ${post.tags.join(", ")}`}
      >
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "var(--blog-media-ratio)",
            borderRadius: "var(--radius-card)",
            border: "var(--border-width) solid var(--border-20)",
            background: "var(--surface-raised)",
          }}
        >
          {post.cover ? (
            <>
              <div
                ref={mediaRef}
                className="absolute inset-x-0 top-[-6%] h-[112%]"
              >
                <Image
                  src={post.cover}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-[filter] duration-500 [filter:var(--img-filter)] group-hover:[filter:var(--img-filter-hover)]"
                />
              </div>
              {/* Legibility scrim for the tag pills over the photo. */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.22) 38%, transparent 62%)",
                }}
                aria-hidden="true"
              />
            </>
          ) : (
            <div
              className="bg-blueprint-grid absolute inset-0 flex items-start justify-center px-6 pt-10"
              aria-hidden="true"
            >
              <span className="mono-label text-center">
                {post.tags[0]} — cover
              </span>
            </div>
          )}

          <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center font-medium"
                style={{
                  background: "var(--fill)",
                  color: "var(--on-fill)",
                  borderRadius: "var(--radius-pill)",
                  padding: "7px 15px",
                  fontSize: 13,
                  letterSpacing: "-0.01em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h3
          className="mt-5 font-medium"
          style={{
            color: "var(--text-70)",
            fontSize: 20,
            lineHeight: 1.45,
            letterSpacing: "var(--tracking-card)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </h3>
      </a>
    </article>
  );
}

export default function Writing() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();

    const ctx = gsap.context(() => {
      // Intro copy reveals first, cards sweep in left→right behind it.
      blurFadeIn(".writing-fade", { duration: 1.2, stagger: 0.15 });
      blurFadeIn(Array.from(root.querySelectorAll(".blog-card")), {
        duration: 1,
        stagger: 0.12,
        y: 24,
        start: "top bottom-=40px",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="writing"
      aria-label="Writing"
      className="w-full"
    >
      <div className="container-shell py-16 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-8 xl:grid-cols-[minmax(460px,0.75fr)_minmax(0,1fr)_auto] xl:items-start xl:gap-x-12">
          <div className="writing-fade">
            <h2
              className="font-bold lowercase"
              style={{
                fontSize: "var(--text-section)",
                lineHeight: "var(--leading-section)",
                letterSpacing: "var(--tracking-section)",
                color: "var(--text-100)",
              }}
            >
              thoughts and
              <br />
              notes
            </h2>
          </div>

          <div className="writing-fade">
            <p
              className="max-w-[430px]"
              style={{
                color: "var(--text-70)",
                fontSize: "var(--text-body)",
                lineHeight: "var(--leading-body)",
              }}
            >
              here i share ideas, document experiments, and talk about things
              i&apos;m learning or building along the way. it&apos;s more of a
              quiet corner for insights, progress, and everything in between.
            </p>
          </div>

          <div className="writing-fade md:col-span-2 xl:col-span-1 xl:justify-self-end">
            <ArrowLink
              href="#"
              label="View all blog posts"
              className="font-semibold"
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
            />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {POSTS.map((post) => (
            <BlogCard key={post.title} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
