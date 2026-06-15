/**
 * KButtonElement tests.
 *
 * Architecture contract under test:
 * - Inner <button> has ZERO CSS classes — styling is driven by data-* on the host.
 * - All data-* attributes are set by KBaseElement._applyV() from the v string.
 * - Accessibility attributes (aria-*, disabled, tabindex) live on the inner <button>.
 * - k:click is dispatched on the host and bubbles; blocked when loading or disabled.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import './../../src/vanilla/Button/KButtonElement.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Creates a <k-button>, optionally sets v + text, appends to body, and returns it. */
function makeButton(v: string, text = 'Click me'): HTMLElement {
  const el = document.createElement('k-button') as HTMLElement;
  // Set textContent BEFORE v so the text is available when connectedCallback
  // calls _render(). Setting v first would trigger attributeChangedCallback
  // (before connectedCallback) and a subsequent el.textContent= would clobber
  // the inner <button> that _render() already built.
  el.textContent = text;
  if (v) el.setAttribute('v', v);
  document.body.appendChild(el);
  return el;
}

/** Returns the inner native <button> inside a <k-button>. */
function inner(el: HTMLElement): HTMLButtonElement | null {
  return el.querySelector('button');
}

afterEach(() => {
  document.body.innerHTML = '';
});

// ─── Registration ──────────────────────────────────────────────────────────────

describe('registration', () => {
  it('is registered as a custom element', async () => {
    await customElements.whenDefined('k-button');
    expect(customElements.get('k-button')).toBeDefined();
  });
});

// ─── Inner button structure ────────────────────────────────────────────────────

describe('inner button structure', () => {
  it('renders a single inner <button> child', () => {
    const el = makeButton('filled');
    expect(inner(el)).not.toBeNull();
    expect(el.querySelectorAll('button').length).toBe(1);
  });

  it('inner <button> has type="button"', () => {
    const el = makeButton('filled');
    expect(inner(el)?.type).toBe('button');
  });

  it('inner <button> has NO className — zero classes', () => {
    const el = makeButton('filled lg error r-full');
    const btn = inner(el);
    // className should be empty string — no classes for styling
    expect(btn?.className).toBe('');
  });

  it('text content is preserved in inner button', () => {
    const el = makeButton('filled', 'Submit');
    expect(inner(el)?.textContent?.trim()).toBe('Submit');
  });

  it('host textContent is empty after render (moved to inner button)', () => {
    const el = makeButton('filled', 'Submit');
    // Only the inner button holds the text — direct text nodes on host are gone
    const directText = Array.from(el.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => n.textContent?.trim())
      .join('');
    expect(directText).toBe('');
  });
});

// ─── data-* attributes (KBaseElement._applyV contract) ────────────────────────

describe('data-* attributes from v', () => {
  it('data-variant is set from v', () => {
    const el = makeButton('outlined');
    expect(el.dataset['variant']).toBe('outlined');
  });

  it('data-size is set from v', () => {
    const el = makeButton('filled lg');
    expect(el.dataset['size']).toBe('lg');
  });

  it('data-color is set from v', () => {
    const el = makeButton('filled error');
    expect(el.dataset['color']).toBe('error');
  });

  it('data-loading is "true" when loading token present', () => {
    const el = makeButton('filled loading');
    expect(el.dataset['loading']).toBe('true');
  });

  it('data-disabled is "true" when disabled token present', () => {
    const el = makeButton('filled disabled');
    expect(el.dataset['disabled']).toBe('true');
  });

  it('data-full is "true" when full token present', () => {
    const el = makeButton('filled full');
    expect(el.dataset['full']).toBe('true');
  });

  it('data-radius is set when r-* token present', () => {
    const el = makeButton('filled r-full');
    expect(el.dataset['radius']).toBe('full');
  });

  it('data-radius is absent when no r-* token', () => {
    const el = makeButton('filled');
    expect(el.dataset['radius']).toBeUndefined();
  });

  it('defaults: variant=filled, size=md, color=primary when v is empty', () => {
    const el = makeButton('', 'Test');
    expect(el.dataset['variant']).toBe('filled');
    expect(el.dataset['size']).toBe('md');
    expect(el.dataset['color']).toBe('primary');
  });

  it('unknown tokens become variant name', () => {
    const el = makeButton('custom-variant');
    expect(el.dataset['variant']).toBe('custom-variant');
  });
});

// ─── data-* update when v changes at runtime ─────────────────────────────────

describe('v attribute changes at runtime', () => {
  it('updates data-variant when v is changed', () => {
    const el = makeButton('filled');
    el.setAttribute('v', 'outlined');
    expect(el.dataset['variant']).toBe('outlined');
  });

  it('updates data-loading when v is changed to include loading', () => {
    const el = makeButton('filled');
    expect(el.dataset['loading']).toBe('false');
    el.setAttribute('v', 'filled loading');
    expect(el.dataset['loading']).toBe('true');
  });

  it('updates aria-busy on inner button when loading state changes', () => {
    const el = makeButton('filled');
    expect(inner(el)?.getAttribute('aria-busy')).toBe('false');
    el.setAttribute('v', 'filled loading');
    expect(inner(el)?.getAttribute('aria-busy')).toBe('true');
  });

  it('does not create a second inner button on v change', () => {
    const el = makeButton('filled');
    el.setAttribute('v', 'outlined lg');
    expect(el.querySelectorAll('button').length).toBe(1);
  });
});

