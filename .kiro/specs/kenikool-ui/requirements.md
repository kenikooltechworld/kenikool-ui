# Kenikool UI — Requirements Specification

> Version: 1.0.0  
> Status: Active  
> Reference: #[[file:../../../RESEARCH.md]]

---

## Introduction

Kenikool UI is a zero-configuration, theme-aware UI component library that ships production-ready components for both **Vanilla JavaScript** (via Web Custom Elements) and **React**. The core philosophy is that users install one package, import what they need, and everything works — fully styled, fully accessible, and theme-aware — without any configuration, token setup, or design decisions required from the user.

The library ships with three built-in themes (Light, Dark, Dracula), ten pre-designed visual variants per component, a ready-to-use theme switcher dropdown component, and a full set of loading animations. Every component is secure by default (XSS-sanitized, ARIA-complete, keyboard navigable).

---

## Glossary

| Term | Definition |
|---|---|
| **`v` attribute** | The single shorthand attribute used on all Vanilla JS Web Components. It accepts a space-separated string of tokens that encode variant, size, color, state flags, and an optional CSS mount-target selector. |
| **Variant** | One of ten pre-designed visual styles per component (e.g. `filled`, `outlined`, `glow`). Variants are curated — users pick, not design. |
| **Theme** | A named set of CSS custom property values that control all visual aspects (colors, shadows, etc.) of every component. Themes are applied via `data-theme` on `<html>`. |
| **Design Token** | A CSS custom property (`--k-*`) that stores a design decision (color, spacing, radius, etc.) and can be referenced across all component styles. |
| **Primitive Token** | A raw-value design token (e.g. `--k-color-purple-500: #bd93f9`). Never used directly in component CSS. |
| **Semantic Token** | An intent-based design token (e.g. `--k-accent`) that maps to a primitive. All component CSS uses only semantic tokens. |
| **Web Custom Element** | A native browser API (`customElements.define`) that lets you register your own HTML tags (e.g. `<k-button>`). These are the Vanilla JS components. |
| **`connectedCallback`** | Web Component lifecycle method — fires when the element is added to the DOM. Used to initialize, render, and wire up accessibility. |
| **`attributeChangedCallback`** | Web Component lifecycle method — fires when a watched attribute changes. Used to re-apply the `v` parser and update the component. |
| **DOMPurify** | A battle-tested XSS sanitization library used to clean any HTML content before it is inserted into the DOM. |
| **ARIA** | Accessible Rich Internet Applications — a W3C standard set of HTML attributes that make dynamic content accessible to assistive technologies like screen readers. |
| **WCAG 2.2 AA** | Web Content Accessibility Guidelines version 2.2, Level AA — the accessibility compliance target for all components. |
| **CSP** | Content Security Policy — a browser security mechanism. The library must work under a strict CSP without requiring `unsafe-inline` or `unsafe-eval`. |
| **ThemeSwitcher** | A ready-made dropdown UI component that displays all three themes, handles selection, persists the choice, and applies it to the page. |
| **Subpath export** | A Node.js `package.json` feature that lets a single package expose multiple entry points (e.g. `kenikool-ui/react`, `kenikool-ui/vanilla`). |
| **tsup** | An esbuild-powered TypeScript library bundler that outputs ESM and CJS formats with type declarations. |
| **ESM** | ECMAScript Modules — the modern JS module format (`import`/`export`). |
| **CJS** | CommonJS — the legacy Node.js module format (`require`/`module.exports`). |

---

## Requirement 1: Package Installation & Import Architecture

**User Story:** As a developer, I want to install one package and import components from clear, predictable subpaths, so that I never have to configure anything or install multiple packages.

### Acceptance Criteria

1. The library MUST be installable with a single command: `npm install kenikool-ui`. No scoped packages, no plugin packages, no separate theme packages are required.

2. The `package.json` `exports` field MUST expose the following subpath entry points, each resolving to both an ESM (`.mjs`) and CJS (`.cjs`) bundle plus a TypeScript declaration file (`.d.ts`):
   - `kenikool-ui/react` — all React components
   - `kenikool-ui/vanilla` — all Vanilla JS Web Components + custom element registration
   - `kenikool-ui/themes` — the ThemeSwitcher React component and `useTheme` hook
   - `kenikool-ui/styles` — the base CSS file containing all design tokens and component styles

3. React and React DOM MUST be declared as `peerDependencies` with version range `>=19.0.0`, and MUST be marked `optional: true` in `peerDependenciesMeta` so that Vanilla JS users do not receive peer dependency warnings during install.

4. The `main` field MUST point to the CJS bundle for maximum backwards compatibility. The `module` field MUST point to the ESM bundle for bundlers that support it. The `types` field MUST point to the TypeScript declaration file.

5. Importing `kenikool-ui/vanilla` MUST automatically register all custom elements (`<k-button>`, `<k-input>`, etc.) as a side-effect. Users MUST NOT call `customElements.define()` themselves.

6. Importing `kenikool-ui/styles` (or adding the equivalent `<link>` tag via CDN) MUST be the only setup step required. After this single import, all components are fully styled and themed with no further configuration.

7. The library MUST be consumable via CDN (unpkg / jsDelivr) for users who do not use a bundler, using `<script type="module">` and `<link rel="stylesheet">` tags only.

---

## Requirement 2: Theming System

**User Story:** As a developer, I want my entire application to switch between three polished themes with zero effort — just set an attribute, everything updates, and the choice persists across reloads.

### Acceptance Criteria

1. All visual styling MUST be driven exclusively by CSS Custom Properties (CSS variables) prefixed with `--k-`. No hardcoded color values, font sizes, or spacing values may appear in component CSS — only `var(--k-*)` references.

2. The library MUST implement a two-layer token model:
   - **Layer 1 (Primitive tokens):** Raw named values (e.g. `--k-color-purple-500: #bd93f9`). These are defined in the CSS but NEVER referenced directly in any component's styles.
   - **Layer 2 (Semantic tokens):** Intent-named variables (e.g. `--k-accent`, `--k-bg-surface`, `--k-error`) that map to primitives. ALL component CSS references only semantic tokens.
   - This separation means changing a theme requires only redefining semantic tokens — zero component code changes.

