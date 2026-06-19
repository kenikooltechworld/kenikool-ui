/**
 * KSliderElement — <k-slider> Web Custom Element.
 *
 * Features:
 *   - Single value or dual-thumb range selection
 *   - Live number feedback display
 *   - Custom track with filled progress bar
 *   - Hover tooltips showing current value
 *   - Full keyboard navigation (Arrow keys, Page Up/Down, Home/End)
 *   - Step support (snap to intervals)
 *   - Min/max constraints
 *   - All standard input features: variants, sizes, colors, states
 *   - Full accessibility (ARIA, keyboard, screen readers)
 *   - Form integration (ElementInternals)
 *
 * Usage:
 *   <k-slider v="filled md primary" label="Volume" min="0" max="100" value="50"></k-slider>
 *   <k-slider v="outlined lg" label="Price" min="0" max="1000" step="10" value="500"></k-slider>
 */

import { KBaseElement } from '../KBaseElement.js';
import { sanitizeText } from '../../core/utils/sanitize.js';
import { generateId } from '../../core/utils/generateId.js';

export class KSliderElement extends KBaseElement {
  // ─── Form-Associated Custom Element ────────────────────────────────────
  static formAssociated = true;

  private _internals: ElementInternals | null = null;
  private _form: HTMLFormElement | null = null;
  private _onFormReset = (): void => this._handleFormReset();

  // ─── DOM refs ────────────────────────────────────────────────────────────
  private _fieldGroup: HTMLElement | null = null;
  private _wrapper: HTMLElement | null = null;
  private _labelEl: HTMLElement | null = null;
  private _track: HTMLElement | null = null;
  private _thumb: HTMLInputElement | null = null;
  private _thumb2: HTMLInputElement | null = null;
  private _progress: HTMLElement | null = null;
  private _tooltip: HTMLElement | null = null;
  private _tooltip2: HTMLElement | null = null;
  private _valueDisplay: HTMLElement | null = null;
  private _valueDisplay2: HTMLElement | null = null;
  private _hintEl: HTMLElement | null = null;
  private _id: string = '';

  // ─── Internal state ─────────────────────────────────────────────────────
  private _defaultValue = '50';
  private _min = 0;
  private _max = 100;
  private _step = 1;
  private _value = 50;
  private _value2 = 75;
  private _range = false;
  private _disabled = false;
  private _loading = false;
  private _externalError = false;
  private _touched = false;

  // ─── Public value API ───────────────────────────────────────────────────

  /**
   * Get the current value (or value1 for range).
   */
  get value(): string {
    return this._value.toString();
  }

  set value(val: string) {
    const num = parseFloat(val) || this._min;
    this._value = Math.max(this._min, Math.min(num, this._max));
    this._updateSlider();
    if (this._internals) {
      this._internals.setFormValue(this._value.toString());
    }
  }

  /**
   * Get the second value (range mode only).
   */
  get value2(): string {
    return this._value2.toString();
  }

  set value2(val: string) {
    if (!this._range) return;
    const num = parseFloat(val) || this._min;
    this._value2 = Math.max(this._min, Math.min(num, this._max));
    this._updateSlider();
  }

  /** Form association — read-only. */
  get form(): HTMLFormElement | null {
    return this._form;
  }

  checkValidity(): boolean {
    return true;
  }

  reportValidity(): boolean {
    return true;
  }

  // ─── Observed attributes ────────────────────────────────────────────────

  static get observedAttributes(): string[] {
    return [
      ...super.observedAttributes,
      'label', 'hint', 'label-position',
      'name', 'form', 'value', 'defaultValue', 'disabled',
      'min', 'max', 'step', 'range', 'error', 'loading',
    ];
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────

  connectedCallback(): void {
    super.connectedCallback();
    this._id = generateId('slider');
    this._parseAttributes();
    this._render();
    this._cacheRefs();
    this._applyTokens();
    this._updateSlider();
    this._applyAccessibility();
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
      case 'min':
        this._min = parseInt(newVal || '0', 10);
        this._updateSlider();
        this._applyAccessibility();
        break;
      case 'max':
        this._max = parseInt(newVal || '100', 10);
        this._updateSlider();
        this._applyAccessibility();
        break;
      case 'step':
        this._step = parseInt(newVal || '1', 10);
        break;
      case 'value':
        if (newVal !== null && newVal !== oldVal) {
          this.value = newVal;
        }
        break;
      case 'range':
        this._range = newVal !== null;
        this._render();
        this._cacheRefs();
        this._applyTokens();
        this._updateSlider();
        this._attachEventListeners();
        break;
      case 'disabled':
        this._disabled = newVal !== null;
        this._updateDisabledState();
        break;
      case 'loading':
        this._loading = newVal !== null;
        this._updateLoadingState();
        break;
      case 'error':
        this._externalError = newVal !== null;
        this._applyErrorState();
        break;
    }
  }

