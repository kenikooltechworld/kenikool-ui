# Navbar Type 6: Mega Header

## Visual Design

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [LOGO]                                    🔍 Search    Login    Cart (2)  │  ← Top bar
├────────────────────────────────────────────────────────────────────────────┤
│         Products ▾    Solutions ▾    Resources ▾    Pricing    Contact     │  ← Main nav
└────────────────────────────────────────────────────────────────────────────┘
```

## Detailed Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ┌──────┐                                  [Search] [Login] [🛒 2]        ┃
┃  │ LOGO │            Top Utility Bar                                      ┃
┃  └──────┘                                                                 ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                            ┃
┃    Products ▾    Solutions ▾    Resources ▾    Pricing    Contact         ┃
┃                                                                            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
     ↑             ↑               ↑              ↑          ↑
  Dropdown      Dropdown        Dropdown      Simple      Simple
  Mega Menu     Mega Menu       Mega Menu      Link        Link
```

## Two-Row Structure

```
Row 1: Utility Bar (36px height)
┌────────────────────────────────────────────────────────────┐
│ LOGO          Support | Help | 🌐 EN ▾     Search  Login  │
└────────────────────────────────────────────────────────────┘
         ↑                    ↑                    ↑
      Brand              Meta Links           Actions

Row 2: Main Navigation (56px height)
┌────────────────────────────────────────────────────────────┐
│       Products ▾   Solutions ▾   Pricing   Resources ▾     │
└────────────────────────────────────────────────────────────┘
              ↑            ↑          ↑           ↑
         Content Nav  Content Nav  Page Link  Content Nav
```

## Mega Menu Dropdown (Full Width)

```
Hover on "Products":

┌────────────────────────────────────────────────────────────────────────────┐
│  Products ▾                                                                │
├════════════════════════════════════════════════════════════════════════════┤
│ ┌──────────────┬──────────────┬──────────────┬──────────────────────────┐ │
│ │ By Category  │ By Industry  │ Popular      │      [Promo Card]        │ │
│ │              │              │              │                          │ │
│ │ • Web Apps   │ • Healthcare │ • CRM Plus   │   New Feature!           │ │
│ │ • Mobile     │ • Finance    │ • Analytics  │   Try our AI Assistant   │ │
│ │ • Desktop    │ • Retail     │ • Dashboard  │   [Learn More →]         │ │
│ │ • APIs       │ • Education  │              │                          │ │
│ │              │              │              │                          │ │
│ └──────────────┴──────────────┴──────────────┴──────────────────────────┘ │
│                                                                            │
│ [View All Products →]                                                     │
└────────────────────────────────────────────────────────────────────────────┘

Multi-column layout
Organized categories
Promotional space
Footer action
```

## Specifications

**Row 1 (Utility Bar):**
- Height: `36px`
- Background: `var(--k-bg-elevated)` (lighter than main nav)
- Font size: `var(--k-text-xs)`
- Content: Logo (left) + Meta links (center) + Actions (right)

**Row 2 (Main Nav):**
- Height: `56px`
- Background: `var(--k-bg-surface)`
- Border bottom: `1px solid var(--k-border)`
- Font size: `var(--k-text-base)`
- Content: Primary navigation links

**Mega Menu Dropdown:**
- Width: `100vw` or `max-width: 1400px` (matches container)
- Position: `absolute`, below nav row
- Background: `var(--k-bg-surface)`
- Border: `1px solid var(--k-border)`
- Shadow: `var(--k-shadow-lg)`
- Padding: `var(--k-space-8)`
- Layout: CSS Grid, 3-4 columns

**Dropdown Trigger:**
- Padding: `var(--k-space-4) var(--k-space-6)`
- Chevron icon: `▾` (down arrow)
- Hover: Background `var(--k-accent-subtle)`
- Active (expanded): Background `var(--k-accent-subtle)` + chevron rotates 180deg

## Use Cases
- E-commerce sites
- Large content portals
- Enterprise SaaS platforms
- News/media sites
- Corporate sites with many sections

