import { describe, it, expect } from 'vitest';
import { generateId } from '../../src/core/utils/generateId.js';

describe('generateId', () => {
  it('defaults to k- prefix', () => {
    const id = generateId();
    expect(id).toMatch(/^k-[0-9a-f]+$/);
  });

  it('uses custom prefix', () => {
    const id = generateId('input');
    expect(id).toMatch(/^input-[0-9a-f]+$/);
  });

  it('generates unique IDs on multiple calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it('produces different IDs across calls even with same prefix', () => {
    const id1 = generateId('x');
    const id2 = generateId('x');
    expect(id1).not.toBe(id2);
  });
});
