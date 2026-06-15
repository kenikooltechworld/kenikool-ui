import { describe, it, expect } from 'vitest';
import { createFocusTrap } from '../../src/core/utils/focusTrap.js';

describe('createFocusTrap', () => {
  it('activate completes without error in jsdom', async () => {
    document.body.innerHTML = '';
    const container = document.createElement('div');
    container.setAttribute('role', 'dialog');
    const btn = document.createElement('button');
    btn.id = 'inside-btn';
    container.appendChild(btn);
    document.body.appendChild(container);

    const trap = createFocusTrap(container);
    expect(() => trap.activate()).not.toThrow();

    await new Promise(r => setTimeout(r, 0));

    expect(document.body.contains(container)).toBe(true);

    expect(() => trap.deactivate()).not.toThrow();
    document.body.removeChild(container);
  });

  it('deactivate completes without error when trigger is provided', async () => {
    document.body.innerHTML = '';
    const trigger = document.createElement('button');
    trigger.id = 'trigger';
    document.body.appendChild(trigger);

    const container = document.createElement('div');
    container.setAttribute('role', 'dialog');
    const btn = document.createElement('button');
    btn.id = 'inside-btn';
    container.appendChild(btn);
    document.body.appendChild(container);

    const trap = createFocusTrap(container, trigger);
    expect(() => trap.activate()).not.toThrow();
    await new Promise(r => setTimeout(r, 0));

    expect(() => trap.deactivate()).not.toThrow();
    document.body.removeChild(trigger);
    document.body.removeChild(container);
  });
});
