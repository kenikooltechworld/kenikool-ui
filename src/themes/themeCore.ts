/**
 * themeCore — shared theme logic used by both React ThemeSwitcher and
 * the Vanilla KThemeSwitcherElement.
 *
 * Handles:
 * - Reading the initial theme (localStorage → OS preference → 'light')
 * - Applying a theme (sets data-theme attribute + persists to localStorage)
 * - Reading the currently active theme
 * - Whitelist validation (never allows arbitrary values on data-theme)
 */

import { THEMES, THEME_STORAGE_KEY } from '../core/constants.js';
import type { Theme }                 from '../core/types.js';

/**
 * Determines the initial theme to apply on page load.
 *
 * Priority order:
 * 1. Value stored in localStorage under 'kenikool-theme'
 * 2. OS dark mode preference (window.matchMedia prefers-color-scheme: dark)
 * 3. Default: 'light'
 *
 * @returns The Theme to apply on initialisation.
 */
export function getInitialTheme(): Theme {
  // 1. Check localStorage
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (stored && (THEMES as readonly string[]).includes(stored)) {
      return stored;
    }
  } catch {
    // localStorage may be unavailable in some environments (e.g. private browsing restrictions)
  }

  // 2. Check OS preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }

  // 3. Default
  return 'light';
}

/**
 * Applies a theme by:
 * 1. Validating against the whitelist — logs a warning and defaults to 'light' if invalid.
 * 2. Setting `data-theme` on document.documentElement (<html>).
 * 3. Persisting the selection to localStorage.
 *
 * @param theme - The theme to apply. Must be 'light', 'dark', or 'dracula'.
 */
export function applyTheme(theme: Theme): void {
  // Whitelist validation — never trust raw input on data-theme
  if (!(THEMES as readonly string[]).includes(theme)) {
    console.warn(
      `[kenikool-ui] Unknown theme "${String(theme)}". ` +
      `Valid values: ${THEMES.join(', ')}. Defaulting to "light".`
    );
    theme = 'light';
  }

  document.documentElement.setAttribute('data-theme', theme);

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable — silent fail, theme is still applied to DOM
  }
}

/**
 * Returns the currently active theme by reading the data-theme attribute
 * from document.documentElement.
 *
 * Falls back to 'light' if no valid theme attribute is set.
 *
 * @returns The currently active Theme.
 */
export function getCurrentTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme') as Theme | null;
  if (attr && (THEMES as readonly string[]).includes(attr)) {
    return attr;
  }
  return 'light';
}
