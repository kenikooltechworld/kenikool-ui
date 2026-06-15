/**
 * parseV — the v attribute parser.
 *
 * Converts a space-separated v attribute string into a fully-typed VTokens
 * object that drives component rendering, accessibility, and layout.
 *
 * Token categories — order never matters:
 *
 * UNIVERSAL (all components):
 *   .selector / #selector  → target (CSS mount selector)
 *   xs | sm | md | lg | xl → size
 *   primary | success | warning | error | info | default → color
 *   r-none | r-sm | r-md | r-lg | r-full → radius
 *   loading | disabled | full → boolean state flags
 *   everything else → variant name
 *
 * LAYOUT (k-grid, k-row, k-col, k-stack, k-box, k-text):
 *   cols-N | cols-auto      → grid column count
 *   gap-N                   → gap (maps to --k-space-N)
 *   span-N | span-full      → grid column span
 *   base | surface | elevated | overlay → surface background
 *   align-*                 → cross-axis alignment
 *   justify-*               → main-axis alignment
 *   horizontal | vertical   → flex direction
 *   text-xs … text-4xl      → typography size (prefixed to avoid Size collision)
 *   normal | medium | semibold | bold → font weight
 *   h1 … h6 | p | span | label | code | pre → semantic element (k-text)
 *   p-N                     → padding (maps to --k-space-N)
 */

import type { VTokens, Size, Color, Radius } from './types.js';
import {
  SIZES, COLORS, RADII, RADIUS_MAP, SPACE_SCALE,
  ALIGN_VALUES, JUSTIFY_VALUES, SURFACE_VALUES,
  TEXT_SIZES, TEXT_SIZE_MAP, WEIGHT_VALUES, AS_VALUES,
  V_DEFAULTS,
} from './constants.js';

/**
 * Parses the `v` attribute string into a structured VTokens object.
 *
 * @param v - The raw v attribute string. May be empty, null, or undefined.
 * @returns  A fully-populated VTokens object with defaults for any absent fields.
 *
 * @example
 * parseV('filled lg error loading .hero')
 * // → { variant:'filled', size:'lg', color:'error', loading:true, target:'.hero', ... }
 *
 * @example
 * parseV('cols-3 gap-4')
 * // → { cols:3, gap:'4', ...defaults }
 *
 * @example
 * parseV('text-2xl bold h2')
 * // → { textSize:'2xl', weight:'bold', as:'h2', ...defaults }
 */
export function parseV(v: string | null | undefined): VTokens {
  const result: VTokens = { ...V_DEFAULTS };

  if (!v || typeof v !== 'string') return result;

  const tokens = v.trim().split(/\s+/).filter(Boolean);

  for (const token of tokens) {

    // ── CSS mount-target selector (.class or #id) ─────────────────────────
    if (token.startsWith('.') || token.startsWith('#')) {
      result.target = token;
      continue;
    }

    // ── Universal: size ───────────────────────────────────────────────────
    if (SIZES.has(token as Size)) {
      result.size = token as Size;
      continue;
    }

    // ── Universal: color ──────────────────────────────────────────────────
    if (COLORS.has(token as Color)) {
      result.color = token as Color;
      continue;
    }

    // ── Universal: radius (r-none, r-sm, r-md, r-lg, r-full) ─────────────
    if (RADII.has(token)) {
      result.radius = RADIUS_MAP[token] as Radius;
      continue;
    }

    // ── Universal: state flags ────────────────────────────────────────────
    if (token === 'loading')  { result.loading  = true; continue; }
    if (token === 'disabled') { result.disabled = true; continue; }
    if (token === 'full')     { result.full     = true; continue; }

    // ── Layout: cols-N or cols-auto ───────────────────────────────────────
    if (token.startsWith('cols-')) {
      const val = token.slice(5);
      if (val === 'auto') {
        result.cols = 'auto';
      } else {
        const n = parseInt(val, 10);
        if (!isNaN(n) && n >= 1 && n <= 12) result.cols = n;
      }
      continue;
    }

    // ── Layout: gap-N ─────────────────────────────────────────────────────
    if (token.startsWith('gap-')) {
      const val = token.slice(4);
      if (SPACE_SCALE.has(val)) {
        result.gap = val;
      }
      continue;
    }

    // ── Layout: span-N or span-full ───────────────────────────────────────
    if (token.startsWith('span-')) {
      const val = token.slice(5);
      if (val === 'full') {
        result.span = 'full';
      } else {
        const n = parseInt(val, 10);
        if (!isNaN(n) && n >= 1 && n <= 12) result.span = n;
      }
      continue;
    }

    // ── Layout: surface (base | surface | elevated | overlay) ────────────
    if (SURFACE_VALUES.has(token)) {
      result.surface = token as VTokens['surface'];
      continue;
    }

    // ── Layout: align-* ───────────────────────────────────────────────────
    if (token.startsWith('align-')) {
      const val = token.slice(6);
      if (ALIGN_VALUES.has(val)) {
        result.align = val as VTokens['align'];
      }
      continue;
    }

    // ── Layout: justify-* ─────────────────────────────────────────────────
    if (token.startsWith('justify-')) {
      const val = token.slice(8);
      if (JUSTIFY_VALUES.has(val)) {
        result.justify = val as VTokens['justify'];
      }
      continue;
    }

    // ── Layout: flex direction ────────────────────────────────────────────
    if (token === 'horizontal') { result.direction = 'horizontal'; continue; }
    if (token === 'vertical')   { result.direction = 'vertical';   continue; }

    // ── Layout: text-* (typography size, prefixed to avoid Size collision) ─
    if (TEXT_SIZES.has(token)) {
      result.textSize = TEXT_SIZE_MAP[token] as VTokens['textSize'];
      continue;
    }

    // ── Layout: font weight ───────────────────────────────────────────────
    if (WEIGHT_VALUES.has(token)) {
      result.weight = token as VTokens['weight'];
      continue;
    }

    // ── Layout: semantic element (k-text) ─────────────────────────────────
    if (AS_VALUES.has(token)) {
      result.as = token as VTokens['as'];
      continue;
    }

    // ── Layout: p-N (padding) ─────────────────────────────────────────────
    if (token.startsWith('p-')) {
      const val = token.slice(2);
      if (SPACE_SCALE.has(val)) {
        result.padding = val;
      }
      continue;
    }

    // ── Fallthrough: anything else = variant name (last wins) ─────────────
    if (token.length > 0) {
      result.variant = token;
    }
  }

  return result;
}
