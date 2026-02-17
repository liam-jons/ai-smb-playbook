import { useState, useRef, useCallback } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CodeBlock } from '@/components/content/CodeBlock';
import { CalloutCard } from '@/components/content/CalloutCard';
import { useTrack } from '@/hooks/useTrack';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import {
  Check,
  Minus,
  ArrowDown,
  ChevronDown,
  Zap,
  BookOpen,
  Terminal,
  Globe,
  Shield,
  Layers,
  Package,
  Code2,
  GitBranch,
} from 'lucide-react';
import type { Track } from '@/content/shared/types';

// ─── Types ───────────────────────────────────────────────────────────────────

type Platform = 'claude.ai' | 'Desktop' | 'Code' | 'CoWork';

interface DecisionTreeEntry {
  id: string;
  goal: string;
  recommended: string;
  explanation: string;
  example: string;
  platforms: Platform[];
  generalNote?: string;
  devNote?: string;
  referenceCardId: string;
  tracks: Track[];
  icon: typeof Zap;
}

interface AvailabilityRow {
  feature: string;
  claudeAi: string;
  desktop: string;
  code: string;
  cowork: string;
}

interface ReferenceCard {
  id: string;
  name: string;
  whatItIs: string;
  tracks: Track[];
  whenToUse: string[];
  whenNotToUse?: string[];
  contextCost: string;
  setupSteps?: string[];
  comparison?: { headers: string[]; rows: string[][] };
  devDetails?: string;
  generalNote?: string;
  codeExample?: { code: string; language: string; title: string };
  warning?: string;
}

interface ContextCostRow {
  feature: string;
  whenLoads: string;
  whatLoads: string;
  cost: 'zero' | 'low' | 'moderate' | 'high';
  costLabel: string;
  mitigation: string;
}

