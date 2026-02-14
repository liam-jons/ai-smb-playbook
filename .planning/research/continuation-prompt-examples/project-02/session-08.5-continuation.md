# Session 08.5b: Validate and Integrate Pre-Implementation Artifacts

## Context

Sessions 01-07 produced the wf spec through v1.0. Session 08 prepared the implementation plan and addenda. Session 08.5 built the pre-implementation scaffold: a Claude Code plugin (`wf-plugin/`), test fixtures for end-to-end validation (`frs-issues.json`, `frs-test-plan.md`, `frs-prd.md`, `frs-spec.md`), a tools addendum, and all supporting reference documents (command reference, bulk-create schema, worked examples). Session 09 is the actual Phase 1 implementation.

This session validates every artifact from 08.5 before implementation begins. Nothing ships to Session 09 without passing automated validation and manual quality review.

**Repo:** `/Users/liamj/Documents/development/workflow/`

**Implementation status:** Not started. The repo contains only planning documents and the plugin scaffold.

---

## Spec Documents

| Document | Path | Purpose |
|----------|------|---------|
| `wf-spec-reference.md` | `.implementation/wf-spec-reference.md` | Quick-ref data model, status model, command table |
| `wf-spec-commands.md` | `.implementation/wf-spec-commands.md` | Full command specifications |
| `wf-spec-technical.md` | `.implementation/wf-spec-technical.md` | Schema, storage, plugin, implementation details |
| `wf-spec-v1.0.md` | `.implementation/wf-spec-v1.0.md` | Full canonical spec (~78KB) |
| Session 09 continuation | `.implementation/continuation-prompts/session-09-continuation.md` | Phase 1 implementation plan |
| Tools addendum | `.implementation/continuation-prompts/session-09-tools-addendum.md` | Available tools per phase |

---

## File Inventory (Session 08.5 Artifacts)

These are the artifacts that need validation and integration:

```
.planning/
  test-fixtures/
    ...

.implementation/
  wf-spec-*.md           # Spec files (moved from .planning/)
  continuation-prompts/  # Session prompts (moved from .planning/)
    frs-prd.md              # Flashcard Review System -- PRD format (348 lines)
    frs-spec.md             # Flashcard Review System -- Spec format (705 lines)
    frs-issues.json         # Pre-built wf bulk-create JSON, 10 issues, DAG validated (131 lines)
    frs-test-plan.md        # Step-by-step test execution with expected outcomes (1,067 lines)
  continuation-prompts/
    session-09-tools-addendum.md  # Tool availability for implementers (53 lines)

wf-plugin/
  .claude-plugin/
    plugin.json             # Plugin manifest (8 lines)
  hooks/
    hooks.json              # Hook definitions for 5 events (65 lines)
  scripts/
    wf-resume.sh            # SessionStart hook -- wf resume + PRIME.md fallback (39 lines)
    wf-checkpoint.sh        # PreCompact/SessionEnd hook (28 lines)
    wf-status-line.sh       # UserPromptSubmit hook -- oneline status (20 lines)
    wf-agent-done.sh        # SubagentStop hook -- agent completion event (40 lines)
  skills/
    wf-workflow/
      SKILL.md              # Procedural workflow guide (302 lines)
      references/
        wf-command-reference.md  # Condensed command spec (402 lines)
    wf-import-plan/
      SKILL.md              # Spec/PRD -> issues conversion (176 lines)
      references/
        bulk-create-schema.md    # JSON schema reference (185 lines)
        example-spec-import.md   # Worked example: spec -> issues (256 lines)
        example-prd-import.md    # Worked example: PRD -> issues (261 lines)
  commands/
    wf.md                   # /wf slash command (115 lines)
  prime-template.md         # PRIME.md content (~350 tokens, 47 lines)
```

---

## Task Breakdown

### Part 1: Plugin Structure Validation (use plugin-dev tools)

Run these four validations. They are independent of each other and can be run **in parallel**.

#### 1A: Validate Plugin Structure

