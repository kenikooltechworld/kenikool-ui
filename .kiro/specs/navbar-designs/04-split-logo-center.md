# Navbar Type 4: Split Logo Center

## Visual Design

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│     Home    About      [    LOGO    ]      Shop    Contact    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
         ↑                    ↑                   ↑
    Left links            Centered logo       Right links
```

## Detailed Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                ┃
┃                                                                ┃
┃    Home   About          ┌───────────┐          Shop  Contact ┃
┃                          │   BRAND   │                         ┃
┃    [Link] [Link]         │   LOGO    │         [Link] [Link]  ┃
┃                          └───────────┘                         ┃
┃                                                                ┃
┃                                                                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    ├─────────────┤        ├─────────┤        ├─────────────┤
    Left Section           Center Logo         Right Section
    (33% width)            (34% width)         (33% width)
```

## Three-Column Grid

```
┌─────────────────┬─────────────────┬─────────────────┐
│   Left Links    │      LOGO       │  Right Links    │
│                 │                 │                 │
│  • Home         │   ┌───────┐    │  • Shop        │
│  • About        │   │ LOGO  │    │  • Contact     │
│  • Services     │   │ IMAGE │    │  • Cart        │
│                 │   └───────┘    │                 │
│                 │                 │                 │
└─────────────────┴─────────────────┴─────────────────┘
     Flex: 1            Flex: 0           Flex: 1
  Text-align: right   Center/Fixed    Text-align: left
```

## Specifications

**Dimensions:**
- Height: `80px` (taller for logo prominence)
- Max-width: `1400px` (wider for balanced spacing)
- Padding: `var(--k-space-6)` vertical, `var(--k-space-8)` horizontal

**Layout Structure:**
- Display: `grid` or `flex`
- Grid: `1fr auto 1fr` (left auto-size | center fixed | right auto-size)
- Align items: `center`

**Logo Section (Center):**
- Max height: `60px`
- Max width: `200px`
- Display: `flex`, `justify-content: center`, `align-items: center`
- Logo is the visual anchor

**Left Links:**
- Justify: `flex-end` (align right, toward logo)
- Gap: `var(--k-space-6)`
- Padding right: `var(--k-space-8)`

**Right Links:**
- Justify: `flex-start` (align left, toward logo)
- Gap: `var(--k-space-6)`
- Padding left: `var(--k-space-8)`

**Visual Style:**
- Background: `var(--k-bg-base)`
- Border bottom: `1px solid var(--k-border)` (optional, or borderless for cleaner look)
- Typography: `var(--k-text-base)`, `var(--k-font-normal)` (lighter weight for elegance)

**Link Style:**
- Color: `var(--k-text-secondary)`
- Hover: `var(--k-text-primary)` with subtle underline
- Active: `var(--k-text-primary)` + 2px bottom border `var(--k-accent)`
- Letter spacing: `0.5px` (slightly looser for elegance)

## Symmetry Visual

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                        ┃
┃      Link 1   Link 2      [LOGO]      Link 3   Link 4 ┃
┃         ↑        ↑           ↑           ↑        ↑    ┃
┃         └────────┼───────────┼───────────┼────────┘    ┃
┃              Symmetrical spacing                       ┃
┃                                                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Equal gaps, balanced composition
```

## Mobile Behavior (< 768px)

```
Stacked layout:
┌───────────────────────┐
│      [ LOGO ]         │  ← Logo centered on top
├───────────────────────┤
│  Home                 │  ← Links stacked below
│  About                │
│  Services             │
│  Shop                 │
│  Contact              │
└───────────────────────┘

OR

Hamburger menu:
┌───────────────────────┐
│  [☰]  [LOGO]    [🛒]  │
└───────────────────────┘
```

## Use Cases
- Luxury brands
- Fashion e-commerce
- Restaurants
- Portfolios
- Photography sites
- Editorial/magazine sites

## Key Features
- Logo is the star (centered focal point)
- Symmetrical, balanced composition
- Elegant, premium aesthetic
- More whitespace, less cluttered
- Works best with iconic logos

## Logo Considerations

**Ideal logo types:**
- Circular/square logos (symmetrical)
- Wordmarks that work at larger sizes
- Icons with text below

**Avoid:**
- Wide horizontal logos (breaks balance)
- Logos that need to be very small

## Accessibility
- `<nav role="navigation">`
- `aria-label="Main navigation"`
- Logo link should go to home (`/`)
- Logo has `alt` text
- Left/right link order maintained in DOM for screen readers

## Example HTML Structure
```html
<k-navbar-split>
  <!-- Left links -->
  <a slot="left" href="/">Home</a>
  <a slot="left" href="/about">About</a>
  <a slot="left" href="/services">Services</a>
  
  <!-- Center logo -->
  <img slot="logo" src="brand-logo.svg" alt="Brand Name" href="/">
  
  <!-- Right links -->
  <a slot="right" href="/shop">Shop</a>
  <a slot="right" href="/contact">Contact</a>
  <a slot="right" href="/cart">Cart</a>
</k-navbar-split>
```

## Visual Balance Tips

**Even number of links:**
```
Left: 2 links  |  LOGO  |  Right: 2 links  ← Perfect balance
```

**Odd number of links:**
```
Left: 3 links  |  LOGO  |  Right: 2 links + icon  ← Use icon to balance
```

## Animation
- Logo: Subtle scale on hover (`transform: scale(1.05)`, `200ms ease`)
- Links: Fade-in bottom border on hover (`300ms ease`)
- Active link: Border slides in from center (`250ms ease`)
