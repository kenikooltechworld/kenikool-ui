# 📝 Input Component

The Input is the primary text-entry component in Kenikool UI. It is designed to cover the entire spectrum of form fields — from a basic single-line text box to a segmented OTP code, a multi-line textarea, a password field with live requirement checklist, and a search field with a one-click clear button. The Input honors the same `v` attribute system as every other component, supports 10 visual variants, 5 sizes, 6 semantic colors, full universal utility tokens, and built-in validation for common formats.

> **Framework status:** Both Vanilla `<k-input>` Web Component and React `<Input />` are **fully implemented and production-ready**. All 34 professional-grade features from the audit have been implemented including form integration, validation events, loading states, valid success indicators, RTL support, and comprehensive accessibility.

---

## 🚀 Basic Usage (No Tokens)

### Vanilla JavaScript
A plain text input with sensible defaults: `default` variant, `md` size, `primary` accent color.

```html
<!-- Just a plain text input -->
<k-input label="Name" placeholder="Enter your name"></k-input>

<!-- No label, just a placeholder -->
<k-input placeholder="Search..."></k-input>

<!-- Email field (uses native type) -->
<k-input type="email" label="Email address" placeholder="you@example.com"></k-input>

<!-- Required field -->
<k-input label="Username" required></k-input>
```

### React
```tsx
import { Input } from '@kenikool/ui';

// Plain text input
<Input label="Name" placeholder="Enter your name" />

// Email field
<Input type="email" label="Email address" placeholder="you@example.com" />

// Required field
<Input label="Username" required />
```

> The `v` attribute is optional. When omitted, the Input renders as a standard text field with the default variant. Add tokens only when you want to override appearance.

---

## 📋 Complete Token Usage Guide

This section shows how to combine tokens to create any input variant. **Tokens are composable** — you can mix and match them. Order doesn't matter in the `v` attribute.

### 🎯 Target Selectors (`.class` and `#id`)

The `v` attribute supports CSS selectors for automatic DOM placement and CSS class/ID assignment.

**Vanilla:**
```html
<!-- Add a CSS class to the input -->
<k-input v="outlined .form-field" label="Email"></k-input>
<!-- Result: <k-input class="form-field" data-variant="outlined" ...> -->

<!-- Add an ID -->
<k-input v="filled #username" label="Username"></k-input>

<!-- Mount the input inside a specific container -->
<k-input v="filled .toolbar" label="Search"></k-input>
<!-- Input moves itself into the element with class="toolbar" -->

<!-- Combine class, id, and variant tokens -->
<k-input v="outlined lg .hero-input #main-email">Email</k-input>
```

**React:** CSS classes and IDs work through standard React props:
```tsx
<Input variant="outlined" className="form-field" label="Email" />
<Input variant="filled" id="username" label="Username" />
```

### 1️⃣ Variants

The Input appearance: `default`, `filled`, `outlined`, `underlined`, `floating-label`, `search`, `password`, `otp`, `textarea`, `with-addon`.

**Vanilla:**
```html
<!-- 1. Default — clean and subtle -->
<k-input v="default" label="Name"></k-input>

<!-- 2. Filled — solid background for depth -->
<k-input v="filled" label="Email"></k-input>

<!-- 3. Outlined — transparent background, 1.5px border -->
<k-input v="outlined" label="Phone"></k-input>

<!-- 4. Underlined — minimalist bottom border only -->
<k-input v="underlined" label="City"></k-input>

<!-- 5. Floating label — Material-style notched label -->
<k-input v="floating-label" label="Full Name"></k-input>

<!-- 6. Search — pill-shaped with leading icon and clear button -->
<k-input v="search" placeholder="Search..."></k-input>

<!-- 7. Password — masked input with show/hide toggle -->
<k-input v="password" label="Password"></k-input>

<!-- 8. OTP — six segmented single-digit inputs with auto-advance -->
<k-input v="otp" label="Verification code"></k-input>

<!-- 9. Textarea — multi-line text area -->
<k-input v="textarea" label="Comments"></k-input>

<!-- 10. With addons — left and right inline segments -->
<k-input v="with-addon" addonLeft="https://" addonRight=".com" label="Domain"></k-input>
```

**React:**
```tsx
<Input variant="default" label="Name" />
<Input variant="filled" label="Email" />
<Input variant="outlined" label="Phone" />
<Input variant="underlined" label="City" />
<Input variant="floating-label" label="Full Name" />
<Input variant="search" placeholder="Search..." />
<Input variant="password" label="Password" />
<Input variant="otp" label="Verification code" />
<Input variant="textarea" label="Comments" />
<Input variant="with-addon" addonLeft="https://" addonRight=".com" label="Domain" />
```

### 2️⃣ Sizes

Scale from `xs` (extra small) to `xl` (extra large). Default is `md`.

**Vanilla:**
```html
<k-input v="outlined xs" label="Extra Small"></k-input>
<k-input v="outlined sm" label="Small"></k-input>
<k-input v="outlined md" label="Medium (default)"></k-input>
<k-input v="outlined lg" label="Large"></k-input>
<k-input v="outlined xl" label="Extra Large"></k-input>
```

**React:**
```tsx
<Input variant="outlined" size="xs" label="Extra Small" />
<Input variant="outlined" size="sm" label="Small" />
<Input variant="outlined" size="md" label="Medium" />
<Input variant="outlined" size="lg" label="Large" />
<Input variant="outlined" size="xl" label="Extra Large" />
```

> Sizes cascade to the field's font size and padding. They do **not** cascade to the floating-label offset in `floating-label` (the label uses an absolute-positioned transform that is size-agnostic).

### 3️⃣ Colors

Semantic colors: `primary` (default), `success`, `warning`, `error`, `info`, `default`.

**Color behavior in the Input:**
- The `color` token is parsed and exposed as `data-color` on the host element. **All 6 colors now have dedicated CSS rules** that tint the focus ring and (for `floating-label`) the floating label text color.
- Each color uses its semantic token: `--k-accent` (primary), `--k-success`, `--k-warning`, `--k-error`, `--k-info`, and `--k-border-strong` (default).
- The resting border stays `--k-border` for visual consistency across all colors — only the **focus ring** changes color per the `data-color` attribute.

**Vanilla:**
```html
<!-- Primary (default) — uses --k-accent for the focus ring -->
<k-input v="outlined primary" label="Email"></k-input>

<!-- Other colors — accepted by the parser; styling currently falls back to --k-accent -->
<k-input v="outlined success" label="Username"></k-input>
<k-input v="outlined warning" label="Pending"></k-input>
<k-input v="outlined info" label="Reference"></k-input>
<k-input v="outlined default" label="Notes"></k-input>
```

**React:**
```tsx
<Input variant="outlined" color="primary" label="Email" />
<Input variant="outlined" color="success" label="Username" />
<Input variant="outlined" color="warning" label="Pending" />
<Input variant="outlined" color="info" label="Reference" />
<Input variant="outlined" color="default" label="Notes" />
```

> **Color focus behavior is fully implemented.** Each color tints the focus ring and (for `floating-label`) the floating label text color. The CSS rules use semantic tokens: `--k-success` (green), `--k-warning` (orange), `--k-error` (red), `--k-info` (blue), `--k-accent` (primary), and `--k-border-strong` (default).

> For an **error state**, prefer the dedicated `error` attribute (see States below) rather than `color="error"` — the `error` attribute sets `data-error="true"` which forces the red border **even when unfocused**, displays the hint in red, and wires up `aria-invalid="true"`.

### 4️⃣ Border Radius

Round corners: `r-none`, `r-sm`, `r-md` (default), `r-lg`, `r-full` (pill shape).

**Vanilla:**
```html
<!-- Sharp corners -->
<k-input v="outlined r-none" label="Sharp"></k-input>

<!-- Slight rounding -->
<k-input v="outlined r-sm" label="Slight"></k-input>

<!-- Standard rounding (default) -->
<k-input v="outlined r-md" label="Standard"></k-input>

<!-- More rounding -->
<k-input v="outlined r-lg" label="Large"></k-input>

<!-- Pill shape (full radius horizontally) -->
<k-input v="outlined r-full" label="Pill"></k-input>
```

**React:**
```tsx
<Input variant="outlined" radius="none" label="Sharp" />
<Input variant="outlined" radius="sm" label="Slight" />
<Input variant="outlined" radius="md" label="Standard" />
<Input variant="outlined" radius="lg" label="Large" />
<Input variant="outlined" radius="full" label="Pill" />
```

> For `search` and `otp` variants, the radius interacts with variant-specific styling. `search` is already pill-shaped at default; `otp` uses flat inner edges and only rounds the first and last cells.

### 5️⃣ States

State flags: `disabled`, `loading`, `full`. Plus the **error** state, which is set via the `error` boolean token (not a token in the `v` string, but applied through the `error` prop or `data-error` attribute).

**Vanilla:**
```html
<!-- Disabled — grayed out, not editable -->
<k-input v="outlined disabled" label="Disabled" value="Read-only value"></k-input>

<!-- Loading — renders <k-loader> overlay, sets aria-busy -->
<k-input v="outlined loading" label="Saving..."></k-input>

<!-- Loading with custom loader variant -->
<k-input v="outlined loading loader-dots" label="Processing..."></k-input>

<!-- Full width — 100% of container (default for <k-input>) -->
<k-input v="outlined full" label="Full"></k-input>

<!-- Error state via attribute (recommended for validation) -->
<k-input v="outlined" label="Email" hint="Please enter a valid email"
          value="not-an-email" error></k-input>

<!-- Valid state (green checkmark + border) — auto-set after successful validation -->
<k-input v="outlined" label="Email" value="user@example.com" required></k-input>
```

**React:**
```tsx
<Input variant="outlined" disabled={true} label="Disabled" defaultValue="Read-only value" />
<Input variant="outlined" loading={true} label="Saving..." />
<Input variant="outlined" loading={true} loader="dots" label="Processing..." />
<Input variant="outlined" full={true} label="Full" />
<Input variant="outlined" label="Email" hint="Please enter a valid email"
        defaultValue="not-an-email" error={true} />
{/* Valid state automatically appears after field passes validation */}
<Input variant="outlined" label="Email" defaultValue="user@example.com" required />
```

> **Loading state** now renders an actual `<k-loader>` component (consistent with Button). You can customize the loader animation with the `loader` token: `loader-spinner`, `loader-dots`, `loader-pulse`, `loader-bars`, `loader-ring`, `loader-bounce`, etc.

> **Valid state** automatically displays a green checkmark icon and green border when the field passes validation and has a value. This is distinct from the `error` state — both are visual feedback cues for the user.

### 6️⃣ Width Utilities

Control input width: `w-full`, `w-auto`, `w-fit`, `w-screen`, `w-N` (spacing scale).

**Vanilla:**
```html
<!-- Full container width (default for k-input) -->
<k-input v="outlined w-full" label="Full"></k-input>

<!-- Auto width (content-based) -->
<k-input v="outlined w-auto" label="Auto"></k-input>

<!-- Fit content exactly -->
<k-input v="outlined w-fit" label="Fit"></k-input>

<!-- Full viewport width (rare; useful for hero search bars) -->
<k-input v="outlined w-screen" label="Viewport"></k-input>

<!-- Spacing-scale widths (e.g., w-64 = 16rem) -->
<k-input v="outlined w-64" label="16rem wide"></k-input>
```

**React:**
```tsx
<Input variant="outlined" width="full" label="Full" />
<Input variant="outlined" width="auto" label="Auto" />
<Input variant="outlined" width="fit" label="Fit" />
<Input variant="outlined" width="screen" label="Viewport" />
```

### 7️⃣ Max/Min Size Utilities

Constrain input dimensions: `mw-full`, `mh-full`, `mh-screen`, `mnw-0`, `mnh-0`, `mnh-screen`.

**Vanilla:**
```html
<k-input v="outlined mw-full" label="Max Full"></k-input>
<k-input v="outlined mh-full" label="Max Full Height"></k-input>
<k-input v="outlined mnw-0" label="Min Width 0"></k-input>
<k-input v="outlined mnh-screen" label="Min Viewport Height"></k-input>
```

**React:**
```tsx
<Input variant="outlined" maxWidth="full" label="Max Full" />
<Input variant="outlined" minHeight="screen" label="Min Viewport Height" />
```

### 8️⃣ Border Utilities

Add or remove borders. The Input's wrapper already has a 1px (or 1.5px for `outlined`) border by default — `bdr`/`bdr-none` are mostly useful for explicit overrides.

**Vanilla:**
```html
<!-- No border (explicit; mostly for underlined + custom styling) -->
<k-input v="underlined bdr-none" label="No Border"></k-input>

<!-- Border on a single side (rare for inputs) -->
<k-input v="underlined bdr-b" label="Bottom Only"></k-input>
```

**React:**
```tsx
<Input variant="underlined" border="none" label="No Border" />
```

### 9️⃣ Shadow Utilities

Add depth with shadows: `shd-sm`, `shd-md`, `shd-lg`, `shd-xl`, `shd-none`. The default Input has **no** shadow — the focus ring is the only elevation cue.

**Vanilla:**
```html
<!-- Subtle resting shadow -->
<k-input v="filled shd-sm" label="Soft Shadow"></k-input>

<!-- Pronounced shadow (typical for floating panels / hero search) -->
<k-input v="search shd-lg" placeholder="Search the docs..."></k-input>
```

**React:**
```tsx
<Input variant="filled" shadow="sm" label="Soft Shadow" />
<Input variant="search" shadow="lg" placeholder="Search the docs..." />
```

### 🔟 Text Alignment Utilities

Align the input text: `txt-left`, `txt-center`, `txt-right`, `txt-justify`. Useful for OTP (centered), monetary inputs (right), and other locale-specific patterns.

**Vanilla:**
```html
<!-- Right-aligned (currency, numbers) -->
<k-input v="outlined txt-right" label="Amount" value="0.00"></k-input>

<!-- Center-aligned (OTP is already centered by default) -->
<k-input v="otp" label="Code"></k-input>
```

**React:**
```tsx
<Input variant="outlined" textAlign="right" label="Amount" defaultValue="0.00" />
```

### 1️⃣1️⃣ Cursor Utilities

Control pointer appearance: `cur-ptr`, `cur-def`, `cur-not`. Inputs default to `cur-text` (the I-beam). These tokens are useful if the input is wrapped in a click-to-edit pattern.

**Vanilla:**
```html
<!-- Pointer cursor (signals the field is clickable but not editable until activated) -->
<k-input v="outlined cur-ptr" label="Click to edit"></k-input>

<!-- Not-allowed (display a disabled-looking field that is still focusable) -->
<k-input v="outlined cur-not" label="Read-only context"></k-input>
```

**React:**
```tsx
<Input variant="outlined" cursor="ptr" label="Click to edit" />
<Input variant="outlined" cursor="not" label="Read-only context" />
```

### 1️⃣2️⃣ Loader Variants

When the `loading` state is active, you can customize the loading animation with the `loader` token. The Input component renders an actual `<k-loader>` element, giving you access to all 13 loader variants.

**Available loader variants:**
- `spinner` (default) — Classic spinning circle
- `dots` — Three bouncing dots
- `pulse` — Pulsing circle
- `bars` — Five animated bars
- `ring` — Rotating ring
- `ripple` — Expanding ripples
- `bounce` — Bouncing ball
- `wave` — Wave animation
- `flip` — Flipping square
- `orbit` — Orbiting dot
- `squeeze` — Squeezing shape
- `beat` — Beating heart
- `crescent` — Rotating crescent

**Vanilla:**
```html
<!-- Default spinner loader -->
<k-input v="outlined loading" label="Saving..."></k-input>

<!-- Dots loader -->
<k-input v="outlined loading loader-dots" label="Processing..."></k-input>

<!-- Pulse loader -->
<k-input v="filled loading loader-pulse" label="Loading..."></k-input>

<!-- Bars loader -->
<k-input v="outlined loading loader-bars" label="Validating..."></k-input>

<!-- Ring loader -->
<k-input v="search loading loader-ring" placeholder="Searching..."></k-input>
```

**React:**
```tsx
<Input variant="outlined" loading={true} label="Saving..." />
<Input variant="outlined" loading={true} loader="dots" label="Processing..." />
<Input variant="filled" loading={true} loader="pulse" label="Loading..." />
<Input variant="outlined" loading={true} loader="bars" label="Validating..." />
<Input variant="search" loading={true} loader="ring" placeholder="Searching..." />
```

> **Note:** The loader overlays the input field and sets `aria-busy="true"`. The field text is hidden while loading to prevent visual clutter. The loader inherits the input's color scheme automatically.

### 1️⃣3️⃣ Icons

Inputs support icons on both sides via the `icon` and `iconRight` attributes (Vanilla) or props (React). Built-in icon names: `search`, `user`, `bell`, `home`, `settings`, `eye`, `eye-off`, `close`, `check`, `chevronDown`, `arrow-right`, `sun`, `moon`, `dracula`.

**Vanilla:**
```html
<!-- Search icon on the left -->
<k-input v="search" icon="search" placeholder="Search..."></k-input>

<!-- Email icon on the left -->
<k-input v="outlined" icon="user" label="Username"></k-input>

<!-- Chevron on the right (useful for combobox-style inputs) -->
<k-input v="outlined" iconRight="chevronDown" label="Country"></k-input>

<!-- Search + right-side clear button (search variant auto-adds clear) -->
<k-input v="search" placeholder="Type to filter..."></k-input>

<!-- Password toggle (password variant auto-adds eye/eye-off) -->
<k-input v="password" label="Password"></k-input>
```

**React:**
```tsx
{/* Icon string (matches vanilla) */}
<Input variant="outlined" icon="user" label="Username" />
<Input variant="outlined" iconRight="chevronDown" label="Country" />

{/* Icon component (React-specific) */}
<Input variant="outlined" icon={<UserIcon />} label="Username" />
<Input variant="outlined" iconRight={<ChevronDownIcon />} label="Country" />
```

> **React-specific:** The React `<Input>` component accepts both icon name strings (for built-in icons) and React node elements (for custom icon components from libraries like Lucide, Heroicons, or Phosphor).

> Icons inherit `currentColor`, so they pick up the focus ring color when the wrapper is focused and the muted text color otherwise.

### 1️⃣4️⃣ Label Position

