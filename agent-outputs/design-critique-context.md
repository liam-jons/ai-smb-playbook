# Design Critique: "How Context Works" Page (`/general/context`)

**Date:** 2026-02-17
**Viewport widths tested:** 375px (mobile), 768px (tablet), 1024px (desktop), 1440px (wide desktop)
**Modes tested:** Light mode, dark mode
**Interaction tested:** Context Window Simulator (add turns, preset switching, slider adjustment)
**Source files reviewed:**
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/ContextSimulatorSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/interactive/ContextWindowSimulator.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/interactive/ContextWindowBar.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/interactive/SimulatorControls.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/interactive/SimulatorStatus.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/context-simulator-data.ts`

---

## 1. Visual Hierarchy and Information Architecture

### What works well
- **Progressive disclosure structure is excellent.** The page opens with a single, accessible paragraph metaphor ("Think of it as a desk"), immediately followed by a "What is a token?" callout, then the interactive simulator, then practical guidance, then deeper educational content in accordions. This is a textbook build-up from concrete to abstract.
- **Heading hierarchy is clean and logical.** H1 "How Context Works" > H2 "Context Window Simulator" > H2 "My Session Feels Slow" > H2 "Understanding Context" > H2 "Token Usage and Your Budget" > H2 "Session Handoff Prompt". Each section addresses a progressively more specific concern.
- **The accordion pattern for "Understanding Context" is well-chosen.** It prevents overwhelming users while keeping the information discoverable. The first item ("Why does this matter?") is open by default, which is the right call.
- **Cross-links to Session Management are well-placed** -- they appear inline where contextually relevant, not dumped at the bottom.

### Issues

**IMPORTANT: Content area feels narrow relative to the sidebar at 1440px.**
At wide desktop, the content sits in a `max-w-[75ch]` container within the main content area, and the sidebar takes `w-72`. This means the content occupies roughly 50-55% of the available width. The proportional bar and simulator controls feel cramped relative to the available screen real estate. The page could benefit from allowing the simulator section specifically to break out of the `75ch` constraint.

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/layout/TrackLayout.tsx` (line 139, `max-w-[75ch]`)
**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/ContextSimulatorSection.tsx`

**Recommendation:** Consider allowing the simulator section to use `max-w-none` or `max-w-3xl` to give the proportional bar more breathing room, while keeping prose sections at `65ch`.

---

## 2. Context Window Simulator

### What works well
- **The proportional bar is immediately comprehensible.** The colour-coded segments clearly communicate relative size. At first glance you can see that system overhead (blue/teal/gold segments) consumes a meaningful chunk before you type anything. The "Available" label on the empty space is effective.
- **The "Turn X of ~22 before compaction" counter is brilliant.** It quantifies the problem in human terms -- not "you've used 39% of tokens" but "you have roughly 22 messages before things degrade." This is the right abstraction for an SMB audience.
- **Presets are well-labelled and contextualised.** "Minimal (New project, no extras)" / "Moderate (Typical Phew! setup)" / "Heavy (Many integrations)" -- the parenthetical descriptions tell users which one applies to them.
- **The degradation badge ("Full attention", "Slight fade", "Noticeable fade", "Critical") is an excellent design choice.** It translates a technical metric into an emotional/practical one. Users understand "Slight fade" intuitively.
- **Auto-compaction at 90% for general track** prevents users from "breaking" the simulator by adding too many turns. The auto-compact behaviour mirrors what actually happens in Claude, which is educational.
- **The compaction overlay animation ("Compacting conversation...") is tasteful** -- it uses `backdrop-blur` and a pulsing text, which feels informative without being flashy.

### Issues

**CRITICAL: The proportional bar labels are not visible at default (Turn 0) state on desktop.**
At 1440px in the default Moderate preset, the coloured segments are narrow. Only "Built-in T..." and "Exten..." are partially visible as truncated white text inside the segments. "System Prompt", "Project Instructions", "Skills", "Environment", and "Conversation" segments are too narrow to display their labels. On mobile, a legend grid appears below the bar (this is good), but on desktop (sm+) the legend is `sm:hidden` -- meaning desktop users must hover on each segment to learn what it represents. This creates a discoverability problem.

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/interactive/ContextWindowBar.tsx` (lines 64, 138-142, 204-205)

