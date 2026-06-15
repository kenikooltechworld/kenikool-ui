import { KBaseElement } from '../KBaseElement.js';

/**
 * KLoaderElement — Implementation of the <k-loader> custom element.
 *
 * Supports 10 animation variants defined in requirements.md §6.
 */
export class KLoaderElement extends KBaseElement {
  static get observedAttributes(): string[] {
    return [...super.observedAttributes, 'width', 'height', 'border-radius', 'value'];
  }

  /**
   * Builds the internal DOM structure based on the current variant.
   */
  protected _render(): void {
    const tokens = this._getTokens();
    const variant = tokens.variant || 'spinner';

    // Clear existing content
    this.innerHTML = '';

    // We create elements based on the variant requirements
    switch (variant) {
      case 'spinner':
        this.appendChild(this._createEl('div', 'k-loader__element'));
        break;

      case 'dots':
        for (let i = 0; i < 3; i++) {
          this.appendChild(this._createEl('div', 'k-loader__element'));
        }
        break;

      case 'pulse':
        this.appendChild(this._createEl('div', 'k-loader__element'));
        break;

      case 'bars':
        for (let i = 0; i < 5; i++) {
          this.appendChild(this._createEl('div', 'k-loader__element'));
        }
        break;

      case 'ring':
        this.appendChild(this._createEl('div', 'k-loader__element outer'));
        this.appendChild(this._createEl('div', 'k-loader__element inner'));
        break;

      case 'ripple':
        this.appendChild(this._createEl('div', 'k-loader__element'));
        this.appendChild(this._createEl('div', 'k-loader__element'));
        break;

      case 'bounce':
        this.appendChild(this._createEl('div', 'k-loader__element'));
        break;

      case 'wave':
        for (let i = 0; i < 5; i++) {
          this.appendChild(this._createEl('div', 'k-loader__element'));
        }
        break;

      case 'skeleton':
      case 'shimmer': // alias
        // Skeleton is styled on the host, no inner element needed
        break;

      case 'progress':
        const bar = this._createEl('div', 'k-loader__element');
        this.appendChild(bar);
        break;

      case 'flip':
        this.appendChild(this._createEl('div', 'k-loader__element'));
        break;

      case 'orbit':
        const orbitContainer = this._createEl('div', 'k-loader__element orbit-container');
        const orbitDot = this._createEl('div', 'k-loader__element orbit-dot');
        orbitContainer.appendChild(orbitDot);
        this.appendChild(orbitContainer);
        break;

      case 'squeeze':
        this.appendChild(this._createEl('div', 'k-loader__element'));
        break;

      case 'beat':
        this.appendChild(this._createEl('div', 'k-loader__element'));
        break;

      case 'crescent':
        this.appendChild(this._createEl('div', 'k-loader__element'));
        break;

      default:
        // Fallback to spinner
        this.appendChild(this._createEl('div', 'k-loader__element'));
        break;
    }

    this._updateCustomStyles();
  }

  /**
   * Handles specific attributes for skeleton and progress variants.
   */
  protected _applyV(): void {
    super._applyV();
    const tokens = this._getTokens();

    if (tokens.variant === 'progress') {
      const value = this.getAttribute('value');
      const isIndeterminate = value === null;
      this.setAttribute('data-indeterminate', String(isIndeterminate));
      if (!isIndeterminate) {
        this.style.setProperty('--k-loader-progress-value', `${value}%`);
      }
    }
  }

  override attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    super.attributeChangedCallback(name, oldVal, newVal);

    if (name === 'width' || name === 'height' || name === 'border-radius') {
      this._updateCustomStyles();
    }
    if (name === 'value') {
      this._applyV();
    }
  }

  protected _updateCustomStyles(): void {
    const width = this.getAttribute('width');
    const height = this.getAttribute('height');
    const radius = this.getAttribute('border-radius');

    if (width) this.style.width = width;
    if (height) this.style.height = height;
    if (radius) this.style.borderRadius = radius;
  }

  protected _applyAccessibility(): void {
    this.setAttribute('role', 'status');
    this.setAttribute('aria-live', 'polite');

    const tokens = this._getTokens();
    this.setAttribute('aria-label', `Loading ${tokens.variant || 'spinner'}...`);
    this.setAttribute('aria-busy', 'true');
  }

  /**
   * Helper to create an element with a class.
   */
  private _createEl(tag: string, className: string): HTMLElement {
    const el = document.createElement(tag);
    el.className = className;
    return el;
  }
}

customElements.define('k-loader', KLoaderElement);
