import { Category, Product } from '../types';

type CatalogDraft = {
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  isFeatured?: boolean;
  categorySlug: string;
  image: string;
  avgRating?: number;
  reviewCount?: number;
};

export const LOCAL_CATEGORIES: Category[] = [
  { id: 'cat-mobiles', name: 'Mobiles', slug: 'mobiles', description: 'Smartphones and accessories' },
  { id: 'cat-electronics', name: 'Electronics', slug: 'electronics', description: 'Gadgets, audio, and tech' },
  { id: 'cat-fashion', name: 'Fashion', slug: 'fashion', description: 'Clothing and shoes' },
  { id: 'cat-home-living', name: 'Home & Living', slug: 'home-living', description: 'Furniture and decor' },
  { id: 'cat-accessories', name: 'Accessories', slug: 'accessories', description: 'Watches, bags, and more' },
  { id: 'cat-beauty', name: 'Beauty', slug: 'beauty', description: 'Personal care' },
  { id: 'cat-sports', name: 'Sports', slug: 'sports', description: 'Fitness and outdoors' },
  { id: 'cat-groceries', name: 'Groceries', slug: 'groceries', description: 'Everyday essentials' },
];

const DRAFTS: CatalogDraft[] = [
  {
    title: 'AuraPhone 14 Pro 256GB',
    slug: 'auraphone-14-pro-256gb',
    description: '6.7" OLED display, 48MP camera system, all-day battery, and 5G.',
    price: 999,
    discountPrice: 849,
    stock: 28,
    isFeatured: true,
    categorySlug: 'mobiles',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.6,
    reviewCount: 1284,
  },
  {
    title: 'Pixel Lite 5G 128GB',
    slug: 'pixel-lite-5g-128gb',
    description: 'Clean Android experience with excellent low-light photography.',
    price: 499,
    discountPrice: 429,
    stock: 40,
    isFeatured: true,
    categorySlug: 'mobiles',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.4,
    reviewCount: 612,
  },
  {
    title: 'Wireless Noise-Canceling Headphones',
    slug: 'wireless-noise-canceling-headphones',
    description: 'Spatial audio, active noise cancellation, and 30-hour battery life.',
    price: 299.99,
    discountPrice: 249.99,
    stock: 45,
    isFeatured: true,
    categorySlug: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.8,
    reviewCount: 2104,
  },
  {
    title: 'UltraBook Air 13" Laptop',
    slug: 'ultrabook-air-13-laptop',
    description: 'Lightweight 13-inch laptop with 16GB RAM and 512GB SSD.',
    price: 1199,
    discountPrice: 1049,
    stock: 18,
    isFeatured: true,
    categorySlug: 'electronics',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.5,
    reviewCount: 890,
  },
  {
    title: '4K Streaming Stick',
    slug: '4k-streaming-stick',
    description: 'Dolby Vision streaming stick with voice remote and Wi-Fi 6.',
    price: 59.99,
    discountPrice: 39.99,
    stock: 120,
    isFeatured: true,
    categorySlug: 'electronics',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.3,
    reviewCount: 3401,
  },
  {
    title: 'Portable Bluetooth Speaker Pro',
    slug: 'portable-bluetooth-speaker-pro',
    description: 'IPX7 waterproof speaker with deep bass and 20-hour playback.',
    price: 149.99,
    discountPrice: 119.99,
    stock: 60,
    isFeatured: true,
    categorySlug: 'electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.6,
    reviewCount: 754,
  },
  {
    title: 'Mechanical RGB Keyboard',
    slug: 'mechanical-rgb-keyboard',
    description: 'Hot-swappable switches, per-key RGB, and aluminum frame.',
    price: 129,
    discountPrice: 89,
    stock: 55,
    categorySlug: 'electronics',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.7,
    reviewCount: 431,
  },
  {
    title: 'Wireless Gaming Mouse',
    slug: 'wireless-gaming-mouse',
    description: '26K DPI sensor, 70-hour battery, and lightweight honeycomb shell.',
    price: 79.99,
    discountPrice: 54.99,
    stock: 80,
    categorySlug: 'electronics',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.5,
    reviewCount: 988,
  },
  {
    title: 'Classic Urban Denim Jacket',
    slug: 'classic-urban-denim-jacket',
    description: 'Timeless denim cut with reinforced stitching and soft lining.',
    price: 129.5,
    discountPrice: 99,
    stock: 50,
    categorySlug: 'fashion',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.2,
    reviewCount: 276,
  },
  {
    title: 'Everyday Cotton T-Shirt 3-Pack',
    slug: 'everyday-cotton-tshirt-3-pack',
    description: 'Breathable mid-weight cotton tees for daily wear.',
    price: 39.99,
    discountPrice: 24.99,
    stock: 200,
    isFeatured: true,
    categorySlug: 'fashion',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.4,
    reviewCount: 1560,
  },
  {
    title: 'Runner Pro Sneakers',
    slug: 'runner-pro-sneakers',
    description: 'Cushioned everyday sneakers with knit upper and rubber sole.',
    price: 89,
    discountPrice: 64,
    stock: 70,
    isFeatured: true,
    categorySlug: 'fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.6,
    reviewCount: 2201,
  },
  {
    title: 'Slim Fit Chino Pants',
    slug: 'slim-fit-chino-pants',
    description: 'Stretch chinos with a clean slim fit for work and weekends.',
    price: 59,
    discountPrice: 39,
    stock: 90,
    categorySlug: 'fashion',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.1,
    reviewCount: 344,
  },
  {
    title: 'Ergonomic Premium Leather Chair',
    slug: 'ergonomic-premium-leather-chair',
    description: 'Top-grain leather chair with lumbar support for all-day focus.',
    price: 549.99,
    discountPrice: 479.99,
    stock: 12,
    isFeatured: true,
    categorySlug: 'home-living',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.7,
    reviewCount: 198,
  },
  {
    title: 'Modern Ambient Table Lamp',
    slug: 'modern-ambient-table-lamp',
    description: 'Touch-dimmable LED lamp with warm color temperatures.',
    price: 89,
    discountPrice: 69,
    stock: 25,
    categorySlug: 'home-living',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.3,
    reviewCount: 167,
  },
  {
    title: 'Non-Stick Cookware Set 10pc',
    slug: 'nonstick-cookware-set-10pc',
    description: 'PFOA-free pots and pans with even-heat aluminum cores.',
    price: 159,
    discountPrice: 99,
    stock: 34,
    isFeatured: true,
    categorySlug: 'home-living',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.5,
    reviewCount: 802,
  },
  {
    title: 'Memory Foam Pillow Twin Pack',
    slug: 'memory-foam-pillow-twin-pack',
    description: 'Cooling gel memory foam pillows with removable covers.',
    price: 49,
    discountPrice: 29.99,
    stock: 150,
    categorySlug: 'home-living',
    image: 'https://images.unsplash.com/photo-1584100936595-c8196c9db434?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.4,
    reviewCount: 1190,
  },
  {
    title: 'Minimalist Smart Watch Series 5',
    slug: 'minimalist-smart-watch-series-5',
    description: 'OLED display, heart-rate tracking, GPS, and 2-day battery.',
    price: 399,
    discountPrice: 349,
    stock: 30,
    isFeatured: true,
    categorySlug: 'accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.5,
    reviewCount: 940,
  },
  {
    title: 'Leather Crossbody Bag',
    slug: 'leather-crossbody-bag',
    description: 'Compact everyday bag with adjustable strap and zip pockets.',
    price: 79,
    discountPrice: 49,
    stock: 42,
    categorySlug: 'accessories',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.3,
    reviewCount: 255,
  },
  {
    title: 'UV Polarized Sunglasses',
    slug: 'uv-polarized-sunglasses',
    description: 'Lightweight frames with polarized UV400 lenses.',
    price: 45,
    discountPrice: 22.5,
    stock: 88,
    isFeatured: true,
    categorySlug: 'accessories',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.2,
    reviewCount: 670,
  },
  {
    title: 'Hydrating Face Serum 30ml',
    slug: 'hydrating-face-serum-30ml',
    description: 'Hyaluronic acid serum for daily hydration.',
    price: 28,
    discountPrice: 16.99,
    stock: 110,
    isFeatured: true,
    categorySlug: 'beauty',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.6,
    reviewCount: 1433,
  },
  {
    title: 'Matte Lip Color Set',
    slug: 'matte-lip-color-set',
    description: 'Long-wear matte lipsticks in six everyday shades.',
    price: 32,
    discountPrice: 19.99,
    stock: 75,
    categorySlug: 'beauty',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.4,
    reviewCount: 508,
  },
  {
    title: 'Yoga Mat Extra Thick 8mm',
    slug: 'yoga-mat-extra-thick-8mm',
    description: 'Non-slip workout mat with carry strap.',
    price: 35,
    discountPrice: 21.99,
    stock: 95,
    categorySlug: 'sports',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.5,
    reviewCount: 721,
  },
  {
    title: 'Adjustable Dumbbell 25kg Pair',
    slug: 'adjustable-dumbbell-25kg-pair',
    description: 'Space-saving adjustable weights for home workouts.',
    price: 189,
    discountPrice: 139,
    stock: 22,
    isFeatured: true,
    categorySlug: 'sports',
    image: 'https://images.unsplash.com/photo-1576678927484-8c612e0d0c0e?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.7,
    reviewCount: 389,
  },
  {
    title: 'Organic Coffee Beans 1kg',
    slug: 'organic-coffee-beans-1kg',
    description: 'Medium roast arabica beans, freshly packed.',
    price: 24,
    discountPrice: 16.5,
    stock: 140,
    categorySlug: 'groceries',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.8,
    reviewCount: 2011,
  },
  {
    title: 'Extra Virgin Olive Oil 1L',
    slug: 'extra-virgin-olive-oil-1l',
    description: 'Cold-pressed olive oil for cooking and dressings.',
    price: 18,
    discountPrice: 12.99,
    stock: 160,
    categorySlug: 'groceries',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    avgRating: 4.5,
    reviewCount: 844,
  },
];

