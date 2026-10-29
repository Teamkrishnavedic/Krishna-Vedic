const path = require('path');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkReferencedVariants() {
  const orderItems = await prisma.orderItem.findMany({
    select: { variantId: true, productName: true, variantName: true }
  });
  console.log('Order Item Variant IDs in use:', orderItems);

  const cartItems = await prisma.cartItem.findMany({
    select: { variantId: true }
  });
  console.log('Cart Item Variant IDs in use:', cartItems);

  await prisma.$disconnect();
}
checkReferencedVariants();
