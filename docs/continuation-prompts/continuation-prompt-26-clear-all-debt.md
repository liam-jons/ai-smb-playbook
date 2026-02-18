# Session 26 -- Clear All Design and Parameterisation Debt

## Goal

Resolve **all ~115 remaining design audit issues and parameterisation debt** in a single session using **parallelised workstreams** (multiple subagents working simultaneously on non-overlapping files). After this session, the codebase should be ready for templatisation with zero technical or design debt.

---

## Context: Sessions 21-25 Summary

Over five sessions, ~31 of ~146 design audit issues have been resolved across ~22 source files. The remaining ~115 items span 4 critical, 29 important, 80 nice-to-have, and ~13 additional items from the Skills/Extensions and Brand Voice critique files, plus ~61 parameterisation references across 6 pages.

### Cumulative Fix Summary (Sessions 21-25)

**Total: ~48 fixes across ~24 source files**

#### Session 21 (13 fixes)
| File | Fixes |
|------|-------|
| `RoiMeasurementSection.tsx` | "1 days" grammar (x2), ROI calculator visual container, aria-valuetext on 2 sliders |
| `HomePage.tsx` | aria-label on 2 card links, removed min-height empty space |
| `CalloutCard.tsx` | Variant-aware ARIA roles |
| `TrackLayout.tsx` | Pagination nav width, mobile FAB padding |
| `ContextWindowBar.tsx` | Legend visible on all viewports |
| `index.css` | Dark mode card contrast, dark mode callout contrast |

#### Session 22 (~11 fixes)
| File | Fixes |
|------|-------|
| `HomePage.tsx` | Full rewrite: differentiated cards, warm hero, fluid type, `<h2>` titles, `md:` breakpoint, entrance animations |
| `ClaudeMdSection.tsx` | Before/After icons (X/Check), entrance animation on first section |
| `SessionManagementSection.tsx` | Separators between sections, entrance animation, context-specific copy button labels |
| `StarterKitSection.tsx` | Mobile tab labels, file card aria-labels, H1/H2 size hierarchy |
| `RoiMeasurementSection.tsx` | Tab overlap margin fix |
| `FeasibilityStudyBuilder.tsx` | Step titles on desktop indicator |
| `CopyButton.tsx` | New `ariaLabel` prop |
| `PromptExample.tsx` | New `copyAriaLabel` passthrough prop |
| `sheet.tsx`, `dialog.tsx` | Radix aria-describedby suppression |
| `CodeBlock.tsx` | Wrapped in ScrollHint for overflow fade gradients |
| `ShikiHighlighter.tsx` | Removed redundant overflow-x-auto |
| `ScrollHint.tsx` | New reusable component for scroll overflow indicators |
| `index.css` | Scroll hint styles + CSS-only table scroll shadows |

#### Session 23 (~10 fixes)
| File | Fixes |
|------|-------|
| `TrackLayout.tsx` | Content area widened to `max-w-3xl` |
| `Header.tsx` | Track nav buttons converted to `<Link>` elements |
| `accordion.tsx` | Hover state improved |
| `StarterKitSection.tsx` | `useReducedMotion` hook |
| `RoiMeasurementSection.tsx` | Output card backgrounds |
| `SkillsExtensionsSection.tsx` | Removed broken aria-labelledby, improved scrollToCard, parameterised 3 Phew refs |
| `BrandVoiceSection.tsx` | CopyButton mobile/keyboard visibility fix |

#### Session 24 (7 fixes)
| File | Fixes |
|------|-------|
| `SkillsExtensionsSection.tsx` | Decision tree visual distinction, ScrollHint on tables, touch target, PlatformBadge colours |
| `BrandVoiceSection.tsx` | `phewExample` renamed to `clientExample`, labels/callout parameterised, template literals |

#### Session 25 (7 fixes)
| File | Fixes |
|------|-------|
| `BrandVoiceSection.tsx` | Data extracted to `brand-voice-data.ts`, `SetupStepCard` component |
| `brand-voice-data.ts` | New file with all Brand Voice data constants |
| `SetupStepCard.tsx` | New shared component for step rendering |
| `config/site.ts` | `companyShortName` added |
| `TechnicalDebtSection.tsx` | 1 client ref parameterised |
| `DocumentationSection.tsx` | 2 client refs parameterised |
| `CodebaseMappingSection.tsx` | 2 client refs parameterised |

---

## What Remains (~115 items)

### Critical (4 remaining)

