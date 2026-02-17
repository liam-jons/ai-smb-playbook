# Market Research Assessment

**Date:** 17 February 2026
**Assessed by:** Claude (automated review)
**Scope:** `.planning/research/market-research/` (4 files) and `.planning/research/practical-ai-implementation-articles/` (13 files)

---

## 1. Market Research Files (`.planning/research/market-research/`)

### Files reviewed

| File | Size | Purpose |
|------|------|---------|
| `combined-market-insights.md` | ~400 lines | AI consulting business strategy: landing page copy, pricing psychology, content strategy, competitive positioning for "AI Solution Hub" |
| `smb-context.md` | ~210 lines | UK-specific SMB constraints, data sensitivity classification, budget realities, UK GDPR compliance, shadow AI risks |
| `smb-research-report.md` | ~185 lines | Academic-style report on SMB AI adoption psychology, tiered pricing, health tech opportunities, proposal design, OneFlow integration |
| `task-patterns.md` | ~790 lines | 15 practical AI task templates for UK SMBs (meeting minutes, email drafting, compliance docs, contract review, etc.) |

### Assessment

**combined-market-insights.md** -- This file is primarily a sales and marketing strategy document for "AI Solution Hub" as a consultancy. It contains landing page wireframe ideas, CTA copy, pricing anchoring tactics, and sales funnel design. Very little of this is relevant to the playbook application, which is an educational tool for an existing client, not a lead-generation site. The SMB psychology insights in Part 2 (loss aversion, availability heuristic, status quo bias, trust equation) are genuinely useful for understanding audience mindset, but they are buried inside 8 parts of sales strategy. The useful content represents roughly 20% of the file.

**smb-context.md** -- This is the strongest file in the collection. The UK-specific data (IT constraints, data sensitivity classification framework, budget realities with UK tool pricing, UK GDPR requirements, shadow AI statistics, productivity case) directly informs playbook content. Several of these insights already appear in the app's content sections. This file remains a useful reference for anyone extending the playbook or onboarding a new client.

**smb-research-report.md** -- A dense academic-style report that overlaps heavily with `combined-market-insights.md` on psychology (the same 2.5x loss aversion stat, same peer adoption thresholds). Parts 4-6 cover health tech kiosk opportunities, proposal visual design principles, and OneFlow template optimisation -- none of which are relevant to the playbook app. The report appears to cut off mid-sentence at line 182.

**task-patterns.md** -- Highly actionable. The 15 task patterns (meeting minutes, document summarisation, email drafting, compliance docs, data extraction, etc.) with suitability ratings, prompts, and pitfall tables are directly relevant to the playbook's general track content. This material is the kind of thing that could power a "Common AI Tasks" section or be referenced in the starter kit. It is well-structured and UK-specific.

### Verdict on market research folder

The four files serve different purposes and vary significantly in ongoing value:

| File | Ongoing value | Why |
|------|--------------|-----|
| `smb-context.md` | **High** | UK-specific constraints, compliance, budgets -- directly relevant to playbook content and new client onboarding |
| `task-patterns.md` | **High** | Ready-to-use task templates that could inform app content or be included in the starter kit |
| `combined-market-insights.md` | **Low-Medium** | 80% is sales/marketing strategy for a consultancy website; 20% (SMB psychology) is useful but already extracted |
| `smb-research-report.md` | **Low** | Overlaps with combined-market-insights, includes irrelevant sections (health kiosks, OneFlow), truncated |

---

## 2. Practical AI Implementation Articles (`.planning/research/practical-ai-implementation-articles/`)

### Files reviewed

13 articles from what appears to be a newsletter by an applied AI consultant. Topics include:

| Article | Title | Core idea |
|---------|-------|-----------|
| 01 | Why AI Roadmaps Beat AI Projects | Map total AI opportunity before building; use $10K threshold filter |
| 02 | 3 Lessons from AI That Worked but Was Never Used | Define "good enough", validate pain is real, integrate into existing workflow |
| 03 | 5 Reasons Enterprise AI Fails | Measure impact not deployments, set thresholds, kill zombie projects |
| 04 | AI First vs. First AI | Ship one real AI solution before planning a transformation |
| 05 | 2025 Retrospective | Templates beat blank canvas; production beats roadmaps; measurability is hard |
| 06 | The Cost Cap Model | Two-number framework: value threshold and cost cap |
| 07 | AI Workflows vs. AI Agents | Architecture selection for AI systems |
| 08 | The Profitable AI Organization | Three operating models for scaling AI beyond prototypes |
| 09 | From Ugly Data to Profitable Insights | Using AI on messy data rather than waiting for clean data |
| 10 | The AI Prototype-to-Production Checklist | 7-point checklist for production readiness |
| 11 | 5 AI Modes for Business | Framework for explaining AI capabilities to non-technical audiences |
| 12 | AI-Powered Process Mining | Using AI on ERP/process data |
| 13 | How We Cleaned 50,000+ Records with AI | Case study: data cleanup as a $10K AI win |

### Assessment

These articles are well-written, practical, and grounded in real implementation experience. The recurring frameworks ($10K threshold, "First AI" vs "AI First", cost cap model, 80% fallacy) form a coherent methodology that aligns well with the playbook's educational mission.

**Relevance to the application:** Medium. The articles validate the playbook's approach of starting small and measuring outcomes. Specific frameworks (the $10K threshold, the production readiness checklist, the cost cap model) could inform the "Measuring AI ROI" section (1.8) that already exists in the app. However, the articles are written for a US-dollar, newsletter audience and would need adaptation for the UK context.

