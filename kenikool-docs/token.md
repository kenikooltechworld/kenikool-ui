# The `v` Attribute System Reference

The `v` attribute is the central control mechanism for Kenikool UI components. It is a space-separated string that allows you to configure sizing, colors, layout, behavior, and DOM placement without writing custom CSS or JavaScript.

## ⚙️ How the `v` Attribute is Parsed
When a component renders, the `v` attribute is split by whitespace. Each segment of the string is evaluated in the following order of priority:

1.  **Selectors**: Tokens starting with `.` (Class) or `#` (ID).
2.  **Predefined Tokens**: Matching against universal and layout constants.
3.  **Prefix Patterns**: Matching prefixes like `p-`, `gap-`, `text-`, `w-`, `h-`, `ovf-`, etc.
4.  **Variants**: Any remaining unmatched strings are treated as a **Variant**. If multiple variants are provided, the **last one** in the string is applied as the primary variant.

**Zero Config Design**: All components come with sensible defaults. Tokens are **optional customization layers** — use only what you need.

---

## 🎯 DOM & Placement (High Priority)
These tokens modify the element itself or its position in the DOM.

| Syntax | Example | Effect | Technical Action |
| :--- | :--- | :--- | :--- |
| **`.className`** | `v=".hero"` | Adds a CSS class to the host. | `classList.add('hero')` |
| **`#idName`** | `v="#cta"` | Sets the element's unique ID. | `element.id = 'cta'` |
| **Teleport** | `v="#app"` | Moves the component inside the element with ID `#app`. | `document.getElementById('app').appendChild(...)` |

---

## 🌐 Universal Tokens
Standard tokens that work across almost all components.

### 📏 Sizing (`data-size`)
| Token | Visual Scale | Use Case |
| :--- | :--- | :--- |
| `xs` | Extra Small | Dense UIs, compact tables, tags |
| `sm` | Small | Secondary actions, compact forms |
| `md` | Medium | **Default**. Standard primary UI |
| `lg` | Large | Prominent actions, hero sections |
| `xl` | Extra Large | High-impact CTAs, large touch targets |

### 🌈 Semantic Color (`data-color`)
| Token | Semantic Meaning | Typical Use |
| :--- | :--- | :--- |
| `primary` | Brand Accent | Main CTAs, active states |
| `success` | Positive | Success messages, "Complete" buttons |
| `warning` | Caution | Warning alerts, "Pending" states |
| `error` | Destructive | Delete buttons, error validation |
| `info` | Informational | Help tips, neutral notifications |
| `default` | Neutral | Secondary actions, subtle elements |

### 🔘 Border Radius (`data-radius`)
| Token | Radius | Visual Result |
| :--- | :--- | :--- |
| `r-none` | `0px` | Sharp corners |
| `r-sm` | `4px` | Subtle rounding |
| `r-md` | `8px` | **Default**. Standard rounding |
| `r-lg` | `12px` | Prominent rounding |
| `r-full` | `9999px` | Pill/Circle shape |

### ⚡ State Flags
| Token | Result | Visual Effect |
| :--- | :--- | :--- |
| `loading` | `data-loading="true"` | Disables interaction, shows loader, and centers content |
| `disabled` | `data-disabled="true"` | Non-interactive, reduced opacity, `not-allowed` cursor |
| `full` | `data-full="true"` | Forces `width: 100%` |

---

## 📐 Layout Tokens
Specifically for layout components (`<k-grid>`, `<k-row>`, `<k-stack>`, `<k-box>`, `<k-text>`).

### 🏁 Grid & Span
| Category | Tokens | Result |
| :--- | :--- | :--- |
| **Columns** | `cols-auto`, `cols-1` to `cols-12` | `data-cols="..."` |
| **Span** | `span-full`, `span-1` to `span-12` | `data-span="..."` |

