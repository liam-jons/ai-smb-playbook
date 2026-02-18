# Continuation Prompt 20 — Non-Blocking Cleanup & Client Onboarding Skill

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. Two outputs per client deployment:
1. **Interactive Playbook** -- React app with two audience tracks (General Users / Developers)
2. **Starter Kit** -- Drop-in skill files, commands, templates, governance policy

**Read first:** `CLAUDE.md` at the project root -- conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### Sessions 17--18 — Multi-Tenant Implementation & Audit

Six-phase multi-tenant architecture committed to `main`. Single Vite SPA deployed on Vercel. Client identified by subdomain (`phew.playbook.aisolutionhub.co.uk`). Config loaded at runtime from `/clients/{slug}.json`, merged with defaults, cached in localStorage (1-hour TTL). React context (`ClientConfigProvider`) provides config to all components via `useSiteConfig()`, `useOverlays()`, `useSectionsConfig()` hooks. Full audit documented at `docs/audit-findings/20260218-multi-tenant/multi-tenant-implementation-audit.md`.

### Session 19 — FAIL Item Resolution & Onboarding Skill Design

Resolved all 10 FAIL items from the audit (86% → 100% pass rate) using 4 parallel subagents, plus produced a client onboarding skill design document.

| Commit | Theme | What It Fixed |
|--------|-------|---------------|
| `c98b944` | Section visibility gating | `hasDeveloperTrack` and `sections.enabled/disabled` now consumed. Sidebar, HomePage, TrackLayout all gate developer content. Route guard redirects `/developer/*` when disabled. |
| `3010173` | Overlay consumption wiring | `useOverlays()` now has callers. Brand voice, recurring tasks, and ROI sections all read overlay data with fallback to siteConfig defaults. |
| `c246a24` | Starter kit tier display | Base/custom split with category gating. "Additional for your organisation" separator for enabled custom items. |
| `3953069` | Onboarding skill design doc | 478-line design document at `docs/reference/client-onboarding-skill-design.md` covering input mapping, transcript extraction, overlay generation, two-phase interaction pattern, validation pipeline, and 8 open questions. |

### Build Status

- `cd app && bun run build` -- pass
- `cd app && bun run lint` -- pass
- `cd app && bun run format:check` -- pass

---

## What This Session Does: Non-Blocking Cleanup + Onboarding Skill Implementation

Two parallel workstreams:
1. **Workstream A** — Resolve the 7 non-blocking concerns (C1--C7) from the audit. These are ideal for subagents since they are independent, low-risk, and have clear specifications.
2. **Workstream B** — Continue the client onboarding skill, moving from the design document to implementation. This is the main-session focus.

Additionally:
3. **Workstream C** — Browser testing of the FAIL item fixes from session 19.
4. **FAIL 3.1** — Create a generic default config (requires user input first).

### Recommended session flow

1. Dispatch subagents for C1--C7 in parallel (Workstream A).
2. While subagents work, discuss FAIL 3.1 default config requirements with the user.
3. Begin Workstream B (onboarding skill implementation) in the main session.
4. After subagents complete, run browser testing (Workstream C) to verify both the session 19 FAIL fixes and the C1--C7 changes.

---

## Workstream A: Non-Blocking Concerns (7 items — subagent candidates)

All 7 concerns are documented in the full audit at `docs/audit-findings/20260218-multi-tenant/multi-tenant-implementation-audit.md`. Detailed specifications below for subagent dispatch.

### C1: Remove dead `x-client-id` header infrastructure (15 min)

**File:** `app/middleware.ts`
**Issue:** The middleware sets `x-client-id` but nothing reads it. The middleware matcher excludes `/api` routes, so the feedback API cannot read it. The feedback API independently derives the slug from the Referer header.
**Fix:** Remove the `x-client-id` header injection from the middleware. The middleware should still exist (it is Vercel Edge Middleware discovered automatically) but can be simplified to a pass-through, or removed entirely if no other middleware logic is needed. If removing the file entirely, verify that Vercel deploys correctly without it.
**Acceptance criteria:** `app/middleware.ts` either removed or simplified. Feedback API continues to work (it derives slugs from Referer independently). Build passes.

