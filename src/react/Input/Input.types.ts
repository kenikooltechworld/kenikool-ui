import type { Size, Color } from '../../core/types.js';

/**
 * Input component props — React side.
 *
 * Mirrors the vanilla <k-input> attribute set. The `v` prop is the canonical
 * escape hatch for any token not exposed as a first-class prop.
 *
 * We intentionally extend ONLY InputHTMLAttributes (not TextareaHTMLAttributes)
 * and treat the textarea as a styled <input> at the type level. The `as` prop
 * switches the rendered element; the user passes input-like props in both cases.
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** The inner element type. Use 'input' (default) for <input>, 'textarea' for <textarea>. */
  as?: 'input' | 'textarea';

  // ─── Variant tokens (also expressible via v="…") ─────────────────────
  /** Visual variant. Default: 'default'. */
  variant?: 'default' | 'filled' | 'outlined' | 'underlined' | 'floating-label' | 'search' | 'password' | 'otp' | 'textarea' | 'with-addon';
  /** Component size. Default: 'md'. */
  size?: Size;
  /** Semantic color. Default: 'primary'. */
  color?: Color;
  /** Border radius override. */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';

  // ─── States ───────────────────────────────────────────────────────────
  /** Whether the input is in a loading state. Renders a k-loader overlay. */
  loading?: boolean;
  /** Whether the input is disabled. Mirrors to the inner field. */
  disabled?: boolean;
  /** Whether the input should fill its container width. */
  full?: boolean;
  /** Force the error state. Sets data-error and aria-invalid. */
  error?: boolean;

  // ─── Content & affordances ────────────────────────────────────────────
  /** Label text. Rendered as a real <label> element. */
  label?: string;
  /** Helper text below the field. Replaced with error message on validation failure. */
  hint?: string;
  /** Override the default validation error message. */
  validationMessage?: string;
  /** Show a live character counter. Requires maxlength. */
  showcounter?: boolean;
  /** Position of the label relative to the field. */
  labelPosition?: 'top' | 'bottom';
  /** Left addon text (only for variant="with-addon"). */
  addonLeft?: string;
  /** Right addon text (only for variant="with-addon"). */
  addonRight?: string;

  // ─── Icons (React can pass nodes; vanilla uses string names) ──────────
  /** Icon on the left side. Pass a string (IconName) or a React node. */
  icon?: string | React.ReactNode;
  /** Icon on the right side. Pass a string (IconName) or a React node. */
  iconRight?: string | React.ReactNode;

  // ─── Utility tokens ──────────────────────────────────────────────────
  width?: 'full' | 'auto' | 'fit' | 'screen';
  height?: 'full' | 'auto' | 'screen' | 'fit';
  maxWidth?: 'full';
  maxHeight?: 'full' | 'screen';
  minWidth?: '0';
  minHeight?: '0' | 'screen';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  border?: 'all' | 'none';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  cursor?: 'ptr' | 'def' | 'not';
  truncate?: boolean;

  // ─── v shorthand ─────────────────────────────────────────────────────
  /** Combined tokens for variant, size, color, etc. Equivalent to the v="…" attribute. */
  v?: string;
}
