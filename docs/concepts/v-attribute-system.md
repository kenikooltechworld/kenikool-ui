# The v Attribute System

Learn how to style components with the `v` attribute.

---

## What is the `v` Attribute?

The `v` attribute is how you style components in Kenikool UI. Instead of multiple props or classes, you use one attribute with space-separated tokens:

```html
<k-button v="filled lg primary r-full">
  Click me
</k-button>
```

### Benefits

1. **Concise** - One attribute instead of many props
2. **Order-independent** - Write tokens in any order
3. **Composable** - Combine any tokens together
4. **Framework-agnostic** - Works everywhere (HTML, React, Vue, Svelte, Angular)
5. **Easy to read** - See all styling at a glance

---

## How to Use It

The `v` attribute accepts space-separated tokens. Each token controls a different aspect:

```html
<k-button v="filled lg primary r-full loading">
  ↑        ↑    ↑  ↑       ↑       ↑
  │        │    │  │       │       └─ State: loading
  │        │    │  │       └───────── Radius: full (pill shape)
  │        │    │  └───────────────── Color: primary
  │        │    └──────────────────── Size: large
  │        └───────────────────────── Variant: filled
  └────────────────────────────────── Component name
</k-button>
```

---

## Token Categories

### 1. Universal Tokens (Work on ALL components)

#### Variant
The visual style of the component. Each component defines its own variants.

```html
<!-- Buttons -->
<k-button v="filled">Filled</k-button>
<k-button v="outlined">Outlined</k-button>
<k-button v="ghost">Ghost</k-button>

<!-- Images -->
<k-image v="hero" src="banner.jpg"></k-image>
<k-image v="avatar" src="profile.jpg"></k-image>
<k-image v="thumbnail" src="thumb.jpg"></k-image>
```

#### Size
Controls component dimensions and internal spacing.

```html
<k-button v="filled xs">Extra Small</k-button>
<k-button v="filled sm">Small</k-button>
<k-button v="filled md">Medium</k-button>
<k-button v="filled lg">Large</k-button>
<k-button v="filled xl">Extra Large</k-button>
```

**Values**: `xs`, `sm`, `md`, `lg`, `xl`  
**Default**: `md`

#### Color
The color scheme for the component.

```html
<k-button v="filled primary">Primary</k-button>
<k-button v="filled success">Success</k-button>
<k-button v="filled warning">Warning</k-button>
<k-button v="filled error">Error</k-button>
<k-button v="filled info">Info</k-button>
<k-button v="filled default">Default</k-button>
```

**Values**: `primary`, `success`, `warning`, `error`, `info`, `default`  
**Default**: `primary`

#### Radius
Border radius of the component.

```html
<k-button v="filled r-none">Sharp</k-button>
<k-button v="filled r-sm">Small Radius</k-button>
<k-button v="filled r-md">Medium Radius</k-button>
<k-button v="filled r-lg">Large Radius</k-button>
<k-button v="filled r-full">Pill</k-button>
```

**Values**: `r-none`, `r-sm`, `r-md`, `r-lg`, `r-full`  
**Default**: Component-specific

**Note**: Radius tokens use the `r-` prefix to avoid collision with variant names.

#### State Flags
Boolean states that modify behavior or appearance.

```html
<!-- Loading -->
<k-button v="filled loading">Processing...</k-button>

<!-- Disabled -->
<k-button v="filled disabled">Disabled</k-button>

<!-- Full width -->
<k-button v="filled full">Full Width Button</k-button>
```

**Values**: `loading`, `disabled`, `full`

---

### 2. Layout Tokens (Layout components only)

These work on `k-grid`, `k-row`, `k-col`, `k-stack`, `k-box`, `k-text`, etc.

#### Grid Columns
```html
<k-grid v="cols-3 gap-4">
  <!-- 3 columns with 16px gap -->
</k-grid>

<k-grid v="cols-auto gap-6">
  <!-- Auto-fit columns -->
</k-grid>
```

**Values**: `cols-auto`, `cols-1` through `cols-12`

#### Column Span
```html
<k-col v="span-6">Half width</k-col>
<k-col v="span-full">Full width</k-col>
```

**Values**: `span-full`, `span-1` through `span-12`

#### Gap (Spacing)
```html
<k-stack v="gap-2">Tight spacing (8px)</k-stack>
<k-stack v="gap-4">Default spacing (16px)</k-stack>
<k-stack v="gap-8">Wide spacing (32px)</k-stack>
```

**Values**: `gap-0` through `gap-24` (maps to `--k-space-*` tokens)

#### Padding
```html
<k-box v="p-4">16px padding</k-box>
<k-box v="p-8">32px padding</k-box>
```

**Values**: `p-0` through `p-24` (maps to `--k-space-*` tokens)

#### Alignment
```html
<k-row v="align-center">Vertically centered</k-row>
<k-row v="align-start">Top aligned</k-row>
<k-row v="align-end">Bottom aligned</k-row>
```

**Values**: `align-start`, `align-center`, `align-end`, `align-stretch`, `align-baseline`

#### Justify
```html
<k-row v="justify-between">Space between items</k-row>
<k-row v="justify-center">Center items</k-row>
<k-row v="justify-end">Right-aligned items</k-row>
```

