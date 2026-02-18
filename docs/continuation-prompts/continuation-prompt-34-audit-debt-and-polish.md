# Audit Debt & Polish — Session Continuation Prompt

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. The app is deployed as a multi-tenant SPA — each client gets a subdomain and a JSON config file. A single build serves all clients. Two outputs per client deployment:
1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, commands, templates, governance policy

**Read first:** `CLAUDE.md` at the project root — conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### Sessions 1–20: Full build + multi-tenant architecture — Complete
Full application built — 17 content sections across 2 tracks, interactive tools (context simulator, feasibility builder, ROI calculator), starter kit file browser, governance policy generator. Multi-tenant SPA: client identified by subdomain, config loaded at runtime from `/clients/{slug}.json`, overlay system, section visibility gating.

### Sessions 21–26: Design audit & parameterisation — Complete
~160 design audit issues resolved across ~30 source files. All client-specific references parameterised through `siteConfig`. Zero hardcoded "Phew" references outside config files.

### Sessions 27–31: Visual critique sweep, client onboarding, homepage redesign — Complete
Browser-based visual critique across all pages. Client onboarding skill created and tested. Homepage transformed into centre-aligned cover page with client/provider branding zones, dark mode logo fallback, card compaction.

### Session 32: Homepage critique refinements — Complete
12 tasks from a comprehensive `/frontend-design:critique` implemented:
- h1 text-wrap balance + tighter mobile line-height
- Provider logo relocated below title into attribution zone
- Provider logo SVGs use Plus Jakarta Sans (not system-ui)
- General Users card visually dominant (blue fill), Developer card outline-only
- "Prepared for" label strengthened (text-sm, full opacity, shorter divider)
- Section count badges tinted to match card accent colours
- CTA spans upgraded to font-semibold
- Feedback FAB repositioned (bottom-28) for mobile clearance
- Vertical centering (items-center) for large viewports
- Generous spacing between cover page zones (editorial rhythm matching client report reference)

### Build Status (Session 32)
- `cd app && bun run build` — pass
- `cd app && bun run lint` — pass
- `cd app && bun run format:check` — pass

---

## What This Session Does: Clear Remaining Audit Debt

This session addresses **27 remaining items** identified across four audit sources:
1. `docs/audit-findings/20250215-ux/ux-review-action-plan.md` — UX review consolidated action plan
2. `docs/audit-findings/20250216-ux/frontend-design-audit.md` — Frontend design audit (17 issues)
3. `docs/audit-findings/20250216-ux/gap-analysis.md` — Gap analysis with TODO tracking
4. `docs/audit-findings/20260218-homepage-critique.md` — Homepage critique (session 32, 8/10 overall)

Cross-referencing confirmed that many items have been resolved in sessions 21–32. The remaining items are grouped below by priority, with a parallelisation strategy at the end.

---

## Group 0: Homepage Critique Findings (3 items — Should)

These were identified by a fresh `/frontend-design:critique` run at the end of session 32. Full report at `docs/audit-findings/20260218-homepage-critique.md`.

### 0.1: 1280x800 desktop requires 146px scroll with client config

**File:** `app/src/components/layout/HomePage.tsx`
**Issue:** When the Phew client config is active (which includes the "Prepared for" zone with logo), the page height reaches 946px vs the 800px viewport, requiring 146px of scrolling. The footer and lower portion of the track cards are below the fold. Without client config, the page fits perfectly. This means the primary deployment (Phew) never achieves the intended "cover page" single-screen effect at a common laptop resolution (1280x800).
**Fix:** Reduce vertical spacing in the hero section when client branding is present. The `mt-10 sm:mt-12` gap before "Prepared for" and the `mb-10 sm:mb-12` after the hero zone could both be reduced by 8–12px. Alternatively, accept this as a known trade-off — the 1920x1080 viewport achieves the cover page effect perfectly, and 1280x800 is still a comfortable scroll. The generous spacing contributes to the editorial feel at larger viewports.

### 0.2: Mobile card height mismatch (210px vs 230px)

