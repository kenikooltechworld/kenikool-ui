# Navbar Type 12: Accordion Tree

## Visual Design

```
┌─────────────────────┐
│ ▾ Dashboard         │
│   • Overview        │
│   • Analytics       │
│ ▸ Projects          │  ← Collapsed
│ ▾ Settings          │
│   • Account         │
│   • Privacy         │
│   ▾ Advanced        │  ← Nested level
│     • API Keys      │
│     • Webhooks      │
└─────────────────────┘
```

## Detailed Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                         ┃
┃ ▾ Dashboard             ┃  ← Expanded section
┃   • Overview            ┃  ← Child link (indent)
┃   • Analytics           ┃
┃   • Reports             ┃
┃                         ┃
┃ ▸ Projects              ┃  ← Collapsed section
┃                         ┃  (children hidden)
┃ ▾ Settings              ┃  ← Expanded section
┃   • Account             ┃
┃   • Privacy             ┃
┃   ▾ Advanced            ┃  ← Nested (2nd level)
┃     • API Keys          ┃  ← Double indent
┃     • Webhooks          ┃
┃     • Integrations      ┃
┃                         ┃
┃ ▸ Help & Support        ┃  ← Collapsed
┃                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## Specifications

**Container:**
- Width: `240px` (sidebar) or `100%` (inline)
- Background: `var(--k-bg-surface)`
- Border: `1px solid var(--k-border)` (optional)
- Padding: `var(--k-space-2)`

**Section Header (Parent):**
- Height: `44px`
- Padding: `var(--k-space-3) var(--k-space-4)`
- Font: `var(--k-text-base)`, `var(--k-font-semibold)`
- Color: `var(--k-text-primary)`
- Cursor: `pointer`
- Icon: Chevron `▸` (collapsed) or `▾` (expanded)

**Child Link:**
- Height: `40px`
- Padding-left: `var(--k-space-8)` (indent 1 level)
- Font: `var(--k-text-sm)`, `var(--k-font-normal)`
- Color: `var(--k-text-secondary)`
- Bullet: `•` or `─`
- Hover: `background: var(--k-accent-subtle)`, `color: var(--k-accent)`
- Active: `background: var(--k-accent-subtle)`, left border `3px solid var(--k-accent)`

**Nested Level (Grandchild):**
- Padding-left: `var(--k-space-12)` (indent 2 levels)
- Each level adds `var(--k-space-4)` indent

**Chevron Icon:**
- Size: `16px`
- Position: Left of section label
- Rotation: `0deg` (collapsed `▸`), `90deg` (expanded `▾`)
- Transition: `transform 200ms ease`

## Use Cases
- File explorers
- Documentation sites (nested topics)
- Admin panels (complex settings)
- Site maps
- Multi-level content hierarchies

## Key Features
- Collapsible sections save space
- Shows hierarchical structure
- Click header to expand/collapse
- Supports infinite nesting levels
- Progressive disclosure

## Expand/Collapse Animation

```
Collapsed:
┌───────────────┐
│ ▸ Projects    │
└───────────────┘

Expanding:
┌───────────────┐
│ ▾ Projects    │  ← Chevron rotates
│   • Project A │  ← Children slide down
│   • Project B │
│   • Project C │
└───────────────┘

CSS:
max-height: 0 → max-height: 1000px
opacity: 0 → opacity: 1
Transition: 300ms ease
```

## Icon Variations

**Chevron (default):**
```
▸ Collapsed
▾ Expanded
```

**Plus/Minus:**
```
[+] Collapsed
[−] Expanded
```

**Arrow:**
```
→ Collapsed
↓ Expanded
```

**Caret:**
```
› Collapsed
∨ Expanded
```

## Indentation Visual

