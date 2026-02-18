# Continuation Prompt 36 — AMD Production Readiness Fixes

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. The app is deployed as a multi-tenant SPA — each client gets a subdomain and a JSON config file. A single build serves all clients. Two outputs per client deployment:
1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, commands, templates, governance policy

**Read first:** `CLAUDE.md` at the project root — conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### Sessions 17–33: Multi-tenant architecture, onboarding skill, AMD & Borough research — Complete

Full multi-tenant SPA on `main`. AMD Group config written and validated. Borough research produced from degraded sources (website down). Onboarding skill and client-research command both operational.

### Session 35 (partial): AMD bug fixes — 5 of 5 completed

Five bugs from browser testing were fixed:
1. **Header "Developers" link** — now hidden when `hasDeveloperTrack: false` (desktop + mobile)
2. **ROI key mismatch** — renamed `pqq-automation` → `proposal-writing` in `amd.json`
3. **Contract review template** — added `contract-review` TaskTemplate to `roi-data.ts`
4. **welcomeSubtitle wiring** — `SectionPage.tsx` now reads `siteConfig.welcomeSubtitle` for the welcome section
5. **compliance-security category** — removed from AMD's `enabledCustomCategories` (dev-only content)

**All fixes pass build, lint, and format checks.**

### Session 35: Production readiness audit — Complete (3 parallel subagents)

Three audit agents ran comprehensive reviews:
- **Browser/functional audit**: Score **7.5/10** — architecture works, overlays render, developer track hidden in most places
- **Content completeness audit**: AMD delivers **~70% of Phew's personalised value** — strong where parameterised, 3 sections entirely generic
- **Overlay quality audit**: Score **4.6/5** — accurate, well-sourced, AMD-specific with few gaps

**10 issues identified** (prioritised below). All are documented with file paths and fix approaches.

### Uncommitted changes

The working tree has changes from **two sources**:
1. **Session 31 homepage critique refinements** (10 modified files — `SimulatorControls.tsx`, `HomePage.tsx`, `Sidebar.tsx`, `site.ts`, `HallucinationsSection.tsx`, `TechnicalDebtSection.tsx`, `SessionManagementSection.tsx`, `StarterKitSection.tsx`, `WelcomeSection.tsx`, `starter-kit-data.ts`)
2. **Session 35 bug fixes** (`Header.tsx`, `SectionPage.tsx`, `roi-data.ts`, `amd.json`)

Branch is **6 commits ahead** of `origin/main`.

---

## What This Session Does

Fix all 10 production readiness issues and commit. These are designed for **parallel subagent execution** — tasks are grouped by independence.

### Parallel Group A: Code Fixes (3 independent file changes)

#### Task 1: WelcomeSection track-switch link — MUST FIX
- **File:** `app/src/content/shared/WelcomeSection.tsx` (lines 334–345)
- **Bug:** "Looking for the Developer Guide?" link renders unconditionally. AMD users see it, click it, get redirected back to `/general` — a confusing loop.
- **Fix:** Import `useSiteConfig` hook (already available via `useClientConfig.ts`). Wrap the track-switch `<p>` block (lines 334–345) in `{siteConfig.hasDeveloperTrack && (...)}`.
- **Verify:** The `WelcomeSection` already uses `useSiteConfig()` (check line ~293 for `siteConfig.trainingDate`), so the hook is already called — just use the existing `siteConfig` variable.

#### Task 2: NotFoundPage "Developer Track" button — MUST FIX
- **File:** `app/src/components/layout/NotFoundPage.tsx` (lines 27–32)
- **Bug:** 404 page always shows a "Developer Track" button. For AMD, this links to `/developer` which redirects to `/general`.
- **Fix:** Add `useSiteConfig` hook to the component. Wrap the Developer Track `<Button>` (lines 27–32) in `{siteConfig.hasDeveloperTrack && (...)}`.
- **Note:** This component currently doesn't import any config hooks — you'll need to add the import.

#### Task 3: Config loading flash (FOUC) — SHOULD FIX
- **File:** `app/src/config/client-config-context.tsx`
- **Bug:** When a non-default client loads (e.g. `?client=amd`), the app starts with `DEFAULT_CONFIG` (which has `hasDeveloperTrack: true`, title "AI Playbook", company "Your Organisation") and then re-renders once the JSON loads. Users briefly see the wrong title, developer track card, and default company name.
- **Current state:** `isLoading` state is already tracked (line 40: `useState(clientSlug !== 'default')`) but **no component checks it**.
- **Fix approach:** In `ClientConfigProvider`, render nothing (or a minimal loading skeleton) while `isLoading` is true, instead of rendering children with the default config. The simplest version:
  ```tsx
  // In ClientConfigProvider, before the return:
  if (isLoading) {
    return (
      <ClientConfigContext.Provider value={{ config, isLoading, clientSlug, error }}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </ClientConfigContext.Provider>
    );
  }
  ```
  This prevents any child component from rendering with default values. The context is still provided (so no missing provider errors) but the UI is a spinner until the real config arrives.
- **Consider also:** The error state — if `loadClientConfig` fails, the app currently silently uses the default config. After adding a loading gate, it should show an error message instead.

