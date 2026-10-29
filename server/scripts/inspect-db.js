const path = require('path');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// If DATABASE_URL doesn't have sslaccept=accept_invalid_certs, add it or adjust
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('sslaccept=')) {
  const separator = process.env.DATABASE_URL.includes('?') ? '&' : '?';
  process.env.DATABASE_URL = `${process.env.DATABASE_URL}${separator}sslaccept=accept_invalid_certs`;
}

const { PrismaClient } = require('@prisma/client');
console.log('Modified DATABASE_URL:', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@'));

const prisma = new PrismaClient();

async function inspect() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } }
      }
    });
    console.log('--- CURRENT CATEGORIES ---');
    console.log(JSON.stringify(categories, null, 2));

    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        status: true,
        variants: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true
          }
        }
      }
    });
    console.log('\n--- CURRENT PRODUCTS COUNT:', products.length, '---');
    for (const p of products) {
      console.log(`- ${p.name} (${p.slug}) [${p.status}] - variants: ${p.variants.map(v => `${v.name}: ₹${v.price/100}`).join(', ')}`);
    }

    const orderCount = await prisma.order.count();
    const userCount = await prisma.user.count();
    console.log(`\nExisting Users: ${userCount}, Existing Orders: ${orderCount}`);

  } catch (err) {
    console.error('Inspection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

inspect();
