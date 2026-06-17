# Installation

Learn how to install and set up Kenikool UI in your project.

---

## Package Manager (Recommended)

### Using npm

```bash
npm install kenikool-ui
```

### Using pnpm

```bash
pnpm add kenikool-ui
```

### Using yarn

```bash
yarn add kenikool-ui
```

---

## Basic Setup

### 1. Import Styles

Import the base CSS file in your HTML or JavaScript:

#### HTML
```html
<link rel="stylesheet" href="node_modules/kenikool-ui/dist/styles/base.css">
```

#### JavaScript/TypeScript
```javascript
import 'kenikool-ui/dist/styles/base.css';
```

### 2. Import Components

#### Vanilla JavaScript

Import all components (auto-registers custom elements):

```javascript
import 'kenikool-ui/vanilla';
```

Or import specific components:

```javascript
import 'kenikool-ui/vanilla/Button/KButtonElement.js';
import 'kenikool-ui/vanilla/Input/KInputElement.js';
```

#### React

```tsx
import { Button, Input, Modal } from 'kenikool-ui/react';
```

### 3. Use Components

#### Vanilla JavaScript
```html
<k-button v="filled lg primary">Click me</k-button>
<k-input v="outlined md" label="Email" placeholder="you@example.com"></k-input>
```

#### React
```tsx
<Button variant="filled" size="lg" color="primary">
  Click me
</Button>
<Input variant="outlined" size="md" label="Email" placeholder="you@example.com" />
```

---

## CDN (Quick Start)

For rapid prototyping or simple projects, use our CDN:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kenikool UI - CDN Example</title>
  
  <!-- Import CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/kenikool-ui@latest/dist/styles/base.css">
</head>
<body>
  
  <!-- Use components -->
  <k-button v="filled lg primary">Hello World</k-button>
  
  <!-- Import JavaScript -->
  <script type="module">
    import 'https://cdn.jsdelivr.net/npm/kenikool-ui@latest/dist/vanilla/index.mjs';
  </script>
</body>
</html>
```

### CDN Links

**CSS:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/kenikool-ui@latest/dist/styles/base.css">
```

**JavaScript (ESM):**
```html
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/kenikool-ui@latest/dist/vanilla/index.mjs';
</script>
```

---

## Framework-Specific Setup

### Vite

Create or update `vite.config.js`:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  // No special configuration needed!
  // Vite handles Web Components and CSS imports automatically
});
```

Import in your entry file (`main.js` or `main.ts`):

```javascript
import 'kenikool-ui/dist/styles/base.css';
import 'kenikool-ui/vanilla';

// Your app code
```

### React (Create React App / Vite)

In `src/index.tsx` or `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'kenikool-ui/dist/styles/base.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

In your components:

```tsx
import { Button, Input } from 'kenikool-ui/react';

function App() {
  return (
    <div>
      <Button variant="filled" size="lg">Hello</Button>
      <Input label="Email" placeholder="you@example.com" />
    </div>
  );
}
```

### Next.js

#### App Router (Next.js 13+)

In `app/layout.tsx`:

```tsx
import 'kenikool-ui/dist/styles/base.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

Mark components as client-side:

```tsx
'use client';

import { Button } from 'kenikool-ui/react';

export default function MyComponent() {
  return <Button variant="filled">Click me</Button>;
}
```

#### Pages Router (Next.js 12 and below)

In `pages/_app.tsx`:

```tsx
import 'kenikool-ui/dist/styles/base.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

### Vue 3

In `main.js`:

```javascript
import { createApp } from 'vue';
import 'kenikool-ui/dist/styles/base.css';
import 'kenikool-ui/vanilla'; // Registers Web Components
import App from './App.vue';

createApp(App).mount('#app');
```

In your components:

```vue
<template>
  <k-button v="filled lg primary">Click me</k-button>
  <k-input v="outlined" label="Email" placeholder="you@example.com"></k-input>
</template>
```

### Angular

In `angular.json`, add to `styles` array:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/kenikool-ui/dist/styles/base.css",
              "src/styles.css"
            ]
          }
        }
      }
    }
  }
}
```

In `main.ts`:

```typescript
import 'kenikool-ui/vanilla';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
```

In your templates:

```html
<k-button v="filled lg primary">Click me</k-button>
<k-input v="outlined" label="Email" placeholder="you@example.com"></k-input>
```

Add to `app.module.ts`:

```typescript
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Allow custom elements
})
export class AppModule { }
```

### Svelte

In `main.js` or `+layout.svelte`:

```javascript
import 'kenikool-ui/dist/styles/base.css';
import 'kenikool-ui/vanilla';
```

In your components:

```svelte
<script>
  // No imports needed for vanilla components
