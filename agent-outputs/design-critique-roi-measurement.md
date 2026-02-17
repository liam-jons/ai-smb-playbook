# Design Critique: ROI Measurement Page (`/general/roi-measurement`)

**Date:** 17 February 2026
**Viewport widths tested:** 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide desktop)
**Dark mode:** Tested at 1024px
**Page scroll height:** ~11,558px (the longest page in the application)

---

## Executive Summary

The ROI Measurement page is the most content-dense and interactive page in the playbook. It contains seven distinct sections: an introduction, an ROI calculator with sliders and number inputs, a filterable task template gallery (14 cards in a 2-column grid), a collapsible feasibility study builder (7-step wizard), measurement frameworks (3 accordions), common mistakes (6 accordions), a 5-step getting started checklist, and cross-references. The page is remarkably well-structured for its complexity. Interactive tools are visually distinct from prose, the feasibility builder is a genuine standout feature, and the information architecture is logical and scannable. There are a handful of important issues around mobile tab overflow, spacing inconsistency, and a grammar bug, but overall this is a professionally executed, trustworthy B2B page.

**Overall Assessment Score: 7.5 / 10**

---

## 1. Visual Hierarchy and Information Architecture

### What works well

- **Clear section separation.** Each major section is separated by a `<Separator />` (horizontal rule) and introduced with an icon + H2 heading pattern. This creates a consistent rhythm despite the page length.
- **Three-level preview in the intro.** The opening section explicitly names the three tools (ROI Calculator, Task Templates, Measurement Frameworks) with icons and bold labels, acting as a mini table of contents. This is excellent wayfinding for a long page.
- **Progressive disclosure.** Measurement frameworks and common mistakes use accordions, the feasibility builder uses a collapsible, and task template details use collapsibles. This keeps the page scannable despite having enormous amounts of content.
- **The callout card "Start with one task"** immediately below the intro is well-placed -- it sets expectations and reduces the feeling of being overwhelmed.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 1.1 | Nice-to-have | **No page-level table of contents / anchor links** | At ~11,500px tall, users on desktop cannot quickly jump to the calculator, templates, or feasibility builder. A sticky mini-nav or anchor link list at the top would significantly improve navigation. |
| 1.2 | Nice-to-have | **Section spacing inconsistency** | The `space-y-12` wrapper creates 48px gaps between sections, but the feasibility builder is wrapped in a Collapsible that adds its own border/padding, making it feel denser than surrounding sections. The vertical rhythm is slightly uneven. |
| 1.3 | Nice-to-have | **"Related Sections" feels like an afterthought** | It uses a smaller `text-lg` heading vs `text-xl sm:text-2xl` for other sections, no icon, and a simpler layout. This is minor but breaks the pattern established by every other section. |

### Recommendations

- **1.1:** Add a sticky anchor nav or "On this page" component showing section headings. This is common in documentation-style pages and would significantly help orientation. File: `/app/src/content/general/RoiMeasurementSection.tsx`, add a nav component above the first section.
- **1.2:** Consider adding `mt-2` or consistent top margin to the feasibility section's Collapsible trigger to match the visual spacing of other sections.
- **1.3:** Promote the "Related Sections" heading to use the same pattern as other sections (icon + `text-xl sm:text-2xl`).

---

## 2. Interactive Tools vs Prose

### What works well

- **ROI Calculator** is clearly demarcated. The icon + H2 heading, the 2x2 input grid, the 2x2 output card grid with green positive values, and the "Copy for your business case" button all signal "this is a tool, not just text." The output cards with uppercase labels and large bold numbers are immediately scannable.
- **Task Templates** use a distinctive card layout with coloured category badges (blue for Time Savings, red for Error Reduction, green for Getting More Done, amber for Team Capacity, purple for Research & Analysis), red/green before/after comparison panels, and per-card copy buttons. These unambiguously feel like interactive content, not prose.
- **Feasibility Study Builder** is wrapped in a collapsible with a border, an icon, and a distinct trigger style. When expanded, it has its own bordered container. This creates a clear "tool within a page" visual boundary.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 2.1 | Important | **ROI Calculator has no visual container** | Unlike the task templates (cards with borders) and the feasibility builder (bordered container), the ROI Calculator's inputs and outputs float directly on the page background. The inputs are a bare 2x2 grid with no enclosing border or background. On the page, it blends into the surrounding whitespace rather than feeling like a distinct tool panel. |
| 2.2 | Nice-to-have | **"Copy for your business case" button is subtle** | The copy button uses a ghost style with a clipboard icon. It is functional but could be more prominent given that exporting the calculation is a key user goal. |
| 2.3 | Nice-to-have | **Range slider styling is browser-default** | The `accent-primary` class on `<input type="range">` produces browser-default slider styling. On macOS/Chrome, this is a thin grey track with a blue thumb -- functional but not polished compared to the rest of the UI. |

