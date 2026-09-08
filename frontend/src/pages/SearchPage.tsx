import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle, SlidersHorizontal, Search } from 'lucide-react';
import { useSearchProducts, useGetCategories } from '../hooks/useProducts';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/products/ProductCard';
import { BackButton } from '../components/common/BackButton';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const q = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedBrand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const sortBy = searchParams.get('sort') || 'relevance';
  const page = Number(searchParams.get('page')) || 1;
  const limit = 20;

  const { data, isLoading, isError, error, refetch } = useSearchProducts({
    q: q || undefined,
    category: selectedCategory || undefined,
    brand: selectedBrand || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minRating: minRating ? Number(minRating) : undefined,
    inStock: inStockOnly ? true : undefined,
    sort: sortBy,
    page,
    limit,
  });

  const { data: categories = [] } = useGetCategories();

  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = data?.totalPages || 1;

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

  const handleResetFilters = () => {
    const newParams = new URLSearchParams();
    if (q) newParams.set('q', q);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BackButton label="Back" />
        <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-600">
            {q ? (
              <span>Results for: <span className="text-slate-900">"{q}"</span></span>
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
            className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
          >
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Top Rated</option>
            <option value="best_selling">Best Selling</option>
            <option value="newest">Newest</option>
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
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
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
                className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
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
                onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
                className="accent-violet-600 rounded cursor-pointer"
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

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((idx) => (
            <div key={idx} className="h-64 bg-white border border-slate-200 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Search temporarily unavailable</p>
            <p className="text-xs mt-1">
              {(error as Error)?.message || 'Unable to load search results. Please try again.'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry
          </Button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No products found</h3>
          <p className="text-xs text-slate-500">
            We couldn't find any products matching your search. Try adjusting your filters.
          </p>
          <Button size="sm" onClick={handleResetFilters}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((product: any) => (
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
