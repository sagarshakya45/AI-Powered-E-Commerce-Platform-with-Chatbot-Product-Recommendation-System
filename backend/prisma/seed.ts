import { PrismaClient, Role, OrderStatus, PaymentStatus, DiscountType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding development database...');

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // 1. Users
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

  const salesmanUser = await prisma.user.upsert({
    where: { email: 'seller@auramart.com' },
    update: {},
    create: {
      name: 'Alex Seller',
      email: 'seller@auramart.com',
      password: hashedPassword,
      role: Role.SALESMAN,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  });

  // 2. Categories
  const categories = await Promise.all([
    upsertCategory(prisma, 'Electronics', 'electronics', 'Cutting-edge gadgets, audio gear, and personal tech items.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'),
    upsertCategory(prisma, 'Fashion & Apparel', 'fashion', 'Modern clothing, shoes, and luxury lifestyle wear.', 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=600&q=80'),
    upsertCategory(prisma, 'Home & Living', 'home-living', 'Elegant home decor, minimalist furniture, and lighting.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'),
    upsertCategory(prisma, 'Accessories', 'accessories', 'Watches, bags, sunglasses, and personal accessories.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'),
    upsertCategory(prisma, 'Beauty', 'beauty', 'Skincare, makeup, and personal care products.', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'),
    upsertCategory(prisma, 'Sports', 'sports', 'Fitness equipment and outdoor gear.', 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80'),
    upsertCategory(prisma, 'Mobiles', 'mobiles', 'Smartphones and mobile accessories.', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=600&q=80'),
    upsertCategory(prisma, 'Groceries', 'groceries', 'Everyday essentials and pantry staples.', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80'),
  ]);

  const catMap = Object.fromEntries(categories.map(c => [c.slug, c]));

  // 3. Store for seller
  const store = await prisma.store.upsert({
    where: { userId: salesmanUser.id },
    update: {},
    create: {
      userId: salesmanUser.id,
      name: 'Alex\'s Tech Store',
      description: 'Premium electronics and gadgets curated by tech enthusiasts.',
      logo: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=200&q=80',
      banner: 'https://images.unsplash.com/photo-1519389950379-49b85134c064?auto=format&fit=crop&w=1600&q=80',
      isVerified: true,
    },
  });

  // 4. Products (mix of admin and seller products)
  const productsData: Array<{
    title: string;
    slug: string;
    description: string;
    price: number;
    discountPrice: number | null;
    stock: number;
    isFeatured: boolean;
    brand?: string;
    sku?: string;
    categoryId: string;
    sellerId?: string;
    imageUrl: string;
    attributes?: Record<string, any>;
    salesCount?: number;
    views?: number;
  }> = [
    {
      title: 'Wireless Noise-Canceling Headphones',
      slug: 'wireless-noise-canceling-headphones',
      description: 'Immerse yourself in high-fidelity audio with spatial sound, active noise cancellation, and 30-hour battery life.',
      price: 299.99,
      discountPrice: 249.99,
      stock: 45,
      isFeatured: true,
      brand: 'AuraAudio',
      sku: 'AA-WH-NC-2024',
      categoryId: catMap['electronics'].id,
      sellerId: salesmanUser.id,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      attributes: { color: 'Black', connectivity: 'Bluetooth 5.3', weight: '250g' },
      salesCount: 128,
      views: 452,
    },
    {
      title: 'Minimalist Smart Watch Series 5',
      slug: 'minimalist-smart-watch-series-5',
      description: 'Sleek aluminum casing with OLED retina display, health tracking, heart rate monitoring, and GPS integration.',
      price: 399.00,
      discountPrice: 349.00,
      stock: 30,
      isFeatured: true,
      brand: 'TimeSync',
      sku: 'TS-SW-S5-BLK',
      categoryId: catMap['accessories'].id,
      sellerId: salesmanUser.id,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      attributes: { size: '44mm', waterResistance: '50m', band: 'Silicone' },
      salesCount: 89,
      views: 320,
    },
    {
      title: 'Ergonomic Premium Leather Chair',
      slug: 'ergonomic-premium-leather-chair',
      description: 'Crafted with genuine top-grain leather and lumbar support, designed for all-day focus and ergonomic perfection.',
      price: 549.99,
      discountPrice: 479.99,
      stock: 12,
      isFeatured: true,
      brand: 'ComfortCore',
      sku: 'CC-ELC-001',
      categoryId: catMap['home-living'].id,
      imageUrl: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80',
      attributes: { material: 'Leather', color: 'Black', weightCapacity: '120kg' },
      salesCount: 42,
      views: 180,
    },
    {
      title: 'Classic Urban Denim Jacket',
      slug: 'classic-urban-denim-jacket',
      description: 'Timeless denim cut with reinforced stitching, branded buttons, and comfortable lining for everyday style.',
      price: 129.50,
      discountPrice: 99.00,
      stock: 50,
      isFeatured: false,
      brand: 'UrbanThread',
      sku: 'UT-DJ-NVY',
      categoryId: catMap['fashion'].id,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      attributes: { size: 'L', color: 'Navy', fit: 'Regular' },
      salesCount: 15,
      views: 98,
    },
    {
      title: 'Portable Bluetooth Speaker Pro',
      slug: 'portable-bluetooth-speaker-pro',
      description: 'IPX7 waterproof rating with deep bass, 360-degree sound distribution, and 20 hours of continuous playback.',
      price: 149.99,
      discountPrice: 119.99,
      stock: 60,
      isFeatured: true,
      brand: 'BassBoost',
      sku: 'BB-BTS-WTR',
      categoryId: catMap['electronics'].id,
      sellerId: salesmanUser.id,
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
      attributes: { color: 'Black', waterproof: 'IPX7', battery: '20h' },
      salesCount: 203,
      views: 650,
    },
    {
      title: 'Modern Ambient Table Lamp',
      slug: 'modern-ambient-table-lamp',
      description: 'Touch-sensitive dimmable LED lamp with warm ambient color temperatures and matte ceramic finish.',
      price: 89.00,
      discountPrice: 69.00,
      stock: 25,
      isFeatured: false,
      brand: 'LumenLux',
      sku: 'LL-ATL-WHT',
      categoryId: catMap['home-living'].id,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      attributes: { color: 'White', material: 'Ceramic', brightness: 'Adjustable' },
      salesCount: 34,
      views: 120,
    },
    {
      title: 'AuraPhone 14 Pro 256GB',
      slug: 'auraphone-14-pro-256gb',
      description: '6.7" OLED display, 48MP camera system, all-day battery, and 5G. The ultimate flagship experience.',
      price: 999,
      discountPrice: 849,
      stock: 28,
      isFeatured: true,
      brand: 'AuraMobile',
      sku: 'AM-AP14-256P',
      categoryId: catMap['mobiles'].id,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      attributes: { color: 'Pacific Blue', storage: '256GB', ram: '8GB' },
      salesCount: 450,
      views: 1200,
    },
    {
      title: 'UltraBook Air 13" Laptop',
      slug: 'ultrabook-air-13-laptop',
      description: 'Lightweight 13-inch laptop with 16GB RAM and 512GB SSD. Perfect for productivity on the go.',
      price: 1199,
      discountPrice: 1049,
      stock: 18,
      isFeatured: true,
      brand: 'ByteTech',
      sku: 'BT-UB-A13-512',
      categoryId: catMap['electronics'].id,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
      attributes: { color: 'Space Gray', ram: '16GB', storage: '512GB SSD' },
      salesCount: 76,
      views: 410,
    },
    {
      title: '4K Streaming Stick',
      slug: '4k-streaming-stick',
      description: 'Dolby Vision streaming stick with voice remote and Wi-Fi 6.',
      price: 59.99,
      discountPrice: 39.99,
      stock: 120,
      isFeatured: true,
      brand: 'StreamPro',
      sku: 'SP-4K-STK',
      categoryId: catMap['electronics'].id,
      sellerId: salesmanUser.id,
      imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4e7e1?auto=format&fit=crop&w=800&q=80',
      attributes: { resolution: '4K', remote: 'Voice', wifi: 'Wi-Fi 6' },
      salesCount: 312,
      views: 580,
    },
    {
      title: 'Yoga Mat Extra Thick 8mm',
      slug: 'yoga-mat-extra-thick-8mm',
      description: 'Non-slip workout mat with carry strap. Perfect for yoga, pilates, and floor exercises.',
      price: 35,
      discountPrice: 21.99,
      stock: 95,
      isFeatured: false,
      brand: 'FlexFit',
      sku: 'FF-YM-8MM-BLK',
      categoryId: catMap['sports'].id,
      imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7e1?auto=format&fit=crop&w=800&q=80',
      attributes: { thickness: '8mm', color: 'Black', material: 'TPE' },
      salesCount: 88,
      views: 155,
    },
    {
      title: 'Hydrating Face Serum 30ml',
      slug: 'hydrating-face-serum-30ml',
      description: 'Hyaluronic acid serum for daily hydration. Suitable for all skin types.',
      price: 28,
      discountPrice: 16.99,
      stock: 110,
      isFeatured: true,
      brand: 'GlowEssentia',
      sku: 'GE-HFS-30',
      categoryId: catMap['beauty'].id,
      imageUrl: 'https://images.unsplash.com/photo-1620917185235-d2a8a5e3f4e1?auto=format&fit=crop&w=800&q=80',
      attributes: { volume: '30ml', skinType: 'All', keyIngredient: 'Hyaluronic Acid' },
      salesCount: 167,
      views: 340,
    },
    {
      title: 'Adjustable Dumbbell 25kg Pair',
      slug: 'adjustable-dumbbell-25kg-pair',
      description: 'Space-saving adjustable weights for home workouts.',
      price: 189,
      discountPrice: 139,
      stock: 22,
      isFeatured: true,
      brand: 'IronPro',
      sku: 'IP-AD-25KG',
      categoryId: catMap['sports'].id,
      sellerId: salesmanUser.id,
      imageUrl: 'https://images.unsplash.com/photo-1608245441910-bb21292a0992?auto=format&fit=crop&w=800&q=80',
      attributes: { weight: '25kg', material: 'Cast Iron', color: 'Black' },
      salesCount: 64,
      views: 210,
    },
    {
      title: 'UV Polarized Sunglasses',
      slug: 'uv-polarized-sunglasses',
      description: 'Lightweight frames with polarized UV400 lenses.',
      price: 45,
      discountPrice: 22.5,
      stock: 88,
      isFeatured: true,
      brand: 'RayVue',
      sku: 'RV-SG-UV-BLK',
      categoryId: catMap['accessories'].id,
      imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      attributes: { frame: 'Plastic', lens: 'Polarized', color: 'Black' },
      salesCount: 92,
      views: 230,
    },
  ];

  const createdProducts: any[] = [];
  for (const item of productsData) {
    const { imageUrl, attributes, sellerId, brand, sku, salesCount, views, ...productInfo } = item;
    let product = await prisma.product.upsert({
      where: { slug: productInfo.slug },
      update: {
        brand,
        sku,
        attributes,
        salesCount: salesCount ?? 0,
        views: views ?? 0,
      },
      create: {
        ...productInfo,
        brand,
        sku,
        attributes,
        salesCount: (salesCount ?? 0) as number,
        views: (views ?? 0) as number,
        sellerId: sellerId || undefined,
        storeId: sellerId ? store.id : undefined,
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
    createdProducts.push(product);
  }

  // 5. Reviews
  const headphonesProduct = createdProducts.find((p) => p.slug === 'wireless-noise-canceling-headphones');
  const watchProduct = createdProducts.find((p) => p.slug === 'minimalist-smart-watch-series-5');
  const speakerProduct = createdProducts.find((p) => p.slug === 'portable-bluetooth-speaker-pro');
  const phoneProduct = createdProducts.find((p) => p.slug === 'auraphone-14-pro-256gb');

  if (headphonesProduct) {
    await prisma.review.upsert({
      where: { productId_userId: { productId: headphonesProduct.id, userId: customerUser.id } },
      update: {},
      create: {
        productId: headphonesProduct.id,
        userId: customerUser.id,
        rating: 5,
        title: 'Incredible sound quality!',
        comment: 'Crystal clear sound quality and super comfortable for long hours!',
        isVerifiedPurchase: true,
      },
    });
  }

  if (watchProduct) {
    await prisma.review.upsert({
      where: { productId_userId: { productId: watchProduct.id, userId: customerUser.id } },
      update: {},
      create: {
        productId: watchProduct.id,
        userId: customerUser.id,
        rating: 4,
        title: 'Great watch, solid battery',
        comment: 'Love the health tracking features. Battery could be slightly better.',
        isVerifiedPurchase: true,
      },
    });
  }

  if (speakerProduct) {
    await prisma.review.upsert({
      where: { productId_userId: { productId: speakerProduct.id, userId: customerUser.id } },
      update: {},
      create: {
        productId: speakerProduct.id,
        userId: customerUser.id,
        rating: 5,
        title: 'Loud and clear',
        comment: 'The bass is amazing and it pairs instantly with any device.',
        isVerifiedPurchase: true,
      },
    });
  }

  if (phoneProduct) {
    await prisma.review.upsert({
      where: { productId_userId: { productId: phoneProduct.id, userId: customerUser.id } },
      update: {},
      create: {
        productId: phoneProduct.id,
        userId: customerUser.id,
        rating: 5,
        title: 'Flagship performance',
        comment: 'Best phone I\'ve used. Camera quality is outstanding.',
        isVerifiedPurchase: true,
      },
    });
  }

  // 6. Coupon
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

  // Also create a fixed amount coupon
  await prisma.coupon.upsert({
    where: { code: 'SAVE20' },
    update: {},
    create: {
      code: 'SAVE20',
      discountType: DiscountType.FIXED,
      discountValue: 20,
      minOrderAmount: 100,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 200,
      isActive: true,
    },
  });

  // 7. Customer Address
  const address = await prisma.address.upsert({
    where: { id: `${customerUser.id}-addr-1` },
    update: {},
    create: {
      id: `${customerUser.id}-addr-1`,
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

  // 8. Create an Order for the customer (to enable review verification)
  if (headphonesProduct && speakerProduct) {
    const orderItems = [
      {
        productId: headphonesProduct.id,
        quantity: 1,
        unitPrice: 249.99,
        totalPrice: 249.99,
        sellerId: salesmanUser.id,
        status: OrderStatus.DELIVERED,
      },
      {
        productId: speakerProduct.id,
        quantity: 2,
        unitPrice: 119.99,
        totalPrice: 239.98,
        sellerId: salesmanUser.id,
        status: OrderStatus.DELIVERED,
      },
    ];

    const totalAmount = orderItems.reduce((s, i) => s + i.totalPrice, 0);
    const shipping = 0;
    const finalAmount = totalAmount + shipping;

    const order = await prisma.order.upsert({
      where: { orderNumber: 'ORD-SEED-001' },
      update: {},
      create: {
        orderNumber: 'ORD-SEED-001',
        userId: customerUser.id,
        addressId: address.id,
        totalAmount,
        discountAmount: 0,
        finalAmount,
        status: OrderStatus.DELIVERED,
        paymentMethod: 'card',
        items: { create: orderItems },
      },
    });

    if (order) {
      await prisma.payment.upsert({
        where: { id: `pay-seed-001` },
        update: {},
        create: {
          id: `pay-seed-001`,
          orderId: order.id,
          amount: finalAmount,
          paymentMethod: 'card',
          status: PaymentStatus.PAID,
        },
      });
    }
  }

  // 9. Product views
  if (headphonesProduct) {
    await prisma.productView.create({
      data: {
        productId: headphonesProduct.id,
        userId: customerUser.id,
      },
    });
  }

  // 10. Search events
  await prisma.searchEvent.create({
    data: {
      userId: customerUser.id,
      query: 'wireless headphones',
      resultCount: 5,
    },
  });

  // 11. Recommendation events
  if (headphonesProduct) {
    await prisma.recommendationEvent.create({
      data: {
        userId: customerUser.id,
        productId: headphonesProduct.id,
        eventType: 'VIEW',
        score: 0.92,
      },
    });
  }

  if (phoneProduct) {
    await prisma.recommendationEvent.create({
      data: {
        userId: customerUser.id,
        productId: phoneProduct.id,
        eventType: 'PURCHASE',
        score: 0.88,
      },
    });
  }

  console.log('Database seeding completed successfully!');
}

async function upsertCategory(
  prisma: PrismaClient,
  name: string,
  slug: string,
  description: string,
  image: string,
) {
  return prisma.category.upsert({
    where: { slug },
    update: { name, description, image },
    create: { name, slug, description, image },
  });
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
