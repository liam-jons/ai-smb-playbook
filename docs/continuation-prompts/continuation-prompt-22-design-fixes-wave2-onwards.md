# Continuation Prompt 22 -- Design Fixes Wave 2+ and Synthesis Update

## Context

This continues from session 21 (Design Audit Triage & Fix Implementation) which achieved:

### Completed: General Track Triage (5 pages)

All 5 general track triage reports are written to `agent-outputs/design-triage-*.md`:

| Page | Verdict | Report File |
|------|---------|------------|
| Welcome & Orientation | Cross-page fixes sufficient | `design-triage-welcome.md` |
| Skills, Extensions & Decision Tree | **Full critique needed** (decision tree lacks visual distinction, 6+ tables, client-specific content) | `design-triage-skills-extensions.md` |
| AI Governance Policy | Cross-page fixes sufficient + parameterisation | `design-triage-governance.md` |
| Brand Voice & UK English | **Full critique needed** (extensive hardcoded Phew! content -- reusability blocker) | `design-triage-brand-voice.md` |
| Recurring & Scheduled Tasks | Cross-page fixes sufficient + parameterisation (14 client-specific refs) | `design-triage-recurring-tasks.md` |

### Completed: Developer Track Triage (7 pages)

All 7 developer track pages triaged in a single consolidated report at `agent-outputs/design-triage-developer-track.md`. **All 7 received "cross-page fixes sufficient" — no full critiques needed.** The dominant finding is client-specific content that will be addressed during templatisation:

| Page | Client Content Severity | Key References |
|------|------------------------|----------------|
| Documentation Structure | Light | "For Phew!" callouts, ASP.NET templates (reusable) |
| Codebase Mapping | Light | "For Phew!" callouts, WordPress/ASP.NET refs |
| Avoiding Hallucinations | Heavy | 7 prompts with ASP.NET, LMS, safeguarding, Ghost Inspector |
| Regression Testing | **Very heavy** | Ghost Inspector is structural backbone (16+ refs) |
| Safe MCP Usage | Medium | "Recommended MCPs for Phew!" heading, 3 Phew refs |
| Plugin Recommendations | Medium | "Phew!" (5), WordPress in plugin descriptions |
| Technical Debt | Light | "Phew!" (1), ASP.NET/WordPress in prompt template |

### Completed: Wave 1 Fixes (all 5 items)

| # | Fix | Status | Files Changed |
|---|-----|--------|---------------|
| 1 | **Routing bug investigation** | Investigated -- **likely false positive**. `useParams()` is URL-derived, not viewport-dependent. No responsive hook feeds into routing decisions. No code change needed. | N/A |
| 2 | **Fix "1 days" grammar bug** | Done | `RoiMeasurementSection.tsx` (2 locations: display + copy text) |
| 3 | **Add `aria-label` to home page card links** | Done | `HomePage.tsx` (2 links) |
| 4 | **Fix CalloutCard `role="alert"` for all variants** | Done | `CalloutCard.tsx` -- info/tip variants now use `role="note"`, only warning/important use `role="alert"` |
| 5 | **Fix pagination nav width mismatch** | Done | `TrackLayout.tsx` -- changed `max-w-[65ch]` to `max-w-[75ch]` |

### Completed: Partial Wave 2 Fixes

| # | Fix | Status | Files Changed |
|---|-----|--------|---------------|
| 8 | **Fix home page empty space** | Done | `HomePage.tsx` -- removed `min-h-[calc(100dvh-3.5rem)]` |
| 9 | **Fix dark mode card contrast** | Done | `index.css` -- card lightness increased from `oklch(0.21)` to `oklch(0.23)` (also popover) |
| 10 | **Show context simulator legend on all viewports** | Done | `ContextWindowBar.tsx` -- changed `sm:hidden` to `sm:grid-cols-3` so legend is always visible |
| 11 | **Wrap ROI Calculator in visual container** | Done | `RoiMeasurementSection.tsx` -- added `rounded-xl border-2 border-primary/10 bg-card p-5 sm:p-6` |
| 12 | **Fix dark mode callout contrast** | Done | `index.css` -- increased all 4 callout muted backgrounds from `oklch(0.25)` to `oklch(0.30)`, foregrounds from `oklch(0.8)` to `oklch(0.85)` |

### Completed: Additional Quick Fixes (from Waves 3-4)

