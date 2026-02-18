# Client Onboarding Skill — Design Document

## Overview

The client onboarding skill automates the process of creating a new client deployment of the AI SMB Playbook. Today, a consultant manually copies `app/public/clients/_template.json`, replaces placeholder values, writes overlay content, configures sections and starter kit categories, commits, and adds a Vercel subdomain — a process documented across `CUSTOMISATION.md` and `docs/repeatable-workflow.md` (Steps 6–9). The skill would reduce this from 30–90 minutes of manual JSON editing to a guided conversation lasting 5–15 minutes, producing a validated, commit-ready JSON file with AI-generated overlay content that the consultant reviews and refines before deployment.

---

## Consultant Input Requirements

Every field in the `ClientConfig` interface (`app/src/config/client-config-schema.ts`) needs a value. The table below maps each field to its source, whether it is required, whether it can be inferred from a training transcript, and what sensible default exists.

### siteConfig fields

| Field | Required | Can Be Inferred from Transcript | Default / Derivable | Source Notes |
|-------|----------|--------------------------------|---------------------|--------------|
| `appTitle` | Yes | No — but derivable from `companyShortName` | `"{companyShortName} AI Playbook"` | Derive automatically once `companyShortName` is known. |
| `companyName` | Yes | Yes — almost always stated in introductions | None | Ask explicitly if not found in transcript. |
| `companyShortName` | Yes | Yes — the informal name used throughout | None | Often the first word of `companyName` minus "Limited"/"Ltd". Ask consultant to confirm. |
| `companyUrl` | Yes | Sometimes — mentioned when discussing web properties | None | Ask explicitly. Can cross-reference with a web search. |
| `companyUrlDisplay` | Yes | No — but derivable from `companyUrl` | Strip protocol and trailing slash from `companyUrl` | Derive automatically. |
| `feedbackEmail` | Yes | No | `"liam@aisolutionhub.co.uk"` | This is the consultant's email, not the client's. Default to consultant's known address. |
| `feedbackSenderEmail` | Yes | No | `"playbook@feedback.aisolutionhub.co.uk"` | Fixed — tied to Resend verified domain. Almost never changes. |
| `consultantName` | Yes | Yes — the trainer introduces themselves | `"Liam"` | Known per consultant. Default to the logged-in consultant. |
| `trainingDate` | Yes | Yes — timestamp on the transcript | None | Extract from transcript metadata or ask. Format: `"DD Month YYYY"`. |
| `localStoragePrefix` | Yes | No — but derivable from slug | `"{slug}-playbook"` | Derive automatically from the client slug. |
| `emailSubjectPrefix` | Yes | No — but derivable from `companyShortName` | `"{companyShortName} AI Playbook"` | Derive automatically. |
| `metaDescription` | Yes | No | `"Practical guidance for getting the most from Claude AI"` | Generic default works for all clients. Override only if needed. |
| `welcomeSubtitle` | Yes | No — but derivable from `companyShortName` | `"Getting started with AI at {companyShortName}"` | Derive automatically. |
| `industry` | Recommended | Yes — usually discussed when scoping the engagement | None | Extract from transcript or ask. |
| `industryContext` | Recommended | Partially — can be inferred from industry | None | A short descriptor like "design agency" or "law firm". The skill can suggest this from `industry`, but consultant should confirm. |
| `teamSize` | Recommended | Yes — often mentioned when discussing adoption | `"small"` | Extract from transcript. Values: `"small"`, `"medium"`, `"large"`. |
| `primaryAiTool` | Recommended | No | `"Claude"` | Almost always "Claude" for this playbook. Default without asking. |
| `hasDeveloperTrack` | Yes | Yes — the presence of a developer-focused session is a strong signal | `true` | Infer from whether there was a dev-focused training session. Ask to confirm. |
| `testingTool` | Dev only | Yes — discussed in developer sessions | None | Only needed if `hasDeveloperTrack: true`. Extract from transcript. |
| `testingToolDocs` | Dev only | No — but derivable from `testingTool` | `"the {testingTool} docs"` | Derive automatically. |
| `techStack` | Dev only | Yes — typically the first topic in a developer session | None | Extract from transcript. |
| `database` | Dev only | Sometimes — mentioned alongside tech stack | None | Extract if present; omit if not. |
| `webApplications` | Dev only | Yes — key products/apps are discussed | None | Extract from transcript. |
| `domainSpecificForm` | Dev only | Sometimes — mentioned in testing or workflow context | None | Ask if relevant; omit otherwise. |
| `complianceArea` | Domain | Yes — often a significant discussion point | None | Extract from transcript. |
| `primaryProduct` | Domain | Sometimes — mentioned when discussing workflows | None | Extract if present. |
| `primaryProductDescription` | Domain | No — but derivable from `primaryProduct` | Full name of the product acronym | Derive if `primaryProduct` is set. |
| `certificationName` | Domain | Sometimes — mentioned in governance discussions | None | Extract if present. |
| `complianceStakeholders` | Domain | Sometimes — mentioned in governance context | None | Extract if present. |
| `sensitiveDataDescription` | Domain | Yes — data handling is frequently discussed | None | Extract from transcript. |
| `sensitiveDataLabel` | Domain | No — but derivable from `sensitiveDataDescription` | Short form of `sensitiveDataDescription` | Derive automatically. |
| `exampleRecurringTasks` | Yes (array) | Yes — concrete tasks are often mentioned | Empty array | Extract from transcript. Aim for 4 items. |
| `reportDataSource` | Domain | Sometimes — mentioned in reporting context | None | Extract if present. |
| `clientOnboardingType` | Domain | Sometimes — mentioned in onboarding workflows | None | Extract if present. |