  // ─── Private helpers ────────────────────────────────────────────────────

  private _parseAttributes(): void {
    this._min = this._parseIntAttr('min', 0);
    this._max = this._parseIntAttr('max', 100);
    this._step = this._parseIntAttr('step', 1);
    this._range = this.hasAttribute('range');
    this._disabled = this.hasAttribute('disabled');
    this._loading = this.hasAttribute('loading');
    this._value = this._parseIntAttr('value', 50);
    this._value2 = this._parseIntAttr('value2', 75);
    this._defaultValue = this.getAttribute('value') || '50';
    this._externalError = this.hasAttribute('error');
  }

  private _parseIntAttr(attr: string, fallback: number): number {
    const val = this.getAttribute(attr);
    return val !== null ? parseInt(val, 10) : fallback;
  }

  protected _render(): void {
    const labelPos = this.getAttribute('label-position') || 'top';
    const label = this.getAttribute('label');
    const hint = this.getAttribute('hint');

    this.innerHTML = `
      <div class="k-slider__field-group">
        ${label && labelPos === 'top' ? `<label class="k-slider__label" for="${this._id}-input">${sanitizeText(label)}</label>` : ''}
        
        <div class="k-slider__wrapper">
          <div class="k-slider__track">
            <div class="k-slider__progress"></div>
          </div>
          
          <input 
            type="range" 
            class="k-slider__input" 
            id="${this._id}-input"
            min="${this._min}" 
            max="${this._max}" 
            step="${this._step}" 
            value="${this._value}"
            role="slider"
            aria-label="${label || 'Slider'}"
            aria-valuemin="${this._min}"
            aria-valuemax="${this._max}"
            aria-valuenow="${this._value}"
            aria-valuetext="${this._value}">
          
          ${this._range ? `
            <input 
              type="range" 
              class="k-slider__input k-slider__input--second" 
              min="${this._min}" 
              max="${this._max}" 
              step="${this._step}" 
              value="${this._value2}"
              role="slider"
              aria-label="${label || 'Slider'} (second)"
              aria-valuemin="${this._min}"
              aria-valuemax="${this._max}"
              aria-valuenow="${this._value2}"
              aria-valuetext="${this._value2}">
          ` : ''}
          
          <div class="k-slider__tooltip" aria-hidden="true"></div>
          ${this._range ? `<div class="k-slider__tooltip k-slider__tooltip--second" aria-hidden="true"></div>` : ''}
        </div>

        <div class="k-slider__feedback">
          <div class="k-slider__value-display">${this._value}</div>
          ${this._range ? `<div class="k-slider__value-display k-slider__value-display--second">${this._value2}</div>` : ''}
        </div>
        
        ${label && labelPos === 'bottom' ? `<label class="k-slider__label" for="${this._id}-input">${sanitizeText(label)}</label>` : ''}
        ${hint ? `<div class="k-slider__hint">${sanitizeText(hint)}</div>` : ''}
      </div>
    `;
  }

