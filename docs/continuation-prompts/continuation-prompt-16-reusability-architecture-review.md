# Continuation Prompt 16 — Revised Implementation Plan: Multi-Tenant Architecture

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. Three outputs per client deployment:
1. **Interactive Playbook** -- React app with two audience tracks (General Users / Developers)
2. **Starter Kit** -- Drop-in skill files, commands, templates, governance policy
3. **Repeatable Workflow Process Doc** -- Internal process documentation

**Read first:** `CLAUDE.md` at the project root -- conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## What This Session Does

All research is complete and all architectural decisions are confirmed. This session produces the revised implementation plan at `.planning/plan-files/reusability-implementation-plan.md`, replacing the current fork-and-customise plan with one based on the confirmed Option C architecture.

**This is a PLANNING session.** The primary output is a revised plan document. Quick-win code changes (process route removal, starter kit fixes) may also be executed if time permits.

---

## Previous Session Summary

### Completed Work (Phases 0-8)
All build phases complete. 17 content sections across general and developer tracks, interactive context window simulator, governance policy template, starter kit browser, feedback widget, ROI section with calculator, feasibility study wizard. Theme system with semantic tokens. All audit fixes and content review issues resolved.

### Reusability Work Completed
- **Phase 2 (Structural Renaming): COMPLETE** -- `phewExample` renamed to `clientExample`, `siteConfig` extended from ~15 to ~30 fields, all inline "Phew!" strings in content components replaced with siteConfig references
- **Phase 1 (Quick Wins): PARTIALLY COMPLETE** -- ROI section refs fixed. Still pending: 18 Category C genericisations, `/process` route removal, 2 starter kit fixes

### Reusability Work Remaining (from current plan)
- 18 Category C references need reverting from `siteConfig.companyShortName` to generic language ("your team", "Starting point:", etc.)
- `/process` route removal (router.tsx, ProcessDocPage.tsx, WelcomeSection.tsx link, public asset)
- 2 starter kit Phew references + 1 hardcoded personal path in gsd-mapper
- `client-overlays.ts` creation (multi-sentence content blocks) -- this becomes the overlay portion of the client JSON schema
- ~~Template branch creation~~ -- superseded by client JSON template approach (`public/clients/_template.json`)
- Onboarding documentation (now a `CUSTOMISATION.md` guide for creating client JSON configs)

### Confirmed Decisions (all open questions resolved)

All 6 open questions have been answered and the following decisions are **confirmed -- do not re-ask or re-evaluate**:

| Decision | Detail |
|----------|--------|
| **Architecture** | **Option C confirmed.** Single Vite SPA + runtime JSON config per client + Vercel Routing Middleware. No framework migration. |
| **Content authoring** | JSON config files created by consultant after training. Keep scope focused -- base playbook with client customisation, not a CMS. |
| **LLM-agnostic** | Soft yes -- use "your AI tool" where natural, but no mass replacement. Claude remains primary. |
| **Developer track** | `hasDeveloperTrack` flag confirmed. Developer track content audit complete (see Agent 2 below). |
| **Starter kit** | Base set for all clients + custom additions per engagement. Cross-platform (not Claude-only). |
| **Governance** | Separate concern. Feasibility study wizard pattern is reference for future interactive template work. |
| **Database** | A Turso database is available if needed at any point, though Option C's JSON approach may not require it initially. |

**Critical constraint (developer track content extraction):** When extracting content from developer track to general track, there must be **no duplication** -- content should not exist unnecessarily in both tracks. Where patterns are extracted (e.g., hallucination avoidance), the developer track version should either be removed or reworked to provide developer-specific depth that complements (not repeats) the general version.

---

## Research Agent Findings (all confirmed)

Three agents were deployed in parallel. All findings are embedded below and have been reviewed and confirmed by the user. No need to re-read agent output files.

### Agent 1: Architecture Review (Deployment Model) -- COMPLETED
**Output file:** `/private/tmp/claude-501/-Users-liamj-Documents-development-ai-smb-playbook/tasks/ae8a9d3.output`
**Agent ID for resuming if needed:** `ae8a9d3`

