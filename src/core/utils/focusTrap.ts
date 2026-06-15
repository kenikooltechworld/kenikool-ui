/**
 * focusTrap — reusable focus trap for Modal and any other overlay component.
 *
 * When a modal is open, keyboard focus must stay inside it.
 * Tab from the last focusable element cycles to the first.
 * Shift+Tab from the first cycles to the last.
 * On deactivate, focus returns to the element that triggered the open.
 *
 * This is a pure utility — no DOM side effects until activate() is called.
 * Used by both Vanilla KModalElement and React Modal component.
 */

/**
 * CSS selector that matches all elements a user can Tab to.
 * Excludes elements that are hidden, inside [hidden] ancestors,
 * or have tabindex="-1" (programmatically focusable but not in tab order).
 */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary:not([disabled])',
  'audio[controls]',
  'video[controls]',
].join(', ');

/** Public interface returned by createFocusTrap(). */
export interface FocusTrap {
  /**
   * Activates the trap. Adds keydown listener and moves focus into the
   * container. Call this when the overlay opens.
   */
  activate: () => void;

  /**
   * Deactivates the trap. Removes the keydown listener and restores focus
   * to the element that was active before the overlay opened.
   * Call this when the overlay closes.
   */
  deactivate: () => void;
}

/**
 * Returns all currently focusable elements inside a container,
 * filtering out elements that are visually hidden via offsetParent or [hidden].
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter(el => {
    // Exclude elements inside [hidden] ancestors
    if (el.closest('[hidden]')) return false;
    // Exclude elements with zero dimensions (display:none, visibility:hidden)
    // offsetParent is null for display:none elements (except position:fixed)
    if (el.offsetParent === null && !isFixed(el)) return false;
    return true;
  });
}

/** Returns true if the element has position:fixed — offsetParent is null for these. */
function isFixed(el: HTMLElement): boolean {
  return window.getComputedStyle(el).position === 'fixed';
}

/**
 * Creates a focus trap for the given container element.
 *
 * @param container - The element to trap focus within (e.g. a <dialog>).
 * @param returnTo  - Optional element to return focus to on deactivate.
 *                    If omitted, focus returns to document.activeElement
 *                    captured at the time activate() is called.
 * @returns FocusTrap with activate() and deactivate() methods.
 *
 * @example
 * // In a Modal component:
 * const trap = createFocusTrap(dialogEl, triggerButtonEl);
 * trap.activate();   // when modal opens
 * trap.deactivate(); // when modal closes
 */
export function createFocusTrap(
  container: HTMLElement,
  returnTo?: HTMLElement | null
): FocusTrap {
  // Capture the element that had focus before activation.
  // Overridden at activate() time if returnTo is not provided.
  let savedFocus: HTMLElement | null = returnTo ?? null;

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;

    const focusable = getFocusableElements(container);

    // If nothing focusable inside, prevent tabbing out entirely
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: if on the first element, wrap to last
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      // Tab: if on the last element, wrap to first
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }

  return {
    activate(): void {
      // Save current focus so we can restore it on deactivate
      if (!returnTo) {
        savedFocus = document.activeElement as HTMLElement | null;
      }

      document.addEventListener('keydown', handleKeydown);

      // Move focus into the container after a rAF so CSS transitions
      // have started and the element is measurable/visible
      requestAnimationFrame(() => {
        const focusable = getFocusableElements(container);
        const target    = focusable[0] ?? container;
        // Ensure the container itself is focusable as a fallback
        if (target === container && !container.hasAttribute('tabindex')) {
          container.setAttribute('tabindex', '-1');
        }
        target.focus({ preventScroll: false });
      });
    },

    deactivate(): void {
      document.removeEventListener('keydown', handleKeydown);
      // Restore focus to the element that was active before the overlay opened
      savedFocus?.focus({ preventScroll: true });
      savedFocus = null;
    },
  };
}
