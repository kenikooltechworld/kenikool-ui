import { describe, it, expect } from 'vitest';
import { sanitizeText, sanitizeHtml, sanitizeUrl } from '../../src/core/utils/sanitize.js';

describe('sanitizeText', () => {
  it('returns empty string for null/undefined', () => {
    expect(sanitizeText(null)).toBe('');
    expect(sanitizeText(undefined)).toBe('');
  });

  it('plain text is preserved verbatim (safe via textContent assignment)', () => {
    expect(sanitizeText('Submit')).toBe('Submit');
    expect(sanitizeText('Hello World')).toBe('Hello World');
    const out = sanitizeText('<img src=x onerror=alert(1)>');
    const span = document.createElement('span');
    span.textContent = out;
    expect(span.childElementCount).toBe(0);
  });

  it('coerces non-strings to string', () => {
    expect(sanitizeText(42)).toBe('42');
    expect(sanitizeText(true)).toBe('true');
  });
});

describe('sanitizeHtml', () => {
  it('returns empty string for null/undefined/empty', () => {
    expect(sanitizeHtml(null)).toBe('');
    expect(sanitizeHtml(undefined)).toBe('');
    expect(sanitizeHtml('')).toBe('');
  });

  it('strips script tags', () => {
    const r = sanitizeHtml('<p>Hello<script>alert(1)</script></p>');
    expect(r).not.toContain('<script');
    expect(r).not.toContain('alert(1)');
  });

  it('strips event handler attributes', () => {
    const r = sanitizeHtml('<img src=x onerror=alert(1)>');
    expect(r).not.toContain('onerror');
  });

  it('keeps allowed tags (b, i, em, strong, span, br, p, a)', () => {
    const input = '<b>bold</b><i>italic</i><em>em</em><strong>strong</strong><span>span</span><br><p>para</p><a href="https://x.com">link</a>';
    const r = sanitizeHtml(input);
    expect(r).toContain('<b>');
    expect(r).toContain('<i>');
    expect(r).toContain('<em>');
    expect(r).toContain('<strong>');
    expect(r).toContain('<span>');
    expect(r).toContain('<br>');
    expect(r).toContain('<p>');
    expect(r).toContain('<a');
    expect(r).toContain('link');
  });

  it('strips forbidden tags (iframe, object, embed, form, input)', () => {
    const input = '<iframe src="x"></iframe><object></object><embed><form><input>';
    const r = sanitizeHtml(input);
    expect(r).not.toContain('<iframe');
    expect(r).not.toContain('<object');
    expect(r).not.toContain('<embed');
    expect(r).not.toContain('<form');
    expect(r).not.toContain('<input');
  });

  it('plain text without tags stays intact', () => {
    expect(sanitizeHtml('Hello World')).toBe('Hello World');
  });
});

describe('sanitizeUrl', () => {
  it('returns # for null/undefined/empty/blank', () => {
    expect(sanitizeUrl(null)).toBe('#');
    expect(sanitizeUrl(undefined)).toBe('#');
    expect(sanitizeUrl('')).toBe('#');
    expect(sanitizeUrl('   ')).toBe('#');
  });

  it('allows https/http/mailto/tel', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
    expect(sanitizeUrl('mailto:hi@example.com')).toBe('mailto:hi@example.com');
    expect(sanitizeUrl('tel:+1234567890')).toBe('tel:+1234567890');
  });

  it('blocks unsafe protocols', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
    expect(sanitizeUrl('data:text/html,<h1>xss</h1>')).toBe('#');
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('#');
  });
});
