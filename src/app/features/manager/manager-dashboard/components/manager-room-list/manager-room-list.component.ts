import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  getRoomStateColors,
  getRoomStateLabel,
} from '../../../../../core/constants/room-states';
import { AppUser, Room } from '../../../../../core/models/game.model';

@Component({
  selector: 'app-manager-room-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manager-room-list.component.html',
})
export class ManagerRoomListComponent {
  @Input() managerRooms: Room[] = [];
  @Input() loadingRooms = false;
  @Input() currentUser: AppUser | null = null;

  @Output() roomSelected = new EventEmitter<Room>();
  @Output() createRoom = new EventEmitter<{
    roomName: string;
    maxRounds: number;
    difficulty: 'easy' | 'medium' | 'hard';
  }>();

  showCreateForm = false;
  roomName = '';
  maxRounds = 10;
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';

  readonly getRoomStateLabel = getRoomStateLabel;
  readonly getRoomStateColors = getRoomStateColors;

  handleCreateRoom() {
    this.createRoom.emit({
      roomName: this.roomName,
      maxRounds: this.maxRounds,
      difficulty: this.difficulty,
    });
    this.showCreateForm = false;
    this.roomName = '';
    this.maxRounds = 10;
    this.difficulty = 'easy';
  }
}
