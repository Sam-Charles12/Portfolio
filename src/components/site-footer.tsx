"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import gsap from "gsap";
import { HugeiconsIcon } from "@hugeicons/react";
import { Call02Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { siGithub, siWhatsapp, siX } from "simple-icons";
import { blurFadeIn, gsapSetup, prefersReducedMotion } from "@/lib/gsap";
import {
  EMAIL,
  EMAIL_HREF,
  GITHUB_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_URL,
  X_URL,
} from "@/lib/site";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#work" },
  { label: "Blog", href: "#writing" },
  { label: "Contact", href: "#contact" },
] as const;

const QUOTES = [
  {
    text: "Stay hungry, stay foolish.",
    author: "Steve Jobs",
  },
  {
    text: "The most important conversations you'll ever have are the ones you'll have with yourself.",
    author: "David Goggins",
  },
  {
    text: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
  },
  {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
  },
] as const;

const SOCIALS: { label: string; href: string; icon: { path: string } }[] = [
  { label: "GitHub", href: GITHUB_URL, icon: siGithub },
  { label: "X (Twitter)", href: X_URL, icon: siX },
  { label: "WhatsApp", href: WHATSAPP_URL, icon: siWhatsapp },
];

const VISITS_URL =
  "https://abacus.jasoncameron.dev/hit/carles-portfolio/site-visits";
const VISITS_STORAGE_KEY = "carles-visitor-count-v1";

let visitsPromise: Promise<number> | null = null;

