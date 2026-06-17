# Navbar Type 11: Tab Bar Switcher

## Visual Design

```
┌──────────────────────────────────────────────────────────┐
│  Overview    Features    Pricing    Reviews    FAQ       │
│     ━━━                                                   │
└──────────────────────────────────────────────────────────┘
       ↑
  Active tab with underline indicator
```

## Detailed Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                           ┃
┃  Overview   Features   Pricing   Reviews   FAQ           ┃
┃     ━━━                                                   ┃
┃                                                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
       ↑          ↑         ↑         ↑        ↑
   Tab button   Tab       Tab       Tab      Tab
   (Active)   (Inactive) (Inactive)(Inactive)(Inactive)
```

## Sliding Indicator Visualization

```
State 1: "Overview" active
┌──────────────────────────────────────────┐
│  Overview   Features   Pricing   Reviews │
│     ━━━                                  │
└──────────────────────────────────────────┘

Click "Pricing":
┌──────────────────────────────────────────┐
│  Overview   Features   Pricing   Reviews │
│                          ━━━             │  ← Indicator slides
└──────────────────────────────────────────┘

Final State: "Pricing" active
┌──────────────────────────────────────────┐
│  Overview   Features   Pricing   Reviews │
│                          ━━━             │
└──────────────────────────────────────────┘
```

## Specifications

**Container:**
- Height: `48px`
- Display: `flex`, `align-items: center`
- Border bottom: `1px solid var(--k-border)`
- Background: `var(--k-bg-surface)`
- Position: `relative` (for sliding indicator)

**Tab Button:**
- Padding: `var(--k-space-3) var(--k-space-6)`
- Font: `var(--k-text-base)`, `var(--k-font-medium)`
- Color: `var(--k-text-secondary)` (inactive), `var(--k-text-primary)` (active)
- Border: None
- Background: Transparent
- Cursor: `pointer`
- Transition: `color 200ms ease`

**Active Indicator:**
- Height: `3px`
- Width: Matches active tab width
- Position: `absolute`, `bottom: 0`
- Background: `var(--k-accent)`
- Border radius: `2px 2px 0 0` (rounded top corners)
- Transition: `transform 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms ease`

**Hover State:**
- Background: `var(--k-accent-subtle)`
- Border radius: `var(--k-radius-sm)`

## Use Cases
- Settings panels (Account, Privacy, Security)
- Product pages (Overview, Features, Specs)
- Dashboard views (Analytics, Reports, Users)
- Profile sections (Posts, About, Photos)
- Multi-view interfaces

## Key Features
- Visual active indicator animates
- Radio-button behavior (one active at a time)
- Switches content panel below
- Horizontal layout, compact
- Touch-friendly

## Indicator Variants

**Variant 1: Bottom Underline (default)**
```
Tab 1   Tab 2   Tab 3
  ━━━
```

**Variant 2: Top Border**
```
  ━━━
Tab 1   Tab 2   Tab 3
```

**Variant 3: Background Pill**
```
┌──────┐
│ Tab1 │  Tab2   Tab3
└──────┘
   ↑ Sliding pill background
```

**Variant 4: Segmented Control (iOS-style)**
```
┌──────┬──────┬──────┐
│ Tab1 │ Tab2 │ Tab3 │
└──────┴──────┴──────┘
   ↑ Border around selected
```

## Content Panel Integration

```
┌─────────────────────────────────────────┐
│  Overview   Features   Pricing          │  ← Tab bar
│     ━━━                                 │
├─────────────────────────────────────────┤
│                                         │
│  CONTENT PANEL FOR "OVERVIEW"          │  ← Content changes
│                                         │     based on active tab
│  • Feature 1                            │
│  • Feature 2                            │
│  • Feature 3                            │
│                                         │
└─────────────────────────────────────────┘
```

## Mobile Behavior (< 768px)

**Option 1: Scrollable Tabs**
```
┌───────────────────────────────────────┐
│ Tab1  Tab2  Tab3  Tab4  Tab5 → › ›   │  ← Overflow scrolls
│   ━━━                                 │
└───────────────────────────────────────┘

CSS: overflow-x: auto; scroll-snap-type: x mandatory;
```

**Option 2: Dropdown on Mobile**
```
┌───────────────────────────┐
│ Overview ▾                │  ← Select-style dropdown
└───────────────────────────┘

Expands to show all tabs
```

**Option 3: Stacked Vertical**
```
┌───────────────┐
│ ━━━ Overview  │  ← Active
│     Features  │
│     Pricing   │
└───────────────┘
```

## Accessibility
- `role="tablist"` on container
- Each tab: `role="tab"`, `aria-selected="true/false"`
- Content panel: `role="tabpanel"`, `aria-labelledby="tab-id"`
- `tabindex="0"` on active tab, `tabindex="-1"` on inactive
- Arrow keys: Left/Right navigate between tabs
- Home/End: Jump to first/last tab
- Space/Enter: Activate focused tab

## Example HTML Structure
```html
<k-navbar-tabs>
  <button role="tab" aria-selected="true" active>Overview</button>
  <button role="tab" aria-selected="false">Features</button>
  <button role="tab" aria-selected="false">Pricing</button>
  <button role="tab" aria-selected="false">Reviews</button>
  <button role="tab" aria-selected="false">FAQ</button>
</k-navbar-tabs>

<!-- Content panels -->
<div role="tabpanel" id="overview-panel" visible>
  Overview content
</div>
<div role="tabpanel" id="features-panel" hidden>
  Features content
</div>
```

## Icon + Label Tabs

```
┌────────────────────────────────────────────┐
│  📊 Analytics  📈 Reports  ⚙️ Settings     │
│      ━━━                                   │
└────────────────────────────────────────────┘

Icons above labels (vertical stack)
Or icons left of labels (horizontal)
```

## Count/Badge Support

```
┌────────────────────────────────────────────┐
│  Overview  Features  Messages [12]  FAQ   │
│     ━━━                                    │
└────────────────────────────────────────────┘
                         ↑
                  Badge shows count
```

## Disabled Tab State

```
┌──────────────────────────────────────┐
│  Tab1   Tab2   Tab3   Tab4           │
│   ━━━          ░░░░ (disabled)       │
└──────────────────────────────────────┘
         ↑          ↑
    Active      Disabled (grayed out, not clickable)
```

## Animation
- Indicator slide: `300ms cubic-bezier(0.4, 0, 0.2, 1)`
- Tab text color: `200ms ease`
- Hover background: `150ms ease`
- Content panel fade: `200ms ease` (old panel out, new panel in)

## Best Practices
- 3-7 tabs maximum for horizontal layout
- Use descriptive, concise labels
- Keep tab labels short (1-2 words)
- Active tab always clearly visible
- Animate indicator smoothly
- Support keyboard navigation
