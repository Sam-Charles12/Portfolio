'use client';

import { useState, type MouseEvent as ReactMouseEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { FlowButton } from "@/components/ui/flow-button";

/** Codebase ease-out token, as a framer-motion cubic-bezier. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASE,
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
};

const numberVariants: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * 40,
    y: 15,
    rotate: direction * 5,
  }),
  visible: {
    opacity: 0.7,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: EASE,
    },
  },
};

const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.4,
      ease: EASE,
    },
  },
};

/** Opposing two-axis drift — clearly visible, still calm backdrop motion. */
const DRIFT_A = {
  y: [0, -30, 0],
  x: [0, 14, 0],
  transition: { duration: 9, ease: "easeInOut" as const, repeat: Infinity },
};
const DRIFT_B = {
  y: [0, 30, 0],
  x: [0, -14, 0],
  transition: {
    duration: 12,
    ease: "easeInOut" as const,
    repeat: Infinity,
    delay: 1.5,
  },
};

const ghostVariants: Variants = {
  hidden: {
    scale: 0.9,
    opacity: 0,
    y: 15,
    rotate: -5,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: EASE,
    },
  },
  hover: {
    scale: 1.1,
    y: -10,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut",
      rotate: {
        duration: 2,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  },
  floating: {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  },
};

/**
 * 404 hero — the ghost is the zero in 4👻4. One orchestrated entrance,
 * a floating ghost with a hover wiggle, then two ways back. Themed via
 * the site tokens so it reads right in dark and light mode.
 */
export function GhostNotFound() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  // Cursor parallax for the backdrop numerals — springs keep it floaty.
  // Touch and reduced-motion visitors keep the drift loop only. Read
  // once up front: it only gates a handler, never the rendered output.
  const [finePointer] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches,
  );
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const ax = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const ay = useTransform(sy, [-0.5, 0.5], [14, -14]);
  const bx = useTransform(sx, [-0.5, 0.5], [-26, 26]);
  const by = useTransform(sy, [-0.5, 0.5], [-20, 20]);

  const onMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !finePointer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const goBack = () => {
    // History is empty on a direct hit (or a single-entry stack) — fall
    // back to home instead of stranding the visitor.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16 md:py-24"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Faint blueprint grid, fading out toward the edges. */}
        <div
          aria-hidden="true"
          className="bg-blueprint-grid pointer-events-none absolute inset-0"
          style={{
            opacity: 0.6,
            maskImage:
              "radial-gradient(65% 60% at 50% 45%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(65% 60% at 50% 45%, black 30%, transparent 75%)",
          }}
        />

        {/* Faint backdrop numerals — the reference's ghost layer. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden select-none"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            className="font-display absolute -left-8 top-8 font-semibold uppercase"
            style={{
              fontSize: "26vw",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "color-mix(in srgb, var(--ink) 8%, transparent)",
            }}
            animate={DRIFT_A}
          >
            <motion.span style={{ x: ax, y: ay, display: "inline-block" }}>
              404
            </motion.span>
          </motion.span>
          <motion.span
            className="font-display absolute -right-8 bottom-8 font-semibold uppercase"
            style={{
              fontSize: "22vw",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "color-mix(in srgb, var(--ink) 10%, transparent)",
            }}
            animate={DRIFT_B}
          >
            <motion.span style={{ x: bx, y: by, display: "inline-block" }}>
              404
            </motion.span>
          </motion.span>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            className="relative text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.p
              className="mono-label mb-8 flex items-center justify-center gap-3 md:mb-10"
              variants={itemVariants}
              style={{ fontWeight: 500 }}
            >
              <span>error 404 — route not found</span>
              <span
                aria-hidden="true"
                className="animate-blink inline-block"
                style={{
                  width: 8,
                  height: 16,
                  background: "var(--ink)",
                }}
              />
            </motion.p>

            <div className="mb-8 flex items-center justify-center gap-4 md:mb-10 md:gap-6">
              <motion.span
                className="font-display font-extrabold select-none"
                style={{
                  fontSize: "clamp(5rem, 4rem + 8vw, 7.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: "var(--ink)",
                }}
                variants={numberVariants}
                custom={-1}
              >
                4
              </motion.span>
              <motion.div
                className="relative"
                variants={ghostVariants}
                whileHover="hover"
                animate={["visible", "floating"]}
              >
                {/* Soft halo so the white sheet reads on both themes. */}
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-1/2 -z-10 block -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: "130%",
                    aspectRatio: "1",
                    background:
                      "radial-gradient(circle, color-mix(in srgb, var(--ink) 14%, transparent) 0%, transparent 65%)",
                  }}
                />
                <Image
                  src="/ghost.png"
                  alt="A sheet ghost floating between the digits"
                  width={161}
                  height={200}
                  className="h-[80px] w-auto object-contain select-none md:h-[120px]"
                  draggable={false}
                  priority
                />
              </motion.div>
              <motion.span
                className="font-display font-extrabold select-none"
                style={{
                  fontSize: "clamp(5rem, 4rem + 8vw, 7.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: "var(--ink)",
                }}
                variants={numberVariants}
                custom={1}
              >
                4
              </motion.span>
            </div>

            <motion.h1
              className="font-display font-bold text-balance select-none"
              style={{
                fontSize: "clamp(1.875rem, 1.4rem + 2.4vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "var(--tracking-section)",
                color: "var(--text-100)",
              }}
              variants={itemVariants}
            >
              It worked on my machine!
            </motion.h1>

            <motion.p
              className="mx-auto mt-4 max-w-xl text-balance select-none md:mt-5"
              style={{
                color: "var(--text-70)",
                fontSize: "calc(var(--text-body) + 1px)",
                lineHeight: 1.625,
              }}
              variants={itemVariants}
            >
              Don&apos;t worry, you haven&apos;t broken anything. This page
              just decided to take an unscheduled break.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10"
              variants={itemVariants}
            >
              <FlowButton text="Back home" href="/" />
              <button
                type="button"
                onClick={goBack}
                className="inline-flex h-12 cursor-pointer items-center px-8 font-semibold transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
                style={{
                  background: "transparent",
                  color: "var(--ink)",
                  border: "2px solid var(--ink)",
                  borderRadius: "var(--radius-pill)",
                  fontSize: 15,
                }}
              >
                Go back
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

