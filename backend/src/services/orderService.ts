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
          sellerId: product.sellerId || undefined,
        };
      });

      const totalAmount = CouponService.round(orderItems.reduce((sum, item) => sum + item.totalPrice, 0));

      let couponId: string | null = null;
      let discountAmount = 0;
      if (data.couponCode) {
        const coupon = await CouponService.validate(data.couponCode, totalAmount);
        couponId = coupon.id;
        discountAmount = coupon.discountAmount;

        if (couponId) {
          await tx.coupon.update({
            where: { id: couponId },
            data: { usedCount: { increment: 1 } },
          });
        }
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

      const order = await tx.order.create({
        data: {
          userId,
          orderNumber,
          addressId: savedAddress.id,
          totalAmount,
          discountAmount,
          finalAmount,
          couponId,
          paymentMethod: data.paymentMethod || 'card',
          items: { create: orderItems },
        },
        include: { items: true },
      });

      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: finalAmount,
          paymentMethod: data.paymentMethod || 'card',
          status: 'PENDING',
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          cart: { userId },
        },
      });

      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { salesCount: { increment: item.quantity } },
        });
      }

      return order;
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
        items: {
          include: {
            product: {
              select: { id: true, title: true, images: { select: { id: true, url: true, isPrimary: true } } },
            },
            seller: { select: { id: true, name: true } },
          },
        },
        payment: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getOrderById(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: { select: { id: true, url: true, isPrimary: true } },
                price: true,
                discountPrice: true,
              },
            },
            seller: { select: { id: true, name: true, avatar: true } },
          },
        },
        payment: true,
        address: true,
        coupon: true,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  static async getSellerOrders(sellerId: string) {
    const orderItems = await prisma.orderItem.findMany({
      where: { sellerId },
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            address: true,
            payment: true,
            coupon: true,
          },
        },
        product: {
          select: { id: true, title: true, images: { select: { id: true, url: true, isPrimary: true } } },
        },
      },
      orderBy: { order: { createdAt: 'desc' } },
    });

    const ordersMap = new Map<string, any>();
    for (const item of orderItems) {
      const orderId = item.order.id;
      if (!ordersMap.has(orderId)) {
        ordersMap.set(orderId, {
          ...item.order,
          items: [],
        });
      }
      ordersMap.get(orderId)!.items.push(item);
    }

    return Array.from(ordersMap.values());
  }
}