  private _cacheRefs(): void {
    this._fieldGroup = this.querySelector('.k-slider__field-group') as HTMLElement;
    this._wrapper = this.querySelector('.k-slider__wrapper') as HTMLElement;
    this._track = this.querySelector('.k-slider__track') as HTMLElement;
    this._progress = this.querySelector('.k-slider__progress') as HTMLElement;
    this._labelEl = this.querySelector('.k-slider__label') as HTMLElement;
    this._tooltip = this.querySelector('.k-slider__tooltip') as HTMLElement;
    this._tooltip2 = this.querySelector('.k-slider__tooltip--second') as HTMLElement;
    this._hintEl = this.querySelector('.k-slider__hint') as HTMLElement;
    this._valueDisplay = this.querySelector('.k-slider__value-display') as HTMLElement;
    this._valueDisplay2 = this.querySelector('.k-slider__value-display--second') as HTMLElement;

    const inputs = this.querySelectorAll('.k-slider__input');
    if (inputs.length > 0) {
      this._thumb = inputs[0] as HTMLInputElement;
    }
    if (inputs.length > 1) {
      this._thumb2 = inputs[1] as HTMLInputElement;
    }
  }

  private _applyTokens(): void {
    const tokens = this._getTokens();
    this.setAttribute('data-variant', tokens.variant || 'filled');
    this.setAttribute('data-size', tokens.size || 'md');
    this.setAttribute('data-color', tokens.color || 'primary');
    this.setAttribute('data-radius', tokens.radius || 'md');
    if (this._disabled) this.setAttribute('data-disabled', 'true');
    if (this._loading) this.setAttribute('data-loading', 'true');
    if (this._externalError) this.setAttribute('data-error', 'true');
    if (tokens.width) this.setAttribute('data-width', tokens.width);
    if (tokens.height) this.setAttribute('data-height', tokens.height);
    if (tokens.shadow) this.setAttribute('data-shadow', tokens.shadow);
    if (tokens.border !== undefined) this.setAttribute('data-border', tokens.border ? 'true' : 'none');
    if (tokens.cursor) this.setAttribute('data-cursor', tokens.cursor);
    if (tokens.textAlign) this.setAttribute('data-text-align', tokens.textAlign);
    if (tokens.overflow) this.setAttribute('data-overflow', tokens.overflow);
    if (tokens.display) this.setAttribute('data-display', tokens.display);
    if (tokens.maxWidth) this.setAttribute('data-max-width', tokens.maxWidth);
  }

  private _updateSlider(): void {
    if (!this._thumb || !this._progress) return;

    const percent1 = ((this._value - this._min) / (this._max - this._min)) * 100;
    this._thumb.value = this._value.toString();

    if (this._range && this._thumb2) {
      const percent2 = ((this._value2 - this._min) / (this._max - this._min)) * 100;
      this._thumb2.value = this._value2.toString();

      const minPercent = Math.min(percent1, percent2);
      const maxPercent = Math.max(percent1, percent2);
      this._progress.style.left = `${minPercent}%`;
      this._progress.style.right = `${100 - maxPercent}%`;
    } else {
      this._progress.style.left = '0%';
      this._progress.style.right = `${100 - percent1}%`;
    }

    this._updateTooltip();
    this._updateValueDisplay();
  }

  private _updateTooltip(): void {
    if (!this._tooltip) return;

    this._tooltip.textContent = this._value.toString();
    const percent = ((this._value - this._min) / (this._max - this._min)) * 100;
    this._tooltip.style.left = `${percent}%`;

    if (this._range && this._tooltip2) {
      this._tooltip2.textContent = this._value2.toString();
      const percent2 = ((this._value2 - this._min) / (this._max - this._min)) * 100;
      this._tooltip2.style.left = `${percent2}%`;
    }
  }

  private _updateValueDisplay(): void {
    if (this._valueDisplay) {
      this._valueDisplay.textContent = this._value.toString();
    }
    if (this._range && this._valueDisplay2) {
      this._valueDisplay2.textContent = this._value2.toString();
    }
  }

  private _updateDisabledState(): void {
    if (this._thumb) this._thumb.disabled = this._disabled;
    if (this._thumb2) this._thumb2.disabled = this._disabled;
  }

  private _updateLoadingState(): void {
    if (this._thumb) this._thumb.disabled = this._loading;
    if (this._thumb2) this._thumb2.disabled = this._loading;
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
  }

  private _handleFormReset(): void {
    this.value = this._defaultValue;
  }