**Recommendation:** Show the mobile-style legend on all viewports (remove `sm:hidden` from the legend grid), or add a persistent legend below the bar at all breakpoints. The inline labels are a nice bonus on larger segments but should not be the only way to identify segments on desktop.

**IMPORTANT: "Response Buffer" segment appearance is confusing.**
The Response Buffer uses a diagonal-striped pattern overlay (`bg-[repeating-linear-gradient(45deg,...)]`). While this distinguishes it as "different" from other segments, the striped pattern reads more as "loading" or "disabled" than "reserved". The grey colour (oklch 0.7 0.015 250) is also very close to the empty "Available" space (muted/20), making them hard to distinguish visually, especially at a glance.

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/context-simulator-data.ts` (line 163)
**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/interactive/ContextWindowBar.tsx` (lines 81-82)

**Recommendation:** Either give the Response Buffer a more distinct colour (perhaps a muted amber or darker grey with stronger contrast against the Available space), or add a subtle text label "Reserved" inside it at wider viewports. The striped pattern could remain but with higher contrast.

**NICE-TO-HAVE: Segment colours for "Skills" and "System Prompt" are not easily distinguishable.**
System Prompt uses oklch(0.45 0.2 270) -- a deep blue-violet. Skills uses oklch(0.55 0.2 300) -- a slightly lighter purple. These are close in hue (270 vs 300) and similar in chroma (0.2). In the compressed bar at default state, both are very narrow and essentially indistinguishable. The mobile legend helps but users scanning the bar see two adjacent purple-ish slivers.

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/index.css` (lines 143, 147)

**Recommendation:** Shift Skills to a more distinct hue -- perhaps pink (oklch 0.6 0.18 340) or magenta -- to increase visual separation from System Prompt.

**NICE-TO-HAVE: The simulator lacks a visual boundary separating it from prose.**
The simulator section is introduced with an H2 and a paragraph, then flows directly into the status bar and proportional bar. There is no card, border, background change, or other visual container distinguishing the interactive tool from the surrounding prose. At 1440px desktop, the simulator blends into the page.

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/ContextSimulatorSection.tsx` (line 101)

**Recommendation:** Wrap the `<ContextWindowSimulator>` component in a container with a subtle border and background (e.g. `rounded-xl border border-border bg-card p-6`) to visually separate the interactive tool from the educational prose. This aligns with the design principle "interactive tools feel distinct".

---

## 3. Educational Flow

### What works well
- **The progression is near-perfect for the target audience.** Introduction metaphor > Token definition > Interactive tool > "What to do when it's slow" > Deep-dive accordions > Budget awareness > Handoff prompt. This moves from "what is it?" to "play with it" to "what do I do about it?" to "learn more if you want to".
- **The "My Session Feels Slow" section is excellently positioned** -- immediately after the simulator, capitalising on the "aha moment" users just had from watching the bar fill up. The numbered list is actionable and concise.
- **The cross-reference back to the simulator** in item 3 ("The context window simulator above shows it clearly...") reinforces the learning by connecting the abstract understanding to the visual they just interacted with.
- **The "Token Usage and Your Budget" section is well-framed.** It does not guilt users about cost; it frames cost awareness as efficiency. The "50,000 tokens already used" figure grounds the abstract in the concrete.

### Issues

**IMPORTANT: The "Understanding Context" accordion section feels disconnected from the simulator.**
There is a large gap between the simulator (Area 2) and the accordion content (Area 3), with the "My Session Feels Slow" section (Area 2b) in between. Users who interact with the simulator and then scroll past the session hygiene advice may not realise there is deeper educational content below. The accordion titles ("Why does this matter?", "Signs your context is getting full") could be connected more explicitly to the simulator experience.

**Recommendation:** Add a brief transitional sentence above the accordion section, such as "Want to understand the mechanics behind what you just saw in the simulator?" This connects the interactive experience to the deeper learning.

