import { useRouteError } from 'react-router';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RootErrorPage() {
  const error = useRouteError();

  console.error('RootErrorPage caught an error:', error);

  return (
    <main
      id="main-content"
      className="flex min-h-[calc(100dvh-3.5rem)] flex-1 items-center justify-center"
    >
      <div className="mx-auto max-w-md px-4 py-12 text-center sm:px-6">
        <p className="text-6xl font-bold text-muted-foreground/30">Error</p>
        <h1 className="mt-4 text-xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. Reloading the page should get things
          back to normal.
        </p>
        <div className="mt-8 flex justify-center">
          <Button
            variant="default"
            size="sm"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reload page
          </Button>
        </div>
      </div>
    </main>
  );
}
