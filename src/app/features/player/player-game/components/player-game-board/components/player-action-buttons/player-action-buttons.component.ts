import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AuthService } from '../../../../../../../core/services/auth.service';
import { PlayerGameStateService } from '../../../../services/player-game-state.service';

@Component({
  selector: 'app-player-action-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-action-buttons.component.html',
})
export class PlayerActionButtonsComponent {
  private playerState = inject(PlayerGameStateService);
  private authService = inject(AuthService);

  @Input() layout: 'vertical' | 'horizontal' = 'vertical';
  @Input() size: 'small' | 'medium' | 'large' = 'large';
  @Input() compact = false;

  @Output() changeMarker = new EventEmitter<void>();
  @Output() changeTabla = new EventEmitter<void>();

  shoutLoteria() {
    const user = this.authService.currentUser();
    if (user) {
      this.playerState.shoutLoteria(user.uid);
    }
  }

  clearTable() {
    const user = this.authService.currentUser();
    if (user) {
      this.playerState.clearTable(user.uid);
    }
  }
}