For non-floating-label variants, you can place the label above (`top`, default), below (`bottom`), or omit it. For `floating-label`, the label is always inside the wrapper and animates upward on focus.

**Vanilla:**
```html
<!-- Label on top (default) -->
<k-input v="outlined" label-position="top" label="Email"></k-input>

<!-- Label on bottom -->
<k-input v="outlined" label-position="bottom" label="Notes"></k-input>

<!-- Floating label (Material-style; the v="floating-label" variant) -->
<k-input v="floating-label" label="Full name" placeholder=" "></k-input>
```

**React:**
```tsx
<Input variant="outlined" label="Email" labelPosition="top" />
<Input variant="outlined" label="Notes" labelPosition="bottom" />
<Input variant="floating-label" label="Full name" />
```

### 1️⃣5️⃣ Addons (With-Addon Variant)

The `with-addon` variant slots text or icon segments on either side of the field. Common patterns: `https://` / `.com` for domain fields, `$` / `.00` for currency, `+` / country code for phone numbers.

**Vanilla:**
```html
<!-- Domain field -->
<k-input v="with-addon" addonLeft="https://" addonRight=".com" label="Domain"
         placeholder="mysite"></k-input>

<!-- Currency field (right addon is the unit) -->
<k-input v="with-addon" addonLeft="$" addonRight="USD" label="Amount"
         placeholder="0.00"></k-input>

<!-- Phone field -->
<k-input v="with-addon" addonLeft="+1" label="Phone"
         placeholder="555-123-4567"></k-input>

<!-- URL field with protocol dropdown (left addon) -->
<k-input v="with-addon" addonLeft="https://" label="URL"
         placeholder="example.com/page"></k-input>
```

**React:**
```tsx
<Input variant="with-addon" addonLeft="https://" addonRight=".com"
       label="Domain" placeholder="mysite" />

<Input variant="with-addon" addonLeft="$" addonRight="USD"
       label="Amount" placeholder="0.00" />
```

> Addons are visual containers — they aren't focusable or interactive. If you need a real button (e.g., a copy-to-clipboard icon), place it in the `iconRight` slot instead.

---

## ✅ Validation

The Input has built-in format validation for the most common input types. Validation runs on `input`, `change`, and `blur` events. The `data-error` attribute is set when validation fails, the hint text is replaced with the error message, and `aria-invalid="true"` is applied to the field.

### Validation Events

The Input dispatches custom validation events for programmatic validation handling:

**`k:invalid`** — Fires when the field transitions from valid to invalid.
```javascript
input.addEventListener('k:invalid', (e) => {
  console.log('Field is now invalid:', e.detail.value);
  console.log('Validation message:', e.detail.validationMessage);
  console.log('Validity state:', e.detail.validity);
});
```

**`k:valid`** — Fires when the field transitions from invalid to valid.
```javascript
input.addEventListener('k:valid', (e) => {
  console.log('Field is now valid:', e.detail.value);
});
```

**`k:complete`** — Fires once when all 6 OTP digits are filled (OTP variant only).
```javascript
otpInput.addEventListener('k:complete', (e) => {
  console.log('OTP complete:', e.detail.value); // "123456"
  // Auto-submit the form or move to next step
  document.querySelector('form').submit();
});
```

**React:**
```tsx
<Input
  variant="otp"
  label="Verification Code"
  onChange={(e) => {
    // Standard onChange fires on every digit
    if (e.target.value.length === 6) {
      console.log('OTP complete:', e.target.value);
    }
  }}
/>
```

### Validation Rules by Type

| Native type / variant | Pattern | Default error message |
| :--- | :--- | :--- |
| `email` | RFC 5322 simplified | `Please enter a valid email address.` |
| `password` | ≥8 chars, 1 upper, 1 lower, 1 number | `Password must be at least 8 characters and include uppercase, lowercase, and a number.` |
| `search` | ≥3 characters | `Search queries must be at least 3 characters.` |
| `tel` | International phone with optional `+` and separators | `Please enter a valid phone number.` |
| `url` | HTTP/HTTPS URL with optional protocol | `Please enter a valid URL.` |
| `otp` (variant) | Exactly 6 digits | `Please enter a valid 6-digit code.` |
| `text` | Any non-empty value | `This field cannot be empty.` |

**Vanilla:**
```html
<!-- Email validation — automatic when type="email" -->
<k-input type="email" label="Email" hint="We'll never share your email"
         required></k-input>

<!-- Password validation — automatic when type="password" or variant="password" -->
<k-input v="password" label="Password" required></k-input>
<!-- Renders the live requirement checklist below the field:
     ✓ At least 8 characters
     ✓ One uppercase letter
     ✓ One lowercase letter
     ✓ One number -->

<!-- Phone validation -->
<k-input type="tel" label="Phone" required></k-input>

<!-- URL validation -->
<k-input type="url" label="Website" placeholder="https://..."></k-input>

<!-- Custom pattern via attribute (overrides built-in rules) -->
<k-input v="outlined" label="Slug" pattern="[a-z0-9-]+" required
         validation-message="Lowercase letters, numbers, and dashes only."></k-input>

<!-- Required field with no built-in rule (text) -->
<k-input v="outlined" label="Name" required></k-input>
```

**React:**
```tsx
<Input type="email" label="Email" hint="We'll never share your email" required />
<Input variant="password" label="Password" required />
<Input type="tel" label="Phone" required />
<Input variant="outlined" label="Slug" pattern="[a-z0-9-]+" required
       validationMessage="Lowercase letters, numbers, and dashes only." />
```

### Validation Flow

**When validation runs:**
1. **On `input`**: The field re-validates as the user types **after** the field has been touched (blur event fired at least once). The hint text is restored when the value becomes valid; the error message replaces the hint when it becomes invalid.
2. **On `blur`**: A validation pass runs when the user leaves the field. This marks the field as "touched" and enables live validation on subsequent `input` events.
3. **On `change`**: Validation runs again on programmatic value changes (via the `.value` property setter).
4. **On form submit**: The browser's native validation runs (if `required`, `pattern`, or type-specific validation is present).
5. **Initial render**: Validation is **NOT** shown on initial page load or on first render — the field must be interacted with first. This prevents showing error messages before the user has had a chance to fill the field.

**Validation precedence:**
1. **Custom pattern takes precedence**: If a `pattern` attribute is set, it overrides the built-in rule for that type.
2. **Native HTML5 fallback**: If neither a built-in rule nor a custom pattern fires, the browser's native `checkValidity()` is consulted, and `field.validationMessage` becomes the error text.

**State tracking:**
- The Input tracks a `_touched` flag internally. When `false`, errors are suppressed even if the value is invalid. When `true` (set on first `blur`), errors are shown immediately.
- The `k:invalid` and `k:valid` events only fire **after** the field is touched, and only on state transitions (invalid → valid or valid → invalid), not on every keystroke.

**Error attribute override:**
- If the `error` attribute (or React `error` prop) is set externally, it overrides all validation logic and forces the field into an error state immediately, even if the field hasn't been touched yet.

### Validation Behavior Per Variant

- **`default` / `filled` / `outlined` / `underlined` / `floating-label` / `with-addon`**: Run the rule for the `type` attribute (defaults to `text`).
- **`password`**: Runs the password rule **and** updates the requirement checklist live.
- **`search`**: Runs the search rule (≥3 chars).
- **`otp`**: Runs the OTP rule (exactly 6 digits). Each cell validates the digit individually; the combined value is exposed as `element.value`.
- **`textarea`**: Runs the `text` rule (non-empty).

---

## 📋 Form Integration & Standard HTML Attributes

The Input is **form-associated** — it participates in native HTML form submission using the ElementInternals API (with fallback for older browsers). All standard form attributes are bridged to the inner `<input>` or `<textarea>` element.

### Form-Associated Custom Element

The Input implements the Form-Associated Custom Elements API, which means:
- The `name` attribute bridges to the inner field and participates in `FormData`
- The `form` attribute allows association with a form by ID (even if the input is outside the form)
- The `value` property is synchronized with `ElementInternals.setFormValue()`
- Form reset (`<form>.reset()`) clears the field back to its `defaultValue`
- The input respects `formaction`, `formenctype`, `formmethod`, `formnovalidate`, and `formtarget` attributes

**Vanilla:**
```html
<form id="login" action="/login" method="POST">
  <!-- Standard form integration -->
  <k-input v="floating-label" name="email" type="email" label="Email" required></k-input>
  <k-input v="password" name="password" label="Password" required></k-input>
  
  <button type="submit">Sign in</button>
  <button type="reset">Clear</button>
</form>

<!-- Input associated with form by ID (outside the form element) -->
<k-input v="outlined" name="remember" form="login" type="checkbox" label="Remember me"></k-input>

<script>
  // Access the form value
  const form = document.getElementById('login');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    console.log('Email:', formData.get('email'));
    console.log('Password:', formData.get('password'));
    console.log('Remember:', formData.get('remember'));
  });
  
  // Programmatic form reset
  form.reset(); // Clears all inputs back to defaultValue
</script>
```

**React:**
```tsx
<form onSubmit={(e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  console.log('Email:', formData.get('email'));
}}>
  <Input variant="floating-label" name="email" type="email" label="Email" required />
  <Input variant="password" name="password" label="Password" required />
  <button type="submit">Sign in</button>
</form>
```

### Standard HTML Attributes

All standard input attributes are bridged from the host `<k-input>` element to the inner native `<input>` or `<textarea>`:

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Form field name for submission |
| `form` | `string` | ID of the form to associate with |
| `type` | `string` | Input type (`text`, `email`, `password`, `url`, `tel`, `number`, `date`, etc.) |
| `placeholder` | `string` | Placeholder text |
| `value` | `string` | Initial value |
| `defaultValue` | `string` | Default value for reset |
| `required` | `boolean` | Mark field as required |
| `disabled` | `boolean` | Disable the field |
| `readonly` | `boolean` | Make field read-only (focusable but not editable) |
| `autofocus` | `boolean` | Auto-focus on page load. **Important**: Focus is deferred to the next microtask and only applies if no other element is currently focused. This prevents stealing focus during initial page render, which can break scroll restoration and surprise assistive technology users. |
| `autocomplete` | `string` | Autocomplete hint (`email`, `cc-number`, `tel`, `one-time-code`, etc.) |
| `inputmode` | `string` | Mobile keyboard hint (`numeric`, `tel`, `email`, `url`, `search`) |
| `enterkeyhint` | `string` | Enter key label on mobile (`enter`, `done`, `go`, `next`, `search`, `send`) |
| `spellcheck` | `boolean` | Enable/disable spell checking |
| `pattern` | `string` | RegExp validation pattern |
| `min` | `number\|string` | Min value (for `number`, `date`, `range` types) |
| `max` | `number\|string` | Max value |
| `step` | `number\|string` | Step increment (for `number`, `range`) |
| `minlength` | `number` | Minimum character count |
| `maxlength` | `number` | Maximum character count |
| `dirname` | `string` | Submit text direction with form (`name.dir`) |
| `list` | `string` | ID of `<datalist>` for autocomplete suggestions |
| `multiple` | `boolean` | Allow multiple values (for `email`, `file` types) |
| `accept` | `string` | Accepted file types (for `file` type) |
| `size` | `number` | Visual width in characters (deprecated; use CSS instead) |

**Textarea-only attributes** (only applied when `variant="textarea"`):
| Attribute | Type | Description |
| :--- | :--- | :--- |
| `rows` | `number` | Number of visible text rows |
| `cols` | `number` | Number of visible columns |
| `wrap` | `string` | Text wrapping mode (`soft`, `hard`, `off`) |

**Vanilla:**
```html
<!-- Email with autocomplete -->
<k-input v="outlined" name="email" type="email" autocomplete="email"
         inputmode="email" enterkeyhint="next" label="Email"></k-input>

<!-- Phone number with numeric keyboard -->
<k-input v="outlined" name="phone" type="tel" inputmode="numeric"
         autocomplete="tel" label="Phone"></k-input>

<!-- Credit card with masked input -->
<k-input v="outlined" name="cc" type="text" inputmode="numeric"
         autocomplete="cc-number" pattern="[0-9\s]{13,19}"
         maxlength="19" label="Card Number"></k-input>

<!-- OTP with one-time-code hint -->
<k-input v="otp" name="code" autocomplete="one-time-code" label="Verification Code"></k-input>

<!-- Date range -->
<k-input v="outlined" name="start" type="date" min="2024-01-01" max="2024-12-31"
         label="Start Date"></k-input>

<!-- Textarea with row count -->
<k-input v="textarea" name="bio" rows="6" maxlength="500" showcounter
         label="Bio"></k-input>

<!-- Read-only field (focusable, copyable, but not editable) -->
<k-input v="outlined" name="id" value="ACC-2024-9183" readonly
         label="Account ID"></k-input>
```

**React:**
```tsx
<Input variant="outlined" name="email" type="email" autoComplete="email"
       inputMode="email" enterKeyHint="next" label="Email" />

<Input variant="outlined" name="phone" type="tel" inputMode="numeric"
       autoComplete="tel" label="Phone" />

<Input variant="outlined" name="cc" type="text" inputMode="numeric"
       autoComplete="cc-number" pattern="[0-9\s]{13,19}"
       maxLength={19} label="Card Number" />

<Input variant="otp" name="code" autoComplete="one-time-code" label="Verification Code" />

<Input variant="outlined" name="start" type="date" min="2024-01-01" max="2024-12-31"
       label="Start Date" />

<Input variant="textarea" name="bio" rows={6} maxLength={500} showcounter
       label="Bio" />

<Input variant="outlined" name="id" defaultValue="ACC-2024-9183" readOnly
       label="Account ID" />
```

### Character Counter

When `maxlength` is set, you can display a live character counter by adding the `showcounter` attribute. The counter updates in real-time as the user types.

**Counter behavior:**
- **Display format**: `"current / max"` (e.g., `"23 / 280"`)
- **Warning threshold**: The counter turns **yellow** (using `--k-warning` color) when the user reaches **80% of the maximum length**
- **Error state**: When the input is in error state (`data-error="true"`), the counter turns **red** (using `--k-error` color)
- **Position**: The counter appears below the field, right-aligned

**Example:**
```html
<!-- Counter with warning at 224 characters (80% of 280) -->
<k-input v="outlined" name="bio" maxlength="280" showcounter
         label="Bio" hint="Tell us about yourself"></k-input>
```

When the user types 224 characters, the counter changes from gray (`23 / 280`) to yellow (`224 / 280`) to provide visual feedback that they're approaching the limit.

**Vanilla:**
```html
<k-input v="outlined" name="bio" maxlength="280" showcounter
         label="Bio" hint="Tell us about yourself"></k-input>
<!-- Renders: "0 / 280" below the field, updating live -->
```

**React:**
```tsx
<Input variant="outlined" name="bio" maxLength={280} showcounter
       label="Bio" hint="Tell us about yourself" />
```

---

## 🌍 Internationalization & RTL Support

The Input fully supports right-to-left (RTL) languages via CSS logical properties and `[dir="rtl"]` selectors.

**Vanilla:**
```html
<html dir="rtl">
  <k-input v="outlined" label="البريد الإلكتروني" placeholder="أدخل بريدك الإلكتروني"></k-input>
</html>
```

When `dir="rtl"` is set on the `<html>` element (or any ancestor), the Input automatically:
- Flips icon positions (left icon moves to right, right icon moves to left)
- Reverses addon positions for `with-addon` variant
- Aligns field text to the right
- Aligns counter and hint text to the left
- Preserves focus ring and border styling

No additional configuration needed — RTL is handled entirely through CSS.

---

## ⚛️ React-Specific Features

The React `<Input>` component provides additional conveniences beyond the vanilla Web Component:

### 1. **Additional Props**

**`as` prop** — Alternative way to render a textarea:
```tsx
// These are equivalent:
<Input variant="textarea" label="Comments" />
<Input as="textarea" label="Comments" />
```

**`truncate` prop** — Truncate overflowing text with ellipsis:
```tsx
<Input variant="outlined" truncate label="Long text field" maxWidth="300px" />
```

**`className` prop** — Add custom CSS classes to the host element:
```tsx
<Input variant="outlined" className="custom-input" label="Email" />
```

### 2. **Icon Components**

The React Input accepts both string icon names (for built-in icons) and React elements (for custom icon libraries):

```tsx
import { UserIcon, SearchIcon } from 'lucide-react';

// Built-in icon string
<Input variant="outlined" icon="user" label="Username" />

// Custom icon component
<Input variant="outlined" icon={<UserIcon size={18} />} label="Username" />

// Custom icon on right
<Input variant="outlined" iconRight={<SearchIcon />} label="Search" />
```

### 3. **Native React Event Handlers**

All standard React event handlers work as expected:

```tsx
<Input
  variant="outlined"
  label="Email"
  onChange={(e) => console.log('Value:', e.target.value)}
  onFocus={(e) => console.log('Focused')}
  onBlur={(e) => console.log('Blurred')}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
    }
  }}
/>
```

### 4. **Controlled vs Uncontrolled**

The React Input supports both controlled and uncontrolled modes:

**Controlled** (value managed by React state):
```tsx
const [email, setEmail] = useState('');

<Input
  variant="outlined"
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**Uncontrolled** (value managed by the DOM):
```tsx
const inputRef = useRef<HTMLInputElement>(null);

<Input
  variant="outlined"
  label="Email"
  defaultValue="user@example.com"
  ref={inputRef}
/>

// Access value via ref:
console.log(inputRef.current?.value);
```

### 5. **Ref Forwarding**

The Input forwards its ref to the inner `<input>` or `<textarea>` element, giving you full access to native DOM methods:

```tsx
const inputRef = useRef<HTMLInputElement>(null);

<Input variant="outlined" label="Email" ref={inputRef} />

