import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardComponent } from '../../../../../../../shared/components/card/card.component';

@Component({
  selector: 'app-player-card-history',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './player-card-history.component.html',
  styleUrl: './player-card-history.component.css',
})
export class PlayerCardHistoryComponent {
  @Input() historyCards: any[] = [];
  @Input() maxCards = 3;

  Math = Math;
}
