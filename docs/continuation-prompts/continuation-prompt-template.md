# Continuation Prompt Template

> **Naming convention:**
> - Application-generic: `continuation-prompt-{NN}-{purpose}.md` (e.g., `continuation-prompt-03-phase2-build.md`)
> - Client-specific: `continuation-prompt-{client}-{NN}-{purpose}.md` (e.g., `continuation-prompt-phew-04-deployment.md`)
>
> **Usage:** Copy the content below the horizontal rule into a new Claude Code session to continue the project. Replace all `<!-- ... -->` placeholder comments with actual content. Remove the guidance comments before use.

---

<!-- ============================================================
     SECTION 1: HEADER & IDENTITY
     Always present. Establishes what this prompt is and where
     we are in the project lifecycle.
     ============================================================ -->

# {Phase/Task Name} -- Session Continuation Prompt

## Context

<!-- One paragraph describing the project at a high level.
     This should be stable across all prompts in a project --
     copy it verbatim each time. For multi-output projects,
     list each output as a numbered item. -->

This is a {project description} for {client/company name} ({brief client descriptor}). {Number} outputs:
1. **{Output 1}** -- {one-line description}
2. **{Output 2}** -- {one-line description}

<!-- Point the new session to the most important reference documents.
     Order by importance. Annotate the critical one(s). -->

**Read first:** `{path-to-primary-planning-doc}` -- {what it is and why it matters}.
**CLAUDE.md** is at {location} with critical rules ({list the 3-4 most important rules}).

---

<!-- ============================================================
     SECTION 2: COMPLETED WORK (CUMULATIVE)
     Always present. Use the "recency-weighted summary" pattern:
     older phases get one-line summaries; the most recent phase
     gets full detail. This section grows across prompts.
     ============================================================ -->

## Completed Work

<!-- For early prompts (sessions 1-3), list each phase in detail.
     For later prompts (sessions 4+), compress older phases into
     single lines and expand only the most recent 1-2 phases.

     Pattern:
     ### Phase 0 (Research) -- Complete
     All 7 research outputs in `.planning/research/`.

     ### Phase 1 (Planning) -- Complete
     All specs in `.planning/specs/`. Verified with audits.

     ### Phase 2 (Build) -- Complete, with detail below
     [Expanded bullet points for the most recent phase]
-->

### {Earlier Phase Name} -- Complete
{One-line summary. Reference a file for detail if available.}

### {Most Recent Phase Name} -- Complete
<!-- Expand with detail: what was built, key decisions made,
     files changed, verification status. Include a summary table
     if the phase had multiple work items. -->

{Detailed description of recent work, organised by sub-task or agent.}

### Build Status
<!-- Always include the current build/verification state so the
     next session knows the baseline. -->

- `{build command}` -- {result}
- `{type check command}` -- {result}
- `{lint command}` -- {result}

---

<!-- ============================================================
     SECTION 3: SESSION OBJECTIVES
     Always present. What the next session should accomplish.
     Structure as primary/secondary/tertiary or as ordered work
     packages. This is the most important section for the reader.
     ============================================================ -->

## What This Session Does: {Phase/Task Name}

<!-- Describe the scope of work for the upcoming session.
     Use numbered work packages or tasks for complex sessions.
     Include rationale for ordering where helpful.

     For single-objective sessions, a few paragraphs suffice.
     For multi-workstream sessions, use the work package pattern
     with priority labels (MUST, SHOULD, NICE-TO-HAVE). -->

### {Work Package 1 / Task 1}: {Title} ({Priority: Must-Fix / Should-Fix / Nice-to-Fix})

<!-- For each work package, include:
     - What needs to change
     - Which file(s) to modify (absolute or repo-relative paths)
     - Specific line references if known
     - The expected outcome or acceptance criteria
     - Any constraints or gotchas -->

**File(s):** `{path/to/file.tsx}`
**Issue:** {Description of what is wrong or what needs adding.}
**Fix:** {Concrete instructions for the fix.}

### {Work Package 2 / Task 2}: {Title} ({Priority})

{Same structure as above.}

---

<!-- ============================================================
     SECTION 4: AGENT ALLOCATION (OPTIONAL)
     Include when the session involves parallel work that can be
     dispatched to sub-agents. Omit for single-focus sessions.
     ============================================================ -->

## Agent Allocation

