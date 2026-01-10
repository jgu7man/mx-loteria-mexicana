// IMPORTANTE: Este es un archivo de ejemplo
// Copia este archivo como environment.ts y environment.prod.ts
// y actualiza con tus credenciales de Firebase

export const environment = {
  production: false, // cambiar a true para environment.prod.ts
  firebase: {
    apiKey: 'YOUR_API_KEY_HERE',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
};
