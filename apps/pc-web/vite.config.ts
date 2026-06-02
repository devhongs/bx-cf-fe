import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  publicDir: '../../public',
  plugins: [viteReact()],
  server: {
    port: 3000,
  },
});
