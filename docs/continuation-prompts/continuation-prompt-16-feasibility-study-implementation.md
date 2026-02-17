# Feasibility Study Implementation -- Session Continuation Prompt

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

### Build Status

- `cd app && bun run build` -- passes
- `cd app && bun run lint` -- 1 pre-existing error in TrackLayout.tsx (setState in effect), unrelated
- `cd app && bun run format:check` -- passes

---

## What This Session Does: Feasibility Study Builder Implementation

This session implements the interactive Feasibility Study Builder tool within the ROI Measurement section (1.8). The full implementation spec is at `.planning/plan-files/feasibility-study-spec.md` (947 lines, 15 sections). Read it before starting.

This is a **multi-session implementation**. The spec describes a substantial interactive tool (7-step multi-form wizard with template pre-population, localStorage persistence, risk management, Markdown export, and full accessibility). Quality is the priority -- do not rush to complete everything in one context window. Each session should produce a working, committable increment.

---

## Implementation Strategy: Phased Waves

The spec's "Implementation Order" (Section 13) lists 8 steps. These are reorganised below into **three waves** that can be spread across sessions. Each wave produces a functional, testable increment that builds cleanly.

### Wave 1: Data Layer + Core Form Shell (Session 1)

**Goal:** Data file created, form skeleton renders, step navigation works, template pre-population functional. The builder is usable but not yet persisted or exportable.

**Agent Allocation:** Two parallel agents, one for each file.

| Agent | Responsibility | File Owned |
|-------|---------------|------------|
| **Agent A: Data Layer** | Create `feasibility-data.ts` with all types, interfaces, defaults, pre-population mapping function, default risks, step definitions, and KPI suggestion function | `app/src/content/shared/feasibility-data.ts` (new) |
| **Agent B: Component Shell** | Build `FeasibilityStudyBuilder` component with Collapsible wrapper, StepIndicator, step navigation (prev/next), and Step 1 (Use Case Selection with template dropdown). Integrate into `RoiMeasurementSection.tsx` between Task Templates and Measurement Frameworks sections | `app/src/content/general/RoiMeasurementSection.tsx` |

**Sequencing:** Agent A must complete first (or provide the type exports) before Agent B can import from `feasibility-data.ts`. Alternatively, Agent B can work against the spec's type definitions and wire up imports at the end.

**After parallel agents complete (lead agent):**
- Wire imports between files
- Add remaining step form components (Steps 2-6) into the shell -- these are standard form layouts that follow the same pattern
- Verify template pre-population works end-to-end
- Run build/lint/format checks
- Commit

**Definition of Done for Wave 1:**
- [ ] `feasibility-data.ts` exists with all types, defaults, and pre-population function
- [ ] Builder renders inside a Collapsible in the ROI section
- [ ] Step indicator shows 7 steps with completed/current/future states
- [ ] User can navigate forward and backward through all steps
- [ ] Step 1 template dropdown lists track-filtered templates + "Custom"
- [ ] Selecting a template pre-populates downstream fields
- [ ] All 7 step forms render with correct field types and labels
- [ ] `bun run build` passes
- [ ] Commit: `feat: add feasibility study builder shell with step navigation and template pre-population`

---

### Wave 2: Export + Persistence + Starter Kit (Session 2)

**Goal:** The builder produces a complete, downloadable Markdown document. Form state persists across page navigations. A standalone template is added to the starter kit.

**Agent Allocation:** Two parallel agents.

| Agent | Responsibility | File Owned |
|-------|---------------|------------|
| **Agent C: Export Engine** | Add `generateFeasibilityMarkdown()` function to data file, implement Step 7 preview panel, copy-to-clipboard and download-as-Markdown actions. Handle empty field placeholders (`[Not provided]`). | `feasibility-data.ts` (export function) + `RoiMeasurementSection.tsx` (Step 7 UI) |
| **Agent D: Starter Kit Template** | Create standalone `starter-kit/templates/feasibility-study-template.md` following the governance policy template pattern. Markdown template with `{{PLACEHOLDER}}` variables and HTML usage comments. Register in StarterKitSection if applicable. | `starter-kit/templates/feasibility-study-template.md` (new) |

**After parallel agents complete (lead agent):**
- Implement localStorage persistence (save/load/clear with 500ms debounce)
- Implement draft recovery banner with resume/discard actions
- Implement "Start a new study" reset after export
- Add discard confirmation dialog
- Run build/lint/format checks
- Commit

