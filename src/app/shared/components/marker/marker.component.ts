import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MARKERS } from '../../../core/constants/game-data';
import { Marker } from '../../../core/models/game.model';

@Component({
  selector: 'app-marker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marker.component.html',
  styleUrl: './marker.component.scss'
})
export class MarkerComponent {
  markers = MARKERS;
  selectedMarker: Marker | null = null;
  
  @Output() markerSelected = new EventEmitter<Marker>();

  selectMarker(marker: Marker): void {
    this.selectedMarker = marker;
    this.markerSelected.emit(marker);
  }

  isSelected(marker: Marker): boolean {
    return this.selectedMarker?.id === marker.id;
  }
}
