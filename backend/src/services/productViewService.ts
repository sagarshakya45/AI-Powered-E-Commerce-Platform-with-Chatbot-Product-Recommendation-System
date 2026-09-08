import { prisma } from '@/lib/prisma';

export class ProductViewService {
  static async recordView(productId: string, userId?: string, ipAddress?: string) {
    await prisma.$transaction(async (tx) => {
      await tx.productView.create({
        data: {
          productId,
          userId,
          ipAddress,
        },
      });

      await tx.product.update({
        where: { id: productId },
        data: { views: { increment: 1 } },
      });
    });
  }

  static async getViewCount(productId: string) {
    return prisma.productView.count({
      where: { productId },
    });
  }
}
