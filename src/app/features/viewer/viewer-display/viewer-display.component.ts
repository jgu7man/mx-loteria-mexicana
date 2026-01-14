import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CARDS } from '../../../core/constants/game-data';
import { Room } from '../../../core/models/game.model';
import { RoomService } from '../../../core/services/room.service';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-viewer-display',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './viewer-display.component.html',
  styleUrl: './viewer-display.component.css',
})
export class ViewerDisplayComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private roomService = inject(RoomService);

  room = signal<Room | null>(null);
  currentCard = signal<any>(null);
  recentCards = signal<any[]>([]);
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

    try {
      const room = await this.roomService.getRoom(this.roomId);
      if (!room) {
        alert('Sala no encontrada');
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
            r.currentIndex + 1
          );
          this.recentCards.set(
            recentCardIds
              .map((id) => CARDS.find((c) => c.id === id))
              .filter((c) => c)
          );
        }
      });

      this.showJoinForm.set(false);
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Error al unirse a la sala');
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
