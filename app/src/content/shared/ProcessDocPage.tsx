import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { CopyButton } from '@/components/content/CopyButton';
import { CodeBlock } from '@/components/content/CodeBlock';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Lightweight markdown renderer for the process document             */
/*  Handles: headings, paragraphs, lists, blockquotes, code blocks,   */
/*  bold, inline code, horizontal rules, links                        */
/* ------------------------------------------------------------------ */

interface MarkdownBlock {
  type: 'heading' | 'paragraph' | 'list' | 'blockquote' | 'code' | 'hr';
  level?: number;
  content?: string;
  items?: string[];
  language?: string;
}

function parseMarkdown(raw: string): MarkdownBlock[] {
  const lines = raw.split('\n');
  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+\s*$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        content: headingMatch[2],
      });
      i++;
      continue;
    }

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || 'text';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: 'code',
        content: codeLines.join('\n'),
        language: lang,
      });
      i++; // skip closing ```
      continue;
    }

    // Blockquote (consecutive > lines)
    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({
        type: 'blockquote',
        content: quoteLines.join('\n'),
      });
      continue;
    }

    // Unordered list (- items)
    if (line.match(/^-\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^-\s+/)) {
        items.push(lines[i].replace(/^-\s+/, ''));
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    // Paragraph
    {
      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].startsWith('#') &&
        !lines[i].startsWith('>') &&
        !lines[i].startsWith('```') &&
        !lines[i].match(/^-\s+/) &&
        !/^---+\s*$/.test(lines[i].trim())
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      if (paraLines.length > 0) {
        blocks.push({ type: 'paragraph', content: paraLines.join(' ') });
      }
    }
  }

  return blocks;
}

/** Renders inline markdown (bold, inline code, links) as React nodes */
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      nodes.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      nodes.push(
        <code
          key={match.index}
          className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono"
        >
          {match[3]}
        </code>
      );
    } else if (match[4] && match[5]) {
      nodes.push(
        <a
          key={match.index}
          href={match[5]}
          className="font-medium text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[4]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function MarkdownRenderer({ blocks }: { blocks: MarkdownBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'hr':
            return <hr key={i} className="my-8 border-border" />;

          case 'heading': {
            const Tag = `h${block.level}` as 'h1' | 'h2' | 'h3' | 'h4';
            const sizes: Record<number, string> = {
              1: 'text-2xl sm:text-3xl font-bold tracking-tight mb-4 mt-8',
              2: 'text-xl sm:text-2xl font-semibold tracking-tight mb-3 mt-8',
              3: 'text-lg font-semibold mb-2 mt-6',
              4: 'text-base font-semibold mb-2 mt-4',
            };
            return (
              <Tag key={i} className={cn(sizes[block.level ?? 2], 'text-foreground')}>
                {renderInline(block.content ?? '')}
              </Tag>
            );
          }

          case 'paragraph':
            return (
              <p
                key={i}
                className="mb-4 text-sm leading-relaxed text-muted-foreground"
                style={{ maxWidth: '65ch' }}
              >
                {renderInline(block.content ?? '')}
              </p>
            );

          case 'list':
            return (
              <ul key={i} className="mb-4 space-y-1.5 pl-1" style={{ maxWidth: '65ch' }}>
                {block.items?.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30"
                      aria-hidden="true"
                    />
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case 'blockquote':
            return (
              <blockquote
                key={i}
                className="mb-4 border-l-2 border-primary/30 pl-4"
                style={{ maxWidth: '65ch' }}
              >
                {block.content?.split('\n').map((line, j) => (
                  <p
                    key={j}
                    className="text-sm leading-relaxed text-muted-foreground/80"
                  >
                    {renderInline(line)}
                  </p>
                ))}
              </blockquote>
            );

          case 'code':
            return (
              <div key={i} className="mb-4" style={{ maxWidth: '65ch' }}>
                <CodeBlock
                  code={block.content ?? ''}
                  language={block.language ?? 'text'}
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export function ProcessDocPage() {
  const [blocks, setBlocks] = useState<MarkdownBlock[] | null>(null);
  const [rawContent, setRawContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/docs/repeatable-workflow.md')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load document (' + res.status + ')');
        return res.text();
      })
      .then((text) => {
        setRawContent(text);
        setBlocks(parseMarkdown(text));
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <main id="main-content" className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Could not load the process document: {error}
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to playbook
          </Link>
        </div>
      </main>
    );
  }

  if (!blocks) {
    return (
      <main id="main-content" className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </main>
    );
  }

  return (
    <main id="main-content" className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to playbook
        </Link>

        {/* Copy full document button */}
        <div className="mb-8 flex items-center gap-3">
          <CopyButton text={rawContent} className="h-auto gap-2 px-3 py-2 opacity-100" />
          <span className="text-sm text-muted-foreground">
            Copy full document to clipboard
          </span>
        </div>

        {/* Rendered markdown */}
        <article>
          <MarkdownRenderer blocks={blocks} />
        </article>
      </div>
    </main>
  );
}
