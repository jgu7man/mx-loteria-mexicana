import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CardComponent } from '../../../../../../../shared/components/card/card.component';
import { ManagerGameStateService } from '../../../../services/manager-game-state.service';

@Component({
  selector: 'app-active-card-display',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './active-card-display.component.html',
})
export class ActiveCardDisplayComponent {
  private gameState = inject(ManagerGameStateService);

  currentCard = this.gameState.currentCard;
  room = this.gameState.room;
  nextVersoSuggestion = this.gameState.nextVersoSuggestion;

  @Output() startRound = new EventEmitter<void>();
  @Output() nextCard = new EventEmitter<void>();

  isRoomWaiting(state: string): boolean {
    return state === 'waiting' || state === 'finished';
  }

  isRoomActive(state: string): boolean {
    return state === 'playing' || state === 'verifying';
  }
}
