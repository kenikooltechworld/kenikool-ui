import { KBaseElement } from '../KBaseElement';
import { sanitizeText } from '../../core/utils/sanitize';

export class KTabElement extends KBaseElement {
  protected static componentVariants = ['default', 'pill', 'underlined', 'filled', 'outlined', 'glass', 'gradient', 'compact', 'vertical', 'card'];

  protected _render(): void {
    // KTab is a simple trigger, we use the host element itself
    // No inner button needed to avoid double-nesting inside KTabs
  }

  protected _applyAccessibility(): void {
    // Accessibility is managed by the parent KTabsElement
  }

  // Ensure the element is focusable
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'tab');
    this.setAttribute('tabindex', '-1');
    this.style.cursor = 'pointer';
  }
}

customElements.define('k-tab', KTabElement);
