import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  computed,
  inject,
} from '@angular/core';
import { AuthService } from '../../../../../core/services/auth.service';
import { PlayerListComponent } from '../../../../../shared/components/player-list/player-list.component';
import { TablaComponent } from '../../../../../shared/components/tabla/tabla.component';
import { PlayerGameStateService } from '../../services/player-game-state.service';
import { PlayerActionButtonsComponent } from './components/player-action-buttons/player-action-buttons.component';
import { PlayerCardHistoryComponent } from './components/player-card-history/player-card-history.component';
import { PlayerCurrentCardComponent } from './components/player-current-card/player-current-card.component';
import { PlayerRoomHeaderComponent } from './components/player-room-header/player-room-header.component';

@Component({
  selector: 'app-player-game-board',
  standalone: true,
  imports: [
    CommonModule,
    TablaComponent,
    PlayerListComponent,
    PlayerRoomHeaderComponent,
    PlayerCurrentCardComponent,
    PlayerCardHistoryComponent,
    PlayerActionButtonsComponent,
  ],
  templateUrl: './player-game-board.component.html',
  styles: [
    `
      @media screen and (min-width: 1200px) {
        #tabla-desktop ::ng-deep .card-container {
          width: 10vw;
        }
      }

      @media screen and (max-width: 767px) {
        app-player-card-history {
          display: flex;
          overflow-x: scroll;
          align-items: flex-end;
        }
      }
    `,
  ],
})
export class PlayerGameBoardComponent {
  private playerState = inject(PlayerGameStateService);
  private authService = inject(AuthService);

  // Re-export state from service
  room = this.playerState.room;
  currentCard = this.playerState.currentCard;
  historyCards = this.playerState.historyCards;
  myTabla = this.playerState.myTabla;
  myMarks = this.playerState.myMarks;
  selectedMarkerEmoji = computed(
    () => this.playerState.selectedMarker()?.emoji || '🫘',
  );
  selectedMarkerImage = computed(
    () => this.playerState.selectedMarker()?.image,
  );
  roomId = this.playerState.roomId;
  isWaitingForVerification = this.playerState.isWaitingForVerification;

  // Lista de jugadores (filtrados por role 'player')
  players = computed(() =>
    this.playerState.participants().filter((p) => p.role === 'player'),
  );

  // True si la ronda está activa pero aún no se han cantado cartas
  showWaitingMessage = computed(() => {
    const r = this.room();
    const current = this.currentCard();
    return (r?.state === 'playing' || r?.state === 'verifying') && !current;
  });

  @Output() changeMarker = new EventEmitter<void>();
  @Output() changeTabla = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();

  Math = Math;

  onCardClicked(cardId: number) {
    const user = this.authService.currentUser();
    if (user) {
      this.playerState.toggleMark(user.uid, cardId);
    }
  }

  getRoomStateLabel(): string {
    const room = this.room();
    if (!room) return 'Sin estado';
    switch (room.state) {
      case 'waiting':
        return 'Esperando';
      case 'playing':
        return 'Jugando';
      case 'verifying':
        return 'Verificando';
      case 'finished':
        return 'Finalizada';
      default:
        return room.state;
    }
  }

  getRoomStateColors(): string {
    const room = this.room();
    if (!room) return 'bg-gray-200 text-gray-700';
    switch (room.state) {
      case 'waiting':
        return 'bg-yellow-200 text-yellow-800';
      case 'playing':
        return 'bg-green-200 text-green-800';
      case 'verifying':
        return 'bg-orange-200 text-orange-800';
      case 'finished':
        return 'bg-blue-200 text-blue-800';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  }
}
