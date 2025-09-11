export function hasKey<T extends object>(obj: unknown, key: string): obj is T & Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && Object.prototype.hasOwnProperty.call(obj as object, key);
}


