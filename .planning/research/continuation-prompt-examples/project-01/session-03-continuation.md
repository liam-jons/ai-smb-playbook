# Session 03 Continuation Prompt

**Project:** Bid Manager - AI-powered bid management platform for UK SMBs
**Previous Session:** Session 02 (Deep Crawl & Transformation)
**Date Created:** 2026-02-03

---

## Context Files to Read First

1. `.planning/initial-thoughts.md` - Product vision and architecture
2. `.planning/session-summaries/session-summary-02.md` - What was completed in Session 02
3. `.planning/deep-dive-user-review-and-feedback.md` - **Critical** - User feedback on how research should be used

---

## What Was Completed in Sessions 01-02

### Session 01: Research Setup
- Vision document created
- 6 competitor sitemaps generated (1,890 URLs)
- 74 high-priority URLs identified for deep crawl
- Technology evaluations (Turso, Coolify, document parsing)
- UK tender ecosystem research

### Session 02: Deep Crawl & Transformation
- All 74 URLs scraped via Firecrawl CLI
- Data transformation approach documented
- 6 competitor deep-dive summaries created (see Data Locations below)
- Verification report created

---

## Remaining Tasks (Research Phase)

### Task 1: Extract Valuable Sections from Deep-Dives

The user has reviewed each deep-dive and identified which sections contain the most useful content for our product. Extract these specific sections into a consolidated document, organised by theme (not by competitor). The goal is to understand *what bid management functionality exists* and *why*, not to create a competitive comparison.

**Sections to extract:**

| Competitor | Sections | Why These Matter |
|------------|----------|------------------|
| **Altura** | Product Capabilities, Security & Compliance | End-to-end bid lifecycle coverage; security architecture patterns |
| **Brainial** | Product Capabilities | Tender analysis workflow; explainable AI approach |
| **Responsive** | Product Capabilities | Broadest feature set; SMB tier design |
| **Loopio** | AI Differentiators vs Generic AI, Content Library Capabilities, AI Data Handling Policy | How to differentiate purpose-built AI from generic LLMs; content reuse patterns; data governance |
| **Qvidian** | Content Library | Content management and reuse patterns |
| **Peak** | Security & Compliance, Bid Writer Agent, Agentic Architecture Details, AI Data Handling Policy | Agentic architecture patterns relevant to our supervisor/sub-agent model; AI data handling |

**Output:** A consolidated reference document organised by functional theme (e.g., "How competitors handle document analysis", "Content library patterns", "AI data handling approaches", "Agentic architectures"). This becomes input material for brainstorming sessions.

### Task 2: Build Feature Functionality Inventory

For each of the "must-have" feature areas below, compile a combined list of *all* functionality across all 6 competitors. Don't compare them - just catalogue what exists. This inventory is the starting point for reimagining these features from first principles.

**Must-have feature areas (competitive parity):**

| Feature Area | What to Catalogue |
|--------------|-------------------|
| AI-Assisted Response Writing | All approaches to AI-generated bid responses across competitors |
| Content Library | All content storage, reuse, versioning, and freshness approaches |
| Collaboration Tools | All approaches to SME involvement, review workflows, team coordination |
| Project Management | All bid tracking, deadline, milestone, and task management approaches |
| Document Analysis | All approaches to parsing, analysing, and extracting from tender documents |

**Additional feature areas to catalogue (competitive advantage):**

| Feature Area | What to Catalogue |
|--------------|-------------------|
| Explainable AI / Citations | All approaches to source attribution and AI transparency |
| Bid/No-Bid Qualification | All go/no-go decision support approaches |
| Post-Bid Evaluation | All approaches to learning from bid outcomes |

**Output:** A feature inventory document listing concrete functionality per area. No opinions, rankings, or recommendations - just a factual inventory of what's out there.

### Task 3: Research Specific Questions

The user has raised questions that need investigation. Some require web research, others require reviewing existing deep-dive data.

**Questions to investigate:**

1. **One-day setup feasibility** - All competitors have 6-8 week onboarding. Given our architecture (supervisor + sub-agents that auto-gather company data and build a question library), what would a one-day setup actually look like? What are the real blockers? This is more of an architecture question than a research question - identify what the competitors' onboarding *actually involves* (from the deep-dives) and what we could eliminate.

2. **UK Tender Portal APIs** - What's actually available from the UK Find a Tender Service and Contracts Finder APIs? Can we do end-to-end from discovery to submission, or only discovery? What are the API limitations? (Requires web research.)

