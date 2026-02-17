# Frontend Design Audit — Phew! AI Playbook

**Date:** 16 February 2026
**Auditor:** Claude Code (Impeccable frontend-design audit)
**Site:** https://ai-smb-playbook.vercel.app
**Scope:** Full application — layout, content components, interactive elements, theming, accessibility, performance, responsive design

---

## Anti-Patterns Verdict

**PASS — This does not look AI-generated.**

The design is restrained, professional, and intentional. Specific assessment against common AI tells:

| AI Tell | Status | Notes |
|---------|--------|-------|
| Gradient text | Not present | Clean solid typography throughout |
| Glassmorphism | Not present | Only functional `backdrop-blur` on sticky header |
| Hero metrics dashboard | Not present | Homepage is a clean two-card track selector |
| AI colour palette (teal/purple gradients) | Not present | Warm slate oklch palette with intentional blue-hue primary |
| Card grid of features | Not present | Two-card layout is minimal and purposeful |
| Generic fonts (system default) | Not present | Plus Jakarta Sans — a distinctive, quality choice |
| Bounce easing | Not present | Minimal animation throughout; only compaction overlay |
| Gray on colour | Not present | Proper semantic tokens with foreground/background pairing |
| Nested cards | Not present | Flat hierarchy — cards contain content, not other cards |
| Redundant copy | Not present | Headlines are concise; no "Unlock the power of..." language |

**Summary:** This is a well-crafted, professional documentation site. The design serves the content rather than decorating it. The creative themes (Retro Terminal, Synthwave, Minimal Ink) are genuinely distinctive — not just colour swaps. The semantic token system is mature and thorough.

---

## Executive Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 3 |
| Medium | 8 |
| Low | 6 |
| **Total** | **17** |

### Top 5 Issues

1. **[HIGH] Mobile menu lacks `aria-expanded`** — Screen reader users cannot determine if the mobile navigation is open or closed
2. **[HIGH] Range slider thumb too small for touch** — 16px thumb on simulator sliders is below the 44px minimum for touch targets
3. **[HIGH] Sidebar accessible names lack spacing** — "1.1Welcome & Orientation" reads as a single run-on string to screen readers
4. **[MEDIUM] Table header cells missing `scope` attribute** — Several data tables omit `scope="col"` on `<th>` elements
5. **[MEDIUM] Homepage whitespace imbalance** — Excessive empty space below the track cards, before the footer

### Overall Quality Score

**82 / 100** — Strong foundation with excellent theming and token architecture. Issues are concentrated in minor accessibility gaps and small responsive polish items. No structural problems.

### Recommended Next Steps

1. Fix the 3 high-severity accessibility issues (30 minutes)
2. Run `/frontend-design:harden` to address edge cases and text overflow
3. Run `/frontend-design:polish` for spacing/alignment refinements
4. Address medium-severity items in content review (Task iii overlap)

---

## Detailed Findings by Severity

### High-Severity Issues

#### H1 — Mobile menu button missing `aria-expanded`

- **Location:** `components/layout/Header.tsx:86-97`
- **Category:** Accessibility
- **Description:** The mobile hamburger menu button toggles `mobileMenuOpen` state and updates its `aria-label` between "Open menu" / "Close menu", but does not set `aria-expanded` to communicate the menu's state to assistive technology.
- **Impact:** Screen reader users cannot determine whether the navigation menu is currently expanded. NVDA/VoiceOver will announce "Open menu, button" but not the current state.
- **WCAG:** 4.1.2 Name, Role, Value (Level A)
- **Recommendation:** Add `aria-expanded={mobileMenuOpen}` to the mobile menu `<Button>`. Also add `aria-controls` pointing to the mobile nav's `id`.
- **Suggested command:** `/frontend-design:harden`

#### H2 — Range slider thumb below 44px touch target

- **Location:** `components/interactive/SimulatorControls.tsx:367-377`
- **Category:** Accessibility / Responsive
- **Description:** The custom range slider uses `[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4` (16px) for the thumb. On mobile, this is well below the 44×44px minimum recommended by WCAG 2.5.8 (Target Size). The sliders are used in the context window simulator, which is a key interactive feature.
- **Impact:** Touch users on mobile will struggle to grab and drag the slider thumb accurately. This is partially mitigated by the sliders being hidden in a collapsible on mobile (`sm:hidden`), but the collapsible can be opened.
- **WCAG:** 2.5.8 Target Size (Level AAA) / 2.5.5 Target Size (Level AAA in WCAG 2.1)
- **Recommendation:** Increase thumb to at least 24px (ideally 44px on mobile). Consider using the approach already used elsewhere: `min-h-[44px]` on mobile, smaller on desktop via `sm:min-h-0`.
- **Suggested command:** `/frontend-design:harden`

