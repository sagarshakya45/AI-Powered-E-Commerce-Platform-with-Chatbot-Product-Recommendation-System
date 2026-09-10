import { prisma } from '../lib/prisma';
import { AppError } from '../utils/errorHandler';

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
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true, isActive: true },
    });

    if (!product || !product.isActive) {
      throw new AppError('Product not found or unavailable', 404);
    }

    if (product.stock < quantity) {
      throw new AppError(`Only ${product.stock} items available in stock`, 400);
    }

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
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        throw new AppError(`Only ${product.stock} items available in stock`, 400);
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
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

    // Preload all existing cart items in one query (fixes N+1: was 2N round trips, now N+1)
    const existingItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      select: { id: true, productId: true, quantity: true },
    });
    const existingMap = new Map(existingItems.map((item) => [item.productId, item]));

    for (const item of items) {
      const existing = existingMap.get(item.productId);
      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
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
