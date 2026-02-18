# Multi-Tenant Implementation Audit — 18 February 2026

> Consolidated findings from 6 parallel audit agents + browser testing against the implementation plan at `.planning/plan-files/reusability-implementation-plan.md`. Source session: `6245a17d-8590-411f-91a4-cffb12960f87`.

---

## Executive Summary

The multi-tenant architecture is **88% complete** (64/73 items pass). The infrastructure layer — schema, config loader, React context, factory functions, middleware, feedback API, documentation — is solid and production-ready. However, the **consumption layer** was not finished: overlay data is loaded but never rendered, section visibility flags are defined but never checked, and the starter kit tier system has data tags but no UI split.

**What works today:** A new client can be deployed by creating a JSON file, adding a Vercel subdomain, and the app will load their `siteConfig` values correctly (company name, branding, industry terms, tech stack). All ~25 component files read from React context rather than static imports.

**What doesn't work yet:** Overlay content (brand voice examples, recurring task examples, ROI examples), section visibility gating (`hasDeveloperTrack: false`, `sections.disabled`), and starter kit filtering by `enabledCustomCategories` are all dead infrastructure — defined in schema and JSON but with no UI consumer.

---

## Scorecard

| Phase | Description | Pass | Fail | Total | Score |
|-------|-------------|------|------|-------|-------|
| 0 | Quick Wins (genericisation, cleanup) | 25 | 0 | 25 | 100% |
| 1 | Content Extraction (schema, JSON, overlays) | 5 | 5 | 10 | 50% |
| 2 | Client Config Provider (React context) | 6 | 1 | 7 | 86% |
| 3 | Developer Track Content Extraction | 7 | 4 | 11 | 64% |
| 4 | Routing Middleware & Multi-Tenant | 11 | 0 | 11 | 100% |
| 5 | Documentation & Onboarding | 10 | 0 | 10 | 100% |
| **Total** | | **64** | **10** | **74** | **86%** |

---

## Outstanding Work — FAIL Items

### Theme 1: Overlay System Not Wired (5 items)

The overlay architecture is fully specified (schema, JSON, hooks) but no component consumes it. The `useOverlays()` hook has zero callers across the entire codebase.

#### FAIL 1.1 — `brand-voice-data.ts` ignores overlay data

**Plan reference:** Phase 1, §5.4
**File:** `app/src/content/shared/brand-voice-data.ts:234`
**Current state:** `getFrameworkSections(config: SiteConfigData)` generates all 7 `clientExample` strings by interpolating siteConfig fields (`companyName`, `complianceArea`, etc.). It does not accept or consume `overlays.brandVoice.frameworkExamples`.
**Expected:** Accept overlay content when available; fall back to siteConfig-derived defaults.
**Impact:** A client JSON with custom brand voice examples (e.g. prose written specifically for their brand) is ignored. Instead they get auto-generated examples from field interpolation.

#### FAIL 1.2 — `BrandVoiceSection.tsx` does not render overlay content

**Plan reference:** Phase 1, §5.4
**File:** `app/src/content/general/BrandVoiceSection.tsx:46-51`
**Current state:** Calls `useSiteConfig()` and passes to `getFrameworkSections(siteConfig)`. Never calls `useOverlays()`. The `headStartContent` overlay field is also unused — the head-start callout uses a generic hardcoded message.
**Expected:** Import overlay data, render `frameworkExamples` from overlay when present, render `headStartContent` in the head-start callout.

#### FAIL 1.3 — `RecurringTasksSection.tsx` ignores overlay data

**Plan reference:** Phase 1, §5.4
**File:** `app/src/content/general/RecurringTasksSection.tsx:70`
**Current state:** `getAutomationPatterns(siteConfig)` generates client examples by interpolating siteConfig fields. Does not read `overlays.recurringTasks.examples`.
**Expected:** Accept overlay examples when available; fall back to siteConfig-derived defaults.

#### FAIL 1.4 — `roi-data.ts` ignores overlay data

**Plan reference:** Phase 1, §5.4
**File:** `app/src/content/shared/roi-data.ts:110`
**Current state:** `getTaskTemplates(config: SiteConfigData)` builds `clientExample` blocks from siteConfig fields. Takes `SiteConfigData` (not full `ClientConfig`), so it cannot access overlays. The 3 overlay entries in `phew.json` are unused.
**Expected:** Accept overlay `clientExamples` by task ID when available; omit client example block when absent.

#### FAIL 1.5 — `StarterKitSection.tsx` has no base/custom tier display

