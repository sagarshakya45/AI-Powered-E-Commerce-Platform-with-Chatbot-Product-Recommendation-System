import { ProductRepository } from '../repositories/productRepository';
import { ProductQueryParams, CreateProductInput, UpdateProductInput } from '../validators/productValidator';
import { AppError } from '../utils/errorHandler';

export class ProductService {
  private static generateSlug(title: string): string {
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

  static async createProduct(input: CreateProductInput) {
    const slug = this.generateSlug(input.title);

    // Verify slug uniqueness
    const existing = await ProductRepository.findBySlug(slug);
    if (existing) {
      throw new AppError('A product with this generated slug already exists', 409);
    }

    return ProductRepository.create(input, slug);
  }

  static async updateProduct(id: string, input: UpdateProductInput) {
    const existing = await ProductRepository.findById(id);
    if (!existing) {
      throw new AppError(`Product with ID '${id}' not found`, 404);
    }

    return ProductRepository.update(id, input);
  }

  static async deleteProduct(id: string) {
    const existing = await ProductRepository.findById(id);
    if (!existing) {
      throw new AppError(`Product with ID '${id}' not found`, 404);
    }

    await ProductRepository.delete(id);
    return { id, message: 'Product successfully deleted' };
  }
}
