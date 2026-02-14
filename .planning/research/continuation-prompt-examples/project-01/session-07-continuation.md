# Session 07 Continuation Prompt

**Project:** Bid Manager - AI-powered bid management platform for UK SMBs
**Previous Session:** Session 06 (Brainstorming — SME Routing + Auth Decision)
**Date Created:** 2026-02-04

---

## Context Files to Read First

1. `.planning/initial-thoughts.md` — Product vision, tech stack, principles
2. `.planning/session-summaries/session-summary-06.md` — What was completed in Session 06
3. `.planning/deep-dive-user-review-and-feedback.md` — User feedback Parts 1 & 2 (feature importance tiering, architectural decisions, security baseline, AI governance baseline, UX direction)
4. `.planning/brainstorms/01-universal-bid-workflow.md` — **Critical** — The reimagined universal bid workflow. Foundational brainstorm.
5. `.planning/brainstorms/02-sme-routing.md` — **Critical** — SME routing reimagined. Builds on Pattern 1. Contains edge cases and nuances from four-eyes review.

---

## What Was Completed in Sessions 01-06

### Sessions 01-04: Research & Technology Alignment (Complete)

All research and technology evaluation is complete. See `.planning/session-summaries/session-summary-04.md` for the full summary. Key outputs:

- 6 competitor deep-dives, extracted capabilities, and feature inventory
- Technology stack decided (Next.js, FastAPI, Turso, Coolify, Claude API + LangGraph)
- UX design patterns researched (51KB comprehensive document)
- UK tender ecosystem, SMB psychology, and document parsing all researched

### Session 05: Brainstorming — Universal Bid Workflow (Complete)

Reimagined the "Import → Parse → Analyse → Draft → Review → Submit" pipeline from first principles. See `.planning/brainstorms/01-universal-bid-workflow.md`.

**Core outcome:** The traditional six-step pipeline collapses into **Decide → Respond → Close**. Key concepts:

- **Bid Brief** (Decide) — shareable one-page document surfacing red flags, familiarity signals, and gaps
- **Working Session** (Respond) — AI and human work together question by question. Four AI confidence postures: Strong Match, Partial Match, Needs SME, No Content
- **Platform goes to people** — SMEs answer via email/Teams, never need to log in
- **Continuous review** — sanity check with Completion Summary replaces formal approval chains
- **Close** — lightweight outcome recording feeding future Familiarity Signals

### Session 06: Brainstorming — SME Routing + Auth Decision (Complete)

Reimagined how SMEs are engaged and their input captured. See `.planning/brainstorms/02-sme-routing.md`.

**Core outcome:** SME routing is a friction-reduction problem, not an intelligence problem. Key concepts:

- **Contacts stored once** — name, email, role. No re-entering per bid. Spectrum from no-account (tokenised links) to full account (consumption pricing)
- **Accumulate and batch** — questions queue during working session, grouped by SME at pause points
- **Two-tier experience** — light touch (1-5 questions, single page) and heavy involvement (6+, progressive Typeform-style workspace)
- **Email via Resend + React Email** — styled HTML, "Respond" button to tokenised page, no login required
- **No approval binary** — SMEs contribute, coordinator decides. Deliberate separation from approval workflows
- **Smart reminder** — one automated reminder timed to bid deadline, then coordinator manages
- **Edge cases captured** — race conditions, content library flow-back, tone harmonisation, cross-bid handling, auto-save, mobile, link forwarding, clarification requests, coordinator notifications

**Auth decision finalised:** SuperTokens chosen as primary auth provider (native Python/FastAPI middleware decisive). Logto retained as backup. See `.planning/research/third-party-product-evaluations/supertokens-evaluation.md`.

---

## Session 07 Objectives

### Primary Objective: Continue Brainstorming (Patterns 3-5)

Continue the Common Workflow Reimagining brainstorms. Use `/brainstorm` for each topic. These are two-way dialogue sessions.

#### Pattern 3: Content Freshness Management

How content in the library stays accurate, current, and trustworthy. The confidence postures from Pattern 1 depend on content quality — stale content degrades the working session experience. Pattern 2 established that SME-contributed content should flow back to the library, and that SME corrections during bids are signals of stale content.

