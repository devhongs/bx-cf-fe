import { resolve } from 'node:path';

import babel from '@rolldown/plugin-babel';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  // 운영 서버는 /mobile 하위 경로로 서빙되므로 빌드 시 base 를 /mobile/ 로 설정한다.
  // dev 서버는 루트(/)로 유지한다.
  base: command === 'build' ? '/mobile/' : '/',
  publicDir: '../../public',
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,
      routeFileIgnorePattern: '.*\\(modal\\).*',
    }),
    viteReact(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
  server: {
    // 개발 시 API 요청을 백엔드로 프록시해 same-origin으로 만든다 (CORS/크로스도메인 쿠키 문제 회피).
    // VITE_API_URL 을 상대경로(/channel/...)로 두면 브라우저 → dev 서버 → 백엔드로 전달된다.
    proxy: {
      '/channel': {
        target: 'http://192.168.110.217',
        changeOrigin: true,
        // changeOrigin 은 Host 만 바꾸고 Origin 헤더는 그대로 두는데,
        // Spring 이 Origin: http://localhost:* 를 403 으로 거부하므로 Origin 을 제거해 same-origin 요청처럼 보낸다.
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.removeHeader('origin');
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      react: resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  define: {
    'process.env': {},
  },
}));
// Trigger reload
