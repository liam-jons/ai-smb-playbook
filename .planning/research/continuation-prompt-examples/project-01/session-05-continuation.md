# Session 05 Continuation Prompt

**Project:** Bid Manager - AI-powered bid management platform for UK SMBs
**Previous Session:** Session 04 (Technology Stack Alignment)
**Date Created:** 2026-02-03

---

## Context Files to Read First

1. `.planning/initial-thoughts.md` - Product vision (updated Session 04 — tech stack, deployment model, open questions)
2. `.planning/session-summaries/session-summary-04.md` - What was completed in Session 04
3. `.planning/deep-dive-user-review-and-feedback.md` - **Critical** - User feedback Parts 1 & 2. Part 2 contains feature tiering, architectural decisions, security baseline, AI governance baseline, and UX direction.

---

## What Was Completed in Sessions 01-04

### Session 01: Research Setup
- Vision document created (`initial-thoughts.md`)
- 6 competitor sitemaps generated (1,890 URLs)
- 74 high-priority URLs identified for deep crawl
- Technology evaluations (Turso, Coolify, document parsing)
- UK tender ecosystem research
- SMB AI adoption psychology research

### Session 02: Deep Crawl & Transformation
- All 74 URLs scraped via Firecrawl CLI
- 6 competitor deep-dive summaries created and verified (9.4/10 quality score)
- Data transformation approach documented

### Session 03: Research Consolidation & Product Direction
- Extracted high-value sections from deep-dives, reorganised by 10 functional themes (`extracted-capabilities.md`)
- Built comprehensive feature inventory across 8 feature areas from all 6 competitors (`feature-inventory.md`)
- Researched 4 targeted questions: one-day setup, UK tender APIs, Teams integration, SSO gating (`session-03-research-findings.md`)
- User reviewed all outputs and provided detailed Part 2 feedback establishing feature tiers, security baseline, AI governance baseline, programmatic vs agentic distinction, and UX direction
- Created Logto.io evaluation — strong fit, 4.85/5
- Researched Stotles.com for UK procurement insights
- Investigated GSD workflow — 10-phase process understood
- Researched AI-first UX design patterns — 13 themes, extensive examples
- Updated `initial-thoughts.md` with all Session 01-03 findings

### Session 04: Technology Stack Alignment
- Cross-checked Coolify, Turso, Logto evaluations against product vision
- **Coolify evaluation updated:** Reframed around our operational model (we manage infra). Vercel repositioned. Hybrid multi-tenant deployment model added. UK data residency VPS providers identified.
- **Turso evaluation updated:** DB-per-tenant isolation (100K DBs per server). Concurrent writes: experimental beta, mitigated by DB-per-tenant. Hybrid document storage (filesystem/S3 + Turso). Pinecone rejected (data sovereignty). AgentFS reframed as "worth monitoring."
- **Auth evaluation updated:** Renamed to "Authentication Evaluation." 8 GiB RAM = conservative estimate (actual ~150-300MB). Hanko eliminated (no M2M, no RBAC). SuperTokens added as strong alternative (excellent FastAPI integration). Logto 4.75/5, SuperTokens 4.55/5. Final auth decision deferred to prototyping.
- **Frontend framework evaluation created:** Next.js (React) selected — CopilotKit AI copilot components, shadcn AI components, largest ecosystem. Score: 4.50/5.
- **Agent orchestration evaluation created:** Hybrid approach — Direct Claude API + selective LangGraph persistence. Thin orchestration layer, not heavy framework. May evolve during brainstorming.
- `initial-thoughts.md` updated with all Session 04 decisions

---

## Session 05 Objectives

### Primary Objective: Brainstorming Sessions

The research phase is complete. The technology stack is aligned. Session 05 is about **reimagining workflows from first principles** — this is the core of our differentiation.

Use `/brainstorm` for each topic. These are two-way dialogue sessions, not one-way reports. The user wants to be actively involved in shaping each decision.

#### Brainstorm Priority 1: Common Workflow Reimagining

For each of these 5 patterns, ask: How should this function in an AI-first world? What are the current pain points? What is the elegant solution?

