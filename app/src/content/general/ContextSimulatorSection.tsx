import { Link } from 'react-router';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CalloutCard } from '@/components/content/CalloutCard';
import { PromptExample } from '@/components/content/PromptExample';
import { CodeBlock } from '@/components/content/CodeBlock';
import { ContextWindowSimulator } from '@/components/interactive/ContextWindowSimulator';
import { useTrack } from '@/hooks/useTrack';
import {
  sessionHandoffPrompt,
  compactInstructions,
  contextTipVariants,
} from '@/content/shared/context-simulator-data';

export function ContextSimulatorSection() {
  const { track } = useTrack();
  const isDev = track === 'developer';

  return (
    <div className="space-y-12">
      {/* ─────────────────────────────────────────────
          Area 1: Introduction
          ───────────────────────────────────────────── */}
      <section aria-labelledby="context-intro-heading">
        <div className="max-w-[65ch] space-y-4">
          <p className="text-base leading-relaxed">
            Every conversation with Claude happens inside a context window —
            200,000 tokens of working memory. Think of it as a desk: the more
            you pile on, the harder it is to find what you need. Understanding
            what is already on your desk when you start, and how it fills up as
            you work, is the single most useful thing you can learn about using
            Claude effectively.
          </p>
        </div>

        <CalloutCard variant="info" title="What is a token?" className="mt-6">
          <p>
            Roughly 0.75 words. 200,000 tokens is about 150,000 words — the
            length of two full novels. That sounds like a lot, but a surprising
            amount is used before you type your first message.
          </p>
        </CalloutCard>

        {isDev && (
          <CalloutCard
            variant="important"
            title="Technical note"
            className="mt-4"
          >
            <p>
              Claude's standard context window is 200,000 tokens. An extended
              1M-token window is available via the API (beta, usage tier 4,
              requires header{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                context-1m-2025-08-07
              </code>
              ), charged at premium rates (2x input, 1.5x output). Claude Code
              uses the 200K window by default.
            </p>
          </CalloutCard>
        )}

        {isDev && (
          <CalloutCard
            variant="info"
            title="Thinking tokens (extended & adaptive)"
            className="mt-4"
          >
            <p>
              Claude&apos;s extended thinking feature lets the model reason
              step-by-step before responding. With Opus 4.6, this has evolved
              into <strong>adaptive thinking</strong> — Claude dynamically
              decides how deeply to reason based on query complexity, controlled
              via the <code>effort</code> parameter. Thinking tokens are
              consumed during a turn but stripped afterwards — they do not
              permanently reduce your available context.
            </p>
          </CalloutCard>
        )}
      </section>

      {/* ─────────────────────────────────────────────
          Area 2: The Interactive Simulator
          ───────────────────────────────────────────── */}
      <section aria-labelledby="simulator-heading">
        <h2
          id="simulator-heading"
          className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Context Window Simulator
        </h2>
        <p className="mb-6 max-w-[65ch] text-sm text-muted-foreground">
          See how the 200,000-token context window is allocated. Adjust the
          settings, add conversation turns, and watch how the window fills up.
        </p>

        <ContextWindowSimulator isDev={isDev} />

        <CalloutCard variant="info" className="mt-4">
          <p className="text-xs">
            <strong>Note:</strong> These numbers are ballpark estimates. Exact
            token counts vary by Claude version, model, configuration, and
            content. The proportions are more important than the precise figures
            — they show how much of your context is spoken for before you begin.
          </p>
        </CalloutCard>
      </section>

      {/* ─────────────────────────────────────────────
          Area 2b: Session Hygiene
          ───────────────────────────────────────────── */}
      <section aria-labelledby="session-hygiene-heading">
        <h2
          id="session-hygiene-heading"
          className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          My Session Feels Slow — What Do I Do?
        </h2>
        <p className="mb-4 max-w-[65ch] text-sm text-muted-foreground">
          If Claude seems sluggish, repetitive, or less precise than when you
          started, the context window is likely getting full. Here is what to
          do:
        </p>

        <ol className="max-w-[65ch] list-inside list-decimal space-y-3 text-sm leading-relaxed">
          <li>
            <strong>Start a fresh session.</strong> It costs nothing and is
            almost always the right move. A clean context window gives Claude
            its full attention back immediately.
          </li>
          <li>
            <strong>Use a handoff prompt before closing.</strong> Ask Claude to
            summarise the current state so you can paste it into the new
            session. See{' '}
            <Link
              to={`/${track}/sessions`}
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Session Management
            </Link>{' '}
            for ready-made handoff templates.
          </li>
          {isDev && (
            <li>
              <strong>
                Check{' '}
                <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                  git status
                </code>{' '}
                before starting fresh.
              </strong>{' '}
              If you are using Claude Code, make sure you do not have
              uncommitted work before closing the session. A quick{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                git status
              </code>{' '}
              confirms nothing will be lost.
            </li>
          )}
          <li>
            <strong>Remember why this happens.</strong> The context window
            simulator above shows it clearly: as the window fills, Claude's
            attention is spread thinner across more content. Starting fresh is
            not losing progress — it is giving Claude room to think.
          </li>
        </ol>
      </section>

      {/* ─────────────────────────────────────────────
          Area 3: Educational Narrative
          ───────────────────────────────────────────── */}
      <section aria-labelledby="narrative-heading">
        <h2
          id="narrative-heading"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Understanding Context
        </h2>

        <Accordion
          type="single"
          collapsible
          defaultValue="why-matters"
          className="w-full"
        >
          {/* 3a. Why Does This Matter? */}
          <AccordionItem value="why-matters">
            <AccordionTrigger className="text-base font-medium">
              Why does this matter?
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-w-[65ch] space-y-4 text-sm leading-relaxed">
                <p>
                  When your context window fills up, Claude does not suddenly
                  "forget" things — but it becomes progressively less effective
                  at using information from the middle of your conversation.
                  This is a well-documented property of how large language
                  models process text (researchers call it "lost in the
                  middle"). The most recent things you said and the instructions
                  loaded at the start (your CLAUDE.md, system prompt) stay
                  strong. Everything in between gradually fades.
                </p>
                <p>
                  <strong>The practical result:</strong> Claude might re-read
                  files it already looked at, ask you questions you already
                  answered, ignore conventions you established earlier, or try
                  random solutions instead of reasoning through the problem.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 3b. Signs Your Context is Getting Full */}
          <AccordionItem value="signs">
            <AccordionTrigger className="text-base font-medium">
              Signs your context is getting full
            </AccordionTrigger>
            <AccordionContent>
              <ol className="max-w-[65ch] list-inside list-decimal space-y-2 text-sm leading-relaxed">
                <li>Claude asks about something you already told it</li>
                <li>Claude re-reads files it recently read</li>
                <li>
                  Claude ignores conventions established earlier in the session
                </li>
                <li>Responses become noticeably slower</li>
                <li>
                  Claude tries random approaches instead of reasoning through
                  the problem
                </li>
                {isDev && (
                  <>
                    <li>
                      The "compacting conversation" message appears (in Claude
                      Code)
                    </li>
                    <li>
                      <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                        /cost
                      </code>{' '}
                      shows high context usage percentage (in Claude Code)
                    </li>
                  </>
                )}
              </ol>
            </AccordionContent>
          </AccordionItem>

          {/* 3c. What Gets Lost in Compaction */}
          <AccordionItem value="compaction-loss">
            <AccordionTrigger className="text-base font-medium">
              What gets lost in compaction
            </AccordionTrigger>
            <AccordionContent>
              <div className="max-w-[65ch] space-y-4 text-sm leading-relaxed">
                <p>
                  When the context window is nearly full, Claude automatically
                  summarises (compacts) your conversation to free up space. This
                  preserves the gist but loses detail.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 font-medium text-emerald-700 dark:text-emerald-300">
                      What is preserved (summarised)
                    </p>
                    <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                      <li>Key decisions and their rationale</li>
                      <li>Current task state and progress</li>
                      <li>Important code snippets and patterns</li>
                      <li>Next steps identified</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-red-700 dark:text-red-300">
                      What is lost (dropped)
                    </p>
                    <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                      <li>Verbose file contents from earlier reads</li>
                      <li>Error traces from resolved issues</li>
                      <li>Trial-and-error iteration history</li>
                      <li>
                        Nuanced instructions given early in the conversation
                      </li>
                      <li>Specific phrasing and tone preferences</li>
                      <li>Detailed tool results from earlier operations</li>
                    </ul>
                  </div>
                </div>

                {isDev && (
                  <div className="space-y-3 rounded-md border border-border bg-muted/30 p-4">
                    <p className="text-sm font-medium">
                      How compaction works under the hood
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      When input tokens exceed ~80–95% of the window, Claude
                      generates a summary of the entire conversation. This
                      summary replaces all previous conversation history. The
                      system prompt, tool definitions, CLAUDE.md, and
                      environment context are reloaded fresh (not summarised).
                      The compaction typically frees ~50% of consumed context
                      tokens.
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium">Manual compaction:</p>
                      <p className="text-xs text-muted-foreground">
                        In Claude Code, run{' '}
                        <code className="rounded bg-muted px-1 py-0.5 font-mono">
                          /compact
                        </code>{' '}
                        at any time. You can provide focus instructions:
                      </p>
                      <ul className="list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
                        <li>
                          <code className="rounded bg-muted px-1 py-0.5 font-mono">
                            /compact
                          </code>{' '}
                          — general summarisation
                        </li>
                        <li>
                          <code className="rounded bg-muted px-1 py-0.5 font-mono">
                            /compact only keep the API patterns we established
                          </code>{' '}
                          — focused preservation
                        </li>
                        <li>
                          <code className="rounded bg-muted px-1 py-0.5 font-mono">
                            /compact preserve the coding patterns and file
                            structure
                          </code>{' '}
                          — targeted retention
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 3d. How to Get the Most from Your Context */}
          <AccordionItem value="tips">
            <AccordionTrigger className="text-base font-medium">
              How to get the most from your context
            </AccordionTrigger>
            <AccordionContent>
              <ol className="max-w-[65ch] list-inside list-decimal space-y-3 text-sm leading-relaxed">
                <li>
                  <strong>Start fresh for each task.</strong> One context window
                  per task. If the task is done, start a new session for the
                  next one.
                </li>
                <li>
                  <strong>Do not wait for degradation.</strong> Start a fresh
                  session when you are around 60–70% full — do not push through
                  until quality drops.
                </li>
                <li>
                  {isDev
                    ? contextTipVariants.tip3.developer
                    : contextTipVariants.tip3.general}
                </li>
                <li>
                  <strong>
                    Repeat important context in your latest message.
                  </strong>{' '}
                  The model pays strong attention to the most recent input
                  (recency bias).
                </li>
                <li>
                  {isDev
                    ? contextTipVariants.tip5.developer
                    : contextTipVariants.tip5.general}
                </li>
                {isDev && (
                  <>
                    <li>
                      <strong>Keep CLAUDE.md under ~500 lines.</strong> Move
                      reference material to skills (which load on-demand, not at
                      startup).
                    </li>
                    <li>
                      <strong>Disconnect unused MCP servers.</strong> Run{' '}
                      <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                        /mcp
                      </code>{' '}
                      to see token costs per server.
                    </li>
                    <li>
                      <strong>Use Tool Search</strong> (enabled by default since
                      v2.1.7+) to defer MCP tool loading.
                    </li>
                    <li>
                      <strong>
                        Set{' '}
                        <code className="rounded bg-muted px-1 py-0.5 font-mono">
                          disable-model-invocation: true
                        </code>
                      </strong>{' '}
                      on skills you only trigger manually — their descriptions
                      will not consume context.
                    </li>
                    <li>
                      <strong>Use subagents for file-heavy tasks</strong> —
                      their context is isolated from yours, so only the summary
                      returns.
                    </li>
                    <li>
                      <strong>
                        Run{' '}
                        <code className="rounded bg-muted px-1 py-0.5 font-mono">
                          /compact
                        </code>{' '}
                        proactively
                      </strong>{' '}
                      at ~60–70% rather than waiting for auto-compact. Provide
                      focus instructions to preserve what matters.
                    </li>
                    <li>
                      <strong>
                        Monitor usage with{' '}
                        <code className="rounded bg-muted px-1 py-0.5 font-mono">
                          /cost
                        </code>
                      </strong>{' '}
                      throughout a session.
                    </li>
                  </>
                )}
              </ol>
            </AccordionContent>
          </AccordionItem>

          {/* 3e. The Response Buffer (Developer only) */}
          {isDev && (
            <AccordionItem value="response-buffer">
              <AccordionTrigger className="text-base font-medium">
                The response buffer — the hidden reserve
              </AccordionTrigger>
              <AccordionContent>
                <div className="max-w-[65ch] space-y-3 text-sm leading-relaxed">
                  <p>
                    Claude Code reserves approximately 33,000–45,000 tokens
                    (roughly 20% of the window) as a buffer for generating
                    responses. This space is NOT available for your conversation
                    history.
                  </p>
                  <CalloutCard variant="tip" title="Key insight">
                    <p>
                      The "context remaining" percentage shown in Claude Code's
                      status bar includes this buffer. When it shows 20%
                      remaining, you may only have ~3.5% of true free space
                      before compaction triggers. This is why degradation
                      sometimes seems to happen "suddenly" — the available space
                      was smaller than the percentage suggested.
                    </p>
                  </CalloutCard>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </section>

      {/* ─────────────────────────────────────────────
          Area 3b: Token & API Budget Awareness
          ───────────────────────────────────────────── */}
      <section aria-labelledby="budget-awareness-heading">
        <h2
          id="budget-awareness-heading"
          className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Token Usage and Your Budget
        </h2>

        <CalloutCard
          variant="info"
          title="Practical cost awareness"
          className="mb-4"
        >
          <div className="space-y-2">
            <p>
              Claude Teams has usage limits — each conversation consumes tokens,
              and those tokens count against your plan. Understanding this helps
              you work more efficiently, not less.
            </p>
            <p>
              A typical session starts with around 50,000 tokens already used
              (system prompt, CLAUDE.md, loaded extensions). Aim to keep your
              working usage under 20,000–25,000 tokens per task by starting
              focused sessions and breaking large work into subtasks.
            </p>
          </div>
        </CalloutCard>

        <CalloutCard variant="tip" title="Keep your starting footprint small">
          <p>
            Every MCP server and extension loaded at session start consumes
            tokens before you type anything. Starting with fewer extensions
            means more tokens available for your actual work. Disconnect servers
            you are not actively using.
          </p>
        </CalloutCard>

        {isDev && (
          <CalloutCard variant="important" title="Claude Max" className="mt-4">
            <p>
              For heavy API and token usage (automated pipelines, large codebase
              work, many concurrent sessions), Claude Max at £180/month provides
              significantly higher rate limits. Worth considering once your
              team&apos;s usage consistently hits the Teams plan ceiling.
            </p>
          </CalloutCard>
        )}
      </section>

      {/* ─────────────────────────────────────────────
          Area 4: Session Handoff Prompt
          ───────────────────────────────────────────── */}
      <section aria-labelledby="handoff-heading">
        <h2
          id="handoff-heading"
          className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Session Handoff Prompt — Start Fresh Without Losing Progress
        </h2>

        <div className="mb-4 max-w-[65ch] space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <strong>How to use this:</strong> Copy this prompt and send it to
            Claude when your session is getting long (around 60–70% context
            usage, or when you notice signs of degradation). Claude will write a
            detailed summary. Copy that summary, start a fresh session, and
            paste it as your first message. You get a clean 200,000-token window
            with all the important context carried forward.
          </p>
        </div>

        <PromptExample
          title="Session Handoff Prompt"
          description="Ask Claude to write its own summary before you start a fresh session."
          prompt={sessionHandoffPrompt}
          whenToUse="When your session is getting long or you notice Claude repeating itself, forgetting things, or giving less specific answers."
        />

        <CalloutCard variant="tip" className="mt-4">
          <p className="text-xs">
            <strong>Tip:</strong> You can customise this prompt. If you are
            working on code, add "include the exact file paths and function
            names." If you are writing content, add "include the tone and style
            decisions we made." The more specific you are about what to
            preserve, the better the handoff.
          </p>
        </CalloutCard>

        {isDev && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-medium">
              Compact Instructions for CLAUDE.md
            </h3>
            <p className="mb-3 max-w-[65ch] text-sm text-muted-foreground">
              <strong>For Claude Code users:</strong> Add this section to your
              project CLAUDE.md to control what gets preserved during automatic
              compaction. Claude will reference these instructions when
              summarising your conversation.
            </p>
            <CodeBlock
              code={compactInstructions}
              language="markdown"
              title="Add to your CLAUDE.md"
            />
          </div>
        )}

        {/* Cross-reference to session management */}
        <div className="mt-6 rounded-md border border-border bg-muted/30 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            For more on session management — when to stop, how to break tasks
            into subtasks, and more copyable handoff templates — see{' '}
            <Link
              to={`/${track}/sessions`}
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Session Management
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
