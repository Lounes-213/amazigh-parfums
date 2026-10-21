export interface Perfume {
  id: string;
  name: string;
  subtitle: string;
  volume: string;
  category: 'oriental' | 'woody' | 'floral' | 'fresh';
  gender: 'unisexe' | 'homme' | 'femme';
  image: string;
  description: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  sillage: 'Intense' | 'Modéré' | 'Royal';
  longevity: string;
  accentColor: string;
  rating: number;
  reviewsCount: number;
  isBestseller?: boolean;
  isNew?: boolean;
  price?: number;
  priceVisible?: boolean;
}

export interface CartItem {
  id: string;
  perfume: Perfume;
  engravedName?: string;
  quantity: number;
}
