import session from 'express-session';
import pgSession from 'connect-pg-simple';
import { Pool } from 'pg';

const PgStore = pgSession(session);

function createSessionStore(): session.Store {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'))) {
    // Strip sslmode parameters so pg.Pool accepts explicit ssl config for cloud PostgreSQL (Aiven/Supabase/etc.)
    const connStr = databaseUrl
      .replace('?sslmode=require', '')
      .replace('&sslmode=require', '');

    const pool = new Pool({
      connectionString: connStr,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
    });

    pool.on('error', (err) => {
      console.error('PostgreSQL session pool error:', err);
    });

    return new PgStore({
      pool,
      createTableIfMissing: true,
      tableName: 'user_sessions',
      ttl: 7 * 24 * 60 * 60, // 7 days in seconds
      pruneSessionInterval: 60 * 15, // Prune expired sessions every 15 minutes
    });
  }

  console.warn('⚠️ No PostgreSQL database URL found, using fallback memory store');
  return new session.MemoryStore();
}

export const sessionStore = createSessionStore();
