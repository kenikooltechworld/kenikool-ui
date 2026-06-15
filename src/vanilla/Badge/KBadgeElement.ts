import { KBaseElement } from '../KBaseElement.js';
import { sanitizeText } from '../../core/utils/sanitize.js';
import { getIcon } from '../../core/icons.js';
import type { IconName } from '../../core/icons.js';

/**
 * KBadgeElement — <k-badge> Web Custom Element.
 *
 * A high-impact indicator for status, categories, or counts.
 * Supports 10 variants: filled, outlined, subtle, dot, pill, count, tag, status, dismissible, icon-badge.
 */
export class KBadgeElement extends KBaseElement {
  private _contentEl: HTMLElement | null = null;
  private _closeBtn: HTMLButtonElement | null = null;

  protected _render(): void {
    if (this._contentEl) return;

    const tokens = this._getTokens();
    const variant = tokens.variant;

    // Core container
    const content = document.createElement('span');
    content.className = 'k-badge__content';

    // 1. Handle 'count' variant logic (99+ capping)
    let text = this.textContent || '';
    if (variant === 'count') {
      const num = parseInt(text, 10);
      if (!isNaN(num) && num > 99) {
        text = '99+';
      }
    }
    const sanitizedText = sanitizeText(text);

    // 2. Add Status Dot (for 'status' variant)
    if (variant === 'status') {
      const dot = document.createElement('span');
      dot.className = 'k-badge__status-dot';
      content.appendChild(dot);
    }

    // 3. Add Icon (for 'icon-badge' variant)
    const iconAttr = this.getAttribute('icon');
    if (variant === 'icon-badge' && iconAttr) {
      const iconWrap = document.createElement('span');
      iconWrap.className = 'k-badge__icon';
      iconWrap.innerHTML = getIcon(iconAttr as IconName);
      content.appendChild(iconWrap);
    }

    // 4. Add the actual text content
    if (sanitizedText) {
      const textSpan = document.createElement('span');
      textSpan.textContent = sanitizedText;
      content.appendChild(textSpan);
    }

    // 5. Add Close Button (for 'tag' and 'dismissible' variants)
    if (variant === 'tag' || variant === 'dismissible') {
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'k-badge__close';
      closeBtn.innerHTML = getIcon('close');
      closeBtn.setAttribute('aria-label', 'Dismiss');
      closeBtn.onclick = () => {
        this._dispatch('dismiss', { originalEvent: event });
      };
      content.appendChild(closeBtn);
      this._closeBtn = closeBtn;
    }

    this.appendChild(content);
    this._contentEl = content;
  }

  protected _applyAccessibility(): void {
    const tokens = this._getTokens();

    // Set accessibility labels
    const label = this.getAttribute('label') || this.textContent;
    if (label) {
      this.setAttribute('aria-label', sanitizeText(label));
    }

    // Sync disabled state
    this.setAttribute('aria-disabled', String(tokens.disabled));
    if (tokens.disabled) {
      this.setAttribute('tabindex', '-1');
    } else {
      this.setAttribute('tabindex', '0');
    }
  }
}

customElements.define('k-badge', KBadgeElement);
