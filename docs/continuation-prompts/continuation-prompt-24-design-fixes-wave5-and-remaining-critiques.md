# Continuation Prompt 24 -- Wave 5 Polish, Critique Fixes, and Final Design Pass

## Context

This continues from session 23 (Wave 4 Fixes + Full Critiques) which achieved:

### Completed: Wave 4 Fixes (6 items)

| # | Fix | Status | Files Changed |
|---|-----|--------|---------------|
| 24 | **Widen content area** from `max-w-[75ch]` to `max-w-3xl` (768px) | Done | `TrackLayout.tsx` -- both content wrapper and pagination nav updated |
| 29 | **Header nav buttons to `<Link>`** | Done | `Header.tsx` -- 4 buttons (2 desktop, 2 mobile) converted to `<Link>`, removed `useNavigate` and `handleTrackSwitch` |
| 32 | **Accordion trigger hover states** | Done | `accordion.tsx` -- `hover:underline` → `hover:bg-accent/50` |
| 33 | **Reactive `useReducedMotion` hook** | Done | `StarterKitSection.tsx` -- replaced static `getReducedMotion()` with hook using `useState` + `useEffect` + `matchMedia` listener |
| 35 | **ROI output card backgrounds** | Done | `RoiMeasurementSection.tsx` -- 4 cards changed from `bg-card` to `bg-muted/50` |
| — | **Prettier formatting fixes** | Done | `ScrollHint.tsx`, `TrackLayout.tsx`, `FeasibilityStudyBuilder.tsx`, `index.css` -- formatting from session 22 |

### Completed: Critical Fixes from New Critiques (4 items)

| Fix | Status | Files Changed |
|-----|--------|---------------|
| **Broken `aria-labelledby="intro-heading"`** on Skills/Extensions | Done | `SkillsExtensionsSection.tsx` -- removed attribute referencing non-existent element |
| **`scrollToCard` focus management** | Done | `SkillsExtensionsSection.tsx` -- replaced `setTimeout(100)` with double `requestAnimationFrame`, added accordion trigger focus via `[data-slot="accordion-trigger"]` selector |
| **3 hardcoded "Phew!" references** parameterised | Done | `SkillsExtensionsSection.tsx` -- imported `siteConfig`, used `siteConfig.companyName` in template literal (data array), JSX intro paragraph, and decision tree example labels |
| **CopyButton mobile/keyboard visibility** | Done | `BrandVoiceSection.tsx` -- 2 instances changed from `opacity-0 group-hover:opacity-100` to `sm:opacity-0 sm:group-hover:opacity-100 group-focus-within:opacity-100` |

### Completed: Full Design Critiques (2 pages)

| Page | Score | Report |
|------|-------|--------|
| **Skills, Extensions & Decision Tree** | 6.6/10 (3.3/5) | `agent-outputs/design-critique-skills-extensions.md` |
| **Brand Voice & UK English** | 7.4/10 (3.7/5) | `agent-outputs/design-critique-brand-voice.md` |

### Build & Commit Status

- Build, lint, and format all pass
- Committed as `ed77f14` and pushed to `main`
- Branch is up to date with `origin/main`

---

## Remaining Work

### From Skills/Extensions Critique (highest priority fixes)

| Priority | # | Issue | Effort |
|----------|---|-------|--------|
| **Critical** | C1 | Decision tree needs visual distinction from reference cards (Design Principle 3 violation) — add distinct background, border-left accent, or elevated card container | 1-2 hours |
| **Critical** | C4 | Add scroll affordance to horizontally-scrolling tables on mobile — reuse existing `ScrollHint` component | 1 hour |
| Important | I2 | Replace `setTimeout(100)` with reliable post-animation scroll — PARTIALLY DONE (rAF fix applied, but consider `onTransitionEnd` for robustness) | — |
| Important | I3 | Card-based mobile layout for availability/cost tables | 3-4 hours |
| Important | I4 | Increase "Learn more" button touch target to 44px | 15 min |
| Important | I5 | Add page-level section navigation / table of contents | 2-3 hours |
| Nice-to-have | N1 | Hoist PlatformBadge `colours` to module scope | 5 min |
| Nice-to-have | N2 | Replace string-based filter arrays with `devOnly` boolean | 1 hour |
| Nice-to-have | N3 | Convert combination patterns table to card layout | 1 hour |
| Nice-to-have | N4 | Extract data arrays (~710 lines) to separate data file | 30 min |

### From Brand Voice Critique (highest priority fixes)

| Priority | # | Issue | Effort |
|----------|---|-------|--------|
| **Critical** | C3 | Rename `phewExample` to `clientExample` in interface and all data references | 15 min |
| **Critical** | C4 | Extract `frameworkSections` client examples into configurable data layer | 1-2 hours |
| **Critical** | C5 | Parameterise "Head start for Phew!" callout (conditional on config) | 30 min |
| **Critical** | C6 | Replace hardcoded "Phew! example" accordion label with dynamic text | 10 min |
| Important | I1 | Extract duplicated step-rendering JSX into shared `SetupStepCard` component | 30 min |
| Important | I2 | Replace storage table with responsive card layout for mobile | 45 min |
| Important | I3 | Add `language` field to `SetupStep`; remove hardcoded `step.number === 2` check | 15 min |
| Important | I4 | Extract data constants to `brand-voice-data.ts` file | 30 min |