**Status: COMPLETE. Key findings summarised below.**

#### Recommendation: Option C -- Hybrid Single App with Runtime JSON Config

The agent evaluated three options and recommends **Option C** as the right choice for the product vision.

#### Why Not Option A (Build-Time Injection)?
- Works for first 20 clients but has a scaling problem the user already identified
- At 100 clients: 100 build targets, every codebase update requires rebuilding all 100 static sites
- Build times scale linearly (30s build becomes 50 minutes of CI for 100 clients)
- Managing 100 Vercel projects (environments, domains, analytics) is an operational burden
- Viable stepping stone, but not the destination

#### Why Not Option B (Full Multi-Tenant with Database)?
- Premature and architecturally disruptive
- Would likely require Next.js migration (5-10 days) for SSR middleware -- no user-facing value
- Database unnecessary for this use case (~5-10 KB JSON per client)
- Authentication overhead without value (playbook content is not confidential)

#### How Option C Works

**One app, one deployment, many clients:**
- SPA deployed once on Vercel
- Vercel Routing Middleware (framework-agnostic, works with Vite) intercepts requests
- Extracts client identifier from subdomain (e.g., `phew.playbook.aisolutionhub.co.uk`)
- SPA reads identifier on load and fetches corresponding JSON config file

**Client config as JSON on CDN:**
- Each client has a JSON file (`config.json` + optional `overlays.json`)
- Storage options: Vercel Blob (simplest), `public/clients/` directory (zero-cost), or R2/S3 bucket
- Start with `public/clients/` in the repo, migrate to Vercel Blob later

**No framework migration needed.** Vite SPA stays as-is. Vercel's Routing Middleware works with any framework via a `middleware.ts` at project root.

#### Client JSON Structure

```json
{
  "siteConfig": {
    "appTitle": "Acme AI Playbook",
    "companyName": "Acme Ltd",
    "industry": "manufacturing",
    "teamSize": "medium",
    "hasDeveloperTrack": false,
    "calculatorDefaults": { ... },
    "...~30 fields"
  },
  "overlays": {
    "brandVoice": { ... },
    "roi": { "clientExamples": { ... } },
    "recurringTasks": { ... },
    "starterKit": { "includedFiles": [...] }
  },
  "sections": {
    "enabled": ["welcome","context","sessions",...],
    "disabled": ["regression-testing","mcp-usage"]
  }
}
```

#### Cost at Scale

| Clients | Vercel Pro | JSON Storage | Total Monthly |
|---------|-----------|-------------|---------------|
| 10      | $20       | $0          | ~$20          |
| 50      | $20       | $0-5        | ~$20-25       |
| 100     | $20-40    | $0-5        | ~$20-45       |

#### Onboarding Time per Client

| Step | Time | Who |
|------|------|-----|
| Create JSON config from template | 15-30 min | Consultant |
| Write overlay content (optional, can use Claude) | 30-60 min | Consultant |
| Add subdomain in Vercel | 5 min | Developer or automated |
| **Total** | **50-95 min** | |

#### Implementation Phases (from architecture agent)

**Phase 0: Complete Existing Reusability Work (prerequisite, 7-10 hrs)**
- Genericise 17 Category C references
- Remove `/process` route
- Create `client-overlays.ts` with `ClientOverlays` interface
- Extract overlay content from data files

**Phase 1: Client Config Provider (8-12 hrs)**
- Define JSON schema (`client-config-schema.ts`)
- Create `ClientConfigContext` + provider (loads JSON on mount, fallback to bundled default)
- Create config loader (extracts client slug from hostname, fetches `/clients/{slug}.json`)
- Migrate ~25 files from static `siteConfig` import to `useClientConfig()` hook
- Create `_template.json` and `phew.json` in `public/clients/`

**Phase 2: Routing Middleware (6-10 hrs)**
- Add `middleware.ts` at project root (extracts subdomain, sets `x-client-id` header)
- Configure wildcard domain `*.playbook.aisolutionhub.co.uk` in Vercel
- Section visibility filtering (enabled/disabled sections from client config)
- Developer track gating (`hasDeveloperTrack` flag)
- Multi-tenant feedback API (route emails per client)

