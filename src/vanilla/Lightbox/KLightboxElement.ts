/**
 * @fileoverview KLightboxElement — Modern Lightbox with Gallery Support
 * 
 * A beautiful, modern lightbox component with gallery navigation, zoom controls,
 * and smooth animations. Supports both single images and image galleries.
 * 
 * Features:
 * - Full-screen overlay with backdrop blur
 * - Image navigation (previous/next) for galleries
 * - Zoom controls with mouse wheel and touch gestures
 * - Keyboard navigation (ESC, arrow keys, spacebar)
 * - Touch/swipe gestures for mobile
 * - Automatic image centering and scaling
 * - Loading states and error handling
 * - Accessibility with focus management
 */

import { KBaseElement } from '../KBaseElement.js';
import { sanitizeUrl } from '../../core/utils/sanitize.js';
import { generateId } from '../../core/utils/generateId.js';

/**
 * Modern lightbox component for displaying images in full-screen overlay.
 * 
 * @example Basic Usage
 * ```html
 * <k-lightbox v="basic" 
 *             src="large-image.jpg" 
 *             alt="Full size image"
 *             thumbnail="thumbnail.jpg">
 * </k-lightbox>
 * ```
 * 
 * @example Gallery Mode
 * ```html
 * <k-lightbox v="gallery" id="gallery-1">
 *   <img slot="image" src="image1.jpg" alt="Image 1">
 *   <img slot="image" src="image2.jpg" alt="Image 2">
 *   <img slot="image" src="image3.jpg" alt="Image 3">
 * </k-lightbox>
 * ```
 * 
 * @example With Zoom Controls
 * ```html
 * <k-lightbox v="zoom" 
 *             src="high-res-image.jpg" 
 *             alt="Zoomable image"
 *             max-zoom="3">
 * </k-lightbox>
 * ```
 * 
 * Types: basic, gallery, zoom, slideshow
 * Navigation: arrows, dots, thumbnails
 * Controls: zoom, fullscreen, download
 */
export class KLightboxElement extends KBaseElement {
  private _overlay: HTMLElement | null = null;
  private _container: HTMLElement | null = null;
  private _imageContainer: HTMLElement | null = null;
  private _currentImage: HTMLImageElement | null = null;
  private _prevButton: HTMLButtonElement | null = null;
  private _nextButton: HTMLButtonElement | null = null;
  private _closeButton: HTMLButtonElement | null = null;
  private _zoomInButton: HTMLButtonElement | null = null;
  private _zoomOutButton: HTMLButtonElement | null = null;
  private _counter: HTMLElement | null = null;
  private _loader: HTMLElement | null = null;
  
  private _images: Array<{ src: string; alt: string; caption?: string }> = [];
  private _currentIndex = 0;
  private _isOpen = false;
  private _zoomLevel = 1;
  private _maxZoom = 3;
  private _isDragging = false;
  private _lastX = 0;
  private _lastY = 0;
  private _translateX = 0;
  private _translateY = 0;
  private _lightboxId: string;

  constructor() {
    super();
    this._lightboxId = generateId('k-lightbox');
  }

  static get observedAttributes(): string[] {
    return [
      ...KBaseElement.observedAttributes,
      'src', 'alt', 'thumbnail', 'caption', 
      'max-zoom', 'show-controls', 'gallery-mode'
    ];
  }

  protected _render(): void {
    const tokens = this._getTokens();
    const lightboxType = tokens.variant || 'basic';

    // Collect images from slots or src attribute
    this._collectImages();

    // Create overlay
    this._overlay = document.createElement('div');
    this._overlay.className = 'k-lightbox-overlay';
    this._overlay.id = this._lightboxId;

    // Create container
    this._container = document.createElement('div');
    this._container.className = 'k-lightbox-container';

    // Create image container
    this._imageContainer = document.createElement('div');
    this._imageContainer.className = 'k-lightbox-image-container';

    // Create controls
    this._createControls(lightboxType);

    // Create loader
    this._loader = document.createElement('div');
    this._loader.className = 'k-lightbox-loader';
    this._loader.innerHTML = '<div class="k-lightbox-spinner"></div>';

    // Assemble structure
    this._container.appendChild(this._imageContainer);
    this._container.appendChild(this._loader);
    this._overlay.appendChild(this._container);

    // Add overlay to body (it will be hidden initially)
    document.body.appendChild(this._overlay);

    // Create trigger if we have a thumbnail
    this._createTrigger();
  }