interface CombinationPattern {
  name: string;
  how: string;
  example: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const decisionTreeEntries: DecisionTreeEntry[] = [
  {
    id: 'always-follow-rules',
    goal: 'I want Claude to always follow certain rules',
    recommended: 'CLAUDE.md / Project custom instructions',
    explanation:
      'Sets persistent conventions Claude follows every session — coding standards, tone of voice, formatting rules, project structure.',
    example:
      'Always use UK English. Never deploy to production without tests. Use our naming conventions for CSS classes.',
    platforms: ['claude.ai', 'Desktop', 'Code'],
    generalNote:
      'On claude.ai and Claude Desktop, use Projects with custom instructions. You set them once and every conversation in that project inherits the rules.',
    devNote:
      'In Claude Code, create a CLAUDE.md file in your project root. Claude reads it automatically at the start of every session.',
    referenceCardId: 'claudemd',
    tracks: ['general', 'developer'],
    icon: Shield,
  },
  {
    id: 'specialist-knowledge',
    goal: 'I want to give Claude specialist knowledge it can use when needed',
    recommended: 'Skills',
    explanation:
      'Gives Claude reusable knowledge, reference material, or workflows it can draw on when relevant. Like giving a colleague a reference manual they consult when needed, rather than memorising.',
    example:
      'A skill containing your brand voice guidelines that Claude uses when writing client-facing content. A skill with your API documentation that Claude references when answering questions about integrations.',
    platforms: ['claude.ai', 'Desktop', 'Code', 'CoWork'],
    generalNote:
      'Skills are the universal extension mechanism. Your admin can deploy skills to the whole team via the admin console. You can also upload skills individually via Settings > Capabilities.',
    devNote:
      'In Claude Code, skills are filesystem-based (.claude/skills/ directory). You can invoke them explicitly with /skill-name or let Claude load them automatically based on task relevance.',
    referenceCardId: 'skills',
    tracks: ['general', 'developer'],
    icon: BookOpen,
  },
  {
    id: 'trigger-workflow',
    goal: 'I want to trigger a specific workflow with a command',
    recommended: 'Skills with slash command / natural language',
    explanation:
      "Creates a repeatable workflow you can trigger on demand — like a macro or script, but powered by Claude's reasoning.",
    example:
      '/review runs your code review checklist. /deploy executes your deployment workflow. /handoff creates a structured session summary.',
    platforms: ['claude.ai', 'Desktop', 'Code', 'CoWork'],
    generalNote:
      'You don\'t type a command. Simply describe what you want ("I need to hand this session off to Sarah") and Claude automatically matches it to the right skill.',
    devNote:
      'Slash commands (/name) work in Claude Code and CoWork. On claude.ai and Desktop, the same skills are triggered via natural language.',
    referenceCardId: 'skills',
    tracks: ['general', 'developer'],
    icon: Terminal,
  },
  {
    id: 'connect-external',
    goal: 'I want Claude to connect to an external service',
    recommended: 'MCP (Model Context Protocol)',
    explanation:
      'Connects Claude to external tools and data sources — databases, APIs, browsers, project management tools.',
    example:
      'Connect to your staging database to query data. Connect to Slack to post updates. Use a browser tool to test websites.',
    platforms: ['claude.ai', 'Desktop', 'Code', 'CoWork'],
    generalNote:
      'On claude.ai, look for "Connectors" in your settings — these are pre-built, managed connections to services like Google Drive, Notion, and Slack. Your admin manages which Connectors are available.',
    devNote:
      "In Claude Code, you configure MCP servers in .claude/settings.json. Each server's tool definitions load into context at session start, consuming up to 10% of your context window.",
    referenceCardId: 'mcp',
    tracks: ['general', 'developer'],
    icon: Globe,
  },
  {
    id: 'run-task-separately',
    goal: 'I want Claude to run a task separately without cluttering my conversation',
    recommended: 'Subagents',
    explanation:
      'Spawns an isolated worker that does the task in its own context window and returns only a summary. Your main conversation stays clean.',
    example:
      '"Research all the authentication patterns in our codebase and summarise them" — the subagent reads dozens of files but your conversation only gets the findings.',
    platforms: ['Code'],
    referenceCardId: 'subagents',
    tracks: ['developer'],
    icon: Layers,
  },
  {
    id: 'multiple-instances',
    goal: 'I want multiple Claude instances working together on a big task',
    recommended: 'Agent Teams (experimental)',
    explanation:
      'Coordinates multiple independent Claude Code sessions that can communicate with each other, share findings, and divide work.',
    example:
      'Three agents reviewing a pull request simultaneously — one checks security, one checks performance, one checks test coverage — then they share findings.',
    platforms: ['Code'],
    devNote:
      'Agent Teams are experimental. Enable with CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1. Known limitations include no session resumption, one team per session, and limited terminal support.',
    referenceCardId: 'agent-teams',
    tracks: ['developer'],
    icon: GitBranch,
  },
  {
    id: 'automatic-events',
    goal: 'I want something to happen automatically when Claude does specific things',
    recommended: 'Hooks',
    explanation:
      'Runs a script automatically when specific events occur — like running a linter after every file edit, or posting a Slack notification when Claude modifies critical files. No AI involved — purely deterministic.',
    example:
      'Automatically run ESLint after every file edit. Run tests before every commit. Post to a Slack channel when Claude modifies database schema files.',
    platforms: ['Code'],
    referenceCardId: 'hooks',
    tracks: ['developer'],
    icon: Zap,
  },
  {
    id: 'package-extensions',
    goal: 'I want to package and share a set of extensions across projects',
    recommended: 'Plugins',
    explanation:
      'Bundles skills, hooks, subagents, and MCP servers into a single installable package that can be shared across repositories or distributed to others.',
    example:
      "Package your team's code review skill, deployment hooks, and database MCP config into a single plugin that every developer installs.",
    platforms: ['Code'],
    referenceCardId: 'plugins',
    tracks: ['developer'],
    icon: Package,
  },
  {
    id: 'code-intelligence',
    goal: 'I want better code intelligence — jump to definition, find references, type checking',
    recommended: 'LSP plugins',
    explanation:
      'Gives Claude real-time code intelligence through Language Server Protocol — automatic diagnostics after file edits, jump to definitions, find references, hover type info.',
    example:
      'Install the TypeScript LSP plugin so Claude catches type errors immediately after editing files, without needing to run the compiler.',
    platforms: ['Code'],
    referenceCardId: 'plugins',
    tracks: ['developer'],
    icon: Code2,
  },
];

const availabilityMatrix: AvailabilityRow[] = [
  {
    feature: 'Skills (auto-invocation)',
    claudeAi: 'Yes',
    desktop: 'Yes',
    code: 'Yes',
    cowork: 'Yes',
  },
  {
    feature: 'Skills (slash command /name)',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes',
    cowork: 'Yes (via plugins)',
  },
  {
    feature: 'Skills (admin-provisioned)',
    claudeAi: 'Yes',
    desktop: 'Yes',
    code: 'Yes',
    cowork: 'Yes',
  },
  {
    feature: 'Skills (ZIP upload)',
    claudeAi: 'Yes',
    desktop: 'Yes',
    code: '-- (filesystem)',
    cowork: '--',
  },
  {
    feature: 'Projects (custom instructions)',
    claudeAi: 'Yes',
    desktop: 'Yes',
    code: '--',
    cowork: '--',
  },
  {
    feature: 'CLAUDE.md',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes',
    cowork: '--',
  },
  {
    feature: 'MCP servers',
    claudeAi: 'Connectors (managed)',
    desktop: 'Yes (settings)',
    code: 'Yes (full)',
    cowork: 'Via plugins',
  },
  {
    feature: 'Subagents',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes',
    cowork: '--',
  },
  {
    feature: 'Agent Teams',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes (experimental)',
    cowork: '--',
  },
  {
    feature: 'Hooks',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes',
    cowork: '--',
  },
  {
    feature: 'Plugins',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes',
    cowork: '--',
  },
  {
    feature: 'LSP servers',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes (via plugins)',
    cowork: '--',
  },
  {
    feature: 'Slash commands',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes',
    cowork: 'Yes (via plugins)',
  },
];

const referenceCards: ReferenceCard[] = [
  {
    id: 'claudemd',
    name: 'CLAUDE.md',
    whatItIs:
      'A markdown file (named CLAUDE.md) that stores project context, conventions, and instructions. Claude reads it automatically at the start of every session.',
    tracks: ['developer'],
    whenToUse: [
      'Project conventions ("always use pnpm, not npm")',
      'Build commands and test instructions',
      'Architecture overview and key patterns',
      '"Never do X" rules',
      'Tech stack specifications',
    ],
    whenNotToUse: [
      'Reference material Claude only needs sometimes (use a skill instead)',
      'Workflows triggered on demand (use a skill with slash command)',
      'Content that exceeds ~500 lines (move detail to skills or /docs)',
    ],
    contextCost:
      'Full content loads at session start and is included in every request. Keep under ~500 lines.',
    comparison: {
      headers: ['Aspect', 'CLAUDE.md', 'Skill'],
      rows: [
        [
          'Loads',
          'Every session, automatically',
          'On demand (description at start, full content when used)',
        ],
        [
          'Can include files',
          'Yes, with @path imports',
          'Yes, with @path imports',
        ],
        ['Can trigger workflows', 'No', 'Yes, with /<name>'],
        [
          'Best for',
          '"Always do X" rules',
          'Reference material, invocable workflows',
        ],
      ],
    },
    codeExample: {
      code: `# Project: [Project Name]

## Build Commands
- \`npm run dev\` — start local dev server
- \`npm run build\` — production build
- \`npm run test\` — run test suite

## Conventions
- UK English in all comments, documentation, and user-facing strings
- Use TypeScript strict mode
- Prefer functional components with hooks
- CSS: Tailwind utility classes only

## Architecture
- See \`/docs/architecture/\` for system architecture
- See \`/docs/conventions/\` for coding standards
- See \`/docs/schemas/\` for database schemas

## Key Rules
- Never deploy to production without passing tests
- Never commit API keys or secrets
- Always create a new branch for feature work`,
      language: 'markdown',
      title: 'CLAUDE.md template',
    },
  },
  {
    id: 'projects',
    name: 'Projects (Custom Instructions)',
    whatItIs:
      'Projects on claude.ai and Claude Desktop let you set persistent instructions that apply to every conversation within that project. Think of it as the general-user equivalent of CLAUDE.md.',
    tracks: ['general'],
    whenToUse: [
      'Setting tone and formatting rules for all conversations in a project',
      'Ensuring every team member follows the same guidelines',
      'Providing background context Claude should always know',
    ],
    contextCost:
      'Custom instructions load at the start of every conversation within the project. Keep them focused and concise.',
    setupSteps: [
      'Open claude.ai and create or open a Project',
      'Go to Project Settings > Custom Instructions',
      `Add your rules and context (e.g., "Always use UK English. Our company is ${siteConfig.companyName}.")`,
      'Every conversation in this project now inherits those instructions',
    ],
  },
  {
    id: 'skills',
    name: 'Skills',
    whatItIs:
      'A markdown file containing reusable knowledge, instructions, or workflows that Claude can draw on. Skills follow the open Agent Skills standard for cross-tool compatibility.',
    tracks: ['general', 'developer'],
    whenToUse: [
      'Reusable reference material (brand guidelines, API docs, coding standards)',
      'Repeatable workflows (deployment, code review, session handoff)',
      "Specialist knowledge Claude should have access to but doesn't need every session",
      'Any instruction set you want to share across team members',
    ],
    contextCost:
      'At session start, only skill names and descriptions load (low cost). When used, the full SKILL.md content loads into the conversation.',
    generalNote:
      'Skills are invoked automatically via natural language. Simply describe your task naturally and Claude matches it to the relevant skill. Upload skills via Settings > Capabilities, or have your admin deploy them to the whole team.',
    devDetails:
      'Skills are filesystem-based, stored in .claude/skills/ as directories containing a SKILL.md file. Invoke explicitly with /skill-name or let Claude auto-load based on task relevance.',
    codeExample: {
      code: `---
name: session-handoff
description: |
  WHEN the user wants to hand off a conversation to another team member,
  summarise a session for continuation, or create a briefing for the next person.
  WHEN NOT the user is simply asking for a summary of the current conversation.
---

# Session Handoff

Create a structured handoff document that enables another team member (or a future
session) to continue this work without losing context.

## Output Format

Produce a markdown document with:

1. **Context** — What was being worked on and why
2. **Current state** — What has been completed, what is in progress
3. **Key decisions** — Important choices made and the reasoning
4. **Next steps** — What needs to happen next, in priority order
5. **Open questions** — Unresolved issues or areas needing input
6. **Files modified** — List of files changed during this session

## Guidelines

- Be specific — include file paths, function names, and line numbers where relevant
- Explain the "why" behind decisions, not just the "what"
- Flag any risks or concerns for the next person
- Keep it concise — aim for a document someone can read in 2-3 minutes`,
      language: 'markdown',
      title: 'Example skill file (SKILL.md)',
    },
  },
  {
    id: 'mcp',
    name: 'MCP (Model Context Protocol)',
    whatItIs:
      'A protocol for connecting Claude to external services and data sources. MCP servers expose tools that Claude can call — query a database, post to Slack, control a browser.',
    tracks: ['general', 'developer'],
    whenToUse: [
      'Claude needs to interact with an external system (database, API, browser, project management tool)',
      "You want Claude to have access to real-time data, not just what's in the conversation",
      'You need Claude to take actions in external tools (post messages, create tickets, deploy code)',
    ],
    contextCost:
      'All tool definitions and schemas load at session start. Tool search caps at 10% of context, deferring the rest until needed.',
    generalNote:
      'On claude.ai, MCP is presented as "Connectors" — pre-built, managed connections to services like Google Drive, Notion, and Slack. Your admin manages which Connectors are available to the team.',
    devDetails:
      "Configure MCP servers in .claude/settings.json or .mcp.json. Disconnect servers you're not actively using — run /mcp to see token costs per server.",
    warning:
      'MCP connections can fail silently mid-session. If a server disconnects, its tools disappear without warning. Check connection status with /mcp if Claude fails to use a tool it previously could access.',
    comparison: {
      headers: ['Aspect', 'MCP', 'Skill'],
      rows: [
        [
          'What it is',
          'Protocol for connecting to external services',
          'Knowledge, workflows, reference material',
        ],
        [
          'Provides',
          'Tools and data access',
          'Knowledge, workflows, reference material',
        ],
        [
          'Examples',
          'Slack integration, database queries, browser control',
          'Code review checklist, deploy workflow, API style guide',
        ],
      ],
    },
    codeExample: {
      code: `{
  "mcpServers": {
    "deepwiki": {
      "command": "npx",
      "args": ["-y", "@anthropic/deepwiki-mcp"]
    }
  }
}`,
      language: 'json',
      title: 'MCP configuration (.claude/settings.json)',
    },
  },
  {
    id: 'subagents',
    name: 'Subagents',
    whatItIs:
      'An isolated worker that runs in its own context window, does a task, and returns only a summary to your main conversation. Like delegating to a colleague who gives you a brief report rather than showing you all their working.',
    tracks: ['developer'],
    whenToUse: [
      'A task requires reading many files but you only need the findings',
      'Your context window is getting full and you want to offload work',
      'You need parallel workers on independent tasks',
      "You want context isolation — the subagent's intermediate work doesn't clutter your session",
    ],
    contextCost:
      'Zero cost on your main context — subagents run in complete isolation.',
    warning:
      'Subagents cannot spawn other subagents (no nesting). MCP tools are NOT available in background subagents.',
    comparison: {
      headers: ['Scenario', 'Use'],
      rows: [
        ['Quick focused task, only result matters', 'Subagent'],
        ['Workers need to communicate with each other', 'Agent Team'],
        ['Reusable knowledge or workflow', 'Skill'],
        ['Deterministic automation', 'Hook'],
      ],
    },
  },
  {
    id: 'agent-teams',
    name: 'Agent Teams',
    whatItIs:
      'Multiple independent Claude Code sessions that coordinate via a shared task list and peer-to-peer messaging. Each teammate is a separate Claude instance with its own context.',
    tracks: ['developer'],
    whenToUse: [
      'Complex work requiring discussion and collaboration between workers',
      'Research with competing hypotheses',
      'Parallel code review (security + performance + tests simultaneously)',
      'New feature development where each teammate owns a separate piece',
    ],
    contextCost:
      'High — each teammate is a separate Claude instance with its own context. Reserve for genuinely parallel work that requires coordination.',
    warning:
      'Agent Teams are experimental. Enable with CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1. Known limitations: no session resumption, one team per session, limited terminal support.',
    comparison: {
      headers: ['Aspect', 'Subagent', 'Agent Team'],
      rows: [
        [
          'Context',
          'Own window; results return to caller',
          'Own window; fully independent',
        ],
        [
          'Communication',
          'Reports results back to main agent only',
          'Teammates message each other directly',
        ],
        [
          'Coordination',
          'Main agent manages all work',
          'Shared task list with self-coordination',
        ],
        [
          'Best for',
          'Focused tasks where only the result matters',
          'Complex work requiring discussion',
        ],
        [
          'Token cost',
          'Lower — results summarised back',
          'Higher — each teammate is a separate instance',
        ],
      ],
    },
  },
  {
    id: 'hooks',
    name: 'Hooks',
    whatItIs:
      'Deterministic scripts that run automatically when specific events occur in Claude Code. No AI involved — purely predictable automation.',
    tracks: ['developer'],
    whenToUse: [
      'You want something to happen automatically, every time, with no AI judgement',
      'Post-edit linting, pre-commit testing, notification sending',
      'Quality gates that must always run (not optional, not probabilistic)',
    ],
    contextCost:
      'Zero — hooks run as external scripts outside the agentic loop. Exception: if a hook returns output, that output gets added as messages to your conversation.',
    codeExample: {
      code: `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint -- --fix $TOOL_INPUT_PATH"
          }
        ]
      }
    ]
  }
}`,
      language: 'json',
      title: 'Hook configuration (.claude/settings.json)',
    },
  },
  {
    id: 'plugins',
    name: 'Plugins',
    whatItIs:
      'Packaging layer that bundles skills, hooks, subagents, MCP servers, and LSP servers into a single installable unit. Useful when you want to reuse the same setup across multiple repositories or distribute to others.',
    tracks: ['developer'],
    whenToUse: [
      'Sharing a set of extensions across multiple projects',
      'Distributing tools to other developers',
      'Packaging a complete workflow (skill + hook + MCP config) as a single install',
    ],
    contextCost:
      'Varies — depends on the bundled components. Skill descriptions load at start; hooks run externally; MCP tools add to context.',
  },
];

const contextCostTable: ContextCostRow[] = [
  {
    feature: 'CLAUDE.md',
    whenLoads: 'Session start',
    whatLoads: 'Full content',
    cost: 'moderate',
    costLabel: 'Every request',
    mitigation: 'Keep under ~500 lines',
  },
  {
    feature: 'Skills (model-invocable)',
    whenLoads: 'Session start + when used',
    whatLoads: 'Descriptions at start; full content when used',
    cost: 'low',
    costLabel: 'Low baseline',
    mitigation: 'Use disable-model-invocation: true for manual-only skills',
  },
  {
    feature: 'Skills (manual-only)',
    whenLoads: 'When invoked',
    whatLoads: 'Full content',
    cost: 'zero',
    costLabel: 'Zero until invoked',
    mitigation: 'Best for side-effect skills',
  },
  {
    feature: 'MCP servers',
    whenLoads: 'Session start',
    whatLoads: 'All tool definitions and schemas',
    cost: 'moderate',
    costLabel: 'Up to 10% of context',
    mitigation: 'Disconnect unused servers; check with /mcp',
  },
  {
    feature: 'Subagents',
    whenLoads: 'When spawned',
    whatLoads: 'Fresh isolated context with specified skills',
    cost: 'zero',
    costLabel: 'Zero on main context',
    mitigation: 'Use for verbose/exploratory work',
  },
  {
    feature: 'Hooks (command)',
    whenLoads: 'On trigger',
    whatLoads: 'Nothing (runs externally)',
    cost: 'zero',
    costLabel: 'Zero',
    mitigation: 'Ideal for side effects',
  },
  {
    feature: 'Hooks (prompt/agent)',
    whenLoads: 'On trigger',
    whatLoads: 'Small per-invocation cost',
    cost: 'low',
    costLabel: 'Low',
    mitigation: 'Use for judgement-based quality gates',
  },
  {
    feature: 'Agent Teams',
    whenLoads: 'When started',
    whatLoads: 'N separate full contexts',
    cost: 'high',
    costLabel: 'High',
    mitigation: 'Reserve for genuinely parallel work',
  },
];

const combinationPatterns: CombinationPattern[] = [
  {
    name: 'Skill + MCP',
    how: 'MCP provides the connection; a skill teaches Claude how to use it well',
    example:
      'MCP connects to your database; a skill documents your data model and query patterns',
  },
  {
    name: 'Skill + Subagent',
    how: 'A skill spawns subagents for parallel work',
    example:
      '/review skill kicks off security, performance, and style subagents working in isolated context',
  },
  {
    name: 'CLAUDE.md + Skills',
    how: 'CLAUDE.md holds always-on rules; skills hold reference material loaded on demand',
    example:
      'CLAUDE.md says "follow our API conventions"; a skill contains the full API style guide',
  },
  {
    name: 'Hook + MCP',
    how: 'A hook triggers external actions through MCP',
    example:
      'Post-edit hook sends a Slack notification when Claude modifies critical files',
  },
  {
    name: 'Skill + Subagent Memory',
    how: 'A subagent with persistent memory builds institutional knowledge over time',
    example:
      'A code review subagent remembers patterns from previous reviews and improves its suggestions',
  },
];

const naturalLanguageTriggerGuide = `To use your skills on claude.ai or Claude Desktop:

You DON'T need to type a command. Simply describe what you want:

  "I need to write a client proposal in our brand voice"
  \u2192 Claude automatically loads your brand-voice skill

  "Review this document for UK English"
  \u2192 Claude automatically loads your uk-english skill

  "Create a session handoff for the next person"
  \u2192 Claude automatically loads your session-handoff skill

The better the skill's description matches your request,
the more reliably Claude will load the right skill.`;

const ukEnglishSkillExample = `---
name: uk-english
description: >
  Enforce UK English spelling, grammar, and conventions in all output.
  Use when writing, reviewing, or editing any content for UK audiences.
---

# UK English

All output must use UK English spelling, grammar, and conventions.

## Spelling Rules

Use British English spellings throughout:
- -ise endings (not -ize): organise, recognise, specialise, optimise
- -our endings (not -or): colour, behaviour, favour, honour
- -re endings (not -er): centre, metre, theatre
- -ence endings: licence (noun), defence, offence
- Double L: travelling, modelling, labelling, cancelled
- Other: grey (not gray), programme (not program, unless computer program)

## Formatting Conventions

- Dates: DD/MM/YYYY or DD Month YYYY
- Currency: use \u00a3 symbol (e.g., \u00a3500, not $500)
- Time: 24-hour format preferred (e.g., 14:00)
- Single quotes for primary quotation`;

const layeringRules = [
  {
    feature: 'CLAUDE.md files',
    rule: 'Additive \u2014 all levels contribute. Subdirectory files discovered as you work.',
  },
  {
    feature: 'Skills and subagents',
    rule: 'Override by name \u2014 managed > user > project (for skills); managed > CLI flag > project > user > plugin (for subagents).',
  },
  {
    feature: 'MCP servers',
    rule: 'Override by name \u2014 local > project > user.',
  },
  {
    feature: 'Hooks',
    rule: 'Merge \u2014 all registered hooks fire for their matching events regardless of source.',
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: Platform }) {
  const colours: Record<Platform, string> = {
    'claude.ai': 'bg-info-muted text-info-muted-foreground',
    Desktop: 'bg-important-muted text-important-muted-foreground',
    Code: 'bg-success-muted text-success-muted-foreground',
    CoWork: 'bg-warning-muted text-warning-muted-foreground',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        colours[platform],
      )}
    >
      {platform}
    </span>
  );
}

