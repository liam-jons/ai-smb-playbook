import { useState, useCallback, useRef, useMemo } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  type PresetData,
  segments as segmentDefinitions,
  getPresets,
  calculateTokens,
  getDegradationStage,
  randomTurnTokens,
  turnTypeTokens,
  formatTokens,
  TOTAL_CONTEXT,
  RESPONSE_BUFFER_TOKENS,
} from '@/content/shared/context-simulator-data';
import { ContextWindowBar } from '@/components/interactive/ContextWindowBar';
import { SimulatorControls } from '@/components/interactive/SimulatorControls';
import { SimulatorStatus } from '@/components/interactive/SimulatorStatus';

interface ConversationTurn {
  id: string;
  tokens: number;
  label: string;
}

interface SimulatorState {
  mcpServers: number;
  claudeMdLines: number;
  skillCount: number;
  toolSearchEnabled: boolean;
  conversationTurns: ConversationTurn[];
  isCompacted: boolean;
  compactionCount: number;
  activePreset: PresetData['id'] | null;
}

const DEFAULT_STATE: SimulatorState = {
  mcpServers: 2,
  claudeMdLines: 200,
  skillCount: 3,
  toolSearchEnabled: true,
  conversationTurns: [],
  isCompacted: false,
  compactionCount: 0,
  activePreset: 'moderate',
};

interface ContextWindowSimulatorProps {
  isDev: boolean;
}

