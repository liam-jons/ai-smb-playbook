# Session 08: Implement Phase 1 — Foundation

## Context

Sessions 01-05 produced the spec through v0.4 (final pre-implementation). Session 06 was deferred. Session 07 subjected v0.4 to two independent adversarial critiques (20 points each), synthesized fixes, and produced v0.5. Session 07.5 performed a final review of v0.5: structural consistency, implementability, and edge case audit.

**The spec is at:** `/Users/liamj/Documents/development/bid-manager/scripts/wf-spec-v0.5.md`

**Important:** The spec header (lines 9-22) contains a "Changes from v0.4" block. Remove this before using as implementation reference — it's review context, not implementation guidance.

**Repo:** `/Users/liamj/Documents/development/workflow/`

## What Session 07 Found

v0.5 passed all structural checks:
- All cross-references resolve correctly
- All 14 event types have creating commands
- All status transitions consistent with command specs
- SQL consistent with schema everywhere
- All 8 quality checks from session 05 pass
- All v0.4→v0.5 changes applied correctly, zero regressions

The issues found are **underspecified commands**, not design problems. The core architecture is solid. The addendum below fills the gaps.

## Required Spec Addendum

**Read the v0.5 spec first, then apply these addenda.** These fill gaps identified in the final review. They do not change any existing spec behavior — they only specify what was left implicit.

### A1: `wf verify` Must Clear Assignee (CRITICAL FIX)

**Gap:** Section 5.3 doesn't specify whether `wf verify` clears the assignee on rejection. If it doesn't, the re-work cycle breaks — the issue gets stuck in `open` with a stale verifier assignee that `wf claim` won't override and `wf edit --unclaim` can't clear (only works on `in_progress`/`in_review`).

**Fix:** `wf verify` clears `assignee` and `claimed_at` for ALL outcomes:

```sql
-- wf verify --result approved
BEGIN IMMEDIATE;
UPDATE issues
SET status = 'done',
    assignee = '',
    claimed_at = NULL,
    closed_at = datetime('now'),
    close_reason = 'completed',
    updated_at = datetime('now')
WHERE id = ? AND status = 'in_review';
-- Then: record 'verified' event, run cascading unblock
COMMIT;

-- wf verify --result changes_requested OR --result rejected
BEGIN IMMEDIATE;
UPDATE issues
SET status = 'open',
    assignee = '',
    claimed_at = NULL,
    updated_at = datetime('now')
WHERE id = ? AND status = 'in_review';
-- Then: record 'verified' event
COMMIT;
```

**Output (JSON):**

```json
{
  "id": "wf-a1b2",
  "status": "done",
  "result": "approved",
  "close_reason": "completed",
  "closed_at": "2025-01-16T14:00:00Z"
}
```

`--findings` accepts a string (free text). `--follow-up` accepts comma-separated issue IDs (existing issues to link as follow-ups). `--agent` sets the `actor` on the event.

### A2: `wf create` Full Specification

**Flags:**

| Flag | Type | Required | Description |
|------|------|----------|-------------|
| `--title` | string | YES | One-line summary. Also accepted as first positional arg. |
| `--type` | string | No, default `task` | Issue type enum. |
| `--priority` | int | No, default 2 | 0-4. |
| `--description` | string | No | Full description (markdown). |
| `--parent` | string | No | Parent issue ID. Validated: must exist, not deleted. |
| `--labels` | string | No | Comma-separated labels. |
| `--blocks` | string | No | Comma-separated issue IDs that the NEW issue blocks. (Source = new issue, target = listed IDs.) |
| `--files` | string | No | Comma-separated relevant files. |
| `--acceptance-criteria` | string | No | When is this done? |
| `--scope-boundaries` | string | No | Explicit in/out scope. |
| `--design` | string | No | Implementation approach. |
| `--owner` | string | No | Responsible party. |
| `--metadata` | string | No | JSON object. |
| `--agent` | string | No | Sets `created_by`. Defaults to `""`. |

