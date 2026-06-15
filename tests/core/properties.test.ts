import { describe, it, expect, vi } from 'vitest';
import { parseV } from '../../src/core/parseV.js';
import { sanitizeText, sanitizeUrl } from '../../src/core/utils/sanitize.js';

describe('P1 — parseV idempotency', () => {
  it('parsing the same string twice produces identical VTokens', () => {
    const samples = ['', 'filled', 'filled lg', 'outlined xl warning r-full disabled .hero', null, undefined];
    for (const v of samples) {
      expect(parseV(v)).toEqual(parseV(v));
    }
  });
});

describe('P3 — sanitizeText DOM safety', () => {
  it('output never creates DOM children when assigned to textContent', () => {
    const samples = ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>', '', ' ', 'Hello & <world>'];
    for (const input of samples) {
      const output = sanitizeText(input);
      const span   = document.createElement('span');
      span.textContent = output;
      expect(span.childElementCount).toBe(0);
    }
  });
});

describe('P4 — sanitizeUrl protocol blocking', () => {
  it('returns # for any URL with a non-safe protocol', () => {
    const bad = ['javascript:alert(1)', 'data:text/html,<h1>xss</h1>', 'vbscript:msgbox(1)', 'blob:http://example.com', 'file:///etc/passwd'];
    for (const url of bad) {
      expect(sanitizeUrl(url)).toBe('#');
    }
  });
});