function readCachedVisits(): number | null {
  try {
    const cached = window.sessionStorage.getItem(VISITS_STORAGE_KEY);
    if (cached === null) return null;
    const value = Number.parseInt(cached, 10);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

/** Count a visit once per tab session; cache the number so reloads don't
 *  inflate the public counter. A module-level promise keeps React's dev
 *  double-effect from hitting the endpoint twice. */
function loadVisits() {
  if (!visitsPromise) {
    visitsPromise = fetch(VISITS_URL, {
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Visitor counter unavailable");
        return response.json() as Promise<{ value?: unknown }>;
      })
      .then((data) => {
        const value = Number(data.value);
        if (!Number.isFinite(value)) throw new Error("Invalid visitor count");
        try {
          window.sessionStorage.setItem(VISITS_STORAGE_KEY, String(value));
        } catch {
          // Storage can be unavailable; the count still works for this load.
        }
        return value;
      });
  }
  return visitsPromise;
}

function ordinalSuffix(value: number): string {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return "th";
  switch (value % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

const CARD_CLASS =
  "rounded-[var(--radius-card-sm)] bg-[var(--surface-raised)]";

const padStyle = (padding: string): CSSProperties => ({ padding });

type FooterNavLinkProps = {
  label: string;
  href: string;
  active?: boolean;
};

/** Two stacked copies that roll up on hover/focus, like the reference. */
function FooterNavLink({ label, href, active = false }: FooterNavLinkProps) {
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group relative inline-block overflow-hidden font-medium transition-colors duration-200 ${
        active
          ? "text-ink"
          : "text-[color:var(--text-50)] hover:text-ink"
      }`}
      style={{
        fontSize: "clamp(1.75rem, 1.45rem + 1.1vw, 2.25rem)",
        lineHeight: 1.2,
        letterSpacing: "var(--tracking-card)",
      }}
    >
      <span className="block transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
      >
        {label}
      </span>
    </a>
  );
}

type SiteFooterProps = {
  hasPortrait: boolean;
};

export default function SiteFooter({ hasPortrait }: SiteFooterProps) {
  const rootRef = useRef<HTMLElement>(null);

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quotePaused, setQuotePaused] = useState(false);

  const [visits, setVisits] = useState<number | null>(null);
  const [visitState, setVisitState] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();

    const ctx = gsap.context(() => {
      blurFadeIn(Array.from(root.querySelectorAll<HTMLElement>(".footer-fade")), {
        trigger: root,
        duration: 1.1,
        stagger: 0.1,
        y: 28,
        reversible: false,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (quotePaused || prefersReducedMotion()) return;

    const id = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % QUOTES.length);
    }, 8000);

    return () => window.clearInterval(id);
  }, [quotePaused, quoteIndex]);

  useEffect(() => {
    let active = true;
    const cached = readCachedVisits();

    if (cached !== null) {
      // The cache can only be read on the client, so publish it after
      // mount (on a microtask) to keep the initial render server-matched.
      queueMicrotask(() => {
        if (!active) return;
        setVisits(cached);
        setVisitState("ready");
      });
      return () => {
        active = false;
      };
    }

    loadVisits().then(
      (value) => {
        if (!active) return;
        setVisits(value);
        setVisitState("ready");
      },
      () => {
        if (active) setVisitState("error");
      },
    );

    return () => {
      active = false;
    };
  }, []);

  const quote = QUOTES[quoteIndex];

  return (
    <footer
      ref={rootRef}
      role="contentinfo"
      aria-label="Site footer"
      className="w-full"
    >
      <div
        className="container-shell"
        style={{
          paddingTop: "clamp(8px, 1.5vw, 24px)",
          // Clear the fixed back-to-top button at the very end of the page.
          paddingBottom: "clamp(72px, 6vw, 88px)",
        }}
      >
        <div
          aria-hidden="true"
          className="footer-fade select-none text-center font-medium lowercase"
          style={{
            fontSize: "clamp(4.5rem, 3.5rem + 8vw, 9rem)",
            lineHeight: 1,
            letterSpacing: "-0.05em",
            color: "var(--text-100)",
            paddingBottom: "clamp(24px, 3.5vw, 48px)",
          }}
        >
          carles
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <nav
            aria-label="Footer navigation"
            className={`${CARD_CLASS} footer-fade flex flex-col`}
            style={padStyle("clamp(28px, 3.2vw, 48px)")}
          >
            <ul className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link, index) => (
                <li key={link.href}>
                  <FooterNavLink
                    label={link.label}
                    href={link.href}
                    active={index === 0}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-6">
            <a
              href={EMAIL_HREF}
              aria-label={`Email Carles at ${EMAIL}`}
              className={`${CARD_CLASS} footer-fade group flex items-center gap-4 transition-colors duration-200 hover:border-[color:var(--border-25)]`}
              style={padStyle("clamp(24px, 2.6vw, 40px)")}
            >
              <HugeiconsIcon
                icon={Mail01Icon}
                size={24}
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <span
                className="font-medium"
                style={{
                  fontSize: "clamp(1.25rem, 1.1rem + 0.4vw, 1.5rem)",
                }}
              >
                email me
              </span>
            </a>

            <a
              href={`tel:${PHONE_TEL}`}
              aria-label={`Call Carles at ${PHONE_DISPLAY}`}
              className={`${CARD_CLASS} footer-fade group flex items-center gap-4 transition-colors duration-200 hover:border-[color:var(--border-25)]`}
              style={padStyle("clamp(24px, 2.6vw, 40px)")}
            >
              <HugeiconsIcon
                icon={Call02Icon}
                size={24}
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <span
                className="font-medium"
                style={{
                  fontSize: "clamp(1.25rem, 1.1rem + 0.4vw, 1.5rem)",
                }}
              >
                {PHONE_DISPLAY}
              </span>
            </a>

            <div
              className={`${CARD_CLASS} footer-fade flex flex-1 flex-col`}
              style={padStyle("clamp(24px, 2.6vw, 40px)")}
            >
              <h2
                className="font-medium"
                style={{
                  fontSize: "clamp(1.25rem, 1.1rem + 0.4vw, 1.5rem)",
                  letterSpacing: "var(--tracking-card)",
                }}
              >
                my socials
              </h2>
              <ul className="mt-3 flex flex-col">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group/social -mx-2 flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors duration-200 hover:bg-[var(--surface-raised-hover)]"
                    >
                      <span
                        className="font-medium transition-transform duration-200 group-hover/social:translate-x-1"
                        style={{ fontSize: 18 }}
                      >
                        {social.label}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        width={20}
                        height={20}
                        fill="currentColor"
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover/social:scale-110"
                      >
                        <path d={social.icon.path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className={`${CARD_CLASS} footer-fade group flex flex-col`}
            style={padStyle("clamp(20px, 2.4vw, 36px)")}
            onMouseEnter={() => setQuotePaused(true)}
            onMouseLeave={() => setQuotePaused(false)}
            onFocusCapture={() => setQuotePaused(true)}
            onBlurCapture={() => setQuotePaused(false)}
          >
            <div
              className="relative mx-auto w-full overflow-hidden"
              style={{
                maxWidth: 420,
                height: "clamp(320px, 28vw, 348px)",
                borderRadius: "var(--radius-thumb)",
                border: "1px solid var(--border-15)",
                background: "var(--surface-raised)",
              }}
            >
              {hasPortrait ? (
                <Image
                  src="/me.jpg"
                  alt="Portrait of Carles"
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover object-center transition-[filter] duration-500 [filter:var(--img-filter)] group-hover:[filter:var(--img-filter-hover)]"
                />
              ) : (
                <div
                  className="bg-blueprint-grid absolute inset-0 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span
                    className="font-semibold lowercase leading-none"
                    style={{
                      fontSize: "clamp(4.5rem, 9vw, 7rem)",
                      letterSpacing: "-0.05em",
                      color: "var(--text-35)",
                    }}
                  >
                    c
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col items-center justify-between gap-4 pt-5 text-center">
              <div
                className="flex min-h-[10rem] w-full items-center justify-center"
                aria-live={quotePaused ? "polite" : "off"}
              >
                <blockquote key={quoteIndex} className="animate-fade-rise">
                  <p
                    className="text-balance"
                    style={{
                      color: "var(--text-100)",
                      fontSize: "var(--text-body)",
                      lineHeight: 1.55,
                    }}
                  >
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  <cite
                    className="mt-3 block not-italic"
                    style={{
                      color: "var(--text-50)",
                      fontSize: "var(--text-small)",
                      fontWeight: "var(--weight-semibold)",
                    }}
                  >
                    &mdash; {quote.author}
                  </cite>
                </blockquote>
              </div>

              <div className="flex items-center justify-center">
                {QUOTES.map((item, index) => (
                  <button
                    key={item.author}
                    type="button"
                    onClick={() => setQuoteIndex(index)}
                    aria-label={`Show quote ${index + 1} by ${item.author}`}
                    aria-current={index === quoteIndex ? "true" : undefined}
                    className="flex h-6 w-6 items-center justify-center"
                  >
                    <span
                      aria-hidden="true"
                      className="block h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: index === quoteIndex ? 24 : 6,
                        background:
                          index === quoteIndex
                            ? "var(--fill)"
                            : "var(--border-25)",
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="footer-fade mt-6 flex flex-col items-center justify-between gap-2 border-t pt-5 text-center md:flex-row md:text-left"
          style={{ borderColor: "var(--border-15)" }}
        >
          <p
            style={{
              color: "var(--text-50)",
              fontSize: "var(--text-small)",
            }}
          >
            © {new Date().getFullYear()} Carles. All rights reserved.
            <span className="hidden sm:inline">
              {" "}
              · Built with Next.js &amp; GSAP
            </span>
          </p>

          <p
            aria-live="polite"
            className="flex items-center"
            style={{
              color: "var(--text-50)",
              fontSize: "var(--text-small)",
            }}
          >
            {visitState === "loading" && (
              <>
                <span className="mr-1.5">You&apos;re the</span>
                <span
                  aria-hidden="true"
                  className="inline-block h-3.5 w-20 animate-pulse rounded-full"
                  style={{ background: "var(--border-15)" }}
                />
                <span className="ml-1.5">visitor!</span>
              </>
            )}
            {visitState === "ready" && visits !== null && (
              <>
                You&apos;re the{" "}
                <strong
                  className="mx-1 font-semibold tabular-nums"
                  style={{ color: "var(--text-100)" }}
                >
                  {visits.toLocaleString("en-US")}
                  {ordinalSuffix(visits)}
                </strong>{" "}
                visitor!
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
