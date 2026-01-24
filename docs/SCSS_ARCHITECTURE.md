# SCSS Architecture Documentation
## MX Lotería Mexicana

### 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture Structure](#architecture-structure)
3. [Design System](#design-system)
4. [Migration Summary](#migration-summary)
5. [Best Practices](#best-practices)
6. [Usage Examples](#usage-examples)

---

## Overview

This project has been migrated from CSS to SCSS following **Atomic Design principles** and modern front-end architecture patterns. The SCSS implementation provides:

- **Modular Architecture**: Organized folder structure following atomic design
- **Design System**: Comprehensive variables for colors, typography, spacing, and more
- **Reusable Mixins**: 20+ mixins for common patterns (responsive, animations, layouts)
- **Maintainability**: Easy to update and scale with consistent patterns
- **Type Safety**: SCSS compilation catches errors at build time

---

## Architecture Structure

The SCSS architecture follows the **7-1 Pattern** adapted for our needs:

```
src/styles/
├── abstracts/          # Variables, mixins, functions (no CSS output)
│   ├── _variables.scss # Design system tokens
│   ├── _mixins.scss    # Reusable style patterns
│   ├── _functions.scss # SCSS utility functions
│   └── _index.scss     # Abstracts barrel file
├── base/              # Base styles and resets
│   ├── _reset.scss    # Minimal CSS reset
│   ├── _typography.scss # Typography styles
│   └── _index.scss    # Base barrel file
├── components/        # Component-specific shared styles
│   ├── _card.scss     # Card component styles
│   ├── _tabla.scss    # Tabla (board) styles
│   ├── _marker.scss   # Marker component styles
│   └── _index.scss    # Components barrel file
├── layout/            # Layout-specific styles (reserved)
├── themes/            # Theme definitions (reserved)
└── utilities/         # Helper classes
    ├── _helpers.scss  # Utility classes
    └── _index.scss    # Utilities barrel file
```

### Import Order in styles.scss

```scss
// 1. Abstracts (variables, mixins, functions)
@import './styles/abstracts/index';

// 2. Base styles
@import './styles/base/index';

// 3. Component styles
@import './styles/components/index';

// 4. Utilities
@import './styles/utilities/index';

// 5. Tailwind CSS
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Design System

### Color Palette

#### Primary Colors
```scss
$color-primary: #667eea;          // Main brand color
$color-primary-light: #7c8ff0;    // Lighter variant
$color-primary-dark: #5568d3;     // Darker variant
$color-secondary: #764ba2;        // Secondary brand color
$color-secondary-light: #8a5fb8;  // Lighter variant
$color-secondary-dark: #5f3982;   // Darker variant
```

#### Accent Colors
```scss
$color-accent-green: #10b981;     // Success/accent color
$color-accent-green-light: rgba(16, 185, 129, 0.5);
```

#### Gradients
```scss
$gradient-primary: linear-gradient(135deg, $color-primary 0%, $color-secondary 100%);
$gradient-shine: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
```

### Typography

```scss
// Font Family
$font-family-base: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...;

// Font Sizes
$font-size-xs: 0.55rem;   // 8.8px
$font-size-sm: 0.7rem;    // 11.2px
$font-size-base: 1rem;    // 16px
$font-size-lg: 1.2rem;    // 19.2px
$font-size-xl: 1.5rem;    // 24px
$font-size-2xl: 2rem;     // 32px
$font-size-3xl: 3rem;     // 48px
$font-size-4xl: 4rem;     // 64px
$font-size-5xl: 5rem;     // 80px

// Font Weights
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Spacing

Based on 4px grid system:

```scss
$spacing-1: 0.25rem;   // 4px
$spacing-2: 0.5rem;    // 8px
$spacing-3: 0.75rem;   // 12px
$spacing-4: 1rem;      // 16px
$spacing-5: 1.25rem;   // 20px
$spacing-6: 1.5rem;    // 24px
$spacing-8: 2rem;      // 32px
$spacing-10: 2.5rem;   // 40px
$spacing-12: 3rem;     // 48px
$spacing-16: 4rem;     // 64px
```

### Breakpoints

```scss
$breakpoint-xs: 320px;   // Mobile small
$breakpoint-sm: 500px;   // Mobile
$breakpoint-md: 768px;   // Tablet
$breakpoint-lg: 1024px;  // Desktop
$breakpoint-xl: 1200px;  // Large desktop
$breakpoint-2xl: 1536px; // Extra large
```

### Border Radius

```scss
$border-radius-sm: 0.25rem;  // 4px
$border-radius-base: 0.5rem; // 8px
$border-radius-md: 0.75rem;  // 12px
$border-radius-lg: 1rem;     // 16px
$border-radius-xl: 1.5rem;   // 24px
$border-radius-full: 9999px; // Fully rounded
```

---

## Migration Summary

### Files Migrated

**Total: 18 CSS files converted to SCSS**

#### Shared Components (4 files)
- ✅ `card.component.css` → `card.component.scss`
- ✅ `marker.component.css` → `marker.component.scss`
- ✅ `podium.component.css` → `podium.component.scss`
- ✅ `tabla.component.css` → `tabla.component.scss`

#### Feature Components (14 files)
- ✅ `app.component.css` → `app.component.scss`
- ✅ `home.component.css` → `home.component.scss`
- ✅ Manager Dashboard (4 components)
- ✅ Player Game (4 components)
- ✅ Viewer (3 components)
- ✅ Invite Display (1 component)

### Key Improvements

1. **Design System Integration**
   - All hardcoded values replaced with variables
   - Consistent color palette throughout
   - Unified spacing system

2. **Code Reduction**
   - Eliminated duplicate media queries
   - Consolidated repeated patterns into mixins
   - Removed redundant keyframe animations

3. **Better Organization**
   - Clear separation of concerns
   - Atomic design structure
   - Easy to find and modify styles

4. **Enhanced Maintainability**
   - Single source of truth for design tokens
   - Reusable mixins reduce code duplication
   - SCSS nesting improves readability

---

## Best Practices

### 1. Using Variables

❌ **Before (CSS)**
```css
.card {
  background: #667eea;
  border-radius: 0.5rem;
  padding: 1rem;
}
```

✅ **After (SCSS)**
```scss
.card {
  background: $color-primary;
  border-radius: $border-radius-base;
  padding: $spacing-4;
}
```

### 2. Responsive Design with Mixins

❌ **Before (CSS)**
```css
.card-container {
  width: 38vw;
}

@media screen and (min-width: 500px) {
  .card-container {
    width: 20vw;
  }
}

@media screen and (min-width: 1200px) {
  .card-container {
    width: 15vw;
  }
}
```

✅ **After (SCSS)**
```scss
.card-container {
  width: $card-container-mobile;

  @include respond-to(sm) {
    width: $card-container-tablet;
  }

  @include respond-to(xl) {
    width: $card-container-desktop;
  }
}
```

### 3. Animations with Mixins

❌ **Before (CSS)**
```css
.icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

✅ **After (SCSS)**
```scss
.icon {
  @include float-animation;
}
```

### 4. Component Styling

Always import abstracts at the top of component SCSS files:

```scss
// Import design system
@import 'styles/abstracts/index';

// Component-specific styles
.my-component {
  background: $color-primary;
  padding: $spacing-4;
  
  @include respond-to(md) {
    padding: $spacing-6;
  }
}
```

---

## Usage Examples

### Responsive Card Component

```scss
@import 'styles/abstracts/index';

.card {
  @include card-container($card-container-mobile);
  background: $gradient-primary;
  border-radius: $border-radius-lg;
  padding: $spacing-4;
  @include transition(transform, box-shadow);

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
  }

  @include respond-to(md) {
    padding: $spacing-6;
  }

  @include respond-to(xl) {
    width: $card-container-desktop;
  }
}
```

### Animated Button

```scss
@import 'styles/abstracts/index';

.button {
  background: $color-primary;
  color: $color-white;
  padding: $spacing-3 $spacing-6;
  border-radius: $border-radius-base;
  @include transition(background, transform);

  &:hover {
    background: $color-primary-dark;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}
```

### Flex Container

```scss
@import 'styles/abstracts/index';

.container {
  @include flex-center;
  gap: $spacing-4;
  padding: $spacing-6;

  @include respond-to(md) {
    gap: $spacing-6;
    padding: $spacing-8;
  }
}
```

### Grid Layout

```scss
@import 'styles/abstracts/index';

.grid {
  @include grid-layout(2, $spacing-4);

  @include respond-to(md) {
    @include grid-layout(3, $spacing-6);
  }

  @include respond-to(xl) {
    @include grid-layout(4, $spacing-8);
  }
}
```

---

## Build Configuration

The project uses Angular's built-in SCSS support. Key configuration in `angular.json`:

```json
{
  "stylePreprocessorOptions": {
    "includePaths": ["src"]
  },
  "styles": ["src/styles.scss"]
}
```

This allows importing styles with clean paths:
```scss
@import 'styles/abstracts/index';  // Instead of '../../../styles/abstracts/index'
```

---

## Performance

### Bundle Size Comparison

- **Before (CSS)**: 31.86 kB
- **After (SCSS)**: 39.17 kB (+7.31 kB or +23%)

The slight increase is due to:
- Comprehensive design system
- Additional utility classes
- Better organized, more maintainable code

### Build Time

- No significant impact on build time
- SCSS compilation is highly optimized in Angular

---

## Future Enhancements

1. **Themes Support**
   - Add dark mode theme
   - Custom color themes for different events

2. **Layout System**
   - Add layout templates
   - Grid system utilities

3. **Component Library**
   - Expand shared component styles
   - Create style guide page

4. **CSS-in-JS Migration**
   - Consider CSS Modules for better encapsulation
   - Explore Angular's new styling features

---

## Resources

- [SCSS Documentation](https://sass-lang.com/documentation)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [7-1 Pattern](https://sass-guidelin.es/#the-7-1-pattern)
- [BEM Methodology](http://getbem.com/)

---

**Last Updated**: 2026-01-24
**Author**: GitHub Copilot
**Project**: MX Lotería Mexicana
