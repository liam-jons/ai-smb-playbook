# Session 05: Synthesize Review into `wf` Spec v0.4

## Context

Sessions 01-02 researched open questions and produced the spec through v0.2. Session 03 reviewed architecture feedback, accepted all 7 reviewer proposals, and produced v0.3. Session 04 adversarially reviewed v0.3, found 20 issues, deployed 7 subagents (4 proposing fixes, 3 resolving tensions), and produced a complete set of resolution documents ready for integration.

**Repo:** `/Users/liamj/Documents/development/workflow/`

## What Happened in Session 04

### Phase 1: Adversarial Review

Found 20 issues in v0.3, categorized as:
- **5 must-fix:** #1 (parent_id FK bug), #2 (wf update unspecified), #4 (verifier can't claim), #5 (parent dual representation), #6 (blocked→open no mechanism)
- **6 should-fix:** #3 (close vs verify), #7 (no unclaim), #8 (wf assign semantics), #12 (wf status flags), #16 (event types), #20 (wf edit flags)
- **7 clarification:** #9, #10, #11, #13, #14, #15, #17, #18
- **2 cosmetic:** #15, #19

Key insight: "The states themselves are well-designed; the transitions between states are underspecified."

### Phase 2: Four Resolution Agents (parallel)

Each wrote detailed proposals to a file:

1. **Vision Alignment** → `.planning/research/v04-review/01-vision-alignment.md`
   - Spec is fundamentally sound, all 7 original problems still addressed
   - Scope controlled at ~4,450 lines
   - 6/7 v0.2 proposals fully integrated; UserPromptSubmit partially integrated
   - No issue represents a fundamental design mistake

2. **Schema & Data Model** → `.planning/research/v04-review/02-schema-fixes.md`
   - #1: `parent_id DEFAULT NULL`, add `ON DELETE SET NULL`, fix `created_during` too
   - #5: Remove `parent-child` dep type entirely (4→3 types), `parent_id` is sole mechanism
   - #17: `*int` pointer type for Priority, full Issue struct with field conventions
   - #18: Content hash is immutable (computed once at creation), step-by-step dedup algorithm
   - #19: Progressive ID extension inside single `BEGIN IMMEDIATE` tx, global monotonic `id_length`

3. **Command Interface** → `.planning/research/v04-review/03-command-specs.md`
   - #8: `wf assign` = soft reservation (sets assignee, no status change). `wf claim --next` prefers assigned-to-me.
   - #10: `--unclaimed` now meaningful (filters out soft-reserved issues)
   - #2: `wf update` = additive progress command with `--notes`, `--files`, hidden `--event-type`/`--event-data` for hooks
   - #20: `wf edit` = full flag spec with status transition validation table (can't transition to `done` or `in_progress`)
   - #3: Two distinct paths to `done` — `wf verify` is verifier path (from `in_review`), `wf close` is orchestrator path (from any non-done). Both set `closed_at`. Different event types.
   - #12: Three `wf status` modes: full, brief, brief+oneline. Flag interaction table.
   - #16: 12 enumerated event types. No CHECK constraint. Go constants.

4. **Workflow & Session** → `.planning/research/v04-review/04-workflow-session.md`
   - #4: Add `--for-review` flag to `wf claim`. `wf done` clears assignee. Two-phase claim lifecycle.
   - #6: Hybrid — automatic cascading unblock in same tx as close/verify + manual via `wf edit`
   - #7: `--unclaim` flag on `wf edit` for stale claim resolution
   - #11: "Newly ready" = since most recent checkpoint's `created_at`. First resume = all ready.
   - #13: Checkpoints are bookmarks, not snapshots. `wf resume` queries live DB.
   - #14: Complete session ID lifecycle — SessionStart writes to CLAUDE_ENV_FILE, all hooks pass `--session-id`
   - #15: `wf discover --during <id>` records a `discovery` event on source issue too

### Phase 3: Three Tension-Resolution Agents (parallel)

Three tensions between the proposal agents were identified and reviewed:

1. **Tension 1: Remove `parent-child` dep type?** → `.planning/research/v04-review/tension-01-parent-child.md`
   - **Verdict: ACCEPT removal.**
   - Found TWO contradictions (not one): section 1.3 says parent status is informational, but the CTE blocks children by parent status AND propagates blocking through `parent_id` chains
   - Found a deadlock: if parent-child dep rows exist, children can never be worked because epic can't complete first
   - Multi-parent not needed (verified against original synthesis)
   - The removal is not a usability regression — the buggy paths (`wf link`) are the ones removed
   - The simplified CTE adds transitive blocking through `blocks` edges (which v0.3 lacked)

