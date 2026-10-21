import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Sparkles, Star, ShoppingBag, Clock, Compass, Edit3, Check, ArrowRight } from 'lucide-react';

export const ProductModal: React.FC = () => {
  const { 
    selectedPerfumeForModal, 
    setSelectedPerfumeForModal, 
    setCheckoutDirectItem, 
    setIsCheckoutOpen,
    addToCart
  } = useShop();

  const [engravedName, setEngravedName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddedToast, setIsAddedToast] = useState(false);

  useEffect(() => {
    setEngravedName('');
    setQuantity(1);
  }, [selectedPerfumeForModal]);

  if (!selectedPerfumeForModal) return null;
  const perfume = selectedPerfumeForModal;

  const handleAddToCart = () => {
    addToCart({
      id: `perfume-${perfume.id}-${Date.now()}`,
      perfume,
      engravedName: engravedName.trim() || undefined,
      quantity,
    });
    setIsAddedToast(true);
    setTimeout(() => {
      setIsAddedToast(false);
      setSelectedPerfumeForModal(null);
    }, 1200);
  };

  const handleDirectOrder = () => {
    const item = {
      id: `perfume-${perfume.id}-${Date.now()}`,
      perfume,
      engravedName: engravedName.trim() || undefined,
      quantity,
    };
    setSelectedPerfumeForModal(null);
    setCheckoutDirectItem(item);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-noir-950/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-noir-950 rounded-2xl border border-or/40 shadow-2xl overflow-hidden my-auto flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedPerfumeForModal(null)}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-noir/80 border border-charbon text-ivoire/70 hover:text-ivoire hover:border-or transition-all shadow-md"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Perfume Visual & Custom Name Badge Preview */}
        <div className="md:w-1/2 bg-gradient-to-b from-charbon/70 via-charbon-dark/80 to-noir p-6 sm:p-8 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-charbon">
          <div className="w-56 h-72 sm:w-64 sm:h-80 relative flex items-center justify-center mb-4">
            <img
              src={perfume.image}
              alt={perfume.name}
              className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)]"
            />
          </div>

          {/* Live Custom Engraved Plaque Simulation */}
          <div className="w-full max-w-xs bg-noir border border-or/60 rounded-xl p-3 text-center shadow-gold">
            <span className="text-[9px] uppercase tracking-[0.25em] text-or block">AMAZIGH PARIS</span>
            <span className="font-serif text-lg text-ivoire font-bold tracking-wider block">
              {engravedName.trim() ? `“${engravedName.trim()}”` : '“Votre Nom Gravé”'}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-ivoire/60">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-or" /> {perfume.longevity}</span>
            <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-or" /> Sillage {perfume.sillage}</span>
          </div>
        </div>

        {/* Right: Full Product Details & Ordering Form (No Price) */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-or font-semibold">
                {perfume.volume} • {perfume.gender.toUpperCase()}
              </span>
              <div className="flex items-center gap-1 text-or text-xs">
                <Star className="w-3.5 h-3.5 fill-or" />
                <span className="font-semibold">{perfume.rating}</span>
                <span className="text-ivoire/40">({perfume.reviewsCount} avis)</span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-ivoire font-light">{perfume.name}</h2>
            <p className="text-xs text-ivoire/50 mb-3">{perfume.subtitle}</p>

            <p className="text-xs text-ivoire/80 leading-relaxed mb-5">
              {perfume.description}
            </p>

            {/* Olfactory Pyramid */}
            <div className="space-y-2.5 bg-charbon/50 rounded-xl p-4 border border-charbon mb-5">
              <h4 className="text-xs uppercase tracking-wider text-or font-semibold mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Pyramide Olfactive</span>
              </h4>

              <div className="text-xs">
                <span className="text-ivoire/50 font-medium block mb-1">
                  Notes de Tête :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {perfume.notes.top.map((note, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-noir text-ivoire/90 border border-charbon-light text-[11px]">
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs">
                <span className="text-ivoire/50 font-medium block mb-1">
                  Notes de Cœur :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {perfume.notes.heart.map((note, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-noir text-ivoire/90 border border-charbon-light text-[11px]">
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs">
                <span className="text-ivoire/50 font-medium block mb-1">
                  Notes de Fond :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {perfume.notes.base.map((note, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-noir text-ivoire/90 border border-charbon-light text-[11px]">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CUSTOM ENGRAVED NAME INPUT */}
            <div className="bg-noir/80 border border-or/40 rounded-xl p-3.5 space-y-1.5">
              <label className="block text-xs uppercase tracking-wider text-or font-semibold flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" />
                <span>Nom ou mot doux à inscrire sur le flacon</span>
              </label>
              <input
                type="text"
                maxLength={25}
                value={engravedName}
                onChange={(e) => setEngravedName(e.target.value)}
                placeholder="Ex: Amine, Lina, Sarah..."
                className="w-full bg-noir border border-charbon-light focus:border-or rounded-lg px-3 py-2 text-ivoire text-sm font-serif focus:outline-none"
              />
              <span className="text-[10px] text-ivoire/50 block">
                Offert : ce nom sera gravé avec soin sur la plaque du flacon.
              </span>
            </div>
          </div>

          {/* Quantity & Action CTAs (No Price) */}
          <div className="pt-4 border-t border-charbon space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ivoire/70">Quantité de flacons :</span>

              {/* Quantity selector */}
              <div className="flex items-center border border-charbon rounded-lg bg-noir overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-ivoire/60 hover:text-ivoire transition-colors"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono font-semibold text-ivoire">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-ivoire/60 hover:text-ivoire transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Success Toast */}
            {isAddedToast && (
              <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Parfum ajouté au panier avec succès !</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-4 rounded-xl bg-noir border border-or/40 hover:border-or text-ivoire font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-or" />
                <span>Ajouter au Panier</span>
              </button>

              <button
                onClick={handleDirectOrder}
                className="py-3.5 px-4 rounded-xl bg-gold-gradient text-noir font-semibold text-xs uppercase tracking-wider shadow-gold hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Commander Direct</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
