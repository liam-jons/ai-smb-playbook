/**
 * React context for runtime client configuration.
 *
 * Wraps the app and provides config values via useContext hooks.
 * For the default client, uses the bundled config (no network request).
 * For named clients, loads JSON from /clients/<slug>.json.
 */

import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { ClientConfig } from './client-config-schema';
import {
  DEFAULT_CONFIG,
  extractClientSlug,
  loadClientConfig,
} from './config-loader';

export interface ClientConfigContextValue {
  config: ClientConfig;
  isLoading: boolean;
  clientSlug: string;
  error: string | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ClientConfigContext = createContext<ClientConfigContextValue>({
  config: DEFAULT_CONFIG,
  isLoading: false,
  clientSlug: 'default',
  error: null,
});

export function ClientConfigProvider({ children }: { children: ReactNode }) {
  const [clientSlug] = useState(() =>
    typeof window !== 'undefined'
      ? extractClientSlug(window.location.hostname)
      : 'default',
  );
  const [config, setConfig] = useState<ClientConfig>(DEFAULT_CONFIG);
  // Initialise loading state based on whether we need to fetch
  const [isLoading, setIsLoading] = useState(clientSlug !== 'default');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clientSlug === 'default') return; // Use bundled default, no fetch needed

    let cancelled = false;

    loadClientConfig(clientSlug)
      .then((loaded) => {
        if (!cancelled) {
          setConfig(loaded);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load config',
          );
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clientSlug]);

  // Update document title and meta description when config changes
  useEffect(() => {
    if (config.siteConfig.appTitle) {
      document.title = config.siteConfig.appTitle;
    }
    if (config.siteConfig.metaDescription) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', config.siteConfig.metaDescription);
      }
    }
  }, [config.siteConfig.appTitle, config.siteConfig.metaDescription]);

  if (isLoading) {
    return (
      <ClientConfigContext.Provider
        value={{ config, isLoading, clientSlug, error }}
      >
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </ClientConfigContext.Provider>
    );
  }

  if (error) {
    return (
      <ClientConfigContext.Provider
        value={{ config, isLoading, clientSlug, error }}
      >
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-destructive">
              Failed to load client configuration
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </ClientConfigContext.Provider>
    );
  }

  return (
    <ClientConfigContext.Provider
      value={{ config, isLoading, clientSlug, error }}
    >
      {children}
    </ClientConfigContext.Provider>
  );
}
