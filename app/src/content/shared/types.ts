export type Track = 'general' | 'developer';

export interface Section {
  /** Section number, e.g. '1.2' */
  id: string;
  /** URL-safe slug, e.g. 'context-simulator' */
  slug: string;
  /** Display title, e.g. 'How Context Works' */
  title: string;
  /** Optional subtitle for additional context */
  subtitle?: string;
  /** Which track this section belongs to, or 'both' for shared sections */
  track: Track | 'both';
  /** Brief description of the section content */
  description: string;
  /** Shorter title for sidebar display (falls back to title) */
  sidebarTitle?: string;
  /** Lucide icon name for navigation */
  icon?: string;
}

export interface ContentBlock {
  /** The type of content block */
  type: 'text' | 'code' | 'prompt' | 'callout' | 'list' | 'interactive';
  /** The main content — markdown text, code string, or prompt text */
  content: string;
  /** Programming language for code blocks */
  language?: string;
  /** Variant for callout blocks: info, warning, tip, important */
  variant?: 'info' | 'warning' | 'tip' | 'important';
  /** Optional title for the block */
  title?: string;
  /** Optional list items for list blocks */
  items?: string[];
}

export interface SectionContent {
  /** Section ID matching Section.id */
  sectionId: string;
  /** Content blocks to render in order */
  blocks: ContentBlock[];
}
