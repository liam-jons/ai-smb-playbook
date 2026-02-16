// Session Management data — typed TypeScript objects
// All content uses UK English.

export interface RuleOfThumb {
  id: string;
  title: string;
  description: string;
  signal: string;
  tracks: ('general' | 'developer')[];
}

export interface TokenAwarenessBand {
  range: string;
  userExperience: string;
  recommendation: string;
}

export interface HandoffScenario {
  id: string;
  name: string;
  frequency: string;
  description: string;
  characteristics: string[];
  templatePromptId: string;
}

export interface CopyablePrompt {
  id: string;
  label: string;
  description: string;
  content: string;
  tracks: ('general' | 'developer')[];
  whenToUse?: string;
}

export interface WorkedExample {
  id: string;
  title: string;
  context: string;
  steps: { session: number; description: string; outcome: string }[];
  tracks: ('general' | 'developer')[];
}

export interface WorkflowStep {
  number: number;
  title: string;
  description: string;
}

export interface PlatformComparison {
  aspect: string;
  claudeAi: string;
  claudeCode: string;
}

// ─────────────────────────────────────────────
// Track-conditional headings
// ─────────────────────────────────────────────

/**
 * The "Atomic Task Principle" heading should use plain language for general
 * users. SessionManagementSection.tsx (not owned by this data file) currently
 * hardcodes the heading. Use this helper to get the track-appropriate title.
 */
export function getAtomicTaskTitle(track: 'general' | 'developer'): string {
  return track === 'general'
    ? 'Breaking Big Tasks into Smaller Pieces'
    : 'The Atomic Task Principle';
}

// ─────────────────────────────────────────────
// Part 1: Rules of Thumb
// ─────────────────────────────────────────────

export const rulesOfThumb: RuleOfThumb[] = [
  {
    id: 'one-task',
    title: 'The "one task, one session" rule',
    description:
      'Each session should focus on a single task or a closely related set of tasks. If you are about to change topic entirely, start a new session.',
    signal:
      'You find yourself saying "while you\u2019re at it\u2026" or switching to a completely different subject.',
    tracks: ['general', 'developer'],
  },
  {
    id: '30-message',
    title: 'The 30-message guideline',
    description:
      'After roughly 25\u201330 back-and-forth messages, consider wrapping up. Longer sessions are not automatically worse, but this is the zone where quality starts to decline for most tasks.',
    signal:
      'You have been going back and forth for a while and the conversation feels long.',
    tracks: ['general', 'developer'],
  },
  {
    id: 'repetition',
    title: 'The repetition signal',
    description:
      'If Claude starts repeating information you already discussed, forgetting decisions you agreed on, or asking questions you have already answered, the session is degrading. Time to hand off.',
    signal:
      'Claude asks about something you told it ten messages ago, or re-reads a file it already examined.',
    tracks: ['general', 'developer'],
  },
  {
    id: 'drift',
    title: 'The drift signal',
    description:
      'If Claude\u2019s responses start feeling less specific or more generic \u2014 giving you boilerplate where it previously gave tailored advice \u2014 the earlier context is losing influence. Wrap up.',
    signal:
      'Responses feel more vague or templated than they did earlier in the conversation.',
    tracks: ['general', 'developer'],
  },
  {
    id: 'scope-creep',
    title: 'The scope creep signal',
    description:
      'If your original task has grown significantly, the accumulated context is diluting focus. Better to start a new session for the additional work.',
    signal:
      'The conversation has expanded well beyond what you originally intended.',
    tracks: ['general', 'developer'],
  },
  {
    id: 'good-stopping-point',
    title: 'The "good stopping point" principle',
    description:
      'Just finished a draft? Agreed on a plan? Completed a review? This is the natural moment to create a handoff and start fresh for the next phase.',
    signal:
      'You have reached a clear milestone or deliverable in the current work.',
    tracks: ['general', 'developer'],
  },
];

// ─────────────────────────────────────────────
// Part 1 (Developer): Token-Awareness Bands
// ─────────────────────────────────────────────

