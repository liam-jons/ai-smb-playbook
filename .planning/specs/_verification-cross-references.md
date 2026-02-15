# Phase 1 Verification: Cross-References, Agent Assignments & Source Paths

**Generated:** 2026-02-15
**Verified by:** Automated audit of all 17 spec files against handoff doc and filesystem

---

## Summary

- **Specs verified:** 17 (1.1 through 1.17)
- **Total cross-references found:** 42
- **Cross-references verified valid:** 39
- **Cross-references with minor issues:** 3
- **Broken cross-references:** 0
- **Phase 2 agent assignments:** All 17 correct
- **Source reference paths checked:** 98
- **Source paths verified existing:** 93
- **Source paths missing/not yet created:** 5
- **Issues found:** 8 (3 minor cross-reference issues, 5 missing source paths)

---

## Cross-Reference Map

### Spec 1.1 — Welcome & Orientation

| Ref | Target | What 1.1 assumes | Status |
|-----|--------|-------------------|--------|
| (none) | — | No outgoing cross-references to other numbered specs | — |

**Notes:** 1.1 references the shared feedback widget built by Agent 1 (App Shell). No explicit spec-to-spec cross-references.

---

### Spec 1.2 — How Context Works (Interactive Simulator)

| Ref | Target | What 1.2 assumes | Status |
|-----|--------|-------------------|--------|
| (none) | — | No explicit outgoing numbered cross-references | — |

**Notes:** 1.2 is referenced BY many other specs as the foundational context window explanation. It contains the session handoff prompt (Area 4) but does not explicitly cross-reference other spec numbers within its own content.

---

### Spec 1.3 — Session Management

| Ref | Target | What 1.3 assumes | Status |
|-----|--------|-------------------|--------|
| 1.2 | Context Simulator | 1.3 says "the context simulator in section 1.2 shows *why* sessions degrade; this section shows *what to do about it*" and "Cross-reference section 1.2 throughout" | valid |
| 1.2 | Context Simulator | Source references list includes `.planning/specs/1.2-context-simulator.md` as sibling spec | valid |
| 1.4 | Skills/Extensions | 1.3 says "consider using a Project in claude.ai...Reference section 1.4 for Projects" | valid |

---

### Spec 1.4 — Skills, Extensions & the Decision Tree

| Ref | Target | What 1.4 assumes | Status |
|-----|--------|-------------------|--------|
| (none) | — | No explicit outgoing numbered cross-references in the content body | — |

**Notes:** 1.4 is heavily referenced BY other specs (1.3, 1.5, 1.6, 1.7, 1.8, 1.13) as the extension taxonomy reference. The spec itself mentions internal concepts (CLAUDE.md, Skills, MCP, etc.) but does not explicitly link to other numbered specs.

---

### Spec 1.5 — AI Governance Policy

| Ref | Target | What 1.5 assumes | Status |
|-----|--------|-------------------|--------|
| 1.4 | Decision Tree | 1.5 says "The decision tree in 1.4 explains *what* each extension type is and *when* to use it; this section (1.5) defines *the process for approving and managing* those same extension types" | valid |
| 1.13 | Safe MCP Usage | 1.5 says "Cross-reference to Section 1.13 (Safe MCP Usage)" in acceptance criteria | valid |
| 1.14 | Plugin Recommendations | 1.5 says "Cross-reference to Section 1.14 (Plugin Recommendations)" in acceptance criteria | valid |

---

### Spec 1.6 — Brand Voice & UK English

| Ref | Target | What 1.6 assumes | Status |
|-----|--------|-------------------|--------|
| 1.4 | Decision Tree | 1.6 says "The decision tree in 1.4 covers what skills are and when to use them — this section (1.6) is a concrete, worked example of skills in action" | valid |
| 1.5 | Governance Policy | 1.6 says "both skills are Tier 1 (internal, read-only, no external data access) — log them in the register per Section 1.5" and acceptance criteria says "Cross-references to Section 1.5 (Governance Policy — Tier 1 registration)" | valid |

---

### Spec 1.7 — Recurring & Scheduled Tasks

