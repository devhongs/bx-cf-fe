import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // 운영 서버는 /admin 하위 경로로 서빙되므로 빌드 시 base 를 /admin/ 로 설정한다.
  // dev 서버는 루트(/)로 유지한다.
  base: command === 'build' ? '/admin/' : '/',
  publicDir: '../../public',
  plugins: [viteReact()],
  server: {
    port: 3002,
  },
}));
