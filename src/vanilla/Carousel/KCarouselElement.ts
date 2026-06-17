/**
 * @fileoverview KCarouselElement — Comprehensive Carousel System
 * 
 * A versatile carousel component with 5 distinct types and comprehensive controls.
 * Supports touch gestures, keyboard navigation, autoplay, and accessibility features.
 */

import { KBaseElement } from '../KBaseElement.js';
import { parseV } from '../../core/parseV.js';
import { generateId } from '../../core/utils/generateId.js';

/**
 * Carousel component with multiple types and interaction modes.
 * 
 * @example Classic Carousel
 * ```html
 * <k-carousel v="classic" autoplay="3000" label="Product Gallery">
 *   <k-carousel-slide>
 *     <img src="slide1.jpg" alt="Product 1">
 *   </k-carousel-slide>
 *   <k-carousel-slide>
 *     <img src="slide2.jpg" alt="Product 2">
 *   </k-carousel-slide>
 * </k-carousel>
 * ```
 * 
 * @example Card Carousel
 * ```html
 * <k-carousel v="cards" items-visible="3" gap="4">
 *   <k-carousel-slide>Card 1</k-carousel-slide>
 *   <k-carousel-slide>Card 2</k-carousel-slide>
 *   <k-carousel-slide>Card 3</k-carousel-slide>
 * </k-carousel>
 * ```
 * 
 * Types: classic, cards, infinite, fade, vertical
 * Controls: arrows, dots, thumbnails, none
 * Autoplay: Set autoplay="3000" for 3 second intervals
 */
export class KCarouselElement extends KBaseElement {
  private _currentSlide = 0;
  private _totalSlides = 0;
  private _autoplayInterval: number | null = null;
  private _isAnimating = false;
  private _touchStartX = 0;
  private _touchStartY = 0;
  private _container: HTMLElement | null = null;
  private _slidesWrapper: HTMLElement | null = null;
  private _slides: HTMLElement[] = [];
  private _carouselId: string;
  private _resizeObserver: ResizeObserver | null = null;

  constructor() {
    super();
    this._carouselId = generateId('k-carousel');
  }

  static get observedAttributes(): string[] {
    return [...KBaseElement.observedAttributes, 'autoplay', 'current-slide', 'items-visible', 'gap', 'label'];
  }

  protected _render(): void {
    const tokens = parseV(this.getAttribute('v') ?? '');
    const carouselType = tokens.variant || 'classic';

    // Create main carousel structure
    this._container = document.createElement('div');
    this._container.className = 'k-carousel-container';
    this._container.id = this._carouselId;

    // Create slides wrapper
    this._slidesWrapper = document.createElement('div');
    this._slidesWrapper.className = 'k-carousel-slides';

    // Move slide content into wrapper
    this._collectSlides();
    this._slides.forEach(slide => {
      this._slidesWrapper!.appendChild(slide);
    });

    this._container.appendChild(this._slidesWrapper);

    // Add controls based on type
    this._addControls(carouselType);

    // Add container to component
    this.appendChild(this._container);

    // Initialize behavior
    this._initializeCarousel(carouselType);
    this._setupEventListeners();
  }

  private _collectSlides(): void {
    // Collect k-carousel-slide elements
    const slideElements = Array.from(this.querySelectorAll('k-carousel-slide'));
    
    this._slides = slideElements.map((slideEl, index) => {
      const slideWrapper = document.createElement('div');
      slideWrapper.className = 'k-carousel-slide';
      slideWrapper.setAttribute('data-slide-index', String(index));
      
      // Move slide content
      while (slideEl.firstChild) {
        slideWrapper.appendChild(slideEl.firstChild);
      }
      
      return slideWrapper;
    });

    this._totalSlides = this._slides.length;

    // Remove original slide elements
    slideElements.forEach(el => el.remove());
  }

