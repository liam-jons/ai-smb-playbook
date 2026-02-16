import { Link } from 'react-router';
import { Users, Code, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSectionsForTrack } from '@/content/shared/sections';
import { siteConfig } from '@/config/site';

export function HomePage() {
  const generalSections = getSectionsForTrack('general');
  const developerSections = getSectionsForTrack('developer');

  return (
    <main id="main-content" className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {siteConfig.appTitle}
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            {siteConfig.metaDescription} at{' '}
            {siteConfig.companyName.replace(' Limited', '')}. Choose your track
            to get started.
          </p>
        </div>

        {/* Track cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* General Users track */}
          <Link to="/general" className="group block">
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {generalSections.length} sections
                  </Badge>
                </div>
                <CardTitle className="text-xl">General Users</CardTitle>
                <CardDescription>
                  For all team members. Learn how to use Claude effectively for
                  everyday tasks, content creation, and business workflows.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-4 space-y-1 text-sm text-muted-foreground">
                  {generalSections.slice(0, 4).map((s) => (
                    <li key={s.id} className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground/60">
                        {s.id}
                      </span>
                      {s.title}
                    </li>
                  ))}
                  {generalSections.length > 4 && (
                    <li className="text-xs text-muted-foreground/60">
                      + {generalSections.length - 4} more sections
                    </li>
                  )}
                </ul>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </span>
              </CardContent>
            </Card>
          </Link>

          {/* Developer track */}
          <Link to="/developer" className="group block">
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Code className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {developerSections.length} sections
                  </Badge>
                </div>
                <CardTitle className="text-xl">Developers</CardTitle>
                <CardDescription>
                  For the development team. Covers Claude Code, CLAUDE.md files,
                  codebase mapping, testing, and technical workflows.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-4 space-y-1 text-sm text-muted-foreground">
                  {developerSections.slice(0, 4).map((s) => (
                    <li key={s.id} className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground/60">
                        {s.id}
                      </span>
                      {s.title}
                    </li>
                  ))}
                  {developerSections.length > 4 && (
                    <li className="text-xs text-muted-foreground/60">
                      + {developerSections.length - 4} more sections
                    </li>
                  )}
                </ul>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Meta-narrative note */}
        <p className="mt-8 text-center text-xs text-muted-foreground/70">
          This playbook was itself built using Claude and the workflows it
          describes.
        </p>
      </div>
    </main>
  );
}
