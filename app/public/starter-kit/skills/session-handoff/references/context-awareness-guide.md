<!--
  Context Awareness Guide
  What: A guide to understanding why sessions degrade over time and when to
        create handoffs vs use other strategies.
  Audience: Both technical and non-technical users. Written in plain language
            with a technical section for Claude Code users.
  Usage: Reference this guide when deciding whether to create a handoff,
         use /compact, or start fresh.
  Prerequisites: None.
-->

# Understanding Context and Session Handoffs

## Why Conversations Get Worse Over Time

Every conversation with Claude has a limited amount of 'working memory'. Think
of it like a desk: as the conversation gets longer, the desk fills up with
notes, drafts, and earlier exchanges. Eventually, there is no room left to work
effectively.

When the desk gets too full, Claude may:

- Repeat things it has already said
- Forget decisions you made earlier in the conversation
- Ask about things you have already discussed
- Give less precise or less helpful responses
- Lose track of your preferences or instructions

This is not a fault — it is a fundamental characteristic of how large language
models work. The solution is not to push through; it is to start a fresh
conversation with a good briefing.

## When to Create a Handoff

**Create a handoff when:**

- You have been working for a while and want to stop at a natural point
- Claude seems to be losing track of earlier context
- You want someone else to continue the work
- You are juggling multiple tasks and need to preserve each one's state
- You have made important decisions you do not want to re-make

**Do not create a handoff when:**

- You are simply asking for a summary of the conversation
- The conversation is short and you can easily start fresh by describing the
  task again
- You are finished with the work entirely and do not need to continue

## Alternatives to a Full Handoff

### Start a Fresh Conversation

For short tasks, the simplest approach is to start a new conversation and
briefly describe what you need. No formal handoff required.

### Use Projects (claude.ai / Claude Desktop)

For recurring work, create a Project with custom instructions that capture your
preferences, constraints, and context. Every new conversation in that project
starts with that context automatically. This is more durable than per-session
handoffs.

### Use /compact (Claude Code Only)

The `/compact` command in Claude Code compresses the conversation history to
free up space. Use it when:

- You are mid-task and do not want to stop
- The session is getting long but you still have work to do
- You can provide focus instructions:
  `/compact focus on the authentication module changes`

**Tip:** `/compact` preserves context but at reduced fidelity. A full handoff to
a new session gives better results for complex work.

## Signs That a Session Is Degrading

Watch for these signals:

1. **Repetition** — Claude says things it has already said, or suggests
   approaches you have already tried
2. **Forgotten context** — Claude asks questions about things you discussed
   earlier
3. **Reduced precision** — Responses become more generic or less tailored to
   your specific situation
4. **Inconsistency** — Claude contradicts decisions or preferences it previously
   acknowledged
5. **Increased errors** — More factual mistakes or hallucinations than earlier
   in the conversation

If you notice these signs, it is time to create a handoff and start fresh.

---

## Technical Detail: Context Window Mechanics (Claude Code Users)

This section covers the technical details for developers working in Claude Code.

### How Context Works

Claude has a fixed context window (currently 200,000 tokens for Claude Opus and
Sonnet). Every message, file read, tool call, and response consumes tokens from
this window. Once full, automatic compaction kicks in — older conversation
history is summarised and compressed to make room.

### Token Usage Levels

| Usage           | What Happens                     | Recommended Action                                                                     |
| --------------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| 0-50%           | Full recall, optimal performance | Continue working. Handoff optional.                                                    |
| 50-70%          | Subtle degradation begins        | Consider a checkpoint handoff if the work is complex.                                  |
| 70-85%          | Noticeable quality decline       | Create a handoff soon. Be more detailed — context is starting to degrade.              |
| 85-95%          | Critical — compaction imminent   | Create a handoff immediately. Focus on essentials.                                     |
| Post-compaction | Resuming after auto-compact      | Recovery mode. Check for saved outputs, recent git history. Reconstruct what was lost. |

### Checking Context Usage

Use the `/cost` command to see current context usage. This shows token counts
and percentage consumed.

### Automated Checkpoints

For critical work, consider using hooks to automate checkpoint creation:

- **PreCompact hook:** Automatically generates a minimal handoff before
  compaction occurs
- **SessionEnd hook:** Creates a handoff when the session is closing

These require a companion plugin or custom hook configuration.

### Tips for Efficient Context Usage

1. **Reference files instead of pasting content** — Point Claude to file paths
   rather than pasting entire files into the conversation
2. **Use CLAUDE.md for persistent context** — Anything Claude needs to know
   every session should be in CLAUDE.md, not repeated in handoffs
3. **Keep handoffs concise** — Target under 5,000 tokens. Use file references
   for deeper context
4. **Compress older sessions** — In cumulative handoffs, collapse old session
   summaries into one-line references
