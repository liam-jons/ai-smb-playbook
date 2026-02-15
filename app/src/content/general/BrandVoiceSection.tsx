import { useState } from 'react';
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
import { CopyButton } from '@/components/content/CopyButton';
import { useTrack } from '@/hooks/useTrack';
import { cn } from '@/lib/utils';
import {
  Clock,
  ChevronDown,
  Palette,
  Type,
  Megaphone,
  Users,
  MessageCircle,
  ListChecks,
  Globe2,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface SetupStep {
  number: number;
  title: string;
  time: string;
  content: string;
  copyableText?: string;
  copyableTitle?: string;
}

interface FrameworkSection {
  number: number;
  title: string;
  description: string;
  phewExample: string;
  icon: typeof Palette;
}

interface StorageOption {
  environment: string;
  where: string;
  how: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const profilePreferencesText = `Always use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (\u00a3) for currency.`;

const projectInstructionText = `Always use UK English spelling and grammar in all responses.`;

const claudeMdSnippet = `## Style

- **UK English throughout.** All output must use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (\u00a3) for currency.`;

const britfixConfig = `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "/absolute/path/to/britfix/run-hook.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}`;

const brandVoiceSetupPrompt = `I'd like to create a comprehensive brand voice document for our company. Please guide me through the process step by step, covering all seven areas:

1. Brand Personality
2. Voice Attributes (3-5 attributes with "we are / we are not / sounds like" definitions)
3. Audience Awareness
4. Core Messaging Pillars
5. Tone Spectrum (how our voice adapts across channels and situations)
6. Style Rules (grammar, formatting, punctuation decisions)
7. Terminology (preferred terms, product names, inclusive language)

Here's what I can share to start:

**Company:** [Company name]
**What we do:** [Brief description]
**Who we serve:** [Primary audience]

**Examples of content that sounds like us:**
[Paste 2-3 examples of on-brand content \u2014 website copy, emails, social posts]

**Examples of content that does NOT sound like us (if available):**
[Paste any examples that felt off-brand]

**Existing guidelines (if any):**
[Paste or describe any existing brand/style guidelines]

Please work through each section one at a time, asking me questions and presenting options before moving to the next. When we're done, compile everything into a single brand voice document I can save and reuse.`;

const ukEnglishSkillContent = `---
name: uk-english
description: Enforce UK English spelling, grammar, and conventions in all output. Use when writing, reviewing, or editing any content for UK audiences.
---

# UK English

All output must use UK English spelling, grammar, and conventions.

## Spelling Rules

Use British English spellings throughout:
- -ise endings (not -ize): organise, recognise, specialise, optimise
- -our endings (not -or): colour, behaviour, favour, honour
- -re endings (not -er): centre, metre, theatre (except for computer-related "center" in CSS/code)
- -ence endings where applicable: licence (noun), defence, offence
- Double L: travelling, modelling, labelling, cancelled
- Other: grey (not gray), programme (not program, unless computer program), cheque (not check, for banking)

## Grammar Conventions

- Collective nouns may take plural verbs: "the team are working on..."
- "Whilst", "amongst", "towards" are preferred over "while", "among", "toward"
- Past tense: "learnt", "spelt", "dreamt" are acceptable alongside "learned", "spelled", "dreamed"

## Formatting Conventions

- Dates: DD/MM/YYYY or DD Month YYYY (e.g., 14/02/2026 or 14 February 2026)
- Currency: GBP, use \u00a3 symbol (e.g., \u00a3500, not $500)
- Time: 24-hour format preferred in formal contexts (e.g., 14:00), 12-hour acceptable informally (e.g., 2pm -- no space, no full stops in am/pm)
- Quotation marks: single quotes for primary quotation, double quotes for quotes within quotes
- Full stops and commas go outside closing quotation marks unless part of the quoted material

## In Code Contexts

- Use UK English only in comments, documentation, and user-facing strings
- Never change variable names, function names, CSS properties, or API parameters (these follow their language's conventions, typically US English)
- Example: write \`// Initialise the colour palette\` but keep \`const color = getColor()\``;

const brandReviewSkillContent = `---
name: brand-review
description: >
  Review content against brand voice, style guidelines, and messaging standards.
  WHEN the user asks to review, check, or audit content against brand guidelines,
  or wants feedback on whether content matches their brand voice.
  WHEN NOT the user is creating new content (use brand-voice skill instead).
---

# Brand Review

Review marketing content against brand voice, style guidelines, and messaging standards. Flag deviations and provide specific improvement suggestions.

## Inputs

1. **Content to review** \u2014 accept content in any of these forms:
   - Pasted directly into the conversation
   - A file path or document reference
   - A URL to a published page
   - Multiple pieces for batch review

2. **Brand guidelines source** (determined automatically):
   - If a brand style guide or brand voice document is available in the project/conversation, use it automatically
   - If not available, ask the user if they have guidelines to share

## Review Process

### With Brand Guidelines Configured

Evaluate content against:
- **Voice and Tone** \u2014 does it match brand voice attributes?
- **Terminology and Language** \u2014 are preferred terms used correctly?
- **Messaging Pillars** \u2014 does it align with key themes?
- **Style Guide Compliance** \u2014 grammar, UK English, formatting
- **Legal/Compliance Flags** \u2014 unsubstantiated claims, missing disclaimers

### Without Brand Guidelines (Generic Review)

Evaluate for clarity, consistency, and professionalism.

## Output Format

- Summary: overall assessment, strengths, improvements
- Detailed Findings: table with issue, location, severity (High/Medium/Low), suggestion
- Revised Sections: before/after for top issues
- Legal/Compliance Flags: listed separately with actions`;

const generalSteps: SetupStep[] = [
  {
    number: 1,
    title: 'Set profile preferences',
    time: '30 seconds',
    content:
      'Navigate to claude.ai, click your initials (bottom-left), go to Settings > Profile, and add the following to the preferences text box. This applies to every conversation automatically, on both claude.ai and Claude Desktop.',
    copyableText: profilePreferencesText,
    copyableTitle: 'Profile preferences text',
  },
  {
    number: 2,
    title: 'Add project instruction',
    time: '30 seconds per project',
    content:
      'For any shared claude.ai Project, add this to Custom Instructions. This is the closest thing to an admin-enforced setting \u2014 the project owner sets it once and all team members inherit it.',
    copyableText: projectInstructionText,
    copyableTitle: 'Project instruction text',
  },
  {
    number: 3,
    title: 'Upload the UK English skill (optional belt-and-braces)',
    time: '2 minutes',
    content:
      'The starter kit includes a UK English skill file. Upload it via the Teams admin console (recommended \u2014 provisions to all users automatically), claude.ai Project knowledge, or Claude Desktop Settings > Capabilities > Skills (ZIP format). The skill contains comprehensive rules covering spelling, grammar, formatting, and code contexts.',
  },
];

const devSteps: SetupStep[] = [
  {
    number: 1,
    title: 'CLAUDE.md rule',
    time: '30 seconds',
    content:
      'Add this to every project\'s CLAUDE.md under a "Style" or "Critical Rules" heading. This is version-controlled \u2014 it ships with the repo, so all developers get it automatically. If you do nothing else, add this one line.',
    copyableText: claudeMdSnippet,
    copyableTitle: 'CLAUDE.md UK English snippet',
  },
  {
    number: 2,
    title: 'Britfix hook (advanced, if issues persist)',
    time: '5 minutes',
    content:
      'An open-source post-processing hook that automatically converts US English to UK English in files written by Claude Code. Context-aware: only converts comments and docstrings, never identifiers or string literals. The CLAUDE.md rule handles 95% of cases. If you find persistent issues in a particular project, Britfix catches the rest automatically. Note: this is a Tier 2 extension (hook that modifies files automatically) \u2014 follow the approval process in the governance policy.',
    copyableText: britfixConfig,
    copyableTitle: 'Britfix hook configuration',
  },
];

const frameworkSections: FrameworkSection[] = [
  {
    number: 1,
    title: 'Brand Personality',
    description:
      'Define the brand as if it were a person. What are its defining traits? This creates the foundation everything else builds on.',
    phewExample:
      'If Phew! were a person, they would be the knowledgeable colleague who explains safeguarding technology simply, celebrates your wins genuinely, and never talks down to you. Friendly but never flippant when the subject matter is serious.',
    icon: Palette,
  },
  {
    number: 2,
    title: 'Voice Attributes',
    description:
      'Select 3\u20135 attributes that define how the brand communicates. Each should have a "we are / we are not / sounds like" definition to prevent misinterpretation.',
    phewExample:
      'Approachable: We are friendly, clear, and jargon-free. We are not dumbed-down or lacking substance. Sounds like: "Here\'s how to get started \u2014 it takes about five minutes."',
    icon: MessageCircle,
  },
  {
    number: 3,
    title: 'Audience Awareness',
    description:
      'Who the brand speaks to, what they care about, what level of expertise they have, and how they expect to be addressed.',
    phewExample:
      'Primary: safeguarding leads and public sector decision-makers. They need confidence that the technology works and meets compliance requirements. They are experts in safeguarding but not necessarily in software.',
    icon: Users,
  },
  {
    number: 4,
    title: 'Core Messaging Pillars',
    description:
      '3\u20135 key themes the brand consistently communicates. The hierarchy of these messages and how each connects to audience needs.',
    phewExample:
      'Pillar 1: Safeguarding made simpler. Pillar 2: Built for the people who do the work. Pillar 3: Trusted, certified, accountable (ISO 9001/27001, Cyber Essentials Plus).',
    icon: Megaphone,
  },
  {
    number: 5,
    title: 'Tone Spectrum',
    description:
      'How the voice adapts across channels and situations whilst remaining recognisably the same brand. The voice stays constant; the tone dials attributes up or down.',
    phewExample:
      'Product launch: dial up confidence. Incident response: dial up empathy and transparency. Training materials: dial up patience and clarity. The Phew! voice is always present, but the emphasis shifts.',
    icon: Globe2,
  },
  {
    number: 6,
    title: 'Style Rules',
    description:
      'Specific grammar, formatting, and language decisions: Oxford comma, sentence case vs title case, contractions, date formats. This is where UK English enforcement lives within the broader brand framework.',
    phewExample:
      'UK English throughout (see Part 1 of this section). Sentence case for headings. Contractions in informal content, avoid in formal documents. DD/MM/YYYY dates. \u00a3 for currency.',
    icon: Type,
  },
  {
    number: 7,
    title: 'Terminology',
    description:
      'Preferred and avoided terms, product names, inclusive language guidelines. Maintaining consistency across all communications.',
    phewExample:
      'Use "safeguarding partnership" (not "LSCP"). Use "learning management system" on first mention, then "LMS". Never use "users" when you mean "safeguarding professionals" or "partners".',
    icon: ListChecks,
  },
];

const storageOptions: StorageOption[] = [
  {
    environment: 'Claude Desktop / claude.ai',
    where: 'Project knowledge file',
    how: 'Add the document to a project\'s knowledge base. Claude loads it automatically for all conversations in that project.',
  },
  {
    environment: 'Claude Code',
    where: 'Skill file in ~/.claude/skills/ or project skills directory',
    how: 'Claude loads skill files into context automatically when relevant.',
  },
  {
    environment: 'Claude Code',
    where: 'Referenced in CLAUDE.md',
    how: 'Add a reference to the brand voice file location so Claude knows where to find it.',
  },
  {
    environment: 'Any environment',
    where: 'Pasted into conversation',
    how: 'Paste the document at the start of any session. Least efficient but always works.',
  },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export function BrandVoiceSection() {
  const { track } = useTrack();
  const isGeneral = track === 'general';
  const [ukSkillOpen, setUkSkillOpen] = useState(false);
  const [brandReviewOpen, setBrandReviewOpen] = useState(false);

  return (
    <div className="space-y-12">
      {/* Part 1: UK English */}
      <section aria-labelledby="uk-english-heading">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Part 1
            </Badge>
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs">
              <Clock className="mr-1 h-3 w-3" aria-hidden="true" />
              2 minutes
            </Badge>
          </div>
          <h2
            id="uk-english-heading"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            UK English Enforcement
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
            Claude defaults to US English because its training data is predominantly American.
            There is no global switch \u2014 but it takes two minutes to fix, and you will never have
            to think about it again.
          </p>
        </div>

        {/* Platform-specific setup */}
        {isGeneral ? (
          /* General track: show claude.ai/Desktop steps only */
          <div className="space-y-4">
            {generalSteps.map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-4 rounded-lg border border-border px-4 py-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {step.number}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {step.title}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {step.time}
                    </Badge>
                  </div>
                  <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
                    {step.content}
                  </p>
                  {step.copyableText && (
                    <div className="group relative mt-3 rounded-md border border-border bg-muted/40 p-3">
                      <CopyButton
                        text={step.copyableText}
                        className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                      />
                      <pre className="whitespace-pre-wrap pr-10 text-sm leading-relaxed text-foreground">
                        {step.copyableText}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
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
                <div
                  key={step.number}
                  className="flex items-start gap-4 rounded-lg border border-border px-4 py-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {step.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {step.title}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {step.time}
                      </Badge>
                    </div>
                    <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
                      {step.content}
                    </p>
                    {step.copyableText && (
                      <div className="group relative mt-3 rounded-md border border-border bg-muted/40 p-3">
                        <CopyButton
                          text={step.copyableText}
                          className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                        />
                        <pre className="whitespace-pre-wrap pr-10 text-sm leading-relaxed text-foreground">
                          {step.copyableText}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="code" className="mt-4 space-y-4">
              {devSteps.map((step) => (
                <div
                  key={step.number}
                  className="flex items-start gap-4 rounded-lg border border-border px-4 py-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {step.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {step.title}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {step.time}
                      </Badge>
                    </div>
                    <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
                      {step.content}
                    </p>
                    {step.copyableText && (
                      <div className="mt-3">
                        <CodeBlock
                          code={step.copyableText}
                          language={step.number === 2 ? 'json' : 'markdown'}
                          title={step.copyableTitle}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <CalloutCard variant="info" title="Code context rule">
                In code contexts, UK English applies only to comments, documentation, and
                user-facing strings \u2014 never to variable names, function names, CSS properties,
                or API parameters. Write{' '}
                <code className="rounded bg-muted px-1 text-xs">
                  {'// Initialise the colour palette'}
                </code>{' '}
                but keep{' '}
                <code className="rounded bg-muted px-1 text-xs">
                  {'const color = getColor()'}
                </code>.
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
                    ukSkillOpen && 'rotate-180'
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
      </section>

      <Separator />

      {/* Part 2: Brand Voice */}
      <section aria-labelledby="brand-voice-heading">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Part 2
            </Badge>
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs">
              <Clock className="mr-1 h-3 w-3" aria-hidden="true" />
              30\u201360 minutes
            </Badge>
          </div>
          <h2
            id="brand-voice-heading"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Brand Voice Setup
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
            UK English is about language mechanics. Brand voice is about personality \u2014 how your
            organisation sounds, what it stands for, and how it adapts across different contexts.
            The brand-voice skill provides a structured framework for documenting your brand
            voice through a guided conversation with Claude.
          </p>
        </div>

        {/* What to prepare */}
        <div className="mb-8">
          <h3 className="mb-3 text-base font-semibold text-foreground">
            What to Prepare Before Starting
          </h3>
          <div className="space-y-3">
            <div className="rounded-md border-l-2 border-emerald-500/40 bg-emerald-50/30 px-4 py-3 dark:bg-emerald-950/10">
              <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                Minimum required
              </span>
              <p className="mt-1 text-sm text-muted-foreground">
                A willingness to make decisions about how the brand communicates. No prior
                documentation is strictly necessary.
              </p>
            </div>
            <div className="rounded-md border-l-2 border-blue-500/40 bg-blue-50/30 px-4 py-3 dark:bg-blue-950/10">
              <span className="text-xs font-medium text-blue-800 dark:text-blue-300">
                Strongly recommended
              </span>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                <li>2\u20133 examples of on-brand content (website copy, marketing emails, social posts)</li>
                <li>A basic understanding of the target audience</li>
                <li>Known terminology preferences (product names, industry terms)</li>
              </ul>
            </div>
            <div className="rounded-md border-l-2 border-violet-500/40 bg-violet-50/30 px-4 py-3 dark:bg-violet-950/10">
              <span className="text-xs font-medium text-violet-800 dark:text-violet-300">
                Nice to have
              </span>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                <li>Existing brand style guide or tone of voice document</li>
                <li>Examples of off-brand content</li>
                <li>Competitor examples</li>
              </ul>
            </div>
          </div>

          <CalloutCard variant="tip" title="Head start for Phew!" className="mt-4">
            The website scrape has already captured brand-relevant content \u2014 IMPACT values, tone
            observations, and sector terminology. Bring these to the setup conversation as a
            starting point.
          </CalloutCard>
        </div>

        {/* Seven framework sections */}
        <div className="mb-8">
          <h3 className="mb-3 text-base font-semibold text-foreground">
            The Seven Framework Sections
          </h3>
          <p className="mb-4 max-w-prose text-sm text-muted-foreground">
            The brand-voice skill guides you through seven areas. Here is what each covers and
            an illustrative example.
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
                        Phew! example
                      </span>
                      <p className="mt-1 text-sm text-foreground">{section.phewExample}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* Setup prompt */}
        <div className="mb-8">
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
            whenToUse="When you want to create or update your organisation's brand voice document"
          />

          <CalloutCard variant="tip" title="Team session recommended" className="mt-4">
            This works best when a few people contribute \u2014 book 45 minutes with whoever knows
            the brand best. You can run it as a group exercise in a single Claude conversation.
          </CalloutCard>
        </div>

        {/* Where to save */}
        <div className="mb-8">
          <h3 className="mb-3 text-base font-semibold text-foreground">
            Where to Save the Brand Voice Document
          </h3>
          <p className="mb-4 max-w-prose text-sm text-muted-foreground">
            Once the conversation produces a brand voice document, save it where Claude can
            access it in future sessions. The brand voice document is a{' '}
            <strong>living document</strong> \u2014 review it when the brand evolves, messaging
            changes, or new products launch.
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th scope="col" className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Environment
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Where to store
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    How it works
                  </th>
                </tr>
              </thead>
              <tbody>
                {storageOptions
                  .filter((o) => isGeneral ? o.environment !== 'Claude Code' : true)
                  .map((option, i) => (
                    <tr
                      key={i}
                      className={cn(
                        'border-b border-border last:border-b-0',
                        i % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'
                      )}
                    >
                      <td className="px-3 py-2.5 font-medium text-foreground">
                        {option.environment}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">{option.where}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{option.how}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Brand Review */}
        <div className="mb-8">
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
                <code className="rounded bg-muted px-1 text-xs">/brand-review</code>
              </p>
              <p>
                <strong>In claude.ai / Claude Desktop:</strong> Ask naturally \u2014 &ldquo;Review
                this content against our brand guidelines&rdquo;
              </p>
            </div>
          )}

          <CalloutCard variant="info" title="Session management tip" className="mt-4">
            Claude gives you better feedback when it has room to think. If you have spent a long
            conversation creating content, start a fresh session for the review \u2014 load your brand
            voice document, paste the content, and ask for a review.
          </CalloutCard>

          {/* Brand review skill file */}
          <div className="mt-4">
            <Collapsible open={brandReviewOpen} onOpenChange={setBrandReviewOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50"
                >
                  <span>View full brand-review skill file</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform duration-200',
                      brandReviewOpen && 'rotate-180'
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
              Both the brand-voice and brand-review skills are Tier 1 extensions (internal,
              read-only, no external data access). Log them in the AI Extension Register per{' '}
              <strong>Section 1.5 \u2014 AI Governance Policy</strong>.
            </CalloutCard>

            <CalloutCard variant="info" title="Skill design reference">
              The brand-voice SKILL.md file is an example of well-structured skill design \u2014 note
              the WHEN/WHEN NOT description pattern, clear sections, and comprehensive coverage.
              See <strong>Section 1.4 \u2014 Skills, Extensions &amp; Decision Tree</strong> for
              more on skill design patterns.
            </CalloutCard>
          </div>
        )}
      </section>

      <Separator />

      {/* Part 3: How It All Fits Together */}
      <section aria-labelledby="together-heading">
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
          UK English enforcement and brand voice documentation are complementary layers. Start
          with the quick win today. Plan the brand voice exercise for a team session in the next
          fortnight.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Quick win card */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4 dark:border-emerald-800/40 dark:bg-emerald-950/10">
            <div className="mb-3 flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs">
                Quick win
              </Badge>
              <span className="text-xs text-muted-foreground">2 minutes</span>
            </div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              UK English Enforcement
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/50" aria-hidden="true" />
                Profile preferences
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/50" aria-hidden="true" />
                Project instructions
              </li>
              {!isGeneral && (
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/50" aria-hidden="true" />
                  CLAUDE.md rule
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/50" aria-hidden="true" />
                UK English skill (belt and braces)
              </li>
            </ul>
          </div>

          {/* Deeper exercise card */}
          <div className="rounded-lg border border-amber-200 bg-amber-50/30 p-4 dark:border-amber-800/40 dark:bg-amber-950/10">
            <div className="mb-3 flex items-center gap-2">
              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-xs">
                Deeper exercise
              </Badge>
              <span className="text-xs text-muted-foreground">30\u201360 minutes</span>
            </div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              Brand Voice Documentation
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/50" aria-hidden="true" />
                brand-voice skill (framework)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/50" aria-hidden="true" />
                Guided conversation
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/50" aria-hidden="true" />
                Brand voice document (output)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/50" aria-hidden="true" />
                brand-review (ongoing checks)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Cross-references */}
      <Separator />
      <section aria-labelledby="brand-cross-ref-heading">
        <h2
          id="brand-cross-ref-heading"
          className="mb-4 text-lg font-semibold tracking-tight"
        >
          Related Sections
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            For more on how skills work and when to use them, see{' '}
            <strong>Section 1.4 \u2014 Skills, Extensions &amp; Decision Tree</strong>.
          </p>
          <p>
            To register these skills in your governance process, see{' '}
            <strong>Section 1.5 \u2014 AI Governance Policy</strong>.
          </p>
        </div>
      </section>
    </div>
  );
}
