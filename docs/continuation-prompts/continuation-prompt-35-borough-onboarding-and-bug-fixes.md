# Continuation Prompt 35 — Borough Onboarding, AMD Bug Fixes & Logo Process

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. The app is deployed as a multi-tenant SPA — each client gets a subdomain and a JSON config file. A single build serves all clients. Two outputs per client deployment:
1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, commands, templates, governance policy

**Read first:** `CLAUDE.md` at the project root — conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### Sessions 17–31: Multi-tenant architecture, client logos, onboarding skill — Complete
Full multi-tenant SPA on `main`. Client identified by subdomain, config loaded at runtime from `/clients/{slug}.json`. `/client-research` command and `/client-onboarding` skill created and validated. ClientLogo component with dark mode fallback. Document title + meta description set from config.

### Session 33: AMD Group onboarding — Complete
**AMD Group is the first non-Phew client config.**

**Completed:**
- Research document produced: `.planning/client-specific/01-amd/amd-group-site-content.md` (30 KB, 13 sections)
- Full onboarding skill workflow executed: Phase 1 extraction + Phase 2 Groups 1-6 all reviewed and confirmed by consultant
- Config written and validated: `app/public/clients/amd.json`
- Build, lint, format checks all pass
- Logo deployed: `app/public/clients/logos/amd.webp` (converted from PNG source in `docs/design/`)
- Config updated with logo reference: `clientLogoUrl: "/clients/logos/amd.webp"`, `clientLogoMaxWidth: 215`

**Key AMD config decisions:**
- `hasDeveloperTrack: false` — no developer team
- `teamSize: "large"` — ~85 employees confirmed by consultant
- `industryContext: "MEP services provider"` — Tier 1 MEP contractor, nationwide
- `primaryProduct: "MEP"` / `primaryProductDescription: "mechanical, electrical and plumbing services"` — repurposed from software-product field to service acronym for brand voice terminology
- `certificationName`: omitted — discovered to be dead config (never rendered by any component)
- `complianceStakeholders: "managing directors"` — consultant established this as the default for all SMB clients
- Starter kit categories: `business-development`, `compliance-security`

**Field suitability audit conducted:** Traced all domain-specific siteConfig fields to their actual component usage. Key findings:
- `certificationName` — dead config, never consumed by any component
- `primaryProduct`/`primaryProductDescription` — mostly developer-track but one shared usage in `brand-voice-data.ts`
- `compliance-security` starter kit category — only item is developer-track-only, so it contributes zero visible items for non-dev deployments

### Session 33: Borough research — Complete (degraded source test)
Borough's website (`borough-es.co.uk`) is effectively down (redirects to empty lander). Fallback research produced using Companies House, LinkedIn, Endole, and web search.

**Research document:** `.planning/client-specific/02-borough/borough-engineering-services-site-content.md` (~18 KB, 13 sections)

**Key Borough facts (from fallback sources):**
- Company number: 09587480, incorporated May 2015 as Emico Building Services Limited, MBO July 2018, renamed November 2018
- "London & Manchester Tier 1 Mechanical, Electrical & Public Health Contractor"
- Directors: Jeffrey Thomas Pollitt (MD) and Thomas Edward Pollitt (Pre-Construction Director)
- Revenue: £112.26M (year ended Dec 2024, 76% YoY growth, Endole)
- Employee count discrepancy: 40 (accounts) vs ~100 (LinkedIn) — needs clarification
- Notable projects: 20 Carlton House Terrace (250k sq.ft, Carbon Net Zero), Ministry of Sound at Westfield, Silvertown Quays

