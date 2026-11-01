import { PrismaClient } from '@prisma/client';
import { getResolvedDatabaseUrl } from './dns-resolve';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getPrismaClient(): PrismaClient {
  let url = getResolvedDatabaseUrl();
  const isVercel = process.env.VERCEL === '1' || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (url) {
    // In serverless environments (Vercel), each container processes requests sequentially.
    // Enforcing connection_limit=1 ensures Lambda instances do not monopolize database connection slots.
    const connLimit = isVercel ? '1' : '2';

    if (!url.includes('connection_limit=')) {
      const sep = url.includes('?') ? '&' : '?';
      url = `${url}${sep}connection_limit=${connLimit}&pool_timeout=10`;
    } else if (isVercel) {
      url = url.replace(/connection_limit=\d+/, `connection_limit=${connLimit}`);
    }

    // Support PgBouncer transaction pooling if specified
    if (url.includes('pgbouncer=true') && !url.includes('connection_limit=')) {
      url = `${url}&connection_limit=${connLimit}`;
    }
  }

  return new PrismaClient({
    datasources: url ? { db: { url } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma || getPrismaClient();

globalForPrisma.prisma = prisma;
