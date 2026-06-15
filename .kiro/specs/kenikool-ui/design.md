# Kenikool UI — Technical Design Document

> Version: 1.0.0  
> Status: Active  
> Reference: #[[file:../../../RESEARCH.md]]

---

## 1. High-Level Architecture

### System Overview

Kenikool UI is a single npm package (`kenikool-ui`) with three independently importable entry points. The source is organized into a shared `core` layer and three target-specific layers: `vanilla`, `react`, and `themes`.

```
┌─────────────────────────────────────────────────────────┐
│                    kenikool-ui (npm)                     │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  /vanilla    │  │   /react     │  │   /themes    │  │
│  │ Web Custom   │  │  React JSX   │  │ ThemeSwitcher│  │
│  │  Elements    │  │  Components  │  │  + useTheme  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│         └─────────────────┴──────────────────┘          │
│                           │                             │
│              ┌────────────▼────────────┐               │
│              │      src/core/          │               │
│              │  parseV · sanitize      │               │
│              │  types · tokens         │               │
│              └─────────────────────────┘               │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │                 /styles  (CSS only)              │   │
│  │   base.css · light.css · dark.css · dracula.css  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Data Flow — Vanilla JS

```
User writes <k-button v="filled lg error .hero">Delete</k-button>
        │
        ▼
Browser parses HTML → finds unknown tag → looks up customElements registry
        │
        ▼
KButtonElement.connectedCallback() fires
        │
        ├─→ parseV("filled lg error .hero")
        │       → { variant: 'filled', size: 'lg', color: 'error', target: '.hero', ... }
        │
        ├─→ _applyV()  [in KBaseElement]
        │       → this.dataset.variant = 'filled'
        │       → this.dataset.size    = 'lg'
        │       → this.dataset.color   = 'error'
        │       → this.dataset.loading = 'false'
        │       (all data-* on the HOST element — the CSS reads these)
        │
        ├─→ _render()
        │       → creates inner <button type="button"> with NO classes
        │       → moves text content into inner button safely (sanitizeText)
        │
        ├─→ _applyAccessibility()
        │       → inner <button> gets aria-disabled, aria-busy, tabindex, aria-label
        │
        ├─→ _handleTarget()
        │       → document.querySelector('.hero').appendChild(this)
        │       → component physically moves into the target container
        │
        └─→ CSS reads host data-* attributes
                k-button[data-variant="filled"][data-color="error"] button { background: var(--k-error); }
                → component is visually rendered — zero user CSS needed
```

**Key principle:** The inner `<button>` has zero classes. All visual styling is driven by `data-*` attributes on the `<k-button>` host, selected via CSS attribute selectors. JavaScript never touches classes for styling.

### Data Flow — React

```
User writes <Button variant="filled" size="lg" color="primary">Submit</Button>
        │
        ▼
React renders KButton functional component
        │
        ├─→ Props are validated by TypeScript at compile time
        │
        ├─→ Component computes className string from props
        │       → "k-button k-button--filled k-button--lg k-button--primary"
        │
        ├─→ Renders <button> element with className + aria-* + event handlers
        │
        └─→ CSS classes map to CSS variable references
                → component is visually rendered
```

### Data Flow — Theme Switch

```
User selects "Dracula" in ThemeSwitcher
        │
        ▼
