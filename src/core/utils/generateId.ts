/**
 * generateId — stable unique ID generator for ARIA linkage.
 *
 * Used to auto-generate IDs for <label> → <input> association,
 * aria-describedby → hint/error element, and tooltip aria-describedby.
 *
 * Users should never need to know these IDs exist — they are implementation
 * details that make accessibility work automatically.
 *
 * Strategy:
 * 1. crypto.randomUUID() — available in all modern browsers and Node 19+.
 *    Generates a RFC 4122 UUID. We use only the first 8 hex chars for brevity.
 * 2. Sequential counter fallback — for environments without crypto (rare).
 */

/** Monotonic counter used as a fallback when crypto.randomUUID is unavailable. */
let _counter = 0;

/**
 * Generates a unique ID string suitable for HTML `id` attributes.
 *
 * The generated ID is:
 * - Unique within the current page session
 * - Prefixed with `k-` (or a custom prefix) so it does not start with a digit
 * - Short enough to be readable in DevTools (e.g. `k-a1b2c3d4`)
 *
 * @param prefix - Optional prefix string. Defaults to 'k'. Must be a valid
 *                 CSS identifier start (letters only recommended).
 * @returns A unique ID string like `k-a1b2c3d4`.
 *
 * @example
 * generateId()           // → 'k-3f7a9c2d'
 * generateId('input')    // → 'input-3f7a9c2d'
 * generateId('tooltip')  // → 'tooltip-8b2e1a4f'
 */
export function generateId(prefix = 'k'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    // Use first 8 chars of UUID hex for a compact but still collision-resistant ID
    return `${prefix}-${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}`;
  }
  // Fallback: combine counter + timestamp for uniqueness
  _counter += 1;
  return `${prefix}-${_counter}-${Date.now().toString(36)}`;
}
