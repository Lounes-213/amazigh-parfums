import React from 'react';
import { Star, Sparkles, CheckCircle2, Quote } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Yasmine K.',
      city: 'Alger (Hydra)',
      rating: 5,
      date: 'Il y a 3 jours',
      perfume: 'Oud Impérial + Coffret Velours',
      comment: 'Une merveille olfactive ! Le flacon est lourd, très élégant et le coffret en velours avec le sceau de cire est d\'un raffinement rare. L\'Oud a une tenue phénoménale qui dure deux jours sur les vêtements. Livré en 24h à Alger.'
    },
    {
      name: 'Karim B.',
      city: 'Oran',
      rating: 5,
      date: 'Il y a 1 semaine',
      perfume: 'Noir Absolu (100ml)',
      comment: 'Noir Absolu est tout simplement magistral. Les notes de cuir et de vanille bourbon sont envoûtantes et très masculines. La commande a été confirmée rapidement et le paiement à la livraison est très rassurant.'
    },
    {
      name: 'Sarah M.',
      city: 'Constantine',
      rating: 5,
      date: 'Il y a 2 semaines',
      perfume: 'Rose Royale',
      comment: 'Offert à ma sœur pour une occasion spéciale. Elle a été émerveillée par la beauté de la bouteille et la délicatesse de la fragrance. Bravo à AMAZIGH pour avoir apporté ce niveau de haute parfumerie en Algérie !'
    }
  ];

  return (
    <section className="py-24 bg-noir-950 relative border-t border-charbon">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-or/40 bg-or/5 text-or text-xs tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TÉMOIGNAGES CLIENTS VÉRIFIÉS</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-ivoire font-light tracking-wide mb-4">
            Ce que nos Clients disent d'AMAZIGH
          </h2>
          <div className="flex items-center justify-center gap-2 text-or">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-or text-or" />
              ))}
            </div>
            <span className="text-xs text-ivoire/70 font-medium">4.95 / 5 basé sur plus de 450 commandes</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-charbon/30 rounded-2xl p-6 border border-charbon hover:border-or/40 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="w-8 h-8 text-or/20 absolute top-6 right-6 pointer-events-none group-hover:text-or/40 transition-colors" />

              <div>
                <div className="flex items-center gap-1 text-or mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-or" />
                  ))}
                </div>

                <p className="text-xs text-ivoire/80 italic leading-relaxed mb-6">
                  “{rev.comment}”
                </p>

                <div className="p-2.5 rounded-lg bg-noir/70 border border-charbon mb-4 text-[11px]">
                  <span className="text-ivoire/50 block">Fragrance choisie :</span>
                  <span className="text-or font-medium">{rev.perfume}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-charbon flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-ivoire flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[11px] text-ivoire/50">{rev.city}</span>
                </div>
                <span className="text-[10px] text-ivoire/40">{rev.date}</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
