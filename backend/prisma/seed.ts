import { PrismaClient, Role, OrderStatus, PaymentStatus, DiscountType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding development database...');

  // 1. Create Users
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@auramart.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@auramart.com',
      password: hashedPassword,
      role: Role.ADMIN,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@auramart.com' },
    update: {},
    create: {
      name: 'Jane Doe',
      email: 'customer@auramart.com',
      password: hashedPassword,
      role: Role.CUSTOMER,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
  });

  // 2. Create Categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Cutting-edge gadgets, audio gear, and personal tech items.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    },
  });

  const fashion = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      name: 'Fashion & Apparel',
      slug: 'fashion',
      description: 'Modern clothing, shoes, and luxury lifestyle wear.',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80',
    },
  });

  const homeLiving = await prisma.category.upsert({
    where: { slug: 'home-living' },
    update: {},
    create: {
      name: 'Home & Living',
      slug: 'home-living',
      description: 'Elegant home decor, minimalist furniture, and lighting.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    },
  });

  const accessories = await prisma.category.upsert({
    where: { slug: 'accessories' },
    update: {},
    create: {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Watches, bags, sunglasses, and personal accessories.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    },
  });

  // 3. Create Products
  const productsData = [
    {
      title: 'Wireless Noise-Canceling Headphones',
      slug: 'wireless-noise-canceling-headphones',
      description: 'Immerse yourself in high-fidelity audio with spatial sound, active noise cancellation, and 30-hour battery life.',
      price: 299.99,
      discountPrice: 249.99,
      stock: 45,
      isFeatured: true,
      categoryId: electronics.id,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Minimalist Smart Watch Series 5',
      slug: 'minimalist-smart-watch-series-5',
      description: 'Sleek aluminum casing with OLED retina display, health tracking, heart rate monitoring, and GPS integration.',
      price: 399.00,
      discountPrice: 349.00,
      stock: 30,
      isFeatured: true,
      categoryId: accessories.id,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Ergonomic Premium Leather Chair',
      slug: 'ergonomic-premium-leather-chair',
      description: 'Crafted with genuine top-grain leather and lumbar support, designed for all-day focus and ergonomic perfection.',
      price: 549.99,
      discountPrice: 479.99,
      stock: 12,
      isFeatured: true,
      categoryId: homeLiving.id,
      imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Classic Urban Denim Jacket',
      slug: 'classic-urban-denim-jacket',
      description: 'Timeless denim cut with reinforced stitching, branded buttons, and comfortable lining for everyday style.',
      price: 129.50,
      discountPrice: 99.00,
      stock: 50,
      isFeatured: false,
      categoryId: fashion.id,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Portable Bluetooth Speaker Pro',
      slug: 'portable-bluetooth-speaker-pro',
      description: 'IPX7 waterproof rating with deep bass, 360-degree sound distribution, and 20 hours of continuous playback.',
      price: 149.99,
      discountPrice: 119.99,
      stock: 60,
      isFeatured: true,
      categoryId: electronics.id,
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Modern Ambient Table Lamp',
      slug: 'modern-ambient-table-lamp',
      description: 'Touch-sensitive dimmable LED lamp with warm ambient color temperatures and matte ceramic finish.',
      price: 89.00,
      discountPrice: 69.00,
      stock: 25,
      isFeatured: false,
      categoryId: homeLiving.id,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const createdProducts: any[] = [];
  for (const item of productsData) {
    const { imageUrl, ...productInfo } = item;
    let product = await prisma.product.findUnique({ where: { slug: productInfo.slug } });
    if (!product) {
      product = await prisma.product.create({
        data: {
          ...productInfo,
          images: {
            create: [
              {
                url: imageUrl,
                publicId: `seed-${productInfo.slug}`,
                isPrimary: true,
              },
            ],
          },
        },
      });
    }
    createdProducts.push(product);
  }

  // 4. Create Coupons
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minOrderAmount: 50,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 500,
      isActive: true,
    },
  });

  // 5. Create Customer Address
  const address = await prisma.address.create({
    data: {
      userId: customerUser.id,
      fullName: 'Jane Doe',
      phone: '+1 (555) 234-5678',
      street: '123 Innovation Way',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States',
      isDefault: true,
    },
  });

  // 6. Create Review
  if (createdProducts.length > 0) {
    await prisma.review.upsert({
      where: {
        productId_userId: {
          productId: createdProducts[0].id,
          userId: customerUser.id,
        },
      },
      update: {},
      create: {
        productId: createdProducts[0].id,
        userId: customerUser.id,
        rating: 5,
        comment: 'Crystal clear sound quality and super comfortable for long hours!',
      },
    });
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
