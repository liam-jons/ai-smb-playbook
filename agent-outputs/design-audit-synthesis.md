# Design Audit Synthesis

> **Produced:** 17 February 2026
> **Updated:** 17 February 2026 (Session 23 — Wave 4 fixes + 2 additional full critiques)
> **Source files:** `agent-outputs/design-critique-{home,roi-measurement,context,session-management,starter-kit,claude-md,skills-extensions,brand-voice}.md`
> **Pages audited:** 8 full critiques + 12 triaged of 20 total
> **Total findings:** 127 original + new findings from Skills/Extensions and Brand Voice critiques

---

## Executive Summary

Across 6 pages, the AI SMB Playbook demonstrates **strong content quality, excellent colour/token architecture (OKLCH), and solid accessibility foundations** -- but suffers from **visual monotony, a critical routing bug, and a consistent pattern of interactive tools not being visually distinct enough from surrounding prose**. The average score is **6.9/10**. The colour system, dark mode implementation, and educational content are professional-grade. The main weaknesses are structural: identical card patterns on the home page (AI slop), a narrow content area that underuses wide viewports, and a routing bug that causes page navigation on viewport resize.

**Pre-templatisation relevance:** Many of these findings affect shared components (`TrackLayout`, `CalloutCard`, `CodeBlock`, `PromptExample`, `HomePage`) and theme tokens (`index.css`) that will propagate to every future client deployment. Fixing them now -- before the template branch is created -- means every future client inherits a higher-quality baseline. Deferring them means either fixing the same issues in every client branch or doing a disruptive upstream merge later.

---

## Audit Coverage

### Audited pages (8)

| # | Page | Route | Score |
|---|------|-------|-------|
| 1 | Home | `/` | 5.5/10 |
| 2 | ROI Measurement | `/general/roi-measurement` | 7.5/10 |
| 3 | Context Simulator | `/general/context` | 7.5/10 |
| 4 | Session Management | `/general/sessions` | 7.0/10 |
| 5 | Starter Kit | `/general/starter-kit` | 6.8/10 |
| 6 | CLAUDE.md Files | `/developer/claude-md` | 7.0/10 |
| 7 | Skills, Extensions & Decision Tree | `/general/skills-extensions` | 6.6/10 |
| 8 | Brand Voice & UK English | `/general/brand-voice` | 7.4/10 |

**Average: 6.9/10**

### Triaged pages (12)

| # | Page | Route | Track | Verdict | Report |
|---|------|-------|-------|---------|--------|
| 1 | Welcome & Orientation | `/general/welcome` | Both | Cross-page fixes sufficient | `design-triage-welcome.md` |
| 2 | Skills, Extensions & Decision Tree | `/general/skills-extensions` | Both | **Full critique done** (Session 23) | `design-critique-skills-extensions.md` |
| 3 | AI Governance Policy | `/general/governance` | Both | Cross-page fixes sufficient + parameterisation | `design-triage-governance.md` |
| 4 | Brand Voice & UK English | `/general/brand-voice` | Both | **Full critique done** (Session 23) | `design-critique-brand-voice.md` |
| 5 | Recurring & Scheduled Tasks | `/general/recurring-tasks` | Both | Cross-page fixes sufficient + parameterisation | `design-triage-recurring-tasks.md` |
| 6 | Documentation Structure | `/developer/documentation` | Developer | Cross-page fixes sufficient | `design-triage-developer-track.md` |
| 7 | Codebase Mapping | `/developer/codebase-mapping` | Developer | Cross-page fixes sufficient | `design-triage-developer-track.md` |
| 8 | Avoiding Hallucinations | `/developer/hallucinations` | Developer | Cross-page fixes sufficient | `design-triage-developer-track.md` |
| 9 | AI-Driven Regression Testing | `/developer/regression-testing` | Developer | Cross-page fixes sufficient | `design-triage-developer-track.md` |
| 10 | Safe MCP Usage | `/developer/mcp-usage` | Developer | Cross-page fixes sufficient | `design-triage-developer-track.md` |
| 11 | Plugin Recommendations | `/developer/plugins` | Developer | Cross-page fixes sufficient | `design-triage-developer-track.md` |
| 12 | Codebase Auditing & Technical Debt | `/developer/technical-debt` | Developer | Cross-page fixes sufficient | `design-triage-developer-track.md` |

**Key findings from triage:**
- Welcome & Orientation and all 7 developer track pages: Cross-page fixes already applied (CalloutCard roles, dark mode contrast, pagination alignment, FAB padding) are sufficient. No page-specific design work needed.
- AI Governance Policy and Recurring Tasks: Cross-page fixes sufficient for design, but both need parameterisation sweeps (~13 and ~14 client-specific references respectively) during templatisation.
- Skills/Extensions: Decision tree violates Design Principle 3 (interactive tools must feel distinct). Also has invalid HTML (TooltipTrigger wrapping `<td>`). Full design critique needed before templatisation.
- Brand Voice: Extensive hardcoded client-specific content (7 `phewExample` blocks, Phew-specific callout) is a reusability blocker. Full design critique needed before templatisation.

### Remaining unaudited pages (2)

| # | Page | Route | Notes |
|---|------|-------|-------|
| 1 | Process Document | `/process` | Scheduled for removal per reusability plan |
| 2 | 404 Page | `/*` | Simple error page, not worth auditing |

These 2 remaining pages do not need auditing -- one is scheduled for removal and the other is a simple error page.

---

## Scores by Page

