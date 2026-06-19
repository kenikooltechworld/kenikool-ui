---
inclusion: always
---

# Kenikool UI — Coding Standards & Workspace Rules

> This file is always included in every agent interaction for this workspace.
> It governs all code written for the `kenikool-ui` library.
> Reference specs: `.kiro/specs/kenikool-ui/requirements.md`, `design.md`, `tasks.md`

---

## ⚡ Agent Interaction Rule: Implementation Focus Only

**NO junk documentation, audit files, summaries, verification reports, or explanations.**

- Execute implementations directly.
- Do NOT create audit files, summary reports, or documentation of changes.
- Do NOT create verification/testing checklists unless explicitly requested.
- Report results only through code changes (file edits are self-documenting).
- If user asks "what did you do?", reference file edits directly — don't create extra files.
- Focus: Code that ships to users. Nothing else.

---

## 1. Project Identity

- Package name: `kenikool-ui` (single unscoped npm package)
- Three subpath entry points: `kenikool-ui/vanilla`, `kenikool-ui/react`, `kenikool-ui/themes`
- One CSS entry point: `kenikool-ui/styles`
- All source lives in `src/`. Never write code outside `src/`, `stories/`, `tests/`, or config files at root.
- `dist/` is generated — never edit files there manually.

---

## 2. Tech Stack — Exact Versions (June 2026)

Always use these versions. Never suggest or install older versions.

| Tool | Version |
|---|---|
| Node.js | `24.x LTS` |
| pnpm | `^11.5.0` |
| TypeScript | `^6.0.0` |
| Vite | `^8.0.0` |
| tsup | `^8.5.0` |
| React | `^19.1.1` |
| React DOM | `^19.1.1` |
| Vitest | `^4.1.0` |
| Storybook | `^9.0.0` |
| @storybook/react-vite | `^9.0.0` |
| @storybook/addon-themes | `^9.0.0` |
| @testing-library/react | `^16.0.0` |
| fast-check | `^4.7.0` |
| DOMPurify | `^3.2.6` |
| @changesets/cli | `^2.29.0` |

---

## 3. TypeScript Rules

- **Strict mode is mandatory.** `tsconfig.json` MUST have `"strict": true`. Never disable strict mode or individual strict checks.
- **Target:** `"ES2020"` — do not use syntax only available in ES2021+.
- **Module resolution:** `"moduleResolution": "bundler"` — required for Vite 8 and tsup compatibility.
- **JSX:** `"jsx": "react-jsx"` — the new transform. Never use `import React from 'react'` unless accessing React APIs directly.
- **No `any`.** All types must be explicit. Use `unknown` when the type is truly unknown, then narrow it.
- **All exported functions, interfaces, and classes MUST have JSDoc comments.** Internal helpers need at minimum a one-line comment.
- **No non-null assertions (`!`) without a comment explaining why it is safe.** Prefer optional chaining (`?.`) and nullish coalescing (`??`).
- **Export all public TypeScript interfaces and types** from the relevant `index.ts` barrel so users get full IntelliSense.
- File extension for TypeScript: `.ts` for logic, `.tsx` for files containing JSX only.

---

## 4. File & Folder Naming Conventions

- **Folders:** `PascalCase` for component folders (e.g. `src/vanilla/Button/`, `src/react/Modal/`)
- **Component files:** `PascalCase` matching the component name (e.g. `Button.tsx`, `KButtonElement.ts`)
- **Utility files:** `camelCase` (e.g. `parseV.ts`, `sanitize.ts`, `focusTrap.ts`)
- **CSS files:** Match the component name, `PascalCase` for component CSS (e.g. `Button.css`), `camelCase` for shared (e.g. `button.css` inside `styles/components/`)
- **Test files:** `[filename].test.ts` or `[filename].test.tsx` co-located in `tests/` mirroring the `src/` structure
- **Story files:** `[ComponentName].stories.tsx` inside `stories/`
- **Type files:** `[ComponentName].types.ts` inside the component folder

---

## 5. CSS Rules

