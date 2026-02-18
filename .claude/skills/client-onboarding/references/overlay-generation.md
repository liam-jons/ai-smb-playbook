# Overlay Content Generation Guide

Overlays are the highest-value part of a client config — they make the playbook feel bespoke rather than generic. This reference provides detailed generation guidance for each overlay type.

## Strategy: Generate All, Review All

1. Generate complete overlay content using transcript + website analysis.
2. Present overlays as a formatted block for the consultant to review.
3. Allow the consultant to accept, edit, or regenerate individual items.
4. Never commit overlay content without explicit consultant approval.

---

## Brand Voice (`overlays.brandVoice`)

### Framework Examples (keys `"1"` through `"7"`)

Each key maps to a step in the brand voice framework. Generate a substantive paragraph (3-5 sentences) for each.

| Key | Framework Step | Generation Source | Generation Approach |
|-----|----------------|-------------------|---------------------|
| `"1"` | Brand personality | Website scrape (about, values pages) | Describe the brand as if it were a person — traits, demeanour, values. Use the company's self-description and website tone as input. |
| `"2"` | Voice attributes | Website scrape + consultant input | "We are / we are not / sounds like" format. Generate "we are" from website copy. The "we are not" dimension is hard to infer — ask the consultant. Include a "sounds like" quote. |
| `"3"` | Audience awareness | Transcript + website | Extract from training discussion of users/clients/stakeholders. Describe who the brand speaks to — demographics, mindset, needs. |
| `"4"` | Core messaging pillars | Website (about, services pages) | Draft 3-5 key themes from the company's positioning. Cross-reference with certifications and values mentioned. |
| `"5"` | Tone spectrum | Transcript + inference | Suggest how the voice adapts across channels (formal report vs. social media vs. internal). Provide 3-4 channel examples with tone guidance. |
| `"6"` | Style rules | UK English defaults | Default to standard UK English: sentence case headings, DD/MM/YYYY dates, £ for currency. Only ask about specific style choices (Oxford comma, heading case) if the company's website reveals a preference. |
| `"7"` | Terminology | Transcript + website | Extract preferred terms from transcript discussions. Note any product acronyms and their full forms. Include avoided terms where inferable. |

### Quality benchmarks

Compare generated output against the Phew example in `app/public/clients/phew.json`:

```
"1": "If Phew Design Limited were a person, they would be the knowledgeable colleague who explains safeguarding technology simply, celebrates your wins genuinely, and never talks down to you. Friendly but never flippant when the subject matter is serious."
```

Each entry should be:
- 2-4 sentences minimum (not one-liners)
- Specific to the client (not generic platitudes)
- Written in UK English
- Actionable (a reader can use it to calibrate Claude's voice)

### Head Start Content (`headStartContent`)

Generate a short passage (2-3 sentences) that demonstrates the client's established voice based on the website scrape analysis. This is displayed in the brand voice section as a pre-filled example. Lower stakes than the framework steps — a demonstration, not a reference document.

Example from Phew:
```
"Based on a review of the Phew! website, here are the IMPACT values and sector-specific terminology identified..."
```

---

## Recurring Tasks (`overlays.recurringTasks.examples`)

Array of `{ title, description }` objects. Target: 3-4 examples.

### Extraction approach

1. Scan the transcript for mentions of routine/regular/weekly/monthly tasks.
2. Identify tasks where AI automation would save significant time.
3. Prioritise tasks that were discussed as pain points or time sinks.
4. If fewer than 3 tasks found in transcript, suggest industry-appropriate alternatives.

### Description format

Each description should follow this pattern (modelled on Phew examples):
- **What** the task does (1 sentence)
- **What data** it uses or where it gets input (1 clause)
- **How Claude helps** — the automation angle (1-2 sentences)

Example from Phew:
```json
{
  "title": "Weekly training report",
  "description": "A skill that reviews the LMS data export, summarises completion rates, flags any overdue training, and formats a report for the safeguarding partnership team. You run this weekly by opening Claude, pointing it at the latest export, and asking it to generate the report. The intelligence is in the skill; your effort is limited to triggering it and providing the data."
}
```

### Quality check

Each description should:
- Be at least 2 sentences (no one-liners)
- Be specific to the client's operations (not generic "AI can help with reports")
- Mention concrete tools, data sources, or outputs where possible
- Use UK English

---

## ROI Examples (`overlays.roi.clientExamples`)

Record of `{ title, description }` keyed by descriptive task IDs.

### Task ID conventions

Task IDs are freeform strings but should be descriptive and kebab-case:
- `"proposal-writing"` — bid/proposal related
- `"compliance-docs"` — compliance/documentation related
- `"regression-testing"` — testing/QA related
- `"report-generation"` — reporting related
- `"contract-review"` — legal/contract related
- `"data-entry"` — data processing related

Choose 2-3 task IDs that match the client's discussed pain points.

### Generation approach

1. Identify 2-3 tasks from the transcript that would benefit from ROI measurement.
2. Generate a `title` that includes the client name (e.g. "Phew! bid writing").
3. Generate a `description` that explains the current process and how AI improves it.
4. Include illustrative quantitative estimates but flag them as estimates.

Example from Phew:
```json
{
  "proposal-writing": {
    "title": "Phew! bid writing",
    "description": "Phew! regularly responds to public sector tenders. AI can draft initial responses from knowledge base content, cutting preparation time from days to hours."
  }
}
```

### Quality check

Each ROI example should:
- Include the client name in the title
- Describe the current process briefly
- Explain the AI improvement
- Be realistic (not overpromising)
- Use UK English

---

## When Web Fetching Is Unavailable

If WebFetch or Firecrawl is not available:

1. Note the limitation to the consultant.
2. Ask for a brief description of the company's brand personality, values, and tone.
3. Generate brand voice overlays from transcript + consultant description instead.
4. The `headStartContent` can be omitted or left as an empty string.
5. All other overlays (recurring tasks, ROI) do not depend on web scraping.
