/**
 * Representa una carta de la Lotería Mexicana
 */
export interface Card {
  id: number;
  name: string;
  emoji: string;
  verso: string;
  color: string;
}

/**
 * Representa una tabla de juego (4x4 = 16 cartas)
 */
export interface Tabla {
  id: number;
  cards: number[]; // IDs de las 16 cartas en la tabla
  isAvailable: boolean; // Si la tabla está disponible para ser seleccionada
}

/**
 * Tipo de marcador para marcar las cartas
 */
export interface Marker {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

/**
 * Tipos de patrones de victoria
 */
export type PatternType =
  | 'full'
  | 'horizontal'
  | 'vertical'
  | 'diagonal'
  | 'corners'
  | 'center';

/**
 * Patrón de victoria
 */
export interface VictoryPattern {
  type: PatternType;
  name: string;
  description: string;
  positions: number[]; // Posiciones en el array [0-15] que deben estar marcadas
}

/**
 * Participante (Jugador o Espectador)
 */
export interface Participant {
  uid: string;
  displayName: string;
  photoURL?: string;
  role: 'player' | 'viewer';
  marker?: string; // ID del marcador seleccionado
  tablaId?: number; // ID de la tabla actual
  tablaCards?: number[]; // Cartas de la tabla (para verificación/visualización)
  marks: number[]; // IDs de las cartas marcadas
  victories: number; // Número de victorias en esta sala
  isActive: boolean;
  joinedAt: Date;
}

/**
 * Estado de una sala de juego
 */
export type RoomState = 'waiting' | 'playing' | 'verifying' | 'finished';

/**
 * Nivel de dificultad para espectadores
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Configuración de una sala
 */
export interface RoomConfig {
  maxRounds: number;
  viewerDifficulty: DifficultyLevel;
  allowLateJoin: boolean;
  autoVerify: boolean;
}

/**
 * Información de un ganador en una ronda
 */
export interface RoundWinner {
  uid: string;
  displayName: string;
  tablaId: number;
  tablaCards?: number[]; // Cartas de la tabla para visualización
  marks: number[];
  verifiedAt: Date;
}

/**
 * Historial de una ronda
 */
export interface RoundHistory {
  roundNumber: number;
  deck: number[]; // Orden de las cartas en esta ronda
  winners: RoundWinner[];
  completedAt: Date;
}

/**
 * Sala de juego
 */
export interface Room {
  id: string;
  name: string;
  managerId: string;
  managerName: string;
  state: RoomState;
  config: RoomConfig;

  // Estado del juego actual
  deck: number[]; // Orden aleatorio de las 54 cartas para esta ronda
  currentIndex: number; // Índice de la carta actual siendo mostrada
  currentRound: number;

  // Ganadores
  currentRoundWinners: string[]; // UIDs de ganadores en la ronda actual
  currentRoundVerifiedWinners?: RoundWinner[]; // Ganadores aprobados por el manager (sin finalizar ronda)
  roundHistory: RoundHistory[];

  // Metadatos
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
  qrCode?: string; // URL del código QR para unirse
  inviteLink?: string; // Link directo para unirse
}

/**
 * Datos completos de una sala con participantes
 */
export interface RoomWithParticipants extends Room {
  participants: Participant[];
}

/**
 * Opciones de autenticación
 */
export type AuthProvider = 'google' | 'anonymous';

/**
 * Usuario autenticado
 */
export interface AppUser {
  uid: string;
  email?: string;
  displayName: string;
  photoURL?: string;
  isAnonymous: boolean;
  provider: AuthProvider;
}
