import React, { useState, useRef } from 'react';
import { Sparkles, Play, Pause, Volume2, VolumeX, ChevronRight, ShieldCheck, Truck, Award, Gem } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Hero: React.FC = () => {
  const { settings } = useShop();
  const customVideo = (settings.bg_video_url || '').trim();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleSound = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-noir-950 pt-16">
      
      {/* Cinematic Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover opacity-60 scale-105 transform filter brightness-90 contrast-110"
        >
          <source src={customVideo || '/hero-perfume.mp4'} type="video/mp4" />
          {!customVideo && <source src="/vedio_3d/gemini_generated_video_eaf3c7e6.mp4" type="video/mp4" />}
        </video>

        {/* Luxury Vignette & Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir/60 to-noir-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-noir/50 to-noir-950" />
        <div className="absolute inset-0 bg-noir-950/20" />
      </div>

      {/* Subtle Floating Gold Glints */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
        <div className="absolute top-1/3 left-1/5 w-2 h-2 rounded-full bg-or animate-ping" />
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 rounded-full bg-or-200 animate-pulse delay-700" />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-or-300 animate-ping delay-1000" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-16">
        
        {/* Luxury Tag Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-or/40 bg-noir/70 backdrop-blur-md text-or text-xs tracking-[0.3em] uppercase mb-6 shadow-gold animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AMAZIGH • HAUTE PARFUMERIE</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-ivoire font-light tracking-wide leading-tight mb-6">
          L'Essence de la Noblesse <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gold-shimmer font-normal italic">
            & du Grand Prestige
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-ivoire/80 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-10 tracking-wide">
          Découvrez notre collection d'extraits de parfum d'exception. Des matières précieuses, un sillage inoubliable et une livraison soignée dans les 69 Wilayas d'Algérie.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
          <button
            onClick={() => scrollToSection('collection-section')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-gradient text-noir font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-3 shadow-gold hover:shadow-gold-lg hover:scale-105 active:scale-95 transition-all duration-300 group"
          >
            <span>Découvrir la Collection</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => scrollToSection('gifts-section')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-noir/80 hover:bg-noir border border-or/40 hover:border-or text-ivoire font-medium text-xs tracking-widest uppercase backdrop-blur-md flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <span>Nos Coffrets Cadeaux</span>
          </button>
        </div>

        {/* Minimal Video Controls */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-noir/70 border border-charbon backdrop-blur-md text-[11px] text-ivoire/60">
          <button
            onClick={togglePlay}
            className="hover:text-ivoire transition-colors flex items-center gap-1.5"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-or" /> : <Play className="w-3.5 h-3.5 text-or" />}
            <span>{isPlaying ? 'Pause' : 'Lecture'}</span>
          </button>
          <div className="h-3 w-[1px] bg-charbon-light" />
          <button
            onClick={toggleSound}
            className="hover:text-ivoire transition-colors flex items-center gap-1.5"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-or" />}
            <span>{isMuted ? 'Activer le son' : 'Son activé'}</span>
          </button>
        </div>

      </div>

      {/* Luxury Badges Strip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-charbon/70 bg-noir-950/85 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="flex items-center justify-center gap-2.5">
              <Gem className="w-4 h-4 text-or flex-shrink-0" />
              <div className="text-left">
                <span className="block text-xs font-semibold text-ivoire">Extraits Purs Rares</span>
                <span className="block text-[10px] text-ivoire/50">Concentration supérieure</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5">
              <Truck className="w-4 h-4 text-or flex-shrink-0" />
              <div className="text-left">
                <span className="block text-xs font-semibold text-ivoire">Livraison 69 Wilayas</span>
                <span className="block text-[10px] text-ivoire/50">Expédition rapide à domicile</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-or flex-shrink-0" />
              <div className="text-left">
                <span className="block text-xs font-semibold text-ivoire">Paiement à la Livraison</span>
                <span className="block text-[10px] text-ivoire/50">Règlement main à main</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5">
              <Award className="w-4 h-4 text-or flex-shrink-0" />
              <div className="text-left">
                <span className="block text-xs font-semibold text-ivoire">Tenue Garantie +16h</span>
                <span className="block text-[10px] text-ivoire/50">Sillage d'exception</span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
