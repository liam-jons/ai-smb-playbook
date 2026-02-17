# AI SMB Playbook — Application Overview

## What This Is

The AI SMB Playbook is a hosted React web application that serves as an interactive reference guide for small and medium-sized businesses adopting Claude AI. It is designed to be deployed as a post-training follow-up deliverable, giving teams a living, explorable resource they can return to after an initial AI training engagement.

The application is paired with two companion outputs:

1. **Starter Kit** — Drop-in skill files, command files, templates, and a governance policy that the client can use in their Claude environment immediately.
2. **Repeatable Workflow Process Doc** — An internal document capturing the end-to-end process for producing this deliverable, so it can be replicated for future clients.

The playbook itself was built using the same AI tools and workflows it teaches, which forms a reinforcing meta-narrative throughout the content.

---

## Who It Is For

- **Primary audience:** UK-based SMBs with Claude Teams licences and a mix of general users and developers.
- **Assumed AI maturity:** Familiar with Claude for general tasks, but not yet comfortable with sessions, context windows, skills, or structured AI workflows.
- **Tone:** Practical, non-condescending, SMB-appropriate. No enterprise jargon.

The application accommodates two distinct audience tracks (see "Content Model" below), so non-technical staff and developers each get content pitched at the right level.

---

## Content Model — Two-Track Architecture

All content is organised into sections, each assigned to one of three track values:

| Track Value | Visible To | Purpose |
|-------------|-----------|---------|
| `both` | General users and developers | Core concepts everyone should understand |
| `developer` | Developers only | Technical depth, code-level guidance |

The track is selected by the user at the home page or welcome section. The sidebar, navigation, and section visibility all adapt accordingly.

### Section Inventory

#### Shared Sections (track: `both`)

| ID | Slug | Title | Summary |
|----|------|-------|---------|
| 1.1 | `welcome` | Welcome & Orientation | Introduction, track selector, quick wins, meta-narrative |
| 1.2 | `context` | How Context Works | Interactive context window simulator — the hero piece |
| 1.3 | `sessions` | Session Management | When to start new sessions, handoff prompts, atomic tasks |
| 1.4 | `skills-extensions` | Skills, Extensions & Decision Tree | Interactive decision tree for choosing the right extension mechanism |
| 1.5 | `governance` | AI Governance Policy | Parameterised governance template walkthrough |
| 1.6 | `brand-voice` | Brand Voice & UK English | Brand voice setup guide, UK English enforcement |
| 1.7 | `recurring-tasks` | Recurring & Scheduled Tasks | Automation patterns, current capabilities and limitations |
| 1.8 | `roi-measurement` | Measuring AI ROI | ROI calculator, task templates, measurement frameworks |
| 1.17 | `starter-kit` | Starter Kit Contents | Index of all deliverable files with download links |

#### Developer Sections (track: `developer`)

| ID | Slug | Title | Summary |
|----|------|-------|---------|
| 1.9 | `claude-md` | CLAUDE.md Files | Structuring project-level AI configuration |
| 1.10 | `documentation` | Documentation Structure | AI-readable codebase documentation patterns |
| 1.11 | `codebase-mapping` | Codebase Mapping | GSD Mapper agent and structured documentation output |
| 1.12 | `hallucinations` | Avoiding Hallucinations | Patterns for grounding AI output |
| 1.13 | `regression-testing` | AI-Driven Regression Testing | Browser-based testing, CoWork automation |
| 1.14 | `mcp-usage` | Safe MCP Usage | MCP configuration, safety considerations, context costs |
| 1.15 | `plugins` | Plugin Recommendations | Curated plugin list with evaluation guidance |
| 1.16 | `technical-debt` | Codebase Auditing & Technical Debt | AI-assisted code quality analysis |

### Adding a New Section

1. Create a React component in `app/src/content/general/` or `app/src/content/developer/`.
2. Add a lazy import entry in `app/src/content/shared/registry.ts`.
3. Add the section metadata (id, slug, title, track, etc.) to the `sections` array in `app/src/content/shared/sections.ts`.

The section will automatically appear in the sidebar and be routable.

---

## Client Parameterisation

