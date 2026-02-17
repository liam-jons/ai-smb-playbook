# ROI Section Quality Fixes -- Session Continuation Prompt

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. Three outputs per client deployment:
1. **Interactive Playbook** -- React app with two audience tracks (General Users / Developers)
2. **Starter Kit** -- Drop-in skill files, commands, templates, governance policy
3. **Repeatable Workflow Process Doc** -- Internal process documentation

**Read first:** `CLAUDE.md` at the project root -- conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).
**CLAUDE.md** is at the repo root with critical rules: UK English throughout, two-track content model, copy-to-clipboard on every prompt/template, parameterised governance policy.

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

### Current Phase (Research/Analysis)
Agent-based review of ROI section quality, content quality across both tracks, and reusability analysis completed. Outputs in `agent-outputs/` directory (files 02, 03, 05, 06). This session addresses the ROI section quality findings.

### Build Status

- `cd app && bun run build` -- passes
- `cd app && bun run lint` -- 0 errors
- `cd app && bun run format:check` -- passes

---

## What This Session Does: ROI Section Quality Fixes

This session resolves ALL quality issues identified in `agent-outputs/02-review-roi-section-action-items.md`. There are 10 specific fixes plus a subagent task to create a feasibility study implementation spec.

### Work Package 1: Tab Order Fix (Must-Fix)

**File:** `app/src/content/shared/roi-data.ts`
**Issue:** The "All" tab is first in the `categoryFilters` array (line 595) and is the default selection, meaning all 12-15 templates display on first load, creating overwhelm.

**Fix -- Step 1:** In `roi-data.ts`, reorder the `categoryFilters` array to move "All" to the end:

Current (lines 595-622):
```typescript
export const categoryFilters: CategoryFilter[] = [
  { value: 'all', label: 'All', colour: '' },
  { value: 'time-savings', label: 'Time Savings', colour: 'bg-info-muted text-info-muted-foreground' },
  { value: 'error-reduction', label: 'Error Reduction', colour: 'bg-danger-muted text-danger-muted-foreground' },
  { value: 'throughput', label: 'Getting More Done', colour: 'bg-success-muted text-success-muted-foreground' },
  { value: 'capacity', label: 'Team Capacity', colour: 'bg-warning-muted text-warning-muted-foreground' },
  { value: 'insight', label: 'Research & Analysis', colour: 'bg-important-muted text-important-muted-foreground' },
];
```

Replace with:
```typescript
export const categoryFilters: CategoryFilter[] = [
  { value: 'time-savings', label: 'Time Savings', colour: 'bg-info-muted text-info-muted-foreground' },
  { value: 'error-reduction', label: 'Error Reduction', colour: 'bg-danger-muted text-danger-muted-foreground' },
  { value: 'throughput', label: 'Getting More Done', colour: 'bg-success-muted text-success-muted-foreground' },
  { value: 'capacity', label: 'Team Capacity', colour: 'bg-warning-muted text-warning-muted-foreground' },
  { value: 'insight', label: 'Research & Analysis', colour: 'bg-important-muted text-important-muted-foreground' },
  { value: 'all', label: 'All', colour: '' },
];
```

**Fix -- Step 2:** In `app/src/content/general/RoiMeasurementSection.tsx`, change the default state at line 414:

Current:
```typescript
const [activeCategory, setActiveCategory] = useState<TaskCategory | 'all'>('all');
```

Replace with:
```typescript
const [activeCategory, setActiveCategory] = useState<TaskCategory | 'all'>('time-savings');
```

**Rationale:** "Time Savings" contains the most universally relatable tasks (email drafting, meeting notes) and shows only 2-3 cards on first load. This aligns with the "Getting Started" section which recommends starting with "one quick win (email drafting, meeting summaries)."

---

### Work Package 2: Introduction Section Improvement (Must-Fix)

**File:** `app/src/content/general/RoiMeasurementSection.tsx`
**Lines:** 438-464
**Issue:** The current introduction ("Why Measure AI ROI?") lacks clear signposting of the section's three interactive tools, has too narrow a "why" (only covers "justify the subscription"), and does not validate the common SMB experience of struggling to quantify AI value.

