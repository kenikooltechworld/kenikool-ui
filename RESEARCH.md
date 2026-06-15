# Kenikool UI — Research & Architecture Document

> Status: Discussion Phase | Date: June 2026  
> Purpose: Full research dump covering stack, APIs, versions, design decisions, and examples.

---

## Table of Contents

1. [Vision & Goals](#1-vision--goals)
2. [Package Structure & Installation](#2-package-structure--installation)
3. [Theming Architecture](#3-theming-architecture)
4. [Dracula Theme — Official Color Palette](#4-dracula-theme--official-color-palette)
5. [Light & Dark Theme Palettes](#5-light--dark-theme-palettes)
6. [Token System Design](#6-token-system-design)
7. [Variant Prop API — Shorthand System](#7-variant-prop-api--shorthand-system)
8. [Component List — V1 (10 Components + Loaders)](#8-component-list--v1-10-components--loaders)
9. [ThemeSwitcher Component](#9-themeswitcher-component)
10. [Build Tooling](#10-build-tooling)
11. [Repo Structure](#11-repo-structure)
12. [Accessibility Standards](#12-accessibility-standards)
13. [Versioning & Publishing](#13-versioning--publishing)
14. [Full Tool & Version Reference](#14-full-tool--version-reference)
15. [Open Questions & Decisions](#15-open-questions--decisions)

---

## 1. Vision & Goals

### What this library IS

- A **batteries-included**, theme-aware UI component library
- Works in **Vanilla JS** and **React** from a single npm package
- **Zero configuration** to get started — import and render, that's it
- **Three themes out of the box**: Light, Dark, Dracula
- Each component ships with **10 pre-designed visual variants** — users pick, not customize
- Includes a **ready-to-use ThemeSwitcher dropdown** component
- Animations / loaders included

### What this library is NOT

- Not a utility-first system (no Tailwind, no `@layer`, no `@utilities`)
- Not headless (components are fully styled out of the box)
- Not a design token config system users need to learn
- Not a "bring your own styles" library

### User Experience Target

**Vanilla JS — declarative, zero JS setup:**
```html
<!-- Import once — all <k-*> tags register themselves -->
<script type="module">
  import 'kenikool-ui/vanilla';
</script>
<link rel="stylesheet" href="kenikool-ui/styles" />

<!-- Then just use the tags — no querySelector, no JS, no DOM work -->
<k-button v="filled lg primary">Submit</k-button>
<k-button v="outlined error r-full .toolbar">Delete</k-button>
<k-button v="gradient xl full loading #hero">Get Started</k-button>
```

The `v` attribute is the single source of truth. It encodes variant, size, color, radius, state flags, and an optional CSS mount-target selector — all in one string. The component parses it, applies `data-*` attributes to itself, and the shipped CSS handles all visual rendering. **No user CSS required. Ever.**

**Programmatic JS creation (when needed):**
```js
import 'kenikool-ui/vanilla';

// Use the standard DOM API — no library-specific factory needed
const btn = document.createElement('k-button');
btn.setAttribute('v', 'filled lg .toolbar');
btn.textContent = 'Submit';
// That's it — the element upgrades itself when inserted
document.body.appendChild(btn);

// Or set v to update state — component reacts instantly
btn.setAttribute('v', 'filled lg loading .toolbar');
```

**React:**
```jsx
import { Button } from 'kenikool-ui/react';

export default function App() {
  return <Button variant="filled" size="md">Click me</Button>;
}
```

**Theme Switcher (zero config):**
```jsx
import { ThemeSwitcher } from 'kenikool-ui/themes';

export default function App() {
  return (
    <div>
      <ThemeSwitcher />
      {/* rest of app */}
    </div>
  );
}
```

---

## 2. Package Structure & Installation

### Single Package, Multiple Entry Points

```
npm install kenikool-ui
```

That is the only install command. No scoped packages, no separate installs.

Users then import from subpaths:

| Import path | What it gives |
|---|---|
| `kenikool-ui/react` | All React components |
| `kenikool-ui/vanilla` | All Vanilla JS components |
| `kenikool-ui/themes` | ThemeSwitcher component + theme CSS |
| `kenikool-ui/styles` | Base CSS reset + token CSS (required import) |

### package.json `exports` field

This is the modern Node.js/bundler mechanism for subpath imports.
Supported in Node.js 12.7+ and all major bundlers (Vite, webpack 5, Rollup, esbuild).

```json
{
  "name": "kenikool-ui",
  "version": "1.0.0",
  "exports": {
    "./react": {
      "import": "./dist/react/index.mjs",
      "require": "./dist/react/index.cjs",
      "types": "./dist/react/index.d.ts"
    },
    "./vanilla": {
      "import": "./dist/vanilla/index.mjs",
      "require": "./dist/vanilla/index.cjs",
      "types": "./dist/vanilla/index.d.ts"
    },
    "./themes": {
      "import": "./dist/themes/index.mjs",
      "require": "./dist/themes/index.cjs",
      "types": "./dist/themes/index.d.ts"
    },
    "./styles": "./dist/styles/base.css",
    "./styles/light": "./dist/styles/themes/light.css",
    "./styles/dark": "./dist/styles/themes/dark.css",
    "./styles/dracula": "./dist/styles/themes/dracula.css"
  },
  "main": "./dist/react/index.cjs",
  "module": "./dist/react/index.mjs",
  "types": "./dist/react/index.d.ts",
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true },
    "react-dom": { "optional": true }
  }
}
```

> **Note:** React is an optional peer dependency. Vanilla JS users don't need it.

### One required CSS import (users do this once)

```js
// In your app's entry file
import 'kenikool-ui/styles';
```

This injects the base token variables. That's the only setup step.

---

## 3. Theming Architecture

### How It Works — The Big Picture

Themes are driven entirely by **CSS Custom Properties** (CSS variables) scoped to a `data-theme` attribute on the `<html>` element. No JavaScript class juggling, no styled-components ThemeProvider required.

```
[data-theme="light"]  → Light token values
[data-theme="dark"]   → Dark token values  
[data-theme="dracula"] → Dracula token values
```

When a user switches theme, one attribute changes. Every component on the page instantly updates — no re-render in React, no DOM manipulation.

### Two-Layer Token Model

**Why two layers?** So that components never reference raw color values. This means:
- Switching themes = redefining semantic tokens only
- Components never need to change
- Users can customize by overriding semantic tokens in their own CSS

```
Layer 1: Primitive tokens (raw values, never used in components)
  --k-color-purple-500: #bd93f9;
  --k-color-gray-900:   #1e1e2e;

Layer 2: Semantic tokens (intent-based, used in all components)
  --k-bg-surface:    → maps to a primitive
  --k-text-primary:  → maps to a primitive
  --k-accent:        → maps to a primitive
```

### Theme Switching — The Mechanism

```css
/* Default (light theme) — always present */
:root {
  --k-bg-base:      #ffffff;
  --k-bg-surface:   #f8f8f8;
  --k-text-primary: #1a1a1a;
  --k-text-muted:   #6b7280;
  --k-accent:       #6366f1;
  --k-border:       #e5e7eb;
}

/* Dark theme */
[data-theme="dark"] {
  --k-bg-base:      #0f0f0f;
  --k-bg-surface:   #1a1a1a;
  --k-text-primary: #f3f4f6;
  --k-text-muted:   #9ca3af;
  --k-accent:       #818cf8;
  --k-border:       #2d2d2d;
}

/* Dracula theme */
[data-theme="dracula"] {
  --k-bg-base:      #282a36;
  --k-bg-surface:   #44475a;
  --k-text-primary: #f8f8f2;
  --k-text-muted:   #6272a4;
  --k-accent:       #bd93f9;
  --k-border:       #44475a;
}
```

### JavaScript Theme Toggle (Vanilla)

```js
// Set theme
document.documentElement.setAttribute('data-theme', 'dracula');

// Read current theme
const theme = document.documentElement.getAttribute('data-theme');

// Persist to localStorage
localStorage.setItem('k-theme', 'dracula');

// On page load — read saved preference
const saved = localStorage.getItem('k-theme') || 'light';
document.documentElement.setAttribute('data-theme', saved);
```

### System Preference Detection

```js
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultTheme = prefersDark ? 'dark' : 'light';
```

This runs before the ThemeSwitcher renders, so there's no flash of wrong theme (FOUT).

---

## 4. Dracula Theme — Official Color Palette

Source: [draculatheme.com/contribute](https://draculatheme.com/contribute)

These are the canonical Dracula colors used to build the Dracula semantic tokens:

| Token Name | Hex | Role |
|---|---|---|
| Background | `#282A36` | Main page background |
| Current Line | `#44475A` | Surface / elevated background |
| Selection | `#44475A` | Selected state bg |
| Foreground | `#F8F8F2` | Primary text |
| Comment | `#6272A4` | Muted text, placeholders |
| Red | `#FF5555` | Error, danger, destructive |
| Orange | `#FFB86C` | Warning |
| Yellow | `#F1FA8C` | Highlight, info |
| Green | `#50FA7B` | Success |
| Cyan | `#8BE9FD` | Info, link |
| Purple | `#BD93F9` | Primary accent (brand color) |
| Pink | `#FF79C6` | Secondary accent |

### Dracula CSS Variables (what we'll ship)

```css
[data-theme="dracula"] {
  /* Backgrounds */
  --k-bg-base:        #282a36;
  --k-bg-surface:     #44475a;
  --k-bg-elevated:    #3d4059;
  --k-bg-overlay:     rgba(40, 42, 54, 0.85);

  /* Text */
  --k-text-primary:   #f8f8f2;
  --k-text-secondary: #cdd6f4;
  --k-text-muted:     #6272a4;
  --k-text-disabled:  #4a5068;
  --k-text-inverse:   #282a36;

  /* Accents */
  --k-accent:         #bd93f9;   /* purple — primary CTA */
  --k-accent-hover:   #caa7fa;
  --k-accent-active:  #a87ef7;
  --k-accent-subtle:  rgba(189, 147, 249, 0.15);

  /* Semantic colors */
  --k-success:        #50fa7b;
  --k-success-subtle: rgba(80, 250, 123, 0.15);
  --k-warning:        #ffb86c;
  --k-warning-subtle: rgba(255, 184, 108, 0.15);
  --k-error:          #ff5555;
  --k-error-subtle:   rgba(255, 85, 85, 0.15);
  --k-info:           #8be9fd;
  --k-info-subtle:    rgba(139, 233, 253, 0.15);

  /* Borders */
  --k-border:         #44475a;
  --k-border-subtle:  #383a47;
  --k-border-strong:  #6272a4;

  /* Interactive */
  --k-focus-ring:     rgba(189, 147, 249, 0.5);

  /* Typography */
  --k-font-sans:      'Inter', system-ui, -apple-system, sans-serif;
  --k-font-mono:      'JetBrains Mono', 'Fira Code', monospace;

  /* Radius */
  --k-radius-sm:      4px;
  --k-radius-md:      8px;
  --k-radius-lg:      12px;
  --k-radius-xl:      16px;
  --k-radius-full:    9999px;

  /* Spacing scale */
  --k-space-1:        4px;
  --k-space-2:        8px;
  --k-space-3:        12px;
  --k-space-4:        16px;
  --k-space-6:        24px;
  --k-space-8:        32px;
  --k-space-10:       40px;
  --k-space-12:       48px;

  /* Shadows */
  --k-shadow-sm:      0 1px 3px rgba(0,0,0,0.4);
  --k-shadow-md:      0 4px 12px rgba(0,0,0,0.5);
  --k-shadow-lg:      0 8px 24px rgba(0,0,0,0.6);
}
```

---

## 5. Light & Dark Theme Palettes

### Light Theme

```css
:root, [data-theme="light"] {
  --k-bg-base:        #ffffff;
  --k-bg-surface:     #f8fafc;
  --k-bg-elevated:    #f1f5f9;
  --k-bg-overlay:     rgba(255, 255, 255, 0.85);

  --k-text-primary:   #0f172a;
  --k-text-secondary: #334155;
  --k-text-muted:     #64748b;
  --k-text-disabled:  #94a3b8;
  --k-text-inverse:   #ffffff;

  --k-accent:         #6366f1;
  --k-accent-hover:   #4f46e5;
  --k-accent-active:  #4338ca;
  --k-accent-subtle:  rgba(99, 102, 241, 0.1);

  --k-success:        #16a34a;
  --k-success-subtle: rgba(22, 163, 74, 0.1);
  --k-warning:        #d97706;
  --k-warning-subtle: rgba(217, 119, 6, 0.1);
  --k-error:          #dc2626;
  --k-error-subtle:   rgba(220, 38, 38, 0.1);
  --k-info:           #0284c7;
  --k-info-subtle:    rgba(2, 132, 199, 0.1);

  --k-border:         #e2e8f0;
  --k-border-subtle:  #f1f5f9;
  --k-border-strong:  #cbd5e1;

  --k-focus-ring:     rgba(99, 102, 241, 0.4);

  --k-shadow-sm:      0 1px 3px rgba(0,0,0,0.08);
  --k-shadow-md:      0 4px 12px rgba(0,0,0,0.1);
  --k-shadow-lg:      0 8px 24px rgba(0,0,0,0.12);
}
```

### Dark Theme

```css
[data-theme="dark"] {
  --k-bg-base:        #0f0f13;
  --k-bg-surface:     #18181f;
  --k-bg-elevated:    #222230;
  --k-bg-overlay:     rgba(15, 15, 19, 0.88);

  --k-text-primary:   #f1f1f5;
  --k-text-secondary: #c4c4d4;
  --k-text-muted:     #7c7c9a;
  --k-text-disabled:  #4a4a62;
  --k-text-inverse:   #0f0f13;

  --k-accent:         #818cf8;
  --k-accent-hover:   #a5b4fc;
  --k-accent-active:  #6366f1;
  --k-accent-subtle:  rgba(129, 140, 248, 0.15);

  --k-success:        #4ade80;
  --k-success-subtle: rgba(74, 222, 128, 0.15);
  --k-warning:        #fbbf24;
  --k-warning-subtle: rgba(251, 191, 36, 0.15);
  --k-error:          #f87171;
  --k-error-subtle:   rgba(248, 113, 113, 0.15);
  --k-info:           #38bdf8;
  --k-info-subtle:    rgba(56, 189, 248, 0.15);

  --k-border:         #2a2a38;
  --k-border-subtle:  #1e1e2a;
  --k-border-strong:  #3d3d52;

  --k-focus-ring:     rgba(129, 140, 248, 0.5);

  --k-shadow-sm:      0 1px 3px rgba(0,0,0,0.5);
  --k-shadow-md:      0 4px 12px rgba(0,0,0,0.6);
  --k-shadow-lg:      0 8px 24px rgba(0,0,0,0.7);
}
```

> **Spacing, radius, and typography tokens are shared across all themes** — only color tokens change.

---

## 6. Token System Design

### Shared Tokens (Theme-Agnostic)

These never change between themes. They define structure, not color.

```css
:root {
  /* === TYPOGRAPHY === */
  --k-font-sans:      'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --k-font-mono:      'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

  --k-text-xs:        0.75rem;    /* 12px */
  --k-text-sm:        0.875rem;   /* 14px */
  --k-text-base:      1rem;       /* 16px */
  --k-text-lg:        1.125rem;   /* 18px */
  --k-text-xl:        1.25rem;    /* 20px */
  --k-text-2xl:       1.5rem;     /* 24px */
  --k-text-3xl:       1.875rem;   /* 30px */

  --k-font-normal:    400;
  --k-font-medium:    500;
  --k-font-semibold:  600;
  --k-font-bold:      700;

  --k-leading-tight:  1.25;
  --k-leading-normal: 1.5;
  --k-leading-loose:  1.75;

  /* === SPACING === */
  --k-space-1:   4px;
  --k-space-2:   8px;
  --k-space-3:   12px;
  --k-space-4:   16px;
  --k-space-5:   20px;
  --k-space-6:   24px;
  --k-space-8:   32px;
  --k-space-10:  40px;
  --k-space-12:  48px;
  --k-space-16:  64px;

  /* === BORDER RADIUS === */
  --k-radius-none: 0;
  --k-radius-sm:   4px;
  --k-radius-md:   8px;
  --k-radius-lg:   12px;
  --k-radius-xl:   16px;
  --k-radius-2xl:  24px;
  --k-radius-full: 9999px;

  /* === TRANSITIONS === */
  --k-transition-fast:   150ms ease;
  --k-transition-base:   200ms ease;
  --k-transition-slow:   300ms ease;
  --k-transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* === Z-INDEX === */
  --k-z-base:     0;
  --k-z-dropdown: 100;
  --k-z-sticky:   200;
  --k-z-overlay:  300;
  --k-z-modal:    400;
  --k-z-toast:    500;
  --k-z-tooltip:  600;
}
```

---

## 7. Variant Prop API — Shorthand System

### The Concept

Users pick from pre-designed variants instead of configuring styles manually. Think of it like choosing a shirt style — you pick "filled" or "outlined", not "set border to 1px solid and background to transparent".

### Prop Naming Convention

All props are short, memorable, and consistent across all components:

| Prop | Type | Values | Meaning |
|---|---|---|---|
| `variant` | string | `filled` \| `outlined` \| `ghost` \| `subtle` \| `link` | Visual style |
| `size` | string | `xs` \| `sm` \| `md` \| `lg` \| `xl` | Size scale |
| `color` | string | `default` \| `primary` \| `success` \| `warning` \| `error` \| `info` | Semantic color |
| `radius` | string | `none` \| `sm` \| `md` \| `lg` \| `full` | Border radius |
| `weight` | string | `light` \| `normal` \| `medium` \| `bold` | Font weight (text components) |
| `loading` | boolean | `true` \| `false` | Shows built-in loader |
| `disabled` | boolean | `true` \| `false` | Disabled state |
| `full` | boolean | `true` \| `false` | Full width |
| `icon` | ReactNode/Element | any | Leading icon slot |
| `iconRight` | ReactNode/Element | any | Trailing icon slot |

### The 10 Variants Per Component

Each component ships with exactly 10 named visual variants. Users just pass a number or name.

**Example — Button variants:**

| # | Variant Name | Description |
|---|---|---|
| 1 | `filled` | Solid background, primary accent color |
| 2 | `outlined` | Transparent bg, colored border |
| 3 | `ghost` | No border, subtle hover bg |
| 4 | `subtle` | Light tinted background |
| 5 | `soft` | Frosted glass-like, semi-transparent |
| 6 | `gradient` | Linear gradient background |
| 7 | `glow` | Filled + box-shadow glow effect |
| 8 | `minimal` | Text-only, no border, no bg |
| 9 | `elevated` | White/surface bg with shadow |
| 10 | `destructive` | Red/error-colored, for dangerous actions |

### React API Example

```jsx
import { Button } from 'kenikool-ui/react';

// Variant 1 — filled
<Button variant="filled" size="md" color="primary">Submit</Button>

// Variant 2 — outlined
<Button variant="outlined" size="lg" color="error">Delete</Button>

// Variant 6 — gradient, full width
<Button variant="gradient" size="xl" full>Get Started</Button>

// Variant 7 — glow, with loader
<Button variant="glow" loading>Processing...</Button>

// Variant 3 — ghost, small, with icon
<Button variant="ghost" size="sm" icon={<SearchIcon />}>Search</Button>
```

### Vanilla JS API Example

```html
<!-- Declarative — everything lives in the v attribute -->
<k-button v="filled md primary">Submit</k-button>
<k-button v="outlined lg error r-full">Delete</k-button>
<k-button v="ghost sm disabled">Cancel</k-button>
<k-button v="gradient xl full .hero">Get Started</k-button>
<k-button v="glow md loading #save-area">Saving...</k-button>
```

The `v` attribute token rules:
- Tokens starting with `.` or `#` → CSS mount-target selector (component moves itself there)
- `xs` `sm` `md` `lg` `xl` → size
- `primary` `success` `warning` `error` `info` `default` → color intent
- `loading` `disabled` `full` → state flags
- `r-none` `r-sm` `r-md` `r-lg` `r-full` → radius override
- Anything else → variant name

Token order never matters. Unrecognized tokens are treated as variant names for forward compatibility.

### Consistent Props Across All Components

The same `variant`, `size`, `color`, `radius` props work on every component. Once a user learns the Button API, they already know 80% of every other component's API.

---

## 8. Component List — V1 (10 Components + Loaders)

### The 10 Core Components

| # | Component | Import | Description |
|---|---|---|---|
| 1 | `Button` | `kenikool-ui/react` | Actions, form submits, CTAs |
| 2 | `Input` | `kenikool-ui/react` | Text input, password, search |
| 3 | `Badge` | `kenikool-ui/react` | Status tags, labels, counts |
| 4 | `Card` | `kenikool-ui/react` | Content containers with slots |
| 5 | `Modal` | `kenikool-ui/react` | Dialog overlays with focus trap |
| 6 | `Select` | `kenikool-ui/react` | Dropdown select menus |
| 7 | `Checkbox` | `kenikool-ui/react` | Boolean inputs, multi-select |
| 8 | `Toast` | `kenikool-ui/react` | Notification/alert messages |
| 9 | `Tooltip` | `kenikool-ui/react` | Hover information popups |
| 10 | `Avatar` | `kenikool-ui/react` | User profile images with fallback |

### Component Details

#### 1. Button — 10 Variants
```
filled | outlined | ghost | subtle | soft | gradient | glow | minimal | elevated | destructive
```
Props: `variant`, `size` (xs/sm/md/lg/xl), `color`, `radius`, `loading`, `disabled`, `full`, `icon`, `iconRight`

#### 2. Input — 10 Variants
```
default | filled | outlined | underlined | floating-label | search | 
password | otp | textarea | with-addon
```
Props: `variant`, `size`, `label`, `placeholder`, `error`, `hint`, `icon`, `iconRight`, `disabled`, `loading`

#### 3. Badge — 10 Variants
```
filled | outlined | subtle | dot | pill | count | tag | status | dismissible | icon-badge
```
Props: `variant`, `size`, `color`, `radius`, `dot`, `count`, `dismissible`

#### 4. Card — 10 Variants
```
default | elevated | outlined | filled | glass | gradient | 
interactive | horizontal | compact | feature
```
Props: `variant`, `radius`, `header`, `footer`, `image`, `hoverable`, `clickable`

#### 5. Modal — 10 Variants
```
default | centered | bottom-sheet | side-drawer-left | side-drawer-right | 
fullscreen | compact | form | confirm | media
```
Props: `variant`, `size` (sm/md/lg/xl/full), `open`, `onClose`, `title`, `description`, `footer`, `closeOnOverlay`, `closeOnEsc`

#### 6. Select — 10 Variants
```
default | filled | outlined | underlined | searchable | multi | 
grouped | with-icon | compact | floating-label
```
Props: `variant`, `size`, `options`, `value`, `onChange`, `placeholder`, `searchable`, `multi`, `disabled`, `loading`

#### 7. Checkbox — 10 Variants
```
default | filled | outlined | switch | switch-filled | 
radio | radio-card | indeterminate | icon-check | animated
```
Props: `variant`, `size`, `checked`, `onChange`, `label`, `description`, `disabled`, `indeterminate`, `color`

#### 8. Toast — 10 Variants
```
default | filled | outlined | subtle | minimal | 
with-action | progress | icon-only | stacked | floating
```
Props: `variant`, `color` (success/warning/error/info), `title`, `description`, `duration`, `position`, `action`, `dismissible`

Usage (React):
```jsx
import { useToast } from 'kenikool-ui/react';

const { toast } = useToast();
toast.success('File saved!', { variant: 'filled' });
toast.error('Upload failed', { variant: 'subtle', duration: 5000 });
```

#### 9. Tooltip — 10 Variants
```
default | dark | light | filled | outlined | 
arrow | no-arrow | rich | interactive | multiline
```
Props: `variant`, `content`, `placement` (top/bottom/left/right + start/end), `trigger` (hover/click/focus), `delay`, `maxWidth`

#### 10. Avatar — 10 Variants
```
default | with-border | with-status | with-badge | stacked | 
square | group | initials | gradient | glow
```
Props: `variant`, `size` (xs/sm/md/lg/xl/2xl), `src`, `alt`, `name` (for initials), `status` (online/offline/busy/away), `color`

---

### Loaders / Animations

A separate `Loader` component with **10 animation styles**:

| # | Loader Style | Description |
|---|---|---|
| 1 | `spinner` | Classic rotating circle |
| 2 | `dots` | Three bouncing dots |
| 3 | `pulse` | Fading pulse ring |
| 4 | `bars` | Equalizer-style bars |
| 5 | `ring` | Thin spinning ring |
| 6 | `ripple` | Expanding ripple circles |
| 7 | `bounce` | Single bouncing ball |
| 8 | `wave` | Sine wave dots |
| 9 | `skeleton` | Content placeholder shimmer |
| 10 | `progress` | Linear progress bar |

All loaders are **pure CSS `@keyframes`** — no JavaScript animation libraries.

```jsx
import { Loader } from 'kenikool-ui/react';

<Loader type="spinner" size="md" color="primary" />
<Loader type="dots" size="lg" />
<Loader type="skeleton" width="100%" height="20px" />
<Loader type="progress" value={65} />
```

CSS example (spinner):
```css
@keyframes k-spin {
  to { transform: rotate(360deg); }
}

@keyframes k-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.85); }
}

@keyframes k-bounce {
  0%, 80%, 100% { transform: scaleY(0.4); }
  40%           { transform: scaleY(1.0); }
}

@keyframes k-shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
```

---

## 9. ThemeSwitcher Component

### The Vision

Users import one component, drop it anywhere in their app. Done. The dropdown shows all three themes with previews. No configuration. It handles:
- Rendering the dropdown UI
- Reading saved preference from localStorage
- Detecting system preference on first visit
- Setting `data-theme` on `<html>`
- Persisting the choice

### Usage — Couldn't Be Simpler

```jsx
import { ThemeSwitcher } from 'kenikool-ui/themes';

// Anywhere in your app
function Navbar() {
  return (
    <nav>
      <span>My App</span>
      <ThemeSwitcher />
    </nav>
  );
}
```

### Vanilla JS Usage

```js
import { KThemeSwitcher } from 'kenikool-ui/vanilla';

const switcher = new KThemeSwitcher();
document.querySelector('#navbar').appendChild(switcher.render());
```

### What the Dropdown Shows

```
┌─────────────────────┐
│ 🎨 Theme            │
├─────────────────────┤
│ ○ ☀️  Light          │
│ ○ 🌙  Dark           │  
│ ● 🧛  Dracula        │  ← currently active
└─────────────────────┘
```

Each option has:
- An icon/emoji
- Theme name
- A tiny color swatch preview (3 dots showing bg, accent, text colors)

### ThemeSwitcher Props

```tsx
interface ThemeSwitcherProps {
  // Where to anchor the dropdown
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  
  // Whether to show color swatch previews
  showPreview?: boolean;
  
  // Custom trigger button (defaults to a styled palette icon button)
  trigger?: ReactNode;

  // Called when theme changes — useful for syncing with app state
  onChange?: (theme: 'light' | 'dark' | 'dracula') => void;
  
  // Starting theme (overrides localStorage on first render only)
  defaultTheme?: 'light' | 'dark' | 'dracula';
}
```

### Internal Logic

```ts
// themes/ThemeSwitcher.ts (shared core logic, used by both React and Vanilla)

const STORAGE_KEY = 'kenikool-theme';
const THEMES = ['light', 'dark', 'dracula'] as const;
type Theme = typeof THEMES[number];

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme;
  if (stored && THEMES.includes(stored)) return stored;

  // Fall back to system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}
```

### React Implementation (ThemeSwitcher.tsx)

```tsx
import { useState, useEffect, useRef } from 'react';

const THEMES = [
  { id: 'light',   label: 'Light',   icon: '☀️',  colors: ['#ffffff', '#6366f1', '#0f172a'] },
  { id: 'dark',    label: 'Dark',    icon: '🌙',  colors: ['#0f0f13', '#818cf8', '#f1f1f5'] },
  { id: 'dracula', label: 'Dracula', icon: '🧛',  colors: ['#282a36', '#bd93f9', '#f8f8f2'] },
];

export function ThemeSwitcher({ onChange, position = 'bottom-right' }: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('light');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('kenikool-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    setActive(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const handleSelect = (id: string) => {
    setActive(id);
    setOpen(false);
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem('kenikool-theme', id);
    onChange?.(id as any);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="k-theme-switcher" data-position={position}>
      <button
        className="k-theme-switcher__trigger"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch theme"
      >
        {THEMES.find(t => t.id === active)?.icon} Theme
      </button>
      {open && (
        <ul className="k-theme-switcher__menu" role="listbox" aria-label="Select theme">
          {THEMES.map(theme => (
            <li
              key={theme.id}
              role="option"
              aria-selected={active === theme.id}
              className="k-theme-switcher__option"
              onClick={() => handleSelect(theme.id)}
            >
              <span className="k-theme-switcher__icon">{theme.icon}</span>
              <span className="k-theme-switcher__label">{theme.label}</span>
              <span className="k-theme-switcher__swatches">
                {theme.colors.map((c, i) => (
                  <span key={i} style={{ background: c }} className="k-theme-switcher__swatch" />
                ))}
              </span>
              {active === theme.id && <span className="k-theme-switcher__check">✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### useTheme Hook (bonus, ships with the library)

```tsx
// Users who want programmatic control
import { useTheme } from 'kenikool-ui/themes';

function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dracula')}>Go Dracula</button>
    </div>
  );
}
```

---

## 10. Build Tooling

### Why tsup

tsup is the standard for building TypeScript libraries in 2025. It uses **esbuild** under the hood which is ~100x faster than tsc alone, and produces clean dual ESM/CJS output with type declarations automatically.

- **Version:** `tsup@^8.x` (current stable)
- **Under the hood:** esbuild
- **Output:** ESM (`.mjs`) + CJS (`.cjs`) + TypeScript declarations (`.d.ts`)
- **Speed:** Near-instant rebuilds even on large codebases

### tsup.config.ts

```ts
import { defineConfig } from 'tsup';

export default defineConfig([
  // Vanilla JS entry
  {
    entry: { index: 'src/vanilla/index.ts' },
    outDir: 'dist/vanilla',
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    external: [],
  },
  // React entry
  {
    entry: { index: 'src/react/index.ts' },
    outDir: 'dist/react',
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    sourcemap: true,
    external: ['react', 'react-dom'],
    esbuildOptions(options) {
      options.jsx = 'automatic'; // React 17+ JSX transform
    },
  },
  // Themes entry
  {
    entry: { index: 'src/themes/index.ts' },
    outDir: 'dist/themes',
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    sourcemap: true,
    external: ['react', 'react-dom'],
    esbuildOptions(options) {
      options.jsx = 'automatic';
    },
  },
]);
```

### Vite — For Development & Storybook

Used during development only. Not in the production build.

- **Version:** `vite@^5.x`
- Provides HMR (hot module reload) during development
- Powers the Storybook preview environment

### Storybook 8

- **Version:** `@storybook/react-vite@^8.x`
- The `@storybook/addon-themes` package lets you toggle `data-theme` from a Storybook toolbar dropdown
- Every component gets stories for all 10 variants × 3 themes = 30 previews per component

### TypeScript

- **Version:** `typescript@^5.5`
- `tsconfig.json` target: `ES2020`
- `moduleResolution`: `bundler` (for Vite/esbuild compatibility)
- Strict mode enabled

---

## 11. Repo Structure

```
kenikool-ui/
├── src/
│   ├── core/                  ← Shared logic (no framework)
│   │   ├── tokens/            ← Token type definitions
│   │   ├── utils/             ← Shared utility functions
│   │   └── theme/             ← Theme core logic (applyTheme, getInitialTheme)
│   │
│   ├── vanilla/               ← Vanilla JS components
│   │   ├── Button/
│   │   │   ├── Button.ts
│   │   │   ├── Button.css
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Badge/
│   │   ├── ...
│   │   └── index.ts           ← Entry: export * from './Button', etc.
│   │
│   ├── react/                 ← React components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.css
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Badge/
│   │   ├── ...
│   │   └── index.ts
│   │
│   ├── themes/                ← ThemeSwitcher + useTheme
│   │   ├── ThemeSwitcher.tsx
│   │   ├── ThemeSwitcher.css
│   │   ├── useTheme.ts
│   │   └── index.ts
│   │
│   └── styles/                ← CSS only
│       ├── base.css            ← Reset + shared structural CSS
│       ├── themes/
│       │   ├── light.css
│       │   ├── dark.css
│       │   └── dracula.css
│       └── animations.css     ← @keyframes for all loaders
│
├── stories/                   ← Storybook stories
│   ├── Button.stories.tsx
│   ├── Input.stories.tsx
│   └── ...
│
├── dist/                      ← Generated, not committed
├── tsup.config.ts
├── tsconfig.json
├── vite.config.ts             ← For dev/Storybook only
├── package.json
├── pnpm-lock.yaml
└── README.md
```

> Note: This is a **single-package** repo (not a monorepo). All source in `src/`, multiple entry points via tsup + package.json exports. Simpler to maintain, easier to publish.

---

## 12. Accessibility Standards

### Target: WCAG 2.2 Level AA

Every component ships accessible by default. Users don't configure this.

### Core Rules Applied Per Component

| Rule | Implementation |
|---|---|
| Semantic HTML first | `<button>`, `<input>`, `<label>`, `<dialog>`, `<select>` |
| Accessible names | `aria-label`, `aria-labelledby`, or visible text always present |
| Keyboard navigation | Tab, Enter, Space, Escape, Arrow keys handled |
| Focus management | Focus traps in Modal, focus returns on close |
| Focus visible | `:focus-visible` ring using `--k-focus-ring` token |
| Color contrast | Min 4.5:1 for normal text, 3:1 for large text across all 3 themes |
| Screen reader | `aria-live` regions for Toast, `aria-expanded` for dropdowns |
| Reduced motion | Animations respect `prefers-reduced-motion` |

### prefers-reduced-motion

All animations are wrapped:

```css
@media (prefers-reduced-motion: reduce) {
  .k-loader,
  .k-transition {
    animation: none;
    transition: none;
  }
}
```

### ARIA Patterns Per Component

| Component | Key ARIA attributes |
|---|---|
| Button | `aria-disabled`, `aria-pressed` (toggle), `aria-busy` (loading) |
| Input | `aria-label`, `aria-describedby` (error/hint), `aria-invalid` |
| Modal | `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap |
| Select | `role="listbox"`, `aria-expanded`, `aria-activedescendant` |
| Toast | `role="status"` (info/success) or `role="alert"` (error) |
| Tooltip | `role="tooltip"`, `aria-describedby` on trigger |
| Checkbox | `aria-checked` (including indeterminate), `aria-labelledby` |

---

## 13. Versioning & Publishing

### Changesets

- **Package:** `@changesets/cli@^2.x`
- Handles semantic versioning for the single package
- Generates changelogs automatically
- Contributors run `pnpm changeset` to describe their changes

### Workflow

```bash
# 1. Developer makes changes, then:
pnpm changeset        # describe what changed (patch/minor/major)

# 2. Before release:
pnpm changeset version  # bumps version, updates CHANGELOG.md

# 3. Publish:
pnpm changeset publish  # runs npm publish
```

### GitHub Actions (CI/CD)

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    branches: [main]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, registry-url: 'https://registry.npmjs.org' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm test
      - uses: changesets/action@v1
        with:
          publish: pnpm changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 14. Full Tool & Version Reference

> All versions verified as of **June 2026** via npm and official release pages.

| Tool | Current Version | Notes |
|---|---|---|
| **TypeScript** | `6.0.x` | Released March 2026. Last JS-based compiler — rewrites in Go/Rust planned for TS 7. New features: inferred type propagation across functions, stricter narrowing. Use `^6.0.0`. |
| **Vite** | `8.x` | Released May 2026. Major architectural shift — ships **Rolldown** (Rust-based, replaces Rollup) as its single unified bundler. 10–30× faster builds. Full plugin compatibility maintained. Use `^8.0.0`. |
| **tsup** | `8.5.x` | Latest stable as of June 2026 (confirmed via generalistprogrammer.com). Still esbuild-powered. Use `^8.5.0`. |
| **React** | `19.1.1` | Latest stable (confirmed npm, June 2026). React 19 is the standard — React Compiler now stable, `use()` hook, improved Server Components. Peer dep range: `>=19.0.0`. |
| **React DOM** | `19.1.1` | Matches React version. Peer dep range: `>=19.0.0`. |
| **Storybook** | `9.x` | Current major as of 2026 (`@storybook/react` v9.0.x on npm). Use `^9.0.0`. |
| **@storybook/addon-themes** | `9.x` | Matches Storybook major. Theme toolbar switcher. Use `^9.0.0`. |
| **@storybook/react-vite** | `9.x` | Vite-powered Storybook framework. Use `^9.0.0`. |
| **vitest** | `4.1.x` | Released May 2026. Adds test tags, native Node.js execution mode, AI agent reporter. Use `^4.1.0`. |
| **@testing-library/react** | `16.x` | Updated for React 19 compatibility. Use `^16.0.0`. |
| **fast-check** | `4.7.x` | Latest stable (jsdocs.io confirms 4.7.0, April 2026). Property-based testing. Use `^4.7.0`. |
| **DOMPurify** | `3.2.6` | Latest on npm as of June 2026. **Critical:** CVE-2026-41238 affects 3.0.1–3.3.3 via prototype pollution — watch for 3.3.4+ patch. Pin to `^3.2.6` until patched version confirmed. |
| **@changesets/cli** | `2.29.x` | Latest (npm confirms 2.29.x). Use `^2.29.0`. |
| **pnpm** | `11.5.x` | Released May 2026. Major new features: SQLite store, supply-chain security defaults, ESM distribution, native publish. Use `^11.5.0`. |
| **Node.js** | `24.x LTS` | Node 24 is the active LTS (v24.15.0 released April 2026). Node 26 is Current (released May 2026, enters LTS October 2026). Use `24.x LTS` for stability. |
| **esbuild** | bundled in tsup | Do not install separately — tsup manages esbuild version internally. |

### Important Version Notes for 2026

**TypeScript 6.0 — Breaking Change Alert**
TypeScript 6.0 is the last version written in JavaScript (the compiler is being rewritten in Go/Rust for TS 7). It introduces stricter type inference but is largely backwards-compatible for application code. The `moduleResolution: "bundler"` setting (introduced in TS 5) is still the correct choice for Vite/tsup projects.

**React 19 — What Changed for Libraries**
React 19 is the minimum peer dep (not 18). Key implications:
- `React.forwardRef` is still available but React 19 now allows refs as regular props — libraries should support both patterns
- The new JSX transform (`react/jsx-runtime`) is already the default — no change needed
- React Compiler (auto-memoization) is now stable — components written with hooks work automatically
- `use()` hook replaces most `useEffect` data-fetching patterns

**Vite 8 — Rolldown Bundler**
Vite 8 replaces Rollup with Rolldown (Rust-based) for production builds. Plugin compatibility is maintained via an adapter layer. tsup (which uses esbuild separately) is unaffected. Storybook on Vite 8 requires `@storybook/react-vite ^9.x`.

**pnpm 11 — Store Format Change**
pnpm 11 changes the store from JSON-per-package to a single SQLite database. This is a breaking change for CI caches — existing pnpm 9/10 caches are incompatible and must be regenerated.

**DOMPurify — Active CVE**
As of June 2026, CVE-2026-41238 affects DOMPurify 3.0.1 through 3.3.3 (prototype pollution via `CUSTOM_ELEMENT_HANDLING` fallback). Pin to `3.2.6` (last known clean release before the advisory range) and monitor for `3.3.4+` or `3.4.x` which should patch this. Alternatively evaluate switching to the native HTML Sanitizer API (now stable in Chrome 105+ and Firefox 115+) as the primary sanitizer with DOMPurify only as a fallback.

### Key CSS Features Used

| Feature | Browser Support (June 2026) | Usage |
|---|---|---|
| CSS Custom Properties | 99%+ | All theming |
| `@keyframes` | 99%+ | All animations |
| `data-*` attributes | 100% | Theme + variant switching |
| `prefers-color-scheme` | 98%+ | System preference detection |
| `prefers-reduced-motion` | 98%+ | Motion safety |
| `:focus-visible` | 98%+ | Keyboard focus rings |
| `backdrop-filter` | 95%+ | Glass/blur effects (soft, glass variants) |
| `color-mix()` | 93%+ | Optional: mixing accent with transparency |
| Native HTML Sanitizer API (`setHTML`) | 88%+ | Primary sanitizer (Chrome 105+, FF 115+) |

> No `@layer`, no `@property`, no container queries — keeping CSS compatibility wide and simple.

---

## 15. Open Questions & Decisions

### Resolved ✅

| # | Decision | Choice |
|---|---|---|
| 1 | Package name | `kenikool-ui` (single package) |
| 2 | Subpaths | `/vanilla`, `/react`, `/themes`, `/styles` |
| 3 | Third theme | **Dracula** |
| 4 | V1 component count | **10 components + Loader** |
| 5 | Variants per component | **10 named variants** |
| 6 | Theme switcher | Ready-to-use `<ThemeSwitcher />` / `<k-theme-switcher>` component |
| 7 | No Tailwind/utility classes | Pure CSS variables + data-attribute selectors (vanilla) / BEM classes (react) |
| 8 | Bundler | tsup (esbuild) |
| 9 | React version | 19+ optional peer dep |
| 10 | Vanilla JS model | **Web Components (Custom Elements)** — single `v` shorthand attribute drives everything (variant, size, color, state, target selector). Token order is irrelevant. |
| 11 | Security | DOMPurify `^3.2.6` + native Sanitizer API primary, all components sanitized |
| 12 | ARIA | Baked in automatically — users never configure accessibility |
| 13 | XSS prevention | `textContent` for text, `sanitizeHtml()` for rich content, `sanitizeUrl()` for src/href |
| 14 | Vanilla CSS strategy | **`data-*` attribute selectors on the host element only** — `k-button[data-variant="filled"] button { }`. No classes set on inner elements. The inner `<button>` is semantic-only (accessibility + form behavior). |
| 15 | Color × variant behavior | Color modifies **per-variant semantics**: on `filled`/`gradient`/`glow`/`soft`/`subtle` → changes background to semantic color; on `outlined` → changes border + text color; on `ghost`/`minimal` → changes text color only; on `elevated`/`destructive` → color ignored (semantics are fixed). |
| 16 | Mount target (target selector) | `v=".hero"` or `v="#app"` → component moves itself into the matching container on `connectedCallback`. If selector not found, component stays in place + `console.warn`. No MutationObserver retry — document that target must exist before the component tag. |
| 17 | No factory/imperative API | Users never call `new KButton()` or `KButton.render()`. Standard `document.createElement('k-button')` + `setAttribute('v', ...)` is the programmatic API when needed. |

### Still To Decide 🔄

| # | Question | Options | Recommendation |
|---|---|---|---|
| 1 | **CSS delivery** | a) Single `import 'kenikool-ui/styles'` CSS file  b) Per-component CSS auto-injected | Option A — simpler, no FOUC, SSR-safe |
| 2 | **Web Component shadow DOM?** | a) Shadow DOM (full style encapsulation)  b) Light DOM (global CSS tokens work naturally) | Option B (Light DOM) — CSS variables work across shadow boundary only in some cases; light DOM means our theme tokens work everywhere without workarounds |
| 3 | **Icon system** | a) Ship a small built-in icon set  b) Accept any element/SVG as prop | Option B — keeps bundle lean, works with any icon lib |
| 4 | **Toast position default** | `top-right` \| `bottom-right` \| `bottom-center` | `bottom-right` is the most common UX pattern |
| 5 | **SSR support** | v1 client-only, v2 adds SSR  \| SSR-ready from day 1 | Client-only for v1, document it clearly |
| 6 | **Per-component CSS splitting** | One `base.css` \| Per-component CSS files | One `base.css` for v1 (simpler), split in v2 |

---

*End of research document — updated with Vanilla JS Web Component model + full security/sanitization spec.*
*Next step: confirm remaining open decisions, then scaffold the project.*

---

## 16. Vanilla JS — The `v` Shorthand API

### The Core Idea

Every component is a **Web Custom Element** (`<k-button>`, `<k-input>`, etc.) with a single `v` attribute that carries everything — variant, state, size, color, and optionally a CSS selector for where to mount. Users write one attribute and the component handles the rest. No `document.querySelector`, no manual DOM work, no configuration objects.

### The `v` Attribute — Shorthand Syntax

The `v` attribute is a **space-separated string** of tokens. The component parses it and applies each token automatically.

```
v="[variant] [size?] [color?] [state?] [selector?]"
```

**Token rules:**
- Tokens starting with `.` or `#` are **CSS selectors** (mount target)
- Known state words: `loading`, `disabled`, `full`
- Known size words: `xs`, `sm`, `md`, `lg`, `xl`
- Known color words: `primary`, `success`, `warning`, `error`, `info`
- Everything else is treated as the **variant name**

### Usage — HTML

```html
<!-- Basic filled button -->
<k-button v="filled">Submit</k-button>

<!-- Outlined, large, error color -->
<k-button v="outlined lg error">Delete</k-button>

<!-- Filled, loading state -->
<k-button v="filled loading">Processing...</k-button>

<!-- Ghost, disabled, small -->
<k-button v="ghost sm disabled">Cancel</k-button>

<!-- Gradient, full width, xl -->
<k-button v="gradient xl full">Get Started</k-button>

<!-- Glow variant, mounts itself into .hero container -->
<k-button v="glow xl .hero">Join Now</k-button>

<!-- Input examples -->
<k-input v="outlined .login-form" label="Email" type="email"></k-input>
<k-input v="filled lg loading" label="Username"></k-input>

<!-- Badge -->
<k-badge v="pill success">Active</k-badge>
<k-badge v="dot error">3</k-badge>

<!-- Loader -->
<k-loader v="spinner md primary"></k-loader>
<k-loader v="dots lg"></k-loader>

<!-- Theme switcher — no v needed, zero config -->
<k-theme-switcher></k-theme-switcher>
```

### Usage — JS File (No document.querySelector)

Users import the component and drop the element tag. The library does the DOM work:

```js
// main.js — import once, all k-* tags now work everywhere
import 'kenikool-ui/vanilla';
import 'kenikool-ui/styles';
```

Or if they want to create components from JS:

```js
import { KButton, KInput, KModal } from 'kenikool-ui/vanilla';

// Create and mount — no document.querySelector needed
// The target selector is passed directly, library finds it and mounts
KButton({ v: 'filled lg', text: 'Submit', target: '.form-actions' });
KButton({ v: 'ghost lg',  text: 'Cancel', target: '.form-actions' });

KInput({ v: 'outlined', label: 'Email', type: 'email', target: '#login-form' });

// Listen to events — no querySelector
KButton({ v: 'filled loading', text: 'Save', target: '#toolbar', id: 'save-btn' });
document.getElementById('save-btn').addEventListener('k:click', async () => {
  // button already handles its own loading UI via v attribute update
});
```

### Updating Components From JS — Just Change the `v` Attribute

```js
// Get the element (standard JS, but rare — most things are declarative)
const btn = document.querySelector('k-button#save');

// Swap variant + add loading state — one attribute, component reacts instantly
btn.setAttribute('v', 'glow loading');

// Remove loading
btn.setAttribute('v', 'glow');

// Disable
btn.setAttribute('v', 'glow disabled');
```

### The `v` Parser — Internal Logic

```ts
// src/core/parseV.ts

export interface VTokens {
  variant:  string;        // e.g. 'filled', 'outlined', 'glow'
  size:     string;        // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color:    string;        // 'primary' | 'success' | 'warning' | 'error' | 'info'
  loading:  boolean;
  disabled: boolean;
  full:     boolean;
  target:   string | null; // CSS selector e.g. '.hero' or '#app'
}

const SIZES   = new Set(['xs', 'sm', 'md', 'lg', 'xl']);
const COLORS  = new Set(['primary', 'success', 'warning', 'error', 'info', 'default']);
const STATES  = new Set(['loading', 'disabled', 'full']);

export function parseV(v: string): VTokens {
  const tokens = v.trim().split(/\s+/);
  const result: VTokens = {
    variant:  'filled',   // default variant
    size:     'md',       // default size
    color:    'primary',  // default color
    loading:  false,
    disabled: false,
    full:     false,
    target:   null,
  };

  for (const token of tokens) {
    if (token.startsWith('.') || token.startsWith('#')) {
      result.target = token;                    // CSS selector
    } else if (SIZES.has(token)) {
      result.size = token;
    } else if (COLORS.has(token)) {
      result.color = token;
    } else if (token === 'loading')  {
      result.loading = true;
    } else if (token === 'disabled') {
      result.disabled = true;
    } else if (token === 'full') {
      result.full = true;
    } else {
      result.variant = token;                   // anything else = variant name
    }
  }

  return result;
}
```

### Web Component — How `v` Drives Everything

```ts
// src/vanilla/Button/KButtonElement.ts

import { parseV } from '../../core/parseV';
import { sanitizeText } from '../../core/utils/sanitize';

class KButtonElement extends HTMLElement {

  static get observedAttributes() { return ['v']; }

  connectedCallback() {
    this._applyV();
    this._applyAccessibility();
    this._handleTarget();
  }

  attributeChangedCallback(_: string, oldVal: string, newVal: string) {
    if (oldVal !== newVal) {
      this._applyV();
      this._applyAccessibility();
    }
  }

  private _applyV() {
    const raw    = this.getAttribute('v') || 'filled';
    const tokens = parseV(raw);

    // Apply as data-attributes — CSS reads these, no inline styles needed
    this.dataset.variant  = tokens.variant;
    this.dataset.size     = tokens.size;
    this.dataset.color    = tokens.color;
    this.dataset.loading  = String(tokens.loading);
    this.dataset.disabled = String(tokens.disabled);
    this.dataset.full     = String(tokens.full);
  }

  // If v contains a selector (e.g. ".hero"), move self into that container
  private _handleTarget() {
    const raw    = this.getAttribute('v') || '';
    const tokens = parseV(raw);
    if (tokens.target) {
      const container = document.querySelector(tokens.target);
      if (container && container !== this.parentElement) {
        container.appendChild(this);
      }
    }
  }

  private _applyAccessibility() {
    const raw    = this.getAttribute('v') || '';
    const tokens = parseV(raw);
    const inner  = this.querySelector('button') ?? this._ensureInnerButton();

    inner.disabled             = tokens.disabled;
    inner.setAttribute('aria-disabled', String(tokens.disabled));
    inner.setAttribute('aria-busy',     String(tokens.loading));
    if (tokens.disabled) inner.setAttribute('tabindex', '-1');
    else                 inner.setAttribute('tabindex', '0');
  }

  private _ensureInnerButton(): HTMLButtonElement {
    let btn = this.querySelector('button');
    if (!btn) {
      btn = document.createElement('button');
      btn.textContent = sanitizeText(this.textContent);
      this.textContent = '';
      this.appendChild(btn);
    }
    return btn;
  }
}

customElements.define('k-button', KButtonElement);
```

### CSS — Driven by data-attributes, Not Classes

```css
/* Button reads its own data-attributes — no class juggling by users */

k-button { display: inline-flex; }

/* Variant styles */
k-button[data-variant="filled"] button {
  background: var(--k-accent);
  color: var(--k-text-inverse);
  border: none;
}

k-button[data-variant="outlined"] button {
  background: transparent;
  color: var(--k-accent);
  border: 2px solid var(--k-accent);
}

k-button[data-variant="ghost"] button {
  background: transparent;
  color: var(--k-text-primary);
  border: none;
}

k-button[data-variant="gradient"] button {
  background: linear-gradient(135deg, var(--k-accent), var(--k-accent-hover));
  color: var(--k-text-inverse);
  border: none;
}

/* Size styles */
k-button[data-size="sm"] button { padding: var(--k-space-1) var(--k-space-3); font-size: var(--k-text-sm); }
k-button[data-size="md"] button { padding: var(--k-space-2) var(--k-space-4); font-size: var(--k-text-base); }
k-button[data-size="lg"] button { padding: var(--k-space-3) var(--k-space-6); font-size: var(--k-text-lg); }
k-button[data-size="xl"] button { padding: var(--k-space-4) var(--k-space-8); font-size: var(--k-text-xl); }

/* States */
k-button[data-loading="true"] button  { opacity: 0.75; cursor: wait; }
k-button[data-disabled="true"] button { opacity: 0.4;  cursor: not-allowed; pointer-events: none; }
k-button[data-full="true"]            { width: 100%; }

/* Color overrides */
k-button[data-color="error"][data-variant="filled"] button   { background: var(--k-error); }
k-button[data-color="success"][data-variant="filled"] button { background: var(--k-success); }
k-button[data-color="warning"][data-variant="filled"] button { background: var(--k-warning); }
```

### Component Auto-Registration

```ts
// src/vanilla/index.ts — import once, all tags register themselves
import './Button/KButtonElement';
import './Input/KInputElement';
import './Badge/KBadgeElement';
import './Card/KCardElement';
import './Modal/KModalElement';
import './Select/KSelectElement';
import './Checkbox/KCheckboxElement';
import './Toast/KToastElement';
import './Tooltip/KTooltipElement';
import './Avatar/KAvatarElement';
import './Loader/KLoaderElement';
import './ThemeSwitcher/KThemeSwitcherElement';

export * from './types';
```

### Full HTML Example — Zero Config, Everything Works

```html
<!DOCTYPE html>
<html data-theme="dracula">
<head>
  <link rel="stylesheet" href="https://unpkg.com/kenikool-ui/dist/styles/base.css" />
  <script type="module" src="https://unpkg.com/kenikool-ui/dist/vanilla/index.mjs"></script>
</head>
<body>

  <k-theme-switcher></k-theme-switcher>

  <k-button v="gradient xl full .hero">Get Started</k-button>
  <k-button v="outlined lg error">Delete Account</k-button>
  <k-button v="ghost sm disabled">Unavailable</k-button>

  <k-input v="outlined" label="Email" type="email"></k-input>
  <k-input v="filled loading" label="Username"></k-input>

  <k-badge v="pill success">Active</k-badge>
  <k-badge v="dot error">5</k-badge>

  <k-loader v="spinner md"></k-loader>

</body>
</html>
```

---

## 17. Security & Sanitization

### Why This Is Non-Negotiable for a Library

A UI component library is used across thousands of apps. If any component has an XSS vector, every app using the library is vulnerable. Security must be baked into every DOM write — never bolted on later.

### The Core Rule — Never Use innerHTML With User Data

```ts
// ❌ NEVER — direct innerHTML with user content
element.innerHTML = props.label;      // XSS if label = '<img src=x onerror=alert(1)>'
element.innerHTML = props.content;

// ✅ ALWAYS for plain text
element.textContent = props.label;    // always safe — renders as literal text

// ✅ For structured HTML content (like card body, tooltip rich content)
// Use a sanitizer function, never raw innerHTML
element.innerHTML = sanitize(props.content);
```

### Built-In Sanitizer Utility

The library ships its own `sanitize()` utility that sits in `src/core/utils/sanitize.ts`. It uses a layered approach:

**Layer 1 — Use the native HTML Sanitizer API (where available)**
The [HTML Sanitizer API](https://web.dev/sanitizer/) (`element.setHTML()`) is a native browser API that strips dangerous content before DOM insertion. Available in Chrome 105+ and Firefox 115+.

**Layer 2 — Fall back to DOMPurify** (the gold standard, 3.x, actively maintained)
DOMPurify has 8M+ weekly downloads and is used by Google, Meta, and others. Note: always use the **latest patched version** — several CVEs in 3.1.x/3.2.x were patched in 3.2.4+.

```ts
// src/core/utils/sanitize.ts

import DOMPurify from 'dompurify';

const SAFE_TAGS  = ['b', 'i', 'em', 'strong', 'span', 'br', 'p', 'a'];
const SAFE_ATTRS = ['href', 'title', 'target', 'rel'];

/**
 * Sanitizes an HTML string — removes scripts, event handlers,
 * dangerous attributes, and other XSS vectors.
 *
 * Uses native Sanitizer API if available, falls back to DOMPurify.
 */
export function sanitizeHtml(dirty: string): string {
  // Prefer the native Sanitizer API (Chrome 105+, Firefox 115+)
  if ('Sanitizer' in window) {
    const el = document.createElement('div');
    el.setHTML(dirty, {
      allowElements: SAFE_TAGS,
      allowAttributes: { '*': SAFE_ATTRS },
    });
    return el.innerHTML;
  }

  // Fall back to DOMPurify
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS:  SAFE_TAGS,
    ALLOWED_ATTR:  SAFE_ATTRS,
    FORBID_TAGS:   ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR:   ['onerror', 'onload', 'onclick', 'onmouseover', 'srcdoc'],
  });
}

/**
 * For plain text content — always use this instead of innerHTML.
 * Converts to text node, 100% XSS-safe.
 */
export function sanitizeText(input: unknown): string {
  if (input === null || input === undefined) return '';
  // Convert to string, then use the DOM's own text escaping
  const node = document.createTextNode(String(input));
  const wrapper = document.createElement('span');
  wrapper.appendChild(node);
  return wrapper.textContent ?? '';
}

/**
 * Validates and sanitizes a URL — prevents javascript: and data: XSS
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url, window.location.href);
    // Only allow safe protocols
    if (!['https:', 'http:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      console.warn(`[kenikool-ui] Blocked unsafe URL protocol: ${parsed.protocol}`);
      return '#';
    }
    return parsed.href;
  } catch {
    return '#';
  }
}
```

### Security Rules Per Component

| Component | Risk | Mitigation |
|---|---|---|
| Button | Label could be HTML | `textContent` only, never `innerHTML` |
| Input | Placeholder, label | `textContent` / `setAttribute` (browser auto-escapes attrs) |
| Badge | Content text | `textContent` only |
| Card | Body content (may be rich) | `sanitizeHtml()` for rich slot content |
| Modal | Title + body content | Title → `textContent`, body → `sanitizeHtml()` |
| Select | Option labels | `textContent` only |
| Toast | Message text | `textContent` only — no HTML in toasts |
| Tooltip | Content | `textContent` default, `sanitizeHtml()` if `rich` variant |
| Avatar | `src` URL | `sanitizeUrl()` before setting `src` attribute |
| Loader | No user input | N/A |
| ThemeSwitcher | Theme names | Whitelist check only (must be 'light'/'dark'/'dracula') |

### Safe Attribute Setting

When setting HTML attributes from user-provided props, the browser auto-escapes attribute values. But some attributes need extra care:

```ts
// ✅ Safe — browser escapes attribute values automatically
element.setAttribute('placeholder', userInput);
element.setAttribute('aria-label', userInput);

// ✅ Safe — textContent never executes HTML
element.textContent = userInput;

// ✅ Safe URL — validate before setting src/href
imgEl.setAttribute('src', sanitizeUrl(props.src));
anchorEl.setAttribute('href', sanitizeUrl(props.href));

// ❌ Never do this
element.innerHTML = userInput;
element.setAttribute('onclick', userInput);    // never set event attrs from props
```

### No eval(), No Function Constructor

The library never uses `eval()`, `new Function()`, `setTimeout(string)`, or `setInterval(string)`. These are banned at the ESLint level.

### Content Security Policy (CSP) Compatibility

The library is designed to work with strict CSPs. No inline styles injected dynamically (everything is in CSS files). No `<style>` tags injected at runtime. No `eval()`.

```
Content-Security-Policy: 
  default-src 'self';
  style-src 'self';
  script-src 'self';
```

The library works under this policy without any `'unsafe-inline'` or `'unsafe-eval'` exceptions.

### ARIA — Baked In By Default, Not Optional

Every interactive component sets correct ARIA attributes automatically. Users don't configure this.

```ts
// Inside KButtonElement.connectedCallback()
private _applyAccessibility(): void {
  // Ensure the inner <button> has proper role and state
  const btn = this.shadowRoot?.querySelector('button') ?? this._innerBtn;

  // role is implicit from <button> — no need to set, but if using <div>:
  // btn.setAttribute('role', 'button');
  // btn.setAttribute('tabindex', '0');

  // Sync disabled state
  if (this.hasAttribute('disabled')) {
    btn.setAttribute('aria-disabled', 'true');
    btn.setAttribute('tabindex', '-1');
  } else {
    btn.removeAttribute('aria-disabled');
    btn.setAttribute('tabindex', '0');
  }

  // Loading state
  if (this.hasAttribute('loading')) {
    btn.setAttribute('aria-busy', 'true');
    btn.setAttribute('aria-label', this._originalLabel + ' — loading');
  } else {
    btn.removeAttribute('aria-busy');
    btn.setAttribute('aria-label', this._originalLabel);
  }
}
```

### Full ARIA Reference Per Component (Auto-Applied)

**Button**
```html
<button
  aria-disabled="false"       <!-- reflects disabled prop -->
  aria-busy="false"           <!-- reflects loading prop -->
  aria-pressed="false"        <!-- for toggle variants -->
  aria-label="Submit"         <!-- always set, even with icon-only buttons -->
>
```

**Input**
```html
<input
  aria-label="Email address"        <!-- from label prop -->
  aria-describedby="input-hint-id"  <!-- points to hint/error text -->
  aria-invalid="true"               <!-- set when error prop present -->
  aria-required="true"              <!-- set when required prop present -->
  autocomplete="email"              <!-- set based on type -->
/>
<span id="input-hint-id" role="status">Please enter a valid email</span>
```

**Modal**
```html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title-id"
  aria-describedby="modal-desc-id"
  tabindex="-1"                   <!-- receives focus when opened -->
>
  <h2 id="modal-title-id">Confirm Action</h2>
  <p  id="modal-desc-id">This cannot be undone.</p>
</div>
<!-- Focus trap: Tab cycles only within modal while open -->
<!-- Escape key closes modal -->
<!-- Focus returns to trigger element on close -->
```

**Select (custom)**
```html
<div
  role="combobox"
  aria-expanded="false"
  aria-haspopup="listbox"
  aria-owns="select-list-id"
  aria-activedescendant="option-3"
  tabindex="0"
>
<ul id="select-list-id" role="listbox" aria-label="Options">
  <li role="option" aria-selected="false" id="option-1">Option A</li>
  <li role="option" aria-selected="true"  id="option-2">Option B</li>
</ul>
```

**Toast**
```html
<!-- info/success — non-urgent, polite announcement -->
<div role="status" aria-live="polite" aria-atomic="true">
  File saved successfully
</div>

<!-- error/warning — urgent, interrupts screen reader -->
<div role="alert" aria-live="assertive" aria-atomic="true">
  Upload failed. Please try again.
</div>
```

**Tooltip**
```html
<!-- Trigger element gets aria-describedby pointing to tooltip -->
<button aria-describedby="tooltip-42">Hover me</button>
<div id="tooltip-42" role="tooltip">This is the tooltip content</div>
```

**Checkbox**
```html
<input
  type="checkbox"
  aria-checked="mixed"     <!-- for indeterminate state -->
  aria-labelledby="cb-label-id"
  aria-describedby="cb-desc-id"
/>
<label id="cb-label-id">Accept terms</label>
<span id="cb-desc-id">You must accept to continue</span>
```

### Keyboard Navigation (Built In Per Component)

| Component | Keys Handled |
|---|---|
| Button | `Enter`, `Space` → click |
| Input | Standard browser defaults + `Escape` to clear |
| Modal | `Escape` → close, `Tab`/`Shift+Tab` → focus trap |
| Select | `Enter`/`Space` → open, `ArrowUp`/`ArrowDown` → navigate, `Enter` → select, `Escape` → close |
| Checkbox | `Space` → toggle |
| Toast | `Escape` or close button → dismiss |
| Tooltip | `Escape` → hide (when trigger=click) |
| ThemeSwitcher | `Enter`/`Space` → open, `ArrowUp`/`ArrowDown` → navigate, `Enter` → select |

### DOMPurify Version Note

- **Use:** `dompurify@^3.2.5` or later (3.2.4+ patches CVE-2025-26791 and CVE-2025-15599)
- **Do not use:** `3.1.x` through `3.2.3` — known mXSS vulnerabilities in those versions
- DOMPurify is a **regular dependency** (not peer dep) — it's always present

```json
{
  "dependencies": {
    "dompurify": "^3.2.5"
  },
  "devDependencies": {
    "@types/dompurify": "^3.x"
  }
}
```

---
