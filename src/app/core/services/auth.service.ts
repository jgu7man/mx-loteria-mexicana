import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  signOut,
  user,
  User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AppUser, AuthProvider } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  
  // Signal para el usuario actual
  currentUser = signal<AppUser | null>(null);
  
  // Observable del estado de autenticación de Firebase
  user$: Observable<User | null> = user(this.auth);

  constructor() {
    // Escuchar cambios en el estado de autenticación
    this.user$.subscribe((firebaseUser) => {
      if (firebaseUser) {
        this.currentUser.set(this.mapFirebaseUser(firebaseUser));
      } else {
        this.currentUser.set(null);
      }
    });
  }

  /**
   * Iniciar sesión con Google
   */
  async signInWithGoogle(): Promise<AppUser> {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(this.auth, provider);
      const appUser = this.mapFirebaseUser(result.user);
      this.currentUser.set(appUser);
      return appUser;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  /**
   * Iniciar sesión anónimamente con seudónimo
   */
  async signInAnonymously(displayName: string): Promise<AppUser> {
    try {
      const result = await signInAnonymously(this.auth);
      const appUser = this.mapFirebaseUser(result.user, displayName);
      this.currentUser.set(appUser);
      return appUser;
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  }

  /**
   * Cerrar sesión
   */
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUser.set(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  /**
   * Verificar si el usuario actual es el manager de una sala
   */
  isManager(managerId: string): boolean {
    const user = this.currentUser();
    return user !== null && user.uid === managerId;
  }

  /**
   * Mapear usuario de Firebase a AppUser
   */
  private mapFirebaseUser(firebaseUser: User, customDisplayName?: string): AppUser {
    let provider: AuthProvider = 'anonymous';
    
    if (!firebaseUser.isAnonymous && firebaseUser.providerData.length > 0) {
      const providerId = firebaseUser.providerData[0].providerId;
      if (providerId === 'google.com') {
        provider = 'google';
      }
    }

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || undefined,
      displayName: customDisplayName || firebaseUser.displayName || 'Jugador Anónimo',
      photoURL: firebaseUser.photoURL || undefined,
      isAnonymous: firebaseUser.isAnonymous,
      provider
    };
  }
}
