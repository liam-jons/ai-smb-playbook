# AI SMB Playbook — Application Overview

## What This Is

The AI SMB Playbook is a multi-tenant React single-page application that serves as an interactive reference guide for small and medium-sized businesses adopting AI. It is designed to be deployed as a post-training follow-up deliverable, giving teams a living, explorable resource they can return to after an initial AI training engagement.

A single build serves all clients. Each client is identified by subdomain and configured via a JSON file at runtime — no code changes are needed to onboard a new client. Two outputs per client deployment:

1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, command files, templates, and a governance policy that the client can use immediately

---

## Who It Is For

- **Primary audience:** UK-based SMBs who will have received training or consultancy services from AI Solution Hub. The application accounts for there being a mix of general users and developers/technical users.
- **Assumed AI maturity:** Clients are on a spectrum — some may have used AI personally, and possibly for smaller work tasks. Others are familiar with Claude (and other LLMs) for general tasks, but not yet comfortable with sessions, context windows, skills, or structured AI workflows.
- **Tone:** Practical, non-condescending, SMB-appropriate. No enterprise jargon.

The application accommodates two distinct audience tracks (see "Content Model" below), so non-technical staff and developers each get content pitched at the right level.

Important — We (AI Solution Hub) use Claude, and advocate for others to do so too, which is in part why the application is heavily Claude-focused. We do however need to be aware that some users will not yet be using Claude, and some may not have even heard of Anthropic.

---

## Content Model — Two-Track Architecture

All content is organised into sections, each assigned to one of three track values:

| Track Value | Visible To | Purpose |
|-------------|-----------|---------|
| `both` | General users and developers | Core concepts everyone should understand |
| `general` | General users only | Non-technical guidance not relevant to developers |
| `developer` | Developers only | Technical depth, code-level guidance |

The track is selected by the user at the home page. The sidebar, navigation, and section visibility all adapt accordingly. General users see sections with track `both` or `general`; developers see sections with track `both` or `developer`.

### Section Inventory

#### Shared Sections (track: `both`)

| ID | Slug | Title | Sidebar Title | Icon | Summary |
|----|------|-------|---------------|------|---------|
| 1.1 | `welcome` | Welcome & Orientation | — | Compass | Introduction, track selector, quick wins |
| 1.2 | `context` | How Context Works | — | Brain | Interactive context window simulator — the hero piece |
| 1.3 | `sessions` | Session Management | — | MessageSquare | When to start new sessions, handoff prompts, atomic tasks |
| 1.4 | `skills-extensions` | Skills, Extensions & Decision Tree | Extending Claude | GitBranch | Interactive decision tree for choosing the right extension mechanism |
| 1.5 | `governance` | AI Governance Policy | — | Shield | Parameterised governance template walkthrough |
| 1.6 | `brand-voice` | Brand Voice & UK English | — | PenTool | Brand voice setup guide, UK English enforcement |
| 1.7 | `recurring-tasks` | Recurring & Scheduled Tasks | Task Automation | Clock | Automation patterns, current capabilities and limitations |
| 1.8 | `roi-measurement` | Measuring AI ROI | Measuring ROI | TrendingUp | ROI calculator, feasibility study builder, task templates, measurement frameworks |
| 1.17 | `starter-kit` | Starter Kit Contents | — | Package | Index of all deliverable files with download links |

#### General-Only Section (track: `general`)

| ID | Slug | Title | Icon | Summary |
|----|------|-------|------|---------|
| 1.3b | `reliable-output` | Getting Reliable Output | Target | Practical patterns for accurate, grounded responses — avoiding hallucinations |

#### Developer Sections (track: `developer`)

