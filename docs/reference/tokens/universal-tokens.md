# Universal Tokens Reference

Complete reference for the 19 universal tokens that work on **all components** in Kenikool UI.

---

## Overview

Universal tokens control fundamental aspects of components:
- **Size** (5 tokens) - Component dimensions and spacing
- **Color** (6 tokens) - Color schemes
- **Radius** (5 tokens) - Border radius
- **State** (3 tokens) - Boolean state flags

---

## Size Tokens (5)

Control component dimensions and internal spacing.

### Values

| Token | Visual Size | Pixels (approx) | Use Case |
|-------|-------------|-----------------|----------|
| `xs` | Extra Small | ~24-28px height | Dense UI, compact tables, tags |
| `sm` | Small | ~32-36px height | Secondary actions, compact forms |
| `md` | Medium | ~40-44px height | Default size, primary UI |
| `lg` | Large | ~48-52px height | Prominent actions, hero sections |
| `xl` | Extra Large | ~56-64px height | Hero CTAs, large touch targets |

**Default**: `md`

### Examples

#### Buttons
```html
<k-button v="filled xs">Extra Small</k-button>
<k-button v="filled sm">Small</k-button>
<k-button v="filled md">Medium</k-button>
<k-button v="filled lg">Large</k-button>
<k-button v="filled xl">Extra Large</k-button>
```

