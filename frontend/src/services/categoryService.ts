import apiClient from './apiClient';
import { Category, ApiResponse } from '../types';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<ApiResponse<{ categories: Category[] }>>('/v1/categories');
      return response.data.data?.categories || [];
    } catch (error) {
      // Fallback fallback default categories if API endpoint is being initialized
      return [
        { id: '1', name: 'Electronics', slug: 'electronics', description: 'Gadgets and gear' },
        { id: '2', name: 'Fashion & Apparel', slug: 'fashion', description: 'Modern clothing' },
        { id: '3', name: 'Home & Living', slug: 'home-living', description: 'Furniture & decor' },
        { id: '4', name: 'Accessories', slug: 'accessories', description: 'Watches & bags' },
      ];
    }
  },
};

export default categoryService;