**Definition of Done for Wave 2:**
- [ ] Step 7 shows formatted preview of the generated document
- [ ] Copy button copies complete Markdown to clipboard
- [ ] Download button saves `.md` file with use-case-derived filename
- [ ] Generated document includes all 7 sections with proper formatting
- [ ] Empty fields show `[Not provided]` in export
- [ ] UK English throughout generated text, GBP for all currency
- [ ] Footer line: "Generated with the [appTitle] Feasibility Study Tool"
- [ ] Form data persists to localStorage on field change (debounced)
- [ ] Returning to the page shows draft recovery banner
- [ ] "Discard" clears draft with confirmation dialog
- [ ] "Start a new study" resets form after export
- [ ] Standalone starter-kit template created
- [ ] `bun run build` passes
- [ ] Commit: `feat: add feasibility study export, persistence, and starter-kit template`

---

### Wave 3: Accessibility, Polish, and Cross-References (Session 3)

**Goal:** Full accessibility compliance, cross-reference links, responsive polish, and final acceptance criteria verification.

**This wave is sequential (single agent)** as changes span both files and require careful testing.

**Work items:**
1. ARIA attributes: `aria-live="polite"` on step content, `aria-current="step"`, `role="list"` on indicator, `aria-label` on all navigation buttons
2. Keyboard navigation: focus management on step transitions
3. Colour independence: verify all states conveyed by text/icon AND colour
4. Reduced motion: CSS transitions respect `prefers-reduced-motion`
5. Cross-reference links: anchor link to `#calculator-heading` in Step 4, Link to governance section in Step 5
6. Mobile responsive: step indicator adaptation for small screens
7. Accessibility mode testing: verify with high-contrast, dyslexia, and large-text modes
8. Run through full acceptance criteria (Section 12 of spec -- 35 items across 8 categories)

**Definition of Done for Wave 3:**
- [ ] All 35 acceptance criteria from spec Section 12 verified
- [ ] Screen reader testing confirms step announcements
- [ ] Mobile step indicator renders correctly
- [ ] All accessibility modes work correctly
- [ ] Cross-reference links functional
- [ ] `bun run build` passes
- [ ] Final commit: `feat: complete feasibility study builder with full accessibility and polish`

---

## Key Design Decisions (from the spec)

These decisions are already made -- do not revisit:

1. **Inline sub-section** within `RoiMeasurementSection.tsx`, not a separate section (1.9). Positioned between Task Templates and Measurement Frameworks.
2. **Collapsed by default** in a `Collapsible` wrapper to avoid dominating the ROI section.
3. **No state lifting** -- all form state is local to `FeasibilityStudyBuilder` via `useState`. No context providers, no Redux.
4. **Decoupled from calculator** -- the calculator and feasibility study do not share state. Users copy values manually. An anchor link from Step 4 jumps to the calculator.
5. **Component may be extracted** to `FeasibilityStudyBuilder.tsx` if it exceeds ~300 lines. The spec expects this.
6. **No new shadcn/ui components needed** -- all 9 required components are already installed.

---

## Current File Structure

### Files to Create
```
app/src/content/shared/feasibility-data.ts         # Types, defaults, pre-population, export function
starter-kit/templates/feasibility-study-template.md  # Standalone template (Wave 2)
```

### Files to Modify
```
app/src/content/general/RoiMeasurementSection.tsx   # Add FeasibilityStudyBuilder sub-section
```

### Reference Files (read-only)
```
.planning/plan-files/feasibility-study-spec.md      # Full implementation spec (947 lines)
app/src/content/shared/roi-data.ts                  # Task template data for pre-population
app/src/config/site.ts                              # siteConfig for parameterisation
app/src/content/general/GovernancePolicySection.tsx  # Pattern reference (template tabs, copy/download)
starter-kit/templates/governance-policy-template.md  # Standalone template pattern reference
docs/reference/roi-article-synthesis.md              # ROI content informing template guidance
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
- **Component extraction:** If `FeasibilityStudyBuilder` exceeds ~300 lines, extract to its own file at `app/src/content/general/FeasibilityStudyBuilder.tsx`.

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
| `app/src/content/general/RoiMeasurementSection.tsx` | Parent component being modified | Required |
| `app/src/content/shared/roi-data.ts` | Task template data for pre-population | Required |
| `app/src/config/site.ts` | Site config for parameterisation | Required |
| `app/src/content/general/GovernancePolicySection.tsx` | Pattern reference (template tabs, copy/download) | Reference |
| `starter-kit/templates/governance-policy-template.md` | Standalone template pattern | Reference (Wave 2) |
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

**Quality over completion.** A well-implemented Wave 1 is worth more than a rushed attempt at all three waves. The spec has 35 acceptance criteria -- they exist to be verified, not skipped.
