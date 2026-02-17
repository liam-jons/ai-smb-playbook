# Visual Critique: ROI Measurement & Feasibility Builder

**URL:** http://localhost:4100/general/roi-measurement
**Date:** 2026-02-17
**Review method:** Screenshots from previous automated session (desktop 1440px, tablet 768px, mobile 375px, dark mode) plus source code review. The original automated agent (Agent 3) captured screenshots but was unable to complete its report due to MCP browser tool permission issues. This report is compiled from those screenshots and direct source inspection.

## Scores

| Category | Score | Notes |
|----------|-------|-------|
| Visual Quality | 8/10 | Strong typography hierarchy, good spacing, clean visual separation between sections. Calculator and templates feel distinct from prose. Minor issues with template card density at smaller viewports. |
| Layout & Responsiveness | 7/10 | Desktop is excellent. Tablet mirrors desktop well. Mobile has a few issues: category filter pills wrap awkwardly, and template cards lose the side-by-side Before/After layout advantage. |
| Interaction Design | 7/10 | Calculator is intuitive with live updating results. Feasibility builder has clear step progression. The "1 days" pluralisation bug is visible in screenshots with default values. Category filter tabs lack an active-state indicator that is strong enough on mobile. |
| Content Quality | 9/10 | UK English throughout, currency in GBP, practical tone, well-parameterised via `siteConfig`. Phew Design examples are contextually appropriate. Excellent before/after task comparisons. |
| Accessibility | 7/10 | Semantic heading hierarchy is correct (h2 for section titles, proper nesting). Form labels present on calculator inputs. Category filters use text not just colour. Accordion items are keyboard-accessible. However, the result cards in the calculator lack ARIA live regions for dynamic value updates. |
| **Overall** | **7.5/10** | A strong, content-rich page with two genuinely useful interactive tools. The page structure is well-designed and the content quality is high. The main issues are mobile layout refinements and a grammar bug in the calculator output. |

## Issues Found

### Critical (must fix before templatisation)

- [ ] **"1 days" pluralisation bug in calculator** -- The Monthly Breakeven display shows "1 days" with default values (visible in desktop, tablet, and mobile screenshots). The code at line 280 of `RoiMeasurementSection.tsx` has correct logic (`paybackDays === 1 ? 'day' : 'days'`), but `Math.round((20/758)*30)` may produce a value that is visually 1 but not strictly `=== 1` due to floating point, or the screenshots captured a stale render. Either way, this is visible to users with default settings and needs verification and a fix (e.g. display `Math.round(paybackDays)` and compare the rounded value). -- Desktop, tablet, mobile
- [ ] **No ARIA live region on calculator results** -- When the user adjusts sliders or inputs, the four result cards (Monthly Net Savings, Annual Net Savings, ROI %, Monthly Breakeven) update silently. Screen reader users get no announcement that values have changed. Wrap the results area in an `aria-live="polite"` region. -- All viewports

### Important (should fix)

- [ ] **Mobile category filter pills wrap poorly at 375px** -- The six filter pills (Time Savings, Error Reduction, Getting More Done, Team Capacity, Research & Analysis, All) wrap across three lines on mobile with some pills overlapping the first template card's badge. The "Research & Analysis" pill text is partially truncated or collides with the row below. Consider horizontal scrolling with fade affordance, or a dropdown/select on mobile. -- Mobile (375px)
- [ ] **Template cards lose comparative value on mobile** -- The Before/After columns within each template card stack vertically on mobile, which means the user cannot visually compare them side by side. The Before and After blocks become individual stacked sections, losing the at-a-glance comparison that makes these cards effective. Consider keeping a two-column layout within each card even on mobile (the cards are narrow enough that two short columns would still fit). -- Mobile (375px)
- [ ] **Feasibility Builder step indicator not visible in mobile screenshot** -- The step progress bar ("Step 3 of 7: AI Workflow" with a blue progress bar) is present but the step labels/numbers are not shown. On this long page, users in the Feasibility Builder section on mobile may lose context about where they are in the 7-step wizard. Consider a sticky step indicator or more prominent step labelling. -- Mobile (375px)
- [ ] **Large vertical whitespace between Calculator and Task Templates sections** -- Both desktop and tablet screenshots show substantial empty space (approximately 80-100px) between the "Copy for your business case" button and the "Task ROI Templates" heading. This gap is larger than the spacing between other sections on the page and creates a visual break that could make users think the page has ended. -- Desktop (1440px), tablet (768px)
- [ ] **Copy button for business case is low-contrast and easy to miss** -- The "Copy for your business case" button appears as a small ghost/icon-only button with muted text. It is the primary export action for the calculator and should be more visually prominent, perhaps as a secondary button with a border or subtle background. -- All viewports

