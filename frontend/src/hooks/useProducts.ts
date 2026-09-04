import { useQuery } from '@tanstack/react-query';
import { productService, ProductQueryParams } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { LOCAL_PRODUCTS } from '../data/catalog';

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
    queryFn: async () => {
      try {
        return await productService.getProductBySlug(slug);
      } catch (err: any) {
        if (err.response?.status === 404) {
          const local = LOCAL_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
          if (local) return local;
        }
        throw err;
      }
    },
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
