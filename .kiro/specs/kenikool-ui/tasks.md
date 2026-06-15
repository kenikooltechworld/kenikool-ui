# Kenikool UI — Implementation Tasks

> Reference: #[[file:requirements.md]] | #[[file:design.md]]

---

## Task Dependency Graph

```
T1 (Project Scaffold)
  └─→ T2 (CSS Token System)
        └─→ T3 (Core Utilities)
              ├─→ T4 (Vanilla Base Class)
              │     ├─→ T5  (Button — Vanilla)
              │     ├─→ T6  (Input — Vanilla)
              │     ├─→ T7  (Badge — Vanilla)
              │     ├─→ T8  (Card — Vanilla)
              │     ├─→ T9  (Modal — Vanilla)
              │     ├─→ T10 (Select — Vanilla)
              │     ├─→ T11 (Checkbox — Vanilla)
              │     ├─→ T12 (Toast — Vanilla)
              │     ├─→ T13 (Tooltip — Vanilla)
              │     ├─→ T14 (Avatar — Vanilla)
              │     └─→ T15 (Loader — Vanilla)
              └─→ T16 (React Button)
                    ├─→ T17 (React Input)
                    ├─→ T18 (React Badge)
                    ├─→ T19 (React Card)
                    ├─→ T20 (React Modal)
                    ├─→ T21 (React Select)
                    ├─→ T22 (React Checkbox)
                    ├─→ T23 (React Toast + useToast)
                    ├─→ T24 (React Tooltip)
                    ├─→ T25 (React Avatar)
                    └─→ T26 (React Loader)

T3 + T2 → T27 (ThemeSwitcher — Vanilla + React + useTheme)

T5–T15, T16–T26, T27 → T28 (Storybook Stories)
T5–T15, T16–T26       → T29 (Unit + Property Tests)
T28, T29              → T30 (Build & Package Verification)
T30                   → T31 (README + Docs)
```

---

## Phase 1 — Project Foundation

### T1 — Project Scaffold & Tooling Setup
**Depends on:** nothing  
**Estimated effort:** Medium

- [ ] Initialize `package.json` with name `kenikool-ui`, all fields from design doc Section 7.3
- [ ] Install all dev dependencies with **current June 2026 versions**:
  - `tsup@^8.5.0` — library bundler
  - `typescript@^6.0.0` — TypeScript 6 (last JS-based compiler)
  - `vite@^8.0.0` — Vite 8 with Rolldown bundler
  - `vitest@^4.1.0` — Vitest 4.1 (test tags, native Node execution)
  - `react@^19.1.1` + `react-dom@^19.1.1` — React 19 stable
  - `@types/react@^19.0.0` + `@types/react-dom@^19.0.0`
  - `storybook@^9.0.0` + `@storybook/react-vite@^9.0.0` + `@storybook/addon-themes@^9.0.0` + `@storybook/addon-essentials@^9.0.0`
  - `@changesets/cli@^2.29.0`
  - `fast-check@^4.7.0` — property-based testing
  - `dompurify@^3.2.6` + `@types/dompurify@^3.0.5` — **pin to 3.2.6**, monitor CVE-2026-41238
  - `jsdom@^26.0.0` — test environment
  - `@testing-library/react@^16.0.0` + `@testing-library/user-event@^14.5.0`
- [ ] Create `tsconfig.json` with `strict: true`, `target: ES2020`, `moduleResolution: bundler`, `jsx: react-jsx`
- [ ] Create `tsup.config.ts` with three entry points (vanilla, react, themes) + CSS copy plugin
- [ ] Create `vitest.config.ts` with jsdom environment, coverage enabled
- [ ] Create `.storybook/main.ts` and `.storybook/preview.ts` with theme toolbar configuration
- [ ] Create `vite.config.ts` for Storybook dev server
- [ ] Create `.changeset/config.json`
- [ ] Create `.eslintrc.json` with `no-eval`, `no-new-func` rules enforced
- [ ] Create `src/` directory tree matching design doc Section 2
- [ ] Verify `pnpm build` runs without errors on empty entry files
- [ ] Verify `pnpm storybook` launches on port 6006

