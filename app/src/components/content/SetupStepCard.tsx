import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/content/CopyButton';
import { CodeBlock } from '@/components/content/CodeBlock';
import type { SetupStep } from '@/content/shared/brand-voice-data';

interface SetupStepCardProps {
  step: SetupStep;
  /** 'simple' renders CopyButton + pre; 'code' renders CodeBlock with syntax highlighting */
  variant?: 'simple' | 'code';
}

export function SetupStepCard({
  step,
  variant = 'simple',
}: SetupStepCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-border px-4 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {step.number}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {step.title}
          </span>
          <Badge variant="outline" className="text-xs">
            {step.time}
          </Badge>
        </div>
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted-foreground">
          {step.content}
        </p>
        {step.copyableText &&
          (variant === 'code' ? (
            <div className="mt-3">
              <CodeBlock
                code={step.copyableText}
                language={step.language ?? 'markdown'}
                title={step.copyableTitle}
              />
            </div>
          ) : (
            <div className="group relative mt-3 rounded-md border border-border bg-muted/40 p-3">
              <CopyButton
                text={step.copyableText}
                className="absolute right-2 top-2 opacity-60 transition-opacity sm:group-hover:opacity-100 group-focus-within:opacity-100"
              />
              <pre className="whitespace-pre-wrap pr-10 text-sm leading-relaxed text-foreground">
                {step.copyableText}
              </pre>
            </div>
          ))}
      </div>
    </div>
  );
}
