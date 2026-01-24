import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ManagerGameStateService } from '../../../../services/manager-game-state.service';

@Component({
  selector: 'app-game-finished-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-finished-banner.component.html',
  styleUrl: './game-finished-banner.component.scss',
})
export class GameFinishedBannerComponent {
  private gameState = inject(ManagerGameStateService);

  currentRoundWinners = this.gameState.currentRoundWinners;
  room = this.gameState.room;
}
