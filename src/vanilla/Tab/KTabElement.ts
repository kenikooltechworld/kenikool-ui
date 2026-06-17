import { KBaseElement } from '../KBaseElement';

/**
 * KTabElement — Individual tab button component
 * 
 * Represents a single tab button within a k-tabs container. Handles focus,
 * selection state, and accessibility attributes automatically.
 * 
 * @example
 * ```html
 * <k-tab target="panel1" active>Dashboard</k-tab>
 * <k-tab target="panel2" disabled>Settings</k-tab>
 * <k-tab target="panel3">Reports</k-tab>
 * ```
 * 
 * @remarks
 * This component is designed to be used inside a k-tabs container.
 * The styling is controlled by the parent k-tabs element's variant and color.
 */
export class KTabElement extends KBaseElement {
  private _button: HTMLButtonElement | null = null;

  protected static componentVariants = [];

  /**
   * Renders the tab button element
   * @internal
   */
  protected _render(): void {
    if (this._button) return;

    // Create native button
    this._button = document.createElement('button');
    this._button.setAttribute('type', 'button');
    this._button.setAttribute('role', 'tab');

    // Move text content to button
    this._button.textContent = this.textContent;
    this.textContent = '';

    this.appendChild(this._button);
  }

  /**
   * Applies ARIA attributes and accessibility enhancements
   * @internal
   */
  protected _applyAccessibility(): void {
    if (!this._button) return;

    const tokens = this._getTokens();

    // Handle active state
    const isActive = this.hasAttribute('active');
    this.setAttribute('aria-selected', String(isActive));
    this.setAttribute('tabindex', isActive ? '0' : '-1');

    if (this._button) {
      this._button.setAttribute('aria-selected', String(isActive));
      this._button.setAttribute('tabindex', isActive ? '0' : '-1');
    }

    // Handle disabled state
    if (tokens.disabled || this.hasAttribute('disabled')) {
      this.setAttribute('aria-disabled', 'true');
      this.style.pointerEvents = 'none';
      this.style.opacity = '0.5';
      if (this._button) {
        this._button.disabled = true;
      }
    } else {
      this.removeAttribute('aria-disabled');
      this.style.pointerEvents = '';
      this.style.opacity = '';
      if (this._button) {
        this._button.disabled = false;
      }
    }

    // Handle target relationship
    const target = this.getAttribute('target');
    if (target && this._button) {
      this._button.setAttribute('aria-controls', target);
    }

    // Handle loading state
    if (tokens.loading) {
      this.setAttribute('aria-busy', 'true');
      if (this._button) {
        this._button.setAttribute('aria-busy', 'true');
      }
    } else {
      this.removeAttribute('aria-busy');
      if (this._button) {
        this._button.removeAttribute('aria-busy');
      }
    }
  }

  /**
   * Handle attribute changes to update accessibility
   * @internal
   */
  attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null): void {
    super.attributeChangedCallback(name, oldVal, newVal);
    
    // Re-apply accessibility when attributes change
    if (['active', 'disabled', 'target'].includes(name)) {
      this._applyAccessibility();
    }
  }

  /**
   * Get the list of observed attributes
   */
  static get observedAttributes(): string[] {
    return [...super.observedAttributes, 'active', 'disabled', 'target'];
  }

  /**
   * Get the target panel ID
   * @returns The target panel ID
   */
  public getTarget(): string | null {
    return this.getAttribute('target');
  }

  /**
   * Check if this tab is currently active
   * @returns Whether this tab is active
   */
  public isActive(): boolean {
    return this.hasAttribute('active');
  }

  /**
   * Set the active state of this tab
   * @param active - Whether this tab should be active
   */
  public setActive(active: boolean): void {
    if (active) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
    this._applyAccessibility();
  }
}

customElements.define('k-tab', KTabElement);