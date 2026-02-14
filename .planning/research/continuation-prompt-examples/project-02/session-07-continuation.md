# Session 07: Review wf-spec-v0.5

## Context

Sessions 01-05 produced the spec through v0.4. Session 06 was planned for implementation but was deferred. Instead, v0.4 was subjected to two independent adversarial critiques (same prompt: "Give me 20 points that are underspecified, weird, or inconsistent"). 

A synthesis session then:
1. Analyzed both critiques against the spec
2. Separated legitimate issues from fluff/philosophical disagreements
3. Produced a detailed changes document
4. Created v0.5 with all fixes applied

**The spec is at:** `/Users/liamj/Documents/development/bid-manager/scripts/wf-spec-v0.5.md`

**Supporting files:**
- `/Users/liamj/Documents/development/bid-manager/wf-spec-v0.5-changes.md` — Detailed changelog with rationale
- `/Users/liamj/Documents/development/bid-manager/wf-v04-critique-001.md` — First critique
- `/Users/liamj/Documents/development/bid-manager/wf-v04-critique-002.md` — Second critique
- `/Users/liamj/Documents/development/bid-manager/scripts/wf-spec-v0.4.md` — Previous version for comparison

## What Changed in v0.5

**Critical fixes:**
1. **File layout split** — Git-tracked files (`config.json`, `PRIME.md`) moved from `.git/workflow/` to `.workflow/`. Git cannot track files inside `.git/` — this was a factual error.
2. **`claim --next` priority fix** — Priority now takes precedence over assignment preference. A P0 unassigned beats a P3 assigned-to-me.

**High-priority additions:**
3. `wf delete` — Soft-delete command with `--hard` flag
4. `wf list` — Fully specified (filter composition, sorting, pagination)
5. `wf context --depth` — Traversal semantics defined

**Medium-priority clarifications:**
6. `deferred_until` format — ISO8601 or relative (`4h`, `7d`, `2w`)
7. Metadata semantics — Replace, not merge
8. `wf discover --during` — Optional but recommended
9. `wf log` — Fully specified

**Recommended changes:**
10. `verify --result rejected` → `open` (was `blocked`)
11. Stale detection expanded to include `in_review`

**Trimmed:**
12. Removed Mermaid diagrams section (maintenance burden, redundant)
13. Consolidated `*int` pointer explanation to one location
14. Condensed SQLite configuration rationale

## The Job for Session 07

**Final review before implementation.** The goal is to validate v0.5 is ready to build.

### Task 1: Structural Review

Read the full v0.5 spec and verify:

1. **Internal consistency** — Do all cross-references resolve? Do command specifications match the event types they claim to create? Do status transition tables match the CTE/queries?

2. **Completeness** — For each of the 23 commands in the command table:
   - Is there a dedicated specification section?
   - Are all flags documented?
   - Is the output format specified?
   - Are error conditions/exit codes clear?

3. **No regressions** — Did the v0.4→v0.5 changes introduce any new inconsistencies? Check the 8 quality checks from session 05:
   - Every command has specified flags
   - Every status transition has a command
   - Every event type has a creating command
   - No undocumented event types
   - CTE only references `blocks` (no `parent-child`)
   - `parent_id` uses `DEFAULT NULL`
   - All hook scripts pass `--session-id`
   - `wf edit` transition table consistent with `--unclaim`

### Task 2: Implementability Check

For each Phase 1 command, verify the spec provides:
- Exact SQL queries or clear logic
- Input validation rules
- Event recording requirements
- Output JSON structure

Flag any command where an implementer would need to make design decisions not covered by the spec.

### Task 3: Edge Case Audit

Review these known edge cases and verify the spec handles them:

1. **Bulk-create with edited issues** — If you bulk-create, edit a title, then re-run the same bulk-create, what happens? (Content hash is immutable, so dedup won't match.)

2. **Verification ping-pong** — After `verify --result rejected`, what's the path back to `in_review`? (Should be: `open` → `claim` → `done`)

3. **Stale detection with discovery events** — Does `wf discover --during <id>` create an event on the source issue that prevents false-positive stale detection?

4. **Cascading unblock with transitive blocks** — If A blocks B and B blocks C, completing A unblocks B (to `open`). C stays blocked (by B). Is this behavior clear in the spec?

5. **Session ID race** — Two parallel Claude instances sharing `CLAUDE_ENV_FILE` — is this a real concern or a non-issue?

### Task 4: Decision — Ready or Not?

After the review, make one of these calls:

**Option A: Ready for implementation**
- Create session-08-continuation.md with implementation instructions
- Note: the continuation prompt from session-06 can be adapted, but section references will need updating

**Option B: Needs another iteration**
- Document the issues found
- Recommend specific fixes
- Create v0.6 changes document

## Notes

- The spec has a "Changes from v0.4" block in the header (lines 9-22). This should be removed before implementation — it's useful for review but becomes noise once we're building.
- The original requirements are in `/Users/liamj/Documents/development/workflow/.planning/research/prompt-synthesis.md`
- Context7 MCP and web search are available if you need to verify technical details (SQLite behavior, Go conventions, etc.)
