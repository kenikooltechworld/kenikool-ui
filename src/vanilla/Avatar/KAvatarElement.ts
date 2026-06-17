import { KBaseElement } from '../KBaseElement';
import { sanitizeUrl, sanitizeText } from '../../core/utils/sanitize';

export class KAvatarElement extends KBaseElement {
  private _container: HTMLElement | null = null;

  protected static componentVariants = ['with-border', 'with-status', 'with-badge', 'stacked', 'square', 'group', 'initials', 'gradient', 'glow'];

  protected _render(): void {
    if (this._container) return;

    this._container = document.createElement('div');
    this._container.className = 'k-avatar-container';

    const src = this.getAttribute('src');
    const name = this.getAttribute('name');

    if (src) {
      const img = document.createElement('img');
      img.className = 'k-avatar-img';
      img.src = sanitizeUrl(src);
      img.alt = sanitizeText(name || 'User Avatar');

      img.onerror = () => {
        this._renderInitials(name || 'User');
      };

      this._container.appendChild(img);
    } else {
      this._renderInitials(name || 'User');
    }

    this.appendChild(this._container);
    this._applyStatus();
  }

  private _renderInitials(name: string): void {
    // Clear image if it was there
    if (this._container) this._container.innerHTML = '';

    const initialsEl = document.createElement('div');
    initialsEl.className = 'k-avatar-initials';

    const initials = name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    initialsEl.textContent = initials;

    // Deterministic color based on name
    const color = this._stringToColor(name);
    initialsEl.style.backgroundColor = color;
    initialsEl.style.color = this._getContrastColor(color);

    this._container?.appendChild(initialsEl);
  }

  private _applyStatus(): void {
    const status = this.getAttribute('status');
    if (!status) return;

    const statusEl = document.createElement('div');
    statusEl.className = 'k-avatar-status';
    statusEl.setAttribute('data-status', status);
    this._container?.appendChild(statusEl);
  }

  protected _applyAccessibility(): void {
    const name = this.getAttribute('name') || 'User';
    this.setAttribute('role', 'img');
    this.setAttribute('aria-label', `Avatar of ${name}`);
  }

  private _stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 65%, 45%)`;
  }

  private _getContrastColor(color: string): string {
    // For our HSL generated colors, they are generally dark enough for white text.
    // Simplified contrast check.
    return '#fff';
  }
}

customElements.define('k-avatar', KAvatarElement);