| Page | Score | Key Strength | Key Weakness |
|------|-------|-------------|-------------|
| Home | 5.5/10 | OKLCH colour system, dark mode | Identical twin cards (AI slop), no personality |
| ROI Measurement | 7.5/10 | Task templates, feasibility builder, concrete numbers | ROI calculator lacks visual container, "1 days" bug |
| Context Simulator | 7.5/10 | Simulator concept, progressive educational flow | Desktop segment labels hidden, routing bug |
| Session Management | 7.0/10 | Content quality, practical tone, mobile table adaptation | Copyable templates not visually distinct, monochromatic |
| Starter Kit | 6.8/10 | File browser, Quick Start card, no AI slop | Dark mode card contrast, mobile tab truncation |
| Developer CLAUDE.md | 7.0/10 | Educational arc, realistic templates, quality rubric | Routing bug, mobile table/code overflow |

---

## Issues by Severity

### Critical (must fix)

| # | Issue | Pages | Root Cause / Fix Location |
|---|-------|-------|--------------------------|
| C1 | **Viewport resize triggers unexpected route navigation.** Resizing from desktop to mobile (or vice versa) causes the app to navigate to a different page/track entirely. Users rotating a tablet or resizing a browser lose their place. | Context, Starter Kit, CLAUDE.md (likely all pages) | `TrackLayout.tsx` lines 62-72 -- responsive breakpoint crossing causes re-render that triggers redirect logic when `!sectionSlug` is momentarily undefined. |
| C2 | **Home page identical twin cards are textbook AI slop.** Both track selection cards have identical structure, identical dimensions, identical first 4 section titles. This is the single most visible anti-pattern flagged in the design guidelines. | Home | `HomePage.tsx` lines 38-121 |
| C3 | **Desktop segment labels not visible on Context Simulator.** On desktop, the only way to identify proportional bar segments is hover. No persistent legend exists (mobile legend is `sm:hidden`). | Context | `ContextWindowBar.tsx` lines 64, 138-142, 204-205 |
| C4 | **File types table truncated at 375px with no scroll indicator.** The 4-column table clips at mobile with "Purpose" and "Shared?" columns cut off. The horizontal scroll indicator disappears on iOS, leaving users unaware more columns exist. | CLAUDE.md | `ClaudeMdSection.tsx` lines 494-538 |
| C5 | **Both home page cards share the first 4 section titles.** Sections 1.1-1.4 are identical in both track cards, making the tracks look the same rather than different. The section preview defeats its own purpose. | Home | `HomePage.tsx` lines 58, 100 |
| C6 | **Decision tree on Skills/Extensions page lacks visual distinction from prose sections.** Both the decision tree and the extension reference accordion use identical styling — violates Design Principle 3. | Skills/Extensions | `SkillsExtensionsSection.tsx` — decision tree needs distinct container treatment |
| C7 | **`TooltipTrigger` wrapping `<td>` element creates invalid HTML.** Breaks `table > tbody > tr > td` hierarchy, may cause hydration warnings and accessibility tree issues. | Skills/Extensions | `SkillsExtensionsSection.tsx:854-856` |

### Important (should fix)

#### Layout & Structure

| # | Issue | Pages | Fix Location |
|---|-------|-------|-------------|
| I1 | **Content area too narrow at 1440px.** `max-w-[75ch]` constrains all content pages. (DONE — changed to `max-w-3xl` / 768px) | All 5 content pages | `TrackLayout.tsx:139` |
| I2 | **Interactive tools not visually distinct from prose.** The ROI calculator, context simulator, and copyable templates lack bordered containers that separate them from surrounding text. Design principle "interactive tools feel distinct" is only partially met. | ROI, Context, Sessions | Individual section components |
| I3 | **No page entrance animations on most pages.** Home, Sessions, and CLAUDE.md pages load with no entrance choreography. ROI and Starter Kit have some Motion usage. | Home, Sessions, CLAUDE.md | Individual section components |
| I4 | **Dark mode card/surface contrast insufficient.** Cards blend into page backgrounds in dark mode across multiple pages. The 5-point lightness difference (`oklch(0.21)` card vs `oklch(0.16)` background) is too subtle. | Home, Starter Kit, Context | `index.css` dark mode tokens |
| I5 | **Home page lacks personality and warmth.** No welcome message, no human touch, no use of `siteConfig.consultantName` or `trainingDate`. Page feels auto-generated. | Home | `HomePage.tsx` |
| I6 | **No visual rhythm variation across content pages.** All sections follow the same H2 -> paragraph -> component pattern with uniform `space-y-12` gaps. No separators on Session Management. | Sessions, CLAUDE.md | Individual section components |
| I7 | **H1/H2 size collision on Starter Kit page.** "Starter Kit Contents" (H1) and "Starter Kit" (H2) render at the same size (`text-2xl sm:text-3xl`). | Starter Kit | `StarterKitSection.tsx` |
| I8 | **Home page h1 duplicates the header logo text.** Header already says "Phew! AI Playbook" -- the h1 repeats it, wasting the most valuable screen real estate. | Home | `HomePage.tsx:26-28` |
| I9 | **Excessive empty space below home page cards.** `min-h-[calc(100dvh-3.5rem)]` pushes footer to viewport bottom, creating ~300-400px of blank space between cards and footer. | Home | `HomePage.tsx:21` |
| I10 | **Excessive vertical space between collapsed accordion items.** The 10-section structure accordion on CLAUDE.md spans ~600px with all items collapsed. | CLAUDE.md | `ClaudeMdSection.tsx` accordion sections |
| I11 | **Content width narrow at 1440px relative to available space.** (DONE — widened to `max-w-3xl`) | CLAUDE.md, Sessions, Context | `TrackLayout.tsx:139` |

#### Interactive Tools

