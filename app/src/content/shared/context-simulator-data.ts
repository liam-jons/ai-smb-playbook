// Context Simulator data — typed TypeScript objects for the interactive simulator
// All figures are ballpark estimates. Exact token counts vary by Claude version,
// model, configuration, and content.

import type { SiteConfigData } from '@/config/client-config-schema';

export interface ContextSegmentData {
  id: string;
  label: string;
  /** General-user-friendly label (used when isDev is false). Falls back to label if not set. */
  generalLabel?: string;
  defaultTokens: number;
  colour: string;
  colourDark: string;
  description: string;
  detailedDescription: string;
  isFixed: boolean;
  isConversation: boolean;
  isBuffer: boolean;
}

export interface PresetData {
  id: 'minimal' | 'moderate' | 'heavy';
  label: string;
  description: string;
  mcpServers: number;
  claudeMdLines: number;
  skillCount: number;
  toolSearchEnabled: boolean;
}

export interface DegradationStage {
  id: 'healthy' | 'early' | 'noticeable' | 'critical';
  label: string;
  threshold: number;
  colour: string;
  colourDark: string;
  badgeClass: string;
  description: string;
  detailedDescription: string;
  overlayOpacity: number;
}

export interface ConversationTurnType {
  id: string;
  label: string;
  tokenRange: [number, number];
  description: string;
}

export const TOTAL_CONTEXT = 200_000;
export const SYSTEM_PROMPT_TOKENS = 5_000;
export const BUILT_IN_TOOL_TOKENS = 15_000;
export const ENVIRONMENT_TOKENS = 1_000;
export const RESPONSE_BUFFER_TOKENS = 40_000;
export const TOKENS_PER_CLAUDE_MD_LINE = 20;
export const TOKENS_PER_MCP_SERVER = 6_000;
export const TOKENS_PER_SKILL = 400;
export const MCP_TOOL_SEARCH_CAP = 20_000;

