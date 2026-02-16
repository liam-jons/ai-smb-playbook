export type CreativeThemeId = 'retro-terminal' | 'synthwave' | 'minimal-ink';
export type A11yModeId = 'dyslexia' | 'high-contrast' | 'large-text';
export type A11yFontId = 'atkinson' | 'opendyslexic';

export interface ThemeDefinition {
  id: CreativeThemeId;
  label: string;
  description: string;
  /** Whether the theme supports light mode, dark mode, or both */
  modeSupport: 'dark-only' | 'light-dark';
  /** Swatch colours for the theme gallery (background, primary, accent) */
  swatches: [string, string, string];
  /** Shiki syntax theme mapping */
  shikiTheme: { light: string; dark: string };
}

export interface A11yModeDefinition {
  id: A11yModeId;
  label: string;
  description: string;
}

export const creativeThemes: ThemeDefinition[] = [
  {
    id: 'retro-terminal',
    label: 'Retro Terminal',
    description: '1980s CRT terminal with phosphor green text and scanlines',
    modeSupport: 'dark-only',
    swatches: [
      'oklch(0.07 0 0)',
      'oklch(0.7 0.25 145)',
      'oklch(0.15 0.08 140)',
    ],
    shikiTheme: { light: 'vitesse-dark', dark: 'vitesse-dark' },
  },
  {
    id: 'synthwave',
    label: 'Synthwave',
    description: 'Neon pink and cyan on deep purple with glow effects',
    modeSupport: 'dark-only',
    swatches: [
      'oklch(0.15 0.05 300)',
      'oklch(0.6 0.25 350)',
      'oklch(0.65 0.2 195)',
    ],
    shikiTheme: { light: 'dracula-soft', dark: 'dracula-soft' },
  },
  {
    id: 'minimal-ink',
    label: 'Minimal Ink',
    description: 'Monochrome with a warm red accent, ink-on-paper aesthetic',
    modeSupport: 'light-dark',
    swatches: ['oklch(1.0 0 0)', 'oklch(0.45 0.18 25)', 'oklch(0.85 0 0)'],
    shikiTheme: { light: 'min-light', dark: 'min-dark' },
  },
];

export const a11yModes: A11yModeDefinition[] = [
  {
    id: 'dyslexia',
    label: 'Dyslexia-friendly',
    description:
      'Enhanced spacing, Atkinson Hyperlegible font, warm background',
  },
  {
    id: 'high-contrast',
    label: 'High contrast',
    description: 'Maximum contrast ratios (7:1+), stronger borders',
  },
  {
    id: 'large-text',
    label: 'Large text',
    description: 'Scale all text to 125% for easier reading',
  },
];

export const shikiThemeMap: Record<string, { light: string; dark: string }> = {
  default: { light: 'github-light', dark: 'github-dark' },
  'retro-terminal': { light: 'vitesse-dark', dark: 'vitesse-dark' },
  synthwave: { light: 'dracula-soft', dark: 'dracula-soft' },
  'minimal-ink': { light: 'min-light', dark: 'min-dark' },
};

export function getShikiTheme(
  resolvedTheme: 'light' | 'dark',
  creativeTheme: CreativeThemeId | null,
): string {
  if (creativeTheme && shikiThemeMap[creativeTheme]) {
    const entry = shikiThemeMap[creativeTheme];
    return resolvedTheme === 'dark' ? entry.dark : entry.light;
  }
  return resolvedTheme === 'dark' ? 'github-dark' : 'github-light';
}

/** Check if a creative theme forces dark mode */
export function isDarkOnlyTheme(themeId: CreativeThemeId | null): boolean {
  if (!themeId) return false;
  const theme = creativeThemes.find((t) => t.id === themeId);
  return theme?.modeSupport === 'dark-only';
}
