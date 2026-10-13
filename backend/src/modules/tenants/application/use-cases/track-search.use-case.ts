import { Injectable, Logger } from '@nestjs/common';
import { UseCase } from '../../../../shared/application/use-case.js';
import { TenantRepository } from '../../domain/tenant.repository.js';
import { SearchQueryRecorder } from '../ports/search-query-recorder.js';

export interface TrackSearchInput {
  term: string;
}

@Injectable()
export class TrackSearchUseCase implements UseCase<TrackSearchInput, void> {
  private readonly logger = new Logger(TrackSearchUseCase.name);

  constructor(
    private readonly tenants: TenantRepository,
    private readonly recorder: SearchQueryRecorder,
  ) {}

  async execute({ term }: TrackSearchInput): Promise<void> {
    try {
      const { totalItems } = await this.tenants.searchPage(
        { search: term },
        { page: 1, pageSize: 1 },
      );
      await this.recorder.record(term, totalItems);
    } catch (error) {
      this.logger.warn(`Could not record search: ${String(error)}`);
    }
  }
}
