# Visual Critique Synthesis -- Session 27

**Date:** 2026-02-17
**Method:** 6 parallel browser-based agents, each navigating assigned pages at 3 viewports (375px, 768px, 1440px) + dark mode, taking screenshots, and running structured critiques.
**Pages reviewed:** 13 pages across both tracks (Home, Welcome, Context, Sessions, ROI, Skills/Extensions, Brand Voice, Starter Kit, Governance, CLAUDE.md, Regression Testing, Hallucinations)

---

## Overall Scores by Page

| Page | Visual | Layout | Interaction | Content | A11y | **Overall** |
|------|--------|--------|-------------|---------|------|-------------|
| Home | 8 | 8 | 7 | 9 | 7 | **7.8** |
| Welcome | 8 | 8 | 7 | 9 | 7 | **7.8** |
| Context Simulator | 8 | 7 | 8 | 9 | 7 | **7.8** |
| Session Management | 8 | 8 | 7 | 9 | 8 | **8.0** |
| ROI Measurement | 8 | 7 | 7 | 9 | 7 | **7.5** |
| Skills & Extensions | 8 | 7 | 7 | 9 | 8 | **7.8** |
| Brand Voice | 8 | 8 | 7 | 9 | 8 | **8.0** |
| Starter Kit | 8 | 7 | 7 | 9 | 7 | **7.5** |
| Governance | 8 | 7 | 8 | 9 | 7 | **8.0** |
| CLAUDE.md | 8 | 6 | 7 | 8 | 7 | **7.0** |
| Regression Testing | 8 | 6 | 7 | 9 | 7 | **7.5** |
| Hallucinations | 9 | 8 | 8 | 9 | 8 | **8.5** |
| **Average** | **8.1** | **7.3** | **7.3** | **9.0** | **7.3** | **7.8** |

**Strongest areas:** Content quality (9.0 avg), Visual quality (8.1 avg)
**Weakest areas:** Layout/responsiveness (7.3), Interaction design (7.3), Accessibility (7.3)

---

## Systemic Issues (Affect Multiple Pages)

These are cross-cutting issues flagged by 3+ agents. Fix once, fix everywhere.

### S1. Copy buttons hidden behind hover (`sm:opacity-0`) -- 5 agents flagged

**Severity: CRITICAL**
**Affects:** Context, Sessions, Skills/Extensions, Brand Voice, Hallucinations, Developer Track (all pages with PromptExample or SetupStepCard)
**Components:** `PromptExample.tsx`, `SetupStepCard.tsx`, code block CopyButton

The copy button uses `sm:opacity-0 sm:group-hover:opacity-100`, making it completely invisible on desktop until hover. This directly contradicts the critical rule: "Copy-to-clipboard on every prompt/template."

**Fix:** Make copy buttons always visible. Options:
- Remove `sm:opacity-0` entirely (simplest)
- Use `sm:opacity-60 sm:group-hover:opacity-100` (subtler but still visible)

### S2. Table overflow on mobile without scroll affordance -- 4 agents flagged

**Severity: CRITICAL**
**Affects:** CLAUDE.md, Regression Testing, Starter Kit, Governance, Skills/Extensions
**Tables hit:** File Types, Plugin Comparison, Ghost Inspector Comparison, How to Customise, Extension Type Quick Reference, Extension Register

Tables clip their rightmost columns on 375px mobile with no visible scrollbar or gradient indicating more content exists.

**Fix:** Wrap all `<table>` elements in `<div className="overflow-x-auto">` with a subtle right-edge fade or scroll shadow.

### S3. URL routing instability / redirect race condition -- 4 agents flagged

**Severity: CRITICAL**
**Affects:** Skills/Extensions, Brand Voice, Starter Kit, Developer Track pages
**Symptom:** Navigating directly to a page URL sometimes redirects to another section (e.g., `/general/starter-kit` redirects to `/general/context`). Does not happen when navigating via sidebar.

**Fix:** Investigate `TrackLayout.tsx` and `SectionPage.tsx` redirect logic. The initial render likely resolves the track before route params are fully parsed, causing a default-track redirect.

### S4. Dark mode tinted backgrounds too subtle (`bg-muted/20`) -- 3 agents flagged

**Severity: Important**
**Affects:** Context, Sessions, Governance (risk categories)

Sections using `bg-muted/20` for visual rhythm are nearly invisible in dark mode. The alternating white/tinted pattern that works in light mode disappears.

**Fix:** Use `dark:bg-muted/30` or `dark:bg-muted/40` for dark mode variants.

### S5. No "On this page" / table of contents on long pages -- 3 agents flagged

**Severity: Important**
**Affects:** Context, Sessions, Brand Voice (Part 2), Hallucinations
**Note:** Skills/Extensions already has this -- pattern exists but is not used on other long pages.