3. **MS Teams integration landscape** - How are competitors using Slack/Teams? What integration options does MS Teams provide (bots, connectors, tabs, messaging extensions)? Most UK SMBs won't have Slack, so Teams is the priority. What is it about Slack that users prefer, and can we replicate that in Teams?

4. **Why SSO is gated to higher tiers** - This is an industry-wide pattern, not just bid management. What's the actual reason? Is it cost, complexity, or artificial segmentation? Should we follow the same pattern or break it?

**Output:** Individual research notes per question, or a single research findings document.

### Task 4: Review Outputs and Determine Next Steps

Once Tasks 1-3 are complete:
- Review all outputs with the user
- Determine if a synthesis document is needed, or if individual outputs are sufficient
- Discuss which items should feed into `/brainstorm` sessions (the user wants two-way dialogue for reimagining features)
- Only once confirmed by the user, update `initial-thoughts.md` with any relevant additions
- Agree on readiness for `/gsd:new-project`

---

## Important Context: Our Approach

These points from the user's feedback must inform all work in this session:

1. **We're building WITH AI, not adding AI to a product.** Legacy SaaS systems bolt AI onto existing workflows. We reimagine workflows from first principles with AI at the core. Our product doesn't have "core AI features" or "add-ons" - we focus on outcomes.

2. **Foundation models are the engine.** We don't need a proprietary GPT. A foundation model with the right skills, prompts, and tools can do what these competitors do with custom models. Our product improves every time the foundation models improve.

3. **Strip away complexity.** Competitors over-engineer (70+ templates, custom GPTs, multi-product suites). We need to understand the *desired outcome* behind each feature, then find the simplest path to that outcome.

4. **UX is critical.** Non-technical SMB users don't want to learn new systems. The interface must feel effortless, not powerful.

5. **Time-to-value is our differentiator.** Not pricing, not features, not integrations - how quickly can a customer go from "I have a new tender" to "my bid is ready to submit"?

6. **Honesty and transparency in pricing.** Not self-service SaaS pricing - transparent consumption-based pricing. SMBs will meet us face-to-face. The value is in removing complexity, not in hiding costs.

7. **Extensibility matters.** Bid management is the first use case. The architecture must support future use cases without redesign.

---

## Data Locations

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

### Deep-Dive Summaries
```
.planning/research/competitor-analysis/
├── altura-deep-dive.md
├── brainial-deep-dive.md
├── peak-deep-dive.md
├── loopio-deep-dive.md
├── qvidian-deep-dive.md
├── responsive-deep-dive.md
└── VERIFICATION-REPORT.md
```

---

## Recommended Session 03 Approach

### Phase 1: Extract & Consolidate (Parallel)

Deploy subagents in parallel to extract the identified sections from the deep-dive documents. Each agent reads the relevant deep-dive files and extracts the specified sections. A consolidation agent then organises the extracted content by functional theme rather than by competitor.

**Output:** `.planning/research/extracted-capabilities.md` - a single reference document organised by theme.

### Phase 2: Feature Functionality Inventory (Parallel)

Deploy subagents to build the feature inventory. Each agent takes 2-3 feature areas from the must-have and advantage lists, reads across all 6 deep-dives, and catalogues every concrete piece of functionality for those areas. No analysis or opinion - just a factual inventory.

**Output:** `.planning/research/feature-inventory.md` - combined catalogue of all functionality per feature area.

### Phase 3: Targeted Research (Parallel)

Deploy subagents to investigate the 4 specific questions. These require different approaches:
- **Q1 (one-day setup)**: Analysis of deep-dive onboarding sections + architectural reasoning
- **Q2 (UK tender APIs)**: Web research on GOV.UK APIs (FTS, Contracts Finder)
- **Q3 (MS Teams)**: Web research on Teams integration options + deep-dive extraction of how competitors use Slack/Teams
- **Q4 (SSO gating)**: Web research on why SaaS companies gate SSO

**Output:** `.planning/research/session-03-research-findings.md` or individual files per question.

### Phase 4: Review & Next Steps (Sequential, with user)

Present outputs to the user. Discuss:
- What needs deeper brainstorming (likely feature reimagining)
- Whether `initial-thoughts.md` needs updates
- Readiness for `/gsd:new-project`

---

## Questions to Consider for Session 03

1. After research phase, should we do `/gsd:new-project` immediately or take a planning session first?
    1. Understand what happens when `/gsd:new-project` is invoked and what it generates as output, and therefore what it would be most helpful to have documented already (e.g., initial-thoughts.md vision, PRD, SDD first pass)
