/**
 * KInputElement — <k-input> Web Custom Element.
 *
 * Usage:
 *   <k-input v="outlined md" label="Email" placeholder="Enter email" name="email" required></k-input>
 *   <k-input v="filled lg error" label="Username" hint="Username is required" name="user"></k-input>
 *   <k-input v="password" label="Password" name="pw"></k-input>
 *   <k-input v="otp" label="Verification Code" name="code"></k-input>
 *   <k-input v="textarea" label="Comments" name="comments"></k-input>
 *   <k-input v="with-addon" addonLeft="https://" addonRight=".com" name="domain"></k-input>
 *
 * Features (P0/P1 sprint):
 *   - Form-associated: name, form, formaction, formenctype, formmethod,
 *     formnovalidate, formtarget, value, defaultValue, disabled, required
 *     all bridge to the inner field so <form> submission works.
 *   - Standard HTML attribute bridging: inputmode, autocomplete, enterkeyhint,
 *     spellcheck, autofocus, readonly, min, max, step, maxlength, minlength,
 *     dirname, list, multiple, accept, rows, cols, wrap.
 *   - Validation with k:invalid / k:valid events and k:complete for OTP.
 *   - Loading state renders <k-loader>; valid state renders a green check.
 *   - `error` attribute (boolean) sets data-error + aria-invalid.
 *   - RTL handled via [dir="rtl"] CSS rules in input.css.
 *   - `formAssociated = true` via ElementInternals where supported.
 */

import { KBaseElement } from '../KBaseElement.js';
import { sanitizeText } from '../../core/utils/sanitize.js';
import { getIcon } from '../../core/icons.js';
import type { IconName } from '../../core/icons.js';

// Side-effect import: ensures <k-loader> is registered before we instantiate it
// in the loading state. KLoaderElement is registered in src/vanilla/Loader/.
import '../Loader/KLoaderElement.js';

/**
 * Professional validation rules and their default error messages.
 * Each rule has a regex pattern and an optional requirements checklist
 * (used by the password variant).
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
    ],
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
  },
} as const;

/** Attributes bridged from the host <k-input> to the inner native <input>/<textarea>. */
const BRIDGED_FORM_ATTRS = [
  'name', 'form', 'formaction', 'formenctype', 'formmethod',
  'formnovalidate', 'formtarget', 'dirname', 'list',
] as const;

/** Standard HTML attributes that should pass through to the inner field. */
const BRIDGED_INPUT_ATTRS = [
  'inputmode', 'autocomplete', 'enterkeyhint', 'spellcheck',
  'min', 'max', 'step', 'multiple', 'accept', 'size',
  'maxlength', 'minlength',
] as const;

/** Textarea-only attributes (only bridged when variant === 'textarea'). */
const BRIDGED_TEXTAREA_ATTRS = ['rows', 'cols', 'wrap'] as const;

/** Threshold (in characters) at which the maxlength counter turns warning yellow. */
const COUNTER_WARN_THRESHOLD = 0.8;

export class KInputElement extends KBaseElement {
  // ─── Form-Associated Custom Element ────────────────────────────────────
  // Set when ElementInternals is available (Chrome 77+, FF 98+, Safari 16.4+).
  // When unavailable, we fall back to manual form participation below.
  static formAssociated = true;

  private _internals: ElementInternals | null = null;
  private _form: HTMLFormElement | null = null;
  private _onFormReset = (): void => this._handleFormReset();

  // ─── DOM refs ────────────────────────────────────────────────────────────
  private _field: HTMLInputElement | HTMLTextAreaElement | null = null;
  private _otpFields: HTMLInputElement[] = [];
  private _hintEl: HTMLElement | null = null;
  private _labelEl: HTMLElement | null = null;
  private _wrapper: HTMLElement | null = null;
  private _counterEl: HTMLElement | null = null;
  private _validIconEl: HTMLElement | null = null;
  private _loaderEl: HTMLElement | null = null;
  private _id: string = '';
  private _pwdToggle: HTMLButtonElement | null = null;
  private _reqItems: HTMLElement[] = [];

