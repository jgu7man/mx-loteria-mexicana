import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MARKERS } from '../../../../../core/constants/game-data';
import { Participant } from '../../../../../core/models/game.model';
import { TablaComponent } from '../../../../../shared/components/tabla/tabla.component';

@Component({
  selector: 'app-manager-review-modal',
  standalone: true,
  imports: [CommonModule, TablaComponent],
  templateUrl: './manager-review-modal.component.html',
  styleUrl: './manager-review-modal.component.css',
})
export class ManagerReviewModalComponent {
  @Input() reviewingParticipant: Participant | null = null;
  @Input() isOpen = false;

  @Output() approveWinner = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  getMarkerEmoji(markerId?: string): string {
    if (!markerId) return '🫘';
    return MARKERS.find((m) => m.id === markerId)?.emoji ?? '🫘';
  }
}
