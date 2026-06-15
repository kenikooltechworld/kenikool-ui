/**
 * KDividerElement — <k-divider> themed separator line.
 *
 * Replaces <hr> with a theme-aware separator:
 *   <k-divider>              horizontal line, --k-border color
 *   <k-divider v="vertical"> vertical line (use inside flex row)
 *   <k-divider v="muted">    --k-border-subtle (lighter)
 *   <k-divider v="strong">   --k-border-strong (heavier)
 */

import { KBaseElement } from '../KBaseElement.js';

export class KDividerElement extends KBaseElement {
  protected _render(): void {
    // Divider has no inner children — the host IS the line via CSS borders.
  }

  protected _applyAccessibility(): void {
    // Set separator role so screen readers announce it correctly.
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'separator');
    }
    // aria-orientation matches the visual direction
    const isVertical = this._getTokens().direction === 'vertical'
      || this.dataset['variant'] === 'vertical';
    this.setAttribute('aria-orientation', isVertical ? 'vertical' : 'horizontal');
  }
}

customElements.define('k-divider', KDividerElement);
