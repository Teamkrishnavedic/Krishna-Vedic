import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getPrismaClient(): PrismaClient {
  let url = process.env.DATABASE_URL || '';
  if (url && !url.includes('connection_limit=')) {
    const sep = url.includes('?') ? '&' : '?';
    url = `${url}${sep}connection_limit=2`;
  }

  return new PrismaClient({
    datasources: url ? { db: { url } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma || getPrismaClient();

globalForPrisma.prisma = prisma;
