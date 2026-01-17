import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Card } from '../../../core/models/game.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() card!: Card;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showVerso: boolean = false;
  @Input() isMarked: boolean = false;
  @Input() markerEmoji?: string;

  imageError = false;

  // Use the color from the card itself (each card has a predefined color)
  get backgroundColor(): string {
    return this.card?.color || '#667eea';
  }

  onImageError(event: Event) {
    this.imageError = true;
  }
}
