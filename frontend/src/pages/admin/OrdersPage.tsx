import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Search } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { formatCurrency } from '../../utils/formatters';
import { Input } from '../../components/ui/Input';

export const OrdersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/orders');
      return res.data?.data?.orders || [];
    }
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return await apiClient.put(`/admin/orders/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    }
  });

  const filteredOrders = orders.filter((o: any) => 
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
    o.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-brand-600" />
          Order Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">View global orders and update fulfillment statuses.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="max-w-md">
            <Input 
              placeholder="Search by Order ID or Customer Email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>)}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                  <th className="p-4 pl-6">Order ID / Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 pr-6 text-right">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <p className="font-mono text-sm font-bold text-slate-900">{order.orderNumber}</p>
                      <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-slate-900">{order.user?.name || 'Guest'}</p>
                      <p className="text-xs text-slate-500">{order.user?.email || 'N/A'}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${order.payment?.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {order.payment?.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      {formatCurrency(order.finalAmount)}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                        disabled={updateStatus.isPending && updateStatus.variables?.id === order.id}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-colors ${
                          order.status === 'DELIVERED' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                          order.status === 'SHIPPED' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                          order.status === 'CANCELLED' ? 'bg-rose-50 border-rose-200 text-rose-700' :
                          'bg-amber-50 border-amber-200 text-amber-700'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
