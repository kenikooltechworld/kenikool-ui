import { KBaseElement } from '../KBaseElement.js';
import { sanitizeText, sanitizeHtml } from '../../core/utils/sanitize.js';

/**
 * KCardElement — <k-card> Web Custom Element.
 *
 * A flexible container component supporting 10 variants:
 * - default, elevated, outlined, filled, glass, gradient
 * - interactive, horizontal, compact, feature
 *
 * Supports named slots for structured content:
 * - header (via slot="header" or header attribute)
 * - body (default slot or content)
 * - footer (via slot="footer" or footer attribute)
 * - image (via slot="image" or image attribute)
 *
 * Usage:
 *   <k-card v="elevated lg">
 *     <div slot="header">Title</div>
 *     <div>Content goes here</div>
 *     <div slot="footer">Actions</div>
 *   </k-card>
 *
 *   Or with attributes:
 *   <k-card v="filled" header="Title" footer="Actions">
 *     Content goes here
 *   </k-card>
 */
export class KCardElement extends KBaseElement {
  private _headerEl: HTMLElement | null = null;
  private _bodyEl: HTMLElement | null = null;
  private _footerEl: HTMLElement | null = null;
  private _imageEl: HTMLElement | null = null;
  private _clickHandler = (e: MouseEvent) => this._handleClick(e);

  static get observedAttributes(): string[] {
    return [...super.observedAttributes, 'header', 'footer', 'image', 'hoverable', 'clickable', 'alt'];
  }

  protected _render(): void {
    if (this._bodyEl) return; // Already rendered

    const tokens = this._getTokens();
    const variant = tokens.variant;

    // Capture existing content before clearing
    const existingContent = Array.from(this.childNodes);

    // Create main card structure
    const structure = document.createElement('div');
    structure.className = 'k-card__container';

    // 1. Image area (top media)
    const imageAttr = this.getAttribute('image');
    const imageSlot = existingContent.find(
      node => node instanceof HTMLElement && node.getAttribute('slot') === 'image'
    ) as HTMLElement | undefined;

    if (imageAttr || imageSlot) {
      const imageEl = document.createElement('div');
      imageEl.className = 'k-card__image';

      if (imageSlot) {
        imageEl.appendChild(imageSlot);
      } else if (imageAttr) {
        const img = document.createElement('img');
        img.src = imageAttr;
        img.alt = sanitizeText(this.getAttribute('alt') || '');
        imageEl.appendChild(img);
      }

      structure.appendChild(imageEl);
      this._imageEl = imageEl;
    }

    // 2. Header
    const headerAttr = this.getAttribute('header');
    const headerSlot = existingContent.find(
      node => node instanceof HTMLElement && node.getAttribute('slot') === 'header'
    ) as HTMLElement | undefined;

    if (headerAttr || headerSlot) {
      const headerEl = document.createElement('div');
      headerEl.className = 'k-card__header';

      if (headerSlot) {
        headerEl.appendChild(headerSlot);
      } else if (headerAttr) {
        headerEl.textContent = sanitizeText(headerAttr);
      }

      structure.appendChild(headerEl);
      this._headerEl = headerEl;
    }

    // 3. Body (default content)
    const bodyEl = document.createElement('div');
    bodyEl.className = 'k-card__body';

    // Move default slot content (anything not header/footer/image)
    const bodyContent = existingContent.filter(
      node => {
        if (!(node instanceof HTMLElement)) return true; // Include text nodes
        const slot = node.getAttribute('slot');
        return !slot || slot === 'body';
      }
    );

    bodyContent.forEach(node => bodyEl.appendChild(node));
    structure.appendChild(bodyEl);
    this._bodyEl = bodyEl;

    // 4. Footer
    const footerAttr = this.getAttribute('footer');
    const footerSlot = existingContent.find(
      node => node instanceof HTMLElement && node.getAttribute('slot') === 'footer'
    ) as HTMLElement | undefined;

    if (footerAttr || footerSlot) {
      const footerEl = document.createElement('div');
      footerEl.className = 'k-card__footer';

      if (footerSlot) {
        footerEl.appendChild(footerSlot);
      } else if (footerAttr) {
        footerEl.textContent = sanitizeText(footerAttr);
      }

      structure.appendChild(footerEl);
      this._footerEl = footerEl;
    }

    // Clear and append structure
    this.textContent = '';
    this.appendChild(structure);
  }

