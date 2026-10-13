import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Page, PageRequest } from '../../../../shared/application/page.js';
import { Tenant } from '../../domain/tenant.entity.js';
import {
  TenantRepository,
  TenantSearchCriteria,
} from '../../domain/tenant.repository.js';
import { TenantMapper } from './tenant.mapper.js';
import { TenantOrmEntity } from './tenant.orm-entity.js';

const escapeLike = (text: string): string => text.replace(/[\\%_]/g, '\\$&');

@Injectable()
export class TypeOrmTenantRepository extends TenantRepository {
  constructor(
    @InjectRepository(TenantOrmEntity)
    private readonly rows: Repository<TenantOrmEntity>,
  ) {
    super();
  }

  async search(criteria: TenantSearchCriteria): Promise<Tenant[]> {
    const rows = await this.buildSearch(criteria).getMany();
    return rows.map((item) => TenantMapper.toDomain(item));
  }

  async searchPage(
    criteria: TenantSearchCriteria,
    { page, pageSize }: PageRequest,
  ): Promise<Page<Tenant>> {
    const [rows, totalItems] = await this.buildSearch(criteria)
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      items: rows.map((item) => TenantMapper.toDomain(item)),
      totalItems,
      page,
      pageSize,
    };
  }

  async listFloors(): Promise<number[]> {
    const rows = await this.rows
      .createQueryBuilder('t')
      .select('t.floor', 'floor')
      .distinct(true)
      .orderBy('t.floor', 'ASC')
      .getRawMany<{ floor: number }>();
    return rows.map((row) => row.floor);
  }

  async findById(id: string): Promise<Tenant | null> {
    const row = await this.rows.findOneBy({ id });
    return row ? TenantMapper.toDomain(row) : null;
  }

  async save(tenant: Tenant): Promise<void> {
    await this.rows.save(TenantMapper.toPersistence(tenant));
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.rows.delete({ id });
    return (result.affected ?? 0) > 0;
  }

  private buildSearch({ search, categoryId, floor }: TenantSearchCriteria) {
    const query = this.rows.createQueryBuilder('t');

    const term = search?.trim();
    if (term) {
      query.andWhere('(t.nameEn ILIKE :term OR t.nameKm ILIKE :term)', {
        term: `%${escapeLike(term)}%`,
      });
    }
    if (categoryId) {
      query.andWhere('t.categoryId = :categoryId', { categoryId });
    }
    if (floor !== undefined) {
      query.andWhere('t.floor = :floor', { floor });
    }

    return query.orderBy('t.nameEn', 'ASC').addOrderBy('t.id', 'ASC');
  }
}
