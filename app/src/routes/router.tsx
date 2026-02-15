import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { TrackLayout } from '@/components/layout/TrackLayout';
import { HomePage } from '@/components/layout/HomePage';
import { SectionPage } from '@/components/content/SectionPage';
import { ProcessDocPage } from '@/content/shared/ProcessDocPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'process',
        element: <ProcessDocPage />,
      },
      {
        path: ':track',
        element: <TrackLayout />,
        children: [
          {
            index: true,
            element: <SectionPage />,
          },
          {
            path: ':section',
            element: <SectionPage />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
