import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  MapPin,
  Menu,
  X,
  LogOut,
  Shield,
  Zap,
  Sparkles,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { LOCAL_CATEGORIES, mergeCatalog } from '../../data/catalog';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import apiClient from '../../services/apiClient';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { theme, toggleTheme } = useThemeStore();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search logic for instant live autocomplete preview
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await apiClient.get(`/products?search=${encodeURIComponent(q)}&limit=6`);
        const serverProducts = res.data?.data?.products || [];
        const merged = mergeCatalog(serverProducts);
        const filtered = merged.filter((p) =>
          p.title.toLowerCase().includes(q.toLowerCase()) ||
          p.description.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 5);

        setSearchResults(filtered);
        setShowDropdown(true);
      } catch (err) {
        // Fallback to local catalog search
        const fallback = mergeCatalog([]).filter((p) =>
          p.title.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 5);
        setSearchResults(fallback);
        setShowDropdown(true);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    const q = query.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products');
    setMobileOpen(false);
  };

  const handleSelectProduct = (product: Product) => {
    setShowDropdown(false);
    setQuery('');
    navigate(`/products/${product.slug || product.id}`);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Main Glass Header */}
      <div className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 text-white shadow-2xl transition-all">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Open menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Glowing Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-violet-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                Aura<span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">Mart</span>
              </span>
            </div>
          </Link>

          {/* Delivery Location Pill */}
          <div className="hidden lg:flex items-center gap-2 text-xs px-3.5 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-700 transition-colors">
            <MapPin className="w-4 h-4 text-violet-400 shrink-0" />
            <div className="leading-none">
              <span className="text-[10px] text-slate-400 block font-medium">Deliver to</span>
              <span className="font-semibold text-white">United States</span>
            </div>
          </div>

          {/* Futuristic Pill Search Input with Live Autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-xl hidden sm:block relative">
            <form onSubmit={onSearch} className="relative group">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
                placeholder="Search products, brands & categories..."
                className="w-full rounded-full bg-slate-900/90 border border-slate-800 text-white placeholder-slate-400 pl-4 pr-12 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 w-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-md transition-all duration-200"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Live Autocomplete Glass Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950/95 backdrop-blur-2xl border border-violet-500/30 rounded-3xl p-3 text-white shadow-2xl z-50 animate-in fade-in-50 duration-200 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-bold text-violet-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-900">
                  <span>Matching Products</span>
                  <span>{searchResults.length} results</span>
                </div>
                {searchResults.map((product) => {
                  const img = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80';
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="p-2 rounded-2xl hover:bg-slate-900 flex items-center gap-3 cursor-pointer group transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white p-1 shrink-0 overflow-hidden">
                        <img src={img} alt={product.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-slate-100 group-hover:text-violet-300 truncate">
                          {product.title}
                        </h5>
                        <p className="text-[10px] text-slate-400 capitalize">{product.category?.name || 'Catalog'}</p>
                      </div>
                      <span className="text-xs font-black text-violet-400 shrink-0">
                        {formatCurrency(product.discountPrice ?? product.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 hover:border-slate-700 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-violet-400" />
                  <span>{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md shadow-violet-600/20 transition-all"
              >
                <UserIcon className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* Dark / Light Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 hover:border-slate-700 transition-all duration-200"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-violet-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Pill */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-violet-600/25 hover:from-violet-500 hover:to-indigo-500 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white text-violet-950 text-[11px] font-black px-1.5 py-0.5 rounded-full">
                {itemCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Sub-Navbar Category Navigation Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-xs font-medium text-slate-300 overflow-x-auto hide-scrollbar">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center gap-2 py-2">
          <Link
            to="/products"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/10 text-violet-300 border border-violet-500/20 font-bold hover:bg-violet-600/20 transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>All Products</span>
          </Link>
          <div className="h-4 w-px bg-slate-800 shrink-0" />
          {LOCAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="px-3 py-1 rounded-full hover:bg-slate-800 hover:text-white transition-colors shrink-0"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-4 text-white animate-in slide-in-from-top duration-200">
          <form onSubmit={onSearch} className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full bg-slate-900 border border-slate-800 text-white pl-4 pr-10 py-2 text-xs outline-none focus:border-violet-500"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <Link
              to="/products"
              onClick={() => setMobileOpen(false)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 flex items-center justify-between"
            >
              <span>All Products</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Cart ({itemCount})</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
