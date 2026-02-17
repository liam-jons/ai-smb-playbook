# Continuation Prompt 25 -- Remaining Polish, Parameterisation, and Wave 5

## Context

This continues from session 24 (Wave 5 Polish, Critique Fixes, and Final Design Pass) which achieved:

### Completed: Session 24 Fixes (7 items)

| # | Fix | Status | Files Changed |
|---|-----|--------|---------------|
| C1 (critique) | **Decision tree visual distinction** -- wrapped in `rounded-xl border-2 border-primary/10 bg-primary/[0.03]` container with Compass icon header, subtitle, `bg-card` accordion items | Done | `SkillsExtensionsSection.tsx` |
| C4 (critique) | **Scroll affordance on tables** -- combination patterns table and reference card comparison tables wrapped in `ScrollHint` with `min-w` constraints | Done | `SkillsExtensionsSection.tsx` |
| I4 (critique) | **Learn more button touch target** -- added `min-h-[44px]` to "Learn more in the reference card" button | Done | `SkillsExtensionsSection.tsx` |
| N1 (critique) | **PlatformBadge colours hoisted** to `platformColours` module-scope constant | Done | `SkillsExtensionsSection.tsx` |
| C3 (critique) | **Renamed `phewExample` to `clientExample`** in `FrameworkSection` interface and all 7 data entries | Done | `BrandVoiceSection.tsx` |
| C5 (critique) | **"Head start for Phew!" callout parameterised** -- title uses `siteConfig.companyName`, removed domain-specific "IMPACT values" text | Done | `BrandVoiceSection.tsx` |
| C6 (critique) | **"Phew! example" labels** replaced with `${siteConfig.companyName} example` | Done | `BrandVoiceSection.tsx` |

Additionally, 2 `clientExample` strings in `frameworkSections` data now use template literals with `siteConfig.companyName` (Brand Personality and Tone Spectrum entries).

### Build & Commit Status

- Build, lint, and format all pass
- Synthesis document (`agent-outputs/design-audit-synthesis.md`) updated with session 24 completions

---

## Remaining Work

### From Skills/Extensions Critique

| Priority | # | Issue | Effort | Notes |
|----------|---|-------|--------|-------|
| Important | I2 | Replace `setTimeout(100)` with reliable post-animation scroll -- PARTIALLY DONE (rAF fix applied in session 23, consider `onTransitionEnd` for robustness) | 30 min | Low priority, current implementation works |
| Important | I3 | Card-based mobile layout for availability/cost tables | 3-4 hours | Major effort |
| Important | I5 | Add page-level section navigation / table of contents | 2-3 hours | Also relevant to other dense pages |
| Nice-to-have | N2 | Replace string-based filter arrays with `devOnly` boolean | 1 hour | |
| Nice-to-have | N3 | Convert combination patterns table to card layout | 1 hour | |
| Nice-to-have | N4 | Extract data arrays (~710 lines) to separate data file | 30 min | |

### From Brand Voice Critique

| Priority | # | Issue | Effort | Notes |
|----------|---|-------|--------|-------|
| **Critical** | C4 | Extract `frameworkSections` client examples into configurable data layer | 1-2 hours | Remaining reusability blocker -- examples are still inline strings |
| Important | I1 | Extract duplicated step-rendering JSX into shared `SetupStepCard` component | 30 min | |
| Important | I2 | Replace storage table with responsive card layout for mobile | 45 min | |
| Important | I3 | Add `language` field to `SetupStep`; remove hardcoded `step.number === 2` check | 15 min | |
| Important | I4 | Extract data constants to `brand-voice-data.ts` file | 30 min | |

### Wave 4 Remaining (deferred)

| # | Fix | Effort | Notes |
|---|-----|--------|-------|
| 25 | Add "on this page" anchor navigation for 5+ section pages | Medium | New component |
| 26 | Add icons to section H2 headings | Medium | Visual anchoring |
| 27 | Use semantic list elements (`<ol>`, `<ul>`) for steps/practices | Small | CLAUDE.md, Sessions |

### Wave 5 Fixes (items 36-50)

See `agent-outputs/design-audit-synthesis.md`. Per-component polish that can be done during or after templatisation.

### Parameterisation Issues (~44 client-specific refs remaining)

| Page | Client Refs | Severity |
|------|------------|----------|
| Regression Testing | 16+ (Ghost Inspector structural) | Very Heavy |
| Avoiding Hallucinations | 7 prompt examples | Heavy |
| Brand Voice | ~5 remaining inline examples | Medium (reduced from 7) |
| Recurring Tasks | 14 references | Medium |
| Governance | ~13 references | Medium |
| MCP Usage | 6 references | Medium |
| Plugins | 5 references | Medium |
| Documentation | 3 references | Light |
| Codebase Mapping | 3 references | Light |
| Technical Debt | 1 reference | Light |

---

## Recommended Session Plan

### Priority 1: Brand Voice data extraction (C4 from critique)

Extract the 7 `clientExample` strings from `frameworkSections` into a client-configurable data layer (e.g., `config/client-examples.ts` or a section within `config/site.ts`). This is the last reusability blocker from the critiques.

### Priority 2: Brand Voice code quality (I1, I3, I4)

- Extract duplicated step-rendering JSX into shared `SetupStepCard` component
- Add `language` field to `SetupStep` interface to remove `step.number === 2` check
- Extract data constants to `brand-voice-data.ts`

### Priority 3: Cherry-pick highest-value Wave 5 items

If tokens remain:
- #42: Replace native range inputs with shadcn Slider (ROI page)
- #44: Use tabs/accordion for 5 copyable session templates
- #47: Add transition animation to Starter Kit tab switching
- #27: Semantic list elements for steps/practices

### Priority 4: Begin parameterisation sweep

Start with lightest pages (Technical Debt: 1 ref, Documentation: 3 refs, Codebase Mapping: 3 refs) to establish the pattern, then tackle heavier pages.

---

## Key Files

| Document | Purpose |
|----------|---------|
| `agent-outputs/design-audit-synthesis.md` | Primary reference -- updated in session 24 |
| `agent-outputs/design-critique-skills-extensions.md` | Full critique -- 20 findings (several now resolved) |
| `agent-outputs/design-critique-brand-voice.md` | Full critique -- 16 findings (several now resolved) |
| `app/src/content/general/SkillsExtensionsSection.tsx` | Decision tree + reference cards page |
| `app/src/content/general/BrandVoiceSection.tsx` | Brand voice + UK English page |
| `app/src/config/site.ts` | Client-specific values |

## Build & Dev Commands

```bash
cd app && bun install
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format:check # Prettier check
```

## Cumulative Fix Summary (Sessions 21-24)

Total across four sessions: **~41 fixes** across ~22 source files.

### Session 24 (7 fixes)
| File | Fixes |
|------|-------|
| `SkillsExtensionsSection.tsx` | Decision tree visual distinction (container, icon header, bg-card items), ScrollHint on combination patterns table + comparison tables, "Learn more" 44px touch target, PlatformBadge colours hoisted |
| `BrandVoiceSection.tsx` | `phewExample` renamed to `clientExample`, "Phew! example" labels use siteConfig, "Head start" callout parameterised, 2 clientExample strings use siteConfig template literals |
