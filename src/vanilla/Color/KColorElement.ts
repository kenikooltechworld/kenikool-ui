/**
 * KColorElement — <k-color> Web Custom Element.
 *
 * Usage:
 *   <k-color v="outlined md" label="Primary Color" value="#3B82F6"></k-color>
 *   <k-color v="filled lg primary" label="Theme Color" format="rgb"></k-color>
 *   <k-color v="soft md" label="Color" swatches></k-color>
 *
 * Features:
 *   - Color input with native color picker fallback
 *   - Support for hex, rgb, hsl formats
 *   - Built-in color palette with preset swatches
 *   - Live preview of selected color
 *   - Keyboard navigation
 *   - Form integration
 *   - All standard input features: variants, sizes, colors, validation, etc.
 *   - Full accessibility (ARIA, keyboard, screen readers)
 */

import { KBaseElement } from '../KBaseElement.js';
import { sanitizeText } from '../../core/utils/sanitize.js';

export class KColorElement extends KBaseElement {
  // ─── Form-Associated Custom Element ────────────────────────────────────
  static formAssociated = true;

  private _internals: ElementInternals | null = null;
  private _form: HTMLFormElement | null = null;
  private _onFormReset = (): void => this._handleFormReset();

  // ─── DOM refs ────────────────────────────────────────────────────────────
  private _wrapper: HTMLElement | null = null;
  private _labelEl: HTMLElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _preview: HTMLElement | null = null;
  private _hintEl: HTMLElement | null = null;
  private _swatchesContainer: HTMLElement | null = null;
  private _id: string = '';

  // ─── Internal state ─────────────────────────────────────────────────────
  private _defaultValue = '#3B82F6';
  private _value = '#3B82F6';
  private _format: 'hex' | 'rgb' | 'hsl' = 'hex';
  private _showSwatches = false;
  private _disabled = false;
  private _externalError = false;
  private _touched = false;

