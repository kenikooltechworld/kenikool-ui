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
  | 'destructive';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ButtonColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';

export type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  radius?: ButtonRadius;
  loading?: boolean;
  disabled?: boolean;
  full?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  label?: string;
}
