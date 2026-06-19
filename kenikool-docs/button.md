# 🔘 Button Component

The Button is the primary call-to-action component in Kenikool UI. It is designed to be highly flexible, supporting a wide range of visual styles (variants), sizes, and states. Users can customize buttons with component tokens (variant, size, color, state) and universal utility tokens (width, height, shadows, borders, alignment, cursor).

---

## 🚀 Basic Usage (No Tokens)

### Vanilla JavaScript
Default button with sensible defaults: `filled` variant, `md` size, `primary` color.

```html
<!-- Just the text — uses all defaults -->
<k-button>Click Me</k-button>

<!-- With type attribute for form submission -->
<k-button type="submit">Submit</k-button>

<!-- Reset button -->
<k-button type="reset">Clear</k-button>
```

### React
```tsx
import { Button } from '@kenikool/ui';

// Default button with sensible defaults
<Button>Click Me</Button>

// Form submission
<Button type="submit">Submit</Button>

// Reset
<Button type="reset">Clear</Button>
```

---

## 📋 Complete Token Usage Guide

This section shows how to combine tokens to create any button variant. **Tokens are composable** — you can mix and match them. Order doesn't matter in the `v` attribute.

### 🎯 Target Selectors (`.class` and `#id`)

The `v` attribute supports CSS selectors for automatic DOM placement and CSS class/ID assignment.

**Vanilla:**
```html
<!-- Add a CSS class to the button -->
<k-button v="filled .primary-action">Submit</k-button>
<!-- Result: <k-button class="primary-action" data-variant="filled">Submit</k-button> -->

<!-- Add an ID to the button -->
<k-button v="filled #submit-btn">Submit</k-button>
<!-- Result: <k-button id="submit-btn" data-variant="filled">Submit</k-button> -->

<!-- Mount button inside a specific container -->
<k-button v="filled .toolbar">Add</k-button>
<!-- Button moves itself into the element with class="toolbar" -->

<!-- Combine class, id, and variant tokens -->
<k-button v="gradient lg .hero-cta #main-action">Get Started</k-button>
```

**React:** CSS classes and IDs work through standard React props:
```tsx
<Button variant="filled" className="primary-action">Submit</Button>
<Button variant="filled" id="submit-btn">Submit</Button>
```

### 1️⃣ Variants

The button appearance: `filled`, `outlined`, `ghost`, `soft`, `subtle`, `gradient`, `glow`, `minimal`, `elevated`, `destructive`, `icon-only`.

**Vanilla:**
```html
<!-- Solid background (default) -->
<k-button v="filled">Filled</k-button>

<!-- Border only -->
<k-button v="outlined">Outlined</k-button>

<!-- Text only -->
<k-button v="ghost">Ghost</k-button>

<!-- Subtle background tint -->
<k-button v="subtle">Subtle</k-button>

<!-- Soft with backdrop blur -->
<k-button v="soft">Soft</k-button>

<!-- Gradient background -->
<k-button v="gradient">Gradient</k-button>

<!-- Glow effect -->
<k-button v="glow">Glow</k-button>

<!-- Text with underline on hover -->
<k-button v="minimal">Minimal</k-button>

<!-- Elevated with shadow -->
<k-button v="elevated">Elevated</k-button>

<!-- High-contrast error (always red) -->
<k-button v="destructive">Delete</k-button>

<!-- Perfect circle for icons -->
<k-button v="icon-only">⚙️</k-button>
```

**React:**
```tsx
<Button variant="filled">Filled</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="subtle">Subtle</Button>
<Button variant="soft">Soft</Button>
<Button variant="gradient">Gradient</Button>
<Button variant="glow">Glow</Button>
<Button variant="minimal">Minimal</Button>
<Button variant="elevated">Elevated</Button>
<Button variant="destructive">Delete</Button>
<Button variant="icon-only">⚙️</Button>
```

### 2️⃣ Sizes

Scale from `xs` (extra small) to `xl` (extra large). Default is `md`.

**Vanilla:**
```html
<k-button v="filled xs">Extra Small</k-button>
<k-button v="filled sm">Small</k-button>
<k-button v="filled md">Medium (default)</k-button>
<k-button v="filled lg">Large</k-button>
<k-button v="filled xl">Extra Large</k-button>
```

