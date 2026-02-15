<!--
  Session Handoff Skill
  What: Guides you through creating a continuation prompt to preserve context
        when starting a new session.
  Install (Claude Code): Copy this folder to .claude/skills/session-handoff/
        or ~/.claude/skills/session-handoff/
  Install (claude.ai/Desktop): ZIP this folder and upload via
        Settings > Capabilities > Skills
  Install (Teams admin): ZIP and provision via the Teams admin console
  Prerequisites: None
-->
---
name: session-handoff
description: |
  WHEN the user wants to hand off a conversation, create a continuation prompt,
  save session progress, wrap up and start fresh, or preserve context before
  a session ends or degrades.
  WHEN NOT the user is simply asking for a summary of the current conversation
  without intending to continue in a new session.
---

# Session Handoff

Guide users through creating session handoff / continuation prompts to preserve context across sessions.

## Scenario Detection

When invoked, determine which scenario applies by asking a brief clarifying question if unclear:

1. **Planned session boundary** — Work is at a logical stopping point. The user is deliberately closing the session. (Most common.)
2. **Mid-task context overflow** — Context is degrading or has compacted. This is an emergency save.
3. **Task delegation / person handoff** — Handing work to a different person or a differently configured session.
4. **Spec/artifact iteration handoff** — Iterating on a document or deliverable; the handoff captures the artifact's state and next changes.
5. **Multi-workstream handoff** — Multiple parallel work items at different stages need preserving.

See `references/handoff-scenarios.md` for detailed guidance on each scenario type.

## Platform-Adaptive Behaviour

### Claude Code

Generate a structured markdown file. Default output path: `.planning/continuation-prompts/session-N-continuation.md`. Include:

- File-reading directives (ordered list of files the next session must read)
- File tree showing key data locations
- Git context (current branch, recent commits, uncommitted changes)
- Subagent parallelisation hints where applicable

Use the full structured template from `references/handoff-template-technical.md`.

### claude.ai / Claude Desktop

Generate a single copy-paste text block. Follow these principles:

- Avoid technical jargon (no tokens, context windows, compaction)
- Use plain language: 'starting a new conversation', 'picking up where we left off'
- Include a 'How to Use This' instruction at the top
- Use guided questions rather than templates

Use the simplified template from `references/handoff-template-general.md`.

## Guided Question Sequence

Adapt these questions per platform. Ask conversationally, not as a form:

1. **Identity** — What project or task is this for?
2. **Progress** — What was accomplished in this session?
3. **Objectives** — What needs to happen next?
4. **Context** — Are there any files the next session must read? *(Claude Code only)*
5. **Problems** — Are there known issues or blockers?
6. **Principles** — Is there anything specific the next session must remember? (Key decisions, constraints, preferences)

For non-technical users, phrase these naturally:
- 'What were you working on?'
- 'What did you get done today?'
- 'What do you need to tackle next time?'
- 'Is there anything Claude should remember?'

## Token-Awareness Guidance

Adapt behaviour based on how much of the session's context has been consumed:

| Context Usage | Behaviour |
|---|---|
| **0-50%** | Proactive suggestion only. If asked, produce a brief handoff. |
| **50-70%** | Gentle awareness. Mention that a checkpoint might be worthwhile. For Claude Code, suggest `/compact` with focus instructions as an alternative. |
| **70-85%** | Active recommendation. Be more detailed as context is starting to degrade. Capture decisions and state before they are lost. |
| **85-95%** | Urgent capture. Focus on essentials only. There may not be enough context remaining for a comprehensive handoff. |
| **Post-compaction** | Recovery mode. Help reconstruct what was lost. Check for saved outputs, checkpoint files, and recent git history. |

For non-technical users, frame this as: 'If this conversation has been going for a while and Claude seems to be losing track, creating a handoff to start a fresh conversation can help.'

See `references/context-awareness-guide.md` for more detail on context window mechanics.

## Output Format

### Technical Users (Claude Code)

Produce structured markdown with these sections (include only those relevant to the scenario):

1. **Project Identity Block** — Name, previous session, date, repo path
2. **Context Files to Read First** — Ordered, annotated list (3-5 files)
3. **Cumulative Progress Summary** — Recency-weighted: older sessions compressed, recent sessions expanded
4. **Session Objectives** — Primary / Secondary / Tertiary
5. **Remaining Work Tracker** — Table with status: Complete / In Progress / Not Started / Blocked
6. **Important Context / Principles** — Or reference to CLAUDE.md
7. **Recommended Approach** — Suggested execution order with rationale
8. **Data Locations** — File tree of key files
9. **Technology Stack** — If applicable
10. **Open Questions** — Unresolved items
11. **Known Issues** — Problems the next session should be aware of
12. **Success Criteria** — What 'done' looks like for the next session

### General Users (claude.ai / Claude Desktop)

Produce a single text block containing:

1. **How to Use This** — 'Paste everything below into a new conversation to continue where you left off.'
2. **What We Were Working On** — Project context in plain language
3. **What Was Accomplished** — Bullet-point summary
4. **What Needs to Happen Next** — Clear next steps
5. **Important Things to Remember** — Key decisions, preferences, constraints
6. **Any Specific Instructions for Claude** — Tone, format, approach preferences

## Design Principles

- **Be adaptive.** Detect the scenario type and adjust the output accordingly.
- **Weight recency.** Recent work gets more space; older work gets compressed with file references.
- **Include success criteria.** Every handoff should end with a clear definition of what 'done' looks like.
- **Reference rather than repeat.** For persistent context, point to existing files rather than embedding content.
- **Keep it concise.** Target ~500-1,500 words for general users, ~1,000-4,000 words for technical users.
- **Degrade gracefully.** If context is limited, produce a minimal but useful handoff.

## Alternative: Projects

For recurring workflows, mention that creating a Project with custom instructions (in claude.ai or Claude Desktop) is a more durable alternative to per-session handoffs. The handoff can be added as a document in the project's knowledge base, giving future conversations automatic access.