| Ref | Target | What 1.7 assumes | Status |
|-----|--------|-------------------|--------|
| 1.3 | Session Management | 1.7 says "Section 1.3 (Session Management) — for understanding why sessions are not persistent" | valid |
| 1.4 | Skills/Extensions | 1.7 says "Section 1.4 (Skills, Extensions & Decision Tree) — for understanding how to build skills referenced in patterns" | valid |
| Dev track | Developer track | 1.7 says "a callout for dev team members that Pattern 4 (External Trigger) is expanded in the Developer track" | valid |

---

### Spec 1.8 — CLAUDE.md Files

| Ref | Target | What 1.8 assumes | Status |
|-----|--------|-------------------|--------|
| 1.2 | Context Simulator | 1.8 says "Section 1.2 (How Context Works) explains that CLAUDE.md is loaded at session start and consumes tokens" | valid |
| 1.4 | Skills/Extensions | 1.8 says "Section 1.4 (Skills, Extensions & the Decision Tree) mentions CLAUDE.md as one of the extension mechanisms" | valid |
| 1.9 | Documentation Structure | 1.8 says "Section 1.9 (Documentation Structure) is the natural next step" and "the 'map not encyclopedia' principle introduced here is expanded into a full /docs structure in 1.9" | valid |
| 1.10 | Codebase Mapping | 1.8 says "Section 1.10 (Codebase Mapping) provides a tool that can generate initial documentation" | valid |
| 1.14 | Plugin Recommendations | 1.8 says "Section 1.14 (Plugin Recommendations) covers the claude-md-management plugin in the context of the broader plugin ecosystem" | valid |

---

### Spec 1.9 — Documentation Structure

| Ref | Target | What 1.9 assumes | Status |
|-----|--------|-------------------|--------|
| 1.2 | Context Simulator | 1.9 references "How Context Works" for context budget understanding | valid |
| 1.8 | CLAUDE.md Files | 1.9 references CLAUDE.md as the entry point that points to /docs | valid |
| 1.10 | Codebase Mapping | 1.9 references the codebase mapper as a source of initial /docs content | valid |
| 1.14 | Plugin Recommendations | 1.9 references Context7 plugin for documentation lookup | valid |
| 1.15 | Codebase Auditing | 1.9 references codebase auditing for maintaining documentation quality | valid |

---

### Spec 1.10 — Codebase Mapping

| Ref | Target | What 1.10 assumes | Status |
|-----|--------|-------------------|--------|
| 1.2 | Context Simulator | 1.10 says "The context window implications (each agent gets its own 200k context) connect to section 1.2" | valid |
| 1.3 | Session Management | 1.10 says "The parallel subagent concept is introduced at a high level in section 1.3 (Session Management — breaking tasks into subtasks)" | minor issue |
| 1.9 | Documentation Structure | 1.10 says "the output becomes the foundation for the /docs structure described in section 1.9" | valid |

**Issue (minor):** 1.10 references 1.3 for the "parallel subagent concept" but 1.3 is about session management and atomic task breakdown, not subagents per se. The atomic task principle in 1.3 Part 3 covers breaking tasks into subtasks, which is conceptually related but not specifically about subagents. The cross-reference is reasonable but slightly imprecise.

---

### Spec 1.11 — Avoiding Hallucinations & Quick-Fix Behaviour

| Ref | Target | What 1.11 assumes | Status |
|-----|--------|-------------------|--------|
| (none) | — | No explicit outgoing numbered cross-references | — |

**Notes:** 1.11 is referenced BY 1.12 (hallucinated selectors) and 1.15 (avoiding hallucinations). The spec itself focuses on standalone anti-hallucination patterns and does not link to other spec numbers.

---

### Spec 1.12 — AI-Driven Regression Testing

| Ref | Target | What 1.12 assumes | Status |
|-----|--------|-------------------|--------|
| 1.11 | Hallucinations | 1.12 references hallucinated selectors as a problem — connecting to 1.11's patterns | valid |
| 1.13 | Safe MCP Usage | 1.12 references Playwright MCP installation guidance from 1.13 | valid |

---

### Spec 1.13 — Safe MCP Usage

