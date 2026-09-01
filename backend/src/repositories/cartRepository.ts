import { prisma } from '../lib/prisma';

export class CartRepository {
  static async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { select: { id: true, url: true, isPrimary: true } },
                category: { select: { id: true, name: true, slug: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { select: { id: true, url: true, isPrimary: true } },
                  category: { select: { id: true, name: true, slug: true } },
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  static async addItem(userId: string, productId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getOrCreateCart(userId);
  }

  static async updateQuantity(userId: string, productId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          productId,
        },
      });
    } else {
      await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
        update: { quantity },
        create: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    return this.getOrCreateCart(userId);
  }

  static async removeItem(userId: string, productId: string) {
    const cart = await this.getOrCreateCart(userId);

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    return this.getOrCreateCart(userId);
  }

  static async syncItems(userId: string, items: { productId: string; quantity: number }[]) {
    const cart = await this.getOrCreateCart(userId);

    for (const item of items) {
      await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: item.productId,
          },
        },
        update: {
          quantity: item.quantity,
        },
        create: {
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    }

    return this.getOrCreateCart(userId);
  }

  static async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    return this.getOrCreateCart(userId);
  }
}