  // ─── Internal state ─────────────────────────────────────────────────────
  /** Default value captured at first render; used to reset the form properly. */
  private _defaultValue = '';
  /** Whether the user has interacted with the field; gates k:invalid/k:valid firing. */
  private _touched = false;
  /** Tracks the previous invalid state for k:invalid/k:valid transition events. */
  private _wasInvalid = false;
  /** Tracks whether the OTP has just become complete; gates k:complete firing. */
  private _wasComplete = false;
  /** Latest externally-set validity — set by the `error` attribute path. */
  private _externalError = false;

  // ─── Public value API ───────────────────────────────────────────────────

  /**
   * The current value of the input.
   * For OTP, this is the combined string of all 6 fields.
   */
  get value(): string {
    if (this._getTokens().variant === 'otp') {
      return this._otpFields.map((f) => f.value).join('');
    }
    return this._field?.value ?? '';
  }

  set value(val: string) {
    if (this._getTokens().variant === 'otp') {
      const digits = String(val ?? '').split('').slice(0, 6);
      this._otpFields.forEach((field, i) => {
        field.value = digits[i] || '';
      });
    } else if (this._field) {
      this._field.value = String(val ?? '');
    }
    this._updateValidState();
    this._updateCounter();
  }

  /** The form the input is associated with — read-only. */
  get form(): HTMLFormElement | null {
    return this._form;
  }

  /** The validity state of the inner field (or false if no field). */
  get validity(): ValidityState | boolean {
    if (!this._field) return false;
    return (this._field as HTMLInputElement).validity ?? false;
  }

  /** The validation message, or empty string. */
  get validationMessage(): string {
    if (!this._field) return '';
    return (this._field as HTMLInputElement).validationMessage ?? '';
  }

  /** Native validity check, falling back to true when no field exists. */
  checkValidity(): boolean {
    if (!this._field) return true;
    return (this._field as HTMLInputElement).checkValidity?.() ?? true;
  }

  /** Report validity to the user (same API as the native input). */
  reportValidity(): boolean {
    if (!this._field) return true;
    return (this._field as HTMLInputElement).reportValidity?.() ?? true;
  }

  /** Form-Associated Custom Element API — required for formAssociated. */
  // (Declared on the class via the static property `formAssociated = true` above.)