// ─── Accessibility ─────────────────────────────────────────────────────────────

describe('accessibility attributes', () => {
  it('sets aria-busy="true" when loading', () => {
    const el = makeButton('filled loading');
    expect(inner(el)?.getAttribute('aria-busy')).toBe('true');
  });

  it('sets aria-busy="false" when not loading', () => {
    const el = makeButton('filled');
    expect(inner(el)?.getAttribute('aria-busy')).toBe('false');
  });

  it('sets aria-disabled="true" when disabled', () => {
    const el = makeButton('filled disabled');
    expect(inner(el)?.getAttribute('aria-disabled')).toBe('true');
  });

  it('sets aria-disabled="false" when not disabled', () => {
    const el = makeButton('filled');
    expect(inner(el)?.getAttribute('aria-disabled')).toBe('false');
  });

  it('sets native disabled property when disabled', () => {
    const el = makeButton('filled disabled');
    expect(inner(el)?.disabled).toBe(true);
  });

  it('sets tabindex="-1" when disabled', () => {
    const el = makeButton('filled disabled');
    expect(inner(el)?.getAttribute('tabindex')).toBe('-1');
  });

  it('sets tabindex="0" when not disabled', () => {
    const el = makeButton('filled');
    expect(inner(el)?.getAttribute('tabindex')).toBe('0');
  });

  it('sets aria-label to button text', () => {
    const el = makeButton('filled', 'Submit');
    expect(inner(el)?.getAttribute('aria-label')).toBe('Submit');
  });

  it('appends "— loading" suffix to aria-label when loading', () => {
    const el = makeButton('filled loading', 'Submit');
    expect(inner(el)?.getAttribute('aria-label')).toBe('Submit — loading');
  });
});

// ─── Loading spinner ───────────────────────────────────────────────────────────

describe('loading spinner', () => {
  it('shows .k-button__loader when loading', () => {
    const el = makeButton('filled loading');
    expect(inner(el)?.querySelector('.k-button__loader')).not.toBeNull();
  });

  it('does not show .k-button__loader when not loading', () => {
    const el = makeButton('filled');
    expect(inner(el)?.querySelector('.k-button__loader')).toBeNull();
  });

  it('loader has aria-hidden="true"', () => {
    const el = makeButton('filled loading');
    const loader = inner(el)?.querySelector('.k-button__loader');
    expect(loader?.getAttribute('aria-hidden')).toBe('true');
  });

  it('loader is removed when loading is turned off', () => {
    const el = makeButton('filled loading');
    expect(inner(el)?.querySelector('.k-button__loader')).not.toBeNull();
    el.setAttribute('v', 'filled');
    expect(inner(el)?.querySelector('.k-button__loader')).toBeNull();
  });

  it('only one loader is added even if accessibility re-runs', () => {
    const el = makeButton('filled loading');
    // Trigger attributeChangedCallback again with same value shouldn't matter
    // but let's be sure no duplicate is added via a real change cycle
    el.setAttribute('v', 'outlined loading');
    el.setAttribute('v', 'filled loading');
    expect(inner(el)?.querySelectorAll('.k-button__loader').length).toBe(1);
  });
});

// ─── k:click event ────────────────────────────────────────────────────────────

describe('k:click event', () => {
  it('fires k:click on host when button is clicked normally', () => {
    const el  = makeButton('filled');
    const spy = vi.fn();
    el.addEventListener('k:click', spy);
    inner(el)?.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('k:click event bubbles', () => {
    const el      = makeButton('filled');
    const parent  = document.createElement('div');
    document.body.appendChild(parent);
    parent.appendChild(el);
    const spy = vi.fn();
    parent.addEventListener('k:click', spy);
    inner(el)?.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does NOT fire k:click when loading', () => {
    const el  = makeButton('filled loading');
    const spy = vi.fn();
    el.addEventListener('k:click', spy);
    inner(el)?.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('does NOT fire k:click when disabled', () => {
    const el  = makeButton('filled disabled');
    const spy = vi.fn();
    el.addEventListener('k:click', spy);
    inner(el)?.click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('detail contains originalEvent', () => {
    const el  = makeButton('filled');
    let detail: CustomEvent['detail'] | null = null;
    el.addEventListener('k:click', (e) => { detail = (e as CustomEvent).detail; });
    inner(el)?.click();
    expect(detail).not.toBeNull();
    expect((detail as { originalEvent: MouseEvent }).originalEvent).toBeInstanceOf(MouseEvent);
  });
});

// ─── Target selector ──────────────────────────────────────────────────────────

describe('target selector (v mount target)', () => {
  it('moves element into target container when selector matches', () => {
    const container = document.createElement('div');
    container.id = 'target-zone';
    document.body.appendChild(container);

    const el = document.createElement('k-button') as HTMLElement;
    el.textContent = 'Test';
    el.setAttribute('v', 'filled #target-zone');
    document.body.appendChild(el);

    expect(el.parentElement).toBe(container);
  });

  it('stays in place and warns when target selector matches nothing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const el = makeButton('filled .nonexistent');
    expect(el.parentElement).toBe(document.body);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('.nonexistent')
    );
    warnSpy.mockRestore();
  });
});
