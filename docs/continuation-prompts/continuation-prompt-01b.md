# Session Continuation Prompt — Phase 1 Ready

Copy everything below the line into a new Claude Code session to continue this project.

---

## Context

This is a post-training follow-up deliverable for Phew Design Limited (UK-based SMB, 9-11 employees). Three outputs: interactive React playbook app, starter kit of drop-in files, and a repeatable workflow process doc.

**Read first:** `.planning/phew-follow-up-handoff.md` — the primary planning document with full phase definitions, section specs, dependencies, coverage checklist, and design decisions.

**CLAUDE.md** is at the project root with critical rules (UK English, two-track content, self-contained specs, copy-to-clipboard requirement, parameterised governance, meta-narrative).

## Completed Work

### Phase 0 (Research) — Complete

All 7 research outputs in `.planning/research/`:

| File | Summary |
|------|---------|
| `phew-site-content.md` | Safeguarding/public sector specialist. ISO 9001/27001/14001, Cyber Essentials Plus. IMPACT values. WordPress + ASP.NET + C#. 9-11 staff, full attendee list with roles. AaaS offering. |
| `uk-english-enforcement.md` | **claude.ai/Desktop users:** profile preferences (option 1), one-line project instruction (option 3), upload UK English skill (option 6), brand-review catches issues (option 8). **Claude Code users:** CLAUDE.md rule (option 2), Britfix hook as advanced fallback (option 7). Skill already at `starter-kit/skills/uk-english/SKILL.md`. |
| `command-availability.md` | Slash commands are Claude Code/CoWork only. claude.ai/Desktop use skills via natural language. Recommend admin-provisioned org-wide skills via Teams admin console. Teams has full Projects support. Commands should be packaged as skills for non-Code users. |
| `brand-voice-workflow.md` | Brand-voice skill is a structured conversation framework. User + Claude build a brand voice doc together. Brand-review (now also a skill at `starter-kit/skills/brand-review/SKILL.md`) checks content against that doc. Site scrape content can seed the setup. Includes session management guidance for when to review in-session vs fresh session. |
| `context-window-mechanics.md` | 200k window. Segment breakdown with ballpark ranges. Response buffer ~33-45k. Compaction mechanics. U-shaped attention degradation. Confidence ratings. Data structured for the proportional visualisation. |
| `capabilities-audit.md` | Source doc confirmed current. Three new mechanisms: LSP servers, prompt/agent-based hooks, subagent persistent memory. Agent teams still experimental. **Key note:** decision tree must distinguish features available to non-technical users (claude.ai/Desktop) vs technical users (Claude Code). |
| `app-tech-stack.md` | shadcn/ui, React Router v7 (library mode), Shiki via react-shiki, Motion (formerly Framer Motion), custom SVG/div for simulator, native clipboard API. Includes install commands and file structure conventions. |

### Phase 0b (Feedback Amendments) — Complete

Additional research and amendments per user review:

| File | Summary |
|------|---------|
| `remotion-evaluation.md` | Stick with custom div + Tailwind + Motion. Remotion's timeline paradigm doesn't fit the event-driven simulator. Document notes tipping points if video needs emerge later. |
| `frontend-skills-review.md` | 10 topic areas extracted from 6 frontend skill files: typography, colour, layout, motion, interaction, responsive, performance, components, accessibility, visual quality. **Includes a 45-item Build Agent Checklist** ready to copy-paste into Phase 2 specs. |
| `session-handoff-requirements.md` | 5 handoff scenario types identified from 22 real-world examples. User group adaptations (technical vs non-technical). Token-awareness bands (5 levels). Proposed skill structure with core SKILL.md + 4 reference files + supporting materials. |

### Starter Kit Additions (Phase 0b)

- `starter-kit/skills/brand-review/SKILL.md` — skill version of brand-review (for claude.ai/Desktop)
- `starter-kit/skills/uk-english/SKILL.md` — UK English enforcement skill
- `starter-kit/commands/brand-review.md` — updated with UK English in Style Guide Compliance section
- `.planning/research/continuation-prompt-examples/` — 22 real-world examples across 3 projects (reference for session handoff skill)

## What's Next: Phase 1 (Section Planning)

Phase 1 produces self-contained specs in `.planning/specs/` for each playbook section. See handoff doc sections "Phase 1: Section Planning" for all 17 specs (1.1–1.17).

### Spec Requirements

Every spec must:
- Reference relevant source context from `.planning/source-context/`
- Reference `.planning/research/app-tech-stack.md` for UI decisions
- Reference `.planning/research/frontend-skills-review.md` for design guidelines and the Build Agent Checklist
- Be self-contained: a build agent reading only that spec + referenced files should have everything needed
- Include acceptance criteria specific to that section
- Account for two user groups where relevant (non-technical on claude.ai/Desktop, technical on Claude Code)

### Dependency Map (Research → Spec)

- `phew-site-content.md` → 1.5 (governance policy)
- `uk-english-enforcement.md` → 1.6 (brand voice & UK English)
- `command-availability.md` → 1.3 (session management — handoff packaging), 1.4 (skills/extensions)
- `brand-voice-workflow.md` → 1.6 (brand voice & UK English)
- `context-window-mechanics.md` → 1.2 (context simulator)
- `capabilities-audit.md` → 1.4 (skills/extensions decision tree)
- `remotion-evaluation.md` → 1.2 (confirms custom div approach)
- `frontend-skills-review.md` → ALL specs
- `session-handoff-requirements.md` → 1.3 (session management), 1.16 (starter kit)
- `app-tech-stack.md` → ALL specs

### Recommended Batching

Specs are largely independent of each other (they depend on Phase 0 outputs, not on each other). Write in parallel:
- **Batch A:** General track (1.1–1.7)
- **Batch B:** Developer track (1.8–1.15)
- **Batch C:** Starter kit + process doc (1.16–1.17)

### Open Items

1. **Direct team page scrape** — `https://www.phew.org.uk/about-phew/the-team/` couldn't be scraped due to permissions. Low priority but would add role descriptions/bios.
2. **Session handoff skill creation** — requirements doc is done, actual skill + templates + references to be built as part of Phase 1.16 (starter kit spec) or as a standalone task.
