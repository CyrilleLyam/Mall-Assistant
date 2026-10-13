import { Injectable } from '@nestjs/common';
import { Clock } from '../../../../shared/application/clock.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import {
  SearchLogRepository,
  TopSearch,
} from '../../domain/search-log.repository.js';

export interface GetTopSearchesInput {
  limit: number;
  days: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class GetTopSearchesUseCase
  implements UseCase<GetTopSearchesInput, TopSearch[]>
{
  constructor(
    private readonly logs: SearchLogRepository,
    private readonly clock: Clock,
  ) {}

  execute({ limit, days }: GetTopSearchesInput): Promise<TopSearch[]> {
    const since = new Date(this.clock.now().getTime() - days * MS_PER_DAY);
    return this.logs.topSearches(limit, since);
  }
}
