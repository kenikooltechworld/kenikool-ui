import React, { forwardRef, useState, useRef, useEffect, useCallback, useId } from 'react';
import type { InputProps } from './Input.types';
import './Input.css';

/* ─── Icon SVGs (inlined to keep the component self-contained) ───────── */

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SpinnerIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" />
  </svg>
);

/* ─── Per-color shadow (React re-uses CSS custom-property modifiers) ─── */

const COLOR_CLASS: Record<string, string> = {
  primary: 'k-input--primary',
  success: 'k-input--success',
  warning: 'k-input--warning',
  error:   'k-input--error',
  info:    'k-input--info',
  default: 'k-input--default-color',
};

const RADIUS_CLASS: Record<string, string> = {
  none: 'k-input--r-none',
  sm:   'k-input--r-sm',
  md:   'k-input--r-md',
  lg:   'k-input--r-lg',
  full: 'k-input--r-full',
};

/* ─── Component ──────────────────────────────────────────────────────── */

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  function Input(props, ref) {
    const {
      // Variant
      as = 'input',
      variant = 'default',
      size = 'md',
      color = 'primary',
      radius,
      // States
      loading = false,
      disabled = false,
      full = false,
      error: errorProp = false,
      truncate = false,
      // Content
      label,
      hint,
      validationMessage,
      showcounter = false,
      labelPosition = 'top',
      addonLeft,
      addonRight,
      // Icons
      icon,
      iconRight,
      // Utility tokens
      width,
      height,
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      textAlign,
      border,
      shadow,
      cursor,
      // Standard HTML attributes
      type = 'text',
      placeholder,
      value: valueProp,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      onInput,
      required,
      maxLength,
      pattern,
      autoComplete,
      inputMode,
      autoFocus,
      readOnly,
      name,
      id,
      className,
      children,
      // Rest pass-through
      ...rest
    } = props;

    // Resolve effective type — password variant forces type="password"
    const effectiveType =
      variant === 'password' ? 'password' :
      variant === 'search'   ? 'search'   :
      type;

    // ─── State ────────────────────────────────────────────────────────
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState<string>(defaultValue?.toString() ?? '');
    const value = isControlled ? String(valueProp ?? '') : internalValue;

    const [pwdVisible, setPwdVisible] = useState(false);
    const [touched, setTouched] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // OTP state — 6 individual cell values
    const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const internalRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
    const setRefs = (node: HTMLInputElement | HTMLTextAreaElement | null) => {
      internalRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>).current = node;
    };

    // Stable id for label association
    const reactId = useId();
    const fieldId = id ?? `k-input-${reactId.replace(/:/g, '')}`;
    const hintId = hint ? `${fieldId}-hint` : undefined;
    const counterId = showcounter ? `${fieldId}-counter` : undefined;

    // ─── Validation ───────────────────────────────────────────────────
    const validate = useCallback((): boolean => {
      if (errorProp) {
        setValidationError(validationMessage ?? '');
        return false;
      }
      // Empty + not required: valid
      if (!value && !required) {
        setValidationError(null);
        return true;
      }
      // Empty + required: invalid
      if (!value && required) {
        setValidationError('This field is required.');
        return false;
      }
      // Pattern check
      if (pattern) {
        try {
          const re = new RegExp(pattern);
          if (!re.test(value)) {
            setValidationError(validationMessage ?? 'Input does not match the required format.');
            return false;
          }
        } catch { /* invalid regex — ignore */ }
      }
      // Type-specific checks
      if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setValidationError(validationMessage ?? 'Please enter a valid email address.');
        return false;
      }
      if (type === 'url' && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
        setValidationError(validationMessage ?? 'Please enter a valid URL.');
        return false;
      }
      setValidationError(null);
      return true;
    }, [value, required, pattern, type, errorProp, validationMessage]);

    useEffect(() => {
      validate();
    }, [validate]);

    const hasError = errorProp || (touched && validationError !== null);
    const hasValue = (variant === 'otp' ? otpValues.join('').length > 0 : value.length > 0);
    const showValid = !hasError && hasValue && !errorProp;

    // ─── Handlers ─────────────────────────────────────────────────────
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newVal = e.target.value;
      if (!isControlled) setInternalValue(newVal);
      onChange?.(e as React.ChangeEvent<HTMLInputElement>);
    };

    const handleInput = (_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // onInput is forwarded directly via {...rest} on the inner element;
      // we don't need to do anything special here. The handler exists so the
      // fieldProps type can include `onInput` if the consumer wants it.
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTouched(true);
      onBlur?.(e as unknown as React.FocusEvent<HTMLInputElement>);
    };

    // ─── OTP handlers ─────────────────────────────────────────────────
    const handleOtpChange = (index: number, raw: string) => {
      const digit = raw.replace(/\D/g, '').slice(-1);
      const next = [...otpValues];
      next[index] = digit;
      setOtpValues(next);
      if (digit && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
      // Fire k:complete event
      const joined = next.join('');
      if (joined.length === 6) {
        onChange?.({ target: { value: joined } } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
      const next = ['', '', '', '', '', ''];
      data.forEach((d, i) => { next[i] = d; });
      setOtpValues(next);
      const lastIdx = Math.min(data.length, 5);
      otpRefs.current[lastIdx]?.focus();
      if (next.join('').length === 6) {
        onChange?.({ target: { value: next.join('') } } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    };

    // ─── Search clear ─────────────────────────────────────────────────
    const handleClear = () => {
      if (!isControlled) setInternalValue('');
      onChange?.({ target: { value: '' } } as unknown as React.ChangeEvent<HTMLInputElement>);
      internalRef.current?.focus();
    };

    // ─── Class names ──────────────────────────────────────────────────
    const classes = [
      'k-input',
      `k-input--${variant}`,
      `k-input--${size}`,
      COLOR_CLASS[color] ?? '',
      radius ? (RADIUS_CLASS[radius] ?? '') : '',
      disabled ? 'k-input--disabled' : '',
      loading  ? 'k-input--loading'  : '',
      full     ? 'k-input--w-full'   : '', // 'full' maps to width: 100% directly
      hasError ? 'k-input--error'    : '',
      showValid ? 'k-input--valid'   : '',
      truncate ? 'k-input--truncate' : '',
      // Utility tokens
      width     ? `k-input--w-${width}`     : '',
      height    ? `k-input--h-${height}`    : '',
      maxWidth  ? `k-input--mw-${maxWidth}`  : '',
      maxHeight ? `k-input--mh-${maxHeight}` : '',
      minWidth  ? `k-input--mnw-${minWidth}` : '',
      minHeight ? `k-input--mnh-${minHeight}`: '',
      textAlign ? `k-input--txt-${textAlign}`: '',
      border    ? `k-input--bdr${border === 'all' ? '' : '-none'}` : '',
      shadow    ? `k-input--shd-${shadow}`  : '',
      cursor    ? `k-input--cur-${cursor}`  : '',
      className ?? '',
    ].filter(Boolean).join(' ');

    // ─── Render the right-side icon ────────────────────────────────────
    const renderRightIcon = (): React.ReactNode => {
      if (variant === 'password') {
        return (
          <button
            type="button"
            className="k-input__password-toggle"
            aria-label={pwdVisible ? 'Hide password' : 'Show password'}
            onClick={() => setPwdVisible((v) => !v)}
            tabIndex={-1}
          >
            {pwdVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        );
      }
      if (variant === 'search' && hasValue) {
        return (
          <button
            type="button"
            className="k-input__clear-btn"
            aria-label="Clear search"
            onClick={handleClear}
            tabIndex={-1}
          >
            <CloseIcon />
          </button>
        );
      }
      if (iconRight) {
        return iconRight;
      }
      return null;
    };

    const rightIcon = renderRightIcon();
    const showValidIcon = showValid && !rightIcon &&
      variant !== 'search' && variant !== 'password' && variant !== 'otp' && variant !== 'with-addon';

    // ─── Hint / error message text ────────────────────────────────────
    const hintText = hasError ? (validationError ?? hint) : hint;

    // ─── Render ───────────────────────────────────────────────────────
    if (variant === 'otp') {
      return (
        <div className={classes}>
          <div className="k-input__field-group" data-label-position={labelPosition}>
            {label && labelPosition === 'top' && (
              <label className="k-input__label" htmlFor={fieldId}>{label}</label>
            )}
            <div className="k-input__wrapper">
              <div className="k-input__otp-group" role="group" aria-label={label}>
                {otpValues.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    id={i === 0 ? fieldId : `${fieldId}-${i}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete={i === 0 ? 'one-time-code' : undefined}
                    className="k-input__field"
                    maxLength={1}
                    aria-label={`Digit ${i + 1} of 6`}
                    value={v}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={handleOtpPaste}
                    onFocus={onFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    aria-invalid={hasError || undefined}
                    aria-describedby={hint ? hintId : undefined}
                  />
                ))}
              </div>
              {loading && (
                <div className="k-input__loader" aria-hidden="true"><SpinnerIcon /></div>
              )}
            </div>
            {label && labelPosition === 'bottom' && (
              <label className="k-input__label" htmlFor={fieldId}>{label}</label>
            )}
            {hintText && (
              <span id={hintId} className="k-input__hint">{hintText}</span>
            )}
          </div>
        </div>
      );
    }

    // Field-level props shared by input and textarea
    // Note: `ref` is applied via JSX directly (not part of fieldProps type).
    const fieldProps = {
      id: fieldId,
      name,
      className: 'k-input__field',
      placeholder: variant === 'floating-label' && !placeholder ? ' ' : placeholder,
      value,
      defaultValue: isControlled ? undefined : defaultValue,
      onChange: handleChange as React.ChangeEventHandler<HTMLInputElement & HTMLTextAreaElement>,
      onInput: handleInput,
      onBlur: handleBlur,
      disabled,
      readOnly,
      required,
      maxLength,
      pattern,
      autoComplete,
      inputMode,
      autoFocus,
      'aria-invalid': hasError || undefined,
      'aria-required': required || undefined,
      'aria-describedby': hintId,
      'aria-busy': loading || undefined,
    };

    return (
      <div className={classes}>
        <div className="k-input__field-group" data-label-position={labelPosition}>
          {label && labelPosition === 'top' && (
            <label className="k-input__label" htmlFor={fieldId}>{label}</label>
          )}
          <div className="k-input__wrapper">
            {variant === 'with-addon' && addonLeft && (
              <div className="k-input__addon k-input__addon-left">{addonLeft}</div>
            )}
            {icon && <span className="k-input__icon-left" aria-hidden="true">{icon}</span>}
            {as === 'textarea' || variant === 'textarea' ? (
              <textarea {...(fieldProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} ref={setRefs as React.Ref<HTMLTextAreaElement>} />
            ) : (
              <input
                type={variant === 'password' && pwdVisible ? 'text' : effectiveType}
                {...(fieldProps as React.InputHTMLAttributes<HTMLInputElement>)}
                ref={setRefs as React.Ref<HTMLInputElement>}
              />
            )}
            {variant === 'with-addon' && addonRight && (
              <div className="k-input__addon k-input__addon-right">{addonRight}</div>
            )}
            {showValidIcon && (
              <span className="k-input__icon-right" aria-hidden="true" style={{ color: 'var(--k-success)' }}>
                <CheckIcon />
              </span>
            )}
            {rightIcon && (
              <span className="k-input__icon-right">{rightIcon}</span>
            )}
            {loading && (
              <div className="k-input__loader" aria-hidden="true"><SpinnerIcon /></div>
            )}
          </div>
          {label && labelPosition === 'bottom' && (
            <label className="k-input__label" htmlFor={fieldId}>{label}</label>
          )}
          {hintText && (
            <span id={hintId} className="k-input__hint">{hintText}</span>
          )}
          {showcounter && maxLength && (
            <span id={counterId} className={`k-input__counter ${value.length / maxLength >= 0.8 ? 'k-input__counter--warn' : ''}`}>
              {value.length} / {maxLength}
            </span>
          )}
          {children}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