| ID | Slug | Title | Sidebar Title | Icon | Summary |
|----|------|-------|---------------|------|---------|
| 1.9 | `claude-md` | CLAUDE.md Files | — | FileCode | Structuring project-level AI configuration |
| 1.10 | `documentation` | Documentation Structure | — | FolderTree | AI-readable codebase documentation patterns |
| 1.11 | `codebase-mapping` | Codebase Mapping | — | Map | GSD Mapper agent and structured documentation output |
| 1.12 | `hallucinations` | Avoiding Hallucinations | — | AlertTriangle | Patterns for grounding AI output |
| 1.13 | `regression-testing` | AI-Driven Regression Testing | — | TestTube | Browser-based testing, CoWork automation |
| 1.14 | `mcp-usage` | Safe MCP Usage | — | Plug | MCP configuration, safety considerations, context costs |
| 1.15 | `plugins` | Plugin Recommendations | — | Puzzle | Curated plugin list with evaluation guidance |
| 1.16 | `technical-debt` | Codebase Auditing & Technical Debt | Code Auditing & Debt | Search | AI-assisted code quality analysis |

### Section Type

Each section entry in `sections.ts` uses the `Section` interface from `content/shared/types.ts`:

```typescript
interface Section {
  id: string;          // Section number, e.g. '1.3b'
  slug: string;        // URL-safe slug, e.g. 'reliable-output'
  title: string;       // Display title
  subtitle?: string;   // Additional context below the title
  track: Track | 'both';  // 'general' | 'developer' | 'both'
  description: string; // Brief description of section content
  sidebarTitle?: string;  // Shorter title for sidebar (falls back to title)
  icon?: string;       // Lucide icon name for navigation
}
```

### Section Filtering by Client Config

Two filtering functions in `sections.ts` support per-client section visibility:

- **`getFilteredSectionsForTrack(track, sectionsConfig, hasDeveloperTrack)`** — Returns sections for a track, filtered by the client's `sections.enabled` allow-list and `sections.disabled` deny-list. If `hasDeveloperTrack` is `false` and the requested track is `developer`, returns an empty array.
- **`getFilteredAdjacentSections(slug, track, sectionsConfig, hasDeveloperTrack)`** — Returns previous/next sections within a track, respecting the same client config filtering. Used for section navigation.

### Adding a New Section

1. Create a React component in `app/src/content/general/` or `app/src/content/developer/`.
2. Add a lazy import entry in `app/src/content/shared/registry.ts`.
3. Add the section metadata (id, slug, title, track, icon, etc.) to the `sections` array in `app/src/content/shared/sections.ts`.

The section will automatically appear in the sidebar and be routable.

---

## Multi-Tenant Client Configuration

The application uses a runtime JSON configuration system for multi-tenant deployments. A single build serves all clients — each identified by subdomain and configured via a JSON file loaded at runtime.

### How It Works

1. **Slug extraction** (`utils/slug.ts`): When the app loads, `extractClientSlugFromHostname()` parses the hostname. For `phew.playbook.aisolutionhub.co.uk`, the slug is `phew`. For `localhost` or the bare domain, the slug is `default`.
2. **Dev overrides** (`config/config-loader.ts`): When the slug is `default`, two overrides are checked:
   - `?client=phew` query parameter (highest priority)
   - `VITE_DEFAULT_CLIENT` environment variable in `app/.env.local`
3. **Config fetch**: `loadClientConfig()` fetches `/clients/{slug}.json`. If the slug is `default` or the fetch fails, bundled defaults from `site.ts` are used.
4. **Merge with defaults**: `mergeWithDefaults()` shallow-merges the partial client JSON on top of `DEFAULT_CONFIG`, ensuring all required fields are present.
5. **localStorage cache**: Loaded configs are cached in localStorage with a 1-hour TTL to avoid re-fetching on every page load. The cache key is `playbook-client-config-{slug}`.
6. **React context**: `ClientConfigProvider` wraps the app and provides the config, loading state, client slug, and any error via React context.

### The `ClientConfig` Interface

Defined in `app/src/config/client-config-schema.ts`:

```typescript
interface ClientConfig {
  siteConfig: {
    // Required (all clients) — 13 fields
    appTitle: string;
    companyName: string;
    companyShortName: string;
    companyUrl: string;
    companyUrlDisplay: string;
    feedbackEmail: string;
    feedbackSenderEmail: string;
    consultantName: string;
    trainingDate: string;
    localStoragePrefix: string;
    emailSubjectPrefix: string;
    metaDescription: string;
    welcomeSubtitle: string;

    // Recommended (most clients) — 4 fields
    industry: string;
    industryContext: string;
    teamSize: string;
    primaryAiTool: string;

    // Developer track — 7 fields
    hasDeveloperTrack: boolean;
    testingTool?: string;
    testingToolDocs?: string;
    techStack?: string;
    database?: string;
    webApplications?: string;
    domainSpecificForm?: string;

    // Domain-specific — 9 fields
    complianceArea?: string;
    primaryProduct?: string;
    primaryProductDescription?: string;
    certificationName?: string;
    complianceStakeholders?: string;
    sensitiveDataDescription?: string;
    sensitiveDataLabel?: string;
    exampleRecurringTasks: string[];
    reportDataSource?: string;
    clientOnboardingType?: string;
  };

  overlays: {
    brandVoice?: {
      frameworkExamples: Record<string, string>;
      headStartContent?: string;
    };
    recurringTasks?: {
      examples: Array<{ title: string; description: string }>;
    };
    roi?: {
      clientExamples: Record<string, { title: string; description: string }>;
    };
  };

  sections: {
    enabled?: string[] | null;   // Allow-list of section slugs (null = all)
    disabled?: string[];         // Deny-list of section slugs
  };

  starterKit?: {
    enabledCustomCategories?: string[];  // Custom tier categories to include
  };
}
```

### Config Hooks

Components access config values via hooks from `app/src/hooks/useClientConfig.ts`, not by importing `site.ts` directly:

| Hook | Returns | Purpose |
|------|---------|---------|
| `useClientConfig()` | `{ config, isLoading, clientSlug, error }` | Full context value including loading state |
| `useSiteConfig()` | `config.siteConfig` | Direct replacement for the old `import { siteConfig }` |
| `useOverlays()` | `config.overlays` | Client-specific content overlays |
| `useSectionsConfig()` | `config.sections` | Section enabled/disabled configuration |

### Default Configuration

Generic neutral defaults are defined in `app/src/config/site.ts`. This file provides fallback values for all `siteConfig` fields (e.g. `companyName: 'Your Organisation'`, `industry: 'your industry'`). The `config-loader.ts` module is the only file that imports `site.ts` directly — all other code uses the React context hooks.

### Client JSON Files

Client configs live in `app/public/clients/`:

| File | Purpose |
|------|---------|
| `_template.json` | Starter template with placeholder values for all fields |
| `phew.json` | Live config for Phew Design Limited (first client) |

See `CUSTOMISATION.md` at the repo root for the complete field reference, overlay documentation, and deployment instructions.

---

## Architecture

### Repository Structure