**React:**
```tsx
<Button variant="filled" size="xs">Extra Small</Button>
<Button variant="filled" size="sm">Small</Button>
<Button variant="filled" size="md">Medium</Button>
<Button variant="filled" size="lg">Large</Button>
<Button variant="filled" size="xl">Extra Large</Button>
```

### 3️⃣ Colors

Semantic colors: `primary` (default), `success`, `warning`, `error`, `info`, `default`.

**Color behavior depends on variant:**
- `filled/gradient/glow/soft/subtle` → color changes background
- `outlined` → color changes border + text
- `ghost/minimal` → color changes text only
- `elevated/destructive` → color is ignored

**Vanilla:**
```html
<!-- Primary (brand accent) — changes background -->
<k-button v="filled primary">Primary</k-button>

<!-- Success (green) -->
<k-button v="filled success">Success</k-button>

<!-- Warning (orange) -->
<k-button v="filled warning">Warning</k-button>

<!-- Error (red) -->
<k-button v="filled error">Error</k-button>

<!-- Info (blue) -->
<k-button v="filled info">Info</k-button>

<!-- Default (neutral) -->
<k-button v="filled default">Default</k-button>

<!-- Color with outlined variant (changes border + text) -->
<k-button v="outlined success">Outlined Success</k-button>

<!-- Color with ghost variant (changes text only) -->
<k-button v="ghost warning">Ghost Warning</k-button>
```

**React:**
```tsx
<Button variant="filled" color="primary">Primary</Button>
<Button variant="filled" color="success">Success</Button>
<Button variant="filled" color="warning">Warning</Button>
<Button variant="filled" color="error">Error</Button>
<Button variant="filled" color="info">Info</Button>
<Button variant="filled" color="default">Default</Button>

<Button variant="outlined" color="success">Outlined Success</Button>
<Button variant="ghost" color="warning">Ghost Warning</Button>
```

### 4️⃣ Border Radius

Round corners: `r-none`, `r-sm`, `r-md` (default), `r-lg`, `r-full` (pill shape).

**Vanilla:**
```html
<!-- Sharp corners -->
<k-button v="filled r-none">Sharp</k-button>

<!-- Slight rounding -->
<k-button v="filled r-sm">Slight</k-button>

<!-- Standard rounding (default) -->
<k-button v="filled r-md">Standard</k-button>

<!-- More rounding -->
<k-button v="filled r-lg">Large</k-button>

<!-- Pill shape (full circle horizontally) -->
<k-button v="filled r-full">Pill</k-button>
```

**React:**
```tsx
<Button variant="filled" radius="none">Sharp</Button>
<Button variant="filled" radius="sm">Slight</Button>
<Button variant="filled" radius="md">Standard</Button>
<Button variant="filled" radius="lg">Large</Button>
<Button variant="filled" radius="full">Pill</Button>
```

### 5️⃣ States

State flags: `loading`, `disabled`, `full`.

**Vanilla:**
```html
<!-- Loading state — shows spinner, disables clicks -->
<k-button v="filled loading">Saving...</k-button>

<!-- Disabled state — grayed out, not clickable -->
<k-button v="filled disabled">Disabled</k-button>

<!-- Full width (100% of container) -->
<k-button v="filled full">Full Width</k-button>

<!-- Combine states: full-width loading button -->
<k-button v="filled full loading">Processing...</k-button>
```

**React:**
```tsx
<Button variant="filled" loading={true}>Saving...</Button>
<Button variant="filled" disabled={true}>Disabled</Button>
<Button variant="filled" full={true}>Full Width</Button>
<Button variant="filled" full={true} loading={true}>Processing...</Button>
```

### 6️⃣ Text Truncation

The `truncate` token: Truncates long labels with ellipsis, single line only.

**Vanilla:**
```html
<!-- Without truncate — text wraps -->
<k-button v="filled md mw-full">This is a very long label</k-button>

<!-- With truncate — text truncates with ellipsis -->
<k-button v="filled md truncate mw-full">This is a very long label that will be truncated</k-button>
```

