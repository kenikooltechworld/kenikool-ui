import { KBaseElement } from '../KBaseElement.js';
import { sanitizeText } from '../../core/utils/sanitize.js';
import { createFocusTrap } from '../../core/utils/focusTrap.js';
import { generateId } from '../../core/utils/generateId.js';
import type { FocusTrap } from '../../core/utils/focusTrap.js';

/**
 * KModalElement — <k-modal> Web Custom Element.
 *
 * Uses native HTML <dialog> element for built-in backdrop and top-layer placement.
 * Implements focus trap, Escape to close, and accessible ARIA attributes.
 *
 * 10 variants:
 * - default, centered, bottom-sheet, side-drawer-left, side-drawer-right
 * - fullscreen, compact, form, confirm, media
 *
 * Usage:
 *   <k-modal v="default" id="my-modal">
 *     <div slot="header">Modal Title</div>
 *     <div>Modal content goes here</div>
 *     <div slot="footer">
 *       <k-button v="filled">Confirm</k-button>
 *     </div>
 *   </k-modal>
 *
 *   // Open programmatically
 *   document.querySelector('#my-modal').open();
 */
export class KModalElement extends KBaseElement {
  private _dialog: HTMLDialogElement | null = null;
  private _closeBtn: HTMLButtonElement | null = null;
  private _headerEl: HTMLElement | null = null;
  private _bodyEl: HTMLElement | null = null;
  private _footerEl: HTMLElement | null = null;
  private _triggerElement: HTMLElement | null = null;
  private _focusTrap: FocusTrap | null = null;
  
  private _headerId: string = '';
  private _bodyId: string = '';

  static get observedAttributes(): string[] {
    return [...super.observedAttributes, 'open', 'close-on-esc', 'close-on-overlay', 'title', 'width'];
  }

  protected _render(): void {
    if (this._dialog) return; // Already rendered

    // Create native dialog element
    const dialog = document.createElement('dialog');
    dialog.className = 'k-modal__dialog';
    
    // Create modal content container
    const content = document.createElement('div');
    content.className = 'k-modal__content';

    // Close button (always present, hidden for confirm variant via CSS)
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'k-modal__close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close modal');
    content.appendChild(closeBtn);
    this._closeBtn = closeBtn;

    // Capture existing content
    const existingContent = Array.from(this.childNodes);

    // Header
    const titleAttr = this.getAttribute('title');
    const headerSlot = existingContent.find(
      node => node instanceof HTMLElement && node.getAttribute('slot') === 'header'
    ) as HTMLElement | undefined;

    if (titleAttr || headerSlot) {
      const headerEl = document.createElement('div');
      headerEl.className = 'k-modal__header';
      this._headerId = generateId('modal-header');
      headerEl.id = this._headerId;

      if (headerSlot) {
        headerEl.appendChild(headerSlot);
      } else if (titleAttr) {
        headerEl.textContent = sanitizeText(titleAttr);
      }

      content.appendChild(headerEl);
      this._headerEl = headerEl;
    }

    // Body (default slot)
    const bodyEl = document.createElement('div');
    bodyEl.className = 'k-modal__body';
    this._bodyId = generateId('modal-body');
    bodyEl.id = this._bodyId;

    const bodyContent = existingContent.filter(
      node => {
        if (!(node instanceof HTMLElement)) return true;
        const slot = node.getAttribute('slot');
        return !slot || slot === 'body';
      }
    );

    bodyContent.forEach(node => bodyEl.appendChild(node));
    content.appendChild(bodyEl);
    this._bodyEl = bodyEl;

    // Footer
    const footerSlot = existingContent.find(
      node => node instanceof HTMLElement && node.getAttribute('slot') === 'footer'
    ) as HTMLElement | undefined;

    if (footerSlot) {
      const footerEl = document.createElement('div');
      footerEl.className = 'k-modal__footer';
      footerEl.appendChild(footerSlot);
      content.appendChild(footerEl);
      this._footerEl = footerEl;
    }

