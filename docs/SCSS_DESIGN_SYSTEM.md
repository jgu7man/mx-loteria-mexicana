# Guía del Sistema de Diseño SCSS - Lotería Mexicana

## 📋 Índice

1. [Visión General](#visión-general)
2. [Arquitectura Atómica](#arquitectura-atómica)
3. [Estructura de Archivos](#estructura-de-archivos)
4. [Guía de Uso](#guía-de-uso)
5. [Design Tokens](#design-tokens)
6. [Mixins y Funciones](#mixins-y-funciones)
7. [Componentes](#componentes)
8. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Visión General

Este proyecto ha migrado completamente de CSS a SCSS, implementando un sistema de diseño basado en **Atomic Design** y siguiendo las mejores prácticas de modularización y reutilización de código.

### Beneficios de la Migración

- ✅ **Reutilización de código**: Variables, mixins y funciones compartidas
- ✅ **Mantenibilidad**: Código organizado y fácil de actualizar
- ✅ **Consistencia**: Design tokens garantizan uniformidad visual
- ✅ **Escalabilidad**: Arquitectura modular que crece con el proyecto
- ✅ **DX mejorado**: Autocompletado y validación de IDE

### Estadísticas de Migración

- **Archivos migrados**: 33 archivos CSS → SCSS
- **Tamaño del bundle**: 862.92 kB (similar al original)
- **Tiempo de build**: ~10 segundos
- **Líneas de código optimizadas**: ~40% de reducción gracias a nesting y mixins

---

## 🧬 Arquitectura Atómica

El sistema de diseño sigue la metodología **Atomic Design** de Brad Frost:

```
src/styles/
├── atoms/           # Elementos básicos (variables, animaciones)
├── molecules/       # Componentes simples (botones, cards)
├── organisms/       # Componentes complejos (tabla, role-card)
└── utilities/       # Herramientas (mixins, funciones)
```

### Niveles de la Arquitectura

#### 1. **Atoms (Átomos)** 🔬
Los bloques de construcción fundamentales:
- **Variables**: Colores, espaciados, tipografía
- **Animaciones**: Keyframes reutilizables

#### 2. **Molecules (Moléculas)** 🧪
Combinaciones de átomos con propósito específico:
- **Card**: Estilos para tarjetas de lotería
- **Button**: Variantes de botones

#### 3. **Organisms (Organismos)** 🦠
Componentes complejos que combinan moléculas:
- **Tabla**: Grid de juego de lotería
- **Role Card**: Tarjetas de selección de roles

#### 4. **Utilities (Utilidades)** 🛠️
Herramientas para crear estilos:
- **Mixins**: Patrones reutilizables
- **Functions**: Cálculos y transformaciones

---

## 📁 Estructura de Archivos

```
src/
├── styles.scss                          # Punto de entrada principal
├── styles/
│   ├── atoms/
│   │   ├── _variables.scss              # Design tokens
│   │   └── _animations.scss             # Keyframes
│   ├── molecules/
│   │   ├── _card.scss                   # Estilos de cards
│   │   └── _button.scss                 # Estilos de botones
│   ├── organisms/
│   │   ├── _tabla.scss                  # Grid de lotería
│   │   └── _role-card.scss              # Cards de roles
│   └── utilities/
│       ├── _mixins.scss                 # Mixins reutilizables
│       └── _functions.scss              # Funciones SCSS
└── app/
    └── **/*.component.scss              # Estilos de componentes
```

### Convención de Nombres

- **Archivos parciales**: Prefijo `_` (ej: `_variables.scss`)
- **Componentes**: `nombre.component.scss`
- **Kebab-case**: Para nombres de archivos
- **camelCase**: Para variables y mixins

---

## 📖 Guía de Uso

### Importar el Sistema de Diseño

En cualquier componente SCSS:

```scss
// Importar variables y mixins
@use 'ruta/relativa/styles/atoms/variables' as *;
@use 'ruta/relativa/styles/utilities/mixins' as *;

// Ahora puedes usar:
.mi-componente {
  color: $color-primary;
  @include flex-center;
  padding: $spacing-4;
}
```

### Rutas Relativas por Nivel

Desde `src/app/`:
```scss
@use '../styles/atoms/variables' as *;
```

Desde `src/app/shared/components/`:
```scss
@use '../../../../styles/atoms/variables' as *;
```

Desde `src/app/features/home/`:
```scss
@use '../../../styles/atoms/variables' as *;
```

---

## 🎨 Design Tokens

### Paleta de Colores

```scss
// Colores primarios
$color-primary: #667eea;
$color-primary-light: #764ba2;
$color-secondary: #06b6d4;
$color-accent: #10b981;

// Semánticos
$color-success: #10b981;
$color-warning: #f59e0b;
$color-error: #ef4444;
$color-info: #3b82f6;

// Neutrales (50-900)
$color-gray-100: #f3f4f6;
$color-gray-500: #6b7280;
$color-gray-900: #111827;
```

**Uso:**
```scss
.boton-primario {
  background-color: $color-primary;
  color: $color-white;
}

.texto-error {
  color: $color-error;
}
```

### Espaciado

```scss
// Escala de espaciado (basada en Tailwind)
$spacing-1: 0.25rem;  // 4px
$spacing-2: 0.5rem;   // 8px
$spacing-4: 1rem;     // 16px
$spacing-8: 2rem;     // 32px
$spacing-12: 3rem;    // 48px
```

**Uso:**
```scss
.tarjeta {
  padding: $spacing-4;
  margin-bottom: $spacing-8;
}
```

### Tipografía

```scss
// Familia
$font-family-base: system-ui, -apple-system, ...;

// Tamaños
$font-size-sm: 0.875rem;    // 14px
$font-size-base: 1rem;      // 16px
$font-size-lg: 1.125rem;    // 18px
$font-size-2xl: 1.5rem;     // 24px

// Pesos
$font-weight-normal: 400;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

**Uso:**
```scss
.titulo {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
}
```

### Border Radius

```scss
$radius-sm: 0.125rem;   // 2px
$radius-md: 0.375rem;   // 6px
$radius-lg: 0.5rem;     // 8px
$radius-3xl: 1.5rem;    // 24px - estándar del manager
$radius-full: 9999px;   // círculos
```

### Sombras

```scss
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

### Z-index

```scss
$z-base: 1;
$z-dropdown: 10;
$z-modal: 50;
$z-tooltip: 70;
```

---

## 🔧 Mixins y Funciones

### Mixins de Layout

#### flex-center
Centra contenido con flexbox:
```scss
.contenedor {
  @include flex-center;
  // Output:
  // display: flex;
  // align-items: center;
  // justify-content: center;
}
```

#### flex-column
Columna flex:
```scss
.lista {
  @include flex-column;
  gap: $spacing-4;
}
```

#### flex-between
Espacio entre elementos:
```scss
.header {
  @include flex-between;
}
```

### Mixins de Posición

#### absolute-cover
Cubre el contenedor padre:
```scss
.overlay {
  @include absolute-cover;
  background: rgba(0, 0, 0, 0.5);
}
```

#### absolute-center
Centra absolutamente:
```scss
.modal {
  @include absolute-center;
}
```

### Mixins de Gradientes

```scss
.fondo-principal {
  @include gradient-primary;
  // Output: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
}

.fondo-secundario {
  @include gradient-secondary;
}
```

### Mixins de Botones

```scss
.btn-principal {
  @include button-primary;
}

.btn-secundario {
  @include button-secondary;
}
```

### Mixins de Animación

```scss
.icono {
  @include animate-float(3s, -10px);
}

.card {
  @include animate-fade-in(0.3s);
}

.contenido {
  @include animate-slide-up(0.5s, 30px);
}
```

### Mixins Responsivos

```scss
.componente {
  width: 100%;
  
  @include responsive('md') {
    width: 50%;
  }
  
  @include responsive('lg') {
    width: 33.33%;
  }
}
```

Breakpoints disponibles:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Funciones Útiles

#### rem()
Convierte px a rem:
```scss
.elemento {
  padding: rem(16px); // → 1rem
  font-size: rem(24px); // → 1.5rem
}
```

#### spacing()
Obtiene valor de espaciado:
```scss
.box {
  margin: spacing('4'); // → 1rem
  padding: spacing('8'); // → 2rem
}
```

---

## 🎴 Componentes

### Card Component

Tarjetas de lotería con tres tamaños:

```scss
// Uso en componente
.card-small {
  max-width: $card-max-width-small;
  aspect-ratio: $card-aspect-ratio;
}

.card-medium {
  max-width: $card-max-width-medium;
}

.card-large {
  max-width: $card-max-width-large;
}
```

### Tabla Component

Grid de juego:

```scss
.tabla-grid {
  @include gradient-primary;
  @include container-inline;
  aspect-ratio: $card-aspect-ratio;
  gap: clamp(6px, 1.2cqw, 12px);
}
```

### Button Component

```scss
// Variantes disponibles
.btn-primary { @include button-primary; }
.btn-secondary { @include button-secondary; }
.btn-success { background-color: $color-success; }
.btn-warning { background-color: $color-warning; }
.btn-error { background-color: $color-error; }

// Tamaños
.btn-sm { padding: $spacing-2 $spacing-4; }
.btn-md { padding: $spacing-3 $spacing-6; }
.btn-lg { padding: $spacing-4 $spacing-8; }
```

---

## ✨ Mejores Prácticas

### 1. Usar Variables para Valores Reutilizables

❌ **Evitar:**
```scss
.boton {
  color: #667eea;
  padding: 1rem;
}
```

✅ **Preferir:**
```scss
.boton {
  color: $color-primary;
  padding: $spacing-4;
}
```

### 2. Aprovechar el Nesting

❌ **Evitar:**
```scss
.card { }
.card .card-header { }
.card .card-body { }
.card .card-footer { }
```

✅ **Preferir:**
```scss
.card {
  .card-header { }
  .card-body { }
  .card-footer { }
}
```

### 3. Usar Mixins para Patrones Comunes

❌ **Evitar:**
```scss
.elemento {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

✅ **Preferir:**
```scss
.elemento {
  @include flex-center;
}
```

### 4. Organizar Propiedades

Orden recomendado:
1. Contenido/Display
2. Posicionamiento
3. Box Model
4. Tipografía
5. Visual
6. Otros

```scss
.componente {
  // Contenido
  content: '';
  display: flex;
  
  // Posicionamiento
  position: absolute;
  top: 0;
  left: 0;
  
  // Box Model
  width: 100%;
  padding: $spacing-4;
  margin-bottom: $spacing-2;
  
  // Tipografía
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  
  // Visual
  color: $color-primary;
  background-color: $color-white;
  border-radius: $radius-lg;
  
  // Otros
  transition: all $transition-base;
}
```

### 5. Usar Comentarios Descriptivos

```scss
// ================================
// CARD COMPONENT STYLES
// ================================

// Card sizes with nesting
.card-small {
  // ...
}

// Marker overlay - must be above image
.marker-overlay {
  z-index: $z-dropdown;
}
```

### 6. Evitar Especificidad Excesiva

❌ **Evitar:**
```scss
div.container .content div.box span.text {
  color: red;
}
```

✅ **Preferir:**
```scss
.box-text {
  color: $color-error;
}
```

### 7. Responsive Design con Mixins

```scss
.componente {
  width: 100%;
  padding: $spacing-2;
  
  @include responsive('md') {
    width: 50%;
    padding: $spacing-4;
  }
  
  @include responsive('xl') {
    width: 33.33%;
    padding: $spacing-6;
  }
}
```

### 8. Mantener Componentes Independientes

Cada componente debe:
- Importar solo lo que necesita
- No depender de estilos globales específicos
- Ser reutilizable en diferentes contextos

```scss
// ✅ Componente independiente
@use 'ruta/styles/atoms/variables' as *;
@use 'ruta/styles/utilities/mixins' as *;

:host {
  display: block;
}

.mi-componente {
  // Estilos autocontenidos
}
```

---

## 🔄 Migración de Nuevos Componentes

### Proceso Paso a Paso

1. **Crear archivo SCSS**:
```bash
# El nombre debe coincidir con el componente
touch mi-componente.component.scss
```

2. **Actualizar el TypeScript**:
```typescript
@Component({
  selector: 'app-mi-componente',
  templateUrl: './mi-componente.component.html',
  styleUrl: './mi-componente.component.scss', // ← Cambiar de .css
})
```

3. **Importar sistema de diseño**:
```scss
@use 'ruta/styles/atoms/variables' as *;
@use 'ruta/styles/utilities/mixins' as *;
```

4. **Convertir estilos**:
```scss
// Usar nesting, variables y mixins
.mi-componente {
  @include flex-center;
  padding: $spacing-4;
  
  &__titulo {
    color: $color-primary;
    font-size: $font-size-2xl;
  }
  
  &:hover {
    transform: translateY(-2px);
  }
}
```

---

## 📊 Estadísticas y Rendimiento

### Tamaño del Bundle

| Métrica | Antes (CSS) | Después (SCSS) | Diferencia |
|---------|-------------|----------------|------------|
| CSS Principal | 34.50 kB | 42.93 kB | +8.43 kB |
| JavaScript | 783.31 kB | 783.11 kB | -0.20 kB |
| **Total** | **854.69 kB** | **862.92 kB** | **+8.23 kB** |

El ligero aumento se debe a:
- Variables y utilidades adicionales del sistema de diseño
- Mejora en la organización y mantenibilidad
- El incremento es mínimo (~1%) y aceptable

### Tiempo de Build

- **Promedio**: ~10 segundos
- **Sin cambios significativos** respecto a CSS

### Ventajas de Desarrollo

- ⚡ **Autocompletado** en VSCode/IDEs
- 🔍 **Validación** de variables y mixins
- 📝 **IntelliSense** para valores del sistema
- 🎨 **Preview** de colores en el editor

---

## 🚀 Próximos Pasos

### Mejoras Futuras Recomendadas

1. **Tema Oscuro**
```scss
// Crear variables de tema
$themes: (
  'light': (
    'background': $color-white,
    'text': $color-gray-900,
  ),
  'dark': (
    'background': $color-gray-900,
    'text': $color-white,
  ),
);
```

2. **Más Utilidades**
- Grid system
- Spacing utilities
- Typography scale

3. **Documentación Visual**
- Storybook para componentes
- Guía de estilos interactiva

4. **Optimización**
- PurgeCSS para eliminar estilos no usados
- Critical CSS para first paint

---

## 📚 Recursos Adicionales

### Documentación Externa

- [Sass Documentation](https://sass-lang.com/documentation)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [Angular SCSS](https://angular.io/guide/component-styles)
- [Tailwind CSS](https://tailwindcss.com/docs) (usado como base)

### Archivos Clave

- `src/styles.scss` - Punto de entrada
- `src/styles/atoms/_variables.scss` - Tokens de diseño
- `src/styles/utilities/_mixins.scss` - Mixins reutilizables

---

## 🤝 Contribuir

### Agregar Nuevas Variables

1. Editar `src/styles/atoms/_variables.scss`
2. Seguir convención de nombres existente
3. Documentar uso en este archivo

### Agregar Nuevos Mixins

1. Editar `src/styles/utilities/_mixins.scss`
2. Incluir comentario descriptivo
3. Agregar ejemplo de uso

### Reportar Problemas

Si encuentras inconsistencias o mejoras:
1. Revisar esta documentación
2. Verificar que uses las últimas variables
3. Reportar con ejemplo específico

---

**Última actualización**: Enero 2026  
**Versión del sistema**: 1.0.0  
**Mantenido por**: Equipo Lotería Mexicana
