# Kenikool UI Documentation

**Version:** v0.1.0  
**Modern component library for the web**

Welcome to Kenikool UI — a lightweight, accessible, and customizable component library. Works with vanilla JavaScript, React, and any framework.

---

## 🚀 Quick Start

```bash
npm install kenikool-ui
```

```html
<!-- Import CSS -->
<link rel="stylesheet" href="node_modules/kenikool-ui/dist/styles/base.css">

<!-- Import components -->
<script type="module">
  import 'kenikool-ui/vanilla';
</script>

<!-- Use components -->
<k-button v="filled lg primary">Get Started</k-button>
```

**→** [Full installation guide](./getting-started/installation.md)  
**→** [Create your first component](./getting-started/first-component.md)

---

## 📚 Documentation Sections

### Getting Started (Tutorials)

New to Kenikool UI? Start here:

- **[Installation](./getting-started/installation.md)** - Install via npm, CDN, or download
- **[First Component](./getting-started/first-component.md)** - Create your first button in 5 minutes
- **[First Layout](./getting-started/first-layout.md)** - Build a responsive layout *(Coming soon)*
- **[First Theme](./getting-started/first-theme.md)** - Customize colors and styles *(Coming soon)*

### Reference (Complete specs)

Complete API documentation for every feature:

#### Tokens
- **[Token System Overview](./reference/tokens/README.md)** - How tokens work
- **[Universal Tokens](./reference/tokens/universal-tokens.md)** - 19 tokens that work on all components
- **[Layout Tokens](./reference/tokens/layout-tokens.md)** - 112 tokens for layout control
- **[CSS Variables](./reference/tokens/css-variables.md)** - 110 customizable CSS properties *(Coming soon)*

#### Components
- **[Component Library](./reference/components/README.md)** - Complete component index *(Coming soon)*
- **Interactive Components** - Button, Input, Select, Checkbox, Modal, Toast, Tooltip, Badge, Avatar, Card, Loader
- **Media Components** - Image, Lightbox, Carousel
- **Navigation** - Tabs, Navbar *(In progress)*
- **Layout Components** - Grid, Row, Col, Stack, Box, Container, Section, Frame, Text, Divider

#### API
- **[Theme Functions](./reference/api/theme-functions.md)** - Change themes programmatically *(Coming soon)*
- **[Toast Manager](./reference/api/toast-manager.md)** - Show toast notifications *(Coming soon)*
- **[Utilities](./reference/api/utilities.md)** - Helper functions *(Coming soon)*

### Concepts (Understanding)

Learn the big ideas behind Kenikool UI:

- **[The v Attribute System](./concepts/v-attribute-system.md)** - How to style with the `v` attribute
- **[Theming Guide](./concepts/theming-philosophy.md)** - Using CSS variables *(Coming soon)*
- **[Token Guide](./concepts/token-system.md)** - Understanding tokens *(Coming soon)*
- **[Accessibility](./concepts/accessibility-first.md)** - Built-in features *(Coming soon)*
- **[Security](./concepts/security-model.md)** - XSS protection *(Coming soon)*

### Guides (How-To)

Practical solutions for common tasks:

- **[Creating Forms](./guides/creating-forms.md)** - Build complete forms *(Coming soon)*
- **[Responsive Layouts](./guides/responsive-layouts.md)** - Mobile-first patterns *(Coming soon)*
- **[Custom Themes](./guides/custom-themes.md)** - Brand customization *(Coming soon)*
- **[Optimizing Images](./guides/optimizing-images.md)** - Modern image optimization *(Coming soon)*
- **[Gallery with Lightbox](./guides/gallery-with-lightbox.md)** - Photo gallery tutorial *(Coming soon)*
- **[Dark Mode Toggle](./guides/dark-mode-toggle.md)** - Theme switching *(Coming soon)*

### Examples

Real-world code examples:

- **Authentication Form** - Login/signup forms *(Coming soon)*
- **Dashboard Layout** - Admin panel *(Coming soon)*
- **Image Gallery** - Photo gallery with lightbox *(Coming soon)*
- **Landing Page** - Marketing site *(Coming soon)*
- **Admin Panel** - Full dashboard *(Coming soon)*

---

## 🎯 Key Features

### 🎨 Simple Styling
Control everything with a single `v` attribute:
```html
<k-button v="filled lg primary r-full">Click me</k-button>
```

### 🌓 Built-in Theming
Three themes ready to use: light, dark, dracula
```javascript
import { applyTheme } from 'kenikool-ui/themes';
applyTheme('dark');
```

### ♿ Accessible by Default
Proper ARIA attributes, keyboard navigation, and focus management included.

### 🔒 Security Built-in
XSS protection and CSP compliance out of the box.

### 📦 Zero Configuration
Import and use. No build step, no config files.

### 🎭 Framework Agnostic
Works with vanilla JS, React, Vue, Svelte, Angular, or any framework.

---

## 💡 Core Concepts

### The `v` Attribute

Kenikool UI uses a single `v` attribute for styling — combine any tokens to style your components:

```html
<k-button v="filled lg primary r-full loading">
  Processing...
</k-button>
```