Pages over 4 screens tall have no in-page navigation. Users must scroll the entire length to find content.

**Fix:** Add the existing "On this page" component to pages over ~3,000px content height.

### S6. Code block horizontal overflow without scroll indicator -- 3 agents flagged

**Severity: Important**
**Affects:** CLAUDE.md (Complete Template), Regression Testing (test catalogue), Starter Kit (install commands), Skills/Extensions (UK English skill)

Long code lines extend beyond the visible container. Horizontal scrolling works but there is no visual hint that content continues rightward.

**Fix:** Add a subtle right-edge fade gradient on code blocks with overflow, or ensure the native scrollbar is always visible.

### S7. Missing space before `{siteConfig.companyShortName}` -- 2 agents flagged

**Severity: CRITICAL**
**Affects:** `ClaudeMdSection.tsx`, `RegressionTestingSection.tsx`
**Rendered as:** "forPhew!" instead of "for Phew!"

JSX line breaks between text and `{siteConfig.companyShortName}` collapse whitespace.

**Fix:** Add `{' '}` before `{siteConfig.companyShortName}` at all affected locations. Grep the codebase for other instances.

### S8. Floating feedback button overlaps content on mobile -- 3 agents flagged

**Severity: Minor**
**Affects:** Home, Welcome, Starter Kit

The circular FAB at bottom-right overlaps tab labels, buttons, and content while scrolling on 375px.

**Fix:** Add bottom padding to page content to account for FAB height, or hide FAB while scrolling.

### S9. Tablet sidebar too wide, cramping content -- 3 agents flagged

**Severity: Minor**
**Affects:** Welcome, Starter Kit, Governance

At 768px, the sidebar (~280px) leaves only ~488px for content, making tables and multi-column layouts cramped.

**Fix:** Consider collapsing the sidebar by default at the `md` breakpoint, or reducing sidebar width.

---

## Page-Specific Issues

### Critical (must fix before templatisation)

| # | Page | Issue | Viewport |
|---|------|-------|----------|
| 1 | Home | Section list starts at 1.5/1.9, skipping first sections -- confusing for new users | All |
| 2 | Welcome | Lazy-loading skeleton visible ~500-800ms on first page users see | All |
| 3 | ROI | "1 days" pluralisation bug in calculator output with default values | All |
| 4 | ROI | No ARIA live region on calculator results (screen readers get no update) | All |
| 5 | Governance | Section numbering gap (5 to 7) in General track -- looks like a bug | All |

### Important (should fix)

| # | Page | Issue | Viewport |
|---|------|-------|----------|
| 6 | Home | Excessive vertical gap between hero and track cards (pushes below fold) | Desktop |
| 7 | Home | "Get started" buttons look like CTAs but entire card is clickable | All |
| 8 | Welcome | Quick Win cards lack hover feedback | All |
| 9 | Welcome | No copy button on Quick Reference Card content | All |
| 10 | Welcome | Dark mode: Starter Kit callout nearly invisible | Dark |
| 11 | Context | Simulator legend text 11px (below 12px minimum) | Desktop/tablet |
| 12 | Context | Simulator bar labels truncated at narrow segments | Desktop/tablet |
| 13 | Sessions | 6 collapsed accordion items create a "wall" in Rules of Thumb | Desktop/tablet |
| 14 | ROI | Mobile category filter pills wrap across 3 lines | Mobile |
| 15 | ROI | Template cards lose Before/After comparison on mobile | Mobile |
| 16 | ROI | Large whitespace gap between calculator and templates sections | Desktop |
| 17 | ROI | "Copy for your business case" button too subtle | All |
| 18 | Skills | TOC label "Context Cost Summary" doesn't match rendered heading | All |
| 19 | Skills | Decision tree and reference card accordions look identical | Desktop |
| 20 | Brand Voice | No "Expand all" for 7 framework accordion sections | Desktop |
| 21 | Governance | No interactive form for parameterised placeholder values | All |
| 22 | Governance | Risk category cards too subtle in dark mode | Dark |
| 23 | Dev: CLAUDE.md | Copy button no visible feedback (checkmark) after clicking | All |
| 24 | Dev: CLAUDE.md | Stray period on its own line in "Next step" callout | All |
| 25 | Dev: Regression | Self-healing callout period on new line (rendering issue) | Dark |
| 26 | Dev: Hallucinations | Pattern cross-references in Agent Harness are static, not linked | All |

### Minor (nice to have)

