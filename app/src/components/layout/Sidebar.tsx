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
import type { Track, Section } from '@/content/shared/types';

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

/** Parse the sub-number from a section ID like "1.7" -> 7, "1.16" -> 16 */
function parseSectionNumber(id: string): number {
  const parts = id.split('.');
  return parts.length > 1 ? parseInt(parts[1], 10) : 0;
}

/** Detect numbering gaps between adjacent sections and return a note to display. */
function getGapNote(
  prev: Section | undefined,
  current: Section,
  track: Track
): string | null {
  if (!prev) return null;

  const prevNum = parseSectionNumber(prev.id);
  const currNum = parseSectionNumber(current.id);

  // Only show a note when more than one section number is skipped
  if (currNum - prevNum <= 1) return null;

  if (track === 'general') {
    return 'Sections 1.8\u20131.15 are in the Developer track';
  }
  if (track === 'developer') {
    return 'Section 1.7 is in the General track';
  }

  return null;
}

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
      {sections.map((section, index) => {
        const Icon = section.icon ? iconMap[section.icon] : null;
        const isActive = activeSlug === section.slug;
        const prevSection = index > 0 ? sections[index - 1] : undefined;
        const gapNote = getGapNote(prevSection, section, track);

        return (
          <div key={section.id}>
            {gapNote && (
              <div className="my-2 border-t border-border px-3 pt-2">
                <p className="text-[11px] leading-snug text-muted-foreground/60 italic">
                  {gapNote}
                </p>
              </div>
            )}
            <Link
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
          </div>
        );
      })}
    </nav>
  );
}
