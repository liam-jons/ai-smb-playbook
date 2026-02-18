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

/** Bundled default config — current Phew values. Used as fallback. */
export const DEFAULT_CONFIG: ClientConfig = {
  siteConfig: {
    ...(siteConfig as unknown as ClientConfig['siteConfig']),
    primaryAiTool: 'Claude',
    hasDeveloperTrack: true,
    exampleRecurringTasks: [...siteConfig.exampleRecurringTasks],
  },
  overlays: {},
  sections: { enabled: null, disabled: [] },
  starterKit: {
    enabledCustomCategories: ['developer-tools', 'creative-design'],
  },
};

/** Extract client slug from hostname. */
export function extractClientSlug(hostname: string): string {
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Check for ?client= query param override in dev
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const clientParam = params.get('client');
      if (clientParam) return clientParam;
    }
    return 'default';
  }
  const parts = hostname.split('.');
  // subdomain.playbook.aisolutionhub.co.uk = 5 parts
  if (parts.length > 4) return parts[0];
  return 'default';
}

/** Load client config from JSON. Returns default config if fetch fails. */
export async function loadClientConfig(slug: string): Promise<ClientConfig> {
  if (slug === 'default') return DEFAULT_CONFIG;
  try {
    const response = await fetch(`/clients/${slug}.json`);
    if (!response.ok) return DEFAULT_CONFIG;
    const partial = (await response.json()) as Partial<ClientConfig>;
    return mergeWithDefaults(partial);
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