#### H3 — Sidebar accessible names lack spacing between number and title

- **Location:** `components/layout/Sidebar.tsx:207-213`
- **Category:** Accessibility
- **Description:** In the sidebar, section numbers and titles are rendered as separate `<span>` elements inside a parent `<span>`:
  ```html
  <span>
    <span class="...">1.1</span>
    Welcome & Orientation
  </span>
  ```
  The Playwright accessibility snapshot confirms the computed accessible name is "1.1Welcome & Orientation" — no space between the number and title.
- **Impact:** Screen readers will read "one point one welcome and orientation" as a run-on phrase. While understandable, it sounds unprofessional and could confuse users scanning quickly.
- **WCAG:** 1.3.1 Info and Relationships (Level A)
- **Recommendation:** Add a trailing space or `\u00a0` (non-breaking space) after the section number `<span>`, or use `aria-label` on the link to provide a properly spaced accessible name.
- **Suggested command:** `/frontend-design:harden`

---

### Medium-Severity Issues

#### M1 — Table headers missing `scope` attribute

- **Location:** `content/general/SessionManagementSection.tsx:94-99`, `content/developer/ClaudeMdSection.tsx:497-504`
- **Category:** Accessibility
- **Description:** Several data tables use `<th>` elements without `scope="col"` (or `scope="row"` where appropriate). The BrandVoiceSection storage table correctly uses `scope="col"` — this pattern should be applied consistently.
- **Impact:** Screen readers may not correctly associate data cells with their headers in complex tables.
- **WCAG:** 1.3.1 Info and Relationships (Level A)
- **Recommendation:** Add `scope="col"` to all `<th>` elements in `<thead>` rows. For row headers (if any), use `scope="row"`.
- **Suggested command:** `/frontend-design:harden`

#### M2 — Collapsible triggers don't communicate expanded state to screen readers

- **Location:** Multiple files — `SessionManagementSection.tsx`, `BrandVoiceSection.tsx`, `SimulatorControls.tsx`
- **Category:** Accessibility
- **Description:** Several `CollapsibleTrigger` buttons render a `ChevronDown` icon that rotates on open, but rely on shadcn/ui's Radix implementation to provide `aria-expanded`. However, custom implementations (e.g., `SimulatorControls.tsx:99-130`) wrap a `Collapsible` with a `Button` that may not automatically receive `aria-expanded` depending on the composition.
- **Impact:** Users relying on assistive technology may not know whether a collapsible section is open or closed.
- **WCAG:** 4.1.2 Name, Role, Value (Level A)
- **Recommendation:** Verify all `CollapsibleTrigger` buttons have `aria-expanded` in the rendered DOM. For custom toggle buttons, manually add `aria-expanded`.
- **Suggested command:** `/frontend-design:harden`

#### M3 — Homepage vertical whitespace imbalance

- **Location:** `components/layout/HomePage.tsx:20`
- **Category:** Responsive / Visual
- **Description:** On desktop, there's significant empty space between the meta-narrative note and the footer. The `py-12 sm:py-16` padding on the hero combined with the `max-w-3xl` container creates a layout where the content floats in the upper portion with a large void below.
- **Impact:** On tall desktop viewports, the page feels unfinished or empty. Users might think content failed to load.
- **Recommendation:** Consider `min-h-[calc(100vh-3.5rem)]` on the main content area to push the footer down without excessive padding, or add a subtle background pattern/gradient to the empty space. Alternatively, the upcoming ROI section (Task iv) could fill this space.
- **Suggested command:** `/frontend-design:polish`

#### M4 — CopyButton hidden on desktop until hover

