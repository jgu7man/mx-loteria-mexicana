import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CARDS, MARKERS } from '../../../core/constants/game-data';
import {
  getRoomStateColors,
  getRoomStateLabel,
  isRoomActive,
  isRoomWaiting,
  ROOM_STATES,
} from '../../../core/constants/room-states';
import {
  Participant,
  Room,
  RoomConfig,
  RoundWinner,
} from '../../../core/models/game.model';
import { AuthService } from '../../../core/services/auth.service';
import { GameUtilsService } from '../../../core/services/game-utils.service';
import { RoomService } from '../../../core/services/room.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TablaComponent } from '../../../shared/components/tabla/tabla.component';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, TablaComponent],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css',
})
export class ManagerDashboardComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private roomService = inject(RoomService);
  private gameUtils = inject(GameUtilsService);

  readonly origin = window.location.origin;

  // Signals
  currentUser = this.authService.currentUser;
  isAuthenticated = computed(() => this.currentUser() !== null);
  showCreateForm = signal(false);
  room = signal<Room | null>(null);
  currentCard = signal<any>(null);
  nextCardPreview = computed(() => {
    const r = this.room();
    if (!r) return null;
    const nextIndex = r.currentIndex + 1;
    if (!Array.isArray(r.deck) || nextIndex < 0 || nextIndex >= r.deck.length)
      return null;
    const nextId = r.deck[nextIndex];
    return CARDS.find((c) => c.id === nextId) ?? null;
  });
  nextVersoSuggestion = computed(() => {
    const r = this.room();
    if (!r || isRoomWaiting(r.state)) return '"Presiona Iniciar para barajar"';
    const next = this.nextCardPreview();
    return next?.verso ? `"${next.verso}"` : '"..."';
  });

  participants = signal<Participant[]>([]);
  players = computed(() =>
    this.participants().filter((p) => p.role === 'player')
  );
  reviewingParticipant = signal<Participant | null>(null);
  isReviewModalOpen = computed(() => this.reviewingParticipant() !== null);
  pendingWinners = computed(() => {
    const r = this.room();
    const participants = this.players();
    if (!r || !Array.isArray(r.currentRoundWinners)) return [] as Participant[];
    const winnerIds = new Set(r.currentRoundWinners);
    return participants.filter((p) => winnerIds.has(p.uid));
  });

  activeRoomId = computed(() => this.room()?.id ?? null);
  managerRooms = signal<Room[]>([]);
  loadingRooms = signal(false);

  // Form data
  roomName = '';
  maxRounds = 10;
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';

  // Helpers para el template
  readonly ROOM_STATES = ROOM_STATES;
  readonly getRoomStateLabel = getRoomStateLabel;
  readonly getRoomStateColors = getRoomStateColors;
  readonly isRoomActive = isRoomActive;
  readonly isRoomWaiting = isRoomWaiting;

  constructor() {
    // Effect para detectar cambios en la autenticación
    effect(
      () => {
        const user = this.currentUser();
        console.log(
          'Usuario autenticado:',
          user ? user.displayName : 'No autenticado'
        );

        // Cuando el usuario se autentica, verificar si tiene una sala activa
        if (user) {
          this.restoreActiveRoom();
          this.loadManagerRooms();
        } else {
          this.managerRooms.set([]);
        }
      },
      { allowSignalWrites: true }
    );

    // Mantener lista de participantes en tiempo real para la sala activa
    effect(
      (onCleanup) => {
        const roomId = this.activeRoomId();
        if (!roomId) {
          this.participants.set([]);
          this.reviewingParticipant.set(null);
          return;
        }

        const sub = this.roomService.observeParticipants(roomId).subscribe({
          next: (list) => this.participants.set(list),
          error: (err) => console.error('Error observing participants:', err),
        });
        onCleanup(() => sub.unsubscribe());
      },
      { allowSignalWrites: true }
    );
  }

  private async loadManagerRooms() {
    if (!this.currentUser()?.uid) return;

    this.loadingRooms.set(true);
    try {
      const rooms = await this.roomService.getRoomsByManager(
        this.currentUser()!.uid
      );
      console.log(`🤖 ~ manager-dashboard.component.ts:66 ~ rooms:`, rooms);
      this.managerRooms.set(rooms);
    } catch (error) {
      console.error('Error loading manager rooms:', error);
    } finally {
      this.loadingRooms.set(false);
    }
  }

  private async restoreActiveRoom() {
    const storedRoomId = localStorage.getItem('activeManagerRoom');
    if (storedRoomId) {
      try {
        const room = await this.roomService.getRoom(storedRoomId);

        // Verificar que la sala existe y que el usuario es el manager
        if (room && room.managerId === this.currentUser()?.uid) {
          // Observar la sala
          this.roomService.observeRoom(storedRoomId).subscribe((r) => {
            this.room.set(r);
            if (r && r.currentIndex >= 0) {
              const cardId = r.deck[r.currentIndex];
              this.currentCard.set(CARDS.find((c) => c.id === cardId));
            }
          });
          console.log('Sala activa restaurada:', storedRoomId);
        } else {
          // La sala no existe o no es el manager, limpiar
          localStorage.removeItem('activeManagerRoom');
        }
      } catch (error) {
        console.error('Error restoring room:', error);
        localStorage.removeItem('activeManagerRoom');
      }
    }
  }

  async signInWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error al iniciar sesión');
    }
  }

  toggleCreateForm() {
    this.showCreateForm.set(!this.showCreateForm());
  }

  async createRoom() {
    if (!this.currentUser()?.uid || !this.roomName.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const config: RoomConfig = {
        maxRounds: this.maxRounds,
        viewerDifficulty: this.difficulty,
        allowLateJoin: true,
        autoVerify: false,
      };

      const roomId = await this.roomService.createRoom(
        this.currentUser()!.uid,
        this.currentUser()!.displayName,
        this.roomName,
        config
      );

      // Guardar el ID de la sala en localStorage
      localStorage.setItem('activeManagerRoom', roomId);

      // Observar la sala
      this.roomService.observeRoom(roomId).subscribe((room) => {
        this.room.set(room);
        if (room && room.currentIndex >= 0) {
          const cardId = room.deck[room.currentIndex];
          this.currentCard.set(CARDS.find((c) => c.id === cardId));
        }
      });

      this.showCreateForm.set(false);
      this.loadManagerRooms(); // Recargar la lista de salas
      alert(`¡Sala creada! ID: ${roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error al crear la sala');
    }
  }

  async startRound() {
    const currentRoom = this.room();
    if (!currentRoom) return;

    try {
      await this.roomService.startNewRound(currentRoom.id);
      alert('¡Ronda iniciada!');
    } catch (error) {
      console.error('Error starting round:', error);
      alert('Error al iniciar la ronda');
    }
  }

  async nextCard() {
    const currentRoom = this.room();
    if (!currentRoom) return;

    try {
      await this.roomService.nextCard(currentRoom.id);
    } catch (error) {
      console.error('Error advancing card:', error);
      alert('Error al avanzar carta');
    }
  }

  openViewerView() {
    const currentRoom = this.room();
    if (!currentRoom) return;
    this.router.navigate(['/viewer', currentRoom.id]);
  }

  reviewParticipant(p: Participant) {
    this.reviewingParticipant.set(p);
  }

  clearReview() {
    this.reviewingParticipant.set(null);
  }

  async approveWinner() {
    const currentRoom = this.room();
    const p = this.reviewingParticipant();
    if (!currentRoom || !p) return;

    const winner: RoundWinner = {
      uid: p.uid,
      displayName: p.displayName,
      tablaId: p.tablaId ?? -1,
      marks: p.marks || [],
      verifiedAt: new Date(),
    };

    try {
      await this.roomService.approveWinner(currentRoom.id, winner);
      this.clearReview();
      alert('Ganador registrado (sin finalizar la ronda).');
    } catch (error) {
      console.error('Error approving winner:', error);
      alert('Error al aprobar el ganador');
    }
  }

  getMarkerEmoji(markerId?: string): string {
    if (!markerId) return '🫘';
    return MARKERS.find((m) => m.id === markerId)?.emoji ?? '🫘';
  }

  async finishRound() {
    const currentRoom = this.room();
    if (!currentRoom) return;

    try {
      await this.roomService.finishRound(
        currentRoom.id,
        currentRoom.currentRoundVerifiedWinners || []
      );
      this.clearReview();
      alert('¡Ronda finalizada!');
    } catch (error) {
      console.error('Error finishing round:', error);
      alert('Error al finalizar la ronda');
    }
  }

  goHome() {
    // Limpiar la sala activa al salir
    localStorage.removeItem('activeManagerRoom');
    this.room.set(null);
    this.router.navigate(['/']);
  }

  async deleteRoom() {
    const currentRoom = this.room();
    if (!currentRoom) return;

    if (
      confirm(
        '¿Estás seguro de que quieres eliminar esta sala? Esta acción no se puede deshacer.'
      )
    ) {
      try {
        await this.roomService.deleteRoom(currentRoom.id);
        localStorage.removeItem('activeManagerRoom');
        this.room.set(null);
        this.loadManagerRooms(); // Recargar la lista de salas
        alert('Sala eliminada correctamente');
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Error al eliminar la sala');
      }
    }
  }

  selectRoom(room: Room) {
    // Guardar la sala seleccionada como activa
    localStorage.setItem('activeManagerRoom', room.id);

    // Observar la sala
    this.roomService.observeRoom(room.id).subscribe((r) => {
      this.room.set(r);
      if (r && r.currentIndex >= 0) {
        const cardId = r.deck[r.currentIndex];
        this.currentCard.set(CARDS.find((c) => c.id === cardId));
      }
    });
  }
}
