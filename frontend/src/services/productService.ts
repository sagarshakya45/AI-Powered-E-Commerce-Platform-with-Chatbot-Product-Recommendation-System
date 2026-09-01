import { api } from './api';
import { ApiResponse, Category, Product, ProductsResponseData } from '../types';

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const productService = {
  async getProducts(params: ProductQueryParams = {}): Promise<ApiResponse<ProductsResponseData>> {
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getProductByIdOrSlug(idOrSlug: string): Promise<ApiResponse<{ product: Product }>> {
    const response = await api.get(`/products/${idOrSlug}`);
    return response.data;
  },

  async getCategories(): Promise<ApiResponse<{ categories: Category[] }>> {
    const response = await api.get('/categories');
    return response.data;
  },
};
