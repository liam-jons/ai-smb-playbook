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
    className: 'border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400',
  },
  tip: {
    icon: Lightbulb,
    className: 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400',
  },
  important: {
    icon: AlertCircle,
    className: 'border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 [&>svg]:text-purple-600 dark:[&>svg]:text-purple-400',
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
