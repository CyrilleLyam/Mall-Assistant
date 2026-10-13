export class TopSearchResponse {
  tenantId: string;
  nameEn: string;
  nameKm: string;
  searches: number;
}

export class TopTermResponse {
  term: string;
  searches: number;
  noResultSearches: number;
}

export class DailySearchCountResponse {
  date: string;
  searches: number;
  noResultSearches: number;
}
