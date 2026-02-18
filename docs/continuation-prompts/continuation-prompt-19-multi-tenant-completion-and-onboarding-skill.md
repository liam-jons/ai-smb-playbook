# Continuation Prompt 19 — Multi-Tenant Completion & Client Onboarding Skill Investigation

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. Three outputs per client deployment:
1. **Interactive Playbook** -- React app with two audience tracks (General Users / Developers)
2. **Starter Kit** -- Drop-in skill files, commands, templates, governance policy
3. **Repeatable Workflow Process Doc** -- Internal process documentation

**Read first:** `CLAUDE.md` at the project root -- conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## What Was Accomplished (Sessions 17–18)

### Session 17 — Multi-Tenant Implementation (6 phases committed to `main`)

```
852714f feat: Phase 5 — documentation & onboarding guides
f6e1c2e feat: Phase 4 — Vercel Edge Middleware, multi-tenant feedback API, config caching
31993ec feat: Phase 2 — replace static siteConfig imports with React context
abc372f feat: Phase 1 — client config schema, Phew JSON, starter kit tiers
fca8d95 feat: Phase 3 — extract developer content to general track
```

Architecture: Single Vite SPA deployed on Vercel. Client identified by subdomain (e.g. `phew.playbook.aisolutionhub.co.uk`). Config loaded at runtime from `/clients/{slug}.json`, merged with defaults, cached in localStorage (1-hour TTL). React context (`ClientConfigProvider`) provides config to all components via `useSiteConfig()` hook.

### Session 18 — Multi-Tenant Audit

Ran 6 parallel audit agents (one per implementation phase) + browser testing across 4 production URLs. Full findings documented at `docs/audit-findings/20260218-multi-tenant/multi-tenant-implementation-audit.md`.

**Result:** 86% complete (64/74 items pass, 10 fail). Infrastructure layer is solid. Consumption layer has gaps.

---

## Outstanding Work (10 FAIL Items)

Read the full audit at `docs/audit-findings/20260218-multi-tenant/multi-tenant-implementation-audit.md` for complete details. Summary below.

### Theme 1: Section Visibility Gating (4 FAILs — Priority 1)

The `hasDeveloperTrack` flag and `sections.enabled`/`disabled` config fields exist in the schema but are never consumed. A client deployed with `hasDeveloperTrack: false` still sees the full developer track.

| FAIL | File | Issue |
|------|------|-------|
| 2.1 | `app/src/content/shared/sections.ts:196` | `getSectionsForTrack()` doesn't check `hasDeveloperTrack` |
| 2.2 | `app/src/components/layout/Sidebar.tsx:162` | "Switch to Developer track" link always visible |
| 2.3 | `app/src/components/layout/HomePage.tsx:122` | Developer track card always rendered |
| 2.4 | `app/src/content/shared/sections.ts` | `sections.enabled`/`disabled` config never read |

**Approach:** `getSectionsForTrack()` currently takes only `(track)`. It needs to also receive (or look up via hook) the client config to filter by `sections.enabled`/`disabled`. The Sidebar and HomePage need `useSiteConfig()` to check `hasDeveloperTrack`. The router (`app/src/routes/router.tsx`) may also need a guard to redirect `/developer/*` to `/general` when `hasDeveloperTrack` is false.

### Theme 2: Overlay Consumption (4 FAILs — Priority 2)

The overlay system is fully specified in schema and JSON but no component reads it. `useOverlays()` has zero callers.

| FAIL | File | Issue |
|------|------|-------|
| 1.1 | `app/src/content/shared/brand-voice-data.ts:234` | `getFrameworkSections()` ignores `overlays.brandVoice.frameworkExamples` |
| 1.2 | `app/src/content/general/BrandVoiceSection.tsx:46` | Never calls `useOverlays()`, ignores `headStartContent` |
| 1.3 | `app/src/content/general/RecurringTasksSection.tsx:70` | `getAutomationPatterns()` ignores `overlays.recurringTasks.examples` |
| 1.4 | `app/src/content/shared/roi-data.ts:110` | `getTaskTemplates()` ignores `overlays.roi.clientExamples` |

**Approach:** Each data factory function needs an optional overlays parameter. When overlay data is present for a given section, use it instead of (or merged with) the siteConfig-derived defaults. The components need to call `useOverlays()` and pass the overlay data to their factory functions. Precedence rule: overlay data replaces siteConfig-derived defaults when present.

**Key design decision:** Currently the factory functions take `SiteConfigData`. They need to either (a) take the full `ClientConfig` so they can access overlays, or (b) take an additional overlay parameter. Option (b) keeps the API cleaner.

### Theme 3: Starter Kit Tier Display (1 FAIL — Priority 3)

| FAIL | File | Issue |
|------|------|-------|
| 1.5 | `app/src/content/shared/StarterKitSection.tsx` | No base/custom split. All items shown regardless of `enabledCustomCategories`. |

**Approach:** The data model is ready (`tier` and `customCategory` on all items). The component needs to:
1. Read `starterKit.enabledCustomCategories` from config
2. Filter out custom items whose `customCategory` is not in the enabled list
3. Optionally group display into "Included" (base) and "Additional" (enabled custom) sections

### Theme 4: Default Config Branding (1 FAIL — Needs Decision)

| FAIL | File | Issue |
|------|------|-------|
| 3.1 | `app/src/config/config-loader.ts:15` | `DEFAULT_CONFIG` uses Phew values from `site.ts` |

