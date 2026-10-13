import { Injectable } from '@nestjs/common';
import { Clock } from '../../../../shared/application/clock.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import { SearchLog } from '../../domain/search-log.entity.js';
import { SearchLogRepository } from '../../domain/search-log.repository.js';

export interface RecordSearchInput {
  tenantId: string;
  query: string;
}

@Injectable()
export class RecordSearchUseCase implements UseCase<RecordSearchInput, void> {
  constructor(
    private readonly logs: SearchLogRepository,
    private readonly clock: Clock,
  ) {}

  async execute({ tenantId, query }: RecordSearchInput): Promise<void> {
    await this.logs.save(
      SearchLog.create({ tenantId, query, createdAt: this.clock.now() }),
    );
  }
}
