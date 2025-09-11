// Vitest globals are enabled via vitest.config.ts
// Shim minimal Jest APIs used by legacy tests
declare global {
  // Provide loose index signature to silence TS7017 on globalThis usage in tests
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Global {}
  // Augment globalThis with jest shim type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var jest: any;
}

globalThis.jest = {
  fn: (impl?: (...args: any[]) => any) => (globalThis as any).vi.fn(impl as any),
  mock: (path: string, factory?: any) => (globalThis as any).vi.mock(path, factory),
  spyOn: (...args: any[]) => (globalThis as any).vi.spyOn(...args),
  clearAllMocks: () => (globalThis as any).vi.clearAllMocks(),
  restoreAllMocks: () => (globalThis as any).vi.restoreAllMocks(),
  resetModules: () => (globalThis as any).vi.resetModules(),
} as any;

export { };


