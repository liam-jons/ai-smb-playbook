# Continuation Prompt 21 -- Design Audit Triage & Fix Implementation

## Context

This continues from a design audit session that:

1. **Ran full 10-dimension critiques on 6 key pages** (Home, ROI Measurement, Context Simulator, Session Management, Starter Kit, Developer CLAUDE.md). Individual critique files are at `agent-outputs/design-critique-{page-name}.md`.

2. **Produced a comprehensive synthesis document** at `agent-outputs/design-audit-synthesis.md` containing **127 total findings** (5 Critical, 37 Important, 85 Nice-to-Have) with a recommended fix order across 5 waves. This document is the single source of truth for all design audit work.

3. **Identified 14 unaudited pages** that need at minimum a lightweight triage pass before the application is converted from a single-client deployment to a reusable template (see `.planning/plan-files/reusability-implementation-plan.md` for the templatisation plan).

---

## This Session's Goals

### Step 1: Deploy triage agents to unaudited general track pages (priority)

Deploy **parallel triage agents** to the 5 unaudited general track pages. These are highest priority because they affect all users and contain content that will be templatised.

| # | Page | Route | Component File | Why It Matters |
|---|------|-------|----------------|----------------|
| 1 | Welcome & Orientation | `/general/welcome` | `app/src/content/shared/WelcomeSection.tsx` | Entry point for both tracks, first content page users see |
| 2 | Skills, Extensions & Decision Tree | `/general/skills-extensions` | `app/src/content/general/SkillsExtensionsSection.tsx` | Complex interactive content (decision tree), 60 Claude references |
| 3 | AI Governance Policy | `/general/governance` | `app/src/content/general/GovernancePolicySection.tsx` | Contains parameterised governance template, reusability target |
| 4 | Brand Voice & UK English | `/general/brand-voice` | `app/src/content/general/BrandVoiceSection.tsx` | Key reusability target (client overlay content) |
| 5 | Recurring & Scheduled Tasks | `/general/recurring-tasks` | `app/src/content/general/RecurringTasksSection.tsx` | Contains client-specific examples |

**Each triage agent should:**

1. **Read the component source file** and any associated data files
2. **Navigate to the page** at `http://localhost:4100/{route}` at 1440px and 375px viewports (light mode)
3. **Check for known cross-page issues:**
   - Routing bug on viewport resize (C1 in synthesis)
   - Dark mode card/surface contrast (I4)
   - CalloutCard `role="alert"` misuse (I17)
   - Content area narrow at 1440px (I1)
   - Pagination nav width mismatch (N31)
   - Feedback FAB overlap on mobile (N56)
