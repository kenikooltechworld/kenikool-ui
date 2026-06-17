import { KBaseElement } from '../KBaseElement';
import { parseV } from '../../core/parseV';
import { generateId } from '../../core/utils/generateId';

export interface TooltipTokens {
  placement: string;
  variant: string;
  interactive: boolean;
  delay: number;
}

export class KTooltipElement extends KBaseElement {
  private _tooltipEl: HTMLElement | null = null;
  private _timer: number | null = null;
  private _active = false;

  protected static componentVariants = ['dark', 'primary', 'interactive'];

  protected _render(): void {
    // KTooltip is a wrapper; it doesn't need an internal render
    // as it uses the light DOM children as the trigger.
  }

  protected _applyAccessibility(): void {
    if (!this._tooltipEl) return;

    const id = this._tooltipEl.id;
    const trigger = this.firstElementChild as HTMLElement;
    if (trigger) {
      trigger.setAttribute('aria-describedby', id);
    }

    this._tooltipEl.setAttribute('role', 'tooltip');
  }

  protected _attachEventListeners(): void {
    this.addEventListener('mouseenter', this._handleMouseEnter);
    this.addEventListener('mouseleave', this._handleMouseLeave);
    this.addEventListener('focusin', this._handleFocusIn);
    this.addEventListener('focusout', this._handleFocusOut);
  }

  protected _detachEventListeners(): void {
    this.removeEventListener('mouseenter', this._handleMouseEnter);
    this.removeEventListener('mouseleave', this._handleMouseLeave);
    this.removeEventListener('focusin', this._handleFocusIn);
    this.removeEventListener('focusout', this._handleFocusOut);
  }

  private _handleMouseEnter = () => {
    this._showWithDelay();
  };

  private _handleMouseLeave = () => {
    const tokens = this._getTooltipTokens();
    if (tokens.interactive && this._tooltipEl && this._tooltipEl.matches(':hover')) {
      return;
    }
    this._hide();
  };

  private _handleFocusIn = () => {
    this._showWithDelay();
  };

  private _handleFocusOut = () => {
    this._hide();
  };

  private _getTooltipTokens(): TooltipTokens {
    const v = this.getAttribute('v') ?? '';
    const tokens = v.split(/\s+/).filter(Boolean);

    const placementToken = tokens.find(t =>
      ['top', 'bottom', 'left', 'right'].some(side => t.startsWith(side))
    ) || 'top';

    return {
      placement: placementToken,
      variant: tokens.find(t => !['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'left-start', 'left-end', 'right-start', 'right-end'].includes(t)) || 'default',
      interactive: v.includes('interactive'),
      delay: 300,
    };
  }

  private _showWithDelay(): void {
    if (this._timer) return;

    const tokens = this._getTooltipTokens();
    this._timer = window.setTimeout(() => {
      this._show();
      this._timer = null;
    }, tokens.delay);
  }

  private _show(): void {
    if (this._active) return;
    this._active = true;

    if (!this._tooltipEl) {
      this._createTooltip();
    }

    const tokens = this._getTooltipTokens();
    const triggerRect = this.getBoundingClientRect();
    const tooltipRect = this._tooltipEl!.getBoundingClientRect();
    const viewport = { w: window.innerWidth, h: window.innerHeight };

    const placement = this._computePlacement(triggerRect, tooltipRect, tokens.placement, viewport);

    this._tooltipEl!.setAttribute('data-placement', placement);
    this._tooltipEl!.setAttribute('data-variant', tokens.variant);
    this._tooltipEl!.setAttribute('data-interactive', String(tokens.interactive));

    this._positionTooltip(triggerRect, tooltipRect, placement);

    this._tooltipEl!.setAttribute('data-visible', 'true');
    this._applyAccessibility();
  }

  private _hide(): void {
    if (!this._active) return;
    this._active = false;

    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }

    if (this._tooltipEl) {
      this._tooltipEl.setAttribute('data-visible', 'false');
    }
  }

  private _createTooltip(): void {
    const content = this.getAttribute('text') || 'Tooltip';

    const container = document.createElement('div');
    container.className = 'k-tooltip-container';
    container.id = generateId('k-tooltip');
    container.setAttribute('data-visible', 'false'); // Start hidden

    const text = document.createElement('span');
    text.textContent = content;

    const arrow = document.createElement('div');
    arrow.className = 'k-tooltip-arrow';

    container.appendChild(text);
    container.appendChild(arrow);

    // Add event listeners for interactive tooltips
    const tokens = this._getTooltipTokens();
    if (tokens.interactive) {
      container.addEventListener('mouseenter', () => {
        this._active = true; // Keep active while hovering tooltip
      });
      container.addEventListener('mouseleave', () => {
        this._hide(); // Hide when leaving tooltip
      });
    }

    document.body.appendChild(container);
    this._tooltipEl = container;
  }

  private _positionTooltip(triggerRect: DOMRect, tooltipRect: DOMRect, placement: string): void {
    const el = this._tooltipEl!;
    const gap = 8;
    const [side, align = 'center'] = placement.split('-');

    let left = 0;
    let top = 0;

    if (side === 'top') {
      top = triggerRect.top - tooltipRect.height - gap;
      left = align === 'center'
        ? triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
        : align === 'start' ? triggerRect.left : triggerRect.left + triggerRect.width - tooltipRect.width;
    } else if (side === 'bottom') {
      top = triggerRect.bottom + gap;
      left = align === 'center'
        ? triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
        : align === 'start' ? triggerRect.left : triggerRect.left + triggerRect.width - tooltipRect.width;
    } else if (side === 'left') {
      left = triggerRect.left - tooltipRect.width - gap;
      top = align === 'center'
        ? triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
        : align === 'start' ? triggerRect.top : triggerRect.top + triggerRect.height - tooltipRect.height;
    } else if (side === 'right') {
      left = triggerRect.right + gap;
      top = align === 'center'
        ? triggerRect.top + (triggerRect.height - tooltipRect.height) / 2
        : align === 'start' ? triggerRect.top : triggerRect.top + triggerRect.height - tooltipRect.height;
    }

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }

  private _computePlacement(
    triggerRect: DOMRect,
    tooltipRect: DOMRect,
    preferred: string,
    viewport: { w: number; h: number }
  ): string {
    const [side, align = 'center'] = preferred.split('-');
    const gap = 8;

    const space = {
      top:    triggerRect.top    - tooltipRect.height - gap,
      bottom: viewport.h - triggerRect.bottom - tooltipRect.height - gap,
      left:   triggerRect.left   - tooltipRect.width  - gap,
      right:  viewport.w - triggerRect.right - tooltipRect.width  - gap,
    };

    type SideKey = 'top' | 'bottom' | 'left' | 'right';
    const FLIP_MAP: Record<SideKey, SideKey> = {
      top: 'bottom', bottom: 'top', left: 'right', right: 'left'
    };

    const validSide = (side === 'top' || side === 'bottom' || side === 'left' || side === 'right') ? side : 'top';
    
    const resolvedSide = space[validSide] < 0
      ? FLIP_MAP[validSide]
      : validSide;

    return align === 'center' ? resolvedSide : `${resolvedSide}-${align}`;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._tooltipEl?.remove();
    if (this._timer) clearTimeout(this._timer);
  }
}

customElements.define('k-tooltip', KTooltipElement);