handleSelect('dracula')
        │
        ├─→ document.documentElement.setAttribute('data-theme', 'dracula')
        │       → CSS cascade: [data-theme="dracula"] { --k-accent: #bd93f9; ... }
        │       → ALL components on page re-render visually (CSS only, no JS)
        │
        ├─→ localStorage.setItem('kenikool-theme', 'dracula')
        │
        └─→ onChange?.('dracula')  ← optional user callback
```

---

## 2. Directory & File Structure

```
kenikool-ui/
│
├── src/
│   │
│   ├── core/                          ← Shared, framework-agnostic
│   │   ├── parseV.ts                  ← v attribute parser
│   │   ├── types.ts                   ← Shared TypeScript interfaces
│   │   ├── constants.ts               ← VARIANTS, SIZES, COLORS, STATES
│   │   └── utils/
│   │       ├── sanitize.ts            ← sanitizeText, sanitizeHtml, sanitizeUrl
│   │       ├── generateId.ts          ← Unique ID generator for ARIA
│   │       └── focusTrap.ts           ← Reusable focus trap logic (Modal)
│   │
│   ├── vanilla/                       ← Web Custom Elements
│   │   ├── index.ts                   ← Re-exports + self-registers all elements
│   │   ├── Button/
│   │   │   ├── KButtonElement.ts      ← Custom element class
│   │   │   └── KButton.css            ← Component styles
│   │   ├── Input/
│   │   │   ├── KInputElement.ts
│   │   │   └── KInput.css
│   │   ├── Badge/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Select/
│   │   ├── Checkbox/
│   │   ├── Toast/
│   │   │   ├── KToastElement.ts
│   │   │   ├── KToastManager.ts       ← Static show() method + queue management
│   │   │   └── KToast.css
│   │   ├── Tooltip/
│   │   ├── Avatar/
│   │   ├── Loader/
│   │   └── ThemeSwitcher/
│   │       ├── KThemeSwitcherElement.ts
│   │       └── KThemeSwitcher.css
│   │
│   ├── react/                         ← React functional components
│   │   ├── index.ts                   ← Barrel export
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts        ← ButtonProps interface
│   │   │   └── Button.css
│   │   ├── Input/
│   │   ├── Badge/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Select/
│   │   ├── Checkbox/
│   │   ├── Toast/
│   │   │   ├── Toast.tsx
│   │   │   ├── ToastManager.ts        ← Internal queue + portal rendering
│   │   │   └── useToast.ts            ← Public hook
│   │   ├── Tooltip/
│   │   ├── Avatar/
│   │   └── Loader/
│   │
│   ├── themes/                        ← ThemeSwitcher + hook
│   │   ├── index.ts
│   │   ├── ThemeSwitcher.tsx
│   │   ├── ThemeSwitcher.css
│   │   ├── useTheme.ts
│   │   └── themeCore.ts               ← getInitialTheme, applyTheme (shared by React + Vanilla)
│   │
│   └── styles/                        ← Pure CSS, no JS
│       ├── base.css                   ← @import all below in correct order
│       ├── reset.css                  ← Minimal CSS reset
│       ├── tokens/
│       │   ├── shared.css             ← Spacing, typography, radius, z-index, transitions
│       │   ├── light.css              ← :root + [data-theme="light"] color tokens
│       │   ├── dark.css               ← [data-theme="dark"] color tokens
│       │   └── dracula.css            ← [data-theme="dracula"] color tokens
│       ├── components/
│       │   ├── button.css
│       │   ├── input.css
│       │   ├── badge.css
│       │   ├── card.css
│       │   ├── modal.css
│       │   ├── select.css
│       │   ├── checkbox.css
│       │   ├── toast.css
│       │   ├── tooltip.css
│       │   ├── avatar.css
│       │   └── loader.css
│       └── animations.css             ← All @keyframes definitions
│
├── stories/                           ← Storybook stories
│   ├── Button.stories.tsx
│   ├── Input.stories.tsx
│   ├── Badge.stories.tsx
│   ├── Card.stories.tsx
│   ├── Modal.stories.tsx
│   ├── Select.stories.tsx
│   ├── Checkbox.stories.tsx
│   ├── Toast.stories.tsx
│   ├── Tooltip.stories.tsx
│   ├── Avatar.stories.tsx
│   ├── Loader.stories.tsx
│   └── ThemeSwitcher.stories.tsx
│
├── tests/                             ← Unit + property tests
│   ├── core/
│   │   ├── parseV.test.ts
│   │   └── sanitize.test.ts
│   ├── react/
│   │   ├── Button.test.tsx
│   │   └── ...
│   └── vanilla/
│       ├── KButtonElement.test.ts
│       └── ...
│
├── dist/                              ← Generated by build, not committed
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── tsup.config.ts
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── package.json
├── pnpm-lock.yaml
├── .eslintrc.json
├── .changeset/
│   └── config.json
└── README.md
```

---

## 3. Core Module Design

### 3.1 `parseV.ts` — The `v` Attribute Parser

This is the single most important shared module. It converts a `v` attribute string into a typed `VTokens` object that both Vanilla and React can use.

```typescript
// src/core/parseV.ts

export interface VTokens {
  variant:  string;          // default: 'filled'
  size:     'xs'|'sm'|'md'|'lg'|'xl';       // default: 'md'
  color:    'primary'|'success'|'warning'|'error'|'info'|'default'; // default: 'primary'
  radius:   'none'|'sm'|'md'|'lg'|'full'|null;  // null = use component default
  loading:  boolean;         // default: false
  disabled: boolean;         // default: false
  full:     boolean;         // default: false
  target:   string | null;   // CSS selector e.g. '.hero' or '#app', null if none
}

const SIZES   = new Set(['xs','sm','md','lg','xl']);
const COLORS  = new Set(['primary','success','warning','error','info','default']);
const RADII   = new Set(['r-none','r-sm','r-md','r-lg','r-full']);
const STATES  = new Set(['loading','disabled','full']);
const RADIUS_MAP: Record<string,string> = {
  'r-none': 'none', 'r-sm': 'sm', 'r-md': 'md', 'r-lg': 'lg', 'r-full': 'full'
};

export function parseV(v: string): VTokens {
  const tokens = (v ?? '').trim().split(/\s+/).filter(Boolean);

  const result: VTokens = {
    variant: 'filled',
    size:    'md',
    color:   'primary',
    radius:  null,
    loading:  false,
    disabled: false,
    full:     false,
    target:   null,
  };

  for (const token of tokens) {
    if (token.startsWith('.') || token.startsWith('#')) {
      result.target   = token;
    } else if (SIZES.has(token)) {
      result.size     = token as VTokens['size'];
    } else if (COLORS.has(token)) {
      result.color    = token as VTokens['color'];
    } else if (RADII.has(token)) {
      result.radius   = RADIUS_MAP[token] as VTokens['radius'];
    } else if (token === 'loading')  {
      result.loading  = true;
    } else if (token === 'disabled') {
      result.disabled = true;
    } else if (token === 'full') {
      result.full     = true;
    } else if (token.length > 0) {
      result.variant  = token;  // anything else = variant name
    }
  }

  return result;
}
```

**Design notes:**
- Pure function — no side effects, no DOM access. Easily unit-tested.
- Token order is irrelevant — set-based lookup is O(1).
- Unknown tokens become the variant — forward-compatible with new variants.
- Returns defaults for all unspecified tokens — components always get complete config.

### 3.2 `sanitize.ts` — XSS Prevention Utilities

```typescript
// src/core/utils/sanitize.ts
import DOMPurify from 'dompurify';

// Tags and attributes allowed in rich/HTML content
const ALLOWED_TAGS  = ['b','i','em','strong','span','br','p','a'];
const ALLOWED_ATTRS = ['href','title','target','rel'];

/**
 * Safe plain text rendering. Uses DOM text node — 100% XSS safe.
 * Use for: labels, titles, messages, any prop that renders as text.
 */
export function sanitizeText(input: unknown): string {
  if (input === null || input === undefined) return '';
  const node    = document.createTextNode(String(input));
  const wrapper = document.createElement('span');
  wrapper.appendChild(node);
  return wrapper.textContent ?? '';
}

/**
 * Safe HTML rendering. Native Sanitizer API first, DOMPurify fallback.
 * Use for: rich tooltip content, card body with allowHtml=true.
 * NEVER use for plain text props.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';

  // Prefer native Sanitizer API (Chrome 105+, Firefox 115+)
  if (typeof window !== 'undefined' && 'Sanitizer' in window) {
    const el = document.createElement('div');
    (el as any).setHTML(dirty, {
      allowElements:    ALLOWED_TAGS,
      allowAttributes:  { '*': ALLOWED_ATTRS },
    });
    return el.innerHTML;
  }

  // DOMPurify fallback (^3.2.5 — patches CVE-2025-26791)
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR:  ALLOWED_ATTRS,
    FORBID_TAGS:   ['script','style','iframe','object','embed','form'],
    FORBID_ATTR:   ['onerror','onload','onclick','onfocus','onblur',
                    'onmouseover','onmouseout','srcdoc','formaction'],
  });
}

/**
 * Safe URL validation. Blocks javascript:, data:, vbscript: protocols.
 * Use for: src, href, action attributes set from user props.
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '#';
  try {
    const parsed   = new URL(url, window.location.href);
    const SAFE     = ['https:','http:','mailto:','tel:'];
    if (!SAFE.includes(parsed.protocol)) {
      console.warn(`[kenikool-ui] Blocked unsafe URL protocol: "${parsed.protocol}" in "${url}"`);
      return '#';
    }
    return parsed.href;
  } catch {
    // Invalid URL — return safe fallback
    return '#';
  }
}
```

### 3.3 `focusTrap.ts` — Reusable Modal Focus Trap

```typescript
// src/core/utils/focusTrap.ts

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])', 'details > summary',
].join(', ');

export interface FocusTrap {
  activate:   () => void;
  deactivate: () => void;
}

/**
 * Creates a focus trap within a container element.
 * Tab wraps from last → first. Shift+Tab wraps from first → last.
 * 
 * @param container  The element to trap focus within
 * @param returnTo   The element that triggered the open (receives focus on deactivate)
 */
export function createFocusTrap(
  container: HTMLElement,
  returnTo?: HTMLElement | null
): FocusTrap {

  function getFocusable(): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE))
      .filter(el => !el.closest('[hidden]') && el.offsetParent !== null);
  }

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable();
    if (focusable.length === 0) { e.preventDefault(); return; }

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return {
    activate() {
      document.addEventListener('keydown', handleKeydown);
      // Move focus into container
      const first = getFocusable()[0] ?? container;
      // Defer to allow CSS transitions to complete before focusing
      requestAnimationFrame(() => first.focus());
    },
    deactivate() {
      document.removeEventListener('keydown', handleKeydown);
      returnTo?.focus();
    },
  };
}
```

### 3.4 `generateId.ts` — Stable Unique ID Generator

Used for linking `<label>` to `<input>` and ARIA `aria-describedby` without requiring user-provided IDs.

```typescript
// src/core/utils/generateId.ts
let counter = 0;