Use `plugin-dev:plugin-validator` on the plugin root.

**What to validate:**
- Plugin root: `/Users/liamj/Documents/development/workflow/wf-plugin/`
- `plugin.json` exists at `.claude-plugin/plugin.json` with valid fields
- `hooks.json` path resolves correctly relative to plugin root
- Commands directory contains `.md` files
- Skills directory structure has valid `SKILL.md` files with frontmatter
- All paths referenced in `plugin.json` (hooks, commands, skills) resolve

**What to look for:**
- Missing required fields in plugin.json (name, description, version)
- Broken relative path references
- Invalid JSON syntax
- Directory structure violations

**If issues found:** Fix them directly, re-run validator to confirm.

#### 1B: Review Both Skill Files

Use `plugin-dev:skill-reviewer` on each skill.

**Skills to review:**
1. `wf-plugin/skills/wf-workflow/SKILL.md`
2. `wf-plugin/skills/wf-import-plan/SKILL.md`

**What to look for:**
- Trigger effectiveness: Are the trigger phrases in the frontmatter likely to match real user intent? Are there missing triggers?
- Description quality: Does the `description` field accurately convey when the skill should activate?
- Content quality: Is the skill content actionable and accurate?
- Reference file usage: Do the `references/` paths resolve? Are references mentioned in the skill body?
- Best practices: Proper frontmatter YAML, clear structure, no stale content

**If issues found:** Apply fixes, re-run reviewer.

#### 1C: Verify Hook Scripts

Use `plugin-dev:hook-development` to verify the hook configuration.

**Files to validate:**
- `wf-plugin/hooks/hooks.json` -- Hook definitions
- `wf-plugin/scripts/wf-resume.sh` -- SessionStart
- `wf-plugin/scripts/wf-checkpoint.sh` -- PreCompact, SessionEnd
- `wf-plugin/scripts/wf-status-line.sh` -- UserPromptSubmit
- `wf-plugin/scripts/wf-agent-done.sh` -- SubagentStop

**What to look for:**
- Correct event type names in hooks.json (SessionStart, UserPromptSubmit, PreCompact, SessionEnd, SubagentStop)
- Timeouts are reasonable (10s for DB operations, 5s for status line)
- Scripts use `set -euo pipefail` for safe execution
- Graceful degradation: all scripts should exit 0 if `wf` is not installed or workflow not initialized
- `${CLAUDE_PLUGIN_ROOT}` used correctly for script paths
- `${CLAUDE_SESSION_ID}` and `${CLAUDE_PROJECT_DIR}` referenced correctly where needed
- Error suppression via `2>/dev/null || true` on wf commands that may fail in normal operation
- The wf-agent-done.sh correctly reads stdin JSON (hook input) and extracts agent metadata
- The wf-checkpoint.sh correctly accepts SOURCE from env var
- No hardcoded paths

**If issues found:** Fix scripts and/or hooks.json, re-validate.

#### 1D: Verify the /wf Slash Command

Use `plugin-dev:command-development` to verify the command file.

**File:** `wf-plugin/commands/wf.md`

**What to look for:**
- Valid frontmatter: `allowed-tools`, `description`, `argument-hint`
- The `allowed-tools` list includes `Bash(wf:*)` for wf command execution
- Dynamic context injection (`!` syntax) works: `!`wf status --brief`` should inject status output
- The `$ARGUMENTS` section handles all documented argument patterns:
  - No arguments: show overview + command table
  - Command name arguments (e.g., "verify", "claim", "bulk-create"): detailed help
  - "status" argument: runs `wf status`
- All 24 commands are listed in the command tables (Phase 1-4)
- Flag documentation for each command in the $ARGUMENTS section is accurate against the spec
- Cross-reference to wf-workflow skill for procedural guidance

**If issues found:** Fix wf.md, re-validate.

---

### Part 2: Spec Integration Check

Read these files and identify cross-reference gaps:

