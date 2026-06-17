# Navbar Type 8: Drawer Hamburger

## Visual Design

```
Closed State:
┌─────────────────────────────────┐
│  [☰]  BRAND             [Login] │
└─────────────────────────────────┘
    ↑
 Hamburger icon (only visible element)
```

## Open State (Side Drawer)

```
┌─────────────┐  ┌─────────────────────────┐
│             │  │  [×]  Menu              │
│             │  ├─────────────────────────┤
│             │  │                         │
│             │  │  🏠 Home                │
│   Content   │  │  📄 About               │
│   Dimmed    │  │  🛍️ Products            │
│             │  │  💵 Pricing             │
│             │  │  📞 Contact             │
│             │  │                         │
│             │  │  ─────────────          │
│             │  │  [Login]                │
│             │  │  [Sign Up]              │
│             │  │                         │
└─────────────┘  └─────────────────────────┘
  ↑                        ↑
Backdrop (click to close)  Drawer (320px wide)
```

## Detailed Layout

```
Hamburger Trigger (Closed):
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ┌────┐                                    ┃
┃  │ ≡  │   BRAND                    [Login] ┃
┃  └────┘                                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   ↑ 48×48px touch target

Drawer Panel (Open):
┏━━━━━━━━━━━━━━━━━━━━┓
┃  [×]  Navigation   ┃  ← Header (56px)
┣━━━━━━━━━━━━━━━━━━━━┫
┃                    ┃
┃  🏠 Home           ┃  ← Nav links (stacked)
┃                    ┃     56px each
┃  📄 About          ┃
┃                    ┃
┃  🛍️ Products  ›    ┃  ← Nested (chevron)
┃                    ┃
┃  💵 Pricing        ┃
┃                    ┃
┃  📞 Contact        ┃
┃                    ┃
┃                    ┃
┃  (spacer)          ┃
┃                    ┃
┣━━━━━━━━━━━━━━━━━━━━┫
┃  [Login]           ┃  ← Footer actions
┃  [Sign Up]         ┃
┗━━━━━━━━━━━━━━━━━━━━┛
   320px wide
   100vh height
```

## Specifications

**Hamburger Icon:**
- Size: `48×48px` (WCAG 2.5.5 touch target)
- Icon: Three horizontal lines (≡), 20×20px
- Position: Top-left or top-right corner
- Padding: `var(--k-space-3)`
- Color: `var(--k-text-primary)`

**Drawer Panel:**
- Width: `320px` (mobile) or `400px` (tablet)
- Height: `100vh` (full viewport height)
- Position: `fixed`, `right: 0` or `left: 0`
- Z-index: `var(--k-z-modal)`
- Background: `var(--k-bg-surface)`
- Shadow: `var(--k-shadow-lg)` on the edge

**Backdrop:**
- Position: `fixed`, covers entire viewport
- Background: `rgba(0, 0, 0, 0.5)`
- Z-index: `var(--k-z-overlay)` (below drawer)
- Click: Closes drawer

**Nav Link Style:**
- Height: `56px`
- Padding: `var(--k-space-4) var(--k-space-6)`
- Font: `var(--k-text-base)`, `var(--k-font-medium)`
- Color: `var(--k-text-primary)`
- Hover: `background: var(--k-accent-subtle)`
- Icon: 20px, left-aligned
- Chevron (›): For nested items

## Hamburger Icon States

```
Closed (☰):
┌────────┐
│   ≡    │  Three horizontal lines
└────────┘

Morphing to X:
┌────────┐
│   ╳    │  Lines rotate and move to form X
└────────┘

Opened (×):
┌────────┐
│   ×    │  Close icon
└────────┘
```

**Animation:** Pure CSS transform
- Top line: `rotate(45deg) translateY(6px)`
- Middle line: `opacity: 0`
- Bottom line: `rotate(-45deg) translateY(-6px)`
- Duration: `300ms ease`

## Slide-In Animation

```
Closed (off-screen):
          ┌─────┐
          │     │ ← Hidden beyond viewport edge
          │     │
          └─────┘

Opening (sliding in):
     ┌─────┐
     │     │ ← Slides from edge
     │     │
     └─────┘

Open (visible):
┌─────┐
│     │ ← Fully visible
│     │
└─────┘

CSS: transform: translateX(100%) → translateX(0)
Duration: 300ms ease
```

## Use Cases
- Mobile-first sites
- Minimal designs
- Secondary navigation
- Progressive disclosure
- Space-constrained layouts

## Key Features
- Zero space when closed
- Full-screen focus when open
- Touch-gesture friendly
- Backdrop prevents accidental interaction
- Swipe to close support

## Nested Navigation

```
Main Menu:
┌───────────────────┐
│  Home             │
│  Products      ›  │ ← Click to expand
│  Pricing          │
│  Contact          │
└───────────────────┘

Expanded Submenu:
┌───────────────────┐
│  ‹ Back           │ ← Back to main
├───────────────────┤
│  All Products     │
│  Category 1       │
│  Category 2       │
│  Category 3       │
└───────────────────┘

Alternative: Accordion-style
┌───────────────────┐
│  Home             │
│  Products      ∨  │ ← Expands inline
│    • Category 1   │
│    • Category 2   │
│  Pricing          │
└───────────────────┘
```

## Swipe Gesture Support

```
Swipe right → Close drawer
Swipe left (from edge) → Open drawer

Implementation:
- touchstart: Record position
- touchmove: Track delta
- touchend: If delta > 50px, trigger open/close
```

## Accessibility
- `<button aria-label="Open menu" aria-expanded="false">` on hamburger
- `aria-expanded="true"` when drawer is open
- Focus trap: Tab cycles within drawer
- Focus moves to first link when opened
- Focus returns to hamburger when closed
- Escape key closes drawer
- Screen reader announces "Menu" when opened

## Example HTML Structure
```html
<k-navbar-drawer position="right">
  <!-- Trigger (always visible) -->
  <button slot="trigger" aria-label="Menu">
    <span class="hamburger-icon">☰</span>
  </button>
  
  <!-- Drawer content -->
  <div slot="header">
    <button class="close-btn" aria-label="Close menu">×</button>
    <h2>Navigation</h2>
  </div>
  
  <a href="/" icon="home">Home</a>
  <a href="/about" icon="info">About</a>
  <a href="/products" icon="shopping-bag">Products</a>
  <a href="/pricing" icon="tag">Pricing</a>
  <a href="/contact" icon="mail">Contact</a>
  
  <div slot="footer">
    <k-button v="outlined full">Login</k-button>
    <k-button v="filled primary full">Sign Up</k-button>
  </div>
</k-navbar-drawer>
```

## Position Variants

**Right Drawer (default):**
```
┌─────────────┐  ┌──────┐
│   Content   │  │Drawer│
└─────────────┘  └──────┘
```

**Left Drawer:**
```
┌──────┐  ┌─────────────┐
│Drawer│  │   Content   │
└──────┘  └─────────────┘
```

**Full-Screen Overlay:**
```
┌────────────────────┐
│                    │
│   Full Menu        │
│   (covers all)     │
│                    │
└────────────────────┘
```

## Animation
- Drawer slide: `300ms cubic-bezier(0.4, 0, 0.2, 1)`
- Backdrop fade: `250ms ease`
- Hamburger morph: `300ms ease`
- Link hover: `150ms ease`
