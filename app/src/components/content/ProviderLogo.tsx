import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ProviderLogoProps {
  className?: string;
}

/**
 * Renders the AI Solution Hub provider logo with dark mode asset switching.
 * Light mode uses aish-logo-light.svg, dark mode uses aish-logo-dark.svg.
 */
export function ProviderLogo({ className }: ProviderLogoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const src = isDark
    ? '/branding/aish-logo-dark.svg'
    : '/branding/aish-logo-light.svg';

  return (
    <img
      src={src}
      alt="AI Solution Hub"
      loading="eager"
      decoding="async"
      className={cn('h-auto w-full', className)}
    />
  );
}
