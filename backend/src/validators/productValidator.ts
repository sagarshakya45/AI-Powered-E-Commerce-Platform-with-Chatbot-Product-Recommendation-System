import { z } from 'zod';

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  brand: z.string().optional(),
  sellerId: z.string().optional(),
  inStock: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
  isFeatured: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
  isActive: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
  isApproved: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
  sort: z.enum([
    'price_asc',
    'price_desc',
    'createdAt_desc',
    'createdAt_asc',
    'title_asc',
    'title_desc',
    'rating_desc',
    'relevance',
    'best_selling',
    'highest_discount',
    'most_popular',
  ]).default('createdAt_desc'),
});

export type ProductQueryParams = z.infer<typeof productQuerySchema>;

export const createProductSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  price: z.number().positive('Price must be greater than 0'),
  discountPrice: z.number().positive('Discount price must be greater than 0').optional().nullable(),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  categoryId: z.string().min(1, 'Category ID is required'),
  brand: z.string().optional(),
  sku: z.string().optional(),
  attributes: z.record(z.any()).optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  images: z
    .array(
      z.object({
        url: z.string().url('Invalid image URL'),
        publicId: z.string().optional(),
        isPrimary: z.boolean().optional(),
      })
    )
    .optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
