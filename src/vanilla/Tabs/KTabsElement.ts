import { KBaseElement } from '../KBaseElement';
import { parseV } from '../../core/parseV';

/**
 * KTabsElement — Accessible tabbed interface component
 * 
 * A container for organizing content into multiple panels that can be accessed
 * via clickable tab buttons. Provides keyboard navigation, ARIA attributes,
 * and multiple visual variants.
 * 
 * @example
 * ```html
 * <k-tabs v="default" label="Dashboard Tabs">
 *   <div slot="tabs">
 *     <k-tab target="tab1" active>Overview</k-tab>
 *     <k-tab target="tab2">Analytics</k-tab>
 *     <k-tab target="tab3">Settings</k-tab>
 *   </div>
 *   <div slot="panels">
 *     <div id="tab1" role="tabpanel">Overview content...</div>
 *     <div id="tab2" role="tabpanel">Analytics content...</div>
 *     <div id="tab3" role="tabpanel">Settings content...</div>
 *   </div>
 * </k-tabs>
 * ```
 * 
 * @remarks
 * Supports 10 visual variants: default, pill, underlined, filled, outlined, 
 * glass, gradient, compact, vertical, card.
 * 
 * Supports semantic colors: primary, success, warning, error, info.
 */
export class KTabsElement extends KBaseElement {
  private _tabsList: HTMLElement | null = null;
  private _panelsContainer: HTMLElement | null = null;
  private _currentActiveTab: string | null = null;

  protected static componentVariants = ['default', 'pill', 'underlined', 'filled', 'outlined', 'glass', 'gradient', 'compact', 'vertical', 'card'];

  /**
   * Renders the tabs structure with tab list and panels container
   * @internal
   */
  protected _render(): void {
    if (this._tabsList && this._panelsContainer) return;

    // Create tab list container
    this._tabsList = document.createElement('div');
    this._tabsList.className = 'k-tabs-list';
    this._tabsList.setAttribute('role', 'tablist');

    // Create panels container
    this._panelsContainer = document.createElement('div');
    this._panelsContainer.className = 'k-tabs-panels';

    // Process slots
    this._setupSlots();

    // Add to DOM
    this.appendChild(this._tabsList);
    this.appendChild(this._panelsContainer);

    // Initialize active tab
    this._initializeActiveTabs();
  }

  /**
   * Maps slot content to appropriate containers
   * @internal
   */
  private _setupSlots(): void {
    if (!this._tabsList || !this._panelsContainer) return;

    // Move tab buttons to tabs list
    const tabsSlot = this.querySelector('[slot="tabs"]');
    if (tabsSlot) {
      const tabElements = tabsSlot.querySelectorAll('k-tab');
      tabElements.forEach(tab => {
        this._tabsList?.appendChild(tab);
      });
      // Remove empty slot container
      tabsSlot.remove();
    }

    // Move panels to panels container
    const panelsSlot = this.querySelector('[slot="panels"]');
    if (panelsSlot) {
      const panelElements = panelsSlot.children;
      Array.from(panelElements).forEach(panel => {
        this._panelsContainer?.appendChild(panel);
      });
      // Remove empty slot container
      panelsSlot.remove();
    }
  }

  /**
   * Initializes the first active tab and hides inactive panels
   * @internal
   */
  private _initializeActiveTabs(): void {
    if (!this._tabsList || !this._panelsContainer) return;

    const tabs = this._tabsList.querySelectorAll('k-tab');
    const panels = this._panelsContainer.querySelectorAll('[role="tabpanel"]');

    // Find the active tab or default to first
    let activeTab = this._tabsList.querySelector('k-tab[active]') as HTMLElement;
    if (!activeTab && tabs.length > 0) {
      activeTab = tabs[0] as HTMLElement;
    }

    if (activeTab) {
      const targetId = activeTab.getAttribute('target');
      this._setActiveTab(activeTab, targetId);
    }

    // Hide all panels initially
    panels.forEach(panel => {
      const panelElement = panel as HTMLElement;
      panelElement.style.display = 'none';
      panelElement.setAttribute('aria-hidden', 'true');
    });

    // Show active panel
    if (this._currentActiveTab) {
      const activePanel = this._panelsContainer.querySelector(`#${this._currentActiveTab}`);
      if (activePanel) {
        const activePanelElement = activePanel as HTMLElement;
        activePanelElement.style.display = 'block';
        activePanelElement.setAttribute('aria-hidden', 'false');
      }
    }
  }

