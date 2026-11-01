import session from 'express-session';
import { prisma } from './prisma';

const globalForSession = globalThis as unknown as {
  __sessionStore?: session.Store;
};

/**
 * High-performance, serverless-optimized session store backed by Prisma.
 *
 * Why this is superior in Serverless (Vercel) + Aiven PostgreSQL:
 * 1. Zero extra connections: Reuses the existing Prisma database connection instead of
 *    spawning a separate pg.Pool with its own idle connections.
 * 2. No cold-start penalty: Does NOT run table existence queries on every Lambda cold start.
 * 3. Graceful degradation: If database slots are temporarily saturated, session reads
 *    degrade to guest mode rather than throwing a fatal 500 internal server error.
 */
class PrismaSessionStore extends session.Store {
  get = async (
    sid: string,
    callback: (err?: any, session?: session.SessionData | null) => void
  ) => {
    try {
      const rows = await prisma.$queryRawUnsafe<Array<{ sess: any; expire: Date }>>(
        'SELECT "sess", "expire" FROM "user_sessions" WHERE "sid" = $1 LIMIT 1;',
        sid
      );

      if (!rows || rows.length === 0) {
        return callback(null, null);
      }

      const row = rows[0];
      const expireDate = new Date(row.expire);

      // Clean up if expired
      if (expireDate.getTime() < Date.now()) {
        await this.destroy(sid, () => {});
        return callback(null, null);
      }

      const sessData = typeof row.sess === 'string' ? JSON.parse(row.sess) : row.sess;
      return callback(null, sessData);
    } catch (err: any) {
      // In serverless, avoid crashing public routes (e.g. /api/products, /api/categories) on transient DB hiccups
      console.warn('⚠️ Session read notice (continuing as guest):', err.message || err);
      return callback(null, null);
    }
  };

  set = async (
    sid: string,
    sessionData: session.SessionData,
    callback?: (err?: any) => void
  ) => {
    try {
      const maxAge = sessionData.cookie?.maxAge || 7 * 24 * 60 * 60 * 1000;
      const expire = new Date(Date.now() + maxAge);
      const sessJson = JSON.stringify(sessionData);

      await prisma.$executeRawUnsafe(
        `INSERT INTO "user_sessions" ("sid", "sess", "expire")
         VALUES ($1, $2::json, $3)
         ON CONFLICT ("sid") DO UPDATE SET "sess" = $2::json, "expire" = $3;`,
        sid,
        sessJson,
        expire
      );

      if (callback) callback();
    } catch (err: any) {
      console.warn('⚠️ Session save notice:', err.message || err);
      if (callback) callback();
    }
  };

  destroy = async (sid: string, callback?: (err?: any) => void) => {
    try {
      await prisma.$executeRawUnsafe(
        'DELETE FROM "user_sessions" WHERE "sid" = $1;',
        sid
      );
      if (callback) callback();
    } catch (err: any) {
      console.warn('⚠️ Session destroy notice:', err.message || err);
      if (callback) callback();
    }
  };

  touch = async (
    sid: string,
    sessionData: session.SessionData,
    callback?: (err?: any) => void
  ) => {
    try {
      const maxAge = sessionData.cookie?.maxAge || 7 * 24 * 60 * 60 * 1000;
      const expire = new Date(Date.now() + maxAge);

      await prisma.$executeRawUnsafe(
        'UPDATE "user_sessions" SET "expire" = $1 WHERE "sid" = $2;',
        expire,
        sid
      );

      if (callback) callback();
    } catch (err: any) {
      console.warn('⚠️ Session touch notice:', err.message || err);
      if (callback) callback();
    }
  };
}

function createSessionStore(): session.Store {
  if (globalForSession.__sessionStore) {
    return globalForSession.__sessionStore;
  }

  const isProduction = process.env.NODE_ENV === 'production';

  // In local development, use high-speed MemoryStore to prevent exhausting DB connections
  if (!isProduction) {
    const memoryStore = new session.MemoryStore();
    globalForSession.__sessionStore = memoryStore;
    return memoryStore;
  }

  // In production, use Prisma-backed session store:
  // Reuses the single Prisma client connection (0 extra connections)
  // Completely eliminates pg.Pool connection exhaustion
  const store = new PrismaSessionStore();
  globalForSession.__sessionStore = store;
  return store;
}

export const sessionStore = createSessionStore();
