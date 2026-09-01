import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/utils/auth';

export const dynamic = 'force-dynamic';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : null;
    const isFeatured = searchParams.get('isFeatured') === 'true' ? true : undefined;
    const sortBy = searchParams.get('sortBy') || 'createdAt_desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (minPrice !== null || maxPrice !== null) {
      where.price = {};
      if (minPrice !== null) where.price.gte = minPrice;
      if (maxPrice !== null) where.price.lte = maxPrice;
    }

    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'price_asc') orderBy = { price: 'asc' };
    if (sortBy === 'price_desc') orderBy = { price: 'desc' };
    if (sortBy === 'title_asc') orderBy = { title: 'asc' };
    if (sortBy === 'title_desc') orderBy = { title: 'desc' };
    if (sortBy === 'createdAt_asc') orderBy = { createdAt: 'asc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { select: { id: true, url: true, isPrimary: true } },
          reviews: { select: { rating: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // Calculate average rating and format images
    const formattedProducts = products.map((product) => {
      const avgRating =
        product.reviews.length > 0
          ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
          : 0;

      return {
        ...product,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: product.reviews.length,
      };
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Products fetched successfully',
      data: {
        products: formattedProducts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { success: false, statusCode: 500, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { error, status } = await requireAdmin(req);
    if (error) {
      return NextResponse.json({ success: false, statusCode: status, message: error }, { status });
    }

    const body = await req.json();
    const { title, description, price, discountPrice, stock, categoryId, isFeatured, images } = body;

    if (!title || !description || price === undefined || !categoryId) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: 'Title, description, price, and categoryId are required' },
        { status: 400 }
      );
    }

    const categoryExists = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: 'Invalid categoryId provided' },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title);
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    const product = await prisma.product.create({
      data: {
        title,
        slug: uniqueSlug,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: stock ? parseInt(stock, 10) : 0,
        isFeatured: Boolean(isFeatured),
        categoryId,
        images: {
          create: Array.isArray(images) && images.length > 0
            ? images.map((img, idx) => ({
                url: typeof img === 'string' ? img : img.url,
                publicId: typeof img === 'object' && img.publicId ? img.publicId : `img-${Date.now()}-${idx}`,
                isPrimary: idx === 0,
              }))
            : [],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: 'Product created successfully',
        data: { product },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { success: false, statusCode: 500, message: 'Failed to create product' },
      { status: 500 }
    );
  }
}
