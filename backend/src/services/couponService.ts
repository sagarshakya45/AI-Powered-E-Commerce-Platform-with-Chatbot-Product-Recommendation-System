import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/errorHandler';

export type ValidatedCoupon = {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number;
};

export class CouponService {
  static round(amount: number) {
    return Math.round(amount * 100) / 100;
  }

  static async validate(code: string, subtotal: number): Promise<ValidatedCoupon> {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      throw new AppError('Invalid or expired coupon code', 400);
    }
    if (coupon.expiresAt.getTime() < Date.now()) {
      throw new AppError('This coupon has expired', 400);
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      throw new AppError('This coupon has reached its usage limit', 400);
    }
    if (subtotal < coupon.minOrderAmount) {
      throw new AppError(`Minimum order of $${coupon.minOrderAmount} required`, 400);
    }

    const discountAmount =
      coupon.discountType === 'PERCENTAGE'
        ? this.round((subtotal * coupon.discountValue) / 100)
        : this.round(Math.min(subtotal, coupon.discountValue));

    return {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
    };
  }

  static async getAllCoupons() {
    return prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createCoupon(data: {
    code: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    minOrderAmount?: number;
    expiresAt?: Date;
    usageLimit?: number;
  }) {
    const existing = await prisma.coupon.findUnique({
      where: { code: data.code.trim().toUpperCase() },
    });

    if (existing) {
      throw new AppError('Coupon code already exists', 400);
    }

    return prisma.coupon.create({
      data: {
        code: data.code.trim().toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount || 0,
        expiresAt: data.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // default 30 days
        usageLimit: data.usageLimit || 100,
      },
    });
  }

  static async toggleCouponStatus(id: string) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new AppError('Coupon not found', 404);

    return prisma.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive },
    });
  }
}
