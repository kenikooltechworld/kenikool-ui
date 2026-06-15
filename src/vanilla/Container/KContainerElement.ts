/**
 * KContainerElement — <k-container> Page wrapper.
 *
 * Centered layout with a fluid max-width.
 * Out-of-the-box:
 *   - Margin: 0 auto
 *   - Responsive max-width (1280px)
 *   - Fluid side gutters on mobile
 */

import { KBaseElement } from '../KBaseElement.js';

export class KContainerElement extends KBaseElement {
  protected _render(): void {
    // Layout element — no inner DOM needed.
  }

  protected _applyAccessibility(): void {
    // Structural element — no interactive ARIA needed.
  }
}

customElements.define('k-container', KContainerElement);
