/**
 * Blog content — the single source for the writing section and the
 * /blog/[slug] reader.
 *
 * The first post is real; the last two are still PLACEHOLDER copy: swap the
 * title, dek, date, tags and `blocks` for the real post. The `slug` is what
 * the URL points at, so renaming one means updating anything that links to
 * it — the cards in `writing.tsx` and the prev/next rows are all derived from
 * this array, so they follow along automatically.
 *
 * Body blocks render in order:
 *   - `heading`   — section title, underlined like the reference's anchors
 *   - `paragraph` — plain text; **double asterisks** make a phrase bold
 *   - `embed`     — the project card that sits inline in the column
 */

export type PostEmbed = {
  /** Project name, shown in caps like a label. */
  title: string;
  description: string;
  stack: string[];
  href: string;
  /** Optional shot in /public — falls back to the blueprint placeholder. */
  image?: string;
};

export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "embed"; embed: PostEmbed };

export type Post = {
  slug: string;
  title: string;
  /** The line under the headline. Also used as the meta description. */
  dek: string;
  /** ISO date — formatted for display at render time. */
  date: string;
  readingMinutes: number;
  tags: string[];
  /** Optional cover in /public — falls back to the blueprint placeholder. */
  cover?: string;
  coverAlt?: string;
  blocks: PostBlock[];
};

