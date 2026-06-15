/**
 * KGridElement — <k-grid> responsive CSS Grid container.
 *
 * Responsive by default — zero attributes needed:
 *   <k-grid>          auto-fit columns, min 260px each, wraps at any viewport
 *   <k-grid v="cols-3">        force exactly 3 columns
 *   <k-grid v="cols-2 gap-6">  2 columns, larger gap
 *   <k-grid v="dense">         grid-auto-flow: dense (fills gaps)
 *
 * The host IS the grid — no inner wrapper. CSS reads data-* attributes.
 */

import { KBaseElement } from '../KBaseElement.js';

export class KGridElement extends KBaseElement {
  protected _render(): void {
    // Layout elements have no inner DOM to build.
    // All styling is driven by data-* on the host via CSS.
  }

  protected _applyAccessibility(): void {
    // Grids are not interactive — no ARIA role needed beyond implicit.
    // If used as a landmark, the user wraps it in <main> / <section> etc.
  }
}

customElements.define('k-grid', KGridElement);
