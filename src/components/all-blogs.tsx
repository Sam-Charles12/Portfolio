"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  blurFadeIn,
  getScrollTrigger,
  gsapSetup,
  parallaxY,
  prefersReducedMotion,
} from "@/lib/gsap";
import { POSTS, formatPostDate, type Post } from "@/lib/posts";

/**
 * Listing card — the writing-section card plus the dek and the date/reading
 * line, so the full page gives readers enough to choose between posts.
 */
function ListingCard({ post }: { post: Post }) {
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
    <article ref={cardRef} className="blog-listing-card">
      {/* Hover lift lives on the link: GSAP owns the article's transform. */}
      <a
        href={`/blog/${post.slug}`}
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
                  className="object-cover"
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
          className="mt-5 line-clamp-2 font-semibold"
          style={{
            color: "var(--text-100)",
            fontSize: 22,
            lineHeight: 1.35,
            letterSpacing: "var(--tracking-card)",
          }}
        >
          {post.title}
        </h3>
        <p
          className="mt-2 line-clamp-2"
          style={{
            color: "var(--text-70)",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          {post.dek}
        </p>
        <p className="mono-label mt-3">
          {formatPostDate(post.date)} · {post.readingMinutes} min read
        </p>
      </a>
    </article>
  );
}

function FilterPill({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`inline-flex cursor-pointer items-center font-medium transition-colors duration-200 ${
        selected ? "" : "hover:border-ink hover:text-ink"
      }`}
      style={
        selected
          ? {
              background: "var(--fill)",
              color: "var(--on-fill)",
              border: "1px solid var(--fill)",
              borderRadius: "var(--radius-pill)",
              padding: "12px 20px",
              fontSize: 14,
            }
          : {
              background: "transparent",
              color: "var(--text-70)",
              border: "1px solid var(--border-20)",
              borderRadius: "var(--radius-pill)",
              padding: "12px 20px",
              fontSize: 14,
            }
      }
    >
      {label}
    </button>
  );
}

export default function AllBlogs() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  // The grid replays a CSS fade on filter swaps; the first paint is owned
  // by the GSAP reveal below instead, so the two never double up.
  const [hasFiltered, setHasFiltered] = useState(false);
  const introRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const tags = useMemo(
    () => Array.from(new Set(POSTS.flatMap((post) => post.tags))),
    [],
  );
  const visible = activeTag
    ? POSTS.filter((post) => post.tags.includes(activeTag))
    : POSTS;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsapSetup();

    const ctx = gsap.context(() => {
      if (introRef.current) {
        blurFadeIn(introRef.current, { reversible: false });
      }
      const cards = gridRef.current?.querySelectorAll(".blog-listing-card");
      if (cards && cards.length > 0) {
        // One-shot: filtered cards mount later and fade via CSS, so these
        // triggers must not linger after their nodes unmount.
        blurFadeIn(Array.from(cards), {
          duration: 1,
          stagger: 0.12,
          y: 24,
          start: "top bottom-=40px",
          reversible: false,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Filtering changes the page height — recalculate trigger positions.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    getScrollTrigger().refresh();
  }, [activeTag]);

  const selectTag = (tag: string | null) => {
    setHasFiltered(true);
    setActiveTag(tag);
  };

  return (
    <main className="flex-1">
      <section
        aria-labelledby="blog-title"
        className="container-shell pb-24 pt-8 md:pb-36 md:pt-14"
      >
        <div ref={introRef}>
          <h1
            id="blog-title"
            className="font-bold lowercase"
            style={{
              fontSize: "clamp(3rem, 5vw, 5.5rem)",
              lineHeight: 0.92,
              letterSpacing: "var(--tracking-section)",
            }}
          >
            <span
              aria-hidden="true"
              className="relative mr-3 inline-flex h-[0.72em] w-[1.7em] translate-y-[-0.04em] overflow-hidden align-middle"
              style={{
                border: "var(--border-width) solid var(--border-20)",
                borderRadius: "var(--radius-pill)",
                backgroundColor: "var(--surface-raised)",
              }}
            >
              <Image
                src="/contact-bg.png"
                alt=""
                fill
                sizes="(min-width: 768px) 20vw, 40vw"
                className="object-cover [filter:var(--img-filter)]"
              />
            </span>
            thoughts and
            <br />
            notes
          </h1>

          <p
            className="mt-3 max-w-[34rem] lg:mt-4"
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

          <div
            role="group"
            aria-label="Filter posts by tag"
            className="mt-8 flex flex-wrap gap-2"
          >
            <FilterPill
              label="all"
              selected={activeTag === null}
              onSelect={() => selectTag(null)}
            />
            {tags.map((tag) => (
              <FilterPill
                key={tag}
                label={tag}
                selected={activeTag === tag}
                onSelect={() => selectTag(activeTag === tag ? null : tag)}
              />
            ))}
          </div>
        </div>

        {visible.length > 0 ? (
          <div
            ref={gridRef}
            key={activeTag ?? "all"}
            aria-live="polite"
            className={`${hasFiltered ? "animate-fade-rise " : ""}mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3`}
          >
            {visible.map((post) => (
              <ListingCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p
            aria-live="polite"
            className="mt-12 lg:mt-16"
            style={{ color: "var(--text-50)", fontSize: "var(--text-body)" }}
          >
            nothing here yet under this tag.
          </p>
        )}
      </section>
    </main>
  );
}
