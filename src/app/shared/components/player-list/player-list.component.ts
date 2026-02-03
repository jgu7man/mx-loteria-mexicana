import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Participant } from '../../../core/models/game.model';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-list.component.html',
  styles: [':host { display: block; }'],
})
export class PlayerListComponent {
  @Input() players: Participant[] = [];
  @Input() variant: 'compact' | 'detailed' | 'grid' = 'detailed';
  @Input() maxHeight: string = 'max-h-[300px]';
  @Input() showPhotos: boolean = true;

  getPlayerStatus(player: Participant): string {
    if (!player.marker) return '⚙️ Eligiendo marcador';
    if (!player.tablaCards || player.tablaCards.length === 0)
      return '📋 Eligiendo tabla';
    return '✅ Listo';
  }

  getPlayerStatusColor(player: Participant): string {
    if (!player.marker) return 'text-orange-500';
    if (!player.tablaCards || player.tablaCards.length === 0)
      return 'text-blue-500';
    return 'text-green-500';
  }
}
