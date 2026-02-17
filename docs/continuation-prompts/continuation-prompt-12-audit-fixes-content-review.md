# Continuation Prompt 12 — Audit Fixes, Content Review, ROI Section & Reusability

## Context

The Phew! AI Playbook is a React app (Vite + React 19 + Tailwind v4 + TypeScript) delivered to a UK-based design agency. It is live at https://ai-smb-playbook.vercel.app.

**Read first:** `CLAUDE.md` at the project root for conventions, tech stack, and critical rules.

---

## What Was Done in Previous Sessions

All build phases (0-7) are complete. The most recent work:

**Phase 7 -- Theme System** (commit `e5f59c3`):
- Three independent theming dimensions: light/dark mode, accessibility modes (dyslexia-friendly, high-contrast, large-text), creative themes (Retro Terminal, Synthwave, Minimal Ink)
- CSS custom property architecture across three cascade layers

**Semantic Token Migration** (commit `f155ff2`):
- Added 28 status tokens (5 families x 4 variants) and 8 segment tokens for the context simulator
- Defined tokens across all 8 theme layers
- Migrated ~100 hardcoded Tailwind palette classes across 17 component files to semantic tokens
- Eliminated ~60 `dark:` prefix overrides
- Zero hardcoded palette classes remaining in any `.tsx`/`.ts` file

**Frontend Design Audit** (completed 16 February 2026):
- Comprehensive audit saved to `.planning/audit/frontend-design-audit.md`
- Score: **82/100** -- strong foundation with excellent theming and token architecture
- **0 critical, 3 high, 8 medium, 6 low** issues identified (17 total)
- Anti-patterns check: **PASS -- does not look AI-generated**
- All 17 issues documented with specific file locations, WCAG references, and fix approaches

---

## What Remains (4 Workstreams)

| Workstream | Status | Estimated Effort |
|------------|--------|------------------|
| A: Frontend Audit Fixes (17 issues) | Not started | 2-3 hours |
| B: Content Review (all pages) | Not started | 2-3 hours |
| C: ROI Measurement Section (new feature) | Not started | 4-6 hours (research + build) |
| D: Reusability / Template System | Not started | 3-4 hours |

---

## Recommended Session Order

1. **Session 1: Workstream A** -- Fix all 17 audit issues. Start with `/frontend-design:harden` (8 issues including all high-severity), then `/frontend-design:polish` (4 issues), then `/frontend-design:optimize` (1 issue), then manual fixes (3 issues). This establishes the quality baseline.

2. **Session 2: Workstream B** -- Content review across all pages. Best done with a team/sub-agent approach for parallel page review. Depends on Workstream A being complete (some fixes affect content components).

3. **Session 3: Workstream C** -- ROI section. Independent of A and B. Can be parallelised with Session 2 if desired. Requires reading all 13 research articles first.

4. **Session 4: Workstream D** -- Reusability/template system. Must come LAST after all content is finalised. The reusability audit is already complete at `.planning/research/reusability-audit.md`.

---

## Workstream A: Frontend Audit Fixes (17 Issues)

**Full audit document:** `.planning/audit/frontend-design-audit.md`

### Prioritised Execution Order

#### Step 1: Run `/frontend-design:harden` (8 issues, includes all 3 high-severity)

| ID | Severity | Issue | Location | Fix |
|----|----------|-------|----------|-----|
| H1 | HIGH | Mobile menu button missing `aria-expanded` | `components/layout/Header.tsx:86-97` | Add `aria-expanded={mobileMenuOpen}` and `aria-controls` pointing to mobile nav `id` |
| H2 | HIGH | Range slider thumb below 44px touch target | `components/interactive/SimulatorControls.tsx:367-377` | Increase thumb to at least 24px (ideally 44px on mobile). Current: 16px. WCAG 2.5.8 |
| H3 | HIGH | Sidebar accessible names lack spacing | `components/layout/Sidebar.tsx:207-213` | Add trailing space or `\u00a0` after section number `<span>`, or use `aria-label` on the link |
| M1 | MEDIUM | Table headers missing `scope` attribute | `content/general/SessionManagementSection.tsx:94-99`, `content/developer/ClaudeMdSection.tsx:497-504` | Add `scope="col"` to all `<th>` in `<thead>`. BrandVoiceSection already does this correctly |
| M2 | MEDIUM | Collapsible triggers missing `aria-expanded` | `SessionManagementSection.tsx`, `BrandVoiceSection.tsx`, `SimulatorControls.tsx` | Verify all `CollapsibleTrigger` buttons have `aria-expanded`. Add manually for custom toggle buttons |
| M4 | MEDIUM | CopyButton hidden on desktop until hover (PromptExample) | `components/content/PromptExample.tsx:49` | Add `focus-within:opacity-100` to the group container |
| M5 | MEDIUM | CodeBlock CopyButton hidden with no mobile exception | `components/content/CodeBlock.tsx:58-63` | Apply `sm:opacity-0` pattern (visible on mobile), add `group-focus-within:opacity-100` for keyboard |
| M7 | MEDIUM | No 404 page -- catch-all silently redirects to homepage | `routes/router.tsx:36-38` | Create lightweight 404 page with navigation to both tracks |

