import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RoomService } from '../../../core/services/room.service';
import { GameUtilsService } from '../../../core/services/game-utils.service';
import { CardComponent } from '../../../shared/components/card/card.component';
import { CARDS } from '../../../core/constants/game-data';
import { Room, RoomConfig } from '../../../core/models/game.model';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css'
})
export class ManagerDashboardComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private roomService = inject(RoomService);
  private gameUtils = inject(GameUtilsService);

  // Signals
  currentUser = this.authService.currentUser;
  isAuthenticated = signal(false);
  showCreateForm = signal(false);
  room = signal<Room | null>(null);
  currentCard = signal<any>(null);

  // Form data
  roomName = '';
  maxRounds = 10;
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';

  ngOnInit() {
    this.isAuthenticated.set(this.authService.isAuthenticated());
  }

  async signInWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
      this.isAuthenticated.set(true);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error al iniciar sesión');
    }
  }

  toggleCreateForm() {
    this.showCreateForm.set(!this.showCreateForm());
  }

  async createRoom() {
    if (!this.currentUser()?.uid || !this.roomName.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      const config: RoomConfig = {
        maxRounds: this.maxRounds,
        viewerDifficulty: this.difficulty,
        allowLateJoin: true,
        autoVerify: false
      };

      const roomId = await this.roomService.createRoom(
        this.currentUser()!.uid,
        this.currentUser()!.displayName,
        this.roomName,
        config
      );

      // Observar la sala
      this.roomService.observeRoom(roomId).subscribe(room => {
        this.room.set(room);
        if (room && room.currentIndex >= 0) {
          const cardId = room.deck[room.currentIndex];
          this.currentCard.set(CARDS.find(c => c.id === cardId));
        }
      });

      this.showCreateForm.set(false);
      alert(`¡Sala creada! ID: ${roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error al crear la sala');
    }
  }

  async startRound() {
    const currentRoom = this.room();
    if (!currentRoom) return;

    try {
      await this.roomService.startNewRound(currentRoom.id);
      alert('¡Ronda iniciada!');
    } catch (error) {
      console.error('Error starting round:', error);
      alert('Error al iniciar la ronda');
    }
  }

  async nextCard() {
    const currentRoom = this.room();
    if (!currentRoom) return;

    try {
      await this.roomService.nextCard(currentRoom.id);
    } catch (error) {
      console.error('Error advancing card:', error);
      alert('Error al avanzar carta');
    }
  }

  async finishRound() {
    const currentRoom = this.room();
    if (!currentRoom) return;

    try {
      await this.roomService.finishRound(currentRoom.id, []);
      alert('¡Ronda finalizada!');
    } catch (error) {
      console.error('Error finishing round:', error);
      alert('Error al finalizar la ronda');
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
