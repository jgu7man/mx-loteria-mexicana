import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import {
  getRoomStateColors,
  getRoomStateLabel,
} from '../../../core/constants/room-states';
import { Participant, Room } from '../../../core/models/game.model';
import { AlertService } from '../../../core/services/alert.service';
import { RoomService } from '../../../core/services/room.service';

@Component({
  selector: 'app-invite-display',
  standalone: true,
  imports: [CommonModule, QRCodeModule],
  templateUrl: './invite-display.component.html',
  styleUrl: './invite-display.component.css',
})
export class InviteDisplayComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private roomService = inject(RoomService);
  private alertService = inject(AlertService);

  readonly origin = window.location.origin;

  room = signal<Room | null>(null);
  participants = signal<Participant[]>([]);
  players = computed(() =>
    this.participants().filter((p) => p.role === 'player'),
  );
  roomId = signal('');
  joinLink = computed(() => {
    const id = this.roomId();
    if (!id) return '';
    return `${this.origin}/join/${id}`;
  });

  getRoomStateLabel = getRoomStateLabel;
  getRoomStateColors = getRoomStateColors;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const roomId = params['roomId'];
      if (roomId) {
        this.roomId.set(roomId);
        this.loadRoom();
      }
    });
  }

  async loadRoom() {
    const roomIdValue = this.roomId();
    if (!roomIdValue.trim()) {
      this.router.navigate(['/']);
      return;
    }

    try {
      const room = await this.roomService.getRoom(roomIdValue);
      if (!room) {
        alert('Sala no encontrada');
        this.router.navigate(['/']);
        return;
      }

      // Observe room
      this.roomService.observeRoom(roomIdValue).subscribe((r) => {
        this.room.set(r);
      });

      // Observe participants
      this.roomService
        .observeParticipants(roomIdValue)
        .subscribe((participants) => {
          this.participants.set(participants);
        });
    } catch (error) {
      console.error('Error loading room:', error);
      alert('Error al cargar la sala');
      this.router.navigate(['/']);
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  joinAsPlayer() {
    this.router.navigate(['/join', this.roomId()]);
  }

  joinAsViewer() {
    this.router.navigate(['/viewer', this.roomId()]);
  }

  async copyViewerLink() {
    const viewerLink = `${this.origin}/viewer/${this.roomId()}`;

    try {
      await navigator.clipboard.writeText(viewerLink);
      await this.alertService.fire({
        icon: 'success',
        title: '¡Link copiado!',
        text: 'El link para visitantes ha sido copiado al portapapeles',
        timer: 2000,
        showConfirmButton: false,
        position: 'top-end',
        toast: true,
      });
    } catch (error) {
      console.error('Error copying viewer link:', error);
      await this.alertService.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo copiar el link',
        confirmButtonColor: '#6366f1',
      });
    }
  }
}
