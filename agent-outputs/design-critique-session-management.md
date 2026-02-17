# Design Critique: Session Management Page (`/general/sessions`)

**Date:** 2026-02-17
**Viewport widths tested:** 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide desktop)
**Modes tested:** Light mode, dark mode (1024px)
**Source file:** `app/src/content/general/SessionManagementSection.tsx`
**Supporting data file:** `app/src/content/shared/session-management-data.ts`

---

## Executive Summary

The Session Management page is a text-heavy educational page with accordions, a numbered workflow, a comparison table, and five copyable prompt templates. The content quality is excellent — practical, well-structured, and well-paced for the target audience. The page is the strongest example of "content-first" design in the playbook: clean heading hierarchy, good use of progressive disclosure via accordions and collapsibles, and a smart mobile-adapted table pattern. However, the page is visually monotonous — it reads as well-formatted documentation rather than a designed experience. The copyable prompt templates at the bottom are the page's key interactive elements but they receive no visual differentiation from surrounding prose, violating the design principle that "interactive tools feel distinct."

**Overall Assessment Score: 7.0 / 10**

---

## 1. Visual Hierarchy and Information Architecture

### What works well

- **Clear six-part structure.** The page is logically divided: (1) When to Stop, (2) The Handoff Workflow, (3) Breaking Tasks into Subtasks, (4) Platform Differences, (5) Claude's Memory Feature, (6) Copyable Templates. Each section has an H2 heading with consistent styling (`text-xl sm:text-2xl font-semibold tracking-tight`).
- **Progressive disclosure is well-used.** Rules of Thumb use accordions (6 items, collapsed by default). Worked examples use collapsibles. Memory feature uses accordions (4 items). This prevents the page from feeling overwhelming despite significant content depth.
- **The "important" callout at the top is effective.** "A fresh session with a good handoff beats a long degrading session every time" immediately communicates the key takeaway. This is the right pattern — lead with the conclusion, then explain.
- **Cross-references are contextually placed.** The link to the Context Simulator appears in a styled box (`rounded-md border border-border bg-muted/30`) directly after the rules of thumb, where users might naturally want to see the concept visualised.
- **Section pagination (Previous/Next) at the bottom** provides clear navigation flow through the track.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 1.1 | Important | **No visual rhythm variation between sections.** All six sections use the same pattern: H2 → paragraph → content block. The spacing between sections (`space-y-12`) is uniform. There is no visual break, divider, or contrast change to help users orient within this long page. |
| 1.2 | Nice-to-have | **The page lacks an "on this page" anchor navigation.** At 1440px, the full-page screenshot shows approximately 5-6 viewport heights of content. Users scrolling to find the copyable templates (arguably the most actionable part) must scroll through the entire page. |
| 1.3 | Nice-to-have | **The "Copyable Handoff Templates" section title does not use the same H2 pattern.** It matches visually but the section starts after a large `space-y-12` gap that feels disconnected from the preceding content. |

### Recommendations

- **1.1:** Add `<Separator />` components between major sections (as the ROI page and Starter Kit page do). This creates visual "chapters" that help users scan the page structure.
- **1.2:** Consider a sticky mini-nav or "Jump to" links at the top of the page, especially given that the copyable templates are the primary actionable content.
- **1.3:** Minor — ensure consistent visual weight for all section transitions.

---

## 2. Interactive Elements vs Prose

### What works well