```
app/                          # React playbook app (Vite + React + Tailwind v4 + TypeScript)
  ├── api/
  │   └── feedback.ts         # Vercel serverless function (Resend email, multi-tenant)
  ├── public/
  │   └── clients/            # Runtime client config JSON files
  │       ├── _template.json  # Starter template for new clients
  │       └── phew.json       # Phew Design Limited config
  ├── src/
  │   ├── components/
  │   │   ├── content/        # Content display (CalloutCard, CodeBlock, CopyButton, PromptExample, ScrollHint, SectionPage, SetupStepCard, ShikiHighlighter — 8 components)
  │   │   ├── interactive/    # Context window simulator (ContextWindowSimulator, ContextWindowBar, SimulatorControls, SimulatorStatus — 4 components)
  │   │   ├── layout/         # App shell (AppLayout, FeedbackWidget, Footer, Header, HomePage, NotFoundPage, Sidebar, ThemePreview, ThemeSettings, TrackLayout — 10 components)
  │   │   └── ui/             # shadcn/ui primitives (18 components — added via `bunx shadcn add`)
  │   ├── config/
  │   │   ├── client-config-schema.ts  # ClientConfig TypeScript interface
  │   │   ├── client-config-context.tsx # React context provider
  │   │   ├── config-loader.ts         # Slug extraction, JSON fetch, merge, localStorage cache
  │   │   └── site.ts                  # Default siteConfig values (generic fallbacks)
  │   ├── content/
  │   │   ├── general/        # General track sections (9 files — 8 section components + FeasibilityStudyBuilder)
  │   │   ├── developer/      # Developer track sections (8 section components)
  │   │   └── shared/         # Section registry, types, data files, StarterKitSection, WelcomeSection (12 files)
  │   ├── hooks/              # Custom hooks (useAccessibility, useClientConfig, useCopyToClipboard, useTheme, useTrack — 5 hooks)
  │   ├── lib/                # Utilities (utils.ts — cn() helper; docx-export.ts — DOCX generation)
  │   ├── routes/             # React Router config (router.tsx)
  │   ├── themes/             # Accessibility modes & font definitions (index.ts)
  │   ├── utils/              # Shared utilities (slug.ts — hostname parsing, slug sanitisation)
  │   └── assets/             # Static assets
  └── dist/                   # Production build output (gitignored)
.planning/                    # Planning artefacts
  ├── client-specific/        # Per-client context, specs, and history (00-phew/, 01-amd/, …)
  ├── research/               # Reusable research (market-research/, accessibility, capabilities)
  └── plan-files/             # Execution plans
starter-kit/                  # Deliverable files for client
  ├── skills/                 # .md skill files (13 provided)
  ├── commands/               # .md command files (1 provided)
  ├── gsd-mapper/             # Codebase mapper agent, command, templates, workflow
  ├── plugins/
  │   └── claude-plugins-official/  # Reference copies of 14 plugins (not functional in-repo)
  ├── templates/              # 4 templates (governance policy, doc structure, CLAUDE.md, feasibility study)
  └── prompts/                # Session handoff prompts, example prompts (3 provided)
docs/
  ├── reference/              # Active reference docs (application-overview, frontend-skills-review, templates)
  ├── audit-findings/         # Audit reports (date-stamped: YYYYMMDD-type/)
  ├── continuation-prompts/   # Reusable continuation prompt templates
  └── repeatable-workflow.md  # Internal process doc
CUSTOMISATION.md              # Client deployment guide (field reference, overlays, deployment)
package.json                  # Repo-root package (workspace config)
vercel.json                   # Vercel deployment config (region: lhr1, SPA rewrites, security headers)
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
| DOCX export | docx (npm package) |
| Package manager | bun |
| Hosting | Vercel (region: `lhr1` London) |
| Analytics | Vercel Web Analytics (`@vercel/analytics`) |
| Feedback email | Resend (serverless function at `/api/feedback`) |

### Routing

The app uses React Router v7 with the following route structure:

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `HomePage` | Landing page with track selection |
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

### ROI Calculator and Feasibility Study Builder

Section 1.8 (Measuring AI ROI) includes two interactive tools:

- **ROI Calculator** — Slider-based tool that calculates annual savings from AI adoption. Inputs include hourly rate, hours saved per week, team size, and monthly tool cost. Uses UK currency (GBP) defaults. Produces a summary with monthly and annual figures.
- **Feasibility Study Builder** — A multi-step wizard (`FeasibilityStudyBuilder.tsx`) that guides users through assessing whether a specific task is suitable for AI automation. Steps cover use case summary, current state assessment, AI approach, risk identification, and recommendation. Generates a formatted feasibility study document that can be exported as DOCX via `lib/docx-export.ts`.
- **Task Templates** — Before/after comparison cards for common business tasks (e.g. proposal writing, compliance documentation), showing time, cost, and process differences. Templates are track-aware (`general`, `developer`, or `both`) and support client-specific examples via the `overlays.roi.clientExamples` config.

### DOCX Export

The `lib/docx-export.ts` module provides client-side DOCX generation using the `docx` npm package. It parses markdown into typed blocks (headings, bullets, body text, separators) and converts inline formatting (bold, italic, code, links) into DOCX text runs. Used by the feasibility study builder to export reports.

### Copy-to-Clipboard

Every prompt, example, and template has a copy button with visual confirmation ("Copied!" indicator). This is enforced as a design rule — no copyable content should lack a copy button.

### Governance Policy

- Written for SMBs: accessible language, proportionate processes, not enterprise bureaucracy.
- Fully parameterised for reuse across clients (see "Client Configuration" above).
- Covers all Claude extension types: skills, plugins, MCPs, commands, agents, hooks.
- UK regulatory context by default (GDPR, ICO, DPA 2018).

### Feedback Widget

- Persistent but unobtrusive (accessible from every page via footer link or widget).
- Three categories: request more info, report an issue, general feedback.
- Sends email via Vercel serverless function using the Resend SDK.
- **Multi-tenant:** The serverless function extracts the client slug from the request's Referer header, loads the matching client JSON config from `public/clients/{slug}.json`, and uses client-specific email settings (sender address, recipient, subject prefix). Falls back to AI Solution Hub defaults if the config cannot be loaded.
- Requires `RESEND_API_KEY` environment variable and a verified sender domain.

### Starter Kit Delivery

- Files are accessible both from within the app (Starter Kit section) and as files in the `starter-kit/` repository directory.
- Each file includes a header comment explaining what it does and how to use it.
- **Base/custom tier model:** Starter kit items are classified as either `base` (included for every client) or `custom` (included only if the client's `starterKit.enabledCustomCategories` array includes the item's category).
- Five custom categories: `developer-tools`, `business-development`, `creative-design`, `integration-specific`, `compliance-security`.
- Four templates: governance policy, documentation structure, CLAUDE.md, and feasibility study.
- Plugin reference copies in `starter-kit/plugins/` are not functional in the repo — they are provided for review. Installing plugins via the marketplace gives automatic updates; copying files requires manual maintenance.

### Accessibility

- Dyslexia-friendly, high-contrast, and large-text modes available via `useAccessibility` hook.
- Multiple font options. Modes are persisted to localStorage.
- Theme preview component (`ThemePreview.tsx`) allows users to see accessibility mode effects before applying.

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

### Local Client Testing

Three approaches for testing client-specific configurations locally:

1. **Query parameter (quickest):** Append `?client={slug}` to the dev server URL, e.g. `http://localhost:4100?client=phew`.
2. **Environment variable:** Set `VITE_DEFAULT_CLIENT=phew` in `app/.env.local`. The dev server loads this client config by default.
3. **Subdomain testing:** Add `127.0.0.1 phew.localhost` to `/etc/hosts`, then visit `http://phew.localhost:4100`. This tests the full subdomain resolution path.

