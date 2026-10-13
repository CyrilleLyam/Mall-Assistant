import { Injectable } from '@nestjs/common';
import { RecordSearchQueryUseCase } from '../../../analytics/application/use-cases/record-search-query.use-case.js';
import { SearchQueryRecorder } from '../../application/ports/search-query-recorder.js';

@Injectable()
export class AnalyticsSearchQueryRecorder extends SearchQueryRecorder {
  constructor(private readonly recordSearchQuery: RecordSearchQueryUseCase) {
    super();
  }

  record(term: string, resultCount: number): Promise<void> {
    return this.recordSearchQuery.execute({ term, resultCount });
  }
}
