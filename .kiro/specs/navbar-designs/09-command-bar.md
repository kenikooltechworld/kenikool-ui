# Navbar Type 9: Command Bar

## Visual Design

```
┌────────────────────────────────────────────────────────────┐
│  [⌘K]  Search or jump to...                    [LOGO]     │
└────────────────────────────────────────────────────────────┘
         ↑
    Command palette trigger
```

## Open State (Modal Overlay)

```
                ┌────────────────────────────────────────┐
                │  ⌘  Search or jump to...            ×  │
                ├────────────────────────────────────────┤
                │  > dashbo                              │
                ├────────────────────────────────────────┤
                │  📊 Dashboard                          │
                │  📈 Analytics Dashboard                │
                │  ⚙️  Dashboard Settings                │
                ├────────────────────────────────────────┤
                │  Recent                                │
                │  • Settings                            │
                │  • User Profile                        │
                └────────────────────────────────────────┘
                          ↑
                Command palette modal
                  (600px wide, centered)
```

## Detailed Layout

```
Trigger Bar (Top):
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ┌──────────────────────────────────────┐                ┃
┃  │ ⌘K  Search or jump to...            │      [LOGO]    ┃
┃  └──────────────────────────────────────┘                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
     ↑ Click or press ⌘K/Ctrl+K to open

Command Palette Modal:
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⌘  ┌──────────────────────────────────────┐     ×   ┃
┃     │ > dashbo_                            │         ┃  ← Input
┃     └──────────────────────────────────────┘         ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                      ┃
┃  📊  Dashboard                            ⌘D        ┃  ← Results
┃  📈  Analytics Dashboard                  ⌘⇧A       ┃
┃  ⚙️   Dashboard Settings                            ┃
┃                                                      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  Recent                                              ┃  ← Categories
┃  • Settings                                          ┃
┃  • Profile                                           ┃
┃  • Billing                                           ┃
┃                                                      ┃
┃  Quick Actions                                       ┃
┃  ⚡ Create New Project                   ⌘N         ┃
┃  ⚡ Switch Theme                          ⌘T         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   600px wide, max-height: 500px, scrollable
```

## Specifications

**Trigger Bar:**
- Height: `48px`
- Position: `fixed top` or inline at top of page
- Background: `var(--k-bg-surface)`
- Border: `1px solid var(--k-border)`
- Border radius: `var(--k-radius-md)`
- Padding: `var(--k-space-3) var(--k-space-4)`

**Command Input (Trigger):**
- Width: `400px` (desktop), `100%` (mobile)
- Placeholder: "Search or jump to..." or "⌘K to search"
- Font: `var(--k-text-base)`
- Color: `var(--k-text-muted)`
- Icon: ⌘K or Ctrl+K badge on right

**Modal (Overlay):**
- Width: `600px` (desktop), `90vw` (mobile)
- Max-height: `500px`
- Position: `fixed`, centered (`top: 20%`, `left: 50%`, `transform: translateX(-50%)`)
- Z-index: `var(--k-z-modal)`
- Background: `var(--k-bg-surface)`
- Border: `1px solid var(--k-border)`
- Border radius: `var(--k-radius-xl)`
- Shadow: `var(--k-shadow-lg)`

**Search Input:**
- Height: `56px`
- Padding: `var(--k-space-4)`
- Font: `var(--k-text-lg)`
- Border: None
- Focus: No outline (modal itself is focused)

**Result Items:**
- Height: `48px`
- Padding: `var(--k-space-3) var(--k-space-4)`
- Hover: `background: var(--k-accent-subtle)`
- Selected: `background: var(--k-accent-subtle)` + left border `3px solid var(--k-accent)`
- Icon: 20px, left side
- Shortcut badge: Right side, `var(--k-text-xs)`, gray background

**Backdrop:**
- Background: `rgba(0, 0, 0, 0.5)`
- Click: Closes modal

## Use Cases
- Documentation sites (search docs)
- Dashboards (quick navigation)
- IDEs/code editors (command palette)
- Admin panels (power-user shortcuts)
- SaaS apps (feature discovery)

## Key Features
- Keyboard-first interaction
- Fast search + navigation
- No mouse required
- Discovers hidden features
- Fuzzy matching
- Recent items
- Quick actions

