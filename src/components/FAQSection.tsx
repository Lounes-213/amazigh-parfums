import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { whatsappNumber } = useShop();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Quels sont les délais de livraison ?',
      a: 'Nous assurons une livraison rapide et sécurisée directement à votre adresse dans toute l\'Algérie. Le délai moyen est de 24h à 48h selon votre localisation. Le règlement s\'effectue en toute sérénité à la réception de votre colis.'
    },
    {
      q: 'Comment s\'effectue la confirmation et le règlement de la commande ?',
      a: 'Après avoir sélectionné votre parfum et rempli vos informations de livraison, le site prépare un récapitulatif complet prêt à être envoyé sur WhatsApp. Notre conseiller client confirme immédiatement l\'expédition. Le paiement s\'effectue en espèces à la livraison (Cash on Delivery), directement lors de la remise du colis par le livreur.'
    },
    {
      q: 'Quelle est la concentration et la tenue des parfums AMAZIGH ?',
      a: 'Nos créations sont des Extraits de Parfum d\'exception concentrés à plus de 30% d\'essences pures. Élaborées avec des matières premières nobles (Oud royal du Cambodge, Rose de Damas, Ambre gris, Vanille Bourbon), leur tenue est garantie plus de 16 heures avec un sillage magistral et envoûtant.'
    },
    {
      q: 'Puis-je commander un coffret cadeau pour faire une surprise à un proche ?',
      a: 'Absolument. Vous pouvez opter pour notre Écrin Prestige en velours noir rigide avec ruban de soie noué à la main, sceau de cire et carte calligraphiée portant votre mot d\'accompagnement. Il vous suffit d\'indiquer les coordonnées du destinataire lors de la finalisation.'
    }
  ];

  return (
    <section id="faq-section" className="py-24 bg-noir relative border-t border-charbon">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-or/40 bg-or/5 text-or text-xs tracking-widest uppercase mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>TRANSPARENCE & SERVICE CLIENT</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-ivoire font-light tracking-wide mb-4">
            Questions Fréquentes & Livraison
          </h2>
          <p className="text-ivoire/70 text-sm md:text-base leading-relaxed">
            Tout ce que vous devez savoir sur la commande, la livraison dans les 69 Wilayas et la qualité de nos extraits.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-charbon/40 border border-charbon rounded-xl overflow-hidden transition-all duration-300 hover:border-or/40"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif text-base sm:text-lg text-ivoire font-normal">
                    {faq.q}
                  </span>
                  <div className={`p-1.5 rounded-full bg-noir/70 border border-charbon text-or transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? 'rotate-180 bg-or text-noir border-or' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-ivoire/75 leading-relaxed border-t border-charbon/50 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
