# Design Audit -- Impeccable Setup & Critique

## Context

This is a reusable React application (Vite + React 19 + Tailwind v4 + TypeScript) that provides interactive guidance for small/medium businesses adopting Claude AI. Three outputs per client deployment:
1. **Interactive Playbook** -- React app with two audience tracks (General Users / Developers)
2. **Starter Kit** -- Drop-in skill files, commands, templates, governance policy
3. **Repeatable Workflow Process Doc** -- Internal process documentation

**Read first:** `CLAUDE.md` at the project root -- conventions, tech stack, critical rules (UK English throughout, two-track content, copy buttons on all prompts/templates, parameterised governance).

---

## Completed Work

### Feasibility Study Builder -- COMPLETE

The Feasibility Study Builder feature is fully implemented and verified across 4 sessions (Waves 1-3). All 47/48 acceptance criteria pass (1 minor deviation: template re-population lacks confirmation dialog -- acceptable because the merge is non-destructive).

Full implementation details in `docs/continuation-prompts/continuation-prompt-18-feasibility-wave3-final.md`.

### Latest Session -- Overflow Fix & Content Width

**Changes committed (09cefe8):**

1. **Content width increased** -- `max-w-[65ch]` to `max-w-[75ch]` in `TrackLayout.tsx:139`
   - Gives interactive tools (calculators, forms, step wizards) more breathing room
   - Still within readable prose range (75ch is the upper bound of the 45-75ch recommendation)

2. **Step indicator overflow fixed** in `FeasibilityStudyBuilder.tsx`:
   - Text labels removed -- always show numbered step pills (text labels never fit in the `max-w-6xl` + sidebar layout regardless of viewport width)
   - Connector lines changed from fixed `w-4` to `flex-1 min-w-2` -- steps now span full container width
   - `<li>` items use `flex-1` (except last) for even distribution
   - `overflow-x-auto` added to `<ol>` as safety fallback

3. **Overflow verified clean** at all viewport widths: 375px, 768px, 1024px, 1280px, 1440px

### Current App State

- **Production:** https://ai-smb-playbook.vercel.app (auto-deploys on push to main)
- **Build/Lint/Format:** All passing
- **No test suite** -- quality checks are build (TypeScript), lint (ESLint), format:check (Prettier)

---

## This Session's Goals

### Step 1: Run `/frontend-design:teach-impeccable`

This is a one-time setup skill that gathers design context for the project and saves it to the AI config file. It establishes persistent design guidelines that subsequent design skills can reference.

**What to provide when prompted:**
- **Tech stack:** Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui (Radix primitives)
- **Design system:** Tailwind v4 CSS-based (no JS config), semantic colour tokens in `app/src/index.css`, shadcn/ui primitives in `components/ui/`
- **Typography:** Space Grotesk (headings), Inter (body), JetBrains Mono (code). Accessibility fonts: OpenDyslexic, Atkinson Hyperlegible
- **Colour approach:** Semantic tokens (primary, secondary, muted, success, danger, info, warning) -- no hardcoded hex or Tailwind scale classes
- **Accessibility:** Three modes (high-contrast, dyslexia-friendly, large-text) via `useAccessibility` hook, `motion-safe:` prefixes, colour never sole information carrier
- **Key design reference:** `docs/reference/frontend-skills-review.md` -- comprehensive design and engineering guidelines

### Step 2: Run `/frontend-design:critique` -- one subagent per page

After impeccable setup is saved, run a design critique across the application. **Spawn a separate subagent for each page** to ensure focused, detailed output per page rather than a diluted overview. Each subagent should run `/frontend-design:critique` targeting its assigned page.

The critique evaluates:
- Visual hierarchy and information architecture
- Emotional resonance and overall design quality
- Layout and spacing consistency
- Typography and colour effectiveness
- Interaction design and feedback patterns

**Pages to critique (one subagent each):**

| # | Page | URL | Focus |
|---|------|-----|-------|
| 1 | Home page | `/` | First impression, track selection, onboarding |
| 2 | ROI Measurement | `/general/roi-measurement` | Most interactive page -- ROI calculator, task templates, feasibility builder, measurement frameworks |
| 3 | How Context Works | `/general/context` | Context Window Simulator, interactive educational content |
| 4 | Session Management | `/general/sessions` | Dense content with accordions and code examples |
| 5 | Starter Kit | `/general/starter-kit` | Large content page with file listings and downloads |
| 6 | Developer track sample | `/developer/claude-md` | Compare with general track quality |

**Parallelisation:** Pages 1-3 can run in parallel (independent), then pages 4-6 in a second wave. Each subagent should write its findings to `agent-outputs/design-critique-{page-name}.md`.

**Key questions each critique should answer:**
- Does the design feel professional and trustworthy for a B2B SMB audience?
- Are interactive tools (calculator, simulator, feasibility builder) visually distinct from prose content?
- Is the two-track experience (General/Developer) consistent in quality?
- Does the mobile experience feel intentional or like a responsive afterthought?
- Are accessibility modes seamlessly integrated rather than bolted on?

### Step 3: Synthesise findings

After all 6 subagent critiques complete, synthesise the findings into a prioritised action plan. Group issues by severity (critical / important / nice-to-have) and identify patterns that appear across multiple pages.

---

## Files to Read Before Starting

| Document | Purpose | Priority |
|----------|---------|----------|
| `CLAUDE.md` | Project conventions | Required |
| `docs/reference/frontend-skills-review.md` | Design & engineering guidelines | Required |
| `app/src/index.css` | Theme tokens, Tailwind v4 config | Reference |
| `app/src/themes/index.ts` | Accessibility modes & fonts | Reference |
| `app/src/components/layout/AppLayout.tsx` | App shell structure | Reference |
| `app/src/components/layout/TrackLayout.tsx` | Content layout with sidebar | Reference |
| `app/src/config/site.ts` | Client-specific config values | Reference |

---

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format       # Prettier -- format all files
cd app && bun run format:check # Prettier -- check without writing
```

---

## Session Approach

1. Read `CLAUDE.md` and `docs/reference/frontend-skills-review.md`
2. Start dev server (`cd app && bun run dev`)
3. Run `/frontend-design:teach-impeccable` -- complete the setup with project context
4. Spawn 3 subagents in parallel for pages 1-3, each running `/frontend-design:critique` on their assigned page
5. Spawn 3 subagents in parallel for pages 4-6
6. Synthesise all 6 critique outputs into a prioritised action plan
7. If time permits, begin addressing high-priority findings