1. `.implementation/wf-spec-v1.0.md` (full canonical spec)
2. `.implementation/wf-spec-technical.md` (schema, storage, plugin)
3. `.implementation/wf-spec-commands.md` (command specs)
4. `.implementation/wf-spec-reference.md` (quick reference)
5. `.implementation/continuation-prompts/session-09-continuation.md` (Phase 1 plan)

**Questions to answer:**

1. **Test fixtures referenced?** Do any spec docs mention the test fixtures (`frs-issues.json`, `frs-test-plan.md`) so implementers know they exist? If not, add a brief cross-reference to `wf-spec-technical.md` in the implementation section, pointing to `.planning/test-fixtures/` as pre-built validation data.

2. **Plugin scaffold referenced?** Does `wf-spec-technical.md` reference the `wf-plugin/` directory as pre-built Phase 3 scaffold? If not, add a note in the plugin/hooks section pointing to the existing scaffold.

3. **Tools addendum referenced?** Does `session-09-continuation.md` reference `session-09-tools-addendum.md`? If not, add a cross-reference so implementers know about available skills and MCP tools.

4. **Session 09 continuation up to date?** Does `session-09-continuation.md` need updates to reference:
   - Test fixtures for Phase 1 validation (use `frs-issues.json` to test `wf bulk-create`)
   - The plugin scaffold (so Phase 3 implementers know it exists)
   - The tools addendum (so each phase knows what tools are available)

**Action:** Make targeted edits only. Do NOT rewrite sections. Add brief cross-references where gaps exist. Example format:

```markdown
> **Pre-built artifacts:** Test fixtures for end-to-end validation are at `.planning/test-fixtures/`. The plugin scaffold is at `wf-plugin/`. See `session-09-tools-addendum.md` for available development tools.
```

---

### Part 3: Test Fixture Quality Check

Read and validate the test fixtures for internal consistency:

**Files:**
- `.planning/test-fixtures/frs-issues.json`
- `.planning/test-fixtures/frs-test-plan.md`
- `.planning/test-fixtures/frs-prd.md`
- `.planning/test-fixtures/frs-spec.md`

#### 3A: frs-issues.json Schema Compliance

Read `wf-plugin/skills/wf-import-plan/references/bulk-create-schema.md` for the canonical schema.

Verify every issue in `frs-issues.json` against the schema:
- Every non-epic issue has `acceptance_criteria` (required by quality checks in import skill)
- Every issue has `title` (required field)
- `type` values are valid: "epic", "task", "bug", "chore"
- `priority` values are 0-4
- `provisional_id` values are unique across the batch
- `parent` references resolve within the batch (all tasks reference EPIC-1)
- `blocks` references resolve within the batch (T1 blocks T2,T3; T3 blocks T4,T8; T4 blocks T5,T7; etc.)
- No circular dependencies in the `blocks` graph (trace every path)
- `labels` are arrays of strings
- `relevant_files` are arrays of strings with plausible Go file paths

#### 3B: Test Plan Coverage

Read `frs-test-plan.md` and verify it exercises the claimed coverage:

**Coverage matrix -- verify each cell:**

| Feature | Test Step(s) | Present? |
|---------|-------------|----------|
| wf init | 1-2 | |
| wf bulk-create | 3-4 | |
| wf get | 5-6 | |
| wf list (basic) | 7-10 | |
| wf edit (fields) | 11-16 | |
| wf close + cascading unblock | 19-23 | |
| wf link / wf unlink | 24-28 | |
| wf status (3 modes) | 29-32 | |
| wf log | 33-35 | |
| wf backup | 36 | |
| content-hash dedup | 37-38 | |
| wf claim (atomic) | 39-40 | |
| wf claim (parallel) | 41-42 | |
| wf ready | 43-44 | |
| wf discover | 49-51 | |
| stale claim detection | 52-55 | |
| deferred issues | 56-58 | |
| wf assign | 59-61 | |
| wf update | 62-64 | |
| wf claim --next | 65 | |
| wf checkpoint | 66 | |
| wf resume | 67-68 | |
| wf context | 69-70 | |
| wf done | 71-72 | |
| wf verify (approved) | 73-75 | |
| wf verify (rejected) | 76-80 | |
| re-claim/re-approve | 81-84 | |
| wf context --for-verification | 85 | |
| wf delete | 98-103 | |