| # | Page | Issue |
|---|------|-------|
| 27 | Home | Animation timing ~1s may frustrate returning users |
| 28 | Home | Track card section numbers at 60% opacity hard to read |
| 29 | Welcome | "How This Playbook Was Built" could be collapsed by default |
| 30 | Context | Default-open accordion adds scroll to already long page |
| 31 | Context | Mobile preset descriptions hidden |
| 32 | Sessions | Handoff timeline vertical line ending feels abrupt |
| 33 | Sessions | Cross-reference box easily missed between dense sections |
| 34 | ROI | Dark mode form field borders low contrast in Feasibility Builder |
| 35 | Skills | "Advanced / Developer features" button not clearly expandable |
| 36 | Brand Voice | Time estimate badge missing on Part 3 |
| 37 | Starter Kit | "Show all 11 files" is one-way (no collapse back) |
| 38 | Governance | "Phew!starter kit" missing space |
| 39 | Governance | Placeholder tooltips hover-only, not keyboard accessible |
| 40 | Dev: CLAUDE.md | "Before & After" accordion collapsed by default (most useful visual) |
| 41 | Dev: Hallucinations | "Show follow-up prompt" disclosure text easily missed |

---

## Fix Priority Groups

### Group A: Fix Before Templatisation (Blocking)

These issues affect correctness, accessibility, or parameterisation and must be resolved:

1. **S7: Missing space before companyShortName** -- 2 files, simple `{' '}` fix
2. **S1: Hidden copy buttons** -- change `sm:opacity-0` in PromptExample + SetupStepCard
3. **S2: Table overflow on mobile** -- add `overflow-x-auto` wrapper to all tables
4. **P1: Home section list starting at 1.5** -- show first 4 sections or explain
5. **P3: "1 days" pluralisation bug** -- verify Math.round comparison
6. **P4: ARIA live region on calculator** -- add `aria-live="polite"` wrapper
7. **P5: Governance section numbering gap** -- renumber for general track or add note
8. **S3: URL routing race condition** -- investigate TrackLayout redirect logic

### Group B: Should Fix (Quality)

These improve the experience significantly but are not blocking:

9. **S4: Dark mode tinted backgrounds** -- bump `bg-muted/20` to `/30` or `/40` in dark
10. **S5: Table of contents on long pages** -- reuse existing component
11. **S6: Code block scroll indicator** -- add right-edge fade
12. **P6: Home hero-to-cards gap** -- reduce `mb-14 sm:mb-16`
13. **P13: Sessions accordion wall** -- open first item by default
14. **P23: Copy button feedback** -- add checkmark state to CopyButton
15. **P18: TOC label mismatch** -- use audience-appropriate label

### Group C: Nice to Have (Polish)

Low-priority refinements:

16. S8: Mobile feedback FAB position
17. S9: Tablet sidebar width
18. P26: Pattern cross-references as links in Agent Harness
19. P21: Governance interactive placeholder form
20. Remaining minor items (27-41)

---

## What Works Well (Cross-Page Positives)

- **Content quality is outstanding** (9.0 average). UK English is consistent, tone is practical and non-condescending, and the content provides genuine value rather than surface-level AI guidance.
- **Parameterisation is clean.** All client-specific values come from `siteConfig`. The two spacing bugs are the only exceptions.
- **Dark mode is well-executed overall.** Every page renders readably in dark mode with appropriate contrast on text and code blocks.
- **Interactive tools are the standout feature.** The Context Window Simulator, ROI Calculator, Feasibility Builder, and Decision Tree all feel distinct from surrounding prose.
- **Developer track content is exceptionally strong.** The Hallucinations page (8.5/10) with its 7-pattern Agent Harness is the best-executed page in the entire playbook.
- **Visual consistency is excellent.** Typography, colour system, card styles, and callout patterns are coherent across all pages.
- **Mobile adaptations are generally thoughtful.** Table-to-card conversions, vertical bar stacking in the simulator, and responsive grid layouts show attention to the mobile experience.
- **The design avoids all anti-references.** No gradients, neon effects, AI badges, or enterprise dashboard complexity. It feels like a well-made documentation site.

---

## Session Verification

- [x] All 6 agents completed their critique reports
- [x] Reports saved to `agent-outputs/visual-critique-*.md` (6 files)
- [x] Synthesis document created (this file)
- [x] No code changes made -- audit only
- [x] Issues triaged into: fix before templatisation / fix later / acceptable

---

## Source Reports

1. `visual-critique-home-welcome.md` -- Agent 1 (Home + Welcome)
2. `visual-critique-context-sessions.md` -- Agent 2 (Context + Sessions)
3. `visual-critique-roi-feasibility.md` -- Agent 3 (ROI + Feasibility) *recovered*
4. `visual-critique-skills-brandvoice.md` -- Agent 4 (Skills/Extensions + Brand Voice)
5. `visual-critique-starterkit-governance.md` -- Agent 5 (Starter Kit + Governance)
6. `visual-critique-developer-track.md` -- Agent 6 (CLAUDE.md + Regression + Hallucinations)