// ------------------------------------------------------------
// Extra hand-crafted product drafts to fill every category to 25 items.
// All discount prices are strictly less than the original price.
// ------------------------------------------------------------

/** Deterministic seeded pseudo-random: keeps data stable across reloads */
function seededRand(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function extraDrafts(): CatalogDraft[] {
  // Pre-defined Unsplash photo IDs per category (cycling if needed)
  const photos: Record<string, string[]> = {
    mobiles: [
      'photo-1601784551446-20c9e07cdbdb','photo-1565849904461-04a58ad377e0',
      'photo-1605236453806-6ff36851218e','photo-1512941937669-90a1b58e7e9c',
      'photo-1510557880182-3d4d3cba35a5','photo-1578345699944-3cefb4c24e78',
      'photo-1556656793-08538906a9f8','photo-1574944985070-8f3ebc6b79d2',
      'photo-1547658719-da2b51169166','photo-1580910051074-3eb694886505',
      'photo-1525373698358-041e3a460346','photo-1567581935884-3349723552ca',
      'photo-1473968512647-3e447244af8f','photo-1592899677977-9c10002761d5',
      'photo-1616348436168-de43ad0db179','photo-1626379953822-baec19c3accd',
      'photo-1632661674596-df8be070a5c5','photo-1607936854279-55e8a4c64888',
      'photo-1598300042247-d088f8ab3a91','photo-1591337676887-a217a6970a8a',
      'photo-1533228100845-08145b01de14','photo-1551355738-1875b8d09a29',
    ],
    electronics: [
      'photo-1518770660439-4636190af475','photo-1558618666-fcd25c85cd64',
      'photo-1550009158-9ebf69173e03','photo-1612831455544-cd7c2b0c1e0e',
      'photo-1583394838336-acd977736f90','photo-1625895197185-efcec01cffe0',
      'photo-1587202372775-e229f172b9d7','photo-1517420704952-d9f39e95b43e',
      'photo-1484704849700-f032a568e944','photo-1516762689617-e1cffcef479d',
      'photo-1593305841991-05c297ba4575','photo-1608043152269-423dbba4e7e1',
      'photo-1547949003-9792a18a2601','photo-1585771724684-38269d6639fd',
      'photo-1606813907291-d86efa9b94db','photo-1461151304267-38535e780c79',
      'photo-1535303311164-664fc9ec6532','photo-1582053433976-25c00369fc93',
    ],
    fashion: [
      'photo-1490481651871-ab68de25d43d','photo-1434389677669-e08b4cac3105',
      'photo-1515886657613-9f3515b0c78f','photo-1539109136881-3be0616acf4b',
      'photo-1524253482453-3fed8d2fe12b','photo-1520367445093-50dc08a59d9d',
      'photo-1558769132-cb1aea458c5e','photo-1548036328-c9fa89d128fa',
      'photo-1509631179647-0177331693ae','photo-1566206091558-7f218b696731',
      'photo-1595341888016-a392ef81b7de','photo-1572635196237-14b3f281503f',
      'photo-1584917865442-de89df76afd3','photo-1542060748-10c28b62716f',
      'photo-1587241321921-91a834d6d191','photo-1591047139829-d91aecb6caea',
      'photo-1507003211169-0a1dd7228f2d','photo-1516762689617-e1cffcef479d',
    ],
    'home-living': [
      'photo-1555041469-a586c61ea9bc','photo-1586023492125-27b2c045efd7',
      'photo-1540574163026-643ea20ade25','photo-1524758631624-e2822e304c36',
      'photo-1493663284031-b7e3aefcae8e','photo-1558618666-fcd25c85cd64',
      'photo-1485955900006-10f4d324d411','photo-1518455027359-f3f8164ba6bd',
      'photo-1493770348161-369560ae357d','photo-1556909114-f6e7ad7d3136',
      'photo-1505693314120-0d443867891c','photo-1484154218962-a197022b5858',
      'photo-1549637642-3de11b5c8ff9','photo-1601760561441-16420502c7e0',
      'photo-1513694203232-719a280e022f','photo-1567538096630-e0c55bd6374c',
      'photo-1543269664-7eef42226a21','photo-1588854337115-1c67d9247e4d',
    ],
    accessories: [
      'photo-1553062407-98eeb64c6a62','photo-1547949003-9792a18a2601',
      'photo-1587836374828-4dbafa94cf0e','photo-1553062407-98eeb64c6a62',
      'photo-1614605297620-a3e10fa5c67c','photo-1590548784585-643d2b9f2925',
      'photo-1565069564849-b1b3c1e9e29a','photo-1583394838336-acd977736f90',
      'photo-1601924994987-69e26d50dc26','photo-1581044777550-4cfa2df97a90',
      'photo-1512436991641-6745cdb1723f','photo-1608889825205-eebdb9fc5806',
      'photo-1576566588028-4147f3842f27','photo-1609081219090-a6d81d3085bf',
      'photo-1618354691373-d851c5c3a990','photo-1546868871-7041f2a55e12',
      'photo-1585386959984-a4155224a1ad','photo-1548036328-c9fa89d128fa',
    ],
    beauty: [
      'photo-1522335789203-aabd1fc54bc9','photo-1596462502278-27bfdc403348',
      'photo-1571781926291-c477ebfd024b','photo-1512290923902-8a9f81dc236c',
      'photo-1608248597279-f99d160bfcbc','photo-1519415943484-9fa1873496d4',
      'photo-1631729371254-42c2892f0e6e','photo-1556228578-8c89e6adf883',
      'photo-1570194065650-d99fb4bedf0a','photo-1527799820374-87036debb47a',
      'photo-1526947425960-945c6e72858f','photo-1517841905240-472988babdf9',
      'photo-1488426862026-3ee34a7d66df','photo-1599305445671-ac291c95aaa9',
      'photo-1616394584738-fc6e612e71b9','photo-1513688022834-e4a0f4d0b2e3',
      'photo-1503236823255-94609f598e71','photo-1609709295948-17d77cb2a69b',
    ],
    sports: [
      'photo-1517836357463-d25dfeac3438','photo-1571902943202-507ec2618e8f',
      'photo-1584735175315-9d5df23be8cf','photo-1526506118085-60ce8714f8c5',
      'photo-1616279969965-9c09bcc29ab1','photo-1574680096145-d05b474e2155',
      'photo-1499084732479-de2c02d45fcc','photo-1558618666-fcd25c85cd64',
      'photo-1502224562085-639556652f33','photo-1593786040755-a76b3dca70e6',
      'photo-1434596922112-19c563067271','photo-1487466365202-1afdb86c764e',
      'photo-1597452485669-2c7bb5fef90d','photo-1540497077202-7c8a3999166f',
      'photo-1505016149303-aa574a68d6a3','photo-1606107557195-0e29a4b5b4aa',
      'photo-1519505907962-0a6cb0167c73','photo-1608245449230-4ac19066d2d0',
    ],
    groceries: [
      'photo-1542838132-92c53300491e','photo-1601493700631-2d16ec4b4716',
      'photo-1610832958506-aa56368176cf','photo-1587049633312-d628ae50a8ae',
      'photo-1553361371-9b22f78e8b1d','photo-1506802913710-000b7de38e20',
      'photo-1568702846914-96b305d2aaeb','photo-1528825871115-3581a5387919',
      'photo-1553361371-9b22f78e8b1d','photo-1491553895911-0055eca6402d',
      'photo-1490645935967-10de6ba17061','photo-1505576399279-565b52d4ac71',
      'photo-1556909114-f6e7ad7d3136','photo-1488459716781-31db52582fe9',
      'photo-1563636619-e9143da7973b','photo-1550583724-b2692b85b150',
      'photo-1523049673857-eb18f1d7b578','photo-1516594915697-87eb3b1c14ea',
    ],
  };

  const priceRanges: Record<string, [number, number]> = {
    mobiles: [199, 1299],
    electronics: [29, 1499],
    fashion: [15, 299],
    'home-living': [25, 699],
    accessories: [19, 499],
    beauty: [8, 89],
    sports: [15, 299],
    groceries: [5, 59],
  };

  const descriptions: Record<string, string[]> = {
    mobiles: ['5G-ready smartphone with triple-camera and fast charging.','AMOLED display smartphone with long-lasting battery.','Compact flagship phone with water-resistance and AI camera.'],
    electronics: ['High-performance gadget for everyday productivity.','Feature-rich device with latest connectivity standards.','Smart tech product built for entertainment and work.'],
    fashion: ['Stylish and comfortable everyday wear piece.','Premium fabric garment with modern cut and design.','Versatile wardrobe essential for any occasion.'],
    'home-living': ['Elegant home decor piece that transforms any room.','Practical household item made from quality materials.','Modern living essential with lasting durability.'],
    accessories: ['Sleek accessory that complements any outfit.','Premium-grade accessory built for style and function.','Everyday carry essential with refined design.'],
    beauty: ['Skin-loving formula for daily skincare routine.','Salon-quality beauty product for at-home use.','Dermatologist-tested product safe for all skin types.'],
    sports: ['Performance gear designed for serious athletes.','Durable sports equipment built for intense workouts.','Lightweight fitness accessory for active lifestyles.'],
    groceries: ['Fresh and organic everyday pantry essential.','Premium quality food product, naturally sourced.','Healthy and delicious everyday ingredient.'],
  };

  const result: CatalogDraft[] = [];

  for (const category of LOCAL_CATEGORIES) {
    const existing = DRAFTS.filter((d) => d.categorySlug === category.slug).length;
    const imgs = photos[category.slug] ?? [];
    const [minP, maxP] = priceRanges[category.slug] ?? [20, 500];
    const descs = descriptions[category.slug] ?? ['Quality product.'];

    for (let i = existing + 1; i <= TARGET_COUNT; i++) {
      const seed = i * 13 + category.slug.length * 7;
      const r1 = seededRand(seed);
      const r2 = seededRand(seed + 1);
      const r3 = seededRand(seed + 2);
      const r4 = seededRand(seed + 3);
      const r5 = seededRand(seed + 4);

      const price = Math.round((minP + r1 * (maxP - minP)) * 100) / 100;
      // Discount between 10% and 40% off — always strictly less than price
      const hasDiscount = r2 < 0.65;
      const discountPrice = hasDiscount
        ? Math.round(price * (0.60 + r3 * 0.30) * 100) / 100
        : undefined;

      const imgKey = imgs[i % imgs.length] ?? `photo-1505740420928-5e560c06d30e`;
      const desc = descs[Math.floor(r4 * descs.length)];
      const avgRating = Math.round((3.5 + r5 * 1.5) * 10) / 10;
      const reviewCount = Math.floor(seededRand(seed + 5) * 3000);
      const stock = Math.floor(seededRand(seed + 6) * 150) + 5;

      result.push({
        title: `${category.name} ${['Pro', 'Elite', 'Plus', 'Ultra', 'Max', 'Essential', 'Premium', 'Classic', 'Smart', 'Flex'][i % 10]} ${i}`,
        slug: `${category.slug}-item-${i}`,
        description: desc,
        price,
        discountPrice,
        stock,
        isFeatured: i % 7 === 0,
        categorySlug: category.slug,
        image: `https://images.unsplash.com/${imgKey}?auto=format&fit=crop&w=800&q=80`,
        avgRating,
        reviewCount,
      });
    }
  }

  return result;
}

const TARGET_COUNT = 25 as const;
const ADDITIONAL_DRAFTS = extraDrafts();
const ALL_DRAFTS = [...DRAFTS, ...ADDITIONAL_DRAFTS];

function toProduct(draft: CatalogDraft): Product {
  const category = LOCAL_CATEGORIES.find((c) => c.slug === draft.categorySlug)!;
  const now = '2026-01-15T00:00:00.000Z';
  return {
    id: draft.slug,
    title: draft.title,
    slug: draft.slug,
    description: draft.description,
    price: draft.price,
    discountPrice: draft.discountPrice ?? null,
    stock: draft.stock,
    isFeatured: Boolean(draft.isFeatured),
    isActive: true,
    categoryId: category.id,
    category,
    images: [{ id: `${draft.slug}-img`, url: draft.image, isPrimary: true }],
    avgRating: draft.avgRating ?? 4.4,
    reviewCount: draft.reviewCount ?? 120,
    createdAt: now,
    updatedAt: now,
  };
}

export const LOCAL_PRODUCTS: Product[] = ALL_DRAFTS.map(toProduct);

export const HOME_BANNERS = [
  {
    id: 'mega-sale',
    eyebrow: 'Mega Deal Days',
    title: 'Up to 60% off electronics',
    subtitle: 'Headphones, laptops, and smart home — limited time.',
    cta: 'Shop electronics',
    to: '/products?category=electronics',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'fashion-week',
    eyebrow: 'Fashion week',
    title: 'New season styles from $25',
    subtitle: 'Jackets, sneakers, and everyday essentials.',
    cta: 'Shop fashion',
    to: '/products?category=fashion',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'home-refresh',
    eyebrow: 'Home refresh',
    title: 'Kitchen & living under $100',
    subtitle: 'Cookware, lighting, and comfort picks.',
    cta: 'Shop home',
    to: '/products?category=home-living',
    image: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1600&q=80',
  },
];

export function mergeCatalog(apiProducts: Product[] | undefined): Product[] {
  if (apiProducts && apiProducts.length > 0) return apiProducts;
  return LOCAL_PRODUCTS;
}

export function productsByCategory(products: Product[], slug: string): Product[] {
  return products.filter((p) => p.category?.slug === slug);
}

export function dealProducts(products: Product[]): Product[] {
  return products.filter((p) => p.discountPrice && p.discountPrice < p.price);
}

export function featuredProducts(products: Product[]): Product[] {
  const featured = products.filter((p) => p.isFeatured);
  return featured.length > 0 ? featured : products.slice(0, 8);
}
