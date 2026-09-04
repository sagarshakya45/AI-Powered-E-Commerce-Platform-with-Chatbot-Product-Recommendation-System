import { prisma } from '@/lib/prisma';
import { AppError } from '@/utils/errorHandler';

export class SalesmanService {
  static async applyForSalesman(userId: string, data: { businessName: string; phoneNumber: string; reason: string }) {
    const existing = await prisma.salesmanApplication.findUnique({
      where: { userId },
    });

    if (existing && existing.status === 'PENDING') {
      throw new AppError('You already have a pending salesman application.', 400);
    }

    if (existing && existing.status === 'APPROVED') {
      throw new AppError('You are already an approved salesman!', 400);
    }

    if (existing) {
      // Re-apply if previously rejected
      return prisma.salesmanApplication.update({
        where: { userId },
        data: {
          businessName: data.businessName.trim(),
          phoneNumber: data.phoneNumber.trim(),
          reason: data.reason.trim(),
          status: 'PENDING',
        },
      });
    }

    return prisma.salesmanApplication.create({
      data: {
        userId,
        businessName: data.businessName.trim(),
        phoneNumber: data.phoneNumber.trim(),
        reason: data.reason.trim(),
      },
    });
  }

  static async getApplicationStatus(userId: string) {
    return prisma.salesmanApplication.findUnique({
      where: { userId },
    });
  }

  static async getAllApplications() {
    return prisma.salesmanApplication.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async reviewApplication(applicationId: string, status: 'APPROVED' | 'REJECTED') {
    const app = await prisma.salesmanApplication.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!app) {
      throw new AppError('Application not found', 404);
    }

    // Update Application Status
    const updatedApp = await prisma.salesmanApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    // If Approved, update user role to SALESMAN
    if (status === 'APPROVED') {
      await prisma.user.update({
        where: { id: app.userId },
        data: { role: 'SALESMAN' },
      });
    }

    return updatedApp;
  }
}
