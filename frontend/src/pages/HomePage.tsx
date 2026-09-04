import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  Headphones,
  Shirt,
  Home,
  Watch,
  Sparkles,
  Dumbbell,
  ShoppingBasket,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Zap,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useGetProducts } from '../hooks/useProducts';
import { Product } from '../types';
import {
  LOCAL_CATEGORIES,
  LOCAL_PRODUCTS,
  dealProducts,
  featuredProducts,
  mergeCatalog,
  productsByCategory,
} from '../data/catalog';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { formatCurrency } from '../utils/formatters';
import { ProductShelf } from '../components/home/ProductShelf';
import { ProductCard } from '../components/products/ProductCard';
import { ProductRecommendations } from '../features/products/components/ProductRecommendations';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  mobiles: <Smartphone className="w-6 h-6 text-violet-500" />,
  electronics: <Headphones className="w-6 h-6 text-indigo-500" />,
  fashion: <Shirt className="w-6 h-6 text-pink-500" />,
  'home-living': <Home className="w-6 h-6 text-emerald-500" />,
  accessories: <Watch className="w-6 h-6 text-amber-500" />,
  beauty: <Sparkles className="w-6 h-6 text-rose-500" />,
  sports: <Dumbbell className="w-6 h-6 text-cyan-500" />,
  groceries: <ShoppingBasket className="w-6 h-6 text-teal-500" />,
};

export const HomePage: React.FC = () => {
  const homeParams = useMemo(() => ({ page: 1, limit: 100, sort: 'createdAt_desc' }), []);
  const { data, isLoading } = useGetProducts(homeParams);
  const products = useMemo(() => mergeCatalog(data?.products), [data?.products]);

  // Recent searches: IDs stored in localStorage
  const recentIds: string[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    } catch {
      return [];
    }
  }, []);

  const {
    recentProducts,
    deals,
    featured,
    trending,
    electronics,
    fashion,
    home,
    sports,
    beauty,
    accessories,
    more,
  } = useMemo(() => {
    const used = new Set<string>();
    const take = (list: Product[], max: number) => {
      const result: Product[] = [];
      for (const p of list) {
        if (!used.has(p.id)) {
          used.add(p.id);
          result.push(p);
          if (result.length >= max) break;
        }
      }
      return result;
    };

    // Recent searches: if user has history use it; otherwise show top-reviewed as "popular" fallback
    const fromRecent = products.filter((p) => recentIds.includes(p.id));
    const recentFallback =
      fromRecent.length >= 6
        ? fromRecent.slice(0, 16)
        : [...LOCAL_PRODUCTS]
            .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
            .slice(0, 16);

    return {
      recentProducts: recentFallback,
      deals: take(dealProducts(products), 20),
      featured: take(featuredProducts(products), 16),
      // Trending = top rated (not already shown)
      trending: take(
        [...products].sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0)),
        20,
      ),
      electronics: take(
        productsByCategory(products, 'electronics').concat(
          productsByCategory(products, 'mobiles'),
        ),
        16,
      ),
      fashion: take(productsByCategory(products, 'fashion'), 16),
      home: take(productsByCategory(products, 'home-living'), 16),
      sports: take(productsByCategory(products, 'sports'), 12),
      beauty: take(productsByCategory(products, 'beauty'), 12),
      accessories: take(productsByCategory(products, 'accessories'), 12),
      // Explore grid: everything remaining (48 cards)
      more: take(products, 48),
    };
  }, [products, recentIds]);

  return (
    <div className="pb-16 space-y-8 bg-slate-50/70">
      <HeroCarousel />

      {/* ── Recent Searches / Popular Products ─────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-slate-500" />
          <h2 className="text-xl font-extrabold text-slate-900">
            {recentIds.length > 0 ? 'Based on your recent searches' : 'Most Popular Right Now'}
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {recentProducts.map((product) => (
            <div key={product.id} className="w-[200px] sm:w-[220px] shrink-0">
              <ProductCard product={product} compact />
            </div>
          ))}
        </div>
      </section>

      {/* ── Category Bar ───────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-600" />
              Shop By Category
            </h3>
            <Link
              to="/"
              className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {LOCAL_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                className="shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-violet-50/50 hover:border-violet-200 hover:-translate-y-1 transition-all duration-200 w-24 sm:w-28 text-center group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {CATEGORY_ICONS[cat.slug] || <ShoppingBasket className="w-6 h-6 text-violet-500" />}
                </div>
                <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-violet-600">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 space-y-8">

        {/* Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <Truck className="w-6 h-6 text-violet-600" />, title: 'Free Express Shipping', copy: `On all orders above ${formatCurrency(50)}` },
            { icon: <RotateCcw className="w-6 h-6 text-indigo-600" />, title: '30-Day Easy Returns', copy: 'Instant hassle-free refunds' },
            { icon: <ShieldCheck className="w-6 h-6 text-pink-600" />, title: '100% Encrypted Checkout', copy: 'Secured with Stripe & SSL' },
          ].map((perk) => (
            <div
              key={perk.title}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="p-3 rounded-2xl bg-violet-50 border border-violet-100 shrink-0">
                {perk.icon}
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900">{perk.title}</p>
                <p className="text-xs text-slate-500 font-medium">{perk.copy}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-72 bg-white rounded-3xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Flash Deals – 20 cards */}
        <ProductShelf
          title="⚡ Flash Deals"
          subtitle="Exclusive limited-time price reductions — grab them before they're gone"
          viewAllTo="/products"
          products={deals}
        />

        {/* AI Recommendations – 20 cards (always visible) */}
        <ProductRecommendations />

        {/* Trending Now – 20 cards */}
        <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Trending Now
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Top-rated products loved by thousands of shoppers</p>
            </div>
            <Link
              to="/"
              className="text-xs font-bold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-full transition-colors"
            >
              See All
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {trending.map((product) => (
              <div key={product.id} className="w-[200px] sm:w-[220px] shrink-0">
                <ProductCard product={product} compact />
              </div>
            ))}
          </div>
        </section>

        {/* Category Shelves */}
        <ProductShelf title="Best of Electronics & Mobiles" viewAllTo="/products?category=electronics" products={electronics} />
        <ProductShelf title="Luxury Fashion Picks" viewAllTo="/products?category=fashion" products={fashion} />
        <ProductShelf title="Home & Living Concepts" viewAllTo="/products?category=home-living" products={home} />

        {/* Sports & Beauty side-by-side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductShelf title="Sports & Fitness" viewAllTo="/products?category=sports" products={sports} />
          <ProductShelf title="Beauty & Self-Care" viewAllTo="/products?category=beauty" products={beauty} />
        </div>

        <ProductShelf title="Accessories & More" viewAllTo="/products?category=accessories" products={accessories} />
        <ProductShelf title="✨ Featured Selection" viewAllTo="/products" products={featured} />

        {/* Explore Storefront – 48-card grid */}
        <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-600" />
                Explore Storefront
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Handpicked quality products across all categories
              </p>
            </div>
            <Link
              to="/"
              className="text-xs font-bold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-full transition-colors"
            >
              See All Catalog
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {more.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
