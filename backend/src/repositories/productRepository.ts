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
      inStock,
      isFeatured,
      sort,
    } = params;

    const where: any = { isActive: true };

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Brand filter
    if (brand) {
      const brandCondition = {
        OR: [
          { title: { contains: brand, mode: 'insensitive' } },
          { description: { contains: brand, mode: 'insensitive' } },
        ],
      };
      if (where.OR) {
        where.AND = [{ OR: where.OR }, brandCondition];
        delete where.OR;
      } else {
        where.OR = brandCondition.OR;
      }
    }

    // Category filter
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

    // Featured filter
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Stock filter
    if (inStock === true) {
      where.stock = { gt: 0 };
    } else if (inStock === false) {
      where.stock = { equals: 0 };
    }

    // Sorting
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
      case 'createdAt_desc':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const skip = (page - 1) * limit;

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

    // Format rating metrics & filter by minRating if requested
    let formattedProducts = products.map((product) => {
      const reviewCount = product.reviews.length;
      const avgRating =
        reviewCount > 0
          ? parseFloat((product.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
          : 4.8;

      const { reviews, ...productWithoutReviews } = product;

      return {
        ...productWithoutReviews,
        avgRating,
        reviewCount,
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
          select: { id: true, name: true, slug: true, description: true },
        },
        images: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) return null;

    const reviewCount = product.reviews.length;
    const avgRating =
      reviewCount > 0
        ? parseFloat((product.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
        : 4.8;

    return {
      ...product,
      avgRating,
      reviewCount,
    };
  }

  static async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
    });
  }

  static async create(input: CreateProductInput, generatedSlug: string) {
    const { images, title, description, price, discountPrice, stock, categoryId, isFeatured, isActive } = input;

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
        category: {
          connect: { id: categoryId },
        },
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
      },
    });
  }

  static async update(id: string, input: UpdateProductInput) {
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

    return prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        images: true,
      },
    });
  }

  static async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
