import type { TaskCategory, TaskTemplate } from '@/content/shared/roi-data';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'ad-hoc';
export type Recommendation = 'go' | 'no-go' | 'conditional';
export type RiskCategory =
  | 'data-sensitivity'
  | 'quality'
  | 'dependency'
  | 'adoption'
  | 'compliance';
export type RiskSeverity = 'low' | 'medium' | 'high';

export interface FeasibilityRisk {
  category: RiskCategory | 'custom';
  description: string;
  mitigation: string;
  severity: RiskSeverity;
}

export interface FeasibilityFormData {
  // Section 1: Use Case Summary
  useCaseName: string;
  currentOwner: string;
  frequency: Frequency;
  currentProcess: string;

  // Section 2: Current State Assessment
  currentTimePerInstance: string;
  currentCostPerInstance: string;
  qualityIssues: string;
  painPoints: string;

  // Section 3: Proposed AI-Assisted Workflow
  proposedAiWorkflow: string;
  humanOversight: string;
  requiredTools: string[];
  setupInvestment: string;

  // Section 4: Expected Benefits
  timeSavingsEstimate: string;
  costSavingsEstimate: string;
  qualityImprovements: string;
  nonQuantifiableBenefits: string;

  // Section 5: Risks and Mitigations
  risks: FeasibilityRisk[];

  // Section 6: Success Criteria
  successKpis: string[];
  minimumAcceptablePerformance: string;
  pilotDuration: string;
  goNoGoDecisionCriteria: string;

  // Section 7: Recommendation
  recommendation: Recommendation;
  pilotPlan: string;
  reviewDate: string;

  // Metadata
  selectedTemplateId: string | null;
  companyName: string;
  preparedBy: string;
  preparedDate: string;
}

export interface FeasibilityStep {
  id: string;
  title: string;
  description: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const frequencyOptions: { value: Frequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'ad-hoc', label: 'Ad-hoc' },
];

export const pilotDurationOptions: { value: string; label: string }[] = [
  { value: '1 week', label: '1 week' },
  { value: '2 weeks', label: '2 weeks' },
  { value: '4 weeks', label: '4 weeks' },
  { value: '8 weeks', label: '8 weeks' },
];

export const toolOptions: string[] = [
  'Claude Teams',
  'Claude Code',
  'Claude Desktop',
  'Claude Pro',
  'Custom MCP/integration',
];

export const recommendationOptions: {
  value: Recommendation;
  label: string;
  colour: string;
}[] = [
  { value: 'go', label: 'Go', colour: 'text-success' },
  { value: 'no-go', label: 'No-go', colour: 'text-danger' },
  { value: 'conditional', label: 'Conditional', colour: 'text-warning' },
];

export const riskSeverityOptions: {
  value: RiskSeverity;
  label: string;
  colour: string;
}[] = [
  { value: 'low', label: 'Low', colour: 'text-success' },
  { value: 'medium', label: 'Medium', colour: 'text-warning' },
  { value: 'high', label: 'High', colour: 'text-danger' },
];

export const riskCategoryLabels: Record<RiskCategory | 'custom', string> = {
  'data-sensitivity': 'Data Sensitivity',
  quality: 'Quality',
  dependency: 'Dependency',
  adoption: 'Adoption',
  compliance: 'Compliance',
  custom: 'Custom',
};

// ─── Steps ───────────────────────────────────────────────────────────────────

export const feasibilitySteps: FeasibilityStep[] = [
  {
    id: 'use-case',
    title: 'Use Case',
    description: 'Select or describe a use case',
  },
  {
    id: 'current',
    title: 'Current State',
    description: 'Document the current process',
  },
  {
    id: 'proposed',
    title: 'AI Workflow',
    description: 'Describe the AI-assisted approach',
  },
  {
    id: 'benefits',
    title: 'Expected Benefits',
    description: 'Estimate time and cost savings',
  },
  {
    id: 'risks',
    title: 'Risks',
    description: 'Assess risks and mitigations',
  },
  {
    id: 'success',
    title: 'Success Criteria',
    description: 'Define pilot KPIs',
  },
  {
    id: 'recommendation',
    title: 'Recommendation',
    description: 'Go, no-go, or conditional',
  },
];

// ─── Default Risks ───────────────────────────────────────────────────────────

