import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup-vitest.ts'],
    // Restore default excludes and skip our API/E2E tests directory
    exclude: [...configDefaults.exclude, 'rag-ingestion/node_modules/**'],
  },
});


