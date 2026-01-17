import { Card, Marker } from '../models/game.model';

/**
 * 54 cartas tradicionales de la Lotería Mexicana con sus versos
 * Usando emojis para representación visual
 */
export const CARDS: Card[] = [
  {
    id: 1,
    name: 'El Gallo',
    emoji: '🐓',
    verso: 'El que le cantó a San Pedro',
    color: '#FF6B6B',
    image: '/images/cards/el_gallo.jpg',
  },
  {
    id: 2,
    name: 'El Diablito',
    emoji: '😈',
    verso: 'Portate bien cuatito',
    color: '#FF4757',
    image: '/images/cards/el_diablito.jpg',
  },
  {
    id: 3,
    name: 'La Dama',
    emoji: '💃',
    verso: 'Puliendo el pasador',
    color: '#FF6348',
    image: '/images/cards/la_dama.jpg',
  },
  {
    id: 4,
    name: 'El Catrín',
    emoji: '🎩',
    verso: 'Don Ferruco en el alameda',
    color: '#FFA502',
    image: '/images/cards/el_catrin.jpg',
  },
  {
    id: 5,
    name: 'El Paraguas',
    emoji: '☂️',
    verso: 'Para el sol y para el agua',
    color: '#FF6B81',
    image: '/images/cards/el_paraguas.jpg',
  },
  {
    id: 6,
    name: 'La Sirena',
    emoji: '🧜‍♀️',
    verso: 'No te dejes llevar por ella',
    color: '#5F27CD',
    image: '/images/cards/la_sirena.jpg',
  },
  {
    id: 7,
    name: 'La Escalera',
    emoji: '🪜',
    verso: 'La que subió Don Ferruco',
    color: '#00D2D3',
    image: '/images/cards/la_escalera.jpg',
  },
  {
    id: 8,
    name: 'La Botella',
    emoji: '🍾',
    verso: 'La herramienta del borracho',
    color: '#48DBFB',
    image: '/images/cards/la_botella.jpg',
  },
  {
    id: 9,
    name: 'El Barril',
    emoji: '🛢️',
    verso: 'Tanto bebió el albañil',
    color: '#341F97',
    image: '/images/cards/el_barril.jpg',
  },
  {
    id: 10,
    name: 'El Árbol',
    emoji: '🌳',
    verso: 'El que a tu sombra se puso',
    color: '#10AC84',
    image: '/images/cards/el_arbol.jpg',
  },
  {
    id: 11,
    name: 'El Melón',
    emoji: '🍈',
    verso: 'Me lo das o me lo quitas',
    color: '#2ECC71',
    image: '/images/cards/el_melon.jpg',
  },
  {
    id: 12,
    name: 'El Valiente',
    emoji: '⚔️',
    verso: 'No le saco al compromiso',
    color: '#E74C3C',
    image: '/images/cards/el_valiente.jpg',
  },
  {
    id: 13,
    name: 'El Gorrito',
    emoji: '🧢',
    verso: 'De la Virgen de Zapopan',
    color: '#3498DB',
    image: '/images/cards/el_gorrito.jpg',
  },
  {
    id: 14,
    name: 'La Muerte',
    emoji: '💀',
    verso: 'La que a todos nos lleva',
    color: '#34495E',
    image: '/images/cards/la_muerte.jpg',
  },
  {
    id: 15,
    name: 'La Pera',
    emoji: '🍐',
    verso: 'El que espera desespera',
    color: '#F1C40F',
    image: '/images/cards/la_pera.jpg',
  },
  {
    id: 16,
    name: 'La Bandera',
    emoji: '🇲🇽',
    verso: 'Verde blanco y colorado',
    color: '#27AE60',
    image: '/images/cards/la_bandera.jpg',
  },
  {
    id: 17,
    name: 'El Bandolón',
    emoji: '🪕',
    verso: 'Tocando su bandolón',
    color: '#E67E22',
    image: '/images/cards/el_banolon.jpg',
  },
  {
    id: 18,
    name: 'El Violoncello',
    emoji: '🎻',
    verso: 'Se cura con la mona',
    color: '#95A5A6',
    image: '/images/cards/el_violonchelo.jpg',
  },
  {
    id: 19,
    name: 'La Garza',
    emoji: '🦩',
    verso: 'Al otro lado del río',
    color: '#FF6B9D',
    image: '/images/cards/la_garza.jpg',
  },
  {
    id: 20,
    name: 'El Pájaro',
    emoji: '🦜',
    verso: 'Le cantaba a la luna',
    color: '#FFA502',
    image: '/images/cards/el_pajarito.jpg',
  },
  {
    id: 21,
    name: 'La Mano',
    emoji: '✋',
    verso: 'La del criminal',
    color: '#FDA7DF',
    image: '/images/cards/la_mano.jpg',
  },
  {
    id: 22,
    name: 'La Bota',
    emoji: '👢',
    verso: 'La que no se le rajo',
    color: '#B33771',
    image: '/images/cards/la_bota.jpg',
  },
  {
    id: 23,
    name: 'La Luna',
    emoji: '🌙',
    verso: 'El farol de los enamorados',
    color: '#4834DF',
    image: '/images/cards/la_luna.jpg',
  },
  {
    id: 24,
    name: 'El Cotorro',
    emoji: '🦜',
    verso: 'Sentado en su verde rama',
    color: '#32FF7E',
    image: '/images/cards/el_cotorro.jpg',
  },
  {
    id: 25,
    name: 'El Borracho',
    emoji: '🍺',
    verso: 'A donde vas tan pedo',
    color: '#FFC312',
    image: '/images/cards/el_borracho.jpg',
  },
  {
    id: 26,
    name: 'El Negrito',
    emoji: '🎭',
    verso: 'De la costa',
    color: '#6D214F',
    image: '/images/cards/el_negrito.jpg',
  },
  {
    id: 27,
    name: 'El Corazón',
    emoji: '❤️',
    verso: 'No me extrañes corazón',
    color: '#F53B57',
    image: '/images/cards/el_corazon.jpg',
  },
  {
    id: 28,
    name: 'La Sandía',
    emoji: '🍉',
    verso: 'La barriga que Juan tenía',
    color: '#3AE374',
    image: '/images/cards/la_sandia.jpg',
  },
  {
    id: 29,
    name: 'El Tambor',
    emoji: '🥁',
    verso: 'Tan, tan',
    color: '#ED4C67',
    image: '/images/cards/el_tambor.jpg',
  },
  {
    id: 30,
    name: 'El Camarón',
    emoji: '🦐',
    verso: 'Camarón que se duerme',
    color: '#FF9FF3',
    image: '/images/cards/el_camaron.jpg',
  },
  {
    id: 31,
    name: 'Las Jaras',
    emoji: '🌿',
    verso: 'Las jaras del indio',
    color: '#2ECC71',
    image: '/images/cards/las_jaras.jpg',
  },
  {
    id: 32,
    name: 'El Músico',
    emoji: '🎺',
    verso: 'El que toca en la plaza',
    color: '#FFD93D',
    image: '/images/cards/el_musico.jpg',
  },
  {
    id: 33,
    name: 'La Araña',
    emoji: '🕷️',
    verso: 'Atrapa mosca',
    color: '#182C61',
    image: '/images/cards/la_arana.jpg',
  },
  {
    id: 34,
    name: 'El Soldado',
    emoji: '🪖',
    verso: 'Uno, dos y tres',
    color: '#6C5CE7',
    image: '/images/cards/el_soldado.jpg',
  },
  {
    id: 35,
    name: 'La Estrella',
    emoji: '⭐',
    verso: 'La guía de los marineros',
    color: '#FDCB6E',
    image: '/images/cards/la_estrella.jpg',
  },
  {
    id: 36,
    name: 'El Cazo',
    emoji: '🍲',
    verso: 'El que por su mal se llevó',
    color: '#A29BFE',
    image: '/images/cards/el_cazo.jpg',
  },
  {
    id: 37,
    name: 'El Mundo',
    emoji: '🌍',
    verso: 'Este mundo es una bola',
    color: '#00B894',
    image: '/images/cards/el_mundo.jpg',
  },
  {
    id: 38,
    name: 'El Apache',
    emoji: '🏹',
    verso: '¡Ay vienen los apaches!',
    color: '#D63031',
    image: '/images/cards/el_apache.jpg',
  },
  {
    id: 39,
    name: 'El Nopal',
    emoji: '🌵',
    verso: 'Me dejó el nopal',
    color: '#00CEC9',
    image: '/images/cards/el_nopal.jpg',
  },
  {
    id: 40,
    name: 'El Alacrán',
    emoji: '🦂',
    verso: 'El que con la cola pica',
    color: '#FDCB6E',
    image: '/images/cards/el_alacran.jpg',
  },
  {
    id: 41,
    name: 'La Rosa',
    emoji: '🌹',
    verso: 'Rosita, Rosaura',
    color: '#FF7675',
    image: '/images/cards/la_rosa.jpg',
  },
  {
    id: 42,
    name: 'La Calavera',
    emoji: '☠️',
    verso: 'Al pasar de la barca',
    color: '#2D3436',
    image: '/images/cards/la_calavera.jpg',
  },
  {
    id: 43,
    name: 'La Campana',
    emoji: '🔔',
    verso: 'Tin tan',
    color: '#E17055',
    image: '/images/cards/la_campana.jpg',
  },
  {
    id: 44,
    name: 'El Cantarito',
    emoji: '🏺',
    verso: 'Tanto va el cántaro al agua',
    color: '#74B9FF',
    image: '/images/cards/el_cantarito.jpg',
  },
  {
    id: 45,
    name: 'El Venado',
    emoji: '🦌',
    verso: 'Saltando va buscando',
    color: '#A29BFE',
    image: '/images/cards/el_venado.jpg',
  },
  {
    id: 46,
    name: 'El Sol',
    emoji: '☀️',
    verso: 'La cobija de los pobres',
    color: '#FFA502',
    image: '/images/cards/el_sol.jpg',
  },
  {
    id: 47,
    name: 'La Corona',
    emoji: '👑',
    verso: 'El sombrero de los reyes',
    color: '#FFD700',
    image: '/images/cards/la_corona.jpg',
  },
  {
    id: 48,
    name: 'La Chalupa',
    emoji: '⛵',
    verso: 'Rema que rema Lupita',
    color: '#0984E3',
    image: '/images/cards/la_chalupa.jpg',
  },
  {
    id: 49,
    name: 'El Pine',
    emoji: '🌲',
    verso: 'Verde por fuera',
    color: '#00B894',
    image: '/images/cards/el_pino.jpg',
  },
  {
    id: 50,
    name: 'El Pescado',
    emoji: '🐟',
    verso: 'El que por la boca muere',
    color: '#74B9FF',
    image: '/images/cards/el_pescado.jpg',
  },
  {
    id: 51,
    name: 'La Palma',
    emoji: '🌴',
    verso: 'Palmera, palmera',
    color: '#55EFC4',
    image: '/images/cards/la_palma.jpg',
  },
  {
    id: 52,
    name: 'La Maceta',
    emoji: '🪴',
    verso: "El que nace pa' maceta",
    color: '#81ECEC',
    image: '/images/cards/la_maceta.jpg',
  },
  {
    id: 53,
    name: 'El Arpa',
    emoji: '🎼',
    verso: 'Arpa vieja de mi suegra',
    color: '#DFE6E9',
    image: '/images/cards/el_arpa.jpg',
  },
  {
    id: 54,
    name: 'La Rana',
    emoji: '🐸',
    verso: 'Al ver a la verde rana',
    color: '#00B894',
    image: '/images/cards/la_rana.jpg',
  },
];

