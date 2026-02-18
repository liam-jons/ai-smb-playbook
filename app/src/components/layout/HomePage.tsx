import { Link } from 'react-router';
import { BookOpen, Terminal, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getFilteredSectionsForTrack } from '@/content/shared/sections';
import { useSiteConfig, useSectionsConfig } from '@/hooks/useClientConfig';
import { cn } from '@/lib/utils';

/** First few sections from each track — gives new users a clear starting point */
const GENERAL_HIGHLIGHTS = [
  'welcome',
  'context',
  'sessions',
  'skills-extensions',
];
const DEVELOPER_HIGHLIGHTS = [
  'claude-md',
  'documentation',
  'codebase-mapping',
  'hallucinations',
];

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

  const generalHighlights = generalSections.filter((s) =>
    GENERAL_HIGHLIGHTS.includes(s.slug),
  );
  const developerHighlights = developerSections.filter((s) =>
    DEVELOPER_HIGHLIGHTS.includes(s.slug),
  );

  return (
    <main id="main-content" className="flex flex-1 items-start">
      <div className="mx-auto w-full max-w-3xl px-4 pt-16 pb-12 sm:px-6 sm:pt-12 sm:py-16">
        {/* Hero — left-aligned, warm, action-oriented */}
        <motion.div
          className="mb-8 sm:mb-10 rounded-xl bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent px-1 py-1 sm:px-2 sm:py-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-2 text-sm font-medium text-primary">
            Prepared by {siteConfig.consultantName} &middot;{' '}
            {siteConfig.trainingDate}
          </p>
          <h1
            className="mb-4 font-bold tracking-tight text-foreground"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            Your practical guide to working with Claude AI
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            {siteConfig.metaDescription} at{' '}
            {siteConfig.companyName.replace(' Limited', '')}.{' '}
            {siteConfig.hasDeveloperTrack
              ? 'Choose your track below.'
              : 'Get started below.'}
          </p>
        </motion.div>

        {/* Track cards — differentiated with accent colours and unique previews */}
        <motion.div
          className={cn(
            'grid gap-6',
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
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {generalSections.length} sections
                  </Badge>
                </div>
                <CardTitle>
                  <h2 className="text-2xl font-semibold">General Users</h2>
                </CardTitle>
                <CardDescription>
                  For all team members. Learn to use Claude effectively for
                  everyday tasks, content creation, and business workflows.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="mb-4 space-y-1 text-sm text-muted-foreground">
                  {generalHighlights.map((s) => (
                    <li key={s.id} className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground/60">
                        {s.id}
                      </span>
                      {s.sidebarTitle || s.title}
                    </li>
                  ))}
                  <li className="text-xs text-muted-foreground/60">
                    + {generalSections.length - generalHighlights.length} more
                    sections
                  </li>
                </ul>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-all group-hover:gap-2.5 dark:text-blue-400">
                  Explore track
                  <ArrowRight className="h-4 w-4" />
                </span>
              </CardContent>
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
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:bg-violet-400/15 dark:text-violet-400">
                      <Terminal className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {developerSections.length} sections
                    </Badge>
                  </div>
                  <CardTitle>
                    <h2 className="text-2xl font-semibold">Developers</h2>
                  </CardTitle>
                  <CardDescription>
                    For the development team. Claude Code, CLAUDE.md files,
                    codebase mapping, testing, and technical workflows.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="mb-4 space-y-1 text-sm text-muted-foreground">
                    {developerHighlights.map((s) => (
                      <li key={s.id} className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground/60">
                          {s.id}
                        </span>
                        {s.sidebarTitle || s.title}
                      </li>
                    ))}
                    <li className="text-xs text-muted-foreground/60">
                      + {developerSections.length - developerHighlights.length}{' '}
                      more sections including all general content
                    </li>
                  </ul>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 transition-all group-hover:gap-2.5 dark:text-violet-400">
                    Explore track
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          )}
        </motion.div>
      </div>
    </main>
  );
}