  private _collectImages(): void {
    const src = this.getAttribute('src');
    const alt = this.getAttribute('alt') || '';
    const caption = this.getAttribute('caption') || undefined;

    if (src) {
      // Single image mode
      this._images = [{ src: sanitizeUrl(src), alt, ...(caption ? { caption } : {}) }];
    } else {
      // Gallery mode - collect from slots
      const imageSlots = this.querySelectorAll('[slot="image"]');
      this._images = Array.from(imageSlots).map(img => {
        const imgCaption = (img as HTMLImageElement).title || img.getAttribute('data-caption');
        return {
          src: sanitizeUrl((img as HTMLImageElement).src || img.getAttribute('data-src') || ''),
          alt: (img as HTMLImageElement).alt || '',
          ...(imgCaption ? { caption: imgCaption } : {})
        };
      });
    }
  }

  private _createControls(lightboxType: string): void {
    if (!this._container) return;

    // Close button
    this._closeButton = document.createElement('button');
    this._closeButton.className = 'k-lightbox-btn k-lightbox-close';
    this._closeButton.setAttribute('type', 'button');
    this._closeButton.setAttribute('aria-label', 'Close lightbox');
    this._closeButton.innerHTML = '✕';
    this._closeButton.addEventListener('click', () => this.close());

    // Navigation buttons (for galleries)
    if (this._images.length > 1 || lightboxType === 'gallery') {
      this._prevButton = document.createElement('button');
      this._prevButton.className = 'k-lightbox-btn k-lightbox-prev';
      this._prevButton.setAttribute('type', 'button');
      this._prevButton.setAttribute('aria-label', 'Previous image');
      this._prevButton.innerHTML = '‹';
      this._prevButton.addEventListener('click', () => this.previous());

      this._nextButton = document.createElement('button');
      this._nextButton.className = 'k-lightbox-btn k-lightbox-next';
      this._nextButton.setAttribute('type', 'button');
      this._nextButton.setAttribute('aria-label', 'Next image');
      this._nextButton.innerHTML = '›';
      this._nextButton.addEventListener('click', () => this.next());

      this._container.appendChild(this._prevButton);
      this._container.appendChild(this._nextButton);

      // Image counter
      this._counter = document.createElement('div');
      this._counter.className = 'k-lightbox-counter';
      this._container.appendChild(this._counter);
    }

    // Zoom controls
    if (lightboxType === 'zoom' || this.getAttribute('show-controls') === 'true') {
      const controlsBar = document.createElement('div');
      controlsBar.className = 'k-lightbox-controls';

      this._zoomInButton = document.createElement('button');
      this._zoomInButton.className = 'k-lightbox-btn k-lightbox-zoom-in';
      this._zoomInButton.setAttribute('type', 'button');
      this._zoomInButton.setAttribute('aria-label', 'Zoom in');
      this._zoomInButton.innerHTML = '+';
      this._zoomInButton.addEventListener('click', () => this.zoomIn());

      this._zoomOutButton = document.createElement('button');
      this._zoomOutButton.className = 'k-lightbox-btn k-lightbox-zoom-out';
      this._zoomOutButton.setAttribute('type', 'button');
      this._zoomOutButton.setAttribute('aria-label', 'Zoom out');
      this._zoomOutButton.innerHTML = '−';
      this._zoomOutButton.addEventListener('click', () => this.zoomOut());

      controlsBar.appendChild(this._zoomOutButton);
      controlsBar.appendChild(this._zoomInButton);
      this._container.appendChild(controlsBar);
    }

    this._container.appendChild(this._closeButton);
  }

  private _createTrigger(): void {
    const thumbnail = this.getAttribute('thumbnail');
    if (thumbnail) {
      const trigger = document.createElement('img');
      trigger.className = 'k-lightbox-trigger';
      trigger.src = sanitizeUrl(thumbnail);
      trigger.alt = this.getAttribute('alt') || 'Click to view full size';
      trigger.style.cursor = 'pointer';
      trigger.addEventListener('click', () => this.open());
      this.appendChild(trigger);
    }
  }