### C2: Deduplicate `extractClientSlug()` (30 min)

**Files:**
- `app/middleware.ts:25` (Edge Middleware version)
- `app/src/config/config-loader.ts:30` (SPA version — has dev overrides via `?client=` and `VITE_DEFAULT_CLIENT`)
- `app/api/feedback.ts:32` (Serverless function version)

**Issue:** Three independent implementations of the same slug extraction function. Currently identical core logic but will drift over time. The SPA version has additional dev-mode overrides.
**Fix:** Extract the shared core logic to `app/src/utils/slug.ts`. Export a `extractClientSlug(hostname: string): string` function with the common logic (localhost check, subdomain parsing). The SPA version in `config-loader.ts` should import this shared function and wrap it with its dev overrides (`?client=` param, `VITE_DEFAULT_CLIENT` env var). The feedback API should import and use it. The middleware is an Edge function (runs in a different runtime) — check whether it can import from `src/utils/` or if it needs its own copy. If Edge Middleware cannot import from `src/`, document this limitation and keep the middleware copy.
**Important constraint:** The feedback API runs as a Vercel Serverless Function (Node.js) at `app/api/feedback.ts`. The middleware runs as Vercel Edge Middleware. The SPA code runs in-browser. All three have different import resolution. The shared utility needs to be importable by at least the SPA and feedback API. Test with `bun run build` to confirm.
**Acceptance criteria:** Shared utility created. At least 2 of 3 callers use it. Build passes.

### C3: Add slug sanitisation to shared utility (15 min)

**Files:** `app/api/feedback.ts:40-46` (has sanitisation), `app/middleware.ts` (none), `app/src/config/config-loader.ts` (none)
**Issue:** Only the feedback API validates slugs with `/^[a-z0-9-]+$/`. The config-loader uses unsanitised slugs in fetch URLs (`/clients/${slug}.json`). The middleware injects unsanitised values into HTTP headers.
**Fix:** Add the `sanitiseSlug()` function to the shared utility from C2. Apply it in the config-loader's `loadClientConfig()` before using the slug in the fetch URL. If the middleware still exists after C1, apply it there too.
**Dependency:** C2 should be completed first (or done by the same agent).
**Acceptance criteria:** `sanitiseSlug()` exported from the shared utility. Config-loader uses it. Build passes.

### C4: DEFAULT_CONFIG overlays — HANDLED BY SESSION 20a

**Absorbed into `continuation-prompt-20a-generic-default-config.md`.** The user chose Option A (generic default config). With Option A, empty overlays in `DEFAULT_CONFIG` are intentional — sections fall back to siteConfig-derived generic text. Phew gets its overlays from `phew.json` on its subdomain. **Skip this concern in session 20.**

### C5: Accept HallucinationsSection as-is (0 min)

**File:** `app/src/content/developer/HallucinationsSection.tsx`
**Issue:** The plan said to "remove general-audience versions of Patterns 1, 2, 3, 5" from the developer section. Instead, they were kept with developer-specific framing (code examples). Both tracks have their own versions. This appears to be a deliberate choice.
**Recommendation:** Accept as-is. No action needed. The cross-references between tracks are in place, and having developer-framed versions with code examples is arguably better than removing them.
**Action:** None. Mark as accepted in the audit.

### C6: Add client identifier to feedback submissions (15 min)

**File:** `app/src/components/layout/FeedbackWidget.tsx:96-99`
**Issue:** The widget sends `{ category, message }` but no tenant identifier. When multiple clients are deployed, feedback emails will be indistinguishable (the `emailSubjectPrefix` partially mitigates this on the email side, but the POST body has no client info).
**Fix:** Import `useSiteConfig()` in the FeedbackWidget. Add the `companyShortName` (or the client slug) to the POST body. Update the feedback API (`app/api/feedback.ts`) to include the client identifier in the email body text.
**Files to modify:**
- `app/src/components/layout/FeedbackWidget.tsx` — add client identifier to fetch body
- `app/api/feedback.ts` — read client identifier from body and include in email text
**Acceptance criteria:** Feedback email body includes the client company name or slug. Build passes.

