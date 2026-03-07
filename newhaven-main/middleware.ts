import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-process cache so we don't hit Supabase on every single request.
// Resets on cold start; good enough for a small store.
let cachedMaintenance: { value: boolean; at: number } | null = null;
const CACHE_TTL_MS = 15_000; // re-check every 15 seconds

async function isMaintenanceModeEnabled(): Promise<boolean> {
  const now = Date.now();
  if (cachedMaintenance && now - cachedMaintenance.at < CACHE_TTL_MS) {
    return cachedMaintenance.value;
  }
  try {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/store_settings?key=eq.maintenance_mode&select=value&limit=1`;
    const res = await fetch(url, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      // Don't cache at the HTTP layer — we manage the cache ourselves
      cache: 'no-store',
    });
    const data: Array<{ value: string }> = await res.json();
    const enabled = data?.[0]?.value === 'true';
    cachedMaintenance = { value: enabled, at: now };
    return enabled;
  } catch {
    // Fail open — never block the site if the DB call fails
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin routes: security headers, skip maintenance check ──────
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  }

  // ── Pass through: maintenance page itself, API, static assets ───
  if (
    pathname === '/maintenance' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    // static files (has a dot in the last segment)
    /\.[^/]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── Maintenance mode check for all store pages ───────────────────
  const inMaintenance = await isMaintenanceModeEnabled();
  if (inMaintenance) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
