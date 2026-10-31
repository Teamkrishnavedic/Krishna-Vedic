import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { Pool } from 'pg';
import { getResolvedDatabaseUrl } from './dns-resolve';

const PgStore = pgSession(session);

const globalForSession = globalThis as unknown as {
  __sessionStore?: session.Store;
  __sessionPool?: Pool;
};

function createSessionStore(): session.Store {
  if (globalForSession.__sessionStore) {
    return globalForSession.__sessionStore;
  }

  const isProduction = process.env.NODE_ENV === 'production';

  // In local development, use high-speed MemoryStore to:
  // 1. Prevent exhausting precious cloud DB connection slots on Aiven (20-slot limit).
  // 2. Prevent local ISP / Windows DNS resolution errors ('ENOTFOUND').
  // 3. Deliver instantaneous (0ms) session response times.
  if (!isProduction) {
    const memoryStore = new session.MemoryStore();
    globalForSession.__sessionStore = memoryStore;
    return memoryStore;
  }

  const databaseUrl = getResolvedDatabaseUrl();

  if (databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))) {
    try {
      // Strip sslmode parameters so pg.Pool accepts explicit ssl config for cloud PostgreSQL (Aiven/Supabase/etc.)
      const connStr = databaseUrl
        .replace('?sslmode=require', '')
        .replace('&sslmode=require', '');

      // In serverless environments, keep connection pool small (max 2) to avoid exhausting DB connections
      const pool =
        globalForSession.__sessionPool ||
        new Pool({
          connectionString: connStr,
          ssl: {
            rejectUnauthorized: false,
          },
          max: 2,
          idleTimeoutMillis: 5000,
          connectionTimeoutMillis: 5000,
        });

      pool.on('error', (err) => {
        console.error('PostgreSQL session pool error:', err.message || err);
      });

      globalForSession.__sessionPool = pool;

      const store = new PgStore({
        pool,
        createTableIfMissing: true,
        tableName: 'user_sessions',
        ttl: 7 * 24 * 60 * 60, // 7 days in seconds
        pruneSessionInterval: false, // Disabled in serverless
      });

      globalForSession.__sessionStore = store;
      return store;
    } catch (err: any) {
      console.error('⚠️ Failed to initialize PG session store, falling back to memory store:', err.message);
    }
  }

  console.warn('⚠️ Using fallback memory store for sessions');
  const memoryStore = new session.MemoryStore();
  globalForSession.__sessionStore = memoryStore;
  return memoryStore;
}

export const sessionStore = createSessionStore();