function AvailabilityCell({ value }: { value: string }) {
  const isAvailable = value !== '--';
  const hasQualification = value !== 'Yes' && value !== '--';

  if (!isAvailable) {
    return (
      <td className="px-3 py-2.5 text-center">
        <Minus
          className="mx-auto h-4 w-4 text-muted-foreground/40"
          aria-label="Not available"
        />
      </td>
    );
  }

  if (hasQualification) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <td className="px-3 py-2.5 text-center">
              <span className="inline-flex items-center gap-1 text-xs text-success-muted-foreground">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">Available: </span>
                <span className="max-w-[6rem] truncate">
                  {value
                    .replace('Yes', '')
                    .replace('(', '')
                    .replace(')', '')
                    .trim() || 'Yes'}
                </span>
              </span>
            </td>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={4}>
            <p className="max-w-48">{value}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <td className="px-3 py-2.5 text-center">
      <Check className="mx-auto h-4 w-4 text-success" aria-label="Available" />
    </td>
  );
}

function CostIndicator({ cost }: { cost: ContextCostRow['cost'] }) {
  const config = {
    zero: {
      label: 'Zero',
      className: 'bg-success-muted text-success-muted-foreground',
    },
    low: {
      label: 'Low',
      className: 'bg-success-muted text-success-muted-foreground',
    },
    moderate: {
      label: 'Moderate',
      className: 'bg-warning-muted text-warning-muted-foreground',
    },
    high: {
      label: 'High',
      className: 'bg-danger-muted text-danger-muted-foreground',
    },
  };

  const c = config[cost];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        c.className,
      )}
    >
      {c.label}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function SkillsExtensionsSection() {
  const { track } = useTrack();
  const isGeneral = track === 'general';
  const refCardsRef = useRef<HTMLDivElement>(null);
  const [openRefCard, setOpenRefCard] = useState<string>('');
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const filteredEntries = decisionTreeEntries.filter((e) =>
    e.tracks.includes(track),
  );
  const filteredRefCards = referenceCards.filter((c) =>
    c.tracks.includes(track),
  );
  const filteredAvailability = isGeneral
    ? availabilityMatrix.filter(
        (r) =>
          ![
            'Subagents',
            'Agent Teams',
            'Hooks',
            'Plugins',
            'LSP servers',
          ].includes(r.feature),
      )
    : availabilityMatrix;
  const filteredCostTable = isGeneral
    ? contextCostTable.filter(
        (r) =>
          ![
            'Subagents',
            'Hooks (command)',
            'Hooks (prompt/agent)',
            'Agent Teams',
          ].includes(r.feature),
      )
    : contextCostTable;
  const filteredCombinations = isGeneral
    ? combinationPatterns.filter(
        (p) =>
          ![
            'Skill + Subagent',
            'Hook + MCP',
            'Skill + Subagent Memory',
          ].includes(p.name),
      )
    : combinationPatterns;

  const scrollToCard = useCallback((cardId: string) => {
    setOpenRefCard(cardId);
    // Wait for React to commit the state update and the browser to paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(`ref-card-${cardId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Focus the accordion trigger for keyboard accessibility
          const trigger = el.querySelector<HTMLButtonElement>(
            '[data-slot="accordion-trigger"]',
          );
          if (trigger) {
            trigger.focus({ preventScroll: true });
          }
        }
      });
    });
  }, []);

  return (
    <div className="space-y-12">
      {/* A. Introduction */}
      <section>
        <p className="max-w-prose text-base leading-relaxed text-foreground">
          Claude comes with powerful built-in tools for conversation, writing,
          analysis, and code. But its real power emerges when you extend it —
          teaching it your company's conventions, connecting it to your tools,
          or giving it specialised knowledge. This section helps you find the
          right extension mechanism for what you want to achieve.
        </p>
        <div className="mt-6 space-y-3">
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            Extensions range from <strong>always-on context</strong> (things
            Claude knows every session) to{' '}
            <strong>on-demand capabilities</strong> (things you or Claude can
            invoke when needed) to <strong>background automation</strong>{' '}
            (things that happen automatically on specific events).
          </p>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            Not every mechanism is available on every platform — the decision
            tree and availability matrix below show what works where.{' '}
            {siteConfig.companyName} has Claude Teams licences for all staff and
            Claude Code access for developers.
          </p>
          {isGeneral && (
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              You may see references to <strong>CoWork</strong> below — this is
              Anthropic's browser automation environment. It lets Claude control
              a web browser to complete tasks on websites, such as filling
              forms, extracting data, or monitoring pages.
            </p>
          )}
        </div>
      </section>

      <Separator />

      {/* Natural language callout for general users */}
      {isGeneral && (
        <CalloutCard variant="tip" title="You don't need to type a command">
          On claude.ai and Claude Desktop, you trigger skills by describing what
          you want in natural language. Simply say what you need — &ldquo;I need
          to hand this session off to Sarah&rdquo; — and Claude automatically
          matches it to the right skill. No slash commands or technical syntax
          required.
        </CalloutCard>
      )}

      {/* B. Decision Tree */}
      <section aria-labelledby="decision-tree-heading">
        <h2
          id="decision-tree-heading"
          className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {isGeneral ? 'What do you want Claude to do?' : 'I want to...'}
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          Select the goal that best describes what you are trying to achieve.
          Each option shows the recommended approach and which platforms support
          it.
        </p>

        <Accordion type="single" collapsible className="space-y-1">
          {filteredEntries.map((entry) => {
            const Icon = entry.icon;
            return (
              <AccordionItem
                key={entry.id}
                value={entry.id}
                className="rounded-lg border border-border px-4"
              >
                <AccordionTrigger className="text-sm font-medium hover:no-underline sm:text-base [&[data-state=open]]:text-foreground">
                  <span className="flex items-center gap-3">
                    <Icon
                      className="h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span>{entry.goal}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-1">
                  <div className="space-y-4">
                    {/* Recommended mechanism */}
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Recommended
                      </span>
                      <p className="mt-1 font-medium text-foreground">
                        {entry.recommended}
                      </p>
                    </div>

                    {/* Explanation */}
                    <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
                      {entry.explanation}
                    </p>

                    {/* Example */}
                    <div className="rounded-md border-l-2 border-accent-foreground/20 bg-muted/30 px-4 py-3">
                      <span className="text-xs font-medium text-muted-foreground">
                        Example for {siteConfig.companyName}
                      </span>
                      <p className="mt-1 text-sm text-foreground">
                        {entry.example}
                      </p>
                    </div>

                    {/* Platform badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Available on:
                      </span>
                      {entry.platforms.map((p) => (
                        <PlatformBadge key={p} platform={p} />
                      ))}
                    </div>

                    {/* Track-specific notes */}
                    {isGeneral && entry.generalNote && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {entry.generalNote}
                      </p>
                    )}
                    {!isGeneral && entry.devNote && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {entry.devNote}
                      </p>
                    )}

                    {/* Link to reference card */}
                    <button
                      type="button"
                      onClick={() => scrollToCard(entry.referenceCardId)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                    >
                      <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                      Learn more in the reference card
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      <Separator />

      {/* C. Platform Availability Matrix */}
      <section aria-labelledby="availability-heading">
        <h2
          id="availability-heading"
          className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Platform Availability
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          Not every extension is available on every platform. This matrix shows
          what works where.
        </p>

        <ScrollArea className="w-full rounded-lg border border-border">
          <div className="min-w-[540px]">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    claude.ai
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Desktop
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Code
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    CoWork
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAvailability.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      'border-b border-border last:border-b-0',
                      i % 2 === 0 ? 'bg-transparent' : 'bg-muted/20',
                    )}
                  >
                    <td className="px-3 py-2.5 text-left font-medium text-foreground">
                      {row.feature}
                    </td>
                    <AvailabilityCell value={row.claudeAi} />
                    <AvailabilityCell value={row.desktop} />
                    <AvailabilityCell value={row.code} />
                    <AvailabilityCell value={row.cowork} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Matrix notes */}
        <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
          <p>
            <Check
              className="mr-1 inline h-3 w-3 text-success"
              aria-hidden="true"
            />
            = Available and functional on that platform.{' '}
            <Minus
              className="mr-1 inline h-3 w-3 text-muted-foreground/40"
              aria-hidden="true"
            />
            = Not available.
          </p>
          <p>
            &ldquo;Connectors (managed)&rdquo; means claude.ai uses a managed,
            admin-configured version of MCP rather than direct server
            configuration.
          </p>
          <p>
            Claude Desktop and claude.ai share the same skill system — skills
            uploaded on one are available on the other.
          </p>
        </div>

        {/* Advanced / Developer features — collapsed for general users */}
        {isGeneral && (
          <div className="mt-4">
            <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50"
                >
                  <span>Advanced / Developer features</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform duration-200',
                      advancedOpen && 'rotate-180',
                    )}
                    aria-hidden="true"
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 rounded-md border border-border bg-muted/20 px-4 py-4">
                  <p className="mb-3 text-sm text-muted-foreground">
                    These features are available only in Claude Code and are
                    primarily relevant to developers. They are included here for
                    completeness.
                  </p>
                  <ScrollArea className="w-full">
                    <div className="min-w-[540px]">
                      <table className="w-full text-sm" role="table">
                        <thead>
                          <tr className="border-b border-border bg-muted/40">
                            <th
                              scope="col"
                              className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                            >
                              Feature
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                            >
                              claude.ai
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                            >
                              Desktop
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                            >
                              Code
                            </th>
                            <th
                              scope="col"
                              className="px-3 py-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                            >
                              CoWork
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {availabilityMatrix
                            .filter((r) =>
                              [
                                'Subagents',
                                'Agent Teams',
                                'Hooks',
                                'Plugins',
                                'LSP servers',
                              ].includes(r.feature),
                            )
                            .map((row, i) => (
                              <tr
                                key={row.feature}
                                className={cn(
                                  'border-b border-border last:border-b-0',
                                  i % 2 === 0
                                    ? 'bg-transparent'
                                    : 'bg-muted/20',
                                )}
                              >
                                <td className="px-3 py-2 text-left font-medium text-foreground">
                                  {row.feature}
                                </td>
                                <AvailabilityCell value={row.claudeAi} />
                                <AvailabilityCell value={row.desktop} />
                                <AvailabilityCell value={row.code} />
                                <AvailabilityCell value={row.cowork} />
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </section>

      <Separator />

      {/* D. Reference Cards */}
      <section aria-labelledby="reference-cards-heading" ref={refCardsRef}>
        <h2
          id="reference-cards-heading"
          className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          Extension Reference
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          Detailed information on each extension mechanism — what it is, when to
          use it, what it costs, and how to set it up.
        </p>

        <Accordion
          type="single"
          collapsible
          value={openRefCard}
          onValueChange={setOpenRefCard}
          className="space-y-1"
        >
          {filteredRefCards.map((card) => (
            <AccordionItem
              key={card.id}
              value={card.id}
              id={`ref-card-${card.id}`}
              className="rounded-lg border border-border px-4"
            >
              <AccordionTrigger className="text-sm font-medium hover:no-underline sm:text-base">
                {card.name}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-5 pt-1">
                {/* What it is */}
                <p className="max-w-prose text-sm leading-relaxed text-foreground">
                  {card.whatItIs}
                </p>

                {/* When to use */}
                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    When to use
                  </h4>
                  <ul
                    className="space-y-1 text-sm text-muted-foreground"
                    role="list"
                  >
                    {card.whenToUse.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* When NOT to use */}
                {card.whenNotToUse && (
                  <div>
                    <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      When not to use
                    </h4>
                    <ul
                      className="space-y-1 text-sm text-muted-foreground"
                      role="list"
                    >
                      {card.whenNotToUse.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Track-specific notes */}
                {isGeneral && card.generalNote && (
                  <CalloutCard variant="tip" title="How it works for you">
                    {card.generalNote}
                  </CalloutCard>
                )}
                {!isGeneral && card.devDetails && (
                  <CalloutCard variant="info" title="Developer details">
                    {card.devDetails}
                  </CalloutCard>
                )}

                {/* Setup steps (general track) */}
                {card.setupSteps && (
                  <div>
                    <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      How to set up
                    </h4>
                    <ol
                      className="space-y-2 text-sm text-muted-foreground"
                      role="list"
                    >
                      {card.setupSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Context cost */}
                <div className="rounded-md bg-muted/30 px-4 py-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {isGeneral
                      ? "Impact on Claude's working memory"
                      : 'Context cost'}
                  </span>
                  <p className="mt-1 text-sm text-foreground">
                    {card.contextCost}
                  </p>
                </div>

                {/* Warning */}
                {card.warning && (
                  <CalloutCard variant="warning" title="Important">
                    {card.warning}
                  </CalloutCard>
                )}

                {/* Comparison table */}
                {card.comparison && (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm" role="table">
                      <thead>
                        <tr className="border-b border-border bg-muted/40">
                          {card.comparison.headers.map((h) => (
                            <th
                              key={h}
                              scope="col"
                              className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {card.comparison.rows.map((row, i) => (
                          <tr
                            key={i}
                            className="border-b border-border last:border-b-0"
                          >
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                className={cn(
                                  'px-3 py-2 text-sm',
                                  j === 0
                                    ? 'font-medium text-foreground'
                                    : 'text-muted-foreground',
                                )}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Code example */}
                {card.codeExample && !isGeneral && (
                  <CodeBlock
                    code={card.codeExample.code}
                    language={card.codeExample.language}
                    title={card.codeExample.title}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Separator />

      {/* Copyable content for General track */}
      {isGeneral && (
        <>
          <section aria-labelledby="natural-language-heading">
            <h2
              id="natural-language-heading"
              className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Using Skills with Natural Language
            </h2>
            <p className="mb-4 max-w-prose text-sm text-muted-foreground">
              On claude.ai and Claude Desktop, you trigger skills by describing
              what you want. No commands needed.
            </p>
            <CalloutCard
              variant="info"
              title="Using Skills with Natural Language"
            >
              <div className="mt-2 whitespace-pre-line text-sm">
                {naturalLanguageTriggerGuide}
              </div>
            </CalloutCard>
          </section>

          <Separator />

          <section aria-labelledby="uk-skill-heading">
            <h2
              id="uk-skill-heading"
              className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Example: UK English Skill
            </h2>
            <p className="mb-4 max-w-prose text-sm text-muted-foreground">
              This skill ensures Claude uses UK English in all output. Your
              admin can deploy it to the whole team, or you can upload it
              yourself.
            </p>
            <CodeBlock
              code={ukEnglishSkillExample}
              language="markdown"
              title="UK English skill (SKILL.md)"
            />
          </section>

          <Separator />
        </>
      )}

      {/* E. Context Cost Summary */}
      <section aria-labelledby="context-cost-heading">
        <h2
          id="context-cost-heading"
          className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {isGeneral
            ? "Impact on Claude's Working Memory"
            : 'Context Cost Summary'}
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          {isGeneral
            ? "Each extension takes up some of Claude's working memory. This table shows the impact of each type."
            : 'Every extension has a context cost. Understanding these costs helps you keep your session lean and responsive.'}
        </p>

        <ScrollArea className="w-full rounded-lg border border-border">
          <div className="min-w-[600px]">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    When it loads
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    What loads
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Cost
                  </th>
                  {!isGeneral && (
                    <th
                      scope="col"
                      className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      Mitigation
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredCostTable.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      'border-b border-border last:border-b-0',
                      i % 2 === 0 ? 'bg-transparent' : 'bg-muted/20',
                    )}
                  >
                    <td className="px-3 py-2.5 font-medium text-foreground">
                      {row.feature}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {row.whenLoads}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {row.whatLoads}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <CostIndicator cost={row.cost} />
                    </td>
                    {!isGeneral && (
                      <td className="px-3 py-2.5 text-muted-foreground">
                        {row.mitigation}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <Separator />

      {/* F. Feature Combination Patterns */}
      <section aria-labelledby="combinations-heading">
        <h2
          id="combinations-heading"
          className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          How Extensions Work Together
        </h2>
        <p className="mb-6 max-w-prose text-sm text-muted-foreground">
          Extensions are designed to complement each other. These patterns show
          common combinations.
        </p>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th
                  scope="col"
                  className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Pattern
                </th>
                <th
                  scope="col"
                  className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  How it works
                </th>
                <th
                  scope="col"
                  className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Example
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCombinations.map((pattern, i) => (
                <tr
                  key={pattern.name}
                  className={cn(
                    'border-b border-border last:border-b-0',
                    i % 2 === 0 ? 'bg-transparent' : 'bg-muted/20',
                  )}
                >
                  <td className="px-3 py-2.5 font-medium text-foreground">
                    {pattern.name}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {pattern.how}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {pattern.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* G. Feature Layering Rules (Developer only) */}
      {!isGeneral && (
        <>
          <Separator />
          <section aria-labelledby="layering-heading">
            <h2
              id="layering-heading"
              className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Feature Layering Rules
            </h2>
            <p className="mb-6 max-w-prose text-sm text-muted-foreground">
              When the same feature exists at multiple levels (user, project,
              plugin, managed), here is how they interact.
            </p>

            <div className="space-y-3">
              {layeringRules.map((rule) => (
                <div
                  key={rule.feature}
                  className="rounded-md border border-border px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">
                    {rule.feature}
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {rule.rule}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Developer copyable examples */}
      {!isGeneral && (
        <>
          <Separator />
          <section aria-labelledby="dev-examples-heading">
            <h2
              id="dev-examples-heading"
              className="mb-1 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              Copyable Examples
            </h2>
            <p className="mb-6 max-w-prose text-sm text-muted-foreground">
              Templates and configuration snippets you can use directly in your
              projects.
            </p>
            <div className="space-y-6">
              <CalloutCard
                variant="info"
                title="Using Skills with Natural Language"
              >
                <div className="mt-2 whitespace-pre-line text-sm">
                  {naturalLanguageTriggerGuide}
                </div>
              </CalloutCard>
              <CodeBlock
                code={ukEnglishSkillExample}
                language="markdown"
                title="UK English skill (SKILL.md)"
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
