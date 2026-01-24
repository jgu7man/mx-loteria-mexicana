import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CARDS } from '../../../core/constants/game-data';
import { Participant, Room } from '../../../core/models/game.model';
import { RoomService } from '../../../core/services/room.service';
import { ViewerGameDisplayComponent } from '../viewer-game-display/viewer-game-display.component';
import { ViewerJoinFormComponent } from '../viewer-join-form/viewer-join-form.component';

@Component({
  selector: 'app-viewer-display',
  standalone: true,
  imports: [CommonModule, ViewerJoinFormComponent, ViewerGameDisplayComponent],
  templateUrl: './viewer-display.component.html',
  styles: [`
    #current-card ::ng-deep .card-container {
      width: clamp(150px, 40vw, 300px);
      font-size: clamp(0.8rem, 5cqw, 1.2rem);
    }
    
    #current-card ::ng-deep .card-large .card-emoji {
      font-size: clamp(3rem, 14cqw, 5rem);
    }
    
    #current-card ::ng-deep .card-large .card-name {
      font-size: clamp(1rem, 14cqw, 1.2rem);
    }
    
    @media screen and (min-width: 1200px) {
      #current-card ::ng-deep .card-container {
        width: clamp(200px, 25vw, 300px);
      }
      
      #current-card ::ng-deep .card-large .card-emoji {
        font-size: clamp(4rem, 10cqw, 5rem);
      }
      #current-card ::ng-deep .card-large .card-name {
        font-size: clamp(1.2rem, 10cqw, 1.2rem);
      }
    }
  `],
})
export class ViewerDisplayComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private roomService = inject(RoomService);

  room = signal<Room | null>(null);
  currentCard = signal<any>(null);
  nextCardPreview = computed(() => {
    const r = this.room();
    if (!r) return null;
    const nextIndex = r.currentIndex + 1;
    if (!Array.isArray(r.deck) || nextIndex < 0 || nextIndex >= r.deck.length)
      return null;
    const nextId = r.deck[nextIndex];
    return CARDS.find((c) => c.id === nextId) ?? null;
  });
  recentCards = signal<any[]>([]);
  participants = signal<Participant[]>([]);
  players = computed(() =>
    this.participants().filter((p) => p.role === 'player'),
  );
  roomId = '';
  showJoinForm = signal(true);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const roomId = params['roomId'];
      if (roomId) {
        this.roomId = roomId;
        this.joinRoom();
      }
    });
  }

  async joinRoom() {
    if (!this.roomId.trim()) {
      alert('Por favor ingresa el código de sala');
      return;
    }

    // Si no estamos en la ruta correcta, navegar a ella
    const currentRoomIdInRoute = this.route.snapshot.paramMap.get('roomId');
    if (!currentRoomIdInRoute || currentRoomIdInRoute !== this.roomId) {
      this.router.navigate(['/viewer', this.roomId]);
      return;
    }

    try {
      const room = await this.roomService.getRoom(this.roomId);
      if (!room) {
        alert('Sala no encontrada');
        // Navegar de vuelta al formulario
        this.router.navigate(['/viewer']);
        return;
      }

      // Observe room
      this.roomService.observeRoom(this.roomId).subscribe((r) => {
        this.room.set(r);
        if (r && r.currentIndex >= 0) {
          const cardId = r.deck[r.currentIndex];
          this.currentCard.set(CARDS.find((c) => c.id === cardId));

          // Get recent cards based on difficulty
          let limit = 5; // easy
          if (r.config.viewerDifficulty === 'medium') limit = 2;
          if (r.config.viewerDifficulty === 'hard') limit = 1;

          const recentCardIds = r.deck.slice(
            Math.max(0, r.currentIndex - limit + 1),
            r.currentIndex + 1,
          );
          this.recentCards.set(
            recentCardIds
              .map((id) => CARDS.find((c) => c.id === id))
              .filter((c) => c),
          );
        }
      });

      // Observe participants
      this.roomService
        .observeParticipants(this.roomId)
        .subscribe((participants) => {
          this.participants.set(participants);
        });

      this.showJoinForm.set(false);
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Error al unirse a la sala');
      // Navegar de vuelta al formulario
      this.router.navigate(['/viewer']);
    }
  }

  goHome() {
    // Si está en el formulario, regresar al home
    // Si está viendo una sala, regresar al formulario
    if (this.showJoinForm()) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/viewer']);
    }
  }
}
