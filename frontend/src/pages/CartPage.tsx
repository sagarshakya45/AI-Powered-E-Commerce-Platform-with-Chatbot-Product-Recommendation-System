import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { formatCurrency } from '../utils/formatters';
import { Button } from '../components/ui/Button';

export const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <div className="py-16 max-w-md mx-auto text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-500">Looks like you haven't added any items to your shopping bag yet.</p>
        <Link to="/products">
          <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Shopping Cart ({items.length} items)</h1>
        <button onClick={clearCart} className="text-xs font-semibold text-red-600 hover:underline">
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => {
            const price = product.discountPrice ?? product.price;
            const primaryImg = product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80';

            return (
              <div key={product.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <img src={primaryImg} alt={product.title} className="w-20 h-20 object-cover rounded-xl bg-slate-50" />
                
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{product.title}</h3>
                  <p className="text-xs text-brand-600 font-semibold">{formatCurrency(price)}</p>
                </div>

                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-1 hover:bg-white rounded-lg text-slate-600"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-1 hover:bg-white rounded-lg text-slate-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <p className="text-sm font-extrabold text-slate-900">{formatCurrency(price * quantity)}</p>
                </div>

                <button
                  onClick={() => removeItem(product.id)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 h-fit">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Order Summary</h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Shipping</span>
              <span className="text-emerald-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
              <span>Total</span>
              <span className="text-brand-600">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

          <Button size="lg" className="w-full">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};
