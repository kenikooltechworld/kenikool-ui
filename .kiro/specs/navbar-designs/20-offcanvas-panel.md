# Navbar Type 20: Offcanvas Panel

## Visual Design

```
Closed:                        Open:
┌─────────────────────┐        ┌─────────────┬───────────────┐
│                     │        │             │   PANEL       │
│   Main Content      │        │   Content   │               │
│                     │        │   (Dimmed)  │   Filters     │
│                     │        │             │   • Option 1  │
│                     │        │             │   • Option 2  │
│                     │        │             │               │
│                     │        │             │   [Apply]     │
└─────────────────────┘        └─────────────┴───────────────┘
                                      ↑              ↑
                                  Backdrop      Slide-in panel
                                  (Click to close)
```

## Detailed Layout (Right Panel Open)

```
┏━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                     ┃  [×]  Filters              ┃ ← Header
┃                     ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                     ┃                            ┃
┃   Main Content      ┃  Category                  ┃
┃   (Backdrop dim)    ┃  ▾ Electronics             ┃
┃                     ┃    • Phones                ┃ ← Content
┃                     ┃    • Laptops               ┃   (Scrollable)
┃                     ┃                            ┃
┃                     ┃  Price Range               ┃
┃                     ┃  [Slider: $0 - $1000]      ┃
┃                     ┃                            ┃
┃                     ┃  Brand                     ┃
┃                     ┃  ☐ Apple                   ┃
┃                     ┃  ☐ Samsung                 ┃
┃                     ┃  ☐ Dell                    ┃
┃                     ┃                            ┃
┃                     ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                     ┃  [Clear]      [Apply]      ┃ ← Footer
┗━━━━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
      ↑                         ↑
  Backdrop 60%              Panel 40%
  (Click closes)            (320-400px wide)
```

## Specifications

**Panel Container:**
- Width: `320px` (mobile), `400px` (tablet/desktop)
- Max-width: `90vw`
- Height: `100vh` (full viewport height)
- Position: `fixed`, `top: 0`
- Right: `0` (right panel) or `left: 0` (left panel)
- Background: `var(--k-bg-surface)`
- Z-index: `var(--k-z-modal)`
- Shadow: `var(--k-shadow-xl)`
- Transform: `translateX(100%)` (closed), `translateX(0)` (open)

**Header:**
- Height: `56px`
- Padding: `var(--k-space-4)`
- Background: `var(--k-bg-elevated)`
- Border bottom: `1px solid var(--k-border)`
- Display: `flex`, `justify-content: space-between`, `align-items: center`

**Content Area:**
- Padding: `var(--k-space-6)`
- Overflow-y: `auto`
- Flex: `1` (takes remaining space)
- Max-height: `calc(100vh - 56px - 72px)` (minus header and footer)

**Footer:**
- Height: `72px`
- Padding: `var(--k-space-4)`
- Background: `var(--k-bg-surface)`
- Border top: `1px solid var(--k-border)`
- Display: `flex`, `gap: var(--k-space-3)`, `justify-content: flex-end`

**Backdrop:**
- Position: `fixed`, covers entire viewport
- Background: `rgba(0, 0, 0, 0.5)`
- Z-index: `var(--k-z-overlay)` (below panel)
- Click: Closes panel
- Opacity: `0` (closed), `1` (open)

**Close Button:**
- Size: `32×32px`
- Icon: `×`, 24px
- Position: Top-right of header
- Color: `var(--k-text-primary)`
- Hover: `background: var(--k-accent-subtle)`

## Use Cases
- Filter panels (e-commerce, search results)
- Shopping carts (e-commerce)
- Settings panels
- Detailed information views
- Form wizards
- Notification panels
- User profile editors

## Key Features
- Slides in from edge (left/right/top/bottom)
- Overlays main content
- Backdrop dims background
- Click outside to close
- Escape key closes
- Scrollable content
- Fixed header/footer
- Can contain forms, filters, settings

## Slide Directions

**Right (Default):**
```
┌─────────────┬───────────┐
│  Content    │  Panel    │ ← Slides from right
└─────────────┴───────────┘
```

**Left:**
```
┌───────────┬─────────────┐
│  Panel    │  Content    │ ← Slides from left
└───────────┴─────────────┘
```

**Top:**
```
┌───────────────────────────┐
│  Panel (Header-like)      │ ← Slides from top
├───────────────────────────┤
│  Content                  │
└───────────────────────────┘
```

**Bottom:**
```
┌───────────────────────────┐
│  Content                  │
├───────────────────────────┤
│  Panel (Bottom Sheet)     │ ← Slides from bottom
└───────────────────────────┘
```

## Content Types

**Type 1: Filters**
```
┌─────────────────────┐
│ [×] Filters         │
├─────────────────────┤
│                     │
│ Category            │
│ ▾ Electronics       │
│   • Phones          │
│   • Laptops         │
│                     │
│ Price Range         │
│ [$0 ────●─── $1000] │
│                     │
│ Brand               │
│ ☑ Apple             │
│ ☐ Samsung           │
│ ☐ Dell              │
│                     │
├─────────────────────┤
│ [Clear]   [Apply]   │
└─────────────────────┘
```

