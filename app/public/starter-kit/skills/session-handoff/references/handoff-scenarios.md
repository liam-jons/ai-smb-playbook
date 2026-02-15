<!--
  Handoff Scenarios Reference
  What: Descriptions of the five session handoff scenario types with guidance
        on essential vs nice-to-have elements for each.
  Usage: This is a reference file for the session-handoff skill. The skill
         uses it to determine which template elements to include based on
         the detected scenario.
  Prerequisites: None.
-->

# Handoff Scenarios

Five distinct handoff scenario types, each with different information requirements and urgency characteristics.

---

## 1. Planned Session Boundary

**Description:** You have completed a natural unit of work and are deliberately closing the session. The work is at a logical stopping point.

**When this happens:** This is the most common scenario. You have finished a phase, reached a milestone, or simply want to stop for the day.

**Characteristics:**
- Work completed cleanly to a defined milestone
- Clear boundary between 'what is done' and 'what is next'
- No urgency — you are choosing to stop
- The handoff is written at session end, with full context still available

| Essential Elements | Nice-to-Have |
|---|---|
| Progress summary | Remaining work tracker |
| Session objectives for next time | Open questions |
| Recommended approach | Technology stack notes |
| Key decisions made | |

**Guidance:** Keep it concise. Since the work is at a clean boundary, focus on what was accomplished and what comes next. There is no need to document in-flight state.

---

## 2. Mid-Task Context Overflow (Emergency Save)

**Description:** The context window is approaching capacity or has already compacted. Critical information needs to be preserved before it is lost. The work is mid-stream, not at a natural stopping point.

**When this happens:** The conversation has been long and Claude is starting to repeat itself, forget earlier context, or ask about things already discussed. On Claude Code, you may see compaction warnings.

**Characteristics:**
- The session hit or is approaching compaction
- Information may already be partially lost
- Higher urgency — capture state before more is lost
- Work is incomplete; clearly distinguish 'done' from 'in progress'
- Include warnings about what was lost or may be unreliable

| Essential Elements | Nice-to-Have |
|---|---|
| Current state of in-progress work | Recovery instructions |
| What was lost or may be unreliable | Verification steps |
| Immediate next steps | Full progress history |
| Key decisions at risk of being lost | |

**Guidance:** Prioritise speed over completeness. Capture the essential state now. A partial handoff is better than losing everything to compaction. Focus on what the next session needs to know to resume mid-task.

---

## 3. Task Delegation / Person Handoff

**Description:** The work is being handed to a different person or a differently configured session (e.g., different tools, different repository context).

**When this happens:** You need a colleague to pick up where you left off, or you are switching to a session with different capabilities (different MCP servers, different permissions).

**Characteristics:**
- Cannot assume the recipient has any prior context
- Must be fully self-contained: project overview, file locations, conventions
- May include environment setup instructions
- The recipient may have different capabilities

| Essential Elements | Nice-to-Have |
|---|---|
| Full project context and overview | Decision framework for open choices |
| Environment setup instructions | Historical context (why things are the way they are) |
| Conventions and constraints | Team contact information |
| File locations and structure | |
| Current state and next steps | |

**Guidance:** Write as if the reader knows nothing about the project. Include everything needed to start working without asking clarifying questions. This is the most detailed type of handoff.

---

## 4. Spec/Artifact Iteration Handoff

**Description:** The session produced or iterated on a specification, design document, or other artifact. The handoff captures the artifact's current state and what changes are needed next.

**When this happens:** You have been drafting, reviewing, or refining a document, specification, or design. The artifact needs further work in the next session.

**Characteristics:**
- The artifact IS the primary deliverable
- Includes version history showing how it evolved
- Clear mapping of 'what changed' and 'what the review found'
- Often includes a decision framework for the next session
- File references are precise (section numbers, specific passages)

| Essential Elements | Nice-to-Have |
|---|---|
| Artifact version and current state | Addendum with gap-fill content |
| Changes made in this session | Quality checklists |
| Review findings and feedback | Version comparison |
| Next changes needed | |

**Guidance:** Structure the handoff around the artifact, not around the session. The next session needs to understand the artifact's current state and what reviewers or stakeholders have said about it.

---

## 5. Multi-Workstream Handoff

**Description:** The session covered multiple parallel workstreams, each at a different stage. The handoff must preserve the state of each workstream independently.

**When this happens:** You are juggling several related tasks or features, each with its own progress and dependencies.

**Characteristics:**
- Multiple independent work items, each with its own status
- Progress tracking is critical — which workstreams are done, in progress, or blocked
- Priority ordering matters
- Dependencies between workstreams must be explicit

| Essential Elements | Nice-to-Have |
|---|---|
| Per-workstream status | Parallelisation hints (which can run simultaneously) |
| Dependencies between workstreams | Estimated effort per workstream |
| Priority order | Risk assessment |
| Blocking issues | |

**Guidance:** Use a structured tracker (table or checklist) for each workstream. The next session needs to quickly scan status and decide which workstream to tackle first. Include a recommended execution order.
