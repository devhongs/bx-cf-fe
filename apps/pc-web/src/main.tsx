import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { httpService, API_URL, API_CONFIG, IS_MOCK_API, mockApiResponseInterceptor } from '@bx/shared';

// API 초기화 — baseURL·timeout을 앱 시작 시 한 번만 설정
httpService.init({
  baseURL: API_URL,
  timeout: API_CONFIG.TIMEOUT,
  interceptors: IS_MOCK_API ? { response: mockApiResponseInterceptor } : undefined,
});

import { queryClient } from './queryClient.ts';
import { routeTree } from './routeTree.gen';

import '@/shared/styles/styles.css';

const router = createRouter({
  routeTree,
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
      </QueryClientProvider>
    </StrictMode>,
  );
}
