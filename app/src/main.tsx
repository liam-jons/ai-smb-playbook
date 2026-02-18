import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ClientConfigProvider } from '@/config/client-config-context';
import { router } from '@/routes/router';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClientConfigProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ClientConfigProvider>
  </StrictMode>,
);
