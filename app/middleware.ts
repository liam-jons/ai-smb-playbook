/**
 * Vercel Edge Middleware for multi-tenant client routing.
 *
 * Extracts the client slug from the request hostname and injects it
 * as an `x-client-id` header. This allows downstream logic (serverless
 * functions, edge functions) to identify the tenant without re-parsing
 * the URL.
 *
 * Vercel discovers this file automatically -- no vercel.json changes needed.
 */

import { next } from '@vercel/edge';

export default function middleware(request: Request) {
  const hostname = new URL(request.url).hostname;
  const clientSlug = extractClientSlug(hostname);

  return next({
    headers: {
      'x-client-id': clientSlug,
    },
  });
}

function extractClientSlug(hostname: string): string {
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'default';
  const parts = hostname.split('.');
  // subdomain.playbook.aisolutionhub.co.uk = 5 parts
  if (parts.length > 4) return parts[0];
  return 'default';
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|clients|assets).*)'],
};
