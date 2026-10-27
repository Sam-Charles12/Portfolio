"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
  parallaxY,
  prefersReducedMotion,
} from "@/lib/gsap";
import {
  formatPostDate,
  type Post,
  type PostBlock,
  type PostEmbed,
} from "@/lib/posts";

type BlogArticleProps = {
  post: Post;
  previous: Post | null;
  next: Post | null;
};

/** Reading column, reference-sized: 896px less 24px side padding = 848px of text. */
const MEASURE = 896;

/**
 * Body copy supports **bold** inline, rendered as heavier ink rather than
 * a second colour — the palette only has the one.
 */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong
            key={index}
            className="font-semibold"
            style={{ color: "var(--text-100)" }}
          >
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * Inline project card. Borderless like the reference: the shot bleeds to
 * the column edge and the copy sits beside it, so the image carries the
 * shape instead of a drawn box.
 */
function EmbedCard({ embed }: { embed: PostEmbed }) {
  return (
    <aside className="group/embed grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
      <div
        className="relative min-h-64 overflow-hidden md:h-full"
        style={{
          borderRadius: "clamp(20px, 1.8vw, 28px)",
          background: "var(--surface-raised)",
        }}
      >
        {embed.image ? (
          <Image
            src={embed.image}
            alt=""
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover/embed:scale-[1.02]"
          />
        ) : (
          <div className="bg-blueprint-grid absolute inset-0 flex items-center justify-center">
            <span className="mono-label" aria-hidden="true">
              project shot
            </span>
          </div>
        )}
      </div>

      <div className="md:pl-2">
        <h3
          className="font-semibold uppercase"
          style={{
            color: "var(--text-100)",
            fontSize: 24,
            lineHeight: 1.35,
            letterSpacing: "-0.025em",
          }}
        >
          {embed.title}
        </h3>
        <p
          className="mt-2 line-clamp-3"
          style={{
            color: "var(--text-70)",
            fontSize: "var(--text-small)",
            lineHeight: 1.6,
          }}
        >
          {embed.description}
        </p>

        <div className="mt-6 flex items-end justify-between gap-4">
          <ul className="flex flex-wrap gap-2">
            {embed.stack.map((item) => (
              <li
                key={item}
                className="inline-flex items-center font-medium"
                style={{
                  background: "var(--surface-raised-hover)",
                  color: "var(--text-70)",
                  borderRadius: "var(--radius-pill)",
                  padding: "5px 12px",
                  fontSize: 12,
                }}
              >
                {item}
              </li>
            ))}
          </ul>
          <a
            href={embed.href}
            aria-label={`Open ${embed.title}`}
            className="inline-flex shrink-0 items-center justify-center transition-colors duration-200 group-hover/embed:bg-ink group-hover/embed:text-bg"
            style={{
              width: 40,
              height: 40,
              color: "var(--text-100)",
              border: "2px solid var(--ink)",
              borderRadius: "var(--radius-pill)",
            }}
          >
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              size={16}
              strokeWidth={2}
            />
          </a>
        </div>
      </div>
    </aside>
  );
}

function Block({ block, first }: { block: PostBlock; first: boolean }) {
  if (block.type === "heading") {
    return (
      <h2
        className="font-semibold lowercase"
        style={{
          marginTop: first ? 0 : "clamp(40px, 5vw, 56px)",
          color: "var(--text-100)",
          fontSize: "clamp(1.875rem, 1.4rem + 1.6vw, 2.25rem)",
          lineHeight: 1.25,
          letterSpacing: "var(--tracking-section)",
          textDecoration: "underline",
          textDecorationColor: "color-mix(in srgb, var(--ink) 45%, transparent)",
          textDecorationThickness: "1px",
          textUnderlineOffset: "5px",
        }}
      >
        {block.text}
      </h2>
    );
  }

  if (block.type === "embed") {
    return (
      <div style={{ marginTop: first ? 0 : 40, marginBottom: 40 }}>
        <EmbedCard embed={block.embed} />
      </div>
    );
  }

  return (
    <p
      style={{
        marginTop: first ? 0 : 20,
        color: "var(--text-82)",
        fontSize: "calc(var(--text-body) + 1px)",
        lineHeight: 2,
        letterSpacing: "var(--tracking-body)",
        textWrap: "pretty",
      }}
    >
      <RichText text={block.text} />
    </p>
  );
}

function TagChip({ tag, onImage }: { tag: string; onImage?: boolean }) {
  return (
    <span
      className="inline-flex items-center font-medium"
      style={{
        background: "var(--fill)",
        color: "var(--on-fill)",
        borderRadius: "var(--radius-pill)",
        padding: onImage ? "8px 16px" : "6px 14px",
        fontSize: 12,
        // Both variants land on the reference's 28px pill height.
        lineHeight: onImage ? 1 : "16px",
      }}
    >
      {tag}
    </span>
  );
}

