# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

AI SMB Playbook — a reusable React application that provides interactive guidance for small/medium businesses adopting Claude AI. The app is deployed as a multi-tenant SPA — each client gets a subdomain and a JSON config file. A single build serves all clients. Two outputs per client deployment:
1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, commands, templates, governance policy

The application overview is at `docs/reference/application-overview.md` — read it for architecture, content model, parameterisation, and client onboarding steps. The current deployment is for Phew Design Limited (UK-based SMB); client-specific artefacts are in `.planning/client-specific/00-phew/`.

## Architecture

```
app/                          # React playbook app (Vite + React + Tailwind v4 + TypeScript)
  ├── api/
  │   └── feedback.ts         # Vercel serverless function (Resend email)
  ├── src/
  │   ├── components/
  │   │   ├── content/        # Content display (CodeBlock, CalloutCard, CopyButton, PromptExample, SectionPage, ShikiHighlighter)
  │   │   ├── interactive/    # Context window simulator (ContextWindowSimulator + sub-components)
  │   │   ├── layout/         # App shell (AppLayout, Header, Sidebar, Footer, HomePage, TrackLayout, FeedbackWidget, ThemeSettings, NotFoundPage)
  │   │   └── ui/             # shadcn/ui primitives (18 components — added via `bunx shadcn add`)
  │   ├── content/
  │   │   ├── general/        # General track sections (7 section components)
  │   │   ├── developer/      # Developer track sections (8 section components)
  │   │   └── shared/         # Section registry, types, data files, StarterKit, Welcome & ProcessDoc pages
  │   ├── routes/             # React Router config (router.tsx)
  │   ├── hooks/              # Custom hooks (useAccessibility, useCopyToClipboard, useTheme, useTrack)
  │   ├── themes/             # Accessibility modes & font definitions (index.ts)
  │   ├── config/             # Site config (site.ts)
  │   ├── lib/                # Utilities (utils.ts — cn() helper)
  │   └── assets/
  └── dist/                   # Production build output (gitignored)
.planning/                    # Planning artefacts
  ├── client-specific/        # Per-client context, specs, and history (00-phew/, 01-amd/, …)
  ├── research/               # Reusable research (market-research/, accessibility, capabilities)
  └── plan-files/             # Execution plans
starter-kit/                  # Deliverable files for client
  ├── skills/                 # .md skill files (13 provided)
  ├── commands/               # .md command files
  ├── gsd-mapper/             # Codebase mapper agent, command, templates, workflow
  ├── plugins/
  │   └── claude-plugins-official/  # Reference copies of 14 plugins (not functional in-repo)
  ├── templates/              # Governance policy, doc structure, CLAUDE.md templates
  └── prompts/                # Session handoff prompts, example prompts
docs/
  ├── reference/              # Active reference docs (application-overview, frontend-skills-review, templates)
  ├── audit-findings/         # Audit reports (date-stamped: YYYYMMDD-type/)
  ├── continuation-prompts/   # Reusable continuation prompt templates
  └── repeatable-workflow.md  # Internal process doc
package.json                  # Repo-root package (workspace config)
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
cd app && bun run format     # Prettier — format all files
cd app && bun run format:check  # Prettier — check without writing
cd app && bun run preview    # Preview production build locally
cd app && bunx tsc --noEmit  # Type check only (no emit)
```

```bash
cd app && bunx shadcn add <component>  # Add a new shadcn/ui primitive
```

No test suite is configured. Current quality checks are `build` (TypeScript), `lint` (ESLint), and `format:check` (Prettier).

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

- Feedback widget submits via Vercel serverless function at `/api/feedback` (Resend SDK, sender domain `feedback.aisolutionhub.co.uk`)

## Code Conventions

- **Path aliases:** `@/` maps to `app/src/` (configured in `tsconfig.app.json` and `vite.config.ts`)
- **Component patterns:** shadcn/ui components in `components/ui/`, app components in `components/layout/` and `components/content/`
- **Content architecture:** Section content lives in `content/{general,developer}/` as standalone React components, registered in `content/shared/registry.ts`. To add a new section, create the component and add it to the registry.
- **Styling:** Tailwind utility classes via `cn()` helper from `lib/utils.ts`. Dark mode supported via `useTheme` hook.
- **Track detection:** `useTrack()` hook returns `{ track, isDev, isGeneral }` for track-conditional rendering.
- **Site config:** All client-specific values (company name, URLs, email addresses) are centralised in `config/site.ts`. Edit only this file to rebrand for a different client.
- **Accessibility:** `useAccessibility` hook + `themes/index.ts` provide dyslexia, high-contrast, and large-text modes with multiple font options. Modes are persisted to localStorage.
- **Analytics:** Vercel Web Analytics (`@vercel/analytics`) is integrated — do not add duplicate tracking scripts.
- **Frontend guidelines:** Comprehensive design and engineering guidelines are in `docs/reference/frontend-skills-review.md`. Consult this when doing any frontend work — it covers typography, colour, layout, motion, interaction design, performance, accessibility, and visual quality standards with a build checklist.

