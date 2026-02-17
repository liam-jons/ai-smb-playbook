# Design Critique: Starter Kit Page

**URL:** `http://localhost:4100/general/starter-kit`
**Date:** 17 February 2026
**Viewports tested:** 1440x900, 1024x768, 768x1024, 375x812
**Modes tested:** Light, Dark

---

## Executive Summary

The Starter Kit page is a well-structured reference tool that successfully organises a complex set of deliverables (skills, templates, prompts) into a browsable, categorised interface. The page demonstrates strong fundamentals in information architecture and interactive component design, with clear section separation, appropriate use of tabs for both installation guides and file browsing, and thoughtful track-aware content filtering. However, the page suffers from several notable issues: the content area feels narrow and underutilised at wide viewports, the accessibility tree is missing ARIA descriptions on expandable cards, the mobile experience has tab truncation issues that hinder usability, and the dark mode treatment needs refinement on card borders and background layering.

**Overall Score: 6.8 / 10**

---

## 1. Visual Hierarchy & Information Architecture

**Score: 7.5 / 10**

### What works well

- Clear top-down flow: Introduction, Quick Start, How to Install, File Browser, Common Commands, Maintenance note, Track completion. This is a logical journey from "what is this?" to "how do I use it?" to "browse everything" to "keep it current."
- The Quick Start card with its green-tinted background immediately draws the eye and communicates "start here." The numbered list with week labels and effort badges gives a strong sense of progression.
- Section separators (`<Separator />`) between each major block create clean visual breaks without heavy dividers.
- The "Key distinction" callout in the introduction paragraph uses bold text effectively to flag an important concept inline.
- File browser tabs with count badges (e.g., "Skills 11", "Templates 1") give instant scope awareness.

### Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| H2 "Starter Kit" directly below H1 "Starter Kit Contents" creates redundancy | Important | The page title and first section heading are near-synonyms. The H2 should either be removed or renamed to something more specific like "What's Included" or "Overview." |
| No table of contents or anchor links for the long page | Nice-to-have | At approximately 4,600px scroll height on desktop, the page would benefit from jump links to the major sections (Quick Start, How to Install, File Browser, etc.). |
| The pagination nav only shows "Previous: Measuring AI ROI" with no "Next" link | Nice-to-have | This is the last page in the General track, so having only "Previous" is correct, but the asymmetry looks incomplete. The track completion card partially compensates. |
| The H3 headings "How to Install", "File Browser", "Common Install Commands" are all at the same visual weight | Nice-to-have | These sections serve different purposes (instructional vs. browsing vs. reference) but look identical. A subtle visual differentiation could help. |

---

## 2. Interactive Tools vs Prose

**Score: 7.0 / 10**

### What works well

- The Quick Start card is visually distinct from surrounding prose with its green-tinted border and background (`border-success/20 bg-success-muted/30`), making it clearly identifiable as a structured tool rather than paragraphs.
- The installation guide tabs (Claude Desktop / claude.ai / Teams Admin) are properly contained within a Card component, visually separating them from the prose introduction above.
- The File Browser tabs with category icons and count badges are clearly interactive.
- File cards use the chevron expand/collapse pattern with proper `aria-expanded` attributes, making it clear these are interactive disclosure widgets.
- The CalloutCard components ("Automatic invocation" tip, "Keeping your starter kit current" warning) are visually distinct with left-border accents and icons.

### Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| File cards in their collapsed state look very similar to static content cards | Important | The only visual cue that a file card is interactive is a small chevron icon. At a glance, the card list could be mistaken for a static list of items. A hover state lift or a more prominent expand affordance would help. |
| "Download All as ZIP" button sits above the file browser tabs and may not be noticed | Nice-to-have | This action button is positioned in a flex row with the heading but doesn't stand out from the surrounding content. It could benefit from slightly more visual weight. |
| The "Common Install Commands" section looks like a standard prose section with a code block, not an interactive tool | Nice-to-have | For the General track, this section contains only one code block (the UK English preference text). It feels like a thin section that could be folded into the introduction or Quick Start. |

---

## 3. Emotional Resonance

**Score: 7.0 / 10**

### What works well

- The tone is practical and non-intimidating. Phrases like "Everything here is ready to use and start getting value from immediately" and "A two-minute setup" convey low friction and high reward.
- The Quick Start section with its week-by-week adoption plan communicates thoughtfulness and care for the reader's time.
- The track completion card ("You've completed the General track") provides a satisfying sense of accomplishment with clear next steps.
- The "Key distinction" paragraph about plugins vs. manual files is honest and transparent, building trust.
- UK English is used consistently throughout (e.g., "organisation," "customise").

### Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| The page feels functional but slightly cold | Important | Compared to the other interactive pages (Context Window Simulator, ROI Calculator), this page is primarily a reference/catalogue. A brief contextual illustration or a short quote from a user who found the skills valuable could add warmth. |
| No visual personality in the file browser | Nice-to-have | The file card list is a long uniform column. While functional, it lacks the visual variety that would make browsing feel engaging rather than like scanning a directory listing. |
| The "Keeping your starter kit current" callout uses a warning/important variant but the content is gentle maintenance advice | Nice-to-have | The amber/important styling may create slight anxiety about maintenance burden. An info variant might be more appropriate for this tone. |

---

## 4. Typography

**Score: 7.5 / 10**

### What works well

- The heading hierarchy is correct: H1 (page title) at `text-2xl sm:text-3xl`, H2 (section title) at `text-2xl sm:text-3xl`, H3 (subsection) at `text-lg`, H4 (within cards) at standard font-medium.
- Body text uses `text-base leading-relaxed` with `max-width: 65ch` constraint, ensuring comfortable reading line lengths.
- The `tracking-tight` on headings adds a professional feel.
- Badge text at `text-xs` is appropriately sized for metadata labels.
- Code snippets use `font-mono` with appropriate contrast against the `bg-muted` background.

### Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| H1 and H2 are the same size (`text-2xl sm:text-3xl`) | Important | "Starter Kit Contents" (H1) and "Starter Kit" (H2) render at the same visual size, breaking the heading hierarchy. The H2 should be stepped down to `text-xl sm:text-2xl`. |
| File card names use `font-medium` which doesn't stand out enough in the collapsed state | Nice-to-have | The file name competes with the badges and description text. A slightly bolder weight or larger size would improve scannability. |
| The Quick Start list items use `text-sm` throughout, including the week labels and titles | Nice-to-have | The week labels and titles could be at `text-base` to give them more prominence within the card. |

---

## 5. Colour & Theming

**Score: 6.5 / 10**

### What works well

- The Quick Start card uses semantic success colours (`border-success/20 bg-success-muted/30`) effectively to communicate positive/recommended action.
- Badge variants (outline, secondary) use appropriate muted styling that doesn't compete with primary content.
- The "Recommended" badge uses a green success style that clearly distinguishes priority items.
- The track completion card uses primary colour tinting (`border-primary/20 bg-primary/5`) to create a distinct end-of-track feel.
- CalloutCard variants (tip, info, important) use distinct colour coding.

### Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| Dark mode card backgrounds lack sufficient contrast against the page background | Important | In the dark mode screenshot, file cards and the Quick Start card blend into the background. The card borders are barely visible, making the page feel flat and cards hard to distinguish from surrounding content. |
| Dark mode code blocks appear to have adequate contrast but the surrounding card chrome is very subtle | Important | The `bg-muted/30` background on the Quick Start card is nearly invisible in dark mode. |
| The file browser tab bar has no visible background in light mode | Nice-to-have | The tab bar blends with the page background. A subtle background tint on the TabsList would improve its presence. |
| The Starter Kit sidebar link uses primary colour tinting (`bg-primary/5`) which is a nice touch but may not be noticeable to all users | Nice-to-have | The visual differentiation between this "special" link and regular sidebar links is very subtle. |

---

## 6. Layout & Spacing

**Score: 6.5 / 10**

### What works well

- The `space-y-12` vertical rhythm between major sections creates generous breathing room.
- The `max-w-[75ch]` content constraint prevents overly wide text at large viewports.
- File cards use consistent `space-y-3` vertical spacing between them.
- The sidebar width (`w-72`) provides adequate space for section titles without truncation.
- The Quick Start list items use proper gap and alignment with numbered circles.

### Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| Content area feels narrow and underutilised at 1440px | Important | The `max-w-[75ch]` constraint plus the `w-72` sidebar leaves significant empty space on the right side of the viewport at 1440px. For a page that is primarily a tool/catalogue (file browser, tabs), the content could reasonably expand to `max-w-[85ch]` or even wider for the interactive sections. |
| The file browser "Download All as ZIP" button and heading are in a flex row that wraps awkwardly at some widths | Nice-to-have | Between approximately 500-700px, the button may wrap below the heading in a way that looks like orphaned content. |
| Tablet view (768px) loses the sidebar entirely and shows a "Sections" sheet trigger | Nice-to-have | The breakpoint for sidebar visibility is `lg` (1024px), which means tablet users at 768-1023px get the mobile-style sheet navigation. This is acceptable but the 1024px breakpoint could be lowered to `md` (768px) since the sidebar at `w-72` fits within 768px if the content area is allowed to be narrower. |
| The pagination nav uses `max-w-[65ch]` which is narrower than the content area `max-w-[75ch]` | Nice-to-have | This creates a subtle alignment mismatch between the content area and the pagination, visible at wider viewports. |

