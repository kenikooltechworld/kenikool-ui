# Kenikool UI Documentation Master Plan

**Version:** v0.1.0  
**Last Updated:** June 17, 2026  
**Status:** Planning Phase

---

## 📋 Overview

This document outlines the complete documentation strategy for Kenikool UI, a modern component library with vanilla JS and React implementations. The documentation follows the **Diataxis framework** (Tutorials, How-To Guides, Reference, Explanation) and industry best practices from leading UI libraries.

---

## 🎯 Documentation Principles

### 1. **Diataxis Framework Alignment**
- **Tutorials**: Learning-oriented, step-by-step first experiences
- **How-To Guides**: Goal-oriented, practical problem-solving
- **Reference**: Information-oriented, complete technical specs
- **Explanation**: Understanding-oriented, conceptual deep dives

### 2. **Vanilla-First Approach**
- All examples show vanilla JS first
- React examples provided as secondary reference
- Emphasizes Web Components as the foundation

### 3. **Live Demos**
- Every code example is runnable
- Link to playground for interactive testing
- Copy-paste ready code snippets

### 4. **Version Awareness**
- Mark features with version badges when introduced
- v0.1.0 is the foundation release
- Future features tagged accordingly

---

## 📁 Directory Structure

```
docs/
├── README.md                          # Documentation homepage
│
├── getting-started/                   # TUTORIALS
│   ├── installation.md                # Install via npm, CDN, or download
│   ├── first-component.md             # Create your first button
│   ├── first-layout.md                # Build a responsive layout
│   └── first-theme.md                 # Switch between themes
│
├── guides/                            # HOW-TO GUIDES
│   ├── creating-forms.md              # Build complete forms
│   ├── responsive-layouts.md          # Mobile-first patterns
│   ├── custom-themes.md               # Brand customization
│   ├── optimizing-images.md           # Modern image optimization
│   ├── gallery-with-lightbox.md       # Photo gallery tutorial
│   └── dark-mode-toggle.md            # Theme switching implementation
│
├── reference/                         # REFERENCE (specs)
│   ├── tokens/
│   │   ├── README.md                  # Token system overview
│   │   ├── universal-tokens.md        # 19 universal tokens
│   │   ├── layout-tokens.md           # 112 layout tokens
│   │   └── css-variables.md           # 110 CSS custom properties
│   │
│   ├── components/
│   │   ├── README.md                  # Component library index
│   │   │
│   │   ├── button.md                  # Button API reference
│   │   ├── input.md                   # Input API reference
│   │   ├── select.md                  # Select API reference
│   │   ├── checkbox.md                # Checkbox API reference
│   │   ├── modal.md                   # Modal API reference
│   │   ├── toast.md                   # Toast API reference
│   │   ├── tooltip.md                 # Tooltip API reference
│   │   ├── badge.md                   # Badge API reference
│   │   ├── avatar.md                  # Avatar API reference
│   │   ├── card.md                    # Card API reference
│   │   ├── loader.md                  # Loader API reference
│   │   ├── image.md                   # Image API reference
│   │   ├── lightbox.md                # Lightbox API reference
│   │   ├── tabs.md                    # Tabs API reference
│   │   ├── carousel.md                # Carousel API reference
│   │   │
│   │   └── layout/
│   │       ├── grid.md                # Grid system
│   │       ├── row.md                 # Row component
│   │       ├── col.md                 # Column component
│   │       ├── stack.md               # Stack layout
│   │       ├── box.md                 # Box container
│   │       ├── container.md           # Container wrapper
│   │       ├── section.md             # Section component
│   │       ├── frame.md               # Frame layout
│   │       ├── text.md                # Text component
│   │       └── divider.md             # Divider component
│   │
│   └── api/
│       ├── parseV.md                  # parseV() function reference
│       ├── theme-functions.md         # applyTheme(), getInitialTheme()
│       ├── toast-manager.md           # Toast manager API
│       └── utilities.md               # Sanitize, generateId, focusTrap
│
├── concepts/                          # EXPLANATION (deep dives)
│   ├── v-attribute-system.md          # Why `v` instead of props
│   ├── light-dom-architecture.md      # Why Light DOM not Shadow DOM
│   ├── theming-philosophy.md          # CSS variables approach
│   ├── token-system.md                # Token design & parsing
│   ├── accessibility-first.md         # Built-in a11y approach
│   ├── security-model.md              # Sanitization & CSP compliance
│   └── performance-strategy.md        # Bundle size, lazy loading, optimization
│
└── examples/                          # Real-world examples
    ├── README.md                      # Examples index
    ├── authentication-form/
    │   ├── README.md
    │   └── index.html
    ├── dashboard-layout/
    │   ├── README.md
    │   └── index.html
    ├── image-gallery/
    │   ├── README.md
    │   └── index.html
    ├── landing-page/
    │   ├── README.md
    │   └── index.html
    └── admin-panel/
        ├── README.md
        └── index.html
```

