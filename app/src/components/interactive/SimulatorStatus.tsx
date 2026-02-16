import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  type DegradationStage,
  formatTokens,
} from '@/content/shared/context-simulator-data';

interface SimulatorStatusProps {
  turnCount: number;
  conversationTokens: number;
  availableForConversation: number;
  usagePercentage: number;
  degradationStage: DegradationStage;
  isDev: boolean;
  estimatedTurnsRemaining: number;
}

export function SimulatorStatus({
  turnCount,
  conversationTokens,
  availableForConversation,
  usagePercentage,
  degradationStage,
  isDev,
  estimatedTurnsRemaining,
}: SimulatorStatusProps) {
  const remaining = Math.max(0, availableForConversation - conversationTokens);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      {/* Left side: turn count and tokens */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="tabular-nums text-muted-foreground">
          <span className="hidden sm:inline">
            Turn {turnCount} of ~{estimatedTurnsRemaining + turnCount} before
            compaction
          </span>
          <span className="sm:hidden">Turn {turnCount}</span>
        </span>

        {isDev && (
          <span className="hidden tabular-nums text-muted-foreground sm:inline">
            {formatTokens(conversationTokens)} /{' '}
            {formatTokens(availableForConversation)} conversation tokens used (
            {Math.round(usagePercentage)}%)
          </span>
        )}
      </div>

      {/* Right side: degradation badge and remaining */}
      <div
        className="flex items-center gap-2"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="text-xs tabular-nums text-muted-foreground">
          {formatTokens(remaining)} remaining
        </span>
        <Badge
          className={cn('text-xs font-medium', degradationStage.badgeClass)}
        >
          {degradationStage.label}
        </Badge>
      </div>
    </div>
  );
}