| # | Issue | Pages | Fix Location |
|---|-------|-------|-------------|
| I12 | **ROI Calculator lacks visual container.** Inputs/outputs float on page background with no enclosing border, unlike the feasibility builder and task templates. | ROI | `RoiMeasurementSection.tsx:539` |
| I13 | **Feasibility builder step labels truncated on desktop.** Step indicator shows only numbers (1, 2, 3) without titles. Ample horizontal space exists at 1024px+ to show abbreviated labels. | ROI | `FeasibilityStudyBuilder.tsx:311` |
| I14 | **"Add a conversation turn" and "Reset" buttons have same visual weight.** Primary constructive action and destructive reset action are visually indistinguishable. | Context | `SimulatorControls.tsx:149-210` |
| I15 | **File cards in collapsed state lack interactive affordance.** Only visual cue is a small chevron icon. Cards could be mistaken for static content. | Starter Kit | `StarterKitSection.tsx` |
| I16 | **Quality criteria Excellent/Poor comparison cards are small and low-contrast.** Cards use `text-xs` and subtle backgrounds. The key insight of each criterion feels like an afterthought. | CLAUDE.md | `ClaudeMdSection.tsx:838-877` |

#### Accessibility

| # | Issue | Pages | Fix Location |
|---|-------|-------|-------------|
| I17 | **CalloutCard uses `role="alert"` for all variants.** Info and tip callouts should not use assertive alerts -- disruptive for screen readers on pages with multiple callouts. | All pages with callouts | `CalloutCard.tsx` |
| I18 | **Card links on home page have excessively verbose accessible names.** Entire card text content (~100 words) becomes the link accessible name. | Home | `HomePage.tsx:39,81` |
| I19 | **Range sliders on ROI page lack `aria-valuetext`.** Screen readers announce raw numbers without units (e.g. "5" instead of "5 hours per week"). | ROI | `RoiMeasurementSection.tsx:142,211` |
| I20 | **Before/After comparison uses colour alone for semantic meaning.** Red/green distinction is invisible to colour-blind users. Needs icons or explicit text labels. | CLAUDE.md | `ClaudeMdSection.tsx:591-625` |
| I21 | **Best practices items use `<div>` instead of semantic `<ul>/<li>`.** Visually suggests list structure not conveyed by HTML. | CLAUDE.md | `ClaudeMdSection.tsx:717-733` |
| I22 | **Radix UI console warnings about missing `Description` or `aria-describedby`.** Sheet/Dialog components lack accessible descriptions. | Starter Kit | Sheet/Dialog components |
| I23 | **File card buttons have excessively verbose accessible names.** Button text concatenates all visible card content. | Starter Kit | `StarterKitSection.tsx` |

#### Responsive & Dark Mode

| # | Issue | Pages | Fix Location |
|---|-------|-------|-------------|
| I24 | **"1 days" grammar bug in ROI calculator.** Payback period displays "1 days" (plural) when value is 1. Immediate credibility hit. | ROI | `RoiMeasurementSection.tsx:275` |
| I25 | **Tab filter text overlaps cards on mobile (ROI page).** Category filter tabs wrap and overlap with card content below. | ROI | `RoiMeasurementSection.tsx:565` |
| I26 | **Mobile file browser tabs show meaningless 4-char abbreviations.** "Skil", "Temp", "Prom" are not recognisable. | Starter Kit | `StarterKitSection.tsx` tab labels |
| I27 | **Mobile table/code block overflow without scroll indicators.** Tables and code blocks clip at 375px with no visual hint that horizontal scrolling is available. | CLAUDE.md, Sessions | `ClaudeMdSection.tsx`, `CodeBlock.tsx` |
| I28 | **Calculator output cards take too much vertical space on mobile.** Four cards stack as single-column blocks (~320px total). Could remain 2x2 grid with tighter mobile layout. | ROI | `RoiMeasurementSection.tsx` |
| I29 | **Dark mode callout contrast insufficient.** Note text in info callouts appears as low-contrast grey on very dark background. `text-xs` body text inside callouts particularly hard to read. | Context | `CalloutCard.tsx` |
| I30 | **Dark mode Quick Start card background nearly invisible.** `bg-muted/30` background is virtually indistinguishable from page background in dark mode. | Starter Kit | `StarterKitSection.tsx` |
| I31 | **768px tablet: hero heading overlaps sticky header.** `py-12` (48px) top padding insufficient clearance below sticky header on some tablet viewports. | Home | `HomePage.tsx:23` |
| I32 | **Response Buffer segment visually confusing on Context page.** Colour too similar to Available space; striped pattern reads as "loading". | Context | `context-simulator-data.ts:163`, `ContextWindowBar.tsx` |
| I33 | **Plugin comparison table loses first-column context at mobile.** Empty `<th>` for row labels column means table has no clear visual anchor at narrow widths. | CLAUDE.md | `ClaudeMdSection.tsx:746-800` |
| I34 | **Mobile: 11 file cards with no progressive disclosure.** Long scrollable list with no "show more" or grouping pattern. | Starter Kit | `StarterKitSection.tsx` |

#### Content & Page Quality

| # | Issue | Pages | Fix Location |
|---|-------|-------|-------------|
| I35 | **Excessive whitespace between intro callout and ROI Calculator heading.** ~80-100px gap from `space-y-12` + Separator. Users might think the page has ended. | ROI | `RoiMeasurementSection.tsx` |
| I36 | **Page density high on CLAUDE.md compared to general track equivalents.** 8 major sections with 2 accordion groups, 2 tab groups, 2 tables, code blocks, prompts. "Wall of collapsed items" appearance. | CLAUDE.md | `ClaudeMdSection.tsx` |
| I37 | **Section structure accordion items lack typographic prominence.** Default AccordionTrigger text size same as body text. These are H3-level headings and should feel more prominent. | CLAUDE.md | `ClaudeMdSection.tsx:682-704` |

