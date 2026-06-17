import { KBaseElement } from '../KBaseElement';

export class KPanelElement extends KBaseElement {
  protected _render(): void {
    // KPanel is a container for content
  }

  protected _applyAccessibility(): void {
    this.setAttribute('role', 'tabpanel');
    this.setAttribute('tabindex', '0'); // Make it focusable for scrolling
  }
}

customElements.define('k-panel', KPanelElement);