function NeighbourLink({
  post,
  direction,
}: {
  post: Post | null;
  direction: "previous" | "next";
}) {
  const isNext = direction === "next";

  if (!post) {
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
        {isNext ? "no newer post" : "no older post"}
        {isNext && (
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
        )}
      </span>
    );
  }

  return (
    <a
      href={`/blog/${post.slug}`}
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
        {post.title}
      </span>
      {isNext && (
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={16}
          strokeWidth={2}
          className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
        />
      )}
    </a>
  );
}

export default function BlogArticle({
  post,
  previous,
  next,
}: BlogArticleProps) {
  const rootRef = useRef<HTMLElement>(null);
  const coverRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();

    const context = gsap.context(() => {
      // Header plays on load, no scroll trigger.
      blurFadeIn(Array.from(root.querySelectorAll(".post-hero-fade")), {
        trigger: null,
        duration: 1.1,
        stagger: 0.09,
        y: 18,
        reversible: false,
      });

      // Each body block reveals on its own, so a long post keeps handing
      // out new text instead of fading the whole column in at once.
      root
        .querySelectorAll(".post-body > *")
        .forEach((el) =>
          blurFadeIn(el, { duration: 1, y: 24, start: "top bottom-=50px" }),
        );

      if (mediaRef.current && coverRef.current) {
        parallaxY(mediaRef.current, coverRef.current, -3, 3);
      }
    }, root);

    return () => context.revert();
  }, []);

  return (
    <main ref={rootRef} className="flex-1">
      <article>
        <div className="container-shell pt-6 md:pt-10">
          <a
            href="/blog"
            className="group inline-flex items-center gap-2"
            style={{ color: "var(--text-70)", fontSize: "var(--text-small)" }}
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={15}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span className="transition-colors duration-200 group-hover:text-ink">
              back to blogs
            </span>
          </a>
        </div>

        <header className="container-shell pb-14 pt-10 md:pb-20 md:pt-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-x-10">
            <div>
              <p
                className="post-hero-fade mono-label flex flex-wrap items-center gap-2"
                style={{ letterSpacing: "0.16em", fontWeight: 500 }}
              >
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <span
                  aria-hidden="true"
                  className="size-1 rounded-full"
                  style={{ background: "var(--text-35)" }}
                />
                <span>{post.readingMinutes} min read</span>
              </p>

              <h1
                className="post-hero-fade mt-5 font-semibold lowercase"
                style={{
                  color: "var(--text-100)",
                  fontSize: "clamp(2.25rem, 1.35rem + 3.6vw, 4.5rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.055em",
                  textWrap: "balance",
                }}
              >
                {post.title}
              </h1>

              <p
                className="post-hero-fade mt-5"
                style={{
                  color: "var(--text-70)",
                  fontSize: "calc(var(--text-body) + 3px)",
                  lineHeight: 1.625,
                  maxWidth: 672,
                }}
              >
                {post.dek}
              </p>

              <ul className="post-hero-fade mt-7 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <TagChip tag={tag} />
                  </li>
                ))}
              </ul>
            </div>

            <figure ref={coverRef} className="post-hero-fade" style={{ margin: 0 }}>
              <div
                className="relative overflow-hidden"
                style={{
                  minHeight: "clamp(352px, 30vw, 488px)",
                  borderRadius: "clamp(28px, 2.75vw, 44px)",
                  background: "var(--surface-raised)",
                }}
              >
                {post.cover ? (
                  <div
                    ref={mediaRef}
                    className="absolute inset-x-0 top-[-4%] h-[108%]"
                  >
                    <Image
                      src={post.cover}
                      alt={post.coverAlt ?? ""}
                      fill
                      priority
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="bg-blueprint-grid absolute inset-0 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <span className="mono-label">cover image</span>
                  </div>
                )}

                <div className="absolute inset-x-5 bottom-5 z-10 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <TagChip key={tag} tag={tag} onImage />
                  ))}
                </div>
              </div>
            </figure>
          </div>
        </header>

        <div className="container-shell pb-20 md:pb-28">
          <div
            className="post-body mx-auto px-4 md:px-6"
            style={{ maxWidth: MEASURE }}
          >
            {post.blocks.map((block, index) => (
              <Block key={index} block={block} first={index === 0} />
            ))}

            <nav aria-label="More posts" className="mt-14 pt-10">
              <div
                className="mb-6"
                style={{ height: 1, background: "var(--border-15)" }}
              />
              <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-3">
                <NeighbourLink post={previous} direction="previous" />
                <a
                  href="/blog"
                  className="justify-self-start rounded-full transition-colors duration-200 hover:text-ink sm:justify-self-center"
                  style={{ color: "var(--text-50)", fontSize: 16 }}
                >
                  back to all notes
                </a>
                <NeighbourLink post={next} direction="next" />
              </div>
            </nav>
          </div>
        </div>
      </article>
    </main>
  );
}
