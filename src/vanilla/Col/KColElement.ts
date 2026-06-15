/**
 * KColElement — <k-col> flex/grid child with responsive sizing.
 *
 * Responsive by default:
 *   <k-col>               flex: 1 1 260px — grows, shrinks, stacks on mobile
 *   <k-col v="span-2">    grid-column: span 2
 *   <k-col v="span-full"> grid-column: 1 / -1 (full width)
 *
 * Stack behaviour: because the default min-width is 260px, when the
 * viewport shrinks, flex children automatically wrap to their own rows.
 * No media queries needed in user code — it just works.
 */

import { KBaseElement } from '../KBaseElement.js';

export class KColElement extends KBaseElement {
  protected _render(): void {
    // Layout element — no inner DOM needed.
  }

  protected _applyAccessibility(): void {
    // Not interactive — no ARIA required.
  }
}

customElements.define('k-col', KColElement);