export const tokenAwarenessBands: TokenAwarenessBand[] = [
  {
    range: '0\u201350%',
    userExperience: 'Everything works well, full recall',
    recommendation:
      'Keep going. If the task is complete, create a handoff for good practice.',
  },
  {
    range: '50\u201370%',
    userExperience:
      'Subtle degradation; Claude may miss nuances from early conversation',
    recommendation:
      'Consider a checkpoint handoff. In Claude Code, try /compact with focus instructions first.',
  },
  {
    range: '70\u201385%',
    userExperience: 'Noticeable degradation; earlier context losing influence',
    recommendation:
      'Create a handoff now, before more context is lost. Be thorough \u2014 capture all decisions and state.',
  },
  {
    range: '85\u201395%',
    userExperience: 'Critical; auto-compaction imminent',
    recommendation: 'Emergency save. Focus on essential information only.',
  },
  {
    range: 'Post-compaction',
    userExperience: 'Session has been auto-compacted; gaps in recall',
    recommendation:
      'Recovery mode. Check saved outputs, recent git history, checkpoint files. Create a recovery handoff acknowledging what was lost.',
  },
];

// ─────────────────────────────────────────────
// Part 2: Handoff Workflow Steps
// ─────────────────────────────────────────────

export const handoffWorkflowSteps: WorkflowStep[] = [
  {
    number: 1,
    title: 'Recognise it is time',
    description: 'Use the rules of thumb from Part 1.',
  },
  {
    number: 2,
    title: 'Ask Claude to create the handoff',
    description: 'Use one of the copyable prompts below.',
  },
  {
    number: 3,
    title: 'Review the output',
    description:
      'Check that the key decisions, progress, and next steps are captured.',
  },
  {
    number: 4,
    title: 'Copy the handoff',
    description: 'Use the copy button.',
  },
  {
    number: 5,
    title: 'Start a new session',
    description: 'Open a fresh conversation or a new Claude Code session.',
  },
  {
    number: 6,
    title: 'Paste the handoff as your first message',
    description: 'Claude reads it and picks up where you left off.',
  },
];

// ─────────────────────────────────────────────
// Part 2 (Developer): Handoff Scenario Types
// ─────────────────────────────────────────────

export const handoffScenarios: HandoffScenario[] = [
  {
    id: 'planned',
    name: 'Planned session boundary',
    frequency: '~67% of handoffs',
    description:
      'Work reached a natural milestone. The most common scenario \u2014 you are choosing to stop.',
    characteristics: [
      'Work completed cleanly to a defined milestone',
      'Clear "what\u2019s done" and "what\u2019s next" boundary',
      'No urgency \u2014 you are choosing to stop',
      'Written with full context still available',
    ],
    templatePromptId: 'developer-handoff',
  },
  {
    id: 'overflow',
    name: 'Mid-task context overflow',
    frequency: '~14% of handoffs',
    description:
      'Context window is running out or has already compacted. Urgency: capture state before more is lost.',
    characteristics: [
      'Session hit compaction and lost context mid-work',
      'Higher urgency \u2014 capture state before more is lost',
      'Work is incomplete; must distinguish done / in progress / not started',
      'May include explicit warnings about what was lost',
    ],
    templatePromptId: 'emergency-dev',
  },
  {
    id: 'delegation',
    name: 'Task delegation / person handoff',
    frequency: '~10% of handoffs',
    description:
      'Work is being handed to a different person or session with different capabilities.',
    characteristics: [
      'Cannot assume the recipient has any prior context',
      'Must be fully self-contained: project overview, file locations, conventions',
      'May include environment setup instructions',
      'The recipient may have different capabilities',
    ],
    templatePromptId: 'delegation',
  },
  {
    id: 'artifact',
    name: 'Spec / artefact iteration handoff',
    frequency: '~24% of handoffs',
    description:
      'The session produced or iterated on a document. Structured around the artefact\u2019s version, changes, and review findings.',
    characteristics: [
      'The artefact is the primary deliverable',
      'Includes version history showing how the artefact evolved',
      'Clear mapping of changes and review findings',
      'Often includes a decision framework for the next session',
    ],
    templatePromptId: 'developer-handoff',
  },
  {
    id: 'multi-workstream',
    name: 'Multi-workstream handoff',
    frequency: '~14% of handoffs',
    description:
      'Multiple parallel work items, each at a different stage. Must preserve per-workstream status.',
    characteristics: [
      'Multiple independent work items with separate statuses',
      'Progress tracking is critical \u2014 which are done, in progress, blocked',
      'Priority ordering and dependency mapping needed',
      'Often includes a recommended execution order',
    ],
    templatePromptId: 'developer-handoff',
  },
];

