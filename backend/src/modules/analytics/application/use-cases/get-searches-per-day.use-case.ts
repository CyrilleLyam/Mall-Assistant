import { Injectable } from '@nestjs/common';
import { Clock } from '../../../../shared/application/clock.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import {
  DailySearchCount,
  SearchQueryRepository,
} from '../../domain/search-query.repository.js';
import { lastDays } from '../last-days.js';

export interface GetSearchesPerDayInput {
  days: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class GetSearchesPerDayUseCase
  implements UseCase<GetSearchesPerDayInput, DailySearchCount[]>
{
  constructor(
    private readonly queries: SearchQueryRepository,
    private readonly clock: Clock,
  ) {}

  async execute({ days }: GetSearchesPerDayInput): Promise<DailySearchCount[]> {
    const since = new Date(this.clock.now().getTime() - days * MS_PER_DAY);
    const recorded = await this.queries.searchesPerDay(since);
    const byDate = new Map(recorded.map((row) => [row.date, row]));

    return lastDays(this.clock.today(), days).map(
      (date) => byDate.get(date) ?? { date, searches: 0, noResultSearches: 0 },
    );
  }
}
