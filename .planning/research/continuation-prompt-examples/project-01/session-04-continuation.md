# Session 04 Continuation Prompt

**Project:** Bid Manager - AI-powered bid management platform for UK SMBs
**Previous Session:** Session 03 (Research Consolidation & Product Direction)
**Date Created:** 2026-02-03

---

## Context Files to Read First

1. `.planning/initial-thoughts.md` - Product vision (updated end of Session 03)
2. `.planning/session-summaries/session-summary-03.md` - What was completed in Session 03
3. `.planning/deep-dive-user-review-and-feedback.md` - **Critical** - User feedback Parts 1 & 2. Part 2 contains feature tiering, architectural decisions, security baseline, AI governance baseline, and UX direction.

---

## What Was Completed in Sessions 01-03

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
- Created Logto.io evaluation (`logto-evaluation.md`) - strong fit, 4.85/5
- Researched Stotles.com for UK procurement insights (`stotles-research.md`)
- Investigated GSD workflow (`gsd-workflow-investigation.md`) - 10-phase process understood
- Researched AI-first UX design patterns (`ux-design-research.md`) - 13 themes, extensive examples
- Reviewed `initial-thoughts.md` and identified all sections needing updates (documented below)

---

## Session 04 Objectives

### Objective 1: `initial-thoughts.md` — COMPLETED (end of Session 03)

The document was fully restructured at the end of Session 03, integrating all research findings and user feedback. Key changes:
- 7 core principles (Building WITH AI, UX, Time-to-Value, No Lock-In, Security by Default, Transparency, Extensibility)
- AI Governance Baseline section added
- Day-One Experience section (marked "under evaluation")
- Technology stack updated (Logto, orchestration candidates including Deep Agents and Claude Agent SDK)
- MCP App positioned as core differentiator (not lower priority)
- Feature scope references `deep-dive-user-review-and-feedback.md` Part 2 rather than duplicating
- Research status fully updated
- All answered open questions marked as resolved

**Action for Session 04:** Review the updated document. If adjustments are needed, edit in place.

---

### Objective 2: Align Technology Evaluations to Product Vision

The three technology evaluations were written before the full product vision was articulated. Review each against the updated `initial-thoughts.md`:

| Evaluation | File | Key Question |
|-----------|------|--------------|
| Coolify | `.planning/research/third-party-product-evaluations/coolify-evaluation.md` | Does the deployment model align with our SMB data sovereignty needs and our managed/self-managed service models? |
| Turso | `.planning/research/third-party-product-evaluations/turso-evaluation.md` | Does the data architecture align with our content library, agent state, and vector search needs? Is the AgentFS alpha risk acceptable? |
| Logto | `.planning/research/third-party-product-evaluations/logto-evaluation.md` | Does the auth architecture align with our SSO-by-default, multi-tenant, M2M agent auth needs? |

