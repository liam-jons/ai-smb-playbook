/**
 * Client configuration loader.
 *
 * Provides utilities for extracting the client slug from the hostname,
 * loading client JSON, and merging with defaults.
 *
 * This is the ONLY file that imports directly from site.ts.
 * All other files should use the React context hooks instead.
 */

import type { ClientConfig } from './client-config-schema';
import { siteConfig } from './site';
import { extractClientSlugFromHostname, sanitiseSlug } from '../utils/slug';

/** Bundled default config — generic neutral values. Used as fallback. */
export const DEFAULT_CONFIG: ClientConfig = {
  siteConfig: {
    ...(siteConfig as unknown as ClientConfig['siteConfig']),
    hasDeveloperTrack: true,
    exampleRecurringTasks: [...siteConfig.exampleRecurringTasks],
  },
  overlays: {},
  sections: { enabled: null, disabled: [] },
  starterKit: {
    enabledCustomCategories: [],
  },
};

/**
 * Extract client slug from hostname, with SPA-specific dev overrides.
 *
 * Delegates core hostname logic to the shared utility, then applies
 * dev-only overrides (?client= query param, VITE_DEFAULT_CLIENT env var).
 */
export function extractClientSlug(hostname: string): string {
  const baseSlug = extractClientSlugFromHostname(hostname);

  // In local dev, allow overriding the slug via query param or env var
  if (baseSlug === 'default') {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const clientParam = params.get('client');
      if (clientParam) return sanitiseSlug(clientParam);
    }
    const envClient = import.meta.env.VITE_DEFAULT_CLIENT;
    if (envClient) return sanitiseSlug(envClient as string);
  }

  return sanitiseSlug(baseSlug);
}

// ---------------------------------------------------------------------------
// localStorage config cache helpers (1-hour TTL)
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 3_600_000; // 1 hour

interface CachedConfig {
  config: ClientConfig;
  timestamp: number;
}

function cacheKey(slug: string): string {
  return `playbook-client-config-${slug}`;
}

function readCachedConfig(slug: string): ClientConfig | null {
  try {
    const raw = localStorage.getItem(cacheKey(slug));
    if (!raw) return null;
    const cached: CachedConfig = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(cacheKey(slug));
      return null;
    }
    return cached.config;
  } catch {
    // localStorage unavailable (e.g. private browsing) — fall through
    return null;
  }
}

function writeCachedConfig(slug: string, config: ClientConfig): void {
  try {
    const entry: CachedConfig = { config, timestamp: Date.now() };
    localStorage.setItem(cacheKey(slug), JSON.stringify(entry));
  } catch {
    // Silently ignore — storage may be full or unavailable
  }
}

// ---------------------------------------------------------------------------

/** Load client config from JSON. Returns default config if fetch fails. */
export async function loadClientConfig(slug: string): Promise<ClientConfig> {
  // Sanitise the slug before using it in a fetch URL (path traversal prevention)
  const safeSlug = sanitiseSlug(slug);
  if (safeSlug === 'default') return DEFAULT_CONFIG;

  // Check localStorage cache first
  const cached = readCachedConfig(safeSlug);
  if (cached) return cached;

  try {
    const response = await fetch(`/clients/${safeSlug}.json`);
    if (!response.ok) return DEFAULT_CONFIG;
    const partial = (await response.json()) as Partial<ClientConfig>;
    const merged = mergeWithDefaults(partial);
    writeCachedConfig(safeSlug, merged);
    return merged;
  } catch {
    return DEFAULT_CONFIG;
  }
}

/** Merge partial config with defaults to ensure all required fields present. */
export function mergeWithDefaults(
  partial: Partial<ClientConfig>,
): ClientConfig {
  return {
    siteConfig: { ...DEFAULT_CONFIG.siteConfig, ...partial.siteConfig },
    overlays: { ...DEFAULT_CONFIG.overlays, ...partial.overlays },
    sections: { ...DEFAULT_CONFIG.sections, ...partial.sections },
    starterKit: { ...DEFAULT_CONFIG.starterKit, ...partial.starterKit },
  };
}
