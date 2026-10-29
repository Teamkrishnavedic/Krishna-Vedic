const path = require('path');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('sslaccept=')) {
  const separator = process.env.DATABASE_URL.includes('?') ? '&' : '?';
  process.env.DATABASE_URL = `${process.env.DATABASE_URL}${separator}sslaccept=accept_invalid_certs`;
}
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOrder() {
  const orders = await prisma.order.findMany({
    include: {
      items: true
    }
  });
  console.log('Orders:', JSON.stringify(orders, null, 2));
  await prisma.$disconnect();
}
checkOrder();

