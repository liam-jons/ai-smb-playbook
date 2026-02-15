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
  FileCode,
  FolderTree,
  Map,
  AlertTriangle,
  TestTube,
  Plug,
  Puzzle,
  Search,
} from 'lucide-react';
import type { Track } from '@/content/shared/types';

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>;

const iconMap: Record<string, IconComponent> = {
  Compass,
  Brain,
  MessageSquare,
  GitBranch,
  Shield,
  PenTool,
  Clock,
  FileCode,
  FolderTree,
  Map,
  AlertTriangle,
  TestTube,
  Plug,
  Puzzle,
  Search,
};

interface SidebarProps {
  track: Track;
  className?: string;
  onNavClick?: () => void;
}

export function Sidebar({ track, className, onNavClick }: SidebarProps) {
  const { section: activeSlug } = useParams<{ section: string }>();
  const sections = getSectionsForTrack(track);

  return (
    <nav
      className={cn('flex flex-col gap-0.5', className)}
      aria-label="Section navigation"
    >
      {sections.map((section) => {
        const Icon = section.icon ? iconMap[section.icon] : null;
        const isActive = activeSlug === section.slug;

        return (
          <Link
            key={section.id}
            to={`/${track}/${section.slug}`}
            onClick={onNavClick}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-accent font-medium text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            <span className="truncate">
              <span className="mr-1.5 text-xs text-muted-foreground/70">
                {section.id}
              </span>
              {section.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
