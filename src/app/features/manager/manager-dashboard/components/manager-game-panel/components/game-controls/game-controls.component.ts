import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ManagerGameStateService } from '../../../../services/manager-game-state.service';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-controls.component.html',
  styleUrl: './game-controls.component.scss',
})
export class GameControlsComponent {
  private gameState = inject(ManagerGameStateService);

  room = this.gameState.room;

  @Output() copyInviteLink = new EventEmitter<void>();
  @Output() showQRCode = new EventEmitter<void>();
  @Output() openInvitePage = new EventEmitter<void>();
  @Output() showCardHistory = new EventEmitter<void>();
  @Output() changeDifficulty = new EventEmitter<void>();
  @Output() finishRound = new EventEmitter<void>();
  @Output() deleteRoom = new EventEmitter<void>();

  isRoomActive(state: string): boolean {
    return state === 'playing' || state === 'verifying';
  }

  isRoomWaiting(state: string): boolean {
    return state === 'waiting';
  }
}
