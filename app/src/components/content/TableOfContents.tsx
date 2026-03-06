import { cn } from '@/lib/utils';

export interface TocEntry {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  entries: TocEntry[];
  className?: string;
}

export function TableOfContents({ entries, className }: TableOfContentsProps) {
  return (
    <nav
      aria-label="Page contents"
      className={cn(
        'rounded-lg border border-border bg-muted/20 dark:bg-muted/40 px-4 py-4 sm:px-6',
        className,
      )}
    >
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        On this page
      </h2>
      <ul className="columns-1 gap-x-8 space-y-1.5 sm:columns-2">
        {entries.map((entry) => (
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
  );
}
