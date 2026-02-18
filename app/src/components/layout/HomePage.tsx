import { Link } from 'react-router';
import { BookOpen, Terminal, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getFilteredSectionsForTrack } from '@/content/shared/sections';
import { useSiteConfig, useSectionsConfig } from '@/hooks/useClientConfig';
import { ClientLogo } from '@/components/content/ClientLogo';
import { ProviderLogo } from '@/components/content/ProviderLogo';
import { cn } from '@/lib/utils';

export function HomePage() {
  const siteConfig = useSiteConfig();
  const sectionsConfig = useSectionsConfig();
  const generalSections = getFilteredSectionsForTrack(
    'general',
    sectionsConfig,
    siteConfig.hasDeveloperTrack,
  );
  const developerSections = getFilteredSectionsForTrack(
    'developer',
    sectionsConfig,
    siteConfig.hasDeveloperTrack,
  );

  const hasClientLogo = Boolean(siteConfig.clientLogoUrl);

  return (
    <main id="main-content" className="flex flex-1 items-start">
      <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16">
        {/* Cover page hero — centre-aligned, three-zone layout */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col items-center text-center">
            {/* Zone 1 — Provider branding */}
            <div className="mb-3">
              <ProviderLogo className="max-w-[160px] sm:max-w-[200px]" />
            </div>

            {/* Zone 2 — Document title */}
            <h1
              className="mb-2 font-bold tracking-tight text-foreground"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}
            >
              Your practical guide to working with Claude AI
            </h1>
            <p className="text-sm text-muted-foreground">
              Prepared by {siteConfig.consultantName} &middot;{' '}
              {siteConfig.trainingDate}
            </p>

            {/* Zone 3 — Client branding (conditional) */}
            {hasClientLogo && (
              <div className="mt-4 flex w-full flex-col items-center">
                <div className="w-full max-w-xs border-t border-border" />
                <p className="pt-3 mb-2 text-xs font-medium tracking-wide text-muted-foreground/70 uppercase">
                  Prepared for
                </p>
                <ClientLogo />
              </div>
            )}
          </div>

          {/* Description text — below hero zones */}
          <p className="mx-auto mt-4 max-w-xl text-center text-base text-muted-foreground sm:text-lg">
            {siteConfig.metaDescription}
            {siteConfig.companyName !== 'Your Organisation' &&
              ` at ${siteConfig.companyName.replace(' Limited', '')}`}
            .{' '}
            {siteConfig.hasDeveloperTrack
              ? 'Choose your track below.'
              : 'Get started below.'}
          </p>
        </motion.div>

        {/* Track cards — compact, differentiated with accent colours */}
        <motion.div
          className={cn(
            'grid gap-4 sm:gap-5',
            siteConfig.hasDeveloperTrack
              ? 'md:grid-cols-2'
              : 'md:grid-cols-1 max-w-lg',
          )}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* General Users track */}
          <Link
            to="/general"
            className="group block"
            aria-label="General Users track — for all team members"
          >
            <Card className="h-full border-l-4 border-l-blue-500 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:border-l-blue-400">
              <CardHeader>
                <div className="mb-1 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400">
                    <BookOpen className="h-4.5 w-4.5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {generalSections.length} sections
                  </Badge>
                </div>
                <CardTitle>
                  <h2 className="text-xl font-semibold">General Users</h2>
                </CardTitle>
                <CardDescription>
                  For all team members — everyday tasks, content creation, and
                  business workflows.
                </CardDescription>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-all group-hover:gap-2.5 dark:text-blue-400">
                  Explore track
                  <ArrowRight className="h-4 w-4" />
                </span>
              </CardHeader>
            </Card>
          </Link>

          {/* Developer track (only when enabled) */}
          {siteConfig.hasDeveloperTrack && (
            <Link
              to="/developer"
              className="group block"
              aria-label="Developer track — for the development team"
            >
              <Card className="h-full border-l-4 border-l-violet-500 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:border-l-violet-400">
                <CardHeader>
                  <div className="mb-1 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:bg-violet-400/15 dark:text-violet-400">
                      <Terminal className="h-4.5 w-4.5" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {developerSections.length} sections
                    </Badge>
                  </div>
                  <CardTitle>
                    <h2 className="text-xl font-semibold">Developers</h2>
                  </CardTitle>
                  <CardDescription>
                    For the development team — Claude Code, codebase mapping,
                    testing, and technical workflows.
                  </CardDescription>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 transition-all group-hover:gap-2.5 dark:text-violet-400">
                    Explore track
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
          )}
        </motion.div>
      </div>
    </main>
  );
}
