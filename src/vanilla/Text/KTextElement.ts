/**
 * KTextElement — <k-text> semantic typography element.
 *
 * Replaces <p>, <h1>–<h6>, <span>, <label>, <code>, <pre> with a single
 * theme-aware tag. The correct semantic HTML element is rendered internally.
 *
 *   <k-text>                   renders <p>, base size, primary color
 *   <k-text v="h1 text-4xl bold">  renders <h1>, 36px, bold
 *   <k-text v="h2 text-2xl semibold">  renders <h2>
 *   <k-text v="text-sm muted">  renders <p>, small, muted color
 *   <k-text v="code">           renders <code> element
 *   <k-text v="label text-sm">  renders <label> element
 *
 * Accessibility: the inner element IS semantic. Screen readers see the
 * correct heading level, paragraph, or label — not a custom element.
 */

import { KBaseElement }  from '../KBaseElement.js';
import { sanitizeText }  from '../../core/utils/sanitize.js';

/** All valid semantic element names for k-text. */
const VALID_ELEMENTS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'span', 'label', 'code', 'pre',
]);

/** Default element when no `as` token is present. */
const DEFAULT_ELEMENT = 'p';

export class KTextElement extends KBaseElement {
  /** Reference to the inner semantic element. */
  private _inner: HTMLElement | null = null;

  /** Tag name currently rendered — tracked to detect when a rebuild is needed. */
  private _currentTag: string = DEFAULT_ELEMENT;

  protected _render(): void {
    const tokens  = this._getTokens();
    const tagName = this._resolveTag(tokens.as ?? tokens.variant);

    // Rebuild only if the semantic element type changed or first render
    if (this._inner && this._currentTag === tagName) return;

    const el = document.createElement(tagName);
    // NO className — styling driven by data-* on the host

    const text = sanitizeText(this.textContent ?? '');
    el.textContent  = text;
    this.textContent = '';
    this.appendChild(el);

    // If rebuilding after a tag change, remove the old element
    if (this._inner && this._inner !== el) {
      this._inner.remove();
    }

    this._inner     = el;
    this._currentTag = tagName;
  }

  protected _applyAccessibility(): void {
    // The inner semantic element carries its own implicit ARIA role.
    // Nothing extra needed — <h2> is already role="heading" aria-level="2".
  }

  /**
   * Resolves which HTML tag to render based on the `as` token or variant.
   * Falls back to DEFAULT_ELEMENT ('p') for unknown values.
   */
  private _resolveTag(candidate: string | null | undefined): string {
    if (candidate && VALID_ELEMENTS.has(candidate)) return candidate;
    return DEFAULT_ELEMENT;
  }
}

customElements.define('k-text', KTextElement);