### C7: Add build validation step to CUSTOMISATION.md (5 min)

**File:** `CUSTOMISATION.md`
**Issue:** No step instructs the consultant to run `bun run build` after creating a client JSON to validate it against the TypeScript schema.
**Fix:** Add a validation step between step 5 (configure starter kit categories) and step 6 (add subdomain in Vercel). The new step should read:

```
6. **Validate the config:**
   ```bash
   cd app && bun run build
   ```
   This runs the TypeScript compiler and Vite build. If the build fails, check for missing required fields or type mismatches against the schema in `app/src/config/client-config-schema.ts`.
```

Renumber existing steps 6 and 7 to 7 and 8.
**Acceptance criteria:** CUSTOMISATION.md has a validation step. Steps are correctly numbered.

### Agent Allocation for Workstream A

| Agent | Concerns | Files Owned | Notes |
|-------|----------|-------------|-------|
| **Agent A** (Slug & Middleware) | C1, C2, C3 | `app/middleware.ts`, `app/src/utils/slug.ts` (new), `app/src/config/config-loader.ts`, `app/api/feedback.ts` | C1 first (may remove middleware), then C2 and C3 together. These three are interdependent. |
| **Agent B** (Feedback Identifier) | C6 | `app/src/components/layout/FeedbackWidget.tsx`, `app/api/feedback.ts` | **Depends on Agent A completing C2/C3** — both modify `feedback.ts`. Schedule after Agent A. |
| **Agent C** (Docs) | C5, C7 | `CUSTOMISATION.md` | Independent. Can run in parallel with all others. |

**Recommended dispatch order:**
1. Dispatch Agent A (C1/C2/C3) and Agent C (C5/C7) in parallel immediately.
2. After Agent A completes, dispatch Agent B (C6).

---

## Workstream B: Client Onboarding Skill Implementation

### Design Document

Read first: `docs/reference/client-onboarding-skill-design.md` (478 lines). This is the output from session 19's investigation and covers:
- Consultant input mapping (5--7 explicit inputs needed for a typical client)
- Training transcript extraction strategy (draft-and-refine, not parse-and-commit)
- Overlay content generation (brand voice from website scrape + transcript, recurring tasks from transcript, ROI from transcript)
- Two-phase interaction pattern (Phase 1: automated extraction + draft; Phase 2: grouped review)
- Validation pipeline (schema conformance, content quality, build verification, deployment checklist)
- 8 open questions

### Evaluation Data (3 clients)

Real training session data is available for evaluating the skill:

| Client | Folder | Files | Size | Notes |
|--------|--------|-------|------|-------|
| **Phew Design** (ground truth) | `.planning/client-specific/00-phew/` | Training summaries, full transcripts | Various | This is the client the current app was built for. The existing `phew.json` serves as the expected output — a perfect skill would regenerate something equivalent. |
| **AMD Engineering** | `.planning/client-specific/01-amd/` | `amd-training-summary.md` (4.6 KB), `amd-training-transcript.md` (188 KB) | 193 KB total | Construction/engineering company, ~15 attendees, Sage 200, PQQ automation, contract review, certificate expiry management. The summary is a 5 KB structured document. The full transcript is a 188 KB unstructured text blob from Granola. |
| **Borough Engineering** | `.planning/client-specific/02-borough/` | `borough-training-summary.md` (3.6 KB), `borough-training-session-02-summary.md` (4.3 KB) | 8 KB total | Engineering services, construction sector, PQQ/tender automation, ONS forms, quality certification tracking. Two sessions: morning (AI fundamentals) and afternoon (4D framework, policy development, tender completion demo). |

### Transcript Strategy Decision

