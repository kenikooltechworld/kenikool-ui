# Navbar Type 15: Sticky Section Headers

## Visual Design

```
┌────────────────────────────────────────────────────────┐
│ Chapter 1: Introduction                                │ ← Sticky header 1
├────────────────────────────────────────────────────────┤
│                                                        │
│  Content for Chapter 1...                             │
│                                                        │
│                                                        │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│ Chapter 2: Getting Started                             │ ← Sticky header 2 (pushes 1 out)
├────────────────────────────────────────────────────────┤
│                                                        │
│  Content for Chapter 2...                             │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Stacking Behavior (Scroll Effect)

```
Initial State (Top of page):
┌────────────────────────────────────────┐
│ Chapter 1: Introduction                │ ← Sticky at top
├────────────────────────────────────────┤
│  Content...                            │
│                                        │
│                                        │
│                                        │

Scrolled to Chapter 2:
┌────────────────────────────────────────┐
│ Chapter 2: Getting Started             │ ← New header pushes old one out
├────────────────────────────────────────┤
│  Content...                            │
│                                        │

Scrolled to Chapter 3:
┌────────────────────────────────────────┐
│ Chapter 3: Advanced Topics             │ ← Latest header visible
├────────────────────────────────────────┤
│  Content...                            │
│                                        │
```

## Detailed Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ▸ CHAPTER 1: INTRODUCTION                           ┃ ← Section 1 header
┃                                                     ┃    (sticky, top: 0)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Lorem ipsum dolor sit amet, consectetur            │
│  adipiscing elit. Sed do eiusmod tempor            │
│  incididunt ut labore et dolore magna aliqua.      │
│                                                     │
│  [Content continues...]                            │
│                                                     │
│  [More content...]                                 │
│                                                     │
└─────────────────────────────────────────────────────┘
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ▸ CHAPTER 2: GETTING STARTED                        ┃ ← Section 2 header
┃                                                     ┃    (sticky, top: 0)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Installation instructions...                       │
│                                                     │
│  1. Install dependencies                           │
│  2. Configure settings                             │
│  3. Run the application                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Specifications

**Section Header:**
- Height: `56px`
- Position: `sticky`, `top: 0`
- Z-index: Incremental (Section 1: `100`, Section 2: `101`, Section 3: `102`, etc.)
- Background: `var(--k-bg-surface)`
- Border bottom: `2px solid var(--k-border)`
- Font: `var(--k-text-lg)`, `var(--k-font-bold)`
- Padding: `var(--k-space-4) var(--k-space-6)`
- Backdrop filter: `blur(8px)` (optional glassmorphism)

**Z-Index Strategy:**
```css
/* Each header has incrementing z-index */
section:nth-child(1) .header { z-index: 100; }
section:nth-child(2) .header { z-index: 101; }
section:nth-child(3) .header { z-index: 102; }
/* ... and so on */

/* This makes newer headers push out older ones */
```

**Content Area:**
- Min-height: `400px` (ensures enough scroll space)
- Padding: `var(--k-space-8)`
- Background: `var(--k-bg-base)`

**Collapse/Expand Icon:**
- Size: `20px`
- Position: Left of header text
- Icon: `▸` (collapsed) or `▾` (expanded)
- Optional: Click to collapse section content

## Use Cases
- Long-form documentation
- Reports with multiple chapters
- Legal documents
- Research papers
- Multi-section articles
- Academic content

## Key Features
- Multiple sticky headers stack
- Each section has its own header
- Newer headers push older ones out
- Shows current section context
- Helps with long-content navigation
- Preserves section identity while scrolling

## Stacking Visualization (Side View)

```
Scroll Position: Middle of page

        ┌─ Top of viewport
        │
        ├─────────────────────────────┐
        │ Chapter 3: Advanced         │ ← Visible (z-index: 102)
        ├═════════════════════════════┤
        │ Content for Chapter 3...    │
        │                             │
        │                             │
        └─────────────────────────────┘
                                    ↑
        Chapter 2 header pushed up (hidden above viewport)
        Chapter 1 header pushed up (hidden above viewport)
```

## Collapse Functionality (Optional)

```
Expanded Section:
┌─────────────────────────────────┐
│ ▾ Chapter 1: Introduction       │ ← Expanded (▾)
├─────────────────────────────────┤
│ Content visible...              │
│                                 │
│                                 │
└─────────────────────────────────┘

