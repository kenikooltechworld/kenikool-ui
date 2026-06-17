# Navbar Type 19: Carousel/Slider Navigation

## Visual Design

```
┌─────────────────────────────────────────────────────────┐
│  ‹   [Card 1]  [Card 2]  [Card 3]  [Card 4]  [Card 5]  › │
│                                                         │
│                ● ○ ○ ○ ○                               │
└─────────────────────────────────────────────────────────┘
     ↑                                             ↑
  Previous                                       Next
  Arrow                                         Arrow
```

## Detailed Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ←                                                  →   ┃
┃     ┌──────────┐  ┌──────────┐  ┌──────────┐          ┃
┃     │          │  │          │  │          │          ┃
┃     │  CARD 1  │  │  CARD 2  │  │  CARD 3  │  → → →  ┃
┃     │          │  │          │  │          │          ┃
┃     └──────────┘  └──────────┘  └──────────┘          ┃
┃                                                         ┃
┃                    ● ● ○ ○ ○                          ┃
┃                  (Pagination dots)                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
       ↑                                        ↑
  Prev Button                            Next Button
   (Optional)                             (Optional)

Features:
- Horizontal scrolling
- Snap to item
- Touch/swipe gestures
- Mouse drag
- Pagination dots
- Arrow navigation
```

## Specifications

**Container:**
- Display: `flex`
- Overflow-x: `auto` or `hidden`
- Scroll-snap-type: `x mandatory`
- Gap: `var(--k-space-4)`
- Padding: `var(--k-space-6)`
- Width: `100%`
- Scroll behavior: `smooth`

**Carousel Item (Card):**
- Width: `300px` (fixed) or `80vw` (responsive)
- Min-width: `250px`
- Height: `auto` (min `200px`)
- Scroll-snap-align: `start` or `center`
- Flex-shrink: `0` (prevents squishing)
- Border radius: `var(--k-radius-xl)`
- Background: `var(--k-bg-surface)`
- Border: `1px solid var(--k-border)`
- Shadow: `var(--k-shadow-sm)`

**Navigation Arrows:**
- Size: `48×48px`
- Border radius: `50%` (circle)
- Position: `absolute`, vertically centered
- Left arrow: `left: var(--k-space-4)`
- Right arrow: `right: var(--k-space-4)`
- Background: `var(--k-bg-surface)`
- Shadow: `var(--k-shadow-md)`
- Z-index: `var(--k-z-dropdown)`
- Icon: `‹` and `›`, 24px
- Hover: Scale 1.1, shadow grows

**Pagination Dots:**
- Size: `8px` diameter (inactive), `12px` (active)
- Gap: `var(--k-space-2)`
- Position: Below carousel, centered
- Background: `var(--k-border)` (inactive), `var(--k-accent)` (active)
- Border radius: `50%`
- Cursor: `pointer`
- Transition: `all 200ms ease`

## Use Cases
- Image galleries
- Product showcases
- Testimonial sliders
- Feature highlights
- Card collections
- News/article feeds
- Portfolio showcases

## Key Features
- Horizontal scrolling with snap
- Touch/swipe gestures (mobile)
- Mouse drag (desktop)
- Keyboard navigation (arrow keys)
- Pagination dots show position
- Auto-play option
- Infinite loop option
- Responsive (shows 1-5 items based on viewport)

## Scroll Snap Behavior

```
Before snap:
┌────────┐  ┌──────
│ Card 1 │  │ Card
└────────┘  └──────
      ↑ User scrolls/drags here

After snap (auto-aligns):
┌────────┐  ┌────────┐
│ Card 1 │  │ Card 2 │
└────────┘  └────────┘
              ↑ Snaps to start of Card 2
```

## Responsive Grid

**Desktop (> 1200px): 3-4 items visible**
```
┌──────┬──────┬──────┬──────┐
│  1   │  2   │  3   │  4   │ → scroll →
└──────┴──────┴──────┴──────┘
```

**Tablet (768-1200px): 2-3 items visible**
```
┌──────┬──────┬──────┐
│  1   │  2   │  3   │ → scroll →
└──────┴──────┴──────┘
```

**Mobile (< 768px): 1 item visible**
```
┌───────────────┐
│       1       │ → swipe →
└───────────────┘
```

## Auto-Play Feature

```
Carousel auto-advances every 5 seconds:

t=0s:  [Card 1] [Card 2] [Card 3]
       ↑ Active

t=5s:  [Card 1] [Card 2] [Card 3]
                 ↑ Auto-advance

t=10s: [Card 1] [Card 2] [Card 3]
                          ↑ Auto-advance

Pauses on hover
Resumes when mouse leaves
```

## Infinite Loop

```
Regular (no loop):
[1] [2] [3] [4] [5]
                 ↑ Reaches end, can't go further

Infinite loop:
[4] [5] [1] [2] [3]
         ↑ Clicking next wraps to Card 1