export const segments: ContextSegmentData[] = [
  {
    id: 'system-prompt',
    label: 'System Prompt',
    defaultTokens: SYSTEM_PROMPT_TOKENS,
    colour: 'bg-segment-system',
    colourDark: '',
    description:
      "Claude's core instructions \u2014 personality, behaviour rules, safety guidelines. Present in every request.",
    detailedDescription:
      "Claude's core instructions including personality, behaviour rules, and safety guidelines. Approximately 3,000\u20138,500 tokens depending on Claude version. Always present in every API call.",
    isFixed: true,
    isConversation: false,
    isBuffer: false,
  },
  {
    id: 'built-in-tools',
    label: 'Built-in Tools',
    defaultTokens: BUILT_IN_TOOL_TOKENS,
    colour: 'bg-segment-tools',
    colourDark: '',
    description:
      'JSON schemas for Read, Write, Edit, Bash, Glob, Grep, and more (~15\u201318 tools).',
    detailedDescription:
      'JSON schemas for all built-in tools (Read, Write, Edit, Bash, Glob, Grep, WebFetch, NotebookEdit, etc.). Each tool definition costs ~500\u20131,200 tokens. Total: ~12,000\u201320,000 tokens.',
    isFixed: true,
    isConversation: false,
    isBuffer: false,
  },
  {
    id: 'claude-md',
    label: 'CLAUDE.md',
    generalLabel: 'Project Instructions',
    defaultTokens: 4_000,
    colour: 'bg-segment-instructions',
    colourDark: '',
    description:
      'Project custom instructions and conventions. Size depends on content (~20 tokens per line).',
    detailedDescription:
      'Project-level CLAUDE.md file(s) containing conventions, rules, and project context. Approximately 20 tokens per line. Multiple files (user, project, managed) are additive. Recommendation: keep under ~500 lines.',
    isFixed: false,
    isConversation: false,
    isBuffer: false,
  },
  {
    id: 'mcp-tools',
    label: 'MCP Tools',
    generalLabel: 'Extensions',
    defaultTokens: 12_000,
    colour: 'bg-segment-mcp',
    colourDark: '',
    description:
      'External tool definitions. Highly variable (0\u201360,000+ tokens depending on servers).',
    detailedDescription:
      'MCP server tool schemas. Each server adds ~4,000\u20138,000 tokens. With Tool Search enabled (default since v2.1.7+), MCP tokens are capped at ~10% of context (~20,000 tokens). Without Tool Search, full schemas load for all servers.',
    isFixed: false,
    isConversation: false,
    isBuffer: false,
  },
  {
    id: 'skills',
    label: 'Skills',
    defaultTokens: 1_000,
    colour: 'bg-segment-skills',
    colourDark: '',
    description:
      'Brief skill descriptions. Zero cost if disable-model-invocation: true.',
    detailedDescription:
      'Short descriptions for model-invocable skills. Approximately 300\u2013500 tokens per skill. Cost is zero if disable-model-invocation: true is set. Full skill content loads on-demand when invoked.',
    isFixed: false,
    isConversation: false,
    isBuffer: false,
  },
  {
    id: 'environment',
    label: 'Environment',
    defaultTokens: ENVIRONMENT_TOKENS,
    colour: 'bg-segment-environment',
    colourDark: '',
    description: 'Git status, working directory, OS information.',
    detailedDescription:
      'Repository state, working directory info, OS details. Approximately 500\u20131,000 tokens. Relatively stable across sessions.',
    isFixed: true,
    isConversation: false,
    isBuffer: false,
  },
  {
    id: 'conversation',
    label: 'Conversation',
    defaultTokens: 0,
    colour: 'bg-segment-conversation',
    colourDark: '',
    description:
      'Your messages and Claude\u2019s responses. This is what grows as you work.',
    detailedDescription:
      'All user messages and Claude responses, including tool calls and their results. Each turn adds approximately 3,000\u20138,000 tokens. Tool results (file reads, command output) are the biggest consumers.',
    isFixed: false,
    isConversation: true,
    isBuffer: false,
  },
  {
    id: 'response-buffer',
    label: 'Reserved for Response',
    generalLabel: 'Reserved for Response',
    defaultTokens: RESPONSE_BUFFER_TOKENS,
    colour: 'bg-segment-buffer',
    colourDark: '',
    description:
      'Space set aside for Claude\u2019s next reply. NOT available for conversation.',
    detailedDescription:
      'Claude Code reserves approximately 33,000\u201345,000 tokens (~20% of the window) for generating responses. This space is NOT available for your conversation history. When the status bar shows 20% remaining, you may only have ~3.5% of true free space before compaction triggers.',
    isFixed: true,
    isConversation: false,
    isBuffer: true,
  },
];

/** Build presets with client-specific labels from config. */
export function getPresets(config: SiteConfigData): PresetData[] {
  return [
    {
      id: 'minimal',
      label: 'Minimal',
      description: 'New project, no extras',
      mcpServers: 0,
      claudeMdLines: 50,
      skillCount: 0,
      toolSearchEnabled: true,
    },
    {
      id: 'moderate',
      label: 'Moderate',
      description: `Typical ${config.companyShortName} setup`,
      mcpServers: 2,
      claudeMdLines: 200,
      skillCount: 3,
      toolSearchEnabled: true,
    },
    {
      id: 'heavy',
      label: 'Heavy',
      description: 'Many integrations',
      mcpServers: 5,
      claudeMdLines: 500,
      skillCount: 10,
      toolSearchEnabled: false,
    },
  ];
}

