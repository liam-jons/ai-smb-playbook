# AI ROI Article Synthesis

## Introduction

This document synthesises findings from 13 articles on practical AI implementation and ROI measurement, written by applied AI consultants working primarily with small and medium-sized businesses and mid-market organisations. The source material comes from `.planning/research/practical-ai-implementation-articles/` (articles 01 through 13), covering topics including ROI estimation, adoption failures, cost control, architecture selection, organisational models, data quality, and process optimisation.

The synthesis is organised to serve as a persistent reference for building ROI-related content within the AI SMB Playbook. All insights have been framed for relevance to UK-based SMBs, even where original examples used US dollar figures or enterprise-scale contexts.

---

## 1. ROI Calculation Frameworks and Formulas

### The $10K Threshold Rule (Articles 1, 2, 3, 4, 5)

The most consistently referenced framework across the articles is the **$10K Threshold** (approximately **GBP 8,000/month** at current rates). This is a minimum recurring value filter applied before any AI project begins:

- **Definition:** The minimum recurring payoff that justifies action. Every AI use case must clear this threshold to be worth pursuing.
- **Formula (simplified):** `Number of problems clearing threshold x threshold value = AI opportunity floor`
  - Example: 8 problems passing the filter at GBP 8K/month = **GBP 64K/month = ~GBP 770K/year** minimum opportunity.
- **Calculation method:** Identify pain points, estimate the cost in person-hours or direct spend, and apply the threshold filter. If freeing up time, the key test is: *"If you free up those hours, where do they go?"* Only count the value if the freed capacity translates into billable work, revenue, or measurable cost reduction.
- **Concrete example (Article 1):** 5-6 senior consultants spending one day per month on content reviews = ~6 person-days at GBP 1,600/day = **GBP 9,600/month** in billable capacity not billing. Above the threshold.

### The Cost Cap Model (Article 6)

A two-number framework for ongoing AI profitability:

1. **Value Threshold** -- the minimum value the AI use case must deliver per period (e.g., GBP 8K/quarter)
2. **AI Cost Cap** -- the maximum running cost allowed in that same period (e.g., GBP 4K/quarter)

**The Rule:**
```
Delivered Value > Value Threshold  AND  Actual Costs < Cost Cap
```

The area between the Cost Cap and the Value Threshold is the **"profit zone"** or **"economic corridor"**. The project stays alive only while it remains inside this corridor.

**Worked example (Article 6):**
- AI document extraction tool saves ~15 hours/week across the team
- Blended cost of GBP 40/hour = GBP 600/week = ~GBP 8K/quarter (Value Threshold)
- Cost Cap set at GBP 4K/quarter (inference, hosting, licences, buffer)
- Quarterly check: Are we still saving at least GBP 8K? Are costs still under GBP 4K?

**Important distinction:** One-time development costs sit *outside* the Cost Cap model. The model governs **ongoing, running costs** only. Development costs are managed separately through phased investment (see Section 8).

### The 3-Layer S-O-T KPI Framework (Article 8)

A measurement framework that connects technical performance to business outcomes to financial impact:

| Layer | Focus | Example Metrics |
|-------|-------|-----------------|
| **Layer 1: Technical** | System health | Uptime (99.5%), latency, error rates, infrastructure costs |
| **Layer 2: Operational** | Usage and model performance | Daily active users, model accuracy (RMSE/MAPE), adoption rates, user feedback |
| **Layer 3: Strategic** | Value and economics | Cost reduction, revenue lift, ROI calculation (value minus system costs), secondary benefits |

**Critical insight:** All three layers must connect. High system reliability (Layer 1) with poor adoption (Layer 2) indicates a product problem. High adoption (Layer 2) with no ROI materialising (Layer 3) means you are measuring the wrong business outcomes.

### Two-Track Measurement: Productivity AI vs. Engineered AI (Article 5)

The articles draw a sharp distinction between two categories of AI that require different measurement approaches:

| | Productivity AI | Engineered AI |
|---|---|---|
| **Examples** | ChatGPT, Copilot, general assistants | Custom workflows, integrated solutions |
| **Measurability** | Difficult -- people "feel" it is valuable but proving GBP 8K savings is nearly impossible | Direct -- throughput, time saved, error rates, ROI is tangible |
| **Approach** | Measure adoption and satisfaction; accept qualitative evidence | Apply Cost Cap model and quantitative KPIs |

**Key quote (Article 5):** *"You can't measure them with the same ruler."*

---

## 2. SMB-Specific Measurement Approaches

### Start with Pain, Not Technology (Articles 1, 2, 3, 4)

For SMBs with limited budgets and no dedicated AI teams, the articles consistently recommend:

- **Talk to the people doing the work**, not just managers. *"The manager says 'it's fine.' The person doing it says 'I spend two days a week on this.'"* (Article 1)
- **Apply a threshold filter scaled to your business.** The GBP 8K/month figure is a starting point; for a smaller SMB, GBP 2K-4K/month might be the right minimum threshold. The principle -- not the specific number -- is what matters.
- **Map total opportunity before building anything.** Even a 5-person business can identify 3-4 pain points that clear a reasonable threshold, creating a portfolio of opportunities rather than betting on a single project.

### The "First AI" Approach (Articles 4, 5)

Rather than attempting comprehensive AI transformation ("AI First"), SMBs should pursue **"First AI"** -- shipping one relevant, engineered AI solution that works profitably:

- **Short Plan-Build-Learn-Refine loops** that each cross a minimum value threshold
- **Each loop compounds** into the next, building capability and credibility
- **No grand roadmaps required** -- just enough structure to identify the first opportunity and execute

**SMB-specific advantages of First AI:**
- Lower upfront investment (prototype, not transformation)
- Faster time to demonstrable value
- Builds internal AI literacy through doing, not planning
- Each win funds and justifies the next

### Practical Cost Considerations for SMBs

- **AI tool costs can be minimal.** Article 9 documents a data analysis project costing **under GBP 160 in AI tool costs** that replaced GBP 40K+ in traditional analyst work.
- **Article 13** describes a data cleaning project completed in **6.5 hours** that would have taken a month manually, saving approximately **GBP 8K** in external labour costs.
- **Development costs should be phased.** A GBP 80K/year opportunity does not start as a GBP 80K project. It starts as a GBP 8K prototype. Each stage pays for the next (Article 1).

---

## 3. Common Pitfalls in ROI Measurement

### Pitfall 1: Measuring Deployments, Not Impact (Article 3)

Tracking "models built", "tools launched", or "pilots completed" instead of business metrics. Before starting any AI project, define the business metric it should move: *"Reduce average response time from 4 hours to 1 hour"* or *"Pre-fill 60% of all data field entries automatically."*

**Test:** *If you cannot state the outcome in one sentence, you are not ready to build.*

### Pitfall 2: Discovery Without Thresholds (Articles 1, 3)

Collecting AI ideas without ever asking what the minimum return would need to be. This creates backlogs of 50+ use cases that nobody can prioritise. Set the threshold before ideation begins. *"You'd be amazed how many 'exciting AI opportunities' die when you apply that filter."*

### Pitfall 3: No Kill Switch (Article 3)

Projects without clear criteria for when to stop become "zombie projects". Design **Impact Thresholds and Cost Caps from day one**. If the value cannot be achieved or the cost cap is exceeded, reassess. *"No hard feelings when they leave."*

### Pitfall 4: Mixing Up Learning and Earning (Articles 3, 10)

Confusing discovery (learning) with delivery (earning). This leads to two failure modes:
- Killing promising projects too early because they have not "paid off"
- Keeping zombie projects alive due to sunk-cost bias

**Fix:** Be explicit about which phase you are in. Discovery has different metrics and expectations from delivery.

### Pitfall 5: Chasing 100% Accuracy (Article 2)

The **"80% Fallacy"** -- demanding perfection from AI before shipping. Every review surfacing another edge case, with goalposts never defined. The result: the solution is never "done" and never ships.

**Fix:** Define "good enough" before writing a single line of code. Accept 80% accuracy with a human fallback. *"Too often, when you want 100% you get 0%."*

### Pitfall 6: Building in Isolation from Workflow (Article 2)

