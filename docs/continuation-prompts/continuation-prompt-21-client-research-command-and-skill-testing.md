# Continuation Prompt 21 — Client Research Command & Onboarding Skill Testing

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. The app is deployed as a multi-tenant SPA — each client gets a subdomain and a JSON config file. A single build serves all clients. Two outputs per client deployment:
1. **Interactive Playbook** -- React app with two audience tracks (General Users / Developers)
2. **Starter Kit** -- Drop-in skill files, commands, templates, governance policy

**Read first:** `CLAUDE.md` at the project root -- conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### Sessions 17--18 — Multi-Tenant Implementation & Audit

Six-phase multi-tenant architecture committed to `main`. Single Vite SPA deployed on Vercel. Client identified by subdomain (`phew.playbook.aisolutionhub.co.uk`). Config loaded at runtime from `/clients/{slug}.json`, merged with defaults, cached in localStorage (1-hour TTL). React context (`ClientConfigProvider`) provides config to all components via `useSiteConfig()`, `useOverlays()`, `useSectionsConfig()` hooks. Full audit at `docs/audit-findings/20260218-multi-tenant/multi-tenant-implementation-audit.md`.

### Session 19 — FAIL Item Resolution & Onboarding Skill Design

Resolved all 10 FAIL items from the audit (86% → 100% pass rate). Produced client onboarding skill design document at `docs/reference/client-onboarding-skill-design.md`.

### Session 20 — Non-Blocking Cleanup & Onboarding Skill Implementation

**Workstream A (C1--C7 audit concerns) — All resolved:**

| Concern | Fix |
|---------|-----|
| C1: Dead middleware | Deleted `app/middleware.ts` |
| C2: Duplicate slug logic | Created `app/src/utils/slug.ts` with shared `extractClientSlugFromHostname()`. Both `config-loader.ts` and `feedback.ts` import from it. |
| C3: Slug sanitisation | Added `sanitiseSlug()` with regex validation (`/^[a-z0-9-]+$/`) — prevents path traversal in config fetch URLs. |
| C5: HallucinationsSection | Accepted as-is — developer version keeps code-example-specific framing. |
| C6: Feedback client identifier | `FeedbackWidget` sends `companyShortName`. Feedback API includes `Client: {name}` in email body. |
| C7: Build validation step | Added step 6 to `CUSTOMISATION.md` — "Validate the config: `cd app && bun run build`". |

**Workstream B (Client onboarding skill) — Implemented:**

Three-phase skill at `.claude/skills/client-onboarding/`:
- `SKILL.md` — Core workflow (extract → grouped review → write/validate/deploy)
- `references/field-mapping.md` — All 33 fields with sources, derivation rules, defaults
- `references/overlay-generation.md` — Brand voice, recurring tasks, ROI generation guidance
- `references/validation-checklist.md` — Schema conformance, content quality, deployment checks

The skill is auto-discovered by Claude Code and appears in the skill list.

### Session 20a — Generic Default Config

Genericised `site.ts` so the base build serves a brandless "AI Playbook". Client-specific values come entirely from the JSON overlay loaded at runtime. Overlay consumption wired into brand voice, ROI, and recurring task sections. Footer and HomePage adapt gracefully when no client config is loaded.

### Build Status

- `cd app && bun run build` -- pass
- `cd app && bun run lint` -- pass
- `cd app && bun run format:check` -- pass

---

## What This Session Does: Client Research Command + Skill Testing

Three workstreams, in priority order:

### Workstream A (Must): Create a Client Research Command

**Goal:** Build a new command that accepts a client website URL and produces a comprehensive research document — a structured markdown file capturing everything we need to know about the client. This serves as a prerequisite to the onboarding skill and has broader value for engagement customisation (pitch emails, proposals, brand voice creation, etc.).

