import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  roles = [
    {
      id: 'manager',
      name: 'Manager / Gritón',
      emoji: '🎙️',
      description: 'Crea y controla salas, canta las cartas y verifica ganadores',
      color: '#667eea',
      route: '/manager'
    },
    {
      id: 'player',
      name: 'Jugador',
      emoji: '🎮',
      description: 'Únete a una sala, elige tu tabla y juega a la lotería',
      color: '#10B981',
      route: '/player'
    },
    {
      id: 'viewer',
      name: 'Espectador',
      emoji: '👁️',
      description: 'Observa el juego sin participar',
      color: '#F59E0B',
      route: '/viewer'
    }
  ];

  selectRole(role: any): void {
    // Navigate to the selected role view
    this.router.navigate([role.route]);
  }
}
