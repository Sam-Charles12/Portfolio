"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import gsap from "gsap";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { siGithub, siWhatsapp, siX } from "simple-icons";
import { gsapSetup, prefersReducedMotion, blurFadeIn } from "@/lib/gsap";
import {
  EMAIL_HREF,
  GITHUB_URL,
  WHATSAPP_URL,
  X_URL,
} from "@/lib/site";

type Status = "idle" | "sending" | "success" | "error";

const SOCIALS = [
  { label: "github", href: GITHUB_URL, icon: siGithub },
  { label: "x(twitter)", href: X_URL, icon: siX },
  { label: "whatsapp", href: WHATSAPP_URL, icon: siWhatsapp },
] as const;

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "var(--border-width) solid var(--border-20)",
  borderRadius: 0,
  padding: "12px 0",
  fontSize: "var(--text-body)",
  color: "var(--text-100)",
  outline: "none",
};

export default function ContactPage() {
  const rootRef = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    gsapSetup();
    const ctx = gsap.context(() => {
      blurFadeIn(Array.from(root.querySelectorAll(".contact-page-fade")), {
        duration: 1.1,
        stagger: 0.1,
        y: 24,
        reversible: false,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and message.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Couldn't send right now — please try again.");
      }
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't send right now — please try again.",
      );
    }
  }

  return (
    <main className="flex-1">
      <section
        ref={rootRef}
        aria-labelledby="contact-title"
        className="container-shell pb-24 pt-8 md:pb-36"
      >
        <Link
          href="/"
          className="contact-page-fade mono-label inline-flex items-center gap-2 rounded-md outline-hidden transition-colors duration-200 hover:text-[var(--text-100)] focus-visible:ring-2"
        >
          <span aria-hidden="true">←</span> Contact
        </Link>

        <div className="mt-10 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left — headline + copy + socials */}
          <div>
            <h1
              id="contact-title"
              className="contact-page-fade font-bold"
              style={{
                fontSize: "clamp(2.75rem, 2.2rem + 3.5vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--text-100)",
              }}
            >
              Have something in mind?
              <br />
              <span style={{ color: "var(--text-50)" }}>let&rsquo;s talk.</span>
            </h1>

            <p
              className="contact-page-fade mt-8 max-w-xl"
              style={{
                color: "var(--text-70)",
                fontSize: "var(--text-body)",
                lineHeight: "var(--leading-body)",
              }}
            >
              have a project in mind, or just curious about what i do? This is
              the right place to reach out, ask questions, or start something
              new.
            </p>
            <p
              className="contact-page-fade mt-4 max-w-xl"
              style={{
                color: "var(--text-70)",
                fontSize: "var(--text-body)",
                lineHeight: "var(--leading-body)",
              }}
            >
              i like to keep things simple, honest, and collaborative — so
              don&rsquo;t hesitate to say hi.
            </p>

            <p
              className="contact-page-fade mt-10"
              style={{
                color: "var(--text-70)",
                fontSize: "var(--text-body)",
              }}
            >
              other places to find me?
            </p>
            <ul className="contact-page-fade mt-4 flex flex-wrap items-center gap-3">
              {SOCIALS.map((social) => (
                <li key={social.label} className="flex items-center gap-3">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-medium outline-hidden transition-all duration-200 hover:-translate-y-0.5 hover:text-[var(--text-100)] focus-visible:ring-2"
                    style={{
                      border: "var(--border-width) solid var(--border-20)",
                      borderRadius: "var(--radius-pill)",
                      padding: "10px 18px",
                      fontSize: 14,
                      color: "var(--text-100)",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width={16}
                      height={16}
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d={social.icon.path} />
                    </svg>
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div className="contact-page-fade">
            <form onSubmit={onSubmit} noValidate aria-label="Contact form">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="sr-only">
                    Your name (required)
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Your name*"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                    className="placeholder:text-[var(--text-50)] focus:border-[var(--ink)]"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">
                    Your email (required)
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Your email*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                    className="placeholder:text-[var(--text-50)] focus:border-[var(--ink)]"
                  />
                </div>
              </div>

              <div className="mt-8">
                <label htmlFor="contact-subject" className="sr-only">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  autoComplete="off"
                  placeholder="Subject (e.g., Portfolio website project)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={inputStyle}
                  className="placeholder:text-[var(--text-50)] focus:border-[var(--ink)]"
                />
              </div>

              <div className="mt-8">
                <label htmlFor="contact-message" className="sr-only">
                  Your message (required)
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={7}
                  placeholder="Tell me a little about your idea, goals, and timeline..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 160 }}
                  className="placeholder:text-[var(--text-50)] focus:border-[var(--ink)]"
                />
              </div>

              {/* Honeypot — hidden from humans */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <div className="mt-10">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex cursor-pointer items-center gap-2 font-semibold outline-hidden transition-all duration-200 hover:-translate-y-0.5 hover:opacity-85 active:scale-[0.97] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50"
                  style={{
                    height: 52,
                    paddingInline: 28,
                    background: "var(--fill)",
                    color: "var(--on-fill)",
                    borderRadius: "var(--radius-pill)",
                    fontSize: 16,
                  }}
                >
                  {status === "sending" ? "Sending..." : "Send message"}
                  <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} strokeWidth={2} />
                </button>
              </div>

              <p aria-live="polite" className="mt-5 min-h-6" style={{ fontSize: "var(--text-small)" }}>
                {status === "success" && (
                  <span style={{ color: "var(--text-100)" }}>
                    Message sent — I&rsquo;ll get back to you soon.
                  </span>
                )}
                {status === "error" && error && (
                  <span style={{ color: "var(--text-100)" }}>
                    {error}{" "}
                    <a
                      href={EMAIL_HREF}
                      className="underline underline-offset-4 hover:opacity-80"
                    >
                      Email me directly instead.
                    </a>
                  </span>
                )}
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
