import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchQuery } from '../../domain/search-query.entity.js';
import {
  DailySearchCount,
  SearchQueryRepository,
  TopSearchTerm,
  TopTermsCriteria,
} from '../../domain/search-query.repository.js';
import { SearchQueryOrmEntity } from './search-query.orm-entity.js';

const NO_RESULT_COUNT = 'COUNT(*) FILTER (WHERE q.result_count = 0)';

@Injectable()
export class TypeOrmSearchQueryRepository extends SearchQueryRepository {
  private readonly timeZone: string;

  constructor(
    @InjectRepository(SearchQueryOrmEntity)
    private readonly rows: Repository<SearchQueryOrmEntity>,
    config: ConfigService,
  ) {
    super();
    this.timeZone = config.get<string>('APP_TIMEZONE') ?? 'Asia/Phnom_Penh';
  }

  async save(query: SearchQuery): Promise<void> {
    await this.rows.insert({
      id: query.id,
      term: query.term,
      resultCount: query.resultCount,
      createdAt: query.createdAt,
    });
  }

  async topTerms({ limit, since, noResultsOnly }: TopTermsCriteria): Promise<TopSearchTerm[]> {
    const query = this.rows
      .createQueryBuilder('q')
      .select('q.term', 'term')
      .addSelect('COUNT(*)', 'searches')
      .addSelect(NO_RESULT_COUNT, 'noResultSearches')
      .where('q.createdAt >= :since', { since });

    if (noResultsOnly) {
      query.andWhere('q.resultCount = 0');
    }

    const raw = await query
      .groupBy('q.term')
      .orderBy('searches', 'DESC')
      .addOrderBy('q.term', 'ASC')
      .limit(limit)
      .getRawMany<{ term: string; searches: string; noResultSearches: string }>();

    return raw.map((row) => ({
      term: row.term,
      searches: Number(row.searches),
      noResultSearches: Number(row.noResultSearches),
    }));
  }

  async searchesPerDay(since: Date): Promise<DailySearchCount[]> {
    const raw = await this.rows
      .createQueryBuilder('q')
      .select(`to_char(q.created_at AT TIME ZONE :tz, 'YYYY-MM-DD')`, 'date')
      .addSelect('COUNT(*)', 'searches')
      .addSelect(NO_RESULT_COUNT, 'noResultSearches')
      .where('q.createdAt >= :since', { since })
      .setParameter('tz', this.timeZone)
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany<{ date: string; searches: string; noResultSearches: string }>();

    return raw.map((row) => ({
      date: row.date,
      searches: Number(row.searches),
      noResultSearches: Number(row.noResultSearches),
    }));
  }
}
