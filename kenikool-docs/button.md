# 🔘 Button Component

The Button is the primary call-to-action component in Kenikool UI. It is designed to be highly flexible, supporting a wide range of visual styles (variants), sizes, and states.

## 🚀 Usage

### Vanilla JavaScript
Use the `v` attribute to control sizing, color, state, and variants.
```html
<!-- Primary Action -->
<k-button v="filled lg primary">Get Started</k-button>

<!-- Submit Button in a Form -->
<k-button v="filled md primary" type="submit">Submit Form</k-button>

<!-- Destructive Action -->
<k-button v="outlined md error">Delete Account</k-button>

<!-- Loading State (Stable Layout) -->
<k-button v="filled primary loading">Saving...</k-button>

<!-- Full-width button (with utility token) -->
<k-button v="filled lg primary w-full">Full Width</k-button>

<!-- With Icons -->
<k-button v="filled sm" icon="search">Search</k-button>
<k-button v="outlined md" iconRight="arrow-right">Next Step</k-button>

<!-- Icon Only (Perfect Circle/Square) -->
<k-button v="icon-only primary" icon="settings"></k-button>

<!-- Long Label with Truncation -->
<k-button v="filled md truncate">This is a very long button label that will truncate</k-button>
```

### React
Use explicit props for configuration.
```tsx
import { Button } from '@kenikool/ui';

<Button 
  variant="filled" 
  size="lg" 
  color="primary" 
  type="submit"
  truncate={true}
  onClick={() => console.log('Clicked!')}
>
  Get Started
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
| **State** | `loading`, `disabled`, `full` | Controls interactive state and width. |

### 2. Utility Tokens (Optional)
Buttons support optional utility tokens for custom layouts:

| Category | Tokens | Effect |
| :--- | :--- | :--- |
| **Dimensions** | `w-full`, `mw-full`, `h-auto` | Width/height control |
| **Borders** | `bdr`, `bdr-none` | Border styling |
| **Shadows** | `shd-sm`, `shd-md`, `shd-lg`, `shd-xl` | Shadow depth |
| **Text Align** | `txt-left`, `txt-center`, `txt-right` | Text alignment |
| **Cursor** | `cur-ptr`, `cur-def`, `cur-not` | Pointer appearance |

**Example with utility tokens:**
```html
<k-button v="filled lg primary w-full bdr shd-md txt-center">Custom Button</k-button>
```

### 3. Button Variants
- `filled`: Solid background with contrasting text (Default).
- `outlined`: Transparent background with a colored border.
- `ghost`: No background or border; text color only.
- `soft`: Subtle background tint.
- `subtle`: Very light background.
- `gradient`: Colorful gradient background.
- `glow`: Outer glow effect.
- `minimal`: Extremely stripped down.
- `elevated`: Box shadow for depth.
- `destructive`: Specialized high-contrast error styling.
- `icon-only`: Forces the button to be a perfect circle/square, removing text padding.

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

### 📱 Responsive Mode
If the button contains an icon (via attribute or slot), it automatically enters **Responsive Mode** (`data-responsive="true"`). In this mode, the button can be styled to shrink to an icon-only view on smaller screens while maintaining its accessible label via the `title` attribute.

---

## ♿ Accessibility & Security (A11y)
The Button component is built with "Security and Accessibility by Default":
- **Native Keyboard Support**: Supports `Enter` and `Space` keys natively.
- **Accessible Name**: Uses the `label` attribute if provided; otherwise, it derives the name from the inner text content.
- **ARIA States**: Dynamically updates `aria-busy` and `aria-disabled`.
- **XSS Prevention**: All user-provided labels are processed through `sanitizeText`.
- **Semantic HTML**: Renders as a native `<button>` element to ensure correct browser behavior.

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
