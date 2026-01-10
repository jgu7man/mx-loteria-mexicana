# **Especificaciones Técnicas: Plataforma Lotería Streaming**

Este documento define los requisitos funcionales, la arquitectura y el diseño de experiencia para una aplicación web de Lotería Mexicana en tiempo real utilizando Angular, Firebase y Tailwind CSS.

## **1\. Stack Tecnológico**

* **Frontend:** Angular (v17+) con Signals para gestión de estado reactivo.  
* **Estilos:** Tailwind CSS (Diseño responsivo).  
* **BaaS:** Firebase (Auth, Firestore, Hosting).  
* **Sincronización:** Firestore Real-time snapshots para actualización instantánea de cartas y marcas.

## **2\. Roles del Sistema**

### **2.1 Manager (El Gritón)**

* **Control de Flujo:** Único con permisos para avanzar cartas y validar ganadores.  
* **Verificación:** Posee herramientas de asistencia visual para aprobar o rechazar cantos de "Lotería".  
* **Dashboard:** Administra sus salas activas e históricas.

### **2.2 Jugador (Participante Activo)**

* **Interacción:** Elige tablas, marcadores y gestiona sus marcas manualmente.  
* **Voz:** Notifica su victoria de forma externa (voz/chat), activando la revisión del Manager.

### **2.3 Espectador (Viewer)**

* **Modo Pasivo:** Visualiza el juego según la dificultad configurada (historial limitado de cartas).

## **3\. Journey del Jugador (Flujo Detallado)**

1. **Acceso:** Ingreso mediante Link directo o escaneo de código QR.  
2. **Identificación:** Registro mediante Google, Correo o ingreso rápido con Seudónimo.  
3. **Estado de Entrada (Lógica de Sala):**  
   * El jugador puede entrar a la sala en cualquier momento. Si una ronda está en curso, puede observar o proceder a configurar su juego.  
4. **Configuración Estética:** Selección del marcador visual (frijol, maíz o moneda).  
5. **Selección de Tabla (Flexibilidad Total):**  
   * El sistema utiliza un catálogo de **89 tablas únicas**.  
   * El jugador puede elegir o **cambiar de tabla en cualquier momento**, incluso si una ronda ya ha comenzado.  
   * **Consecuencia del cambio:** Si un jugador cambia de tabla a mitad de una ronda, sus marcas se resetean automáticamente a un array vacío \[\]. Comienza de cero con la nueva tabla.  
   * **Validación:** Si una tabla ya está tomada por otro, aparece deshabilitada.  
6. **Gameplay (Fase Activa):** Marcado manual de IDs de cartas. El software renderiza el marcador si el ID está en el array de marcas del jugador.  
7. **Canto de Victoria:** Al completar el patrón, el jugador avisa por voz. Puede haber múltiples ganadores en una sola ronda.  
8. **Persistencia:** Si se desconecta, retoma su lugar, tabla y marcas actuales.

## **4\. Journey del Manager (Flujo Detallado)**

1. **Autenticación:** El Manager debe estar logueado para crear salas.  
2. **Creación de Sala:** Define nombre, dificultad y límite de rondas. Genera el Link/QR.  
3. **Inicio de Ronda (Mazo Dinámico):** \* Al iniciar cada ronda, el sistema aplica un algoritmo de randomización (ej. Fisher-Yates) para generar un nuevo orden de las 54 cartas.  
   * La ronda puede iniciar aunque haya jugadores aún eligiendo tabla (coordinación vía chat/voz externa).  
4. **Canto de Cartas:** Revela cartas una a una con previsualización y versos sugeridos.  
5. **Proceso de Verificación y Cierre de Ronda:**  
   * Ante un grito de "Lotería", el Manager selecciona al jugador.  
   * El software asiste resaltando aciertos y errores en la tabla del jugador.  
   * El Manager puede **"Dar el Gane"** a uno o varios jugadores de forma sucesiva.  
   * **Cierre Explícito:** Marcar a un ganador **no finaliza la ronda automáticamente**. El Manager debe presionar el botón **"Finalizar Ronda"** explícitamente. Esto permite seguir "cantando" cartas para ver quién más habría ganado o cuánto les faltaba a otros.  
6. **Gestión de Resultados:** Al finalizar la ronda, se actualiza el podium y se permite a los jugadores cambiar de tabla si lo desean para la siguiente.

## **5\. Características de las Pantallas**

### **5.1 Pantalla del Espectador (Dificultad)**

* **Modo Fácil:** Historial de las últimas 5 cartas.  
* **Modo Medio:** Historial de las últimas 2 cartas.  
* **Modo Difícil:** Sin historial, solo carta actual.

## **6\. Modelo de Datos (Firestore)**

### **Colección: salas**

{  
  "id": "ID\_UNICO\_SALA",  
  "managerId": "UID\_MANAGER",  
  "estado": "esperando|jugando|verificando|finalizada",  
  "mazo": \[5, 23, 12, 44, 1, "..."\], // Nuevo orden aleatorio por cada ronda  
  "indiceActual": 10,  
  "rondaActual": 1,  
  "configuracion": {  
    "limiteRondas": 10,  
    "dificultadEspectador": "facil|medio|dificil"  
  },  
  "ganadoresRondaActual": \["UID\_JUGADOR\_1", "UID\_JUGADOR\_2"\], // Lista de ganadores validados  
  "historialGanadores": \[  
    { "ronda": 1, "ganadores": \["Pepe", "Maria"\], "tablas": \[45, 12\] }  
  \]  
}

### **Sub-colección: participantes**

{  
  "uid": "UID\_JUGADOR",  
  "seudonimo": "Pepe\_El\_Toro",  
  "marcador": "maiz",  
  "victorias": 2,  
  "activo": true,  
  "tablas": \[  
    {   
      "tablaId": 45,   
      "marcas": \[5, 12, 44\] // Se limpia si el jugador cambia de tabla  
    }  
  \]  
}

## **7\. Seguridad y Reglas de Firestore**

1. **Manager:** Único con permiso para escribir en el estado de la sala, el mazo de la ronda y el array de ganadores.  
2. **Jugador:** Solo escribe en su propio documento de participante.  
3. **Reset de Marcas:** Se implementa lógica en el cliente (Angular) para que, al detectar un cambio de tablaId, se envíe una actualización de marcas: \[\] a Firestore.  
4. **Finalización de Ronda:** Las reglas de seguridad impiden que el indiceActual avance si el estado de la sala es finalizada o esperando.