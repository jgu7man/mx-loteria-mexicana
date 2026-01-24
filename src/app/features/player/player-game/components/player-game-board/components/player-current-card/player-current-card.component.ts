import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardComponent } from '../../../../../../../shared/components/card/card.component';

@Component({
  selector: 'app-player-current-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './player-current-card.component.html',
})
export class PlayerCurrentCardComponent {
  @Input() currentCard: any = null;
  @Input() size: 'small' | 'medium' | 'large' = 'large';
  @Input() showTitle = true;
}