// ─────────────────────────────────────────────
// Information Architecture
// ─────────────────────────────────────────────

export interface InfoArchElement {
  category: 'universal' | 'common' | 'scenario-specific';
  name: string;
  description: string;
}

export const infoArchElements: InfoArchElement[] = [
  {
    category: 'universal',
    name: 'Project identity block',
    description: 'Name, session number, date',
  },
  {
    category: 'universal',
    name: 'Context files to read first',
    description: 'Ordered, annotated list of key files',
  },
  {
    category: 'universal',
    name: 'Cumulative progress summary',
    description:
      'Recency-weighted \u2014 recent work expanded, older work compressed',
  },
  {
    category: 'universal',
    name: 'Session objectives',
    description: 'Primary, secondary, tertiary',
  },
  {
    category: 'universal',
    name: 'Data locations',
    description: 'Where key files live in the project',
  },
  {
    category: 'common',
    name: 'Important context / persistent principles',
    description: 'Or reference to where they live (e.g. CLAUDE.md)',
  },
  {
    category: 'common',
    name: 'Recommended approach / execution order',
    description: 'Suggested plan for how to tackle the next session',
  },
  {
    category: 'common',
    name: 'Open questions',
    description: 'Unresolved items that may affect future work',
  },
  {
    category: 'scenario-specific',
    name: 'Technology stack',
    description:
      'For technical projects \u2014 decided/recommended technologies',
  },
  {
    category: 'scenario-specific',
    name: 'Decision framework',
    description:
      'For review/iteration handoffs \u2014 options, criteria, recommended path',
  },
  {
    category: 'scenario-specific',
    name: 'Remaining work tracker',
    description: 'For multi-workstream \u2014 status of all known work items',
  },
  {
    category: 'scenario-specific',
    name: 'Verification checklists',
    description: 'For QA scenarios \u2014 specific checks to perform',
  },
  {
    category: 'scenario-specific',
    name: 'Environment setup',
    description:
      'For delegation \u2014 API keys, tool requirements, configuration',
  },
  {
    category: 'scenario-specific',
    name: 'Compaction warnings',
    description:
      'For emergency saves \u2014 what was lost and what to watch for',
  },
];

// ─────────────────────────────────────────────
// Part 3: Worked Examples
// ─────────────────────────────────────────────

export const workedExamples: WorkedExample[] = [
  {
    id: 'safeguarding',
    title: 'Writing a safeguarding policy review',
    context:
      'Instead of one session: "Review our safeguarding policy, identify gaps, draft updates, and create a summary for the board."',
    steps: [
      {
        session: 1,
        description:
          'Review our safeguarding policy against current guidance. List all gaps and areas needing updates.',
        outcome: 'Create handoff with the gap analysis.',
      },
      {
        session: 2,
        description:
          'For each gap identified, draft the specific policy update needed.',
        outcome: 'Create handoff with drafted updates.',
      },
      {
        session: 3,
        description:
          'Review all drafted updates for consistency and create a board summary of changes made.',
        outcome: 'Final deliverable ready.',
      },
    ],
    tracks: ['general', 'developer'],
  },
  {
    id: 'api-endpoint',
    title: 'Adding a new API endpoint',
    context:
      'Instead of one session: "Add a new API endpoint for user preferences, including database migration, validation, tests, and documentation."',
    steps: [
      {
        session: 1,
        description:
          'Review the existing API patterns in this codebase and propose the schema and endpoint design for user preferences.',
        outcome: 'Handoff captures the design decisions.',
      },
      {
        session: 2,
        description:
          'Implement the database migration and model based on the agreed design.',
        outcome: 'Handoff captures file changes and any deviations from plan.',
      },
      {
        session: 3,
        description: 'Implement the endpoint and input validation.',
        outcome: 'Handoff captures implementation state.',
      },
      {
        session: 4,
        description: 'Write tests and update API documentation.',
        outcome: 'All deliverables complete.',
      },
    ],
    tracks: ['developer'],
  },
];

// ─────────────────────────────────────────────
// Part 4: Platform Comparison
// ─────────────────────────────────────────────