  private _setupEventListeners(): void {
    if (!this._thumb) return;

    // Input event for live updates
    const handleInput1 = () => {
      this._value = parseFloat(this._thumb!.value);
      if (this._range && this._value > this._value2) {
        this._value = this._value2;
        this._thumb!.value = this._value.toString();
      }
      this._updateSlider();
      this._applyAccessibility();
      this._dispatchChange();
    };

    const handleInput2 = () => {
      if (!this._thumb2) return;
      this._value2 = parseFloat(this._thumb2.value);
      if (this._value2 < this._value) {
        this._value2 = this._value;
        this._thumb2.value = this._value2.toString();
      }
      this._updateSlider();
      this._applyAccessibility();
      this._dispatchChange();
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent, isSecond: boolean = false) => {
      if (this._disabled || this._loading) return;

      const currentValue = isSecond ? this._value2 : this._value;
      let newValue = currentValue;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = Math.max(this._min, currentValue - this._step);
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = Math.min(this._max, currentValue + this._step);
          e.preventDefault();
          break;
        case 'PageDown':
          newValue = Math.max(this._min, currentValue - this._step * 5);
          e.preventDefault();
          break;
        case 'PageUp':
          newValue = Math.min(this._max, currentValue + this._step * 5);
          e.preventDefault();
          break;
        case 'Home':
          newValue = this._min;
          e.preventDefault();
          break;
        case 'End':
          newValue = this._max;
          e.preventDefault();
          break;
        default:
          return;
      }

      if (isSecond && this._thumb2) {
        this._value2 = newValue;
        this._thumb2.value = newValue.toString();
      } else if (this._thumb) {
        this._value = newValue;
        this._thumb.value = newValue.toString();
      }

      this._updateSlider();
      this._applyAccessibility();
      this._dispatchChange();
    };

    this._thumb.addEventListener('input', handleInput1);
    this._thumb.addEventListener('keydown', (e) => handleKeyDown(e, false));
    this._thumb.addEventListener('change', () => {
      if (this._internals) {
        this._internals.setFormValue(this._value.toString());
      }
    });

    if (this._thumb2) {
      this._thumb2.addEventListener('input', handleInput2);
      this._thumb2.addEventListener('keydown', (e) => handleKeyDown(e, true));
      this._thumb2.addEventListener('change', () => {
        if (this._internals) {
          this._internals.setFormValue(`${this._value},${this._value2}`);
        }
      });
    }

    if (this._internals && this._thumb) {
      this._internals.setFormValue(this._value.toString());
    }
  }

  private _dispatchChange(): void {
    const event = new CustomEvent('k:change', {
      detail: this._range ? { value1: this._value, value2: this._value2 } : { value: this._value },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);

    const changeEvent = new Event('change', { bubbles: true });
    this.dispatchEvent(changeEvent);
  }

  protected _applyAccessibility(): void {
    if (this._thumb) {
      this._thumb.setAttribute('aria-label', this.getAttribute('label') || 'Slider');
      this._thumb.setAttribute('aria-valuemin', this._min.toString());
      this._thumb.setAttribute('aria-valuemax', this._max.toString());
      this._thumb.setAttribute('aria-valuenow', this._value.toString());
      this._thumb.setAttribute('aria-valuetext', `${this._value}`);
      if (this._disabled) {
        this._thumb.setAttribute('aria-disabled', 'true');
        this._thumb.setAttribute('disabled', '');
      } else {
        this._thumb.removeAttribute('aria-disabled');
        this._thumb.removeAttribute('disabled');
      }
    }

    if (this._thumb2) {
      this._thumb2.setAttribute('aria-label', `${this.getAttribute('label') || 'Slider'} (second)`);
      this._thumb2.setAttribute('aria-valuemin', this._min.toString());
      this._thumb2.setAttribute('aria-valuemax', this._max.toString());
      this._thumb2.setAttribute('aria-valuenow', this._value2.toString());
      this._thumb2.setAttribute('aria-valuetext', `${this._value2}`);
      if (this._disabled) {
        this._thumb2.setAttribute('aria-disabled', 'true');
        this._thumb2.setAttribute('disabled', '');
      } else {
        this._thumb2.removeAttribute('aria-disabled');
        this._thumb2.removeAttribute('disabled');
      }
    }
  }

  protected _attachEventListeners(): void {
    this._setupEventListeners();
  }
}

customElements.define('k-slider', KSliderElement);
