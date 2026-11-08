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

  // Cover parallax only when a real image is supplied. Re-runs when the
  // cover changes (covers were wired before the files landed) and the
  // trigger refreshes once the image decodes, so positions are never
  // measured against an empty box.
  useEffect(() => {
    const card = cardRef.current;
    const media = mediaRef.current;
    if (!card || !media || prefersReducedMotion()) return;
    gsapSetup();
    const ctx = gsap.context(() => {
      parallaxY(media, card, -8, 8);
    }, card);
    return () => ctx.revert();
  }, [post.cover]);

  return (
    <article ref={cardRef} className="blog-listing-card">
      {/* Hover lift lives on the link: GSAP owns the article's transform. Sidebar accent layered under lift. */}
      <a
        href={`/blog/${post.slug}`}
        className="group block rounded-[var(--radius-card)] outline-hidden transition-all duration-200 hover:-translate-y-[3px] hover:border-[var(--border-25)] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
        aria-label={`${post.title} — ${post.tags.join(", ")}`}
      >
        <div
          className="relative overflow-hidden"
          style={{
            // Landscape covers like the reference, not the square homepage
            // card ratio.
            aspectRatio: "4 / 3",
            borderRadius: "var(--radius-card)",
            border: "var(--border-width) solid var(--border-20)",
            background: "var(--surface-raised)",
          }}
        >
          {post.cover ? (
            <>
              <div
                ref={mediaRef}
                className="absolute inset-x-0 top-[-10%] h-[120%]"
              >
                <Image
                  src={post.cover}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  onLoad={() => getScrollTrigger().refresh()}
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
      // Sidebar SidebarMenuButton hover layered on: hover/active share accent
      // bg + accent-foreground, focus-visible ring, disabled handling.
      className={`inline-flex cursor-pointer items-center font-medium transition-colors duration-200 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate ${
        selected
          ? "data-active:bg-[var(--surface-raised-hover)] data-active:text-[var(--text-100)] data-active:font-medium"
          : "hover:bg-[var(--surface-raised-hover)] hover:text-[var(--text-100)] hover:border-[var(--border-25)] active:bg-[var(--surface-raised-hover)] active:text-[var(--text-100)]"
      }`}
      style={
        selected
          ? {
              background: "var(--fill)",
              color: "var(--on-fill)",
              border: "1px solid var(--fill)",
              borderRadius: "var(--radius-pill)",
              padding: "10px 18px",
              fontSize: 13,
            }
          : {
              background: "var(--surface-raised-hover)",
              color: "var(--text-70)",
              border: "1px solid transparent",
              borderRadius: "var(--radius-pill)",
              padding: "10px 18px",
              fontSize: 13,
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
        {/* Split hero like the reference: title left, description and tag
            filters right-aligned in the second column. Stacked on mobile. */}
        <div
          ref={introRef}
          className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start"
        >
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
            thoughts
            <br />
            <span className="whitespace-nowrap">and notes</span>
          </h1>

          <div>
            <p
              className="lg:text-right"
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

            {/* Tag-only row like the reference — clicking the active tag
                again clears the filter. */}
            <div
              role="group"
              aria-label="Filter posts by tag"
              className="mt-6 flex flex-wrap gap-2 lg:justify-end"
            >
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
        </div>

        {visible.length > 0 ? (
          <div
            ref={gridRef}
            key={activeTag ?? "all"}
            aria-live="polite"
            className={`${hasFiltered ? "animate-fade-rise " : ""}mt-16 grid grid-cols-1 items-start gap-x-6 gap-y-12 md:grid-cols-2 lg:mt-24`}
          >
            {/* Second-column cards sit lower, like the reference stagger.
                Offset on a wrapper so GSAP keeps owning the card node. */}
            {visible.map((post, index) => (
              <div
                key={post.slug}
                className={index % 2 === 1 ? "md:mt-20" : undefined}
              >
                <ListingCard post={post} />
              </div>
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
