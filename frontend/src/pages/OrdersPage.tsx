import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, CheckCircle2, Printer, ShoppingBag } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { formatCurrency } from '../utils/formatters';
import { Badge } from '../components/ui/Badge';
import { OrderTrackingTimeline } from '../components/orders/OrderTrackingTimeline';
import { printOrderReceipt } from '../utils/printReceipt';
import { BackButton } from '../components/common/BackButton';

export const OrdersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await apiClient.get('/orders');
      return res.data?.data?.orders || [];
    },
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex flex-col items-center text-center space-y-3 mb-8 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-emerald-900">Order Placed Successfully!</h2>
          <p className="text-emerald-700 text-xs sm:text-sm font-medium">
            Thank you for your purchase. We are processing your shipment and will update your order status below.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <BackButton />
          <div className="w-10 h-10 bg-violet-600/10 border border-violet-500/20 text-violet-600 flex items-center justify-center rounded-2xl">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Order History</h1>
            <p className="text-xs text-slate-500 font-medium">Track shipment timelines and download official sales invoices</p>
          </div>
        </div>

        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-full transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Continue Shopping
        </Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white border border-slate-100 rounded-3xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">You haven't placed any orders yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Explore our high-tech electronics, fashion, and home collections!</p>
          <Link
            to="/"
            className="inline-block mt-2 text-xs font-bold bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-full shadow-md transition-all"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden space-y-4">
              {/* Header Info */}
              <div className="bg-slate-50/80 p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Order Reference</p>
                  <p className="font-mono text-xs font-black text-slate-900">#{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Date Placed</p>
                  <p className="text-xs font-bold text-slate-900">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Grand Total</p>
                  <p className="text-xs font-black text-slate-900">{formatCurrency(order.finalAmount)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={order.status === 'CONFIRMED' || order.status === 'DELIVERED' ? 'success' : 'brand'}>
                    {order.status}
                  </Badge>

                  {/* Print Invoice Button */}
                  <button
                    type="button"
                    onClick={() => printOrderReceipt(order)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-violet-600 hover:border-violet-300 transition-colors shadow-sm"
                    title="Print Tax Invoice / Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Order Tracking Progress Bar */}
              <div className="px-5">
                <OrderTrackingTimeline status={order.status} />
              </div>

              {/* Items List */}
              <div className="p-5 pt-0 divide-y divide-slate-100">
                {order.items.map((item: any) => {
                  const img =
                    item.product?.images?.[0]?.url ||
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80';
                  return (
                     <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                       <div className="flex items-center gap-3.5 min-w-0">
                         <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl p-1 shrink-0 overflow-hidden">
                           <img src={img} alt={item.product?.title} className="w-full h-full object-contain" />
                         </div>
                         <div className="min-w-0">
                           <Link
                             to={`/products/${item.product?.id}`}
                             className="font-bold text-xs text-slate-900 hover:text-violet-600 truncate block"
                           >
                             {item.product?.title || 'Product Item'}
                           </Link>
                           <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                             {item.seller?.name ? `Sold by ${item.seller.name}` : `Qty: ${item.quantity}`}
                           </p>
                         </div>
                       </div>
                      <div className="font-black text-xs text-slate-900 shrink-0">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