</script>

<k-button v="filled lg primary">Click me</k-button>
<k-input v="outlined" label="Email" placeholder="you@example.com"></k-input>
```

---

## TypeScript Setup

Kenikool UI includes TypeScript definitions out of the box.

### Type Definitions

Types are automatically available when you import:

```typescript
import type { VTokens, Theme, Size, Color } from 'kenikool-ui/vanilla';
import type { ButtonProps, InputProps } from 'kenikool-ui/react';
```

### JSX Types (React)

If using TypeScript with React, types are already included:

```tsx
import { Button } from 'kenikool-ui/react';

// Full IntelliSense for props
<Button 
  variant="filled"    // Autocomplete: filled | outlined | ghost | ...
  size="lg"           // Autocomplete: xs | sm | md | lg | xl
  color="primary"     // Autocomplete: primary | success | warning | ...
  loading={true}
>
  Click me
</Button>
```

---

## Theme Setup

Kenikool UI includes three themes: `light`, `dark`, and `dracula`.

### Automatic Theme Detection

By default, the library auto-detects the user's theme preference:

```javascript
// No setup needed - happens automatically
// Priority: localStorage → OS preference → 'light'
```

### Manual Theme Control

```javascript
import { applyTheme } from 'kenikool-ui/themes';

// Apply a specific theme
applyTheme('dark');

// Get current theme
import { getInitialTheme } from 'kenikool-ui/themes';
const currentTheme = getInitialTheme(); // 'light' | 'dark' | 'dracula'
```

### Theme Switcher Component

```html
<k-theme-switcher v="pills"></k-theme-switcher>
```

**→** [Learn more about theming](../concepts/theming-philosophy.md) *(Coming soon)*

---

## Verification

Test your installation with this simple example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kenikool UI Test</title>
  <link rel="stylesheet" href="node_modules/kenikool-ui/dist/styles/base.css">
</head>
<body>
  <k-stack v="gap-4 p-8">
    <k-text v="h1 text-4xl semibold">Welcome to Kenikool UI</k-text>
    <k-text v="text-base muted">Modern component library for the web</k-text>
    
    <k-row v="gap-3">
      <k-button v="filled lg primary">Primary</k-button>
      <k-button v="outlined lg success">Success</k-button>
      <k-button v="ghost lg warning">Warning</k-button>
    </k-row>
  </k-stack>

  <script type="module">
    import 'kenikool-ui/vanilla';
  </script>
</body>
</html>
```

If you see styled buttons, you're good to go! 🎉

---

## Troubleshooting

### Components Not Registering

**Problem:** Custom elements like `<k-button>` not recognized.

**Solution:** Ensure you've imported the vanilla module:

```javascript
import 'kenikool-ui/vanilla';
```

### Styles Not Loading

**Problem:** Components render but have no styling.

**Solution:** Import the CSS file:

```javascript
import 'kenikool-ui/dist/styles/base.css';
```

### TypeScript Errors

**Problem:** `Cannot find module 'kenikool-ui'` in TypeScript.

**Solution:** Ensure TypeScript can resolve the package. Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler", // or "node16"
    "types": ["kenikool-ui"]
  }
}
```

### React Hydration Warnings

**Problem:** Warning about custom elements in React.

**Solution:** Web Components work with React 19.1+. Ensure you're on the latest version:

```bash
npm install react@latest react-dom@latest
```

### Build Errors in Production

**Problem:** Components don't work in production build.

**Solution:** Ensure your bundler doesn't tree-shake the side effects. In `package.json`:

```json
{
  "sideEffects": ["**/*.css", "dist/vanilla/**"]
}
```

---

## Next Steps

Now that you've installed Kenikool UI:

1. **[Create Your First Component](./first-component.md)** - Build a button in 5 minutes
2. **[Learn the v Attribute System](../concepts/v-attribute-system.md)** - Master token-based styling
3. **[Explore Universal Tokens](../reference/tokens/universal-tokens.md)** - Control size, color, and more
4. **[Browse Components](../reference/components/README.md)** - See what's available *(Coming soon)*

---

## Need Help?

- **[GitHub Issues](https://github.com/your-repo/kenikool-ui/issues)** - Report bugs
- **[Discussions](https://github.com/your-repo/kenikool-ui/discussions)** - Ask questions
- **[Playground](http://localhost:3001/playground.html)** - Try components live