**Type 2: Shopping Cart**
```
┌─────────────────────┐
│ [×] Cart (3 items)  │
├─────────────────────┤
│                     │
│ [img] Product 1     │
│       $99.99  [×]   │
│                     │
│ [img] Product 2     │
│       $49.99  [×]   │
│                     │
│ [img] Product 3     │
│       $29.99  [×]   │
│                     │
│ Subtotal:  $179.97  │
│ Shipping:   $10.00  │
│ Total:     $189.97  │
│                     │
├─────────────────────┤
│ [Checkout]          │
└─────────────────────┘
```

**Type 3: Settings**
```
┌─────────────────────┐
│ [×] Settings        │
├─────────────────────┤
│                     │
│ Account             │
│ • Profile           │
│ • Privacy           │
│ • Security          │
│                     │
│ Preferences         │
│ • Language          │
│ • Theme             │
│ • Notifications     │
│                     │
│ About               │
│ • Version           │
│ • Help              │
│                     │
├─────────────────────┤
│ [Save Changes]      │
└─────────────────────┘
```

**Type 4: Notifications**
```
┌─────────────────────┐
│ [×] Notifications   │
├─────────────────────┤
│                     │
│ ● New message       │
│   John: Hey there!  │
│   2 min ago         │
│                     │
│ ● Task assigned     │
│   Review PR #123    │
│   1 hour ago        │
│                     │
│ ○ Update available  │
│   Version 2.0       │
│   Yesterday         │
│                     │
├─────────────────────┤
│ [Mark All Read]     │
└─────────────────────┘
```

## Mobile Behavior (< 768px)

**Full-Width Panel:**
```
┌───────────────────────────┐
│ [×] Filters               │ ← Covers entire screen
├───────────────────────────┤
│                           │
│   Filter content...       │
│                           │
│                           │
│                           │
├───────────────────────────┤
│ [Clear]        [Apply]    │
└───────────────────────────┘

100% width, no backdrop visible
```

**Bottom Sheet Style:**
```
┌───────────────────────────┐
│                           │
│   Content                 │
│                           │
├───────────────────────────┤
│ ━━━                       │ ← Drag handle
│ Filters                   │
│ • Category                │
│ • Price                   │
│ • Brand                   │
│                           │
│ [Apply]                   │
└───────────────────────────┘

Swipe down to close
```

## Accessibility
- `<aside role="complementary" aria-label="Filter panel">`
- When closed: `aria-hidden="true"`
- When open: `aria-hidden="false"`, focus moves to close button
- Focus trap: Tab cycles within panel
- Escape key: Closes panel
- Close button: `<button aria-label="Close panel">`
- Screen reader: Announces "Filter panel opened"

## Example HTML Structure
```html
<k-offcanvas position="right" width="400">
  <!-- Trigger button -->
  <button slot="trigger" aria-label="Open filters">
    🔍 Filters
  </button>
  
  <!-- Panel content -->
  <div slot="header">
    <h2>Filters</h2>
    <button class="close-btn" aria-label="Close">×</button>
  </div>
  
  <div slot="content">
    <section>
      <h3>Category</h3>
      <k-checkbox label="Electronics"></k-checkbox>
      <k-checkbox label="Clothing"></k-checkbox>
      <k-checkbox label="Books"></k-checkbox>
    </section>
    
    <section>
      <h3>Price Range</h3>
      <k-input type="range" min="0" max="1000" value="500"></k-input>
    </section>
    
    <section>
      <h3>Brand</h3>
      <k-checkbox label="Apple"></k-checkbox>
      <k-checkbox label="Samsung"></k-checkbox>
      <k-checkbox label="Dell"></k-checkbox>
    </section>
  </div>
  
  <div slot="footer">
    <k-button v="ghost">Clear</k-button>
    <k-button v="filled primary">Apply</k-button>
  </div>
</k-offcanvas>
```

## JavaScript API

```javascript
const offcanvas = document.querySelector('k-offcanvas');

// Open
offcanvas.open();

// Close
offcanvas.close();

// Toggle
offcanvas.toggle();

// Listen for events
offcanvas.addEventListener('k:open', () => {
  console.log('Panel opened');
});

offcanvas.addEventListener('k:close', () => {
  console.log('Panel closed');
});

// Prevent close (e.g., unsaved changes)
offcanvas.addEventListener('k:before-close', (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    showConfirmDialog();
  }
});
```

## Nested Offcanvas

```
Panel 1 open → Click to open Panel 2:

┌────────┬──────────┬──────────┐
│Content │ Panel 1  │ Panel 2  │ ← Both panels stacked
│        │          │          │
└────────┴──────────┴──────────┘

Z-index increments for each level
```

## Animation
- Panel slide: `transform: translateX(100%) → translateX(0)`, `300ms ease`
- Backdrop fade: `opacity: 0 → 1`, `250ms ease`
- Content fade: `opacity: 0 → 1`, `200ms ease` (delayed 100ms)
- Close: Reverse animations, `250ms ease`

## Best Practices
- Max width 400px on desktop (more keeps content visible)
- Provide close button (top-right)
- Close on outside click
- Close on Escape key
- Trap focus within panel
- Prevent body scroll when open
- Show loading state if fetching content
- Save changes on close (or prompt)
- Support swipe-to-close on mobile
- Animate smoothly (300ms standard)
