export type ButtonVariant =
  | 'filled'
  | 'outlined'
  | 'ghost'
  | 'subtle'
  | 'soft'
  | 'gradient'
  | 'glow'
  | 'minimal'
  | 'elevated'
  | 'destructive'
  | 'icon-only';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';

export type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export type UtilityWidth = 'full' | 'auto' | 'fit' | 'screen';
export type UtilityHeight = 'full' | 'auto' | 'screen' | 'fit';
export type UtilityMaxWidth = 'full';
export type UtilityMaxHeight = 'full' | 'screen';
export type UtilityMinWidth = '0';
export type UtilityMinHeight = '0' | 'screen';
export type UtilityTextAlign = 'left' | 'center' | 'right' | 'justify';
export type UtilityBorder = 'all' | 'none';
export type UtilityShadow = 'sm' | 'md' | 'lg' | 'xl' | 'none';
export type UtilityCursor = 'ptr' | 'def' | 'not';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  radius?: ButtonRadius;
  loading?: boolean;
  disabled?: boolean;
  full?: boolean;
  truncate?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  label?: string;
  // Utility tokens
  width?: UtilityWidth;
  height?: UtilityHeight;
  maxWidth?: UtilityMaxWidth;
  maxHeight?: UtilityMaxHeight;
  minWidth?: UtilityMinWidth;
  minHeight?: UtilityMinHeight;
  textAlign?: UtilityTextAlign;
  border?: UtilityBorder;
  shadow?: UtilityShadow;
  cursor?: UtilityCursor;
}
