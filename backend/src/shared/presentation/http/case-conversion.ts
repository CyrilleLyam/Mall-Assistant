const isConvertible = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  !(value instanceof Date) &&
  !Buffer.isBuffer(value);

const convertKeys = (
  value: unknown,
  convert: (key: string) => string,
): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => convertKeys(item, convert));
  }
  if (!isConvertible(value)) {
    return value;
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, inner]) => [
      convert(key),
      convertKeys(inner, convert),
    ]),
  );
};

export const toCamelCase = (key: string): string =>
  key.replace(/_+([a-z0-9])/g, (_match, char: string) => char.toUpperCase());

export const toSnakeCase = (key: string): string =>
  key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

export const camelizeKeys = (value: unknown): unknown =>
  convertKeys(value, toCamelCase);

export const snakeizeKeys = (value: unknown): unknown =>
  convertKeys(value, toSnakeCase);
