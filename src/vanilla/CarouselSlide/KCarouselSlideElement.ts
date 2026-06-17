/**
 * @fileoverview KCarouselSlideElement — Individual Carousel Slide Component
 * 
 * A semantic wrapper for carousel slide content that works with KCarouselElement.
 * Provides accessibility attributes and responsive behavior.
 */

import { KBaseElement } from '../KBaseElement.js';

/**
 * Carousel slide component for use within k-carousel.
 * 
 * @example Basic Slide
 * ```html
 * <k-carousel-slide>
 *   <img src="slide1.jpg" alt="Product 1">
 *   <h3>Product Name</h3>
 *   <p>Product description goes here.</p>
 * </k-carousel-slide>
 * ```
 * 
 * @example Slide with Custom Styling
 * ```html
 * <k-carousel-slide v="surface padding:6">
 *   <div class="slide-content">
 *     <h2>Slide Title</h2>
 *     <p>Slide content with custom styling.</p>
 *   </div>
 * </k-carousel-slide>
 * ```
 * 
 * Features:
 * - Semantic slide structure with ARIA support
 * - Responsive content scaling
 * - Custom styling through v attribute
 * - Works with all carousel types (classic, cards, infinite, fade, vertical)
 */
export class KCarouselSlideElement extends KBaseElement {
  private _slideContent: HTMLElement | null = null;

  constructor() {
    super();
  }

  protected _render(): void {
    // Create main slide container
    this._slideContent = document.createElement('div');
    this._slideContent.className = 'k-carousel-slide-content';

    // Move all existing content into the slide container
    while (this.firstChild) {
      this._slideContent.appendChild(this.firstChild);
    }

    // Add the slide container back to the component
    this.appendChild(this._slideContent);
  }

  protected _applyAccessibility(): void {
    // Set slide role and attributes
    this.setAttribute('role', 'group');
    this.setAttribute('aria-roledescription', 'slide');
    
    // Set tabindex for keyboard navigation
    this.setAttribute('tabindex', '0');

    // If slide has a heading, use it as the accessible name
    const heading = this.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      this.setAttribute('aria-labelledby', heading.id || this._generateHeadingId(heading));
    }

    // Set loading state if parent carousel is loading
    const tokens = this._getTokens();
    if (tokens.loading) {
      this.setAttribute('aria-busy', 'true');
    } else {
      this.removeAttribute('aria-busy');
    }

    // Set disabled state
    if (tokens.disabled) {
      this.setAttribute('aria-disabled', 'true');
      this.setAttribute('tabindex', '-1');
    } else {
      this.removeAttribute('aria-disabled');
      if (!this.hasAttribute('tabindex') || this.getAttribute('tabindex') === '-1') {
        this.setAttribute('tabindex', '0');
      }
    }
  }

  private _generateHeadingId(heading: Element): string {
    if (!heading.id) {
      heading.id = `slide-heading-${Math.random().toString(36).substr(2, 9)}`;
    }
    return heading.id;
  }

  /**
   * Get the slide's content element for external manipulation
   */
  getContentElement(): HTMLElement | null {
    return this._slideContent;
  }

  /**
   * Check if this slide has media content (images, videos)
   */
  hasMediaContent(): boolean {
    return !!(this.querySelector('img, video, picture, iframe'));
  }

  /**
   * Get the slide's accessible name (from aria-label, aria-labelledby, or heading)
   */
  getAccessibleName(): string {
    // Check aria-label first
    const ariaLabel = this.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    // Check aria-labelledby
    const labelledBy = this.getAttribute('aria-labelledby');
    if (labelledBy) {
      const labelElement = document.getElementById(labelledBy);
      if (labelElement) return labelElement.textContent?.trim() || '';
    }

    // Fall back to first heading text
    const heading = this.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) return heading.textContent?.trim() || '';

    // Fall back to first text content
    const textContent = this.textContent?.trim();
    if (textContent) {
      return textContent.length > 50 ? textContent.substring(0, 47) + '...' : textContent;
    }

    return 'Slide';
  }

  /**
   * Set focus on the slide for accessibility
   */
  focusSlide(): void {
    this.focus();
  }

  /**
   * Get all focusable elements within the slide
   */
  getFocusableElements(): HTMLElement[] {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      'details summary',
      'iframe',
      'audio[controls]',
      'video[controls]'
    ].join(', ');

    return Array.from(this.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }

  /**
   * Check if slide content is loaded (useful for lazy loading)
   */
  isContentLoaded(): boolean {
    const images = this.querySelectorAll('img');
    const videos = this.querySelectorAll('video');

    // Check if all images are loaded
    for (const img of Array.from(images)) {
      if (!img.complete || img.naturalHeight === 0) {
        return false;
      }
    }

    // Check if all videos are loaded (at least metadata)
    for (const video of Array.from(videos)) {
      if (video.readyState < 1) { // HAVE_METADATA
        return false;
      }
    }

    return true;
  }

  /**
   * Dispatch a slide-specific event
   */
  private _dispatchSlideEvent(eventName: string, detail?: Record<string, unknown>): void {
    this.dispatchEvent(
      new CustomEvent(`k:slide-${eventName}`, {
        bubbles: true,
        composed: true,
        detail: {
          slide: this,
          slideName: this.getAccessibleName(),
          hasMedia: this.hasMediaContent(),
          isLoaded: this.isContentLoaded(),
          ...detail
        }
      })
    );
  }

  protected _attachEventListeners(): void {
    // Dispatch focus events for carousel to handle
    this.addEventListener('focus', () => {
      this._dispatchSlideEvent('focus');
    });

    this.addEventListener('blur', () => {
      this._dispatchSlideEvent('blur');
    });

    // Handle clicks for analytics or custom behavior
    this.addEventListener('click', (event) => {
      this._dispatchSlideEvent('click', { 
        originalEvent: event,
        clickedElement: event.target 
      });
    });

    // Monitor content loading for lazy-loaded content
    const images = this.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete) {
        img.addEventListener('load', () => {
          this._dispatchSlideEvent('content-loaded', { type: 'image', element: img });
        });
        img.addEventListener('error', () => {
          this._dispatchSlideEvent('content-error', { type: 'image', element: img });
        });
      }
    });

    const videos = this.querySelectorAll('video');
    videos.forEach(video => {
      video.addEventListener('loadedmetadata', () => {
        this._dispatchSlideEvent('content-loaded', { type: 'video', element: video });
      });
      video.addEventListener('error', () => {
        this._dispatchSlideEvent('content-error', { type: 'video', element: video });
      });
    });
  }

  protected _detachEventListeners(): void {
    // Event listeners are automatically removed when element is disconnected
    // But we can add specific cleanup here if needed
  }

  connectedCallback(): void {
    super.connectedCallback();
    
    // Dispatch slide mounted event
    this._dispatchSlideEvent('mounted');
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    
    // Dispatch slide unmounted event  
    this._dispatchSlideEvent('unmounted');
  }
}

// Register the custom element
customElements.define('k-carousel-slide', KCarouselSlideElement);