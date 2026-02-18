import { useSiteConfig } from '@/hooks/useClientConfig';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

/**
 * Renders the client logo when configured, with dark mode asset switching.
 * When no dark variant is provided, wraps the logo in a subtle light container
 * in dark mode so dark-text logos remain visible.
 * Returns null when no clientLogoUrl is set — safe to render unconditionally.
 */
export function ClientLogo() {
  const siteConfig = useSiteConfig();
  const { resolvedTheme } = useTheme();

  if (!siteConfig.clientLogoUrl) return null;

  const isDark = resolvedTheme === 'dark';
  const hasDarkVariant = Boolean(siteConfig.clientLogoDarkUrl);
  const src =
    isDark && hasDarkVariant
      ? siteConfig.clientLogoDarkUrl
      : siteConfig.clientLogoUrl;

  const alt = siteConfig.clientLogoAlt || `${siteConfig.companyName} logo`;

  const maxWidth = Math.min(siteConfig.clientLogoMaxWidth ?? 200, 280);

  const needsContainer = isDark && !hasDarkVariant;

  const img = (
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      className="h-auto"
      style={{ maxWidth }}
    />
  );

  if (needsContainer) {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center',
          'rounded-lg bg-white/95 px-5 py-3',
          'border border-white/20',
        )}
      >
        {img}
      </div>
    );
  }

  return img;
}