Confirm the summary claims: 103 steps, all 24 commands exercised, all status transitions tested.

#### 3C: Dependency Graph Consistency

Cross-check the dependency graph across three sources:

1. `frs-issues.json` -- `blocks` fields define the DAG
2. `frs-spec.md` Section 5.3 -- dependency graph in ASCII art
3. `frs-test-plan.md` -- test steps assume certain blocking relationships

All three must be consistent. Specifically:
- T1 blocks T2, T3
- T3 blocks T4, T8
- T4 blocks T5, T7
- T2 blocks T8
- No other blocking edges exist in issues.json

If discrepancies are found, note them and reconcile.

#### 3D: Acceptance Criteria Testability

For each issue in `frs-issues.json`, verify that the `acceptance_criteria` field contains concrete, testable statements (not vague goals). Each criterion should be verifiable by running a command and checking its output. Flag any that say things like "works correctly" without specifying what "correctly" means.

---

### Part 4: Knowledge Artifact Quality Check

Beyond structural validation, verify content accuracy against the v1.0 spec.

#### 4A: PRIME.md Template Accuracy

Read `wf-plugin/prime-template.md` and cross-check against `wf-spec-reference.md`:
- Does the status machine match v1.0 (5 states: open, in_progress, in_review, done, blocked)?
- Are the core command tables accurate (correct flags, correct command names)?
- Are the key rules accurate (atomic claiming, done before verify, exit codes)?
- Is the priority scale correct (0=critical through 4=backlog)?
- Is there any stale v0.5 content that does not match v1.0?

#### 4B: Command Reference Completeness

Read `wf-plugin/skills/wf-workflow/references/wf-command-reference.md` and verify:
- All 24 commands are documented (cross-check against the command table in `wf-spec-reference.md` Section 3.1)
- Commands are grouped by phase (Phase 1: 13 commands, Phase 2: 5 commands, Phase 3: 3 commands, Phase 4: 2 commands, plus wf update which is Phase 2)
- Key flags for each command are listed
- No commands are missing or misattributed to the wrong phase

#### 4C: /wf Command Argument Coverage

Read `wf-plugin/commands/wf.md` and verify the $ARGUMENTS section covers:
- Every command name that could be passed as an argument
- Specifically: create, bulk-create, get, edit, list, delete, close, link, unlink, status, log, backup, claim, ready, assign, update, discover, resume, checkpoint, context, done, verify
- Each command's flag documentation matches the spec (spot-check at least 5 commands against `wf-spec-commands.md`)

#### 4D: Import Skill Worked Examples

Read the worked examples and compare against frs-issues.json:
- `wf-plugin/skills/wf-import-plan/references/example-spec-import.md` -- does the spec decomposition process described here, when applied to `frs-spec.md`, produce issues that align with `frs-issues.json`?
- `wf-plugin/skills/wf-import-plan/references/example-prd-import.md` -- does the PRD decomposition process described here, when applied to `frs-prd.md`, produce issues that align with `frs-issues.json`?

The outputs do not need to be identical, but the structure (epic + tasks, dependency graph, priority ordering) should be consistent. Note any significant divergences.

---

### Part 5: Dry-Run the Import Skill (if time permits)

Test the wf-import-plan skill by simulating its execution:

1. Read `frs-spec.md` as input
2. Follow the decomposition rules in `wf-plugin/skills/wf-import-plan/SKILL.md`
3. Apply the spec path: identify modules, extract phasing, one issue per logical unit
4. Apply the dependency inference rules
5. Run the quality checks (acceptance criteria, DAG validity, priority coherence, no orphans)
6. Compare the resulting decomposition against `frs-issues.json`

Repeat with `frs-prd.md` using the PRD path.

