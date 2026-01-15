import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MARKERS } from '../../../../core/constants/game-data';
import {
  getRoomStateColors,
  getRoomStateLabel,
  isRoomActive,
  isRoomWaiting,
} from '../../../../core/constants/room-states';
import { Participant, Room } from '../../../../core/models/game.model';
import { CardComponent } from '../../../../shared/components/card/card.component';

@Component({
  selector: 'app-manager-game-panel',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <!-- DESKTOP LAYOUT (xl) -->
    <div class="hidden xl:grid xl:grid-cols-12 gap-6">
      <!-- Left column: Header + Botones de acción -->
      <div class="xl:col-span-3 space-y-3">
        <!-- Header compacto -->
        <div class="bg-white rounded-lg p-6 shadow-md">
          <h2 class="text-lg font-bold text-gray-800 mb-3">{{ room.name }}</h2>
          
          <div class="space-y-2">
            <div class="bg-cyan-50 p-4 rounded-2xl">
              <div class="text-xs text-gray-600 font-semibold">Ronda</div>
              <div class="text-lg font-bold text-gray-800">{{ room.currentRound }}</div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-2xl">
              <div class="text-xs text-gray-600 font-semibold">Cartas</div>
              <div class="text-lg font-bold text-gray-800">{{ room.currentIndex + 1 }}/54</div>
            </div>
            <div class="bg-purple-50 p-4 rounded-2xl">
              <div class="text-xs text-gray-600 font-semibold">Estado</div>
              <div class="text-lg font-bold text-gray-800">{{ getRoomStateLabel(room.state) }}</div>
            </div>
          </div>
        </div>
        <button
          (click)="copyInviteLink.emit()"
          class="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition text-sm shadow-md">
          🔗 Compartir Link
        </button>
        <button
          (click)="showQRCode.emit()"
          class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm shadow-md">
          📱 Compartir QR
        </button>
        <button
          (click)="openInvitePage.emit()"
          class="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm shadow-md">
          🎉 Página de Invitación
        </button>
        <button
          (click)="showCardHistory.emit()"
          class="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition text-sm shadow-md">
          📜 Historial de cartas
        </button>
        <button
          *ngIf="isRoomActive(room.state)"
          (click)="finishRound.emit()"
          class="w-full bg-white text-red-600 px-4 py-3 rounded-lg font-semibold hover:bg-red-50 transition text-sm border-2 border-red-500 shadow-md">
          ⏹️ Finalizar Ronda
        </button>
        <button
          (click)="deleteRoom.emit()"
          class="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition text-sm shadow-md">
          🗑️ Eliminar Sala
        </button>
      </div>

      <!-- Center: Carta Actual -->
      <div class="xl:col-span-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div id="current-card" class="flex justify-center mb-6">
            <app-card
              *ngIf="currentCard"
              [card]="currentCard"
              [size]="'large'"
              [showVerso]="true"></app-card>
            <div *ngIf="!currentCard" class="w-64 h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-4 border-gray-200 flex flex-col items-center justify-center shadow-inner">
              <div class="text-7xl text-gray-800 font-bold mb-2">?</div>
              <div class="text-gray-400 font-semibold tracking-widest text-sm">ESPERANDO…</div>
            </div>
          </div>

          <div class="bg-indigo-50 rounded-lg p-4 mb-6">
            <p class="text-[10px] uppercase font-bold text-indigo-400 mb-1 text-center tracking-widest">Sugerencia para la próxima</p>
            <p class="text-indigo-700 italic font-semibold text-center text-lg">{{ nextVersoSuggestion }}</p>
          </div>

          <div class="flex justify-center">
            <button
              *ngIf="isRoomWaiting(room.state)"
              (click)="startRound.emit()"
              class="bg-indigo-600 text-white px-12 py-4 rounded-lg font-bold hover:bg-indigo-700 transition text-lg shadow-md">
              Iniciar Ronda
            </button>
            <button
              *ngIf="isRoomActive(room.state)"
              (click)="nextCard.emit()"
              class="bg-indigo-600 text-white px-12 py-4 rounded-lg font-bold hover:bg-indigo-700 transition text-lg shadow-md">
              ➡️ Siguiente carta
            </button>
          </div>
        </div>
      </div>

      <!-- Right column: Próxima carta + Verificación + Jugadores -->
      <div class="xl:col-span-3 space-y-6">
        <!-- Próxima carta -->
        <div class="bg-gray-800 text-white p-6 rounded-3xl shadow-lg">
          <p class="text-gray-400 text-xs uppercase font-bold mb-4 tracking-wider">PRÓXIMA CARTA (SÓLO TÚ VES)</p>
          <div class="flex items-center gap-4">
            <div class="w-20 h-28 bg-gray-700 rounded-xl flex items-center justify-center text-4xl shadow-md">
              {{ nextCardPreview?.emoji || '?' }}
            </div>
            <div class="flex-1">
              <p class="font-bold text-white text-lg mb-1">{{ nextCardPreview?.name || '???' }}</p>
              <p class="text-[10px] text-gray-400 uppercase tracking-widest">LISTA PARA CANTAR</p>
            </div>
          </div>
        </div>

        <!-- Verificación -->
        <div class="bg-white p-6 rounded-3xl shadow-lg">
          <h4 class="font-bold mb-4 text-gray-700 flex items-center gap-2 text-base">✅ Verificación</h4>

          <div *ngIf="pendingWinners.length === 0" class="text-gray-400 text-sm italic">
            Sin solicitudes
          </div>

          <div *ngIf="pendingWinners.length > 0" class="space-y-3">
            <div
              *ngFor="let p of pendingWinners"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p class="font-bold text-sm text-gray-800">{{ p.displayName }}</p>
                <p class="text-xs text-gray-500">Gritó ¡Lotería!</p>
              </div>
              <button
                (click)="reviewParticipant.emit(p)"
                class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md">
                Revisar
              </button>
            </div>
          </div>
        </div>

        <!-- Jugadores -->
        <div class="bg-white p-6 rounded-3xl shadow-lg">
          <h4 class="font-bold mb-4 text-gray-700 flex items-center gap-2 text-base">👥 Jugadores</h4>
          <div *ngIf="players.length === 0" class="text-gray-400 text-sm italic">Sin jugadores</div>
          <div *ngIf="players.length > 0" class="space-y-2">
            <div *ngFor="let p of players" class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div class="min-w-0">
                <div class="font-semibold text-gray-800 text-sm truncate">{{ p.displayName }}</div>
                <div class="text-xs text-gray-500">{{ getMarkerEmoji(p.marker) }}</div>
              </div>
              <button
                (click)="reviewParticipant.emit(p)"
                class="text-indigo-600 text-xs font-bold hover:text-indigo-700">
                Ver tabla
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLET LAYOUT (md) -->
    <div class="hidden md:grid xl:hidden md:grid-cols-12 gap-6">
      <!-- Left: Carta Actual + Próxima carta -->
      <div class="md:col-span-7 space-y-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div id="current-card" class="flex justify-center mb-4">
            <app-card
              *ngIf="currentCard"
              [card]="currentCard"
              [size]="'medium'"
              [showVerso]="true"></app-card>
            <div *ngIf="!currentCard" class="w-48 h-60 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-4 border-gray-200 flex flex-col items-center justify-center shadow-inner">
              <div class="text-6xl text-gray-800 font-bold mb-2">?</div>
              <div class="text-gray-400 font-semibold tracking-widest text-xs">ESPERANDO…</div>
            </div>
          </div>

          <div class="bg-indigo-50 rounded-lg p-4 mb-4">
            <p class="text-[10px] uppercase font-bold text-indigo-400 mb-1 text-center tracking-widest">Sugerencia</p>
            <p class="text-indigo-700 italic font-semibold text-center">{{ nextVersoSuggestion }}</p>
          </div>

          <div class="flex justify-center">
            <button
              *ngIf="isRoomWaiting(room.state)"
              (click)="startRound.emit()"
              class="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md">
              Iniciar Ronda
            </button>
            <button
              *ngIf="isRoomActive(room.state)"
              (click)="nextCard.emit()"
              class="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md">
              ➡️ Siguiente carta
            </button>
          </div>
        </div>

        <!-- Próxima carta -->
        <div class="bg-gray-800 text-white p-6 rounded-3xl shadow-lg">
          <p class="text-gray-400 text-xs uppercase font-bold mb-4 tracking-wider">PRÓXIMA CARTA (SÓLO TÚ VES)</p>
          <div class="flex items-center gap-4">
            <div class="w-20 h-28 bg-gray-700 rounded-xl flex items-center justify-center text-4xl shadow-md">
              {{ nextCardPreview?.emoji || '?' }}
            </div>
            <div class="flex-1">
              <p class="font-bold text-white text-lg mb-1">{{ nextCardPreview?.name || '???' }}</p>
              <p class="text-[10px] text-gray-400 uppercase tracking-widest">LISTA PARA CANTAR</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Jugadores + Verificación + Botones -->
      <div class="md:col-span-5 space-y-6">
        <!-- Header compacto -->
        <div class="bg-white rounded-lg p-4 shadow-md">
          <h2 class="text-lg font-bold text-gray-800 mb-3">{{ room.name }}</h2>
          
          <div class="space-y-2">
            <div class="bg-cyan-50 p-2 rounded-lg flex justify-between items-center">
              <div class="text-xs text-gray-600 font-semibold">Ronda</div>
              <div class="text-base font-bold text-gray-800">{{ room.currentRound }}</div>
            </div>
            <div class="bg-yellow-50 p-2 rounded-lg flex justify-between items-center">
              <div class="text-xs text-gray-600 font-semibold">Cartas</div>
              <div class="text-base font-bold text-gray-800">{{ room.currentIndex + 1 }}/54</div>
            </div>
            <div class="bg-purple-50 p-2 rounded-lg flex justify-between items-center">
              <div class="text-xs text-gray-600 font-semibold">Estado</div>
              <div class="text-base font-bold text-gray-800">{{ getRoomStateLabel(room.state) }}</div>
            </div>
          </div>
        </div>

        <!-- Jugadores -->
        <div class="bg-white p-6 rounded-3xl shadow-lg">
          <h4 class="font-bold mb-4 text-gray-700 flex items-center gap-2 text-base">👥 Jugadores</h4>
          <div *ngIf="players.length === 0" class="text-gray-400 text-sm italic">Sin jugadores</div>
          <div *ngIf="players.length > 0" class="space-y-2">
            <div *ngFor="let p of players" class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div class="min-w-0">
                <div class="font-semibold text-gray-800 text-sm truncate">{{ p.displayName }}</div>
                <div class="text-xs text-gray-500">{{ getMarkerEmoji(p.marker) }}</div>
              </div>
              <button
                (click)="reviewParticipant.emit(p)"
                class="text-indigo-600 text-lg hover:text-indigo-700">
                👁️
              </button>
            </div>
          </div>
        </div>

        <!-- Verificación -->
        <div class="bg-white p-6 rounded-3xl shadow-lg">
          <h4 class="font-bold mb-4 text-gray-700 flex items-center gap-2 text-base">✅ Verificación</h4>

          <div *ngIf="pendingWinners.length === 0" class="text-gray-400 text-sm italic">
            Sin solicitudes
          </div>

          <div *ngIf="pendingWinners.length > 0" class="space-y-3">
            <div
              *ngFor="let p of pendingWinners"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p class="font-bold text-sm text-gray-800">{{ p.displayName }}</p>
                <p class="text-xs text-gray-500">Gritó ¡Lotería!</p>
              </div>
              <button
                (click)="reviewParticipant.emit(p)"
                class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md">
                ✏️
              </button>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="space-y-3">
          <button
            (click)="copyInviteLink.emit()"
            class="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition text-sm shadow-md">
            🔗 Compartir Link
          </button>
          <button
            (click)="showQRCode.emit()"
            class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-sm shadow-md">
            📱 Compartir QR
          </button>
          <button
            (click)="openInvitePage.emit()"
            class="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm shadow-md">
            🎉 Página de Invitación
          </button>
          <button
            (click)="showCardHistory.emit()"
            class="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition text-sm shadow-md">
            📜 Historial de cartas
          </button>
          <button
            *ngIf="isRoomActive(room.state)"
            (click)="finishRound.emit()"
            class="w-full bg-white text-red-600 px-4 py-3 rounded-lg font-semibold hover:bg-red-50 transition text-sm border-2 border-red-500 shadow-md">
            ⏹️ Finalizar Ronda
          </button>
          <button
            (click)="deleteRoom.emit()"
            class="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition text-sm shadow-md">
            🗑️ Eliminar Sala
          </button>
        </div>
      </div>
    </div>

    <!-- MOBILE LAYOUT (< md) -->
    <div class="md:hidden space-y-3">
        <div class="bg-white rounded-lg p-6 shadow-md sm:hidden">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ room.name }}</h2>
        
        <div class="overflow-x-scroll w-auto">
          <div class="grid grid-cols-3 gap-4 text-center w-screen">
            <div class="bg-cyan-50 p-4 rounded-2xl">
              <div class="text-sm text-gray-600 font-semibold">Ronda actual</div>
              <div class="text-2xl font-bold text-gray-800">{{ room.currentRound }}</div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-2xl">
              <div class="text-sm text-gray-600 font-semibold">Cartas cantadas</div>
              <div class="text-2xl font-bold text-gray-800">{{ room.currentIndex + 1 }}/54</div>
            </div>
            <div class="bg-purple-50 p-4 rounded-2xl">
              <div class="text-sm text-gray-600 font-semibold">Estado</div>
              <div class="text-2xl font-bold text-gray-800">{{ getRoomStateLabel(room.state) }}</div>
            </div>
          </div>
        </div>
    </div>

      <!-- Iconos de acción -->
      <div class="bg-white p-4 rounded-lg shadow-md">
        <div class="flex justify-center gap-3">
          <button
            (click)="copyInviteLink.emit()"
            class="flex flex-col items-center gap-1">
            <div class="w-14 h-14 bg-green-600 text-white rounded-lg flex items-center justify-center text-2xl hover:bg-green-700 transition shadow-md">
              🔗
            </div>
            <span class="text-[9px] text-green-600 font-semibold">Compartir Link</span>
          </button>
          <button
            (click)="showQRCode.emit()"
            class="flex flex-col items-center gap-1">
            <div class="w-14 h-14 bg-blue-600 text-white rounded-lg flex items-center justify-center text-2xl hover:bg-blue-700 transition shadow-md">
              📱
            </div>
            <span class="text-[9px] text-blue-600 font-semibold">Compartir QR</span>
          </button>
          <button
            (click)="openInvitePage.emit()"
            class="flex flex-col items-center gap-1">
            <div class="w-14 h-14 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-2xl hover:bg-indigo-700 transition shadow-md">
              🎉
            </div>
            <span class="text-[9px] text-indigo-600 font-semibold">Invitación</span>
          </button>
          <button
            (click)="showCardHistory.emit()"
            class="flex flex-col items-center gap-1">
            <div class="w-14 h-14 bg-purple-600 text-white rounded-lg flex items-center justify-center text-2xl hover:bg-purple-700 transition shadow-md">
              📜
            </div>
            <span class="text-[9px] text-purple-600 font-semibold">Historial de cartas</span>
          </button>
          <button
            *ngIf="isRoomActive(room.state)"
            (click)="finishRound.emit()"
            class="flex flex-col items-center gap-1">
            <div class="w-14 h-14 bg-white border-2 border-red-500 rounded-lg flex items-center justify-center text-2xl hover:bg-red-50 transition shadow-md text-red-600">
              ⏹️
            </div>
            <span class="text-[9px] text-red-600 font-semibold">Finalizar Ronda</span>
          </button>
        </div>
      </div>

      <!-- Carta Actual -->
      <div class="p-6">
        <div id="current-card" class="flex justify-center mb-4">
          <app-card
            *ngIf="currentCard"
            [card]="currentCard"
            [size]="'large'"
            [showVerso]="true"></app-card>
          <div *ngIf="!currentCard" class="w-40 h-50 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-4 border-gray-200 flex flex-col items-center justify-center shadow-inner">
            <div class="text-5xl text-gray-800 font-bold mb-2">?</div>
            <div class="text-gray-400 font-semibold tracking-widest text-xs">ESPERANDO…</div>
          </div>
        </div>

          <div class="bg-indigo-50 rounded-lg p-4 mb-6">
            <p class="text-[10px] uppercase font-bold text-indigo-400 mb-1 text-center tracking-widest">Sugerencia para la próxima</p>
            <p class="text-indigo-700 italic font-semibold text-center text-lg">{{ nextVersoSuggestion }}</p>
          </div>

        <div class="flex justify-center">
          <button
            *ngIf="isRoomWaiting(room.state)"
            (click)="startRound.emit()"
            class="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md">
            Iniciar Ronda
          </button>
          <button
            *ngIf="isRoomActive(room.state)"
            (click)="nextCard.emit()"
            class="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md">
            ➡️ Siguiente carta
          </button>
        </div>

      </div>

      <!-- Próxima carta -->
      <div class="bg-gray-800 text-white p-6 rounded-lg shadow-md">
        <p class="text-gray-400 text-xs uppercase font-bold mb-4 tracking-wider">PRÓXIMA CARTA (SÓLO TÚ VES)</p>
        <div class="flex items-center gap-4">
          <div class="w-20 h-28 bg-gray-700 rounded-lg flex items-center justify-center text-4xl shadow-md">
            {{ nextCardPreview?.emoji || '?' }}
          </div>
          <div class="flex-1">
            <p class="font-bold text-white text-base mb-1">{{ nextCardPreview?.name || '???' }}</p>
            <p class="text-[10px] text-gray-400 uppercase tracking-widest">SUGERENCIA PARA CANTAR</p>
            <p class="text-indigo-400 italic mt-2">{{ nextVersoSuggestion }}</p>
          </div>
        </div>
      </div>

      <!-- Jugadores -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h4 class="font-bold mb-4 text-gray-700 flex items-center gap-2 text-base">👥 Jugadores</h4>
        <div *ngIf="players.length === 0" class="text-gray-400 text-sm italic">Sin jugadores</div>
        <div *ngIf="players.length > 0" class="space-y-2">
          <div *ngFor="let p of players" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="min-w-0">
              <div class="font-semibold text-gray-800 text-sm truncate">{{ p.displayName }}</div>
              <div class="text-xs text-gray-500">{{ getMarkerEmoji(p.marker) }}</div>
            </div>
            <button
              (click)="reviewParticipant.emit(p)"
              class="bg-indigo-600 text-white px-3 py-2 rounded-lg text-lg hover:bg-indigo-700 shadow-md">
              👁️
            </button>
          </div>
        </div>
      </div>

      <!-- Verificación -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h4 class="font-bold mb-4 text-gray-700 flex items-center gap-2 text-base">✅ Verificación</h4>

        <div *ngIf="pendingWinners.length === 0" class="text-gray-400 text-sm italic">
          Sin solicitudes
        </div>

        <div *ngIf="pendingWinners.length > 0" class="space-y-3">
          <div
            *ngFor="let p of pendingWinners"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="font-bold text-sm text-gray-800">{{ p.displayName }}</p>
              <p class="text-xs text-gray-500">Gritó ¡Lotería!</p>
            </div>
            <button
              (click)="reviewParticipant.emit(p)"
              class="bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-md">
              ✏️ Revisar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ManagerGamePanelComponent {
  @Input() room!: Room;
  @Input() currentCard: any = null;
  @Input() nextCardPreview: any = null;
  @Input() nextVersoSuggestion = '';
  @Input() participants: Participant[] = [];
  @Input() players: Participant[] = [];
  @Input() pendingWinners: Participant[] = [];

  @Output() startRound = new EventEmitter<void>();
  @Output() nextCard = new EventEmitter<void>();
  @Output() copyInviteLink = new EventEmitter<void>();
  @Output() showQRCode = new EventEmitter<void>();
  @Output() openInvitePage = new EventEmitter<void>();
  @Output() showCardHistory = new EventEmitter<void>();
  @Output() finishRound = new EventEmitter<void>();
  @Output() deleteRoom = new EventEmitter<void>();
  @Output() reviewParticipant = new EventEmitter<Participant>();

  readonly getRoomStateLabel = getRoomStateLabel;
  readonly getRoomStateColors = getRoomStateColors;
  readonly isRoomActive = isRoomActive;
  readonly isRoomWaiting = isRoomWaiting;

  getMarkerEmoji(markerId?: string): string {
    if (!markerId) return '🫘';
    return MARKERS.find((m) => m.id === markerId)?.emoji ?? '🫘';
  }
}