Building AI prototypes that live in demo environments with no clear path into actual day-to-day workflows. Users cannot evaluate something they cannot imagine using.

**Fix:** Understand workflow integration before building anything. The best AI solutions slot into existing workflows; they do not create new ones.

### Pitfall 7: Spreadsheet Theatre (Article 6)

Over-engineering financial projections with 3-year forecasts and six-tab spreadsheets full of assumptions nobody believes. This kills projects through analysis paralysis.

**Fix:** Replace complex financial modelling with the two-number Cost Cap model.

### Pitfall 8: Falling in Love with Technology (Article 3)

Starting from "What can AI do?" rather than "Where are we losing money/time/quality?" Technology-led projects (e.g., building a company-wide "second brain") typically create more problems than they solve.

---

## 4. Case Studies with Concrete Numbers

### Data Cleaning: 50,000 Records (Article 13)
- **Context:** Mid-sized organisation (~500+ employees), professional events industry
- **Problem:** 50,000+ records with inconsistent company names (e.g., 14+ variations of "Siemens")
- **Traditional estimate:** 1 month of manual work, ~GBP 8K in labour costs
- **AI approach:** 3-stage pipeline (external reference matching, similarity detection, AI harmonisation using o3-mini)
- **Result:** Completed in **6.5 hours**. Saved ~GBP 8K. Discovered previously invisible patterns in attendee data.

### Employee Survey Analysis (Article 9)
- **Context:** Large corporation, thousands of open-text survey responses
- **Traditional estimate:** 20+ person-days, GBP 40K+ in analyst costs, 4-6 weeks
- **AI approach:** 5-step Ugly Data Process (define questions, tidy data, explore, AI-powered analysis, validation)
- **Result:** Completed in **2 days** for **under GBP 160** in AI tool costs. Caught critical validation issues that manual analysis often misses.

### Call Centre Compounding Loops (Article 4)
- **Context:** Small call centre company
- **Loop 1:** AI search tool helping human agents find answers faster
- **Loop 2:** AI listens to calls live; transcripts used for post-call evaluations
- **Loop 3:** AI suggests answers to agents in real-time
- **Loop 4:** AI gives answers directly via chatbot
- **Outcome:** Each loop crossed a new value threshold. Company realised they preferred human agents augmented by AI rather than full replacement.

### Chatbot to Operations Engine (Article 1)
- **Investment:** GBP 6.4K chatbot (initial)
- **Result:** Grew into a **GBP 80K/year operations engine** through 3 stages
- **Pattern:** Phased investment where each stage paid for the next

### Enterprise Client: 15+ Chatbots (Article 5)
- **Context:** Events industry enterprise
- **Deployed:** 5 initial chatbots, then committed to 15+
- **Result:** Saved **thousands of hours** in first-level support (identified as a major bottleneck)

### Solo Founder Insourcing (Article 5)
- **Context:** Solo founder paying contractors for work AI could handle
- **Result:** Built AI workflows, insourced the work, saved **GBP 16K+/year**

### Healthcare Startup (Article 5)
- **Context:** Young healthcare startup
- **Result:** One AI workflow **replaced what would have been a full-time hire** for data collection

### Process Mining: Order-to-Cash (Article 12)
- **Context:** SAP environment, Order-to-Cash process
- **Findings:** 7-9 handoffs per sales order (documented process said 4), 65-day average cycle time
- **Result:** 30% process waste identified in a 5-day sprint, generating **GBP 160K+ in annual productivity savings**

### Process Mining: Industry Case Studies (Article 12)
- **Sysmex (healthcare):** Found GBP 2.7M in overdue payments, increased cash flow by GBP 8M, dropped late payment rate by 17 percentage points
- **Saint-Gobain (manufacturing):** Cut up to 2 weeks from each of 120 internal audit cycles, freed 4.5 years of work time
- **ALDI SUD (retail):** Analysed 400+ business processes, generated EUR 3.1M from process optimisation
- **Kraft Heinz:** Reduced overdue payments by 30% through Accounts Receivable process mining

