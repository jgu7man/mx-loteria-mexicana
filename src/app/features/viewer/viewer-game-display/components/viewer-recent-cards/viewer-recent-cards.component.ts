import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardComponent } from '../../../../../shared/components/card/card.component';

@Component({
  selector: 'app-viewer-recent-cards',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './viewer-recent-cards.component.html',
  styleUrl: './viewer-recent-cards.component.scss',
})
export class ViewerRecentCardsComponent {
  @Input() recentCards: any[] = [];
  @Input() variant: 'desktop' | 'mobile' = 'desktop';
}
