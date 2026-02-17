# Continuation Prompt 20 -- Design Audit Wave 2 + Synthesis

## Context

This continues a design audit session. The previous session completed:

1. **`/frontend-design:teach-impeccable` -- COMPLETE.** Design Context section was written to `CLAUDE.md` (appended after Client Context). Key principles: clarity over cleverness, hierarchy through restraint, interactive tools feel distinct, accessibility is architecture, respect the audience.

2. **Wave 1 critique agents launched (3 pages).** Three parallel subagents were spawned to critique pages 1-3. They should have written their findings to `agent-outputs/design-critique-{page-name}.md`. **Check these files exist before proceeding.**

## Lesson Learned

The previous session launched 3 Playwright-based critique agents simultaneously, but they all competed for the same browser instance. **For wave 2, use `agent-browser` skill or spawn agents sequentially** to avoid Playwright contention.

---

## This Session's Goals

### Step 1: Verify Wave 1 outputs exist

Check for these files:
```
agent-outputs/design-critique-home.md
agent-outputs/design-critique-roi-measurement.md
agent-outputs/design-critique-context.md
```

If any are missing, re-run that specific critique. Read each file to understand what was found.

### Step 2: Run Wave 2 critiques (pages 4-6)

**Run these ONE AT A TIME** (not in parallel) to avoid Playwright browser contention. Use `agent-browser` skill if available, or spawn sequential subagent critique tasks.

| # | Page | URL | Focus |
|---|------|-----|-------|
| 4 | Session Management | `/general/sessions` | Dense content with accordions, code examples, tables, mobile-adapted layouts |
| 5 | Starter Kit | `/general/starter-kit` | Large content page with file browser, tabs, installation guides, file cards with expand/collapse |
| 6 | Developer track sample | `/developer/claude-md` | Compare with general track quality -- accordions, tables, code templates, scoring rubric |

Each critique should:
- Navigate to the URL at multiple viewport widths (375px, 768px, 1024px, 1440px)
- Check dark mode
- Evaluate against the 10-point framework (visual hierarchy, emotional resonance, typography, colour, layout, motion, responsive, accessibility, AI slop test, interactive tools vs prose)
- Write findings to `agent-outputs/design-critique-{page-name}.md`

**Key questions each critique should answer:**
- Does the design feel professional and trustworthy for a B2B SMB audience?
- Are interactive tools (calculator, simulator, feasibility builder) visually distinct from prose content?
- Is the two-track experience (General/Developer) consistent in quality?
- Does the mobile experience feel intentional or like a responsive afterthought?
- Are accessibility modes seamlessly integrated rather than bolted on?

### Step 3: Synthesise all 6 critiques

After all 6 critique files exist, read them all and produce a synthesis document:

**Write to:** `agent-outputs/design-audit-synthesis.md`

Structure:
```markdown
# Design Audit Synthesis

## Executive Summary
[2-3 sentence overview]

## Scores by Page
| Page | Score | Key Strength | Key Weakness |
|------|-------|-------------|-------------|

## Issues by Severity

### Critical (must fix)
[Issues that break usability, accessibility, or trust]

### Important (should fix)
[Issues that reduce quality but don't break things]

### Nice-to-Have (polish)
[Issues that would elevate quality from good to great]

## Cross-Page Patterns
[Issues that appear on multiple pages -- fixing these has highest ROI]

## Recommended Fix Order
[Prioritised list: what to fix first for maximum impact]
```

### Step 4 (if time permits): Begin addressing high-priority findings

Start implementing fixes for critical/important issues identified in the synthesis.

---

## Key Files

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Project conventions + Design Context section (at the end) |
| `docs/reference/frontend-skills-review.md` | Design & engineering guidelines |
| `agent-outputs/design-critique-*.md` | Wave 1 + 2 critique outputs |
| `app/src/index.css` | Theme tokens, Tailwind v4 config |
| `app/src/styles/themes.css` | Creative theme overrides |
| `app/src/styles/a11y.css` | Accessibility mode overrides |
| `app/src/components/layout/TrackLayout.tsx` | Content layout with sidebar |
| `app/src/components/layout/HomePage.tsx` | Home page component |
| `app/src/content/general/RoiMeasurementSection.tsx` | ROI page (most interactive) |
| `app/src/content/general/ContextSimulatorSection.tsx` | Context simulator page |
| `app/src/content/general/SessionManagementSection.tsx` | Session management page |
| `app/src/content/shared/StarterKitSection.tsx` | Starter kit page |
| `app/src/content/developer/ClaudeMdSection.tsx` | Developer CLAUDE.md page |

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format:check # Prettier check
```

## Design Principles (from CLAUDE.md Design Context)

1. **Clarity over cleverness** -- every visual element must aid comprehension or be removed
2. **Hierarchy through restraint** -- typography and spacing do the work, not decoration
3. **Interactive tools feel distinct** -- calculators, simulators, wizards visually differentiated from prose
4. **Accessibility is architecture, not a layer** -- a11y modes, reduced motion, keyboard nav are structural
5. **Respect the audience** -- no AI slop, no hype, no generic template aesthetics

**Brand:** Practical, clear, approachable
**References:** Stripe Docs, Linear, Notion, Tailwind Docs
**Anti-refs:** Enterprise SaaS dashboards, AI startup landing pages, generic docs sites
