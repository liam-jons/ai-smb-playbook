import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from './CopyButton';
import { cn } from '@/lib/utils';

interface PromptExampleProps {
  title: string;
  description?: string;
  prompt: string;
  context?: string;
  whenToUse?: string;
  className?: string;
}

export function PromptExample({
  title,
  description,
  prompt,
  context,
  whenToUse,
  className,
}: PromptExampleProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            Prompt
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* The prompt */}
        <div className="group relative rounded-md border border-border bg-muted/50 p-4">
          <CopyButton
            text={prompt}
            className="absolute right-2 top-2 sm:opacity-0 transition-opacity sm:group-hover:opacity-100 group-focus-within:opacity-100"
          />
          <pre className="whitespace-pre-wrap pr-10 text-sm leading-relaxed text-foreground">
            {prompt}
          </pre>
        </div>

        {/* Context note */}
        {context && (
          <div className="rounded-md bg-accent/50 px-3 py-2 text-xs text-muted-foreground">
            <span className="font-medium">Context:</span> {context}
          </div>
        )}

        {/* When to use note */}
        {whenToUse && (
          <div className="rounded-md bg-accent/50 px-3 py-2 text-xs text-muted-foreground">
            <span className="font-medium">When to use:</span> {whenToUse}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
