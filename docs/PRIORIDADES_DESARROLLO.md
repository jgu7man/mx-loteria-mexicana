# Prioridades de Desarrollo - Lotería Mexicana

Este documento organiza los pendientes reportados tras las pruebas de juego, priorizados por impacto en la experiencia y funcionalidad.

---

## 🟥 Prioridad P0: Críticos y Bloqueantes

_Errores que afectan el flujo principal o impiden el acceso a usuarios._

1.  **Solucionar Botón de Cambio de Dificultad**:
    - **Problema**: El evento `changeDifficulty` en el panel de control no está vinculado en el componente padre.
    - **Acción**: Vincular el evento en `manager-dashboard.component.html` e implementar la lógica de actualización en `RoomService`.
2.  **Compatibilidad iOS 15.8.5 (iPhone 7 Plus)**:
    - **Problema**: El sitio no abre en versiones antiguas de iOS.
    - **Acción**: Revisar polyfills en `tsconfig.json` / `angular.json` y verificar si hay sintaxis de JS moderno (ej. nullish coalescing o private fields) no soportada por Safari 15.
3.  **Limpieza de carta al iniciar ronda**:
    - **Problema**: En la vista del jugador, sigue apareciendo la última carta de la ronda anterior al iniciar una nueva.
    - **Acción**: Asegurar que al cambiar el estado a `playing` con `currentIndex: -1`, los signals de los jugadores se limpien correctamente.

---

## 🟧 Prioridad P1: Experiencia de Juego Base

_Funcionalidades esenciales para completar el ciclo de juego y evitar confusiones._

1.  **Implementar Podio Final**:
    - **Problema**: Al terminar la partida, no hay una visualización clara de los ganadores acumulados.
    - **Acción**: Ya existe un componente `PodiumComponent`, hay que asegurar su correcta visualización al final de la sesión.
2.  **Bloqueo de Tabla durante Revisión**:
    - **Problema**: Los jugadores pueden seguir marcando/desmarcando mientras el gritón verifica su tabla.
    - **Acción**: Deshabilitar clics en la tabla si el UID del jugador está en `currentRoundWinners`.
3.  **Botón "Limpiar Tabla"**:
    - **Problema**: Falta una forma rápida de quitar todos los frijoles/marcadores.
    - **Acción**: Agregar botón en el panel de acciones del jugador que resetee el array `marks` en Firestore.
4.  **Alerta al Cambiar Tabla**:
    - **Problema**: Cambiar de tabla borra el progreso actual sin avisar.
    - **Acción**: Agregar un modal de confirmación antes de procesar el cambio de tabla si la ronda está activa.

---

## 🟨 Prioridad P2: Mejoras de UX y Monitoreo

_Mejoras visuales y herramientas técnicas para el mantenimiento._

1.  **Global Error Handler**:
    - **Acción**: Implementar un `ErrorHandler` personalizado en Angular para capturar errores técnicos y enviarlos a un servicio de log (o al menos mostrarlos amigablemente).
2.  **Estatus de Jugadores para el Gritón**:
    - **Acción**: Mostrar en la lista de participantes si el jugador está "Eligiendo Marcador", "Eligiendo Tabla" o "Listo".
3.  **Notificaciones de Victoria (Toasts)**:
    - **Acción**: Usar `AlertService` para mandar un aviso a TODOS los jugadores cuando el gritón aprueba a un ganador.
4.  **Ajuste de Diseño Mobile (Emojis)**:
    - **Acción**: Reducir el tamaño de los emojis de marcador en pantallas pequeñas (CSS media queries o clases Tailwind dinámicas).

---

## 🟦 Prioridad P3: Sugerencias y Futuro

_Funciones sociales y modos de juego alternos._

1.  **Modo Espera (Espectador)**:
    - **Acción**: Permitir que un usuario se una sin elegir tabla, solo para ver el progreso.
2.  **Chat y Reacciones**:
    - **Acción**: Sistema simple de reacciones con emojis que aparezcan temporalmente en pantalla (estilo streaming).

---

## Notas Técnicas Adicionales

- **iOS 15**: Es probable que `structuredClone` o alguna API de CSS Grid moderna esté causando el crash. Se debe probar con el simulador o un dispositivo real.
- **Notificaciones**: Para la revisión automática post-ganador, se sugiere que al cerrarse la ronda, el cliente del jugador verifique localmente si su tabla cumplía los requisitos y muestre un mensaje de "¡Casi! Te faltaban X cartas".