  // ─── Observed attributes ────────────────────────────────────────────────

  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      // Original attributes
      'label', 'placeholder', 'data-error', 'hint', 'icon', 'iconRight',
      'type', 'validation-message', 'pattern', 'required', 'addonLeft',
      'addonRight', 'label-position',
      // P0.2 — Form bridging
      ...BRIDGED_FORM_ATTRS,
      'value', 'defaultValue', 'checked', 'defaultChecked', 'disabled',
      // P1.4 — Error attribute (separate from data-error which is also observed)
      'error',
      // P1.9 — Standard HTML attributes
      ...BRIDGED_INPUT_ATTRS,
      ...BRIDGED_TEXTAREA_ATTRS,
      'autofocus', 'readonly', 'showcounter',
    ];
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────

  connectedCallback(): void {
    // Acquire ElementInternals if the browser supports form-associated custom elements.
    if (typeof this.attachInternals === 'function') {
      try {
        this._internals = this.attachInternals();
      } catch {
        // Some browsers throw if called more than once; ignore.
        this._internals = null;
      }
    }
    this._resolveForm();
    super.connectedCallback();
    this._applyStandardAttributes();
    this._handleAutofocus();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._form) {
      this._form.removeEventListener('reset', this._onFormReset);
    }
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    super.attributeChangedCallback(name, oldVal, newVal);

    // P1.4 — handle the `error` attribute (separate from data-error)
    if (name === 'error') {
      this._externalError = newVal !== null && newVal !== 'false';
      this._applyErrorState();
    }

    // P0.2 — re-resolve form when the `form` attribute changes
    if (name === 'form' && oldVal !== newVal) {
      this._resolveForm();
    }

    // P1.9 — bridge any standard attribute change to the inner field
    if (this._field && (
      (BRIDGED_FORM_ATTRS as readonly string[]).includes(name) ||
      (BRIDGED_INPUT_ATTRS as readonly string[]).includes(name) ||
      (BRIDGED_TEXTAREA_ATTRS as readonly string[]).includes(name) ||
      name === 'readonly' || name === 'maxlength' || name === 'minlength'
    )) {
      this._bridgeAttribute(name, newVal);
    }

    // The disabled flag also needs to mirror to the field
    if (name === 'disabled' && this._field) {
      this._field.disabled = newVal !== null && newVal !== 'false';
    }
  }

  // ─── Main render ────────────────────────────────────────────────────────

  protected _render(): void {
    if (this._wrapper) return;

    const tokens = this._getTokens();
    const isTextarea = tokens.variant === 'textarea';
    const isOtp = tokens.variant === 'otp';

    // Stable ID for the lifetime of the element
    this._id = `k-input-${Math.random().toString(36).substring(2, 11)}`;

    // Capture default value BEFORE any programmatic value writes
    const initialValue = this.getAttribute('value') ?? this.getAttribute('defaultValue') ?? '';
    this._defaultValue = initialValue;

    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'k-input__field-group';

    const wrapper = document.createElement('div');
    wrapper.className = 'k-input__wrapper';

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
      if (initialValue) input.value = initialValue;

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

      // Native form-related attributes
      if (this.getAttribute('required')) {
        input.required = true;
        input.setAttribute('aria-required', 'true');
      }
      if (this.getAttribute('pattern')) input.setAttribute('pattern', this.getAttribute('pattern')!);
      if (this.getAttribute('readonly')) {
        input.readOnly = true;
        input.setAttribute('aria-readonly', 'true');
      }

      // Bridge all standard HTML attributes
      this._bridgeAllAttributes(input);

      this._field = input;
    }

    // Label
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
      }
    } else {
      if (!isOtp) wrapper.appendChild(this._field!);
    }

    // Addons
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

    // Right-side icon area (password toggle or user iconRight)
    const rightIcon = this.getAttribute('iconRight');
    const typeAttr = this.getAttribute('type');
    const isPwd = tokens.variant === 'password' || typeAttr === 'password';

    if (rightIcon || isPwd) {
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
      } else if (rightIcon) {
        iconWrap.innerHTML = getIcon(rightIcon as IconName);
      }
      wrapper.appendChild(iconWrap);
    }

    // Valid-state check icon (shown when field passes validation; P1.8)
    // Skip for variants with right-side UI already (password, otp, with-addon, or when iconRight is set)
    const hasRightUi = isPwd || rightIcon || tokens.variant === 'otp' || tokens.variant === 'with-addon';
    if (!hasRightUi) {
      const validIcon = document.createElement('span');
      validIcon.className = 'k-input__valid-icon';
      validIcon.setAttribute('aria-hidden', 'true');
      validIcon.innerHTML = getIcon('check');
      wrapper.appendChild(validIcon);
      this._validIconEl = validIcon;
    }

    // Loader overlay (P1.7)
    if (tokens.loading) {
      this._showLoader(wrapper);
    }

    fieldGroup.appendChild(wrapper);

    if (labelText && labelPos === 'bottom') {
      fieldGroup.appendChild(this._labelEl!);
    }

    this.appendChild(fieldGroup);
    this._wrapper = wrapper;

    this.setAttribute('data-label-position', labelPos);

    // Hint
    const hintText = this.getAttribute('hint');
    if (hintText) {
      const hintEl = document.createElement('span');
      hintEl.className = 'k-input__hint';
      hintEl.textContent = sanitizeText(hintText);
      fieldGroup.appendChild(hintEl);
      this._hintEl = hintEl;
    }

    // Maxlength counter (P1.9)
    if (this.hasAttribute('maxlength') || this.hasAttribute('showcounter')) {
      const counter = document.createElement('span');
      counter.className = 'k-input__counter';
      fieldGroup.appendChild(counter);
      this._counterEl = counter;
      this._updateCounter();
    }

    // Password requirements checklist
    if (tokens.variant === 'password' || this.getAttribute('type') === 'password') {
      this._renderPasswordRequirements(fieldGroup);
    }

    // Apply error attribute (P1.4)
    this._applyErrorState();

    // Sync with ElementInternals so the form sees this field
    if (this._internals) {
      try {
        this._internals.setFormValue(this.value);
      } catch {
        // ignore — some browsers reject empty values during initial render
      }
    }
  }

  // ─── Form integration helpers ──────────────────────────────────────────

  private _resolveForm(): void {
    if (this._form) {
      this._form.removeEventListener('reset', this._onFormReset);
      this._form = null;
    }
    const formId = this.getAttribute('form');
    let form: HTMLFormElement | null = null;
    if (formId) {
      form = document.getElementById(formId) as HTMLFormElement | null;
    } else {
      form = this.closest('form');
    }
    if (form) {
      this._form = form;
      this._form.addEventListener('reset', this._onFormReset);
    }
  }

  private _handleFormReset(): void {
    if (this._getTokens().variant === 'otp') {
      this._otpFields.forEach((f) => (f.value = ''));
    } else if (this._field) {
      this._field.value = this._defaultValue;
    }
    this._touched = false;
    this._wasInvalid = false;
    this._wasComplete = false;
    this.removeAttribute('data-error');
    this.removeAttribute('data-valid');
    this._updateCounter();
    this._updateValidState();
  }

  // ─── Error state (P1.4) ─────────────────────────────────────────────────

  private _applyErrorState(): void {
    // External error (from the `error` attribute) takes precedence over validation
    if (this._externalError) {
      this.setAttribute('data-error', 'true');
    } else if (!this._touched) {
      // Don't show error on initial render; only after user interaction
      this.removeAttribute('data-error');
    }
  }

  // ─── Standard attribute bridging (P1.9) ─────────────────────────────────

  private _applyStandardAttributes(): void {
    if (!this._field) return;
    this._bridgeAllAttributes(this._field);
  }

  private _bridgeAllAttributes(field: HTMLInputElement | HTMLTextAreaElement): void {
    const isTextarea = field instanceof HTMLTextAreaElement;
    for (const attr of BRIDGED_FORM_ATTRS) {
      this._bridgeAttribute(attr, this.getAttribute(attr), field);
    }
    for (const attr of BRIDGED_INPUT_ATTRS) {
      this._bridgeAttribute(attr, this.getAttribute(attr), field);
    }
    if (isTextarea) {
      for (const attr of BRIDGED_TEXTAREA_ATTRS) {
        this._bridgeAttribute(attr, this.getAttribute(attr), field);
      }
    }
  }

  private _bridgeAttribute(
    name: string,
    value: string | null,
    target: HTMLInputElement | HTMLTextAreaElement | null = this._field,
  ): void {
    if (!target) return;
    if (value === null || value === '') {
      target.removeAttribute(name);
    } else {
      target.setAttribute(name, value);
    }
  }

  // ─── Autofocus ──────────────────────────────────────────────────────────

  private _handleAutofocus(): void {
    if (this.hasAttribute('autofocus') && this._field) {
      // Defer to next microtask so we don't steal focus during initial page render
      // (which can break scroll restoration and surprise assistive tech).
      queueMicrotask(() => {
        // Only autofocus if no element is currently focused (prevents stealing)
        if (document.activeElement === document.body || !document.activeElement) {
          this._field?.focus({ preventScroll: false });
        }
      });
    }
  }

  // ─── Loading state (P1.7) ───────────────────────────────────────────────

  private _showLoader(parent: HTMLElement): void {
    if (this._loaderEl) return;
    const tokens = this._getTokens();
    const loaderVariant = tokens.loader || 'spinner';

    const wrapper = document.createElement('div');
    wrapper.className = 'k-input__loader';
    wrapper.setAttribute('aria-hidden', 'true');

    const loader = document.createElement('k-loader');
    loader.setAttribute('v', `${loaderVariant} sm`);

    wrapper.appendChild(loader);
    parent.appendChild(wrapper);
    this._loaderEl = wrapper;
  }

  private _hideLoader(): void {
    if (this._loaderEl) {
      this._loaderEl.remove();
      this._loaderEl = null;
    }
  }

  // ─── Valid state (P1.8) ─────────────────────────────────────────────────

  private _updateValidState(): void {
    if (!this._field) return;
    const tokens = this._getTokens();
    const typeAttr = this.getAttribute('type');
    const isPwd = tokens.variant === 'password' || typeAttr === 'password';
    const rightIcon = this.getAttribute('iconRight');
    // Skip valid state for variants with right-side UI already (password, otp, with-addon, or when iconRight is set)
    const hasRightUi = isPwd || rightIcon || tokens.variant === 'otp' || tokens.variant === 'with-addon';
    if (hasRightUi) {
      this.removeAttribute('data-valid');
      return;
    }
    const val = this.value;
    if (!val) {
      this.removeAttribute('data-valid');
      return;
    }
    if (this._field instanceof HTMLInputElement) {
      // For typed inputs, defer to the native validity
      if (this._field.checkValidity() && !this._externalError && !this.hasAttribute('data-error')) {
        this.setAttribute('data-valid', 'true');
      } else {
        this.removeAttribute('data-valid');
      }
    } else {
      // For textarea, just check non-empty when required
      if (!this._externalError && !this.hasAttribute('data-error')) {
        this.setAttribute('data-valid', 'true');
      } else {
        this.removeAttribute('data-valid');
      }
    }
  }

  // ─── Maxlength counter (P1.9) ───────────────────────────────────────────

  private _updateCounter(): void {
    if (!this._counterEl) return;
    const max = Number(this.getAttribute('maxlength') || 0);
    if (!max) {
      this._counterEl.textContent = '';
      return;
    }
    const current = this.value.length;
    this._counterEl.textContent = `${current} / ${max}`;
    this._counterEl.classList.toggle('k-input__counter--warn', current / max >= COUNTER_WARN_THRESHOLD);
  }

  // ─── OTP rendering (P1.6) ───────────────────────────────────────────────

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
      input.setAttribute('inputmode', 'numeric');
      input.setAttribute('autocomplete', 'one-time-code');

      const onOtpChange = (): void => {
        this._dispatch('input', { value: this.value });
        this._dispatch('change', { value: this.value });
        this._validate();
        this._checkOtpComplete();
        if (this._internals) this._internals.setFormValue(this.value);
      };

      input.oninput = (e) => {
        const target = e.target as HTMLInputElement;
        // Strip non-digits (defense in depth — maxlength=1 should prevent this)
        target.value = target.value.replace(/\D/g, '');
        if (target.value) {
          const next = fields[i + 1];
          if (next) next.focus();
        }
        onOtpChange();
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
      const digits = pasteData.replace(/\D/g, '').slice(0, 6).split('');

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
      this._validate();
      this._checkOtpComplete();
      if (this._internals) this._internals.setFormValue(this.value);
    };

    container.appendChild(otpContainer);
    this._otpFields = fields;
    this._field = fields[0] ?? null;
  }

  /** P1.6 — fires k:complete on the rising edge of all-6-digits-filled. */
  private _checkOtpComplete(): void {
    const isComplete = this.value.length === 6;
    if (isComplete && !this._wasComplete) {
      this._dispatch('complete', { value: this.value });
    }
    this._wasComplete = isComplete;
  }

  // ─── Password requirements checklist ───────────────────────────────────

  private _renderPasswordRequirements(container: HTMLElement): void {
    const rule = VALIDATION_RULES.password;
    const reqsContainer = document.createElement('div');
    reqsContainer.className = 'k-input__pwd-reqs';

    this._reqItems = rule.requirements.map((req) => {
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
      if (item) item.setAttribute('data-met', String(met));
    });
  }

  // ─── Password visibility toggle ────────────────────────────────────────

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

  // ─── Accessibility (A11y) ───────────────────────────────────────────────

  protected _applyAccessibility(): void {
    if (!this._field) return;

    const tokens = this._getTokens();
    const id = this._id;
    this._field.id = id;

    if (this._labelEl) {
      this._labelEl.setAttribute('for', id);
    }

    const inError = this.hasAttribute('data-error');
    if (inError) {
      this._field.setAttribute('aria-invalid', 'true');
      if (this._hintEl) {
        this._hintEl.id = `${id}-hint`;
        this._field.setAttribute('aria-describedby', `${id}-hint`);
      }
    } else {
      this._field.removeAttribute('aria-invalid');
    }

    if (tokens.variant === 'otp' && this._wrapper) {
      const otpGroup = this._wrapper.querySelector('.k-input__otp-group');
      if (otpGroup && this._hintEl) {
        this._hintEl.id = `${id}-hint`;
        otpGroup.setAttribute('aria-describedby', `${id}-hint`);
      }
    }

    this._field.disabled = tokens.disabled;
    this._field.setAttribute('aria-busy', String(tokens.loading));

    // Loading state visual (P1.7)
    if (this._wrapper) {
      if (tokens.loading) {
        this._showLoader(this._wrapper);
      } else {
        this._hideLoader();
      }
    }
  }

  // ─── Validation + k:invalid / k:valid (P1.5) ────────────────────────────

  private _validate(): void {
    if (!this._field) return;

    // External error overrides validation
    if (this._externalError) {
      this.setAttribute('data-error', 'true');
      return;
    }

    const isOtpVariant = this._getTokens().variant === 'otp';
    const type = this._field instanceof HTMLInputElement ? this._field.type : 'text';
    const val = this.value;
    let isValid = true;
    let errorMessage = this.getAttribute('validation-message') || '';

    // Mark as touched (gates k:invalid/k:valid)
    this._touched = true;

    // Required + empty: skip unless externally required
    if (!val && !this._field.required) {
      this.removeAttribute('data-error');
      if (this._hintEl) this._hintEl.textContent = this.getAttribute('hint') || '';
      this._emitValidityChange(false, val);
      this._updateValidState();
      return;
    }

    // Determine the rule
    let rule;
    if (isOtpVariant) {
      rule = VALIDATION_RULES.otp;
    } else {
      rule = VALIDATION_RULES[type as keyof typeof VALIDATION_RULES] || VALIDATION_RULES.text;
    }

    // Custom pattern takes precedence
    const customPattern = this.getAttribute('pattern');
    if (customPattern) {
      const regex = new RegExp(customPattern);
      isValid = regex.test(val);
      if (!isValid && !errorMessage) errorMessage = 'Input does not match the required format.';
    } else if (rule) {
      isValid = rule.pattern.test(val);
      if (!isValid && !errorMessage) errorMessage = rule.message;
      if (type === 'password') this._updatePasswordRequirements();
    }

    // Native HTML5 fallback
    if (isValid && this._field instanceof HTMLInputElement) {
      if (!this._field.checkValidity()) {
        isValid = false;
        if (!errorMessage) errorMessage = this._field.validationMessage;
      }
    }

    if (!isValid) {
      this.setAttribute('data-error', 'true');
      if (this._hintEl) this._hintEl.textContent = errorMessage;
    } else {
      this.removeAttribute('data-error');
      if (this._hintEl) this._hintEl.textContent = this.getAttribute('hint') || '';
    }

    this._emitValidityChange(!isValid, val);
    this._updateValidState();
  }

  /** P1.5 — dispatch k:invalid / k:valid on transitions. */
  private _emitValidityChange(nowInvalid: boolean, value: string): void {
    if (nowInvalid && !this._wasInvalid) {
      const validity = this._field instanceof HTMLInputElement ? this._field.validity : null;
      this._dispatch('invalid', { value, validity, validationMessage: this.validationMessage });
    } else if (!nowInvalid && this._wasInvalid) {
      this._dispatch('valid', { value });
    }
    this._wasInvalid = nowInvalid;
  }

  // ─── Event wiring ──────────────────────────────────────────────────────

  protected _attachEventListeners(): void {
    if (!this._field) return;

    const handleInput = (): void => {
      this._touched = true;
      this._dispatch('input', { value: this.value });
      this._validate();
      this._updateCounter();
      if (this._internals) this._internals.setFormValue(this.value);
    };

    const handleChange = (): void => {
      this._dispatch('change', { value: this.value });
      this._validate();
    };

    const handleBlur = (): void => {
      this._touched = true;
      this._validate();
      this._dispatch('blur', { value: this.value });
    };

    const handleFocus = (): void => {
      this._dispatch('focus', { value: this.value });
    };

    this._field.addEventListener('input', handleInput);
    this._field.addEventListener('change', handleChange);
    this._field.addEventListener('blur', handleBlur);
    this._field.addEventListener('focus', handleFocus);
  }

  protected _detachEventListeners(): void {
    if (!this._field) return;
    // The browser handles listener cleanup when the field is removed
  }
}

customElements.define('k-input', KInputElement);