Note discrepancies. If the skill instructions produce significantly different results from the pre-built fixtures, iterate on either the skill instructions or the fixtures to bring them into alignment. The fixtures are the source of truth for the FRS project; the skill instructions should produce equivalent results on equivalent input.

---

### Part 6: Session Continuity

After completing Parts 1-5, create a verification summary:

#### 6A: Verification Checklist

Document what was validated, what passed, and what was fixed:

```markdown
## Validation Results

### Plugin Structure (Part 1)
- [ ] plugin-validator: PASS/FAIL (issues: ...)
- [ ] skill-reviewer (wf-workflow): PASS/FAIL
- [ ] skill-reviewer (wf-import-plan): PASS/FAIL
- [ ] hook-development: PASS/FAIL
- [ ] command-development: PASS/FAIL

### Spec Integration (Part 2)
- [ ] Test fixtures cross-referenced: YES/NO (edit made: ...)
- [ ] Plugin scaffold cross-referenced: YES/NO
- [ ] Tools addendum cross-referenced: YES/NO
- [ ] Session 09 continuation updated: YES/NO

### Test Fixtures (Part 3)
- [ ] frs-issues.json schema compliance: PASS/FAIL
- [ ] Test plan coverage: all 24 commands covered: YES/NO
- [ ] Dependency graph consistent across 3 sources: YES/NO
- [ ] Acceptance criteria all testable: YES/NO

### Knowledge Quality (Part 4)
- [ ] PRIME.md matches v1.0: YES/NO
- [ ] Command reference: all 24 commands: YES/NO
- [ ] /wf command: all arguments handled: YES/NO
- [ ] Import examples consistent with fixtures: YES/NO
```

#### 6B: Update Session 09 Continuation (if needed)

If any changes were made to the session-09-continuation.md during Part 2, list them. The session-09 continuation should be ready for a fresh Claude session to pick up and start implementing Phase 1.

#### 6C: File Change Summary

List every file modified during this session, with a one-line description of what changed. This ensures the next session can verify the changes.

---

## Recommended Execution Order

1. **Parts 1A-1D in parallel** -- All four plugin-dev validations are independent. Run them simultaneously using parallel agents.
2. **Part 2** -- Spec integration check. Requires reading spec docs; produces targeted edits.
3. **Parts 3A-3D in parallel** -- All test fixture checks are independent reads. Run simultaneously.
4. **Parts 4A-4D in parallel** -- All knowledge quality checks are independent reads. Run simultaneously.
5. **Part 5** -- Dry-run import skill (only if Parts 1-4 are complete and time remains).
6. **Part 6** -- Session continuity: summarize results, update continuation if needed.

Total: 4 parallel batches + 2 sequential steps. Estimated effort: ~30 minutes with parallel agents.

---

## Success Criteria

This session is complete when:

1. All four plugin-dev validators return clean results (no errors, no warnings)
2. Both skills pass review with no critical issues
3. All spec documents have cross-references to new artifacts (test fixtures, plugin scaffold, tools addendum)
4. `session-09-continuation.md` references the pre-built artifacts so Phase 1 implementers know they exist
5. `frs-issues.json` passes all schema compliance checks
6. The test plan covers all 24 commands with concrete expected outcomes
7. The dependency graph is consistent across `frs-issues.json`, `frs-spec.md`, and `frs-test-plan.md`
8. PRIME.md and command reference are verified accurate against v1.0 spec
9. A verification checklist is completed with all items documented
10. All changes are summarized for session continuity

---

## Tools Available

Use these tools proactively during validation:

| Tool | Purpose |
|------|---------|
| `plugin-dev:plugin-validator` | Validate entire plugin structure |
| `plugin-dev:skill-reviewer` | Review SKILL.md quality and triggers |
| `plugin-dev:hook-development` | Verify hook scripts and event configuration |
| `plugin-dev:command-development` | Verify slash command structure and content |

See `.implementation/continuation-prompts/session-09-tools-addendum.md` for the full tool inventory.
