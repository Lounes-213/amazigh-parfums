import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PERFUMES } from '../data/products';
import { Sparkles, Edit3, ShoppingBag, Check } from 'lucide-react';

export const PersonalizationBanner: React.FC = () => {
  const { addToCart, setCheckoutDirectItem, setIsCheckoutOpen, perfumes } = useShop();
  const [previewName, setPreviewName] = useState('Lina');
  const [selectedPerfumeId, setSelectedPerfumeId] = useState('oud-imperial');
  const [isCopied, setIsCopied] = useState(false);

  const selectedPerfume = (perfumes || []).find(p => p.id === selectedPerfumeId) || perfumes[0] || PERFUMES[0];

  const handleOrderWithEngraving = () => {
    const item = {
      id: `perfume-${selectedPerfume.id}-${Date.now()}`,
      perfume: selectedPerfume,
      engravedName: previewName.trim() || 'AMAZIGH',
      quantity: 1,
    };
    setCheckoutDirectItem(item);
    setIsCheckoutOpen(true);
  };

  const handleAddToCartWithEngraving = () => {
    addToCart({
      id: `perfume-${selectedPerfume.id}-${Date.now()}`,
      perfume: selectedPerfume,
      engravedName: previewName.trim() || 'AMAZIGH',
      quantity: 1,
    });
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section id="gravure-section" className="py-24 bg-noir-950 relative border-t border-charbon overflow-hidden">
      {/* Ambient gold glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-or/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-or/40 bg-or/10 text-or text-xs tracking-widest uppercase mb-4 shadow-gold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GRAVURE PERSONNALISÉE OFFERTE</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-ivoire font-light tracking-wide mb-4">
            Inscrivez Votre Nom sur Votre Parfum
          </h2>
          <p className="text-ivoire/70 text-sm md:text-base leading-relaxed">
            Chez AMAZIGH, chaque flacon peut porter votre nom, vos initiales ou un mot d'amour. Vous pouvez renseigner votre gravure lors de votre choix ou la modifier à tout moment dans votre panier.
          </p>
        </div>

        {/* Interactive Customization Preview */}
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-charbon/70 to-noir-950 rounded-2xl border border-or/30 p-8 sm:p-10 shadow-2xl relative">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Visual Flacon Badge Simulation (5 cols) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-6 bg-noir/90 rounded-2xl border border-charbon shadow-noir relative">
              <img 
                src={selectedPerfume.image} 
                alt={selectedPerfume.name} 
                className="w-48 h-56 object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.9)] mb-4 transform hover:scale-105 transition-transform"
              />

              {/* Gold Plaque simulation */}
              <div className="w-full bg-gradient-to-r from-noir to-charbon border-2 border-or/70 rounded-xl p-3 shadow-gold">
                <span className="text-[9px] uppercase tracking-[0.25em] text-or block">AMAZIGH PARIS</span>
                <span className="font-serif text-xl sm:text-2xl text-ivoire font-bold tracking-wider block my-0.5">
                  “{previewName.trim() || 'Votre Nom'}”
                </span>
                <span className="text-[9px] text-ivoire/50 uppercase tracking-widest">{selectedPerfume.name} • 100 ML</span>
              </div>
            </div>

            {/* Input & Form (7 cols) */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Select Perfume (No Price) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-or font-semibold mb-2">
                  1. Choisissez votre fragrance
                </label>
                <select
                  value={selectedPerfumeId}
                  onChange={(e) => setSelectedPerfumeId(e.target.value)}
                  className="w-full bg-noir border border-charbon-light rounded-xl px-4 py-3 text-ivoire text-sm focus:outline-none focus:border-or font-serif"
                >
                  {(perfumes && perfumes.length ? perfumes : PERFUMES).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.volume})
                    </option>
                  ))}
                </select>
              </div>

              {/* Enter Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-or font-semibold mb-2">
                  <span>2. Nom ou mot à inscrire sur le flacon</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={25}
                    value={previewName}
                    onChange={(e) => setPreviewName(e.target.value)}
                    placeholder="Ex: Amine, Lina, Sarah, Mon Amour..."
                    className="w-full bg-noir border border-or/50 rounded-xl px-4 py-3 text-ivoire text-base focus:outline-none focus:border-or font-serif tracking-wider"
                  />
                  <Edit3 className="w-4 h-4 text-or absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
                <p className="text-[11px] text-ivoire/50 mt-1.5">
                  Ce nom sera gravé avec soin sur le flacon et transmis dans votre message WhatsApp.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleOrderWithEngraving}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-gold-gradient text-noir font-semibold text-xs tracking-widest uppercase shadow-gold hover:shadow-gold-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Commander avec ce Nom</span>
                </button>

                <button
                  onClick={handleAddToCartWithEngraving}
                  className="py-3.5 px-5 rounded-xl bg-noir border border-charbon-light hover:border-or text-ivoire text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4 text-or" />}
                  <span>{isCopied ? 'Ajouté !' : 'Ajouter au Panier'}</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