### AI Roadmap Opportunity (Article 5)
- **Context:** Mid-sized organisation
- **Approach:** Systematic AI opportunity landscape mapping using GBP 8K threshold
- **Result:** Roadmap valued at **GBP 800K+ in efficiency gains**, now being implemented

---

## 5. UK/SMB-Relevant Framing

While the source articles predominantly use US dollar figures and occasionally reference enterprise contexts, the following insights translate directly to UK-based SMBs:

### Currency and Scale Adjustments

| Article Reference | US Figure | UK SMB Equivalent |
|---|---|---|
| $10K/month threshold | ~GBP 8K/month | For smaller SMBs (5-20 staff), consider GBP 2K-4K/month as starting threshold |
| $50/hour blended rate | ~GBP 40/hour | Reasonable for UK professional services |
| $20K prototype | ~GBP 16K | Still applicable; phased to GBP 4K-8K first steps |
| $200 AI tool costs | ~GBP 160 | Direct tools like Claude Pro/ChatGPT Plus subscriptions are comparable |

### UK-Specific Considerations

- **Regulatory environment:** UK SMBs must consider UK GDPR and ICO requirements when implementing AI that processes personal data (particularly relevant for Articles 9, 12, and 13 which involve customer/employee data analysis). This adds compliance checking to any ROI calculation.
- **Labour costs:** UK average professional hourly rates are typically lower than US equivalents, which means the threshold figures should be adjusted downward. However, the *principle* of threshold-based evaluation remains identical.
- **Scale advantage for SMBs:** Several articles note that AI ROI can be proportionally *larger* for smaller organisations because inefficiencies represent a higher percentage of revenue. A 15-person agency losing 6 person-days/month to manual reviews is losing a larger proportion of capacity than a 1,000-person firm.
- **Claude Teams pricing:** For UK SMBs already on Claude Teams (like Phew Design), the marginal cost of implementing "Productivity AI" approaches is near zero -- the subscription is already paid. The ROI question becomes purely about time saved and adoption.
- **Process mining accessibility:** Article 12 notes that even free tools (ChatGPT for transactional data analysis) can deliver initial process mining insights. UK SMBs do not need enterprise Celonis licences to start.

---

## 6. Key Frameworks and Models

### The AI Opportunity Map (Article 1)
A four-step method for identifying total AI opportunity:
1. **Define your threshold** -- minimum recurring payoff that justifies action
2. **Ignore AI, focus on problems** -- identify pain points from actual workers
3. **Apply the threshold filter** -- is this problem bigger than the threshold?
4. **Count what survives** -- the total is your AI opportunity floor

### The Cost Cap Model (Article 6)
Two numbers defining an economic corridor:
- **Value Threshold:** minimum value delivered per period
- **Cost Cap:** maximum running cost per period
- Project stays alive only while operating within the corridor

### The 5 AI Modes for Business (Article 11)
A framework for mapping business problems to AI capabilities:
1. **Prediction Mode** -- forecasting, scoring, classification
2. **Perception Mode** -- reading documents, analysing images, processing audio
3. **Creation Mode** -- generating text, images, code
4. **Thinking Mode** -- reasoning, summarising, connecting insights
5. **Agentic Mode** -- taking action, executing tasks autonomously

**SMB application:** When someone says "our customer support is too expensive", map it: Prediction classifies tickets, Thinking searches knowledge bases, Creation drafts responses, Agentic sends them automatically.

### AI Architecture Selection (Article 7)
Five levels of increasing complexity:
1. **Workflow Automation (No AI)** -- simple predefined steps, cheapest
2. **Automated AI Workflow** -- predefined steps with AI in one or more steps
3. **AI Agent** -- autonomous decision-making toward a goal
4. **Agentic Workflow** -- agent embedded within a controlled workflow
5. **Multi-Agent Systems** -- multiple agents collaborating

**Rule of thumb:** Choose the simplest approach that delivers the outcome. Most real business applications today use Level 2 (Automated AI Workflow).

### The 7-Point Production Checklist (Article 10)
Signals that an AI prototype is ready to scale:
1. Value clearly validated
2. Real user feedback (not polite nods)
3. Technical feasibility proven
4. Demand is growing (pull, not push)
5. Leadership support secured (real commitment, not checkbox)
6. Ethics and compliance checked
7. Integration path understood

