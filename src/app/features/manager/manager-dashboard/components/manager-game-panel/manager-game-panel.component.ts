import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  effect,
  inject,
} from '@angular/core';
import { MARKERS } from '../../../../../core/constants/game-data';
import {
  getRoomStateColors,
  getRoomStateLabel,
  isRoomActive,
  isRoomWaiting,
} from '../../../../../core/constants/room-states';
import {
  Participant,
  Room,
  RoundWinner,
} from '../../../../../core/models/game.model';
import { NextCardPreviewComponent } from '../../../../../shared/components/next-card-preview/next-card-preview.component';
import { PlayerListComponent } from '../../../../../shared/components/player-list/player-list.component';
import { ManagerGameStateService } from '../../services/manager-game-state.service';
import { ActiveCardDisplayComponent } from './components/active-card-display/active-card-display.component';
import { GameControlsComponent } from './components/game-controls/game-controls.component';
import { GameFinishedBannerComponent } from './components/game-finished-banner/game-finished-banner.component';
import { GameStatsComponent } from './components/game-stats/game-stats.component';
import { VerificationListComponent } from './components/verification-list/verification-list.component';

@Component({
  selector: 'app-manager-game-panel',
  standalone: true,
  imports: [
    CommonModule,
    NextCardPreviewComponent,
    PlayerListComponent,
    GameStatsComponent,
    GameControlsComponent,
    ActiveCardDisplayComponent,
    VerificationListComponent,
    GameFinishedBannerComponent,
  ],
  templateUrl: './manager-game-panel.component.html',
  styleUrl: './manager-game-panel.component.css',
})
export class ManagerGamePanelComponent implements OnInit {
  private gameState = inject(ManagerGameStateService);

  @Input() room!: Room;
  @Input() participants: Participant[] = [];
  @Input() currentRoundWinners: RoundWinner[] = [];

  @Output() startRound = new EventEmitter<void>();
  @Output() nextCard = new EventEmitter<void>();
  @Output() copyInviteLink = new EventEmitter<void>();
  @Output() showQRCode = new EventEmitter<void>();
  @Output() openInvitePage = new EventEmitter<void>();
  @Output() showCardHistory = new EventEmitter<void>();
  @Output() changeDifficulty = new EventEmitter<void>();
  @Output() finishRound = new EventEmitter<void>();
  @Output() deleteRoom = new EventEmitter<void>();
  @Output() reviewParticipant = new EventEmitter<Participant>();

  nextCardPreview = this.gameState.nextCardPreview;
  players = this.gameState.players;

  ngOnInit() {
    // Sync inputs to service
    this.gameState.setRoom(this.room);
    this.gameState.setParticipants(this.participants);
    this.gameState.setCurrentRoundWinners(this.currentRoundWinners);
  }

  constructor() {
    // Keep service in sync with inputs
    effect(() => {
      if (this.room) {
        this.gameState.setRoom(this.room);
      }
    });
  }

  readonly getRoomStateLabel = getRoomStateLabel;
  readonly getRoomStateColors = getRoomStateColors;
  readonly isRoomActive = isRoomActive;
  readonly isRoomWaiting = isRoomWaiting;

  getMarkerEmoji(markerId?: string): string {
    if (!markerId) return '🫘';
    return MARKERS.find((m) => m.id === markerId)?.emoji ?? '🫘';
  }
}
