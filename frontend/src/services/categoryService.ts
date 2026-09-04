import apiClient from './apiClient';
import { LOCAL_CATEGORIES } from '../data/catalog';
import { Category, ApiResponse } from '../types';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<ApiResponse<{ categories: Category[] }>>('/categories');
      return response.data.data?.categories || [];
    } catch (error) {
      // Fallback fallback default categories if API endpoint is being initialized
      return LOCAL_CATEGORIES;
    }
  },
};

export default categoryService;
