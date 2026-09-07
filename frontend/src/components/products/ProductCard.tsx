import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, calculateDiscountPercentage } from '../../utils/formatters';
import { useCartStore } from '../../stores/useCartStore';
import { useWishlistStore } from '../../stores/useWishlistStore';

type Props = {
  product: Product;
  compact?: boolean;
};

export const ProductCard: React.FC<Props> = ({ product, compact = false }) => {
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const wished = isInWishlist(product.id);
  const primaryImg =
    product.images?.find((i) => i.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
  const discountPct = calculateDiscountPercentage(product.price, product.discountPrice);
  const href = `/products/${product.slug || product.id}`;

  return (
    <article className="group relative flex h-full min-w-[170px] flex-col rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-violet-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Floating Wishlist Heart */}
      <button
        type="button"
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product);
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md text-slate-400 hover:text-rose-500 hover:scale-110 transition-all duration-200"
      >
        <Heart className={`w-4 h-4 ${wished ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Floating Discount Badge */}
      {discountPct ? (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
            -{discountPct}%
          </span>
        </div>
      ) : null}

      {/* Product Image Area */}
      <Link to={href} className={`block bg-slate-50/60 ${compact ? 'h-40' : 'h-48'} p-4 overflow-hidden relative group`}>
        <img
          src={primaryImg}
          alt={product.title}
          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4 pt-3">
        <Link to={href} className="text-xs sm:text-sm font-bold text-slate-800 leading-snug line-clamp-2 hover:text-violet-600 transition-colors">
          {product.title}
        </Link>

        {/* Rating Pill */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/60 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{(product.avgRating ?? 0).toFixed(1)}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">({product.reviewCount ?? 0})</span>
        </div>

        {/* Price Tag */}
        <div className="mt-3 flex items-baseline flex-wrap gap-x-2">
          <span className="text-base sm:text-lg font-black text-slate-900">
            {formatCurrency(product.discountPrice ?? product.price)}
          </span>
          {product.discountPrice ? (
            <span className="text-xs text-slate-400 line-through font-medium">{formatCurrency(product.price)}</span>
          ) : null}
        </div>

        {product.stock > 0 && product.stock <= 12 ? (
          <p className="mt-1 text-[11px] text-rose-500 font-bold">Only {product.stock} left in stock</p>
        ) : null}

        {/* Add to Cart CTA */}
        <button
          type="button"
          onClick={() => addItem(product)}
          className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 rounded-2xl shadow-md shadow-violet-600/15 hover:shadow-lg hover:shadow-violet-600/25 transition-all active:scale-[0.98]"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>
    </article>
  );
};
