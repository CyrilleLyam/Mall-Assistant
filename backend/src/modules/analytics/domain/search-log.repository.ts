import { SearchLog } from './search-log.entity.js';

export interface TopSearch {
  tenantId: string;
  nameEn: string;
  nameKm: string;
  searches: number;
}

export interface DailySearchCount {
  date: string;
  searches: number;
}

export abstract class SearchLogRepository {
  abstract save(log: SearchLog): Promise<void>;
  abstract topSearches(limit: number, since: Date): Promise<TopSearch[]>;
  abstract searchesPerDay(since: Date): Promise<DailySearchCount[]>;
}
