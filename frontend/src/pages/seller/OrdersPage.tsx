import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Calendar, User, MapPin, Phone, ChevronRight, FileText, CheckCircle } from 'lucide-react';
import { sellerService, SellerOrder } from '../../services/sellerService';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../../components/ui/Badge';
import { OrderTrackingTimeline } from '../../components/orders/OrderTrackingTimeline';
import { printOrderReceipt } from '../../utils/printReceipt';

const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export const SellerOrdersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['seller-orders'],
    queryFn: () => sellerService.getOrders(),
    retry: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderItemId, status }: { orderItemId: string; status: string }) =>
      sellerService.updateOrderStatus(orderItemId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] });
      setUpdatingItemId(null);
      setNewStatus('');
    },
  });

  const handleStatusUpdate = (orderItemId: string) => {
    if (!newStatus) return;
    setUpdatingItemId(orderItemId);
    updateStatusMutation.mutate({ orderItemId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Order Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {orders.length} order{orders.length !== 1 ? 's' : ''} received
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-900">No orders yet</h3>
          <p className="text-xs text-slate-500">New orders will appear here once customers place them</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const sellerItems = order.items?.filter((i) => i.sellerId === order.userId || true) || order.items;
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-sm text-slate-900">#{order.orderNumber}</p>
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={order.status === 'DELIVERED' ? 'success' : 'brand'}>
                      {order.status}
                    </Badge>
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="p-4 space-y-4">
                    <OrderTrackingTimeline status={order.status as any} />

                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <User className="w-3 h-3" />
                        <span>
                          {order.user?.name} ({order.user?.email})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="w-3 h-3" />
                        <span>
                          {order.address?.street}, {order.address?.city}, {order.address?.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone className="w-3 h-3" />
                        <span>{order.address?.phone}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="font-bold text-xs text-slate-900 mb-3">Items</h4>
                      <div className="space-y-2">
                        {sellerItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl overflow-hidden">
                                <img
                                  src={item.product?.images?.find((i) => i.isPrimary)?.url || item.product?.images?.[0]?.url || ''}
                                  alt={item.product?.title}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <p className="font-bold text-xs text-slate-900">
                                  {item.product?.title || 'Product'}
                                </p>
                                <p className="text-[10px] text-slate-500">
                                  Qty: {item.quantity} x {formatCurrency(item.unitPrice)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-black text-xs text-slate-900">
                                {formatCurrency(item.totalPrice)}
                              </span>
                              <select
                                value=""
                                onChange={(e) => {
                                  setNewStatus(e.target.value);
                                  handleStatusUpdate(item.id);
                                }}
                                disabled={updateStatusMutation.isPending && updatingItemId === item.id}
                                className="text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50 cursor-pointer"
                              >
                                <option value="">Update Status</option>
                                {ORDER_STATUSES.map((s) => (
                                  <option key={s} value={s}>
                                    {s.replace('_', ' ')}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100">
                      <button
                        onClick={() => printOrderReceipt(order)}
                        className="text-xs font-bold text-slate-600 hover:text-violet-600 flex items-center gap-1"
                      >
                        Print Invoice
                      </button>
                      <p className="font-black text-sm text-slate-900">
                        Order Total: {formatCurrency(order.finalAmount)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
