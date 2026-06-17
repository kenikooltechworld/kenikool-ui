# Navbar Type 5: Bottom Tab Bar

## Visual Design

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│                    PAGE CONTENT                           │
│                                                           │
│                                                           │
└───────────────────────────────────────────────────────────┘
┌───────────────────────────────────────────────────────────┐
│    🏠        🔍        ➕        💬        👤           │
│   Home     Search    Create    Messages  Profile          │
└───────────────────────────────────────────────────────────┘
            ↑ Bottom Tab Bar (iOS/Android style)
```

## Detailed Layout

```
                    CONTENT AREA

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃         ┃         ┃         ┃         ┃         ┃       ┃
┃   🏠    ┃   🔍    ┃   ➕    ┃   💬    ┃   👤    ┃       ┃
┃  Home   ┃ Search  ┃ Create  ┃Messages ┃ Profile ┃       ┃
┃         ┃         ┃         ┃         ┃         ┃       ┃
┗━━━━━━━━━┻━━━━━━━━━┻━━━━━━━━━┻━━━━━━━━━┻━━━━━━━━━┻━━━━━━━┛
   20%        20%       20%       20%       20%
  
  Equal-width tabs
  Icon on top, label below
  Active tab highlighted
```

## Specifications

**Dimensions:**
- Height: `56px` (safe area + tab content)
- Width: `100vw` (full viewport width)
- Safe area bottom: `env(safe-area-inset-bottom)` (iPhone notch)

**Position:**
- `position: fixed`
- `bottom: 0`
- `left: 0`
- `z-index: var(--k-z-sticky)`

**Tab Item Structure:**
- 3-5 tabs maximum (UX best practice)
- Equal width distribution
- Icon: 24px, centered
- Label: `var(--k-text-xs)`, centered below icon
- Gap between icon and label: `var(--k-space-1)`

**Visual Style:**
- Background: `var(--k-bg-surface)`
- Top border: `1px solid var(--k-border)`
- Box shadow: `0 -2px 8px rgba(0,0,0,0.08)` (subtle upward shadow)

**Tab States:**
```
Inactive Tab:
┌─────────┐
│   🏠    │  ← Icon: var(--k-text-muted)
│  Home   │  ← Label: var(--k-text-muted)
└─────────┘

Active Tab:
┌─────────┐
│   🏠    │  ← Icon: var(--k-accent) (colored)
│  Home   │  ← Label: var(--k-accent) (colored)
└─────────┘
   ↑
Top border indicator (2px solid --k-accent)
```

**Badge Support (Notifications):**
```
┌─────────┐
│  💬🔴   │  ← Red badge on top-right of icon
│Messages │
└─────────┘

Badge: 8px circle, position: absolute, top-right
```

## Active Indicator Variations

**Option 1: Top Border**
```
┏━━━━━┓
┃ 🏠  ┃  ← 2px colored top border
┃Home ┃
┗━━━━━┛
```

**Option 2: Background Pill**
```
┌─────────┐
│ ┏━━━━┓ │
│ ┃ 🏠 ┃ │  ← Rounded background
│ ┃Home┃ │
│ ┗━━━━┛ │
└─────────┘
```

**Option 3: Sliding Indicator**
```
┌─────┬─────┬─────┬─────┬─────┐
│ 🏠  │ 🔍  │ ➕  │ 💬  │ 👤  │
│Home │Srch │Add  │Msgs │Prof │
└─────┴──━━━┴─────┴─────┴─────┘
        ↑
   Sliding bar animates under active tab
```

## Mobile Safe Area Handling

```
┌───────────────────────────────────┐
│          Content                  │
├───────────────────────────────────┤
│  🏠    🔍    ➕    💬    👤      │  ← Tab bar
│ Home Search Add  Msgs  Prof      │
├───────────────────────────────────┤
│                                   │  ← Safe area (iPhone notch)
│          padding-bottom           │     env(safe-area-inset-bottom)
└───────────────────────────────────┘
```

CSS:
```css
padding-bottom: calc(env(safe-area-inset-bottom) + var(--k-space-2));
```

## Use Cases
- Mobile apps
- Progressive Web Apps (PWAs)
- Touch-first interfaces
- Social media apps
- E-commerce apps
- Content browsing apps

## Key Features
- Thumb-zone friendly (easy to reach)
- Always visible
- Fast switching between main sections
- Icon-first for quick recognition
- Space-efficient

## Icon + Label Combinations

**Icons Only (compact):**
```
┌─────┬─────┬─────┬─────┬─────┐
│  🏠 │ 🔍  │ ➕  │ 💬  │ 👤  │
└─────┴─────┴─────┴─────┴─────┘
```

**Icons + Labels (default):**
```
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│   🏠    │   🔍    │   ➕    │   💬    │   👤    │
│  Home   │ Search  │ Create  │Messages │ Profile │
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

## Accessibility
- `<nav role="navigation">`
- `aria-label="Bottom tab bar navigation"`
- Each tab: `role="tab"`, `aria-selected="true/false"`
- `aria-current="page"` on active tab
- Icon has `aria-hidden="true"`, label provides text
- Touch target: minimum 44×44px (WCAG 2.5.5)

## Example HTML Structure
```html
<k-navbar-bottom>
  <a href="/" icon="home" active>Home</a>
  <a href="/search" icon="search">Search</a>
  <a href="/create" icon="plus">Create</a>
  <a href="/messages" icon="message" badge="3">Messages</a>
  <a href="/profile" icon="user">Profile</a>
</k-navbar-bottom>
```

## Animation
- Tab switch: Icon color fade `200ms ease`
- Indicator slide: `250ms cubic-bezier(0.4, 0, 0.2, 1)`
- Badge pulse: Scale animation `600ms ease` (when new notification)
- Press effect: Scale down to 0.95 on tap

## Best Practices
- **3-5 tabs only**: More requires scrolling (bad UX)
- **Always show labels**: Icons alone can be ambiguous
- **Highlight active clearly**: Users should always know where they are
- **Reserve center for primary action**: Middle position is easiest to reach
- **Use familiar icons**: Stick to conventions (home, search, profile, etc.)
