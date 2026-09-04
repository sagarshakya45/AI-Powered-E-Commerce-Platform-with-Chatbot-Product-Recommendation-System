import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle, SlidersHorizontal, Search } from 'lucide-react';
import { useGetProducts, useGetCategories } from '../hooks/useProducts';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/products/ProductCard';
import { LOCAL_PRODUCTS } from '../data/catalog';
import { Product } from '../types';
import { BackButton } from '../components/common/BackButton';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const limit = 9;

  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const inStockOnly = searchParams.get('inStockOnly') === 'true';
  const sortBy = searchParams.get('sort') || 'createdAt_desc';
  const page = Number(searchParams.get('page')) || 1;

  const queryParams = useMemo(() => ({
    page,
    limit,
    search: search || undefined,
    category: selectedCategory || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minRating: minRating ? Number(minRating) : undefined,
    inStock: inStockOnly ? true : undefined,
    sort: sortBy,
  }), [page, limit, search, selectedCategory, minPrice, maxPrice, minRating, inStockOnly, sortBy]);

  if (!search && !selectedCategory) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Search className="w-12 h-12 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-900">Start searching to see products</h2>
        <p className="text-xs text-slate-500">Use the search bar above or browse categories from the home page.</p>
        <Button onClick={() => navigate('/')} leftIcon={<ChevronLeft className="w-4 h-4" />}>
          Back to Home
        </Button>
      </div>
    );
  }

  const updateFilter = (key: string, value: string) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      if (key !== 'page') {
        prev.set('page', '1');
      }
      return prev;
    });
  };

  const { data: productsData, isLoading, isError, error, refetch } = useGetProducts(queryParams);

  const { data: categories = [] } = useGetCategories();

  const products = useMemo(() => {
    const fromApi = productsData?.products || [];
    if (isError) {
      let list: Product[] = [...LOCAL_PRODUCTS];
      const q = search.trim().toLowerCase();
      if (q) {
        list = list.filter(
          (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
      }
      if (selectedCategory) {
        list = list.filter((p) => p.category?.slug === selectedCategory);
      }
      if (inStockOnly) list = list.filter((p) => p.stock > 0);
      if (minPrice) list = list.filter((p) => (p.discountPrice ?? p.price) >= Number(minPrice));
      if (maxPrice) list = list.filter((p) => (p.discountPrice ?? p.price) <= Number(maxPrice));
      if (minRating) list = list.filter((p) => (p.avgRating || 0) >= Number(minRating));
      return list;
    }
    return fromApi;
  }, [productsData?.products, isError, search, selectedCategory, inStockOnly, minPrice, maxPrice, minRating]);

  const usingFallback = (productsData?.products || []).length === 0;
  const totalPages = usingFallback ? 1 : productsData?.totalPages || 1;
  const totalProducts = usingFallback ? products.length : productsData?.total || 0;

  const handleResetFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('category');
    newParams.delete('minPrice');
    newParams.delete('maxPrice');
    newParams.delete('minRating');
    newParams.delete('inStockOnly');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BackButton to="/" label="Home" />
        <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-600">
            {search ? (
              <span>Results for: <span className="text-slate-900">"{search}"</span></span>
            ) : (
              <span>Browse all products</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
            leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}
          >
            {showFilters ? 'Hide Filters' : 'Filters'}
          </Button>
          <select
            value={sortBy}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
          >
            <option value="createdAt_desc">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Top Rated</option>
            <option value="title_asc">Title A-Z</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Min Price</label>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Max Price</label>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Min Rating</label>
              <select
                value={minRating}
                onChange={(e) => updateFilter('minRating', e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
              >
                <option value="">Any</option>
                <option value="4.5">4.5+</option>
                <option value="4.0">4.0+</option>
                <option value="3.0">3.0+</option>
              </select>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 col-span-2 sm:col-span-4">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => updateFilter('inStockOnly', e.target.checked ? 'true' : '')}
                className="accent-brand-600 rounded cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700">In stock only</span>
            </label>
            <div className="col-span-2 sm:col-span-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={handleResetFilters} className="text-xs">Reset</Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>Showing {products.length} of {totalProducts} products</span>
        <span>Page {page} of {totalPages}</span>
      </div>

      {isLoading && products.length === 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className="h-64 bg-white border border-slate-200 animate-pulse" />
          ))}
        </div>
      )}

      {isError && usingFallback && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Showing sample catalog</p>
            <p className="text-xs mt-1">
              {(error as Error)?.message || 'The API is offline, so AuraMart is using built-in products.'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry
          </Button>
        </div>
      )}

      {products.length === 0 && !isLoading && (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-lg">No products found</h3>
            <p className="text-xs text-slate-500">
              We couldn't find any products matching your current filters.
            </p>
          </div>
          <Button size="sm" onClick={handleResetFilters}>
            Clear All Filters
          </Button>
        </div>
      )}

      {products.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-3 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => updateFilter('page', String(page - 1))}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
              <span className="text-xs font-bold text-slate-600 px-3">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => updateFilter('page', String(page + 1))}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
