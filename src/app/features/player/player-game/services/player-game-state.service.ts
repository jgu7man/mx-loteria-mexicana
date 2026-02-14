import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { CARDS } from '../../../../core/constants/game-data';
import { ROOM_STATES } from '../../../../core/constants/room-states';
import { Marker, Participant, Room } from '../../../../core/models/game.model';
import { AlertService } from '../../../../core/services/alert.service';
import { ErrorLoggerService } from '../../../../core/services/error-logger.service';
import { RoomService } from '../../../../core/services/room.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerGameStateService implements OnDestroy {
  private roomService = inject(RoomService);
  private alertService = inject(AlertService);
  private errorLogger = inject(ErrorLoggerService);

  // State signals
  room = signal<Room | null>(null);
  participant = signal<Participant | null>(null);
  participants = signal<Participant[]>([]);
  myTabla = signal<number[]>([]);
  myMarks = signal<number[]>([]);
  selectedMarker = signal<Marker | null>(null);
  roomId = signal<string>('');
  isRoomDeleted = signal<boolean>(false);
  private wasRoomPreviouslyPresent = false;

  private subscriptions = new Subscription();

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setRoom(room: Room | null) {
    this.room.set(room);
  }

  setParticipant(p: Participant | null) {
    this.participant.set(p);
    if (p?.marks) {
      this.myMarks.set(p.marks);
    }
    if (p?.tablaCards && p.tablaCards.length > 0) {
      this.myTabla.set(p.tablaCards);
    }
  }

  observeRoom(roomId: string, uid: string) {
    this.roomId.set(roomId);

    // Clear previous subs if any
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();

    this.subscriptions.add(
      this.roomService.observeRoom(roomId).subscribe((r) => {
        // Detectar si la sala fue eliminada
        if (this.wasRoomPreviouslyPresent && r === null) {
          this.isRoomDeleted.set(true);
        }
        if (r !== null) {
          this.wasRoomPreviouslyPresent = true;
        }
        this.setRoom(r);
      }),
    );

    this.subscriptions.add(
      this.roomService.observeParticipant(roomId, uid).subscribe((p) => {
        this.setParticipant(p);
      }),
    );

    // Observar lista completa de participantes
    this.subscriptions.add(
      this.roomService.observeParticipants(roomId).subscribe((list) => {
        this.participants.set(list);
      }),
    );
  }

  // Computed signals
  currentCard = computed(() => {
    const r = this.room();
    if (!r || r.currentIndex < 0 || !Array.isArray(r.deck)) return null;
    const cardId = r.deck[r.currentIndex];
    return CARDS.find((c) => c.id === cardId) ?? null;
  });

  historyCards = computed(() => {
    const r = this.room();
    if (!r || r.currentIndex < 0 || !Array.isArray(r.deck)) return [];

    let limit = 3; // easy (default)
    if (r.config.viewerDifficulty === 'medium') limit = 1;
    if (r.config.viewerDifficulty === 'hard') limit = 0;

    if (limit === 0) return [];

    const startIndex = Math.max(0, r.currentIndex - limit);
    const historyIds = r.deck.slice(startIndex, r.currentIndex);

    return historyIds
      .map((id) => CARDS.find((c) => c.id === id))
      .filter((c) => c !== undefined)
      .reverse();
  });

  isWaitingForVerification = computed(() => {
    const r = this.room();
    const p = this.participant();
    if (!r || !p) return false;

    // Solo bloqueamos si el UID está en la lista de ganadores pendientes
    const pending = r.currentRoundWinners || [];
    return pending.includes(p.uid);
  });

  showPodium = computed(() => {
    const r = this.room();
    if (!r) return false;
    // Show podium when round finishes (winners verified and round completed)
    return (
      r.state === ROOM_STATES.FINISHED ||
      (r.state === ROOM_STATES.WAITING &&
        r.currentRound > 0 &&
        r.roundHistory.length > 0 &&
        r.roundHistory[r.roundHistory.length - 1]?.roundNumber ===
          r.currentRound)
    );
  });

  currentRoundWinnersList = computed(() => {
    const r = this.room();
    if (!r || !this.showPodium()) return [];

    // If finished, show all winners from last round
    if (r.state === ROOM_STATES.FINISHED && r.roundHistory.length > 0) {
      return r.roundHistory[r.roundHistory.length - 1]?.winners || [];
    }

    // If waiting for next round, show winners from previous round
    if (r.state === ROOM_STATES.WAITING && r.roundHistory.length > 0) {
      const lastRound = r.roundHistory[r.roundHistory.length - 1];
      if (lastRound?.roundNumber === r.currentRound) {
        return lastRound.winners || [];
      }
    }

    return [];
  });

  // Actions
  async clearTable(uid: string) {
    const result = await this.alertService.fire({
      title: '¿Limpiar tabla?',
      text: 'Se quitarán todos los marcadores de tu tabla actual',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
    });

    if (result.isConfirmed) {
      try {
        // Limpiar marcas localmente
        this.myMarks.set([]);
        
        // Guardar en localStorage
        this.saveMarksToLocalStorage(uid, this.roomId(), []);
        
        // NO actualizar Firestore aquí, solo cuando cante lotería
        // await this.roomService.updateParticipant(this.roomId(), uid, {
        //   marks: [],
        // });
      } catch (error) {
        await this.errorLogger.logError(
          error as Error,
          'PlayerGameStateService.clearTable',
          'medium',
          { roomId: this.roomId(), uid },
        );
      }
    }
  }

  async shoutLoteria(uid: string) {
    if (this.isWaitingForVerification()) return;

    try {
      // Sincronizar marcas a Firestore antes de cantar lotería
      const syncUpdates: Partial<Participant> = {
        marks: this.myMarks(), // Subir las marcas de localStorage a Firestore
      };
      
      const markerId = this.selectedMarker()?.id;
      const tablaCards = this.myTabla();
      if (markerId) syncUpdates.marker = markerId;
      if (Array.isArray(tablaCards) && tablaCards.length > 0) {
        syncUpdates.tablaCards = tablaCards;
      }

      // Actualizar participante con todas las marcas
      await this.roomService.updateParticipant(
        this.roomId(),
        uid,
        syncUpdates,
      );

      await this.roomService.addWinner(this.roomId(), uid);
      this.alertService.fire({
        icon: 'success',
        title: '¡Solicitud enviada!',
        text: 'El gritón verificará tu tabla',
        confirmButtonColor: '#10b981',
      });
    } catch (error: any) {
      await this.errorLogger.logError(
        error as Error,
        'PlayerGameStateService.shoutLoteria',
        'critical',
        { roomId: this.roomId(), uid, marksCount: this.myMarks().length },
      );
      this.alertService.fire({
        icon: 'error',
        title: 'No se pudo enviar',
        text: error.message || 'Intenta nuevamente',
        confirmButtonColor: '#10b981',
      });
    }
  }

  async toggleMark(uid: string, cardId: number) {
    if (this.isWaitingForVerification()) return;

    const currentMarks = this.myMarks();
    try {
      if (currentMarks.includes(cardId)) {
        // Remover marca localmente de inmediato (optimistic update)
        this.myMarks.update((marks) => marks.filter((id) => id !== cardId));
        
        // Guardar en localStorage
        this.saveMarksToLocalStorage(uid, this.roomId(), this.myMarks());
        
        // Actualizar Firestore (solo cuando cante "¡Lotería!")
        // Por ahora solo mantenemos sincronizado el estado local
        // await this.roomService.unmarkCard(this.roomId(), uid, cardId);
      } else {
        // Agregar marca localmente de inmediato (optimistic update)
        this.myMarks.update((marks) => [...marks, cardId]);
        
        // Guardar en localStorage
        this.saveMarksToLocalStorage(uid, this.roomId(), this.myMarks());
        
        // Actualizar Firestore (solo cuando cante "¡Lotería!")
        // Por ahora solo mantenemos sincronizado el estado local
        // await this.roomService.markCard(this.roomId(), uid, cardId);
      }
    } catch (error) {
      await this.errorLogger.logError(
        error as Error,
        'PlayerGameStateService.toggleMark',
        'medium',
        { roomId: this.roomId(), uid, cardId },
      );
    }
  }

  private saveMarksToLocalStorage(uid: string, roomId: string, marks: number[]) {
    const key = `player-session:${uid}:${roomId}`;
    const existing = localStorage.getItem(key);
    let data: any = {};
    
    if (existing) {
      try {
        data = JSON.parse(existing);
      } catch (e) {
        data = {};
      }
    }
    
    data.marks = marks;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // State management helpers
  reset() {
    this.room.set(null);
    this.participant.set(null);
    this.myTabla.set([]);
    this.myMarks.set([]);
    this.selectedMarker.set(null);
    this.roomId.set('');
  }
}