**Questions to explore:**
- What makes content "stale"? Time-based? Event-based? Usage-based?
- How should freshness affect the AI's confidence posture?
- Who reviews content? How is the review burden distributed?
- How to handle content that's technically accurate but stylistically outdated?
- What's the balance between proactive maintenance and reactive updates?
- How does this connect to the "I don't know" principle — should the AI downgrade confidence for old content?

**Input material:**
- `.planning/brainstorms/01-universal-bid-workflow.md` — Four confidence postures
- `.planning/brainstorms/02-sme-routing.md` — SME content flow-back, SME corrections as staleness signals
- `.planning/research/competitor-analysis/competitor-extracted-capabilities.md` — Section 3 (Content Library & Knowledge Management), Content Health & Governance
- `.planning/research/competitor-analysis/competitor-feature-inventory.md` — Section 2 (Content Library)

#### Pattern 4: Win/Loss Feedback Loops

How bid outcomes feed back into content quality, AI confidence, and organisational learning. The Close phase from Pattern 1 captures the outcome — this brainstorm covers what happens with that data. Pattern 2 noted that SME corrections during bids are also feedback signals.

**Questions to explore:**
- What specifically feeds back? Win/loss status? Buyer scores? Comments?
- How does a win/loss affect content confidence? (Winning content gets boosted?)
- How do losses create actionable insights vs. just being recorded?
- What's the right cadence for learning? Per-bid? Quarterly review?
- How to handle the gap between submission and outcome (often months)?
- Peak's "continuous learning loop" — what's the practical, non-hype version for SMBs?

**Input material:**
- `.planning/brainstorms/01-universal-bid-workflow.md` — Close phase, Familiarity Signal
- `.planning/brainstorms/02-sme-routing.md` — SME corrections as staleness signals
- `.planning/research/competitor-analysis/competitor-extracted-capabilities.md` — Section 5 (Bid Lifecycle Management, Post-Bid Evaluation), Altura's Evaluation Module, Peak's Continuous Learning
- `.planning/research/competitor-analysis/competitor-feature-inventory.md` — Section 8 (Post-Bid Evaluation)

#### Pattern 5: Multi-Step Approval Workflows

How to handle situations where more formal approval is needed — regulated industries, larger SMBs, or high-value bids — without reverting to the rigid enterprise model. The sanity check from Pattern 1 is the baseline; this brainstorm explores when and how to extend it. Pattern 2 deliberately avoided approval mechanics for SMEs — this pattern addresses where genuine approval is needed.

**Questions to explore:**
- When does informal review genuinely not work? (Regulatory? High value? Multi-department?)
- How to add approval rigour without adding approval friction?
- Configurable vs. fixed approval patterns?
- How does this interact with the "Needs SME" posture — is SME sign-off an approval step?
- Audit trail requirements — what needs to be recorded for compliance?
- How to prevent approval workflows from becoming the bottleneck they are in enterprise tools?
- Pattern 2's link forwarding flexibility — does this need tightening for regulated contexts?

**Input material:**
- `.planning/brainstorms/01-universal-bid-workflow.md` — Sanity check section
- `.planning/brainstorms/02-sme-routing.md` — No approval binary principle, link forwarding design choice
- `.planning/research/competitor-analysis/competitor-extracted-capabilities.md` — Section 4 (Collaboration & Workflow)
- `.planning/research/competitor-analysis/competitor-feature-inventory.md` — Section 3 (Collaboration Tools)

### Secondary Objective: If Time Permits, Start Priority 2 or 3

If all three patterns are completed:

**Priority 2: Document Gathering Methods** — What methods are available for gathering past proposals, bid responses, and company documents? Both agentic and programmatic approaches. This directly feeds into the Decide phase.

**Priority 3: UX Approach & Interaction Model** — How users interact with the product. Patterns 1-5 have produced concepts (Bid Brief, confidence postures, Completion Summary, two-tier SME experience, progressive workspace) that need UX treatment.

---

## Important Context: Our Approach (Must Inform All Brainstorming)

1. **Building WITH AI, not adding AI.** Reimagine workflows from first principles.
2. **Foundation models are the engine.** Claude + Skills + programmatic parsing.
3. **Strip away complexity.** Understand the "why", find the simplest path.
4. **UX is critical.** Non-technical SMB users. Effortless, not powerful.
5. **Time-to-value is our differentiator.** Day-one experience under 4 hours.
6. **Honesty and transparency.** Consumption-based pricing. Face-to-face with SMBs.
7. **Security by default.** SSO from day one. Tenant isolation.
8. **AI governance by default.** Citations on everything. "I don't know" over hallucination.
9. **Extensibility matters.** Bid management is the first use case.
10. **Human augmentation, not replacement.** AI makes processes easier.

