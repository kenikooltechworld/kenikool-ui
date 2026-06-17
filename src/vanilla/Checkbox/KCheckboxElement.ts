import { KBaseElement } from '../KBaseElement.js';
import { sanitizeText } from '../../core/utils/sanitize.js';
import { generateId } from '../../core/utils/generateId.js';

/**
 * KCheckboxElement — <k-checkbox> Web Custom Element.
 *
 * Industry-standard checkbox/radio with 10 variants, full form support, and WCAG 2.2 AA compliance.
 *
 * Architecture:
 * - Native <input type="checkbox"> or <input type="radio"> for form compatibility
 * - Custom visual overlay for consistent theming across all browsers
 * - All styling via data-* attributes (data-variant, data-size, data-color)
 * - Supports sizes: xs, sm, md (default), lg, xl
 * - Supports colors: primary, success, warning, error, info, default
 * - 10 variants: default, filled, outlined, switch, switch-filled, radio, radio-card,
 *   indeterminate, icon-check, animated
 *
 * Usage:
 *   <k-checkbox v="default">Accept terms</k-checkbox>
 *   <k-checkbox v="switch lg primary">Dark Mode</k-checkbox>
 *   <k-checkbox v="radio" name="plan" value="basic">Basic Plan</k-checkbox>
 */
export class KCheckboxElement extends KBaseElement {
  private _input: HTMLInputElement | null = null;
  private _visuals: HTMLElement | null = null;
  private _label: HTMLLabelElement | null = null;
  private _changeHandler = () => this._handleChange();
  private _inputId: string = '';

  static get observedAttributes(): string[] {
    return [...super.observedAttributes, 'checked', 'name', 'value', 'label'];
  }

  protected _render(): void {
    if (this._input) return;

    const tokens = this._getTokens();
    const isRadio = tokens.variant === 'radio' || tokens.variant === 'radio-card';

    // Generate unique ID for input-label association
    this._inputId = generateId('checkbox');

    // 1. Create the native input (source of truth for checked state)
    this._input = document.createElement('input');
    this._input.type = isRadio ? 'radio' : 'checkbox';
    this._input.id = this._inputId;
    this._input.className = 'k-checkbox__input';

    // Forward attributes
    const val = this.getAttribute('value') || 'on';
    this._input.value = val;

    const name = this.getAttribute('name');
    if (name) this._input.name = name;

    const checked = this.hasAttribute('checked');
    if (checked) this._input.checked = true;

    // 2. Create the custom visual overlay
    this._visuals = document.createElement('div');
    this._visuals.className = 'k-checkbox__visual';
    this._visuals.setAttribute('aria-hidden', 'true');

    // For 'icon-check' or 'animated' variants, add SVG checkmark
    if (tokens.variant === 'icon-check' || tokens.variant === 'animated') {
      this._visuals.innerHTML = `
        <svg class="k-checkbox__checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    }

    // 3. Create the label (wraps everything for clickability)
    const text = this.textContent?.trim() || '';
    this._label = document.createElement('label');
    this._label.className = 'k-checkbox__label';
    this._label.htmlFor = this._inputId;

    // 4. Assemble the DOM
    // Structure: <k-checkbox> -> <label> -> [input, visual, text]
    this.textContent = '';
    this._label.appendChild(this._input);
    this._label.appendChild(this._visuals);

    if (text) {
      const textSpan = document.createElement('span');
      textSpan.className = 'k-checkbox__text';
      textSpan.textContent = sanitizeText(text);
      this._label.appendChild(textSpan);
    }

    this.appendChild(this._label);
  }

  protected _applyAccessibility(): void {
    const input = this._input;
    if (!input) return;

    const tokens = this._getTokens();

    // Sync disabled state
    input.disabled = tokens.disabled;
    if (tokens.disabled) {
      input.setAttribute('tabindex', '-1');
    } else {
      input.removeAttribute('tabindex');
    }

    // Handle indeterminate state (only for checkboxes, not radio)
    if (tokens.variant === 'indeterminate' && input.type === 'checkbox') {
      input.indeterminate = true;
      input.setAttribute('aria-checked', 'mixed');
    } else {
      if (input.type === 'checkbox') {
        input.indeterminate = false;
      }
      input.setAttribute('aria-checked', String(input.checked));
    }

    // aria-label fallback if no visible text
    const hasVisibleText = this._label?.querySelector('.k-checkbox__text')?.textContent?.trim();
    if (!hasVisibleText) {
      const ariaLabel = this.getAttribute('label') || this.getAttribute('aria-label');
      if (ariaLabel) {
        input.setAttribute('aria-label', sanitizeText(ariaLabel));
      } else {
        console.warn(`[k-checkbox] No visible label or aria-label provided for checkbox with value="${input.value}"`);
      }
    } else {
      input.removeAttribute('aria-label'); // Label element handles it
    }

    // Required state
    if (this.hasAttribute('required')) {
      input.setAttribute('required', '');
      input.setAttribute('aria-required', 'true');
    } else {
      input.removeAttribute('required');
      input.removeAttribute('aria-required');
    }
  }

  protected _attachEventListeners(): void {
    this._input?.addEventListener('change', this._changeHandler);
    
    // Also listen on the host for keyboard events
    this.addEventListener('keydown', (e) => {
      // Space key toggles checkbox when focused
      if (e.key === ' ' && e.target === this && this._input) {
        e.preventDefault();
        this._input.click();
      }
    });
  }

  protected _detachEventListeners(): void {
    this._input?.removeEventListener('change', this._changeHandler);
  }

  private _handleChange(): void {
    const input = this._input;
    if (!input) return;

    // Sync checked attribute with input state
    if (input.checked) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }

    // Update aria-checked
    const tokens = this._getTokens();
    if (tokens.variant === 'indeterminate' && input.indeterminate) {
      input.setAttribute('aria-checked', 'mixed');
    } else {
      input.setAttribute('aria-checked', String(input.checked));
    }

    // Dispatch custom event k:change
    this._dispatch('change', {
      checked: input.checked,
      value: input.value,
      name: input.name,
      target: input
    });
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (oldValue === newValue) return;

    if (name === 'checked' && this._input) {
      this._input.checked = newValue !== null;
      this._applyAccessibility();
    }

    if (name === 'name' && this._input) {
      if (newValue) {
        this._input.name = newValue;
      } else {
        this._input.removeAttribute('name');
      }
    }

    if (name === 'value' && this._input) {
      this._input.value = newValue || 'on';
    }

    if (name === 'label' && this._input) {
      this._applyAccessibility();
    }
  }

  // Public API for programmatic access
  get checked(): boolean {
    return this._input?.checked ?? false;
  }

  set checked(value: boolean) {
    if (this._input) {
      this._input.checked = value;
      if (value) {
        this.setAttribute('checked', '');
      } else {
        this.removeAttribute('checked');
      }
      this._applyAccessibility();
    }
  }

  get value(): string {
    return this._input?.value ?? 'on';
  }

  set value(val: string) {
    if (this._input) {
      this._input.value = val;
      this.setAttribute('value', val);
    }
  }

  get indeterminate(): boolean {
    return this._input?.indeterminate ?? false;
  }

  set indeterminate(value: boolean) {
    if (this._input && this._input.type === 'checkbox') {
      this._input.indeterminate = value;
      this._applyAccessibility();
    }
  }
}

customElements.define('k-checkbox', KCheckboxElement);