### ↔️ Spacing (Gap & Padding)
Based on a 4px scale.
- **Gap (`gap-N`)**: `gap-0`, `gap-px`, `gap-0-5`, `gap-1`, `gap-1-5`, `gap-2`, `gap-2-5`, `gap-3`, `gap-3-5`, `gap-4` (Default), `gap-5`, `gap-6`, `gap-7`, `gap-8`, `gap-9`, `gap-10`, `gap-11`, `gap-12`, `gap-14`, `gap-16`, `gap-20`, `gap-24`.
- **Padding (`p-N`)**: `p-0`, `p-px`, `p-0-5`, `p-1`, `p-1-5`, `p-2`, `p-2-5`, `p-3`, `p-3-5`, `p-4` (Default), `p-5`, `p-6`, `p-7`, `p-8`, `p-9`, `p-10`, `p-11`, `p-12`, `p-14`, `p-16`, `p-20`, `p-24`.

### 🎯 Alignment & Justification
| Category | Values | Attribute |
| :--- | :--- | :--- |
| **Align** | `align-start`, `align-center`, `align-end`, `align-stretch`, `align-baseline` | `data-align` |
| **Justify** | `justify-start`, `justify-center`, `justify-end`, `justify-between`, `justify-around`, `justify-evenly` | `data-justify` |
| **Direction** | `horizontal`, `vertical` | `data-direction` |
| **Surface** | `base`, `surface` | `data-surface` |

---

## ✍️ Typography Tokens (`<k-text>`)
| Category | Tokens | Attribute |
| :--- | :--- | :--- |
| **Sizing** | `text-xs`, `text-sm`, `text-base` (Default), `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl` | `data-text-size` |
| **Weight** | `normal`, `medium`, `semibold`, `bold` | `data-weight` |
| **Element** | `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `span` (Default), `label`, `code`, `pre` | `data-as` |

---

## 🎭 Component Variants
Variants define the "visual flavor" of a component. They are applied as `data-variant="value"`.

### 📋 Exhaustive Variant List
| Component | Supported Variants |
| :--- | :--- |
| **Avatar** | `with-border`, `square`, `glow`, `gradient` |
| **Badge** | `notification`, `filled`, `outlined`, `subtle`, `dot`, `pill`, `count`, `tag`, `status`, `dismissible`, `icon-badge` |
| **Button** | `filled`, `outlined`, `ghost`, `subtle`, `soft`, `gradient`, `glow`, `minimal`, `elevated`, `destructive`, `icon-only` |
| **Card** | `default`, `elevated`, `outlined`, `filled`, `glass`, `gradient`, `interactive`, `horizontal`, `compact`, `feature`, `neon`, `neumorphic`, `glow-pulse`, `aurora`, `spotlight`, `frosted`, `hologram`, `magnetic`, `glitch`, `particle` |
| **Carousel** | `classic`, `cards`, `infinite`, `fade`, `vertical` |
| **Checkbox** | `filled`, `outlined`, `switch`, `switch-filled`, `radio`, `radio-card`, `indeterminate`, `icon-check`, `animated` |
| **Image** | `basic`, `hero`, `avatar`, `thumbnail`, `banner`, `gallery`, `responsive` |
| **Input** | `default`, `filled`, `outlined`, `underlined`, `floating-label`, `search`, `otp`, `textarea`, `with-addon` |
| **Layout** | `dense`, `responsive`, `elevated`, `overlay`, `muted`, `inverse`, `vertical`, `strong`, `full` |
| **Lightbox** | `basic`, `gallery`, `zoom`, `slideshow` |
| **Loader** | `spinner`, `dots`, `pulse`, `bars`, `ring`, `ripple`, `bounce`, `wave`, `skeleton`, `shimmer`, `progress`, `flip`, `orbit`, `squeeze`, `beat`, `crescent` |
| **Modal** | `default`, `centered`, `bottom-sheet`, `side-drawer-left`, `side-drawer-right`, `fullscreen`, `compact`, `form`, `confirm`, `media` |
| **Navbar** | `sticky`, `elevated`, `bordered`, `transparent` |
| **Select** | `default`, `filled`, `outlined`, `underlined`, `searchable`, `multi`, `grouped`, `with-icon`, `compact`, `floating-label` |
| **Tabs** | `default`, `pill`, `underlined`, `filled`, `outlined`, `glass`, `gradient`, `compact`, `vertical`, `card` |
| **Toast** | `default`, `success`, `error`, `warning`, `info`, `primary`, `dark` |
| **Tooltip** | `dark`, `primary` |
| **General** | `truncate` (Special token for handling long text overflow) |

---

## 🎨 Utility Tokens (NEW in v0.1.0)
Lightweight utility tokens for layout, spacing, overflow, borders, shadows, and display control. These work on **all components** with zero configuration — use only what you need.

### 📏 Dimension Tokens
Control width and height:

| Token | Result | Use Case |
| :--- | :--- | :--- |
| **Width** | | |
| `w-full` | `width: 100%` | Full container width |
| `w-auto` | `width: auto` | Content-based width |
| `w-fit` | `width: fit-content` | Fit content width |
| `w-screen` | `width: 100vw` | Full viewport width |
| **Height** | | |
| `h-full` | `height: 100%` | Full container height |
| `h-auto` | `height: auto` | Content-based height |
| `h-screen` | `height: 100vh` | Full viewport height |
| `h-fit` | `height: fit-content` | Fit content height |
| **Max Width** | | |
| `mw-full` | `max-width: 100%` | Max 100% width |
| **Max Height** | | |
| `mh-full` | `max-height: 100%` | Max 100% height |
| `mh-screen` | `max-height: 100vh` | Max viewport height |
| **Min Width** | | |
| `mnw-0` | `min-width: 0` | Reset min-width |
| **Min Height** | | |
| `mnh-0` | `min-height: 0` | Reset min-height |
| `mnh-screen` | `min-height: 100vh` | Min viewport height |

**Example:**
```html
<!-- Full-width container -->
<k-box v="w-full h-screen">Full viewport</k-box>

