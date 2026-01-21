import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  getRoomStateColors,
  getRoomStateLabel,
} from '../../../../../../../core/constants/room-states';
import { Room } from '../../../../../../../core/models/game.model';

@Component({
  selector: 'app-player-room-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-room-header.component.html',
  styleUrl: './player-room-header.component.css',
})
export class PlayerRoomHeaderComponent {
  @Input() room: Room | null = null;
  @Input() roomId = '';

  @Output() goHome = new EventEmitter<void>();

  getRoomStateLabel(): string {
    return this.room?.state ? getRoomStateLabel(this.room.state) : 'Desconocido';
  }

  getRoomStateColors(): string {
    if (!this.room?.state) return 'bg-gray-100 text-gray-700';
    const colors = getRoomStateColors(this.room.state);
    return `${colors.bg} ${colors.text}`;
  }
}
