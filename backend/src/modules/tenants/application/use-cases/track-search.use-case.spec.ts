import type { Page, PageRequest } from '../../../../shared/application/page.js';
import { Tenant } from '../../domain/tenant.entity.js';
import {
  TenantRepository,
  TenantSearchCriteria,
} from '../../domain/tenant.repository.js';
import { SearchQueryRecorder } from '../ports/search-query-recorder.js';
import { TrackSearchUseCase } from './track-search.use-case.js';

class CountingTenants extends TenantRepository {
  received: { criteria: TenantSearchCriteria; page: PageRequest } | null = null;

  constructor(private readonly totalItems: number) {
    super();
  }

  async searchPage(criteria: TenantSearchCriteria, page: PageRequest): Promise<Page<Tenant>> {
    this.received = { criteria, page };
    return { items: [], totalItems: this.totalItems, ...page };
  }

  async search(): Promise<Tenant[]> {
    return [];
  }

  async listFloors(): Promise<number[]> {
    return [];
  }

  async findById(): Promise<Tenant | null> {
    return null;
  }

  async save(): Promise<void> {}

  async delete(): Promise<boolean> {
    return false;
  }
}

class RecordingRecorder extends SearchQueryRecorder {
  recorded: Array<{ term: string; resultCount: number }> = [];

  async record(term: string, resultCount: number): Promise<void> {
    this.recorded.push({ term, resultCount });
  }
}

class BrokenRecorder extends SearchQueryRecorder {
  async record(): Promise<void> {
    throw new Error('database is down');
  }
}

describe('TrackSearchUseCase', () => {
  it('counts the results itself and records the term with that count', async () => {
    const tenants = new CountingTenants(4);
    const recorder = new RecordingRecorder();

    await new TrackSearchUseCase(tenants, recorder).execute({ term: 'pharm' });

    expect(tenants.received).toEqual({
      criteria: { search: 'pharm' },
      page: { page: 1, pageSize: 1 },
    });
    expect(recorder.recorded).toEqual([{ term: 'pharm', resultCount: 4 }]);
  });

  it('records a search that found nothing with a zero count', async () => {
    const recorder = new RecordingRecorder();

    await new TrackSearchUseCase(new CountingTenants(0), recorder).execute({ term: 'sushi' });

    expect(recorder.recorded).toEqual([{ term: 'sushi', resultCount: 0 }]);
  });

  it('never fails the request when recording fails', async () => {
    await expect(
      new TrackSearchUseCase(new CountingTenants(1), new BrokenRecorder()).execute({ term: 'zara' }),
    ).resolves.toBeUndefined();
  });
});
