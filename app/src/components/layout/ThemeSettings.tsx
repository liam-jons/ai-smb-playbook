import { Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme, type Theme } from '@/hooks/useTheme';
import { useAccessibility } from '@/hooks/useAccessibility';
import {
  creativeThemes,
  a11yModes,
  type CreativeThemeId,
  type A11yModeId,
  type A11yFontId,
} from '@/themes/index';
import { ThemePreview } from './ThemePreview';
import { cn } from '@/lib/utils';

/** Default theme swatches representing the standard light/dark palette */
const defaultSwatches: [string, string, string] = [
  'oklch(0.97 0 0)',
  'oklch(0.21 0.006 285.88)',
  'oklch(0.55 0 0)',
];

export function ThemeSettings() {
  const { theme, setTheme, creativeTheme, setCreativeTheme, isDarkLocked } =
    useTheme();
  const { a11yMode, setA11yMode, a11yFont, setA11yFont } = useAccessibility();

  const hasCustomisation = creativeTheme !== null || a11yMode !== null;

  const handleA11yToggle = (modeId: A11yModeId, checked: boolean) => {
    if (checked) {
      // Turning on a mode — this replaces any existing mode
      setA11yMode(modeId);
      // If turning on dyslexia, set a default font
      if (modeId === 'dyslexia' && !a11yFont) {
        setA11yFont('atkinson');
      }
    } else {
      // Turning off the active mode
      setA11yMode(null);
    }
  };

  const handleCreativeThemeSelect = (themeId: CreativeThemeId | null) => {
    setCreativeTheme(themeId);
  };

  const handleFontChange = (value: string) => {
    setA11yFont(value as A11yFontId);
  };

  const colourModeContent = (
    <RadioGroup
      value={theme}
      onValueChange={(value) => setTheme(value as Theme)}
      className="flex flex-wrap gap-4"
      disabled={isDarkLocked}
    >
      {(['light', 'dark', 'system'] as const).map((mode) => (
        <div key={mode} className="flex items-center gap-2">
          <RadioGroupItem value={mode} id={`colour-mode-${mode}`} />
          <Label
            htmlFor={`colour-mode-${mode}`}
            className="cursor-pointer capitalize"
          >
            {mode}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Appearance settings"
          className="relative"
        >
          <Palette className="h-5 w-5" />
          {hasCustomisation && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Appearance Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Colour Mode Section */}
          <section>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Colour Mode
            </h3>
            {isDarkLocked ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>{colourModeContent}</div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This theme is dark-only</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              colourModeContent
            )}
          </section>

          {/* Accessibility Section */}
          <section>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Accessibility
            </h3>
            <div className="space-y-4">
              {a11yModes.map((mode) => (
                <div key={mode.id}>
                  <div className="flex min-h-11 items-center justify-between gap-3">
                    <Label
                      htmlFor={`a11y-${mode.id}`}
                      className="cursor-pointer"
                    >
                      {mode.label}
                    </Label>
                    <Switch
                      id={`a11y-${mode.id}`}
                      checked={a11yMode === mode.id}
                      onCheckedChange={(checked) =>
                        handleA11yToggle(mode.id, checked)
                      }
                    />
                  </div>
                  {/* Font selector for dyslexia mode */}
                  {mode.id === 'dyslexia' && a11yMode === 'dyslexia' && (
                    <div className="mt-2 ml-1 flex items-center gap-2 pl-0">
                      <Label
                        htmlFor="a11y-font-select"
                        className="text-sm text-muted-foreground"
                      >
                        Font:
                      </Label>
                      <Select
                        value={a11yFont ?? 'atkinson'}
                        onValueChange={handleFontChange}
                      >
                        <SelectTrigger id="a11y-font-select" size="sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="atkinson">
                            Atkinson Hyperlegible
                          </SelectItem>
                          <SelectItem value="opendyslexic">
                            OpenDyslexic
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Creative Themes Section */}
          <section>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">
              Creative Themes
            </h3>
            <div className="space-y-2">
              {/* Default theme option */}
              <button
                type="button"
                onClick={() => handleCreativeThemeSelect(null)}
                className={cn(
                  'flex w-full min-h-11 items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent/50',
                  creativeTheme === null
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-border',
                )}
              >
                <ThemePreview swatches={defaultSwatches} />
                <div className="flex-1">
                  <span className="text-sm font-medium">Default</span>
                </div>
                {creativeTheme === null && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>

              {/* Creative theme options */}
              {creativeThemes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleCreativeThemeSelect(t.id)}
                  className={cn(
                    'flex w-full min-h-11 items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent/50',
                    creativeTheme === t.id
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border',
                  )}
                >
                  <ThemePreview swatches={t.swatches} />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{t.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {t.modeSupport === 'dark-only'
                        ? 'Dark only'
                        : 'Light + Dark'}
                    </span>
                  </div>
                  {creativeTheme === t.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Meta-narrative note — only shown when a creative theme is active */}
          {creativeTheme !== null && (
            <p className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              These themes were designed collaboratively with Claude — the same
              AI covered in this playbook.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
