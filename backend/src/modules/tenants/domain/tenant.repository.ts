import type { Page, PageRequest } from '../../../shared/application/page.js';
import { Tenant } from './tenant.entity.js';

export interface TenantSearchCriteria {
  search?: string;
  categoryId?: string;
  floor?: number;
}

export abstract class TenantRepository {
  abstract search(criteria: TenantSearchCriteria): Promise<Tenant[]>;
  abstract searchPage(
    criteria: TenantSearchCriteria,
    page: PageRequest,
  ): Promise<Page<Tenant>>;
  abstract listFloors(): Promise<number[]>;
  abstract findById(id: string): Promise<Tenant | null>;
  abstract save(tenant: Tenant): Promise<void>;
  abstract delete(id: string): Promise<boolean>;
}
