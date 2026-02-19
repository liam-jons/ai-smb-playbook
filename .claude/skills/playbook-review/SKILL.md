---
name: playbook-review
description: This skill should be used when the user asks to "review the playbook", "check the playbook for [client]", "pre-send review", "is the playbook ready for [client]", "QA the playbook", "audit the AMD/Phew playbook", "go/no-go review", "playbook readiness check", or wants to validate that a client-specific deployment is correct before sending to the client. Spawns parallel browser-based and code-based review agents to check every page, then produces a GO/NO-GO report.
---

# Playbook Review Skill

Comprehensive pre-send review of a client-specific AI SMB Playbook deployment. Spawns parallel subagents to review every page of the playbook from both a browser (visual/functional) and code (config/parameterisation) perspective. Produces a GO/NO-GO report with blocking and advisory issues.

## Required Input

**Client slug** — the slug matching the config file at `app/public/clients/{slug}.json` (e.g. `amd`, `phew`).

Ask for this if not provided. Confirm the config file exists before proceeding.

## Workflow

### Phase 1: Preparation (orchestrator does this directly)

1. **Read the client config** at `app/public/clients/{slug}.json`
2. **Read the section registry** at `app/src/content/shared/sections.ts`
3. **Determine active sections** for this client:
   - Filter by track: if `hasDeveloperTrack` is false, exclude `track: 'developer'` sections
   - Apply `sections.enabled` whitelist if set (non-null)
   - Apply `sections.disabled` blacklist if set
   - The result is the list of section slugs to review
4. **Read the review checklist** at `references/review-checklist.md`
5. **Read known issues** at `references/known-issues.md` (if it exists — skip on first run)
6. **Ensure the dev server is running** at `http://localhost:4100`
   - Run `cd app && bun run dev` in background if not already running
   - Wait for the server to be ready before spawning browser agents

### Phase 2: Spawn Parallel Review Agents

Group sections into batches of 3-4 and spawn agents. For a typical general-track client with ~10 sections, this means 6-8 agents total:

#### Browser Review Agents (use the agent-browser skill)

Each browser agent navigates to actual pages and checks what the user would see. Use the `agent-browser` subagent type for these agents. Every browser agent prompt MUST include the instruction to use the agent-browser skill for all browser interactions.

**Browser Agent: Navigation & Chrome**
- URL: `http://localhost:4100/?client={slug}`
- Review: homepage renders correctly, client logo visible, company name in header, sidebar shows only enabled sections, developer track link hidden if disabled, mobile menu works, 404 page shows correct buttons
- Check: no console errors, no flash of default config (FOUC), page loads within 3 seconds

**Browser Agent: Section Batch 1** (first 3-4 sections)
- Navigate to each section page: `http://localhost:4100/general/{section-slug}?client={slug}`
- For each section: page loads, heading renders, content is visible, no layout breaks, copy buttons work on code blocks/prompts, client name appears where expected
- Check: company name `{companyShortName}` appears in personalised sections, no "Your Organisation" or "Acme" defaults visible

**Browser Agent: Section Batch 2** (next 3-4 sections)
- Same checks as Batch 1

**Browser Agent: Section Batch 3** (remaining sections, if any)
- Same checks as Batch 1
- Additionally for Starter Kit section: correct number of items visible, download buttons work

**Browser Agent: Developer Track** (only if `hasDeveloperTrack: true`)
- Navigate to `http://localhost:4100/developer?client={slug}`
- Check each developer section renders, developer-specific config values appear (testingTool, techStack, etc.)

#### Code Review Agents

These agents read source files and config to verify correctness without a browser.

**Code Agent: Config Completeness**
- Read the client config JSON
- Read the schema at `app/src/config/client-config-schema.ts`
- Check: all required fields present and non-empty, no placeholder text (e.g. `[your company]`, `your certification`), overlay sections populated (brandVoice has all 7 framework keys, recurringTasks has 4 examples, ROI has at least 2 client examples)
- Check: `exampleRecurringTasks` has 4 items, none are obviously generic
- Check: `starterKit.enabledCustomCategories` matches the items available in `starter-kit-data.ts`
- Check: section slugs in `sections.disabled` actually exist in the registry