**Total effort: ~21-32 hours from current state.**

#### Key Design Decisions
1. **Keep Vite, do not migrate to Next.js** -- Routing Middleware is framework-agnostic
2. **Store client JSON in `public/clients/` initially** -- migrate to Vercel Blob when needed
3. **Edge Config is not the right fit** -- 64 KB per-store limit on Pro, only 3 stores (too small for 100 clients)
4. **Context simulator, theme system, accessibility remain universal** -- no changes needed
5. **Existing reusability work becomes the JSON schema foundation** -- siteConfig + overlays map directly

### Agent 2: Developer Track Content Audit -- COMPLETED
**Output file:** `/private/tmp/claude-501/-Users-liamj-Documents-development-ai-smb-playbook/tasks/a3a9c90.output`
**Agent ID for resuming if needed:** `a3a9c90`

**Status: COMPLETE. Key findings summarised below.**

#### Summary of Findings

| Section | General Value | Recommendation |
|---------|--------------|----------------|
| **1.12 Avoiding Hallucinations** | **HIGH** | **RECLASSIFY to 'both' or EXTRACT 3+ patterns to general track** |
| 1.9 CLAUDE.md Files | MEDIUM | EXTRACT "Map Not Encyclopedia" principle + concise context guidelines |
| 1.10 Documentation Structure | MEDIUM | EXTRACT "knowledge in heads is invisible to AI" + "What NOT to Document" |
| 1.16 Codebase Auditing | LOW-MEDIUM | KEEP as developer-only |
| 1.11 Codebase Mapping | LOW | KEEP as developer-only |
| 1.13 Regression Testing | LOW | KEEP as developer-only |
| 1.14 Safe MCP Usage | LOW | KEEP as developer-only |
| 1.15 Plugin Recommendations | LOW | KEEP as developer-only |

#### Critical Gap: Hallucinations Section (1.12)

The section already has `crossTrack: true` and `crossTrackNote` fields on 3 of 7 patterns, acknowledging their general value:
- Pattern 1 "Break Tasks into Atomic Components"
- Pattern 2 "Plan Before Implementing"
- Pattern 5 "Give Claude an 'Out' (Permit 'I Don't Know')"

The key takeaways section (lines 238-245) is entirely audience-agnostic. If the developer track is hidden for non-software clients, these would be lost.

#### Suggested Implementation Path

1. **Create a general-track "Getting Reliable Output" section** (or add to Session Management 1.3):
   - What hallucinations are (reframed for prose/documents/business advice, not code)
   - Patterns 1, 2, 3 (ask for options), and 5 with general-audience prompt examples
   - Key takeaways

2. **Add a "Giving Claude Persistent Context" subsection** to Section 1.2 or 1.3:
   - "Map, Not Encyclopedia" principle (from 1.9)
   - "Be concise, specific, current, actionable" (from 1.9)
   - "Knowledge in people's heads is invisible to Claude" (from 1.10)
   - "What NOT to include" (from 1.10)
   - Reframed for Claude Projects / custom instructions rather than CLAUDE.md files

3. **Keep 1.11, 1.13, 1.14, 1.15, 1.16 as developer-only** -- correctly gated.

4. **No duplication constraint:** After extracting patterns to the general track, review the developer track originals. Remove duplicated content or rework it to provide developer-specific depth (code-oriented examples, technical nuance) that complements rather than repeats the general version. Users who see both tracks should not encounter the same material twice.

### Agent 3: Starter Kit Base/Custom Split -- COMPLETED
**Output file:** `/private/tmp/claude-501/-Users-liamj-Documents-development-ai-smb-playbook/tasks/ac28e73.output`
**Agent ID for resuming if needed:** `ac28e73`

**Status: COMPLETE. Key findings summarised below.**

#### Base Starter Kit (every client gets these)

**Skills (7):** `uk-english`, `session-handoff`, `brand-voice`, `brand-review`, `brainstorming`, `file-organizer`, `markdown-converter`

**Commands (1):** `brand-review`

