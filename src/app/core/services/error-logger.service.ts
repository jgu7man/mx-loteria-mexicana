import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  serverTimestamp,
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

export interface ErrorLog {
  timestamp: any;
  userId?: string;
  userEmail?: string;
  errorMessage: string;
  errorStack?: string;
  context: string; // e.g., 'RoomService.createRoom', 'PlayerComponent.shoutLoteria'
  severity: 'low' | 'medium' | 'high' | 'critical';
  userAgent: string;
  url: string;
  additionalData?: Record<string, any>;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorLoggerService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  async logError(
    error: Error | string,
    context: string,
    severity: ErrorLog['severity'] = 'medium',
    additionalData?: Record<string, any>,
  ): Promise<void> {
    try {
      const currentUser = this.authService.currentUser();

      const errorLog: ErrorLog = {
        timestamp: serverTimestamp(),
        userId: currentUser?.uid,
        userEmail: currentUser?.email || undefined,
        errorMessage: typeof error === 'string' ? error : error.message,
        errorStack: error instanceof Error ? error.stack : undefined,
        context,
        severity,
        userAgent: navigator.userAgent,
        url: window.location.href,
        additionalData,
      };

      await addDoc(collection(this.firestore, 'error-logs'), errorLog);

      // También log en consola en desarrollo
      if (!window.location.hostname.includes('web.app')) {
        console.error(
          `[${severity.toUpperCase()}] ${context}:`,
          error,
          additionalData,
        );
      }
    } catch (logError) {
      // Si falla el logging, solo registrar en consola
      console.error('Failed to log error to Firestore:', logError);
      console.error('Original error:', error);
    }
  }
}
