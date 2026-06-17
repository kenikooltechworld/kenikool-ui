# Navbar Type 18: Speed Dial FAB (Floating Action Button)

## Visual Design

```
Closed:                    Open:
                           [Sub 3]
                             ↑
                           [Sub 2]
                             ↑
                           [Sub 1]
                             ↑
   ┌──────┐               ┌──────┐
   │  ➕  │               │  ×   │
   └──────┘               └──────┘
     ↑                       ↑
  Main FAB              Main FAB (rotated)
  (Bottom-right)        Sub-actions expand upward
```

## Detailed Layout (Expanded)

```
                    ┌────────┐
                    │   📧   │  ← Sub-action 3 (Email)
                    └────────┘  "Send Email"
                        ↑
                    (16px gap)
                        ↑
                    ┌────────┐
                    │   📄   │  ← Sub-action 2 (Document)
                    └────────┘  "New Document"
                        ↑
                    (16px gap)
                        ↑
                    ┌────────┐
                    │   👤   │  ← Sub-action 1 (Contact)
                    └────────┘  "Add Contact"
                        ↑
                    (16px gap)
                        ↑
┌─────────────────────────────────────┐
│                                     │
│   Content Area                      │
│                              ┌──────┐ │
│                              │  ×   │ │ ← Main FAB
│                              └──────┘ │    (56×56px)
└─────────────────────────────────────┘
                                   ↑
                    Fixed: bottom-right
                    (16px from edges)
```

## Specifications

**Main FAB (Floating Action Button):**
- Size: `56×56px` (material design standard)
- Border radius: `50%` (perfect circle)
- Position: `fixed`, `bottom: 16px`, `right: 16px`
- Background: `var(--k-accent)`
- Shadow: `var(--k-shadow-lg)`
- Z-index: `var(--k-z-modal)`
- Icon: `➕` (closed), `×` (open)
- Transition: `transform 300ms ease`, `background 200ms ease`

**Sub-Action Buttons:**
- Size: `48×48px` (smaller than main)
- Border radius: `50%`
- Background: `var(--k-bg-surface)`
- Border: `1px solid var(--k-border)`
- Shadow: `var(--k-shadow-md)`
- Icon: 24px, centered
- Gap from main: `16px` vertical spacing

**Label (Tooltip):**
- Position: Left of button
- Padding: `var(--k-space-2) var(--k-space-3)`
- Background: `var(--k-bg-elevated)`
- Border radius: `var(--k-radius-md)`
- Font: `var(--k-text-sm)`, `var(--k-font-medium)`
- Shadow: `var(--k-shadow-sm)`
- Appears on hover (desktop) or always visible (mobile)

**Backdrop:**
- Background: `rgba(0, 0, 0, 0.3)`
- Covers full viewport
- Click: Closes speed dial
- Z-index: Below FAB, above content

## Use Cases
- Mobile apps (primary actions)
- Email clients (compose, reply, forward)
- Note-taking apps (new note, folder, tag)
- Social apps (post, photo, video)
- Productivity apps (create task, event, reminder)
- E-commerce (add to cart, wishlist, compare)

## Key Features
- One primary action + multiple secondary
- Space-efficient (hidden when closed)
- Thumb-zone friendly on mobile
- Clear hierarchy (main vs sub-actions)
- Expandable/collapsible
- Labels for clarity

## Animation Sequence

```
Opening (Staggered):

Frame 1 (0ms):
   ┌──────┐
   │  ➕  │ ← Main rotates 45deg, icon → ×
   └──────┘

Frame 2 (50ms):
   ┌────┐
   │ 👤 │ ← Sub 1 appears (scale 0→1, translate up)
   └────┘
   ┌──────┐
   │  ×   │
   └──────┘

Frame 3 (100ms):
   ┌────┐
   │ 📄 │ ← Sub 2 appears
   └────┘
   ┌────┐
   │ 👤 │
   └────┘
   ┌──────┐
   │  ×   │
   └──────┘

Frame 4 (150ms):
   ┌────┐
   │ 📧 │ ← Sub 3 appears
   └────┘
   ┌────┐
   │ 📄 │
   └────┘
   ┌────┐
   │ 👤 │
   └────┘
   ┌──────┐
   │  ×   │
   └──────┘

Closing:
All sub-actions scale down to 0 and slide toward main
Main icon rotates back, × → ➕
Total: 300ms
```

## Variants

**Variant 1: Vertical Expansion (Default)**
```
   [3]
    ↑
   [2]
    ↑
   [1]
    ↑
   [●]  ← Main FAB
```

**Variant 2: Horizontal Expansion**
```
[3] ← [2] ← [1] ← [●]
```

