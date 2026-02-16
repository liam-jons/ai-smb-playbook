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
app/                          # React playbook app (Vite + React + Tailwind v4 + TypeScript)
  ├── src/
  │   ├── components/
  │   │   ├── content/        # Content display (CodeBlock, CopyButton, PromptExample, SectionPage)
  │   │   ├── interactive/    # Interactive widgets (ContextWindowSimulator)
  │   │   ├── layout/         # App shell (AppLayout, Header, Sidebar, Footer, HomePage, TrackLayout)
  │   │   └── ui/             # shadcn/ui primitives (button, card, tabs, dialog, etc.)
  │   ├── content/
  │   │   ├── general/        # General track sections (6 section components)
  │   │   ├── developer/      # Developer track sections (8 section components)
  │   │   └── shared/         # Section registry, types, shared data, StarterKit & Welcome sections
  │   ├── routes/             # React Router config (router.tsx)
  │   ├── hooks/              # Custom hooks (useCopyToClipboard, useTheme, useTrack)
  │   ├── config/             # Site config (site.ts)
  │   ├── lib/                # Utilities (utils.ts — cn() helper)
  │   └── assets/
  └── dist/                   # Production build output
.planning/                    # All planning artefacts
  ├── source-context/         # 7 source documents from training sessions and research
  ├── research/               # Phase 0 outputs (research findings)
  ├── specs/                  # Phase 1 outputs (section-level build specs)
  ├── ux-review/              # UX review findings and fixes
  └── continuation-prompts/   # Session continuation prompts
starter-kit/                  # Deliverable files for client
  ├── skills/                 # .md skill files (13 provided)
  ├── commands/               # .md command files
  ├── gsd-mapper/             # Codebase mapper agent, command, templates, workflow
  ├── plugins/
  │   └── claude-plugins-official/  # Reference copies of 14 plugins (not functional in-repo)
  ├── templates/              # Governance policy, doc structure, CLAUDE.md templates
  └── prompts/                # Session handoff prompts, example prompts
docs/
  └── repeatable-workflow.md  # Internal process doc
vercel.json                   # Vercel deployment config (region: lhr1, SPA rewrites, security headers)
```

## Tech Stack

- **Framework:** Vite + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (Radix primitives)
- **Routing:** React Router v7
- **Syntax highlighting:** Shiki
- **Animations:** Motion (Framer Motion)
- **Package manager:** bun
- **Hosting:** Vercel (region: `lhr1` London)

## Build & Dev Commands

All commands run from the `app/` directory:
```bash
cd app && bun install        # Install dependencies
cd app && bun run dev        # Local dev server (port 4100)
cd app && bun run build      # TypeScript check + production build
cd app && bun run lint       # ESLint
cd app && bun run preview    # Preview production build locally
cd app && bunx tsc --noEmit  # Type check only (no emit)
```

No test suite is configured. Current quality checks are `build` (TypeScript) and `lint` (ESLint).

## Deployment

- **Production:** https://ai-smb-playbook.vercel.app
- **GitHub:** https://github.com/liam-jons/ai-smb-playbook
- Auto-deploys on push to `main` via Vercel
- Vercel root directory is set to `app` (configured in Vercel dashboard, not `vercel.json`)
- `vercel.json` lives at the repo root with SPA rewrites, security headers, and asset caching

## Environment Variables

Set in the Vercel dashboard (not committed to the repo):

| Variable | Purpose | Notes |
|----------|---------|-------|
| `RESEND_API_KEY` | Resend email API key for the feedback widget | Separate staging/production keys configured |

- **Feedback sender domain:** `feedback.aisolutionhub.co.uk`
- **Feedback recipient:** `liam@aisolutionhub.co.uk`
- **Other available domains:** `hello@`, `updates@`, `no-reply@`, and root `@aisolutionhub.co.uk` (reserved for future outgoing mail)
- Feedback widget submits via Vercel serverless function at `/api/feedback`

## Phased Build Process

All build phases (0–5) are complete. Planning artefacts (research, specs, UX review) are retained in `.planning/` for reference. See `.planning/phew-follow-up-handoff.md` for phase details.

## Code Conventions

- **Path aliases:** `@/` maps to `app/src/` (configured in `tsconfig.app.json` and `vite.config.ts`)
- **Component patterns:** shadcn/ui components in `components/ui/`, app components in `components/layout/` and `components/content/`
- **Content architecture:** Section content lives in `content/{general,developer}/` as standalone React components, registered in `content/shared/registry.ts`. To add a new section, create the component and add it to the registry.
- **Styling:** Tailwind utility classes via `cn()` helper from `lib/utils.ts`. Dark mode supported via `useTheme` hook.
- **Track detection:** `useTrack()` hook returns `{ track, isDev, isGeneral }` for track-conditional rendering.
- **Site config:** All client-specific values (company name, URLs, email addresses) are centralised in `config/site.ts`. Edit only this file to rebrand for a different client.

## Gotchas

- **Tailwind v4 — no config file.** This project uses Tailwind v4, which is CSS-based. There is no `tailwind.config.js`. Theme customisation is in `app/src/index.css` via `@theme inline {}`. Don't create a JS config file.
- **shadcn/ui components are generated.** Files in `components/ui/` are added via `bunx shadcn add <component>`, not hand-written. Don't manually create UI primitives.
- **Vercel root directory mismatch.** `vercel.json` is at the repo root, but Vercel's root directory is set to `app` in the dashboard. The serverless `api/` directory also lives under `app/`.

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
