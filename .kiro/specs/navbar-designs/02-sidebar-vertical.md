# Navbar Type 2: Sidebar Vertical

## Visual Design

```
┌─────────────┐
│   [LOGO]    │
│             │
├─────────────┤
│  Dashboard  │
│  Analytics  │
│  Projects   │
│  Team       │
│  Settings   │
│             │
│             │
│             │
│             │
├─────────────┤
│   [USER]    │
│   Logout    │
└─────────────┘
```

## Detailed Layout (Expanded State)

```
┏━━━━━━━━━━━━━━━━━┓
┃                 ┃
┃   ┌─────────┐   ┃
┃   │  LOGO   │   ┃  ← Top: Logo/Brand
┃   │  Brand  │   ┃
┃   └─────────┘   ┃
┃                 ┃
┣━━━━━━━━━━━━━━━━━┫
┃                 ┃
┃  📊 Dashboard   ┃  ← Nav Links
┃                 ┃  (Icon + Label)
┃  📈 Analytics   ┃
┃                 ┃
┃  📁 Projects    ┃
┃                 ┃
┃  👥 Team        ┃
┃                 ┃
┃  ⚙️  Settings   ┃
┃                 ┃
┃                 ┃
┃                 ┃  ← Spacer (flex-grow)
┃                 ┃
┣━━━━━━━━━━━━━━━━━┫
┃  ┌───┐          ┃  ← Bottom: User
┃  │ ● │ John Doe ┃  (Avatar + Name)
┃  └───┘          ┃
┃  🚪 Logout      ┃
┗━━━━━━━━━━━━━━━━━┛

  240px wide
  100vh height
```

## Collapsed State (Icon-Only)

```
┏━━━━━━┓
┃  🏠  ┃  ← Logo icon only
┣━━━━━━┫
┃  📊  ┃  ← Nav icons only
┃  📈  ┃  (Tooltip on hover)
┃  📁  ┃
┃  👥  ┃
┃  ⚙️  ┃
┃      ┃
┃      ┃
┃      ┃
┣━━━━━━┫
┃  ●   ┃  ← User avatar only
┃  🚪  ┃
┗━━━━━━┛

 64px wide
```

## Specifications

**Dimensions:**
- **Expanded**: `240px` wide × `100vh` high
- **Collapsed**: `64px` wide × `100vh` high
- Padding: `var(--k-space-4)` vertical, `var(--k-space-3)` horizontal

**Position:**
- `position: fixed`
- `left: 0` (or `right: 0` for right-aligned)
- `top: 0`
- `z-index: var(--k-z-sticky)`

**Layout Structure:**
- **Logo area**: Top, 80px height, centered
- **Nav links**: Stacked vertically, `gap: var(--k-space-2)`
- **Spacer**: `flex: 1` pushes bottom content down
- **User section**: Bottom, 100px height

**Visual Style:**
- Background: `var(--k-bg-elevated)` (dark theme) or `var(--k-bg-surface)` (light)
- Border right: `1px solid var(--k-border)`
- Box shadow: `var(--k-shadow-sm)`

**Nav Link Style:**
- Height: `44px`
- Padding: `var(--k-space-3)`
- Border radius: `var(--k-radius-md)`
- Icon: 20px, left-aligned
- Label: Truncate with ellipsis if too long
- Hover: `background: var(--k-accent-subtle)`
- Active: `background: var(--k-accent-subtle)`, left border `3px solid var(--k-accent)`

**Toggle Button:**
```
Position: Top-right corner inside sidebar
Icon: « (collapse) / » (expand)
Always visible
```

**Mobile Behavior (< 768px):**
```
Default: Hidden (off-screen)
Trigger: Hamburger button in app header
Opens: Overlay sidebar from left with backdrop
Closes: Click backdrop, swipe left, or tap close
```

## Use Cases
- Dashboards
- Admin panels
- Web applications
- CRM systems
- Project management tools

## Key Features
- Always visible (desktop)
- Doesn't consume top space
- Vertical navigation suits long lists
- Collapsible for more workspace
- Icon-only mode for power users

## Accessibility
- `<nav>` with `role="navigation"`
- `aria-label="Main sidebar navigation"`
- `aria-expanded` on toggle button
- Keyboard: Tab through links, Enter to activate
- Focus trap when open on mobile
- Escape closes on mobile

## Example HTML Structure
```html
<k-navbar-sidebar position="left" collapsible>
  <img slot="logo" src="icon.svg" alt="App Name">
  
  <a href="/dashboard" icon="dashboard">Dashboard</a>
  <a href="/analytics" icon="chart">Analytics</a>
  <a href="/projects" icon="folder">Projects</a>
  <a href="/team" icon="users">Team</a>
  <a href="/settings" icon="settings">Settings</a>
  
  <div slot="bottom">
    <k-avatar src="user.jpg" name="John Doe"></k-avatar>
    <span>John Doe</span>
    <a href="/logout" icon="logout">Logout</a>
  </div>
</k-navbar-sidebar>
```

## Animation
- Collapse/expand: `300ms ease width`
- Labels fade: `200ms opacity` (when collapsing)
- Mobile slide-in: `250ms ease transform`
