/**
 * kenikool-ui/themes entry point.
 *
 * Exports theme utilities for vanilla and React consumers.
 *
 * Usage (vanilla):
 *   import { applyTheme, getInitialTheme, getCurrentTheme } from 'kenikool-ui/themes';
 *
 * Usage (React):
 *   import { useTheme } from 'kenikool-ui/themes';
 */

export { applyTheme, getInitialTheme, getCurrentTheme } from '../themes/themeCore.js';
// export { useTheme } from './useTheme.js';   // uncomment when React ThemeSwitcher is ready

export type { Theme } from '../core/types.js';
