# Continuation Prompt 37 — Playbook Review Skill Testing & Generic Section Fixes

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. The app is deployed as a multi-tenant SPA — each client gets a subdomain and a JSON config file. A single build serves all clients.

**Read first:** `CLAUDE.md` at the project root — conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### Session 36: AMD Production Readiness Fixes — Complete

All 10 production readiness issues addressed:

**Code fixes (committed):**
1. WelcomeSection hides "Developer Guide" link when `hasDeveloperTrack: false`
2. NotFoundPage hides "Developer Track" button when `hasDeveloperTrack: false`
3. ClientConfigProvider shows loading spinner while config loads (no more FOUC)
4. Error state rendering when client config fails to load

**Content improvements (committed):**
5. AMD brand voice key "2" expanded from 1 to 4 attributes
6. Recurring task "meeting minutes" replaced with MEP-specific "O&M manual compilation"
7. Writing Plans and Writing Skills reclassified to `business-development` category
8. Murray Halliday reference anonymised to "Your commercial team"

**Schema cleanup (committed):**
9. `certificationName` removed from schema, defaults, and all client configs
10. `primaryAiTool` removed from schema, defaults, loader, and all client configs

**New skill created:**
- `playbook-review` skill at `.claude/skills/playbook-review/`
- Includes SKILL.md, references/review-checklist.md, references/known-issues.md
- Designed for parallel browser + code subagent review of client deployments

### Current state
- Branch: `main`, 8 commits ahead of `origin/main`
- Build, lint, format all pass
- Two client configs: `phew.json` (design agency, dev track enabled) and `amd.json` (MEP contractor, general track only)

---

## What This Session Does

Two workstreams, in order:

### Workstream A: Fix Generic Sections (2 code changes)

Two sections have content that doesn't work correctly for multi-tenant deployment:

#### Fix 1: SkillsExtensionsSection hardcoded licence line
- **File:** `app/src/content/general/SkillsExtensionsSection.tsx`
- **Bug:** Around line 416-418, the section hardcodes "Your team has Claude Teams licences for all staff and Claude Code access for developers." This is factually wrong for AMD (no developer access) and will be wrong for any client without Claude Code.
- **Fix approach:** Import `useSiteConfig()`. Replace the hardcoded text with a conditional:
  - If `hasDeveloperTrack`: "Your team has Claude Teams licences for all staff and Claude Code access for developers."
  - If not: "Your team has Claude Teams licences for all staff."
- **Also check:** Whether there are other hardcoded assumptions in this section that should be config-driven. The section has zero config hooks currently.

#### Fix 2: ReliableOutputSection generic example
- **File:** `app/src/content/general/ReliableOutputSection.tsx`
- **Bug:** Uses "a client proposal for a new website redesign project" as a prompt example. This fits Phew (design agency) but is irrelevant for AMD (MEP contractor) or any non-design client.
- **Fix approach:** Import `useSiteConfig()` and `useOverlays()`. Check if there's an overlay key that could provide a client-specific example. If not, use `siteConfig.primaryProduct` or `siteConfig.industryContext` to make the example contextually relevant.
- **Example for AMD:** "a client proposal for a new MEP services installation" or similar.
- **Consider:** Whether to add a new overlay key (e.g. `overlays.reliableOutput.examplePrompt`) or whether parameterising the existing text with `primaryProduct` is sufficient.

### Workstream B: Test Playbook Review Skill

Run the new `playbook-review` skill against both client deployments:

#### Test 1: AMD (`?client=amd`)
- Run: "review the playbook for amd"
- Expected: Skill triggers, spawns 6-8 parallel agents, produces GO/NO-GO report
- Key things to validate:
  - Browser agents successfully navigate pages using the agent-browser skill
  - Code agents correctly identify AMD's section list (10 general-track sections, no developer)
  - Config completeness checks pass (all required fields present)
  - Overlay quality checks pass (brand voice 7 keys, 4 recurring tasks, 3 ROI examples)
  - Known issues (from `references/known-issues.md`) are noted but not flagged as blocking
  - Report is saved to `.planning/client-specific/01-amd/`

