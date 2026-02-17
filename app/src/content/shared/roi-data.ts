import { siteConfig } from '@/config/site';

// ─── Types ───────────────────────────────────────────────────────────────────

export type TaskCategory =
  | 'time-savings'
  | 'error-reduction'
  | 'throughput'
  | 'capacity'
  | 'insight';

export interface CalculatorDefaults {
  currency: string;
  currencySymbol: string;
  defaultHourlyRate: number;
  defaultToolCostPerMonth: number;
  defaultHoursSavedPerWeek: number;
  defaultTeamSize: number;
  hourlyRateMin: number;
  hourlyRateMax: number;
  hourlyRateStep: number;
  toolCostMin: number;
  toolCostMax: number;
  toolCostStep: number;
  hoursSavedMin: number;
  hoursSavedMax: number;
  teamSizeMin: number;
  teamSizeMax: number;
}

export interface TaskTemplate {
  id: string;
  title: string;
  category: TaskCategory;
  beforeScenario: {
    time: string;
    cost: string;
    process: string;
  };
  afterScenario: {
    time: string;
    cost: string;
    process: string;
  };
  roiHighlight: string;
  relatedSection: string;
  /** Which track this template is relevant to */
  track: 'general' | 'developer' | 'both';
  clientExample?: {
    title: string;
    description: string;
  };
}

export interface ValueFramework {
  id: string;
  title: string;
  summary: string;
  details: string[];
}

export interface MeasurementMistake {
  id: string;
  title: string;
  problem: string;
  fix: string;
}

export interface GettingStartedStep {
  number: number;
  title: string;
  description: string;
}

export interface KpiLayer {
  id: string;
  label: string;
  description: string;
  metrics: string[];
}

