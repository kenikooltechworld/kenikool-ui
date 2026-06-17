# Navbar Type 16: Pagination Stepper

## Visual Design

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│   1 ━━━━━ 2 ━━━━━ 3 ━━━━━ 4 ─ ─ ─ 5                         │
│   ●       ●       ●       ○       ○                           │
│ Personal Info  Address  Payment  Review  Confirm              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
       ↑       ↑       ↑       ↑       ↑
   Complete Complete Current  Upcoming Upcoming
```

## Detailed Layout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                               ┃
┃     ①  ━━━━━━━━  ②  ━━━━━━━━  ③  ─ ─ ─ ─  ④  ─ ─ ─ ─  ⑤   ┃
┃     ●            ●            ◉            ○            ○    ┃
┃   Account      Payment      Review       Done        Email   ┃
┃  (Complete)   (Complete)   (Current)   (Upcoming)  (Locked)  ┃
┃                                                               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
       ↑            ↑            ↑            ↑            ↑
   Completed    Completed     Active      Available     Locked
  (Checkmark)  (Checkmark)   (Pulse)   (Clickable)  (Disabled)

Legend:
━━━━━  Solid line (completed connection)
─ ─ ─  Dashed line (incomplete connection)
●      Filled circle (completed step)
◉      Filled circle with ring (current step)
○      Empty circle (upcoming step)
```

## Specifications

**Container:**
- Display: `flex`, `justify-content: space-between`, `align-items: center`
- Max-width: `800px` (centered)
- Padding: `var(--k-space-6)`
- Background: `var(--k-bg-surface)`
- Border: `1px solid var(--k-border)` (optional)

**Step Circle:**
- **Completed**: 
  - Size: `40px` diameter
  - Background: `var(--k-success)`
  - Icon: Checkmark (✓), white color
  - Border: None
  
- **Current**:
  - Size: `48px` diameter (larger)
  - Background: `var(--k-accent)`
  - Number: Current step number
  - Border: `4px solid var(--k-accent-subtle)` (ring effect)
  - Pulse animation: Subtle scale pulse
  
- **Upcoming**:
  - Size: `40px` diameter
  - Background: `var(--k-bg-elevated)`
  - Border: `2px solid var(--k-border)`
  - Number: Step number, `var(--k-text-muted)`
  
- **Locked/Disabled**:
  - Size: `40px` diameter
  - Background: `var(--k-bg-surface)`
  - Border: `2px dashed var(--k-border)`
  - Icon: Lock (🔒) or number grayed out
  - Cursor: `not-allowed`

**Connecting Line:**
- **Completed**: 
  - Height: `2px`
  - Background: `var(--k-success)`
  - Style: Solid
  
- **Incomplete**:
  - Height: `2px`
  - Background: `var(--k-border)`
  - Style: Dashed (`border-style: dashed`)

**Step Label:**
- Font: `var(--k-text-sm)`, `var(--k-font-medium)`
- Color: `var(--k-text-primary)` (completed/current), `var(--k-text-muted)` (upcoming)
- Position: Below circle
- Text-align: `center`
- Max-width: `120px`
- Truncate: `text-overflow: ellipsis`

## Use Cases
- Multi-step forms (checkout, signup, onboarding)
- Wizards and guided flows
- Progress tracking
- Sequential processes
- Registration workflows

## Key Features
- Shows current position in flow
- Indicates completed/upcoming steps
- Click previous steps to navigate back
- Visual progress indication
- Step validation feedback
- Non-linear navigation (optional)

## Step States Detailed

```
1. COMPLETED ✓
┌────────┐
│   ✓    │ ← Green background, white checkmark
└────────┘
  Step 1
━━━━━━━━━━ ← Solid green line to next step

2. CURRENT (Active)
┌────────┐
│   2    │ ← Accent color, larger, pulsing ring
└────────┘
  Step 2
─ ─ ─ ─ ─ ← Dashed gray line to next step

3. UPCOMING (Available)
┌────────┐
│   3    │ ← Gray border, number inside, clickable
└────────┘
  Step 3
─ ─ ─ ─ ─ ← Dashed gray line

4. LOCKED (Unavailable)
┌────────┐
│   🔒   │ ← Dashed border, lock icon, not clickable
└────────┘
  Step 4
```

## Vertical Variant

```
┌─────────────────┐
│  ●  Step 1      │
│  ┃  Complete    │
│  ┃              │
│  ●  Step 2      │
│  ┃  Complete    │
│  ┃              │
│  ◉  Step 3      │ ← Current
│  ┊  In Progress │
│  ┊              │
│  ○  Step 4      │
│  ┊  Upcoming    │
│  ┊              │
│  ○  Step 5      │
│     Final       │
└─────────────────┘

Vertical layout for sidebars
Good for 5+ steps
```

