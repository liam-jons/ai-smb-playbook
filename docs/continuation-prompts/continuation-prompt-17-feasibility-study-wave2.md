# Feasibility Study Wave 2 -- Session Continuation Prompt

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. Three outputs per client deployment:
1. **Interactive Playbook** -- React app with two audience tracks (General Users / Developers)
2. **Starter Kit** -- Drop-in skill files, commands, templates, governance policy
3. **Repeatable Workflow Process Doc** -- Internal process documentation

**Read first:** `CLAUDE.md` at the project root -- conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### Phase 0 (Research) -- Complete
All research outputs in `.planning/research/`.

### Phase 1 (Specs) -- Complete
All specs in `.planning/specs/`. Verified with audits.

### Phases 2-4 (Build) -- Complete
Full application built: 17 content sections across general and developer tracks, interactive context window simulator, governance policy template, starter kit browser, feedback widget.

### Phase 5 (Audit Fixes) -- Complete
All 17 frontend design audit issues resolved (0 critical, 3 high, 8 medium, 6 low). Score improved from 82/100.

### Phase 6 (Content Review) -- Complete
36 content review issues identified and resolved across all 17 page components.

### Phase 7 (Theme System) -- Complete
Three independent theming dimensions: light/dark mode, accessibility modes (dyslexia-friendly, high-contrast, large-text), creative themes. 28 status tokens, 8 segment tokens. Semantic token migration across 17 component files. Zero hardcoded palette classes remaining.

### Phase 8 (ROI Section) -- Complete
New "Measuring AI ROI" section (1.8) built with interactive calculator, 15 task templates with before/after comparisons, three measurement frameworks, getting-started checklist. Research synthesis from 13 articles saved to `docs/reference/roi-article-synthesis.md`. Data separated from presentation (roi-data.ts + RoiMeasurementSection.tsx). Section registered and deployed.

### Phase 9 (ROI Quality Fixes) -- Complete
10 quality fixes applied: tab reordering, introduction rewrite with three-tool signposting, 2 new measurement mistakes, hardcoded count removal, siteConfig parameterisation for export text and client example labels, unused clientContext removal, cost field rendering in task template cards, duplicate bullet consolidation, toolCostStep granularity improvement. All fixes verified against build/lint/format checks.

### Wave 1 (Feasibility Study Builder Shell) -- Complete
Two files created and integrated:

- **`app/src/content/shared/feasibility-data.ts`** -- Data layer with all types (`FeasibilityFormData`, `FeasibilityRisk`, `FeasibilityStep`, `Frequency`, `Recommendation`, `RiskCategory`, `RiskSeverity`), interfaces, form defaults, pre-population logic (`getPrePopulationForTemplate()`), KPI suggestion function (`getDefaultKpisForCategory()`), 5 default risks, step definitions, frequency/pilot-duration/tool/recommendation/severity option arrays, risk category labels, and helper utilities (`formatDateUK`, `slugify`).
- **`app/src/content/general/FeasibilityStudyBuilder.tsx`** -- Extracted component (~700 lines) containing: `StepIndicator` (desktop `ol` with `role="list"` and mobile progress bar), `FormField` helper, 7 step form components (`Step1UseCaseForm` through `Step7RecommendationForm`), step navigation (previous/next with `aria-label`), template pre-population from task templates, and form reset. Integrated into `RoiMeasurementSection.tsx` between Task Templates and Measurement Frameworks in a `Collapsible` wrapper with `FileText` icon.
- **Bonus work completed from Wave 2 scope:** `generateFeasibilityMarkdown()` function (inline in component file), Step 7 preview panel with formatted Markdown view, `CopyButton` integration for clipboard export, download-as-Markdown action with use-case-derived filename, and "Start a new study" reset button.
- **Cross-references implemented:** Anchor link to `#calculator-heading` in Step 4 via `CalloutCard` (variant="tip"), `Link` to governance section (`/${track}/governance`) in Step 5 via `CalloutCard` (variant="info").
- Build, lint, and format all pass.

### Build Status

- `cd app && bun run build` -- passes
- `cd app && bun run lint` -- passes
- `cd app && bun run format:check` -- passes

---

## What This Session Does: Wave 2 -- Persistence, Polish, and Starter Kit Template