**Templates (4):** `governance-policy-template`, `claude-md-template`, `docs-structure-template`, `feasibility-study-template`

**Prompts (3):** `brand-voice-setup-prompt`, `example-handoff-general`, `example-handoff-technical`

#### Custom Addition Categories

| Category | Items | When to add |
|----------|-------|-------------|
| **Developer Tools** | `writing-plans`, `writing-skills`, `mermaid-diagrams`, `agent-browser`, `gsd-mapper`, plugins: `commit-commands`, `claude-md-management`, `pr-review-toolkit`, `code-simplifier`, `context7`, `github`, `playwright` | Client has a dev team |
| **Business Development** | `proposal-writer` (+ 11 rule files) | Consulting/services firms |
| **Creative/Design** | `canvas-design` (+ 80+ font files) | Design agencies |
| **Integration-Specific** | `sentry`, `asana`, `github`, `playwright` plugins | Based on client's tool stack |
| **Compliance/Security** | `security-guidance` plugin | Regulated industries |

#### Files Needing Genericisation

1. `starter-kit/skills/brand-review/SKILL.md` line 51: "all Phew! content" -> "all content"
2. `starter-kit/commands/brand-review.md` line 48: "all Phew! content" -> "all content"
3. `starter-kit/gsd-mapper/command/map-codebase.md` line 23: hardcoded `/Users/liamj/` personal path -- needs to be relative or parameterised
4. Example handoff prompts use safeguarding-specific scenarios ("SafeguardHub", "DfE reports") -- consider genericising or keeping as illustrative samples

#### App Display Recommendation

Add a `tier: 'base' | 'custom'` and optional `customCategory` field to `StarterKitFile` in `starter-kit-data.ts`. Show base items by default; show custom items in a separate section gated by a siteConfig option like `enabledCustomCategories: ['developer-tools', 'business-development']`.

---

## What to Do in This Session

All decisions are confirmed. Go directly to plan production.

### Step 1: Read Current Plan for Category C Reference List
Read `.planning/plan-files/reusability-implementation-plan.md` -- specifically Section 9.1 which contains the file-by-file Category C genericisation list with line numbers. This detail must be preserved in the revised plan.

### Step 2: Produce Revised Implementation Plan
Replace the current plan at `.planning/plan-files/reusability-implementation-plan.md` with a revised version that incorporates:

1. **Option C architecture** (single app + runtime JSON config + Vercel Routing Middleware)
2. **Developer track content extraction** with no-duplication constraint:
   - New general-track "Getting Reliable Output" section (from 1.12 hallucinations)
   - New "Giving Claude Persistent Context" subsection (from 1.9/1.10)
   - Developer track originals reworked to avoid repetition
3. **Starter kit base/custom split** with `tier` and `customCategory` fields in `StarterKitFile`
4. **Category C genericisation** (18 references -- preserve the file-by-file list from Section 9.1)
5. **Process route removal** (router.tsx, ProcessDocPage.tsx, WelcomeSection.tsx, public asset)
6. **Starter kit genericisation** (3 files with Phew/personal path references)
7. **Client JSON schema** (replaces `client-overlays.ts` + `siteConfig` as the runtime data source)
8. **ClientConfigContext** (React context provider, config loader, `useClientConfig()` hook)
9. **Vercel Routing Middleware** (`middleware.ts`, wildcard domain, multi-tenant feedback API)
10. **Section visibility and track gating** (enabled/disabled sections, `hasDeveloperTrack` flag)

The plan should have:
- Clear phase sequencing with dependencies
- Effort estimates per phase
- File-by-file change lists where applicable
- Any remaining open questions (there should be few -- most decisions are made)

### Step 3: Execute Quick Wins (if time permits)
These are architecture-independent and safe to execute immediately:
- Process route removal (4 files)
- Starter kit genericisation (3 files)
- Category C genericisation (18 references across 8 files)

---

## Key Files

