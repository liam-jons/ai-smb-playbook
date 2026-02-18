import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CalloutCard } from '@/components/content/CalloutCard';
import { CopyButton } from '@/components/content/CopyButton';
import { useSiteConfig } from '@/hooks/useClientConfig';
import { useTrack } from '@/hooks/useTrack';
import { cn } from '@/lib/utils';
import {
  Target,
  ClipboardList,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Download,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { getTaskTemplates, type TaskTemplate } from '@/content/shared/roi-data';
import {
  feasibilityDefaults,
  feasibilitySteps,
  frequencyOptions,
  pilotDurationOptions,
  toolOptions,
  recommendationOptions,
  riskSeverityOptions,
  riskCategoryLabels,
  defaultRisks,
  getPrePopulationForTemplate,
  formatDateUK,
  slugify,
} from '@/content/shared/feasibility-data';
import type {
  FeasibilityFormData,
  FeasibilityRisk,
  Frequency,
  Recommendation,
  RiskSeverity,
} from '@/content/shared/feasibility-data';

// ─── Step Icons ──────────────────────────────────────────────────────────────

const stepIcons: LucideIcon[] = [
  Target,
  ClipboardList,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  FileCheck,
];

// ─── Markdown Export ─────────────────────────────────────────────────────────

function generateFeasibilityMarkdown(
  data: FeasibilityFormData,
  appTitle: string,
): string {
  const or = (v: string) => v.trim() || '[Not provided]';
  const toolList = data.requiredTools.length
    ? data.requiredTools.map((t) => `- ${t}`).join('\n')
    : '- [Not provided]';
  const kpiList = data.successKpis.filter((k) => k.trim()).length
    ? data.successKpis
        .filter((k) => k.trim())
        .map((k, i) => `${i + 1}. ${k}`)
        .join('\n')
    : '1. [Not provided]';
  const riskRows = data.risks
    .map(
      (r) =>
        `| ${riskCategoryLabels[r.category]} | ${r.severity.charAt(0).toUpperCase() + r.severity.slice(1)} | ${or(r.description)} | ${or(r.mitigation)} |`,
    )
    .join('\n');
  const recLabel =
    recommendationOptions.find((o) => o.value === data.recommendation)?.label ??
    data.recommendation;

  return `# AI Use Case Feasibility Study

**Organisation:** ${or(data.companyName)}
**Prepared by:** ${or(data.preparedBy)}
**Date:** ${or(data.preparedDate)}
**Use case:** ${or(data.useCaseName)}

---

## 1. Use Case Summary

| Field | Detail |
|-------|--------|
| Task/process | ${or(data.useCaseName)} |
| Current owner | ${or(data.currentOwner)} |
| Frequency | ${or(data.frequency)} |

### Current Process
${or(data.currentProcess)}

---

## 2. Current State Assessment

| Metric | Value |
|--------|-------|
| Time per instance | ${or(data.currentTimePerInstance)} |
| Cost per instance | ${or(data.currentCostPerInstance)} |

### Quality Issues
${or(data.qualityIssues)}

### Pain Points
${or(data.painPoints)}

---

## 3. Proposed AI-Assisted Workflow

${or(data.proposedAiWorkflow)}

### Human Oversight
${or(data.humanOversight)}

### Required Tools
${toolList}

### Setup Investment
${or(data.setupInvestment)}

---

## 4. Expected Benefits

| Benefit | Estimate |
|---------|----------|
| Time savings | ${or(data.timeSavingsEstimate)} |
| Cost savings | ${or(data.costSavingsEstimate)} |

### Quality Improvements
${or(data.qualityImprovements)}

### Additional Benefits
${or(data.nonQuantifiableBenefits)}

---

## 5. Risks and Mitigations

| Risk | Severity | Description | Mitigation |
|------|----------|-------------|------------|
${riskRows}

---

## 6. Success Criteria

### Key Performance Indicators
${kpiList}

### Minimum Acceptable Performance
${or(data.minimumAcceptablePerformance)}

### Pilot Duration
${or(data.pilotDuration)}

### Go/No-Go Decision Criteria
${or(data.goNoGoDecisionCriteria)}

---

## 7. Recommendation

**Decision:** ${recLabel}

### Pilot Plan
${or(data.pilotPlan)}

### Review Date
${or(data.reviewDate)}

---

*Generated with the ${appTitle} Feasibility Study Tool*
`;
}

// ─── localStorage Persistence ────────────────────────────────────────────────

function getStorageKey(prefix: string) {
  return `${prefix}-feasibility-draft`;
}

interface FeasibilityDraft {
  formData: FeasibilityFormData;
  currentStep: number;
  lastSaved: string;
}

function saveDraft(draft: FeasibilityDraft, storageKey: string): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(draft));
  } catch {
    // localStorage may be full or unavailable
  }
}

