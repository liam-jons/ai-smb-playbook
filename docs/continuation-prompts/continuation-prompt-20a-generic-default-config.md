# Continuation Prompt 20a — Generic Default Config, AI Solution Hub Branding & Client Logo Feasibility

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. The app is deployed as a multi-tenant SPA — each client gets a subdomain and a JSON config file. A single build serves all clients.

**Read first:** `CLAUDE.md` at the project root -- conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

**This session is independent of the main session 20** (`continuation-prompt-20-cleanup-and-onboarding-skill.md`). It can be run in parallel without conflicts, provided the file ownership boundaries below are respected.

---

## Problem

`DEFAULT_CONFIG` in `app/src/config/config-loader.ts` is hardcoded with Phew Design Limited branding (imported from `app/src/config/site.ts`). When a client config fails to load or the hostname resolves to slug `"default"`, the app shows Phew's company name, industry context, compliance area, and all other client-specific values. This is incorrect for a multi-tenant application — an unconfigured deployment or fallback should show generic, neutral content rather than another client's branding.

**Chosen approach: Option A** — Make `DEFAULT_CONFIG` truly generic. The base domain (`playbook.aisolutionhub.co.uk`) shows neutral "AI Playbook" content. Phew continues to get its full branded experience via `phew.json` loaded on its subdomain (`phew.playbook.aisolutionhub.co.uk`).

---

## Completed Work (for context)

The multi-tenant implementation is complete across sessions 17--19. Key recent commits:

| Commit | What |
|--------|------|
| `c98b944` | Section visibility gating — `hasDeveloperTrack` and `sections.enabled/disabled` consumed |
| `3010173` | Overlay consumption wiring — brand voice, recurring tasks, ROI all read overlay data with siteConfig fallback |
| `c246a24` | Starter kit tier display — base/custom split with category gating |

The overlay fallback mechanism is critical context: when `overlays` is empty (`{}`), all content sections fall back to interpolating `siteConfig` field values into prose. This means the generic `siteConfig` values must read naturally when inserted into sentences throughout the app.

### Build Status

- `cd app && bun run build` -- pass
- `cd app && bun run lint` -- pass
- `cd app && bun run format:check` -- pass

---

## User Decisions (Confirmed)

All four decisions have been confirmed by the user:

1. **App title and branding identity — Hybrid (c).** App title `"AI Playbook"` (neutral), but `consultantName` and feedback emails reference AI Solution Hub. The footer attribution line is updated to reference the AI Solution Hub brand (see Task 7 below).
2. **Developer track — Both tracks enabled (a).** Generic developer values (`techStack: "your tech stack"`, etc.) to showcase the full product.
3. **Industry and domain context — Literally generic (a).** `industry: "your industry"`, `complianceArea: "your compliance area"`, etc.
4. **Base domain intent — Demo/showcase (a).** The base domain should look polished and professional, suitable for sales conversations.

---

## What This Session Does

### Task 1: Create generic siteConfig values (main work)

**Files to modify:**
- `app/src/config/site.ts` — Update all values to generic equivalents
- `app/src/config/config-loader.ts` — Verify `DEFAULT_CONFIG` correctly spreads the updated `site.ts` values

**Approach:** Update `site.ts` (the source of truth for `DEFAULT_CONFIG`) with generic values. This is the cleanest approach because `DEFAULT_CONFIG` in `config-loader.ts` already spreads from `site.ts` — no structural changes needed, just value changes.

**Generic values to set** (assuming recommended decisions above):

