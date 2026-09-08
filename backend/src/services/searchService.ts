import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/errorHandler';

export class SearchService {
  static async searchProducts(params: {
    q?: string;
    category?: string;
    categoryId?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      q,
      category,
      categoryId,
      brand,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      sort = 'relevance',
      page = 1,
      limit = 20,
    } = params;

    const where: any = {
      isActive: true,
      isApproved: true,
    };

    const searchTerm = q?.trim();

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { brand: { equals: searchTerm, mode: 'insensitive' } },
        { sku: { equals: searchTerm, mode: 'insensitive' } },
        { category: { name: { contains: searchTerm, mode: 'insensitive' } } },
        {
          AND: searchTerm.split(/\s+/).map((term) => ({
            OR: [
              { title: { contains: term, mode: 'insensitive' } },
              { description: { contains: term, mode: 'insensitive' } },
              { brand: { contains: term, mode: 'insensitive' } },
            ],
          })),
        },
      ];
    }

    if (category) {
      where.category = {
        OR: [
          { slug: category },
          { name: { equals: category, mode: 'insensitive' } },
          { id: category },
        ],
      };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brand) {
      where.brand = { equals: brand, mode: 'insensitive' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (inStock === true) {
      where.stock = { gt: 0 };
    } else if (inStock === false) {
      where.stock = { equals: 0 };
    }

    const skip = (page - 1) * limit;

    let orderBy: any = {};
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'rating_desc':
        orderBy = { reviews: { _count: 'desc' } };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'best_selling':
        orderBy = { salesCount: 'desc' };
        break;
      case 'highest_discount':
        orderBy = { discountPrice: 'desc' };
        break;
      case 'relevance':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { select: { id: true, url: true, isPrimary: true } },
          seller: { select: { id: true, name: true } },
          reviews: { select: { rating: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const formattedProducts = products.map((product) => {
      const reviewCount = product.reviews.length;
      const avgRating = reviewCount > 0
        ? parseFloat((product.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
        : 0;

      const discount = product.discountPrice && product.discountPrice < product.price
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

      const { reviews, ...rest } = product;
      return {
        ...rest,
        avgRating,
        reviewCount,
        discount,
      };
    });

    if (minRating !== undefined) {
      const filtered = formattedProducts.filter((p) => p.avgRating >= minRating);
      return {
        products: filtered,
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      };
    }

    return {
      products: formattedProducts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getAutocomplete(q: string, limit = 10) {
    const searchTerm = q.trim();
    if (!searchTerm) {
      return { products: [], categories: [], brands: [] };
    }

    const [products, categories, brands] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          isApproved: true,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { brand: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          discountPrice: true,
          images: { select: { url: true, isPrimary: true } },
        },
        take: limit,
        orderBy: { title: 'asc' },
      }),
      prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { slug: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true, slug: true },
        take: limit,
      }),
      prisma.product.findMany({
        where: {
          isActive: true,
          isApproved: true,
          brand: { not: null },
        },
        select: { brand: true },
        take: limit * 2,
      }),
    ]);

    const uniqueBrands = Array.from(new Set(
      brands.map((b) => b.brand).filter(Boolean)
    )).slice(0, limit);

    return {
      products: products.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        price: p.price,
        discountPrice: p.discountPrice,
        image: p.images.find((i) => i.isPrimary)?.url || p.images[0]?.url,
        type: 'product' as const,
      })),
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        type: 'category' as const,
      })),
      brands: uniqueBrands.map((b) => ({
        name: b,
        type: 'brand' as const,
      })),
    };
  }

  static async recordSearch(userId: string | null, query: string, resultCount: number) {
    if (!query.trim()) return;
    await prisma.searchEvent.create({
      data: {
        userId: userId || undefined,
        query: query.trim(),
        resultCount,
      },
    });
  }

  static async getSearchSuggestions(q: string) {
    return this.getAutocomplete(q, 8);
  }
}
