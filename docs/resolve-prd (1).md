# Resolve — Product Requirements Document

**Status:** In development — core pipeline live, tested against Paystack
**Owner:** Oladipo SamCharles (Carles)
**Last updated:** September 2026

---

## 1. Summary

Resolve is a dispute-resolution inbox for support teams that accept payments through Paystack. A customer sends a "you took my money" message — typed text, a bank-alert screenshot, or both. Resolve extracts the payment details, verifies them live against Paystack and the business's own order ledger, drafts a reply grounded strictly in that verified result, and lets a support agent approve it in one click.

**Core constraint, non-negotiable:** No reply is ever drafted without a live Paystack lookup behind it. This is the product's entire differentiator against generic AI support tools (Intercom Fin, Zendesk AI), which will confidently answer payment questions without checking whether the payment actually happened.

**One-line pitch:** A detective that checks Paystack, and a cashier that writes the reply based only on what the detective found.

---

## 2. Problem

### 2.1 Who has this problem
Any business accepting online payments through Paystack — a fashion store in Lagos, a pharmacy in Accra, a SaaS company in Nairobi, a course seller in London. The pain is identical regardless of country or product.

### 2.2 What happens today
1. A customer pays, gets debited, but sees "pending," no receipt, or a delayed webhook.
2. The customer sends a panicked message — often to WhatsApp, Instagram DM, and email simultaneously, sometimes 3+ times.
3. A support agent manually opens the Paystack dashboard, searches the reference, reads the status, then switches back to the customer's channel to reply. This takes 10–15 minutes per ticket.
4. During sales spikes, 100+ of these pile up at once.
5. Under pressure, agents guess ("network issue, please wait") or refund incorrectly — both erode trust and cost money.

### 2.3 Why this is worth solving
Paystack itself lists this exact scenario — an AI assistant that sorts and routes WhatsApp payment queries — as a target use case. It is repetitive, time-bound, and directly measurable in minutes saved per ticket.

### 2.4 Why existing tools fail here
Intercom Fin and Zendesk AI generate answers from conversational context and training data. They do not call `GET /transaction/verify/:reference` before answering, so they can hallucinate a payment status. That is an acceptable failure mode for a "how do I reset my password" bot. It is not acceptable when the answer determines whether money moves.

---

## 3. Goals and non-goals

### 3.1 Goals
- Cut the time to resolve a "did I get charged" ticket from ~10–15 minutes to under a minute.
- Guarantee zero hallucinated payment statuses: every drafted reply is traceable to a specific Paystack API response.
- Support the messy reality of customer input: vague phrasing, missing references, screenshots instead of text.
- Give agents full control — the app drafts, a human approves. No auto-send.
- Produce an audit trail that shows exactly what was checked and what was told to the customer, for accountability and dispute resolution later.

### 3.2 Non-goals (for this version)
- Direct WhatsApp/email auto-send. MVP output is a reply agents copy into their existing channel.
- Multi-agent role management, ticket assignment, or SLA tracking.
- Full CRM feature parity (contact history, tagging, macros beyond this one workflow).
- Non-Paystack payment gateways (architecture should not preclude this later, but it is not in scope now).

---

## 4. Users and personas

**Primary: Support agent** at a small-to-mid-size business. Not necessarily technical. Handles 20–100+ payment queries per day during peak periods. Needs speed and confidence that what they're sending the customer is accurate.

**Secondary: Business owner / support lead.** Connects the Paystack account, uploads the order ledger, reviews the audit log to catch mistakes or disputes, and is the one who has to explain to Paystack or a customer why a refund did or didn't happen.

---

## 5. User stories

- As a support agent, I paste a customer's message and get back a verified payment status within seconds, so I don't have to leave my workflow to check a dashboard.
- As a support agent, I can attach a screenshot of a bank alert instead of typing, because that's what customers actually send me.
- As a support agent, I see a reply already written in plain language, so I only have to read and click Approve instead of composing from scratch.
- As a support agent, if the app can't find a matching payment, I'm told to ask for more information instead of getting a made-up answer.
- As a business owner, I can see every check that was run and every reply that was sent, so I have a record if a customer or Paystack disputes something later.
- As a business owner, I don't want my Paystack secret key or my customers' payment screenshots stored anywhere they don't need to be.

---

## 6. Functional requirements by page

### 6.1 `/login` and `/signup`
- Email OTP magic link (doubles as signup — a new email creates an account).
- Google OAuth as an alternative sign-in method.
- Session-aware routing: signed-in users hitting `/`, `/login`, or `/signup` are redirected to `/inbox`.