/**
 * Marcadores disponibles para usar en el juego
 */
export const MARKERS: Marker[] = [
  { id: 'bean', name: 'Frijol', emoji: '🫘', color: '#6F4E37' },
  { id: 'corn', name: 'Maíz', emoji: '🌽', color: '#F1C40F' },
  { id: 'coin', name: 'Moneda', emoji: '🪙', color: '#FFD700' },
];

/**
 * Función para obtener un color aleatorio para los fondos
 */
export function getRandomColor(): string {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
    '#F8B739',
    '#52B788',
    '#FFB4A2',
    '#E5989B',
    '#B5838D',
    '#6D6875',
    '#FFCDB2',
    '#E8E8E4',
    '#B8F2E6',
    '#FFA69E',
    '#FAF3DD',
    '#C1D3FE',
    '#AED9E0',
    '#B8E0D2',
    '#D6EADF',
    '#EAC4D5',
    '#FE6D73',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Función para generar las 89 tablas únicas de lotería
 * Cada tabla tiene 16 cartas únicas (4x4) de las 54 disponibles
 */
export function generateAllTablas(): number[][] {
  const tablas: number[][] = [];
  const totalCards = 54;
  const cardsPerTabla = 16;

  // Generar 89 tablas únicas
  for (let i = 0; i < 89; i++) {
    const tabla: number[] = [];
    const availableCards = Array.from(
      { length: totalCards },
      (_, idx) => idx + 1
    );

    // Fisher-Yates shuffle
    for (let j = availableCards.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [availableCards[j], availableCards[k]] = [
        availableCards[k],
        availableCards[j],
      ];
    }

    // Tomar las primeras 16 cartas barajeadas
    tabla.push(...availableCards.slice(0, cardsPerTabla));
    tablas.push(tabla);
  }

  return tablas;
}
