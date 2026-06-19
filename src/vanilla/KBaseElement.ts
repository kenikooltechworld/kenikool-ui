/**
 * KBaseElement — abstract base class for all Kenikool UI Web Components.
 *
 * Every <k-*> custom element extends this class and inherits:
 * - Automatic v attribute parsing and data-attribute application
 * - Target selector handling (auto-mount into .hero / #app etc.)
 * - Lifecycle orchestration (connectedCallback, disconnectedCallback,
 *   attributeChangedCallback)
 * - Abstract hooks for subclass-specific rendering and accessibility
 *
 * All components use LIGHT DOM (not Shadow DOM) so that:
 * - CSS custom properties (--k-*) cascade naturally from :root / [data-theme]
 * - Users can override styles with standard CSS specificity
 * - No ::part() workarounds are needed for theming
 */

import { parseV }        from '../core/parseV.js';
import type { VTokens }  from '../core/types.js';

export abstract class KBaseElement extends HTMLElement {
  /**
   * The browser calls attributeChangedCallback only for attributes listed here.
   * All Kenikool components watch the single `v` attribute.
   */
  static get observedAttributes(): string[] {
    return ['v'];
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  /**
   * Called by the browser when the element is inserted into the DOM.
   * Orchestrates: parse v → render → accessibility → target mount → events.
   */
  connectedCallback(): void {
    this._applyV();
    this._render();
    this._applyAccessibility();
    this._handleTarget();
    this._attachEventListeners();
  }

  /**
   * Called by the browser when the element is removed from the DOM.
   * Subclasses override _detachEventListeners() to clean up.
   */
  disconnectedCallback(): void {
    this._detachEventListeners();
  }

  /**
   * Called by the browser when a watched attribute changes.
   * Re-applies v parsing and accessibility on every v change.
   * Does NOT call _render() — the inner DOM structure is built once in
   * connectedCallback and stays stable. data-* on the host drive all CSS.
   */
  attributeChangedCallback(
    _name: string,
    oldVal: string | null,
    newVal: string | null
  ): void {
    if (oldVal !== newVal) {
      this._applyV();
      this._applyAccessibility();
    }
  }

  // ─── v Attribute Processing ───────────────────────────────────────────────

  /**
   * Parses the `v` attribute and writes results as data-* attributes on the
   * host element. CSS reads these data-attributes to apply variant/size/color
   * styles without any class manipulation.
   *
   * Universal attributes (set on every component):
   *   data-variant, data-size, data-color, data-loading, data-disabled,
   *   data-full, data-radius (omitted when null)
   *
   * Layout attributes (set when the corresponding token is present):
   *   data-cols, data-gap, data-span, data-surface, data-align,
   *   data-justify, data-direction, data-text-size, data-weight,
   *   data-as, data-padding
   */
  protected _applyV(): void {
    const tokens = this._getTokens();

    // ── Target Mapping ───────────────────────────────────────────────────────
    // If the v attribute contains a selector token (e.g. ".log" or "#app"),
    // automatically apply it as a class/id so this element can act as a target.
    if (tokens.target) {
      if (tokens.target.startsWith('.')) {
        this.classList.add(tokens.target.slice(1));
      } else if (tokens.target.startsWith('#')) {
        this.id = tokens.target.slice(1);
      }
    }

    // ── Universal tokens — use setAttribute to avoid dataset issues ─────────
    this._setOrDelete('variant',  tokens.variant);
    this._setOrDelete('size',     tokens.size);
    this._setOrDelete('color',    tokens.color);
    this._setOrDelete('loading',  String(tokens.loading));
    this._setOrDelete('disabled', String(tokens.disabled));
    this._setOrDelete('full',     String(tokens.full));
    this._setOrDelete('radius',   tokens.radius);

    // ── Layout tokens — set when present, remove when absent ───────────────
    this._setOrDelete('cols',      tokens.cols      !== null ? String(tokens.cols)      : null);
    this._setOrDelete('gap',       tokens.gap);
    this._setOrDelete('span',      tokens.span      !== null ? String(tokens.span)      : null);
    this._setOrDelete('surface',   tokens.surface);
    this._setOrDelete('align',     tokens.align);
    this._setOrDelete('justify',   tokens.justify);
    this._setOrDelete('direction', tokens.direction);
    this._setOrDelete('textSize', tokens.textSize);
    this._setOrDelete('weight',    tokens.weight);
    this._setOrDelete('as',        tokens.as);
    this._setOrDelete('padding',   tokens.padding);

    // ── New universal tokens (v0.1.0) ──────────────────────────────────────
    this._setOrDelete('width',     tokens.width);
    this._setOrDelete('height',    tokens.height);
    this._setOrDelete('maxWidth',  tokens.maxWidth);
    this._setOrDelete('maxHeight', tokens.maxHeight);
    this._setOrDelete('minWidth',  tokens.minWidth);
    this._setOrDelete('minHeight', tokens.minHeight);
    this._setOrDelete('textAlign', tokens.textAlign);
    this._setOrDelete('overflow',  tokens.overflow);
    this._setOrDelete('overflowY', tokens.overflowY);
    this._setOrDelete('overflowX', tokens.overflowX);
    this._setOrDelete('border',    tokens.border);
    this._setOrDelete('shadow',    tokens.shadow);
    this._setOrDelete('display',   tokens.display);
    this._setOrDelete('cursor',    tokens.cursor);
    this._setOrDelete('loader',    tokens.loader);
  }

  /**
   * Sets a data-* attribute when value is non-null, otherwise removes it.
   * Uses setAttribute instead of dataset to support hyphenated attribute names.
   * Keeps the DOM clean — absent optional tokens leave no data-* attribute.
   */
  private _setOrDelete(key: string, value: string | null | undefined): void {
    // Convert camelCase key to kebab-case for data-* attribute
    const attrName = `data-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    if (value !== null && value !== undefined) {
      this.setAttribute(attrName, value);
    } else {
      this.removeAttribute(attrName);
    }
  }

  /**
   * Parses the current v attribute and returns the VTokens object.
   * Subclasses can call this at any time to read the current state.
   */
  protected _getTokens(): VTokens {
    return parseV(this.getAttribute('v'));
  }

  /**
   * Finds the target CSS selector from the v attribute and moves this element
   * into the matching container if found. Logs a warning if the selector
   * matches nothing — never throws.
   *
   * Example: v="filled lg .hero" → moves element into document.querySelector('.hero')
   */
  protected _handleTarget(): void {
    const tokens = this._getTokens();
    if (!tokens.target) return;

    const container = document.querySelector(tokens.target);
    if (!container) {
      console.warn(
        `[kenikool-ui] <${this.tagName.toLowerCase()}> target selector ` +
        `"${tokens.target}" matched no element. Component stays in place.`
      );
      return;
    }
    // Only move if target is not itself and not already the parent
    if (container !== this && container !== this.parentElement) {
      container.appendChild(this);
    }
  }

  // ─── Abstract Methods (subclasses must implement) ─────────────────────────

  /**
   * Builds the component's inner DOM structure.
   * Called once on connectedCallback after _applyV().
   * Should be idempotent — check for existing inner elements before creating.
   */
  protected abstract _render(): void;

  /**
   * Syncs all ARIA attributes with the current token state.
   * Called on connectedCallback and on every v attribute change.
   * Must set aria-disabled, aria-busy, aria-label, etc.
   */
  protected abstract _applyAccessibility(): void;

  // ─── Optional Overrides ───────────────────────────────────────────────────

  /**
   * Attach event listeners to inner elements.
   * Called after _render() on connectedCallback.
   * Override to add click handlers, input listeners, etc.
   */
  protected _attachEventListeners(): void {
    // Default: no-op. Override in subclass.
  }

  /**
   * Remove event listeners added in _attachEventListeners().
   * Called on disconnectedCallback to prevent memory leaks.
   */
  protected _detachEventListeners(): void {
    // Default: no-op. Override in subclass.
  }

  // ─── Utility helpers available to all subclasses ─────────────────────────

  /**
   * Dispatches a namespaced custom event that bubbles up through the DOM.
   * All Kenikool events use the `k:` prefix (e.g. `k:click`, `k:change`).
   *
   * @param eventName - Event name without prefix (e.g. 'click', 'change').
   * @param detail    - Optional payload attached to event.detail.
   */
  protected _dispatch(eventName: string, detail?: Record<string, unknown>): void {
    this.dispatchEvent(
      new CustomEvent(`k:${eventName}`, {
        bubbles:  true,
        composed: true,       // crosses shadow DOM boundaries if ever used
        detail:   detail ?? {},
      })
    );
  }
}
