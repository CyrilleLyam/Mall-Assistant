import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchLog } from '../../domain/search-log.entity.js';
import {
  SearchLogRepository,
  TopSearch,
} from '../../domain/search-log.repository.js';
import { SearchLogOrmEntity } from './search-log.orm-entity.js';

@Injectable()
export class TypeOrmSearchLogRepository extends SearchLogRepository {
  constructor(
    @InjectRepository(SearchLogOrmEntity)
    private readonly rows: Repository<SearchLogOrmEntity>,
  ) {
    super();
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
}
