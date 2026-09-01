import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 md:p-16 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>New Season Collections Available</span>
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Elevate Your Everyday <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-indigo-400">Shopping</span> Experience
          </h1>
          <p className="text-slate-300 text-base md:text-lg">
            Discover curated items from top global brands with lightning-fast delivery and seamless payment protection.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-600/30 transition-all hover:scale-105 active:scale-95">
              Explore Catalog
            </button>
            <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 backdrop-blur-md transition-all">
              Browse Categories
            </button>
          </div>
        </div>
      </section>

      {/* Value Proposition Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-brand-50 text-brand-600">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Express Shipping</h3>
            <p className="text-xs text-slate-500 mt-1">Free delivery on orders above $50 with real-time tracking.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Secure Payments</h3>
            <p className="text-xs text-slate-500 mt-1">Protected by Stripe 256-bit encryption & anti-fraud layer.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Easy 30-Day Returns</h3>
            <p className="text-xs text-slate-500 mt-1">Hassle-free return policy with instant store refunds.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
