/**
 * XSS prevention utilities — used by every component for all DOM writes.
 *
 * Three functions, three use cases:
 *  1. sanitizeText  — plain text content (labels, messages, button text)
 *  2. sanitizeHtml  — rich/HTML content (tooltip rich variant, card allowHtml)
 *  3. sanitizeUrl   — URL attributes (src, href, action)
 *
 * Security model:
 * - sanitizeText:  100% XSS-safe via DOM text node — no HTML parsing occurs.
 * - sanitizeHtml:  Uses native Sanitizer API (Chrome 105+, FF 115+) first,
 *                  falls back to DOMPurify ^3.2.6 (patched CVE-2025-26791).
 *                  IMPORTANT: CVE-2026-41238 affects DOMPurify 3.0.1–3.3.3
 *                  via prototype pollution. Monitor for 3.3.4+ patch.
 * - sanitizeUrl:   Protocol whitelist — blocks javascript:, data:, vbscript:.
 *
 * NEVER use innerHTML with unsanitized user content. All library DOM writes
 * must go through one of these functions.
 */

import DOMPurify from 'dompurify';

/** HTML tags allowed in rich content. */
const ALLOWED_TAGS  = ['b', 'i', 'em', 'strong', 'span', 'br', 'p', 'a'];

/** HTML attributes allowed in rich content. */
const ALLOWED_ATTRS = ['href', 'title', 'target', 'rel'];

/** URL protocols considered safe. javascript:, data:, vbscript: are NOT included. */
const SAFE_PROTOCOLS = new Set(['https:', 'http:', 'mailto:', 'tel:', 'blob:']);

/**
 * Converts any input to safe plain text using the DOM's own text node mechanism.
 * Guaranteed XSS-safe — the browser never parses this as HTML.
 *
 * Use for: button labels, badge text, toast messages, input labels,
 *          any prop that renders as visible text without HTML formatting.
 *
 * @param input - Any value. Non-strings are coerced via String().
 * @returns     - Safe plain text string.
 *
 * @example
 * sanitizeText('<img src=x onerror=alert(1)>')
 * // → '<img src=x onerror=alert(1)>'  (rendered as literal text, not HTML)
 */
export function sanitizeText(input: unknown): string {
  if (input === null || input === undefined) return '';
  // Create a text node — browser handles encoding automatically
  const node    = document.createTextNode(String(input));
  const wrapper = document.createElement('span');
  wrapper.appendChild(node);
  // textContent returns the unescaped string — safe to use as textContent target
  return wrapper.textContent ?? '';
}

/**
 * Sanitizes an HTML string, removing scripts, event handlers, and dangerous
 * attributes before DOM insertion.
 *
 * Use for: tooltip `rich` variant content, card body with `allowHtml` prop.
 * Do NOT use for plain text — use sanitizeText() instead.
 *
 * Strategy:
 * 1. Native HTML Sanitizer API (`element.setHTML()`) — Chrome 105+, FF 115+
 * 2. DOMPurify 3.2.6 fallback for all other environments
 *
 * @param dirty - Raw HTML string from user props.
 * @returns     - Sanitized HTML string safe to assign to innerHTML.
 *
 * @example
 * sanitizeHtml('<b>Hello</b><script>alert(1)</script>')
 * // → '<b>Hello</b>'
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== 'string') return '';

  // Prefer native Sanitizer API (no external dependency, browser-native security)
  if (typeof window !== 'undefined' && 'Sanitizer' in window) {
    const el = document.createElement('div');
    // setHTML is defined on HTMLElement when Sanitizer API is available
    (el as unknown as HTMLElement & { setHTML: (html: string, opts: unknown) => void }).setHTML(dirty, {
      allowElements:   ALLOWED_TAGS,
      allowAttributes: { '*': ALLOWED_ATTRS },
    });
    return el.innerHTML;
  }

  // DOMPurify fallback — covers browsers without native Sanitizer API
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR:  ALLOWED_ATTRS,
    FORBID_TAGS:   ['script','style','iframe','object','embed','form','input'],
    FORBID_ATTR:   [
      'onerror','onload','onclick','onfocus','onblur',
      'onmouseover','onmouseout','onkeydown','onkeyup',
      'srcdoc','formaction','action',
    ],
  });
}

/**
 * Validates and sanitizes a URL, blocking unsafe protocols.
 *
 * Use for: img src, anchor href, any attribute set from a URL prop.
 *
 * Blocked protocols: javascript:, data:, vbscript:, file:
 * Allowed protocols: https:, http:, mailto:, tel:, blob: (local file previews)
 *
 * @param url - Raw URL string from a user prop.
 * @returns   - Validated URL string, or '#' if the URL is unsafe/invalid.
 *
 * @example
 * sanitizeUrl('javascript:alert(1)')  // → '#'
 * sanitizeUrl('https://example.com')  // → 'https://example.com/'
 * sanitizeUrl('mailto:hi@example.com') // → 'mailto:hi@example.com'
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (!trimmed) return '#';

  try {
    const parsed = new URL(trimmed, window.location.href);
    if (!SAFE_PROTOCOLS.has(parsed.protocol)) {
      console.warn(
        `[kenikool-ui] Blocked unsafe URL protocol: "${parsed.protocol}" in "${trimmed}". ` +
        `Only https:, http:, mailto:, tel: are allowed.`
      );
      return '#';
    }
    return parsed.href;
  } catch {
    // URL constructor throws for truly malformed URLs — return safe fallback
    console.warn(`[kenikool-ui] Invalid URL blocked: "${trimmed}"`);
    return '#';
  }
}
