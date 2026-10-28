/**
 * Create the first administrator account.
 * Run with: npm run create-admin --workspace=server
 *
 * Reads credentials from environment:
 *   BOOTSTRAP_ADMIN_EMAIL
 *   BOOTSTRAP_ADMIN_NAME
 *   BOOTSTRAP_ADMIN_PASSWORD
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const name = process.env.BOOTSTRAP_ADMIN_NAME;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!email || !name || !password) {
    console.error('❌ Set BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_NAME, and BOOTSTRAP_ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  if (password.length < 12) {
    console.error('❌ BOOTSTRAP_ADMIN_PASSWORD must be at least 12 characters');
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (existing.role === 'SUPER_ADMIN') {
      console.log('ℹ️  Super admin already exists:', email);
    } else {
      await prisma.user.update({ where: { email }, data: { role: 'SUPER_ADMIN' } });
      console.log('✅ Upgraded existing user to SUPER_ADMIN:', email);
    }
    await prisma.$disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, passwordHash, role: 'SUPER_ADMIN', isActive: true },
  });

  console.log('✅ Super admin created successfully!');
  console.log('   Email:', email);
  console.log('   Role: SUPER_ADMIN');
  console.log('');
  console.log('⚠️  Remove BOOTSTRAP_ADMIN_PASSWORD from your .env file after this step.');

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
