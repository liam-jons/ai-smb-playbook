# Market Research Insights

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

### Overview

**combined-market-insights.md** -- This file is primarily a sales and marketing strategy document for "AI Solution Hub" as a consultancy. It contains landing page wireframe ideas, CTA copy, pricing anchoring tactics, and sales funnel design. Very little of this is relevant to the playbook application, which is an educational tool for an existing client, not a lead-generation site. The SMB psychology insights in Part 2 (loss aversion, availability heuristic, status quo bias, trust equation) are genuinely useful for understanding audience mindset, but they are buried inside 8 parts of sales strategy. The useful content represents roughly 20% of the file.

**smb-context.md** -- This is the strongest file in the collection. The UK-specific data (IT constraints, data sensitivity classification framework, budget realities with UK tool pricing, UK GDPR requirements, shadow AI statistics, productivity case) directly informs playbook content. Several of these insights already appear in the app's content sections. This file remains a useful reference for anyone extending the playbook or onboarding a new client.

**smb-research-report.md** -- A dense academic-style report that overlaps heavily with `combined-market-insights.md` on psychology (the same 2.5x loss aversion stat, same peer adoption thresholds). Parts 4-6 cover health tech kiosk opportunities, proposal visual design principles, and OneFlow template optimisation -- none of which are relevant to the playbook app. The report appears to cut off mid-sentence at line 182.

**task-patterns.md** -- Highly actionable. The 15 task patterns (meeting minutes, document summarisation, email drafting, compliance docs, data extraction, etc.) with suitability ratings, prompts, and pitfall tables are directly relevant to the playbook's general track content. This material is the kind of thing that could power a "Common AI Tasks" section or be referenced in the starter kit. It is well-structured and UK-specific.

---

## 2. Key Insights from Market Research Files

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

