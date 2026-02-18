# Homepage Critique Refinements — Session Continuation Prompt

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. The app is deployed as a multi-tenant SPA — each client gets a subdomain and a JSON config file. A single build serves all clients. Two outputs per client deployment:
1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, commands, templates, governance policy

**Read first:** `CLAUDE.md` at the project root — conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### Sessions 17–20: Multi-tenant architecture — Complete
Full multi-tenant system: client config schema, JSON loading, overlay consumption (brand voice, recurring tasks, ROI), section visibility gating, starter kit tier display. Generic default config with neutral values.

### Session 28: Client logo support + Homepage cover page redesign — Complete
Added 4 optional logo fields to `ClientConfig` schema. Created `<ClientLogo>` and `<ProviderLogo>` components with dark mode asset switching. Transformed the homepage into a centre-aligned three-zone cover page (provider brand → document title → client brand). Header nav links centred via `flex-1` equal-width siblings.

### Session 31: Homepage polish + Dark mode logo fallback — Complete
- **Dark mode logo container:** `<ClientLogo>` now wraps the logo in a subtle white container (`bg-white/95`, `rounded-lg`, `px-5 py-3`, `border border-white/20`) when `isDark && !clientLogoDarkUrl`. No container in light mode or when a dark variant is provided. Verified working correctly.
- **Track card compaction:** Removed section preview lists from cards. Cards reduced from 382px to 230px tall. Section count badge retained. Removed `CardContent` — CTA moved into `CardHeader`. Cards now end at 702px, 98px above the fold at 1280x800.
- **Heading size:** Increased from `clamp(1.5rem, 3.5vw, 2rem)` to `clamp(1.5rem, 4vw, 2.25rem)` for stronger cover-page presence (36px at 1280px).
- **Description text:** Upgraded to `text-base sm:text-lg` for better readability on desktop.
- **Spacing:** Tighter top padding (`pt-6 sm:pt-8`), more hero-to-cards separation (`mb-6 sm:mb-8`), tighter card grid gap (`gap-4 sm:gap-5`).
- **Professional design critique** conducted via `/frontend-design:critique` — identified priority and nice-to-have improvements listed below.

### Key files modified in session 31:
| File | Change |
|------|--------|
| `app/src/components/content/ClientLogo.tsx` | Dark mode container fallback logic |
| `app/src/components/layout/HomePage.tsx` | Card compaction, spacing refinements, heading size increase |

### Build Status (Session 31)
- `cd app && bun run build` — pass
- `cd app && bun run lint` — pass
- `cd app && bun run format:check` — pass

---

## What This Session Does: Homepage Critique Refinements

A comprehensive design critique was performed in session 31, evaluating the homepage against the project's design principles (clarity over cleverness, hierarchy through restraint, respect the audience) and reference aesthetics (Stripe Docs, Linear). This session implements all identified improvements — priority issues, nice-to-haves, and minor observations.

**Execution strategy:** Many of these tasks are independent and can be parallelised using sub-agents. Tasks are grouped below with dependency notes.

---

## Task 1: Fix h1 text orphan with `text-wrap: balance` (Priority — Quick fix)

**Problem:** At 1280x800, the h1 "Your practical guide to working with Claude AI" breaks so that "AI" sits alone on the final line. This is typographically poor — a two-letter orphan on the hero element.

**Fix:** Add `text-wrap: balance` to the h1 element. This is supported in Chrome 114+, Firefox 121+, Safari 17.5+ and achieves balanced line lengths automatically.

**File:** `app/src/components/layout/HomePage.tsx` (line 51)

**Implementation:** Add `text-balance` to the h1 className (Tailwind v4 supports this utility), or use inline `style={{ textWrap: 'balance' }}` alongside the existing fontSize clamp.

**Dependencies:** None — can run in parallel with other tasks.

---

## Task 2: Relocate provider logo below the title (Priority — Layout change)

**Problem:** The "AI Solution Hub" provider logo is currently the first element the eye hits (Zone 1, above the heading). On a client report, the consultant's branding is typically secondary — the document title should lead. The current placement also forces the provider logo to compete with the heading for visual authority.

**Decision:** Move the provider logo below the "Prepared by" credit line and above the divider, making it part of the attribution zone rather than the masthead. The heading becomes the first prominent element, creating a more direct, content-first hierarchy.

**New zone order:**
1. **Document title** — h1 heading (now the first and most prominent element)
2. **Attribution** — "Prepared by {consultant} · {date}" + AI Solution Hub logo (smaller, credit-style)
3. **Client branding** — Divider + "Prepared for" + client logo (unchanged)
4. **Description + CTA** — Description text + track cards