### The 3-Layer S-O-T KPI Framework (Article 8)
Technical KPIs -> Operational KPIs -> Strategic KPIs (see Section 1 for details).

### The 5-Step Ugly Data Process (Article 9)
1. Know what you are looking for
2. Get data into the right shape (tidy, not perfect)
3. Data exploration (AI-generated visualisations and pattern checks)
4. AI-powered analysis (directed by specific business questions)
5. Validation (manual checks on any insight that could drive decisions)

### The Digital/AI Factory Operating Model (Article 8)
For organisations scaling beyond their first AI solution:
- Central **hub** provides expertise and standards
- **Line managers** hold responsibility and budget
- Initial hub funding from central budget; business units take over once pilot passes stage gate
- *"Money follows results"* -- prevents pilot graveyards

---

## 7. Adoption and Change Management Insights

### Why Technically Successful AI Fails (Article 2)

Three lessons from a GBP 16K prototype that worked but was never used:

1. **The 80% Fallacy:** Demanding perfection prevented shipping. Fix: define "good enough" acceptance criteria before building. *"AI doesn't need to be perfect. It needs to be good enough that the cost of handling exceptions is lower than the cost of doing everything manually."*

2. **The pain was not painful enough:** The problem sounded annoying but was not actually expensive. Without a concrete financial impact number, AI projects become "nice-to-haves" that do not survive budget meetings.

3. **Castle in the sky:** The prototype lived in a demo environment disconnected from actual workflows. Users could not picture how it would fit their work. Fix: build into existing workflows. An Outlook plugin would have been 10x more effective than a standalone application.

### Production Creates Momentum; Roadmaps Create Paralysis (Article 5)

*"A business with a messy strategy but one profitable AI workflow beats a business with a crystal-clear roadmap but nothing in production. Every time."* Successful production builds credibility, capability, and internal demand for more.

### People Want Templates, Not Options (Article 5)

Even when problems are unique, people prefer starting with a template and adapting it rather than facing a blank canvas. **Structure beats freedom**, especially at the beginning. This directly supports the Playbook's approach of providing starter kits and structured prompts.

### Workflow Integration Is Non-Negotiable (Articles 2, 10)

The best AI solutions do not create new workflows; they seamlessly slot into existing ones. The red flag from Article 10: *"Your integration plan starts with 'Users will just need to adapt their workflow a bit.'"* For SMBs, this means building AI into the tools staff already use (email, spreadsheets, CRMs) rather than introducing new standalone applications.

### Real User Feedback vs. Polite Interest (Article 10)

- **Real feedback:** "Can I get more access to this?"
- **Fake feedback:** "That's really interesting, we should definitely explore this further."
- **Pull vs. push:** If you are still having to convince people to try it, or usage stays flat, the solution has an adoption problem regardless of its technical quality.

---

## 8. Implementation Patterns

### Patterns That Succeed

**Phased investment with compounding loops (Articles 1, 4, 5):**
- Start with the most *feasible* opportunity, not the highest-impact one (because every opportunity on the map already clears the threshold)
- The first win builds credibility and budget for everything after
- Each stage pays for the next: GBP 8K prototype -> GBP 16K production -> GBP 32K expansion
- Big opportunities get **sequenced**, not tackled all at once

**Problem-first discovery (Articles 1, 3, 4):**
- Start from business pain points, not AI capabilities
- Talk to frontline workers, not just managers
- Apply threshold filters ruthlessly
- Domain-specific solutions beat general-purpose "second brain" ambitions

**"Good enough" shipping (Articles 2, 5):**
- Accept 80% accuracy with human fallback
- Redesign the workflow to benefit from 80% rather than pushing AI to 100%
- Ship fast, learn, iterate -- do not polish endlessly

**Simplest viable architecture (Article 7):**
- Most business AI applications are Automated AI Workflows (predefined steps + AI), not agents
- Only graduate to agents when simpler approaches are genuinely insufficient
- *"Choosing a monster truck to get to the bakery next door"* is the most common overengineering mistake

### Patterns That Fail