| ID | Issue | File(s) | Notes |
|----|-------|---------|-------|
| C2 | Home page identical twin cards (AI slop) | `HomePage.tsx` | Session 22 rewrote the home page -- verify this is fully resolved; if not, complete the differentiation |
| C4 | CLAUDE.md file types table truncated at 375px mobile | `ClaudeMdSection.tsx` | Needs scroll indicator or responsive card fallback |
| C5 | Home page cards share first 4 section titles | `HomePage.tsx` | Tied to C2 -- verify after home page review |
| C7 | `TooltipTrigger` wrapping `<td>` -- invalid HTML | `SkillsExtensionsSection.tsx:854-856` | Replace with `title` attribute or restructure |

### Important (29 remaining)

| ID | Issue | File(s) | Workstream |
|----|-------|---------|------------|
| I2 | Interactive tools not visually distinct (Context, Sessions) | `ContextSimulatorSection.tsx`, `SessionManagementSection.tsx` | C, D |
| I3 | No entrance animations (Home, Sessions, CLAUDE.md) | Multiple -- check if Session 22 resolved Home/Sessions; CLAUDE.md still needs | J |
| I5 | Home page lacks personality | `HomePage.tsx` | A |
| I6 | No visual rhythm variation (Sessions, CLAUDE.md) | `SessionManagementSection.tsx`, `ClaudeMdSection.tsx` | D, F |
| I7 | Starter Kit H1/H2 size collision | `StarterKitSection.tsx` | E |
| I8 | Home page h1 duplicates header | `HomePage.tsx` | A |
| I10 | Excessive accordion vertical space (CLAUDE.md) | `ClaudeMdSection.tsx` | F |
| I13 | Feasibility step labels truncated | `FeasibilityStudyBuilder.tsx` | B |
| I14 | Simulator buttons same visual weight | `SimulatorControls.tsx` | C |
| I15 | File cards lack interactive affordance | `StarterKitSection.tsx` | E |
| I16 | Quality criteria cards small/low-contrast | `ClaudeMdSection.tsx` | F |
| I20 | Before/After colour-only semantic meaning | `ClaudeMdSection.tsx` | F |
| I21 | Best practices use `<div>` not `<ul>/<li>` | `ClaudeMdSection.tsx` | F |
| I22 | Radix `aria-describedby` warnings | `sheet.tsx`, `dialog.tsx` | E |
| I23 | File card buttons verbose accessible names | `StarterKitSection.tsx` | E |
| I25 | ROI tab filter overlaps on mobile | `RoiMeasurementSection.tsx` | B |
| I26 | Mobile file browser meaningless abbreviations | `StarterKitSection.tsx` | E |
| I27 | Mobile table/code overflow without scroll indicators | `ClaudeMdSection.tsx`, `SessionManagementSection.tsx` | F, D |
| I28 | Calculator output cards vertical space on mobile | `RoiMeasurementSection.tsx` | B |
| I30 | Dark mode Quick Start card invisible | `StarterKitSection.tsx` | E |
| I31 | Tablet hero heading overlaps header | `HomePage.tsx` | A |
| I32 | Response Buffer segment confusing | `context-simulator-data.ts`, `ContextWindowBar.tsx` | C |
| I33 | Plugin table loses first-column context | `ClaudeMdSection.tsx` | F |
| I34 | 11 file cards no progressive disclosure | `StarterKitSection.tsx` | E |
| I35 | Excessive whitespace on ROI page | `RoiMeasurementSection.tsx` | B |
| I36 | CLAUDE.md page density high | `ClaudeMdSection.tsx` | F |
| I37 | Accordion items lack typographic prominence | `ClaudeMdSection.tsx` | F |
| I39 | Recurring Tasks 14 client-specific refs | `RecurringTasksSection.tsx` | I |
| I40 | Governance 13 client-specific refs | `GovernancePolicySection.tsx` | I |

### Nice-to-Have (80 remaining)

Full list is in `agent-outputs/design-audit-synthesis.md`. Items are allocated to workstreams below by affected file. Done items (N31, N42, N56, N71, N84) are excluded.

### Additional from Critique Files (13 remaining)