#### Test 2: Phew (`?client=phew`)
- Run: "review the playbook for phew"
- Expected: Skill triggers, spawns more agents (includes developer track)
- Key things to validate:
  - Developer track sections are reviewed
  - All 19 sections (11 general + 8 developer) are covered
  - No regressions from the schema cleanup (certificationName, primaryAiTool removal)
  - Report is saved to `.planning/client-specific/00-phew/`

#### After testing, evaluate:
1. Did the skill trigger correctly from natural language?
2. Were the right number of agents spawned?
3. Did browser agents use the agent-browser skill effectively?
4. Was the report useful — does it catch real issues and ignore false positives?
5. What needs to change for v2?

Update `references/known-issues.md` with any new findings.

#### Skill quality validation

After testing, use the available `plugin-dev` skills to validate the quality and structure of the playbook-review skill:

- **`plugin-dev:skill-reviewer`** — review the skill for quality, triggering effectiveness, and best practices. Run this after any modifications to `SKILL.md` to ensure the description, progressive disclosure, and reference structure meet standards.
- **`plugin-dev:skill-development`** — consult for guidance on skill structure, progressive disclosure patterns, and development best practices if refactoring is needed.
- **`writing-skills`** — use when editing the skill to verify it works correctly before committing changes.

These tools provide structured feedback on whether the skill description triggers reliably, whether the reference documents are well-organised, and whether the overall skill follows Claude Code plugin conventions.

---

## Key Files

### Generic Section Fix Targets
```
app/src/content/general/SkillsExtensionsSection.tsx    # Fix 1: hardcoded licence line
app/src/content/general/ReliableOutputSection.tsx       # Fix 2: generic example
```

### Playbook Review Skill
```
.claude/skills/playbook-review/SKILL.md                 # Main skill definition
.claude/skills/playbook-review/references/review-checklist.md   # Detailed review rubric
.claude/skills/playbook-review/references/known-issues.md       # Issue tracking for feedback loop
```

### Client Configs
```
app/public/clients/amd.json                             # AMD: general track only
app/public/clients/phew.json                            # Phew: both tracks
```

### Section Source Files (for code review agents)
```
app/src/content/shared/sections.ts                      # Section registry with track assignments
app/src/content/shared/registry.ts                      # Lazy-loaded component map
app/src/content/general/                                # General track section components
app/src/content/developer/                              # Developer track section components
app/src/content/shared/                                 # Shared section components
```

---

## Key Conventions Reminder

- **UK English throughout.** All content, examples, copy. Use £ not $.
- **Tailwind v4 — no config file.** Theme in `app/src/index.css` via `@theme inline {}`.
- **bun** for all package operations. Dev server: `cd app && bun run dev` (port 4100).
- **Multi-tenant SPA.** One build, many clients. Config from `/clients/{slug}.json`.
- **Never import `site.ts` directly in components.** Use context hooks (`useSiteConfig()`, `useOverlays()`).
- **Agent-browser skill:** Browser review agents must use the `agent-browser` skill for all browser interactions. This is critical — it provides Playwright-based browser automation that's more comprehensive than manual screenshot checking.

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format:check # Prettier check
```

## Verification After This Session

- [ ] Fix 1: SkillsExtensionsSection licence line is config-driven
- [ ] Fix 2: ReliableOutputSection example is client-relevant
- [ ] Build, lint, format pass after generic section fixes
- [ ] Playbook review skill triggers from natural language
- [ ] AMD review: GO/NO-GO report generated with section-by-section results
- [ ] Phew review: GO/NO-GO report generated, includes developer track sections
- [ ] Browser agents used agent-browser skill successfully
- [ ] known-issues.md updated with findings from both reviews
- [ ] All changes committed
