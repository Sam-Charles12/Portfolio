# Resolve — Product Spec (Pilot Readiness)

**Status:** Ready for Build — all open questions below are resolved decisions, not options
**Scope:** Everything required to take Resolve from "core pipeline works" to "safe to run a real pilot Oct 12–23"
**Companion doc:** `resolve-prd.md` (product requirements) — this spec covers the engineering decisions layered on top of it
**Last updated:** September 2026

---

## 1. Auth & tenancy scope

**Decision:** Full auth hardening now, not deferred to post-pilot. Proxy/redirect alone is a UI-layer control — without RLS, `/log` and the underlying tables are readable across businesses at the database level regardless of what the frontend shows.

**What ships:**
- `middleware.ts` (proxy) — page-level redirect for unauthenticated users, as already planned.
- Row-Level Security on `audit_log`, enforced at the database, not just the app layer.

**What does NOT ship (explicitly deferred):**
- `business_id` / multi-tenant columns on any table. Only one user per session exists today; building tenancy ahead of a real multi-user business is speculative complexity. Add it when a second real user on the same business account exists — not before.

---

## 2. RLS column & policy model

**`audit_log`:**
- Add `user_id uuid references auth.users(id)`.
- Enable RLS.
- Policies:
  - `select using (auth.uid() = user_id)`
  - `insert with check (auth.uid() = user_id)`
  - **No update, no delete policy.** An audit log that can be edited or deleted after the fact isn't an audit log.
- Revoke `anon` access entirely.

**`transactions` / `orders`:**
- Remain global demo/seed tables — **no owner column added.**
- RLS enabled with: `select to authenticated using (true)` — any authed user can read.
- No client-side insert/update/delete policy — writes are service-role only (seeding, sync jobs).

**Required code changes shipped in the same migration:**
- `/api/inbox/approve` insert must include `user_id: auth.uid()` — without this, every insert will fail once RLS is live.
- `/log` page query must add `.eq('user_id', user.id)` — without this, the page silently returns zero rows post-migration (looks like a bug; is actually the policy working).

---

## 3. Migration packaging

**Decision:** One migration file, e.g. `002_auth_rls.sql`, containing:
1. The `user_id` column addition on `audit_log`.
2. `ENABLE ROW LEVEL SECURITY` on all three tables.
3. All policies from Section 2.
4. Grant/revoke statements (`REVOKE ALL ON audit_log FROM anon`, etc.)

Not split into column-then-policy migrations — a column with no enforcing policy is a false sense of security for however long the gap lasts, and if anything writes to the table during that window, it produces unprotected rows that look protected.

**Shipped in the same change (not a follow-up PR):**
- Updated `approve` route insert (`user_id` field).
- Updated `/log` query (`.eq('user_id', ...)`).

---

## 4. Draft provenance (anti-hallucination hardening)

**Decision:** Strip `/api/inbox/draft` input to verdict + facts only. This is the product's core differentiator — a draft must never be able to reference anything the verify() call didn't confirm.

**Changes:**
- Remove `extraction` from the `/api/inbox/draft` request shape entirely.
- `templateDraft(verdict, facts, extraction)` → `templateDraft(verdict, facts)`.
- Any fallback that previously read `extraction.orderId` now reads `facts.orderId`, falling back to the string `"your order"` if absent. `facts` already carries `orderId`, `amount`, `currency`, `bank`, `last4`, `paidAt`, `refundStatus`, and `source` — sufficient for every verdict's template.
- Update the Zod input schema for this route to `VerifyResultSchema` only. **Reject the request** (not silently ignore) if `extraction`, `message`, or `image` keys are present in the payload — a rejected extra field is a loud signal if this leak is ever reintroduced; a silently-dropped one is not.

**Client-side change required in the same commit:**
- `inbox-workspace` currently POSTs `{ extraction, verify }` to `/draft`. Update it to send `{ verify }` only.
- No backwards compatibility shim. The old payload shape was the leak this section closes — keeping it accepted "just in case" reopens the exact gap being fixed.

---

## 5. Verdict naming

**Decision:** The PRD is updated to match the code's existing verdict names, not the reverse. The code is tested and already handles UI mapping and the double-refund block correctly against these names — renaming working enums to match a planning document is pure risk for no benefit.

**Canonical verdict names (code-first):**

| Code name | Meaning | Buttons shown |
|---|---|---|
| `success_unfulfilled` | Payment confirmed by Paystack, order not yet fulfilled | Approve · Edit · Resend receipt |
| `success_fulfilled` | Payment confirmed, order already fulfilled | Approve · Edit · Refund anyway |
| `failed_funds` | Paystack reports the transaction failed (commonly insufficient funds) | Approve · Edit · Send retry link |
| `abandoned` | Payment was initialized but never completed | Approve · Edit · Send fresh payment link |
| `no_reference` | No extractable payment reference in the message/image | No draft — "Needs human," request a bank statement line |
| `already_refunded` | A refund already exists for this reference | Show existing refund status; "Refund anyway" disabled |
| `verify_error` | Paystack unreachable, bad key, or other lookup failure | No draft — "Needs human," retry later |

The PRD's Section 7.2 and Section 12 milestones are updated to reference these exact names.

---

## 6. Demo seed data spec

