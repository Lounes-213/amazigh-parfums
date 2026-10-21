import React, { useState } from 'react';
import { AmazighLogo } from './AmazighLogo';
import { Mail, MapPin, ShieldCheck, Heart, MessageCircle, Phone } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { whatsappNumber, settings } = useShop();
  const instagramUrl = settings.instagram || 'https://www.instagram.com/officielle_amazigh?mdxt=YmtrYjFnYnUxbm5j';
  const facebookUrl = settings.facebook || 'https://www.facebook.com/profile.php?id=61595685982616';
  const tiktokUrl = settings.tiktok || '';
  const [legalModalOpen, setLegalModalOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-noir-950 border-t border-charbon text-ivoire/70 pt-20 pb-12 relative overflow-hidden">
      
      {/* Top Gold Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-or/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-charbon/80">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <AmazighLogo className="w-12 h-12" />
              <div>
                <span className="font-serif text-2xl font-light tracking-[0.28em] text-ivoire block leading-tight">
                  AMAZIGH
                </span>
                <span className="block text-[8px] uppercase tracking-[0.35em] text-or">
                  HAUTE PARFUMERIE
                </span>
              </div>
            </div>

            <p className="text-xs text-ivoire/60 leading-relaxed max-w-sm">
              Maison de haute parfumerie créative. Des créations olfactives précieuses nées des plus nobles matières premières, avec gravure personnalisée offerte.
            </p>

            {/* Social Media Links provided by user */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp 0549225794"
                className="w-10 h-10 rounded-full bg-charbon/60 border border-charbon flex items-center justify-center hover:text-emerald-400 hover:border-emerald-500 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                title="Instagram @officielle_amazigh"
                className="w-10 h-10 rounded-full bg-charbon/60 border border-charbon flex items-center justify-center hover:text-or hover:border-or transition-all"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                title="Facebook AMAZIGH"
                className="w-10 h-10 rounded-full bg-charbon/60 border border-charbon flex items-center justify-center hover:text-blue-400 hover:border-blue-500 transition-all"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  title="TikTok AMAZIGH"
                  className="w-10 h-10 rounded-full bg-charbon/60 border border-charbon flex items-center justify-center hover:text-or hover:border-or transition-all"
                >
                  <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.61 20a6.33 6.33 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.65 0z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-or font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-ivoire transition-colors">
                  Accueil
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('collection-section')} className="hover:text-ivoire transition-colors">
                  Collection de Parfums
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('gravure-section')} className="hover:text-ivoire transition-colors">
                  Personnalisation & Gravure
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('heritage-section')} className="hover:text-ivoire transition-colors">
                  Notre Savoir-Faire
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('faq-section')} className="hover:text-ivoire transition-colors">
                  FAQ & Expédition
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-or font-semibold">
              Commandes & Contact
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="hover:underline font-mono text-sm text-ivoire">
                  {settings.phone || '0549 22 57 94'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp 7j/7</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-or flex-shrink-0" />
                <span>Algérie</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-or flex-shrink-0" />
                <span>contact@amazigh-parfums.dz</span>
              </li>
            </ul>
          </div>

          {/* Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-or font-semibold">
              Nos Engagements
            </h4>
            <div className="space-y-2 text-xs text-ivoire/60">
              <div className="p-2.5 rounded-lg bg-charbon/40 border border-charbon">
                <span className="font-semibold text-ivoire block">🚚 Livraison Rapide</span>
                <span className="text-[10px]">Expédition directe à domicile</span>
              </div>
              <div className="p-2.5 rounded-lg bg-charbon/40 border border-charbon">
                <span className="font-semibold text-ivoire block">💵 Cash on Delivery</span>
                <span className="text-[10px]">Paiement à la réception de votre colis</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-ivoire/50 gap-4">
          <div>
            © 2026 AMAZIGH Haute Parfumerie. Tous droits réservés.
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLegalModalOpen(false)}
              className="hover:underline hover:text-ivoire"
            >
              Conditions Générales de Vente
            </button>
            <span>•</span>
            <span className="flex items-center gap-1 text-or">
              Maison de Haute Parfumerie <Heart className="w-3 h-3 fill-or" />
            </span>
          </div>
        </div>

      </div>

    </footer>
  );
};
