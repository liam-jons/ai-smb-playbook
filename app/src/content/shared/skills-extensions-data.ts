import {
  BookOpen,
  Code2,
  GitBranch,
  Globe,
  Layers,
  Package,
  Shield,
  Terminal,
  Zap,
  type LucideIcon,
} from 'lucide-react';
// ─── Types ───────────────────────────────────────────────────────────────────

export type Platform = 'claude.ai' | 'Desktop' | 'Code' | 'CoWork';

export interface DecisionTreeEntry {
  id: string;
  goal: string;
  recommended: string;
  explanation: string;
  example: string;
  platforms: Platform[];
  generalNote?: string;
  devNote?: string;
  referenceCardId: string;
  devOnly: boolean;
  icon: LucideIcon;
}

export interface AvailabilityRow {
  feature: string;
  claudeAi: string;
  desktop: string;
  code: string;
  cowork: string;
  devOnly: boolean;
}

export interface ReferenceCard {
  id: string;
  name: string;
  whatItIs: string;
  devOnly: boolean;
  generalOnly: boolean;
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

export interface ContextCostRow {
  feature: string;
  whenLoads: string;
  whatLoads: string;
  cost: 'zero' | 'low' | 'moderate' | 'high';
  costLabel: string;
  mitigation: string;
  devOnly: boolean;
}

export interface CombinationPattern {
  name: string;
  how: string;
  example: string;
  devOnly: boolean;
}

export interface LayeringRule {
  feature: string;
  rule: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

export const decisionTreeEntries: DecisionTreeEntry[] = [
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
    devOnly: false,
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
    devOnly: false,
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
    devOnly: false,
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
    devOnly: false,
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
    devOnly: true,
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
    devOnly: true,
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
    devOnly: true,
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
    devOnly: true,
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
    devOnly: true,
    icon: Code2,
  },
];

export const availabilityMatrix: AvailabilityRow[] = [
  {
    feature: 'Skills (auto-invocation)',
    claudeAi: 'Yes',
    desktop: 'Yes',
    code: 'Yes',
    cowork: 'Yes',
    devOnly: false,
  },
  {
    feature: 'Skills (slash command /name)',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes',
    cowork: 'Yes (via plugins)',
    devOnly: false,
  },
  {
    feature: 'Skills (admin-provisioned)',
    claudeAi: 'Yes',
    desktop: 'Yes',
    code: 'Yes',
    cowork: 'Yes',
    devOnly: false,
  },
  {
    feature: 'Skills (ZIP upload)',
    claudeAi: 'Yes',
    desktop: 'Yes',
    code: '-- (filesystem)',
    cowork: '--',
    devOnly: false,
  },
  {
    feature: 'Projects (custom instructions)',
    claudeAi: 'Yes',
    desktop: 'Yes',
    code: '--',
    cowork: '--',
    devOnly: false,
  },
  {
    feature: 'CLAUDE.md',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes',
    cowork: '--',
    devOnly: false,
  },
  {
    feature: 'MCP servers',
    claudeAi: 'Connectors (managed)',
    desktop: 'Yes (settings)',
    code: 'Yes (full)',
    cowork: 'Via plugins',
    devOnly: false,
  },
  {
    feature: 'Subagents',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes',
    cowork: '--',
    devOnly: true,
  },
  {
    feature: 'Agent Teams',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes (experimental)',
    cowork: '--',
    devOnly: true,
  },
  {
    feature: 'Hooks',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes',
    cowork: '--',
    devOnly: true,
  },
  {
    feature: 'Plugins',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes',
    cowork: '--',
    devOnly: true,
  },
  {
    feature: 'LSP servers',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes (via plugins)',
    cowork: '--',
    devOnly: true,
  },
  {
    feature: 'Slash commands',
    claudeAi: '--',
    desktop: '--',
    code: 'Yes',
    cowork: 'Yes (via plugins)',
    devOnly: false,
  },
];

/** Build reference cards with client-specific content from config. */
export function getReferenceCards(): ReferenceCard[] {
  return [
    {
      id: 'claudemd',
      name: 'CLAUDE.md',
      whatItIs:
        'A markdown file (named CLAUDE.md) that stores project context, conventions, and instructions. Claude reads it automatically at the start of every session.',
      devOnly: true,
      generalOnly: false,
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
      devOnly: false,
      generalOnly: true,
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
        'Add your rules and context (e.g., "Always use UK English. We are a [industry] company.")',
        'Every conversation in this project now inherits those instructions',
      ],
    },
    {
      id: 'skills',
      name: 'Skills',
      whatItIs:
        'A markdown file containing reusable knowledge, instructions, or workflows that Claude can draw on. Skills follow the open Agent Skills standard for cross-tool compatibility.',
      devOnly: false,
      generalOnly: false,
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
      devOnly: false,
      generalOnly: false,
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
      devOnly: true,
      generalOnly: false,
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
      devOnly: true,
      generalOnly: false,
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
      devOnly: true,
      generalOnly: false,
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
      devOnly: true,
      generalOnly: false,
      whenToUse: [
        'Sharing a set of extensions across multiple projects',
        'Distributing tools to other developers',
        'Packaging a complete workflow (skill + hook + MCP config) as a single install',
      ],
      contextCost:
        'Varies — depends on the bundled components. Skill descriptions load at start; hooks run externally; MCP tools add to context.',
    },
  ];
}

