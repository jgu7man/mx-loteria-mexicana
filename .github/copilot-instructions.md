# Instrucciones para Agentes IA - Lotería Mexicana

## 🚫 REGLA CRÍTICA: Control de Commits

**NUNCA hagas commits automáticamente sin que el usuario lo solicite explícitamente.**

- ✅ Espera a que el usuario diga: "commit", "hacer commit", "commitea esto", etc.
- ❌ NO hagas commit automáticamente después de completar cambios
- ❌ NO asumas que debes hacer commit porque "es el siguiente paso lógico"
- ✅ Después de hacer cambios, pregunta: "¿Quieres que haga commit de estos cambios?"

## Arquitectura del Proyecto

Este es un juego de **Lotería Mexicana** en tiempo real construido con Angular 18+ y Firebase.

### Estructura de Roles

- **Manager (Gritón)**: Crea salas, canta cartas, verifica ganadores
- **Player (Jugador)**: Juega con su tabla, marca cartas, canta lotería
- **Viewer (Espectador)**: Observa sin participar, tiene vista limitada según dificultad

### Stack Técnico

- **Frontend**: Angular 18+ (standalone components, signals)
- **Backend**: Firebase (Firestore, Auth, Hosting)
- **Styling**: Tailwind CSS
- **State Management**: Signals + Services

## Convenciones de Código

### Nomenclatura de Archivos

- **kebab-case** para nombres de archivos: `manager-dashboard.component.ts`
- **index.ts** para re-exportación de módulos
- Scripts como archivos `.ts` (no `.js`)
- Mantener mayúsculas en archivos estándar: `README.md`, `LICENSE`

### Componentes Angular

- **Standalone components** siempre (no NgModules)
- **Signals** para state reactivo (no Observables cuando sea posible)
- **Computed signals** para valores derivados
- **Effects** para side effects reactivos

Ejemplo:

```typescript
room = signal<Room | null>(null);
isActive = computed(() => this.room()?.state === "active");
```

### Servicios

- Inyección con `inject()` en lugar de constructor
- Signals para exponer estado reactivo
- Métodos async con try-catch y manejo de errores via AlertService

### Estilos

- **Tailwind classes** inline en templates
- **rounded-3xl** para border-radius (estandarizado en manager)
- Gradientes: `bg-gradient-to-br from-blue-600 via-teal-500 to-green-600`
- Responsive: mobile-first con breakpoints `md:` y `xl:`

### Firebase

- Realtime listeners con `onSnapshot` para datos en vivo
- Unsubscribe en `ngOnDestroy` o `effect(onCleanup => ...)`
- Path structure: `rooms/{roomId}`, `participants/{roomId}/list/{uid}`

## Estructura de Datos Clave

### Room

```typescript
{
  id: string;
  name: string;
  managerId: string;
  state: 'waiting' | 'active' | 'finished';
  deck: number[]; // IDs de cartas barajadas
  currentIndex: number; // Carta actual
  currentRound: number;
  currentRoundWinners: string[]; // UIDs pendientes de verificación
  currentRoundVerifiedWinners: RoundWinner[];
}
```

### Flujo de Verificación de Ganadores

1. Jugador canta "¡Lotería!" → su UID se agrega a `currentRoundWinners`
2. Manager revisa tabla en modal → aprueba o rechaza
3. Si aprueba: se mueve a `currentRoundVerifiedWinners`
4. Si no quedan pendientes: modal automático pregunta "¿Terminar ronda?"

## Workflows Importantes

### Desarrollo

```bash
npm start  # Corre en http://localhost:4200
```

### Firebase Deploy

```bash
npm run build
firebase deploy
```

### Estructura de Features

```
features/
  ├── home/           # Landing page con selección de rol
  ├── manager/        # Panel del gritón
  │   └── manager-dashboard/
  │       ├── components/
  │       │   ├── manager-game-panel/
  │       │   ├── manager-review-modal/  # Verificación de ganadores
  │       │   └── manager-room-list/
  │       └── services/
  │           └── manager-game-state.service.ts  # State compartido
  ├── player/         # Vista de jugador
  └── viewer/         # Vista de espectador
```

## Patrones Específicos del Proyecto

### Multi-Modal Pattern

Se usan múltiples modales independientes controlados por signals:

```typescript
showFinishRoundModal = signal<boolean>(false);
isReviewModalOpen = computed(() => this.reviewingParticipant() !== null);
```

### Background Decoration Pattern

El home tiene cartas de fondo decorativas con:

- Sistema de 9 zonas para distribución uniforme
- Posiciones: -10% a 100% (permiten overflow)
- Animaciones `floatBackground` con blur

### Card Data

54 cartas en `game-data.ts` con estructura:

```typescript
{
  id: number;
  name: string;
  emoji: string;
  verso: string; // Verso moderno (no tradicional)
  color: string;
  image: string;
}
```

## Consideraciones Importantes

1. **Versos Modernos**: El proyecto usa versos modernos de la lotería, NO los tradicionales
2. **LocalStorage**: Se usa para persistir `activeManagerRoom` entre recargas
3. **Real-time**: Los participantes se actualizan en tiempo real via Firebase listeners
4. **Z-index Layers**: Modales usan `z-50`, review modal puede tener conflictos si hay múltiples
5. **Responsive Grid**: Manager panel usa `grid-cols-1 md:grid-cols-12` con orden responsive

## Testing & Debug

- No hay tests configurados actualmente
- Debug con Chrome DevTools + Angular DevTools
- Firebase Emulator no configurado (usa producción)
