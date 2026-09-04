import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/errorHandler';
import { CouponService } from './couponService';
import { CreateOrderInput } from '@/validators/orderValidator';

export class OrderService {
  static async createOrder(userId: string, data: CreateOrderInput) {
    const productIds = data.items.map((item) => item.productId);

    return prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, isActive: true },
      });

      if (products.length !== productIds.length) {
        throw new AppError('One or more products are unavailable. Refresh your cart and try again.', 400);
      }

      const productMap = new Map(products.map((p) => [p.id, p]));
      const orderItems = data.items.map((item) => {
        const product = productMap.get(item.productId)!;
        if (product.stock < item.quantity) {
          throw new AppError(`Not enough stock for ${product.title}`, 400);
        }
        const unitPrice = product.discountPrice ?? product.price;
        return {
          productId: product.id,
          quantity: item.quantity,
          unitPrice,
          totalPrice: CouponService.round(unitPrice * item.quantity),
        };
      });

      const totalAmount = CouponService.round(orderItems.reduce((sum, item) => sum + item.totalPrice, 0));

      let couponId: string | null = null;
      let discountAmount = 0;
      if (data.couponCode) {
        const coupon = await CouponService.validate(data.couponCode, totalAmount);
        couponId = coupon.id;
        discountAmount = coupon.discountAmount;
      }

      const shipping = totalAmount >= 50 ? 0 : 10;
      const finalAmount = CouponService.round(Math.max(0, totalAmount - discountAmount + shipping));

      const savedAddress = await tx.address.create({
        data: {
          userId,
          fullName: data.address.fullName,
          phone: data.address.phone,
          street: data.address.street,
          city: data.address.city,
          state: data.address.state,
          postalCode: data.address.postalCode,
          country: data.address.country,
        },
      });

      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      return tx.order.create({
        data: {
          userId,
          orderNumber,
          addressId: savedAddress.id,
          totalAmount,
          discountAmount,
          finalAmount,
          couponId,
          items: { create: orderItems },
        },
        include: { items: true },
      });
    });
  }

  static async cancelAndRestore(orderId: string) {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order || order.status === 'CANCELLED') return;

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });
    });
  }

  static async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: { select: { id: true, title: true, images: true } } } },
        payment: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
