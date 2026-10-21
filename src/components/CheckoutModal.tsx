import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { X, MessageCircle, CheckCircle2, ShieldCheck, Sparkles, MapPin, Phone, User, Edit3, ExternalLink } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    checkoutDirectItem, 
    setCheckoutDirectItem, 
    cart, 
    clearCart,
    whatsappNumber,
    settings
  } = useShop();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [engravedName, setEngravedName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');

  if (!isCheckoutOpen) return null;

  const items = checkoutDirectItem ? [checkoutDirectItem] : cart;
  if (items.length === 0 && !isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-noir-950/80 backdrop-blur-md">
        <div className="bg-noir-950 border border-charbon rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-ivoire/80 mb-6">Votre sélection est vide.</p>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="px-6 py-2.5 rounded-xl bg-or text-noir font-semibold text-xs uppercase tracking-wider"
          >
            Retourner à la boutique
          </button>
        </div>
      </div>
    );
  }

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert('Veuillez renseigner votre nom, téléphone et adresse.');
      return;
    }

    // Format WhatsApp Message for AMAZIGH (No Prices)
    const orderItemsText = items.map((item, index) => {
      const finalName = item.engravedName || engravedName.trim();
      let text = `📦 Article ${index + 1} : *${item.perfume.name}* (${item.perfume.volume})\n`;
      text += `   • Quantité : ${item.quantity}\n`;
      if (finalName) {
        text += `   ✍️ *Nom gravé sur le flacon* : "${finalName}"\n`;
      }
      return text;
    }).join('\n');

    const message = `👑 *NOUVELLE COMMANDE — AMAZIGH HAUTE PARFUMERIE* 👑\n` +
      `-----------------------------------------\n` +
      orderItemsText +
      `-----------------------------------------\n` +
      `👤 *Coordonnées de Livraison :*\n` +
      `• Nom & Prénom : *${fullName.trim()}*\n` +
      `• Téléphone : *${phone.trim()}*\n` +
      `• Adresse : *${address.trim()}*\n` +
      (notes.trim() ? `• Remarques : ${notes.trim()}\n` : '') +
      `-----------------------------------------\n` +
      `💵 *Paiement : En espèces à la livraison*\n` +
      `-----------------------------------------\n` +
      `✨ _Merci de me confirmer la prise en charge de ma commande._`;

    setGeneratedMessage(message);

    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C8A34D', '#dfbe6a', '#ffffff', '#e0a96d']
    });

    // Launch WhatsApp directly to 0549225794
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encoded}`;
    window.open(whatsappUrl, '_blank');

    setIsSubmitted(true);
    if (!checkoutDirectItem) {
      clearCart();
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCheckoutDirectItem(null);
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-noir-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-noir-950 rounded-2xl border border-or/40 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-charbon flex items-center justify-between bg-charbon/40">
          <div>
            <h3 className="text-xl font-serif text-ivoire font-light flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-or" />
              <span>Finaliser ma Commande</span>
            </h3>
            <p className="text-xs text-ivoire/50 mt-0.5">Confirmation instantanée via WhatsApp</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-noir/70 border border-charbon text-ivoire/70 hover:text-ivoire hover:border-or transition-all"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {isSubmitted ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-900/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h4 className="text-2xl font-serif text-ivoire">
                Votre commande est prête sur WhatsApp !
              </h4>

              <p className="text-xs text-ivoire/70 max-w-md mx-auto leading-relaxed">
                Le récapitulatif a été préparé pour notre numéro WhatsApp (<strong>{settings.phone || '0549 22 57 94'}</strong>). Cliquez sur <strong>Envoyer</strong> dans WhatsApp pour valider votre colis.
              </p>

              {/* Message preview */}
              <div className="bg-charbon/50 border border-charbon rounded-xl p-4 text-left font-mono text-[11px] text-ivoire/80 max-h-44 overflow-y-auto whitespace-pre-wrap">
                {generatedMessage}
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(generatedMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Ouvrir WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={handleClose}
                  className="py-3 px-6 rounded-xl bg-noir border border-charbon text-ivoire hover:border-or text-xs uppercase tracking-wider transition-all"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            /* ORDER FORM - NO PRICES & NO REGION SELECTOR */
            <form onSubmit={handleSendOrder} className="space-y-4">
              
              {/* Order Items Preview */}
              <div className="bg-charbon/40 rounded-xl p-3.5 border border-charbon space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-or font-semibold block">
                  Votre sélection :
                </span>
                
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs border-b border-charbon/60 pb-2 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <img src={item.perfume.image} alt={item.perfume.name} className="w-9 h-9 object-contain rounded bg-noir p-1" />
                      <div>
                        <span className="font-serif text-sm text-ivoire font-medium">{item.perfume.name}</span>
                        <span className="text-[11px] text-ivoire/50 block">Quantité : {item.quantity}</span>
                        {item.engravedName && (
                          <span className="text-[10px] text-emerald-400 block">Nom gravé : “{item.engravedName}”</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-or font-medium">
                      {item.perfume.volume}
                    </div>
                  </div>
                ))}
              </div>

              {/* Client Details */}
              <div className="space-y-3.5">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ivoire/70 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-or" />
                    <span>Nom & Prénom *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Amine Benali"
                    className="w-full bg-noir border border-charbon-light rounded-xl px-3.5 py-2.5 text-ivoire text-sm focus:outline-none focus:border-or"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ivoire/70 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-or" />
                    <span>Numéro de Téléphone *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 0555 12 34 56"
                    className="w-full bg-noir border border-charbon-light rounded-xl px-3.5 py-2.5 text-ivoire text-sm focus:outline-none focus:border-or"
                  />
                </div>

                {/* Direct Address */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ivoire/70 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-or" />
                    <span>Adresse de livraison (Ville, Quartier, Rue...) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Alger Hydra, Rue des Frères Benali..."
                    className="w-full bg-noir border border-charbon-light rounded-xl px-3.5 py-2.5 text-ivoire text-sm focus:outline-none focus:border-or"
                  />
                </div>

                {/* Name on bottle (if not set in item) */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ivoire/70 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-or" />
                      <span>Nom à graver sur le flacon (Optionnel / Offert)</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-normal">Gratuit</span>
                  </label>
                  <input
                    type="text"
                    maxLength={25}
                    value={engravedName}
                    onChange={(e) => setEngravedName(e.target.value)}
                    placeholder="Ex: Lina, Amine, Sarah..."
                    className="w-full bg-noir border border-charbon-light rounded-xl px-3.5 py-2 text-ivoire text-sm font-serif focus:outline-none focus:border-or"
                  />
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ivoire/70 mb-1">
                    Remarques éventuelles (facultatif)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Heure de disponibilité..."
                    className="w-full bg-noir border border-charbon-light rounded-xl px-3.5 py-2 text-ivoire text-xs focus:outline-none focus:border-or"
                  />
                </div>
              </div>

              {/* Reassurance */}
              <div className="pt-2 flex items-center justify-between text-xs text-ivoire/70">
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Paiement à la livraison</span>
                </span>
                <span className="text-ivoire/50">Gravure offerte</span>
              </div>

              {/* Submit Button to WhatsApp 0549225794 */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-xs uppercase tracking-widest shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Envoyer ma Commande via WhatsApp ({settings.phone || '0549 22 57 94'})</span>
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