This session completes Wave 2 and Wave 3 of the feasibility study implementation. The Markdown export, preview panel, and copy/download actions were completed as bonus work in Wave 1, so this session focuses on localStorage persistence, the starter-kit template, accessibility polish, and final acceptance criteria verification.

The full implementation spec is at `.planning/plan-files/feasibility-study-spec.md` (947 lines, 15 sections). Read it before starting. Pay particular attention to Section 6 (localStorage Persistence), Section 9 (Accessibility Requirements), and Section 12 (Acceptance Criteria).

---

## Implementation Strategy

### Wave 2 Items (Persistence + Starter Kit)

**Agent allocation:** Two parallel agents.

| Agent | Responsibility | File Owned |
|-------|---------------|------------|
| **Agent C: Persistence** | localStorage save/load/clear with 500ms debounce, draft recovery banner, discard confirmation dialog, "Start a new study" improvements (clear localStorage after export, reset form) | `app/src/content/general/FeasibilityStudyBuilder.tsx` |
| **Agent D: Starter Kit Template** | Create standalone `starter-kit/templates/feasibility-study-template.md` with `{{PLACEHOLDER}}` variables following the governance policy template pattern. Markdown template with HTML usage comments | `starter-kit/templates/feasibility-study-template.md` (new) |

**Wave 2 work items in priority order:**

1. **localStorage persistence** -- Save form data on every field change (debounced 500ms using `useEffect` + `setTimeout` pattern), load on component mount, clear on export. Storage key: `${siteConfig.localStoragePrefix}-feasibility-draft` (produces `phew-playbook-feasibility-draft`). Storage format: `{ formData: FeasibilityFormData, currentStep: number, lastSaved: string }` where `lastSaved` is ISO 8601.
2. **Draft recovery banner** -- `CalloutCard` (variant="info") showing when a saved draft is detected on mount, with "Resume" and "Discard" actions. Display relative time since last save (e.g. "2 hours ago"). Auto-expand the `Collapsible` wrapper when a draft is found.
3. **Discard confirmation dialog** -- Using the shadcn/ui `Dialog` component (already installed). Confirm before clearing localStorage and resetting the form.
4. **"Start a new study" improvements** -- After export (copy or download), clear localStorage. The existing reset button already resets form state; add localStorage clearing to `handleReset()`.
5. **Standalone starter-kit template** -- Create `starter-kit/templates/feasibility-study-template.md` with `{{PLACEHOLDER}}` variables following the same pattern as `starter-kit/templates/governance-policy-template.md`. Include HTML comments explaining usage, prerequisites, and placeholder descriptions.

**Definition of Done for Wave 2:**
- [ ] Form data persists to localStorage on field change (debounced at 500ms)
- [ ] Returning to the page restores the draft with all data and step position intact
- [ ] Draft recovery banner shows when a saved draft is detected
- [ ] Collapsible auto-expands when a draft is found
- [ ] "Discard" clears draft with confirmation dialog
- [ ] "Start a new study" resets form and clears localStorage after export
- [ ] localStorage key uses `siteConfig.localStoragePrefix`
- [ ] Standalone starter-kit template created with `{{PLACEHOLDER}}` variables
- [ ] `bun run build` passes
- [ ] Commit: `feat: add feasibility study persistence, draft recovery, and starter-kit template`

---

### Wave 3 Items (Accessibility + Polish)

**This wave is sequential (single agent)** as changes span files and require careful verification.

**Work items:**

