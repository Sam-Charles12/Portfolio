/**
 * Project case-study content — the single source for /works/[slug].
 *
 * Resolve and RFForge are written from the real thing (live sites, the
 * Resolve PRD + pilot spec, the RFForge README). Interact is still in
 * development, so its page is written from what's built so far plus the
 * build-in-public notes — its live/repo links stay "#" until it ships.
 *
 * Body blocks render in order:
 *   - `paragraphs` — plain text; **double asterisks** make a phrase bold
 *   - `bullets`    — unordered feature/improvement list
 *   - `steps`      — numbered "how it works" list
 */

export type ProjectSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  steps?: string[];
};

export type ProjectDetail = {
  slug: string;
  /** Display title — matches the card. */
  title: string;
  status: string;
  /** One-to-two-line pitch under the headline. Also the meta description. */
  dek: string;
  stack: string[];
  /** "#" means unshipped — the page renders a "soon" pill instead. */
  liveHref: string;
  repoHref: string;
  /** Hero shot in /public. */
  image: string;
  imageAlt: string;
  sections: ProjectSection[];
};

export const PROJECT_DETAILS: ProjectDetail[] = [
  {
    slug: "interact",
    title: "Interact.",
    status: "In development",
    dek: "An AI study tool that asks how deep, why, and how long — then builds sectioned study material around your answers, with progress tracking as you work through it.",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Express",
      "Supabase",
      "Groq",
      "Tailwind CSS",
    ],
    liveHref: "#",
    repoHref: "#",
    image: "/interact-steps.png",
    imageAlt: "Interact study view with sections and progress checkmarks",
    sections: [
      {
        heading: "Why I'm building this",
        paragraphs: [
          "Generic AI study help ignores the three things that actually shape good material: how deep you want to go, why you're studying, and how much time you have. You get a wall of text tuned for nobody.",
          "Interact starts from those answers instead. A short onboarding asks about depth, reason, and time, and everything generated after that is built around what you said — so the material reads like it was made for you, because it was.",
        ],
      },
      {
        heading: "My approach",
        paragraphs: [
          "Interact is my first solo full-stack product: a React + Vite frontend, an Express backend sitting between the client and the model provider, and Supabase for auth and storage. Signup and onboarding came first, then the study view with its sidebar, sections, and progress checkmarks.",
          "Generation runs in stages — an outline first, then section content — so a failure in one section doesn't take down the whole set, and progress can be tracked per section as you study.",
        ],
      },
      {
        heading: "Key features",
        paragraphs: [],
        bullets: [
          "Onboarding that matters. Depth level, reason for studying, and available time feed directly into what gets generated",
          "Sectioned material. Topics come back as structured sections instead of one long dump, each tracked separately",
          "Progress tracking. Checkmarks and a sidebar show where you are and what's left",
          "Real accounts. Signup works, so your topics and progress persist between sessions",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "Sign up, answer three questions, type a topic — then study through the sections it builds for you.",
        ],
        steps: [
          "Create an account and answer the onboarding questions: how deep, why you're studying, how long you have",
          "Type in a topic — transistors, for example — and the server generates an outline for it",
          "Each section gets full content generated around your onboarding answers",
          "Study through the sections in the sidebar view, checking off progress as you go",
          "Spaced repetition (planned) brings material back so you actually remember it",
        ],
      },
      {
        heading: "Challenges & lessons learned",
        paragraphs: [
          "The biggest bug so far never threw an error. My server had a fallback: if the AI call failed, it caught the error and returned pre-written template material instead. The frontend got a clean 200 with fake content inside — every section the same headers, the same bullets, one sentence that wasn't even English.",
          "The only reason I caught it was the broken grammar. The real error was in the server logs all along: the model I'd hardcoded wasn't available anymore, so every request had been failing since I started testing. I swapped the model and real material finally came back.",
          "The lesson stuck: **a fallback that never complains is a bug hider.** The fallback now logs the actual error loudly, and a failed generation shows the user an error instead of fake content. I'd rather see something break than have it look fine.",
        ],
      },
      {
        heading: "What's next",
        paragraphs: [],
        bullets: [
          "Spaced repetition, so people remember what they study — not just read it once",
          "Better generation quality: early real output was too short and too generic for the depth level chosen",
          "A public live demo and open repo once the core loop is solid",
        ],
      },
    ],
  },
  {
    slug: "resolve",
    title: "Resolve",
    status: "All systems operational",
    dek: "Dispute inbox for Paystack teams. Paste a “you took my money” message or receipt screenshot — Resolve verifies it live against Paystack and your order ledger, then drafts the reply for one-click approval in under 60 seconds.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Groq",
      "Paystack",
      "GSAP",
      "Framer Motion",
    ],
    liveHref: "https://resolve-two-psi.vercel.app/",
    repoHref: "https://github.com/Sam-Charles12/Resolve",
    image: "/resolve-image.png",
    imageAlt: "Resolve inbox verifying a ticket against Paystack truth",
    sections: [
      {
        heading: "Why I built this",
        paragraphs: [
          "Every business on Paystack lives the same ticket: a customer pays, gets debited, sees “pending” or no receipt, and sends a panicked message — often to WhatsApp, Instagram, and email at the same time. A support agent then opens the Paystack dashboard, searches the reference, reads the status, and switches back to reply. Ten to fifteen minutes per ticket, and during a sales spike a hundred of them pile up at once.",
          "Under that pressure agents guess — “network issue, please wait” — or refund incorrectly. Both cost money and trust. And the existing AI tools don't help here: Intercom Fin and Zendesk AI generate answers from conversational context without ever calling `GET /transaction/verify/:reference`, so they can confidently state a payment status they never checked. That's fine for a password-reset bot. It's not fine when the answer decides whether money moves.",
          "Resolve exists for that gap: **no reply is ever drafted without a live Paystack lookup behind it.** A detective that checks Paystack, and a cashier that writes the reply based only on what the detective found.",
        ],
      },
      {
        heading: "My approach",
        paragraphs: [
          "Resolve is a Next.js app built around a four-stage pipeline: extract, verify, draft, approve. Paste a message or drop a receipt screenshot — text only, image only, or both. An LLM reads out the reference, amount, phone, and email as strict JSON, with a regex fallback so the pipeline degrades instead of breaking.",
          "Verify is the core. It calls Paystack live, cross-checks the business's own order ledger in Supabase to separate “paid but not fulfilled” from “paid and already fulfilled,” and scans the refund list to block double refunds. That resolves to one of seven verdicts: success unfulfilled or fulfilled, failed funds, abandoned, no reference, already refunded, or verify error.",
          "Draft is deliberately crippled: it receives the verdict and its facts **only** — never the raw message, never the image — and the request is rejected outright if those keys show up. A human always approves; nothing auto-sends. Every approval writes to an append-only audit log, and customer screenshots are processed in memory and never persisted anywhere.",
        ],
      },
      {
        heading: "Key features",
        paragraphs: [],
        bullets: [
          "Messy input welcome. Paste text, drag in a bank-alert screenshot, or both — cross-referenced when they disagree",
          "Seven real verdicts. Paid, failed, abandoned, refunded, or needs-human — every path handled, not just the success case",
          "Verdict-specific actions. Resend receipt, send retry link, fresh payment link, or a disabled refund button when one already exists",
          "An audit trail that holds up. Timestamp, actor, action, verdict, extraction method, amount — no edit, no delete",
          "Minutes-saved counter. Each approval ticks up the running total for demos and reporting",
          "Privacy by construction. Restricted Paystack keys in httpOnly cookies, images never stored, no card data anywhere",
        ],
      },
      {
        heading: "How the system works",
        paragraphs: [
          "A panicked message goes in one side; an approved, verified reply comes out the other in under a minute.",
        ],
        steps: [
          "Connect a restricted Paystack key in setup — validated with a real API call, stored httpOnly, never client-exposed",
          "Paste the customer message or drop a receipt screenshot into the inbox composer (4MB cap, in-memory only)",
          "Extract pulls reference, amount, phone, and email — LLM first, regex fallback if it fails or times out",
          "Verify hits Paystack live, cross-checks the Supabase order ledger, and scans for existing refunds to reach a verdict",
          "Draft writes a short plain-language reply from the verdict facts alone, or a forced escalation template when there's nothing to confirm",
          "Approve (or edit, or take the verdict-specific action) — the audit log records exactly what was checked and sent",
        ],
      },
      {
        heading: "Challenges & lessons learned",
        paragraphs: [
          "The draft route was leaking. It originally accepted the extraction alongside the verify result, which meant drafts could reference things Paystack never confirmed — the exact hallucination the product exists to prevent. I stripped the input to `VerifyResultSchema` only and made the route **reject** requests carrying `extraction`, `message`, or `image` keys. A rejected field is a loud signal if the leak is ever reintroduced; a silently dropped one is not.",
          "Auth hardening couldn't wait for post-pilot. A redirect-only proxy is a UI control — without row-level security, the audit log stays readable across businesses at the database layer. So the migration ships the `user_id` column, RLS enablement, policies, and grant revokes in one file, with no update or delete policy at all: an audit log you can edit isn't an audit log.",
          "Smaller calls with the same philosophy: verdict names follow the tested code, not the planning doc — renaming working enums to match a document is pure risk. Image privacy holds by construction, because the approve payload is allowlisted and the image simply isn't in it. And if Paystack is unreachable, verify fails into “needs human,” never into a false success or failure.",
        ],
      },
      {
        heading: "What's next",
        paragraphs: [],
        bullets: [
          "Pilot with a real Lagos business on live traffic — the proof point everything else serves",
          "Pin the LLM provider on evidence: same three screenshots (one deliberately messy) through both candidates, bar set before the test",
          "Time one real manual ticket end-to-end so the minutes-saved counter traces to an observation, not an estimate",
          "Later, explicitly deferred: WhatsApp auto-send, more gateways, analytics beyond the counter",
        ],
      },
    ],
  },
  {
    slug: "rfforge",
    title: "RFForge",
    status: "All systems operational",
    dek: "Equation-grounded RF and microwave design tool for power-amplifier matching. Interactive visualisations, auditable worked examples, and an AI layer that explains the numbers without ever touching them.",
    stack: ["TypeScript", "Next.js", "Tailwind CSS", "Groq"],
    liveHref: "https://rfforge.vercel.app/",
    repoHref: "https://github.com/Sam-Charles12/rfforge",
    image: "/rfforge-hero.png",
    imageAlt: "RFForge matching network designer with solved values and charts",
    sections: [
      {
        heading: "Why I built this",
        paragraphs: [
          "Students and early-career engineers working on power-amplifier design at 60 GHz, 140 GHz, and beyond study from scattered reference equations across textbooks — with no single place to experiment with real design tradeoffs. How does match quality change with frequency? How does power-added efficiency respond to compression? Why is sub-terahertz design fundamentally harder than sub-6 GHz?",
          "RFForge consolidates those scattered concepts into one interactive instrument. It's built for RF students, research-lab applicants who need to demonstrate competence, and early-career engineers who want a fast sanity-check tool — and it has to read as a real instrument at a glance, with every number legible and every result traceable to an equation.",
        ],
      },
      {
        heading: "My approach",
        paragraphs: [
          "RFForge is not a simulator and not a black-box estimator. Every engineering result comes from deterministic calculation logic written as pure, independently testable functions: real amplifier and network parameters in, impedance matches, PA metrics, and frequency-loss behavior out.",
          "The app is organized as four instrument panels. Module A designs impedance matching networks — complex impedances in, reflection coefficient, topology choice across L, Pi, and T networks, quality factor, and physical L/C values out, with the bandwidth tradeoff visible immediately. Module B traces PA performance across an input-power sweep: P1dB, saturated power, PAE and drain efficiency curves through compression into saturation. Module C sweeps frequency to show how parasitics detune the network — insertion loss and inductor-Q degradation annotated at sub-6, 24, 60, and 140 GHz. Module D is the AI explanation layer, strictly read-only: it receives calculated numbers and explains what they mean, never generating or altering a value, with a template fallback when generation is unavailable.",
          "Accuracy is the foundational requirement, so matching math is validated against worked examples from standard references, PA curves against published datasheet shapes, and scaling behavior against established RF principles. Equations are documented with references, and validation coverage lives with the project docs.",
        ],
      },
      {
        heading: "Key features",
        paragraphs: [],
        bullets: [
          "Matching network designer. L, Pi, and T topologies from complex impedances, with Q factor, component values, and bandwidth",
          "PA performance calculator. Compression curves, P1dB, saturation, PAE and drain efficiency across the full sweep",
          "Frequency scaling visualizer. Insertion loss and Q degradation from sub-6 GHz to sub-THz, with standard band markers",
          "Read-only AI explanations. Plain-language commentary on your numbers, clearly labeled, toggleable, never mixed into results",
          "Instrument-grade UI. Bento panels, mono numerals, per-module accent colors, charts treated as the centerpiece",
        ],
      },
      {
        heading: "How the system works",
        paragraphs: [
          "Enter parameters, watch the instrument respond — calculations update live as inputs change.",
        ],
        steps: [
          "Enter source and load impedances, reference impedance, and operating frequency in the matching panel",
          "The solver computes reflection coefficient, picks a topology, and derives Q factor plus series and shunt reactances",
          "Reactances convert to physical inductance and capacitance values, with match bandwidth shown alongside",
          "Set PA parameters — supply, gain, saturation, sweep range — and read P1dB, PAE, and efficiency curves off the sweep",
          "Run the frequency sweep to see SRF, insertion loss, and Q degradation climb toward sub-THz bands",
          "Toggle Explain for AI commentary on any module's results — or keep it off and read the numbers raw",
        ],
      },
      {
        heading: "Challenges & lessons learned",
        paragraphs: [
          "The hard constraint was credibility: a tool like this is useless if its numbers can't be trusted. So validation was designed in, not bolted on — worked examples from reference texts, datasheet curve shapes, and reviewer checklists, with the methodology separating calculated values from AI text at every layer.",
          "That separation shaped the architecture. The AI layer only ever receives finished numbers as context, its output is visually fenced off from computed results, and a template fallback keeps commentary available with no keys configured. **The AI explains the instrument; it is never part of the measurement.**",
          "On the interface side, the lesson was restraint: charts carry the product, so line weights stay disciplined, annotations support reading instead of cluttering, and motion exists only to communicate state change as live calculations update.",
        ],
      },
      {
        heading: "What's next",
        paragraphs: [],
        bullets: [
          "More matching topologies and network options beyond the current L, Pi, and T set",
          "Save and share designs, so a worked example can be linked instead of screenshotted",
          "Multi-stage amplifier chains — explicitly out of the initial scope, and the natural next depth step",
          "Expanded validation coverage as new modules land, held to the same worked-example bar",
        ],
      },
    ],
  },
];

export function getProject(slug: string): ProjectDetail | null {
  return PROJECT_DETAILS.find((project) => project.slug === slug) ?? null;
}

/** Older project on the left, newer on the right — mirrors the blog nav. */
export function getProjectNeighbours(slug: string): {
  previous: ProjectDetail | null;
  next: ProjectDetail | null;
} {
  const index = PROJECT_DETAILS.findIndex(
    (project) => project.slug === slug,
  );
  if (index === -1) return { previous: null, next: null };
  return {
    previous: PROJECT_DETAILS[index - 1] ?? null,
    next: PROJECT_DETAILS[index + 1] ?? null,
  };
}
