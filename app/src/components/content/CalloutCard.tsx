import { Info, AlertTriangle, Lightbulb, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type CalloutVariant = 'info' | 'warning' | 'tip' | 'important';

interface CalloutCardProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

const variantConfig: Record<
  CalloutVariant,
  {
    icon: typeof Info;
    className: string;
  }
> = {
  info: {
    icon: Info,
    className: 'border-info/30 bg-info-muted/50 [&>svg]:text-info',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-warning/30 bg-warning-muted/50 [&>svg]:text-warning',
  },
  tip: {
    icon: Lightbulb,
    className: 'border-success/30 bg-success-muted/50 [&>svg]:text-success',
  },
  important: {
    icon: AlertCircle,
    className:
      'border-important/30 bg-important-muted/50 [&>svg]:text-important',
  },
};

export function CalloutCard({
  variant = 'info',
  title,
  children,
  className,
}: CalloutCardProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Alert className={cn(config.className, className)}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