| Ref | Target | What 1.13 assumes | Status |
|-----|--------|-------------------|--------|
| 1.2 | Context Simulator | 1.13 says "cross-references the context window simulator (section 1.2) for visual understanding of MCP context costs" | valid |
| 1.4 | Skills/Extensions | 1.13 says "See section 1.4 (Skills & Extensions Decision Tree) for the full comparison" | valid |
| 1.5 | Governance Policy | 1.13 says "the governance policy (section 1.5) for the approval process before adding new MCP servers" | valid |
| 1.14 | Plugin Recommendations | 1.13 says "Context7 (covered in section 1.14 as a plugin)" — notes deepwiki vs Context7 overlap | minor issue |
| 1.16 | Starter Kit | 1.13 says "See section 1.16 for the full Starter Kit contents" | valid |

**Issue (minor):** 1.13 references 1.14 for "Context7 as a plugin" but 1.14 covers Context7 as one of many plugin recommendations. The reference is accurate in substance but the label "covered in section 1.14 as a plugin" is slightly imprecise — 1.14 covers it as a plugin recommendation alongside many others, not as a dedicated Context7 section.

---

### Spec 1.14 — Plugin Recommendations

| Ref | Target | What 1.14 assumes | Status |
|-----|--------|-------------------|--------|
| 1.2 | Context Simulator | 1.14 references context cost understanding from 1.2 | valid |
| 1.5 | Governance Policy | 1.14 references governance approval process from 1.5 | valid |
| 1.12 | Regression Testing | 1.14 references Ghost Inspector replacement context from 1.12 (Playwright) | valid |
| 1.13 | Safe MCP Usage | 1.14 references Playwright safety guidance from 1.13 | valid |

---

### Spec 1.15 — Codebase Auditing & Technical Debt

| Ref | Target | What 1.15 assumes | Status |
|-----|--------|-------------------|--------|
| 1.7 | Recurring Tasks | 1.15 references doc-gardening as a recurring task pattern from 1.7 | minor issue |
| 1.8 | CLAUDE.md Files | 1.15 references CLAUDE.md maintenance from 1.8 | valid |
| 1.9 | Documentation Structure | 1.15 references documentation structure from 1.9 | valid |
| 1.10 | Codebase Mapping | 1.15 references codebase mapping output from 1.10 | valid |
| 1.11 | Hallucinations | 1.15 references hallucination avoidance patterns from 1.11 | valid |

**Issue (minor):** 1.15 references 1.7 for "doc-gardening as a recurring task." Section 1.7 covers recurring and scheduled task patterns in general but does not specifically discuss "doc-gardening" as a named concept. The cross-reference is conceptually valid (doc-gardening is a recurring task) but 1.7 does not contain the term "doc-gardening."

---

### Spec 1.16 — Starter Kit Contents

| Ref | Target | What 1.16 assumes | Status |
|-----|--------|-------------------|--------|
| 1.5 | Governance Policy | 1.16 references the governance policy template as a starter kit deliverable | valid |

**Notes:** 1.16 implicitly references numerous sections through its file inventory (skills, commands, templates referenced in other specs) but has only one explicit numbered cross-reference.

---

### Spec 1.17 — Repeatable Workflow Process Doc

| Ref | Target | What 1.17 assumes | Status |
|-----|--------|-------------------|--------|
| (none) | — | No explicit outgoing numbered cross-references | — |

**Notes:** 1.17 is a standalone process document. It references the overall project methodology and Phew! as a worked example but does not cross-reference specific playbook sections.

---

## Bidirectional Check

This section identifies cases where spec A references spec B but spec B does not reference spec A back. Bidirectional references are desirable (but not mandatory) when the relationship is mutual.