- **Copyable prompt templates use the PromptExample component** which provides a clear visual container (border, background, title, description, "When to use" text, and a copy button). These are the page's interactive tools and they are functionally well-implemented.
- **The handoff workflow numbered steps** use a vertical timeline pattern (`border-l-2 border-border pl-6`) with numbered circle markers. This is a clear, established pattern that communicates sequence.
- **The collapsible worked example** ("Show example: Writing a safeguarding policy review") uses `Button variant="outline"` as a trigger, which correctly signals interactivity.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 2.1 | Important | **Copyable templates do not feel visually distinct from prose.** The PromptExample components have a border and subtle background, but they sit inline within the `space-y-12` flow alongside paragraphs and callouts. At 1440px desktop, they blend into the page rather than standing out as "tools you should use." The design principle states "interactive tools feel distinct" — calculators, simulators, and wizards must be visually differentiated from surrounding prose. |
| 2.2 | Nice-to-have | **Five templates are a lot to display at once.** All five PromptExample cards are stacked vertically with `space-y-4` gaps. Users must scroll through all of them to find the one they need. There is no filtering, tabbing, or visual summary to help users pick the right template. |
| 2.3 | Nice-to-have | **The copy button inside PromptExample is a small icon button.** For the primary action on these templates (copying the prompt), the button is quite subtle — a small clipboard icon without a text label. |

### Recommendations

- **2.1:** Wrap the entire "Copyable Handoff Templates" section in a visually distinct container — perhaps a `rounded-xl border-2 border-primary/20 bg-primary/5 p-6 sm:p-8` wrapper — to create a "tools zone" that visually separates it from the educational content above. This is similar to how the Feasibility Study Builder on the ROI page uses a bordered container.
- **2.2:** Consider using a tabbed interface or accordion for the five templates, showing only one at a time with clear labels. This reduces scrolling and helps users find the right template faster.
- **2.3:** The CopyButton component likely handles this well enough, but consider adding a text label ("Copy prompt") for the template-specific copy buttons to increase discoverability.

---

## 3. Content Quality and Tone

### What works well

- **The tone is excellent throughout.** "Stopping a session is not failure" is reassuring. "Think of this as saving your progress — like saving a game" is a perfect metaphor for the general audience. The entire page avoids condescension while being genuinely helpful.
- **The "Terminology" callout** clarifying "handoff prompt" vs "continuation prompt" is well-placed and prevents confusion.
- **UK English is consistent.** "Summarise", "recognise", "organise" — all correct throughout.
- **Track-conditional content is well-implemented.** Developer-specific sections (Token-Aware Session Management, Handoff Scenario Types, Developer Session Practices) appear conditionally via `isDev`. The general track version is focused and not cluttered by developer concepts.
- **The comparison table (Platform Differences)** efficiently presents claude.ai vs Claude Code differences. The mobile adaptation (stacked cards instead of table) is a smart responsive pattern.
- **The Memory Feature section** is a valuable addition — it teaches users about a feature they may not know exists, with practical advice ("Tell Claude your name, your role at Phew!, and that all content should use UK English").

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 3.1 | Nice-to-have | **The worked example for subtask decomposition is hidden behind a collapsible.** "Show example: Writing a safeguarding policy review" is the only concrete example of task decomposition on the general track. Being collapsed by default means some users will never see it. The content is strong — it would benefit from more visibility. |
| 3.2 | Nice-to-have | **The Memory section feels slightly disconnected from session management.** While it is related (both are about managing Claude across conversations), it introduces a new concept mid-page. A brief transitional sentence connecting it to the session handoff workflow would improve flow. |

---

## 4. Emotional Resonance

### Assessment: Professional and reassuring, but slightly clinical.

The page succeeds at removing anxiety about session management. The "saving a game" metaphor, the "not failure" framing, and the practical templates all contribute to a confident, empowering tone. However, the visual presentation is uniformly grey/white with minimal colour or personality. The page reads as a well-written manual rather than a crafted experience.

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 4.1 | Nice-to-have | **No visual warmth or personality.** The page is entirely text + accordions + one table. There are no illustrations, icons in section headers, colour accents, or visual elements that create emotional engagement. Compare to the ROI page, which uses colour-coded badges, green/red comparison panels, and numbered step circles. |

### Recommendation

- **4.1:** Add icons to section H2 headings (as the ROI page does) to create visual anchors and break the text monotony. For example: a stop sign icon for "When to Stop", a handshake icon for "Handoff Workflow", puzzle pieces for "Breaking Tasks", etc.