#### Step 2: Run `/frontend-design:polish` (4 issues)

| ID | Severity | Issue | Location | Fix |
|----|----------|-------|----------|-----|
| M3 | MEDIUM | Homepage vertical whitespace imbalance | `components/layout/HomePage.tsx:20` | Consider `min-h-[calc(100vh-3.5rem)]` or may be resolved by ROI section addition |
| M6 | MEDIUM | Feedback widget overlaps content on mobile | `components/layout/FeedbackWidget.tsx:104-111` | Increase `bottom` offset, add safe area to pagination nav, or redesign pattern |
| L3 | LOW | Pagination links have small touch targets | `components/layout/TrackLayout.tsx:134-168` | Add `min-h-[44px]` to pagination links for mobile |
| L6 | LOW | Theme preview swatches use hardcoded oklch values | `components/layout/ThemeSettings.tsx:39-43` | Minor -- consider deriving from CSS custom properties |

#### Step 3: Run `/frontend-design:optimize` (1 issue)

| ID | Severity | Issue | Location | Fix |
|----|----------|-------|----------|-----|
| M8 | MEDIUM | Google Fonts loaded without `font-display: swap` | `index.html` or CSS `@import` | Verify `font-display: swap`, lazy-load creative theme fonts only on activation |

#### Step 4: Manual Fixes (3 issues)

| ID | Severity | Issue | Location | Fix |
|----|----------|-------|----------|-----|
| L1 | LOW | Footer button missing `type="button"` | `components/layout/Footer.tsx:27-33` | Add `type="button"` to the feedback button |
| L4 | LOW | `localStorage` access without try/catch | `components/layout/TrackLayout.tsx:27-29` | Wrap `localStorage.getItem()` in try/catch with fallback |
| L5 | LOW | Accordion items don't preserve open state | Multiple content sections | Low priority -- consider URL hash or localStorage persistence only if user feedback warrants |

#### Skipped (informational only)

| ID | Severity | Notes |
|----|----------|-------|
| L2 | LOW | Skip link target `#main-content` works correctly. No action needed. |

### Patterns to Standardise (from audit)

When fixing these issues, apply these standards across the codebase:

1. **Table accessibility:** Use `scope="col"` on all `<th>` elements in `<thead>`. BrandVoiceSection is the reference implementation.
2. **CopyButton visibility:** Standardise on the pattern: visible on mobile (`sm:opacity-0`), hover-reveal on desktop (`sm:group-hover:opacity-100`), keyboard-accessible (`group-focus-within:opacity-100`).
3. **`aria-expanded` on toggles:** Radix primitives handle this automatically. Custom toggle buttons (mobile menu, sidebar collapse) need manual `aria-expanded`.

---

## Workstream B: Content Review (All Pages)

### Approach

Deploy a team of parallel sub-agents, each reviewing a batch of pages. Each agent should:

1. Navigate to the page (or read the source component directly)
2. Check for the known issue categories listed below
3. Record findings in a structured format
4. Produce a findings report

### Known Issue Categories to Check

1. **Sentences running into each other** -- missing spacing between content blocks, paragraphs merging
2. **Copyable prompts extending full-width** -- prompts that should wrap but extend horizontally
3. **Prompt copy blocks containing non-prompt text** -- descriptions, context notes, or instructional text that shouldn't be included when a user copies the prompt into Claude
4. **General readability** -- formatting correctness, consistent heading hierarchy, logical content flow
5. **UK English consistency** -- any American spellings that slipped through
6. **Broken or missing links** -- internal navigation issues
7. **Component rendering issues** -- accordions, tabs, collapsibles not displaying correctly

### Full Page Catalog

#### General Track (8 sections visible to general users)