**React:**
```tsx
// Without truncate — text wraps
<Button variant="filled" size="md" maxWidth="full">This is a very long label</Button>

// With truncate — text truncates with ellipsis
<Button variant="filled" size="md" truncate={true} maxWidth="full">This is a very long label that will be truncated</Button>
```

### 7️⃣ Width Utilities

Control button width: `w-full`, `w-auto`, `w-fit`, `w-screen`.

**Vanilla:**
```html
<!-- Full container width -->
<k-button v="filled w-full">Full Width</k-button>

<!-- Auto width (content-based, default) -->
<k-button v="filled w-auto">Auto</k-button>

<!-- Fit content exactly -->
<k-button v="filled w-fit">Fit Content</k-button>

<!-- Full viewport width (rare) -->
<k-button v="filled w-screen">Viewport Width</k-button>
```

**React:**
```tsx
<Button variant="filled" width="full">Full Width</Button>
<Button variant="filled" width="auto">Auto</Button>
<Button variant="filled" width="fit">Fit Content</Button>
<Button variant="filled" width="screen">Viewport Width</Button>
```

### 8️⃣ Height Utilities

Control button height: `h-full`, `h-auto`, `h-screen`, `h-fit`.

**Vanilla:**
```html
<!-- Full container height — requires parent with height -->
<k-button v="filled h-full">Full Height</k-button>

<!-- Auto height (default) -->
<k-button v="filled h-auto">Auto</k-button>

<!-- Full viewport height -->
<k-button v="filled h-screen">Viewport Height</k-button>

<!-- Fit content height -->
<k-button v="filled h-fit">Fit Content</k-button>
```

**React:**
```tsx
<Button variant="filled" height="full">Full Height</Button>
<Button variant="filled" height="auto">Auto</Button>
<Button variant="filled" height="screen">Viewport Height</Button>
<Button variant="filled" height="fit">Fit Content</Button>
```

### 9️⃣ Max/Min Size Utilities

Constrain button dimensions: `mw-full`, `mh-full`, `mh-screen`, `mnw-0`, `mnh-0`, `mnh-screen`.

**Vanilla:**
```html
<!-- Max width 100% -->
<k-button v="filled mw-full">Max Full Width</k-button>

<!-- Max height 100% -->
<k-button v="filled mh-full">Max Full Height</k-button>

<!-- Max height 100vh -->
<k-button v="filled mh-screen">Max Viewport Height</k-button>

<!-- Min width 0 (allow shrinking) -->
<k-button v="filled mnw-0">Min Width 0</k-button>

<!-- Min height 0 (allow shrinking) -->
<k-button v="filled mnh-0">Min Height 0</k-button>

<!-- Min height 100vh -->
<k-button v="filled mnh-screen">Min Viewport Height</k-button>
```

**React:**
```tsx
<Button variant="filled" maxWidth="full">Max Full Width</Button>
<Button variant="filled" maxHeight="full">Max Full Height</Button>
<Button variant="filled" maxHeight="screen">Max Viewport Height</Button>
<Button variant="filled" minWidth="0">Min Width 0</Button>
<Button variant="filled" minHeight="0">Min Height 0</Button>
<Button variant="filled" minHeight="screen">Min Viewport Height</Button>
```

### 🔟 Text Alignment Utilities

Align button text: `txt-left`, `txt-center`, `txt-right`, `txt-justify`.

**Vanilla:**
```html
<!-- Align text to left -->
<k-button v="filled txt-left w-full">Left Aligned</k-button>

<!-- Align text to center (default for buttons) -->
<k-button v="filled txt-center w-full">Centered</k-button>

<!-- Align text to right -->
<k-button v="filled txt-right w-full">Right Aligned</k-button>

<!-- Justify text -->
<k-button v="filled txt-justify w-full">Justified Text</k-button>
```

**React:**
```tsx
<Button variant="filled" textAlign="left" width="full">Left Aligned</Button>
<Button variant="filled" textAlign="center" width="full">Centered</Button>
<Button variant="filled" textAlign="right" width="full">Right Aligned</Button>
<Button variant="filled" textAlign="justify" width="full">Justified Text</Button>
```

### 1️⃣1️⃣ Border Utilities

