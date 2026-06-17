# Navbar Type 13: Radial/Circular Menu

## Visual Design

```
Closed:                  Open:
   ┌───┐                    [4]
   │ ➕ │              [3]   ┌───┐   [5]
   └───┘                    │ × │
                            └───┘
                        [2]         [6]
                            [1]
```

## Detailed Layout (Expanded)

```
                  🏠
              ┌────────┐
          📊  │        │  🔍
        ┌────┐│        │┌────┐
        └────┘│   ➕   ││    │
              │   →×   │└────┘
          ⚙️  │        │  💬
        ┌────┐│        │┌────┐
        └────┘│        │└────┘
              └────────┘
                  👤

Items arranged in 360° circle
Center trigger button
8 surrounding action buttons
120px radius from center
```

## Specifications

**Center Trigger Button:**
- Size: `56×56px`
- Border radius: `50%` (perfect circle)
- Background: `var(--k-accent)`
- Icon: `➕` (plus, closed), `×` (close, open)
- Shadow: `var(--k-shadow-md)`
- Z-index: `var(--k-z-dropdown)`

**Action Buttons (Items):**
- Size: `48×48px`
- Border radius: `50%`
- Background: `var(--k-bg-surface)`
- Border: `1px solid var(--k-border)`
- Icon: 24px, centered
- Shadow: `var(--k-shadow-sm)`
- Position: Absolute, calculated via trigonometry

**Position Calculation:**
```javascript
// Place 8 items in a circle
const radius = 120; // pixels from center
const angleStep = 360 / itemCount;

items.forEach((item, index) => {
  const angle = (index * angleStep) * (Math.PI / 180);
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  
  item.style.transform = `translate(${x}px, ${y}px)`;
});
```

**Backdrop:**
- Background: `rgba(0, 0, 0, 0.3)`
- Covers full viewport
- Click: Closes menu

## Use Cases
- Mobile apps (quick actions)
- Creative tools (tool selector)
- Context menus
- Floating action menus
- Touch-first interfaces

## Key Features
- Space-efficient (hidden when closed)
- Thumb-zone friendly on mobile
- Visual, icon-based
- Fun, engaging animation
- One-handed operation

## Animation Sequence

```
Closed (Scale 0):
   ┌───┐
   │ ➕ │
   └───┘

Opening (Items fan out):
Step 1: Center rotates 45deg, icon changes to ×
Step 2: Items scale from 0 to 1, staggered
Step 3: Items slide to final positions

   [4]
[3]┌───┐[5]
   │ × │
[2]└───┘[6]
   [1]
```

## Position Variations

**Arc (180°) - Top Half Only:**
```
    [3] [4] [5]
 [2]           [6]
[1]  ┌───┐  [7]
     │ ➕ │
     └───┘
```

**Arc (90°) - Quarter Circle:**
```
        [4]
    [3]
[2]
┌───┐  
│ ➕ │
└───┘
```

**Vertical Stack:**
```
    [4]
    [3]
    [2]
┌───┐
│ ➕ │
└───┘
    [1]
    [0]
```

## Item Count Variations

**4 Items (Cardinal Directions):**
```
      [N]
[W] ┌───┐ [E]
    │ ➕ │
    └───┘
      [S]
```

**6 Items (Hexagon):**
```
    [T]
[TL]   [TR]
  ┌───┐
  │ ➕ │
  └───┘
[BL]   [BR]
    [B]
```

**8 Items (Octagon - Full Circle):**
```
  [N]
[NW] [NE]
[W]┌───┐[E]
   │ ➕ │
   └───┘
[SW] [SE]
  [S]
```

## Label Options

**Option 1: No Labels (Icon Only)**
```
    🏠
  ┌───┐
  │ ➕ │
  └───┘
    📊
```

**Option 2: Tooltip on Hover**
```
   Home ← Appears on hover
    🏠
  ┌───┐
  │ ➕ │
  └───┘
```

**Option 3: Always Visible**
```
    🏠
   Home
  ┌───┐
  │ ➕ │
  └───┘
```

## Mobile Behavior

**Bottom-Right Floating (WhatsApp-style):**
```
┌─────────────────────────┐
│                         │
│   Content               │
│                         │
│                         │
│                    🏠   │
│              [4]┌───┐   │
│                 │➕ │   │
│              [1]└───┘   │
└─────────────────────────┘
```

**Center of Screen:**
```
┌─────────────────────────┐
│                         │
│      [4]                │
│  [3]┌───┐[5]            │
│     │➕ │               │
│  [2]└───┘[6]            │
│      [1]                │
│                         │
└─────────────────────────┘
```

## Accessibility
- `<nav role="navigation">`
- Trigger: `<button aria-expanded="false/true" aria-label="Open actions menu">`
- Each item: `<button aria-label="[Action name]">`
- Keyboard: Tab to trigger, Enter opens, Arrow keys navigate items
- Focus trap: Cycles through items when open
- Escape: Closes menu

## Example HTML Structure
```html
<k-navbar-radial position="bottom-right" radius="120">
  <button slot="trigger" aria-label="Actions menu">
    ➕
  </button>
  
  <a href="/" icon="home" label="Home"></a>
  <a href="/search" icon="search" label="Search"></a>
  <a href="/create" icon="plus" label="Create"></a>
  <a href="/messages" icon="message" label="Messages"></a>
  <a href="/notifications" icon="bell" label="Notifications"></a>
  <a href="/settings" icon="settings" label="Settings"></a>
  <a href="/help" icon="help" label="Help"></a>
  <a href="/profile" icon="user" label="Profile"></a>
</k-navbar-radial>
```

## Animation Timing

```javascript
// Staggered appearance
items.forEach((item, index) => {
  item.style.animationDelay = `${index * 50}ms`;
});

// CSS
@keyframes fanOut {
  from {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  to {
    transform: translate(var(--x), var(--y)) scale(1);
    opacity: 1;
  }
}
```

## Animation Styles
- Trigger rotate: `transform: rotate(45deg)`, `200ms ease`
- Icon morph: Plus → X, `200ms ease`
- Items fan out: `300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)` (elastic)
- Stagger delay: `50ms` between each item
- Close animation: Reverse of open, `250ms ease`

## Best Practices
- 4-8 items maximum (more gets cluttered)
- Use clear, recognizable icons
- Position where thumb can reach (mobile)
- Provide visual feedback on hover/tap
- Close on outside click or item selection
- Use contrasting colors for visibility
