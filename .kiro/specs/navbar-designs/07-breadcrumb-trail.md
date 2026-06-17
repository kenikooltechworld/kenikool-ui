# Navbar Type 7: Breadcrumb Trail

## Visual Design

```
Home  >  Documentation  >  Components  >  Button
```

## Detailed Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  Home  ›  Docs  ›  Components  ›  Forms  ›  Input Field           │
└────────────────────────────────────────────────────────────────────┘
  ↑       ↑        ↑              ↑            ↑
Link    Link     Link          Link      Current (not linked)
```

## Full Context Display

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                  ┃
┃  🏠 Home  ›  📚 Docs  ›  🧩 Components  ›  📝 Button            ┃
┃                                                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
   ↑         ↑          ↑                 ↑
 Icon +    Icon +     Icon +           Current page
  Link      Link       Link          (bold, no link)
```

## Specifications

**Dimensions:**
- Height: `40px` (compact)
- Padding: `var(--k-space-3) var(--k-space-6)`
- Max-width: `100%` (inline with content)

**Position:**
- Display: `inline-flex`
- Align items: `center`
- Gap: `var(--k-space-2)` between items

**Visual Style:**
- Background: Transparent or `var(--k-bg-surface)`
- Border: None (or subtle bottom border)
- Font size: `var(--k-text-sm)`

**Breadcrumb Link Style:**
- Color: `var(--k-text-secondary)`
- Hover: `var(--k-text-primary)` + underline
- Active: Not applicable (links to ancestors)

**Current Page (Last Item):**
- Color: `var(--k-text-primary)`
- Font weight: `var(--k-font-semibold)`
- Not clickable (no `<a>` tag)

**Separator:**
- Character: `›` or `>` or `/`
- Color: `var(--k-text-muted)`
- Font size: Same as links
- Margin: `0 var(--k-space-2)`

## Separator Options

```
Option 1: Chevron (recommended)
Home › Docs › Components › Button

Option 2: Angle bracket
Home > Docs > Components > Button

Option 3: Slash
Home / Docs / Components / Button

Option 4: Pipe
Home | Docs | Components | Button

Option 5: Arrow
Home → Docs → Components → Button
```

## Truncation on Mobile

**Full breadcrumb (desktop):**
```
Home › Products › Electronics › Computers › Laptops › Gaming › Model X
```

**Auto-truncated (mobile < 768px):**
```
Option 1: Ellipsis middle
Home › … › Laptops › Gaming › Model X

Option 2: Show first and last
Home › … › Model X

Option 3: Dropdown for middle
Home › [+3 levels] › Model X
```

## Use Cases
- Documentation sites
- E-commerce product pages
- File management systems
- Multi-level content hierarchies
- Admin panels with deep navigation

## Key Features
- Shows current location in hierarchy
- Click any ancestor to navigate up
- Helps users understand site structure
- "You are here" indicator
- SEO benefit (structured data)

## Icon Variations

**No Icons (text only):**
```
Home › Documentation › API Reference › Authentication
```

**With Icons:**
```
🏠 Home › 📖 Docs › 🔐 Auth › API Keys
```

**Icon on Home only:**
```
🏠 › Documentation › API Reference › Authentication
```

## Structured Data (SEO)

```html
<nav aria-label="Breadcrumb">
  <ol itemscope itemtype="https://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/">
        <span itemprop="name">Home</span>
      </a>
      <meta itemprop="position" content="1" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/docs">
        <span itemprop="name">Documentation</span>
      </a>
      <meta itemprop="position" content="2" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <span itemprop="name">Button</span>
      <meta itemprop="position" content="3" />
    </li>
  </ol>
</nav>
```

## Accessibility
- `<nav aria-label="Breadcrumb">`
- Semantic `<ol>` ordered list
- Each item is `<li>`
- Current page: `aria-current="page"` on last item
- All links keyboard accessible
- Screen reader announces position (e.g., "3 of 5")

## Example HTML Structure
```html
<k-navbar-breadcrumb separator="›">
  <a href="/">Home</a>
  <a href="/docs">Documentation</a>
  <a href="/docs/components">Components</a>
  <a href="/docs/components/forms">Forms</a>
  <span current>Input Field</span>
</k-navbar-breadcrumb>
```

## Placement Options

**Option 1: Standalone (top of page)**
```
┌───────────────────────────────────────┐
│  Home › Docs › Button                 │  ← Breadcrumb
├───────────────────────────────────────┤
│                                       │
│  # Button Component                   │  ← Page content
│                                       │
```

**Option 2: Below main navbar**
```
┌───────────────────────────────────────┐
│  [LOGO]  Products  Docs  About        │  ← Main navbar
├───────────────────────────────────────┤
│  Home › Docs › Components › Button    │  ← Breadcrumb
├───────────────────────────────────────┤
│                                       │
│  Page content                         │
```

**Option 3: Inline with page title**
```
┌───────────────────────────────────────┐
│  Home › Docs › Button                 │  ← Breadcrumb
│                                       │
│  Button Component                     │  ← Title
│                                       │
```

## Auto-generation Logic

```javascript
// Example: Auto-generate from URL path
URL: /docs/components/forms/button
↓
Breadcrumb: Home › Docs › Components › Forms › Button

// Mapping:
{
  '/': 'Home',
  '/docs': 'Documentation',
  '/docs/components': 'Components',
  '/docs/components/forms': 'Forms',
  '/docs/components/forms/button': 'Button'
}
```

## Hover State

```
Before hover:
Home › Docs › Components › Button
     ─

On hover:
Home › Docs › Components › Button
     ───────
     Underline appears
```

## Animation
- Link hover underline: Slide in from left `200ms ease`
- Current page: Fade in bold `150ms ease`
- Mobile truncation: Fade ellipsis `300ms ease`