Add or remove borders: `bdr` (all sides), `bdr-none`.

**Vanilla:**
```html
<!-- Add border on all sides -->
<k-button v="filled bdr">With Border</k-button>

<!-- Remove border (explicit) -->
<k-button v="outlined bdr-none">No Border</k-button>

<!-- Combine: filled variant with border -->
<k-button v="filled bdr shd-md">Border + Shadow</k-button>
```

**React:**
```tsx
<Button variant="filled" border="all">With Border</Button>
<Button variant="outlined" border="none">No Border</Button>
<Button variant="filled" border="all" shadow="md">Border + Shadow</Button>
```

### 1️⃣2️⃣ Shadow Utilities

Add depth with shadows: `shd-sm`, `shd-md`, `shd-lg`, `shd-xl`, `shd-none`.

**Vanilla:**
```html
<!-- Small shadow -->
<k-button v="filled shd-sm">Small Shadow</k-button>

<!-- Medium shadow (common) -->
<k-button v="filled shd-md">Medium Shadow</k-button>

<!-- Large shadow -->
<k-button v="filled shd-lg">Large Shadow</k-button>

<!-- Extra large shadow -->
<k-button v="filled shd-xl">XL Shadow</k-button>

<!-- No shadow (explicit) -->
<k-button v="elevated shd-none">No Shadow</k-button>
```

**React:**
```tsx
<Button variant="filled" shadow="sm">Small Shadow</Button>
<Button variant="filled" shadow="md">Medium Shadow</Button>
<Button variant="filled" shadow="lg">Large Shadow</Button>
<Button variant="filled" shadow="xl">XL Shadow</Button>
<Button variant="elevated" shadow="none">No Shadow</Button>
```

### 1️⃣3️⃣ Cursor Utilities

Control pointer appearance: `cur-ptr`, `cur-def`, `cur-not`.

**Vanilla:**
```html
<!-- Pointer cursor (clickable) — default for buttons -->
<k-button v="filled cur-ptr">Pointer</k-button>

<!-- Default cursor (neutral) -->
<k-button v="filled cur-def">Default Cursor</k-button>

<!-- Not-allowed cursor (disabled-like appearance) -->
<k-button v="filled cur-not">Not Allowed</k-button>
```

**React:**
```tsx
<Button variant="filled" cursor="ptr">Pointer</Button>
<Button variant="filled" cursor="def">Default Cursor</Button>
<Button variant="filled" cursor="not">Not Allowed</Button>
```

### 1️⃣4️⃣ Icons

Buttons can display content including text and emoji/icons. For icon libraries, use the `icon` and `iconRight` attributes.

**Vanilla:**
```html
<!-- Text with emoji icon -->
<k-button v="filled">🔍 Search</k-button>

<!-- Emoji icon only -->
<k-button v="icon-only">⚙️</k-button>

<!-- Text with emoji on both sides -->
<k-button v="filled">⬅️ Navigate ➡️</k-button>

<!-- With icon attributes for icon libraries -->
<k-button v="filled" icon="search">Search</k-button>
<k-button v="filled" iconRight="arrow-right">Next</k-button>
<k-button v="icon-only" icon="settings" label="Settings"></k-button>
```

**React:**
```tsx
{/* Text with icon component */}
<Button variant="filled"><SearchIcon /> Search</Button>

{/* Icon props for icon libraries */}
<Button variant="filled" icon={<SearchIcon />}>Search</Button>
<Button variant="filled" iconRight={<ArrowRight />}>Next</Button>
<Button variant="icon-only" icon={<SettingsIcon />} label="Settings" />
```

---

## 🔄 Overflow & Display Utilities

**Vanilla:**
```html
<!-- Overflow tokens (if applicable to container context) -->
<k-button v="filled ovf-hidden">Hidden Overflow</k-button>
<k-button v="filled ovf-auto">Auto Overflow</k-button>

<!-- Display tokens -->
<k-button v="filled d-block">Block Display</k-button>
<k-button v="filled d-flex">Flex Display</k-button>
<k-button v="filled d-none">Hidden</k-button>
```

**React:**
```tsx
{/* These would be passed as className or custom props if needed */}
<Button variant="filled">Button</Button>
```

