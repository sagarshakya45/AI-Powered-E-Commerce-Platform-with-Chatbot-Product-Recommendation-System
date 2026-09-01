import { useQuery } from '@tanstack/react-query';
import { productService, ProductQueryParams } from '../services/productService';

export const useGetProducts = (params: ProductQueryParams = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  });
};

export const useGetProductDetails = (idOrSlug: string) => {
  return useQuery({
    queryKey: ['product', idOrSlug],
    queryFn: () => productService.getProductByIdOrSlug(idOrSlug),
    enabled: Boolean(idOrSlug),
  });
};

export const useGetCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  });
};
