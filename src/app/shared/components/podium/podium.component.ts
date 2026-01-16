import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RoundWinner } from '../../../core/models/game.model';
import { TablaComponent } from '../tabla/tabla.component';

@Component({
  selector: 'app-podium',
  standalone: true,
  imports: [CommonModule, TablaComponent],
  templateUrl: './podium.component.html',
  styleUrl: './podium.component.css',
})
export class PodiumComponent {
  @Input() winners: RoundWinner[] = [];
  @Input() roundNumber: number = 0;
  @Input() maxRounds: number = 0;
  @Input() isLastRound: boolean = false;

  getTablaNumber(tablaId: number): number {
    return tablaId + 1;
  }
}
