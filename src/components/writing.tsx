"use client";

import { useEffect, useId, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import {
  gsapSetup,
  prefersReducedMotion,
  blurFadeIn,
  parallaxY,
  getScrollTrigger,
} from "@/lib/gsap";
import { ArrowLink } from "@/components/ui/arrow-link";
// Posts live in lib/posts so the cards and the /blog/[slug] reader never
// drift apart. Placeholder copy until the real articles are written.
import { POSTS, type Post } from "@/lib/posts";

function BlogCard({ post }: { post: Post }) {
  const cardRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  // Unique SVG path id per card — textPath hrefs must not collide.
  const circleId = useId().replace(/:/g, "read");

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
    <article ref={cardRef} className="blog-card">
      {/* Hover lift lives on the link: GSAP owns the article's transform. */}
      <a
        href={`/blog/${post.slug}`}
        className="group block rounded-[var(--radius-card)] outline-hidden transition-all duration-200 hover:-translate-y-[3px] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
        aria-label={`${post.title} — ${post.tags.join(", ")}`}
      >
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "var(--blog-media-ratio)",
            borderRadius: "var(--radius-card)",
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
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
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
              {/* Hover deepening — fades in over the scrim. */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 motion-reduce:transition-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0, 0, 0, 0.35) 0%, transparent 55%)",
                }}
                aria-hidden="true"
              />
              {/* Orbiting read badge — circular mono text spinning
                  around an arrow, springs in with the zoom. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center motion-reduce:hidden"
              >
                <span
                  className="relative flex h-28 w-28 scale-75 items-center justify-center opacity-0 blur-[3px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100 group-hover:blur-none"
                  style={{
                    background: "var(--fill)",
                    color: "var(--on-fill)",
                    borderRadius: "999px",
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite]"
                  >
                    <defs>
                      <path
                        id={circleId}
                        d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                        fill="none"
                      />
                    </defs>
                    <text
                      fontSize="10"
                      letterSpacing="1"
                      fill="var(--on-fill)"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <textPath href={`#${circleId}`} textLength={225}>
                        READ ARTICLE • READ ARTICLE •
                      </textPath>
                    </text>
                  </svg>
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={26}
                    strokeWidth={2}
                  />
                </span>
              </div>
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
          className="mt-5 font-medium transition-colors duration-300 group-hover:[--blog-title:var(--text-100)]"
          style={{
            color: "var(--blog-title, var(--text-70))",
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
              thoughts
              <br />
              <span className="whitespace-nowrap">and notes</span>
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
              href="/blog"
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
