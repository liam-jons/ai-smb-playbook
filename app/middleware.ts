import { next } from '@vercel/edge';

export const config = {
  matcher: ['/clients/:path*'],
};

const SAFE_SLUG_PATTERN = /^[a-z0-9-]+$/;

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;

  // Rule 1: Always allow logo files
  if (pathname.startsWith('/clients/logos/')) {
    return next();
  }

  // Rule 2: Block _template.json outside localhost
  if (pathname === '/clients/_template.json') {
    if (isLocalDevelopment(hostname)) return next();
    return new Response('Not Found', { status: 404 });
  }

  // Rule 3: Only process .json files
  if (!pathname.endsWith('.json')) {
    return next();
  }

  // Rule 4: Extract and validate slug from pathname
  const slugMatch = pathname.match(/^\/clients\/([a-z0-9-]+)\.json$/);
  if (!slugMatch) {
    return new Response('Not Found', { status: 404 });
  }
  const requestedSlug = slugMatch[1];

  // Rule 5: Allow all on localhost
  if (isLocalDevelopment(hostname)) {
    return next();
  }

  // Rule 6: Check hostname-based access
  const expectedSlug = extractSlugFromHostname(hostname);

  // Rule 7: Subdomain access — only allow matching config
  if (expectedSlug !== null) {
    return requestedSlug === expectedSlug
      ? next()
      : new Response('Not Found', { status: 404 });
  }

  // Rule 8: Non-subdomain access — require ?client= match
  const clientParam = url.searchParams.get('client');
  if (clientParam && sanitiseSlug(clientParam) === requestedSlug) {
    return next();
  }

  return new Response('Not Found', { status: 404 });
}

function isLocalDevelopment(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.localhost')
  );
}

function extractSlugFromHostname(hostname: string): string | null {
  const parts = hostname.split('.');
  // subdomain.playbook.aisolutionhub.co.uk = 5 parts
  return parts.length > 4 ? parts[0] : null;
}

function sanitiseSlug(slug: string): string {
  const lower = slug.toLowerCase();
  return SAFE_SLUG_PATTERN.test(lower) ? lower : 'default';
}