export const degradationStages: DegradationStage[] = [
  {
    id: 'healthy',
    label: 'Full attention',
    threshold: 0,
    colour: 'bg-success',
    colourDark: '',
    badgeClass:
      'border-success/30 bg-success-muted text-success-muted-foreground',
    description: 'Claude can recall everything in the conversation accurately.',
    detailedDescription:
      'Full recall of all conversation context. Consistent adherence to CLAUDE.md rules. Accurate file recall and code understanding.',
    overlayOpacity: 0,
  },
  {
    id: 'early',
    label: 'Slight fade',
    threshold: 50,
    colour: 'bg-warning',
    colourDark: '',
    badgeClass:
      'border-warning/30 bg-warning-muted text-warning-muted-foreground',
    description:
      'Instructions from the middle of your conversation start getting less weight. You might need to repeat things.',
    detailedDescription:
      'Subtle degradation begins. Instructions from early in the conversation start getting less weight. CLAUDE.md and system prompt remain strong (primacy bias). Recent exchanges remain strong (recency bias). Middle of conversation history starts fading.',
    overlayOpacity: 0.15,
  },
  {
    id: 'noticeable',
    label: 'Noticeable fade',
    threshold: 70,
    colour: 'bg-warning',
    colourDark: '',
    badgeClass:
      'border-warning/30 bg-warning-muted text-warning-muted-foreground',
    description:
      'Claude may re-read files it already examined, ask about things previously discussed, or contradict earlier decisions. Responses get slower.',
    detailedDescription:
      'Pronounced degradation. Claude re-reads files it already examined, asks about things previously discussed, may contradict earlier decisions. Random solutions instead of systematic reasoning. Tool results from mid-session become less influential.',
    overlayOpacity: 0.35,
  },
  {
    id: 'critical',
    label: 'Critical \u2014 consider a fresh session',
    threshold: 85,
    colour: 'bg-danger',
    colourDark: '',
    badgeClass: 'border-danger/30 bg-danger-muted text-danger-muted-foreground',
    description:
      'Quality has significantly degraded. Earlier context is largely ineffective. Auto-compaction may trigger.',
    detailedDescription:
      'Critical degradation. Quality has significantly degraded. Earlier context is largely ineffective. Only recent exchanges and system prompt/CLAUDE.md are reliably attended to. Auto-compaction is imminent.',
    overlayOpacity: 0.55,
  },
];

export const conversationTurnTypes: ConversationTurnType[] = [
  {
    id: 'short',
    label: 'Short exchange',
    tokenRange: [2_500, 3_500],
    description:
      '~1,000 tokens (your message) + ~2,000 tokens (Claude\u2019s response)',
  },
  {
    id: 'code-review',
    label: 'Code review',
    tokenRange: [5_000, 7_000],
    description:
      '~1,500 tokens (your message) + ~4,500 tokens (Claude\u2019s response including tool calls)',
  },
  {
    id: 'file-edit',
    label: 'File reading + edit',
    tokenRange: [7_000, 9_000],
    description:
      '~1,200 tokens (your message) + ~6,800 tokens (Claude\u2019s response with file reads and edits)',
  },
];

/** Prompt the user can copy to get Claude to write a session handoff */
export const sessionHandoffPrompt = `I need to wrap up this session and continue in a fresh one. Before we stop, please write a comprehensive handoff summary that I can paste into a new session. Include:

1. **What we were working on** \u2014 the overall goal and current task
2. **What we accomplished** \u2014 key decisions made, files created or modified, patterns established
3. **Current state** \u2014 what is working, what is partially complete, what is not started
4. **Important context** \u2014 any conventions, constraints, or requirements that a fresh session needs to know
5. **Next steps** \u2014 what should be done next, in priority order
6. **Open questions** \u2014 anything unresolved that needs attention

Format this as a single message I can paste at the start of a new session. Write it as instructions to your future self \u2014 assume the new session has no memory of this conversation.`;

/** CLAUDE.md compact instructions for the developer track */
export const compactInstructions = `## Compact Instructions

When compacting this conversation, always preserve:
- Current task goals and acceptance criteria
- File paths and function signatures for in-progress work
- Architecture decisions and their rationale
- Testing patterns and conventions established
- Any known issues or edge cases identified`;