### 6.2 `/setup`
- Business connects a Paystack **restricted** secret key (read access to transactions and refunds only — never full access, never card data).
- Key is validated against Paystack live (a real API call, not just a format check) before being accepted.
- Key is stored in an httpOnly, `SameSite=Lax` cookie — never exposed to client-side JS, never echoed back in any API response.
- Live connection status badge (connected / not connected), with a disconnect action.
- Session sign-out.

### 6.3 `/inbox` (the core product)
**Composer (left panel):**
- Textarea for pasted customer text.
- Paste/drag-and-drop image attachment (bank alert or Paystack receipt screenshot), 4MB cap, thumbnail preview.
- Accepts text only, image only, or both in a single submission.
- "Load sample" for demo purposes.
- Submitted tickets populate a queue, each showing a verdict badge once processed.

**Three-column workspace (right panel), per selected ticket:**

| Column | Contents |
|---|---|
| **Message** | The customer's text as-is, plus an "Extracted" chip showing which method produced the fields (LLM vs. regex fallback) and an image-read status if applicable |
| **Paystack Truth** | Verdict badge (the only place brand accent color appears), fact ledger — status, amount, bank/last 4, paid-at timestamp, source (`paystack` / `ledger` / `none`) — and a short analyst note |
| **Draft Reply** | Editable reply text, generated only from the verdict; action buttons that change per verdict (see 6.3.1) |

**6.3.1 Verdict → action mapping**

| Verdict | Buttons available |
|---|---|
| Success, order not yet fulfilled | Approve · Edit · Resend receipt |
| Success, already fulfilled | Approve · Edit · Refund anyway |
| Failed / insufficient funds | Approve · Edit · Send retry link |
| Abandoned | Approve · Edit · Send fresh payment link |
| No reference found in message | No draft generated — "Needs human," prompt agent to request a bank statement line |
| Dispute/refund already exists | Show existing refund status; "Refund anyway" disabled to block a double refund |

- **Approve** is disabled until a real verdict exists (never enabled against a placeholder), and disabled for already-refunded or error states.
- Approving (or clicking any secondary action) writes a row to the audit log.
- A running "minutes saved" counter increments per approved ticket, for demo/reporting purposes.

### 6.4 `/log`
- Chronological audit ledger: timestamp, actor, action taken, verdict, extraction method, amount.
- Shows the last 100 entries.
- Stores only derived fields — the raw customer message text may be logged, but **the raw image is never persisted** past the request that processed it.

---

## 7. Pipeline requirements (system behavior)

### 7.1 Extraction (`/api/inbox/extract`)
- Input: text, image, or both, in a single request.
- Primary method: LLM call (vision-capable when an image is present), forced strict-JSON output: `{ reference, amount, phone, email }`, all nullable.
- If text and image are both present, the model cross-references them (e.g., customer says "45k," the screenshot shows "₦45,000.00").
- Fallback: regex extraction if the LLM call fails, times out, or is unavailable — the pipeline must degrade gracefully, never break.
- 4MB image size guard enforced before any LLM call is made.

### 7.2 Verify (`/api/inbox/verify`)
- Input: the extracted reference (and no client-supplied secret key — the key is always resolved server-side from the session cookie).
- Calls Paystack `transaction/verify/:reference`.
- Cross-checks the business's order ledger (Supabase) to distinguish "paid but not fulfilled" from "paid and already fulfilled."
- Scans the refund list to detect an existing refund and block a duplicate.
- Resolves to one of these verdicts: `success_unfulfilled`, `success_fulfilled`, `failed`, `abandoned`, `not_found`, `dispute_exists`, plus a general `error` state if Paystack is unreachable.
- Returns a `source` tag (`paystack` / `ledger` / `none`) so the UI can show exactly where the fact came from.

### 7.3 Draft (`/api/inbox/draft`)
- Input: the verdict and its associated facts **only** — never the raw customer message, never the image.
- Produces a short, plain-language reply stating the confirmed status, amount, and timestamp.
- Forced escalation template on `not_found` or `error` — the model is never allowed to guess a status.
- Deterministic per-verdict template fallback if no LLM key is configured, so the app still functions without an LLM dependency.

### 7.4 Approve (`/api/inbox/approve`)
- Input is allowlisted: message text, extraction result, extraction method, full verify result, draft text, action name.
- The raw image cannot reach the audit log by construction — it is not part of the allowlisted payload.

