import { RoomState } from '../models/game.model';

/**
 * Constantes de estados de la sala
 */
export const ROOM_STATES = {
  WAITING: 'waiting' as RoomState,
  PLAYING: 'playing' as RoomState,
  VERIFYING: 'verifying' as RoomState,
  FINISHED: 'finished' as RoomState,
} as const;

/**
 * Traducciones de estados al español
 */
export const ROOM_STATE_LABELS: Record<RoomState, string> = {
  waiting: 'Esperando',
  playing: 'Jugando',
  verifying: 'Verificando',
  finished: 'Finalizado',
};

/**
 * Colores para los estados (Tailwind classes)
 */
export const ROOM_STATE_COLORS: Record<
  RoomState,
  { bg: string; text: string }
> = {
  waiting: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  playing: { bg: 'bg-green-100', text: 'text-green-700' },
  verifying: { bg: 'bg-blue-100', text: 'text-blue-700' },
  finished: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

/**
 * Helper para verificar si una sala está en juego o verificando
 */
export function isRoomActive(state: RoomState): boolean {
  return state === ROOM_STATES.PLAYING || state === ROOM_STATES.VERIFYING;
}

/**
 * Helper para verificar si una sala está esperando
 */
export function isRoomWaiting(state: RoomState): boolean {
  return state === ROOM_STATES.WAITING;
}

/**
 * Helper para obtener la etiqueta traducida de un estado
 */
export function getRoomStateLabel(state: RoomState): string {
  return ROOM_STATE_LABELS[state] || state;
}

/**
 * Helper para obtener los colores de un estado
 */
export function getRoomStateColors(state: RoomState): {
  bg: string;
  text: string;
} {
  return (
    ROOM_STATE_COLORS[state] || { bg: 'bg-gray-100', text: 'text-gray-700' }
  );
}
