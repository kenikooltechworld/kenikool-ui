/**
 * KNavbarHorizontalElement — <k-navbar-horizontal> Web Custom Element.
 *
 * Classic horizontal navigation bar pattern, most common for websites.
 * Responsive: collapses to hamburger menu on mobile (< 768px).
 * Overflow handling: Excess links collapse into "More" dropdown on desktop.
 *
 * Usage:
 *   <k-navbar-horizontal v="sticky" max-visible-links="6">
 *     <img slot="logo" src="logo.svg" alt="Brand">
 *     <a href="/">Home</a>
 *     <a href="/about">About</a>
 *     <a href="/products">Products</a>
 *     <div slot="actions">
 *       <k-button v="ghost sm">Login</k-button>
 *       <k-button v="filled sm">Sign Up</k-button>
 *     </div>
 *   </k-navbar-horizontal>
 *
 * Slots:
 * - logo: Brand logo (typically <img>)
 * - default: Navigation links (<a> elements)
 * - actions: Right-side action buttons/elements
 *
 * Attributes from v:
 * - sticky: Makes navbar stick to top on scroll (data-sticky)
 * - variant: "default" | "bordered" | "elevated" | "transparent"
 * - size: "sm" | "md" | "lg"
 *
 * Attributes:
 * - max-visible-links: Maximum number of nav links to show before collapsing to "More" (default: 6)
 *
 * Mobile behavior (< 768px):
 * - Shows hamburger menu button
 * - Nav links + actions collapse into slide-in drawer
 * - Drawer can be opened/closed via button or programmatically
 * - Escape key closes drawer
 * - Click outside closes drawer
 *
 * Desktop overflow behavior (>= 768px):
 * - If links exceed max-visible-links, excess links move to "More" dropdown
 * - "More" button appears with chevron icon
 * - Click to toggle dropdown
 * - Click outside to close
 * - Escape key closes dropdown
 */

import { KBaseElement } from '../KBaseElement.js';
import { generateId } from '../../core/utils/generateId.js';
import { getIcon } from '../../core/icons.js';

/** Hamburger icon SVG (3 bars) */
const HAMBURGER_ICON = `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`;

/** Close icon SVG (X) */
const CLOSE_ICON = `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`;

export class KNavbarHorizontalElement extends KBaseElement {
  private _nav: HTMLElement | null = null;
  private _container: HTMLElement | null = null;
  private _logoSlot: HTMLElement | null = null;
  private _linksContainer: HTMLElement | null = null;
  private _linksCol: HTMLElement | null = null;
  private _actionsSlot: HTMLElement | null = null;
  private _mobileToggle: HTMLButtonElement | null = null;
  private _mobileDrawer: HTMLElement | null = null;
  private _mobileOverlay: HTMLElement | null = null;
  private _isOpen = false;

  // "More" dropdown properties
  private _moreButton: HTMLButtonElement | null = null;
  private _moreDropdown: HTMLElement | null = null;
  private _moreDropdownOpen = false;
  private _allLinks: HTMLAnchorElement[] = [];
  
  // Resize observer for responsive link management
  private _resizeObserver: ResizeObserver | null = null;

  private _navId: string = '';

  static get observedAttributes(): string[] {
    return [...super.observedAttributes, 'sticky', 'open'];
  }

  // ─── Bound event handlers ─────────────────────────────────────────────────

  private readonly _onToggle = (): void => {
    this._isOpen ? this.closeMobileMenu() : this.openMobileMenu();
  };

  private readonly _onOverlayClick = (): void => {
    this.closeMobileMenu();
  };

