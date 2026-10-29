const path = require('path');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSettings() {
  const settings = await prisma.storeSetting.findMany();
  console.log('Store Settings:', settings);
  await prisma.$disconnect();
}
checkSettings();