<!-- Scrollable content area -->
<k-col v="h-screen ovfy-auto">Scrollable</k-col>
```

### 🌊 Overflow Tokens
Control scrolling behavior:

| Token | Result | Axis |
| :--- | :--- | :--- |
| `ovf-auto` | `overflow: auto` | Both |
| `ovf-hidden` | `overflow: hidden` | Both |
| `ovf-scroll` | `overflow: scroll` | Both |
| `ovfy-auto` | `overflow-y: auto` | Vertical |
| `ovfy-hidden` | `overflow-y: hidden` | Vertical |
| `ovfy-scroll` | `overflow-y: scroll` | Vertical |
| `ovfx-auto` | `overflow-x: auto` | Horizontal |
| `ovfx-hidden` | `overflow-x: hidden` | Horizontal |
| `ovfx-scroll` | `overflow-x: scroll` | Horizontal |

**Example:**
```html
<!-- Sidebar with vertical scroll -->
<k-col v="h-screen ovfy-auto">
  <!-- Navigation items -->
</k-col>

<!-- Horizontal scrollable table -->
<k-box v="ovfx-auto">
  <!-- Table content -->
</k-box>
```

### 🖼️ Border & Shadow Tokens
Add borders and shadows for visual hierarchy:

| Token | Result |
| :--- | :--- |
| **Border** | |
| `bdr` | `border: 1px solid var(--k-border)` (all sides) |
| `bdr-t` | Border top only |
| `bdr-r` | Border right only |
| `bdr-b` | Border bottom only |
| `bdr-l` | Border left only |
| `bdr-none` | `border: none` |
| **Shadow** | |
| `shd-sm` | `box-shadow: var(--k-shadow-sm)` |
| `shd-md` | `box-shadow: var(--k-shadow-md)` |
| `shd-lg` | `box-shadow: var(--k-shadow-lg)` |
| `shd-xl` | `box-shadow: var(--k-shadow-xl)` |
| `shd-none` | `box-shadow: none` |

**Example:**
```html
<!-- Card with border and shadow -->
<k-box v="bdr shd-md p-4 r-md">Card content</k-box>