- **Location:** `components/content/PromptExample.tsx:49`
- **Category:** Accessibility / UX
- **Description:** The CopyButton on prompt examples uses `sm:opacity-0 transition-opacity sm:group-hover:opacity-100`, making it invisible on desktop until the user hovers over the prompt card. Keyboard-only users can tab to it and it gains focus, but the visual indicator only appears on hover.
- **Impact:** Desktop keyboard users will not see the copy button unless they happen to hover. The button does receive focus-visible styles when tabbed to, but its initial invisibility may cause users to miss it entirely.
- **WCAG:** 2.4.7 Focus Visible (Level AA)
- **Recommendation:** Add `focus-within:opacity-100` to the group container so the button becomes visible when any element inside receives focus. Alternatively, show the button at reduced opacity (e.g., `sm:opacity-30`) rather than fully hidden.
- **Suggested command:** `/frontend-design:harden`

#### M5 — CodeBlock CopyButton also hidden until hover (no header variant)

- **Location:** `components/content/CodeBlock.tsx:58-63`
- **Category:** Accessibility / UX
- **Description:** When a CodeBlock has no title and language is "text", the CopyButton uses `opacity-0 transition-opacity group-hover:opacity-100` — fully hidden until hover with no mobile exception (unlike PromptExample which shows on mobile).
- **Impact:** On desktop, keyboard users won't see the button. On mobile (no hover), the button is permanently invisible for these code blocks.
- **WCAG:** 2.4.7 Focus Visible (Level AA)
- **Recommendation:** Apply the same `sm:opacity-0` pattern used in PromptExample (visible on mobile, hover-reveal on desktop). Add `group-focus-within:opacity-100` for keyboard users.
- **Suggested command:** `/frontend-design:harden`

#### M6 — Feedback widget floating button overlaps content on mobile

- **Location:** `components/layout/FeedbackWidget.tsx:104-111`
- **Category:** Responsive
- **Description:** The floating feedback button (`fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full`) is positioned in the bottom-right corner on mobile (`md:hidden`). On the Sessions page, this overlaps with the "Next" pagination link and footer content when scrolled to the bottom.
- **Impact:** Users may accidentally tap the feedback button when trying to navigate to the next section. Content behind the button is obscured.
- **Recommendation:** Either increase `bottom` offset, add a safe area/padding to the pagination nav on mobile, or use a different pattern (e.g., slide-in from edge, or integrate into the mobile header).
- **Suggested command:** `/frontend-design:polish`

#### M7 — No 404 page — catch-all redirect silently goes to homepage

- **Location:** `routes/router.tsx:36-38`
- **Category:** UX
- **Description:** Invalid routes redirect to `/` via `<Navigate to="/" replace />`. While this prevents broken pages, users who mistype a URL or follow a stale link get silently redirected with no feedback about what happened.
- **Impact:** Users may not realise they've been redirected and could be confused about why they're on the homepage instead of the page they expected.
- **Recommendation:** Create a lightweight 404 page that explains the page wasn't found and offers navigation to both tracks. The redirect is fine for truly malformed routes, but `/general/nonexistent-section` should show a "section not found" message (which `SectionPage` already handles for missing sections — good).
- **Suggested command:** `/frontend-design:harden`

#### M8 — Google Fonts for creative themes loaded without `font-display: swap`

- **Location:** Not directly visible in code — likely loaded via `<link>` in `index.html` or via CSS `@import`
- **Category:** Performance
- **Description:** Creative themes reference Google Fonts (JetBrains Mono, VT323, Space Grotesk, Fraunces, Inter, Atkinson Hyperlegible Next, OpenDyslexic). If these are loaded eagerly on all pages, they add latency for users who never activate creative themes.
- **Impact:** Potential FOIT (Flash of Invisible Text) or increased initial page load time.
- **Recommendation:** Verify fonts are loaded with `font-display: swap` and consider lazy-loading creative theme fonts only when a theme is activated. Accessibility fonts (Atkinson, OpenDyslexic) should load on activation of the dyslexia mode, not at page load.
- **Suggested command:** `/frontend-design:optimize`

---

### Low-Severity Issues

#### L1 — Footer "Send Feedback" button missing explicit `type="button"`

- **Location:** `components/layout/Footer.tsx:27-33`
- **Category:** Accessibility
- **Description:** The plain `<button>` element in the footer lacks `type="button"`. While browsers default to `type="submit"` only within forms, explicit typing is a best practice.
- **Impact:** Negligible — there's no parent form. But explicit typing prevents edge cases in future refactors.
- **Recommendation:** Add `type="button"` to the footer feedback button.

