import { ExternalLink } from 'lucide-react';
import { useSiteConfig } from '@/hooks/useClientConfig';

export function Footer() {
  const siteConfig = useSiteConfig();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="flex flex-col items-center gap-3 text-center text-sm text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col gap-1">
            <p>
              Built for{' '}
              <a
                href={siteConfig.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors"
              >
                {siteConfig.companyName}
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
            <p className="text-xs text-muted-foreground/80">
              Built using the tools and workflows covered in this guide.
            </p>
          </div>
          <div className="flex gap-4 text-xs">
            <button
              type="button"
              onClick={() => {
                const event = new CustomEvent('open-feedback');
                window.dispatchEvent(event);
              }}
              className="hover:text-foreground transition-colors"
            >
              Send Feedback
            </button>
            <a
              href={siteConfig.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              {siteConfig.companyUrlDisplay}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