---

## 🎯 Real-World Examples

Combining multiple tokens to create production-ready buttons.

### Form Submit Button
```html
<!-- Vanilla: Full-width, large, primary, with shadow -->
<k-button v="filled lg primary w-full shd-md" type="submit">Submit Form</k-button>
```

```tsx
{/* React */}
<Button variant="filled" size="lg" color="primary" width="full" shadow="md" type="submit">Submit Form</Button>
```

### Delete Confirmation Button
```html
<!-- Vanilla: Destructive variant with centered text -->
<k-button v="destructive md txt-center" type="button">Confirm Delete</k-button>
```

```tsx
{/* React */}
<Button variant="destructive" size="md" textAlign="center" type="button">Confirm Delete</Button>
```

### Icon Button
```html
<!-- Vanilla: Icon-only circle -->
<k-button v="icon-only primary">🔔</k-button>
```

```tsx
{/* React */}
<Button variant="icon-only" color="primary"><BellIcon /></Button>
```

### Floating Action Button (FAB)
```html
<!-- Vanilla: Icon-only, large, elevated, full radius -->
<k-button v="icon-only lg elevated r-full">+</k-button>
```

```tsx
{/* React */}
<Button variant="icon-only" size="lg" radius="full"><PlusIcon /></Button>
```

### Loading State with Full Width
```html
<!-- Vanilla: Full width, loading -->
<k-button v="filled primary w-full loading" disabled>Processing...</k-button>
```

```tsx
{/* React */}
<Button variant="filled" color="primary" width="full" loading={true} disabled={true}>Processing...</Button>
```

### Minimal Link-Like Button
```html
<!-- Vanilla: Minimal variant -->
<k-button v="minimal" type="button">Learn More</k-button>
```

```tsx
{/* React */}
<Button variant="minimal" type="button">Learn More</Button>
```

### Pill-Shaped CTA
```html
<!-- Vanilla: Gradient, full radius, large, shadow -->
<k-button v="gradient lg r-full shd-lg" type="button">Get Started</k-button>
```

```tsx
{/* React */}
<Button variant="gradient" size="lg" radius="full" shadow="lg" type="button">Get Started</Button>
```

### Toolbar Button (Compact)
```html
<!-- Vanilla: Small, ghost -->
<k-button v="ghost sm">✏️</k-button>
```

```tsx
{/* React */}
<Button variant="ghost" size="sm"><EditIcon /></Button>
```

### Complex Multi-Token Example
```html
<!-- Vanilla: Combining many tokens -->
<k-button v="gradient lg success r-lg w-full shd-xl txt-center cur-ptr">
  Complete Purchase
</k-button>
```

```tsx
{/* React */}
<Button 
  variant="gradient" 
  size="lg" 
  color="success" 
  radius="lg" 
  width="full" 
  shadow="xl" 
  textAlign="center"
  cursor="ptr"
>
  Complete Purchase
</Button>
```

---

## 🛠️ Configuration & Tokens

The Button utilizes the `v` attribute system. Any token placed in the `v` attribute is mapped to a `data-` attribute on the element.

### 1. Universal Tokens
| Category | Tokens | Effect |
| :--- | :--- | :--- |
| **Size** | `xs`, `sm`, `md`, `lg`, `xl` | Changes dimensions and font size. |
| **Color** | `primary`, `success`, `warning`, `error`, `info`, `default` | Applies semantic color schemes. |
| **Radius** | `r-none`, `r-sm`, `r-md`, `r-lg`, `r-full` | Controls corner rounding. |
| **State** | `loading`, `disabled`, `full`, `truncate` | Controls interactive state, width, and text overflow. |

### 2. Button Variants (All 11 Supported)

