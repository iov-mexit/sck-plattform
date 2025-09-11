import { defineConfig, configDefaults } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup-vitest.ts'],
    // Restore default excludes and skip our API/E2E tests directory
    exclude: [...configDefaults.exclude, 'rag-ingestion/node_modules/**'],
  },
});