| Source | ID | Issue | Workstream |
|--------|----|-------|------------|
| Skills/Extensions | I2 | `setTimeout` partial fix -- consider `onTransitionEnd` | G |
| Skills/Extensions | I3 | Card-based mobile layout for availability/cost tables | G |
| Skills/Extensions | I5 | Page-level section navigation / ToC | G (overlaps J) |
| Skills/Extensions | N2 | Replace string-based filters with `devOnly` boolean | G |
| Skills/Extensions | N3 | Convert combination patterns table to cards | G |
| Skills/Extensions | N4 | Extract data arrays (~710 lines) to data file | G |
| Skills/Extensions | N5 | Wrap filtered arrays in `useMemo` | G |
| Skills/Extensions | N6 | Style Collapsible trigger to match accordion | G |
| Brand Voice | I2 | Storage table responsive card layout for mobile | H |
| Brand Voice | N1 | Entrance animations (overlaps synthesis I3) | H |
| Brand Voice | N2 | `LucideIcon` type instead of `typeof Palette` | H |
| Brand Voice | N3 | Scroll-to-anchor support for section IDs | H |
| Brand Voice | N4 | Visual separators between Part 2 sub-sections | H |

### Parameterisation Remaining (~61 refs across 6 pages)

| Page | File | Refs | Notes |
|------|------|------|-------|
| Regression Testing | `RegressionTestingSection.tsx` | 16+ | Ghost Inspector structural -- may need `siteConfig` additions (e.g., `testingTool`, `testingProvider`) |
| Avoiding Hallucinations | `HallucinationsSection.tsx` | 7 | Prompt examples with Phew-specific content |
| Recurring Tasks | `RecurringTasksSection.tsx` | 14 | LMS, safeguarding terminology in data arrays + JSX |
| Governance | `GovernancePolicySection.tsx` | ~13 | Register template, risk tier examples, Phew starter kit refs |
| MCP Usage | `McpUsageSection.tsx` | 6 | Phew-specific references |
| Plugins | `PluginsSection.tsx` | 5 | Phew-specific references |

---

## Parallelised Workstream Plan

### Dependency Ordering

```
Workstream J (shared components) ──> All other workstreams
                                      ├── A (Home page)          independent
                                      ├── B (ROI & Feasibility)  independent
                                      ├── C (Context Simulator)  independent
                                      ├── D (Session Management) independent
                                      ├── E (Starter Kit)        independent
                                      ├── F (CLAUDE.md)          independent
                                      ├── G (Skills/Extensions)  independent
                                      ├── H (Brand Voice)        independent
                                      └── I (Parameterisation)   independent of A-H
```

**Workstream J should run first** (or at least commit before others start) because it touches shared components that other workstreams import. Workstreams A-I can then run fully in parallel -- each operates on distinct files with no overlap.

---

### Workstream J: Shared Components and Cross-Page Patterns

**Files:** `CalloutCard.tsx`, `CodeBlock.tsx`, `ScrollHint.tsx`, `PromptExample.tsx`, `TrackLayout.tsx`, `index.css`

**Priority: Run first -- other workstreams depend on these files.**

| ID | Issue | File | Effort |
|----|-------|------|--------|
| I3 (partial) | Entrance animation utility -- create a shared `FadeIn` or `AnimateOnMount` wrapper that other workstreams can import | New utility or pattern in existing file | Small |
| I27 (partial) | Ensure `ScrollHint` pattern is applied consistently to all table/code containers. Verify `CodeBlock.tsx` wraps correctly. | `CodeBlock.tsx`, `ScrollHint.tsx` | Small |
| N70 | `PromptExample` cards visually similar to static content -- add a distinct left border or background tint | `PromptExample.tsx` | Small |

**Acceptance:** Build passes. Shared components updated. Pattern documented in a code comment for downstream workstreams.

---

### Workstream A: Home Page Rework

**Files:** `HomePage.tsx`

**Note:** Session 22 already rewrote the home page significantly (differentiated cards, warm hero, fluid type, `<h2>` titles, `md:` breakpoint, entrance animations). Verify whether C2, C5, I3-home, I5, and I8 are already resolved. Fix any that remain.

| ID | Issue | Effort | Notes |
|----|-------|--------|-------|
| C2 | Identical twin cards (AI slop) | Verify | Likely resolved in Session 22 rewrite |
| C5 | Cards share first 4 section titles | Verify | Tied to C2 |
| I5 | Lacks personality/warmth | Verify | Session 22 added welcome warmth |
| I8 | h1 duplicates header logo text | Verify/Small | May need h1 to be distinct value statement |
| I31 | Tablet hero heading overlaps header | Small | Increase `py-12` to `py-16` or `pt-20` |
| N8 | No visual distinction from generic template | Small | |
| N11 | h1 does not use fluid type (`clamp()`) | Verify | Session 22 may have added this |
| N12 | Card title size too close to body | Verify | Session 22 may have addressed |
| N20 | Heading font same as body -- h1 lacks personality | Small | Different `font-weight` or `tracking` |
| N21 | Spacing rhythm uniform between hero and cards | Small | |
| N32 | "Get started" CTA low-contrast | Small | Upgrade to filled button variant |
| N33 | Icon backgrounds barely visible in dark mode | Trivial | `/10` -> `/15` or `/20` |
| N41 | Card hover states too subtle | Small | `hover:shadow-md` + slight lift |
| N43 | Card titles should be `<h2>` elements | Verify | Session 22 may have done this |
| N54 | Mobile doesn't feel intentional | Small | Full-width button + `py-3` |
| N66 | Two-column grid triggers too early at 640px | Verify | Session 22 changed to `md:` |
| N67 | Centre-aligned hero | Small | Consider left-aligned per guidelines |

