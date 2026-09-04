import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { useToastStore } from '../../stores/useToastStore';
import { formatCurrency } from '../../utils/formatters';

export const CartGlassToast: React.FC = () => {
  const navigate = useNavigate();
  const { toast, hideToast } = useToastStore();

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      hideToast();
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  const { product, quantity } = toast;
  const primaryImg =
    product.images?.find((i) => i.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80';
  const price = product.discountPrice ?? product.price;

  const handleClick = () => {
    hideToast();
    navigate('/cart');
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div
        onClick={handleClick}
        className="group relative bg-slate-950/90 backdrop-blur-xl border border-violet-500/40 shadow-2xl shadow-violet-950/60 text-white rounded-2xl p-4 flex items-center gap-3.5 max-w-sm sm:max-w-md cursor-pointer hover:border-violet-400 hover:scale-[1.02] transition-all"
        role="button"
        tabIndex={0}
        aria-label="View Cart"
      >
        {/* Glowing Badge Icon */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-md overflow-hidden">
            <img src={primaryImg} alt={product.title} className="w-full h-full object-contain" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-slate-950 shadow">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0 pr-6 space-y-0.5">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
            <ShoppingBag className="w-3 h-3" />
            <span>Added to Cart ({quantity})</span>
          </div>

          <h4 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-1 group-hover:text-violet-300 transition-colors">
            {product.title}
          </h4>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-violet-400">{formatCurrency(price)}</span>
            <span className="text-[11px] font-bold text-violet-300/80 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
              View Cart <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Close X Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            hideToast();
          }}
          className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