**Fix:** Replace the current introduction (lines 438-464) with the following. Ensure `Calculator`, `Target`, and `TrendingUp` are already imported from lucide-react (they should be -- check lines 22-24):

```jsx
<section aria-labelledby="why-measure-heading">
  <h2
    id="why-measure-heading"
    className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl"
  >
    Measuring What AI Actually Saves You
  </h2>
  <div className="space-y-3 max-w-prose">
    <p className="text-base leading-relaxed text-foreground">
      Most teams know AI is saving them time, but struggle to put a
      number on it. Without that number, it is harder to justify
      renewing licences, expanding to new team members, or knowing
      which tasks benefit most from AI.
    </p>
    <p className="text-sm leading-relaxed text-muted-foreground">
      This section gives you three practical tools to fix that:
    </p>
    <ul className="space-y-1.5 text-sm text-muted-foreground list-none">
      <li className="flex items-start gap-2">
        <Calculator className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          <strong className="text-foreground">ROI Calculator</strong> &mdash;
          plug in your hours saved and team size to see projected annual
          savings in pounds.
        </span>
      </li>
      <li className="flex items-start gap-2">
        <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          <strong className="text-foreground">Task Templates</strong> &mdash;
          before/after comparisons for common SMB tasks, with copy-ready
          summaries for your business case.
        </span>
      </li>
      <li className="flex items-start gap-2">
        <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          <strong className="text-foreground">Measurement Frameworks</strong> &mdash;
          three approaches to valuing AI adoption, from quick breakeven
          checks to long-term strategic value.
        </span>
      </li>
    </ul>
  </div>

  <CalloutCard variant="tip" title="Start with one task" className="mt-6">
    You do not need to measure everything at once. Pick one task you do
    every week &mdash; email drafting, meeting notes, whatever is most
    repetitive &mdash; and track the time difference for a fortnight. That
    single number is usually enough to make the case.
  </CalloutCard>
</section>
```

---

### Work Package 3: Fix "Six Pitfalls" Description (Must-Fix)

**File:** `app/src/content/general/RoiMeasurementSection.tsx`
**Issue:** The component description (approximately line 598) says "Six pitfalls" but the `measurementMistakes` array in `roi-data.ts` (lines 489-518) only contains 4 items.

**Fix:** Either:
- **Option A (preferred):** Change the description text from "Six pitfalls" to "Four pitfalls" (or remove the number entirely).
- **Option B:** Add 2 more measurement mistakes to the `measurementMistakes` array in `roi-data.ts`. Suggested additions based on the ROI article synthesis (`docs/reference/roi-article-synthesis.md`):
  - "Not accounting for the learning curve" -- ROI calculations that ignore the initial adoption period where productivity may dip before improving.
  - "Comparing AI costs against the wrong baseline" -- Using junior staff rates in the calculation when the task is actually performed by senior staff at much higher rates.

Search for the exact text containing "Six" or "six" near line 598 to locate the description.

---

### Work Package 4: Fix "15 Common SMB Tasks" Count (Must-Fix)

**File:** `app/src/content/general/RoiMeasurementSection.tsx`
**Line:** approximately 500
**Issue:** The text says "15 common SMB tasks" but general track users only see 12 (3 are developer-only, filtered out at line 419).

**Fix:** Replace the static count with a dynamic approach or remove the number entirely. Recommended replacement:

Current:
```tsx
<p className="mb-6 max-w-prose text-sm text-muted-foreground">
  15 common SMB tasks with before/after comparisons...
</p>
```

Replace with:
```tsx
<p className="mb-6 max-w-prose text-sm text-muted-foreground">
  Common SMB tasks with before/after comparisons. Filter by category
  to find the most relevant ones for your team.
</p>
```

---

### Work Package 5: Replace Hardcoded "Phew!" in Export Text (Should-Fix)

**File:** `app/src/content/general/RoiMeasurementSection.tsx`
**Line:** 83
**Issue:** The ROI calculator export text is hardcoded: `Generated with the Phew! AI Playbook ROI Calculator`

**Fix:** Import `siteConfig` and use `siteConfig.appTitle`:

```typescript
import { siteConfig } from '@/config/site';
// ...
`Generated with the ${siteConfig.appTitle} ROI Calculator`
```