### Recommendations

- **2.1:** Wrap the entire `<RoiCalculator />` in a bordered container (e.g. `rounded-xl border border-border bg-card/50 p-6`) to visually separate it as a tool panel, matching the visual weight of the feasibility builder container. File: `/app/src/content/general/RoiMeasurementSection.tsx`, around line 539.
- **2.2:** Consider upgrading the copy button to a filled `variant="secondary"` or adding a text label like "Copy results" beside it.
- **2.3:** Consider replacing native range inputs with a shadcn/ui Slider component for visual consistency. Add via `bunx shadcn add slider`.

---

## 3. Feasibility Study Builder (7-Step Wizard)

### What works well

- **Step indicator is excellent on desktop.** Each step shows an icon + number, completed steps have a green checkmark, the current step has a primary ring highlight, and connector lines between steps show progress. This is well-executed.
- **Mobile step indicator is smart.** It replaces the 7-button row with a "Step 3 of 7: AI Workflow" text + progress bar. This is a good responsive adaptation.
- **Draft recovery is implemented.** The "Saved draft found" banner with "Resume" and "Discard" buttons, plus a confirmation dialog for discard, shows attention to real user workflows.
- **Template pre-population** is a genuine productivity feature. Selecting a task template populates sensible defaults across multiple steps.
- **Form fields are well-labelled.** Every field has a `<Label>` with `htmlFor`, helper text is present where needed, and required fields are marked.
- **Keyboard navigation.** Step heading receives focus on step transitions via `ref` and `tabIndex={-1}`. The `aria-live="polite"` region announces step changes. `aria-current="step"` is set on the current step indicator.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 3.1 | Important | **Step labels are truncated on desktop.** The step indicator shows only the step number (e.g. "1", "2", "3") without the step title. On desktop at 1024px+, there is ample horizontal space to show "1. Use Case" or similar abbreviated labels. Currently, users must hover or rely on the step heading below to know what each step covers. |
| 3.2 | Nice-to-have | **No validation or progress indication per step.** Users can click "Next" on every step without entering any data. There is no visual indication of which steps have content vs which are empty. A gentle validation nudge (e.g. highlighting required fields on "Next" click) would improve data quality. |
| 3.3 | Nice-to-have | **"Start a new study" button appears only on step 7.** If a user has finished and wants to start fresh, they must navigate to step 7 first, or there is no reset button visible on earlier steps. |
| 3.4 | Nice-to-have | **Document preview on step 7 uses a pre/mono block.** The generated Markdown is shown in a `<pre>` with monospace font. This is technically correct (it is Markdown) but the visual presentation feels raw compared to the rest of the polished UI. A rendered Markdown preview would be more impressive. |

### Recommendations

- **3.1:** Add abbreviated step titles to the desktop step indicator. Change `<span>{i + 1}</span>` to `<span className="hidden lg:inline">{step.title}</span><span className="lg:hidden">{i + 1}</span>` in the StepIndicator component. File: `/app/src/content/general/FeasibilityStudyBuilder.tsx`, around line 311.
- **3.2:** Consider adding a soft validation indicator (e.g. a subtle yellow dot on step buttons that have no content entered yet).
- **3.3:** Add a "Reset" or "Start over" button to the navigation bar that appears on all steps, perhaps as a ghost button on the left.
- **3.4:** Consider using a simple Markdown renderer or at minimum styled HTML output for the preview, rather than raw pre-formatted text.

---

## 4. Emotional Resonance

### What works well

