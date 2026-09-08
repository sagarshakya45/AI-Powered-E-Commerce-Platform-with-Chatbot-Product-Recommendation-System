import { prisma } from '../lib/prisma';
import { ProductQueryParams, CreateProductInput, UpdateProductInput } from '../validators/productValidator';

export class ProductRepository {
  static async findMany(params: ProductQueryParams) {
    const {
      page,
      limit,
      search,
      category,
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      brand,
      sellerId,
      inStock,
      isFeatured,
      isActive,
      isApproved,
      sort,
    } = params;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    } else {
      where.isActive = true;
    }

    if (isApproved !== undefined) {
      where.isApproved = isApproved;
    } else {
      where.isApproved = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { equals: search, mode: 'insensitive' } },
        { sku: { equals: search, mode: 'insensitive' } },
      ];
    }

    if (brand) {
      const brandCondition = { brand: { equals: brand, mode: 'insensitive' } };
      if (where.OR) {
        where.AND = [{ OR: where.OR }, brandCondition];
        delete where.OR;
      } else {
        where.OR = [brandCondition];
      }
    }

    if (categoryId) {
      where.categoryId = categoryId;
    } else if (category) {
      where.category = {
        OR: [
          { slug: category },
          { name: { equals: category, mode: 'insensitive' } },
          { id: category },
        ],
      };
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
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

    if (sellerId) {
      where.sellerId = sellerId;
    }

    const skip = (page - 1) * limit;

    let orderBy: any = { createdAt: 'desc' };
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'createdAt_asc':
        orderBy = { createdAt: 'asc' };
        break;
      case 'title_asc':
        orderBy = { title: 'asc' };
        break;
      case 'title_desc':
        orderBy = { title: 'desc' };
        break;
      case 'best_selling':
        orderBy = { salesCount: 'desc' };
        break;
      case 'highest_discount':
        orderBy = { discountPrice: 'desc', price: 'asc' };
        break;
      case 'most_popular':
        orderBy = { views: 'desc', salesCount: 'desc' };
        break;
      case 'relevance':
        orderBy = { createdAt: 'desc' };
        break;
      case 'rating_desc':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            select: { id: true, url: true, isPrimary: true },
          },
          seller: {
            select: { id: true, name: true, avatar: true },
          },
          store: {
            select: { id: true, name: true, logo: true, isVerified: true },
          },
          reviews: {
            select: { rating: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    let formattedProducts = products.map((product) => {
      const reviewCount = product.reviews.length;
      const avgRating =
        reviewCount > 0
          ? parseFloat(
              (product.reviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / reviewCount).toFixed(1)
            )
          : 0;

      const discount =
        product.discountPrice && product.discountPrice < product.price
          ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
          : 0;

      const { reviews, ...productWithoutReviews } = product;

      return {
        ...productWithoutReviews,
        avgRating,
        reviewCount,
        discount,
      };
    });

    if (minRating !== undefined) {
      formattedProducts = formattedProducts.filter((p) => p.avgRating >= minRating);
    }

    if (sort === 'rating_desc') {
      formattedProducts.sort((a, b) => b.avgRating - a.avgRating);
    }

    return {
      products: formattedProducts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async findBySlugOrId(identifier: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true, description: true, parentId: true },
        },
        images: true,
        seller: {
          select: { id: true, name: true, avatar: true },
        },
        store: {
          select: { id: true, name: true, logo: true, description: true, isVerified: true },
        },
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) return null;

    const reviewCount = product.reviews.length;
    const avgRating =
      reviewCount > 0
        ? parseFloat(
            (product.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
          )
        : 0;

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    product.reviews.forEach((r) => {
      ratingDistribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
    });

    return {
      ...product,
      avgRating,
      reviewCount,
      ratingDistribution,
    };
  }

  static async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        seller: { select: { id: true, name: true, avatar: true } },
        store: { select: { id: true, name: true, logo: true } },
      },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        seller: { select: { id: true, name: true, avatar: true } },
        store: { select: { id: true, name: true, logo: true } },
      },
    });
  }

  static async findSellerProducts(sellerId: string) {
    return prisma.product.findMany({
      where: { sellerId },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { select: { id: true, url: true, isPrimary: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async create(input: CreateProductInput, generatedSlug: string, sellerId?: string) {
    const {
      images,
      title,
      description,
      price,
      discountPrice,
      stock,
      categoryId,
      brand,
      sku,
      attributes,
      isFeatured,
      isActive,
    } = input;

    return prisma.product.create({
      data: {
        title,
        description,
        price,
        discountPrice,
        stock,
        isFeatured,
        isActive,
        slug: generatedSlug,
        brand,
        sku,
        attributes,
        category: {
          connect: { id: categoryId },
        },
        ...(sellerId ? { seller: { connect: { id: sellerId } } } : {}),
        images: images?.length
          ? {
              create: images.map((img, index) => ({
                url: img.url,
                publicId: img.publicId || `img-${Date.now()}-${index}`,
                isPrimary: img.isPrimary !== undefined ? img.isPrimary : index === 0,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
        seller: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  static async update(id: string, input: UpdateProductInput, sellerId?: string) {
    const { images, categoryId, ...data } = input;

    const updateData: any = { ...data };

    if (categoryId) {
      updateData.category = { connect: { id: categoryId } };
    }

    if (images?.length) {
      updateData.images = {
        deleteMany: {},
        create: images.map((img, index) => ({
          url: img.url,
          publicId: img.publicId || `img-${Date.now()}-${index}`,
          isPrimary: img.isPrimary !== undefined ? img.isPrimary : index === 0,
        })),
      };
    }

    const where: any = { id };
    if (sellerId) {
      where.sellerId = sellerId;
    }

    return prisma.product.update({
      where,
      data: updateData,
      include: {
        category: true,
        images: true,
        seller: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  static async delete(id: string, sellerId?: string) {
    const where: any = { id };
    if (sellerId) {
      where.sellerId = sellerId;
    }

    return prisma.product.delete({
      where,
    });
  }

  static async approve(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  static async setCountViews(productId: string) {
    return prisma.product.update({
      where: { id: productId },
      data: { views: { increment: 1 } },
    });
  }

  static async incrementSalesCount(productId: string, quantity: number) {
    return prisma.product.update({
      where: { id: productId },
      data: { salesCount: { increment: quantity } },
    });
  }
}
