# Continuation Prompt 33 — AMD Group Onboarding Completion & Borough Fallback Test

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. The app is deployed as a multi-tenant SPA — each client gets a subdomain and a JSON config file. A single build serves all clients. Two outputs per client deployment:
1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, commands, templates, governance policy

**Read first:** `CLAUDE.md` at the project root — conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### Sessions 17–21: Multi-tenant architecture & research command — Complete
Full multi-tenant SPA on `main`. Client identified by subdomain, config loaded at runtime from `/clients/{slug}.json`. `/client-research` command created and tested against Phew.

### Session 28: Client logo support — Complete
`ClientLogo` component with dark mode switching, schema extended with logo fields.

### Session 29: Onboarding skill testing & document title fix — Complete
Onboarding skill tested against Phew ground truth (76% exact match, 89% with partials). Field-mapping rules updated with 6 improvements. `ClientConfigProvider` now sets `document.title` and meta description from client config.

### Session 30: Skill validation, AMD research, and partial onboarding — Partially complete
**Three workstreams completed, one partially done:**

**Workstream A — Skill & command quality review: Complete.**
Onboarding skill reviewed at 8/10 quality. All 6 priority improvements applied:
- Added interaction model section (never guess, cite sources, confirm at each group)
- Active Phase 2 language ("Are these correct, or should I change anything?")
- Logo fields documented in field-mapping reference
- `companyUrlDisplay` derivation clarified (strip `www.` subdomain)
- Slug collision check added before file write
- Trigger description expanded for better matching

**Workstream B — AMD research command: Complete.**
Research output at `.planning/client-specific/01-amd/amd-group-site-content.md` (~30 KB, 13 sections). Key findings:
- AMD Group is a nationwide MEP (Mechanical, Electrical, Plumbing) services provider, founded 1971, ~50-66 employees
- Group structure: AMD Group Holdings (holding company) → AMD Environmental (main ops), AMD Environmental (North), AMD FM
- Offices in Dartford (HQ), Edinburgh, Sheffield
- 12 named leadership team, 14+ accreditations
- Major clients include Wates, Lloyds, Barclays, HMCTS, BBC, Ford
- Key AI use cases from training: PQQ automation, compliance tracking, O&M manuals, contract review

Research gaps documented: exact employee count (50-66 range), revenue (estimated £7m unconfirmed), founding date discrepancy (1971 vs 1989 incorporation), ICO registration not found.

**Workstream C — AMD onboarding: Phase 1 done, Phase 2 Group 1 confirmed.**
Phase 1 extraction completed. Group 1 (Company Details) reviewed and confirmed by consultant with one correction:
- **`companyShortName` confirmed as "AMD Group"** (not "AMD"). This changes derived fields:
  - `appTitle` → "AMD Group AI Playbook"
  - `emailSubjectPrefix` → "AMD Group AI Playbook"
  - `welcomeSubtitle` → "Getting started with AI at AMD Group"
  - `localStoragePrefix` → "amd-group-playbook"
- **Training date:** 14 October 2025 confirmed. This was the second of two training sessions — the first was general training delivery, the second (transcript provided) focused on use cases.
- **Slug:** `amd` (not `amd-group`, to keep URLs short)

**Workstream D — Browser test of document title fix: Skipped.** Covered by other sessions' browser work.

### Session 31: Homepage polish & design critique — Complete (separate session)
Dark mode logo container fallback, track card compaction, spacing refinements. Comprehensive design critique conducted — improvements captured in continuation prompt 32. Onboarding skill improvements from Workstream A committed (`98e9486`).

### Uncommitted from session 30
The AMD research document is at `.planning/client-specific/01-amd/amd-group-site-content.md` but `.planning/` is gitignored (internal planning artefacts — this is correct). No uncommitted code changes remain from session 30.

---

## What This Session Does

Resume the AMD Group onboarding from Phase 2 Group 2, complete the full pipeline, then run Borough as a degraded-source test.

### Task 1: Complete AMD Group Onboarding — Phase 2 Groups 2–6 (Must)

Resume the onboarding skill workflow. Phase 1 is done. Group 1 is confirmed. Present Groups 2–6 for consultant review.

**Read these files first:**
- `.claude/skills/client-onboarding/SKILL.md` — the skill workflow to follow
- `.planning/client-specific/01-amd/amd-group-site-content.md` — the research document (30 KB)
- `.planning/client-specific/01-amd/amd-training-summary.md` — training session summary
- `.planning/client-specific/01-amd/amd-training-transcript.md` — full transcript

**Group 1 values (already confirmed):**

| Field | Value |
|-------|-------|
| `companyName` | "AMD Group" |
| `companyShortName` | "AMD Group" |
| `companyUrl` | "https://amd-group.co.uk/" |
| `companyUrlDisplay` | "amd-group.co.uk" |
| `appTitle` | "AMD Group AI Playbook" |
| `slug` | amd |
| `localStoragePrefix` | "amd-playbook" |
| `emailSubjectPrefix` | "AMD Group AI Playbook" |
| `consultantName` | "Liam" |
| `trainingDate` | "14 October 2025" |
| `welcomeSubtitle` | "Getting started with AI at AMD Group" |
| `feedbackEmail` | "liam@aisolutionhub.co.uk" |
| `feedbackSenderEmail` | "playbook@feedback.aisolutionhub.co.uk" |
| `metaDescription` | "Practical guidance for getting the most from Claude AI" |

**Key consultant decisions still needed (flag these explicitly):**

