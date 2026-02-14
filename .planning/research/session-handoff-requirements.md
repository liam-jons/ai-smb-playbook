# Session Handoff Skill: Requirements Research

> Phase 0 research output for the session handoff/continuation skill.
> Compiled: 2026-02-14
> Basis: 21 real-world continuation prompts analysed across 3 projects, plus context window mechanics and command availability research.

---

## 1. Summary of Analysis

Twenty-one continuation prompts were analysed across three distinct projects:

- **Project 01** (5 prompts): A product development project (bid management platform) spanning research, technology evaluation, brainstorming, and design phases. Sessions 03-07.
- **Project 02** (10 prompts): A developer tooling project (Go CLI workflow tool) spanning spec research, adversarial review, iteration, and pre-implementation validation. Sessions 01-08.5b.
- **Project 03** (6 prompts): A skill development project (Claude Capabilities Awareness skill) spanning design, eval framework, content iteration, publication, and browser testing. Sessions 4-7 plus two pipeline/skill-specific handoffs.

All prompts were authored by a technical user working in Claude Code. They exhibit a mature, evolved practice that improved across sessions -- later prompts are more structured and information-dense than earlier ones. This analysis extracts the patterns that a skill should codify for both technical and non-technical users.

---

## 2. Taxonomy of Handoff Scenarios

Analysis of the 21 examples reveals five distinct handoff scenario types. Each has different information requirements and urgency characteristics.

### 2.1 Planned Session Boundary (Most Common)

**Description:** The user has completed a natural unit of work and is deliberately closing the session before starting a new one. The work is at a logical stopping point.

**Frequency in examples:** ~14 of 21 prompts (67%)

**Examples:** Project 01 sessions 03-07 (each session planned as a discrete phase); Project 02 sessions 01-05, 07 (spec iteration cycles); Project 03 sessions 4-6 (skill development cycles).

**Characteristics:**
- Work completed cleanly to a defined milestone
- Clear "what's done" and "what's next" boundary
- No urgency -- the user is choosing to stop
- The handoff document is written at session end, with full context still available
- Often written with the expectation that the same user will resume in the next session

### 2.2 Mid-Task Context Overflow (Emergency Save)

**Description:** The context window is approaching capacity or has already compacted. Critical information needs to be preserved before it is lost. The work is mid-stream, not at a natural stopping point.

**Frequency in examples:** ~3 of 21 prompts (14%)

**Examples:** Project 02 session 08.5b (explicitly mentions "auto-compacted conversations" and context loss); Project 03 session 7 (mentions "Sessions 6 and 6-continued suffered from multiple context compactions that caused confusion").

**Characteristics:**
- The session hit compaction and lost context mid-work
- Information is being reconstructed from what survives
- Higher urgency -- the user needs to capture state before more is lost
- Work is incomplete; the handoff must clearly distinguish "done" from "in progress" from "not started"
- Often includes explicit warnings about what was lost and what to watch for

### 2.3 Task Delegation / Person Handoff

**Description:** The work is being handed to a different person or a different Claude session with a different configuration (e.g., different MCP servers, different repo context).

**Frequency in examples:** ~2 of 21 prompts (10%)

**Examples:** Project 02 session 06 (handoff from spec review sessions to implementation session -- different tool availability); Project 03 capabilities-pipeline-handoff (handoff to a session with specific MCP tools and different workstream focus).

**Characteristics:**
- Cannot assume the recipient has any prior context
- Must be fully self-contained: project overview, file locations, conventions, constraints
- Often includes explicit "Read These Files" directives with ordering
- May include environment setup instructions (API keys, tool requirements)
- The recipient may have different capabilities (different MCP servers, different permissions)

### 2.4 Spec/Artifact Iteration Handoff

**Description:** The session produced or iterated on a specification, design document, or other artifact. The handoff captures the artifact's current state and what changes are needed next.

**Frequency in examples:** ~5 of 21 prompts (24%)

**Examples:** Project 02 sessions 02-05 (spec v0.1 through v0.4 iterations); Project 03 session 5 (skill v1.3.0 with specific eval results and open work items).