**Acceptance:** Home page scores 7.5+ by audit criteria. No AI slop. Mobile, tablet, and desktop all feel intentional.

---

### Workstream B: ROI & Feasibility

**Files:** `RoiMeasurementSection.tsx`, `FeasibilityStudyBuilder.tsx`, `roi-data.ts`, `feasibility-data.ts`

| ID | Issue | File | Effort |
|----|-------|------|--------|
| I13 | Feasibility step labels truncated on desktop | `FeasibilityStudyBuilder.tsx` | Verify (Session 22 may have fixed) |
| I25 | Tab filter overlaps cards on mobile | `RoiMeasurementSection.tsx` | Verify (Session 22 fix) |
| I28 | Calculator output cards too much vertical space on mobile | `RoiMeasurementSection.tsx` | Small -- keep 2x2 grid on mobile |
| I35 | Excessive whitespace between intro callout and calculator | `RoiMeasurementSection.tsx` | Small -- reduce `space-y-12` locally |
| N1 | "Related Sections" heading breaks icon+H2 pattern | `RoiMeasurementSection.tsx` | Small |
| N2 | Section headings formulaic | `RoiMeasurementSection.tsx` | Small -- vary phrasing |
| N9 | 14 task templates overwhelming when "All" selected | `RoiMeasurementSection.tsx` | Small -- default to specific category |
| N13 | Calculator output labels `text-xs` too small | `RoiMeasurementSection.tsx` | Trivial |
| N14 | Dense text in task template before/after cards | `RoiMeasurementSection.tsx` | Small |
| N22 | Section spacing inconsistency around feasibility builder | `RoiMeasurementSection.tsx` | Small |
| N23 | Task template cards uneven heights | `RoiMeasurementSection.tsx` | Small |
| N24 | Feasibility nav buttons far from step indicator on mobile | `FeasibilityStudyBuilder.tsx` | Small |
| N34 | "Copy for business case" button too subtle | `RoiMeasurementSection.tsx` | Small |
| N35 | Range sliders use browser-default styling | `RoiMeasurementSection.tsx` | Medium -- `bunx shadcn add slider` |
| N44 | Verify `aria-expanded` on collapsible triggers | `RoiMeasurementSection.tsx` | Trivial |
| N45 | Before/After panels lack `role="group"` | `RoiMeasurementSection.tsx` | Small |
| N46 | Calculator copy button `aria-label` not associated | `RoiMeasurementSection.tsx` | Small |
| N55 | Feasibility checkboxes wrap at 375px | `FeasibilityStudyBuilder.tsx` | Small |
| N72 | Default ROI values seem too optimistic | `RoiMeasurementSection.tsx` | Small -- add contextual note |
| N80 | "Start a new study" only on step 7 | `FeasibilityStudyBuilder.tsx` | Small |
| N81 | No progress indication per feasibility step | `FeasibilityStudyBuilder.tsx` | Small |
| N82 | Feasibility preview uses raw `<pre>` | `FeasibilityStudyBuilder.tsx` | Medium |
| N85 | Getting Started circles too subtle | `RoiMeasurementSection.tsx` | Trivial |

**Acceptance:** ROI page scores 8+. Feasibility builder responsive on mobile. Calculator output clean at 375px.

---

### Workstream C: Context Simulator

**Files:** `ContextSimulatorSection.tsx`, `ContextWindowSimulator.tsx`, `ContextWindowBar.tsx`, `SimulatorControls.tsx`, `SimulatorStatus.tsx`, `context-simulator-data.ts`

