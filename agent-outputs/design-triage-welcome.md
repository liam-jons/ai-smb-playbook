# Design Triage: Welcome & Orientation

> **Page:** Welcome & Orientation
> **Route:** `/general/welcome`
> **Component:** `app/src/content/shared/WelcomeSection.tsx`
> **Triaged:** 17 February 2026

## Verdict

**Cross-page fixes are sufficient.** This is one of the strongest pages in the application. The content is well-structured, the tone is appropriate, the meta-narrative context is restrained (one section, clearly labelled), and there are no interactive tools that need the "tools feel distinct" treatment. The page-specific issues below are all Nice-to-Have polish items. No full critique is needed.

## Known Cross-Page Issues Present

- [x] **C1 Routing bug** -- PRESENT. The page is rendered inside `TrackLayout.tsx`, which contains the viewport-resize routing bug (lines 62-72). Resizing the browser across the `lg` breakpoint could cause unexpected navigation. This is a shared component issue, not page-specific.
- [x] **I4 Dark mode card contrast** -- PRESENT (minor). `bg-card` is used for the Quick Wins cards (line 339) and the Quick Reference Card container (line 386). In dark mode, `bg-card` (`oklch(0.21)`) has only a 0.05 lightness delta from `bg-background` (`oklch(0.16)`). However, both elements also have `border-border`, which provides adequate visual separation. This page is less affected than Starter Kit or Home because the cards are simple, single-column, bordered containers rather than complex interactive surfaces.
- [ ] **I17 CalloutCard role="alert"** -- NOT PRESENT. This page does not use `CalloutCard`. No `role="alert"` elements exist.
- [x] **I1 Content area narrow at 1440px** -- PRESENT. The page is constrained by `TrackLayout.tsx` line 139 (`max-w-[75ch]`). At 1440px with the sidebar expanded (`w-72`), the content occupies roughly 600px of the ~864px available content area. The Welcome page is entirely prose and simple card lists, so the narrowness is less problematic here than on pages with interactive tools, tables, or code blocks. Still, the starter kit callout and Quick Wins cards feel slightly cramped.
- [x] **N31 Pagination nav width mismatch** -- PRESENT. `TrackLayout.tsx` line 139 uses `max-w-[75ch]` for content but line 150 uses `max-w-[65ch]` for the pagination nav. This creates a visible width discrepancy between the content area and the Previous/Next navigation bar. Affects this page (it has a "Next" link to How Context Works).
- [ ] **N56 Feedback FAB overlap** -- NOT PRESENT (at this page's content length). The FAB is positioned at `fixed bottom-20 right-6` (`FeedbackWidget.tsx` line 106). On mobile at 375px, the page is long enough that the FAB does not overlap the pagination or the inline "Send Feedback" button. However, if the page were shorter or the viewport taller, the FAB could overlap the bottom Feedback section. Not a concern in practice on this specific page.

## Page-Specific Findings

### Critical

None.

### Important

None.

### Nice-to-Have

| # | Issue | Details | Location |
|---|-------|---------|----------|
| W1 | **Reduced motion check is non-reactive.** The component reads `window.matchMedia('(prefers-reduced-motion: reduce)')` at render time (line 181-183), not via a `useEffect` listener. If a user toggles their OS reduced-motion setting while the page is open, the animations will not update until the component re-mounts. This is a minor a11y gap -- most users do not toggle this setting mid-session. | Consider using a `useReducedMotion()` hook with a `matchMedia` change listener for reactivity. | `WelcomeSection.tsx:181-183` |
| W2 | **Print/PDF function may be blocked by popup blockers.** `handlePrint` uses `window.open()` (line 193) to create a new window for printing. Modern browsers may block this as a popup, especially if the click handler involves any async work. The function does have a null check (line 194/202), but there is no user-facing error message if the popup is blocked. | Consider adding a toast/alert when `printWindow` is null, informing the user to allow popups, or using a Blob download approach instead. | `WelcomeSection.tsx:188-205` |
| W3 | **"Download Quick Reference (PDF)" button label is slightly misleading.** The function does not produce a PDF -- it opens an HTML document in a new window and triggers the browser's print dialog. The user must then choose "Save as PDF" from the print dialog. A more accurate label would be "Print Quick Reference" or "Print / Save as PDF". | Update button label. | `WelcomeSection.tsx:383` |
| W4 | **Starter Kit callout link has no border in dark mode on focus.** The callout link (lines 298-320) uses `border-primary/20` which is very faint in dark mode. The `hover:bg-primary/10` state works well, but the resting state could benefit from a slightly stronger border. | Increase border opacity to `border-primary/30` or `border-primary/25`. | `WelcomeSection.tsx:300` |
| W5 | **Quick Reference Card bullet points use tiny 4px dots.** The `h-1 w-1` dots (line 400) are very small, especially at the `text-sm` body size. They could be missed, making the list read as unpunctuated lines. | Consider `h-1.5 w-1.5` for better visibility, or use standard list markers. | `WelcomeSection.tsx:399-402` |
| W6 | **No entrance animation on Quick Wins or Quick Reference sections.** Only the Hero and How to Use sections have `motion` props. The remaining 4 sections (Starter Kit callout, Quick Wins, Quick Reference Card, How This Was Built) load without any entrance animation. | Apply staggered `fadeInUp` or `fadeIn` to remaining sections for consistency. | `WelcomeSection.tsx:298-484` |

## Content Quality

- **Meta-narrative context:** APPROPRIATE. The "How This Playbook Was Built" section (lines 416-451) contains exactly one meta-narrative reference, clearly scoped to a single section with its own heading. It explains that the playbook was built with the same tools it describes, and links to the process document. This is the ONE page where meta-narrative is acceptable per the triage instructions, and it is handled with restraint -- one section, factual, not self-congratulatory.
- **Third-person language:** NOT PRESENT. The copy consistently uses second-person ("your team", "you can do right now", "you do not need to read this front-to-back"). Tone is practical and direct. No instances of third-person detachment ("the user should...", "one can...").
- **Editorial notes:** NOT PRESENT. No TODO, FIXME, placeholder, or editorial markers found in the component.
- **Client-specific content:** All client-specific values are correctly parameterised through `siteConfig`:
  - `siteConfig.trainingDate` (line 223) -- "11 February 2026"
  - `siteConfig.consultantName` (line 469) -- "Liam"
  - `siteConfig.appTitle` (lines 141, 154) -- used in print document only
  - `siteConfig.trainingDate` (line 155) -- used in print document subtitle
  - No hardcoded references to "Phew", "Ghost Inspector", "ASP.NET", or other client-specific terms in the component source.

## Architecture Notes

- The component is registered in `content/shared/registry.ts` as a lazy-loaded import, consistent with all other section components.
- It is listed in `sections.ts` as section `1.1` with `track: 'both'`, meaning it appears in both General and Developer track sidebars.
- The Quick Wins links and Quick Reference items are track-aware (filtered by `track` prop), correctly showing developer-specific items only on the developer track.
- The page is wrapped by `SectionPage.tsx`, which adds the section header (badge, title, subtitle, separator) above the component's own content.

## Screenshots

Screenshots were taken at both 1440px (desktop, light mode) and 375px (mobile, light mode) viewports, plus dark mode at 1440px. The screenshots were rendered inline by the Playwright MCP tool during the triage session. Key observations from visual inspection:

- **1440px light:** Content renders cleanly within the `max-w-[75ch]` constraint. The sidebar is visible and the page hierarchy is clear. The Quick Wins cards and Quick Reference Card are well-spaced. The pagination nav at the bottom is visibly narrower than the content area (the `65ch` vs `75ch` mismatch).
- **375px light:** The mobile layout stacks correctly. The "Sections" mobile menu trigger is visible. The Quick Wins cards fill the available width. The "Download Quick Reference (PDF)" button text wraps to two lines, which is acceptable. The feedback FAB is visible but does not overlap content.
- **1440px dark:** Cards are distinguishable from the background thanks to their borders, though the `bg-card` fill is subtle. The primary-tinted Starter Kit callout banner renders well in dark mode. Overall dark mode presentation is solid for this page.
