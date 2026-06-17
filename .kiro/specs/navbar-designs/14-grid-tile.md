# Navbar Type 14: Grid/Tile Navigation

## Visual Design

```
┌────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │   📊     │  │   📁     │  │   ⚙️     │            │
│  │Dashboard │  │ Projects │  │ Settings │            │
│  │          │  │          │  │          │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │   👥     │  │   📈     │  │   💬     │            │
│  │   Team   │  │Analytics │  │ Messages │            │
│  │          │  │          │  │          │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└────────────────────────────────────────────────────────┘
```

## Detailed Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                        ┃
┃  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┃
┃  │     📊      │  │     📁      │  │     ⚙️      │  ┃
┃  │             │  │             │  │             │  ┃
┃  │  Dashboard  │  │  Projects   │  │  Settings   │  ┃
┃  │             │  │             │  │             │  ┃
┃  │  View data  │  │  12 active  │  │  Configure  │  ┃
┃  └─────────────┘  └─────────────┘  └─────────────┘  ┃
┃                                                        ┃
┃  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┃
┃  │     👥      │  │     📈      │  │     💬      │  ┃
┃  │             │  │             │  │             │  ┃
┃  │    Team     │  │  Analytics  │  │  Messages   │  ┃
┃  │             │  │             │  │             │  ┃
┃  │  8 members  │  │  View stats │  │  3 unread   │  ┃
┃  └─────────────┘  └─────────────┘  └─────────────┘  ┃
┃                                                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  ├─────────────┤   ├─────────────┤   ├─────────────┤
      Tile 1            Tile 2            Tile 3
```

## Specifications

**Grid Container:**
- Display: `grid`
- Grid template columns: `repeat(auto-fit, minmax(200px, 1fr))`
- Gap: `var(--k-space-6)`
- Padding: `var(--k-space-8)`
- Max-width: `1200px` (centered)

**Tile Card:**
- Min height: `180px`
- Padding: `var(--k-space-6)`
- Background: `var(--k-bg-surface)`
- Border: `1px solid var(--k-border)`
- Border radius: `var(--k-radius-xl)`
- Shadow: `var(--k-shadow-sm)`
- Cursor: `pointer`
- Transition: `all 200ms ease`

**Tile Structure:**
```
┌─────────────┐
│    Icon     │  ← 48px icon (top)
│             │
│   Title     │  ← var(--k-text-xl), bold
│             │
│ Description │  ← var(--k-text-sm), muted
│             │
│   [Badge]   │  ← Optional status badge
└─────────────┘
```

**Hover State:**
- Transform: `translateY(-4px)` (lift effect)
- Shadow: `var(--k-shadow-md)` → `var(--k-shadow-lg)`
- Border: `var(--k-accent)`

## Use Cases
- App launchers (dashboard home screens)
- Service menus (product categories)
- Admin panels (feature access)
- Category browsers
- Portal homepages

## Key Features
- Visual, card-based layout
- Large touch targets
- Shows icons + descriptions
- Responsive grid (auto-fits)
- Can include status/badges
- Scannable at a glance

## Tile Variants

**Variant 1: Icon + Title Only (Minimal)**
```
┌──────────┐
│   📊     │
│          │
│Dashboard │
└──────────┘
```

**Variant 2: Icon + Title + Description**
```
┌────────────────┐
│      📊        │
│   Dashboard    │
│  View metrics  │
│  and reports   │
└────────────────┘
```

**Variant 3: Icon + Title + Badge**
```
┌────────────────┐
│      💬   [3]  │  ← Badge top-right
│   Messages     │
│                │
└────────────────┘
```
J
**Variant 4: Background Image Tile**
```
┌────────────────┐
│ ╔═══════════╗  │
│ ║  [Image]  ║  │
│ ║           ║  │
│ ╚═══════════╝  │
│   Projects     │
└────────────────┘
```

**Variant 5: Stat Tile**
```
┌────────────────┐
│      📈        │
│   Revenue      │
│   $125,432     │  ← Large number
│   ↑ 12%        │  ← Trend indicator
└────────────────┘
```

## Grid Layouts

**2-Column (Mobile):**
```
┌─────┬─────┐
│ [1] │ [2] │
├─────┼─────┤
│ [3] │ [4] │
└─────┴─────┘
```

**3-Column (Tablet):**
```
┌─────┬─────┬─────┐
│ [1] │ [2] │ [3] │
├─────┼─────┼─────┤
│ [4] │ [5] │ [6] │
└─────┴─────┴─────┘
```

**4-Column (Desktop):**
```
┌─────┬─────┬─────┬─────┐
│ [1] │ [2] │ [3] │ [4] │
├─────┼─────┼─────┼─────┤
│ [5] │ [6] │ [7] │ [8] │
└─────┴─────┴─────┴─────┘
```

## Mobile Behavior (< 768px)

```
Stacked 2-column grid:
┌──────────────────────┐
│  ┌────────┐┌────────┐│
│  │   📊   ││   📁   ││
│  │Dash... ││Project ││
│  └────────┘└────────┘│
│  ┌────────┐┌────────┐│
│  │   ⚙️   ││   👥   ││
│  │Setting ││  Team  ││
│  └────────┘└────────┘│
└──────────────────────┘