**File:** `app/src/components/layout/HomePage.tsx`
**Issue:** On mobile (375px) the General Users card is 210px tall while the Developer card is 230px, due to the Developer description being slightly longer. On desktop, `h-full` equalises them, but on mobile they stack and the inconsistency breaks visual rhythm.
**Fix:** Either set a consistent `min-h` on mobile cards, or trim the Developer description by a few words to match. Alternatively, accept the minor inconsistency — the 20px difference is subtle.

### 0.3: Generic config exposes placeholder "your training date"

**File:** `app/src/config/site.ts` (or config-loader defaults)
**Issue:** The "Prepared by Liam . your training date" text appears in the generic/default config fallback. "your training date" is a placeholder that leaked from the default site config. Visible on the root domain.
**Fix:** Either set a sensible default (e.g., current year like "2026"), or conditionally hide the training date line when the value matches the placeholder string.

---

## Group A: Accessibility Fixes (3 items — Should)

### A1: Range slider thumb too small for mobile touch (H2)

**File:** `app/src/components/interactive/SimulatorControls.tsx:377`
**Issue:** Slider thumbs are `h-6 w-6` (24px) — improved from the original 16px but still below the 44px WCAG 2.5.8 minimum for touch targets. The sliders are in the context window simulator, a key interactive feature.
**Fix:** Increase thumb size on mobile. Add responsive classes: `[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 sm:[&::-webkit-slider-thumb]:h-6 sm:[&::-webkit-slider-thumb]:w-6` → change the base (mobile) values to `h-10 w-10` (40px, close to 44px) and keep `h-6 w-6` on `sm:` and above. Or add a transparent 44px hit area via `::before` pseudo-element. The sliders are behind a collapsible on mobile, so this is lower urgency.
**WCAG:** 2.5.8 Target Size (Level AAA)

### A2: Verify table headers have `scope="col"` consistently (M1)

**Files:** Multiple content sections — `SessionManagementSection.tsx`, `ClaudeMdSection.tsx`, and others.
**Issue:** The audit flagged inconsistent `scope="col"` on `<th>` elements. A grep shows 9 files now use `scope="col"`, but the audit originally flagged specific files as missing it. Need to verify ALL `<th>` elements in `<thead>` rows have `scope="col"`.
**Fix:** Search for `<th` across all content files. Add `scope="col"` to any `<th>` in `<thead>` that lacks it. Also check for row headers that should use `scope="row"`.
**WCAG:** 1.3.1 Info and Relationships (Level A)

### A3: Verify collapsible triggers communicate `aria-expanded` (M2)

**Files:** `SimulatorControls.tsx`, `SessionManagementSection.tsx`, `BrandVoiceSection.tsx`
**Issue:** Radix `CollapsibleTrigger` should handle `aria-expanded` automatically, but custom toggle button compositions may not. Need to verify in the rendered DOM that all collapsible/expandable triggers communicate their state.
**Fix:** Check each collapsible trigger in the codebase. For any custom (non-Radix) toggle buttons, add `aria-expanded={isOpen}` manually.
**WCAG:** 4.1.2 Name, Role, Value (Level A)

---

## Group B: UX — Welcome Page Redundancy (3 items — Should)

These three items are related and should be addressed together. They all concern the WelcomeSection creating a redundant or confusing experience after the homepage redesign.

### B1: Double track selection — homepage then WelcomeSection (6.1)

**File:** `app/src/content/shared/WelcomeSection.tsx`
**Issue:** After the homepage was redesigned as a cover page with track cards, users now pick a track on the homepage and then see track-selection content again on the Welcome page. This creates a "didn't I just do this?" feeling.
**Fix:** Review the WelcomeSection and remove or rework any track-selection UI that duplicates the homepage. The Welcome page should confirm the user's track choice and orient them to the content, not re-ask which track they want.

### B2: "What's Covered" shows both tracks (6.3)

**File:** `app/src/content/shared/WelcomeSection.tsx`
**Issue:** The "What's Covered" section shows highlights from both the General and Developer tracks, regardless of which track the user is on. This is confusing — a general user shouldn't see developer section previews.
**Fix:** Filter the "What's Covered" content to show only the current track's highlights. Use the `useTrack()` hook to determine which track the user is on.