#### Parameterisation & Reusability

| # | Issue | Pages | Fix Location |
|---|-------|-------|-------------|
| I38 | **Brand Voice page has 7 hardcoded `phewExample` blocks.** Client-specific brand voice content embedded directly in component data — reusability blocker. Needs extraction to client-configurable data layer. | Brand Voice | `BrandVoiceSection.tsx` |
| I39 | **Recurring Tasks page has 14 client-specific references.** "Phew!" name, LMS, safeguarding terminology hardcoded in data arrays and JSX. | Recurring Tasks | `RecurringTasksSection.tsx` |
| I40 | **Governance page has Phew-specific content in register template and risk tier examples.** Descriptive text references "Phew! starter kit", register template entries are Phew extensions, risk tiers reference safeguarding domain. | Governance | `GovernancePolicySection.tsx` |
| I41 | **Skills/Extensions page has 3 hardcoded "Phew!" references.** (DONE — parameterised with `siteConfig.companyName`) | Skills/Extensions | `SkillsExtensionsSection.tsx` |

### Nice-to-Have (polish)

Organised by theme. Items marked with **[T]** are particularly relevant to fix before templatisation because they affect shared components or patterns that every future client deployment will inherit.

#### Content & Copy

| # | Issue | Pages | Notes |
|---|-------|-------|-------|
| N1 | "Related Sections" heading on ROI page breaks the icon + H2 pattern used by all other sections | ROI | Uses smaller `text-lg`, no icon |
| N2 | Section headings on ROI page follow a slightly formulaic/listicle pattern | ROI | 8 sections on one page |
| N3 | "Practical cost awareness" callout on Context page contains filler sentence | Context | "Understanding this helps you work more efficiently, not less" |
| N4 | "Understanding Context" accordion section feels disconnected from the simulator above | Context | Needs transitional sentence |
| N5 | Session Management: Memory section feels slightly disconnected from session management theme | Sessions | Needs transitional connection |
| N6 | Session Management: worked example hidden behind collapsible -- only concrete example of task decomposition | Sessions | Strong content buried |
| N7 | CLAUDE.md: IDE alternatives callout reads as defensive rather than confident | CLAUDE.md | Rephrase to confident framing |
| N8 | Home page has no visual distinction from a generic template **[T]** | Home | Brand/personality gap |
| N9 | 14 task templates in one grid may feel overwhelming when "All" is selected | ROI | Consider defaulting to a specific category |
| N10 | Five copyable templates displayed at once with no filtering/tabbing | Sessions | Consider tabs or accordion |

#### Typography

| # | Issue | Pages | Notes |
|---|-------|-------|-------|
| N11 | Home h1 does not use fluid type -- uses step-function `text-3xl sm:text-4xl` **[T]** | Home | Guidelines recommend `clamp()` |
| N12 | Home card title size (`text-xl`) too close to body text -- muddy hierarchy **[T]** | Home | Increase to `text-2xl` |
| N13 | Calculator output labels (`text-xs`) too small on desktop | ROI | Bump to `text-xs sm:text-sm` |
| N14 | Dense text in task template before/after cards | ROI | Consider truncation on desktop |
| N15 | Dense prompt text on mobile creates long scrollable blocks | Sessions | Each prompt is several viewport heights at 375px |
| N16 | Accordion trigger text weight (`font-medium`) same as H3 heading -- hierarchy flattening | Sessions | Shared `font-medium` |
| N17 | File card names don't stand out enough in collapsed state | Starter Kit | Needs bolder weight or larger size |
| N18 | Quick Start list items use `text-sm` -- titles could be `text-base` | Starter Kit | |
| N19 | Extensive use of `text-sm` throughout creates visual monotony | CLAUDE.md | Strategic `text-base` for key sentences |
| N20 | Heading font same as body font -- h1 lacks personality **[T]** | Home | Consider different weight or tracking |

#### Layout & Spacing

| # | Issue | Pages | Notes |
|---|-------|-------|-------|
| N21 | Home page: spacing rhythm is uniform -- no varied spacing between hero and cards | Home | Increase hero-to-cards gap |
| N22 | ROI page: section spacing inconsistency around feasibility builder | ROI | Collapsible adds own padding |
| N23 | ROI page: task template cards have uneven heights in 2-column grid | ROI | Before descriptions vary 1-4 lines |
| N24 | ROI page: feasibility nav buttons far from step indicator on mobile | ROI | Consider sticky bottom nav |
| N25 | Sessions: five templates create a 2-3 viewport-height scrollable region | Sessions | Consider tabs/accordion |
| N26 | Sessions: timeline circles use fragile absolute positioning (`-left-[calc(1.5rem+5px)]`) | Sessions | May misalign at different zoom/font sizes |
| N27 | Sessions: timeline cramped at 375px mobile (`pl-6` = narrow reading area) | Sessions | |
| N28 | Starter Kit: Download ZIP button wraps awkwardly at 500-700px | Starter Kit | |
| N29 | Starter Kit: Download button placement on mobile should be below description | Starter Kit | |
| N30 | CLAUDE.md: Getting Started step number/text alignment off by `pt-1` | CLAUDE.md | |
| N31 | Pagination nav `max-w-[65ch]` misaligned with content `max-w-[75ch]` **[T]** | All content pages | Visible alignment mismatch |

#### Interaction & Motion

