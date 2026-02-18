# Continuation Prompt 29 — Onboarding Skill Testing & Document Title Fix

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. The app is deployed as a multi-tenant SPA — each client gets a subdomain and a JSON config file. A single build serves all clients. Two outputs per client deployment:
1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, commands, templates, governance policy

**Read first:** `CLAUDE.md` at the project root — conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### Sessions 17–20a — Multi-Tenant Architecture (Complete)

Six-phase multi-tenant architecture on `main`. Single Vite SPA, client identified by subdomain, config loaded at runtime from `/clients/{slug}.json`, merged with defaults, cached in localStorage (1-hour TTL). All audit FAIL items resolved. Generic default config serves brandless "AI Playbook" when no client overlay loaded.

### Session 21 — Client Research Command & Browser Testing

**Workstream A (Must) — Client Research Command: DONE**

Created `/client-research` slash command at `.claude/commands/client-research.md`:
- Three-phase research strategy: Map (Firecrawl `firecrawl_map`) → Scrape (`firecrawl_scrape`) → Search (web search for gaps)
- Accepts four positional arguments: `$0` = URL, `$1` = company name, `$2` = slug, `$3` = optional focus areas
- Output to `.planning/client-specific/$2/{filename}-site-content.md`
- 13-section document structure matching the Phew ground truth at `.planning/client-specific/00-phew/phew-site-content.md`
- Fallback mode when Firecrawl MCP is unavailable (uses WebFetch + WebSearch instead)
- Includes "Key Extractions for Playbook Config" summary section for onboarding skill consumption

Updated `.claude/skills/client-onboarding/SKILL.md`:
- Added recommended prerequisite note referencing `/client-research`
- Updated Step 3 to check for existing research documents before scraping

**Key lesson learned:** Claude Code commands use `argument-hint` (not `args`) in YAML frontmatter, and positional substitution uses `$0`, `$1`, `$2`, `$3` (not `$ARGUMENTS.fieldName`).

**Workstream B (Should) — Browser Testing: DONE**

Browser testing via `agent-browser` confirmed multi-tenant SPA works correctly:

| Test | Result | Details |
|------|--------|---------|
| Default site (no client) | **PASS** (4/4) | Generic "AI Playbook" branding, no Phew references, footer links to AI Solution Hub |
| Phew client (`?client=phew`) | **PARTIAL** (4/5) | Header, footer, tracks, overlays all correct. Minor: `document.title` stays "AI Playbook" |
| Brand voice section | **PASS** (3/3) | Phew overlay content renders — "IMPACT values and sector-specific terminology" |
| Recurring tasks section | **PASS** (3/3) | Phew examples present — LMS, safeguarding, training reports |

**14/15 checks passed.** One issue found: `document.title` not updated by client config overlay.

**Not tested:** Feedback widget email submission, section visibility gating.

Screenshots saved to `.playwright-mcp/` (gitignored).

**Workstream C (Should) — Onboarding Skill Testing: NOT STARTED**

Deferred due to context limits. This is the primary task for this session.

### Session 28 (Parallel) — Client Logo Support

Untracked files from a separate session adding client logo support:
- `app/src/components/content/ClientLogo.tsx` — Logo component with dark mode switching
- `app/public/clients/logos/` — Logo asset directory
- `app/src/config/client-config-schema.ts` — Schema updated with logo fields
- `app/public/clients/phew.json` — Updated with logo config
- `app/public/clients/_template.json` — Updated with logo field placeholders
- `app/src/components/layout/HomePage.tsx` — Updated to render ClientLogo
- `CUSTOMISATION.md` — Updated with logo documentation
- `docs/continuation-prompts/continuation-prompt-28-client-logo-support.md`

These changes are unstaged and should be committed separately.

### Build Status

- `cd app && bun run build` — pass
- `cd app && bun run lint` — pass
- `cd app && bun run format:check` — pass

---

## What This Session Does: Onboarding Skill Testing & Minor Fixes

Three workstreams, in priority order:

### Workstream A (Must): Test Onboarding Skill Against Phew Data

**Goal:** Validate the onboarding skill extraction and generation workflow by running it against real client data and comparing output to the ground truth.

**Steps:**

1. **Phew ground truth test** — Invoke the onboarding skill against `.planning/client-specific/00-phew/phew-training-ai-and-the-art-of-the-possible-summary.md` and `https://www.phew.org.uk/`. Compare the generated config against `app/public/clients/phew.json` ground truth. Document extraction accuracy per field category:
   - Company identity fields
   - Industry/domain fields
   - Developer track fields
   - Overlay content quality (brand voice, recurring tasks, ROI)

2. **Document findings** — Capture skill quality observations, extraction accuracy, areas for improvement. If the skill needs iteration, make targeted fixes.

**Reference files:**
- `.claude/skills/client-onboarding/SKILL.md` — The skill workflow
- `.planning/client-specific/00-phew/phew-site-content.md` — Research document (input)
- `.planning/client-specific/00-phew/phew-training-ai-and-the-art-of-the-possible-summary.md` — Training summary (input)
- `app/public/clients/phew.json` — Ground truth output
- `.claude/skills/client-onboarding/references/field-mapping.md` — Field derivation rules

### Workstream B (Should): Fix Document Title

**Issue:** Browser testing revealed that `document.title` is not updated when a client config overlay is loaded. The HTML `<title>` stays "AI Playbook" even when the Phew config sets `appTitle: "Phew! AI Playbook"`.

