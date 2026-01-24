# 🎯 Feature Map - Lotería Mexicana

**Fecha:** 25 de enero de 2026  
**Proyecto:** Lotería Mexicana  
**Propósito:** Catálogo completo de features agrupadas por épicas

---

## 📋 Índice de Épicas

1. [Autenticación y Acceso](#1-autenticación-y-acceso)
2. [Gestión de Salas](#2-gestión-de-salas)
3. [Roles y Permisos](#3-roles-y-permisos)
4. [Invitaciones y Compartir](#4-invitaciones-y-compartir)
5. [Participantes](#5-participantes)
6. [Gameplay y Lógica](#6-gameplay-y-lógica)
7. [UI/UX Core](#7-uiux-core)
8. [Notificaciones y Feedback](#8-notificaciones-y-feedback)
9. [Visualización de Datos](#9-visualización-de-datos)
10. [Responsive Design](#10-responsive-design)
11. [Configuración y Personalización](#11-configuración-y-personalización)
12. [Seguridad y Validación](#12-seguridad-y-validación)

---

## 1. Autenticación y Acceso

### 🔐 Sign In con Google

**Descripción:** Autenticación mediante cuenta de Google  
**Características:**

- Popup de autenticación nativa de Google
- Obtiene automáticamente displayName y photoURL
- Persistencia de sesión
- Cierre de sesión disponible
- Reautenticación automática al recargar

### 👤 Sign In Anónimo

**Descripción:** Jugar sin cuenta de Google  
**Características:**

- Requiere displayName personalizado
- Validación de longitud de nombre (2-20 caracteres)
- Sin photoURL (usa avatar placeholder)
- Sesión temporal (se pierde al cerrar navegador)
- Ideal para juegos casuales

### 🚪 Landing Page con Selección de Rol

**Descripción:** Pantalla inicial para elegir modo de participación  
**Características:**

- 3 opciones claramente diferenciadas
- Diseño visual atractivo con gradientes
- Descripción de cada rol
- Navegación directa sin autenticación previa
- Responsive en todos los dispositivos

---

## 2. Gestión de Salas

### ➕ Crear Sala

**Descripción:** Iniciar nueva partida  
**Características:**

- Requiere autenticación
- Configuración personalizable
- Generación automática de ID único
- Almacenamiento en Firestore
- Asignación automática de creador como manager

**Configuración:**

- Nombre de la sala
- Número de rondas (1-10)
- Dificultad (Fácil/Medio/Difícil)

### 📋 Listar Salas

**Descripción:** Ver todas las salas creadas por el usuario  
**Características:**

- Filtradas por managerId del usuario actual
- Muestra nombre, estado y fecha de creación
- Navegación directa a sala específica
- Indicadores visuales de estado (waiting/active/finished)
- Botón para crear nueva sala

### 🔍 Buscar Sala por Código

**Descripción:** Unirse usando código único  
**Características:**

- Input para código de sala
- Validación en tiempo real
- Feedback si el código no existe
- Redirección automática al encontrar
- Case insensitive en búsqueda

### ⏹️ Finalizar Sala

**Descripción:** Terminar sala actual  
**Características:**

- Solo el manager puede ejecutar
- Cambio de estado a "finished"
- Mantiene datos históricos
- Notificación a todos los participantes
- Irreversible (requiere confirmación)

### 🗑️ Eliminar Sala

**Descripción:** Borrar sala completamente  
**Características:**

- Solo el manager puede ejecutar
- Confirmación con SweetAlert
- Elimina sala y todos sus participantes
- Redirección automática al dashboard
- Irreversible (advertencia clara)

---

## 3. Roles y Permisos

### 🎯 Rol: Manager

**Descripción:** Creador y controlador de la sala  
**Permisos:**

- Crear sala
- Configurar parámetros
- Iniciar rondas
- Cantar cartas
- Verificar ganadores
- Ver todos los participantes
- Expulsar participantes
- Compartir invitaciones
- Acceso a dashboard completo

**UI Específica:**

- Panel de control con botones de acción
- Vista de carta actual con verso
- Modal de verificación de ganadores
- Herramientas de gestión de participantes
- Historial de cartas cantadas

### 🎮 Rol: Player

**Descripción:** Jugador activo de la partida  
**Permisos:**

- Unirse a sala
- Seleccionar marcador y tabla
- Marcar cartas en su tabla
- Cantar "¡LOTERÍA!"
- Ver información de sesión
- Abandonar sala

**UI Específica:**

- Selector de marcador (🫘 🌽 🪙)
- Selector de tabla (10 opciones)
- Tabla 4x4 interactiva
- Vista de carta actual
- Botón "¡LOTERÍA!"
- Header con información de ronda
- Podio de ganadores

### 👁️ Rol: Viewer

**Descripción:** Observador sin participación activa  
**Permisos:**

- Ver sala en tiempo real
- Ver información limitada según dificultad
- No puede interactuar
- No aparece en lista de participantes

**UI Específica:**

- Vista simplificada de juego
- Carta actual visible
- Historial limitado (Fácil: 5, Medio: 2, Difícil: 1)
- Sin controles interactivos

---

## 4. Invitaciones y Compartir

### 🔗 Compartir Link

**Descripción:** Copiar URL de invitación al portapapeles  
**Características:**

- Botón visible en dashboard del manager
- Copia URL completa con ID de sala
- Usa Clipboard API nativa
- Feedback visual de éxito/error con SweetAlert
- Funciona en mobile y desktop
- Link directo a página de unirse

### 📱 Generar QR Code

**Descripción:** Código QR escaneabl para unirse  
**Características:**

- Generación dinámica con API pública
- Modal con QR de 300x300px
- Incluye link debajo del QR
- Perfecto para compartir en persona
- No requiere tipear código
- Responsive en modal

### 🎫 Código de Sala

**Descripción:** ID alfanumérico para unirse  
**Características:**

- Generado automáticamente por Firestore
- Visible en dashboard del manager
- Copiable con un click
- Case insensitive para búsqueda
- Longitud corta (8-10 caracteres)

### 🖼️ Página de Invitación

**Descripción:** Página `/invite/:roomId` con información  
**Características:**

- Muestra nombre de la sala
- Botón grande "Unirse"
- Información del manager
- Estado de la sala
- Redirección automática si ya autenticado

---

## 5. Participantes

### ➕ Unirse como Jugador

**Descripción:** Registrarse en sala activa  
**Características:**

- Requiere código de sala
- Autenticación requerida (Google o Anónima)
- Selección de marcador y tabla
- Creación automática de documento en Firestore
- Asignación de timestamp de ingreso
- Notificación en tiempo real a manager

### 📋 Lista de Participantes

**Descripción:** Ver quién está en la sala  
**Características:**

- Actualización en tiempo real
- Muestra displayName y photoURL
- Muestra marcador elegido (emoji)
- Muestra número de tabla
- Indicador de cartas marcadas
- Timestamp de ingreso
- Contador total de participantes

### 🚪 Abandonar Sala

**Descripción:** Salir de la sala voluntariamente  
**Características:**

- Botón visible en header de jugador
- Confirmación antes de salir
- Elimina documento de participante
- Notificación a manager en tiempo real
- Redirección automática al home
- No afecta datos de sala principal

### 🗑️ Expulsar Jugador

**Descripción:** Manager puede remover jugadores  
**Características:**

- Solo accesible por manager
- Confirmación antes de ejecutar
- Elimina participante de Firestore
- Jugador ve mensaje de expulsión
- Redirección automática del expulsado
- Útil para participantes disruptivos

### 👥 Contador de Participantes

**Descripción:** Número total visible  
**Características:**

- Actualización en tiempo real
- Visible para todos los roles
- Ubicación prominente en UI
- Indicador visual en dashboard del manager

---

## 6. Gameplay y Lógica

### 🎲 Sistema de Cartas

**Descripción:** 54 cartas únicas con datos completos  
**Características:**

- Emoji visual para cada carta
- Nombre tradicional mexicano
- Verso poético moderno
- Color único y consistente
- Sin duplicados en mazo
- Datos inmutables en `game-data.ts`

### 🃏 Barajado de Mazo

**Descripción:** Aleatorizar orden de cartas  
**Características:**

- Algoritmo Fisher-Yates
- Ejecutado al iniciar ronda
- Garantiza orden impredecible
- Cada ronda con orden diferente
- No se repiten cartas en una ronda

### 📊 Generación de Tablas

**Descripción:** Crear tablas 4x4 para jugadores  
**Características:**

- 16 cartas aleatorias por tabla
- Sin duplicados en misma tabla
- 10 tablas predefinidas diferentes
- Jugador puede elegir su tabla
- Tablas guardan posiciones fijas

### 🔄 Avanzar Carta

**Descripción:** Cantar siguiente carta del mazo  
**Características:**

- Solo manager puede ejecutar
- Incrementa currentIndex en room
- Carta se muestra a todos en tiempo real
- Muestra nombre, emoji, verso y color
- Registro en historial automático

### 🏁 Iniciar Ronda

**Descripción:** Comenzar juego con mazo barajado  
**Características:**

- Solo manager puede ejecutar
- Baraja automáticamente el mazo
- Resetea currentIndex a 0
- Limpia ganadores de ronda anterior
- Cambia estado a "active"
- Notificación visual a jugadores

### ✅ Marcar Carta

**Descripción:** Jugador marca carta en su tabla  
**Características:**

- Click en carta de tabla propia
- Guarda ID de carta + emoji de marcador
- Actualización inmediata visual
- Persistencia en Firestore
- Validación: solo cartas cantadas
- Toggle (marcar/desmarcar)

### 🎊 Cantar Lotería

**Descripción:** Jugador declara victoria  
**Características:**

- Botón "¡LOTERÍA!" visible
- Agrega UID a currentRoundWinners
- Notificación inmediata a manager
- Desactiva botón hasta verificación
- Modal de espera para jugador

### ✔️ Verificar Ganador

**Descripción:** Manager valida victoria del jugador  
**Características:**

- Modal con tabla del jugador
- Muestra cartas marcadas vs cantadas
- Asistencia visual automática
- Botón Aprobar / Rechazar
- Si aprueba: mueve a verifiedWinners
- Si rechaza: regresa a lista de pendientes
- Múltiples ganadores permitidos

### 🏆 Finalizar Ronda

**Descripción:** Cerrar ronda actual y mostrar ganadores  
**Características:**

- Solo manager puede ejecutar
- Cambia estado a "waiting"
- Guarda winners en historial
- Incrementa currentRound
- Resetea markers de jugadores
- Muestra podio automáticamente

---

## 7. UI/UX Core

### 🎨 Design System

**Descripción:** Paleta de colores y estilos consistentes  
**Características:**

- Gradientes únicos por rol/sección
- Colores consistentes en todo el proyecto
- SCSS con estructura atomic (atoms/molecules/organisms)
- Tailwind CSS utilities extendidas
- Hover effects en elementos interactivos
- Animaciones suaves (transitions)
- Border radius consistente (rounded-3xl)

**Paleta de Colores:**

- Home: Gradiente púrpura-rosa-rojo
- Manager: Gradiente índigo-púrpura
- Player: Gradiente verde-teal
- Viewer: Gradiente amarillo-naranja

### 🎯 Selector de Marcador

**Descripción:** Elegir emoji para marcar cartas  
**Características:**

- 3 opciones disponibles: 🫘 Frijol, 🌽 Maíz, 🪙 Moneda
- Visualización grande del emoji
- Click para seleccionar
- Indicador visual de selección
- Guardado en perfil de participante
- Usado en tabla de juego

### 📋 Selector de Tabla

**Descripción:** Elegir tabla predefinida para jugar  
**Características:**

- 10 tablas diferentes disponibles
- Vista previa de cartas en miniatura
- Scroll horizontal para navegar
- Click para seleccionar
- Validación: solo una por jugador
- Guardada en perfil de participante

### 🃏 Card Component

**Descripción:** Componente visual de carta individual  
**Características:**

- Emoji grande centrado
- Nombre de carta
- Color de fondo único por carta
- Hover effect con elevación
- Verso moderno (opcional)
- Reutilizable en múltiples contextos

### 📱 Header del Jugador

**Descripción:** Barra superior con datos clave  
**Características:**

- Siempre visible (sticky position)
- ID de sala visible
- Ronda actual / total de rondas
- Botón "Abandonar" integrado
- Responsive en todos los tamaños
- Información actualizada en tiempo real

### 🏆 Podio de Ganadores

**Descripción:** Celebración visual de ganadores  
**Características:**

- Pantalla completa con overlay
- Rankings con medallas (🥇🥈🥉)
- Nombres de ganadores destacados
- Información de tabla y marcas
- Estilos diferenciados para top 3
- Mensaje especial para ronda final
- Animaciones de celebración
- Responsive en todos los dispositivos
- Transición automática al completar ronda

### 📝 Formularios

**Descripción:** Inputs para datos de usuario y configuración  
**Características:**

- Validación en tiempo real
- Mensajes de error claros
- Placeholders descriptivos
- Auto-focus en primer campo
- Enter para submit
- Disabled states visuales
- Loading states durante submit

---

## 8. Notificaciones y Feedback

### ✅ Alertas de Éxito

**Descripción:** Confirmaciones de acciones completadas  
**Características:**

- SweetAlert2 para alerts modales
- Mensaje claro y conciso
- Icono de check verde
- Auto-dismiss después de 2-3 segundos
- Posición no intrusiva
- No bloquea interacción

**Ejemplos:**

- "Link copiado al portapapeles"
- "Sala creada exitosamente"
- "Jugador expulsado"
- "Ronda finalizada"

### ❌ Alertas de Error

**Descripción:** Notificación de problemas o fallos  
**Características:**

- SweetAlert2 para modales de error
- Mensaje descriptivo del problema
- Icono de error rojo
- Botón "OK" o "Cerrar"
- Sugerencia de solución cuando aplique
- No auto-dismiss (requiere confirmación)

**Ejemplos:**

- "Código de sala no encontrado"
- "Error al copiar al portapapeles"
- "Debes autenticarte primero"
- "No tienes permisos para esta acción"

### ⚠️ Confirmaciones

**Descripción:** Prevenir acciones destructivas accidentales  
**Características:**

- Modal con pregunta clara (SweetAlert)
- Botones "Confirmar" y "Cancelar"
- Advertencia del impacto
- Color distintivo (amarillo/naranja)
- Requiere acción explícita del usuario
- Botón principal en acción segura

**Ejemplos:**

- "¿Eliminar sala permanentemente?"
- "¿Expulsar a este jugador?"
- "¿Abandonar la partida?"
- "¿Finalizar sala?"

### 🔔 Notificaciones en Tiempo Real

**Descripción:** Updates instantáneos de cambios  
**Características:**

- Vía Firestore listeners (onSnapshot)
- Sin necesidad de refresh manual
- Actualizaciones suaves sin flicker
- Bajo consumo de recursos
- Desuscripción automática al salir (ngOnDestroy)

**Ejemplos:**

- Nuevo participante se une
- Carta nueva cantada
- Estado de sala cambia
- Ganador verificado
- Jugador marca/desmarca carta

### ⏳ Estados de Loading

**Descripción:** Indicadores de procesos en curso  
**Características:**

- Spinners personalizados
- Texto descriptivo de acción
- Deshabilita controles durante carga
- Timeout para error si tarda mucho
- Previene double-submit

**Contextos:**

- Autenticación en proceso
- Creando sala
- Cargando participantes
- Verificando ganador
- Barajando mazo

---

## 9. Visualización de Datos

### 📜 Historial de Cartas

**Descripción:** Ver cartas cantadas en ronda actual  
**Características:**

- Modal scrolleable
- Orden cronológico inverso (recientes primero)
- Muestra emoji, nombre y color de cada carta
- Accesible en cualquier momento desde botón del manager
- Solo cartas de ronda actual
- Se limpia automáticamente al iniciar nueva ronda

### 👁️ Vista Limitada para Viewer

**Descripción:** Historial restringido según dificultad  
**Características:**

- Dificultad Fácil: Últimas 5 cartas
- Dificultad Media: Últimas 2 cartas
- Dificultad Difícil: Solo carta actual
- Añade desafío estratégico al juego
- Actualización automática en tiempo real

### 📊 Información de Sala

**Descripción:** Datos clave visibles todo el tiempo  
**Características:**

- Nombre de sala
- Código único de sala
- Estado actual (waiting/active/finished)
- Número de participantes
- Ronda actual / total de rondas
- Timestamp de creación
- Configuración de dificultad

### 🏅 Ranking en Podio

**Descripción:** Clasificación de ganadores de la ronda  
**Características:**

- Ordenado por posición de victoria
- Muestra displayName del ganador
- Indicador de posición (1°, 2°, 3°)
- Medallas visuales (🥇🥈🥉)
- Destacado visual para top 3
- Información de tabla usada
- Visible al finalizar cada ronda

### 📈 Historial de Rondas

**Descripción:** Registro de rondas completadas  
**Características:**

- Número de ronda
- Lista de ganadores verificados
- Timestamp de finalización
- Accesible en room data
- Útil para estadísticas futuras
- Persistido en Firestore

---

## 10. Responsive Design

### 📱 Mobile First

**Descripción:** Diseño optimizado para móviles  
**Características:**

- Layouts verticales en mobile
- Botones grandes (min 44x44px)
- Texto legible (min 16px)
- Touch targets espaciados
- Sin hover dependencies
- Gestures táctiles
- Tabla 4x4 optimizada para pantallas pequeñas

### 💻 Desktop Optimization

**Descripción:** Aprovechar espacio en pantallas grandes  
**Características:**

- Layouts multi-columna en manager dashboard
- Sidebars con información extra
- Hover effects enriquecidos en cartas
- Tooltips informativos
- Mayor densidad de información
- Manager dashboard grid de 12 columnas

### 📐 Breakpoints Consistentes

**Descripción:** Puntos de cambio de layout  
**Características:**

- sm: 640px (móvil grande)
- md: 768px (tablet)
- lg: 1024px (laptop)
- xl: 1280px (desktop)
- Transiciones suaves entre breakpoints con Tailwind

### 🔄 Grid Responsivo

**Descripción:** Grids que se adaptan al tamaño  
**Características:**

- Mobile: 1 columna
- Tablet: 2 columnas (md:)
- Desktop: Hasta 12 columnas (xl:)
- Gap consistente
- Auto-fit para contenido variable
- Manager panel usa grid-cols-1 md:grid-cols-12

---

## 11. Configuración y Personalización

### ⚙️ Configuración de Sala

**Descripción:** Parámetros ajustables al crear  
**Opciones:**

- **Número de Rondas**: 1-10 rondas
- **Dificultad**: Fácil/Medio/Difícil (afecta vista de viewer)
- **Nombre de Sala**: Texto personalizable

**Características:**

- Formulario en modal de creación
- Validación de campos requeridos
- Preview de configuración antes de crear
- Configuración inmutable después de crear

### 🎨 Personalización de Jugador

**Descripción:** Datos personales del participante  
**Características:**

- DisplayName (de Google o anónimo)
- PhotoURL de Google (si aplica)
- Avatar placeholder si es anónimo
- Selección de marcador (🫘 🌽 🪙)
- Selección de tabla (1-10)
- Actualización en tiempo real en lista de participantes

### 🔧 Métodos de Autenticación

**Descripción:** Opciones de login habilitadas  
**Características:**

- Google Sign-In disponible
- Anonymous Sign-In disponible
- Ambos métodos funcionan en paralelo
- DisplayName requerido para anónimos
- Persistencia de sesión

---

## 12. Seguridad y Validación

### 🔒 Firestore Security Rules

**Descripción:** Reglas de acceso a base de datos  
**Características:**

- Autenticación requerida para writes
- Validación de ownership (managerId)
- Subcollection de participantes protegida
- Read público para salas (permite viewer)
- Prevención de escalación de privilegios
- Solo manager puede actualizar estado de sala

### ✔️ Validación de Inputs

**Descripción:** Verificación de datos del usuario  
**Características:**

- Longitud mínima/máxima de displayName (2-20)
- Caracteres permitidos en nombre de sala
- Validación de código de sala
- Números en rangos válidos (rondas: 1-10)
- Sanitización de strings
- Feedback inmediato visual con mensajes

### 🛡️ Guards de Rutas

**Descripción:** Protección de rutas sensibles  
**Características:**

- authGuard: Requiere usuario autenticado
- managerGuard: Valida que sea el manager de la sala
- Redirección automática al home si no cumple
- Previene acceso no autorizado a dashboards
- Verificación en cada navegación

### 🔐 Almacenamiento Seguro

**Descripción:** Manejo de datos sensibles  
**Características:**

- Environment files en .gitignore
- Firebase config en environment.ts (no commiteado)
- Secrets en variables de entorno
- LocalStorage solo para activeManagerRoom
- No datos sensibles en localStorage

### ⚡ Prevención de Abuso

**Descripción:** Rate limiting y validaciones  
**Características:**

- Firestore throttling automático
- Límite de writes por segundo
- Deshabilitar botones después de submit
- Cooldowns en acciones críticas (cantar lotería)
- Validación de cartas cantadas antes de marcar

---

## 📊 Resumen

**Total Features:** 52  
**Épicas:** 12  
**Última actualización:** 25 de enero de 2026

### Distribución por Épica

| Épica                               | Features          |
| ----------------------------------- | ----------------- |
| 1. Autenticación y Acceso           | 3                 |
| 2. Gestión de Salas                 | 5                 |
| 3. Roles y Permisos                 | 3 roles completos |
| 4. Invitaciones y Compartir         | 4                 |
| 5. Participantes                    | 5                 |
| 6. Gameplay y Lógica                | 9                 |
| 7. UI/UX Core                       | 7 componentes     |
| 8. Notificaciones y Feedback        | 5 tipos           |
| 9. Visualización de Datos           | 5                 |
| 10. Responsive Design               | 4                 |
| 11. Configuración y Personalización | 3                 |
| 12. Seguridad y Validación          | 5                 |

### Features Únicas de Lotería

- ✅ Sistema de 54 cartas con emojis
- ✅ Tablas 4x4 personalizables (10 opciones)
- ✅ Marcadores con emojis (🫘 🌽 🪙)
- ✅ Verificación de ganadores asistida
- ✅ Vista limitada por dificultad
- ✅ Podio de ganadores animado
- ✅ Historial de cartas cantadas
- ✅ Rol de viewer/espectador
- ✅ Sistema de rondas múltiples
- ✅ Barajado de mazo (Fisher-Yates)

---