2. **Tension 2: Event type consolidation** → `.planning/research/v04-review/tension-02-event-types.md`
   - **Verdict: 13 canonical types** (dropped `checkpoint` — doesn't belong in issue-level events table; dropped `commented` — no command creates it; added `discovery` and `unclaimed`)
   - **Drop the dual-event pattern.** Don't emit `status_changed` alongside lifecycle events (`claimed`, `closed`, `verified`, `reopened`). Each lifecycle event carries its own status transition in `old_value`/`new_value`. Retain `status_changed` only for transitions without a dedicated type (`wf edit --status`, `wf done`, cascading unblock).
   - Keep fine-grained types (13 not fewer). Primary consumer is Claude querying via `wf log --type`.
   - No CHECK constraint. Free-form with documentation + Go constants.

3. **Tension 3: Unclaim mechanism** → `.planning/research/v04-review/tension-03-unclaim.md`
   - **Verdict: `--unclaim` is the sole mechanism.** Remove `in_progress → open` from `wf edit --status` transition table.
   - The crashed verifier case is decisive: unclaiming from `in_review` must keep status as `in_review` (not revert to `open`). The command agent's approach can't handle this.
   - Unclaiming is fundamentally an assignee operation, not a status operation.
   - Produces a dedicated `unclaimed` event type for clean audit trail.

## The Job for Session 05

Produce `wf-spec-v0.4.md` by integrating all accepted resolutions into the v0.3 spec. This is a mechanical integration — the design decisions are made. The work is:

1. **Read the v0.3 spec** (`.planning/research/wf-spec-v0.3.md`)
2. **Read all 7 resolution documents** (in `.planning/research/v04-review/`)
3. **Apply every accepted change** to produce v0.4

### Specific Changes to Apply

**Section 1 (Data Model):**
- Section 1.1: Change `parent_id` to nullable (`string?`). Same for `created_during`.
- Section 1.2: Remove `parent-child` from dependency types (4→3). Update design note.
- Section 1.3: Clarify `parent_id` is sole parent-child mechanism. Children are NOT blocked by parent status. State explicitly.
- Section 1.4: Add design note that `assignee` on `open` issue = soft reservation (not a status). Document `--unclaim` as the transition mechanism for `in_progress → open` and verifier reassignment.

**Section 2 (SQLite Schema):**
- Section 2.1: `parent_id TEXT DEFAULT NULL REFERENCES issues(id) ON DELETE SET NULL`. Same for `created_during`. Update `idx_issues_parent` to `WHERE parent_id IS NOT NULL`. Add `idx_issues_content_hash`.
- Section 2.2: Remove `parent-child` from CHECK constraint (3 dep types).
- Section 2.3: Add canonical event type table (13 types) with creating commands, field usage, and data schemas. Note: no CHECK constraint, free-form with Go constants.
- Section 2.5: Rewrite CTE to only check `blocks` dependencies. Remove `parent_id`-based recursive blocking.
- Section 2.6: Add verification claiming query (`--for-review`, matches `in_review`). Document that `wf done` clears assignee. Add `ORDER BY` preference for assigned-to-me in `claim --next`.

**Section 3 (Storage):** No changes needed.

**Section 4 (CLI Command Reference):**
- Section 4.1: Add implementation note about `*int` for priority / `omitempty` gotcha.
- Section 4.2: Full flag specifications for ALL commands:
  - `wf create`: already specified enough
  - `wf edit`: full flag spec, editable vs non-editable fields, status transition validation table (add `--unclaim` flag, no `in_progress→open` via `--status`), label add/remove modes, event recording
  - `wf claim`: add `--for-review` flag
  - `wf assign`: soft reservation semantics, `open`/`blocked` only, `assigned` event
  - `wf update`: `--notes`, `--files`, `--agent`, hidden `--event-type`/`--event-data`, requires `in_progress`, additive (vs `wf edit` which replaces)
  - `wf status`: `--brief`, `--oneline`, `--stale <duration>`, three output modes with schemas, flag interaction table
  - `wf close`: `--reason` (enum), `--reflection`, works from any non-done status, clears assignee if `in_progress`
  - `wf ready`: document `--unclaimed` semantics (filters soft-reserved)
  - `wf discover`: document that it records `discovery` event on source issue too
- Section 4.3: Add step-by-step bulk-create dedup algorithm. Document within-batch duplicate handling (error).
- Section 4.4: Update verifier tool surface to include `wf claim --for-review`.

**Section 5 (Workflow Primitives):**
- Section 5.1: Add verification claiming subsection. Document `--for-review`. Document `wf done` clearing assignee (two-phase claim lifecycle). Update stale detection to mention discovery events.
- Section 5.2: Document three work-discovery states (unassigned open, assigned open, claimed in_progress).
- Section 5.3: Clarify `wf verify --result approved` sets `closed_at` and `close_reason`. Add cascading unblock to verify-approved workflow.
- Add new subsection 5.8: "Blocking and Unblocking" — automatic cascading unblock (SQL), manual unblock via `wf edit --status open`, both scenarios documented.
- Section 5.4: Add `discovery` event on source issue.
- Section 5.6: Define "newly ready" = since last checkpoint `created_at`. Document no-checkpoint fallback.
- Section 5.7: Clarify `wf close` works from any non-done status. Document `in_progress` cleanup behavior. Clarify relationship with `wf verify --result approved`.

**Section 6 (Plugin):**
- Section 6.4: Document complete session ID lifecycle (origin, CLAUDE_ENV_FILE persistence, flow to commands).
- Section 6.5: Reference command spec for `wf status --brief --oneline` rather than re-specifying.
- Section 6.7: Clarify checkpoints are bookmarks, not snapshots. Update PreCompact script to pass `--session-id`.
- Update all hook script examples to pass session ID.

**Section 7-8 (Implementation):**
- Section 7.4: Add `output/` package note about `*int` convention.
- Phase 1 line count may change slightly (additional `wf edit` complexity).
- Phase dependencies unchanged.

**Section 9 (Open Questions):**
- Move resolved questions to "Resolved in v0.4" section.
- Update "One level of nesting" row — `parent_id` chaining provides deeper structure.

**Section 10 (ID System):**
- Add step-by-step collision detection algorithm. Document within-batch handling.
- Add content hash immutability and dedup algorithm.
- Add `idx_issues_content_hash` index.

**Section 11 (Configuration):** No changes needed.

**Section 13 (Diagrams):**
- Section 13.1: Update state diagram — annotate `blocked → open` with both mechanisms, annotate `in_progress → open` with `--unclaim`, add verification claiming flow.

**Changelog (top of document):**
- Changes from v0.3 bullet list

### Quality Checks

After producing v0.4, verify:
- Every command in section 4.2 has specified flags
- Every status transition in section 13.1 has a command that performs it
- Every event type in section 2.3 has a command that creates it
- No command creates an event type not in the table
- The CTE only references `blocks` dependencies (no `parent-child`)
- `parent_id` uses `DEFAULT NULL` (not `DEFAULT ''`)
- All hook scripts pass `--session-id`
- The `wf edit` transition table is consistent with the `--unclaim` flag being the sole unclaim mechanism

## Files to Read

In order of importance:

1. `.planning/research/wf-spec-v0.3.md` — the base spec to modify (~1,250 lines)
2. `.planning/research/v04-review/03-command-specs.md` — command interface proposals (7 commands)
3. `.planning/research/v04-review/04-workflow-session.md` — workflow & session proposals (7 issues)
4. `.planning/research/v04-review/02-schema-fixes.md` — schema proposals (5 issues)
5. `.planning/research/v04-review/tension-01-parent-child.md` — accept removal
6. `.planning/research/v04-review/tension-02-event-types.md` — 13 canonical types, drop dual events
7. `.planning/research/v04-review/tension-03-unclaim.md` — `--unclaim` sole mechanism
8. `.planning/research/v04-review/01-vision-alignment.md` — prioritization reference

## Constraints

- Go, `modernc.org/sqlite`, Kong v1.0, 2 dependencies
- All code written by Claude
- Local-only, single machine, single user
- The tool is for a human-AI pair using Claude Code
- v0.4 is the final pre-implementation spec — it must be unambiguous enough for Claude to build Phase 1 without further questions
