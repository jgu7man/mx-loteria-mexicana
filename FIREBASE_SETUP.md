# Configuración de Firebase

Para configurar Firebase en esta aplicación:

## 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Registra tu aplicación web

## 2. Habilitar Servicios

### Authentication
- Ve a Authentication > Sign-in method
- Habilita:
  - Google
  - Anónimo (Anonymous)

### Firestore Database
- Ve a Firestore Database
- Crea una base de datos en modo producción
- Aplica las reglas de seguridad (ver abajo)

## 3. Obtener Credenciales

1. Ve a Configuración del proyecto (⚙️) > Configuración general
2. En "Tus apps", selecciona tu app web
3. Copia el objeto de configuración `firebaseConfig`

## 4. Actualizar archivos de entorno

Reemplaza los valores en:
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

```typescript
export const environment = {
  production: false, // true para production
  firebase: {
    apiKey: "AIza...",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
  }
};
```

## 5. Reglas de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para salas
    match /salas/{salaId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.managerId;
      allow delete: if request.auth.uid == resource.data.managerId;
      
      // Reglas para participantes
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

## Estructura de Datos en Firestore

### Colección: `salas`
```json
{
  "id": "sala123",
  "managerId": "uid_del_manager",
  "estado": "esperando",
  "mazo": [1, 23, 45, ...],
  "indiceActual": 0,
  "rondaActual": 1,
  "configuracion": {
    "limiteRondas": 10,
    "dificultadEspectador": "facil"
  },
  "ganadoresRondaActual": [],
  "historialGanadores": []
}
```

### Sub-colección: `salas/{salaId}/participantes`
```json
{
  "uid": "uid_del_jugador",
  "seudonimo": "ElValiente99",
  "marcador": "bean",
  "victorias": 0,
  "activo": true,
  "tablas": [
    {
      "tablaId": 1,
      "marcas": [5, 12, 23]
    }
  ]
}
```
