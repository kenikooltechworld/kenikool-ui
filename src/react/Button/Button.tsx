import React, { forwardRef } from 'react';
import type { ButtonProps } from './Button.types';
import './Button.css';

const SPINNER_SVG = (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'filled',
      size = 'md',
      color = 'primary',
      radius,
      loading = false,
      disabled = false,
      full = false,
      icon,
      iconRight,
      label,
      children,
      className,
      onClick,
      ...rest
    },
    ref
  ) {
    const classes = [
      'k-button',
      `k-button--${variant}`,
      `k-button--${size}`,
      `k-button--${color}`,
      radius ? `k-button--r-${radius}` : '',
      loading ? 'k-button--loading' : '',
      disabled ? 'k-button--disabled' : '',
      full ? 'k-button--full' : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    const accessibleName = label ?? (typeof children === 'string' ? children : undefined);

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
      if (loading || disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        aria-disabled={disabled}
        aria-busy={loading}
        aria-label={accessibleName}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        {...rest}
      >
        {icon && <span className="k-button__icon-left" aria-hidden="true">{icon}</span>}
        {loading && <span className="k-button__loader" aria-hidden="true">{SPINNER_SVG}</span>}
        {children && <span className="k-button__label">{children}</span>}
        {iconRight && <span className="k-button__icon-right" aria-hidden="true">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