**Fix:** Add a `useEffect` in the root layout component (or `ClientConfigProvider`) that sets `document.title` from `siteConfig.appTitle` when the config loads.

**Files to check:**
- `app/src/config/config-loader.ts` — Where config is loaded and provided
- `app/src/components/layout/AppLayout.tsx` — Root layout component
- `app/index.html` — Static HTML title (should remain generic as fallback)

### Workstream C (Should): Test Client Research Command

**Goal:** Run `/client-research` against a real website to validate the command works end-to-end.

**Options:**
1. Re-run against `https://www.phew.org.uk/` and compare output to existing ground truth
2. Run against AMD Group (`https://www.amdgroup.com/` — needs URL confirmation from `.planning/client-specific/01-amd/`)
3. Run against Borough's website (check `.planning/client-specific/02-borough/` for URL)

This also serves as a prerequisite for testing the full crawl → onboard pipeline.

### Workstream D (Should): Commit Client Logo Changes

The session 28 client logo changes are unstaged. If they pass review, commit them separately from the onboarding skill testing work.

---

## Current File Structure

### Onboarding Skill & Research Command
```
.claude/
├── commands/
│   └── client-research.md                   # NEW — client research slash command
└── skills/client-onboarding/
    ├── SKILL.md                              # UPDATED — references /client-research
    └── references/
        ├── field-mapping.md                  # All 33 fields with sources/defaults
        ├── overlay-generation.md             # Brand voice, tasks, ROI guidance
        └── validation-checklist.md           # Schema + quality + deployment
```

### Client Config Infrastructure
```
app/
├── public/clients/
│   ├── _template.json                        # Template (has unstaged logo field changes)
│   ├── phew.json                             # Production config (has unstaged logo changes)
│   └── logos/                                # NEW unstaged — logo assets
├── src/config/
│   ├── client-config-schema.ts               # Schema (has unstaged logo field additions)
│   ├── config-loader.ts                      # Runtime config loader
│   └── site.ts                               # Generic defaults
├── src/components/content/
│   └── ClientLogo.tsx                        # NEW unstaged — logo component
├── src/components/layout/
│   └── HomePage.tsx                          # Modified unstaged — renders ClientLogo
├── src/utils/
│   └── slug.ts                               # Shared slug extraction + sanitisation
└── api/
    └── feedback.ts                           # Vercel serverless function
```

### Client-Specific Data
```
.planning/client-specific/
├── 00-phew/
│   ├── phew-site-content.md                  # Ground truth research (35 KB)
│   └── phew-training-*-summary.md            # Training session summaries
├── 01-amd/
│   ├── amd-training-summary.md               # Training summary
│   └── amd-training-transcript.md            # Full transcript
└── 02-borough/
    ├── borough-training-summary.md           # Session 1 summary
    └── borough-training-session-02-summary.md  # Session 2 summary
```

---

## Key Conventions Reminder

- **UK English throughout.** All content, examples, copy. Use £ not $.
- **Tailwind v4 — no config file.** Theme in `app/src/index.css` via `@theme inline {}`.
- **bun** for all package operations.
- **Multi-tenant SPA.** One build, many clients. Config from `/clients/{slug}.json`.
- **Overlay fallback pattern.** `overlays?.field ?? siteConfig.defaultValue` — always graceful degradation.
- **Client slug rules.** Lowercase, hyphens only. Validated by `sanitiseSlug()` in `app/src/utils/slug.ts`.
- **Commands vs skills.** Commands are user-invoked slash commands (`.claude/commands/`). Skills are triggered by natural language or context matching (`.claude/skills/`).
- **Claude Code command frontmatter.** Uses `argument-hint` (not `args`). Positional substitution: `$0`, `$1`, `$2`, `$3` or `$ARGUMENTS[N]`.

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format:check # Prettier check
```

## Deployment

- **Production:** https://ai-smb-playbook.vercel.app
- **Repository:** https://github.com/liam-jons/ai-smb-playbook
- Auto-deploys on push to `main` via Vercel

## Verification After This Session

- [ ] Onboarding skill tested against Phew data — extraction accuracy documented
- [ ] Document title fix implemented and verified
- [ ] Client research command tested against at least one client website
- [ ] Client logo changes reviewed and committed (if ready)
- [ ] All changes committed with themed commits
- [ ] Build, lint, format all pass

## Open Items

1. **Document title bug** — `document.title` not updated when client config loads. Minor but visible in browser tabs.
2. **Feedback widget testing** — Not covered in session 21 browser testing. Needs manual or automated verification.
3. **Section visibility gating** — Not tested. If a client config disables sections, verify they're removed from sidebar and not navigable.
4. **AMD/Borough onboarding** — Lower priority. Test the full crawl → onboard pipeline once the research command is validated.
5. **Client logo commit** — Unstaged changes from session 28. Review and commit separately.

## Documents to Read Before Starting

| Document | Purpose |
|----------|---------|
| `.claude/skills/client-onboarding/SKILL.md` | The skill workflow to test |
| `.planning/client-specific/00-phew/phew-site-content.md` | Research input for Phew test |
| `app/public/clients/phew.json` | Ground truth for output comparison |
| `.claude/skills/client-onboarding/references/field-mapping.md` | Field derivation rules |
| `CUSTOMISATION.md` | Client configuration reference |