  private _addControls(carouselType: string): void {
    if (!this._container) return;

    const showArrows = carouselType !== 'fade' && this._totalSlides > 1;
    const showDots = ['classic', 'fade'].includes(carouselType) && this._totalSlides > 1;

    // Add navigation arrows
    if (showArrows) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'k-carousel-btn k-carousel-prev';
      prevBtn.setAttribute('type', 'button');
      prevBtn.setAttribute('aria-label', 'Previous slide');
      prevBtn.innerHTML = `<span class="k-carousel-arrow">‹</span>`;
      prevBtn.addEventListener('click', () => this.previousSlide());

      const nextBtn = document.createElement('button');
      nextBtn.className = 'k-carousel-btn k-carousel-next';
      nextBtn.setAttribute('type', 'button');
      nextBtn.setAttribute('aria-label', 'Next slide');
      nextBtn.innerHTML = `<span class="k-carousel-arrow">›</span>`;
      nextBtn.addEventListener('click', () => this.nextSlide());

      this._container.appendChild(prevBtn);
      this._container.appendChild(nextBtn);
    }

    // Add dot indicators
    if (showDots) {
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'k-carousel-dots';
      dotsContainer.setAttribute('role', 'tablist');
      dotsContainer.setAttribute('aria-label', 'Slide navigation');

      for (let i = 0; i < this._totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'k-carousel-dot';
        dot.setAttribute('type', 'button');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => this.goToSlide(i));
        dotsContainer.appendChild(dot);
      }

