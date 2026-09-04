import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  X,
  Truck,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';
import { formatCurrency } from '../utils/formatters';
import { Button } from '../components/ui/Button';

export const CartPage: React.FC = () => {
  const {
    items,
    coupon,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    setQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getItemCount,
    getSubtotal,
    getShipping,
    getDiscount,
    getTotal,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const itemCount = getItemCount();
  const subtotal = getSubtotal();
  const shipping = getShipping();
  const discount = getDiscount();
  const total = getTotal();

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const result = applyCoupon(couponCode);
    setCouponMsg({ text: result.message, ok: result.success });
    if (result.success) setCouponCode('');
  };

  /* ───── Empty cart ───── */
  if (items.length === 0) {
    return (
      <div className="py-16 max-w-md mx-auto text-center space-y-5 px-4">
        <div className="bg-white p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="w-20 h-20 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-9 h-9" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Looks like you haven't added any items to your shopping bag yet. Browse our catalog and discover something you love.
          </p>
          <Link to="/products">
            <Button size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ───── Cart with items ───── */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ───── Item List ───── */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => {
            const unitPrice = product.discountPrice ?? product.price;
            const primaryImg =
              product.images?.find((i) => i.isPrimary)?.url ||
              product.images?.[0]?.url ||
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80';

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5 flex items-center gap-4"
              >
                {/* Thumbnail */}
                <Link to={`/products/${product.slug || product.id}`} className="shrink-0">
                  <img
                    src={primaryImg}
                    alt={product.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-slate-50 border border-slate-100"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <Link
                    to={`/products/${product.slug || product.id}`}
                    className="font-bold text-slate-900 text-sm hover:text-brand-600 transition-colors line-clamp-1 block"
                  >
                    {product.title}
                  </Link>
                  <p className="text-[11px] text-slate-400">{product.category?.name || 'General'}</p>
                  <p className="text-xs text-brand-600 font-bold">{formatCurrency(unitPrice)} each</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shrink-0">
                  <button
                    onClick={() => decreaseQuantity(product.id)}
                    className="p-2 hover:bg-white text-slate-600 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock || 99}
                    value={quantity}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v)) setQuantity(product.id, v);
                    }}
                    className="w-10 text-center text-xs font-bold bg-transparent border-0 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => increaseQuantity(product.id)}
                    className="p-2 hover:bg-white text-slate-600 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Line Total */}
                <div className="text-right min-w-[80px] hidden sm:block">
                  <p className="text-sm font-extrabold text-slate-900">
                    {formatCurrency(unitPrice * quantity)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(product.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {/* Continue Shopping Link */}
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* ───── Order Summary ───── */}
        <div className="space-y-6 lg:sticky lg:top-28">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h2>

            {/* Price Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="font-bold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-bold text-slate-900">{formatCurrency(shipping)}</span>
                )}
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span className="flex items-center space-x-1">
                    <Tag className="w-3 h-3" />
                    <span>Discount ({coupon?.code})</span>
                  </span>
                  <span className="font-bold">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span className="text-slate-400 text-[11px]">Calculated at checkout</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Estimated Total</span>
                <span className="text-brand-600 text-base">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Coupon Input */}
            <div className="space-y-2">
              {coupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-semibold">
                  <span className="flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{coupon.code} applied</span>
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="p-0.5 hover:text-emerald-950 transition-colors"
                    aria-label="Remove coupon"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponMsg(null);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <Button variant="outline" size="sm" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>
              )}
              {couponMsg && (
                <p
                  className={`text-[11px] font-semibold flex items-center space-x-1 ${
                    couponMsg.ok ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {!couponMsg.ok && <AlertCircle className="w-3 h-3" />}
                  <span>{couponMsg.text}</span>
                </p>
              )}
            </div>

            {/* Checkout CTA */}
            <Link to="/checkout">
              <Button size="lg" className="w-full text-sm font-bold shadow-lg shadow-brand-500/20">
                Proceed to Checkout
              </Button>
            </Link>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="text-center p-2 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                <Truck className="w-4 h-4 mx-auto text-brand-600" />
                <span className="block text-[10px] text-slate-500 font-semibold">Free over $50</span>
              </div>
              <div className="text-center p-2 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                <ShieldCheck className="w-4 h-4 mx-auto text-brand-600" />
                <span className="block text-[10px] text-slate-500 font-semibold">Secure Checkout</span>
              </div>
            </div>
          </div>

          {/* Backend-verified totals notice */}
          <p className="text-[10px] text-slate-400 text-center leading-relaxed">
            Prices and totals are estimates only. Final amounts including tax are verified server-side at checkout.
          </p>
        </div>
      </div>
    </div>
  );
};
