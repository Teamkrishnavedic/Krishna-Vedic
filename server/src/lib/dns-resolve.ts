import { execSync } from 'child_process';

let resolvedUrlCache: string | null = null;

export function getResolvedDatabaseUrl(): string {
  if (resolvedUrlCache) return resolvedUrlCache;

  const originalUrl = process.env.DATABASE_URL || '';
  if (!originalUrl) return '';

  // In production (e.g. Vercel), DNS resolution is managed by cloud infrastructure.
  if (process.env.NODE_ENV === 'production') {
    resolvedUrlCache = originalUrl;
    return originalUrl;
  }

  const hostMatch = originalUrl.match(/@([^:/]+)/);
  if (!hostMatch || !hostMatch[1]) {
    resolvedUrlCache = originalUrl;
    return originalUrl;
  }
  const hostname = hostMatch[1];

  // If already an IP address, nothing to do
  if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(hostname)) {
    resolvedUrlCache = originalUrl;
    return originalUrl;
  }

  try {
    const out = execSync(`nslookup ${hostname} 8.8.8.8`, { timeout: 4000 }).toString();
    const matches = [...out.matchAll(/Address:\s+([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/g)];
    const ip = matches.length > 1 ? matches[matches.length - 1][1] : null;
    if (ip) {
      const resolved = originalUrl.replace(hostname, ip);
      process.env.DATABASE_URL = resolved;
      resolvedUrlCache = resolved;
      console.log(`[DNS] Cloud database host mapped to ${ip}`);
      return resolved;
    }
  } catch (e: any) {
    console.warn('[DNS] DNS fallback resolution skipped:', e.message);
  }

  resolvedUrlCache = originalUrl;
  return originalUrl;
}

export function ensureDatabaseHostResolved(): void {
  getResolvedDatabaseUrl();
}

// Auto-run resolution on load in development
if (process.env.NODE_ENV !== 'production') {
  try {
    getResolvedDatabaseUrl();
  } catch {
    // Non-blocking
  }
}

