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

  // Re-export state from service
  currentUser = this.authService.currentUser;
  authLoading = this.authService.authLoading;
  roomLoading = signal<boolean>(false);
  isLoading = computed(() => this.authLoading() || this.roomLoading());

  room = this.gameState.room;
  participant = this.gameState.participant;
  currentCard = this.gameState.currentCard;
  historyCards = this.gameState.historyCards;
  myTabla = this.gameState.myTabla;
  myMarks = this.gameState.myMarks;
  selectedMarker = this.gameState.selectedMarker;

  showPodium = this.gameState.showPodium;
  currentRoundWinners = this.gameState.currentRoundWinnersList;

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
  }

  ngOnInit() {
    // Check if joining via URL
    this.route.params.subscribe((params) => {
      if (params['roomId']) {
        this.roomId = params['roomId'];
        // Legacy key (kept for backwards compatibility)
        localStorage.setItem(this.legacyRoomKey, params['roomId']);
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

    this.roomLoading.set(true);

    const session = this.loadPlayerSession(user.uid, roomIdCandidate);
    const legacyMarker = localStorage.getItem(this.legacyMarkerKey);
    const legacyTabla = localStorage.getItem(this.legacyTablaKey);

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
        if (!restoredMarker) {
          this.showMarkerSelector.set(true);
          this.showTablaSelector.set(false);
        } else if (!restoredTabla) {
          this.showMarkerSelector.set(false);
          this.showTablaSelector.set(true);
        } else {
          this.showMarkerSelector.set(false);
          this.showTablaSelector.set(false);
        }

        // Guardar/migrar al formato nuevo para futuras recargas
        this.savePlayerSession(user.uid, roomIdCandidate, {
          markerId: restoredMarker?.id ?? null,
          tabla: restoredTabla,
          marks: this.myMarks(),
        });
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
      };

      await this.roomService.joinRoom(this.roomId, participant);

      // Guardar en localStorage
      this.savePlayerSession(user.uid, this.roomId, {
        markerId: this.selectedMarker()?.id ?? null,
        tabla: this.myTabla().length ? this.myTabla() : null,
        marks: this.myMarks(),
      });

      this.showJoinForm.set(false);
      this.showMarkerSelector.set(true);
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
      });
    }
    this.showMarkerSelector.set(false);

    // Solo mostrar selector de tabla si NO existe tabla previa
    if (this.myTabla().length === 0) {
      this.showTablaSelector.set(true);
    }
  }

  cancelMarkerSelection() {
    this.showMarkerSelector.set(false);
  }

  cancelTablaSelection() {
    this.showTablaSelector.set(false);
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
      this.roomService.updateParticipant(this.roomId, user.uid, {
        tablaId,
        marker: this.selectedMarker()?.id,
        tablaCards: tabla,
        marks: [],
      });
    }
    this.showTablaSelector.set(false);
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
