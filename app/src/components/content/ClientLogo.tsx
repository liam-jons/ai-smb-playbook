import { useSiteConfig } from '@/hooks/useClientConfig';
import { useTheme } from '@/hooks/useTheme';

/**
 * Renders the client logo when configured, with dark mode asset switching.
 * Returns null when no clientLogoUrl is set — safe to render unconditionally.
 */
export function ClientLogo() {
  const siteConfig = useSiteConfig();
  const { resolvedTheme } = useTheme();

  if (!siteConfig.clientLogoUrl) return null;

  const isDark = resolvedTheme === 'dark';
  const src =
    isDark && siteConfig.clientLogoDarkUrl
      ? siteConfig.clientLogoDarkUrl
      : siteConfig.clientLogoUrl;

  const alt = siteConfig.clientLogoAlt || `${siteConfig.companyName} logo`;

  const maxWidth = Math.min(siteConfig.clientLogoMaxWidth ?? 200, 280);

  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      className="h-auto"
      style={{ maxWidth }}
    />
  );
}