**Options:**
- **Option A:** Make `DEFAULT_CONFIG` truly generic (placeholder values). The base domain would show "AI Playbook" rather than "Phew! AI Playbook". Requires creating a generic fallback that still looks professional.
- **Option B:** Always load a JSON file (even for "default"). Map the base domain to `phew.json` explicitly. The base domain remains Phew-branded.
- **Option C:** Leave as-is. Accept that the base domain shows Phew branding. Other clients get their own subdomains.

---

## Non-Blocking Concerns (7 items)

Also documented in the full audit. These are cleanup items, not blockers:

| ID | Issue | Effort |
|----|-------|--------|
| C1 | `x-client-id` middleware header set but never read | Remove header or add reader — 15 min |
| C2 | `extractClientSlug()` duplicated in 3 files | Extract to shared utility — 30 min |
| C3 | Slug sanitisation only in feedback API | Add to shared utility — 15 min |
| C4 | `DEFAULT_CONFIG.overlays` is `{}` | Bundle Phew overlays or always fetch JSON — 15 min |
| C5 | HallucinationsSection patterns not deduplicated | Accept as-is (developer-framed versions are better) — 0 min |
| C6 | FeedbackWidget has no client identifier | Add slug to payload — 15 min |
| C7 | CUSTOMISATION.md missing validation step | Add `bun run build` step — 5 min |

---

## Key Reference Files

| File | Purpose |
|------|---------|
| `docs/audit-findings/20260218-multi-tenant/multi-tenant-implementation-audit.md` | Full audit findings with all details |
| `.planning/plan-files/reusability-implementation-plan.md` | Original 6-phase implementation plan (source of truth for requirements) |
| `app/src/config/client-config-schema.ts` | `ClientConfig` TypeScript interface |
| `app/src/config/config-loader.ts` | Config loading, caching, slug extraction, `DEFAULT_CONFIG` |
| `app/src/config/client-config-context.tsx` | React context provider |
| `app/src/hooks/useClientConfig.ts` | `useSiteConfig()`, `useOverlays()`, `useSectionsConfig()` hooks |
| `app/src/content/shared/sections.ts` | Section registry, `getSectionsForTrack()` |
| `app/src/content/shared/brand-voice-data.ts` | `getFrameworkSections()` factory |
| `app/src/content/shared/roi-data.ts` | `getTaskTemplates()` factory |
| `app/src/content/general/RecurringTasksSection.tsx` | `getAutomationPatterns()` factory (inline) |
| `app/src/content/shared/StarterKitSection.tsx` | Starter kit display component |
| `app/src/components/layout/Sidebar.tsx` | Sidebar navigation |
| `app/src/components/layout/HomePage.tsx` | Home page with track selector |
| `app/public/clients/phew.json` | Phew client config (full overlays, all fields) |
| `app/public/clients/_template.json` | Template for new clients |
| `CUSTOMISATION.md` | Client deployment guide |
| `docs/repeatable-workflow.md` | Internal process doc with deployment section |
| `docs/reference/client-customisation-guide.md` | Per-section developer track customisation guide |

---

## Focus Areas for This Session

### Focus 1: Fix Outstanding FAIL Items (Themes 1–3)

Resolve the 10 FAIL items in priority order:
1. Section visibility gating (Theme 1) — most impactful for client deployments
2. Overlay consumption wiring (Theme 2) — enables per-client content customisation
3. Starter kit tier display (Theme 3) — completes the starter kit customisation story

For each theme, use the audit document's "Approach" notes as a starting point. Verify each fix with `bun run build` (type checking) and manual testing where appropriate.

### Focus 2: Client Onboarding Skill Investigation

Investigate what a Claude Code skill would require to automate the client onboarding workflow. The goal is a skill at `.claude/skills/client-onboarding/SKILL.md` that helps a consultant go from "I've just finished a training session" to "client deployment is live" with minimal manual effort.

**Inputs to study:**
- `CUSTOMISATION.md` (the 7-step process)
- `docs/repeatable-workflow.md` (the end-to-end workflow with deployment section)
- `app/public/clients/_template.json` (the template the skill would copy and populate)
- The `ClientConfig` schema (what fields the skill needs to populate)

**Questions to answer:**
1. What information does the skill need from the consultant? (Company name, industry, tech stack, etc.)
2. Can the skill extract this from a training transcript? (The consultant would paste/provide a transcript or notes)
3. What overlay content can be auto-generated vs needs manual input?
4. What's the right interaction pattern — guided wizard, or single-prompt generation?
5. What validation should the skill perform? (Schema conformance, required fields, `bun run build` check)

**Output:** A design document (not the skill itself) that captures the investigation findings and proposes a skill structure. The actual skill implementation would be a follow-up.

### Recommended Focus Order

Start with **Focus 1** (fix FAIL items) since this is concrete implementation work. Then move to **Focus 2** (skill investigation) as a research/design task. The FAIL fixes have clear requirements from the audit; the skill investigation is more exploratory.

---

## Important Notes

- **UK English throughout.** All content, examples, and copy must use UK English spelling and grammar.
- **Build check after changes:** `cd app && bun run build` (TypeScript + Vite build). Also `bun run lint` and `bun run format:check`.
- **No test suite.** Quality checks are build, lint, and format only.
- **Commit each theme separately** when fixing FAIL items. Don't bundle all changes into one commit.
- **The overlay design decision:** When wiring overlay consumption, use this precedence: overlay data replaces siteConfig-derived defaults when present. If overlays are absent (empty `{}` or missing key), fall back to the siteConfig-interpolated content.
