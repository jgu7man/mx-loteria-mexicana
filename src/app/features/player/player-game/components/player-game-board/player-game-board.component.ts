import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Room } from '../../../../../core/models/game.model';
import { TablaComponent } from '../../../../../shared/components/tabla/tabla.component';
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
    PlayerRoomHeaderComponent,
    PlayerCurrentCardComponent,
    PlayerCardHistoryComponent,
    PlayerActionButtonsComponent,
  ],
  templateUrl: './player-game-board.component.html',
  styles: [`
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
  `],
})
export class PlayerGameBoardComponent {
  @Input() room: Room | null = null;
  @Input() currentCard: any = null;
  @Input() historyCards: any[] = [];
  @Input() myTabla: number[] = [];
  @Input() myMarks: number[] = [];
  @Input() selectedMarker: string = '🫘';
  @Input() roomId = '';

  @Output() cardClicked = new EventEmitter<number>();
  @Output() shoutLoteria = new EventEmitter<void>();
  @Output() changeMarker = new EventEmitter<void>();
  @Output() changeTabla = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();

  Math = Math;

  getRoomStateLabel(): string {
    if (!this.room) return 'Sin estado';
    switch (this.room.state) {
      case 'waiting':
        return 'Esperando';
      case 'playing':
        return 'Jugando';
      case 'finished':
        return 'Finalizada';
      default:
        return this.room.state;
    }
  }

  getRoomStateColors(): string {
    if (!this.room) return 'bg-gray-200 text-gray-700';
    switch (this.room.state) {
      case 'waiting':
        return 'bg-yellow-200 text-yellow-800';
      case 'playing':
        return 'bg-green-200 text-green-800';
      case 'finished':
        return 'bg-blue-200 text-blue-800';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  }
}
