# Navbar Type 10: Dot Navigation

## Visual Design

```
                                ●  ← Active section
                                ○
                                ○
                                ○
                                ○
                          
  Vertical dots on side edge
  Auto-highlights on scroll
```

## Detailed Layout

```
┌─────────────────────────────────────────────────┐  ●  Hero
│                                                 │  ○  Features
│  HERO SECTION                                   │  ○  Pricing
│  (Full viewport)                                │  ○  Testimonials
│                                                 │  ○  Contact
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐  ○
│                                                 │  ●  ← Auto-highlights
│  FEATURES SECTION                               │  ○     as you scroll
│  (Full viewport)                                │  ○
│                                                 │  ○
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐  ○
│                                                 │  ○
│  PRICING SECTION                                │  ●
│  (Full viewport)                                │  ○
│                                                 │  ○
└─────────────────────────────────────────────────┘

     ↑                                             ↑
   Page sections                          Dot navigation
                                       (Fixed position right)
```

## Specifications

**Dot Container:**
- Position: `fixed`
- Right: `var(--k-space-6)` (default right side)
- Top: `50%`, `transform: translateY(-50%)` (vertically centered)
- Z-index: `var(--k-z-sticky)`

**Individual Dot:**
- Size: `10px` diameter (inactive), `14px` (active)
- Border radius: `50%` (perfect circle)
- Background: `var(--k-border)` (inactive), `var(--k-accent)` (active)
- Gap: `var(--k-space-4)` between dots
- Transition: `all 300ms ease`

**Dot with Labels (Hover):**
```
Before hover:
    ○

On hover:
    Hero ●  ← Label appears on left
         
CSS: Tooltip on left side
```

**Touch Target:**
- Click area: `32×32px` (larger than visual dot)
- Padding: `11px` around dot (increases touch zone)

## Use Cases
- Single-page landing pages
- Portfolios (scroll-based sections)
- Storytelling sites
- Product showcases
- Full-height section sites

## Key Features
- Minimal, unobtrusive
- Shows position in page
- One-click section jump
- Smooth scroll to section
- Auto-highlights based on scroll position

## Dot States

```
Inactive:
   ○  8px, var(--k-border)

Active:
   ●  12px, var(--k-accent)

Hover:
   ⦿  10px, var(--k-accent-subtle)

Visited/Completed:
   ◉  8px, var(--k-success-subtle)
```

## Label Variants

**Option 1: No Labels (minimal)**
```
   ○
   ●  ← Active only
   ○
   ○
```

**Option 2: Tooltip on Hover**
```
      Hero ○  ← Appears on hover
   Features ●
            ○
            ○
```

**Option 3: Always Visible**
```
   Hero      ○
   Features  ●
   Pricing   ○
   Contact   ○
```

**Option 4: Icons Instead of Dots**
```
   🏠  Home
   ⚡  Features
   💵  Pricing
   ✉️  Contact
```

## Position Variations

**Right Side (default):**
```
┌─────────────┐  ●
│   Content   │  ○
│             │  ○
└─────────────┘  ○
```

**Left Side:**
```
●  ┌─────────────┐
○  │   Content   │
○  │             │
○  └─────────────┘
```

**Center Bottom:**
```
┌──────────────────┐
│                  │
│    Content       │
│                  │
└──────────────────┘
    ○ ● ○ ○ ○
```

## Scroll Detection Logic

```javascript
// Detect which section is in viewport
const sections = document.querySelectorAll('section');
const dots = document.querySelectorAll('.dot');

function updateActiveDot() {
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top <= window.innerHeight / 2 
                   && rect.bottom >= window.innerHeight / 2;
    
    if (isVisible) {
      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveDot);
```

## Smooth Scroll Behavior

```javascript
// Click dot → Smooth scroll to section
dot.addEventListener('click', (e) => {
  e.preventDefault();
  const targetSection = document.querySelector(dot.getAttribute('href'));
  targetSection.scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
});
```

## Mobile Behavior (< 768px)

**Option 1: Bottom Horizontal**
```
┌─────────────────────────┐
│      Content            │
└─────────────────────────┘
     ○  ●  ○  ○  ○
```

**Option 2: Hidden, Replaced by Hamburger**
```
Dots hidden on mobile
Show traditional hamburger menu instead
```

**Option 3: Smaller, Still Vertical**
```
┌──────────────┐  ○
│   Content    │  ●  ← Smaller dots (6px)
│              │  ○
└──────────────┘  ○
```

## Accessibility
- `<nav aria-label="Page sections">`
- Each dot: `<a href="#section" aria-label="Go to Hero section">`
- Active dot: `aria-current="true"`
- Keyboard: Tab through dots, Enter to activate
- Focus visible: Ring around dot
- Screen reader: Announces "Section 2 of 5: Features"

## Example HTML Structure
```html
<k-navbar-dots position="right">
  <a href="#hero" label="Hero" active>Hero</a>
  <a href="#features" label="Features">Features</a>
  <a href="#pricing" label="Pricing">Pricing</a>
  <a href="#testimonials" label="Testimonials">Testimonials</a>
  <a href="#contact" label="Contact">Contact</a>
</k-navbar-dots>

<!-- Sections -->
<section id="hero">Hero Content</section>
<section id="features">Features Content</section>
<section id="pricing">Pricing Content</section>
<section id="testimonials">Testimonials Content</section>
<section id="contact">Contact Content</section>
```

## Progress Bar Variant

```
Instead of discrete dots, show continuous bar:

   ┃  ← Scrolled portion (accent color)
   ┃
   ┃
   ┋  ← Remaining (gray)
   ┋

Height represents scroll progress (0-100%)
```

## Animation
- Active dot scale: `transform: scale(1.2)`, `300ms ease`
- Inactive → Active: Color fade `200ms ease`
- Label appear: Slide from right `200ms ease`, fade in
- Smooth scroll: `800ms ease-in-out`
- Hover scale: `transform: scale(1.1)`, `150ms ease`

## Best Practices
- 5-7 sections maximum (more gets cluttered)
- Equal-height sections work best
- Clear visual separation between sections
- Labels on hover for clarity
- Don't use on scrollable long-form content (blogs, docs)