1. **Step indicator backward navigation fix** -- Add a `highestStep` state variable alongside `step`. Update `highestStep = Math.max(highestStep, step)` on each step change. Use `highestStep` to determine which steps are clickable (any step <= highestStep) and which show the completed checkmark (any step < highestStep or < currentStep). This allows free navigation between all previously-visited steps without losing completed visual state.
2. **ARIA attributes** -- Verify and enhance: `aria-live="polite"` on step content (already present), `aria-current="step"` on active step indicator item (already present), `role="list"` on step indicator `ol` (already present). Add `aria-label` on all navigation buttons if not already complete. Verify `aria-describedby` linkage for any validation messages.
2. **Keyboard navigation** -- Focus management on step transitions: move focus to the "Next" or "Previous" button after a step change so keyboard users have a clear focus target. Use `useRef` + `useEffect` to manage focus.
4. **Reduced motion** -- Verify CSS transitions on the mobile progress bar and step indicator respect `prefers-reduced-motion`. Add `motion-safe:` prefix to any transition/animation classes if needed.
5. **Cross-reference links** -- Verify the anchor link to `#calculator-heading` in Step 4 scrolls correctly. Verify the `Link` to governance section in Step 5 navigates correctly.
6. **Mobile responsive polish** -- Verify the step indicator mobile adaptation (progress bar with "Step X of 7" text). Test risk cards, KPI inputs, and export actions on narrow viewports. Apply fixes if needed.
7. **Accessibility mode testing** -- Manually verify the component renders correctly with high-contrast mode (`data-a11y-mode="high-contrast"`), dyslexia-friendly mode (`data-a11y-font="opendyslexic"`), and large-text mode. All semantic tokens should adapt automatically.
8. **Full acceptance criteria verification** -- Run through all 35 items from spec Section 12 (8 categories: Core Functionality, Data Persistence, Template Integration, Risk Assessment, Export Quality, UI and Interaction, Accessibility, Build and Type Safety). Document any gaps and fix them.

**Definition of Done for Wave 3:**
- [ ] All 35 acceptance criteria from spec Section 12 verified
- [ ] Screen reader step announcements confirmed via `aria-live`
- [ ] Mobile step indicator renders correctly
- [ ] All accessibility modes work correctly
- [ ] Cross-reference links functional
- [ ] Keyboard focus management on step transitions
- [ ] `prefers-reduced-motion` respected
- [ ] `bun run build` passes
- [ ] Final commit: `feat: complete feasibility study builder with full accessibility and polish`

---

## Key Design Decisions (from the spec)

These decisions are already made -- do not revisit:

1. **Inline sub-section** within `RoiMeasurementSection.tsx`, not a separate section (1.9). Positioned between Task Templates and Measurement Frameworks.
2. **Collapsed by default** in a `Collapsible` wrapper to avoid dominating the ROI section.
3. **No state lifting** -- all form state is local to `FeasibilityStudyBuilder` via `useState`. No context providers, no Redux.
4. **Decoupled from calculator** -- the calculator and feasibility study do not share state. Users copy values manually. An anchor link from Step 4 jumps to the calculator.
5. **Component extracted** to `FeasibilityStudyBuilder.tsx` (~700 lines). This was completed in Wave 1.
6. **No new shadcn/ui components needed** -- all required components are already installed (including `Dialog` for the discard confirmation).
7. **localStorage storage key:** `${siteConfig.localStoragePrefix}-feasibility-draft` (produces `phew-playbook-feasibility-draft`).
8. **Storage format:** `{ formData: FeasibilityFormData, currentStep: number, lastSaved: string }` where `lastSaved` is ISO 8601.
9. **Debounce save at 500ms** using `useEffect` + `setTimeout` pattern (not a library).
10. **Draft recovery auto-expands** the `Collapsible` when a draft is found on mount.

---

## Current File Structure

### Files to Modify
```
app/src/content/general/FeasibilityStudyBuilder.tsx  # Persistence, draft recovery, ARIA, focus management
```

### Files to Create
```
starter-kit/templates/feasibility-study-template.md   # Standalone template with {{PLACEHOLDER}} variables
```

### Reference Files (read-only)
```
.planning/plan-files/feasibility-study-spec.md        # Full implementation spec (947 lines)
app/src/content/shared/feasibility-data.ts            # Data layer (types, defaults, pre-population, helpers)
app/src/content/shared/roi-data.ts                    # Task template data for pre-population
app/src/config/site.ts                                # siteConfig for parameterisation
app/src/content/general/RoiMeasurementSection.tsx     # Parent component rendering FeasibilityStudyBuilder
app/src/content/general/GovernancePolicySection.tsx   # Pattern reference (template tabs, copy/download)
starter-kit/templates/governance-policy-template.md   # Standalone template pattern reference
docs/reference/roi-article-synthesis.md               # ROI content informing template guidance text
```

---

## Key Conventions Reminder

