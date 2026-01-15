import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MARKERS } from '../../../../core/constants/game-data';
import { Participant } from '../../../../core/models/game.model';
import { TablaComponent } from '../../../../shared/components/tabla/tabla.component';

@Component({
  selector: 'app-manager-review-modal',
  standalone: true,
  imports: [CommonModule, TablaComponent],
  template: `
    <!-- Modal de revisión de tabla -->
    <div
      *ngIf="isOpen"
      class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div class="bg-white w-full max-w-3xl rounded-lg p-6 shadow-md flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-start gap-4">
          <div>
            <h3 class="text-xl font-bold text-gray-900">
              Verificando a {{ reviewingParticipant?.displayName }}
            </h3>
            <p class="text-sm text-gray-500">Revisa marcas y tabla del jugador</p>
          </div>
          <button (click)="closeModal.emit()" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div class="mt-6 flex-1 min-h-0 overflow-auto">
          <div *ngIf="!(reviewingParticipant?.tablaCards?.length)" class="text-gray-600">
            Este jugador todavía no tiene tabla registrada.
          </div>

          <div *ngIf="reviewingParticipant?.tablaCards?.length" class="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto">
            <app-tabla
              [tablaCards]="reviewingParticipant?.tablaCards || []"
              [marks]="reviewingParticipant?.marks || []"
              [markerEmoji]="getMarkerEmoji(reviewingParticipant?.marker)"
              [isInteractive]="false"
              [size]="'medium'">
            </app-tabla>
          </div>
        </div>

        <div class="mt-6 flex gap-3 justify-end">
          <button
            (click)="closeModal.emit()"
            class="bg-gray-200 text-gray-800 px-5 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
            Cerrar
          </button>
          <button
            (click)="approveWinner.emit()"
            class="bg-green-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
            Dar el gane
          </button>
        </div>
      </div>
    </div>
  `,
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
