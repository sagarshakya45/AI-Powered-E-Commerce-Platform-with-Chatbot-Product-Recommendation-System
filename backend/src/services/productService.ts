import { prisma } from '../lib/prisma';
import { ProductRepository } from '../repositories/productRepository';
import { ProductQueryParams, CreateProductInput, UpdateProductInput } from '../validators/productValidator';
import { AppError } from '../utils/errorHandler';

export class ProductService {
  static generateSlug(title: string): string {
    const cleanTitle = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
    return `${cleanTitle}-${Date.now().toString().slice(-6)}`;
  }

  static async getProducts(params: ProductQueryParams) {
    return ProductRepository.findMany(params);
  }

  static async getProductBySlugOrId(identifier: string) {
    const product = await ProductRepository.findBySlugOrId(identifier);
    if (!product) {
      throw new AppError(`Product with identifier '${identifier}' not found`, 404);
    }
    return product;
  }

  static async createProduct(input: CreateProductInput, sellerId?: string) {
    const slug = this.generateSlug(input.title);

    const existing = await ProductRepository.findBySlug(slug);
    if (existing) {
      throw new AppError('A product with this generated slug already exists', 409);
    }

    return ProductRepository.create(input, slug, sellerId);
  }

  static async updateProduct(identifier: string, input: UpdateProductInput, sellerId?: string) {
    const existing = await ProductRepository.findBySlugOrId(identifier);
    if (!existing) {
      throw new AppError(`Product '${identifier}' not found`, 404);
    }

    if (sellerId && existing.sellerId && existing.sellerId !== sellerId) {
      throw new AppError('You can only edit your own products', 403);
    }

    return ProductRepository.update(existing.id, input, sellerId);
  }

  static async deleteProduct(identifier: string, sellerId?: string) {
    const existing = await ProductRepository.findBySlugOrId(identifier);
    if (!existing) {
      throw new AppError(`Product '${identifier}' not found`, 404);
    }

    if (sellerId && existing.sellerId && existing.sellerId !== sellerId) {
      throw new AppError('You can only delete your own products', 403);
    }

    await ProductRepository.delete(existing.id, sellerId);
    return { id: existing.id, message: 'Product successfully deleted' };
  }

  static async getSellerProducts(sellerId: string) {
    return ProductRepository.findSellerProducts(sellerId);
  }

  static async approveProduct(id: string) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return ProductRepository.approve(id);
  }

  static async rejectProduct(id: string) {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return prisma.product.update({
      where: { id },
      data: { isApproved: false, isActive: false },
    });
  }

  static async getAttributeFilters(categoryId: string) {
    const products = await prisma.product.findMany({
      where: { categoryId, isActive: true, isApproved: true },
      select: { attributes: true },
    });

    const attributeMap: Record<string, Set<string>> = {};

    for (const product of products) {
      if (product.attributes) {
        const attrs = product.attributes as Record<string, any>;
        for (const key of Object.keys(attrs)) {
          if (!attributeMap[key]) {
            attributeMap[key] = new Set();
          }
          const value = attrs[key];
          if (typeof value === 'string') {
            attributeMap[key].add(value);
          } else if (Array.isArray(value)) {
            value.forEach((v) => attributeMap[key].add(String(v)));
          }
        }
      }
    }

    const result: Record<string, string[]> = {};
    for (const key of Object.keys(attributeMap)) {
      result[key] = Array.from(attributeMap[key]);
    }
    return result;
  }
}
