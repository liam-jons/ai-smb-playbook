# Session 27 -- Visual Critique Sweep (Browser-Based)

## Goal

Deploy **6 parallel agents**, each using the `agent-browser` skill to open pages in a real browser, take screenshots, and run a visual `/critique` against the live rendered output. The aim is to catch **any remaining design, layout, accessibility, or content issues** that survived the code-level audit in Sessions 21--26 -- issues that only become visible when the page is actually rendered and interacted with.

This is a **read-only audit session** -- no code changes. The output is a set of per-page critique reports saved to `agent-outputs/visual-critique-*.md`, which will inform the next (and hopefully final) round of fixes before templatisation.

---

## Context

This is the AI SMB Playbook -- a React app providing interactive guidance for UK SMBs adopting Claude AI. Three outputs per client deployment:
1. **Interactive Playbook** -- React app with two audience tracks (General Users / Developers)
2. **Starter Kit** -- Drop-in skill files, commands, templates, governance policy
3. **Repeatable Workflow Process Doc** -- Internal process documentation

**Read first:** `CLAUDE.md` at repo root -- critical rules include UK English, Tailwind v4 (no config file), two-track content, parameterisation via `config/site.ts`.

**Design guidelines:** `docs/reference/frontend-skills-review.md` -- comprehensive design and engineering standards. Each agent should reference this for critique criteria.

---

## Completed Work (Sessions 1--26)

### Sessions 1--20: Build & Content
Full application built -- 17 content sections across 2 tracks, interactive tools (context simulator, feasibility builder, ROI calculator), starter kit file browser, governance policy generator. All content reviewed and refined.

### Sessions 21--26: Design Audit & Parameterisation
~160 design audit issues identified and resolved across ~30 source files. All client-specific references parameterised through `siteConfig`. Zero hardcoded "Phew" / "Ghost Inspector" / "safeguarding" / "LMS" / "DBS" references outside `config/site.ts`.

### Build Status (End of Session 26)
- `cd app && bun run build` -- Pass
- `cd app && bun run lint` -- Clean
- `cd app && bun run format:check` -- All files formatted
- `grep -i "phew" app/src/` outside siteConfig -- Zero matches

---

## What This Session Does: Visual Critique Sweep

### Prerequisites

1. Start the dev server: `cd /Users/liamj/Documents/development/ai-smb-playbook/app && bun run dev`
2. Confirm it's running on `http://localhost:4100`
3. Deploy 6 agents in parallel as described below

### Agent Allocation

Each agent runs the `agent-browser` skill to navigate to assigned pages, take screenshots at **3 viewport widths** (375px mobile, 768px tablet, 1440px desktop), and produce a structured critique report.

| Agent | Pages | URLs |
|-------|-------|------|
| **Agent 1: Home + Welcome** | Home page, Welcome section | `http://localhost:4100/`, `http://localhost:4100/general/welcome` |
| **Agent 2: Context + Sessions** | Context Simulator, Session Management | `http://localhost:4100/general/context`, `http://localhost:4100/general/sessions` |
| **Agent 3: ROI + Feasibility** | ROI Measurement (includes Feasibility Builder) | `http://localhost:4100/general/roi-measurement` |
| **Agent 4: Skills/Extensions + Brand Voice** | Skills & Extensions, Brand Voice | `http://localhost:4100/general/skills-extensions`, `http://localhost:4100/general/brand-voice` |
| **Agent 5: Starter Kit + Governance** | Starter Kit, Governance Policy | `http://localhost:4100/general/starter-kit`, `http://localhost:4100/general/governance` |
| **Agent 6: Developer Track** | CLAUDE.md, Regression Testing, Hallucinations | `http://localhost:4100/developer/claude-md`, `http://localhost:4100/developer/regression-testing`, `http://localhost:4100/developer/hallucinations` |

### Agent Instructions (Same for All 6)

Each agent should be given this brief alongside its page assignments:

```
You are running a visual critique of rendered pages in the AI SMB Playbook.

## Setup
1. Use the agent-browser skill to interact with the browser
2. For each assigned page:
   a. Set viewport to 1440px wide: `agent-browser set viewport 1440 900`
   b. Navigate to the page: `agent-browser open <url>`
   c. Wait for load: `agent-browser wait --load networkidle`
   d. Take a full-page screenshot: `agent-browser screenshot --full /tmp/critique-{page}-desktop.png`
   e. Read the screenshot to examine the rendered output
   f. Scroll through the page taking snapshots to understand all content
   g. Repeat at 768px: `agent-browser set viewport 768 1024`
   h. Repeat at 375px: `agent-browser set viewport 375 812`

3. Also test dark mode:
   a. Open browser console and run: `agent-browser execute "document.documentElement.classList.add('dark')"`
   b. Take a dark mode screenshot at 1440px

4. Test interactive elements:
   - Click buttons, open accordions, switch tabs
   - Check that hover states work
   - Verify copy buttons function

## Critique Criteria

For each page, evaluate against these categories:

### Visual Quality (score 1-10)
- Typography hierarchy: Are headings, subheadings, body text, and labels clearly differentiated?
- Spacing and rhythm: Is there consistent breathing room? Any cramped or sparse areas?
- Colour and contrast: Do text and backgrounds have sufficient contrast? Are semantic colours used correctly?
- Visual distinction: Are interactive tools (simulators, calculators, builders) visually distinct from prose?
- Dark mode: Does everything remain readable and well-contrasted in dark mode?

### Layout & Responsiveness (score 1-10)
- Mobile (375px): Does content reflow sensibly? Are touch targets large enough (44px)?
- Tablet (768px): Does the 2-column layout trigger at the right point? Any awkward in-between states?
- Desktop (1440px): Is the content area appropriately constrained? No line lengths over ~75 characters?
- Overflow: Do any tables, code blocks, or cards break out of their containers?
- Scroll indicators: Are scroll hints visible on overflowing content?

### Interaction Design (score 1-10)
- Button hierarchy: Is there a clear primary/secondary distinction?
- Hover and focus states: Are they visible and consistent?
- Accordion/tab behaviour: Do they open/close smoothly?
- Copy buttons: Are they visible and do they provide feedback?
- Navigation: Are cross-references and section links working?

### Content Quality (score 1-10)
- UK English: Any American spellings or terminology?
- Tone: Practical and non-condescending? Free of AI hype or jargon?
- Parameterisation: Any visible hardcoded client references that should be generic?
- Clarity: Is the content scannable? Are sections clearly titled?

### Accessibility (score 1-10)
- Semantic HTML: Correct heading hierarchy? Lists using <ul>/<ol>?
- ARIA: Are interactive elements properly labelled?
- Keyboard: Can all interactive elements be reached via Tab?
- Colour independence: Is meaning conveyed through more than colour alone?

## Output Format

Write your findings to: `agent-outputs/visual-critique-{agent-name}.md`

Use this structure per page:

```markdown
# Visual Critique: {Page Name}