export function generateId(prefix = 'k'): string {
  // crypto.randomUUID() preferred (no collision risk)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  // Fallback for environments without crypto
  return `${prefix}-${++counter}-${Date.now().toString(36)}`;
}
```

---

## 4. Vanilla JS Web Component Design

### 4.1 Base Class — `KBaseElement`

All Web Components extend a shared base class that provides common behavior:

```typescript
// src/vanilla/KBaseElement.ts
import { parseV, type VTokens } from '../core/parseV';
import { sanitizeText }         from '../core/utils/sanitize';

export abstract class KBaseElement extends HTMLElement {

  // Subclasses declare which component-specific v-tokens they support
  // e.g. ['otp', 'textarea'] for Input
  protected static componentVariants: string[] = [];

  static get observedAttributes() { return ['v']; }

  connectedCallback() {
    this._applyV();
    this._render();
    this._applyAccessibility();
    this._handleTarget();
    this._attachEventListeners();
  }

  disconnectedCallback() {
    this._detachEventListeners();
  }

  attributeChangedCallback(_name: string, oldVal: string, newVal: string) {
    if (oldVal !== newVal) {
      this._applyV();
      this._applyAccessibility();
    }
  }

  // Parse v attribute and apply as dataset properties
  protected _applyV(): void {
    const tokens = parseV(this.getAttribute('v') ?? '');
    this.dataset.variant  = tokens.variant;
    this.dataset.size     = tokens.size;
    this.dataset.color    = tokens.color;
    this.dataset.loading  = String(tokens.loading);
    this.dataset.disabled = String(tokens.disabled);
    this.dataset.full     = String(tokens.full);
    if (tokens.radius) this.dataset.radius = tokens.radius;
  }

