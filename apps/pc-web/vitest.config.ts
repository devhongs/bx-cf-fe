import { resolve } from 'node:path';

import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// 테스트 전용 설정. tailwind/react-compiler 등 런타임 빌드 플러그인은 제외하고
// JSX 변환(react)과 jsdom 환경, @ 경로 별칭만 구성한다.
// e2e(playwright)는 별도 러너를 쓰므로 vitest 대상에서 제외한다.
export default defineConfig({
  plugins: [viteReact()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