- **ALL component CSS uses only semantic CSS custom properties (`--k-*`).** Never hardcode a color value, font size, spacing value, or shadow in component CSS.
- **No inline styles from library code** — the `style` prop on React components is for user overrides only. The library never sets `element.style.*` except for dynamic geometry (Tooltip positioning, Skeleton width/height from props).
- **Vanilla JS components use `data-*` attribute selectors** — not class-based selectors — for variant, size, color, state, and radius styling. Example: `k-button[data-variant="filled"]`, `k-button[data-loading="true"]`.
- **The inner native element (e.g. `<button>`) carries zero CSS classes.** It exists only for semantics and accessibility. All visual styling cascades from `data-*` on the host: `k-button[data-variant="filled"] button { }`.
- **Color token behavior is per-variant:** `color` + `filled/gradient/glow/soft/subtle` → changes background. `color` + `outlined` → changes border + text. `color` + `ghost/minimal` → changes text only. `elevated` and `destructive` ignore the `color` token. `color="primary"` (default) defers to `--k-accent`.
- **React components use BEM class selectors** — format: `k-[component]--[modifier]`. Example: `.k-button--filled`, `.k-button--loading`, `.k-button--lg`.
- **Every interactive element MUST have a `:focus-visible` ring** using `outline: 2px solid var(--k-focus-ring); outline-offset: 2px`. Never remove focus indicators.
- **All animations MUST be wrapped** in `@media (prefers-reduced-motion: reduce) { animation: none; transition: none; }`.
- **No `@layer`, no utility classes, no Tailwind.** This library is pure CSS variables + semantic selectors.
- CSS token prefix is always `--k-`. Never use `--kenikool-` or any other prefix.

---

## 6. Component Architecture Rules

### Vanilla JS (Web Custom Elements)

- Every component extends `KBaseElement` from `src/vanilla/KBaseElement.ts`.
- Every component uses `Light DOM` — NOT Shadow DOM. CSS variables cascade naturally without `::part()` workarounds.
- The `v` attribute is the single source of truth for variant, size, color, state, and target. Parse it using `parseV()` from `src/core/parseV.ts`. Never build a parallel parsing system.
- `customElements.define('k-[name]', K[Name]Element)` MUST be at the bottom of the element file — it is a side effect that fires on import.
- All component files MUST be imported in `src/vanilla/index.ts` for their auto-registration side effect.
- Custom events dispatched by components MUST use the `k:` prefix (e.g. `k:click`, `k:change`, `k:open`, `k:close`, `k:dismiss`). They MUST have `bubbles: true` and `composed: true`.

### React Components

- All interactive components MUST use `React.forwardRef` — no exceptions.
- All components are functional — no class components.
- Component props interfaces are defined in a separate `[Name].types.ts` file and exported.
- React components MUST NOT import from `src/vanilla/`. The only shared code is from `src/core/`.
- Internal state (open/close, hover, focus) is managed with `useState` and `useRef`. No external state management libraries.
- Effects that add global event listeners (document click for outside-close, keydown for focus trap) MUST clean up in the `useEffect` return function.

---

## 7. Security Rules — Non-Negotiable

These rules apply to **every single DOM write** across all components. There are no exceptions.

- **Plain text props** (labels, titles, messages, placeholders, button text): MUST use `element.textContent = sanitizeText(value)` or the React equivalent (`{children}` / `{text}` inside JSX — React auto-escapes). NEVER use `innerHTML` for plain text.
- **Rich/HTML content props** (tooltip `rich` variant, card body with `allowHtml`): MUST use `element.innerHTML = sanitizeHtml(value)` — always through the sanitizer.
- **URL props** (`src`, `href`, `action`, `data-src`): MUST be passed through `sanitizeUrl(url)` before setting on the DOM. Never set a URL attribute from a prop directly.
- **`eval()`, `new Function()`, `setTimeout(string)`, `setInterval(string)` are banned.** ESLint rules `no-eval` and `no-new-func` enforce this. If you see these in code, flag and remove them.
- **Theme names** set on `data-theme` MUST be validated against the whitelist `['light', 'dark', 'dracula']`. Any other value logs a `console.warn` and defaults to `'light'`.
- The library MUST work under a strict CSP (`default-src 'self'; style-src 'self'; script-src 'self'`). No runtime style injection, no inline event handlers set from code.

---

## 8. Accessibility Rules — Non-Negotiable

Every component ships accessible by default. Users never configure accessibility.

