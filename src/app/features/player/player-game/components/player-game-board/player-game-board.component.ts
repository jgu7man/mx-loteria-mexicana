import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Room } from '../../../../../core/models/game.model';
import { getRoomStateLabel, getRoomStateColors } from '../../../../../core/constants/room-states';
import { CardComponent } from '../../../../../shared/components/card/card.component';
import { TablaComponent } from '../../../../../shared/components/tabla/tabla.component';

@Component({
  selector: 'app-player-game-board',
  standalone: true,
  imports: [CommonModule, CardComponent, TablaComponent],
  templateUrl: './player-game-board.component.html',
  styleUrl: './player-game-board.component.scss'
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

  onCardClicked(cardId: number) {
    this.cardClicked.emit(cardId);
  }

  onShoutLoteria() {
    this.shoutLoteria.emit();
  }

  onChangeMarker() {
    this.changeMarker.emit();
  }

  onChangeTabla() {
    this.changeTabla.emit();
  }

  onGoHome() {
    this.goHome.emit();
  }

  getRoomStateLabel(): string {
    return this.room?.state ? getRoomStateLabel(this.room.state) : 'Desconocido';
  }

  getRoomStateColors(): string {
    if (!this.room?.state) return 'bg-gray-100 text-gray-700';
    const colors = getRoomStateColors(this.room.state);
    return `${colors.bg} ${colors.text}`;
  }
}
