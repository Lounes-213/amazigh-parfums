import React, { useEffect } from 'react';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCollection } from './components/ProductCollection';
import { PersonalizationBanner } from './components/PersonalizationBanner';
import { BrandStory } from './components/BrandStory';
import { ReviewsSection } from './components/ReviewsSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CheckoutModal } from './components/CheckoutModal';
import { CartDrawer } from './components/CartDrawer';

function ScrollObserver() {
  useEffect(() => {
    // Intersection observer for luxury scroll animations
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}

function MainLayout() {
  return (
    <div className="min-h-screen bg-noir text-ivoire flex flex-col relative selection:bg-or selection:text-noir">
      <ScrollObserver />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <div className="reveal">
          <ProductCollection />
        </div>
        <div className="reveal">
          <PersonalizationBanner />
        </div>
        <div className="reveal">
          <BrandStory />
        </div>
        <div className="reveal">
          <ReviewsSection />
        </div>
        <div className="reveal">
          <FAQSection />
        </div>
      </main>
      <Footer />

      {/* Modals & Drawers */}
      <ProductModal />
      <CheckoutModal />
      <CartDrawer />
    </div>
  );
}

export function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}

export default App;
