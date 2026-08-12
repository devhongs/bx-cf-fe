import { resolve } from 'node:path';

import babel from '@rolldown/plugin-babel';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

import {
  formatApiEnvironmentLog,
  loadApiEnvironment,
} from '../../scripts/vite-api-environment.mjs';

export default defineConfig(({ command, mode }) => {
  const apiEnvironment = loadApiEnvironment({ mode, envDir: __dirname });
  console.info(formatApiEnvironmentLog(apiEnvironment));

  return {
    // 운영 서버는 /admin 하위 경로로 서빙되므로 빌드 시 base 를 /admin/ 로 설정한다.
    // dev 서버는 루트(/)로 유지한다.
    base: command === 'build' ? '/admin/' : '/',
    publicDir: '../../public',
    plugins: [
      TanStackRouterVite({
        autoCodeSplitting: true,
      }),
      // `import Icon from './x.svg?react'` 형태만 React 컴포넌트로 변환한다.
      // (?react 접미사 없는 import는 기존대로 URL 문자열로 유지)
      svgr(),
      viteReact(),
      babel({
        presets: [reactCompilerPreset()],
      }),
    ],
    server: {
      port: 3002,
      proxy: {
        '/channel': {
          target: apiEnvironment.proxyTarget,
          changeOrigin: true,
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
  };
});
