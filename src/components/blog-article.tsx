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
  shorten,
  type Post,
  type PostBlock,
  type PostEmbed,
} from "@/lib/posts";

type BlogArticleProps = {
  post: Post;
  previous: Post | null;
  next: Post | null;
};

/** Reading column: wider than `--container-narrow`, sized for body text. */
const MEASURE = 720;

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

function EmbedCard({ embed }: { embed: PostEmbed }) {
  return (
    <aside
      className="group/embed grid gap-5 md:grid-cols-[minmax(0,210px)_minmax(0,1fr)] md:items-center md:gap-7"
      style={{
        padding: "clamp(16px, 2.2vw, 24px)",
        border: "var(--border-width) solid var(--border-20)",
        borderRadius: "var(--radius-card-sm)",
        background: "var(--surface-raised)",
      }}
    >
      <div
        className="bg-blueprint-grid relative flex items-center justify-center overflow-hidden"
        style={{
          aspectRatio: "4 / 3",
          borderRadius: "var(--radius-thumb)",
          border: "var(--border-width) solid var(--border-20)",
          background: "var(--surface-page)",
        }}
      >
        {embed.image ? (
          <Image
            src={embed.image}
            alt=""
            fill
            sizes="(min-width: 768px) 210px, 100vw"
            className="object-cover [filter:var(--img-filter)] transition-[filter] duration-500 group-hover/embed:[filter:var(--img-filter-hover)]"
          />
        ) : (
          <span className="mono-label" aria-hidden="true">
            project shot
          </span>
        )}
      </div>

      <div>
        <h3
          className="font-semibold uppercase"
          style={{
            color: "var(--text-100)",
            fontSize: "var(--text-card-title)",
            lineHeight: 1.15,
            letterSpacing: "var(--tracking-card)",
          }}
        >
          {embed.title}
        </h3>
        <p
          className="mt-2"
          style={{
            color: "var(--text-70)",
            fontSize: "var(--text-small)",
            lineHeight: 1.6,
          }}
        >
          {embed.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p
            className="mono-label"
            style={{ fontSize: "var(--text-mono-tag)" }}
          >
            {embed.stack.join(" · ")}
          </p>
          <a
            href={embed.href}
            aria-label={`Open ${embed.title}`}
            className="inline-flex shrink-0 items-center justify-center transition-colors duration-200 group-hover/embed:bg-ink group-hover/embed:text-bg"
            style={{
              width: "var(--icon-btn-size)",
              height: "var(--icon-btn-size)",
              color: "var(--text-100)",
              border: "var(--border-width) solid var(--border-25)",
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
          paddingBottom: 14,
          borderBottom: "var(--border-width) solid var(--border-15)",
          color: "var(--text-100)",
          fontSize: "clamp(1.5rem, 1.1rem + 1.4vw, 2.125rem)",
          lineHeight: 1.15,
          letterSpacing: "var(--tracking-section)",
        }}
      >
        {block.text}
      </h2>
    );
  }

  if (block.type === "embed") {
    return (
      <div style={{ marginTop: first ? 0 : "clamp(32px, 4vw, 44px)" }}>
        <EmbedCard embed={block.embed} />
      </div>
    );
  }

  return (
    <p
      style={{
        marginTop: first ? 0 : "clamp(18px, 2vw, 24px)",
        color: "var(--text-70)",
        fontSize: "calc(var(--text-body) + 1px)",
        lineHeight: 1.75,
        letterSpacing: "var(--tracking-body)",
        textWrap: "pretty",
      }}
    >
      <RichText text={block.text} />
    </p>
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
        className={`mono-label inline-flex items-center gap-2 ${
          isNext ? "justify-self-end" : "justify-self-start"
        }`}
        style={{ color: "var(--text-35)" }}
      >
        {!isNext && (
          <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
        )}
        {isNext ? "no newer post" : "no older post"}
        {isNext && (
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
        )}
      </span>
    );
  }

  return (
    <a
      href={`/blog/${post.slug}`}
      className={`group inline-flex items-center gap-2 transition-colors duration-200 ${
        isNext ? "justify-self-end" : "justify-self-start"
      }`}
      style={{ color: "var(--text-70)", fontSize: "var(--text-small)" }}
    >
      {!isNext && (
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          size={15}
          strokeWidth={2}
          className="shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
        />
      )}
      <span className="max-w-[34ch] truncate transition-colors duration-200 group-hover:text-ink">
        {shorten(post.title, 30)}
      </span>
      {isNext && (
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={15}
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
            href="/#writing"
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
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-6">
              <p className="post-hero-fade mono-label">
                {formatPostDate(post.date)} · {post.readingMinutes} min read
              </p>

              <h1
                className="post-hero-fade mt-5 font-medium lowercase"
                style={{
                  color: "var(--text-100)",
                  fontSize: "clamp(2.25rem, 1.35rem + 3.4vw, 4.25rem)",
                  lineHeight: 1.03,
                  letterSpacing: "-0.03em",
                  textWrap: "balance",
                }}
              >
                {post.title}
              </h1>

              <p
                className="post-hero-fade mt-6 max-w-[46ch]"
                style={{
                  color: "var(--text-70)",
                  fontSize: "calc(var(--text-body) + 2px)",
                  lineHeight: 1.6,
                }}
              >
                {post.dek}
              </p>

              <ul className="post-hero-fade mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <span
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
                  </li>
                ))}
              </ul>
            </div>

            <figure
              ref={coverRef}
              className="post-hero-fade lg:col-span-6"
              style={{ margin: 0 }}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  aspectRatio: "4 / 3",
                  borderRadius: "var(--radius-card)",
                  border: "var(--border-width) solid var(--border-20)",
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
                      className="object-cover [filter:var(--img-filter)]"
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
              </div>
            </figure>
          </div>
        </header>

        <div className="container-shell pb-20 md:pb-28">
          <div
            className="post-body mx-auto px-4 md:px-0"
            style={{ maxWidth: MEASURE }}
          >
            {post.blocks.map((block, index) => (
              <Block key={index} block={block} first={index === 0} />
            ))}

            <nav
              aria-label="More posts"
              className="mt-14 grid grid-cols-1 items-center gap-6 pt-8 sm:grid-cols-3"
              style={{ borderTop: "var(--border-width) solid var(--border-15)" }}
            >
              <NeighbourLink post={previous} direction="previous" />
              <a
                href="/#writing"
                className="mono-label underline decoration-from-font underline-offset-4 transition-colors duration-200 hover:text-ink sm:justify-self-center"
                style={{ color: "var(--text-50)" }}
              >
                back to all notes
              </a>
              <NeighbourLink post={next} direction="next" />
            </nav>
          </div>
        </div>
      </article>
    </main>
  );
}
