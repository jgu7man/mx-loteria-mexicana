import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-player-action-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-action-buttons.component.html',
})
export class PlayerActionButtonsComponent {
  @Input() layout: 'vertical' | 'horizontal' = 'vertical';
  @Input() size: 'small' | 'medium' | 'large' = 'large';
  @Input() compact = false;

  @Output() shoutLoteria = new EventEmitter<void>();
  @Output() changeMarker = new EventEmitter<void>();
  @Output() changeTabla = new EventEmitter<void>();
}