### Minor (nice to have)

- [ ] **Calculator result cards could benefit from visual grouping** -- The four result cards (Monthly Net Savings, Annual Net Savings, ROI %, Monthly Breakeven) are laid out in a 2x2 grid on desktop, which works well. However, they all have the same visual weight. Consider making the "Annual Net Savings" card slightly more prominent (larger font or a subtle highlight border) since it is the number most users will cite in business cases. -- Desktop, tablet
- [ ] **Dark mode: Feasibility Builder form fields have low border contrast** -- In the dark mode screenshots, the textarea borders in the Feasibility Builder (e.g. "Proposed AI-assisted workflow", "Setup investment") are very subtle against the dark background. The fields are visible but the border contrast could be improved for better scanability. -- Dark mode (1440px)
- [ ] **Dark mode: callout card (tip) border could be slightly more visible** -- The "Start with one task" callout card in dark mode has a green-tinted left border and background, which works, but the overall card outline is barely distinguishable from the page background. A slightly stronger border would help. -- Dark mode (1440px)
- [ ] **Template cards "Related section" disclosure lacks hover/focus indication** -- The "Related section" collapsible link on each template card (with the chevron) does not appear to have a visible hover state in the screenshots. Adding a subtle hover colour or underline would improve discoverability. -- Desktop, tablet
- [ ] **Feasibility Builder "Saved draft found" callout appears on mobile with stale data** -- The mobile screenshot shows a "Saved draft found" notification with "just now" and a period on its own line (suggesting an empty or malformed date). This may be a localStorage draft from a previous session. Ensure the date formatting handles edge cases gracefully. -- Mobile (375px)
- [ ] **Slider track styling on mobile** -- The "Hours saved per week" and "Team members" sliders have thin track lines on mobile that may be difficult to drag with touch. Consider increasing the track height and thumb size for touch targets >= 44px. -- Mobile (375px)

## What Works Well

- **ROI Calculator is immediately useful.** The default values (5 hours/week at GBP 35/hr with GBP 20/month tool cost) produce a compelling result (GBP 8,853 annual savings, 3,689% ROI) that makes the business case tangible before the user changes anything. This is excellent onboarding design.
- **Task ROI Templates are the page's standout feature.** The Before/After comparison cards with category filtering (Time Savings, Error Reduction, Getting More Done, Team Capacity, Research & Analysis) are genuinely useful. Each card includes concrete time estimates, cost estimates, process descriptions, and a summary ROI highlight. The copy button on each card is practical.
- **Category filter pills work well on desktop and tablet.** The horizontal pill layout with active state indication lets users quickly narrow to relevant templates. The "All" default shows everything.
- **Client-specific examples are well-parameterised.** The Phew Design Limited examples (bid writing, ISO documentation, Mailtrap replacement) are pulled from `siteConfig` and `roi-data.ts`, making them easy to swap for other clients. The `clientExample` field on task templates is optional and only renders when present.
- **Measurement Frameworks section uses accordions effectively.** The three frameworks (Value Threshold, Cost Cap, Quick Wins vs Strategic) are collapsed by default, keeping the page scannable whilst making detail available. Same pattern for Common Measurement Mistakes.
- **Getting Started checklist is actionable.** The numbered 5-step checklist with clear, practical instructions gives users a concrete next action. The "Copy checklist" button lets them take it away.
- **Dark mode is well-executed overall.** Text contrast is good, the calculator results are clearly readable with green accent colour, and the template cards have appropriate dark backgrounds with readable text.
- **Page structure flows logically.** Introduction with three tool anchors, then Calculator, Templates, Feasibility Builder, Measurement Frameworks, Common Mistakes, Getting Started steps, Related Sections. The progression from "calculate your value" to "compare common tasks" to "build a feasibility study" to "learn measurement theory" is well-thought-out.
- **UK English is consistent throughout.** Spellings (licence, personalise, summarise), currency (GBP), and cultural references (National Insurance, fortnightly) are all correctly British.
- **Feasibility Builder wizard is comprehensive.** 7 steps with Previous/Next navigation, pre-population from task templates, draft saving to localStorage, copy and download export options. This is a genuinely useful tool that produces a structured feasibility study document.
