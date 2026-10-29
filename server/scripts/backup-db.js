const path = require('path');
const fs = require('fs');
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
      console.log(`Retry ${i + 1}/${retries}...`);
      await new Promise(r => setTimeout(r, 1500));
    }
  }
}

async function backup() {
  console.log('📦 Starting database backup before catalogue migration...');
  const data = {};

  data.users = await runWithRetry(() => prisma.user.findMany());
  data.addresses = await runWithRetry(() => prisma.address.findMany());
  data.categories = await runWithRetry(() => prisma.category.findMany());
  data.products = await runWithRetry(() => prisma.product.findMany());
  data.variants = await runWithRetry(() => prisma.productVariant.findMany());
  data.images = await runWithRetry(() => prisma.productImage.findMany());
  data.orders = await runWithRetry(() => prisma.order.findMany({ include: { items: true } }));
  data.storeSettings = await runWithRetry(() => prisma.storeSetting.findMany());

  const backupPath = path.resolve(__dirname, '../backup-db-snapshot.json');
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ Backup successfully saved to ${backupPath}`);
  console.log(`   Users: ${data.users.length}, Orders: ${data.orders.length}, Products: ${data.products.length}, Categories: ${data.categories.length}`);
  await prisma.$disconnect();
}

backup().catch((err) => {
  console.error('Backup failed:', err);
  process.exit(1);
});
