import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useGetProducts, useGetCategories } from '../hooks/useProducts';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ProductCard } from '../components/products/ProductCard';
import { LOCAL_PRODUCTS } from '../data/catalog';
import { Product } from '../types';

export const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data: productsData, isLoading, isError, error, refetch } = useGetProducts({
    page,
    limit,
    search: search || undefined,
    category: selectedCategory || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minRating: minRating ? Number(minRating) : undefined,
    inStock: inStockOnly ? true : undefined,
    sort: sortBy,
  });

  const { data: categories = [] } = useGetCategories();

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    const sort = searchParams.get('sort');
    if (sort) setSortBy(sort);
    setPage(1);
  }, [searchParams]);

  const products = useMemo(() => {
    const fromApi = productsData?.products || [];
    if (fromApi.length > 0) return fromApi;

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
  }, [productsData?.products, search, selectedCategory, inStockOnly, minPrice, maxPrice, minRating]);

  const usingFallback = (productsData?.products || []).length === 0;
  const totalPages = usingFallback ? 1 : productsData?.totalPages || 1;
  const totalProducts = usingFallback ? products.length : productsData?.total || 0;

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setInStockOnly(false);
    setSortBy('createdAt_desc');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Shop all products</h1>
        <p className="text-sm text-slate-500 mt-1">Filter by category, price, and rating.</p>
      </div>

      {/* Control Bar & Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-2">
            <Input
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
            >
              <option value="createdAt_desc">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="title_asc">Title: A-Z</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
            <div className="flex items-center space-x-1 font-semibold text-slate-700">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Price Inputs */}
            <div className="flex items-center space-x-1">
              <input
                type="number"
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                className="w-20 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max $"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                className="w-20 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
              />
            </div>

            {/* Rating Filter */}
            <select
              value={minRating}
              onChange={(e) => { setMinRating(e.target.value); setPage(1); }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer"
            >
              <option value="">Min Rating</option>
              <option value="4.5">★ 4.5+</option>
              <option value="4.0">★ 4.0+</option>
              <option value="3.0">★ 3.0+</option>
            </select>

            {/* Stock Toggle */}
            <label className="flex items-center space-x-1.5 cursor-pointer bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => { setInStockOnly(e.target.checked); setPage(1); }}
                className="accent-brand-600 rounded cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          <Button variant="outline" size="sm" onClick={handleResetFilters} className="text-xs">
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Results Header */}
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

      {/* Empty State */}
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

      {/* Product Catalog Grid */}
      {products.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-3 pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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
