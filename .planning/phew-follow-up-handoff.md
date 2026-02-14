# Phew! Post-Training Follow-Up — Build Handoff

## Project Overview

### What this is
A structured follow-up deliverable for Phew Design Limited, following two AI training sessions delivered on 11 Feb 2026. The deliverable directly addresses feedback from Phew!'s MD and team, who found the training valuable but requested take-away materials and a summary to cement the learning.

### What we're delivering
Three interconnected outputs:

1. **Interactive Playbook** — A hosted React app (Vercel) serving as Phew!'s living AI reference guide, with two audience tracks (General Users and Developers). All prompts and examples include copy-to-clipboard functionality.
2. **Starter Kit** — Working skill files, command files, templates, and a governance policy that Phew! can drop into their projects immediately.
3. **Repeatable Workflow Process Doc** — A brief document capturing the end-to-end process (Granola transcription → AI summary → Claude-built deliverable) so this can be replicated for future clients.

### Why this approach
- Directly addresses the feedback: "a summary document or cheat-sheet highlighting the core techniques would have been a valuable addition"
- Goes beyond a PDF by making the content interactive, explorable, and immediately actionable
- The meta-narrative — "this was built using the exact tools and workflows we trained you on" — reinforces the training content
- Two audience tracks address the pacing feedback: non-devs aren't overwhelmed by technical detail, devs get the depth they need

