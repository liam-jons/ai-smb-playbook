/**
 * Shared slug extraction and sanitisation utilities.
 *
 * Used by:
 *   - SPA config loader (`config/config-loader.ts`)
 *   - Vercel serverless feedback API (`api/feedback.ts`)
 *
 * Hostname-based routing logic:
 *   localhost / 127.0.0.1              -> "default"
 *   phew.playbook.aisolutionhub.co.uk  -> "phew"   (5+ parts)
 *   playbook.aisolutionhub.co.uk       -> "default"
 */

/**
 * Extract a client slug from a hostname string.
 *
 * This is the core logic shared between all environments (SPA, serverless).
 * Environment-specific overrides (e.g. `?client=` query param) are applied
 * by the caller, not here.
 */
export function extractClientSlugFromHostname(hostname: string): string {
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'default';
  const parts = hostname.split('.');
  // subdomain.playbook.aisolutionhub.co.uk = 5 parts
  if (parts.length > 4) return parts[0];
  return 'default';
}

/**
 * Sanitise a slug to prevent path traversal and ensure safe usage in URLs
 * and file paths.
 *
 * Returns "default" if the slug contains unsafe characters.
 */
const SAFE_SLUG_PATTERN = /^[a-z0-9-]+$/;

export function sanitiseSlug(slug: string): string {
  const lower = slug.toLowerCase();
  if (SAFE_SLUG_PATTERN.test(lower)) return lower;
  return 'default';
}
