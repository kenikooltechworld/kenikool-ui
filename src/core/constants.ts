/**
 * Shared constants used by the v-attribute parser and component validation.
 * Using Set/Map for O(1) token lookup during parsing.
 */

import type { Theme, Size, Color, Radius } from './types.js';

/** All valid theme values. Used for whitelist validation. */
export const THEMES: readonly Theme[] = ['light', 'dark', 'dracula'] as const;

/** All valid size tokens recognised in the v attribute. */
export const SIZES = new Set<Size>(['xs', 'sm', 'md', 'lg', 'xl']);

/** All valid color tokens recognised in the v attribute. */
export const COLORS = new Set<Color>(['primary', 'success', 'warning', 'error', 'info', 'default']);

/**
 * All valid radius shorthand tokens recognised in the v attribute.
 * Format: r-[name] to avoid collision with variant names.
 */
export const RADII = new Set(['r-none', 'r-sm', 'r-md', 'r-lg', 'r-full']);

/** Maps r-* shorthand tokens to their Radius type values. */
export const RADIUS_MAP: Readonly<Record<string, Radius>> = {
  'r-none': 'none',
  'r-sm':   'sm',
  'r-md':   'md',
  'r-lg':   'lg',
  'r-full': 'full',
};

/** All boolean state tokens recognised in the v attribute. */
export const STATE_TOKENS = new Set(['loading', 'disabled', 'full']);

/** localStorage key used to persist the active theme across page loads. */
export const THEME_STORAGE_KEY = 'kenikool-theme';

// ── Layout token constants ─────────────────────────────────────────────────

/**
 * Valid flex/grid alignment values for the cross axis.
 * Parsed from: align-start, align-center, align-end, align-stretch, align-baseline
 */
export const ALIGN_VALUES = new Set(['start', 'center', 'end', 'stretch', 'baseline']);

/**
 * Valid flex/grid justify values for the main axis.
 * Parsed from: justify-start, justify-center, justify-end,
 *              justify-between, justify-around, justify-evenly
 */
export const JUSTIFY_VALUES = new Set(['start', 'center', 'end', 'between', 'around', 'evenly']);

/**
 * Valid surface tokens for k-box backgrounds.
 * Intentionally excludes 'elevated' and 'overlay' to avoid collision
 * with button variants — those two are handled as variant names in k-box CSS.
 * Only 'surface' and 'base' are unambiguous surface-only tokens.
 */
export const SURFACE_VALUES = new Set(['base', 'surface']);

/**
 * Valid typography size tokens for k-text.
 * Prefixed with "text-" to avoid collision with Size tokens (xs/sm/md/lg/xl).
 * e.g. text-2xl, text-3xl
 */
export const TEXT_SIZES = new Set(['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl']);

/** Maps text-* tokens to their bare size value. */
export const TEXT_SIZE_MAP: Readonly<Record<string, string>> = {
  'text-xs':   'xs',
  'text-sm':   'sm',
  'text-base': 'base',
  'text-lg':   'lg',
  'text-xl':   'xl',
  'text-2xl':  '2xl',
  'text-3xl':  '3xl',
  'text-4xl':  '4xl',
};

/**
 * Valid font weight tokens for k-text.
 */
export const WEIGHT_VALUES = new Set(['normal', 'medium', 'semibold', 'bold']);

/**
 * Valid semantic HTML element tokens for k-text.
 */
export const AS_VALUES = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label', 'code', 'pre']);

/**
 * Maps spacing scale names to their --k-space-* token names.
 * Used for gap-N and p-N token parsing.
 * The value is the CSS variable reference used in data-* attribute selectors.
 */
export const SPACE_SCALE = new Set([
  '0', 'px', '0-5',
  '1', '1-5', '2', '2-5', '3', '3-5',
  '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '14', '16', '20', '24',
]);

/** Default values applied when tokens are absent from the v attribute. */
export const V_DEFAULTS = {
  variant:   'filled',
  size:      'md'      as Size,
  color:     'primary' as Color,
  radius:    null      as Radius | null,
  loading:   false,
  disabled:  false,
  full:      false,
  target:    null      as string | null,
  // Layout defaults — all null means "use CSS component defaults"
  cols:      null      as number | 'auto' | null,
  gap:       null      as string | null,
  span:      null      as number | 'full' | null,
  surface:   null      as 'base' | 'surface' | null,
  align:     null      as 'start' | 'center' | 'end' | 'stretch' | 'baseline' | null,
  justify:   null      as 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' | null,
  direction: null      as 'horizontal' | 'vertical' | null,
  textSize:  null      as 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | null,
  weight:    null      as 'normal' | 'medium' | 'semibold' | 'bold' | null,
  as:        null      as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label' | 'code' | 'pre' | null,
  padding:   null      as string | null,
} as const;
