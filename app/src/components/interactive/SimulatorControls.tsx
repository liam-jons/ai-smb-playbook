import { useId, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus, RotateCcw, Shrink, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type PresetData,
  presets,
  conversationTurnTypes,
  formatTokens,
  TOKENS_PER_CLAUDE_MD_LINE,
  TOKENS_PER_MCP_SERVER,
  TOKENS_PER_SKILL,
  MCP_TOOL_SEARCH_CAP,
} from '@/content/shared/context-simulator-data';

interface SimulatorControlsProps {
  mcpServers: number;
  claudeMdLines: number;
  skillCount: number;
  toolSearchEnabled: boolean;
  activePreset: PresetData['id'] | null;
  isDev: boolean;
  usagePercentage: number;
  onMcpServersChange: (value: number) => void;
  onClaudeMdLinesChange: (value: number) => void;
  onSkillCountChange: (value: number) => void;
  onToolSearchChange: (value: boolean) => void;
  onPresetSelect: (id: PresetData['id']) => void;
  onAddTurn: (typeId?: string) => void;
  onReset: () => void;
  onCompact: () => void;
}

export function SimulatorControls({
  mcpServers,
  claudeMdLines,
  skillCount,
  toolSearchEnabled,
  activePreset,
  isDev,
  usagePercentage,
  onMcpServersChange,
  onClaudeMdLinesChange,
  onSkillCountChange,
  onToolSearchChange,
  onPresetSelect,
  onAddTurn,
  onReset,
  onCompact,
}: SimulatorControlsProps) {
  const sliderId = useId();

  const mcpTokens = toolSearchEnabled
    ? Math.min(mcpServers * TOKENS_PER_MCP_SERVER, MCP_TOOL_SEARCH_CAP)
    : mcpServers * TOKENS_PER_MCP_SERVER;

  const handleAddTurn = useCallback(() => {
    onAddTurn();
  }, [onAddTurn]);

  const showCompactButton = isDev && usagePercentage >= 85;

  return (
    <div className="space-y-4">
      {/* Preset buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Preset:
        </span>
        {presets.map((p) => (
          <Button
            key={p.id}
            variant={activePreset === p.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPresetSelect(p.id)}
            className="min-h-[44px] px-3 text-xs sm:min-h-0 sm:text-sm"
          >
            {p.label}
            <span className="ml-1 hidden text-xs opacity-70 sm:inline">
              ({p.description})
            </span>
          </Button>
        ))}
      </div>

      {/* Sliders — collapsible on mobile */}
      <Collapsible defaultOpen className="sm:hidden">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex w-full items-center justify-between gap-2 text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <Settings2 className="h-4 w-4" />
              Adjust settings
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3 pt-2">
            <SliderControls
              sliderId={sliderId}
              mcpServers={mcpServers}
              claudeMdLines={claudeMdLines}
              skillCount={skillCount}
              toolSearchEnabled={toolSearchEnabled}
              mcpTokens={mcpTokens}
              isDev={isDev}
              onMcpServersChange={onMcpServersChange}
              onClaudeMdLinesChange={onClaudeMdLinesChange}
              onSkillCountChange={onSkillCountChange}
              onToolSearchChange={onToolSearchChange}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Sliders — always visible on desktop */}
      <div className="hidden space-y-3 sm:block">
        <SliderControls
          sliderId={sliderId}
          mcpServers={mcpServers}
          claudeMdLines={claudeMdLines}
          skillCount={skillCount}
          toolSearchEnabled={toolSearchEnabled}
          mcpTokens={mcpTokens}
          isDev={isDev}
          onMcpServersChange={onMcpServersChange}
          onClaudeMdLinesChange={onClaudeMdLinesChange}
          onSkillCountChange={onSkillCountChange}
          onToolSearchChange={onToolSearchChange}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {isDev ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="min-h-[44px] gap-1.5 sm:min-h-0">
                <Plus className="h-4 w-4" />
                Add a conversation turn
                <ChevronDown className="h-3 w-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {conversationTurnTypes.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => onAddTurn(t.id)}
                  className="min-h-[44px] sm:min-h-0"
                >
                  <div>
                    <p className="font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.description}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            size="sm"
            onClick={handleAddTurn}
            className="min-h-[44px] gap-1.5 sm:min-h-0"
          >
            <Plus className="h-4 w-4" />
            Add a conversation turn
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="min-h-[44px] gap-1.5 text-muted-foreground sm:min-h-0"
          aria-label="Reset simulator"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

        {showCompactButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCompact}
            className="min-h-[44px] gap-1.5 sm:min-h-0"
          >
            <Shrink className="h-4 w-4" />
            Trigger compaction
          </Button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Internal slider controls (shared by both layouts)
// ─────────────────────────────────────────────

interface SliderControlsProps {
  sliderId: string;
  mcpServers: number;
  claudeMdLines: number;
  skillCount: number;
  toolSearchEnabled: boolean;
  mcpTokens: number;
  isDev: boolean;
  onMcpServersChange: (value: number) => void;
  onClaudeMdLinesChange: (value: number) => void;
  onSkillCountChange: (value: number) => void;
  onToolSearchChange: (value: boolean) => void;
}

function SliderControls({
  sliderId,
  mcpServers,
  claudeMdLines,
  skillCount,
  toolSearchEnabled,
  mcpTokens,
  isDev,
  onMcpServersChange,
  onClaudeMdLinesChange,
  onSkillCountChange,
  onToolSearchChange,
}: SliderControlsProps) {
  return (
    <>
      <RangeSlider
        id={`${sliderId}-mcp`}
        label={isDev ? 'MCP Servers' : 'Connected extensions'}
        value={mcpServers}
        min={0}
        max={10}
        step={1}
        tokenDisplay={`~${formatTokens(mcpTokens)} tokens`}
        ariaValueText={`${mcpServers} ${isDev ? 'MCP servers' : 'extensions'}, approximately ${formatTokens(mcpTokens)} tokens`}
        onChange={onMcpServersChange}
      />
      <RangeSlider
        id={`${sliderId}-cmd`}
        label={
          isDev ? 'CLAUDE.md size (lines)' : 'Project instructions (lines)'
        }
        value={claudeMdLines}
        min={0}
        max={1000}
        step={50}
        tokenDisplay={`~${formatTokens(claudeMdLines * TOKENS_PER_CLAUDE_MD_LINE)} tokens`}
        ariaValueText={`${claudeMdLines} lines, approximately ${formatTokens(claudeMdLines * TOKENS_PER_CLAUDE_MD_LINE)} tokens`}
        onChange={onClaudeMdLinesChange}
      />
      {isDev && (
        <>
          <RangeSlider
            id={`${sliderId}-skills`}
            label="Number of skills"
            value={skillCount}
            min={0}
            max={20}
            step={1}
            tokenDisplay={`~${formatTokens(skillCount * TOKENS_PER_SKILL)} tokens`}
            ariaValueText={`${skillCount} skills, approximately ${formatTokens(skillCount * TOKENS_PER_SKILL)} tokens`}
            onChange={onSkillCountChange}
          />
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor={`${sliderId}-toolsearch`}
              className="text-sm font-medium"
            >
              Tool Search enabled
            </label>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  'text-xs transition-colors',
                  toolSearchEnabled
                    ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'border-red-500/30 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
                )}
              >
                {toolSearchEnabled ? 'On' : 'Off'}
              </Badge>
              <button
                id={`${sliderId}-toolsearch`}
                type="button"
                role="switch"
                aria-checked={toolSearchEnabled}
                onClick={() => onToolSearchChange(!toolSearchEnabled)}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  toolSearchEnabled ? 'bg-primary' : 'bg-muted',
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-sm ring-0 transition-transform',
                    toolSearchEnabled ? 'translate-x-5' : 'translate-x-0',
                  )}
                />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// Range slider component
// ─────────────────────────────────────────────

interface RangeSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  tokenDisplay: string;
  ariaValueText: string;
  onChange: (value: number) => void;
}

function RangeSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  tokenDisplay,
  ariaValueText,
  onChange,
}: RangeSliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <span className="text-xs tabular-nums text-muted-foreground">
          {value} ({tokenDisplay})
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={ariaValueText}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
      />
    </div>
  );
}