### Agent Outputs (all three embedded inline above -- `/private/tmp/` files are ephemeral)
| Agent | ID | Status | Key Finding |
|-------|----|--------|-------------|
| Architecture Review | `ae8a9d3` | COMPLETE | Recommends Option C: single app + runtime JSON config + Vercel Routing Middleware |
| Developer Track Audit | `a3a9c90` | COMPLETE | Hallucinations section HIGH value for general track; extract patterns from 1.9/1.10 |
| Starter Kit Split | `ac28e73` | COMPLETE | 7 base skills, 4 templates, 3 prompts; custom categories by client type |

### Current Plan and Context
| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project conventions, tech stack, critical rules |
| `.planning/plan-files/reusability-implementation-plan.md` | Current plan (to be revised) -- contains Section 9 file-by-file change list for Category C genericisation which remains valid |
| `docs/repeatable-workflow.md` | The consultant's workflow -- context for content authoring decisions |
| `app/src/config/site.ts` | Current siteConfig (~30 fields) |
| `app/src/content/shared/sections.ts` | Section registry with track assignments |
| `app/src/content/shared/roi-data.ts` | Reference implementation for data-separated architecture |
| `app/src/content/shared/brand-voice-data.ts` | Data file with clientExample fields needing overlay treatment |
| `app/src/routes/router.tsx` | Router (process route still present) |

### Files That May Need Changes (from current plan, still valid)
| File | Change Needed |
|------|---------------|
| 7 developer track sections | 18 Category C siteConfig refs to genericise (Section 9.1 of current plan has full list) |
| `RecurringTasksSection.tsx` | 1 Category C ref (line 586) |
| `router.tsx` | Remove `/process` route (lines 7, 17-19) |
| `ProcessDocPage.tsx` | DELETE |
| `app/public/docs/repeatable-workflow.md` | DELETE |
| `WelcomeSection.tsx` | Remove process doc paragraph and link (~lines 454-468) |
| `starter-kit/commands/brand-review.md` | Line 48: "all Phew! content" -> "all content" |
| `starter-kit/skills/brand-review/SKILL.md` | Line 51: "all Phew! content" -> "all content" |
| `starter-kit/gsd-mapper/command/map-codebase.md` | Line 23: hardcoded `/Users/liamj/` personal path -- make relative or parameterised |

---

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format       # Prettier -- format all files
cd app && bun run format:check # Prettier -- check without writing
```

---

## Build Status (as of previous session)

- `cd app && bun run build` -- passes
- `cd app && bun run lint` -- 0 errors
- `cd app && bun run format:check` -- passes

---

## Verification After This Session

- [ ] Revised implementation plan created at `.planning/plan-files/reusability-implementation-plan.md`
- [ ] Plan reflects Option C architecture (single app + runtime JSON config + Vercel Routing Middleware)
- [ ] Plan includes phased approach with effort estimates and dependencies
- [ ] Category C genericisation list preserved with file-by-file detail (18 references from Section 9.1 of current plan)
- [ ] Developer track content extraction plan includes no-duplication check
- [ ] Starter kit base/custom split incorporated with `tier`/`customCategory` fields
- [ ] Process route removal included
- [ ] Client JSON schema defined (siteConfig + overlays + sections)
- [ ] Any remaining open questions documented (should be minimal)
- [ ] Quick wins executed if time permitted (process route, starter kit fixes, Category C genericisation)

---

## Important Notes

- **All agent findings are embedded inline above.** The `/private/tmp/` output files are ephemeral and may not exist. Agent IDs for resuming if full output is needed: `ae8a9d3` (architecture), `a3a9c90` (dev track audit), `ac28e73` (starter kit).
- **All decisions are confirmed.** Option C architecture, developer track extraction, starter kit split, LLM-agnostic approach, and governance separation. Do not re-ask or re-evaluate.
- **Category C genericisation and process route removal are architecture-independent** -- they should proceed first as quick wins.
- **No duplication between tracks.** When extracting developer content to general, ensure the developer version is reworked or removed so both-track users don't see repeated material.
- **Turso database is available** if a persistent data store is needed at any point (e.g., analytics, admin panel, content management). Not required for the initial Option C implementation.
- **UK English throughout** -- all content, examples, and copy must use UK English spelling and grammar.