**Values**: `justify-start`, `justify-center`, `justify-end`, `justify-between`, `justify-around`, `justify-evenly`

#### Typography
```html
<k-text v="text-2xl semibold h2">Large Heading</k-text>
<k-text v="text-base normal p">Body text</k-text>
<k-text v="text-sm muted code">Code snippet</k-text>
```

**Text sizes**: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`  
**Font weights**: `normal`, `medium`, `semibold`, `bold`  
**Semantic elements**: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `span`, `label`, `code`, `pre`

**→** [Complete layout tokens reference](../reference/tokens/layout-tokens.md)

---

## Token Rules

### Order Doesn't Matter

Write tokens in any order:

```html
<!-- All of these produce the same result: -->
<k-button v="filled lg primary">Click</k-button>
<k-button v="lg primary filled">Click</k-button>
<k-button v="primary filled lg">Click</k-button>
```

### Multiple Tokens of Same Type

If you use multiple tokens of the same type, the last one wins:

```html
<!-- Shows "lg" size (last one) -->
<k-button v="sm md lg">Button</k-button>

<!-- Shows "error" color (last one) -->
<k-button v="primary success error">Button</k-button>
```

### State Flags Can Combine

State tokens (loading, disabled, full) can all be used together:

```html
<!-- This button is loading, disabled, AND full-width -->
<k-button v="filled loading disabled full">
  Processing...
</k-button>
```

### Custom Variants

Components can have custom variants beyond the standard tokens:

```html
<!-- "gradient" is a custom Button variant -->
<k-button v="gradient lg primary">
  Gradient Button
</k-button>

<!-- "hero" is a custom Image variant -->
<k-image v="hero" src="banner.jpg"></k-image>
```

---

## Changing Tokens Dynamically

### With JavaScript

Update tokens by changing the `v` attribute:

```javascript
const button = document.querySelector('k-button');

// Change the entire v attribute
button.setAttribute('v', 'outlined md success');

// Read current v attribute
const currentTokens = button.getAttribute('v');
console.log(currentTokens); // "outlined md success"
```

### Loading States Example

```javascript
const button = document.querySelector('#submit');

button.addEventListener('click', async () => {
  // Add loading state
  button.setAttribute('v', 'filled lg primary loading');
  
  // Simulate API call
  await fetch('/api/submit');
  
  // Remove loading state
  button.setAttribute('v', 'filled lg success');
});
```

---

## React Integration

In React, you can use either the `v` attribute or individual props:

### Using `v` Attribute (Recommended)

```tsx
<Button v="filled lg primary r-full loading">
  Click me
</Button>
```

### Using Individual Props

```tsx
<Button 
  variant="filled" 
  size="lg" 
  color="primary" 
  radius="full" 
  loading
>
  Click me
</Button>
```

Both produce the same result. The `v` attribute is more concise, but props offer better TypeScript IntelliSense.

---

## Best Practices

### ✅ Do

**Be explicit about intent:**
```html
<k-button v="filled lg primary">Save Changes</k-button>
```

**Use semantic colors:**
```html
<k-button v="filled success">Confirm</k-button>
<k-button v="outlined error">Delete</k-button>
```

**Combine with custom classes when needed:**
```html
<k-button v="filled lg" class="my-custom-animation">
  Animated Button
</k-button>
```

### ❌ Don't

**Don't duplicate tokens:**
```html
<!-- Bad: "lg" appears twice -->
<k-button v="filled lg md lg">Button</k-button>
```

**Don't mix conflicting states:**
```html
<!-- Bad: Can't be both loading and disabled conceptually -->
<k-button v="filled loading disabled">Button</k-button>
<!-- Use only one state at a time for clarity -->
```

**Don't use `v` for dynamic values:**
```html
<!-- Bad: Use regular attributes for dynamic content -->
<k-button v="filled lg primary label='Click me'">Button</k-button>

<!-- Good: Use proper attributes -->
<k-button v="filled lg primary" aria-label="Click me">Button</k-button>
```

---

## Custom Variants

Components can define custom variants that extend the standard tokens:

```html
<!-- Button custom variants -->
<k-button v="gradient lg">Gradient</k-button>
<k-button v="glow lg">Glow Effect</k-button>

<!-- Image custom variants -->
<k-image v="hero" src="banner.jpg"></k-image>
<k-image v="gallery" src="photo.jpg"></k-image>

<!-- Tabs custom variants -->
<k-tabs v="pills">...</k-tabs>
<k-tabs v="underline">...</k-tabs>
```

Each component's documentation lists its available variants.

---

## Summary

The `v` attribute gives you:

- ✅ **131 tokens** to style components
- ✅ **Order-independent** - write tokens in any order
- ✅ **Composable** - combine any tokens
- ✅ **Framework-agnostic** - works with any framework
- ✅ **Easy to change** - update with JavaScript
- ✅ **Custom variants** - components can add their own variants

---

## Next Steps

- **[Universal Tokens Reference](../reference/tokens/universal-tokens.md)** - All 19 universal tokens
- **[Layout Tokens Reference](../reference/tokens/layout-tokens.md)** - All 112 layout tokens
- **[Component Reference](../reference/components/README.md)** - See components *(Coming soon)*