**Critical gaps requiring consultant input:**
1. No brand voice data (website down — can't generate overlays without help)
2. No accreditations/certifications known
3. Only 3 projects and 1 named partner identified
4. Employee count unclear
5. Team structure beyond directors unknown

**CanI-AI-this baseline use cases:** 23 AMD-specific use cases at `/Users/liamj/Documents/development/can-i-ai-this/src/data/baseline-use-cases.json` — used to inform recurring tasks. These may also be relevant for Borough (similar MEP sector).

### Session 33: AMD browser testing — Complete
Browser test agent ran comprehensive 10-point checklist. Results:

**5 passed, 4 partial, 1 failed.** Five bugs identified (detailed below in Task 1).

---

## What This Session Does

### Task 1: Fix AMD Browser Test Bugs (Must)

Five bugs found during browser testing, in priority order:

**Bug 1 — Header shows "Developers" link when `hasDeveloperTrack: false`** (FAIL)
- **File:** `app/src/components/layout/Header.tsx`
- **Issue:** The header nav renders both "General Users" and "Developers" links unconditionally. When `hasDeveloperTrack` is `false`, the Developers link should be hidden.
- **Fix:** Read the `hasDeveloperTrack` value from config context and conditionally render the Developers link. This is important — AMD is the first client without a developer track, so this bug wouldn't have been caught with Phew.
- **Test:** After fix, verify at `http://localhost:4100/?client=amd` that only "General Users" appears in the header nav.

**Bug 2 — ROI overlay key mismatch: `pqq-automation` vs `proposal-writing`** (Partial fail)
- **Files:** `app/public/clients/amd.json` (overlay key is `pqq-automation`), `app/src/content/shared/roi-data.ts` (line ~187, expects key `proposal-writing`)
- **Issue:** The AMD config uses `pqq-automation` as the ROI overlay key, but the code looks up `proposal-writing`. The AMD PQQ content never displays — generic fallback shows instead.
- **Fix:** Rename the key in `amd.json` from `pqq-automation` to `proposal-writing`. This is the simpler fix (changing one JSON key vs changing the codebase). Update the onboarding skill docs to note valid ROI key names.
- **Test:** After fix, verify the "Proposal & Bid Writing" ROI template shows AMD-specific PQQ content.

**Bug 3 — ROI `contract-review` overlay has no matching template** (Missing feature)
- **File:** `app/src/content/shared/roi-data.ts`
- **Issue:** AMD config defines a `contract-review` ROI overlay but no template in the code reads this key. The overlay is never displayed.
- **Decision needed:** Either (a) add a "Contract Review" template to roi-data.ts that reads the `contract-review` key, or (b) remove the unused overlay from amd.json, or (c) map it to an existing template. Option (a) is best — contract review is a genuine ROI category for many clients.

**Bug 4 — `welcomeSubtitle` not wired to any component** (Minor)
- **Files:** `app/src/content/shared/sections.ts` (line 10, hardcoded subtitle), `app/src/config/client-config-schema.ts` (defines the field)
- **Issue:** The `welcomeSubtitle` field exists in the config schema and every client JSON but is never read by any component. The section subtitle is hardcoded as "Getting started with AI" in `sections.ts`.
- **Fix:** Either wire `welcomeSubtitle` into the Welcome section/homepage, or remove it from the schema. Given that it's already populated in both client configs, wiring it up is the better option.

**Bug 5 — `compliance-security` starter kit category empty for non-dev** (Design)
- **Files:** `app/src/content/shared/starter-kit-data.ts`
- **Issue:** The only item in `compliance-security` category has `tracks: ['developer']`. Enabling this category for a non-dev client like AMD adds zero visible items.
- **Decision needed:** Add general-track compliance items (e.g. a compliance monitoring skill, a policy review template) or document that this category requires the developer track.

**After all fixes:**
```bash
cd app && bun run build && bun run lint && bun run format:check
```

Then run browser testing again for AMD to verify fixes — deploy agent-browser to check:
1. Header no longer shows "Developers" link
2. ROI section shows AMD PQQ content under "Proposal & Bid Writing"
3. AMD logo renders on homepage (was added after initial test)

### Task 2: Borough Onboarding (Must — heavy consultant input expected)

Run the onboarding skill against Borough Engineering Services. This is a degraded-source test — expect significantly more "ask the consultant" prompts.

**Read these files first:**
- `.claude/skills/client-onboarding/SKILL.md` — the skill workflow
- `.planning/client-specific/02-borough/borough-engineering-services-site-content.md` — research document (18 KB, degraded)
- `.planning/client-specific/02-borough/borough-training-summary.md` — session 1 summary (30 Sept 2025)
- `.planning/client-specific/02-borough/borough-training-session-02-summary.md` — session 2 summary (15 Oct 2025)

**Key decisions the consultant will need to make:**
1. `companyShortName` — "Borough" or "BESL"? Ask explicitly.
2. `companyUrl` — current URL is non-functional. Use `borough-es.co.uk` anyway?
3. `teamSize` — 40 (accounts) vs ~100 (LinkedIn). Consultant has the real number.
4. Accreditations — completely unknown. Must be provided.
5. Brand voice — no website data available. Consultant must describe or approve generated content based on training sessions and limited LinkedIn data.
6. `hasDeveloperTrack` — almost certainly `false`, but confirm.
7. Employee contacts — only a.sharma, Billy Coleman, Jason Watts, Tomasz Zaremba known from training.

**Borough training context (for recurring tasks/ROI):**
- PQQ automation — demonstrated successfully in session 2 using Borough's own documents
- ONS form completion — monthly statistical returns
- Quality certification tracking — expiry monitoring
- Meeting minutes / lessons learned — project debriefs
- Asset register creation — from project drawings
- Contract generation — employee service agreements from templates

**CanI-AI-this relevance:** The baseline use cases at `/Users/liamj/Documents/development/can-i-ai-this/src/data/baseline-use-cases.json` were generated for AMD but Borough is in the same MEP sector. Many use cases (UC-001 progress reports, UC-008 quantity take-offs, UC-009 spec extraction, UC-013 certification tracking, UC-014 PQQ automation) apply equally to Borough.

### Task 3: Logo Deployment Process (Should)

Currently there's no documented, repeatable process for adding client logos. The current state:

**What exists:**
- `ClientLogo` component at `app/src/components/content/ClientLogo.tsx` — renders logo with dark mode switching and fallback container
- Logo files served from `app/public/clients/logos/` — only `phew.webp` and `amd.webp` exist
- Config schema supports `clientLogoUrl`, `clientLogoDarkUrl`, `clientLogoAlt`, `clientLogoMaxWidth`
- Source logos stored ad-hoc in `docs/design/` (PNG format)

**What's missing:**
- No step in the onboarding skill covers logo deployment
- No documented conversion process (PNG → webp, sizing guidelines)
- No guidance on dark mode variants vs fallback container
- No logo quality checklist (minimum resolution, aspect ratio, file size target)

**Proposed fix:** Add a logo deployment section to the onboarding skill (`SKILL.md`) as part of Phase 3 (Write, Validate, and Deploy). The section should:

1. **Ask the consultant for logo files** — at least one logo (light mode). Dark mode variant optional.
2. **Check `docs/design/`** for any existing logo files matching the client slug
3. **Convert to webp** — `cwebp -q 90 input.png -o app/public/clients/logos/{slug}.webp`
4. **Sizing guidance** — `clientLogoMaxWidth` should match the logo's natural width (don't upscale). Typical range: 140-220px.
5. **Dark mode decision** — if the logo has light/white text on transparent background, it needs a dark variant OR the fallback container will handle it. Note the trade-off.
6. **Update the config** — set `clientLogoUrl`, `clientLogoAlt`, and optionally `clientLogoDarkUrl` and `clientLogoMaxWidth`.
7. **Verify in browser** — check logo renders in both light and dark mode.