The skill needs training session data as input. Two options for handling large transcripts:

1. **Summary-only approach.** Use only the AI-generated summary files (3--5 KB each). These are structured, concise, and capture the key information. This limits context window usage and keeps the skill fast. The trade-off is that summaries may miss nuanced details (specific tool names mentioned in passing, exact team sizes, compliance specifics).

2. **Granola question function.** Granola (the transcription tool) has a built-in function that lets you ask specific questions of the full transcript and get targeted answers. The skill could use this to extract specific data points without loading the full 188 KB transcript. For example: "What testing tools were mentioned?" or "What compliance areas were discussed?" This gives the depth of the full transcript with the efficiency of targeted extraction.

**Recommendation:** Start with option 1 (summary-only) and evaluate whether the summaries provide enough data to generate quality configs. Test against the Phew ground truth — if the summary-only approach produces a config close to the existing `phew.json`, the full transcript adds marginal value. If significant gaps appear, document which fields need the full transcript and consider option 2 for those specific fields.

### Implementation Plan

1. **Create the skill file** at `.claude/skills/client-onboarding/SKILL.md` following the design document's proposed structure.
2. **Implement Phase 1** (extraction and draft generation) — the automated part that reads a transcript/summary, extracts fields, derives defaults, and generates overlay content.
3. **Implement Phase 2** (grouped review) — the interactive confirmation/editing steps.
4. **Implement the validation pipeline** — schema conformance, content quality checks, build verification.
5. **Test with Phew data** — run the skill against the Phew training summaries and compare the output to `phew.json`.
6. **Test with AMD data** — run the skill against `amd-training-summary.md` to generate a new client config. Evaluate quality.
7. **Test with Borough data** — run the skill against both Borough summaries.

---

## FAIL 3.1: Generic Default Config — HANDLED BY SESSION 20a

**Resolved in a separate session.** See `continuation-prompt-20a-generic-default-config.md`. The user chose **Option A** (truly generic DEFAULT_CONFIG). That session handles:
- Updating `site.ts` with generic values
- Verifying `phew.json` has all 33 fields (so Phew subdomain is unaffected)
- Reviewing prose readability across all sections with generic interpolated values
- Browser testing both generic and Phew configurations

**Skip FAIL 3.1 in session 20.** If session 20a has already run, `config-loader.ts` will have generic DEFAULT_CONFIG values and `site.ts` will have generic values. The C2/C3 slug extraction changes in session 20 should not conflict (different functions in `config-loader.ts`).

---

## Workstream C: Browser Testing

After Workstreams A and B are complete (or during development), deploy browser testing agents to verify:

### Session 19 FAIL Fixes

| Test | What to Verify | URL |
|------|---------------|-----|
| Section visibility gating | Visit with `?client=phew` — confirm developer track visible. Create a test config with `hasDeveloperTrack: false` — confirm developer track hidden, `/developer` redirects to `/general`. | `http://localhost:4100` |
| Overlay consumption | Visit with `?client=phew` — confirm brand voice section shows Phew-specific overlay content (not generic defaults). Visit without client param — confirm fallback to siteConfig-derived text (after C4 fix, should show Phew overlays on base domain too). | `http://localhost:4100` |
| Starter kit tiers | Visit with `?client=phew` — confirm base items shown, `developer-tools` and `creative-design` custom items shown under "Additional" separator. Other custom categories hidden. | `http://localhost:4100` |

### Workstream A Fixes

| Test | What to Verify |
|------|---------------|
| C6: Feedback identifier | Submit feedback via the widget. Check the resulting email includes the client name/slug. |

### Approach

Use the agent-browser skill or Playwright MCP to:
1. Start the dev server (`cd app && bun run dev`)
2. Navigate to test URLs
3. Take screenshots and verify content
4. Test with different `?client=` parameters

---

## Key Reference Files

