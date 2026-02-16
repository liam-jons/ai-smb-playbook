# Continuation Prompt 10 — Semantic Token Migration

## Context

Phase 7 (Theme System) is complete and deployed. The implementation added three independent theming dimensions to `<html>`:
- `.dark` class — light/dark/system mode
- `data-a11y-mode` — accessibility modes (dyslexia-friendly, high-contrast, large-text)
- `data-theme` — creative themes (Retro Terminal, Synthwave, Minimal Ink)

All themes and accessibility modes are working correctly in the browser (verified via Playwright). The theme system uses CSS custom properties (semantic tokens) defined in:
- `app/src/index.css` — base brand tokens (`:root` and `.dark`)
- `app/src/styles/themes.css` — creative theme overrides
- `app/src/styles/a11y.css` — accessibility mode overrides

These tokens are bridged to Tailwind v4 via `@theme inline {}` in `index.css`, making them available as utility classes like `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`, etc.

**The problem:** Many component and content files still use hardcoded Tailwind palette classes (e.g., `text-emerald-600`, `bg-amber-100`, `bg-blue-50`) instead of semantic tokens. These hardcoded colours won't respond to creative theme changes, breaking the visual consistency when themes are active.

## What to do

### Step 1: Review the Audit

A comprehensive audit was completed by an Explore agent. The full findings are summarised below. Review these findings and categorise them by approach:

**Category A — New semantic tokens needed:** These are repeated patterns that need new CSS custom properties added to the token system. The most common are success (green/emerald), warning (amber/orange), info (blue), and important/category (violet/purple).

**Category B — Already has a token equivalent:** Some hardcoded values can be directly replaced with existing tokens (e.g., `text-white` → `text-primary-foreground` where used on primary backgrounds).

**Category C — Intentional / acceptable:** Some hardcoded values are intentional (e.g., swatch previews in `ThemeSettings.tsx`, example colour values in content text, standalone print HTML in `WelcomeSection.tsx`).

**Category D — Data-driven visualisation colours:** The context window simulator uses specific colours per segment for data visualisation. These need a different approach (possibly mapping to `--chart-*` tokens or dedicated `--segment-*` tokens).

### Step 2: Create a Plan

Create an implementation plan that:

1. **Defines new token families** to add to `index.css` (`:root` and `.dark`), `themes.css` (per creative theme), and `a11y.css` (high-contrast overrides). Recommended new tokens:
   - `--success` / `--success-foreground` — for green/emerald success indicators
   - `--warning` / `--warning-foreground` — for amber/orange warning indicators
   - `--info` / `--info-foreground` — for blue informational elements
   - `--important` / `--important-foreground` — for violet/purple emphasis (or reuse `--accent`)
   - Muted variants for backgrounds: `--success-muted`, `--warning-muted`, `--info-muted`, `--important-muted`
   - Additional chart tokens if needed for the simulator

2. **Bridges them to Tailwind** via `@theme inline {}` in `index.css`

3. **Migrates components in priority order:**
   - **P1 — `CalloutCard.tsx`**: Shared component with 4 variant colour schemes used across many sections. Tokenising this cascades improvements everywhere.
   - **P1 — `context-simulator-data.ts`**: Data file driving the entire simulator (~30 hardcoded colours). Fixes `ContextWindowBar.tsx` and `SimulatorControls.tsx` automatically.
   - **P2 — `CopyButton.tsx` and `FeedbackWidget.tsx`**: Simple 1-line fixes each (success green).
   - **P2 — Content sections**: `StarterKitSection.tsx`, `BrandVoiceSection.tsx`, `SkillsExtensionsSection.tsx`, `GovernancePolicySection.tsx`, `RecurringTasksSection.tsx`, `ClaudeMdSection.tsx`, `DocumentationSection.tsx`, `CodebaseMappingSection.tsx`, `PluginsSection.tsx`, `TechnicalDebtSection.tsx`, `ContextSimulatorSection.tsx`.
   - **P3 — Skip/accept**: `WelcomeSection.tsx` print HTML (standalone document), `ThemeSettings.tsx` swatch previews (intentional), `SessionManagementSection.tsx` hex in content text (example value).

4. **Provides appropriate token values** for each creative theme (Retro Terminal, Synthwave, Minimal Ink) and for high-contrast mode.

### Step 3: Implement

Use subagents/teams to parallelise the work. The token definitions (CSS) should be done first, then component migrations can be done in parallel.

## Full Audit Findings

### Files with hardcoded colours (excluding `components/ui/`, CSS token files, `themes/index.ts`)

#### Shared Components

**`components/content/CalloutCard.tsx`** (4 variant definitions)
- Line 25: `border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400` (info variant)
- Line 30: `border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400` (warning variant)
- Line 35: `border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400` (tip variant)
- Line 40: `border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 [&>svg]:text-purple-600 dark:[&>svg]:text-purple-400` (important variant)

