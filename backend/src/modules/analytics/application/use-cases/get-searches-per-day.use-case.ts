import { Injectable } from '@nestjs/common';
import { Clock } from '../../../../shared/application/clock.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import {
  DailySearchCount,
  SearchLogRepository,
} from '../../domain/search-log.repository.js';

export interface GetSearchesPerDayInput {
  days: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class GetSearchesPerDayUseCase
  implements UseCase<GetSearchesPerDayInput, DailySearchCount[]>
{
  constructor(
    private readonly logs: SearchLogRepository,
    private readonly clock: Clock,
  ) {}

  execute({ days }: GetSearchesPerDayInput): Promise<DailySearchCount[]> {
    const since = new Date(this.clock.now().getTime() - days * MS_PER_DAY);
    return this.logs.searchesPerDay(since);
  }
}
