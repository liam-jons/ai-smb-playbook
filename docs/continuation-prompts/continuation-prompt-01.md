# Session Continuation Prompt

Copy everything below the line into a new Claude Code session to continue this project.

---

## Context

This is a post-training follow-up deliverable for Phew Design Limited. The project produces three outputs: an interactive React playbook app, a starter kit of drop-in files, and a repeatable workflow process doc.

**Primary planning document:** `.planning/phew-follow-up-handoff.md` — read this first for full context on phases, dependencies, section specs, design decisions, and coverage checklist.

**CLAUDE.md** is already in place at the project root with critical rules (UK English, two-track content, self-contained specs, etc.).

## Current State

**Phase 0 (Research) is complete.** All 7 research outputs are committed in `.planning/research/`:

| File | Key Findings |
|------|-------------|
| `phew-site-content.md` | Company context: safeguarding/public sector/education/healthcare specialist, ~10-49 staff, ISO 9001/27001/14001, Cyber Essentials Plus, IMPACT values, WordPress + ASP.NET + C# stack |
| `uk-english-enforcement.md` | Layered approach recommended: profile preferences + CLAUDE.md rule + project instructions. Brand-review doesn't natively check UK vs US English. A ready-to-use UK English skill file is included — save as `starter-kit/skills/uk-english.md` |
| `command-availability.md` | Slash commands are Claude Code/CoWork only. Claude Desktop/claude.ai use skills via natural language matching. Recommend admin-provisioned org-wide skills via Teams admin console for non-dev users. Teams has full Projects support |
| `brand-voice-workflow.md` | Brand-voice skill is a structured conversation framework, not a wizard. User and Claude build a brand voice document together. Brand-review checks content against that saved document. Both work across all platforms |
| `context-window-mechanics.md` | Comprehensive data for the simulator: 200k window, segment breakdown (system ~3-8.5k, tools ~12-20k, CLAUDE.md ~1-10k, MCP 0-60k+), response buffer ~33-45k, compaction mechanics, U-shaped attention degradation, confidence ratings per claim |
| `capabilities-audit.md` | Source doc is a verbatim copy of current live docs — confirmed accurate. Three new mechanisms to add: LSP servers, prompt/agent-based hooks, subagent persistent memory. Agent teams still experimental |
| `app-tech-stack.md` | shadcn/ui, React Router v7 (library mode), Shiki via react-shiki, Motion (formerly Framer Motion), custom SVG/div for simulator, native clipboard API. Includes exact install commands and file structure conventions |

## What's Next: Phase 1 (Section Planning)

Phase 1 produces self-contained specs in `.planning/specs/` for each playbook section. Each spec gives a build agent everything it needs. The handoff doc (sections "Phase 1: Section Planning" and "Dependencies & Sequencing") defines all 17 specs (1.1–1.17).

**Critical rules for specs:**
- Every spec must reference the relevant source context documents from `.planning/source-context/` (not assume knowledge from the handoff alone)
- Every spec must reference `.planning/research/app-tech-stack.md` for UI component and interaction pattern decisions
- Each spec must be self-contained: a build agent reading only that spec + referenced files should have everything it needs
- Include acceptance criteria specific to that section

**Dependency map (which research feeds which spec):**
- 0.1 (site scrape) → 1.5 (governance policy)
- 0.2 (UK English) → 1.6 (brand voice & UK English)
- 0.3 (command availability) → 1.3 (session management — handoff packaging), 1.4 (skills/extensions)
- 0.4 (brand voice) → 1.6 (brand voice & UK English)
- 0.5 (context window) → 1.2 (context simulator)
- 0.6 (capabilities audit) → 1.4 (skills/extensions decision tree)
- 0.7 (tech stack) → ALL specs

**Recommended approach:** Write specs in batches that can be parallelised. The specs are largely independent of each other (they depend on Phase 0 outputs, not on each other). You could write all 17 in parallel, or batch them by track:
- Batch A: General track (1.1–1.7)
- Batch B: Developer track (1.8–1.15)
- Batch C: Starter kit + process doc (1.16–1.17)

After all specs are written and reviewed, Phase 2 launches 6 parallel build agents. Phase 2 requires the app shell (Agent 1) to complete first so other agents can slot their outputs in.

## Commands

```bash
# Check project state
git log --oneline
ls .planning/research/
ls .planning/specs/

# Once app is scaffolded (Phase 2)
cd app && npm run dev
cd app && npm run build
```