**Why:** The onboarding skill currently relies on WebFetch to scrape client websites, which is limited to individual page fetches. A dedicated command using Firecrawl MCP can crawl the entire site systematically, supplemented by web search for gaps. The Phew research file at `.planning/client-specific/00-phew/phew-site-content.md` (35 KB) is the ground truth reference for the output format — read it to understand the expected depth and structure.

**Implementation:**

Create a new command at `.claude/commands/client-research.md` that:

1. **Accepts inputs:**
   - Client website URL (required)
   - Client name (required)
   - Client slug (required — for file naming, e.g. `01-amd`)
   - Optional: specific areas of interest, known industry context

2. **Performs a systematic crawl using Firecrawl MCP:**
   - Crawl the client website (homepage, about, services, team, contact, blog/news)
   - Extract: company overview, services/products, values/mission, team info, sector expertise, certifications, contact details, brand personality/tone, terminology/jargon, technology indicators
   - Use web search to fill gaps: Companies House registration, industry context, recent news, regulatory environment

3. **Produces a structured research document:**
   - Output to `.planning/client-specific/{slug}/{name}-site-content.md`
   - Follow the structure of the Phew example (sections: Company Overview, Services, Values, Certifications, Sector Expertise, Team, etc.)
   - Include metadata header (research date, source URL, purpose)
   - Flag any gaps or low-confidence extractions

4. **Includes a summary section for the onboarding skill:**
   - At the end, produce a "Key Extractions for Playbook Config" section summarising the fields most relevant to the onboarding skill (brand personality, industry, compliance areas, recurring tasks candidates, etc.)

**Design considerations:**
- The command should work with or without Firecrawl MCP. If Firecrawl is not available, it should fall back to WebFetch for key pages and web search for the rest, noting the limitation.
- The output should be useful beyond the playbook — it's a general-purpose client research archive that supports pitch customisation, proposal writing, and other engagement activities.
- The command frontmatter should include a clear description and the required arguments.
- Consider whether it should also update the onboarding skill's `SKILL.md` to reference this command as a recommended prerequisite step (e.g., "Before running the onboarding skill, consider running `/client-research` to generate a comprehensive research document.").

**Reference files:**
- `.planning/client-specific/00-phew/phew-site-content.md` — Ground truth output format (35 KB)
- `.claude/skills/client-onboarding/SKILL.md` — The skill that consumes this research
- `.claude/skills/client-onboarding/references/overlay-generation.md` — Shows what brand voice data is needed

### Workstream B (Should): Browser Testing of Session 19/20 Fixes

Verify in the browser that the multi-tenant fixes and session 20 changes work correctly:

1. **Default site** (no subdomain, no query param) — Should show generic "AI Playbook" with "Your Organisation" defaults, no developer track cards
2. **Phew subdomain** or `?client=phew` — Should show Phew-branded content, both tracks visible, overlay data populated in brand voice/ROI/recurring tasks sections
3. **Feedback widget** — Submit a test feedback. Verify the email includes the client name in the body.
4. **Footer** — Should adapt between generic and client-specific modes
5. **Section visibility gating** — If a client config disables sections, those sections should not appear in the sidebar or be navigable

**Tools:** Two browser testing options are available — use whichever works best:
- **`agent-browser` skill** — Higher-level agent that automates browser interactions. Preferred for sequential test flows as it avoids Playwright MCP concurrency issues.
- **Playwright MCP** — Direct browser control. Can hit concurrency problems if multiple tests run in parallel; if you encounter connection/session errors, switch to `agent-browser` instead.

Screenshots should go into `.playwright-mcp/` (gitignored).

### Workstream C (Should): Onboarding Skill Testing

Test the onboarding skill against real client data to validate the extraction and generation workflow:

1. **Phew ground truth test** — Invoke the skill against `.planning/client-specific/00-phew/phew-training-ai-and-the-art-of-the-possible-summary.md` and `https://www.phew.org.uk/`. Compare the generated config against `app/public/clients/phew.json` ground truth. Document extraction accuracy.