| File | Purpose |
|------|---------|
| `docs/audit-findings/20260218-multi-tenant/multi-tenant-implementation-audit.md` | Full audit findings — source of truth for all concerns |
| `docs/reference/client-onboarding-skill-design.md` | Onboarding skill design document (session 19 output) |
| `app/src/config/client-config-schema.ts` | `ClientConfig` TypeScript interface |
| `app/src/config/config-loader.ts` | Config loading, caching, slug extraction, `DEFAULT_CONFIG` |
| `app/src/config/site.ts` | Current Phew-specific siteConfig values (source for `DEFAULT_CONFIG`) |
| `app/src/hooks/useClientConfig.ts` | `useSiteConfig()`, `useOverlays()`, `useSectionsConfig()` hooks |
| `app/middleware.ts` | Vercel Edge Middleware (C1 target) |
| `app/api/feedback.ts` | Feedback API serverless function (C2/C3/C6 target) |
| `app/src/components/layout/FeedbackWidget.tsx` | Feedback widget component (C6 target) |
| `CUSTOMISATION.md` | Client deployment guide (C7 target) |
| `app/public/clients/phew.json` | Phew client config (ground truth for skill evaluation) |
| `app/public/clients/_template.json` | Template for new clients |
| `.planning/client-specific/00-phew/` | Phew training data (ground truth) |
| `.planning/client-specific/01-amd/` | AMD training data (summary + 188 KB transcript) |
| `.planning/client-specific/02-borough/` | Borough training data (2 session summaries) |

---

## Key Conventions Reminder

- **UK English throughout.** All content, copy, and code comments use UK English spelling and grammar.
- **Build check after changes:** `cd app && bun run build` (TypeScript + Vite build). Also `bun run lint` and `bun run format:check`.
- **No test suite.** Quality checks are build, lint, and format only.
- **Commit each concern/theme separately** where practical.
- **Overlay precedence:** Overlay data replaces siteConfig-derived defaults when present. Absent overlays fall back to siteConfig-interpolated content.
- **Tailwind v4 — no config file.** Theme customisation is in `app/src/index.css` via `@theme inline {}`.
- **Path aliases:** `@/` maps to `app/src/`.
- **Use subagents for independent work** to manage main-session context effectively.

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format       # Prettier — format all files
cd app && bun run format:check # Prettier — check without writing
```

## Deployment

- **Production:** https://ai-smb-playbook.vercel.app
- **Repository:** https://github.com/liam-jons/ai-smb-playbook
- Auto-deploys on push to `main` via Vercel

## Verification After This Session

- [ ] Non-blocking concerns resolved: C1, C2, C3, C5 (accept), C6, C7 (C4 handled by session 20a)
- [ ] Build passes: `cd app && bun run build`
- [ ] Lint passes: `cd app && bun run lint`
- [ ] Format passes: `cd app && bun run format:check`
- [ ] Client onboarding skill file created at `.claude/skills/client-onboarding/SKILL.md`
- [ ] Skill tested against Phew training data — output compared to `phew.json`
- [ ] Skill tested against AMD training summary — new config generated
- [ ] Skill tested against Borough training summaries — new config generated
- [ ] Browser testing confirms session 19 FAIL fixes (visibility gating, overlays, starter kit tiers)
- [ ] Browser testing confirms C6 fix (feedback widget includes client identifier)
- [ ] FAIL 3.1 handled by session 20a (verify no conflicts if both sessions run)

## Open Items

1. **FAIL 3.1 — generic default config.** Requires user decision on which option (A, B, or C) and what the generic placeholder values should be. See the dedicated section above.
2. **Transcript strategy.** Start with summary-only and evaluate. If gaps appear, consider Granola's question function for targeted extraction from full transcripts.
3. **AMD full transcript (188 KB).** Available at `.planning/client-specific/01-amd/amd-training-transcript.md` but too large for direct context injection. Use summary-only first; fall back to Granola queries if needed.
4. **Overlay key stability.** The ROI overlay uses freeform task ID keys. The onboarding skill needs guidance on which keys are standard vs. client-specific — this should be documented or enforced in the schema as part of the skill implementation.
