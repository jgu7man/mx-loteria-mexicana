import { Pipe, PipeTransform } from '@angular/core';
import { GameUtilsService } from '../services/game-utils.service';

/**
 * Pipe para obtener el emoji de un marcador por su ID
 * Uso: {{ markerId | markerEmoji }}
 */
@Pipe({
  name: 'markerEmoji',
  standalone: true,
})
export class MarkerEmojiPipe implements PipeTransform {
  constructor(private gameUtils: GameUtilsService) {}

  transform(markerId: string | null | undefined): string {
    // return this.gameUtils.getMarkerEmoji(markerId);
  }
}
