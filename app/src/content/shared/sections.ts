import type { ClientConfig } from '@/config/client-config-schema';
import type { Section } from './types';

export const sections: Section[] = [
  // General Track (also visible to developers where track is 'both')
  {
    id: '1.1',
    slug: 'welcome',
    title: 'Welcome & Orientation',
    subtitle: 'Getting started with AI',
    track: 'both',
    description:
      'An introduction to the playbook, what you will learn, and how to navigate the two tracks.',
    icon: 'Compass',
  },
  {
    id: '1.2',
    slug: 'context',
    title: 'How Context Works',
    subtitle: 'Understanding the context window',
    track: 'both',
    description:
      'How Claude uses context to produce better results, and practical strategies for managing it.',
    icon: 'Brain',
  },
  {
    id: '1.3',
    slug: 'sessions',
    title: 'Session Management',
    subtitle: 'Structured conversations that deliver',
    track: 'both',
    description:
      'How to structure sessions, hand off between conversations, and maintain continuity.',
    icon: 'MessageSquare',
  },
  {
    id: '1.3b',
    slug: 'reliable-output',
    title: 'Getting Reliable Output',
    subtitle: 'Strategies for accurate AI responses',
    track: 'general',
    description:
      'Practical patterns for getting accurate, grounded responses from Claude \u2014 avoiding made-up facts, inconsistencies, and hallucinations.',
    icon: 'Target',
  },
  {
    id: '1.4',
    slug: 'skills-extensions',
    title: 'Skills, Extensions & Decision Tree',
    sidebarTitle: 'Extending Claude',
    subtitle: 'Choosing the right tool for the job',
    track: 'both',
    description:
      'Understanding skills, extensions, and the decision tree for selecting the right approach.',
    icon: 'GitBranch',
  },
  {
    id: '1.5',
    slug: 'governance',
    title: 'AI Governance Policy',
    subtitle: 'Responsible AI use for your team',
    track: 'both',
    description:
      'A customisable governance policy template covering responsible AI use, data handling, and compliance.',
    icon: 'Shield',
  },
  {
    id: '1.6',
    slug: 'brand-voice',
    title: 'Brand Voice & UK English',
    subtitle: 'Consistent tone and language',
    track: 'both',
    description:
      'Setting up Claude to use your brand voice, UK English spelling, and consistent tone.',
    icon: 'PenTool',
  },
  {
    id: '1.7',
    slug: 'recurring-tasks',
    title: 'Recurring & Scheduled Tasks',
    sidebarTitle: 'Task Automation',
    subtitle: 'Automating the repetitive',
    track: 'both',
    description:
      'How to set up recurring prompts and scheduled workflows for routine business tasks.',
    icon: 'Clock',
  },
  {
    id: '1.8',
    slug: 'roi-measurement',
    title: 'Measuring AI ROI',
    sidebarTitle: 'Measuring ROI',
    subtitle: 'Proving the value of AI investment',
    track: 'both',
    description:
      'Practical frameworks, calculators, and task-level templates for measuring and communicating the return on AI tool investment.',
    icon: 'TrendingUp',
  },

  // Developer Track
  {
    id: '1.9',
    slug: 'claude-md',
    title: 'CLAUDE.md Files',
    subtitle: 'Project-level AI configuration',
    track: 'developer',
    description:
      'How to create and maintain CLAUDE.md files that give Claude persistent project context.',
    icon: 'FileCode',
  },
  {
    id: '1.10',
    slug: 'documentation',
    title: 'Documentation Structure',
    subtitle: 'AI-friendly project documentation',
    track: 'developer',
    description:
      'Structuring documentation so Claude can navigate and reference it effectively.',
    icon: 'FolderTree',
  },
  {
    id: '1.11',
    slug: 'codebase-mapping',
    title: 'Codebase Mapping',
    subtitle: 'Helping Claude understand your code',
    track: 'developer',
    description:
      'Using the GSD Mapper and similar tools to give Claude a map of your codebase.',
    icon: 'Map',
  },
  {
    id: '1.12',
    slug: 'hallucinations',
    title: 'Avoiding Hallucinations',
    subtitle: 'Keeping AI output grounded',
    track: 'developer',
    description:
      'Strategies and guardrails to prevent Claude from generating incorrect or fabricated information.',
    icon: 'AlertTriangle',
  },
  {
    id: '1.13',
    slug: 'regression-testing',
    title: 'AI-Driven Regression Testing',
    subtitle: 'Test generation and maintenance',
    track: 'developer',
    description:
      'Using Claude to generate, maintain, and run regression tests across your codebase.',
    icon: 'TestTube',
  },
  {
    id: '1.14',
    slug: 'mcp-usage',
    title: 'Safe MCP Usage',
    subtitle: 'Model Context Protocol best practices',
    track: 'developer',
    description:
      'How to safely configure and use MCP servers and tools with Claude.',
    icon: 'Plug',
  },
  {
    id: '1.15',
    slug: 'plugins',
    title: 'Plugin Recommendations',
    subtitle: 'Extending Claude with plugins',
    track: 'developer',
    description:
      'Recommended plugins for Claude, how to evaluate them, and configuration guidance.',
    icon: 'Puzzle',
  },
  {
    id: '1.16',
    slug: 'technical-debt',
    title: 'Codebase Auditing & Technical Debt',
    sidebarTitle: 'Code Auditing & Debt',
    subtitle: 'Using AI for code quality',
    track: 'developer',
    description:
      'Using Claude to audit codebases, identify technical debt, and plan remediation.',
    icon: 'Search',
  },

  // Shared section (both tracks)
  {
    id: '1.17',
    slug: 'starter-kit',
    title: 'Starter Kit Contents',
    subtitle: 'Ready-to-use files for your Claude environment',
    track: 'both',
    description:
      'Drop-in skill files, templates, prompts, and plugin references — everything you need to get started.',
    icon: 'Package',
  },
];