**Variant 3: Arc/Fan Pattern**
```
    [3]
  /
[2]
  \
    [1]
      \
       [●]

Buttons arranged in 90° arc
```

**Variant 4: Grid Pattern**
```
[4] [5]
[2] [3]
   [●] [1]

Buttons in 2×2 grid around main
```

## With Labels (Always Visible)

```
Send Email    ┌────────┐
              │   📧   │
              └────────┘
New Document  ┌────────┐
              │   📄   │
              └────────┘
Add Contact   ┌────────┐
              │   👤   │
              └────────┘
              ┌──────┐
              │  ×   │
              └──────┘

Labels always visible (mobile)
Or show on hover (desktop)
```

## Mobile Behavior

**Bottom-Right (Default):**
```
┌─────────────────────────────┐
│                             │
│   Content                   │
│                             │
│                             │
│                        [●]  │ ← 16px from edges
└─────────────────────────────┘
```

**Bottom-Center:**
```
┌─────────────────────────────┐
│                             │
│   Content                   │
│                             │
│                             │
│            [●]              │ ← Centered
└─────────────────────────────┘
```

**Side Positions:**
```
Top-right, bottom-left, top-left also supported
```

## States

**Idle (Closed):**
```
┌──────┐
│  ➕  │
└──────┘
```

**Hover (Pulse):**
```
┌──────┐
│  ➕  │ ← Slight scale up (1.05), shadow grows
└──────┘
```

**Active (Open):**
```
[3]
[2]
[1]
┌──────┐
│  ×   │ ← Icon rotated 45deg
└──────┘
```

**Disabled:**
```
┌──────┐
│  ➕  │ ← Opacity 0.5, cursor not-allowed
└──────┘
```

## Scroll Behavior

**Option 1: Always Visible**
```
FAB stays fixed regardless of scroll
```

**Option 2: Hide on Scroll Down, Show on Scroll Up**
```
Scroll down → FAB slides out (bottom)
Scroll up   → FAB slides in
```

**Option 3: Minimize on Scroll**
```
Scrolling → FAB shrinks to 40×40px (icon only)
Stop      → FAB returns to 56×56px
```

## Accessibility
- Main FAB: `<button aria-label="Actions" aria-expanded="false">`
- When open: `aria-expanded="true"`
- Each sub-action: `<button aria-label="[Action name]">`
- Backdrop: Receives focus trap when open
- Keyboard: Tab cycles through sub-actions, Enter activates, Escape closes
- Screen reader: Announces "Actions menu, 3 items"

## Example HTML Structure
```html
<k-speed-dial position="bottom-right">
  <!-- Main FAB -->
  <button slot="trigger" aria-label="Quick actions">
    ➕
  </button>
  
  <!-- Sub-actions -->
  <k-speed-dial-action icon="👤" label="Add Contact" onclick="addContact()">
  </k-speed-dial-action>
  
  <k-speed-dial-action icon="📄" label="New Document" onclick="newDoc()">
  </k-speed-dial-action>
  
  <k-speed-dial-action icon="📧" label="Send Email" onclick="sendEmail()">
  </k-speed-dial-action>
</k-speed-dial>
```

## JavaScript API

```javascript
const speedDial = document.querySelector('k-speed-dial');

// Open programmatically
speedDial.open();

// Close programmatically
speedDial.close();

// Toggle
speedDial.toggle();

// Listen for events
speedDial.addEventListener('k:open', () => {
  console.log('Speed dial opened');
});

speedDial.addEventListener('k:close', () => {
  console.log('Speed dial closed');
});

speedDial.addEventListener('k:action', (e) => {
  console.log('Action triggered:', e.detail.action);
});
```

## With Badge (Notification Count)

```
┌──────┐  ← [3] Badge shows unread count
│  ➕  │🔴
└──────┘

Badge position: top-right of FAB
Size: 20×20px
Background: var(--k-error)
Color: white
```

## Animation Specifications

```css
/* Main FAB rotate */
.fab.open {
  transform: rotate(45deg);
}

/* Sub-action appear (staggered) */
.sub-action {
  animation: fadeSlideUp 300ms ease forwards;
}

.sub-action:nth-child(1) { animation-delay: 0ms; }
.sub-action:nth-child(2) { animation-delay: 50ms; }
.sub-action:nth-child(3) { animation-delay: 100ms; }

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Hover pulse */
.fab:hover {
  transform: scale(1.05);
  box-shadow: var(--k-shadow-xl);
}
```

## Best Practices
- 3-6 sub-actions maximum
- Use for primary/frequent actions only
- Keep labels short (1-2 words)
- Use recognizable icons
- Provide visual feedback on tap
- Close on action selection
- Close on outside click
- Support keyboard navigation
- Consider one-handed use on mobile
