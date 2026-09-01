import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Star, Sparkles } from 'lucide-react';
import { useGetProducts, useGetCategories } from '../hooks/useProducts';
import { useCartStore } from '../stores/useCartStore';
import { formatCurrency, calculateDiscountPercentage } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt_desc');

  const { data: productsData, isLoading, isError } = useGetProducts({
    search: search || undefined,
    categoryId: selectedCategory || undefined,
    sortBy,
  });

  const { data: categoriesData } = useGetCategories();
  const addItem = useCartStore((state) => state.addItem);

  const products = productsData?.data?.products || [];
  const categories = categoriesData?.data?.categories || [];

  return (
    <div className="space-y-8 py-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="w-full md:w-72">
          <Input
            placeholder="Search catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer"
          >
            <option value="createdAt_desc">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="title_asc">Title: A-Z</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4 animate-pulse">
              <div className="w-full h-48 bg-slate-200 rounded-xl"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl text-center">
          Failed to load products. Please ensure the backend service is running.
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 space-y-3">
          <p className="text-slate-500 font-semibold">No products found matching criteria.</p>
          <Button size="sm" onClick={() => { setSearch(''); setSelectedCategory(''); }}>
            Reset Filters
          </Button>
        </div>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const primaryImg = product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
            const discountPct = calculateDiscountPercentage(product.price, product.discountPrice);

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={primaryImg}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {discountPct && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                      -{discountPct}% OFF
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <Badge variant="brand">{product.category?.name || 'Catalog'}</Badge>
                    <Link
                      to={`/products/${product.id}`}
                      className="block font-bold text-slate-900 hover:text-brand-600 transition-colors text-base line-clamp-1 mt-1"
                    >
                      {product.title}
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-extrabold text-slate-900">
                        {formatCurrency(product.discountPrice ?? product.price)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-slate-400 line-through ml-2">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{product.avgRating || '4.8'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/products/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Details
                      </Button>
                    </Link>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
                      onClick={() => addItem(product)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