- **The tone is practical, not gimmicky.** Language like "Most teams know AI is saving them time, but struggle to put a number on it" is relatable and grounded. It avoids hype.
- **UK-specific formatting.** Pound signs, "per fortnight", "licences" (UK spelling) -- all signal that this content is written for the target audience, not copy-pasted from a US template.
- **Concrete numbers build credibility.** The task templates show specific time ranges ("10-20 min per substantive email"), cost calculations at real rates ("at 35/hr"), and percentage improvements. This specificity creates trust.
- **The feasibility builder as a tangible deliverable.** It produces a downloadable Markdown document. This transforms the page from "advice" to "tool" -- the user walks away with something they can present to management.
- **"Start with one task" callout** reduces overwhelm and shows empathy for the audience's reality.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 4.1 | Important | **"1 days" grammar bug in the calculator output.** When the payback period is 1 day, the output reads "1 days" (plural). This is a small but visible credibility hit on an otherwise polished page. |
| 4.2 | Nice-to-have | **Default calculator values may seem too optimistic.** With defaults (5 hrs/week, 35/hr, 20/mo tool cost, 1 person), the ROI shows 3,689% and 8,853/year annual savings. While mathematically correct, this extreme ROI figure could trigger scepticism in a B2B audience. A brief note explaining that initial ROI is typically high because tool costs are low relative to labour costs would build credibility. |

### Recommendations

- **4.1:** Fix the pluralisation in the payback days display. Change `{paybackDays} days` to `{paybackDays} {paybackDays === 1 ? 'day' : 'days'}`. File: `/app/src/content/general/RoiMeasurementSection.tsx`, around line 275.
- **4.2:** Add a brief contextual note below the output cards, e.g. "High ROI percentages are typical because AI tool costs are low relative to the labour they displace. Focus on the net savings figure for your business case."

---

## 5. Typography

### What works well

- **Heading hierarchy is well-maintained.** H1 ("Measuring AI ROI") at page top, H2 for each section, H3 for accordion items and feasibility step headings, H4 for task template titles. The hierarchy is semantic and visually correct.
- **`max-w-prose` is used on paragraph text.** This constrains line lengths to a comfortable reading width, which is especially important given the wide content area at 1440px.
- **Tabular-nums on financial figures.** Numbers in the calculator output cards and task template costs use `tabular-nums` for proper alignment. This is a nice typographic detail.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 5.1 | Nice-to-have | **Calculator output label styling is very small.** The uppercase `text-xs font-medium tracking-wider` labels ("MONTHLY NET SAVINGS", "ANNUAL NET SAVINGS") are legible but could be slightly larger on desktop for better scanability. |
| 5.2 | Nice-to-have | **Dense text in task template cards.** The Before/After comparison panels contain up to 4 lines of text (time, cost, process description) in `text-xs` and `text-sm` sizes. On mobile, where cards stack vertically, this is fine. On desktop in the 2-column grid, the cards can feel text-heavy. |

### Recommendations

- **5.1:** Consider bumping the output card labels to `text-sm` on desktop via `text-xs sm:text-sm`.
- **5.2:** Consider truncating the process description to 2 lines with an ellipsis on desktop, expanding on hover or click.

---

## 6. Colour and Theming

### What works well

- **Before/After colour coding.** Red-tinted backgrounds (`bg-danger-muted/30`) for "Before" and green-tinted (`bg-success-muted/30`) for "After" create an instant visual comparison. The colour coding is consistent across all 14 task template cards.
- **Category badge colours** are distinct and consistently applied (blue, red, green, amber, purple).
- **Dark mode is well-implemented.** The calculator output cards, task templates, accordions, and feasibility builder all adapt properly. Borders, backgrounds, and text colours all shift correctly. The green success/red danger colours remain readable against dark backgrounds.
- **Callout cards** use their semantic colours effectively (green for tips, blue for info).

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 6.1 | Nice-to-have | **Calculator output cards lack visual distinction from surrounding content in light mode.** The cards use `border-border bg-card` which is essentially white-on-white in light mode. They rely solely on the border for definition. In dark mode, they gain more visual presence due to the darker card background against the page background. |
| 6.2 | Nice-to-have | **"Getting Started" numbered circles use `bg-primary/10` which is very subtle.** The numbered step circles (1-5) at the bottom of the page are light blue circles with blue numbers. They work but could be more prominent to signal "actionable checklist." |

### Recommendations

- **6.1:** Add a subtle background tint to the calculator output cards in light mode, e.g. `bg-muted/50` instead of `bg-card`, to give them more visual weight.
- **6.2:** Consider using `bg-primary/15` or `bg-primary/20` for a slightly stronger numbered circle, or use a filled circle variant for the primary/first step.

---

## 7. Layout and Spacing

### What works well

