import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/user.entity.js';
import { UserRepository } from '../../domain/user.repository.js';
import { UserMapper } from './user.mapper.js';
import { UserOrmEntity } from './user.orm-entity.js';

@Injectable()
export class TypeOrmUserRepository extends UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly rows: Repository<UserOrmEntity>,
  ) {
    super();
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.rows.findOneBy({ email });
    return row ? UserMapper.toDomain(row) : null;
  }

  async save(user: User): Promise<void> {
    await this.rows.save(UserMapper.toPersistence(user));
  }
}
