import { CommonModule } from '@angular/common';
import { Component, Input, computed, signal } from '@angular/core';
import { Participant, RoundWinner } from '../../../core/models/game.model';
import { TablaComponent } from '../tabla/tabla.component';

interface PlayerRanking {
  uid: string;
  displayName: string;
  totalWins: number;
  isWinner: boolean; // Si ganó en la ronda actual
  position: number; // Posición en el ranking general
}

@Component({
  selector: 'app-podium',
  standalone: true,
  imports: [CommonModule, TablaComponent],
  templateUrl: './podium.component.html',
  styleUrl: './podium.component.scss',
})
export class PodiumComponent {
  @Input() winners: RoundWinner[] = [];
  @Input() roundNumber: number = 0;
  @Input() maxRounds: number = 0;
  @Input() isLastRound: boolean = false;

  // Nueva entrada para todos los participantes
  participants = signal<Participant[]>([]);
  @Input() set allParticipants(value: Participant[]) {
    this.participants.set(value);
  }

  // Lista combinada de jugadores (ganadores + otros)
  playerRankings = computed(() => {
    const players = this.participants().filter((p) => p.role === 'player');
    const winnerUids = new Set(this.winners.map((w) => w.uid));

    // Crear mapa de puntuaciones totales usando victories
    const scoreMap = new Map<string, number>();
    players.forEach((p) => {
      scoreMap.set(p.uid, p.victories || 0);
    });

    // Crear lista de rankings
    const rankings: PlayerRanking[] = players.map((p) => ({
      uid: p.uid,
      displayName: p.displayName,
      totalWins: p.victories || 0,
      isWinner: winnerUids.has(p.uid),
      position: 0, // Se calculará después
    }));

    // Ordenar por: 1) ganador de esta ronda, 2) total de victorias, 3) nombre
    rankings.sort((a, b) => {
      if (a.isWinner !== b.isWinner) return a.isWinner ? -1 : 1;
      if (a.totalWins !== b.totalWins) return b.totalWins - a.totalWins;
      return a.displayName.localeCompare(b.displayName);
    });

    // Asignar posiciones
    rankings.forEach((r, i) => (r.position = i + 1));

    // Retornar al menos 10 o todos si hay más
    return rankings.slice(0, Math.max(10, rankings.length));
  });

  getTablaNumber(tablaId: number): number {
    return tablaId + 1;
  }
}