- **2-column grids are used consistently.** Calculator inputs (2x2), calculator outputs (2x2), task templates (2xN), and form fields in the feasibility builder all use `sm:grid-cols-2`. This creates visual consistency.
- **The `space-y-12` wrapper** provides generous vertical space between sections, preventing the page from feeling cramped despite its length.
- **Responsive grid collapse.** All 2-column grids correctly collapse to single-column on mobile.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 7.1 | Important | **Large vertical whitespace between the callout card and the ROI Calculator heading.** There is approximately 80-100px of empty space between the "Start with one task" callout and the ROI Calculator section heading. This is the `space-y-12` gap combined with the Separator, but it feels excessive and creates a sense of disconnection. Users might think the page has ended. |
| 7.2 | Nice-to-have | **Task template cards have uneven heights** in the 2-column grid. Because "Before" descriptions vary in length (e.g. 1 line vs 4 lines), paired cards in the same row can have significantly different heights. The grid handles this correctly (both cards stretch to the row height), but it leaves visible empty space in shorter cards. |
| 7.3 | Nice-to-have | **Feasibility builder navigation buttons are at the bottom of variable-height content.** When a step has many fields (e.g. Step 5 Risks), the Previous/Next buttons can be very far from the step indicator. On mobile, this means scrolling a long way to navigate. |

### Recommendations

- **7.1:** Reduce the gap between sections to `space-y-10` or use `space-y-8` specifically for the gap between the intro section and the calculator. Alternatively, remove the `<Separator />` between the intro and the calculator, since the H2 heading with its icon already provides sufficient visual separation.
- **7.2:** Consider using CSS `grid-auto-rows: 1fr` or a masonry-like layout for task templates, though this is a minor polish issue.
- **7.3:** Consider adding a sticky bottom navigation bar for the feasibility builder on mobile, or duplicating the step indicator at the bottom of each step.

---

## 8. Responsive Design

### What works well

- **Mobile layout is intentional, not an afterthought.** The mobile view uses a breadcrumb-style top bar ("Sections > 1.8 Measuring AI ROI"), stacks all grids to single-column, and the feasibility step indicator smartly switches to a text + progress bar format.
- **Category filter tabs wrap correctly on mobile.** The `flex-wrap h-auto gap-1` on the TabsList allows the 6 filter buttons to wrap onto two lines rather than overflowing.
- **Task template before/after panels** stack vertically on mobile (`sm:grid-cols-2` becomes single column), maintaining readability.
- **Calculator sliders work at all widths.** The range inputs span full width and the label/value pairs are readable.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 8.1 | Important | **Tab filter text overlaps on mobile at 375px.** The category filter tabs ("Time Savings", "Error Reduction", "Getting More Done", "Team Capacity", "Research & Analysis", "All") wrap onto multiple rows but the text on the wrapped rows can overlap with badges on the cards below. The "Research & Analysis" tab in particular sits very close to the first card's category badge, creating visual confusion. |
| 8.2 | Important | **Calculator output cards stack as 4 single-column blocks on mobile**, each taking up significant vertical space. With the uppercase label, large number, and optional helper text, each card is ~80px tall. Four cards = ~320px of output that the user must scroll past. Consider a 2x2 grid on mobile using a tighter layout. |
| 8.3 | Nice-to-have | **Feasibility builder checkboxes ("Required tools") wrap awkwardly on narrow screens.** At 375px, the checkbox row wraps with "Claude Desktop" and "Claude Pro" on one line and "Custom MCP/integration" alone on the next, which looks slightly unbalanced. |
| 8.4 | Nice-to-have | **Feedback widget FAB overlaps content on mobile.** The floating action button for "Send feedback" (blue circle, bottom-right) overlaps the task template cards and feasibility builder content on mobile. This is a global issue, not specific to this page. |

### Recommendations

- **8.1:** Add `gap-2` to the TabsList wrapper or add `mb-2` to ensure clear spacing between the filter tabs and the first template card row. File: `/app/src/content/general/RoiMeasurementSection.tsx`, around line 565.
- **8.2:** Keep the 2x2 grid on mobile for calculator outputs by using `grid-cols-2` without the `sm:` prefix, but reduce the padding and font size of the output cards on small screens (e.g. `p-3 text-xl` on mobile vs `p-4 text-2xl` on desktop).
- **8.3:** Use `grid grid-cols-2 sm:flex` for the checkbox layout to create a 2-column arrangement on mobile.
- **8.4:** (Global fix) Add `pb-16` to the page content area on mobile to prevent the FAB from overlapping the last visible content.

---

## 9. Accessibility

### What works well

