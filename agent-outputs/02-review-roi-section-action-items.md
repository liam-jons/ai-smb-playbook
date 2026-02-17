# 2. Review ROI section action items

Now I have a complete picture. Let me compile my analysis.

---

# ROI Measurement Section -- Detailed Review Report

## Action Item 1: Tab Order -- "All" Should Come Last

### Current Implementation

The tab order is defined in the `categoryFilters` array at `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/roi-data.ts`, lines 595-622:

```typescript
export const categoryFilters: CategoryFilter[] = [
  { value: 'all', label: 'All', colour: '' },
  { value: 'time-savings', label: 'Time Savings', colour: '...' },
  { value: 'error-reduction', label: 'Error Reduction', colour: '...' },
  { value: 'throughput', label: 'Getting More Done', colour: '...' },
  { value: 'capacity', label: 'Team Capacity', colour: '...' },
  { value: 'insight', label: 'Research & Analysis', colour: '...' },
];
```

The default active category is set at `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/RoiMeasurementSection.tsx`, line 414:

```typescript
const [activeCategory, setActiveCategory] = useState<TaskCategory | 'all'>('all');
```

So currently, **"All" is both the first tab and the default selection**, meaning every template is shown on first load.

### Items Per Category (General Track -- `track: 'both'`)

General track users see 12 templates (3 are developer-only). Breakdown by category for general track:

| Category | Count (general) | Templates |
|----------|---:|-----------|
| Time Savings | 2 | Email Drafting, Meeting Notes |
| Error Reduction | 2 | Data Entry, Compliance Docs |
| Getting More Done (throughput) | 4 | Proposals, Reports, Blog/Marketing, Social Media |
| Team Capacity | 3 | Customer Support, Onboarding, Process Docs |
| Research & Analysis (insight) | 1 | Research & Competitive Analysis |
| **All** | **12** | Everything above |

Developer track users see all 15 (adds Code Review, Regression Testing, Technical Debt Assessment).

### Recommendation

**Default tab should be "Time Savings"** for these reasons:
1. It contains the most universally relatable tasks (email drafting, meeting notes) -- every SMB team member does these.
2. Showing only 2-3 cards on first load is digestible rather than overwhelming with 12-15.
3. The "Getting Started" section (step 1) already recommends starting with "one quick win (email drafting, meeting summaries)" -- aligning the default tab with this guidance creates coherence.
4. Time savings is the easiest ROI dimension to grasp and measure, matching the progressive disclosure philosophy.

**Required code changes:**

1. In `roi-data.ts`, move `'all'` to the end of the `categoryFilters` array:

```typescript
export const categoryFilters: CategoryFilter[] = [
  { value: 'time-savings', label: 'Time Savings', colour: 'bg-info-muted text-info-muted-foreground' },
  { value: 'error-reduction', label: 'Error Reduction', colour: 'bg-danger-muted text-danger-muted-foreground' },
  { value: 'throughput', label: 'Getting More Done', colour: 'bg-success-muted text-success-muted-foreground' },
  { value: 'capacity', label: 'Team Capacity', colour: 'bg-warning-muted text-warning-muted-foreground' },
  { value: 'insight', label: 'Research & Analysis', colour: 'bg-important-muted text-important-muted-foreground' },
  { value: 'all', label: 'All', colour: '' },
];
```

2. In `RoiMeasurementSection.tsx` line 414, change the default state:

```typescript
const [activeCategory, setActiveCategory] = useState<TaskCategory | 'all'>('time-savings');
```

3. Optionally update the description text at line 500 from "15 common SMB tasks" to reflect that the count is dynamic based on track, or simply remove the number:

```typescript
<p className="mb-6 max-w-prose text-sm text-muted-foreground">
  Common SMB tasks with before/after comparisons. Filter by category
  to find the most relevant ones for your team.
</p>
```

---

## Action Item 2: Introduction Section Improvement

### Current Introduction

Located at `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/RoiMeasurementSection.tsx`, lines 438-464:

```jsx
<h2>Why Measure AI ROI?</h2>
<p>Now that you're using Claude, it's worth tracking where it actually
   saves you time -- so you can double down on what works, drop
   what doesn't, and make the case for keeping the subscription.</p>
<p>Every licence needs to earn its keep. This section gives you
   practical frameworks, a live calculator, and task-level templates to
   measure what matters.</p>

<CalloutCard variant="tip" title="Start with one task">
  You don't need to measure everything at once. Pick one task...
</CalloutCard>
```