| ID | Slug | Title | Component File | URL Path |
|----|------|-------|---------------|----------|
| 1.1 | `welcome` | Welcome & Orientation | `content/shared/WelcomeSection.tsx` | `/general/welcome` |
| 1.2 | `context` | How Context Works | `content/general/ContextSimulatorSection.tsx` | `/general/context` |
| 1.3 | `sessions` | Session Management | `content/general/SessionManagementSection.tsx` | `/general/sessions` |
| 1.4 | `skills-extensions` | Skills, Extensions & Decision Tree | `content/general/SkillsExtensionsSection.tsx` | `/general/skills-extensions` |
| 1.5 | `governance` | AI Governance Policy | `content/general/GovernancePolicySection.tsx` | `/general/governance` |
| 1.6 | `brand-voice` | Brand Voice & UK English | `content/general/BrandVoiceSection.tsx` | `/general/brand-voice` |
| 1.7 | `recurring-tasks` | Recurring & Scheduled Tasks | `content/general/RecurringTasksSection.tsx` | `/general/recurring-tasks` |
| 1.16 | `starter-kit` | Starter Kit Contents | `content/shared/StarterKitSection.tsx` | `/general/starter-kit` |

#### Developer Track (16 sections: 8 shared + 8 developer-only)

| ID | Slug | Title | Component File | URL Path |
|----|------|-------|---------------|----------|
| 1.1 | `welcome` | Welcome & Orientation | `content/shared/WelcomeSection.tsx` | `/developer/welcome` |
| 1.2 | `context` | How Context Works | `content/general/ContextSimulatorSection.tsx` | `/developer/context` |
| 1.3 | `sessions` | Session Management | `content/general/SessionManagementSection.tsx` | `/developer/sessions` |
| 1.4 | `skills-extensions` | Skills, Extensions & Decision Tree | `content/general/SkillsExtensionsSection.tsx` | `/developer/skills-extensions` |
| 1.5 | `governance` | AI Governance Policy | `content/general/GovernancePolicySection.tsx` | `/developer/governance` |
| 1.6 | `brand-voice` | Brand Voice & UK English | `content/general/BrandVoiceSection.tsx` | `/developer/brand-voice` |
| 1.7 | `recurring-tasks` | Recurring & Scheduled Tasks | `content/general/RecurringTasksSection.tsx` | `/developer/recurring-tasks` |
| 1.8 | `claude-md` | CLAUDE.md Files | `content/developer/ClaudeMdSection.tsx` | `/developer/claude-md` |
| 1.9 | `documentation` | Documentation Structure | `content/developer/DocumentationSection.tsx` | `/developer/documentation` |
| 1.10 | `codebase-mapping` | Codebase Mapping | `content/developer/CodebaseMappingSection.tsx` | `/developer/codebase-mapping` |
| 1.11 | `hallucinations` | Avoiding Hallucinations | `content/developer/HallucinationsSection.tsx` | `/developer/hallucinations` |
| 1.12 | `regression-testing` | AI-Driven Regression Testing | `content/developer/RegressionTestingSection.tsx` | `/developer/regression-testing` |
| 1.13 | `mcp-usage` | Safe MCP Usage | `content/developer/McpUsageSection.tsx` | `/developer/mcp-usage` |
| 1.14 | `plugins` | Plugin Recommendations | `content/developer/PluginsSection.tsx` | `/developer/plugins` |
| 1.15 | `technical-debt` | Codebase Auditing & Technical Debt | `content/developer/TechnicalDebtSection.tsx` | `/developer/technical-debt` |
| 1.16 | `starter-kit` | Starter Kit Contents | `content/shared/StarterKitSection.tsx` | `/developer/starter-kit` |

#### Other Pages

| Page | Component | URL Path |
|------|-----------|----------|
| Homepage | `components/layout/HomePage.tsx` | `/` |
| Process Doc | `content/shared/ProcessDocPage.tsx` | `/process` |

#### Total Unique Components to Review: 17

The 8 shared sections (`track: 'both'`) use the same component for both tracks but may render differently based on `useTrack()`. Both track contexts should be checked for shared sections.

Unique components: `WelcomeSection`, `ContextSimulatorSection`, `SessionManagementSection`, `SkillsExtensionsSection`, `GovernancePolicySection`, `BrandVoiceSection`, `RecurringTasksSection`, `StarterKitSection`, `ClaudeMdSection`, `DocumentationSection`, `CodebaseMappingSection`, `HallucinationsSection`, `RegressionTestingSection`, `McpUsageSection`, `PluginsSection`, `TechnicalDebtSection`, `ProcessDocPage`

### Suggested Team Split for Content Review

- **Agent 1:** Shared sections (WelcomeSection, StarterKitSection) + Homepage + Process Doc + general-only sections 1.2-1.4 (ContextSimulator, Sessions, SkillsExtensions)
- **Agent 2:** General sections 1.5-1.7 (Governance, BrandVoice, RecurringTasks) + developer sections 1.8-1.10 (ClaudeMd, Documentation, CodebaseMapping)
- **Agent 3:** Developer sections 1.11-1.15 (Hallucinations, RegressionTesting, McpUsage, Plugins, TechnicalDebt)