- **Semantic ARIA landmarks.** Each section uses `aria-labelledby` pointing to its heading ID. The calculator output uses `aria-live="polite" aria-atomic="true"` for live updates. The step indicator has `role="list"` with proper `role="listitem"` and `aria-current="step"`.
- **Form labels are correct.** Every input has a matching `<label>` with `htmlFor`/`id` pair. The feasibility builder uses the `<Label>` shadcn component consistently.
- **Focus management in the wizard.** `stepHeadingRef` and `tabIndex={-1}` ensure the step heading receives focus on step transitions, aiding screen reader navigation.
- **Keyboard navigation of step buttons.** Step buttons in the wizard are proper `<button>` elements with descriptive `aria-label` attributes including state (completed/current).
- **Icons use `aria-hidden="true"`.** Decorative Lucide icons throughout the page are correctly hidden from screen readers.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 9.1 | Important | **Range slider inputs lack accessible value description.** The "Hours saved per week" and "Team members" range inputs use native `<input type="range">` with no `aria-valuetext`. Screen readers will announce the raw numeric value but not the unit context (e.g. "5 hours" vs just "5"). |
| 9.2 | Nice-to-have | **Collapsible triggers for task template "Related section" lack ARIA expanded state.** The Radix `Collapsible` component likely handles this internally, but the trigger button text "Related section" does not indicate whether the content is expanded or collapsed. |
| 9.3 | Nice-to-have | **Before/After panels lack semantic distinction.** The red/green "Before"/"After" labels inside task template cards are visually clear but rely on colour + position. Adding `aria-label="Before scenario"` and `aria-label="After scenario"` to the container divs would help screen reader users. |
| 9.4 | Nice-to-have | **Calculator "Copy for your business case" button aria.** The CopyButton component likely has its own aria-label, but the surrounding text "Copy for your business case" is not programmatically associated with the button. |

### Recommendations

- **9.1:** Add `aria-valuetext` to range inputs. For example: `aria-valuetext={`${hoursSaved} hours per week`}`. File: `/app/src/content/general/RoiMeasurementSection.tsx`, around lines 142 and 211.
- **9.2:** Verify that Radix Collapsible sets `aria-expanded` on the trigger button (it should by default). If not, add it manually.
- **9.3:** Add `role="group"` and `aria-label` to the before/after comparison container divs.
- **9.4:** Consider wrapping the copy button and its label text in a group, or adding `aria-label="Copy ROI calculation results for your business case"` to the button.

---

## 10. AI Slop Test

### Assessment: Passes with minor notes

- **No generic "AI will transform your business" language.** The copy is consistently specific and practical.
- **No gradient text, no emoji headers, no stock photo vibes.** The visual design is clean and professional.
- **No identical card grids.** While the 14 task template cards follow a consistent structure, each has unique content, different category badges, different before/after numbers, and different ROI highlights. They do not feel copy-pasted.
- **No "magic wand" promises.** The page explicitly mentions "learning curve" costs, risks, and the feasibility builder includes a risk assessment step. This is honest and builds credibility.
- **The 3,689% ROI default could trigger "too good to be true" suspicion** but the numbers are mathematically sound and the page provides context.

### Minor notes

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 10.1 | Nice-to-have | **Section headings follow a slightly formulaic pattern.** "Measuring What AI Actually Saves You", "ROI Calculator", "Task ROI Templates", "Measurement Frameworks", "Common Measurement Mistakes", "Getting Started: Five Steps to Measuring ROI" -- these are all competent but lean toward a "listicle" feel. The section count (8 sections on one page) contributes to this. |
| 10.2 | Nice-to-have | **14 task templates in one grid is a lot of content.** When "All" is selected, the grid shows 14 cards. This density, while filterable, could feel overwhelming. The filters mitigate this, but the default state shows everything. |

### Recommendations

- **10.1:** Consider whether some sections could be merged (e.g. "Measurement Frameworks" and "Common Mistakes" could be a single section with two tabs).
- **10.2:** Consider defaulting the category filter to a specific category (e.g. "Time Savings") rather than "All", so the initial view is less overwhelming. Alternatively, show a "Show all" link below the first 4-6 cards.

---

## Key Questions Answered

### Are interactive tools visually distinct from prose content?

**Mostly yes.** The task templates and feasibility builder are strongly differentiated with borders, cards, and coloured elements. The ROI calculator is the weakest -- its inputs/outputs blend into the page background without a containing border. Adding a container to the calculator would bring it in line with the other tools.

### Does the feasibility builder step navigation work at all viewport widths?

**Yes, and well.** The desktop step indicator uses icon + number buttons with connector lines. The mobile version uses a text label ("Step 3 of 7: AI Workflow") plus a progress bar. Both are clear and functional. The main improvement opportunity is adding step titles to the desktop indicator, since there is room.

