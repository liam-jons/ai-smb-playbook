import { useState, useCallback, useEffect } from 'react';
import { Outlet, Navigate, useParams, useLocation, Link } from 'react-router';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sidebar } from './Sidebar';
import { useTrack } from '@/hooks/useTrack';
import {
  getSectionsForTrack,
  getAdjacentSections,
  getSectionBySlug,
} from '@/content/shared/sections';
import { cn } from '@/lib/utils';

export function TrackLayout() {
  const { track, isValidTrack } = useTrack();
  const { section: sectionSlug } = useParams<{ section: string }>();
  const location = useLocation();
  // Track which pathname the sidebar was opened on. When the route changes,
  // the derived `sidebarOpen` automatically becomes false — no effect needed.
  const [sidebarOpenFor, setSidebarOpenFor] = useState<string | null>(null);
  const sidebarOpen = sidebarOpenFor === location.pathname;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      if (typeof window === 'undefined') return false;
      return localStorage.getItem('sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sidebar-collapsed', String(next));
      } catch {
        // Ignore — private browsing or storage full
      }
      return next;
    });
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  // Determine whether we are truly on the bare track path (e.g. /general or
  // /developer) rather than a section URL whose params haven't hydrated yet.
  // This prevents a race condition where direct navigation to a section URL
  // (e.g. /general/starter-kit) would momentarily see sectionSlug as undefined
  // and redirect to the first section.
  const pathSegments = location.pathname
    .replace(/\/+$/, '')
    .split('/')
    .filter(Boolean);
  const isBarePath = pathSegments.length === 1 && pathSegments[0] === track;

  if (!isValidTrack) {
    return <Navigate to="/" replace />;
  }

  // Only redirect to the first section when the URL is the bare track path.
  // Do NOT redirect when sectionSlug is merely absent from useParams, as that
  // can happen transiently during initial hydration of a deep-linked URL.
  if (isBarePath && !sectionSlug) {
    const firstSection = getSectionsForTrack(track)[0];
    if (firstSection) {
      return <Navigate to={`/${track}/${firstSection.slug}`} replace />;
    }
  }

  const currentSection = sectionSlug ? getSectionBySlug(sectionSlug) : null;
  const { prev, next } = sectionSlug
    ? getAdjacentSections(sectionSlug, track)
    : { prev: undefined, next: undefined };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-0">
      {/* Desktop sidebar — shown at lg (1024px+) to give content enough room.
          At md (768px) the sidebar consumed ~280px leaving only ~488px for
          content which cramped tables and multi-column layouts. */}
      <aside
        className={cn(
          'hidden shrink-0 border-r border-border transition-all duration-300 lg:block',
          sidebarCollapsed ? 'w-14' : 'w-72',
        )}
      >
        <ScrollArea
          className={cn(
            'h-[calc(100vh-3.5rem-1px)] py-4',
            sidebarCollapsed ? 'px-1.5' : 'pr-2 pl-4',
          )}
        >
          <Sidebar
            track={track}
            collapsed={sidebarCollapsed}
            onToggleCollapse={toggleSidebar}
          />
        </ScrollArea>
      </aside>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile/tablet sidebar trigger — visible below lg breakpoint */}
        <div
          className="flex items-center gap-2 border-b border-border px-4 py-2 lg:hidden"
          role="navigation"
          aria-label="Current section"
        >
          <Sheet
            open={sidebarOpen}
            onOpenChange={(open) =>
              setSidebarOpenFor(open ? location.pathname : null)
            }
          >
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Menu className="h-4 w-4" />
                <span className="text-sm">Sections</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="px-4 pt-4 text-sm font-semibold text-muted-foreground">
                {track === 'general' ? 'General Track' : 'Developer Track'}
              </SheetTitle>
              <ScrollArea className="h-full px-2 py-2">
                <Sidebar
                  track={track}
                  onNavClick={() => setSidebarOpenFor(null)}
                />
              </ScrollArea>
            </SheetContent>
          </Sheet>
          {currentSection && (
            <span className="truncate text-sm text-muted-foreground">
              {currentSection.id} {currentSection.title}
            </span>
          )}
        </div>

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 px-4 py-6 pb-20 sm:px-6 md:px-8 lg:pb-6"
        >
          <div className="mx-auto max-w-3xl">
            <Outlet />
          </div>
        </main>

        {/* Previous / Next navigation */}
        {(prev || next) && (
          <nav
            className="border-t border-border px-4 py-4 sm:px-6 md:px-8"
            aria-label="Section pagination"
          >
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
              {prev ? (
                <Link
                  to={`/${track}/${prev.slug}`}
                  className={cn(
                    'group flex min-h-[44px] items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors',
                    'hover:bg-accent hover:text-foreground',
                  )}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground/70">
                      Previous
                    </div>
                    <div className="font-medium">{prev.title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  to={`/${track}/${next.slug}`}
                  className={cn(
                    'group flex min-h-[44px] items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors',
                    'hover:bg-accent hover:text-foreground',
                  )}
                >
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground/70">Next</div>
                    <div className="font-medium">{next.title}</div>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
