# Capabilities Extension Audit

**Date:** 2026-02-14
**Source document:** `.planning/source-context/claude-code-capabilities-extension-options.md`
**Audit scope:** Cross-reference source doc against current Claude Code documentation (Feb 2026)

---

## Executive Summary

The source document is the current official Claude Code "Extend Claude Code" overview page. It is an **overview page by design** — it summarises each extension mechanism and links out to dedicated pages with substantially more detail. For the playbook decision tree, the overview content alone is insufficient — significant capabilities documented on the individual feature pages are not surfaced in the overview. This audit catalogues everything found on those deeper pages that the overview omits or understates.

### Key Consideration for the Playbook Decision Tree

The playbook serves **two distinct user groups** with different tool access:

- **Non-technical users** (claude.ai and Claude Desktop, with CoWork coming soon): Need guidance on skills, projects, and admin-provisioned features. Will not use Claude Code, subagents, hooks, or direct MCP configuration.
- **Technical users** (Claude Code + claude.ai/Claude Desktop): Need the full decision tree including CLAUDE.md, skills, commands, subagents, agent teams, hooks, MCP, and plugins.

The decision tree must clearly distinguish which features are available on which platforms, and route users to the right guidance based on their toolset. Not all extension mechanisms are relevant to non-technical users.

---

## Feature-by-Feature Audit

### 1. CLAUDE.md (Memory)

**Source doc accuracy:** Correct.

| Claim | Status |
|-------|--------|
| Persistent context loaded every session | Correct |
| `@path` imports supported | Correct |
| Keep under ~500 lines | Correct (recommended guideline) |
| Additive layering across levels | Correct |
| Subdirectory CLAUDE.md discovered as you work in them | Correct |

**Details not in source doc (from Memory page):**
- CLAUDE.md files from `--add-dir` directories are NOT loaded by default; requires `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`.
- Managed/enterprise-level CLAUDE.md is available for org-wide policies.

### 2. Skills

**Source doc accuracy:** Correct.

| Claim | Status |
|-------|--------|
| Reusable instructions, knowledge, workflows | Correct |
| Invocable via `/<name>` or auto-loaded by Claude | Correct |
| Descriptions load at session start, full content on use | Correct |
| `disable-model-invocation: true` hides from Claude | Correct |
| `context: fork` runs in subagent | Correct |
| Skills can preload into subagents | Correct |

