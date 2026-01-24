import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Participant } from '../../../../../../../core/models/game.model';
import { ManagerGameStateService } from '../../../../services/manager-game-state.service';

@Component({
  selector: 'app-verification-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verification-list.component.html',
  styleUrl: './verification-list.component.scss',
})
export class VerificationListComponent {
  private gameState = inject(ManagerGameStateService);

  pendingWinners = this.gameState.pendingWinners;

  @Output() reviewParticipant = new EventEmitter<Participant>();
}