#### L2 — Skip link target `#main-content` works but could be more specific

- **Location:** `components/layout/AppLayout.tsx:11`
- **Category:** Accessibility
- **Description:** The skip link targets `#main-content`, which is correctly placed on the `<main>` element in both `HomePage` and `TrackLayout`. This is correct and functional.
- **Impact:** None currently. Just noting this works as expected.

#### L3 — Pagination links have small touch targets

- **Location:** `components/layout/TrackLayout.tsx:134-168`
- **Category:** Responsive
- **Description:** Previous/Next pagination links use `px-3 py-2` padding. The "Previous" label area might be small on mobile, though the entire link (including the title) is clickable.
- **Impact:** Minor — the full link area is reasonably sized. But the clickable area could be more generous on mobile.
- **Recommendation:** Consider adding `min-h-[44px]` to pagination links for mobile.

#### L4 — `localStorage` access without try/catch

- **Location:** `components/layout/TrackLayout.tsx:27-29`
- **Category:** Performance / Resilience
- **Description:** `localStorage.getItem('sidebar-collapsed')` is called during state initialisation without a try/catch. In private browsing mode or when storage is full, this could throw.
- **Impact:** Very low — modern browsers rarely throw on `getItem`. But a try/catch is defensive best practice.
- **Recommendation:** Wrap in try/catch with a fallback default.

#### L5 — Accordion items don't preserve open state across navigation

- **Location:** Multiple content sections
- **Category:** UX
- **Description:** When users navigate away from a section and return, all accordions reset to closed. This is standard React behaviour (component unmounts), but for reference content that users browse repeatedly, it can be frustrating.
- **Impact:** Minor UX friction. Users may need to re-open the same accordion items repeatedly.
- **Recommendation:** Consider using URL hash fragments or localStorage to persist accordion state for frequently accessed sections. Low priority — only address if user feedback indicates this is a pain point.

#### L6 — Theme preview swatches use hardcoded oklch values

- **Location:** `components/layout/ThemeSettings.tsx:39-43`
- **Category:** Theming
- **Description:** The default theme preview swatches use hardcoded oklch strings rather than referencing CSS custom properties. These are display values only (rendered as small colour circles in the theme picker), so they don't affect the actual theme.
- **Impact:** If the default theme colours change, these swatches would need manual updating.
- **Recommendation:** Minor — consider deriving from CSS custom properties if feasible, but the current approach is fine for a small set of preview swatches.

---

## Patterns & Systemic Issues

### What's consistent and good

- **Semantic tokens are universally applied.** Zero hardcoded palette classes across all 17 component files. The migration was thorough.
- **Touch targets are mostly correct.** CopyButton has `min-h-[44px] min-w-[44px]`. Simulator buttons use `min-h-[44px] sm:min-h-0`. This pattern should be applied to the range slider thumb (H2) and pagination links (L3).
- **ARIA labels are present on all icon-only buttons.** Header, sidebar, theme settings, feedback widget — all correctly labelled.
- **Lazy loading is properly implemented.** All content sections use `React.lazy()` with Suspense boundaries and skeleton fallbacks.

### Patterns to standardise

1. **Table accessibility:** BrandVoiceSection uses `scope="col"` and `role="table"` — this should be the standard for all tables. Currently inconsistent.
2. **CopyButton visibility:** Three different patterns exist: (a) always visible (CodeBlock with header), (b) hidden until hover with mobile exception (PromptExample), (c) hidden until hover with no mobile exception (CodeBlock without header). Standardise on pattern (b).
3. **`aria-expanded` on toggles:** Radix primitives (Accordion, Collapsible, Dialog) handle this automatically, but custom toggle buttons (mobile menu, sidebar collapse) need manual implementation.

---

## Positive Findings

### Exceptional implementations to maintain

1. **Three-layer CSS token cascade** — `base → creative themes → a11y` is a genuinely sophisticated architecture. Accessibility modes correctly override creative themes for typography while preserving colour schemes. This is better than most production design systems.

2. **Creative themes are distinctive** — Retro Terminal (monochromatic green phosphor, scanlines, VT323 font), Synthwave (neon glow, deep purple), and Minimal Ink (high-contrast monochrome with warm red accent) are genuinely creative. They're not just colour palette swaps — they change fonts, border-radius, shadows, and visual effects.

