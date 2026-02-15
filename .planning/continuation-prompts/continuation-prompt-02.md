# Phase 2 Build — Session Continuation Prompt

## Context

This is a post-training follow-up deliverable for Phew Design Limited (UK-based SMB, 9-11 employees). Three outputs:
1. **Interactive Playbook** — React app with two audience tracks (General Users / Developers)
2. **Starter Kit** — Drop-in skill files, commands, templates, governance policy
3. **Repeatable Workflow Process Doc** — Internal process documentation

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

| File | Summary |
|------|---------|
| `remotion-evaluation.md` | Stick with custom div + Tailwind + Motion for the simulator. |
| `frontend-skills-review.md` | 10 topic areas from 6 frontend skill files. **Includes a 45-item Build Agent Checklist** copied into every Phase 1 spec. |
| `session-handoff-requirements.md` | 5 handoff scenario types. Token-awareness bands. Proposed session-handoff skill structure. |

### Starter Kit Additions (Phase 0b)

- `starter-kit/skills/brand-review/SKILL.md` — skill version of brand-review
- `starter-kit/skills/uk-english/SKILL.md` — UK English enforcement skill
- `starter-kit/commands/brand-review.md` — updated with UK English
- `.planning/research/continuation-prompt-examples/` — 21 real-world examples across 3 projects

### Phase 1 (Section Planning) — Complete

All 17 specs written to `.planning/specs/`, verified, and fixes applied.

**Spec inventory (9,477+ lines total):**

| Spec | Lines | Phase 2 Agent | Track |
|------|------:|:---:|-------|
| `1.1-welcome-and-orientation.md` | 270+ | 6 | Both |
| `1.2-context-simulator.md` | 869 | 2 | Both |
| `1.3-session-management.md` | 703 | 2 | Both |
| `1.4-skills-extensions-decision-tree.md` | 968 | 3 | Both |
| `1.5-ai-governance-policy.md` | 594 | 3 | Both |
| `1.6-brand-voice-and-uk-english.md` | 524 | 3 | Both |
| `1.7-recurring-and-scheduled-tasks.md` | 389 | 3 | General |
| `1.8-claude-md-files.md` | 462 | 4 | Developer |
| `1.9-documentation-structure.md` | 545 | 4 | Developer |
| `1.10-codebase-mapping.md` | 416 | 4 | Developer |
| `1.11-avoiding-hallucinations.md` | 495 | 4 | Developer |
| `1.12-ai-driven-regression-testing.md` | 409 | 4 | Developer |
| `1.13-safe-mcp-usage.md` | 485 | 4 | Developer |
| `1.14-plugin-recommendations.md` | 637 | 4 | Developer |
| `1.15-codebase-auditing-and-technical-debt.md` | 515 | 4 | Developer |
| `1.16-starter-kit-contents.md` | 912 | 5 | Both |
| `1.17-repeatable-workflow-process-doc.md` | 327 | 6 | N/A |

### Phase 1 Verification — Complete

Three verification audits passed with fixes applied:

1. **Coverage audit** (`_verification-coverage-audit.md`): 25/28 fully covered, 2 partial, 1 missing → All fixed:
   - Added Mintlify + agent-browser to spec 1.14 (new "Other Recommended Third-Party Tools" subsection)
   - Added downloadable Quick Reference Card to spec 1.1

2. **Cross-reference check** (`_verification-cross-references.md`): 39/42 valid, 3 minor cosmetic → No action needed. All Phase 2 agent assignments correct. 5 "missing" source paths are Phase 2 deliverables (expected).

3. **Consistency check** (`_verification-consistency.md`): Highly consistent across all specs. Fixes applied:
   - Standardised plugin install command to `/plugin install` format in spec 1.8 (was `claude plugin install`)
   - Added terminology note to spec 1.3: "handoff prompt" is the primary term, "continuation prompt" noted as synonym
   - Added canonical source note to spec 1.16 for brand voice prompt (spec 1.6 is authoritative)

## What's Next: Phase 2 (Build)

### Overview

Phase 2 dispatches 6 parallel build agents, each working from their assigned specs. The orchestrator coordinates but doesn't need to hold all content in context.

