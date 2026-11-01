import { PrismaClient } from '@prisma/client';
import { getResolvedDatabaseUrl } from './dns-resolve';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getPrismaClient(): PrismaClient {
  let url = getResolvedDatabaseUrl();
  const isVercel = process.env.VERCEL === '1' || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (url) {
    // Allow 2 connections per container so that transactions and concurrent queries
    // never deadlock each other while staying well within Aiven's 20-connection limit.
    const connLimit = isVercel ? '2' : '3';

    if (!url.includes('connection_limit=')) {
      const sep = url.includes('?') ? '&' : '?';
      url = `${url}${sep}connection_limit=${connLimit}&pool_timeout=15`;
    } else {
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