---

## 📝 Component Documentation Template

Each component doc follows this structure:

```markdown
# Component Name

> One-sentence description of the component

## Import

### Vanilla JS
```html
<!-- Auto-registered when you import kenikool-ui/vanilla -->
<k-component v="variant size color">Content</k-component>
```

### React
```tsx
import { Component } from 'kenikool-ui/react';
<Component variant="variant" size="size">Content</Component>
```

## Anatomy

Shows component structure and slots:

```html
<k-component>
  <slot name="header">Header content</slot>
  <slot>Default content</slot>
  <slot name="footer">Footer content</slot>
</k-component>
```

## Examples

### Basic Usage
[Live demo with code]

### All Variants
[Visual comparison of all variants]

### With Different Sizes
[Visual comparison of all sizes]

### State Variations
[Loading, disabled, error states]

### With Custom Styling
[CSS token override examples]

## API Reference

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `v` | `string` | `"filled md primary"` | Token string for styling |
| `label` | `string` | - | Accessible label (required for icon-only) |

### Tokens (via `v` attribute)

#### Universal Tokens

| Token | Values | Default | Description |
|-------|--------|---------|-------------|
| variant | `filled \| outlined \| ghost` | `filled` | Visual style |
| size | `xs \| sm \| md \| lg \| xl` | `md` | Component size |
| color | `primary \| success \| warning \| error \| info` | `primary` | Color scheme |
| radius | `r-none \| r-sm \| r-md \| r-lg \| r-full` | - | Border radius |
| state | `loading \| disabled \| full` | - | State flags |

#### Component-Specific Tokens
[If applicable]

### Slots

| Slot | Description |
|------|-------------|
| (default) | Main content |
| `header` | Header content |
| `footer` | Footer content |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `k:click` | `{ target: HTMLElement }` | Fired when clicked |
| `k:change` | `{ value: any }` | Fired when value changes |

### Methods (Public API)

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `open()` | - | `void` | Opens the component |
| `close()` | - | `void` | Closes the component |

## Accessibility

### ARIA Attributes
- `role`: Automatically set to semantic role
- `aria-label`: Required for icon-only variants
- `aria-disabled`: Set when disabled
- `aria-busy`: Set when loading

### Keyboard Interactions
- `Enter` / `Space`: Activate
- `Escape`: Close/cancel
- `Tab`: Navigate focus

### Focus Management
- Visible focus ring via `--k-focus-ring`
- Focus trap in modal contexts
- Return focus on close

## Styling

### CSS Tokens

Override component styling with CSS custom properties:

```css
/* Override component-specific tokens */
k-component {
  --component-specific-token: value;
}

/* Override global tokens */
:root {
  --k-accent: #your-brand-color;
}
```

### Custom Classes

Add custom classes for additional styling:

```html
<k-component class="my-custom-class">Content</k-component>
```

```css
.my-custom-class {
  /* Your custom styles */
}
```

## Related Components

- [Related Component 1](#)
- [Related Component 2](#)

## Changelog

- **v0.1.0**: Initial release
```

---

## 🎨 Token Documentation Template

Each token reference doc follows this structure:

```markdown
# Token Category Name

> Brief description of this token category

## Overview

Explanation of what these tokens control and when to use them.

## Token List

### Token Subcategory

| Token | Output | Use Case | Available On |
|-------|--------|----------|--------------|
| `token-name` | `data-attr="value"` | Description | All / Specific |

### Examples

```html
<k-component v="token-name">Example</k-component>
```

[Live demo showing all variations]

### Visual Comparison

[Table or grid showing visual differences]

## Combinations

How to combine tokens:

```html
<k-component v="token1 token2 token3">Combined</k-component>
```

## Best Practices

- ✅ Do: Best practice example
- ❌ Don't: Anti-pattern example

## Related

- [Related Token Category](#)
- [Related Concept](#)
```

---

## 📊 Execution Phases

### **Phase 1: Foundation** (Priority: HIGHEST)

**Goal**: Establish core documentation structure and essential content