- **Semantic HTML first.** Use `<button>` for buttons, `<input>` for inputs, `<dialog>` for modals, `<label>` for labels. Only add ARIA roles when native semantics are insufficient.
- **Every focusable element needs an accessible name.** Visible text is preferred. For icon-only elements, a `label` or `aria-label` prop is REQUIRED by TypeScript (not optional).
- **Loading state:** `aria-busy="true"` on the element, pointer events suppressed.
- **Disabled state:** `aria-disabled="true"` + native `disabled` on the form element + `tabindex="-1"`.
- **Error state on inputs:** `aria-invalid="true"` + `aria-describedby` pointing to the error message element's `id`.
- **Modals:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`, focus trap, Escape to close, focus returns to trigger on close.
- **Toasts:** `role="alert"` + `aria-live="assertive"` for error/warning. `role="status"` + `aria-live="polite"` for success/info.
- **Select (custom dropdown):** `role="combobox"` on trigger, `role="listbox"` on list, `role="option"` + `aria-selected` on items.
- **Checkbox indeterminate state:** `aria-checked="mixed"` — not `aria-checked="true"` or `false`.
- All `id` attributes used for ARIA linkage MUST be auto-generated via `generateId()` from `src/core/utils/generateId.ts` if not provided by the user.

---

## 9. Theming Rules

- Themes are activated ONLY via `data-theme` on `document.documentElement` (`<html>`).
- The three valid theme values are: `"light"`, `"dark"`, `"dracula"`. No others.
- Light theme is the default — defined on `:root` so it works with no `data-theme` attribute at all.
- Theme initialization logic runs on `getInitialTheme()` from `src/themes/themeCore.ts`. Priority: `localStorage` → OS preference → `"light"`.
- Theme is persisted to `localStorage` under key `"kenikool-theme"`.
- CSS token naming: ALL semantic tokens use `--k-` prefix. Primitives also use `--k-` prefix. Example: `--k-color-purple-500` (primitive), `--k-accent` (semantic).
- Components reference ONLY semantic tokens, never primitives. If you find a component CSS rule with a hardcoded hex or a primitive token — fix it.

---

## 10. Build & Package Rules

- Build command: `pnpm build` — runs tsup with the config in `tsup.config.ts`.
- Dev command: `pnpm dev` — runs tsup in watch mode.
- Storybook command: `pnpm storybook` — launches on port 6006.
- Test command: `pnpm test` — runs vitest in run mode (not watch).
- Typecheck command: `pnpm typecheck` — runs `tsc --noEmit`. Must pass with zero errors.
- Three entry points in tsup: `src/vanilla/index.ts`, `src/react/index.ts`, `src/themes/index.ts`.
- Each entry outputs ESM (`.mjs`) + CJS (`.cjs`) + TypeScript declarations (`.d.ts`).
- `react` and `react-dom` MUST be in `external` for the `react` and `themes` tsup configs — they are never bundled.
- CSS files are NOT bundled into JS — they are copied to `dist/styles/` as a post-build step in tsup.
- The `sideEffects` field in `package.json` MUST list `["**/*.css", "dist/vanilla/index.mjs", "dist/vanilla/index.cjs"]` to prevent tree-shaking the custom element registration side effects.

---

## 11. Testing Rules

- Test framework: **Vitest 4.x** with jsdom environment.
- Every utility in `src/core/` MUST have unit tests.
- Every component (both Vanilla and React) MUST have at minimum these tests:
  - Renders without errors with default props
  - ARIA attributes are set correctly
  - Loading state blocks interaction and sets `aria-busy`
  - Disabled state blocks interaction and sets `aria-disabled`
  - `v` attribute changes trigger re-render (Vanilla only)
- Property-based tests use **fast-check 4.x**. The 8 correctness properties (P1–P8) from `requirements.md` MUST all have property-based test coverage.
- No `describe.only` or `it.only` left in committed code.
- Test files mirror the `src/` structure under `tests/`.

---

## 12. Storybook Rules

- Storybook version: **9.x** with `@storybook/react-vite`.
- The `@storybook/addon-themes` toolbar MUST be configured in `.storybook/preview.ts` to switch `data-theme` on the preview iframe's `<html>` element.
- Every component MUST have stories: `Default`, `AllVariants`, `AllSizes`, `AllColors`, `States`.
- Stories use the `satisfies Meta<typeof Component>` TypeScript pattern (Storybook 9 convention).
- Stories MUST work in all 3 themes without any theme-specific code in the story file itself.

---

## 13. Git & Release Rules

- Versioning: **Changesets** (`@changesets/cli ^2.29.0`).
- Every change that ships to users needs a changeset: run `pnpm changeset` and describe it as `patch`, `minor`, or `major`.
- Never push directly to `main` with a version bump — use the Changesets PR workflow.
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- Never commit `dist/` — it is gitignored.
- Never commit `.env` files or secrets.

---

## 14. What NOT To Do

- **Do not install Tailwind CSS** — this library does not use utility classes.
- **Do not use Shadow DOM** — components use Light DOM so CSS variables work globally.
- **Do not use styled-components, Emotion, or any CSS-in-JS** — all styles are plain CSS files.
- **Do not use `innerHTML` with unsanitized user content** — ever.
- **Do not add React as a direct dependency** — it is always a peer dependency (optional).
- **Do not create new CSS custom property prefixes** — only `--k-` is used.
- **Do not use `document.querySelector` inside component logic** to find other components — use the `target` selector from the `v` attribute in `_handleTarget()` only.
- **Do not use class-based CSS selectors in Vanilla JS component stylesheets** — use `data-*` attribute selectors.
- **Do not use `data-*` attribute selectors in React component stylesheets** — use BEM classes.
- **Do not create monorepo packages** — this is a single-package repo with multiple entry points.
- **Do not use `any` type** — use `unknown` + narrowing or a proper type.
