import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-viewer-join-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './viewer-join-form.component.html',
  styleUrl: './viewer-join-form.component.scss',
})
export class ViewerJoinFormComponent {
  @Input() roomId = '';
  @Output() roomIdChange = new EventEmitter<string>();
  @Output() joinRoom = new EventEmitter<void>();

  onRoomIdChange(value: string) {
    this.roomIdChange.emit(value);
  }

  onSubmit() {
    this.joinRoom.emit();
  }
}