const MARQUEE_ITEMS = [
  "it worked on my machine!",
  "route hidden in .gitignore",
  "compiler cannot find this path",
  "searching... timeout",
  "wrong url, right portfolio",
  "404",
];

function NotFoundMarqueeHalf({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-12 pr-12 md:gap-16 md:pr-16"
      aria-hidden={hidden || undefined}
    >
      {MARQUEE_ITEMS.map((item, index) => {
        const outline = index % 2 === 1;
        return (
          <span
            key={item}
            className="flex shrink-0 items-center gap-12 md:gap-16"
          >
            <span
              className="font-display font-semibold whitespace-nowrap lowercase"
              style={
                outline
                  ? {
                      fontSize: "clamp(1.75rem, 1.25rem + 2vw, 2.75rem)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      color: "transparent",
                      WebkitTextStroke: "1.5px var(--text-50)",
                    }
                  : {
                      fontSize: "clamp(1.75rem, 1.25rem + 2vw, 2.75rem)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      color: "var(--text-70)",
                    }
              }
            >
              {item}
            </span>
            <span
              aria-hidden="true"
              className="font-mono shrink-0"
              style={{
                fontSize: "clamp(1.25rem, 1rem + 0.75vw, 1.625rem)",
                color: "var(--text-35)",
              }}
            >
              {"//"}
            </span>
          </span>
        );
      })}
    </div>
  );
}

/**
 * Dev-joke ticker along the bottom. Solid words alternate with outlined
 * ones for rhythm, the edges fade so it bleeds off-screen, and hovering
 * pauses the crawl so each joke can be read.
 */
export function NotFoundMarquee() {
  return (
    <section
      aria-label="Page not found divider"
      className="group w-full overflow-hidden"
      style={{
        paddingTop: 32,
        paddingBottom: 44,
        borderTop: "1px solid var(--border-15)",
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div className="animate-marquee-slow flex w-max items-center group-hover:[animation-play-state:paused]">
        <NotFoundMarqueeHalf />
        <NotFoundMarqueeHalf hidden />
      </div>
    </section>
  );
}