| # | Issue | Pages | Notes |
|---|-------|-------|-------|
| N32 | Home: "Get started" CTA is low-contrast `text-primary` at `text-sm` **[T]** | Home | Should be more prominent |
| N33 | Home: icon backgrounds (`bg-primary/10`) barely visible, especially dark mode **[T]** | Home | Increase to `/15` or `/20` |
| N34 | ROI: "Copy for your business case" button is ghost style -- too subtle for primary action | ROI | Consider filled variant |
| N35 | ROI: range sliders use browser-default styling rather than shadcn Slider | ROI | Consider `bunx shadcn add slider` |
| N36 | Sessions: copy button is icon-only -- no text label for discoverability | Sessions | Add "Copy prompt" label |
| N37 | Sessions: no hover state on cross-reference link box | Sessions | Add border/background shift |
| N38 | Starter Kit: tab switching has no transition animation | Starter Kit | Brief fade would help |
| N39 | CLAUDE.md: copy button lacks micro-animation feedback | CLAUDE.md | 150ms scale pulse on checkmark |
| N40 | CLAUDE.md: no visual indicator of how many accordion items exist | CLAUDE.md | Add "10 sections" count |
| N41 | Card hover states too subtle (border-only or `shadow-sm`) **[T]** | Home, Starter Kit | Add `hover:shadow-md` or lift |

#### Accessibility

| # | Issue | Pages | Notes |
|---|-------|-------|-------|
| N42 | Home: track navigation buttons should be `<Link>` not `<button>` (enables right-click/middle-click) **[T]** (DONE) | Home | `Header.tsx:41-64` |
| N43 | Home: card titles should be `<h2>` elements (CardTitle renders as `<div>`) **[T]** | Home | Heading hierarchy gap |
| N44 | ROI: collapsible triggers for task template "Related section" -- verify `aria-expanded` | ROI | Radix should handle, needs verification |
| N45 | ROI: Before/After panels lack `role="group"` and `aria-label` for semantic distinction | ROI | |
| N46 | ROI: calculator copy button `aria-label` not programmatically associated with surrounding text | ROI | |
| N47 | Sessions: handoff workflow `<ol>` uses absolute-positioned spans for numbers instead of native list styling | Sessions | CSS counters or `::marker` preferred |
| N48 | Sessions: copy buttons lack context-specific `aria-label` (5x "Copy to clipboard" indistinguishable) | Sessions | Needs unique labels per prompt |
| N49 | Starter Kit: Download link needs more descriptive `aria-label` | Starter Kit | "Download all starter kit files as ZIP" |
| N50 | Starter Kit: no heading for mobile section breadcrumb | Starter Kit | Visually hidden heading |
| N51 | CLAUDE.md: table header rows lack `bg-muted/30` background differentiation | CLAUDE.md | Header blends with data rows |
| N52 | CLAUDE.md: Getting Started numbered steps use `<div>` not `<ol>` | CLAUDE.md | Screen readers won't announce "step 1 of 6" |
| N53 | Context: tool search toggle focus ring may be low-contrast in dark mode | Context | Test with keyboard nav |

#### Responsive & Dark Mode

| # | Issue | Pages | Notes |
|---|-------|-------|-------|
| N54 | Home: mobile does not feel intentional -- no mobile-specific CTA treatment or touch target sizing **[T]** | Home | Full-width button + `py-3` |
| N55 | ROI: feasibility builder checkboxes wrap awkwardly at 375px | ROI | Use `grid grid-cols-2 sm:flex` |
| N56 | ROI: feedback FAB overlaps content on mobile (global issue) **[T]** | All pages | Add `pb-16` on mobile |
| N57 | Context: mobile status truncates "of ~22" -- loses the educational denominator | Context | Show at least "Turn X of ~22" |
| N58 | Context: dark mode bar container nearly invisible (`bg-muted/30` vs page background) | Context | Increase to `dark:bg-muted/40` |
| N59 | Context: handoff prompt code block very tall on mobile | Context | Consider collapsible with "Show full prompt" |
| N60 | Context: page length -- handoff prompt buried at bottom for general audience | Context | Consider reordering sections |
| N61 | Starter Kit: sidebar breakpoint at `lg` (1024px) could be lowered to `md` (768px) | Starter Kit | 1024px iPad landscape loses sidebar |
| N62 | Starter Kit: file browser tab bar has no visible background in light mode | Starter Kit | Subtle background tint on TabsList |
| N63 | Starter Kit: Starter Kit sidebar link tinting may not be noticeable | Starter Kit | Very subtle differentiation |
| N64 | Starter Kit: long uniform card list could use visual sub-grouping | Starter Kit | Add category sub-headers |
| N65 | Starter Kit: track completion card follows common "congratulations" pattern | Starter Kit | Could be more distinctive |
| N66 | Home: two-column card grid triggers too early at 640px **[T]** | Home | Cards cramped at 640-768px |
| N67 | Centre-aligned hero on home page (guidelines prefer left-aligned) **[T]** | Home | Generic template feel |
| N68 | Mobile proportional bar segments illegible at 375px | Context | Consider vertical/stacked bar |
| N69 | System Prompt and Skills segment colours too similar (hue 270 vs 300) | Context | Shift Skills to distinct hue |
| N70 | PromptExample cards visually similar to static content cards | Sessions, CLAUDE.md | Need stronger differentiation |
| N71 | `getReducedMotion()` doesn't react to live media query changes (DONE) | Starter Kit | Needs `matchMedia` listener |
| N72 | Default ROI calculator values may seem too optimistic (3,689% ROI) | ROI | Add contextual note |
| N73 | Starter Kit: "Common Install Commands" section feels thin for General track | Starter Kit | Only 1 code block |
| N74 | Starter Kit: warning variant used for gentle "Keeping your starter kit current" advice | Starter Kit | Info variant more appropriate |
| N75 | Starter Kit: pagination shows only "Previous" (expected but asymmetric) | Starter Kit | Minor visual incompleteness |
| N76 | Starter Kit: H3 headings all at same visual weight despite different purposes | Starter Kit | Instructional vs browsing vs reference |
| N77 | Starter Kit: page feels functional but slightly cold compared to interactive pages | Starter Kit | No illustrations or personality elements |
| N78 | CLAUDE.md: Best Practices section blends visually with accordion above | CLAUDE.md | Need more differentiation |
| N79 | CLAUDE.md: 10-section accordion appears checklist-like when collapsed | CLAUDE.md | Add parenthetical subtitles |
| N80 | ROI: "Start a new study" button only appears on feasibility step 7 | ROI | Add reset on all steps |
| N81 | ROI: no validation or progress indication per feasibility step | ROI | Highlight which steps have content |
| N82 | ROI: feasibility document preview uses raw `<pre>` block | ROI | Consider rendered Markdown |
| N83 | Context: simulator status text not visually styled as part of interactive tool | Context | Add `font-mono tabular-nums` or background |
| N84 | ROI: calculator output cards lack visual distinction in light mode (white-on-white) (DONE) | ROI | Add `bg-muted/50` background tint |
| N85 | ROI: Getting Started numbered circles (`bg-primary/10`) too subtle | ROI | Increase opacity or use filled variant |