      this._container.appendChild(dotsContainer);
    }
  }

  private _initializeCarousel(carouselType: string): void {
    if (!this._slidesWrapper) return;

    // Set initial positions based on type
    switch (carouselType) {
      case 'classic':
        this._initializeHorizontalCarousel();
        break;
      case 'infinite':
        this._initializeInfiniteCarousel();
        break;
      case 'cards':
        this._initializeCardCarousel();
        break;
      case 'fade':
        this._initializeFadeCarousel();
        break;
      case 'vertical':
        this._initializeVerticalCarousel();
        break;
    }

    // Setup autoplay if specified
    this._setupAutoplay();

    // Setup resize observer for responsive behavior
    this._setupResizeObserver();
  }

  private _initializeHorizontalCarousel(): void {
    this._slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${index * 100}%)`;
      slide.style.opacity = '1';
      slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    });
  }

  private _initializeCardCarousel(): void {
    const itemsVisible = parseInt(this.getAttribute('items-visible') || '3');
    const gap = parseInt(this.getAttribute('gap') || '4');
    
    this._slides.forEach((slide, index) => {
      slide.style.flex = `0 0 calc(${100 / itemsVisible}% - ${gap * 4}px)`;
      slide.style.marginRight = `${gap * 4}px`;
      slide.setAttribute('aria-hidden', 'false'); // Cards are always visible
    });

    if (this._slidesWrapper) {
      this._slidesWrapper.style.display = 'flex';
      this._slidesWrapper.style.transition = 'transform var(--k-transition-base)';
    }
  }

  private _initializeFadeCarousel(): void {
    this._slides.forEach((slide, index) => {
      slide.style.position = 'absolute';
      slide.style.top = '0';
      slide.style.left = '0';
      slide.style.width = '100%';
      slide.style.opacity = index === 0 ? '1' : '0';
      slide.style.transition = 'opacity var(--k-transition-base)';
      slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    });

    if (this._slidesWrapper) {
      this._slidesWrapper.style.position = 'relative';
      this._slidesWrapper.style.height = '400px'; // Default height, can be overridden via CSS
    }
  }

  private _initializeVerticalCarousel(): void {
    this._slides.forEach((slide, index) => {
      slide.style.transform = `translateY(${index * 100}%)`;
      slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    });

    if (this._slidesWrapper) {
      this._slidesWrapper.style.flexDirection = 'column';
      this._slidesWrapper.style.height = '400px'; // Default height
      this._slidesWrapper.style.overflowY = 'hidden';
    }
  }

  private _initializeInfiniteCarousel(): void {
    if (!this._slidesWrapper || this._totalSlides < 2) return;

    // Clone slides for seamless infinite scrolling
    const firstSlide = this._slides[0];
    const lastSlide = this._slides[this._totalSlides - 1];

    if (firstSlide) {
      const firstClone = firstSlide.cloneNode(true) as HTMLElement;
      firstClone.classList.add('k-carousel-slide-clone');
      firstClone.setAttribute('aria-hidden', 'true');
      this._slidesWrapper.appendChild(firstClone);
    }

    if (lastSlide && this._slides[0]) {
      const lastClone = lastSlide.cloneNode(true) as HTMLElement;
      lastClone.classList.add('k-carousel-slide-clone');
      lastClone.setAttribute('aria-hidden', 'true');
      this._slidesWrapper.insertBefore(lastClone, this._slides[0]);
    }

    // Position slides including clones
    const allSlides = this._slidesWrapper.querySelectorAll('.k-carousel-slide, .k-carousel-slide-clone');
    allSlides.forEach((slide, index) => {
      (slide as HTMLElement).style.transform = `translateX(${(index - 1) * 100}%)`;
      (slide as HTMLElement).style.flex = '0 0 100%';
    });

    // Start from the first real slide (index 1 because of prepended clone)
    this._currentSlide = 0;
    if (this._slidesWrapper) {
      this._slidesWrapper.style.display = 'flex';
      this._slidesWrapper.style.transform = 'translateX(-100%)';
      this._slidesWrapper.style.transition = 'transform var(--k-transition-base)';
    }
  }

  private _setupEventListeners(): void {
    // Touch/swipe support
    this.addEventListener('touchstart', this._handleTouchStart.bind(this), { passive: true });
    this.addEventListener('touchmove', this._handleTouchMove.bind(this), { passive: false });
    this.addEventListener('touchend', this._handleTouchEnd.bind(this), { passive: true });

    // Mouse drag support
    this.addEventListener('mousedown', this._handleMouseDown.bind(this));

    // Keyboard navigation
    this.addEventListener('keydown', this._handleKeyDown.bind(this));

    // Pause autoplay on hover
    this.addEventListener('mouseenter', this._pauseAutoplay.bind(this));
    this.addEventListener('mouseleave', this._resumeAutoplay.bind(this));
    this.addEventListener('focusin', this._pauseAutoplay.bind(this));
    this.addEventListener('focusout', this._resumeAutoplay.bind(this));
  }

  private _handleTouchStart(event: TouchEvent): void {
    if (!event.touches.length) return;
    this._touchStartX = event.touches[0]!.clientX;
    this._touchStartY = event.touches[0]!.clientY;
    this._pauseAutoplay();
  }

  private _handleTouchMove(event: TouchEvent): void {
    const tokens = parseV(this.getAttribute('v') ?? '');
    const carouselType = tokens.variant || 'classic';
    
    if (carouselType === 'vertical') {
      event.preventDefault(); // Prevent page scroll for vertical carousel
    }
  }

  private _handleTouchEnd(event: TouchEvent): void {
    if (!event.changedTouches.length) return;

    const touchEndX = event.changedTouches[0]!.clientX;
    const touchEndY = event.changedTouches[0]!.clientY;
    const deltaX = this._touchStartX - touchEndX;
    const deltaY = this._touchStartY - touchEndY;

    const tokens = parseV(this.getAttribute('v') ?? '');
    const carouselType = tokens.variant || 'classic';

    // Determine swipe direction and threshold
    const minSwipeDistance = 50;

    if (carouselType === 'vertical') {
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
    } else {
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
    }

    this._resumeAutoplay();
  }

  private _handleMouseDown(event: MouseEvent): void {
    // Implement mouse drag if needed
    event.preventDefault();
  }

  private _handleKeyDown(event: KeyboardEvent): void {
    const tokens = parseV(this.getAttribute('v') ?? '');
    const carouselType = tokens.variant || 'classic';

    switch (event.key) {
      case 'ArrowLeft':
        if (carouselType !== 'vertical') {
          event.preventDefault();
          this.previousSlide();
        }
        break;
      case 'ArrowRight':
        if (carouselType !== 'vertical') {
          event.preventDefault();
          this.nextSlide();
        }
        break;
      case 'ArrowUp':
        if (carouselType === 'vertical') {
          event.preventDefault();
          this.previousSlide();
        }
        break;
      case 'ArrowDown':
        if (carouselType === 'vertical') {
          event.preventDefault();
          this.nextSlide();
        }
        break;
      case 'Home':
        event.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        event.preventDefault();
        this.goToSlide(this._totalSlides - 1);
        break;
    }
  }

  private _setupAutoplay(): void {
    const autoplayDelay = parseInt(this.getAttribute('autoplay') || '0');
    if (autoplayDelay > 0) {
      this._autoplayInterval = window.setInterval(() => {
        this.nextSlide();
      }, autoplayDelay);
    }
  }

  private _pauseAutoplay(): void {
    if (this._autoplayInterval) {
      window.clearInterval(this._autoplayInterval);
      this._autoplayInterval = null;
    }
  }

  private _resumeAutoplay(): void {
    if (!this._autoplayInterval && this.getAttribute('autoplay')) {
      this._setupAutoplay();
    }
  }

  private _setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => {
        this._updateCarouselLayout();
      });
      this._resizeObserver.observe(this);
    }
  }

  private _updateCarouselLayout(): void {
    const tokens = parseV(this.getAttribute('v') ?? '');
    const carouselType = tokens.variant || 'classic';

    if (carouselType === 'cards') {
      this._initializeCardCarousel();
      this._updateSlidePosition();
    }
  }

  private _updateSlidePosition(): void {
    if (this._isAnimating) return;

    const tokens = parseV(this.getAttribute('v') ?? '');
    const carouselType = tokens.variant || 'classic';

    // Don't use generic update for infinite - it has its own handlers
    if (carouselType === 'infinite') {
      return;
    }

    this._isAnimating = true;

    switch (carouselType) {
      case 'classic':
        this._updateHorizontalPosition();
        break;
      case 'cards':
        this._updateCardPosition();
        break;
      case 'fade':
        this._updateFadePosition();
        break;
      case 'vertical':
        this._updateVerticalPosition();
        break;
    }

    // Update ARIA attributes
    this._updateAriaAttributes();

    // Update dot indicators
    this._updateDotIndicators();

    // Reset animation flag after transition
    setTimeout(() => {
      this._isAnimating = false;
    }, 300);
  }

  private _updateHorizontalPosition(): void {
    this._slides.forEach((slide, index) => {
      const offset = (index - this._currentSlide) * 100;
      slide.style.transform = `translateX(${offset}%)`;
    });
  }

  private _updateCardPosition(): void {
    if (!this._slidesWrapper) return;
    
    const itemsVisible = parseInt(this.getAttribute('items-visible') || '3');
    const slideWidth = 100 / itemsVisible;
    const offset = -this._currentSlide * slideWidth;
    
    this._slidesWrapper.style.transform = `translateX(${offset}%)`;
  }

  private _updateFadePosition(): void {
    this._slides.forEach((slide, index) => {
      slide.style.opacity = index === this._currentSlide ? '1' : '0';
    });
  }

  private _updateVerticalPosition(): void {
    this._slides.forEach((slide, index) => {
      const offset = (index - this._currentSlide) * 100;
      slide.style.transform = `translateY(${offset}%)`;
    });
  }

  private _updateAriaAttributes(): void {
    this._slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index === this._currentSlide ? 'false' : 'true');
    });

    // Update live region for screen readers
    this._dispatchSlideChange();
  }

  private _updateDotIndicators(): void {
    const dots = this.querySelectorAll('.k-carousel-dot');
    dots.forEach((dot, index) => {
      dot.setAttribute('aria-selected', index === this._currentSlide ? 'true' : 'false');
      dot.classList.toggle('active', index === this._currentSlide);
    });
  }

  protected _applyAccessibility(): void {
    if (!this._container) return;

    // Set up carousel accessibility
    this._container.setAttribute('role', 'region');
    this._container.setAttribute('aria-label', this.getAttribute('label') || 'Image carousel');
    this._container.setAttribute('tabindex', '0');

    // Add live region for slide announcements
    const liveRegion = document.createElement('div');
    liveRegion.className = 'k-carousel-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    
    this._container.appendChild(liveRegion);
  }

  private _dispatchSlideChange(): void {
    const liveRegion = this.querySelector('.k-carousel-live-region') as HTMLElement;
    if (liveRegion) {
      liveRegion.textContent = `Slide ${this._currentSlide + 1} of ${this._totalSlides}`;
    }

    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('k:carousel-change', {
      bubbles: true,
      composed: true,
      detail: {
        currentSlide: this._currentSlide,
        totalSlides: this._totalSlides,
        carousel: this
      }
    }));
  }

  /**
   * Public API: Go to next slide
   */
  nextSlide(): void {
    if (this._isAnimating) return;

    const tokens = parseV(this.getAttribute('v') ?? '');
    const carouselType = tokens.variant || 'classic';
    
    if (carouselType === 'infinite') {
      this._handleInfiniteNext();
      return;
    }
    
    if (this._currentSlide < this._totalSlides - 1) {
      this._currentSlide++;
    } else {
      // For non-infinite carousels, loop back to start
      this._currentSlide = 0;
    }

    this._updateSlidePosition();
  }

  /**
   * Public API: Go to previous slide
   */
  previousSlide(): void {
    if (this._isAnimating) return;

    const tokens = parseV(this.getAttribute('v') ?? '');
    const carouselType = tokens.variant || 'classic';
    
    if (carouselType === 'infinite') {
      this._handleInfinitePrevious();
      return;
    }
    
    if (this._currentSlide > 0) {
      this._currentSlide--;
    } else {
      // For non-infinite carousels, loop to end
      this._currentSlide = this._totalSlides - 1;
    }

    this._updateSlidePosition();
  }

  private _handleInfiniteNext(): void {
    if (!this._slidesWrapper) return;
    
    this._isAnimating = true;
    
    // Move to next slide
    this._currentSlide++;
    const translateX = -(this._currentSlide + 1) * 100; // +1 for the prepended clone
    this._slidesWrapper.style.transform = `translateX(${translateX}%)`;
    
    // If we've gone past the last real slide, snap back to the first
    setTimeout(() => {
      if (this._currentSlide >= this._totalSlides) {
        this._currentSlide = 0;
        if (this._slidesWrapper) {
          this._slidesWrapper.style.transition = 'none';
          this._slidesWrapper.style.transform = 'translateX(-100%)'; // Back to first real slide
          
          // Re-enable transitions after snap
          setTimeout(() => {
            if (this._slidesWrapper) {
              this._slidesWrapper.style.transition = 'transform var(--k-transition-base)';
            }
            this._isAnimating = false;
          }, 50);
        }
      } else {
        this._isAnimating = false;
      }
      this._updateAriaAttributes();
      this._updateDotIndicators();
      this._dispatchSlideChange();
    }, 300);
  }

  private _handleInfinitePrevious(): void {
    if (!this._slidesWrapper) return;
    
    this._isAnimating = true;
    
    // Move to previous slide
    this._currentSlide--;
    
    // If we've gone before the first slide, snap to the last
    if (this._currentSlide < 0) {
      this._currentSlide = this._totalSlides - 1;
      if (this._slidesWrapper) {
        this._slidesWrapper.style.transition = 'none';
        this._slidesWrapper.style.transform = `translateX(-${this._totalSlides * 100}%)`; // Jump to cloned last slide
        
        // Then animate to the real last slide
        setTimeout(() => {
          if (this._slidesWrapper) {
            this._slidesWrapper.style.transition = 'transform var(--k-transition-base)';
            this._slidesWrapper.style.transform = `translateX(-${this._currentSlide + 1}00%)`; // +1 for prepended clone
          }
          setTimeout(() => {
            this._isAnimating = false;
          }, 300);
        }, 50);
      }
    } else {
      const translateX = -(this._currentSlide + 1) * 100; // +1 for the prepended clone
      this._slidesWrapper.style.transform = `translateX(${translateX}%)`;
      setTimeout(() => {
        this._isAnimating = false;
      }, 300);
    }
    
    this._updateAriaAttributes();
    this._updateDotIndicators();
    this._dispatchSlideChange();
  }

  /**
   * Public API: Go to specific slide
   */
  goToSlide(slideIndex: number): void {
    if (this._isAnimating || slideIndex < 0 || slideIndex >= this._totalSlides) return;
    
    this._currentSlide = slideIndex;
    this._updateSlidePosition();
  }

  /**
   * Public API: Get current slide index
   */
  getCurrentSlide(): number {
    return this._currentSlide;
  }

  /**
   * Public API: Get total slides count
   */
  getTotalSlides(): number {
    return this._totalSlides;
  }

  /**
   * Public API: Start autoplay
   */
  startAutoplay(delay?: number): void {
    if (delay) {
      this.setAttribute('autoplay', String(delay));
    }
    this._setupAutoplay();
  }

  /**
   * Public API: Stop autoplay
   */
  stopAutoplay(): void {
    this._pauseAutoplay();
    this.removeAttribute('autoplay');
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._pauseAutoplay();
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'current-slide' && newValue !== null) {
      const slideIndex = parseInt(newValue);
      if (!isNaN(slideIndex)) {
        this.goToSlide(slideIndex);
      }
    }

    if (name === 'autoplay') {
      this._pauseAutoplay();
      if (newValue) {
        this._setupAutoplay();
      }
    }
  }
}

// Register the custom element
customElements.define('k-carousel', KCarouselElement);