**Relevance to client onboarding:** Medium-High. Someone preparing a new client deployment would benefit from reading articles 01, 02, 04, and 10 to understand common failure patterns and how to set realistic expectations.

**Current form:** Each article is a standalone newsletter post with promotional CTAs (workshop invitations, book plugs, community links) woven throughout. The signal-to-noise ratio is roughly 70% actionable content, 30% marketing. The formatting is inconsistent (some use markdown headers, others are stream-of-consciousness).

---

## 3. Current Visibility

Both folders are buried at `.planning/research/market-research/` and `.planning/research/practical-ai-implementation-articles/` -- three levels deep under a hidden directory. This depth is appropriate for what they are: source research consumed during the initial build phases (0-2), not active reference material.

The `.planning/` directory already contains 15+ files across multiple subdirectories. Adding more visibility mechanisms (READMEs, indexes) within `.planning/` would add clutter without real benefit, since the directory is for build-time artefacts, not runtime reference.

The real question is whether any of this research should be surfaced elsewhere. The answer depends on the audience:

- **For developers extending the app:** The existing CLAUDE.md and section specs provide sufficient context. The research files add background but are not required.
- **For someone onboarding a new client:** `smb-context.md` and `task-patterns.md` would be genuinely useful. These two files are the only ones worth surfacing.
- **For day-to-day app maintenance:** None of this research is needed.

---

## 4. Recommendation

**(b) Create a condensed summary here in `.planning/reference/` that surfaces key insights. Keep originals where they are.**

Specifically:

### Market research files

1. **Keep `smb-context.md` and `task-patterns.md` where they are.** They are the highest-value files and already well-structured. If a new client deployment is needed, these are the two files to read. No reformatting needed.

2. **Do not move or promote `combined-market-insights.md` or `smb-research-report.md`.** The useful insights from these files (SMB psychology, trust equation, peer adoption thresholds) are already incorporated into the playbook content. The sales/marketing strategy portions are not relevant to the playbook's purpose. Leaving them buried is the correct outcome -- they served their purpose during the research phase.

3. **A condensed summary is not needed for the market research.** The two high-value files (`smb-context.md` and `task-patterns.md`) are already in a usable format. Summarising them would lose detail without gaining clarity. The two low-value files do not warrant the effort of extraction.

### Articles folder

1. **Keep the articles folder where it is.** The articles are reference material that informed the playbook's approach during the build phase. They are not needed for ongoing maintenance.

2. **A condensed extract would be useful for client onboarding contexts.** The key frameworks across all 13 articles can be distilled into a short reference. See the extract below.

---

## 5. Key Insights Worth Preserving

### From the market research (for new client deployments)

These insights from the research are most relevant when preparing to deploy the playbook for a new SMB client:

- **SMBs exhibit 2.5x stronger loss aversion** for AI investments vs traditional tech. Frame AI as "protecting market position" not "gaining advantage."
- **The peer adoption threshold** for AI is 3-5 businesses in the same industry/size. This is higher than for CRM (1-2) or cloud (2-3). Provide peer references.
- **67% of SMBs have a single decision-maker.** Tailor content to that person, not a committee.
- **71% of UK employees use unapproved AI tools at work.** Shadow AI is the norm. Enable rather than prohibit.
- **UK SMB AI adoption: 35%** (vs 55% US). The gap represents both a challenge (less peer proof) and an opportunity (early mover advantage).
- **8.2 touchpoints over 90 days** is the average decision journey for SMB AI adoption. Education-first approaches achieve 65% higher engagement.
- **The data sensitivity classification framework** (4 levels from public to highly confidential) in `smb-context.md` is directly reusable for any UK SMB client.

### From the articles (implementation philosophy)

The articles consistently advocate a methodology that aligns with the playbook's educational approach:

- **"First AI" beats "AI First."** Ship one working AI solution before attempting a transformation strategy. Planning without shipping is "transformation theatre."
- **The $10K threshold.** Before pursuing any AI use case, verify that the problem costs at least $10K/year (or equivalent hours). This filter eliminates most "nice-to-have" ideas.
- **Define "good enough" before building.** The 80% fallacy: chasing 100% accuracy delivers 0% value. Accept 80% with a human fallback.
- **Integrate into existing workflows.** AI solutions that require new apps, new logins, or new habits fail. Slot into what people already use.
- **The cost cap model.** Two numbers: minimum value threshold and maximum running cost. If the solution stays between them, it is profitable.
- **Measure impact, not deployments.** "Models built" and "pilots completed" are vanity metrics. Track hours saved, error rates reduced, revenue protected.
- **Messy data is an opportunity, not a blocker.** "Clean data first, AI second" is a common excuse for inaction. AI can be the tool that cleans the data.

---

## 6. Summary

| Folder | Keep? | Location change? | Summary needed? |
|--------|-------|-------------------|-----------------|
| `market-research/` | Yes | No -- depth is appropriate | No -- the two valuable files are already well-structured |
| `practical-ai-implementation-articles/` | Yes | No -- depth is appropriate | No -- this assessment (section 5 above) captures the key frameworks |

The current location is fine. The research served its purpose during the build phases and continues to hold value as background reference. The most useful files (`smb-context.md`, `task-patterns.md`) are already in good shape. The key insights from both folders are now captured in section 5 of this document, which can serve as the condensed reference for anyone who needs a quick orientation without reading 17 source files.
