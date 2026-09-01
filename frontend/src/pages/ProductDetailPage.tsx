import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Star, ChevronLeft, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useGetProductDetails } from '../hooks/useProducts';
import { useCartStore } from '../stores/useCartStore';
import { formatCurrency, calculateDiscountPercentage } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetProductDetails(id || '');
  const addItem = useCartStore((state) => state.addItem);

  const product = data?.data?.product;

  if (isLoading) {
    return (
      <div className="py-12 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-slate-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-12 bg-slate-200 rounded-2xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <Link to="/products">
          <Button leftIcon={<ChevronLeft className="w-4 h-4" />}>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const primaryImg = product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
  const discountPct = calculateDiscountPercentage(product.price, product.discountPrice);

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6">
      <Link to="/products" className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-brand-600">
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
          <img src={primaryImg} alt={product.title} className="w-full h-full object-cover" />
          {discountPct && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{discountPct}% OFF
            </span>
          )}
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <Badge variant="brand">{product.category?.name || 'General'}</Badge>
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">{product.title}</h1>

            <div className="flex items-center space-x-2 text-amber-500 text-xs font-bold">
              <Star className="w-4 h-4 fill-current" />
              <span>{product.avgRating || '4.8'}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount || 10} reviews)</span>
            </div>

            <div className="py-3 border-y border-slate-100 flex items-baseline space-x-3">
              <span className="text-3xl font-extrabold text-slate-900">
                {formatCurrency(product.discountPrice ?? product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-base text-slate-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <Button
              size="lg"
              className="w-full"
              leftIcon={<ShoppingBag className="w-5 h-5" />}
              onClick={() => addItem(product)}
            >
              Add to Shopping Bag
            </Button>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 pt-2">
              <div className="p-2 bg-slate-50 rounded-xl space-y-1">
                <Truck className="w-4 h-4 mx-auto text-brand-600" />
                <span>Fast Shipping</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl space-y-1">
                <ShieldCheck className="w-4 h-4 mx-auto text-brand-600" />
                <span>Secure Pay</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl space-y-1">
                <RefreshCw className="w-4 h-4 mx-auto text-brand-600" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
