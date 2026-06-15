/**
 * KButtonElement — <k-button> Web Custom Element.
 *
 * Usage:
 *   <k-button v="filled lg error r-full">Delete</k-button>
 *   <k-button v="outlined sm loading" icon="search">Search</k-button>
 *   <k-button v="filled responsive" icon="settings" label="Settings">Settings</k-button>
 *
 * The `v` attribute is the single source of truth. KBaseElement parses it
 * and writes data-* attributes onto this host element. button.css reads
 * those data-* attributes exclusively — no classes are ever set on the
 * inner <button> for styling purposes.
 *
 * Inner <button> responsibilities (accessibility only):
 *   - type="button"           → prevents accidental form submission
 *   - aria-disabled           → screen reader disabled state
 *   - aria-busy               → screen reader loading state
 *   - aria-label              → accessible name
 *   - tabindex                → removed from tab order when disabled
 *   - disabled (property)     → native disabled behaviour (pointer events, etc.)
 */

import { KBaseElement }  from '../KBaseElement.js';
import { sanitizeText }  from '../../core/utils/sanitize.js';
import { getIcon }        from '../../core/icons.js';

/** Inline spinner SVG used for the loading state. */
const SPINNER_SVG =
  `<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false">` +
  `<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor"` +
  ` stroke-width="3" stroke-linecap="round" stroke-dasharray="32" stroke-dashoffset="12"/>` +
  `</svg>`;

export class KButtonElement extends KBaseElement {
  /** Reference to the inner <button> once it has been created. */
  private _inner: HTMLButtonElement | null = null;

  static get observedAttributes(): string[] {
    return [...super.observedAttributes, 'icon', 'iconRight', 'label'];
  }

  /** Bound click handler — stored so it can be removed in disconnectedCallback. */
  private readonly _onClick = (e: MouseEvent): void => {
    const tokens = this._getTokens();
    if (tokens.loading || tokens.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this._dispatch('click', { originalEvent: e });
  };

  // ─── KBaseElement abstract implementations ────────────────────────────────

  /**
   * Creates the inner <button> on first connect.
   */
  protected _render(): void {
    if (this._inner) return;

    const btn = document.createElement('button');
    btn.type  = 'button';
    btn.appendChild(this._assembleContent());
    this.appendChild(btn);
    this._inner = btn;
  }

  private _assembleContent(): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const rawLabel = (this.textContent ?? '').trim();
    this.textContent = '';

    // 1. Handle Leading Icon (Attribute or Slot)
    const leftIcon = this.getAttribute('icon') || this.querySelector('[slot="icon"]');
    if (leftIcon) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'k-button__icon-left';
      if (typeof leftIcon === 'string') {
        iconWrap.innerHTML = getIcon(leftIcon as any);
      } else if (leftIcon instanceof HTMLElement) {
        leftIcon.setAttribute('aria-hidden', 'true');
        leftIcon.removeAttribute('slot');
        iconWrap.appendChild(leftIcon);
      }
      fragment.appendChild(iconWrap);
    }

    // 2. Handle Text Label
    const label = sanitizeText(rawLabel);
    if (label) {
      const span = document.createElement('span');
      span.className = 'k-button__text';
      span.textContent = label;
      fragment.appendChild(span);
    }

    // 3. Handle Trailing Icon (Attribute or Slot)
    const rightIcon = this.getAttribute('iconRight') || this.querySelector('[slot="iconRight"]');
    if (rightIcon) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'k-button__icon-right';
      if (typeof rightIcon === 'string') {
        iconWrap.innerHTML = getIcon(rightIcon as any);
      } else if (rightIcon instanceof HTMLElement) {
        rightIcon.setAttribute('aria-hidden', 'true');
        rightIcon.removeAttribute('slot');
        iconWrap.appendChild(rightIcon);
      }
      fragment.appendChild(iconWrap);
    }

    return fragment;
  }

  /**
   * Syncs all ARIA attributes and the native disabled property with the
   * current token state. Called after every v attribute change.
   */
  protected _applyAccessibility(): void {
    const btn = this._inner;
    if (!btn) return;

    const tokens = this._getTokens();
    const explicitLabel = this.getAttribute('label');
    const contentText = (btn.textContent ?? '').replace(/\s+/g, ' ').trim();
    const label = explicitLabel ?? contentText;

    btn.disabled = tokens.disabled;
    btn.setAttribute('aria-disabled', String(tokens.disabled));
    btn.setAttribute('tabindex', tokens.disabled ? '-1' : '0');

    btn.setAttribute('aria-busy', String(tokens.loading));

    if (tokens.loading) {
      btn.setAttribute('aria-label', label ? `${label} — loading` : 'Loading');
      this._showLoader();
    } else {
      btn.setAttribute('aria-label', label || 'Button');
      this._hideLoader();
    }

    // Handle Responsive Mode: automatically enable if an icon is present
    const hasIcon = this.getAttribute('icon') || this.getAttribute('iconRight') || this.querySelector('[slot="icon"]') || this.querySelector('[slot="iconRight"]');
    this.setAttribute('data-responsive', String(!!hasIcon));

    // For accessibility: if responsive, the native title attribute acts as a tooltip
    if (!!hasIcon && label) {
      btn.setAttribute('title', label);
    }
  }

  // ─── Event listener management ────────────────────────────────────────────

  protected _attachEventListeners(): void {
    this._inner?.addEventListener('click', this._onClick);
  }

  protected _detachEventListeners(): void {
    this._inner?.removeEventListener('click', this._onClick);
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  /**
   * Appends the loading spinner span to the inner button if not already present.
   */
  private _showLoader(): void {
    if (!this._inner) return;
    if (this._inner.querySelector('.k-button__loader')) return;
    const loader = document.createElement('span');
    loader.className = 'k-button__loader';
    loader.innerHTML = SPINNER_SVG; // safe: SPINNER_SVG is library-controlled, not user input
    loader.setAttribute('aria-hidden', 'true');
    this._inner.appendChild(loader);
  }

  /**
   * Removes the loading spinner span from the inner button.
   */
  private _hideLoader(): void {
    this._inner?.querySelector('.k-button__loader')?.remove();
  }
}

customElements.define('k-button', KButtonElement);
