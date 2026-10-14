"use client";

import { motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon } from "@hugeicons/core-free-icons";
import { ShimmeringText } from "@/components/animate-ui/primitives/texts/shimmering";

// Direct PDF export — 1-click download.
const CV_URL =
  "https://docs.google.com/document/d/1F5Wwtfk3tith4xuirGR-RDJoenlqu0k2/export?format=pdf";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Intro"
      className="w-full"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div
        className="container-shell grid grid-cols-1 items-center gap-12 py-14 md:py-20"
        style={{
          minHeight: "calc(100dvh - var(--nav-h))",
          paddingLeft: 0,
        }}
      >
        {/* Left — copy */}
        <motion.div
          variants={container}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="flex w-full max-w-none flex-col items-start"
        >
          <motion.p variants={item} className="mono-label">
            Software Engineer
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-4 font-extrabold"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 800,
              fontSize: "clamp(2.05rem, 1.6rem + 2.2vw, 3rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "var(--text-100)",
            }}
          >
            <span className="md:whitespace-nowrap">
              Building scalable systems.
            </span>
            <br />
            <ShimmeringText
              text="Writing clean code."
              wave={false}
              duration={4}
            />
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl"
            style={{
              color: "var(--text-70)",
              fontSize: 19,
              lineHeight: 1.9,
            }}
          >
            Full-stack engineer obsessed with performance, maintainability,
            and elegant solutions. From APIs to frontends, I ship
            production-ready software.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <motion.a
              href="#work"
              className="inline-flex items-center font-medium"
              style={{
                height: 52,
                paddingInline: 28,
                background: "var(--fill)",
                color: "var(--on-fill)",
                borderRadius: "var(--radius-btn)",
                fontSize: 16,
                gap: 10,
              }}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
            >
              See my work
            </motion.a>
            <motion.a
              href={CV_URL}
              target={CV_URL.startsWith("http") ? "_blank" : undefined}
              rel={CV_URL.startsWith("http") ? "noreferrer" : undefined}
              className="inline-flex items-center font-medium"
              style={{
                height: 52,
                paddingInline: 28,
                background: "transparent",
                color: "var(--ink)",
                border: "2px solid var(--ink)",
                borderRadius: "var(--radius-btn)",
                fontSize: 16,
                gap: 10,
              }}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
            >
              Download CV
              <HugeiconsIcon
                icon={Download01Icon}
                size={18}
                strokeWidth={2}
              />
            </motion.a>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