- **UK English throughout.** All content, examples, and copy must use UK English spelling and grammar. Use GBP not USD.
- **Path aliases:** `@/` maps to `app/src/`.
- **Semantic tokens:** Use `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border` etc. No hardcoded palette classes.
- **Site config:** All client-specific values centralised in `config/site.ts`.
- **Copy-to-clipboard:** Every copyable code block, prompt, or template must have a copy button.
- **Track detection:** `useTrack()` hook returns `{ track, isDev, isGeneral }` for conditional rendering.
- **Tailwind v4:** No `tailwind.config.js`. Theme customisation in `app/src/index.css` via `@theme inline {}`.
- **shadcn/ui:** Components in `components/ui/` are generated via `bunx shadcn add`. Do not manually edit.

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

## Deployment

- **Production:** https://ai-smb-playbook.vercel.app
- **Repository:** https://github.com/liam-jons/ai-smb-playbook
- Auto-deploys on push to `main` via Vercel

---

## Documents to Read Before Starting

| Document | Purpose | Priority |
|----------|---------|----------|
| `CLAUDE.md` | Project conventions, tech stack, critical rules | Required |
| `.planning/plan-files/feasibility-study-spec.md` | Full implementation spec (947 lines) | Required |
| `app/src/content/general/FeasibilityStudyBuilder.tsx` | Component being modified (~700 lines) | Required |
| `app/src/content/shared/feasibility-data.ts` | Data layer (types, defaults, helpers) | Required |
| `app/src/content/general/RoiMeasurementSection.tsx` | Parent component (Collapsible integration) | Required |
| `app/src/config/site.ts` | Site config for parameterisation | Required |
| `starter-kit/templates/governance-policy-template.md` | Standalone template pattern reference | Required |
| `app/src/content/general/GovernancePolicySection.tsx` | Pattern reference (template tabs, copy/download) | Reference |
| `app/src/content/shared/roi-data.ts` | Task template data for pre-population | Reference |
| `docs/reference/roi-article-synthesis.md` | ROI content informing template guidance text | Reference |

---

## Session Boundaries

**This is a multi-session implementation.** Each session should:

1. **Start by reading** the spec and the current state of the implementation files
2. **Complete one wave** (or a meaningful subset of a wave if the wave is large)
3. **Verify** with `bun run build`, `bun run lint`, `bun run format:check`
4. **Commit** the working increment
5. **Note** what was completed and what remains for the next session

If a wave completes mid-session with context remaining, proceed to the next wave. If context is running low, commit what you have and stop cleanly.

**Quality over completion.** A well-implemented Wave 2 is worth more than a rushed attempt at both waves. The spec has 35 acceptance criteria -- they exist to be verified, not skipped.

---

## Browser Testing Results (Wave 1)

Comprehensive browser testing was conducted at the end of Wave 1 using `agent-browser`. All 9 test sections passed with no blocking bugs. Full results:

| Test | Result | Notes |
|------|--------|-------|
| Collapsible trigger renders | PASS | Icon, title, description all present and correctly positioned |
| Step indicator (7 steps) | PASS | Current step highlighted, future steps muted, completed steps show checkmark |
| Template pre-population | PASS | "Email Drafting & Replies" pre-populates all mapped fields correctly |
| Step navigation (Next/Previous) | PASS | Data preserved across step transitions |
| All 7 step forms render | PASS | All fields, labels, pre-populated data, checkboxes, radios correct |
| Step indicator click-back | PASS | Jumps back and preserves data |
| Mobile responsiveness (375px) | PASS | "Step X of 7" compact indicator with progress bar |
| Custom risk addition | PASS | "Custom" badge, remove button, empty fields |
| Visual quality | PASS | Consistent with design system, no styling issues |

### Known Issue: Step Indicator Backward Navigation

**Severity:** Low / UX improvement
**Description:** When a user clicks a completed step in the step indicator to navigate backwards, all subsequent steps lose their "completed" visual state and become disabled. The user must click "Next" again to re-reach later steps. Data is always preserved.
**Root cause:** The `StepIndicator` determines step states purely from `i < currentStep` / `i === currentStep` / `i > currentStep`. There is no "highest visited step" tracking.
**Fix (Wave 3):** Add a `highestStep` state variable alongside `step`. Update `highestStep = Math.max(highestStep, step)` on each step change. Use `highestStep` to determine which steps are clickable and which show the completed checkmark. This allows free navigation between all previously-visited steps.
