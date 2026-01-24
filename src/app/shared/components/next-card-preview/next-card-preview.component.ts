import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Card } from '../../../core/models/game.model';

@Component({
  selector: 'app-next-card-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './next-card-preview.component.html',
  styles: [`
    .next-card-container {
      transition: all 0.3s ease;
    }
    
    .next-card-container:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
  `],
})
export class NextCardPreviewComponent {
  @Input() card: Card | null = null;
  @Input() mode: 'private' | 'public' = 'public';
}