```

## Navigation Methods

**Method 1: Arrow Buttons**
```
Click ‹ → Previous item
Click › → Next item
```

**Method 2: Pagination Dots**
```
Click dot 3 → Jump to item 3
```

**Method 3: Touch Swipe (Mobile)**
```
Swipe left → Next item
Swipe right → Previous item
```

**Method 4: Mouse Drag (Desktop)**
```
Click and drag left/right → Scroll
Release → Snap to nearest item
```

**Method 5: Keyboard**
```
Arrow Left → Previous
Arrow Right → Next
Home → First item
End → Last item
```

**Method 6: Scroll Wheel**
```
Scroll horizontally (trackpad/mouse)
Snaps to items automatically
```

## Mobile Behavior (Touch Gestures)

```
Touch Events:
- touchstart: Record starting position
- touchmove: Follow finger, scroll container
- touchend: Calculate velocity, snap to item

Momentum scrolling:
Fast swipe → Multiple items scroll
Slow swipe → One item scroll
```

## Accessibility
- `<nav role="navigation" aria-label="Image carousel">`
- Container: `aria-live="polite"` (announces slide changes)
- Each item: `role="group"`, `aria-roledescription="slide"`
- Item labeling: `aria-label="Slide 3 of 10"`
- Prev/Next buttons: `aria-label="Previous slide" / "Next slide"`
- Pagination dots: `aria-label="Go to slide 3"`
- Keyboard: Arrow keys navigate, Tab enters/exits carousel
- Pause button: Required if auto-play enabled

## Example HTML Structure
```html
<k-carousel auto-play="5000" loop infinite>
  <k-carousel-item>
    <k-card v="elevated">
      <img src="image1.jpg" alt="Product 1">
      <h3>Product Name</h3>
      <p>Description</p>
    </k-card>
  </k-carousel-item>
  
  <k-carousel-item>
    <k-card v="elevated">
      <img src="image2.jpg" alt="Product 2">
      <h3>Product Name</h3>
      <p>Description</p>
    </k-card>
  </k-carousel-item>
  
  <k-carousel-item>
    <k-card v="elevated">
      <img src="image3.jpg" alt="Product 3">
      <h3>Product Name</h3>
      <p>Description</p>
    </k-card>
  </k-carousel-item>
  
  <!-- Pagination (auto-generated) -->
  <div slot="pagination"></div>
  
  <!-- Navigation arrows (optional) -->
  <button slot="prev" aria-label="Previous">‹</button>
  <button slot="next" aria-label="Next">›</button>
</k-carousel>
```

## JavaScript API

```javascript
const carousel = document.querySelector('k-carousel');

// Navigate
carousel.next();       // Go to next item
carousel.prev();       // Go to previous item
carousel.goTo(2);      // Jump to item index 2

// Auto-play control
carousel.play();       // Start auto-play
carousel.pause();      // Pause auto-play
carousel.stop();       // Stop and reset

// Get current
const index = carousel.getCurrentIndex(); // Returns 2

// Listen for changes
carousel.addEventListener('k:slide-change', (e) => {
  console.log('Slide changed to:', e.detail.index);
});

carousel.addEventListener('k:slide-end', () => {
  console.log('Reached last slide');
});
```

## Variants

**Variant 1: Full-Width Hero Carousel**
```
┌─────────────────────────────────────┐
│                                     │
│         [HERO IMAGE]                │
│         Large full-bleed            │
│                                     │
└─────────────────────────────────────┘
          ● ○ ○
```

**Variant 2: Thumbnail Preview**
```
Main carousel:
┌──────────────────────┐
│   [Large Image]      │
└──────────────────────┘

Thumbnails below:
[▢] [▢] [■] [▢] [▢]
         ↑ Active
```

**Variant 3: Vertical Carousel**
```
┌──────────┐
│  Card 1  │
├──────────┤
│  Card 2  │ ← Scrolls vertically
├──────────┤
│  Card 3  │
└──────────┘
```

**Variant 4: Peek Next/Previous**
```
┌─────────────────────────┐
│ ┌──────────┐            │
│ │  Card 2  │ ← Centered │
│ └──────────┘            │
└─────────────────────────┘
  ↑         ↑         ↑
Peek 1   Active   Peek 3

Shows parts of adjacent items
```

## Performance Optimization

```css
/* Use transform for smooth 60fps scrolling */
.carousel-item {
  will-change: transform;
  transform: translateZ(0); /* Hardware acceleration */
}

/* Lazy load images */
<img loading="lazy" src="image.jpg">

/* Only render visible + adjacent items (virtual scrolling for large lists) */
```

## Animation
- Slide transition: `scroll-behavior: smooth` or `transform: translateX()`, `300ms ease`
- Pagination dot: Scale 1 → 1.5, `200ms ease`
- Arrow hover: Scale 1 → 1.1, `150ms ease`
- Auto-play: Smooth scroll, `500ms ease`

## Best Practices
- Show 1-5 items based on viewport
- Provide multiple navigation methods
- Pause auto-play on hover
- Support touch gestures on mobile
- Add prev/next arrows for clarity
- Show pagination dots (max 10, else use progress bar)
- Preload adjacent images
- Support keyboard navigation
- Announce slide changes to screen readers
- Optimize for performance (virtual scrolling for 100+ items)
