# Token System Overview

Kenikool UI's token system provides 131 styling tokens that control every aspect of your components through a single `v` attribute.

---

## What Are Tokens?

Tokens are short keywords that modify component appearance and behavior:

```html
<k-button v="filled lg primary r-full loading">
  ↑        ↑    ↑  ↑       ↑       ↑
  │        │    │  │       │       └─ State: loading
  │        │    │  │       └───────── Radius: full (pill shape)
  │        │    │  └───────────────── Color: primary (blue)
  │        │    └──────────────────── Size: large
  │        └───────────────────────── Variant: filled (solid bg)
  └────────────────────────────────── Component name
</k-button>
```

---

## Token Categories

### 1. Universal Tokens (19 tokens)

These tokens work on **every component** in the library:

| Category | Tokens | Count | Description |
|----------|--------|-------|-------------|
| **Size** | `xs`, `sm`, `md`, `lg`, `xl` | 5 | Controls component dimensions |
| **Color** | `primary`, `success`, `warning`, `error`, `info`, `default` | 6 | Color schemes |
| **Radius** | `r-none`, `r-sm`, `r-md`, `r-lg`, `r-full` | 5 | Border radius |
| **State** | `loading`, `disabled`, `full` | 3 | Boolean state flags |

**→** [Complete Universal Tokens Reference](./universal-tokens.md)

### 2. Layout Tokens (112 tokens)

These tokens work on layout components (`k-grid`, `k-row`, `k-col`, `k-stack`, `k-box`, `k-text`):

| Category | Example Tokens | Count | Description |
|----------|----------------|-------|-------------|
| **Grid Columns** | `cols-3`, `cols-auto` | 13 | Grid column count |
| **Column Span** | `span-6`, `span-full` | 13 | Grid column span |
| **Gap** | `gap-4`, `gap-8` | 24 | Spacing between items |
| **Padding** | `p-4`, `p-8` | 24 | Internal padding |
| **Alignment** | `align-center`, `align-start` | 5 | Cross-axis alignment |
| **Justify** | `justify-between`, `justify-center` | 6 | Main-axis alignment |
| **Direction** | `horizontal`, `vertical` | 2 | Flex direction |
| **Typography** | `text-2xl`, `semibold`, `h1` | 23 | Text styling |
| **Surface** | `base`, `surface` | 2 | Background surface |

**→** [Complete Layout Tokens Reference](./layout-tokens.md)

### 3. Variant Tokens (∞ tokens)

Each component defines its own variants. Any unrecognized token becomes a variant name:

```html
<!-- Button variants -->
<k-button v="filled">Filled</k-button>
<k-button v="outlined">Outlined</k-button>
<k-button v="ghost">Ghost</k-button>
<k-button v="gradient">Gradient (custom)</k-button>

<!-- Image variants -->
<k-image v="hero" src="banner.jpg"></k-image>
<k-image v="avatar" src="profile.jpg"></k-image>
<k-image v="gallery" src="photo.jpg"></k-image>

<!-- Tabs variants -->
<k-tabs v="pills">Pills</k-tabs>
<k-tabs v="underline">Underline</k-tabs>
```

**→** See component documentation for available variants

---

## Token Syntax Rules

### Order Independence

Token order doesn't matter:

```html
<!-- All identical -->
<k-button v="filled lg primary">Click</k-button>
<k-button v="lg primary filled">Click</k-button>
<k-button v="primary filled lg">Click</k-button>
```

### Space-Separated

Tokens are separated by spaces:

```html
<k-button v="filled lg primary r-full loading disabled">
  Multiple tokens
</k-button>
```

### Last Token Wins

For most categories, the last token of that type wins:

```html
<!-- Results in "xl" (last size token) -->
<k-button v="sm md lg xl">Button</k-button>

<!-- Results in "error" (last color token) -->
<k-button v="primary success error">Button</k-button>
```

### State Flags Accumulate

Boolean states can be combined:

```html
<!-- Both loading AND disabled -->
<k-button v="filled loading disabled">Button</k-button>
```

---

## Token Reference Tables

### Quick Lookup: Universal Tokens

| Token | Values | Default | Description |
|-------|--------|---------|-------------|
| **variant** | Component-specific | `filled` | Visual style |
| **size** | `xs \| sm \| md \| lg \| xl` | `md` | Component size |
| **color** | `primary \| success \| warning \| error \| info \| default` | `primary` | Color scheme |
| **radius** | `r-none \| r-sm \| r-md \| r-lg \| r-full` | Component-specific | Border radius |
| **loading** | Boolean flag | `false` | Loading state |
| **disabled** | Boolean flag | `false` | Disabled state |
| **full** | Boolean flag | `false` | Full-width |

### Quick Lookup: Layout Tokens

| Token | Values | Example | Description |
|-------|--------|---------|-------------|
| **cols** | `cols-auto`, `cols-1` to `cols-12` | `cols-3` | Grid columns |
| **span** | `span-full`, `span-1` to `span-12` | `span-6` | Column span |
| **gap** | `gap-0` to `gap-24` | `gap-4` | Spacing (16px) |
| **padding** | `p-0` to `p-24` | `p-4` | Padding (16px) |
| **align** | `start \| center \| end \| stretch \| baseline` | `align-center` | Cross-axis |
| **justify** | `start \| center \| end \| between \| around \| evenly` | `justify-between` | Main-axis |
| **direction** | `horizontal \| vertical` | `vertical` | Flex direction |
| **textSize** | `text-xs` to `text-4xl` | `text-base` | Typography size |
| **weight** | `normal \| medium \| semibold \| bold` | `normal` | Font weight |
| **as** | `h1` to `h6`, `p`, `span`, `label`, `code`, `pre` | `span` | Semantic element |

