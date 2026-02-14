# Session 03: Review Architecture Feedback & Produce `wf` Spec v0.3

## Context

Session 01 researched open questions. Session 02 applied findings to produce v0.2, then switched CLI framework from urfave/cli to Kong, and deployed a subagent to review the architecture against the actual workflow. The review is complete and identifies the spec as **(b) the right tool, over-scoped**. This session reviews that feedback and decides what to accept before producing v0.3.

**Repo:** `/Users/liamj/Documents/development/workflow/`

## Read These Files (In Order)

1. **The v0.2 spec** (canonical, ~1,080 lines): `.planning/research/wf-spec-v0.2.md`
2. **The architecture review** (~296 lines): `.planning/research/wf-spec-v0.2-review.md`

The review answers 6 questions about architecture fit, over-engineering, missing pieces, phasing, MCP, and overall verdict. Each section has specific recommendations.

## What the Review Found

### Recommendations to Accept, Challenge, or Reject

The review makes 7 concrete change proposals. Each needs a decision before applying.

| # | Proposal | Impact | Notes for Discussion |
|---|----------|--------|---------------------|
| 1 | **Cut Phase 5 entirely** (JSONL sync, ~1,200 lines) | Major scope cut | Strong argument: single machine, single user, SQLite IS the store. Replace with trivial `wf backup`. Counter-argument: JSONL also enables "rebuild from scratch" if DB corrupts. Is file-copy backup sufficient? |
| 2 | **Promote Phase 3 into MVP** (session continuity) | MVP scope change | Current MVP (Phase 1+2) = queryable state + claiming but no session persistence. Reviewer argues first compaction wipes tool awareness — bad first experience. Proposed MVP: Phase 1 + 2 + 3a (~2,900 lines). |
| 3 | **Add `UserPromptSubmit` hook** | New feature | Reviewer's strongest novel recommendation. Lightweight status injection on every human prompt prevents "hour 8 amnesia." Not in v0.2 at all. High value, low cost (~50-100 lines). |
| 4 | **Simplify Phase 4** (drop reflections table, use events) | Moderate scope cut | Drop `wf reflect` as standalone. Add `--reflection` flag to `wf close`. Record verification in events table instead of dedicated verifications table. Saves ~200 lines. |
| 5 | **Reduce dependency types from 7 to 4** | Schema simplification | Keep `blocks`, `parent-child`, `discovered-from`, `related`. Defer `validates`, `duplicates`, `supersedes`. One-line migration to add later. |
| 6 | **Add stale claim detection** | Small addition (~30 lines) | `claimed_at` timestamp + filter on `wf status --stale 4h`. Catches crashed agents leaving issues stuck in `in_progress`. |
| 7 | **Add `wf log` command** | Small addition (~50-80 lines) | Events table is write-only without this. Makes the audit trail directly queryable. |

### Additional Observations Worth Discussing

- **Automatic PreCompact checkpoints use database-derived state, not Claude-authored summaries.** The hook runs an external script — it can't ask Claude for a handoff note. The spec should be explicit about this.
- **SubagentStop hook for automatic output capture** may be more valuable than manual reflections. Fires on every subagent completion, records structured completion data.
- **Token budget awareness** — each `wf` call returns JSON that consumes context. The spec should establish a principle: omit empty fields, tune default output for token efficiency.
- **`--json` should be the default** when no TTY detected, not a flag that Claude must remember.
- **`wf bulk-create` needs a JSON schema example** showing what the input format looks like with provisional IDs for cross-references.
- **MCP is correctly deferred** — CLI at <15ms per call is fine for 150 calls/day. Architecture already supports adding MCP later.

## The Job

1. Read both files fully
2. For each of the 7 proposals: decide accept/reject/modify, with rationale
3. For the additional observations: decide which to incorporate
4. Produce `wf-spec-v0.3.md` with all accepted changes applied
5. Keep v0.2 as-is for reference
6. Ensure internal consistency after all changes

## Decision Framework

When evaluating each proposal, consider:
- **Does this serve the actual workflow?** (human-AI pair, 12-14h sessions, 70-150 subagent calls/day)
- **Implementation cost is tokens, not time.** Cutting scope to "save effort" matters less than cutting scope to reduce complexity.
- **Will Claude actually use this?** Features that require Claude to spontaneously remember to call them are less valuable than features triggered by hooks.
- **Can it be added later without pain?** If yes, deferral is fine. If adding later requires migration/refactoring, build it now.

## Key Questions to Resolve

These are the judgment calls that need human input:

1. **Phase 5 (JSONL sync) — cut or keep?** The reviewer's case is strong, but the synthesis document originally positioned JSONL as a key architectural strength borrowed from Beads. Is the "rebuild from JSONL" safety net worth 1,200 lines?

2. **MVP scope — Phase 1+2 or Phase 1+2+3a?** Adding session continuity to the MVP means building the plugin hooks before shipping. Is that acceptable, or should the MVP be pure CLI first?

3. **`UserPromptSubmit` hook — add to spec?** This is a genuinely novel suggestion not in v0.2. It would inject a lightweight status line on every human prompt. Higher value than many existing features. But it also means Claude sees workflow state continuously, which could influence its behaviour in subtle ways.

4. **Reflections — cut or simplify?** The reviewer argues reflections are high-ceremony, low-value. The synthesis argues they capture "knowing everything you know now" insights. Which framing is right for this workflow?

5. **Dependency types — 4 or 7?** The reviewer says `validates`, `duplicates`, `supersedes` have no demonstrated consumer. But `validates` links verification to implementation, and `supersedes` tracks plan evolution. Are these genuinely unused, or are they core to the verification and planning workflows?

## Background Files (Reference Only)

These informed the spec but don't need re-reading unless a specific question arises:

- `.planning/research/wf-spec-v0.1.md` — Original spec (841 lines)
- `.planning/research/wf-spec-research.md` — Research findings (487 lines)
- `.planning/research/synthesis-output-terminal.md` — Full synthesis (1,013 lines)
- `.planning/research/wf-spec-research/` — Individual research outputs (5 files)
- `/Users/liamj/Documents/development/bid-manager/.planning/research/claude-capabilities/claude-capabilities-new-in-opus-4-6.md` — Opus 4.6 capabilities

## Constraints

- All code is written by Claude — verbose is fine if it prevents ambiguity
- The tool is for a human-AI pair using Claude Code, not a team of human developers
- Local-only tool: single machine, single user
- Go language, pure Go SQLite (`modernc.org/sqlite`), Kong v1.0 CLI framework, minimal dependencies
