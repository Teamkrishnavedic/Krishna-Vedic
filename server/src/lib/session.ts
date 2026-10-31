import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { Pool } from 'pg';

const PgStore = pgSession(session);

const globalForSession = globalThis as unknown as {
  __sessionStore?: session.Store;
  __sessionPool?: Pool;
};

function createSessionStore(): session.Store {
  if (globalForSession.__sessionStore) {
    return globalForSession.__sessionStore;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))) {
    // Strip sslmode parameters so pg.Pool accepts explicit ssl config for cloud PostgreSQL (Aiven/Supabase/etc.)
    const connStr = databaseUrl
      .replace('?sslmode=require', '')
      .replace('&sslmode=require', '');

    const isProduction = process.env.NODE_ENV === 'production';

    // In serverless environments, keep connection pool small (max 2) to avoid exhausting DB connections
    const pool =
      globalForSession.__sessionPool ||
      new Pool({
        connectionString: connStr,
        ssl: {
          rejectUnauthorized: false,
        },
        max: isProduction ? 2 : 5,
        idleTimeoutMillis: 15000,
        connectionTimeoutMillis: 5000,
      });

    pool.on('error', (err) => {
      console.error('PostgreSQL session pool error:', err);
    });

    globalForSession.__sessionPool = pool;

    const store = new PgStore({
      pool,
      createTableIfMissing: true,
      tableName: 'user_sessions',
      ttl: 7 * 24 * 60 * 60, // 7 days in seconds
      // Disable recurring prune interval in serverless production to avoid dangling timers
      pruneSessionInterval: isProduction ? false : 60 * 15,
    });

    globalForSession.__sessionStore = store;
    return store;
  }

  console.warn('⚠️ No PostgreSQL database URL found, using fallback memory store');
  const memoryStore = new session.MemoryStore();
  globalForSession.__sessionStore = memoryStore;
  return memoryStore;
}

export const sessionStore = createSessionStore();
