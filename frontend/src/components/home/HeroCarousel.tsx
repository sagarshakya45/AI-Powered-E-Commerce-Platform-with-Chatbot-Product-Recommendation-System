import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { HOME_BANNERS } from '../../data/catalog';

export const HeroCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % HOME_BANNERS.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const banner = HOME_BANNERS[index];

  return (
    <section className="relative max-w-[1440px] mx-auto px-4 sm:px-6 pt-4">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 h-[280px] sm:h-[360px] lg:h-[420px] shadow-2xl border border-slate-800">
        {HOME_BANNERS.map((item, i) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img src={item.image} alt="" className="h-full w-full object-cover opacity-50 mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>
        ))}

        {/* Content Box */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-center text-white">
          <div className="max-w-xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              {banner.eyebrow}
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {banner.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 line-clamp-2 max-w-md font-medium">
              {banner.subtitle}
            </p>

            <div className="pt-2">
              <Link
                to={banner.to}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold px-6 py-3 rounded-full shadow-lg shadow-violet-600/30 transition-all duration-300 hover:scale-105"
              >
                <span>{banner.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          type="button"
          aria-label="Previous banner"
          onClick={() => setIndex((i) => (i - 1 + HOME_BANNERS.length) % HOME_BANNERS.length)}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 hover:bg-slate-900 text-white flex items-center justify-center transition-all shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          aria-label="Next banner"
          onClick={() => setIndex((i) => (i + 1) % HOME_BANNERS.length)}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 hover:bg-slate-900 text-white flex items-center justify-center transition-all shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {HOME_BANNERS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Show ${item.title}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-gradient-to-r from-violet-500 to-indigo-500' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
