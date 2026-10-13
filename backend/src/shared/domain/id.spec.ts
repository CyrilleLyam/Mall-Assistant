import { newId } from './id.js';

const UUID_V7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('newId', () => {
  it('generates version 7 UUIDs', () => {
    expect(newId()).toMatch(UUID_V7);
  });

  it('generates ids that sort in creation order', () => {
    const ids = Array.from({ length: 500 }, () => newId());

    expect([...ids].sort()).toEqual(ids);
  });

  it('never repeats', () => {
    const ids = Array.from({ length: 500 }, () => newId());

    expect(new Set(ids).size).toBe(ids.length);
  });
});
