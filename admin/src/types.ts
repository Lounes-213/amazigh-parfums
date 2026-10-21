export interface Perfume {
  id: string;
  name: string;
  subtitle: string;
  volume: string;
  category: string;
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
  sortOrder?: number;
}

export interface Category {
  id: string;
  label: string;
  sortOrder?: number;
  count?: number;
}