### Summary: fields the consultant must explicitly provide

At minimum, the consultant needs to provide or confirm these values (everything else can be derived, defaulted, or inferred):

1. **Company name** (full and short form)
2. **Company URL**
3. **Training date** (if not in transcript metadata)
4. **Industry / industry context**
5. **Whether the developer track is needed**
6. **Tech stack details** (if developer track is enabled)
7. **Compliance/domain context** (if applicable to the client)

That is 5–7 explicit inputs for a typical client.

---

## Training Transcript Extraction

### What is a "training transcript"?

The consultant delivers training via video call (Google Meet, Zoom, Teams) and records it using a tool like Granola or Otter.ai. The output is a timestamped transcript with an AI-generated summary, structured notes, and action items. This is the primary input the skill would process.

### High-confidence extraction (present in most transcripts)

| Information | How It Appears | Extraction Approach |
|-------------|---------------|---------------------|
| Company name | Introduction, "Welcome to the AI session for {company}" | Pattern match on introductions |
| Training date | Transcript timestamp / metadata | Parse the transcript date |
| Team size indicators | "Your team of eight", "across your 50 staff" | Number extraction + mapping to small/medium/large |
| Industry | "You're in healthcare", "safeguarding sector" | Entity recognition on sector terms |
| Tech stack | "You use React and TypeScript", "your .NET stack" | Pattern match on technology names |
| Testing tools | "Currently using Cypress", "Ghost Inspector" | Pattern match on tool names |
| Compliance areas | "GDPR requirements", "safeguarding obligations" | Pattern match on regulatory/compliance terms |
| Recurring tasks | "You mentioned monthly reports", "weekly client reviews" | Extract from discussion of workflows |
| Web applications | "Your portal", "the admin dashboard", "the LMS" | Product/application name extraction |
| Developer track signal | Separate developer-focused session exists | Presence of technical content (code, testing, CLAUDE.md) |

### Medium-confidence extraction (sometimes present)

| Information | Challenge |
|-------------|-----------|
| Company URL | Rarely stated verbally; more likely in pre-training emails |
| Database | Mentioned only in technical depth discussions |
| Sensitive data types | Discussed obliquely ("we need to be careful with client data") |
| Certification names | Mentioned in passing ("we have our ISO certification") |
| Domain-specific forms | Very context-dependent |

### Low-confidence / not extractable

| Information | Why |
|-------------|-----|
| `feedbackEmail` | Consultant's operational detail, not discussed in training |
| `feedbackSenderEmail` | Infrastructure detail |
| `localStoragePrefix` | Technical implementation detail |
| `companyUrlDisplay` | Derivative — but the source (`companyUrl`) may not be in the transcript |

### Recommended extraction approach

The skill should not attempt real-time NLP parsing. Instead, it should:

1. Accept the full transcript (or AI-generated summary) as input.
2. Use Claude's own comprehension to extract structured data in a single pass, outputting a draft JSON blob.
3. Present the extracted values to the consultant for confirmation and correction.
4. Flag low-confidence extractions explicitly: "I found a mention of 'Cypress' as a testing tool — is that correct?"

This is fundamentally a "draft and refine" pattern, not a "parse and commit" pattern. The consultant is always in the loop.

---

## Overlay Content Strategy

Overlays are the highest-value part of the config — they make the playbook feel bespoke rather than generic. They are also the hardest to automate because they require domain understanding and brand sensitivity.

### Brand Voice (`overlays.brandVoice.frameworkExamples`)

Seven framework steps, each requiring a paragraph of text.

| Step | Key | Can Be Auto-generated? | Quality Expectation | Recommended Approach |
|------|-----|----------------------|---------------------|---------------------|
| Brand personality | `"1"` | Yes — with website scrape input | High if given the company website | Scrape the client's website (using Firecrawl or similar). Analyse tone, vocabulary, and self-description. Generate a first draft. |
| Voice attributes | `"2"` | Partially — needs consultant input on "we are not" aspect | Medium — the "we are not" dimension is hard to infer | Generate "we are" from website copy; ask consultant for "we are not" and "sounds like". |
| Audience awareness | `"3"` | Yes — from transcript and website | High — training transcript reveals who the audience is | Extract from transcript discussion of users/clients/stakeholders. |
| Core messaging pillars | `"4"` | Yes — from website scrape | Medium — may miss internal priorities | Draft from website "about" and "values" pages. Consultant should verify. |
| Tone spectrum | `"5"` | Partially — can suggest common variations | Medium — needs knowledge of client's channels | Provide a template with common channel types; ask consultant to adapt. |
| Style rules | `"6"` | Yes — mostly fixed for UK clients | High — UK English rules are consistent | Default to standard UK English rules. Only ask about specific style choices (Oxford comma, heading case). |
| Terminology | `"7"` | Partially — from transcript and website | Medium — internal jargon is hard to capture | Extract preferred terms from transcript. Ask consultant to add avoided terms. |

**`headStartContent`** — Generate from the website scrape analysis. This is lower stakes (a demonstration, not a reference document) and benefits from AI generation.

**Recommendation:** The skill should generate a complete first draft of all seven steps using the website scrape + transcript, then present each step to the consultant for editing. This is where the skill provides its greatest time saving — writing seven paragraphs of brand voice from scratch takes 20–30 minutes; reviewing and tweaking AI-generated drafts takes 5–10 minutes.

### Recurring Tasks (`overlays.recurringTasks.examples`)

Array of `{ title, description }` objects. Typically 3–4 examples.

| Source | Extractable? | Quality |
|--------|-------------|---------|
| Training transcript | Yes — recurring tasks are frequently discussed | High — tasks mentioned in training are by definition relevant |
| Client's operational context | Partially — can infer common tasks from industry | Medium — generic industry tasks may not match actual workflows |

**Recommendation:** Extract candidate tasks from the transcript, then generate descriptions that follow the established pattern (see `phew.json` examples — each description explains what the task does, what data it uses, and how Claude helps). Present the full set to the consultant for review. If fewer than 3 tasks are found in the transcript, suggest industry-appropriate alternatives.

### ROI Examples (`overlays.roi.clientExamples`)

Record of `{ title, description }` keyed by task ID. The task IDs must match the ROI section's expected keys (currently: `"proposal-writing"`, `"compliance-docs"`, `"regression-testing"` in the Phew config, though these are flexible).

| Aspect | Extractable? | Quality |
|--------|-------------|---------|
| Which tasks to include | Partially — training discussions reveal pain points | Medium — the mapping to task IDs requires domain judgement |
| Title text | Yes — can be derived from company name + task type | High |
| Description text | Partially — needs quantitative estimates | Medium — time/cost savings are speculative without data |

**Recommendation:** The skill should identify 2–3 tasks from the transcript that would benefit from ROI measurement, generate example titles and descriptions, and explicitly flag that the quantitative estimates are illustrative. The consultant should validate the numbers or replace them with real client data if available.

### Overall overlay strategy

The skill should adopt a **"generate all, review all"** approach:

1. Generate complete overlay content using transcript + website scrape.
2. Present overlays as a formatted block for the consultant to review.
3. Allow the consultant to accept, edit, or regenerate individual overlay items.
4. Never commit overlay content without explicit consultant approval.

---

## Recommended Interaction Pattern

**A two-phase guided conversation, not a single-prompt generation.**

### Why not single-prompt?

A single prompt ("Give me the transcript, I'll generate everything") would:
- Produce a JSON file the consultant cannot meaningfully review within the tool.
- Miss the opportunity for iterative refinement — overlays especially benefit from back-and-forth.
- Feel opaque — the consultant would not understand why particular choices were made.

### Why not a full wizard?

A step-by-step wizard ("Step 1: Enter company name. Step 2: Enter URL...") would:
- Be tedious for the 10+ fields that can be auto-derived.
- Not leverage the transcript input effectively — much of the point is automated extraction.
- Feel like filling in a form, which is exactly what the skill should eliminate.

### Recommended: two-phase approach

**Phase 1: Extraction and draft (mostly automated)**

The consultant provides:
1. Training transcript or summary (required)
2. Client website URL (required — for brand voice scraping)
3. Any explicit overrides (e.g., "the slug should be `acme`", "no developer track")

The skill then:
1. Scrapes the client website (if Firecrawl or a URL-fetching tool is available).
2. Analyses the transcript to extract all inferrable fields.
3. Derives all derivable fields (`appTitle`, `localStoragePrefix`, `companyUrlDisplay`, etc.).
4. Applies sensible defaults for everything else.
5. Generates overlay content (brand voice, recurring tasks, ROI examples).
6. Generates section configuration (which sections to enable/disable based on training content).
7. Generates starter kit category selection based on client profile.
8. Outputs the complete draft config as formatted JSON with inline comments explaining each choice.

**Phase 2: Review and refinement (consultant-guided)**

The skill presents the draft in logical groups:

1. **Company details** — "I've set the company name to 'Acme Industries Limited' and the short name to 'Acme'. The slug will be `acme`. Correct?" This is a quick confirmation pass.
2. **Industry and domain** — "I identified safeguarding as the compliance area and DBS checks as the relevant certification. Does that look right?" Allow corrections.
3. **Developer track** — "Based on the developer session, I've enabled the developer track with ASP.NET/C# as the tech stack and Ghost Inspector for testing. Confirm or adjust." Skip entirely if no developer track.
4. **Brand voice overlays** — Present all seven framework steps. This is the longest review step. Allow the consultant to edit individual steps, regenerate specific steps, or approve the whole block.
5. **Recurring tasks** — Present the 3–4 generated examples. Allow add/remove/edit.
6. **ROI examples** — Present the generated examples with a note that quantitative estimates are illustrative.
7. **Sections and starter kit** — "I recommend showing all sections and enabling the `developer-tools` and `creative-design` starter kit categories. Adjust?"

After each group, the consultant can approve or request changes. Once all groups are approved, the skill writes the final JSON file.

### Interaction flow diagram

```
Consultant provides: transcript + website URL + optional overrides
    │
    ▼
Skill extracts fields, generates overlays, produces draft JSON
    │
    ▼
Phase 2: Grouped review
    ├── Company details ──────► Confirm/edit
    ├── Industry & domain ────► Confirm/edit
    ├── Developer track ──────► Confirm/edit (or skip)
    ├── Brand voice overlays ─► Review/edit each step
    ├── Recurring tasks ──────► Review/edit/add/remove
    ├── ROI examples ─────────► Review/edit
    └── Sections & starter kit► Confirm/edit
    │
    ▼
Skill writes final JSON to app/public/clients/{slug}.json
    │
    ▼
Validation pipeline runs
    │
    ▼
Consultant prompted to commit, push, and add subdomain
```

---

## Validation Pipeline

The skill should perform validation at two points: after generating the draft (catch structural issues early) and after writing the final file (catch everything).

### 1. Schema conformance

Validate the generated JSON against the `ClientConfig` interface. Specific checks:

| Check | How |
|-------|-----|
| All required `siteConfig` fields present | Check each field listed as non-optional in the interface |
| No `[placeholder]` values remaining | Regex scan for `\[.*?\]` patterns from the template |
| `hasDeveloperTrack` consistency | If `false`, developer-only fields should be absent; if `true`, `techStack` should be populated |
| `exampleRecurringTasks` is a non-empty array | Check length >= 1 (ideally 4) |
| `overlays.brandVoice.frameworkExamples` has keys `"1"` through `"7"` | Check all seven keys present |
| `overlays.recurringTasks.examples` is a non-empty array | Each entry has `title` and `description` |
| `overlays.roi.clientExamples` values have `title` and `description` | Type check on each entry |
| `sections.enabled` is `null` or a valid array of section slugs | Cross-reference against known slugs from `app/src/content/shared/sections.ts` |
| `sections.disabled` contains only valid section slugs | Same cross-reference |
| `starterKit.enabledCustomCategories` contains only valid category names | Cross-reference against `developer-tools`, `business-development`, `creative-design`, `integration-specific`, `compliance-security` |

### 2. Content quality checks

| Check | How |
|-------|-----|
| `companyUrl` is a valid URL | URL parsing; optionally verify it resolves |
| `trainingDate` follows `"DD Month YYYY"` format | Regex match |
| `localStoragePrefix` is lowercase with hyphens only | Regex: `/^[a-z0-9-]+$/` |
| `feedbackSenderEmail` uses the verified Resend domain | Check it ends with `@feedback.aisolutionhub.co.uk` |
| No empty strings in required fields | Check each value has `.trim().length > 0` |
| Overlay descriptions are substantive (not one-word) | Check `description.split(' ').length >= 5` for overlay entries |
| Brand voice examples are not just the template placeholders | Compare against `_template.json` values |

### 3. Build verification

After writing the JSON file, run:

```bash
cd app && bun run build
```

This executes the TypeScript compiler and Vite build. If the build passes, the config is structurally sound within the application. If it fails, the skill should report the error and attempt to fix it.

### 4. Local preview prompt

After validation passes, suggest the consultant test locally:

```bash
cd app && bun run dev
# Then visit: http://localhost:4100?client={slug}
```

The skill should not automatically start the dev server (that requires the consultant to interact with a browser), but it should output the exact command and URL.

### 5. Deployment checklist output

After all validation passes, output a checklist the consultant can follow:

```
[ ] JSON file committed: app/public/clients/{slug}.json
[ ] Pushed to main branch
[ ] Subdomain added in Vercel: {slug}.playbook.aisolutionhub.co.uk
[ ] SSL verified (automatic with Vercel wildcard)
[ ] Live site tested: company name, developer track, feedback email, starter kit categories
```

---

## Proposed Skill Structure

### File layout

```
.claude/skills/client-onboarding/
  SKILL.md          # Skill definition — triggers, description, full instructions
```

This is a single-file skill. The logic is entirely in the SKILL.md instructions — Claude Code executes the steps using its built-in capabilities (file reading, writing, web fetching, bash commands). No supporting code files are needed.

### SKILL.md outline

```markdown
---
name: client-onboarding
description: Create a new client deployment of the AI SMB Playbook. Guides the consultant through extracting client details from a training transcript, generating overlay content, and producing a validated JSON config file ready for deployment.
---

# Client Onboarding Skill

## Trigger
Invoked when the consultant wants to onboard a new client. Typical trigger phrases:
- "Onboard a new client"
- "Create a client config for {company}"
- "Set up a new playbook deployment"

## Required inputs
1. **Training transcript or summary** — pasted or as a file path
2. **Client website URL** — for brand voice analysis
3. **Client slug** — lowercase, hyphens only (e.g., "acme-industries")

## Optional inputs
- Explicit overrides for any field
- "No developer track" to skip developer-specific fields
- Additional context documents (client feedback, pre-training notes)

## Steps
[Phase 1 and Phase 2 as described in the Recommended Interaction Pattern section]

## Validation
[As described in the Validation Pipeline section]

## Output
- `app/public/clients/{slug}.json` — the client config file
- Deployment checklist printed to the console
```

### Major steps in detail

**Step 1 — Gather inputs**
- Ask for transcript (paste or file path)
- Ask for client website URL
- Ask for desired slug
- Ask if there are any known overrides

**Step 2 — Analyse transcript**
- Read the transcript
- Extract: company name, industry, team size, tech stack, testing tools, compliance areas, recurring tasks, web applications, sensitive data types
- Produce a structured extraction summary

