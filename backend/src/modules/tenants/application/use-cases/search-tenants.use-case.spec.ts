import type { Page, PageRequest } from '../../../../shared/application/page.js';
import { Tenant } from '../../domain/tenant.entity.js';
import {
  TenantRepository,
  TenantSearchCriteria,
} from '../../domain/tenant.repository.js';
import { SearchTenantsUseCase } from './search-tenants.use-case.js';

class RecordingTenants extends TenantRepository {
  received: { criteria: TenantSearchCriteria; page: PageRequest } | null = null;

  async searchPage(criteria: TenantSearchCriteria, page: PageRequest): Promise<Page<Tenant>> {
    this.received = { criteria, page };
    return { items: [], totalItems: 0, ...page };
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

describe('SearchTenantsUseCase', () => {
  it('separates the page request from the search criteria', async () => {
    const tenants = new RecordingTenants();

    const result = await new SearchTenantsUseCase(tenants).execute({
      search: 'pharm',
      floor: 2,
      page: 3,
      pageSize: 12,
    });

    expect(tenants.received).toEqual({
      criteria: { search: 'pharm', floor: 2 },
      page: { page: 3, pageSize: 12 },
    });
    expect(result).toMatchObject({ page: 3, pageSize: 12, totalItems: 0 });
  });
});
