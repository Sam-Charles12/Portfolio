/**
 * Blog content — the single source for the writing section and the
 * /blog/[slug] reader.
 *
 * Everything below is PLACEHOLDER copy: swap the title, dek, date, tags
 * and `blocks` for the real post. The `slug` is what the URL points at,
 * so renaming one means updating anything that links to it — the cards
 * in `writing.tsx` and the prev/next rows are all derived from this
 * array, so they follow along automatically.
 *
 * Body blocks render in order:
 *   - `heading`   — section title, drawn with a rule under it
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
    slug: "placeholder-post-one",
    title: "placeholder post title that wraps across a few lines",
    dek: "one sentence that says what the post is about — the line under the headline that tells someone why they should keep reading.",
    date: "2026-08-24",
    readingMinutes: 4,
    tags: ["engineering", "build-in-public", "notes"],
    blocks: [
      {
        type: "paragraph",
        text: "This is where the post opens. Two or three sentences that set up the problem, written the way you'd explain it to someone sitting at the desk next to you. Replace all of this with the real thing.",
      },
      {
        type: "paragraph",
        text: "The opening does not need to summarise the whole article. It only has to earn the next paragraph — enough context that the reader knows what is at stake, and **one bolded sentence that carries the main point**.",
      },
      { type: "heading", text: "the problem, in one paragraph" },
      {
        type: "paragraph",
        text: "Placeholder body copy goes here. It sits at roughly sixty to seventy characters per line, which is why this column is narrower than the rest of the page. Long lines make the eye work harder to find the start of the next one.",
      },
      {
        type: "paragraph",
        text: "Another paragraph. Keep them short. Two to four sentences is usually right for a technical post — the density of a wall of text is what makes people leave before the interesting part.",
      },
      {
        type: "embed",
        embed: {
          title: "project name",
          description:
            "one line about what the project does, kept short enough to sit beside the thumbnail.",
          stack: ["React", "TypeScript", "Tailwind CSS"],
          href: "#",
        },
      },
      { type: "heading", text: "what i changed" },
      {
        type: "paragraph",
        text: "This section can walk through the fix or the decision behind it. Screenshots, diagrams, and code samples all live in this same column, so anything wider than the measure will break the rhythm of the page.",
      },
      {
        type: "paragraph",
        text: "If a paragraph wants to read as a list, it can just be sentences. **Bold is for the one line that matters**, not for every other phrase — used everywhere it stops meaning anything.",
      },
      { type: "heading", text: "what i took away" },
      {
        type: "paragraph",
        text: "Close with the takeaway: the thing you would tell yourself a month earlier. Then stop. There is no need for a summary section that repeats what the reader has just read.",
      },
    ],
  },
  {
    slug: "placeholder-post-two",
    title: "another placeholder title — this is where the real headline goes",
    dek: "a second dek line, about the same length as the first, so the two layouts can be compared side by side.",
    date: "2026-07-09",
    readingMinutes: 6,
    tags: ["architecture", "decisions", "product"],
    blocks: [
      {
        type: "paragraph",
        text: "A post can open on a concrete moment instead of a thesis. The bug that only happened once, the file that was four thousand lines long, the deploy that went out at midnight.",
      },
      {
        type: "paragraph",
        text: "Starting concrete is easier to read than starting abstract, and it gives the rest of the article something to resolve. **Specifics are what make a post worth publishing.**",
      },
      { type: "heading", text: "the setup" },
      {
        type: "paragraph",
        text: "Spend one paragraph on the system as it was. Just enough that a reader who has never seen the repo can follow the decision that comes later.",
      },
      {
        type: "paragraph",
        text: "Then the constraint: time, budget, an API that does not do what its docs claim, a deadline that moved twice.",
      },
      { type: "heading", text: "where it got messy" },
      {
        type: "paragraph",
        text: "This is the part people actually come for — the wrong turn, the thing that looked clever and was not, the moment the estimate stopped being true.",
      },
      {
        type: "embed",
        embed: {
          title: "project name",
          description:
            "short description of the build this post is about, the same shape as the card above.",
          stack: ["Next.js", "Supabase", "GSAP"],
          href: "#",
        },
      },
      { type: "heading", text: "the call i made" },
      {
        type: "paragraph",
        text: "State the decision plainly, then the trade-off it bought. Every decision costs something; naming the cost is what separates a write-up from a pitch.",
      },
      {
        type: "paragraph",
        text: "If it worked, say how you know. If it did not, say that too — **a post about a thing that failed is usually more useful** than one about a thing that shipped cleanly.",
      },
    ],
  },
  {
    slug: "placeholder-post-three",
    title: "third placeholder title goes right here",
    dek: "shorter dek this time, to check that the header still balances when the subheading is only one line.",
    date: "2026-05-30",
    readingMinutes: 5,
    tags: ["backend", "typescript", "performance"],
    blocks: [
      {
        type: "paragraph",
        text: "Numbers make a good opening. A response time, a bundle size, a bill, a count of records. Anything the reader can hold onto while the rest of the post explains why it was that number.",
      },
      { type: "heading", text: "why it was slow" },
      {
        type: "paragraph",
        text: "Walk through the cause in the order you found it, not the order you would teach it. The order you found it is the order the reader is following.",
      },
      {
        type: "paragraph",
        text: "Mention the false lead. The one you chased for an afternoon before realising it was not the problem — that is the paragraph people quote back to you.",
      },
      { type: "heading", text: "what i measured" },
      {
        type: "paragraph",
        text: "Show the before and after, and say how each was measured. A number without a method is a claim, and readers are right not to trust it.",
      },
      {
        type: "embed",
        embed: {
          title: "project name",
          description:
            "the tool or service this post covers, with the stack listed underneath.",
          stack: ["Node.js", "Postgres", "Redis"],
          href: "#",
        },
      },
      { type: "heading", text: "the result" },
      {
        type: "paragraph",
        text: "Close on the outcome and the one thing you would do differently. Short. Specific. Done.",
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

/** Shortens prev/next titles so the row stays on one line. */
export function shorten(text: string, max = 30): string {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}
