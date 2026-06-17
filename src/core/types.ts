/**
 * Shared TypeScript types used across vanilla, react, and themes entries.
 * Import from here — never duplicate these definitions.
 */

/** The three supported theme identifiers. */
export type Theme = 'light' | 'dark' | 'dracula';

/** Component size scale — consistent across all components. */
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Semantic color intent — maps to --k-* color tokens. */
export type Color = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';

/** Border radius override — maps to --k-radius-* tokens. */
export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'full';

/**
 * The parsed result of a `v` attribute string.
 * Every field has a default so components always receive a complete config.
 */
export interface VTokens {
  /** Visual style variant. Default: 'filled'. */
  variant:  string;
  /** Component size. Default: 'md'. */
  size:     Size;
  /** Semantic color intent. Default: 'primary'. */
  color:    Color;
  /** Border radius override. null = use component CSS default. */
  radius:   Radius | null;
  /** Loading state — shows spinner, blocks interaction. Default: false. */
  loading:  boolean;
  /** Disabled state — prevents interaction. Default: false. */
  disabled: boolean;
  /** Full width. Default: false. */
  full:     boolean;
  /** CSS selector for auto-mount target (e.g. '.hero', '#app'). null if none. */
  target:   string | null;

  // ── Layout tokens (used by k-grid, k-row, k-col, k-stack, k-box, k-text) ──

  /**
   * Grid column count override. 'auto' = auto-fit (default responsive).
   * Parsed from tokens: cols-1 … cols-12, cols-auto.
   * null = use component default.
   */
  cols:     number | 'auto' | null;

  /**
   * Gap override. Mapped from gap-N → --k-space-N.
   * Parsed from tokens: gap-0, gap-1 … gap-24, gap-px.
   * null = use component default (--k-layout-gap).
   */
  gap:      string | null;

  /**
   * Column span for grid children (k-col).
   * Parsed from tokens: span-1 … span-12, span-full.
   * null = auto (default).
   */
  span:     number | 'full' | null;

  /**
   * Surface variant for k-box. Maps to a --k-bg-* token.
   * 'base' and 'surface' are parsed from the v string as dedicated tokens.
   * 'elevated' and 'overlay' are parsed as variant names (no collision risk
   * since k-box CSS reads data-variant for those two).
   * null = no background set.
   */
  surface:  'base' | 'surface' | null;

  /**
   * Flex/grid alignment along the cross axis.
   * Parsed from tokens: align-start | align-center | align-end | align-stretch | align-baseline.
   * null = use component default.
   */
  align:    'start' | 'center' | 'end' | 'stretch' | 'baseline' | null;

  /**
   * Flex/grid alignment along the main axis.
   * Parsed from tokens: justify-start | justify-center | justify-end |
   *                     justify-between | justify-around | justify-evenly.
   * null = use component default.
   */
  justify:  'start' | 'center' | 'end' | 'between' | 'around' | 'evenly' | null;

  /**
   * Flex direction override for k-stack.
   * Parsed from tokens: horizontal | vertical.
   * null = use component default (vertical for k-stack, horizontal for k-row).
   */
  direction: 'horizontal' | 'vertical' | null;

  /**
   * Typography size for k-text.
   * Parsed from tokens: text-xs | text-sm | text-base | text-lg |
   *                     text-xl | text-2xl | text-3xl | text-4xl.
   * null = use component default.
   */
  textSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | null;

  /**
   * Font weight for k-text.
   * Parsed from tokens: normal | medium | semibold | bold.
   * null = use component default.
   */
  weight:   'normal' | 'medium' | 'semibold' | 'bold' | null;

  /**
   * Semantic HTML element for k-text.
   * Parsed from tokens: h1 | h2 | h3 | h4 | h5 | h6 | p | span | label | code | pre.
   * null = defaults to <p>.
   */
  as:       'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label' | 'code' | 'pre' | null;

  /**
   * Padding override for k-box. Maps to --k-space-N.
   * Parsed from tokens: p-0 | p-1 … p-24.
   * null = use component default (--k-box-padding).
   */
  padding:  string | null;

  // ── New Universal Tokens (v0.1.0) ────────────────────────────────────────

  /**
   * Width utility.
   * Parsed from tokens: w-full | w-auto | w-fit | w-screen.
   * null = use component default.
   */
  width: 'full' | 'auto' | 'fit' | 'screen' | null;

  /**
   * Height utility.
   * Parsed from tokens: h-full | h-auto | h-screen | h-fit.
   * null = use component default.
   */
  height: 'full' | 'auto' | 'screen' | 'fit' | null;

  /**
   * Max width utility.
   * Parsed from tokens: mw-full.
   * null = no max-width constraint.
   */
  maxWidth: 'full' | null;

  /**
   * Max height utility.
   * Parsed from tokens: mh-full | mh-screen.
   * null = no max-height constraint.
   */
  maxHeight: 'full' | 'screen' | null;

  /**
   * Min width utility.
   * Parsed from tokens: mnw-0.
   * null = no min-width constraint.
   */
  minWidth: '0' | null;

  /**
   * Min height utility.
   * Parsed from tokens: mnh-0 | mnh-screen.
   * null = no min-height constraint.
   */
  minHeight: '0' | 'screen' | null;

  /**
   * Text align utility.
   * Parsed from tokens: txt-left | txt-center | txt-right | txt-justify.
   * null = use component default.
   */
  textAlign: 'left' | 'center' | 'right' | 'justify' | null;

  /**
   * Overflow utility (both axes).
   * Parsed from tokens: ovf-auto | ovf-hidden | ovf-scroll.
   * null = use component default.
   */
  overflow: 'auto' | 'hidden' | 'scroll' | null;

  /**
   * Overflow-Y utility (vertical only).
   * Parsed from tokens: ovfy-auto | ovfy-hidden | ovfy-scroll.
   * null = use component default.
   */
  overflowY: 'auto' | 'hidden' | 'scroll' | null;

  /**
   * Overflow-X utility (horizontal only).
   * Parsed from tokens: ovfx-auto | ovfx-hidden | ovfx-scroll.
   * null = use component default.
   */
  overflowX: 'auto' | 'hidden' | 'scroll' | null;

  /**
   * Border utility.
   * Parsed from tokens: bdr | bdr-t | bdr-r | bdr-b | bdr-l | bdr-none.
   * null = no border set.
   */
  border: 'all' | 't' | 'r' | 'b' | 'l' | 'none' | null;

  /**
   * Shadow utility.
   * Parsed from tokens: shd-sm | shd-md | shd-lg | shd-xl | shd-none.
   * null = use component default.
   */
  shadow: 'sm' | 'md' | 'lg' | 'xl' | 'none' | null;

  /**
   * Display utility.
   * Parsed from tokens: d-block | d-inline | d-flex | d-grid | d-none.
   * null = use component default.
   */
  display: 'block' | 'inline' | 'flex' | 'grid' | 'none' | null;

  /**
   * Cursor utility.
   * Parsed from tokens: cur-ptr | cur-def | cur-not.
   * null = use component default.
   */
  cursor: 'ptr' | 'def' | 'not' | null;
}