---

### T2 — CSS Token System & Theme Files
**Depends on:** T1  
**Estimated effort:** Medium

- [ ] Create `src/styles/reset.css` — minimal CSS reset (box-sizing, margin/padding zero on *, system font fallback)
- [ ] Create `src/styles/tokens/shared.css` with all theme-agnostic tokens:
  - Typography: `--k-font-sans`, `--k-font-mono`, all `--k-text-*` size/weight/leading tokens
  - Spacing: `--k-space-1` through `--k-space-16`
  - Radius: `--k-radius-none` through `--k-radius-full`
  - Transitions: `--k-transition-fast`, `--k-transition-base`, `--k-transition-slow`, `--k-transition-spring`
  - Z-index: `--k-z-base` through `--k-z-tooltip`
- [ ] Create `src/styles/tokens/light.css` — `:root` + `[data-theme="light"]` with all 27 semantic color tokens
- [ ] Create `src/styles/tokens/dark.css` — `[data-theme="dark"]` with all 27 semantic color tokens
- [ ] Create `src/styles/tokens/dracula.css` — `[data-theme="dracula"]` with official Dracula palette values
- [ ] Create `src/styles/animations.css` with all 10 `@keyframes`: `k-spin`, `k-pulse`, `k-bounce`, `k-bars`, `k-ring`, `k-ripple`, `k-wave`, `k-shimmer`, `k-progress-indeterminate`, `k-fade-in`
- [ ] Create `src/styles/base.css` importing all token files and animation file (component CSS files imported later as each component is built)
- [ ] Verify: set `data-theme="dracula"` on `<html>` and confirm `--k-accent` resolves to `#bd93f9` in browser dev tools

---

### T3 — Core Shared Utilities
**Depends on:** T1  
**Estimated effort:** Medium

- [ ] Implement `src/core/parseV.ts`:
  - `VTokens` interface with all fields
  - `SIZES`, `COLORS`, `RADII`, `STATES` constant Sets
  - `RADIUS_MAP` lookup object
  - `parseV(v: string): VTokens` — pure function, handles empty/null input, defaults all fields
- [ ] Implement `src/core/utils/sanitize.ts`:
  - `sanitizeText(input: unknown): string` — DOM text node approach
  - `sanitizeHtml(dirty: string): string` — native Sanitizer API + DOMPurify fallback
  - `sanitizeUrl(url: string): string` — protocol whitelist + console.warn on block
- [ ] Implement `src/core/utils/focusTrap.ts`:
  - `FOCUSABLE` selector constant
  - `FocusTrap` interface with `activate` / `deactivate`
  - `createFocusTrap(container, returnTo?)` — keydown handler + focus management
- [ ] Implement `src/core/utils/generateId.ts`:
  - `generateId(prefix?)` — crypto.randomUUID() with sequential counter fallback
- [ ] Implement `src/core/types.ts` — all shared TypeScript types: `Theme`, `Size`, `Color`, `Radius`, `VTokens`
- [ ] Implement `src/core/constants.ts` — `THEMES`, `SIZES`, `COLORS`, `VARIANTS` arrays
- [ ] Write unit tests for `parseV`:
  - Parses all size tokens correctly
  - Parses all color tokens correctly
  - Parses state flags (loading, disabled, full)
  - Parses CSS selector targets (`.app`, `#hero`)
  - Handles unknown tokens as variant name
  - Returns correct defaults for empty string input
  - Token order does not affect output
- [ ] Write unit tests for `sanitize*`:
  - `sanitizeText` with `<script>alert(1)</script>` returns escaped text
  - `sanitizeHtml` strips `<script>` tags
  - `sanitizeHtml` strips `onerror` attributes
  - `sanitizeUrl` blocks `javascript:` protocol → returns `#`
  - `sanitizeUrl` blocks `data:` protocol → returns `#`
  - `sanitizeUrl` allows `https://` and `mailto:` URLs
