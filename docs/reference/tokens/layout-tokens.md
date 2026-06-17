# Layout Tokens Reference

Complete reference for the 112 layout tokens that work on layout components (`k-grid`, `k-row`, `k-col`, `k-stack`, `k-box`, `k-container`, `k-text`).

---

## Overview

Layout tokens control:
- **Grid** (13 tokens) - Column count and auto-fit
- **Span** (13 tokens) - Column span in grids
- **Gap** (24 tokens) - Spacing between items
- **Padding** (24 tokens) - Internal padding
- **Alignment** (5 tokens) - Cross-axis alignment
- **Justify** (6 tokens) - Main-axis alignment
- **Direction** (2 tokens) - Flex direction
- **Typography** (23 tokens) - Text sizing and formatting
- **Surface** (2 tokens) - Background layers

---

## Grid Tokens (13)

Control grid column count. Works on `<k-grid>`.

### Values

| Token | Columns | Description |
|-------|---------|-------------|
| `cols-auto` | Auto-fit | Responsive auto-fit based on `--k-grid-col-min` (260px) |
| `cols-1` | 1 column | Single column layout |
| `cols-2` | 2 columns | Two-column grid |
| `cols-3` | 3 columns | Three-column grid |
| `cols-4` | 4 columns | Four-column grid |
| `cols-5` | 5 columns | Five-column grid |
| `cols-6` | 6 columns | Six-column grid |
| `cols-7` | 7 columns | Seven-column grid |
| `cols-8` | 8 columns | Eight-column grid |
| `cols-9` | 9 columns | Nine-column grid |
| `cols-10` | 10 columns | Ten-column grid |
| `cols-11` | 11 columns | Eleven-column grid |
| `cols-12` | 12 columns | Twelve-column grid |

**Default**: `cols-auto`

### Examples

```html
<!-- Auto-responsive grid -->
<k-grid v="cols-auto gap-4">
  <k-box v="surface p-4">Item 1</k-box>
  <k-box v="surface p-4">Item 2</k-box>
  <k-box v="surface p-4">Item 3</k-box>
</k-grid>

<!-- 3-column grid -->
<k-grid v="cols-3 gap-6">
  <k-box v="surface p-6">Column 1</k-box>
  <k-box v="surface p-6">Column 2</k-box>
  <k-box v="surface p-6">Column 3</k-box>
</k-grid>

<!-- 12-column grid (traditional) -->
<k-grid v="cols-12 gap-4">
  <k-col v="span-8"><k-box v="surface p-4">Main (8/12)</k-box></k-col>
  <k-col v="span-4"><k-box v="surface p-4">Sidebar (4/12)</k-box></k-col>
</k-grid>
```

