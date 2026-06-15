/**
 * KRowElement — <k-row> responsive Flexbox row container.
 *
 * Responsive by default — wraps children to new lines automatically:
 *   <k-row>                         flex row, gap-4, wraps on overflow
 *   <k-row v="align-center">        vertically center children
 *   <k-row v="justify-between">     space children apart
 *   <k-row v="gap-6">               larger gap
 *
 * On very small screens (< 480px) children stack vertically by default.
 * No attributes needed from the user to achieve this.
 */

import { KBaseElement } from '../KBaseElement.js';

export class KRowElement extends KBaseElement {
  protected _render(): void {
    // Layout element — no inner DOM needed.
  }

  protected _applyAccessibility(): void {
    // Not interactive — no ARIA required.
  }
}

customElements.define('k-row', KRowElement);
