import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { PromptExample } from '@/components/content/PromptExample';
import { CalloutCard } from '@/components/content/CalloutCard';
import { useTrack } from '@/hooks/useTrack';
import { useSiteConfig } from '@/hooks/useClientConfig';
import type { SiteConfigData } from '@/config/client-config-schema';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

interface AntiHallucinationPattern {
  number: number;
  title: string;
  whenToUse: string;
  explanation: string;
  crossTrack: boolean;
  crossTrackNote?: string;
  prompt: string;
  promptTitle: string;
  promptDescription: string;
  followUpPrompt?: string;
}

function getPatterns(config: SiteConfigData): AntiHallucinationPattern[] {
  const testingTool = config.testingTool ?? 'testing tool';
  const testingToolDocs = config.testingToolDocs ?? 'the official docs';
  const primaryProduct = config.primaryProduct ?? 'application';
  const complianceArea = config.complianceArea ?? 'compliance';
  const sensitiveDataLabel = config.sensitiveDataLabel ?? 'sensitive data';
  const techStack = config.techStack ?? 'your stack';
  const database = config.database ?? 'your database';
  const domainSpecificForm = config.domainSpecificForm ?? 'the form';

  return [
    {
      number: 1,
      title: 'Break Tasks into Atomic Components',
      whenToUse:
        'Any task that involves more than one file, more than one logical concern, or more than roughly 100 lines of change.',
      explanation:
        'Claude performs best when given focused, well-scoped tasks. Large, ambiguous requests invite hallucinated approaches because Claude tries to handle too many decisions at once. Breaking work into atomic subtasks means each task gets Claude\u2019s full 200k token context window, and each output is small enough to review meaningfully.',
      crossTrack: false,
      prompt: `I need to migrate the ${domainSpecificForm} from the legacy ASP.NET Web Forms page to a Razor Pages implementation.

Before writing any code, break this into a numbered list of atomic subtasks. Each subtask should:
- Change no more than 2-3 files
- Have a single clear objective
- Be independently testable

List the subtasks in dependency order. Do not implement anything yet.`,
      promptTitle: 'Atomic Task Breakdown',
      promptDescription:
        'Break a complex task into focused, independently testable subtasks.',
    },
    {
      number: 2,
      title: 'Plan Before Implementing',
      whenToUse: 'Every non-trivial development task. Make it a habit.',
      explanation:
        'Asking Claude to plan before coding forces it to reason about the approach, surface assumptions, and reveal potential issues before any code is written. This is the single most effective pattern for avoiding quick-fix behaviour \u2014 Claude cannot take shortcuts if it has to articulate its strategy first.\n\nFor larger tasks, write the plan as a specification document saved to a dedicated planning directory (e.g., `.planning/`). This gives Claude a concrete reference to work from, and gives you an artefact to review before implementation begins.',
      crossTrack: false,
      prompt: `I want to add role-based access control to the ${primaryProduct} admin dashboard. Before writing any code, create a plan that covers:

1. What changes are needed and where (list specific files)
2. Your recommended approach and why
3. Any assumptions you are making
4. What could go wrong or what edge cases should we handle
5. What you would need to verify before implementing

Do not write any code yet. Present the plan and wait for my feedback.`,
      promptTitle: 'Plan Before Implementing',
      promptDescription:
        'Force Claude to reason about the approach before writing any code.',
    },
    {
      number: 3,
      title: 'Ask for Recommendations and Options',
      whenToUse:
        'Architecture decisions, library choices, refactoring approaches, database schema changes, or any decision with multiple valid paths.',
      explanation:
        'Instead of asking Claude to implement a solution directly, ask it to present 2\u20133 options with trade-offs. This forces Claude to consider alternatives rather than jumping to the first approach it generates \u2014 which is often a hallucinated \u201cobvious\u201d solution that does not account for the specific codebase.',
      crossTrack: false,
      prompt: `We need to implement automated email notifications for overdue training in ${primaryProduct} (${complianceArea}). Our stack is ${techStack} with ${database}.

Present 2-3 different approaches for the notification system. For each option, include:
- How it works (brief technical description)
- Pros and cons
- Estimated complexity (low / medium / high)
- Any dependencies or infrastructure requirements

Do not recommend one yet \u2014 just present the options so I can evaluate them.`,
      promptTitle: 'Options and Trade-offs',
      promptDescription:
        'Get Claude to present multiple approaches instead of jumping to one solution.',
    },
    {
      number: 4,
      title: 'Prioritise Best Practice',
      whenToUse: `Whenever you are working on production code, especially in areas with compliance implications (${sensitiveDataLabel}, authentication, data protection).`,
      explanation:
        'Claude will match the quality bar you set. If you accept quick fixes, you get quick fixes. Explicitly stating that you want best-practice solutions \u2014 and naming the specific standards that matter \u2014 steers Claude away from hacky workarounds and towards maintainable code.',
      crossTrack: false,
      prompt: `I need to update the user authentication flow in our ASP.NET application. Requirements:

- Follow current ASP.NET Core Identity best practices
- Must comply with OWASP authentication guidelines
- We hold ISO 27001 certification, so security patterns must be auditable
- Prioritise maintainability over cleverness

If the best-practice approach differs significantly from our current implementation, explain what we currently have wrong and why the change matters. Do not apply quick patches to the existing code \u2014 propose the correct approach even if it requires more work.`,
      promptTitle: 'Best Practice Enforcement',
      promptDescription:
        'Set a high quality bar and name specific standards Claude should follow.',
    },
    {
      number: 5,
      title: 'Give Claude an "Out" (Permit "I Don\u2019t Know")',
      whenToUse:
        'Any question about specific API versions, library compatibility, platform-specific behaviour, or configuration details that Claude might not have reliable training data for.',
      explanation:
        'Claude will attempt to answer every question, even when it should not. If you do not explicitly give it permission to say "I don\u2019t know", it will hallucinate an answer rather than admit uncertainty. This is particularly dangerous for version-specific API details, library configurations, and platform-specific behaviour.',
      crossTrack: false,
      prompt: `I need to configure ${testingTool} to run against our staging environment with SSO authentication enabled.

Important: if you are not confident about specific ${testingTool} configuration options or API details, say so explicitly rather than guessing. It is better to tell me "I'm not sure about this specific setting \u2014 check ${testingToolDocs}" than to give me a configuration that might not work.

With that caveat, how would you approach this?`,
      promptTitle: 'Explicit "I Don\u2019t Know" Permission',
      promptDescription:
        'Give Claude permission to admit uncertainty instead of hallucinating.',
    },
    {
      number: 6,
      title: 'Outline Open Questions Before Implementing',
      whenToUse:
        'Any task that spans multiple systems, involves unfamiliar APIs, requires integration work, or has ambiguous requirements.',
      explanation:
        'For larger tasks, ask Claude to identify all the open questions and unknowns first, then answer each one, and only then move to implementation. This three-step process prevents Claude from making silent assumptions that lead to hallucinated code paths.',
      crossTrack: false,
      prompt: `I need to build an integration between our WordPress site's contact form and the existing .NET CRM system via a REST API.

Step 1 \u2014 Before suggesting any implementation:
List every open question or assumption you would need to resolve before building this. Consider: authentication, data mapping, error handling, rate limiting, existing API endpoints, WordPress hooks, and anything else relevant.

Do not answer the questions yet. Just list them so I can provide the answers or confirm your assumptions.`,
      promptTitle: 'Open Questions First',
      promptDescription: 'Surface all unknowns before implementation begins.',
      followUpPrompt: `Here are the answers to your open questions:

[paste answers]

Now, based on these confirmed details, outline the implementation approach. If any of my answers have created new questions, raise those before proceeding to code.`,
    },
    {
      number: 7,
      title: 'Validate Against Existing Code First',
      whenToUse:
        'Any time you are modifying existing code, especially with custom frameworks, internal libraries, or non-standard project structures.',
      explanation:
        'Claude frequently hallucinates function signatures, import paths, and API patterns that look correct but do not match your actual codebase. Asking it to read and reference the existing code before making changes grounds its output in reality rather than its training data.',
      crossTrack: false,
      prompt: `I need to add a new endpoint to our API for exporting ${complianceArea} audit reports as PDFs.

Before writing any new code:
1. Read the existing controller files in /Controllers/ to understand our current patterns for API endpoints
2. Read the existing service layer in /Services/ to understand how we structure business logic
3. Check the existing PDF generation code (if any) in the codebase

Then propose the new endpoint following the exact same patterns, naming conventions, and project structure as the existing code. Cite the specific files and patterns you are following.`,
      promptTitle: 'Validate Against Existing Code',
      promptDescription:
        'Ground Claude in your actual codebase before it writes new code.',
    },
  ];
}