  /**
   * Sets the active tab and manages ARIA states
   * @internal
   */
  private _setActiveTab(tab: HTMLElement, targetId: string | null): void {
    if (!this._tabsList || !targetId) return;

    // Update previous active tab
    const previousActive = this._tabsList.querySelector('k-tab[aria-selected="true"]');
    if (previousActive) {
      previousActive.setAttribute('aria-selected', 'false');
      previousActive.setAttribute('tabindex', '-1');
    }

    // Set new active tab
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tab.focus();

    this._currentActiveTab = targetId;

    // Dispatch change event
    this._dispatch('tabchange', { activeTab: targetId });
  }

  /**
   * Handles tab switching and panel visibility
   * @internal
   */
  private _switchToTab(targetId: string): void {
    if (!this._panelsContainer) return;

    // Hide all panels
    const panels = this._panelsContainer.querySelectorAll('[role="tabpanel"]');
    panels.forEach(panel => {
      const panelElement = panel as HTMLElement;
      panelElement.style.display = 'none';
      panelElement.setAttribute('aria-hidden', 'true');
    });

    // Show target panel
    const targetPanel = this._panelsContainer.querySelector(`#${targetId}`);
    if (targetPanel) {
      const targetPanelElement = targetPanel as HTMLElement;
      targetPanelElement.style.display = 'block';
      targetPanelElement.setAttribute('aria-hidden', 'false');
    }
  }

  /**
   * Applies ARIA attributes and accessibility enhancements
   * @internal
   */
  protected _applyAccessibility(): void {
    const tokens = this._getTokens();

    // Set loading state
    if (tokens.loading) {
      this.setAttribute('aria-busy', 'true');
    } else {
      this.removeAttribute('aria-busy');
    }

    // Set disabled state
    if (tokens.disabled) {
      this.setAttribute('aria-disabled', 'true');
      this.style.pointerEvents = 'none';
      this.style.opacity = '0.6';
    } else {
      this.removeAttribute('aria-disabled');
      this.style.pointerEvents = '';
      this.style.opacity = '';
    }

    // Add tab list label
    const label = this.getAttribute('label');
    if (label && this._tabsList) {
      this._tabsList.setAttribute('aria-label', label);
    }
  }

  /**
   * Attaches event listeners for tab interactions
   * @internal
   */
  protected _attachEventListeners(): void {
    if (!this._tabsList) return;

    // Click handler for tab switching
    this._tabsList.addEventListener('click', (event) => {
      const tab = (event.target as HTMLElement).closest('k-tab');
      if (!tab) return;

      const targetId = tab.getAttribute('target');
      if (targetId && !tab.hasAttribute('disabled')) {
        this._setActiveTab(tab as HTMLElement, targetId);
        this._switchToTab(targetId);
      }
    });

    // Keyboard navigation
    this._tabsList.addEventListener('keydown', (event) => {
      const tab = event.target as HTMLElement;
      if (!tab || tab.tagName.toLowerCase() !== 'k-tab') return;

      const tabs = Array.from(this._tabsList!.querySelectorAll('k-tab'));
      const currentIndex = tabs.indexOf(tab);

      let nextIndex: number | null = null;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = currentIndex + 1 >= tabs.length ? 0 : currentIndex + 1;
          event.preventDefault();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex = currentIndex - 1 < 0 ? tabs.length - 1 : currentIndex - 1;
          event.preventDefault();
          break;
        case 'Home':
          nextIndex = 0;
          event.preventDefault();
          break;
        case 'End':
          nextIndex = tabs.length - 1;
          event.preventDefault();
          break;
        case 'Enter':
        case ' ':
          const targetId = tab.getAttribute('target');
          if (targetId) {
            this._setActiveTab(tab, targetId);
            this._switchToTab(targetId);
          }
          event.preventDefault();
          break;
      }

      if (nextIndex !== null) {
        const nextTab = tabs[nextIndex] as HTMLElement;
        if (!nextTab.hasAttribute('disabled')) {
          nextTab.focus();
        }
      }
    });
  }

  /**
   * Programmatically switch to a specific tab
   * @param tabId - The target ID of the tab to activate
   */
  public switchToTab(tabId: string): void {
    if (!this._tabsList) return;

    const tab = this._tabsList.querySelector(`k-tab[target="${tabId}"]`) as HTMLElement;
    if (tab) {
      this._setActiveTab(tab, tabId);
      this._switchToTab(tabId);
    }
  }

  /**
   * Get the currently active tab ID
   * @returns The ID of the currently active tab
   */
  public getActiveTab(): string | null {
    return this._currentActiveTab;
  }
}

customElements.define('k-tabs', KTabsElement);