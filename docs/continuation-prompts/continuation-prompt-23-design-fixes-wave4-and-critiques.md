# Continuation Prompt 23 -- Design Fixes Wave 4+, Full Critiques, and Final Polish

## Context

This continues from session 22 (Design Fixes Wave 2+ and Synthesis Update) which achieved:

### Completed: Synthesis Document Update

The `agent-outputs/design-audit-synthesis.md` has been fully updated:
- Audit coverage section now shows 6 full critiques + 12 triaged pages (only Process Doc and 404 remain unaudited -- not worth auditing)
- New findings C6, C7, I38-I41 added from triage results
- All completed fixes marked with "(DONE)" in Wave tables
- Appendix C replaced with triage results summary

### Completed: Wave 2 Remaining Fixes (2 items)

| # | Fix | Status | Files Changed |
|---|-----|--------|---------------|
| 6 | **Differentiate home page track cards** | Done | `HomePage.tsx` -- blue accent for general, violet for developer; curated unique section previews (not first-4-shared); `<h2>` card titles; `md:` grid breakpoint; `hover:shadow-md`; distinct icons (BookOpen/Terminal) |
| 7 | **Rewrite home page hero** | Done | `HomePage.tsx` -- left-aligned; fluid type via `clamp()`; action-oriented h1 ("Your practical guide to working with Claude AI"); `siteConfig.consultantName` + `trainingDate` warmth; prominent pill-style CTAs |

### Completed: Wave 3 Fixes (10 of 11 items)

| # | Fix | Status | Files Changed |
|---|-----|--------|---------------|
| 13 | **Add entrance animations** to Home, Sessions, CLAUDE.md | Done | `HomePage.tsx`, `SessionManagementSection.tsx`, `ClaudeMdSection.tsx` -- `motion.div`/`motion.section` with fade-up, staggered delays |
| 15 | **Fix mobile tab labels on Starter Kit** | Done | `StarterKitSection.tsx` -- `CATEGORY_SHORT_LABELS` constant with meaningful abbreviations |
| 16 | **Add visual separators to Session Management** | Done | `SessionManagementSection.tsx` -- `<Separator className="my-2" />` between 6 major sections |
| 17 | **Fix mobile table/code overflow indicators** | Done | `CodeBlock.tsx`, `ShikiHighlighter.tsx`, new `ScrollHint.tsx` component, `index.css` -- JS-driven scroll hints for code blocks + CSS-only scroll shadows for tables |
| 18 | **Fix Before/After colour-only semantic meaning** | Done | `ClaudeMdSection.tsx` -- `X` and `Check` icons added alongside text labels |
| 19 | **Add `aria-label` to Starter Kit file card buttons** | Done | `StarterKitSection.tsx` -- `aria-label={View/Collapse ${file.name} details}` |
| 20 | **Fix Radix `aria-describedby` warnings** | Done | `sheet.tsx`, `dialog.tsx` -- `aria-describedby={undefined}` default on Content components |
| 21 | **Fix Starter Kit H1/H2 size collision** | Done | `StarterKitSection.tsx` -- H2 stepped down to `text-xl sm:text-2xl` |
| 22 | **Fix mobile tab overlap on ROI page** | Done | `RoiMeasurementSection.tsx` -- `mb-2` on TabsList |
| 23 | **Add feasibility step titles to desktop indicator** | Done | `FeasibilityStudyBuilder.tsx` -- step titles visible at `lg:` breakpoint with `truncate` |

### Bonus Fix (from Wave 4)

| # | Fix | Status | Files Changed |
|---|-----|--------|---------------|
| 34 | **Add context-specific `aria-label` to session copy buttons** | Done | `CopyButton.tsx` (new `ariaLabel` prop), `PromptExample.tsx` (new `copyAriaLabel` prop), `SessionManagementSection.tsx` (unique labels per prompt) |

### Build Status