---

## Cross-Page Patterns

These issues appear on **3+ pages** -- fixing them has the highest ROI because a single fix improves multiple pages. Items marked **[Shared Component]** affect components used by every page, making them critical to fix before templatisation.

### 1. Routing bug on viewport resize (all pages) -- CRITICAL [Shared Component]

The most impactful cross-page issue. Viewport resize crossing the `lg` breakpoint causes React Router to lose the current section slug, triggering a redirect. **Fix:** Investigate `TrackLayout.tsx` lines 62-72 -- the `!sectionSlug` check likely fires during a re-render caused by layout transitions.

### 2. Content area too narrow at wide viewports (all 5 content pages) [Shared Component] — DONE

`TrackLayout.tsx:139` widened from `max-w-[75ch]` to `max-w-3xl` (768px). Pagination nav also updated to match.

### 3. Interactive tools not visually distinct from prose (ROI, Context, Sessions)

The design principle "interactive tools feel distinct" is only partially met. The feasibility builder and task templates on the ROI page are well-differentiated, but the ROI calculator, context simulator, and copyable templates blend into their surrounding content. **Fix:** Wrap each interactive tool in a consistent container pattern: `rounded-xl border-2 border-primary/10 bg-card p-6`.

### 4. Dark mode card/surface contrast (Home, Starter Kit, Context) [Shared Component]

Card backgrounds in dark mode (`oklch(0.21)`) against page backgrounds (`oklch(0.16)`) provide only 5 points of lightness difference. Quick Start card `bg-muted/30` is nearly invisible in dark mode. **Fix:** Increase card lightness to `oklch(0.23-0.24)` in dark mode, or add subtle shadows. Review all `bg-muted/*` opacity values in dark mode.

### 5. CalloutCard `role="alert"` for all variants (all pages) [Shared Component]

Every callout card uses `role="alert"` regardless of whether it's a tip, info, or important variant. This causes screen readers to assertively announce all callouts on page load. **Fix:** Use `role="alert"` only for "important" and "warning" variants; use `role="note"` or no role for "info" and "tip".

### 6. No entrance animations (Home, Sessions, CLAUDE.md)

Three of six pages load with no entrance choreography. The Starter Kit page shows that Motion is already a dependency and the pattern works well. **Fix:** Add consistent `motion.div` fade-up animations to hero sections and first content blocks across all pages.

### 7. Mobile table/code overflow without scroll hints (CLAUDE.md, Sessions, Context)

Tables and code blocks clip at 375px with no visual indicator that horizontal scrolling is available. On iOS, native scrollbars disappear. **Fix:** Add fade gradient on the right edge, or a "scroll for more" indicator on overflow containers.

### 8. No visual rhythm variation (Sessions, CLAUDE.md, ROI)

All sections follow the same H2 -> paragraph -> component pattern with uniform `space-y-12` gaps. No visual separators, background changes, or density variation. **Fix:** Add `<Separator />` between major sections (ROI page already does this well). Consider alternating background tints for tool sections.

### 9. Verbose accessible names on interactive cards (Home, Starter Kit)

Both pages have interactive card elements where the full card text content (~100 words) becomes the link/button accessible name. **Fix:** Add explicit `aria-label` attributes with concise descriptions.

### 10. Pagination nav width mismatch (all content pages) [Shared Component]

Pagination uses `max-w-[65ch]` while content uses `max-w-[75ch]`. Creates visible alignment mismatch at wider viewports. **Fix:** Align both to the same width.

### 11. Feedback FAB overlaps content on mobile (all pages) [Shared Component]

The floating action button for "Send feedback" overlaps card and interactive content at 375px. **Fix:** Add `pb-16` to page content area on mobile.

---

## Recommended Fix Order

Priority considers: user impact x pages affected x fix complexity x **templatisation relevance** (fixes to shared components should come before the template branch is created).

### Wave 1: Critical fixes + quick wins (do first)

These must be resolved before templatisation. Each is either a critical bug or a 1-line credibility fix.

