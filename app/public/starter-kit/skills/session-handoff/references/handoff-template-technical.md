<!--
  Handoff Template — Technical (Claude Code)
  What: Full structured template for creating session handoffs in Claude Code.
        This is a reference file for the session-handoff skill.
  Usage: The session-handoff skill populates this template based on the
         information gathered during the handoff process. You do not need
         to fill it in manually.
  Prerequisites: session-handoff skill loaded.
-->

# Session [N] Continuation Prompt

**Project:** [Project name] — [one-line description] **Previous Session:**
Session [N-1] ([short description of what it covered]) **Date Created:**
[DD/MM/YYYY] **Repository:** [absolute path to repo root]

---

## Context Files to Read First

Read these files in order before beginning any work:

1. `[path/to/file]` — [what it is and why it matters] **Critical**
2. `[path/to/file]` — [what it is]
3. `[path/to/file]` — [what it is]

---

## Cumulative Progress Summary

<!-- Use recency-weighted summaries: compress older sessions, expand recent ones -->

### Sessions 01-[N-3]: [Phase/milestone name] (Complete)

[One-line summary. See `[path/to/summary-file]` for details.]

### Session [N-2]: [Description] (Complete)

- [Key accomplishment]
- [Key accomplishment]

### Session [N-1]: [Description] (Complete/In Progress)

- [Detailed accomplishment with specifics]
- [Detailed accomplishment with specifics]
- [What was started but not finished]
- [Any decisions made and their rationale]

---

## Session [N] Objectives

### Primary Objective

[What must be accomplished in this session]

### Secondary Objective (if time permits)

[What would be valuable but is not critical]

### Tertiary Objective (future sessions)

[What can wait for later]

---

## Remaining Work Tracker

| Item        | Category | Status          | Notes                  |
| ----------- | -------- | --------------- | ---------------------- |
| [Work item] | [Type]   | **Complete**    | [Session completed in] |
| [Work item] | [Type]   | **In Progress** | [What remains]         |
| [Work item] | [Type]   | Not Started     | [Dependencies]         |
| [Work item] | [Type]   | **Blocked**     | [What is blocking it]  |

---

## Important Context / Principles

<!-- If these are documented in CLAUDE.md or another file, reference it instead of repeating -->

See `CLAUDE.md` for project-level conventions and constraints.

Additional session-specific context:

1. [Key principle or constraint]
2. [Key principle or constraint]
3. [Key decision that must be preserved]

---

## Recommended Approach

1. **Start with [X]** — [rationale]
2. **Then [Y]** — [rationale]
3. **If time permits, [Z]** — [rationale]

<!-- For multi-agent work, note which tasks can be parallelised -->

**Parallelisation:** Tasks [A] and [B] can be run as parallel subagents. Task
[C] depends on both completing first.

---

## Data Locations

```
project-root/
  src/
    [key-directory]/     # [what it contains]
    [key-directory]/     # [what it contains]
  docs/
    [key-file]           # [what it is]
  .planning/
    [key-file]           # [what it is]
```

---

## Technology Stack

| Layer     | Technology         | Notes                 |
| --------- | ------------------ | --------------------- |
| Language  | [e.g., TypeScript] | [version if relevant] |
| Framework | [e.g., React]      |                       |
| Database  | [e.g., PostgreSQL] |                       |
| Hosting   | [e.g., Vercel]     |                       |

---

## Open Questions

- [ ] [Unresolved question that may affect this session's work]
- [ ] [Unresolved question]

---

## Known Issues

- **[Issue title]:** [Description of the problem and any workarounds]
- **[Issue title]:** [Description]

---

## Success Criteria

This session is complete when:

- [ ] [Specific, verifiable outcome]
- [ ] [Specific, verifiable outcome]
- [ ] [Specific, verifiable outcome]
