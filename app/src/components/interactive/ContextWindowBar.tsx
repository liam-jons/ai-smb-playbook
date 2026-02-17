import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  type ContextSegmentData,
  TOTAL_CONTEXT,
  formatTokens,
  getSegmentLabel,
} from '@/content/shared/context-simulator-data';

interface SegmentRender {
  segment: ContextSegmentData;
  tokens: number;
  percentage: number;
}

interface ContextWindowBarProps {
  segments: SegmentRender[];
  availableSpace: number;
  conversationTokens: number;
  isCompacted: boolean;
  degradationStageId: 'healthy' | 'early' | 'noticeable' | 'critical';
  isDev: boolean;
}

const DEGRADATION_OPACITY: Record<string, number> = {
  healthy: 0,
  early: 0.15,
  noticeable: 0.35,
  critical: 0.55,
};

const easeOut = [0.16, 1, 0.3, 1] as const;

export function ContextWindowBar({
  segments,
  availableSpace,
  conversationTokens,
  isCompacted,
  degradationStageId,
  isDev,
}: ContextWindowBarProps) {
  const shouldReduceMotion = useReducedMotion();
  const barId = useId();
  const overlayOpacity = DEGRADATION_OPACITY[degradationStageId] ?? 0;

  const availablePercentage = (availableSpace / TOTAL_CONTEXT) * 100;

  return (
    <TooltipProvider delayDuration={100}>
      {/* Horizontal bar — visible on sm+ */}
      <div
        className="relative hidden h-12 w-full overflow-hidden rounded-lg border border-border bg-muted/30 dark:border-border dark:bg-muted/60 sm:flex"
        role="img"
        aria-label={`Context window visualisation showing ${segments.length} segments totalling ${formatTokens(TOTAL_CONTEXT)} tokens`}
      >
        {segments.map((s) => {
          const minWidth = Math.max(s.percentage, 1);
          const showLabel = s.percentage > 5;
          const displayLabel = getSegmentLabel(s.segment, isDev);

          return (
            <Tooltip key={s.segment.id}>
              <TooltipTrigger asChild>
                <motion.div
                  layout={!shouldReduceMotion}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.3, ease: [...easeOut] }
                  }
                  className={cn(
                    'relative flex items-center justify-center overflow-hidden text-xs font-medium',
                    s.segment.colour,
                    s.segment.colourDark,
                    s.segment.isBuffer &&
                      'bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.06)_4px,rgba(0,0,0,0.06)_8px)] dark:bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.06)_4px,rgba(255,255,255,0.06)_8px)]',
                  )}
                  style={{ width: `${minWidth}%` }}
                  aria-label={`${displayLabel}: approximately ${formatTokens(s.tokens)} tokens, ${s.percentage.toFixed(1)}% of context window`}
                >
                  {/* Degradation overlay on conversation segment */}
                  {s.segment.isConversation &&
                    conversationTokens > 0 &&
                    overlayOpacity > 0 && (
                      <motion.div
                        className="pointer-events-none absolute inset-0 z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { duration: 0.5, ease: [0.65, 0, 0.35, 1] }
                        }
                        style={{
                          background: `linear-gradient(to right, transparent 0%, rgba(0,0,0,${overlayOpacity}) 25%, rgba(0,0,0,${overlayOpacity * 1.2}) 50%, rgba(0,0,0,${overlayOpacity}) 75%, transparent 100%)`,
                        }}
                      />
                    )}

                  {/* Compacted badge */}
                  {s.segment.isConversation && isCompacted && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.span
                          initial={
                            shouldReduceMotion
                              ? { opacity: 1, scale: 1 }
                              : { opacity: 0, scale: 0.8 }
                          }
                          animate={{ opacity: 1, scale: 1 }}
                          transition={
                            shouldReduceMotion
                              ? { duration: 0 }
                              : { duration: 0.3, ease: [...easeOut] }
                          }
                          className="relative z-20 rounded-sm bg-foreground/80 px-1.5 py-0.5 text-[10px] font-semibold text-background"
                        >
                          Compacted
                        </motion.span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-64">
                        <p className="text-xs">
                          Claude has summarised your conversation history. Key
                          decisions and progress are preserved, but specific
                          details and nuance from earlier exchanges may be lost.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {/* Segment label */}
                  {showLabel && !isCompacted && (
                    <span className="relative z-20 truncate px-1 text-[10px] text-white drop-shadow-sm">
                      {displayLabel}
                    </span>
                  )}
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-72">
                <div className="space-y-1">
                  <p className="font-semibold">{displayLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    ~{formatTokens(s.tokens)} tokens ({s.percentage.toFixed(1)}
                    %)
                  </p>
                  <p className="text-xs">
                    {isDev
                      ? s.segment.detailedDescription
                      : s.segment.description}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* Available space */}
        {availablePercentage > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                layout={!shouldReduceMotion}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.3, ease: [...easeOut] }
                }
                className="flex items-center justify-center bg-muted/20 dark:bg-muted/40"
                style={{
                  width: `${Math.max(availablePercentage, 0.5)}%`,
                }}
                aria-label={`Available space: approximately ${formatTokens(availableSpace)} tokens, ${availablePercentage.toFixed(1)}% of context window`}
              >
                {availablePercentage > 8 && (
                  <span className="truncate px-1 text-[10px] text-muted-foreground">
                    Available
                  </span>
                )}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-64">
              <div className="space-y-1">
                <p className="font-semibold">Available Space</p>
                <p className="text-xs text-muted-foreground">
                  ~{formatTokens(availableSpace)} tokens (
                  {availablePercentage.toFixed(1)}%)
                </p>
                <p className="text-xs">
                  Room remaining for conversation before compaction triggers.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Mobile vertical stack — visible below sm */}
      <div
        className="space-y-1 sm:hidden"
        role="img"
        aria-label={`Context window visualisation showing ${segments.length} segments totalling ${formatTokens(TOTAL_CONTEXT)} tokens`}
      >
        {segments
          .filter((s) => s.tokens > 0)
          .map((s) => {
            const displayLabel = getSegmentLabel(s.segment, isDev);
            return (
              <div key={s.segment.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    'h-5 rounded',
                    s.segment.colour,
                    s.segment.colourDark,
                    s.segment.isBuffer &&
                      'bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(0,0,0,0.06)_3px,rgba(0,0,0,0.06)_6px)]',
                  )}
                  style={{
                    width: `${Math.max(s.percentage, 3)}%`,
                    minWidth: '12px',
                  }}
                />
                <span className="shrink-0 text-xs text-muted-foreground">
                  {displayLabel}{' '}
                  <span className="tabular-nums">
                    ({s.percentage.toFixed(0)}%)
                  </span>
                </span>
              </div>
            );
          })}
        {availablePercentage > 0 && (
          <div className="flex items-center gap-2">
            <div
              className="h-5 rounded bg-muted/30 dark:bg-muted/50"
              style={{
                width: `${Math.max(availablePercentage, 3)}%`,
                minWidth: '12px',
              }}
            />
            <span className="shrink-0 text-xs text-muted-foreground">
              Available{' '}
              <span className="tabular-nums">
                ({availablePercentage.toFixed(0)}%)
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Segment legend — only on sm+ (mobile uses inline labels above) */}
      <div
        className="mt-3 hidden grid-cols-2 gap-x-4 gap-y-1.5 sm:grid sm:grid-cols-3"
        aria-label="Segment colour legend"
        id={`${barId}-legend`}
      >
        {segments.map((s) => (
          <div key={s.segment.id} className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-block h-2.5 w-2.5 shrink-0 rounded-sm',
                s.segment.colour,
                s.segment.colourDark,
                s.segment.isBuffer &&
                  'bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]',
              )}
            />
            <span className="text-xs text-muted-foreground">
              {getSegmentLabel(s.segment, isDev)}
            </span>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