**Characteristics:**
- The artifact IS the primary deliverable, and the handoff is structured around it
- Includes version history showing how the artifact evolved
- Clear mapping of "what changed" and "what the review found"
- Often includes a decision framework for the next session (accept/reject/modify proposals)
- File references are precise (line numbers, section numbers)

### 2.5 Multi-Workstream Handoff

**Description:** The session covers multiple parallel workstreams, each at a different stage. The handoff must preserve the state of each workstream independently.

**Frequency in examples:** ~3 of 21 prompts (14%)

**Examples:** Project 03 capabilities-pipeline-handoff (four workstreams: Distill fixes, research incorporation, evaluation tests, pipeline documentation); Project 02 session 08.5b (plugin validation, spec integration, test fixtures, knowledge artifacts -- each with sub-parts).

**Characteristics:**
- Multiple independent work items, each with its own status
- Progress tracking is critical -- which workstreams are done, which are in progress, which are blocked
- Priority ordering matters -- which workstream should be tackled first
- Dependencies between workstreams must be explicit
- Often includes a "recommended execution order" section

---

## 3. Information Architecture

Analysis of all 21 examples reveals a consistent set of information categories. Some appear in every handoff; others are scenario-specific.

### 3.1 Universal Elements (Present in Every Handoff)

These elements appeared in all or nearly all of the 21 examples:

#### A. Project Identity Block
Every example starts with a clear identification section:
- Project name and one-line description
- Previous session identifier (number, date, or both)
- Date the handoff was created
- Repository location (absolute path)

**Pattern observed:**
```
# Session [N] Continuation Prompt
**Project:** [Name] - [one-line description]
**Previous Session:** Session [N-1] ([short description of what it covered])
**Date Created:** [date]
```

#### B. Context Files Directive
An ordered list of files the new session must read before doing anything:
- Typically 3-5 files
- Always ordered by importance (most critical first)
- Often includes a "Critical" annotation for the most important file
- File paths are always absolute or repo-relative

**Pattern observed:**
```
## Context Files to Read First
1. `[path]` - [what it is and why it matters]
2. `[path]` - [what it is] **Critical** - [why critical]
3. `[path]` - [what it is]
```

#### C. Cumulative Progress Summary
A record of what has been completed across all previous sessions, not just the most recent one. This is the single most important element for context recovery.

**Two sub-patterns observed:**

*Detailed per-session breakdown* (Project 01, Project 02 early sessions):
- Each session listed with bullet-point accomplishments
- Becomes verbose as session count grows

*Grouped with recency weighting* (Project 02 later sessions, Project 03):
- Older sessions collapsed into a one-line summary referencing a summary file
- Most recent 1-2 sessions expanded with full detail
- Pattern: "Sessions 01-04: [one-line]. Session 05: [detailed breakdown]"

The grouped pattern scales better and is the recommended approach.

#### D. Session Objectives
Clear statement of what the next session should accomplish, typically structured as:
- Primary objective (must do)
- Secondary objective (if time permits)
- Tertiary objective (future sessions)

**Pattern observed:**
```
## Session [N] Objectives
### Primary Objective: [description]
### Secondary Objective: If Time Permits
### Tertiary Objective: [description]
```

#### E. Data Locations
A file tree or table showing where key files live. This is especially important because Claude cannot browse file systems proactively -- it needs to know where to look.

**Pattern observed:** Either an ASCII directory tree or a table with Path / Purpose columns.

### 3.2 Common Elements (Present in Most Handoffs)

#### F. Important Context / Principles
Persistent rules, constraints, or principles that must inform all work. These appear in ~80% of examples.

**Pattern observed:** A numbered list of 5-12 principles, often titled "Important Context: Our Approach" or "Constraints". These are repeated verbatim across multiple session handoffs in the same project -- they do not change between sessions.

**Key insight:** This repetition is a workaround for context loss. In an ideal skill, persistent principles would live in CLAUDE.md or a referenced file, and the handoff would simply point to them rather than repeating them.

#### G. Recommended Approach / Execution Order
A suggested plan for how to tackle the session's objectives. Appears in ~75% of examples.

**Pattern observed:**
```
## Recommended Session [N] Approach
1. **Start with [X]** - [rationale]
2. **Then [Y]** - [rationale]
3. **If time permits, [Z]** - [rationale]
```

Often includes parallelisation guidance (which tasks can be done by subagents in parallel).

