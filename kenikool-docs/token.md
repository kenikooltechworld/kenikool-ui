# The `v` Attribute System Reference

The `v` attribute is the central control mechanism for Kenikool UI components. It is a space-separated string that allows you to configure sizing, colors, layout, behavior, and DOM placement without writing custom CSS or JavaScript.

## 🚀 How it Works
When a component is initialized, the `v` attribute is parsed. Each segment of the string is evaluated in the following order of priority:
1. **Selectors**: Tokens starting with `.` or `#`.
2. **Predefined Tokens**: Matching against universal and layout constants.
3. **Prefix Patterns**: Matching prefixes like `p-`, `gap-`, `text-`.
4. **Variants**: Any remaining unmatched strings are treated as component variants.

---

## 🎯 DOM & Placement Selectors
These tokens control where the component lives in the DOM and how it is identified.

| Syntax | Example | Effect | Result |
| :--- | :--- | :--- | :--- |
| **`.className`** | `v=".hero-section"` | Adds a CSS class to the component. | `element.classList.add('hero-section')` |
| **`#idName`** | `v="#main-cta"` | Sets the unique ID of the component. | `element.id = 'main-cta'` |
| **Targeting** | `v="#app-root"` | If an element with that ID exists, the component is moved inside it. | Teleports component to `#app-root` |

---

## 🎨 Universal Tokens
Standard tokens that work across almost all components.

### 📏 Size (`data-size`)
| Token | Effect | Use Case |
| :--- | :--- | :--- |
| `xs` | Extra Small | Dense UIs, compact tables, tags |
| `sm` | Small | Secondary actions, compact forms |
| `md` | Medium | **Default**. Standard primary UI |
| `lg` | Large | Prominent actions, hero sections |
| `xl` | Extra Large | High-impact CTAs, large touch targets |

### 🌈 Color (`data-color`)
| Token | Semantic Meaning | Typical Use |
| :--- | :--- | :--- |
| `primary` | Brand Accent | Main CTAs, active states |
| `success` | Positive/Confirmed | Success messages, "Complete" buttons |
| `warning` | Caution/Pending | Warning alerts, "Pending" states |
| `error` | Destructive/Failure | Delete buttons, error validation |
| `info` | Informational | Help tips, neutral notifications |
| `default` | Neutral/Secondary | Secondary actions, subtle elements |

### 🔘 Radius (`data-radius`)
| Token | Visual Result | Use Case |
| :--- | :--- | :--- |
| `r-none` | Sharp corners | Technical/Data displays |
| `r-sm` | Subtle rounding | Compact UI, tags |
| `r-md` | Standard rounding | **Default** for most components |
| `r-lg` | Prominent rounding | Cards, large containers |
| `r-full` | Pill shape | Badges, avatars, pill buttons |

### ⚡ State Flags
| Token | Effect | Result |
| :--- | :--- | :--- |
| `loading` | Processing state | Disables interaction, shows spinner, sets `data-loading="true"` |
| `disabled` | Non-interactive | Sets `data-disabled="true"`, reduces opacity, changes cursor |
| `full` | Full width | Sets `data-full="true"`, forces `width: 100%` |

---

## 📐 Layout Tokens
Used by layout components (`<k-grid>`, `<k-row>`, `<k-stack>`, `<k-box>`, `<k-text>`).

### 🏁 Grid & Span
- **Columns (`cols-`)**: `cols-auto` (Responsive), `cols-1` through `cols-12` (Fixed).
- **Span (`span-`)**: `span-full` (Full width), `span-1` through `span-12` (Specific column count).

### ↔️ Spacing (Gap & Padding)
Follows a 4px base scale (`0`, `px`, `0-5`, `1`, `1-5`, `2`, `2-5`, `3`, `3-5`, `4`, `5`...`24`).
- **Gap (`gap-N`)**: Controls space between items $\rightarrow$ `data-gap="N"`
- **Padding (`p-N`)**: Controls internal padding $\rightarrow$ `data-padding="N"`

### 🎯 Alignment & Justification
- **Alignment (`align-`)**: `start`, `center`, `end`, `stretch`, `baseline` $\rightarrow$ `data-align`
- **Justification (`justify-`)**: `start`, `center`, `end`, `between`, `around`, `evenly` $\rightarrow$ `data-justify`
- **Direction**: `horizontal` (Row), `vertical` (Column) $\rightarrow$ `data-direction`
- **Surface**: `base` (Page bg), `surface` (Component bg) $\rightarrow$ `data-surface`

---

## ✍️ Typography Tokens (`<k-text>`)
| Category | Tokens | Result |
| :--- | :--- | :--- |
| **Size** | `text-xs` to `text-4xl` | `data-text-size` |
| **Weight** | `normal`, `medium`, `semibold`, `bold` | `data-weight` |
| **Semantic** | `h1`-`h6`, `p`, `span`, `label`, `code`, `pre` | `data-as` |

---

## 🎭 Component Variants
Any string that does not match the patterns above is treated as a **Variant**. Variants are used to define the visual style "flavor" of a component.

**How they work:**
The last unmatched string in the `v` attribute is applied as the primary variant $\rightarrow$ `data-variant="variantName"`.

### Common Variants Examples:
- **Buttons/Inputs**: `filled`, `outlined`, `ghost`, `soft`, `subtle`
- **Carousel**: `classic`, `cards`
- **Lightbox**: `basic`, `gallery`, `zoom`

**Example Combination:**
`<k-button v="filled lg primary .btn-submit">Submit</k-button>`
- `filled` $\rightarrow$ Variant (`data-variant="filled"`)
- `lg` $\rightarrow$ Size (`data-size="lg"`)
- `primary` $\rightarrow$ Color (`data-color="primary"`)
- `.btn-submit` $\rightarrow$ CSS Class (`classList.add('btn-submit')`)