Smaller tiles, 2 per row
Scrollable vertically
```

## Accessibility
- `<nav role="navigation">`
- Each tile: `<a>` or `<button>` with full content text
- Icon: `aria-hidden="true"` (decorative)
- Title provides accessible name
- Keyboard: Tab through tiles, Enter to activate
- Focus visible: Outline around tile

## Example HTML Structure
```html
<k-navbar-grid columns="3" gap="lg">
  <k-nav-tile href="/dashboard" icon="📊">
    <span slot="title">Dashboard</span>
    <span slot="description">View metrics and reports</span>
  </k-nav-tile>
  
  <k-nav-tile href="/projects" icon="📁">
    <span slot="title">Projects</span>
    <span slot="description">12 active projects</span>
    <k-badge slot="badge" count="12"></k-badge>
  </k-nav-tile>
  
  <k-nav-tile href="/settings" icon="⚙️">
    <span slot="title">Settings</span>
    <span slot="description">Configure your workspace</span>
  </k-nav-tile>
  
  <k-nav-tile href="/team" icon="👥">
    <span slot="title">Team</span>
    <span slot="description">8 team members</span>
  </k-nav-tile>
  
  <k-nav-tile href="/analytics" icon="📈">
    <span slot="title">Analytics</span>
    <span slot="description">View statistics</span>
  </k-nav-tile>
  
  <k-nav-tile href="/messages" icon="💬">
    <span slot="title">Messages</span>
    <span slot="description">3 unread messages</span>
    <k-badge slot="badge" count="3" color="error"></k-badge>
  </k-nav-tile>
</k-navbar-grid>
```

## Loading State

```
Skeleton tiles:
┌────────────────┐
│   ░░░░░░░      │  ← Shimmer animation
│   ░░░░░░░░░    │
│   ░░░░░        │
└────────────────┘
```

## Empty State

```
┌─────────────────────────────┐
│                             │
│     [Empty Icon]            │
│   No items to display       │
│  [Create New Item →]        │
│                             │
└─────────────────────────────┘
```

## Animation
- Tile hover lift: `transform: translateY(-4px)`, `200ms ease`
- Shadow grow: `box-shadow` transition, `200ms ease`
- Initial load: Staggered fade-in, `100ms` delay per tile
- Click press: Scale down to 0.98, `100ms ease`

## Best Practices
- 6-12 tiles for optimal scanability
- Use consistent icon style
- Keep titles short (1-3 words)
- Provide helpful descriptions
- Show status/counts when relevant
- Maintain equal tile heights
- Responsive grid adapts to screen size
