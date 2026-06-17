/**
 * KToastManager — Singleton orchestrator for the Kenikool UI Toast system.
 *
 * Responsible for:
 * - Maintaining fixed-position containers for different screen regions.
 * - Instantiating and managing the lifecycle of KToastElement instances.
 * - Coordinating toast stacking and positioning.
 */
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface ToastOptions {
  message: string;
  variant?: string;
  duration?: number; // in milliseconds
  position?: ToastPosition;
  closeButton?: boolean;
  id?: string; // Optional ID for updating the toast later
}

class ToastManager {
  private static instance: ToastManager;
  private containers: Map<ToastPosition, HTMLElement> = new Map();
  private toasts: Map<string, HTMLElement> = new Map(); // Track toasts by ID

  private constructor() {}

  /**
   * Returns the singleton instance of ToastManager.
   */
  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  /**
   * Shows a new toast notification.
   *
   * @param options - Configuration for the toast.
   * @returns The toast ID (for updating or dismissing later)
   */
  public show(options: ToastOptions): string {
    const {
      message,
      variant = 'default',
      duration = 5000,
      position = 'top-right',
      closeButton = true,
      id = `toast-${Date.now()}-${Math.random()}`
    } = options;

    // If toast with this ID already exists, update it instead
    if (id && this.toasts.has(id)) {
      this.update(id, options);
      return id;
    }

    const container = this._getOrCreateContainer(position);

    // Create the custom element
    const toast = document.createElement('k-toast');

    // Set properties via the 'v' attribute to keep it consistent with other components
    // Tokens: [variant] [duration]
    toast.setAttribute('v', `${variant} ${duration}`);
    toast.textContent = message;
    toast.setAttribute('data-toast-id', id);

    // Add a custom attribute for the close button since it's not a standard token
    if (closeButton) {
      toast.setAttribute('data-close-button', 'true');
    }

    container.appendChild(toast);
    this.toasts.set(id, toast);

    // Auto-remove from tracking when dismissed
    toast.addEventListener('k:dismiss', () => {
      this.toasts.delete(id);
    }, { once: true });

    return id;
  }

  /**
   * Updates an existing toast's message and/or variant.
   *
   * @param id - The toast ID returned from show()
   * @param options - New options to apply
   * @returns true if toast was found and updated, false otherwise
   */
  public update(id: string, options: Partial<ToastOptions>): boolean {
    const toast = this.toasts.get(id);
    if (!toast) return false;

    // Update message
    if (options.message !== undefined) {
      const messageEl = toast.querySelector('.k-toast__message');
      if (messageEl) {
        messageEl.textContent = options.message;
      }
    }

    // Update variant by changing the v attribute
    if (options.variant !== undefined) {
      const currentV = toast.getAttribute('v') || '';
      const parts = currentV.split(/\s+/);
      const duration = parts.find(p => !isNaN(parseInt(p))) || '5000';
      toast.setAttribute('v', `${options.variant} ${duration}`);
    }

    return true;
  }

  /**
   * Manually dismisses a toast by ID.
   *
   * @param id - The toast ID to dismiss
   * @returns true if toast was found and dismissed, false otherwise
   */
  public dismiss(id: string): boolean {
    const toast = this.toasts.get(id);
    if (!toast) return false;

    // Call the dismiss method if it exists
    if (typeof (toast as any).dismiss === 'function') {
      (toast as any).dismiss();
    } else {
      toast.remove();
      this.toasts.delete(id);
    }

    return true;
  }

  /**
   * Dismisses all active toasts.
   */
  public dismissAll(): void {
    this.toasts.forEach((toast, id) => {
      this.dismiss(id);
    });
  }

  private _getOrCreateContainer(position: ToastPosition): HTMLElement {
    if (this.containers.has(position)) {
      return this.containers.get(position)!;
    }

    const container = document.createElement('div');
    container.className = `k-toast-container k-toast-container--${position}`;

    // Ensure the container is appended to the body
    document.body.appendChild(container);

    this.containers.set(position, container);
    return container;
  }
}

export const toastManager = ToastManager.getInstance();
(window as any).toastManager = toastManager;
export { ToastManager };
