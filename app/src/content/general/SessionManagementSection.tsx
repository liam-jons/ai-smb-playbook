import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalloutCard } from '@/components/content/CalloutCard';
import { PromptExample } from '@/components/content/PromptExample';
import { CodeBlock } from '@/components/content/CodeBlock';
import { useTrack } from '@/hooks/useTrack';
import { useSiteConfig } from '@/hooks/useClientConfig';
import { getAtomicTaskTitle } from '@/content/shared/session-management-data';
import {
  ChevronDown,
  AlertTriangle,
  ArrowRightLeft,
  Scissors,
  Monitor,
  Brain,
  Code2,
  FileText,
  Bookmark,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  rulesOfThumb,
  tokenAwarenessBands,
  handoffWorkflowSteps,
  handoffScenarios,
  infoArchElements,
  getWorkedExamples,
  platformComparisons,
  copyablePrompts,
  promptCategoryLabels,
} from '@/content/shared/session-management-data';
import type { PromptCategory } from '@/content/shared/session-management-data';

const sessionTocEntries = [
  { id: 'when-to-stop-heading', label: 'When to Stop a Session' },
  { id: 'handoff-workflow-heading', label: 'The Handoff Workflow' },
  { id: 'subtasks-heading', label: 'Breaking Tasks into Subtasks' },
  { id: 'platform-heading', label: 'Platform Differences' },
  { id: 'memory-feature-heading', label: "Claude's Memory Feature" },
  { id: 'persistent-context-heading', label: 'Setting Up Persistent Context' },
  { id: 'templates-heading', label: 'Copyable Handoff Templates' },
];