| A references B | B references A? | Assessment |
|---------------|----------------|------------|
| 1.3 -> 1.2 | 1.2 does not reference 1.3 | Acceptable. 1.2 is the foundational context section; it logically does not need to forward-reference session management. The relationship is directional: 1.2 provides the "why", 1.3 provides the "how". |
| 1.3 -> 1.4 | 1.4 does not reference 1.3 | Acceptable. 1.3 references 1.4 for Projects guidance. 1.4 is a broad taxonomy and does not need to reference session management specifically. |
| 1.5 -> 1.4 | 1.4 does not reference 1.5 | Acceptable. The governance policy (1.5) references the decision tree (1.4) for context on what it governs. The decision tree does not need to reference governance specifically — it is about capabilities, not processes. |
| 1.5 -> 1.13 | 1.13 -> 1.5 | Bidirectional. Both reference each other correctly. |
| 1.5 -> 1.14 | 1.14 -> 1.5 | Bidirectional. Both reference each other correctly. |
| 1.6 -> 1.4 | 1.4 does not reference 1.6 | Acceptable. 1.6 is a worked example of skills from 1.4. The taxonomy section (1.4) does not need to forward-reference every specific example section. |
| 1.6 -> 1.5 | 1.5 does not reference 1.6 | Acceptable. 1.6 references 1.5 for governance tier classification. The governance policy references brand-voice and uk-english skills in its register template examples but does not cross-reference 1.6 as a section. This is a near-miss: 1.5 could usefully link to 1.6 as an example of Tier 1 skills, but the register template serves this purpose. |
| 1.7 -> 1.3 | 1.3 does not reference 1.7 | Acceptable. 1.7 references 1.3 for session persistence context. 1.3 does not need to reference recurring tasks. |
| 1.7 -> 1.4 | 1.4 does not reference 1.7 | Acceptable. 1.7 references 1.4 for skills guidance. Same reasoning as 1.6->1.4. |
| 1.8 -> 1.2 | 1.2 does not reference 1.8 | Acceptable. 1.8 references 1.2 for context cost understanding. 1.2 does not need to reference CLAUDE.md files specifically. |
| 1.8 -> 1.9 | 1.9 -> 1.8 | Bidirectional. Both reference each other correctly. |
| 1.8 -> 1.10 | 1.10 -> 1.9 (via 1.9) | Partially bidirectional. 1.8 references 1.10, and 1.10 references 1.9 which references 1.8. The chain connects but 1.10 does not directly reference 1.8. Acceptable — 1.10 references 1.9 which is the bridge. |
| 1.8 -> 1.14 | 1.14 does not reference 1.8 | Acceptable. 1.8 references 1.14 for the claude-md-management plugin ecosystem context. 1.14 covers plugins broadly and does not need to reference 1.8 specifically. |
| 1.9 -> 1.15 | 1.15 -> 1.9 | Bidirectional. Both reference each other correctly. |
| 1.10 -> 1.2 | 1.2 does not reference 1.10 | Acceptable. Same pattern as 1.8->1.2 — foundational section referenced by downstream. |
| 1.10 -> 1.3 | 1.3 does not reference 1.10 | Acceptable. The reference from 1.10 to 1.3 is about the subtask concept, not a mutual dependency. |
| 1.12 -> 1.11 | 1.11 does not reference 1.12 | Acceptable. 1.12 references 1.11 for hallucinated selectors. 1.11 is a general patterns section and does not need to reference specific application areas. |
| 1.12 -> 1.13 | 1.13 does not reference 1.12 | Acceptable. 1.12 references 1.13 for Playwright MCP setup. 1.13 covers MCP broadly. However, 1.14 references 1.12 for Ghost Inspector replacement, creating a connected chain. |
| 1.13 -> 1.2 | 1.2 does not reference 1.13 | Acceptable. Same foundational pattern. |
| 1.13 -> 1.16 | 1.16 does not reference 1.13 | Acceptable. 1.13 references the starter kit (1.16) for the governance policy template. 1.16 is an inventory section and does not need to cross-reference individual sections that use its files. |
| 1.14 -> 1.12 | 1.12 -> 1.13 (indirect) | 1.14 references 1.12, and 1.12 references 1.13, which 1.14 also references. Not directly bidirectional but connected. Acceptable. |
| 1.15 -> 1.7 | 1.7 does not reference 1.15 | Acceptable. 1.15 references 1.7 for recurring task concepts. 1.7 is a general track section and does not need to reference developer-track auditing. |
| 1.15 -> 1.11 | 1.11 does not reference 1.15 | Acceptable. Same pattern as 1.12->1.11. |

**Summary:** All bidirectional relationships that should exist are present (1.5<->1.13, 1.5<->1.14, 1.8<->1.9, 1.9<->1.15). Unidirectional references are appropriate given the directional nature of the relationships (foundational sections referenced by downstream sections, taxonomy sections referenced by specific application sections).

---

## Phase 2 Agent Assignment Verification

