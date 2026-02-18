import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalloutCard } from '@/components/content/CalloutCard';
import { CopyButton } from '@/components/content/CopyButton';
import { useSiteConfig } from '@/hooks/useClientConfig';
import { useTrack } from '@/hooks/useTrack';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  TrendingUp,
  Calculator,
  Target,
  AlertCircle,
  Layers,
  ListChecks,
  ArrowRight,
  FileText,
  Compass,
} from 'lucide-react';
import { FeasibilityStudyBuilder } from '@/content/general/FeasibilityStudyBuilder';
import {
  calculatorDefaults,
  getTaskTemplates,
  valueFrameworks,
  measurementMistakes,
  gettingStartedSteps,
  kpiFramework,
  categoryFilters,
  getCategoryColour,
} from '@/content/shared/roi-data';
import type { TaskCategory, TaskTemplate } from '@/content/shared/roi-data';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatGBP(value: number): string {
  return `£${value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatPercent(value: number): string {
  if (!isFinite(value)) return '—';
  return `${value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}%`;
}

function generateExportText(
  hoursSaved: number,
  hourlyRate: number,
  toolCost: number,
  teamSize: number,
  monthlyGross: number,
  monthlyCost: number,
  monthlyNet: number,
  annualNet: number,
  roiPercent: number,
  paybackDays: number,
  appTitle: string,
): string {
  const days = Math.round(paybackDays);
  return [
    'AI ROI Estimate',
    '═══════════════',
    '',
    'Inputs:',
    `  Hours saved per week:     ${hoursSaved}`,
    `  Hourly rate:              £${hourlyRate}`,
    `  AI tool cost/month:       £${toolCost}`,
    `  Team members:             ${teamSize}`,
    '',
    'Results:',
    `  Monthly gross savings:    ${formatGBP(monthlyGross)}`,
    `  Monthly AI cost:          ${formatGBP(monthlyCost)}`,
    `  Monthly net savings:      ${formatGBP(monthlyNet)}`,
    `  Annual net savings:       ${formatGBP(annualNet)}`,
    `  ROI:                      ${formatPercent(roiPercent)}`,
    `  Payback period:           ${days} ${days === 1 ? 'day' : 'days'}`,
    '',
    `Generated with the ${appTitle} ROI Calculator`,
  ].join('\n');
}

// ─── ROI Calculator ──────────────────────────────────────────────────────────

function RoiCalculator() {
  const siteConfig = useSiteConfig();
  const [hoursSaved, setHoursSaved] = useState(
    calculatorDefaults.defaultHoursSavedPerWeek,
  );
  const [hourlyRate, setHourlyRate] = useState(
    calculatorDefaults.defaultHourlyRate,
  );
  const [toolCost, setToolCost] = useState(
    calculatorDefaults.defaultToolCostPerMonth,
  );
  const [teamSize, setTeamSize] = useState(calculatorDefaults.defaultTeamSize);

  const monthlyGross = hoursSaved * 4.33 * hourlyRate * teamSize;
  const monthlyCost = toolCost * teamSize;
  const monthlyNet = monthlyGross - monthlyCost;
  const annualNet = monthlyNet * 12;
  const roiPercent =
    monthlyCost > 0 ? ((monthlyGross - monthlyCost) / monthlyCost) * 100 : 0;
  const paybackDays =
    monthlyGross > 0 ? Math.round((monthlyCost / monthlyGross) * 30) : 0;
  const roundedDays = Math.round(paybackDays);
  const isPositive = monthlyNet >= 0;

  const exportText = generateExportText(
    hoursSaved,
    hourlyRate,
    toolCost,
    teamSize,
    monthlyGross,
    monthlyCost,
    monthlyNet,
    annualNet,
    roiPercent,
    paybackDays,
    siteConfig.appTitle,
  );

  return (
    <div className="space-y-6 rounded-xl border-2 border-primary/10 bg-card p-5 sm:p-6">
      {/* Inputs */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="hours-saved"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Hours saved per week:{' '}
            <span className="font-semibold tabular-nums">{hoursSaved}</span>
          </label>
          <input
            id="hours-saved"
            type="range"
            min={calculatorDefaults.hoursSavedMin}
            max={calculatorDefaults.hoursSavedMax}
            step={1}
            value={hoursSaved}
            onChange={(e) => setHoursSaved(Number(e.target.value))}
            aria-valuetext={`${hoursSaved} hours per week`}
            className="w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{calculatorDefaults.hoursSavedMin}h</span>
            <span>{calculatorDefaults.hoursSavedMax}h</span>
          </div>
        </div>

        <div>
          <label
            htmlFor="hourly-rate"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Approximate hourly cost (£)
          </label>
          <input
            id="hourly-rate"
            type="number"
            min={calculatorDefaults.hourlyRateMin}
            max={calculatorDefaults.hourlyRateMax}
            step={calculatorDefaults.hourlyRateStep}
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm tabular-nums ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Divide annual salary by ~1,950 hours. Default £35/hr suits most
            roles.
          </p>
        </div>

        <div>
          <label
            htmlFor="tool-cost"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            AI tool cost per person per month (£)
          </label>
          <input
            id="tool-cost"
            type="number"
            min={calculatorDefaults.toolCostMin}
            max={calculatorDefaults.toolCostMax}
            step={calculatorDefaults.toolCostStep}
            value={toolCost}
            onChange={(e) => setToolCost(Number(e.target.value))}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm tabular-nums ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Claude Teams is roughly £20/person/month.
          </p>
        </div>

        <div>
          <label
            htmlFor="team-size"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Team members:{' '}
            <span className="font-semibold tabular-nums">{teamSize}</span>
          </label>
          <input
            id="team-size"
            type="range"
            min={calculatorDefaults.teamSizeMin}
            max={calculatorDefaults.teamSizeMax}
            step={1}
            value={teamSize}
            onChange={(e) => setTeamSize(Number(e.target.value))}
            aria-valuetext={`${teamSize} team ${teamSize === 1 ? 'member' : 'members'}`}
            className="w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{calculatorDefaults.teamSizeMin}</span>
            <span>{calculatorDefaults.teamSizeMax}</span>
          </div>
        </div>
      </div>

      {/* Outputs — N13: text-sm labels, N28: grid-cols-2 always to reduce vertical space */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="grid grid-cols-2 gap-3"
      >
        <div className="rounded-lg border border-border bg-muted/50 p-3 sm:p-4">
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Monthly net savings
          </span>
          <p
            className={cn(
              'mt-1 text-xl font-bold tabular-nums sm:text-2xl',
              isPositive ? 'text-success' : 'text-danger',
            )}
          >
            {formatGBP(monthlyNet)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted/50 p-3 sm:p-4">
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Annual net savings
          </span>
          <p
            className={cn(
              'mt-1 text-xl font-bold tabular-nums sm:text-2xl',
              isPositive ? 'text-success' : 'text-danger',
            )}
          >
            {formatGBP(annualNet)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted/50 p-3 sm:p-4">
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Return on investment
          </span>
          <p
            className={cn(
              'mt-1 text-xl font-bold tabular-nums sm:text-2xl',
              isPositive ? 'text-success' : 'text-danger',
            )}
          >
            {formatPercent(roiPercent)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted/50 p-3 sm:p-4">
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Monthly breakeven
          </span>
          <p className="mt-1 text-xl font-bold tabular-nums text-foreground sm:text-2xl">
            {roundedDays} {roundedDays === 1 ? 'day' : 'days'}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Cost covered within each month
          </p>
        </div>
      </div>

      {/* N72: contextual note about default values */}
      <p className="text-xs text-muted-foreground italic">
        Adjust these values to match your situation &mdash; the defaults are
        starting points, not guarantees.
      </p>

      {/* Export — N34: more prominent button, N46: descriptive aria-label */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => navigator.clipboard.writeText(exportText)}
          aria-label="Copy ROI calculator results to clipboard for your business case"
        >
          <Calculator className="h-4 w-4" aria-hidden="true" />
          Copy for your business case
        </Button>
      </div>
    </div>
  );
}

// ─── Task Template Card ──────────────────────────────────────────────────────

function TaskTemplateCard({
  template,
  track,
}: {
  template: TaskTemplate;
  track: string;
}) {
  const siteConfig = useSiteConfig();
  const [open, setOpen] = useState(false);
  const badgeColour = getCategoryColour(template.category);
  const categoryLabel =
    categoryFilters.find((f) => f.value === template.category)?.label ?? '';

  const summaryText = [
    `${template.title}`,
    `Category: ${categoryLabel}`,
    `Before: ${template.beforeScenario.time} — ${template.beforeScenario.process}`,
    `After: ${template.afterScenario.time} — ${template.afterScenario.process}`,
    `ROI: ${template.roiHighlight}`,
  ].join('\n');

  return (
    <div className="flex flex-col rounded-lg border border-border p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span
            className={cn(
              'mb-1.5 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
              badgeColour,
            )}
          >
            {categoryLabel}
          </span>
          <h4 className="text-sm font-semibold text-foreground">
            {template.title}
          </h4>
        </div>
        <CopyButton
          text={summaryText}
          ariaLabel={`Copy ${template.title} summary`}
        />
      </div>

      {/* Before / After comparison — N45: role="group" + aria-label, N14: leading-relaxed */}
      <div className="grid gap-2 sm:grid-cols-2">
        <div
          role="group"
          aria-label={`${template.title} before AI`}
          className="rounded-md bg-danger-muted/30 px-3 py-2.5"
        >
          <span className="text-xs font-medium text-danger-muted-foreground">
            Before
          </span>
          <p className="mt-1 text-sm font-medium leading-relaxed tabular-nums text-foreground">
            {template.beforeScenario.time}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed tabular-nums text-muted-foreground">
            {template.beforeScenario.cost}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {template.beforeScenario.process}
          </p>
        </div>
        <div
          role="group"
          aria-label={`${template.title} after AI`}
          className="rounded-md bg-success-muted/30 px-3 py-2.5"
        >
          <span className="text-xs font-medium text-success-muted-foreground">
            After
          </span>
          <p className="mt-1 text-sm font-medium leading-relaxed tabular-nums text-foreground">
            {template.afterScenario.time}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed tabular-nums text-muted-foreground">
            {template.afterScenario.cost}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {template.afterScenario.process}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm font-medium text-foreground">
        {template.roiHighlight}
      </p>

      {/* Client example + related section — N44: aria-expanded handled by Radix Collapsible */}
      {(template.clientExample || template.relatedSection) && (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger
            className="mt-2 flex w-full items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            aria-expanded={open}
          >
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-200',
                open && 'rotate-180',
              )}
              aria-hidden="true"
            />
            {template.clientExample
              ? `${siteConfig.companyName} example & related section`
              : 'Related section'}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 space-y-2">
              {template.clientExample && (
                <div className="rounded-md border-l-2 border-accent-foreground/20 bg-muted/30 px-4 py-3">
                  <span className="text-xs font-medium text-muted-foreground">
                    {template.clientExample.title}
                  </span>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">
                    {template.clientExample.description}
                  </p>
                </div>
              )}
              {template.relatedSection && (
                <Link
                  to={`/${track}/${template.relatedSection}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Go to related section
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

// Shared entrance animation props
const sectionEntrance = {
  initial: { opacity: 0, y: 16 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
};

export function RoiMeasurementSection() {
  const siteConfig = useSiteConfig();
  const { track } = useTrack();
  const isDev = track === 'developer';
  const taskTemplates = useMemo(
    () => getTaskTemplates(siteConfig),
    [siteConfig],
  );
  // N9: default to first category ('time-savings') instead of 'all' to avoid overwhelming the user
  const [activeCategory, setActiveCategory] = useState<TaskCategory | 'all'>(
    'time-savings',
  );

  // Auto-expand the feasibility study collapsible when a saved draft exists
  const hasFeasibilityDraft = useMemo(() => {
    try {
      return !!localStorage.getItem(
        `${siteConfig.localStoragePrefix}-feasibility-draft`,
      );
    } catch {
      return false;
    }
  }, [siteConfig.localStoragePrefix]);

  const trackFilteredTemplates = useMemo(
    () => taskTemplates.filter((t) => t.track === 'both' || t.track === track),
    [taskTemplates, track],
  );

  const filteredTemplates = useMemo(
    () =>
      activeCategory === 'all'
        ? trackFilteredTemplates
        : trackFilteredTemplates.filter((t) => t.category === activeCategory),
    [activeCategory, trackFilteredTemplates],
  );

  const checklistText = gettingStartedSteps
    .map((s) => `${s.number}. ${s.title}\n   ${s.description}`)
    .join('\n\n');

  return (
    <div className="space-y-6">
      {/* 1. Why Measure? */}
      <motion.section
        aria-labelledby="why-measure-heading"
        {...sectionEntrance}
      >
        <h2
          id="why-measure-heading"
          className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Measuring What AI Actually Saves You
        </h2>
        <div className="space-y-3 max-w-prose">
          <p className="text-base leading-relaxed text-foreground">
            Most teams know AI is saving them time, but struggle to put a number
            on it. Without that number, it is harder to justify renewing
            licences, expanding to new team members, or knowing which tasks
            benefit most from AI.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Below are three practical tools to help you build the case:
          </p>
          <ul className="space-y-1.5 text-sm text-muted-foreground list-none">
            <li className="flex items-start gap-2">
              <Calculator
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>
                <strong className="text-foreground">ROI Calculator</strong>{' '}
                &mdash; plug in your hours saved and team size to see projected
                annual savings in pounds.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Target
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>
                <strong className="text-foreground">Task Templates</strong>{' '}
                &mdash; before/after comparisons for common SMB tasks, with
                copy-ready summaries for your business case.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <TrendingUp
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span>
                <strong className="text-foreground">
                  Measurement Frameworks
                </strong>{' '}
                &mdash; three approaches to valuing AI adoption, from quick
                breakeven checks to long-term strategic value.
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
      </motion.section>

      <Separator />

      {/* 2. ROI Calculator */}
      <motion.section aria-labelledby="calculator-heading" {...sectionEntrance}>
        <div className="mb-1 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2
            id="calculator-heading"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            ROI Calculator
          </h2>
        </div>
        <p className="mb-5 max-w-prose text-sm text-muted-foreground">
          Plug in your numbers to see projected annual savings in pounds.
        </p>

        <RoiCalculator />
      </motion.section>

      <Separator />

      {/* 3. Task Templates */}
      <motion.section aria-labelledby="templates-heading" {...sectionEntrance}>
        <div className="mb-1 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2
            id="templates-heading"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Task ROI Templates
          </h2>
        </div>
        <p className="mb-5 max-w-prose text-sm text-muted-foreground">
          Real before/after comparisons for common SMB tasks. Pick a category to
          see the ones most relevant to your team.
        </p>

        {/* I25: flex-wrap + gap ensures tabs don't overlap cards on mobile */}
        <Tabs
          value={activeCategory}
          onValueChange={(v) => setActiveCategory(v as TaskCategory | 'all')}
          className="mb-5"
        >
          <TabsList className="flex h-auto gap-1 overflow-x-auto p-1 pb-2 sm:flex-wrap sm:overflow-visible sm:pb-1">
            {categoryFilters.map((filter) => (
              <TabsTrigger
                key={filter.value}
                value={filter.value}
                className="shrink-0 whitespace-nowrap"
              >
                {filter.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* N23: auto-rows-fr ensures even card heights within each row */}
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
          {filteredTemplates.map((template) => (
            <TaskTemplateCard
              key={template.id}
              template={template}
              track={track}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No templates in this category.
          </p>
        )}
      </motion.section>

      <Separator />

      {/* 3.5. Feasibility Study Builder — N22: consistent spacing */}
      <motion.section
        aria-labelledby="feasibility-heading"
        {...sectionEntrance}
      >
        <Collapsible defaultOpen={hasFeasibilityDraft}>
          <CollapsibleTrigger className="group flex w-full items-start gap-3 rounded-lg border border-border p-4 text-left hover:bg-muted/50 transition-colors">
            <FileText
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <h2
                id="feasibility-heading"
                className="text-lg font-semibold tracking-tight"
              >
                Build a Feasibility Study
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Turn a task template into a professional business case document.
                This tool formalises Step 1 of the Getting Started checklist
                &mdash; pick a task, build the case, run the pilot.
              </p>
            </div>
            <ChevronDown
              className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 rounded-lg border border-border p-5">
              <FeasibilityStudyBuilder />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </motion.section>

      <Separator />

      {/* 4. Measurement Frameworks */}
      <motion.section aria-labelledby="frameworks-heading" {...sectionEntrance}>
        <div className="mb-1 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2
            id="frameworks-heading"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Measurement Frameworks
          </h2>
        </div>
        <p className="mb-5 max-w-prose text-sm text-muted-foreground">
          Three complementary approaches to valuing AI adoption &mdash; choose
          the one that best fits your audience and goals.
        </p>

        <Accordion type="single" collapsible className="space-y-1">
          {valueFrameworks.map((fw) => (
            <AccordionItem
              key={fw.id}
              value={fw.id}
              className="rounded-lg border border-border px-4"
            >
              <AccordionTrigger className="text-sm font-medium hover:no-underline sm:text-base">
                {fw.title}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4 pt-1">
                <p className="text-sm font-medium text-foreground">
                  {fw.summary}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {fw.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
                        aria-hidden="true"
                      />
                      {detail}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.section>

      <Separator />

      {/* 5. Common Mistakes */}
      <motion.section aria-labelledby="mistakes-heading" {...sectionEntrance}>
        <div className="mb-1 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2
            id="mistakes-heading"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Common Measurement Mistakes
          </h2>
        </div>
        <p className="mb-5 max-w-prose text-sm text-muted-foreground">
          Six pitfalls that undermine ROI calculations &mdash; and how to avoid
          them.
        </p>

        <Accordion type="single" collapsible className="space-y-1">
          {measurementMistakes.map((mistake) => (
            <AccordionItem
              key={mistake.id}
              value={mistake.id}
              className="rounded-lg border border-border px-4"
            >
              <AccordionTrigger className="text-sm font-medium hover:no-underline sm:text-base">
                {mistake.title}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4 pt-1">
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-danger-muted-foreground">
                    Problem
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {mistake.problem}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium uppercase tracking-wider text-success-muted-foreground">
                    Fix
                  </span>
                  <p className="mt-1 text-sm text-foreground">{mistake.fix}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.section>

      {/* 6. S-O-T KPI Framework (developer only) */}
      {isDev && (
        <>
          <Separator />
          <motion.section aria-labelledby="kpi-heading" {...sectionEntrance}>
            <div className="mb-1 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2
                id="kpi-heading"
                className="text-xl font-semibold tracking-tight sm:text-2xl"
              >
                System &ndash; Operational &ndash; Technical KPI Framework
              </h2>
            </div>
            <p className="mb-5 max-w-prose text-sm text-muted-foreground">
              A three-layer approach to measuring AI impact at different
              organisational levels. System KPIs justify investment to
              leadership; operational KPIs track team adoption; technical KPIs
              measure developer-specific gains.
            </p>

            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
              {kpiFramework.map((layer) => (
                <div
                  key={layer.id}
                  className="rounded-lg border border-border p-4"
                >
                  <h3 className="mb-1 text-sm font-semibold text-foreground">
                    {layer.label}
                  </h3>
                  <p className="mb-3 text-xs text-muted-foreground">
                    {layer.description}
                  </p>
                  <ul className="space-y-1.5">
                    {layer.metrics.map((metric, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40"
                          aria-hidden="true"
                        />
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>
        </>
      )}

      <Separator />

      {/* 7. Getting Started — N85: larger, more visible step circles */}
      <motion.section
        aria-labelledby="getting-started-heading"
        {...sectionEntrance}
      >
        <div className="mb-1 flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2
            id="getting-started-heading"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Getting Started: Five Steps to Measuring ROI
          </h2>
        </div>
        <p className="mb-5 max-w-prose text-sm text-muted-foreground">
          A practical checklist you can start this week &mdash; no special tools
          required.
        </p>

        <div className="space-y-3">
          {gettingStartedSteps.map((step) => (
            <div
              key={step.number}
              className="flex items-start gap-4 rounded-lg border border-border px-4 py-4"
            >
              {/* N85: increased size from h-8/w-8 to h-10/w-10, stronger bg */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/30">
                <span className="text-base font-bold text-primary">
                  {step.number}
                </span>
              </div>
              <div className="min-w-0">
                <span className="text-sm font-semibold text-foreground">
                  {step.title}
                </span>
                <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <CopyButton
            text={checklistText}
            className="h-auto gap-2 px-3 py-2 opacity-100"
            ariaLabel="Copy getting started checklist to clipboard"
          />
          <span className="text-sm text-muted-foreground">Copy checklist</span>
        </div>
      </motion.section>

      {/* 8. Cross-references — N1: add icon to heading */}
      <Separator />
      <motion.section
        aria-labelledby="roi-cross-ref-heading"
        {...sectionEntrance}
      >
        <div className="mb-4 flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2
            id="roi-cross-ref-heading"
            className="text-lg font-semibold tracking-tight"
          >
            Related Sections
          </h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <Link
              to={`/${track}/sessions`}
              className="font-semibold text-primary hover:underline"
            >
              Session Management
            </Link>{' '}
            &mdash; structuring conversations for measurable output
          </p>
          <p>
            <Link
              to={`/${track}/governance`}
              className="font-semibold text-primary hover:underline"
            >
              AI Governance Policy
            </Link>{' '}
            &mdash; responsible AI spend and compliance
          </p>
          <p>
            <Link
              to={`/${track}/recurring-tasks`}
              className="font-semibold text-primary hover:underline"
            >
              Recurring &amp; Scheduled Tasks
            </Link>{' '}
            &mdash; automating repetitive work (a major source of ROI)
          </p>
          {isDev && (
            <>
              <p>
                <Link
                  to={`/${track}/claude-md`}
                  className="font-semibold text-primary hover:underline"
                >
                  CLAUDE.md Files
                </Link>{' '}
                &mdash; developer productivity configuration
              </p>
              <p>
                <Link
                  to={`/${track}/regression-testing`}
                  className="font-semibold text-primary hover:underline"
                >
                  AI-Driven Regression Testing
                </Link>{' '}
                &mdash; testing ROI and tool replacement
              </p>
              <p>
                <Link
                  to={`/${track}/technical-debt`}
                  className="font-semibold text-primary hover:underline"
                >
                  Codebase Auditing &amp; Technical Debt
                </Link>{' '}
                &mdash; assessment and remediation gains
              </p>
            </>
          )}
        </div>
      </motion.section>
    </div>
  );
}
