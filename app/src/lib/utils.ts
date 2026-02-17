import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Strip markdown syntax to produce plain text suitable for pasting into Word or
 * Google Docs. Headings are uppercased for visual structure.
 */
export function stripMarkdown(md: string): string {
  return (
    md
      // Remove heading markers, uppercase heading text
      .replace(/^#{1,6}\s+(.+)$/gm, (_m, text: string) => text.toUpperCase())
      // Remove bold + italic markers
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
      // Remove backtick markers
      .replace(/`([^`]+)`/g, '$1')
      // Convert markdown bullet lists to bullet character
      .replace(/^[-*]\s+/gm, '\u2022 ')
      // Strip markdown links [text](url) → text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove horizontal rules
      .replace(/^---+$/gm, '')
      // Remove table header separator rows (e.g. |---|---|)
      .replace(/^\|[-| :]+\|$/gm, '')
      // Clean up table rows: remove leading/trailing pipes
      .replace(/^\|(.+)\|$/gm, (_m, row: string) =>
        row
          .split('|')
          .map((c) => c.trim())
          .join('\t'),
      )
      // Collapse 3+ consecutive newlines into 2
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}
