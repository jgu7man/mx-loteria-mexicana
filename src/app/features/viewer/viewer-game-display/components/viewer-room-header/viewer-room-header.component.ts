import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Room } from '../../../../../core/models/game.model';

@Component({
  selector: 'app-viewer-room-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viewer-room-header.component.html',
  styleUrl: './viewer-room-header.component.css',
})
export class ViewerRoomHeaderComponent {
  @Input() room: Room | null = null;
  @Input() variant: 'desktop' | 'mobile' = 'desktop';
}
