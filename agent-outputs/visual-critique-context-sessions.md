# Visual Critique: How Context Works

**URL:** http://localhost:4100/general/context
**Date:** 2026-02-17

## Scores

| Category | Score | Notes |
|----------|-------|-------|
| Visual Quality | 8/10 | Strong typography hierarchy, good use of callout cards. Simulator is visually distinct with dashed border container. Legend segment labels are quite small (11px). |
| Layout & Responsiveness | 7/10 | Desktop and tablet work well. Mobile reflows the simulator bar to a vertical stack which is clever. However, the simulator's slider controls use native range inputs with limited styling. Mobile "Show handoff prompt" collapsible pattern is good. |
| Interaction Design | 8/10 | Simulator presets, sliders, "Add a conversation turn" button, and Reset all function correctly. Degradation overlay on the conversation segment is a nice detail. Copy button on the handoff prompt uses hover-reveal pattern which works on desktop but may be less discoverable on touch. |
| Content Quality | 9/10 | UK English used throughout (summarise, recognise, behaviour). Tone is practical and non-condescending. Parameterised via siteConfig. The "desk" metaphor in the intro is effective. Cross-references to Session Management are well-placed. |
| Accessibility | 7/10 | Simulator bar has proper aria-labels, aria-valuetext on sliders, and role="img" on the bar. Colour legend is provided. However, the native range inputs have minimal focus styles. The accordion uses correct aria-expanded. Heading hierarchy is correct (h1 > h2 > h3). |
| **Overall** | **7.8/10** | A strong page with an excellent centrepiece interactive tool. The simulator is the standout feature and is well-executed across viewports. Minor issues around focus visibility and small text sizes. |

## Issues Found

### Critical (must fix before templatisation)
- [ ] **No "on this page" / table of contents navigation** -- Unlike the Skills & Extensions section which has an "On this page" nav, this long page has no section jump links. Users must scroll through ~5 vertical screens to reach the handoff prompt. Relevant at all viewports.

### Important (should fix)
- [ ] **Simulator legend text is very small (11px / text-[11px])** -- The segment colour legend below the bar uses 11px text, which is below the commonly recommended 12px minimum for body text. On a 1440px desktop display this is quite hard to read. Seen at desktop and tablet.
- [ ] **Native range input slider styling is minimal** -- The slider thumb is a plain primary-coloured circle with no visible track fill. There is no focus ring visible beyond the browser default. The thumb could benefit from a slight shadow or outline to make it feel more intentional. Seen at all viewports.
- [ ] **Copy button on the session handoff prompt is hidden on desktop until hover** -- The `sm:opacity-0 sm:group-hover:opacity-100` pattern means the copy button is invisible until the user hovers over the prompt card. This is an important action that should be more discoverable, especially given the design principle that "copy-to-clipboard on every prompt/template" is a critical rule. Desktop viewport.
- [ ] **Simulator status bar labels are truncated** -- The horizontal bar labels like "Built-in..." and "Exte..." are truncated because the segments are narrow. At moderate preset, the labels "Built-in Tools" and "Extensions" are cut to 4-5 characters, reducing comprehension. The tooltip mitigates this but requires hover interaction. Desktop and tablet.
- [ ] **Mobile simulator vertical bar stack lacks percentage context** -- On mobile (375px), the vertical stack shows coloured bars with labels and percentages, but there is no total/remaining counter visible inline. The status bar above it shows "Full attention" and token counts, but the relationship between the stack and the status is not visually connected. Mobile viewport.

### Minor (nice to have)
- [ ] **Accordion "Why does this matter?" is default-open, creating a long initial scroll** -- The "Understanding Context" accordion has `defaultValue="why-matters"`, meaning one panel is pre-expanded on load. This adds significant vertical height to an already long page. Consider keeping all collapsed by default. Desktop and mobile.
- [ ] **No scroll-to-top or back-to-simulator link after the handoff prompt** -- After reading the handoff prompt at the bottom of the page, there is no easy way to return to the simulator or the top of the page. A "Back to top" affordance or a link back to the simulator would help navigation.
- [ ] **Preset button descriptions hidden on mobile** -- The preset buttons show `(New project, no extras)` etc. on desktop but hide the parenthetical descriptions on mobile (`sm:inline`). This means mobile users only see "Minimal", "Moderate", "Heavy" without context for what each preset means. A tooltip or brief subtitle could help.
- [ ] **Callout cards at the top stack vertically with minimal visual differentiation** -- There are 2-3 callout cards stacked (info + tip) at the top before the simulator. While they use different variant colours, the succession of callouts before any interactive content could feel like a wall of information. Consider reducing to the most essential callout.
- [ ] **Dark mode: Simulator bar segment colours remain the same hue** -- The bar segment colours (blue, yellow, green, pink, grey) work in light mode but some could benefit from slight lightness adjustments in dark mode for better visibility. The "Available" segment in particular is very subtle in dark mode (bg-muted/20 becomes nearly invisible).

