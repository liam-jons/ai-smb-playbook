import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, MessageSquareHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSettings } from './ThemeSettings';
import { cn } from '@/lib/utils';
import { useSiteConfig } from '@/hooks/useClientConfig';

export function Header() {
  const siteConfig = useSiteConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const currentTrack = location.pathname.startsWith('/general')
    ? 'general'
    : location.pathname.startsWith('/developer')
      ? 'developer'
      : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo / Title — flex-1 for equal-width balancing with actions */}
        <div className="flex flex-1 items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground hover:text-primary transition-colors"
          >
            {siteConfig.appTitle}
          </Link>
        </div>

        {/* Desktop nav — centred via equal-width siblings */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Track navigation"
        >
          <Link
            to="/general"
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              currentTrack === 'general'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
            aria-current={currentTrack === 'general' ? 'page' : undefined}
          >
            General Users
          </Link>
          {siteConfig.hasDeveloperTrack && (
            <Link
              to="/developer"
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                currentTrack === 'developer'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
              aria-current={currentTrack === 'developer' ? 'page' : undefined}
            >
              Developers
            </Link>
          )}
        </nav>

        {/* Desktop actions — flex-1 for equal-width balancing with title */}
        <div className="hidden flex-1 items-center justify-end gap-1 md:flex">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Send feedback"
            onClick={() => {
              const event = new CustomEvent('open-feedback');
              window.dispatchEvent(event);
            }}
          >
            <MessageSquareHeart className="h-5 w-5" />
          </Button>
          <ThemeSettings />
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeSettings />
          <Button
            variant="ghost"
            size="icon"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-border bg-background px-4 py-3 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-2">
            <Link
              to="/general"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                currentTrack === 'general'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent',
              )}
            >
              General Users
            </Link>
            {siteConfig.hasDeveloperTrack && (
              <Link
                to="/developer"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors',
                  currentTrack === 'developer'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent',
                )}
              >
                Developers
              </Link>
            )}
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => {
                const event = new CustomEvent('open-feedback');
                window.dispatchEvent(event);
                setMobileMenuOpen(false);
              }}
            >
              <MessageSquareHeart className="mr-2 h-4 w-4" />
              Send Feedback
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
