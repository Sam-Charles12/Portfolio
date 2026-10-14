"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import ThemeToggle from "@/components/theme-toggle";
import MenuDrawer from "@/components/menu-drawer";
import { TextReveal } from "@/components/ui/cascade-text";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <>
      <header
        className="shrink-0"
        style={{
          paddingTop: 40,
          paddingBottom: 32,
        }}
        data-nav
      >
        <div
          className="flex items-center justify-between"
          style={{
            minHeight: "var(--nav-h)",
            paddingInline: "clamp(20px, 6vw, 100px)",
            paddingBottom: 20,
          }}
        >
          <a
            href="#top"
            className="font-logo text-2xl font-semibold tracking-tight md:text-3xl"
          >
            carles
          </a>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <motion.a
              href="#contact"
              className="inline-flex items-center font-semibold"
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
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
          >
            <TextReveal
              as="span"
              text="Say Hello"
              fontSize="16px"
              color="var(--ink)"
              hoverColor="var(--ink)"
              style={{ padding: 0 }}
            />
            <motion.span
              className="inline-flex"
              whileHover={reduceMotion ? undefined : { x: 3, y: -3 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={18}
                strokeWidth={2}
              />
            </motion.span>
          </motion.a>
          {/* Hamburger lives in the fixed overlay below — keep its 48px
              footprint here so the Say Hello pill keeps its right offset. */}
          <span aria-hidden="true" style={{ width: 48, height: 48 }} />
        </div>
      </div>
    </header>

    <div
      className="fixed z-50"
      data-menu-toggle-fixed
      style={{
        top: 40,
        right: "clamp(20px, 6vw, 100px)",
      }}
    >
      <motion.button
        data-menu-toggle
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => {
          if (open) {
            window.dispatchEvent(new CustomEvent("menu-close-request"));
          } else {
            setOpen(true);
          }
        }}
        className="inline-flex items-center justify-center"
        style={
          open
            ? {
                width: 48,
                height: 48,
                background: "transparent",
                color: "var(--ink)",
                border: "1.5px solid var(--ink)",
                borderRadius: "50%",
              }
            : {
                width: 48,
                height: 48,
                background: "var(--fill)",
                color: "var(--on-fill)",
                borderRadius: "50%",
              }
        }
        whileHover={reduceMotion ? undefined : { y: -2, rotate: open ? -4 : 4 }}
        whileTap={reduceMotion ? undefined : { scale: 0.92 }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
      >
        <motion.span
          key={open ? "close" : "menu"}
          initial={reduceMotion ? false : { rotate: -90, opacity: 0 }}
          animate={reduceMotion ? undefined : { rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 430, damping: 24 }}
          className="inline-flex"
        >
          <HugeiconsIcon
            icon={open ? Cancel01Icon : Menu01Icon}
            size={18}
            strokeWidth={open ? 2 : 1.5}
          />
        </motion.span>
      </motion.button>
    </div>

    {open && <MenuDrawer onClose={() => setOpen(false)} />}
  </>
);
}