| ID | Issue | File | Effort |
|----|-------|------|--------|
| I2 (context) | Simulator not visually distinct from prose | `ContextSimulatorSection.tsx` | Medium -- add bordered container |
| I14 | "Add turn" and "Reset" buttons same visual weight | `SimulatorControls.tsx` | Small -- make Reset `variant="outline"` or `variant="ghost"` |
| I32 | Response Buffer segment confusing | `context-simulator-data.ts`, `ContextWindowBar.tsx` | Small -- change colour or pattern |
| N3 | "Practical cost awareness" filler sentence | `ContextSimulatorSection.tsx` | Trivial -- rewrite |
| N4 | "Understanding Context" accordion disconnected | `ContextSimulatorSection.tsx` | Small -- add transition sentence |
| N53 | Tool search toggle focus ring low-contrast in dark mode | `ContextSimulatorSection.tsx` | Small |
| N57 | Mobile status truncates denominator | `SimulatorStatus.tsx` | Small |
| N58 | Dark mode bar container invisible | `ContextWindowBar.tsx` | Trivial -- increase opacity |
| N59 | Handoff prompt code block very tall on mobile | `ContextSimulatorSection.tsx` | Small -- collapsible |
| N60 | Handoff prompt buried at bottom for general audience | `ContextSimulatorSection.tsx` | Small -- consider reordering |
| N68 | Mobile bar segments illegible at 375px | `ContextWindowBar.tsx` | Medium -- consider vertical bar |
| N69 | System Prompt and Skills colours too similar | `context-simulator-data.ts` or `index.css` | Trivial |
| N83 | Simulator status text not styled as part of tool | `SimulatorStatus.tsx` | Small |

**Acceptance:** Simulator clearly delineated from surrounding prose. Controls have clear primary/secondary hierarchy. Mobile bar readable.

---

### Workstream D: Session Management

**Files:** `SessionManagementSection.tsx`, `session-management-data.ts`

| ID | Issue | File | Effort |
|----|-------|------|--------|
| I2 (sessions) | Copyable templates not visually distinct | `SessionManagementSection.tsx` | Medium |
| I6 (sessions) | No visual rhythm variation | `SessionManagementSection.tsx` | Verify (Session 22 added separators) |
| N5 | Memory section disconnected from session theme | `SessionManagementSection.tsx` | Small -- add transition |
| N6 | Worked example hidden behind collapsible | `SessionManagementSection.tsx` | Small -- promote visibility |
| N10 | Five copyable templates no filtering/tabbing | `SessionManagementSection.tsx` | Medium -- tabs or accordion |
| N15 | Dense prompt text on mobile | `SessionManagementSection.tsx` | Small |
| N16 | Accordion trigger `font-medium` same as H3 | `SessionManagementSection.tsx` | Trivial |
| N25 | Five templates create 2-3 viewport scroll region | `SessionManagementSection.tsx` | Medium -- tabs (overlaps N10) |
| N26 | Timeline circles fragile absolute positioning | `SessionManagementSection.tsx` | Small |
| N27 | Timeline cramped at 375px mobile | `SessionManagementSection.tsx` | Small |
| N36 | Copy button icon-only -- no text label | `SessionManagementSection.tsx` | Small |
| N37 | No hover state on cross-reference link | `SessionManagementSection.tsx` | Trivial |
| N47 | Handoff workflow `<ol>` uses absolute spans for numbers | `SessionManagementSection.tsx` | Small |
| N48 | Copy buttons lack context-specific `aria-label` | `SessionManagementSection.tsx` | Verify (Session 22 may have done this) |

**Acceptance:** Session templates in tabs/accordion. Visual rhythm clear. Mobile layout comfortable at 375px.

---

### Workstream E: Starter Kit

**Files:** `StarterKitSection.tsx`, `starter-kit-data.ts`

