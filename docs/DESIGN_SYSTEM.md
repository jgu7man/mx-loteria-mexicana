# Design System Guide
## MX Lotería Mexicana

### 📋 Quick Reference

This guide provides a comprehensive reference for all design tokens, mixins, and utilities available in the project.

---

## 🎨 Colors

### Primary Palette

| Variable | Value | Usage |
|----------|-------|-------|
| `$color-primary` | `#667eea` | Main brand color, primary buttons, links |
| `$color-primary-light` | `#7c8ff0` | Hover states, lighter variants |
| `$color-primary-dark` | `#5568d3` | Active states, emphasis |
| `$color-secondary` | `#764ba2` | Secondary actions, accents |
| `$color-secondary-light` | `#8a5fb8` | Lighter secondary variant |
| `$color-secondary-dark` | `#5f3982` | Darker secondary variant |

### Accent Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `$color-accent-green` | `#10b981` | Success states, selections, positive actions |
| `$color-accent-green-light` | `rgba(16, 185, 129, 0.5)` | Transparent green for overlays |

### Neutral Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `$color-white` | `#ffffff` | Text on dark backgrounds, cards |
| `$color-black` | `#000000` | Pure black (use sparingly) |
| `$color-gray-100` | `#f7fafc` | Lightest gray, backgrounds |
| `$color-gray-200` | `#edf2f7` | Very light gray |
| `$color-gray-300` | `#e2e8f0` | Light gray, borders |
| `$color-gray-400` | `#cbd5e0` | Medium-light gray |
| `$color-gray-500` | `#a0aec0` | Medium gray |
| `$color-gray-600` | `#718096` | Medium-dark gray |
| `$color-gray-700` | `#4a5568` | Dark gray, secondary text |
| `$color-gray-800` | `#2d3748` | Very dark gray |
| `$color-gray-900` | `#1a202c` | Almost black, primary text |

### Gradients

```scss
// Primary gradient (purple to violet)
background: $gradient-primary;
// linear-gradient(135deg, #667eea 0%, #764ba2 100%)

// Shine effect (for hover animations)
background: $gradient-shine;
// linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)
```

---

## 📝 Typography

### Font Family

```scss
font-family: $font-family-base;
// system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...
```

### Font Sizes

| Variable | Value | Pixels (16px base) | Usage |
|----------|-------|-------------------|-------|
| `$font-size-xs` | `0.55rem` | 8.8px | Very small text, fine print |
| `$font-size-sm` | `0.7rem` | 11.2px | Small text, captions |
| `$font-size-base` | `1rem` | 16px | Body text, default |
| `$font-size-lg` | `1.2rem` | 19.2px | Large text, subheadings |
| `$font-size-xl` | `1.5rem` | 24px | Extra large text |
| `$font-size-2xl` | `2rem` | 32px | H3 headings |
| `$font-size-3xl` | `3rem` | 48px | H1 headings |
| `$font-size-4xl` | `4rem` | 64px | Hero text |
| `$font-size-5xl` | `5rem` | 80px | Extra large hero text |

### Font Weights

| Variable | Value | Usage |
|----------|-------|-------|
| `$font-weight-light` | `300` | Light emphasis |
| `$font-weight-normal` | `400` | Body text, default |
| `$font-weight-medium` | `500` | Medium emphasis |
| `$font-weight-semibold` | `600` | Semi-bold text |
| `$font-weight-bold` | `700` | Headings, strong emphasis |

### Line Heights

| Variable | Value | Usage |
|----------|-------|-------|
| `$line-height-tight` | `1.2` | Headings, tight text |
| `$line-height-normal` | `1.5` | Body text, default |
| `$line-height-relaxed` | `1.75` | Comfortable reading |

---

## 📏 Spacing

Based on a **4px grid system**:

