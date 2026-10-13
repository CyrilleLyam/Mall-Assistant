import { SearchQuery } from './search-query.entity.js';

export interface TopSearchTerm {
  term: string;
  searches: number;
  noResultSearches: number;
}

export interface DailySearchCount {
  date: string;
  searches: number;
  noResultSearches: number;
}

export interface TopTermsCriteria {
  limit: number;
  since: Date;
  noResultsOnly: boolean;
}

export abstract class SearchQueryRepository {
  abstract save(query: SearchQuery): Promise<void>;
  abstract topTerms(criteria: TopTermsCriteria): Promise<TopSearchTerm[]>;
  abstract searchesPerDay(since: Date): Promise<DailySearchCount[]>;
}
