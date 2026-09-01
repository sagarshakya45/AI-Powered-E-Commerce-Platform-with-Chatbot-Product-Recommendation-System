import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, ShoppingBag, ArrowUpDown, ChevronLeft, ChevronRight, PackageX, Sparkles } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

export const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters state from URL query
  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('categoryId') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt_desc';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Temporary filter inputs
  const [searchInput, setSearchInput] = useState(search);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      if (res.success) {
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search,
        categoryId: selectedCategory,
        sortBy,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        page,
        limit: 9,
      };

      const res = await productService.getProducts(params);
      if (res.success) {
        setProducts(res.data.products || []);
        setPagination(res.data.pagination || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const updateQueryParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    // Reset to page 1 on filter change if not navigating pagination
    if (!newParams.hasOwnProperty('page')) {
      params.set('page', '1');
    }
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQueryParams({ search: searchInput });
  };

  const handleCategorySelect = (catId) => {
    updateQueryParams({ categoryId: catId === selectedCategory ? '' : catId });
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    updateQueryParams({ minPrice: minPriceInput, maxPrice: maxPriceInput });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams({});
  };

  return (
    <div className="py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold backdrop-blur-sm border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Top Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Explore Premium Products
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Browse our curated catalog of electronics, fashion, and lifestyle items crafted with precision and quality.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Filter className="w-4 h-4 text-brand-600" />
                <span>Filter Catalog</span>
              </h2>
              {(selectedCategory || search || minPrice || maxPrice) && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-brand-600 font-semibold hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Search Filter */}
            <form onSubmit={handleSearchSubmit} className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Keyword..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </form>

            {/* Categories Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Categories</label>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategorySelect('')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === ''
                      ? 'bg-brand-50 text-brand-600 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-brand-50 text-brand-600 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {cat._count?.products !== undefined && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {cat._count.products}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <form onSubmit={handlePriceApply} className="space-y-3">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Price Range ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl shadow transition-all"
              >
                Apply Range
              </button>
            </form>
          </div>
        </aside>

        {/* Products Grid & Toolbar */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Bar: Count & Sorting */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm gap-4">
            <p className="text-sm text-slate-600 font-medium">
              Showing <span className="font-bold text-slate-900">{products.length}</span> of{' '}
              <span className="font-bold text-slate-900">{pagination.total}</span> products
            </p>

            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => updateQueryParams({ sortBy: e.target.value })}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
              >
                <option value="createdAt_desc">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="title_asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4 animate-pulse">
                  <div className="w-full h-48 bg-slate-200 rounded-xl"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-8 bg-slate-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center space-y-2">
              <p className="font-bold">Unable to load catalog</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No products found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                We couldn't find any products matching your selected filter criteria. Try adjusting your search query or filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const primaryImage = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
                const discountPct = product.discountPrice
                  ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                  : null;

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      <img
                        src={primaryImage}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {discountPct && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
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

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-brand-600 tracking-wide uppercase">
                          {product.category?.name || 'General'}
                        </span>
                        <Link
                          to={`/products/${product.id}`}
                          className="block font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1 text-base"
                        >
                          {product.title}
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Rating & Pricing */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-extrabold text-slate-900">
                              ${product.discountPrice ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
                            </span>
                            {product.discountPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-bold">{product.avgRating || '4.8'}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        to={`/products/${product.id}`}
                        className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-brand-600 shadow-md transition-all group-hover:bg-brand-600"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => updateQueryParams({ page: page - 1 })}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-slate-700 px-4">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => updateQueryParams({ page: page + 1 })}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
