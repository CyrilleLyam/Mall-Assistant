import { Injectable } from '@nestjs/common';
import type { Page, PageRequest } from '../../../../shared/application/page.js';
import { UseCase } from '../../../../shared/application/use-case.js';
import { Tenant } from '../../domain/tenant.entity.js';
import {
  TenantRepository,
  TenantSearchCriteria,
} from '../../domain/tenant.repository.js';

export type SearchTenantsInput = TenantSearchCriteria & PageRequest;

@Injectable()
export class SearchTenantsUseCase
  implements UseCase<SearchTenantsInput, Page<Tenant>>
{
  constructor(private readonly tenants: TenantRepository) {}

  execute({ page, pageSize, ...criteria }: SearchTenantsInput): Promise<Page<Tenant>> {
    return this.tenants.searchPage(criteria, { page, pageSize });
  }
}