    dialog.appendChild(content);
    this.textContent = '';
    this.appendChild(dialog);
    this._dialog = dialog;
  }

  protected _applyAccessibility(): void {
    if (!this._dialog) return;

    // Dialog role and aria attributes
    this._dialog.setAttribute('role', 'dialog');
    this._dialog.setAttribute('aria-modal', 'true');

    if (this._headerId) {
      this._dialog.setAttribute('aria-labelledby', this._headerId);
    }

    if (this._bodyId) {
      this._dialog.setAttribute('aria-describedby', this._bodyId);
    }
  }

  protected _attachEventListeners(): void {
    if (!this._dialog || !this._closeBtn) return;

    // Close button click
    this._closeBtn.addEventListener('click', () => this.close());

    // Escape key (native dialog handles this, but we need to dispatch event)
    this._dialog.addEventListener('cancel', (e) => {
      const closeOnEsc = this.getAttribute('close-on-esc');
      // Default to true, only prevent if explicitly set to "false"
      if (closeOnEsc === 'false') {
        e.preventDefault();
        return;
      }
      this.close();
    });

    // Backdrop click - check attribute each time (can be changed dynamically)
    this._dialog.addEventListener('click', (e) => {
      // Read attribute fresh each time
      const closeOnOverlay = this.getAttribute('close-on-overlay');
      // Default to true, only prevent if explicitly set to "false"
      if (closeOnOverlay === 'false') {
        return;
      }

      // Check if click was on backdrop (::backdrop pseudo-element)
      // Clicks on dialog itself have dialog as target
      const rect = this._dialog!.getBoundingClientRect();
      const clickedOutside = (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      );

      if (clickedOutside) {
        this.close();
      }
    });

    // Auto-bind trigger buttons with data-modal attribute
    this._bindTriggers();
  }

  /**
   * Automatically binds any buttons with data-modal="#modal-id" to open this modal.
   * Also auto-binds close buttons inside modal (any button with data-modal-close or in footer slot).
   * Industry standard: users just add data-modal attribute, no JS needed.
   */
  private _bindTriggers(): void {
    const modalId = this.id;
    if (!modalId) return;

    // Bind external trigger buttons (open modal)
    const triggers = document.querySelectorAll(`[data-modal="#${modalId}"]`);
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        this.open(trigger as HTMLElement);
      });
    });

    // Bind internal close buttons (buttons with data-modal-close or Cancel/Close text)
    const closeButtons = this.querySelectorAll('k-button');
    closeButtons.forEach((btn) => {
      const text = btn.textContent?.trim().toLowerCase();
      const hasCloseAttr = btn.hasAttribute('data-modal-close');
      
      // Auto-close on: explicit data-modal-close, or text "cancel"/"close"
      if (hasCloseAttr || text === 'cancel' || text === 'close') {
        btn.addEventListener('click', () => this.close());
      }
    });
  }

  protected _detachEventListeners(): void {
    // Dialog cleanup happens in close()
  }

  /**
   * Opens the modal.
   * Stores the currently focused element to return focus on close.
   */
  public open(triggerElement?: HTMLElement): void {
    if (!this._dialog) return;

    // Store trigger for focus return
    this._triggerElement = triggerElement || document.activeElement as HTMLElement;

    // Open modal using native dialog API
    this._dialog.showModal();

    // Create and activate focus trap
    this._focusTrap = createFocusTrap(this._dialog, this._triggerElement);
    this._focusTrap.activate();

    // Dispatch custom event
    this._dispatch('open');

    // Add open attribute
    this.setAttribute('open', '');
  }

  /**
   * Closes the modal.
   * Returns focus to trigger element and deactivates focus trap.
   */
  public close(): void {
    if (!this._dialog) return;

    // Close dialog
    this._dialog.close();

    // Deactivate focus trap and return focus
    if (this._focusTrap) {
      this._focusTrap.deactivate();
      this._focusTrap = null;
    }

    // Dispatch custom event
    this._dispatch('close');

    // Remove open attribute
    this.removeAttribute('open');
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    // Handle programmatic open/close via attribute
    if (name === 'open' && oldValue !== newValue && this._dialog) {
      if (newValue !== null) {
        this.open();
      } else {
        this.close();
      }
    }

    // Re-render if title changes
    if (name === 'title' && oldValue !== newValue && this._headerEl) {
      this._headerEl.textContent = sanitizeText(newValue || '');
    }

    // Apply custom width
    if (name === 'width' && this._dialog) {
      if (newValue) {
        this._dialog.style.maxWidth = newValue;
      } else {
        this._dialog.style.removeProperty('max-width');
      }
    }
  }
}

customElements.define('k-modal', KModalElement);
