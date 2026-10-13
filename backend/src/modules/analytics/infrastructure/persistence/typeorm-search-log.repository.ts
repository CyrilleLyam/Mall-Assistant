import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchLog } from '../../domain/search-log.entity.js';
import {
  DailySearchCount,
  SearchLogRepository,
  TopSearch,
} from '../../domain/search-log.repository.js';
import { SearchLogOrmEntity } from './search-log.orm-entity.js';

@Injectable()
export class TypeOrmSearchLogRepository extends SearchLogRepository {
  private readonly timeZone: string;

  constructor(
    @InjectRepository(SearchLogOrmEntity)
    private readonly rows: Repository<SearchLogOrmEntity>,
    config: ConfigService,
  ) {
    super();
    this.timeZone = config.get<string>('APP_TIMEZONE') ?? 'Asia/Phnom_Penh';
  }

  async save(log: SearchLog): Promise<void> {
    await this.rows.insert({
      id: log.id,
      tenantId: log.tenantId,
      query: log.query,
      createdAt: log.createdAt,
    });
  }

  async topSearches(limit: number, since: Date): Promise<TopSearch[]> {
    const raw = await this.rows
      .createQueryBuilder('s')
      .innerJoin('s.tenant', 't')
      .select('s.tenantId', 'tenantId')
      .addSelect('t.nameEn', 'nameEn')
      .addSelect('t.nameKm', 'nameKm')
      .addSelect('COUNT(*)', 'searches')
      .where('s.createdAt >= :since', { since })
      .groupBy('s.tenantId')
      .addGroupBy('t.nameEn')
      .addGroupBy('t.nameKm')
      .orderBy('searches', 'DESC')
      .limit(limit)
      .getRawMany<{
        tenantId: string;
        nameEn: string;
        nameKm: string;
        searches: string;
      }>();

    return raw.map((row) => ({ ...row, searches: Number(row.searches) }));
  }

  async searchesPerDay(since: Date): Promise<DailySearchCount[]> {
    const raw = await this.rows
      .createQueryBuilder('s')
      .select(
        `to_char(s.created_at AT TIME ZONE :tz, 'YYYY-MM-DD')`,
        'date',
      )
      .addSelect('COUNT(*)', 'searches')
      .where('s.createdAt >= :since', { since })
      .setParameter('tz', this.timeZone)
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany<{ date: string; searches: string }>();

    return raw.map((row) => ({
      date: row.date,
      searches: Number(row.searches),
    }));
  }
}
