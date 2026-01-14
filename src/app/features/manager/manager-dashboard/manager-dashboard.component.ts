import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
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
import { PodiumComponent } from '../../../shared/components/podium/podium.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { TablaComponent } from '../../../shared/components/tabla/tabla.component';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, TablaComponent, PodiumComponent],
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
  
  showPodium = computed(() => {
    const r = this.room();
    if (!r) return false;
    // Show podium when round finishes (winners verified and round completed)
    return (
      r.state === ROOM_STATES.FINISHED ||
      (r.state === ROOM_STATES.WAITING && 
       r.currentRound > 0 && 
       r.roundHistory.length > 0 &&
       r.roundHistory[r.roundHistory.length - 1]?.roundNumber === r.currentRound - 1)
    );
  });
  
  currentRoundWinners = computed(() => {
    const r = this.room();
    if (!r || !this.showPodium()) return [];
    
    // If finished, show all winners from last round
    if (r.state === ROOM_STATES.FINISHED && r.roundHistory.length > 0) {
      return r.roundHistory[r.roundHistory.length - 1]?.winners || [];
    }
    
    // If waiting for next round, show winners from previous round
    if (r.state === ROOM_STATES.WAITING && r.roundHistory.length > 0) {
      const lastRound = r.roundHistory[r.roundHistory.length - 1];
      if (lastRound?.roundNumber === r.currentRound - 1) {
        return lastRound.winners || [];
      }
    }
    
    return [];
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
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'No se pudo iniciar sesión con Google',
        confirmButtonColor: '#6366f1',
      });
    }
  }

  toggleCreateForm() {
    this.showCreateForm.set(!this.showCreateForm());
  }

  async createRoom() {
    if (!this.currentUser()?.uid || !this.roomName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos',
        confirmButtonColor: '#6366f1',
      });
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
      Swal.fire({
        icon: 'success',
        title: '¡Sala creada!',
        html: `<p class="text-gray-600">ID de la sala:</p><p class="text-2xl font-bold text-indigo-600">${roomId}</p>`,
        confirmButtonColor: '#6366f1',
      });
    } catch (error) {
      console.error('Error creating room:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear la sala',
        text: 'No se pudo crear la sala. Intenta nuevamente.',
        confirmButtonColor: '#6366f1',
      });
    }
  }

  async startRound() {
    const currentRoom = this.room();
    if (!currentRoom) return;

    try {
      await this.roomService.startNewRound(currentRoom.id);
      Swal.fire({
        icon: 'success',
        title: '¡Ronda iniciada!',
        text: 'Las cartas han sido barajadas',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error starting round:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar la ronda',
        confirmButtonColor: '#6366f1',
      });
    }
  }

  async nextCard() {
    const currentRoom = this.room();
    if (!currentRoom) return;

    try {
      await this.roomService.nextCard(currentRoom.id);
    } catch (error) {
      console.error('Error advancing card:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al avanzar carta',
        confirmButtonColor: '#6366f1',
      });
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
      Swal.fire({
        icon: 'success',
        title: '¡Ganador registrado!',
        text: 'La ronda continúa',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error approving winner:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al aprobar el ganador',
        confirmButtonColor: '#6366f1',
      });
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
      Swal.fire({
        icon: 'success',
        title: '¡Ronda finalizada!',
        text: 'Los ganadores han sido registrados',
        confirmButtonColor: '#6366f1',
      });
    } catch (error) {
      console.error('Error finishing round:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al finalizar la ronda',
        confirmButtonColor: '#6366f1',
      });
    }
  }

  goHome() {
    // Limpiar la sala activa al salir
    localStorage.removeItem('activeManagerRoom');
    this.room.set(null);
    this.router.navigate(['/']);
  }

  async copyInviteLink() {
    const currentRoom = this.room();
    if (!currentRoom?.inviteLink) return;

    try {
      await navigator.clipboard.writeText(currentRoom.inviteLink);
      Swal.fire({
        icon: 'success',
        title: '¡Link copiado!',
        text: 'El link de invitación ha sido copiado al portapapeles',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error copying link:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al copiar',
        text: 'No se pudo copiar el link. Inténtalo nuevamente.',
        confirmButtonColor: '#6366f1',
      });
    }
  }

  showQRCode() {
    const currentRoom = this.room();
    if (!currentRoom?.inviteLink) return;

    // Generate QR code URL using a public API
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentRoom.inviteLink)}`;

    Swal.fire({
      title: 'Código QR',
      html: `
        <div class="text-center">
          <p class="text-gray-600 mb-4">Escanea este código para unirte</p>
          <img src="${qrCodeUrl}" alt="QR Code" class="mx-auto rounded-lg shadow-lg" />
          <p class="text-sm text-gray-500 mt-4 break-all">${currentRoom.inviteLink}</p>
        </div>
      `,
      confirmButtonColor: '#6366f1',
      confirmButtonText: 'Cerrar',
      width: 400,
    });
  }

  showCardHistory() {
    const currentRoom = this.room();
    if (!currentRoom) return;

    const historyCards = currentRoom.deck
      .slice(0, currentRoom.currentIndex + 1)
      .map((id) => CARDS.find((c) => c.id === id))
      .filter((c): c is typeof CARDS[number] => c != null);

    if (historyCards.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin historial',
        text: 'Aún no se han cantado cartas en esta ronda',
        confirmButtonColor: '#6366f1',
      });
      return;
    }

    const cardsHtml = historyCards
      .map(
        (card) => `
        <div class="inline-block m-2 p-3 rounded-lg shadow-md" style="background-color: ${card.color}20; border: 2px solid ${card.color}">
          <div class="text-4xl mb-1">${card.emoji}</div>
          <div class="text-sm font-bold text-gray-800">${card.name}</div>
        </div>
      `
      )
      .join('');

    Swal.fire({
      title: `Historial de Cartas (${historyCards.length})`,
      html: `
        <div class="max-h-96 overflow-y-auto">
          ${cardsHtml}
        </div>
      `,
      confirmButtonColor: '#6366f1',
      confirmButtonText: 'Cerrar',
      width: 600,
    });
  }

  async deleteRoom() {
    const currentRoom = this.room();
    if (!currentRoom) return;

    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar sala?',
      text: 'Esta acción no se puede deshacer',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await this.roomService.deleteRoom(currentRoom.id);
        localStorage.removeItem('activeManagerRoom');
        this.room.set(null);
        this.loadManagerRooms(); // Recargar la lista de salas
        Swal.fire({
          icon: 'success',
          title: 'Sala eliminada',
          text: 'La sala ha sido eliminada correctamente',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Error deleting room:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar la sala',
          confirmButtonColor: '#6366f1',
        });
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