**`components/content/CopyButton.tsx`**
- Line 26: `text-green-600 dark:text-green-400` (success tick)

**`components/layout/FeedbackWidget.tsx`**
- Line 124: `text-green-600 dark:text-green-400` (success state)

#### Interactive Components

**`components/interactive/ContextWindowBar.tsx`**
- Line 82: `rgba(0,0,0,0.06)` and `rgba(255,255,255,0.06)` in Tailwind arbitrary value (hatched stripe pattern)
- Line 101: `rgba(0,0,0,${overlayOpacity})` inline style (degradation overlay)
- Line 139: `text-white` on coloured bar segments
- Line 217: `rgba(0,0,0,0.1)` in Tailwind arbitrary value (mobile legend stripe)

**`components/interactive/SimulatorControls.tsx`**
- Line 298: `border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300` (healthy status)
- Line 299: `border-red-500/30 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300` (critical status)

#### Data File

**`content/shared/context-simulator-data.ts`** (~30 instances)
- Segment colours: `bg-indigo-600`, `bg-blue-500`, `bg-teal-500`, `bg-amber-500`, `bg-purple-500`, `bg-slate-400`, `bg-emerald-500`, `bg-slate-300` (with dark variants)
- Degradation stage badges: emerald (healthy), amber (early), orange (noticeable), red (critical)

#### Content Sections

**`content/shared/StarterKitSection.tsx`** (5 instances)
- Lines 102, 175, 392, 395, 408: emerald success badges and borders

**`content/general/BrandVoiceSection.tsx`** (~20 instances)
- Lines 356, 548, 574-575, 583-584, 598-599, 890, 892, 903-926, 935, 937, 950-971: emerald success, amber warning, blue info, violet accent badges, borders, and bullet dots

**`content/general/SkillsExtensionsSection.tsx`** (~13 instances)
- Lines 818-823, 859, 883, 895, 900, 905, 909, 1213: blue info, violet category, emerald success, amber warning, red destructive badges

**`content/general/GovernancePolicySection.tsx`** (~10 instances)
- Lines 630, 663-677: violet badge, emerald/amber/red status cards with borders

**`content/general/RecurringTasksSection.tsx`** (4 instances)
- Lines 75, 98, 133, 156: emerald success and violet category badges

**`content/general/ContextSimulatorSection.tsx`** (2 instances)
- Lines 267, 278: `text-emerald-700 dark:text-emerald-300` and `text-red-700 dark:text-red-300`

**`content/developer/ClaudeMdSection.tsx`** (4 instances)
- Lines 588-589, 843-844: emerald tip callout borders and text

**`content/developer/DocumentationSection.tsx`** (2 instances)
- Lines 478-479: emerald tip callout border and text

**`content/developer/CodebaseMappingSection.tsx`** (2 instances)
- Lines 650-651: emerald tip callout border and text

**`content/developer/PluginsSection.tsx`** (5 instances)
- Lines 405, 415, 425, 435: `bg-emerald-500` and `bg-amber-500` status dots
- Line 531: `text-amber-700 dark:text-amber-400`

**`content/developer/TechnicalDebtSection.tsx`** (1 instance)
- Line 510: `bg-amber-500/80 hover:bg-amber-500/70`

#### Intentional / Acceptable (skip these)

**`content/shared/WelcomeSection.tsx`** — Lines 144, 146, 149: hex colours in standalone print HTML string
**`components/layout/ThemeSettings.tsx`** — Lines 40-42: oklch swatch preview values
**`components/layout/ThemePreview.tsx`** — Line 12: `style={{ backgroundColor: color }}` for swatches
**`content/general/SessionManagementSection.tsx`** — Line 529: `#1B4D3E` as content text example

### Files confirmed clean (no findings)

Header.tsx, HomePage.tsx, AppLayout.tsx, Footer.tsx, Sidebar.tsx, TrackLayout.tsx, SectionPage.tsx, PromptExample.tsx, CodeBlock.tsx, ShikiHighlighter.tsx, SimulatorStatus.tsx, HallucinationsSection.tsx, McpUsageSection.tsx, RegressionTestingSection.tsx, ProcessDocPage.tsx, starter-kit-data.ts, all hooks/, all routes/

## Constraints

- **Tailwind v4** — no `tailwind.config.js`. All theme tokens go in `@theme inline {}` in `index.css`.
- **UK English** — use "colour" not "color" in any UI-facing text (CSS variable names use American convention as per existing codebase).
- **Three-layer cascade** — base tokens < creative themes < a11y overrides. New tokens must be defined at all three levels.
- **Build check** — run `cd app && bun run build` after changes to verify TypeScript passes.
- **Format** — run `cd app && bun run format` after all changes.
- **Don't modify `components/ui/`** — those are generated shadcn components.