## Keyboard Shortcuts

```
⌘K or Ctrl+K    →  Open command palette
Escape          →  Close palette
↑ / ↓           →  Navigate results
Enter           →  Execute selected command
Tab             →  Cycle through sections
⌘1-9            →  Quick jump to result 1-9
```

## Search Categories

```
Navigation:
📊 Dashboard
📈 Analytics
⚙️  Settings
👤 Profile

Actions:
⚡ Create Project
⚡ Export Data
⚡ Switch Theme
⚡ Open Settings

Recent:
🕐 Dashboard (2 min ago)
🕐 Billing (1 hour ago)
🕐 Team Settings (Yesterday)

Tags/Filters:
#page    → Show only pages
#action  → Show only actions
#user    → Show only user-related
```

## Fuzzy Match Algorithm

```
User types: "dashbo"

Matches:
✓ Dashboard           (90% match)
✓ Analytics Dashboard (70% match)
✓ Dashboard Settings  (85% match)

Highlights matched characters:
Dashbo‾ard
```

## Result Item Structure

```
┌─────────────────────────────────────────────────────┐
│  [Icon]  Title                           [Shortcut] │
│          Subtitle/breadcrumb                        │
└─────────────────────────────────────────────────────┘

Example:
┌─────────────────────────────────────────────────────┐
│  📊  Dashboard                               ⌘D     │
│      Home > Dashboard                               │
└─────────────────────────────────────────────────────┘
```

## Empty State

```
No query:
┌─────────────────────────────────────────────┐
│  Type to search...                          │
│                                             │
│  Recent                                     │
│  • Dashboard                                │
│  • Settings                                 │
│                                             │
│  Quick Actions                              │
│  ⚡ Create New Project           ⌘N        │
└─────────────────────────────────────────────┘

No results:
┌─────────────────────────────────────────────┐
│  > xyz123                                   │
│                                             │
│  No results found                           │
│  Try different keywords                     │
└─────────────────────────────────────────────┘
```

## Mobile Behavior

```
Full-screen modal:
┌─────────────────────────────────┐
│  ←  Search                    × │
├─────────────────────────────────┤
│  dashbo_                        │
├─────────────────────────────────┤
│  📊 Dashboard                   │
│  📈 Analytics Dashboard         │
│  ⚙️  Dashboard Settings         │
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘

Full viewport height
No backdrop (covers all)
Slide up animation
```

## Accessibility
- `role="combobox"` on input
- `role="listbox"` on results
- `role="option"` on each result item
- `aria-expanded="true"` when open
- `aria-activedescendant` points to selected result
- Screen reader announces: "X results found"
- Keyboard-only navigation
- Focus trap within modal

## Example HTML Structure
```html
<k-navbar-command>
  <!-- Trigger bar -->
  <div slot="trigger">
    <img slot="logo" src="brand.svg" alt="Brand">
    <button class="command-trigger">
      ⌘K Search or jump to...
    </button>
  </div>
  
  <!-- Command data (JSON) -->
  <script type="application/json">
  {
    "items": [
      {
        "icon": "📊",
        "title": "Dashboard",
        "subtitle": "Home > Dashboard",
        "href": "/dashboard",
        "shortcut": "⌘D",
        "category": "navigation"
      },
      {
        "icon": "⚙️",
        "title": "Settings",
        "href": "/settings",
        "shortcut": "⌘,",
        "category": "navigation"
      },
      {
        "icon": "⚡",
        "title": "Create Project",
        "action": "createProject",
        "shortcut": "⌘N",
        "category": "action"
      }
    ]
  }
  </script>
</k-navbar-command>
```

## AI-Powered Search (2026 Feature)

```
User types: "show me revenue last month"

AI Result:
┌─────────────────────────────────────────────┐
│  🤖 AI Suggestion                           │
│     Analytics > Revenue > Last 30 Days      │
│     [View Report →]                         │
└─────────────────────────────────────────────┘

Natural language understanding
Semantic search
Action suggestions
```

## Animation
- Modal open: Scale from 0.95 to 1, fade in `200ms ease`
- Backdrop: Fade in `250ms ease`
- Results: Staggered fade-in, 50ms delay between items
- Keyboard navigation: Smooth scroll to selected item
