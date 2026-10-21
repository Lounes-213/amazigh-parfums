import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Edit3 } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    updateItemEngravedName,
    cartCount,
    setIsCheckoutOpen 
  } = useShop();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-noir-950/80 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Drawer */}
      <div className="w-full max-w-md bg-noir-950 border-l border-or/30 h-full flex flex-col justify-between shadow-2xl relative z-10 animate-slideLeft">
        
        {/* Header */}
        <div className="p-6 border-b border-charbon flex items-center justify-between bg-charbon/30">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-or" />
            <h3 className="text-lg font-serif text-ivoire">
              Votre Sélection ({cartCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-charbon text-ivoire/70 hover:text-ivoire transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-ivoire/50 space-y-3 py-16">
              <ShoppingBag className="w-12 h-12 stroke-1 text-charbon-light" />
              <p className="text-sm">Votre sélection est vide pour le moment.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div 
                key={item.id}
                className="bg-charbon/40 border border-charbon rounded-xl p-4 space-y-3 relative group"
              >
                <div className="flex gap-3">
                  {/* Perfume Visual */}
                  <div className="w-16 h-16 rounded-lg bg-noir p-1.5 flex-shrink-0 flex items-center justify-center border border-charbon">
                    <img src={item.perfume.image} alt={item.perfume.name} className="max-w-full max-h-full object-contain" />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-sm text-ivoire font-medium">{item.perfume.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-ivoire/40 hover:text-red-400 p-1 transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[11px] text-ivoire/50 block">{item.perfume.volume}</span>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-charbon rounded-lg bg-noir/80 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-ivoire/60 hover:text-ivoire hover:bg-charbon transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs text-ivoire font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-ivoire/60 hover:text-ivoire hover:bg-charbon transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs text-emerald-400 font-medium">
                        Gravure offerte
                      </span>
                    </div>
                  </div>
                </div>

                {/* EDITABLE ENGRAVED NAME IN CART */}
                <div className="pt-2 border-t border-charbon/50">
                  <div className="flex items-center gap-1.5 text-[11px] text-or mb-1">
                    <Edit3 className="w-3 h-3" />
                    <span>Nom à graver sur le flacon :</span>
                  </div>
                  <input
                    type="text"
                    maxLength={25}
                    value={item.engravedName || ''}
                    onChange={(e) => updateItemEngravedName(item.id, e.target.value)}
                    placeholder="Écrivez le nom à inscrire..."
                    className="w-full bg-noir border border-charbon-light focus:border-or rounded-lg px-2.5 py-1.5 text-xs text-ivoire font-serif focus:outline-none"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer (No Prices) */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-charbon bg-charbon/30 space-y-4">
            <p className="text-xs text-ivoire/70 text-center">
              Paiement à la livraison après confirmation de votre commande.
            </p>

            <button
              onClick={handleProceedToCheckout}
              className="w-full py-4 rounded-xl bg-gold-gradient text-noir font-semibold text-xs tracking-widest uppercase shadow-gold hover:shadow-gold-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Valider la Commande via WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
