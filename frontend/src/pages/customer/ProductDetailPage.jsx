import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ShieldCheck, Truck, RefreshCw, ChevronLeft, Minus, Plus, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { productService } from '../../services/productService';

export const ProductDetailPage = () => {
  const { id } = useParams();
  
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getProductByIdOrSlug(id);
      if (res.success) {
        setProduct(res.data.product);
        const primaryImg = res.data.product.images?.find((img) => img.isPrimary)?.url || res.data.product.images?.[0]?.url;
        setSelectedImage(primaryImg || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
      }
    } catch (err) {
      setError(err.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="py-12 max-w-5xl mx-auto space-y-8 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-slate-200 rounded-3xl"></div>
          <div className="space-y-6">
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-12 bg-slate-200 rounded-2xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-16 max-w-xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-slate-500 text-sm">{error || 'The product you are looking for does not exist or has been removed.'}</p>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-brand-600 shadow-md transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  return (
    <div className="py-8 max-w-6xl mx-auto space-y-8">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">Added {quantity} x "{product.title}" to Cart!</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-medium text-slate-500">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-brand-600">Catalog</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 shadow-sm">
        {/* Left: Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {discountPct && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                -{discountPct}% OFF
              </span>
            )}
            {product.isFeatured && (
              <span className="absolute top-4 right-4 bg-amber-400 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured</span>
              </span>
            )}
          </div>

          {/* Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img.url ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Controls */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 px-3 py-1 rounded-full bg-brand-50 border border-brand-100">
                {product.category?.name || 'General'}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                product.stock > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-700">{product.avgRating || '4.8'}</span>
              <span className="text-xs text-slate-400">({product.reviewCount || 12} customer reviews)</span>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline space-x-4 py-3 border-y border-slate-100">
              <span className="text-3xl font-extrabold text-slate-900">
                ${product.discountPrice ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
              </span>
              {product.discountPrice && (
                <span className="text-lg text-slate-400 line-through font-medium">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Purchase Controls */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Shopping Bag</span>
              </button>
              <button
                className="p-3.5 rounded-2xl border border-slate-200 text-slate-700 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center"
                title="Add to Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Guarantees Perks */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 rounded-xl bg-slate-50 space-y-1">
              <Truck className="w-5 h-5 text-brand-600 mx-auto" />
              <p className="text-[11px] font-bold text-slate-900">Fast Shipping</p>
              <p className="text-[10px] text-slate-400">2-4 Days Delivery</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 space-y-1">
              <ShieldCheck className="w-5 h-5 text-brand-600 mx-auto" />
              <p className="text-[11px] font-bold text-slate-900">2 Year Warranty</p>
              <p className="text-[10px] text-slate-400">100% Guaranteed</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 space-y-1">
              <RefreshCw className="w-5 h-5 text-brand-600 mx-auto" />
              <p className="text-[11px] font-bold text-slate-900">Free Returns</p>
              <p className="text-[10px] text-slate-400">30 Day Guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
