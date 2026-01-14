# Lotería Mexicana - Aplicación Web

Aplicación web de Lotería Mexicana en tiempo real construida con Angular, Firebase y Tailwind CSS.

## � Estructura del Proyecto

```
mx-loteria-mexicana/
├── src/              # Código fuente de la aplicación Angular
│   ├── app/          # Componentes, servicios y lógica de negocio
│   │   ├── core/     # Models, services, constants
│   │   ├── features/ # Módulos por rol (home, manager, player, viewer)
│   │   └── shared/   # Componentes compartidos
│   └── environments/ # Configuración de entornos
├── docs/             # Documentación del proyecto
├── draft/            # Archivos de borrador y prototipo HTML
├── package.json      # Dependencias del proyecto
├── angular.json      # Configuración de Angular
├── FIREBASE_SETUP.md # Guía de configuración de Firebase
└── SETUP_SUMMARY.md  # Estado actual del proyecto
```

## �🚀 Stack Tecnológico

- **Frontend**: Angular 18 con Signals
- **Backend**: Firebase (Authentication, Firestore)
- **Estilos**: Tailwind CSS
- **Tipografía**: Google Fonts (Outfit)

## 📋 Requisitos Previos

- Node.js v20.18.0 o superior
- npm 10.8.2 o superior
- Cuenta de Firebase

## 🔧 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Authentication (Google y Anonymous)
3. Crea una base de datos Firestore
4. Copia las credenciales de tu proyecto Firebase
5. Actualiza los archivos de entorno:

**src/environments/environment.ts** (desarrollo)
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_AUTH_DOMAIN',
    projectId: 'TU_PROJECT_ID',
    storageBucket: 'TU_STORAGE_BUCKET',
    messagingSenderId: 'TU_MESSAGING_SENDER_ID',
    appId: 'TU_APP_ID'
  }
};
```

**src/environments/environment.prod.ts** (producción)

### 3. Configurar Reglas de Firestore

En Firebase Console, ve a Firestore Database > Reglas y agrega:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /salas/{salaId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.managerId;
      allow delete: if request.auth.uid == resource.data.managerId;
      
      match /participantes/{participantId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow update: if request.auth.uid == participantId;
        allow delete: if request.auth.uid == participantId;
      }
    }
  }
}
```

## 🎮 Ejecutar la Aplicación

### Modo Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Build para Producción

```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/app/
├── core/                      # Núcleo de la aplicación
│   ├── constants/             # Constantes (cartas, marcadores)
│   ├── models/                # Interfaces y tipos
│   └── services/              # Servicios (Auth, Room, GameUtils)
├── features/                  # Módulos de características
│   ├── home/                  # Pantalla de inicio
│   ├── manager/               # Panel del gritón
│   ├── player/                # Vista del jugador
│   └── viewer/                # Vista del espectador
└── shared/                    # Componentes compartidos
    ├── components/
    ├── directives/
    └── pipes/
```

## 🎯 Características Principales

- **3 Roles**: Manager (Gritón), Jugador, Espectador
- **Tiempo Real**: Sincronización instantánea con Firebase Firestore
- **54 Cartas**: Catálogo completo con versos tradicionales
- **89 Tablas**: Generación aleatoria de tablas únicas
- **Patrones de Victoria**: Pozo, líneas, esquinas, cuadrado central
- **Marcadores**: Frijol, maíz, moneda
- **Responsive**: Diseño adaptable para móviles y desktop

## ✅ Estado de Implementación

### Completado
- ✅ Estructura core (constants, models, services)
- ✅ 54 cartas con emojis y colores únicos
- ✅ Servicios de autenticación (Google + Anónimo)
- ✅ Servicio de salas con Firestore
- ✅ Utilidades de juego (barajar, generar tablas, verificar patrones)
- ✅ Componente Home (selección de rol)
- ✅ Componente Manager (crear y controlar salas)
- ✅ Componente Player (unirse, seleccionar marcador y tabla, jugar)
- ✅ Componente Viewer (observar partidas)
- ✅ Componentes compartidos (Card, Tabla, Marker)
- ✅ Configuración de rutas
- ✅ Build exitoso

## 📝 Próximos Pasos

1. Configurar credenciales de Firebase
2. Agregar guards para protección de rutas
3. Implementar pipes personalizados
4. Agregar tests unitarios
5. Deploy a Firebase Hosting