const HARNESS_PROMPT = `I am going to use a structured workflow for this task. We will go through these steps in order \u2014 do not skip ahead:

1. SCOPE: I will describe the task. You break it into atomic subtasks.
2. RESEARCH: For each subtask, list open questions and assumptions.
3. RESOLVE: I will answer your questions. Flag anything you are uncertain about.
4. PLAN: Present 2-3 implementation options with trade-offs for the first subtask.
5. VALIDATE: Check your recommended option against our existing codebase patterns.
6. IMPLEMENT: Write the code for the first subtask only.
7. REVIEW: Review your own output against the plan. Flag any deviations.

We will then repeat steps 4-7 for each remaining subtask.

Here is the task:

[describe task]

Start with step 1 \u2014 break this into atomic subtasks.`;

const harnessSteps = [
  {
    label: 'Scope',
    pattern: 'Pattern 1',
    description: 'Break the task into atomic subtasks',
  },
  {
    label: 'Research',
    pattern: 'Pattern 6',
    description: 'Identify open questions for each subtask',
  },
  {
    label: 'Resolve',
    pattern: 'Pattern 5',
    description: 'Answer questions, giving Claude explicit "outs"',
  },
  {
    label: 'Plan',
    pattern: 'Patterns 2 + 3',
    description: 'Ask for options and a recommended approach',
  },
  {
    label: 'Validate',
    pattern: 'Patterns 4 + 7',
    description: 'Check plan against existing code and best practices',
  },
  {
    label: 'Implement',
    pattern: '\u2014',
    description: 'Only now does Claude write code',
  },
  {
    label: 'Review',
    pattern: '\u2014',
    description: 'Claude reviews its output against the plan',
  },
];