- [ ] Write property-based tests (fast-check) for P1, P3, P4 from requirements

---

## Phase 2 — Vanilla JS Components

### T4 — KBaseElement Abstract Class
**Depends on:** T2, T3  
**Estimated effort:** Small

- [ ] Implement `src/vanilla/KBaseElement.ts`:
  - Extend `HTMLElement`
  - `static get observedAttributes() { return ['v']; }`
  - `connectedCallback` → calls `_applyV`, `_render`, `_applyAccessibility`, `_handleTarget`, `_attachEventListeners`
  - `disconnectedCallback` → calls `_detachEventListeners`
  - `attributeChangedCallback` → re-calls `_applyV` + `_render` (for class/state sync) + `_applyAccessibility` on change
  - `_applyV()` — parses `v` attribute via `parseV()`, writes results as `data-variant`, `data-size`, `data-color`, `data-loading`, `data-disabled`, `data-full`, `data-radius` (removes `data-radius` if null) on `this`
  - `_handleTarget()` — moves element into target selector container; `console.warn` on miss, no MutationObserver retry
  - `_dispatch(eventName, detail?)` — helper that fires `k:${eventName}` with `bubbles: true, composed: true`
  - Abstract methods: `_render()`, `_applyAccessibility()`
  - Optional overrides: `_attachEventListeners()`, `_detachEventListeners()`
  - **Contract:** `_applyV()` is the ONLY place that writes `data-*` attributes. Subclasses MUST NOT write `data-*` directly. Subclasses MUST NOT set classes on inner elements for styling purposes.

---

### T5 — Button (Vanilla)
**Depends on:** T4  
**Estimated effort:** Small

- [ ] Implement `src/vanilla/Button/KButtonElement.ts`:
  - Inner `<button type="button">` created with **zero CSS classes** — all styling driven by host `data-*` attributes
  - `_render()` creates the inner button once, moves text content in via `sanitizeText()`
  - `_applyAccessibility()` syncs `aria-disabled`, `aria-busy`, `tabindex`, `aria-label` on the inner button
  - `_buildClassName()` MUST NOT exist — this is the vanilla component, not React
  - Loading state appends a `.k-button__loader` span (spinner SVG) to the inner button
  - Custom click event `k:click` dispatched with `{ bubbles: true, composed: true }`; blocked when `loading` or `disabled`
- [ ] Create `src/styles/components/button.css` — ALL selectors use `data-*` attributes on the host:
  - `k-button button { }` — base inner button structural styles (no visual styling here)
  - `k-button[data-size="lg"] button { }` — one rule per size (xs/sm/md/lg/xl)
  - `k-button[data-variant="filled"] button { }` — one block per variant (all 10)
  - `k-button[data-variant="filled"] button:hover { }` — hover states
  - `k-button[data-loading="true"] button { }` and `k-button[data-disabled="true"] button { }` — state rules
  - Color × variant combinations per design.md Section 4.3 color rules:
    - `filled`/`gradient`/`glow`/`soft`/`subtle` + color → background override + text-inverse
    - `outlined` + color → border-color + text color override
    - `ghost`/`minimal` + color → text color only
    - `elevated`/`destructive` → color token ignored
  - `k-button[data-radius="full"] button { }` — radius overrides
  - `.k-button__loader svg { animation: k-spin ... }` — loader spinner
  - `@media (prefers-reduced-motion)` wrapper for loader animation
- [ ] Register: `customElements.define('k-button', KButtonElement)` at end of file
- [ ] Write tests:
  - Renders inner `<button>` with no className attribute
  - `data-variant`, `data-size`, `data-color` set correctly from `v`
  - Loading state: `.k-button__loader` present, `aria-busy="true"`, click blocked
  - Disabled state: `aria-disabled="true"`, `tabindex="-1"`, `disabled` property true, click blocked
  - `v` attribute change updates `data-*` and ARIA in the same tick
  - `k:click` fires on click, does not fire when loading or disabled