**Details not in source doc (from Skills page):**
- Skills follow the [Agent Skills](https://agentskills.io) open standard (cross-tool compatibility).
- `user-invocable: false` hides skill from `/` menu (only Claude can invoke).
- `allowed-tools` field restricts tool access when skill is active.
- `model` field overrides the model when the skill is active.
- `agent` field specifies which subagent type to use with `context: fork`.
- `hooks` field allows scoping hooks to a skill's lifecycle.
- Dynamic context injection with `!`command`` syntax (shell pre-processing).
- String substitutions: `$ARGUMENTS`, `$ARGUMENTS[N]`, `$N`, `${CLAUDE_SESSION_ID}`.
- `argument-hint` field for autocomplete hints.
- Skill description character budget: 2% of context window, fallback 16,000 chars. Overridable via `SLASH_COMMAND_TOOL_CHAR_BUDGET`.
- Nested `.claude/skills/` discovered automatically from subdirectories (monorepo support).
- Skills from `--add-dir` directories are loaded and support live change detection.
- Custom slash commands (`.claude/commands/`) have been merged into skills; both paths work, but skills take precedence on name collision.
- Skills can bundle scripts (e.g., Python) for visual output (HTML generation).
- Skill permission rules: `Skill(name)` exact match, `Skill(name *)` prefix match.

### 3. Subagents

**Source doc accuracy:** Correct.

| Claim | Status |
|-------|--------|
| Isolated worker with own context | Correct |
| Results return as summary to main context | Correct |
| Custom subagents can preload skills | Correct |
| Context isolation prevents bloating main session | Correct |

**Details not in source doc (from Subagents page):**
- **Built-in subagents:** Explore (Haiku, read-only), Plan (inherits model, read-only), general-purpose (inherits model, all tools), Bash (inherits), statusline-setup (Sonnet), Claude Code Guide (Haiku).
- **Model selection:** `sonnet`, `opus`, `haiku`, or `inherit`.
- **Permission modes:** `default`, `acceptEdits`, `delegate`, `dontAsk`, `bypassPermissions`, `plan`.
- **`disallowedTools` field** for deny-listing specific tools.
- **`Task(agent_type)` syntax** to restrict which subagent types can be spawned.
- **`maxTurns` field** to cap agentic turns.
- **`memory` field** for persistent cross-session memory (`user`, `project`, `local` scopes).
- **`mcpServers` field** for per-subagent MCP server access.
- **`hooks` field** for lifecycle hooks scoped to the subagent.
- **Scope/priority:** CLI flag > project > user > plugin (managed overrides all).
- **CLI-defined subagents** via `--agents` JSON flag (session-only, not saved to disk).
- **Foreground vs background execution**: background subagents run concurrently; permission pre-approval upfront; MCP tools unavailable in background.
- **Resumable subagents**: `resume` retains full conversation history.
- **Auto-compaction**: subagents support auto-compaction at ~95% capacity (configurable via `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`).
- **Cannot spawn other subagents** (no nesting).

### 4. Agent Teams

**Source doc accuracy:** Correct.

| Claim | Status |
|-------|--------|
| Experimental, disabled by default | Correct |
| Coordinate multiple independent Claude Code sessions | Correct |
| Shared task list with self-coordination | Correct |
| Teammates message each other directly | Correct |
| Higher token cost than subagents | Correct |

**Details not in source doc (from Agent Teams page):**
- **Enable:** `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in settings.json or environment.
- **Display modes:** in-process (Shift+Up/Down) and split panes (requires tmux or iTerm2).
- **Teammate mode settings:** `teammateMode` in settings.json; `--teammate-mode` CLI flag.
- **Plan approval:** teammates can be required to plan before implementing; lead approves/rejects.
- **Delegate mode:** (Shift+Tab) restricts lead to coordination-only tools.
- **Task dependencies:** tasks can depend on other tasks; auto-unblock on completion.
- **Task claiming:** file-locking prevents race conditions.
- **New hook events:** `TeammateIdle` and `TaskCompleted` for quality gates.
- **Architecture components:** Team lead, Teammates, Task list, Mailbox.
- **Storage:** `~/.claude/teams/{team-name}/config.json` and `~/.claude/tasks/{team-name}/`.
- **Permissions:** teammates inherit lead's permission settings.
- **Known limitations (current):**
  - No session resumption with in-process teammates.
  - Task status can lag (teammates may not mark tasks complete).
  - One team per session.
  - No nested teams.
  - Lead is fixed (cannot transfer leadership).
  - Split panes not supported in VS Code terminal, Windows Terminal, or Ghostty.

### 5. MCP (Model Context Protocol)

**Source doc accuracy:** Correct.

| Claim | Status |
|-------|--------|
| Connect to external services | Correct |
| Tool search loads up to 10% of context | Correct |
| Override by name: local > project > user | Correct |
| Can fail silently mid-session | Correct |

**Details not in source doc (from MCP/Hooks pages):**
- MCP tools follow naming pattern `mcp__<server>__<tool>`.
- MCP tools can be matched in hooks with regex patterns (e.g., `mcp__memory__.*`).
- MCP tools are NOT available in background subagents.
- `updatedMCPToolOutput` in PostToolUse hooks can replace MCP tool output.

### 6. Hooks

**Source doc accuracy:** Correct.

| Claim | Status |
|-------|--------|
| Deterministic scripts on events | Correct |
| Run outside the agentic loop | Correct |
| Zero context cost unless returning output | Correct |
| All registered hooks fire (merge behavior) | Correct |

**Details not in source doc (from Hooks reference page):**
- **Complete event list (14 events):**
  1. `SessionStart` (matcher: startup/resume/clear/compact)
  2. `UserPromptSubmit` (no matcher)
  3. `PreToolUse` (matcher: tool name)
  4. `PermissionRequest` (matcher: tool name)
  5. `PostToolUse` (matcher: tool name)
  6. `PostToolUseFailure` (matcher: tool name)
  7. `Notification` (matcher: notification type)
  8. `SubagentStart` (matcher: agent type)
  9. `SubagentStop` (matcher: agent type)
  10. `Stop` (no matcher)
  11. `TeammateIdle` (no matcher) -- **new for agent teams**
  12. `TaskCompleted` (no matcher) -- **new for agent teams**
  13. `PreCompact` (matcher: manual/auto)
  14. `SessionEnd` (matcher: reason)
- **Three hook handler types:** `command`, `prompt` (LLM-evaluated), `agent` (subagent with tool access).
- **Async hooks:** `async: true` runs hooks in background without blocking.
- **Exit code semantics:** 0 = success, 2 = blocking error, other = non-blocking error.
- **JSON decision control:** `permissionDecision` (allow/deny/ask), `updatedInput`, `additionalContext`.
- **`CLAUDE_ENV_FILE`:** SessionStart hooks can persist environment variables for the session.
- **`$CLAUDE_PROJECT_DIR` and `${CLAUDE_PLUGIN_ROOT}`** for portable script paths.
- **`once` field:** run only once per session (skills/agents only).
- **Hooks in skills and agents:** defined in YAML frontmatter, scoped to component lifecycle.
- **`/hooks` menu** for interactive management.
- **`disableAllHooks: true`** to temporarily disable all hooks.
- **Hot-reload protection:** hooks captured at startup; mid-session modifications require review.
- **`allowManagedHooksOnly`:** enterprise setting to block user/project/plugin hooks.

### 7. Plugins

**Source doc accuracy:** Correct.

| Claim | Status |
|-------|--------|
| Bundle skills, hooks, subagents, MCP servers | Correct |
| Namespaced skills (`/plugin:skill`) | Correct |
| Installable units for cross-repo reuse | Correct |

**Details not in source doc (from Plugins page):**
- **Plugin structure:**
  - `.claude-plugin/plugin.json` (manifest)
  - `commands/` (skills as markdown)
  - `skills/` (Agent Skills with SKILL.md)
  - `agents/` (custom agent definitions)
  - `hooks/` (hooks.json)
  - `.mcp.json` (MCP server configs)
  - `.lsp.json` (LSP server configs) -- **new component type**
- **LSP servers:** plugins can bundle Language Server Protocol configurations for code intelligence (jump to definition, find references, type info, diagnostics). This is a **new extension mechanism** not mentioned in the source doc's overview.
- **Plugin manifest fields:** name, description, version, author, homepage, repository, license, keywords.
- **Development/testing:** `--plugin-dir` flag for local testing.
- **Multiple plugin loading:** `--plugin-dir` can be specified multiple times.
- **Migration path:** standalone `.claude/` configs can be converted to plugins.
- **`strict` field in marketplace entries:** controls whether marketplace component fields merge with or replace plugin.json.

### 8. Marketplaces

**Source doc accuracy:** Correct.

| Claim | Status |
|-------|--------|
| Host and distribute plugin collections | Correct |

**Details not in source doc (from Marketplaces & Discover Plugins pages):**
- **Official Anthropic marketplace** (`claude-plugins-official`) auto-available at startup.
- **Demo marketplace** (`anthropics/claude-code` on GitHub) available for manual add.
- **Marketplace sources:** GitHub repos, Git URLs, local paths, remote URLs.
- **Installation scopes:** User, Project, Local, Managed.
- **Auto-updates:** configurable per marketplace; official marketplaces auto-update by default.
- **Private repository support:** uses git credential helpers; background auto-updates need env tokens (`GITHUB_TOKEN`, `GITLAB_TOKEN`, `BITBUCKET_TOKEN`).
- **Team configuration:** `extraKnownMarketplaces` and `enabledPlugins` in `.claude/settings.json`.
- **`strictKnownMarketplaces`:** managed setting to restrict allowed marketplace sources (allowlist/lockdown).
- **Reserved marketplace names:** certain names reserved for official Anthropic use.
- **Plugin validation:** `claude plugin validate .` or `/plugin validate .`.
- **Plugin manager UI:** `/plugin` with Discover, Installed, Marketplaces, Errors tabs.
- **Official plugin categories:**
  - Code intelligence (LSP plugins for 11+ languages)
  - External integrations (GitHub, GitLab, Slack, Jira, Linear, Notion, Figma, Vercel, Firebase, Supabase, Sentry, Asana)
  - Development workflows (commit-commands, pr-review-toolkit, agent-sdk-dev, plugin-dev)
  - Output styles (explanatory, learning)

---

## New Extension Mechanisms Not in Source Doc

### 1. LSP (Language Server Protocol) Servers

**Status:** Production feature (not experimental). Available via plugins.

LSP is a new plugin component type that gives Claude real-time code intelligence:
- Automatic diagnostics after every file edit (type errors, missing imports, syntax issues).
- Code navigation: jump to definitions, find references, hover type info, list symbols, find implementations, trace call hierarchies.
- Configured via `.lsp.json` in plugin root.
- Official plugins available for 11+ languages (TypeScript, Python, Rust, Go, Java, Kotlin, C/C++, PHP, Ruby, C#, Swift).
- Community plugins extend to additional languages (Bash, Clojure, Dart, Elixir, Gleam, Lua, Nix, OCaml, Terraform, YAML, Zig).

**Recommendation:** LSP should be mentioned in the source doc's plugin description and possibly in the "Match features to your goal" table, as it represents a distinct category of extension beyond skills/hooks/MCP.

### 2. Prompt-Based and Agent-Based Hooks

**Status:** Production feature.

Hooks now support three handler types, not just shell commands:
- `type: "command"` -- shell command (original)
- `type: "prompt"` -- single-turn LLM evaluation (returns `{ok: true/false}`)
- `type: "agent"` -- multi-turn subagent with tool access (Read, Grep, Glob)

These are significant because they allow LLM-powered quality gates without writing scripts.

**Recommendation:** Worth noting in any decision tree, as it bridges the gap between deterministic hooks and skill-based workflows.

### 3. Subagent Persistent Memory

**Status:** Production feature.

Subagents can now have a `memory` field enabling persistent cross-session learning:
- Scopes: `user` (all projects), `project` (shareable via VCS), `local` (gitignored).
- Memory directory with `MEMORY.md` entrypoint.
- First 200 lines of MEMORY.md injected into system prompt.

**Recommendation:** This is a meaningful extension for building institutional knowledge over time. Worth including in decision guidance.

### 4. Checkpointing

**Status:** Production feature. Not an extension mechanism per se, but a safety feature that enables more ambitious use of extensions.

- Automatic code state capture before each edit.
- Rewind via Esc+Esc or `/rewind`.
- Does NOT track files modified by bash commands.
- Session-level recovery only (not a replacement for git).

**Recommendation:** Not an extension mechanism, so absence from the source doc is appropriate. But useful context for playbook recommendations ("use checkpointing when running aggressive subagent/team workflows").

---

## Comparison Table Audit

### Skill vs Subagent Table
**Status:** Current and accurate. No changes needed.

### CLAUDE.md vs Skill Table
**Status:** Current and accurate. No changes needed.

### Subagent vs Agent Team Table
**Status:** Current and accurate. Note still correctly states agent teams are experimental.

### MCP vs Skill Table
**Status:** Current and accurate. No changes needed.

### Context Cost Table
**Status:** Current and accurate. All loading strategies and cost descriptions match the live documentation.

### Feature Layering Rules
**Status:** Current and accurate. Priority order for each feature type matches docs.

### Combine Features Table
**Status:** Current and accurate. All four patterns (Skill+MCP, Skill+Subagent, CLAUDE.md+Skills, Hook+MCP) match.

---

## Agent Teams Updates Since Source Doc

Agent teams remain **experimental and disabled by default**. Based on the current documentation:

1. The feature is available via `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`.
2. Two new hook events (`TeammateIdle`, `TaskCompleted`) have been added specifically for agent team quality gates.
3. Known limitations are well-documented (no session resumption, one team per session, no nested teams, fixed lead, limited split-pane terminal support).
4. Bug fixes have been applied (wrong model identifiers for Bedrock/Vertex/Foundry, hook exit code 2 stderr display).
5. No indication of graduating from experimental status imminently.

---

## Plugin/Marketplace Ecosystem Updates

1. **Official Anthropic marketplace** (`claude-plugins-official`) is now built-in and auto-available.
2. **9,000+ plugins** reported across community marketplaces (ClaudePluginHub, Claude-Plugins.dev, Anthropic's Marketplace).
3. **Managed marketplace restrictions** via `strictKnownMarketplaces` for enterprise lockdown.
4. **Auto-update system** with per-marketplace toggles and environment variable overrides.
5. **LSP plugins** are a significant new category in the official marketplace.
6. **External integration plugins** cover major services (GitHub, GitLab, Slack, Jira, Linear, Notion, Figma, Vercel, Firebase, Supabase, Sentry, Asana).

---

## Recommendations for Playbook Decision Tree

### 1. The source doc is a solid foundation but needs supplementation

The overview page is designed as a routing document ("which extension should I use?"), not a comprehensive reference. A playbook decision tree should incorporate details from the individual feature pages, particularly:

- Skill frontmatter options (`disable-model-invocation`, `user-invocable`, `allowed-tools`, `context: fork`, `agent`, `hooks`, `model`)
- Subagent configuration options (model selection, permission modes, memory, background execution)
- Hook handler types (command vs prompt vs agent)
- Plugin component types (now including LSP alongside skills, hooks, agents, MCP)

### 2. Decision tree should cover these key branch points

- **"Do I need this always or sometimes?"** --> CLAUDE.md (always) vs Skill (sometimes)
- **"Is this knowledge or a connection?"** --> Skill (knowledge) vs MCP (connection)
- **"Does the task need isolation?"** --> Subagent (yes, simple) vs Agent team (yes, needs coordination)
- **"Is this deterministic or needs judgment?"** --> Hook/command (deterministic) vs Hook/prompt or Hook/agent (needs judgment)
- **"Am I sharing this beyond this project?"** --> Plugin (yes) vs standalone config (no)
- **"Does the task produce verbose output?"** --> Subagent (keeps main context clean)
- **"Do workers need to talk to each other?"** --> Agent team (yes) vs parallel subagents (no)
- **"Do I need code intelligence?"** --> LSP plugin
- **"Do I need persistent learning?"** --> Subagent with memory field

### 3. Note these gotchas for the playbook

- Subagents cannot spawn other subagents (no nesting).
- MCP tools are NOT available in background subagents.
- Skills from `--add-dir` need a separate env var for CLAUDE.md loading.
- Skill description budget (2% of context) can cause skills to be excluded silently.
- Hook modifications mid-session require review in `/hooks` menu (security protection).
- Agent teams are still experimental with meaningful limitations.
- LSP support is still raw (bugs reported, no UI indication of server status).

### 4. Context cost guidance for the playbook

| Feature | Cost Profile | Mitigation |
|---------|-------------|------------|
| CLAUDE.md | Fixed per-request cost | Keep under 500 lines |
| Skills (model-invocable) | Low baseline (descriptions) + burst when used | Use `disable-model-invocation: true` for manual-only skills |
| Skills (manual-only) | Zero until invoked | Best for side-effect skills |
| MCP servers | 10% of context (with tool search) | Disconnect unused servers; check with `/mcp` |
| Subagents | Zero on main context (isolated) | Use for verbose/exploratory work |
| Hooks (command) | Zero unless returning context | Ideal for side effects |
| Hooks (prompt/agent) | Small per-invocation cost | Use for judgment-based quality gates |
| Agent teams | High (N separate contexts) | Reserve for genuinely parallel work |

---

## Conclusion

The source document is an **exact copy of the current live documentation** and requires no corrections. It accurately represents all extension mechanisms and their relationships as of February 2026.

For the playbook, the main gap is **depth, not accuracy**. The source doc is an overview that routes users to detailed pages. The playbook decision tree should incorporate the richer configuration options, new features (LSP, prompt/agent hooks, persistent memory), and practical gotchas documented on the individual feature pages, as catalogued in this audit.
