# Session: `wf` Tool — Spec Review & Iteration

## What This Is

We are building `wf` — a Go CLI tool for structured workflow management in Claude Code sessions. It provides queryable task state, atomic multi-agent coordination, session continuity, verification capture, and structured learning, backed by SQLite shared across git worktrees.

This is the first build session. We have a v0.1 spec ready for review and iteration. The tool will be built in a **new repo** (not in this bid-manager repo — that's just where the research lives).

## The Problems It Solves

The tool addresses 7 specific problems in the current workflow:

1. **Session fragmentation** — Early tasks forgotten, dependencies tracked in prose
2. **Unstructured state** — Markdown plans can't be queried
3. **Lost discoveries** — Bugs found during work aren't tracked with provenance
4. **Session persistence** — Re-prompting between sessions is expensive and lossy
5. **Multi-agent coordination** — No atomic claiming, duplicated work possible
6. **No semantic audit trail** — Git blame doesn't provide semantic understanding
7. **Context loss on compaction** — Auto-compact loses critical information

These problems drive every design decision in the spec. If a feature seems over-engineered, check which problem(s) it addresses.

## The Workflow

Human-AI pair, 12-14 hours/day. Heavy subagent usage (70-150/day). The pattern:

- Main session Claude orchestrates, dispatches subagents
- 3-5 parallel worktrees for concurrent implementation
- Four-eyes verification (separate agent verifies each implementation)
- "Knowing everything you know now" simplification checkpoint after implementation
- Staff engineer subagent reviews plans before implementation
- Mistakes captured in CLAUDE.md to prevent recurrence
- Work spans multiple sessions, sometimes autonomous overnight

## Background (Don't Re-Read Unless Needed)

The spec was synthesised from analyses of two existing tools (Beads and Task Master). The synthesis and comparison documents are in this repo for reference only — the spec is the authoritative document:

**Design context:** The spec is a deliberate hybrid of both synthesis approaches. The "terminal" version's structural investments (`.git/workflow/` storage, dedicated verification/reflection tables, `acceptance_criteria` and `relevant_files` as proper fields) were chosen because Problem 2 is literally about unstructured state — putting important data in a metadata blob would partially recreate that problem. The "API" version's pragmatism informed the phasing and scope (deferring the lessons table, targeting ~3,500-4,000 lines rather than ~5,600).

- Research location: `.planning/research/workflow-tools/`
- `synthesis-output-terminal.md` — Full synthesis with comparisons (1,013 lines, reference only)
- `synthesis-output-api.md` — Alternative leaner synthesis (563 lines, reference only)
- `beads-analysis-output.md` — Beads analysis (reference only)
- `task-master-analysis-output.md` — Task Master analysis (reference only)

## Read This File

**The spec:** `.planning/research/workflow-tools/wf-spec-v0.1.md` (~840 lines)

This is the document we're iterating on. Read it fully before doing anything else.

## Session Goals

### 1. Review the User's Open Points

The following points were raised at the end of the previous session and need addressing:

#### a) Worktree Creation/Management

The spec describes storage in `.git/workflow/` which is shared across worktrees, and atomic claiming so agents in different worktrees don't conflict. But it doesn't document:
- How worktrees are created for `wf` work (manually? by the orchestrator? by a skill?)
- Whether `wf` itself needs any worktree awareness (e.g., knowing which worktree an agent is in)
- How worktree lifecycle interacts with `wf` (what happens when a worktree is removed?)

**Action:** Review the spec and either add a section on worktree interaction, or document why `wf` deliberately doesn't manage worktrees (i.e., that's Claude Code's / the human's responsibility, and `wf` only cares about the shared SQLite).

Note: there is a `using-git-worktrees` skill available which handles worktree creation. Consider whether `wf` needs to integrate with this or remain independent.

#### b) PRD-to-Issues Conversion (equivalent to `ralph-tui-create-beads`)

There is an existing skill called `ralph-tui-create-beads` that converts PRDs to structured tasks (beads) for autonomous execution. It:
- Extracts quality gates from a PRD
- Creates an epic with child tasks
- Sets up dependencies (schema → backend → UI ordering)
- Right-sizes stories for single-agent-context completion
- Appends quality gates to acceptance criteria

**Question:** Does `wf` need an equivalent? The spec has `wf bulk-create` which accepts JSON stdin, but there's no documented workflow for "take a plan/spec and decompose it into issues." Options:
1. Build a `wf import-plan` command that accepts markdown and creates issues
2. Build a Claude Code skill (like `ralph-tui-create-beads`) that calls `wf create` commands
3. Leave it to the orchestrator Claude to do conversationally (create issues one by one)
4. Some combination

