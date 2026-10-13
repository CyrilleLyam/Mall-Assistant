export interface SampleTenant {
  id: string;
  nameEn: string;
  nameKm: string;
}

export interface SampleSearchQuery {
  term: string;
  resultCount: number;
  createdAt: Date;
}

export interface SampleStoreView {
  tenantId: string;
  query: string;
  createdAt: Date;
}

export interface SampleSearchHistory {
  queries: SampleSearchQuery[];
  storeViews: SampleStoreView[];
}

export interface SampleSearchHistoryOptions {
  now: Date;
  tenants: SampleTenant[];
  seed?: number;
}

interface TermProfile {
  term: string;
  weight: number;
}

export const DAYS_OF_HISTORY = 30;
export const MALL_UTC_OFFSET_HOURS = 7;
export const OPEN_HOUR = 9;
export const CLOSE_HOUR = 21;

const MS_PER_HOUR = 3_600_000;
const MS_PER_MINUTE = 60_000;
const VIEW_PROBABILITY = 0.65;
const DEFAULT_SEED = 20_261_013;

const TERM_PROFILES: TermProfile[] = [
  { term: 'starbucks', weight: 10 },
  { term: 'coffee', weight: 9 },
  { term: 'zara', weight: 8 },
  { term: 'nike', weight: 6 },
  { term: 'pharmacy', weight: 6 },
  { term: 'apple', weight: 5 },
  { term: 'cineplex', weight: 5 },
  { term: 'h&m', weight: 4 },
  { term: 'uniqlo', weight: 4 },
  { term: 'samsung', weight: 3 },
  { term: 'bank', weight: 3 },
  { term: 'atm', weight: 3 },
  { term: 'កាហ្វេ', weight: 3 },
  { term: 'ឱសថស្ថាន', weight: 2 },
  { term: 'parking', weight: 4 },
  { term: 'sushi', weight: 3 },
  { term: 'pizza', weight: 2 },
  { term: 'toilet', weight: 2 },
  { term: 'gym', weight: 2 },
  { term: 'burger', weight: 2 },
  { term: 'bubble tea', weight: 1 },
  { term: 'kfc', weight: 1 },
];

const createRandom = (seed: number): (() => number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
};

const mallMidnightUtc = (now: Date, daysAgo: number): number => {
  const local = new Date(now.getTime() + MALL_UTC_OFFSET_HOURS * MS_PER_HOUR);
  return (
    Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() - daysAgo) -
    MALL_UTC_OFFSET_HOURS * MS_PER_HOUR
  );
};

const isWeekend = (mallMidnight: number): boolean => {
  const weekday = new Date(mallMidnight + MALL_UTC_OFFSET_HOURS * MS_PER_HOUR).getUTCDay();
  return weekday === 0 || weekday === 6;
};

export const tenantsMatching = (term: string, tenants: SampleTenant[]): SampleTenant[] =>
  tenants.filter(
    (tenant) =>
      tenant.nameEn.toLowerCase().includes(term) || tenant.nameKm.toLowerCase().includes(term),
  );

export function buildSampleSearchHistory({
  now,
  tenants,
  seed = DEFAULT_SEED,
}: SampleSearchHistoryOptions): SampleSearchHistory {
  const random = createRandom(seed);
  const totalWeight = TERM_PROFILES.reduce((sum, profile) => sum + profile.weight, 0);
  const matchesByTerm = new Map(
    TERM_PROFILES.map((profile) => [profile.term, tenantsMatching(profile.term, tenants)]),
  );

  const pickTerm = (): string => {
    let remaining = random() * totalWeight;
    for (const profile of TERM_PROFILES) {
      remaining -= profile.weight;
      if (remaining < 0) {
        return profile.term;
      }
    }
    return TERM_PROFILES[TERM_PROFILES.length - 1].term;
  };

  const queries: SampleSearchQuery[] = [];
  const storeViews: SampleStoreView[] = [];

  for (let daysAgo = DAYS_OF_HISTORY - 1; daysAgo >= 0; daysAgo--) {
    const midnight = mallMidnightUtc(now, daysAgo);
    const trend = Math.round((DAYS_OF_HISTORY - 1 - daysAgo) / 5);
    const weekendBoost = isWeekend(midnight) ? 6 : 0;
    const searchesToday = 6 + trend + weekendBoost + Math.floor(random() * 8);

    for (let index = 0; index < searchesToday; index++) {
      const term = pickTerm();
      const matches = matchesByTerm.get(term) ?? [];
      const minuteOfDay =
        OPEN_HOUR * 60 + Math.floor(random() * (CLOSE_HOUR - OPEN_HOUR) * 60);
      const createdAt = new Date(midnight + minuteOfDay * MS_PER_MINUTE);
      if (createdAt.getTime() > now.getTime()) {
        continue;
      }

      queries.push({ term, resultCount: matches.length, createdAt });

      if (matches.length > 0 && random() < VIEW_PROBABILITY) {
        const tenant = matches[Math.floor(random() * matches.length)];
        const viewedAt = new Date(createdAt.getTime() + (5 + Math.floor(random() * 40)) * 1000);
        if (viewedAt.getTime() <= now.getTime()) {
          storeViews.push({ tenantId: tenant.id, query: term, createdAt: viewedAt });
        }
      }
    }
  }

  queries.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  storeViews.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  return { queries, storeViews };
}