**→** [See live demo](http://localhost:3001/playground.html#buttons)

#### Inputs
```html
<k-input v="outlined xs" placeholder="Extra small input"></k-input>
<k-input v="outlined sm" placeholder="Small input"></k-input>
<k-input v="outlined md" placeholder="Medium input"></k-input>
<k-input v="outlined lg" placeholder="Large input"></k-input>
<k-input v="outlined xl" placeholder="Extra large input"></k-input>
```

#### Badges
```html
<k-badge v="filled xs" count="9">XS</k-badge>
<k-badge v="filled sm" count="99">SM</k-badge>
<k-badge v="filled md" count="999">MD</k-badge>
<k-badge v="filled lg" count="9999">LG</k-badge>
<k-badge v="filled xl" count="99999">XL</k-badge>
```

### Size Scale Mapping

Size tokens map to internal spacing and typography:

| Token | Padding | Font Size | Icon Size |
|-------|---------|-----------|-----------|
| `xs` | `--k-space-1` × `--k-space-2` | `--k-text-xs` | `--k-icon-xs` (12px) |
| `sm` | `--k-space-1-5` × `--k-space-3` | `--k-text-sm` | `--k-icon-sm` (16px) |
| `md` | `--k-space-2` × `--k-space-4` | `--k-text-base` | `--k-icon-md` (20px) |
| `lg` | `--k-space-3` × `--k-space-6` | `--k-text-lg` | `--k-icon-lg` (24px) |
| `xl` | `--k-space-4` × `--k-space-8` | `--k-text-xl` | `--k-icon-xl` (32px) |

### Best Practices

✅ **Do:**
- Use `md` for primary actions
- Use `lg` for hero CTAs and primary buttons
- Use `sm` for secondary/tertiary actions
- Use `xs` for compact UI like tables and tags

❌ **Don't:**
- Mix multiple sizes in the same action group
- Use `xl` for standard UI (reserve for hero sections)
- Use `xs` for primary CTAs (poor accessibility)

---

## Color Tokens (6)

Control the color scheme of components.

### Values

| Token | Semantic Meaning | CSS Variable | Common Use |
|-------|------------------|--------------|------------|
| `primary` | Primary brand action | `--k-accent` | Main CTAs, links, focus |
| `success` | Positive action/state | `--k-success` | Confirmations, success messages |
| `warning` | Caution/attention | `--k-warning` | Warnings, pending states |
| `error` | Destructive action/error | `--k-error` | Delete, errors, validation |
| `info` | Informational | `--k-info` | Help, tips, neutral info |
| `default` | Neutral/secondary | `--k-text-secondary` | Secondary actions |

**Default**: `primary`

### Examples

#### Buttons
```html
<k-button v="filled primary">Primary Action</k-button>
<k-button v="filled success">Confirm</k-button>
<k-button v="filled warning">Warning</k-button>
<k-button v="filled error">Delete</k-button>
<k-button v="filled info">Info</k-button>
<k-button v="filled default">Default</k-button>
```

**→** [See live demo](http://localhost:3001/playground.html#buttons)

#### Badges
```html
<k-badge v="filled primary" count="5">Primary</k-badge>
<k-badge v="filled success" count="10">Success</k-badge>
<k-badge v="filled warning" count="3">Warning</k-badge>
<k-badge v="filled error" count="8">Error</k-badge>
<k-badge v="filled info" count="15">Info</k-badge>
```

#### Toast Notifications
```html
<k-toast v="success">Changes saved successfully</k-toast>
<k-toast v="warning">Please review your input</k-toast>
<k-toast v="error">Failed to save changes</k-toast>
<k-toast v="info">Your session expires in 5 minutes</k-toast>
```

### Color Behavior by Variant

Different variants use color tokens differently:

| Variant | Color Application |
|---------|-------------------|
| `filled` | Background + white text |
| `outlined` | Border + text color |
| `ghost` | Text color only |
| `soft` | Subtle background tint + text |
| `subtle` | Very light background + text |

**Example:**
```html
<!-- Primary color behaves differently per variant -->
<k-button v="filled primary">Filled</k-button>     <!-- Blue background -->
<k-button v="outlined primary">Outlined</k-button> <!-- Blue border + text -->
<k-button v="ghost primary">Ghost</k-button>       <!-- Blue text only -->
```

### Best Practices

✅ **Do:**
- Use `success` for confirmations and positive actions
- Use `error` for destructive actions (delete, remove)
- Use `warning` for actions requiring caution
- Use `primary` for main CTAs

❌ **Don't:**
- Use `error` color for non-destructive actions
- Use `success` for neutral actions
- Override semantic colors without good reason

---

## Radius Tokens (5)

Control border radius of components.

### Values

| Token | CSS Output | Radius | Use Case |
|-------|------------|--------|----------|
| `r-none` | `--k-radius-none` (0px) | Sharp corners | Technical/data displays |
| `r-sm` | `--k-radius-sm` (4px) | Subtle rounding | Compact UI, tags |
| `r-md` | `--k-radius-md` (8px) | Standard rounding | Default for most components |
| `r-lg` | `--k-radius-lg` (12px) | Prominent rounding | Cards, containers |
| `r-full` | `--k-radius-full` (9999px) | Pill shape | Pills, badges, avatars |

**Default**: Component-specific (usually `r-md`)

**Note**: Radius tokens use the `r-` prefix to avoid collision with variant names.

### Examples

#### Buttons
```html
<k-button v="filled r-none">Sharp</k-button>
<k-button v="filled r-sm">Small Radius</k-button>
<k-button v="filled r-md">Medium Radius</k-button>
<k-button v="filled r-lg">Large Radius</k-button>
<k-button v="filled r-full">Pill Button</k-button>
```

**→** [See live demo](http://localhost:3001/playground.html#buttons)

#### Cards
```html
<k-box v="surface p-6 r-none">Sharp card</k-box>
<k-box v="surface p-6 r-sm">Small radius card</k-box>
<k-box v="surface p-6 r-md">Medium radius card</k-box>
<k-box v="surface p-6 r-lg">Large radius card</k-box>
```

#### Images
```html
<k-image v="basic r-none" src="image.jpg"></k-image>
<k-image v="basic r-md" src="image.jpg"></k-image>
<k-image v="basic r-lg" src="image.jpg"></k-image>
<k-image v="basic r-full" src="image.jpg"></k-image> <!-- Circle -->
```

### Best Practices

✅ **Do:**
- Use `r-md` for most components (standard)
- Use `r-full` for pills, badges, and avatars
- Use `r-lg` for large cards and containers
- Keep radius consistent within a design system

❌ **Don't:**
- Mix multiple radius sizes within the same component group
- Use `r-full` on rectangular elements (looks odd)
- Use `r-none` unless specifically required for technical UI

---

## State Tokens (3)

Boolean flags that modify component behavior or appearance.

### loading

Indicates the component is processing an action.

**Behavior:**
- Disables interaction (pointer-events: none)
- Shows loading indicator/spinner
- Sets `aria-busy="true"`
- Maintains button/component dimensions

**Examples:**
```html
<!-- Button -->
<k-button v="filled loading">Processing...</k-button>

<!-- Input -->
<k-input v="outlined loading" placeholder="Loading..."></k-input>

<!-- Card -->
<k-card v="loading">
  <k-text>Content loading...</k-text>
</k-card>
```

**Programmatic Usage:**
```javascript
const button = document.querySelector('k-button');

// Add loading state
button.setAttribute('v', 'filled lg primary loading');

// Remove loading state
button.setAttribute('v', 'filled lg primary');
```

### disabled

Indicates the component is non-interactive.

**Behavior:**
- Disables all interaction
- Sets `aria-disabled="true"`
- Reduces opacity (50%)
- Applies grayscale filter (optional)
- Adds `not-allowed` cursor

**Examples:**
```html
<!-- Button -->
<k-button v="filled disabled">Disabled</k-button>

<!-- Input -->
<k-input v="outlined disabled" placeholder="Disabled input"></k-input>

<!-- Checkbox -->
<k-checkbox v="disabled" label="Disabled option"></k-checkbox>
```

**Important**: Disabled state prevents form submission and all events.

### full

Makes the component full-width (100%).

**Behavior:**
- Sets `width: 100%`
- Overrides default width constraints
- Useful for responsive layouts

**Examples:**
```html
<!-- Full-width button -->
<k-button v="filled full">Full Width Button</k-button>

<!-- Full-width input -->
<k-input v="outlined full" placeholder="Full width input"></k-input>

<!-- Full-width card -->
<k-card v="full">
  <k-text>Full width card</k-text>
</k-card>
```

**Responsive Usage:**
```html
<!-- Full width on mobile, auto on desktop -->
<k-button v="filled lg primary full" class="md:w-auto">
  Responsive Button
</k-button>
```

### Combining State Tokens

State tokens can be combined:

```html
<!-- Loading AND disabled -->
<k-button v="filled loading disabled">
  Cannot interact
</k-button>

<!-- Full-width AND loading -->
<k-button v="filled full loading">
  Full width processing button
</k-button>
```

**Note**: `loading` automatically implies non-interactive, so combining with `disabled` is redundant but allowed.

---

## Token Combinations

### Common Patterns

#### Primary CTA Button
```html
<k-button v="filled lg primary r-full">
  Get Started
</k-button>
```

#### Destructive Action
```html
<k-button v="outlined md error">
  Delete Account
</k-button>
```

#### Loading State
```html
<k-button v="filled lg primary loading">
  Saving...
</k-button>
```

#### Compact Success Badge
```html
<k-badge v="filled xs success" count="3">
  New
</k-badge>
```

#### Full-Width Form Button
```html
<k-button v="filled lg primary full r-md">
  Submit Form
</k-button>
```

---

## Complete Reference Table

| Category | Tokens | Count | Default | Description |
|----------|--------|-------|---------|-------------|
| **Size** | `xs`, `sm`, `md`, `lg`, `xl` | 5 | `md` | Component dimensions |
| **Color** | `primary`, `success`, `warning`, `error`, `info`, `default` | 6 | `primary` | Color scheme |
| **Radius** | `r-none`, `r-sm`, `r-md`, `r-lg`, `r-full` | 5 | varies | Border radius |
| **State** | `loading`, `disabled`, `full` | 3 | false | Boolean flags |
| **TOTAL** | - | **19** | - | Universal tokens |

---

## CSS Selectors

You can target components with specific tokens using CSS:

```css
/* Target large buttons */
k-button[data-size="lg"] {
  /* Your custom styles */
}

/* Target loading state */
[data-loading="true"] {
  /* Your custom styles */
}

/* Target filled primary buttons */
k-button[data-variant="filled"][data-color="primary"] {
  /* Your custom styles */
}
```

---

## Next Steps

- **[Layout Tokens Reference](./layout-tokens.md)** - 112 layout-specific tokens
- **[The v Attribute System](../../concepts/v-attribute-system.md)** - How to style with tokens
- **[Component Reference](../components/README.md)** - See all available components *(Coming soon)*
- **[CSS Variables](./css-variables.md)** - Customize the theme *(Coming soon)*

---

## Need Help?

- **[GitHub Issues](https://github.com/your-repo/kenikool-ui/issues)** - Report bugs
- **[Discussions](https://github.com/your-repo/kenikool-ui/discussions)** - Ask questions
- **[Playground](http://localhost:3001/playground.html)** - Try tokens live


---

## NEW: Utility Tokens (v0.1.0)

Universal utility tokens for layout control, overflow, borders, shadows, and more. These work on **all components**.

### Width Tokens (`w-*`)

Control component width.

| Token | CSS Output | Description |
|-------|------------|-------------|
| `w-full` | `width: 100%` | Full width of container |
| `w-auto` | `width: auto` | Auto width |
| `w-fit` | `width: fit-content` | Fit content width |
| `w-screen` | `width: 100vw` | Full viewport width |

**Examples:**
```html
<k-box v="w-full">100% width</k-box>
<k-box v="w-auto">Auto width</k-box>
<k-box v="w-fit">Fit content</k-box>
<k-box v="w-screen">100vw</k-box>
```

---

### Height Tokens (`h-*`)

Control component height.

| Token | CSS Output | Description |
|-------|------------|-------------|
| `h-full` | `height: 100%` | Full height of container |
| `h-auto` | `height: auto` | Auto height |
| `h-screen` | `height: 100vh` | Full viewport height |
| `h-fit` | `height: fit-content` | Fit content height |

**Examples:**
```html
<k-box v="h-full">100% height</k-box>
<k-box v="h-auto">Auto height</k-box>
<k-box v="h-screen">Full viewport height</k-box>
<k-box v="h-fit">Fit content</k-box>
```

---

### Max Width/Height Tokens (`mw-*` | `mh-*`)

Set maximum dimensions.

| Token | CSS Output | Description |
|-------|------------|-------------|
| `mw-full` | `max-width: 100%` | Max 100% width |
| `mh-full` | `max-height: 100%` | Max 100% height |
| `mh-screen` | `max-height: 100vh` | Max viewport height |

**Examples:**
```html
<k-box v="mw-full">Max width 100%</k-box>
<k-box v="mh-full">Max height 100%</k-box>
<k-box v="mh-screen">Max height 100vh</k-box>
```

---

### Min Width/Height Tokens (`mnw-*` | `mnh-*`)

Set minimum dimensions.

| Token | CSS Output | Description |
|-------|------------|-------------|
| `mnw-0` | `min-width: 0` | Min width 0 |
| `mnh-0` | `min-height: 0` | Min height 0 |
| `mnh-screen` | `min-height: 100vh` | Min viewport height |

**Examples:**
```html
<k-box v="mnw-0">Min width 0</k-box>
<k-box v="mnh-0">Min height 0</k-box>
<k-box v="mnh-screen">Min height 100vh</k-box>
```

---

### Text Align Tokens (`txt-*`)

Control text alignment.

| Token | CSS Output | Description |
|-------|------------|-------------|
| `txt-left` | `text-align: left` | Left aligned |
| `txt-center` | `text-align: center` | Center aligned |
| `txt-right` | `text-align: right` | Right aligned |
| `txt-justify` | `text-align: justify` | Justified |

**Examples:**
```html
<k-text v="txt-left">Left aligned</k-text>
<k-text v="txt-center">Center aligned</k-text>
<k-text v="txt-right">Right aligned</k-text>
<k-text v="txt-justify">Justified text</k-text>
```

---

### Overflow Tokens (`ovf-*` | `ovfy-*` | `ovfx-*`)

Control overflow behavior.

| Token | CSS Output | Description |
|-------|------------|-------------|
| `ovf-auto` | `overflow: auto` | Show scrollbar when needed (both axes) |
| `ovf-hidden` | `overflow: hidden` | Hide overflow (both axes) |
| `ovf-scroll` | `overflow: scroll` | Always show scrollbar (both axes) |
| `ovfy-auto` | `overflow-y: auto` | Vertical scroll when needed |
| `ovfy-hidden` | `overflow-y: hidden` | Hide vertical overflow |
| `ovfy-scroll` | `overflow-y: scroll` | Always show vertical scrollbar |
| `ovfx-auto` | `overflow-x: auto` | Horizontal scroll when needed |
| `ovfx-hidden` | `overflow-x: hidden` | Hide horizontal overflow |
| `ovfx-scroll` | `overflow-x: scroll` | Always show horizontal scrollbar |

**Examples:**
```html
<!-- Both axes -->
<k-box v="ovf-auto h-screen">Auto scroll</k-box>
<k-box v="ovf-hidden">Hidden</k-box>
<k-box v="ovf-scroll">Always scroll</k-box>

<!-- Vertical only -->
<k-box v="ovfy-auto h-screen">Vertical scroll</k-box>

<!-- Horizontal only -->
<k-box v="ovfx-auto w-full">Horizontal scroll</k-box>
```

---

### Border Tokens (`bdr` | `bdr-*`)

Add borders to components.

| Token | CSS Output | Description |
|-------|------------|-------------|
| `bdr` | `border: 1px solid var(--k-border)` | All sides |
| `bdr-t` | `border-top: 1px solid var(--k-border)` | Top only |
| `bdr-r` | `border-right: 1px solid var(--k-border)` | Right only |
| `bdr-b` | `border-bottom: 1px solid var(--k-border)` | Bottom only |
| `bdr-l` | `border-left: 1px solid var(--k-border)` | Left only |
| `bdr-none` | `border: none` | No border |

**Examples:**
```html
<k-box v="bdr">All sides</k-box>
<k-box v="bdr-t">Top border</k-box>
<k-box v="bdr-r">Right border</k-box>
<k-box v="bdr-b">Bottom border</k-box>
<k-box v="bdr-l">Left border</k-box>
<k-box v="bdr-none">No border</k-box>
```

**Border Color:** Uses `--k-border` theme token.

---

### Shadow Tokens (`shd-*`)

Add box shadows for depth.

| Token | CSS Output | Description |
|-------|------------|-------------|
| `shd-sm` | `box-shadow: var(--k-shadow-sm)` | Small shadow |
| `shd-md` | `box-shadow: var(--k-shadow-md)` | Medium shadow |
| `shd-lg` | `box-shadow: var(--k-shadow-lg)` | Large shadow |
| `shd-xl` | `box-shadow: var(--k-shadow-xl)` | Extra large shadow |
| `shd-none` | `box-shadow: none` | No shadow |

**Examples:**
```html
<k-box v="shd-sm">Small shadow</k-box>
<k-box v="shd-md">Medium shadow</k-box>
<k-box v="shd-lg">Large shadow</k-box>
<k-box v="shd-xl">Extra large shadow</k-box>
<k-box v="shd-none">No shadow</k-box>
```

---

### Display Tokens (`d-*`)

Control CSS display property.

| Token | CSS Output | Description |
|-------|------------|-------------|
| `d-block` | `display: block` | Block display |
| `d-inline` | `display: inline` | Inline display |
| `d-flex` | `display: flex` | Flex display |
| `d-grid` | `display: grid` | Grid display |
| `d-none` | `display: none` | Hidden |

**Examples:**
```html
<k-box v="d-block">Block</k-box>
<k-box v="d-inline">Inline</k-box>
<k-box v="d-flex">Flex</k-box>
<k-box v="d-grid">Grid</k-box>
<k-box v="d-none">Hidden</k-box>
```

---

### Cursor Tokens (`cur-*`)

Control cursor appearance.

| Token | CSS Output | Description |
|-------|------------|-------------|
| `cur-ptr` | `cursor: pointer` | Pointer (clickable) |
| `cur-def` | `cursor: default` | Default cursor |
| `cur-not` | `cursor: not-allowed` | Not allowed |

**Examples:**
```html
<k-box v="cur-ptr">Pointer cursor</k-box>
<k-box v="cur-def">Default cursor</k-box>
<k-box v="cur-not">Not allowed</k-box>
```

---

### Utility Token Combinations

You can combine utility tokens with any other tokens:

```html
<!-- Full-screen scrollable container with border -->
<k-col v="h-screen ovfy-auto bdr-r span-3">
  <k-stack v="gap-6 p-6">
    <!-- Sidebar content -->
  </k-stack>
</k-col>

<!-- Centered box with shadow and rounded corners -->
<k-box v="w-full mw-full p-6 r-md bdr shd-md txt-center">
  <k-text v="text-2xl bold">Welcome</k-text>
</k-box>

<!-- Full viewport height with hidden overflow -->
<k-grid v="cols-12 gap-0 h-screen ovf-hidden">
  <!-- Content -->
</k-grid>
```

---

## Updated Token Count

| Category | Tokens | Count | Default | Description |
|----------|--------|-------|---------|-------------|
| **Size** | `xs`, `sm`, `md`, `lg`, `xl` | 5 | `md` | Component dimensions |
| **Color** | `primary`, `success`, `warning`, `error`, `info`, `default` | 6 | `primary` | Color scheme |
| **Radius** | `r-none`, `r-sm`, `r-md`, `r-lg`, `r-full` | 5 | varies | Border radius |
| **State** | `loading`, `disabled`, `full` | 3 | false | Boolean flags |
| **Width** | `w-full`, `w-auto`, `w-fit`, `w-screen` | 4 | - | Width control |
| **Height** | `h-full`, `h-auto`, `h-screen`, `h-fit` | 4 | - | Height control |
| **Max Size** | `mw-full`, `mh-full`, `mh-screen` | 3 | - | Max dimensions |
| **Min Size** | `mnw-0`, `mnh-0`, `mnh-screen` | 3 | - | Min dimensions |
| **Text Align** | `txt-left`, `txt-center`, `txt-right`, `txt-justify` | 4 | - | Text alignment |
| **Overflow** | `ovf-*`, `ovfy-*`, `ovfx-*` (3×3) | 9 | - | Overflow behavior |
| **Border** | `bdr`, `bdr-t`, `bdr-r`, `bdr-b`, `bdr-l`, `bdr-none` | 6 | - | Border control |
| **Shadow** | `shd-sm`, `shd-md`, `shd-lg`, `shd-xl`, `shd-none` | 5 | - | Box shadows |
| **Display** | `d-block`, `d-inline`, `d-flex`, `d-grid`, `d-none` | 5 | - | Display property |
| **Cursor** | `cur-ptr`, `cur-def`, `cur-not` | 3 | - | Cursor appearance |
| **TOTAL** | - | **65** | - | Universal tokens |