## What Works Well
- The Context Window Simulator is genuinely excellent -- it is the best interactive element in the playbook. The dashed-border container (`border-2 border-dashed border-primary/20 bg-primary/5`) makes it visually distinct from surrounding prose, fulfilling the design principle about interactive tools.
- The three presets (Minimal, Moderate, Heavy) provide an instant "aha" moment -- users can see how different configurations affect available space without needing to understand individual settings.
- The mobile adaptation of the bar from horizontal to vertical stack is a smart responsive choice that preserves all information.
- The degradation overlay on the conversation segment (a gradient that darkens as context fills) is a subtle but effective visual metaphor.
- The "Session Feels Slow" section provides immediately actionable advice with clear numbered steps.
- The handoff prompt template is well-formatted with a clear "Prompt" badge and monospace code formatting.
- UK English is used consistently throughout (summarise, recognised, behaviour).
- Cross-references between this page and Session Management create a natural learning flow.
- The collapsible handoff prompt on mobile (`sm:hidden` / `CollapsibleContent`) prevents excessive scroll on smaller screens.

---

# Visual Critique: Session Management

**URL:** http://localhost:4100/general/sessions
**Date:** 2026-02-17

## Scores

| Category | Score | Notes |
|----------|-------|-------|
| Visual Quality | 8/10 | Clean section headings with icons (AlertTriangle, ArrowRightLeft, Scissors, Monitor, Brain, FileText) provide good wayfinding. The handoff workflow timeline with numbered circles and connecting line is well-designed. Background tinting on alternating sections creates rhythm. |
| Layout & Responsiveness | 8/10 | Platform Differences table correctly switches to stacked cards on mobile. The Copyable Handoff Templates tabs work well at all widths. Content is constrained to max-w-[65ch] for readable line lengths. The worked examples with collapsible breakdowns are efficient. |
| Interaction Design | 7/10 | Accordion sections are functional but there are many of them -- 6 Rules of Thumb + 4 Memory + potential developer extras. The tabs for handoff templates are a good UX pattern. However, no accordion is default-open, so the initial view is a wall of closed accordion items which may feel uninviting. |
| Content Quality | 9/10 | Excellent UK English throughout. Parameterised with siteConfig.companyShortName ("Phew!"). The "one task, one session" rule and "30-message guideline" are practical and memorable. The comparison of Memory vs Projects vs Skills is genuinely useful. |
| Accessibility | 8/10 | Proper heading hierarchy (h1 > h2 > h3). Section landmarks with aria-labelledby. The platform differences table has scope="col" on headers. Mobile card alternative for the table is a good a11y pattern. Accordion uses proper aria-expanded. The tab component from shadcn/ui provides keyboard navigation. |
| **Overall** | **8.0/10** | A well-structured information-dense page. The content quality is high and the layout handles the complexity well. The main weakness is the sheer volume of collapsed accordions on initial load. |

## Issues Found

### Critical (must fix before templatisation)
- (none found)

### Important (should fix)
- [ ] **Six collapsed accordion items in "Rules of Thumb" create a visual wall** -- On desktop at 1440px, the first thing users see below the intro paragraph is six closed accordion items stacked vertically. None are default-open. This makes the section look dense and uninviting. Consider opening the first item by default or showing a brief preview/summary outside the accordion. Desktop and tablet viewport.
- [ ] **Copy buttons on handoff template prompts are hidden until hover** -- Same issue as the Context page: the `sm:opacity-0 sm:group-hover:opacity-100` pattern makes copy buttons invisible on desktop until hover. For a section titled "Copyable Handoff Templates" where copying is the primary action, the copy button should be always visible. Desktop viewport.
- [ ] **The "Getting Claude to Write Its Own Handoff" section has a background tint (`bg-muted/20 p-6`) that may look like a card but is not bounded on all sides** -- On desktop this subtle background differentiation works, but on mobile at 375px the edge-to-edge tinted background competes with the callout cards inside it, creating a visual nesting depth of 3 levels (page > tinted section > callout card > content). This can feel claustrophobic. Mobile viewport.
- [ ] **Platform Differences section lacks a visible heading icon on mobile** -- The Monitor icon next to "Platform Differences" heading is small (h-5 w-5) and in text-primary colour. On mobile, the stacked card layout below it starts immediately, and the section could benefit from a separator or more visual weight to distinguish it from the section above. Mobile viewport.