Collapsed Section:
┌─────────────────────────────────┐
│ ▸ Chapter 1: Introduction       │ ← Collapsed (▸)
└─────────────────────────────────┘
(Content hidden via max-height: 0)
```

## Mobile Behavior (< 768px)

```
┌──────────────────────────────┐
│ Chapter 1: Introduction   [≡]│ ← Header with menu icon
├──────────────────────────────┤
│                              │
│  Content...                  │
│                              │
└──────────────────────────────┘

Click [≡] opens jump menu:
┌──────────────────────────────┐
│ Jump to Section:             │
│  • Chapter 1 (current)       │
│  • Chapter 2                 │
│  • Chapter 3                 │
│  • Chapter 4                 │
└──────────────────────────────┘
```

## Progress Indicator Integration

```
┌──────────────────────────────────────────────┐
│ Chapter 2: Getting Started    [■■■□□□□] 43% │
├──────────────────────────────────────────────┤
│                                              │
│  Content...                                  │
       ↑                             ↑
   Section title              Progress through document
```

## Breadcrumb Integration

```
┌─────────────────────────────────────────────────┐
│ Docs › Guide › Chapter 2: Getting Started       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Content...                                     │
     ↑
 Breadcrumb shows hierarchy + current section
```

## Accessibility
- Each section: `<section>` with `<h2>` or `<h3>` header
- Headers use proper heading hierarchy
- `aria-label` on sections for screen reader context
- Skip link: "Skip to next section"
- Keyboard: Tab navigates through sections
- Focus visible when header is reached

## Example HTML Structure
```html
<k-navbar-sticky-sections>
  <section id="chapter-1">
    <header sticky>
      <button aria-expanded="true">▾</button>
      <h2>Chapter 1: Introduction</h2>
    </header>
    <div class="content">
      <p>Introduction content...</p>
      <p>More content...</p>
    </div>
  </section>
  
  <section id="chapter-2">
    <header sticky>
      <button aria-expanded="true">▾</button>
      <h2>Chapter 2: Getting Started</h2>
    </header>
    <div class="content">
      <p>Getting started content...</p>
      <p>More content...</p>
    </div>
  </section>
  
  <section id="chapter-3">
    <header sticky>
      <button aria-expanded="true">▾</button>
      <h2>Chapter 3: Advanced Topics</h2>
    </header>
    <div class="content">
      <p>Advanced content...</p>
      <p>More content...</p>
    </div>
  </section>
</k-navbar-sticky-sections>
```

## CSS Implementation

```css
section {
  position: relative;
}

section header {
  position: sticky;
  top: 0;
  z-index: var(--section-index); /* Incremental per section */
  background: var(--k-bg-surface);
  border-bottom: 2px solid var(--k-border);
  backdrop-filter: blur(8px);
}

/* Increment z-index for each section */
section:nth-child(1) header { --section-index: 100; }
section:nth-child(2) header { --section-index: 101; }
section:nth-child(3) header { --section-index: 102; }
section:nth-child(4) header { --section-index: 103; }
/* ... continue for all sections */
```

## JavaScript Scroll Detection

```javascript
// Detect which section is currently at top
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Update active section indicator
      entry.target.querySelector('header').classList.add('active');
    } else {
      entry.target.querySelector('header').classList.remove('active');
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));
```

## Visual Depth Effect

```
Add shadow to create depth:

┌─────────────────────────────────┐
│ Chapter 2: Getting Started      │ ← box-shadow: 0 2px 4px rgba(0,0,0,0.1)
├═════════════════════════════════┤
│ Content below has subtle shadow │
└─────────────────────────────────┘
```

## Animation
- Header reveal: None (instant stick)
- Push-out effect: Natural CSS stacking (no animation needed)
- Collapse toggle: `max-height 300ms ease`, `opacity 200ms ease`
- Active state highlight: `background-color 200ms ease`

## Best Practices
- Use semantic heading hierarchy (h1 → h2 → h3)
- Limit to 3-4 levels of nesting
- Ensure sufficient content per section (min 400px height)
- Provide clear visual separation between sections
- Include section numbering for orientation
- Add progress indicator for long documents
- Support keyboard navigation between sections
