<!--
  AI Use Case Feasibility Study Template
  What: Parameterised feasibility study for evaluating AI use cases within a UK SMB.
        Mirrors the output of the interactive Feasibility Study Builder in the
        AI Playbook app. Designed for standalone use without the app.
  Usage: Replace all {{PLACEHOLDER}} values with your organisation's details.
         Work through each section in order — the seven sections follow the same
         sequence as the interactive builder.
  Prerequisites: None. This is a standalone document.
  Note: This template uses UK English throughout and references GBP (£) for all
        currency values. Adapt currency and spelling if used outside the UK.

  Placeholder reference:

  | Placeholder                  | What to fill in                                                        |
  |------------------------------|------------------------------------------------------------------------|
  | {{COMPANY_NAME}}             | Organisation name                                                      |
  | {{PREPARED_BY}}              | Person preparing the study                                             |
  | {{DATE}}                     | Date of preparation (DD/MM/YYYY format)                                |
  | {{USE_CASE_NAME}}            | Name of the AI use case being evaluated                                |
  | {{CURRENT_OWNER}}            | Person or role currently responsible for the task                       |
  | {{FREQUENCY}}                | How often the task is performed (daily/weekly/monthly/quarterly/ad-hoc) |
  | {{CURRENT_PROCESS}}          | Step-by-step description of the current process                        |
  | {{TIME_PER_INSTANCE}}        | Current time per task instance (e.g. "10–20 minutes")                  |
  | {{COST_PER_INSTANCE}}        | Current cost per task instance in GBP (e.g. "£6–12")                   |
  | {{QUALITY_ISSUES}}           | Current quality problems (error rates, revision cycles, etc.)          |
  | {{PAIN_POINTS}}              | What makes the task frustrating or inefficient                         |
  | {{PROPOSED_AI_WORKFLOW}}     | How the task will work with AI assistance, step by step                |
  | {{HUMAN_OVERSIGHT}}          | Review/approval steps that remain (default provided)                   |
  | {{REQUIRED_TOOLS}}           | Bullet list of required tools (default: Claude Teams)                  |
  | {{SETUP_INVESTMENT}}         | Time to set up the AI workflow (default provided)                      |
  | {{TIME_SAVINGS}}             | Expected time savings (e.g. "Reduce from 20 min to 5 min")            |
  | {{COST_SAVINGS}}             | Expected cost savings in GBP (e.g. "Reduce from £12 to £3")           |
  | {{QUALITY_IMPROVEMENTS}}     | Expected improvements in consistency, accuracy, or thoroughness        |
  | {{ADDITIONAL_BENEFITS}}      | Non-quantifiable benefits (team morale, faster response times, etc.)   |
  | {{KPIS}}                     | Numbered list of measurable key performance indicators                 |
  | {{MIN_PERFORMANCE}}          | Minimum acceptable performance for the pilot to be worthwhile          |
  | {{PILOT_DURATION}}           | Duration of pilot (default: 2 weeks)                                   |
  | {{GO_NOGO_CRITERIA}}         | Conditions for stop, continue, or expand                               |
  | {{RECOMMENDATION}}           | Go / No-go / Conditional                                               |
  | {{PILOT_PLAN}}               | Who runs the pilot, when it starts, how results are shared             |
  | {{REVIEW_DATE}}              | When pilot results will be reviewed (DD/MM/YYYY format)                |

  Default values:
  - {{HUMAN_OVERSIGHT}} defaults to: "Review all AI output before external use."
  - {{REQUIRED_TOOLS}} defaults to: "- Claude Teams"
  - {{SETUP_INVESTMENT}} defaults to: "1–2 hours for prompt development and workflow documentation."
  - {{PILOT_DURATION}} defaults to: "2 weeks"
  - The five pre-populated risks in Section 5 are starting points — edit, remove,
    or add rows to suit your specific use case.

  Interactive version: The AI Playbook app includes a guided Feasibility Study
  Builder that walks you through each section with form fields, template
  pre-population, and instant Markdown export. Use the interactive version for
  a more guided experience; use this template for offline or manual completion.
-->

# AI Use Case Feasibility Study

**Organisation:** {{COMPANY_NAME}}
**Prepared by:** {{PREPARED_BY}}
**Date:** {{DATE}}
**Use case:** {{USE_CASE_NAME}}

---

## 1. Use Case Summary

| Field | Detail |
|-------|--------|
| Task/process | {{USE_CASE_NAME}} |
| Current owner | {{CURRENT_OWNER}} |
| Frequency | {{FREQUENCY}} |

### Current Process

{{CURRENT_PROCESS}}

---

## 2. Current State Assessment

| Metric | Value |
|--------|-------|
| Time per instance | {{TIME_PER_INSTANCE}} |
| Cost per instance | {{COST_PER_INSTANCE}} |

### Quality Issues

{{QUALITY_ISSUES}}

### Pain Points

{{PAIN_POINTS}}

---

## 3. Proposed AI-Assisted Workflow

{{PROPOSED_AI_WORKFLOW}}

### Human Oversight

Review all AI output before external use.

### Required Tools

- Claude Teams

### Setup Investment

1–2 hours for prompt development and workflow documentation.

---

## 4. Expected Benefits

| Benefit | Estimate |
|---------|----------|
| Time savings | {{TIME_SAVINGS}} |
| Cost savings | {{COST_SAVINGS}} |

### Quality Improvements

{{QUALITY_IMPROVEMENTS}}

### Additional Benefits

{{ADDITIONAL_BENEFITS}}

---

## 5. Risks and Mitigations

<!--
  The five risks below are standard defaults. Edit the descriptions and mitigations
  to match your use case. Change severity levels as appropriate. Remove rows that
  do not apply, and add new rows for risks specific to your scenario.
-->

| Risk | Severity | Description | Mitigation |
|------|----------|-------------|------------|
| Data Sensitivity | Low | AI processes internal business data during task execution. | Use Claude Teams (data not used for training). Review data classification per governance policy. |
| Quality | Medium | AI output may require human review before use. | Establish a review step before any AI-generated output is sent externally or committed. |
| Dependency | Low | Process depends on AI tool availability. | Maintain ability to complete the task manually. Document the manual fallback process. |
| Adoption | Medium | Team members may not consistently use the AI-assisted workflow. | Provide training, start with willing early adopters, share results to build confidence. |
| Compliance | Low | Ensure AI usage complies with UK GDPR and any industry-specific requirements. | Review against governance policy. No personal data processed without justification. |

---

## 6. Success Criteria

### Key Performance Indicators

1. {{KPIS}}

<!--
  Add additional KPIs as numbered items. Focus on business results rather than
  technical metrics. Example KPIs:
  - Reduce task time from [current] to [target] per instance
  - Reduce error rate from [current]% to [target]%
  - Increase output from [current] to [target] per week
  - Save [X] hours per week across the team
-->

### Minimum Acceptable Performance

{{MIN_PERFORMANCE}}

### Pilot Duration

2 weeks

### Go/No-Go Decision Criteria

{{GO_NOGO_CRITERIA}}

---

## 7. Recommendation

**Decision:** {{RECOMMENDATION}}

### Pilot Plan

{{PILOT_PLAN}}

### Review Date

{{REVIEW_DATE}}

---

*Generated with the AI Playbook Feasibility Study Tool*
