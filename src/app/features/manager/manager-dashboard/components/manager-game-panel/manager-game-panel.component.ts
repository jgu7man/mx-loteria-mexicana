import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MARKERS } from '../../../../../core/constants/game-data';
import {
  getRoomStateColors,
  getRoomStateLabel,
  isRoomActive,
  isRoomWaiting,
} from '../../../../../core/constants/room-states';
import { Card, Participant, Room } from '../../../../../core/models/game.model';
import { CardComponent } from '../../../../../shared/components/card/card.component';

@Component({
  selector: 'app-manager-game-panel',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './manager-game-panel.component.html',
  styleUrl: './manager-game-panel.component.css',
})
export class ManagerGamePanelComponent {
  @Input() room!: Room;
  @Input() currentCard: Card | null = null;
  @Input() nextCardPreview: Card | null = null;
  @Input() nextVersoSuggestion = '';
  @Input() participants: Participant[] = [];
  @Input() players: Participant[] = [];
  @Input() pendingWinners: Participant[] = [];

  @Output() startRound = new EventEmitter<void>();
  @Output() nextCard = new EventEmitter<void>();
  @Output() copyInviteLink = new EventEmitter<void>();
  @Output() showQRCode = new EventEmitter<void>();
  @Output() openInvitePage = new EventEmitter<void>();
  @Output() showCardHistory = new EventEmitter<void>();
  @Output() finishRound = new EventEmitter<void>();
  @Output() deleteRoom = new EventEmitter<void>();
  @Output() reviewParticipant = new EventEmitter<Participant>();

  readonly getRoomStateLabel = getRoomStateLabel;
  readonly getRoomStateColors = getRoomStateColors;
  readonly isRoomActive = isRoomActive;
  readonly isRoomWaiting = isRoomWaiting;

  getMarkerEmoji(markerId?: string): string {
    if (!markerId) return '🫘';
    return MARKERS.find((m) => m.id === markerId)?.emoji ?? '🫘';
  }
}