| ID | Issue | File | Effort |
|----|-------|------|--------|
| I7 | H1/H2 size collision | `StarterKitSection.tsx` | Verify (Session 22 fix) |
| I15 | File cards lack interactive affordance | `StarterKitSection.tsx` | Small |
| I22 | Radix `aria-describedby` warnings | `sheet.tsx`, `dialog.tsx` | Verify (Session 22 fix) |
| I23 | File card buttons verbose accessible names | `StarterKitSection.tsx` | Verify (Session 22 fix) |
| I26 | Mobile file browser meaningless abbreviations | `StarterKitSection.tsx` | Verify (Session 22 fix) |
| I30 | Dark mode Quick Start card invisible | `StarterKitSection.tsx` | Small -- increase background opacity |
| I34 | 11 file cards no progressive disclosure | `StarterKitSection.tsx` | Medium -- "Show more" or category sub-groups |
| N17 | File card names don't stand out | `StarterKitSection.tsx` | Trivial |
| N18 | Quick Start list items `text-sm` | `StarterKitSection.tsx` | Trivial |
| N28 | Download ZIP button wraps at 500-700px | `StarterKitSection.tsx` | Small |
| N29 | Download button placement on mobile | `StarterKitSection.tsx` | Small |
| N38 | Tab switching no transition animation | `StarterKitSection.tsx` | Small |
| N41 | Card hover states too subtle | `StarterKitSection.tsx` | Small |
| N49 | Download link needs descriptive `aria-label` | `StarterKitSection.tsx` | Trivial |
| N50 | No heading for mobile section breadcrumb | `StarterKitSection.tsx` | Small |
| N61 | Sidebar breakpoint `lg` could be `md` | `StarterKitSection.tsx` | Small |
| N62 | File browser tab bar no visible background in light mode | `StarterKitSection.tsx` | Trivial |
| N63 | Sidebar link tinting too subtle | `StarterKitSection.tsx` | Trivial |
| N64 | Uniform card list could use visual sub-grouping | `StarterKitSection.tsx` | Medium |
| N65 | Track completion card generic | `StarterKitSection.tsx` | Small |
| N73 | "Common Install Commands" thin for general track | `StarterKitSection.tsx` | Small |
| N74 | Warning variant for gentle advice | `StarterKitSection.tsx` | Trivial -- change to info |
| N75 | Pagination shows only "Previous" | `StarterKitSection.tsx` | Trivial |
| N76 | H3 headings same visual weight | `StarterKitSection.tsx` | Small |
| N77 | Page functional but cold | `StarterKitSection.tsx` | Small |

**Acceptance:** File cards clearly interactive. Progressive disclosure for long lists. Dark mode Quick Start visible. Tab switching animated.

---

### Workstream F: CLAUDE.md (Developer Page)

**Files:** `ClaudeMdSection.tsx`

| ID | Issue | File | Effort |
|----|-------|------|--------|
| C4 | File types table truncated at 375px | `ClaudeMdSection.tsx` | Small -- card fallback or `ScrollHint` |
| I6 (claude) | No visual rhythm variation | `ClaudeMdSection.tsx` | Small |
| I10 | Excessive accordion vertical space | `ClaudeMdSection.tsx` | Small -- tighter padding |
| I16 | Quality criteria cards small/low-contrast | `ClaudeMdSection.tsx` | Small |
| I20 | Before/After colour-only semantic meaning | `ClaudeMdSection.tsx` | Verify (Session 22 added icons) |
| I21 | Best practices use `<div>` not `<ul>/<li>` | `ClaudeMdSection.tsx` | Small |
| I27 (claude) | Mobile table/code overflow no scroll indicators | `ClaudeMdSection.tsx` | Small -- apply `ScrollHint` |
| I33 | Plugin table loses first-column context | `ClaudeMdSection.tsx` | Small -- sticky first column or card fallback |
| I36 | Page density high | `ClaudeMdSection.tsx` | Medium -- section breaks, breathing room |
| I37 | Accordion items lack typographic prominence | `ClaudeMdSection.tsx` | Small -- increase to `text-lg font-semibold` |
| N7 | IDE alternatives callout reads as defensive | `ClaudeMdSection.tsx` | Trivial -- rewrite |
| N19 | Extensive `text-sm` creates monotony | `ClaudeMdSection.tsx` | Small |
| N30 | Getting Started step alignment off | `ClaudeMdSection.tsx` | Trivial |
| N39 | Copy button lacks micro-animation | `ClaudeMdSection.tsx` | Small |
| N40 | No visual indicator of accordion item count | `ClaudeMdSection.tsx` | Trivial -- add "10 sections" |
| N51 | Table header rows lack `bg-muted/30` background | `ClaudeMdSection.tsx` | Trivial |
| N52 | Getting Started steps use `<div>` not `<ol>` | `ClaudeMdSection.tsx` | Small |
| N78 | Best Practices section blends with accordion above | `ClaudeMdSection.tsx` | Small |
| N79 | Collapsed accordion looks like checklist | `ClaudeMdSection.tsx` | Small -- add subtitles |

**Acceptance:** Tables readable on mobile. Accordion items visually prominent. Page density reduced. All semantic HTML corrected.

---

### Workstream G: Skills/Extensions

**Files:** `SkillsExtensionsSection.tsx`

| ID | Source | Issue | Effort |
|----|--------|-------|--------|
| C7 | Synthesis | `TooltipTrigger` wrapping `<td>` -- invalid HTML | Small -- use `title` attribute or wrap cell content |
| I2 | Critique | `setTimeout` partial -- consider `onTransitionEnd` | Small |
| I3 | Critique | Card-based mobile layout for availability/cost tables | Medium-Large |
| I5 | Critique | Page-level section navigation / ToC | Medium |
| N2 | Critique | Replace string-based filters with `devOnly` boolean | Small |
| N3 | Critique | Convert combination patterns table to cards | Small |
| N4 | Critique | Extract data arrays (~710 lines) to data file | Small |
| N5 | Critique | Wrap filtered arrays in `useMemo` | Trivial |
| N6 | Critique | Style Collapsible trigger to match accordion | Small |