#### Variant Overview Table
| Variant | Appearance | Use Case | Color Behavior |
| :--- | :--- | :--- | :--- |
| `filled` | **Default.** Solid background with contrasting text. | Primary call-to-action, main actions. | `color` changes background; `elevated`/`destructive` ignore `color` |
| `outlined` | Transparent background with colored border + text. | Secondary actions, alternatives to filled. | `color` changes border + text color |
| `ghost` | No background or border; text color only. | Tertiary actions, minimal visual weight. | `color` changes text only |
| `soft` | Subtle background tint with backdrop blur. | Floating actions, floating menus. | `color` changes background |
| `subtle` | Very light background tint, no border. | Grouped actions, reduced emphasis. | `color` changes background |
| `gradient` | Colorful gradient background (135° angle). | Premium/marketing CTAs, hero sections. | `color` changes gradient stops |
| `glow` | Solid background with outer glow effect. | Prominent CTAs, attention-grabbing. | `color` changes both background + glow |
| `minimal` | Text-only with underline on hover. | Links, breadcrumbs, simple navigation. | `color` changes text only |
| `elevated` | Elevated box shadow for depth. | Cards, standalone contexts. | `color` **ignored** (always neutral) |
| `destructive` | High-contrast error styling (always red). | Delete, dangerous actions. | `color` **ignored** (always error color) |
| `icon-only` | Perfect circle/square for icons only. | Icon buttons, compact toolbars. | Respects `color` token like `filled` |

#### Color × Variant Interaction Matrix
Different variants apply the `color` token in different ways:

**Background-affecting variants** (`filled`, `gradient`, `glow`, `soft`, `subtle`):
- Color changes the background (and text for inverse contrast)
- Example: `v="filled error"` → red background, white text

**Border+Text variants** (`outlined`):
- Color changes both border and text color
- Example: `v="outlined warning"` → yellow border + yellow text

**Text-only variants** (`ghost`, `minimal`):
- Color changes text color only
- Example: `v="minimal success"` → green text

**Semantic variants** (`elevated`, `destructive`):
- `color` token is **completely ignored**
- `elevated` always uses neutral surface color
- `destructive` always uses error/red color

### 3. Utility Tokens (Optional)
Buttons support all universal utility tokens for custom layouts. These work in both Vanilla and React:

| Category | Tokens | Effect |
| :--- | :--- | :--- |
| **Dimensions** | `w-full`, `mw-full`, `h-auto` | Width/height control |
| **Borders** | `bdr`, `bdr-none` | Border styling |
| **Shadows** | `shd-sm`, `shd-md`, `shd-lg`, `shd-xl` | Shadow depth |
| **Text Align** | `txt-left`, `txt-center`, `txt-right` | Text alignment |
| **Cursor** | `cur-ptr`, `cur-def`, `cur-not` | Pointer appearance |
| **Text Truncate** | `truncate` | Truncate long labels with ellipsis |

**Example with utility tokens:**
```html
<!-- Vanilla: Full-width, centered, with shadow and border -->
<k-button v="filled lg primary w-full bdr shd-md txt-center">Custom Button</k-button>

<!-- Vanilla: Truncate long text -->
<k-button v="filled md truncate">This is a very long button label that will truncate</k-button>

<!-- React: Using props for utility -->
<Button variant="filled" size="lg" full={true} truncate={true}>Full Width</Button>
```

---

## 🎨 Styling & State Transitions

### Default Styling Behavior
All buttons include smooth CSS transitions for interactive states (0.15s easing). These behaviors are built-in and require no configuration.

#### Hover & Active States (per variant)

| Variant | Hover Effect | Active Effect |
| :--- | :--- | :--- |
| `filled` | Background brightens to `--k-accent-hover` | Scale 0.97 + 0.9 brightness |
| `outlined` | Background tints with `--k-accent-subtle` | Scale 0.97 + 0.9 brightness |
| `ghost` | Background tints with `--k-bg-surface` | Scale 0.97 + 0.9 brightness |
| `soft` | Brightness filter 0.88 | Scale 0.97 + 0.9 brightness |
| `subtle` | Brightness filter 0.92 | Scale 0.97 + 0.9 brightness |
| `gradient` | Gradient angle shifts from 135° to 160° | Scale 0.97 + 0.9 brightness |
| `glow` | Glow box-shadow intensifies (24px 8px) | Scale 0.97 + 0.9 brightness |
| `minimal` | Text underline appears | Scale 0.97 + 0.9 brightness |
| `elevated` | Shadow deepens from `--k-shadow-md` to `--k-shadow-lg` | Scale 0.97 + 0.9 brightness |
| `destructive` | Brightness filter 0.9 | Scale 0.97 + 0.9 brightness |