| # | Fix | Status | Files Changed |
|---|-----|--------|---------------|
| 14 | **Add `aria-valuetext` to ROI range sliders** | Done | `RoiMeasurementSection.tsx` -- hours-saved and team-size sliders now announce units |
| 31 | **Add feedback FAB padding on mobile** | Done | `TrackLayout.tsx` -- added `pb-20 md:pb-6` to main content area |

### Build Status

All fixes pass `bun run build` and `bun run lint`.

---

## Remaining Issues Overview

The original synthesis identified **127 findings** (5 Critical, 37 Important, 85 Nice-to-Have). Session 21 fixed **13 items** (covering synthesis items C1 investigated, C3, I4, I9, I12, I17, I18, I19, I24, I29, N31, N56, plus additional a11y). The triage also surfaced **new findings** from the 12 previously unaudited pages.

### Remaining issue count by category

| Category | Original | Fixed | New from Triage | Remaining |
|----------|----------|-------|-----------------|-----------|
| Critical | 5 | 2 (C1 false positive, C3 legend) | 2 (Skills decision tree distinction, Skills TooltipTrigger invalid HTML) | 5 |
| Important | 37 | 8 (I4, I9, I12, I17, I18, I19, I24, I29) + N31, N56 | ~8 (parameterisation issues across Governance, Brand Voice, Recurring Tasks, Skills) | ~37 |
| Nice-to-Have | 85 | 0 | ~15 (various NTH items from triage reports) | ~100 |
| **Total** | **127** | **13** | **~25** | **~142** |

**Note:** Many "remaining" issues are small/trivial and can be batched. The synthesis document's Wave system (Waves 1-5) groups them by priority and effort. Also, the parameterisation issues from triage overlap with the reusability implementation plan — they will be resolved as part of templatisation work, not as standalone design fixes.

### Practical breakdown of remaining work

| Work Stream | Issue Count | Effort | When to Do |
|-------------|------------|--------|------------|
| **Wave 2 remaining** (home page hero + cards) | 2 | Medium | Before templatisation |
| **Wave 3** (cross-page improvements) | 8 | Medium | Before templatisation |
| **Wave 4** (polish + consistency) | 12 | Medium | During or after templatisation |
| **Wave 5** (component refinements) | 15 | Mixed | During or after templatisation |
| **Full critiques** (Skills/Extensions, Brand Voice) | 2 pages | Large | Before templatisation (may surface more issues) |
| **Parameterisation** (client-specific content across ~10 pages) | ~50 refs | Large | During templatisation (reusability plan Phase 2-3) |
| **Triage NTH items** (from 12 newly triaged pages) | ~15 | Small | Opportunistic |

---

## This Session's Goals

### Step 1: Update synthesis document

Update `agent-outputs/design-audit-synthesis.md`:

1. **Update "Audit Coverage" section:**
   - Move the 5 general track pages from "Unaudited" to a new "Triaged" table with their verdicts
   - Move the 7 developer track pages similarly (if triage report exists)
   - Note that Welcome, Governance, and Recurring Tasks are cleared (cross-page fixes sufficient)
   - Note that Skills/Extensions and Brand Voice need full critiques

2. **Update severity tiers with new findings from triage:**
   - **Skills/Extensions:** Add Critical finding about decision tree lacking visual distinction (Design Principle 3 violation); Add Critical finding about `TooltipTrigger` wrapping `<td>` (invalid HTML)
   - **Governance:** Note this page has up to 13 `role="alert"` instances (now fixed by the CalloutCard shared component fix)
   - **Brand Voice:** Add Important finding about extensive hardcoded client-specific content (reusability blocker)
   - **Recurring Tasks:** Add Important finding about 14 client-specific references needing parameterisation

3. **Mark completed fixes in the "Recommended Fix Order" section:**
   - Wave 1: Items 1-5 all done (item 1 was investigated and deemed false positive)
   - Wave 2: Items 8-12 done; items 6, 7 still pending
   - Wave 3: Items 14, 31 done; rest pending

4. **Update Appendix C** with actual triage verdicts

### Step 2: Remaining Wave 2 fixes

These are the remaining Wave 2 items (medium effort, home page focused):

| # | Fix | Effort | Location |
|---|-----|--------|----------|
| 6 | **Differentiate home page track cards** | Medium | `HomePage.tsx` -- different accents, asymmetric layout, unique section previews |
| 7 | **Rewrite home page hero** | Small | `HomePage.tsx` -- action-oriented h1, welcome warmth, use `siteConfig` values |

