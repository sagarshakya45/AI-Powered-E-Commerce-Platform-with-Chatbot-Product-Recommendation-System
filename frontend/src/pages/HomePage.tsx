import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-16 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Modern Collection 2026</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Elevate Your Everyday Style & Tech
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Explore curated high-end products across electronics, fashion, and personal accessories with instant checkout and global shipping.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link to="/products">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Catalog
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
                Join AuraMart
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Perks Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Express Worldwide Delivery</h3>
            <p className="text-xs text-slate-500 mt-1">Free standard shipping on orders over $50 with real-time tracking.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Verified Secure Checkout</h3>
            <p className="text-xs text-slate-500 mt-1">256-bit SSL encrypted transactions powered by Stripe & JWT security.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">30-Day Money Back</h3>
            <p className="text-xs text-slate-500 mt-1">No-hassle returns and instant refunds within 30 days of purchase.</p>
          </div>
        </div>
      </section>

      {/* Featured CTA */}
      <section className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-xl gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to start shopping?</h2>
          <p className="text-brand-100 text-sm">Discover top-rated products and exclusive discounts today.</p>
        </div>
        <Link to="/products">
          <Button variant="secondary" size="lg" leftIcon={<ShoppingBag className="w-5 h-5" />}>
            Browse Shop
          </Button>
        </Link>
      </section>
    </div>
  );
};