### B3: Duplicate meta-narrative — two "how we built this" sections (4.3)

**File:** `app/src/content/shared/WelcomeSection.tsx`
**Issue:** The Welcome page has both a "How this playbook was built" alert/callout AND a "How We Built This" heading section. These are redundant — consolidate into one.
**Fix:** Merge the two into a single, concise "How this playbook was built" section. Remove the duplicate.

---

## Group C: UX — Starter Kit Polish (4 items — Should)

### C1: Install tab defaults to Claude Desktop on developer track (3.5)

**File:** `app/src/content/shared/StarterKitSection.tsx`
**Issue:** The "How to Install" section defaults to the "Claude Desktop" tab regardless of track. Developers using Claude Code should see the Claude Code tab first.
**Fix:** Use the `useTrack()` hook to set the default tab. When `isDev`, default to "Claude Code"; otherwise default to "Claude Desktop".

### C2: Track completion message missing (4.1)

**File:** `app/src/content/shared/StarterKitSection.tsx` (bottom of the section)
**Issue:** After reaching the end of the Starter Kit (the last section in both tracks), there is no completion message. Users don't know they've finished.
**Fix:** Add a "You've completed the [General/Developer] track!" callout at the bottom of the Starter Kit page with links to: (a) the other track (if `hasDeveloperTrack`), (b) the homepage, and (c) the feedback widget.

### C3: "Repository reference" irrelevant for general users (6.4)

**File:** `app/src/content/shared/StarterKitSection.tsx`
**Issue:** References to "grab the starter-kit/ folder" or similar repository-level language are developer-oriented and confusing for general users who receive their files as downloads.
**Fix:** Use `useTrack()` to show track-appropriate instructions. General: focus on downloads and Claude Desktop installation. Developer: include repository/Claude Code references.

### C4: Skill descriptions too brief (6.5)

**File:** `app/src/content/shared/starter-kit-data.ts`
**Issue:** Some skill file descriptions in the Starter Kit are unhelpfully brief (e.g., "Writing Plans — Writing plan creation"). They don't tell the user what the skill does or when to use it.
**Fix:** Review all skill/command entries in `starter-kit-data.ts` and expand descriptions to one meaningful sentence each. Pattern: "{What it does} — {When/why you'd use it}."

---

## Group D: Content Additions (6 items — Nice-to-have)

These are small content enhancements identified across multiple sections. Each is self-contained.

### D1: Quick audit prompt in Technical Debt (4.2)

**File:** `app/src/content/developer/TechnicalDebtSection.tsx`
**Issue:** The section has comprehensive audit prompts but no shorter "Quick Health Check" variant for quick use.
**Fix:** Add a shorter prompt (5–10 lines) labelled "Quick Health Check" alongside the existing detailed prompts. Include a copy button.

### D2: MCP discovery guidance (4.4)

**File:** `app/src/content/developer/McpUsageSection.tsx`
**Issue:** No guidance on where to find MCP servers. Users learn what MCP is but not where to start discovering servers.
**Fix:** Add a "Discovering MCP Servers" subsection with starting points: Anthropic MCP directory, npm/registry search, community resources. Keep it concise — 3–4 bullet points with links.

### D3: Common mapper inaccuracies callout (4.5)

**File:** `app/src/content/developer/CodebaseMappingSection.tsx`
**Issue:** No guidance on what to verify after running the codebase mapper. Users may trust mapper output too readily.
**Fix:** Add a callout listing the top 3–4 things to verify after running the mapper (e.g., dependency counts, test coverage claims, architecture boundaries, deprecated code detection).

### D4: Save patterns as skills callout (4.8)

**File:** `app/src/content/developer/HallucinationsSection.tsx`
**Issue:** Hallucination prevention patterns could be saved as reusable Claude Code skills, but this isn't mentioned.
**Fix:** Add a brief callout/tip suggesting developers save their most-used hallucination prevention patterns as skills for reuse across projects.

