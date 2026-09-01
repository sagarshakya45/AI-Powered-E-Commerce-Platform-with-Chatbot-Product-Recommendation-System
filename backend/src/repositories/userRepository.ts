import { prisma } from '../lib/prisma';

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true },
    });
  }

  static async create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({ data });
  }
}