Check whether `siteConfig` is already imported in this file. If not, add the import.

---

### Work Package 6: Remove or Integrate Unused `clientContext` Export (Should-Fix)

**File:** `app/src/content/shared/roi-data.ts`
**Lines:** 114-125
**Issue:** The `clientContext` export is defined and exported but never imported or used anywhere in the codebase. It is dead code.

**Fix:** Either:
- **Option A (simpler):** Remove the `clientContext` export entirely. It contains Phew-specific values that would need to be parameterised anyway.
- **Option B:** Integrate it by using `clientContext.teamSize` to pre-populate the calculator's team size default, and `clientContext.companyName` to personalise section headings. If choosing this option, the values should reference `siteConfig` rather than being hardcoded.

---

### Work Package 7: Render or Remove the `cost` Field (Should-Fix)

**File:** `app/src/content/general/RoiMeasurementSection.tsx` (TaskTemplateCard component)
**File:** `app/src/content/shared/roi-data.ts` (TaskTemplate interface)
**Issue:** The `cost` field in `beforeScenario` and `afterScenario` (e.g., line 135: `cost: '£6-12 per email'`) is defined in the `TaskTemplate` interface and populated for all 15 templates, but never rendered in the `TaskTemplateCard` component. The card shows `time` and `process` but not `cost`.

**Fix:** Either:
- **Option A (preferred):** Add the `cost` field to the before/after card display, showing something like "Typical cost: GBP 6-12 per email" under the existing time and process fields.
- **Option B:** Remove the `cost` field from the `TaskTemplate` interface and all 15 template data entries to reduce maintenance burden.

---

### Work Package 8: Consolidate Duplicate Bullet in Value Threshold Framework (Nice-to-Fix)

**File:** `app/src/content/shared/roi-data.ts`
**Lines:** 456-458
**Issue:** The Value Threshold framework's details contain near-duplicate bullets:
- Line 457: "At GBP 35/hr average, the breakeven on a GBP 20/month licence is roughly 1 hour saved per month. Most teams cross this within the first day of structured use."
- Line 458: "Anything above that threshold is pure return. Most teams cross this within the first week of structured use."

These say almost the same thing ("first day" vs "first week") and should be consolidated.

**Fix:** Merge into a single bullet: "At GBP 35/hr average, the breakeven on a GBP 20/month licence is roughly 1 hour saved per month. Most teams cross this within the first week of structured use -- anything above that threshold is pure return."

---

### Work Package 9: Change `toolCostStep` from 10 to 5 (Nice-to-Fix)

**File:** `app/src/content/shared/roi-data.ts`
**Issue:** The `toolCostStep` is set to 10, meaning users can only adjust tool cost in GBP 10 increments. Claude Teams pricing is approximately GBP 18-22/month depending on exchange rate, so users cannot set precise values.

**Fix:** Change `toolCostStep` from `10` to `5` for better granularity.

---

### Work Package 10: Fix "Phew! Example & Related Section" Text (Should-Fix)

**File:** `app/src/content/general/RoiMeasurementSection.tsx`
**Line:** 377
**Issue:** The collapsible trigger text is hardcoded: `'Phew! example & related section'`

**Fix:** Replace with `siteConfig.companyName + ' example & related section'` or genericise to `'Client example & related section'`. This uses the same `siteConfig` import from Work Package 5.

---

## Subagent Task: Feasibility Study Implementation Spec

Deploy a subagent to create a detailed implementation plan for the Feasibility Study Template Tool (Action Item 3 from the ROI review). The subagent should:

1. **Read the Feasibility Study section** from `agent-outputs/02-review-roi-section-action-items.md` (Action Item 3, starting at line 189). This contains the full proposed content structure (7 sections), integration points with existing ROI tools, component architecture recommendations, and key design decisions.

2. **Read the existing governance template implementation** for the pattern to follow:
   - `app/src/content/general/GovernancePolicySection.tsx` -- the existing template pattern (placeholder badges, walkthrough/full-document tabs, copy/download actions)
   - `starter-kit/templates/governance-policy-template.md` -- the standalone template

