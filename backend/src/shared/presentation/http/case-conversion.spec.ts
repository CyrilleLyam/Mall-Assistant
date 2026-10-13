import {
  camelizeKeys,
  snakeizeKeys,
  toCamelCase,
  toSnakeCase,
} from './case-conversion.js';

describe('case conversion', () => {
  it('converts single keys in both directions', () => {
    expect(toSnakeCase('openTime')).toBe('open_time');
    expect(toSnakeCase('categoryId')).toBe('category_id');
    expect(toSnakeCase('floor')).toBe('floor');
    expect(toCamelCase('open_time')).toBe('openTime');
    expect(toCamelCase('name_en')).toBe('nameEn');
    expect(toCamelCase('floor')).toBe('floor');
  });

  it('converts nested objects and arrays', () => {
    const input = { storeList: [{ nameEn: 'A', openingHours: { openTime: '09:00' } }] };

    expect(snakeizeKeys(input)).toEqual({
      store_list: [{ name_en: 'A', opening_hours: { open_time: '09:00' } }],
    });
  });

  it('round-trips camelCase through snake_case', () => {
    const input = { tenantId: '1', nameEn: 'A', nested: { startDate: '2026-01-01' } };

    expect(camelizeKeys(snakeizeKeys(input))).toEqual(input);
  });

  it('leaves values, dates, null and primitives untouched', () => {
    const date = new Date('2026-01-01T00:00:00Z');

    expect(snakeizeKeys({ createdAt: date, someValue: 'keepThisCase' })).toEqual({
      created_at: date,
      some_value: 'keepThisCase',
    });
    expect(snakeizeKeys(null)).toBeNull();
    expect(snakeizeKeys(undefined)).toBeUndefined();
    expect(camelizeKeys('open_time')).toBe('open_time');
  });
});