  // Move element to target selector container
  protected _handleTarget(): void {
    const tokens = parseV(this.getAttribute('v') ?? '');
    if (!tokens.target) return;
    const container = document.querySelector(tokens.target);
    if (!container) {
      console.warn(`[kenikool-ui] Target selector "${tokens.target}" not found.`);
      return;
    }
    if (container !== this.parentElement) {
      container.appendChild(this);
    }
  }

  // Subclasses implement their own render and accessibility logic
  protected abstract _render(): void;
  protected abstract _applyAccessibility(): void;
  protected _attachEventListeners(): void {}
  protected _detachEventListeners(): void {}
}
```

### 4.2 KButtonElement — Full Implementation Design

```typescript
// src/vanilla/Button/KButtonElement.ts
import { KBaseElement }  from '../KBaseElement';
import { parseV }        from '../../core/parseV';
import { sanitizeText }  from '../../core/utils/sanitize';

class KButtonElement extends KBaseElement {

  private _innerButton: HTMLButtonElement | null = null;
  private _clickHandler = (e: MouseEvent) => this._handleClick(e);

  protected _render(): void {
    // Only build the inner structure once
    if (this._innerButton) return;

    this._innerButton = document.createElement('button');
    this._innerButton.type = 'button';

    // Move text content into the inner button safely
    const label = sanitizeText(this.textContent ?? '');
    this._innerButton.textContent = label;
    this.textContent = '';
    this.appendChild(this._innerButton);
  }

  protected _applyAccessibility(): void {
    const btn = this._innerButton;
    if (!btn) return;

    const tokens  = parseV(this.getAttribute('v') ?? '');
    const label   = sanitizeText(btn.textContent ?? '');

    btn.disabled = tokens.disabled;
    btn.setAttribute('aria-disabled', String(tokens.disabled));
    btn.setAttribute('aria-busy',     String(tokens.loading));
    btn.setAttribute('tabindex',      tokens.disabled ? '-1' : '0');

    if (tokens.loading) {
      btn.setAttribute('aria-label', `${label} — loading`);
      this._showLoader();
    } else {
      btn.setAttribute('aria-label', label);
      this._hideLoader();
    }
  }

  private _showLoader(): void {
    if (this.querySelector('.k-btn-loader')) return;
    const loader = document.createElement('span');
    loader.className          = 'k-btn-loader';
    loader.setAttribute('aria-hidden', 'true');
    this._innerButton?.appendChild(loader);
  }

  private _hideLoader(): void {
    this.querySelector('.k-btn-loader')?.remove();
  }

  protected _attachEventListeners(): void {
    this._innerButton?.addEventListener('click', this._clickHandler);
  }

  protected _detachEventListeners(): void {
    this._innerButton?.removeEventListener('click', this._clickHandler);
  }