### Parallel Group B: Content Improvements (3 independent JSON/data changes)

#### Task 4: Brand voice key "2" — expand to 3-5 attributes — SHOULD FIX
- **File:** `app/public/clients/amd.json` → `overlays.brandVoice.frameworkExamples["2"]`
- **Issue:** Currently provides only 1 voice attribute ("Professional and technically assured"). The framework expects 3–5 attributes with "we are / we are not / sounds like" definitions. This limits usefulness when AMD employees use Claude for diverse content types (tenders vs internal comms vs social media).
- **Recommended additional attributes** (derived from research at `.planning/client-specific/01-amd/amd-group-site-content.md`):

  **Attribute 2 — Safety-rigorous:** "We are thorough, evidence-based, and uncompromising on compliance. We are not bureaucratic for its own sake or dismissive of safety as box-ticking. Sounds like: 'Every project begins with a comprehensive RAMS review — because safe delivery is the foundation, not an afterthought.'"

  **Attribute 3 — Collaboration-focused:** "We are partnership-minded, relationship-driven, and invested in repeat business. We are not transactional, one-project-and-gone, or adversarial with principal contractors. Sounds like: 'We've worked with Wates across multiple projects because we deliver what we promise — and they know our team by name.'"

  **Attribute 4 — Sustainability-committed:** "We are genuinely invested in low-carbon outcomes, not just compliance. We are not greenwashing or treating sustainability as a marketing exercise. Sounds like: 'Our in-house design team models energy lifecycle costs from day one — heat pumps, photovoltaics, and BMS integration are standard practice, not optional extras.'"

- **Format:** Combine all attributes into a single string for key "2", each separated by a newline. Match the existing pattern from Phew's config for structure reference.

#### Task 5: Replace meeting minutes with O&M manual generation — SHOULD FIX
- **File:** `app/public/clients/amd.json` → `overlays.recurringTasks.examples[3]` AND `siteConfig.exampleRecurringTasks[3]`
- **Issue:** The fourth recurring task ("Meeting minutes and action extraction") is the most generic example — it applies to any company. O&M manual generation was explicitly discussed in the AMD training session and is highly MEP-specific.
- **Replace with:**
  ```json
  {
    "title": "O&M manual compilation",
    "description": "A skill that gathers technical data sheets, commissioning records, and as-built drawings for a completed project, then compiles them into a structured Operation and Maintenance manual in AMD Group's standard format. The project engineer reviews for accuracy and completeness before handover. Particularly valuable for design-and-build projects where AMD Group controls the full documentation chain."
  }
  ```
- **Also update** `siteConfig.exampleRecurringTasks[3]` from `"meeting minutes and action extraction"` to `"O&M manual compilation"`.
- **Source:** Training summary confirms O&M manual generation as a discussed use case (`.planning/client-specific/01-amd/amd-training-summary.md`). Research document Section 13 item 4 also identifies this.

#### Task 6: Starter kit category mismatch — SHOULD FIX
- **File:** `app/src/content/shared/starter-kit-data.ts`
- **Issue:** Writing Plans and Writing Skills have `tracks: ['general']` but are assigned to `customCategory: 'developer-tools'`. AMD has `enabledCustomCategories: ["business-development"]` so these useful general-track items are inaccessible. AMD gets 10 starter kit items vs Phew's 12.
- **Recommended fix:** Reclassify Writing Plans and Writing Skills from `developer-tools` to `business-development`. Rationale:
  - Both are general-track skills (`tracks: ['general']`)
  - Writing plans (structuring multi-step tasks) is directly relevant to proposal/bid writing
  - Writing skills (creating effective Claude skills) enables AMD to build custom PQQ automation skills
  - `business-development` is the natural home for tools that help win and deliver work
- **Find and change** for both items:
  ```
  customCategory: 'developer-tools'  →  customCategory: 'business-development'
  ```
