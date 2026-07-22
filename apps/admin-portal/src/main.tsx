import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import {
  API_CONFIG,
  API_URL,
  AlertHost,
  Toaster,
  createHttpAuthConfig,
  httpService,
} from '@bx/shared';

httpService.init({
  baseURL: API_URL,
  timeout: API_CONFIG.TIMEOUT,
  auth: createHttpAuthConfig(),
});

import { queryClient } from './queryClient.ts';
import { routeTree } from './routeTree.gen';

import '@/shared/styles/styles.css';

const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
        <AlertHost />
      </QueryClientProvider>
    </StrictMode>,
  );
}