export interface CategoryFilter {
  value: TaskCategory | 'all';
  label: string;
  colour: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

export const calculatorDefaults: CalculatorDefaults = {
  currency: 'GBP',
  currencySymbol: '£',
  defaultHourlyRate: 35,
  defaultToolCostPerMonth: 20,
  defaultHoursSavedPerWeek: 5,
  defaultTeamSize: 1,
  hourlyRateMin: 10,
  hourlyRateMax: 200,
  hourlyRateStep: 5,
  toolCostMin: 0,
  toolCostMax: 1000,
  toolCostStep: 5,
  hoursSavedMin: 1,
  hoursSavedMax: 40,
  teamSizeMin: 1,
  teamSizeMax: 50,
};

export const taskTemplates: TaskTemplate[] = [
  {
    id: 'email-drafting',
    title: 'Email Drafting & Replies',
    category: 'time-savings',
    beforeScenario: {
      time: '10–20 min per substantive email',
      cost: '£6–12 per email at £35/hr',
      process:
        'Manually compose client responses, proposal queries, and detailed replies \u2014 often rewriting similar responses from scratch.',
    },
    afterScenario: {
      time: '3–5 min per email',
      cost: '£2–3 per email',
      process:
        'AI drafts reply from context; human reviews, adjusts tone, and sends.',
    },
    roiHighlight: '75% time reduction on routine correspondence.',
    relatedSection: 'sessions',
    track: 'both',
  },
  {
    id: 'meeting-summaries',
    title: 'Meeting Notes & Action Items',
    category: 'time-savings',
    beforeScenario: {
      time: '20–45 min per meeting',
      cost: '£12–26 per meeting',
      process:
        'Manually review recording or notes, extract actions, distribute summary.',
    },
    afterScenario: {
      time: '5–10 min per meeting',
      cost: '£3–6 per meeting',
      process:
        'Paste transcript into Claude; get structured summary with owners and deadlines.',
    },
    roiHighlight: '70% faster turnaround on meeting follow-ups.',
    relatedSection: 'sessions',
    track: 'both',
  },
  {
    id: 'proposal-writing',
    title: 'Proposal & Bid Writing',
    category: 'throughput',
    beforeScenario: {
      time: '2–5 days per bid',
      cost: '£560–1,400 per bid',
      process:
        'Research requirements, draft from scratch, review, revise, format.',
    },
    afterScenario: {
      time: '0.5–1.5 days per bid',
      cost: '£140–420 per bid',
      process:
        'AI drafts from knowledge base and requirements; human refines and personalises.',
    },
    roiHighlight: '60–70% reduction in bid preparation time.',
    relatedSection: 'skills-extensions',
    track: 'both',
    clientExample: {
      title: `${siteConfig.companyShortName} bid writing`,
      description: `${siteConfig.companyShortName} regularly responds to public sector tenders. AI can draft initial responses from knowledge base content, cutting preparation time from days to hours.`,
    },
  },
  {
    id: 'report-generation',
    title: 'Report Generation',
    category: 'throughput',
    beforeScenario: {
      time: '3–8 hours per report',
      cost: '£105–280 per report',
      process:
        'Gather data from multiple sources, analyse trends, write narrative, format.',
    },
    afterScenario: {
      time: '30–90 min per report',
      cost: '£18–53 per report',
      process:
        'Feed data to AI; get structured report with analysis, charts descriptions, and recommendations.',
    },
    roiHighlight: '80% faster first-draft production.',
    relatedSection: 'recurring-tasks',
    track: 'both',
  },
  {
    id: 'data-entry',
    title: 'Data Entry & Extraction',
    category: 'error-reduction',
    beforeScenario: {
      time: '1–3 hours per batch',
      cost: '£35–105 per batch',
      process:
        'Manual copy-paste from documents into spreadsheets or systems. Error rate: 2–5%.',
    },
    afterScenario: {
      time: '10–20 min per batch',
      cost: '£6–12 per batch',
      process:
        'AI extracts structured data from documents; human verifies outliers. Error rate: <1%.',
    },
    roiHighlight: 'Error rate drops by 80% whilst processing 5x faster.',
    relatedSection: 'recurring-tasks',
    track: 'both',
  },
  {
    id: 'compliance-docs',
    title: 'Compliance Documentation',
    category: 'error-reduction',
    beforeScenario: {
      time: '1–2 days per document',
      cost: '£280–560 per document',
      process:
        'Draft from previous versions, cross-reference standards, track changes manually.',
    },
    afterScenario: {
      time: '2–4 hours per document',
      cost: '£70–140 per document',
      process:
        'AI generates first draft from existing policies and standard requirements; human reviews for accuracy.',
    },
    roiHighlight:
      '75% reduction in documentation time with improved consistency.',
    relatedSection: 'governance',
    track: 'both',
    clientExample: {
      title: `${siteConfig.companyShortName} ISO documentation`,
      description: `With ISO 9001, 27001, 14001 and Cyber Essentials Plus, ${siteConfig.companyShortName} maintains extensive documentation. AI can generate first drafts from existing policies.`,
    },
  },
  {
    id: 'content-creation',
    title: 'Blog & Marketing Content',
    category: 'throughput',
    beforeScenario: {
      time: '3–6 hours per piece',
      cost: '£105–210 per piece',
      process:
        'Research topic, outline, draft, edit, optimise for SEO, format for publication.',
    },
    afterScenario: {
      time: '1–2 hours per piece',
      cost: '£35–70 per piece',
      process:
        'AI drafts from brief and brand voice guidelines; human adds expertise, edits, and publishes.',
    },
    roiHighlight: '65% faster content production, 2–3x more output per week.',
    relatedSection: 'brand-voice',
    track: 'both',
  },
  {
    id: 'customer-responses',
    title: 'Customer Support Responses',
    category: 'capacity',
    beforeScenario: {
      time: '10–20 min per ticket',
      cost: '£6–12 per ticket',
      process:
        'Read ticket, research answer, draft response, check tone, send.',
    },
    afterScenario: {
      time: '3–5 min per ticket',
      cost: '£2–3 per ticket',
      process:
        'AI drafts response from knowledge base; human reviews and personalises before sending.',
    },
    roiHighlight: 'Handle 3x more support volume with the same team.',
    relatedSection: 'sessions',
    track: 'both',
  },
  {
    id: 'onboarding-docs',
    title: 'Employee & Client Onboarding',
    category: 'capacity',
    beforeScenario: {
      time: '4–8 hours per new starter',
      cost: '£140–280 per onboarding',
      process:
        'Manually prepare welcome packs, checklists, access requests, and training schedules.',
    },
    afterScenario: {
      time: '1–2 hours per new starter',
      cost: '£35–70 per onboarding',
      process:
        'AI generates personalised onboarding materials from templates; human reviews and adds personal touches.',
    },
    roiHighlight: '75% time saving per onboarding, more consistent experience.',
    relatedSection: 'skills-extensions',
    track: 'both',
  },
  {
    id: 'code-review',
    title: 'Code Review & Documentation',
    category: 'time-savings',
    beforeScenario: {
      time: '30–60 min per PR',
      cost: '£18–35 per review',
      process:
        'Developer reads diff, checks logic, verifies edge cases, writes comments.',
    },
    afterScenario: {
      time: '10–20 min per PR',
      cost: '£6–12 per review',
      process:
        'AI performs initial review, flags issues, suggests improvements; developer validates and merges.',
    },
    roiHighlight: '60% faster reviews, more consistent code quality.',
    relatedSection: 'claude-md',
    track: 'developer',
  },
  {
    id: 'regression-testing',
    title: 'Regression Testing',
    category: 'error-reduction',
    beforeScenario: {
      time: '2–4 hours per test suite run',
      cost: '£70–140 + tool subscription',
      process:
        'Maintain test scripts in external tool, run manually or on schedule, debug failures.',
    },
    afterScenario: {
      time: '30–60 min per suite',
      cost: '£18–35 (no extra tool cost)',
      process:
        'AI generates and runs tests via browser automation; reports failures with context.',
    },
    roiHighlight:
      'Replace dedicated testing tool subscription; faster test authoring.',
    relatedSection: 'regression-testing',
    track: 'developer',
    clientExample: {
      title: `${siteConfig.companyShortName} ${siteConfig.testingTool} replacement`,
      description: `${siteConfig.companyShortName} currently uses ${siteConfig.testingTool} for regression testing. Claude Code's browser automation can replicate test suites at lower cost.`,
    },
  },
  {
    id: 'research-synthesis',
    title: 'Research & Competitive Analysis',
    category: 'insight',
    beforeScenario: {
      time: '4–8 hours per report',
      cost: '£140–280 per analysis',
      process:
        'Manual web research, reading multiple sources, synthesising findings, formatting report.',
    },
    afterScenario: {
      time: '1–2 hours per report',
      cost: '£35–70 per analysis',
      process:
        'AI cross-references and synthesises the sources you provide; human validates and adds strategic context.',
    },
    roiHighlight: '75% faster synthesis of information you provide.',
    relatedSection: 'sessions',
    track: 'both',
  },
  {
    id: 'process-documentation',
    title: 'Internal Process Documentation',
    category: 'capacity',
    beforeScenario: {
      time: '2–4 hours per process',
      cost: '£70–140 per document',
      process:
        'Interview stakeholders, write step-by-step instructions, add screenshots, review.',
    },
    afterScenario: {
      time: '30–60 min per process',
      cost: '£18–35 per document',
      process:
        'AI generates documentation from conversation transcripts and existing materials; human verifies accuracy.',
    },
    roiHighlight: '75% faster documentation, easier to keep up to date.',
    relatedSection: 'recurring-tasks',
    track: 'both',
  },
  {
    id: 'social-media',
    title: 'Social Media Management',
    category: 'throughput',
    beforeScenario: {
      time: '1–2 hours per day',
      cost: '£35–70 per day',
      process:
        'Plan posts, write copy for each platform, find/create images, schedule.',
    },
    afterScenario: {
      time: '20–30 min per day',
      cost: '£12–18 per day',
      process:
        'AI generates platform-specific variants from one brief; human reviews and schedules.',
    },
    roiHighlight: '70% time saving, consistent multi-platform presence.',
    relatedSection: 'brand-voice',
    track: 'both',
  },
  {
    id: 'technical-debt',
    title: 'Technical Debt Assessment',
    category: 'insight',
    beforeScenario: {
      time: '2–5 days for full audit',
      cost: '£560–1,400 per audit',
      process:
        'Manual codebase review, catalogue issues, prioritise, create remediation plan.',
    },
    afterScenario: {
      time: '2–4 hours for initial assessment',
      cost: '£70–140 per assessment',
      process:
        'AI scans codebase, categorises debt, suggests priorities; developer validates and plans sprints.',
    },
    roiHighlight: '85% faster initial assessment, more comprehensive coverage.',
    relatedSection: 'technical-debt',
    track: 'developer',
  },
];

export const valueFrameworks: ValueFramework[] = [
  {
    id: 'value-threshold',
    title: 'The Value Threshold Model',
    summary:
      'If AI saves your team more than 10 hours per month, the subscription pays for itself.',
    details: [
      'Work out roughly what each hour of someone\u2019s time costs the business \u2014 take their annual salary, add about 30% for National Insurance and overheads, then divide by roughly 1,950 working hours per year.',
      'Multiply by hours saved per month \u2014 this is your gross value.',
      'Subtract tool costs (subscriptions, API usage) for net value.',
      'At \u00a335/hr average, the breakeven on a \u00a320/month licence is roughly 1 hour saved per month. Most teams cross this within the first week of structured use \u2014 anything above that threshold is pure return.',
    ],
  },
  {
    id: 'cost-cap',
    title: 'The Cost Cap Model',
    summary:
      'Set a ceiling: AI costs should never exceed a fixed percentage of the value it creates.',
    details: [
      'Rule of thumb: AI tool spend should be \u226420% of the gross value generated.',
      'If your team\u2019s total Claude spend is \u00a3200/month (e.g. 10 seats at \u00a320 each), it should generate at least \u00a31,000/month in time savings or value.',
      'Track this monthly for the first quarter, then quarterly once the pattern is stable.',
      'If the ratio slips, investigate whether the team needs more training or whether usage has dropped.',
      'This model is particularly useful for justifying renewals to finance or the board.',
    ],
  },
  {
    id: 'quick-wins-strategic',
    title: 'Quick Wins vs Strategic Value',
    summary:
      'Not all ROI is immediate \u2014 separate fast time-savings from slower strategic gains.',
    details: [
      'Quick wins (weeks 1\u20134): email drafting, meeting summaries, content repurposing, data extraction. These produce immediate, measurable time savings.',
      'Medium-term gains (months 2\u20136): proposal automation, compliance documentation, testing improvements. These require workflow changes but deliver larger returns.',
      'Strategic value (months 6+): knowledge management, competitive intelligence, capacity scaling. These are harder to measure but often the most valuable.',
      'Measure quick wins to build confidence. Use that confidence to invest in strategic initiatives.',
      'Do not judge strategic value by quick-win metrics \u2014 they operate on different timescales.',
    ],
  },
];

export const measurementMistakes: MeasurementMistake[] = [
  {
    id: 'measuring-ai-time',
    title: 'Measuring AI processing time, not human time saved',
    problem:
      'Tracking how long Claude takes to respond rather than how much human effort was avoided.',
    fix: 'Measure the before/after of human time on the full task. AI response time is irrelevant if the human still saves 3 hours.',
  },
  {
    id: 'ignoring-quality',
    title: 'Ignoring quality improvements',
    problem:
      'Focusing only on speed and missing that AI-assisted outputs are more consistent, have fewer errors, or are more thorough.',
    fix: 'Track error rates and revision cycles alongside time savings. One fewer round of revisions is worth as much as the initial time saving.',
  },
  {
    id: 'forgetting-setup',
    title: 'Forgetting setup and learning costs',
    problem:
      'Calculating ROI from day one and ignoring the ramp-up period where the team is still learning.',
    fix: 'Expect the first 2\u20134 weeks to be investment. Measure ROI from the point where workflows are established, but include setup costs in the annual calculation.',
  },
  {
    id: 'single-metric',
    title: 'Relying on a single metric',
    problem:
      'Using only "hours saved" and missing other value dimensions (quality, capacity, speed-to-market, employee satisfaction).',
    fix: 'Track 2\u20133 metrics per use case. Time saved is the easiest, but throughput increase and error reduction often tell a better story.',
  },
  {
    id: 'ignoring-learning-curve',
    title: 'Not accounting for the learning curve',
    problem:
      'ROI calculations that ignore the initial adoption period where productivity may dip before improving, leading to premature conclusions that AI isn\u2019t delivering value.',
    fix: 'Budget 2\u20134 weeks for ramp-up. Measure ROI from the point where workflows stabilise, but include the learning period in your annual cost\u2013benefit analysis.',
  },
  {
    id: 'wrong-baseline',
    title: 'Comparing AI costs against the wrong baseline',
    problem:
      'Using junior staff rates in the calculation when the task is actually performed by senior staff at much higher effective rates, which understates the true saving.',
    fix: 'Use the actual hourly cost of the person doing the work, including overheads. A senior designer at \u00a355/hr saving 3 hours is worth more than a junior at \u00a325/hr saving the same time.',
  },
];

export const gettingStartedSteps: GettingStartedStep[] = [
  {
    number: 1,
    title: 'Pick three tasks to measure',
    description:
      'Choose three recurring tasks where you already have a sense of how long they take. Ideally one quick win (email drafting, meeting summaries) and one higher-value task (proposal writing, compliance docs).',
  },
  {
    number: 2,
    title: 'Record your baseline',
    description:
      'For each task, note how long it currently takes and any quality issues (error rates, revision cycles, consistency problems). You need a "before" to calculate a meaningful "after".',
  },
  {
    number: 3,
    title: 'Run AI-assisted for two weeks',
    description:
      'Use Claude for these three tasks, timing each one. Keep a simple log: date, task, time taken, quality notes. If the numbers aren\u2019t clear after a fortnight, extend to four weeks \u2014 some tasks are less frequent.',
  },
  {
    number: 4,
    title: 'Calculate and share results',
    description:
      'Use the calculator above to project annual value. Share the numbers with your team and management \u2014 concrete ROI data builds support for continued investment.',
  },
  {
    number: 5,
    title: 'Expand and refine',
    description:
      'Once you have proven value on three tasks, identify the next three. Build a rolling measurement practice rather than a one-off exercise.',
  },
];

export const kpiFramework: KpiLayer[] = [
  {
    id: 'system',
    label: 'System KPIs',
    description:
      'High-level business metrics that matter to leadership and justify continued investment.',
    metrics: [
      'Cost per task (before vs after AI)',
      'Revenue per employee (capacity scaling)',
      'Time-to-delivery (proposals, reports, releases)',
      'Client satisfaction scores',
      'Employee satisfaction with AI tools',
    ],
  },
  {
    id: 'operational',
    label: 'Operational KPIs',
    description:
      'Team-level metrics that show workflow improvements and adoption patterns.',
    metrics: [
      'Hours saved per person per week',
      'Tasks completed per sprint/cycle',
      'Error rate and revision cycles',
      'AI adoption rate across team',
      'Skill/prompt reuse frequency',
    ],
  },
  {
    id: 'technical',
    label: 'Technical KPIs',
    description:
      'Developer-specific metrics for teams using Claude Code and AI-assisted development.',
    metrics: [
      'Code review turnaround time',
      'Test coverage increase rate',
      'Bug escape rate (production defects)',
      'Documentation freshness score',
      'CI/CD pipeline pass rate',
    ],
  },
];

export const categoryFilters: CategoryFilter[] = [
  {
    value: 'time-savings',
    label: 'Time Savings',
    colour: 'bg-info-muted text-info-muted-foreground',
  },
  {
    value: 'error-reduction',
    label: 'Error Reduction',
    colour: 'bg-danger-muted text-danger-muted-foreground',
  },
  {
    value: 'throughput',
    label: 'Getting More Done',
    colour: 'bg-success-muted text-success-muted-foreground',
  },
  {
    value: 'capacity',
    label: 'Team Capacity',
    colour: 'bg-warning-muted text-warning-muted-foreground',
  },
  {
    value: 'insight',
    label: 'Research & Analysis',
    colour: 'bg-important-muted text-important-muted-foreground',
  },
  { value: 'all', label: 'All', colour: '' },
];

/** Get the category badge colour classes for a given category. */
export function getCategoryColour(category: TaskCategory): string {
  return categoryFilters.find((f) => f.value === category)?.colour ?? '';
}
