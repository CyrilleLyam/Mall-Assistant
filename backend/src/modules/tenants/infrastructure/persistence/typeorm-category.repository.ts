import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../domain/category.entity.js';
import { CategoryRepository } from '../../domain/category.repository.js';
import { CategoryOrmEntity } from './category.orm-entity.js';
import { CategoryMapper } from './tenant.mapper.js';

@Injectable()
export class TypeOrmCategoryRepository extends CategoryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly rows: Repository<CategoryOrmEntity>,
  ) {
    super();
  }

  async findAll(): Promise<Category[]> {
    const rows = await this.rows.find({ order: { nameEn: 'ASC' } });
    return rows.map((item) => CategoryMapper.toDomain(item));
  }

  async findById(id: string): Promise<Category | null> {
    const row = await this.rows.findOneBy({ id });
    return row ? CategoryMapper.toDomain(row) : null;
  }
}
