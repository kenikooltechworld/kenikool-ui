import type { Size, Color } from '../../core/types.js';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  /** Visual variant of the input. */
  variant?: 'default' | 'filled' | 'outlined' | 'underlined' | 'floating-label' | 'search' | 'otp' | 'textarea';
  /** Size of the input. */
  size?: Size;
  /** Semantic color. */
  color?: Color;
  /** Label text displayed above or within the input. */
  label?: string;
  /** Hint text displayed below the input. */
  hint?: string;
  /** Whether the input is in an error state. */
  error?: boolean;
  /** Icon to display on the left side. */
  icon?: string;
  /** Icon to display on the right side. */
  iconRight?: string;
  /**
   * The `v` shorthand attribute for advanced configuration.
   * Note: If using individual props (variant, size, etc.), this may be overridden.
   */
  v?: string;
}
