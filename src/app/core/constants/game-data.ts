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
    verso: 'Que se despierte todito el barrio, porque canta temprano',
    color: '#FF6B6B',
    image: '/assets/images/cards/el_gallo.jpg',
  },
  {
    id: 2,
    name: 'El Diablito',
    emoji: '😈',
    verso: 'Escucha bien cuando te hablo, corre fuerte que ahi viene',
    color: '#FF4757',
    image: '/assets/images/cards/el_diablito.jpg',
  },
  {
    id: 3,
    name: 'La Dama',
    emoji: '💃',
    verso: 'Imponiendo toda su fama, llega firme',
    color: '#FF6348',
    image: '/assets/images/cards/la_dama.jpg',
  },
  {
    id: 4,
    name: 'El Catrín',
    emoji: '🎩',
    verso: 'Siempre elegante hasta el fin, traje fino',
    color: '#FFA502',
    image: '/assets/images/cards/el_catrin.jpg',
  },
  {
    id: 5,
    name: 'El Paraguas',
    emoji: '☂️',
    verso: 'En tiempos de sol o tiempos de aguas, siempre te protege',
    color: '#FF6B81',
    image: '/assets/images/cards/el_paraguas.jpg',
  },
  {
    id: 6,
    name: 'La Sirena',
    emoji: '🧜‍♀️',
    verso: 'Con su canto te encadena, cuidado que ahi viene',
    color: '#5F27CD',
    image: '/assets/images/cards/la_sirena.jpg',
  },
  {
    id: 7,
    name: 'La Escalera',
    emoji: '🪜',
    verso: 'El que sube persevera, paso a paso',
    color: '#00D2D3',
    image: '/assets/images/cards/la_escalera.jpg',
  },
  {
    id: 8,
    name: 'La Botella',
    emoji: '🍾',
    verso: 'Si la charla se atropella, que circule',
    color: '#48DBFB',
    image: '/assets/images/cards/la_botella.jpg',
  },
  {
    id: 9,
    name: 'El Barril',
    emoji: '🛢️',
    verso: 'Guarda mezcal, tequila o maíz, ahí reposa',
    color: '#341F97',
    image: '/assets/images/cards/el_barril.jpg',
  },
  {
    id: 10,
    name: 'El Árbol',
    emoji: '🌳',
    verso: 'Da sombra, fruto y desde lo alto, si crece mucho',
    color: '#10AC84',
    image: '/assets/images/cards/el_arbol.jpg',
  },
  {
    id: 11,
    name: 'El Melón',
    emoji: '🍈',
    verso: 'Verde afuera y dulce al son, sabe fresco',
    color: '#2ECC71',
    image: '/assets/images/cards/el_melon.jpg',
  },
  {
    id: 12,
    name: 'El Valiente',
    emoji: '⚔️',
    verso: 'Sin miedo y siempre de frente, da la cara',
    color: '#E74C3C',
    image: '/assets/images/cards/el_valiente.jpg',
  },
  {
    id: 13,
    name: 'El Gorrito',
    emoji: '🧢',
    verso: 'Para sereno o el solecito, ponte bien',
    color: '#3498DB',
    image: '/assets/images/cards/el_gorrito.jpg',
  },
  {
    id: 14,
    name: 'La Muerte',
    emoji: '💀',
    verso: 'Pareja, callada y sin suerte, a todos llega',
    color: '#34495E',
    image: '/assets/images/cards/la_muerte.jpg',
  },
  {
    id: 15,
    name: 'La Pera',
    emoji: '🍐',
    verso: 'Cuando madura y espera, llega a tiempo',
    color: '#F1C40F',
    image: '/assets/images/cards/la_pera.jpg',
  },
  {
    id: 16,
    name: 'La Bandera',
    emoji: '🇲🇽',
    verso: 'Orgullo que nunca espera, ondeando va',
    color: '#27AE60',
    image: '/assets/images/cards/la_bandera.jpg',
  },
  {
    id: 17,
    name: 'El Bandolón',
    emoji: '🪕',
    verso: 'Anima cualquier reunión, suena fuerte',
    color: '#E67E22',
    image: '/assets/images/cards/el_banolon.jpg',
  },
  {
    id: 18,
    name: 'El Violoncello',
    emoji: '🎻',
    verso: 'Música que llega al cuello, llora lento',
    color: '#95A5A6',
    image: '/assets/images/cards/el_violonchelo.jpg',
  },
  {
    id: 19,
    name: 'La Garza',
    emoji: '🦩',
    verso: 'Sobre el agua no se cansa, elegante vuela',
    color: '#FF6B9D',
    image: '/assets/images/cards/la_garza.jpg',
  },
  {
    id: 20,
    name: 'El Pájaro',
    emoji: '🦜',
    verso: 'Si para en la rama, atrápalo, canta bonito',
    color: '#FFA502',
    image: '/assets/images/cards/el_pajarito.jpg',
  },
  {
    id: 21,
    name: 'La Mano',
    emoji: '✋',
    verso: 'La suerte tarde o temprano, cae justo en',
    color: '#FDA7DF',
    image: '/assets/images/cards/la_mano.jpg',
  },
  {
    id: 22,
    name: 'La Bota',
    emoji: '👢',
    verso: 'El camino no se agota, pisa firme con',
    color: '#B33771',
    image: '/assets/images/cards/la_bota.jpg',
  },
  {
    id: 23,
    name: 'La Luna',
    emoji: '🌙',
    verso: 'Testigo de mil fortunas, mira cómo alumbra',
    color: '#4834DF',
    image: '/assets/images/cards/la_luna.jpg',
  },
  {
    id: 24,
    name: 'El Cotorro',
    emoji: '🦜',
    verso: 'Habla y habla sin decoro, no se calla nada',
    color: '#32FF7E',
    image: '/assets/images/cards/el_cotorro.jpg',
  },
  {
    id: 25,
    name: 'El Borracho',
    emoji: '🍺',
    verso: 'Promete mucho y da trabajo, ya llegó',
    color: '#FFC312',
    image: '/assets/images/cards/el_borracho.jpg',
  },
  {
    id: 26,
    name: 'El Negrito',
    emoji: '🎭',
    verso: 'Baila al son del tamborcito, siempre alegre',
    color: '#6D214F',
    image: '/assets/images/cards/el_negrito.jpg',
  },
  {
    id: 27,
    name: 'El Corazón',
    emoji: '❤️',
    verso: 'Motor de toda decisión, late fuerte',
    color: '#F53B57',
    image: '/assets/images/cards/el_corazon.jpg',
  },
  {
    id: 28,
    name: 'La Sandía',
    emoji: '🍉',
    verso: 'Refrescando el mediodía, roja y dulce',
    color: '#3AE374',
    image: '/assets/images/cards/la_sandia.jpg',
  },
  {
    id: 29,
    name: 'El Tambor',
    emoji: '🥁',
    verso: 'Marca el paso con candor, que retumbe',
    color: '#ED4C67',
    image: '/assets/images/cards/el_tambor.jpg',
  },
  {
    id: 30,
    name: 'El Camarón',
    emoji: '🦐',
    verso: 'Si se queda dormilón, la corriente se lo lleva',
    color: '#FF9FF3',
    image: '/assets/images/cards/el_camaron.jpg',
  },
  {
    id: 31,
    name: 'Las Jaras',
    emoji: '🌿',
    verso: 'Las tomas o las disparas, no te enredes con',
    color: '#2ECC71',
    image: '/assets/images/cards/las_jaras.jpg',
  },
  {
    id: 32,
    name: 'El Músico',
    emoji: '🎺',
    verso: 'Que aplauda fuerte el público, que ya llegó',
    color: '#FFD93D',
    image: '/assets/images/cards/el_musico.jpg',
  },
  {
    id: 33,
    name: 'La Araña',
    emoji: '🕷️',
    verso: 'Su paciencia nunca engaña, paso a paso va',
    color: '#182C61',
    image: '/assets/images/cards/la_arana.jpg',
  },
  {
    id: 34,
    name: 'El Soldado',
    emoji: '🪖',
    verso: 'Firme, serio y bien plantado, en su puesto está',
    color: '#6C5CE7',
    image: '/assets/images/cards/el_soldado.jpg',
  },
  {
    id: 35,
    name: 'La Estrella',
    emoji: '⭐',
    verso: 'Cuando la noche destella, guía firme',
    color: '#FDCB6E',
    image: '/assets/images/cards/la_estrella.jpg',
  },
  {
    id: 36,
    name: 'El Cazo',
    emoji: '🍲',
    verso: 'Hierve lento y sin rechazo, todo cabe en',
    color: '#A29BFE',
    image: '/assets/images/cards/el_cazo.jpg',
  },
  {
    id: 37,
    name: 'El Mundo',
    emoji: '🌍',
    verso: 'Rueda y gira vagabundo, en él vivimos, es',
    color: '#00B894',
    image: '/assets/images/cards/el_mundo.jpg',
  },
  {
    id: 38,
    name: 'El Apache',
    emoji: '🏹',
    verso: 'Siempre firme y con huarache, así camina',
    color: '#D63031',
    image: '/assets/images/cards/el_apache.jpg',
  },
  {
    id: 39,
    name: 'El Nopal',
    emoji: '🌵',
    verso: 'Orgullo firme del solar, así crece',
    color: '#00CEC9',
    image: '/assets/images/cards/el_nopal.jpg',
  },
  {
    id: 40,
    name: 'El Alacrán',
    emoji: '🦂',
    verso: 'Si lo miras no te vayas a acercar, pica duro',
    color: '#FDCB6E',
    image: '/assets/images/cards/el_alacran.jpg',
  },
  {
    id: 41,
    name: 'La Rosa',
    emoji: '🌹',
    verso: 'Perfumada y glamorosa, roja y bella es',
    color: '#FF7675',
    image: '/assets/images/cards/la_rosa.jpg',
  },
  {
    id: 42,
    name: 'La Calavera',
    emoji: '☠️',
    verso: 'Ríe y ríe aunque nada espera, ahí se asoma',
    color: '#2D3436',
    image: '/assets/images/cards/la_calavera.jpg',
  },
  {
    id: 43,
    name: 'La Campana',
    emoji: '🔔',
    verso: 'Suena fuerte en la mañana, ya repica',
    color: '#E17055',
    image: '/assets/images/cards/la_campana.jpg',
  },
  {
    id: 44,
    name: 'El Cantarito',
    emoji: '🏺',
    verso: 'Todo cabe despacito, bien servido',
    color: '#74B9FF',
    image: '/assets/images/cards/el_cantarito.jpg',
  },
  {
    id: 45,
    name: 'El Venado',
    emoji: '🦌',
    verso: 'Corre libre y bien parado, salta ágil',
    color: '#A29BFE',
    image: '/assets/images/cards/el_venado.jpg',
  },
  {
    id: 46,
    name: 'El Sol',
    emoji: '☀️',
    verso: 'Cuando el día toma color, sale fuerte',
    color: '#FFA502',
    image: '/assets/images/cards/el_sol.jpg',
  },
  {
    id: 47,
    name: 'La Corona',
    emoji: '👑',
    verso: 'Si el poder no se razona, pesa mucho',
    color: '#FFD700',
    image: '/assets/images/cards/la_corona.jpg',
  },
  {
    id: 48,
    name: 'La Chalupa',
    emoji: '⛵',
    verso: 'Sobre el agua se columpia, va remando',
    color: '#0984E3',
    image: '/assets/images/cards/la_chalupa.jpg',
  },
  {
    id: 49,
    name: 'El Pine',
    emoji: '🌲',
    verso: 'Siempre verde en su destino, crece alto',
    color: '#00B894',
    image: '/assets/images/cards/el_pino.jpg',
  },
  {
    id: 50,
    name: 'El Pescado',
    emoji: '🐟',
    verso: 'Si resbala y se ha escapado, fue astuto',
    color: '#74B9FF',
    image: '/assets/images/cards/el_pescado.jpg',
  },
  {
    id: 51,
    name: 'La Palma',
    emoji: '🌴',
    verso: 'Alta, recta y siempre en calma, se mece',
    color: '#55EFC4',
    image: '/assets/images/cards/la_palma.jpg',
  },
  {
    id: 52,
    name: 'La Maceta',
    emoji: '🪴',
    verso: 'Si la tierra no se aprieta, no florece',
    color: '#81ECEC',
    image: '/assets/images/cards/la_maceta.jpg',
  },
  {
    id: 53,
    name: 'El Arpa',
    emoji: '🎼',
    verso: 'Cuerda tensa y nota clara, suena bello',
    color: '#DFE6E9',
    image: '/assets/images/cards/el_arpa.jpg',
  },
  {
    id: 54,
    name: 'La Rana',
    emoji: '🐸',
    verso: 'Da un brinquito y no se afana, salta alegre',
    color: '#00B894',
    image: '/assets/images/cards/la_rana.jpg',
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
      (_, idx) => idx + 1,
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