### Wave 4 Remaining (deferred — medium effort)

| # | Fix | Effort | Notes |
|---|-----|--------|-------|
| 25 | Add "on this page" anchor navigation for 5+ section pages | Medium | New component — ROI, Sessions, StarterKit, CLAUDE.md |
| 26 | Add icons to section H2 headings | Medium | Sessions, CLAUDE.md — visual anchoring |
| 27 | Use semantic list elements (`<ol>`, `<ul>`) for steps/practices | Small | CLAUDE.md, Sessions |

### Wave 5 Fixes (15 items — per-component refinements)

See `agent-outputs/design-audit-synthesis.md` items 36-50. These are per-component polish that can be done during or after templatisation.

### Parameterisation Issues (~47 client-specific refs remaining)

These overlap with the reusability implementation plan and should be resolved during templatisation:

| Page | Client Refs | Severity |
|------|------------|----------|
| Regression Testing | 16+ (Ghost Inspector structural) | Very Heavy |
| Avoiding Hallucinations | 7 prompt examples | Heavy |
| Brand Voice | 7 phewExample blocks + callout | Heavy |
| Recurring Tasks | 14 references | Medium |
| Governance | ~13 references | Medium |
| MCP Usage | 6 references | Medium |
| Plugins | 5 references | Medium |
| Skills/Extensions | ~~3 references~~ (DONE) | ~~Light~~ |
| Documentation | 3 references | Light |
| Codebase Mapping | 3 references | Light |
| Technical Debt | 1 reference | Light |

---

## Recommended Session Plan

### Priority 1: Skills/Extensions decision tree visual distinction (1-2 hours)

This is the single highest-impact remaining design fix — the page's centrepiece interactive tool is indistinguishable from the reference accordion below it.

Options:
- **Option A:** Wrap the decision tree in a distinct card with `border-2 border-primary/10 bg-primary/5 rounded-xl p-6` and add a header like "Find the Right Extension" with a distinct icon
- **Option B:** Add a coloured left border accent (`border-l-4 border-primary`) to the decision tree section
- **Option C:** Use a different background tint and slightly elevated shadow

Also add scroll affordance (C4) to the 3+ horizontally-scrolling tables using the existing `ScrollHint` component pattern.

### Priority 2: Brand Voice parameterisation (1 hour)

Quick wins — rename `phewExample` → `clientExample`, replace "Phew! example" labels with dynamic text, make the "Head start" callout conditional. These are the last reusability blockers identified in the critiques.

### Priority 3: Cherry-pick highest-value Wave 5 items (30-60 min)

If tokens remain, pick from:
- #42: Replace native range inputs with shadcn Slider (ROI page)
- #44: Use tabs/accordion for 5 copyable session templates
- #47: Add transition animation to Starter Kit tab switching
- #27: Semantic list elements for steps/practices

### Priority 4: Update synthesis document

Mark all newly completed items.

---

## Key Files

| Document | Purpose |
|----------|---------|
| `agent-outputs/design-audit-synthesis.md` | Primary reference — updated in session 23 with Wave 4 completions + new critique findings |
| `agent-outputs/design-critique-skills-extensions.md` | Full 10-dimension critique (session 23) — 20 findings |
| `agent-outputs/design-critique-brand-voice.md` | Full 10-dimension critique (session 23) — 16 findings |
| `agent-outputs/design-critique-*.md` | 6 earlier page critiques |
| `agent-outputs/design-triage-*.md` | 5 general track + 1 consolidated developer track triage reports |
| `docs/continuation-prompts/continuation-prompt-23-design-fixes-wave4-and-critiques.md` | Previous session's prompt |

## Build & Dev Commands

```bash
cd app && bun install
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format:check # Prettier check
```

## Cumulative Fix Summary (Sessions 21-23)

Total across three sessions: **~34 fixes** across ~20 source files:

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

### Session 23 (~10 fixes)
| File | Fixes |
|------|-------|
| `TrackLayout.tsx` | Content area widened to `max-w-3xl` (from `max-w-[75ch]`) |
| `Header.tsx` | Track nav buttons converted to `<Link>` elements, removed `useNavigate` |
| `accordion.tsx` | Hover state improved (`hover:underline` → `hover:bg-accent/50`) |
| `StarterKitSection.tsx` | `useReducedMotion` hook replacing static `getReducedMotion()` |
| `RoiMeasurementSection.tsx` | Output card backgrounds (`bg-card` → `bg-muted/50`) |
| `SkillsExtensionsSection.tsx` | Removed broken aria-labelledby, improved scrollToCard (rAF + focus management), parameterised 3 Phew refs with siteConfig |
| `BrandVoiceSection.tsx` | CopyButton mobile/keyboard visibility fix (sm:opacity-0 pattern) |
| `ScrollHint.tsx`, `FeasibilityStudyBuilder.tsx`, `index.css` | Prettier formatting fixes |
