import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup-vitest.ts'],
    // Skip API/E2E tests that require a running server in CI
    exclude: ['tests/**'],
  },
});