### Does the design feel professional and trustworthy for a B2B SMB audience?

**Yes.** The page avoids hype, uses UK-specific formatting, provides concrete numbers, includes risk assessment tools, and the feasibility builder produces a downloadable business document. The "1 days" grammar bug and the extreme default ROI percentage are the only credibility concerns, and both are easily fixed.

### Does mobile feel intentional or like a responsive afterthought?

**Intentional.** The mobile breadcrumb navigation, the mobile-specific feasibility step indicator, the single-column grid collapse, and the tab wrapping all show deliberate responsive design. The calculator output stacking and tab overlap are the main areas for improvement, but these are refinements rather than fundamental issues.

---

## Summary of All Issues by Severity

### Critical (0)
None.

### Important (6)
| # | Issue | Section |
|---|-------|---------|
| 2.1 | ROI Calculator lacks a visual container | Interactive Tools |
| 3.1 | Step indicator shows only numbers, not titles | Feasibility Builder |
| 4.1 | "1 days" grammar bug | Emotional Resonance |
| 7.1 | Excessive whitespace between intro and calculator | Layout & Spacing |
| 8.1 | Tab filter text overlaps cards on mobile | Responsive Design |
| 8.2 | Calculator output cards take too much vertical space on mobile | Responsive Design |
| 9.1 | Range sliders lack aria-valuetext | Accessibility |

### Nice-to-have (17)
| # | Issue | Section |
|---|-------|---------|
| 1.1 | No page-level anchor navigation | Visual Hierarchy |
| 1.2 | Section spacing inconsistency | Visual Hierarchy |
| 1.3 | "Related Sections" heading breaks pattern | Visual Hierarchy |
| 2.2 | Copy button is subtle | Interactive Tools |
| 2.3 | Range slider uses browser-default styling | Interactive Tools |
| 3.2 | No validation or progress per step | Feasibility Builder |
| 3.3 | "Start a new study" only on step 7 | Feasibility Builder |
| 3.4 | Markdown preview uses raw pre block | Feasibility Builder |
| 4.2 | Default ROI may seem too optimistic | Emotional Resonance |
| 5.1 | Calculator output labels are small | Typography |
| 5.2 | Dense text in task template cards | Typography |
| 6.1 | Calculator output cards lack visual distinction in light mode | Colour & Theming |
| 6.2 | Getting Started numbered circles are subtle | Colour & Theming |
| 7.2 | Task template cards have uneven heights | Layout & Spacing |
| 7.3 | Feasibility nav buttons far from step indicator | Layout & Spacing |
| 8.3 | Checkbox wrapping on mobile | Responsive Design |
| 8.4 | Feedback FAB overlaps content on mobile | Responsive Design |

---

## Priority Fix List (Top 5 Quick Wins)

1. **Fix "1 days" grammar bug** -- 1-line change, immediate credibility improvement.
   - File: `/app/src/content/general/RoiMeasurementSection.tsx`, line 275
   - Change: `{paybackDays} days` to `{paybackDays} {paybackDays === 1 ? 'day' : 'days'}`

2. **Add a container to the ROI Calculator** -- 1 wrapper div, significant visual improvement.
   - File: `/app/src/content/general/RoiMeasurementSection.tsx`, line 128
   - Wrap the `<div className="space-y-6">` in a `<div className="rounded-xl border border-border bg-card/50 p-5 sm:p-6">`

3. **Add aria-valuetext to range sliders** -- 2 attribute additions, accessibility fix.
   - File: `/app/src/content/general/RoiMeasurementSection.tsx`, lines 142 and 211

4. **Fix tab filter spacing on mobile** -- 1 class addition, prevents visual overlap.
   - File: `/app/src/content/general/RoiMeasurementSection.tsx`, line 565
   - Add `mb-2` to the Tabs wrapper or increase gap

5. **Add step titles to desktop feasibility indicator** -- Improves usability of the wizard.
   - File: `/app/src/content/general/FeasibilityStudyBuilder.tsx`, around line 311

---

## Files Referenced

- `/app/src/content/general/RoiMeasurementSection.tsx` -- Main page component
- `/app/src/content/general/FeasibilityStudyBuilder.tsx` -- 7-step wizard component
- `/app/src/content/shared/roi-data.ts` -- Calculator defaults, task templates, frameworks data
- `/app/src/components/content/CalloutCard.tsx` -- Callout card component
- `/app/src/components/content/CopyButton.tsx` -- Copy-to-clipboard button
