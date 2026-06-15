/**
 * KStackElement — <k-stack> vertical flex stack.
 *
 * The simplest layout component — stacks children vertically with spacing:
 *   <k-stack>                 column, gap-4
 *   <k-stack v="gap-6">       larger gap
 *   <k-stack v="horizontal">  becomes a row (same as k-row but fixed direction)
 *   <k-stack v="align-center"> center children on cross axis
 */

import { KBaseElement } from '../KBaseElement.js';

export class KStackElement extends KBaseElement {
  protected _render(): void {
    // Layout element — no inner DOM needed.
  }

  protected _applyAccessibility(): void {
    // Not interactive — no ARIA required.
  }
}

customElements.define('k-stack', KStackElement);