---

## 4. Emotional Resonance

### What works well
- **The tone is reassuringly practical.** "Think of it as a desk" is a perfect metaphor for a non-technical audience. "It costs nothing and is almost always the right move" (about starting fresh sessions) removes anxiety.
- **The "don't wait for degradation" advice** is empowering rather than scary. The page does not make users feel stupid for not understanding context windows -- it positions context management as a normal, learnable skill.
- **The session handoff prompt section is genuinely helpful.** Instead of just explaining the problem, it gives users an immediately usable tool. The "How to use this" introduction is clear and the prompt itself is comprehensive.

### Issues

**NICE-TO-HAVE: The page is somewhat long for the general audience.**
At 375px mobile, the full-page screenshot shows approximately 12 screen-heights of content. While the accordion pattern helps, the sheer scroll depth might cause some users to disengage before reaching the handoff prompt (arguably the most actionable part of the page).

**Recommendation:** Consider moving the Session Handoff Prompt section higher up (before "Understanding Context" accordions), since it is more immediately actionable than the deeper educational content. The accordion section could move below it as "optional further reading".

---

## 5. Typography

### What works well
- **Heading sizes are well-scaled.** H1 at `text-2xl sm:text-3xl`, H2 at `text-xl sm:text-2xl`. The responsive scaling prevents H2 headings from overwhelming the page on mobile.
- **Body text uses `text-base leading-relaxed` at `max-w-[65ch]`** for the introduction, which is optimal for readability.
- **Code snippets** use inline `code` styling with `rounded bg-muted px-1 py-0.5 text-xs font-mono`, which is visually distinct without being jarring.
- **The "When to use" text** on the PromptExample component is set at a smaller size and muted colour, correctly indicating it as supplementary information.

### Issues

**NICE-TO-HAVE: The simulator status text ("Turn 0 of ~22 before compaction") uses the same `text-sm` as surrounding prose.**
The status line does not visually communicate that it is part of the interactive tool rather than static text. At a glance, it could be mistaken for a regular paragraph.

**Recommendation:** Add a slight visual treatment -- either a `font-mono tabular-nums` treatment for the numbers, or a subtle background/border to the status bar area to tie it visually to the simulator widget.

---

## 6. Colour and Theming

### What works well
- **The callout cards use distinct, well-chosen variant colours.** Info (blue), Tip (green), Important (orange-red), Warning (amber). These follow conventional colour semantics.
- **Dark mode segment colours are properly defined** in CSS with separate values. The segments are visible and distinguishable in dark mode. The dark mode conversion is thoughtful -- lightness values are shifted appropriately (e.g., system prompt goes from oklch 0.45 to 0.5).
- **The degradation badge colours** (green for "Full attention", amber for "Slight fade"/"Noticeable fade", red for "Critical") follow traffic-light semantics that need no explanation.

### Issues

**IMPORTANT: Dark mode contrast for the Note callout is insufficient.**
The "Note: These numbers are ballpark estimates..." callout in the simulator section uses `border-info/30 bg-info-muted/50` variant. In dark mode, the text inside this callout appears as low-contrast grey on a very dark background. The info text at `text-xs` is particularly hard to read.

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/content/CalloutCard.tsx`

**Recommendation:** Check WCAG AA contrast ratios for all callout variant text in dark mode. The `text-xs` body text inside callouts may need to use `text-muted-foreground` rather than inheriting from the parent.

**NICE-TO-HAVE: The proportional bar background in dark mode is very close to the page background.**
The bar container uses `bg-muted/30` with a `border border-border`. In dark mode, this is barely distinguishable from the surrounding page background, making the "Available" space (which uses `bg-muted/20 dark:bg-muted/10`) nearly invisible. The overall bar boundary is hard to perceive.

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/interactive/ContextWindowBar.tsx` (line 58)

**Recommendation:** Increase the dark mode bar background contrast. Consider `dark:bg-muted/40` or `dark:bg-card` to make the bar container more visible against the page background.

---

## 7. Layout and Spacing

