import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ManagerGameStateService } from '../../../../services/manager-game-state.service';

@Component({
  selector: 'app-game-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.scss',
})
export class GameStatsComponent {
  private gameState = inject(ManagerGameStateService);

  room = this.gameState.room;

  getRoomStateLabel(state: string): string {
    switch (state) {
      case 'waiting':
        return 'Esperando';
      case 'playing':
        return 'Jugando';
      case 'verifying':
        return 'Verificando';
      case 'finished':
        return 'Terminado';
      default:
        return state;
    }
  }
}
