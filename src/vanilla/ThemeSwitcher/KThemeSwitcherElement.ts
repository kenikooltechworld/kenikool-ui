/**
 * KThemeSwitcherElement — <k-theme-switcher> a professional theme management dropdown.
 *
 * This component allows users to switch between Light, Dark, and Dracula themes.
 * It persists the choice in localStorage and manages the `data-theme` attribute on <html>.
 *
 * Requirements:
 * - List 3 themes: Light (☀️), Dark (🌙), Dracula (🧛).
 * - Display theme name + 3 color swatches (bg, accent, text).
 * - Persistent storage in localStorage ("kenikool-theme").
 * - Keyboard navigation (Arrows, Enter, Space, Esc).
 * - Accessibility: role="listbox", role="option", aria-expanded, etc.
 */

import { KBaseElement } from '../KBaseElement.js';
import { applyTheme, getInitialTheme, getCurrentTheme } from '../../themes/themeCore.js';
import { THEMES } from '../../core/constants.js';
import type { Theme } from '../../core/types.js';
import { getIcon } from '../../core/icons.js';

export class KThemeSwitcherElement extends KBaseElement {
  private _isOpen = false;
  private _selectedIndex = 0;

  /**
   * Theme metadata used to render the list items.
   */
  private readonly _themeMeta = [
    { id: 'light',   label: 'Light',   icon: 'sun' },
    { id: 'dark',    label: 'Dark',    icon: 'moon' },
    { id: 'dracula', label: 'Dracula', icon: 'dracula' },
  ] as const;

  protected _render(): void {
    const current = getCurrentTheme();
    this._selectedIndex = THEMES.indexOf(current);

    // --- Root Structure ---
    // The component is a dropdown.
    // Host -> Trigger Button -> Dropdown List
    this.innerHTML = `
      <div class="k-theme-switcher-container">
        <button
          class="k-theme-switcher-trigger"
          aria-haspopup="listbox"
          aria-expanded="false"
        >
          <span class="trigger-icon">${getIcon(this._themeMeta[this._selectedIndex]?.icon || 'sun', 14)}</span>
          <span class="trigger-label">Theme</span>
          ${getIcon('chevronDown', 12, 'chevron')}
        </button>

        <div class="k-theme-switcher-list" role="listbox" aria-label="Select theme" hidden>
          ${this._themeMeta.map((theme, index) => `
            <div
              class="k-theme-switcher-option"
              role="option"
              data-index="${index}"
              aria-selected="${index === this._selectedIndex}"
              tabindex="0"
            >
              <div class="option-info">
                <span class="option-icon">${getIcon(theme.icon as any, 14)}</span>
                <span class="option-label">${theme.label}</span>
              </div>
              <div class="option-swatches" data-theme="${theme.id}">
                <div class="swatch bg" title="Background"></div>
                <div class="swatch accent" title="Accent"></div>
                <div class="swatch text" title="Text"></div>
              </div>
              <div class="option-check">${getIcon('check', 12)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  protected _applyAccessibility(): void {
    // Set initial ARIA states
    this._updateTriggerAria();
  }

  protected _attachEventListeners(): void {
    const trigger = this.querySelector('.k-theme-switcher-trigger') as HTMLElement;
    const list = this.querySelector('.k-theme-switcher-list') as HTMLElement;
    const options = this.querySelectorAll('.k-theme-switcher-option');

    if (!trigger || !list) return;

    // Toggle dropdown
    if (trigger) {
      trigger.onclick = () => this._toggleDropdown();
    }

    // Handle option selection
    options.forEach(opt => {
      const element = opt as HTMLElement;
      element.onclick = () => {
        const index = parseInt(element.getAttribute('data-index') || '0', 10);
        this._selectTheme(index);
      };

      element.onkeydown = (e: KeyboardEvent) => this._handleOptionKeyDown(e);
    });

    // Close on outside click
    document.addEventListener('mousedown', (e) => {
      if (!this.contains(e.target as Node)) {
        this._closeDropdown();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._isOpen) {
        this._closeDropdown();
        trigger.focus();
      }
    });
  }

  private _toggleDropdown(): void {
    this._isOpen = !this._isOpen;
    this._updateDropdownState();
  }

  private _closeDropdown(): void {
    this._isOpen = false;
    this._updateDropdownState();
  }

  private _updateDropdownState(): void {
    const list = this.querySelector('.k-theme-switcher-list') as HTMLElement;
    const trigger = this.querySelector('.k-theme-switcher-trigger') as HTMLElement;
    if (!list || !trigger) return;

    list.hidden = !this._isOpen;
    trigger.setAttribute('aria-expanded', String(this._isOpen));
  }

  private _updateTriggerAria(): void {
    const trigger = this.querySelector('.k-theme-switcher-trigger') as HTMLElement;
    if (!trigger) return;
    trigger.setAttribute('aria-expanded', String(this._isOpen));
  }

  private _selectTheme(index: number): void {
    const meta = this._themeMeta[index];
    if (!meta) return;

    const theme = meta.id as any;
    applyTheme(theme);

    this._selectedIndex = index;
    this._updateSelectionUI();
    this._closeDropdown();
  }

  private _updateSelectionUI(): void {
    const options = this.querySelectorAll('.k-theme-switcher-option');
    options.forEach((opt, idx) => {
      opt.setAttribute('aria-selected', String(idx === this._selectedIndex));
    });

    const triggerLabel = this.querySelector('.trigger-label');
    const triggerIcon = this.querySelector('.trigger-icon');
    const meta = this._themeMeta[this._selectedIndex];

    if (triggerLabel instanceof HTMLElement && triggerIcon instanceof HTMLElement && meta) {
      triggerLabel.textContent = meta.label;
      triggerIcon.textContent = meta.icon;
    }
  }

  private _handleOptionKeyDown(e: KeyboardEvent): void {
    const options = Array.from(this.querySelectorAll('.k-theme-switcher-option')) as HTMLElement[];
    if (options.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (this._selectedIndex + 1) % options.length;
      this._focusOption(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (this._selectedIndex - 1 + options.length) % options.length;
      this._focusOption(prev);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._selectTheme(this._selectedIndex);
    }
  }

  private _focusOption(index: number): void {
    const options = this.querySelectorAll('.k-theme-switcher-option');
    const target = options[index] as HTMLElement;
    if (target) {
      this._selectedIndex = index;
      target.focus();
    }
  }
}

customElements.define('k-theme-switcher', KThemeSwitcherElement);