// Call native methods:
inputRef.current?.focus();
inputRef.current?.select();
inputRef.current?.setSelectionRange(0, 5);
console.log(inputRef.current?.value);
```

---

## ♿ Accessibility

The Input is fully accessible by default:

- **Semantic HTML**: Uses native `<input>` and `<textarea>` elements
- **Label association**: `<label for="...">` automatically wires to the inner field
- **ARIA attributes**: `aria-invalid`, `aria-required`, `aria-busy`, `aria-describedby` all set correctly
- **Error announcement**: When `data-error` is set, the hint text is announced via `aria-describedby` pointing to the error message
- **Keyboard navigation**: All interactive elements (field, password toggle, search clear button, OTP cells) are keyboard-accessible
- **Focus management**: Focus ring is always visible; autofocus is deferred to prevent scroll jump
- **Screen reader support**: All icons and loaders have `aria-hidden="true"`; all interactive buttons have `aria-label`

---

## 🎯 Real-World Examples

Combining multiple tokens to create production-ready inputs.

### Login Form
```html
<!-- Vanilla: Email + Password with floating labels -->
<k-input v="floating-label" type="email" label="Email"
         placeholder=" " icon="user" required></k-input>

<k-input v="floating-label" variant="password" label="Password"
         placeholder=" " required></k-input>

<k-button v="filled lg primary w-full" type="submit">Sign in</k-button>
```

```tsx
{/* React */}
<Input variant="floating-label" type="email" label="Email" required />
<Input variant="floating-label" variant="password" label="Password" required />
<Button variant="filled" size="lg" color="primary" full type="submit">Sign in</Button>
```

### Sign-Up Form with Validation
```html
<!-- Vanilla -->
<k-input v="outlined" label="Email" type="email" required
         hint="We'll send a verification link"></k-input>

<k-input v="password" label="Choose a password" required
         hint="At least 8 characters"></k-input>

<k-input v="outlined" label="Display name" required
         hint="How others will see you"></k-input>
```

### Two-Factor Authentication (OTP)
```html
<!-- Vanilla: OTP code field -->
<k-input v="otp lg" label="Enter the 6-digit code"
         hint="We sent this to your registered email"></k-input>

<!-- Read the value programmatically -->
<script>
  document.querySelector('k-input[v*="otp"]').addEventListener('k:change', (e) => {
    console.log('Code:', e.detail.value); // e.g., "123456"
  });
</script>
```

### Search Bar with Filters
```html
<!-- Vanilla: Pill-shaped search with shadow -->
<k-input v="search lg shd-md" placeholder="Search products..."
         icon="search"></k-input>

<!-- Compact search for toolbars -->
<k-input v="search sm" placeholder="Filter..."></k-input>
```

### Profile Form
```html
<!-- Vanilla: Outlined inputs in a stacked layout -->
<k-input v="outlined" label="Full name" icon="user" required></k-input>
<k-input v="outlined" label="Email" type="email" icon="bell" required></k-input>
<k-input v="outlined" label="Website" type="url"
         iconRight="arrow-right"></k-input>
<k-input v="textarea" label="Bio" placeholder="Tell us about yourself..."></k-input>
```

### Inline Edit Field
```html
<!-- Vanilla: Looks clickable until activated -->
<k-input v="underlined cur-ptr" label="Display name"
         value="Click to edit"></k-input>
```

### Currency Input
```html
<!-- Vanilla: Right-aligned number with $ prefix and USD suffix -->
<k-input v="with-addon" addonLeft="$" addonRight="USD"
         txt-right label="Price" type="text"
         pattern="^\d+(\.\d{2})?$"
         validation-message="Enter a valid amount (e.g., 19.99)"></k-input>
```

### Error State After Submission
```html
<!-- Vanilla -->
<k-input v="outlined error" label="Email"
         value="not-an-email"
         hint="Please enter a valid email address."
         required></k-input>
<!-- Renders with red border, red hint, and aria-invalid="true" -->
```

### Disabled Field in a Read-Only Profile
```html
<!-- Vanilla -->
<k-input v="outlined disabled" label="Account ID"
         value="ACC-2024-9183"
         hint="Contact support to change this"></k-input>
```

---

## 🛠️ Configuration & Tokens

The Input utilizes the `v` attribute system. Any token placed in the `v` attribute is mapped to a `data-` attribute on the element.

### 1. Universal Tokens (All 10 Categories Supported)
| Category | Tokens | Effect |
| :--- | :--- | :--- |
| **Size** | `xs`, `sm`, `md`, `lg`, `xl` | Font size + padding on the field. |
| **Color** | `primary`, `success`, `warning`, `error`, `info`, `default` | Focus ring + (for floating-label) the floating label text color. |
| **Radius** | `r-none`, `r-sm`, `r-md`, `r-lg`, `r-full` | Wrapper corner rounding. |
| **State** | `loading`, `disabled`, `full`, `truncate` | Interaction lock + width + overflow. |
| **Width** | `w-full`, `w-auto`, `w-fit`, `w-screen`, `w-0…w-24` | Field width. |
| **Height** | `h-full`, `h-auto`, `h-screen`, `h-fit`, `h-0…h-24` | Field height. |
| **Max/Min** | `mw-full`, `mh-full`, `mh-screen`, `mnw-0`, `mnh-0`, `mnh-screen` | Sizing constraints. |
| **Border** | `bdr`, `bdr-t/r/b/l`, `bdr-none` | Border overrides (rare; defaults handle most cases). |
| **Shadow** | `shd-sm`, `shd-md`, `shd-lg`, `shd-xl`, `shd-none` | Resting elevation. |
| **Text Align** | `txt-left`, `txt-center`, `txt-right`, `txt-justify` | Field text alignment. |
| **Cursor** | `cur-ptr`, `cur-def`, `cur-not` | Pointer appearance. |
| **Display** | `d-block`, `d-inline`, `d-flex`, `d-grid`, `d-none` | Host element display. |
| **Loader** | `loader-spinner`, `loader-dots`, `loader-pulse`, `loader-bars`, `loader-ring`, `loader-ripple`, `loader-bounce`, `loader-wave`, `loader-flip`, `loader-orbit`, `loader-squeeze`, `loader-beat`, `loader-crescent` | Loading animation variant (only applies when `loading` state is active). |

> **Universal tokens work on all Kenikool components**, not just Input. These tokens (width, height, border, shadow, cursor, etc.) are parsed by the `v` attribute system and applied to the host element via data attributes, which are then styled by CSS. This means you can use `v="w-full shd-md"` on any component (`<k-button>`, `<k-card>`, `<k-input>`, etc.) and get consistent behavior.

#### Tokens the Input Does NOT Support

The Input ignores layout-specific and typography-specific tokens because it's a form control, not a layout container or text element:

**Layout tokens (use with `<k-grid>`, `<k-row>`, `<k-stack>`, `<k-box>` instead):**
- ❌ `cols-N`, `cols-auto` — grid column count
- ❌ `gap-N` — gap between children
- ❌ `span-N`, `span-full` — grid column span
- ❌ `align-*` — cross-axis alignment
- ❌ `justify-*` — main-axis alignment
- ❌ `horizontal`, `vertical` — flex direction
- ❌ `p-N` — padding (use CSS for input padding)

**Typography tokens (use with `<k-text>` instead):**
- ❌ `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl` — typography size
- ❌ `normal`, `medium`, `semibold`, `bold` — font weight
- ❌ `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `span`, `label`, `code`, `pre` — semantic element

**Background tokens (Input has variant-driven backgrounds):**
- ❌ `base`, `surface`, `elevated`, `overlay` — surface background

If you need these features, wrap the Input in the appropriate layout or typography component:
```html
<!-- Wrong: Input with layout tokens (ignored) -->
<k-input v="outlined gap-4 p-6" label="Email"></k-input>

<!-- Right: Wrap in k-box for padding -->
<k-box v="p-6">
  <k-input v="outlined" label="Email"></k-input>
</k-box>

<!-- Right: Wrap in k-stack for layout -->
<k-stack v="gap-4">
  <k-input v="outlined" label="Email"></k-input>
  <k-input v="outlined" label="Password"></k-input>
</k-stack>
```

### 2. Input Variants (All 10 Supported)

#### Variant Overview Table
| Variant | Appearance | Use Case | Special Behavior |
| :--- | :--- | :--- | :--- |
| `default` | White/dark surface with 1px border, transparent background. | Standard form fields. | Baseline; no special interactions. |
| `filled` | Solid elevated background, transparent border until focus. | Forms that need visual weight. | Background darkens slightly on hover. |
| `outlined` | Transparent background with 1.5px border. | High-contrast forms, modal dialogs. | Border thickens to muted on hover. |
| `underlined` | No background, no border except a 2px bottom border. | Minimalist forms, settings panels. | Focus ring is **disabled** (only the bottom border changes color). |
| `floating-label` | Border with label that animates into the border on focus. | Material-style forms. | Requires `placeholder=" "` for the CSS-only float animation. |
| `search` | Pill-shaped wrapper with built-in leading search icon and clear button. | Search bars, filter inputs. | Auto-adds `icon="search"` on the left and a clear button on the right (appears when value is non-empty). Sets `type="search"`. |
| `password` | Standard input with a built-in eye/eye-off toggle on the right. | Password and confirmation fields. | Sets `type="password"`. Auto-adds the toggle button. Renders the requirement checklist below. |
| `otp` | Six 1-digit segmented inputs in a unified border. | Two-factor codes, PIN entry. | Sets `role="group"`. Auto-advances focus on input. Backspace moves to previous cell. Supports clipboard paste (digits only, first 6). On screens ≤480px, cells shrink from 3rem×3.5rem to 2.2rem×2.8rem. |
| `textarea` | Multi-line `<textarea>` with min-height of 120px. | Comments, descriptions, bios. | Renders `<textarea>` instead of `<input>`. Vertical resize handle. |
| `with-addon` | Wrapper with optional `addonLeft` and `addonRight` text segments. | Domain, currency, phone fields. | Addon segments have their own background and right/left border dividers. |

#### Color × Variant Interaction Matrix

The `color` token is parsed and exposed as `data-color` on the host element. **All 6 colors have dedicated CSS rules** that tint the focus ring and (for `floating-label`) the floating label text color. The resting border stays `--k-border` for all colors — only the focus ring changes color.

| Variant | Resting border | Focus ring | Notes |
| :--- | :--- | :--- | :--- |
| `default` | `--k-border` | Per-color ring (e.g., `--k-success` for `data-color="success"`) | Baseline. |
| `filled` | transparent | Per-color ring (background also flips from `--k-bg-elevated` to `--k-bg-surface`) | Hover darkens slightly. |
| `outlined` | `--k-border` (1.5px) | Per-color ring | Hover thickens slightly to muted. |
| `underlined` | bottom border only | **no ring** (only bottom border color changes per color) | Most minimalist. |
| `floating-label` | `--k-border` | Per-color ring + floating label color changes per color | Requires `placeholder=" "`. |
| `search` | `--k-border` | Per-color ring | Clear button appears when value is non-empty. |
| `password` | `--k-border` | Per-color ring | Eye toggle on right. Requirement checklist below. |
| `otp` | `--k-border` (between cells) | Per-color 2px ring on the focused cell only | Per-cell focus ring, not on the group. |
| `textarea` | `--k-border` | Per-color ring | Multi-line. |
| `with-addon` | `--k-border` | Per-color ring | Addons stay muted. |

**Per-color focus rings:**
- `primary` → `--k-accent` (brand color)
- `success` → `--k-success` (green)
- `warning` → `--k-warning` (orange)
- `error` → `--k-error` (red)
- `info` → `--k-info` (blue)
- `default` → `--k-border-strong` (gray)

### 3. Special Attributes (Vanilla)

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `label` | `string` | `null` | Label text displayed above/below the field (or inside for `floating-label`). |
| `placeholder` | `string` | `null` | Placeholder text. For `floating-label`, set to ` ` (space) to enable the float animation when empty. |
| `hint` | `string` | `null` | Helper text below the field. Replaced with the validation error message when the field is invalid. |
| `error` | `boolean` | `false` | Force the error state (sets `data-error="true"`). Use when you need to show an error that isn't tied to the built-in validators. |
| `type` | `string` | `text` | Native input type (`text`, `email`, `password`, `tel`, `url`, `number`, etc.). |
| `pattern` | `string` | `null` | Custom regex pattern. Overrides the built-in rule for the type. |
| `required` | `boolean` | `false` | Mark the field as required. Skips validation when the field is empty. |
| `validation-message` | `string` | built-in | Override the error message for this instance. |
| `addonLeft` | `string` | `null` | Text for the left addon (only when `variant="with-addon"`). |
| `addonRight` | `string` | `null` | Text for the right addon (only when `variant="with-addon"`). |
| `label-position` | `top` \| `bottom` | `top` | Position of the label relative to the field (ignored for `floating-label`). |
| `icon` | `IconName` | `null` | Icon to display on the left side of the wrapper. |
| `iconRight` | `IconName` | `null` | Icon to display on the right side of the wrapper (overridden by `search`/`password` built-in buttons). |

### 4. Built-In Icons

The following icons are available by name from the central icon registry (`src/core/icons.ts`):

| Icon name | Visual | Common use |
| :--- | :--- | :--- |
| `search` | Magnifying glass | Search variant (left), general left-side search affordance. |
| `user` | Person silhouette | Username fields, profile forms. |
| `bell` | Bell | Notification settings. |
| `home` | House | Address fields. |
| `settings` | Gear | Settings / configuration. |
| `eye` | Open eye | Password show button (default). |
| `eye-off` | Crossed-out eye | Password hide button (when revealed). |
| `close` | X | Search clear button. |
| `check` | Checkmark | Success indicators. |
| `chevronDown` | Down caret | Combobox / select affordance. |
| `arrow-right` | Right arrow | "Next step" / submit affordance. |
| `sun` | Sun | Theme switcher (light). |
| `moon` | Moon | Theme switcher (dark). |
| `dracula` | Shield | Theme switcher (dracula). |

> You can also pass an `HTMLElement` (e.g., a custom SVG or a slot element) to the `icon` / `iconRight` props in React for icon-library integration.

### 5. Utility Tokens (Optional)

All universal utility tokens work on the Input via the `v` attribute, matching the behavior of the Button:

| Category | Tokens | Effect |
| :--- | :--- | :--- |
| **Dimensions** | `w-full`, `mw-full`, `h-full`, `mh-full`, etc. | Width/height control. |
| **Borders** | `bdr`, `bdr-t/r/b/l`, `bdr-none` | Border overrides. |
| **Shadows** | `shd-sm`, `shd-md`, `shd-lg`, `shd-xl` | Resting elevation. |
| **Text Align** | `txt-left`, `txt-center`, `txt-right` | Field text alignment. |
| **Cursor** | `cur-ptr`, `cur-def`, `cur-not` | Pointer appearance. |
| **Display** | `d-block`, `d-inline`, `d-flex`, `d-none` | Host element display. |

**Example with utility tokens:**
```html
<!-- Vanilla: Full-width centered shadowed search bar -->
<k-input v="search lg shd-md r-full w-full" placeholder="Search..."></k-input>

<!-- Vanilla: Right-aligned currency field -->
<k-input v="with-addon addonLeft="$" addonRight="USD" txt-right"
         label="Amount"></k-input>
```

---

## 🎨 Styling & State Transitions

### Default Styling Behavior
All inputs include smooth CSS transitions for focus and error states (`--k-transition-base` = 0.15s easing).

#### Focus Behavior (per variant)

| Variant | Focus Effect |
| :--- | :--- |
| `default` | Border becomes `--k-accent`; 4px `--k-accent-subtle` ring appears. |
| `filled` | Background flips from `--k-bg-elevated` to `--k-bg-surface`; border becomes `--k-accent`. |
| `outlined` | Border thickens slightly; 4px `--k-accent-subtle` ring appears. |
| `underlined` | Bottom border becomes `--k-accent`. **No ring.** |
| `floating-label` | Label translates up + scales to 0.8, gets `color: var(--k-accent)`, gets a background mask that "notches" the border. |
| `search` | Same as `default`; clear button becomes visible (if value is non-empty). |
| `password` | Same as `default`; eye icon opacity increases. |
| `otp` | The focused cell gets a 2px ring and `z-index: 1` so it visually pops above the unified border. |
| `textarea` | Same as `default`. |
| `with-addon` | Same as `default`; addons stay muted. |

#### Error Behavior (when `data-error="true"`)

- Border: `var(--k-error)` (overrides the focus-ring color and the resting border).
- Focus ring: `var(--k-error-subtle)` (the 4px halo).
- Hint text: `color: var(--k-error)`, `font-weight: var(--k-font-medium)`.
- ARIA: `aria-invalid="true"` on the inner field (or `aria-describedby` on the OTP group).

### Motion Preferences
All transitions respect the user's `prefers-reduced-motion` media query via the global `--k-transition-base` token, which switches to `none` when reduced motion is requested.

---

## 🧩 Advanced Features

### 🛡️ Password Requirements Checklist

When the Input is rendered as a password (`type="password"` or `variant="password"`), a live requirement checklist appears below the field. Each requirement is checked on every input event and visually flips to a green checkmark when met:

- **At least 8 characters** — `v.length >= 8`
- **One uppercase letter** — `/[A-Z]/`
- **One lowercase letter** — `/[a-z]/`
- **One number** — `/\d/`

```html
<!-- Vanilla: Enable the checklist -->
<k-input v="password" label="Choose a password" required></k-input>
```

The checklist uses semantic markers (`data-met="true" | "false"`) on each item so you can style it via custom CSS if needed:

```css
.k-input__req-item[data-met="true"]::before { content: '✓'; }
.k-input__req-item[data-met="false"]::before { content: '○'; }
```

### ⌨️ OTP Auto-Advance & Paste

The OTP variant handles all keyboard ergonomics for you:

- **Auto-advance**: When a digit is typed into cell *n*, focus moves to cell *n+1*.
- **Backspace navigation**: When the current cell is empty and the user hits Backspace, focus moves to the previous cell (typical mobile pattern).
- **Clipboard paste**: Pasting a 6-digit string fills all 6 cells at once, distributing digits left-to-right, and moves focus to the last filled cell. Non-digit characters are stripped (`replace(/\D/g, '')`).
- **Combined value**: The Input's `.value` property returns the joined 6-digit string (e.g., `"123456"`).

```html
<k-input v="otp" label="Verification code"></k-input>

<script>
  document.querySelector('k-input[v*="otp"]').addEventListener('k:input', (e) => {
    if (e.detail.value.length === 6) {
      submitCode(e.detail.value);
    }
  });
</script>
```

### 🔍 Search Clear Button

The `search` variant (and any input with `type="search"`) automatically renders a clear button (`×`) on the right side. The button is hidden when the field is empty and appears the moment the user types.

