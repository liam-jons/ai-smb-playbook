/**
 * React hooks for accessing client configuration.
 *
 * These hooks replace direct `import { siteConfig } from '@/config/site'`
 * throughout the codebase, enabling runtime configuration via context.
 */

import { useContext } from 'react';
import {
  ClientConfigContext,
  type ClientConfigContextValue,
} from '@/config/client-config-context';

/** Full client config context (config, loading state, slug, error). */
export function useClientConfig(): ClientConfigContextValue {
  return useContext(ClientConfigContext);
}

/** Just the siteConfig portion — direct replacement for `import { siteConfig }`. */
export function useSiteConfig() {
  const { config } = useContext(ClientConfigContext);
  return config.siteConfig;
}

/** Just the overlays portion. */
export function useOverlays() {
  const { config } = useContext(ClientConfigContext);
  return config.overlays;
}

/** Just the sections config portion. */
export function useSectionsConfig() {
  const { config } = useContext(ClientConfigContext);
  return config.sections;
}