### What works well
- **`space-y-12` for top-level sections** creates clear visual separation between the five major areas (intro, simulator, session hygiene, understanding, budget, handoff). This is the right amount of vertical rhythm -- sections feel distinct without excessive whitespace.
- **Slider controls are well-spaced** with labels and token counts on the same line, making it easy to see the relationship between the setting and its cost.
- **The preset buttons use `flex flex-wrap`** which handles narrow viewports gracefully -- buttons wrap to a second line on mobile without overflowing.

### Issues

**IMPORTANT: The "Add a conversation turn" and "Reset" buttons are slightly cramped relative to the sliders above them.**
The action buttons section uses `flex flex-wrap items-center gap-2` which puts them on the same line with minimal spacing. On mobile, the primary action button ("Add a conversation turn") is the same visual weight as the "Reset" ghost button, but they serve very different purposes (constructive vs destructive).

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/interactive/SimulatorControls.tsx` (lines 149-210)

**Recommendation:** Add a visual separator (small spacer or `gap-4`) between the primary action button and the reset button. Alternatively, move the reset button to a secondary position (right-aligned or lower-contrast).

**NICE-TO-HAVE: The handoff prompt code block is quite tall.**
The Session Handoff Prompt code block contains a 6-point numbered list that occupies significant vertical space. On mobile, this is a long scroll through monospaced text.

**Recommendation:** Consider collapsing the prompt behind a "Show full prompt" disclosure, with the first line visible by default and a "Copy" button always accessible.

---

## 8. Responsive Design

### What works well
- **Mobile layout (375px) is well-adapted.** The sidebar is replaced with a "Sections" sheet trigger. The mobile breadcrumb ("1.2 How Context Works") provides orientation. Content fills the full width with appropriate `px-4` padding.
- **The slider controls are wrapped in a `Collapsible` on mobile (`sm:hidden`)** with "Adjust settings" trigger. This is a smart space-saving decision -- presets are enough for most mobile users.
- **The proportional bar height scales** from `h-10` on mobile to `h-12` on `sm+`, which prevents it from being too cramped on small screens.
- **The mobile segment legend** (2-column grid with coloured dots) is clear and readable at 375px. It correctly shows only on mobile where inline labels cannot fit.
- **Preset buttons use `min-h-[44px]` on mobile** for touch targets, which is the correct minimum size for iOS/Android accessibility guidelines.

### Issues

**IMPORTANT: The proportional bar segments are nearly illegible at 375px.**
At 375px, the bar is approximately 340px wide. The "System Prompt" segment (2.5%) occupies about 8.5px -- essentially an invisible sliver. Even "Built-in Tools" (7.5%) at ~25px is too narrow to communicate its colour meaningfully. Users must rely entirely on the legend below the bar.

**Recommendation:** On mobile, consider switching to a vertical/stacked bar layout (segments stacked top-to-bottom) or a table/list format showing segment name + token count + visual bar. The horizontal proportional bar is effective at 768px+ but loses its communicative power at 375px.

**NICE-TO-HAVE: The "Turn X of ~22 before compaction" status shows truncated text on mobile.**
The status component uses `hidden sm:inline` for the full "Turn X of ~22 before compaction" text and `sm:hidden` for just "Turn X". While this prevents overflow, the mobile user loses the "before compaction" context, which is the most educational part of the counter.

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/interactive/SimulatorStatus.tsx` (lines 33-39)

**Recommendation:** Show at least "Turn X of ~22" on mobile (omitting "before compaction" is acceptable, but showing the denominator helps users understand the finite nature of the context window).

---

## 9. Accessibility

### What works well
- **The proportional bar has a comprehensive `role="img"` with `aria-label`** that describes the number of segments and total tokens. Each individual segment has its own `aria-label` with token count and percentage.
- **The "Available space" element has its own `aria-label`** with token count and percentage.
- **The degradation badge area uses `aria-live="polite" aria-atomic="true"`** to announce changes to screen readers when the user adds turns.
- **The compaction has a dedicated `aria-live="assertive"` announcer** (sr-only div) that announces "Conversation compacted. Approximately 50% of conversation tokens freed."
- **All sliders have `aria-valuetext`** with human-readable descriptions (e.g. "2 extensions, approximately 12,000 tokens").
- **The `useReducedMotion` hook is respected throughout** -- animation durations are set to 0 when the user prefers reduced motion.
- **Touch targets use `min-h-[44px]` on mobile** for buttons.

