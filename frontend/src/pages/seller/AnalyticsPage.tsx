import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Package, Eye, ShoppingCart, Star } from 'lucide-react';
import { sellerService } from '../../services/sellerService';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export const SellerAnalyticsPage: React.FC = () => {
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Analytics Dashboard</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-50">
            <ShoppingCart className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Total Orders</p>
            <p className="text-xl font-black text-slate-900">{analytics.totalOrders}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-50">
            <Package className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Units Sold</p>
            <p className="text-xl font-black text-slate-900">{analytics.totalUnitsSold}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Revenue</p>
            <p className="text-xl font-black text-slate-900">{formatCurrency(analytics.totalRevenue)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50">
            <Eye className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Product Views</p>
            <p className="text-xl font-black text-slate-900">{analytics.totalViews}</p>
          </div>
        </div>
      </div>

      {/* Avg Rating */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Average Rating</p>
            <p className="text-2xl font-black text-slate-900">{analytics.avgRating.toFixed(1)} / 5</p>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-violet-600" />
          Product Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-500 font-bold uppercase tracking-wider">
                <th className="pb-3">Product</th>
                <th className="pb-3 text-right">Views</th>
                <th className="pb-3 text-right">Sales</th>
                <th className="pb-3 text-right">Rating</th>
                <th className="pb-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topProducts.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                        <img
                          src={p.image || ''}
                          alt={p.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-medium text-slate-900 line-clamp-1 max-w-[200px]">{p.title}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">{p.views}</td>
                  <td className="py-3 text-right text-slate-600">{p.salesCount}</td>
                  <td className="py-3 text-right">
                    <span className="flex items-center gap-0.5 justify-end">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {p.avgRating.toFixed(1)} ({p.reviewCount})
                    </span>
                  </td>
                  <td className="py-3 text-right font-black text-slate-900">{formatCurrency(p.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