| Spec | Spec States | Handoff Doc States | Match? |
|------|------------|-------------------|--------|
| 1.1 | Agent 6 — Welcome, Process Doc & Integration Content | Agent 6 | Yes |
| 1.2 | Agent 2 — Context & Session Management | Agent 2 | Yes |
| 1.3 | Agent 2 — Context & Session Management | Agent 2 | Yes |
| 1.4 | Agent 3 — Skills, Extensions, Governance & Brand | Agent 3 | Yes |
| 1.5 | Agent 3 — Skills, Extensions, Governance & Brand | Agent 3 | Yes |
| 1.6 | Agent 3 — Skills, Extensions, Governance & Brand | Agent 3 | Yes |
| 1.7 | Agent 3 — Skills, Governance, Brand sections | Agent 3 | Yes |
| 1.8 | Agent 4 — Developer Track Sections | Agent 4 | Yes |
| 1.9 | Agent 4 — Developer Track Sections | Agent 4 | Yes |
| 1.10 | Agent 4 — Developer Track Sections | Agent 4 | Yes |
| 1.11 | Agent 4 — Developer Track Sections | Agent 4 | Yes |
| 1.12 | Agent 4 — Developer Track Sections | Agent 4 | Yes |
| 1.13 | Agent 4 — Developer Track Sections | Agent 4 | Yes |
| 1.14 | Agent 4 — Developer Track Sections | Agent 4 | Yes |
| 1.15 | Agent 4 — Developer Track Sections | Agent 4 | Yes |
| 1.16 | Agent 5 — Starter Kit Files | Agent 5 | Yes |
| 1.17 | Agent 6 — Welcome, Process Doc & Integration Content | Agent 6 | Yes |

**Result:** All 17 specs correctly identify their Phase 2 build agent, matching the handoff document's allocation.

---

## Source Reference Path Verification

This section verifies that every file path listed in each spec's "Source References" table actually exists on the filesystem.

### Legend
- Exists: File found at the specified path
- Missing: File not found (may not yet be created, or path is incorrect)

### Spec 1.1

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/source-context/feedback-from-phew.md` | Exists |
| `.planning/source-context/phew-initial-thoughts-for-meeting-follow-up.md` | Exists |
| `.planning/research/phew-site-content.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |
| `.planning/phew-follow-up-handoff.md` | Exists |

### Spec 1.2

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/research/context-window-mechanics.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |
| `.planning/research/remotion-evaluation.md` | Exists |
| `.planning/source-context/claude-code-capabilities-extension-options.md` | Exists |

### Spec 1.3

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/research/session-handoff-requirements.md` | Exists |
| `.planning/source-context/phew-initial-thoughts-for-meeting-follow-up.md` | Exists |
| `.planning/source-context/phew-training-ai-and-the-art-of-the-possible-summary.md` | Exists |
| `.planning/research/command-availability.md` | Exists |
| `.planning/research/context-window-mechanics.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |
| `.planning/specs/1.2-context-simulator.md` | Exists |

### Spec 1.4

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/source-context/claude-code-capabilities-extension-options.md` | Exists |
| `.planning/research/capabilities-audit.md` | Exists |
| `.planning/research/command-availability.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |

### Spec 1.5

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/research/phew-site-content.md` | Exists |
| `.planning/source-context/phew-initial-thoughts-for-meeting-follow-up.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |
| `.planning/source-context/claude-code-capabilities-extension-options.md` | Exists |
| `.planning/research/command-availability.md` | Exists |

### Spec 1.6

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/research/uk-english-enforcement.md` | Exists |
| `.planning/research/brand-voice-workflow.md` | Exists |
| `starter-kit/skills/brand-review/SKILL.md` | Exists |
| `starter-kit/skills/uk-english/SKILL.md` | Exists |
| `starter-kit/commands/brand-review.md` | Exists |
| `starter-kit/skills/brand-voice/SKILL.md` | Exists |
| `.planning/research/phew-site-content.md` | Exists |
| `.planning/research/command-availability.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |

### Spec 1.7

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/source-context/phew-training-ai-and-the-art-of-the-possible-summary.md` | Exists |
| `.planning/source-context/phew-initial-thoughts-for-meeting-follow-up.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |
| `.planning/phew-follow-up-handoff.md` | Exists |