export const platformComparisons: PlatformComparison[] = [
  {
    aspect: 'Starting a new session',
    claudeAi: 'Click "New chat"',
    claudeCode: 'Start a new terminal session or use /clear',
  },
  {
    aspect: 'Creating a handoff',
    claudeAi: 'Use the handoff prompt (copy-paste)',
    claudeCode:
      'Use the handoff prompt, or use the session-handoff skill if installed',
  },
  {
    aspect: 'Handoff format',
    claudeAi: 'Single text block to copy-paste into the new chat',
    claudeCode:
      'Structured markdown file saved to the project (e.g. .planning/continuation-prompts/)',
  },
  {
    aspect: 'Checking context usage',
    claudeAi: 'Watch for behavioural signals (repetition, drift)',
    claudeCode: 'Use /cost to check token usage',
  },
  {
    aspect: 'Alternative to per-session handoffs',
    claudeAi: 'Set up a Project with custom instructions for recurring work',
    claudeCode: 'Use CLAUDE.md and /docs for persistent project context',
  },
  {
    aspect: 'Skill invocation',
    claudeAi:
      'Automatic via natural language ("I need to hand off this session")',
    claudeCode: 'Explicit via /session-handoff or automatic',
  },
  {
    aspect: 'Commands',
    claudeAi: 'Not available (use skills instead)',
    claudeCode: 'Full slash command support',
  },
];

// ─────────────────────────────────────────────
// Copyable Prompts
// ─────────────────────────────────────────────

