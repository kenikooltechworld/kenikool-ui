/**
 * KThemeSwitcherElement — <k-theme-switcher> theme management using k-select.
 *
 * Zero-config theme switcher that uses the k-select component.
 * Persists choice in localStorage and manages `data-theme` on <html>.
 *
 * Usage:
 *   <k-theme-switcher></k-theme-switcher>
 */

import { KBaseElement } from '../KBaseElement.js';
import { applyTheme, getCurrentTheme } from '../../themes/themeCore.js';

export class KThemeSwitcherElement extends KBaseElement {
  private _select: HTMLElement | null = null;

  protected _render(): void {
    const current = getCurrentTheme();

    // Create k-select element with options using icon property
    const select = document.createElement('k-select');
    select.setAttribute('v', 'outlined sm with-icon');
    select.setAttribute('label', 'Theme');
    select.setAttribute('value', current);
    select.setAttribute('options', JSON.stringify([
      { value: 'light', label: 'Light', icon: 'sun' },
      { value: 'dark', label: 'Dark', icon: 'moon' },
      { value: 'dracula', label: 'Dracula', icon: 'dracula' }
    ]));

    this._select = select;
    this.appendChild(select);
  }

  protected _applyAccessibility(): void {
    // k-select handles all accessibility internally
  }

  protected _attachEventListeners(): void {
    if (!this._select) return;

    // Listen to k-select's change event
    this._select.addEventListener('k:change', ((e: CustomEvent) => {
      const newTheme = e.detail.value;
      if (newTheme === 'light' || newTheme === 'dark' || newTheme === 'dracula') {
        applyTheme(newTheme);
      }
    }) as EventListener);
  }
}

customElements.define('k-theme-switcher', KThemeSwitcherElement);