### Motion Preferences
All transitions and animations respect the user's `prefers-reduced-motion` media query:
```css
@media (prefers-reduced-motion: reduce) {
  animation: none;
  transition: none;
}
```

---

## 🧩 Advanced Features

### 🖼️ Icon Integration
Buttons support icons on both the left and right sides.
- **Left Icon**: Use the `icon` attribute or place an element in the `[slot="icon"]`.
- **Right Icon**: Use the `iconRight` attribute or place an element in the `[slot="iconRight"]`.

### 🕒 Loading State & Animations
When the `loading` token is applied:
- The content (text/icons) fades out via `.k-button__content-wrap`.
- A centered loader animation is displayed using absolute positioning to **prevent layout shift**.
- **Loader Variants**: While the button uses a default spinner, it is compatible with the library's 16+ loader animations including `spinner`, `dots`, `pulse`, `bars`, `ring`, `ripple`, `bounce`, `wave`, `skeleton`, `shimmer`, `progress`, `flip`, `orbit`, `squeeze`, `beat`, and `crescent`.
- The component is set to `aria-busy="true"`.
- All click interactions are blocked.

### 🚫 Disabled State
When the `disabled` token is applied:
- The native `disabled` property is set.
- `aria-disabled="true"` is applied.
- The element is removed from the tab order (`tabindex="-1"`).
- Pointer events are disabled.

### 🎨 Text Truncation
When the `truncate` token is applied:
- Long text labels are truncated with an ellipsis (`…`)
- Single-line overflow is prevented via `white-space: nowrap`
- The native `title` attribute on the button provides the full text as a tooltip on hover

**Works in both Vanilla and React:**
```html
<!-- Vanilla -->
<k-button v="filled md truncate">This is a very long button label that will be truncated with an ellipsis</k-button>

<!-- React -->
<Button variant="filled" size="md" truncate={true}>This is a very long button label that will be truncated with an ellipsis</Button>
```

### 📱 Responsive Mode
If the button contains an icon (via attribute or slot), it automatically enters **Responsive Mode** (`data-responsive="true"`). In this mode:
- On screens ≤ 640px width, the button text is hidden and only the icon is shown
- Button size locks to `40px × 40px` to maintain touch-friendly target size
- The `title` attribute on the button element provides the label text as a tooltip
- **Works seamlessly with all other tokens** (loading, disabled, truncate, etc.)

**Responsive Mode is automatic — no additional configuration needed.** Simply include an icon and the button responds appropriately on mobile.

---

## ♿ Accessibility & Security (A11y)
The Button component is built with "Security and Accessibility by Default":
- **Native Keyboard Support**: Supports `Enter` and `Space` keys natively.
- **Accessible Name**: Uses the `label` attribute if provided; otherwise, it derives the name from the inner text content.
- **ARIA States**: Dynamically updates ARIA attributes based on state:
  - `aria-busy="true"` when loading (with label update: "Label — loading")
  - `aria-disabled="true"` when disabled
  - `aria-label` auto-generated from content or explicitly provided via `label` attribute
- **Focus Management**: Full keyboard navigation support with visible `:focus-visible` ring (2px outline with 2px offset)
- **XSS Prevention**: All user-provided labels are processed through `sanitizeText`.
- **Semantic HTML**: Renders as a native `<button>` element to ensure correct browser behavior.
- **Motion Accessibility**: Respects `prefers-reduced-motion` for users who need reduced animations.

## 📈 API Reference

### Attributes / Props
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `v` | `string` | `filled md primary` | Combined tokens for size, color, variant, etc. |
| `type` | `string` | `button` | The HTML button type: `button`, `submit`, or `reset`. |
| `icon` | `string \| HTMLElement` | `null` | Icon name or element for the left side. |
| `iconRight` | `string \| HTMLElement` | `null` | Icon name or element for the right side. |
| `label` | `string` | `null` | Explicit accessible label for screen readers. |
| `truncate` | `boolean` | `false` | If true, long text labels will be truncated with an ellipsis. |
| `onClick` | `function` | `null` | Event handler for the click event. |
