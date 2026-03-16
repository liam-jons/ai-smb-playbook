import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { TrackLayout } from '@/components/layout/TrackLayout';
import { HomePage } from '@/components/layout/HomePage';
import { NotFoundPage } from '@/components/layout/NotFoundPage';
import { RootErrorPage } from '@/components/layout/RootErrorPage';
import { SectionPage } from '@/components/content/SectionPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RootErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
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
        element: <NotFoundPage />,
      },
    ],
  },
]);
