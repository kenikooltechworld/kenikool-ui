# Navbar Type 17: Context Menu (Right-Click)

## Visual Design

```
Right-click on element:

┌─────────────────────┐
│  Cut          ⌘X    │
│  Copy         ⌘C    │
│  Paste        ⌘V    │
│  ───────────────    │ ← Divider
│  Delete       ⌫     │
│  Rename       ⌘R    │
│  ───────────────    │
│  Properties   ⌘I    │
└─────────────────────┘
       ↑
Appears at cursor position
```

## Detailed Layout

```
Trigger: Right-click or Long-press

┌────────────────────────────────────┐
│  [Element clicked]                 │ ← User right-clicks here
└────────────────────────────────────┘
                ↓
        Context menu appears:

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✂️  Cut                  Ctrl+X  ┃ ← Menu item with icon + shortcut
┃  📋 Copy                  Ctrl+C  ┃
┃  📄 Paste                 Ctrl+V  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫ ← Separator
┃  🗑️  Delete                  Del  ┃
┃  ✏️  Rename                  F2   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  ℹ️  Properties          Ctrl+I  ┃
┃  ▸  More Actions                 ┃ ← Submenu indicator
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   ↑         ↑                   ↑
 Icon     Label             Shortcut hint
```

## Specifications

**Menu Container:**
- Width: `220px` (min), auto-adjusts to content
- Max-height: `400px`, scrollable if overflow
- Position: `fixed` at cursor coordinates
- Background: `var(--k-bg-surface)`
- Border: `1px solid var(--k-border)`
- Border radius: `var(--k-radius-lg)`
- Shadow: `var(--k-shadow-lg)`
- Z-index: `var(--k-z-modal)`

**Menu Item:**
- Height: `36px`
- Padding: `var(--k-space-2) var(--k-space-4)`
- Display: `flex`, `justify-content: space-between`
- Font: `var(--k-text-sm)`, `var(--k-font-normal)`
- Color: `var(--k-text-primary)`
- Cursor: `pointer`

**Menu Item States:**
- **Hover**: `background: var(--k-accent-subtle)`, `color: var(--k-accent)`
- **Disabled**: `opacity: 0.5`, `cursor: not-allowed`
- **Danger**: `color: var(--k-error)` (for destructive actions like Delete)

**Icon:**
- Size: `16px`
- Position: Left, `margin-right: var(--k-space-3)`
- Color: Inherits from text

**Keyboard Shortcut:**
- Font: `var(--k-text-xs)`
- Color: `var(--k-text-muted)`
- Position: Right side
- Background: `var(--k-bg-elevated)` (optional pill)
- Padding: `2px 6px`
- Border radius: `var(--k-radius-sm)`

**Separator:**
- Height: `1px`
- Background: `var(--k-border)`
- Margin: `var(--k-space-2) 0`

**Submenu Indicator:**
- Icon: `▸` or `›`
- Position: Far right
- Color: `var(--k-text-muted)`

## Use Cases
- File managers (right-click files)
- Text editors (right-click selection)
- Canvas/drawing tools (right-click elements)
- Data grids (right-click rows)
- Card lists (right-click cards)
- Map interfaces (right-click markers)

## Key Features
- Context-aware (different menus for different elements)
- Appears at cursor position
- Hidden until needed
- Supports submenus
- Keyboard shortcuts displayed
- Click outside to close

## Trigger Methods

**Method 1: Right-Click (Desktop)**
```javascript
element.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  showContextMenu(e.clientX, e.clientY);
});
```

**Method 2: Long-Press (Mobile)**
```javascript
let pressTimer;
element.addEventListener('touchstart', (e) => {
  pressTimer = setTimeout(() => {
    const touch = e.touches[0];
    showContextMenu(touch.clientX, touch.clientY);
  }, 500); // 500ms long-press
});

element.addEventListener('touchend', () => {
  clearTimeout(pressTimer);
});
```

**Method 3: Button Trigger**
```html
<button aria-label="More actions" onclick="showContextMenu(event)">
  ⋮
</button>
```

## Viewport Edge Detection

```
If menu would overflow right edge:
┌────────────────────────┐
│   Element              │
│                   ┌────────────┐
│                   │ Menu       │ ← Opens to left instead
│                   │ • Action 1 │
│                   │ • Action 2 │
│                   └────────────┘
└────────────────────────┘

If menu would overflow bottom:
┌────────────────────────┐
│ ┌────────────┐         │
│ │ Menu       │         │ ← Opens upward
│ │ • Action 1 │         │
│ │ • Action 2 │         │
│ └────────────┘         │
│   Element              │
└────────────────────────┘
```

## Submenu Behavior

```
Hover on "More Actions":

Main Menu          Submenu appears to right:
┌──────────────┐   ┌──────────────┐
│ Cut          │   │              │
│ Copy         │   │              │
│ ──────────── │   │              │
│ ▸ More Actions ──→ Archive     │
│ Delete       │   │ Duplicate    │
│ Properties   │   │ Share        │
└──────────────┘   └──────────────┘

Arrow key navigation or hover
```

## Context-Aware Menus