## Gotchas

- **Tailwind v4 — no config file.** This project uses Tailwind v4, which is CSS-based. There is no `tailwind.config.js`. Theme customisation is in `app/src/index.css` via `@theme inline {}`. Don't create a JS config file.
- **shadcn/ui components are generated.** Files in `components/ui/` are added via `bunx shadcn add <component>`, not hand-written. Don't manually create UI primitives.
- **Vercel root directory.** `vercel.json` is at the repo root but Vercel's root directory is set to `app` in the dashboard. This is intentional — the serverless `api/` directory and `package.json` (with dependencies like `resend`) live under `app/`, so Vercel must install and build from there. Do not change the root directory to repo root without also moving the API function and its dependencies.

## Critical Rules

- **UK English throughout.** All content, examples, and copy must use UK English spelling and grammar. Use £ not $, UK regulatory references where relevant.
- **UK audience.** Target clients are UK-based SMBs. All examples should be contextually appropriate (UK regulations, UK business practices, UK spelling).
- **Copy-to-clipboard on every prompt/template.** Every copyable code block, prompt, or template must have a copy button.
- **Two-track content.** General track (non-technical) and Developer track (technical depth). Never overwhelm the general audience with dev concepts.
- **Governance policy is parameterised.** Company name, industry, team size are variables — the template must be reusable for other clients.
- **Starter kit plugins are reference copies.** Files in `starter-kit/plugins/` were copied from a global Claude setup for review purposes. They are not functional in this repo.

## Client Context

The application is parameterised for per-client deployment. All client-specific values live in `config/site.ts` (see `docs/reference/application-overview.md` for the full onboarding checklist).

**Current deployment:** Phew Design Limited (https://www.phew.org.uk/) — UK design agency, Claude Teams for all staff, developers have Claude Code access.

**Target audience profile:** UK-based SMBs familiar with Claude for general tasks but not yet experienced with sessions, context windows, skills, or structured AI workflows.

**Tone:** Practical, non-condescending, SMB-appropriate (not enterprise jargon).

## Design Context

### Users
UK-based SMB employees (primarily Phew Design Limited staff) who are familiar with Claude for general tasks but have not yet used sessions, context windows, skills, or structured AI workflows. They access this playbook during or after a training session to learn practical Claude techniques for their role. Two distinct audiences within the same organisation: general team members (content, admin, project management) and developers (Claude Code, CLAUDE.md, testing workflows). The job to be done is "learn to use Claude effectively and confidently, without feeling overwhelmed by AI complexity."

### Brand Personality
**Practical, clear, approachable.** The voice is that of a knowledgeable colleague who explains things plainly — never condescending, never jargon-heavy, never hyping AI capabilities beyond what's real. UK English throughout.

**Emotional goals:** Confidence + trust. The interface should communicate "I can do this" (removing AI intimidation) while also feeling serious and well-made (establishing B2B credibility). Users should feel guided, not sold to.

### Aesthetic Direction
**Visual tone:** Clean, structured, quietly confident. Information hierarchy does the heavy lifting — not decoration.

**References:** Stripe Docs and Linear (clean, technical but approachable, excellent information hierarchy), Notion and Tailwind Docs (friendly, well-organised, good balance of depth and scannability).

**Anti-references — the design must NOT look like:**
- Enterprise SaaS dashboards (Salesforce/HubSpot complexity — too many panels, metrics, jargon)
- AI startup landing pages (gradient text, dark mode neon, "powered by AI" badges, hype over substance)
- Generic documentation sites (bland, text-heavy, no personality — feels like reading a manual)

**Theme:** Light mode default with full dark mode support. OKLCH colour space throughout. Warm-slate neutrals (hue 250) with subtle brand tinting. Three optional creative themes (retro-terminal, synthwave, minimal-ink) as personality layer. Semantic colour tokens for all status/callout variants.

### Design Principles
1. **Clarity over cleverness.** Every design choice should make information easier to find and understand. If a visual element doesn't aid comprehension, remove it.
2. **Hierarchy through restraint.** Use typography weight, size, and spacing to create clear visual levels. Avoid decoration, gradients, and effects that compete with content. One well-designed interaction beats five mediocre ones.
3. **Interactive tools feel distinct.** Calculators, simulators, and step wizards must be visually differentiated from surrounding prose — they are the product's key differentiator, not afterthoughts.
4. **Accessibility is architecture, not a layer.** The three a11y modes (dyslexia, high-contrast, large-text), reduced motion support, keyboard navigation, and semantic HTML are structural decisions, not bolt-ons. They must work seamlessly with creative themes.
5. **Respect the audience.** This is a B2B tool for a UK SMB, not a showcase. No AI slop (glassmorphism, neon gradients, sparklines-as-decoration, identical card grids). The design should feel like it was made by a human who cares about the reader's time.
