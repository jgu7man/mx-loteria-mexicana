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
    // Si tiene status explícito, usarlo
    if (player.status) {
      switch (player.status) {
        case 'choosing-marker':
          return '⚙️ Eligiendo marcador';
        case 'choosing-tabla':
          return '📋 Eligiendo tabla';
        case 'changing-marker':
          return '✏️ Cambiando marcador';
        case 'changing-tabla':
          return '🔄 Cambiando tabla';
        case 'waiting-verification':
          return '⏳ En verificación';
        case 'ready':
          return '✅ Listo';
      }
    }

    // Fallback a lógica anterior si no tiene status
    if (!player.marker) return '⚙️ Eligiendo marcador';
    if (!player.tablaCards || player.tablaCards.length === 0)
      return '📋 Eligiendo tabla';
    return '✅ Listo';
  }

  getPlayerStatusColor(player: Participant): string {
    // Si tiene status explícito, usarlo
    if (player.status) {
      switch (player.status) {
        case 'choosing-marker':
        case 'changing-marker':
          return 'text-orange-500';
        case 'choosing-tabla':
        case 'changing-tabla':
          return 'text-blue-500';
        case 'waiting-verification':
          return 'text-yellow-500';
        case 'ready':
          return 'text-green-500';
      }
    }

    // Fallback a lógica anterior
    if (!player.marker) return 'text-orange-500';
    if (!player.tablaCards || player.tablaCards.length === 0)
      return 'text-blue-500';
    return 'text-green-500';
  }
}
