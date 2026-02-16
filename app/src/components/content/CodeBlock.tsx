import { Suspense, lazy } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from './CopyButton';
import { useTheme } from '@/hooks/useTheme';
import { getShikiTheme } from '@/themes';

const ShikiHighlighter = lazy(() =>
  import('./ShikiHighlighter').then((mod) => ({
    default: mod.ShikiHighlighter,
  })),
);

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

function CodeFallback({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}

export function CodeBlock({
  code,
  language = 'text',
  title,
  showLineNumbers = false,
}: CodeBlockProps) {
  const { resolvedTheme, creativeTheme } = useTheme();

  return (
    <Card className="group relative overflow-hidden border-border bg-muted/40">
      {/* Header bar */}
      {(title || language !== 'text') && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <div className="flex items-center gap-2">
            {language && language !== 'text' && (
              <Badge variant="outline" className="text-xs font-normal">
                {language}
              </Badge>
            )}
            {title && (
              <span className="text-xs text-muted-foreground">{title}</span>
            )}
          </div>
          <CopyButton text={code} />
        </div>
      )}

      {/* Code content */}
      <div className="relative">
        {!title && language === 'text' && (
          <CopyButton
            text={code}
            className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100"
          />
        )}
        <Suspense fallback={<CodeFallback code={code} />}>
          <ShikiHighlighter
            code={code}
            language={language}
            theme={getShikiTheme(resolvedTheme, creativeTheme)}
            showLineNumbers={showLineNumbers}
          />
        </Suspense>
      </div>
    </Card>
  );
}
