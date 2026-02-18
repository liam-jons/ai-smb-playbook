import {
  Globe2,
  ListChecks,
  Megaphone,
  MessageCircle,
  Palette,
  Type,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { SiteConfigData } from '@/config/client-config-schema';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SetupStep {
  number: number;
  title: string;
  time: string;
  content: string;
  copyableText?: string;
  copyableTitle?: string;
  /** Syntax highlighting language for CodeBlock variant (e.g. 'json', 'markdown') */
  language?: string;
}

export interface FrameworkSection {
  number: number;
  title: string;
  description: string;
  clientExample: string;
  icon: LucideIcon;
}

export interface StorageOption {
  environment: string;
  where: string;
  how: string;
}

// ─── String Constants ────────────────────────────────────────────────────────

export const profilePreferencesText = `Always use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (\u00a3) for currency.`;

export const projectInstructionText = `Always use UK English spelling and grammar in all responses.`;

export const claudeMdSnippet = `## Style

- **UK English throughout.** All output must use UK English spelling and grammar (e.g., colour, organise, behaviour, centre, analyse). Use UK date format (DD/MM/YYYY) and GBP (\u00a3) for currency.`;

export const britfixConfig = `{
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

export const brandVoiceSetupPrompt = `I'd like to create a comprehensive brand voice document for our company. Please guide me through the process step by step, covering all seven areas:

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

export const ukEnglishSkillContent = `---
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

export const brandReviewSkillContent = `---
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

// ─── Data Arrays ─────────────────────────────────────────────────────────────

export const generalSteps: SetupStep[] = [
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

export const devSteps: SetupStep[] = [
  {
    number: 1,
    title: 'CLAUDE.md rule',
    time: '30 seconds',
    content:
      'Add this to every project\'s CLAUDE.md under a "Style" or "Critical Rules" heading. This is version-controlled \u2014 it ships with the repo, so all developers get it automatically. If you do nothing else, add this one line.',
    copyableText: claudeMdSnippet,
    copyableTitle: 'CLAUDE.md UK English snippet',
    language: 'markdown',
  },
  {
    number: 2,
    title: 'Britfix hook (advanced, if issues persist)',
    time: '5 minutes',
    content:
      'An open-source post-processing hook that automatically converts US English to UK English in files written by Claude Code. Context-aware: only converts comments and docstrings, never identifiers or string literals. The CLAUDE.md rule handles 95% of cases. If you find persistent issues in a particular project, Britfix catches the rest automatically. Note: this is a Tier 2 extension (hook that modifies files automatically) \u2014 follow the approval process in the governance policy.',
    copyableText: britfixConfig,
    copyableTitle: 'Britfix hook configuration',
    language: 'json',
  },
];

/** Build framework sections with client-specific examples from config, with overlay support. */
export function getFrameworkSections(
  config: SiteConfigData,
  overlayExamples?: Record<string, string>,
): FrameworkSection[] {
  const complianceArea = config.complianceArea ?? 'compliance';
  const complianceAreaCapitalised =
    complianceArea.charAt(0).toUpperCase() + complianceArea.slice(1);

  return [
    {
      number: 1,
      title: 'Brand Personality',
      description:
        'Define the brand as if it were a person. What are its defining traits? This creates the foundation everything else builds on.',
      clientExample:
        overlayExamples?.['1'] ??
        `If your brand were a person, it would be the knowledgeable colleague who explains ${complianceArea} technology simply, celebrates your wins genuinely, and never talks down to you. Friendly but never flippant when the subject matter is serious.`,
      icon: Palette,
    },
    {
      number: 2,
      title: 'Voice Attributes',
      description:
        'Select 3\u20135 attributes that define how the brand communicates. Each should have a "we are / we are not / sounds like" definition to prevent misinterpretation.',
      clientExample:
        overlayExamples?.['2'] ??
        'Approachable: We are friendly, clear, and jargon-free. We are not dumbed-down or lacking substance. Sounds like: "Here\'s how to get started \u2014 it takes about five minutes."',
      icon: MessageCircle,
    },
    {
      number: 3,
      title: 'Audience Awareness',
      description:
        'Who the brand speaks to, what they care about, what level of expertise they have, and how they expect to be addressed.',
      clientExample:
        overlayExamples?.['3'] ??
        `Primary: ${complianceArea} leads and public sector decision-makers. They need confidence that the technology works and meets compliance requirements. They are experts in ${complianceArea} but not necessarily in software.`,
      icon: Users,
    },
    {
      number: 4,
      title: 'Core Messaging Pillars',
      description:
        '3\u20135 key themes the brand consistently communicates. The hierarchy of these messages and how each connects to audience needs.',
      clientExample:
        overlayExamples?.['4'] ??
        `Pillar 1: ${complianceAreaCapitalised} made simpler. Pillar 2: Built for the people who do the work. Pillar 3: Trusted, certified, accountable (ISO 9001/27001, Cyber Essentials Plus).`,
      icon: Megaphone,
    },
    {
      number: 5,
      title: 'Tone Spectrum',
      description:
        'How the voice adapts across channels and situations whilst remaining recognisably the same brand. The voice stays constant; the tone dials attributes up or down.',
      clientExample:
        overlayExamples?.['5'] ??
        `Product launch: dial up confidence. Incident response: dial up empathy and transparency. Training materials: dial up patience and clarity. Your brand voice is always present, but the emphasis shifts.`,
      icon: Globe2,
    },
    {
      number: 6,
      title: 'Style Rules',
      description:
        'Specific grammar, formatting, and language decisions: Oxford comma, sentence case vs title case, contractions, date formats. This is where UK English enforcement lives within the broader brand framework.',
      clientExample:
        overlayExamples?.['6'] ??
        'UK English throughout (see Part 1 of this section). Sentence case for headings. Contractions in informal content, avoid in formal documents. DD/MM/YYYY dates. \u00a3 for currency.',
      icon: Type,
    },
    {
      number: 7,
      title: 'Terminology',
      description:
        'Preferred and avoided terms, product names, inclusive language guidelines. Maintaining consistency across all communications.',
      clientExample:
        overlayExamples?.['7'] ??
        `Use the full product name ("${config.primaryProductDescription ?? 'the product'}") on first mention, then the abbreviation ("${config.primaryProduct ?? 'the product'}"). Never use "users" when you mean "${complianceArea} professionals" or "partners".`,
      icon: ListChecks,
    },
  ];
}

export const storageOptions: StorageOption[] = [
  {
    environment: 'Claude Desktop / claude.ai',
    where: 'Project knowledge file',
    how: "Add the document to a project's knowledge base. Claude loads it automatically for all conversations in that project.",
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