```html
<k-input v="search" placeholder="Search products..."></k-input>
```

Clicking the clear button:
1. Empties the field (`.value = ''`).
2. Moves focus back to the field (so the user can keep typing).
3. Dispatches a `k:input` event with `value: ''`.

### 👁️ Password Visibility Toggle

The `password` variant (and any input with `type="password"`) automatically renders an eye/eye-off button on the right side. Clicking it toggles the field's `type` between `password` and `text`:

- **Hidden (default)**: Shows the eye icon; field type is `password`.
- **Visible**: Shows the eye-off icon (with a strike-through); field type is `text`.

The button has `aria-label` that flips between `"Show password"` and `"Hide password"` to match the current state. The icon opacity also increases slightly when the password is visible.

```html
<k-input v="password" label="Password" required></k-input>
```

### 🏷️ Label Position

For non-floating-label variants, you can place the label above (`top`, default) or below (`bottom`) the field. For `floating-label`, the label is always positioned absolutely inside the wrapper and animates into the border on focus.

```html
<!-- Label on top (default) -->
<k-input v="outlined" label="Email"></k-input>

<!-- Label on bottom (less common; useful for compact inline forms) -->
<k-input v="outlined" label-position="bottom" label="Notes"></k-input>

<!-- Floating label — the label lives inside the wrapper border when unfocused -->
<k-input v="floating-label" label="Full name" placeholder=" "></k-input>
```

### 🎯 Value API (Programmatic)

Reading and writing the value programmatically is consistent across all variants:

```javascript
const input = document.querySelector('k-input');

// Read
console.log(input.value);    // For OTP: joined 6-digit string. For others: the field value.

// Write
input.value = 'hello';

// React to changes
input.addEventListener('k:input',  (e) => console.log('typing:',  e.detail.value));
input.addEventListener('k:change', (e) => console.log('changed:', e.detail.value));
```

For OTP, setting `value` distributes the digits across the cells:
```javascript
input.value = '123456';
// → cell 0 = '1', cell 1 = '2', ..., cell 5 = '6'
```

---

## ♿ Accessibility & Security (A11y)

The Input component is built with "Security and Accessibility by Default":

- **Stable IDs**: Each Input generates a stable random ID (`k-input-<random>`) at connect time, used to associate the `<label>` (`for=`), the hint (`aria-describedby`), and the inner field. This is critical for screen reader announcements.
- **Label Association**: When a `label` attribute is provided, a real `<label for="...">` element is rendered. For `floating-label`, the label is positioned absolutely but remains semantically associated.
- **ARIA States**:
  - `aria-invalid="true"` is applied when `data-error="true"` is set.
  - `aria-describedby="<id>-hint"` is set when the field has an error and a hint, so the error message is announced by screen readers.
  - `aria-required="true"` is applied when the `required` attribute is set.
  - `aria-busy="true"` is applied when `tokens.loading` is true.
  - For OTP, the group itself has `role="group"` and `aria-label="<label text>"`. Each cell has `aria-label="Digit N of 6"`.
- **Disabled State**: When `tokens.disabled` is true, the inner field's `disabled` property is set (native disabled behavior), `aria-disabled` is implicit, and pointer events are blocked via CSS.
- **Keyboard Navigation**:
  - Standard text/email/password/etc.: All native keyboard interactions (Tab, Shift+Tab, arrow keys, Backspace, etc.) work natively.
  - OTP: Auto-advance on digit, Backspace to previous cell on empty cell.
  - Password toggle and search clear are real `<button>` elements, fully focusable and keyboard-activatable.
- **XSS Prevention**: All user-provided strings (`label`, `hint`, `addonLeft`, `addonRight`, `placeholder`, `validation-message`) are passed through `sanitizeText` before insertion into the DOM. This blocks `<script>` and `<img onerror>`-style injection attempts.
- **Color Independence**: Error states use both color (red border + red hint) **and** text (the hint is replaced with the error message), so users with red-green color blindness can still perceive the error.
- **Motion Accessibility**: All focus and error transitions respect `prefers-reduced-motion`.

---

## 📈 API Reference

### Attributes / Props

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `v` | `string` | `default md primary` | Combined tokens for size, color, variant, radius, etc. |
| `type` | `string` | `text` | Native input type (`text`, `email`, `password`, `tel`, `url`, `number`, `search`, etc.). |
| `label` | `string` | `null` | Label text rendered above/below/inside the field. |
| `placeholder` | `string` | `null` | Placeholder text. Set to ` ` for `floating-label` to enable the float. |
| `hint` | `string` | `null` | Helper text below the field. Replaced with the error message on validation failure. |
| `value` | `string` | `''` | Initial value. Use `.value` property to read/write programmatically. |
| `required` | `boolean` | `false` | Mark the field as required. Skips validation when empty. |
| `disabled` | `boolean` | `false` | Disables interaction. |
| `loading` | `boolean` | `false` | Sets `aria-busy="true"` and applies disabled styling. |
| `error` | `boolean` | `false` | Force the error state. |
| `pattern` | `string` | `null` | Custom regex pattern. Overrides built-in rules for the type. |
| `validation-message` | `string` | built-in | Override the default error message for this instance. |
| `icon` | `IconName \| HTMLElement` | `null` | Icon for the left side. Accepts a registry name or an arbitrary element (React / slot). |
| `iconRight` | `IconName \| HTMLElement` | `null` | Icon for the right side. Overridden by `search`/`password` built-in buttons. |
| `addonLeft` | `string` | `null` | Left addon text (only for `with-addon` variant). |
| `addonRight` | `string` | `null` | Right addon text (only for `with-addon` variant). |
| `label-position` | `'top' \| 'bottom'` | `'top'` | Label position. Ignored for `floating-label`. |
| `name` | `string` | `null` | Native input name attribute (for form submission). |
| `id` | `string` | auto-generated | Native input id. |
| `maxlength` | `number` | `null` | Maximum character count. |
| `minlength` | `number` | `null` | Minimum character count. |
| `onInput` | `(value: string) => void` | `null` | Input event handler. |
| `onChange` | `(value: string) => void` | `null` | Change event handler. |
| `onFocus` | `() => void` | `null` | Focus event handler. |
| `onBlur` | `() => void` | `null` | Blur event handler. |

### Events (Vanilla — namespaced with `k:` prefix, bubbles, composed)

| Event | `event.detail` | Fires when |
| :--- | :--- | :--- |
| `k:input` | `{ value: string }` | The user types or pastes. Also fires when `.value` is set programmatically. |
| `k:change` | `{ value: string }` | The value is committed (typically on blur, or on each OTP cell change). |
| `k:focus` | `{}` | The inner field receives focus. |
| `k:blur` | `{}` | The inner field loses focus. |

### Computed DOM Structure (Vanilla)

For `<k-input v="outlined" label="Email">`, the rendered DOM is:

```html
<k-input data-variant="outlined" data-size="md" data-color="primary" data-label-position="top">
  <div class="k-input__field-group">
    <label class="k-input__label" for="k-input-abc123def">Email</label>
    <div class="k-input__wrapper">
      <input class="k-input__field" id="k-input-abc123def" type="text">
    </div>
    <!-- <span class="k-input__hint">...</span> if hint is provided -->
  </div>
</k-input>
```

For `otp`, the wrapper contains a `k-input__otp-group` with 6 `.k-input__field` inputs.

For `with-addon`, the wrapper contains `k-input__addon` segments on either side of the field.

For `password`, the wrapper also contains a `.k-input__icon-right` span with a `.k-input__password-toggle` button, and the field group contains a `.k-input__pwd-reqs` div with `.k-input__req-item` children.


---

## 🔢 Number Input Component

The Number Input (`<k-number-input>`) is a specialized input component designed for numeric values with built-in increment/decrement controls. It provides professional stepper buttons, keyboard shortcuts, min/max enforcement, decimal precision, thousand separators, and currency/unit formatting.

> **Framework status:** Vanilla `<k-number-input>` Web Component is **fully implemented and production-ready**. React version coming soon.

### Key Features

- **Built-in stepper buttons** — Increment/decrement buttons appear on hover/focus (vertically stacked on the right)
- **Keyboard shortcuts** — ↑/↓ (step), Page Up/Down (step × 10), Home (min), End (max)
- **Min/max enforcement** — Values automatically clamped to valid range
- **Step intervals** — Support for integers and decimals (e.g., 0.5, 0.01)
- **Decimal precision** — Control decimal places (e.g., currency with 2 decimals)
- **Thousand separators** — Format large numbers (e.g., 1,000,000)
- **Prefix/suffix support** — Add currency symbols ($, €), units (kg, %, years)
- **Left icon support** — Add leading icons (⚠️ iconRight NOT supported - reserved for buttons)
- **All standard input features** — Variants, sizes, colors, validation, loading, disabled, error states

### Basic Usage

**Vanilla JavaScript:**
```html
<!-- Basic number input -->
<k-number-input v="outlined md" label="Quantity" value="42"></k-number-input>

<!-- With CSS class -->
<k-number-input v="outlined md .price-input" label="Price" value="99"></k-number-input>
<!-- Result: <k-number-input class="price-input" data-variant="outlined" data-size="md" ...> -->

<!-- With ID -->
<k-number-input v="outlined md #product-quantity" label="Quantity" value="1"></k-number-input>
<!-- Result: <k-number-input id="product-quantity" data-variant="outlined" data-size="md" ...> -->

<!-- With min/max constraints -->
<k-number-input v="outlined md" label="Age" min="0" max="120" value="25"></k-number-input>

<!-- With step intervals -->
<k-number-input v="outlined md" label="Rating" min="0" max="5" step="0.5" value="4.5"></k-number-input>

<!-- Currency with prefix and precision -->
<k-number-input v="outlined md" label="Price" prefix="$" precision="2" value="99.99"></k-number-input>

<!-- Weight with suffix -->
<k-number-input v="outlined md" label="Weight" suffix="kg" value="75"></k-number-input>

<!-- Large numbers with thousand separator -->
<k-number-input v="outlined md separator" label="Population" value="1000000" step="1000"></k-number-input>

<!-- With left icon (icon attribute only - iconRight NOT supported) -->
<k-number-input v="outlined md" label="Amount" icon="home" value="100"></k-number-input>
```

**React:** (Coming soon)
```tsx
import { NumberInput } from '@kenikool/ui';

<NumberInput variant="outlined" size="md" label="Quantity" defaultValue={42} />
<NumberInput variant="outlined" label="Price" prefix="$" precision={2} defaultValue={99.99} />
```

### Attributes

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `value` | `number\|string` | Initial numeric value |
| `defaultValue` | `number\|string` | Default value for form reset |
| `min` | `number` | Minimum allowed value |
| `max` | `number` | Maximum allowed value |
| `step` | `number` | Increment/decrement interval (default: 1) |
| `precision` | `number` | Decimal places (0 = integers only) |
| `prefix` | `string` | Text shown before the number (e.g., "$", "€") |
| `suffix` | `string` | Text shown after the number (e.g., "kg", "%", "years") |
| `icon` | `string` | Left icon name (⚠️ `iconRight` NOT supported) |
| `label` | `string` | Field label text |
| `placeholder` | `string` | Placeholder text |
| `hint` | `string` | Helper text below the field |
| `name` | `string` | Form field name |
| `form` | `string` | Associated form ID |
| `required` | `boolean` | Mark as required |
| `disabled` | `boolean` | Disable the field |
| `readonly` | `boolean` | Make read-only |
| `error` | `boolean` | Force error state |
| `validation-message` | `string` | Custom error message |

### Tokens & Variants

Number Input supports the same token system as regular Input, including `.class` and `#id` selectors.

**Target Selectors (`.class` and `#id`):**
```html
<!-- Add CSS class -->
<k-number-input v="outlined .form-control" label="Amount"></k-number-input>
<!-- Result: <k-number-input class="form-control" data-variant="outlined" ...> -->

<!-- Add ID -->
<k-number-input v="filled #total-price" label="Total"></k-number-input>
<!-- Result: <k-number-input id="total-price" data-variant="filled" ...> -->

<!-- Combine class, ID, and other tokens -->
<k-number-input v="outlined lg .currency-input #main-price" label="Price" prefix="$"></k-number-input>
<!-- Result: <k-number-input class="currency-input" id="main-price" data-variant="outlined" data-size="lg" ...> -->

<!-- Multiple classes -->
<k-number-input v="outlined .input-field .highlight" label="Quantity"></k-number-input>
<!-- Result: <k-number-input class="input-field highlight" ...> -->
```

**Variants:**
```html
<k-number-input v="outlined" label="Outlined"></k-number-input>
<k-number-input v="filled" label="Filled"></k-number-input>
<k-number-input v="soft" label="Soft"></k-number-input>
<k-number-input v="ghost" label="Ghost"></k-number-input>
```

**Sizes:**
```html
<k-number-input v="outlined sm" label="Small"></k-number-input>
<k-number-input v="outlined md" label="Medium (default)"></k-number-input>
<k-number-input v="outlined lg" label="Large"></k-number-input>
```

**Colors:**
```html
<k-number-input v="outlined primary" label="Primary"></k-number-input>
<k-number-input v="outlined success" label="Success"></k-number-input>
<k-number-input v="outlined error" label="Error"></k-number-input>
```

**States:**
```html
<!-- Disabled -->
<k-number-input v="outlined disabled" label="Disabled" value="100"></k-number-input>

<!-- Loading -->
<k-number-input v="outlined loading" label="Processing..."></k-number-input>

<!-- Error state -->
<k-number-input v="outlined" label="Amount" error hint="Value must be positive"></k-number-input>
```

### Thousand Separator Token

Add `separator` to the `v` attribute to format large numbers with commas:

```html
<!-- Without separator: 1000000 -->
<k-number-input v="outlined md" label="Population" value="1000000"></k-number-input>

<!-- With separator: 1,000,000 -->
<k-number-input v="outlined md separator" label="Population" value="1000000"></k-number-input>
```

### Keyboard Shortcuts

The Number Input supports these keyboard shortcuts when focused:

| Key | Action |
| :--- | :--- |
| `↑` (Arrow Up) | Increment by step |
| `↓` (Arrow Down) | Decrement by step |
| `Page Up` | Increment by step × 10 |
| `Page Down` | Decrement by step × 10 |
| `Home` | Jump to min value |
| `End` | Jump to max value |

```html
<!-- Example with keyboard shortcuts -->
<k-number-input v="outlined md" label="Volume" min="0" max="100" step="5" value="50"></k-number-input>
<!-- Press ↑: value becomes 55 -->
<!-- Press Page Up: value becomes 105 (clamped to max 100) -->
<!-- Press Home: value becomes 0 -->
```

### Stepper Button Behavior

The increment/decrement buttons:
- **Hidden by default** — Appear only on hover or focus
- **Prevent focus loss** — Clicking buttons doesn't blur the input
- **Respect constraints** — Automatically disabled at min/max values
- **Work when readonly** — Disabled when field is readonly or disabled
- **Native spinners hidden** — Browser default number spinners are removed

### Icon Support

⚠️ **IMPORTANT: Only left icon is supported**

The right side is reserved for increment/decrement buttons. If you try to use `iconRight`, you'll get a console warning and the attribute will be removed.

```html
<!-- ✅ CORRECT - Left icon -->
<k-number-input v="outlined md" icon="home" label="Amount" value="100"></k-number-input>

<!-- ❌ WRONG - Right icon NOT supported -->
<k-number-input v="outlined md" iconRight="check" label="Amount" value="100"></k-number-input>
<!-- Console warning: "[k-number-input] iconRight is not supported. The right side is reserved 
     for increment/decrement buttons. Use 'icon' attribute for left icon only." -->
```

### Prefix & Suffix Examples

**Currency:**
```html
<!-- US Dollars -->
<k-number-input v="outlined md" label="Price" prefix="$" precision="2" value="99.99"></k-number-input>

<!-- Euros -->
<k-number-input v="outlined md" label="Price" prefix="€" precision="2" value="89.50"></k-number-input>

<!-- British Pounds -->
<k-number-input v="outlined md" label="Price" prefix="£" precision="2" value="79.99"></k-number-input>
```

**Units:**
```html
<!-- Weight -->
<k-number-input v="outlined md" label="Weight" suffix="kg" value="75"></k-number-input>

<!-- Percentage -->
<k-number-input v="outlined md" label="Interest Rate" suffix="%" precision="1" value="3.5"></k-number-input>

<!-- Time -->
<k-number-input v="outlined md" label="Loan Term" suffix="years" value="30"></k-number-input>

<!-- Distance -->
<k-number-input v="outlined md" label="Distance" suffix="km" precision="1" value="42.2"></k-number-input>
```

**Combined prefix and suffix:**
```html
<!-- Not recommended - visual clutter -->
<k-number-input v="outlined md" label="Exchange Rate" 
                 prefix="1 USD = " suffix=" EUR" precision="4" value="0.9234"></k-number-input>
```

### Precision Control

Control decimal places with the `precision` attribute:

```html
<!-- Integers only (precision="0" is default) -->
<k-number-input v="outlined md" label="Quantity" value="42"></k-number-input>

<!-- Currency (2 decimals) -->
<k-number-input v="outlined md" label="Price" prefix="$" precision="2" value="99.99"></k-number-input>

<!-- Scientific measurements (4 decimals) -->
<k-number-input v="outlined md" label="pH Level" precision="4" value="7.4150"></k-number-input>

<!-- Percentage (1 decimal) -->
<k-number-input v="outlined md" label="Tax Rate" suffix="%" precision="1" value="8.5"></k-number-input>
```

### Form Integration

Number Input is form-associated and works with native form submission:

```html
<form id="product-form" action="/products" method="POST">
  <k-number-input v="outlined md" name="quantity" label="Quantity" 
                   min="1" max="999" value="1" required></k-number-input>
                   
  <k-number-input v="outlined md" name="price" label="Price" 
                   prefix="$" precision="2" value="0.00" required></k-number-input>
                   
  <button type="submit">Add to Cart</button>
</form>

<script>
  const form = document.getElementById('product-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    console.log('Quantity:', formData.get('quantity')); // "1"
    console.log('Price:', formData.get('price'));       // "0.00"
  });
</script>
```

### Events

Number Input dispatches custom events:

