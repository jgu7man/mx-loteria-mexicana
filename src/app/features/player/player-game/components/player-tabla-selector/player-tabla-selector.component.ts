import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CARDS } from '../../../../../core/constants/game-data';

@Component({
  selector: 'app-player-tabla-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-tabla-selector.component.html',
  styleUrl: './player-tabla-selector.component.css'
})
export class PlayerTablaSelectorComponent {
  @Input() availableTablas: number[][] = [];
  @Input() showCancelButton = false;
  
  @Output() tablaSelected = new EventEmitter<number[]>();
  @Output() cancel = new EventEmitter<void>();

  selectTabla(tabla: number[]) {
    this.tablaSelected.emit(tabla);
  }

  onCancel() {
    this.cancel.emit();
  }

  getCardsByIds(cardIds: number[]): any[] {
    return cardIds
      .map((id) => CARDS.find((c) => c.id === id))
      .filter((c) => c !== undefined);
  }
}
