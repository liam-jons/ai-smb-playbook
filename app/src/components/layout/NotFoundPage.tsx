import { Link } from 'react-router';
import { ArrowLeft, Users, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteConfig } from '@/hooks/useClientConfig';

export function NotFoundPage() {
  const siteConfig = useSiteConfig();

  return (
    <main
      id="main-content"
      className="flex min-h-[calc(100dvh-3.5rem)] flex-1 items-center justify-center"
    >
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-6xl font-bold text-muted-foreground/30">404</p>
        <h1 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default" size="sm">
            <Link to="/general" className="gap-2">
              <Users className="h-4 w-4" />
              General Track
            </Link>
          </Button>
          {siteConfig.hasDeveloperTrack && (
            <Button asChild variant="outline" size="sm">
              <Link to="/developer" className="gap-2">
                <Code className="h-4 w-4" />
                Developer Track
              </Link>
            </Button>
          )}
        </div>

        <Button asChild variant="ghost" size="sm" className="mt-4">
          <Link to="/" className="gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to homepage
          </Link>
        </Button>
      </div>
    </main>
  );
}