export function ContextWindowSimulator({ isDev }: ContextWindowSimulatorProps) {
  const presets = useMemo(() => getPresets(), []);
  const [state, setState] = useState<SimulatorState>(DEFAULT_STATE);
  const [isCompacting, setIsCompacting] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const nextTurnId = useRef(1);
  const compactionAnnouncerRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────────────
  // Derived calculations (computed during render)
  // ─────────────────────────────────────────────

  const tokenCalc = calculateTokens({
    mcpServers: state.mcpServers,
    claudeMdLines: state.claudeMdLines,
    skillCount: isDev ? state.skillCount : 3,
    toolSearchEnabled: isDev ? state.toolSearchEnabled : true,
  });

  const rawConversationTokens = state.conversationTurns.reduce(
    (sum, t) => sum + t.tokens,
    0,
  );
  const conversationTokens = state.isCompacted
    ? Math.round(rawConversationTokens * 0.5)
    : rawConversationTokens;

  const usableWindow = TOTAL_CONTEXT - RESPONSE_BUFFER_TOKENS;
  const usedForConversation = tokenCalc.fixedOverhead + conversationTokens;
  const usagePercentage = (usedForConversation / usableWindow) * 100;
  const availableSpace = Math.max(
    0,
    TOTAL_CONTEXT -
      tokenCalc.fixedOverhead -
      conversationTokens -
      RESPONSE_BUFFER_TOKENS,
  );

  const degradationStage = getDegradationStage(usagePercentage);

  // Estimate turns remaining at average 5,500 tokens/turn
  const avgTurnTokens = 5_500;
  const estimatedTurnsRemaining = Math.max(
    0,
    Math.floor(availableSpace / avgTurnTokens),
  );

  // Build segment rendering data
  const segmentRenders = segmentDefinitions.map((seg) => {
    let tokens = seg.defaultTokens;

    if (seg.id === 'claude-md') tokens = tokenCalc.claudeMd;
    else if (seg.id === 'mcp-tools') tokens = tokenCalc.mcp;
    else if (seg.id === 'skills') tokens = tokenCalc.skills;
    else if (seg.id === 'conversation') tokens = conversationTokens;
    else if (seg.id === 'response-buffer') tokens = RESPONSE_BUFFER_TOKENS;

    return {
      segment: seg,
      tokens,
      percentage: (tokens / TOTAL_CONTEXT) * 100,
    };
  });

  // ─────────────────────────────────────────────
  // Event handlers
  // ─────────────────────────────────────────────

  const handleSliderChange = useCallback(
    (field: 'mcpServers' | 'claudeMdLines' | 'skillCount', value: number) => {
      setState((prev) => ({
        ...prev,
        [field]: value,
        activePreset: null,
      }));
    },
    [],
  );

  const handleToolSearchChange = useCallback((value: boolean) => {
    setState((prev) => ({
      ...prev,
      toolSearchEnabled: value,
      activePreset: null,
    }));
  }, []);

  const handlePresetSelect = useCallback(
    (presetId: PresetData['id']) => {
      const preset = presets.find((p) => p.id === presetId);
      if (!preset) return;
      setState((prev) => ({
        ...prev,
        mcpServers: preset.mcpServers,
        claudeMdLines: preset.claudeMdLines,
        skillCount: preset.skillCount,
        toolSearchEnabled: preset.toolSearchEnabled,
        activePreset: presetId,
      }));
    },
    [presets],
  );

  const handleAddTurn = useCallback(
    (typeId?: string) => {
      const tokens = typeId ? turnTypeTokens(typeId) : randomTurnTokens();
      const turnNumber = nextTurnId.current;
      nextTurnId.current += 1;

      setState((prev) => {
        const newTurns = [
          ...prev.conversationTurns,
          {
            id: `turn-${turnNumber}`,
            tokens,
            label: `Turn ${turnNumber}`,
          },
        ];

        // Check if auto-compaction should trigger for general track
        const newRawTokens = newTurns.reduce((sum, t) => sum + t.tokens, 0);
        const newConvTokens = prev.isCompacted
          ? Math.round(newRawTokens * 0.5)
          : newRawTokens;
        const newUsed = tokenCalc.fixedOverhead + newConvTokens;
        const newUsage = (newUsed / usableWindow) * 100;

        if (!isDev && newUsage >= 90 && !prev.isCompacted) {
          // Auto-compact for general track
          return {
            ...prev,
            conversationTurns: newTurns,
            isCompacted: true,
            compactionCount: prev.compactionCount + 1,
          };
        }

        return { ...prev, conversationTurns: newTurns };
      });
    },
    [isDev, tokenCalc.fixedOverhead, usableWindow],
  );

  const handleCompact = useCallback(() => {
    if (isCompacting) return;

    if (shouldReduceMotion) {
      setState((prev) => ({
        ...prev,
        isCompacted: true,
        compactionCount: prev.compactionCount + 1,
      }));
      return;
    }

    setIsCompacting(true);
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isCompacted: true,
        compactionCount: prev.compactionCount + 1,
      }));
      setTimeout(() => {
        setIsCompacting(false);
      }, 200);
    }, 800);
  }, [isCompacting, shouldReduceMotion]);

  const handleReset = useCallback(() => {
    nextTurnId.current = 1;
    setState((prev) => ({
      ...DEFAULT_STATE,
      mcpServers: prev.mcpServers,
      claudeMdLines: prev.claudeMdLines,
      skillCount: prev.skillCount,
      toolSearchEnabled: prev.toolSearchEnabled,
      activePreset: prev.activePreset,
    }));
  }, []);

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <SimulatorStatus
        turnCount={state.conversationTurns.length}
        conversationTokens={conversationTokens}
        availableForConversation={tokenCalc.availableForConversation}
        usagePercentage={usagePercentage}
        degradationStage={degradationStage}
        isDev={isDev}
        estimatedTurnsRemaining={estimatedTurnsRemaining}
      />

      {/* Proportional bar */}
      <div className="relative">
        <ContextWindowBar
          segments={segmentRenders}
          availableSpace={availableSpace}
          conversationTokens={conversationTokens}
          isCompacted={state.isCompacted}
          degradationStageId={degradationStage.id}
          isDev={isDev}
        />

        {/* Compaction overlay animation */}
        <AnimatePresence>
          {isCompacting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-30 flex items-center justify-center rounded-lg bg-foreground/20 backdrop-blur-[2px]"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="rounded-md bg-background px-3 py-1.5 text-sm font-medium shadow-sm"
              >
                Compacting conversation...
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Compaction aria-live announcer */}
      <div
        ref={compactionAnnouncerRef}
        aria-live="assertive"
        className="sr-only"
      >
        {state.isCompacted &&
          'Conversation compacted. Approximately 50% of conversation tokens freed.'}
      </div>

      {/* Turn details (developer track) */}
      {isDev && state.conversationTurns.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {state.conversationTurns.slice(-5).map((turn) => (
            <span
              key={turn.id}
              className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs tabular-nums text-muted-foreground"
            >
              {turn.label}: ~{formatTokens(turn.tokens)} tokens
            </span>
          ))}
          {state.conversationTurns.length > 5 && (
            <span className="px-2 py-0.5 text-xs text-muted-foreground">
              +{state.conversationTurns.length - 5} earlier turns
            </span>
          )}
        </div>
      )}

      {/* Controls */}
      <SimulatorControls
        mcpServers={state.mcpServers}
        claudeMdLines={state.claudeMdLines}
        skillCount={state.skillCount}
        toolSearchEnabled={isDev ? state.toolSearchEnabled : true}
        activePreset={state.activePreset}
        presets={presets}
        isDev={isDev}
        usagePercentage={usagePercentage}
        onMcpServersChange={(v) => handleSliderChange('mcpServers', v)}
        onClaudeMdLinesChange={(v) => handleSliderChange('claudeMdLines', v)}
        onSkillCountChange={(v) => handleSliderChange('skillCount', v)}
        onToolSearchChange={handleToolSearchChange}
        onPresetSelect={handlePresetSelect}
        onAddTurn={handleAddTurn}
        onReset={handleReset}
        onCompact={handleCompact}
      />

      {/* Multi-compaction warning */}
      {state.compactionCount > 1 && (
        <p className="text-xs text-muted-foreground">
          This session has been compacted {state.compactionCount} times. Each
          compaction summarises everything before it. Information loss is
          cumulative — details that survived the first compaction may be lost in
          the second.
        </p>
      )}
    </div>
  );
}
