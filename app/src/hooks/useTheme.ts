import { useState, useEffect, useCallback } from 'react';
import { useSiteConfig } from '@/hooks/useClientConfig';
import { type CreativeThemeId, isDarkOnlyTheme } from '@/themes/index';
import { loadThemeFonts } from '@/hooks/useAccessibility';

export type Theme = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getStoredTheme(themeKey: string): Theme {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(themeKey);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

function getStoredCreativeTheme(creativeKey: string): CreativeThemeId | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(creativeKey);
  if (
    stored === 'retro-terminal' ||
    stored === 'synthwave' ||
    stored === 'minimal-ink'
  ) {
    return stored;
  }
  return null;
}

function applyThemeClass(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  const root = document.documentElement;

  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function applyCreativeThemeAttribute(themeId: CreativeThemeId | null) {
  const root = document.documentElement;
  if (themeId) {
    root.setAttribute('data-theme', themeId);
  } else {
    root.removeAttribute('data-theme');
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

export function useTheme() {
  const { localStoragePrefix } = useSiteConfig();
  const THEME_KEY = `${localStoragePrefix}-theme`;
  const CREATIVE_THEME_KEY = `${localStoragePrefix}-creative-theme`;
  const THEME_BEFORE_LOCK_KEY = `${localStoragePrefix}-theme-before-lock`;

  const [theme, setThemeState] = useState<Theme>(() =>
    getStoredTheme(THEME_KEY),
  );
  const [creativeTheme, setCreativeThemeState] =
    useState<CreativeThemeId | null>(() =>
      getStoredCreativeTheme(CREATIVE_THEME_KEY),
    );
  const [isDarkLocked, setIsDarkLocked] = useState<boolean>(() =>
    isDarkOnlyTheme(getStoredCreativeTheme(CREATIVE_THEME_KEY)),
  );

  const setTheme = useCallback(
    (newTheme: Theme) => {
      // If dark is locked, don't allow light/dark/system changes
      if (isDarkLocked) return;

      applyWithTransition(() => {
        setThemeState(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
        applyThemeClass(newTheme);
      });
    },
    [isDarkLocked, THEME_KEY],
  );

  const setCreativeTheme = useCallback(
    (newCreativeTheme: CreativeThemeId | null) => {
      applyWithTransition(() => {
        const previousCreativeTheme =
          getStoredCreativeTheme(CREATIVE_THEME_KEY);
        const wasDarkLocked = isDarkOnlyTheme(previousCreativeTheme);
        const willBeDarkLocked = isDarkOnlyTheme(newCreativeTheme);

        // Handle dark-only lock transitions
        if (!wasDarkLocked && willBeDarkLocked) {
          // Entering dark-only: save current preference and force dark
          const currentTheme = getStoredTheme(THEME_KEY);
          localStorage.setItem(THEME_BEFORE_LOCK_KEY, currentTheme);
          localStorage.setItem(THEME_KEY, 'dark');
          setThemeState('dark');
          applyThemeClass('dark');
          setIsDarkLocked(true);
        } else if (wasDarkLocked && !willBeDarkLocked) {
          // Leaving dark-only: restore previous preference
          const savedTheme = localStorage.getItem(THEME_BEFORE_LOCK_KEY);
          localStorage.removeItem(THEME_BEFORE_LOCK_KEY);
          const restoredTheme: Theme =
            savedTheme === 'light' ||
            savedTheme === 'dark' ||
            savedTheme === 'system'
              ? savedTheme
              : 'system';
          localStorage.setItem(THEME_KEY, restoredTheme);
          setThemeState(restoredTheme);
          applyThemeClass(restoredTheme);
          setIsDarkLocked(false);
        }

        // Apply creative theme attribute
        applyCreativeThemeAttribute(newCreativeTheme);

        // Persist creative theme
        if (newCreativeTheme) {
          localStorage.setItem(CREATIVE_THEME_KEY, newCreativeTheme);
          // Load fonts for the creative theme
          loadThemeFonts(newCreativeTheme);
        } else {
          localStorage.removeItem(CREATIVE_THEME_KEY);
        }

        setCreativeThemeState(newCreativeTheme);
      });
    },
    [THEME_KEY, CREATIVE_THEME_KEY, THEME_BEFORE_LOCK_KEY],
  );

  // Apply theme on mount (synchronous class application to avoid flicker)
  useEffect(() => {
    applyThemeClass(theme);
    applyCreativeThemeAttribute(creativeTheme);

    // If the creative theme is dark-only, enforce dark mode on mount
    if (isDarkOnlyTheme(creativeTheme)) {
      document.documentElement.classList.add('dark');
      setIsDarkLocked(true);
    }

    // Load fonts for the active creative theme on mount
    if (creativeTheme) {
      loadThemeFonts(creativeTheme);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for system preference changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return;
    if (isDarkLocked) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyThemeClass('system');

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme, isDarkLocked]);

  const resolvedTheme: 'light' | 'dark' = isDarkLocked
    ? 'dark'
    : theme === 'system'
      ? getSystemTheme()
      : theme;

  return {
    theme,
    setTheme,
    resolvedTheme,
    creativeTheme,
    setCreativeTheme,
    isDarkLocked,
  };
}
