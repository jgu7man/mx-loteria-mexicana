import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RoomService } from '../../../core/services/room.service';
import { GameUtilsService } from '../../../core/services/game-utils.service';
import { MarkerComponent } from '../../../shared/components/marker/marker.component';
import { TablaComponent } from '../../../shared/components/tabla/tabla.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { Room, Participant, Marker } from '../../../core/models/game.model';
import { CARDS } from '../../../core/constants/game-data';

@Component({
  selector: 'app-player-game',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkerComponent, TablaComponent, CardComponent],
  templateUrl: './player-game.component.html',
  styleUrl: './player-game.component.css'
})
export class PlayerGameComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private roomService = inject(RoomService);
  private gameUtils = inject(GameUtilsService);

  // Signals
  currentUser = this.authService.currentUser;
  room = signal<Room | null>(null);
  participant = signal<Participant | null>(null);
  currentCard = signal<any>(null);
  
  // UI state
  roomId = '';
  displayName = '';
  showJoinForm = signal(true);
  showMarkerSelector = signal(false);
  showTablaSelector = signal(false);
  selectedMarker = signal<Marker | null>(null);
  myTabla = signal<number[]>([]);
  myMarks = signal<number[]>([]);

  // Available tablas (simplified - just generate 10 for demo)
  availableTablas = signal<number[][]>([]);

  ngOnInit() {
    // Check if joining via URL
    this.route.params.subscribe(params => {
      if (params['roomId']) {
        this.roomId = params['roomId'];
      }
    });

    // Generate some tablas
    this.availableTablas.set(this.gameUtils.generateMultipleTablas(10));
  }

  async signInAnonymously() {
    if (!this.displayName.trim() || !this.roomId.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      await this.authService.signInAnonymously(this.displayName);
      
      // Check if room exists
      const room = await this.roomService.getRoom(this.roomId);
      if (!room) {
        alert('Sala no encontrada');
        return;
      }

      // Join room
      const participant: Omit<Participant, 'joinedAt'> = {
        uid: this.currentUser()!.uid,
        displayName: this.displayName,
        role: 'player',
        marks: [],
        victories: 0,
        isActive: true
      };

      await this.roomService.joinRoom(this.roomId, participant);
      
      // Observe room
      this.roomService.observeRoom(this.roomId).subscribe(r => {
        this.room.set(r);
        if (r && r.currentIndex >= 0) {
          const cardId = r.deck[r.currentIndex];
          this.currentCard.set(CARDS.find(c => c.id === cardId));
        }
      });

      this.showJoinForm.set(false);
      this.showMarkerSelector.set(true);
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Error al unirse a la sala');
    }
  }

  onMarkerSelected(marker: Marker) {
    this.selectedMarker.set(marker);
    this.showMarkerSelector.set(false);
    this.showTablaSelector.set(true);
  }

  selectTabla(tabla: number[]) {
    this.myTabla.set(tabla);
    this.myMarks.set([]);
    this.showTablaSelector.set(false);

    // Update participant in Firestore
    if (this.currentUser()) {
      const tablaId = this.availableTablas().indexOf(tabla);
      this.roomService.updateParticipant(this.roomId, this.currentUser()!.uid, {
        tablaId,
        marker: this.selectedMarker()?.id
      });
    }
  }

  async onCardClicked(cardId: number) {
    const marks = this.myMarks();
    if (marks.includes(cardId)) {
      // Unmark
      await this.roomService.unmarkCard(this.roomId, this.currentUser()!.uid, cardId);
      this.myMarks.set(marks.filter(id => id !== cardId));
    } else {
      // Mark
      await this.roomService.markCard(this.roomId, this.currentUser()!.uid, cardId);
      this.myMarks.set([...marks, cardId]);
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