Also consider whether `docs/design/` should be the standard source location, or if logos should go straight to `app/public/clients/logos/`.

### Task 4: Commit All Changes (Must)

Uncommitted changes from this session:
- `app/public/clients/amd.json` — new AMD client config (with logo reference)
- `app/public/clients/logos/amd.webp` — AMD logo file
- Any bug fixes from Task 1
- Any skill updates from Task 3

Note: Borough research document is at `.planning/client-specific/02-borough/` which is gitignored.

---

## Key Files

### Skill & Command
```
.claude/commands/client-research.md                  # Research command
.claude/skills/client-onboarding/
  ├── SKILL.md                                       # Onboarding skill workflow
  └── references/
      ├── field-mapping.md                           # Field derivation rules
      ├── overlay-generation.md                      # Brand voice, tasks, ROI guidance
      └── validation-checklist.md                    # Schema + quality checks
```

### AMD Client (complete)
```
app/public/clients/amd.json                          # AMD config (committed this session)
app/public/clients/logos/amd.webp                     # AMD logo (committed this session)
.planning/client-specific/01-amd/
  ├── amd-group-site-content.md                      # Research output (30 KB)
  ├── amd-training-summary.md                        # Training summary
  └── amd-training-transcript.md                     # Full transcript
```

### Borough Client (research complete, onboarding pending)
```
.planning/client-specific/02-borough/
  ├── borough-engineering-services-site-content.md   # Degraded research output (18 KB)
  ├── borough-training-summary.md                    # Session 1 summary (30 Sept 2025)
  └── borough-training-session-02-summary.md         # Session 2 summary (15 Oct 2025)
```

