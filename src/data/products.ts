import { Perfume } from '../types';

export const PERFUMES: Perfume[] = [
  {
    id: 'oud-imperial',
    name: 'Oud Impérial',
    subtitle: 'Extrait de Parfum Haute Concentration',
    volume: '100 ML',
    category: 'oriental',
    gender: 'unisexe',
    image: '/images/perfume-1.jpg',
    description: 'Une interprétation majestueuse du bois d\'Oud royal rehaussée de nuances ambrées et d\'épices nobles. Une présence captivante et inoubliable, idéale pour les grandes occasions.',
    notes: {
      top: ['Safran d\'Ispahan', 'Bergamote Noire', 'Poivre Rose'],
      heart: ['Oud du Cambodge', 'Rose de Damas', 'Encens Impérial'],
      base: ['Ambre Gris', 'Cuir de Russie', 'Bois de Cèdre de l\'Atlas']
    },
    sillage: 'Royal',
    longevity: '+16 Heures',
    accentColor: '#C8A34D',
    rating: 4.95,
    reviewsCount: 128,
    isBestseller: true
  },
  {
    id: 'noir-absolu',
    name: 'Noir Absolu',
    subtitle: 'Édition Sombre & Mystérieuse',
    volume: '100 ML',
    category: 'woody',
    gender: 'homme',
    image: '/images/perfume-2.jpg',
    description: 'Le charme ténébreux d\'un cuir précieux adouci par une vanille bourbon fumée et des volutes de tabac blond. Une aura magnétique réservée à ceux qui osent.',
    notes: {
      top: ['Feuille de Tabac', 'Cardamome Noire', 'Zeste d\'Orange Sanguine'],
      heart: ['Fève Tonka Grillée', 'Cuir Tanné', 'Cacao Amer'],
      base: ['Vanille Bourbon Noire', 'Patchouli Sombre', 'Bois de Gaïac']
    },
    sillage: 'Intense',
    longevity: '+14 Heures',
    accentColor: '#e0a96d',
    rating: 4.9,
    reviewsCount: 94,
    isBestseller: true
  },
  {
    id: 'rose-royale',
    name: 'Rose Royale',
    subtitle: 'Velours Floral & Musc Blanc',
    volume: '100 ML',
    category: 'floral',
    gender: 'femme',
    image: '/images/perfume-3.jpg',
    description: 'Une explosion opulente de roses fraîches cueillies à l\'aube, enveloppées d\'un voile soyeux de musc blanc et de praline fondante.',
    notes: {
      top: ['Litchi Givré', 'Baies Roses', 'Mandarine Italienne'],
      heart: ['Rose de Grasse', 'Pivoine Pourpre', 'Jasmin Sambac'],
      base: ['Musc Blanc Cashmère', 'Ambroxan Pur', 'Bois Blancs']
    },
    sillage: 'Intense',
    longevity: '+12 Heures',
    accentColor: '#f78ca0',
    rating: 4.88,
    reviewsCount: 82,
    isNew: true
  },
  {
    id: 'ambre-precieux',
    name: 'Ambre Précieux',
    subtitle: 'Alchimie d\'Or & Résines Rares',
    volume: '100 ML',
    category: 'oriental',
    gender: 'unisexe',
    image: '/images/perfume-4.jpg',
    description: 'Une caresse dorée et solaire née des résines les plus précieuses. Chaleureux, addictif et d\'un raffinement absolu sur la peau.',
    notes: {
      top: ['Cannelle de Ceylan', 'Géranium Bourbon', 'Noix de Muscade'],
      heart: ['Ambre Liquide', 'Benjoin de Siam', 'Héliotrope'],
      base: ['Santal de Mysore', 'Labdanum Doré', 'Muscs Chauds']
    },
    sillage: 'Royal',
    longevity: '+15 Heures',
    accentColor: '#ffd166',
    rating: 4.92,
    reviewsCount: 110,
    isBestseller: true
  },
  {
    id: 'elixir-dor',
    name: 'Élixir d\'Or',
    subtitle: 'Sillage Suprême & Miel Blanc',
    volume: '100 ML',
    category: 'woody',
    gender: 'unisexe',
    image: '/images/perfume-1.jpg',
    description: 'Un hommage à la richesse des trésors méditerranéens et orientaux, un élixir liquoreux sublimé par l\'or pur et des bois millénaires.',
    notes: {
      top: ['Néroli Doré', 'Pêche Veloutée', 'Davana'],
      heart: ['Miel Blanc de Montagne', 'Fleur d\'Oranger', 'Osmanthus'],
      base: ['Bois Précieux', 'Vanille Noire', 'Myrrhe Royale']
    },
    sillage: 'Royal',
    longevity: '+18 Heures',
    accentColor: '#f5c968',
    rating: 4.97,
    reviewsCount: 76,
    isNew: true
  },
  {
    id: 'santal-sublime',
    name: 'Santal Sublime',
    subtitle: 'Pureté Boisée & Iris Noir',
    volume: '100 ML',
    category: 'fresh',
    gender: 'homme',
    image: '/images/perfume-2.jpg',
    description: 'La rencontre entre la fraîcheur vive des agrumes de Calabre et la douceur crémeuse et aristocratique d\'un santal australien d\'exception.',
    notes: {
      top: ['Citron Caviar', 'Genévrier Givré', 'Sauge Sclarée'],
      heart: ['Beurre d\'Iris de Florence', 'Cardamome Verte', 'Feuille de Violette'],
      base: ['Santal Australien', 'Vétiver d\'Haïti', 'Mousse de Chêne']
    },
    sillage: 'Modéré',
    longevity: '+12 Heures',
    accentColor: '#a8c5b5',
    rating: 4.85,
    reviewsCount: 64
  }
];