### Issues

**IMPORTANT: The native HTML `<input type="range">` sliders have custom styling but may lack sufficient contrast.**
The slider track uses `bg-muted` and the thumb uses `bg-primary`. In both light and dark mode, the unfilled portion of the track (right side of thumb) needs to meet WCAG contrast requirements against the page background. The `appearance-none` reset means the native slider feedback (filled vs unfilled) is lost.

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/interactive/SimulatorControls.tsx` (lines 367-377)

**Recommendation:** Add a filled-track pseudo-element or use a two-tone approach (e.g. `bg-primary` for the filled portion, `bg-muted` for unfilled) to visually communicate the slider's current position more clearly. Consider using the shadcn/ui `Slider` component which provides better accessibility out of the box.

**NICE-TO-HAVE: The Tool Search toggle (developer track) is a custom `<button role="switch">` but does not have a visible focus ring on keyboard navigation.**
The switch uses `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`, which should work, but the `outline-ring` colour may be low-contrast in dark mode.

**Recommendation:** Test keyboard navigation of the toggle in dark mode and ensure the focus ring is visible against the dark background.

**NICE-TO-HAVE: The accordion triggers do not announce their expanded/collapsed state distinctly.**
While shadcn/ui's Accordion component inherits Radix's accessibility primitives (which include `aria-expanded`), the visual chevron indicator is the only feedback. A screen reader user would need to listen for the `aria-expanded` state change.

**Recommendation:** This is handled by Radix's built-in accessibility and is likely fine, but manual testing with a screen reader (VoiceOver) would confirm.

---

## 10. AI Slop Test

### What works well
- **No generic AI-generated patterns detected.** The content is specific to this product, this audience, and this context. Phrases like "Think of it as a desk" and "the single most useful thing you can learn" feel authored, not generated.
- **The "lost in the middle" reference** is specific and educational rather than vague hand-waving about "AI limitations".
- **The session handoff prompt** is clearly written by someone who has actually used Claude extensively -- the six-point structure reflects real workflow knowledge.
- **Technical accuracy is strong.** Token counts, compaction thresholds, "primacy bias" / "recency bias" -- these are accurate descriptions of how Claude actually works.

### Issues

**NICE-TO-HAVE: The "Practical cost awareness" callout text has a slightly generic tone.**
"Understanding this helps you work more efficiently, not less" is a platitude that adds little. The rest of the callout is specific and useful, but this sentence reads as filler.

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/ContextSimulatorSection.tsx` (line 489)

**Recommendation:** Replace with something more specific, such as "Knowing your starting footprint helps you plan session scope -- aiming for one task per session keeps token usage predictable."

---

## Bug Report: Unstable Navigation

**CRITICAL: The page redirects to `/general/roi-measurement` after certain interactions.**

During testing, the page repeatedly redirected from `/general/context` to `/general/roi-measurement` after:
1. Viewport resizing (especially crossing the `lg` breakpoint where sidebar shows/hides)
2. Taking Playwright accessibility snapshots
3. Waiting for a few seconds after initial page load

This appears to be related to the React Router SPA routing and possibly the FeasibilityStudyBuilder component on the ROI page (which has a persisted draft in localStorage). The redirect is non-deterministic -- it does not happen every time, but happens frequently enough to be a significant UX issue.

**Potential causes:**
- The `TrackLayout` component has a redirect on line 67-72 when `!sectionSlug` -- if the route params are momentarily lost during a re-render, this could redirect to the first section
- The `getSectionsForTrack('general')[0]` returns "welcome" (slug: 'welcome'), not "roi-measurement", so the redirect to ROI is not from this code path
- There may be a client-side navigation event being triggered by the FeasibilityStudyBuilder's localStorage draft recovery logic on the ROI page

