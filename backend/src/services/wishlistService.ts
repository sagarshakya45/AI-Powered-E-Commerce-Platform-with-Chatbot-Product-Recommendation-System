import { prisma } from '@/lib/prisma';

export class WishlistService {
  static async getOrCreate(userId: string) {
    return prisma.wishlist.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: {
        items: {
          include: { product: { include: { images: true, category: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  static async toggle(userId: string, productId: string) {
    const wishlist = await prisma.wishlist.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    const existing = await prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return { added: false };
    }

    await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
    });
    return { added: true };
  }
}