---

### T6 — Input (Vanilla)
**Depends on:** T4  
**Estimated effort:** Large

- [ ] Implement `src/vanilla/Input/KInputElement.ts`:
  - Wraps `<input>` or `<textarea>` based on variant
  - Generates unique ID for `<label>` linkage via `generateId()`
  - Builds label, hint, error spans with `aria-describedby`
  - `type` attribute forwarded to inner input
  - OTP variant: renders N single-char inputs, auto-advance on keypress, handles paste
  - Password variant: show/hide toggle button with ARIA label swap
  - Textarea variant: optional `autoResize` behavior via `input` event listener
  - Floating-label variant: CSS-only using `placeholder=" "` trick + label transform
  - Dispatches `k:input` and `k:change` custom events
- [ ] Create `src/styles/components/input.css` — all 10 variants, error state, focus ring, floating-label animation, addon slots
- [ ] Register: `customElements.define('k-input', KInputElement)`
- [ ] Write tests: label linked to input by id, error state sets aria-invalid, password toggle changes type, otp paste splits across fields

---

### T7 — Badge (Vanilla)
**Depends on:** T4  
**Estimated effort:** Small

- [ ] Implement `src/vanilla/Badge/KBadgeElement.ts` — 10 variants, count overflow ("99+"), dismissible with `k:dismiss` event, dot variant (text ignored), status dot + label
- [ ] Create `src/styles/components/badge.css`
- [ ] Register: `customElements.define('k-badge', KBadgeElement)`

---

### T8 — Card (Vanilla)
**Depends on:** T4  
**Estimated effort:** Small

- [ ] Implement `src/vanilla/Card/KCardElement.ts` — 10 variants, named slot support (header/body/footer/image) via `<slot name="...">` or attribute-based slot assignment
- [ ] Create `src/styles/components/card.css` — glass backdrop-filter, gradient, horizontal layout, interactive hover
- [ ] Register: `customElements.define('k-card', KCardElement)`

---

### T9 — Modal (Vanilla)
**Depends on:** T4  
**Estimated effort:** Large

