import { resolve } from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // 운영 서버는 /pc 하위 경로로 서빙되므로 빌드 시 base 를 /pc/ 로 설정한다.
  // dev 서버(localhost:3000)는 루트(/)로 유지한다.
  base: command === 'build' ? '/pc/' : '/',
  publicDir: '../../public',
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,
    }),
    viteReact(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
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
