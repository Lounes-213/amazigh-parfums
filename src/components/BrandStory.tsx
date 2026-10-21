import React from 'react';
import { AmazighLogo } from './AmazighLogo';
import { Sparkles, Award, Droplets, ShieldCheck } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section id="heritage-section" className="py-24 bg-noir relative border-t border-charbon overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-or/40 bg-or/5 text-or text-xs tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NOTRE HÉRITAGE & SAVOIR-FAIRE</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-serif text-ivoire font-light tracking-wide leading-tight">
              L'Excellence d'une Maison <br />
              <span className="text-transparent bg-clip-text bg-gold-shimmer font-normal italic">
                aux Racines Nobles
              </span>
            </h2>

            <p className="text-ivoire/80 text-sm md:text-base leading-relaxed">
              Fondée sur la passion des essences les plus pures et des matières premières intemporelles, la maison <strong>AMAZIGH</strong> sublime la haute parfumerie en créant des élixirs au caractère affirmé, alliant force ancestrale et élégance contemporaine.
            </p>

            <p className="text-ivoire/70 text-xs md:text-sm leading-relaxed">
              Chaque extrait de parfum est patiemment composé à partir d'huiles essentielles précieuses importées de Grasse et de résines orientales d'exception. Nos flacons au verre lourd et nos bouchons aux dorures fines incarnent un luxe discret et intemporel.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-charbon">
              <div className="p-4 rounded-xl bg-charbon/30 border border-charbon">
                <Droplets className="w-5 h-5 text-or mb-2" />
                <h4 className="text-xs uppercase tracking-wider text-ivoire font-semibold mb-1">Concentration Pure</h4>
                <p className="text-[11px] text-ivoire/50">Extraits concentrés à plus de 30% d'essences.</p>
              </div>

              <div className="p-4 rounded-xl bg-charbon/30 border border-charbon">
                <Award className="w-5 h-5 text-or mb-2" />
                <h4 className="text-xs uppercase tracking-wider text-ivoire font-semibold mb-1">Matières Rares</h4>
                <p className="text-[11px] text-ivoire/50">Oud cambodgien, rose de Damas et ambre gris.</p>
              </div>

              <div className="p-4 rounded-xl bg-charbon/30 border border-charbon">
                <ShieldCheck className="w-5 h-5 text-or mb-2" />
                <h4 className="text-xs uppercase tracking-wider text-ivoire font-semibold mb-1">Flaconnerie Fine</h4>
                <p className="text-[11px] text-ivoire/50">Verre lourd sérigraphié et finitions or.</p>
              </div>
            </div>

          </div>

          {/* Right Visual Emblem */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-charbon/60 to-noir-950 rounded-2xl border border-or/30 shadow-2xl relative">
            <div className="w-32 h-32 mb-6 flex items-center justify-center">
              <AmazighLogo className="w-28 h-28" size={112} />
            </div>

            <h3 className="text-3xl font-serif text-ivoire tracking-[0.2em] mb-1">AMAZIGH</h3>
            <span className="text-[9px] uppercase tracking-[0.4em] text-or block mb-6">HAUTE PARFUMERIE</span>

            <p className="text-xs text-ivoire/60 italic max-w-xs leading-relaxed">
              “La signature olfactive de ceux qui laissent une empreinte indélébile.”
            </p>

            <div className="mt-8 pt-6 border-t border-charbon/80 w-full flex items-center justify-around text-xs text-ivoire/60">
              <span>Tizi Ouzou</span>
              <span>•</span>
              <span>Alger</span>
              <span>•</span>
              <span>Oran</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
