import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User as UserIcon, Heart, Shield, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useCartStore } from '../../stores/useCartStore';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartCount = useCartStore((state) => state.getTotalCount());

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Aura<span className="text-brand-600">Mart</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-brand-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="hover:text-brand-600 transition-colors">
              Catalog
            </Link>
            <Link to="/cart" className="hover:text-brand-600 transition-colors">
              Shopping Cart
            </Link>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center space-x-4">
            <Link
              to="/products"
              className="p-2 text-slate-500 hover:text-brand-600 hover:bg-slate-50 rounded-full transition-colors"
              title="Search Products"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              to="/cart"
              className="p-2 text-slate-500 hover:text-brand-600 hover:bg-slate-50 rounded-full transition-colors relative"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user?.role === 'ADMIN' && (
                  <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </span>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <button
                    onClick={() => logout()}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-1 text-sm font-semibold px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
