# Design Direction: Carles' Software Engineer Portfolio

Reference: https://www.thealuminate.dev/

**Concept:** a quiet, sharp, dark site that reads like a well-kept codebase. Big confident type, lots of empty space, small mono details (status lines, tags, dates) that feel like a terminal. The goal is one thing: make a recruiter or hiring manager think "this person ships clean software."

---

## 1. Positioning

- **Role:** Software engineer (frontend-leaning, full-stack capable).
- **Goal:** internships first, then junior roles.
- **Lead with:** shipped products, the stack behind them, and the decisions you made.

---

## 2. Colors

Only two colors per theme. Nothing else gets added.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0a0a0a` | `#f5f5f5` | Page background, text on filled elements |
| `--ink` | `#ededed` | `#0a0a0a` | All text, borders, icons, filled buttons |

```css
:root {
  --bg: #0a0a0a;
  --ink: #ededed;
  color-scheme: dark;
}
[data-theme="light"] {
  --bg: #f5f5f5;
  --ink: #0a0a0a;
  color-scheme: light;
}
```

**Rules**
- Hierarchy comes from opacity only: 100% headings, 70% body, 50% labels, 15-25% borders and grid lines.
- Filled elements (main button, selected tag) flip the pair: `--ink` background, `--bg` text.
- No gradients, no colored shadows, no third color. Not even for links or errors.
- Use `color-mix(in srgb, var(--ink) 20%, transparent)` for borders so everything stays tied to the two tokens.

---

## 3. Typography

- **Headings and body:** Syne for headings, Manrope for body. Tight tracking on big headlines.
- **Labels, tags, dates, code-ish details:** Fira Code. Small, uppercase, wide letter spacing.
- Three families: display for headings, body for text, mono for details.

| Element | Size |
|---|---|
| Hero headline | `clamp(1.5rem, 1rem + 2.5vw, 3rem)` (24→48px) |
| Section heading | `clamp(3.75rem, 3.4rem + 1.75vw, 4.5rem)` (60→72px) |
| Giant marquee | `clamp(5rem, 4rem + 8vw, 13rem)` |
| Body | 17px, `line-height: 1.625` |
| Mono label | 12px, uppercase, `letter-spacing: .2em` |

---

## 4. Page structure

1. **Nav:** logo left; theme toggle, filled "Say Hello" pill, and a filled circular hamburger right. No border, no inline links — links live in the hamburger menu. Sticky with a blurred background that follows the theme. Theme persists in localStorage, defaults to OS preference.
2. **Hero:** mono label ("Software Engineer"), a two-line headline about what you build, one short paragraph, two buttons (filled "See my work", outlined "Download CV"). Keep an "open to internships" pill with a pulsing dot.
3. **Featured projects:** large cards, one column on mobile, two on desktop. Each card: screenshot, title, one-line description, mono tech tags, links to live demo and GitHub, and a small status line like the reference's "All systems operational".
4. **Marquee strip:** slow scrolling band ("building / shipping / learning") as a divider.
5. **About:** split headline, two short paragraphs (what you build, how you think). Optional stats, real numbers only (projects shipped, years coding, repos).
6. **Tools:** plain tag grid grouped by area: Frontend, Backend, Design. No logos, no skill bars.
7. **Experience:** vertical timeline with role, dates, one or two lines of impact, and mono tags. SIWES and IT go here as they happen.
8. **Writing:** 2-3 cards on engineering decisions ("why I picked X over Y", "what broke and how I fixed it"). The reference's blog is mostly build-in-public architecture notes, and that's what makes it feel credible.
9. **Closing CTA:** huge centered line ("You made it this far.") and one button.
10. **Footer:** nav links, GitHub, X, email, small signature line.

---

## 5. Project cards and case studies

Projects are the main selling point, so each one gets a detail page with the same short structure:

1. **What it is** (one sentence)
2. **The problem**
3. **Key decisions** (stack choices, trade-offs, what you'd change)
4. **Stack** (mono tags)
5. **Links** (live, repo)

**Order**
1. **Logicraft:** flagship. A complex canvas app in React, TypeScript, Konva.js and Zustand shows real frontend depth.
2. **Interact.:** your first solo full-stack product (React, Express, Supabase, AI on the backend). Shows you can ship end to end.
3. **Other work:** Dexter (React Native) and any other shipped or open-source work, as long as you can show it publicly.

Keep it to 3-4 projects. Cut anything that isn't finished or can't be demoed.

---

## 6. Graphic language

- Faint 48px grid in the background at about 5% ink, like a code editor's minimap or graph paper.
- 1px borders, big radii (cards 2.5rem, panels 1.5rem), buttons always full pills.
- Screenshots in grayscale, fading to full color on hover. Color appears only on hover.
- Small code-flavored details: status lines, a blinking cursor in the hero, mono tags, an occasional code snippet or architecture diagram drawn as inline SVG in ink-colored lines.

---

## 7. Motion

- Fade-and-rise on scroll: 24px, 500ms, ease-out.
- Card hover: lift 3px, border goes to 100% ink.
- Slow marquee, pulsing status dot, blinking cursor.
- Respect `prefers-reduced-motion`.
- Tooling: CSS + IntersectionObserver is enough. Framer Motion if on React. GSAP is optional (the reference uses it).

---

## 8. Voice

Casual and direct. Short sentences, no buzzwords.

- Yes: "I build web apps and care about how they feel to use."
- No: "Passionate engineer leveraging cutting-edge solutions."

---

## 9. Where to differ from the reference

- **Skip fake stats** ("happy clients", "uptime"). Stats you can't back up weaken a student portfolio.
- **Show real engineering thinking** in case studies and writing, since you don't have years of experience to point to.
- **Keep the CV easy to grab.** Put the download button in the hero and the footer.

---

## 10. Stack

Next.js (or Vite) + React + TypeScript + Tailwind, deployed on Vercel. Keep the two colors as CSS variables so the whole palette lives in one place. The portfolio's own code should be clean and public, since recruiters will look at it.

---

## 11. Build checklist

- [ ] Set the two color tokens and `color-scheme: dark`
- [ ] Load Space Grotesk and JetBrains Mono, with system fallbacks
- [ ] Nav + hero
- [ ] Project cards (Logicraft first) + case study pages
- [ ] About + tools
- [ ] Experience timeline
- [ ] Closing CTA + footer
- [ ] Scroll animations + reduced-motion support
- [ ] Real links (GitHub, X, email) and a CV download
- [ ] Meta tags: `theme-color: #0a0a0a`, OG image in black and white