**Step 3 — Scrape client website** (if URL-fetching capability available)
- Fetch the homepage and key pages (about, services, contact)
- Extract: brand personality, values, tone, terminology, audience description
- Produce a brand analysis summary

**Step 4 — Generate draft config**
- Read `app/public/clients/_template.json` as the base
- Populate all fields using extracted data, derivations, and defaults
- Generate all overlay content
- Determine section configuration and starter kit categories
- Write the draft to memory (not yet to disk)

**Step 5 — Grouped review** (interactive)
- Present each group to the consultant
- Accept edits inline
- Regenerate specific items on request

**Step 6 — Write and validate**
- Write the final JSON to `app/public/clients/{slug}.json`
- Run schema validation
- Run `cd app && bun run build`
- Report results

**Step 7 — Deployment guidance**
- Output the deployment checklist
- Provide the local testing command
- Optionally offer to commit and push (with consultant confirmation)

### Example interaction flow

```
Consultant: Onboard a new client — Acme Industries. Here's the transcript from today's training.
[pastes transcript]

Skill: I've analysed the transcript. Let me also check the client's website.
What is the Acme Industries website URL?

Consultant: https://www.acme-industries.co.uk

Skill: Thanks. I'll use "acme-industries" as the slug. Analysing the website now...

[analysis complete]

Here's what I've extracted:

**Company details**
- Full name: Acme Industries Limited
- Short name: Acme
- Website: https://www.acme-industries.co.uk
- Industry: Manufacturing and distribution
- Team size: medium (based on "our team of 35" in the transcript)

Does this look correct? Any changes?

Consultant: Short name should be "Acme Industries" not just "Acme".

Skill: Updated. Moving on to the developer track...

[continues through all groups]

Skill: All sections reviewed. Writing the config file...

✓ Written: app/public/clients/acme-industries.json
✓ Schema validation passed
✓ Build check passed

Next steps:
1. Review the file: app/public/clients/acme-industries.json
2. Test locally: cd app && bun run dev, then visit http://localhost:4100?client=acme-industries
3. When ready, commit and push to deploy
4. Add subdomain in Vercel: acme-industries.playbook.aisolutionhub.co.uk
```

---

## Open Questions

1. **Website scraping capability.** The skill's quality depends heavily on being able to scrape the client's website for brand voice analysis. If the consultant's Claude Code environment has Firecrawl MCP, WebFetch, or a similar tool available, this works well. If not, the brand voice overlays will need more manual input. The skill should detect available tools and adapt its approach accordingly.

2. **Transcript format variability.** Granola, Otter.ai, Zoom, and Teams all produce different transcript formats. The skill should treat the transcript as unstructured text and rely on Claude's comprehension rather than parsing specific formats. However, testing with multiple real transcript formats would be valuable before finalising the skill.

3. **Overlay key stability.** The ROI overlay uses task IDs as keys (e.g., `"proposal-writing"`). These keys are currently not validated against a fixed schema — they are freeform strings that the ROI section component uses for display. The skill needs guidance on which keys are standard vs. which are client-specific. This should be documented or enforced in the schema.

4. **Multi-consultant support.** The current design assumes a single consultant (`consultantName`, `feedbackEmail`). If the practice grows to multiple consultants, the skill should maintain a consultant profile lookup rather than defaulting to hardcoded values.

5. **Incremental updates vs. initial creation.** This design covers initial client creation only. A companion skill (or mode within this skill) for updating an existing client config — adding new overlay content, adjusting sections after a follow-up session — would be valuable but is a separate concern.

6. **Brand voice generation quality.** The seven-step brand voice framework is the most complex overlay to generate. Quality depends on the website scrape depth and the transcript content. A dedicated prompt for each step (rather than generating all seven in one pass) would likely produce better results but would make the skill slower. This trade-off should be tested with real client data.

7. **Commit and push automation.** The skill could offer to `git add`, `git commit`, and `git push` the new config file. This saves the consultant a step but introduces risk (pushing to `main` triggers a deployment). The skill should ask for explicit confirmation before any git operations and should never force-push.

8. **Vercel subdomain automation.** Adding the subdomain currently requires manual action in the Vercel dashboard. The Vercel CLI (`vercel domains add`) or API could automate this, but it requires the consultant to have the Vercel CLI authenticated. This is a future enhancement — for now, the deployment checklist is sufficient.