### Minor (nice to have)
- [ ] **Handoff workflow timeline vertical line does not extend to the bottom of the last step** -- The timeline uses `w-0.5 grow bg-border` between numbered circles, but the last step has no line below it (which is correct), however the visual ending feels abrupt. A small dot or end cap would provide visual closure.
- [ ] **Tabs in Copyable Handoff Templates may overflow on narrow mobile** -- The TabsList has `w-full sm:w-auto` which stretches tabs to full width on mobile. With three tabs ("Session End", "Handoff", "Planning"), the text fits at 375px, but if a fourth category were added it would likely overflow. The current state is fine but should be monitored.
- [ ] **"See how context degradation works visually in the Context Simulator" cross-reference box** -- This reference link sits between the Rules of Thumb accordion and the next section separator. It uses the same `rounded-md border border-border bg-muted/30` style as other cross-references, but its position after a dense accordion section means it can be easily missed. It could be more prominent or moved closer to the callout at the top.
- [ ] **No "on this page" table of contents** -- Like the Context page, this long page would benefit from section jump links, especially given the 6+ distinct sections (When to Stop, Handoff Workflow, Subtasks, Platform Differences, Memory, Copyable Templates). Desktop viewport.
- [ ] **Memory section transition sentence is awkward** -- The intro paragraph for Claude's Memory Feature reads: "Your session context includes memory from previous conversations. Here's how to manage it: Claude can remember facts across conversations..." The colon followed by a new sentence feels like two paragraphs merged. This is a minor copy issue.
- [ ] **Dark mode: Tinted background sections (bg-muted/20) become very subtle** -- In dark mode, the `bg-muted/20` tinted sections ("Getting Claude to Write Its Own Handoff" and "Platform Differences") barely register against the dark background. The visual rhythm that works in light mode (white > tinted > white > tinted) is nearly invisible in dark mode. Dark mode desktop.

## What Works Well
- The handoff workflow timeline with numbered circles and a connecting vertical line is visually clean and easy to follow. The flexbox layout avoids absolute positioning issues.
- Icons next to section headings (AlertTriangle, ArrowRightLeft, Scissors, Monitor, Brain, FileText) provide excellent visual wayfinding and make the page scannable.
- The Platform Differences section switches from a table on desktop to stacked cards on mobile -- this is a proper responsive pattern, not just a scrollable table.
- The worked examples in "Breaking Tasks into Subtasks" are well-designed with the collapsible breakdown pattern. The first example being default-open and subsequent ones collapsed is a good progressive disclosure choice.
- The Copyable Handoff Templates section using tabs (Session End / Handoff / Planning) is an effective organisation pattern that prevents the page from becoming a scroll of prompts.
- The key callout at the top ("A fresh session with a good handoff beats a long degrading session every time.") sets the right expectation immediately.
- The Memory vs Projects vs Skills comparison grid (3 cards in a row on desktop, stacked on mobile) is genuinely useful and well-presented.
- UK English is consistent throughout (summarise, organisation, licence, colour).
- The `siteConfig.companyShortName` parameterisation in the memory tip ("Tell Claude your name, your role at Phew!...") is correctly implemented.
- The content flow is logical: when to stop > how to hand off > how to break work up > platform differences > memory > copyable templates.
- Separator elements between major sections create clear visual boundaries.
- The page correctly filters content by track (general vs developer), showing appropriate content for each audience.

---

# Cross-Page Observations

## Shared Issues

1. **Copy button hover-reveal pattern (both pages)** -- The `sm:opacity-0 sm:group-hover:opacity-100` pattern hides the most important action (copying) on desktop. This should be changed to always-visible, perhaps with a subtler style that becomes more prominent on hover. The critical rule states "copy-to-clipboard on every prompt/template" -- hiding the button contradicts this.

2. **No table of contents / "on this page" navigation (both pages)** -- Both pages are long (5+ screen heights). The Skills & Extensions section has an "On this page" component, but these two pages do not. Adding this would significantly improve navigation.

3. **Dark mode tinted backgrounds are too subtle (both pages)** -- Sections with `bg-muted/20` background tinting provide visual rhythm in light mode but are nearly invisible in dark mode. Consider using `bg-muted/30` or `bg-muted/40` for dark mode variants.

4. **Consistent heading pattern with icons (Session Management has them, Context does not)** -- Session Management uses Lucide icons next to every h2 heading, creating excellent visual wayfinding. The Context page does not use this pattern, making its sections feel less differentiated. Consider adding icons to Context page headings for consistency.

## Summary

Both pages deliver high-quality, well-structured content that serves the target audience of UK SMB employees learning Claude. The Context Window Simulator is the interactive highlight of the entire playbook and is genuinely well-built. The Session Management page is content-heavy but well-organised with appropriate use of accordions, tabs, and responsive tables.

The most impactful improvements would be:
1. Making copy buttons always visible (both pages)
2. Adding "on this page" navigation (both pages)
3. Opening one accordion by default in the Session Management Rules of Thumb section
4. Improving dark mode visibility of section backgrounds

Neither page has critical blocking issues for templatisation. The parameterisation is correctly implemented, UK English is consistent, and the content is practical and well-written.