3. Theme activation MUST work by setting a `data-theme` attribute on the `<html>` element. The three supported values are `"light"`, `"dark"`, and `"dracula"`. Setting this attribute MUST cause every component on the page to instantly update with no JavaScript re-renders or DOM manipulation beyond the attribute change.

4. The Light theme MUST be the default — applied via `:root` so that no `data-theme` attribute is required for the light theme to work.

5. Each theme MUST define the complete set of semantic tokens listed below. No token may be undefined in any theme:
   - **Backgrounds:** `--k-bg-base`, `--k-bg-surface`, `--k-bg-elevated`, `--k-bg-overlay`
   - **Text:** `--k-text-primary`, `--k-text-secondary`, `--k-text-muted`, `--k-text-disabled`, `--k-text-inverse`
   - **Accent:** `--k-accent`, `--k-accent-hover`, `--k-accent-active`, `--k-accent-subtle`
   - **Semantic colors:** `--k-success`, `--k-success-subtle`, `--k-warning`, `--k-warning-subtle`, `--k-error`, `--k-error-subtle`, `--k-info`, `--k-info-subtle`
   - **Borders:** `--k-border`, `--k-border-subtle`, `--k-border-strong`
   - **Interactive:** `--k-focus-ring`
   - **Shadows:** `--k-shadow-sm`, `--k-shadow-md`, `--k-shadow-lg`

6. Spacing, typography, radius, transition, and z-index tokens MUST be theme-agnostic (shared across all themes) and defined once on `:root`. These MUST NOT be redefined per theme.

7. The Dracula theme MUST use the official Dracula color palette as its primitive values:
   - Background: `#282a36`, Current Line/Surface: `#44475a`, Foreground/Text: `#f8f8f2`
   - Comment/Muted: `#6272a4`, Purple/Accent: `#bd93f9`, Pink: `#ff79c6`
   - Green/Success: `#50fa7b`, Red/Error: `#ff5555`, Orange/Warning: `#ffb86c`, Cyan/Info: `#8be9fd`

8. The ThemeSwitcher component MUST read the user's saved theme from `localStorage` under the key `"kenikool-theme"` on initialization. If no saved value exists, it MUST fall back to the OS preference via `window.matchMedia('(prefers-color-scheme: dark)')`. If neither exists, it defaults to `"light"`.

9. The selected theme MUST be persisted to `localStorage` whenever changed, so it survives page reloads without flicker.

10. Theme initialization logic MUST run synchronously before the first paint (via an inline `<script>` in `base.css` or a tiny inline script users can optionally add) to prevent flash of wrong theme (FOUT).

---

## Requirement 3: The `v` Attribute Shorthand System (Vanilla JS)

**User Story:** As a developer using Vanilla JS, I want to configure every aspect of a component using a single `v` attribute with space-separated shorthand tokens, so that I never need verbose attributes or programmatic setup.

### Acceptance Criteria

1. Every Vanilla JS Web Component MUST support a `v` attribute that accepts a space-separated string of tokens. The component MUST parse this string and apply all recognized tokens automatically on `connectedCallback` and whenever the `v` attribute changes via `attributeChangedCallback`.

2. The `v` attribute parser MUST recognize and apply tokens in the following categories. Token order within the string MUST NOT matter:
   - **Variant tokens** (any unrecognized word defaults to variant): `filled`, `outlined`, `ghost`, `subtle`, `soft`, `gradient`, `glow`, `minimal`, `elevated`, `destructive` — plus component-specific variants listed per component.
   - **Size tokens:** `xs`, `sm`, `md`, `lg`, `xl` — maps to the component's size scale.
   - **Color tokens:** `primary`, `success`, `warning`, `error`, `info`, `default` — maps to semantic color intent.
   - **State tokens:** `loading` (sets `aria-busy`, shows loading indicator), `disabled` (sets `aria-disabled`, prevents interaction), `full` (100% width).
   - **Radius tokens:** `r-none`, `r-sm`, `r-md`, `r-lg`, `r-full` — overrides default border radius.
   - **Target selector tokens:** Any token starting with `.` or `#` is treated as a CSS selector. The component MUST move itself into the matching container element after connecting to the DOM.

3. The parser MUST default to `variant="filled"`, `size="md"`, `color="primary"` when those tokens are absent from the `v` string.

4. Parsed tokens MUST be applied as `data-*` attributes on the host element (e.g. `data-variant="filled"`, `data-size="md"`, `data-loading="true"`). All component CSS MUST use these `data-*` attribute selectors (e.g. `k-button[data-variant="filled"]`) — no class manipulation.

5. When the `v` attribute is changed at runtime (e.g. `element.setAttribute('v', 'glow loading')`), the component MUST re-parse and re-apply all tokens within the same animation frame, updating both the visual state and all ARIA attributes.

6. The target selector feature MUST be safe: if the selector matches no element, the component MUST remain in its current position and log a non-throwing console warning. If the selector matches multiple elements, only the first match MUST be used.

7. Unknown tokens (not matching any known variant, size, color, state, or radius) MUST be treated as variant names, allowing future extension without breaking existing usage.

8. **CSS must use only `data-*` attribute selectors on the host element.** Component CSS files MUST select using `k-button[data-variant="filled"] button { }` — never using classes on inner elements. The inner native element (e.g. `<button>`) has no classes. This ensures zero user CSS is needed and the host element's `data-*` attributes are the single source of truth for all styling.

