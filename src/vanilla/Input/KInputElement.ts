/**
 * KInputElement — <k-input> Web Custom Element.
 *
 * Usage:
 *   <k-input v="outlined md" label="Email" placeholder="Enter email"></k-input>
 *   <k-input v="filled lg error" label="Username" hint="Username is required"></k-input>
 *   <k-input v="password" label="Password" icon="eye"></k-input>
 *   <k-input v="otp" label="Verification Code"></k-input>
 *   <k-input v="textarea" label="Comments"></k-input>
 */

import { KBaseElement } from '../KBaseElement.js';
import { sanitizeText } from '../../core/utils/sanitize.js';
import { getIcon } from '../../core/icons.js';
import type { IconName } from '../../core/icons.js';

/**
 * Professional validation rules and their default error messages.
 */
const VALIDATION_RULES = {
  email: {
    pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    message: 'Please enter a valid email address.',
  },
  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.',
    requirements: [
      { id: 'len', label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
      { id: 'upper', label: 'One uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
      { id: 'lower', label: 'One lowercase letter', test: (v: string) => /[a-z]/.test(v) },
      { id: 'num', label: 'One number', test: (v: string) => /\d/.test(v) },
    ]
  },
  search: {
    pattern: /^.{3,}$/,
    message: 'Search queries must be at least 3 characters.',
  },
  tel: {
    pattern: /^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/,
    message: 'Please enter a valid phone number.',
  },
  url: {
    pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    message: 'Please enter a valid URL.',
  },
  otp: {
    pattern: /^\d{6}$/,
    message: 'Please enter a valid 6-digit code.',
  },
  text: {
    pattern: /.+/,
    message: 'This field cannot be empty.',
  }
};

export class KInputElement extends KBaseElement {
  private _field: HTMLInputElement | HTMLTextAreaElement | null = null;
  private _otpFields: HTMLInputElement[] = [];
  private _hintEl: HTMLElement | null = null;
  private _labelEl: HTMLElement | null = null;
  private _wrapper: HTMLElement | null = null;
  private _id: string = '';
  private _clearBtn: HTMLButtonElement | null = null;
  private _pwdToggle: HTMLButtonElement | null = null;
  private _reqItems: HTMLElement[] = [];

  /**
   * The current value of the input.
   * For OTP, this is the combined string of all 6 fields.
   */
  get value(): string {
    if (this._getTokens().variant === 'otp') {
      return this._otpFields.map(f => f.value).join('');
    }
    return this._field?.value ?? '';
  }

  set value(val: string) {
    if (this._getTokens().variant === 'otp') {
      const digits = val.split('').slice(0, 6);
      this._otpFields.forEach((field, i) => {
        field.value = digits[i] || '';
      });
    } else if (this._field) {
      this._field.value = val;
    }
    this._updateClearButtonVisibility();
  }

  static get observedAttributes(): string[] {
    return [...super.observedAttributes, 'label', 'placeholder', 'data-error', 'hint', 'icon', 'iconRight', 'type', 'validation-message', 'pattern', 'required', 'addonLeft', 'addonRight', 'label-position'];
  }

  protected _render(): void {
    if (this._wrapper) return;

    const tokens = this._getTokens();
    const isTextarea = tokens.variant === 'textarea';
    const isOtp = tokens.variant === 'otp';

    // 1. Generate stable ID for the component lifetime
    this._id = `k-input-${Math.random().toString(36).substring(2, 11)}`;

    // Main structural group (outermost)
    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'k-input__field-group';

    // Wrapper (The border-box containing the field and icons)
    const wrapper = document.createElement('div');
    wrapper.className = 'k-input__wrapper';

    // Input Field
    if (isOtp) {
      this._renderOtpFields(wrapper);
    } else {
      const input = isTextarea ? document.createElement('textarea') : document.createElement('input');
      input.className = 'k-input__field';

      const placeholder = this.getAttribute('placeholder') || '';
      input.placeholder = placeholder;

      if (tokens.variant === 'floating-label' && !placeholder) {
        input.placeholder = ' ';
      }

      input.id = this._id;

      const typeAttr = this.getAttribute('type');
      if (typeAttr) {
        input.setAttribute('type', typeAttr);
      } else if (tokens.variant === 'password') {
        input.setAttribute('type', 'password');
      } else if (tokens.variant === 'search') {
        input.setAttribute('type', 'search');
      } else {
        input.setAttribute('type', 'text');
      }

      if (this.getAttribute('required')) {
        input.required = true;
        input.setAttribute('aria-required', 'true');
      }
      if (this.getAttribute('pattern')) input.setAttribute('pattern', this.getAttribute('pattern')!);

      this._field = input;
    }

    // Label Logic
    const labelText = this.getAttribute('label');
    const labelPos = this.getAttribute('label-position') || 'top';

    if (labelText) {
      const labelEl = document.createElement('label');
      labelEl.className = 'k-input__label';
      labelEl.textContent = sanitizeText(labelText);
      this._labelEl = labelEl;

      if (tokens.variant === 'floating-label') {
        if (!isOtp) wrapper.appendChild(this._field!);
        wrapper.appendChild(labelEl);
      } else if (labelPos === 'top') {
        fieldGroup.appendChild(labelEl);
        if (!isOtp) wrapper.appendChild(this._field!);
      } else {
        if (!isOtp) wrapper.appendChild(this._field!);
        // Label will be appended to fieldGroup after wrapper
      }
    } else {
      if (!isOtp) wrapper.appendChild(this._field!);
    }

    // Addons for 'with-addon' variant
    if (tokens.variant === 'with-addon') {
      const addonLeft = this.getAttribute('addonLeft');
      const addonRight = this.getAttribute('addonRight');

      if (addonLeft) {
        const leftEl = document.createElement('div');
        leftEl.className = 'k-input__addon k-input__addon-left';
        leftEl.textContent = sanitizeText(addonLeft);
        wrapper.insertBefore(leftEl, wrapper.firstChild);
      }

      if (addonRight) {
        const rightEl = document.createElement('div');
        rightEl.className = 'k-input__addon k-input__addon-right';
        rightEl.textContent = sanitizeText(addonRight);
        wrapper.appendChild(rightEl);
      }
    }

    // Icon Right / Password Toggle / Search Clear
    const rightIcon = this.getAttribute('iconRight');
    const typeAttr = this.getAttribute('type');
    const isSearch = tokens.variant === 'search' || typeAttr === 'search';
    const isPwd = tokens.variant === 'password' || typeAttr === 'password';

    if (rightIcon || isSearch || isPwd) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'k-input__icon-right';

      if (isPwd) {
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'k-input__password-toggle';
        toggle.innerHTML = getIcon('eye');
        toggle.setAttribute('aria-label', 'Show password');
        toggle.onclick = () => this._togglePasswordVisibility();
        iconWrap.appendChild(toggle);
        this._pwdToggle = toggle;
      } else if (isSearch) {
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'k-input__clear-btn';
        clearBtn.innerHTML = getIcon('close');
        clearBtn.style.display = 'none';
        clearBtn.setAttribute('aria-label', 'Clear search');
        clearBtn.onclick = () => {
          this.value = '';
          this._field?.focus();
        };
        iconWrap.appendChild(clearBtn);
        this._clearBtn = clearBtn;
      } else if (rightIcon) {
        iconWrap.innerHTML = getIcon(rightIcon as IconName);
      }
      wrapper.appendChild(iconWrap);
    }

    // Now assemble fieldGroup
    fieldGroup.appendChild(wrapper);

    if (labelText && labelPos === 'bottom') {
      fieldGroup.appendChild(this._labelEl!);
    }

    this.appendChild(fieldGroup);
    this._wrapper = wrapper;

    // Apply label position to host for CSS
    this.setAttribute('data-label-position', labelPos);

    // Initial visibility check for search clear button
    this._updateClearButtonVisibility();

    // Hint/Error
    const hintText = this.getAttribute('hint');
    if (hintText) {
      const hintEl = document.createElement('span');
      hintEl.className = 'k-input__hint';
      hintEl.textContent = sanitizeText(hintText);
      fieldGroup.appendChild(hintEl);
      this._hintEl = hintEl;
    }

    // Password Requirements Preview
    if (tokens.variant === 'password' || this.getAttribute('type') === 'password') {
      this._renderPasswordRequirements(fieldGroup);
    }
  }

  private _renderPasswordRequirements(container: HTMLElement): void {
    const rule = VALIDATION_RULES.password;
    const reqsContainer = document.createElement('div');
    reqsContainer.className = 'k-input__pwd-reqs';

    this._reqItems = rule.requirements.map(req => {
      const item = document.createElement('div');
      item.className = 'k-input__req-item';
      item.textContent = req.label;
      item.setAttribute('data-met', 'false');
      reqsContainer.appendChild(item);
      return item;
    });

    container.appendChild(reqsContainer);
  }

  private _updatePasswordRequirements(): void {
    const val = this.value;
    const rule = VALIDATION_RULES.password;

    rule.requirements.forEach((req, i) => {
      const met = req.test(val);
      const item = this._reqItems[i];
      if (item) {
        item.setAttribute('data-met', String(met));
      }
    });
  }

  private _updateClearButtonVisibility(): void {
    if (!this._clearBtn) return;
    this._clearBtn.style.display = this.value ? 'block' : 'none';
  }

  private _renderOtpFields(container: HTMLElement): void {
    const otpContainer = document.createElement('div');
    otpContainer.className = 'k-input__otp-group';
    otpContainer.style.display = 'flex';
    otpContainer.setAttribute('role', 'group');

    const labelText = this.getAttribute('label');
    if (labelText) {
      otpContainer.setAttribute('aria-label', sanitizeText(labelText));
    }

    const fields: HTMLInputElement[] = [];
    for (let i = 0; i < 6; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'k-input__field';
      input.maxLength = 1;
      input.id = `${this._id}-otp-${i}`;
      input.setAttribute('aria-label', `Digit ${i + 1} of 6`);

      input.oninput = (e) => {
        const target = e.target as HTMLInputElement;
        if (target.value) {
          const next = fields[i + 1];
          if (next) next.focus();
        }
        this._dispatch('input', { value: this.value });
        this._dispatch('change', { value: this.value });
        this._updateClearButtonVisibility();
        this._validate();
      };

      input.onkeydown = (e) => {
        const target = e.target as HTMLInputElement;
        if (e.key === 'Backspace' && !target.value) {
          const prev = fields[i - 1];
          if (prev) prev.focus();
        }
      };

      fields.push(input);
      otpContainer.appendChild(input);
    }

    otpContainer.onpaste = (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData?.getData('text') || '';
      const digits = pasteData.replace(/\\D/g, '').slice(0, 6).split('');

      digits.forEach((digit, i) => {
        if (fields[i]) fields[i].value = digit;
      });

      const lastIdx = Math.min(digits.length, 5);
      const targetField = fields[lastIdx];
      if (targetField) {
        targetField.focus();
      }

      this._dispatch('input', { value: this.value });
      this._dispatch('change', { value: this.value });
      this._updateClearButtonVisibility();
      this._validate();
    };

    container.appendChild(otpContainer);
    this._otpFields = fields;
    this._field = fields[0] ?? null;
  }

  private _togglePasswordVisibility(): void {
    if (!this._field || !(this._field instanceof HTMLInputElement)) return;
    const isPassword = this._field.type === 'password';
    this._field.setAttribute('type', isPassword ? 'text' : 'password');

    if (this._pwdToggle) {
      this._pwdToggle.innerHTML = getIcon(isPassword ? 'eye-off' : 'eye');
      this._pwdToggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      this._pwdToggle.style.opacity = isPassword ? '1' : '0.6';
    }
  }

  protected _applyAccessibility(): void {
    if (!this._field) return;

    const tokens = this._getTokens();
    const id = this._id;
    this._field.id = id;

    if (this._labelEl) {
      this._labelEl.setAttribute('for', id);
    }

    if (this.getAttribute('data-error')) {
      this._field.setAttribute('aria-invalid', 'true');
      if (this._hintEl) {
        this._hintEl.id = `${id}-hint`;
        this._field.setAttribute('aria-describedby', `${id}-hint`);
      }
    } else {
      this._field.removeAttribute('aria-invalid');
    }

    // For OTP, the group itself should be described by the hint/error
    if (tokens.variant === 'otp' && this._wrapper) {
      const otpGroup = this._wrapper.querySelector('.k-input__otp-group');
      if (otpGroup && this._hintEl) {
        this._hintEl.id = `${id}-hint`;
        otpGroup.setAttribute('aria-describedby', `${id}-hint`);
      }
    }

    this._field.disabled = tokens.disabled;
    this._field.setAttribute('aria-busy', String(tokens.loading));
  }

  private _validate(): void {
    if (!this._field) return;

    const type = this._field instanceof HTMLInputElement ? this._field.type : 'text';
    const val = this.value;
    let isValid = true;
    let errorMessage = this.getAttribute('validation-message') || '';

    // Handle optionality
    if (!val && !this._field.required) {
      this.removeAttribute('data-error');
      if (this._hintEl) this._hintEl.textContent = this.getAttribute('hint') || '';
      return;
    }

    // 1. Determine which rule to use
    let rule;
    if (this._getTokens().variant === 'otp') {
      rule = VALIDATION_RULES.otp;
    } else {
      rule = VALIDATION_RULES[type as keyof typeof VALIDATION_RULES] || VALIDATION_RULES.text;
    }

    // 2. Check for user-provided custom pattern
    const customPattern = this.getAttribute('pattern');
    if (customPattern) {
      const regex = new RegExp(customPattern);
      isValid = regex.test(val);
      if (!isValid && !errorMessage) {
        errorMessage = 'Input does not match the required format.';
      }
    } else if (rule) {
      isValid = rule.pattern.test(val);
      if (!isValid && !errorMessage) {
        errorMessage = rule.message;
      }

      if (type === 'password') {
        this._updatePasswordRequirements();
      }
    }

    // 3. Final fallback to native HTML5 validation
    if (isValid && this._field instanceof HTMLInputElement) {
      if (!this._field.checkValidity()) {
        isValid = false;
        if (!errorMessage) errorMessage = this._field.validationMessage;
      }
    }

    if (!isValid) {
      this.setAttribute('data-error', 'true');
      if (this._hintEl) {
        this._hintEl.textContent = errorMessage;
      }
    } else {
      this.removeAttribute('data-error');
      if (this._hintEl) {
        this._hintEl.textContent = this.getAttribute('hint') || '';
      }
    }

    this._applyAccessibility();
  }

  protected _attachEventListeners(): void {
    if (!this._field) return;

    const handleInput = () => {
      this._updateClearButtonVisibility();
      this._dispatch('input', { value: this.value });
      this._validate();
    };
    const handleChange = () => {
      this._dispatch('change', { value: this.value });
      this._validate();
    };

    this._field.addEventListener('input', handleInput);
    this._field.addEventListener('change', handleChange);
    this._field.addEventListener('blur', () => this._validate());
  }

  protected _detachEventListeners(): void {
    if (!this._field) return;
  }
}

customElements.define('k-input', KInputElement);
