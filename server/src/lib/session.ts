import { Store } from 'express-session';

// Use a simple in-memory store for development (SQLite compatible)
// In production with PostgreSQL, switch to connect-pg-simple

class SimpleMemoryStore extends Store {
  private sessions: Map<string, { session: string; expires: Date }> = new Map();

  constructor() {
    super();
    // Cleanup expired sessions every 15 minutes
    setInterval(() => this.cleanup(), 15 * 60 * 1000);
  }

  get(sid: string, callback: (err: any, session?: any) => void): void {
    const entry = this.sessions.get(sid);
    if (!entry) return callback(null, null);
    if (entry.expires < new Date()) {
      this.sessions.delete(sid);
      return callback(null, null);
    }
    try {
      callback(null, JSON.parse(entry.session));
    } catch (e) {
      callback(e);
    }
  }

  set(sid: string, session: any, callback?: (err?: any) => void): void {
    try {
      const expires = session.cookie?.expires
        ? new Date(session.cookie.expires)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      this.sessions.set(sid, { session: JSON.stringify(session), expires });
      callback?.();
    } catch (e) {
      callback?.(e);
    }
  }

  destroy(sid: string, callback?: (err?: any) => void): void {
    this.sessions.delete(sid);
    callback?.();
  }

  private cleanup() {
    const now = new Date();
    for (const [sid, entry] of this.sessions) {
      if (entry.expires < now) this.sessions.delete(sid);
    }
  }
}

export const sessionStore = new SimpleMemoryStore();