---

## Token Examples

### Basic Component Styling

```html
<!-- Small outlined success button -->
<k-button v="outlined sm success">
  Small Success
</k-button>

<!-- Large filled primary button with full radius -->
<k-button v="filled lg primary r-full">
  Large Pill Button
</k-button>

<!-- Loading state button -->
<k-button v="filled md primary loading">
  Processing...
</k-button>
```

### Layout Composition

```html
<!-- 3-column grid with gap -->
<k-grid v="cols-3 gap-6">
  <k-box v="surface p-6 r-lg">Column 1</k-box>
  <k-box v="surface p-6 r-lg">Column 2</k-box>
  <k-box v="surface p-6 r-lg">Column 3</k-box>
</k-grid>

<!-- Vertical stack with spacing -->
<k-stack v="gap-4 p-8">
  <k-text v="h1 text-4xl bold">Heading</k-text>
  <k-text v="text-base muted">Subheading</k-text>
  <k-button v="filled lg primary">CTA</k-button>
</k-stack>

<!-- Horizontal row with alignment -->
<k-row v="gap-3 align-center justify-between">
  <k-text v="text-lg semibold">Logo</k-text>
  <k-button v="outlined sm">Menu</k-button>
</k-row>
```

### Combined Examples

```html
<!-- Card with all token types -->
<k-box v="surface p-6 r-lg">
  <k-stack v="gap-4">
    <k-text v="h3 text-2xl semibold">Card Title</k-text>
    <k-text v="text-base muted">Card description text</k-text>
    <k-row v="gap-3 justify-end">
      <k-button v="outlined sm">Cancel</k-button>
      <k-button v="filled sm primary">Confirm</k-button>
    </k-row>
  </k-stack>
</k-box>
```

---

## How Tokens Work

Tokens in the `v` attribute control component styling. The library reads your tokens and applies the appropriate styles.

### Example

```html
<k-button v="filled lg primary r-full">
  Click me
</k-button>
```

This button will display as:
- **filled** variant (solid background)
- **lg** size (large)
- **primary** color (accent color)
- **r-full** radius (pill shape)

---

## Token vs CSS Variables

Tokens and CSS variables serve different purposes:

### Tokens (v attribute)
- **Purpose**: Configure component variants, sizes, states
- **Scope**: Per-component instance
- **Syntax**: `v="filled lg primary"`
- **Example**: `<k-button v="filled lg">Button</k-button>`

### CSS Variables
- **Purpose**: Customize theme colors, spacing, typography
- **Scope**: Global or per-element
- **Syntax**: `--k-accent: #color`
- **Example**: `:root { --k-accent: #6366f1; }`

Use both together for maximum customization:

```html
<style>
  :root {
    --k-accent: #ff6b35;        /* CSS variable: change accent color */
    --k-radius-md: 12px;        /* CSS variable: change default radius */
  }
</style>

<!-- Token: configure this specific button -->
<k-button v="filled lg primary r-md">
  Customized Button
</k-button>
```

**→** [CSS Variables Reference](./css-variables.md) *(Coming soon)*

---

## Best Practices

### ✅ Do

**Use semantic colors:**
```html
<k-button v="filled success">Save</k-button>
<k-button v="outlined error">Delete</k-button>
```

**Combine tokens for intent:**
```html
<k-button v="filled lg primary r-full">
  Primary CTA
</k-button>
```

**Use layout tokens for consistency:**
```html
<k-stack v="gap-4 p-8">
  <k-text v="h2 text-2xl semibold">Title</k-text>
  <k-text v="text-base muted">Description</k-text>
</k-stack>
```

### ❌ Don't

**Don't duplicate tokens:**
```html
<!-- Bad -->
<k-button v="filled lg md lg">Button</k-button>
```

**Don't mix inline styles:**
```html
<!-- Bad -->
<k-button v="filled lg" style="color: red;">Button</k-button>

<!-- Good -->
<k-button v="filled lg error">Button</k-button>
```

**Don't use tokens for dynamic values:**
```html
<!-- Bad -->
<k-button v="filled lg label='Dynamic'">Button</k-button>

<!-- Good -->
<k-button v="filled lg" aria-label="Dynamic">Button</k-button>
```

---

## Summary

- **131 total tokens**: 19 universal + 112 layout
- **Order-independent**: Tokens can appear in any order
- **Composable**: Mix any tokens together
- **Type-safe**: Full TypeScript support
- **CSS-based**: Uses standard data attributes
- **Framework-agnostic**: Works everywhere

---

## Next Steps

- **[Universal Tokens Reference](./universal-tokens.md)** - All 19 universal tokens
- **[Layout Tokens Reference](./layout-tokens.md)** - All 112 layout tokens
- **[The v Attribute System](../../concepts/v-attribute-system.md)** - Learn how to use tokens
- **[CSS Variables Reference](./css-variables.md)** - Customize with CSS *(Coming soon)*

---

## Need Help?

- **[GitHub Issues](https://github.com/your-repo/kenikool-ui/issues)** - Report bugs
- **[Discussions](https://github.com/your-repo/kenikool-ui/discussions)** - Ask questions
- **[Component Reference](../components/README.md)** - See tokens in action *(Coming soon)*
