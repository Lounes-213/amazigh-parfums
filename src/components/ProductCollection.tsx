import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PERFUMES } from '../data/products';
import { Sparkles, Star, Heart, ArrowRight } from 'lucide-react';
import { GoldSparksCanvas } from './GoldSparksCanvas';

export const ProductCollection: React.FC = () => {
  const { setSelectedPerfumeForModal, perfumes, categories } = useShop();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const visibleCategories = categories.filter((c) => (c.count ?? 0) > 0);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredPerfumes = activeCategory === 'all'
    ? perfumes
    : perfumes.filter(p => p.category === activeCategory);

  return (
    <section id="collection-section" className="py-24 bg-noir relative border-t border-charbon overflow-hidden">
      
      {/* ANIMATED GOLDEN SPARKS BACKGROUND (Chararat Dori) */}
      <GoldSparksCanvas className="absolute inset-0 pointer-events-none z-0" />

      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-or/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-or/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-or/40 bg-or/10 text-or text-xs tracking-widest uppercase mb-4 shadow-gold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COLLECTION PRIVÉE AMAZIGH</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-ivoire font-light tracking-wide mb-4">
            Nos Parfums d'Exception
          </h2>
          <p className="text-ivoire/70 text-sm md:text-base leading-relaxed">
            Cliquez sur un parfum pour découvrir ses notes olfactives et inscrire votre nom sur le flacon.
          </p>

          {/* Categories Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: 'all', label: 'Tous les Parfums' },
              ...visibleCategories.map((c) => ({ id: c.id, label: c.label })),
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs tracking-wider transition-all duration-300 ${
                  activeCategory === cat.id 
                    ? 'bg-or text-noir font-semibold shadow-gold' 
                    : 'bg-charbon/70 text-ivoire/70 hover:text-ivoire border border-charbon hover:border-or/40 backdrop-blur-sm'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Perfume Cards Grid - Clean, No Hover Overlay Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPerfumes.map((perfume) => {
            const isFav = favorites.includes(perfume.id);

            return (
              <div
                key={perfume.id}
                onClick={() => setSelectedPerfumeForModal(perfume)}
                className="group bg-gradient-to-b from-charbon/60 via-noir-950/90 to-noir-950 rounded-2xl border border-charbon hover:border-or/60 transition-all duration-500 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:shadow-or/15 cursor-pointer relative transform hover:-translate-y-1.5 backdrop-blur-xs"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-charbon-dark/80 flex items-center justify-center p-6">
                  
                  {/* Badge Bestseller / New */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                    {perfume.isBestseller && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-or text-noir shadow-gold">
                        Best-Seller
                      </span>
                    )}
                    {perfume.isNew && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-ivoire text-noir">
                        Nouveau
                      </span>
                    )}
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => toggleFavorite(perfume.id, e)}
                    className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-noir/60 backdrop-blur-md border border-charbon hover:border-or/50 text-ivoire/70 hover:text-red-400 transition-all"
                    aria-label="Favori"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {/* Perfume Image with gentle zoom on hover - NO BUTTONS OVERLAY */}
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Card Details - NO PRICES */}
                <div className="p-6 flex flex-col flex-grow justify-between border-t border-charbon/50">
                  <div>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-[11px] text-ivoire/50 uppercase tracking-widest mb-1.5">
                      <span>{perfume.volume} • {perfume.gender}</span>
                      <div className="flex items-center gap-1 text-or">
                        <Star className="w-3 h-3 fill-or" />
                        <span className="font-semibold">{perfume.rating}</span>
                        <span className="text-ivoire/40">({perfume.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Perfume Name */}
                    <h3 className="text-2xl font-serif text-ivoire group-hover:text-or transition-colors">
                      {perfume.name}
                    </h3>

                    <p className="text-xs text-ivoire/60 mt-1 line-clamp-2 leading-relaxed">
                      {perfume.subtitle}
                    </p>

                    {/* Notes preview pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {perfume.notes.top.slice(0, 2).concat(perfume.notes.base.slice(0, 1)).map((note, idx) => (
                        <span 
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-noir border border-charbon text-ivoire/70"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Price & Explore CTA */}
                  <div className="pt-5 mt-4 border-t border-charbon/70 flex items-center justify-between">
                    <div>
                      {perfume.priceVisible && perfume.price && perfume.price > 0 ? (
                        <span className="text-lg font-semibold text-or block">
                          {perfume.price.toLocaleString('fr-DZ')} DA
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-or block">
                          Extrait Pur {perfume.volume}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-ivoire/80 group-hover:text-or font-medium group-hover:translate-x-1 transition-all">
                      <span>Commander</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