export const defaultRisks: FeasibilityRisk[] = [
  {
    category: 'data-sensitivity',
    description: 'AI processes internal business data during task execution.',
    mitigation:
      'Use Claude Teams (data not used for training). Review data classification per governance policy.',
    severity: 'low',
  },
  {
    category: 'quality',
    description: 'AI output may require human review before use.',
    mitigation:
      'Establish a review step before any AI-generated output is sent externally or committed.',
    severity: 'medium',
  },
  {
    category: 'dependency',
    description: 'Process depends on AI tool availability.',
    mitigation:
      'Maintain ability to complete the task manually. Document the manual fallback process.',
    severity: 'low',
  },
  {
    category: 'adoption',
    description:
      'Team members may not consistently use the AI-assisted workflow.',
    mitigation:
      'Provide training, start with willing early adopters, share results to build confidence.',
    severity: 'medium',
  },
  {
    category: 'compliance',
    description:
      'Ensure AI usage complies with UK GDPR and any industry-specific requirements.',
    mitigation:
      'Review against governance policy (Section 1.5). No personal data processed without justification.',
    severity: 'low',
  },
];

// ─── Form Defaults ───────────────────────────────────────────────────────────

export const feasibilityDefaults: FeasibilityFormData = {
  useCaseName: '',
  currentOwner: '',
  frequency: 'weekly',
  currentProcess: '',
  currentTimePerInstance: '',
  currentCostPerInstance: '',
  qualityIssues: '',
  painPoints: '',
  proposedAiWorkflow: '',
  humanOversight: 'Review all AI output before external use.',
  requiredTools: ['Claude Teams'],
  setupInvestment:
    '1\u20132 hours for prompt development and workflow documentation.',
  timeSavingsEstimate: '',
  costSavingsEstimate: '',
  qualityImprovements: '',
  nonQuantifiableBenefits: '',
  risks: [...defaultRisks],
  successKpis: [],
  minimumAcceptablePerformance: '',
  pilotDuration: '2 weeks',
  goNoGoDecisionCriteria: '',
  recommendation: 'conditional',
  pilotPlan: '',
  reviewDate: '',
  selectedTemplateId: null,
  companyName: '', // initialised from siteConfig.companyName at runtime
  preparedBy: '',
  preparedDate: '', // initialised to today's date at runtime
};

// ─── KPI Suggestions by Category ─────────────────────────────────────────────

export function getDefaultKpisForCategory(category: TaskCategory): string[] {
  switch (category) {
    case 'time-savings':
      return [
        'Reduce task time from [current] to [target] per instance',
        'Save [X] hours per week across the team',
      ];
    case 'error-reduction':
      return [
        'Reduce error rate from [current]% to [target]%',
        'Reduce revision cycles from [current] to [target] per deliverable',
      ];
    case 'throughput':
      return [
        'Increase output from [current] to [target] per week',
        'Reduce time-to-delivery from [current] to [target]',
      ];
    case 'capacity':
      return [
        'Handle [X]% more volume with the same team',
        'Reduce per-unit cost from [current] to [target]',
      ];
    case 'insight':
      return [
        'Reduce analysis time from [current] to [target]',
        'Increase depth of coverage (more sources, more thorough)',
      ];
    default:
      return [];
  }
}

// ─── Pre-population from Task Templates ──────────────────────────────────────

export function getPrePopulationForTemplate(
  templateId: string,
  taskTemplates: TaskTemplate[],
): Partial<FeasibilityFormData> {
  const template = taskTemplates.find((t: TaskTemplate) => t.id === templateId);
  if (!template) return {};

  return {
    useCaseName: template.title,
    currentProcess: template.beforeScenario.process,
    currentTimePerInstance: template.beforeScenario.time,
    currentCostPerInstance: template.beforeScenario.cost,
    proposedAiWorkflow: template.afterScenario.process,
    timeSavingsEstimate: `Estimated reduction from ${template.beforeScenario.time} to ${template.afterScenario.time}`,
    costSavingsEstimate: `Estimated reduction from ${template.beforeScenario.cost} to ${template.afterScenario.cost}`,
    nonQuantifiableBenefits: template.roiHighlight,
    successKpis: getDefaultKpisForCategory(template.category),
    selectedTemplateId: templateId,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format a Date as DD/MM/YYYY (UK format). */
export function formatDateUK(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** Convert a use case name to a URL-safe slug. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