2. **AMD test** — Invoke the skill against `.planning/client-specific/01-amd/amd-training-summary.md`. Note: AMD has no website scrape yet — this is an ideal test case for Workstream A's client research command. If the command exists, run it first against `https://www.amdgroup.com/` (or whatever the correct URL is). Then invoke the onboarding skill with the research output.

3. **Borough test** — Invoke the skill against `.planning/client-specific/02-borough/borough-training-summary.md`. Similar approach to AMD.

4. **Document findings** — Capture skill quality observations, extraction accuracy, areas for improvement. If the skill needs iteration, make targeted fixes.

**Note:** Workstream C depends on Workstream A if we want to test the full crawl → onboard pipeline. However, the onboarding skill can be tested independently using just the training summaries (with manual brand voice context).

---

## Current File Structure

### Onboarding Skill
```
.claude/skills/client-onboarding/
├── SKILL.md                              # Core workflow (3 phases)
└── references/
    ├── field-mapping.md                  # All 33 fields with sources/defaults
    ├── overlay-generation.md             # Brand voice, tasks, ROI guidance
    └── validation-checklist.md           # Schema + quality + deployment
```

### Client Config Infrastructure
```
app/
├── public/clients/
│   ├── _template.json                    # Empty template for new clients
│   └── phew.json                         # Production Phew config (ground truth)
├── src/config/
│   ├── client-config-schema.ts           # TypeScript schema with ClientConfig type
│   ├── config-loader.ts                  # Runtime config loader (subdomain → fetch → merge → cache)
│   └── site.ts                           # Generic defaults (base config)
├── src/utils/
│   └── slug.ts                           # Shared slug extraction + sanitisation
└── api/
    └── feedback.ts                       # Vercel serverless function (multi-tenant)
```

### Client-Specific Data
```
.planning/client-specific/
├── 00-phew/
│   ├── phew-site-content.md              # Ground truth research (35 KB)
│   ├── phew-training-*-summary.md        # Training session summaries
│   └── specs/                            # Phew-specific planning artefacts
├── 01-amd/
│   ├── amd-training-summary.md           # Training summary (no website scrape)
│   └── amd-training-transcript.md        # Full transcript
└── 02-borough/
    ├── borough-training-summary.md       # Session 1 summary
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

- [ ] Client research command created and tested against at least one client website
- [ ] Command output follows the structure of `phew-site-content.md`
- [ ] Onboarding skill references the research command as a prerequisite
- [ ] Browser testing confirms default/Phew/feedback behaviour works correctly
- [ ] Onboarding skill tested against Phew data — extraction accuracy documented
- [ ] Onboarding skill tested against AMD or Borough data — new config generated
- [ ] All changes committed with themed commits
- [ ] Build, lint, format all pass

## Open Items

1. **Firecrawl MCP availability** — The command should gracefully handle Firecrawl not being connected. Check `mcp-cli tools` at session start. If unavailable, fall back to WebFetch + web search and note the limitation.
2. **AMD website URL** — The AMD training summary may reference their website. If not, search for it. AMD Engineering appears to be `https://www.amdgroup.com/` but this needs confirmation.
3. **Session 19 FAIL fixes** — Browser testing in Workstream B is the final validation of the session 19 audit fixes. If any issues are found, fix them before proceeding.
4. **Skill iteration scope** — After testing, the onboarding skill may need tweaks. Keep changes targeted — this is refinement, not redesign.

## Documents to Read Before Starting

| Document | Purpose |
|----------|---------|
| `.claude/skills/client-onboarding/SKILL.md` | The skill you are testing and updating |
| `.planning/client-specific/00-phew/phew-site-content.md` | Ground truth format for the research command output |
| `app/public/clients/phew.json` | Ground truth for onboarding skill output comparison |
| `docs/reference/client-onboarding-skill-design.md` | Original design decisions and open questions |
| `CUSTOMISATION.md` | Client onboarding checklist (recently updated with build validation step) |