### Deployment

- Auto-deploys on push to `main` via Vercel.
- Vercel root directory is set to `app` in the Vercel dashboard (not in `vercel.json`). This is intentional — the serverless `api/` directory and `package.json` live under `app/`, so Vercel must install and build from there.
- `vercel.json` lives at the repo root and configures SPA rewrites, security headers, and asset caching.
- Region is set to `lhr1` (London).
- Client subdomains follow the pattern `{slug}.playbook.aisolutionhub.co.uk` and are added in the Vercel dashboard.

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
- **Track detection:** `useTrack()` hook returns `{ track, isValidTrack }` for track-conditional rendering within section components. The `Track` type is `'general' | 'developer'`.
- **Client config:** All client-specific values are accessed via the `useSiteConfig()`, `useOverlays()`, and `useSectionsConfig()` hooks. Components must not import `site.ts` directly.
- **UK English throughout.** All content, examples, and copy use UK English spelling and grammar. Use £ not $, UK regulatory references where relevant.
- **Footer branding:** The footer displays "Delivered by AI Solution Hub" alongside the client company name (when not using generic defaults).

---

## Gotchas

- **Tailwind v4 — no config file.** Theme customisation is in `app/src/index.css` via `@theme inline {}`. Do not create a `tailwind.config.js`.
- **shadcn/ui components are generated.** Files in `components/ui/` are added via `bunx shadcn add`, not hand-written. Do not manually create UI primitives.
- **Vercel root directory mismatch.** `vercel.json` is at the repo root but Vercel's root directory is `app`. Do not change the root directory without also moving the API function and its dependencies.
- **Starter kit plugins are reference copies.** Files in `starter-kit/plugins/` were copied from a global Claude setup. They are not functional in this repository.
- **Do not import `site.ts` directly.** Only `config-loader.ts` imports `site.ts`. All other code must use the React context hooks (`useSiteConfig()`, etc.) to access configuration values.
- **Shared slug utility.** The `utils/slug.ts` module is used by both the SPA config loader and the Vercel serverless feedback API. Changes to slug extraction logic affect both.