  protected _applyAccessibility(): void {
    const tokens = this._getTokens();
    const clickable = this.getAttribute('clickable') !== null;
    const variant = tokens.variant;

    // Interactive and clickable cards get button role
    if (variant === 'interactive' || clickable) {
      this.setAttribute('role', 'button');
      this.setAttribute('tabindex', tokens.disabled ? '-1' : '0');
    } else {
      this.removeAttribute('role');
      this.removeAttribute('tabindex');
    }

    // Set aria-disabled
    this.setAttribute('aria-disabled', String(tokens.disabled));

    // Set aria-busy for loading state
    this.setAttribute('aria-busy', String(tokens.loading));
  }

  protected _attachEventListeners(): void {
    const clickable = this.getAttribute('clickable') !== null;
    const variant = this._getTokens().variant;

    if (variant === 'interactive' || clickable) {
      this.addEventListener('click', this._clickHandler);
      this.addEventListener('keydown', this._handleKeydown.bind(this));
    }

    // Spotlight and Magnetic cards need mouse tracking
    if (variant === 'spotlight') {
      this.addEventListener('mousemove', this._handleSpotlightMove.bind(this));
      this.addEventListener('mouseleave', this._handleSpotlightLeave.bind(this));
    }

    if (variant === 'magnetic') {
      this.addEventListener('mousemove', this._handleMagneticMove.bind(this));
      this.addEventListener('mouseleave', this._handleMagneticLeave.bind(this));
    }
  }

  protected _detachEventListeners(): void {
    this.removeEventListener('click', this._clickHandler);
    this.removeEventListener('keydown', this._handleKeydown.bind(this));
    this.removeEventListener('mousemove', this._handleSpotlightMove.bind(this));
    this.removeEventListener('mouseleave', this._handleSpotlightLeave.bind(this));
    this.removeEventListener('mousemove', this._handleMagneticMove.bind(this));
    this.removeEventListener('mouseleave', this._handleMagneticLeave.bind(this));
  }

  private _handleClick(e: MouseEvent): void {
    const tokens = this._getTokens();
    if (tokens.disabled || tokens.loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Dispatch custom event
    this._dispatch('click', { originalEvent: e });
  }

  private _handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick(e as any);
    }
  }

  // Spotlight effect: track mouse position for radial glow
  private _handleSpotlightMove(e: MouseEvent): void {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.style.setProperty('--mouse-x', `${x}px`);
    this.style.setProperty('--mouse-y', `${y}px`);
  }

  private _handleSpotlightLeave(): void {
    this.style.removeProperty('--mouse-x');
    this.style.removeProperty('--mouse-y');
  }

  // Magnetic effect: 3D tilt following cursor
  private _handleMagneticMove(e: MouseEvent): void {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-10 to +10 degrees)
    const rotateY = ((x - centerX) / centerX) * 10;
    const rotateX = ((centerY - y) / centerY) * 10;
    
    this.style.setProperty('--rotate-x', `${rotateX}deg`);
    this.style.setProperty('--rotate-y', `${rotateY}deg`);
  }

  private _handleMagneticLeave(): void {
    this.style.setProperty('--rotate-x', '0deg');
    this.style.setProperty('--rotate-y', '0deg');
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    // Re-render when slot-related attributes change
    if (['header', 'footer', 'image', 'alt'].includes(name) && oldValue !== newValue && this._bodyEl) {
      // Re-render the component
      this._bodyEl = null;
      this._headerEl = null;
      this._footerEl = null;
      this._imageEl = null;
      this._render();
    }

    // Re-attach event listeners when hoverable/clickable changes
    if (['hoverable', 'clickable'].includes(name) && oldValue !== newValue) {
      this._detachEventListeners();
      this._attachEventListeners();
      this._applyAccessibility();
    }
  }
}

customElements.define('k-card', KCardElement);