export function SessionManagementSection() {
  const siteConfig = useSiteConfig();
  const { track } = useTrack();
  const isDev = track === 'developer';
  const workedExamples = getWorkedExamples(siteConfig);

  const filteredPrompts = copyablePrompts.filter((p) =>
    p.tracks.includes(track),
  );
  const promptCategories = [
    ...new Set(filteredPrompts.map((p) => p.category)),
  ] as PromptCategory[];

  return (
    <div className="space-y-12">
      {/* S5: Table of Contents */}
      <nav
        aria-label="Page contents"
        className="rounded-lg border border-border bg-muted/20 dark:bg-muted/40 px-4 py-4 sm:px-6"
      >
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          On this page
        </h2>
        <ul className="columns-1 gap-x-8 space-y-1.5 sm:columns-2">
          {sessionTocEntries.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {entry.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Key takeaway */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <CalloutCard variant="important">
          <p className="font-medium">
            A fresh session with a good handoff beats a long degrading session
            every time.
          </p>
        </CalloutCard>
      </motion.div>

      {/* ─────────────────────────────────────────────
          Part 1: When to Stop a Session
          ───────────────────────────────────────────── */}
      <motion.section
        aria-labelledby="when-to-stop-heading"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2
          id="when-to-stop-heading"
          className="mb-2 flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          <AlertTriangle className="h-5 w-5 text-primary" />
          When to Stop a Session and Start Fresh
        </h2>
        <p className="mb-4 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
          Stopping a session is not failure — it is the single most effective
          way to maintain Claude&apos;s quality. A fresh session with a good
          briefing outperforms a long session every time.
        </p>

        {/* Rules of thumb */}
        <h3 className="mb-3 text-lg font-semibold">Rules of Thumb</h3>
        <Accordion
          type="single"
          collapsible
          defaultValue="one-task"
          className="w-full"
        >
          {rulesOfThumb
            .filter((r) => r.tracks.includes(track))
            .map((rule) => (
              <AccordionItem key={rule.id} value={rule.id}>
                <AccordionTrigger className="text-base font-semibold">
                  {rule.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="max-w-[65ch] space-y-2 text-sm">
                    <p className="leading-relaxed">{rule.description}</p>
                    <p className="text-xs text-muted-foreground">
                      <strong>What to look for:</strong> {rule.signal}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>

        {/* Developer: Token-awareness bands */}
        {isDev && (
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-semibold">
              Token-Aware Session Management
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th scope="col" className="py-2 pr-4 font-medium">
                      Context usage
                    </th>
                    <th scope="col" className="py-2 pr-4 font-medium">
                      What you will notice
                    </th>
                    <th scope="col" className="py-2 font-medium">
                      What to do
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tokenAwarenessBands.map((band, i) => (
                    <tr
                      key={band.range}
                      className={cn(
                        'border-b border-border/50',
                        i === tokenAwarenessBands.length - 1 && 'border-b-0',
                      )}
                    >
                      <td className="py-2 pr-4 align-top font-medium tabular-nums">
                        {band.range}
                      </td>
                      <td className="py-2 pr-4 align-top text-muted-foreground">
                        {band.userExperience}
                      </td>
                      <td className="py-2 align-top text-muted-foreground">
                        {band.recommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <p className="font-medium">How to check context usage:</p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                <li>
                  <strong>Claude Code:</strong> Use the{' '}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                    /cost
                  </code>{' '}
                  command to see current context consumption.
                </li>
                <li>
                  <strong>claude.ai / Desktop:</strong> No direct indicator.
                  Watch for the behavioural signals above (repetition, drift,
                  forgetting).
                </li>
              </ul>
            </div>

            <CalloutCard
              variant="tip"
              title="The 200K subtask benefit"
              className="mt-4"
            >
              <p>
                When you break a large task into subtasks (see Part 3 below),
                each subtask gets its own fresh 200,000-token context window. A
                five-subtask project effectively has access to 1,000,000 tokens
                of context capacity — each window sharp and focused — instead of
                cramming everything into a single degrading session.
              </p>
            </CalloutCard>
          </div>
        )}

        {/* Cross-reference — N37: hover state on cross-reference link */}
        <div className="mt-4 rounded-md border border-border bg-muted/30 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            See how context degradation works visually in the{' '}
            <Link
              to={`/${track}/context`}
              className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
            >
              Context Simulator
            </Link>
            .
          </p>
        </div>
      </motion.section>

      <Separator className="my-2" />

      {/* ─────────────────────────────────────────────
          Part 2: The Handoff Workflow
          ───────────────────────────────────────────── */}
      <section
        aria-labelledby="handoff-workflow-heading"
        className="rounded-lg bg-muted/20 dark:bg-muted/40 p-6 sm:p-8"
      >
        <h2
          id="handoff-workflow-heading"
          className="mb-2 flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          <ArrowRightLeft className="h-5 w-5 text-primary" />
          Getting Claude to Write Its Own Handoff
        </h2>

        <CalloutCard variant="info" className="mb-4">
          <p className="text-xs">
            <strong>Terminology:</strong> Throughout this playbook, we use
            &ldquo;handoff prompt&rdquo; as the primary term for the structured
            summary you create when ending a session. This is also called a
            &ldquo;continuation prompt&rdquo; — they mean the same thing.
          </p>
        </CalloutCard>

        <p className="mb-6 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
          You do not need to write the handoff yourself. Ask Claude to summarise
          the session and produce a handoff prompt. Claude has access to the
          full conversation and can extract the key information.
        </p>

        {/* Workflow steps — N47: replaced absolute positioning with flexbox, N26: flexbox timeline */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">The Handoff Workflow</h3>
          <ol className="space-y-0">
            {handoffWorkflowSteps.map((step, i) => (
              <li key={step.number} className="flex gap-4 sm:gap-5">
                {/* Timeline column */}
                <div className="flex flex-col items-center">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-background text-xs font-semibold text-primary">
                    {step.number}
                  </span>
                  {i < handoffWorkflowSteps.length - 1 && (
                    <div className="w-0.5 grow bg-border" />
                  )}
                </div>
                {/* Content column — N27: increased padding for mobile */}
                <div
                  className={cn(
                    'pb-6',
                    i === handoffWorkflowSteps.length - 1 && 'pb-0',
                  )}
                >
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {!isDev && (
          <CalloutCard variant="tip" className="mb-6">
            <p className="text-xs">
              Think of this as saving your progress — like saving a game. You
              capture where you are, then start a fresh page with that summary
              at the top. If you work on the same type of task regularly,
              consider setting up a{' '}
              <Link
                to={`/${track}/skills-extensions`}
                className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
              >
                Project
              </Link>{' '}
              in claude.ai with custom instructions describing your usual
              workflow.
            </p>
          </CalloutCard>
        )}

        {/* Developer: Scenario types */}
        {isDev && (
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-semibold">
              Handoff Scenario Types
            </h3>
            <p className="mb-4 max-w-[65ch] text-sm text-muted-foreground">
              Not all handoffs are the same. The right structure depends on why
              you are stopping.
            </p>
            <Accordion type="single" collapsible className="w-full">
              {handoffScenarios.map((scenario) => (
                <AccordionItem key={scenario.id} value={scenario.id}>
                  <AccordionTrigger className="text-base font-semibold">
                    <span className="flex items-center gap-2">
                      {scenario.name}
                      <Badge
                        variant="outline"
                        className="ml-1 text-xs font-normal"
                      >
                        {scenario.frequency}
                      </Badge>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="max-w-[65ch] space-y-3 text-sm">
                      <p className="leading-relaxed">{scenario.description}</p>
                      <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                        {scenario.characteristics.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Information Architecture */}
            <Collapsible className="mt-4">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex w-full items-center justify-between gap-2 text-sm text-muted-foreground"
                >
                  <span>Show information architecture for handoff prompts</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 space-y-4 rounded-md border border-border bg-muted/30 p-4">
                  {(['universal', 'common', 'scenario-specific'] as const).map(
                    (category) => {
                      const elements = infoArchElements.filter(
                        (e) => e.category === category,
                      );
                      const labels = {
                        universal: 'Universal (every handoff needs these)',
                        common: 'Common (most handoffs)',
                        'scenario-specific': 'Scenario-specific',
                      };
                      return (
                        <div key={category}>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {labels[category]}
                          </p>
                          <ul className="space-y-1">
                            {elements.map((el) => (
                              <li key={el.name} className="text-sm">
                                <span className="font-medium">{el.name}</span>
                                <span className="text-muted-foreground">
                                  {' '}
                                  — {el.description}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    },
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </section>

      <Separator className="my-2" />

      {/* ─────────────────────────────────────────────
          Part 3: Breaking Tasks into Subtasks
          ───────────────────────────────────────────── */}
      <section aria-labelledby="subtasks-heading">
        <h2
          id="subtasks-heading"
          className="mb-2 flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          <Scissors className="h-5 w-5 text-primary" />
          Breaking Tasks into Subtasks
        </h2>
        <p className="mb-4 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
          Large tasks produce better results when broken into focused subtasks,
          each in its own session. This is not just good practice — it is how
          you get the most from Claude&apos;s architecture.
        </p>

        <h3 className="mb-3 text-lg font-semibold">
          {getAtomicTaskTitle(track)}
        </h3>
        <p className="mb-4 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
          Each task should be broken down to the smallest unit that can be
          completed independently. Each atomic task gets a fresh context window,
          meaning Claude brings its full attention to each piece.
        </p>

        {/* Worked examples — N6: show preview outside collapsible, use defaultOpen on first */}
        {workedExamples
          .filter((ex) => ex.tracks.includes(track))
          .map((example, idx) => (
            <div
              key={example.id}
              className="mb-4 rounded-md border border-border bg-muted/30 p-4"
            >
              {/* Preview always visible */}
              <p className="mb-1 text-sm font-medium">{example.title}</p>
              <p className="mb-3 text-sm italic leading-relaxed text-muted-foreground">
                {example.context}
              </p>
              <Collapsible defaultOpen={idx === 0}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex w-full items-center justify-between gap-2 text-sm"
                  >
                    <span>
                      {idx === 0
                        ? 'Session breakdown'
                        : 'Show session breakdown'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-3">
                    <p className="mb-2 text-sm font-medium">Break it down:</p>
                    <ol className="space-y-2">
                      {example.steps.map((step) => (
                        <li key={step.session} className="flex gap-3 text-sm">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {step.session}
                          </span>
                          <div>
                            <span className="text-muted-foreground">
                              &ldquo;{step.description}&rdquo;
                            </span>
                            <span className="block text-xs leading-relaxed text-muted-foreground/70">
                              {step.outcome}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Each session is focused. Claude does not need to hold the
                      entire project in memory at once.
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}

        {isDev && (
          <CalloutCard variant="tip" className="mt-4">
            <p>
              {workedExamples.find((e) => e.id === 'api-endpoint')?.steps
                .length ?? 4}{' '}
              sessions x 200K tokens ={' '}
              {(
                (workedExamples.find((e) => e.id === 'api-endpoint')?.steps
                  .length ?? 4) * 200
              ).toLocaleString('en-GB')}
              K tokens of focused context capacity, versus a single session that
              degrades past the halfway mark.
            </p>
          </CalloutCard>
        )}
      </section>

      <Separator className="my-2" />

      {/* ─────────────────────────────────────────────
          Part 4: Platform-Specific Guidance
          ───────────────────────────────────────────── */}
      <section
        aria-labelledby="platform-heading"
        className="rounded-lg bg-muted/20 dark:bg-muted/40 p-6 sm:p-8"
      >
        <h2
          id="platform-heading"
          className="mb-4 flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          <Monitor className="h-5 w-5 text-primary" />
          Platform Differences
        </h2>

        {/* Mobile: stacked list */}
        <div className="space-y-4 sm:hidden">
          {platformComparisons.map((row) => (
            <div
              key={row.aspect}
              className="rounded-md border border-border bg-background p-3"
            >
              <p className="mb-2 text-sm font-medium">{row.aspect}</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">
                    claude.ai / Desktop:
                  </span>{' '}
                  {row.claudeAi}
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Claude Code:
                  </span>{' '}
                  {row.claudeCode}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Aspect
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  claude.ai / Desktop
                </th>
                <th scope="col" className="py-2 font-medium">
                  Claude Code
                </th>
              </tr>
            </thead>
            <tbody>
              {platformComparisons.map((row, i) => (
                <tr
                  key={row.aspect}
                  className={cn(
                    'border-b border-border/50',
                    i === platformComparisons.length - 1 && 'border-b-0',
                  )}
                >
                  <td className="py-2 pr-4 align-top font-medium">
                    {row.aspect}
                  </td>
                  <td className="py-2 pr-4 align-top text-muted-foreground">
                    {row.claudeAi}
                  </td>
                  <td className="py-2 align-top text-muted-foreground">
                    {row.claudeCode}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Separator className="my-2" />

      {/* ─────────────────────────────────────────────
          Part 5: Claude's Memory Feature
          ───────────────────────────────────────────── */}
      <section aria-labelledby="memory-feature-heading">
        <h2
          id="memory-feature-heading"
          className="mb-2 flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          <Brain className="h-5 w-5 text-primary" />
          Claude&apos;s Memory Feature
        </h2>
        {/* N5: transition sentence connecting memory to session theme */}
        <p className="mb-4 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
          Your session context includes memory from previous conversations.
          Here&apos;s how to manage it: Claude can remember facts across
          conversations using its memory feature. Unlike session handoffs (which
          carry forward a snapshot of a specific task), memories persist
          indefinitely and apply to all future conversations.
        </p>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="what-is-memory">
            <AccordionTrigger className="text-base font-semibold">
              What is Claude&apos;s memory?
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-w-[65ch] space-y-2 text-sm text-muted-foreground">
                <p>
                  Memory stores persistent facts that Claude recalls in every
                  new conversation. You can tell Claude to remember something
                  (&ldquo;Remember that our brand colour is #1B4D3E&rdquo;) and
                  it will retain that fact without you needing to repeat it.
                </p>
                <p>
                  You can view and manage your memories in Claude&apos;s
                  settings. Each memory can be edited or deleted at any time.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="how-to-use">
            <AccordionTrigger className="text-base font-semibold">
              How to add, view, and manage memories
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-w-[65ch] space-y-2 text-sm text-muted-foreground">
                <ul className="list-inside list-disc space-y-1">
                  <li>
                    <strong>Add a memory:</strong> Tell Claude directly —
                    &ldquo;Remember that we use UK English throughout all client
                    communications&rdquo;
                  </li>
                  <li>
                    <strong>View memories:</strong> Go to Settings &gt; Memory
                    in claude.ai or the Claude Desktop app
                  </li>
                  <li>
                    <strong>Delete a memory:</strong> Click the delete icon next
                    to any memory in Settings, or tell Claude to forget
                    something specific
                  </li>
                </ul>
                <p>
                  Claude will also sometimes suggest saving a memory when it
                  notices you repeating the same instruction. You can approve or
                  decline these suggestions.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="when-to-use">
            <AccordionTrigger className="text-base font-semibold">
              When to use memory vs projects vs skills
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-w-[65ch] space-y-3 text-sm text-muted-foreground">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md border border-border p-3">
                    <p className="mb-1 text-xs font-medium text-foreground">
                      Memory
                    </p>
                    <p className="text-xs">
                      Personal preferences and facts that apply across all
                      conversations. Example: brand guidelines, your role,
                      preferred writing style.
                    </p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="mb-1 text-xs font-medium text-foreground">
                      Projects
                    </p>
                    <p className="text-xs">
                      Context that applies to a specific project or workstream.
                      Example: project brief, key contacts, deliverable
                      requirements.
                    </p>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="mb-1 text-xs font-medium text-foreground">
                      Skills
                    </p>
                    <p className="text-xs">
                      Reusable workflows and instructions that Claude follows
                      when triggered. Example: report generation, data
                      extraction, review checklists.
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="good-examples">
            <AccordionTrigger className="text-base font-semibold">
              Good uses for memory
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-w-[65ch] space-y-2 text-sm text-muted-foreground">
                <ul className="list-inside list-disc space-y-1">
                  <li>
                    Brand guidelines — colours, fonts, tone of voice, logo usage
                    rules
                  </li>
                  <li>
                    Your role and team structure — so Claude understands your
                    context without being told each time
                  </li>
                  <li>
                    Formatting preferences — &ldquo;always use bullet points
                    rather than numbered lists for action items&rdquo;
                  </li>
                  <li>
                    Key facts about your organisation — company size, industry,
                    regulatory environment
                  </li>
                  <li>
                    Marketing materials context — storing brand guidelines so
                    Claude produces on-brand content by default
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <CalloutCard variant="tip" className="mt-4">
          <p className="text-xs">
            <strong>A good starting point:</strong> Tell Claude your name, your
            role at {siteConfig.companyShortName}, and that all content should
            use UK English. These three memories immediately improve every
            future conversation.
          </p>
        </CalloutCard>
      </section>

      <Separator className="my-2" />

      {/* ─────────────────────────────────────────────
          Part 6: Persistent Context
          ───────────────────────────────────────────── */}
      <section aria-labelledby="persistent-context-heading">
        <h2
          id="persistent-context-heading"
          className="mb-2 flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          <Bookmark className="h-5 w-5 text-primary" />
          Setting Up Persistent Context
        </h2>
        <p className="mb-4 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
          Claude does not remember anything between conversations unless you
          tell it to. Every new chat starts from zero. Persistent context is how
          you give Claude a head start &mdash; so it already knows who you are,
          what you work on, and how you like things done.
        </p>

        <CalloutCard variant="important" className="mb-6">
          <p>
            <strong>
              Knowledge that lives in people&apos;s heads is invisible to
              Claude.
            </strong>{' '}
            If your team agreed on a process in a meeting, or a client
            preference was discussed over email, Claude has no way to know about
            it unless you write it down somewhere it can see.
          </p>
        </CalloutCard>

        <h3 className="mb-3 text-lg font-semibold">Where to Set It Up</h3>
        <div className="mb-6 space-y-3">
          <div className="flex gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div>
              <p className="text-sm font-medium">Profile preferences</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                2&ndash;3 sentences that apply to every conversation. Your name,
                your role, &ldquo;always use UK English&rdquo;, your preferred
                output format. These are loaded into every chat automatically.
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div>
              <p className="text-sm font-medium">Project custom instructions</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                A paragraph or two for each project you work on regularly.
                Describe the project, the audience, key constraints, and any
                style requirements. In claude.ai, create a Project and add these
                as custom instructions.
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div>
              <p className="text-sm font-medium">
                Starting a conversation with context
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                When you do not have a Project set up, paste a brief context
                block at the start of the conversation. Two to four sentences
                describing what you are working on and what you need.
              </p>
            </div>
          </div>
        </div>

        <h3 className="mb-3 text-lg font-semibold">
          Think &ldquo;Map, Not Encyclopaedia&rdquo;
        </h3>
        <div className="mb-6 max-w-prose space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            The most common mistake is trying to include everything. Your
            persistent context should be a short, sharp pointer to what matters
            &mdash; not a complete manual. Think of it as a map that tells
            Claude where things are, not an encyclopaedia that tries to contain
            everything.
          </p>
          <p>
            <strong className="text-foreground">Aim for brevity:</strong> a good
            set of project instructions is a paragraph, not a page. Every line
            should earn its place. If a piece of information changes weekly, it
            does not belong in persistent context &mdash; it belongs in the
            conversation where you need it.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-success/30 bg-success-muted/50 p-4">
            <h4 className="mb-2 text-sm font-medium text-success-muted-foreground">
              Good things to include
            </h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Your role and team context</li>
              <li>Brand voice and tone guidelines</li>
              <li>
                Preferred output format (bullet points, formal prose, etc.)
              </li>
              <li>
                Key constraints (&ldquo;always UK English&rdquo;, &ldquo;never
                include personal data&rdquo;)
              </li>
              <li>Project-specific terminology or jargon</li>
            </ul>
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <h4 className="mb-2 text-sm font-medium text-destructive">
              What NOT to include
            </h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>
                Sensitive data (passwords, API keys, personal information)
              </li>
              <li>
                Information that changes frequently (current project status,
                this week&apos;s priorities)
              </li>
              <li>
                Generic instructions Claude already knows (&ldquo;be
                helpful&rdquo;, &ldquo;write clearly&rdquo;)
              </li>
              <li>
                Long documents or entire style guides &mdash; summarise the key
                points instead
              </li>
            </ul>
          </div>
        </div>

        <PromptExample
          title="Setting Up Project Instructions"
          description="Paste this into a claude.ai Project\u2019s custom instructions, adapting it for your project."
          prompt={`You are helping me with [project name]. This is a [brief description of what the project is].

Key context:
- Target audience: [who will read/use the output]
- Tone: [e.g. professional but approachable, formal, conversational]
- Always use UK English spelling and grammar
- [Any specific constraints, e.g. "must comply with GDPR", "use our brand colours #1B4D3E and #F5F5F0"]

When I ask you to write content for this project, follow these guidelines unless I say otherwise.`}
          whenToUse="When setting up a new Project in claude.ai for a recurring workstream."
        />

        {isDev && (
          <CalloutCard variant="info" className="mt-4">
            <p className="text-sm">
              <strong>For developers:</strong> The developer track covers{' '}
              <Link
                to={`/${track}/claude-md`}
                className="text-primary hover:underline"
              >
                CLAUDE.md files
              </Link>{' '}
              &mdash; the code-level equivalent of persistent context that
              Claude Code reads automatically at the start of every session. The{' '}
              <Link
                to={`/${track}/documentation`}
                className="text-primary hover:underline"
              >
                Documentation Structure
              </Link>{' '}
              section covers how to organise project docs so Claude can navigate
              them.
            </p>
          </CalloutCard>
        )}
      </section>

      {/* ─────────────────────────────────────────────
          Developer-only extras
          ───────────────────────────────────────────── */}
      {isDev && <Separator className="my-2" />}
      {isDev && (
        <section
          aria-labelledby="dev-extras-heading"
          className="rounded-lg bg-muted/20 dark:bg-muted/40 p-6 sm:p-8"
        >
          <h2
            id="dev-extras-heading"
            className="mb-4 flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl"
          >
            <Code2 className="h-5 w-5 text-primary" />
            Developer Session Practices
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="structured-handoffs">
              <AccordionTrigger className="text-base font-semibold">
                Structured handoffs as files
              </AccordionTrigger>
              <AccordionContent>
                <div className="max-w-[65ch] space-y-2 text-sm text-muted-foreground">
                  <p>
                    Save handoffs as markdown files in your project (e.g.{' '}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                      .planning/continuation-prompts/session-N.md
                    </code>
                    ), not just copy-paste them. This creates a project history
                    that any team member can reference.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="recency-weighted">
              <AccordionTrigger className="text-base font-semibold">
                The recency-weighted summary pattern
              </AccordionTrigger>
              <AccordionContent>
                <div className="max-w-[65ch] space-y-2 text-sm text-muted-foreground">
                  <p>
                    As sessions accumulate, compress old sessions into a
                    one-line summary and expand recent ones with full detail.
                    This keeps handoffs concise while preserving context.
                  </p>
                  <CodeBlock
                    code={`Sessions 01-04: Research and technology alignment (complete). See session-summary-04.md.

Session 05: Brainstorming — universal bid workflow (complete)
- Defined the 8-stage workflow
- Agreed on routing logic for SME allocation
- Identified gap in content freshness monitoring

Session 06: Brainstorming — SME routing + auth decision
- [detailed breakdown with 8-10 bullet points]`}
                    language="markdown"
                    title="Recency-weighted summary example"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="claude-md-context">
              <AccordionTrigger className="text-base font-semibold">
                CLAUDE.md as persistent context
              </AccordionTrigger>
              <AccordionContent>
                <div className="max-w-[65ch] space-y-2 text-sm text-muted-foreground">
                  <p>
                    For principles and constraints that repeat across every
                    session, put them in CLAUDE.md instead of repeating them in
                    handoffs. The handoff then references CLAUDE.md rather than
                    duplicating it.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="subagent-hints">
              <AccordionTrigger className="text-base font-semibold">
                Subagent parallelisation hints
              </AccordionTrigger>
              <AccordionContent>
                <div className="max-w-[65ch] space-y-2 text-sm text-muted-foreground">
                  <p>
                    When decomposing tasks, note which subtasks could be run as
                    parallel subagents in Claude Code. Each subagent gets its
                    own 200K context window, and only a summary returns to your
                    main session.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="auto-checkpoints">
              <AccordionTrigger className="text-base font-semibold">
                Automated checkpoints
              </AccordionTrigger>
              <AccordionContent>
                <div className="max-w-[65ch] space-y-2 text-sm text-muted-foreground">
                  <p>
                    Claude Code hooks (PreCompact, SessionEnd) can be configured
                    to generate automatic checkpoint handoffs. This is an
                    advanced technique — the starter kit includes relevant files
                    to get you started.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="starter-kit">
              <AccordionTrigger className="text-base font-semibold">
                Starter kit resources
              </AccordionTrigger>
              <AccordionContent>
                <div className="max-w-[65ch] space-y-2 text-sm text-muted-foreground">
                  <p>
                    The starter kit includes ready-to-use session handoff skill
                    files in{' '}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                      starter-kit/skills/
                    </code>{' '}
                    and example prompts in{' '}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                      starter-kit/prompts/
                    </code>
                    .
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      )}

      <Separator className="my-2" />

      {/* ─────────────────────────────────────────────
          Copyable Templates Section — N10/N25: tabs instead of vertical scroll
          ───────────────────────────────────────────── */}
      <section aria-labelledby="templates-heading">
        <h2
          id="templates-heading"
          className="mb-2 flex items-center gap-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          <FileText className="h-5 w-5 text-primary" />
          Copyable Handoff Templates
        </h2>
        <p className="mb-6 max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
          Copy any of these prompts and paste them into your conversation when
          you are ready to wrap up. Use the tabs below to find the right
          template for your situation.
        </p>

        <Tabs defaultValue={promptCategories[0]} className="w-full">
          <TabsList className="mb-4 w-full sm:w-auto">
            {promptCategories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {promptCategoryLabels[cat]}
              </TabsTrigger>
            ))}
          </TabsList>
          {promptCategories.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <div className="space-y-4">
                {filteredPrompts
                  .filter((p) => p.category === cat)
                  .map((prompt) => (
                    <PromptExample
                      key={prompt.id}
                      title={prompt.label}
                      description={prompt.description}
                      prompt={prompt.content}
                      whenToUse={prompt.whenToUse}
                      copyAriaLabel={`Copy ${prompt.label} prompt`}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
}