function loadDraft(storageKey: string): FeasibilityDraft | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw) as FeasibilityDraft;
  } catch {
    return null;
  }
}

function clearDraft(storageKey: string): void {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // ignore
  }
}

function getRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

// ─── Step Indicator ──────────────────────────────────────────────────────────

function StepIndicator({
  currentStep,
  highestStep,
  onStepClick,
}: {
  currentStep: number;
  highestStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <>
      {/* Desktop indicator — vertical layout: number on top, label below */}
      <ol
        role="list"
        aria-label="Feasibility study steps"
        className="hidden sm:flex items-start gap-1"
      >
        {feasibilitySteps.map((step, i) => {
          const Icon = stepIcons[i];
          const isCompleted = i < highestStep && i !== currentStep;
          const isCurrent = i === currentStep;
          const isClickable = i <= highestStep;

          return (
            <li
              key={step.id}
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
              className="flex min-w-0 flex-1 items-center"
            >
              <button
                type="button"
                onClick={() => onStepClick(i)}
                disabled={!isClickable}
                aria-label={`Step ${i + 1}: ${step.title}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                className={cn(
                  'flex w-full flex-col items-center gap-0.5 rounded-md px-1.5 py-1.5 text-center font-medium motion-safe:transition-colors',
                  isCompleted &&
                    'bg-success-muted text-success-muted-foreground',
                  isCurrent && 'ring-2 ring-primary bg-primary/10 text-primary',
                  !isCompleted && !isCurrent && 'text-muted-foreground',
                  !isClickable && 'opacity-50 cursor-not-allowed',
                )}
              >
                <div className="flex items-center gap-1">
                  {isCompleted ? (
                    <Check
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  )}
                  <span className="text-xs">{i + 1}</span>
                </div>
                <span className="hidden lg:block text-[0.6rem] xl:text-[0.65rem] leading-tight">
                  {step.title}
                </span>
              </button>
              {i < feasibilitySteps.length - 1 && (
                <div
                  className={cn(
                    'mx-0.5 mt-3 h-px flex-1 min-w-1',
                    i < highestStep ? 'bg-success' : 'bg-border',
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile indicator — N81: step X of 7 + progress bar */}
      <div className="flex sm:hidden items-center gap-3">
        <span className="shrink-0 text-sm font-medium text-foreground">
          Step {currentStep + 1}/{feasibilitySteps.length}
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary motion-safe:transition-all motion-safe:duration-300"
            style={{
              width: `${((currentStep + 1) / feasibilitySteps.length) * 100}%`,
            }}
          />
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {feasibilitySteps[currentStep].title}
        </span>
      </div>
    </>
  );
}

// ─── Form Field Helpers ──────────────────────────────────────────────────────

const inputClasses =
  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

function FormField({
  label,
  htmlFor,
  helper,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </Label>
      {children}
      {helper && <p className="mt-1 text-xs text-muted-foreground">{helper}</p>}
    </div>
  );
}

// ─── Step Components ─────────────────────────────────────────────────────────

function Step1UseCaseForm({
  formData,
  updateField,
  onTemplateSelect,
  trackFilteredTemplates,
}: {
  formData: FeasibilityFormData;
  updateField: <K extends keyof FeasibilityFormData>(
    field: K,
    value: FeasibilityFormData[K],
  ) => void;
  onTemplateSelect: (templateId: string | null) => void;
  trackFilteredTemplates: TaskTemplate[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-1.5 block text-sm font-medium text-foreground">
          Start from a template
        </Label>
        <Select
          value={formData.selectedTemplateId ?? 'custom'}
          onValueChange={(v) => onTemplateSelect(v === 'custom' ? null : v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a template or start from scratch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom">Custom use case</SelectItem>
            {trackFilteredTemplates.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.selectedTemplateId && (
          <Badge
            variant="secondary"
            className="mt-2 bg-info-muted text-info-muted-foreground"
          >
            Pre-populated from{' '}
            {trackFilteredTemplates.find(
              (t) => t.id === formData.selectedTemplateId,
            )?.title ?? 'template'}
          </Badge>
        )}
      </div>

      <Separator />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Use case name" htmlFor="fs-use-case-name" required>
          <input
            id="fs-use-case-name"
            type="text"
            value={formData.useCaseName}
            onChange={(e) => updateField('useCaseName', e.target.value)}
            placeholder="e.g. Email Drafting & Replies"
            className={inputClasses}
          />
        </FormField>

        <FormField label="Current owner" htmlFor="fs-current-owner">
          <input
            id="fs-current-owner"
            type="text"
            value={formData.currentOwner}
            onChange={(e) => updateField('currentOwner', e.target.value)}
            placeholder="Role or person responsible"
            className={inputClasses}
          />
        </FormField>

        <FormField label="Frequency" htmlFor="fs-frequency">
          <Select
            value={formData.frequency}
            onValueChange={(v) => updateField('frequency', v as Frequency)}
          >
            <SelectTrigger id="fs-frequency" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {frequencyOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Organisation" htmlFor="fs-company-name">
          <input
            id="fs-company-name"
            type="text"
            value={formData.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
            className={inputClasses}
          />
        </FormField>

        <FormField label="Prepared by" htmlFor="fs-prepared-by">
          <input
            id="fs-prepared-by"
            type="text"
            value={formData.preparedBy}
            onChange={(e) => updateField('preparedBy', e.target.value)}
            placeholder="Your name"
            className={inputClasses}
          />
        </FormField>

        <FormField
          label="Date"
          htmlFor="fs-prepared-date"
          helper="DD/MM/YYYY format"
        >
          <input
            id="fs-prepared-date"
            type="text"
            value={formData.preparedDate}
            onChange={(e) => updateField('preparedDate', e.target.value)}
            placeholder="DD/MM/YYYY"
            className={inputClasses}
          />
        </FormField>
      </div>
    </div>
  );
}

function Step2CurrentStateForm({
  formData,
  updateField,
}: {
  formData: FeasibilityFormData;
  updateField: <K extends keyof FeasibilityFormData>(
    field: K,
    value: FeasibilityFormData[K],
  ) => void;
}) {
  return (
    <div className="space-y-6">
      <FormField
        label="Current process"
        htmlFor="fs-current-process"
        helper="Describe how this task is done today, step by step."
      >
        <Textarea
          id="fs-current-process"
          value={formData.currentProcess}
          onChange={(e) => updateField('currentProcess', e.target.value)}
          placeholder="How is this task currently completed?"
          rows={4}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Time per instance"
          htmlFor="fs-current-time"
          helper="How long does this task currently take?"
        >
          <input
            id="fs-current-time"
            type="text"
            value={formData.currentTimePerInstance}
            onChange={(e) =>
              updateField('currentTimePerInstance', e.target.value)
            }
            placeholder="e.g. 10–20 minutes"
            className={inputClasses}
          />
        </FormField>

        <FormField
          label="Cost per instance"
          htmlFor="fs-current-cost"
          helper="Estimated cost at your hourly rate."
        >
          <input
            id="fs-current-cost"
            type="text"
            value={formData.currentCostPerInstance}
            onChange={(e) =>
              updateField('currentCostPerInstance', e.target.value)
            }
            placeholder="e.g. £6–12"
            className={inputClasses}
          />
        </FormField>
      </div>

      <FormField label="Quality issues" htmlFor="fs-quality-issues">
        <Textarea
          id="fs-quality-issues"
          value={formData.qualityIssues}
          onChange={(e) => updateField('qualityIssues', e.target.value)}
          placeholder="Error rates, revision cycles, consistency problems..."
          rows={3}
        />
      </FormField>

      <FormField label="Pain points" htmlFor="fs-pain-points">
        <Textarea
          id="fs-pain-points"
          value={formData.painPoints}
          onChange={(e) => updateField('painPoints', e.target.value)}
          placeholder="What makes this task frustrating or inefficient?"
          rows={3}
        />
      </FormField>
    </div>
  );
}

function Step3ProposedWorkflowForm({
  formData,
  updateField,
}: {
  formData: FeasibilityFormData;
  updateField: <K extends keyof FeasibilityFormData>(
    field: K,
    value: FeasibilityFormData[K],
  ) => void;
}) {
  const handleToolToggle = (tool: string) => {
    const current = formData.requiredTools;
    if (current.includes(tool)) {
      updateField(
        'requiredTools',
        current.filter((t) => t !== tool),
      );
    } else {
      updateField('requiredTools', [...current, tool]);
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        label="Proposed AI-assisted workflow"
        htmlFor="fs-proposed-workflow"
        helper="How will the task work with AI assistance?"
      >
        <Textarea
          id="fs-proposed-workflow"
          value={formData.proposedAiWorkflow}
          onChange={(e) => updateField('proposedAiWorkflow', e.target.value)}
          placeholder="Describe the new workflow step by step"
          rows={4}
        />
      </FormField>

      <FormField
        label="Human oversight"
        htmlFor="fs-human-oversight"
        helper="What review or approval steps will remain?"
      >
        <Textarea
          id="fs-human-oversight"
          value={formData.humanOversight}
          onChange={(e) => updateField('humanOversight', e.target.value)}
          rows={3}
        />
      </FormField>

      {/* N55: allow text wrapping at narrow viewports, reduce gap for 375px */}
      <div>
        <Label className="mb-2 block text-sm font-medium text-foreground">
          Required tools
        </Label>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {toolOptions.map((tool) => (
            <label
              key={tool}
              className="flex items-center gap-2 text-sm text-foreground cursor-pointer min-w-0"
            >
              <input
                type="checkbox"
                checked={formData.requiredTools.includes(tool)}
                onChange={() => handleToolToggle(tool)}
                className="h-4 w-4 shrink-0 rounded border-input accent-primary"
              />
              <span className="break-words">{tool}</span>
            </label>
          ))}
        </div>
      </div>

      <FormField
        label="Setup investment"
        htmlFor="fs-setup-investment"
        helper="Time and effort needed to set up the AI workflow."
      >
        <Textarea
          id="fs-setup-investment"
          value={formData.setupInvestment}
          onChange={(e) => updateField('setupInvestment', e.target.value)}
          rows={2}
        />
      </FormField>
    </div>
  );
}

function Step4BenefitsForm({
  formData,
  updateField,
}: {
  formData: FeasibilityFormData;
  updateField: <K extends keyof FeasibilityFormData>(
    field: K,
    value: FeasibilityFormData[K],
  ) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Time savings estimate" htmlFor="fs-time-savings">
          <input
            id="fs-time-savings"
            type="text"
            value={formData.timeSavingsEstimate}
            onChange={(e) => updateField('timeSavingsEstimate', e.target.value)}
            placeholder="e.g. Reduce from 20 min to 5 min per instance"
            className={inputClasses}
          />
        </FormField>

        <FormField label="Cost savings estimate" htmlFor="fs-cost-savings">
          <input
            id="fs-cost-savings"
            type="text"
            value={formData.costSavingsEstimate}
            onChange={(e) => updateField('costSavingsEstimate', e.target.value)}
            placeholder="e.g. Reduce from £12 to £3 per instance"
            className={inputClasses}
          />
        </FormField>
      </div>

      <FormField label="Quality improvements" htmlFor="fs-quality-improvements">
        <Textarea
          id="fs-quality-improvements"
          value={formData.qualityImprovements}
          onChange={(e) => updateField('qualityImprovements', e.target.value)}
          placeholder="Expected improvements in consistency, accuracy, or thoroughness"
          rows={3}
        />
      </FormField>

      <FormField
        label="Additional benefits"
        htmlFor="fs-non-quantifiable"
        helper="Non-quantifiable improvements such as team morale, faster response times, or strategic positioning."
      >
        <Textarea
          id="fs-non-quantifiable"
          value={formData.nonQuantifiableBenefits}
          onChange={(e) =>
            updateField('nonQuantifiableBenefits', e.target.value)
          }
          rows={3}
        />
      </FormField>

      <CalloutCard variant="tip" title="Use the ROI Calculator">
        Use the{' '}
        <a
          href="#calculator-heading"
          className="font-semibold text-primary hover:underline"
        >
          ROI Calculator above
        </a>{' '}
        to estimate annual savings for this use case. You can copy the
        calculator output and paste the key figures here.
      </CalloutCard>
    </div>
  );
}

function Step5RisksForm({
  formData,
  updateField,
  track,
}: {
  formData: FeasibilityFormData;
  updateField: <K extends keyof FeasibilityFormData>(
    field: K,
    value: FeasibilityFormData[K],
  ) => void;
  track: string;
}) {
  const updateRisk = (
    index: number,
    field: keyof FeasibilityRisk,
    value: string,
  ) => {
    const updated = [...formData.risks];
    updated[index] = { ...updated[index], [field]: value };
    updateField('risks', updated);
  };

  const addCustomRisk = () => {
    updateField('risks', [
      ...formData.risks,
      {
        category: 'custom' as const,
        description: '',
        mitigation: '',
        severity: 'medium' as const,
      },
    ]);
  };

  const removeRisk = (index: number) => {
    updateField(
      'risks',
      formData.risks.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Review and edit the default risks below. Add custom risks relevant to
        your specific use case.
      </p>

      <div className="space-y-4">
        {formData.risks.map((risk, index) => {
          const isDefault = risk.category !== 'custom';
          return (
            <div
              key={index}
              className="rounded-lg border border-border p-4 space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline" className="text-xs">
                  {riskCategoryLabels[risk.category]}
                </Badge>
                {!isDefault && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRisk(index)}
                    aria-label={`Remove ${risk.category} risk`}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                )}
              </div>

              <FormField label="Description" htmlFor={`fs-risk-desc-${index}`}>
                <Textarea
                  id={`fs-risk-desc-${index}`}
                  value={risk.description}
                  onChange={(e) =>
                    updateRisk(index, 'description', e.target.value)
                  }
                  rows={2}
                />
              </FormField>

              <FormField label="Mitigation" htmlFor={`fs-risk-mit-${index}`}>
                <Textarea
                  id={`fs-risk-mit-${index}`}
                  value={risk.mitigation}
                  onChange={(e) =>
                    updateRisk(index, 'mitigation', e.target.value)
                  }
                  rows={2}
                />
              </FormField>

              <div>
                <Label className="mb-2 block text-sm font-medium text-foreground">
                  Severity
                </Label>
                <RadioGroup
                  value={risk.severity}
                  onValueChange={(v) =>
                    updateRisk(index, 'severity', v as RiskSeverity)
                  }
                  className="flex gap-4"
                  aria-label={`Severity for ${riskCategoryLabels[risk.category]} risk`}
                >
                  {riskSeverityOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-1.5 text-sm cursor-pointer"
                    >
                      <RadioGroupItem
                        value={opt.value}
                        aria-label={`${opt.label} severity`}
                      />
                      <span className={cn('font-medium', opt.colour)}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addCustomRisk}
        className="gap-2"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add custom risk
      </Button>

      <CalloutCard variant="info" title="Governance policy">
        Review the risk tier framework in the{' '}
        <Link
          to={`/${track}/governance`}
          className="font-semibold text-primary hover:underline"
        >
          AI Governance Policy
        </Link>{' '}
        for data sensitivity classification guidance.
      </CalloutCard>
    </div>
  );
}

function Step6SuccessCriteriaForm({
  formData,
  updateField,
}: {
  formData: FeasibilityFormData;
  updateField: <K extends keyof FeasibilityFormData>(
    field: K,
    value: FeasibilityFormData[K],
  ) => void;
}) {
  const addKpi = () => {
    updateField('successKpis', [...formData.successKpis, '']);
  };

  const removeKpi = (index: number) => {
    updateField(
      'successKpis',
      formData.successKpis.filter((_, i) => i !== index),
    );
  };

  const updateKpi = (index: number, value: string) => {
    const updated = [...formData.successKpis];
    updated[index] = value;
    updateField('successKpis', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block text-sm font-medium text-foreground">
          Key performance indicators
        </Label>
        <p className="mb-3 text-xs text-muted-foreground">
          Define measurable outcomes for the pilot. Focus on business results,
          not technical metrics.
        </p>

        <div className="space-y-3">
          {formData.successKpis.map((kpi, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={kpi}
                onChange={(e) => updateKpi(index, e.target.value)}
                placeholder={`KPI ${index + 1}`}
                className={cn(inputClasses, 'flex-1')}
                aria-label={`KPI ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeKpi(index)}
                aria-label={`Remove KPI ${index + 1}`}
                className="h-8 w-8 shrink-0 p-0 text-muted-foreground hover:text-danger"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addKpi}
          className="mt-3 gap-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add KPI
        </Button>
      </div>

      <FormField
        label="Minimum acceptable performance"
        htmlFor="fs-min-performance"
      >
        <Textarea
          id="fs-min-performance"
          value={formData.minimumAcceptablePerformance}
          onChange={(e) =>
            updateField('minimumAcceptablePerformance', e.target.value)
          }
          placeholder="What is the minimum the AI solution needs to achieve to be worth continuing?"
          rows={3}
        />
      </FormField>

      <FormField label="Pilot duration" htmlFor="fs-pilot-duration">
        <Select
          value={formData.pilotDuration}
          onValueChange={(v) => updateField('pilotDuration', v)}
        >
          <SelectTrigger id="fs-pilot-duration" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pilotDurationOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Go/no-go decision criteria" htmlFor="fs-go-nogo">
        <Textarea
          id="fs-go-nogo"
          value={formData.goNoGoDecisionCriteria}
          onChange={(e) =>
            updateField('goNoGoDecisionCriteria', e.target.value)
          }
          placeholder="Under what conditions would you stop, continue, or expand?"
          rows={3}
        />
      </FormField>
    </div>
  );
}

function Step7RecommendationForm({
  formData,
  updateField,
  generatedMarkdown,
}: {
  formData: FeasibilityFormData;
  updateField: <K extends keyof FeasibilityFormData>(
    field: K,
    value: FeasibilityFormData[K],
  ) => void;
  generatedMarkdown: string;
}) {
  const handleDownload = () => {
    const blob = new Blob([generatedMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feasibility-study-${slugify(formData.useCaseName || 'draft')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block text-sm font-medium text-foreground">
          Recommendation
        </Label>
        <RadioGroup
          value={formData.recommendation}
          onValueChange={(v) =>
            updateField('recommendation', v as Recommendation)
          }
          className="flex gap-6"
          aria-label="Recommendation"
        >
          {recommendationOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <RadioGroupItem value={opt.value} aria-label={opt.label} />
              <span className={cn('font-semibold', opt.colour)}>
                {opt.label}
              </span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <FormField label="Pilot plan" htmlFor="fs-pilot-plan">
        <Textarea
          id="fs-pilot-plan"
          value={formData.pilotPlan}
          onChange={(e) => updateField('pilotPlan', e.target.value)}
          placeholder="Who will run the pilot? When does it start? How will results be shared?"
          rows={4}
        />
      </FormField>

      <FormField
        label="Review date"
        htmlFor="fs-review-date"
        helper="DD/MM/YYYY — when the pilot results will be reviewed"
      >
        <input
          id="fs-review-date"
          type="text"
          value={formData.reviewDate}
          onChange={(e) => updateField('reviewDate', e.target.value)}
          placeholder="DD/MM/YYYY"
          className={inputClasses}
        />
      </FormField>

      <Separator />

      {/* Preview — N82: styled monospace card instead of raw <pre> */}
      <div>
        <Label className="mb-2 block text-sm font-medium text-foreground">
          Document preview
        </Label>
        <div
          className="max-h-80 overflow-y-auto rounded-lg border border-border bg-card shadow-sm"
          aria-label="Generated feasibility study preview"
          role="region"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="text-xs text-muted-foreground">Markdown</span>
            <CopyButton
              text={generatedMarkdown}
              ariaLabel="Copy feasibility study preview"
            />
          </div>
          <div className="p-4">
            <pre className="whitespace-pre-wrap text-xs text-foreground font-mono leading-relaxed">
              {generatedMarkdown}
            </pre>
          </div>
        </div>
      </div>

      {/* Export actions */}
      <div className="flex flex-wrap items-center gap-3">
        <CopyButton
          text={generatedMarkdown}
          className="h-auto gap-2 px-3 py-2 opacity-100"
        />
        <span className="text-sm text-muted-foreground">
          Copy feasibility study to clipboard
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download as Markdown
        </Button>
        <span className="text-sm text-muted-foreground">
          {formData.useCaseName
            ? `feasibility-study-${slugify(formData.useCaseName)}.md`
            : 'feasibility-study-draft.md'}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function FeasibilityStudyBuilder() {
  const siteConfig = useSiteConfig();
  const { track } = useTrack();
  const STORAGE_KEY = getStorageKey(siteConfig.localStoragePrefix);
  const [savedDraft] = useState(() => loadDraft(STORAGE_KEY));
  const [step, setStep] = useState(savedDraft?.currentStep ?? 0);
  const [highestStep, setHighestStep] = useState(savedDraft?.currentStep ?? 0);
  const [formData, setFormData] = useState<FeasibilityFormData>(
    () =>
      savedDraft?.formData ?? {
        ...feasibilityDefaults,
        companyName: siteConfig.companyName,
        preparedDate: formatDateUK(new Date()),
      },
  );
  const [isDraftBannerVisible, setIsDraftBannerVisible] =
    useState(!!savedDraft);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const draftLastSaved = savedDraft?.lastSaved ?? '';
  const skipSaveRef = useRef(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const isInitialRender = useRef(true);

  const taskTemplates = useMemo(
    () => getTaskTemplates(siteConfig),
    [siteConfig],
  );
  const trackFilteredTemplates = useMemo(
    () =>
      taskTemplates.filter(
        (t: TaskTemplate) => t.track === 'both' || t.track === track,
      ),
    [taskTemplates, track],
  );

  // Debounced save to localStorage (500ms)
  useEffect(() => {
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      saveDraft(
        {
          formData,
          currentStep: step,
          lastSaved: new Date().toISOString(),
        },
        STORAGE_KEY,
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [formData, step, STORAGE_KEY]);

  // Focus step heading on step transitions (skip initial mount)
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    stepHeadingRef.current?.focus();
  }, [step]);

  // Navigate to a step, tracking the highest visited step
  const goToStep = (newStep: number) => {
    setStep(newStep);
    setHighestStep((prev) => Math.max(prev, newStep));
  };

  const updateField = <K extends keyof FeasibilityFormData>(
    field: K,
    value: FeasibilityFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (templateId: string | null) => {
    if (templateId === null) {
      setFormData({
        ...feasibilityDefaults,
        companyName: siteConfig.companyName,
        preparedDate: formatDateUK(new Date()),
      });
    } else {
      const prePopulated = getPrePopulationForTemplate(
        templateId,
        taskTemplates,
      );
      setFormData((prev) => ({
        ...prev,
        ...prePopulated,
        risks: [...defaultRisks],
      }));
    }
  };

  const handleDiscard = () => {
    clearDraft(STORAGE_KEY);
    skipSaveRef.current = true;
    setFormData({
      ...feasibilityDefaults,
      companyName: siteConfig.companyName,
      preparedDate: formatDateUK(new Date()),
    });
    setStep(0);
    setHighestStep(0);
    setIsDraftBannerVisible(false);
    setShowDiscardDialog(false);
  };

  const handleReset = () => {
    clearDraft(STORAGE_KEY);
    skipSaveRef.current = true;
    setFormData({
      ...feasibilityDefaults,
      companyName: siteConfig.companyName,
      preparedDate: formatDateUK(new Date()),
    });
    setStep(0);
    setHighestStep(0);
  };

  const generatedMarkdown = useMemo(
    () => generateFeasibilityMarkdown(formData, siteConfig.appTitle),
    [formData, siteConfig.appTitle],
  );

  const goNext = () => {
    if (step < feasibilitySteps.length - 1) {
      goToStep(step + 1);
    }
  };

  const goPrev = () => {
    if (step > 0) {
      goToStep(step - 1);
    }
  };

  const currentStepDef = feasibilitySteps[step];

  return (
    <div className="space-y-6">
      {/* Draft recovery banner */}
      {isDraftBannerVisible && (
        <CalloutCard variant="info" title="Saved draft found">
          You have an unsaved feasibility study draft from{' '}
          <strong>{getRelativeTime(draftLastSaved)}</strong>.
          <div className="mt-3 flex gap-3">
            <Button size="sm" onClick={() => setIsDraftBannerVisible(false)}>
              Resume
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDiscardDialog(true)}
            >
              Discard
            </Button>
          </div>
        </CalloutCard>
      )}

      <StepIndicator
        currentStep={step}
        highestStep={highestStep}
        onStepClick={goToStep}
      />

      {/* Step content with entrance animation on step transitions */}
      <div aria-live="polite" aria-atomic="true">
        <h3
          ref={stepHeadingRef}
          tabIndex={-1}
          className="mb-1 text-base font-semibold text-foreground outline-none"
        >
          {currentStepDef.title}
        </h3>
        <p className="mb-5 text-sm text-muted-foreground">
          {currentStepDef.description}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 && (
              <Step1UseCaseForm
                formData={formData}
                updateField={updateField}
                onTemplateSelect={handleTemplateSelect}
                trackFilteredTemplates={trackFilteredTemplates}
              />
            )}
            {step === 1 && (
              <Step2CurrentStateForm
                formData={formData}
                updateField={updateField}
              />
            )}
            {step === 2 && (
              <Step3ProposedWorkflowForm
                formData={formData}
                updateField={updateField}
              />
            )}
            {step === 3 && (
              <Step4BenefitsForm
                formData={formData}
                updateField={updateField}
              />
            )}
            {step === 4 && (
              <Step5RisksForm
                formData={formData}
                updateField={updateField}
                track={track}
              />
            )}
            {step === 5 && (
              <Step6SuccessCriteriaForm
                formData={formData}
                updateField={updateField}
              />
            )}
            {step === 6 && (
              <Step7RecommendationForm
                formData={formData}
                updateField={updateField}
                generatedMarkdown={generatedMarkdown}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation — N24: reduced top padding to bring closer to content on mobile */}
      <div className="flex items-center justify-between pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={goPrev}
          disabled={step === 0}
          className="gap-1.5"
          aria-label={
            step > 0
              ? `Go to previous step: ${feasibilitySteps[step - 1].title}`
              : 'No previous step'
          }
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {/* N80: "Start over" available from any step (not just step 7) */}
          {step > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDiscardDialog(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              Start over
            </Button>
          )}

          {step === feasibilitySteps.length - 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-1.5"
            >
              Start a new study
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={goNext}
              className="gap-1.5"
              aria-label={`Go to next step: ${feasibilitySteps[step + 1]?.title ?? ''}`}
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      {/* Discard confirmation dialog */}
      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard draft?</DialogTitle>
            <DialogDescription>
              This will permanently delete your saved feasibility study draft.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDiscardDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDiscard}>
              Discard draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