### D5: Context window session hygiene (4.9)

**File:** `app/src/content/general/ContextSimulatorSection.tsx` (or `SessionManagementSection.tsx`)
**Issue:** No guidance for the common user question: "My session feels slow and Claude is forgetting things — what do I do?"
**Fix:** Add a practical callout answering this question: start a new session, use a handoff prompt to carry key context, keep sessions focused on one topic. This bridges the context simulator (theory) with practical action.

### D6: MCP config `npx` without Node.js note (6.6)

**File:** `app/src/content/developer/McpUsageSection.tsx`
**Issue:** MCP config examples use `npx` commands, but not all developers have Node.js installed (e.g., .NET developers at AMD Group).
**Fix:** Add a brief note near the config examples: "These examples use `npx` (Node.js). If your project doesn't use Node.js, install it separately or use the equivalent for your platform."

---

## Group E: Performance & UI Polish (3 items — Nice-to-have)

### E1: Lazy-load creative theme fonts (M8)

**Files:** `app/src/index.css`, font loading configuration
**Issue:** Creative theme fonts (VT323, Space Grotesk, Fraunces) and accessibility fonts (Atkinson Hyperlegible, OpenDyslexic) may be loaded eagerly on all pages. Users who never activate these modes pay the bandwidth cost.
**Fix:** Investigate current font loading strategy. If fonts are loaded eagerly, defer creative theme fonts to load only when a theme is activated. Accessibility fonts should load on activation of dyslexia mode. Ensure all fonts use `font-display: swap`.

### E2: Sidebar truncation on long section names (4.6)

**File:** `app/src/components/layout/Sidebar.tsx`
**Issue:** Long section names are truncated in the collapsed sidebar. No tooltip or alternative display.
**Fix:** Add `title` attribute (native tooltip) on sidebar links so the full section name is visible on hover. Alternatively, consider using shorter `sidebarTitle` values in `sections.ts` for longer titles.

### E3: Pagination touch targets (L3)

**File:** `app/src/components/layout/TrackLayout.tsx`
**Issue:** Previous/Next pagination links use `px-3 py-2` padding. On mobile, the clickable area could be more generous.
**Fix:** Add `min-h-[44px]` to pagination link containers on mobile for better touch targets.

---

## Group F: Verification — Browser Testing (4 items — Should)

These require running the dev server and using browser testing (agent-browser or manual).

### F1: Full mobile responsiveness walkthrough (6.7)

**Scope:** All pages at 375x812 viewport.
**Check:** Content reflows sensibly, no overlaps, touch targets adequate, no horizontal scroll, feedback FAB doesn't obstruct content.

### F2: Dark mode verification (6.8)

**Scope:** All pages in dark mode at 1280x800 and 375x812.
**Check:** Sufficient contrast on all text, correct semantic token usage, no white/light backgrounds leaking, interactive tools render correctly, creative themes work in dark mode.

### F3: PDF download button (6.9)

**Scope:** Welcome page — Quick Reference PDF download.
**Check:** Does the button trigger a download? Is the PDF generated correctly? Does it contain the expected content?

### F4: ZIP download (6.10)

**Scope:** Starter Kit page — "Download All as ZIP".
**Check:** Does `/starter-kit.zip` exist and serve correctly? Does it contain the expected files?

---

## Parallelisation Strategy

Many of these items touch different files and can be parallelised:

**Wave 1 — Independent fixes (all parallel):**
- Agent A: Group 0 (homepage critique) + Group A (accessibility) — HomePage.tsx, SimulatorControls.tsx, table headers, collapsible verification, site.ts
- Agent B: Group B (Welcome page) — WelcomeSection.tsx
- Agent C: Group C (Starter Kit) — StarterKitSection.tsx, starter-kit-data.ts
- Agent D: Group D items D1–D3 — TechnicalDebtSection.tsx, McpUsageSection.tsx, CodebaseMappingSection.tsx
- Agent E: Group D items D4–D6 — HallucinationsSection.tsx, ContextSimulatorSection.tsx, McpUsageSection.tsx (D6 shares file with D2 — coordinate or sequence)

