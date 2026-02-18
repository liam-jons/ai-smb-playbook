import { useState, useEffect, useCallback } from 'react';
import { useSiteConfig } from '@/hooks/useClientConfig';
import type { A11yModeId, A11yFontId } from '@/themes/index';

function getStoredA11yMode(modeKey: string): A11yModeId | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(modeKey);
  if (
    stored === 'dyslexia' ||
    stored === 'high-contrast' ||
    stored === 'large-text'
  ) {
    return stored;
  }
  return null;
}

/**
 * Determine the initial a11y mode, accounting for prefers-contrast auto-detection.
 * Called synchronously in the useState initialiser to avoid flicker.
 */
function getInitialA11yMode(modeKey: string): A11yModeId | null {
  const stored = getStoredA11yMode(modeKey);
  if (stored) return stored;

  // Auto-detect high contrast preference if no stored override
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-contrast: more)').matches
  ) {
    return 'high-contrast';
  }

  return null;
}

function getStoredA11yFont(fontKey: string): A11yFontId | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(fontKey);
  if (stored === 'atkinson' || stored === 'opendyslexic') {
    return stored;
  }
  return null;
}

function applyA11yModeAttribute(mode: A11yModeId | null) {
  const root = document.documentElement;
  if (mode) {
    root.setAttribute('data-a11y-mode', mode);
  } else {
    root.removeAttribute('data-a11y-mode');
  }
}

function applyA11yFontAttribute(font: A11yFontId | null) {
  const root = document.documentElement;
  if (font) {
    root.setAttribute('data-a11y-font', font);
  } else {
    root.removeAttribute('data-a11y-font');
  }
}

function applyWithTransition(callback: () => void) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    callback();
    return;
  }
  if (!document.startViewTransition) {
    callback();
    return;
  }
  document.startViewTransition(() => {
    callback();
  });
}

async function loadA11yFonts(font?: A11yFontId | null) {
  if (font === 'opendyslexic') {
    await import('@fontsource/opendyslexic/400.css');
    await import('@fontsource/opendyslexic/700.css');
  } else {
    await import('@fontsource/atkinson-hyperlegible-next/400.css');
    await import('@fontsource/atkinson-hyperlegible-next/500.css');
    await import('@fontsource/atkinson-hyperlegible-next/700.css');
  }
}

export async function loadThemeFonts(themeId: string) {
  switch (themeId) {
    case 'retro-terminal':
      await import('@fontsource/vt323/400.css');
      await import('@fontsource/jetbrains-mono/400.css');
      await import('@fontsource/jetbrains-mono/700.css');
      break;
    case 'synthwave':
      await import('@fontsource/space-grotesk/400.css');
      await import('@fontsource/space-grotesk/700.css');
      break;
    case 'minimal-ink':
      await import('@fontsource-variable/fraunces/index.css');
      await import('@fontsource-variable/inter/index.css');
      break;
  }
}

export function useAccessibility() {
  const { localStoragePrefix } = useSiteConfig();
  const A11Y_MODE_KEY = `${localStoragePrefix}-a11y-mode`;
  const A11Y_FONT_KEY = `${localStoragePrefix}-a11y-font`;

  const [a11yMode, setA11yModeState] = useState<A11yModeId | null>(() =>
    getInitialA11yMode(A11Y_MODE_KEY),
  );
  const [a11yFont, setA11yFontState] = useState<A11yFontId | null>(() =>
    getStoredA11yFont(A11Y_FONT_KEY),
  );

  const setA11yMode = useCallback(
    (mode: A11yModeId | null) => {
      applyWithTransition(() => {
        applyA11yModeAttribute(mode);

        if (mode) {
          localStorage.setItem(A11Y_MODE_KEY, mode);
        } else {
          localStorage.removeItem(A11Y_MODE_KEY);
        }

        // When clearing mode, also clear font
        if (!mode) {
          applyA11yFontAttribute(null);
          localStorage.removeItem(A11Y_FONT_KEY);
          setA11yFontState(null);
        }

        // When setting dyslexia mode, load fonts
        if (mode === 'dyslexia') {
          loadA11yFonts(a11yFont);
        }

        setA11yModeState(mode);
      });
    },
    [a11yFont, A11Y_MODE_KEY, A11Y_FONT_KEY],
  );

  const setA11yFont = useCallback(
    (font: A11yFontId | null) => {
      applyWithTransition(() => {
        applyA11yFontAttribute(font);

        if (font) {
          localStorage.setItem(A11Y_FONT_KEY, font);
        } else {
          localStorage.removeItem(A11Y_FONT_KEY);
        }

        // Load the selected font
        loadA11yFonts(font);

        setA11yFontState(font);
      });
    },
    [A11Y_FONT_KEY],
  );

  // Apply persisted/initial values on mount (attributes + font loading)
  useEffect(() => {
    const initialMode = getInitialA11yMode(A11Y_MODE_KEY);
    const initialFont = getStoredA11yFont(A11Y_FONT_KEY);

    applyA11yModeAttribute(initialMode);
    applyA11yFontAttribute(initialFont);

    // Load fonts if dyslexia mode is active
    if (initialMode === 'dyslexia') {
      loadA11yFonts(initialFont);
    }
  }, [A11Y_MODE_KEY, A11Y_FONT_KEY]);

  // prefers-contrast: listen for dynamic changes after mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: more)');

    const handler = (e: MediaQueryListEvent) => {
      // Only auto-set if user hasn't stored an explicit preference
      if (e.matches && localStorage.getItem(A11Y_MODE_KEY) === null) {
        applyA11yModeAttribute('high-contrast');
        setA11yModeState('high-contrast');
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [A11Y_MODE_KEY]);

  return {
    a11yMode,
    setA11yMode,
    a11yFont,
    setA11yFont,
  };
}