**Cross-cutting questions:**
- Do all three work together cleanly? (Logto needs PostgreSQL via Coolify, app connects to Turso for data, Logto for auth)
- Are there gaps in the stack? (e.g., do we need a separate vector database, or is Turso's native vector search sufficient?)
- What about the frontend framework? (Not yet evaluated)
- What about the agent orchestration layer? (LangChain vs LangGraph vs Deep Agents vs Claude Agent SDK — not yet decided. Research exists for all four: `langchain/`, `langchain-deep-agents/`, `claude-capabilities/claude-capabilities-agent-sdk-*.md`)

---

### Objective 3: Brainstorm Sessions

The user wants two-way `/brainstorm` dialogue sessions to reimagine features from first principles. These should happen BEFORE `/gsd:new-project`.

**Brainstorming topics identified:**

#### Priority 1: Common Workflow Reimagining
For each of these 5 patterns, ask: How should this function in an AI-first world? What are the current pain points? What is the elegant solution?

1. **Import/Parse -> Analyse -> Draft -> Review -> Submit** - the universal bid workflow
2. **SME routing** - automated identification and assignment of subject matter experts
3. **Content freshness management** - scheduled reviews, expiration dates, health scores
4. **Win/loss feedback loops** - post-bid analysis feeding back into content quality
5. **Multi-step approval workflows** - review chains before submission

**Input material:** `competitor-analysis/competitor-extracted-capabilities.md`, `competitor-analysis/competitor-feature-inventory.md`, `ux-design-research.md`

#### Priority 2: Document Gathering Methods
What methods are available for gathering past proposals, bid responses, and company documents? Both agentic and programmatic approaches. This directly feeds into the day-one experience.

**Input material:** `competitor-analysis/session-03-research-findings.md` (Q1: setup), `third-party-product-evaluations/turso-evaluation.md` (document ingestion)

#### Priority 3: UX Approach & Interaction Model
Define how users will interact with the product. Key decisions:
- Side-by-side working model (app + bid portal)
- Browser extension vs menu bar item vs task menu icon
- Content library interaction patterns
- AI suggestion presentation (inline vs panel vs chat)
- Confidence/uncertainty display
- Citation UX
- "I don't know" UX
- Approval workflow UX

**Input material:** `ux-design-research.md` (primary), `competitor-analysis/competitor-feature-inventory.md`, user feedback Part 2

#### Priority 4: Feature Reimagining
For each tier 1 feature area from the user's Part 2 feedback, reimagine from first principles using the "why" behind existing implementations.

**Input material:** `competitor-analysis/competitor-feature-inventory.md`, `competitor-analysis/competitor-extracted-capabilities.md`, user feedback Part 2

---

### Objective 4: Move from Ideation to Design

The research phase is substantially complete. The question is: what's the most effective bridge from where we are now (extensive research, clear principles, feature direction) to buildable specifications?

#### Recommended Path: Brainstorm → Design Specification → `/gsd:new-project`

**Why not jump straight to GSD?**
GSD's `/gsd:new-project` expects clear answers about what we're building and what "done" looks like. We have strong research and principles, but haven't yet reimagined the workflows from first principles — which is the core of our differentiation. Brainstorming first means GSD receives a well-defined product, not a feature list.

**Why not write a full SDD first?**
A Software Design Document before brainstorming would codify assumptions that haven't been challenged yet. The brainstorm sessions are specifically about questioning how things *should* work, not documenting how they *will* work. The SDD should be an output of brainstorming + GSD planning, not an input to it.

**The recommended sequence:**

1. **Brainstorm sessions** (Session 04) — Reimagine the 5 core workflows, UX approach, and document gathering methods using `/brainstorm`. Each session produces documented decisions that narrow the design space.

2. **Product Design Brief** — After brainstorming, consolidate outputs into a concise design brief that captures: reimagined workflows, UX principles and interaction model, architectural patterns chosen, and v1 scope boundaries. This is lighter than an SDD — it's the "what and why" without the "how".

3. **`/gsd:new-project`** — Feed the design brief into GSD's questioning phase. Skip GSD's built-in research phase (we already have extensive research). GSD produces PROJECT.md, requirements with REQ-IDs, and a phased roadmap.

4. **SDD emerges from GSD phases** — During `/gsd:plan-phase`, the technical "how" gets defined per phase. This is where the SDD-equivalent content naturally forms, informed by actual implementation planning rather than upfront speculation.

#### GSD Preparation (for when ready)

Based on the GSD workflow investigation (`.planning/research/gsd-workflow-investigation.md`):

1. **Core Value statement** — Suggestion: "SMBs can complete bid responses faster using AI, without needing AI expertise"
2. **v1 Scope Boundaries** — What is IN and what is explicitly OUT for the first milestone (defined during brainstorming)
3. **Research phase decision** — Skip GSD research; feed key findings into questioning phase so they get captured in PROJECT.md
4. **Clear answers to GSD's questioning phase:**
   - What are we building? (AI-powered bid management platform)
   - Why does it exist? (Bridge gap between frontier AI and non-technical SMBs)
   - Who is it for? (UK SMBs without dedicated IT/AI expertise)
   - What does "done" look like for v1? (Defined during brainstorming)

**GSD Lifecycle (for reference):**
```
/gsd:new-project     -> PROJECT.md, roadmap, requirements
/gsd:discuss-phase N -> Gather context for phase N
/gsd:plan-phase N    -> Create PLAN.md for phase N
/gsd:execute-phase N -> Execute plan with atomic commits
/gsd:verify-work N   -> Validate phase goal achievement
```

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
│   ├── competitors.md                          # Initial competitor list
│   ├── competitor-extracted-capabilities.md    # Capabilities by theme
│   ├── competitor-feature-inventory.md         # 8 feature areas
│   └── session-03-research-findings.md         # 4 research questions
├── third-party-product-evaluations/
│   ├── coolify-evaluation.md
│   ├── turso-evaluation.md
│   ├── logto-evaluation.md
│   └── stotles-research.md
├── claude-capabilities/                        # 10 files including Agent SDK
│   ├── claude-capabilities-agent-sdk-overview.md
│   ├── claude-capabilities-agent-sdk-python.md
│   ├── claude-capabilities-features-overview.md
│   ├── claude-capabilities-structured-outputs.md
│   ├── claude-capabilities-mcp-via-api.md
│   └── ... (+ 4 more)
├── turso/
│   ├── turso-database-introduction.md
│   ├── turso-agent-filesystem-overview.md
│   └── turso-agent-filesystem-sdk.md
├── langchain/                                  # 11 files
├── langchain-deep-agents/                      # 11 files
├── langchain-integrations/                     # 3 files
├── anthropic-zero-data-rentention-policy.md
├── gsd-workflow-investigation.md
├── ux-design-research.md
├── uk-tender-ecosystem.md
├── document-parsing-libraries.md
└── mcp-apps-overview.md
```

### User Feedback
```
.planning/deep-dive-user-review-and-feedback.md  # Parts 1 & 2 - product direction
```

### Market Research
```
.planning/market-research/
├── smb-research-report.md
├── combined-market-insights.md
└── legacy-mission-framework.md
```

### Raw Scrape Data
```
.firecrawl/competitor-deep-crawl/
├── altura/      (12 files)
├── brainial/    (13 files)
├── peak/        (10 files)
├── loopio/      (12 files)
├── qvidian/     (12 files)
└── responsive/  (15 files)
```

---

## Important Context: Our Approach (Consolidated from Part 1 & 2 Feedback)

These principles MUST inform all work:

1. **Building WITH AI, not adding AI.** Legacy SaaS systems bolt AI onto existing workflows. We reimagine from first principles. Our product doesn't have "core AI features" or "add-ons" - we focus on outcomes.

2. **Foundation models are the engine.** No proprietary GPT needed. A foundation model with the right skills, prompts, and tools can do what competitors do with custom models. Product improves when models improve - we just need correct evaluations for new model releases.

3. **Strip away complexity.** Understand the desired outcome, the "why" behind each feature, then find the simplest path. If everyone is looking left, we go right.

4. **UX is critical.** Non-technical SMB users. Effortless, not powerful. People don't like learning new systems. Speed is a feature. Progressive disclosure. Invisible AI where possible.

5. **Time-to-value is our differentiator.** Day-one experience: signup to first real work in under 4 hours. Not pricing, not features.

6. **Honesty and transparency.** Consumption-based pricing. Face-to-face with SMBs. We're helping businesses "write their own AI story" - if they use us, it's for convenience.

7. **Security by default.** SSO from day one. Tenant isolation. Encryption. Audit trails. Not gated to premium tiers.

8. **AI governance by default.** Citations on everything. "I don't know" over hallucination. No training on customer data. Full audit trail.

9. **Extensibility matters.** Bid management is the first use case. Architecture must support future use cases without redesign.

10. **Human augmentation, not replacement.** AI makes processes easier, doesn't replace people. Humans review, approve, and refine. Careful framing to avoid existential fear.

---

## Recommended Session 04 Approach

### Phase 1: Review Updated `initial-thoughts.md`
- Document was updated end of Session 03
- Quick review for any adjustments needed
- Confirm it provides a solid foundation for brainstorming

### Phase 2: Technology Stack Alignment (Quick review)
- Brief cross-check of Coolify + Turso + Logto against updated vision
- Identify any gaps (frontend framework, orchestration layer)
- Note adjustments needed in evaluations

### Phase 3: Brainstorming Sessions
- Use `/brainstorm` for each priority topic (see Objective 3)
- These may span multiple sessions depending on depth
- Each brainstorm produces documented decisions
- Priority order: workflow reimagining, UX approach, document gathering, feature reimagining

### Phase 4: Consolidate into Design Brief
- Capture brainstorm outputs into a product design brief
- Define v1 scope boundaries
- This becomes the input for `/gsd:new-project`

### Phase 5: `/gsd:new-project`
- Skip GSD research phase
- Feed design brief into questioning phase
- Produce PROJECT.md, requirements, and roadmap

---

## Open Questions for Session 04

1. How many brainstorming topics can we cover in one session? May need to prioritise or spread across sessions.
2. Frontend framework evaluation needed? (Not yet discussed — React/Next.js/Svelte/etc.)
3. Agent orchestration decision needed? (LangChain vs LangGraph vs Deep Agents vs Claude Agent SDK — referenced in evaluations but not decided.)
4. Peak's continuous learning method — user asked "What method are Peak using for this?" — needs investigation if not covered in existing research.
5. ~~Claude Agent SDK evaluation~~ — **Resolved:** Research added (`claude-capabilities-agent-sdk-overview.md`, `claude-capabilities-agent-sdk-python.md`). Decision on orchestration framework (LangChain vs LangGraph vs Deep Agents vs Claude Agent SDK) still needed.
