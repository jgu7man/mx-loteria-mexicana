import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Participant, Room } from '../../../core/models/game.model';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-viewer-game-display',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './viewer-game-display.component.html',
  styleUrl: './viewer-game-display.component.scss',
})
export class ViewerGameDisplayComponent {
  @Input() room: Room | null = null;
  @Input() currentCard: any = null;
  @Input() recentCards: any[] = [];
  @Input() players: Participant[] = [];
  @Output() goHome = new EventEmitter<void>();

  onGoHome() {
    this.goHome.emit();
  }
}