3. **Context Window Simulator** — The interactive simulator is the standout feature. Track-aware (general vs developer), with presets, add-turn simulation, compaction animation, degradation stages, and proper ARIA live regions. The `useReducedMotion` hook integration is exemplary.

4. **Content architecture** — The section registry pattern with lazy loading, the two-track content filtering, and the sidebar with group headers and track-switching notes is well-designed. Adding new sections is genuinely just "create component + add to registry".

5. **Responsive tables** — SessionManagementSection implements platform comparisons as stacked cards on mobile and a table on desktop (`sm:hidden` / `hidden sm:block`). This should be the pattern for all data tables.

6. **Accessibility foundations** — Skip link, focus-visible styles, reduced-motion support, forced-colors support, high-contrast mode, dyslexia-friendly mode with font choice. This is more accessibility infrastructure than most production apps have.

7. **`siteConfig` centralisation** — All client-specific shell values in one file. The reusability audit correctly identifies the Tier 2–4 items remaining.

8. **UK English throughout** — Every piece of user-facing copy uses UK English consistently (colour, organise, behaviour, practise/practice correctly).

---

## Recommendations by Priority

### Immediate (before next deployment)

1. **Fix H1** — Add `aria-expanded` to mobile menu button (5 minutes)
2. **Fix H3** — Add space between section number and title in sidebar (5 minutes)
3. **Fix M5** — Make CodeBlock CopyButton visible on mobile and on keyboard focus (10 minutes)

### Short-term (this session or next)

4. **Fix H2** — Increase range slider thumb size on mobile (15 minutes)
5. **Fix M1** — Add `scope="col"` to all table headers (15 minutes)
6. **Fix M4** — Add `group-focus-within:opacity-100` to PromptExample CopyButton (5 minutes)
7. **Fix M2** — Verify `aria-expanded` on all collapsible triggers (15 minutes)

### Medium-term (next sprint / content review)

8. **Fix M3** — Address homepage whitespace (may be resolved by ROI section addition)
9. **Fix M6** — Reposition or redesign mobile feedback button
10. **Fix M8** — Lazy-load creative theme fonts
11. **Fix M7** — Consider a proper 404 page

### Long-term (nice-to-haves)

12. **Fix L3** — Increase pagination touch targets
13. **Fix L4** — Add localStorage try/catch
14. **Fix L5** — Persist accordion state (only if user feedback warrants)

---

## Suggested Commands for Fixes

| Command | Issues Addressed | Count |
|---------|-----------------|-------|
| `/frontend-design:harden` | H1, H2, H3, M1, M2, M4, M5, M7 | 8 |
| `/frontend-design:polish` | M3, M6, L3, L6 | 4 |
| `/frontend-design:optimize` | M8 | 1 |
| Manual fixes | L1, L4, L5 | 3 |
| Task iii overlap | Content readability items | — |

**Primary recommendation:** Run `/frontend-design:harden` first — it addresses 8 of the 17 issues, including all 3 high-severity items.

---

## Content Issues (Task iii Preview)

The following content-related observations were made during the design audit. These will be addressed systematically in Task iii (Content Review) but are noted here for completeness:

1. **Prompt copy architecture is correct** — The `PromptExample` component properly separates `description` (displayed above) from `prompt` (the copyable content). The `whenToUse` field is also displayed separately. No description text leaks into the clipboard copy.

2. **Prompt width handling is correct** — The `<pre>` elements inside `PromptExample` use `whitespace-pre-wrap` which wraps long lines. This appears to work correctly on both mobile and desktop viewports based on screenshots.

3. **Sidebar text needs page-by-page content verification** — The overall structure is sound, but individual section content should be reviewed for spacing, readability, and completeness (Task iii scope).

---

## Technical Notes

- **Build:** `bun run build` passes (TypeScript + Vite)
- **Lint:** 0 errors
- **Format:** Clean (Prettier)
- **Hardcoded colours:** 0 in `.tsx`/`.ts` files (confirmed by semantic token migration)
- **Theme layers:** 8 (light, dark, retro-terminal, synthwave, minimal-ink light/dark, high-contrast light/dark)
- **Status token families:** 5 (success, warning, info, important, danger) × 4 variants each
- **Segment tokens:** 8 (for context simulator)
