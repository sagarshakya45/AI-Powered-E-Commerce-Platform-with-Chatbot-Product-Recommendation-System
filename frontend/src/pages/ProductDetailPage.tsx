import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Star, ChevronLeft, Truck, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { useGetProductDetails } from '../hooks/useProducts';
import { useCartStore } from '../stores/useCartStore';
import { formatCurrency, calculateDiscountPercentage } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProductReviews } from '../features/reviews/components/ProductReviews';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, error, refetch } = useGetProductDetails(id || '');
  const addItem = useCartStore((state) => state.addItem);

  if (isLoading) {
    return (
      <div className="py-12 max-w-5xl mx-auto px-4 space-y-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl border border-slate-100">
          <div className="aspect-square bg-slate-200 rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="h-24 bg-slate-200 rounded-xl w-full"></div>
            <div className="h-12 bg-slate-200 rounded-xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500">
          {(error as Error)?.message || `We couldn't locate the product '${id}'.`}
        </p>
        <div className="flex justify-center space-x-3 pt-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
          <Link to="/">
            <Button size="sm" leftIcon={<ChevronLeft className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const primaryImg =
    product.images?.find((i) => i.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
  const discountPct = calculateDiscountPercentage(product.price, product.discountPrice);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
            <img src={primaryImg} alt={product.title} className="w-full h-full object-cover" />
            {discountPct && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                -{discountPct}% OFF
              </span>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 cursor-pointer hover:border-brand-500 transition-colors"
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <Badge variant="brand">{product.category?.name || 'General Catalog'}</Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center space-x-2 text-amber-500 text-xs font-bold bg-amber-50/80 px-3 py-1.5 rounded-xl w-fit">
              <Star className="w-4 h-4 fill-current text-amber-400" />
              <span>{product.avgRating || '4.8'}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount || 10} reviews)</span>
            </div>

            <div className="py-4 border-y border-slate-100 flex items-baseline space-x-3">
              <span className="text-3xl font-black text-slate-900">
                {formatCurrency(product.discountPrice ?? product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-base text-slate-400 line-through font-semibold">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <Button
              size="lg"
              className="w-full text-sm font-bold py-3.5 shadow-lg shadow-brand-500/20"
              leftIcon={<ShoppingBag className="w-5 h-5" />}
              onClick={() => addItem(product)}
            >
              Add to Shopping Bag
            </Button>

            <div className="grid grid-cols-3 gap-3 text-center text-[11px] text-slate-500 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                <Truck className="w-4 h-4 mx-auto text-brand-600" />
                <span className="font-semibold block">Free Shipping</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                <ShieldCheck className="w-4 h-4 mx-auto text-brand-600" />
                <span className="font-semibold block">Secure Payment</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                <RefreshCw className="w-4 h-4 mx-auto text-brand-600" />
                <span className="font-semibold block">30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReviews productId={product.id} />
    </div>
  );
};