These are important pre-templatisation fixes as the home page is every client's first impression.

### Step 3: Wave 3 remaining fixes

| # | Fix | Effort | Location | Status |
|---|-----|--------|----------|--------|
| 13 | Add entrance animations to Home, Sessions, CLAUDE.md | Medium | Pattern exists in Starter Kit | Pending |
| 15 | Fix mobile tab labels on Starter Kit | Small | Meaningful abbreviations or icons | Pending |
| 16 | Add visual separators to Session Management | Small | Add `<Separator />` between sections | Pending |
| 17 | Fix mobile table/code overflow indicators | Medium | `CodeBlock.tsx` + table containers | Pending |
| 18 | Fix Before/After colour-only semantic meaning | Small | `ClaudeMdSection.tsx:591-625` -- add icons | Pending |
| 19 | Add `aria-label` to Starter Kit file card buttons | Small | `StarterKitSection.tsx` | Pending |
| 20 | Fix Radix `aria-describedby` warnings | Small | Sheet/Dialog components | Pending |
| 21 | Fix Starter Kit H1/H2 size collision | Trivial | Step H2 down to `text-xl sm:text-2xl` | Pending |
| 22 | Fix mobile tab overlap on ROI page | Small | `RoiMeasurementSection.tsx:565` | Pending |
| 23 | Add feasibility step titles to desktop indicator | Small | `FeasibilityStudyBuilder.tsx:311` | Pending |

### Step 4: If tokens remain -- Wave 4+ and full critiques

See the synthesis document for Waves 4-5 (27 more items). Also, the **Skills/Extensions** and **Brand Voice** pages were flagged by triage as needing full 10-dimension design critiques. These should be done before templatisation:

- **Skills/Extensions:** Decision tree lacks visual distinction (Design Principle 3 violation), TooltipTrigger wrapping `<td>` (invalid HTML), 3 horizontally-scrolling tables on mobile, cross-accordion linking fragile (100ms setTimeout)
- **Brand Voice:** 7 hardcoded `phewExample` blocks, "Head start for Phew!" callout, Phew-specific industry terms throughout — all need extraction to client-configurable data layer

### Step 5: Multi-session outlook

The full design audit work spans roughly **3-4 more sessions** depending on scope:

| Session | Focus | Est. Issues Resolved |
|---------|-------|---------------------|
| Next (22) | Synthesis update, Waves 2-3 fixes, start Wave 4 | ~20 |
| Session 23 | Wave 4-5 fixes, full critiques of Skills/Extensions and Brand Voice | ~25 |
| Session 24 | Remaining fixes from full critiques, final polish pass | ~15 |
| Templatisation sessions | Parameterisation sweep (~50 client-specific refs across 10 pages) | ~50 |

The parameterisation issues overlap with the reusability implementation plan (`.planning/plan-files/reusability-implementation-plan.md`) and should be resolved as part of that work, not as standalone design fixes.

---

## Key Files

| Document | Purpose |
|----------|---------|
| `agent-outputs/design-audit-synthesis.md` | Primary reference -- needs updating with triage results and fix completion status |
| `agent-outputs/design-triage-*.md` | 5 general track + 1 consolidated developer track triage reports |
| `agent-outputs/design-critique-*.md` | 6 original page critiques |
| `docs/continuation-prompts/continuation-prompt-21-design-audit-triage-and-fixes.md` | Previous session's prompt (for context) |

## Build & Dev Commands

```bash
cd app && bun install
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format:check # Prettier check
```

## Summary of All Fixes Applied This Session

Total: **13 fixes** across 6 files:

| File | Fixes Applied |
|------|--------------|
| `RoiMeasurementSection.tsx` | "1 days" grammar (x2), ROI calculator visual container, aria-valuetext on 2 range sliders |
| `HomePage.tsx` | aria-label on 2 card links, removed min-height empty space |
| `CalloutCard.tsx` | Variant-aware ARIA roles (info/tip -> "note", warning/important -> "alert") |
| `TrackLayout.tsx` | Pagination nav width aligned to 75ch, mobile bottom padding for FAB |
| `ContextWindowBar.tsx` | Legend visible on all viewports |
| `index.css` | Dark mode card contrast (+0.02), dark mode callout backgrounds (+0.05) and foregrounds (+0.05) |