**Wave 2 — UI polish (after Wave 1):**
- Group E (performance, sidebar, pagination)

**Wave 3 — Browser verification (after all code changes):**
- Group F (requires dev server running, browser testing)

**Note:** D2 and D6 both touch McpUsageSection.tsx — assign to the same agent or sequence them.
**Note:** Group 0 item 0.1 touches HomePage.tsx — no other group modifies this file, so no conflict.

---

## Audit Source Cross-Reference

Each item below maps to its original audit source for traceability.

| Item | Original ID | Source File |
|------|-------------|------------|
| 0.1 | Critique P1 | `20260218-homepage-critique.md` |
| 0.2 | Critique P2 | `20260218-homepage-critique.md` |
| 0.3 | Critique P3 | `20260218-homepage-critique.md` |
| A1 | H2 | `frontend-design-audit.md` |
| A2 | M1 | `frontend-design-audit.md` |
| A3 | M2 | `frontend-design-audit.md` |
| B1 | 6.1 | `gap-analysis.md` |
| B2 | 6.3 | `gap-analysis.md` |
| B3 | 4.3 | `ux-review-action-plan.md` |
| C1 | 3.5 | `ux-review-action-plan.md` |
| C2 | 4.1 | `ux-review-action-plan.md` |
| C3 | 6.4 | `gap-analysis.md` |
| C4 | 6.5 | `gap-analysis.md` |
| D1 | 4.2 | `ux-review-action-plan.md` |
| D2 | 4.4 | `ux-review-action-plan.md` |
| D3 | 4.5 | `ux-review-action-plan.md` |
| D4 | 4.8 | `ux-review-action-plan.md` |
| D5 | 4.9 | `ux-review-action-plan.md` |
| D6 | 6.6 | `gap-analysis.md` |
| E1 | M8 | `frontend-design-audit.md` |
| E2 | 4.6 | `ux-review-action-plan.md` |
| E3 | L3 | `frontend-design-audit.md` |
| F1 | 6.7 | `gap-analysis.md` |
| F2 | 6.8 | `gap-analysis.md` |
| F3 | 6.9 | `gap-analysis.md` |
| F4 | 6.10 | `gap-analysis.md` |

### Items confirmed resolved (not included above)

These were verified in the codebase during session 32 and require no further action:

| Original ID | Issue | Resolution |
|-------------|-------|------------|
| H1 | Mobile menu `aria-expanded` | `Header.tsx:87` — present |
| H3 | Sidebar accessible names spacing | `Sidebar.tsx:222-224` — `mr-1.5` + `{' '}` |
| M3 | Homepage whitespace imbalance | Session 32 — `items-center` on main |
| M4 | PromptExample CopyButton keyboard visibility | `PromptExample.tsx:56` — `opacity-60` + `group-focus-within:opacity-100` |
| M5 | CodeBlock CopyButton mobile/keyboard visibility | `CodeBlock.tsx:62` — same pattern |
| M6 | Feedback FAB overlap on mobile | Session 32 — `bottom-28` |
| M7 | No 404 page | `NotFoundPage.tsx` exists, referenced in `router.tsx` |
| L1 | Footer button missing `type="button"` | `Footer.tsx:33` — present |
| L4 | localStorage without try/catch | `TrackLayout.tsx:32-35` — wrapped in try/catch |
| 3.4 | Replace "parameterised" | Only legitimate technical usage remains (`DocumentationSection.tsx`) |
| 3.6 | CoWork definition | Full definition in `RecurringTasksSection.tsx:107` + inline note in `SkillsExtensionsSection.tsx:422` |
| 3.7 | Rename "Atomic Task Principle" | Track-conditional in `session-management-data.ts:72-73` |
| C2 (multi-tenant) | Duplicated `extractClientSlug` | Consolidated to `src/utils/slug.ts` |

---

## Key Reference Files

