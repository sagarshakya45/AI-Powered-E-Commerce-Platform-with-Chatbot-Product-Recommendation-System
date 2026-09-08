import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingCart, TrendingUp, Eye, Star, AlertTriangle } from 'lucide-react';
import { sellerService } from '../../services/sellerService';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

export const SellerDashboardPage: React.FC = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['seller-analytics'],
    queryFn: () => sellerService.getAnalytics(),
    retry: false,
  });

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Orders',
      value: analytics.totalOrders,
      icon: <ShoppingCart className="w-5 h-5 text-violet-600" />,
      bg: 'bg-violet-50',
    },
    {
      label: 'Units Sold',
      value: analytics.totalUnitsSold,
      icon: <Package className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(analytics.totalRevenue),
      icon: <TrendingUp className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      label: 'Product Views',
      value: analytics.totalViews,
      icon: <Eye className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} border border-slate-200 rounded-2xl p-5 flex items-center gap-4 transition-transform hover:scale-[1.02]`}
          >
            <div className="p-3 rounded-xl bg-white shadow-sm">{stat.icon}</div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-slate-900">Top Products by Sales</h3>
          <Link
            to="/seller/products"
            className="text-xs font-bold text-violet-600 hover:text-violet-700"
          >
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {analytics.topProducts.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
              <img
                src={p.price ? `https://via.placeholder.com/48?text=Product` : ''}
                alt={p.title}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-900 line-clamp-1">{p.title}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                  <span>{p.salesCount} sold</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {p.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {p.avgRating.toFixed(1)} ({p.reviewCount})
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-sm text-slate-900">{formatCurrency(p.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {analytics.lowStockProducts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h3 className="font-black text-sm text-rose-900">Low Stock Alert</h3>
          </div>
          <div className="space-y-2">
            {analytics.lowStockProducts.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-rose-100">
                <div>
                  <p className="font-semibold text-sm text-slate-900">{p.title}</p>
                  <p className="text-xs text-rose-600 font-medium">Only {p.stock} left in stock</p>
                </div>
                <Link
                  to={`/seller/products/${p.id}/edit`}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700"
                >
                  Restock
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-slate-900">Recent Orders</h3>
          <Link
            to="/seller/orders"
            className="text-xs font-bold text-violet-600 hover:text-violet-700"
          >
            View All
          </Link>
        </div>
        {analytics.recentOrders.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {analytics.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-100"
              >
                <div>
                  <p className="font-black text-xs text-slate-900">Order #{order.orderNumber}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {order.user.name} - {formatCurrency(order.finalAmount)}
                  </p>
                </div>
                <Badge variant={order.status === 'DELIVERED' ? 'success' : 'brand'}>
                  {order.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