9. **The `color` token modifies per-variant semantics, not a blanket override.** The behavior is:
   - On `filled`, `gradient`, `glow`, `soft`, `subtle` variants → color changes the **background** to the semantic token (`--k-error`, `--k-success`, etc.)
   - On `outlined` → color changes the **border and text** color to the semantic token
   - On `ghost`, `minimal` → color changes **text color only**
   - On `elevated`, `destructive` → color token is intentionally ignored (these variants have fixed semantic meaning)
   - `color="primary"` (the default) defers to `--k-accent` — no override needed
   - `color="default"` produces a neutral grey style using `--k-text-secondary` and `--k-bg-elevated`

10. **Users never write `document.querySelector` or `document.getElementById` for component setup.** The target selector in the `v` attribute (`v="filled .toolbar"`) is the only mechanism for mounting a component into a specific container. No imperative DOM selection is required from user code.

---

## Requirement 4: React Component API

**User Story:** As a React developer, I want a clean, prop-based API that is consistent across all components, so that I learn the pattern once and apply it everywhere.

### Acceptance Criteria

1. All React components MUST accept the following base props consistently:
   - `variant`: one of the ten named variants for that component (string)
   - `size`: `"xs" | "sm" | "md" | "lg" | "xl"` (string, default `"md"`)
   - `color`: `"primary" | "success" | "warning" | "error" | "info" | "default"` (string, default `"primary"`)
   - `radius`: `"none" | "sm" | "md" | "lg" | "full"` (string, optional)
   - `loading`: boolean (default `false`)
   - `disabled`: boolean (default `false`)
   - `className`: string (optional, for user overrides)
   - `style`: React.CSSProperties (optional)

2. All interactive components (Button, Input, Checkbox, Select) MUST forward a `ref` using `React.forwardRef` so users can access the underlying DOM element.

3. All components MUST be written as TypeScript functional components. Props MUST be fully typed with exported TypeScript interfaces so users get complete IntelliSense.

4. All components MUST apply semantic tokens via CSS — not inline styles. The `style` prop MUST only allow user-provided overrides, not be used internally for theming or layout.

5. The React components MUST NOT import or depend on any Vanilla JS custom element registration code. React components are independent implementations that share only the `parseV` logic, type definitions, and sanitization utilities from `src/core/`.

6. All React components MUST be tree-shakable — importing `Button` from `kenikool-ui/react` MUST NOT include the code for `Modal`, `Toast`, or any other component in the final bundle.

---

## Requirement 5: Component Catalogue — 10 Components

**User Story:** As a developer, I want a comprehensive set of ready-to-use, fully functional components that cover the most common UI needs, so I can build real applications without reaching for other libraries.

### Acceptance Criteria

#### 5.1 Button Component

1. The Button MUST render a native `<button>` element internally (not a `<div>` or `<a>`) to inherit browser accessibility behavior for free.

2. The Button MUST support exactly 10 visual variants:
   - `filled`: Solid `--k-accent` background, `--k-text-inverse` text, no border. Hover darkens background to `--k-accent-hover`. Active state uses `--k-accent-active`.
   - `outlined`: Transparent background, `1px solid --k-accent` border, `--k-accent` text. Hover fills background with `--k-accent-subtle`.
   - `ghost`: No background, no border, `--k-text-primary` text. Hover applies `--k-bg-surface` background.
   - `subtle`: `--k-accent-subtle` background, `--k-accent` text, no border. Hover deepens background opacity.
   - `soft`: `rgba(--k-accent, 0.08)` background with `backdrop-filter: blur(4px)` for a frosted glass feel. `--k-accent` text.
   - `gradient`: `linear-gradient(135deg, --k-accent, --k-accent-hover)` background, `--k-text-inverse` text. Hover shifts gradient angle to 160deg.
   - `glow`: Same as `filled` but adds `box-shadow: 0 0 16px --k-accent-subtle, 0 0 4px --k-accent` for a glow effect. Hover intensifies the glow.
   - `minimal`: Text only — `--k-text-primary` color, no background, no border, no padding (only inline padding). Hover adds underline.
   - `elevated`: `--k-bg-elevated` background, `--k-text-primary` text, `--k-shadow-md` shadow. Hover lifts shadow to `--k-shadow-lg`.
   - `destructive`: `--k-error` background, `--k-text-inverse` text. Hover darkens. Used for irreversible actions.

3. The Button MUST support 5 sizes (xs, sm, md, lg, xl) with the following padding and font-size mapping:
   - `xs`: `4px 8px`, `0.75rem`
   - `sm`: `6px 12px`, `0.875rem`
   - `md`: `8px 16px`, `1rem` (default)
   - `lg`: `12px 24px`, `1.125rem`
   - `xl`: `16px 32px`, `1.25rem`

4. When `loading` is active, the Button MUST show an inline spinner (the `spinner` loader variant) replacing or appending to the button content, set `aria-busy="true"`, and prevent click events from firing. The spinner MUST use the button's current text color.

5. When `disabled`, the Button MUST set `disabled` on the native `<button>`, set `aria-disabled="true"`, apply `opacity: 0.4`, `cursor: not-allowed`, and suppress all pointer events. The `loading` state MUST take visual precedence over `disabled`.

6. The Button MUST support `icon` (leading) and `iconRight` (trailing) slots. When only an icon is provided with no text, the Button MUST add `aria-label` from a required `label` prop to maintain accessibility.

7. The `full` prop MUST make the button `width: 100%; display: flex`.

8. The `color` token applied to the Button MUST follow the per-variant behavior defined in Requirement 3.9. Specifically:
   - `color="error"` on `filled` → red background (`--k-error`), inverse text
   - `color="error"` on `outlined` → red border + red text
   - `color="error"` on `ghost` → red text, no background
   - `color="primary"` (default) → uses `--k-accent` (no override needed)
   - `destructive` variant always uses `--k-error` regardless of color token

8. All state transitions (hover, active, focus, loading) MUST be animated using `transition: var(--k-transition-base)`.

#### 5.2 Input Component

1. The Input MUST render a native `<input>` or `<textarea>` element. The wrapping structure is: outer `<div>` (host) → optional `<label>` → inner `<div>` (input wrapper) → `<input>` → optional icon slots → optional hint/error `<span>`.