<!-- Define which agents handle which work, ensuring no file
     ownership overlaps to prevent merge conflicts.

     Pattern:
     | Agent | Responsibility | Files Owned |
     |-------|---------------|-------------|
     | Agent A | Bug fixes | file1.tsx, file2.tsx |
     | Agent B | Content additions | file3.tsx, file4.tsx |
-->

| Agent | Responsibility | Files Owned |
|-------|---------------|-------------|
| **Agent A** | {Scope} | {File list -- no overlap with other agents} |
| **Agent B** | {Scope} | {File list -- no overlap with other agents} |

<!-- If there are dependencies between agents, state them:
     "Agent B depends on Agent A completing the CSS token
     definitions before it can migrate components." -->

---

<!-- ============================================================
     SECTION 5: FILE STRUCTURE REFERENCE
     Present in most prompts. Helps the new session navigate
     the codebase without exploratory reads. Update as the
     project evolves.
     ============================================================ -->

## Current File Structure

<!-- Use an ASCII tree showing the most relevant directories
     and files. Group by concern. Annotate files that are new
     or recently changed. Keep this current -- stale trees are
     worse than no tree. -->

### App Source Files
```
{project-root}/
  src/
    components/       # {description}
    content/          # {description}
    hooks/            # {description}
    config/           # {description}
    lib/              # {description}
    routes/           # {description}
```

### Static Assets
```
{project-root}/public/
  {directory}/        # {description}
```

<!-- ============================================================
     SECTION 6: KEY CONVENTIONS
     Present in most prompts. A compact reminder of rules that
     apply to ALL work in the project. These should also live
     in CLAUDE.md, but repeating the critical ones here ensures
     they survive context limits.

     Keep this short -- 8-12 bullet points maximum. If you find
     yourself listing more, put the extras in CLAUDE.md and
     reference it.
     ============================================================ -->

## Key Conventions Reminder

- **{Convention 1}** {brief explanation}
- **{Convention 2}** {brief explanation}
- **{Convention 3}** {brief explanation}
- **{Convention 4}** {brief explanation}
- **{Convention 5}** {brief explanation}
- **{Convention 6}** {brief explanation}

<!-- ============================================================
     SECTION 7: BUILD & DEV COMMANDS
     Present in most prompts. The essential commands for working
     with the project. Keep to 4-6 commands maximum.
     ============================================================ -->

## Build & Dev Commands

```bash
{command 1}          # {description}
{command 2}          # {description}
{command 3}          # {description}
{command 4}          # {description}
```

<!-- ============================================================
     SECTION 8: DEPLOYMENT INFO (OPTIONAL)
     Include when the project is deployed or when deployment
     is part of the session's work.
     ============================================================ -->

## Deployment

- **Production:** {URL}
- **Repository:** {URL}
- {Auto-deploy mechanism, e.g. "Auto-deploys on push to `main`"}

<!-- ============================================================
     SECTION 9: VERIFICATION CHECKLIST (OPTIONAL)
     Include when the session should verify specific outcomes
     before completing. Particularly valuable for polish/QA
     sessions and pre-deployment work.
     ============================================================ -->

## Verification After This Session

<!-- Use checkboxes so the reader can track completion. -->

- [ ] {Verification item 1}
- [ ] {Verification item 2}
- [ ] {Verification item 3}
- [ ] {Verification item 4}

<!-- ============================================================
     SECTION 10: OPEN ITEMS / KNOWN ISSUES (OPTIONAL)
     Include when there are unresolved questions, deferred
     decisions, or known problems the session should be aware of.
     ============================================================ -->

## Open Items

<!-- List anything the next session needs to know that does not
     fit cleanly into the work packages above. -->

1. **{Item}** -- {Description and current status.}
2. **{Item}** -- {Description and current status.}

<!-- ============================================================
     SECTION 11: DOCUMENTS TO READ (OPTIONAL)
     Include when the session needs to consult specific planning
     documents, specs, or research before starting work. More
     granular than the "Read first" directive in the Context
     section -- this is for sessions with multiple reference
     inputs.
     ============================================================ -->

## Documents to Read Before Starting

| Document | Purpose |
|----------|---------|
| `{path}` | {Why the session needs this} |
| `{path}` | {Why the session needs this} |

<!-- ============================================================
     END OF TEMPLATE
     ============================================================ -->

---