| File | Purpose |
|------|---------|
| `docs/audit-findings/20260218-homepage-critique.md` | Homepage critique — 8/10 overall, 3 priority items, detailed measurements |
| `docs/audit-findings/20250215-ux/ux-review-action-plan.md` | UX review — consolidated action plan with priority items |
| `docs/audit-findings/20250216-ux/frontend-design-audit.md` | Frontend design audit — 17 issues with severity ratings |
| `docs/audit-findings/20250216-ux/gap-analysis.md` | Gap analysis — TODO tracking across all audit sources |
| `docs/reference/frontend-skills-review.md` | Design guidelines — typography, colour, spacing, motion standards |
| `app/src/content/shared/WelcomeSection.tsx` | Welcome page — Group B changes |
| `app/src/content/shared/StarterKitSection.tsx` | Starter Kit — Group C changes |
| `app/src/content/shared/starter-kit-data.ts` | Starter Kit data — skill descriptions |
| `app/src/components/interactive/SimulatorControls.tsx` | Context simulator controls — slider thumb fix |
| `app/src/components/layout/Sidebar.tsx` | Sidebar — truncation fix |
| `app/src/components/layout/TrackLayout.tsx` | Track layout — pagination touch targets |

---

## Key Conventions Reminder

- **UK English throughout.** All content, copy, and code comments use UK English spelling and grammar.
- **Build check after changes:** `cd app && bun run build` (TypeScript + Vite build). Also `bun run lint` and `bun run format:check`.
- **Tailwind v4 — no config file.** Theme customisation is in `app/src/index.css` via `@theme inline {}`. Don't create a JS config file.
- **Path aliases:** `@/` maps to `app/src/`.
- **Config access:** Always use React context hooks (`useSiteConfig()`, `useOverlays()`, `useTrack()`) — never import `site.ts` directly in components.
- **Track detection:** `useTrack()` hook returns `{ track, isDev, isGeneral }` for track-conditional rendering.
- **No over-engineering.** Keep changes minimal and focused.
- **Design principles:** Clarity over cleverness. Hierarchy through restraint. Respect the audience.
- **Parallel execution:** Use sub-agents for independent tasks. See parallelisation strategy above.

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format       # Prettier — format all files
cd app && bun run format:check # Prettier — check without writing
```

## Verification After This Session

### Homepage Critique
- [ ] 1280x800 viewport: page fits or scroll is minimised with client config
- [ ] Mobile card heights are visually consistent (or accepted as minor)
- [ ] Generic config: no "your training date" placeholder visible

### Accessibility
- [ ] Range slider thumbs are at least 40px on mobile viewports
- [ ] All `<th>` elements in `<thead>` have `scope="col"`
- [ ] All collapsible triggers communicate `aria-expanded` state

### UX — Welcome Page
- [ ] Welcome page no longer duplicates track selection from homepage
- [ ] "What's Covered" shows only current track's highlights
- [ ] Single "How this playbook was built" section (no duplicate)

### UX — Starter Kit
- [ ] Developer track defaults to Claude Code install tab
- [ ] Track completion message at end of Starter Kit
- [ ] General users see download-focused instructions (no repository references)
- [ ] Skill descriptions are meaningful one-sentence summaries

### Content
- [ ] Quick Health Check prompt in Technical Debt section
- [ ] MCP discovery guidance subsection
- [ ] Mapper verification callout in Codebase Mapping
- [ ] Skills-as-patterns callout in Hallucinations
- [ ] Session hygiene guidance (slow session recovery)
- [ ] Node.js note on MCP `npx` examples

### Polish
- [ ] Creative theme fonts lazy-loaded (or verified as already deferred)
- [ ] Sidebar links have tooltip for truncated titles
- [ ] Pagination links have 44px+ touch targets on mobile

### Browser Verification
- [ ] Mobile (375px) — all pages render correctly, no overlaps
- [ ] Dark mode — all pages have correct contrast and token usage
- [ ] PDF download — Quick Reference downloads correctly
- [ ] ZIP download — starter kit archive serves correctly

### Build
- [ ] `cd app && bun run build` — pass
- [ ] `cd app && bun run lint` — pass
- [ ] `cd app && bun run format:check` — pass
