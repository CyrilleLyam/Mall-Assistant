import { Injectable } from '@nestjs/common';
import { RecordSearchUseCase } from '../../../analytics/application/use-cases/record-search.use-case.js';
import { SearchRecorder } from '../../application/ports/search-recorder.js';

@Injectable()
export class AnalyticsSearchRecorder extends SearchRecorder {
  constructor(private readonly recordSearch: RecordSearchUseCase) {
    super();
  }

  record(tenantId: string, query: string): Promise<void> {
    return this.recordSearch.execute({ tenantId, query });
  }
}
