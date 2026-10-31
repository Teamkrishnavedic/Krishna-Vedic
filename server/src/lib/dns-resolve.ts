import { execSync } from 'child_process';

export function ensureDatabaseHostResolved(): void {
  // In production (e.g. Vercel), DNS resolution is managed by the cloud host infrastructure.
  if (process.env.NODE_ENV === 'production') return;

  const originalUrl = process.env.DATABASE_URL;
  if (!originalUrl) return;

  const hostMatch = originalUrl.match(/@([^:/]+)/);
  if (!hostMatch || !hostMatch[1]) return;
  const hostname = hostMatch[1];

  // If already an IP address, nothing to do
  if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(hostname)) return;

  try {
    const out = execSync(`nslookup ${hostname} 8.8.8.8`, { timeout: 4000 }).toString();
    const matches = [...out.matchAll(/Address:\s+([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/g)];
    const ip = matches.length > 1 ? matches[matches.length - 1][1] : null;
    if (ip) {
      process.env.DATABASE_URL = originalUrl.replace(hostname, ip);
      console.log(`[DNS] Cloud database host mapped to ${ip}`);
    }
  } catch (e: any) {
    console.warn('[DNS] DNS fallback resolution skipped:', e.message);
  }
}