- **IDs to find:** `skill-writing-plans` and `skill-writing-skills` in the `getStarterKitFiles()` return array.
- **Verify:** After the change, AMD should see 12 starter kit items (matching Phew's general-track count).

### Parallel Group C: Schema Cleanup (can run alongside A and B)

#### Task 7: Remove dead `certificationName` field — NICE TO FIX
- **Files:**
  - `app/src/config/client-config-schema.ts` — remove `certificationName` from the `SiteConfigData` interface
  - `app/src/config/site.ts` — remove `certificationName` from the bundled defaults
  - `app/public/clients/phew.json` — remove `certificationName: "DBS checks"` from siteConfig
  - `app/public/clients/_template.json` — remove `certificationName` placeholder
- **Context:** Field suitability audit in session 33 confirmed no component reads this field. It was identified as dead config but never cleaned up.

#### Task 8: Remove dead `primaryAiTool` field — NICE TO FIX
- **Files:** Same as Task 7 — schema, site.ts, phew.json, _template.json, and amd.json
- **Context:** Set to `"Claude"` in every config but no component reads `siteConfig.primaryAiTool`. All references to "Claude" in content components are hardcoded strings. Removing it reduces config surface area without any functional change.

### Standalone Tasks

#### Task 9: Consider Murray Halliday naming — DECISION NEEDED
- **File:** `app/public/clients/amd.json` → `overlays.roi.clientExamples["contract-review"]`
- **Issue:** The contract review ROI example names Murray Halliday: "Murray Halliday already uses AI to highlight key clauses and risks in subcontract documents." While this demonstrates the example is real, naming an individual in a company-wide playbook could be sensitive.
- **Options:**
  - (a) Keep as-is — names add credibility and AMD is a small enough company that everyone knows Murray
  - (b) Anonymise to "Your commercial team already uses AI to highlight key clauses..."
  - (c) Ask the consultant to check with Murray first
- **Recommend:** Option (c) — ask Liam to confirm with Murray. For now, leave as-is and flag for the consultant.

#### Task 10: Generic sections — DOCUMENT ONLY (no code change)
- **Sections with zero parameterisation:** Context (1.2), Reliable Output (1.3b), Skills & Extensions (1.4)
- **These are educational/tutorial sections** — they teach Claude concepts that are the same regardless of client. The lack of parameterisation is a design choice, not a bug.
- **However:** Even adding `companyShortName` into one or two examples per section (e.g. "When your team at AMD Group starts a new session...") would reduce the generic feel.
- **Action for this session:** No code change. Document as a future enhancement for the next design review session.

---

## Execution Plan for Subagents

**Launch 3 parallel subagents:**

1. **Code fixes agent** (Tasks 1, 2, 3) — modifies `WelcomeSection.tsx`, `NotFoundPage.tsx`, `client-config-context.tsx`
2. **Content agent** (Tasks 4, 5, 6) — modifies `amd.json`, `starter-kit-data.ts`
3. **Schema cleanup agent** (Tasks 7, 8) — modifies `client-config-schema.ts`, `site.ts`, `phew.json`, `_template.json`, `amd.json`

**After all agents complete:**
- Run `cd app && bun run build && bun run lint && bun run format:check`
- Run browser test agent against `http://localhost:4100/?client=amd` to verify fixes
- Also test `http://localhost:4100/?client=phew` to confirm no regressions

**Then commit all changes** (bug fixes, content improvements, schema cleanup) as a single commit or two logical commits (code fixes + content improvements).

---

## Key Files

### Bug Fix Targets
```
app/src/content/shared/WelcomeSection.tsx              # Task 1: track-switch link
app/src/components/layout/NotFoundPage.tsx              # Task 2: developer track button
app/src/config/client-config-context.tsx                # Task 3: config loading flash
```

### Content Targets
```
app/public/clients/amd.json                             # Tasks 4, 5, 9: overlay improvements
app/src/content/shared/starter-kit-data.ts              # Task 6: category reclassification
```

### Schema Cleanup Targets
```
app/src/config/client-config-schema.ts                  # Tasks 7, 8: remove dead fields
app/src/config/site.ts                                  # Tasks 7, 8: remove defaults
app/public/clients/phew.json                            # Tasks 7, 8: remove field values
app/public/clients/_template.json                       # Tasks 7, 8: remove placeholders
```

### Ground Truth & Reference
```
app/public/clients/phew.json                            # Ground truth client config
app/public/clients/_template.json                       # Template for new clients
.planning/client-specific/01-amd/amd-group-site-content.md  # AMD research (30 KB)
.planning/client-specific/01-amd/amd-training-summary.md    # Training summary
```

---

## Key Conventions Reminder

- **UK English throughout.** All content, examples, copy. Use £ not $.
- **Tailwind v4 — no config file.** Theme in `app/src/index.css` via `@theme inline {}`.
- **bun** for all package operations.
- **Multi-tenant SPA.** One build, many clients. Config from `/clients/{slug}.json`.
- **Never import `site.ts` directly in components.** Use context hooks (`useSiteConfig()`, `useOverlays()`).

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format:check # Prettier check
```

## Verification After This Session

- [ ] Task 1: WelcomeSection hides "Developer Guide" link when `hasDeveloperTrack: false`
- [ ] Task 2: NotFoundPage hides "Developer Track" button when `hasDeveloperTrack: false`
- [ ] Task 3: No config flash — spinner or skeleton shown while client config loads
- [ ] Task 4: Brand voice key "2" has 3-5 attributes (not just 1)
- [ ] Task 5: Fourth recurring task is O&M manual compilation (not meeting minutes)
- [ ] Task 6: Writing Plans and Writing Skills accessible to AMD (in `business-development` category)
- [ ] Task 7: `certificationName` removed from schema, site.ts, phew.json, template
- [ ] Task 8: `primaryAiTool` removed from schema, site.ts, all client configs, template
- [ ] Task 9: Murray Halliday naming decision documented / flagged for consultant
- [ ] Task 10: Generic sections documented as future enhancement
- [ ] Build passes: `cd app && bun run build`
- [ ] Lint passes: `cd app && bun run lint`
- [ ] Format passes: `cd app && bun run format:check`
- [ ] AMD browser test passes (all 10 general-track sections + homepage)
- [ ] Phew regression test passes (no broken content from schema cleanup)
- [ ] All changes committed