export const copyablePrompts: CopyablePrompt[] = [
  {
    id: 'general-handoff',
    label: 'Session Handoff \u2014 General',
    description:
      'Use this prompt to ask Claude to summarise your session before starting a fresh conversation.',
    content: `Before we finish, I need you to create a handoff summary so I can continue this work in a new conversation.

Please write a continuation prompt that includes:

1. **What we were working on** \u2014 a brief description of the project or task
2. **What we accomplished** \u2014 the key decisions made, content produced, or problems solved in this session
3. **What needs to happen next** \u2014 the specific next steps, in priority order
4. **Important things to remember** \u2014 any preferences, constraints, or decisions that the next session must follow
5. **Any open questions** \u2014 things we did not resolve that need addressing

Format this as a single block of text I can paste into a new conversation. Start the output with the instruction: "This is a continuation from a previous conversation. Please read the following context and then we will pick up where we left off."`,
    tracks: ['general', 'developer'],
    whenToUse:
      'When wrapping up a session in claude.ai or Claude Desktop and you want to continue the work later.',
  },
  {
    id: 'developer-handoff',
    label: 'Session Handoff \u2014 Developer',
    description:
      'A structured continuation prompt for Claude Code users. Produces a markdown file with full project context.',
    content: `Create a structured continuation prompt for the next session. Save it as a markdown file.

Include these sections:

## Project Context
- Project name, one-line description, and repo location
- Current branch and any uncommitted changes

## Context Files to Read First
- List the 3\u20135 most important files for the next session, in reading order
- Annotate the most critical file

## Progress Summary
- Use recency-weighted format: compress older sessions into one-line summaries, expand the current session with full detail
- Distinguish clearly between: completed, in progress, and not started

## Next Session Objectives
- Primary objective (must do)
- Secondary objective (if time permits)

## Key Decisions and Constraints
- Decisions made in this session that must be respected going forward
- Any persistent principles or conventions (or reference to where they live, e.g. CLAUDE.md)

## Recommended Approach
- Suggested execution order for the next session
- Note any tasks that could be parallelised via subagents

## Open Questions
- Unresolved items that may affect the next session\u2019s work

## Data Locations
- File tree or table showing where key project files are

Keep the total length under 4,000 words. Reference existing project files rather than repeating their content.`,
    tracks: ['developer'],
    whenToUse:
      'When wrapping up a Claude Code session at a natural milestone and planning to continue later.',
  },
  {
    id: 'emergency-general',
    label: 'Emergency Session Save',
    description:
      'For when your conversation is getting long and you want to save progress quickly.',
    content: `Our conversation is getting long and I want to save our progress before the quality drops. Please create an emergency handoff summary with:

1. **Where we are right now** \u2014 what is the current state of the work?
2. **What is finished** \u2014 what can I consider done?
3. **What is in progress** \u2014 what were we in the middle of?
4. **What was the plan** \u2014 what were we going to do next?
5. **Critical details** \u2014 anything the next conversation absolutely must know

Keep it concise. I will paste this into a new conversation to continue.`,
    tracks: ['general'],
    whenToUse:
      'When you notice Claude repeating itself or the conversation feels long and unwieldy.',
  },
  {
    id: 'emergency-dev',
    label: 'Emergency Session Save \u2014 Developer',
    description:
      'For when context is running low in Claude Code. Captures state with maximum efficiency.',
    content: `Context is running low. Create an emergency continuation prompt immediately.

Focus on:
1. **Current state snapshot** \u2014 what exists now (files changed, decisions made, code written)
2. **In-progress work** \u2014 what we were actively working on and its exact state
3. **Remaining plan** \u2014 what was next in the execution order
4. **Known issues** \u2014 anything broken, incomplete, or requiring attention
5. **Critical file references** \u2014 absolute paths to the most important files

Skip the preamble. Be maximally concise. Every token counts.`,
    tracks: ['developer'],
    whenToUse:
      'When /cost shows high context usage (85%+) or auto-compaction has triggered.',
  },
  {
    id: 'task-decomposition',
    label: 'Break Down a Large Task',
    description:
      'Ask Claude to help you decompose a large task into focused subtasks, each suitable for its own session.',
    content: `I have a task I would like to break into smaller, focused subtasks. Here is the task:

[Describe your task here]

Please help me decompose this into atomic subtasks by:

1. **Identifying the natural phases** \u2014 what distinct stages does this work go through? (e.g. research, planning, drafting, review, refinement)
2. **Defining clear boundaries** \u2014 each subtask should have a specific, measurable outcome. What does "done" look like for each one?
3. **Ordering by dependency** \u2014 which subtasks must finish before others can start? Which can be done in parallel?
4. **Estimating scope** \u2014 for each subtask, is it a single focused session or might it need multiple sessions?

For each subtask, give me:
- A one-line description
- The specific deliverable or outcome
- Any inputs it needs from previous subtasks
- Suggested session handoff points (where to stop and create a continuation prompt)`,
    tracks: ['general', 'developer'],
    whenToUse:
      'When you have a large task and want to plan how to break it across multiple sessions.',
  },
  {
    id: 'session-review',
    label: 'Review This Session Before Wrapping Up',
    description:
      'Get a quick summary of what was covered in this session before deciding whether to continue or create a handoff.',
    content: `Before we wrap up this session, I would like a brief review of what we have covered. Please summarise:

1. **Decisions made** \u2014 list every decision or agreement from this session
2. **Work produced** \u2014 what outputs, drafts, or changes were created
3. **Things we changed our minds about** \u2014 any earlier plans we modified and why
4. **Outstanding items** \u2014 anything we discussed but did not complete
5. **Quality check** \u2014 is there anything from this session you would recommend I double-check or revisit?

This is not a handoff \u2014 I just want to make sure we have not missed anything before I decide whether to continue or wrap up.`,
    tracks: ['general', 'developer'],
    whenToUse:
      'At the end of a productive session when you want to take stock before deciding next steps.',
  },
  {
    id: 'delegation',
    label: 'Hand Off to a Colleague',
    description:
      'Create a fully self-contained briefing for someone else to continue the work without any prior context.',
    content: `I need to hand this work off to a colleague who will continue in a separate session. They have no context about this project.

Create a fully self-contained briefing that includes:

## Project Overview
- What is this project? (one paragraph)
- What is the goal?

## Current State
- What has been completed so far?
- What is the current status?

## What Needs to Happen Next
- Specific tasks, in priority order
- Expected outcomes for each

## Key Decisions Already Made
- Decisions that must be respected (do not revisit these)
- The reasoning behind the most important ones

## Important Constraints
- Technical constraints, style preferences, or rules
- Anything the next person might accidentally violate without knowing

## Files and Resources
- Where to find key files or documents
- Any credentials, access requirements, or setup steps needed

## How to Get Started
- A recommended first step for the new person
- What to read first before doing anything

Write this assuming the reader knows nothing about the project. Be explicit about things that might seem obvious.`,
    tracks: ['general', 'developer'],
    whenToUse:
      'When handing work to another person or team member who has no context on the project.',
  },
];