### Assessment of Current Introduction

**What it does well:**
- The tone is right: practical, non-condescending, conversational.
- "Double down on what works, drop what doesn't" is a good framing.
- The CalloutCard tip about starting with one task is sound advice.

**What it lacks:**
1. **No clear signposting of what the section contains.** Users land on this section and must scroll to discover there is a calculator, templates, and frameworks. The second paragraph mentions them in passing ("a live calculator, and task-level templates") but does not adequately explain or distinguish the tools.
2. **The "why" is too narrow.** It only covers "justify the subscription" -- it misses other compelling reasons UK SMBs care about: demonstrating value to the wider team, building a case for expanding AI usage, identifying which tasks benefit most, and avoiding waste on tasks where AI does not help.
3. **No acknowledgement of the common SMB situation.** Many SMBs adopt AI tools and then struggle to articulate value beyond anecdotal "it feels faster." The introduction should validate this experience.
4. **The heading "Why Measure AI ROI?" feels passive.** It reads like a textbook chapter heading rather than something that draws the reader in.

### Recommended Improved Introduction

```jsx
<section aria-labelledby="why-measure-heading">
  <h2
    id="why-measure-heading"
    className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl"
  >
    Measuring What AI Actually Saves You
  </h2>
  <div className="space-y-3 max-w-prose">
    <p className="text-base leading-relaxed text-foreground">
      Most teams know AI is saving them time, but struggle to put a
      number on it. Without that number, it is harder to justify
      renewing licences, expanding to new team members, or knowing
      which tasks benefit most from AI.
    </p>
    <p className="text-sm leading-relaxed text-muted-foreground">
      This section gives you three practical tools to fix that:
    </p>
    <ul className="space-y-1.5 text-sm text-muted-foreground list-none">
      <li className="flex items-start gap-2">
        <Calculator className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          <strong className="text-foreground">ROI Calculator</strong> &mdash;
          plug in your hours saved and team size to see projected annual
          savings in pounds.
        </span>
      </li>
      <li className="flex items-start gap-2">
        <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          <strong className="text-foreground">Task Templates</strong> &mdash;
          before/after comparisons for common SMB tasks, with copy-ready
          summaries for your business case.
        </span>
      </li>
      <li className="flex items-start gap-2">
        <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          <strong className="text-foreground">Measurement Frameworks</strong> &mdash;
          three approaches to valuing AI adoption, from quick breakeven
          checks to long-term strategic value.
        </span>
      </li>
    </ul>
  </div>

  <CalloutCard variant="tip" title="Start with one task" className="mt-6">
    You do not need to measure everything at once. Pick one task you do
    every week &mdash; email drafting, meeting notes, whatever is most
    repetitive &mdash; and track the time difference for a fortnight. That
    single number is usually enough to make the case.
  </CalloutCard>
</section>
```

**Key changes in the recommendation:**
- Heading changed to "Measuring What AI Actually Saves You" -- more active and outcome-focused.
- Opens by validating the common experience ("Most teams know AI is saving them time, but struggle to put a number on it").
- Clearly lists the three interactive tools with icons and one-line descriptions, so users immediately know what is available and can jump to the relevant one.
- The icons reuse the same Lucide imports already in the component (Calculator, Target, TrendingUp -- all imported at lines 23, 24, 22).
- Minor UK English fix: changed "you don't" to "you do not" for slightly more formal written tone (though either is acceptable).
- Preserved the CalloutCard tip, which is well-written.

---

## Action Item 3: Feasibility Study Template Tool (New Feature)

### How the Existing Governance Template Works

The governance policy section (`/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/GovernancePolicySection.tsx`) uses this pattern:

1. **Data is defined inline** in the component file (not in a separate data file like `roi-data.ts`). The policy sections, placeholders, risk tiers, quick-start steps, and the full policy text are all defined as constants within the component file itself (lines 77-617).

