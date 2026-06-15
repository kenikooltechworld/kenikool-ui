/**
 * KFrameElement — <k-frame> Focused content container.
 *
 * Constrained width for readability (e.g. articles, forms).
 * Out-of-the-box:
 *   - Max-width constrained (~720px)
 *   - Centered
 *   - Adaptive padding for mobile
 */

import { KBaseElement } from '../KBaseElement.js';

export class KFrameElement extends KBaseElement {
  protected _render(): void {
    // Layout element — no inner DOM needed.
  }

  protected _applyAccessibility(): void {
    // Structural element.
  }
}

customElements.define('k-frame', KFrameElement);