**Code Agent: Parameterisation Audit**
- For each section component file in `app/src/content/{general,developer,shared}/`:
  - Does it import `useSiteConfig()` or `useOverlays()`?
  - If it does: does it use `siteConfig.companyShortName` or other client-specific values?
  - If it does NOT: is this a section that SHOULD be personalised? Flag as advisory.
  - Check for hardcoded strings that should be config-driven (e.g. "Your team has Claude Teams licences")
- Compare against the client config to verify all referenced config fields have real values

**Code Agent: Starter Kit Validation**
- Read `app/src/content/shared/starter-kit-data.ts`
- For this client's `enabledCustomCategories`, count visible items per track
- Verify each starter kit file path exists on disk
- Check that skill ZIP files exist in `app/public/starter-kit/zips/`
- Report total items available to this client vs total items in the system

### Phase 3: Report Synthesis (orchestrator)

Collect results from all agents. Categorise findings:

**BLOCKING** — Must fix before sending:
- Missing or placeholder config values
- Sections that render with default/wrong company name
- Developer track visible when it should be hidden (or vice versa)
- Broken links or navigation
- Console errors on any page
- Missing overlay content (empty brand voice, no ROI examples)

**ADVISORY** — Should fix, not a blocker:
- Generic sections that could benefit from parameterisation
- Inconsistent tone or language (non-UK English)
- Starter kit items that could be more relevant
- Visual issues that don't affect functionality

**INFORMATIONAL** — Noted for future improvement:
- Sections using hardcoded content that's factually correct but not personalised
- Performance observations
- Accessibility notes

### Report Format

Write the report to `.planning/client-specific/{client-dir}/review-report-{date}.md` where `{client-dir}` is found by globbing `.planning/client-specific/*-{slug}/` (e.g. `01-amd`). If no matching directory exists, create one using the next available numeric prefix.

```markdown
# Playbook Review Report: {companyName}

**Date:** {YYYY-MM-DD}
**Client slug:** {slug}
**Reviewer:** Automated (playbook-review skill v1)
**Sections reviewed:** {count} of {total}
**Developer track:** {enabled/disabled}

## Verdict: {GO / NO-GO}

{One-paragraph summary}

## Blocking Issues ({count})

### Issue 1: {title}
- **Page:** {URL or file path}
- **Expected:** {what should happen}
- **Actual:** {what happens}
- **Fix:** {recommended fix}

## Advisory Issues ({count})

### Issue 1: {title}
...

## Informational Notes ({count})

### Note 1: {title}
...

## Section-by-Section Results

| Section | Browser | Code | Status | Notes |
|---------|---------|------|--------|-------|
| Welcome & Orientation | PASS | PASS | GO | Client name renders correctly |
| How Context Works | PASS | N/A | GO | Generic section — no parameterisation expected |
...

## Review Metadata

- Total agents spawned: {N}
- Browser agents: {N}
- Code agents: {N}
- Known issues skipped: {N} (from known-issues.md)
```

### Phase 4: Feedback Loop

After presenting the report:

1. Ask the consultant whether to update `references/known-issues.md` with any new findings
2. If the verdict is NO-GO, offer to fix blocking issues in the current session
3. If the verdict is GO, confirm the consultant is ready to deploy

## Key Conventions

- **UK English throughout** — check all content for US spellings
- **Dev server URL format:** `http://localhost:4100/{track}/{section-slug}?client={slug}`
- **Homepage URL:** `http://localhost:4100/?client={slug}`
- **404 test URL:** `http://localhost:4100/nonexistent-page?client={slug}`
- **Agent-browser skill:** All browser agents MUST use the `agent-browser` skill for interactions. Specify this explicitly in each browser agent's prompt: "Use the agent-browser skill for all browser interactions."
- **Parallel execution:** All agents in Phase 2 should be spawned simultaneously using the Task tool with multiple parallel calls
- **Client config path:** `app/public/clients/{slug}.json`
- **Section registry:** `app/src/content/shared/sections.ts` — use `getFilteredSectionsForTrack()` logic to determine visible sections