```
Level 0: No indent
┌─────────────────┐
│ ▾ Section       │
└─────────────────┘

Level 1: 24px indent
┌─────────────────┐
│ ▾ Section       │
│   • Child       │
└─────────────────┘

Level 2: 48px indent
┌─────────────────┐
│ ▾ Section       │
│   ▾ Child       │
│     • Grandchild│
└─────────────────┘

Level 3: 72px indent
┌─────────────────┐
│ ▾ Section       │
│   ▾ Child       │
│     ▾ Grandchild│
│       • Item    │
└─────────────────┘
```

## Mobile Behavior (< 768px)

**Option 1: Full-width Accordion**
```
┌───────────────────────────┐
│ ▾ Dashboard               │
│   • Overview              │
│   • Analytics             │
│ ▸ Projects                │
│ ▾ Settings                │
│   • Account               │
└───────────────────────────┘

Stacks vertically
Touch-optimized (larger hit areas)
```

**Option 2: Drawer Accordion**
```
[☰] Opens drawer with accordion inside
Full-screen overlay
Scrollable if content overflows
```

## Accessibility
- `<nav>` with `role="navigation"`
- Section headers: `<button aria-expanded="true/false">`
- Child links: `<a>` with proper hierarchy
- Keyboard: Arrow keys expand/collapse
- Screen reader: Announces "Expanded" or "Collapsed"
- Focus visible on all interactive elements

## Example HTML Structure
```html
<k-navbar-accordion>
  <section>
    <button aria-expanded="true">Dashboard</button>
    <ul>
      <li><a href="/overview">Overview</a></li>
      <li><a href="/analytics">Analytics</a></li>
      <li><a href="/reports">Reports</a></li>
    </ul>
  </section>
  
  <section>
    <button aria-expanded="false">Projects</button>
    <ul>
      <li><a href="/projects/all">All Projects</a></li>
      <li><a href="/projects/active">Active</a></li>
    </ul>
  </section>
  
  <section>
    <button aria-expanded="true">Settings</button>
    <ul>
      <li><a href="/settings/account">Account</a></li>
      <li><a href="/settings/privacy">Privacy</a></li>
      <li>
        <section>
          <button aria-expanded="true">Advanced</button>
          <ul>
            <li><a href="/settings/api">API Keys</a></li>
            <li><a href="/settings/webhooks">Webhooks</a></li>
          </ul>
        </section>
      </li>
    </ul>
  </section>
</k-navbar-accordion>
```

## State Management Options

**Option 1: Only One Open (Accordion Behavior)**
```
Opening "Projects" auto-closes "Dashboard"
┌──────────────┐      ┌──────────────┐
│ ▾ Dashboard  │  →   │ ▸ Dashboard  │
│   • Overview │      │ ▾ Projects   │
│ ▸ Projects   │      │   • All      │
└──────────────┘      └──────────────┘
```

**Option 2: Multiple Open (Independent)**
```
All sections can be open simultaneously
┌──────────────┐
│ ▾ Dashboard  │
│   • Overview │
│ ▾ Projects   │  ← Both open
│   • All      │
│ ▾ Settings   │
│   • Account  │
└──────────────┘
```

## Search/Filter Support

```
With search bar:
┌─────────────────────┐
│ [🔍 Search...]      │
├─────────────────────┤
│ ▾ Dashboard         │
│   • Overview        │
│   • Analytics       │
└─────────────────────┘

User types "API":
┌─────────────────────┐
│ [🔍 API]            │
├─────────────────────┤
│ ▾ Settings          │  ← Auto-expands
│   ▾ Advanced        │     matching sections
│     • API Keys      │  ← Highlighted
│     • Webhooks      │
└─────────────────────┘
```

## Animation
- Chevron rotation: `200ms ease`
- Section expand: `max-height 300ms ease`, `opacity 200ms ease`
- Section collapse: `max-height 250ms ease`, `opacity 150ms ease`
- Link hover background: `150ms ease`

## Best Practices
- Start with top-level sections collapsed
- Expand active section by default
- Limit nesting to 3 levels max
- Use clear, concise section labels
- Provide visual feedback on expand/collapse
- Support keyboard navigation