const keyTakeaways = [
  'Claude performs best with focused, well-scoped tasks. Break big work into small pieces.',
  'Always plan before implementing. A 2-minute planning prompt saves hours of debugging hallucinated code.',
  'Give Claude permission to say "I don\u2019t know." Uncertainty is better than a confident hallucination.',
  'Ask for options, not answers. When Claude presents alternatives, it has to reason about trade-offs.',
  'Ground Claude in your actual code. Make it read existing patterns before writing new ones.',
  'For complex work, use the agent harness. Combine all the patterns into a structured sequence.',
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function HallucinationsSection() {
  const { track } = useTrack();
  const siteConfig = useSiteConfig();
  const patterns = getPatterns(siteConfig);
  return (
    <div className="flex flex-col gap-12">
      {/* Introduction */}
      <section aria-labelledby="intro">
        <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            Hallucinations in a coding context are not the obvious nonsense you
            might expect. They are lines of code that look perfectly reasonable
            &mdash; a function call with the right signature, an API endpoint
            that follows the naming convention, a library method that feels
            familiar &mdash; but that do not actually exist. Claude can
            confidently generate code that references fabricated methods,
            invents configuration options, or introduces subtly wrong logic, all
            while formatting it cleanly and explaining it clearly.
          </p>
          <p>
            This is a particular risk for developers because code hallucinations
            are harder to catch than prose hallucinations. A made-up fact in a
            paragraph usually stands out on reading, but a hallucinated API call
            can pass code review, compile without errors, and fail silently at
            runtime. The danger increases when you are working with less common
            libraries, unfamiliar APIs, or complex business logic &mdash;
            exactly the situations where you are most likely to trust
            Claude&rsquo;s output because you cannot easily verify it from
            memory.
          </p>
          <p>
            This section provides seven specific, practical patterns for
            preventing and catching hallucinations before they reach production.
            Each pattern includes a prompt template you can copy and use
            immediately. The final part brings all seven patterns together into
            a combined verification harness for complex development work.
          </p>
        </div>

        <CalloutCard variant="info" className="mt-6">
          For general strategies that work across all Claude usage &mdash;
          breaking tasks into pieces, planning before writing, asking for
          options, and giving Claude permission to say &ldquo;I don&rsquo;t
          know&rdquo; &mdash; see the{' '}
          <Link
            to={`/${track === 'developer' ? 'general' : track}/reliable-output`}
            className="text-primary hover:underline"
          >
            Getting Reliable Output
          </Link>{' '}
          section in the general track. This section focuses on the
          developer-specific patterns for code work.
        </CalloutCard>

        <CalloutCard variant="important" className="mt-4">
          You do not need to use all seven patterns on every task. For routine
          work, one or two may be enough. The key is recognising <em>when</em>{' '}
          hallucination risk is high &mdash; unfamiliar APIs, complex
          integrations, code you cannot easily verify &mdash; and reaching for
          the right pattern before Claude starts generating.
        </CalloutCard>
      </section>

      {/* Mini-nav */}
      <nav
        aria-label="Section navigation"
        className="rounded-lg border border-border bg-muted/30 p-4"
      >
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          On this page
        </p>
        <ol className="columns-1 gap-x-6 space-y-1 text-sm sm:columns-2">
          {patterns.map((p) => (
            <li key={p.number}>
              <a
                href={`#pattern-${p.number}`}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {p.number}. {p.title}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#agent-harness"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              The Agent Harness
            </a>
          </li>
          <li>
            <a
              href="#takeaways"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Key Takeaways
            </a>
          </li>
        </ol>
      </nav>

      {/* Patterns */}
      {patterns.map((pattern, index) => (
        <PatternCard
          key={pattern.number}
          pattern={pattern}
          isLast={index === patterns.length - 1}
        />
      ))}

      <Separator />

      {/* Agent Harness */}
      <section aria-labelledby="agent-harness">
        <h2
          id="agent-harness"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          The Agent Harness
        </h2>

        <CalloutCard variant="important" className="mb-6">
          The agent harness combines multiple patterns into a structured,
          multi-step workflow for complex development work. Use it for
          substantial tasks: new features, major refactors, system integrations.
          The individual patterns above are useful on their own for smaller
          tasks.
        </CalloutCard>

        <div className="mb-6 space-y-2">
          {harnessSteps.map((step, index) => (
            <div key={step.label} className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium',
                  index < 5
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {index + 1}
              </div>
              <div className="flex flex-1 items-start gap-2 pt-0.5">
                <span className="text-sm font-medium">{step.label}</span>
                {step.pattern !== '\u2014' && (
                  <PatternBadgeLinks patternText={step.pattern} />
                )}
                <span className="text-sm text-muted-foreground">
                  &mdash; {step.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        <PromptExample
          title="Agent Harness Kickoff"
          description="Start a structured workflow that combines all seven patterns."
          prompt={HARNESS_PROMPT}
          whenToUse="Substantial development work: new features, major refactors, system integrations."
        />
      </section>

      {/* Skill File Tip */}
      <CalloutCard variant="tip" title="Save patterns as skills">
        <p>
          When you find a prompt pattern that consistently prevents
          hallucinations in your codebase, save it as a skill file. Skill files
          are loaded automatically by Claude Code at session start, so your
          anti-hallucination patterns become part of every session without
          manual effort — no need to remember or re-paste them.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          See the{' '}
          <Link
            to={`/${track}/skills-extensions`}
            className="text-primary hover:underline"
          >
            Skills, Extensions &amp; Decision Tree
          </Link>{' '}
          section for how to create and install skill files.
        </p>
      </CalloutCard>

      <Separator />

      {/* Key Takeaways */}
      <section aria-labelledby="takeaways">
        <h2
          id="takeaways"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Key Takeaways
        </h2>
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <ul className="space-y-2">
            {keyTakeaways.map((takeaway) => (
              <li
                key={takeaway}
                className="flex gap-3 text-sm text-muted-foreground"
              >
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {takeaway}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pattern Badge Links                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Renders pattern references (e.g. "Pattern 1", "Patterns 2 + 3") as clickable
 * badge-styled links that jump to the corresponding pattern heading.
 */
function PatternBadgeLinks({ patternText }: { patternText: string }) {
  // Extract all pattern numbers from the text (e.g. "Patterns 2 + 3" → [2, 3])
  const numbers = patternText.match(/\d+/g)?.map(Number) ?? [];
  return (
    <span className="inline-flex flex-wrap gap-1">
      {numbers.map((num) => (
        <a
          key={num}
          href={`#pattern-${num}`}
          className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground hover:underline"
        >
          Pattern {num}
        </a>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pattern Card Sub-Component                                                 */
/* -------------------------------------------------------------------------- */

function PatternCard({
  pattern,
  isLast,
}: {
  pattern: AntiHallucinationPattern;
  isLast: boolean;
}) {
  const [followUpOpen, setFollowUpOpen] = useState(false);

  return (
    <section aria-labelledby={`pattern-${pattern.number}`}>
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
            'bg-primary/10 text-primary',
          )}
        >
          {pattern.number}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              id={`pattern-${pattern.number}`}
              className="text-lg font-semibold"
            >
              {pattern.title}
            </h3>
            {pattern.crossTrack && (
              <Badge variant="secondary" className="text-xs">
                Also useful for General users
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            <strong className="text-foreground">When to use:</strong>{' '}
            {pattern.whenToUse}
          </p>
        </div>
      </div>

      <div className="mt-4 max-w-prose space-y-2 text-sm leading-relaxed text-muted-foreground">
        {pattern.explanation.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        {pattern.crossTrackNote && (
          <p className="mt-2 rounded-md bg-accent/50 px-3 py-2 text-xs">
            {pattern.crossTrackNote}
          </p>
        )}
      </div>

      <div className="mt-4">
        <PromptExample
          title={pattern.promptTitle}
          description={pattern.promptDescription}
          prompt={pattern.prompt}
        />
      </div>

      {pattern.followUpPrompt && (
        <Collapsible
          open={followUpOpen}
          onOpenChange={setFollowUpOpen}
          className="mt-3"
        >
          <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                followUpOpen && 'rotate-180',
              )}
            />
            Show follow-up prompt
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <PromptExample
              title="Follow-up: Resolving Questions"
              description="After answering the open questions, continue to implementation."
              prompt={pattern.followUpPrompt}
            />
          </CollapsibleContent>
        </Collapsible>
      )}

      {!isLast && <Separator className="mt-8" />}
    </section>
  );
}