## Compact Variant (Numbers Only)

```
┌──────────────────────────────────┐
│  1 ━━ 2 ━━ 3 ── 4 ── 5          │
│  ●    ●    ◉    ○    ○          │
└──────────────────────────────────┘

No labels, just numbers and lines
For limited space / mobile
```

## Icon Variant

```
┌─────────────────────────────────────────────────────┐
│  👤 ━━━ 📍 ━━━ 💳 ─ ─ ✉️ ─ ─ ✓                    │
│  ●      ●      ◉      ○      ○                     │
│ Profile Address Payment Email Done                 │
└─────────────────────────────────────────────────────┘

Icons instead of numbers
More visual, self-explanatory
```

## Mobile Behavior (< 768px)

**Option 1: Horizontal Scroll**
```
┌────────────────────────────────┐
│ 1━━2━━3──4 › ›                 │ ← Scroll right to see more
│ ● ● ◉ ○                        │
└────────────────────────────────┘
```

**Option 2: Compact Progress Bar**
```
┌────────────────────────────────┐
│ Step 3 of 5: Payment           │
│ ■■■■■■■■■■■■□□□□□□□□ 60%       │
└────────────────────────────────┘

Linear progress bar
Current step name shown above
```

**Option 3: Dropdown Current Step**
```
┌────────────────────────────────┐
│ Step 3: Payment ▾              │ ← Click to see all steps
└────────────────────────────────┘

Expands to:
┌────────────────────────────────┐
│ ✓ Step 1: Account              │
│ ✓ Step 2: Info                 │
│ → Step 3: Payment (current)    │
│   Step 4: Review               │
│   Step 5: Confirm              │
└────────────────────────────────┘
```

## Navigation Rules

**Linear (Sequential):**
```
- Can only proceed to next step
- Can go back to previous steps
- Cannot skip ahead
- Step 4 locked until Step 3 complete
```

**Non-Linear (Jump):**
```
- Can jump to any previously completed step
- Can jump to next available step
- Cannot jump to locked steps
- Useful for editing previous information
```

## Validation Feedback

```
Step with error:
┌────────┐
│   ⚠    │ ← Warning icon, error color
└────────┘
  Step 2
 (Error)

Step validating:
┌────────┐
│   ⟳    │ ← Spinner, processing
└────────┘
  Step 3
(Validating)
```

## Accessibility
- `<nav role="navigation" aria-label="Progress">`
- `<ol>` ordered list for steps
- Each step: `aria-current="step"` for current step
- Completed steps: `aria-label="Step 1: Account - Completed"`
- Current step: `aria-label="Step 3: Payment - Current step"`
- Upcoming steps: `aria-label="Step 4: Review - Not started"`
- Locked steps: `aria-disabled="true"`
- Keyboard: Arrow keys navigate between available steps
- Screen reader: Announces "Step 3 of 5"

## Example HTML Structure
```html
<k-navbar-stepper current="3" total="5">
  <k-step number="1" status="completed" label="Account" />
  <k-step number="2" status="completed" label="Personal Info" />
  <k-step number="3" status="current" label="Payment" />
  <k-step number="4" status="upcoming" label="Review" />
  <k-step number="5" status="locked" label="Confirm" />
</k-navbar-stepper>
```

## JavaScript API

```javascript
const stepper = document.querySelector('k-navbar-stepper');

// Navigate to step
stepper.goToStep(2);

// Mark step as complete
stepper.completeStep(3);

// Enable next step
stepper.unlockStep(4);

// Get current step
const current = stepper.getCurrentStep(); // Returns 3

// Listen for step change
stepper.addEventListener('k:step-change', (e) => {
  console.log('Changed to step:', e.detail.step);
});
```

## Animation
- Current step pulse: `scale(1) → scale(1.05)`, `2s ease infinite`
- Step transition: Fade out old, fade in new `300ms ease`
- Checkmark appear: Scale from 0 to 1, `200ms ease`
- Line fill: Width from 0% to 100%, `400ms ease`
- Error shake: `translateX(-4px → 4px → 0)`, `300ms`

## Best Practices
- 3-7 steps maximum (more gets overwhelming)
- Use clear, concise step labels
- Show progress percentage for long flows
- Allow back navigation
- Validate on step change, not submit
- Save progress automatically
- Provide visual feedback for validation
- Support keyboard navigation