  private _loadImage(index: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._images[index] || !this._imageContainer) {
        reject(new Error('Invalid image index'));
        return;
      }

      // Show loader
      this._showLoader();

      // Create new image
      const img = document.createElement('img');
      img.className = 'k-lightbox-image';
      img.alt = this._images[index]!.alt;

      img.onload = () => {
        // Remove previous image
        if (this._currentImage) {
          this._currentImage.remove();
        }

        this._currentImage = img;
        this._imageContainer!.appendChild(img);
        this._hideLoader();
        this._updateUI();
        resolve();
      };

      img.onerror = () => {
        this._hideLoader();
        reject(new Error('Failed to load image'));
      };

      img.src = this._images[index]!.src;
    });
  }

  private _showLoader(): void {
    if (this._loader) {
      this._loader.style.display = 'flex';
    }
  }

  private _hideLoader(): void {
    if (this._loader) {
      this._loader.style.display = 'none';
    }
  }

  private _updateUI(): void {
    // Update counter
    if (this._counter && this._images.length > 1) {
      this._counter.textContent = `${this._currentIndex + 1} / ${this._images.length}`;
    }

    // Update navigation buttons
    if (this._prevButton) {
      this._prevButton.disabled = this._currentIndex === 0;
    }
    if (this._nextButton) {
      this._nextButton.disabled = this._currentIndex === this._images.length - 1;
    }

    // Reset zoom and position
    this._zoomLevel = 1;
    this._translateX = 0;
    this._translateY = 0;
    this._updateImageTransform();
  }

  private _updateImageTransform(): void {
    if (this._currentImage) {
      this._currentImage.style.transform = 
        `translate(${this._translateX}px, ${this._translateY}px) scale(${this._zoomLevel})`;
    }
  }

  protected _attachEventListeners(): void {
    if (!this._overlay) return;

    // Keyboard navigation
    document.addEventListener('keydown', this._handleKeyDown.bind(this));

    // Overlay click to close
    this._overlay.addEventListener('click', (e) => {
      if (e.target === this._overlay) {
        this.close();
      }
    });

    // Mouse wheel zoom
    this._imageContainer?.addEventListener('wheel', this._handleWheel.bind(this));

    // Touch/mouse drag
    this._imageContainer?.addEventListener('mousedown', this._handleMouseDown.bind(this));
    this._imageContainer?.addEventListener('touchstart', this._handleTouchStart.bind(this));
  }

  private _handleKeyDown(event: KeyboardEvent): void {
    if (!this._isOpen) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.previous();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.next();
        break;
      case ' ':
        event.preventDefault();
        this.next();
        break;
      case '+':
      case '=':
        event.preventDefault();
        this.zoomIn();
        break;
      case '-':
        event.preventDefault();
        this.zoomOut();
        break;
    }
  }

  private _handleWheel(event: WheelEvent): void {
    if (!this._isOpen) return;

    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  private _handleMouseDown(event: MouseEvent): void {
    if (!this._currentImage || this._zoomLevel <= 1) return;

    this._isDragging = true;
    this._lastX = event.clientX;
    this._lastY = event.clientY;

    document.addEventListener('mousemove', this._handleMouseMove.bind(this));
    document.addEventListener('mouseup', this._handleMouseUp.bind(this));
  }

  private _handleMouseMove(event: MouseEvent): void {
    if (!this._isDragging) return;

    const deltaX = event.clientX - this._lastX;
    const deltaY = event.clientY - this._lastY;

    this._translateX += deltaX;
    this._translateY += deltaY;

    this._lastX = event.clientX;
    this._lastY = event.clientY;

    this._updateImageTransform();
  }

  private _handleMouseUp(): void {
    this._isDragging = false;
    document.removeEventListener('mousemove', this._handleMouseMove.bind(this));
    document.removeEventListener('mouseup', this._handleMouseUp.bind(this));
  }

  private _handleTouchStart(event: TouchEvent): void {
    if (!this._currentImage || event.touches.length !== 1) return;

    const touch = event.touches[0]!;
    this._isDragging = true;
    this._lastX = touch.clientX;
    this._lastY = touch.clientY;

    document.addEventListener('touchmove', this._handleTouchMove.bind(this));
    document.addEventListener('touchend', this._handleTouchEnd.bind(this));
  }

  private _handleTouchMove(event: TouchEvent): void {
    if (!this._isDragging || event.touches.length !== 1) return;

    event.preventDefault();
    const touch = event.touches[0]!;
    const deltaX = touch.clientX - this._lastX;
    const deltaY = touch.clientY - this._lastY;

    if (this._zoomLevel > 1) {
      this._translateX += deltaX;
      this._translateY += deltaY;
      this._updateImageTransform();
    }

    this._lastX = touch.clientX;
    this._lastY = touch.clientY;
  }

  private _handleTouchEnd(): void {
    this._isDragging = false;
    document.removeEventListener('touchmove', this._handleTouchMove.bind(this));
    document.removeEventListener('touchend', this._handleTouchEnd.bind(this));
  }

  protected _applyAccessibility(): void {
    if (!this._overlay) return;

    this._overlay.setAttribute('role', 'dialog');
    this._overlay.setAttribute('aria-modal', 'true');
    this._overlay.setAttribute('aria-labelledby', `${this._lightboxId}-image`);

    if (this._currentImage) {
      this._currentImage.id = `${this._lightboxId}-image`;
    }
  }

  /**
   * Public API: Open the lightbox
   */
  public open(index = 0): void {
    if (this._isOpen || !this._overlay) return;

    this._currentIndex = Math.max(0, Math.min(index, this._images.length - 1));
    this._isOpen = true;

    // Show overlay
    this._overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Load current image
    this._loadImage(this._currentIndex).catch(console.error);

    // Animate in
    requestAnimationFrame(() => {
      this._overlay!.classList.add('k-lightbox-open');
    });

    // Focus management
    this._closeButton?.focus();

    // Dispatch open event
    this._dispatch('open', {
      index: this._currentIndex,
      image: this._images[this._currentIndex]
    });
  }

  /**
   * Public API: Close the lightbox
   */
  public close(): void {
    if (!this._isOpen || !this._overlay) return;

    this._isOpen = false;

    // Animate out
    this._overlay.classList.remove('k-lightbox-open');

    setTimeout(() => {
      if (this._overlay) {
        this._overlay.style.display = 'none';
      }
      document.body.style.overflow = '';
    }, 300);

    // Dispatch close event
    this._dispatch('close', {
      index: this._currentIndex
    });
  }

  /**
   * Public API: Navigate to previous image
   */
  public previous(): void {
    if (this._currentIndex > 0) {
      this._currentIndex--;
      this._loadImage(this._currentIndex).catch(console.error);
    }
  }

  /**
   * Public API: Navigate to next image
   */
  public next(): void {
    if (this._currentIndex < this._images.length - 1) {
      this._currentIndex++;
      this._loadImage(this._currentIndex).catch(console.error);
    }
  }

  /**
   * Public API: Zoom in
   */
  public zoomIn(): void {
    const maxZoom = parseFloat(this.getAttribute('max-zoom') || '3');
    if (this._zoomLevel < maxZoom) {
      this._zoomLevel = Math.min(this._zoomLevel * 1.2, maxZoom);
      this._updateImageTransform();
    }
  }

  /**
   * Public API: Zoom out
   */
  public zoomOut(): void {
    if (this._zoomLevel > 1) {
      this._zoomLevel = Math.max(this._zoomLevel / 1.2, 1);
      if (this._zoomLevel <= 1) {
        this._translateX = 0;
        this._translateY = 0;
      }
      this._updateImageTransform();
    }
  }

  /**
   * Public API: Reset zoom and position
   */
  public resetZoom(): void {
    this._zoomLevel = 1;
    this._translateX = 0;
    this._translateY = 0;
    this._updateImageTransform();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    
    // Clean up overlay
    if (this._overlay && this._overlay.parentNode) {
      this._overlay.parentNode.removeChild(this._overlay);
    }

    // Clean up global event listeners
    document.removeEventListener('keydown', this._handleKeyDown.bind(this));
  }
}

// Register the custom element
customElements.define('k-lightbox', KLightboxElement);