/** Get sections filtered by track */
export function getSectionsForTrack(track: 'general' | 'developer'): Section[] {
  return sections.filter((s) => s.track === track || s.track === 'both');
}

/** Find a section by its slug */
export function getSectionBySlug(slug: string): Section | undefined {
  return sections.find((s) => s.slug === slug);
}

/** Find a section by its ID */
export function getSectionById(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}

/** Get next and previous sections within a track */
export function getAdjacentSections(
  slug: string,
  track: 'general' | 'developer',
): { prev: Section | undefined; next: Section | undefined } {
  const trackSections = getSectionsForTrack(track);
  const index = trackSections.findIndex((s) => s.slug === slug);

  return {
    prev: index > 0 ? trackSections[index - 1] : undefined,
    next:
      index < trackSections.length - 1 ? trackSections[index + 1] : undefined,
  };
}

/** Get sections filtered by track AND client config (sections.enabled/disabled, hasDeveloperTrack). */
export function getFilteredSectionsForTrack(
  track: 'general' | 'developer',
  sectionsConfig: ClientConfig['sections'],
  hasDeveloperTrack: boolean,
): Section[] {
  // If developer track is disabled and requesting developer, return empty
  if (track === 'developer' && !hasDeveloperTrack) return [];

  let trackSections = sections.filter(
    (s) => s.track === track || s.track === 'both',
  );

  // If an enabled list is specified (non-null), only include those slugs
  if (sectionsConfig.enabled) {
    trackSections = trackSections.filter((s) =>
      sectionsConfig.enabled!.includes(s.slug),
    );
  }

  // Remove any explicitly disabled sections
  if (sectionsConfig.disabled && sectionsConfig.disabled.length > 0) {
    trackSections = trackSections.filter(
      (s) => !sectionsConfig.disabled!.includes(s.slug),
    );
  }

  return trackSections;
}

/** Get next and previous sections within a track, respecting client config filtering. */
export function getFilteredAdjacentSections(
  slug: string,
  track: 'general' | 'developer',
  sectionsConfig: ClientConfig['sections'],
  hasDeveloperTrack: boolean,
): { prev: Section | undefined; next: Section | undefined } {
  const trackSections = getFilteredSectionsForTrack(
    track,
    sectionsConfig,
    hasDeveloperTrack,
  );
  const index = trackSections.findIndex((s) => s.slug === slug);

  return {
    prev: index > 0 ? trackSections[index - 1] : undefined,
    next:
      index < trackSections.length - 1 ? trackSections[index + 1] : undefined,
  };
}