**One-project-at-a-time evaluation (Article 1):**
- Every project justifies itself from scratch, training the organisation to treat AI with suspicion
- If the first project underwhelms: *"We tried AI, it didn't work."*
- No second attempt, no iteration, no learning curve

**Transformation theatre (Articles 4, 5):**
- Spending more time on strategy decks and roadmaps than building
- *"Plan -> Plan -> Plan -> Refine -> Refine"* spiral that never crosses the ambition line
- Previous incarnations: "data-driven", "digital-first" -- same pattern of aspiration without execution

**Quick wins that do not compound (Article 4):**
- Isolated tool purchases (expensive SaaS, productivity suite licences) that create vendor lock-in and no AI capability
- Quick wins only matter if they can grow into something bigger

**Fantasy math (Article 6):**
- Six-tab spreadsheets with 3-year forecasts and assumptions nobody believes
- *"Leadership wants certainty, and the numbers get engineered until nothing means anything anymore."*

**AI costs treated like traditional IT costs (Article 6):**
- AI running costs grow with usage (inference), model drift, and data maintenance
- Unlike traditional IT where marginal cost of additional users is near zero, AI success literally makes it more expensive
- Without cost guardrails, ROI can be erased by escalating running costs

---

## 9. Scale Considerations

### Individual to Team to Organisation

The articles describe a clear progression of AI value as adoption scales:

| Scale | Typical AI Type | Measurement | Value Pattern |
|-------|----------------|-------------|---------------|
| **Individual** | Productivity AI (ChatGPT, Claude) | Qualitative -- "feels faster" | Hard to quantify; GBP 8K threshold rarely provable per person |
| **Team workflow** | Automated AI Workflow | Quantitative -- hours saved, throughput | Clear ROI; where most SMB value lives |
| **Organisation-wide** | Multiple workflows + possible agents | 3-layer KPI framework | Compounding returns; requires governance |

### Key Scaling Insights

- **The first solution is the hardest.** Once one AI workflow is running profitably, building the next becomes easier. You have proven it works, built the muscle, and earned internal credibility (Article 5).
- **Scaling costs are non-linear.** AI inference costs scale with usage. A solution that costs GBP 400/month at team scale might cost GBP 4K/month at organisation scale. The Cost Cap model (Article 6) becomes critical at scale.
- **Governance scales with risk.** A single team using an AI workflow needs light governance. Organisation-wide deployment needs compliance checking, access controls, and clear ownership (Articles 3, 8, 10).
- **Process mining reveals organisation-scale opportunities.** Article 12 shows that the biggest efficiency gains come from analysing end-to-end business processes, not individual tasks. But you need at least team-level AI maturity before tackling process-level optimisation.
- **The Digital/AI Factory model (Article 8)** is for organisations ready to scale beyond their first few AI solutions. It provides centralised expertise while distributing ownership to business units. Most UK SMBs will not need this model initially but should be aware of it as a growth pattern.

### SMB Scale Advantages

- **Shorter feedback loops:** A 15-person company can go from prototype to full adoption in weeks, not months
- **Fewer integration hurdles:** Less legacy infrastructure means simpler workflow integration
- **Direct line to decision-makers:** No layers of approval; the person who feels the pain can often authorise the solution
- **Proportionally larger impact:** Saving 6 person-days/month in a 15-person company is 8% of total capacity freed

---

## 10. Summary: Most Actionable Insights for UK SMBs

### Before You Spend Anything

1. **Map your AI opportunity landscape** using the threshold method. Identify all business pain points, apply a minimum value filter (GBP 2K-8K/month depending on your scale), and count what survives. This number anchors every future AI conversation.

2. **Define "good enough" before building.** What is the minimum an AI solution needs to do to be useful? What is the fallback when it fails? Write this down.

3. **Choose "First AI", not "AI First."** Ship one profitable AI solution. Do not create a transformation roadmap. Build credibility through results, not plans.

### When Building

4. **Use the simplest architecture that works.** Most SMB AI needs are Automated AI Workflows (predefined steps with AI handling interpretation, classification, or generation). You almost certainly do not need an AI agent.

5. **Phase your investment.** Start with a small prototype (GBP 2K-8K). Validate value. Only then invest in production. Each stage should pay for the next.

