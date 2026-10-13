import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Page, PageRequest } from '../../../../shared/application/page.js';
import { MallEvent } from '../../domain/mall-event.entity.js';
import {
  MallEventListCriteria,
  MallEventRepository,
} from '../../domain/mall-event.repository.js';
import { MallEventMapper } from './mall-event.mapper.js';
import { MallEventOrmEntity } from './mall-event.orm-entity.js';

@Injectable()
export class TypeOrmMallEventRepository extends MallEventRepository {
  constructor(
    @InjectRepository(MallEventOrmEntity)
    private readonly rows: Repository<MallEventOrmEntity>,
  ) {
    super();
  }

  async list(criteria: MallEventListCriteria): Promise<MallEvent[]> {
    const rows = await this.buildList(criteria).getMany();
    return rows.map((item) => MallEventMapper.toDomain(item));
  }

  async listPage(
    criteria: MallEventListCriteria,
    { page, pageSize }: PageRequest,
  ): Promise<Page<MallEvent>> {
    const [rows, totalItems] = await this.buildList(criteria)
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      items: rows.map((item) => MallEventMapper.toDomain(item)),
      totalItems,
      page,
      pageSize,
    };
  }

  async findById(id: string): Promise<MallEvent | null> {
    const row = await this.rows.findOneBy({ id });
    return row ? MallEventMapper.toDomain(row) : null;
  }

  async save(event: MallEvent): Promise<void> {
    await this.rows.save(MallEventMapper.toPersistence(event));
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.rows.delete({ id });
    return (result.affected ?? 0) > 0;
  }

  private buildList({ status, today }: MallEventListCriteria) {
    const query = this.rows.createQueryBuilder('e');

    if (status === 'current') {
      query.where('e.startDate <= :today AND e.endDate >= :today', { today });
    } else if (status === 'upcoming') {
      query.where('e.startDate > :today', { today });
    }

    return query
      .orderBy('e.startDate', 'ASC')
      .addOrderBy('e.titleEn', 'ASC')
      .addOrderBy('e.id', 'ASC');
  }
}