**`k:change`** — Fires when the value changes (via buttons, keyboard, or direct input)
```javascript
const input = document.querySelector('k-number-input');
input.addEventListener('k:change', (e) => {
  console.log('New value:', e.detail.value); // numeric value or null
});
```

**`k:increment`** — Fires specifically when incremented
```javascript
input.addEventListener('k:increment', (e) => {
  console.log('Incremented to:', e.detail.value);
});
```

**`k:decrement`** — Fires specifically when decremented
```javascript
input.addEventListener('k:decrement', (e) => {
  console.log('Decremented to:', e.detail.value);
});
```

### Programmatic Access

Access and modify the value programmatically:

```javascript
const input = document.querySelector('k-number-input');

// Get current value (returns number or null)
console.log(input.value); // 42

// Set value (automatically clamped to min/max and formatted)
input.value = 100;

// Set to null (clears the field)
input.value = null;

// Check validity
if (input.checkValidity()) {
  console.log('Valid!');
}

// Get associated form
console.log(input.form); // <form> element or null
```

### Dynamic Value Updates

The Number Input supports dynamic/programmatic value updates with automatic formatting and validation:

```javascript
const priceInput = document.querySelector('k-number-input[name="price"]');
const quantityInput = document.querySelector('k-number-input[name="quantity"]');
const totalDisplay = document.getElementById('total');

// Update total when either input changes
function updateTotal() {
  const price = priceInput.value || 0;
  const quantity = quantityInput.value || 0;
  const total = price * quantity;
  
  // Update display
  totalDisplay.textContent = `$${total.toFixed(2)}`;
}

// Listen for changes
priceInput.addEventListener('k:change', updateTotal);
quantityInput.addEventListener('k:change', updateTotal);

// Programmatically set values (useful for loading saved data)
priceInput.value = 29.99;  // Automatically formatted to "29.99"
quantityInput.value = 5;   // Stays as "5"

// Values are automatically clamped to min/max
quantityInput.setAttribute('max', '10');
quantityInput.value = 100;  // Automatically clamped to 10

// Clear values
priceInput.value = null;    // Clears the field
```

**Real-world examples:**

**1. Load saved form data:**
```javascript
// Load user preferences from localStorage
const savedData = JSON.parse(localStorage.getItem('loan-calculator')) || {};

document.querySelector('k-number-input[name="amount"]').value = savedData.amount || 100000;
document.querySelector('k-number-input[name="rate"]').value = savedData.rate || 3.5;
document.querySelector('k-number-input[name="term"]').value = savedData.term || 30;
```

**2. Sync related inputs:**
```javascript
// Convert between units (kg ↔ lbs)
const kgInput = document.querySelector('#weight-kg');
const lbsInput = document.querySelector('#weight-lbs');

kgInput.addEventListener('k:change', (e) => {
  if (e.detail.value !== null) {
    lbsInput.value = e.detail.value * 2.20462;
  }
});

lbsInput.addEventListener('k:change', (e) => {
  if (e.detail.value !== null) {
    kgInput.value = e.detail.value / 2.20462;
  }
});
```

**3. Apply discounts:**
```javascript
const originalPrice = document.querySelector('#original-price');
const discountPercent = document.querySelector('#discount');
const finalPrice = document.querySelector('#final-price');

function applyDiscount() {
  const original = originalPrice.value || 0;
  const discount = discountPercent.value || 0;
  const final = original * (1 - discount / 100);
  
  finalPrice.value = final;
}

originalPrice.addEventListener('k:change', applyDiscount);
discountPercent.addEventListener('k:change', applyDiscount);

// Set initial values
originalPrice.value = 199.99;
discountPercent.value = 20;
applyDiscount(); // finalPrice becomes 159.99
```

**4. Range slider sync:**
```javascript
const rangeSlider = document.querySelector('input[type="range"]');
const numberInput = document.querySelector('k-number-input');

// Sync slider → number input
rangeSlider.addEventListener('input', (e) => {
  numberInput.value = parseInt(e.target.value);
});

// Sync number input → slider
numberInput.addEventListener('k:change', (e) => {
  if (e.detail.value !== null) {
    rangeSlider.value = e.detail.value;
  }
});
```

**5. Batch update from API:**
```javascript
async function loadProductData(productId) {
  const response = await fetch(`/api/products/${productId}`);
  const product = await response.json();
  
  // Update all number inputs at once
  document.querySelector('#product-price').value = product.price;
  document.querySelector('#product-stock').value = product.stock;
  document.querySelector('#product-weight').value = product.weight;
  document.querySelector('#product-rating').value = product.rating;
}
```

**Important notes:**
- Setting `value` automatically clamps to `min`/`max` constraints
- Setting `value` automatically formats with precision and separators
- Setting `value` triggers `_updateButtonStates()` and `_updateValidState()`
- Setting `value` updates the form value via `ElementInternals`
- Setting `value = null` clears the field completely
- Getting `value` returns `number | null` (null if empty or invalid)

### Accessibility

Number Input is fully accessible:

- **ARIA attributes** — `aria-valuemin`, `aria-valuemax`, `aria-valuenow` automatically set
- **Screen reader support** — Button labels announce "Increase value" / "Decrease value"
- **Keyboard navigation** — Full keyboard control with arrow keys and shortcuts
- **Focus management** — Clicking stepper buttons doesn't remove focus from input
- **Error states** — `aria-invalid="true"` when validation fails
- **Required fields** — `aria-required="true"` when marked required

### Comparison: Number Input vs Regular Input

| Feature | `<k-input type="number">` | `<k-number-input>` |
| :--- | :--- | :--- |
| Basic numeric input | ✅ | ✅ |
| Stepper buttons | ❌ (browser default only) | ✅ Professional styled |
| Keyboard shortcuts | ❌ | ✅ (↑↓, PgUp/PgDn, Home/End) |
| Min/max enforcement | ✅ | ✅ (automatic clamping) |
| Step intervals | ✅ | ✅ |
| Decimal precision | ❌ | ✅ |
| Thousand separators | ❌ | ✅ |
| Prefix/suffix | ❌ | ✅ |
| Button on hover only | ❌ | ✅ |
| Icon support | ✅ (left & right) | ✅ (left only) |

**When to use which:**
- Use `<k-input type="number">` for simple numeric fields where browser defaults are sufficient
- Use `<k-number-input>` for professional forms requiring formatted numbers, currency, measurements, or enhanced UX

### Examples

**E-commerce Product Quantity:**
```html
<k-number-input v="outlined md" 
                 label="Quantity" 
                 min="1" 
                 max="99" 
                 value="1"
                 required></k-number-input>
```

**Loan Calculator:**
```html
<k-number-input v="filled lg separator" 
                 label="Loan Amount" 
                 prefix="$" 
                 min="1000" 
                 max="1000000" 
                 step="1000" 
                 value="246000"
                 precision="0"></k-number-input>

<k-number-input v="filled lg" 
                 label="Interest Rate" 
                 suffix="%" 
                 min="0" 
                 max="20" 
                 step="0.1" 
                 value="3.5"
                 precision="1"></k-number-input>

<k-number-input v="filled lg" 
                 label="Loan Term" 
                 suffix="years" 
                 min="1" 
                 max="40" 
                 value="30"></k-number-input>
```

**Recipe Ingredient:**
```html
<k-number-input v="outlined sm" 
                 label="Flour" 
                 suffix="cups" 
                 min="0" 
                 max="10" 
                 step="0.25" 
                 value="2.5"
                 precision="2"></k-number-input>
```

**Shipping Weight:**
```html
<k-number-input v="outlined md" 
                 label="Package Weight" 
                 suffix="kg" 
                 min="0.1" 
                 max="30" 
                 step="0.1" 
                 value="1.5"
                 precision="1"
                 icon="home"></k-number-input>
```

### Styling Notes

- Stepper buttons use `opacity: 0` by default and transition to `opacity: 1` on wrapper hover/focus
- Buttons are absolutely positioned inside the wrapper on the right side
- Native browser number spinners are hidden with CSS (`::-webkit-inner-spin-button`, `-moz-appearance`)
- Suffix has `margin-right` spacing to prevent overlap with buttons
- Field has right padding to accommodate buttons (calculated as `48px + var(--k-space-4)`)

---
---

# 📅 Date Input Component

The Date Input is a dedicated date-entry component with a built-in calendar picker overlay. It supports multiple date formats, keyboard navigation, min/max constraints, and dynamic date shortcuts. The component handles all date logic internally — developers provide simple attributes, and the Date Input manages the rest.

> **Framework status:** Both Vanilla `<k-date>` Web Component and React `<Date />` are **fully implemented and production-ready**. The component includes form integration, validation, accessibility, keyboard navigation, and dynamic date shortcuts via the `addOn` attribute.

---

## 🚀 Basic Usage (No Tokens)

### Vanilla JavaScript
A plain date input with a calendar picker. Click the input field or press Arrow Down to open the calendar overlay.

```html
<!-- Simple date picker -->
<k-date label="Select a date" placeholder="MM/DD/YYYY"></k-date>

<!-- Date field with specific format -->
<k-date label="Birth date" format="DD/MM/YYYY" placeholder="25/12/2024"></k-date>

<!-- Required date field -->
<k-date label="Event date" required placeholder="MM/DD/YYYY"></k-date>

<!-- Future dates only (past dates disabled) -->
<k-date label="Meeting date" disablePast placeholder="MM/DD/YYYY"></k-date>

<!-- Past dates only (future dates disabled) -->
<k-date label="Birth date" disableFuture placeholder="MM/DD/YYYY"></k-date>
```

### React
```tsx
import { Date as DateInput } from '@kenikool/ui';

// Simple date picker
<DateInput label="Select a date" placeholder="MM/DD/YYYY" />

// Date field with specific format
<DateInput label="Birth date" format="DD/MM/YYYY" placeholder="25/12/2024" />

// Required date field
<DateInput label="Event date" required placeholder="MM/DD/YYYY" />

// Future dates only
<DateInput label="Meeting date" disablePast placeholder="MM/DD/YYYY" />
```

> The `v` attribute is optional. When omitted, the Date Input renders with the default variant and format. Add tokens only when you want to override appearance.

---

## 📋 Complete Token Usage Guide

This section shows how to combine tokens to create any date input variant. Tokens are composable — order doesn't matter in the `v` attribute.

### 🎯 Target Selectors (`.class` and `#id`)

The `v` attribute supports CSS selectors for automatic DOM placement and CSS class/ID assignment.

**Vanilla:**
```html
<!-- Add a CSS class to the input -->
<k-date v="outlined .form-field" label="Date" placeholder="MM/DD/YYYY"></k-date>

<!-- Add an ID -->
<k-date v="filled #meeting-date" label="Meeting" placeholder="MM/DD/YYYY"></k-date>

<!-- Combine class, id, and variant tokens -->
<k-date v="outlined lg .date-picker #event-date">Date</k-date>
```

**React:**
```tsx
<DateInput variant="outlined" className="form-field" label="Date" placeholder="MM/DD/YYYY" />
<DateInput variant="filled" id="meeting-date" label="Meeting" placeholder="MM/DD/YYYY" />
```

### 1️⃣ Variants

The Date Input supports 4 appearance variants: `default`, `filled`, `soft`, `ghost`.

**Vanilla:**
```html
<!-- 1. Default — clean and subtle (default variant) -->
<k-date v="default" label="Date" placeholder="MM/DD/YYYY"></k-date>

<!-- 2. Filled — solid background for depth -->
<k-date v="filled" label="Date" placeholder="MM/DD/YYYY"></k-date>

<!-- 3. Soft — subtle background with soft border -->
<k-date v="soft" label="Date" placeholder="MM/DD/YYYY"></k-date>

<!-- 4. Ghost — text-only, minimal styling -->
<k-date v="ghost" label="Date" placeholder="MM/DD/YYYY"></k-date>
```

**React:**
```tsx
<DateInput variant="default" label="Date" />
<DateInput variant="filled" label="Date" />
<DateInput variant="soft" label="Date" />
<DateInput variant="ghost" label="Date" />
```

> The Date Input component does not support `outlined`, `underlined`, `floating-label`, `search`, `password`, `otp`, `textarea`, or `with-addon` variants — it's a dedicated date picker with 4 core variants optimized for date entry.

### 2️⃣ Sizes

Scale from `xs` (extra small) to `xl` (extra large). Default is `md`.

**Vanilla:**
```html
<k-date v="outlined xs" label="Extra Small" placeholder="MM/DD/YYYY"></k-date>
<k-date v="outlined sm" label="Small" placeholder="MM/DD/YYYY"></k-date>
<k-date v="outlined md" label="Medium (default)" placeholder="MM/DD/YYYY"></k-date>
<k-date v="outlined lg" label="Large" placeholder="MM/DD/YYYY"></k-date>
<k-date v="outlined xl" label="Extra Large" placeholder="MM/DD/YYYY"></k-date>
```

**React:**
```tsx
<DateInput variant="outlined" size="xs" label="Extra Small" />
<DateInput variant="outlined" size="sm" label="Small" />
<DateInput variant="outlined" size="md" label="Medium" />
<DateInput variant="outlined" size="lg" label="Large" />
<DateInput variant="outlined" size="xl" label="Extra Large" />
```

### 3️⃣ Colors

Semantic colors: `primary` (default), `success`, `warning`, `error`, `info`, `default`.

**Vanilla:**
```html
<!-- Primary (default) — uses --k-accent for the focus ring -->
<k-date v="outlined primary" label="Date" placeholder="MM/DD/YYYY"></k-date>

<!-- Other colors -->
<k-date v="outlined success" label="Date" placeholder="MM/DD/YYYY"></k-date>
<k-date v="outlined warning" label="Date" placeholder="MM/DD/YYYY"></k-date>
<k-date v="outlined error" label="Date" placeholder="MM/DD/YYYY"></k-date>
<k-date v="outlined info" label="Date" placeholder="MM/DD/YYYY"></k-date>
```

**React:**
```tsx
<DateInput variant="outlined" color="primary" label="Date" />
<DateInput variant="outlined" color="success" label="Date" />
<DateInput variant="outlined" color="warning" label="Date" />
<DateInput variant="outlined" color="error" label="Date" />
<DateInput variant="outlined" color="info" label="Date" />
```

### 4️⃣ Border Radius

Round corners: `r-none`, `r-sm`, `r-md` (default), `r-lg`, `r-full` (pill shape).

**Vanilla:**
```html
<k-date v="outlined r-none" label="Sharp" placeholder="MM/DD/YYYY"></k-date>
<k-date v="outlined r-sm" label="Slight" placeholder="MM/DD/YYYY"></k-date>
<k-date v="outlined r-md" label="Standard" placeholder="MM/DD/YYYY"></k-date>
<k-date v="outlined r-lg" label="Large" placeholder="MM/DD/YYYY"></k-date>
<k-date v="outlined r-full" label="Pill" placeholder="MM/DD/YYYY"></k-date>
```

**React:**
```tsx
<DateInput variant="outlined" radius="none" label="Sharp" />
<DateInput variant="outlined" radius="sm" label="Slight" />
<DateInput variant="outlined" radius="md" label="Standard" />
<DateInput variant="outlined" radius="lg" label="Large" />
<DateInput variant="outlined" radius="full" label="Pill" />
```

### 5️⃣ States

State flags: `disabled`, `loading`, `full`. Plus the **error** state for validation feedback.

**Vanilla:**
```html
<!-- Disabled — grayed out, not editable -->
<k-date v="outlined disabled" label="Disabled" value="2024-06-15"></k-date>

<!-- Loading — renders loader overlay, sets aria-busy -->
<k-date v="outlined loading" label="Loading..."></k-date>

<!-- Full width — 100% of container (default for <k-date>) -->
<k-date v="outlined full" label="Full Width" placeholder="MM/DD/YYYY"></k-date>

<!-- Error state (validation failed) -->
<k-date v="outlined" label="Date" placeholder="MM/DD/YYYY" error hint="Invalid date selected"></k-date>
```

**React:**
```tsx
<DateInput variant="outlined" disabled={true} label="Disabled" defaultValue="2024-06-15" />
<DateInput variant="outlined" loading={true} label="Loading..." />
<DateInput variant="outlined" full={true} label="Full Width" />
<DateInput variant="outlined" label="Date" error={true} hint="Invalid date selected" />
```

### 6️⃣ Width Utilities

Control input width: `w-full`, `w-auto`, `w-fit`, `w-screen`, `w-N` (spacing scale).

**Vanilla:**
```html
<k-date v="outlined w-full" label="Full" placeholder="MM/DD/YYYY"></k-date>
<k-date v="outlined w-auto" label="Auto" placeholder="MM/DD/YYYY"></k-date>
<k-date v="outlined w-fit" label="Fit" placeholder="MM/DD/YYYY"></k-date>
<k-date v="outlined w-64" label="16rem wide" placeholder="MM/DD/YYYY"></k-date>
```

**React:**
```tsx
<DateInput variant="outlined" width="full" label="Full" />
<DateInput variant="outlined" width="auto" label="Auto" />
<DateInput variant="outlined" width="fit" label="Fit" />
```

### 7️⃣ Border & Shadow Utilities

Add or remove borders and shadows:

**Vanilla:**
```html
<!-- With explicit border -->
<k-date v="outlined bdr" label="With Border" placeholder="MM/DD/YYYY"></k-date>

<!-- No border (for minimal styling) -->
<k-date v="ghost bdr-none" label="No Border" placeholder="MM/DD/YYYY"></k-date>

<!-- With shadow depth -->
<k-date v="filled shd-sm" label="Soft Shadow" placeholder="MM/DD/YYYY"></k-date>
<k-date v="filled shd-lg" label="Large Shadow" placeholder="MM/DD/YYYY"></k-date>
```

**React:**
```tsx
<DateInput variant="outlined" border="true" label="With Border" />
<DateInput variant="ghost" border="none" label="No Border" />
<DateInput variant="filled" shadow="sm" label="Soft Shadow" />
```

---

## 📅 Date-Specific Attributes

### Display Format

The `format` attribute controls how dates are displayed in the input field. The value is stored internally in ISO format (`YYYY-MM-DD`), but users see the format you specify.