**Plan reference:** Phase 1, §5.5
**File:** `app/src/content/shared/StarterKitSection.tsx`
**Current state:** Groups files by category (skill, command, template, etc.) but not by tier. Does not import `StarterKitTier`. Does not read `starterKit.enabledCustomCategories` from config. All items (base and custom) are shown regardless.
**Expected:** Show base items by default. Show custom items in a separate section, gated by `starterKit.enabledCustomCategories`.

---

### Theme 2: Section Visibility Gating Unimplemented (4 items)

The `hasDeveloperTrack` flag and `sections.enabled`/`disabled` config fields exist in the schema and default config but are never consumed.

#### FAIL 2.1 — `getSectionsForTrack()` does not respect `hasDeveloperTrack`

**Plan reference:** Phase 3, §7.4
**File:** `app/src/content/shared/sections.ts:196-198`
**Current state:**
```typescript
export function getSectionsForTrack(track: 'general' | 'developer'): Section[] {
  return sections.filter((s) => s.track === track || s.track === 'both');
}
```
No reference to `hasDeveloperTrack` or any client config.
**Expected:** When `hasDeveloperTrack` is `false`, the developer track should not be available (redirect to general, or return empty for developer track).

#### FAIL 2.2 — Sidebar does not hide developer track

**Plan reference:** Phase 3, §7.4
**File:** `app/src/components/layout/Sidebar.tsx:162-174`
**Current state:** A hardcoded "Switch to Developer track" link is always visible on the general track. No conditional check on `hasDeveloperTrack`.
**Expected:** Hide the "Switch to Developer track" link and developer track navigation when `hasDeveloperTrack` is `false`.

#### FAIL 2.3 — HomePage always shows both track cards

**Plan reference:** Phase 3, §7.4
**File:** `app/src/components/layout/HomePage.tsx:122-167`
**Current state:** Both the General Users card and the Developer card are always rendered. No conditional check on `hasDeveloperTrack`.
**Expected:** When `hasDeveloperTrack` is `false`, hide the Developer track card entirely.

#### FAIL 2.4 — `sections.enabled` / `sections.disabled` not consumed

**Plan reference:** Phase 3, §7.4
**File:** `app/src/content/shared/sections.ts`
**Current state:** Zero code reads `sections.enabled` or `sections.disabled`. A client config with `sections.disabled: ['regression-testing']` would have no effect.
**Expected:** `getSectionsForTrack()` (or a wrapper) filters out disabled sections and respects the enabled list.

---

### Theme 3: Default Config Leaks Phew Branding (1 item)

#### FAIL 3.1 — `DEFAULT_CONFIG` uses Phew values

**File:** `app/src/config/config-loader.ts:15-27`
**Current state:** `DEFAULT_CONFIG` spreads from `site.ts`, which is hardcoded with all Phew values. Any URL resolving to `"default"` slug (e.g. `playbook.aisolutionhub.co.uk`, `ai-smb-playbook.vercel.app`) shows "Phew! AI Playbook" branding.
**Expected:** The default config should contain generic/neutral values, or the base domain should resolve to the Phew config explicitly (e.g. via a `default.json` mapping or by always loading the Phew JSON for the base domain).
**Note:** This is a design decision rather than a bug — it depends on whether the base domain should be Phew-branded or generic. Either way, the current state means there is no unbranded/default version of the playbook.

---

## Non-Blocking Concerns

These are not failures against the plan but are worth addressing for production quality.

### C1 — `x-client-id` header is dead infrastructure

**Files:** `app/middleware.ts:20`, `app/api/feedback.ts`
The middleware sets `x-client-id` but nothing reads it. The feedback API independently re-derives the slug from Referer. The middleware matcher also excludes `/api` routes, so the feedback API couldn't read it even if it tried.
**Recommendation:** Either remove the header from middleware, or have the feedback API read it as a primary source with Referer as fallback.

### C2 — Duplicated `extractClientSlug()` logic

**Files:** `app/middleware.ts:25`, `app/src/config/config-loader.ts:30`, `app/api/feedback.ts:32`
Three independent implementations of the same function. Currently identical but will drift.
**Recommendation:** Extract to a shared utility (e.g. `app/src/utils/slug.ts`) imported by all three.

### C3 — Inconsistent slug sanitisation

**Files:** `app/api/feedback.ts:40-46` (has sanitisation), `app/middleware.ts` (none), `app/src/config/config-loader.ts` (none)
Only the feedback API validates slugs with `/^[a-z0-9-]+$/`. The config-loader uses unsanitised slugs in fetch URLs. The middleware injects unsanitised values into HTTP headers.
**Recommendation:** Add sanitisation to the shared `extractClientSlug()` utility.

### C4 — `DEFAULT_CONFIG.overlays` is empty

