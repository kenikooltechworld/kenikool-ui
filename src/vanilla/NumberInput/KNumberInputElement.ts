/**
 * KNumberInputElement — <k-number-input> Web Custom Element.
 *
 * Usage:
 *   <k-number-input v="outlined md" label="Quantity" min="1" max="100"></k-number-input>
 *   <k-number-input v="filled lg step-5 buttons-inline" label="Price" prefix="$" precision="2"></k-number-input>
 *   <k-number-input v="outlined md separator buttons-separate" label="Population" step="1000"></k-number-input>
 *
 * Features:
 *   - Increment/decrement buttons built into the input (vertically stacked on the right)
 *   - Keyboard shortcuts: ↑/↓ (step), Page Up/Down (step * 10), Home (min), End (max)
 *   - Min/max enforcement with visual feedback
 *   - Step intervals (integers or decimals)
 *   - Decimal precision control
 *   - Thousand separators (via `separator` token)
 *   - Currency prefix/suffix (via `prefix`/`suffix` attributes)
 *   - All standard input features: variants, sizes, colors, validation, loading, disabled, error, etc.
 *   - Form-associated: name, form, value, disabled, required all work with native form submission
 *   - Full accessibility: ARIA attributes, keyboard navigation, screen reader support
 */

import { KBaseElement } from '../KBaseElement.js';
import { sanitizeText } from '../../core/utils/sanitize.js';
import { getIcon } from '../../core/icons.js';

// Side-effect import: ensures <k-loader> is registered
import '../Loader/KLoaderElement.js';

export class KNumberInputElement extends KBaseElement {
  // ─── Form-Associated Custom Element ────────────────────────────────────
  static formAssociated = true;

  private _internals: ElementInternals | null = null;
  private _form: HTMLFormElement | null = null;
  private _onFormReset = (): void => this._handleFormReset();

  // ─── DOM refs ────────────────────────────────────────────────────────────
  private _field: HTMLInputElement | null = null;
  private _hintEl: HTMLElement | null = null;
  private _labelEl: HTMLElement | null = null;
  private _wrapper: HTMLElement | null = null;
  private _validIconEl: HTMLElement | null = null;
  private _loaderEl: HTMLElement | null = null;
  private _incrementBtn: HTMLButtonElement | null = null;
  private _decrementBtn: HTMLButtonElement | null = null;
  private _buttonsContainer: HTMLElement | null = null;
  private _prefixEl: HTMLElement | null = null;
  private _suffixEl: HTMLElement | null = null;
  private _id: string = '';

  // ─── Internal state ─────────────────────────────────────────────────────
  private _defaultValue = '';
  private _touched = false;
  private _wasInvalid = false;
  private _externalError = false;

  // ─── Configuration ──────────────────────────────────────────────────────
  private _min: number | null = null;
  private _max: number | null = null;
  private _step = 1;
  private _precision = 0;
  private _useSeparator = false;

  // ─── Public value API ───────────────────────────────────────────────────

  /**
   * The current numeric value.
   * Returns null if the field is empty or contains invalid input.
   */
  get value(): number | null {
    if (!this._field) return null;
    const rawValue = this._field.value.replace(/,/g, ''); // Strip separators
    if (rawValue === '' || rawValue === '-') return null;
    const num = parseFloat(rawValue);
    return isNaN(num) ? null : num;
  }

  set value(val: number | null) {
    if (!this._field) return;
    if (val === null || val === undefined) {
      this._field.value = '';
    } else {
      const clamped = this._clamp(val);
      const formatted = this._formatNumber(clamped);
      this._field.value = formatted;
    }
    this._updateButtonStates();
    this._updateValidState();
    if (this._internals) {
      this._internals.setFormValue(this._field.value);
    }
  }

  /** The form the input is associated with — read-only. */
  get form(): HTMLFormElement | null {
    return this._form;
  }

  /** Native validity check. */
  checkValidity(): boolean {
    if (!this._field) return true;
    return this._field.checkValidity();
  }

  /** Report validity to the user. */
  reportValidity(): boolean {
    if (!this._field) return true;
    return this._field.reportValidity();
  }