  private _handleClick(e: MouseEvent): void {
    const tokens = parseV(this.getAttribute('v') ?? '');
    if (tokens.disabled || tokens.loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // Dispatch custom event that bubbles — users can listen on parent containers
    this.dispatchEvent(new CustomEvent('k:click', {
      bubbles: true, composed: true,
      detail: { originalEvent: e },
    }));
  }
}

customElements.define('k-button', KButtonElement);
```

### 4.3 CSS Architecture for Web Components

Components use **Light DOM** (not Shadow DOM). This means:
- Global CSS custom properties (`--k-*`) work without `::part()` workarounds
- Theme switching via `data-theme` on `<html>` cascades into all components naturally
- Users can override styles with standard CSS specificity

```css
/* src/styles/components/button.css */

/* Base — structural styles shared across all variants */
k-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

k-button[data-full="true"] {
  width: 100%;
  display: flex;
}

k-button button {
  display: inline-flex;
  align-items: center;
  gap: var(--k-space-2);
  border: none;
  cursor: pointer;
  font-family: var(--k-font-sans);
  font-weight: var(--k-font-medium);
  border-radius: var(--k-radius-md);
  transition: all var(--k-transition-base);
  white-space: nowrap;
  text-decoration: none;
  position: relative;
  outline: none;
}

/* Focus visible ring */
k-button button:focus-visible {
  outline: 2px solid var(--k-focus-ring);
  outline-offset: 2px;
}

/* === SIZE VARIANTS === */
k-button[data-size="xs"] button { padding: 4px 8px;   font-size: var(--k-text-xs); }
k-button[data-size="sm"] button { padding: 6px 12px;  font-size: var(--k-text-sm); }
k-button[data-size="md"] button { padding: 8px 16px;  font-size: var(--k-text-base); }
k-button[data-size="lg"] button { padding: 12px 24px; font-size: var(--k-text-lg); }
k-button[data-size="xl"] button { padding: 16px 32px; font-size: var(--k-text-xl); }

/* === VISUAL VARIANTS === */
k-button[data-variant="filled"] button {
  background: var(--k-accent);
  color: var(--k-text-inverse);
}
k-button[data-variant="filled"] button:hover  { background: var(--k-accent-hover); }
k-button[data-variant="filled"] button:active { background: var(--k-accent-active); }

k-button[data-variant="outlined"] button {
  background: transparent;
  color: var(--k-accent);
  border: 1px solid var(--k-accent);
}
k-button[data-variant="outlined"] button:hover { background: var(--k-accent-subtle); }

k-button[data-variant="ghost"] button {
  background: transparent;
  color: var(--k-text-primary);
  border: none;
}
k-button[data-variant="ghost"] button:hover { background: var(--k-bg-surface); }

k-button[data-variant="gradient"] button {
  background: linear-gradient(135deg, var(--k-accent), var(--k-accent-hover));
  color: var(--k-text-inverse);
  border: none;
}
k-button[data-variant="gradient"] button:hover {
  background: linear-gradient(160deg, var(--k-accent), var(--k-accent-hover));
}

k-button[data-variant="glow"] button {
  background: var(--k-accent);
  color: var(--k-text-inverse);
  border: none;
  box-shadow: 0 0 16px var(--k-accent-subtle), 0 0 4px var(--k-accent);
}
k-button[data-variant="glow"] button:hover {
  box-shadow: 0 0 24px var(--k-accent-subtle), 0 0 8px var(--k-accent);
}

k-button[data-variant="destructive"] button {
  background: var(--k-error);
  color: var(--k-text-inverse);
  border: none;
}

/* === STATES === */
k-button[data-loading="true"] button {
  opacity: 0.75;
  cursor: wait;
  pointer-events: none;
}

k-button[data-disabled="true"] button {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

/* === COLOR OVERRIDES — per-variant semantics ===
 *
 * Color modifies meaning per variant:
 *   filled / gradient / glow / soft / subtle → changes background to semantic color
 *   outlined                                 → changes border + text color
 *   ghost / minimal                          → changes text color only
 *   elevated / destructive                   → color token ignored (fixed semantics)
 *   primary (default)                        → defers to --k-accent, no override needed
 */

/* filled + color */
k-button[data-color="error"][data-variant="filled"] button,
k-button[data-color="error"][data-variant="gradient"] button,
k-button[data-color="error"][data-variant="glow"] button,
k-button[data-color="error"][data-variant="soft"] button,
k-button[data-color="error"][data-variant="subtle"] button   { background: var(--k-error);   color: var(--k-text-inverse); }

k-button[data-color="success"][data-variant="filled"] button,
k-button[data-color="success"][data-variant="gradient"] button,
k-button[data-color="success"][data-variant="glow"] button,
k-button[data-color="success"][data-variant="soft"] button,
k-button[data-color="success"][data-variant="subtle"] button { background: var(--k-success); color: var(--k-text-inverse); }

k-button[data-color="warning"][data-variant="filled"] button,
k-button[data-color="warning"][data-variant="gradient"] button,
k-button[data-color="warning"][data-variant="glow"] button,
k-button[data-color="warning"][data-variant="soft"] button,
k-button[data-color="warning"][data-variant="subtle"] button { background: var(--k-warning); color: var(--k-text-inverse); }

k-button[data-color="info"][data-variant="filled"] button,
k-button[data-color="info"][data-variant="gradient"] button,
k-button[data-color="info"][data-variant="glow"] button,
k-button[data-color="info"][data-variant="soft"] button,
k-button[data-color="info"][data-variant="subtle"] button    { background: var(--k-info);    color: var(--k-text-inverse); }

/* outlined + color → border + text */
k-button[data-color="error"][data-variant="outlined"] button   { color: var(--k-error);   border-color: var(--k-error); }
k-button[data-color="success"][data-variant="outlined"] button { color: var(--k-success); border-color: var(--k-success); }
k-button[data-color="warning"][data-variant="outlined"] button { color: var(--k-warning); border-color: var(--k-warning); }
k-button[data-color="info"][data-variant="outlined"] button    { color: var(--k-info);    border-color: var(--k-info); }

/* ghost + minimal + color → text only */
k-button[data-color="error"][data-variant="ghost"] button,
k-button[data-color="error"][data-variant="minimal"] button   { color: var(--k-error); }
k-button[data-color="success"][data-variant="ghost"] button,
k-button[data-color="success"][data-variant="minimal"] button { color: var(--k-success); }
k-button[data-color="warning"][data-variant="ghost"] button,
k-button[data-color="warning"][data-variant="minimal"] button { color: var(--k-warning); }
k-button[data-color="info"][data-variant="ghost"] button,
k-button[data-color="info"][data-variant="minimal"] button    { color: var(--k-info); }

/* default color → neutral grey */
k-button[data-color="default"] button { background: var(--k-bg-elevated); color: var(--k-text-secondary); }

/* === RADIUS OVERRIDES === */
k-button[data-radius="none"] button { border-radius: var(--k-radius-none); }
k-button[data-radius="sm"]   button { border-radius: var(--k-radius-sm);   }
k-button[data-radius="full"] button { border-radius: var(--k-radius-full); }

/* Inline spinner inside loading button */
.k-btn-loader {
  width: 1em; height: 1em;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: k-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .k-btn-loader { animation: none; opacity: 0.6; }
}
```

---

## 5. React Component Design

### 5.1 Button — Full React Implementation Design

```typescript
// src/react/Button/Button.types.ts

export type ButtonVariant =
  | 'filled' | 'outlined' | 'ghost' | 'subtle' | 'soft'
  | 'gradient' | 'glow' | 'minimal' | 'elevated' | 'destructive';

export type ButtonSize  = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';
export type ButtonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant;     // default: 'filled'
  size?:      ButtonSize;        // default: 'md'
  color?:     ButtonColor;       // default: 'primary'
  radius?:    ButtonRadius;
  loading?:   boolean;           // default: false
  full?:      boolean;           // default: false
  icon?:      React.ReactNode;   // leading icon
  iconRight?: React.ReactNode;   // trailing icon
  // When only icon is used, label is required for a11y
  label?:     string;
  children?:  React.ReactNode;
}
```

```typescript
// src/react/Button/Button.tsx
import React, { forwardRef } from 'react';
import type { ButtonProps }  from './Button.types';
import './Button.css';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant  = 'filled',
      size     = 'md',
      color    = 'primary',
      radius,
      loading  = false,
      disabled = false,
      full     = false,
      icon,
      iconRight,
      label,
      children,
      className,
      onClick,
      ...rest
    },
    ref
  ) {
    const classes = [
      'k-button',
      `k-button--${variant}`,
      `k-button--${size}`,
      `k-button--${color}`,
      radius   ? `k-button--r-${radius}` : '',
      loading  ? 'k-button--loading'     : '',
      disabled ? 'k-button--disabled'    : '',
      full     ? 'k-button--full'        : '',
      className ?? '',
    ].filter(Boolean).join(' ');

    // Accessible name: explicit label > children text > undefined
    const accessibleName = label ?? (typeof children === 'string' ? children : undefined);

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
      if (loading || disabled) { e.preventDefault(); return; }
      onClick?.(e);
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        aria-disabled={disabled}
        aria-busy={loading}
        aria-label={accessibleName}
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        {...rest}
      >
        {icon     && <span className="k-button__icon-left"  aria-hidden="true">{icon}</span>}
        {loading  && <span className="k-button__loader"     aria-hidden="true" />}
        {children && <span className="k-button__label">{children}</span>}
        {iconRight && <span className="k-button__icon-right" aria-hidden="true">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### 5.2 React CSS — BEM Classes Mapping to Tokens

```css
/* src/react/Button/Button.css */
/* Mirrors the vanilla CSS but uses .k-button--* BEM classes */

.k-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--k-space-2);
  border: none;
  cursor: pointer;
  font-family: var(--k-font-sans);
  font-weight: var(--k-font-medium);
  border-radius: var(--k-radius-md);
  transition: all var(--k-transition-base);
  white-space: nowrap;
  outline: none;
}

.k-button:focus-visible {
  outline: 2px solid var(--k-focus-ring);
  outline-offset: 2px;
}

/* sizes */
.k-button--xs { padding: 4px 8px;   font-size: var(--k-text-xs); }
.k-button--sm { padding: 6px 12px;  font-size: var(--k-text-sm); }
.k-button--md { padding: 8px 16px;  font-size: var(--k-text-base); }
.k-button--lg { padding: 12px 24px; font-size: var(--k-text-lg); }
.k-button--xl { padding: 16px 32px; font-size: var(--k-text-xl); }

/* variants — same tokens as vanilla */
.k-button--filled   { background: var(--k-accent); color: var(--k-text-inverse); }
.k-button--outlined { background: transparent; color: var(--k-accent); border: 1px solid var(--k-accent); }
.k-button--ghost    { background: transparent; color: var(--k-text-primary); }
.k-button--gradient { background: linear-gradient(135deg, var(--k-accent), var(--k-accent-hover)); color: var(--k-text-inverse); }
.k-button--glow     { background: var(--k-accent); color: var(--k-text-inverse); box-shadow: 0 0 16px var(--k-accent-subtle), 0 0 4px var(--k-accent); }

/* states */
.k-button--loading  { opacity: 0.75; cursor: wait;         pointer-events: none; }
.k-button--disabled { opacity: 0.4;  cursor: not-allowed;  pointer-events: none; }
.k-button--full     { width: 100%; }

/* inline loader */
.k-button__loader {
  width: 1em; height: 1em;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: k-spin 0.7s linear infinite;
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .k-button__loader { animation: none; }
}
```

---

## 6. Theme System Implementation

### 6.1 CSS Token File Structure

```
src/styles/tokens/
  shared.css    ← Typography, spacing, radius, z-index, transitions (never change)
  light.css     ← :root (default) + [data-theme="light"] identical block
  dark.css      ← [data-theme="dark"] block only
  dracula.css   ← [data-theme="dracula"] block only
```

`base.css` imports them in order:

```css
/* src/styles/base.css */
@import './reset.css';
@import './tokens/shared.css';
@import './tokens/light.css';
@import './tokens/dark.css';
@import './tokens/dracula.css';
@import './components/button.css';
@import './components/input.css';
@import './components/badge.css';
@import './components/card.css';
@import './components/modal.css';
@import './components/select.css';
@import './components/checkbox.css';
@import './components/toast.css';
@import './components/tooltip.css';
@import './components/avatar.css';
@import './components/loader.css';
@import './animations.css';
```

### 6.2 `themeCore.ts` — Shared Theme Logic

```typescript
// src/themes/themeCore.ts

export const THEMES    = ['light', 'dark', 'dracula'] as const;
export type  Theme     = typeof THEMES[number];
export const STORAGE_KEY = 'kenikool-theme';

export function getInitialTheme(): Theme {
  // 1. Check localStorage
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored && THEMES.includes(stored)) return stored;

  // 2. Check OS preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) return 'dark';

  // 3. Default
  return 'light';
}

export function applyTheme(theme: Theme): void {
  // Validate against whitelist — never trust raw input
  if (!THEMES.includes(theme)) {
    console.warn(`[kenikool-ui] Unknown theme "${theme}". Defaulting to "light".`);
    theme = 'light';
  }
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

export function getCurrentTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme') as Theme;
  return THEMES.includes(attr) ? attr : 'light';
}
```

---

## 7. Build System Design

### 7.1 `tsup.config.ts`

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

// Post-build: copy all CSS files from src/styles/ to dist/styles/
function copyStyles() {
  return {
    name: 'copy-styles',
    buildEnd() {
      mkdirSync('dist/styles/themes', { recursive: true });
      const files = readdirSync('src/styles', { withFileTypes: true });
      for (const f of files) {
        if (f.name.endsWith('.css')) {
          copyFileSync(`src/styles/${f.name}`, `dist/styles/${f.name}`);
        }
      }
      ['light','dark','dracula'].forEach(t =>
        copyFileSync(`src/styles/tokens/${t}.css`, `dist/styles/themes/${t}.css`)
      );
    },
  };
}

export default defineConfig([
  // === Vanilla JS ===
  {
    entry:    { index: 'src/vanilla/index.ts' },
    outDir:   'dist/vanilla',
    format:   ['esm', 'cjs'],
    dts:      true,
    clean:    true,
    sourcemap: true,
    target:   'es2020',
    external: [],
    plugins:  [copyStyles()],
  },
  // === React ===
  {
    entry:    { index: 'src/react/index.ts' },
    outDir:   'dist/react',
    format:   ['esm', 'cjs'],
    dts:      true,
    clean:    false,
    sourcemap: true,
    target:   'es2020',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    esbuildOptions(o) { o.jsx = 'automatic'; },
  },
  // === Themes ===
  {
    entry:    { index: 'src/themes/index.ts' },
    outDir:   'dist/themes',
    format:   ['esm', 'cjs'],
    dts:      true,
    clean:    false,
    sourcemap: true,
    target:   'es2020',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    esbuildOptions(o) { o.jsx = 'automatic'; },
  },
]);
```

### 7.2 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target":           "ES2020",
    "module":           "ESNext",
    "moduleResolution": "bundler",
    "jsx":              "react-jsx",
    "strict":           true,
    "declaration":      true,
    "declarationMap":   true,
    "sourceMap":        true,
    "esModuleInterop":  true,
    "skipLibCheck":     true,
    "lib":              ["ES2020", "DOM", "DOM.Iterable"],
    "outDir":           "./dist",
    "rootDir":          "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "stories", "tests"]
}
```

### 7.3 `package.json` — Complete Structure

```json
{
  "name": "kenikool-ui",
  "version": "0.1.0",
  "description": "Zero-config, theme-aware UI components for Vanilla JS and React",
  "license": "MIT",
  "main":   "./dist/react/index.cjs",
  "module": "./dist/react/index.mjs",
  "types":  "./dist/react/index.d.ts",
  "exports": {
    "./react": {
      "import":  "./dist/react/index.mjs",
      "require": "./dist/react/index.cjs",
      "types":   "./dist/react/index.d.ts"
    },
    "./vanilla": {
      "import":  "./dist/vanilla/index.mjs",
      "require": "./dist/vanilla/index.cjs",
      "types":   "./dist/vanilla/index.d.ts"
    },
    "./themes": {
      "import":  "./dist/themes/index.mjs",
      "require": "./dist/themes/index.cjs",
      "types":   "./dist/themes/index.d.ts"
    },
    "./styles":          "./dist/styles/base.css",
    "./styles/light":    "./dist/styles/themes/light.css",
    "./styles/dark":     "./dist/styles/themes/dark.css",
    "./styles/dracula":  "./dist/styles/themes/dracula.css"
  },
  "files": ["dist", "README.md"],
  "sideEffects": ["**/*.css", "dist/vanilla/index.mjs", "dist/vanilla/index.cjs"],
  "scripts": {
    "build":      "tsup",
    "dev":        "tsup --watch",
    "storybook":  "storybook dev -p 6006",
    "build-sb":   "storybook build",
    "test":       "vitest run",
    "test:watch": "vitest",
    "lint":       "eslint src --ext .ts,.tsx",
    "typecheck":  "tsc --noEmit"
  },
  "peerDependencies": {
    "react":     ">=19.0.0",
    "react-dom": ">=19.0.0"
  },
  "peerDependenciesMeta": {
    "react":     { "optional": true },
    "react-dom": { "optional": true }
  },
  "dependencies": {
    "dompurify": "^3.2.6"
  },
  "devDependencies": {
    "@changesets/cli":                "^2.29.0",
    "@storybook/addon-essentials":    "^9.0.0",
    "@storybook/addon-themes":        "^9.0.0",
    "@storybook/react-vite":          "^9.0.0",
    "@testing-library/react":         "^16.0.0",
    "@testing-library/user-event":    "^14.5.0",
    "@types/dompurify":               "^3.0.5",
    "@types/react":                   "^19.0.0",
    "@types/react-dom":               "^19.0.0",
    "fast-check":                     "^4.7.0",
    "jsdom":                          "^26.0.0",
    "react":                          "^19.1.1",
    "react-dom":                      "^19.1.1",
    "storybook":                      "^9.0.0",
    "tsup":                           "^8.5.0",
    "typescript":                     "^6.0.0",
    "vite":                           "^8.0.0",
    "vitest":                         "^4.1.0"
  }
}
```

---

## 8. Testing Strategy

### 8.1 Test Types

| Type | Tool | Scope |
|---|---|---|
| Unit tests | Vitest + jsdom | `parseV`, `sanitize*`, theme core logic |
| Component tests (React) | Vitest + Testing Library | All React components |
| Component tests (Vanilla) | Vitest + jsdom custom elements | All Web Components |
| Property-based tests | fast-check + Vitest | All correctness properties P1–P8 |
| Visual regression | Storybook Chromatic (optional) | All stories × 3 themes |

### 8.2 Property-Based Test Examples

```typescript
// tests/core/parseV.property.test.ts
import { describe, it } from 'vitest';
import fc from 'fast-check';
import { parseV } from '../../src/core/parseV';

describe('P1 — parseV idempotency', () => {
  it('parsing same string twice gives identical result', () => {
    fc.assert(fc.property(
      fc.string(),
      (v) => {
        const r1 = parseV(v);
        const r2 = parseV(v);
        expect(r1).toEqual(r2);
      }
    ));
  });
});

describe('P4 — sanitizeUrl protocol blocking', () => {
  it('blocks any non-safe protocol', () => {
    fc.assert(fc.property(
      fc.oneof(
        fc.constant('javascript:alert(1)'),
        fc.constant('data:text/html,<h1>xss</h1>'),
        fc.constant('vbscript:msgbox(1)'),
      ),
      (url) => {
        expect(sanitizeUrl(url)).toBe('#');
      }
    ));
  });
});
```

---

## 9. Storybook Configuration

```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import '../src/styles/base.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      name:        'Theme',
      description: 'Kenikool UI theme',
      defaultValue: 'light',
      toolbar: {
        icon:  'paintbrush',
        items: [
          { value: 'light',   title: '☀️ Light'   },
          { value: 'dark',    title: '🌙 Dark'    },
          { value: 'dracula', title: '🧛 Dracula' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      document.documentElement.setAttribute('data-theme', context.globals.theme);
      return <Story />;
    },
  ],
};

export default preview;
```

---

## 10. Algorithms — Tooltip Collision Detection

The Tooltip must flip placement when it overflows the viewport. This is computed on every open:

```typescript
function computePlacement(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  preferred:   string,   // e.g. 'top', 'bottom-start'
  viewport:    { w: number; h: number }
): string {

  const [side, align = 'center'] = preferred.split('-');
  const gap = 8; // px between trigger and tooltip

  const space = {
    top:    triggerRect.top    - tooltipRect.height - gap,
    bottom: viewport.h - triggerRect.bottom - tooltipRect.height - gap,
    left:   triggerRect.left   - tooltipRect.width  - gap,
    right:  viewport.w - triggerRect.right - tooltipRect.width  - gap,
  };

  const FLIP_MAP: Record<string, string> = {
    top: 'bottom', bottom: 'top', left: 'right', right: 'left'
  };

  // If preferred side has no room, flip to opposite
  const resolvedSide = space[side as keyof typeof space] < 0
    ? FLIP_MAP[side]
    : side;

  return align === 'center' ? resolvedSide : `${resolvedSide}-${align}`;
}
```