Fields NOT settable at create time: `assignee` (use `wf assign`), `status` (always `open`), `deferred_until` (use `wf edit`), `claimed_at`, `closed_at`, `close_reason`, `deleted_at`.

**Behavior:**
1. Validate `--title` is provided and non-empty.
2. Validate `--parent` exists and is not deleted (if provided).
3. Validate `--blocks` IDs exist and are not deleted (if provided).
4. Generate ID (section 10 algorithm).
5. Compute content hash (section 10).
6. INSERT issue in `BEGIN IMMEDIATE` transaction.
7. INSERT `blocks` dependencies (if any).
8. Record `created` event: `{event_type: "created", data: {issue_type, priority}}`.
9. Return created issue.

**Output (JSON):**

```json
{
  "id": "wf-a1b2",
  "title": "Implement token refresh",
  "issue_type": "task",
  "status": "open",
  "priority": 2
}
```

### A3: `wf get` Full Specification

`wf get <id>` returns the full issue object with token-efficient serialization.

**Behavior:**
1. Accept full ID (`wf-a1b2`) or short ID without prefix (`a1b2`). If ambiguous (multiple matches for short ID), error with candidates.
2. Returns the issue with all non-empty fields.
3. Soft-deleted issues: `wf get` works on soft-deleted issues (returns them with `deleted_at` set). This is useful for audit/inspection.
4. Non-existent ID: error, exit 1.
5. Does NOT include dependencies, events, or parent details. Use `wf context` for rich relational data, `wf log --issue` for events.

**Output (JSON):**

The full Issue struct with `omitempty` — all non-empty fields included. Example:

```json
{
  "id": "wf-a1b2",
  "title": "Implement token refresh flow",
  "description": "JWT refresh with rotation and revocation",
  "issue_type": "task",
  "status": "in_progress",
  "priority": 1,
  "assignee": "worktree-1-impl",
  "claimed_at": "2025-01-16T10:00:00Z",
  "acceptance_criteria": "Tokens refresh correctly, old tokens revoked",
  "relevant_files": ["src/auth/token.ts"],
  "labels": ["backend", "auth"],
  "parent_id": "wf-9x8y",
  "created_at": "2025-01-16T09:00:00Z",
  "created_by": "orchestrator",
  "updated_at": "2025-01-16T10:30:00Z"
}
```

### A4: `wf done` Full Specification

`wf done <id>` marks implementation complete and transitions to `in_review`.

**Flags:**

| Flag | Type | Description |
|------|------|-------------|
| `--notes` | string | Optional completion notes. |
| `--agent` | string | Agent identity. Sets actor on events. |

**Behavior:**
1. Validate issue exists, not deleted, status = `in_progress`. Otherwise error (exit 1).
2. Clear assignee and claimed_at, set status = `in_review` (SQL in spec section 2.6).
3. Record `status_changed` event: `{via: "done"}`, `old_value: "in_progress"`, `new_value: "in_review"`.
4. If `--notes` provided: also record `progress_note` event with the notes text.
5. Return confirmation.

**Output (JSON):**

```json
{
  "id": "wf-a1b2",
  "status": "in_review",
  "prior_assignee": "worktree-1-impl"
}
```

### A5: Cascading Unblock SQL

Add this SQL for the cascading unblock triggered by `wf close` and `wf verify --result approved`:

```sql
-- Run inside the same BEGIN IMMEDIATE transaction as the close/verify
-- Find blocked issues whose ALL blocks-type blockers are now done
UPDATE issues
SET status = 'open',
    updated_at = datetime('now')
WHERE status = 'blocked'
  AND deleted_at IS NULL
  AND id IN (
    -- Issues that were blocked by the just-completed issue
    SELECT d.target_id
    FROM dependencies d
    WHERE d.source_id = ?  -- the just-completed issue ID
      AND d.dep_type = 'blocks'
  )
  AND NOT EXISTS (
    -- ...but still have other non-done blockers
    SELECT 1
    FROM dependencies d2
    JOIN issues blocker ON d2.source_id = blocker.id
    WHERE d2.target_id = issues.id
      AND d2.dep_type = 'blocks'
      AND blocker.status != 'done'
      AND blocker.deleted_at IS NULL
  )
RETURNING id;
-- For each returned id, record status_changed event: {via: "unblock", resolved_by: "<completed_id>"}
```