2. **Parameterisation via `{{PLACEHOLDER}}` variables.** Nine placeholders (COMPANY_NAME, INDUSTRY, TEAM_SIZE, etc.) are defined with descriptions and example values (lines 77-123). A `renderContentWithPlaceholders()` function (line 646) splits text on the regex `/({{[A-Z_]+}})/g` and renders matching placeholders as hoverable `<PlaceholderBadge>` components.

3. **Two view modes** -- "Walkthrough" (accordion with section-by-section annotations) and "Full Document" (single scrollable page), toggled via `Tabs` (line 753, line 919-928).

4. **Copy + Download actions.** The full policy text can be copied to clipboard via `CopyButton` or downloaded as a Markdown file via a `Button` that creates a Blob and triggers a download (lines 793-824).

5. **No form-based customisation.** The user must manually find-and-replace the `{{PLACEHOLDER}}` values after copying/downloading. There is no interactive form that fills in the placeholders and generates a completed document.

6. **Separate starter-kit template.** A standalone Markdown version lives at `/Users/liamj/Documents/development/ai-smb-playbook/starter-kit/templates/governance-policy-template.md` for direct use outside the playbook app.

### What a Feasibility Study Template Should Contain

For a UK SMB evaluating an initial AI use case, a feasibility study should cover these sections:

**Section 1: Use Case Summary**
- Task or process name
- Current owner/team
- Frequency (daily, weekly, monthly)
- Brief description of the current manual process

**Section 2: Current State Assessment**
- Time currently spent per instance
- Estimated cost per instance (time x hourly rate)
- Quality metrics (error rate, revision cycles, consistency)
- Pain points and bottlenecks

**Section 3: Proposed AI-Assisted Workflow**
- How AI would be used (which steps, what role)
- Human oversight requirements
- Required AI tools (Claude Teams, Claude Code, specific features)
- Setup/training investment needed

**Section 4: Expected Benefits**
- Time savings estimate (per instance and annualised)
- Cost savings estimate (using the ROI calculator values)
- Quality improvements
- Capacity/throughput gains
- Non-quantifiable benefits (consistency, employee satisfaction, speed-to-market)

**Section 5: Risks and Mitigations**
- Data sensitivity (link to governance policy tier classification)
- Quality assurance requirements (human review needed?)
- Dependency risk (what if AI output is wrong?)
- Adoption risk (will the team actually use it?)
- Compliance considerations (GDPR, industry-specific)

**Section 6: Success Criteria**
- Measurable KPIs for the pilot period
- Minimum acceptable performance
- Timeline for evaluation (recommend 2-4 weeks)
- Go/no-go decision criteria

**Section 7: Recommendation and Next Steps**
- Go / No-go / Conditional recommendation
- Pilot plan (who, when, how long)
- Review date

### Integration with Existing ROI Tools

The feasibility study should connect to the existing ROI section tools in several ways:

1. **Pre-populate from task templates.** If the user selects a task template from the existing 15, the feasibility study could auto-fill the "Current State" and "Proposed AI Workflow" sections from the template's `beforeScenario` and `afterScenario` data. This is the most natural entry point.

2. **Link to the ROI Calculator.** Section 4 (Expected Benefits) should reference the calculator's output. Ideally, calculator values could be passed in, or the user could be instructed to use the calculator first and paste the results.

3. **Link to governance policy.** Section 5 (Risks) should reference the governance risk tier framework from section 1.5, linking to `/${track}/governance` for the data sensitivity classification.

4. **Link to the Getting Started checklist.** The feasibility study is effectively a more structured version of "Step 1: Pick three tasks to measure." It formalises the process.

### Component Architecture Recommendations

Following the existing patterns in this codebase:

**Option A: Inline Interactive Form (Recommended)**

A multi-step interactive wizard within the ROI section, similar in spirit to the governance template but with form-based input rather than placeholder-based substitution:

```
app/src/content/shared/feasibility-data.ts     -- Types, placeholder definitions, template text
app/src/content/general/RoiMeasurementSection.tsx  -- Add as a new sub-section (#3.5, between templates and frameworks)
```

The form would use a stepped approach:
1. **Select or describe a use case** (dropdown of task template titles + "Custom" option)
2. **Fill in current state** (pre-populated from template if selected; editable)
3. **Fill in expected benefits** (pre-populated; editable)
4. **Assess risks** (checklist with guidance)
5. **Set success criteria** (guided prompts)
6. **Generate and copy/download** the completed feasibility study

