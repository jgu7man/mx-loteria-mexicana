import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Card } from '../../../core/models/game.model';

@Component({
  selector: 'app-next-card-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './next-card-preview.component.html',
  styleUrl: './next-card-preview.component.css',
})
export class NextCardPreviewComponent {
  @Input() card: Card | null = null;
  @Input() mode: 'private' | 'public' = 'public';
  @Input() title: string = 'SIGUIENTE';
  @Input() subtitle: string = 'LISTA PARA CANTAR';
}
