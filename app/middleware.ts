import { next } from '@vercel/edge';
import { get } from '@vercel/edge-config';

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - assets/ (Vite build output — JS, CSS, fonts)
     * - starter-kit/zips/ (downloadable ZIP files)
     * - _vercel/ (Vercel internals)
     * - favicon.ico, robots.txt
     */
    '/((?!assets/|starter-kit/zips/|_vercel/|favicon\\.ico|robots\\.txt).*)',
  ],
};

const SAFE_SLUG_PATTERN = /^[a-z0-9-]+$/;
const ACCESS_COOKIE = '__playbook_access';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const hostname = url.hostname;
  const pathname = url.pathname;

  // ─── Local development — bypass all checks ────────────────────────────
  if (isLocalDevelopment(hostname)) {
    return handleConfigJsonAccess(pathname, hostname, url);
  }

  // ─── Config JSON protection (existing logic) ──────────────────────────
  if (pathname.startsWith('/clients/')) {
    return handleConfigJsonAccess(pathname, hostname, url);
  }

  // ─── Page access protection via token/cookie ──────────────────────────
  const slug = resolveClientSlug(hostname, url);

  // No slug resolved (e.g. bare Vercel URL with no ?client=) — allow
  // through. The SPA will show the default/fallback content.
  if (!slug) {
    return next();
  }

  // Check for existing access cookie
  const cookies = parseCookies(request.headers.get('cookie') ?? '');
  const cookieValue = cookies[ACCESS_COOKIE];
  if (cookieValue === slug) {
    return next();
  }

  // Check for ?t= token parameter
  const token = url.searchParams.get('t');
  if (token) {
    const isValid = await validateToken(slug, token);
    if (isValid) {
      // Set access cookie and redirect to clean URL (strip ?t=)
      url.searchParams.delete('t');
      const response = new Response(null, {
        status: 302,
        headers: { Location: url.toString() },
      });
      response.headers.set(
        'Set-Cookie',
        `${ACCESS_COOKIE}=${slug}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${COOKIE_MAX_AGE}`,
      );
      return response;
    }
    // Invalid token — fall through to 403
  }

  // No valid cookie or token — return 403
  return unauthorisedResponse();
}

// ─── Config JSON access control (preserved from original) ─────────────────

function handleConfigJsonAccess(
  pathname: string,
  hostname: string,
  url: URL,
): Response {
  // Always allow logo files
  if (pathname.startsWith('/clients/logos/')) {
    return next();
  }

  // Block _template.json outside localhost
  if (pathname === '/clients/_template.json') {
    if (isLocalDevelopment(hostname)) return next();
    return new Response('Not Found', { status: 404 });
  }

  // Only process .json config files
  if (!pathname.endsWith('.json')) {
    return next();
  }

  // Extract and validate slug from pathname
  const slugMatch = pathname.match(/^\/clients\/([a-z0-9-]+)\.json$/);
  if (!slugMatch) {
    return new Response('Not Found', { status: 404 });
  }
  const requestedSlug = slugMatch[1];

  // Allow all on localhost
  if (isLocalDevelopment(hostname)) {
    return next();
  }

  // Subdomain access — only allow matching config
  const expectedSlug = extractSlugFromHostname(hostname);
  if (expectedSlug !== null) {
    return requestedSlug === expectedSlug
      ? next()
      : new Response('Not Found', { status: 404 });
  }

  // Non-subdomain access — require ?client= match
  const clientParam = url.searchParams.get('client');
  if (clientParam && sanitiseSlug(clientParam) === requestedSlug) {
    return next();
  }

  return new Response('Not Found', { status: 404 });
}

// ─── Token validation via Edge Config ─────────────────────────────────────

async function validateToken(
  slug: string,
  token: string,
): Promise<boolean> {
  try {
    const tokens = await get<Record<string, string>>('access-tokens');
    if (!tokens) return false;
    return tokens[slug] === token;
  } catch {
    // Edge Config unavailable — fail open for resilience.
    // This ensures the site remains accessible if Edge Config has an issue.
    // The config JSON isolation (separate logic) still protects client data.
    console.error('Edge Config read failed — allowing access');
    return true;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function resolveClientSlug(hostname: string, url: URL): string | null {
  // Subdomain takes priority
  const subdomainSlug = extractSlugFromHostname(hostname);
  if (subdomainSlug) return subdomainSlug;

  // Fall back to ?client= parameter
  const clientParam = url.searchParams.get('client');
  if (clientParam) return sanitiseSlug(clientParam);

  return null;
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

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  for (const pair of cookieHeader.split(';')) {
    const [key, ...rest] = pair.trim().split('=');
    if (key) cookies[key] = rest.join('=');
  }
  return cookies;
}

function unauthorisedResponse(): Response {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Access Required</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; background: #f8fafc; color: #1e293b;
    }
    .card {
      max-width: 440px; padding: 2.5rem; text-align: center;
      background: white; border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; }
    p { font-size: 0.9rem; line-height: 1.6; color: #64748b; }
    p + p { margin-top: 0.5rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Access Required</h1>
    <p>This playbook requires an access link to view.</p>
    <p>If you received this link from your consultant, please check it includes the full URL with the access token. If you need assistance, contact your AI Solution Hub consultant.</p>
  </div>
</body>
</html>`;
  return new Response(html, {
    status: 403,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