| Variable | Value | Pixels | Usage |
|----------|-------|--------|-------|
| `$spacing-1` | `0.25rem` | 4px | Minimal spacing |
| `$spacing-2` | `0.5rem` | 8px | Very tight spacing |
| `$spacing-3` | `0.75rem` | 12px | Tight spacing |
| `$spacing-4` | `1rem` | 16px | Default spacing |
| `$spacing-5` | `1.25rem` | 20px | Medium spacing |
| `$spacing-6` | `1.5rem` | 24px | Comfortable spacing |
| `$spacing-8` | `2rem` | 32px | Large spacing |
| `$spacing-10` | `2.5rem` | 40px | Extra large spacing |
| `$spacing-12` | `3rem` | 48px | Very large spacing |
| `$spacing-16` | `4rem` | 64px | Huge spacing |

---

## 📱 Breakpoints

| Variable | Value | Device |
|----------|-------|--------|
| `$breakpoint-xs` | `320px` | Mobile (small) |
| `$breakpoint-sm` | `500px` | Mobile |
| `$breakpoint-md` | `768px` | Tablet |
| `$breakpoint-lg` | `1024px` | Desktop |
| `$breakpoint-xl` | `1200px` | Large desktop |
| `$breakpoint-2xl` | `1536px` | Extra large |

### Usage

```scss
// Mobile-first approach
.element {
  width: 100%;

  @include respond-to(sm) {
    width: 50%;
  }

  @include respond-to(xl) {
    width: 33.333%;
  }
}
```

---

## 🎯 Border & Shadows

### Border Radius

| Variable | Value | Pixels | Usage |
|----------|-------|--------|-------|
| `$border-radius-sm` | `0.25rem` | 4px | Small elements |
| `$border-radius-base` | `0.5rem` | 8px | Default |
| `$border-radius-md` | `0.75rem` | 12px | Medium elements |
| `$border-radius-lg` | `1rem` | 16px | Large elements |
| `$border-radius-xl` | `1.5rem` | 24px | Extra large |
| `$border-radius-full` | `9999px` | Full | Circles, pills |

### Border Width

| Variable | Value | Usage |
|----------|-------|-------|
| `$border-width-thin` | `1px` | Subtle borders |
| `$border-width-base` | `2px` | Default borders |
| `$border-width-thick` | `3px` | Emphasis borders |

### Box Shadows

| Variable | Usage |
|----------|-------|
| `$shadow-sm` | Subtle shadow for cards |
| `$shadow-base` | Default shadow |
| `$shadow-md` | Medium elevation |
| `$shadow-lg` | High elevation |
| `$shadow-xl` | Very high elevation |
| `$shadow-glow-green` | Green glow effect |

```scss
// Example
.card {
  box-shadow: $shadow-base;

  &:hover {
    box-shadow: $shadow-lg;
  }
}
```

---

## ⚡ Transitions & Animations

### Transition Speeds

| Variable | Value | Usage |
|----------|-------|-------|
| `$transition-fast` | `0.15s ease-in-out` | Quick interactions |
| `$transition-base` | `0.3s ease-in-out` | Default transitions |
| `$transition-slow` | `0.5s ease-in-out` | Slow, smooth transitions |

### Animation Durations

| Variable | Value | Usage |
|----------|-------|-------|
| `$animation-duration-fast` | `0.3s` | Quick animations |
| `$animation-duration-base` | `0.5s` | Default animations |
| `$animation-duration-slow` | `1s` | Slow animations |
| `$animation-duration-float` | `3s` | Float animation |

---

## 🔧 Mixins Reference

### Responsive Design

```scss
@include respond-to(sm) { /* styles */ }
@include respond-to(md) { /* styles */ }
@include respond-to(lg) { /* styles */ }
@include respond-to(xl) { /* styles */ }
@include respond-to(2xl) { /* styles */ }
```

### Card Components

```scss
// Card container with hover effect
@include card-container($width);

// Card size with emoji and name sizing
@include card-size($max-width, $emoji-size, $name-size);

// Card padding
@include card-padding;
```

### Animations

```scss
// Float animation (up and down)
@include float-animation($duration, $distance);

// Bounce animation
@include bounce-animation($duration, $distance);

// Shine effect on hover
@include shine-effect;
```

### Layout

```scss
// Flexbox center alignment
@include flex-center;

// Grid layout
@include grid-layout($columns, $gap);

// Aspect ratio
@include aspect-ratio($width, $height);
```