export const contextCostTable: ContextCostRow[] = [
  {
    feature: 'CLAUDE.md',
    whenLoads: 'Session start',
    whatLoads: 'Full content',
    cost: 'moderate',
    costLabel: 'Every request',
    mitigation: 'Keep under ~500 lines',
    devOnly: false,
  },
  {
    feature: 'Skills (model-invocable)',
    whenLoads: 'Session start + when used',
    whatLoads: 'Descriptions at start; full content when used',
    cost: 'low',
    costLabel: 'Low baseline',
    mitigation: 'Use disable-model-invocation: true for manual-only skills',
    devOnly: false,
  },
  {
    feature: 'Skills (manual-only)',
    whenLoads: 'When invoked',
    whatLoads: 'Full content',
    cost: 'zero',
    costLabel: 'Zero until invoked',
    mitigation: 'Best for side-effect skills',
    devOnly: false,
  },
  {
    feature: 'MCP servers',
    whenLoads: 'Session start',
    whatLoads: 'All tool definitions and schemas',
    cost: 'moderate',
    costLabel: 'Up to 10% of context',
    mitigation: 'Disconnect unused servers; check with /mcp',
    devOnly: false,
  },
  {
    feature: 'Subagents',
    whenLoads: 'When spawned',
    whatLoads: 'Fresh isolated context with specified skills',
    cost: 'zero',
    costLabel: 'Zero on main context',
    mitigation: 'Use for verbose/exploratory work',
    devOnly: true,
  },
  {
    feature: 'Hooks (command)',
    whenLoads: 'On trigger',
    whatLoads: 'Nothing (runs externally)',
    cost: 'zero',
    costLabel: 'Zero',
    mitigation: 'Ideal for side effects',
    devOnly: true,
  },
  {
    feature: 'Hooks (prompt/agent)',
    whenLoads: 'On trigger',
    whatLoads: 'Small per-invocation cost',
    cost: 'low',
    costLabel: 'Low',
    mitigation: 'Use for judgement-based quality gates',
    devOnly: true,
  },
  {
    feature: 'Agent Teams',
    whenLoads: 'When started',
    whatLoads: 'N separate full contexts',
    cost: 'high',
    costLabel: 'High',
    mitigation: 'Reserve for genuinely parallel work',
    devOnly: true,
  },
];

export const combinationPatterns: CombinationPattern[] = [
  {
    name: 'Skill + MCP',
    how: 'MCP provides the connection; a skill teaches Claude how to use it well',
    example:
      'MCP connects to your database; a skill documents your data model and query patterns',
    devOnly: false,
  },
  {
    name: 'Skill + Subagent',
    how: 'A skill spawns subagents for parallel work',
    example:
      '/review skill kicks off security, performance, and style subagents working in isolated context',
    devOnly: true,
  },
  {
    name: 'CLAUDE.md + Skills',
    how: 'CLAUDE.md holds always-on rules; skills hold reference material loaded on demand',
    example:
      'CLAUDE.md says "follow our API conventions"; a skill contains the full API style guide',
    devOnly: false,
  },
  {
    name: 'Hook + MCP',
    how: 'A hook triggers external actions through MCP',
    example:
      'Post-edit hook sends a Slack notification when Claude modifies critical files',
    devOnly: true,
  },
  {
    name: 'Skill + Subagent Memory',
    how: 'A subagent with persistent memory builds institutional knowledge over time',
    example:
      'A code review subagent remembers patterns from previous reviews and improves its suggestions',
    devOnly: true,
  },
];

export const naturalLanguageTriggerGuide = `To use your skills on claude.ai or Claude Desktop:

You DON'T need to type a command. Simply describe what you want:

  "I need to write a client proposal in our brand voice"
  \u2192 Claude automatically loads your brand-voice skill

  "Review this document for UK English"
  \u2192 Claude automatically loads your uk-english skill

  "Create a session handoff for the next person"
  \u2192 Claude automatically loads your session-handoff skill

The better the skill's description matches your request,
the more reliably Claude will load the right skill.`;

export const ukEnglishSkillExample = `---
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

export const layeringRules: LayeringRule[] = [
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

// ─── Platform badge colours ─────────────────────────────────────────────────

export const platformColours: Record<Platform, string> = {
  'claude.ai': 'bg-info-muted text-info-muted-foreground',
  Desktop: 'bg-important-muted text-important-muted-foreground',
  Code: 'bg-success-muted text-success-muted-foreground',
  CoWork: 'bg-warning-muted text-warning-muted-foreground',
};

// ─── Table of Contents structure ────────────────────────────────────────────

export interface TocEntry {
  id: string;
  label: string;
  devOnly: boolean;
  generalOnly: boolean;
}

export const tocEntries: TocEntry[] = [
  {
    id: 'decision-tree-heading',
    label: 'Decision Tree',
    devOnly: false,
    generalOnly: false,
  },
  {
    id: 'availability-heading',
    label: 'Platform Availability',
    devOnly: false,
    generalOnly: false,
  },
  {
    id: 'reference-cards-heading',
    label: 'Extension Reference',
    devOnly: false,
    generalOnly: false,
  },
  {
    id: 'natural-language-heading',
    label: 'Using Skills with Natural Language',
    devOnly: false,
    generalOnly: true,
  },
  {
    id: 'uk-skill-heading',
    label: 'Example: UK English Skill',
    devOnly: false,
    generalOnly: true,
  },
  {
    id: 'context-cost-heading',
    label: 'Context Cost Summary',
    devOnly: false,
    generalOnly: false,
  },
  {
    id: 'combinations-heading',
    label: 'How Extensions Work Together',
    devOnly: false,
    generalOnly: false,
  },
  {
    id: 'layering-heading',
    label: 'Feature Layering Rules',
    devOnly: true,
    generalOnly: false,
  },
  {
    id: 'dev-examples-heading',
    label: 'Copyable Examples',
    devOnly: true,
    generalOnly: false,
  },
];