---

## 5. Typography

### What works well

- **Heading hierarchy is clean.** H1 ("Session Management") → H2 (section headings) → H3 (accordion triggers, subsection headings). The hierarchy is semantic and visually correct.
- **`max-w-[65ch]` is used on paragraph text.** This constrains reading width to a comfortable measure.
- **Accordion trigger text uses `text-sm font-medium`** which is visually distinct from body text but not overpowering.
- **Code snippets** use consistent `rounded bg-muted px-1 py-0.5 text-xs font-mono` styling for inline code references.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 5.1 | Nice-to-have | **The PromptExample prompt text is quite dense.** The copyable prompts contain numbered lists with bold labels, all rendered at body text size inside a container. At 375px mobile, these create long scrollable blocks of text that are difficult to scan. |
| 5.2 | Nice-to-have | **The accordion trigger text for "Rules of Thumb" items is slightly too similar in weight to the H3 heading above it.** "Rules of Thumb" is `text-lg font-medium` and the accordion triggers are `text-sm font-medium`. The size difference is adequate but the shared `font-medium` weight creates a subtle hierarchy flattening. |

---

## 6. Colour and Theming

### What works well

- **The "important" callout at the top uses a warm orange-red border** that immediately draws attention. This is the correct use of the callout system.
- **The "info" and "tip" callouts** use blue and green respectively, following established colour semantics.
- **Dark mode is well-implemented.** The 1024px dark mode screenshot shows: text is legible, callout cards maintain their colour coding, the table borders are visible, the cross-reference box (`bg-muted/30`) has adequate contrast, and accordion triggers are clearly interactive. The sidebar active state (`1.3 Session Management`) is highlighted correctly.
- **The cross-reference link box** uses `border-border bg-muted/30` which creates a subtle but visible container in both light and dark modes.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 6.1 | Nice-to-have | **The page is almost entirely monochromatic.** Outside of the callout cards (which use semantic colours), the page is grey text on white background with grey borders. There are no accent colours, no coloured badges, no tinted backgrounds. This contributes to the "documentation" feel. |

---

## 7. Layout and Spacing

### What works well

- **`space-y-12` (48px) between sections** provides clear visual separation.
- **The numbered workflow steps** use a vertical timeline layout (`border-l-2 pl-6`) with properly aligned numbered circles. The circles use `absolute` positioning relative to the timeline, which is correctly implemented.
- **The platform comparison table** on desktop uses proper `<table>` semantics with `<th scope="col">` headers. On mobile, it switches to stacked card layout — this is a best-practice responsive table pattern.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 7.1 | Important | **Content area feels narrow at 1440px.** The `max-w-[75ch]` constraint on the TrackLayout content area means the page content occupies roughly 50-55% of the available viewport width at 1440px. The platform comparison table and the copyable templates could benefit from more horizontal space. |
| 7.2 | Nice-to-have | **The handoff workflow timeline circles use a complex absolute positioning calculation** (`absolute -left-[calc(1.5rem+5px)]`) which creates fragile alignment. At different zoom levels or with accessibility font scaling, the circles may misalign relative to the timeline. |
| 7.3 | Nice-to-have | **The five PromptExample cards at the bottom create a very long scrollable region.** With `space-y-4` between them and each containing a multi-line prompt, the templates section is approximately 2-3 viewport heights tall at 1440px. This is a lot of vertical space for content that most users will interact with selectively. |

### Recommendations

- **7.1:** This is a cross-page issue (TrackLayout constraint). Consider allowing the templates section to break out of the `75ch` constraint.
- **7.3:** Use tabs or an accordion to reduce the vertical footprint of the templates section.

---

## 8. Motion and Animation

### What works well