4. **Identify page-specific issues:**
   - Are there interactive tools that need the "tools feel distinct" treatment?
   - Any content quality issues: editorial notes left in production content, third-person language, overused meta-narrative context (there should be only one reference in the app -- it's in WelcomeSection)
   - Any unique responsive or accessibility problems beyond the known cross-page ones
   - Any client-specific content ("Phew!", "Ghost Inspector", "ASP.NET") that the reusability plan hasn't already catalogued
5. **Produce a verdict:** either "cross-page fixes are sufficient" or "full critique needed -- here's why"

**Write each triage report to:** `agent-outputs/design-triage-{page-slug}.md`

**Important:** Run the dev server first: `cd app && bun run dev` (port 4100). Use `agent-browser` skill or sequential browser automation to avoid Playwright contention (lesson from the previous critique session -- parallel browser agents compete for the same instance).

### Step 2: Deploy triage agents to unaudited developer track pages

If tokens permit after Step 1, deploy **sequential triage agents** to the 7 unaudited developer track pages. These are lower priority because they will undergo significant content rewriting during templatisation, but we still need to know if there are any critical issues.

| # | Page | Route | Component File |
|---|------|-------|----------------|
| 6 | Documentation Structure | `/developer/documentation` | `app/src/content/developer/DocumentationSection.tsx` |
| 7 | Codebase Mapping | `/developer/codebase-mapping` | `app/src/content/developer/CodebaseMappingSection.tsx` |
| 8 | Avoiding Hallucinations | `/developer/hallucinations` | `app/src/content/developer/HallucinationsSection.tsx` |
| 9 | AI-Driven Regression Testing | `/developer/regression-testing` | `app/src/content/developer/RegressionTestingSection.tsx` |
| 10 | Safe MCP Usage | `/developer/mcp-usage` | `app/src/content/developer/McpUsageSection.tsx` |
| 11 | Plugin Recommendations | `/developer/plugins` | `app/src/content/developer/PluginsSection.tsx` |
| 12 | Codebase Auditing & Technical Debt | `/developer/technical-debt` | `app/src/content/developer/TechnicalDebtSection.tsx` |

These can use a lighter-touch triage (source code review + single viewport check) since full critiques are less valuable for pages that will be substantially rewritten.

### Step 3: Update synthesis with triage findings

After all triage reports are written, update `agent-outputs/design-audit-synthesis.md`:
- Update the "Audit Coverage" section to reflect triage status
- Add any new Critical or Important findings to the appropriate severity tier
- Update "Appendix C" with the actual triage verdicts

### Step 4: Begin implementing fixes (if tokens remain)

Start with **Wave 1** from the synthesis (critical fixes + quick wins). These are the highest-priority items:

| # | Fix | Effort | Location |
|---|-----|--------|----------|
| 1 | **Investigate and fix the routing bug** | Medium | `TrackLayout.tsx` lines 62-72 |
| 2 | **Fix "1 days" grammar bug** | Trivial | `RoiMeasurementSection.tsx:275` |
| 3 | **Add `aria-label` to home page card links** | Trivial | `HomePage.tsx:39,81` |
| 4 | **Fix CalloutCard `role="alert"` for all variants** | Small | `CalloutCard.tsx` |
| 5 | **Fix pagination nav width mismatch** | Trivial | Pagination component |

Items 2-5 are trivial/small and can be done by **parallel subagents**. Item 1 (routing bug) requires investigation and should be done by a dedicated agent.

After Wave 1, proceed to **Wave 2** (high-impact visual fixes) if tokens allow. See the synthesis document for the full prioritised list.

**After each wave of fixes, run:** `cd app && bun run build && bun run lint` to verify nothing is broken.

---

## Key Files

| Document | Purpose |
|----------|---------|
| `agent-outputs/design-audit-synthesis.md` | **Primary reference** -- comprehensive synthesis with all 127 findings, fix order, and templatisation impact |
| `agent-outputs/design-critique-*.md` | Individual page critiques (6 files) with full detail |
| `.planning/plan-files/reusability-implementation-plan.md` | Templatisation plan -- context for why design quality matters now |
| `roi-and-reusability-next-steps.md` | User notes on content review requirements |
| `CLAUDE.md` | Project conventions + Design Context section (principles, brand, anti-references) |
| `docs/reference/frontend-skills-review.md` | Design & engineering guidelines |

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format:check # Prettier check
```

## Design Principles (from CLAUDE.md)

1. **Clarity over cleverness** -- every visual element must aid comprehension or be removed
2. **Hierarchy through restraint** -- typography and spacing do the work, not decoration
3. **Interactive tools feel distinct** -- calculators, simulators, wizards visually differentiated from prose
4. **Accessibility is architecture, not a layer** -- a11y modes, reduced motion, keyboard nav are structural
5. **Respect the audience** -- no AI slop, no hype, no generic template aesthetics

## Lessons Learned from Previous Sessions

- **Playwright contention:** Running multiple browser-based critique agents in parallel causes them to compete for the same Playwright browser instance. Run browser-based agents sequentially, or use `agent-browser` skill.
- **Token management:** The previous session ran 6 full critiques which consumed most tokens. Triage agents should be lightweight -- read source + quick visual check, not full 10-dimension audits.
- **Source code review is efficient:** Many issues (accessibility roles, semantic HTML, heading hierarchy, data structure patterns) can be identified from source code alone without browser automation. Reserve browser checks for visual/responsive issues.

## Content Review Checklist (from roi-and-reusability-next-steps.md)

While triaging, also flag these content quality issues if spotted:
- [ ] Editorial notes left in production content (previous example: "Honest about the gaps. This builds trust -- the playbook is not overselling.")
- [ ] Any third-person language (should be second-person "you/your")
- [ ] Overused meta-narrative context (should be only one reference in the app, in WelcomeSection)
- [ ] Client-specific content not yet catalogued in the reusability plan
