import { Injectable } from '@nestjs/common';
import { Clock } from '../../../../shared/application/clock.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import { SearchQuery } from '../../domain/search-query.entity.js';
import { SearchQueryRepository } from '../../domain/search-query.repository.js';

export interface RecordSearchQueryInput {
  term: string;
  resultCount: number;
}

@Injectable()
export class RecordSearchQueryUseCase
  implements UseCase<RecordSearchQueryInput, void>
{
  constructor(
    private readonly queries: SearchQueryRepository,
    private readonly clock: Clock,
  ) {}

  async execute({ term, resultCount }: RecordSearchQueryInput): Promise<void> {
    if (!SearchQuery.isTrackable(term)) {
      return;
    }
    await this.queries.save(
      SearchQuery.create({ term, resultCount, createdAt: this.clock.now() }),
    );
  }
}