| Field | Current (Phew) | Generic |
|-------|----------------|---------|
| `appTitle` | `"Phew! AI Playbook"` | `"AI Playbook"` |
| `companyName` | `"Phew Design Limited"` | `"Your Organisation"` |
| `companyShortName` | `"Phew!"` | `"your organisation"` |
| `companyUrl` | `"https://www.phew.org.uk/"` | `"https://www.example.com/"` |
| `companyUrlDisplay` | `"phew.org.uk"` | `"example.com"` |
| `feedbackEmail` | `"liam@aisolutionhub.co.uk"` | `"liam@aisolutionhub.co.uk"` (keep — consultant's email) |
| `feedbackSenderEmail` | `"playbook@feedback.aisolutionhub.co.uk"` | `"playbook@feedback.aisolutionhub.co.uk"` (keep — infrastructure) |
| `consultantName` | `"Liam"` | `"Liam"` (keep — consultant's name) |
| `trainingDate` | `"11 February 2026"` | `"your training date"` |
| `localStoragePrefix` | `"phew-playbook"` | `"ai-playbook"` |
| `emailSubjectPrefix` | `"Phew AI Playbook"` | `"AI Playbook"` |
| `metaDescription` | `"Practical guidance..."` | `"Practical guidance for getting the most from Claude AI"` (keep — already generic) |
| `welcomeSubtitle` | `"Getting started with AI at Phew"` | `"Getting started with AI"` |
| `industry` | `"Safeguarding and public sector software"` | `"your industry"` |
| `industryContext` | `"design agency"` | `"your organisation"` |
| `teamSize` | `"small"` | `"small"` (keep — reasonable default) |
| `primaryAiTool` | (in DEFAULT_CONFIG) `"Claude"` | `"Claude"` (keep) |
| `hasDeveloperTrack` | (in DEFAULT_CONFIG) `true` | `true` (keep — showcase full product) |
| `testingTool` | `"Ghost Inspector"` | `"your testing tool"` |
| `testingToolDocs` | `"the Ghost Inspector docs"` | `"the testing tool docs"` |
| `techStack` | `"ASP.NET/C#"` | `"your tech stack"` |
| `database` | `"SQL Server"` | `"your database"` |
| `webApplications` | `"LMS, Audit System, PDMS"` | `"your web applications"` |
| `domainSpecificForm` | `"safeguarding audit form"` | `"your domain-specific form"` |
| `complianceArea` | `"safeguarding"` | `"your compliance area"` |
| `primaryProduct` | `"LMS"` | `"your primary system"` |
| `primaryProductDescription` | `"learning management system"` | `"primary management system"` |
| `certificationName` | `"DBS checks"` | `"your certification requirements"` |
| `complianceStakeholders` | `"safeguarding partnership team"` | `"your compliance stakeholders"` |
| `sensitiveDataDescription` | `"safeguarding case data, child protection information, or vulnerable person records"` | `"sensitive client data, personal information, or confidential records"` |
| `sensitiveDataLabel` | `"safeguarding data"` | `"sensitive data"` |
| `exampleRecurringTasks` | `["training completion reports", ...]` | `["monthly reports", "client communications", "compliance documentation", "data analysis"]` |
| `reportDataSource` | `"LMS data export"` | `"your data export"` |
| `clientOnboardingType` | `"LMS client"` | `"new client"` |

### Task 2: Verify prose readability across all sections

**Why:** These generic values are interpolated into sentences throughout the app. Every section that references `siteConfig` fields needs to read naturally with the new values. For example:
- `"...for a {industryContext} like {companyShortName}"` → "...for your organisation like your organisation" — **this would be broken**
- Many templates include `{companyShortName}` in ways that assume it's a proper noun

**Action:** After setting generic values, systematically review every file that reads from `useSiteConfig()` or interpolates config values. Check that the prose reads naturally. Pay special attention to:
- `companyShortName` used as a proper noun in sentences (may need capitalisation or rephrasing)
- `industryContext` and `companyShortName` appearing in the same sentence (currently `"design agency"` and `"Phew!"` — generic versions must not produce redundant or awkward phrasing)
- Template strings in governance/policy content where field names appear in formal document context

**Files to review** (all files that call `useSiteConfig()` or reference `config.` fields):

```
app/src/content/general/*.tsx       # All 7 general track sections
app/src/content/developer/*.tsx     # All 8 developer track sections
app/src/content/shared/*.tsx        # StarterKit, Welcome, ProcessDoc
app/src/components/layout/*.tsx     # Header, Footer, HomePage, Sidebar
```

Use `grep -r "siteConfig\.\|config\.\|useSiteConfig" app/src/` to find all interpolation points.

### Task 3: Handle the `companyShortName` problem

**This is the hardest part.** `companyShortName` is used extensively as a proper noun:
- "Getting started with AI at {companyShortName}" → "Getting started with AI at your organisation" — awkward
- "{companyShortName}'s brand voice" → "your organisation's brand voice" — reads fine
- "How {companyShortName} uses AI" → "How your organisation uses AI" — reads fine

The generic value needs to work in all these contexts. `"your organisation"` works in most cases but reads oddly when preceded by "at" (preposition). Consider whether the welcome subtitle and any "at {companyShortName}" patterns need special handling.

**Recommended approach:** Use `"your organisation"` as the generic value. For the welcome subtitle specifically, set it as a standalone string (`"Getting started with AI"`) rather than deriving it from `companyShortName`. Any other "at {companyShortName}" patterns should be reviewed and may need conditional phrasing.

### Task 4: Update DEFAULT_CONFIG overlays and starterKit

**File:** `app/src/config/config-loader.ts:22-27`

The generic default should have:
- `overlays: {}` — no client-specific overlay content. Sections fall back to siteConfig-derived text (which will now be generic). This is correct for a generic deployment.
- `sections: { enabled: null, disabled: [] }` — show all sections (current behaviour, keep as-is)
- `starterKit: { enabledCustomCategories: [] }` — no custom categories in the generic version. Only base-tier starter kit items are shown. This is appropriate because custom categories are client-specific.

### Task 5: Verify Phew subdomain is unaffected

**Critical check:** Changing `site.ts` to generic values must NOT break the Phew subdomain deployment. Verify that:
1. `phew.json` contains all the Phew-specific values that were previously in `site.ts`
2. `loadClientConfig('phew')` fetches `phew.json` and merges with defaults correctly
3. The Phew subdomain shows full Phew branding (not generic values)

**File to verify:** `app/public/clients/phew.json` — confirm it has all 33 siteConfig fields populated with Phew values. If any fields are missing (relying on DEFAULT_CONFIG to provide Phew values), they must be added to `phew.json` before changing `site.ts`.

### Task 6: Browser testing

Start the dev server and test both configurations:

1. **Generic default:** `http://localhost:4100` (no `?client=` param)
   - Confirm app title shows "AI Playbook"
   - Confirm welcome page shows "Getting started with AI"
   - Confirm no Phew branding visible anywhere
   - Confirm all sections render without broken interpolation
   - Confirm developer track is accessible
   - Confirm starter kit shows only base-tier items
   - Navigate through every section checking for awkward generic phrasing

2. **Phew client:** `http://localhost:4100?client=phew`
   - Confirm app title shows "Phew! AI Playbook"
   - Confirm welcome page shows Phew branding
   - Confirm overlay content (brand voice, recurring tasks, ROI) is present
   - Confirm starter kit shows base + custom categories

### Task 7: Update footer with AI Solution Hub attribution

**File:** `app/src/components/layout/Footer.tsx:24-26`

**Current text (line 25):**
```
Built using the tools and workflows covered in this guide.
```

**Change:** Replace this line with text referencing the AI Solution Hub brand. The footer currently has two parts:
1. Line 13--23: "Built for {companyName}" with a link to the company website
2. Line 24--26: The attribution line above

The attribution should credit AI Solution Hub as the provider/creator. Suggested options (pick the one that reads best in context with the "Built for {companyName}" line above it):
- `"Delivered by AI Solution Hub"`
- `"An AI Solution Hub playbook"`
- `"Powered by AI Solution Hub"`

The AI Solution Hub logo is available at `docs/design/aish-logo-light-no-icon.png` (wordmark: "AI" and "HUB" in dark grey, "SOLUTION" in orange). Consider whether the footer attribution should include a small logo or remain text-only. For the generic default (where `companyName` is "Your Organisation"), the footer should still read naturally — the "Built for" line may need conditional logic or a different phrasing when showing the generic default.

**Acceptance criteria:** Footer attribution references AI Solution Hub. Reads naturally for both client-specific and generic default views. Build passes.

### Task 8: Investigate client logo feasibility

**This is a research and feasibility task, not necessarily a full implementation.**

**Context:** The user has an existing client report (`docs/design/client-report.html`) that displays client logos professionally — a "Prepared for" section with the client's logo rendered in a dark container with padding and rounded corners. The user wants to investigate adding similar client logo support to the playbook to make it feel more bespoke.

**Reference files in `docs/design/`:**
- `aish-logo-light-no-icon.png` (11 KB) — AI Solution Hub wordmark (provider logo)
- `AMD-Group-design-mep-facilities-management--215x57.png` (10 KB) — AMD Group logo (example client logo)
- `client-report.html` (230 KB) — HTML report with professional logo presentation (lines 127--145 for CSS, lines 1390--1403 for markup)
- `Screenshot 2026-02-18 at 15.43.45.png` (50 KB) — Screenshot showing the report's cover page with both logos

**The client report's approach to client logos:**
```css
.client-branding img {
  max-width: 215px;
  height: auto;
  background-color: #1f2937;    /* dark container */
  padding: 0.75em 1em;
  border-radius: 6px;
}
```
This creates a polished presentation — the client logo sits in a dark rounded-rect container that adapts to the logo's dimensions. This approach works well regardless of whether the client has a light or dark logo.

**Questions to investigate:**

1. **Where should client logos appear?** Options:
   - Header (next to or replacing the app title)
   - Welcome/home page hero area ("Prepared for {logo}")
   - Footer (alongside or replacing the "Built for {companyName}" text)
   - A combination of the above

2. **Schema changes needed.** The `ClientConfig` schema would need a new field, e.g.:
   ```typescript
   siteConfig: {
     clientLogoUrl?: string;      // Path to client logo (e.g. "/clients/logos/acme.png")
     clientLogoDarkBg?: boolean;  // Whether the logo needs a dark container (like AMD)
   }
   ```

3. **Asset storage.** Client logos could live in:
   - `app/public/clients/logos/{slug}.png` — alongside the JSON configs
   - Inline as base64 in the JSON config (as the client report does) — avoids extra files but bloats JSON
   - An external CDN — most flexible but adds infrastructure

4. **Dark mode compatibility.** Logos designed for light backgrounds need a container treatment (like the dark background in the client report) when displayed on dark mode. Conversely, logos designed for dark backgrounds need treatment on light mode. The `clientLogoDarkBg` flag (or an auto-detection approach) would handle this.

5. **Generic default behaviour.** When no client logo is configured, the playbook should show text-only branding (current behaviour). The logo should be a progressive enhancement, not a requirement.

6. **AI Solution Hub provider logo.** Should the AI Solution Hub logo appear alongside or separately from the client logo? The client report pattern is: provider logo at top, "Prepared for" client logo below. A similar pattern in the playbook could work in the header area.

**Output:** A feasibility assessment covering the questions above, with a recommendation for the simplest approach to implement. If the approach is straightforward, proceed with a basic implementation (schema change + one placement). If it requires significant UI changes, produce a design proposal for the next session.

**Important:** This task should not block the other tasks. If it turns out to be complex, document the findings and defer implementation.

---

## Agent Allocation

This work is suitable for parallel agents with three waves:

### Wave 1 (parallel — no file overlaps)

| Agent | Task | Files Owned |
|-------|------|-------------|
| **Agent A** (Config Values) | Tasks 1, 3, 4: Update `site.ts` generic values, update `DEFAULT_CONFIG` overlays/starterKit, handle `companyShortName` edge cases | `app/src/config/site.ts`, `app/src/config/config-loader.ts` |
| **Agent B** (Phew JSON Verification) | Task 5: Verify `phew.json` has all 33 fields, add any missing ones | `app/public/clients/phew.json` |
| **Agent E** (Logo Feasibility) | Task 8: Research client logo feasibility — schema changes, asset storage, placement options, dark mode compatibility. Read design reference files in `docs/design/`. Produce a feasibility assessment. | `docs/design/*` (read-only), assessment output |

### Wave 2 (after Wave 1 — depends on Agent A)

| Agent | Task | Files Owned |
|-------|------|-------------|
| **Agent C** (Prose Review + Footer) | Tasks 2, 7: Systematically review every component that interpolates siteConfig values. Fix any broken or awkward phrasing with the new generic values. Update footer attribution to reference AI Solution Hub. | `app/src/content/**/*.tsx`, `app/src/components/layout/*.tsx` |

### Wave 3 (after Wave 2)

| Agent | Task | Files Owned |
|-------|------|-------------|
| **Agent D** (Browser Testing) | Task 6: Start dev server, test both generic and Phew configurations, verify footer branding, take screenshots | None (read-only testing) |

---

## Interaction with Session 20

This session resolves **FAIL 3.1** (default config branding) and effectively absorbs **concern C4** (empty DEFAULT_CONFIG overlays). With Option A, empty overlays in the generic default are intentional — sections correctly fall back to siteConfig-derived generic text.

**When running session 20 after this session:**
- Skip C4 (absorbed here)
- Skip FAIL 3.1 (resolved here)
- The C2/C3 work (shared slug utility) may touch `config-loader.ts` — coordinate to avoid conflicts. The slug extraction function is independent of the DEFAULT_CONFIG values, so changes should not conflict.

---

## Key Reference Files

| File | Purpose |
|------|---------|
| `app/src/config/site.ts` | Current Phew-specific values (primary file to update) |
| `app/src/config/config-loader.ts` | `DEFAULT_CONFIG`, `loadClientConfig()`, `mergeWithDefaults()` |
| `app/src/config/client-config-schema.ts` | `ClientConfig` TypeScript interface (33 siteConfig fields) |
| `app/src/components/layout/Footer.tsx` | Footer component (Task 7 — attribution line) |
| `app/public/clients/phew.json` | Phew client config (must remain complete after site.ts changes) |
| `app/public/clients/_template.json` | Template JSON (reference for field names) |
| `docs/audit-findings/20260218-multi-tenant/multi-tenant-implementation-audit.md` | Audit findings (FAIL 3.1 and C4 details) |
| `CUSTOMISATION.md` | Client deployment guide (reference for field descriptions) |
| `docs/design/aish-logo-light-no-icon.png` | AI Solution Hub wordmark logo (11 KB) |
| `docs/design/AMD-Group-design-mep-facilities-management--215x57.png` | AMD Group logo — example client logo (10 KB) |
| `docs/design/client-report.html` | HTML client report with professional logo presentation (reference for Task 8) |
| `docs/design/Screenshot 2026-02-18 at 15.43.45.png` | Screenshot of client report cover page (reference for Task 8) |

---

## Key Conventions Reminder

- **UK English throughout.** All content, copy, and code comments use UK English spelling and grammar.
- **Build check after changes:** `cd app && bun run build` (TypeScript + Vite build). Also `bun run lint` and `bun run format:check`.
- **Tailwind v4 — no config file.** Theme customisation is in `app/src/index.css` via `@theme inline {}`.
- **Path aliases:** `@/` maps to `app/src/`.
- **Overlay fallback:** When overlays are absent, sections interpolate siteConfig values into prose. The generic siteConfig values must read naturally in these contexts.

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format       # Prettier — format all files
cd app && bun run format:check # Prettier — check without writing
```

## Verification After This Session

- [ ] `app/src/config/site.ts` contains only generic values (no Phew branding)
- [ ] `DEFAULT_CONFIG` in `config-loader.ts` has generic siteConfig, empty overlays, empty starterKit custom categories
- [ ] `app/public/clients/phew.json` contains all 33 siteConfig fields with Phew values
- [ ] Footer attribution references AI Solution Hub (no longer says "Built using the tools and workflows covered in this guide")
- [ ] Build passes: `cd app && bun run build`
- [ ] Lint passes: `cd app && bun run lint`
- [ ] Format passes: `cd app && bun run format:check`
- [ ] Generic default (localhost, no client param): shows "AI Playbook", no Phew branding, all sections readable
- [ ] Phew client (localhost with `?client=phew`): shows full Phew branding, overlays, starter kit custom categories
- [ ] No awkward or broken prose in any section with generic values
- [ ] Developer track accessible and readable with generic tech stack values
- [ ] Footer reads naturally for both generic default and client-specific views
- [ ] Client logo feasibility assessment produced (implementation deferred if complex)
