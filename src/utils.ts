export function isObject(value: any): value is {[key: string]: any} {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}
