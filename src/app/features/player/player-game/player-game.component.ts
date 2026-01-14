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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CARDS, MARKERS } from '../../../core/constants/game-data';
import { Marker, Participant, Room } from '../../../core/models/game.model';
import { AuthService } from '../../../core/services/auth.service';
import { GameUtilsService } from '../../../core/services/game-utils.service';
import { RoomService } from '../../../core/services/room.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { MarkerComponent } from '../../../shared/components/marker/marker.component';
import { TablaComponent } from '../../../shared/components/tabla/tabla.component';

@Component({
  selector: 'app-player-game',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MarkerComponent,
    TablaComponent,
    CardComponent,
  ],
  templateUrl: './player-game.component.html',
  styleUrl: './player-game.component.css',
})
export class PlayerGameComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private roomService = inject(RoomService);
  private gameUtils = inject(GameUtilsService);
  private destroyRef = inject(DestroyRef);

  // Expose Math for template
  Math = Math;

  // Signals
  currentUser = this.authService.currentUser;
  room = signal<Room | null>(null);
  participant = signal<Participant | null>(null);
  currentCard = signal<any>(null);
  historyCards = computed(() => {
    const r = this.room();
    if (!r || r.currentIndex < 0 || !Array.isArray(r.deck)) return [];

    // Determinar cuántas cartas mostrar según dificultad
    let limit = 3; // easy (default)
    if (r.config.viewerDifficulty === 'medium') limit = 1;
    if (r.config.viewerDifficulty === 'hard') limit = 0;

    if (limit === 0) return [];

    // Obtener las últimas N cartas (excluyendo la actual)
    const startIndex = Math.max(0, r.currentIndex - limit);
    const historyIds = r.deck.slice(startIndex, r.currentIndex);

    return historyIds
      .map((id) => CARDS.find((c) => c.id === id))
      .filter((c) => c !== undefined)
      .reverse(); // Más reciente primero
  });

  // UI state
  roomId = '';
  displayName = '';
  showJoinForm = signal(true);
  showMarkerSelector = signal(false);
  showTablaSelector = signal(false);
  selectedMarker = signal<Marker | null>(null);
  myTabla = signal<number[]>([]);
  myMarks = signal<number[]>([]);

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
          console.log('Jugador autenticado:', user.displayName);
          this.restorePlayerSession();
        }
      },
      { allowSignalWrites: true }
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
    this.availableTablas.set(this.gameUtils.generateMultipleTablas(10));
  }

  private async restorePlayerSession() {
    const user = this.currentUser();
    if (!user) return;

    const roomIdCandidate =
      this.roomId || localStorage.getItem(this.legacyRoomKey) || '';
    if (!roomIdCandidate) return;

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
          // La sala no existe, limpiar
          this.clearPlayerSession(user.uid, roomIdCandidate);
          return;
        }

        this.roomId = roomIdCandidate;

        // Observar la sala
        this.roomService.observeRoom(roomIdCandidate).subscribe((r) => {
          this.room.set(r);
          if (r && r.currentIndex >= 0) {
            const cardId = r.deck[r.currentIndex];
            this.currentCard.set(CARDS.find((c) => c.id === cardId));
          }
        });

        // Restaurar marcador por id
        const restoredMarker = markerId
          ? MARKERS.find((m) => m.id === markerId) ?? null
          : null;
        this.selectedMarker.set(restoredMarker);

        // Restaurar tabla (si existe y es válida)
        const restoredTabla =
          Array.isArray(tabla) && tabla.length > 0 ? tabla : null;
        if (restoredTabla) {
          this.myTabla.set(restoredTabla);
        }

        // Restaurar marcas (fallback; la fuente de verdad es Firestore)
        if (Array.isArray(marks) && marks.length > 0) {
          this.myMarks.set(marks);
        }

        // Mantener el participante (incl. marcas) en tiempo real
        this.roomService
          .observeParticipant(roomIdCandidate, user.uid)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((p) => {
            this.participant.set(p);
            if (p?.marks) this.myMarks.set(p.marks);
            if (p?.tablaCards && this.myTabla().length === 0) {
              this.myTabla.set(p.tablaCards);
            }
          });

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
        // Si no hay marcador/tabla guardados, NO mostrar la vista del juego vacía.
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

        console.log('Sesión de jugador restaurada');
      } catch (error) {
        console.error('Error restoring player session:', error);
        this.clearPlayerSession(user.uid, roomIdCandidate);
      }
    }
  }

  private getPlayerSessionKey(uid: string, roomId: string) {
    return `player-session:${uid}:${roomId}`;
  }

  private loadPlayerSession(
    uid: string,
    roomId: string
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
    data: { markerId: string | null; tabla: number[] | null; marks?: number[] }
  ) {
    localStorage.setItem(
      this.getPlayerSessionKey(uid, roomId),
      JSON.stringify(data)
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
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    try {
      // Check if already authenticated
      if (!this.currentUser()) {
        await this.authService.signInAnonymously(this.displayName);
      }

      await this.joinRoom();
    } catch (error: any) {
      console.error('Error joining room:', error);

      if (error.code === 'auth/admin-restricted-operation') {
        Swal.fire({
          icon: 'error',
          title: 'Autenticación deshabilitada',
          text: 'La autenticación anónima no está habilitada. Por favor, usa "Entrar con Google"',
          confirmButtonColor: '#10b981',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al unirse',
          text: error.message || 'No se pudo unirse a la sala',
          confirmButtonColor: '#10b981',
        });
      }
    }
  }

  async signInWithGoogle() {
    if (!this.roomId.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Código requerido',
        text: 'Por favor ingresa el código de la sala',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    try {
      await this.authService.signInWithGoogle();
      // Use the Google display name
      this.displayName = this.currentUser()!.displayName;

      await this.joinRoom();
    } catch (error: any) {
      console.error('Error joining room:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al unirse',
        text: error.message || 'No se pudo unirse a la sala',
        confirmButtonColor: '#10b981',
      });
    }
  }

  private async joinRoom() {
    // Check if room exists
    const room = await this.roomService.getRoom(this.roomId);
    if (!room) {
      Swal.fire({
        icon: 'error',
        title: 'Sala no encontrada',
        text: 'Verifica el código e inténtalo nuevamente',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    // Join room
    const participant: Omit<Participant, 'joinedAt'> = {
      uid: this.currentUser()!.uid,
      displayName: this.displayName || this.currentUser()!.displayName,
      role: 'player',
      marks: [],
      victories: 0,
      isActive: true,
    };

    await this.roomService.joinRoom(this.roomId, participant);

    // Guardar en localStorage (nuevo + legacy)
    this.savePlayerSession(this.currentUser()!.uid, this.roomId, {
      markerId: this.selectedMarker()?.id ?? null,
      tabla: this.myTabla().length ? this.myTabla() : null,
      marks: this.myMarks(),
    });

    // Mantener el participante (incl. marcas) en tiempo real
    this.roomService
      .observeParticipant(this.roomId, this.currentUser()!.uid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((p) => {
        this.participant.set(p);
        if (p?.marks) this.myMarks.set(p.marks);
      });

    // Observe room
    this.roomService.observeRoom(this.roomId).subscribe((r) => {
      this.room.set(r);
      if (r && r.currentIndex >= 0) {
        const cardId = r.deck[r.currentIndex];
        this.currentCard.set(CARDS.find((c) => c.id === cardId));
      }
    });

    this.showJoinForm.set(false);
    this.showMarkerSelector.set(true);
  }

  onMarkerSelected(marker: Marker) {
    this.selectedMarker.set(marker);
    if (this.currentUser() && this.roomId) {
      this.savePlayerSession(this.currentUser()!.uid, this.roomId, {
        markerId: marker.id,
        tabla: this.myTabla().length ? this.myTabla() : null,
        marks: this.myMarks(),
      });

      // Actualizar marcador en Firestore
      this.roomService.updateParticipant(this.roomId, this.currentUser()!.uid, {
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

  getCardsByIds(cardIds: number[]): any[] {
    return cardIds
      .map((id) => CARDS.find((c) => c.id === id))
      .filter((c) => c !== undefined);
  }

  selectTabla(tabla: number[]) {
    this.myTabla.set(tabla);
    this.myMarks.set([]);
    if (this.currentUser() && this.roomId) {
      this.savePlayerSession(this.currentUser()!.uid, this.roomId, {
        markerId: this.selectedMarker()?.id ?? null,
        tabla,
        marks: [],
      });
    }
    this.showTablaSelector.set(false);

    // Update participant in Firestore
    if (this.currentUser()) {
      const tablaId = this.availableTablas().indexOf(tabla);
      this.roomService.updateParticipant(this.roomId, this.currentUser()!.uid, {
        tablaId,
        marker: this.selectedMarker()?.id,
        tablaCards: tabla,
        marks: [],
      });
    }
  }

  async shoutLoteria() {
    if (!this.currentUser() || !this.roomId) return;
    try {
      // Asegurar que la tabla esté registrada antes de pedir verificación
      const syncUpdates: Partial<Participant> = {};
      const markerId = this.selectedMarker()?.id;
      const tablaCards = this.myTabla();
      if (markerId) syncUpdates.marker = markerId;
      if (Array.isArray(tablaCards) && tablaCards.length > 0) {
        syncUpdates.tablaCards = tablaCards;
      }
      if (Object.keys(syncUpdates).length > 0) {
        await this.roomService.updateParticipant(
          this.roomId,
          this.currentUser()!.uid,
          syncUpdates
        );
      }

      await this.roomService.addWinner(this.roomId, this.currentUser()!.uid);
      Swal.fire({
        icon: 'success',
        title: '¡Solicitud enviada!',
        text: 'El gritón verificará tu tabla',
        confirmButtonColor: '#10b981',
      });
    } catch (error: any) {
      console.error('Error shouting lotería:', error);
      Swal.fire({
        icon: 'error',
        title: 'No se pudo enviar',
        text: error.message || 'Intenta nuevamente',
        confirmButtonColor: '#10b981',
      });
    }
  }

  async onCardClicked(cardId: number) {
    const marks = this.myMarks();
    if (marks.includes(cardId)) {
      // Unmark
      await this.roomService.unmarkCard(
        this.roomId,
        this.currentUser()!.uid,
        cardId
      );
      const updated = marks.filter((id) => id !== cardId);
      this.myMarks.set(updated);
      this.savePlayerSession(this.currentUser()!.uid, this.roomId, {
        markerId: this.selectedMarker()?.id ?? null,
        tabla: this.myTabla().length ? this.myTabla() : null,
        marks: updated,
      });
    } else {
      // Mark
      await this.roomService.markCard(
        this.roomId,
        this.currentUser()!.uid,
        cardId
      );
      const updated = [...marks, cardId];
      this.myMarks.set(updated);
      this.savePlayerSession(this.currentUser()!.uid, this.roomId, {
        markerId: this.selectedMarker()?.id ?? null,
        tabla: this.myTabla().length ? this.myTabla() : null,
        marks: updated,
      });
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