/**
 * Track-conditional tip text for the context management tips section.
 * Keys correspond to tip numbers in the "How to get the most from your context" list.
 * Each entry provides a general-track and developer-track variant.
 */
export const contextTipVariants = {
  /** Tip 3: Where to put critical instructions */
  tip3: {
    general:
      'Put critical instructions in your project custom instructions, so they load at the start of every session and benefit from primacy bias (the model pays strong attention to what comes first).',
    developer:
      'Put critical instructions in CLAUDE.md. These load at the start of every session and benefit from primacy bias (the model pays strong attention to what comes first).',
  },
  /** Tip 5: Mid-conversation instruction fade */
  tip5: {
    general:
      'Do not rely on mid-conversation instructions. If you told Claude \u2018always use UK English\u2019 ten messages ago, it may have faded. Put it in your project custom instructions instead.',
    developer:
      'Do not rely on mid-conversation instructions. If you said \u2018always use TypeScript\u2019 ten messages ago, it may have faded. Put it in CLAUDE.md instead.',
  },
} as const;

/** Get the display label for a segment, using the general-friendly label when not in developer track */
export function getSegmentLabel(
  segment: ContextSegmentData,
  isDev: boolean,
): string {
  if (!isDev && segment.generalLabel) {
    return segment.generalLabel;
  }
  return segment.label;
}

/** Calculate tokens for a given configuration */
export function calculateTokens(config: {
  mcpServers: number;
  claudeMdLines: number;
  skillCount: number;
  toolSearchEnabled: boolean;
}) {
  const claudeMdTokens = config.claudeMdLines * TOKENS_PER_CLAUDE_MD_LINE;
  const rawMcpTokens = config.mcpServers * TOKENS_PER_MCP_SERVER;
  const mcpTokens = config.toolSearchEnabled
    ? Math.min(rawMcpTokens, MCP_TOOL_SEARCH_CAP)
    : rawMcpTokens;
  const skillTokens = config.skillCount * TOKENS_PER_SKILL;

  const fixedOverhead =
    SYSTEM_PROMPT_TOKENS +
    BUILT_IN_TOOL_TOKENS +
    claudeMdTokens +
    mcpTokens +
    skillTokens +
    ENVIRONMENT_TOKENS;

  const availableForConversation =
    TOTAL_CONTEXT - fixedOverhead - RESPONSE_BUFFER_TOKENS;

  return {
    systemPrompt: SYSTEM_PROMPT_TOKENS,
    builtInTools: BUILT_IN_TOOL_TOKENS,
    claudeMd: claudeMdTokens,
    mcp: mcpTokens,
    skills: skillTokens,
    environment: ENVIRONMENT_TOKENS,
    responseBuffer: RESPONSE_BUFFER_TOKENS,
    fixedOverhead,
    availableForConversation: Math.max(0, availableForConversation),
  };
}

/** Get degradation stage from usage percentage */
export function getDegradationStage(usagePercentage: number): DegradationStage {
  const sorted = [...degradationStages].sort(
    (a, b) => b.threshold - a.threshold,
  );
  return (
    sorted.find((s) => usagePercentage >= s.threshold) ?? degradationStages[0]
  );
}

/** Generate a random token count for a conversation turn */
export function randomTurnTokens(): number {
  return Math.round(3_000 + Math.random() * 5_000);
}

/** Generate token count for a specific turn type */
export function turnTypeTokens(typeId: string): number {
  const turnType = conversationTurnTypes.find((t) => t.id === typeId);
  if (!turnType) return randomTurnTokens();
  const [min, max] = turnType.tokenRange;
  return Math.round(min + Math.random() * (max - min));
}

/** Format a number with commas (UK style) */
export function formatTokens(n: number): string {
  return n.toLocaleString('en-GB');
}
