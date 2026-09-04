import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Heart, ShieldCheck, Truck, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-auto">
      {/* Upper Features Strip */}
      <div className="border-b border-slate-900 bg-slate-950/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">Global Express Shipping</h5>
                <p className="text-xs text-slate-400">Tracked delivery straight to your doorstep</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">Guaranteed Purchase Security</h5>
                <p className="text-xs text-slate-400">Buyer protection on every single transaction</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-600/10 border border-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">24/7 Dedicated Support</h5>
                <p className="text-xs text-slate-400">AI Concierge & live representative support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-violet-400" />
                </div>
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Aura<span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">Mart</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Next-generation luxury e-commerce platform curated for modern technology, high fashion, and elevated lifestyle.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/" className="hover:text-violet-400 transition-colors">Home Storefront</Link></li>
              <li><Link to="/" className="hover:text-violet-400 transition-colors">Full Catalog</Link></li>
              <li><Link to="/cart" className="hover:text-violet-400 transition-colors">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-violet-400 transition-colors">Saved Wishlist</Link></li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Customer Account</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/login" className="hover:text-violet-400 transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-violet-400 transition-colors">Create Account</Link></li>
              <li><Link to="/orders" className="hover:text-violet-400 transition-colors">Track Orders</Link></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Aura Insider Newsletter</h4>
            <p className="text-xs text-slate-400 mb-3 font-medium">Subscribe for VIP drops and exclusive member deals.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-l-2xl text-white placeholder-slate-500 outline-none focus:border-violet-500 transition-colors"
              />
              <button className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-r-2xl shadow-md transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 text-xs text-center flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} AuraMart Inc. All rights reserved.</p>
          <div className="flex items-center gap-1.5 font-medium">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-current" />
            <span>for Modern E-Commerce</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
