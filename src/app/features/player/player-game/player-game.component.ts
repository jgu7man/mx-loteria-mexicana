import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { MARKERS } from '../../../core/constants/game-data';
import { Marker, Participant } from '../../../core/models/game.model';
import { AlertService } from '../../../core/services/alert.service';
import { AuthService } from '../../../core/services/auth.service';
import { GameUtilsService } from '../../../core/services/game-utils.service';
import { RoomService } from '../../../core/services/room.service';
import { WinnerNotificationService } from '../../../core/services/winner-notification.service';
import { MarkerComponent } from '../../../shared/components/marker/marker.component';
import { PodiumComponent } from '../../../shared/components/podium/podium.component';
import { PlayerGameBoardComponent } from './components/player-game-board/player-game-board.component';
import { PlayerJoinFormComponent } from './components/player-join-form/player-join-form.component';
import { PlayerTablaSelectorComponent } from './components/player-tabla-selector/player-tabla-selector.component';
import { PlayerGameStateService } from './services/player-game-state.service';

@Component({
  selector: 'app-player-game',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MarkerComponent,
    PodiumComponent,
    PlayerJoinFormComponent,
    PlayerTablaSelectorComponent,
    PlayerGameBoardComponent,
  ],
  templateUrl: './player-game.component.html',
  providers: [PlayerGameStateService],
})
export class PlayerGameComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private roomService = inject(RoomService);
  private gameState = inject(PlayerGameStateService);
  private gameUtils = inject(GameUtilsService);
  private alertService = inject(AlertService);
  private destroyRef = inject(DestroyRef);
  private winnerNotification = inject(WinnerNotificationService);

  // Re-export state from service
  currentUser = this.authService.currentUser;
  authLoading = this.authService.authLoading;
  roomLoading = signal<boolean>(false);
  isLoading = computed(() => this.authLoading() || this.roomLoading());

  room = this.gameState.room;
  participant = this.gameState.participant;
  participants = this.gameState.participants;
  currentCard = this.gameState.currentCard;
  historyCards = this.gameState.historyCards;
  myTabla = this.gameState.myTabla;
  myMarks = this.gameState.myMarks;
  selectedMarker = this.gameState.selectedMarker;

  showPodium = this.gameState.showPodium;
  currentRoundWinners = this.gameState.currentRoundWinnersList;

  // Computed signal serializado para detectar cambios reales en currentRoundWinners
  currentRoundWinnersJson = computed(() => {
    const winners = this.room()?.currentRoundWinners || [];
    return JSON.stringify(winners);
  });

  // UI state
  roomId = '';
  displayName = '';
  showJoinForm = signal(true);
  isRoomDeleted = this.gameState.isRoomDeleted;
  showMarkerSelector = signal(false);
  showTablaSelector = signal(false);

  // Available tablas (simplified - just generate 10 for demo)
  availableTablas = signal<number[][]>([]);

  private readonly legacyRoomKey = 'playerRoomId';
  private readonly legacyMarkerKey = 'playerMarker';
  private readonly legacyTablaKey = 'playerTabla';
  private isInSelectionProcess = false; // Flag para desactivar validación durante selección

  constructor() {
    // Effect para detectar cambios en la autenticación
    effect(
      () => {
        const user = this.currentUser();
        const authLoading = this.authLoading();
        console.log('🔐 [AUTH EFFECT]', { user: user?.uid, authLoading, path: window.location.pathname });
        
        // Solo proceder si hay usuario autenticado y NO está cargando
        if (user && !authLoading) {
          const currentPath = window.location.pathname;
          
          // Si estamos en /player, restaurar sesión
          if (currentPath.startsWith('/player/')) {
            console.log('🔄 [AUTH EFFECT] Llamando restorePlayerSession');
            this.restorePlayerSession();
          }
          
          // Si estamos en /join, verificar si debe redirigir automáticamente
          if (currentPath.startsWith('/join/')) {
            const roomIdMatch = currentPath.match(/\/join\/([^/]+)/);
            if (roomIdMatch && roomIdMatch[1]) {
              const roomId = roomIdMatch[1];
              console.log('🔍 [AUTH EFFECT] Verificando redirección automática para roomId:', roomId);
              this.checkAutoRedirect(user.uid, roomId);
            }
          }
        }
      },
      { allowSignalWrites: true },
    );

    // Effect para detectar cuando alguien grita lotería
    // Usa computed signal serializado para evitar ejecuciones en cada cambio de room
    effect(
      () => {
        // Leer el computed signal serializado - solo cambia si winners cambia
        const winnersJson = this.currentRoundWinnersJson();
        const winners = winnersJson ? JSON.parse(winnersJson) : [];
        const participant = this.participant();

        // Usar el servicio compartido para procesar ganadores
        // Pasar el UID del jugador actual para no notificarse a sí mismo
        this.winnerNotification.processWinners(
          winners,
          participant?.uid,
          this.roomId,
        );
      },
      { allowSignalWrites: false },
    );

    // Effect para detectar cuando se aprueba un ganador
    effect(
      () => {
        const r = this.room();
        const participant = this.participant();

        if (
          !r ||
          !r.currentRoundVerifiedWinners ||
          r.currentRoundVerifiedWinners.length === 0
        ) {
          return;
        }

        // Obtener el último ganador verificado
        const verifiedWinners = r.currentRoundVerifiedWinners;
        const lastWinner = verifiedWinners[verifiedWinners.length - 1];

        if (lastWinner) {
          // Mostrar toast diferente si soy yo el ganador
          const isMe = lastWinner.uid === participant?.uid;

          this.alertService.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: isMe
              ? '¡Felicidades! Has ganado esta ronda 🏆'
              : `${lastWinner.displayName} ha ganado esta ronda 🏆`,
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
          });
        }
      },
      { allowSignalWrites: false },
    );

    // Effect para detectar cuando el manager rechaza el gane
    let wasInWinners = false;
    effect(
      () => {
        const r = this.room();
        const participant = this.participant();

        if (!r || !participant) return;

        const isCurrentlyInWinners =
          r.currentRoundWinners?.includes(participant.uid) || false;

        // Verificar si fue aprobado (está en verified winners)
        const isInVerifiedWinners =
          r.currentRoundVerifiedWinners?.some(
            (w) => w.uid === participant.uid,
          ) || false;

        // Si estaba en winners, ya no está, Y tampoco está en verified winners = fue rechazado
        if (wasInWinners && !isCurrentlyInWinners && !isInVerifiedWinners) {
          this.alertService.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Gane rechazado ❌',
            text: 'El manager verificó tu tabla y no cumplía con los requisitos',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
          });
        }

        // Actualizar estado para la próxima ejecución
        wasInWinners = isCurrentlyInWinners;
      },
      { allowSignalWrites: false },
    );
  }

  ngOnInit() {
    console.log('🎬 [INIT] ngOnInit ejecutándose');
    // Usar NavigationEnd para reaccionar a cambios de ruta
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentPath = event.urlAfterRedirects || event.url;
        console.log('🚀 [NAVIGATION END]', currentPath);
        
        // Si estamos en /player, ocultar formulario
        if (currentPath.startsWith('/player')) {
          console.log('📋 [NAVIGATION] Ocultando formulario - /player');
          this.showJoinForm.set(false);
        }
        
        // Si estamos en /join, mostrar formulario
        if (currentPath.startsWith('/join')) {
          console.log('📝 [NAVIGATION] Mostrando formulario - /join');
        }
      }
    });

    // Check route to determine behavior
    this.route.url.subscribe((segments) => {
      const path = segments[0]?.path || '';
      console.log('🛤️ [ROUTE URL]', path);

      // Si estamos en /player, ocultar formulario inmediatamente (evitar flash)
      if (path === 'player') {
        console.log('👤 [ROUTE] path=player, ocultando formulario');
        this.showJoinForm.set(false);
      }

      // Si estamos en /join, verificar si ya tiene sesión activa
      if (path === 'join') {
        console.log('📝 [ROUTE] path=join');

        // Check if roomId is in URL params
        this.route.params.subscribe(async (params) => {
          if (params['roomId']) {
            this.roomId = params['roomId'];
            console.log('🆔 [ROUTE] roomId en URL:', params['roomId']);
            
            const user = this.currentUser();
            console.log('👤 [ROUTE] Usuario actual:', user?.uid);
            
            if (user) {
              // Verificar si ya tiene sesión guardada para este roomId
              const sessionKey = this.getPlayerSessionKey(user.uid, params['roomId']);
              console.log('🔑 [ROUTE] Buscando sesión con key:', sessionKey);
              const session = this.loadPlayerSession(user.uid, params['roomId']);
              console.log('🔍 [ROUTE] Sesión encontrada:', session);
              console.log('📦 [ROUTE] localStorage keys:', Object.keys(localStorage));
              
              if (session) {
                // Verificar si el participante existe en Firestore
                try {
                  console.log('🔥 [ROUTE] Verificando participante en Firestore...');
                  const participant = await firstValueFrom(
                    this.roomService.observeParticipant(params['roomId'], user.uid)
                  );
                  
                  console.log('👤 [ROUTE] Participante en Firestore:', participant);
                  
                  // Si existe en Firestore, redirigir automáticamente a /player
                  if (participant) {
                    console.log('🚀 [ROUTE] ✅ Redirigiendo automáticamente a /player');
                    await this.router.navigate(['/player', params['roomId']]);
                    return;
                  } else {
                    console.log('❌ [ROUTE] Participante NO existe en Firestore, mostrando formulario');
                  }
                } catch (error) {
                  console.log('⚠️ [ROUTE] Error verificando participante:', error);
                }
              } else {
                console.log('❌ [ROUTE] No hay sesión en localStorage');
              }
            } else {
              console.log('❌ [ROUTE] No hay usuario autenticado');
            }
            
            // Si no hay sesión o no existe en Firestore, mostrar formulario
            this.showJoinForm.set(true);
            
            // Solo limpiar sesión si es una sala DIFERENTE a la guardada
            const legacyRoomId = localStorage.getItem(this.legacyRoomKey);
            if (user && legacyRoomId && legacyRoomId !== params['roomId']) {
              console.log('🧹 [ROUTE] Limpiando sesión anterior:', legacyRoomId);
              this.clearPlayerSession(user.uid, legacyRoomId);
            }
          }
        });
      }

      // Si estamos en /player/:roomId, intentar restaurar sesión
      if (path === 'player') {
        this.route.params.subscribe((params) => {
          if (params['roomId']) {
            console.log('🎮 [ROUTE] player con roomId:', params['roomId']);
            this.roomId = params['roomId'];
            localStorage.setItem(this.legacyRoomKey, params['roomId']);
          } else {
            console.log('⚠️ [ROUTE] player SIN roomId, redirigiendo a /join');
            // Si llegamos a /player sin roomId, redirigir a /join
            this.router.navigate(['/join']);
          }
        });
      }
    });

    // Generate some tablas
    this.refreshAvailableTablas();
  }

  private async checkAutoRedirect(uid: string, roomId: string) {
    console.log('🔍 [AUTO REDIRECT] Iniciando verificación', { uid, roomId });
    
    // Verificar si ya tiene sesión guardada para este roomId
    const sessionKey = this.getPlayerSessionKey(uid, roomId);
    console.log('🔑 [AUTO REDIRECT] Buscando sesión con key:', sessionKey);
    const session = this.loadPlayerSession(uid, roomId);
    console.log('🔍 [AUTO REDIRECT] Sesión encontrada:', session);
    console.log('📦 [AUTO REDIRECT] localStorage keys:', Object.keys(localStorage));
    
    if (session) {
      // Verificar si el participante existe en Firestore
      try {
        console.log('🔥 [AUTO REDIRECT] Verificando participante en Firestore...');
        const participant = await firstValueFrom(
          this.roomService.observeParticipant(roomId, uid)
        );
        
        console.log('👤 [AUTO REDIRECT] Participante en Firestore:', participant);
        
        // Si existe en Firestore, redirigir automáticamente a /player
        if (participant) {
          console.log('🚀 [AUTO REDIRECT] ✅ Redirigiendo automáticamente a /player');
          await this.router.navigate(['/player', roomId]);
          return;
        } else {
          console.log('❌ [AUTO REDIRECT] Participante NO existe en Firestore');
        }
      } catch (error) {
        console.log('⚠️ [AUTO REDIRECT] Error verificando participante:', error);
      }
    } else {
      console.log('❌ [AUTO REDIRECT] No hay sesión en localStorage');
    }
  }

  refreshAvailableTablas() {
    // Generar 3 tablas aleatorias para que el jugador elija
    this.availableTablas.set(this.gameUtils.generateMultipleTablas(3));

    // Desplazar la vista al inicio del contenedor si es necesario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private async restorePlayerSession() {
    const user = this.currentUser();
    console.log('🔄 [RESTORE] Iniciando restorePlayerSession', { user: user?.uid });
    if (!user) {
      console.log('❌ [RESTORE] No hay usuario, saliendo');
      return;
    }

    const roomIdCandidate =
      this.roomId || localStorage.getItem(this.legacyRoomKey) || '';
    console.log('🆔 [RESTORE] roomIdCandidate:', roomIdCandidate);
    if (!roomIdCandidate) {
      console.log('❌ [RESTORE] No hay roomId, saliendo');
      return;
    }

    const session = this.loadPlayerSession(user.uid, roomIdCandidate);
    console.log('💾 [RESTORE] Sesión cargada:', session);

    // Si estamos en proceso de selección, no restaurar (es un join nuevo)
    if (this.isInSelectionProcess) {
      console.log('❌ [RESTORE] isInSelectionProcess=true, saliendo');
      return;
    }

    this.roomLoading.set(true);

    // Cargar marcas de localStorage si existen
    const marks = session?.marks ?? [];
    console.log('📍 [RESTORE] Marcas de localStorage:', marks);

    if (roomIdCandidate && user) {
      try {
        // Verificar si la sala existe
        const room = await this.roomService.getRoom(roomIdCandidate);
        if (!room) {
          // La sala no existe, limpiar y mostrar modal
          this.clearPlayerSession(user.uid, roomIdCandidate);
          this.gameState.isRoomDeleted.set(true);
          this.roomLoading.set(false);
          return;
        }

        this.roomId = roomIdCandidate;

        // Verificar si el participante existe en Firestore
        const existingParticipant = await firstValueFrom(
          this.roomService.observeParticipant(roomIdCandidate, user.uid),
        );

        // Si el participante no existe, registrarlo automáticamente
        if (!existingParticipant) {
          const displayNameToUse = session?.displayName || user.displayName;
          const participant: Omit<Participant, 'joinedAt'> = {
            uid: user.uid,
            displayName: displayNameToUse,
            role: 'player',
            marks: [],
            victories: 0,
            isActive: true,
          };
          await this.roomService.joinRoom(roomIdCandidate, participant);
        }

        // Iniciar observación centralizada en el servicio
        this.gameState.observeRoom(roomIdCandidate, user.uid);

        // Restaurar desde Firestore (marker y tabla vienen de la DB)
        let restoredMarker = null;
        let restoredTabla = null;

        if (existingParticipant) {
          // Restaurar displayName
          if (existingParticipant.displayName) {
            this.displayName = existingParticipant.displayName;
          }

          // Restaurar marcador desde Firestore
          if (existingParticipant.marker) {
            restoredMarker = MARKERS.find((m) => m.id === existingParticipant.marker) ?? null;
            if (restoredMarker) {
              this.selectedMarker.set(restoredMarker);
            }
          }

          // Restaurar tabla desde Firestore
          if (existingParticipant.tablaCards && existingParticipant.tablaCards.length === 16) {
            restoredTabla = existingParticipant.tablaCards;
            this.myTabla.set(restoredTabla);
          }
        }

        // Restaurar marcas desde localStorage (tienen prioridad sobre Firestore)
        if (marks.length > 0) {
          this.myMarks.set(marks);
          console.log('✅ [RESTORE] Marcas restauradas desde localStorage:', marks.length);
          
          // Sincronizar marcas a Firestore para que observeParticipant no las sobrescriba
          await this.roomService.updateParticipant(roomIdCandidate, user.uid, {
            marks: marks,
          });
          console.log('🔄 [RESTORE] Marcas sincronizadas a Firestore');
        } else if (existingParticipant?.marks && existingParticipant.marks.length > 0) {
          this.myMarks.set(existingParticipant.marks);
          console.log('✅ [RESTORE] Marcas restauradas desde Firestore:', existingParticipant.marks.length);
        }

        // Elegir correctamente el paso de UI.
        this.showJoinForm.set(false);
        if (!restoredTabla) {
          // Sin tabla: mostrar selector de tabla primero
          this.isInSelectionProcess = true;
          this.showTablaSelector.set(true);
          this.showMarkerSelector.set(false);
        } else if (!restoredMarker) {
          // Tiene tabla pero no marcador: mostrar selector de marcador
          this.isInSelectionProcess = true;
          this.showMarkerSelector.set(true);
          this.showTablaSelector.set(false);
        } else {
          // Tiene ambos: listo para jugar
          this.isInSelectionProcess = false;
          this.showMarkerSelector.set(false);
          this.showTablaSelector.set(false);
        }

        // Guardar/migrar al formato nuevo para futuras recargas
        this.savePlayerSession(user.uid, roomIdCandidate, {
          displayName: this.displayName,
          marks: this.myMarks(),
        });

        // Navegar a /player/:roomId si restauración exitosa
        const currentPath = window.location.pathname;
        console.log('🎯 [RESTORE] Navegación?', { currentPath, shouldNavigate: currentPath.includes('/join/') });
        if (currentPath.includes('/join/')) {
          console.log('🚀 [RESTORE] Navegando a /player/', roomIdCandidate);
          await this.router.navigate(['/player', roomIdCandidate]);
        }
        console.log('✅ [RESTORE] Restauración completada');
      } catch (error) {
        console.error('❌ [RESTORE] Error auto-joining room:', error);
      }
    }
    this.roomLoading.set(false);
  }

  private getPlayerSessionKey(uid: string, roomId: string) {
    return `player-session:${uid}:${roomId}`;
  }

  private loadPlayerSession(
    uid: string,
    roomId: string,
  ): {
    displayName?: string;
    marks: number[];
  } | null {
    const raw = localStorage.getItem(this.getPlayerSessionKey(uid, roomId));
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as {
        displayName?: string;
        marks?: unknown;
      };
      const marks = Array.isArray(parsed.marks)
        ? (parsed.marks as unknown[]).filter((n) => typeof n === 'number')
        : [];
      return {
        displayName: parsed.displayName,
        marks: marks as number[],
      };
    } catch {
      return null;
    }
  }

  private savePlayerSession(
    uid: string,
    roomId: string,
    data: { displayName?: string; marks?: number[] },
  ) {
    const key = this.getPlayerSessionKey(uid, roomId);
    const value = JSON.stringify(data);
    console.log('💾 [SAVE SESSION] key:', key);
    console.log('💾 [SAVE SESSION] value:', value);
    localStorage.setItem(key, value);
    // Guardar roomId para referencia
    localStorage.setItem(this.legacyRoomKey, roomId);
    console.log('✅ [SAVE SESSION] Guardado en localStorage');
    console.log('📦 [SAVE SESSION] Verificación - valor guardado:', localStorage.getItem(key));
  }

  private clearPlayerSession(uid: string, roomId: string) {
    localStorage.removeItem(this.getPlayerSessionKey(uid, roomId));
    // Legacy cleanup
    localStorage.removeItem(this.legacyRoomKey);
    localStorage.removeItem(this.legacyMarkerKey);
    localStorage.removeItem(this.legacyTablaKey);
  }

  private parseLegacyMarkerId(raw: string | null): string | null {
    if (!raw) return null;
    // Legacy could be: "bean" (plain), or JSON string, or JSON object {id:...}
    if (MARKERS.some((m) => m.id === raw)) return raw;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'string' && MARKERS.some((m) => m.id === parsed))
        return parsed;
      if (
        parsed &&
        typeof parsed === 'object' &&
        'id' in parsed &&
        typeof (parsed as any).id === 'string'
      ) {
        const id = (parsed as any).id as string;
        return MARKERS.some((m) => m.id === id) ? id : null;
      }
    } catch {
      // ignore
    }
    return null;
  }

  private parseLegacyTabla(raw: string | null): number[] | null {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every((n) => typeof n === 'number'))
        return parsed as number[];
    } catch {
      // Some very old formats could be comma-separated
      const parts = raw
        .split(',')
        .map((p) => Number(p.trim()))
        .filter((n) => Number.isFinite(n));
      return parts.length ? parts : null;
    }
    return null;
  }

  async signInAnonymously() {
    if (!this.displayName.trim() || !this.roomId.trim()) {
      this.alertService.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    // Mostrar loading inmediatamente
    this.roomLoading.set(true);

    // Limpiar localStorage si es una sala diferente
    const legacyRoomId = localStorage.getItem(this.legacyRoomKey);
    if (legacyRoomId && legacyRoomId !== this.roomId.trim()) {
      localStorage.removeItem(this.legacyRoomKey);
      localStorage.removeItem(this.legacyMarkerKey);
      localStorage.removeItem(this.legacyTablaKey);
    }

    try {
      if (!this.currentUser()) {
        await this.authService.signInAnonymously(this.displayName);
      }
      await this.joinRoom();
    } catch (error: any) {
      console.error('Error joining room:', error);
      this.alertService.fire({
        icon: 'error',
        title: 'Error al unirse',
        text: error.message || 'No se pudo unirse a la sala',
        confirmButtonColor: '#10b981',
      });
    }
  }

  async signInWithGoogle() {
    if (!this.roomId.trim()) {
      this.alertService.fire({
        icon: 'warning',
        title: 'Código requerido',
        text: 'Por favor ingresa el código de la sala',
        confirmButtonColor: '#10b981',
      });
      return;
    }

    // Limpiar localStorage si es una sala diferente
    const legacyRoomId = localStorage.getItem(this.legacyRoomKey);
    if (legacyRoomId && legacyRoomId !== this.roomId.trim()) {
      localStorage.removeItem(this.legacyRoomKey);
      localStorage.removeItem(this.legacyMarkerKey);
      localStorage.removeItem(this.legacyTablaKey);
    }

    try {
      await this.authService.signInWithGoogle();
      this.displayName = this.currentUser()!.displayName;
      await this.joinRoom();
    } catch (error: any) {
      console.error('Error joining room:', error);
      this.alertService.fire({
        icon: 'error',
        title: 'Error al unirse',
        text: error.message || 'No se pudo unirse a la sala',
        confirmButtonColor: '#10b981',
      });
    }
  }

  private async joinRoom() {
    console.log('🚪 [JOIN] Iniciando joinRoom', { roomId: this.roomId, displayName: this.displayName });
    this.roomLoading.set(true);

    try {
      const room = await this.roomService.getRoom(this.roomId);
      if (!room) {
        this.roomLoading.set(false);
        this.alertService.fire({
          icon: 'error',
          title: 'Sala no encontrada',
          text: 'Verifica el código e inténtalo nuevamente',
          confirmButtonColor: '#10b981',
        });
        return;
      }

      const user = this.currentUser();
      if (!user) throw new Error('User not authenticated');

      // Iniciar observación centralizada
      this.gameState.observeRoom(this.roomId, user.uid);

      // Join room in Firestore
      const participant: Omit<Participant, 'joinedAt'> = {
        uid: user.uid,
        displayName: this.displayName || user.displayName,
        role: 'player',
        marks: [],
        victories: 0,
        isActive: true,
        status: 'choosing-marker',
      };

      await this.roomService.joinRoom(this.roomId, participant);

      // Guardar displayName y marcas en localStorage
      const sessionKey = this.getPlayerSessionKey(user.uid, this.roomId);
      console.log('💾 [JOIN] Guardando sesión con key:', sessionKey);
      console.log('💾 [JOIN] Datos a guardar:', { displayName: this.displayName, marks: [] });
      this.savePlayerSession(user.uid, this.roomId, {
        displayName: this.displayName,
        marks: [],
      });
      console.log('✅ [JOIN] Sesión guardada en localStorage');

      // Activar flag para desactivar validación durante selección
      console.log('🏁 [JOIN] isInSelectionProcess = true');
      this.isInSelectionProcess = true;

      // Ocultar formulario ANTES de navegar para evitar flash
      console.log('📋 [JOIN] Ocultando formulario y mostrando selector de tabla');
      this.showJoinForm.set(false);
      this.showTablaSelector.set(true); // Tabla primero

      // Esperar a que authLoading termine antes de navegar
      // Esto evita que el componente se renderice con estado de "no autenticado"
      let attempts = 0;
      while (this.authLoading() && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      console.log('⏳ [JOIN] Esperó authLoading:', attempts, 'intentos');

      // Navegar a /player/:roomId
      console.log('🚀 [JOIN] Navegando a /player/', this.roomId);
      await this.router.navigate(['/player', this.roomId]);

      console.log('✅ [JOIN] joinRoom completado');
      this.roomLoading.set(false);
    } catch (error) {
      console.error('Error joining room:', error);
      this.roomLoading.set(false);
      throw error;
    }
  }

  onMarkerSelected(marker: Marker) {
    this.selectedMarker.set(marker);
    const user = this.currentUser();
    if (user && this.roomId) {
      // Solo guardar displayName y marcas en localStorage
      this.savePlayerSession(user.uid, this.roomId, {
        displayName: this.displayName,
        marks: this.myMarks(),
      });

      // Actualizar marcador en Firestore
      this.roomService.updateParticipant(this.roomId, user.uid, {
        marker: marker.id,
        status: 'ready', // Ya tiene tabla y marcador
      });
    }
    this.showMarkerSelector.set(false);
    // Desactivar flag cuando se completa la selección
    this.isInSelectionProcess = false;
  }

  async startChangingMarker() {
    // Mostrar el selector de marcador
    this.showMarkerSelector.set(true);

    // Actualizar status a 'changing-marker' sin borrar datos
    const user = this.currentUser();
    if (user && this.roomId) {
      try {
        await this.roomService.updateParticipant(this.roomId, user.uid, {
          status: 'changing-marker',
        });
      } catch (error) {
        console.error('Error al actualizar status del jugador:', error);
      }
    }
  }

  cancelMarkerSelection() {
    this.showMarkerSelector.set(false);
    // Restaurar status a ready si tiene marcador y tabla
    const user = this.currentUser();
    if (
      user &&
      this.roomId &&
      this.selectedMarker() &&
      this.myTabla().length > 0
    ) {
      this.roomService.updateParticipant(this.roomId, user.uid, {
        status: 'ready',
      });
    }
  }

  cancelTablaSelection() {
    this.showTablaSelector.set(false);
    // Restaurar status a ready si tiene tabla
    const user = this.currentUser();
    if (user && this.roomId && this.myTabla().length > 0) {
      this.roomService.updateParticipant(this.roomId, user.uid, {
        status: 'ready',
      });
    }
  }

  async startChangingTabla() {
    // Mostrar el selector de tabla
    this.showTablaSelector.set(true);

    // Actualizar status a 'changing-tabla' sin borrar datos
    const user = this.currentUser();
    if (user && this.roomId) {
      try {
        await this.roomService.updateParticipant(this.roomId, user.uid, {
          status: 'changing-tabla',
        });
      } catch (error) {
        console.error('Error al actualizar status del jugador:', error);
      }
    }
  }

  selectTabla(tabla: number[]) {
    this.myTabla.set(tabla);
    this.myMarks.set([]);
    const user = this.currentUser();
    if (user && this.roomId) {
      // Solo guardar displayName y marcas en localStorage
      this.savePlayerSession(user.uid, this.roomId, {
        displayName: this.displayName,
        marks: [],
      });

      // Update participant in Firestore (marker y tabla)
      const tablaId = this.availableTablas().indexOf(tabla);
      const updates: Partial<Participant> = {
        tablaId,
        tablaCards: tabla,
        marks: [],
        status: this.selectedMarker() ? 'ready' : 'choosing-marker',
      };

      // Solo agregar marker si existe
      if (this.selectedMarker()?.id) {
        updates.marker = this.selectedMarker()!.id;
      }

      this.roomService.updateParticipant(this.roomId, user.uid, updates);
    }
    this.showTablaSelector.set(false);

    // Mostrar selector de marcador si aún no tiene uno
    if (!this.selectedMarker()) {
      this.showMarkerSelector.set(true);
      // Mantener flag activo hasta que seleccione marcador
    } else {
      // Si ya tiene marcador, completar selección
      this.isInSelectionProcess = false;
    }
  }

  async goHome() {
    // Limpiar la sesión del jugador al salir
    const user = this.currentUser();
    if (user && this.roomId) {
      try {
        // Remover participante de Firestore
        await this.roomService.leaveRoom(this.roomId, user.uid);
      } catch (error) {
        console.error('Error al remover participante:', error);
      }
      this.clearPlayerSession(user.uid, this.roomId);
    } else {
      // Best effort legacy cleanup
      localStorage.removeItem(this.legacyRoomKey);
      localStorage.removeItem(this.legacyMarkerKey);
      localStorage.removeItem(this.legacyTablaKey);
    }
    this.router.navigate(['/']);
  }
}