---

## 7. Motion & Animation

**Score: 7.0 / 10**

### What works well

- Entrance animations use `fadeInUp` and `fadeIn` variants with tasteful easing (`[0.16, 1, 0.3, 1]`) and moderate durations (350-450ms).
- The `prefers-reduced-motion` media query is properly respected via `getReducedMotion()` helper, which disables all animations for users who prefer reduced motion.
- File card expand/collapse uses `AnimatePresence` with `scaleY` transform and `opacity`, creating a smooth reveal that feels physical and natural.
- The `transformOrigin: 'top'` on card expansion means content grows downward from the button, which is directionally correct.

### Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| `getReducedMotion()` is called once via `useMemo` with empty deps, meaning it won't react to changes in the media query during the session | Nice-to-have | If a user toggles reduced motion in system settings while the page is open, the animations won't update until refresh. A `useEffect` with `matchMedia.addEventListener('change', ...)` would be more robust. |
| Card hover state (`hover:shadow-sm`) is very subtle | Nice-to-have | The shadow transition on file card hover is barely perceptible. A slightly more pronounced hover state would improve the interactive feel. |
| Tab switching has no transition animation | Nice-to-have | When switching between Skills, Templates, and Prompts tabs in the file browser, the content appears instantly. A brief fade transition would smooth the experience. |

---

## 8. Responsive Design

**Score: 6.0 / 10**

### What works well

- The installation guide tabs use responsive text: full labels (`Claude Desktop`) on `sm:` and above, abbreviated labels (`Desktop`) on mobile. This prevents overflow.
- The file browser tab labels similarly use `hidden sm:inline` for full labels and `sm:hidden` for abbreviated versions on mobile.
- The mobile sheet sidebar works well as a replacement for the desktop sidebar, with proper close-on-navigation behaviour.
- File card layout is fully fluid and works well at all widths.
- The Track navigation buttons transition from inline buttons to a hamburger menu at the `md` breakpoint.

### Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| File browser tab truncation on mobile (375px) | Important | At 375px, the file browser tabs show abbreviated 4-character labels (e.g., "Skil", "Temp", "Prom") via `.slice(0, 4)`. "Skil" and "Temp" are not immediately meaningful abbreviations. This hinders discoverability. |
| Mobile view is very long (~5000px+ scroll height) with 11 file cards in the Skills tab | Important | There is no progressive disclosure or "show more" pattern. A user on mobile must scroll through all 11 cards to see the Templates and Prompts tabs below (wait -- tabs are at the top, so this is less of an issue, but the long list is still fatiguing). |
| The Quick Start card's numbered list wraps inconsistently at some mobile widths | Nice-to-have | The flex layout of week label + title + effort badge can create uneven wrapping at approximately 400px width. |
| The "Download All as ZIP" button wraps below the File Browser heading on mobile | Nice-to-have | This creates a somewhat disjointed header area. On mobile, the button might be better placed below the description paragraph. |
| Viewport resize from mobile to desktop triggers unexpected route navigation | Critical | During testing, resizing the browser from a narrow viewport to a wide one (or vice versa) caused the application to navigate away from `/general/starter-kit` to `/developer/claude-md`. This appears to be related to how the track buttons or layout components handle responsive breakpoint changes. This is a significant bug that would affect users who resize their browser window. |

---

## 9. Accessibility

**Score: 6.5 / 10**

### What works well

- "Skip to main content" link is present at the top of the page.
- Section navigation uses `<nav aria-label="Section navigation">`.
- Track navigation uses `<nav aria-label="Track navigation">`.
- File cards use proper `aria-expanded` and `aria-controls` attributes for the disclosure pattern.
- The Quick Start numbered list uses `<ol>` with proper semantic list structure.
- Tab components use proper `tablist`, `tab`, and `tabpanel` ARIA roles (provided by Radix UI).
- The sidebar link for the current page uses `aria-current="page"`.
- Copy buttons have descriptive `aria-label` attributes that change to "Copied install command" on success.

### Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| Radix UI console warnings about missing `Description` or `aria-describedby` | Important | When interacting with Sheet/Dialog components, Radix UI logs warnings: "Missing `Description` or `aria-describedby`". This indicates the mobile sidebar sheet and possibly the Appearance Settings dialog lack accessible descriptions. |
| File card buttons have overly long accessible names | Important | The button accessible name concatenates all visible text: "UK English All users Recommended Enforce UK English spelling, grammar, and conventions in all output." While technically functional, this is verbose for screen reader users. An explicit `aria-label` like "UK English skill, recommended, all users" would be more concise. |
| The Quick Start numbered circles use `aria-hidden="true"` but the `<ol>` provides list semantics | Nice-to-have | This is actually correct -- the numbered circles are decorative since `<ol>` already communicates order. Good implementation. |
| The "Download All as ZIP" link should ideally have an `aria-label` indicating it downloads a file | Nice-to-have | The link text "Download All as ZIP" is adequate, but a more descriptive label like "Download all starter kit files as a ZIP archive" would be clearer. |
| No heading for the mobile section breadcrumb ("Sections" button + "1.17 Starter Kit Contents") | Nice-to-have | The mobile top bar shows context but has no semantic heading structure. A visually hidden heading would improve navigation for screen reader users. |

---

## 10. AI Slop Test

**Score: 8.0 / 10**

### What works well

- No purple gradients, glassmorphism, or neon effects anywhere on the page.
- No centre-aligned everything pattern -- text is left-aligned throughout.
- The card grid is not a generic 2x2 or 3x3 layout with identical cards. File cards are stacked vertically in a list, which is appropriate for a browsable catalogue.
- No "Powered by AI" badges or sparkle emojis (the Rocket icon in Quick Start is contextually appropriate).
- The design feels like a practical tool, not a marketing page.
- No gratuitous animations or parallax effects.
- The page doesn't use stock illustrations or generic hero images.
- Typography and spacing choices are restrained and purposeful.

### Issues

| Issue | Severity | Detail |
|-------|----------|--------|
| The long uniform list of file cards could be perceived as a generic directory listing | Nice-to-have | While the vertical list is appropriate, the lack of visual variety (every card looks identical except for badge variations) creates a monotonous middle section. Grouping or visual sub-headers within the tab content could help. |
| The track completion card at the bottom follows a common "congratulations" pattern | Nice-to-have | The "You've completed the General track" card, while useful, follows a pattern seen in many onboarding/course platforms. The content is genuine but the presentation could be more distinctive. |

---

## Key Questions Answered

### Does the design feel professional and trustworthy for a B2B SMB audience?

**Yes, largely.** The clean layout, practical tone, and restrained styling communicate competence without pretension. The Quick Start section is particularly well-judged for a busy SMB audience -- it immediately answers "where do I start?" with concrete time estimates. The maintenance callout builds trust by being honest about ongoing effort. However, the dark mode quality issues and the narrow content area at wide viewports slightly undercut the professional impression.

### Are interactive tools (file browser, tabs, installation guides) visually distinct from prose content?

**Partially.** The installation guides (tab-based) and Quick Start (green-tinted card) are clearly distinct from surrounding prose. The file browser tabs are identifiable but the file cards themselves, in their collapsed state, look very similar to static content. The expand/collapse affordance (a small chevron) is the only interactive cue. A more pronounced interactive treatment (hover state, border on hover, subtle background change) would improve this distinction.

### Does the mobile experience feel intentional or like a responsive afterthought?

**Mixed.** The tab label truncation to 4 characters ("Skil", "Temp", "Prom") feels like a quick fix rather than intentional mobile design. The mobile sidebar sheet, breadcrumb bar, and responsive tab labels for installation guides are well-considered. The extremely long scroll on mobile (11 file cards stacked vertically) could benefit from better progressive disclosure. The viewport-resize navigation bug is a significant issue that affects the mobile-to-desktop transition.

### Is the file browser component usable and well-designed at all viewport widths?

**Mostly.** At 1440px and 1024px, the file browser works well with clear tabs, readable cards, and a logical expand/collapse pattern. At 768px (tablet), it functions but the tabs are somewhat crowded. At 375px (mobile), the 4-character tab labels are a usability concern. The expanded card view with installation instructions, file paths, and code blocks is well-structured at all widths.

### Do the installation guide tabs work well across platforms?

**Yes.** The three-tab layout (Claude Desktop, claude.ai, Teams Admin) for the General track is appropriate and well-implemented. Each tab contains a numbered step list with a relevant callout tip. The content is platform-specific and helpful. The responsive label truncation works correctly. The only improvement would be adding a brief intro line above the tabs explaining why the user needs to choose a platform.

---

## Summary of Issues by Severity

### Critical