2. The Input MUST support 10 variants:
   - `default`: `--k-bg-surface` background, `--k-border` border, `--k-text-primary` text. Standard box model.
   - `filled`: `--k-bg-elevated` background, no visible border until focused, slight inset shadow.
   - `outlined`: Transparent background, `2px solid --k-border` border. Focus ring replaces border color with `--k-accent`.
   - `underlined`: No background, no side/top border — only `1px solid --k-border` bottom border. Focus animates border color and adds a 2px accent underline via `::after` pseudo-element.
   - `floating-label`: The `<label>` starts inside the input field. When the input receives focus or has a value, the label animates upward (CSS transform + scale). Uses `placeholder=" "` trick for pure CSS detection.
   - `search`: Prepends a search icon (SVG), rounded `--k-radius-full` border, and adds a clear button on the right when value is non-empty.
   - `password`: Appends a show/hide toggle icon button. The toggle switches `type` between `"password"` and `"text"`. The toggle button MUST have `aria-label="Show password"` / `"Hide password"`.
   - `otp`: Renders N individual single-character inputs side by side. Auto-advances focus on each keystroke. Handles paste — splits pasted string across fields. N is configurable (default 6).
   - `textarea`: Renders `<textarea>` instead of `<input>`. Supports `rows` prop (default 3) and `autoResize` prop that grows the textarea with content using `resize: none` + JS height adjustment.
   - `with-addon`: Supports `addonLeft` and `addonRight` slots for text/icons rendered inside the input border (e.g. currency symbols, URL prefixes, unit labels).

3. The Input MUST support `label`, `placeholder`, `hint` (helper text below), and `error` props. When `error` is set, the border MUST turn `--k-error`, the hint text area MUST show the error message in `--k-error` color, and `aria-invalid="true"` MUST be set on the `<input>`.

4. The `label` MUST be rendered as a `<label>` element with a `for` attribute pointing to the input's `id`. If no `id` prop is provided, a unique ID MUST be auto-generated using `crypto.randomUUID()` or a sequential counter.

5. The `hint` and `error` text elements MUST have unique `id`s. The `<input>` MUST reference them via `aria-describedby` so screen readers announce them.

#### 5.3 Badge Component

1. The Badge MUST support 10 variants:
   - `filled`: Solid `--k-accent` background, `--k-text-inverse` text.
   - `outlined`: Transparent background, `1px solid currentColor` border, `--k-accent` text.
   - `subtle`: `--k-accent-subtle` background, `--k-accent` text, no border.
   - `dot`: A small colored circle (no text). Size: 8px default, 10px for `lg`, 12px for `xl`.
   - `pill`: Same as `filled` but with `border-radius: --k-radius-full`.
   - `count`: Circular shape, optimized for short numbers (1–99+). When value exceeds 99, displays "99+".
   - `tag`: Slightly larger with a small ×-close button on the right. Dismissing fires an `onDismiss` event.
   - `status`: Combines a dot + text label in one badge. Dot color maps to the `color` prop.
   - `dismissible`: Any variant can be made dismissible with a close button. Close fires `onDismiss`.
   - `icon-badge`: Renders an icon (SVG slot) alongside text.

2. The Badge MUST support all standard color values: `primary`, `success`, `warning`, `error`, `info`, `default`. Each MUST use the corresponding semantic token pair (e.g. `--k-success` background + `--k-success-subtle` for subtle variant).

#### 5.4 Card Component

1. The Card MUST be a container component that supports named slots: `header`, `body` (default slot), `footer`, `image` (top media area).

2. The Card MUST support 10 variants:
   - `default`: `--k-bg-surface` background, `1px solid --k-border` border, `--k-radius-lg` radius, `--k-shadow-sm` shadow.
   - `elevated`: `--k-bg-elevated` background, no border, `--k-shadow-md` shadow.
   - `outlined`: Transparent background, `1px solid --k-border` border, no shadow.
   - `filled`: `--k-bg-surface` background, no border, no shadow. Flat.
   - `glass`: `rgba(--k-bg-surface, 0.6)` background, `backdrop-filter: blur(12px)`, `1px solid rgba(--k-border, 0.5)` border.
   - `gradient`: Linear gradient background using `--k-accent` and `--k-bg-elevated`.
   - `interactive`: Same as `default` but with `cursor: pointer`, hover lifts shadow to `--k-shadow-lg` and translate(-1px), `transition: var(--k-transition-base)`.
   - `horizontal`: Flex-row layout — image on the left, content on the right. Image MUST be constrained to a fixed width (default 200px).
   - `compact`: Reduced padding (`--k-space-3` instead of `--k-space-6`), smaller text scale.
   - `feature`: Large card with prominent header area, accent-colored top border (4px), and centered layout. Designed for feature/pricing highlights.

3. The `hoverable` prop MUST add hover lift animation regardless of variant. The `clickable` prop MUST add pointer cursor and a subtle press effect on active.

#### 5.5 Modal Component

1. The Modal MUST render its content into a `<dialog>` element using the native HTML Dialog API (`dialog.showModal()` / `dialog.close()`). The native API provides built-in backdrop and top-layer placement.

2. The Modal MUST support 10 variants:
   - `default`: Centered, white/surface card, `--k-radius-xl`, `--k-shadow-lg`, max-width 560px, scrollable content area.
   - `centered`: Identical to default but with a more prominent centered animation (scale up from 0.95).
   - `bottom-sheet`: Anchored to the bottom of the viewport, slides up on open. Full width, `--k-radius-xl` top corners only, max-height 90vh with scrollable content.
   - `side-drawer-left`: Slides in from the left. Full height, fixed width (default 320px, configurable), `border-radius` only on right side.
   - `side-drawer-right`: Slides in from the right. Mirror of side-drawer-left.
   - `fullscreen`: Covers the entire viewport. No border radius, no padding offset from edges.
   - `compact`: Smaller max-width (360px), tighter padding. For simple confirmations.
   - `form`: Larger max-width (640px), structured header/body/footer layout optimized for multi-field forms.
   - `confirm`: Two-button layout (confirm + cancel), compact size, prominent title, optional destructive confirm button styling.
   - `media`: Minimal chrome — close button only, large content area, dark overlay, designed for image/video display.

