import { KBaseElement } from '../KBaseElement.js';
import { sanitizeText } from '../../core/utils/sanitize.js';

/**
 * KToastElement — A theme-aware notification toast.
 *
 * Features:
 * - Auto-dismissal based on the 'v' attribute (duration).
 * - Visual progress bar synchronized with the dismissal timer.
 * - Hover-to-pause functionality.
 * - Accessibility: role="status" (polite) or role="alert" (assertive).
 */
class KToastElement extends KBaseElement {
  private _progress: HTMLElement | null = null;
  private _closeBtn: HTMLElement | null = null;
  private _timerId: number | null = null;
  private _startTime: number = 0;
  private _remainingTime: number = 0;
  private _isPaused: boolean = false;

  protected _render(): void {
    if (this._progress) return;

    const tokens = this._getTokens();
    const text = this.textContent || '';

    // 1. Create the message container
    const messageEl = document.createElement('span');
    messageEl.className = 'k-toast__message';
    messageEl.textContent = sanitizeText(text);

    // 2. Create the progress bar
    this._progress = document.createElement('div');
    this._progress.className = 'k-toast-progress';

    // 3. Create the close button
    if (this.getAttribute('data-close-button') === 'true') {
      this._closeBtn = document.createElement('button');
      this._closeBtn.className = 'k-toast__close';
      this._closeBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
      this._closeBtn.onclick = () => this.dismiss();
    }

    // Assemble
    this.textContent = '';
    this.appendChild(messageEl);
    if (this._closeBtn) this.appendChild(this._closeBtn);
    this.appendChild(this._progress!);

    this._startTimer();
  }

  protected _applyAccessibility(): void {
    const tokens = this._getTokens();
    // Use role="alert" for errors, role="status" for others
    this.setAttribute('role', tokens.variant === 'error' ? 'alert' : 'status');
    this.setAttribute('aria-live', tokens.variant === 'error' ? 'assertive' : 'polite');
  }

  protected _attachEventListeners(): void {
    this.addEventListener('mouseenter', () => this._pauseTimer());
    this.addEventListener('mouseleave', () => this._resumeTimer());
  }

  private _startTimer(): void {
    const tokens = this._getTokens();
    // Duration is extracted from the 'v' attribute.
    // Since parseV doesn't have a dedicated duration token, we might be passing it in the variant
    // or as a separate token if modified.
    // In KToastManager, we set v="variant duration".
    // parseV puts unknown tokens into variant. We need a way to get duration.

    // Let's assume we pass duration as a numeric token in 'v'
    const v = this.getAttribute('v') || '';
    const parts = v.split(/\s+/);
    const duration = parseInt(parts.find(p => !isNaN(parseInt(p))) || '5000', 10);

    this._remainingTime = duration;
    this._startTime = Date.now();
    this._updateProgressBar();

    this._timerId = window.setTimeout(() => this.dismiss(), this._remainingTime);
  }

  private _pauseTimer(): void {
    if (this._isPaused) return;
    this._isPaused = true;

    if (this._timerId) {
      clearTimeout(this._timerId);
      this._remainingTime -= Date.now() - this._startTime;
    }

    if (this._progress) {
      const computedStyle = window.getComputedStyle(this._progress);
      const width = computedStyle.width;
      this._progress.style.transition = 'none';
      this._progress.style.width = width;
    }
  }

  private _resumeTimer(): void {
    if (!this._isPaused) return;
    this._isPaused = false;

    this._startTime = Date.now();
    this._timerId = window.setTimeout(() => this.dismiss(), this._remainingTime);

    if (this._progress) {
      const duration = this._remainingTime;
      this._progress.style.transition = `width ${duration}ms linear`;
      // Force reflow to ensure transition starts
      void this._progress.offsetWidth;
      this._progress.style.width = '0%';
    }
  }

  private _updateProgressBar(): void {
    if (!this._progress) return;
    const duration = this._remainingTime;
    this._progress.style.transition = `width ${duration}ms linear`;
    void this._progress.offsetWidth;
    this._progress.style.width = '0%';
  }

  public dismiss(): void {
    this.classList.add('k-toast--dismissing');
    this._dispatch('dismiss');

    // Remove from DOM after animation
    this.addEventListener('animationend', () => {
      this.remove();
    }, { once: true });
  }
}

customElements.define('k-toast', KToastElement);