| # | Fix | Effort | Location |
|---|-----|--------|----------|
| 1 | **Investigate and fix the routing bug** (DONE — investigated, likely false positive. `useParams()` is URL-derived, no responsive hook feeds routing.) | Medium | `TrackLayout.tsx` lines 62-72 |
| 2 | **Fix "1 days" grammar bug** (DONE) | Trivial | `RoiMeasurementSection.tsx:275` |
| 3 | **Add `aria-label` to home page card links** (DONE) | Trivial | `HomePage.tsx:39,81` |
| 4 | **Fix CalloutCard `role="alert"` for all variants** (DONE) | Small | `CalloutCard.tsx` -- shared component, affects every page |
| 5 | **Fix pagination nav width mismatch** (DONE) | Trivial | `TrackLayout.tsx` or pagination component |

### Wave 2: High-impact visual fixes (shared components + home page)

These affect shared components or the home page (the first impression). Fix before templatisation.

| # | Fix | Effort | Location |
|---|-----|--------|----------|
| 6 | **Differentiate home page track cards** | Medium | `HomePage.tsx` -- different accents, asymmetric layout, unique section previews |
| 7 | **Rewrite home page hero** | Small | `HomePage.tsx` -- action-oriented h1, welcome warmth, use `siteConfig` values |
| 8 | **Fix home page empty space** (DONE) | Small | `HomePage.tsx:21` -- remove `min-h-[calc(100dvh-3.5rem)]` |
| 9 | **Fix dark mode card contrast** (DONE) | Small | `index.css` -- increase card lightness in dark mode tokens |
| 10 | **Show context simulator legend on all viewports** (DONE) | Small | `ContextWindowBar.tsx` -- remove `sm:hidden` |
| 11 | **Wrap ROI Calculator in visual container** (DONE) | Small | `RoiMeasurementSection.tsx:539` -- 1 wrapper div |
| 12 | **Fix dark mode callout contrast** (DONE) | Small | `CalloutCard.tsx` -- ensure WCAG AA in dark mode |

### Wave 3: Cross-page improvements

Improve consistency and accessibility across all content pages.

| # | Fix | Effort | Location |
|---|-----|--------|----------|
| 13 | **Add entrance animations** to Home, Sessions, CLAUDE.md | Medium | Pattern exists in Starter Kit |
| 14 | **Add `aria-valuetext` to ROI range sliders** (DONE) | Small | `RoiMeasurementSection.tsx:142,211` |
| 15 | **Fix mobile tab labels on Starter Kit** | Small | Meaningful abbreviations or icons |
| 16 | **Add visual separators to Session Management** | Small | Add `<Separator />` between sections |
| 17 | **Fix mobile table/code overflow indicators** | Medium | `CodeBlock.tsx` + table containers -- add fade gradient or scroll hint |
| 18 | **Fix Before/After colour-only semantic meaning** | Small | `ClaudeMdSection.tsx:591-625` -- add icons |
| 19 | **Add `aria-label` to Starter Kit file card buttons** | Small | `StarterKitSection.tsx` -- concise descriptions |
| 20 | **Fix Radix `aria-describedby` warnings** | Small | Sheet/Dialog components |
| 21 | **Fix Starter Kit H1/H2 size collision** | Trivial | Step H2 down to `text-xl sm:text-2xl` |
| 22 | **Fix mobile tab overlap on ROI page** | Small | `RoiMeasurementSection.tsx:565` -- add gap |
| 23 | **Add feasibility step titles to desktop indicator** | Small | `FeasibilityStudyBuilder.tsx:311` |

### Wave 4: Polish and consistency

These elevate quality from good to great. Most are individual component refinements.

| # | Fix | Effort | Location |
|---|-----|--------|----------|
| 24 | Consider widening `max-w-[75ch]` or allowing interactive sections to break out (DONE — changed to `max-w-3xl`) | Medium | `TrackLayout.tsx` |
| 25 | Add "on this page" anchor navigation for pages with 5+ sections | Medium | New component, ROI/Sessions/StarterKit/CLAUDE.md |
| 26 | Add icons to section H2 headings for visual anchoring | Medium | Sessions, CLAUDE.md |
| 27 | Use semantic list elements (`<ol>`, `<ul>`) for numbered steps and best practices | Small | CLAUDE.md, Sessions |
| 28 | Fix home page card grid breakpoint (`sm:` -> `md:`) | Trivial | `HomePage.tsx` |
| 29 | Convert header track navigation buttons to `<Link>` elements (DONE) | Small | `Header.tsx` |
| 30 | Make card titles `<h2>` elements on home page | Trivial | `HomePage.tsx` |
| 31 | Add feedback FAB padding on mobile (`pb-16`) (DONE) | Trivial | Layout component |
| 32 | Improve accordion trigger hover states (DONE — `hover:underline` → `hover:bg-accent/50`) | Small | Accordion usage across pages |
| 33 | Fix `getReducedMotion()` to use `matchMedia` listener (DONE — replaced with `useReducedMotion` hook) | Small | `StarterKitSection.tsx` |
| 34 | Add context-specific `aria-label` to session copy buttons | Small | `SessionManagementSection.tsx` |
| 35 | Improve ROI calculator output card backgrounds in light mode (DONE — `bg-card` → `bg-muted/50`) | Trivial | `RoiMeasurementSection.tsx` |

### Wave 5: Component-level refinements (can be done during or after templatisation)

These are per-component improvements that can be addressed during the content review pass or templatisation work.

