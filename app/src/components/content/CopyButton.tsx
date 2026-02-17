import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  ariaLabel?: string;
}

export function CopyButton({ text, className, ariaLabel }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  const defaultLabel = 'Copy to clipboard';
  const label = ariaLabel ?? defaultLabel;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'h-8 w-8 min-h-[44px] min-w-[44px] shrink-0 text-muted-foreground hover:text-foreground',
        className,
      )}
      onClick={() => copy(text)}
      aria-label={copied ? 'Copied to clipboard' : label}
    >
      {copied ? (
        <Check className="h-4 w-4 text-success" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
