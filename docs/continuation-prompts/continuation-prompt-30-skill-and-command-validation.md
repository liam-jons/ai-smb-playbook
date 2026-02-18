# Continuation Prompt 30 — Onboarding Skill & Research Command Validation

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. The app is deployed as a multi-tenant SPA — each client gets a subdomain and a JSON config file. A single build serves all clients. Two outputs per client deployment:
1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, commands, templates, governance policy

**Read first:** `CLAUDE.md` at the project root — conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### Sessions 17–21 — Multi-Tenant Architecture & Research Command (Complete)

Multi-tenant SPA on `main`. Client identified by subdomain, config loaded at runtime from `/clients/{slug}.json`. `/client-research` command created and tested once against Phew. Onboarding skill created with three reference files.

### Session 28 — Client Logo Support (Committed)

`ClientLogo` component with dark mode switching, schema extended with logo fields, HomePage updated.

### Session 29 — Onboarding Skill Testing & Title Fix (Committed)

**Workstream A — Onboarding skill tested against Phew ground truth:**
- 76% exact match, 89% with partial matches (37 fields)
- Key gaps: brand punctuation (`Phew!` vs `Phew`), `certificationName` (DBS checks = domain knowledge not in source docs), `database` (SQL Server not in any source), `industryContext` ambiguity
- Field-mapping rules updated with 6 improvements: punctuation handling, sector-specific certification hints, consultant-required field guidance

**Workstream B — Document title fix:** `ClientConfigProvider` now sets `document.title` and meta description from client config.

**Workstream C — Client research command re-test: NOT DONE.** Was deferred — NOT due to Playwright (which was a separate browser-testing issue for the title fix). The research command uses Firecrawl MCP or WebFetch/WebSearch — no browser automation involved.

### Build Status

All pass: `build`, `lint`, `format:check`.

---

## What This Session Does

Four workstreams, in priority order. The overarching goal is to validate the full crawl → onboard pipeline end-to-end with a real new client, not just Phew.

### Workstream A (Must): Validate Skills and Commands with Quality Review

Before running the skill and command against real clients, validate their quality using the available review tools.

**Steps:**

1. **Review the onboarding skill** — Use the `plugin-dev:skill-reviewer` agent (or the `writing-skills` skill) to evaluate `.claude/skills/client-onboarding/SKILL.md` and its three reference files. Focus on:
   - Is the consultant interaction model clear? (The skill MUST ask questions when uncertain rather than guessing)
   - Are output paths documented correctly?
   - Does the Phase 2 grouped review encourage real consultant dialogue?
   - Are low-confidence extractions explicitly flagged for confirmation?

2. **Review the research command** — Evaluate `.claude/commands/client-research.md` similarly:
   - Is the output path clear? (`.planning/client-specific/{slug}/{name}-site-content.md`)
   - Does it handle gaps by noting them rather than fabricating?
   - Is the quality standard (Phew ground truth as benchmark) well-communicated?

3. **Apply any improvements** identified by the review before proceeding to Workstreams B and C.

### Workstream B (Must): Run Client Research Command End-to-End

Test the `/client-research` command against a real client website. This validates the Firecrawl/WebFetch pipeline and produces the input needed for Workstream C.

**Recommended test client:** AMD Engineering or Borough Engineering Services (both have training summaries available).

**AMD context:**
- Training summary at `.planning/client-specific/01-amd/amd-training-summary.md` (14 Oct 2025)
- Full transcript at `.planning/client-specific/01-amd/amd-training-transcript.md`
- Company appears to be an engineering/construction firm (PQQs, O&M manuals, compliance tracking, contract review)
- Website URL needs confirming — try `https://www.amdgroup.com/` or search for the correct URL
- Attendees included: Alex Wilmot, Brian McFarlane, Cameron Turk, Claire Forrest, Daniel Pearce, George Craig, James Perry, James Tranham, Jana Christofi, Jon King, Marcus Sullivan, Murray Halliday, Raj Gill, Richard Sharpe, Sonia Bateman

**Borough context:**
- Training summary at `.planning/client-specific/02-borough/borough-training-summary.md` (30 Sept 2025)
- Second session at `.planning/client-specific/02-borough/borough-training-session-02-summary.md`
- Engineering services company (PQQs, financial reporting, asset registers, meeting transcription)
- Website URL needs confirming — try `https://www.borough-es.co.uk/` (email domain in summary is `@borough-es.co.uk`)

**Steps:**

1. Confirm the client website URL (use web search if needed)
2. Run `/client-research {url} "{company name}" {slug}` — e.g. `/client-research https://www.amdgroup.com/ "AMD Group" 01-amd`
3. Compare output quality against the Phew ground truth at `.planning/client-specific/00-phew/phew-site-content.md`
4. Document any command issues or improvements needed

### Workstream C (Must): Run Onboarding Skill End-to-End

This is the key test — run the full onboarding skill as though onboarding a real new client. The consultant (Liam) is available to answer questions.

**Critical requirement:** The skill must NOT operate fully automatically. Any uncertainty or ambiguity must be flagged as a question to the consultant. Examples of things that require confirmation:
- `companyShortName` — especially if the brand uses stylised punctuation
- `industryContext` — if company name differs from business activity
- `certificationName` — if domain-specific knowledge is needed
- `database` — if not mentioned in any source document
- `hasDeveloperTrack` — confirm even if signals suggest true/false
- Overlay content — brand voice steps should be presented for approval, not auto-committed
- Any field where confidence is below "high"

