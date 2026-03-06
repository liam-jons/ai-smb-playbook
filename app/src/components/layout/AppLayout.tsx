import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Analytics } from '@vercel/analytics/react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FeedbackWidget } from './FeedbackWidget';

const CLIENT_PARAM_KEY = 'playbook-client-param';

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Persist the ?client= query parameter across SPA navigations.
  // When accessed via the shared Vercel URL (not a subdomain), the client
  // slug is determined by ?client=. Internal <Link> components don't
  // preserve search params, so we store the param in sessionStorage and
  // restore it whenever it goes missing.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const client = params.get('client');

    if (client) {
      sessionStorage.setItem(CLIENT_PARAM_KEY, client);
    } else {
      const saved = sessionStorage.getItem(CLIENT_PARAM_KEY);
      if (saved) {
        params.set('client', saved);
        navigate(`${location.pathname}?${params.toString()}${location.hash}`, {
          replace: true,
        });
      }
    }
  }, [location.pathname, location.search, location.hash, navigate]);

  return (
    <div className="theme-scanline-container flex min-h-screen flex-col">
      {/* Skip link — first focusable element */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header />

      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>

      <Footer />
      <FeedbackWidget />
      <Analytics />
    </div>
  );
}
