import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { MARKERS } from '../../../core/constants/game-data';
import { Marker, Participant } from '../../../core/models/game.model';
import { AlertService } from '../../../core/services/alert.service';
import { AuthService } from '../../../core/services/auth.service';
import { GameUtilsService } from '../../../core/services/game-utils.service';
import { RoomService } from '../../../core/services/room.service';
import { WinnerNotificationService } from '../../../core/services/winner-notification.service';
import { MarkerComponent } from '../../../shared/components/marker/marker.component';
import { PodiumComponent } from '../../../shared/components/podium/podium.component';
import { PlayerGameBoardComponent } from './components/player-game-board/player-game-board.component';
import { PlayerJoinFormComponent } from './components/player-join-form/player-join-form.component';
import { PlayerTablaSelectorComponent } from './components/player-tabla-selector/player-tabla-selector.component';
import { PlayerGameStateService } from './services/player-game-state.service';

@Component({
  selector: 'app-player-game',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MarkerComponent,
    PodiumComponent,
    PlayerJoinFormComponent,
    PlayerTablaSelectorComponent,
    PlayerGameBoardComponent,
  ],
  templateUrl: './player-game.component.html',
  providers: [PlayerGameStateService],
})
export class PlayerGameComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private roomService = inject(RoomService);
  private gameState = inject(PlayerGameStateService);
  private gameUtils = inject(GameUtilsService);
  private alertService = inject(AlertService);
  private destroyRef = inject(DestroyRef);
  private winnerNotification = inject(WinnerNotificationService);

  // Re-export state from service
  currentUser = this.authService.currentUser;
  authLoading = this.authService.authLoading;
  roomLoading = signal<boolean>(false);
  isLoading = computed(() => this.authLoading() || this.roomLoading());

  room = this.gameState.room;
  participant = this.gameState.participant;
  participants = this.gameState.participants;
  currentCard = this.gameState.currentCard;
  historyCards = this.gameState.historyCards;
  myTabla = this.gameState.myTabla;
  myMarks = this.gameState.myMarks;
  selectedMarker = this.gameState.selectedMarker;

  showPodium = this.gameState.showPodium;
  currentRoundWinners = this.gameState.currentRoundWinnersList;

  // Computed signal serializado para detectar cambios reales en currentRoundWinners
  currentRoundWinnersJson = computed(() => {
    const winners = this.room()?.currentRoundWinners || [];
    return JSON.stringify(winners);
  });

  // UI state
  roomId = '';
  displayName = '';
  showJoinForm = signal(true);
  isRoomDeleted = this.gameState.isRoomDeleted;
  showMarkerSelector = signal(false);
  showTablaSelector = signal(false);

  // Available tablas (simplified - just generate 10 for demo)
  availableTablas = signal<number[][]>([]);

  private readonly legacyRoomKey = 'playerRoomId';
  private readonly legacyMarkerKey = 'playerMarker';
  private readonly legacyTablaKey = 'playerTabla';

  constructor() {
    // Effect para detectar cambios en la autenticación
    effect(
      () => {
        const user = this.currentUser();
        if (user) {
          this.restorePlayerSession();
        }
      },
      { allowSignalWrites: true },
    );

    // Effect para detectar cuando alguien grita lotería
    // Usa computed signal serializado para evitar ejecuciones en cada cambio de room
    effect(
      () => {
        // Leer el computed signal serializado - solo cambia si winners cambia
        const winnersJson = this.currentRoundWinnersJson();
        const winners = winnersJson ? JSON.parse(winnersJson) : [];
        const participant = this.participant();

        // Usar el servicio compartido para procesar ganadores
        // Pasar el UID del jugador actual para no notificarse a sí mismo
        this.winnerNotification.processWinners(
          winners,
          participant?.uid,
          this.roomId,
        );
      },
      { allowSignalWrites: false },
    );

    // Effect para detectar cuando se aprueba un ganador
    effect(
      () => {
        const r = this.room();
        const participant = this.participant();

        if (
          !r ||
          !r.currentRoundVerifiedWinners ||
          r.currentRoundVerifiedWinners.length === 0
        ) {
          return;
        }

        // Obtener el último ganador verificado
        const verifiedWinners = r.currentRoundVerifiedWinners;
        const lastWinner = verifiedWinners[verifiedWinners.length - 1];

        if (lastWinner) {
          // Mostrar toast diferente si soy yo el ganador
          const isMe = lastWinner.uid === participant?.uid;

          this.alertService.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: isMe
              ? '¡Felicidades! Has ganado esta ronda 🏆'
              : `${lastWinner.displayName} ha ganado esta ronda 🏆`,
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
          });
        }
      },
      { allowSignalWrites: false },
    );

    // Effect para detectar cuando el manager rechaza el gane
    let wasInWinners = false;
    effect(
      () => {
        const r = this.room();
        const participant = this.participant();

        if (!r || !participant) return;

        const isCurrentlyInWinners =
          r.currentRoundWinners?.includes(participant.uid) || false;

        // Si estaba en winners y ya no está, fue rechazado
        if (wasInWinners && !isCurrentlyInWinners) {
          this.alertService.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Gane rechazado ❌',
            text: 'El manager verificó tu tabla y no cumplía con los requisitos',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
          });
        }

        // Actualizar estado para la próxima ejecución
        wasInWinners = isCurrentlyInWinners;
      },
      { allowSignalWrites: false },
    );
  }

  ngOnInit() {
    // Check route to determine behavior
    this.route.url.subscribe((segments) => {
      const path = segments[0]?.path || '';

      // Si estamos en /player, ocultar formulario inmediatamente (evitar flash)
      if (path === 'player') {
        this.showJoinForm.set(false);
      }

      // Si estamos en /join, mostrar formulario y limpiar sesión previa
      if (path === 'join') {
        const user = this.currentUser();
        const legacyRoomId = localStorage.getItem(this.legacyRoomKey);
        if (user && legacyRoomId) {
          this.clearPlayerSession(user.uid, legacyRoomId);
        }
        this.showJoinForm.set(true);

        // Check if roomId is in URL params
        this.route.params.subscribe((params) => {
          if (params['roomId']) {
            this.roomId = params['roomId'];
          }
        });
      }

      // Si estamos en /player/:roomId, intentar restaurar sesión
      if (path === 'player') {
        this.route.params.subscribe((params) => {
          if (params['roomId']) {
            this.roomId = params['roomId'];
            localStorage.setItem(this.legacyRoomKey, params['roomId']);
          } else {
            // Si llegamos a /player sin roomId, redirigir a /join
            this.router.navigate(['/join']);
          }
        });
      }
    });

    // Generate some tablas
    this.refreshAvailableTablas();
  }

  refreshAvailableTablas() {
    // Generar 3 tablas aleatorias para que el jugador elija
    this.availableTablas.set(this.gameUtils.generateMultipleTablas(3));

    // Desplazar la vista al inicio del contenedor si es necesario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private async restorePlayerSession() {
    const user = this.currentUser();
    if (!user) return;

    const roomIdCandidate =
      this.roomId || localStorage.getItem(this.legacyRoomKey) || '';
    if (!roomIdCandidate) return;

    const session = this.loadPlayerSession(user.uid, roomIdCandidate);

    // Solo continuar si hay datos que restaurar
    if (!session) return;

    this.roomLoading.set(true);

    // Solo usar legacy keys si el roomId guardado coincide con el actual
    const legacyRoomId = localStorage.getItem(this.legacyRoomKey);
    const useLegacy = legacyRoomId === roomIdCandidate;

    const legacyMarker = useLegacy
      ? localStorage.getItem(this.legacyMarkerKey)
      : null;
    const legacyTabla = useLegacy
      ? localStorage.getItem(this.legacyTablaKey)
      : null;

    const markerId =
      session?.markerId ?? this.parseLegacyMarkerId(legacyMarker);
    const tabla = session?.tabla ?? this.parseLegacyTabla(legacyTabla);
    const marks = session?.marks ?? [];

    if (roomIdCandidate && user) {
      try {
        // Verificar si la sala existe
        const room = await this.roomService.getRoom(roomIdCandidate);
        if (!room) {
          // La sala no existe, limpiar y mostrar modal
          this.clearPlayerSession(user.uid, roomIdCandidate);
          this.gameState.isRoomDeleted.set(true);
          this.roomLoading.set(false);
          return;
        }

        this.roomId = roomIdCandidate;

        // Verificar si el participante existe en Firestore
        const existingParticipant = await firstValueFrom(
          this.roomService.observeParticipant(roomIdCandidate, user.uid),
        );

        // Si el participante no existe, registrarlo automáticamente
        if (!existingParticipant) {
          const participant: Omit<Participant, 'joinedAt'> = {
            uid: user.uid,
            displayName: user.displayName,
            role: 'player',
            marks: [],
            victories: 0,
            isActive: true,
          };
          await this.roomService.joinRoom(roomIdCandidate, participant);
        }

        // Iniciar observación centralizada en el servicio
        this.gameState.observeRoom(roomIdCandidate, user.uid);

        // Restaurar marcador por id
        const restoredMarker = markerId
          ? (MARKERS.find((m) => m.id === markerId) ?? null)
          : null;
        if (restoredMarker) {
          this.selectedMarker.set(restoredMarker);
        }

        // Restaurar tabla (si existe y es válida)
        const restoredTabla =
          Array.isArray(tabla) && tabla.length > 0 ? tabla : null;
        if (restoredTabla) {
          this.myTabla.set(restoredTabla);
        }

        // Best-effort: sincronizar marker/tabla a Firestore (útil tras recargas)
        const restoreUpdates: Partial<Participant> = {};
        if (restoredMarker?.id) restoreUpdates.marker = restoredMarker.id;
        if (restoredTabla) restoreUpdates.tablaCards = restoredTabla;
        if (Object.keys(restoreUpdates).length > 0) {
          this.roomService
            .updateParticipant(roomIdCandidate, user.uid, restoreUpdates)
            .catch(() => {
              // Puede fallar si el participante aún no existe; es best-effort.
            });
        }

        // Elegir correctamente el paso de UI.
        this.showJoinForm.set(false);
        if (!restoredTabla) {
          // Sin tabla: mostrar selector de tabla primero
          this.showTablaSelector.set(true);
          this.showMarkerSelector.set(false);
        } else if (!restoredMarker) {
          // Tiene tabla pero no marcador: mostrar selector de marcador
          this.showMarkerSelector.set(true);
          this.showTablaSelector.set(false);
        } else {
          // Tiene ambos: listo para jugar
          this.showMarkerSelector.set(false);
          this.showTablaSelector.set(false);
        }

        // Guardar/migrar al formato nuevo para futuras recargas
        this.savePlayerSession(user.uid, roomIdCandidate, {
          markerId: restoredMarker?.id ?? null,
          tabla: restoredTabla,
          marks: this.myMarks(),
        });

        // Navegar a /player/:roomId si restauración exitosa
        const currentPath = window.location.pathname;
        if (currentPath.includes('/join/')) {
          await this.router.navigate(['/player', roomIdCandidate]);
        }
      } catch (error) {
        console.error('Error auto-joining room:', error);
      }
    }
    this.roomLoading.set(false);
  }

  private getPlayerSessionKey(uid: string, roomId: string) {
    return `player-session:${uid}:${roomId}`;
  }

  private loadPlayerSession(
    uid: string,
    roomId: string,
  ): {
    markerId: string | null;
    tabla: number[] | null;
    marks: number[];
  } | null {
    const raw = localStorage.getItem(this.getPlayerSessionKey(uid, roomId));
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as {
        markerId?: string | null;
        tabla?: unknown;
        marks?: unknown;
      };
      const tabla = Array.isArray(parsed.tabla)
        ? (parsed.tabla as number[])
        : null;
      const marks = Array.isArray(parsed.marks)
        ? (parsed.marks as unknown[]).filter((n) => typeof n === 'number')
        : [];
      return {
        markerId: parsed.markerId ?? null,
        tabla,
        marks: marks as number[],
      };
    } catch {
      return null;
    }
  }

  private savePlayerSession(
    uid: string,
    roomId: string,
    data: { markerId: string | null; tabla: number[] | null; marks?: number[] },
  ) {
    localStorage.setItem(
      this.getPlayerSessionKey(uid, roomId),
      JSON.stringify(data),
    );
    // Keep legacy keys in sync (best effort)
    if (data.markerId) {
      localStorage.setItem(this.legacyMarkerKey, data.markerId);
    }
    if (data.tabla) {
      localStorage.setItem(this.legacyTablaKey, JSON.stringify(data.tabla));
    }
    localStorage.setItem(this.legacyRoomKey, roomId);
  }

  private clearPlayerSession(uid: string, roomId: string) {
    localStorage.removeItem(this.getPlayerSessionKey(uid, roomId));
    // Legacy cleanup
    localStorage.removeItem(this.legacyRoomKey);
    localStorage.removeItem(this.legacyMarkerKey);
    localStorage.removeItem(this.legacyTablaKey);
  }

  private parseLegacyMarkerId(raw: string | null): string | null {
    if (!raw) return null;
    // Legacy could be: "bean" (plain), or JSON string, or JSON object {id:...}
    if (MARKERS.some((m) => m.id === raw)) return raw;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'string' && MARKERS.some((m) => m.id === parsed))
        return parsed;
      if (
        parsed &&
        typeof parsed === 'object' &&
        'id' in parsed &&
        typeof (parsed as any).id === 'string'
      ) {
        const id = (parsed as any).id as string;
        return MARKERS.some((m) => m.id === id) ? id : null;
      }
    } catch {
      // ignore
    }
    return null;
  }

  private parseLegacyTabla(raw: string | null): number[] | null {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every((n) => typeof n === 'number'))
        return parsed as number[];
    } catch {
      // Some very old formats could be comma-separated
      const parts = raw
        .split(',')
        .map((p) => Number(p.trim()))
        .filter((n) => Number.isFinite(n));
      return parts.length ? parts : null;
    }
    return null;
  }

  async signInAnonymously() {
    if (!this.displayName.trim() || !this.roomId.trim()) {
      this.alertService.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    // Limpiar localStorage si es una sala diferente
    const legacyRoomId = localStorage.getItem(this.legacyRoomKey);
    if (legacyRoomId && legacyRoomId !== this.roomId.trim()) {
      localStorage.removeItem(this.legacyRoomKey);
      localStorage.removeItem(this.legacyMarkerKey);
      localStorage.removeItem(this.legacyTablaKey);
    }

    try {
      if (!this.currentUser()) {
        await this.authService.signInAnonymously(this.displayName);
      }
      await this.joinRoom();
    } catch (error: any) {
      console.error('Error joining room:', error);
      this.alertService.fire({
        icon: 'error',
        title: 'Error al unirse',
        text: error.message || 'No se pudo unirse a la sala',
        confirmButtonColor: '#10b981',
      });
    }
  }

  async signInWithGoogle() {
    if (!this.roomId.trim()) {
      this.alertService.fire({
        icon: 'warning',
        title: 'Código requerido',
        text: 'Por favor ingresa el código de la sala',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    // Limpiar localStorage si es una sala diferente
    const legacyRoomId = localStorage.getItem(this.legacyRoomKey);
    if (legacyRoomId && legacyRoomId !== this.roomId.trim()) {
      localStorage.removeItem(this.legacyRoomKey);
      localStorage.removeItem(this.legacyMarkerKey);
      localStorage.removeItem(this.legacyTablaKey);
    }

    try {
      await this.authService.signInWithGoogle();
      this.displayName = this.currentUser()!.displayName;
      await this.joinRoom();
    } catch (error: any) {
      console.error('Error joining room:', error);
      this.alertService.fire({
        icon: 'error',
        title: 'Error al unirse',
        text: error.message || 'No se pudo unirse a la sala',
        confirmButtonColor: '#10b981',
      });
    }
  }

  private async joinRoom() {
    this.roomLoading.set(true);

    try {
      const room = await this.roomService.getRoom(this.roomId);
      if (!room) {
        this.roomLoading.set(false);
        this.alertService.fire({
          icon: 'error',
          title: 'Sala no encontrada',
          text: 'Verifica el código e inténtalo nuevamente',
          confirmButtonColor: '#10b981',
        });
        return;
      }

      const user = this.currentUser();
      if (!user) throw new Error('User not authenticated');

      // Iniciar observación centralizada
      this.gameState.observeRoom(this.roomId, user.uid);

      // Join room in Firestore
      const participant: Omit<Participant, 'joinedAt'> = {
        uid: user.uid,
        displayName: this.displayName || user.displayName,
        role: 'player',
        marks: [],
        victories: 0,
        isActive: true,
        status: 'choosing-marker',
      };

      await this.roomService.joinRoom(this.roomId, participant);

      // Guardar en localStorage
      this.savePlayerSession(user.uid, this.roomId, {
        markerId: this.selectedMarker()?.id ?? null,
        tabla: this.myTabla().length ? this.myTabla() : null,
        marks: this.myMarks(),
      });

      // Navegar a /player/:roomId
      await this.router.navigate(['/player', this.roomId]);

      this.showJoinForm.set(false);
      this.showTablaSelector.set(true); // Tabla primero
      this.roomLoading.set(false);
    } catch (error) {
      console.error('Error joining room:', error);
      this.roomLoading.set(false);
      throw error;
    }
  }

  onMarkerSelected(marker: Marker) {
    this.selectedMarker.set(marker);
    const user = this.currentUser();
    if (user && this.roomId) {
      this.savePlayerSession(user.uid, this.roomId, {
        markerId: marker.id,
        tabla: this.myTabla().length ? this.myTabla() : null,
        marks: this.myMarks(),
      });

      // Actualizar marcador en Firestore
      this.roomService.updateParticipant(this.roomId, user.uid, {
        marker: marker.id,
        status: 'ready', // Ya tiene tabla y marcador
      });
    }
    this.showMarkerSelector.set(false);
  }

  async startChangingMarker() {
    // Mostrar el selector de marcador
    this.showMarkerSelector.set(true);

    // Actualizar status a 'changing-marker' sin borrar datos
    const user = this.currentUser();
    if (user && this.roomId) {
      try {
        await this.roomService.updateParticipant(this.roomId, user.uid, {
          status: 'changing-marker',
        });
      } catch (error) {
        console.error('Error al actualizar status del jugador:', error);
      }
    }
  }

  cancelMarkerSelection() {
    this.showMarkerSelector.set(false);
    // Restaurar status a ready si tiene marcador y tabla
    const user = this.currentUser();
    if (
      user &&
      this.roomId &&
      this.selectedMarker() &&
      this.myTabla().length > 0
    ) {
      this.roomService.updateParticipant(this.roomId, user.uid, {
        status: 'ready',
      });
    }
  }

  cancelTablaSelection() {
    this.showTablaSelector.set(false);
    // Restaurar status a ready si tiene tabla
    const user = this.currentUser();
    if (user && this.roomId && this.myTabla().length > 0) {
      this.roomService.updateParticipant(this.roomId, user.uid, {
        status: 'ready',
      });
    }
  }

  async startChangingTabla() {
    // Mostrar el selector de tabla
    this.showTablaSelector.set(true);

    // Actualizar status a 'changing-tabla' sin borrar datos
    const user = this.currentUser();
    if (user && this.roomId) {
      try {
        await this.roomService.updateParticipant(this.roomId, user.uid, {
          status: 'changing-tabla',
        });
      } catch (error) {
        console.error('Error al actualizar status del jugador:', error);
      }
    }
  }

  selectTabla(tabla: number[]) {
    this.myTabla.set(tabla);
    this.myMarks.set([]);
    const user = this.currentUser();
    if (user && this.roomId) {
      this.savePlayerSession(user.uid, this.roomId, {
        markerId: this.selectedMarker()?.id ?? null,
        tabla,
        marks: [],
      });

      // Update participant in Firestore
      const tablaId = this.availableTablas().indexOf(tabla);
      const updates: Partial<Participant> = {
        tablaId,
        tablaCards: tabla,
        marks: [],
        status: this.selectedMarker() ? 'ready' : 'choosing-marker',
      };

      // Solo agregar marker si existe
      if (this.selectedMarker()?.id) {
        updates.marker = this.selectedMarker()!.id;
      }

      this.roomService.updateParticipant(this.roomId, user.uid, updates);
    }
    this.showTablaSelector.set(false);

    // Mostrar selector de marcador si aún no tiene uno
    if (!this.selectedMarker()) {
      this.showMarkerSelector.set(true);
    }
  }

  goHome() {
    // Limpiar la sesión del jugador al salir
    const user = this.currentUser();
    if (user && this.roomId) {
      this.clearPlayerSession(user.uid, this.roomId);
    } else {
      // Best effort legacy cleanup
      localStorage.removeItem(this.legacyRoomKey);
      localStorage.removeItem(this.legacyMarkerKey);
      localStorage.removeItem(this.legacyTablaKey);
    }
    this.router.navigate(['/']);
  }
}