**Steps:**

1. Read the research document produced in Workstream B (or existing training summaries)
2. Invoke the onboarding skill workflow against the chosen client's data
3. Follow the Phase 1 → Phase 2 → Phase 3 workflow exactly as written
4. During Phase 2 grouped review, present draft values and ASK the consultant for corrections
5. Write the final JSON to `app/public/clients/{slug}.json`
6. Run build verification
7. Document extraction accuracy and any skill issues

**If Workstream B was skipped:** Use the existing training summaries for AMD or Borough directly. The skill can still extract fields from transcripts — it just won't have the richer research document context.

### Workstream D (Should): Browser Test Document Title Fix

Verify session 29's document title fix works in the browser. This requires the Playwright MCP browser to be available (close any existing Chrome sessions first).

**Steps:**
1. Start dev server: `cd app && bun run dev`
2. Navigate to `http://localhost:4100?client=phew`
3. Check `document.title` shows "Phew! AI Playbook" (not generic "AI Playbook")
4. Navigate to `http://localhost:4100` (no client param)
5. Check `document.title` shows "AI Playbook" (generic default)

---

## Key Files

### Skill & Command Under Test
```
.claude/commands/client-research.md                  # Research command to test
.claude/skills/client-onboarding/
  ├── SKILL.md                                       # Onboarding skill workflow
  └── references/
      ├── field-mapping.md                           # Field derivation rules (updated session 29)
      ├── overlay-generation.md                      # Brand voice, tasks, ROI guidance
      └── validation-checklist.md                    # Schema + quality checks
```

### Ground Truth & Reference
```
app/public/clients/phew.json                         # Ground truth client config
app/public/clients/_template.json                    # Template for new clients
.planning/client-specific/00-phew/
  └── phew-site-content.md                           # Ground truth research output (35 KB)
```

### Client Data for Testing
```
.planning/client-specific/01-amd/
  ├── amd-training-summary.md                        # AMD training summary (14 Oct 2025)
  └── amd-training-transcript.md                     # AMD full transcript
.planning/client-specific/02-borough/
  ├── borough-training-summary.md                    # Borough session 1 (30 Sept 2025)
  └── borough-training-session-02-summary.md         # Borough session 2
```

### Config Infrastructure
```
app/src/config/
  ├── client-config-schema.ts                        # ClientConfig interface
  ├── client-config-context.tsx                       # React context provider (includes title fix)
  ├── config-loader.ts                               # Runtime loader with caching
  └── site.ts                                        # Bundled defaults
```

---

## Output Paths Reminder

| Artefact | Output Location | Created By |
|----------|----------------|------------|
| Research document | `.planning/client-specific/{slug}/{name}-site-content.md` | `/client-research` command |
| Client config JSON | `app/public/clients/{slug}.json` | Onboarding skill (Phase 3) |
| Client logo | `app/public/clients/logos/{slug}.webp` | Manual — consultant provides |

---

## Consultant Interaction Model

**This is critical.** The onboarding skill and research command are tools for a consultant, not fully autonomous pipelines. The consultant (Liam) is the human in the loop.

**Research command:** Runs autonomously but documents gaps and uncertainties. The "After Completion" section should list gaps that need consultant input. No fabrication — if information is missing, say so.

**Onboarding skill:** Follows a two-phase conversation model:
- **Phase 1** extracts and derives fields, flagging low-confidence values
- **Phase 2** presents grouped drafts and ASKS for corrections before writing
- **Phase 3** writes, validates, and outputs deployment guidance

The skill must use `AskUserQuestion` or direct questions in output when:
- A field has multiple plausible values
- A value was inferred rather than extracted
- Domain-specific knowledge is needed (certifications, compliance requirements)
- Brand voice content needs approval
- The consultant might have context that the source documents lack

---

## Key Conventions Reminder

- **UK English throughout.** All content, examples, copy. Use £ not $.
- **Tailwind v4 — no config file.** Theme in `app/src/index.css` via `@theme inline {}`.
- **bun** for all package operations.
- **Multi-tenant SPA.** One build, many clients. Config from `/clients/{slug}.json`.
- **Client slug rules.** Lowercase, hyphens only. Validated by `sanitiseSlug()`.
- **Commands vs skills.** Commands are user-invoked slash commands. Skills are triggered by natural language or context matching.

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

- [ ] Onboarding skill and research command reviewed for quality (skill-reviewer or writing-skills)
- [ ] Client research command tested end-to-end against a real client website
- [ ] Onboarding skill run end-to-end with real client data — consultant questions asked and answered
- [ ] New client config JSON passes build, lint, format checks
- [ ] Document title fix verified in browser (if Playwright available)
- [ ] All changes committed with themed commits
- [ ] Continuation prompt for session 31 created (if needed)

## Open Items

1. **AMD website URL** — needs confirming before running `/client-research`
2. **Borough website URL** — likely `borough-es.co.uk` based on email domain in training summary
3. **Feedback widget testing** — still not covered. Manual or automated verification needed.
4. **Section visibility gating** — untested. If a client config disables sections, verify they're removed from sidebar.
5. **Full pipeline test** — research → onboard → deploy → browser verify. This session should complete the first three steps.