- **Accordion open/close animations** are handled by shadcn/ui (Radix Accordion), which provides smooth height transitions.
- **Collapsible animations** are handled by Radix Collapsible with smooth transitions.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 8.1 | Nice-to-have | **No page entrance animation.** The page loads instantly with no entrance choreography. Given the content-heavy nature, even a subtle fade-in on the hero callout and first section would add polish. |
| 8.2 | Nice-to-have | **No hover states on the cross-reference link box.** The "See how context degradation works visually" link box has no hover feedback beyond the link text colour change. A subtle border or background shift on hover would improve interactivity signals. |

---

## 9. Responsive Design

### What works well

- **Mobile layout (375px) is well-adapted.** The sidebar is replaced with a breadcrumb trigger. Content fills the full width with appropriate padding. Accordions work correctly on touch.
- **The platform comparison table switches to stacked cards on mobile** (`space-y-4 sm:hidden` for cards, `hidden sm:block` for table). This is the correct pattern — tables are notoriously difficult on mobile, and stacked cards solve the problem elegantly.
- **The "Memory" section's comparison grid** (`sm:grid-cols-3`) collapses to single-column on mobile, maintaining readability.
- **PromptExample components** render well on mobile with appropriate padding and readable text.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 9.1 | Nice-to-have | **The handoff workflow timeline is slightly cramped on 375px mobile.** The `pl-6` (24px) padding for the timeline content creates a narrow reading area on mobile. The numbered circles at `-left-[calc(1.5rem+5px)]` are positioned correctly but feel tight against the left edge. |
| 9.2 | Nice-to-have | **The prompt templates are very tall on mobile.** Each PromptExample contains a multi-line numbered list of instructions. At 375px, the "Hand Off to a Colleague" prompt alone spans approximately 3 viewport heights. Users must scroll extensively to see all templates. |

---

## 10. Accessibility

### What works well

- **Semantic HTML throughout.** Each major section uses `<section aria-labelledby="...">` pointing to its heading ID. The table uses proper `<th scope="col">` headers.
- **Accordion triggers are proper `<button>` elements** with Radix's built-in `aria-expanded` state management.
- **The collapsible trigger button** includes `aria-expanded` and `aria-controls` attributes pointing to the content ID.
- **Skip link is present** as the first focusable element.
- **Focus-visible styling** is defined globally (2px ring outline).
- **The callout cards use `role="alert"`** which is semantically appropriate for the "important" variant but may be overly assertive for "info" and "tip" variants.

### Issues

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 10.1 | Important | **Callout cards use `role="alert"` for all variants.** The "important" callout at the top correctly warrants `role="alert"`, but the "info" and "tip" callouts (terminology note, game-saving metaphor, memory starting point) do not. `role="alert"` causes screen readers to announce the content immediately and assertively, which is disruptive when there are multiple such alerts on a page. |
| 10.2 | Nice-to-have | **The handoff workflow `<ol>` does not use semantic `<li>` elements with proper list styling.** It uses `<ol>` but the visual presentation relies on absolute-positioned span elements for the numbers rather than the browser's native list counter. This means screen readers will announce "list item 1" but the visual "1" is a separate element, creating potential confusion. |
| 10.3 | Nice-to-have | **The copy buttons inside PromptExample lack context-specific `aria-label`.** The generic "Copy to clipboard" label does not distinguish between the five different prompts on this page. A screen reader user navigating by buttons would hear "Copy to clipboard" five times with no way to distinguish them. |

### Recommendations

- **10.1:** Use `role="alert"` only for the "important" variant. Use `role="note"` or `role="status"` for "info" and "tip" variants. File: `app/src/components/content/CalloutCard.tsx`.
- **10.2:** Consider using CSS counters or `::marker` pseudo-elements for the numbered steps, preserving native list semantics.
- **10.3:** Add unique `aria-label` values: "Copy Session Handoff prompt", "Copy Emergency Session Save prompt", etc.

---

## 11. AI Slop Test

### Assessment: Passes clearly.

