/// <reference types="vite-react-ssg" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  // vite-react-ssg renders all routes in parallel by default (concurrency: 20).
  // The i18n singleton is shared across renders, so concurrent SSG renders race
  // and produce wrong-locale HTML. Force serial rendering — adds ~1 s to build
  // but guarantees each prerendered file matches its locale.
  ssgOptions: {
    concurrency: 1,
  },
});