**File:** `app/src/components/layout/HomePage.tsx`

**Implementation notes:**
- Move `<ProviderLogo>` from above the h1 to below the "Prepared by" line
- Reduce its max-width slightly (e.g., `max-w-[140px] sm:max-w-[170px]`) since it's now in a secondary position
- Add a small `mt-2` gap between the credit line and the logo
- The "Prepared by" text and logo together form an attribution block — consider grouping them visually

**Dependencies:** None — can run in parallel. Affects the same file as Tasks 1, 5, 6, 7, and 8, so coordinate or sequence with those tasks.

---

## Task 3: Improve provider logo SVG quality (Priority — Asset fix)

**Problem:** The AISH logo SVGs use `system-ui` font with `font-weight: 600` and `letter-spacing: 0.25em`. The target client (Phew Design Limited) is a design agency — they will notice a system-font placeholder. The critique flagged this as communicating "placeholder" rather than "brand mark."

**Fix:** Update the SVG text to use `Plus Jakarta Sans` (the project's own typeface) instead of `system-ui`. This is a font that's already loaded by the app, so the SVG text will render consistently.

**Files:**
- `app/public/branding/aish-logo-light.svg`
- `app/public/branding/aish-logo-dark.svg`

**Implementation notes:**
- Replace `font-family: system-ui, sans-serif` with `font-family: 'Plus Jakarta Sans', system-ui, sans-serif` in both SVGs
- The font won't embed in the SVG (it relies on the page having loaded it), but since these logos only render within the app, this is fine
- Verify the text still centres correctly within the viewBox after the font change — `Plus Jakarta Sans` may have different metrics than `system-ui`
- Compare against the reference raster at `docs/design/aish-logo-light-no-icon.png`

**Dependencies:** None — can run in parallel with all other tasks.

---

## Task 4: Make General Users card visually dominant (Priority — UX improvement)

**Problem:** Both track cards are structurally identical — same layout, same size, same weight. This creates the "identical card grid" anti-pattern and decision paralysis. Since the playbook targets "all staff" at the client, and only a subset are developers, the General Users card should be the obvious default choice.

**Approach:** Make the General Users card visually dominant while keeping the Developer card available but secondary. This is a UX research + implementation task.

**Options to explore:**
1. **Asymmetric sizing** — General Users card takes more horizontal space (e.g., `md:col-span-2` full width, Developer card below at half width or in a secondary row)
2. **Visual weight** — General Users card gets a subtle filled background tint (e.g., `bg-blue-50 dark:bg-blue-950/30`), larger heading, or a "Recommended" indicator. Developer card remains outline-only.
3. **Primary/secondary pattern** — General Users is a full-width card, Developer is a compact inline link or smaller card below it
4. **"Are you a developer?" toggle** — See Task 5 for this approach

**Constraint:** Whatever treatment is chosen, both tracks must remain accessible and clearly labelled. The Developer card should not feel hidden or second-class — just secondary.

**File:** `app/src/components/layout/HomePage.tsx`

**Dependencies:** Depends on the outcome of Task 5 (developer toggle exploration). If a toggle is chosen, this task changes significantly. Consider exploring Task 5 first, then implementing whichever approach is selected.

---

## Task 5: Explore "Are you a developer?" track selection UX (Priority — UX research)

**Problem:** The critique posed an interesting question: instead of two equal-weight cards, could the track selection be simplified to a single confident question — "Are you a developer?" — with the majority track (General Users) as the default.

**This task is research, not implementation.** Explore the best approach from a UI/UX perspective:

**Options to evaluate:**

1. **Toggle/switch pattern** — A prominent question "Are you a developer?" with a yes/no toggle. "No" (default) routes to General Users, "Yes" reveals the Developer track. Clean, decisive, eliminates decision paralysis.

2. **Default + opt-in** — The General Users card is the primary, full-width CTA ("Get started"). Below it, a secondary text link: "Are you a developer? Explore the technical track →". This makes the default path obvious while keeping the developer option discoverable.

3. **Segmented control** — A pill-style segmented control ("Everyone" | "Developers") at the top of the track section. Selecting a segment reveals the corresponding card or directly navigates. Compact, familiar mobile pattern.

4. **Keep two cards but differentiate** — Stick with the card pattern but apply Task 4's visual dominance treatment. Less radical, lower risk.

**Evaluation criteria:**
- Clarity — does a first-time user immediately know what to do?
- Speed — how quickly can someone get into their track?
- Discoverability — can developers easily find their track?
- Mobile experience — does it work well at 375px?
- Consistency — does it fit with the cover-page aesthetic?
- Implementation complexity — how much rework is needed?

**Recommendation:** After researching these options, propose the best approach with mockup/description. The user has expressed interest in understanding the best UX approach here, so provide a clear recommendation with rationale.

**Dependencies:** This should be completed before Task 4, as the outcome affects the card implementation.

---

## Task 6: Strengthen the "Prepared for" client zone (Nice-to-have)

**Problem:** The border-top divider is too subtle and the "PREPARED FOR" label is nearly invisible at `text-xs` with `text-muted-foreground/70`.

**Fix:**
- Increase label from `text-xs` to `text-sm`
- Raise opacity from `text-muted-foreground/70` to `text-muted-foreground`
- Shorten the divider to a more intentional width: replace `w-full max-w-xs` with `w-24` or `w-32` (a centred rule, not a full-width separator)

**File:** `app/src/components/layout/HomePage.tsx` (lines 63–69)

**Dependencies:** None — can run in parallel.

---

## Task 7: Break the centre-alignment monotony (Nice-to-have)

**Problem:** Every element on the page is centre-aligned, creating a static, template-like feel. The design guidelines say: "Do not centre everything — left-aligned text with asymmetric layouts feels more designed."

**Approach:** Keep the masthead/title/client zones centred (appropriate for a cover page), but introduce more spacing contrast between zones:

- **Tighter grouping** within the provider/title/client zone (they are one conceptual unit)
- **More generous gap** before the track cards (the action zone)
- Consider whether the description text and/or track cards should be left-aligned on desktop while the hero remains centred — this creates a natural transition from "cover page top" to "navigational bottom"

**File:** `app/src/components/layout/HomePage.tsx`

**Dependencies:** Should be done after Tasks 2 and 4/5, as the layout structure may change.

---

## Task 8: Tint section count badges to match card accent colours (Minor)

**Problem:** The `Badge variant="secondary"` gives both badges a neutral grey background that doesn't associate with their respective card colours.

**Fix:**
- General Users badge: light blue tint (e.g., `bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300`)
- Developers badge: light violet tint (e.g., `bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300`)
- Replace `variant="secondary"` with custom className styling

**File:** `app/src/components/layout/HomePage.tsx`

**Dependencies:** None — can run in parallel.

---

## Task 9: Strengthen "Explore track" CTA within cards (Minor)

**Problem:** The "Explore track" link text is `text-sm` — the same size as the card description. It doesn't create a clear CTA hierarchy.

**Fix:** Add `font-semibold` to the CTA span to create more visual weight. The colour differentiation (blue/violet) already helps, but the weight will reinforce the call to action.

**File:** `app/src/components/layout/HomePage.tsx` (lines 120 and 152)

**Dependencies:** None — can run in parallel.

---

## Task 10: Fix feedback FAB overlap on mobile (Minor)

**Problem:** At 375x812, the floating feedback button (bottom-right) partially overlaps the Developer card's section count badge.

**Investigation needed:** Find the feedback widget component and adjust its positioning or z-index for mobile viewports. May need a `bottom` offset or different placement on small screens.

**Files:** Likely `app/src/components/layout/FeedbackWidget.tsx` (or wherever the floating button is defined)

**Dependencies:** None — can run in parallel.

---

## Task 11: Handle large viewport empty space (Minor)

**Problem:** At 1920x1080, the cards end at ~560px from the top, leaving ~450px of empty space before the footer. The content floats in the upper third.

**Options:**
1. Vertically centre the entire homepage content within the viewport using `min-h-[calc(100vh-57px)]` (minus header) with `items-center` on the main flex container
2. Add more generous top padding that scales with viewport height
3. Accept the top-aligned layout as consistent with the "document cover page" metaphor (documents start from the top)

**Note:** Option 3 may be the right choice — real document covers don't vertically centre content. But assess visually.

**File:** `app/src/components/layout/HomePage.tsx`

**Dependencies:** Should be done after Tasks 2, 4/5, and 7, as layout changes may affect this.

---

## Task 12: Tighten h1 line-height on mobile (Minor)

**Problem:** On mobile (375px), the h1 breaks into 3+ lines, making the heading block quite tall relative to the small screen.

**Fix:** Consider adding `leading-tight` to the h1 className — this reduces line-height to 1.25 (from the default ~1.5), keeping the heading block more compact on mobile where it wraps to more lines.

**File:** `app/src/components/layout/HomePage.tsx` (line 51)

**Dependencies:** None — can run in parallel with Task 1.

---

## Parallelisation Strategy

These tasks can be grouped into parallel waves:

**Wave 1 — Independent quick fixes (all parallel):**
- Task 1: h1 text-wrap balance
- Task 3: Provider logo SVG font
- Task 6: "Prepared for" label visibility
- Task 8: Badge colour tints
- Task 9: CTA font weight
- Task 10: Feedback FAB mobile fix
- Task 12: h1 mobile line-height

**Wave 2 — Research (parallel with Wave 1):**
- Task 5: Developer toggle UX research

**Wave 3 — Layout changes (after Wave 2 decision):**
- Task 2: Provider logo relocation
- Task 4: General Users card dominance (informed by Task 5)
- Task 7: Centre-alignment refinement

**Wave 4 — Final polish (after Wave 3):**
- Task 11: Large viewport spacing

---

## Design Reference Files

| File | Purpose |
|------|---------|
| `docs/design/client-report.html` | HTML report with cover page aesthetic reference |
| `docs/design/Screenshot 2026-02-18 at 15.43.45.png` | Report cover page screenshot — "Prepared for" + AMD logo treatment |
| `docs/design/aish-logo-light-no-icon.png` | Original AISH raster logo — reference for SVG quality |
| `docs/reference/frontend-skills-review.md` | Design guidelines — typography, colour, spacing, motion standards |

## Key Reference Files

| File | Purpose |
|------|--------|
| `app/src/components/layout/HomePage.tsx` | Homepage — primary file for most tasks |
| `app/src/components/content/ClientLogo.tsx` | Client logo with dark mode container fallback |
| `app/src/components/content/ProviderLogo.tsx` | AISH provider logo component |
| `app/src/components/layout/Header.tsx` | Header with centred nav links |
| `app/src/hooks/useTheme.ts` | Theme hook — `resolvedTheme` for dark mode detection |
| `app/src/hooks/useClientConfig.ts` | Config hooks — `useSiteConfig()` |
| `app/public/branding/aish-logo-light.svg` | AISH logo light variant |
| `app/public/branding/aish-logo-dark.svg` | AISH logo dark variant |
| `app/public/clients/phew.json` | Phew client config |

---

## Key Conventions Reminder

- **UK English throughout.** All content, copy, and code comments use UK English spelling and grammar.
- **Build check after changes:** `cd app && bun run build` (TypeScript + Vite build). Also `bun run lint` and `bun run format:check`.
- **Tailwind v4 — no config file.** Theme customisation is in `app/src/index.css` via `@theme inline {}`. Don't create a JS config file.
- **Path aliases:** `@/` maps to `app/src/`.
- **Config access:** Always use React context hooks (`useSiteConfig()`, `useOverlays()`) — never import `site.ts` directly in components.
- **No over-engineering.** Keep changes minimal and focused.
- **Design principles:** Clarity over cleverness. Hierarchy through restraint. Respect the audience.
- **Parallel execution:** Use sub-agents for independent tasks. See parallelisation strategy above.

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format       # Prettier — format all files
cd app && bun run format:check # Prettier — check without writing
```

## Verification After This Session

- [ ] h1 no longer has an orphaned "AI" at 1280px (`text-wrap: balance`)
- [ ] Provider logo relocated below title, in attribution zone
- [ ] Provider logo SVGs use Plus Jakarta Sans, not system-ui
- [ ] General Users card is visually dominant over Developer card
- [ ] Track selection UX approach decided and implemented (toggle, default+opt-in, or differentiated cards)
- [ ] "Prepared for" label is clearly visible (`text-sm`, full opacity)
- [ ] Divider is a shorter, more intentional centred rule
- [ ] Section count badges are tinted to match card accent colours
- [ ] "Explore track" CTAs have `font-semibold` for clearer hierarchy
- [ ] Feedback FAB doesn't overlap content on mobile (375px)
- [ ] Large viewport (1920x1080) spacing is addressed
- [ ] h1 line-height is tighter on mobile for multi-line wrapping
- [ ] Centre-alignment monotony is broken with spacing contrast or partial left-alignment
- [ ] Build passes: `cd app && bun run build`
- [ ] Lint passes: `cd app && bun run lint`
- [ ] Format passes: `cd app && bun run format:check`
- [ ] Dark mode: all changes work correctly in both light and dark modes
- [ ] Mobile (375px): layout stacks correctly, no overlaps
- [ ] Generic default (no client): clean layout without client zone
- [ ] Phew client: full layout with client logo and dark mode container