**Decision:** Locked now so Build executes without guessing. 7 references total, one per verdict, no overlap between the two success cases.

**Critical rule:** `success_unfulfilled` and `success_fulfilled` **must** be genuine, separate Paystack test-mode transactions — not the same reference reused, and not demoed via the ledger-fallback ("unconfirmed upstream") path. The entire pitch is "we check the real thing live"; faking the two best-case verdicts via fallback undercuts that exact claim in front of a judge or the pilot business. Generate the real test-mode transactions in Paystack **first**, then write ledger rows matching those exact references/order IDs — the ledger is built around the real refs, not invented independently.

**Seed table:**

| Verdict | order_id | amount | fulfillment_status | Notes |
|---|---|---|---|---|
| `success_unfulfilled` | ORD-1001 | ₦25,000 | unfulfilled | Real Paystack test-mode ref required |
| `success_fulfilled` | ORD-1002 | ₦45,000 | fulfilled | Real Paystack test-mode ref required |
| `failed_funds` | ORD-1003 | ₦2,500 | n/a | Payment never succeeded |
| `abandoned` | ORD-1004 | ₦10,000 | n/a | Initialized, never completed |
| `no_reference` | — | — | n/a | Message contains no extractable reference |
| `already_refunded` | ORD-1005 | ₦8,000 | fulfilled, refund_status = refunded | Tests double-refund block |
| `verify_error` | ORD-1006 | — | n/a | Deliberately bad/expired key or unreachable ref |

6 seeded order rows (`no_reference` needs none), 1 of which is pre-refunded.

---

## 7. Pilot ledger CSV requirements

Required columns from the pilot business's order export:

| Column | Required? | Purpose |
|---|---|---|
| `order_id` | Yes | Primary match key for fulfillment status |
| `paystack_reference` | Yes | Join key for `/api/inbox/verify`'s ledger cross-check — without this, matching by amount/email alone is fragile (e.g. two same-day orders at the same total) |
| `email` | Yes | Secondary customer identification |
| `total` | Yes | Cross-check against Paystack's reported amount |
| `fulfillment_status` | Yes | Drives `success_unfulfilled` vs `success_fulfilled` |
| `refund_status` | No (optional) | Defaults to `none` if absent — most businesses won't have this tracked in an existing sheet |

**Pilot validation note:** even on a test-mode key, get the pilot business's real CSV structure as early as possible. Test-mode proves the pipeline works on synthetic data; the fulfillment cross-check is only actually validated once it runs against a real business's real data shape.

---

## 8. LLM provider lock for pilot

**Decision:** No code change — environment variable pin only (`LLM_MODEL_EXTRACT`, `LLM_MODEL_DRAFT`).

**Process before pinning:**
1. Run 3 real screenshots through both Anthropic and Groq extraction.
2. Include at least one non-ideal, real-world-style image (blurry, cropped, or a non-standard bank app UI) — not only clean demo screenshots.
3. Define the bar **before** running the test, not after: Groq keeps the default (for speed) unless Anthropic correctly extracts reference + amount with zero hallucinated digits on a clear majority of the set, in which case Anthropic wins on accuracy.
4. Pin the winner in `.env` and note the choice (and the date/test basis) in the doc — don't ship the pilot on an untested default.

---

## 9. Minutes-saved counter

**Decision:** Retune `MINUTES_PER_TICKET` from the current placeholder (4) upward — the PRD's own estimate is 10–15 minutes manual resolution vs. under 60 seconds with Resolve.

**Recommended value:** `11` — a specific, non-round number reads as measured rather than marketing-generated. Before locking it, ideally time one real manual ticket resolution end-to-end (stopwatch, not estimate) — a number traceable to an actual observation is far harder to challenge than one traced back to "the PRD said so."

---

## 10. Cleanup (bundled, single low-risk commit)

Ships together as one commit — all are doc/hygiene changes, with zero behavioral risk except the counter constant itself:

1. Set `MINUTES_PER_TICKET = 11` (or the timed value from Section 9).
2. Delete `src/lib/pipeline.ts` — confirmed superseded by `inbox.ts`. **Grep for any remaining import of it (`from ".*pipeline"`) before deleting** to avoid a build break.
3. Update PRD Section 7.2 (verdict names) and Section 12 (milestones) to match Section 5 of this spec.

---

## 11. Summary checklist for Build

- [ ] `002_auth_rls.sql` — column, RLS, policies, grants, all in one file
- [ ] `approve` route — add `user_id` to insert
- [ ] `/log` — add `.eq('user_id', user.id)` to query
- [ ] `/api/inbox/draft` — strict `VerifyResultSchema` input, reject extra keys, drop `extraction` param from `templateDraft`
- [ ] `inbox-workspace` client — send `{ verify }` only to `/draft`, no back-compat
- [ ] PRD Section 7.2 + Section 12 — verdict names and milestones updated to code names
- [ ] Seed 6 order rows + 2 real Paystack test-mode transactions per Section 6
- [ ] Confirm pilot business CSV includes `paystack_reference` (request if missing)
- [ ] Run 3-screenshot LLM comparison, pin `LLM_MODEL_EXTRACT`/`LLM_MODEL_DRAFT`
- [ ] Set `MINUTES_PER_TICKET`, delete `pipeline.ts` (after import grep), update PRD — single commit
