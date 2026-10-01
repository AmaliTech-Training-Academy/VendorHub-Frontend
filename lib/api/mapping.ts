/**
 * The real backend is snake_case throughout (in_stock, business_name,
 * created_at, ...); the app is camelCase throughout. These convert whole
 * response/payload objects between the two, deeply, so each resource's API
 * layer doesn't have to rename every field by hand — only the handful of
 * fields that differ by more than casing (e.g. business_name -> name) need
 * an explicit rename on top, via a schema .transform() or a small mapper.
 */

function toCamelCase(key: string): string {
  return key.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

function toSnakeCase(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mapKeysDeep(value: unknown, convert: (key: string) => string): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => mapKeysDeep(item, convert));
  }
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [convert(key), mapKeysDeep(val, convert)]),
    );
  }
  return value;
}

/** Converts every key in a response (recursively) from snake_case to camelCase. */
export function keysToCamelCase(value: unknown): unknown {
  return mapKeysDeep(value, toCamelCase);
}

/** Converts every key in a payload (recursively) from camelCase to snake_case. */
export function keysToSnakeCase(value: unknown): unknown {
  return mapKeysDeep(value, toSnakeCase);
}

/**
 * DRF DecimalFields (delivery_fee, price, ...) are serialized as strings
 * matching /^-?\d{0,8}(?:\.\d{0,2})?$/, not JSON numbers.
 */
export function parseDecimal(value: string): number {
  return Number(value);
}

/** Formats a number back to the same "up to 2 decimal places" string shape. */
export function formatDecimal(value: number): string {
  return value.toFixed(2);
}
