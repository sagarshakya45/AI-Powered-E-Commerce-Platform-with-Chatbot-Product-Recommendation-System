import { useQuery } from '@tanstack/react-query';
import { productService, ProductQueryParams } from '../services/productService';
import { categoryService } from '../services/categoryService';

export const useGetProducts = (params: ProductQueryParams = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetProductDetails = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    staleTime: 1000 * 60 * 30,
  });
};

export const useGetSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['search-suggestions', query],
    queryFn: () => productService.getSearchSuggestions(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 2,
  });
};

export const useSearchProducts = (params: {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean | null;
  sort?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => productService.searchProducts(params),
    enabled: true,
  });
};
