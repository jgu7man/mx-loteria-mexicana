import { Injectable } from '@angular/core';
import { CARDS } from '../constants/game-data';
import { PatternType, VictoryPattern } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameUtilsService {

  /**
   * Patrones de victoria disponibles
   */
  private readonly victoryPatterns: VictoryPattern[] = [
    {
      type: 'full',
      name: 'Lotería Llena',
      description: 'Todas las 16 cartas marcadas',
      positions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    },
    {
      type: 'horizontal',
      name: 'Línea Horizontal',
      description: 'Cualquier fila completa',
      positions: [] // Se valida dinámicamente
    },
    {
      type: 'vertical',
      name: 'Línea Vertical',
      description: 'Cualquier columna completa',
      positions: [] // Se valida dinámicamente
    },
    {
      type: 'diagonal',
      name: 'Diagonal',
      description: 'Diagonal completa',
      positions: [] // Se valida dinámicamente
    },
    {
      type: 'corners',
      name: 'Las Esquinas',
      description: 'Las 4 esquinas marcadas',
      positions: [0, 3, 12, 15]
    },
    {
      type: 'center',
      name: 'El Centro',
      description: 'Las 4 cartas del centro marcadas',
      positions: [5, 6, 9, 10]
    }
  ];

  constructor() { }

  /**
   * Algoritmo Fisher-Yates para barajar un array
   */
  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Generar un nuevo mazo de 54 cartas barajado
   */
  generateNewDeck(): number[] {
    const cardIds = CARDS.map(card => card.id);
    return this.shuffleArray(cardIds);
  }

  /**
   * Generar una tabla única con 16 cartas aleatorias
   */
  generateTabla(): number[] {
    const allCardIds = CARDS.map(card => card.id);
    const shuffled = this.shuffleArray(allCardIds);
    return shuffled.slice(0, 16);
  }

  /**
   * Generar múltiples tablas únicas
   */
  generateMultipleTablas(count: number): number[][] {
    const tablas: number[][] = [];
    for (let i = 0; i < count; i++) {
      tablas.push(this.generateTabla());
    }
    return tablas;
  }

  /**
   * Verificar si un conjunto de marcas cumple con un patrón de victoria
   */
  checkVictory(marks: number[], tablaCards: number[], patternType: PatternType = 'full'): boolean {
    // Convertir las marcas a posiciones en la tabla
    const markedPositions = marks.map(cardId => 
      tablaCards.indexOf(cardId)
    ).filter(pos => pos !== -1);

    switch (patternType) {
      case 'full':
        return markedPositions.length === 16;
      
      case 'horizontal':
        return this.checkHorizontalLine(markedPositions);
      
      case 'vertical':
        return this.checkVerticalLine(markedPositions);
      
      case 'diagonal':
        return this.checkDiagonal(markedPositions);
      
      case 'corners':
        return this.checkCorners(markedPositions);
      
      case 'center':
        return this.checkCenter(markedPositions);
      
      default:
        return false;
    }
  }

  /**
   * Obtener las cartas mostradas hasta ahora (para el historial)
   */
  getShownCards(deck: number[], currentIndex: number, limit?: number): number[] {
    const shownCards = deck.slice(0, currentIndex + 1);
    if (limit) {
      return shownCards.slice(-limit);
    }
    return shownCards;
  }

  /**
   * Verificar todas las marcas contra la tabla para asistir al manager
   */
  verifyMarks(marks: number[], tablaCards: number[]): {
    correct: number[];
    incorrect: number[];
    missing: number[];
  } {
    const correct: number[] = [];
    const incorrect: number[] = [];
    
    marks.forEach(cardId => {
      if (tablaCards.includes(cardId)) {
        correct.push(cardId);
      } else {
        incorrect.push(cardId);
      }
    });

    const missing = tablaCards.filter(cardId => !marks.includes(cardId));

    return { correct, incorrect, missing };
  }

  /**
   * Generar código de invitación único
   */
  generateInviteCode(length: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Calcular el progreso de una partida
   */
  calculateProgress(currentIndex: number, totalCards: number): number {
    return Math.round((currentIndex / totalCards) * 100);
  }

  // Métodos privados para verificar patrones

  private checkHorizontalLine(positions: number[]): boolean {
    const rows = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [12, 13, 14, 15]
    ];
    return rows.some(row => row.every(pos => positions.includes(pos)));
  }

  private checkVerticalLine(positions: number[]): boolean {
    const columns = [
      [0, 4, 8, 12],
      [1, 5, 9, 13],
      [2, 6, 10, 14],
      [3, 7, 11, 15]
    ];
    return columns.some(column => column.every(pos => positions.includes(pos)));
  }

  private checkDiagonal(positions: number[]): boolean {
    const diagonal1 = [0, 5, 10, 15];
    const diagonal2 = [3, 6, 9, 12];
    return diagonal1.every(pos => positions.includes(pos)) ||
           diagonal2.every(pos => positions.includes(pos));
  }

  private checkCorners(positions: number[]): boolean {
    const corners = [0, 3, 12, 15];
    return corners.every(pos => positions.includes(pos));
  }

  private checkCenter(positions: number[]): boolean {
    const center = [5, 6, 9, 10];
    return center.every(pos => positions.includes(pos));
  }

  /**
   * Obtener los patrones de victoria disponibles
   */
  getVictoryPatterns(): VictoryPattern[] {
    return this.victoryPatterns;
  }

  /**
   * Obtener un patrón específico
   */
  getPattern(type: PatternType): VictoryPattern | undefined {
    return this.victoryPatterns.find(p => p.type === type);
  }
}
