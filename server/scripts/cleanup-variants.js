const path = require('path');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  console.log('Cleaning up extra demo variants and ensuring primary variants match customer poster...');

  // 1. Cow Ghee: delete old demo variant
  const cowGhee = await prisma.product.findUnique({
    where: { slug: 'cow-ghee-gaay-ka-ghee' },
    include: { variants: true }
  });
  if (cowGhee) {
    for (const v of cowGhee.variants) {
      if (v.price > 0) {
        console.log(`  Removing old priced variant from Cow Ghee: ${v.name} (₹${v.price/100})`);
        await prisma.productVariant.delete({ where: { id: v.id } });
      }
    }
  }

  // 2. Clear old demo variants for other products if they are not in orders
  const preservedVariantIds = new Set([
    'cmvoxh18f000m77hkfqzjsxfn', // Order item 1
    'cmvoxh35x001t77hkkkdgmssl', // Order item 2
  ]);

  const activeProducts = await prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    include: { variants: true }
  });

  for (const p of activeProducts) {
    // If the product has multiple variants, remove any demo variants that aren't the official unit or in orders
    if (p.variants.length > 1) {
      for (const v of p.variants) {
        if (!preservedVariantIds.has(v.id)) {
          // Check if it's the official variant (name "1 kg", "100 g", or "Price Pending")
          const isOfficial = (v.name === '1 kg' || v.name === '100 g' || v.name === 'Price Pending') && v.isDefault;
          if (!isOfficial) {
            console.log(`  Deleting extraneous demo variant: ${p.name} -> ${v.name} (₹${v.price/100})`);
            // Detach cartItems if any
            await prisma.cartItem.deleteMany({ where: { variantId: v.id } });
            await prisma.productVariant.delete({ where: { id: v.id } });
          }
        } else {
          // It's in an order, ensure it's not default and sorted last
          await prisma.productVariant.update({
            where: { id: v.id },
            data: { isDefault: false, sortOrder: 99 }
          });
        }
      }
    }

    // Ensure the official variant has sortOrder 0 and isDefault true
    const defaultVar = p.variants.find(v => v.name === '1 kg' || v.name === '100 g' || v.name === 'Price Pending');
    if (defaultVar) {
      await prisma.productVariant.update({
        where: { id: defaultVar.id },
        data: { isDefault: true, sortOrder: 0 }
      });
    }
  }

  console.log('✓ Variants successfully standardized.');
  await prisma.$disconnect();
}

cleanup().catch(console.error);

