# Session 02: Apply Research & Write `wf` Spec v0.2

## Context

Session 01 researched 5 open questions and 3 user-raised points for the `wf` workflow tool spec. All research is complete and synthesised. This session applies the findings to produce v0.2 of the spec.

**Repo:** This is the `/workflow` repo (not `/bid-manager` where earlier research lived). All files are here.

## Read These Files (In Order)

1. **The v0.1 spec** (canonical, 841 lines): `.planning/research/wf-spec-v0.1.md`
2. **Research findings** (all open questions resolved, 487 lines): `.planning/research/wf-spec-research.md`

The research file contains 8 sections, each ending with a bold **Spec action** block listing exactly what to change. Apply all of them.

If any research finding needs more detail, the full subagent outputs are in `.planning/research/wf-spec-research/` (5 files, one per research topic).

## What Was Resolved

| # | Topic | Decision |
|---|-------|----------|
| 1 | SQLite WAL across worktrees | **Safe.** No issues on macOS APFS. Add PRAGMAs, `BEGIN IMMEDIATE` mandate, canonical path requirement. |
| 2 | Claude Code hooks | **Validated with corrections.** Change `Stop` → `SessionEnd`. Add `compact` matcher. Document hook input JSON, `CLAUDE_ENV_FILE`, SubagentStop. |
| 3 | `claimed` vs `in_progress` | **Merge.** Drop `claimed`. Five states, not six. |
| 4 | Pure Go SQLite | **`modernc.org/sqlite` confirmed.** Add DSN pattern + `RegisterConnectionHook()` alternative. |
| 5 | CLI framework | **Switch Cobra → `urfave/cli v3`.** Zero deps, built-in ExitCoder. Kong v1.0 as documented runner-up. |
| 6 | Worktree interaction | **`wf` stays independent.** Add explanatory section on separation of concerns. |
| 7 | PRD-to-issues conversion | **Claude Code skill, not CLI command.** Add note under `bulk-create`. |
| 8 | Workflow diagrams | **Yes, add.** Three mermaid diagrams (lifecycle, session boundary, discovery). |

## The Job

1. Read both files fully
2. Apply all "Spec action" items from the research to produce `wf-spec-v0.2.md`
3. Keep v0.1 as-is for reference
4. Ensure the new spec is internally consistent after all changes

## Section-by-Section Changes

### Section 1.4 (Status Model)
- Remove `claimed` from the six states → five states
- Update status transition descriptions
- The claiming action now sets `status = 'in_progress'` and `assignee` atomically

### Section 2.1 (Issues Table)
- Update `CHECK` constraint to remove `claimed`: `CHECK (status IN ('open', 'in_progress', 'in_review', 'done', 'blocked'))`

### Section 2.6 (Ready-Work View)
- No change needed (it queries `status = 'open'`, which is still correct)

### Section 2.7 (Atomic Claiming Query)
- Change `SET status = 'claimed'` → `SET status = 'in_progress'`
- Wrap in `BEGIN IMMEDIATE` (mandated by research finding #1)

### Section 3.4 (SQLite Configuration)
- Add specific PRAGMA values with rationale (from research §1)
- Add recommended DSN pattern (from research §4)
- Add `RegisterConnectionHook()` as alternative PRAGMA approach
- Add `BEGIN IMMEDIATE` mandate for all write transactions, with `SQLITE_BUSY_SNAPSHOT` rationale
- Add requirement to resolve database path via `realpath()` equivalent before opening
- Add implementation note: separate read/write `sql.DB` pools, close `sql.Rows` promptly
- Note SQLite 3.51.2 tracking and the modernc.org/sqlite GitLab #115 edge case
- Note zombiezen.com/go/sqlite as future optimisation path if read latency matters

### Section 4.1 (Command Table)
- Update `wf claim` description — no mention of `claimed` status; goes straight to `in_progress`
- Add note under `wf bulk-create` about plan decomposition being a Claude Code skill (not a wf command)

### Section 5.1 (Atomic Claiming)
- Update to reflect `in_progress` instead of `claimed`

### Section 5.7 (Session Boundary Handoff)
- Update `wf resume` stats example to remove `claimed` count

### Section 6 (Claude Code Plugin) — Major Expansion
- Change `Stop` hook → `SessionEnd` in hook table
- Add SessionEnd matcher values (`clear`, `logout`, `prompt_input_exit`, `other`)
- Add `SessionStart` with `compact` matcher for post-compaction re-injection
- **Explicitly document the PreCompact → checkpoint → SessionStart(compact) → resume chain** as the key reliability mechanism
- Add the full hook input JSON structure (session_id, transcript_path, cwd, hook_event_name, source, model)
- Document `CLAUDE_ENV_FILE` as available in SessionStart hooks for persisting env vars
- Add SubagentStop as a future-use hook for tracking agent completion, with `agent_transcript_path`
- Add context injection summary table (which hooks inject stdout/additionalContext)
- Add plugin directory structure example
- Document that `plugin.json` only requires `name`; hooks can be inline or separate file

### Section 7.2 (Dependencies)
- Change `github.com/spf13/cobra` → `github.com/urfave/cli/v3`
- Update rationale: zero external deps, built-in ExitCoder, global flag propagation
- Note Kong v1.0 as documented runner-up

### Section 7.3 (Architecture Diagram)
- Update the ASCII diagram: change `cobra-based subcommands` to `urfave/cli v3 subcommands`
- Change `Stop hook` to `SessionEnd hook` in the plugin box

### New Section 12: Worktree Interaction
- Explain why `wf` is worktree-agnostic by design
- Document the separation: worktree skill manages directories, `wf` manages tasks
- Agent identity captures worktree info by convention (`--agent "worktree-1-impl"`)
- When a worktree is removed, assigned issues remain — reclaim or reassign
- `wf` finds the database via `git rev-parse --git-common-dir` + `/workflow/workflow.db`

### New Section 13: Workflow Diagrams
- Issue lifecycle (state diagram) — note: uses five states, not six
- Session boundary (sequence diagram) — shows the PreCompact → SessionStart(compact) chain
- Discovery during work (sequence diagram)
- All three diagrams are in the research file, ready to copy

### Section 9 (Open Questions)
- **Remove resolved questions:**
  - SQLite WAL across worktrees on macOS → resolved (safe)
  - Claude Code plugin hooks fire reliably → resolved (validated with corrections)
  - `claimed` vs `in_progress` → resolved (merged)
- **Keep remaining questions:**
  - JSONL merge driver correctness (before v0.5)
  - JSONL file size management (before v0.5)
  - `wf context` output quality (before v0.3 — needs real usage testing)
- **Update "Design Decisions to Revisit":**
  - "CLI is the right interface, not MCP" — still open, no new data
  - Others — review for any that are now partially answered by the research

## Output

- Save as `.planning/research/wf-spec-v0.2.md`
- Keep v0.1 intact for reference
- Target ~950-1050 lines (v0.1 was 841; adding 2 new sections + expanding section 6, but removing resolved questions)
- The spec must be internally consistent — every reference to `claimed` removed, every reference to `Stop` hook corrected, every mention of Cobra updated

## Constraints

- All code is written by Claude — verbose is fine if it prevents ambiguity
- The tool is for a human-AI pair using Claude Code, not a team of human developers
- Local-only tool: single machine, single user
- Go language, pure Go SQLite (`modernc.org/sqlite`), minimal dependencies
