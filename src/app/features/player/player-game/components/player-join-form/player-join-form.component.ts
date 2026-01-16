import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-join-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-join-form.component.html',
  styleUrl: './player-join-form.component.css',
})
export class PlayerJoinFormComponent {
  @Input() displayName = '';
  @Input() roomId = '';

  @Output() displayNameChange = new EventEmitter<string>();
  @Output() roomIdChange = new EventEmitter<string>();
  @Output() signInAnonymously = new EventEmitter<void>();
  @Output() signInWithGoogle = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();

  onDisplayNameChange(value: string) {
    this.displayName = value;
    this.displayNameChange.emit(value);
  }

  onRoomIdChange(value: string) {
    this.roomId = value;
    this.roomIdChange.emit(value);
  }

  onSignInAnonymously() {
    this.signInAnonymously.emit();
  }

  onSignInWithGoogle() {
    this.signInWithGoogle.emit();
  }
}