3. The Modal MUST implement a **focus trap**: when open, Tab and Shift+Tab MUST cycle only through focusable elements inside the modal. Focus MUST NOT leave the modal while it is open.

4. When the Modal opens, focus MUST be moved to the first focusable element inside it (or the modal container itself if no focusable elements exist). When the Modal closes, focus MUST return to the element that triggered the open.

5. The Modal MUST close on `Escape` key press by default. This behavior MUST be controllable via `closeOnEsc` prop (default `true`).

6. The Modal MUST close when the backdrop/overlay is clicked by default. This MUST be controllable via `closeOnOverlay` prop (default `true`).

7. The Modal MUST set: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the title element's `id`, `aria-describedby` pointing to the description element's `id` (if provided).

8. For React, the Modal MUST be controlled via an `open` (boolean) + `onClose` (callback) prop pattern. For Vanilla JS, it MUST expose `.open()` and `.close()` methods on the element instance, callable as `document.querySelector('k-modal').open()`.

#### 5.6 Select Component

1. The Select MUST be a fully custom-built dropdown — NOT the native `<select>` element. This allows complete visual control across all themes and variants.

2. The Select MUST support 10 variants with the same visual language as Input variants: `default`, `filled`, `outlined`, `underlined`, `searchable`, `multi`, `grouped`, `with-icon`, `compact`, `floating-label`.

3. The `searchable` variant MUST add a text input inside the dropdown that filters the option list in real time (case-insensitive substring match).

4. The `multi` variant MUST allow selecting multiple options. Selected options MUST appear as `pill` badges inside the trigger. Removing a selection MUST be possible by clicking the × on the badge or pressing Backspace when the input is empty.

5. The `grouped` variant MUST accept options with an optional `group` key and render `<optgroup>`-style section headers inside the dropdown.

6. The Select MUST implement full keyboard navigation: `Enter`/`Space` opens the dropdown, `ArrowDown`/`ArrowUp` navigates options, `Enter` selects the focused option, `Escape` closes without selecting, `Home`/`End` jumps to first/last option.

7. ARIA: The trigger MUST have `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls` pointing to the dropdown `id`. The dropdown MUST have `role="listbox"`. Each option MUST have `role="option"` and `aria-selected`.

#### 5.7 Checkbox Component

1. The Checkbox MUST support 10 variants: `default`, `filled`, `outlined`, `switch`, `switch-filled`, `radio`, `radio-card`, `indeterminate`, `icon-check`, `animated`.
   - `switch` and `switch-filled`: Render a toggle switch UI (a sliding pill inside a track). Must still use a hidden `<input type="checkbox">` for native form support and accessibility.
   - `radio` and `radio-card`: Render as a radio button style. `radio-card` wraps a card around each option in a radio group.
   - `indeterminate`: Visually renders a dash (−) instead of a checkmark. Achieved via `input.indeterminate = true` (DOM property, not attribute).
   - `icon-check`: Uses a custom SVG checkmark icon instead of the default browser checkbox.
   - `animated`: The checkmark draws itself with a CSS stroke animation when checked.

2. The Checkbox MUST render a native `<input type="checkbox">` (or `<input type="radio">` for radio variants) as the actual form control. The custom visual is an overlay — the native input handles all browser defaults (form submission, keyboard, screen reader).

3. `aria-checked` MUST be set to `"true"`, `"false"`, or `"mixed"` (for indeterminate) on the native input.

#### 5.8 Toast Component

1. The Toast system MUST manage a queue — multiple toasts stack without overlapping. Default position is `bottom-right`. Position is configurable via the Toast manager.

2. The Toast MUST support 10 variants: `default`, `filled`, `outlined`, `subtle`, `minimal`, `with-action`, `progress`, `icon-only`, `stacked`, `floating`.
   - `progress`: Shows a shrinking progress bar at the bottom of the toast indicating time remaining before auto-dismiss.
   - `with-action`: Renders an action button (text link) inside the toast.
   - `floating`: Adds `--k-shadow-lg` and a slight hover lift for a floating feel.

3. For React, Toast MUST be triggered via a `useToast()` hook that returns `{ toast }`. The toast object MUST expose methods: `toast.success(message, options?)`, `toast.error(message, options?)`, `toast.warning(message, options?)`, `toast.info(message, options?)`, `toast.custom(content, options?)`.

4. For Vanilla JS, Toast MUST be triggerable via `KToast.show({ message, color, variant, duration })` as a static method on the element class (no need to place `<k-toast>` in HTML).

5. Toast MUST auto-dismiss after `duration` ms (default 4000ms). `duration: 0` disables auto-dismiss. On hover, the auto-dismiss timer MUST pause.

6. Urgent toasts (`error`, `warning`) MUST use `role="alert"` with `aria-live="assertive"`. Non-urgent toasts (`success`, `info`) MUST use `role="status"` with `aria-live="polite"`.

7. Toast entrance/exit MUST be animated: slide-in from the anchor side + fade-in on entrance, slide-out + fade-out on exit. Animations MUST respect `prefers-reduced-motion`.

#### 5.9 Tooltip Component

1. The Tooltip MUST NOT use a title attribute — it MUST be a fully custom overlay element positioned with absolute/fixed positioning relative to the trigger.

2. The Tooltip MUST support 10 variants: `default`, `dark`, `light`, `filled`, `outlined`, `arrow`, `no-arrow`, `rich`, `interactive`, `multiline`.
   - `arrow`: Adds a CSS triangle pointer in the direction of the trigger.
   - `rich`: Allows React node / HTML content inside the tooltip (sanitized).
   - `interactive`: The tooltip does not dismiss when the cursor moves into it (useful for tooltips with links or buttons).
   - `multiline`: Wider max-width (320px default), text wrapping, optimized for longer descriptions.