---

## 8. Data model (Supabase / Postgres)

- **transactions** — cached/observed Paystack transaction data relevant to processed tickets.
- **orders** — the business's own fulfillment ledger (reference/order id, fulfilled status, delivery date).
- **audit_log** — one row per approved/actioned ticket: timestamp, actor, action, verdict, extraction method, amount, and the allowlisted fields from section 7.4.
- **refunds** (via Paystack refund list, not necessarily mirrored locally) — checked live during verify to block double refunds.

Migrations should be additive (e.g., a fulfillment-columns migration) so schema changes don't require destructive resets during active development.

---

## 9. Security and privacy requirements

- Paystack secret keys: restricted-scope only, validated live before acceptance, stored httpOnly/never client-exposed, never echoed in any response, never accepted from a request body on any route.
- All four inbox API routes and the key-setup route require an authenticated session (401 otherwise).
- Customer-uploaded images (often bank alerts, which can show account names) are processed in-memory for the duration of one extraction call and are not persisted to storage or to the audit log.
- No full card data is ever requested, stored, or displayed — only reference, status, amount, and last 4 digits.
- Session cookies: httpOnly, `SameSite=Lax`, `Secure` in production only (secure cookies do not function over local HTTP in development).

---

## 10. Design system

- **Palette (Tailwind theme tokens):** paper `#F1EEE7` (background), ink-navy `#12313F` (text/authority), verified jade `#1F6E52` (reserved strictly for Paystack-confirmed states — never decorative), escalate ochre `#C97A2B` (pending/needs-human), failed brick `#B23A34` (failed/refund states), thread grey `#A9A29B` (hairlines, dividers, timestamps).
- No dark mode, by deliberate design choice — the paper aesthetic is the brand identity, not an oversight.
- Typography: Open Sans (UI chrome), Fraunces serif (document/voice moments), Inconsolata (figures and timestamps, for a ledger feel).
- Motion: short, purposeful (120–180–240ms), reduced-motion respected, hover effects gated to fine-pointer devices only.

---

## 11. Success metrics

| Metric | Target for MVP / demo |
|---|---|
| Time per ticket (paste → approved reply) | Under 60 seconds, down from 10–15 minutes |
| Hallucinated payment status rate | Zero — every reply traceable to a verify() call or a forced escalation |
| Verdict coverage | All 6+ verdict states demonstrably handled, not just the success path |
| Pilot validation | At least one real Lagos business using it on live (or test-mode) traffic during the pilot window |

---

## 12. Milestones

- ✅ Core pipeline built and wired: extraction (LLM + regex fallback), verify (Paystack + ledger + refund scan), draft (verdict-only), approve (allowlisted logging).
- ✅ Auth, per-business key storage, and the `/inbox`, `/log`, `/setup` pages built.
- ✅ First live test against real Paystack test-mode data — failed-payment verdict correctly detected and drafted.
- ⏳ Run outstanding schema/fulfillment migrations, confirm LLM provider keys, connect a Paystack key per environment.
- ⏳ Page-level auth redirects and RLS (row-level security) policies on Supabase tables.
- ⏳ Draft-provenance hardening (stronger guarantees that drafting cannot see anything beyond the verdict).
- ⏳ Pilot with one Lagos business (target window: Oct 12–23) to produce a "business tested it" proof point.
- ⏳ Demo polish: sample ticket set covering all verdicts, minutes-saved counter tuned for the live walkthrough.

---

## 13. Risks

- **"Why not just use Intercom?"** — the answer must be demonstrable, not just claimed: have a side-by-side case ready where a generic tool would answer confidently and wrong, and Resolve would correctly escalate or state the true verdict.
- **LLM extraction reliability on messy input** — regex fallback mitigates outright failure, but accuracy on ambiguous phrasing ("maybe ABC123 or ABC321") should be spot-checked before the pilot.
- **Image privacy** — bank alert screenshots are more sensitive than plain text (can show full account names). The no-persistence rule for images must hold under all code paths, not just the happy path.
- **Paystack rate limits / downtime** — verify() must fail into a safe "error → needs human" state, never a false "success" or "failed."

---

## 14. Out of scope for now (explicitly deferred)

- WhatsApp Business API direct integration (paste-based input is the MVP substitute).
- Analytics dashboard beyond the minutes-saved counter.
- Multi-currency / multi-gateway support (Kenya mobile money, UK cards) — the architecture should not prevent this later, but no work is planned now.
- Sentiment scoring or auto-routing rules.
