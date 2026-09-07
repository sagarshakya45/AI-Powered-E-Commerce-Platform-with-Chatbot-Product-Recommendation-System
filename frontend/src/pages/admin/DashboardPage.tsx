import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  DollarSign,
  ShoppingCart,
  PackageSearch,
  Users,
  Activity,
  BadgeCheck,
  Ticket,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../../components/ui/Badge';

export const DashboardPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/overview');
      return res.data?.data;
    },
  });

  const { data: salesmanApps = [] } = useQuery({
    queryKey: ['admin-salesman-apps-count'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/salesman-applications');
      return res.data?.data?.applications || [];
    },
  });

  const pendingSalesmanCount = salesmanApps.filter((a: any) => a.status === 'PENDING').length;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Revenue',
      value: formatCurrency(data?.revenue || 0),
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      name: 'Total Orders',
      value: data?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100',
    },
    {
      name: 'Active Products',
      value: data?.totalProducts || 0,
      icon: PackageSearch,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
    {
      name: 'Registered Users',
      value: data?.totalUsers || 0,
      icon: Users,
      color: 'text-rose-600',
      bg: 'bg-rose-100',
    },
  ];

  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Intelligence Center</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Real-time e-commerce metrics, order streams & vendor verification</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="px-4 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/20 transition-all"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Pending Salesman Alert Banner */}
      {pendingSalesmanCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white p-5 rounded-3xl shadow-xl flex items-center justify-between gap-4 animate-in fade-in-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-black text-sm">Action Required: {pendingSalesmanCount} Salesman Application(s) Pending</h4>
              <p className="text-xs text-amber-100 font-medium">Verify vendor merchant details to assign Salesman role privileges.</p>
            </div>
          </div>
          <Link
            to="/admin/salesman-applications"
            className="px-4 py-2 rounded-full bg-white text-slate-900 font-black text-xs hover:bg-amber-50 shadow-md shrink-0 transition-colors"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* Core KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.name}</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Control Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/admin/salesman-applications"
          className="p-5 rounded-3xl bg-gradient-to-br from-violet-900 to-indigo-950 text-white border border-violet-500/30 shadow-lg hover:scale-[1.01] transition-transform space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <BadgeCheck className="w-6 h-6 text-violet-400" />
            <ArrowUpRight className="w-4 h-4 text-violet-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <h4 className="font-black text-sm">Vendor Verification</h4>
          <p className="text-[11px] text-slate-300">Approve or reject customer salesman requests</p>
        </Link>

        <Link
          to="/admin/coupons"
          className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-lg hover:scale-[1.01] transition-transform space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <Ticket className="w-6 h-6 text-pink-400" />
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <h4 className="font-black text-sm">Coupon Manager</h4>
          <p className="text-[11px] text-slate-400">Configure promo discount codes & usage limits</p>
        </Link>

        <Link
          to="/admin/orders"
          className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-500/30 shadow-lg hover:scale-[1.01] transition-transform space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <ShoppingCart className="w-6 h-6 text-indigo-400" />
            <ArrowUpRight className="w-4 h-4 text-indigo-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <h4 className="font-black text-sm">Fulfillment Stream</h4>
          <p className="text-[11px] text-indigo-200">Process order statuses from Pending to Delivered</p>
        </Link>
      </div>

      {/* Recent Orders Stream */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-600" />
            Live Customer Orders Stream
          </h2>
          <Link to="/admin/orders" className="text-xs font-bold text-violet-600 hover:underline">
            View All Orders →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-slate-500 font-medium bg-slate-50">No recent orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 font-black border-b border-slate-100">
                  <th className="p-4 pl-6">Order Reference</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 pl-6 font-mono font-black text-slate-900">#{order.orderNumber}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{order.user?.name || 'Guest User'}</p>
                      <p className="text-[11px] text-slate-400">{order.user?.email || 'N/A'}</p>
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      <Badge variant={order.status === 'CONFIRMED' || order.status === 'DELIVERED' ? 'success' : 'brand'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="p-4 pr-6 text-right font-black text-slate-900">
                      {formatCurrency(order.finalAmount)}
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
