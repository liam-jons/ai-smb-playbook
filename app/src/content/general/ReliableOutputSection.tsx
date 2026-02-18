import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Separator } from '@/components/ui/separator';
import { PromptExample } from '@/components/content/PromptExample';
import { CalloutCard } from '@/components/content/CalloutCard';
import { useTrack } from '@/hooks/useTrack';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

interface ReliableOutputPattern {
  number: number;
  title: string;
  whenToUse: string;
  explanation: string;
  prompt: string;
  promptTitle: string;
  promptDescription: string;
}

const patterns: ReliableOutputPattern[] = [
  {
    number: 1,
    title: 'Break Tasks into Smaller Pieces',
    whenToUse:
      'Any task that involves multiple parts, multiple topics, or more than a page of output.',
    explanation:
      'Claude performs best when given focused, well-scoped tasks. Large, vague requests invite mistakes because Claude tries to handle too many things at once. Breaking work into smaller pieces means each piece gets Claude\u2019s full attention, and each output is short enough to check properly.',
    prompt: `I need to write a client proposal for a new website redesign project.

Before writing anything, break this into a numbered list of smaller tasks. Each task should:
- Cover one specific section of the proposal (e.g. executive summary, scope, timeline, pricing)
- Be something I can review independently
- Build on the previous section

List the tasks in order. Do not write the proposal yet.`,
    promptTitle: 'Task Breakdown for a Proposal',
    promptDescription:
      'Break a large document into focused, reviewable sections.',
  },
  {
    number: 2,
    title: 'Plan Before Writing',
    whenToUse:
      'Any non-trivial task. Reports, proposals, research summaries, project plans \u2014 anything longer than a quick email.',
    explanation:
      'Asking Claude to plan before writing forces it to think about the approach, surface assumptions, and reveal potential issues before any content is produced. This is the single most effective pattern for avoiding shallow or incorrect output \u2014 Claude cannot take shortcuts if it has to explain its thinking first.',
    prompt: `I need to create a quarterly progress report for our board of directors. Before writing anything, create a plan that covers:

1. What sections the report should include and why
2. What data or information you would need from me
3. Any assumptions you are making about format or audience
4. What could be missing or misleading if we are not careful

Do not write the report yet. Present the plan and wait for my feedback.`,
    promptTitle: 'Plan Before Writing',
    promptDescription:
      'Force Claude to think about the approach before producing content.',
  },
  {
    number: 3,
    title: 'Ask for Options, Not Answers',
    whenToUse:
      'Decisions with multiple valid approaches, strategy questions, or any task where you want to consider alternatives before committing.',
    explanation:
      'Instead of asking Claude to produce a single answer, ask it to present 2\u20133 options with trade-offs. This forces Claude to consider alternatives rather than jumping to the first approach it generates \u2014 which may not be the best fit for your situation.',
    prompt: `We need to restructure our client onboarding process. It currently takes 3 weeks and involves too much manual back-and-forth.

Present 2-3 different approaches for improving this. For each option, include:
- How it works (brief description)
- Pros and cons
- Estimated effort to implement (low / medium / high)
- What would need to change in our current process

Do not recommend one yet \u2014 just present the options so I can evaluate them.`,
    promptTitle: 'Options and Trade-offs',
    promptDescription:
      'Get Claude to present multiple approaches instead of jumping to one answer.',
  },
  {
    number: 4,
    title: 'Give Claude Permission to Say "I Don\u2019t Know"',
    whenToUse:
      'Any question about specific facts, statistics, regulations, company policies, or anything where accuracy matters more than speed.',
    explanation:
      'Claude will attempt to answer every question, even when it should not. If you do not explicitly give it permission to say "I don\u2019t know", it will generate plausible-sounding information rather than admit uncertainty. This is especially risky when asking about specific statistics, legal requirements, or industry regulations.',
    prompt: `I need to summarise the key changes in the UK Online Safety Act that affect our business.

Important: if you are not confident about specific details, dates, or provisions, say so explicitly rather than guessing. It is better to tell me "I'm not sure about this specific detail \u2014 you should check the legislation directly" than to give me information that might be wrong.

With that caveat, what are the main points I should cover?`,
    promptTitle: 'Permission to Say "I Don\u2019t Know"',
    promptDescription:
      'Give Claude explicit permission to flag uncertainty instead of making things up.',
  },
];