### Output Format

Each agent should produce a report structured as:

```markdown
## [Section Title] (slug: `section-slug`)

### Issues Found
- [ ] **[Category]** Description of issue. Line reference if applicable.

### No Issues
(if the page is clean)
```

Consolidate into `.planning/audit/content-review-findings.md`.

---

## Workstream C: ROI Measurement Section (New Feature)

### Research Phase

Read and synthesise the 13 articles in `.planning/research/practical-ai-implementation-articles/`. These contain insights on ROI calculation, practical AI implementation, and value delivery for SMBs.

| Article | Title | Key Theme |
|---------|-------|-----------|
| `article-01.md` | Why AI Roadmaps Beat AI Projects | ROI estimation before spending |
| `article-02.md` | 3 Lessons from AI That Worked but Was Never Used | Adoption and value realisation |
| `article-03.md` | 5 Reasons Enterprise AI Fails | Failure patterns and fixes |
| `article-04.md` | AI First vs. First AI | Avoiding transformation theatre |
| `article-05.md` | 2025 Retrospective | Year-in-review insights |
| `article-06.md` | The Cost Cap Model | Controlling AI costs vs ROI |
| `article-07.md` | AI Workflows vs. AI Agents vs. Everything in Between | Architecture selection |
| `article-08.md` | The Profitable AI Organization | Operating models for AI products |
| `article-09.md` | From Ugly Data to Profitable Insights | Data quality and AI profitability |
| `article-10.md` | The AI Prototype-to-Production Checklist | Scaling readiness |
| `article-11.md` | 5 AI Modes for Business | Framework for AI applications |
| `article-12.md` | AI-Powered Process Mining | Process optimisation for profit |
| `article-13.md` | How We Cleaned 50,000+ Records in Less Than a Day with AI | Case study: data cleaning ROI |

### Synthesis Output

Save article synthesis to `.planning/research/roi-article-synthesis.md`. Extract:
- ROI calculation frameworks and formulas
- SMB-specific measurement approaches
- Common pitfalls in ROI measurement
- Case studies with concrete numbers
- UK/SMB-relevant examples

### Section Design

**Target:** New general track section, following existing content architecture.

**Section metadata (for `sections.ts`):**
- `id`: `1.X` (insert before Starter Kit, or after Recurring Tasks)
- `slug`: `roi-measurement` (or similar)
- `title`: Something like "Measuring AI ROI" or "AI Return on Investment"
- `track`: `'both'` (general audience primary, developer track also visible)
- `icon`: Suitable Lucide icon (e.g., `TrendingUp`, `Calculator`, `PoundSterling`)

**Component file:** `content/general/RoiMeasurementSection.tsx`

**Recommended interactive elements:**
1. **ROI Calculator** -- simple inputs (hours saved per week, hourly rate in GBP, tool cost per month) producing a monthly/annual ROI figure. Use UK currency (£).
2. **Before/After Comparison** -- side-by-side examples showing a task done manually vs with AI, with time and cost comparisons
3. **ROI Framework Accordion** -- expandable sections covering different ROI measurement approaches (time savings, error reduction, speed to market, employee satisfaction)
4. **Quick Wins vs Strategic Value** -- visual comparison helping SMBs understand short-term measurable wins vs long-term strategic value

**UK context requirements:**
- All monetary values in GBP (£)
- Reference UK-relevant regulatory/compliance considerations where applicable
- SMB-appropriate examples (not enterprise scale)
- Use UK English throughout

**Implementation steps:**
1. Read all 13 articles and produce synthesis document
2. Design the section spec (save to `.planning/specs/roi-measurement-spec.md`)
3. Create the component in `content/general/RoiMeasurementSection.tsx`
4. Register in `content/shared/registry.ts`
5. Add section metadata to `content/shared/sections.ts`
6. Verify build, lint, and format pass
7. Test in both track contexts

---

## Workstream D: Reusability / Template System

**Full audit document:** `.planning/research/reusability-audit.md`

This work should come LAST, after all content is finalised (Workstreams A-C complete).

### Current State