**Critical dependency:** Agent 1 (App Shell) should complete first — it scaffolds the Vite + React + Tailwind project, sets up routing, and creates shared components. Other agents slot their output into Agent 1's structure.

### Agent Allocation

| Agent | Responsibility | Specs | Key Deliverables |
|-------|---------------|-------|-----------------|
| **1** | App Shell & Infrastructure | — | Vite project setup, React Router v7, shadcn/ui init, shared components (nav, layout, CopyButton, CodeBlock, FeedbackWidget), Vercel config, responsive layout, dark mode |
| **2** | Context & Session Management | 1.2, 1.3 | Interactive context simulator (hero piece), session management content, handoff prompts |
| **3** | Skills, Governance, Brand | 1.4, 1.5, 1.6, 1.7 | Decision tree, governance policy walkthrough, brand voice setup, UK English guide, recurring tasks |
| **4** | Developer Track | 1.8–1.15 | All 8 developer sections — CLAUDE.md, docs, mapping, hallucinations, testing, MCP, plugins, auditing |
| **5** | Starter Kit Files | 1.16 | All deliverable files: governance template, session handoff skill, CLAUDE.md template, docs scaffold, prompts |
| **6** | Welcome, Process Doc & Integration | 1.1, 1.17 | Welcome page with track selector, repeatable workflow process doc, quick reference card |

### Tech Stack (from `app-tech-stack.md`)

```bash
# Scaffold
npm create vite@latest app -- --template react-ts
cd app

# Core deps
npm install tailwindcss @tailwindcss/vite react-router motion react-shiki shiki lucide-react

# shadcn/ui
npx shadcn@latest init
npx shadcn@latest add accordion tabs button card badge separator tooltip collapsible scroll-area alert
```

### File Structure Convention (from `app-tech-stack.md`)

```
app/src/
  components/
    ui/               # shadcn/ui (auto-generated)
    layout/           # AppLayout, TrackLayout, Header, Footer
    interactive/      # ContextWindowSimulator, DecisionTree, FeedbackWidget
    content/          # CodeBlock, CopyButton, PromptExample, CalloutCard
  hooks/
    useCopyToClipboard.ts
    useTrack.ts
  content/
    general/          # Track-specific content as TS modules
    developer/        # Track-specific content as TS modules
    shared/           # Content shared across tracks
  routes/
    index.tsx
  lib/
    utils.ts          # shadcn cn() utility
  App.tsx
  main.tsx
```

### Key Conventions for All Build Agents

- **UK English** throughout all content, copy, and examples
- **Copy-to-clipboard** on every prompt, template, and code block
- **Content as data** — define as typed TypeScript objects, not hard-coded JSX
- **`@/` path alias** for all imports
- **shadcn CSS variables** for theming (`--primary`, `--muted`, etc.)
- **Tailwind only** — no CSS modules or styled-components
- **Motion** only for layout/enter/exit animations; Tailwind transitions for hover/focus
- **`prefers-reduced-motion`** respected on all animations
- **Two-track filtering** via URL params (`:track` = 'general' or 'developer')
- Each spec contains a **Build Agent Checklist** (45 items) — verify all items before marking complete

### Recommended Approach

1. **Dispatch Agent 1 first** — scaffold the app, set up routing, create shared components
2. **Once Agent 1's shell is ready**, dispatch Agents 2–6 in parallel
3. Each agent reads ONLY its assigned spec(s) + the files listed in the spec's Source References
4. Agents write components to the file structure defined by Agent 1
5. Phase 3 (Integration & Polish) follows after all agents complete

### Open Items from Earlier Phases

1. **Direct team page scrape** — `https://www.phew.org.uk/about-phew/the-team/` couldn't be scraped due to permissions. Low priority but would add role descriptions/bios.
2. **Feedback mechanism** — Start with mailto (Liam's Gmail), upgrade to embedded form if time allows. Decision deferred to Agent 1.
3. **Quick Reference Card** — Added to spec 1.1. Content to be finalised in Phase 3 once all sections are written; layout/download mechanism built in Phase 2.