**Files to investigate:**
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/layout/TrackLayout.tsx` (lines 62-72)
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/RoiMeasurementSection.tsx` (line 430)
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/FeasibilityStudyBuilder.tsx` (localStorage persistence)

**Severity:** Critical -- this is a navigation bug that could affect real users, not just automated testing. If viewport resizing (e.g. rotating a tablet) triggers a redirect to a different page, that is a broken user experience.

---

## Key Questions Answered

### Is the Context Window Simulator visually distinct from prose content?
**Partially.** The simulator is distinguished by its interactive elements (bar, sliders, buttons, status counters), but it lacks a visual container (border, card, background) that would clearly separate it from the surrounding prose. At a glance on desktop, the simulator blends into the page. Adding a subtle card boundary would significantly improve the visual distinction.

### Are the colour-coded segments in the bar clearly differentiated and labelled?
**On mobile, yes (legend is shown). On desktop, partially.** The mobile 2-column legend is clear and well-executed. On desktop, segment identification relies on hover tooltips and inline labels that are only visible on segments wider than 5% of the bar. The System Prompt, Project Instructions, Skills, and Environment segments are too narrow to display labels, and the desktop user has no persistent legend. The Response Buffer colour is also too close to the Available space colour.

### Does the simulator work well at mobile widths?
**Functionally, yes. Visually, it's compromised.** The proportional bar at 375px renders segments as slivers that are difficult to distinguish visually. The mobile legend compensates, but the bar itself loses its communicative power at narrow widths. The controls (presets, sliders behind collapsible, action buttons) work well on mobile with appropriate touch targets. The "Adjust settings" collapsible is a smart mobile pattern.

### Does the design feel professional and trustworthy for a B2B SMB audience?
**Yes.** The tone is authoritative without being condescending. The use of concrete numbers (200,000 tokens, ~22 turns, 50,000 tokens at startup), the desk metaphor, the actionable numbered lists, and the immediately usable handoff prompt all contribute to a professional, practical feel. The interactive simulator adds a "try it yourself" element that is engaging without being gimmicky. The overall quality is above the typical SaaS educational content.

---

## Summary of Issues by Severity

### Critical (2)
1. **Navigation bug:** Page redirects to `/general/roi-measurement` after viewport resizing or certain interactions
2. **Desktop segment labels not visible:** No persistent legend on desktop; hover-only identification of narrow segments

### Important (5)
3. **Content area narrow at 1440px:** Simulator feels cramped within `max-w-[75ch]`
4. **Response Buffer visually confusing:** Colour too similar to Available space; striped pattern reads as "loading"
5. **Dark mode callout contrast:** Note text in info callouts is low-contrast in dark mode
6. **Mobile proportional bar illegible:** Segments are too narrow to communicate colour at 375px
7. **Action button visual hierarchy:** "Add turn" and "Reset" have similar visual weight

### Nice-to-have (7)
8. System Prompt and Skills colours too similar
9. Simulator lacks visual container/boundary
10. Page length for general audience (handoff prompt buried)
11. Simulator status text not styled as part of interactive tool
12. Dark mode bar container near-invisible
13. Mobile status truncates useful "of ~22" information
14. "Practical cost awareness" callout contains filler text

---

## Overall Assessment Score: 7.5/10

**Strengths:** The educational content design is outstanding. The progressive disclosure, metaphor choice, tone, and interactive simulator concept are all well above average. The accessibility work (aria-labels, live regions, reduced motion support, touch targets) demonstrates genuine care. The two-track content architecture (general vs developer) is well-executed with conditional rendering that does not feel like two separate pages bolted together.

**Weaknesses:** The visual execution of the proportional bar needs work at extreme viewport widths (too narrow on mobile, labels not visible on desktop). The simulator needs a visual container to distinguish it as an interactive tool. There is a critical navigation bug that needs investigation. Dark mode quality, while functional, has some contrast issues that need attention.

**The core interaction design is strong.** The concept of "add turns and watch the bar fill up" is the right educational tool for this audience. The refinements needed are primarily visual polish (segment colours, labels, container boundaries) rather than architectural changes.
