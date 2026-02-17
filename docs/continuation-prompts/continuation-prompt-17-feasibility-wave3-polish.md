# Feasibility Study Wave 3 -- Accessibility Polish & Acceptance Verification

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. Three outputs per client deployment:
1. **Interactive Playbook** -- React app with two audience tracks (General Users / Developers)
2. **Starter Kit** -- Drop-in skill files, commands, templates, governance policy
3. **Repeatable Workflow Process Doc** -- Internal process documentation

**Read first:** `CLAUDE.md` at the project root -- conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### All previous phases (0-9) and Waves 1-2 -- Complete

Full details in `docs/continuation-prompts/continuation-prompt-16-feasibility-study-implementation.md`.

### Wave 2 + Partial Wave 3 -- Complete (this session)

**Committed as:** `feat: add feasibility study persistence, draft recovery, starter-kit template, and step navigation fix`

What was implemented:

**Wave 2 (all items complete):**
- localStorage persistence with 500ms debounced save (`useEffect` + `setTimeout`)
- Draft loading on component mount from `${siteConfig.localStoragePrefix}-feasibility-draft`
- Draft recovery banner (`CalloutCard` variant="info") with Resume/Discard actions and relative time
- Discard confirmation dialog (shadcn/ui `Dialog` component)
- "Start a new study" clears localStorage via `clearDraft()` + `skipSaveRef` pattern to prevent immediate re-save
- Collapsible auto-expands when draft found (`defaultOpen={hasFeasibilityDraft}` in `RoiMeasurementSection.tsx`)
- Standalone starter-kit template at `starter-kit/templates/feasibility-study-template.md` with `{{PLACEHOLDER}}` variables

**Wave 3 (partial -- code changes complete, verification remaining):**
- Step indicator backward navigation fix: `highestStep` state tracks highest visited step; `goToStep()` wrapper updates both `step` and `highestStep`; StepIndicator uses `highestStep` for completed state and clickability
- Focus management: `stepHeadingRef` on the step heading (`tabIndex={-1}`, `outline-none`); `useEffect` focuses heading on step change (skips initial mount via `isInitialRender` ref)
- Reduced motion: `motion-safe:` prefixes on step indicator button transitions and mobile progress bar

### Build Status

- `cd app && bun run build` -- passes
- `cd app && bun run lint` -- passes
- `cd app && bun run format:check` -- passes

---

## What This Session Does: Wave 3 Remaining -- Verification & Polish

This session completes the remaining Wave 3 items: verification of all accessibility features, cross-reference links, mobile responsiveness, accessibility modes, and full acceptance criteria audit against the spec.

The full implementation spec is at `.planning/plan-files/feasibility-study-spec.md` (947 lines). Sections 9 (Accessibility Requirements) and 12 (Acceptance Criteria) are most relevant.

---

## Remaining Wave 3 Items

### 1. ARIA Attributes Verification

Verify the following are correctly implemented (they should be from Waves 1-2):
- `aria-live="polite"` on step content container
- `aria-current="step"` on active step indicator item
- `role="list"` on step indicator `ol`
- `aria-label` on all navigation buttons (Previous/Next)
- `aria-label` on step indicator buttons
- `aria-label` on risk severity radio groups
- `aria-label="Generated feasibility study preview"` on preview panel
- `aria-label="Recommendation"` on recommendation radio group

### 2. Cross-Reference Links Verification

- Verify the anchor link to `#calculator-heading` in Step 4 scrolls correctly (it links to the ROI Calculator section heading in `RoiMeasurementSection.tsx`)
- Verify the `Link` to governance section (`/${track}/governance`) in Step 5 navigates correctly

### 3. Mobile Responsive Polish

Using browser testing (agent-browser or playwright), verify at 375px viewport:
- Step indicator shows "Step X of 7" compact format with progress bar
- Risk cards render correctly on narrow viewports
- KPI inputs stack vertically on narrow viewports
- Export actions (copy/download) wrap correctly
- Draft recovery banner displays correctly
- Discard confirmation dialog displays correctly on mobile

### 4. Accessibility Mode Testing

Verify the component renders correctly with:
- High-contrast mode (`data-a11y-mode="high-contrast"`)
- Dyslexia-friendly mode (`data-a11y-font="opendyslexic"`)
- Large-text mode
- All semantic tokens should adapt automatically (no hardcoded colours)

### 5. Full Acceptance Criteria Verification

Run through all 35 items from spec Section 12 (8 categories). The categories are:

**12.1 Core Functionality (9 items)** -- template selection, pre-population, navigation, preview, export, reset
**12.2 Data Persistence (5 items)** -- localStorage save, load, recovery banner, discard, key prefix
**12.3 Template Integration (4 items)** -- track filtering, template count, pre-population mapping, re-population
**12.4 Risk Assessment (5 items)** -- default risks, editing, adding, removing, severity colour+text
**12.5 Export Quality (7 items)** -- Markdown formatting, empty field handling, header, footer, UK English, GBP
**12.6 UI and Interaction (6 items)** -- collapsible default state, step states, mobile responsive, input styling, cross-references
**12.7 Accessibility (7 items)** -- labels, aria-live, role/aria-current, keyboard, colour independence, a11y modes, reduced motion
**12.8 Build and Type Safety (5 items)** -- build, lint, format, type exports, no `any` types

Document any gaps found and fix them. If all items pass, note this in the commit.

### Definition of Done for Wave 3
- [ ] All 35 acceptance criteria from spec Section 12 verified
- [ ] Screen reader step announcements confirmed via `aria-live`
- [ ] Mobile step indicator renders correctly (375px viewport)
- [ ] All accessibility modes work correctly
- [ ] Cross-reference links functional
- [ ] Keyboard focus management on step transitions confirmed
- [ ] `prefers-reduced-motion` respected (motion-safe: prefixes)
- [ ] `bun run build` passes
- [ ] `bun run lint` passes
- [ ] `bun run format:check` passes
- [ ] Final commit: `feat: complete feasibility study builder with full accessibility verification`

---

## Files to Read Before Starting

| Document | Purpose | Priority |
|----------|---------|----------|
| `CLAUDE.md` | Project conventions | Required |
| `.planning/plan-files/feasibility-study-spec.md` | Full spec, especially Sections 9 and 12 | Required |
| `app/src/content/general/FeasibilityStudyBuilder.tsx` | Main component (~1400 lines) | Required |
| `app/src/content/general/RoiMeasurementSection.tsx` | Parent component (Collapsible, auto-expand) | Reference |
| `app/src/content/shared/feasibility-data.ts` | Data layer | Reference |

---

## Key Conventions Reminder

- **UK English throughout.**
- **Path aliases:** `@/` maps to `app/src/`.
- **Semantic tokens:** `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border` etc.
- **Site config:** All client-specific values in `config/site.ts`.
- **Tailwind v4:** No `tailwind.config.js`. Theme in `app/src/index.css` via `@theme inline {}`.

---

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format       # Prettier -- format all files
cd app && bun run format:check # Prettier -- check without writing
```

---

## Session Boundaries

This session should:
1. Read the spec (Section 12 especially) and the component file
2. Use browser testing to verify mobile, accessibility modes, cross-references
3. Document any gaps found and fix them
4. Run build/lint/format
5. Commit the verification pass

**Quality over speed.** The 35 acceptance criteria exist to be verified, not assumed. Browser testing is the most reliable way to confirm the component works as specified.