- **No generic patterns.** The content is specific to Claude, specific to the target audience, and grounded in real workflows.
- **No identical card grids.** While the five PromptExample cards follow a consistent structure, each has unique content, a unique title, and different "When to use" guidance.
- **No purple gradients, no glassmorphism, no emoji headers.** The design is clean and restrained.
- **The "saving a game" metaphor** is a genuine authored touch — it does not read as AI-generated boilerplate.
- **Track-conditional content** shows deliberate audience consideration, not one-size-fits-all.

### Minor note

| # | Severity | Issue | Detail |
|---|----------|-------|--------|
| 11.1 | Nice-to-have | **The page structure follows a predictable H2 → paragraph → component pattern.** While not "AI slop" per se, the uniform structure across all six sections creates a slightly formulaic feel. Varying the section entry patterns (some with a callout first, some with an image, some with a pull quote) would add visual interest. |

---

## Key Questions Answered

### Does the design feel professional and trustworthy for a B2B SMB audience?
**Yes.** The tone, content quality, and information architecture are excellent. The page builds confidence through practical advice, concrete examples, and copyable templates. The visual design is clean but not distinctive — it reads as good documentation rather than a crafted product experience.

### Are interactive tools visually distinct from prose content?
**Partially.** The PromptExample components have borders and backgrounds, but they sit inline within the content flow and do not feel like "tools" in the same way the ROI Calculator or Context Simulator do. The templates section would benefit from stronger visual differentiation.

### Does the mobile experience feel intentional or like a responsive afterthought?
**Intentional.** The mobile-adapted table pattern (stacked cards), the appropriate text sizing, and the touch-friendly accordion triggers all show deliberate mobile design. The main mobile issue is content density — the five prompt templates create extensive scrolling.

### Is the two-track experience consistent in quality?
**Yes.** The general track version is focused and well-paced. The developer track (reviewed via source code) adds Token-Aware Session Management, Handoff Scenario Types, Information Architecture, and Developer Session Practices sections — all gated behind `isDev` checks. These additions are substantial and relevant without cluttering the general experience.

---

## Summary of Issues by Severity

### Critical (0)
None.

### Important (4)
| # | Issue | Section |
|---|-------|---------|
| 1.1 | No visual rhythm variation between sections | Visual Hierarchy |
| 2.1 | Copyable templates don't feel visually distinct from prose | Interactive Tools |
| 7.1 | Content area narrow at 1440px (cross-page issue) | Layout |
| 10.1 | All callout cards use `role="alert"` regardless of severity | Accessibility |

### Nice-to-have (13)
| # | Issue | Section |
|---|-------|---------|
| 1.2 | No "on this page" anchor navigation | Visual Hierarchy |
| 1.3 | Section transitions lack visual breaks | Visual Hierarchy |
| 2.2 | Five templates displayed at once — no filtering/tabbing | Interactive Tools |
| 2.3 | Copy button is subtle icon-only | Interactive Tools |
| 3.1 | Worked example hidden behind collapsible | Content Quality |
| 3.2 | Memory section feels slightly disconnected | Content Quality |
| 4.1 | No visual warmth — no icons in headings, no colour accents | Emotional Resonance |
| 5.1 | Dense prompt text on mobile | Typography |
| 7.2 | Timeline circles use fragile absolute positioning | Layout |
| 7.3 | Templates section creates long scrollable region | Layout |
| 8.1 | No page entrance animation | Motion |
| 9.1 | Timeline cramped on mobile | Responsive |
| 10.3 | Copy buttons lack context-specific aria-labels | Accessibility |

---

## Files Referenced

- `app/src/content/general/SessionManagementSection.tsx` — Main page component
- `app/src/content/shared/session-management-data.ts` — Data file for rules, scenarios, comparisons, prompts
- `app/src/components/content/PromptExample.tsx` — Copyable prompt template component
- `app/src/components/content/CalloutCard.tsx` — Callout card component (accessibility concern)
- `app/src/components/layout/TrackLayout.tsx` — Content layout (75ch constraint)
