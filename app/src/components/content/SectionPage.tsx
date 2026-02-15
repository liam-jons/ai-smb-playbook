import { Suspense } from 'react';
import { useParams, Navigate } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getSectionBySlug, getSectionsForTrack } from '@/content/shared/sections';
import { useTrack } from '@/hooks/useTrack';
import { sectionComponents } from '@/content/shared/registry';

export function SectionPage() {
  const { track } = useTrack();
  const { section: sectionSlug } = useParams<{ section: string }>();

  // If no section slug, redirect to first section
  if (!sectionSlug) {
    const firstSection = getSectionsForTrack(track)[0];
    if (firstSection) {
      return <Navigate to={`/${track}/${firstSection.slug}`} replace />;
    }
    return null;
  }

  const section = getSectionBySlug(sectionSlug);

  // Section not found
  if (!section) {
    return (
      <div className="py-12 text-center">
        <h1 className="mb-2 text-2xl font-bold">Section Not Found</h1>
        <p className="text-muted-foreground">
          The section &ldquo;{sectionSlug}&rdquo; does not exist.
        </p>
      </div>
    );
  }

  // Check if a custom component exists for this section
  const CustomComponent = sectionComponents[section.slug];

  return (
    <article>
      {/* Section header */}
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {section.id}
          </Badge>
          {section.track === 'both' && (
            <Badge variant="secondary" className="text-xs">
              All users
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
          {section.title}
        </h1>
        {section.subtitle && (
          <p className="text-lg text-muted-foreground">{section.subtitle}</p>
        )}
        <Separator className="mt-6" />
      </header>

      {/* Section content */}
      {CustomComponent ? (
        <Suspense
          fallback={
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">Loading section...</p>
            </div>
          }
        >
          <CustomComponent />
        </Suspense>
      ) : (
        <SectionPlaceholder description={section.description} />
      )}
    </article>
  );
}

function SectionPlaceholder({ description }: { description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
      <p className="mb-2 text-sm font-medium text-muted-foreground">
        Content coming soon
      </p>
      <p className="text-sm text-muted-foreground/70">{description}</p>
    </div>
  );
}
