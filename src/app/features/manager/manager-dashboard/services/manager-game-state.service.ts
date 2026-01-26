import { Injectable, computed, signal } from '@angular/core';
import { CARDS } from '../../../../core/constants/game-data';
import { isRoomWaiting } from '../../../../core/constants/room-states';
import {
  Participant,
  Room,
  RoundWinner,
} from '../../../../core/models/game.model';

@Injectable({
  providedIn: 'root',
})
export class ManagerGameStateService {
  // State signals
  room = signal<Room | null>(null);
  participants = signal<Participant[]>([]);
  currentRoundWinners = signal<RoundWinner[]>([]);

  // Computed signals
  currentCard = computed(() => {
    const r = this.room();
    if (!r || r.currentIndex < 0 || !Array.isArray(r.deck)) return null;
    const cardId = r.deck[r.currentIndex];
    return CARDS.find((c) => c.id === cardId) ?? null;
  });

  nextCardPreview = computed(() => {
    const r = this.room();
    if (!r) return null;
    const nextIndex = r.currentIndex + 1;
    if (!Array.isArray(r.deck) || nextIndex < 0 || nextIndex >= r.deck.length)
      return null;
    const nextId = r.deck[nextIndex];
    return CARDS.find((c) => c.id === nextId) ?? null;
  });

  // Carta a mostrar: si currentIndex es -1 y hay deck, mostrar la primera
  displayCard = computed(() => {
    const r = this.room();
    const current = this.currentCard();
    
    // Si ya hay carta actual, mostrarla
    if (current) return current;
    
    // Si currentIndex es -1 pero hay deck (ronda iniciada), mostrar la primera carta como preview
    if (r && r.currentIndex === -1 && Array.isArray(r.deck) && r.deck.length > 0 && r.state === 'playing') {
      const firstCardId = r.deck[0];
      return CARDS.find((c) => c.id === firstCardId) ?? null;
    }
    
    return null;
  });

  nextVersoSuggestion = computed(() => {
    const r = this.room();
    if (!r || isRoomWaiting(r.state)) return '"Presiona Iniciar para barajar"';
    const next = this.nextCardPreview();
    return next?.verso ? `"${next.verso}"` : '"..."';
  });

  players = computed(() =>
    this.participants().filter((p) => p.role === 'player'),
  );

  pendingWinners = computed(() => {
    const r = this.room();
    const participants = this.players();
    if (!r || !Array.isArray(r.currentRoundWinners)) return [] as Participant[];
    const winnerIds = new Set(r.currentRoundWinners);
    return participants.filter((p) => winnerIds.has(p.uid));
  });

  // Methods to update state
  setRoom(room: Room | null) {
    this.room.set(room);
  }

  setParticipants(participants: Participant[]) {
    this.participants.set(participants);
  }

  setCurrentRoundWinners(winners: RoundWinner[]) {
    this.currentRoundWinners.set(winners);
  }

  // Reset state
  reset() {
    this.room.set(null);
    this.participants.set([]);
    this.currentRoundWinners.set([]);
  }
}
