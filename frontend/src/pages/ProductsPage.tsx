import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Star, Sparkles, Filter, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useGetProducts, useGetCategories } from '../hooks/useProducts';
import { useCartStore } from '../stores/useCartStore';
import { formatCurrency, calculateDiscountPercentage } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export const ProductsPage: React.FC = () => {
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
  const addItem = useCartStore((state) => state.addItem);

  const products = productsData?.products || [];
  const totalPages = productsData?.totalPages || 1;
  const totalProducts = productsData?.total || 0;

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
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <Badge variant="brand" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
            AuraMart Store
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Explore Premium Products
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Discover cutting-edge tech, fashion, and home products backed by our Next.js & PostgreSQL architecture.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
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
      {!isLoading && !isError && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Showing {products.length} of {totalProducts} products</span>
          <span>Page {page} of {totalPages}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4 animate-pulse">
              <div className="w-full h-52 bg-slate-200 rounded-xl"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              <div className="h-10 bg-slate-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-rose-900">Failed to load products</h3>
            <p className="text-xs text-rose-600 mt-1">
              {(error as Error)?.message || 'Ensure Next.js backend server is running on port 5000.'}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && products.length === 0 && (
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
      {!isLoading && !isError && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const primaryImg =
                product.images?.find((i) => i.isPrimary)?.url ||
                product.images?.[0]?.url ||
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
              const discountPct = calculateDiscountPercentage(product.price, product.discountPrice);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={primaryImg}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {discountPct && (
                      <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        -{discountPct}% OFF
                      </span>
                    )}
                    {product.isFeatured && (
                      <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <Badge variant="brand">{product.category?.name || 'Catalog'}</Badge>
                      <Link
                        to={`/products/${product.slug || product.id}`}
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
                      <Link to={`/products/${product.slug || product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs">
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