#### H. Open Questions
Unresolved questions that may affect the next session's work. Appears in ~60% of examples.

### 3.3 Scenario-Specific Elements

#### I. Technology Stack / Architecture Summary
Present when the project involves technical decisions that constrain implementation. A table of decided/recommended technologies.

**When needed:** Spec iteration, implementation handoffs, multi-session technical projects.

#### J. Decision Framework
Present when the next session must make specific decisions. Includes options, criteria, and sometimes a recommended path.

**When needed:** Spec review/iteration handoffs (Project 02 sessions 03-04).

#### K. Remaining Work Tracker
A table or checklist showing all known work items and their status (complete, in progress, not started, blocked).

**When needed:** Multi-workstream handoffs, long-running projects past the midpoint.

**Pattern observed:**
```
| Item | Type | Status |
|------|------|--------|
| [Work item] | [Category] | **Complete** / Session [N] / Future |
```

#### L. Verification / Quality Checklists
Specific checks the next session should perform to validate work.

**When needed:** Pre-implementation validation (Project 02 session 08.5b), spec review (Project 02 session 07).

#### M. Environment / Tool Setup
Instructions for configuring the session environment (API keys, package installs, git config, available tools).

**When needed:** Task delegation, implementation sessions, sessions requiring specific MCP tools.

#### N. What Was Lost / Compaction Warnings
Explicit documentation of what was lost during compaction and what the next session should watch for.

**When needed:** Mid-task context overflow scenarios only.

**Pattern observed (Project 03 session 7):**
```
Sessions 6 and 6-continued suffered from multiple context compactions that caused:
- Confusion between the two eval runners
- Lost context about the .env setup
- Lost context about the repo structure
This handoff is written to be self-contained to avoid repeating those issues.
```

---

## 4. User Group Considerations

The 21 examples were all authored by a technical user in Claude Code. The skill must adapt for two very different audiences.

### 4.1 Non-Technical Users (Claude Desktop / claude.ai)

**Key differences from the analysed examples:**
- No slash commands available -- the skill is invoked via natural language
- No filesystem access -- cannot reference file paths or directory trees
- No subagent deployment -- cannot parallelise work
- No git context -- cannot reference branches, commits, or repos
- Likely unfamiliar with tokens, context windows, or why sessions degrade
- May not understand why a handoff is needed at all

**What the skill must do differently for this group:**
1. **Explain the "why" before the "what":** Before collecting handoff information, briefly explain why session handoff matters (context windows have limits; starting fresh sessions with a good briefing produces better results than pushing through a degraded session).
2. **Use guided questions rather than templates:** Instead of showing a template to fill in, ask the user a sequence of questions: "What were you working on?", "What did you accomplish?", "What do you need to do next?", "Is there anything specific Claude needs to remember?"
3. **Produce a single block of text:** The output should be a single prompt the user can copy-paste into a new session. Not multiple files, not a directory structure.
4. **Avoid technical jargon:** No mention of tokens, context windows, compaction, or system prompts. Use plain language: "starting a new conversation", "picking up where we left off".
5. **Include a "How to Use This" instruction:** At the top of the generated handoff, include a brief instruction: "Paste everything below into a new conversation to continue where you left off."
6. **Project context via Projects feature:** For recurring workflows, guide users toward creating a Project with custom instructions rather than relying on per-session handoffs. The handoff skill should mention this as a more durable option.

### 4.2 Technical Users (Claude Code)

**What the skill should do for this group:**
1. **Produce a structured markdown file:** Written to a specified path (default: `.planning/continuation-prompts/session-[N]-continuation.md` or similar).
2. **Include file-reading directives:** The "Context Files to Read First" pattern from the analysed examples.
3. **Include file tree / data locations:** Where key files are in the repo.
4. **Support subagent parallelisation hints:** Which parts of the next session's work can be done in parallel.
5. **Include git context:** Current branch, recent commits, uncommitted changes.
6. **Support spec/artifact iteration pattern:** When the session was iterating on a document, structure the handoff around the artifact's version and changes.
7. **Token-efficient output:** The handoff document should be as concise as possible while remaining complete -- it will be loaded into the next session's context window.

### 4.3 Shared Requirements (Both Groups)

