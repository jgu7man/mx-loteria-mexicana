import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Participant } from '../../../core/models/game.model';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css',
})
export class PlayerListComponent {
  @Input() players: Participant[] = [];
  @Input() variant: 'compact' | 'detailed' | 'grid' = 'detailed';
  @Input() maxHeight: string = 'max-h-[300px]';
  @Input() showPhotos: boolean = true;
}
