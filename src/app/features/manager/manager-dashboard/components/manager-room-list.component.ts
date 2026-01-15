import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  getRoomStateColors,
  getRoomStateLabel,
} from '../../../../core/constants/room-states';
import { AppUser, Room } from '../../../../core/models/game.model';

@Component({
  selector: 'app-manager-room-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="text-center">
      <div class="bg-white rounded-3xl shadow-lg p-8 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Bienvenido, {{ currentUser?.displayName }}!</h2>
        
        <!-- Salas creadas -->
        <div *ngIf="managerRooms.length > 0" class="mb-8">
          <h3 class="text-xl font-bold text-gray-700 mb-4 text-left">Tus Salas</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              *ngFor="let managerRoom of managerRooms"
              (click)="roomSelected.emit(managerRoom)"
              class="p-6 border-2 border-gray-200 rounded-2xl hover:border-indigo-400 hover:shadow-lg transition text-left bg-gray-50">
              <div class="flex justify-between items-start mb-2">
                <h4 class="text-lg font-bold text-gray-800">{{ managerRoom.name }}</h4>
                <span class="px-3 py-1 text-xs rounded-full font-semibold"
                  [ngClass]="[getRoomStateColors(managerRoom.state).bg, getRoomStateColors(managerRoom.state).text]">
                  {{ getRoomStateLabel(managerRoom.state) }}
                </span>
              </div>
              <div class="text-sm text-gray-600">
                <div>Ronda: {{ managerRoom.currentRound }}/{{ managerRoom.config.maxRounds }}</div>
                <div>Cartas: {{ managerRoom.currentIndex + 1 }}/54</div>
                <div class="text-xs text-indigo-600 mt-2 font-mono">ID: {{ managerRoom.id }}</div>
              </div>
            </button>
          </div>
        </div>

        <div *ngIf="loadingRooms" class="text-gray-500 mb-6">
          Cargando salas...
        </div>

        <div *ngIf="!loadingRooms && managerRooms.length === 0" class="text-gray-500 mb-6">
          No tienes salas creadas aún.
        </div>

        <!-- Botón crear sala -->
        <button 
          *ngIf="!showCreateForm"
          (click)="showCreateForm = true"
          class="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-indigo-700 transition shadow-lg">
          ➕ Crear Nueva Sala
        </button>

        <!-- Create room form -->
        <div *ngIf="showCreateForm" class="mt-8">
          <form (ngSubmit)="handleCreateRoom()" class="space-y-6">
            <div>
              <label class="block text-left text-gray-700 font-semibold mb-2">Nombre de la Sala</label>
              <input 
                type="text"
                [(ngModel)]="roomName"
                name="roomName"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ej: Lotería del Viernes">
            </div>

            <div>
              <label class="block text-left text-gray-700 font-semibold mb-2">Número de Rondas</label>
              <input 
                type="number"
                [(ngModel)]="maxRounds"
                name="maxRounds"
                min="1"
                max="20"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            </div>

            <div>
              <label class="block text-left text-gray-700 font-semibold mb-2">Dificultad para Espectadores</label>
              <select 
                [(ngModel)]="difficulty"
                name="difficulty"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="easy">Fácil (últimas 5 cartas)</option>
                <option value="medium">Medio (últimas 2 cartas)</option>
                <option value="hard">Difícil (solo carta actual)</option>
              </select>
            </div>

            <div class="flex gap-4">
              <button 
                type="submit"
                class="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition shadow-lg">
                Crear Sala
              </button>
              <button 
                type="button"
                (click)="showCreateForm = false"
                class="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class ManagerRoomListComponent {
  @Input() managerRooms: Room[] = [];
  @Input() loadingRooms = false;
  @Input() currentUser: AppUser | null = null;

  @Output() roomSelected = new EventEmitter<Room>();
  @Output() createRoom = new EventEmitter<{
    roomName: string;
    maxRounds: number;
    difficulty: 'easy' | 'medium' | 'hard';
  }>();

  showCreateForm = false;
  roomName = '';
  maxRounds = 10;
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';

  readonly getRoomStateLabel = getRoomStateLabel;
  readonly getRoomStateColors = getRoomStateColors;

  handleCreateRoom() {
    this.createRoom.emit({
      roomName: this.roomName,
      maxRounds: this.maxRounds,
      difficulty: this.difficulty,
    });
    this.showCreateForm = false;
    this.roomName = '';
    this.maxRounds = 10;
    this.difficulty = 'easy';
  }
}