**Vanilla:**
```html
<!-- US format: MM/DD/YYYY (12/25/2024) -->
<k-date v="outlined" label="Date (US)" format="MM/DD/YYYY" placeholder="12/25/2024"></k-date>

<!-- European format: DD/MM/YYYY (25/12/2024) -->
<k-date v="outlined" label="Date (EU)" format="DD/MM/YYYY" placeholder="25/12/2024"></k-date>

<!-- ISO format: YYYY-MM-DD (2024-12-25) -->
<k-date v="outlined" label="Date (ISO)" format="YYYY-MM-DD" placeholder="2024-12-25"></k-date>
```

**React:**
```tsx
<DateInput variant="outlined" label="Date (US)" format="MM/DD/YYYY" />
<DateInput variant="outlined" label="Date (EU)" format="DD/MM/YYYY" />
<DateInput variant="outlined" label="Date (ISO)" format="YYYY-MM-DD" />
```

> Default format is `MM/DD/YYYY`. The input validates the typed format and converts to ISO internally.

### Min & Max Dates

Restrict the date range with `min` and `max` attributes (ISO format: `YYYY-MM-DD`).

**Vanilla:**
```html
<!-- Date range: January 1 to December 31, 2024 -->
<k-date v="outlined" label="Project Timeline" min="2024-01-01" max="2024-12-31" placeholder="MM/DD/YYYY"></k-date>

<!-- Specific start date -->
<k-date v="outlined" label="Future Event" min="2024-12-01" placeholder="MM/DD/YYYY"></k-date>

<!-- Specific end date -->
<k-date v="outlined" label="Historical Date" max="2020-12-31" placeholder="MM/DD/YYYY"></k-date>
```

**React:**
```tsx
<DateInput variant="outlined" label="Project Timeline" min="2024-01-01" max="2024-12-31" />
<DateInput variant="outlined" label="Future Event" min="2024-12-01" />
<DateInput variant="outlined" label="Historical Date" max="2020-12-31" />
```

### Disable Past/Future Dates

Quick flags to disable past or future dates relative to today:

**Vanilla:**
```html
<!-- Disable all past dates (today and later only) -->
<k-date v="outlined" label="Meeting Date" disablePast placeholder="MM/DD/YYYY"></k-date>

<!-- Disable all future dates (today and earlier only) -->
<k-date v="outlined" label="Birth Date" disableFuture placeholder="MM/DD/YYYY"></k-date>

<!-- Combine with min/max for precise control -->
<k-date v="outlined" label="Booking" disablePast min="2024-06-20" placeholder="MM/DD/YYYY"></k-date>
```

**React:**
```tsx
<DateInput variant="outlined" label="Meeting Date" disablePast placeholder="MM/DD/YYYY" />
<DateInput variant="outlined" label="Birth Date" disableFuture placeholder="MM/DD/YYYY" />
<DateInput variant="outlined" label="Booking" disablePast min="2024-06-20" />
```

> `disablePast` and `disableFuture` are evaluated dynamically based on the user's device date. They recalculate every time the calendar opens, so dates that were disabled yesterday may be enabled today (if past) or vice versa.

### Quick Date Shortcuts with `addOn`

The `addOn` attribute accepts a JSON array of quick-select buttons that appear in the calendar footer. Each shortcut calculates relative to today (`daysFromNow`), so dates are always dynamic and update daily.

**Vanilla:**
```html
<!-- Custom shortcuts: Event registration -->
<k-date v="outlined" label="Event Date" disablePast placeholder="MM/DD/YYYY"
  addOn='[{"label":"This Weekend","daysFromNow":2},{"label":"Next Week","daysFromNow":7}]'>
</k-date>

<!-- Custom shortcuts: Hotel booking -->
<k-date v="outlined" label="Check-in" disablePast placeholder="MM/DD/YYYY"
  addOn='[{"label":"Tonight","daysFromNow":0},{"label":"Tomorrow","daysFromNow":1},{"label":"This Weekend","daysFromNow":2}]'>
</k-date>

<!-- Custom shortcuts: Medical appointment -->
<k-date v="outlined" label="Appointment" disablePast placeholder="MM/DD/YYYY"
  addOn='[{"label":"Tomorrow","daysFromNow":1},{"label":"Next Week","daysFromNow":7},{"label":"In 2 Weeks","daysFromNow":14}]'>
</k-date>
```

**React:**
```tsx
const eventShortcuts = [
  { label: "This Weekend", daysFromNow: 2 },
  { label: "Next Week", daysFromNow: 7 }
];

<DateInput 
  variant="outlined" 
  label="Event Date" 
  disablePast 
  addOn={eventShortcuts}
/>
```

> **Important:** All dates in `addOn` are **dynamic and relative to today**. If today is June 18, 2026, then `"daysFromNow":0` means June 18. If the user returns tomorrow, `"daysFromNow":0` means June 19. This ensures shortcuts always reflect real-time relative dates, not hardcoded absolute dates. Dates recalculate every time the calendar opens.

### Icons

The `icon` attribute adds a leading icon. Built-in icon names: `search`, `user`, `bell`, `home`, `settings`, `eye`, `eye-off`, `close`, `check`, `chevronDown`, `arrow-right`, `sun`, `moon`, `dracula`.

**Vanilla:**
```html
<!-- Bell icon (good for appointments) -->
<k-date v="outlined" icon="bell" label="Appointment" placeholder="MM/DD/YYYY"></k-date>

<!-- Clock icon (for time-sensitive dates) -->
<k-date v="outlined" icon="home" label="Meeting" placeholder="MM/DD/YYYY"></k-date>
```

**React:**
```tsx
<DateInput variant="outlined" icon="bell" label="Appointment" />
<DateInput variant="outlined" icon="home" label="Event" />
```

---

## ⌨️ Keyboard Navigation

The Date Input supports full keyboard accessibility:

| Key | Action |
| :--- | :--- |
| Arrow Down / Space | Open calendar overlay |
| Escape | Close calendar overlay |
| Arrow Left / Right | Previous / Next day (in calendar) |
| Arrow Up / Down | Previous / Next week (in calendar) |
| Page Up / Page Down | Previous / Next month |
| Home | First day of the month |
| End | Last day of the month |
| Enter | Select highlighted date |

**Vanilla:**
```html
<k-date v="outlined lg" label="Try Keyboard Navigation" placeholder="MM/DD/YYYY" 
  hint="Use arrow keys to navigate the calendar. Space or Arrow Down to open."></k-date>
```

---

## ✅ Validation & States

### Error State

Set the `error` attribute to show validation feedback:

**Vanilla:**
```html
<k-date v="outlined" label="Date" placeholder="MM/DD/YYYY" error hint="Please select a valid date"></k-date>
```

**React:**
```tsx
<DateInput variant="outlined" label="Date" error={true} hint="Please select a valid date" />
```

### Valid Success State

When a valid date is selected, a green checkmark appears automatically.

### Loading State

**Vanilla:**
```html
<k-date v="outlined loading" label="Checking availability..." placeholder="MM/DD/YYYY"></k-date>
```

**React:**
```tsx
<DateInput variant="outlined" loading={true} label="Checking availability..." />
```

### Disabled State

**Vanilla:**
```html
<k-date v="outlined disabled" label="Disabled" value="2024-06-15"></k-date>
```

**React:**
```tsx
<DateInput variant="outlined" disabled={true} label="Disabled" defaultValue="2024-06-15" />
```

---

## 📋 Form Integration & Standard HTML Attributes

The Date Input is **form-associated** — it participates in native HTML form submission using the ElementInternals API. All standard form attributes are bridged to the inner input element.

### Form-Associated Custom Element

**Vanilla:**
```html
<form id="event-form" action="/register" method="POST">
  <k-date v="outlined" name="event_date" label="Event Date" required placeholder="MM/DD/YYYY"></k-date>
  <k-button type="submit">Register</k-button>
</form>

<script>
  const form = document.getElementById('event-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    console.log('Event Date:', formData.get('event_date')); // ISO format: YYYY-MM-DD
  });
</script>
```

**React:**
```tsx
<form onSubmit={(e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  console.log('Event Date:', formData.get('event_date'));
}}>
  <DateInput 
    name="event_date" 
    label="Event Date" 
    required 
    placeholder="MM/DD/YYYY" 
  />
  <button type="submit">Register</button>
</form>
```

### Standard HTML Attributes

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Form field name for submission |
| `form` | `string` | ID of the form to associate with |
| `placeholder` | `string` | Placeholder text when empty |
| `value` | `string` | Initial date value (ISO format: `YYYY-MM-DD`) |
| `defaultValue` | `string` | Default value for form reset |
| `required` | `boolean` | Mark field as required |
| `disabled` | `boolean` | Disable the field |
| `readonly` | `boolean` | Make field read-only (focusable but not editable) |
| `autofocus` | `boolean` | Auto-focus on page load |

---

## 🌍 Real-World Examples

### Event Registration with Dynamic Dates

```html
<k-date v="outlined lg" label="Event Date" disablePast placeholder="MM/DD/YYYY"
  addOn='[{"label":"This Weekend","daysFromNow":2},{"label":"Next Week","daysFromNow":7}]'
  hint="Select a date from the suggestions or open the calendar">
</k-date>
```

### Hotel Check-in Booking

```html
<k-stack v="gap-3">
  <k-date v="outlined" label="Check-in Date" disablePast placeholder="MM/DD/YYYY"
    addOn='[{"label":"Tonight","daysFromNow":0},{"label":"Tomorrow","daysFromNow":1},{"label":"This Weekend","daysFromNow":2}]'>
  </k-date>
  <k-date v="outlined" label="Check-out Date" disablePast placeholder="MM/DD/YYYY"
    addOn='[{"label":"Tomorrow","daysFromNow":1},{"label":"Next Week","daysFromNow":7}]'>
  </k-date>
</k-stack>
```

### Medical Appointment Scheduling

```html
<form id="appointment-form">
  <k-stack v="gap-3">
    <k-date v="outlined" name="appointment_date" label="Preferred Date" 
      disablePast required placeholder="MM/DD/YYYY"
      addOn='[{"label":"Tomorrow","daysFromNow":1},{"label":"Next Week","daysFromNow":7},{"label":"In 2 Weeks","daysFromNow":14}]'
      hint="Choose your preferred appointment date">
    </k-date>
    <k-button type="submit" v="filled primary">Schedule Appointment</k-button>
  </k-stack>
</form>
```

### Project Deadline with Sprint Shortcuts

```html
<k-date v="outlined" label="Sprint Deadline" disablePast placeholder="MM/DD/YYYY"
  addOn='[{"label":"End of Sprint","daysFromNow":14},{"label":"Release Day","daysFromNow":21},{"label":"Retrospective","daysFromNow":22}]'
  hint="Deadlines are relative to today and recalculate daily">
</k-date>
```

### Birth Date (Disable Future Dates)

```html
<k-date v="outlined" label="Birth Date" disableFuture placeholder="DD/MM/YYYY" format="DD/MM/YYYY" required></k-date>
```

### Date Range (Trip Planning)

```html
<form id="trip-form">
  <k-stack v="gap-3">
    <k-date v="outlined" name="start_date" label="Trip Start" disablePast placeholder="MM/DD/YYYY" required></k-date>
    <k-date v="outlined" name="end_date" label="Trip End" disablePast placeholder="MM/DD/YYYY" required></k-date>
    <k-button type="submit" v="filled primary">Plan Trip</k-button>
  </k-stack>
</form>
```

---

## 🎯 Tips & Best Practices

- **Use `disablePast` for future bookings** (meetings, appointments, reservations) to prevent selecting past dates.
- **Use `disableFuture` for historical dates** (birth dates, past events) to prevent selecting future dates.
- **Use `addOn` with relative `daysFromNow` values** to provide context-specific shortcuts. Dates recalculate daily, so they stay relevant.
- **Format dates for your region** — use `format="DD/MM/YYYY"` for Europe, `format="MM/DD/YYYY"` for US, `format="YYYY-MM-DD"` for ISO/technical contexts.
- **Test the calendar overlay positioning** — the component automatically positions the calendar above or below based on available space.
- **Keyboard navigation is built-in** — users can open the calendar with Space or Arrow Down and navigate with arrow keys. No additional setup needed.
---

# 📁 File Component (`<k-file>`)

The File component is a professional file upload element with full drag-and-drop support, file validation, upload progress tracking, responsive preview grid, and integrated lightbox gallery for images. It honors the same `v` attribute token system as Input, supports variants, sizes, colors, border radius, and integrates seamlessly with HTML forms.

> **Framework status:** `<k-file>` Web Component is **fully implemented and production-ready**. Supports drag-drop, file validation, progress tracking, responsive grid layout (1 col mobile → 3 col desktop), integrated lightbox gallery with keyboard navigation, and comprehensive accessibility.

---

## 🚀 Basic Usage (No Tokens)

### Vanilla JavaScript
A plain file input with sensible defaults: `default` variant, `md` size, automatic drag-drop zone, and upload simulation.

```html
<!-- Basic file upload — accepts any file type -->
<k-file label="Upload File"></k-file>

<!-- Images only -->
<k-file label="Select Image" accept="image/*"></k-file>

<!-- Specific document formats -->
<k-file label="Upload Document" accept=".pdf,.doc,.docx" maxSize="5242880"></k-file>

<!-- Multiple files with limit -->
<k-file label="Upload Files" accept="*" multiple maxFiles="5"></k-file>

<!-- Required file (enforces selection) -->
<k-file label="Profile Picture" accept="image/*" required></k-file>
```

> The `v` attribute is optional. When omitted, the File component renders with default styling. Add tokens only when you want to customize appearance or behavior.

---

## 📋 Complete Token Usage Guide

This section shows how to combine tokens to create any file upload variant. **Tokens are composable** — you can mix and match them. Order doesn't matter in the `v` attribute.

### 1️⃣ Variants

The File component appearance: `default`, `filled`, `outlined`, `soft`, `ghost`.

```html
<!-- Default — clean and subtle (minimal styling) -->
<k-file v="default" label="Choose file"></k-file>

<!-- Filled — solid background for depth -->
<k-file v="filled" label="Choose file"></k-file>

<!-- Outlined — transparent background, 1.5px border -->
<k-file v="outlined" label="Choose file"></k-file>

<!-- Soft — muted background, no visible border -->
<k-file v="soft" label="Choose file"></k-file>

<!-- Ghost — ultra-minimal, barely visible until hover -->
<k-file v="ghost" label="Choose file"></k-file>
```

> All variants support drag-drop, file previews, and lightbox integration equally. Variants only affect the visual styling of the drop zone.

### 2️⃣ Sizes

Scale from `xs` (extra small) to `xl` (extra large). Default is `md`.

```html
<k-file v="outlined xs" label="Extra Small"></k-file>
<k-file v="outlined sm" label="Small"></k-file>
<k-file v="outlined md" label="Medium (default)"></k-file>
<k-file v="outlined lg" label="Large"></k-file>
<k-file v="outlined xl" label="Extra Large"></k-file>
```

> Sizes cascade to the drop zone padding, font size, icon size, and file preview thumbnail dimensions. Larger sizes are more touch-friendly on mobile.

### 3️⃣ Colors

Semantic colors: `primary` (default), `success`, `warning`, `error`, `info`.

```html
<!-- Primary (default) — uses --k-accent -->
<k-file v="outlined primary" label="Primary Upload"></k-file>

<!-- Success — green accent on drag-over -->
<k-file v="outlined success" label="Success Upload"></k-file>

<!-- Warning — orange accent on drag-over -->
<k-file v="outlined warning" label="Warning Upload"></k-file>

<!-- Error — red accent (useful for retry/error states) -->
<k-file v="outlined error" label="Error Upload"></k-file>

<!-- Info — blue accent -->
<k-file v="outlined info" label="Info Upload"></k-file>
```

> **Error color is useful for failed uploads.** Set `v="outlined error"` when upload fails to signal the error state and readiness for retry.

### 4️⃣ Border Radius

Round corners: `r-none`, `r-sm`, `r-md` (default), `r-lg`, `r-full` (pill shape).

```html
<k-file v="outlined r-none" label="Sharp corners"></k-file>
<k-file v="outlined r-sm" label="Slight rounding"></k-file>
<k-file v="outlined r-md" label="Standard rounding"></k-file>
<k-file v="outlined r-lg" label="More rounding"></k-file>
<k-file v="outlined r-full" label="Pill shape"></k-file>
```

### 5️⃣ States

State flags: `disabled`, `loading`, `full`. Plus the **error** attribute for error states.

```html
<!-- Disabled — drop zone inactive, no file selection -->
<k-file v="outlined disabled" label="Disabled" hint="Unavailable"></k-file>

<!-- Loading — spinner overlay, prevents interaction -->
<k-file v="outlined loading" label="Uploading..."></k-file>

<!-- Full width -->
<k-file v="outlined full" label="Full Width"></k-file>

<!-- Error state -->
<k-file v="outlined" label="Upload Failed" error></k-file>

<!-- Required -->
<k-file v="outlined" label="Required" required></k-file>
```

### 6️⃣ Width Utilities

Control width: `w-full`, `w-auto`, `w-fit`, `w-N` (spacing scale like `w-96`).

```html
<k-file v="outlined w-full" label="Full Width"></k-file>
<k-file v="outlined w-96" label="24rem wide"></k-file>
<k-file v="outlined mw-96" label="Max 24rem"></k-file>
```

### 7️⃣ Shadow Utilities

Add depth: `shd-sm`, `shd-md`, `shd-lg`, `shd-xl`, `shd-none`.

```html
<k-file v="filled shd-sm" label="Soft Shadow"></k-file>
<k-file v="filled shd-lg" label="Large Shadow"></k-file>
```

### 8️⃣ Border Utilities

Borders: `bdr`, `bdr-none`.

```html
<k-file v="outlined bdr" label="With Border"></k-file>
<k-file v="ghost bdr-none" label="No Border"></k-file>
```

### 9️⃣ Combined Token Examples

Mix and match tokens for custom variations:

```html
<!-- Large outlined primary with pill shape and shadow -->
<k-file v="outlined lg primary r-full shd-md" label="Featured"></k-file>

<!-- Small soft success with no radius -->
<k-file v="soft sm success r-none" label="Quick Upload"></k-file>

<!-- Extra large filled error -->
<k-file v="filled xl error shd-lg" label="Critical"></k-file>

<!-- Minimal ghost variant -->
<k-file v="ghost sm r-lg" label="Minimal"></k-file>

<!-- Full width with warning color -->
<k-file v="outlined w-full warning" label="Wide Upload"></k-file>
```<!-- Soft — muted background, no border -->
<k-file v="soft" label="Choose file"></k-file>