**URL:** {url}
**Date:** 2026-02-17

## Scores

| Category | Score | Notes |
|----------|-------|-------|
| Visual Quality | X/10 | ... |
| Layout & Responsiveness | X/10 | ... |
| Interaction Design | X/10 | ... |
| Content Quality | X/10 | ... |
| Accessibility | X/10 | ... |
| **Overall** | **X/10** | ... |

## Issues Found

### Critical (must fix before templatisation)
- [ ] {issue description} — {viewport/mode where seen}

### Important (should fix)
- [ ] {issue description} — {viewport/mode where seen}

### Minor (nice to have)
- [ ] {issue description} — {viewport/mode where seen}

## What Works Well
- {positive observation}
- {positive observation}
```

Be thorough but honest. If a page scores 9/10, say so -- do not invent problems.
Focus on issues that are VISIBLE in the rendered output, not code-level concerns.
```

---

## Key Conventions Reminder

- **UK English throughout.** All content, examples, and copy must use UK English spelling and grammar.
- **Tailwind v4 -- no config file.** Theme customisation is in `app/src/index.css` via `@theme inline {}`.
- **Two-track content.** General track (non-technical) and Developer track (technical depth).
- **`siteConfig`** in `config/site.ts` is the single source for all client-specific values.
- **Design references:** Stripe Docs and Linear (clean, approachable). Anti-references: enterprise SaaS dashboards, AI startup landing pages, generic documentation sites.
- **Interactive tools must feel distinct** from surrounding prose -- they are the product's key differentiator.
- **Accessibility modes:** Dyslexia, high-contrast, large-text -- available via theme settings.

## Build & Dev Commands

```bash
cd app && bun install          # Install dependencies
cd app && bun run dev          # Local dev server (port 4100)
cd app && bun run build        # TypeScript check + production build
cd app && bun run lint         # ESLint
cd app && bun run format:check # Prettier -- check without writing
```

## Deployment

- **Production:** https://ai-smb-playbook.vercel.app
- **GitHub:** https://github.com/liam-jons/ai-smb-playbook
- Auto-deploys on push to `main` via Vercel

## Verification After This Session

- [ ] All 6 agents completed their critique reports
- [ ] Reports saved to `agent-outputs/visual-critique-*.md`
- [ ] A synthesis document summarising all findings, prioritised by severity
- [ ] No code changes made -- this is audit-only
- [ ] Issues triaged into: fix before templatisation / fix later / acceptable

## Pages Reference (All URLs)

### General Track
| Page | URL |
|------|-----|
| Home | `http://localhost:4100/` |
| Welcome | `http://localhost:4100/general/welcome` |
| Context Simulator | `http://localhost:4100/general/context` |
| Session Management | `http://localhost:4100/general/sessions` |
| Skills & Extensions | `http://localhost:4100/general/skills-extensions` |
| Governance Policy | `http://localhost:4100/general/governance` |
| Brand Voice | `http://localhost:4100/general/brand-voice` |
| Recurring Tasks | `http://localhost:4100/general/recurring-tasks` |
| ROI Measurement | `http://localhost:4100/general/roi-measurement` |
| Starter Kit | `http://localhost:4100/general/starter-kit` |

### Developer Track
| Page | URL |
|------|-----|
| CLAUDE.md | `http://localhost:4100/developer/claude-md` |
| Documentation | `http://localhost:4100/developer/documentation` |
| Codebase Mapping | `http://localhost:4100/developer/codebase-mapping` |
| Hallucinations | `http://localhost:4100/developer/hallucinations` |
| Regression Testing | `http://localhost:4100/developer/regression-testing` |
| MCP Usage | `http://localhost:4100/developer/mcp-usage` |
| Plugins | `http://localhost:4100/developer/plugins` |
| Technical Debt | `http://localhost:4100/developer/technical-debt` |

## Open Items

1. **Remaining data file refs** -- The parameterisation sweep covered all component and page files. A few data files (`starter-kit-data.ts`, `brand-voice-data.ts`, `session-management-data.ts`, `roi-data.ts`, `context-simulator-data.ts`) were also cleaned up in Session 26. The visual critique may surface any that render visibly.
2. **Creative themes** -- Three creative themes (retro-terminal, synthwave, minimal-ink) exist but have not been audited. Out of scope for this session unless agents notice broken rendering.
3. **Accessibility modes** -- Dyslexia, high-contrast, and large-text modes could optionally be tested by toggling them in the theme settings panel. Nice-to-have for this session.