**File:** `app/src/config/config-loader.ts:22`
Even when overlay consumption is wired up, the default (Phew) deployment will get empty overlays because `DEFAULT_CONFIG.overlays` is `{}`. Only subdomain-loaded clients would get overlay content.
**Recommendation:** Either (a) bundle Phew overlay data into DEFAULT_CONFIG, or (b) always load `phew.json` for the Phew deployment instead of using bundled defaults.

### C5 — HallucinationsSection patterns not deduplicated

**File:** `app/src/content/developer/HallucinationsSection.tsx`
The plan (Phase 3, §7.3) said to "remove general-audience versions of Patterns 1, 2, 3, 5" from the developer section. Instead, they were kept with developer-specific framing. Both tracks have their own versions of these patterns. This appears to be a deliberate choice (developer versions use code examples) but doesn't match the plan's "remove" instruction.
**Recommendation:** Accept as-is — the cross-references between tracks are in place, and having developer-framed versions is arguably better than removing them.

### C6 — FeedbackWidget has no client identifier in submissions

**File:** `app/src/components/layout/FeedbackWidget.tsx`
The widget sends feedback but does not include the client slug, company name, or any tenant identifier. When multiple clients are deployed, feedback from different clients will be indistinguishable in the inbox (though the subject prefix from email config partially mitigates this).
**Recommendation:** Include the client slug in the feedback payload or email body.

### C7 — CUSTOMISATION.md missing validation step

**File:** `CUSTOMISATION.md`
No step instructs the consultant to run `bun run build` after creating a client JSON to validate it against the TypeScript schema.
**Recommendation:** Add a validation step between field population and deployment.

---

## Browser Testing Results

| URL | Status | Client Slug | Notes |
|-----|--------|-------------|-------|
| `playbook.aisolutionhub.co.uk` | Loads | `default` | Shows Phew branding (DEFAULT_CONFIG leak) |
| `phew.playbook.aisolutionhub.co.uk` | Loads | `phew` | Loads `phew.json` correctly, cached in localStorage |
| `ai-smb-playbook.vercel.app` | Loads | `default` | Identical to default site |
| `playbook.aisolutionhub.co.uk?client=phew` | Loads | `default` | Query param only works on localhost (by design) |

**Key finding:** All four URLs render identically because DEFAULT_CONFIG contains the same Phew values as `phew.json`. The multi-tenant routing works (subdomain → slug → JSON fetch → config merge → context), but there is no visible differentiation until a second client with different values is deployed.

Screenshots saved at `.playwright-mcp/01-default-site.png` through `06-developer-track-welcome.png`.

---

## Recommended Fix Order

1. **Section visibility gating** (FAILs 2.1–2.4) — Highest functional impact. Without this, a client deployed with `hasDeveloperTrack: false` still sees the full developer track.
2. **Overlay consumption wiring** (FAILs 1.1–1.4) — Required for per-client content customisation to work. The schema and JSON are ready; only the rendering side needs connecting.
3. **Starter kit tier display** (FAIL 1.5) — Lower priority but needed for client customisation of the starter kit contents.
4. **Default config branding** (FAIL 3.1) — Design decision needed on whether the base domain should be generic or Phew-branded.
5. **Non-blocking concerns** (C1–C7) — Cleanup pass. Most are 15–30 minute fixes.

---

## Estimated Remaining Effort

| Work Item | Effort |
|-----------|--------|
| Section visibility gating (4 FAILs) | 2–3 hours |
| Overlay consumption wiring (4 FAILs) | 3–4 hours |
| Starter kit tier display (1 FAIL) | 1–2 hours |
| Default config decision + fix (1 FAIL) | 30–60 min |
| Non-blocking concerns (7 items) | 2–3 hours |
| **Total** | **~9–13 hours** |

---

## Source Files (Audit Agent Outputs)

Recovered via `parse-subagents.py` from session `6245a17d-8590-411f-91a4-cffb12960f87`:

| Agent | Description | File |
|-------|-------------|------|
| `a38e07c` | Phase 0 audit (genericisation) | `01-audit-phase-0-genericisations.md` |
| `abc5f29` | Phase 1 audit (schema and JSON) | `02-audit-phase-1-schema-and-json.md` |
| `a840a1a` | Phase 2 audit (config provider) | `03-audit-phase-2-config-provider.md` |
| `a795577` | Phase 3 audit (content extraction) | `04-audit-phase-3-content-extraction.md` |
| `a3709ff` | Phase 4 audit (middleware/API) | `05-audit-phase-4-middlewareapi.md` |
| `ab6b59f` | Phase 5 audit (documentation) | `06-audit-phase-5-documentation.md` |
| `a97e854` | Browser testing (4 production URLs) | `07-browser-test-production-sites.md` |
