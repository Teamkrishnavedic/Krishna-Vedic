import 'dotenv/config';
import app from './app';
import { prisma } from './lib/prisma';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function main() {
  // Verify database connection
  await prisma.$connect();
  console.log('✅ Database connected');

  // Ensure Google OAuth columns exist in database
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP NOT NULL;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "googleId" TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;`);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_googleId_key" ON "User"("googleId");`);
    console.log('✅ Google OAuth database schema verified');
  } catch (err: any) {
    console.warn('⚠️ Google OAuth DB check:', err.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
  });
}

main().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