This follows the governance section's "copy + download" export pattern but adds form-based input upstream.

**Option B: Separate Section**

A new section (e.g., `1.9`, slug `feasibility-study`) in the general track. This would require:
- New entry in `sections.ts`
- New entry in `registry.ts`
- New component file
- Renumbering downstream sections

**Recommendation: Option A** -- keep it within the ROI section. Reasons:
- It is a logical extension of the task templates and calculator.
- Users are already in the mindset of "which tasks should we try AI for?" when viewing ROI content.
- The ROI section is the natural place to build a business case.
- A separate section would fragment the measurement/justification narrative.
- However, if the ROI section becomes too long (it already has 8 sub-sections), it could be extracted later.

**Implementation structure within `RoiMeasurementSection.tsx`:**

```typescript
// New sub-component
function FeasibilityStudyBuilder() {
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState<FeasibilityFormData>(defaults);
  // ... multi-step form logic
  // Final step: generate markdown text and offer copy/download
}
```

**Data architecture:**

```typescript
// In feasibility-data.ts (new file)
export interface FeasibilityFormData {
  useCaseName: string;
  currentOwner: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'ad-hoc';
  currentProcess: string;
  currentTimePerInstance: string;
  currentCostPerInstance: string;
  qualityIssues: string;
  proposedAiWorkflow: string;
  humanOversight: string;
  requiredTools: string[];
  setupInvestment: string;
  timeSavingsEstimate: string;
  costSavingsEstimate: string;
  qualityImprovements: string;
  risks: FeasibilityRisk[];
  successKpis: string[];
  pilotDuration: string;
  recommendation: 'go' | 'no-go' | 'conditional';
}

export interface FeasibilityRisk {
  category: 'data-sensitivity' | 'quality' | 'dependency' | 'adoption' | 'compliance';
  description: string;
  mitigation: string;
  severity: 'low' | 'medium' | 'high';
}
```

**Repeatability:** Once the user completes one feasibility study, they should see a "Create another" button that resets the form. The generated output should be self-contained Markdown that works outside the playbook app, similar to the governance policy export.

### Key Design Decisions

1. **Pre-population from task templates is the killer feature.** Without it, this is just a form that generates Markdown -- not very compelling. With it, the user selects "Email Drafting" from a dropdown and immediately sees a pre-populated feasibility study with realistic before/after data, needing only minor customisation.

2. **The form should generate a complete, professional document** that the user can share with management or include in a business case. UK English throughout, practical tone, no jargon.

3. **Progress should be saved to localStorage** (using the existing `phew-playbook` prefix from `site.ts`) so the user does not lose work if they navigate away.

4. **The wizard should be collapsible/expandable** so it does not dominate the ROI section when the user is not actively using it. A `Collapsible` component wrapping the form would work well.

---

## Action Item 4: General Quality Assessment

### Data Accuracy and Structure (`roi-data.ts`)

**File:** `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/roi-data.ts`

**Types (lines 1-91):** Well-structured. TypeScript interfaces are clear and complete. The `TaskCategory` discriminated union type is appropriate. The `CategoryFilter` interface correctly links `TaskCategory | 'all'` to labels and colours.

**Calculator Defaults (lines 95-112):**
- Default hourly rate of **GBP 35** is sensible. The UK median full-time hourly rate is approximately GBP 15-17, but once you add employer NI (~13.8%), pension (3-8%), and overhead, GBP 35 is a reasonable "fully loaded" cost for a skilled worker at a design agency. The helper text at line 170-171 ("Divide annual salary by ~1,950 hours. Default GBP 35/hr suits most roles.") correctly explains the reasoning.
- Default tool cost of **GBP 20/month** matches Claude Teams pricing. Note: the implementation plan at line 61 specified GBP 180/mo, but the actual implementation used GBP 20 -- this is correct (GBP 180 would be the team-level cost for ~10 people, not per-person).
- Hours saved range of **1-40** is generous. The default of **5 hours/week** is conservative and credible for a first estimate.
- Team size range **1-50** is appropriate for SMBs.
- Hourly rate range **GBP 10-200** covers from near minimum wage (loaded) to specialist consultant rates.

