/**
 * KBoxElement — <k-box> generic padded surface container.
 *
 * Replaces the need for <div> with layout + theming:
 *   <k-box>                  display:block, --k-box-padding
 *   <k-box v="surface">      --k-bg-surface background
 *   <k-box v="elevated">     --k-bg-elevated + --k-shadow-sm
 *   <k-box v="p-6">          larger padding
 *   <k-box v="elevated r-lg"> elevated + rounded corners
 */

import { KBaseElement } from '../KBaseElement.js';

export class KBoxElement extends KBaseElement {
  protected _render(): void {
    // Layout element — no inner DOM needed.
  }

  protected _applyAccessibility(): void {
    // Not interactive — no ARIA required.
  }
}

customElements.define('k-box', KBoxElement);
