import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { PackageSearch, Plus, Edit2, Trash2, Search } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products', search],
    queryFn: async () => {
      const res = await apiClient.get(`/products?limit=50&search=${search}`);
      return res.data?.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await apiClient.delete(`/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] })
  });

  const products = productsData?.products || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <PackageSearch className="w-6 h-6 text-brand-600" />
            Product Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your store catalog and inventory.</p>
        </div>
        <Link to="/admin/products/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add Product</Button>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="max-w-md">
            <Input 
              placeholder="Search products by title..." 
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
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-right">Stock</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img src={product.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">{product.title}</p>
                        <p className="text-xs text-slate-400">{product.slug}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-medium">
                      {product.category?.name || '-'}
                    </td>
                    <td className="p-4 text-right font-bold text-slate-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="p-4 text-right text-sm">
                      <span className={`px-2 py-1 rounded-md font-bold ${product.stock > 10 ? 'bg-emerald-50 text-emerald-700' : product.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <Link to={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm" className="px-2 border-slate-200 text-slate-600 hover:text-brand-600">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="px-2 border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                        isLoading={deleteMutation.isPending && deleteMutation.variables === product.id}
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this product?')) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