**→** [See live demo](http://localhost:3001/playground.html#layout)

---

## Span Tokens (13)

Control column span in grids. Works on `<k-col>` inside `<k-grid>`.

### Values

| Token | Span | Description |
|-------|------|-------------|
| `span-full` | Full width | Spans all columns |
| `span-1` | 1 column | Spans 1 column |
| `span-2` | 2 columns | Spans 2 columns |
| `span-3` | 3 columns | Spans 3 columns |
| `span-4` | 4 columns | Spans 4 columns |
| `span-5` | 5 columns | Spans 5 columns |
| `span-6` | 6 columns | Spans 6 columns (half of 12) |
| `span-7` | 7 columns | Spans 7 columns |
| `span-8` | 8 columns | Spans 8 columns (2/3 of 12) |
| `span-9` | 9 columns | Spans 9 columns (3/4 of 12) |
| `span-10` | 10 columns | Spans 10 columns |
| `span-11` | 11 columns | Spans 11 columns |
| `span-12` | 12 columns | Spans all 12 columns |

**Default**: `span-1`

### Examples

```html
<!-- Classic 2/3 + 1/3 layout -->
<k-grid v="cols-12 gap-6">
  <k-col v="span-8">
    <k-box v="surface p-6">Main content (8/12)</k-box>
  </k-col>
  <k-col v="span-4">
    <k-box v="surface p-6">Sidebar (4/12)</k-box>
  </k-col>
</k-grid>

<!-- Full-width header, then 3 columns -->
<k-grid v="cols-12 gap-4">
  <k-col v="span-full">
    <k-box v="surface p-4">Full-width header</k-box>
  </k-col>
  <k-col v="span-4"><k-box v="surface p-4">Column 1</k-box></k-col>
  <k-col v="span-4"><k-box v="surface p-4">Column 2</k-box></k-col>
  <k-col v="span-4"><k-box v="surface p-4">Column 3</k-box></k-col>
</k-grid>
```

---

## Gap Tokens (24)

Control spacing between grid/flex items. Works on `<k-grid>`, `<k-row>`, `<k-stack>`.

### Values

| Token | Pixels | CSS Variable | Use Case |
|-------|--------|--------------|----------|
| `gap-0` | 0px | `--k-space-0` | No spacing |
| `gap-px` | 1px | `--k-space-px` | Hairline spacing |
| `gap-0-5` | 2px | `--k-space-0-5` | Minimal spacing |
| `gap-1` | 4px | `--k-space-1` | Very tight |
| `gap-1-5` | 6px | `--k-space-1-5` | Tight |
| `gap-2` | 8px | `--k-space-2` | Compact |
| `gap-2-5` | 10px | `--k-space-2-5` | Compact+ |
| `gap-3` | 12px | `--k-space-3` | Small |
| `gap-3-5` | 14px | `--k-space-3-5` | Small+ |
| `gap-4` | **16px** | `--k-space-4` | **Default** |
| `gap-5` | 20px | `--k-space-5` | Medium |
| `gap-6` | 24px | `--k-space-6` | Medium+ |
| `gap-7` | 28px | `--k-space-7` | Large |
| `gap-8` | 32px | `--k-space-8` | Large+ |
| `gap-9` | 36px | `--k-space-9` | XL |
| `gap-10` | 40px | `--k-space-10` | XL+ |
| `gap-11` | 44px | `--k-space-11` | 2XL |
| `gap-12` | 48px | `--k-space-12` | 2XL+ |
| `gap-14` | 56px | `--k-space-14` | 3XL |
| `gap-16` | 64px | `--k-space-16` | 4XL |
| `gap-20` | 80px | `--k-space-20` | 5XL |
| `gap-24` | 96px | `--k-space-24` | 6XL |

**Default**: Component-specific (usually `gap-4`)

### Examples

```html
<!-- Tight spacing -->
<k-row v="gap-2">
  <k-button v="filled sm">Button 1</k-button>
  <k-button v="filled sm">Button 2</k-button>
  <k-button v="filled sm">Button 3</k-button>
</k-row>

<!-- Default spacing -->
<k-stack v="gap-4">
  <k-text v="h3">Title</k-text>
  <k-text v="text-base">Content</k-text>
</k-stack>

<!-- Wide spacing -->
<k-grid v="cols-3 gap-8">
  <k-box v="surface p-6">Item 1</k-box>
  <k-box v="surface p-6">Item 2</k-box>
  <k-box v="surface p-6">Item 3</k-box>
</k-grid>

<!-- Extra wide spacing -->
<k-stack v="gap-16">
  <k-section>Section 1</k-section>
  <k-section>Section 2</k-section>
</k-stack>
```

---

## Padding Tokens (24)

Control internal padding. Works on `<k-box>`, `<k-container>`, `<k-section>`.

### Values

Same scale as gap tokens: `p-0` through `p-24`

| Token | Pixels | CSS Variable |
|-------|--------|--------------|
| `p-0` | 0px | `--k-space-0` |
| `p-px` | 1px | `--k-space-px` |
| `p-0-5` | 2px | `--k-space-0-5` |
| `p-1` | 4px | `--k-space-1` |
| `p-1-5` | 6px | `--k-space-1-5` |
| `p-2` | 8px | `--k-space-2` |
| `p-2-5` | 10px | `--k-space-2-5` |
| `p-3` | 12px | `--k-space-3` |
| `p-3-5` | 14px | `--k-space-3-5` |
| `p-4` | **16px** | `--k-space-4` |
| `p-5` | 20px | `--k-space-5` |
| `p-6` | 24px | `--k-space-6` |
| `p-7` | 28px | `--k-space-7` |
| `p-8` | 32px | `--k-space-8` |
| `p-9` | 36px | `--k-space-9` |
| `p-10` | 40px | `--k-space-10` |
| `p-11` | 44px | `--k-space-11` |
| `p-12` | 48px | `--k-space-12` |
| `p-14` | 56px | `--k-space-14` |
| `p-16` | 64px | `--k-space-16` |
| `p-20` | 80px | `--k-space-20` |
| `p-24` | 96px | `--k-space-24` |

**Default**: Component-specific (usually `p-4`)

### Examples

```html
<!-- Compact padding -->
<k-box v="surface p-3 r-md">
  <k-text>Compact box</k-text>
</k-box>

<!-- Default padding -->
<k-box v="surface p-6 r-lg">
  <k-text>Standard box</k-text>
</k-box>

<!-- Large padding -->
<k-box v="surface p-12 r-xl">
  <k-text v="h2">Hero section</k-text>
</k-box>

<!-- Full page padding -->
<k-container v="p-8">
  <k-text>Page content</k-text>
</k-container>
```

---

## Alignment Tokens (5)

Control cross-axis alignment in flex/grid. Works on `<k-row>`, `<k-stack>`, `<k-grid>`.

### Values

| Token | CSS Value | Description |
|-------|-----------|-------------|
| `align-start` | `flex-start` / `start` | Align to start (top for rows, left for columns) |
| `align-center` | `center` | Center items on cross-axis |
| `align-end` | `flex-end` / `end` | Align to end (bottom for rows, right for columns) |
| `align-stretch` | `stretch` | Stretch items to fill container |
| `align-baseline` | `baseline` | Align text baselines |

**Default**: Component-specific

### Examples

```html
<!-- Vertically center items -->
<k-row v="gap-4 align-center">
  <k-button v="filled xs">Small</k-button>
  <k-button v="filled lg">Large</k-button>
  <k-button v="filled xl">XL</k-button>
</k-row>

<!-- Align to bottom -->
<k-row v="gap-4 align-end" style="height: 200px;">
  <k-box v="surface p-4">Aligned to bottom</k-box>
  <k-box v="surface p-6">Also bottom</k-box>
</k-row>

<!-- Stretch to full height -->
<k-row v="gap-4 align-stretch" style="height: 200px;">
  <k-box v="surface p-4">Stretched</k-box>
  <k-box v="surface p-4">Stretched</k-box>
</k-row>
```

---

## Justify Tokens (6)

Control main-axis alignment in flex/grid. Works on `<k-row>`, `<k-stack>`, `<k-grid>`.

### Values

| Token | CSS Value | Description |
|-------|-----------|-------------|
| `justify-start` | `flex-start` / `start` | Align to start |
| `justify-center` | `center` | Center items on main-axis |
| `justify-end` | `flex-end` / `end` | Align to end |
| `justify-between` | `space-between` | Space evenly with items at edges |
| `justify-around` | `space-around` | Space evenly with half-space at edges |
| `justify-evenly` | `space-evenly` | Space evenly including edges |

**Default**: Component-specific (usually `justify-start`)

### Examples

```html
<!-- Center content -->
<k-row v="gap-4 justify-center">
  <k-button v="filled">Button 1</k-button>
  <k-button v="filled">Button 2</k-button>
</k-row>

<!-- Space between (navbar pattern) -->
<k-row v="gap-4 justify-between align-center">
  <k-text v="text-lg semibold">Logo</k-text>
  <k-row v="gap-3">
    <k-button v="outlined sm">Login</k-button>
    <k-button v="filled sm">Sign Up</k-button>
  </k-row>
</k-row>

<!-- Align to end (right) -->
<k-row v="gap-3 justify-end">
  <k-button v="outlined">Cancel</k-button>
  <k-button v="filled primary">Save</k-button>
</k-row>
```

---

## Direction Tokens (2)

Control flex direction. Works on `<k-stack>`, `<k-row>`.

### Values

| Token | CSS Value | Description |
|-------|-----------|-------------|
| `horizontal` | `row` | Horizontal layout (left to right) |
| `vertical` | `column` | Vertical layout (top to bottom) |

**Default**: `<k-row>` = `horizontal`, `<k-stack>` = `vertical`

### Examples

```html
<!-- Stack (vertical by default) -->
<k-stack v="gap-4">
  <k-text>Item 1</k-text>
  <k-text>Item 2</k-text>
  <k-text>Item 3</k-text>
</k-stack>

<!-- Stack forced horizontal -->
<k-stack v="horizontal gap-4">
  <k-text>Item 1</k-text>
  <k-text>Item 2</k-text>
  <k-text>Item 3</k-text>
</k-stack>

<!-- Row (horizontal by default) -->
<k-row v="gap-4">
  <k-button>Button 1</k-button>
  <k-button>Button 2</k-button>
</k-row>

<!-- Row forced vertical -->
<k-row v="vertical gap-4">
  <k-button>Button 1</k-button>
  <k-button>Button 2</k-button>
</k-row>
```

---

## Typography Tokens (23)

Control text appearance. Works on `<k-text>`.

### Text Size Tokens (8)

| Token | CSS Variable | Font Size | Use Case |
|-------|--------------|-----------|----------|
| `text-xs` | `--k-text-xs` | ~11-12px | Captions, footnotes |
| `text-sm` | `--k-text-sm` | ~13-14px | Small text, labels |
| `text-base` | `--k-text-base` | ~14-16px | Body text (default) |
| `text-lg` | `--k-text-lg` | ~16-18px | Prominent text |
| `text-xl` | `--k-text-xl` | ~18-20px | Subheadings |
| `text-2xl` | `--k-text-2xl` | ~21-24px | Headings |
| `text-3xl` | `--k-text-3xl` | ~24-30px` | Large headings |
| `text-4xl` | `--k-text-4xl` | ~29-36px | Hero headings |

**Note**: Sizes are fluid using `clamp()` for responsive scaling.

### Font Weight Tokens (4)

| Token | CSS Variable | Font Weight | Use Case |
|-------|--------------|-------------|----------|
| `normal` | `--k-font-normal` | 400 | Body text |
| `medium` | `--k-font-medium` | 500 | Emphasized text |
| `semibold` | `--k-font-semibold` | 600 | Subheadings |
| `bold` | `--k-font-bold` | 700 | Headings, strong emphasis |

### Semantic Element Tokens (11)

| Token | HTML Element | Description |
|-------|--------------|-------------|
| `h1` | `<h1>` | Top-level heading |
| `h2` | `<h2>` | Section heading |
| `h3` | `<h3>` | Subsection heading |
| `h4` | `<h4>` | Minor heading |
| `h5` | `<h5>` | Small heading |
| `h6` | `<h6>` | Tiny heading |
| `p` | `<p>` | Paragraph |
| `span` | `<span>` | Inline text (default) |
| `label` | `<label>` | Form label |
| `code` | `<code>` | Inline code |
| `pre` | `<pre>` | Preformatted code block |

### Examples

```html
<!-- Headings -->
<k-text v="h1 text-4xl bold">Page Title</k-text>
<k-text v="h2 text-3xl semibold">Section Heading</k-text>
<k-text v="h3 text-2xl semibold">Subsection</k-text>

<!-- Body text -->
<k-text v="p text-base normal">
  This is a paragraph of body text using normal weight.
</k-text>

<!-- Emphasized text -->
<k-text v="span text-lg medium">
  Emphasized text with medium weight
</k-text>

<!-- Small text -->
<k-text v="span text-sm muted">
  Small helper text or captions
</k-text>

<!-- Code -->
<k-text v="code text-sm">const greeting = 'Hello';</k-text>
```

---

## Surface Tokens (2)

Control background layers. Works on `<k-box>`, `<k-container>`.

### Values

| Token | CSS Variable | Description |
|-------|--------------|-------------|
| `base` | `--k-bg-base` | Page background (pure white/black) |
| `surface` | `--k-bg-surface` | Component surface (off-white/dark gray) |

**Note**: `elevated` and `overlay` are handled as variants, not surface tokens, to avoid collision with button variants.

### Examples

```html
<!-- Base background -->
<k-box v="base p-8 r-lg">
  <k-text>Base background box</k-text>
</k-box>

<!-- Surface background -->
<k-box v="surface p-8 r-lg">
  <k-text>Surface background box (cards, panels)</k-text>
</k-box>

<!-- Elevated (variant, not token) -->
<k-box v="elevated p-8 r-lg">
  <k-text>Elevated box with shadow</k-text>
</k-box>
```

---

## Complete Reference Table

| Category | Tokens | Count | Components |
|----------|--------|-------|------------|
| **Grid Columns** | `cols-auto`, `cols-1` to `cols-12` | 13 | `k-grid` |
| **Column Span** | `span-full`, `span-1` to `span-12` | 13 | `k-col` |
| **Gap** | `gap-0` to `gap-24` | 24 | `k-grid`, `k-row`, `k-stack` |
| **Padding** | `p-0` to `p-24` | 24 | `k-box`, `k-container`, `k-section` |
| **Alignment** | `align-start/center/end/stretch/baseline` | 5 | `k-row`, `k-stack`, `k-grid` |
| **Justify** | `justify-start/center/end/between/around/evenly` | 6 | `k-row`, `k-stack`, `k-grid` |
| **Direction** | `horizontal`, `vertical` | 2 | `k-stack`, `k-row` |
| **Text Size** | `text-xs` to `text-4xl` | 8 | `k-text` |
| **Font Weight** | `normal/medium/semibold/bold` | 4 | `k-text` |
| **Semantic** | `h1` to `h6`, `p`, `span`, `label`, `code`, `pre` | 11 | `k-text` |
| **Surface** | `base`, `surface` | 2 | `k-box`, `k-container` |
| **TOTAL** | - | **112** | Layout components |

---

## Complete Layout Example

Here's a comprehensive example using many layout tokens:

```html
<k-container v="p-8">
  <k-stack v="gap-10">
    <!-- Header -->
    <k-row v="justify-between align-center">
      <k-text v="h1 text-3xl bold">Dashboard</k-text>
      <k-row v="gap-3">
        <k-button v="outlined sm">Settings</k-button>
        <k-button v="filled sm primary">New Project</k-button>
      </k-row>
    </k-row>
    
    <!-- Stats Grid -->
    <k-grid v="cols-4 gap-6">
      <k-box v="surface p-6 r-lg">
        <k-stack v="gap-2">
          <k-text v="text-sm muted">Total Users</k-text>
          <k-text v="text-3xl bold">12,543</k-text>
        </k-stack>
      </k-box>
      <k-box v="surface p-6 r-lg">
        <k-stack v="gap-2">
          <k-text v="text-sm muted">Revenue</k-text>
          <k-text v="text-3xl bold">$45,231</k-text>
        </k-stack>
      </k-box>
      <k-box v="surface p-6 r-lg">
        <k-stack v="gap-2">
          <k-text v="text-sm muted">Active Projects</k-text>
          <k-text v="text-3xl bold">8</k-text>
        </k-stack>
      </k-box>
      <k-box v="surface p-6 r-lg">
        <k-stack v="gap-2">
          <k-text v="text-sm muted">Team Members</k-text>
          <k-text v="text-3xl bold">24</k-text>
        </k-stack>
      </k-box>
    </k-grid>
    
    <!-- Main Content Grid -->
    <k-grid v="cols-12 gap-6">
      <!-- Main Column (8/12) -->
      <k-col v="span-8">
        <k-box v="surface p-8 r-lg">
          <k-stack v="gap-6">
            <k-text v="h2 text-2xl semibold">Recent Activity</k-text>
            <k-stack v="gap-4">
              <k-text v="text-base">Activity item 1</k-text>
              <k-text v="text-base">Activity item 2</k-text>
              <k-text v="text-base">Activity item 3</k-text>
            </k-stack>
          </k-stack>
        </k-box>
      </k-col>
      
      <!-- Sidebar (4/12) -->
      <k-col v="span-4">
        <k-box v="surface p-6 r-lg">
          <k-stack v="gap-4">
            <k-text v="h3 text-xl semibold">Quick Actions</k-text>
            <k-stack v="gap-2">
              <k-button v="outlined full">Action 1</k-button>
              <k-button v="outlined full">Action 2</k-button>
              <k-button v="outlined full">Action 3</k-button>
            </k-stack>
          </k-stack>
        </k-box>
      </k-col>
    </k-grid>
  </k-stack>
</k-container>
```

---

## Next Steps

- **[Universal Tokens Reference](./universal-tokens.md)** - 19 tokens that work on all components
- **[The v Attribute System](../../concepts/v-attribute-system.md)** - How to use the `v` attribute
- **[Layout Components](../components/layout/grid.md)** - Component docs *(Coming soon)*
- **[CSS Variables](./css-variables.md)** - Customize spacing and sizing *(Coming soon)*

---

## Need Help?

- **[GitHub Issues](https://github.com/your-repo/kenikool-ui/issues)** - Report bugs
- **[Discussions](https://github.com/your-repo/kenikool-ui/discussions)** - Ask questions
- **[Playground](http://localhost:3001/playground.html)** - Try layout tokens live
