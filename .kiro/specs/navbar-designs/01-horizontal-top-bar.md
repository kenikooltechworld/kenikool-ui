# Navbar Type 1: Horizontal Top Bar

## Visual Design

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [LOGO]     Home    About    Products    Pricing    Contact    [Login] [Sign Up]  │
└────────────────────────────────────────────────────────────────────────────┘
```

## Detailed Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                            ┃
┃  ┌────────┐                                              ┌────────┐       ┃
┃  │  LOGO  │   Home   About   Products   Pricing   Docs  │ Login  │ [CTA] ┃
┃  │  Image │                                              └────────┘       ┃
┃  └────────┘                                                               ┃
┃                                                                            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
     ↑           ↑                                              ↑         ↑
   Logo      Nav Links                                      Actions    CTA
  (Left)    (Center/Left)                                    (Right)  (Right)
```

## Specifications

**Dimensions:**
- Height: `64px`
- Max-width: `1200px` (centered container)
- Padding: `0 var(--k-space-6)`

**Layout Structure:**
- **Logo**: Left side, 40px height, auto width
- **Nav Links**: Left-aligned after logo, `gap: var(--k-space-6)`
- **Actions**: Right side, flex gap `var(--k-space-3)`

**Visual Style:**
- Background: `var(--k-bg-surface)`
- Border bottom: `1px solid var(--k-border)`
- Position: `sticky` (optional), `top: 0`
- Z-index: `var(--k-z-sticky)`

**Typography:**
- Nav links: `font-size: var(--k-text-base)`, `font-weight: var(--k-font-medium)`
- Link color: `var(--k-text-secondary)`
- Link hover: `var(--k-text-primary)`
- Active link: `var(--k-text-primary)` + underline

**Mobile Behavior (< 768px):**
```
┌─────────────────────────────────────┐
│  [LOGO]                    [☰]      │
└─────────────────────────────────────┘

When hamburger clicked:
┌─────────────────────────────────────┐
│  [LOGO]                    [×]      │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│                                     │
│  Home                               │
│  About                              │
│  Products                           │
│  Pricing                            │
│  Contact                            │
│  ─────────────                      │
│  [Login]                            │
│  [Sign Up]                          │
│                                     │
└─────────────────────────────────────┘
```

## Use Cases
- Corporate websites
- Marketing sites
- Blogs
- Documentation sites
- SaaS landing pages

## Key Features
- Most familiar navigation pattern
- Horizontal reading flow
- Clear visual hierarchy
- Easy to scan
- Works well with sticky behavior

## Accessibility
- `<nav>` semantic element
- `role="navigation"`
- `aria-label="Main navigation"`
- Skip link: "Skip to main content"
- Focus visible on all links
- Keyboard navigable (Tab, Enter)

## Example HTML Structure
```html
<k-navbar-horizontal>
  <img slot="logo" src="brand-logo.svg" alt="Brand Name">
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/products">Products</a>
  <a href="/pricing">Pricing</a>
  <a href="/contact">Contact</a>
  <div slot="actions">
    <k-button v="ghost sm">Login</k-button>
    <k-button v="filled sm primary">Sign Up</k-button>
  </div>
</k-navbar-horizontal>
```