---

## Technology Stack (Decided)

| Component | Technology | Status |
|-----------|------------|--------|
| LLM Provider | Anthropic (Claude) | Decided |
| Database | Turso (DB-per-tenant) | Decided |
| Authentication | SuperTokens (Logto backup) | Decided |
| Deployment | Coolify (hybrid multi-tenant) | Decided |
| Frontend | Next.js (React) | Decided |
| Backend | Python / FastAPI | Decided |
| API Layer | Strawberry (GraphQL) | Decided |
| Orchestration | Direct Claude API + LangGraph persistence | Recommended |
| Vector Search | Turso native | Decided |
| Document Storage | Filesystem/S3 + Turso metadata | Decided |
| UI Integration | MCP Apps | Decided |
| Email | Resend + React Email | Decided |

---

## Data Locations

### Brainstorm Outputs
```
.planning/brainstorms/
├── 01-universal-bid-workflow.md          # Pattern 1 — COMPLETE
└── 02-sme-routing.md                     # Pattern 2 — COMPLETE
```

### Research Documents (All in `.planning/research/`)
```
.planning/research/
├── competitor-analysis/
│   ├── competitor-extracted-capabilities.md    # Capabilities by theme
│   ├── competitor-feature-inventory.md         # 8 feature areas
│   ├── session-03-research-findings.md         # Setup, APIs, Teams, SSO
│   └── [6 deep-dive files]
├── third-party-product-evaluations/
│   ├── coolify-evaluation.md
│   ├── turso-evaluation.md
│   ├── supertokens-evaluation.md              # NEW — primary auth evaluation
│   ├── authentication-evaluation.md           # SUPERSEDED — pointer to supertokens-evaluation.md
│   ├── frontend-framework-evaluation.md
│   ├── agent-orchestration-evaluation.md
│   └── stotles-research.md
├── ux-design-research.md                      # 51KB — AI-first UX patterns
├── claude-capabilities/                        # 10 files
├── turso/                                      # 3 files
├── langchain/                                  # 11 files
└── [other research files]
```

### User Feedback
```
.planning/deep-dive-user-review-and-feedback.md  # Parts 1 & 2
```

---

## Remaining Before `/gsd:new-project`

| Item | Type | Status |
|------|------|--------|
| Brainstorm: Universal bid workflow (Pattern 1) | Creative | **Complete** |
| Brainstorm: SME routing (Pattern 2) | Creative | **Complete** |
| Brainstorm: Content freshness management (Pattern 3) | Creative | Session 07 |
| Brainstorm: Win/loss feedback loops (Pattern 4) | Creative | Session 07 |
| Brainstorm: Multi-step approval workflows (Pattern 5) | Creative | Session 07 |
| Brainstorm: Document gathering methods (Priority 2) | Creative | Session 07+ |
| Brainstorm: UX approach and interaction model (Priority 3) | Creative | Session 07+ |
| Brainstorm: Feature reimagining (Priority 4, 7 areas) | Creative | Future sessions |
| Consolidate brainstorm outputs into design brief | Consolidation | After brainstorming |
| Invoke `/gsd:new-project` | Milestone | After design brief |

---

## Recommended Session 07 Approach

1. **Start with Pattern 3 (Content Freshness Management)** — the confidence postures from Pattern 1 depend on content being trustworthy. Pattern 2 established that SME corrections signal stale content. This brainstorm defines what "trustworthy" means and how freshness is maintained.

2. **Then Pattern 4 (Win/Loss Feedback Loops)** — closes the loop from the Close phase. Connected to Pattern 3 through content quality signals.

3. **Then Pattern 5 (Multi-Step Approval Workflows)** — extends the sanity check model for edge cases. Connected to Pattern 2 through the deliberate separation of contribution from approval.

4. **If time permits, start Priority 2 (Document Gathering)** — critical dependency for the Decide phase.

Each brainstorm should follow the same structure as Patterns 1 and 2: establish current reality, challenge assumptions, propose reimagined approach, validate through dialogue, document decisions. Apply four-eyes review before finalising each document.