### Visual Effects

```scss
// Gradient background
@include gradient-background($gradient);

// Border with hover effect
@include border-hover($color, $hover-color);

// Drop shadow filter
@include drop-shadow($shadow);
```

### Typography

```scss
// Responsive text sizing with clamp
@include text-clamp($min-size, $preferred-size, $max-size);

// Truncate text with ellipsis
@include text-truncate;

// Multi-line truncate
@include text-truncate-lines($lines);
```

### Utilities

```scss
// Host component display block
@include host-block;

// Container query type
@include container-inline;

// Custom scrollbar
@include custom-scrollbar($thumb-color, $track-color);

// Focus visible styles
@include focus-visible($color);

// Generic transition
@include transition($properties...);
```

---

## 🛠️ Functions Reference

```scss
// Color with opacity
color: color-opacity($color-primary, 0.5);

// Lighten color
background: lighten-color($color-primary, 10%);

// Darken color
background: darken-color($color-primary, 10%);

// Spacing multiplier
margin: spacing(2); // 2 * $spacing-4 = 2rem

// Convert px to rem
font-size: px-to-rem(24px); // 1.5rem

// Container query width
width: cqw(50); // 50cqw

// Aspect ratio calculation
aspect-ratio: aspect-ratio(16, 9);
```

---

## 🎨 Utility Classes

### Display

```scss
.d-none { display: none; }
.d-block { display: block; }
.d-flex { display: flex; }
.d-grid { display: grid; }
```

### Flexbox

```scss
.flex-center { /* centers items */ }
.flex-row { flex-direction: row; }
.flex-column { flex-direction: column; }
.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.align-start { align-items: flex-start; }
.align-center { align-items: center; }
.align-end { align-items: flex-end; }
```

### Text Alignment

```scss
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.text-truncate { /* truncates with ellipsis */ }
```

### Animations

```scss
.float { /* applies float animation */ }
.bounce { /* applies bounce animation */ }
.shine-effect { /* applies shine hover effect */ }
```

### Spacing (0-16)

```scss
// Margin
.m-4 { margin: 1rem; }
.mt-4 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1rem; }
.ml-4 { margin-left: 1rem; }
.mr-4 { margin-right: 1rem; }

// Padding
.p-4 { padding: 1rem; }
.pt-4 { padding-top: 1rem; }
.pb-4 { padding-bottom: 1rem; }
.pl-4 { padding-left: 1rem; }
.pr-4 { padding-right: 1rem; }

// Range: 0-16 (multiply by 0.25rem for actual value)
// Example: .m-8 = margin: 2rem
```

---

## 🎯 Component Examples

### Button with Gradient

```scss
@import 'styles/abstracts/index';

.btn-primary {
  @include gradient-background;
  color: $color-white;
  padding: $spacing-3 $spacing-6;
  border-radius: $border-radius-base;
  font-weight: $font-weight-semibold;
  @include transition(transform, box-shadow);

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }

  &:active {
    transform: translateY(0);
  }
}
```

### Card Component

```scss
@import 'styles/abstracts/index';

.card {
  background: $color-white;
  border-radius: $border-radius-lg;
  padding: $spacing-6;
  box-shadow: $shadow-base;
  @include transition(transform, box-shadow);

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-xl;
  }

  &__title {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-gray-900;
    margin-bottom: $spacing-4;
  }

  &__content {
    font-size: $font-size-base;
    color: $color-gray-700;
    line-height: $line-height-relaxed;
  }
}
```

### Responsive Grid

```scss
@import 'styles/abstracts/index';

.grid-container {
  @include grid-layout(1, $spacing-4);

  @include respond-to(md) {
    @include grid-layout(2, $spacing-6);
  }

  @include respond-to(xl) {
    @include grid-layout(3, $spacing-8);
  }
}
```

---

## 📚 Additional Resources

- [Component Library](./COMPONENT_LIBRARY.md)
- [SCSS Architecture](./SCSS_ARCHITECTURE.md)
- [Migration Guide](./MIGRATION_GUIDE.md)

---

**Last Updated**: 2026-01-24
**Project**: MX Lotería Mexicana
