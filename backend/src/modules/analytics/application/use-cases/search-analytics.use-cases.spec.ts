import { Clock } from '../../../../shared/application/clock.js';
import { SearchQuery } from '../../domain/search-query.entity.js';
import {
  DailySearchCount,
  SearchQueryRepository,
  TopSearchTerm,
  TopTermsCriteria,
} from '../../domain/search-query.repository.js';
import { GetSearchesPerDayUseCase } from './get-searches-per-day.use-case.js';
import { GetTopSearchTermsUseCase } from './get-top-search-terms.use-case.js';
import { RecordSearchQueryUseCase } from './record-search-query.use-case.js';

class FixedClock extends Clock {
  now(): Date {
    return new Date('2026-10-13T08:00:00Z');
  }

  today(): string {
    return '2026-10-13';
  }
}

class InMemoryQueries extends SearchQueryRepository {
  saved: SearchQuery[] = [];
  lastTopTerms: TopTermsCriteria | null = null;
  lastSince: Date | null = null;

  constructor(
    private readonly perDay: DailySearchCount[] = [],
    private readonly terms: TopSearchTerm[] = [],
  ) {
    super();
  }

  async save(query: SearchQuery): Promise<void> {
    this.saved.push(query);
  }

  async topTerms(criteria: TopTermsCriteria): Promise<TopSearchTerm[]> {
    this.lastTopTerms = criteria;
    return this.terms;
  }

  async searchesPerDay(since: Date): Promise<DailySearchCount[]> {
    this.lastSince = since;
    return this.perDay;
  }
}

describe('RecordSearchQueryUseCase', () => {
  it('saves the normalized search with the current time', async () => {
    const queries = new InMemoryQueries();

    await new RecordSearchQueryUseCase(queries, new FixedClock()).execute({
      term: '  Zara  ',
      resultCount: 3,
    });

    expect(queries.saved).toHaveLength(1);
    expect(queries.saved[0]).toMatchObject({
      term: 'zara',
      resultCount: 3,
      createdAt: new Date('2026-10-13T08:00:00Z'),
    });
  });

  it('silently skips terms that are too short', async () => {
    const queries = new InMemoryQueries();

    await new RecordSearchQueryUseCase(queries, new FixedClock()).execute({
      term: ' a ',
      resultCount: 5,
    });

    expect(queries.saved).toHaveLength(0);
  });
});

describe('GetSearchesPerDayUseCase', () => {
  it('fills days without searches with zeros, oldest day first', async () => {
    const queries = new InMemoryQueries([
      { date: '2026-10-11', searches: 4, noResultSearches: 1 },
      { date: '2026-10-13', searches: 2, noResultSearches: 0 },
    ]);

    const result = await new GetSearchesPerDayUseCase(queries, new FixedClock()).execute({
      days: 4,
    });

    expect(result).toEqual([
      { date: '2026-10-10', searches: 0, noResultSearches: 0 },
      { date: '2026-10-11', searches: 4, noResultSearches: 1 },
      { date: '2026-10-12', searches: 0, noResultSearches: 0 },
      { date: '2026-10-13', searches: 2, noResultSearches: 0 },
    ]);
  });

  it('ignores recorded days outside the requested window', async () => {
    const queries = new InMemoryQueries([{ date: '2026-09-01', searches: 9, noResultSearches: 9 }]);

    const result = await new GetSearchesPerDayUseCase(queries, new FixedClock()).execute({
      days: 2,
    });

    expect(result.map((row) => row.searches)).toEqual([0, 0]);
  });

  it('asks the repository for the period that ends now', async () => {
    const queries = new InMemoryQueries();

    await new GetSearchesPerDayUseCase(queries, new FixedClock()).execute({ days: 14 });

    expect(queries.lastSince).toEqual(new Date('2026-09-29T08:00:00Z'));
  });
});

describe('GetTopSearchTermsUseCase', () => {
  it('passes the limit, the period and the no-results filter through', async () => {
    const terms = [{ term: 'sushi', searches: 6, noResultSearches: 6 }];
    const queries = new InMemoryQueries([], terms);

    const result = await new GetTopSearchTermsUseCase(queries, new FixedClock()).execute({
      limit: 5,
      days: 30,
      noResultsOnly: true,
    });

    expect(result).toBe(terms);
    expect(queries.lastTopTerms).toEqual({
      limit: 5,
      since: new Date('2026-09-13T08:00:00Z'),
      noResultsOnly: true,
    });
  });
});