  // ─── Preset swatches ────────────────────────────────────────────────────
  private _defaultSwatches = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#6B7280', // Gray
  ];

  // ─── Public value API ───────────────────────────────────────────────────

  /**
   * Get the current color value in the specified format (hex, rgb, or hsl).
   */
  get value(): string {
    if (this._format === 'hex') {
      return this._value;
    }
    return this._convertToFormat(this._value, this._format);
  }

  set value(val: string) {
    if (!val || !this._isValidColor(val)) return;
    this._value = this._normalizeToHex(val);
    this._updatePreview();
    if (this._input) {
      this._input.value = this._value;
    }
    if (this._internals) {
      this._internals.setFormValue(this.value);
    }
  }

  /** Form association — read-only. */
  get form(): HTMLFormElement | null {
    return this._form;
  }

  checkValidity(): boolean {
    return this._isValidColor(this._value);
  }

  reportValidity(): boolean {
    return this.checkValidity();
  }

  // ─── Observed attributes ────────────────────────────────────────────────

  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      'label', 'hint', 'label-position',
      'name', 'form', 'value', 'defaultValue', 'disabled',
      'format', 'swatches', 'error',
    ];
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────

  connectedCallback(): void {
    super.connectedCallback();
    this._parseAttributes();
    this._render();
    this._attachEventListeners();
    this._resolveForm();
  }

  disconnectedCallback(): void {
    if (this._form) {
      this._form.removeEventListener('reset', this._onFormReset);
    }
  }

  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    super.attributeChangedCallback(name, oldVal, newVal);

    if (!this._wrapper) return;

    switch (name) {
      case 'value':
        if (newVal !== null && newVal !== oldVal) {
          this.value = newVal;
        }
        break;
      case 'format':
        this._format = (newVal as any) || 'hex';
        if (this._input) {
          this._input.value = this.value;
        }
        break;
      case 'swatches':
        this._showSwatches = newVal !== null;
        this._render();
        this._attachEventListeners();
        break;
      case 'disabled':
        this._disabled = newVal !== null;
        this._updateDisabledState();
        break;
      case 'error':
        this._externalError = newVal !== null;
        this._applyErrorState();
        break;
    }
  }

  // ─── Private helpers ────────────────────────────────────────────────────

  private _parseAttributes(): void {
    this._format = (this.getAttribute('format') as any) || 'hex';
    this._showSwatches = this.hasAttribute('swatches');
    this._disabled = this.hasAttribute('disabled');
    this._externalError = this.hasAttribute('error');
    this._value = this._normalizeToHex(this.getAttribute('value') || this._defaultValue);
    this._defaultValue = this._value;
  }

  private _isValidColor(color: string): boolean {
    // Hex
    if (/^#[0-9A-F]{6}$/i.test(color)) return true;
    // RGB
    if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(color)) return true;
    // HSL
    if (/^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/i.test(color)) return true;
    return false;
  }

  private _normalizeToHex(color: string): string {
    // Already hex
    if (/^#[0-9A-F]{6}$/i.test(color)) return color.toUpperCase();

    // RGB to hex
    const rgbMatch = color.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (rgbMatch && rgbMatch[1] && rgbMatch[2] && rgbMatch[3]) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
    }

    // HSL to hex
    const hslMatch = color.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i);
    if (hslMatch && hslMatch[1] && hslMatch[2] && hslMatch[3]) {
      const h = parseInt(hslMatch[1], 10);
      const s = parseInt(hslMatch[2], 10);
      const l = parseInt(hslMatch[3], 10);
      return this._hslToHex(h, s, l);
    }

    return this._defaultValue;
  }

  private _convertToFormat(hex: string, format: 'hex' | 'rgb' | 'hsl'): string {
    if (format === 'hex') return hex;

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    if (format === 'rgb') {
      return `rgb(${r}, ${g}, ${b})`;
    }

    if (format === 'hsl') {
      const { h, s, l } = this._rgbToHsl(r, g, b);
      return `hsl(${h}, ${s}%, ${l}%)`;
    }

    return hex;
  }

  private _rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  private _hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if (h < 60) {
      r = c;
      g = x;
    } else if (h < 120) {
      r = x;
      g = c;
    } else if (h < 180) {
      g = c;
      b = x;
    } else if (h < 240) {
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      b = c;
    } else {
      r = c;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
  }

  protected _render(): void {
    const labelPos = this.getAttribute('label-position') || 'top';
    const label = this.getAttribute('label');

    const swatchesHTML = this._showSwatches
      ? `<div class="k-color__swatches">
           ${this._defaultSwatches.map(color => `<button class="k-color__swatch" data-color="${color}" style="background-color: ${color}" title="${color}" aria-label="Select color ${color}"></button>`).join('')}
         </div>`
      : '';

    this.innerHTML = `
      <div class="k-color__field-group">
        ${label && labelPos === 'top' ? `<label class="k-color__label">${sanitizeText(label)}</label>` : ''}
        
        <div class="k-color__wrapper">
          <div class="k-color__preview"></div>
          <input type="color" class="k-color__input" value="${this._value}" aria-label="${label || 'Color picker'}">
          <input type="text" class="k-color__text-input" value="${this.value}" placeholder="#000000" aria-label="${label || 'Color'} text input">
        </div>

        ${swatchesHTML}

        ${label && labelPos === 'bottom' ? `<label class="k-color__label">${sanitizeText(label)}</label>` : ''}
        ${this.getAttribute('hint') ? `<div class="k-color__hint">${sanitizeText(this.getAttribute('hint') || '')}</div>` : ''}
      </div>
    `;

    this._applyTokens();
    this._cacheRefs();
    this._updatePreview();
  }

  private _cacheRefs(): void {
    this._wrapper = this.querySelector('.k-color__wrapper') as HTMLElement;
    this._preview = this.querySelector('.k-color__preview') as HTMLElement;
    this._input = this.querySelector('.k-color__input') as HTMLInputElement;
    this._labelEl = this.querySelector('.k-color__label') as HTMLElement;
    this._hintEl = this.querySelector('.k-color__hint') as HTMLElement;
    this._swatchesContainer = this.querySelector('.k-color__swatches') as HTMLElement;
  }

  private _applyTokens(): void {
    const tokens = this._getTokens();
    this.setAttribute('data-variant', tokens.variant || 'default');
    this.setAttribute('data-size', tokens.size || 'md');
    this.setAttribute('data-color', tokens.color || 'primary');
    this.setAttribute('data-radius', tokens.radius || 'md');
    if (this._disabled) this.setAttribute('data-disabled', 'true');
    if (this._externalError) this.setAttribute('data-error', 'true');
  }

  private _updatePreview(): void {
    if (!this._preview) return;
    this._preview.style.backgroundColor = this._value;
  }

  private _updateDisabledState(): void {
    if (this._input) this._input.disabled = this._disabled;
  }

  private _applyErrorState(): void {
    if (this._hintEl) {
      this._hintEl.style.color = this._externalError ? 'var(--k-error)' : 'var(--k-text-muted)';
    }
  }

  private _resolveForm(): void {
    try {
      this._internals = (this as any).elementInternals;
    } catch {
      this._internals = null;
    }

    const formId = this.getAttribute('form');
    if (formId) {
      const form = document.getElementById(formId) as HTMLFormElement;
      if (form) {
        this._form = form;
        this._form.addEventListener('reset', this._onFormReset);
      }
    } else {
      let el = this.parentElement;
      while (el) {
        if (el.tagName === 'FORM') {
          this._form = el as HTMLFormElement;
          this._form.addEventListener('reset', this._onFormReset);
          break;
        }
        el = el.parentElement;
      }
    }

    if (this._internals) {
      this._internals.setFormValue(this.value);
    }
  }

  private _handleFormReset(): void {
    this.value = this._defaultValue;
  }

  private _setupEventListeners(): void {
    if (!this._input) return;

    const handleColorChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      this._value = target.value.toUpperCase();
      this._updatePreview();
      this._dispatchChange();
      this._touched = true;
    };

    this._input.addEventListener('input', handleColorChange);
    this._input.addEventListener('change', handleColorChange);

    // Text input for manual entry
    const textInput = this.querySelector('.k-color__text-input') as HTMLInputElement;
    if (textInput) {
      textInput.addEventListener('input', () => {
        const val = textInput.value;
        if (this._isValidColor(val)) {
          this._value = this._normalizeToHex(val);
          if (this._input) {
            this._input.value = this._value;
          }
          this._updatePreview();
          this._dispatchChange();
        }
      });

      textInput.addEventListener('blur', () => {
        textInput.value = this.value;
        this._touched = true;
      });
    }

    // Swatches
    if (this._swatchesContainer) {
      const swatches = this._swatchesContainer.querySelectorAll('.k-color__swatch');
      swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
          const color = (swatch as HTMLElement).getAttribute('data-color');
          if (color) {
            this.value = color;
            this._dispatchChange();
            this._touched = true;
          }
        });
      });
    }
  }

  private _dispatchChange(): void {
    const event = new CustomEvent('k:change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);

    const changeEvent = new Event('change', { bubbles: true });
    this.dispatchEvent(changeEvent);
  }

  protected _applyAccessibility(): void {
    if (this._input) {
      this._input.setAttribute('aria-label', this.getAttribute('label') || 'Color picker');
      if (this._disabled) {
        this._input.setAttribute('aria-disabled', 'true');
      }
    }
  }

  protected _attachEventListeners(): void {
    this._setupEventListeners();
  }
}

customElements.define('k-color', KColorElement);
