import { Outlet } from 'react-router';
import { Analytics } from '@vercel/analytics/react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FeedbackWidget } from './FeedbackWidget';

export function AppLayout() {
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