**Issue found:** The `toolCostStep` is 10, meaning users can only set tool cost in GBP 10 increments. Claude Teams is approximately GBP 18-22/month depending on exchange rate, so the GBP 10 step means users cannot set GBP 18 or GBP 22 -- they must use GBP 20 or GBP 10/GBP 30. Consider changing `toolCostStep` to **5** for better granularity, though this is minor.

### Task Templates (lines 127-445)

**Realism of time estimates:**
- Email Drafting: 10-20 min before, 3-5 min after -- **realistic**.
- Meeting Notes: 20-45 min before, 5-10 min after -- **realistic** if using transcript paste.
- Proposal Writing: 2-5 days before, 0.5-1.5 days after -- **realistic for public sector bids**.
- Report Generation: 3-8 hours before, 30-90 min after -- **slightly optimistic** on the "after" side; depends heavily on report complexity.
- Data Entry: 1-3 hours before, 10-20 min after -- **realistic** for document extraction tasks.
- Compliance Docs: 1-2 days before, 2-4 hours after -- **realistic** given existing policy templates.
- Blog/Marketing: 3-6 hours before, 1-2 hours after -- **realistic**.
- Customer Support: 10-20 min before, 3-5 min after -- **realistic** if knowledge base is available.
- Onboarding: 4-8 hours before, 1-2 hours after -- **realistic** for template-based onboarding.
- Code Review: 30-60 min before, 10-20 min after -- **realistic**.
- Regression Testing: 2-4 hours before, 30-60 min after -- **realistic** for the Phew! context.
- Research: 4-8 hours before, 1-2 hours after -- **realistic** for synthesis tasks.
- Process Documentation: 2-4 hours before, 30-60 min after -- **realistic**.
- Social Media: 1-2 hours/day before, 20-30 min/day after -- **realistic**.
- Technical Debt: 2-5 days before, 2-4 hours after -- **slightly optimistic**; AI assessment is fast but still requires significant human validation.

**GBP values:** All calculated at GBP 35/hr, which is internally consistent. The cost ranges directly correspond to the time ranges multiplied by GBP 35. **No arithmetic errors found.**

**Template accuracy issue:** The task templates description at `RoiMeasurementSection.tsx` line 500 says "15 common SMB tasks" but general-track users only see 12 (the 3 developer-only templates are filtered out at line 419). The count should either be dynamic or say "common SMB tasks" without a number.

### Component Quality

**Structure:** The component follows established codebase patterns precisely:
- Named export, `useTrack()` hook, `space-y-12` top-level spacing
- `<section aria-labelledby>` for each block with proper heading IDs
- `<Separator />` between sections
- Proper semantic HTML throughout

**Accessibility:**
- All output regions have `aria-live="polite"` and `aria-atomic="true"` (line 224-225) -- good for the calculator.
- All decorative icons have `aria-hidden="true"`.
- Labels are properly associated with inputs via `htmlFor`/`id`.
- The Tabs component from shadcn/ui handles keyboard navigation automatically.
- **One issue:** The range inputs (`<input type="range">`) at lines 137-144 and 205-211 lack `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` attributes. While the browser provides some of this natively for range inputs, explicit ARIA attributes would improve screen reader experience. However, this is a minor concern since the HTML `min`, `max`, and `value` attributes are present.

**Performance:**
- `useMemo` is correctly used for both filtering operations (lines 418-429).
- No unnecessary re-renders -- derived state is computed inline rather than stored in state (e.g., `monthlyGross`, `roiPercent`).
- The calculator uses local state in a child component (`RoiCalculator`), isolating re-renders from the rest of the section.

**Dark mode:** The component uses semantic colour tokens (`text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`, `text-success`, `text-danger`) rather than hardcoded colours. These are defined in the Tailwind v4 theme. **No dark mode issues.**

**Missing features from the implementation plan:**
- The plan (line 73) mentioned "interaction-design skill for calculator microinteractions (smooth number transitions, visual feedback on positive/negative ROI)" -- this was not implemented. The calculator outputs update instantly without transition animation. This is a nice-to-have, not a defect.

### Additional Issues and Improvements

1. **The exported text at line 83** is hardcoded: `Generated with the Phew! AI Playbook ROI Calculator`. This should use `siteConfig.appTitle` from `@/config/site.ts` for reusability:
   ```typescript
   import { siteConfig } from '@/config/site';
   // ...
   `Generated with the ${siteConfig.appTitle} ROI Calculator`,
   ```