**Acceptance:** No invalid HTML. Mobile tables in card layout. Data extracted to separate file. Performance-optimised with `useMemo`.

---

### Workstream H: Brand Voice

**Files:** `BrandVoiceSection.tsx`, `brand-voice-data.ts`, `SetupStepCard.tsx`

| ID | Source | Issue | Effort |
|----|--------|-------|--------|
| I2 | Critique | Storage table responsive card layout for mobile | Small |
| N1 | Critique | Entrance animations (use pattern from Workstream J) | Small |
| N2 | Critique | `LucideIcon` type instead of `typeof Palette` | Trivial |
| N3 | Critique | Scroll-to-anchor support for section IDs | Small |
| N4 | Critique | Visual separators between Part 2 sub-sections | Small |

**Acceptance:** Storage table readable on mobile. Entrance animations consistent with other pages. Anchors linkable.

---

### Workstream I: Parameterisation Sweep

**Files:** `RecurringTasksSection.tsx`, `GovernancePolicySection.tsx`, `RegressionTestingSection.tsx`, `HallucinationsSection.tsx`, `McpUsageSection.tsx`, `PluginsSection.tsx`, `config/site.ts`

**This workstream operates on files no other workstream touches (developer track pages + Recurring Tasks + Governance).**

| Page | File | Refs | Approach |
|------|------|------|----------|
| Recurring Tasks | `RecurringTasksSection.tsx` | 14 | Replace "Phew!" with `siteConfig.companyName`, replace "LMS" / "safeguarding" with generic equivalents or `siteConfig` industry terms |
| Governance | `GovernancePolicySection.tsx` | ~13 | Parameterise register template entries, risk tier examples, "Phew starter kit" refs |
| Regression Testing | `RegressionTestingSection.tsx` | 16+ | Ghost Inspector structural -- add `siteConfig.testingTool` or similar; replace Phew-specific test scenarios with generic examples |
| Avoiding Hallucinations | `HallucinationsSection.tsx` | 7 | Replace Phew-specific prompt examples with generic or `siteConfig`-driven content |
| MCP Usage | `McpUsageSection.tsx` | 6 | Replace Phew-specific references |
| Plugins | `PluginsSection.tsx` | 5 | Replace Phew-specific references |

**Approach for all pages:**
1. Search for "Phew", "phew", "PHEW" in the file
2. Search for domain-specific terms (safeguarding, LMS, Ghost Inspector, etc.)
3. Replace with `siteConfig` references or generic equivalents
4. Add any needed new fields to `config/site.ts` (e.g., `industry`, `testingTool`, `industryTerms`)

**Acceptance:** Zero hardcoded client-specific references. `grep -ri "phew" app/src/content/` returns only the files already parameterised via `siteConfig`. Any new `siteConfig` fields are documented with inline comments.

---

## Key Files Reference

### Audit & Planning Documents

| Document | Path | Purpose |
|----------|------|---------|
| Design Audit Synthesis | `agent-outputs/design-audit-synthesis.md` | Master issue list with DONE markers, wave ordering, cross-page patterns |
| Skills/Extensions Critique | `agent-outputs/design-critique-skills-extensions.md` | 20 findings (C1-C4, I1-I5, N1-N6) |
| Brand Voice Critique | `agent-outputs/design-critique-brand-voice.md` | 16 findings (C1-C6, I1-I4, N1-N4) |
| Session 25 Prompt | `docs/continuation-prompts/continuation-prompt-25-remaining-polish-and-parameterisation.md` | Previous session context |
| Frontend Guidelines | `docs/reference/frontend-skills-review.md` | Design and engineering standards |
| Application Overview | `docs/reference/application-overview.md` | Architecture, content model, parameterisation |

### Source Files by Workstream

