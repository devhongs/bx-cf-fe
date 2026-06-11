import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { API_CONFIG, API_URL, createHttpAuthConfig, httpService } from '@bx/shared';

// API 초기화 — 앱 시작 시 한 번만 설정.
// mock 서버(mock/server.js)도 Spring과 동일한 envelope/JWT 계약을 따르므로 단일 코드패스로 동작한다.
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
