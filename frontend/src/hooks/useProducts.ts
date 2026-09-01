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