## Key Features
- Two-level hierarchy (utility + main nav)
- Mega menu shows all options at once
- Can include promotional content
- More navigation real estate
- Organized, scannable structure

## Mega Menu Variants

**Variant 1: Multi-Column Links**
```
┌──────────────────────────────────────────────────────┐
│  Column 1        Column 2        Column 3            │
│  • Link          • Link          • Link              │
│  • Link          • Link          • Link              │
│  • Link          • Link          • Link              │
└──────────────────────────────────────────────────────┘
```

**Variant 2: Icon Grid**
```
┌──────────────────────────────────────────────────────┐
│  [📱]          [💻]          [⚙️]                   │
│  Mobile        Desktop       Settings                │
│                                                      │
│  [🔒]          [📊]          [🎨]                   │
│  Security      Analytics     Design                  │
└──────────────────────────────────────────────────────┘
```

**Variant 3: Mixed Content**
```
┌──────────────────────────────────────────────────────┐
│  Product List        │  Featured                     │
│  • Item 1            │  ┌─────────────────────┐     │
│  • Item 2            │  │   [Hero Image]       │     │
│  • Item 3            │  │   New Release        │     │
│  • Item 4            │  │   [CTA Button]       │     │
│                      │  └─────────────────────┘     │
└──────────────────────────────────────────────────────┘
```

## Mobile Behavior (< 768px)

```
Collapses to single hamburger menu:

┌─────────────────────────────────┐
│  [☰]  [LOGO]           [🛒] [🔍] │
└─────────────────────────────────┘

Opens full-screen drawer:

┌─────────────────────────────────┐
│  [×]  Menu                      │
├─────────────────────────────────┤
│  Products              [+]      │ ← Expand/collapse
│    • Category 1                 │
│    • Category 2                 │
│                                 │
│  Solutions             [+]      │
│                                 │
│  Pricing                        │
│  Resources             [+]      │
│  Contact                        │
├─────────────────────────────────┤
│  [Login]  [Cart]                │
└─────────────────────────────────┘

Nested accordion for dropdowns
```

## Accessibility
- `<nav role="navigation">` for each row
- `aria-label="Utility navigation"` (row 1)
- `aria-label="Main navigation"` (row 2)
- Dropdown triggers: `aria-expanded="false/true"`, `aria-haspopup="true"`
- Mega menu: `aria-hidden="true/false"` when closed/open
- Keyboard: Tab through all links, Escape closes dropdown
- Focus trap within open mega menu

## Example HTML Structure
```html
<k-navbar-mega>
  <!-- Top utility bar -->
  <div slot="utility">
    <img slot="logo" src="logo.svg" alt="Brand">
    <a href="/support">Support</a>
    <a href="/help">Help</a>
    <div slot="actions">
      <k-input v="search sm" placeholder="Search..."></k-input>
      <k-button v="ghost sm">Login</k-button>
      <k-badge v="count primary" count="2">
        <k-button v="ghost sm" icon="cart"></k-button>
      </k-badge>
    </div>
  </div>
  
  <!-- Main navigation -->
  <div slot="main">
    <k-navbar-dropdown label="Products">
      <div class="mega-menu">
        <div class="column">
          <h4>By Category</h4>
          <a href="/web">Web Apps</a>
          <a href="/mobile">Mobile</a>
          <a href="/desktop">Desktop</a>
        </div>
        <div class="column">
          <h4>By Industry</h4>
          <a href="/healthcare">Healthcare</a>
          <a href="/finance">Finance</a>
        </div>
      </div>
    </k-navbar-dropdown>
    
    <a href="/pricing">Pricing</a>
    <a href="/contact">Contact</a>
  </div>
</k-navbar-mega>
```

## Animation
- Mega menu slide down: `250ms ease`, `transform: translateY(-10px)` → `translateY(0)`
- Chevron rotate: `200ms ease`
- Background fade: `150ms ease`
- Hover highlight: `200ms ease`
