import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardComponent } from '../../../../../shared/components/card/card.component';

@Component({
  selector: 'app-viewer-current-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './viewer-current-card.component.html',
})
export class ViewerCurrentCardComponent {
  @Input() currentCard: any = null;
  @Input() size: 'small' | 'medium' | 'large' = 'large';
  @Input() showVerso = true;
}