<!-- Sidebar with right border -->
<k-col v="span-3 bdr-r">Sidebar</k-col>
```

### 📝 Text & Display Tokens
Control text alignment and display properties:

| Category | Tokens | Result |
| :--- | :--- | :--- |
| **Text Align** | `txt-left`, `txt-center`, `txt-right`, `txt-justify` | `text-align: ...` |
| **Display** | `d-block`, `d-inline`, `d-flex`, `d-grid`, `d-none` | `display: ...` |

**Example:**
```html
<!-- Center-aligned heading -->
<k-text v="h1 txt-center">Welcome</k-text>

<!-- Hidden element -->
<k-box v="d-none">Hidden content</k-box>
```

### 🎯 Cursor Tokens
Control pointer behavior:

| Token | Result | Use Case |
| :--- | :--- | :--- |
| `cur-ptr` | `cursor: pointer` | Clickable elements |
| `cur-def` | `cursor: default` | Standard cursor |
| `cur-not` | `cursor: not-allowed` | Disabled/unavailable |

**Example:**
```html
<!-- Interactive element -->
<k-box v="cur-ptr" onClick="...">Click me</k-box>

<!-- Disabled state indicator -->
<k-box v="disabled cur-not">Unavailable</k-box>
```

### 🎯 Combining Utility Tokens
Mix and match with other tokens:

```html
<!-- Complex layout: full-width scrollable sidebar with border -->
<k-col v="span-3 h-screen ovfy-auto bdr-r">
  <k-stack v="gap-4 p-6">
    <!-- Content -->
  </k-stack>
</k-col>

<!-- Centered modal with max-height and shadow -->
<k-modal v="centered mh-screen shd-xl">
  <k-text v="txt-center">Modal content</k-text>
</k-modal>

<!-- Responsive container -->
<k-box v="w-full mw-full p-6 bdr r-md shd-md txt-center">
  <!-- Centered, responsive content -->
</k-box>
```

### 📝 Vanilla vs React Utility Token Support

**React Components**: All utility tokens work seamlessly through CSS class application. React components cascade utility token styling automatically.

**Vanilla Web Components**: Not all vanilla components support utility tokens. Utility tokens are primarily designed for **layout components** (`<k-grid>`, `<k-row>`, `<k-col>`, `<k-stack>`, `<k-box>`, `<k-text>`). 

**Supported in Vanilla:**
- `<k-grid>`, `<k-row>`, `<k-col>`, `<k-stack>` — full utility token support
- `<k-box>`, `<k-text>` — full utility token support
- `<k-button>` — selected utility tokens: `w-full`, `w-auto`, `mw-full`, `bdr`, `bdr-none`, `shd-sm/md/lg/xl`, `txt-left/center/right`, `cur-ptr/def/not`, `truncate`

**Not supported in Vanilla:**
- Interactive components (`<k-input>`, `<k-select>`, `<k-modal>`, etc.) do not parse utility tokens
- Use the `v` attribute for component-specific tokens only

---

## 🧩 Special Cases
Some components use the `v` attribute for non-styling configuration.

### 🎈 Tooltip Placement
Special tokens used to position the tooltip:
- `top`, `bottom`, `left`, `right`
- Modifiers: `-start`, `-center`, `-end` (e.g., `v="top-start"`)
- `interactive`: Allows interaction with tooltip content.

### 🍞 Toast Duration
Any numeric value in the `v` attribute is parsed as the display duration in milliseconds.
- Example: `v="success 3000"` $\rightarrow$ 3 second display.
