import { Component, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../../core/models/game.model';
import { getRandomColor } from '../../../core/constants/game-data';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() card!: Card;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showVerso: boolean = false;
  @Input() isMarked: boolean = false;
  @Input() markerEmoji?: string;
  
  // Random background color
  backgroundColor: string = getRandomColor();
}
