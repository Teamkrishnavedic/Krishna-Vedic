import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@krishnavedic/shared': path.resolve(__dirname, '../shared/src/index.ts'),
    },
  },
  build: {
    sourcemap: false,
  },
  server: {
    host: true,
    allowedHosts: true,
    port: parseInt(process.env.PORT || '5173', 10),
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
