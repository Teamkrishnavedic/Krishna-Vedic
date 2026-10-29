const path = require('path');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runWithRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === retries - 1) throw e;
      console.log(`Connection retry ${i + 1}/${retries}...`);
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

async function inspectCatalogue() {
  const categories = await runWithRetry(() => prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      products: {
        where: { status: 'PUBLISHED' },
        include: {
          variants: { orderBy: { sortOrder: 'asc' } },
          images: true
        }
      }
    }
  }));

  console.log('=== VERIFYING REAL CATALOGUE IN DATABASE ===\n');
  let totalPublished = 0;
  for (const cat of categories) {
    console.log(`📂 CATEGORY: ${cat.name} (${cat.slug}) - ${cat.products.length} products`);
    for (const p of cat.products) {
      totalPublished++;
      const vStr = p.variants.map(v => `${v.name}: ₹${v.price/100} (stock: ${v.stock})`).join(', ');
      const img = p.images[0]?.url ? '✓ Img' : '❌ No Img';
      console.log(`   - [${p.sku}] ${p.name}`);
      console.log(`     Variants: ${vStr} | ${img}`);
    }
    console.log('');
  }
  console.log(`Total Active Published Products: ${totalPublished}`);
  await prisma.$disconnect();
}

inspectCatalogue();
