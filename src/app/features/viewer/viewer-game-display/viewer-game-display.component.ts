import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Participant, Room } from '../../../core/models/game.model';
import { PlayerListComponent } from '../../../shared/components/player-list/player-list.component';
import { ViewerCurrentCardComponent } from './components/viewer-current-card/viewer-current-card.component';
import { ViewerRecentCardsComponent } from './components/viewer-recent-cards/viewer-recent-cards.component';
import { ViewerRoomHeaderComponent } from './components/viewer-room-header/viewer-room-header.component';

@Component({
  selector: 'app-viewer-game-display',
  standalone: true,
  imports: [
    CommonModule,
    PlayerListComponent,
    ViewerRoomHeaderComponent,
    ViewerCurrentCardComponent,
    ViewerRecentCardsComponent,
  ],
  templateUrl: './viewer-game-display.component.html',
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
