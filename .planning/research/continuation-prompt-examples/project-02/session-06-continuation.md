# Session 06: Implement Phase 1 — Foundation

## Context

Sessions 01-02 researched open questions and produced the spec through v0.2. Session 03 reviewed architecture feedback, accepted all 7 reviewer proposals, and produced v0.3. Session 04 adversarially reviewed v0.3, found 20 issues, deployed 7 resolution subagents, and produced resolution documents. Session 05 synthesized all resolutions into v0.4 — the final pre-implementation spec.

**The spec is at:** `.planning/research/wf-spec-v0.4.md`

**Repo:** `/Users/liamj/Documents/development/workflow/`

## What Happened in Session 05

Synthesized 7 resolution documents (4 proposals + 3 tension resolutions) from Session 04 into the v0.3 spec to produce v0.4. This was a mechanical integration — all design decisions were made in Session 04.

Key changes in v0.4:
- Fixed `parent_id` FK bug (`DEFAULT NULL`, `ON DELETE SET NULL`)
- Removed `parent-child` dependency type (4→3 types)
- Rewrote CTE to only check `blocks` dependencies with transitive blocking
- 13 canonical event types, dropped dual-event pattern
- `--unclaim` as sole unclaim mechanism
- Full specifications for `wf edit`, `wf update`, `wf assign`, `wf status`, `wf close`, `wf ready`
- Verification claiming (`--for-review`), two-phase claim lifecycle
- Cascading unblock on close/verify
- Session ID lifecycle, checkpoint-as-bookmark model
- Content hash immutability, ID collision detection algorithm
- `*int` pointer type convention for priority

All 8 quality checks passed:
1. Every command has specified flags
2. Every status transition has a command
3. Every event type has a creating command
4. No undocumented event types
5. CTE only references `blocks` (no `parent-child`)
6. `parent_id` uses `DEFAULT NULL`
7. All hook scripts pass `--session-id`
8. `wf edit` transition table consistent with `--unclaim`

## The Job for Session 06

Begin implementation. Phase 1 (Foundation) from the spec — ~1,600 lines of Go.

### Phase 1 Scope (from spec section 8)

**Build:**
- SQLite schema (issues, dependencies, events, checkpoints tables + indexes + ready_issues view)
- Hash-based ID generation with adaptive length and collision detection
- Content-hash computation for dedup
- Core CRUD: `wf init`, `wf create`, `wf bulk-create`, `wf get`, `wf edit` (with `--unclaim`, status transitions, label modes), `wf list`, `wf close` (with `--reason`, `--reflection`)
- Typed dependencies: `wf link`, `wf unlink` (3 types, rejects `parent-child`)
- `wf status` with three output modes (`--brief`, `--oneline`, `--stale`)
- `wf log` — event query
- `wf backup` — database backup
- Cascading unblock on close
- `--json` auto-detection (TTY-based)
- Token-efficient JSON output (omit empty fields, `*int` for priority)

### Constraints

- Go, `modernc.org/sqlite`, Kong v1.0, 2 dependencies
- All code written by Claude
- Local-only, single machine, single user
- `<5ms` CLI startup
- `BEGIN IMMEDIATE` for all write transactions
- Token-efficient JSON output (omit empty fields)

### Recommended Implementation Order

1. **Project setup:** `go mod init`, dependencies, directory structure (`cmd/wf/`, `internal/`)
2. **Schema + storage:** SQLite open, PRAGMAs, schema creation, migrations foundation
3. **Model structs:** Issue, Dependency, Event, Checkpoint with `*int`/`*string` conventions
4. **Hash ID generation:** SHA256 + truncation + collision detection
5. **Content hash:** Immutable dedup key
6. **`wf init`:** Create `.git/workflow/` directory, schema, config, gitignore
7. **`wf create`:** Single issue creation with ID generation and content hash
8. **`wf get`:** Simple query + JSON output
9. **`wf list`:** Filtered query
10. **`wf edit`:** Complex — status transitions, `--unclaim`, label modes, event recording
11. **`wf close`:** With `--reason`, `--reflection`, cascading unblock
12. **`wf link` / `wf unlink`:** Dependency management (3 types, reject `parent-child`)
13. **`wf bulk-create`:** Batch creation with dedup and provisional IDs
14. **`wf status`:** Three output modes
15. **`wf log`:** Event query
16. **`wf backup`:** Database backup
17. **Output layer:** TTY detection, `--json`/`--no-json`, token-efficient serialization

### Key Spec Sections to Reference

- Section 2.1-2.6: Full SQL schema
- Section 4.1: Output conventions, `*int` note
- Section 4.2: Command table
- Section 4.3: Bulk create + dedup algorithm
- Section 4.5: `wf edit` specification (the most complex command)
- Section 4.6: `wf close` specification
- Section 4.7: `wf status` specification
- Section 5.8: Cascading unblock SQL
- Section 7.2-7.4: Architecture, dependencies, package layout
- Section 10: ID system + content hash
- Section 11: Configuration