**Action:** Make a recommendation and document it in the spec.

#### c) Workflow Diagram

Should we create a visual workflow diagram at this stage showing the full lifecycle? E.g.:
- Issue creation → claiming → implementation → verification → reflection → done
- Session start (resume) → work → checkpoint → session end
- Discovery during work → new issue creation with provenance

**Action:** Consider whether a mermaid diagram in the spec would help identify gaps or sequencing issues before we build.

### 2. Research Open Questions

The spec has an "Open Questions" section. Use the available tools to research and resolve as many as possible:

- **SQLite WAL mode across git worktrees on macOS** — Does sharing a single SQLite file via `.git/` work reliably with concurrent access from multiple worktrees? Research SQLite documentation and known issues.
- **Claude Code plugin hooks** — Do `SessionStart` and `PreCompact` hooks work as assumed? Can hook output inject context into the session? Research Claude Code plugin documentation.
- **`claimed` vs `in_progress` distinction** — Is a separate `claimed` status worth the overhead, or should claiming go straight to `in_progress`?
- **Pure Go SQLite (`modernc.org/sqlite`) vs CGo (`mattn/go-sqlite3`)** — Performance, reliability, WAL support in pure Go. What's the current state?
- **Cobra CLI framework** — Still the right choice for Go CLIs? Any lighter alternatives worth considering?

**Available research tools:**
- Context7 MCP (resolve-library-id → query-docs for library documentation)
- DeepWiki MCP (read_wiki_structure → read_wiki_contents for GitHub repos)
- Web search and web fetch
- The Go-specific skills: `golang-patterns`, `golang-testing`, `go-concurrency-patterns`

### 3. Iterate on the Spec

After reviewing the points above and researching the open questions, update `wf-spec-v0.1.md` with:
- Answers to resolved open questions (move from "Open Questions" to the relevant spec section)
- Any new sections needed (worktree interaction, plan import workflow, etc.)
- A workflow diagram if deemed valuable
- Any corrections or gaps found during review

Save as `wf-spec-v0.2.md` (keep v0.1 for reference).

## Available Plugins & Skills

These are available during this session and will be available during the build:

**Plugins:**
- `plugin-dev` — hook-development, plugin-structure, plugin-settings skills (for designing the Claude Code plugin component)
- `gopls-lsp` — Go language server for code intelligence
- `pr-review-toolkit` — PR review
- `hookify` — Hook creation
- `code-simplifier` — Code simplification
- `commit-commands` — Git commit/push/PR workflows
- `security-guidance` — Security best practices and analysis
- `context7` — Library documentation lookup (MCP)
- `deepwiki` — GitHub repo documentation (MCP)

**Skills:**
- `golang-patterns` — Idiomatic Go patterns and best practices
- `golang-testing` — Go testing patterns (table-driven, benchmarks, fuzzing)
- `go-concurrency-patterns` — Goroutines, channels, sync primitives
- `using-git-worktrees` — Worktree creation and management
- `writing-plans` — Plan creation before coding
- `test-driven-development` — TDD workflow

**Utility:**
- Subagent output recovery: `python3 ~/.claude/tools/parse-subagents.py <session-uuid> <output-dir>`

## Dev Config

There is a shared dev config at `/Documents/development/tw-group-dev-config/` but it's Node.js/TypeScript focused (eslint, prettier, tsconfig). Since this is a Go project, it won't be directly applicable. We'll need Go-specific tooling:
- `golangci-lint` for linting
- `go test` for testing
- `gofumpt` or `goimports` for formatting
- Standard Go project layout

## Repo Setup Note

The `wf` tool will be built in a **new repo**, not in the bid-manager repo. The new repo should be created at session start. Suggested location: `/Documents/development/wf/` or wherever the user prefers.

## Important Constraints

- **All code is written by Claude.** Implementation cost is tokens, not human time. So err on the side of clarity in the spec — verbose is fine if it prevents ambiguity.
- **The tool is for a human-AI pair using Claude Code.** Not a team of human developers. The CLI is called by Claude via `tool_use`, not typed by humans.
- **This is a local-only tool.** Single machine, single user (human + their Claude sessions). No auth, no network, no cloud.
- **Go language.** Pure Go SQLite (`modernc.org/sqlite` preferred). Minimal dependencies.
- **The human user describes themselves as non-technical.** Explanations should be in plain language, not assume engineering background. Use analogies and "why it matters to you" framing when discussing design choices.
