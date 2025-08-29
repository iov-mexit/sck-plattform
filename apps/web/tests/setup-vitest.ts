// Vitest globals are enabled via vitest.config.ts
// Shim minimal Jest APIs used by legacy tests
globalThis.jest = {
  fn: (impl?: (...args: any[]) => any) => (globalThis as any).vi.fn(impl as any),
  mock: (path: string, factory?: any) => (globalThis as any).vi.mock(path, factory),
  spyOn: (...args: any[]) => (globalThis as any).vi.spyOn(...args),
  clearAllMocks: () => (globalThis as any).vi.clearAllMocks(),
  restoreAllMocks: () => (globalThis as any).vi.restoreAllMocks(),
  resetModules: () => (globalThis as any).vi.resetModules(),
} as any;

// Basic environment defaults expected by env-validation tests
process.env.NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://secure-knaight.io';
process.env.NEXT_PUBLIC_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

export {};