<!-- Ghost — minimal styling, border only on hover -->
<k-file v="ghost" label="Choose file"></k-file>
```

### 2️⃣ Sizes

Scale from `xs` (extra small) to `xl` (extra large). Default is `md`.

```html
<k-file v="outlined xs" label="Extra Small"></k-file>
<k-file v="outlined sm" label="Small"></k-file>
<k-file v="outlined md" label="Medium (default)"></k-file>
<k-file v="outlined lg" label="Large"></k-file>
<k-file v="outlined xl" label="Extra Large"></k-file>
```

### 3️⃣ Colors

Semantic colors: `primary` (default), `success`, `warning`, `error`, `info`.

```html
<!-- Primary (default) — uses --k-accent -->
<k-file v="outlined primary" label="Primary"></k-file>

<!-- Success — green accent on hover -->
<k-file v="outlined success" label="Success"></k-file>

<!-- Warning — orange accent on hover -->
<k-file v="outlined warning" label="Warning"></k-file>

<!-- Error — red accent on hover -->
<k-file v="outlined error" label="Error"></k-file>

<!-- Info — blue accent on hover -->
<k-file v="outlined info" label="Info"></k-file>
```

### 4️⃣ Border Radius

Round corners: `r-none`, `r-sm`, `r-md` (default), `r-lg`, `r-full` (pill shape).

```html
<!-- Sharp corners -->
<k-file v="outlined r-none" label="Sharp"></k-file>

<!-- Slight rounding -->
<k-file v="outlined r-sm" label="Slight"></k-file>

<!-- Standard rounding (default) -->
<k-file v="outlined r-md" label="Standard"></k-file>

<!-- More rounding -->
<k-file v="outlined r-lg" label="Large"></k-file>

<!-- Pill shape -->
<k-file v="outlined r-full" label="Pill"></k-file>
```

### 5️⃣ States

State flags: `disabled`.

```html
<!-- Disabled — grayed out, not editable -->
<k-file v="outlined disabled" label="Disabled"></k-file>

<!-- Error state via attribute -->
<k-file v="outlined" label="Upload File" error></k-file>

