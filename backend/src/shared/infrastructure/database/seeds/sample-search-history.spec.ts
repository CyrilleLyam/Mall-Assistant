import {
  CLOSE_HOUR,
  DAYS_OF_HISTORY,
  MALL_UTC_OFFSET_HOURS,
  OPEN_HOUR,
  buildSampleSearchHistory,
  tenantsMatching,
  type SampleTenant,
} from './sample-search-history.js';

const tenants: SampleTenant[] = [
  { id: 't-starbucks', nameEn: 'Starbucks Coffee', nameKm: 'ស្តាបាក់ កាហ្វេ' },
  { id: 't-brown', nameEn: 'Brown Coffee and Bakery', nameKm: 'ប្រោន កាហ្វេ' },
  { id: 't-zara', nameEn: 'Zara', nameKm: 'ហ្សារ៉ា' },
  { id: 't-nike', nameEn: 'Nike Store', nameKm: 'ហាង ណៃគី' },
  { id: 't-ucare', nameEn: 'UCare Pharmacy', nameKm: 'យូឃែរ ឱសថស្ថាន' },
  { id: 't-apple', nameEn: 'Apple Store (iOne)', nameKm: 'អាយវ័ន (Apple)' },
  { id: 't-major', nameEn: 'Major Cineplex', nameKm: 'មេជ័រ ស៊ីណេផ្លិច' },
  { id: 't-hm', nameEn: 'H&M', nameKm: 'អេច អេន អិម' },
  { id: 't-aba', nameEn: 'ABA Bank Branch & ATMs', nameKm: 'ធនាគារ អេប៊ីអេ' },
];

const now = new Date('2026-10-13T08:30:00Z');
const history = buildSampleSearchHistory({ now, tenants });

const mallDay = (date: Date): string =>
  new Date(date.getTime() + MALL_UTC_OFFSET_HOURS * 3_600_000).toISOString().slice(0, 10);

describe('buildSampleSearchHistory', () => {
  it('is deterministic for the same input', () => {
    expect(buildSampleSearchHistory({ now, tenants })).toEqual(history);
  });

  it('produces a realistic volume of searches and store views', () => {
    expect(history.queries.length).toBeGreaterThan(250);
    expect(history.queries.length).toBeLessThan(1500);
    expect(history.storeViews.length).toBeGreaterThan(50);
    expect(history.storeViews.length).toBeLessThan(history.queries.length);
  });

  it('never places anything in the future or older than the history window', () => {
    const oldest = now.getTime() - (DAYS_OF_HISTORY + 1) * 24 * 3_600_000;
    for (const item of [...history.queries, ...history.storeViews]) {
      expect(item.createdAt.getTime()).toBeLessThanOrEqual(now.getTime());
      expect(item.createdAt.getTime()).toBeGreaterThan(oldest);
    }
  });

  it('keeps every search inside the mall opening hours', () => {
    for (const query of history.queries) {
      const localHour = (query.createdAt.getUTCHours() + MALL_UTC_OFFSET_HOURS) % 24;
      expect(localHour).toBeGreaterThanOrEqual(OPEN_HOUR);
      expect(localHour).toBeLessThan(CLOSE_HOUR);
    }
  });

  it('is sorted from oldest to newest', () => {
    const times = history.queries.map((query) => query.createdAt.getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
  });

  it('calculates each result count from the real store names', () => {
    for (const query of history.queries) {
      expect(query.resultCount).toBe(tenantsMatching(query.term, tenants).length);
    }
  });

  it('includes both searches that found stores and searches that found none', () => {
    const noResultTerms = new Set(
      history.queries.filter((query) => query.resultCount === 0).map((query) => query.term),
    );

    expect(history.queries.some((query) => query.resultCount > 0)).toBe(true);
    expect(noResultTerms.has('parking')).toBe(true);
    expect(noResultTerms.has('sushi')).toBe(true);
    expect(noResultTerms.has('zara')).toBe(false);
  });

  it('opens only stores that match the search, and never after a search with no results', () => {
    for (const view of history.storeViews) {
      const tenant = tenants.find((candidate) => candidate.id === view.tenantId);
      expect(tenant).toBeDefined();
      expect(tenantsMatching(view.query, [tenant!])).toHaveLength(1);
    }
  });

  it('has searches on every one of the last 14 full days, so the chart has no gaps', () => {
    const days = new Set(history.queries.map((query) => mallDay(query.createdAt)));
    for (let daysAgo = 1; daysAgo <= 14; daysAgo++) {
      const day = mallDay(new Date(now.getTime() - daysAgo * 24 * 3_600_000));
      expect(days.has(day)).toBe(true);
    }
  });

  it('adapts the result counts when stores are missing', () => {
    const withoutCoffee = buildSampleSearchHistory({
      now,
      tenants: tenants.filter((tenant) => !tenant.nameEn.includes('Coffee')),
    });

    const coffee = withoutCoffee.queries.filter((query) => query.term === 'coffee');
    expect(coffee.length).toBeGreaterThan(0);
    expect(coffee.every((query) => query.resultCount === 0)).toBe(true);
  });
});
