/**
 * useTheme hook for React — part of the `kenikool-ui/themes` entry.
 *
 * Provides programmatic theme control from any React component.
 *
 * @returns {{ theme: Theme, setTheme: (t: Theme) => void }}
 *
 * Features:
 * - Reads current theme from data-theme on <html>
 * - Setting a theme validates it, applies it to DOM, and persists it
 * - Cross-tab sync via the `storage` event listener
 */

import { useState, useEffect, useCallback } from 'react';
import { applyTheme, getInitialTheme } from './themeCore.js';
import type { Theme } from '../core/types.js';

/** Storage key used to persist the active theme. */
const STORAGE_KEY = 'kenikool-theme';

export function useTheme(): { theme: Theme; setTheme: (t: Theme) => void } {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    // Apply theme on mount (handles FOUT prevention when called before first paint)
    applyTheme(theme);

    // Sync across tabs — if another tab changes the theme, update local state
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const next = e.newValue as Theme;
        if (next === 'light' || next === 'dark' || next === 'dracula') {
          setThemeState(next);
          applyTheme(next);
        }
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
  }, []);

  return { theme, setTheme };
}