3. **Read the ROI data and section component:**
   - `app/src/content/shared/roi-data.ts` -- the task template data structures that the feasibility study will pre-populate from
   - `app/src/content/general/RoiMeasurementSection.tsx` -- the parent component where the feasibility study will be integrated

4. **Read the ROI article synthesis** at `docs/reference/roi-article-synthesis.md` -- particularly Section 2 (SMB-Specific Measurement Approaches), Section 3 (Common Pitfalls), and Section 10 (Summary: Most Actionable Insights) for content that should inform the feasibility study template.

5. **Create a detailed implementation spec** at `.planning/plan-files/feasibility-study-spec.md` covering:
   - Component architecture (inline form within ROI section vs separate section)
   - Data types and interfaces
   - Multi-step form flow
   - Pre-population from task templates
   - Integration with existing ROI calculator values
   - Copy/download export pattern
   - localStorage persistence
   - Accessibility requirements
   - Acceptance criteria

The subagent must NOT modify any existing files -- spec creation only.

---

## Agent Allocation

| Agent | Responsibility | Files Owned |
|-------|---------------|-------------|
| **Lead Agent** | Work Packages 1-10 (ROI quality fixes) | `RoiMeasurementSection.tsx`, `roi-data.ts` |
| **Subagent** | Feasibility Study spec creation | `.planning/plan-files/feasibility-study-spec.md` (new file only) |

The subagent is read-only for all existing files and only creates the spec document. No file ownership conflicts.

---

## Current File Structure

### Key Files for This Session
```
app/src/
  content/
    general/
      RoiMeasurementSection.tsx    # Main component -- Work Packages 1-5, 7, 10
    shared/
      roi-data.ts                  # Data file -- Work Packages 1, 3, 4, 6, 7, 8, 9
  config/
    site.ts                        # Site config -- referenced for siteConfig imports
```

### Reference Files (read-only)
```
agent-outputs/
  02-review-roi-section-action-items.md   # Source of all quality issues
docs/reference/
  roi-article-synthesis.md                # ROI research synthesis
app/src/content/general/
  GovernancePolicySection.tsx             # Pattern reference for feasibility study
starter-kit/templates/
  governance-policy-template.md           # Standalone template pattern reference
```

---

## Key Conventions Reminder

- **UK English throughout.** All content, examples, and copy must use UK English spelling and grammar. Use GBP not USD.
- **Path aliases:** `@/` maps to `app/src/` (configured in `tsconfig.app.json` and `vite.config.ts`).
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

## Verification After This Session

- [ ] Tab order: "Time Savings" is the first tab and default selection; "All" is the last tab
- [ ] Introduction: New heading "Measuring What AI Actually Saves You" with three-tool signposting and icons
- [ ] Pitfalls count: Description matches actual count (either updated text or added items)
- [ ] Task count: No hardcoded "15" visible to general track users
- [ ] Export text: Uses `siteConfig.appTitle`, not hardcoded "Phew!"
- [ ] `clientContext`: Either removed or integrated with `siteConfig` references
- [ ] `cost` field: Either rendered in TaskTemplateCard or removed from data
- [ ] Value Threshold: Duplicate bullet consolidated into single bullet
- [ ] `toolCostStep`: Changed from 10 to 5
- [ ] "Phew! example" text: Uses `siteConfig.companyName` or generic equivalent
- [ ] `cd app && bun run build` passes
- [ ] `cd app && bun run lint` shows 0 errors
- [ ] `cd app && bun run format:check` passes (or run `format` to fix)
- [ ] Feasibility study spec created at `.planning/plan-files/feasibility-study-spec.md`

---

## Documents to Read Before Starting

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Project conventions, tech stack, critical rules |
| `agent-outputs/02-review-roi-section-action-items.md` | Full quality review with all issues, file paths, line numbers, and recommended fixes |
| `app/src/content/general/RoiMeasurementSection.tsx` | The main component being modified |
| `app/src/content/shared/roi-data.ts` | The data file being modified |
| `app/src/config/site.ts` | Site config for `siteConfig` imports |
| `docs/reference/roi-article-synthesis.md` | ROI research synthesis -- context for feasibility study spec and any new pitfall content |
| `app/src/content/general/GovernancePolicySection.tsx` | Reference pattern for the feasibility study spec (subagent only) |
