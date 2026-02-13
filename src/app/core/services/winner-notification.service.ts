import { inject, Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { RoomService } from './room.service';

@Injectable({
  providedIn: 'root',
})
export class WinnerNotificationService {
  private alertService = inject(AlertService);
  private roomService = inject(RoomService);

  // Map de contextos: key = roomId (o roomId+userId), value = { notifiedWinners, lastJson }
  private contexts = new Map<
    string,
    {
      notifiedWinners: Set<string>;
      lastJson: string;
    }
  >();

  /**
   * Genera la clave única para el contexto
   */
  private getContextKey(roomId?: string, userId?: string): string {
    if (!roomId) return 'default';
    return userId ? `${roomId}:${userId}` : roomId;
  }

  /**
   * Obtiene o crea el contexto para una sala/usuario específico
   */
  private getContext(contextKey: string) {
    if (!this.contexts.has(contextKey)) {
      this.contexts.set(contextKey, {
        notifiedWinners: new Set<string>(),
        lastJson: '[]',
      });
    }
    return this.contexts.get(contextKey)!;
  }

  /**
   * Procesa la lista de ganadores actuales y muestra notificaciones para los nuevos
   * @param currentRoundWinners Lista de UIDs de ganadores de la ronda actual
   * @param currentUserUid UID del usuario actual (opcional, para no notificarse a sí mismo)
   * @param roomId ID de la sala (para obtener nombres de participantes)
   */
  processWinners(
    currentRoundWinners: string[] | undefined,
    currentUserUid?: string,
    roomId?: string,
  ): void {
    // Obtener el contexto específico para esta sala/usuario
    const contextKey = this.getContextKey(roomId, currentUserUid);
    const context = this.getContext(contextKey);

    // Serializar la lista actual para comparar
    const currentJson = JSON.stringify(currentRoundWinners || []);

    // Si el JSON es idéntico al último procesado EN ESTE CONTEXTO, salir
    if (currentJson === context.lastJson) {
      return;
    }

    // Actualizar el último JSON procesado para este contexto
    context.lastJson = currentJson;

    if (!currentRoundWinners || currentRoundWinners.length === 0) {
      // Limpiar notificados cuando no hay ganadores
      if (context.notifiedWinners.size > 0) {
        context.notifiedWinners.clear();
      }
      return;
    }

    let hasNewWinners = false;

    currentRoundWinners.forEach((winnerId) => {
      // Si ya notifiqué a este ganador EN ESTE CONTEXTO, saltar
      if (context.notifiedWinners.has(winnerId)) {
        return;
      }

      // Si es el usuario actual y se especificó, agregarlo a notificados pero no mostrar toast
      if (currentUserUid && winnerId === currentUserUid) {
        context.notifiedWinners.add(winnerId);
        hasNewWinners = true;
        return;
      }

      hasNewWinners = true;
      context.notifiedWinners.add(winnerId);

      // Obtener info del ganador desde Firestore si tenemos roomId
      if (roomId) {
        this.roomService.getParticipant(roomId, winnerId).then((winner) => {
          if (winner) {
            this.alertService.fire({
              toast: true,
              position: 'top-end',
              icon: 'info',
              title: `${winner.displayName} gritó ¡Lotería!`,
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          }
        });
      }
    });
  }

  /**
   * Limpia la lista de ganadores notificados para un contexto específico
   * Útil al iniciar una nueva ronda
   * @param roomId ID de la sala
   * @param userId ID del usuario (opcional)
   */
  clearNotifications(roomId?: string, userId?: string): void {
    const contextKey = this.getContextKey(roomId, userId);
    const context = this.getContext(contextKey);
    context.notifiedWinners.clear();
    context.lastJson = '[]';
  }

  /**
   * Limpia todos los contextos (útil para cleanup global)
   */
  clearAllContexts(): void {
    this.contexts.clear();
  }
}
