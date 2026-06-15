import { KBaseElement } from '../KBaseElement.js';
import { sanitizeText } from '../../core/utils/sanitize.js';
import { getIcon } from '../../core/icons.js';
import type { IconName } from '../../core/icons.js';

/**
 * KBadgeElement — <k-badge> Web Custom Element.
 *
 * A versatile badge component supporting two modes:
 * 1. Standalone: Labels, tags, status indicators (filled, outlined, subtle, etc.)
 * 2. Notification: Overlays other elements (avatars, icons, buttons) with counts/dots
 * 
 * Usage:
 *   Standalone: <k-badge v="filled primary">New</k-badge>
 *   Notification: <k-badge v="notification" count="5"><k-button>Messages</k-button></k-badge>
 *   Avatar: <k-badge v="notification dot success"><k-avatar src="..."></k-avatar></k-badge>
 */
export class KBadgeElement extends KBaseElement {
  private _contentEl: HTMLElement | null = null;
  private _closeBtn: HTMLButtonElement | null = null;
  private _badgeIndicator: HTMLElement | null = null;
  private _childrenWrapper: HTMLElement | null = null;

  protected _render(): void {
    if (this._contentEl) return;

    const tokens = this._getTokens();
    const variant = tokens.variant;

    // Check if this is a notification badge (wraps children)
    const isNotification = variant === 'notification';
    const countAttr = this.getAttribute('count');
    const dotMode = this.getAttribute('dot') !== null;

    if (isNotification) {
      this._renderNotificationBadge(countAttr, dotMode);
    } else {
      this._renderStandaloneBadge();
    }
  }

  /**
   * Render notification badge that overlays children
   */
  private _renderNotificationBadge(countAttr: string | null, dotMode: boolean): void {
    // 1. Wrap existing children
    const childrenWrapper = document.createElement('span');
    childrenWrapper.className = 'k-badge__children';
    
    // Move all existing children into the wrapper
    while (this.firstChild) {
      childrenWrapper.appendChild(this.firstChild);
    }

    // 2. Create badge indicator
    const indicator = document.createElement('span');
    indicator.className = 'k-badge__indicator';

    if (dotMode) {
      // Just a dot, no content
      indicator.classList.add('k-badge__indicator--dot');
    } else if (countAttr) {
      // Show count with 99+ capping
      const count = parseInt(countAttr, 10);
      let displayText = countAttr;
      
      if (!isNaN(count) && count > 99) {
        displayText = '99+';
      }
      
      indicator.textContent = sanitizeText(displayText);
      
      // Hide if count is 0 (unless showZero is set)
      const showZero = this.getAttribute('showZero') !== null;
      if (count === 0 && !showZero) {
        indicator.style.display = 'none';
      }
    }

    // 3. Append in correct order
    this.appendChild(childrenWrapper);
    this.appendChild(indicator);

    this._childrenWrapper = childrenWrapper;
    this._badgeIndicator = indicator;
    this._contentEl = indicator;
  }

  /**
   * Render standalone badge (label/tag style)
   */
  private _renderStandaloneBadge(): void {
    const tokens = this._getTokens();
    const variant = tokens.variant;

    // Core container
    const content = document.createElement('span');
    content.className = 'k-badge__content';

    // 1. Handle 'count' variant logic (99+ capping)
    let text = this.textContent || '';
    this.textContent = ''; // Clear original content to prevent duplication
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

  static get observedAttributes(): string[] {
    return [...super.observedAttributes, 'label', 'icon', 'count', 'dot', 'showZero', 'offset'];
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    // Handle count changes dynamically
    if (name === 'count' && this._badgeIndicator && oldValue !== newValue) {
      const count = parseInt(newValue || '0', 10);
      let displayText = newValue || '';

      // Cap at 99+
      if (!isNaN(count) && count > 99) {
        displayText = '99+';
      }

      this._badgeIndicator.textContent = sanitizeText(displayText);

      // Auto-hide if count is 0 (unless showZero is set)
      const showZero = this.getAttribute('showZero') !== null;
      if (count === 0 && !showZero) {
        this._badgeIndicator.style.display = 'none';
      } else {
        this._badgeIndicator.style.display = '';
      }
    }
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