| # | Issue | Dimension |
|---|-------|-----------|
| 1 | Viewport resize from mobile to desktop triggers unexpected route navigation away from the Starter Kit page | Responsive Design |

### Important

| # | Issue | Dimension |
|---|-------|-----------|
| 1 | H2 "Starter Kit" directly below H1 "Starter Kit Contents" creates redundancy | Visual Hierarchy |
| 2 | File cards in collapsed state lack sufficient interactive affordance | Interactive Tools vs Prose |
| 3 | The page feels functional but slightly cold compared to other interactive pages | Emotional Resonance |
| 4 | H1 and H2 are the same size, breaking heading hierarchy | Typography |
| 5 | Dark mode card backgrounds lack sufficient contrast against page background | Colour & Theming |
| 6 | Dark mode Quick Start card background is nearly invisible | Colour & Theming |
| 7 | Content area feels narrow and underutilised at 1440px | Layout & Spacing |
| 8 | File browser tab truncation on mobile shows meaningless 4-character abbreviations | Responsive Design |
| 9 | Mobile view has 11 file cards with no progressive disclosure | Responsive Design |
| 10 | Radix UI console warnings about missing `Description` or `aria-describedby` on Sheet components | Accessibility |
| 11 | File card buttons have overly verbose accessible names | Accessibility |

### Nice-to-have

| # | Issue | Dimension |
|---|-------|-----------|
| 1 | No table of contents or anchor links for the long page | Visual Hierarchy |
| 2 | Pagination nav shows only "Previous" with no "Next" (expected but looks incomplete) | Visual Hierarchy |
| 3 | H3 headings all at the same visual weight despite different purposes | Visual Hierarchy |
| 4 | "Download All as ZIP" button doesn't stand out enough | Interactive Tools vs Prose |
| 5 | "Common Install Commands" section feels thin for General track | Interactive Tools vs Prose |
| 6 | No visual personality in the file browser card list | Emotional Resonance |
| 7 | "Keeping your starter kit current" callout uses warning variant for gentle advice | Emotional Resonance |
| 8 | File card names don't stand out enough in collapsed state | Typography |
| 9 | Quick Start list items could use slightly larger text | Typography |
| 10 | File browser tab bar has no visible background in light mode | Colour & Theming |
| 11 | Subtle Starter Kit sidebar link tinting may not be noticeable | Colour & Theming |
| 12 | "Download All as ZIP" button wraps awkwardly at some widths | Layout & Spacing |
| 13 | Sidebar breakpoint at `lg` (1024px) could be lowered to `md` (768px) | Layout & Spacing |
| 14 | Pagination nav `max-w-[65ch]` misaligned with content `max-w-[75ch]` | Layout & Spacing |
| 15 | `getReducedMotion()` doesn't react to live media query changes | Motion & Animation |
| 16 | Card hover state (`hover:shadow-sm`) is barely perceptible | Motion & Animation |
| 17 | Tab switching has no transition animation | Motion & Animation |
| 18 | Quick Start card wraps inconsistently at some mobile widths | Responsive Design |
| 19 | "Download All as ZIP" button placement on mobile | Responsive Design |
| 20 | "Download All as ZIP" link could have a more descriptive `aria-label` | Accessibility |
| 21 | No heading for mobile section breadcrumb | Accessibility |
| 22 | Long uniform card list could use visual sub-grouping | AI Slop Test |
| 23 | Track completion card follows a common "congratulations" pattern | AI Slop Test |

---

## Dimension Scores Summary

| # | Dimension | Score |
|---|-----------|-------|
| 1 | Visual Hierarchy & Information Architecture | 7.5 |
| 2 | Interactive Tools vs Prose | 7.0 |
| 3 | Emotional Resonance | 7.0 |
| 4 | Typography | 7.5 |
| 5 | Colour & Theming | 6.5 |
| 6 | Layout & Spacing | 6.5 |
| 7 | Motion & Animation | 7.0 |
| 8 | Responsive Design | 6.0 |
| 9 | Accessibility | 6.5 |
| 10 | AI Slop Test | 8.0 |
| | **Overall** | **6.8** |

---

## Files Referenced

- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/StarterKitSection.tsx` -- Main page component (1,067 lines)
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/starter-kit-data.ts` -- Data model and file definitions
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/layout/TrackLayout.tsx` -- Layout wrapper with sidebar, content area, and pagination
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/layout/Header.tsx` -- Header with track switching and responsive menu
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/components/layout/Sidebar.tsx` -- Sidebar navigation with collapsible state
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/hooks/useTrack.ts` -- Track detection hook