**Files to Create** (7 files):
1. `docs/README.md` - Documentation homepage with navigation
2. `docs/getting-started/installation.md` - Install instructions
3. `docs/getting-started/first-component.md` - First button tutorial
4. `docs/concepts/v-attribute-system.md` - Core concept explanation
5. `docs/reference/tokens/README.md` - Token system overview
6. `docs/reference/tokens/universal-tokens.md` - Complete universal token reference
7. `docs/reference/tokens/layout-tokens.md` - Complete layout token reference

**Estimated Time**: 1 session  
**Success Criteria**: Users can install, create first component, and understand tokens

---

### **Phase 2: Core Component Reference** (Priority: HIGH)

**Goal**: Document most-used components with complete API references

**Files to Create** (10 files):
1. `docs/reference/components/README.md` - Component library index
2. `docs/reference/components/button.md` - Most used component
3. `docs/reference/components/input.md` - Form foundation
4. `docs/reference/components/modal.md` - Common pattern
5. `docs/reference/components/badge.md` - Simple but popular
6. `docs/reference/components/card.md` - Layout foundation
7. `docs/reference/components/toast.md` - User feedback
8. `docs/reference/components/loader.md` - Loading states
9. `docs/reference/components/image.md` - Modern optimization
10. `docs/reference/components/lightbox.md` - Gallery support

**Estimated Time**: 2 sessions  
**Success Criteria**: Users can reference complete API for top 10 components

---

### **Phase 3: Layout Components** (Priority: HIGH)

**Goal**: Document layout system components

**Files to Create** (11 files):
1. `docs/reference/components/layout/grid.md`
2. `docs/reference/components/layout/row.md`
3. `docs/reference/components/layout/col.md`
4. `docs/reference/components/layout/stack.md`
5. `docs/reference/components/layout/box.md`
6. `docs/reference/components/layout/container.md`
7. `docs/reference/components/layout/section.md`
8. `docs/reference/components/layout/frame.md`
9. `docs/reference/components/layout/text.md`
10. `docs/reference/components/layout/divider.md`
11. `docs/reference/tokens/css-variables.md` - CSS custom properties reference

**Estimated Time**: 2 sessions  
**Success Criteria**: Users can build responsive layouts with full token control

---

### **Phase 4: Remaining Components** (Priority: MEDIUM)

**Goal**: Document all remaining interactive components

**Files to Create** (7 files):
1. `docs/reference/components/select.md`
2. `docs/reference/components/checkbox.md`
3. `docs/reference/components/tooltip.md`
4. `docs/reference/components/avatar.md`
5. `docs/reference/components/tabs.md`
6. `docs/reference/components/carousel.md`
7. `docs/reference/components/navbar.md` (when ready)

**Estimated Time**: 1-2 sessions  
**Success Criteria**: Complete component library documented

---

### **Phase 5: Concepts & Deep Dives** (Priority: MEDIUM)

**Goal**: Explain architectural decisions and design philosophy

**Files to Create** (6 files):
1. `docs/concepts/light-dom-architecture.md`
2. `docs/concepts/theming-philosophy.md`
3. `docs/concepts/token-system.md`
4. `docs/concepts/accessibility-first.md`
5. `docs/concepts/security-model.md`
6. `docs/concepts/performance-strategy.md`

**Estimated Time**: 1 session  
**Success Criteria**: Users understand "why" behind design decisions

---

### **Phase 6: How-To Guides** (Priority: MEDIUM)

**Goal**: Provide practical solutions for common tasks

**Files to Create** (6 files):
1. `docs/guides/creating-forms.md`
2. `docs/guides/responsive-layouts.md`
3. `docs/guides/custom-themes.md`
4. `docs/guides/optimizing-images.md`
5. `docs/guides/gallery-with-lightbox.md`
6. `docs/guides/dark-mode-toggle.md`

**Estimated Time**: 1-2 sessions  
**Success Criteria**: Users can solve common problems without searching

---

### **Phase 7: API Reference** (Priority: LOW)

**Goal**: Document utility functions and programmatic APIs

**Files to Create** (4 files):
1. `docs/reference/api/parseV.md`
2. `docs/reference/api/theme-functions.md`
3. `docs/reference/api/toast-manager.md`
4. `docs/reference/api/utilities.md`

**Estimated Time**: 1 session  
**Success Criteria**: Developers can use programmatic APIs confidently

---

### **Phase 8: Examples** (Priority: LOW)

**Goal**: Provide complete, real-world code examples