---

## Onboarding a New Client

To deploy the playbook for a new client:

1. **Copy the template** — `cp app/public/clients/_template.json app/public/clients/{slug}.json`.
2. **Fill in `siteConfig` fields** — At minimum, set all 13 required fields (company name, URLs, training date, etc.). Add recommended and domain-specific fields as relevant. See `CUSTOMISATION.md` for the full field reference.
3. **Write overlay content (optional)** — Provide client-specific brand voice framework examples, recurring task examples, and ROI case studies in the `overlays` section. Sections render sensible defaults when overlays are absent.
4. **Configure section visibility** — Use `sections.enabled` (allow-list) or `sections.disabled` (deny-list) to control which sections appear. Set `hasDeveloperTrack: false` in `siteConfig` to hide the entire developer track.
5. **Configure starter kit categories** — Set `starterKit.enabledCustomCategories` to include relevant custom categories (e.g. `["developer-tools", "creative-design"]`).
6. **Create a client planning directory** — Under `.planning/client-specific/` (e.g. `02-clientname/`) for any client-specific source materials, training summaries, or feedback.
7. **Validate the config** — Run `cd app && bun run build`. The TypeScript compiler and Vite build will catch missing required fields or type mismatches.
8. **Add subdomain in Vercel** — Point `{slug}.playbook.aisolutionhub.co.uk` at the deployment. For branded domains (e.g. `ai.clientname.co.uk`), add the domain separately and have the client create a CNAME record pointing to `cname.vercel-dns.com`.
9. **Push to main** — Vercel auto-deploys on merge. The new client config JSON is served as a static asset from `/clients/{slug}.json`.

See `CUSTOMISATION.md` at the repo root for the complete client deployment guide, including detailed field descriptions, overlay documentation, and local testing instructions.

### Governance Policy Template (`starter-kit/templates/governance-policy-template.md`)

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

The template is UK-focused by default (GDPR, ICO, UK DPA 2018 references). If deploying outside the UK, the regulatory references should be adapted.

---

## Planning Artefacts

The `.planning/` directory retains all artefacts from the original build process. These are useful reference material but are not required for ongoing maintenance:

| Directory | Contents |
|-----------|----------|
| `client-specific/` | Per-client source materials (training summaries, feedback, site scrapes) |
| `research/` | Reusable research outputs (market research, context mechanics, capabilities audit, etc.) |
| `plan-files/` | Execution plans for specific implementation tasks |

## Documentation is saved under /docs

| Directory | Contents |
|-----------|----------|
| `reference/` | Generic application reference documents (including this file) |
| `audit-findings/` | Content and design audit reports |
| `continuation-prompts/` | Session handoff prompts used during the build |
