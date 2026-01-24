# SCSS Quick Reference - Lotería Mexicana

## 🎨 Colors

```scss
// Primary
$color-primary: #667eea;
$color-primary-light: #764ba2;

// Semantic
$color-success: #10b981;
$color-warning: #f59e0b;
$color-error: #ef4444;

// Grays
$color-gray-100 to $color-gray-900
```

## 📏 Spacing

```scss
$spacing-1: 0.25rem;  // 4px
$spacing-2: 0.5rem;   // 8px
$spacing-4: 1rem;     // 16px
$spacing-8: 2rem;     // 32px
```

## 🔤 Typography

```scss
// Sizes
$font-size-sm: 0.875rem;
$font-size-base: 1rem;
$font-size-lg: 1.125rem;
$font-size-2xl: 1.5rem;

// Weights
$font-weight-normal: 400;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

## 🔲 Border Radius

```scss
$radius-sm: 0.125rem;
$radius-lg: 0.5rem;
$radius-3xl: 1.5rem;  // Standard
$radius-full: 9999px;
```

## 💫 Shadows

```scss
@include shadow('sm');
@include shadow('md');
@include shadow('lg');
```

## 📦 Layout Mixins

```scss
@include flex-center;        // Center items
@include flex-column;        // Flex column
@include flex-between;       // Space between
@include absolute-cover;     // Cover parent
@include absolute-center;    // Absolute center
```

## 🎭 Style Mixins

```scss
@include gradient-primary;
@include gradient-secondary;
@include glass;              // Glassmorphism
@include backdrop-blur;
```

## 🎬 Animation Mixins

```scss
@include animate-float($duration, $distance);
@include animate-fade-in($duration);
@include animate-slide-up($duration, $distance);
```

## 📱 Responsive

```scss
@include responsive('sm') { /* 640px+ */ }
@include responsive('md') { /* 768px+ */ }
@include responsive('lg') { /* 1024px+ */ }
@include responsive('xl') { /* 1280px+ */ }
```

## 🔘 Button Mixins

```scss
@include button-base;
@include button-primary;
@include button-secondary;
```

## 🔧 Functions

```scss
rem(16px)           // → 1rem
spacing('4')        // → 1rem
shadow('md')        // → shadow value
```

## 📝 Import Pattern

```scss
@use 'relative/path/styles/atoms/variables' as *;
@use 'relative/path/styles/utilities/mixins' as *;
```

## 💡 Common Patterns

### Card with Shadow
```scss
.card {
  padding: $spacing-4;
  border-radius: $radius-lg;
  @include shadow('md');
}
```

### Centered Button
```scss
.btn {
  @include button-primary;
  @include flex-center;
  gap: $spacing-2;
}
```

### Gradient Background
```scss
.hero {
  @include gradient-primary;
  padding: $spacing-8;
  color: $color-white;
}
```

### Responsive Grid
```scss
.grid {
  display: grid;
  gap: $spacing-4;
  
  @include responsive('md') {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### Hover Effect
```scss
.card {
  transition: transform $transition-base;
  
  &:hover {
    transform: translateY(-4px);
    @include shadow('lg');
  }
}
```

## 🚀 Z-Index Layers

```scss
$z-base: 1;
$z-dropdown: 10;
$z-sticky: 20;
$z-modal: 50;
$z-tooltip: 70;
```

## ⚡ Transitions

```scss
$transition-fast: 150ms ease-in-out;
$transition-base: 300ms ease-in-out;
$transition-slow: 500ms ease-in-out;
```

## 🎯 BEM Nesting

```scss
.card {
  // Block
  padding: $spacing-4;
  
  &__header {
    // Element
    font-weight: $font-weight-bold;
  }
  
  &--featured {
    // Modifier
    @include shadow('xl');
  }
  
  &:hover {
    // Pseudo
    transform: scale(1.02);
  }
}
```

## 📖 File Structure

```
src/styles/
├── atoms/
│   ├── _variables.scss
│   └── _animations.scss
├── molecules/
│   ├── _card.scss
│   └── _button.scss
├── organisms/
│   ├── _tabla.scss
│   └── _role-card.scss
└── utilities/
    ├── _mixins.scss
    └── _functions.scss
```

---

**💡 Tip**: Keep this file open while developing for quick reference!