Regardless of user group, every handoff must:
- Clearly state what was accomplished
- Clearly state what needs to happen next
- Include enough context that the new session can begin work without asking clarifying questions
- Be self-contained (not require reading the previous session's transcript)

---

## 5. Token-Awareness Requirements

The context window mechanics research (Section 4 of the reference document) establishes that context degradation is progressive, not sudden. The skill should adapt its behaviour based on how much context has been consumed.

### 5.1 Context Usage Levels and Skill Behaviour

| Context Usage | User Experience | Skill Behaviour |
|---|---|---|
| **0-50%** | Healthy, full recall | **Proactive suggestion only.** If the user asks for a handoff, produce one. Do not interrupt otherwise. The handoff can be brief -- the session has plenty of room to continue. |
| **50-70%** | Early degradation; subtle | **Gentle awareness.** If the user is on a long session and approaching 60%, the skill could mention (once) that creating a checkpoint handoff might be worthwhile. For Claude Code users, suggest `/compact` with focus instructions as an alternative to a full handoff. |
| **70-85%** | Noticeable degradation | **Active recommendation.** The skill should recommend creating a handoff soon. The handoff should be more detailed at this stage because context is starting to degrade -- capture decisions and state before they are lost. |
| **85-95%** | Critical; compaction imminent | **Urgent capture.** The skill should produce a handoff immediately if invoked. Focus on essential information only -- there may not be enough context remaining for a comprehensive handoff. This is the "emergency save" scenario. |
| **Post-compaction** | Resuming after auto-compact | **Recovery mode.** The skill should help reconstruct what was lost. On Claude Code, check for saved subagent outputs, checkpoint files, and recent git history. Produce a recovery-oriented handoff that acknowledges gaps. |

### 5.2 How to Detect Context Usage

**Claude Code:** The `/cost` command shows context usage. The skill can reference this. Hooks (PreCompact, SessionEnd) can trigger automated checkpoints.

**Claude Desktop / claude.ai:** There is no user-visible context usage indicator. The skill must rely on behavioural signals:
- How long the conversation has been going
- Whether Claude has started repeating itself or asking about things already discussed
- The user reporting that "Claude seems to be forgetting things"

For non-technical users, the skill should frame this as: "If this conversation has been going for a while and Claude seems to be losing track, creating a handoff to start a fresh conversation can help."

### 5.3 Handoff Size vs Context Budget

The handoff document itself will consume context in the next session. This creates a tension: more detailed handoffs preserve more context but leave less room for new work.

**Recommended guidelines:**
- For non-technical users: Target ~500-1,500 words (roughly 700-2,000 tokens). This fits easily in any session.
- For technical users: Target ~1,000-4,000 words (roughly 1,500-5,500 tokens) for the main handoff document, with an additional "Read These Files" directive pointing to existing project documents for deeper context.
- The handoff should never exceed ~5% of the standard context window (~10,000 tokens). If more context is needed, it should be in referenced files, not in the handoff itself.

---

## 6. Extracted Patterns from Real-World Examples

### 6.1 The "Recency-Weighted Summary" Pattern

**Observed in:** Project 01 (sessions 05-07), Project 02 (sessions 03-08)

As a project accumulates sessions, the continuation prompt evolves from listing every session's accomplishments in equal detail to a pattern where:
- Old sessions are collapsed into a one-line summary with a file reference
- Recent sessions (1-2) are expanded with full detail
- The most recent session gets the most space

**Example (Project 01, Session 07):**
```
### Sessions 01-04: Research & Technology Alignment (Complete)
All research and technology evaluation is complete. See session-summary-04.md.

### Session 05: Brainstorming -- Universal Bid Workflow (Complete)
[3-4 bullet points]

### Session 06: Brainstorming -- SME Routing + Auth Decision (Complete)
[8-10 bullet points with detail]
```

**Implication for the skill:** The skill should implement this pattern automatically. When building a cumulative summary, weight recent work heavily and compress older work.

### 6.2 The "Read These Files First" Directive Pattern

**Observed in:** All 21 examples (100%)

Every single example includes an explicit, ordered list of files to read before starting work. This is the most consistently applied pattern across all examples.

**Key characteristics:**
- Always numbered (implies reading order matters)
- Typically 3-5 files
- The most critical file is annotated (bold, "Critical", or explicit note)
- Paths are always relative to the repo root

**Implication for the skill:** For Claude Code users, the skill should always generate this section. For claude.ai/Desktop users where file paths are not relevant, the equivalent is embedding the critical context directly in the handoff text.

### 6.3 The "Persistent Principles" Repetition Pattern

**Observed in:** Project 01 (all 5 examples repeat the same 7-10 principles verbatim)

The user copies the same block of principles into every continuation prompt. This is a workaround for context loss -- these principles are so important that losing them to compaction or session boundaries is unacceptable.

**Implication for the skill:** The skill should:
1. Identify whether persistent principles exist (in CLAUDE.md, a project file, or previously stated)
2. For Claude Code: reference the file rather than repeating the content
3. For claude.ai/Desktop: embed the principles in the handoff, but note that putting them in a Project's custom instructions would be more durable

### 6.4 The "Remaining Work Tracker" Pattern

**Observed in:** Project 01 (sessions 06-07), Project 02 (sessions 07-08.5b)

As projects progress, a table emerges tracking all known work items:

```
| Item | Type | Status |
|------|------|--------|
| Brainstorm: Universal bid workflow | Creative | **Complete** |
| Brainstorm: SME routing | Creative | **Complete** |
| Brainstorm: Content freshness | Creative | Session 07 |
| Brainstorm: Win/loss feedback | Creative | Session 07 |
| Consolidate into design brief | Consolidation | After brainstorming |
```

**Implication for the skill:** The skill should ask users about outstanding work items and generate a tracker table. For non-technical users, this can be a simple bullet list with checkmarks.

### 6.5 The "Structural Issues / Known Problems" Pattern

**Observed in:** Project 02 (session 08.5b), Project 03 (session 7)

When there are known issues in the project state (broken git, stale files, environment problems), the handoff dedicates a section to documenting them with explicit fix instructions.

**Implication for the skill:** The skill should ask: "Are there any known issues or problems the next session should be aware of?" and include a dedicated section if so.

### 6.6 The "Addendum / Gap-Fill" Pattern

**Observed in:** Project 02 (session 08)

When the primary artifact (a spec) has known gaps, the handoff includes an inline addendum with the missing information, clearly labelled (A1, A2, A3...) and cross-referenced to the main artifact.

**Implication for the skill:** For spec/artifact iteration handoffs, the skill should ask whether there are outstanding gaps and capture them as an addendum rather than requiring the user to edit the original document.

### 6.7 The "Success Criteria" Pattern

**Observed in:** Project 02 (session 08.5b), Project 03 (session 6)

The handoff ends with explicit success criteria for the next session -- a checklist of outcomes that constitute "done."

**Implication for the skill:** The skill should always generate a "What Does Done Look Like?" section that makes the next session's success criteria unambiguous.

---

## 7. Proposed Skill Structure

Based on the analysis above, the skill should be structured as follows:

### 7.1 What Goes in SKILL.md (The Core Skill)

The SKILL.md file should contain:

1. **Frontmatter** with clear trigger descriptions covering all handoff scenarios
2. **Decision logic** for detecting which scenario type applies (planned boundary, context overflow, delegation, iteration, multi-workstream)
3. **The guided question sequence** for collecting handoff information (adapted per user group)
4. **Output format specification** for each scenario type
5. **Token-awareness guidance** for when to recommend handoffs vs other strategies (compact, fresh session)
6. **Platform-adaptive instructions** distinguishing Claude Code behaviour from claude.ai/Desktop behaviour

### 7.2 What Goes in Reference Files

#### Reference: `handoff-template-technical.md`
A comprehensive template for Claude Code users showing the full handoff structure with all possible sections. The skill populates this based on what information is available.

Sections:
- Project identity block
- Context files to read first
- Cumulative progress summary (recency-weighted)
- Session objectives (primary/secondary/tertiary)
- Remaining work tracker
- Important context / principles (or file reference)
- Recommended approach / execution order
- Data locations (file tree)
- Technology stack (if applicable)
- Open questions
- Known issues
- Success criteria
- Environment setup (if delegation)

#### Reference: `handoff-template-general.md`
A simplified template for non-technical users producing a single copy-paste block.

Sections:
- "How to Use This" instruction
- What we were working on (project context)
- What was accomplished (plain language summary)
- What needs to happen next (clear next steps)
- Important things to remember (key decisions, preferences, constraints)
- Any specific instructions for Claude

#### Reference: `handoff-scenarios.md`
Descriptions of the five scenario types with guidance on which template elements are most important for each:

| Scenario | Essential Elements | Nice-to-Have |
|---|---|---|
| Planned boundary | Progress, objectives, approach | Work tracker, open questions |
| Context overflow | Current state, in-progress work, what was lost | Recovery instructions |
| Task delegation | Full project context, environment setup, conventions | Decision framework |
| Artifact iteration | Artifact version/state, changes, review findings | Addendum, quality checks |
| Multi-workstream | Per-workstream status, dependencies, priority order | Parallelisation hints |

#### Reference: `context-awareness-guide.md`
Brief guide on context window mechanics written in plain language (for non-technical users) with a technical section (for Claude Code users). Covers:
- Why sessions degrade over time
- When to create a handoff vs use /compact vs start fresh
- How to use Projects as a durable alternative to per-session handoffs

### 7.3 What Goes in Supporting Templates (Starter Kit)

Beyond the skill itself, the starter kit should include:

1. **Example handoff (non-technical):** A completed example showing what a good handoff looks like for a non-technical user working on a content creation project.

2. **Example handoff (technical):** A completed example showing what a good handoff looks like for a technical user working on a development project. Can be derived (anonymised/simplified) from the real examples analysed.

3. **CLAUDE.md snippet:** A section users can add to their CLAUDE.md file that includes persistent principles and compact instructions, reducing the need for repetition in handoffs.

4. **Project template (claude.ai):** Instructions for creating a "Session Handoff" Project on claude.ai with custom instructions that encode the handoff workflow.

---

## 8. Design Principles for the Skill

Derived from the patterns and anti-patterns observed:

### 8.1 Do

- **Be adaptive.** Detect the scenario type and adjust the output accordingly. A planned boundary handoff should look different from an emergency context save.
- **Weight recency.** Recent work gets more space; older work gets compressed with file references.
- **Include success criteria.** Every handoff should end with a clear definition of what "done" looks like for the next session.
- **Reference rather than repeat.** For persistent context (principles, tech stack, conventions), point to existing files rather than embedding content.
- **Generate the "Read These Files" directive.** This is the single most consistent pattern across all examples.
- **Keep it concise.** The handoff must fit comfortably in the next session's context window. Every word should earn its place.
- **Degrade gracefully.** If context is severely limited (emergency save), produce a minimal but useful handoff rather than failing or producing nothing.

### 8.2 Do Not

- **Do not require the user to fill in a template manually.** The skill should ask questions and generate the handoff.
- **Do not use technical jargon with non-technical users.** No tokens, no context windows, no compaction.
- **Do not produce handoffs longer than ~5,000 tokens** (main document). Use file references for additional depth.
- **Do not assume the handoff recipient has any prior context.** Even self-continuation handoffs should be self-contained -- the user may not remember details either.
- **Do not repeat what is already in project files.** If CLAUDE.md has the principles, reference it; do not copy it into the handoff.

---

## 9. Platform Delivery Considerations

From the command availability research:

### 9.1 Claude Code Delivery
- Skill file in `.claude/skills/session-handoff/SKILL.md` (or installed via skills.sh / admin provisioning)
- Can be invoked explicitly (`/session-handoff`) or automatically via natural language
- Can reference filesystem, generate files, read git status
- Can leverage hooks (PreCompact, SessionEnd) for automated checkpoints via a companion plugin

### 9.2 Claude Desktop / claude.ai Delivery
- Skill packaged as ZIP, uploaded via Settings > Capabilities
- Or admin-provisioned via Teams admin console (recommended for the client)
- Invoked via natural language only ("I need to hand off this session", "create a continuation prompt", "let's wrap up and save our progress")
- Output is a single text block the user can copy-paste
- No filesystem access -- all context must be in-conversation

### 9.3 Supplementary: Projects Approach
- For non-technical users, a shared Team Project called "Session Handoff" with custom instructions encoding the workflow may be more discoverable than a skill
- The project can include templates and examples as knowledge base documents
- Users start a new conversation within the project when they want to create or consume a handoff

### 9.4 Recommended Packaging

| Deliverable | Target | Purpose |
|---|---|---|
| `session-handoff/SKILL.md` | Claude Code skill (also packageable as ZIP for web/desktop) | The core skill with platform-adaptive logic |
| `session-handoff/references/handoff-template-technical.md` | Claude Code reference | Full structured template |
| `session-handoff/references/handoff-template-general.md` | All platforms reference | Simplified copy-paste template |
| `session-handoff/references/handoff-scenarios.md` | All platforms reference | Scenario identification and guidance |
| `session-handoff/references/context-awareness-guide.md` | All platforms reference | Why handoffs matter, when to use them |
| Example handoffs (2) | Starter kit / playbook | Show what good looks like |
| CLAUDE.md snippet | Starter kit | Persistent principles + compact instructions section |
| Project template instructions | Starter kit / playbook | How to create a "Session Handoff" Project on claude.ai |

---

## 10. Open Questions for Skill Design Phase

1. **Automated checkpoint via hooks:** Should the skill include a companion plugin with PreCompact/SessionEnd hooks that automatically generate a minimal handoff? The Project 02 examples show this pattern (wf-checkpoint.sh). This would be Claude Code only.

2. **Handoff consumption:** Should the skill also handle *consuming* a handoff (i.e., when a user pastes a handoff into a new session, should the skill help Claude interpret it)? Or is the handoff format self-explanatory enough that no consumption skill is needed?

3. **Cumulative handoffs:** When creating a handoff for session N, should the skill read the handoff from session N-1 to build a cumulative summary? This would require the previous handoff to exist at a known location.

4. **Multi-person handoffs:** For task delegation scenarios, should the skill collect information about the recipient (their role, their familiarity with the project, their tool access)? Or is this over-engineering?

5. **Handoff version pinning:** Should each handoff include a version/timestamp so the recipient can verify they are using the most recent one?

6. **Integration with the context simulator:** The playbook will include an interactive context window simulator (Section 1.5). Should the handoff skill reference it, or should the simulator reference the handoff skill, or both?

---

## 11. Appendix: Example Structure Analysis

### 11.1 Structure Frequency Across All 21 Examples

| Section | Frequency | Notes |
|---|---|---|
| Project identity header | 21/21 (100%) | Project name, session number, date |
| Context files to read | 21/21 (100%) | Ordered list with annotations |
| Cumulative progress summary | 21/21 (100%) | All sessions' accomplishments |
| Session objectives | 20/21 (95%) | What to do next |
| Data locations / file tree | 19/21 (90%) | Where key files are |
| Recommended approach | 16/21 (76%) | Suggested execution order |
| Important principles / constraints | 15/21 (71%) | Repeated project-level rules |
| Technology stack | 12/21 (57%) | For technical projects only |
| Open questions | 11/21 (52%) | Unresolved items |
| Remaining work tracker | 8/21 (38%) | Status table of all work items |
| Success criteria | 4/21 (19%) | Explicit "done" definition |
| Environment setup | 4/21 (19%) | For delegation scenarios |
| Compaction warnings | 3/21 (14%) | For context overflow scenarios |
| Decision framework | 3/21 (14%) | For review/iteration scenarios |
| Verification checklists | 2/21 (10%) | For quality assurance scenarios |

### 11.2 Average Handoff Length

| Project | Average Length (lines) | Range |
|---|---|---|
| Project 01 | ~230 lines | 188-302 |
| Project 02 | ~260 lines | 135-416 |
| Project 03 | ~210 lines | 145-345 |
| **Overall** | **~235 lines** | **135-416** |

The longer examples (300+ lines) tend to be multi-workstream handoffs or those with inline addenda. The shorter examples (under 170 lines) tend to be focused, single-objective handoffs.

### 11.3 Evolution of Quality Across Sessions

A notable pattern: handoff quality improves within each project. Early handoffs (Project 01 session 03, Project 02 session 01) are less structured and miss some elements. Later handoffs in the same project become more formulaic and comprehensive, suggesting the author developed their own template through practice.

This validates the core purpose of the skill: codify what an experienced user learns through practice so that new users start with the mature pattern rather than having to discover it themselves.