1. **`hasDeveloperTrack`** — Likely `false`. No developer team evident in training or research. But ask to confirm.
2. **`certificationName`** — AMD has 14+ accreditations (Gas Safe, NICEIC, CHAS, SafeContractor, Constructionline Gold, CSCS, etc.). Which is the most relevant for AI context? Probably "Gas Safe / NICEIC" as these are their core trade certifications.
3. **`industryContext`** — "MEP contractor" vs "engineering firm" vs "facilities management company". The research shows they do M&E installation, maintenance, and facilities management.
4. **Brand voice overlay content** — Must present all 7 framework steps for approval. AMD's tone should reflect their professional, safety-conscious, multi-site operations culture.
5. **`complianceArea`** — Gas safety regulations? Building regulations? Health & safety? The research shows multiple compliance areas.
6. **`sensitiveDataDescription`** and `sensitiveDataLabel`** — What sensitive data do they handle? Client site data, building specifications, gas safety records?

**Follow the skill workflow exactly:**
- Present each group as described in the skill
- Ask "Are these correct, or should I change anything?" after each group
- Do not proceed to the next group until confirmed
- For low-confidence fields, cite the source and ask explicitly

### Task 2: Write AMD Config JSON and Verify (Must)

After Phase 2 review is complete:

1. Check if `app/public/clients/amd.json` already exists
2. Write the final JSON to `app/public/clients/amd.json`
3. Run validation: `cd app && bun run build && bun run lint && bun run format:check`
4. Verify the config loads correctly: start dev server and navigate to `http://localhost:4100/?client=amd`

### Task 3: Borough Research — Degraded Source Test (Should)

Run the `/client-research` command against Borough Engineering Services. Their website (`https://www.borough-es.co.uk/`) is currently out of service — this is a deliberate test of fallback handling.

**Expected behaviour:**
1. Research command detects website is down
2. Falls back to LinkedIn (`https://www.linkedin.com/company/borough-engineering-services-ltd/about/`), Companies House, and web search
3. Every fallback-sourced fact is clearly attributed
4. Gaps from the missing website are explicitly documented
5. Output is sufficient to run the onboarding skill (with heavier consultant input)

**Command:** `/client-research https://www.borough-es.co.uk/ "Borough Engineering Services" 02-borough`

**Borough context:**
- Engineering services company (PQQs, financial reporting, asset registers, meeting transcription)
- Training summaries at `.planning/client-specific/02-borough/borough-training-summary.md` and `borough-training-session-02-summary.md`
- Email domain: `@borough-es.co.uk`

### Task 4: Borough Onboarding (Nice-to-have)

If Task 3 produces a usable research document, run the onboarding skill against Borough. This tests the full pipeline with degraded source data. Expect more "ask the consultant" prompts and fewer auto-derived fields.

### Task 5: Commit All Changes (Must)

Commit any new files:
- `app/public/clients/amd.json` (if created)
- Borough research document (gitignored — `.planning/` is in `.gitignore`, so this won't be tracked)
- Any other changes

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

### AMD Client Data
```
.planning/client-specific/01-amd/
  ├── amd-group-site-content.md                      # Research output (30 KB, 13 sections)
  ├── amd-training-summary.md                        # Training summary (14 Oct 2025)
  └── amd-training-transcript.md                     # Full transcript
```

### Borough Client Data
```
.planning/client-specific/02-borough/
  ├── borough-training-summary.md                    # Session 1 summary (30 Sept 2025)
  └── borough-training-session-02-summary.md         # Session 2 summary
```

### Ground Truth & Reference
```
app/public/clients/phew.json                         # Ground truth client config
app/public/clients/_template.json                    # Template for new clients
.planning/client-specific/00-phew/phew-site-content.md  # Ground truth research output
```

### Config Infrastructure
```
app/src/config/
  ├── client-config-schema.ts                        # ClientConfig interface
  ├── client-config-context.tsx                       # React context provider
  ├── config-loader.ts                               # Runtime loader with caching
  └── site.ts                                        # Bundled defaults
```

---

## Consultant Interaction Model

**This is critical.** The onboarding skill is a tool for a consultant, not a fully autonomous pipeline. The consultant (Liam) is the human in the loop.

- **Never guess low-confidence fields** — ask explicitly. The cost of asking is low; the cost of a wrong value in the deployed config is high.
- **Present extractions with source quotes** — when showing a derived value, cite where it came from.
- **Ask for explicit confirmation at each Phase 2 group** — do not proceed until the consultant confirms or corrects.
- **Use confidence tiers** — High: present as statements. Medium: present with source quote. Low: ask explicitly.

---

## Key Conventions Reminder

- **UK English throughout.** All content, examples, copy. Use £ not $.
- **Tailwind v4 — no config file.** Theme in `app/src/index.css` via `@theme inline {}`.
- **bun** for all package operations.
- **Multi-tenant SPA.** One build, many clients. Config from `/clients/{slug}.json`.
- **Client slug rules.** Lowercase, hyphens only.

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format:check # Prettier check
```

## Verification After This Session

- [ ] AMD onboarding Phase 2 Groups 2–6 reviewed and confirmed by consultant
- [ ] `app/public/clients/amd.json` written and validated
- [ ] Build passes with AMD config: `cd app && bun run build`
- [ ] AMD config loads correctly in browser (dev server)
- [ ] Borough research command tested with degraded source (website down)
- [ ] Borough research output clearly attributes fallback sources
- [ ] Borough research gaps documented explicitly
- [ ] All changes committed
- [ ] (Nice-to-have) Borough onboarding started or completed