**Cascading is single-level, not recursive.** Completing A unblocks B (if A was B's last blocker). B moves to `open`, not `done`, so B's dependents stay blocked. This is correct — you can't skip B's work.

### A6: `wf link` / `wf unlink` Specification

**`wf link <src> <tgt> <type>`:**

1. Validate both IDs exist and are not deleted.
2. Validate type is one of: `blocks`, `discovered-from`, `related`. Reject `parent-child` with message: "Use `wf edit --parent` for parent-child relationships."
3. Reject self-referencing (src == tgt).
4. Reject duplicates (same src, tgt, type already exists) — error, exit 1.
5. INSERT into dependencies table.
6. No event recorded. (Dependencies are structural, not workflow events. They appear in `wf context` output.)
7. Creating a `blocks` link does NOT change the target's status. The `ready_issues` view handles blocking at query time. If the target should be marked `blocked`, use `wf edit --status blocked` separately.

**Output (JSON):**

```json
{
  "source_id": "wf-a1b2",
  "target_id": "wf-c3d4",
  "dep_type": "blocks",
  "created": true
}
```

**`wf unlink <src> <tgt> <type>`:** Same validation. DELETE from dependencies. No cascading status changes. If link doesn't exist, error (exit 1).

```json
{
  "source_id": "wf-a1b2",
  "target_id": "wf-c3d4",
  "dep_type": "blocks",
  "removed": true
}
```

`--note` flag on `wf link`: accepted, sets the `note` field in the dependencies table. Optional.

### A7: ID Input Format

All commands that accept an issue ID support two input forms:
- Full ID: `wf-a1b2` (with prefix)
- Short ID: `a1b2` (without prefix, auto-prefixed)

The tool normalizes input: if the ID doesn't start with `wf-`, prepend it. No partial matching — IDs must be exact after normalization.

### A8: Minor Gap Decisions

These are implementation-time decisions. Document here for reference:

- **`wf init` idempotency:** If already initialized (database exists), print a message and exit 0. No migration yet — that's a future concern.
- **`wf init` gitignore:** No gitignore entries needed. The database is inside `.git/` which is inherently ignored. `.workflow/` is git-tracked.
- **`wf init` output:** `{"initialized": true, "db_path": "...", "config_path": "..."}`
- **`wf backup` output:** `{"backup_path": "...", "kept": 5, "removed": 0}`
- **`wf backup` timestamp format:** `YYYYMMDD-HHMMSS` (e.g., `workflow-20250116-120000.db`)
- **`wf backup` method:** Use file copy after `PRAGMA wal_checkpoint(TRUNCATE)`. Simpler than the backup API for modernc.org/sqlite.
- **`wf claim` output:** Return the full issue object (same as `wf get`).
- **`wf ready` output:** `{"issues": [...], "total": N}` — same pattern as `wf list`.
- **`wf discover` output:** Same as `wf create` output, plus `"discovered_from": "<source_id>"` if `--during` was provided.
- **`wf checkpoint` output:** `{"checkpoint_id": N, "source": "manual", "active_count": 3}`
- **`wf log` sort order:** Reverse chronological (`ORDER BY created_at DESC`).
- **`wf status` `high_priority_open` threshold:** P0 and P1.
- **`wf link`/`wf unlink` — `blocks` link does NOT auto-change target status.** The `ready_issues` view handles blocking at query time. Explicit `wf edit --status blocked` is needed if the status field should reflect it.
- **`wf delete` — soft-deleting a blocker does NOT trigger cascading unblock.** Only `wf close` and `wf verify --result approved` trigger it. To unblock dependents of a deleted issue, use `wf edit --status open` on them.

---

## Phase 1 Scope (from spec section 8)

**Build (~1,700 lines Go):**
- SQLite schema (issues, dependencies, events, checkpoints tables + indexes + ready_issues view)
- Hash-based ID generation with adaptive length and collision detection
- Content-hash computation for dedup
- Core CRUD: `wf init`, `wf create`, `wf bulk-create`, `wf get`, `wf edit`, `wf list`, `wf delete`, `wf close`
- Typed dependencies: `wf link`, `wf unlink`
- `wf status` with three output modes
- `wf log` — event query
- `wf backup` — database backup
- Cascading unblock on close
- `--json` auto-detection (TTY-based)
- Token-efficient JSON output

**Not in Phase 1:** `wf claim`, `wf ready`, `wf assign`, `wf update`, `wf discover`, `wf resume`, `wf checkpoint`, `wf context`, `wf done`, `wf verify`.

## Constraints

- Go, `modernc.org/sqlite`, Kong v1.0, 2 dependencies
- All code written by Claude
- `<5ms` CLI startup
- `BEGIN IMMEDIATE` for all write transactions
- Two `sql.DB` instances: writes (`MaxOpenConns(1)`) and reads

## Recommended Implementation Order

1. **Project setup:** `go mod init`, dependencies, directory structure (`cmd/wf/`, `internal/`)
2. **Schema + storage:** SQLite open, PRAGMAs, schema creation, migrations foundation
3. **Model structs:** Issue, Dependency, Event, Checkpoint with `*int`/`*string` conventions
4. **Output layer:** TTY detection, `--json`/`--no-json`, token-efficient serialization, error JSON
5. **Hash ID generation:** SHA256 + truncation + collision detection
6. **Content hash:** Immutable dedup key
7. **`wf init`:** Create directories, schema, config
8. **`wf create`:** Single issue creation (see addendum A2)
9. **`wf get`:** Query + full issue output (see addendum A3)
10. **`wf list`:** Filtered query with all flags
11. **`wf edit`:** Complex — status transitions, `--unclaim`, label modes, events
12. **`wf delete`:** Soft-delete + hard-delete
13. **`wf close`:** With `--reason`, `--reflection`, cascading unblock (see addendum A5)
14. **`wf link` / `wf unlink`:** Dependency management (see addendum A6)
15. **`wf bulk-create`:** Batch creation with dedup and provisional IDs
16. **`wf status`:** Three output modes
17. **`wf log`:** Event query
18. **`wf backup`:** Database backup

## Key Spec Sections to Reference

- Section 2.1-2.6: Full SQL schema, claiming queries, ready_issues CTE
- Section 4.1: Output conventions, exit codes, error format
- Section 4.3: Bulk create + dedup algorithm
- Section 4.5: `wf edit` specification (most complex command)
- Section 4.6: `wf list` specification
- Section 4.7: `wf delete` specification
- Section 4.8: `wf close` specification
- Section 4.9: `wf status` specification
- Section 4.10: `wf log` specification
- Section 5.8: Cascading unblock (plus addendum A5 for SQL)
- Section 7.2-7.4: Architecture, dependencies, package layout
- Section 10: ID system + content hash
- Section 11: Configuration

## Addendum Cross-Reference

- A1: `wf verify` assignee clearing — not Phase 1, but read for context
- A2: `wf create` full spec — **Phase 1, implement at step 8**
- A3: `wf get` full spec — **Phase 1, implement at step 9**
- A4: `wf done` full spec — Phase 2
- A5: Cascading unblock SQL — **Phase 1, implement at step 13**
- A6: `wf link`/`wf unlink` spec — **Phase 1, implement at step 14**
- A7: ID input format — **Phase 1, implement in ID resolution layer**
- A8: Minor gap decisions — **Phase 1, reference as needed**
