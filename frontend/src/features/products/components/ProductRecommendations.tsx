import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ArrowRight, Star, ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../../services/apiClient';
import { formatCurrency, calculateDiscountPercentage } from '../../../utils/formatters';
import { LOCAL_PRODUCTS } from '../../../data/catalog';
import { useCartStore } from '../../../stores/useCartStore';
import { useWishlistStore } from '../../../stores/useWishlistStore';

const AI_COUNT = 20;

export const ProductRecommendations: React.FC = () => {
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const { data: apiRecs = [], isLoading } = useQuery({
    queryKey: ['ai-recommendations'],
    queryFn: async () => {
      const res = await apiClient.get('/ai/recommendations');
      return res.data?.data?.recommendations || [];
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // When API is offline/empty, fallback to local catalog sorted by rating desc
  const recommendations = useMemo(() => {
    if (apiRecs.length > 0) return apiRecs.slice(0, AI_COUNT);
    return [...LOCAL_PRODUCTS]
      .sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))
      .slice(0, AI_COUNT);
  }, [apiRecs]);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="h-8 bg-slate-200 rounded-xl w-72 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 rounded-3xl border border-violet-100 p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-600" />
            AI Picks For You
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Personalized recommendations powered by intelligent analysis
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700 bg-white border border-violet-200 hover:border-violet-300 px-3 py-1.5 rounded-full transition-all"
        >
          See All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid – 20 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {recommendations.map((product: any) => {
          const primaryImg =
            product.images?.find((i: any) => i.isPrimary)?.url ||
            product.images?.[0]?.url ||
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
          const discountPct = calculateDiscountPercentage(product.price, product.discountPrice);
          const wished = isInWishlist(product.id);

          return (
            <article
              key={product.id}
              className="group relative flex flex-col rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-violet-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* AI badge */}
              <span className="absolute top-3 left-3 z-10 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                AI Pick
              </span>

              {/* Wishlist */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-md shadow text-slate-400 hover:text-rose-500 hover:scale-110 transition-all"
              >
                <Heart className={`w-3.5 h-3.5 ${wished ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              {/* Discount badge */}
              {discountPct ? (
                <div className="absolute top-10 left-3 z-10">
                  <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
                    -{discountPct}%
                  </span>
                </div>
              ) : null}

              {/* Image */}
              <Link
                to={`/products/${product.slug || product.id}`}
                className="block h-40 bg-slate-50/60 p-3 overflow-hidden"
              >
                <img
                  src={primaryImg}
                  alt={product.title}
                  className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Info */}
              <div className="flex flex-1 flex-col p-3 pt-2 gap-1">
                <Link
                  to={`/products/${product.slug || product.id}`}
                  className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 hover:text-violet-600 transition-colors"
                >
                  {product.title}
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <div className="inline-flex items-center gap-0.5 bg-amber-50 border border-amber-200/60 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span>{(product.avgRating ?? 4.5).toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">({product.reviewCount ?? 0})</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mt-auto">
                  <span className="text-sm font-black text-slate-900">
                    {formatCurrency(product.discountPrice ?? product.price)}
                  </span>
                  {product.discountPrice ? (
                    <span className="text-[10px] text-slate-400 line-through">
                      {formatCurrency(product.price)}
                    </span>
                  ) : null}
                </div>

                {/* Add to cart */}
                <button
                  type="button"
                  onClick={() => addItem(product)}
                  className="mt-1 w-full inline-flex items-center justify-center gap-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-[10px] font-bold py-2 rounded-xl shadow-md shadow-violet-600/15 hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Add to Cart
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