1. **Import/Parse -> Analyse -> Draft -> Review -> Submit** — the universal bid workflow
2. **SME routing** — automated identification and assignment of subject matter experts
3. **Content freshness management** — scheduled reviews, expiration dates, health scores
4. **Win/loss feedback loops** — post-bid analysis feeding back into content quality
5. **Multi-step approval workflows** — review chains before submission

**Input material:**
- `.planning/research/competitor-analysis/competitor-extracted-capabilities.md` — Capabilities by theme
- `.planning/research/competitor-analysis/competitor-feature-inventory.md` — 8 feature areas with functionality lists
- `.planning/research/ux-design-research.md` — AI-first UX patterns

#### Brainstorm Priority 2: Document Gathering Methods

What methods are available for gathering past proposals, bid responses, and company documents? Both agentic and programmatic approaches. This directly feeds into the day-one experience.

**Input material:**
- `.planning/research/competitor-analysis/session-03-research-findings.md` (Question 1: setup)
- `.planning/research/third-party-product-evaluations/turso-evaluation.md` (document storage strategy)

#### Brainstorm Priority 3: UX Approach & Interaction Model

Define how users will interact with the product. Key decisions:
- Side-by-side working model (app + bid portal)
- Browser extension vs menu bar item vs task menu icon
- Content library interaction patterns
- AI suggestion presentation (inline vs panel vs chat)
- Confidence/uncertainty display
- Citation UX
- "I don't know" UX
- Approval workflow UX
- Command palette patterns
- Speed as a feature

**Input material:**
- `.planning/research/ux-design-research.md` (primary — 51KB, comprehensive)
- `.planning/research/competitor-analysis/competitor-feature-inventory.md`
- `.planning/research/third-party-product-evaluations/frontend-framework-evaluation.md` (CopilotKit, shadcn AI components, Tiptap)
- User feedback Part 2

#### Brainstorm Priority 4: Feature Reimagining

For each tier 1 feature area from the user's Part 2 feedback, reimagine from first principles using the "why" behind existing implementations.

Feature areas to reimagine:
1. AI-Assisted Response Writing
2. Content Library
3. Collaboration Tools
4. Document Analysis
5. Explainable AI / Citations
6. Bid/No-Bid Qualification
7. Post-Bid Evaluation

**Input material:**
- `.planning/research/competitor-analysis/competitor-feature-inventory.md` — Combined functionality lists per feature area
- `.planning/research/competitor-analysis/competitor-extracted-capabilities.md` — "Why" behind implementations
- User feedback Part 2 — Tier 1/Tier 2 feature breakdown

---

### Secondary Objective: After Brainstorming — Design Brief

Once brainstorming is complete (may span multiple sessions), consolidate outputs into a concise **Product Design Brief** that captures:
- Reimagined workflows
- UX principles and interaction model
- Architectural patterns chosen
- v1 scope boundaries

This is lighter than an SDD — it's the "what and why" without the "how." This becomes the input for `/gsd:new-project`.

### Tertiary Objective: `/gsd:new-project`

When the design brief is ready:
1. Skip GSD's built-in research phase (we have extensive research)
2. Feed the design brief into GSD's questioning phase
3. GSD produces PROJECT.md, requirements with REQ-IDs, and a phased roadmap

**GSD Preparation:**
- Core Value statement: "SMBs can complete bid responses faster using AI, without needing AI expertise"
- v1 Scope Boundaries: Defined during brainstorming
- Clear answers to GSD's questioning phase — What, Why, Who, What does "done" look like

---

## Important Context: Our Approach (Must Inform All Brainstorming)

