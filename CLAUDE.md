# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Post-training follow-up deliverable for Phew Design Limited (UK-based SMB). Three outputs:
1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, commands, templates, governance policy
3. **Repeatable Workflow Process Doc** — Internal process documentation

The primary planning document is `.planning/phew-follow-up-handoff.md` — read it for full context on phases, dependencies, section specs, and design decisions.

## Architecture

```
.planning/                    # All planning artefacts
  ├── source-context/         # 7 source documents from training sessions and research
  ├── research/               # Phase 0 outputs (research findings)
  └── specs/                  # Phase 1 outputs (section-level build specs)
app/                          # React playbook app (Vite + React + Tailwind)
  └── src/
      ├── components/
      │   ├── shared/         # Navigation, layout, copy button, feedback widget
      │   ├── general/        # General track sections (1.1–1.7)
      │   └── dev/            # Developer track sections (1.8–1.15)
      ├── data/               # Content data (section text, prompts, examples)
      └── assets/
starter-kit/                  # Deliverable files for client
  ├── skills/                 # .md skill files (10 provided)
  ├── commands/               # .md command files
  ├── gsd-mapper/             # Codebase mapper agent, command, templates, workflow
  ├── plugins/
  │   └── claude-plugins-official/  # Reference copies of 14 plugins (not functional in-repo)
  ├── templates/              # Governance policy, doc structure, CLAUDE.md templates
  └── prompts/                # Session handoff prompts, example prompts
docs/
  └── repeatable-workflow.md  # Internal process doc
```

## Build & Dev Commands

App is not yet scaffolded. When created, it will use:
- **Vite + React + Tailwind CSS** (tech stack confirmed in handoff)
- **Hosting:** Vercel
- **Package manager:** TBD in Phase 0.7 (app tech stack research)

Once `app/` is scaffolded, typical commands will be:
```bash
cd app && npm run dev        # Local dev server
cd app && npm run build      # Production build
cd app && npm run preview    # Preview production build
```

## Phased Build Process

Agents working on this project follow a strict phase sequence. Read `.planning/phew-follow-up-handoff.md` sections "Phases" and "Dependencies & Sequencing" before starting work.

- **Phase 0:** Research tasks write to `.planning/research/`
- **Phase 1:** Section specs write to `.planning/specs/` — each must be self-contained
- **Phase 2:** 6 parallel build agents, each working from their assigned spec
- **Phase 3:** Integration and polish
- **Phase 4:** Packaging and deployment

## Critical Rules

- **UK English throughout.** All content, examples, and copy must use UK English spelling and grammar. Use £ not $, UK regulatory references where relevant.
- **UK audience.** Phew! are a UK-based company. All examples should be contextually appropriate.
- **Copy-to-clipboard on every prompt/template.** Every copyable code block, prompt, or template must have a copy button.
- **Two-track content.** General track (non-technical) and Developer track (technical depth). Never overwhelm the general audience with dev concepts.
- **Self-contained specs.** A build agent reading only its spec + referenced files should have everything needed. Don't assume knowledge from the handoff doc.
- **Governance policy is parameterised.** Company name, industry, team size are variables — the template must be reusable for other clients.
- **Starter kit plugins are reference copies.** Files in `starter-kit/plugins/` were copied from a global Claude setup for review purposes. They are not functional in this repo.
- **Source context is primary reference.** Agents must read files from `.planning/source-context/` directly when working on relevant sections — don't rely solely on summaries.
- **Meta-narrative.** Where natural, reference that this deliverable was built using the same tools and workflows covered in the training.

## Client Context

- **Company:** Phew Design Limited (https://www.phew.org.uk/)
- **Licences:** Claude Teams for all staff; developers have Claude Code access (likely via IDE)
- **AI maturity:** Familiar with Claude for general tasks, not yet familiar with sessions, context windows, skills, or structured AI workflows
- **Tone:** Practical, non-condescending, SMB-appropriate (not enterprise jargon)
