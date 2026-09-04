import { prisma } from '@/lib/prisma';

export class ReviewService {
  static async getReviews(productId: string) {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : 0;

    return {
      reviews,
      totalReviews,
      avgRating: Number(avgRating.toFixed(1))
    };
  }

  static async addReview(userId: string, productId: string, rating: number, comment: string) {
    const existing = await prisma.review.findUnique({
      where: {
        productId_userId: { productId, userId }
      }
    });

    if (existing) {
      throw new Error('You have already reviewed this product');
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId,
        userId
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      }
    });

    return review;
  }
}
