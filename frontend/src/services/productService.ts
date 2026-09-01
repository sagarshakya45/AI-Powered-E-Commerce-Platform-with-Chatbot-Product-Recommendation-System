import apiClient from './apiClient';
import { Product, ApiResponse, PaginatedResponse } from '../types';

export interface ProductQueryParams {
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
};

export default productService;