6. **Build into existing workflows.** If your solution requires staff to open a new application, upload files manually, and learn a new interface, adoption will fail. Integrate into email, spreadsheets, or existing tools.

### When Measuring

7. **Apply the Cost Cap model.** Two numbers: minimum value delivered per period, maximum cost allowed per period. Monitor quarterly. If outside the corridor, act immediately.

8. **Measure Productivity AI and Engineered AI differently.** Do not try to prove GBP 8K savings from ChatGPT subscriptions. Measure adoption and satisfaction instead. Reserve rigorous ROI calculation for custom workflows.

9. **Track business metrics, not technical ones.** Not "models deployed" but "hours saved per week" or "response time reduced from 4 hours to 1 hour."

### When Deciding to Continue or Stop

10. **Design a kill switch from day one.** If the value cannot be achieved or the cost cap is exceeded, reassess or stop. Zombie projects are more expensive than failed experiments.

---

## Appendix: Article Summaries

| # | Title | Key Takeaway |
|---|-------|-------------|
| 01 | **Why AI Roadmaps Beat AI Projects** | Map your total AI opportunity using a value threshold before building anything. A portfolio approach makes your AI initiative resilient to individual project failures. |
| 02 | **3 Lessons from AI That Worked but Was Never Used** | Define "good enough" upfront, validate the problem is financially worth solving, and ensure workflow integration before building. A GBP 16K prototype that works but never ships is a GBP 16K loss. |
| 03 | **5 Reasons Enterprise AI Fails** | PwC found 56% of CEOs saw zero financial benefit from AI. The fix: measure business impact (not deployments), set value thresholds, design kill switches, separate learning from earning, and start from problems not technology. |
| 04 | **AI First vs. First AI** | "AI First" transformation ambitions often lead to planning paralysis. "First AI" -- shipping one profitable solution through short build-learn-refine loops -- delivers real value and compounds over time. |
| 05 | **2025 Retrospective** | Production creates momentum; roadmaps create paralysis. Productivity AI and Engineered AI need different measurement rulers. People want structured templates, not open-ended options. |
| 06 | **The Cost Cap Model** | AI running costs behave nothing like traditional IT costs -- they grow with usage. Use a two-number model (Value Threshold + Cost Cap) to maintain an economic corridor and avoid spreadsheet theatre. |
| 07 | **AI Workflows vs. AI Agents vs. Everything in Between** | Five architecture levels from simple workflow automation to multi-agent systems. Choose the simplest approach that delivers the outcome. Most business applications need Automated AI Workflows, not agents. |
| 08 | **The Profitable AI Organisation** | Three operating models for scaling AI (Digital/AI Factory, Product & Platform, Enterprise Agile). The 3-layer S-O-T KPI framework (Technical, Operational, Strategic) is essential for measuring real impact. Start with the Factory model. |
| 09 | **From Ugly Data to Profitable Insights** | AI makes previously uneconomical data analysis viable. A 5-step process (define questions, tidy data, explore, analyse, validate) turned a GBP 40K+ analysis project into a 2-day, GBP 160 exercise. |
| 10 | **The AI Prototype-to-Production Checklist** | 95% of generative AI pilots fail (MIT). A 7-point checklist (value validated, user feedback, technical feasibility, growing demand, leadership support, compliance, integration path) separates production candidates from experiments. |
| 11 | **5 AI Modes for Business** | Five practical AI capabilities (Prediction, Perception, Creation, Thinking, Agentic) provide a shared vocabulary for mapping business problems to AI solutions without getting lost in buzzwords. |
| 12 | **AI-Powered Process Mining** | Boring ERP/CRM data contains your biggest profit drivers. Process mining reveals that actual processes diverge dramatically from documented ones, with case studies showing GBP 160K+ annual savings from 5-day sprints. |
| 13 | **How We Cleaned 50,000+ Records in Less Than a Day** | A 3-stage AI pipeline (external matching, similarity detection, AI harmonisation) cleaned 50,000+ records in 6.5 hours instead of a month, saving ~GBP 8K and unlocking previously invisible business insights. |