| # | Fix | Effort | Location |
|---|-----|--------|----------|
| 36 | Add fluid type to home h1 (`clamp()`) | Trivial | `HomePage.tsx` |
| 37 | Increase home card title to `text-2xl` | Trivial | `HomePage.tsx` |
| 38 | Increase icon background opacity (`bg-primary/10` -> `/15` or `/20`) | Trivial | `HomePage.tsx` |
| 39 | Make home "Get started" CTA more prominent | Small | `HomePage.tsx` |
| 40 | Add mobile-specific CTA treatment on home page | Small | `HomePage.tsx` |
| 41 | Consider defaulting ROI category filter to specific category instead of "All" | Small | `RoiMeasurementSection.tsx` |
| 42 | Replace native range inputs with shadcn Slider | Medium | `RoiMeasurementSection.tsx` |
| 43 | Add feasibility builder "Start over" button on all steps | Small | `FeasibilityStudyBuilder.tsx` |
| 44 | Use tabs or accordion for 5 copyable session templates | Medium | `SessionManagementSection.tsx` |
| 45 | Improve Response Buffer segment colour on context simulator | Small | `context-simulator-data.ts`, `ContextWindowBar.tsx` |
| 46 | Shift Skills segment colour to distinct hue (separate from System Prompt) | Trivial | `index.css` |
| 47 | Add transition animation to Starter Kit tab switching | Small | `StarterKitSection.tsx` |
| 48 | Add visual sub-grouping to Starter Kit file card list | Medium | `StarterKitSection.tsx` |
| 49 | Add contextual note below ROI calculator about why ROI percentages are high | Small | `RoiMeasurementSection.tsx` |
| 50 | Consider rendered Markdown for feasibility document preview | Medium | `FeasibilityStudyBuilder.tsx` |

---

## Appendix A: Issues by Page (quick reference)

### Home Page (5.5/10) -- 26 issues

- Critical: C2, C5
- Important: I3, I5, I8, I9, I18, I31
- Nice-to-have: N8, N11, N12, N20, N21, N32, N33, N41, N42, N43, N54, N66, N67

### ROI Measurement (7.5/10) -- 27 issues

- Critical: (none)
- Important: I2, I12, I13, I19, I24, I25, I28, I35
- Nice-to-have: N1, N2, N9, N13, N14, N22, N23, N24, N34, N35, N44, N45, N46, N55, N72, N80, N81, N82, N84, N85

### Context Simulator (7.5/10) -- 17 issues

- Critical: C1, C3
- Important: I1, I2, I4, I14, I29, I32
- Nice-to-have: N3, N4, N53, N57, N58, N59, N60, N68, N69, N83

### Session Management (7.0/10) -- 18 issues

- Critical: (none)
- Important: I2, I6, I17
- Nice-to-have: N5, N6, N10, N15, N16, N25, N26, N27, N36, N37, N47, N48, N70

### Starter Kit (6.8/10) -- 27 issues

- Critical: C1
- Important: I4, I7, I15, I22, I23, I26, I30, I34
- Nice-to-have: N17, N18, N28, N29, N31, N38, N41, N49, N50, N56, N61, N62, N63, N64, N65, N71, N73, N74, N75, N76, N77

### Developer CLAUDE.md (7.0/10) -- 22 issues

- Critical: C1, C4
- Important: I3, I6, I10, I11, I16, I20, I21, I27, I33, I36, I37
- Nice-to-have: N7, N19, N30, N39, N40, N51, N52, N70, N78, N79

---

## Appendix B: Templatisation Impact Assessment

Items from this audit that directly affect the reusability implementation plan (`.planning/plan-files/reusability-implementation-plan.md`):

| Audit Item | Reusability Impact | When to Fix |
|------------|-------------------|-------------|
| C1 Routing bug | Every client deployment inherits this bug | Before Phase 1 of reusability |
| C2 + C5 Home page AI slop | Template first impression for every client | Before Phase 4 (template branch) |
| I5 Home page personality | `siteConfig.consultantName` and `trainingDate` already exist -- using them demonstrates the parameterisation system | During Phase 2 (structural renaming) |
| I8 Home h1 duplication | h1 currently uses `siteConfig.appTitle` which duplicates header -- needs rethinking for generic template | During Phase 4 (template branch) |
| I17 CalloutCard `role="alert"` | Shared component -- every page on every client deployment | Before Phase 1 |
| I4 Dark mode contrast | Theme tokens in `index.css` -- affects every page | Before Phase 4 |
| N31 Pagination width mismatch | Shared layout component | Before Phase 4 |
| N56 Feedback FAB overlap | Global issue | Before Phase 4 |
| N42 Track nav as links | Header component -- every page | Before Phase 4 |

---

## Appendix C: Triage Results Summary

All 12 previously unaudited content pages have been triaged (see individual reports in `agent-outputs/design-triage-*.md`).

### Pages cleared (cross-page fixes sufficient)
- Welcome & Orientation — strongest page in the application, all client values properly parameterised
- All 7 developer track pages — solid structural quality, no interactive tools needing differentiation, client content will be replaced during templatisation

### Pages needing parameterisation only (design is fine)
- AI Governance Policy — ~13 hardcoded references, governance template placeholder system is excellent
- Recurring & Scheduled Tasks — ~14 hardcoded references, page structure follows established patterns

### Pages with full design critiques completed (Session 23)
- **Skills, Extensions & Decision Tree** (6.6/10) — decision tree violates Design Principle 3 (needs distinct visual container), broken aria-labelledby fixed, scrollToCard focus management fixed, 3 hardcoded Phew references parameterised. See `design-critique-skills-extensions.md`.
- **Brand Voice & UK English** (7.4/10) — 7 hardcoded `phewExample` blocks need extraction to configurable data layer, CopyButton mobile/focus visibility fixed. See `design-critique-brand-voice.md`.

### Remaining unaudited (not worth auditing)
- Process Document — scheduled for removal
- 404 Page — simple error page