1. **Building WITH AI, not adding AI.** Reimagine workflows from first principles. No "core AI features" or "add-ons" — focus on outcomes.
2. **Foundation models are the engine.** Claude + Skills + programmatic parsing is already powerful. No proprietary GPT needed.
3. **Strip away complexity.** Understand the "why", find the simplest path. If everyone is looking left, we go right.
4. **UX is critical.** Non-technical SMB users. Effortless, not powerful. Speed is a feature. Progressive disclosure. Invisible AI.
5. **Time-to-value is our differentiator.** Day-one experience: signup to first real work in under 4 hours.
6. **Honesty and transparency.** Consumption-based pricing. Face-to-face with SMBs.
7. **Security by default.** SSO from day one. Tenant isolation. Encryption. Audit trails.
8. **AI governance by default.** Citations on everything. "I don't know" over hallucination. No training on customer data.
9. **Extensibility matters.** Bid management is the first use case. Architecture supports future use cases.
10. **Human augmentation, not replacement.** AI makes processes easier. Humans review, approve, refine.

---

## Technology Stack (Decided/Recommended)

| Component | Technology | Status |
|-----------|------------|--------|
| LLM Provider | Anthropic (Claude) | Decided |
| Database | Turso (DB-per-tenant) | Decided |
| Authentication | Logto or SuperTokens | Evaluating (prototyping) |
| Deployment | Coolify (hybrid multi-tenant) | Decided |
| Frontend | Next.js (React) | Decided |
| Backend | Python / FastAPI | Decided |
| API Layer | Strawberry (GraphQL) | Decided |
| Orchestration | Direct Claude API + LangGraph persistence | Recommended |
| Vector Search | Turso native | Decided |
| Document Storage | Filesystem/S3 + Turso metadata | Decided |
| UI Integration | MCP Apps | Decided |

---

## Data Locations

### Research Documents (All in `.planning/research/`)

```
.planning/research/
├── competitor-analysis/
│   ├── altura-deep-dive.md
│   ├── brainial-deep-dive.md
│   ├── peak-deep-dive.md
│   ├── loopio-deep-dive.md
│   ├── qvidian-deep-dive.md
│   ├── responsive-deep-dive.md
│   ├── competitors.md
│   ├── competitor-extracted-capabilities.md
│   ├── competitor-feature-inventory.md
│   └── session-03-research-findings.md
├── third-party-product-evaluations/
│   ├── coolify-evaluation.md                  # Updated Session 04
│   ├── turso-evaluation.md                    # Updated Session 04
│   ├── logto-evaluation.md                    # Updated Session 04 (now "Authentication Evaluation")
│   ├── frontend-framework-evaluation.md       # NEW Session 04
│   ├── agent-orchestration-evaluation.md      # NEW Session 04
│   └── stotles-research.md
├── claude-capabilities/                       # 10 files including Agent SDK
├── turso/                                     # 3 files
├── langchain/                                 # 11 files
├── langchain-deep-agents/                     # 11 files
├── langchain-integrations/                    # 3 files
├── anthropic-zero-data-rentention-policy.md
├── gsd-workflow-investigation.md
├── ux-design-research.md
├── uk-tender-ecosystem.md
├── document-parsing-libraries.md
└── mcp-apps-overview.md
```

### User Feedback
```
.planning/deep-dive-user-review-and-feedback.md  # Parts 1 & 2 — product direction
```

### Market Research
```
.planning/market-research/
├── smb-research-report.md
├── combined-market-insights.md
└── legacy-mission-framework.md
```

---

## Open Questions for Session 05

1. How many brainstorming topics can we cover in one session? May need to prioritise or spread across sessions.
2. Authentication final decision (Logto vs SuperTokens) — deferred to prototyping, but brainstorming may surface preferences.
3. Peak's continuous learning method — user asked "What method are Peak using for this?" — needs investigation if not covered in existing research.
4. v1 scope boundaries — to be defined during brainstorming.

---

## Recommended Session 05 Approach

1. **Start with `/brainstorm` Priority 1: Common Workflow Reimagining** — This is the most impactful brainstorming topic. The 5 workflow patterns are the foundation of the product.

2. **If time permits, move to Priority 2 or 3** — Document gathering methods or UX approach. Priority 2 (document gathering) feeds into the day-one experience which is a key differentiator. Priority 3 (UX) informs how everything looks and feels.

3. **Each brainstorm session produces documented decisions** that narrow the design space.

4. **After brainstorming is complete** (may take multiple sessions), consolidate into a Product Design Brief.

5. **Then `/gsd:new-project`** — Feed the design brief into GSD's questioning phase.
