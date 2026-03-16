import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (props: { error: Error; reset: () => void }) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isChunkError: boolean;
}

function isChunkLoadError(error: Error): boolean {
  if (error.name === 'ChunkLoadError') return true;
  const message = error.message || '';
  return (
    message.includes('Loading chunk') ||
    message.includes('dynamically imported module') ||
    message.includes('Failed to fetch dynamically imported module')
  );
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      isChunkError: isChunkLoadError(error),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, isChunkError: false });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          reset: this.handleReset,
        });
      }

      return (
        <div className="rounded-lg border border-border bg-muted/30 px-6 py-12 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground/60" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            {this.state.isChunkError
              ? 'This section failed to load'
              : 'Something went wrong'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {this.state.isChunkError
              ? 'A newer version of the playbook may have been deployed. Reloading the page should resolve this.'
              : 'An unexpected error occurred while loading this section. You can try again or reload the page.'}
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {!this.state.isChunkError && (
              <Button
                variant="default"
                size="sm"
                onClick={this.handleReset}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
            )}
            <Button
              variant={this.state.isChunkError ? 'default' : 'outline'}
              size="sm"
              onClick={this.handleReload}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reload page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