| Workstream | Primary File(s) | Path |
|------------|----------------|------|
| J (Shared) | `CalloutCard.tsx`, `CodeBlock.tsx`, `ScrollHint.tsx`, `PromptExample.tsx`, `TrackLayout.tsx`, `index.css` | `app/src/components/content/`, `app/src/components/layout/`, `app/src/` |
| A (Home) | `HomePage.tsx` | `app/src/components/layout/HomePage.tsx` |
| B (ROI) | `RoiMeasurementSection.tsx`, `FeasibilityStudyBuilder.tsx` | `app/src/content/general/` |
| C (Context) | `ContextSimulatorSection.tsx`, `ContextWindowSimulator.tsx`, `ContextWindowBar.tsx`, `SimulatorControls.tsx`, `SimulatorStatus.tsx`, `context-simulator-data.ts` | `app/src/content/general/`, `app/src/components/interactive/`, `app/src/content/shared/` |
| D (Sessions) | `SessionManagementSection.tsx`, `session-management-data.ts` | `app/src/content/general/`, `app/src/content/shared/` |
| E (Starter Kit) | `StarterKitSection.tsx`, `starter-kit-data.ts` | `app/src/content/shared/` |
| F (CLAUDE.md) | `ClaudeMdSection.tsx` | `app/src/content/developer/ClaudeMdSection.tsx` |
| G (Skills) | `SkillsExtensionsSection.tsx` | `app/src/content/general/SkillsExtensionsSection.tsx` |
| H (Brand Voice) | `BrandVoiceSection.tsx`, `brand-voice-data.ts`, `SetupStepCard.tsx` | `app/src/content/general/`, `app/src/content/shared/`, `app/src/components/content/` |
| I (Params) | `RecurringTasksSection.tsx`, `GovernancePolicySection.tsx`, `RegressionTestingSection.tsx`, `HallucinationsSection.tsx`, `McpUsageSection.tsx`, `PluginsSection.tsx`, `site.ts` | `app/src/content/general/`, `app/src/content/developer/`, `app/src/config/` |

---

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format       # Prettier -- format all files
cd app && bun run format:check # Prettier -- check without writing
cd app && bunx tsc --noEmit    # Type check only
```

---

## Execution Strategy

### Phase 1: Shared Components (Workstream J)

Run Workstream J first. This establishes shared patterns (entrance animation utility, `ScrollHint` consistency, `PromptExample` visual distinction) that downstream workstreams can import.

**Estimated effort:** 30-60 minutes.

### Phase 2: Parallel Workstreams (A-I)

After J commits, launch all remaining workstreams in parallel. Each agent works on its own non-overlapping file set. Suggested agent allocation:

| Agent | Workstream(s) | File Count | Issue Count |
|-------|--------------|------------|-------------|
| Agent 1 | A (Home) | 1 file | ~17 items (many may be already done) |
| Agent 2 | B (ROI & Feasibility) | 3 files | ~23 items |
| Agent 3 | C (Context Simulator) | 6 files | ~13 items |
| Agent 4 | D (Session Management) | 2 files | ~14 items |
| Agent 5 | E (Starter Kit) | 2 files | ~25 items |
| Agent 6 | F (CLAUDE.md) | 1 file | ~19 items |
| Agent 7 | G (Skills/Extensions) | 1 file | ~9 items |
| Agent 8 | H (Brand Voice) | 3 files | ~5 items |
| Agent 9 | I (Parameterisation) | 7 files | ~61 refs |

**Note:** Agents handling lighter workstreams (A, H) can take on additional work from heavier ones (B, E, F) if they finish early.

### Phase 3: Verification

After all workstreams complete:

1. Run `cd app && bun run build` to verify TypeScript + build pass
2. Run `cd app && bun run lint` and `cd app && bun run format:check`
3. Run `grep -ri "phew" app/src/content/ app/src/components/` to verify zero remaining hardcoded client refs (should only appear in `siteConfig` values)
4. Visual spot-check in browser: Home, ROI, Context, Sessions, Starter Kit, CLAUDE.md, Skills/Extensions, Brand Voice at 375px, 768px, and 1440px
5. Update `agent-outputs/design-audit-synthesis.md` with all newly completed items marked DONE

### Phase 4: Final Commit

Single commit with message: `feat: clear all design audit and parameterisation debt (Session 26)`

---

## Important Reminders

- **UK English throughout.** All content, examples, and copy must use UK English spelling and grammar.
- **Do not modify `components/ui/` files** (shadcn/ui generated components) unless fixing a specific bug (like the Radix `aria-describedby` suppression already done).
- **Tailwind v4 -- no config file.** Theme customisation is in `app/src/index.css` via `@theme inline {}`.
- **`@/` path alias** maps to `app/src/`.
- **`siteConfig`** in `config/site.ts` is the single source for all client-specific values. All parameterisation work should route through this file.
- **Build must pass** (`cd app && bun run build`) before any commit. This includes TypeScript type checking.
- **Verify "already done" items.** Many items in Workstreams A and E were likely resolved in Sessions 22-23. Check before re-implementing.