const keyTakeaways = [
  'Claude performs best with focused, well-scoped tasks. Break big work into small pieces.',
  'Always ask Claude to plan before writing. A 30-second planning prompt saves significant rework.',
  'Give Claude permission to say "I don\u2019t know." Uncertainty is better than a confident mistake.',
  'Ask for options, not answers. When Claude presents alternatives, it has to think about trade-offs.',
  'Check any specific facts, statistics, or legal details Claude provides \u2014 these are where mistakes are most likely.',
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function ReliableOutputSection() {
  const { track } = useTrack();

  return (
    <div className="flex flex-col gap-12">
      {/* Introduction */}
      <motion.section
        aria-labelledby="intro"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            When you ask Claude to write a proposal mentioning specific
            statistics, it might generate plausible-sounding numbers that do not
            exist. When you ask it to summarise a regulation, it might describe
            provisions that sound right but are subtly wrong. These are called
            &ldquo;hallucinations&rdquo; &mdash; and they are the biggest risk
            when using AI for business tasks.
          </p>
          <p>
            The tricky part is that hallucinations are not obvious nonsense.
            They are confident, well-written, and formatted exactly like real
            information. A made-up statistic in a client proposal, an incorrect
            regulatory requirement in a compliance document, or a fabricated
            contact detail in a briefing &mdash; these can pass a quick read and
            only cause problems later.
          </p>
          <p>
            This section provides four practical patterns for getting reliable
            output from Claude. Each includes a prompt template you can copy and
            use immediately. You do not need all four on every task &mdash; the
            key is knowing which to reach for and when.
          </p>
        </div>

        <CalloutCard variant="important" className="mt-6">
          <strong>The golden rule:</strong> the more important the accuracy of
          the output, the more structure you should give Claude upfront. A quick
          brainstorm needs minimal guardrails. A client-facing proposal or
          compliance document needs all four patterns below.
        </CalloutCard>
      </motion.section>

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

      {/* Bringing It Together */}
      <section aria-labelledby="combining">
        <h2
          id="combining"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Bringing It All Together
        </h2>

        <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            For important tasks, combine multiple patterns into a single prompt.
            Here is an example that uses all four patterns for a high-stakes
            document:
          </p>
        </div>

        <PromptExample
          title="Combined Approach: Client Proposal"
          description="A single prompt that applies all four reliability patterns."
          prompt={`I need to write a proposal for a new client project. Before we start:

1. Break this into sections — list the sections you would include and what each covers. Do not write any content yet.

2. For each section, note any specific facts, statistics, or claims that would need to be verified. If you are not confident about any factual details, flag them clearly rather than guessing.

3. For the overall approach, suggest 2 options for how we could structure the proposal (e.g. problem-first vs capabilities-first) with pros and cons of each.

4. List any assumptions you are making about the client, the project, or our capabilities.

Let me review your plan before you write anything.`}
          whenToUse="High-stakes documents: client proposals, compliance reports, board papers, anything where accuracy matters."
          className="mt-4"
        />
      </section>

      {/* Tip: Developer track has more */}
      <CalloutCard variant="info" title="For developers">
        <p>
          The developer track includes a more detailed section on{' '}
          <Link
            to={`/${track === 'general' ? 'developer' : track}/hallucinations`}
            className="text-primary hover:underline"
          >
            Avoiding Hallucinations
          </Link>{' '}
          with code-specific patterns, verification commands, and a structured
          agent harness for complex development work.
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
/*  Pattern Card Sub-Component                                                 */
/* -------------------------------------------------------------------------- */

function PatternCard({
  pattern,
  isLast,
}: {
  pattern: ReliableOutputPattern;
  isLast: boolean;
}) {
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
          <h3
            id={`pattern-${pattern.number}`}
            className="text-lg font-semibold"
          >
            {pattern.title}
          </h3>
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
      </div>

      <div className="mt-4">
        <PromptExample
          title={pattern.promptTitle}
          description={pattern.promptDescription}
          prompt={pattern.prompt}
        />
      </div>

      {!isLast && <Separator className="mt-8" />}
    </section>
  );
}