  private readonly _onEscape = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      if (this._isOpen) {
        this.closeMobileMenu();
      }
      if (this._moreDropdownOpen) {
        this.closeMoreDropdown();
      }
    }
  };

  private readonly _onLinkClick = (): void => {
    // Auto-close mobile menu when a navigation link is clicked
    if (this._isOpen) {
      this.closeMobileMenu();
    }
  };

  private readonly _onMoreToggle = (): void => {
    this._moreDropdownOpen ? this.closeMoreDropdown() : this.openMoreDropdown();
  };

  private readonly _onDocumentClick = (e: MouseEvent): void => {
    // Close "More" dropdown when clicking outside
    if (this._moreDropdownOpen && this._moreButton && this._moreDropdown) {
      const target = e.target as Node;
      if (!this._moreButton.contains(target) && !this._moreDropdown.contains(target)) {
        this.closeMoreDropdown();
      }
    }
  };

  // ─── KBaseElement implementations ─────────────────────────────────────────

  protected _render(): void {
    if (this._nav) return; // Already rendered

    this._navId = generateId('navbar');

    // Create semantic <nav> element
    const nav = document.createElement('nav');
    nav.className = 'k-navbar-horizontal__nav';
    nav.id = this._navId;

    // Inner container - k-row provides responsive behavior automatically
    const container = document.createElement('k-row');
    container.setAttribute('v', 'justify-between align-center');
    container.className = 'k-navbar-horizontal__container';

    // Logo column
    const logoCol = document.createElement('k-col');
    logoCol.className = 'k-navbar-horizontal__logo-col';
    const logoContent = this._extractSlot('logo');
    if (logoContent.length > 0) {
      logoContent.forEach(node => logoCol.appendChild(node));
    }
    container.appendChild(logoCol);
    this._logoSlot = logoCol;

    // Links column (grows to fill space)
    const linksCol = document.createElement('k-col');
    linksCol.className = 'k-navbar-horizontal__links-col';
    
    // Links container - plain div with flex (NOT k-stack to avoid flex-wrap)
    const linksContainer = document.createElement('div');
    linksContainer.className = 'k-navbar-horizontal__links';
    const links = this._extractDefaultSlot();
    
    // Store all anchor links
    this._allLinks = links.filter(node => node instanceof HTMLAnchorElement) as HTMLAnchorElement[];
    
    // Add links to container
    links.forEach(node => {
      if (node instanceof HTMLAnchorElement) {
        node.addEventListener('click', this._onLinkClick);
      }
      linksContainer.appendChild(node);
    });
    
    // Create "More" button (initially hidden, shown if needed)
    const moreButton = document.createElement('button');
    moreButton.type = 'button';
    moreButton.className = 'k-navbar-horizontal__more-button';
    moreButton.innerHTML = `More ${getIcon('chevronDown', 16)}`;
    moreButton.setAttribute('aria-label', 'Show more navigation links');
    moreButton.setAttribute('aria-expanded', 'false');
    moreButton.setAttribute('aria-haspopup', 'true');
    moreButton.style.display = 'none'; // Hidden by default
    linksContainer.appendChild(moreButton);
    this._moreButton = moreButton;
    
    linksCol.appendChild(linksContainer);
    container.appendChild(linksCol);
    this._linksContainer = linksContainer;
    this._linksCol = linksCol;

    // Create "More" dropdown (initially hidden)
    const moreDropdown = document.createElement('div');
    moreDropdown.className = 'k-navbar-horizontal__more-dropdown';
    moreDropdown.setAttribute('role', 'menu');
    moreDropdown.style.display = 'none'; // Hidden by default
    linksCol.appendChild(moreDropdown);
    this._moreDropdown = moreDropdown;

    // Actions column
    const actionsCol = document.createElement('k-col');
    actionsCol.className = 'k-navbar-horizontal__actions-col';
    const actionsStack = document.createElement('k-stack');
    actionsStack.setAttribute('v', 'horizontal gap-3 align-center');
    actionsStack.className = 'k-navbar-horizontal__actions';
    const actions = this._extractSlot('actions');
    if (actions.length > 0) {
      actions.forEach(node => actionsStack.appendChild(node));
    }
    actionsCol.appendChild(actionsStack);
    container.appendChild(actionsCol);
    this._actionsSlot = actionsStack;

    // Mobile: Hamburger toggle button
    const mobileToggle = document.createElement('button');
    mobileToggle.type = 'button';
    mobileToggle.className = 'k-navbar-horizontal__mobile-toggle';
    mobileToggle.innerHTML = HAMBURGER_ICON;
    mobileToggle.setAttribute('aria-label', 'Open navigation menu');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-controls', `${this._navId}-drawer`);
    container.appendChild(mobileToggle);
    this._mobileToggle = mobileToggle;

    nav.appendChild(container);
    this._container = container;
    this._nav = nav;

    // Mobile: Overlay (click outside to close)
    const overlay = document.createElement('div');
    overlay.className = 'k-navbar-horizontal__mobile-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    this._mobileOverlay = overlay;

    // Mobile: Drawer (slide-in from right) - using k-box component
    const drawer = document.createElement('k-box');
    drawer.setAttribute('v', 'surface p-6 r-none');
    drawer.className = 'k-navbar-horizontal__mobile-drawer';
    drawer.id = `${this._navId}-drawer`;
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Mobile navigation menu');

    // Clone links and actions into drawer using k-stack
    const drawerStack = document.createElement('k-stack');
    drawerStack.setAttribute('v', 'gap-6');
    
    const drawerLinks = document.createElement('k-stack');
    drawerLinks.setAttribute('v', 'gap-2');
    drawerLinks.className = 'k-navbar-horizontal__mobile-links';
    // Clone ALL links (including those that might be in More dropdown)
    this._allLinks.forEach(link => {
      const clonedLink = link.cloneNode(true) as HTMLAnchorElement;
      clonedLink.addEventListener('click', this._onLinkClick);
      drawerLinks.appendChild(clonedLink);
    });
    drawerStack.appendChild(drawerLinks);

    if (actions.length > 0) {
      const drawerActions = document.createElement('k-stack');
      drawerActions.setAttribute('v', 'gap-3');
      drawerActions.className = 'k-navbar-horizontal__mobile-actions';
      actions.forEach(node => {
        drawerActions.appendChild(node.cloneNode(true));
      });
      drawerStack.appendChild(drawerActions);
    }

    drawer.appendChild(drawerStack);
    this._mobileDrawer = drawer;

    // Clear original content and append new structure
    this.textContent = '';
    this.appendChild(nav);
    this.appendChild(overlay);
    this.appendChild(drawer);
    
    // Set up resize observer to handle window size changes
    this._resizeObserver = new ResizeObserver(() => {
      // Use RAF to debounce resize calculations
      requestAnimationFrame(() => this._reorganizeLinks());
    });
    if (this._linksCol) {
      this._resizeObserver.observe(this._linksCol);
    }
    
    // Initial reorganization - wait for layout to settle
    setTimeout(() => {
      console.log('[Navbar] Running initial reorganization...');
      this._reorganizeLinks();
    }, 100);
  }

  protected _applyAccessibility(): void {
    if (!this._nav) return;

    // Semantic nav with role and label
    this._nav.setAttribute('role', 'navigation');
    this._nav.setAttribute('aria-label', 'Main navigation');

    // Mobile toggle state
    if (this._mobileToggle) {
      this._mobileToggle.setAttribute('aria-expanded', String(this._isOpen));
    }
  }

  protected _attachEventListeners(): void {
    // Mobile toggle button
    this._mobileToggle?.addEventListener('click', this._onToggle);

    // Mobile overlay click (close on outside click)
    this._mobileOverlay?.addEventListener('click', this._onOverlayClick);

    // Escape key (close mobile menu or More dropdown)
    document.addEventListener('keydown', this._onEscape);
    
    // "More" button toggle
    this._moreButton?.addEventListener('click', this._onMoreToggle);
    
    // Document click (close More dropdown on outside click)
    document.addEventListener('click', this._onDocumentClick);
  }

  protected _detachEventListeners(): void {
    this._mobileToggle?.removeEventListener('click', this._onToggle);
    this._mobileOverlay?.removeEventListener('click', this._onOverlayClick);
    document.removeEventListener('keydown', this._onEscape);
    this._moreButton?.removeEventListener('click', this._onMoreToggle);
    document.removeEventListener('click', this._onDocumentClick);

    // Remove link click listeners
    this._linksContainer?.querySelectorAll('a').forEach(link => {
      link.removeEventListener('click', this._onLinkClick);
    });
    
    // Disconnect resize observer
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Opens the mobile navigation drawer.
   * Only applies on mobile viewport (< 768px).
   */
  public openMobileMenu(): void {
    if (this._isOpen) return;

    this._isOpen = true;
    this.setAttribute('data-mobile-open', 'true');

    // Update hamburger to close icon
    if (this._mobileToggle) {
      this._mobileToggle.innerHTML = CLOSE_ICON;
      this._mobileToggle.setAttribute('aria-label', 'Close navigation menu');
      this._mobileToggle.setAttribute('aria-expanded', 'true');
    }

    // Show overlay and drawer
    this._mobileOverlay?.classList.add('k-navbar-horizontal__mobile-overlay--visible');
    this._mobileDrawer?.classList.add('k-navbar-horizontal__mobile-drawer--open');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Dispatch event
    this._dispatch('menu:open');
  }

  /**
   * Closes the mobile navigation drawer.
   */
  public closeMobileMenu(): void {
    if (!this._isOpen) return;

    this._isOpen = false;
    this.removeAttribute('data-mobile-open');

    // Update close icon back to hamburger
    if (this._mobileToggle) {
      this._mobileToggle.innerHTML = HAMBURGER_ICON;
      this._mobileToggle.setAttribute('aria-label', 'Open navigation menu');
      this._mobileToggle.setAttribute('aria-expanded', 'false');
    }

    // Hide overlay and drawer
    this._mobileOverlay?.classList.remove('k-navbar-horizontal__mobile-overlay--visible');
    this._mobileDrawer?.classList.remove('k-navbar-horizontal__mobile-drawer--open');

    // Restore body scroll
    document.body.style.overflow = '';

    // Dispatch event
    this._dispatch('menu:close');
  }

  /**
   * Opens the "More" dropdown menu (desktop only).
   */
  public openMoreDropdown(): void {
    if (this._moreDropdownOpen || !this._moreDropdown || !this._moreButton) return;

    this._moreDropdownOpen = true;
    this._moreDropdown.style.display = 'block';
    this._moreButton.setAttribute('aria-expanded', 'true');
    
    // Dispatch event
    this._dispatch('more:open');
  }

  /**
   * Closes the "More" dropdown menu.
   */
  public closeMoreDropdown(): void {
    if (!this._moreDropdownOpen || !this._moreDropdown || !this._moreButton) return;

    this._moreDropdownOpen = false;
    this._moreDropdown.style.display = 'none';
    this._moreButton.setAttribute('aria-expanded', 'false');
    
    // Dispatch event
    this._dispatch('more:close');
  }

  /**
   * Reorganizes navigation links based on available space.
   * Links that don't fit are moved to the "More" dropdown.
   * Called automatically on render and window resize.
   */
  private _reorganizeLinks(): void {
    if (!this._linksContainer || !this._moreButton || !this._moreDropdown || !this._linksCol) {
      console.warn('[Navbar] Cannot reorganize - missing DOM elements');
      return;
    }
    
    const totalLinks = this._allLinks.length;
    if (totalLinks === 0) {
      console.warn('[Navbar] No links to reorganize');
      return;
    }
    
    console.log(`[Navbar] Reorganizing ${totalLinks} links...`);
    
    // Get available width for links (container width minus More button)
    const containerWidth = this._linksContainer.offsetWidth;
    const moreButtonWidth = 100; // Approximate width for "More" button with text + icon
    const availableWidth = containerWidth - moreButtonWidth - 40; // Extra buffer for safety
    
    console.log(`[Navbar] Container width: ${containerWidth}px, Available: ${availableWidth}px`);
    
    // Show all links initially to measure them
    this._allLinks.forEach(link => {
      link.style.display = 'inline-flex';
    });
    this._moreButton.style.display = 'none';
    
    // Measure cumulative width of links
    let cumulativeWidth = 0;
    let visibleCount = 0;
    
    for (let i = 0; i < totalLinks; i++) {
      const link = this._allLinks[i];
      if (!link) continue; // Skip if link is undefined
      
      const linkWidth = link.offsetWidth;
      
      // Check if adding this link would exceed available width
      if (cumulativeWidth + linkWidth <= availableWidth) {
        cumulativeWidth += linkWidth;
        visibleCount++;
      } else {
        break; // Stop - this link and all after it won't fit
      }
    }
    
    console.log(`[Navbar] Visible: ${visibleCount}, Hidden: ${totalLinks - visibleCount}`);
    
    // If all links fit, hide More button
    if (visibleCount === totalLinks) {
      this._allLinks.forEach(link => {
        link.style.display = 'inline-flex';
      });
      this._moreButton.style.display = 'none';
      this._moreDropdown.style.display = 'none';
      this._moreDropdown.innerHTML = '';
      console.log('[Navbar] All links fit - More button hidden');
      return;
    }
    
    // Otherwise, hide overflow links and show More button
    const visibleLinks = this._allLinks.slice(0, visibleCount);
    const hiddenLinks = this._allLinks.slice(visibleCount);
    
    // Show visible links
    visibleLinks.forEach(link => {
      link.style.display = 'inline-flex';
    });
    
    // Hide overflow links from main navbar
    hiddenLinks.forEach(link => {
      link.style.display = 'none';
    });
    
    // Populate More dropdown with hidden links
    this._moreDropdown.innerHTML = '';
    hiddenLinks.forEach(link => {
      const clonedLink = link.cloneNode(true) as HTMLAnchorElement;
      clonedLink.className = 'k-navbar-horizontal__more-link';
      clonedLink.style.display = 'block'; // Dropdown links are block
      clonedLink.setAttribute('role', 'menuitem');
      clonedLink.addEventListener('click', () => {
        this.closeMoreDropdown();
        // Navigate by triggering the original link
        link.click();
      });
      this._moreDropdown?.appendChild(clonedLink);
    });
    
    // Show More button
    this._moreButton.style.display = 'inline-flex';
    console.log('[Navbar] More button shown');
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  /**
   * Extracts nodes from a named slot attribute.
   */
  private _extractSlot(slotName: string): Node[] {
    return Array.from(this.childNodes).filter(
      node => node instanceof HTMLElement && node.getAttribute('slot') === slotName
    );
  }

  /**
   * Extracts default slot (nodes without slot attribute).
   */
  private _extractDefaultSlot(): Node[] {
    return Array.from(this.childNodes).filter(
      node => {
        if (!(node instanceof HTMLElement)) {
          // Keep text nodes that are non-empty
          return node.nodeType === Node.TEXT_NODE && node.textContent?.trim();
        }
        const slot = node.getAttribute('slot');
        return !slot || slot === 'default';
      }
    );
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    // Handle programmatic open/close via attribute
    if (name === 'open' && oldValue !== newValue) {
      if (newValue !== null) {
        this.openMobileMenu();
      } else {
        this.closeMobileMenu();
      }
    }
  }
}

customElements.define('k-navbar-horizontal', KNavbarHorizontalElement);