The application is designed to be rebranded for any client by editing a small number of configuration points. No content components need to change for basic rebranding.

### 1. Site Configuration (`app/src/config/site.ts`)

All client-facing values are centralised in a single TypeScript config object:

```typescript
export const siteConfig = {
  appTitle: 'Client AI Playbook',           // Header, browser tab, hero
  companyName: 'Client Company Ltd',        // Legal name
  companyUrl: 'https://www.example.co.uk/', // Company website
  companyUrlDisplay: 'example.co.uk',       // Display URL (no protocol)
  feedbackEmail: 'feedback@example.co.uk',  // Feedback recipient
  feedbackSenderEmail: 'playbook@feedback.example.co.uk', // Resend verified domain
  consultantName: 'Trainer Name',           // Welcome copy
  trainingDate: '1 January 2026',           // Training date reference
  localStoragePrefix: 'client-playbook',    // localStorage key prefix
  emailSubjectPrefix: 'Client AI Playbook', // Feedback email subjects
  metaDescription: 'Practical guidance...', // HTML meta
  welcomeSubtitle: 'Getting started...',    // Section 1.1 subtitle
} as const;
```

Content components reference `siteConfig` values rather than hardcoding client details.

### 2. Feedback API (`app/api/feedback.ts`)

The serverless function has a clearly marked client-specific config block at the top:

```typescript
const SENDER_EMAIL = 'playbook@feedback.example.co.uk';
const SENDER_NAME = 'Client AI Playbook';
const RECIPIENT_EMAIL = 'feedback@example.co.uk';
const SUBJECT_PREFIX = 'Client AI Playbook';
```

The `RESEND_API_KEY` environment variable must be set in the Vercel dashboard with a key that has sending permissions for the configured sender domain.

### 3. Governance Policy Template (`starter-kit/templates/governance-policy-template.md`)

The standalone governance policy uses `{{PLACEHOLDER}}` variables:

| Placeholder | Purpose |
|------------|---------|
| `{{COMPANY_NAME}}` | Organisation name throughout the policy |
| `{{INDUSTRY}}` | Industry context for sector-specific considerations |
| `{{TEAM_SIZE}}` | Team size for proportionate process design |
| `{{EFFECTIVE_DATE}}` | Policy effective date |
| `{{LAST_REVIEWED}}` | Last review date |
| `{{ADMIN_CONTACT}}` | AI tools administrator name/role |
| `{{REVIEW_FREQUENCY}}` | How often the policy is reviewed |

The template is UK-focused by default (GDPR, ICO, UK DPA 2018 references). If deploying outside the UK, the regulatory references in sections 8.2 and 8.3 should be adapted.

### 4. Starter Kit Files

Files in `starter-kit/` are client-deliverable assets. Most are generic by design. When onboarding a new client, review the `prompts/` and `skills/` directories for any references that should be updated.

---

## Architecture

### Repository Structure