### Bug Fix Targets
```
app/src/components/layout/Header.tsx                 # Bug 1: Developers link visibility
app/public/clients/amd.json                          # Bug 2: ROI key rename
app/src/content/shared/roi-data.ts                   # Bug 3: Contract review template
app/src/content/shared/sections.ts                   # Bug 4: welcomeSubtitle wiring
app/src/content/shared/starter-kit-data.ts           # Bug 5: compliance-security items
```

### Cross-project Reference
```
/Users/liamj/Documents/development/can-i-ai-this/src/data/baseline-use-cases.json  # 23 AMD use cases (applicable to Borough)
```

### Ground Truth
```
app/public/clients/phew.json                         # Ground truth client config
app/public/clients/_template.json                    # Template for new clients
```

---

## Consultant Interaction Model

**This is critical for Borough.** The degraded research means ~40% of overlay content will need direct consultant input rather than extraction.

- **Never guess low-confidence fields** — ask explicitly
- **Present extractions with source quotes** — cite LinkedIn, Companies House, training transcripts
- **Ask for explicit confirmation at each Phase 2 group** — do not proceed until confirmed
- **For Borough specifically:** flag every data gap from the research document and ask the consultant to fill it

---

## Key Conventions Reminder

- **UK English throughout.** All content, examples, copy. Use £ not $.
- **Tailwind v4 — no config file.** Theme in `app/src/index.css` via `@theme inline {}`.
- **bun** for all package operations.
- **Multi-tenant SPA.** One build, many clients. Config from `/clients/{slug}.json`.
- **Logo process:** Convert to webp, place in `app/public/clients/logos/{slug}.webp`, set `clientLogoUrl` in config.

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format:check # Prettier check
```

## Verification After This Session

- [ ] Bug 1 fixed: Header hides "Developers" link when `hasDeveloperTrack: false`
- [ ] Bug 2 fixed: AMD ROI "Proposal & Bid Writing" shows PQQ-specific content
- [ ] Bug 3 resolved: `contract-review` ROI template added or overlay removed
- [ ] Bug 4 resolved: `welcomeSubtitle` wired up or removed from schema
- [ ] Bug 5 addressed: `compliance-security` category has general-track content or is documented as dev-only
- [ ] AMD logo verified in browser (light and dark mode)
- [ ] Borough onboarding Phase 1 extraction complete
- [ ] Borough onboarding Phase 2 Groups 1-6 reviewed with consultant
- [ ] `app/public/clients/borough.json` written and validated (if onboarding completes)
- [ ] Logo deployment process documented in onboarding skill
- [ ] All changes committed
- [ ] Build passes: `cd app && bun run build`
