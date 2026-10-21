import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { AmazighLogo } from './AmazighLogo';
import { ShoppingBag, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cartCount, setIsCartOpen } = useShop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-noir-950/95 backdrop-blur-md border-b border-charbon/80 py-3 shadow-lg' 
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Name: Logo_AMAZIGH.png */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <AmazighLogo className="w-12 h-12 group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-serif text-2xl font-light tracking-[0.28em] text-ivoire group-hover:text-or transition-colors block leading-tight">
                AMAZIGH
              </span>
              <span className="block text-[8px] uppercase tracking-[0.35em] text-or/80 font-sans">
                HAUTE PARFUMERIE
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-ivoire/80">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-or transition-colors"
            >
              Accueil
            </button>

            <button 
              onClick={() => scrollTo('collection-section')}
              className="hover:text-or transition-colors"
            >
              Collection
            </button>

            <button 
              onClick={() => scrollTo('gravure-section')}
              className="hover:text-or transition-colors text-or font-medium"
            >
              Personnalisation
            </button>

            <button 
              onClick={() => scrollTo('heritage-section')}
              className="hover:text-or transition-colors"
            >
              Savoir-Faire
            </button>

            <button 
              onClick={() => scrollTo('faq-section')}
              className="hover:text-or transition-colors"
            >
              FAQ
            </button>
          </div>

          {/* Right: Only the Cart Icon with Count Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Panier"
              className="relative p-2.5 rounded-full bg-noir/80 border border-or/40 text-or hover:scale-105 active:scale-95 transition-all shadow-gold"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-or text-noir text-[11px] font-bold flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              className="md:hidden p-2 rounded-xl bg-charbon/50 text-ivoire hover:text-or transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-charbon bg-noir-950/98 rounded-2xl p-4 space-y-3 animate-fadeIn">
            <button
              onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full text-left py-2 px-3 text-sm text-ivoire hover:text-or rounded-lg"
            >
              Accueil
            </button>
            <button
              onClick={() => scrollTo('collection-section')}
              className="w-full text-left py-2 px-3 text-sm text-ivoire hover:text-or rounded-lg"
            >
              Collection de Parfums
            </button>
            <button
              onClick={() => scrollTo('gravure-section')}
              className="w-full text-left py-2 px-3 text-sm text-or font-medium rounded-lg"
            >
              Personnalisation du Flacon
            </button>
            <button
              onClick={() => scrollTo('heritage-section')}
              className="w-full text-left py-2 px-3 text-sm text-ivoire hover:text-or rounded-lg"
            >
              Notre Savoir-Faire
            </button>
            <button
              onClick={() => scrollTo('faq-section')}
              className="w-full text-left py-2 px-3 text-sm text-ivoire hover:text-or rounded-lg"
            >
              FAQ
            </button>
          </div>
        )}

      </div>
    </nav>
  );
};