**Files to Create** (5+ folders):
1. `docs/examples/README.md`
2. `docs/examples/authentication-form/`
3. `docs/examples/dashboard-layout/`
4. `docs/examples/image-gallery/`
5. `docs/examples/landing-page/`
6. `docs/examples/admin-panel/`

**Estimated Time**: 2-3 sessions  
**Success Criteria**: Users can copy-paste working examples

---

### **Phase 9: Advanced Tutorials** (Priority: LOW)

**Goal**: Add advanced getting-started tutorials

**Files to Create** (2 files):
1. `docs/getting-started/first-layout.md` - Responsive layout tutorial
2. `docs/getting-started/first-theme.md` - Theme customization tutorial

**Estimated Time**: 1 session  
**Success Criteria**: Users master intermediate features quickly

---

## 📈 Progress Tracking

### Documentation Metrics

- **Total Planned Files**: ~70 markdown files
- **Phase 1 (Foundation)**: 7 files ⏳
- **Phase 2 (Core Components)**: 10 files ⏳
- **Phase 3 (Layout Components)**: 11 files ⏳
- **Phase 4 (Remaining Components)**: 7 files ⏳
- **Phase 5 (Concepts)**: 6 files ⏳
- **Phase 6 (How-To Guides)**: 6 files ⏳
- **Phase 7 (API Reference)**: 4 files ⏳
- **Phase 8 (Examples)**: 10+ files ⏳
- **Phase 9 (Advanced Tutorials)**: 2 files ⏳

### Completion Criteria

Documentation is considered **complete** when:
- ✅ All Phase 1-4 files are written (foundation + components)
- ✅ All tokens have complete references with examples
- ✅ All components have API documentation
- ✅ At least 3 how-to guides are published
- ✅ At least 3 real-world examples are available
- ✅ Core concepts are explained

---

## 🎯 Writing Guidelines

### Style & Tone
- **Friendly but professional** - Approachable without being casual
- **Clear and concise** - No unnecessary words
- **Vanilla-first** - Always show vanilla JS before React
- **Action-oriented** - Start with "Create", "Build", "Use" not "You can..."

### Code Examples
- **Runnable** - Every example must work copy-paste
- **Complete** - Include all necessary HTML/CSS/JS
- **Commented** - Explain non-obvious parts
- **Playground links** - Link to live demo when possible

### Formatting
- **Headers**: Use sentence case (not Title Case)
- **Code blocks**: Always specify language (```html, ```tsx, ```css)
- **Tables**: Use for structured data (API reference, token lists)
- **Lists**: Use for sequences, options, or feature lists
- **Bold**: For emphasis on key terms or actions
- **Inline code**: For tokens, attributes, values (`v="filled"`)

### Version Badges
- Mark new features: `**v0.2.0+**` or `*(Added in v0.2.0)*`
- Place at end of description or in changelog section

### Accessibility Notes
- Always include accessibility section for interactive components
- Document ARIA attributes, keyboard interactions, focus management
- Mention screen reader compatibility when relevant

---

## 🔄 Maintenance Plan

### Regular Updates
- **Component changes**: Update docs immediately when component APIs change
- **Token additions**: Add to token reference with version badge
- **New components**: Follow component template, add to index
- **Bug fixes in docs**: Track via GitHub issues

### Review Schedule
- **Monthly**: Review for accuracy and broken links
- **Per release**: Update version badges and changelog sections
- **Quarterly**: Audit for missing content or unclear sections

### Community Contributions
- Accept doc PRs following the templates in this plan
- Contributors must test code examples before submitting
- Maintain friendly, helpful tone in all contributions

---

## 📚 Resources & References

### Framework Documentation Studied
- [Radix UI](https://www.radix-ui.com/primitives/docs) - Component API patterns
- [Chakra UI](https://chakra-ui.com/docs) - Examples and visual presentation
- [Material UI](https://mui.com/material-ui/) - Comprehensive reference structure
- [Ant Design](https://ant.design/) - Component organization

### Documentation Philosophy
- [Diataxis Framework](https://diataxis.fr/) - Core documentation structure
- [Write the Docs](https://www.writethedocs.org/) - Best practices
- [GitBook Guide](https://gitbook.com/) - Information architecture

---

## ✅ Next Steps

1. **Create Phase 1 files** (7 foundation documents)
2. **Test all code examples** in playground
3. **Review for consistency** with this master plan
4. **Publish to GitHub** in `docs/` folder
5. **Move to Phase 2** (core component reference)

---

**Last Updated**: June 17, 2026  
**Plan Status**: Ready for execution  
**First Phase**: Foundation (7 files)  
**Version**: v0.1.0