### Client context
- **Company:** Phew Design Limited (https://www.phew.org.uk/) — UK-based SMB
- **Licences:** All staff have Claude Teams licences; developers have Claude Code access (likely via IDE, not terminal)
- **AI maturity:** Familiar with Claude for general tasks, but not yet familiar with concepts like sessions, context windows, skills, or structured AI workflows
- **Key contacts:** Matthew Burgess (MD), Amanda Kelly, Matt Bushby, Andrew Tate, Nick McCallum
- **Training delivered:** 11 Feb 2026 — two sessions: "AI and the Art of the Possible" (broad audience) and "Claude Code, QA Approaches" (dev/QA focus)

### Repo and hosting
- **Local repo:** `~/Documents/development/follow-up-and-feedback/`
- **Hosting:** Vercel (existing account)
- **GitHub:** Standalone repo (to be created)

---

## Repo Structure

```
follow-up-and-feedback/
├── .planning/                  # Specs, research outputs, phase plans
│   ├── research/               # Research task outputs
│   ├── specs/                  # Section-level specs for build agents
│   ├── source-context/         # Source documents from initial planning session
│   └── STATE.md                # Current project state
├── app/                        # React playbook app (Vite + React + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   │   ├── shared/         # Navigation, layout, copy button, feedback widget
│   │   │   ├── general/        # General track section components
│   │   │   └── dev/            # Developer track section components
│   │   ├── data/               # Content data (section text, prompts, examples)
│   │   └── assets/
│   └── public/
├── starter-kit/                # All deliverable files for Phew!
│   ├── skills/                 # .md skill files
│   ├── gsd-mapper/             # agent, command, workflow, and template files
│   ├── commands/               # .md command files
│   ├── plugins/                
│   │   └── claude-plugins-official/    # Plugin references and install guides
│   ├── templates/              # Governance policy, doc structure, CLAUDE.md templates
│   └── prompts/                # Session handoff prompts, example prompts
├── research/                   # Raw research outputs (site scrapes, findings)
├── docs/                       # Our internal docs
│   └── repeatable-workflow.md  # Process doc for replicating this for other clients
├── CLAUDE.md                   # Project context for build agents
└── README.md
```

**File provision note:** Liam has provided all plugin, skill, agent, and command .md files from the curated list in initial-thoughts doc, plus additional files (e.g., brainstorming, writing-plans etc. for the tools referenced throughout. These have been placed in the corresponding `starter-kit/` subfolders. Important note:
- `gsd-codebase-mapper` has it's own subfolder which contains it's own skill, command, agent, template, and workflow files
- All plugin files have been provided in full, as a reference - they are not saved in a way which would mean that they would function in this repository. They've been copied from the global Claude setup and provided so that the Phew! team can review the content.

---

## Phew! Training Feedback Summary

### Strengths to reinforce
- Strong technical expertise was well-received
- Actionable insights on session management, Skills, and prompt engineering
- Team valued understanding the "why" behind techniques

### Gaps this deliverable fills
- **"Cheat-sheet" request:** The entire playbook serves this purpose, but each section should surface key headlines prominently
- **Pacing concern:** Two-track approach ensures non-devs start with high-level concepts; dev track goes deeper
- **Retention:** Interactive format + copy-to-clipboard prompts + starter kit files = multiple reinforcement mechanisms

---

## Phases

### Phase 0: Research & Validation

These tasks produce findings that inform content decisions across the build. Each should output a concise research document to `.planning/research/`.

#### 0.1 — Phew! Website Scrape
**Tool:** Firecrawl MCP
**Target:** https://www.phew.org.uk/
**Purpose:** Extract company context for governance policy, brand voice setup, and future work (competitor analysis, market research, business development)
**Output:** `.planning/research/phew-site-content.md`
**Notes:**
- Capture: services offered, team structure, industry positioning, any published standards or values
- This content feeds into the governance policy (company context) and brand voice section (existing brand materials)
- Archive comprehensively — this will be reused for future Phew! work beyond this deliverable

#### 0.2 — UK English Enforcement Options
**Purpose:** Determine the simplest reliable method to ensure Claude outputs default to UK English
**Research scope:**
- Can a memory edit achieve this? (e.g., "Always use UK English spelling and grammar")
- Can a minimal skill enforce it without the full brand-review overhead?
- Is there an artifact-level or project-level setting?
- What does the brand-review command from the Anthropic Marketing plugin actually check — does it cover language/spelling variants?
**Output:** `.planning/research/uk-english-enforcement.md`
**Decision needed:** If a simpler method exists, we use that as the primary recommendation and note brand-review as the more comprehensive option. If not, we create a focused "language-enforcement" command separate from brand-review.

#### 0.3 — Slash Commands in Claude Desktop / claude.ai
**Purpose:** Determine whether slash commands (not just skills) can be invoked in Claude Desktop and/or claude.ai, and how
**Research scope:**
- Can users save and invoke `/commands` outside of Claude Code and CoWork?
- If skills can be invoked via natural language in these environments, what's the exact mechanism?
- How should we package session handoff tooling for non-dev users who don't have Claude Code or CoWork?
**Output:** `.planning/research/command-availability.md`
**Notes:** Liam can also test this directly — adding a command as a skill in a chat session to see if/how it's invoked. Results from both research and testing should be combined.

#### 0.4 — Brand Voice Skill Workflow Research
**Purpose:** Understand exactly what the brand-voice skill and brand-review command require from the user, so we can describe the setup process accurately in the playbook and provide a ready-to-use prompt - files are available as brand-voice.md and brand-review.md under the starter-kit folder
**Research scope:**
- What steps does the brand-voice skill walk users through?
- What inputs does it need (existing brand guidelines, examples, etc.)?
- What does it produce (a brand voice file? updates to CLAUDE.md?)?
- What does brand-review then check against?
- Where do the outputs live and how are they maintained?
**Output:** `.planning/research/brand-voice-workflow.md`
**Notes:** This will inform the brand voice section of the playbook — the goal is a step-by-step walkthrough with a copyable prompt that kicks off the setup process in Claude Desktop.

#### 0.5 — Context Window & Session Degradation Research
**Purpose:** Gather accurate information on how context works, what consumes tokens at session start, and how degradation manifests — to build the interactive context simulator
**Research scope:**
- Approximate token costs: system prompt, system tools, CLAUDE.md, skill descriptions, MCP tool definitions
- How does context compaction work? What gets summarised, what gets dropped?
- How does degradation manifest in practice? (earlier context becoming less influential, not literally "deleted")
- What does the official documentation say about context window behaviour?
- Reference `.planning/source-context/claude-code-capabilities-extension-options.md` — it contains the official "Context cost by feature" table and loading behaviour
**Output:** `.planning/research/context-window-mechanics.md`
**Presentation approach:** Proportional visualisation with ballpark ranges and a clear note that exact numbers vary by configuration. Show system prompt, system tools, CLAUDE.md, skills, MCP definitions, conversation history — and demonstrate how conversation accumulation pushes earlier content out of effective focus.

#### 0.6 — Capabilities Extension Audit
**Purpose:** Verify the decision tree content is comprehensive against current Claude capabilities
**Source:** `.planning/source-context/claude-code-capabilities-extension-options.md` (from Anthropic's official docs)
**Research scope:**
- Cross-reference against latest docs to ensure nothing's missing
- Confirm the comparison tables (Skill vs Subagent, CLAUDE.md vs Skill, MCP vs Skill, etc.) are current
- Check for any new extension mechanisms not covered
**Output:** `.planning/research/capabilities-audit.md`

#### 0.7 — App Tech Stack & Component Recommendations
**Purpose:** Recommend the specific libraries, component frameworks, and interaction patterns for the React app — so that Phase 1 specs and Phase 2 build agents are working from a shared technical foundation
**Research scope:**
- Component library recommendation (e.g., shadcn/ui, Radix, headless UI) — considering what's available in the artifact/React rendering environment if relevant, and what works well with Tailwind
- Charting/visualisation library for the context window simulator (e.g., D3, Recharts, custom SVG/CSS)
- Interactive decision tree component approach (e.g., accordion-based, flowchart, guided wizard)
- Copy-to-clipboard implementation
- Routing approach (React Router, hash-based, or single-page with scroll anchors)
- Any other UX patterns that would benefit from a library rather than custom implementation
**Output:** `.planning/research/app-tech-stack.md`
**Notes:** Recommendations should prioritise libraries that are well-represented in Claude's training data (as this improves build agent output quality), work well with Vite + Tailwind, and are lightweight enough for a content-focused app. This output should be referenced by ALL Phase 1 section specs and by Agent 1 (App Shell) in Phase 2.

---

### Phase 1: Section Planning

Each section of the playbook gets a planning spec before any build work begins. The spec gives the build agent everything it needs: content outline, interaction design, data sources, and acceptance criteria.

Specs are written to `.planning/specs/` and named to match the section they cover.

**Every spec must:**
- Reference the relevant source context documents from `.planning/source-context/` (not assume knowledge from this handoff alone)
- Reference `.planning/research/app-tech-stack.md` for all UI component and interaction pattern decisions
- Be self-contained: a build agent reading only that spec + referenced files should have everything it needs
- Include acceptance criteria specific to that section

#### Playbook Sections — General Track

**1.1 — Welcome & Orientation**
- Brief intro explaining what this is, why it exists, and how to use it
- Track selector: "I'm a general user" / "I'm a developer"
- Note about how it was built (meta-narrative)
- Feedback mechanism introduction (link/button always accessible)

**1.2 — How Context Works (Interactive Simulator)**
- The hero piece of the playbook
- Visual representation of the 200k token context window
- Show what's loaded at session start: system prompt (~10-12k), system tools (varies), CLAUDE.md, skill descriptions, MCP tool definitions
- Interactive: user can "add" conversation messages and see the window fill
- Show degradation: as context fills, earlier items become visually faded/less prominent
- Key takeaway: why starting fresh sessions matters, and when to do it
- Include ballpark token ranges with "exact numbers vary" caveat
- Copyable prompt: session handoff prompt (export context → start new session)

**1.3 — Session Management**
- When to stop a session and start a new one (rules of thumb)
- How to get Claude to write its own handoff prompt / structured summary
- Copyable handoff prompt template
- How to break tasks into subtasks (the atomic task principle from the training)
- Reference to the 200k token allocation per subtask benefit

**1.4 — Skills, Extensions & the Decision Tree**
- Interactive decision tree: "I want to... → here's the right extension mechanism"
- Based on `.planning/source-context/claude-code-capabilities-extension-options.md`, adapted for Phew!'s context
- Cover: CLAUDE.md, Skills, MCP/Connectors, Commands, Plugins, Subagents, Agent Teams, Hooks
- Comparison tables from the source doc, presented interactively
- For each: what it is, when to use it, context cost, how to set it up
- Clearly distinguish what's available in Claude Teams/Desktop vs Claude Code vs CoWork

**1.5 — AI Governance Policy**
- The full governance policy template, presented as an interactive walkthrough
- Covers all extension types: MCPs/connectors, official marketplace plugins, third-party marketplace plugins (e.g., skills.sh), internally developed skills, third-party skills, commands
- Tailored to SMB context (not enterprise — accessible language, proportionate processes)
- Includes: approval workflows, risk assessment criteria, maintenance expectations, roles and responsibilities
- Downloadable as a standalone document from the starter kit
- Informed by Phew! website scrape (company context)
- Designed as a parameterised template (company name, industry context) so it's reusable across clients

**1.6 — Brand Voice & UK English**
- Step-by-step walkthrough of setting up brand voice using the Anthropic Marketing plugin's brand-voice skill
- What Phew! needs to prepare (existing brand guidelines, tone examples, etc.)
- Copyable prompt to kick off the setup in Claude Desktop
- UK English enforcement: whatever approach Phase 0 identified as optimal
- If brand-review command covers this: show how to use it
- If separate mechanism is better: provide that, note brand-review as the comprehensive option
- Guidance on the brand-review command for ongoing content checking

**1.7 — Recurring & Scheduled Tasks**
- What's currently possible (and what isn't yet)
- Patterns for automation: browser automation via CoWork, monitoring workflows, self-updating skills
- Reference to the Deal monitoring / website change detection from the training
- Honest about limitations — not everything can be scheduled yet

#### Playbook Sections — Developer Track

**1.8 — CLAUDE.md Files**
- What they are and why they matter
- How to structure them (keep under ~500 lines, use as table of contents not encyclopedia)
- Reference the OpenAI/Reddit approach from `.planning/source-context/suggestions-related-to-doc-structure.md`: CLAUDE.md as map, /docs as system of record
- The claude-md-improver skill and revise-claude-md command — what they do, how to use them
- Provide the skill/command files in the starter kit
- Copyable template for a first CLAUDE.md file
- Best practices from the training: tech stack specs, dev commands, architecture references, auth patterns, DB schemas, "no real users" note for dev environments

**1.9 — Documentation Structure for AI-Readable Codebases**
- Adapted from the OpenAI/Reddit approach (see `.planning/source-context/suggestions-related-to-doc-structure.md`), scaled to Phew!'s maturity
- Recommended /docs structure:
  ```
  docs/
  ├── architecture/        # System architecture, domain model
  ├── conventions/          # Coding standards, naming, patterns
  ├── integrations/         # Third-party service documentation
  ├── schemas/              # Database schemas, API schemas
  └── references/           # LLM-ready external docs (llms.txt files)
  ```
- Progressive disclosure principle: CLAUDE.md points to /docs, Claude navigates as needed
- The gsd-codebase-mapper as a starting point for generating initial docs
- Maintenance: how to keep docs current (agent-driven doc gardening, CI checks)
- Key principle: "from the agent's point of view, anything it can't access in-context effectively doesn't exist"

**1.10 — Codebase Mapping**
- The gsd-codebase-mapper agent: what it does, how to run it
- Produces 7 structured documents: STACK.md, INTEGRATIONS.md, ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md
- How to use the output as a baseline, then build the /docs structure from there
- Parallel subagent architecture — demonstrate the concept by explaining how mapper uses 4 agents
- How this connects to the doc structure from section 1.9

**1.11 — Avoiding Hallucinations & Quick-Fix Behaviour**
- Patterns from the training and initial-thoughts doc:
  - Breaking tasks into atomic components
  - Planning before implementing
  - Creating specs and asking for recommendations/options
  - Prioritising best practice
  - Giving Claude an "out" — ensuring "I don't know" is an option
  - For larger tasks: outline open questions, respond to them, THEN implement
- Each pattern as a copyable prompt example
- The agent harness concept for structured optimisation

**1.12 — AI-Driven Regression Testing**
- Current state: what's possible with browser-based testing workflows
- How this could complement or replace Ghost Inspector
- CoWork's browser automation capabilities (orange hue = AI control)
- Integration approaches: custom solutions vs existing tools
- Practical starting points for Phew!

**1.13 — Safe MCP Usage**
- What MCPs are and how they work (with context cost implications from section 1.2)
- Recommended MCPs: deepwiki, chrome-devtools
- Safety considerations: MCP connections can fail silently, tools disappear without warning
- How to check status (`/mcp`), how to manage token costs
- Governance policy reference (section 1.5)

**1.14 — Plugin Recommendations**
- The curated list from the initial-thoughts doc with install guidance
- For each plugin: what it does, when to use it, any security considerations
- Plugins covered: commit-commands, plugin-dev, pr-review-toolkit, security-guidance, code-simplifier, github, context7, playwright, claude-md-management, sentry, php-lsp, coderabbit + more - review full list and ensure all are included
- Distinction between official marketplace (claude-plugins-official) and third-party
- Cross-reference to governance policy (section 1.5)

**1.15 — Codebase Auditing & Technical Debt**
- Using agents to audit a codebase
- Using agents to handle well-documented technical debt
- How this connects to the codebase mapping output (section 1.10)
- Multi-file cross-reference analysis capabilities
- Automatic architecture documentation generation

#### Starter Kit Planning

**1.16 — Starter Kit Contents**
Plan the exact contents and structure of each file:
- Governance policy template (parameterised for reuse)
- Session handoff prompt(s)
- UK English enforcement skill/command (based on Phase 0 findings)
- Brand voice skill files (from Anthropic Marketing plugin)
- claude-md-improver skill + revise-claude-md command files
- Recommended /docs structure template (as a scaffold script or markdown guide)
- gsd-codebase-mapper command file + agent file
- All plugin files from curated list
- Example CLAUDE.md template
- Any additional prompts referenced in playbook sections

#### Supporting Docs

**1.17 — Repeatable Workflow Process Doc**
Document the end-to-end process:
1. Client meeting(s) recorded and transcribed (Granola / Otter.ai)
2. Transcription tool summarises and identifies focus areas
3. Summary + focus areas provided to Claude as context
4. Claude produces structured plan
5. Plan executed via Claude Code / CoWork with parallel agents
6. Interactive deliverable deployed to Vercel
7. Starter kit bundled alongside

This becomes a reusable playbook for delivering post-training follow-ups to any client.

---

### Phase 2: Build (Parallel Agents)

Each agent receives its section spec from `.planning/specs/` and works independently. The orchestrator coordinates but doesn't need to hold all content in context.

#### Agent Allocation

**Agent 1: App Shell & Infrastructure**
- Vite + React + Tailwind project setup
- Routing between tracks (General / Developer)
- Shared components: navigation, layout, copy-to-clipboard button, feedback widget
- Feedback mechanism: embedded form or mailto link to Liam's Gmail
- Responsive design (works on desktop and mobile)
- Vercel deployment configuration

**Agent 2: Context & Session Management Sections (1.2, 1.3)**
- The interactive context window simulator (hero piece)
- Session management content and handoff prompt templates
- This is the most complex interactive component

**Agent 3: Skills, Extensions, Governance & Brand (1.4, 1.5, 1.6, 1.7)**
- Decision tree interactive component
- Governance policy walkthrough
- Brand voice setup guide with copyable prompts
- UK English enforcement guide
- Recurring/scheduled tasks section

**Agent 4: Developer Track Sections (1.8 — 1.15)**
- All developer-focused content
- CLAUDE.md guide, doc structure, codebase mapping, hallucination patterns
- Testing, MCP, plugins, auditing sections
- Heavy on copyable prompts and practical examples

**Agent 5: Starter Kit Files (1.16)**
- Generate all standalone deliverable files
- Governance policy template
- Session handoff prompts
- UK English enforcement files
- Doc structure template
- Package and organise in starter-kit/ directory

**Agent 6: Welcome, Process Doc & Integration Content (1.1, 1.17)**
- Welcome/orientation section
- Repeatable workflow process doc
- Cross-referencing content (ensuring sections link to each other correctly)

---

### Phase 3: Integration & Polish

- Merge all agent outputs into cohesive app
- Cross-reference checklist: every item from initial-thoughts doc is covered (see checklist below)
- Ensure consistent tone across sections (non-condescending, practical, Phew!-appropriate)
- Weave in meta-narrative where natural
- Test all copy-to-clipboard buttons
- Test feedback mechanism
- Test responsive layout
- Verify all starter kit files are complete and correctly structured
- Ensure all prompts are well-crafted and immediately usable

### Phase 4: Packaging & Deployment

- Deploy app to Vercel
- Push to GitHub repo
- Bundle starter kit as downloadable from within the app (and as repo folder)
- Write brief delivery note / email for Phew! explaining:
  - What's included
  - Suggested order of adoption (quick wins first)
  - How to provide feedback (the mechanism in the app)
  - Offer for follow-up session if needed
- Note the governance policy's reusability for other clients

---

## Coverage Checklist

Every item from the initial-thoughts document mapped to a playbook section:

### General

| Item | Section |
|------|---------|
| How to structure a skill file and when to use Skill vs MCP vs Commands | 1.4 |
| Governance: safe process for adopting external skills | 1.5 |
| Governance: standards for internal skills | 1.5 |
| Use case: UK English enforcement | 1.6 |
| Use case: Phew branding & templates | 1.6 |
| Use case: Security / development standards | 1.5, 1.14 |
| Use case: Recurring/scheduled tasks | 1.7 |
| Create policy for Skills, plugins, connectors | 1.5 |
| Send skill files as examples | Starter Kit |
| Visualisation of how context works | 1.2 |
| When to stop a session and start a new one | 1.3 |
| Handoff prompts and structured summaries | 1.3 |
| How to break tasks into subtasks | 1.3 |
| Managing context accuracy (project folder, memory, CLAUDE.md) | 1.2, 1.8 |
| Create a skill to clean context files | Starter Kit (claude-md-improver) |

### Development

| Item | Section |
|------|---------|
| Setting up and maintaining CLAUDE.md files | 1.8 |
| LLM-ready documentation structure | 1.9 |
| Using agents to document and maintain codebase docs | 1.9, 1.10 |
| Patterns for avoiding hallucinations and quick-fix behaviour | 1.11 |
| AI-driven regression testing (Ghost Inspector complement/replacement) | 1.12 |
| Third-party tools: Coderabbit, Mintlify, agent-browser | 1.14 |
| Setting up MCPs safely: deepwiki, chrome-devtools | 1.13 |
| Utilising plugins safely (curated list) | 1.14 |
| Agents to audit codebase | 1.15 |
| Agents to handle documented technical debt | 1.15 |

### From Training Feedback

| Item | Section |
|------|---------|
| Summary/cheat-sheet with key headlines | Entire playbook + each section's key takeaways |
| Pacing: high-level before technical depth | Two-track approach |
| Actionable reference material | Copy-to-clipboard prompts throughout |

---

## Key Design Decisions

### Context Simulator Approach
- Proportional visualisation, not precise token counts
- Ballpark ranges with clear "exact numbers vary" caveat
- Show: system prompt, system tools, CLAUDE.md, skill descriptions, MCP definitions, conversation history
- Degradation: as context fills, earlier conversation content visually fades — representing reduced influence, not deletion
- Include compaction concept: when context is full, Claude summarises older content to make room

### Governance Policy Approach
- SMB-appropriate: accessible language, proportionate processes
- Not enterprise-grade bureaucracy
- Parameterised: company name, industry context, team size — making it reusable
- Covers all extension types comprehensively but concisely

### Copy-to-Clipboard UX
- Every prompt, example, and template in the app has a copy icon button
- Visual confirmation on copy (brief "Copied!" indicator)
- Prompts are syntax-highlighted for readability

### Feedback Mechanism
- Persistent but unobtrusive (e.g., floating button or footer link)
- Options: request more info on a topic, report an issue, general feedback
- Directed to Liam's Gmail
- Approach: either embedded Google Form (richer) or pre-populated mailto (simpler)
- Decision: confirm with Liam during build — start with mailto, upgrade if time allows

### Starter Kit File Delivery
- Files are available both as downloads from within the app AND as the starter-kit/ repo folder
- Each file includes a brief header comment explaining what it does and how to install/use it
- Highlight in the app: installing plugins gives automatic updates vs copying files requires manual maintenance
- For plugins where Phew! prefers not to install: provide raw .md files as fallback

---

## Dependencies & Sequencing

```
Phase 0 (Research — all tasks can run in parallel)
  ├── 0.1 Phew! site scrape
  ├── 0.2 UK English options
  ├── 0.3 Slash command availability
  ├── 0.4 Brand voice workflow
  ├── 0.5 Context window mechanics
  ├── 0.6 Capabilities audit
  └── 0.7 App tech stack recommendations
       │
       ▼
Phase 1 (Planning — sequential, but informed by Phase 0 outputs)
  ├── 1.1–1.7   General track section specs
  ├── 1.8–1.15  Dev track section specs
  ├── 1.16      Starter kit spec
  └── 1.17      Process doc spec
       │
       ▼
Phase 2 (Build — 6 parallel agents, each working from their spec)
  ├── Agent 1: App shell + infrastructure
  ├── Agent 2: Context & session sections
  ├── Agent 3: Skills, governance, brand sections
  ├── Agent 4: Developer track sections
  ├── Agent 5: Starter kit files
  └── Agent 6: Welcome, process doc, integration content
       │
       ▼
Phase 3 (Integration & Polish)
       │
       ▼
Phase 4 (Packaging & Deployment)
```

**Critical dependencies:**
- Phase 0.2 (UK English) must complete before Phase 1.6 spec (Brand & Language section)
- Phase 0.3 (Slash commands) must complete before Phase 1.3 spec (Session Management — handoff packaging)
- Phase 0.4 (Brand voice) must complete before Phase 1.6 spec
- Phase 0.5 (Context mechanics) must complete before Phase 1.2 spec (Context Simulator)
- Phase 0.1 (Site scrape) must complete before Phase 1.5 spec (Governance Policy)
- Phase 0.7 (Tech stack) must complete before ALL Phase 1 specs (establishes shared UI decisions)
- All Phase 1 specs must complete before their corresponding Phase 2 agent begins

---

## Source Context Documents

All source documents from the initial planning session are stored in `.planning/source-context/` and should be treated as primary reference material by all agents. These documents contain the full context behind every decision in this handoff.

| File | Location in repo | Purpose |
|------|-------------------|---------|
| `phew-training-ai-and-the-art-of-the-possible-summary.md` | `.planning/source-context/` | Meeting 1 summary — broad audience session |
| `phew-training-claude-code-and-qa-summary.md` | `.planning/source-context/` | Meeting 2 summary — dev/QA session |
| `phew-initial-thoughts-for-meeting-follow-up.md` | `.planning/source-context/` | Vetted list of topics to cover — the coverage checklist maps against this |
| `feedback-from-phew.md` | `.planning/source-context/` | MD reference + team feedback — informs tone and approach |
| `claude-code-capabilities-extension-options.md` | `.planning/source-context/` | Official Anthropic docs on extension mechanisms — primary source for decision tree (1.4) and context cost sections (1.2) |
| `suggestions-related-to-doc-structure.md` | `.planning/source-context/` | Reddit/OpenAI approach to agent-friendly doc structure — primary source for sections 1.9 and 1.10 |
| `map-codebase.md` | `.planning/source-context/` | gsd-codebase-mapper command file — referenced in section 1.10 |

**Agents should read these files directly** when working on their respective sections. The "Purpose" column indicates which sections each file is most relevant to, but agents should use their judgement — multiple files may be relevant to any given section.

---

## Notes for Build Session

- The CLAUDE.md file for this project should reference this handoff doc as the primary planning document
- Each research task in Phase 0 should write its output as a clean, concise markdown file — these become reference material for spec-writing in Phase 1
- Each spec in Phase 1 should be self-contained: a build agent reading only that spec should have everything it needs to produce its section
- The app should be buildable and testable incrementally — Agent 1 (shell) should complete first so other agents' outputs can be slotted in
- All content should be written for a UK audience (Phew! are UK-based, all examples should use UK English, £ not $, UK regulatory references where relevant)
- The governance policy is designed to be reusable — keep Phew!-specific content parameterised or in clearly marked sections
- The repeatable workflow doc is for our internal use but could become a selling point for future training engagements