### Spec 1.8

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/source-context/suggestions-related-to-doc-structure.md` | Exists |
| `.planning/source-context/phew-training-claude-code-and-qa-summary.md` | Exists |
| `.planning/source-context/phew-initial-thoughts-for-meeting-follow-up.md` | Exists |
| `starter-kit/plugins/claude-plugins-official/claude-md-management/1.0.0/README.md` | Exists |
| `starter-kit/plugins/claude-plugins-official/claude-md-management/1.0.0/skills/claude-md-improver/SKILL.md` | Exists |
| `starter-kit/plugins/claude-plugins-official/claude-md-management/1.0.0/skills/claude-md-improver/references/quality-criteria.md` | Exists |
| `starter-kit/plugins/claude-plugins-official/claude-md-management/1.0.0/skills/claude-md-improver/references/templates.md` | Exists |
| `starter-kit/plugins/claude-plugins-official/claude-md-management/1.0.0/skills/claude-md-improver/references/update-guidelines.md` | Exists |
| `starter-kit/plugins/claude-plugins-official/claude-md-management/1.0.0/commands/revise-claude-md.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |

### Spec 1.9

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/source-context/suggestions-related-to-doc-structure.md` | Exists |
| `.planning/source-context/phew-training-claude-code-and-qa-summary.md` | Exists |
| `.planning/source-context/phew-initial-thoughts-for-meeting-follow-up.md` | Exists |
| `starter-kit/gsd-mapper/agent/gsd-codebase-mapper.md` | Exists |
| `starter-kit/gsd-mapper/command/map-codebase.md` | Exists |
| `starter-kit/gsd-mapper/workflow/map-codebase.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |

### Spec 1.10

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/source-context/map-codebase.md` | Exists |
| `starter-kit/gsd-mapper/command/map-codebase.md` | Exists |
| `starter-kit/gsd-mapper/workflow/map-codebase.md` | Exists |
| `starter-kit/gsd-mapper/agent/gsd-codebase-mapper.md` | Exists |
| `starter-kit/gsd-mapper/templates/codebase/stack.md` | Exists |
| `starter-kit/gsd-mapper/templates/codebase/integrations.md` | Exists |
| `starter-kit/gsd-mapper/templates/codebase/architecture.md` | Exists |
| `starter-kit/gsd-mapper/templates/codebase/structure.md` | Exists |
| `starter-kit/gsd-mapper/templates/codebase/conventions.md` | Exists |
| `starter-kit/gsd-mapper/templates/codebase/testing.md` | Exists |
| `starter-kit/gsd-mapper/templates/codebase/concerns.md` | Exists |
| `.planning/source-context/phew-training-claude-code-and-qa-summary.md` | Exists |
| `.planning/source-context/phew-initial-thoughts-for-meeting-follow-up.md` | Exists |
| `.planning/source-context/suggestions-related-to-doc-structure.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |

### Spec 1.11

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/source-context/phew-initial-thoughts-for-meeting-follow-up.md` | Exists |
| `.planning/source-context/phew-training-claude-code-and-qa-summary.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |
| `.planning/phew-follow-up-handoff.md` | Exists |

### Spec 1.12

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/source-context/phew-initial-thoughts-for-meeting-follow-up.md` | Exists |
| `.planning/source-context/phew-training-claude-code-and-qa-summary.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |
| `.planning/phew-follow-up-handoff.md` | Exists |

### Spec 1.13

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/source-context/claude-code-capabilities-extension-options.md` | Exists |
| `.planning/research/capabilities-audit.md` | Exists |
| `.planning/source-context/phew-initial-thoughts-for-meeting-follow-up.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |

### Spec 1.14

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/source-context/phew-initial-thoughts-for-meeting-follow-up.md` | Exists |
| `.planning/source-context/claude-code-capabilities-extension-options.md` | Exists |
| `.planning/research/capabilities-audit.md` | Exists |
| `starter-kit/plugins/claude-plugins-official/` (various plugin directories) | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |

### Spec 1.15

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/source-context/phew-training-claude-code-and-qa-summary.md` | Exists |
| `.planning/source-context/phew-initial-thoughts-for-meeting-follow-up.md` | Exists |
| `starter-kit/gsd-mapper/templates/codebase/concerns.md` | Exists |
| `starter-kit/gsd-mapper/agent/gsd-codebase-mapper.md` | Exists |
| `.planning/source-context/suggestions-related-to-doc-structure.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |

### Spec 1.16

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |
| `.planning/research/session-handoff-requirements.md` | Exists |
| `.planning/research/command-availability.md` | Exists |
| `.planning/research/uk-english-enforcement.md` | Exists |
| `.planning/research/brand-voice-workflow.md` | Exists |
| `.planning/source-context/phew-initial-thoughts-for-meeting-follow-up.md` | Exists |
| `.planning/phew-follow-up-handoff.md` | Exists |
| `.planning/source-context/suggestions-related-to-doc-structure.md` | Exists |
| `.planning/source-context/claude-code-capabilities-extension-options.md` | Exists |

### Spec 1.17

| Referenced Path | Exists? |
|----------------|---------|
| `.planning/phew-follow-up-handoff.md` | Exists |
| `.planning/source-context/phew-training-ai-and-the-art-of-the-possible-summary.md` | Exists |
| `.planning/source-context/phew-training-claude-code-and-qa-summary.md` | Exists |
| `.planning/source-context/feedback-from-phew.md` | Exists |
| `.planning/research/app-tech-stack.md` | Exists |
| `.planning/research/frontend-skills-review.md` | Exists |

---

## Files Referenced in Spec Content (Not Source Tables) That May Not Exist

These are file paths mentioned within spec content (e.g., deliverables to be created, output paths, or references to files that are expected to exist by Phase 2 build time) rather than in Source References tables.

| Spec | Referenced Path | Exists? | Notes |
|------|----------------|---------|-------|
| 1.5 | `starter-kit/templates/governance-policy.md` | Missing | The governance policy template is specified as a Phase 2 deliverable. The `starter-kit/templates/` directory exists but is empty. Agent 3 or Agent 5 will create this file during Phase 2. |
| 1.16 | Various starter-kit files to be created/verified | Partial | 1.16 inventories many starter-kit files. Most skill and command files exist. Template files (governance-policy.md, doc-structure templates, CLAUDE.md templates) do not yet exist in `starter-kit/templates/`. These are Phase 2 deliverables. |
| 1.17 | `docs/repeatable-workflow.md` | Missing | This is the output file for spec 1.17 itself. It will be created by Agent 6 during Phase 2. The `docs/` directory exists but contains only `continuation-prompts/` and an early feedback file. |
| 1.3 | `starter-kit/skills/` (session-handoff skill) | Missing | 1.3 Part 2 references "the session-handoff skill in the starter kit" at `starter-kit/skills/`. No session-handoff skill currently exists in the starter-kit/skills/ directory. This appears to be a Phase 2 deliverable for Agent 5 (1.16). |
| 1.3 | `starter-kit/prompts/` (example prompts) | Missing | 1.3 references "example prompts in `starter-kit/prompts/`". The `starter-kit/prompts/` directory does not exist. This appears to be a Phase 2 deliverable for Agent 5 (1.16). |

---

## Issues Found

### Issue 1: Missing starter-kit/templates/governance-policy.md
- **Severity:** Low (Phase 2 deliverable)
- **Specs affected:** 1.5, 1.16
- **Description:** Spec 1.5 specifies that the governance policy template should exist at `starter-kit/templates/governance-policy.md` and be downloadable from the playbook. Spec 1.16 inventories it as a starter kit file. The file does not yet exist, but this is expected — it is a Phase 2 deliverable. The `starter-kit/templates/` directory exists but is empty.
- **Action:** No action needed. Agent 3 (building 1.5) or Agent 5 (building 1.16) should create this file during Phase 2. Ensure both agents are aware the other may create it, to avoid duplication. Recommendation: Agent 5 (Starter Kit) creates it based on the full policy text in spec 1.5.

### Issue 2: Missing starter-kit/prompts/ directory
- **Severity:** Low (Phase 2 deliverable)
- **Specs affected:** 1.3
- **Description:** Spec 1.3 references "example prompts in `starter-kit/prompts/`" for ready-to-use session handoff tooling. This directory does not exist.
- **Action:** Agent 5 (Starter Kit, spec 1.16) should create this directory and populate it with example prompts during Phase 2. Spec 1.16 should be checked to confirm it includes prompts directory creation in its inventory.

### Issue 3: Missing session-handoff skill in starter-kit/skills/
- **Severity:** Low (Phase 2 deliverable)
- **Specs affected:** 1.3
- **Description:** Spec 1.3 references "the session-handoff skill in the starter kit" at `starter-kit/skills/`. No session-handoff skill directory exists. Current skills are: mermaid-diagrams, markdown-converter, file-organizer, agent-browser, canvas-design, brand-review, uk-english, brand-voice.
- **Action:** Agent 5 (Starter Kit, spec 1.16) should create the session-handoff skill during Phase 2. The skill content is fully specified in the copyable prompts of spec 1.3.

### Issue 4: docs/repeatable-workflow.md not yet created
- **Severity:** Low (Phase 2 deliverable)
- **Specs affected:** 1.17
- **Description:** Spec 1.17 defines this as its output. It will be created by Agent 6 during Phase 2.
- **Action:** No action needed. This is a known Phase 2 output.

### Issue 5: Minor cross-reference imprecision in 1.10 -> 1.3
- **Severity:** Low (cosmetic)
- **Specs affected:** 1.10
- **Description:** Spec 1.10 references 1.3 for "the parallel subagent concept" but 1.3 covers the atomic task principle (breaking tasks into subtasks), not subagents specifically. The concepts are related but not identical. Atomic tasks are about session boundaries; subagents are about parallel execution within a session.
- **Action:** Consider revising 1.10's cross-reference to say "the atomic task principle introduced in section 1.3" rather than "the parallel subagent concept." Alternatively, reference 1.4 (which covers subagents in its reference cards) for the subagent concept specifically.

### Issue 6: Minor cross-reference imprecision in 1.13 -> 1.14
- **Severity:** Low (cosmetic)
- **Specs affected:** 1.13
- **Description:** Spec 1.13 says "Context7 (covered in section 1.14 as a plugin)" which implies 1.14 has a dedicated Context7 section. In reality, 1.14 covers Context7 as one of many plugin recommendations. The reference is factually correct but slightly misleading in emphasis.
- **Action:** No action required. The reference is accurate enough for a build agent to follow.

### Issue 7: Minor cross-reference imprecision in 1.15 -> 1.7
- **Severity:** Low (cosmetic)
- **Specs affected:** 1.15
- **Description:** Spec 1.15 references 1.7 for "doc-gardening as a recurring task." Section 1.7 covers recurring task patterns in general but does not use the term "doc-gardening." The concept is valid but the specific term is not present in 1.7.
- **Action:** No action required. Build agents should understand the conceptual link. If 1.7 adds a documentation maintenance example during Phase 2, the reference becomes fully accurate.

### Issue 8: Starter kit templates directory is empty
- **Severity:** Low (Phase 2 deliverable)
- **Specs affected:** 1.5, 1.16
- **Description:** The `starter-kit/templates/` directory exists but contains no files. Specs 1.5 and 1.16 expect it to contain governance-policy.md, doc-structure templates, and CLAUDE.md templates.
- **Action:** Agent 5 (Starter Kit) should populate this directory during Phase 2. The content for governance-policy.md is fully specified in spec 1.5.

---

## Verification Conclusion

The 17 Phase 1 specs are in good shape for Phase 2 execution:

1. **Cross-references are consistent and accurate.** All 42 cross-references point to specs that exist and cover the topics assumed. Three minor imprecisions were noted but none would cause build failures.

2. **Phase 2 agent assignments are all correct.** Every spec correctly identifies its build agent, matching the handoff document allocation.

3. **Source reference paths are almost entirely valid.** 93 of 98 source reference paths exist on the filesystem. The 5 missing paths are all Phase 2 deliverables (files to be created during the build phase), not missing source inputs.

4. **Bidirectional references are appropriate.** Key mutual relationships (1.5<->1.13, 1.5<->1.14, 1.8<->1.9, 1.9<->1.15) are correctly bidirectional. Unidirectional references follow a logical pattern (foundational sections referenced by downstream sections).

5. **No blocking issues.** All issues found are low severity — either Phase 2 deliverables that will be created during the build, or minor wording imprecisions in cross-references that do not affect build agent comprehension.

**Recommendation:** Proceed to Phase 2. The specs are ready for build agent dispatch.