- [ ] Implement `src/vanilla/Modal/KModalElement.ts`:
  - Uses native `<dialog>` element with `dialog.showModal()` / `dialog.close()`
  - Exposes `.open()` and `.close()` instance methods
  - 10 variants (bottom-sheet slides up, drawers slide in, fullscreen covers viewport)
  - Focus trap via `createFocusTrap()` — activated on open, deactivated on close
  - `Escape` key closes via `cancel` event on `<dialog>` (native behavior)
  - Backdrop click detection via `mousedown` on `<dialog>` + position check
  - ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`
  - Focus returns to trigger element (stored in `_triggerElement` on `.open()` call)
  - `k:open` and `k:close` custom events dispatched
- [ ] Create `src/styles/components/modal.css` — all 10 variants with CSS animations (slide-up, slide-in-left/right, scale-up)
- [ ] Register: `customElements.define('k-modal', KModalElement)`
- [ ] Write tests: focus trap cycles correctly, Escape closes, focus returns on close, aria attributes set correctly

---

### T10 — Select (Vanilla)
**Depends on:** T4  
**Estimated effort:** Large

- [ ] Implement `src/vanilla/Select/KSelectElement.ts`:
  - Custom dropdown (not native `<select>`)
  - `options` attribute accepts JSON string array or `[{value, label, group?}]`
  - Searchable: inline filter input within dropdown
  - Multi: pill badges for selected values, backspace removes last
  - Grouped: renders section headers for options with matching `group` key
  - Full keyboard navigation (Arrow, Enter, Escape, Home, End)
  - ARIA: combobox pattern (trigger: role=combobox, aria-expanded, aria-owns; list: role=listbox; items: role=option, aria-selected)
  - Dispatches `k:change` with selected value(s)
- [ ] Create `src/styles/components/select.css`
- [ ] Register: `customElements.define('k-select', KSelectElement)`

---

### T11 — Checkbox (Vanilla)
**Depends on:** T4  
**Estimated effort:** Medium

- [ ] Implement `src/vanilla/Checkbox/KCheckboxElement.ts`:
  - Native `<input type="checkbox">` always present (form compatible)
  - Switch variants: sliding pill via CSS, backed by hidden checkbox
  - Radio variants: `<input type="radio">` with `name` attribute support
  - Indeterminate: sets `input.indeterminate = true` property (DOM-only, not attribute)
  - Animated checkmark: SVG stroke animation on check
  - `aria-checked` = "true" | "false" | "mixed"
  - `k:change` event dispatched with `{ checked, value }`
- [ ] Create `src/styles/components/checkbox.css`
- [ ] Register: `customElements.define('k-checkbox', KCheckboxElement)`

---

### T12 — Toast (Vanilla)
**Depends on:** T4  
**Estimated effort:** Medium

- [ ] Implement `src/vanilla/Toast/KToastElement.ts` — single toast element with 10 variants, auto-dismiss timer, progress bar variant
- [ ] Implement `src/vanilla/Toast/KToastManager.ts`:
  - Static class with `show(options)` method
  - Manages a queue of toasts rendered into a `<div class="k-toast-container">` appended to `document.body`
  - Position configurable: bottom-right (default), bottom-left, top-right, top-left, bottom-center
  - Stacks toasts with gap between them
  - Hover pauses auto-dismiss timer (`clearTimeout` on `mouseenter`, restarts on `mouseleave`)
- [ ] Create `src/styles/components/toast.css` — slide-in/out animations per position, stacking, progress bar shrink animation
- [ ] Register: `customElements.define('k-toast', KToastElement)`

---

### T13 — Tooltip (Vanilla)
**Depends on:** T4  
**Estimated effort:** Medium

- [ ] Implement `src/vanilla/Tooltip/KTooltipElement.ts`:
  - Wraps trigger element (its children/slot)
  - Creates floating tooltip div in `document.body` (not inside shadow DOM)
  - Positions using `getBoundingClientRect()` + `window.innerWidth/Height`
  - Collision detection algorithm from design doc Section 10
  - 12 placement options
  - `hover` + `focus` default triggers, `click` option
  - Show delay (default 300ms), instant hide
  - `interactive` variant: tooltip stays open when cursor enters it
  - ARIA: trigger gets `aria-describedby`, tooltip has `role="tooltip"`
- [ ] Create `src/styles/components/tooltip.css` — 12 arrow positions, variants
- [ ] Register: `customElements.define('k-tooltip', KTooltipElement)`

---

### T14 — Avatar (Vanilla)
**Depends on:** T4  
**Estimated effort:** Small

- [ ] Implement `src/vanilla/Avatar/KAvatarElement.ts`:
  - `<img>` with `sanitizeUrl()` on `src`
  - `onerror` fallback: extracts initials from `name` attribute (first letter of each word, max 2)
  - Deterministic initials bg color: `hashCode(name) % AVATAR_COLORS.length`
  - Status dot positioned absolute bottom-right
  - `AvatarGroup` stacking via negative margin on siblings
- [ ] Create `src/styles/components/avatar.css`
- [ ] Register: `customElements.define('k-avatar', KAvatarElement)` and `customElements.define('k-avatar-group', KAvatarGroupElement)`

---

### T15 — Loader (Vanilla)
**Depends on:** T4  
**Estimated effort:** Small

- [ ] Implement `src/vanilla/Loader/KLoaderElement.ts`:
  - `type` parsed from `v` attribute (alongside size/color)
  - Each type renders a specific DOM structure that the CSS animates
  - `skeleton`: width/height from `data-width`/`data-height` attributes
  - `progress`: `data-value` attribute (0-100) updates `width` of inner fill bar; `data-indeterminate` triggers infinite animation
- [ ] Create `src/styles/components/loader.css` — all 10 loader types, prefers-reduced-motion suppression
- [ ] Register: `customElements.define('k-loader', KLoaderElement)`

---

### T16 — Vanilla Index & Auto-Registration
**Depends on:** T5–T15  
**Estimated effort:** Tiny

- [ ] Create `src/vanilla/index.ts` — imports all element files (side effects), exports types

---

## Phase 3 — React Components

### T17 — React Button
**Depends on:** T3  
**Estimated effort:** Small

- [ ] Create `src/react/Button/Button.types.ts` — `ButtonProps` interface (all props fully typed with JSDoc)
- [ ] Create `src/react/Button/Button.tsx` — `forwardRef` component, all 10 variants via BEM classes, loading spinner span, ARIA sync, click guard
- [ ] Create `src/react/Button/Button.css` — mirrors vanilla CSS with `.k-button--*` BEM classes
- [ ] Export from `src/react/index.ts`
- [ ] Write component tests: renders correctly, loading prop adds aria-busy, disabled blocks onClick, ref forwarding works

---

### T18 — React Input
**Depends on:** T3  
**Estimated effort:** Large

- [ ] Create `src/react/Input/Input.types.ts`
- [ ] Create `src/react/Input/Input.tsx`:
  - Controlled (`value` + `onChange`) and uncontrolled modes
  - Auto-generated ID for label linkage
  - OTP variant: array of refs, auto-advance, paste handler
  - Password: `showPassword` state, toggle button
  - Textarea: optional `useRef` for auto-resize via `onInput`
  - Floating-label: handled by CSS using `placeholder=" "` trick — no JS needed
  - `forwardRef` to inner `<input>` or `<textarea>`
- [ ] Create `src/react/Input/Input.css`

---

### T19 — React Badge
**Depends on:** T3  
**Estimated effort:** Small

- [ ] `Badge.tsx` + `Badge.types.ts` + `Badge.css` — 10 variants, count overflow, dismissible with `onDismiss` callback

---

### T20 — React Card
**Depends on:** T3  
**Estimated effort:** Small

- [ ] `Card.tsx` + `Card.types.ts` + `Card.css` — 10 variants, slots as named children props (`headerSlot`, `footerSlot`, `imageSlot`, `children` for body)

---

### T21 — React Modal
**Depends on:** T3  
**Estimated effort:** Large

- [ ] `Modal.tsx` + `Modal.types.ts` + `Modal.css`:
  - Renders into `document.body` portal using `ReactDOM.createPortal`
  - Uses native `<dialog>` ref with `dialog.showModal()` in `useEffect` when `open` changes
  - `createFocusTrap` called on open, deactivated on close
  - Focus return to trigger ref (`triggerRef` prop or auto-detected via `document.activeElement` before open)
  - `closeOnEsc` and `closeOnOverlay` props
  - 10 variants via CSS classes
  - Proper unmount: dialog content preserved in DOM when `open=false` to allow exit animations (use `data-state="closed"` + CSS)

---

### T22 — React Select
**Depends on:** T3  
**Estimated effort:** Large

- [ ] `Select.tsx` + `Select.types.ts` + `Select.css`:
  - `options: SelectOption[]` prop where `SelectOption = { value: string; label: string; group?: string; icon?: ReactNode; disabled?: boolean }`
  - `value` / `onChange` for controlled mode
  - `multi` mode: array value, pill display
  - `searchable`: internal `filterText` state + filtered options list
  - Full keyboard navigation via `useEffect` + `keydown` handler
  - ARIA combobox pattern as per requirements

---

### T23 — React Checkbox
**Depends on:** T3  
**Estimated effort:** Medium

- [ ] `Checkbox.tsx` + `Checkbox.types.ts` + `Checkbox.css`:
  - Always renders native `<input type="checkbox">` or `<input type="radio">`
  - Custom visual layer via CSS + `pointer-events: none` overlay
  - `indeterminate` prop sets `inputRef.current.indeterminate` in `useEffect`
  - Switch variants: CSS-only sliding animation
  - Animated checkmark: SVG with `stroke-dasharray`/`stroke-dashoffset` animation

---

### T24 — React Toast + `useToast`
**Depends on:** T3  
**Estimated effort:** Medium

- [ ] `src/react/Toast/ToastManager.ts` — singleton queue, subscriber pattern, auto-dismiss logic
- [ ] `src/react/Toast/Toast.tsx` — individual toast rendering
- [ ] `src/react/Toast/ToastContainer.tsx` — portal-rendered container, subscribes to manager
- [ ] `src/react/Toast/useToast.ts` — returns `{ toast }` with `.success()`, `.error()`, `.warning()`, `.info()`, `.custom()` methods
- [ ] Users must render `<ToastContainer />` once in their app (or it auto-renders on first `toast.*` call)
- [ ] `Toast.css` with all 10 variants + position-based animations

---

### T25 — React Tooltip
**Depends on:** T3  
**Estimated effort:** Medium

- [ ] `Tooltip.tsx` + `Tooltip.types.ts` + `Tooltip.css`:
  - Wraps `children` as trigger
  - Renders tooltip via `ReactDOM.createPortal` into `document.body`
  - `useRef` for trigger + tooltip elements
  - Position computed via `getBoundingClientRect()` + collision detection algorithm
  - `useEffect` for show-delay timer cleanup
  - `interactive` variant: mouseenter on tooltip cancels hide timer

---

### T26 — React Avatar
**Depends on:** T3  
**Estimated effort:** Small

- [ ] `Avatar.tsx` + `Avatar.types.ts` + `Avatar.css`:
  - `onError` on `<img>` falls back to initials
  - `src` passed through `sanitizeUrl()`
  - `AvatarGroup` component that wraps multiple avatars and applies negative margin stacking

---

### T27 — React Loader
**Depends on:** T3  
**Estimated effort:** Small

- [ ] `Loader.tsx` + `Loader.types.ts`:
  - `type` prop selects one of 10 animation types
  - `value` prop (0–100) for determinate progress
  - Renders the minimal DOM structure each CSS animation requires
  - `skeleton` accepts `width`, `height`, `borderRadius` props → applied as inline style (safe, not user-provided HTML)

---

### T28 — React Index Barrel
**Depends on:** T17–T27  
**Estimated effort:** Tiny

- [ ] Create `src/react/index.ts` — exports all components and hooks

---

## Phase 4 — ThemeSwitcher

### T29 — ThemeSwitcher (Vanilla + React + useTheme)
**Depends on:** T2, T3  
**Estimated effort:** Medium

- [ ] Implement `src/themes/themeCore.ts` — `getInitialTheme()`, `applyTheme()`, `getCurrentTheme()`, whitelist validation
- [ ] Implement `src/themes/useTheme.ts` — React hook: `{ theme, setTheme }`, subscribes to `storage` event for cross-tab sync
- [ ] Implement `src/themes/ThemeSwitcher.tsx`:
  - Dropdown trigger button with current theme icon
  - Listbox with all 3 themes, icon + name + 3 color swatches + checkmark on active
  - Outside-click: `mousedown` listener on `document`
  - Full keyboard nav: ArrowUp/Down, Enter/Space, Escape
  - All ARIA attributes per requirements
  - Reads `themeCore.getInitialTheme()` on mount, calls `themeCore.applyTheme()` on select
- [ ] Implement `src/themes/ThemeSwitcher.css` — dropdown styles using `--k-*` tokens (switches with theme automatically)
- [ ] Implement Vanilla `src/vanilla/ThemeSwitcher/KThemeSwitcherElement.ts` — same logic, Web Component approach
- [ ] Create `src/themes/index.ts` — exports `ThemeSwitcher`, `useTheme`
- [ ] Write tests: initial theme read from localStorage, OS preference fallback, theme applied to `data-theme`, persisted to localStorage, onChange fires

---

## Phase 5 — Stories, Tests, Build

### T30 — Storybook Stories
**Depends on:** T5–T15, T17–T29  
**Estimated effort:** Large

For each of the 12 components (including Loader + ThemeSwitcher):
- [ ] Create `stories/[Component].stories.tsx`
- [ ] `Default` story — default props
- [ ] `AllVariants` story — 10 variants in a flex grid
- [ ] `AllSizes` story — 5 sizes
- [ ] `AllColors` story — all semantic colors
- [ ] `States` story — loading, disabled, any component-specific states
- [ ] Storybook controls (args) wired for all major props
- [ ] Verify all stories render correctly in all 3 themes (switch via toolbar)

---

### T31 — Property-Based & Unit Tests
**Depends on:** T5–T29  
**Estimated effort:** Large

- [ ] P1: `parseV` idempotency — `fast-check` arbitrary string property
- [ ] P2: Theme token completeness — assert all 27 semantic tokens defined for each theme CSS file
- [ ] P3: `sanitizeText` XSS safety — `fast-check` arbitrary HTML string, verify no raw `<`/`>` in output
- [ ] P4: `sanitizeUrl` protocol blocking — `fast-check` URL with random protocol prefix
- [ ] P5: Component render determinism — mount/unmount button 100 times, assert same data-attributes each time
- [ ] P6: ARIA state sync — set v="filled loading", assert aria-busy="true" in same tick
- [ ] P7: Focus trap completeness — jsdom Modal test with 1, 2, 5, 10 focusable elements
- [ ] P8: Theme persistence — `setTheme` → assert both localStorage and data-theme updated

---

### T32 — Build Verification & Package Validation
**Depends on:** T31  
**Estimated effort:** Small

- [ ] Run `pnpm build` — verify all 3 dist entries produced
- [ ] Verify `dist/vanilla/index.mjs` + `.cjs` + `.d.ts` exist
- [ ] Verify `dist/react/index.mjs` + `.cjs` + `.d.ts` exist
- [ ] Verify `dist/themes/index.mjs` + `.cjs` + `.d.ts` exist
- [ ] Verify `dist/styles/base.css` exists with all `@import` resolved
- [ ] Verify `dist/styles/themes/light.css`, `dark.css`, `dracula.css` exist
- [ ] Test the package locally with `npm pack` → install the `.tgz` in a test app → verify all imports resolve
- [ ] Verify tree-shaking: importing only `Button` from `kenikool-ui/react` does not include `Modal` in bundle (use `rollup-plugin-visualizer` or similar)
- [ ] Verify no `react` / `react-dom` bundled into output (externalized correctly)
- [ ] Run `pnpm typecheck` — zero TypeScript errors

---

### T33 — README & Documentation
**Depends on:** T32  
**Estimated effort:** Medium

- [ ] Write `README.md`:
  - Installation section: `npm install kenikool-ui`
  - Quick start for React (import + render Button and ThemeSwitcher)
  - Quick start for Vanilla JS (script tag + `<k-button>` in HTML)
  - The `v` attribute guide with full token reference table
  - All 10 components listed with their 10 variant names
  - Three themes section with color swatches (as markdown table)
  - Customization: how to override `--k-*` tokens
  - Accessibility statement
  - Browser support table
  - Contributing guide (changeset workflow)

---

## Phase 6 — Release

### T34 — Initial Release
**Depends on:** T33  
**Estimated effort:** Small

- [ ] Run `pnpm changeset` → record as `minor` (first feature release = 0.1.0)
- [ ] Run `pnpm changeset version` → bumps package.json to `0.1.0`, generates CHANGELOG.md
- [ ] Run `pnpm build` → final production build
- [ ] Run `pnpm test` → all tests pass
- [ ] Run `pnpm changeset publish` → publishes `kenikool-ui@0.1.0` to npm
- [ ] Create GitHub release tag `v0.1.0` with CHANGELOG content as release notes
- [ ] Set up GitHub Actions workflow at `.github/workflows/release.yml` for automated future releases
