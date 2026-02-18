import type { ComponentType, SVGProps } from 'react';
import { Link, useParams } from 'react-router';
import { getSectionsForTrack } from '@/content/shared/sections';
import { cn } from '@/lib/utils';
import {
  Compass,
  Brain,
  MessageSquare,
  GitBranch,
  Shield,
  PenTool,
  Clock,
  TrendingUp,
  FileCode,
  FolderTree,
  Map,
  AlertTriangle,
  TestTube,
  Plug,
  Puzzle,
  Search,
  Package,
  Target,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Track, Section } from '@/content/shared/types';

type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { className?: string }
>;

const iconMap: Record<string, IconComponent> = {
  Compass,
  Brain,
  MessageSquare,
  GitBranch,
  Shield,
  PenTool,
  Clock,
  TrendingUp,
  FileCode,
  FolderTree,
  Map,
  AlertTriangle,
  TestTube,
  Plug,
  Puzzle,
  Search,
  Package,
  Target,
};

type Annotation =
  | { type: 'group-header'; label: string; first: boolean }
  | { type: 'track-note' };

/** Return an annotation to render before this section, if any. */
function getAnnotation(
  section: Section,
  index: number,
  track: Track,
): Annotation | null {
  // "Core Topics" header before the very first section (both tracks)
  if (index === 0) {
    return { type: 'group-header', label: 'Core Topics', first: true };
  }

  // Developer track: "Developer Topics" header before 1.9
  if (track === 'developer' && section.id === '1.9') {
    return { type: 'group-header', label: 'Developer Topics', first: false };
  }

  // General track: track note between 1.8 and 1.17
  if (track === 'general' && section.id === '1.17') {
    return { type: 'track-note' };
  }

  return null;
}

interface SidebarProps {
  track: Track;
  className?: string;
  onNavClick?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  track,
  className,
  onNavClick,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const { section: activeSlug } = useParams<{ section: string }>();
  const sections = getSectionsForTrack(track);

  return (
    <TooltipProvider>
      <nav
        className={cn('flex flex-col gap-0.5', className)}
        aria-label="Section navigation"
      >
        {onToggleCollapse && (
          <div
            className={cn(
              'mb-2 flex',
              collapsed ? 'justify-center' : 'justify-end pr-1',
            )}
          >
            <button
              onClick={onToggleCollapse}
              className="rounded-md p-1.5 text-muted-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={
                collapsed
                  ? 'Expand sidebar (\u2318B)'
                  : 'Collapse sidebar (\u2318B)'
              }
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>
        )}

        {sections.map((section, index) => {
          const Icon = section.icon ? iconMap[section.icon] : null;
          const isActive = activeSlug === section.slug;
          const annotation = getAnnotation(section, index, track);
          const isStarterKit = section.slug === 'starter-kit';
          const needsDivider = isStarterKit && !annotation && index > 0;

          return (
            <div key={section.id}>
              {/* Group headers */}
              {!collapsed && annotation?.type === 'group-header' && (
                <div
                  className={cn(
                    'px-3 pb-1',
                    annotation.first ? 'pt-0' : 'mt-4 pt-2',
                  )}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    {annotation.label}
                  </span>
                </div>
              )}

              {/* General track note between core topics and starter kit */}
              {!collapsed && annotation?.type === 'track-note' && (
                <div className="my-2 border-y border-border px-3 py-3">
                  <p className="text-[11px] leading-snug text-muted-foreground/60 italic">
                    More topics are available in the Developer Playbook.
                  </p>
                  <Link
                    to="/developer"
                    onClick={onNavClick}
                    className="mt-1 inline-block text-[11px] font-medium text-primary hover:underline"
                  >
                    Switch to Developer track
                  </Link>
                </div>
              )}

              {/* Divider before Starter Kit when no annotation already provides one */}
              {!collapsed && needsDivider && (
                <div className="my-2 border-t border-border" />
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={`/${track}/${section.slug}`}
                    onClick={onNavClick}
                    className={cn(
                      'flex rounded-md py-2 text-sm transition-colors',
                      collapsed
                        ? 'justify-center px-0'
                        : 'items-start gap-2.5 px-3',
                      isStarterKit
                        ? isActive
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'bg-primary/5 font-medium text-primary hover:bg-primary/10'
                        : isActive
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {Icon && (
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0',
                          !collapsed && 'mt-0.5',
                          isStarterKit && 'text-primary',
                        )}
                      />
                    )}
                    {!collapsed && (
                      <span>
                        <span className="mr-1.5 text-xs text-muted-foreground/70">
                          {section.id}
                        </span>{' '}
                        {section.sidebarTitle ?? section.title}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" sideOffset={8}>
                    <span>
                      {section.id} {section.sidebarTitle ?? section.title}
                    </span>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