All fixes pass `bun run build` and `bun run lint` (verified after each sub-agent completed). A final combined build verification should be run at the start of the next session as multiple agents wrote to files concurrently.

### What Was NOT Committed

No git commit was made in session 22. All changes from sessions 21 and 22 are still uncommitted (21 files changed, ~341 insertions, ~752 deletions). The next session should:
1. Run a full build verification
2. Review and commit all changes
3. Continue with remaining work

---

## Remaining Issues Overview

### Remaining Wave 4 Fixes (11 items, ~8 still pending)

| # | Fix | Effort | Location | Notes |
|---|-----|--------|----------|-------|
| 24 | Consider widening `max-w-[75ch]` or breakout for interactive sections | Medium | `TrackLayout.tsx` | Affects all content pages |
| 25 | Add "on this page" anchor navigation for 5+ section pages | Medium | New component | ROI, Sessions, StarterKit, CLAUDE.md |
| 26 | Add icons to section H2 headings | Medium | Sessions, CLAUDE.md | Visual anchoring |
| 27 | Use semantic list elements (`<ol>`, `<ul>`) for steps/practices | Small | CLAUDE.md, Sessions | |
| 28 | Fix home page card grid breakpoint (`sm:` -> `md:`) | **DONE** (fixed as part of Wave 2 #6) | `HomePage.tsx` | Already changed to `md:grid-cols-2` |
| 29 | Convert header track nav buttons to `<Link>` elements | Small | `Header.tsx` | Enables right-click/middle-click |
| 30 | Make card titles `<h2>` on home page | **DONE** (fixed as part of Wave 2 #6) | `HomePage.tsx` | Already using `<h2>` in CardTitle |
| 32 | Improve accordion trigger hover states | Small | Accordion usage across pages |
| 33 | Fix `getReducedMotion()` to use `matchMedia` listener | Small | `StarterKitSection.tsx` |
| 35 | Improve ROI calculator output card backgrounds in light mode | Trivial | `RoiMeasurementSection.tsx` |

### Remaining Wave 5 Fixes (15 items)

See `agent-outputs/design-audit-synthesis.md` items 36-50. These are per-component refinements that can be done during or after templatisation.

### Full Design Critiques Needed (2 pages)

These were identified during triage and should be done before templatisation:

1. **Skills, Extensions & Decision Tree** (`/general/skills-extensions`)
   - Decision tree violates Design Principle 3 (interactive tools must feel distinct)
   - `TooltipTrigger` wrapping `<td>` = invalid HTML (C7)
   - 6+ tables creating cognitive overload on mobile
   - Cross-accordion linking fragile (100ms setTimeout)
   - 3 hardcoded "Phew!" references
   - Triage report: `agent-outputs/design-triage-skills-extensions.md`

2. **Brand Voice & UK English** (`/general/brand-voice`)
   - 7 hardcoded `phewExample` blocks (reusability blocker)
   - "Head start for Phew!" callout
   - Extensive industry terminology (safeguarding, IMPACT, ISO certs)
   - All need extraction to client-configurable data layer
   - Triage report: `agent-outputs/design-triage-brand-voice.md`

### Parameterisation Issues (~50 client-specific refs)

These overlap with the reusability implementation plan and should be resolved during templatisation, not as standalone design fixes:

| Page | Client Refs | Severity |
|------|------------|----------|
| Regression Testing | 16+ (Ghost Inspector structural) | Very Heavy |
| Avoiding Hallucinations | 7 prompt examples | Heavy |
| Brand Voice | 7 phewExample blocks + callout | Heavy |
| Recurring Tasks | 14 references | Medium |
| Governance | ~13 references | Medium |
| MCP Usage | 6 references | Medium |
| Plugins | 5 references | Medium |
| Skills/Extensions | 3 references | Light |
| Documentation | 3 references | Light |
| Codebase Mapping | 3 references | Light |
| Technical Debt | 1 reference | Light |

---

## Recommended Session Plan

### Priority 1: Verify and commit (5 min)

```bash
cd app && bun run build && bun run lint && bun run format:check
```

Check if the overflow scroll hints agent (Wave 3 #17) completed successfully. If not, implement it. Then commit all changes from sessions 21-22.

### Priority 2: Wave 4 remaining fixes (30-40 min)

Focus on the high-value items:
- #24: Content width for interactive sections (medium effort, high impact)
- #29: Header nav buttons to `<Link>` (small effort, a11y improvement)
- #33: `getReducedMotion()` matchMedia listener (small effort, a11y)
- #35: ROI output card backgrounds (trivial)

Skip #25 (anchor navigation) and #26 (section icons) as medium-effort items that can wait.

### Priority 3: Full critiques (40-60 min)

Run full 10-dimension design critiques on:
1. Skills/Extensions page -- focus on decision tree differentiation and table mobile UX
2. Brand Voice page -- focus on reusability architecture (data extraction)

Use sub-agents for these critiques to manage context.

### Priority 4: Wave 5 polish (if tokens remain)

Cherry-pick the highest-value Wave 5 items (see synthesis document items 36-50).

### Priority 5: Update synthesis document

Mark all newly completed items and add any new findings from the full critiques.

---

## Key Files

| Document | Purpose |
|----------|---------|
| `agent-outputs/design-audit-synthesis.md` | Primary reference -- updated in session 22 with triage results and fix status |
| `agent-outputs/design-triage-*.md` | 5 general track + 1 consolidated developer track triage reports |
| `agent-outputs/design-critique-*.md` | 6 original page critiques |
| `docs/continuation-prompts/continuation-prompt-22-design-fixes-wave2-onwards.md` | Previous session's prompt |

## Build & Dev Commands

```bash
cd app && bun install
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format:check # Prettier check
```

## Cumulative Fix Summary (Sessions 21-22)

Total across both sessions: **~24 fixes** across ~17 source files:

### Session 21 (13 fixes)
| File | Fixes |
|------|-------|
| `RoiMeasurementSection.tsx` | "1 days" grammar (x2), ROI calculator visual container, aria-valuetext on 2 sliders |
| `HomePage.tsx` | aria-label on 2 card links, removed min-height empty space |
| `CalloutCard.tsx` | Variant-aware ARIA roles |
| `TrackLayout.tsx` | Pagination nav width, mobile FAB padding |
| `ContextWindowBar.tsx` | Legend visible on all viewports |
| `index.css` | Dark mode card contrast, dark mode callout contrast |

### Session 22 (~11 fixes)
| File | Fixes |
|------|-------|
| `HomePage.tsx` | Full rewrite: differentiated cards, warm hero, fluid type, `<h2>` titles, `md:` breakpoint, entrance animations |
| `ClaudeMdSection.tsx` | Before/After icons (X/Check), entrance animation on first section |
| `SessionManagementSection.tsx` | Separators between sections, entrance animation, context-specific copy button labels |
| `StarterKitSection.tsx` | Mobile tab labels, file card aria-labels, H1/H2 size hierarchy |
| `RoiMeasurementSection.tsx` | Tab overlap margin fix |
| `FeasibilityStudyBuilder.tsx` | Step titles on desktop indicator |
| `CopyButton.tsx` | New `ariaLabel` prop |
| `PromptExample.tsx` | New `copyAriaLabel` passthrough prop |
| `sheet.tsx` | Radix aria-describedby suppression |
| `dialog.tsx` | Radix aria-describedby suppression |
| `CodeBlock.tsx` | Wrapped in ScrollHint for overflow fade gradients |
| `ShikiHighlighter.tsx` | Removed redundant overflow-x-auto (now owned by ScrollHint) |
| `ScrollHint.tsx` | New reusable component for scroll overflow indicators |
| `index.css` | Scroll hint styles + CSS-only table scroll shadows |
