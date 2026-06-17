# Navbar Type 3: Floating Centered

## Visual Design

```
        ┌──────────────────────────────────────┐
        │  Home   Work   About   Contact   •••  │
        └──────────────────────────────────────┘
                    ↑
              Floats above content
              Centered horizontally
              Rounded pill shape
```

## Detailed Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         HERO CONTENT                            │
│                                                                 │
│            ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓               │
│            ┃  Home  Work  About  Contact  ⋯  ┃               │
│            ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛               │
│                      ↑                                          │
│              Floating navbar pill                               │
│              margin-top: 20px                                   │
│              Auto-width based on content                        │
│                                                                 │
│                                                                 │
│                    Page content below                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Specifications

**Dimensions:**
- Height: `48px`
- Width: `auto` (fits content, max `600px`)
- Padding: `var(--k-space-2) var(--k-space-6)`
- Border radius: `var(--k-radius-full)` (pill shape)

**Position:**
- `position: fixed` or `absolute`
- `top: var(--k-space-4)` (20px from top)
- `left: 50%`, `transform: translateX(-50%)` (centered)
- `z-index: var(--k-z-dropdown)`

**Visual Style:**
- Background: `var(--k-bg-surface)`
- Backdrop: `backdrop-filter: blur(8px)` (optional glassmorphism)
- Border: `1px solid var(--k-border)`
- Shadow: `var(--k-shadow-lg)`
- Effect: Subtle hover lift

**Nav Link Style:**
- Display: `inline-flex`
- Padding: `var(--k-space-2) var(--k-space-4)`
- Border radius: `var(--k-radius-full)`
- Gap: `var(--k-space-2)` between links
- Font: `var(--k-text-sm)`, `var(--k-font-medium)`
- Color: `var(--k-text-secondary)`
- Hover: `background: var(--k-accent-subtle)`, `color: var(--k-accent)`
- Active: `background: var(--k-accent)`, `color: var(--k-text-inverse)`

**Menu Toggle (More Actions):**
```
[•••] or [···]
Opens dropdown below navbar
Shows additional links
```

## Hover State

```
Before hover:
┌──────────────────────────────────────┐
│  Home   Work   About   Contact   ⋯   │
└──────────────────────────────────────┘

On hover (slight lift):
    ┌──────────────────────────────────────┐
    │  Home   Work   About   Contact   ⋯   │  ← Lifted 2px
    └──────────────────────────────────────┘
       Shadow increases
```

## Mobile Behavior (< 768px)

```
Compact version:
┌─────────────────────┐
│  [☰]  Brand  [···]  │
└─────────────────────┘

Expands to:
┌───────────────────────────────┐
│         Navigation            │
├───────────────────────────────┤
│  Home                         │
│  Work                         │
│  About                        │
│  Contact                      │
└───────────────────────────────┘
```

## Glassmorphism Variant

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                  ┃  ← Semi-transparent
┃  Home  Work  About  Contact  ⋯  ┃  ← Blurred background shows through
┃                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

CSS: backdrop-filter: blur(12px);
     background: rgba(255,255,255,0.7);
```

## Use Cases
- Portfolios
- Creative agencies
- Minimal design sites
- Photography sites
- Single-page landing pages

## Key Features
- Minimal, unobtrusive
- Floats above content like a badge
- Modern, premium aesthetic
- Doesn't span full width
- Works great over hero images

## Accessibility
- `<nav role="navigation">`
- `aria-label="Floating navigation"`
- All links keyboard accessible
- Focus ring visible
- High contrast maintained

## Scroll Behavior Options

**Option 1: Always visible (sticky)**
```
Stays at top as user scrolls
```

**Option 2: Fade on scroll**
```
Visible at top
Fades to 50% opacity when scrolling
Returns to 100% when scroll stops
```

**Option 3: Hide on scroll**
```
Disappears completely when scrolling down
Slides back in when scrolling up
```

## Example HTML Structure
```html
<k-navbar-floating glass>
  <a href="/">Home</a>
  <a href="/work">Work</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
  <button slot="more" aria-label="More options">⋯</button>
</k-navbar-floating>
```

## Animation
- Initial load: Slide down from top with fade-in (`300ms ease`)
- Hover lift: `transform: translateY(-2px)` (`150ms ease`)
- Shadow grow: `box-shadow` transition (`150ms ease`)
- Active link: Background color fade (`200ms ease`)
