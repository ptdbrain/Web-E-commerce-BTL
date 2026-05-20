const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'electronics' }, update: {}, create: { name: 'Electronics', slug: 'electronics' } }),
    prisma.category.upsert({ where: { slug: 'fashion' }, update: {}, create: { name: 'Fashion', slug: 'fashion' } }),
    prisma.category.upsert({ where: { slug: 'home-kitchen' }, update: {}, create: { name: 'Home & Kitchen', slug: 'home-kitchen' } }),
    prisma.category.upsert({ where: { slug: 'sports' }, update: {}, create: { name: 'Sports', slug: 'sports' } }),
    prisma.category.upsert({ where: { slug: 'books' }, update: {}, create: { name: 'Books', slug: 'books' } }),
  ]);

  console.log('✅ Categories created');

  // Users
  const hashedAdmin = await bcrypt.hash('admin123', 10);
  const hashedUser = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@minishopee.com' },
    update: {},
    create: { email: 'admin@minishopee.com', password: hashedAdmin, name: 'Admin', role: 'ADMIN' },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@minishopee.com' },
    update: {},
    create: { email: 'user@minishopee.com', password: hashedUser, name: 'John Doe', role: 'USER' },
  });

  // Create cart for user
  await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  console.log('✅ Users created');
  console.log('   Admin: admin@minishopee.com / admin123');
  console.log('   User:  user@minishopee.com  / user123');

  // Products
  const productData = [
    { name: 'Wireless Bluetooth Headphones', description: 'Premium noise-cancelling wireless headphones with 30hr battery life.', price: 1299000, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', categoryId: categories[0].id },
    { name: 'Smart Watch Series 5', description: 'Track fitness, notifications, and more with this sleek smartwatch.', price: 2499000, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', categoryId: categories[0].id },
    { name: 'USB-C Laptop Charger 65W', description: 'Universal fast charger compatible with most laptops and devices.', price: 399000, stock: 100, imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400', categoryId: categories[0].id },
    { name: 'Mechanical Gaming Keyboard', description: 'RGB backlit mechanical keyboard with tactile blue switches.', price: 850000, stock: 45, imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', categoryId: categories[0].id },
    { name: 'Men\'s Classic White Shirt', description: 'Premium cotton slim-fit white shirt for all occasions.', price: 320000, stock: 200, imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400', categoryId: categories[1].id },
    { name: 'Women\'s Summer Dress', description: 'Elegant floral summer dress, breathable fabric.', price: 450000, stock: 150, imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', categoryId: categories[1].id },
    { name: 'Running Sneakers Pro', description: 'Lightweight high-performance running shoes for all terrains.', price: 1150000, stock: 80, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', categoryId: categories[1].id },
    { name: 'Denim Jacket Classic', description: 'Timeless denim jacket, unisex fit, available in multiple shades.', price: 680000, stock: 60, imageUrl: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=400', categoryId: categories[1].id },
    { name: 'Ceramic Coffee Mug Set', description: 'Set of 4 handcrafted ceramic mugs, 350ml each.', price: 280000, stock: 120, imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', categoryId: categories[2].id },
    { name: 'Non-Stick Frying Pan 28cm', description: 'Professional grade non-stick coating, induction compatible.', price: 520000, stock: 75, imageUrl: 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400', categoryId: categories[2].id },
    { name: 'Bamboo Cutting Board', description: 'Eco-friendly bamboo cutting board with juice groove.', price: 195000, stock: 90, imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', categoryId: categories[2].id },
    { name: 'Yoga Mat Premium 6mm', description: 'Extra thick non-slip yoga mat with carrying strap.', price: 380000, stock: 65, imageUrl: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=400', categoryId: categories[3].id },
    { name: 'Resistance Bands Set', description: 'Set of 5 resistance bands from light to extra-heavy.', price: 220000, stock: 110, imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400', categoryId: categories[3].id },
    { name: 'Water Bottle 750ml', description: 'Insulated stainless steel water bottle keeps drinks cold 24hrs.', price: 340000, stock: 140, imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', categoryId: categories[3].id },
    { name: 'JavaScript: The Good Parts', description: 'Definitive guide to the good parts of JavaScript by Douglas Crockford.', price: 185000, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', categoryId: categories[4].id },
    { name: 'Clean Code', description: 'A handbook of agile software craftsmanship by Robert C. Martin.', price: 215000, stock: 35, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', categoryId: categories[4].id },
    { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with 1600 DPI precision.', price: 299000, stock: 85, imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', categoryId: categories[0].id },
    { name: 'Portable Power Bank 20000mAh', description: 'High-capacity power bank with dual USB-C fast charging.', price: 650000, stock: 55, imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', categoryId: categories[0].id },
    { name: 'Backpack 30L', description: 'Waterproof laptop backpack with USB charging port.', price: 750000, stock: 45, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', categoryId: categories[1].id },
    { name: 'Design Patterns Book', description: 'Elements of Reusable Object-Oriented Software. The classic Gang of Four book.', price: 245000, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', categoryId: categories[4].id },
  ];

  for (const p of productData) {
    await prisma.product.create({ data: p });
  }
  console.log('✅ 20 Products created');

  // Promotions
  const now = new Date();
  const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const past = new Date(now.getTime() - 1 * 60 * 60 * 1000);

  await prisma.promotion.create({
    data: {
      name: 'Electronics Sale 20% OFF',
      type: 'PERCENT',
      value: 20,
      startDate: past,
      endDate: future,
      isActive: true,
      categoryId: categories[0].id,
    },
  });

  await prisma.promotion.create({
    data: {
      name: 'Books Fixed Discount 50K',
      type: 'FIXED',
      value: 50000,
      startDate: past,
      endDate: future,
      isActive: true,
      categoryId: categories[4].id,
    },
  });

  console.log('✅ Promotions created');
  console.log('\n🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