```
app/                              # React playbook application
  ├── api/
  │   └── feedback.ts             # Vercel serverless function (Resend email)
  ├── src/
  │   ├── components/
  │   │   ├── content/            # Content display (CodeBlock, CalloutCard, CopyButton, PromptExample, SectionPage, ShikiHighlighter)
  │   │   ├── interactive/        # Context window simulator and sub-components
  │   │   ├── layout/             # App shell (AppLayout, Header, Sidebar, Footer, HomePage, TrackLayout, FeedbackWidget, ThemeSettings, NotFoundPage)
  │   │   └── ui/                 # shadcn/ui primitives (added via `bunx shadcn add`)
  │   ├── content/
  │   │   ├── general/            # General track section components
  │   │   ├── developer/          # Developer track section components
  │   │   └── shared/             # Section registry, types, data files, StarterKit, Welcome & ProcessDoc pages
  │   ├── routes/                 # React Router config (router.tsx)
  │   ├── hooks/                  # Custom hooks (useAccessibility, useCopyToClipboard, useTheme, useTrack)
  │   ├── themes/                 # Accessibility modes & font definitions
  │   ├── config/                 # Site config (site.ts) — client parameterisation point
  │   ├── lib/                    # Utilities (utils.ts — cn() helper)
  │   └── assets/
  └── dist/                       # Production build output (gitignored)
.planning/                        # Planning artefacts (retained for reference)
  ├── client-specific/            # Per-client source materials
  │   ├── 00-phew/                # Original client (Phew Design Limited)
  │   └── 01-amd/                 # Subsequent clients
  ├── reference/                  # Generic application reference docs
  ├── research/                   # Research findings from Phase 0
  ├── specs/                      # Section-level build specs from Phase 1
  ├── plan-files/                 # Execution plans
  ├── audit-findings/             # Audit reports
  └── continuation-prompts/       # Session continuation prompts
starter-kit/                      # Deliverable files for clients
  ├── skills/                     # .md skill files
  ├── commands/                   # .md command files
  ├── gsd-mapper/                 # Codebase mapper agent, command, templates, workflow
  ├── plugins/
  │   └── claude-plugins-official/ # Reference copies of plugins (not functional in-repo)
  ├── templates/                  # Governance policy, doc structure, CLAUDE.md templates
  └── prompts/                    # Session handoff prompts, example prompts
docs/
  └── repeatable-workflow.md      # Internal process documentation
vercel.json                       # Vercel deployment (region: lhr1, SPA rewrites, security headers)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Build tool | Vite |
| Framework | React 19 + TypeScript |
| Styling | Tailwind CSS v4 (CSS-based config, no JS config file) + shadcn/ui (Radix primitives) |
| Routing | React Router v7 |
| Syntax highlighting | Shiki |
| Animations | Motion (Framer Motion) |
| Package manager | bun |
| Hosting | Vercel (region: `lhr1` London) |
| Analytics | Vercel Web Analytics (`@vercel/analytics`) |
| Feedback email | Resend (serverless function at `/api/feedback`) |

### Routing

The app uses React Router v7 with the following route structure:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `HomePage` | Landing page with track selection |
| `/process` | `ProcessDocPage` | Repeatable workflow process doc |
| `/:track` | `TrackLayout` > `SectionPage` | First section of the selected track |
| `/:track/:section` | `TrackLayout` > `SectionPage` | Specific section within a track |
| `*` | `NotFoundPage` | 404 fallback |

Track values in URLs are `general` or `developer`. Section values match the `slug` field in the sections registry.

---

## Key Design Decisions

### Context Simulator

The interactive context window simulator (section 1.2) is the centrepiece of the playbook:

- Uses proportional visualisation, not precise token counts.
- Shows ballpark ranges with a clear "exact numbers vary" caveat.
- Visualises: system prompt, system tools, CLAUDE.md, skill descriptions, MCP definitions, conversation history.
- Degradation is represented visually — earlier conversation content fades as the window fills, representing reduced influence rather than deletion.
- Includes the compaction concept: when context is full, Claude summarises older content to make room.

### Copy-to-Clipboard

Every prompt, example, and template has a copy button with visual confirmation ("Copied!" indicator). This is enforced as a design rule — no copyable content should lack a copy button.

### Governance Policy

- Written for SMBs: accessible language, proportionate processes, not enterprise bureaucracy.
- Fully parameterised for reuse across clients (see "Client Parameterisation" above).
- Covers all Claude extension types: skills, plugins, MCPs, commands, agents, hooks.
- UK regulatory context by default (GDPR, ICO, DPA 2018).

### Feedback Widget

- Persistent but unobtrusive (accessible from every page).
- Three categories: request more info, report an issue, general feedback.
- Sends email via Vercel serverless function using the Resend SDK.
- Requires `RESEND_API_KEY` environment variable and a verified sender domain.

### Starter Kit Delivery

- Files are accessible both as downloads from within the app and as files in the `starter-kit/` repository directory.
- Each file includes a header comment explaining what it does and how to use it.
- Plugin reference copies in `starter-kit/plugins/` are not functional in the repo — they are provided for review. Installing plugins via the marketplace gives automatic updates; copying files requires manual maintenance.

### Accessibility

- Dyslexia-friendly, high-contrast, and large-text modes available via `useAccessibility` hook.
- Multiple font options. Modes are persisted to localStorage.

---

## Build and Development

All commands run from the `app/` directory:

```bash
bun install          # Install dependencies
bun run dev          # Local dev server (port 4100)
bun run build        # TypeScript check + production build
bun run lint         # ESLint
bun run format       # Prettier — format all files
bun run format:check # Prettier — check without writing
bun run preview      # Preview production build locally
bunx tsc --noEmit    # Type check only (no emit)
bunx shadcn add <component>  # Add a new shadcn/ui primitive
```

No test suite is configured. Quality checks are `build` (TypeScript), `lint` (ESLint), and `format:check` (Prettier).

### Deployment

- Auto-deploys on push to `main` via Vercel.
- Vercel root directory is set to `app` in the Vercel dashboard (not in `vercel.json`). This is intentional — the serverless `api/` directory and `package.json` live under `app/`, so Vercel must install and build from there.
- `vercel.json` lives at the repo root and configures SPA rewrites, security headers, and asset caching.
- Region is set to `lhr1` (London).

### Environment Variables

Set in the Vercel dashboard, not committed to the repo:

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Resend email API key for the feedback widget |

---

## Code Conventions

- **Path aliases:** `@/` maps to `app/src/` (configured in `tsconfig.app.json` and `vite.config.ts`).
- **Component patterns:** shadcn/ui components in `components/ui/`, app components in `components/layout/` and `components/content/`.
- **Content architecture:** Section content lives in `content/{general,developer}/` as standalone React components, registered in `content/shared/registry.ts`.
- **Styling:** Tailwind utility classes via `cn()` helper from `lib/utils.ts`. Dark mode supported via `useTheme` hook.
- **Track detection:** `useTrack()` hook returns `{ track, isDev, isGeneral }` for track-conditional rendering within section components.
- **Site config:** All client-specific values are centralised in `config/site.ts`. This is the single point of change for rebranding.
- **UK English throughout.** All content, examples, and copy use UK English spelling and grammar. Use £ not $, UK regulatory references where relevant.

---

## Gotchas

- **Tailwind v4 — no config file.** Theme customisation is in `app/src/index.css` via `@theme inline {}`. Do not create a `tailwind.config.js`.
- **shadcn/ui components are generated.** Files in `components/ui/` are added via `bunx shadcn add`, not hand-written. Do not manually create UI primitives.
- **Vercel root directory mismatch.** `vercel.json` is at the repo root but Vercel's root directory is `app`. Do not change the root directory without also moving the API function and its dependencies.
- **Starter kit plugins are reference copies.** Files in `starter-kit/plugins/` were copied from a global Claude setup. They are not functional in this repository.

---

## Onboarding a New Client

To deploy the playbook for a new client:

1. **Create a client directory** under `.planning/client-specific/` (e.g., `02-clientname/`) for any client-specific source materials, training summaries, or feedback.
2. **Update `app/src/config/site.ts`** with the client's company name, URLs, training date, and consultant name.
3. **Update `app/api/feedback.ts`** client-specific config block with the appropriate sender and recipient email addresses. Ensure the sender domain is verified in Resend.
4. **Set `RESEND_API_KEY`** in the Vercel dashboard for the new deployment.
5. **Review starter kit files** in `starter-kit/` — update any client-specific references in prompts or skills.
6. **Customise the governance template** — the `{{PLACEHOLDER}}` values in `starter-kit/templates/governance-policy-template.md` are filled in by the client during onboarding, but review the sector-specific considerations section for relevance.
7. **Review content sections** — some sections may reference training-specific examples. Update the welcome section and any section content that references the training context.
8. **Deploy** — push to main for auto-deploy, or configure a separate Vercel project for the new client.

---

## Planning Artefacts

The `.planning/` directory retains all artefacts from the original build process. These are useful reference material but are not required for ongoing maintenance:

| Directory | Contents |
|-----------|----------|
| `client-specific/` | Per-client source materials (training summaries, feedback, site scrapes) |
| `reference/` | Generic application reference documents (including this file) |
| `research/` | Phase 0 research outputs (context mechanics, tech stack, capabilities audit, etc.) |
| `specs/` | Phase 1 section-level build specs |
| `plan-files/` | Execution plans for specific implementation tasks |
| `audit-findings/` | Content and design audit reports |
| `continuation-prompts/` | Session handoff prompts used during the build |