```
Context 1: Text selected
┌──────────────────┐
│ Cut              │
│ Copy             │
│ Paste            │
│ ──────────────   │
│ Format           │
└──────────────────┘

Context 2: Image selected
┌──────────────────┐
│ Copy Image       │
│ Save Image       │
│ ──────────────   │
│ Rotate           │
│ Crop             │
└──────────────────┘

Context 3: Link clicked
┌──────────────────┐
│ Open Link        │
│ Copy Link        │
│ ──────────────   │
│ Open in New Tab  │
└──────────────────┘

Different menus based on what was clicked
```

## Icon Variations

**No Icons (Text Only):**
```
┌──────────────────┐
│ Cut          ⌘X  │
│ Copy         ⌘C  │
│ Paste        ⌘V  │
└──────────────────┘
```

**With Icons:**
```
┌──────────────────┐
│ ✂️  Cut      ⌘X  │
│ 📋 Copy      ⌘C  │
│ 📄 Paste     ⌘V  │
└──────────────────┘
```

**Emoji Icons:**
```
┌──────────────────┐
│ 👍 Like          │
│ 💬 Comment       │
│ 🔗 Share         │
└──────────────────┘
```

## Disabled Items

```
┌─────────────────────┐
│ Cut          ⌘X     │ ← Active
│ Copy         ⌘C     │ ← Active
│ Paste        ⌘V     │ ← Disabled (grayed out)
│ ─────────────────   │
│ Delete       ⌫      │ ← Active
└─────────────────────┘

Visual indication:
- Opacity: 0.5
- Cursor: not-allowed
- No hover effect
```

## Checkbox Items

```
┌─────────────────────┐
│ ✓ Show Grid         │ ← Checked
│ ✓ Snap to Grid      │ ← Checked
│ □ Show Rulers       │ ← Unchecked
│ ─────────────────   │
│ Edit Grid Settings  │
└─────────────────────┘
```

## Radio Items

```
┌─────────────────────┐
│ Sort by:            │
│ ◉ Name              │ ← Selected
│ ○ Date              │
│ ○ Size              │
│ ○ Type              │
└─────────────────────┘
```

## Mobile Behavior

**Bottom Sheet (Recommended):**
```
┌─────────────────────────────┐
│                             │
│   Content                   │
│                             │
├─────────────────────────────┤
│ Actions                     │ ← Slides up from bottom
│ • Cut                       │
│ • Copy                      │
│ • Paste                     │
│ • Delete                    │
│ [Cancel]                    │
└─────────────────────────────┘
```

**Modal Centered:**
```
┌─────────────────────────────┐
│                             │
│  ┌───────────────────────┐  │
│  │ Actions               │  │ ← Modal overlay
│  │ • Cut                 │  │
│  │ • Copy                │  │
│  │ • Paste               │  │
│  │ • Delete              │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

## Accessibility
- `role="menu"` on container
- Each item: `role="menuitem"`
- Submenus: `role="menu"`, `aria-label="Submenu"`
- Disabled items: `aria-disabled="true"`
- Keyboard: Arrow keys navigate, Enter activates, Escape closes
- Focus trap: Tab cycles within menu
- Screen reader: Announces menu item + shortcut

## Example HTML Structure
```html
<k-context-menu id="file-menu">
  <k-menu-item icon="✂️" shortcut="Ctrl+X" onclick="cut()">
    Cut
  </k-menu-item>
  <k-menu-item icon="📋" shortcut="Ctrl+C" onclick="copy()">
    Copy
  </k-menu-item>
  <k-menu-item icon="📄" shortcut="Ctrl+V" onclick="paste()" disabled>
    Paste
  </k-menu-item>
  
  <k-menu-separator></k-menu-separator>
  
  <k-menu-item icon="🗑️" shortcut="Del" onclick="delete()" danger>
    Delete
  </k-menu-item>
  <k-menu-item icon="✏️" shortcut="F2" onclick="rename()">
    Rename
  </k-menu-item>
  
  <k-menu-separator></k-menu-separator>
  
  <k-menu-item icon="ℹ️" shortcut="Ctrl+I" onclick="properties()">
    Properties
  </k-menu-item>
  
  <k-menu-submenu label="More Actions">
    <k-menu-item onclick="archive()">Archive</k-menu-item>
    <k-menu-item onclick="duplicate()">Duplicate</k-menu-item>
    <k-menu-item onclick="share()">Share</k-menu-item>
  </k-menu-submenu>
</k-context-menu>
```

## JavaScript API

```javascript
// Show menu at coordinates
contextMenu.show(x, y);

// Show menu at element
contextMenu.showAt(element);

// Close menu
contextMenu.close();

// Update menu items dynamically
contextMenu.setItems([
  { label: 'Cut', icon: '✂️', action: cut },
  { label: 'Copy', icon: '📋', action: copy },
  { type: 'separator' },
  { label: 'Delete', icon: '🗑️', action: del, danger: true }
]);
```

## Animation
- Menu appear: Fade + scale from 0.95 to 1, `150ms ease`
- Menu disappear: Fade + scale to 0.95, `100ms ease`
- Item hover: Background fade in, `100ms ease`
- Submenu slide: Slide from left, `200ms ease`

## Best Practices
- Keep menu items concise (1-2 words)
- Group related actions
- Show keyboard shortcuts
- Disable unavailable actions (don't hide)
- Use icons for faster recognition
- Limit to 10-12 items per menu
- Use submenus for additional options
- Close on outside click
- Close on Escape key
- Support keyboard navigation
