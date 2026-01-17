import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CARDS } from '../../../core/constants/game-data';
import { Card } from '../../../core/models/game.model';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './tabla.component.html',
  styleUrl: './tabla.component.css',
})
export class TablaComponent {
  @Input() tablaCards: number[] = []; // IDs de las 16 cartas
  @Input() marks: number[] = []; // IDs de las cartas marcadas
  @Input() markerEmoji: string = '🫘'; // Emoji del marcador
  @Input() isInteractive: boolean = true; // Si se puede hacer click
  @Input() size: 'small' | 'medium' | 'large' = 'small';

  @Output() cardClicked = new EventEmitter<number>();

  // Obtener el objeto Card completo por ID
  getCard(cardId: number): Card | undefined {
    return CARDS.find((c) => c.id === cardId);
  }

  // Verificar si una carta está marcada
  isMarked(cardId: number): boolean {
    return this.marks.includes(cardId);
  }

  // Manejar click en una carta
  onCardClick(cardId: number): void {
    console.log(
      `🤖 ~ tabla.component.ts:35 ~ this.isInteractive:`,
      this.isInteractive
    );
    if (this.isInteractive) {
      this.cardClicked.emit(cardId);
    }
  }
}