- `config/site.ts` already centralises all Tier 1 (shell/layout) values -- 15 locations across 8 files
- Tier 2: ~50 inline "Phew!" references across 16 content sections need parameterising
- Tier 3: Industry/tech-stack content that requires rewriting per client (ASP.NET, C#, SQL Server, WordPress, safeguarding domain, Ghost Inspector)
- Tier 4: Internal/planning files (no action needed for a fork)

### Planned Work

1. Replace all Tier 2 inline "Phew!" strings with `siteConfig.companyName` or similar config references
2. Rename `phewExample` data structures to `clientExample` in `RecurringTasksSection.tsx` and `BrandVoiceSection.tsx`
3. Create a `template` branch that strips Phew-specific Tier 3 content to generic placeholders
4. Document the forking/customisation process
5. Consider a content schema that separates structure (components, routing) from content (text, examples, code snippets)

### Key Files to Modify

- All files listed in the Tier 2 table of the reusability audit
- `content/general/RecurringTasksSection.tsx` -- `phewExample` field
- `content/general/BrandVoiceSection.tsx` -- `phewExample` field
- Any new sections added in Workstream C

---

## Documents to Read Before Starting Each Workstream

### Workstream A (Audit Fixes)

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Project conventions, tech stack, critical rules |
| `.planning/audit/frontend-design-audit.md` | Full audit with all 17 issues, file locations, fix approaches |

### Workstream B (Content Review)

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Project conventions, critical rules (especially UK English) |
| `.planning/audit/frontend-design-audit.md` | Section on "Content Issues (Task iii Preview)" for context |
| This continuation prompt | Full page catalog and review checklist |

### Workstream C (ROI Section)

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Project conventions, content architecture |
| `.planning/research/practical-ai-implementation-articles/article-01.md` through `article-13.md` | All 13 research articles |
| `.planning/phew-follow-up-handoff.md` | Original project planning document for section design patterns |
| Existing section components (e.g., `content/general/BrandVoiceSection.tsx`) | Reference for content component patterns, interactive elements |

### Workstream D (Reusability)

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Project conventions |
| `.planning/research/reusability-audit.md` | Full reusability audit with all tiers and file references |
| `app/src/config/site.ts` | Current centralised config (Tier 1 already done) |

---

## Architecture Quick Reference

```
app/src/
  ├── components/
  │   ├── content/     # CalloutCard, CopyButton, PromptExample, SectionPage, CodeBlock
  │   ├── interactive/ # ContextWindowSimulator, ContextWindowBar, SimulatorControls
  │   ├── layout/      # AppLayout, Header, Sidebar, Footer, HomePage, TrackLayout, FeedbackWidget, ThemeSettings
  │   └── ui/          # shadcn/ui primitives (do NOT manually edit)
  ├── content/
  │   ├── general/     # General track sections (7 section components)
  │   ├── developer/   # Developer track sections (8 section components)
  │   └── shared/      # Registry, types, sections data, StarterKit, Welcome, ProcessDocPage, simulator data
  ├── config/site.ts   # Centralised client-specific values
  ├── hooks/           # useCopyToClipboard, useTheme, useTrack
  ├── routes/          # router.tsx (React Router v7)
  └── styles/          # themes.css, a11y.css (token definitions)
```

**Token system:** 3-layer CSS cascade (base -> creative themes -> a11y). All semantic tokens bridged to Tailwind v4 via `@theme inline {}` in `index.css`. Status families: success, warning, info, important, danger. Segment tokens for context simulator.

**Section architecture:** Components live in `content/{general,developer}/`. Registered in `content/shared/registry.ts` (lazy-loaded). Metadata in `content/shared/sections.ts`. To add a new section: (1) create component, (2) add to registry, (3) add metadata to sections array.

**Track system:** `useTrack()` hook returns `{ track, isDev, isGeneral }`. Sections with `track: 'both'` appear in both tracks. Sections with `track: 'developer'` appear only in developer track.

**Routing:** `/:track/:section` where track is `general` or `developer` and section is the slug. Homepage at `/`. Process doc at `/process`. Catch-all redirects to `/`.

---

## Build Commands Reference

All commands run from the `app/` directory:

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format       # Prettier -- format all files
cd app && bun run format:check # Prettier -- check without writing
cd app && bun run preview      # Preview production build locally
cd app && bunx tsc --noEmit    # Type check only (no emit)
```

No test suite configured. Quality checks: `build` (TypeScript), `lint` (ESLint -- 0 errors), `format:check` (Prettier).

---

## Session Completion Checklist

Before ending each session, verify:

- [ ] `cd app && bun run build` passes
- [ ] `cd app && bun run lint` shows 0 errors
- [ ] `cd app && bun run format:check` passes (or run `format` to fix)
- [ ] Changes committed with descriptive message
- [ ] Any new findings documented in `.planning/audit/` or relevant location
- [ ] This continuation prompt updated if scope changes