export const POSTS: Post[] = [
  {
    slug: "llm-doesnt-get-to-guess",
    title: "the llm doesn’t get to guess",
    dek: "a customer says they paid. i built a support tool that checks with Paystack before anyone replies.",
    date: "2026-11-08",
    readingMinutes: 4,
    tags: ["resolve", "build-in-public", "product"],
    cover: "/resolve-cover.jpeg",
    coverAlt: "Resolve support triage flow checking Paystack before drafting a reply",
    blocks: [
      {
        type: "paragraph",
        text: "If you sell anything online, you’ve gotten this message: “I paid but I didn’t get anything.” Usually there’s a blurry receipt screenshot attached.",
      },
      {
        type: "paragraph",
        text: "Someone has to open the dashboard, find the transaction, work out whether it went through, and write back. It’s slow, and it’s the same lookup every time.",
      },
      {
        type: "paragraph",
        text: "The easy fix is to paste the message into an LLM and let it reply. That’s where it goes wrong.",
      },
      {
        type: "embed",
        embed: {
          title: "Resolve",
          description:
            "A support triage tool for payment disputes. It checks the payment with Paystack first, then drafts the reply.",
          stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
          href: "/works/resolve",
          image: "/resolve-image.png",
        },
      },
      { type: "heading", text: "a guess that sounds sure" },
      {
        type: "paragraph",
        text: "Whether a payment went through isn’t a matter of opinion. Paystack knows. The model reading the customer’s message doesn’t, so it guesses, and it guesses in a confident tone. “Your payment was successful” when it failed is bad. Refunding something that’s already been refunded is worse.",
      },
      {
        type: "paragraph",
        text: "So Resolve has one rule. **The model doesn’t get to decide what happened.**",
      },
      { type: "heading", text: "how it works" },
      {
        type: "paragraph",
        text: "A ticket comes in as text, a pasted receipt, or both. A vision model reads it and pulls out the payment details. If that fails, a regex fallback catches the obvious cases.",
      },
      {
        type: "paragraph",
        text: "Then the real work happens, and no model does it. Resolve checks the transaction against Paystack’s verify API, against the business’s own orders ledger, and against the list of refunds already issued. The refund check is what stops a double refund.",
      },
      {
        type: "paragraph",
        text: "Only after that does a model write anything. It gets the verdict and nothing else. It never sees the customer’s message or the receipt image, so it can’t repeat a claim as if it were true. The model is good at wording a reply. It just doesn’t get to choose the facts.",
      },
      { type: "heading", text: "the security bits" },
      {
        type: "paragraph",
        text: "Each business connects its own Paystack key on a setup page. The key goes in an httpOnly cookie, not local storage. Every lookup lands on an audit page, so you can see what was checked and why a reply says what it says.",
      },
      { type: "heading", text: "what was still open" },
      {
        type: "paragraph",
        text: "When I last worked on it I hadn’t got to page-level auth redirects, row-level security policies, or tighter tracking of where each draft’s facts come from. I wouldn’t have put it in front of a real business before those.",
      },
      { type: "heading", text: "where it’s going" },
      {
        type: "paragraph",
        text: "Resolve was a project, not a company, and I’m not pitching it as one. What I’m keeping is the rule behind it. If the answer lives in a system somewhere, go ask the system. Don’t ask the model to remember it.",
      },
    ],
  },
  {
    slug: "one-timeout-for-every-device",
    title: "one timeout for every device",
    dek: "the network decides when to drop your phone’s radio connection using a fixed timer. we made that timer adapt to the crowd.",
    date: "2026-11-08",
    readingMinutes: 5,
    tags: ["telecom", "research", "ieee"],
    cover: "/artm-cover.jpeg",
    coverAlt: "Crowded cell tower with phones competing for radio resources",
    blocks: [
      {
        type: "paragraph",
        text: "ARTM — Adaptive Radio Resource Control Timeout Management. A paper from six of us in LASU’s ECE department, accepted at IEEE NIGERCON 2026. Built with Python, SimPy and a Random Forest model.",
      },
      {
        type: "paragraph",
        text: "If you’ve ever tried to make a call at a packed event in Lagos, you know what happens. Calls drop, texts hang, and data crawls. “Too many people” is the usual answer, but part of the problem is how the network treats phones that go quiet.",
      },
      { type: "heading", text: "the timer nobody talks about" },
      {
        type: "paragraph",
        text: "When your phone stops sending data, the tower doesn’t let go of it right away. It keeps radio resources reserved for a set time, then releases them. That wait is the RRC inactivity timeout, and in most networks it’s one fixed number.",
      },
      {
        type: "paragraph",
        text: "In a crowd, that number hurts. Every idle phone holds a slice of the cell while everyone else waits their turn. Earlier work fixed this by cutting a constant 1 to 2 seconds off the timer during crowded events. That helps, but the cut is the same whether the crowd is just starting to build or already at its peak.",
      },
      { type: "heading", text: "what ARTM does" },
      {
        type: "paragraph",
        text: "It has two parts.",
      },
      {
        type: "paragraph",
        text: "The first is a crowd density estimator. It reads three things the network already measures: how loaded the cell is with active connections, how hard devices are hitting the random access channel, and how saturated the control channel is. It also tracks how fast each one is changing. A Random Forest model turns all of that into one number between 0 and 1, where 0 is a quiet cell and 1 is a fully packed one.",
      },
      {
        type: "paragraph",
        text: "The second is a timeout controller. It takes that number and sets the timeout with one line: timeout = 20s − (20s − 10s) × density.",
      },
      {
        type: "paragraph",
        text: "A quiet cell keeps the normal 20 seconds. A fully packed cell drops to 10 seconds. Everything in between scales in a straight line. Both limits are values operators already use, so ARTM never produces a timeout nobody runs in practice, and it needs no new infrastructure.",
      },
      { type: "heading", text: "how we tested it" },
      {
        type: "paragraph",
        text: "There’s no public data from real crowded events in Nigeria, so we built a simulation in SimPy and calibrated it against published Nigerian GSM performance numbers. We ran six crowd shapes: steady low, gradual buildup, flash surge, sustained peak, surge then decay, and oscillating. Each one ran with 30 random seeds. The baseline was a fixed 18 second timeout, based on the constant cut from earlier work.",
      },
      { type: "heading", text: "what came out" },
      {
        type: "paragraph",
        text: "ARTM beat the baseline in all six scenarios.",
      },
      {
        type: "paragraph",
        text: "Reconnection rate dropped by 22.9% to 40.6%. The best case was steady low at 40.6%, then gradual buildup at 34.7%. The toughest ones, flash surge and sustained peak, gave 23.8% and 22.9%.",
      },
      {
        type: "paragraph",
        text: "Signaling overhead dropped by 11.2% to 24.7%, with the biggest drop again in steady low.",
      },
      {
        type: "paragraph",
        text: "Resource utilization went up 7.0% in the sustained peak scenario.",
      },
      {
        type: "paragraph",
        text: "The gains were biggest early in an event and while it was building, which is when a fixed timer wastes the most. At the peak they’re smaller but still there. Blocking rate barely moved, so the timeout alone doesn’t fix that.",
      },
      { type: "heading", text: "what it doesn’t do yet" },
      {
        type: "paragraph",
        text: "All the training data is simulated, because real event traces weren’t available. It models one sector of one cell, not several interacting. And it can’t tell whether a given phone is actually active or idle, which would cut down the remaining reconnections.",
      },
      { type: "heading", text: "where it’s going" },
      {
        type: "paragraph",
        text: "We presented ARTM at IEEE NIGERCON 2026 on 5-6 November. Next up: testing it on real traces from Nigerian operators, extending it to multiple sectors, adding a per-user activity classifier, and validating it at the protocol level in OMNeT++.",
      },
    ],
  },
  {
    slug: "the-answer-that-wasnt-from-the-ai",
    title: "the answer that wasn’t from the ai",
    dek: "my server never threw an error. it just quietly handed me fake study material.",
    date: "2026-10-27",
    readingMinutes: 4,
    tags: ["interact", "build-in-public", "product"],
    cover: "/not-from-the-ai.jpeg",
    coverAlt: "One glowing document card standing out in a row of grey cards",
    blocks: [
      {
        type: "paragraph",
        text: "Interact was in a good place. Sign up worked, the onboarding questions worked, and the study view had the sidebar, sections and progress checkmarks all in place. I typed in a topic, picked my answers, and got a full set of sections back. It felt done enough to test on a real topic.",
      },
      {
        type: "embed",
        embed: {
          title: "Interact",
          description:
            "An AI study tool that asks how deep, why and how long, then builds sectioned material around your answers.",
          stack: [
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Node.js",
            "Supabase",
          ],
          href: "/works/interact",
          image: "/interact-steps.jpeg",
        },
      },
      {
        type: "paragraph",
        text: "I tried it on transistors. Section 1.1 came back as “Introduction to Transistors,” and the first line said “this section provides a exhaustive with derivations, proofs, edge cases of the key ideas.”",
      },
      { type: "heading", text: "Material that read wrong" },
      {
        type: "paragraph",
        text: "That sentence isn’t English. Then I opened section 1.2 and it had the same headers: Core Concepts, Detailed Explanation, Practical Implications, Summary. Same bullets too, just with a different title on top.",
      },
      {
        type: "paragraph",
        text: "No AI writes like that. Something was filling in a template.",
      },
      { type: "heading", text: "No error anywhere" },
      {
        type: "paragraph",
        text: "I checked the terminal and the network tab. Nothing was red. The request came back 200 every time.",
      },
      {
        type: "paragraph",
        text: "That’s when I understood. My server had a fallback. If the AI call failed for any reason, it caught the error and returned pre-written template material instead. The frontend never found out. It got a normal response with fake content in it.",
      },
      {
        type: "paragraph",
        text: "The only reason I caught it was the broken grammar in the template text. **A fallback that never complains is a bug hider.**",
      },
      { type: "heading", text: "The model was gone" },
      {
        type: "paragraph",
        text: "Once I looked at the server logs, the real error was there. It was a 404 saying the Gemini model I’d hardcoded wasn’t available to new users anymore. It had been failing on every request since I started testing.",
      },
      {
        type: "paragraph",
        text: "I swapped the model name, and real material finally came back.",
      },
      { type: "heading", text: "Then it was real, and it wasn’t good" },
      {
        type: "paragraph",
        text: "It was real now but too short and too generic. I’d chosen a deep level and a specific reason for studying, and the output barely reflected either. I tried a stronger model next, but the free tier gave that model a quota of zero, so that was a dead end.",
      },
      {
        type: "paragraph",
        text: "[fill in what you did next: prompt changes, splitting outline and sections into two calls, or which provider you ended up on]",
      },
      { type: "heading", text: "What I changed" },
      {
        type: "paragraph",
        text: "The fallback now logs the actual error loudly, and a failed generation shows the user an error instead of fake content. I’d rather see something break than have it look fine.",
      },
      {
        type: "paragraph",
        text: "I’ve kept testing on real topics since then, because the template text only gave itself away by accident. Next up is spaced repetition, so people actually remember what they study.",
      },
    ],
  },
];

export function getPost(slug: string): Post | null {
  return POSTS.find((post) => post.slug === slug) ?? null;
}

/** Newer post on the left, older on the right. */
export function getNeighbours(slug: string): {
  previous: Post | null;
  next: Post | null;
} {
  const index = POSTS.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: POSTS[index - 1] ?? null,
    next: POSTS[index + 1] ?? null,
  };
}

/** "August 24, 2026" — uppercased by the mono-label class. */
export function formatPostDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