2. **The client context data** at `roi-data.ts` lines 114-125 (`clientContext` export) is defined and exported but **never imported or used** anywhere in the codebase. This appears to be dead code that was planned for use but never integrated. It should either be used (e.g., to pre-populate the calculator's team size default) or removed.

3. **The `cost` field** in `beforeScenario` and `afterScenario` (e.g., line 135: `cost: '£6–12 per email'`) is defined in the `TaskTemplate` interface but **never rendered** in the `TaskTemplateCard` component. The card shows `time` and `process` but not `cost`. This is potentially valuable data that is being computed and stored but hidden from the user. Consider adding the cost to the before/after cards, or remove it from the data to reduce maintenance burden.

4. **The "measurementMistakes" array** has only 4 items (lines 489-518), but the component description at line 598 says "Six pitfalls." The implementation plan specified 6 mistakes. This is a content gap -- 2 mistakes are missing. The two that were planned but not implemented (based on common ROI measurement pitfalls) are likely:
   - Not accounting for the learning curve / adoption period in ROI calculations
   - Comparing AI costs against the wrong baseline (e.g., junior staff rates vs actual staff performing the task)

   Wait -- looking more carefully, "forgetting-setup" at line 505 covers the learning curve. The plan said 6 but the description at line 598 also says "Six pitfalls." So the **description says six but only four are implemented**. Either add 2 more mistakes or update the description to say "four."

5. **Value framework content duplication (lines 456-458):** The Value Threshold framework's details contain a near-duplicate:
   - Line 457: "At GBP 35/hr average, the breakeven on a GBP 20/month licence is roughly 1 hour saved per month. Most teams cross this within the first day of structured use."
   - Line 458: "Anything above that threshold is pure return. Most teams cross this within the first week of structured use."
   
   These two bullets say almost the same thing ("first day" vs "first week") and should be consolidated into a single bullet.

6. **The `formatGBP` function** at line 44 uses `toLocaleString('en-GB')` which is correct for UK formatting. However, negative values render as "-GBP 500" (with a minus sign before the pound symbol), which is typographically correct for UK usage. No issue here.

---

## Summary of Priority Recommendations

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| **High** | Change default tab to "Time Savings" and move "All" to last | ~10 min (2 line changes) | Significantly reduces first-load overwhelm |
| **High** | Fix "Six pitfalls" description to match actual count of 4, or add 2 more | ~15-30 min | Fixes factual error visible to users |
| **High** | Improve introduction with tool signposting | ~30 min | Better user orientation and engagement |
| **Medium** | Fix hardcoded "Phew!" in export text -- use `siteConfig.appTitle` | ~5 min | Reusability for other clients |
| **Medium** | Fix "15 common SMB tasks" count (general track sees 12) | ~5 min | Accuracy |
| **Medium** | Render the `cost` field in TaskTemplateCard or remove from data | ~15 min | Either adds useful info or reduces dead data |
| **Medium** | Remove unused `clientContext` export or integrate it | ~5-10 min | Code cleanliness |
| **Medium** | Consolidate duplicate bullet in Value Threshold framework | ~5 min | Content quality |
| **Low** | Feasibility study builder tool | ~4-8 hours | High-value new feature but significant build |
| **Low** | Calculator microinteraction animations | ~1-2 hours | Polish, not critical |
| **Low** | `toolCostStep` from 10 to 5 for better granularity | ~1 min | Minor UX improvement |

---

**Files referenced:**
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/RoiMeasurementSection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/roi-data.ts`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/sections.ts`
- `/Users/liamj/Documents/development/ai-smb-playbook/.planning/plan-files/roi-section-implementation.md`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/shared/registry.ts`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/content/general/GovernancePolicySection.tsx`
- `/Users/liamj/Documents/development/ai-smb-playbook/starter-kit/templates/governance-policy-template.md`
- `/Users/liamj/Documents/development/ai-smb-playbook/app/src/config/site.ts`

---
*Agent: `a465bd1` | Session: `46d06ca6-d7d3-4777-a0d1-d02ea203421f` | Rows: 39*
*2026-02-17T14:11:48.683Z -> 2026-02-17T14:15:04.449Z*