  // ─── Observed attributes ────────────────────────────────────────────────

  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      'label', 'placeholder', 'hint', 'label-position',
      'name', 'form', 'value', 'defaultValue', 'disabled', 'required',
      'min', 'max', 'step', 'precision', 'prefix', 'suffix', 'icon',
      'error', 'validation-message', 'autofocus', 'readonly',
    ];
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────

  connectedCallback(): void {
    if (typeof this.attachInternals === 'function') {
      try {
        this._internals = this.attachInternals();
      } catch {
        this._internals = null;
      }
    }
    this._resolveForm();
    
    // Validate icon attributes - iconRight is not supported
    if (this.hasAttribute('iconRight')) {
      console.warn('[k-number-input] iconRight is not supported. The right side is reserved for increment/decrement buttons. Use "icon" attribute for left icon only.');
      this.removeAttribute('iconRight');
    }
    
    super.connectedCallback();
    this._parseTokens();
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

    if (name === 'error') {
      this._externalError = newVal !== null && newVal !== 'false';
      this._applyErrorState();
    }

    if (name === 'form' && oldVal !== newVal) {
      this._resolveForm();
    }

    if (name === 'disabled' && this._field) {
      this._field.disabled = newVal !== null && newVal !== 'false';
      this._updateButtonStates();
    }

    // Re-parse numeric constraints
    if (['min', 'max', 'step', 'precision'].includes(name)) {
      this._parseTokens();
      this._updateButtonStates();
    }
  }

  // ─── Main render ────────────────────────────────────────────────────────

  protected _render(): void {
    if (this._wrapper) return;

    const tokens = this._getTokens();
    this._parseTokens();

    this._id = `k-number-input-${Math.random().toString(36).substring(2, 11)}`;

    const initialValue = this.getAttribute('value') ?? this.getAttribute('defaultValue') ?? '';
    this._defaultValue = initialValue;

    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'k-number-input__field-group';

    const wrapper = document.createElement('div');
    wrapper.className = 'k-number-input__wrapper';

    // Input field
    const input = document.createElement('input');
    input.type = 'text'; // Use text to allow formatting
    input.inputMode = 'decimal';
    input.className = 'k-number-input__field';
    input.id = this._id;

    const placeholder = this.getAttribute('placeholder') || '';
    input.placeholder = placeholder;

    if (initialValue) {
      const num = parseFloat(initialValue);
      if (!isNaN(num)) {
        input.value = this._formatNumber(num);
      }
    }

    if (this.getAttribute('required')) {
      input.required = true;
      input.setAttribute('aria-required', 'true');
    }

    if (this.getAttribute('readonly')) {
      input.readOnly = true;
      input.setAttribute('aria-readonly', 'true');
    }

    this._field = input;

    // Label
    const labelText = this.getAttribute('label');
    const labelPos = this.getAttribute('label-position') || 'top';

    if (labelText) {
      const labelEl = document.createElement('label');
      labelEl.className = 'k-number-input__label';
      labelEl.textContent = sanitizeText(labelText);
      labelEl.setAttribute('for', this._id);
      this._labelEl = labelEl;

      if (labelPos === 'top') {
        fieldGroup.appendChild(labelEl);
      }
    }

    // Left icon (if provided) - iconRight is not supported
    const iconName = this.getAttribute('icon');
    if (iconName) {
      const iconEl = document.createElement('span');
      iconEl.className = 'k-number-input__icon-left';
      iconEl.innerHTML = getIcon(iconName as any); // User-provided icon name
      iconEl.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(iconEl);
    }

    // Prefix (e.g., "$")
    const prefix = this.getAttribute('prefix');
    if (prefix) {
      const prefixEl = document.createElement('span');
      prefixEl.className = 'k-number-input__prefix';
      prefixEl.textContent = sanitizeText(prefix);
      prefixEl.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(prefixEl);
      this._prefixEl = prefixEl;
    }

    wrapper.appendChild(input);

    // Suffix (e.g., "kg", "%")
    const suffix = this.getAttribute('suffix');
    if (suffix) {
      const suffixEl = document.createElement('span');
      suffixEl.className = 'k-number-input__suffix';
      suffixEl.textContent = sanitizeText(suffix);
      suffixEl.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(suffixEl);
      this._suffixEl = suffixEl;
      // Mark that we have a suffix for CSS styling
      this.setAttribute('data-has-suffix', 'true');
    }

    // Increment/Decrement buttons
    this._renderButtons(wrapper);

    // Valid-state check icon (not shown with buttons inline - visual clutter)
    const showValidIcon = false; // Buttons are always inline
    if (showValidIcon) {
      const validIcon = document.createElement('span');
      validIcon.className = 'k-number-input__valid-icon';
      validIcon.setAttribute('aria-hidden', 'true');
      validIcon.innerHTML = getIcon('check');
      wrapper.appendChild(validIcon);
      this._validIconEl = validIcon;
    }

    // Loader overlay
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
      hintEl.className = 'k-number-input__hint';
      hintEl.textContent = sanitizeText(hintText);
      fieldGroup.appendChild(hintEl);
      this._hintEl = hintEl;
    }

    this._applyErrorState();
    this._updateButtonStates();

    if (this._internals) {
      try {
        this._internals.setFormValue(this._field.value);
      } catch {
        // ignore
      }
    }
  }

  // ─── Button rendering ───────────────────────────────────────────────────

  private _renderButtons(container: HTMLElement): void {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'k-number-input__buttons';

    // Increment button (top)
    const incrementBtn = document.createElement('button');
    incrementBtn.type = 'button';
    incrementBtn.className = 'k-number-input__button k-number-input__button--increment';
    incrementBtn.innerHTML = getIcon('plus');
    incrementBtn.setAttribute('aria-label', 'Increase value');
    incrementBtn.setAttribute('tabindex', '-1');
    incrementBtn.onclick = () => this._increment();
    // Prevent focus loss on the input field
    incrementBtn.onmousedown = (e) => e.preventDefault();
    this._incrementBtn = incrementBtn;

    // Decrement button (bottom)
    const decrementBtn = document.createElement('button');
    decrementBtn.type = 'button';
    decrementBtn.className = 'k-number-input__button k-number-input__button--decrement';
    decrementBtn.innerHTML = getIcon('minus');
    decrementBtn.setAttribute('aria-label', 'Decrease value');
    decrementBtn.setAttribute('tabindex', '-1');
    decrementBtn.onclick = () => this._decrement();
    // Prevent focus loss on the input field
    decrementBtn.onmousedown = (e) => e.preventDefault();
    this._decrementBtn = decrementBtn;

    // Always vertically stacked on the right
    buttonsContainer.appendChild(incrementBtn);
    buttonsContainer.appendChild(decrementBtn);
    container.appendChild(buttonsContainer);

    this._buttonsContainer = buttonsContainer;
  }

  // ─── Token parsing ──────────────────────────────────────────────────────

  private _parseTokens(): void {
    // Parse min/max from attributes (takes precedence over tokens)
    const minAttr = this.getAttribute('min');
    const maxAttr = this.getAttribute('max');
    const stepAttr = this.getAttribute('step');
    const precisionAttr = this.getAttribute('precision');

    this._min = minAttr !== null ? parseFloat(minAttr) : null;
    this._max = maxAttr !== null ? parseFloat(maxAttr) : null;
    this._step = stepAttr !== null ? parseFloat(stepAttr) : 1;
    this._precision = precisionAttr !== null ? parseInt(precisionAttr, 10) : 0;

    // Check for separator token in the raw v attribute
    const vAttr = this.getAttribute('v') || '';
    this._useSeparator = vAttr.includes('separator');
  }

  // ─── Numeric operations ─────────────────────────────────────────────────

  private _increment(): void {
    if (this._field?.disabled || this._field?.readOnly) return;
    const current = this.value ?? 0;
    const newValue = current + this._step;
    this.value = newValue;
    this._field?.focus();
    this._touched = true;
    this._dispatch('change', { value: this.value });
    this._dispatch('increment', { value: this.value });
  }

  private _decrement(): void {
    if (this._field?.disabled || this._field?.readOnly) return;
    const current = this.value ?? 0;
    const newValue = current - this._step;
    this.value = newValue;
    this._field?.focus();
    this._touched = true;
    this._dispatch('change', { value: this.value });
    this._dispatch('decrement', { value: this.value });
  }

  private _clamp(val: number): number {
    let result = val;
    if (this._min !== null && result < this._min) result = this._min;
    if (this._max !== null && result > this._max) result = this._max;
    return result;
  }

  private _formatNumber(num: number): string {
    // Apply precision
    const fixed = num.toFixed(this._precision);

    if (!this._useSeparator) return fixed;

    // Add thousand separators
    const parts = fixed.split('.');
    if (parts[0]) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return parts.join('.');
  }

  private _updateButtonStates(): void {
    if (!this._incrementBtn || !this._decrementBtn) return;

    const current = this.value;
    const disabled = this._field?.disabled || this._field?.readOnly;

    // Disable increment if at max
    if (disabled || (this._max !== null && current !== null && current >= this._max)) {
      this._incrementBtn.disabled = true;
      this._incrementBtn.setAttribute('aria-disabled', 'true');
    } else {
      this._incrementBtn.disabled = false;
      this._incrementBtn.removeAttribute('aria-disabled');
    }

    // Disable decrement if at min
    if (disabled || (this._min !== null && current !== null && current <= this._min)) {
      this._decrementBtn.disabled = true;
      this._decrementBtn.setAttribute('aria-disabled', 'true');
    } else {
      this._decrementBtn.disabled = false;
      this._decrementBtn.removeAttribute('aria-disabled');
    }
  }

  // ─── Form integration ───────────────────────────────────────────────────

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
    if (this._field) {
      const num = parseFloat(this._defaultValue);
      if (!isNaN(num)) {
        this.value = num;
      } else {
        this._field.value = '';
      }
    }
    this._touched = false;
    this._wasInvalid = false;
    this.removeAttribute('data-error');
    this.removeAttribute('data-valid');
    this._updateButtonStates();
    this._updateValidState();
  }

  // ─── Error state ────────────────────────────────────────────────────────

  private _applyErrorState(): void {
    if (this._externalError) {
      this.setAttribute('data-error', 'true');
    } else if (!this._touched) {
      this.removeAttribute('data-error');
    }
  }

  // ─── Autofocus ──────────────────────────────────────────────────────────

  private _handleAutofocus(): void {
    if (this.hasAttribute('autofocus') && this._field) {
      queueMicrotask(() => {
        if (document.activeElement === document.body || !document.activeElement) {
          this._field?.focus({ preventScroll: false });
        }
      });
    }
  }

  // ─── Loading state ──────────────────────────────────────────────────────

  private _showLoader(parent: HTMLElement): void {
    if (this._loaderEl) return;
    const tokens = this._getTokens();
    const loaderVariant = tokens.loader || 'spinner';

    const wrapper = document.createElement('div');
    wrapper.className = 'k-number-input__loader';
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

  // ─── Valid state ────────────────────────────────────────────────────────

  private _updateValidState(): void {
    if (!this._field) return;

    // Don't show valid state - buttons are always inline (visual clutter)
    this.removeAttribute('data-valid');
  }

  // ─── Accessibility ──────────────────────────────────────────────────────

  protected _applyAccessibility(): void {
    if (!this._field) return;

    const tokens = this._getTokens();
    this._field.id = this._id;

    if (this._labelEl) {
      this._labelEl.setAttribute('for', this._id);
    }

    // Add ARIA attributes for min/max
    if (this._min !== null) {
      this._field.setAttribute('aria-valuemin', String(this._min));
    }
    if (this._max !== null) {
      this._field.setAttribute('aria-valuemax', String(this._max));
    }
    if (this.value !== null) {
      this._field.setAttribute('aria-valuenow', String(this.value));
    }

    const inError = this.hasAttribute('data-error');
    if (inError) {
      this._field.setAttribute('aria-invalid', 'true');
      if (this._hintEl) {
        this._hintEl.id = `${this._id}-hint`;
        this._field.setAttribute('aria-describedby', `${this._id}-hint`);
      }
    } else {
      this._field.removeAttribute('aria-invalid');
    }

    this._field.disabled = tokens.disabled;
    this._field.setAttribute('aria-busy', String(tokens.loading));

    // Loading state visual
    if (this._wrapper) {
      if (tokens.loading) {
        this._showLoader(this._wrapper);
      } else {
        this._hideLoader();
      }
    }
  }

  // ─── Event listeners ────────────────────────────────────────────────────

  protected _attachEventListeners(): void {
    if (!this._field) return;

    const handleInput = (): void => {
      // Strip non-numeric characters except -, ., and ,
      let raw = this._field!.value;
      raw = raw.replace(/[^\d.,-]/g, '');

      // Store cursor position
      const cursorPos = this._field!.selectionStart ?? 0;

      this._field!.value = raw;

      // Restore cursor
      this._field!.setSelectionRange(cursorPos, cursorPos);

      this._touched = true;
      this._updateButtonStates();
      this._dispatch('input', { value: this.value });
      if (this._internals) this._internals.setFormValue(raw);
    };

    const handleChange = (): void => {
      // Format the number on blur
      const val = this.value;
      if (val !== null) {
        const clamped = this._clamp(val);
        const formatted = this._formatNumber(clamped);
        this._field!.value = formatted;
        if (this._internals) this._internals.setFormValue(formatted);
      }
      this._updateButtonStates();
      this._updateValidState();
      this._dispatch('change', { value: this.value });
    };

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (this._field?.readOnly || this._field?.disabled) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          this._increment();
          break;
        case 'ArrowDown':
          e.preventDefault();
          this._decrement();
          break;
        case 'PageUp':
          e.preventDefault();
          this.value = (this.value ?? 0) + this._step * 10;
          this._dispatch('change', { value: this.value });
          break;
        case 'PageDown':
          e.preventDefault();
          this.value = (this.value ?? 0) - this._step * 10;
          this._dispatch('change', { value: this.value });
          break;
        case 'Home':
          if (this._min !== null) {
            e.preventDefault();
            this.value = this._min;
            this._dispatch('change', { value: this.value });
          }
          break;
        case 'End':
          if (this._max !== null) {
            e.preventDefault();
            this.value = this._max;
            this._dispatch('change', { value: this.value });
          }
          break;
      }
    };

    this._field.addEventListener('input', handleInput);
    this._field.addEventListener('change', handleChange);
    this._field.addEventListener('blur', handleChange); // Format on blur
    this._field.addEventListener('keydown', handleKeyDown);
  }
}

// Register the custom element
customElements.define('k-number-input', KNumberInputElement);
