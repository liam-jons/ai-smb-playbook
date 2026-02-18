import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/content/CodeBlock';
import { PromptExample } from '@/components/content/PromptExample';
import { CalloutCard } from '@/components/content/CalloutCard';
import { SetupStepCard } from '@/components/content/SetupStepCard';
import { useTrack } from '@/hooks/useTrack';
import { useSiteConfig, useOverlays } from '@/hooks/useClientConfig';
import { cn } from '@/lib/utils';
import { Clock, ChevronDown } from 'lucide-react';
import {
  generalSteps,
  devSteps,
  getFrameworkSections,
  storageOptions,
  brandVoiceSetupPrompt,
  ukEnglishSkillContent,
  brandReviewSkillContent,
} from '@/content/shared/brand-voice-data';

const sectionEntrance = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
};

// ─── Main Component ──────────────────────────────────────────────────────────

export function BrandVoiceSection() {
  const siteConfig = useSiteConfig();
  const overlays = useOverlays();
  const { track } = useTrack();
  const isGeneral = track === 'general';
  const [ukSkillOpen, setUkSkillOpen] = useState(false);
  const [brandReviewOpen, setBrandReviewOpen] = useState(false);
  const frameworkSections = getFrameworkSections(
    siteConfig,
    overlays.brandVoice?.frameworkExamples,
  );

  const brandTocEntries = [
    { id: 'brand-voice-uk-english', label: 'Part 1: UK English Enforcement' },
    { id: 'brand-voice-setup', label: 'Part 2: Brand Voice Setup' },
    { id: 'brand-voice-summary', label: 'Part 3: How It All Fits Together' },
  ];

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
          {brandTocEntries.map((entry) => (
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

      {/* Part 1: UK English */}
      <motion.section
        aria-labelledby="uk-english-heading"
        id="brand-voice-uk-english"
        {...sectionEntrance}
      >
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Part 1
            </Badge>
            <Badge className="bg-success-muted text-success-muted-foreground text-xs">
              <Clock className="mr-1 h-3 w-3" aria-hidden="true" />2 minutes
            </Badge>
          </div>
          <h2
            id="uk-english-heading"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            UK English Enforcement
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
            Claude defaults to US English because its training data is
            predominantly American. There is no global switch — but it takes two
            minutes to fix, and you will never have to think about it again.
          </p>
        </div>

        {/* Platform-specific setup */}
        {isGeneral ? (
          /* General track: show claude.ai/Desktop steps only */
          <div className="space-y-4">
            {generalSteps.map((step) => (
              <SetupStepCard key={step.number} step={step} />
            ))}
          </div>
        ) : (
          /* Developer track: tabs for all platforms */
          <Tabs defaultValue="code" className="w-full">
            <TabsList className="w-auto">
              <TabsTrigger value="web">claude.ai / Desktop</TabsTrigger>
              <TabsTrigger value="code">Claude Code</TabsTrigger>
            </TabsList>

            <TabsContent value="web" className="mt-4 space-y-4">
              {generalSteps.map((step) => (
                <SetupStepCard key={step.number} step={step} />
              ))}
            </TabsContent>

            <TabsContent value="code" className="mt-4 space-y-4">
              {devSteps.map((step) => (
                <SetupStepCard key={step.number} step={step} variant="code" />
              ))}

              <CalloutCard variant="info" title="Code context rule">
                In code contexts, UK English applies only to comments,
                documentation, and user-facing strings — never to variable
                names, function names, CSS properties, or API parameters. Write{' '}
                <code className="rounded bg-muted px-1 text-xs">
                  {'// Initialise the colour palette'}
                </code>{' '}
                but keep{' '}
                <code className="rounded bg-muted px-1 text-xs">
                  {'const color = getColor()'}
                </code>
                .
              </CalloutCard>
            </TabsContent>
          </Tabs>
        )}

        {/* UK English skill file */}
        <div className="mt-6">
          <Collapsible open={ukSkillOpen} onOpenChange={setUkSkillOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50"
              >
                <span>View full UK English skill file</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform duration-200',
                    ukSkillOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2">
                <CodeBlock
                  code={ukEnglishSkillContent}
                  language="markdown"
                  title="starter-kit/skills/uk-english/SKILL.md"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </motion.section>

      <Separator />

      {/* Part 2: Brand Voice */}
      <motion.section
        aria-labelledby="brand-voice-heading"
        id="brand-voice-setup"
        {...sectionEntrance}
        transition={{ ...sectionEntrance.transition, delay: 0.1 }}
      >
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Part 2
            </Badge>
            <Badge className="bg-warning-muted text-warning-muted-foreground text-xs">
              <Clock className="mr-1 h-3 w-3" aria-hidden="true" />
              30–60 minutes
            </Badge>
          </div>
          <h2
            id="brand-voice-heading"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Brand Voice Setup
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
            UK English is about language mechanics. Brand voice is about
            personality — how your organisation sounds, what it stands for, and
            how it adapts across different contexts. The skills in the starter
            kit provide a structured framework for documenting your brand voice
            through a guided conversation with Claude.
          </p>
        </div>

        {/* What to prepare */}
        <div className="mb-8" id="brand-voice-preparation">
          <h3 className="mb-3 text-base font-semibold text-foreground">
            What to Prepare Before Starting
          </h3>
          <div className="space-y-3">
            <div className="rounded-md border-l-2 border-success/40 bg-success-muted/30 px-4 py-3">
              <span className="text-xs font-medium text-success-muted-foreground">
                Minimum required
              </span>
              <p className="mt-1 text-sm text-muted-foreground">
                A willingness to make decisions about how the brand
                communicates. No prior documentation is strictly necessary.
              </p>
            </div>
            <div className="rounded-md border-l-2 border-info/40 bg-info-muted/30 px-4 py-3">
              <span className="text-xs font-medium text-info-muted-foreground">
                Strongly recommended
              </span>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                <li>
                  2–3 examples of on-brand content (website copy, marketing
                  emails, social posts)
                </li>
                <li>A basic understanding of the target audience</li>
                <li>
                  Known terminology preferences (product names, industry terms)
                </li>
              </ul>
            </div>
            <div className="rounded-md border-l-2 border-important/40 bg-important-muted/30 px-4 py-3">
              <span className="text-xs font-medium text-important-muted-foreground">
                Nice to have
              </span>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                <li>Existing brand style guide or tone of voice document</li>
                <li>Examples of off-brand content</li>
                <li>Competitor examples</li>
              </ul>
            </div>
          </div>

          <CalloutCard
            variant="tip"
            title="Brand voice head start"
            className="mt-4"
          >
            {overlays.brandVoice?.headStartContent ??
              'The website scrape has already captured brand-relevant content — key values, tone observations, and sector terminology. Bring these to the setup conversation as a starting point.'}
          </CalloutCard>
        </div>

        {/* Seven framework sections */}
        <div
          className="mb-8 border-t border-border pt-8"
          id="brand-voice-framework"
        >
          <h3 className="mb-3 text-base font-semibold text-foreground">
            The Seven Framework Sections
          </h3>
          <p className="mb-4 max-w-prose text-sm text-muted-foreground">
            The brand-voice and brand-review skills guide you through seven
            areas. Here is what each covers and an illustrative example.
          </p>

          <Accordion type="single" collapsible className="space-y-1">
            {frameworkSections.map((section) => {
              const Icon = section.icon;
              return (
                <AccordionItem
                  key={section.number}
                  value={String(section.number)}
                  className="rounded-lg border border-border px-4"
                >
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    <span className="flex items-center gap-3">
                      <Icon
                        className="h-4 w-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span>
                        {section.number}. {section.title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pb-4 pt-1">
                    <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
                      {section.description}
                    </p>
                    <div className="rounded-md border-l-2 border-accent-foreground/20 bg-muted/30 px-4 py-3">
                      <span className="text-xs font-medium text-muted-foreground">
                        Example
                      </span>
                      <p className="mt-1 text-sm text-foreground">
                        {section.clientExample}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* Setup prompt */}
        <div
          className="mb-8 border-t border-border pt-8"
          id="brand-voice-kickoff"
        >
          <h3 className="mb-3 text-base font-semibold text-foreground">
            Kick Off the Brand Voice Setup
          </h3>
          <p className="mb-4 max-w-prose text-sm text-muted-foreground">
            {isGeneral
              ? 'Copy this prompt, open Claude Desktop or claude.ai, and paste it in. Claude will guide you through the process step by step. No technical skills needed.'
              : 'Copy this prompt to start the brand voice documentation process. Ensure the brand-voice skill is loaded in your environment for best results.'}
          </p>

          <PromptExample
            title="Brand Voice Setup Prompt"
            description="Start a guided brand voice documentation session with Claude"
            prompt={brandVoiceSetupPrompt}
            context="Fill in the bracketed sections with your company's details before pasting."
            whenToUse="When you want to create or update your organisation's brand voice document"
          />

          <CalloutCard
            variant="tip"
            title="Team session recommended"
            className="mt-4"
          >
            This works best when a few people contribute — book 45 minutes with
            whoever knows the brand best. You can run it as a group exercise in
            a single Claude conversation.
          </CalloutCard>
        </div>

        {/* Where to save */}
        <div
          className="mb-8 border-t border-border pt-8"
          id="brand-voice-storage"
        >
          <h3 className="mb-3 text-base font-semibold text-foreground">
            Where to Save the Brand Voice Document
          </h3>
          <p className="mb-4 max-w-prose text-sm text-muted-foreground">
            Once the conversation produces a brand voice document, save it where
            Claude can access it in future sessions. The brand voice document is
            a <strong>living document</strong> — review it when the brand
            evolves, messaging changes, or new products launch.
          </p>

          {/* Mobile: card layout */}
          <div className="space-y-3 sm:hidden">
            {storageOptions
              .filter((o) =>
                isGeneral ? o.environment !== 'Claude Code' : true,
              )
              .map((option, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border p-4 space-y-2"
                >
                  <p className="text-sm font-medium text-foreground">
                    {option.environment}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                      Where:{' '}
                    </span>
                    {option.where}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                      How:{' '}
                    </span>
                    {option.how}
                  </p>
                </div>
              ))}
          </div>

          {/* Desktop: table layout */}
          <div className="hidden overflow-x-auto rounded-lg border border-border sm:block">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Environment
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Where to store
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    How it works
                  </th>
                </tr>
              </thead>
              <tbody>
                {storageOptions
                  .filter((o) =>
                    isGeneral ? o.environment !== 'Claude Code' : true,
                  )
                  .map((option, i) => (
                    <tr
                      key={i}
                      className={cn(
                        'border-b border-border last:border-b-0',
                        i % 2 === 0
                          ? 'bg-transparent'
                          : 'bg-muted/20 dark:bg-muted/40',
                      )}
                    >
                      <td className="px-3 py-2.5 font-medium text-foreground">
                        {option.environment}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {option.where}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {option.how}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Brand Review */}
        <div
          className="mb-8 border-t border-border pt-8"
          id="brand-voice-review"
        >
          <h3 className="mb-3 text-base font-semibold text-foreground">
            Using Brand Review for Ongoing Content Checking
          </h3>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            {isGeneral
              ? 'Once you have a brand voice document, the brand-review skill checks content against it. Simply ask Claude: "Review this content against our brand guidelines" or "Check this blog post against our brand voice document". Claude gives you a summary, detailed findings, and suggested revisions.'
              : 'The brand-review skill is available as both a skill (natural language on claude.ai/Desktop) and a command (/brand-review in Claude Code). It checks voice and tone, terminology, messaging pillar alignment, style guide compliance (including UK English), and legal/compliance flags.'}
          </p>

          {!isGeneral && (
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>In Claude Code:</strong> Invoke with{' '}
                <code className="rounded bg-muted px-1 text-xs">
                  /brand-review
                </code>
              </p>
              <p>
                <strong>In claude.ai / Claude Desktop:</strong> Ask naturally —
                &ldquo;Review this content against our brand guidelines&rdquo;
              </p>
            </div>
          )}

          <CalloutCard
            variant="info"
            title="Session management tip"
            className="mt-4"
          >
            Claude gives you better feedback when it has room to think. If you
            have spent a long conversation creating content, start a fresh
            session for the review — load your brand voice document, paste the
            content, and ask for a review.
          </CalloutCard>

          {/* Brand review skill file */}
          <div className="mt-4">
            <Collapsible
              open={brandReviewOpen}
              onOpenChange={setBrandReviewOpen}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50"
                >
                  <span>View full brand-review skill file</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform duration-200',
                      brandReviewOpen && 'rotate-180',
                    )}
                    aria-hidden="true"
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2">
                  <CodeBlock
                    code={brandReviewSkillContent}
                    language="markdown"
                    title="starter-kit/skills/brand-review/SKILL.md"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Developer-specific extras */}
        {!isGeneral && (
          <div className="space-y-4">
            <CalloutCard variant="tip" title="Governance note">
              Both the brand-voice and brand-review skills are Tier 1 extensions
              (internal, read-only, no external data access). Log them in the AI
              Extension Register per{' '}
              <Link
                to={`/${track}/governance`}
                className="font-semibold text-primary hover:underline"
              >
                Section 1.5 — AI Governance Policy
              </Link>
              .
            </CalloutCard>

            <CalloutCard variant="info" title="Skill design reference">
              The brand-voice and brand-review SKILL.md files are examples of
              well-structured skill design — note the WHEN/WHEN NOT description
              pattern, clear sections, and comprehensive coverage. See{' '}
              <Link
                to={`/${track}/skills-extensions`}
                className="font-semibold text-primary hover:underline"
              >
                Section 1.4 — Skills, Extensions &amp; Decision Tree
              </Link>{' '}
              for more on skill design patterns.
            </CalloutCard>
          </div>
        )}
      </motion.section>

      <Separator />

      {/* Part 3: How It All Fits Together */}
      <motion.section
        aria-labelledby="together-heading"
        id="brand-voice-summary"
        {...sectionEntrance}
        transition={{ ...sectionEntrance.transition, delay: 0.2 }}
      >
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Part 3
          </Badge>
        </div>
        <h2
          id="together-heading"
          className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          How It All Fits Together
        </h2>
        <p className="mb-6 max-w-prose text-sm leading-relaxed text-muted-foreground">
          UK English enforcement and brand voice documentation are complementary
          layers. Start with the quick win today. Plan the brand voice exercise
          for a team session in the next fortnight.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Quick win card */}
          <div className="rounded-lg border border-success-muted bg-success-muted/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Badge className="bg-success-muted text-success-muted-foreground text-xs">
                Quick win
              </Badge>
              <span className="text-xs text-muted-foreground">2 minutes</span>
            </div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              UK English Enforcement
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success/50"
                  aria-hidden="true"
                />
                Profile preferences
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success/50"
                  aria-hidden="true"
                />
                Project instructions
              </li>
              {!isGeneral && (
                <li className="flex items-start gap-2">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success/50"
                    aria-hidden="true"
                  />
                  CLAUDE.md rule
                </li>
              )}
              <li className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success/50"
                  aria-hidden="true"
                />
                UK English skill (belt-and-braces)
              </li>
            </ul>
          </div>

          {/* Deeper exercise card */}
          <div className="rounded-lg border border-warning-muted bg-warning-muted/30 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Badge className="bg-warning-muted text-warning-muted-foreground text-xs">
                Deeper exercise
              </Badge>
              <span className="text-xs text-muted-foreground">
                30–60 minutes
              </span>
            </div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Brand Voice Documentation
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning/50"
                  aria-hidden="true"
                />
                brand-voice skill (framework)
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning/50"
                  aria-hidden="true"
                />
                Guided conversation
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning/50"
                  aria-hidden="true"
                />
                Brand voice document (output)
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning/50"
                  aria-hidden="true"
                />
                brand-review (ongoing checks)
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Cross-references */}
      <Separator />
      <motion.section
        aria-labelledby="brand-cross-ref-heading"
        id="brand-voice-related"
        {...sectionEntrance}
        transition={{ ...sectionEntrance.transition, delay: 0.25 }}
      >
        <h2
          id="brand-cross-ref-heading"
          className="mb-4 text-lg font-semibold tracking-tight"
        >
          Related Sections
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            For more on how skills work and when to use them, see{' '}
            <Link
              to={`/${track}/skills-extensions`}
              className="font-semibold text-primary hover:underline"
            >
              Section 1.4 — Skills, Extensions &amp; Decision Tree
            </Link>
            .
          </p>
          <p>
            To register these skills in your governance process, see{' '}
            <Link
              to={`/${track}/governance`}
              className="font-semibold text-primary hover:underline"
            >
              Section 1.5 — AI Governance Policy
            </Link>
            .
          </p>
        </div>
      </motion.section>
    </div>
  );
}