<!-- Required -->
<k-file v="outlined" label="Profile Picture" required></k-file>
```

---

## ⚙️ Attributes & Props

### File Filtering & Validation

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `accept` | `string` | `*` | MIME types or extensions (e.g., `.pdf`, `image/*`, `.csv,.xlsx`) |
| `maxFiles` | `number` | `1` | Maximum number of files (ignored if `multiple` not set) |
| `maxSize` | `number` | `10485760` | Maximum file size in bytes (10MB) |
| `multiple` | `boolean` | `false` | Allow multiple file selection |

### Labels & Help Text

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `label` | `string` | Field label displayed above the drop zone |
| `hint` | `string` | Help text displayed below the drop zone |
| `validation-message` | `string` | Custom error message when validation fails |

### Form Integration

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Form field name for submission |
| `form` | `string` | ID of associated form |
| `required` | `boolean` | Mark field as required |
| `disabled` | `boolean` | Disable file upload |

---

## 🎯 File Type Detection

The File component automatically detects file types and displays appropriate icons:

- **PDF**: Red PDF icon
- **Excel** (`.xls`, `.xlsx`): Spreadsheet icon
- **CSV**: Spreadsheet icon
- **Images** (`.jpg`, `.png`, `.gif`, `.svg`, `.webp`): Image thumbnail or image icon
- **Documents**: Generic file icon

---

## 📸 Image Preview & Lightbox Gallery

When users upload images, the component displays:
1. **Thumbnail preview** in the file list (responsive grid layout)
2. **Clickable thumbnails** that open a full-screen lightbox gallery
3. **Gallery navigation** with arrow keys or next/previous buttons
4. **Image caption** showing the filename

### Responsive Grid Layout

The file list adapts to screen size:
- **Mobile (<768px)**: 1 column (vertical stacking)
- **Tablet (768px–1024px)**: 2 columns (side-by-side)
- **Desktop (≥1024px)**: 3 columns (3 files per row)

### Lightbox Features

- Click any image thumbnail to open
- Navigate with arrow keys or click prev/next buttons
- Zoom in/out with +/− buttons or scroll wheel
- Drag to pan zoomed images
- Esc to close
- Automatic image captions
- Touch-friendly for mobile

**Example:**
```html
<!-- Upload multiple images with lightbox integration -->
<k-file v="outlined lg" label="Upload Image Gallery" 
        accept="image/*" multiple maxFiles="10"
        hint="Select multiple images to preview in lightbox—click any thumbnail to open">
</k-file>
```

---

## 📊 Upload Progress

The component simulates realistic upload progress with a non-linear animation curve:
- **Duration**: 1–5 seconds based on file size
- **Progress**: Smoother at start and end, faster in the middle
- **Percentage text**: Displayed above the progress bar
- **Auto-clear**: Progress bar disappears after upload completes

---

## 🔒 Security & Sanitization

All user-provided content is sanitized:
- **Filenames**: Escaped and safe for display
- **File URLs**: Blob URLs are allowed for local file previews (lightbox)
- **HTML prevention**: No inline HTML is injected from filenames

---

## ♿ Accessibility

- **ARIA labels**: Every interactive element has a proper `aria-label`
- **Keyboard navigation**: Remove button is accessible via keyboard
- **Screen readers**: File names, sizes, and actions are announced
- **Drag-drop**: Keyboard users can click to select files
- **Error messaging**: Validation errors are announced via screen readers

---

## 🎨 Examples

### Profile Picture Upload
```html
<k-file v="outlined lg" 
        label="Select Profile Picture" 
        accept="image/*" 
        maxSize="2097152"
        hint="Image files up to 2MB">
</k-file>
```

### Document Upload
```html
<k-file v="filled lg" 
        label="Upload Resume" 
        accept=".pdf,.doc,.docx" 
        maxSize="5242880"
        hint="PDF or Word format, max 5MB">
</k-file>
```

### Product Images (Multiple)
```html
<k-file v="outlined lg" 
        label="Upload Product Images" 
        accept="image/*" 
        multiple 
        maxFiles="10" 
        maxSize="5242880"
        hint="Up to 10 images, 5MB each—click any thumbnail to preview in fullscreen">
</k-file>
```

### CSV Import
```html
<k-file v="outlined lg" 
        label="Import Data" 
        accept=".csv,.xlsx,.xls" 
        maxSize="10485760"
        hint="CSV or Excel files up to 10MB">
</k-file>
```

---

## 🔄 Form Integration

The File component is form-associated and supports standard form submission:

```html
<form id="upload-form" action="/api/upload" method="POST" enctype="multipart/form-data">
  <k-file name="files" label="Choose Files" accept="*" multiple required></k-file>
  <button type="submit">Upload</button>
  <button type="reset">Clear</button>
</form>

<script>
  const form = document.getElementById('upload-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const files = formData.getAll('files'); // Retrieve all selected files
    console.log('Uploading', files.length, 'file(s)');
    
    // Submit to server or handle locally
    fetch('/api/upload', { method: 'POST', body: formData });
  });
</script>
```

---

## 🎯 JavaScript API

### Property: `files`
Returns a copy of the currently selected files as an array.

```javascript
const fileInput = document.querySelector('k-file');
const selectedFiles = fileInput.files; // File[]
console.log(`Selected ${selectedFiles.length} file(s)`);
```

### Method: `clearFiles()`
Clears all selected files and resets the component.

```javascript
const fileInput = document.querySelector('k-file');
fileInput.clearFiles();
```

### Event: `k:filesSelected`
Fires when files are successfully selected or dropped.

```javascript
fileInput.addEventListener('k:filesSelected', (e) => {
  console.log('Files selected:', e.detail.files);
  e.detail.files.forEach(file => {
    console.log(`- ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
  });
});
```

---

## ✅ Validation

File validation runs automatically:

| Validation | Error Condition | Message |
| :--- | :--- | :--- |
| File type | File not in `accept` list | `File type not allowed` |
| File size | File exceeds `maxSize` | `File too large` |
| File count | Total files exceed `maxFiles` | `Exceeded max files limit` |
| Required | No files selected when `required` set | `Please select a file` |

---

## 📱 Mobile Support

The File component is fully touch-friendly:
- **Drag-drop**: Works on supported mobile browsers (iOS 16+, Android 5+)
- **Lightbox**: Touch-swipe to navigate gallery
- **Responsive**: Adapts to all screen sizes
- **Zoom**: Pinch-to-zoom in lightbox (mobile Safari)



### Product Gallery with Multiple Images
```html
<k-file v="outlined lg" 
        label="Upload Product Images" 
        accept="image/*" 
        multiple 
        maxFiles="10" 
        hint="Up to 10 images, click to preview in fullscreen">
</k-file>
```

### CSV/Excel Data Import
```html
<k-file v="soft md" 
        label="Import Data" 
        accept=".csv,.xlsx,.xls" 
        maxSize="10485760"
        hint="CSV or Excel files up to 10MB">
</k-file>
```

---

## 🎯 Token Combinations

Combine multiple tokens for custom variations:

```html
<!-- Large outlined with primary color, pill shape, and shadow -->
<k-file v="outlined lg primary r-full shd-md" label="Featured Upload"></k-file>

<!-- Small soft success variant -->
<k-file v="soft sm success r-none" label="Quick Upload"></k-file>

<!-- Extra large filled error state -->
<k-file v="filled xl error shd-lg" label="Critical Upload"></k-file>

<!-- Minimal ghost style -->
<k-file v="ghost sm" label="Minimal"></k-file>

<!-- Full width with warning color -->
<k-file v="outlined w-full warning" label="Wide Upload"></k-file>
```

---

## 🔄 Complete JavaScript API

### Property: `files`
Returns currently selected files as an array.

```javascript
const fileInput = document.querySelector('k-file');
const selectedFiles = fileInput.files; // File[]

selectedFiles.forEach(file => {
  console.log(`${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
});
```

### Method: `clearFiles()`
Clears all selected files and resets the component.

```javascript
const fileInput = document.querySelector('k-file');
fileInput.clearFiles();
```

### Method: `checkValidity()`
Returns true if file selection is valid (respects `required`).

```javascript
if (fileInput.checkValidity()) {
  console.log('Files are valid');
} else {
  console.log('Files are invalid or missing');
}
```

### Method: `reportValidity()`
Shows validation error to the user.

```javascript
fileInput.reportValidity();
```

### Property: `form`
Read-only reference to associated form.

```javascript
console.log(fileInput.form); // HTMLFormElement | null
```

### Event: `k:filesSelected`
Fires when files are successfully selected.

```javascript
fileInput.addEventListener('k:filesSelected', (e) => {
  console.log('Files selected:', e.detail.files);
});
```

---

## ⚙️ Complete Attributes Reference

### File Filtering

| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `accept` | `string` | `*` | MIME types or extensions (`.pdf`, `image/*`, `.csv,.xlsx`) |
| `maxFiles` | `number` | `1` | Maximum number of files allowed |
| `maxSize` | `number` | `10485760` | Maximum file size in bytes (10MB default) |
| `multiple` | `boolean` | `false` | Allow multiple file selection |

### Labels & Text

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `label` | `string` | Field label above drop zone |
| `hint` | `string` | Help text below drop zone |
| `validation-message` | `string` | Custom error message |

### Form Integration

| Attribute | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Form field name for submission |
| `form` | `string` | Associated form ID |
| `required` | `boolean` | Require file selection |
| `disabled` | `boolean` | Disable uploads |
| `autofocus` | `boolean` | Auto-focus on load |

---

## ✅ Validation Rules

| Rule | Condition | Error Message |
| :--- | :--- | :--- |
| **File type** | File not in `accept` list | File type not allowed |
| **File size** | Exceeds `maxSize` | File too large |
| **File count** | Exceeds `maxFiles` | Exceeded max files limit |
| **Required** | No files when `required` set | Please select a file |

Invalid files are silently rejected. Valid files are added to the list.

---

## 📊 File Type Detection

Automatic icon display based on file type:

| Type | Icon | Detection |
| :--- | :--- | :--- |
| **PDF** | 📄 | `.pdf` |
| **Excel** | 📊 | `.xls`, `.xlsx`, `.numbers` |
| **CSV** | 📊 | `.csv` |
| **Images** | 🖼️ | `.jpg`, `.png`, `.gif`, `.svg`, `.webp` |
| **Documents** | 📋 | `.doc`, `.docx`, `.txt`, `.rtf` |
| **Archives** | 📦 | `.zip`, `.rar`, `.7z`, `.tar`, `.gz` |
| **Other** | 📁 | Any other type |

---

## 📸 Image Lightbox Features

When images are uploaded:

✅ **Thumbnails** in responsive grid (1 col mobile → 3 col desktop)  
✅ **Click to open** full-screen lightbox gallery  
✅ **Arrow keys** navigate between images  
✅ **Zoom buttons** or scroll wheel to zoom  
✅ **Drag to pan** when zoomed  
✅ **Escape key** closes lightbox  
✅ **Image captions** show filenames  
✅ **Touch-friendly** with pinch-to-zoom  

---

## 📊 Upload Progress

Progress automatically displays during upload:

- **Duration**: 1–5 seconds (based on file size)
- **Animation**: Non-linear easing curve
- **Display**: Percentage above progress bar
- **Auto-clear**: After completion

```javascript
fileInput.addEventListener('k:filesSelected', (e) => {
  // Progress automatically animates for each file
  console.log('Files uploading:', e.detail.files);
});
```

---

## 🔒 Security

✅ Filenames sanitized before display  
✅ Blob URLs allowed for local previews  
✅ No HTML injection possible  
✅ ARIA labels sanitized  

---

## ♿ Accessibility

✅ ARIA labels on all elements  
✅ Keyboard navigation (Tab, Enter)  
✅ Screen reader announcements  
✅ Clear focus indicators  
✅ WCAG AA color contrast  
✅ Drag-drop and click support  

---

## 📱 Responsive Grid Layout

File previews adapt to screen size:

| Screen Size | Columns | Use Case |
| :--- | :--- | :--- |
| <768px | 1 | Mobile vertical stacking |
| 768px–1024px | 2 | Tablet side-by-side |
| ≥1024px | 3 | Desktop 3 per row |

---

## 🌐 Browser Support

The File component works on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 14+, Android 5+)

Drag-drop support varies by browser and OS.


---

# 🎚️ Slider Component

The Slider is a range-selection component for numeric input. It supports single-value and dual-thumb (range) modes, real-time number feedback display, full keyboard navigation, and all 11 visual variants with semantic color support. Like the Input, the Slider uses the `v` attribute system for composable token styling and is fully accessible with ARIA attributes and keyboard controls.

> **Framework status:** Vanilla `<k-slider>` Web Component is **fully implemented and production-ready**. Features include single/dual thumbs, keyboard support (arrow keys, Page Up/Down, Home/End), number feedback display, all 11 button-style variants, 6 semantic colors, 5 sizes, full radius tokens, state management (disabled, loading, error), and comprehensive accessibility with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`, and `aria-disabled`.

---

## 🚀 Basic Usage (No Tokens)

### Vanilla JavaScript
A plain range slider with sensible defaults: `filled` variant, `md` size, `primary` color, and a number feedback display.

```html
<!-- Basic slider (0–100 range, default 50) -->
<k-slider min="0" max="100" value="50"></k-slider>

<!-- With label and hint -->
<k-slider label="Volume" min="0" max="100" value="50" hint="Adjust speaker level"></k-slider>

<!-- Price range slider (0–1000, step 10) -->
<k-slider label="Price" min="0" max="1000" step="10" value="500"></k-slider>

<!-- Temperature slider with decimal precision -->
<k-slider label="Temperature" min="-20" max="50" step="0.5" value="22"></k-slider>
```

### React
```tsx
import { Slider } from '@kenikool/ui';

// Basic slider
<Slider min={0} max={100} value={50} onChange={(e) => console.log(e.target.value)} />

// With label and hint
<Slider label="Volume" min={0} max={100} value={50} hint="Adjust speaker level" />

// Price slider
<Slider label="Price" min={0} max={1000} step={10} value={500} />

// Temperature with decimal precision
<Slider label="Temperature" min={-20} max={50} step={0.5} value={22} />
```

> The `v` attribute is optional. When omitted, the Slider renders with the default variant (`filled`), medium size (`md`), and primary color. Add tokens only when you want to customize appearance.

---

## 📋 Complete Token Usage Guide

### 🎯 Target Selectors (`.class` and `#id`)

Like the Input, the Slider supports CSS selectors for DOM placement and CSS class/ID assignment.

**Vanilla:**
```html
<!-- Add a CSS class -->
<k-slider v="outlined .volume-control" label="Volume" min="0" max="100" value="50"></k-slider>

<!-- Add an ID -->
<k-slider v="filled #brightness" label="Brightness" min="0" max="100" value="75"></k-slider>

<!-- Combine class, id, and variant tokens -->
<k-slider v="soft primary .hero-slider #main-range" label="Range" min="0" max="100" value="50"></k-slider>
```

**React:**
```tsx
<Slider variant="outlined" className="volume-control" label="Volume" />
<Slider variant="filled" id="brightness" label="Brightness" />
```

### 1️⃣ Variants (11 options)

The Slider supports all 11 button-style variants, each producing a visually distinct appearance:

| Variant | Description | Use Case |
| :--- | :--- | :--- |
| `filled` | Solid elevated background track | Default, professional look |
| `outlined` | Transparent track with colored border | Compact, emphasis on value |
| `ghost` | Minimal bottom-line only | Lightweight, unobtrusive |
| `soft` | Subtle colored background with blur | Soft, modern aesthetic |
| `subtle` | Very subtle background tint | Extremely minimal appearance |
| `gradient` | Progress bar with gradient | Eye-catching, premium feel |
| `glow` | Progress bar with glow/shadow effect | Futuristic, attention-grabbing |
| `minimal` | Text-colored line only | Monochrome, text-integrated |
| `elevated` | Elevated background with shadow | Pronounced depth and hierarchy |
| `destructive` | Fixed red color (ignores color token) | Dangerous actions, warnings |
| `icon-only` | Compact sizing for embedded use | Sidebars, compact layouts |

**Vanilla:**
```html
<!-- 1. Filled (default) -->
<k-slider v="filled md primary" label="Filled" min="0" max="100" value="50"></k-slider>

<!-- 2. Outlined -->
<k-slider v="outlined md primary" label="Outlined" min="0" max="100" value="50"></k-slider>

<!-- 3. Ghost -->
<k-slider v="ghost md primary" label="Ghost" min="0" max="100" value="50"></k-slider>

<!-- 4. Soft -->
<k-slider v="soft md primary" label="Soft" min="0" max="100" value="50"></k-slider>

<!-- 5. Subtle -->
<k-slider v="subtle md primary" label="Subtle" min="0" max="100" value="50"></k-slider>

<!-- 6. Gradient -->
<k-slider v="gradient md primary" label="Gradient" min="0" max="100" value="50"></k-slider>

<!-- 7. Glow -->
<k-slider v="glow md primary" label="Glow" min="0" max="100" value="50"></k-slider>

<!-- 8. Minimal -->
<k-slider v="minimal md primary" label="Minimal" min="0" max="100" value="50"></k-slider>

<!-- 9. Elevated -->
<k-slider v="elevated md primary" label="Elevated" min="0" max="100" value="50"></k-slider>

<!-- 10. Destructive -->
<k-slider v="destructive md" label="Delete (Destructive)" min="0" max="100" value="50"></k-slider>

<!-- 11. Icon-Only -->
<k-slider v="icon-only md primary" label="Compact" min="0" max="100" value="50"></k-slider>
```

**React:**
```tsx
<Slider variant="filled" size="md" color="primary" label="Filled" />
<Slider variant="outlined" size="md" color="primary" label="Outlined" />
<Slider variant="soft" size="md" color="primary" label="Soft" />
<Slider variant="gradient" size="md" color="primary" label="Gradient" />
<Slider variant="glow" size="md" color="primary" label="Glow" />
<Slider variant="elevated" size="md" color="primary" label="Elevated" />
<Slider variant="destructive" size="md" label="Destructive" />
```

### 2️⃣ Sizes (5 options)

Scale from `xs` (extra small) to `xl` (extra large). Default is `md`.

| Size | Track Height | Thumb Size | Use Case |
| :--- | :--- | :--- | :--- |
| `xs` | 4px | 16px | Compact dashboards, sidebars |
| `sm` | 5px | 18px | Tight spacing, secondary controls |
| `md` | 6px | 20px | Default, general purpose |
| `lg` | 8px | 22px | Large screens, prominent controls |
| `xl` | 10px | 24px | Touch-friendly, mobile, hero sliders |

**Vanilla:**
```html
<k-slider v="filled xs primary" label="Extra Small" min="0" max="100" value="30"></k-slider>
<k-slider v="filled sm primary" label="Small" min="0" max="100" value="40"></k-slider>
<k-slider v="filled md primary" label="Medium (default)" min="0" max="100" value="50"></k-slider>
<k-slider v="filled lg primary" label="Large" min="0" max="100" value="60"></k-slider>
<k-slider v="filled xl primary" label="Extra Large" min="0" max="100" value="70"></k-slider>
```

**React:**
```tsx
<Slider variant="filled" size="xs" color="primary" label="Extra Small" />
<Slider variant="filled" size="sm" color="primary" label="Small" />
<Slider variant="filled" size="md" color="primary" label="Medium" />
<Slider variant="filled" size="lg" color="primary" label="Large" />
<Slider variant="filled" size="xl" color="primary" label="Extra Large" />
```

### 3️⃣ Colors (6 options)

Semantic colors: `primary` (default), `success`, `warning`, `error`, `info`, `default`.

**Color behavior in the Slider:**
- For most variants (`filled`, `soft`, `subtle`, `gradient`, `glow`), the color token changes the progress bar and track styling.
- For `outlined`, the color affects the border and progress bar.
- For `ghost` and `minimal`, the color affects the progress bar only.
- For `elevated` and `destructive`, the color token is ignored (uses fixed styling).

**Vanilla:**
```html
<!-- Primary (default) — uses --k-accent -->
<k-slider v="filled primary" label="Primary" min="0" max="100" value="50"></k-slider>

<!-- Success — green -->
<k-slider v="filled success" label="Success" min="0" max="100" value="50"></k-slider>

<!-- Warning — orange -->
<k-slider v="filled warning" label="Warning" min="0" max="100" value="50"></k-slider>

<!-- Error — red -->
<k-slider v="filled error" label="Error" min="0" max="100" value="50"></k-slider>

<!-- Info — blue -->
<k-slider v="filled info" label="Info" min="0" max="100" value="50"></k-slider>

<!-- Default — neutral gray -->
<k-slider v="filled default" label="Default" min="0" max="100" value="50"></k-slider>
```

**React:**
```tsx
<Slider variant="filled" color="primary" label="Primary" />
<Slider variant="filled" color="success" label="Success" />
<Slider variant="filled" color="warning" label="Warning" />
<Slider variant="filled" color="error" label="Error" />
<Slider variant="filled" color="info" label="Info" />
<Slider variant="filled" color="default" label="Default" />
```

> **Color × Variant Interactions:**
> - `filled / soft / subtle`: Color changes the track background
> - `outlined`: Color changes the border line
> - `gradient`: Color affects gradient stop colors
> - `glow`: Color affects progress glow color
> - `ghost / minimal`: Color affects progress bar only
> - `elevated / destructive`: Color is ignored (fixed styling)

### 4️⃣ Border Radius (5 options)

Round corners: `r-none`, `r-sm`, `r-md` (default), `r-lg`, `r-full` (pill shape).

**Vanilla:**
```html
<k-slider v="filled primary r-none" label="Sharp" min="0" max="100" value="50"></k-slider>
<k-slider v="filled primary r-sm" label="Slight" min="0" max="100" value="50"></k-slider>
<k-slider v="filled primary r-md" label="Standard (default)" min="0" max="100" value="50"></k-slider>
<k-slider v="filled primary r-lg" label="Large" min="0" max="100" value="50"></k-slider>
<k-slider v="filled primary r-full" label="Pill" min="0" max="100" value="50"></k-slider>
```

**React:**
```tsx
<Slider variant="filled" color="primary" radius="none" label="Sharp" />
<Slider variant="filled" color="primary" radius="full" label="Pill" />
```

### 5️⃣ States

State flags: `disabled`, `loading`, `error`, `full`.

**Vanilla:**
```html
<!-- Disabled — grayed out, not interactive -->
<k-slider v="filled primary disabled" label="Disabled" min="0" max="100" value="50"></k-slider>

<!-- Loading — overlaid loader, aria-busy set -->
<k-slider v="filled primary loading" label="Updating..." min="0" max="100" value="50"></k-slider>

<!-- Error state — red border/progress -->
<k-slider v="filled primary error" label="Invalid range" min="0" max="100" value="50"></k-slider>

<!-- Full width -->
<k-slider v="filled primary full" label="Full Width" min="0" max="100" value="50"></k-slider>
```

**React:**
```tsx
<Slider variant="filled" color="primary" disabled={true} label="Disabled" />
<Slider variant="filled" color="primary" loading={true} label="Updating..." />
<Slider variant="filled" color="primary" error={true} label="Invalid range" />
```

### 6️⃣ Width & Size Utilities

Control slider width: `w-full` (default), `w-auto`, `w-fit`, `w-screen`, and max/min constraints.

**Vanilla:**
```html
<!-- Full width (default) -->
<k-slider v="filled primary w-full" label="Full" min="0" max="100" value="50"></k-slider>

<!-- Auto width (content-based) -->
<k-slider v="filled primary w-auto" label="Auto" min="0" max="100" value="50"></k-slider>

<!-- With max-width constraint -->
<k-slider v="filled primary mw-full" label="Max Full" min="0" max="100" value="50"></k-slider>
```

**React:**
```tsx
<Slider variant="filled" color="primary" width="full" label="Full" />
<Slider variant="filled" color="primary" width="auto" label="Auto" />
```

### 7️⃣ Border Utilities

Add or remove borders: `bdr`, `bdr-none`. The Slider's track has a border by default; use `bdr-none` to remove it.

**Vanilla:**
```html
<!-- Explicit border -->
<k-slider v="ghost primary bdr" label="With Border" min="0" max="100" value="50"></k-slider>

<!-- No border -->
<k-slider v="ghost primary bdr-none" label="No Border" min="0" max="100" value="50"></k-slider>
```

### 8️⃣ Shadow Utilities

Add depth with shadows: `shd-sm`, `shd-md`, `shd-lg`, `shd-xl`, `shd-none`. Default sliders have no shadow.

**Vanilla:**
```html
<!-- Subtle shadow -->
<k-slider v="filled primary shd-sm" label="Soft Shadow" min="0" max="100" value="50"></k-slider>

<!-- Pronounced shadow -->
<k-slider v="elevated primary shd-lg" label="Large Shadow" min="0" max="100" value="50"></k-slider>

<!-- No shadow -->
<k-slider v="filled primary shd-none" label="No Shadow" min="0" max="100" value="50"></k-slider>
```

### 9️⃣ Text Alignment Utilities

Align label text: `txt-left`, `txt-center`, `txt-right`.

**Vanilla:**
```html
<k-slider v="filled primary txt-left" label="Left-aligned" min="0" max="100" value="50"></k-slider>
<k-slider v="filled primary txt-center" label="Center-aligned" min="0" max="100" value="50"></k-slider>
<k-slider v="filled primary txt-right" label="Right-aligned" min="0" max="100" value="50"></k-slider>
```

### 🔟 Cursor Utilities

Control pointer appearance: `cur-ptr` (pointer), `cur-def` (default), `cur-not` (not-allowed). Sliders default to `cur-pointer`.

**Vanilla:**
```html
<k-slider v="filled primary cur-ptr" label="Pointer" min="0" max="100" value="50"></k-slider>
<k-slider v="filled primary cur-not" label="Not Allowed" min="0" max="100" value="50"></k-slider>
```

### 1️⃣1️⃣ Overflow & Display Utilities

Control display and overflow: `d-block`, `d-flex`, `d-none`, `ovf-auto`, `ovf-hidden`.

**Vanilla:**
```html
<!-- Hidden slider (useful for programmatic control) -->
<k-slider v="filled primary d-none" id="hidden-slider" min="0" max="100" value="50"></k-slider>

<!-- Inline display (rare, usually block is correct) -->
<k-slider v="filled primary d-block" label="Block" min="0" max="100" value="50"></k-slider>
```

---

## 🎮 Programmatic State Changes

### Getting and Setting Values

**Vanilla:**
```javascript
const slider = document.querySelector('k-slider');

// Get current value
console.log('Current value:', slider.value); // String: "50"

// Set value programmatically
slider.value = "75";

// Get/set form value (for form integration)
console.log(slider.form?.value); // Returns the form-associated value
```

### Changing State Attributes

**Vanilla:**
```javascript
const slider = document.querySelector('k-slider');

// Disable the slider
slider.setAttribute('data-disabled', 'true');
// Or using the disabled property (if implemented):
// slider.disabled = true;

// Enable the slider
slider.removeAttribute('data-disabled');

// Set loading state
slider.setAttribute('data-loading', 'true');

// Set error state
slider.setAttribute('data-error', 'true');

// Remove states
slider.removeAttribute('data-loading');
slider.removeAttribute('data-error');
```

### Changing Appearance Tokens

**Vanilla:**
```javascript
const slider = document.querySelector('k-slider');

// Change variant
slider.setAttribute('data-variant', 'outlined');

// Change color
slider.setAttribute('data-color', 'success');

// Change size
slider.setAttribute('data-size', 'lg');

// Change radius
slider.setAttribute('data-radius', 'full');
```

### Events

**Value Change Event:**
```javascript
const slider = document.querySelector('k-slider');

slider.addEventListener('input', (e) => {
  console.log('Value changed (live):', e.target.value);
  // Fires continuously as the user drags the thumb
});

slider.addEventListener('change', (e) => {
  console.log('Value committed:', e.target.value);
  // Fires once when the user releases the thumb
});
```

**Custom k: Events:**
```javascript
const slider = document.querySelector('k-slider');

// Fires when slider transitions to disabled
slider.addEventListener('k:disabled', (e) => {
  console.log('Slider disabled');
});

// Fires when slider transitions to enabled
slider.addEventListener('k:enabled', (e) => {
  console.log('Slider enabled');
});
```

### Keyboard Navigation

The Slider supports full keyboard navigation without any configuration:

| Key | Action |
| :--- | :--- |
| `Arrow Left / Arrow Down` | Decrease value by `step` |
| `Arrow Right / Arrow Up` | Increase value by `step` |
| `Page Down` | Decrease by `step × 10` |
| `Page Up` | Increase by `step × 10` |
| `Home` | Jump to `min` value |
| `End` | Jump to `max` value |
| `Tab` | Move to next element |
| `Shift+Tab` | Move to previous element |

**Example:**
```html
<!-- User can navigate without mouse: -->
<k-slider label="Volume" min="0" max="100" value="50"></k-slider>

<!-- Tab to focus, then use arrow keys or Page Up/Down to adjust -->
```

### Real-World Example: Dynamic Volume Control

**Vanilla:**
```html
<div>
  <label for="volume-slider">Volume</label>
  <k-slider id="volume-slider" v="filled md success" min="0" max="100" value="50"></k-slider>
  <button id="mute-btn">Mute</button>
  <span id="volume-display">50%</span>
</div>

<script>
  const slider = document.getElementById('volume-slider');
  const muteBtn = document.getElementById('mute-btn');
  const display = document.getElementById('volume-display');
  let previousValue = slider.value;

  // Update display on value change
  slider.addEventListener('input', (e) => {
    const value = e.target.value;
    display.textContent = value + '%';
    
    // Apply volume to audio element (example)
    // audioElement.volume = value / 100;
  });

  // Mute button toggles between 0 and previous value
  muteBtn.addEventListener('click', () => {
    if (slider.value === '0') {
      slider.value = previousValue;
      muteBtn.textContent = 'Mute';
    } else {
      previousValue = slider.value;
      slider.value = '0';
      muteBtn.textContent = 'Unmute';
    }
  });

  // Disable slider during loading
  function updateVolume(newValue) {
    slider.setAttribute('data-loading', 'true');
    
    // Simulate network request
    setTimeout(() => {
      slider.value = newValue;
      slider.removeAttribute('data-loading');
    }, 1000);
  }
</script>
```

### Real-World Example: Price Range Slider

**Vanilla:**
```html
<div>
  <label>Price Range</label>
  <k-slider id="price-slider" v="outlined md info" min="0" max="1000" step="10" value="500"></k-slider>
  <div>
    Price: $<span id="price-value">500</span>
  </div>
</div>

<script>
  const slider = document.getElementById('price-slider');
  const priceDisplay = document.getElementById('price-value');

  slider.addEventListener('input', (e) => {
    priceDisplay.textContent = e.target.value;
    
    // Filter products by price (example)
    // const price = parseInt(e.target.value);
    // filterProductsByPrice(price);
  });

  // Set price programmatically
  function setMaxPrice(max) {
    slider.setAttribute('max', max.toString());
    slider.value = Math.min(slider.value, max).toString();
  }

  // Validate price range
  function isPriceValid(minPrice, maxPrice) {
    const currentPrice = parseInt(slider.value);
    return currentPrice >= minPrice && currentPrice <= maxPrice;
  }
</script>
```

### Real-World Example: Brightness Control with Loading State

**Vanilla:**
```html
<div>
  <label>Display Brightness</label>
  <k-slider id="brightness" v="filled md warning" min="10" max="100" step="1" value="75"></k-slider>
  <span id="brightness-display">75%</span>
</div>

<script>
  const slider = document.getElementById('brightness');
  const display = document.getElementById('brightness-display');

  async function applyBrightness(value) {
    // Set loading state while applying
    slider.setAttribute('data-loading', 'true');
    
    try {
      // Simulate API call to device
      const response = await fetch('/api/display/brightness', {
        method: 'POST',
        body: JSON.stringify({ brightness: value })
      });
      
      if (!response.ok) {
        throw new Error('Failed to set brightness');
      }
      
      // Success: clear error state
      slider.removeAttribute('data-error');
      display.textContent = value + '%';
      
    } catch (error) {
      // Error: set error state
      slider.setAttribute('data-error', 'true');
      console.error('Brightness control error:', error);
    } finally {
      // Clear loading state
      slider.removeAttribute('data-loading');
    }
  }

  slider.addEventListener('change', (e) => {
    applyBrightness(e.target.value);
  });
</script>
```

### React Example: Responsive Layout

```tsx
import React, { useState } from 'react';
import { Slider } from '@kenikool/ui';

export function ResponsiveSlider() {
  const [brightness, setBrightness] = useState(75);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleChange = async (newValue) => {
    setIsLoading(true);
    setHasError(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setBrightness(newValue);
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Slider
      variant="filled"
      color={hasError ? 'error' : 'warning'}
      label="Brightness"
      min={10}
      max={100}
      step={1}
      value={brightness}
      onChange={(e) => handleChange(e.target.value)}
      loading={isLoading}
      error={hasError}
      hint={hasError ? 'Failed to update brightness' : 'Adjust display brightness'}
    />
  );
}
```

---

## ✅ Accessibility

The Slider is fully accessible with comprehensive ARIA attributes:

| Attribute | Purpose |
| :--- | :--- |
| `role="slider"` | Identifies the element as a slider control |
| `aria-label` | Descriptive name (e.g., "Volume") |
| `aria-valuemin` | Minimum value |
| `aria-valuemax` | Maximum value |
| `aria-valuenow` | Current value |
| `aria-valuetext` | Human-readable value (e.g., "50%", "$500") |
| `aria-disabled` | Set when disabled |
| `aria-busy` | Set while loading |

**Vanilla:**
```html
<!-- Aria attributes are automatically set based on attributes -->
<k-slider label="Volume" min="0" max="100" value="50"></k-slider>
<!-- Renders as:
  aria-label="Volume"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="50"
  role="slider"
-->
```

The Slider works seamlessly with screen readers and keyboard-only navigation. All state changes (disabled, loading, error) update ARIA attributes automatically.
