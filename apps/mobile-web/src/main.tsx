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

// API 초기화 — 앱 시작 시 한 번만 설정.
// mock 서버(mock/server.js)도 Spring과 동일한 envelope/JWT 계약을 따르므로 단일 코드패스로 동작한다.
httpService.init({
  baseURL: API_URL,
  timeout: API_CONFIG.TIMEOUT,
  auth: createHttpAuthConfig(),
});

// Import the generated route tree

import { queryClient } from './queryClient.ts';

import reportWebVitals from './reportWebVitals.ts';
import { routeTree } from './routeTree.gen';

import '@/shared/styles/styles.css';

// Create a new router instance
const router = createRouter({
  routeTree,
  // Vite base(/mobile/ 또는 /)와 동일한 경로를 라우터 basepath 로 사용한다.
  basepath: import.meta.env.BASE_URL,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
