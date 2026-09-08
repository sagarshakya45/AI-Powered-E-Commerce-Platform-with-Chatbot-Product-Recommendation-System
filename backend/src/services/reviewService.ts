import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/errorHandler';

export class ReviewService {
  static async getReviews(productId: string) {
    const reviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
      : 0;

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      ratingDistribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
    });

    return {
      reviews,
      totalReviews,
      avgRating: Number(avgRating.toFixed(1)),
      ratingDistribution,
    };
  }

  static async canReview(userId: string, productId: string): Promise<boolean> {
    const purchasedOrderItem = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'DELIVERED',
        },
      },
    });
    return !!purchasedOrderItem;
  }

  static async addReview(
    userId: string,
    productId: string,
    rating: number,
    comment: string,
    title?: string
  ) {
    const existing = await prisma.review.findUnique({
      where: {
        productId_userId: { productId, userId },
      },
    });

    if (existing) {
      throw new AppError('You have already reviewed this product', 400);
    }

    const canReview = await this.canReview(userId, productId);
    if (!canReview) {
      throw new AppError('You can only review products you have purchased and received', 403);
    }

    const review = await prisma.review.create({
      data: {
        rating,
        title,
        comment,
        productId,
        userId,
        isVerifiedPurchase: true,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    return review;
  }

  static async updateReview(reviewId: string, userId: string, data: { rating?: number; title?: string; comment?: string }) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.userId !== userId) {
      throw new AppError('You can only edit your own reviews', 403);
    }

    return prisma.review.update({
      where: { id: reviewId },
      data,
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  static async deleteReview(reviewId: string, userId: string) {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new AppError('Review not found', 404);
    }

    if (review.userId !== userId) {
      throw new AppError('You can only delete your own reviews', 403);
    }

    return prisma.review.delete({
      where: { id: reviewId },
    });
  }

  static async moderateReview(reviewId: string, isApproved: boolean) {
    return prisma.review.update({
      where: { id: reviewId },
      data: { isApproved },
    });
  }
}
