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
    verso:
      'Que se despierte todito el barrio, porque canta temprano el... Gallo',
    color: '#FF6B6B',
    image: '/assets/images/cards/el_gallo.jpg',
  },
  {
    id: 2,
    name: 'El Diablito',
    emoji: '😈',
    verso: 'Quédate tranquilito, no te asustes con el... Diablito',
    color: '#FF4757',
    image: '/assets/images/cards/el_diablito.jpg',
  },
  {
    id: 3,
    name: 'La Dama',
    emoji: '💃',
    verso: 'Imponiendo toda su fama, llega firme la... Dama',
    color: '#FF6348',
    image: '/assets/images/cards/la_dama.jpg',
  },
  {
    id: 4,
    name: 'El Catrín',
    emoji: '🎩',
    verso: 'Siempre elegante hasta el fin, traje fino lleva el... Catrín',
    color: '#FFA502',
    image: '/assets/images/cards/el_catrin.jpg',
  },
  {
    id: 5,
    name: 'El Paraguas',
    emoji: '☂️',
    verso:
      'En tiempos de sol o tiempos de aguas, siempre te protege el... Paraguas',
    color: '#FF6B81',
    image: '/assets/images/cards/el_paraguas.jpg',
  },
  {
    id: 6,
    name: 'La Sirena',
    emoji: '🧜‍♀️',
    verso: 'Con su encanto te encadena, cuidado que ahi viene la... Sirena',
    color: '#5F27CD',
    image: '/assets/images/cards/la_sirena.jpg',
  },
  {
    id: 7,
    name: 'La Escalera',
    emoji: '🪜',
    verso: 'El que sube persevera, paso a paso por la... Escalera',
    color: '#00D2D3',
    image: '/assets/images/cards/la_escalera.jpg',
  },
  {
    id: 8,
    name: 'La Botella',
    emoji: '🍾',
    verso: 'Quiero beber en nombre de ella, pásame la... Botella',
    color: '#48DBFB',
    image: '/assets/images/cards/la_botella.jpg',
  },
  {
    id: 9,
    name: 'El Barril',
    emoji: '🛢️',
    verso: 'Guarda mezcal, tequila o maíz, ahí reposa el... Barril',
    color: '#341F97',
    image: '/assets/images/cards/el_barril.jpg',
  },
  {
    id: 10,
    name: 'El Árbol',
    emoji: '🌳',
    verso: 'Buena sombra desde alto, te cobija el... Árbol',
    color: '#10AC84',
    image: '/assets/images/cards/el_arbol.jpg',
  },
  {
    id: 11,
    name: 'El Melón',
    emoji: '🍈',
    verso: 'Verde afuera y dulce al son, sabe fresco el... Melón',
    color: '#2ECC71',
    image: '/assets/images/cards/el_melon.jpg',
  },
  {
    id: 12,
    name: 'El Valiente',
    emoji: '⚔️',
    verso: 'Sin miedo y de frente, da la cara el... Valiente',
    color: '#E74C3C',
    image: '/assets/images/cards/el_valiente.jpg',
  },
  {
    id: 13,
    name: 'El Gorrito',
    emoji: '🧢',
    verso: 'Para sereno o el solecito, ponte bien el... Gorrito',
    color: '#3498DB',
    image: '/assets/images/cards/el_gorrito.jpg',
  },
  {
    id: 14,
    name: 'La Muerte',
    emoji: '💀',
    verso: 'Pareja, callada y sin suerte, a todos llega la... Muerte',
    color: '#34495E',
    image: '/assets/images/cards/la_muerte.jpg',
  },
  {
    id: 15,
    name: 'La Pera',
    emoji: '🍐',
    verso: 'Verde como la bandera, ven y muérdele a la... Pera',
    color: '#F1C40F',
    image: '/assets/images/cards/la_pera.jpg',
  },
  {
    id: 16,
    name: 'La Bandera',
    emoji: '🇲🇽',
    verso: 'Ondeando donquequiera, todos saludan a la... Bandera',
    color: '#27AE60',
    image: '/assets/images/cards/la_bandera.jpg',
  },
  {
    id: 17,
    name: 'El Bandolón',
    emoji: '🪕',
    verso: 'Anima cualquier reunión, suena fuerte el... Bandolón',
    color: '#E67E22',
    image: '/assets/images/cards/el_banolon.jpg',
  },
  {
    id: 18,
    name: 'El Violoncello',
    emoji: '🎻',
    verso: 'Música del cuello al cielo, llora lento el... Violoncello',
    color: '#95A5A6',
    image: '/assets/images/cards/el_violonchelo.jpg',
  },
  {
    id: 19,
    name: 'La Garza',
    emoji: '🦩',
    verso: 'Sobre el agua no se cansa, elegante vuela la... Garza',
    color: '#FF6B9D',
    image: '/assets/images/cards/la_garza.jpg',
  },
  {
    id: 20,
    name: 'El PAjarito',
    emoji: '🦜',
    verso: 'Muy cerca de su nidito, canta bonito el... Pajarito',
    color: '#FFA502',
    image: '/assets/images/cards/el_pajarito.jpg',
  },
  {
    id: 21,
    name: 'La Mano',
    emoji: '✋',
    verso: 'La suerte tarde o temprano, cae justo en la... Mano',
    color: '#FDA7DF',
    image: '/assets/images/cards/la_mano.jpg',
  },
  {
    id: 22,
    name: 'La Bota',
    emoji: '👢',
    verso: 'El camino no se agota, pisa firme con la... Bota',
    color: '#B33771',
    image: '/assets/images/cards/la_bota.jpg',
  },
  {
    id: 23,
    name: 'La Luna',
    emoji: '🌙',
    verso: 'Testigo de mil fortunas, mira cómo brilla la... Luna',
    color: '#4834DF',
    image: '/assets/images/cards/la_luna.jpg',
  },
  {
    id: 24,
    name: 'El Cotorro',
    emoji: '🦜',
    verso: 'Habla y habla sin decoro, no se calla nada el... Cotorro',
    color: '#32FF7E',
    image: '/assets/images/cards/el_cotorro.jpg',
  },
  {
    id: 25,
    name: 'El Borracho',
    emoji: '🍺',
    verso: 'Promete mucho y da trabajo, ya llegó el... Borracho',
    color: '#FFC312',
    image: '/assets/images/cards/el_borracho.jpg',
  },
  {
    id: 26,
    name: 'El Negrito',
    emoji: '🎭',
    verso: 'Baila al son del tamborcito, siempre alegre el... Negrito',
    color: '#6D214F',
    image: '/assets/images/cards/el_negrito.jpg',
  },
  {
    id: 27,
    name: 'El Corazón',
    emoji: '❤️',
    verso: 'Motor de toda decisión, late fuerte el... Corazón',
    color: '#F53B57',
    image: '/assets/images/cards/el_corazon.jpg',
  },
  {
    id: 28,
    name: 'La Sandía',
    emoji: '🍉',
    verso: 'Refrescando el mediodía, roja y dulce es la... Sandía',
    color: '#3AE374',
    image: '/assets/images/cards/la_sandia.jpg',
  },
  {
    id: 29,
    name: 'El Tambor',
    emoji: '🥁',
    verso: 'Marca el paso con candor, que retumbe el... Tambor',
    color: '#ED4C67',
    image: '/assets/images/cards/el_tambor.jpg',
  },
  {
    id: 30,
    name: 'El Camarón',
    emoji: '🦐',
    verso: 'Si se queda dormilón, la corriente se lleva al... Camarón',
    color: '#FF9FF3',
    image: '/assets/images/cards/el_camaron.jpg',
  },
  {
    id: 31,
    name: 'Las Jaras',
    emoji: '🌿',
    verso: 'Las tomas o las disparas, no te enredes con las... Jaras',
    color: '#2ECC71',
    image: '/assets/images/cards/las_jaras.jpg',
  },
  {
    id: 32,
    name: 'El Músico',
    emoji: '🎺',
    verso: 'Que aplauda fuerte el público, que ya llegó el... Músico',
    color: '#FFD93D',
    image: '/assets/images/cards/el_musico.jpg',
  },
  {
    id: 33,
    name: 'La Araña',
    emoji: '🕷️',
    verso: 'Su paciencia nunca engaña, paso a paso va la... Araña',
    color: '#182C61',
    image: '/assets/images/cards/la_arana.jpg',
  },
  {
    id: 34,
    name: 'El Soldado',
    emoji: '🪖',
    verso: 'Firme, serio y bien plantado, en su puesto está el... Soldado',
    color: '#6C5CE7',
    image: '/assets/images/cards/el_soldado.jpg',
  },
  {
    id: 35,
    name: 'La Estrella',
    emoji: '⭐',
    verso: 'Cuando la noche destella, guía firme la... Estrella',
    color: '#FDCB6E',
    image: '/assets/images/cards/la_estrella.jpg',
  },
  {
    id: 36,
    name: 'El Cazo',
    emoji: '🍲',
    verso: 'Hierve lento y sin rechazo, todo cabe en el... Cazo',
    color: '#A29BFE',
    image: '/assets/images/cards/el_cazo.jpg',
  },
  {
    id: 37,
    name: 'El Mundo',
    emoji: '🌍',
    verso: 'Rueda y gira vagabundo, en él vivimos, es el... Mundo',
    color: '#00B894',
    image: '/assets/images/cards/el_mundo.jpg',
  },
  {
    id: 38,
    name: 'El Apache',
    emoji: '🏹',
    verso: 'Siempre firme y con huarache, así camina el... Apache',
    color: '#D63031',
    image: '/assets/images/cards/el_apache.jpg',
  },
  {
    id: 39,
    name: 'El Nopal',
    emoji: '🌵',
    verso: 'No te vayas a espinar, aunque sea baboso el... Nopal',
    color: '#00CEC9',
    image: '/assets/images/cards/el_nopal.jpg',
  },
  {
    id: 40,
    name: 'El Alacrán',
    emoji: '🦂',
    verso: 'Si lo miras no te vayas a acercar, pica duro el... Alacrán',
    color: '#FDCB6E',
    image: '/assets/images/cards/el_alacran.jpg',
  },
  {
    id: 41,
    name: 'La Rosa',
    emoji: '🌹',
    verso: 'Perfumada y glamorosa, roja y bella es la... Rosa',
    color: '#FF7675',
    image: '/assets/images/cards/la_rosa.jpg',
  },
  {
    id: 42,
    name: 'La Calavera',
    emoji: '☠️',
    verso: 'Risa y risa aunque nada espera, ahí se asoma la... Calavera',
    color: '#2D3436',
    image: '/assets/images/cards/la_calavera.jpg',
  },
  {
    id: 43,
    name: 'La Campana',
    emoji: '🔔',
    verso: 'Suena fuerte en la mañana, ya repica la... Campana',
    color: '#E17055',
    image: '/assets/images/cards/la_campana.jpg',
  },
  {
    id: 44,
    name: 'El Cantarito',
    emoji: '🏺',
    verso: 'Todo cabe despacito, bien servido en el... Cantarito',
    color: '#74B9FF',
    image: '/assets/images/cards/el_cantarito.jpg',
  },
  {
    id: 45,
    name: 'El Venado',
    emoji: '🦌',
    verso: 'No lo vas a ver parado, porque salta y salta el... Venado',
    color: '#A29BFE',
    image: '/assets/images/cards/el_venado.jpg',
  },
  {
    id: 46,
    name: 'El Sol',
    emoji: '☀️',
    verso: 'En el día te da calor, porque sale fuerte el... Sol',
    color: '#FFA502',
    image: '/assets/images/cards/el_sol.jpg',
  },
  {
    id: 47,
    name: 'La Corona',
    emoji: '👑',
    verso: 'Si el poder no se razona, pesa mucho la... Corona',
    color: '#FFD700',
    image: '/assets/images/cards/la_corona.jpg',
  },
  {
    id: 48,
    name: 'La Chalupa',
    emoji: '⛵',
    verso: 'Sobre el agua se columpia, va remando la... Chalupa',
    color: '#0984E3',
    image: '/assets/images/cards/la_chalupa.jpg',
  },
  {
    id: 49,
    name: 'El Pino',
    emoji: '🌲',
    verso: 'Haga o no haga frío, crece alto el... Pino',
    color: '#00B894',
    image: '/assets/images/cards/el_pino.jpg',
  },
  {
    id: 50,
    name: 'El Pescado',
    emoji: '🐟',
    verso: 'Si resbala y se ha escapado, fue astuto el... Pescado',
    color: '#74B9FF',
    image: '/assets/images/cards/el_pescado.jpg',
  },
  {
    id: 51,
    name: 'La Palma',
    emoji: '🌴',
    verso: 'Alta y siempre en calma, mece y mece la... Palma',
    color: '#55EFC4',
    image: '/assets/images/cards/la_palma.jpg',
  },
  {
    id: 52,
    name: 'La Maceta',
    emoji: '🪴',
    verso: 'Si la tierra no se aprieta, no florece la... Maceta',
    color: '#81ECEC',
    image: '/assets/images/cards/la_maceta.jpg',
  },
  {
    id: 53,
    name: 'El Arpa',
    emoji: '🎼',
    verso: 'Su música hasta el alma, suena bello el... Arpa',
    color: '#DFE6E9',
    image: '/assets/images/cards/el_arpa.jpg',
  },
  {
    id: 54,
    name: 'La Rana',
    emoji: '🐸',
    verso: 'Da un brinquito y luego canta, en el charco está la... Rana',
    color: '#00B894',
    image: '/assets/images/cards/la_rana.jpg',
  },
];

/**
 * Marcadores disponibles para usar en el juego
 */
export const MARKERS: Marker[] = [
  { id: 'bean', name: 'Frijol', emoji: '🫘', color: '#16a34a' },
  { id: 'corn', name: 'Maíz', emoji: '🌽', color: '#10b981' },
  { id: 'coin', name: 'Moneda', emoji: '🪙', color: '#0f766e' },
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
