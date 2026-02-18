import { useState } from 'react';
import { Link } from 'react-router';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { PromptExample } from '@/components/content/PromptExample';
import { CalloutCard } from '@/components/content/CalloutCard';
import { useTrack } from '@/hooks/useTrack';
import { useSiteConfig } from '@/hooks/useClientConfig';
import type { SiteConfigData } from '@/config/client-config-schema';
import { cn } from '@/lib/utils';
import {
  Globe2,
  RefreshCw,
  Zap,
  ChevronDown,
  PlayCircle,
  ListChecks,
  Search,
  type LucideIcon,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AutomationPattern {
  id: string;
  number: number;
  name: string;
  audience: string;
  audienceColour: string;
  description: string;
  howItWorks: string[];
  clientExample: {
    title: string;
    description: string;
  };
  additionalExamples?: {
    title: string;
    description: string;
  }[];
  whenToUse: string;
  limitations?: string[];
  icon: LucideIcon;
}

interface Limitation {
  title: string;
  description: string;
}

interface GettingStartedStep {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

// ─── Data ────────────────────────────────────────────────────────────────────

function getAutomationPatterns(config: SiteConfigData): AutomationPattern[] {
  const reportDataSource = config.reportDataSource ?? 'data source';
  const complianceStakeholders =
    config.complianceStakeholders ?? 'stakeholders';
  const clientOnboardingType = config.clientOnboardingType ?? 'client project';
  return [
    {
      id: 'manual-trigger',
      number: 1,
      name: 'Manual Trigger, Automated Execution',
      audience: 'Everyone',
      audienceColour: 'bg-success-muted text-success-muted-foreground',
      description:
        'The simplest and most reliable pattern. You start the task manually (open Claude, paste a prompt or invoke a skill), and Claude handles the complex execution.',
      howItWorks: [
        'Create a detailed skill or prompt that defines the full workflow',
        'When you want to run it, open a new Claude session and trigger it',
        'Claude executes the multi-step task: gathering data, analysing, formatting output, and presenting results',
      ],
      clientExample: {
        title: 'Weekly training report',
        description: `A skill that reviews the ${reportDataSource}, summarises completion rates, flags any overdue training, and formats a report for the ${complianceStakeholders}. You run this weekly by opening Claude, pointing it at the latest export, and asking it to generate the report. The intelligence is in the skill; your effort is limited to triggering it and providing the data.`,
      },
      whenToUse:
        'Any recurring task where the execution is complex but the trigger can be manual. This covers the majority of current use cases.',
      icon: PlayCircle,
    },
    {
      id: 'browser-automation',
      number: 2,
      name: 'Browser Automation via CoWork',
      audience: 'Everyone',
      audienceColour: 'bg-success-muted text-success-muted-foreground',
      description:
        "CoWork is Anthropic's browser automation environment — it lets Claude control a web browser to complete tasks on websites. CoWork can interact with web interfaces, fill forms, extract data, and navigate multi-step processes.",
      howItWorks: [
        'CoWork operates a browser session that Claude controls \u2014 when the browser is under AI control, the border displays an orange hue',
        'Instruct Claude to visit a website, navigate to specific pages, extract data, and compile results',
        'Particularly useful for monitoring tasks where the data lives in a web interface rather than a file',
      ],
      clientExample: {
        title: 'Website accessibility monitoring',
        description:
          'A CoWork session that visits a set of client websites, runs a quick accessibility check, and compiles the results into a summary. Useful for the "Accessibility as a Service" offering \u2014 regular checks on client sites.',
      },
      additionalExamples: [
        {
          title: 'Deal / opportunity monitoring',
          description:
            'As discussed during the training: a CoWork workflow that checks a pipeline tool or inbox for new opportunities, and flags anything requiring attention. The same pattern applies to any web-based dashboard or inbox where you need regular visibility without logging in manually.',
        },
      ],
      whenToUse:
        'When the data you need lives in a web application and there is no API or export. CoWork is the bridge between "I need to check this website regularly" and "Claude can read and process the information".',
      limitations: [
        'CoWork sessions are not persistent \u2014 they do not run in the background',
        'Browser automation can break if the target website changes its layout',
        'Credentials must be provided carefully (use existing password management practices)',
      ],
      icon: Globe2,
    },
    {
      id: 'self-updating',
      number: 3,
      name: 'Self-Updating Skills',
      audience: 'Everyone',
      audienceColour: 'bg-success-muted text-success-muted-foreground',
      description:
        'Skills can be designed to update their own content based on new information. This creates a pattern where running a skill produces an improved version of itself.',
      howItWorks: [
        'A skill includes instructions to review its own output and compare against previous runs',
        'Each time you run the skill, it incorporates what it learnt from the last run',
        'This creates a feedback loop: the skill gets better and more tailored over time',
      ],
      clientExample: {
        title: 'Client onboarding checklist',
        description: `A skill that walks through the steps for setting up a new ${clientOnboardingType}. Each time it is used, the person running it can note any steps that were missing or wrong. The skill's final action is to update the checklist template based on that feedback. Over time, the onboarding process becomes more complete and accurate without anyone maintaining a separate document.`,
      },
      whenToUse:
        'For any process that benefits from incremental improvement. The skill is both the executor and the maintainer.',
      icon: RefreshCw,
    },
    {
      id: 'external-trigger',
      number: 4,
      name: 'External Trigger + Claude Execution',
      audience: 'With dev support',
      audienceColour: 'bg-important-muted text-important-muted-foreground',
      description:
        'For teams with some technical capability, external scheduling tools can trigger Claude tasks. The schedule lives outside Claude; the intelligence lives inside Claude.',
      howItWorks: [
        'An external system (cron job, CI/CD pipeline, task scheduler, or webhook) triggers a Claude Code session or API call at a set time',
        'Claude receives the context and executes the defined workflow',
        'Results can be written to files, sent via email, or posted to a channel',
      ],
      clientExample: {
        title: 'Automated code quality check',
        description:
          'A GitHub Actions workflow that runs nightly, invoking Claude Code to review recent commits against coding standards and generate a summary. The concept applies broadly: the schedule lives outside Claude, the intelligence lives inside Claude.',
      },
      whenToUse:
        'When you need genuine scheduled execution (not just manual triggering). Requires some developer involvement to set up the external trigger. For implementation details, see the Developer track.',
      icon: Zap,
    },
  ];
}

const currentLimitations: Limitation[] = [
  {
    title: 'Background monitoring',
    description:
      'Claude cannot watch a website, inbox, or data source continuously and alert you when something changes. Each session is initiated by a user or an external trigger.',
  },
  {
    title: 'True cron scheduling within Claude',
    description:
      'There is no "schedule this task" button in Claude Desktop or claude.ai. You cannot tell Claude "run this every Friday at 15:00" and have it happen automatically.',
  },
  {
    title: 'Persistent sessions',
    description:
      'Claude sessions are stateful while open but do not persist across restarts. You cannot leave a monitoring task "running" overnight.',
  },
  {
    title: 'Cross-session memory for recurring tasks',
    description:
      'Whilst Claude has a memory feature, it does not automatically remember that you ran a specific task last week and that it should run again this week. You need to trigger it.',
  },
];

function getGettingStartedStepsGeneral(
  config: SiteConfigData,
): GettingStartedStep[] {
  return [
    {
      number: 1,
      title: 'Identify your recurring tasks',
      description: `What do you do weekly, monthly, or after specific events that involves gathering data, summarising, or formatting? Examples from ${config.companyShortName}: ${config.exampleRecurringTasks.join(', ')}.`,
      icon: Search,
    },
    {
      number: 2,
      title: 'Build a skill for each one',
      description:
        'Write the workflow as a Claude skill (see Section 1.4 for how skills work, see the Starter Kit for examples). Test it manually a few times and refine.',
      icon: ListChecks,
    },
    {
      number: 3,
      title: 'Create a "run book" prompt',
      description:
        'For each recurring task, write a trigger prompt that you paste into Claude to kick off the workflow. Store these prompts somewhere accessible to the team (a shared document, a Slack channel, or the Skills system itself).',
      icon: PlayCircle,
    },
    {
      number: 4,
      title: 'Review monthly',
      description:
        'Check whether new capabilities have been released that would allow you to automate the trigger step. The AI landscape moves quickly \u2014 what requires manual triggering today may be fully schedulable in three months.',
      icon: RefreshCw,
    },
  ];
}

function getWeeklyReportPrompt(config: SiteConfigData): string {
  const complianceStakeholders =
    config.complianceStakeholders ?? 'stakeholders';
  return `I'd like you to generate a weekly training report. Please:

1. Review the training data I'm about to provide
2. Summarise completion rates by team/department
3. Flag any overdue or incomplete mandatory training
4. Highlight trends compared to the previous period (if I provide it)
5. Format the output as a brief report suitable for sharing with the ${complianceStakeholders}

Use UK English throughout. Keep the tone professional but accessible.

Here's the data:
[paste your training data export here]`;
}

const websiteChangePrompt = `I need you to check a website for changes. Please:

1. I'll provide the current content of the page (or a screenshot)
2. Compare it against the reference version I'll also provide
3. List all significant changes (content additions, removals, or modifications)
4. Flag any changes that might affect accessibility compliance
5. Summarise the changes in a brief report

Current page content:
[paste current content or describe what you see]

Reference version (from last check):
[paste previous content or describe the baseline]`;

const selfUpdatingSkillPrompt = `You are a [task name] skill. Your job is to [describe the task].

## Current Parameters
- [Parameter 1]: [value]
- [Parameter 2]: [value]
- [Last updated]: [date]

## Workflow
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Self-Update Instructions
After completing the task, ask the user:
- "Were any steps missing or unclear?"
- "Should any parameters be updated based on this run?"

If the user provides feedback, output an updated version of this entire skill with the changes incorporated and the "Last updated" date set to today.`;

const contractExtractionPrompt = `Extract all dates, parties, obligations, and deadlines from this contract into a structured table. For each item, include:

- The relevant clause or section number
- The responsible party
- The obligation or commitment
- The deadline or trigger date
- Any conditions or dependencies

Format the output as a markdown table. Flag any ambiguous or conflicting terms at the end.

Here is the contract:
[paste contract text here]`;

const pdfSummaryPrompt = `Parse this PDF and create a structured summary with the following sections:

1. **Key Findings** — The main points or conclusions
2. **Recommendations** — Any suggested actions or next steps
3. **Action Items** — Specific tasks that need to be done, with responsible parties if mentioned
4. **Deadlines** — Any dates or timeframes referenced

Keep each section concise. Use bullet points. If the document does not contain information for a section, note "None identified" rather than guessing.

Here is the document:
[paste document text or attach PDF]`;

const knowledgeBasePrompt = `Help me build a knowledge base on [topic]. Start by asking me what I already know, then research and fill in gaps, then structure the result as a reference document I can reuse.

Approach:
1. Ask me 3-5 questions about what I already know and what I need this knowledge base for
2. Based on my answers, identify gaps and areas where I need more depth
3. Research and fill in those gaps with accurate, practical information
4. Structure everything as a well-organised reference document with clear sections
5. Include a "quick reference" summary at the top for everyday use

The output should be something I can save and refer back to — not a one-off answer.`;

const taskIdentifierPrompt = `I'd like to identify tasks in my team's workflow that could benefit from AI automation. Please help me think through this by asking me questions about:

1. What tasks do I or my team do on a regular schedule (daily, weekly, monthly)?
2. For each task: what data goes in, what output comes out, and who uses the output?
3. Which of these tasks involve gathering information from multiple sources?
4. Which involve formatting or summarising information?
5. Which are time-consuming but follow a predictable pattern?

After we've identified the tasks, help me prioritise them by:
- How much time they currently take
- How predictable/structured the workflow is (more structured = easier to automate)
- How critical accuracy is (high-stakes tasks may need more human oversight)

Let's start with the first question \u2014 what recurring tasks does your team handle?`;

// ─── Main Component ──────────────────────────────────────────────────────────

export function RecurringTasksSection() {
  const siteConfig = useSiteConfig();
  const { track } = useTrack();
  const [whatsComingOpen, setWhatsComingOpen] = useState(false);
  const automationPatterns = getAutomationPatterns(siteConfig);
  const gettingStartedSteps = getGettingStartedStepsGeneral(siteConfig);
  const weeklyReportPrompt = getWeeklyReportPrompt(siteConfig);

  return (
    <div className="space-y-12">
      {/* Current State */}
      <section aria-labelledby="current-state-heading">
        <h2
          id="current-state-heading"
          className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          The Current State of Scheduling with Claude
        </h2>
        <div className="space-y-3 max-w-prose">
          <p className="text-base leading-relaxed text-foreground">
            Claude does not have a built-in scheduler. There is no &ldquo;run
            this every Monday at 09:00&rdquo; feature within Claude itself. This
            is one of the most commonly asked questions, and it is important to
            be clear about it.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            What Claude <strong>can</strong> do: execute complex, multi-step
            tasks when triggered. The triggering is the part that currently
            needs a human or an external system.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The landscape is evolving quickly. This section describes the
            current state as of early 2026 and flags where things are likely to
            change.
          </p>
        </div>

        <CalloutCard
          variant="important"
          title="The practical takeaway"
          className="mt-6"
        >
          Think of Claude as a highly capable executor that you initiate, rather
          than a background service that runs on its own. The limitation is in
          the triggering, not the execution. Claude can already do the hard part
          (analysing, summarising, formatting, decision-making). Building your
          workflows now means you will be ready to automate the trigger as soon
          as the tooling catches up.
        </CalloutCard>
      </section>

      <Separator />

      {/* Patterns That Work Today */}
      <section aria-labelledby="patterns-heading">
        <h2
          id="patterns-heading"
          className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Patterns That Work Today
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          Four proven patterns for automating recurring work with Claude,
          starting from the simplest.
        </p>

        {/* Mobile: accordion; tablet+: cards */}
        <div className="block sm:hidden">
          <Accordion type="single" collapsible className="space-y-1">
            {automationPatterns.map((pattern) => {
              const Icon = pattern.icon;
              return (
                <AccordionItem
                  key={pattern.id}
                  value={pattern.id}
                  className="rounded-lg border border-border px-4"
                >
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    <span className="flex items-center gap-3">
                      <Icon
                        className="h-4 w-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span>{pattern.name}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pb-4 pt-1">
                    <PatternContent pattern={pattern} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <div className="hidden sm:block space-y-6">
          {automationPatterns.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </section>

      <Separator />

      {/* What's Not Yet Possible */}
      <section aria-labelledby="limitations-heading">
        <h2
          id="limitations-heading"
          className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          What Is Not Yet Possible
        </h2>
        <p className="mb-4 max-w-prose text-sm text-muted-foreground">
          It is important to be clear about what Claude cannot do yet, so you
          can plan accordingly.
        </p>

        <CalloutCard variant="info" title="Current limitations">
          <div className="mt-2 space-y-3">
            {currentLimitations.map((limitation) => (
              <div key={limitation.title}>
                <span className="font-medium text-foreground">
                  {limitation.title}
                </span>
                <p className="mt-0.5 text-sm">{limitation.description}</p>
              </div>
            ))}
          </div>
        </CalloutCard>

        {/* What's Likely Coming - collapsible */}
        <div className="mt-4">
          <Collapsible open={whatsComingOpen} onOpenChange={setWhatsComingOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50"
              >
                <span>What is likely coming</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform duration-200',
                    whatsComingOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 space-y-3 rounded-md border border-border bg-muted/20 px-4 py-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Anthropic and third-party developers are actively building
                  scheduling and trigger capabilities. The trajectory is clearly
                  towards more autonomous operation.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
                      aria-hidden="true"
                    />
                    CoWork and similar agent environments are evolving towards
                    persistent background tasks
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
                      aria-hidden="true"
                    />
                    API-based integrations are becoming more accessible,
                    enabling external schedulers to trigger Claude tasks more
                    easily
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
                      aria-hidden="true"
                    />
                    The best preparation: build your workflows as skills and
                    prompts now, so they are ready to plug into scheduling
                    infrastructure as it becomes available
                  </li>
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>

      <Separator />

      {/* Copyable Prompts */}
      <section aria-labelledby="prompts-heading">
        <h2
          id="prompts-heading"
          className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Ready-to-Use Prompts
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          Copy these prompts and paste them into Claude to get started with
          recurring task patterns.
        </p>

        <div className="space-y-6">
          <PromptExample
            title="Weekly Training Report"
            description="Generate a structured training completion report from exported data"
            prompt={weeklyReportPrompt}
            whenToUse={`Weekly, when you have new training data to summarise for the ${siteConfig.complianceStakeholders}`}
          />

          <PromptExample
            title="Website Change Detection"
            description="Compare current and previous versions of a page to identify changes"
            prompt={websiteChangePrompt}
            whenToUse="Regularly, when monitoring client websites for content or accessibility changes"
          />

          <PromptExample
            title="Self-Updating Skill Template"
            description="A template for creating skills that improve themselves after each run"
            prompt={selfUpdatingSkillPrompt}
            context="This is a skill template — save it as a SKILL.md file rather than pasting directly into Claude. Replace the bracketed placeholders with your specific task details."
            whenToUse="When creating a new recurring workflow that benefits from incremental improvement"
          />

          <PromptExample
            title="Contract Data Extraction"
            description="Extract structured data (dates, parties, obligations, deadlines) from a contract"
            prompt={contractExtractionPrompt}
            whenToUse="When you need to quickly review a contract and pull out key commitments and dates"
          />

          <PromptExample
            title="PDF Summary with Action Items"
            description="Parse a document and create a structured summary with findings, recommendations, and deadlines"
            prompt={pdfSummaryPrompt}
            whenToUse="When you receive a report, audit, or lengthy document and need to extract the actionable content"
          />

          <PromptExample
            title="Knowledge Base Builder"
            description="Build a structured, reusable reference document on any topic through guided conversation"
            prompt={knowledgeBasePrompt}
            whenToUse="When you want to create a lasting reference document rather than just get a one-off answer"
          />

          <PromptExample
            title="Recurring Task Identifier"
            description="A guided exercise to find tasks in your workflow that could benefit from automation"
            prompt={taskIdentifierPrompt}
            whenToUse="Once, as a planning exercise to identify your best automation candidates"
          />
        </div>
      </section>

      <Separator />

      {/* Getting Started */}
      <section aria-labelledby="getting-started-heading">
        <h2
          id="getting-started-heading"
          className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Getting Started: Recommended First Steps
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          Practical, actionable steps for your team to begin automating
          recurring work.
        </p>

        <div className="space-y-4">
          {gettingStartedSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="flex items-start gap-4 rounded-lg border border-border px-4 py-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      Step {step.number}: {step.title}
                    </span>
                  </div>
                  <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cross-references */}
      <Separator />
      <section aria-labelledby="recurring-cross-ref-heading">
        <h2
          id="recurring-cross-ref-heading"
          className="mb-4 text-lg font-semibold tracking-tight"
        >
          Related Sections
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            For understanding how to build skills referenced in these patterns,
            see{' '}
            <Link
              to={`/${track}/skills-extensions`}
              className="font-semibold text-primary hover:underline"
            >
              Section 1.4 — Skills, Extensions &amp; Decision Tree
            </Link>
            .
          </p>
          <p>
            For understanding why sessions are not persistent, see{' '}
            <Link
              to={`/${track}/sessions`}
              className="font-semibold text-primary hover:underline"
            >
              Section 1.3 — Session Management
            </Link>
            .
          </p>
          <p>
            For implementation details on Pattern 4 (external triggers), explore
            the Developer track sections for implementation details.
          </p>
        </div>
      </section>
    </div>
  );
}

// ─── Pattern sub-components ──────────────────────────────────────────────────

function PatternContent({ pattern }: { pattern: AutomationPattern }) {
  const siteConfig = useSiteConfig();
  return (
    <>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
            pattern.audienceColour,
          )}
        >
          {pattern.audience}
        </span>
      </div>

      <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
        {pattern.description}
      </p>

      <div>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          How it works
        </span>
        <ol
          className="mt-1.5 space-y-1.5 text-sm text-muted-foreground"
          role="list"
        >
          {pattern.howItWorks.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-md border-l-2 border-accent-foreground/20 bg-muted/30 px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground">
          {siteConfig.companyShortName} example: {pattern.clientExample.title}
        </span>
        <p className="mt-1 text-sm text-foreground">
          {pattern.clientExample.description}
        </p>
      </div>

      {pattern.additionalExamples?.map((example, i) => (
        <div
          key={i}
          className="rounded-md border-l-2 border-accent-foreground/20 bg-muted/30 px-4 py-3"
        >
          <span className="text-xs font-medium text-muted-foreground">
            {siteConfig.companyShortName} example: {example.title}
          </span>
          <p className="mt-1 text-sm text-foreground">{example.description}</p>
        </div>
      ))}

      {pattern.limitations && (
        <CalloutCard variant="warning" title="Limitations">
          <ul className="mt-1 space-y-1">
            {pattern.limitations.map((l, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
                  aria-hidden="true"
                />
                {l}
              </li>
            ))}
          </ul>
        </CalloutCard>
      )}

      <div className="rounded-md bg-muted/30 px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          When to use:{' '}
        </span>
        <span className="text-sm text-foreground">{pattern.whenToUse}</span>
      </div>
    </>
  );
}

function PatternCard({ pattern }: { pattern: AutomationPattern }) {
  const siteConfig = useSiteConfig();
  const Icon = pattern.icon;

  return (
    <div className="rounded-lg border border-border px-6 py-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <Icon className="h-4 w-4 text-foreground" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-foreground">
            {pattern.number}. {pattern.name}
          </h3>
          <span
            className={cn(
              'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
              pattern.audienceColour,
            )}
          >
            {pattern.audience}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          {pattern.description}
        </p>

        <div>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            How it works
          </span>
          <ol
            className="mt-1.5 space-y-1.5 text-sm text-muted-foreground"
            role="list"
          >
            {pattern.howItWorks.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-md border-l-2 border-accent-foreground/20 bg-muted/30 px-4 py-3">
          <span className="text-xs font-medium text-muted-foreground">
            {siteConfig.companyShortName} example: {pattern.clientExample.title}
          </span>
          <p className="mt-1 text-sm text-foreground">
            {pattern.clientExample.description}
          </p>
        </div>

        {pattern.additionalExamples?.map((example, i) => (
          <div
            key={i}
            className="rounded-md border-l-2 border-accent-foreground/20 bg-muted/30 px-4 py-3"
          >
            <span className="text-xs font-medium text-muted-foreground">
              {siteConfig.companyShortName} example: {example.title}
            </span>
            <p className="mt-1 text-sm text-foreground">
              {example.description}
            </p>
          </div>
        ))}

        {pattern.limitations && (
          <CalloutCard variant="warning" title="Limitations">
            <ul className="mt-1 space-y-1">
              {pattern.limitations.map((l, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
                    aria-hidden="true"
                  />
                  {l}
                </li>
              ))}
            </ul>
          </CalloutCard>
        )}

        <div className="rounded-md bg-muted/30 px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">
            When to use:{' '}
          </span>
          <span className="text-sm text-foreground">{pattern.whenToUse}</span>
        </div>
      </div>
    </div>
  );
}
