import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CARDS } from '../../core/constants/game-data';
import { AuthService } from '../../core/services/auth.service';
import { CardComponent } from '../../shared/components/card/card.component';

interface BackgroundCard {
  card: any;
  left: number;
  top: number;
  rotation: number;
  opacity: number;
  scale: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  backgroundCards: BackgroundCard[] = [];

  roles = [
    {
      id: 'manager',
      name: 'Manager / Gritón',
      emoji: '🎙️',
      description:
        'Crea y controla salas, canta las cartas y verifica ganadores',
      color: '#667eea',
      route: '/manager',
    },
    {
      id: 'player',
      name: 'Jugador',
      emoji: '🎮',
      description: 'Únete a una sala, elige tu tabla y juega a la lotería',
      color: '#10B981',
      route: '/player',
    },
    {
      id: 'viewer',
      name: 'Espectador',
      emoji: '👁️',
      description: 'Observa el juego sin participar',
      color: '#F59E0B',
      route: '/viewer',
    },
  ];

  ngOnInit() {
    this.generateBackgroundCards();
  }

  generateBackgroundCards() {
    const cardCount = 15; // Número de cartas en el fondo
    const shuffledCards = [...CARDS].sort(() => Math.random() - 0.5);

    // Dividir la pantalla en zonas para mejor distribución
    // Rangos ajustados: -10% a 100% para permitir cartas parcialmente fuera
    const zones = [
      { left: [-10, 26], top: [-10, 26] }, // Superior izquierda
      { left: [26, 62], top: [-10, 26] }, // Superior centro
      { left: [62, 100], top: [-10, 26] }, // Superior derecha
      { left: [-10, 26], top: [26, 62] }, // Centro izquierda
      { left: [26, 62], top: [26, 62] }, // Centro centro
      { left: [62, 100], top: [26, 62] }, // Centro derecha
      { left: [-10, 26], top: [62, 100] }, // Inferior izquierda
      { left: [26, 62], top: [62, 100] }, // Inferior centro
      { left: [62, 100], top: [62, 100] }, // Inferior derecha
    ];

    // Mezclar zonas para distribución aleatoria
    const shuffledZones = [...zones].sort(() => Math.random() - 0.5);

    for (let i = 0; i < cardCount; i++) {
      const zone = shuffledZones[i % shuffledZones.length];
      const leftRange = zone.left[1] - zone.left[0];
      const topRange = zone.top[1] - zone.top[0];

      this.backgroundCards.push({
        card: shuffledCards[i % CARDS.length],
        left: zone.left[0] + Math.random() * leftRange,
        top: zone.top[0] + Math.random() * topRange,
        rotation: Math.random() * 60 - 30, // -30° a 30°
        opacity: Math.random() * 0.15 + 0.05, // 0.05 a 0.2
        scale: Math.random() * 0.4 + 0.6, // 0.6 a 1.0
      });
    }
  }

  selectRole(role: any): void {
    // Navigate to the selected role view
    this.router.navigate([role.route]);
  }
}
