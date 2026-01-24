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
})
export class ManagerReviewModalComponent {
  @Input() reviewingParticipant: Participant | null = null;
  @Input() playedCards: number[] = [];
  @Input() isOpen = false;

  @Output() approveWinner = new EventEmitter<void>();
  @Output() rejectWinner = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  get validation() {
    if (!this.reviewingParticipant?.tablaCards) return null;

    // Convert arrays to sets for faster lookups
    const playedSet = new Set(this.playedCards || []);
    const boardCards = this.reviewingParticipant.tablaCards || [];
    const playerMarks = this.reviewingParticipant.marks || [];

    // 1. Cards on the board that have actually been called
    const validBoardCards = boardCards.filter((c) => playedSet.has(c));

    // 2. Cards on the board that have NOT been called yet
    const missingBoardCards = boardCards.filter((c) => !playedSet.has(c));

    // 3. Invalid Marks: Marks the player put that haven't been called
    // (We only care about marks on their board, though marks are usually card IDs)
    const invalidMarks = playerMarks.filter(
      (m) => boardCards.includes(m) && !playedSet.has(m)
    );

    // 4. Missed Marks: Cards that were called but player didn't mark
    const missedMarks = boardCards.filter(
      (c) => playedSet.has(c) && !playerMarks.includes(c)
    );

    const isFullBoardWin = missingBoardCards.length === 0;

    // Status text
    let status = 'INCOMPLETO';
    let statusColor = 'text-blue-600';
    let message = `Faltan ${missingBoardCards.length} cartas para llenar.`;

    if (invalidMarks.length > 0) {
      status = 'ERROR EN MARCAS';
      statusColor = 'text-red-600';
      message = 'Hay cartas marcadas que no han salido.';
    } else if (isFullBoardWin) {
      status = 'GANADOR';
      statusColor = 'text-green-600';
      message = '¡Lotería válida! Tablero completo.';
    }

    return {
      isFullBoardWin,
      missingCount: missingBoardCards.length,
      invalidMarksCount: invalidMarks.length,
      missedMarksCount: missedMarks.length,
      status,
      statusColor,
      message,
    };
  }

  onApproveWinner() {
    this.approveWinner.emit();
  }

  onRejectWinner() {
    this.rejectWinner.emit();
  }

  getMarkerEmoji(markerId?: string): string {
    if (!markerId) return '🫘';
    return MARKERS.find((m) => m.id === markerId)?.emoji ?? '🫘';
  }
}
