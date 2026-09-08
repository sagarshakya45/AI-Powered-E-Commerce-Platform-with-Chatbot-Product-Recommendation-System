import apiClient from './apiClient';
import { Product, ApiResponse, PaginatedResponse } from '../types';export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  brand?: string;
  inStock?: boolean;
  isFeatured?: boolean;
  sort?: string;
}

export const productService = {
  getProducts: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>('/products', {
      params,
    });
    return response.data.data!;
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<{ product: Product }>>(`/products/${slug}`);
    return response.data.data!.product;
  },

  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<{ product: Product }>>('/products', data);
    return response.data.data!.product;
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<{ product: Product }>>(`/products/${id}`, data);
    return response.data.data!.product;
  },

  deleteProduct: async (id: string): Promise<{ id: string; message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ id: string; message: string }>>(`/products/${id}`);
    return response.data.data!;
  },

  recordView: async (productId: string): Promise<void> => {
    await apiClient.post(`/products/${productId}/views`);
  },

  getProductAnalytics: async (productId: string): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(`/products/${productId}/analytics`);
    return response.data.data;
  },

  searchProducts: async (params: {
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
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<any>>('/search', { params });
    return response.data.data;
  },

  getSearchSuggestions: async (q: string): Promise<{
    products: Array<{ id: string; title: string; slug: string; price: number; discountPrice?: number | null; image?: string }>;
    categories: Array<{ id: string; name: string; slug: string }>;
    brands: Array<{ name: string }>;
  }> => {
    const response = await apiClient.get<ApiResponse<any>>('/search/autocomplete', { params: { q } });
    return response.data.data;
  },
};

export default productService;
