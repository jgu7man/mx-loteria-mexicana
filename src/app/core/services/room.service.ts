import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {
  Participant,
  Room,
  RoomConfig,
  RoomState,
  RoundHistory,
  RoundWinner,
} from '../models/game.model';
import { GameUtilsService } from './game-utils.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private firestore = inject(Firestore);
  private gameUtils = inject(GameUtilsService);

  constructor() {}

  /**
   * Crear una nueva sala
   */
  async createRoom(
    managerId: string,
    managerName: string,
    roomName: string,
    config: RoomConfig
  ): Promise<string> {
    try {
      const roomId = this.gameUtils.generateInviteCode(8);
      const roomRef = doc(this.firestore, 'salas', roomId);

      const room: Room = {
        id: roomId,
        name: roomName,
        managerId,
        managerName,
        state: 'waiting',
        config,
        deck: [],
        currentIndex: -1,
        currentRound: 0,
        currentRoundWinners: [],
        currentRoundVerifiedWinners: [],
        roundHistory: [],
        createdAt: new Date(),
        inviteLink: `${window.location.origin}/join/${roomId}`,
      };

      await setDoc(roomRef, this.serializeRoom(room));
      return roomId;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  /**
   * Obtener una sala por ID
   */
  async getRoom(roomId: string): Promise<Room | null> {
    try {
      const roomRef = doc(this.firestore, 'salas', roomId);
      const roomSnap = await getDoc(roomRef);

      if (roomSnap.exists()) {
        return this.deserializeRoom(roomSnap.data());
      }
      return null;
    } catch (error) {
      console.error('Error getting room:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las salas de un manager
   */
  async getRoomsByManager(managerId: string): Promise<Room[]> {
    try {
      const roomsRef = collection(this.firestore, 'salas');
      const q = query(roomsRef, where('managerId', '==', managerId));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => this.deserializeRoom(doc.data()));
    } catch (error) {
      console.error('Error getting rooms by manager:', error);
      throw error;
    }
  }

  /**
   * Escuchar cambios en tiempo real de una sala
   */
  observeRoom(roomId: string): Observable<Room | null> {
    return new Observable((observer) => {
      const roomRef = doc(this.firestore, 'salas', roomId);

      const unsubscribe = onSnapshot(
        roomRef,
        (snapshot) => {
          if (snapshot.exists()) {
            observer.next(this.deserializeRoom(snapshot.data()));
          } else {
            observer.next(null);
          }
        },
        (error) => {
          console.error('Error observing room:', error);
          observer.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  /**
   * Actualizar el estado de una sala
   */
  async updateRoomState(roomId: string, state: RoomState): Promise<void> {
    try {
      const roomRef = doc(this.firestore, 'salas', roomId);
      await updateDoc(roomRef, { state });
    } catch (error) {
      console.error('Error updating room state:', error);
      throw error;
    }
  }

  /**
   * Iniciar una nueva ronda
   */
  async startNewRound(roomId: string): Promise<void> {
    try {
      const roomRef = doc(this.firestore, 'salas', roomId);
      const room = await this.getRoom(roomId);

      if (!room) throw new Error('Room not found');

      const newDeck = this.gameUtils.generateNewDeck();
      const newRound = room.currentRound + 1;

      await updateDoc(roomRef, {
        deck: newDeck,
        currentIndex: -1,
        currentRound: newRound,
        state: 'playing',
        currentRoundWinners: [],
        currentRoundVerifiedWinners: [],
        startedAt: room.currentRound === 0 ? serverTimestamp() : room.startedAt,
      });
    } catch (error) {
      console.error('Error starting new round:', error);
      throw error;
    }
  }

  /**
   * Avanzar a la siguiente carta
   */
  async nextCard(roomId: string): Promise<void> {
    try {
      const roomRef = doc(this.firestore, 'salas', roomId);
      const room = await this.getRoom(roomId);

      if (!room) throw new Error('Room not found');
      if (room.currentIndex >= room.deck.length - 1) {
        throw new Error('No more cards in deck');
      }

      await updateDoc(roomRef, {
        currentIndex: room.currentIndex + 1,
      });
    } catch (error) {
      console.error('Error advancing card:', error);
      throw error;
    }
  }

  /**
   * Agregar un ganador a la ronda actual
   */
  async addWinner(roomId: string, winnerId: string): Promise<void> {
    try {
      const roomRef = doc(this.firestore, 'salas', roomId);
      const room = await this.getRoom(roomId);

      if (!room) throw new Error('Room not found');

      const updatedWinners = Array.from(
        new Set([...(room.currentRoundWinners || []), winnerId])
      );

      await updateDoc(roomRef, {
        currentRoundWinners: updatedWinners,
        state: 'verifying',
      });
    } catch (error) {
      console.error('Error adding winner:', error);
      throw error;
    }
  }

  /**
   * Finalizar la ronda actual
   */
  async finishRound(roomId: string, winners: RoundWinner[]): Promise<void> {
    try {
      const roomRef = doc(this.firestore, 'salas', roomId);
      const room = await this.getRoom(roomId);

      if (!room) throw new Error('Room not found');

      const roundHistory: RoundHistory = {
        roundNumber: room.currentRound,
        deck: room.deck,
        winners,
        completedAt: new Date(),
      };

      const updatedHistory = [...room.roundHistory, roundHistory];
      const isLastRound = room.currentRound >= room.config.maxRounds;

      await updateDoc(roomRef, {
        roundHistory: this.serializeRoundHistory(updatedHistory),
        state: isLastRound ? 'finished' : 'waiting',
        currentRoundWinners: [],
        currentRoundVerifiedWinners: [],
        finishedAt: isLastRound ? serverTimestamp() : undefined,
      });
    } catch (error) {
      console.error('Error finishing round:', error);
      throw error;
    }
  }

  /**
   * Aprobar un ganador (sin finalizar la ronda)
   */
  async approveWinner(roomId: string, winner: RoundWinner): Promise<void> {
    try {
      const roomRef = doc(this.firestore, 'salas', roomId);
      const room = await this.getRoom(roomId);
      if (!room) throw new Error('Room not found');

      const verified = [...(room.currentRoundVerifiedWinners || [])];
      const existingIndex = verified.findIndex((w) => w.uid === winner.uid);
      if (existingIndex >= 0) {
        verified[existingIndex] = winner;
      } else {
        verified.push(winner);
      }

      const pending = (room.currentRoundWinners || []).filter(
        (uid) => uid !== winner.uid
      );

      await updateDoc(roomRef, {
        currentRoundVerifiedWinners: this.serializeRoundWinners(verified),
        currentRoundWinners: pending,
        state: pending.length > 0 ? 'verifying' : 'playing',
      });
    } catch (error) {
      console.error('Error approving winner:', error);
      throw error;
    }
  }

  /**
   * Unirse a una sala como participante
   */
  async joinRoom(
    roomId: string,
    participant: Omit<Participant, 'joinedAt'>
  ): Promise<void> {
    try {
      const participantRef = doc(
        this.firestore,
        `salas/${roomId}/participantes`,
        participant.uid
      );

      await setDoc(participantRef, {
        ...participant,
        joinedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }

  /**
   * Actualizar los datos de un participante
   */
  async updateParticipant(
    roomId: string,
    uid: string,
    updates: Partial<Participant>
  ): Promise<void> {
    try {
      const participantRef = doc(
        this.firestore,
        `salas/${roomId}/participantes`,
        uid
      );
      await updateDoc(participantRef, updates);
    } catch (error) {
      console.error('Error updating participant:', error);
      throw error;
    }
  }

  /**
   * Cambiar la tabla de un participante (resetea las marcas)
   */
  async changeTabla(
    roomId: string,
    uid: string,
    newTablaId: number
  ): Promise<void> {
    try {
      await this.updateParticipant(roomId, uid, {
        tablaId: newTablaId,
        marks: [], // Reset marks when changing tabla
      });
    } catch (error) {
      console.error('Error changing tabla:', error);
      throw error;
    }
  }

  /**
   * Marcar una carta para un participante
   */
  async markCard(roomId: string, uid: string, cardId: number): Promise<void> {
    try {
      const participantRef = doc(
        this.firestore,
        `salas/${roomId}/participantes`,
        uid
      );
      const participantSnap = await getDoc(participantRef);

      if (!participantSnap.exists()) {
        throw new Error('Participant not found');
      }

      const participant = participantSnap.data() as Participant;
      const marks = participant.marks || [];

      if (!marks.includes(cardId)) {
        marks.push(cardId);
        await updateDoc(participantRef, { marks });
      }
    } catch (error) {
      console.error('Error marking card:', error);
      throw error;
    }
  }

  /**
   * Desmarcar una carta para un participante
   */
  async unmarkCard(roomId: string, uid: string, cardId: number): Promise<void> {
    try {
      const participantRef = doc(
        this.firestore,
        `salas/${roomId}/participantes`,
        uid
      );
      const participantSnap = await getDoc(participantRef);

      if (!participantSnap.exists()) {
        throw new Error('Participant not found');
      }

      const participant = participantSnap.data() as Participant;
      const marks = participant.marks || [];
      const updatedMarks = marks.filter((id) => id !== cardId);

      await updateDoc(participantRef, { marks: updatedMarks });
    } catch (error) {
      console.error('Error unmarking card:', error);
      throw error;
    }
  }

  /**
   * Observar participantes de una sala en tiempo real
   */
  observeParticipants(roomId: string): Observable<Participant[]> {
    return new Observable((observer) => {
      const participantsRef = collection(
        this.firestore,
        `salas/${roomId}/participantes`
      );

      const unsubscribe = onSnapshot(
        participantsRef,
        (snapshot) => {
          const participants: Participant[] = [];
          snapshot.forEach((doc) => {
            participants.push(this.deserializeParticipant(doc.data()));
          });
          observer.next(participants);
        },
        (error) => {
          console.error('Error observing participants:', error);
          observer.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  /**
   * Observar un participante específico en tiempo real
   */
  observeParticipant(
    roomId: string,
    uid: string
  ): Observable<Participant | null> {
    return new Observable((observer) => {
      const participantRef = doc(
        this.firestore,
        `salas/${roomId}/participantes`,
        uid
      );

      const unsubscribe = onSnapshot(
        participantRef,
        (snapshot) => {
          if (!snapshot.exists()) {
            observer.next(null);
            return;
          }
          observer.next(this.deserializeParticipant(snapshot.data()));
        },
        (error) => {
          console.error('Error observing participant:', error);
          observer.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  /**
   * Salir de una sala
   */
  async leaveRoom(roomId: string, uid: string): Promise<void> {
    try {
      const participantRef = doc(
        this.firestore,
        `salas/${roomId}/participantes`,
        uid
      );
      await deleteDoc(participantRef);
    } catch (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
  }

  /**
   * Eliminar una sala
   */
  async deleteRoom(roomId: string): Promise<void> {
    try {
      // Primero eliminar todos los participantes
      const participantsRef = collection(
        this.firestore,
        `salas/${roomId}/participantes`
      );
      const participantsSnap = await getDocs(participantsRef);

      const deletePromises = participantsSnap.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      // Luego eliminar la sala
      const roomRef = doc(this.firestore, 'salas', roomId);
      await deleteDoc(roomRef);
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }

  // Métodos de serialización/deserialización

  private serializeRoom(room: Room): any {
    const serialized: any = {
      ...room,
      createdAt: room.createdAt,
      currentRoundVerifiedWinners: this.serializeRoundWinners(
        room.currentRoundVerifiedWinners || []
      ),
      roundHistory: this.serializeRoundHistory(room.roundHistory),
    };

    // Solo incluir startedAt y finishedAt si tienen valor
    if (room.startedAt !== undefined) {
      serialized.startedAt = room.startedAt;
    }
    if (room.finishedAt !== undefined) {
      serialized.finishedAt = room.finishedAt;
    }

    return serialized;
  }

  private deserializeRoom(data: any): Room {
    return {
      ...data,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate()
        : new Date(data.createdAt),
      startedAt: data.startedAt?.toDate
        ? data.startedAt.toDate()
        : data.startedAt
        ? new Date(data.startedAt)
        : undefined,
      finishedAt: data.finishedAt?.toDate
        ? data.finishedAt.toDate()
        : data.finishedAt
        ? new Date(data.finishedAt)
        : undefined,
      currentRoundVerifiedWinners: this.deserializeRoundWinners(
        data.currentRoundVerifiedWinners || []
      ),
      roundHistory: this.deserializeRoundHistory(data.roundHistory || []),
    } as Room;
  }

  private serializeRoundWinners(winners: RoundWinner[]): any[] {
    return winners.map((w) => ({
      ...w,
      verifiedAt: w.verifiedAt,
    }));
  }

  private deserializeRoundWinners(data: any[]): RoundWinner[] {
    return (data || []).map((w: any) => ({
      ...w,
      verifiedAt: w.verifiedAt?.toDate
        ? w.verifiedAt.toDate()
        : new Date(w.verifiedAt),
    }));
  }

  private serializeRoundHistory(history: RoundHistory[]): any[] {
    return history.map((round) => ({
      ...round,
      completedAt: round.completedAt,
      winners: round.winners.map((w) => ({
        ...w,
        verifiedAt: w.verifiedAt,
      })),
    }));
  }

  private deserializeRoundHistory(data: any[]): RoundHistory[] {
    return data.map((round) => ({
      ...round,
      completedAt: round.completedAt?.toDate
        ? round.completedAt.toDate()
        : new Date(round.completedAt),
      winners: round.winners.map((w: any) => ({
        ...w,
        verifiedAt: w.verifiedAt?.toDate
          ? w.verifiedAt.toDate()
          : new Date(w.verifiedAt),
      })),
    }));
  }

  private deserializeParticipant(data: any): Participant {
    return {
      ...data,
      joinedAt: data.joinedAt?.toDate
        ? data.joinedAt.toDate()
        : new Date(data.joinedAt),
    } as Participant;
  }
}