3. The Tooltip MUST support 12 placement options: `top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `left-start`, `left-end`, `right`, `right-start`, `right-end`.

4. The Tooltip MUST implement **collision detection**: if the preferred placement causes the tooltip to overflow the viewport, it MUST automatically flip to the opposite side. Implemented via `getBoundingClientRect()` + viewport dimension comparison.

5. Default trigger is `hover` + `focus`. `click` trigger is also supported for mobile. Delay before show is configurable (default 300ms for hover). Instant hide on mouse leave.

6. ARIA: The trigger element MUST receive `aria-describedby` pointing to the tooltip's `id`. The tooltip MUST have `role="tooltip"`.

#### 5.10 Avatar Component

1. The Avatar MUST support 10 variants: `default`, `with-border`, `with-status`, `with-badge`, `stacked`, `square`, `group`, `initials`, `gradient`, `glow`.
   - `initials`: When no `src` is provided or the image fails to load, renders a colored circle with the user's initials (up to 2 characters from `name` prop). Color is deterministically derived from the name string.
   - `with-status`: Shows a colored dot indicator (online/offline/busy/away) in the bottom-right corner.
   - `stacked`: Used inside an `AvatarGroup` — overlapping avatars with negative margin.
   - `group`: The `AvatarGroup` component wraps multiple `Avatar` components and handles the stacking offset.
   - `glow`: Same as default but with a colored `box-shadow` using the avatar's accent color.
   - `gradient`: Renders a gradient background (using `--k-accent` → `--k-accent-hover`) when no image is available.

2. The Avatar MUST handle broken image URLs gracefully: it MUST attach an `onerror` handler to the `<img>` that falls back to initials rendering or a default placeholder icon.

3. The `src` URL MUST be sanitized with `sanitizeUrl()` before being set as the `src` attribute to prevent `javascript:` XSS vectors.

4. The `alt` prop MUST default to the `name` prop value if not explicitly provided. If neither is available, `alt=""` MUST be set (decorative image convention).

---

## Requirement 6: Loader / Animation Component

**User Story:** As a developer, I want a variety of ready-made loading animations that match my app's theme and integrate into any component, so I never need a separate animation library.

### Acceptance Criteria

1. The Loader component MUST support exactly 10 animation types, all implemented with pure CSS `@keyframes` — no JavaScript animation libraries, no `requestAnimationFrame` loops:
   - `spinner`: A circular arc that rotates 360°. Uses `border-top-color: --k-accent` on a transparent-bordered circle. Keyframe: `@keyframes k-spin { to { transform: rotate(360deg); } }`.
   - `dots`: Three circles that scale up and down with staggered `animation-delay` (0ms, 150ms, 300ms). Keyframe: scale between 0.4 and 1.0 over 1.4s.
   - `pulse`: A single circle that fades and scales outward in a ripple. `opacity: 1 → 0`, `transform: scale(1 → 1.8)`.
   - `bars`: Five vertical bars that animate height with staggered delays, creating an equalizer effect. Each bar animates between 20% and 100% height.
   - `ring`: Two concentric circles — outer ring rotates clockwise, inner counter-clockwise. Uses `border` with partial opacity.
   - `ripple`: Two circles that expand outward from the same center point with `animation-delay: 0s` and `0.5s` offset.
   - `bounce`: A circle that bounces vertically using `cubic-bezier(0.215, 0.61, 0.355, 1)` easing.
   - `wave`: Five dots with sinusoidal vertical movement, creating a wave effect.
   - `skeleton`: A rectangular shimmer effect for content placeholders. Uses `background: linear-gradient(90deg, --k-bg-surface, --k-bg-elevated, --k-bg-surface)` animating `background-position` from `-200%` to `200%`.
   - `progress`: A horizontal bar that fills left-to-right. Supports both `indeterminate` (animates indefinitely with a sliding highlight) and `determinate` (value 0–100 controlled by a `value` prop).

2. All loaders MUST use `--k-accent` as their default color, automatically inheriting the active theme's accent color. The `color` prop MUST override this with any semantic color value.

3. ALL loader animations MUST respect `prefers-reduced-motion`: when this media query is active, all `@keyframes` animations MUST be suspended (either stopped or replaced with a static opacity change).

4. The `skeleton` loader MUST accept `width` and `height` props so it can be sized to match the content it is replacing. It MUST also accept a `borderRadius` prop.

5. The `progress` loader MUST expose a `value` prop (0–100) for determinate mode. Animated transition between values MUST use `transition: width var(--k-transition-slow)`.

---

## Requirement 7: ThemeSwitcher Component

**User Story:** As a developer, I want to drop a single component anywhere in my app and have a working theme switcher dropdown appear — with all three themes listed, previews shown, and the selection persisted — without writing any logic myself.

### Acceptance Criteria

1. Importing `{ ThemeSwitcher } from 'kenikool-ui/themes'` (React) or `<k-theme-switcher>` (Vanilla) MUST be the complete implementation. No configuration, no context providers, no state management required.

2. The ThemeSwitcher dropdown MUST list all three themes with:
   - A descriptive icon (☀️ Light, 🌙 Dark, 🧛 Dracula)
   - The theme name as text
   - A row of three small color swatches (circles, 12px each) showing the theme's background color, accent color, and text color so users can preview each theme before selecting.
   - A checkmark or active indicator on the currently selected theme.

3. The dropdown trigger button MUST have `aria-haspopup="listbox"` and `aria-expanded` (toggled on open/close). The dropdown list MUST have `role="listbox"` and `aria-label="Select theme"`. Each option MUST have `role="option"` and `aria-selected`.

4. The dropdown MUST close when: the user selects a theme, the user presses `Escape`, or the user clicks outside the dropdown. Outside-click detection MUST use a `mousedown` event listener on `document`, not `blur`.

5. On theme selection, the component MUST: (a) set `data-theme` on `document.documentElement`, (b) save the value to `localStorage` under key `"kenikool-theme"`, (c) call the optional `onChange` callback prop if provided.

6. On mount, the component MUST read the saved theme from `localStorage`. If no saved theme exists, it MUST check `window.matchMedia('(prefers-color-scheme: dark)')` and select `"dark"` if true, otherwise `"light"`.

7. The `useTheme()` hook (React only, from `kenikool-ui/themes`) MUST return `{ theme: string, setTheme: (t: Theme) => void }`. Calling `setTheme` MUST perform the same steps as ThemeSwitcher selection (set attribute + persist).

8. The ThemeSwitcher MUST be keyboard-navigable: `ArrowDown`/`ArrowUp` moves between options, `Enter`/`Space` selects, `Escape` closes.

---

## Requirement 8: Security & Sanitization

**User Story:** As a developer using this library, I want every component to be secure by default against XSS attacks and other injection vulnerabilities, so that I do not need to sanitize inputs myself before passing them as props.

### Acceptance Criteria

1. The library MUST ship a `sanitizeText(input: unknown): string` utility in `src/core/utils/sanitize.ts`. This function MUST convert any input to a string and return it as safe plain text by using `document.createTextNode()` + `.textContent` extraction — never `innerHTML`. This MUST be used for all label, text, and content props that render as plain text.

2. The library MUST ship a `sanitizeHtml(dirty: string): string` utility. This function MUST:
   - First attempt to use the native HTML Sanitizer API (`element.setHTML()`) if `'Sanitizer' in window` (Chrome 105+, Firefox 115+).
   - Fall back to DOMPurify (version `^3.2.5` or later — versions before 3.2.4 contain CVE-2025-26791 mXSS) for all other environments.
   - Allow only the following tags: `b`, `i`, `em`, `strong`, `span`, `br`, `p`, `a`.
   - Allow only the following attributes: `href`, `title`, `target`, `rel`.
   - Explicitly forbid: `script`, `style`, `iframe`, `object`, `embed` tags, and all event handler attributes (`on*`).
   - This MUST be used for `rich` tooltip content, card body content when `allowHtml` is enabled, and any other prop explicitly supporting HTML.

3. The library MUST ship a `sanitizeUrl(url: string): string` utility. This function MUST:
   - Parse the URL using `new URL(url, window.location.href)`.
   - Allow only `https:`, `http:`, `mailto:`, `tel:` protocols.
   - Return `"#"` for any URL with a disallowed protocol (e.g. `javascript:`, `data:`, `vbscript:`).
   - Log a `console.warn` (non-throwing) when a URL is blocked.
   - This MUST be used on all `src`, `href`, `action` attribute values set from props.

4. ALL internal DOM writes across all components MUST follow this rule: plain text props use `element.textContent = sanitizeText(value)`, HTML props use `element.innerHTML = sanitizeHtml(value)`, URL props use `sanitizeUrl(value)` before `element.setAttribute('src'/'href', ...)`.

5. No component in the library MUST ever call `eval()`, `new Function(string)`, `setTimeout(string)`, or `setInterval(string)`. This MUST be enforced via an ESLint rule (`no-eval`, `no-new-func`).

6. The library MUST be fully compatible with a strict Content Security Policy (`default-src 'self'; style-src 'self'; script-src 'self'`) — no inline styles are injected at runtime, no `<style>` tags are created dynamically, no `eval` is used.

7. Theme name inputs (in ThemeSwitcher) MUST be validated against a strict whitelist (`['light', 'dark', 'dracula']`) before being set as `data-theme`. Any value not in the whitelist MUST be rejected with a console warning and default to `'light'`.

---

## Requirement 9: Accessibility (WCAG 2.2 AA)

**User Story:** As a developer, I want every component to be accessible out of the box — proper ARIA attributes, keyboard navigation, focus management — so that my application is usable by everyone without extra work on my part.

### Acceptance Criteria

1. Every interactive component MUST use semantic HTML as its base element. Buttons use `<button>`, inputs use `<input>`, checkboxes use `<input type="checkbox">`, dialogs use `<dialog>`. ARIA roles MUST only be added where native semantics are insufficient.

2. Every focusable element MUST have a visible `:focus-visible` ring styled using `outline: 2px solid var(--k-focus-ring); outline-offset: 2px`. Focus rings MUST be visible against all three theme backgrounds (minimum 3:1 contrast with the background).

3. Color contrast MUST meet WCAG 2.2 AA requirements across all three themes:
   - Normal text (below 18pt): minimum 4.5:1 contrast ratio between `--k-text-primary` and `--k-bg-base`.
   - Large text (18pt+ or bold 14pt+): minimum 3:1.
   - Interactive component borders and states: minimum 3:1 against adjacent colors.
   - This MUST be verified at spec-time against the defined hex values.

4. All images and icon-only interactive elements MUST have a text alternative. Icon-only buttons MUST require a `label` or `aria-label` prop — TypeScript MUST enforce this.

5. All animations MUST be wrapped in `@media (prefers-reduced-motion: reduce)` suppression rules. When this media query is active, `animation: none` and `transition: none` MUST be applied to all animated elements.

6. The Modal/Dialog MUST implement a focus trap (per Requirement 5.5, criteria 3 and 4).

7. The Toast MUST use `aria-live="polite"` for `success`/`info` and `aria-live="assertive"` for `error`/`warning`, per WCAG 4.1.3 (Status Messages).

8. Keyboard navigation requirements per component:
   - **Button:** `Enter` and `Space` fire click. `Tab` moves focus in/out.
   - **Input:** Standard browser keyboard behavior preserved. `Escape` clears value in `search` variant.
   - **Modal:** `Escape` closes. `Tab`/`Shift+Tab` trapped within the modal while open.
   - **Select:** `Enter`/`Space` opens, `ArrowUp`/`ArrowDown` navigates, `Enter` selects, `Escape` closes.
   - **Checkbox:** `Space` toggles.
   - **ThemeSwitcher:** `ArrowUp`/`ArrowDown` navigates options, `Enter`/`Space` selects, `Escape` closes.
   - **Tooltip:** `Escape` hides when trigger is `click` mode.

---

## Requirement 10: Build System & Output

**User Story:** As a maintainer, I want the build system to produce correct, tree-shakable, dual ESM/CJS output with type declarations from a single build command, so that publishing and consumption are reliable.

### Acceptance Criteria

1. The build tool MUST be **tsup** `^8.x` (esbuild-powered). The build MUST complete in under 30 seconds for a full clean rebuild.

2. The build MUST produce three separate output directories from three entry points:
   - `dist/vanilla/` — from `src/vanilla/index.ts`
   - `dist/react/` — from `src/react/index.ts`
   - `dist/themes/` — from `src/themes/index.ts`

3. Each output directory MUST contain:
   - `index.mjs` — ESM bundle
   - `index.cjs` — CJS bundle
   - `index.d.ts` — TypeScript declarations
   - `index.d.mts` — ESM TypeScript declarations

4. The React and Themes bundles MUST externalize `react` and `react-dom` (they MUST NOT be bundled into the output — the consuming app provides them).

5. CSS files (design tokens, component styles, animations) MUST be copied to `dist/styles/` as-is (not bundled into JS). Users import CSS separately. The tsup config MUST use a post-build copy step for CSS files.

6. Source maps MUST be generated for all output files to support debugging in consuming applications.

7. TypeScript MUST be configured with `"strict": true`, `"target": "ES2020"`, `"moduleResolution": "bundler"`, and `"jsx": "react-jsx"` (for the new JSX transform, no `import React` required).

8. A `pnpm build` script MUST run the full tsup build. A `pnpm dev` script MUST run tsup in watch mode for development. A `pnpm storybook` script MUST launch Storybook 8.

---

## Requirement 11: Developer Documentation & Storybook

**User Story:** As a consumer of this library, I want to see every component rendered in every variant across all three themes in an interactive playground, so that I can choose the right variant before writing any code.

### Acceptance Criteria

1. Every component MUST have a Storybook story file at `stories/[ComponentName].stories.tsx`.

2. Each story file MUST include:
   - A `Default` story showing the component with its default props.
   - An `AllVariants` story showing all 10 variants side by side in a grid.
   - An `AllSizes` story showing all 5 sizes.
   - An `AllColors` story showing all semantic color values.
   - A `States` story showing loading, disabled, and any component-specific states.
   - Interactive controls (Storybook args) for all major props.

3. The `@storybook/addon-themes` addon MUST be configured to show a theme switcher in the Storybook toolbar. Selecting a theme MUST set `data-theme` on the preview iframe's `<html>` element, so all stories instantly re-render in the selected theme.

4. Stories MUST render correctly in all three themes without any manual adjustments.

---

## Requirement 12: Versioning & Release

**User Story:** As a maintainer, I want a clear, automated release process that generates changelogs, bumps versions correctly, and publishes to npm with minimal manual steps.

### Acceptance Criteria

1. **Changesets** (`@changesets/cli ^2.x`) MUST be used for versioning. Contributors MUST run `pnpm changeset` to record the intent and scope (patch/minor/major) of their change before merging.

2. The `pnpm changeset version` command MUST bump the `package.json` version and update `CHANGELOG.md` automatically based on accumulated changeset files.

3. A GitHub Actions workflow (`.github/workflows/release.yml`) MUST:
   - Run on push to `main`.
   - Install dependencies with `pnpm install --frozen-lockfile`.
   - Run the full build (`pnpm build`).
   - Run the full test suite (`pnpm test`).
   - Use the `changesets/action` GitHub Action to create a "Version Packages" PR when there are pending changesets, or publish to npm when that PR is merged.

4. The npm package MUST be published under the name `kenikool-ui` (unscoped). The `files` field in `package.json` MUST include only `dist/` and `README.md` — source files MUST NOT be published.

---

## Correctness Properties (Property-Based Testing)

The following properties MUST hold true across all valid inputs and MUST be validated with property-based tests:

### P1 — `v` Attribute Parser Idempotency
Parsing the same `v` string twice in a row MUST produce identical `VTokens` output. `parseV(parseV(v).toString()) === parseV(v)`.

### P2 — Theme Token Completeness
For every theme name in `['light', 'dark', 'dracula']`, every semantic token in the canonical token list MUST have a defined value. No token may resolve to `undefined` or inherit from a different theme accidentally.

### P3 — sanitizeText XSS Safety
For any arbitrary string input to `sanitizeText()`, the output MUST never contain `<`, `>`, `&` in their raw form — they MUST be entity-encoded or the text rendered safely via the DOM text node mechanism.

### P4 — sanitizeUrl Protocol Blocking
For any URL string where `new URL(url).protocol` is not in `['https:', 'http:', 'mailto:', 'tel:']`, `sanitizeUrl()` MUST return `"#"` — never the original URL.

### P5 — Component Render Determinism
Given the same props/attributes, a component MUST always produce the same rendered output (same `data-*` attributes, same ARIA attributes) regardless of how many times it is mounted and unmounted.

### P6 — ARIA State Synchronization
When a component's `loading` or `disabled` state changes (via `v` attribute update or React prop change), the corresponding ARIA attributes (`aria-busy`, `aria-disabled`) MUST be updated in the same synchronous operation — never deferred to the next tick.

### P7 — Focus Trap Completeness
When a Modal is open, pressing `Tab` from the last focusable element MUST return focus to the first focusable element. Pressing `Shift+Tab` from the first MUST move to the last. This cycle MUST hold for any number of focusable elements inside the modal (1 to N).

### P8 — Theme Persistence
After calling `setTheme(t)` on the ThemeSwitcher, `localStorage.getItem('kenikool-theme')` MUST equal `t`, and `document.documentElement.getAttribute('data-theme')` MUST equal `t` — both updated atomically.
