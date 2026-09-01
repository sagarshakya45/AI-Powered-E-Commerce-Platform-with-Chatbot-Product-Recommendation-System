export class HealthService {
  static getHealthStatus() {
    return {
      status: 'UP',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        database: 'PostgreSQL (Prisma)',
        api: 'Next.js App Router',
      },
    };
  }
}
