import { Injectable } from '@nestjs/common';
import { Clock } from '../../../../shared/application/clock.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import {
  SearchQueryRepository,
  TopSearchTerm,
} from '../../domain/search-query.repository.js';

export interface GetTopSearchTermsInput {
  limit: number;
  days: number;
  noResultsOnly: boolean;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class GetTopSearchTermsUseCase
  implements UseCase<GetTopSearchTermsInput, TopSearchTerm[]>
{
  constructor(
    private readonly queries: SearchQueryRepository,
    private readonly clock: Clock,
  ) {}

  execute({ limit, days, noResultsOnly }: GetTopSearchTermsInput): Promise<TopSearchTerm[]> {
    const since = new Date(this.clock.now().getTime() - days * MS_PER_DAY);
    return this.queries.topTerms({ limit, since, noResultsOnly });
  }
}
