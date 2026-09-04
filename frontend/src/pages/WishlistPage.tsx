import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Trash2 } from 'lucide-react';
import { useWishlistStore } from '../stores/useWishlistStore';
import { useCartStore } from '../stores/useCartStore';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';

export const WishlistPage: React.FC = () => {
  const { items, toggleWishlist, clearWishlist } = useWishlistStore();
  const addItemToCart = useCartStore(state => state.addItem);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 text-rose-300 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your wishlist is empty</h2>
          <p className="text-slate-500 mt-2">Save items you love to your wishlist so you don't lose track of them.</p>
        </div>
        <Link to="/products">
          <Button size="lg">Explore Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          My Wishlist
        </h1>
        <Button variant="outline" onClick={() => { if (window.confirm('Clear all wishlist items?')) { clearWishlist(); } }} leftIcon={<Trash2 className="w-4 h-4" />}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(product => (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden relative">
              <img 
                src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                onClick={() => toggleWishlist(product)}
                leftIcon={<Heart className="w-4 h-4 fill-current" />}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-rose-500 hover:scale-110 transition-transform"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-between space-y-2">
              <Link to={`/products/${product.slug || product.id}`} className="font-bold text-slate-900 hover:text-brand-600 line-clamp-1">
                {product.title}
              </Link>
              <p className="text-base font-extrabold text-slate-900">
                {formatCurrency(product.discountPrice ?? product.price)}
              </p>
            </div>

            <Button 
              className="w-full" 
              leftIcon={<ShoppingBag className="w-4 h-4" />}
              onClick={() => addItemToCart(product)}
            >
              Move to Cart
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
