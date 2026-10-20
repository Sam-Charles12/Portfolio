"use client";

import { useState } from "react";
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
          className="container-shell flex items-center justify-between"
          style={{
            minHeight: "var(--nav-h)",
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
            <a
              href="#contact"
              className="inline-flex items-center font-semibold transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
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
            >
            <TextReveal
              as="span"
              text="Say Hello"
              fontSize="16px"
              color="var(--ink)"
              hoverColor="var(--ink)"
              style={{ padding: 0 }}
            />
            <span className="inline-flex transition-transform duration-200 hover:translate-x-[3px] hover:-translate-y-[3px]">
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={18}
                strokeWidth={2}
              />
            </span>
          </a>
          {/* Hamburger lives in the fixed overlay below — keep its 48px
              footprint (plus its 12px left margin) here so the Say Hello
              pill keeps its right offset. */}
          <span
            aria-hidden="true"
            style={{ width: 48, height: 48, marginLeft: 4 }}
          />
        </div>
      </div>
    </header>

    {/* Fixed overlay, but docked to the nav row via the same centered
        container-shell — so it lines up on every viewport (vw-based
        offsets drift by half the scrollbar on Windows) and stays put
        on scroll. Inner mirrors the row geometry so the 48px circle
        centers exactly with the Say Hello pill. */}
    <div
      className="pointer-events-none fixed inset-x-0 z-50"
      data-menu-toggle-fixed
      style={{ top: 40 }}
    >
      <div
        className="container-shell flex items-center justify-end"
        style={{
          minHeight: "var(--nav-h)",
          paddingBottom: 20,
        }}
      >
      <button
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
        className="pointer-events-auto inline-flex items-center justify-center transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.92]"
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
      >
        <span
          key={open ? "close" : "menu"}
          className="theme-icon inline-flex"
        >
          <HugeiconsIcon
            icon={open ? Cancel01Icon : Menu01Icon}
            size={18}
            strokeWidth={open ? 2 : 1.5}
          />
        </span>
      </button>
      </div>
    </div>

    {open && <MenuDrawer onClose={() => setOpen(false)} />}
  </>
);
}