Available token categories:
- **Variant**: `filled`, `outlined`, `ghost`, `elevated`, `gradient`, etc.
- **Size**: `xs`, `sm`, `md`, `lg`, `xl`
- **Color**: `primary`, `success`, `warning`, `error`, `info`, `default`
- **Radius**: `r-none`, `r-sm`, `r-md`, `r-lg`, `r-full`
- **State**: `loading`, `disabled`, `full`

**→** [See all available tokens](./reference/tokens/universal-tokens.md)

### 131 Styling Tokens

Control every aspect of your UI with tokens:
- **19 Universal Tokens** - Size, color, radius, state (work on all components)
- **112 Layout Tokens** - Grid, spacing, padding, typography (layout components)

**→** [Universal Tokens Reference](./reference/tokens/universal-tokens.md)  
**→** [Layout Tokens Reference](./reference/tokens/layout-tokens.md)

### Theme Customization

Customize your theme with CSS variables:

```css
:root {
  --k-accent: #your-brand-color;
  --k-radius-md: 12px;
  --k-space-4: 20px;
}
```

**→** [CSS Variables Reference](./reference/tokens/css-variables.md) *(Coming soon)*

---

## 🛠️ Component Library

### Interactive Components
- **[Button](./reference/components/button.md)** - Buttons, icon buttons, button groups *(Coming soon)*
- **[Input](./reference/components/input.md)** - Text inputs with validation *(Coming soon)*
- **[Select](./reference/components/select.md)** - Custom dropdowns *(Coming soon)*
- **[Checkbox](./reference/components/checkbox.md)** - Checkboxes with indeterminate state *(Coming soon)*
- **[Modal](./reference/components/modal.md)** - Dialogs and overlays *(Coming soon)*
- **[Toast](./reference/components/toast.md)** - Notifications and alerts *(Coming soon)*
- **[Tooltip](./reference/components/tooltip.md)** - Contextual hints *(Coming soon)*

### Display Components
- **[Badge](./reference/components/badge.md)** - Status indicators and counters *(Coming soon)*
- **[Avatar](./reference/components/avatar.md)** - User avatars *(Coming soon)*
- **[Card](./reference/components/card.md)** - Content containers *(Coming soon)*
- **[Loader](./reference/components/loader.md)** - Loading spinners *(Coming soon)*

### Media Components
- **[Image](./reference/components/image.md)** - Optimized images with lazy loading *(Coming soon)*
- **[Lightbox](./reference/components/lightbox.md)** - Full-screen image viewer *(Coming soon)*
- **[Carousel](./reference/components/carousel.md)** - Image carousels *(Coming soon)*

### Navigation Components
- **[Tabs](./reference/components/tabs.md)** - Tabbed interfaces *(Coming soon)*
- **[Navbar](./reference/components/navbar.md)** - Navigation bars *(In progress)*

### Layout Components
- **[Grid](./reference/components/layout/grid.md)** - CSS Grid layouts *(Coming soon)*
- **[Stack](./reference/components/layout/stack.md)** - Flexbox stacks *(Coming soon)*
- **[Box](./reference/components/layout/box.md)** - Generic containers *(Coming soon)*
- **[Container](./reference/components/layout/container.md)** - Max-width wrappers *(Coming soon)*
- **[Text](./reference/components/layout/text.md)** - Typography component *(Coming soon)*

---

## 🌐 Browser Support

Kenikool UI works in all modern browsers:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

*(Web Components and CSS custom properties required)*

---

## 📖 Learn More

### Essential Reading
1. **[Installation Guide](./getting-started/installation.md)** - Set up Kenikool UI
2. **[First Component Tutorial](./getting-started/first-component.md)** - Build your first button
3. **[The v Attribute System](./concepts/v-attribute-system.md)** - Understand token-based styling
4. **[Universal Tokens Reference](./reference/tokens/universal-tokens.md)** - Master all 19 universal tokens

### Popular Guides
- **[Creating Forms](./guides/creating-forms.md)** - Build accessible forms *(Coming soon)*
- **[Custom Themes](./guides/custom-themes.md)** - Match your brand *(Coming soon)*
- **[Responsive Layouts](./guides/responsive-layouts.md)** - Mobile-first design *(Coming soon)*

### Need Help?
- **[GitHub Issues](https://github.com/your-repo/kenikool-ui/issues)** - Report bugs or request features
- **[Discussions](https://github.com/your-repo/kenikool-ui/discussions)** - Ask questions
- **[Playground](http://localhost:3001/playground.html)** - Try components live

---

## 🚦 Version Status

**Current Version:** v0.1.0  
**Release Date:** June 2026  
**Status:** Initial Release

### What's Included in v0.1.0
✅ 15+ interactive components  
✅ 10 layout components  
✅ 3 themes (light, dark, dracula)  
✅ 131 styling tokens  
✅ CSS variables for customization  
✅ Full accessibility support  
✅ Security built-in (XSS protection, CSP)  
✅ TypeScript definitions  

---

## 📜 License

MIT License - Use freely in personal and commercial projects.

---

**Ready to build?** → [Install Kenikool UI](./getting-started/installation.md)
